"""phone-assist 状态与唤起缓存：线程安全持久化「手机」项目、受管会话集合与 10 分钟手动续上候选。"""
from __future__ import annotations

import asyncio
from collections import OrderedDict
from dataclasses import asdict, dataclass, field
from datetime import UTC, datetime
import json
import logging
from pathlib import Path
import threading
import time
import uuid

from plugins.ledger.contract import AttachmentRef

logger = logging.getLogger(__name__)

DEFAULT_PROJECT_ID = "p_70686f6e655f61737369737400000001"
DEFAULT_PROJECT_NAME = "手机"
DEFAULT_RESUME_WINDOW_SECONDS = 600
INVOKE_TTL_SECONDS = 1800
MAX_INVOKES = 32
MAX_MANAGED_SESSIONS = 256


@dataclass(slots=True)
class LastSessionRecord:
    session_id: str
    title: str
    package_name: str
    app_label: str
    updated_at: float

    def to_dict(self) -> dict[str, object]:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: dict[str, object]) -> LastSessionRecord | None:
        sid = data.get("session_id")
        if not isinstance(sid, str) or not sid.startswith("akashic:"):
            return None
        updated = data.get("updated_at")
        if not isinstance(updated, (int, float)):
            return None
        return cls(
            session_id=sid,
            title=str(data.get("title") or "上次看屏对话"),
            package_name=str(data.get("package_name") or ""),
            app_label=str(data.get("app_label") or ""),
            updated_at=float(updated),
        )


@dataclass(slots=True)
class InvokeRecord:
    invoke_id: str
    source: str
    package_name: str
    app_label: str
    captured_at: str
    created_at: float
    ui_tree_text: str
    attachment_ref: AttachmentRef | None
    screenshot_preview_b64: str | None
    project_id: str | None
    project_name: str
    new_session_id: str
    allowed_resume_session_id: str | None
    allowed_resume_title: str | None
    allowed_resume_deadline: float
    used_attachment: bool = False
    send_lock: asyncio.Lock = field(default_factory=asyncio.Lock)
    seen_client_ids: dict[str, dict[str, object]] = field(default_factory=dict)

    def is_expired(self, now: float | None = None) -> bool:
        t = time.time() if now is None else now
        return (t - self.created_at) > INVOKE_TTL_SECONDS

    def resume_candidate(self, now: float | None = None) -> dict[str, object] | None:
        t = time.time() if now is None else now
        if not self.allowed_resume_session_id or t > self.allowed_resume_deadline:
            return None
        return {
            "session_id": self.allowed_resume_session_id,
            "title": self.allowed_resume_title or "上次看屏对话",
        }

    def is_session_allowed(self, session_id: str, now: float | None = None) -> bool:
        if session_id == self.new_session_id:
            return True
        cand = self.resume_candidate(now)
        return cand is not None and cand["session_id"] == session_id

    def public_dict(self) -> dict[str, object]:
        return {
            "invoke_id": self.invoke_id,
            "source": self.source,
            "package_name": self.package_name,
            "app_label": self.app_label,
            "captured_at": self.captured_at,
            "has_screenshot": self.attachment_ref is not None,
            "artifact_id": self.attachment_ref.artifact_id if self.attachment_ref else None,
            "screenshot_preview_b64": self.screenshot_preview_b64,
            "has_ui_tree": bool(self.ui_tree_text),
            "project_id": self.project_id,
            "project_name": self.project_name,
            "new_session_id": self.new_session_id,
            "resume_candidate": self.resume_candidate(),
        }


class AssistStore:
    def __init__(
        self,
        data_root: Path,
        *,
        project_id: str = DEFAULT_PROJECT_ID,
        project_name: str = DEFAULT_PROJECT_NAME,
        resume_window_seconds: int = DEFAULT_RESUME_WINDOW_SECONDS,
    ) -> None:
        self._state_path = data_root / "state.json"
        self.project_id = project_id
        self.project_name = project_name
        self.resume_window_seconds = max(60, int(resume_window_seconds))
        self._io_lock = threading.Lock()
        self._last_session: LastSessionRecord | None = None
        self._managed_sessions: OrderedDict[str, float] = OrderedDict()
        self._invokes: OrderedDict[str, InvokeRecord] = OrderedDict()

    def load_sync(self) -> None:
        with self._io_lock:
            if not self._state_path.is_file():
                return
            try:
                raw = json.loads(self._state_path.read_text(encoding="utf-8"))
            except Exception as err:
                logger.warning("读取 phone-assist state.json 失败，已忽略: %s", err)
                return
            if not isinstance(raw, dict):
                return
            last = raw.get("last_session")
            if isinstance(last, dict):
                self._last_session = LastSessionRecord.from_dict(last)
            managed = raw.get("managed_sessions")
            if isinstance(managed, list):
                now = time.time()
                for sid in managed:
                    if isinstance(sid, str) and sid.startswith("akashic:"):
                        self._managed_sessions[sid] = now
            if self._last_session is not None:
                self._managed_sessions[self._last_session.session_id] = self._last_session.updated_at

    def _save_locked(self) -> None:
        self._state_path.parent.mkdir(parents=True, exist_ok=True)
        payload = {
            "project_id": self.project_id,
            "project_name": self.project_name,
            "last_session": self._last_session.to_dict() if self._last_session else None,
            "managed_sessions": list(self._managed_sessions.keys())[-MAX_MANAGED_SESSIONS:],
            "saved_at": datetime.now(UTC).isoformat(),
        }
        tmp = self._state_path.with_name(f"state.{uuid.uuid4().hex}.tmp")
        try:
            tmp.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
            tmp.replace(self._state_path)
        finally:
            tmp.unlink(missing_ok=True)

    def _prune_invokes(self) -> None:
        now = time.time()
        expired = [k for k, v in self._invokes.items() if v.is_expired(now)]
        for k in expired:
            self._invokes.pop(k, None)
        while len(self._invokes) > MAX_INVOKES:
            self._invokes.popitem(last=False)

    def create_invoke(
        self,
        *,
        source: str,
        package_name: str,
        app_label: str,
        captured_at: str,
        ui_tree_text: str,
        attachment_ref: AttachmentRef | None,
        screenshot_preview_b64: str | None,
        project_id: str | None,
    ) -> InvokeRecord:
        self._prune_invokes()
        now = time.time()
        invoke_id = f"inv_{uuid.uuid4().hex[:16]}"
        new_session_id = f"akashic:{uuid.uuid4().hex}"

        allowed_resume_sid: str | None = None
        allowed_resume_title: str | None = None
        allowed_resume_deadline = 0.0
        with self._io_lock:
            last = self._last_session
            if last is not None and 0 <= (now - last.updated_at) <= self.resume_window_seconds:
                allowed_resume_sid = last.session_id
                allowed_resume_title = last.title
                allowed_resume_deadline = last.updated_at + self.resume_window_seconds
            self._managed_sessions[new_session_id] = now
            while len(self._managed_sessions) > MAX_MANAGED_SESSIONS:
                self._managed_sessions.popitem(last=False)

        record = InvokeRecord(
            invoke_id=invoke_id,
            source=source,
            package_name=package_name,
            app_label=app_label,
            captured_at=captured_at,
            created_at=now,
            ui_tree_text=ui_tree_text[:6000],
            attachment_ref=attachment_ref,
            screenshot_preview_b64=screenshot_preview_b64,
            project_id=project_id,
            project_name=self.project_name,
            new_session_id=new_session_id,
            allowed_resume_session_id=allowed_resume_sid,
            allowed_resume_title=allowed_resume_title,
            allowed_resume_deadline=allowed_resume_deadline,
        )
        self._invokes[invoke_id] = record
        return record

    def get_invoke(self, invoke_id: str) -> InvokeRecord | None:
        self._prune_invokes()
        rec = self._invokes.get(invoke_id)
        if rec is None or rec.is_expired():
            self._invokes.pop(invoke_id, None)
            return None
        return rec

    def is_managed_session(self, session_id: str) -> bool:
        if not session_id.startswith("akashic:"):
            return False
        with self._io_lock:
            return session_id in self._managed_sessions

    def record_session_activity_sync(
        self,
        *,
        session_id: str,
        title: str,
        package_name: str = "",
        app_label: str = "",
    ) -> None:
        clean_title = " ".join(title.strip().split())[:28] or "看屏对话"
        now = time.time()
        with self._io_lock:
            self._managed_sessions[session_id] = now
            self._managed_sessions.move_to_end(session_id)
            while len(self._managed_sessions) > MAX_MANAGED_SESSIONS:
                self._managed_sessions.popitem(last=False)
            if self._last_session is None or now >= self._last_session.updated_at:
                self._last_session = LastSessionRecord(
                    session_id=session_id,
                    title=clean_title,
                    package_name=package_name,
                    app_label=app_label,
                    updated_at=now,
                )
            self._save_locked()
