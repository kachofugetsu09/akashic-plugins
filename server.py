"""phone-assist HTTP 服务端：接收端侧看屏唤起、管理「手机」项目会话与半屏浮层 SSE 流。"""
from __future__ import annotations

import asyncio
import base64
from collections.abc import AsyncGenerator, Awaitable, Callable, Generator
from contextlib import contextmanager, suppress
from dataclasses import dataclass
from datetime import UTC, datetime
import json
import logging
import os
from pathlib import Path
import socket
import tempfile
from typing import Any
import uuid

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse, JSONResponse, StreamingResponse
import uvicorn

from agent.plugin_composition import Context
from core.common.file_io import run_file_io
from core.common.unix_socket import prepare_unix_socket, socket_alias_path
from plugins.channels.contract import CHANNEL_INPUT_V2, CHANNEL_STEER, ChannelInboundMessage
from plugins.ledger.contract import (
    ARTIFACT_IMPORT,
    MESSAGE_CATALOG,
    AttachmentKind,
    AttachmentRef,
    ContentPart,
    Control,
    Input,
    Message,
    Output,
    ToolCall,
    ToolResult,
)
from plugins.ui.contract import PLUGIN_UI
try:
    from plugins.reply.contract import REPLY_STATUS
except ImportError:
    REPLY_STATUS = None  # type: ignore[assignment]

from .store import AssistStore

logger = logging.getLogger(__name__)
HEARTBEAT_SECONDS = 12.0
STREAM_POLL_SECONDS = 0.12
MAX_REQUEST_BODY_BYTES = 18 * 1024 * 1024
MAX_SCREENSHOT_BYTES = 12 * 1024 * 1024
MAX_SCREENSHOT_B64_CHARS = 16 * 1024 * 1024
MAX_HISTORY_MESSAGES = 80
PNG_SIGNATURE = b"\x89PNG\r\n\x1a\n"
JPEG_SIGNATURE = b"\xff\xd8\xff"
NO_STORE = {"Cache-Control": "no-store"}


class AssistListenerServer(uvicorn.Server):
    def __init__(self, config: uvicorn.Config) -> None:
        self._exit_loop: asyncio.AbstractEventLoop | None = None
        self._exit_event: asyncio.Event | None = None
        self._exit_requested = False
        super().__init__(config)
        self.ready = asyncio.Event()

    @contextmanager
    def capture_signals(self) -> Generator[None]:
        yield

    async def startup(self, sockets=None) -> None:
        await super().startup(sockets)
        self.ready.set()

    @property
    def should_exit(self) -> bool:
        return self._exit_requested

    @should_exit.setter
    def should_exit(self, value: bool) -> None:
        self._exit_requested = value
        loop, event = self._exit_loop, self._exit_event
        if value and loop is not None and event is not None and not loop.is_closed():
            _ = loop.call_soon_threadsafe(event.set)

    async def main_loop(self) -> None:
        self._exit_event = asyncio.Event()
        self._exit_loop = asyncio.get_running_loop()
        counter = 0
        should_exit = await self.on_tick(counter)
        while not should_exit:
            counter = (counter + 1) % 864000
            try:
                _ = await asyncio.wait_for(self._exit_event.wait(), timeout=0.1)
            except TimeoutError:
                pass
            should_exit = await self.on_tick(counter)


def _sse(event: str, payload: dict[str, object], *, event_id: str | None = None) -> bytes:
    data = json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
    prefix = f"id: {event_id}\n" if event_id is not None else ""
    return f"{prefix}event: {event}\ndata: {data}\n\n".encode("utf-8")


async def _read_bounded_json(request: Request, limit_bytes: int) -> dict[str, Any]:
    buf = bytearray()
    async for chunk in request.stream():
        buf.extend(chunk)
        if len(buf) > limit_bytes:
            raise HTTPException(status_code=413, detail="请求体过大")
    try:
        parsed = json.loads(buf.decode("utf-8"))
    except Exception as err:
        raise HTTPException(status_code=400, detail="无效的 JSON 载荷") from err
    if not isinstance(parsed, dict):
        raise HTTPException(status_code=400, detail="请求体必须是对象")
    return parsed


def _extract_message_view(
    msg: Message,
    call_names: dict[tuple[str, int], str],
) -> dict[str, object] | None:
    body = msg.body
    if isinstance(body, Input):
        texts = [
            str(p.value)
            for p in body.parts
            if isinstance(p, ContentPart) and p.kind == "text" and isinstance(p.value, str)
        ]
        has_img = any(isinstance(p, ContentPart) and p.kind == "artifact_ref" for p in body.parts)
        text = "\n".join(texts).strip()
        marker = "\n\n[用户提问]\n"
        if marker in text:
            text = text.split(marker, 1)[1].strip()
        return {
            "seq": msg.seq,
            "message_id": msg.message_id,
            "role": "user",
            "text": text,
            "has_image": has_img,
            "finish": "input",
        }
    if isinstance(body, Output):
        texts: list[str] = []
        tools: list[str] = []
        for idx, p in enumerate(body.parts):
            if isinstance(p, ToolCall):
                call_names[(msg.message_id, idx)] = p.name
                tools.append(p.name)
            elif isinstance(p, ContentPart):
                if p.kind == "text" and isinstance(p.value, str):
                    texts.append(p.value)
        return {
            "seq": msg.seq,
            "message_id": msg.message_id,
            "role": "assistant",
            "text": "\n".join(texts).strip(),
            "tools": tools,
            "finish": str(body.finish),
        }
    if isinstance(body, ToolResult):
        ref = body.call_ref
        tname = call_names.get((ref.message_id, ref.part_index), "tool")
        return {
            "seq": msg.seq,
            "message_id": msg.message_id,
            "role": "tool",
            "text": "",
            "tool_name": tname,
            "outcome": str(body.outcome),
            "is_error": body.outcome != "success",
            "finish": "tool_result",
        }
    if isinstance(body, Control):
        return {
            "seq": msg.seq,
            "message_id": msg.message_id,
            "role": "control",
            "text": str(getattr(body, "reason", "") or getattr(body, "kind", "")),
            "kind": str(getattr(body, "kind", "")),
            "finish": "control",
        }
    return None


async def _ensure_phone_project(ctx: Context, store: AssistStore) -> str | None:
    """软依赖 projects 插件：按 PLUGIN_UI.catalog() 真实字段（items[].id/revision）幂等创建「手机」项目。"""
    with ctx.borrow(PLUGIN_UI) as pui:
        if pui is None:
            return None
        try:
            catalog = await pui.catalog()
        except Exception as err:
            logger.warning("读取 plugin-ui catalog 失败，降级为普通会话: %s", err)
            return None
        items = catalog.get("items") if isinstance(catalog, dict) else None
        if not isinstance(items, list):
            return None
        proj_item = None
        for item in items:
            if not isinstance(item, dict):
                continue
            pid = str(item.get("id") or "")
            if pid == "projects" or pid.startswith("projects@"):
                proj_item = item
                break
        if proj_item is None:
            return None
        plugin_id = str(proj_item.get("id") or "")
        revision = str(proj_item.get("revision") or "")
        try:
            res = await pui.query(
                plugin_id,
                revision,
                "project.create",
                {"project_id": store.project_id, "name": store.project_name},
                session_id=None,
                turn_id=None,
            )
        except Exception as err:
            logger.warning("确保「手机」项目存在失败，降级为普通会话: %s", err)
            return None
        if not isinstance(res, dict):
            return None
        if res.get("id") != store.project_id or res.get("archived") is True:
            logger.warning("「手机」项目状态不可用于新建会话: %s", res)
            return None
        return store.project_id


async def _import_screenshot_b64(ctx: Context, b64_text: str) -> tuple[AttachmentRef | None, str | None]:
    raw_b64 = b64_text.strip()
    if not raw_b64:
        return None, None
    if "," in raw_b64 and raw_b64.startswith("data:"):
        raw_b64 = raw_b64.split(",", 1)[1]
    if len(raw_b64) > MAX_SCREENSHOT_B64_CHARS:
        raise HTTPException(status_code=413, detail="截图编码超过限制")

    def decode_and_write() -> tuple[Path, int]:
        try:
            png_bytes = base64.b64decode(raw_b64, validate=True)
        except Exception as err:
            raise ValueError(f"截图 base64 无效: {err}") from err
        if not png_bytes or len(png_bytes) > MAX_SCREENSHOT_BYTES:
            raise ValueError("截图为空或超过 12MB 限制")
        if png_bytes.startswith(PNG_SIGNATURE):
            suffix = ".png"
        elif png_bytes.startswith(JPEG_SIGNATURE):
            suffix = ".jpg"
        else:
            raise ValueError("截图必须是有效的 PNG 或 JPEG 文件")
        fd, name = tempfile.mkstemp(prefix="phone-assist-", suffix=suffix)
        p = Path(name)
        try:
            with os.fdopen(fd, "wb") as fh:
                fh.write(png_bytes)
        except BaseException:
            p.unlink(missing_ok=True)
            raise
        return p, len(png_bytes)

    try:
        tmp_path, _size = await run_file_io(decode_and_write)
    except ValueError as err:
        raise HTTPException(status_code=400, detail=str(err)) from err

    try:
        ref = await ctx.require(ARTIFACT_IMPORT).import_source(str(tmp_path), AttachmentKind.IMAGE)
    finally:
        await run_file_io(lambda: tmp_path.unlink(missing_ok=True))

    preview = raw_b64 if len(raw_b64) <= 260_000 else None
    return ref, preview


@dataclass(frozen=True, slots=True)
class AssistActions:
    """浮层路由与 self 命令共用的领域动作；拒绝以 HTTPException（状态码 + 原因）表达。"""

    resume: Callable[[], Awaitable[dict[str, object]]]
    ask: Callable[[dict[str, Any]], Awaitable[dict[str, object]]]
    invoke: Callable[[dict[str, Any]], Awaitable[dict[str, object]]]
    get_invoke: Callable[[str], Awaitable[dict[str, object]]]
    send: Callable[[dict[str, Any]], Awaitable[dict[str, object]]]
    history: Callable[[str], Awaitable[dict[str, object]]]


# 端侧浮条与半屏浮层的 HTTP 外壳：只读请求体与包响应头，动作本身在 AssistActions 里。
def _assist_routes(app: FastAPI, actions: AssistActions) -> None:
    @app.get("/api/phone-assist/resume")
    async def resume_info() -> JSONResponse:
        return JSONResponse(await actions.resume(), headers=NO_STORE)

    @app.post("/api/phone-assist/ask")
    async def quick_ask(request: Request) -> JSONResponse:
        body = await _read_bounded_json(request, MAX_REQUEST_BODY_BYTES)
        return JSONResponse(await actions.ask(body), headers=NO_STORE)

    @app.post("/api/phone-assist/invoke")
    async def invoke(request: Request) -> JSONResponse:
        body = await _read_bounded_json(request, MAX_REQUEST_BODY_BYTES)
        return JSONResponse(await actions.invoke(body), headers=NO_STORE)

    @app.get("/api/phone-assist/invoke/{invoke_id}")
    async def get_invoke(invoke_id: str) -> JSONResponse:
        return JSONResponse(await actions.get_invoke(invoke_id), headers=NO_STORE)

    @app.post("/api/phone-assist/send")
    async def send_message(request: Request) -> JSONResponse:
        body = await _read_bounded_json(request, 256 * 1024)
        return JSONResponse(await actions.send(body), headers=NO_STORE)

    @app.get("/api/phone-assist/history/{session_id}")
    async def history(session_id: str) -> JSONResponse:
        return JSONResponse(await actions.history(session_id), headers=NO_STORE)


def create_assist_app(
    ctx: Context, store: AssistStore, stop_event: asyncio.Event,
) -> tuple[FastAPI, AssistActions]:
    app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)
    plugin_dir = Path(__file__).resolve().parent
    sheet_path = plugin_dir / "sheet.html"

    # 极轻接口：供原生浮条异步拉取 10 分钟内最近一次受管会话，不阻塞弹出。
    async def resume_info() -> dict[str, object]:
        with store._io_lock:
            last = store._last_session
            if last is None:
                return {"resume": None}
            import time
            age = time.time() - last.updated_at
            if age < 0 or age > store.resume_window_seconds:
                return {"resume": None}
            return {
                "resume": {
                    "session_id": last.session_id,
                    "title": last.title,
                }
            }

    # 一步直达接口：原生极简浮条一次请求完成截图导入、建「手机」项目会话与发送消息。
    async def quick_ask(body: dict[str, Any]) -> dict[str, object]:
        text_msg = str(body.get("text") or "").strip()
        if not text_msg:
            raise HTTPException(status_code=400, detail="提问内容不能为空")
        if len(text_msg) > 16000:
            raise HTTPException(status_code=400, detail="提问内容过长")

        source = str(body.get("source") or "nav_handle")[:40]
        package_name = str(body.get("package_name") or "").strip()[:160]
        app_label = str(body.get("app_label") or package_name or "当前屏幕").strip()[:80]
        captured_at = str(body.get("captured_at") or datetime.now().strftime("%H:%M"))[:32]
        ui_tree_text = str(body.get("ui_tree_text") or "")[:6000]
        screenshot_b64 = body.get("screenshot_png_b64")
        include_screenshot = body.get("include_screenshot", True) is not False

        requested_sid = str(body.get("session_id") or "").strip()
        if requested_sid:
            if not store.is_managed_session(requested_sid):
                raise HTTPException(status_code=403, detail="无权向该会话发送消息")
            target_sid = requested_sid
        else:
            target_sid = f"akashic:{uuid.uuid4().hex}"

        attachment_ref: AttachmentRef | None = None
        if include_screenshot and isinstance(screenshot_b64, str) and screenshot_b64.strip():
            attachment_ref, _ = await _import_screenshot_b64(ctx, screenshot_b64)

        catalog = ctx.require(MESSAGE_CATALOG)
        session_exists = await run_file_io(lambda: catalog.exists(target_sid))
        is_new_session = not session_exists
        chat_id = target_sid.split(":", 1)[1] if ":" in target_sid else target_sid

        attachments: tuple[AttachmentRef, ...] = (attachment_ref,) if attachment_ref is not None else ()
        if include_screenshot and (attachment_ref is not None or ui_tree_text.strip()):
            ctx_lines = [
                f"[手机看屏唤起 · 来源={source} · 应用={app_label}"
                + (f" ({package_name})" if package_name else "")
                + f" · 采集时间={captured_at}]"
            ]
            if ui_tree_text.strip():
                ctx_lines.append("当前页面可见文本/控件摘录：\n" + ui_tree_text.strip()[:2800])
            content = "\n".join(ctx_lines) + "\n\n[用户提问]\n" + text_msg
        else:
            content = text_msg

        metadata: dict[str, Any] = {"phone_assist": True}
        project_id: str | None = None
        if is_new_session:
            project_id = await _ensure_phone_project(ctx, store)
            if project_id:
                metadata["session_dimensions"] = {"project": project_id}

        message_id = f"pa_{uuid.uuid4().hex}"
        inbound = ChannelInboundMessage(
            channel="akashic",
            sender="web",
            chat_id=chat_id,
            content=content,
            timestamp=datetime.now(UTC),
            metadata=metadata,
            attachments=attachments,
        )

        steered = False
        if not is_new_session and not attachments:
            with ctx.borrow(CHANNEL_STEER) as steer:
                if steer is not None:
                    steered = await steer.stage(target_sid, message_id, inbound)
        if not steered:
            await ctx.require(CHANNEL_INPUT_V2)(target_sid, message_id, inbound)

        title_hint = f"{app_label} · {text_msg}" if app_label else text_msg
        try:
            await run_file_io(
                lambda: store.record_session_activity_sync(
                    session_id=target_sid,
                    title=title_hint,
                    package_name=package_name,
                    app_label=app_label,
                )
            )
        except Exception as err:
            logger.warning("记录 phone-assist 最近会话失败: %s", err)

        return {
            "ok": True,
            "session_id": target_sid,
            "message_id": message_id,
            "steered": steered,
            "project_id": project_id,
        }

    @app.get("/api/phone-assist/health")
    async def health() -> JSONResponse:
        return JSONResponse({"ok": True, "plugin": "phone-assist"}, headers=NO_STORE)

    @app.get("/api/phone-assist/sheet")
    async def sheet_page() -> HTMLResponse:
        def read_html() -> str | None:
            if not sheet_path.is_file():
                return None
            return sheet_path.read_text(encoding="utf-8")

        html = await run_file_io(read_html)
        if html is None:
            raise HTTPException(status_code=404, detail="sheet.html 缺失")
        return HTMLResponse(html, headers=NO_STORE)

    async def invoke(body: dict[str, Any]) -> dict[str, object]:
        source = str(body.get("source") or "nav_handle")[:40]
        package_name = str(body.get("package_name") or "").strip()[:160]
        app_label = str(body.get("app_label") or package_name or "当前屏幕").strip()[:80]
        captured_at = str(body.get("captured_at") or datetime.now().strftime("%H:%M"))[:32]
        ui_tree_text = str(body.get("ui_tree_text") or "")[:6000]
        screenshot_b64 = body.get("screenshot_png_b64")

        attachment_ref: AttachmentRef | None = None
        preview_b64: str | None = None
        if isinstance(screenshot_b64, str) and screenshot_b64.strip():
            attachment_ref, preview_b64 = await _import_screenshot_b64(ctx, screenshot_b64)

        project_id = await _ensure_phone_project(ctx, store)
        record = store.create_invoke(
            source=source,
            package_name=package_name,
            app_label=app_label,
            captured_at=captured_at,
            ui_tree_text=ui_tree_text,
            attachment_ref=attachment_ref,
            screenshot_preview_b64=preview_b64,
            project_id=project_id,
        )
        payload = record.public_dict()
        payload["sheet_url"] = f"/api/phone-assist/sheet?invoke={record.invoke_id}"
        return payload

    async def get_invoke(invoke_id: str) -> dict[str, object]:
        record = store.get_invoke(invoke_id)
        if record is None:
            raise HTTPException(status_code=410, detail="唤起快照已过期，请重新唤起")
        return record.public_dict()

    async def send_message(body: dict[str, Any]) -> dict[str, object]:
        text = str(body.get("text") or "").strip()
        if not text:
            raise HTTPException(status_code=400, detail="提问内容不能为空")
        if len(text) > 16000:
            raise HTTPException(status_code=400, detail="提问内容过长")

        invoke_id = str(body.get("invoke_id") or "").strip()
        record = store.get_invoke(invoke_id) if invoke_id else None
        if record is None:
            raise HTTPException(status_code=410, detail="唤起会话已过期或无效，请重新唤起")

        client_req_id = str(body.get("client_request_id") or "").strip()[:64]
        requested_sid = str(body.get("session_id") or "").strip()
        target_sid = requested_sid or record.new_session_id
        if not record.is_session_allowed(target_sid):
            raise HTTPException(status_code=403, detail="无权向该会话发送消息（或续聊窗口已过）")

        include_screenshot = body.get("include_screenshot", True) is not False
        include_ui_tree = body.get("include_ui_tree", True) is not False

        async with record.send_lock:
            if client_req_id and client_req_id in record.seen_client_ids:
                return record.seen_client_ids[client_req_id]

            catalog = ctx.require(MESSAGE_CATALOG)
            session_exists = await run_file_io(lambda: catalog.exists(target_sid))
            is_new_session = not session_exists
            chat_id = target_sid.split(":", 1)[1] if ":" in target_sid else target_sid

            attachments: tuple[AttachmentRef, ...] = ()
            content = text
            consuming_attachment = False
            if not record.used_attachment:
                ctx_lines = [
                    f"[手机看屏唤起 · 来源={record.source} · 应用={record.app_label}"
                    + (f" ({record.package_name})" if record.package_name else "")
                    + f" · 采集时间={record.captured_at}]"
                ]
                if include_ui_tree and record.ui_tree_text.strip():
                    ctx_lines.append("当前页面可见文本/控件摘录：\n" + record.ui_tree_text.strip()[:2800])
                content = "\n".join(ctx_lines) + "\n\n[用户提问]\n" + text
                if include_screenshot and record.attachment_ref is not None:
                    attachments = (record.attachment_ref,)
                consuming_attachment = True

            metadata: dict[str, Any] = {"phone_assist": True}
            if is_new_session and record.project_id:
                metadata["session_dimensions"] = {"project": record.project_id}

            message_id = f"pa_{uuid.uuid4().hex}"
            inbound = ChannelInboundMessage(
                channel="akashic",
                sender="web",
                chat_id=chat_id,
                content=content,
                timestamp=datetime.now(UTC),
                metadata=metadata,
                attachments=attachments,
            )

            # 带截图的消息绝不走 steer（steer 正文不携带附件）；仅纯文本追问允许插话。
            steered = False
            if not is_new_session and not attachments:
                with ctx.borrow(CHANNEL_STEER) as steer:
                    if steer is not None:
                        steered = await steer.stage(target_sid, message_id, inbound)

            if not steered:
                await ctx.require(CHANNEL_INPUT_V2)(target_sid, message_id, inbound)

            if consuming_attachment:
                record.used_attachment = True

            title_hint = f"{record.app_label} · {text}" if record.app_label else text
            try:
                await run_file_io(
                    lambda: store.record_session_activity_sync(
                        session_id=target_sid,
                        title=title_hint,
                        package_name=record.package_name,
                        app_label=record.app_label,
                    )
                )
            except Exception as err:
                logger.warning("记录 phone-assist 最近会话失败（消息已入账）: %s", err)

            resp_data: dict[str, object] = {
                "ok": True,
                "session_id": target_sid,
                "message_id": message_id,
                "steered": steered,
                "is_new_session": is_new_session,
            }
            if client_req_id:
                record.seen_client_ids[client_req_id] = resp_data
            return resp_data

    async def history(session_id: str) -> dict[str, object]:
        if not store.is_managed_session(session_id):
            raise HTTPException(status_code=403, detail="会话不在 phone-assist 管理范围内")
        catalog = ctx.require(MESSAGE_CATALOG)
        if not await run_file_io(lambda: catalog.exists(session_id)):
            return {"session_id": session_id, "messages": [], "through_seq": -1}
        reader = catalog.reader(session_id)
        snap = await reader.committed_snapshot_async(after_seq=-1)
        call_names: dict[tuple[str, int], str] = {}
        items = [v for m in snap if (v := _extract_message_view(m, call_names)) is not None]
        if len(items) > MAX_HISTORY_MESSAGES:
            items = items[-MAX_HISTORY_MESSAGES:]
        return {"session_id": session_id, "messages": items, "through_seq": snap.through_seq}

    actions = AssistActions(resume_info, quick_ask, invoke, get_invoke, send_message, history)
    _assist_routes(app, actions)

    @app.get("/api/phone-assist/stream/{session_id}")
    async def stream_session(session_id: str, request: Request, after_seq: int = -1) -> StreamingResponse:
        if not store.is_managed_session(session_id):
            raise HTTPException(status_code=403, detail="会话不在 phone-assist 管理范围内")
        last_event_id = request.headers.get("last-event-id")
        if last_event_id is not None:
            with suppress(ValueError):
                after_seq = max(after_seq, int(last_event_id))

        catalog = ctx.require(MESSAGE_CATALOG)

        async def event_gen() -> AsyncGenerator[bytes, None]:
            cursor = after_seq
            call_names: dict[tuple[str, int], str] = {}
            last_preview_sig: tuple[str, str, bool] | None = None
            last_beat = asyncio.get_running_loop().time()
            yield _sse("ready", {"session_id": session_id, "after_seq": cursor})
            while not stop_event.is_set():
                if await request.is_disconnected():
                    break
                exists = await run_file_io(lambda: catalog.exists(session_id))
                if exists:
                    reader = catalog.reader(session_id)
                    snap = await reader.committed_snapshot_async(after_seq=cursor)
                    for msg in snap:
                        cursor = max(cursor, msg.seq)
                        view = _extract_message_view(msg, call_names)
                        if view is not None:
                            last_preview_sig = None
                            yield _sse("message", view, event_id=str(msg.seq))
                    if snap.through_seq > cursor:
                        cursor = snap.through_seq
                # 实时推送未落账的逐字草稿，消除“干等思考中”的体感延迟
                if REPLY_STATUS is not None:
                    preview_payload: dict[str, object] | None = None
                    with ctx.borrow(REPLY_STATUS) as rs:
                        if rs is not None:
                            acts = rs.snapshot(session_id)
                            for act in acts:
                                if act.active and act.preview is not None:
                                    ptxt = act.preview.text or ""
                                    has_think = bool(act.preview.thinking)
                                    sig = (act.preview.message_id, ptxt, has_think)
                                    if sig != last_preview_sig:
                                        last_preview_sig = sig
                                        preview_payload = {
                                            "message_id": act.preview.message_id,
                                            "text": ptxt,
                                            "thinking": has_think,
                                            "active": True,
                                        }
                                    break
                    if preview_payload is not None:
                        yield _sse("preview", preview_payload)
                now = asyncio.get_running_loop().time()
                if now - last_beat >= HEARTBEAT_SECONDS:
                    last_beat = now
                    yield _sse("heartbeat", {"through_seq": cursor})
                try:
                    await asyncio.wait_for(stop_event.wait(), timeout=STREAM_POLL_SECONDS)
                    break
                except TimeoutError:
                    continue

        return StreamingResponse(
            event_gen(),
            media_type="text/event-stream",
            headers={"Cache-Control": "no-store", "X-Accel-Buffering": "no"},
        )

    return app, actions


async def start_assist_listener(ctx: Context, store: AssistStore) -> AssistActions:
    stop_event = asyncio.Event()
    app, actions = create_assist_app(ctx, store, stop_event)
    path = socket_alias_path(ctx.data_root, "phone-assist.sock")
    server = AssistListenerServer(
        uvicorn.Config(
            app,
            log_level="warning",
            access_log=False,
            lifespan="off",
            timeout_graceful_shutdown=3,
        ),
    )
    task: asyncio.Task[None] | None = None

    def setup():
        nonlocal task
        prepare_unix_socket(path)
        listener = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        bound = False
        try:
            listener.bind(str(path))
            bound = True
            listener.setblocking(False)
            node = path.lstat()
            task = asyncio.create_task(server.serve(sockets=[listener]), name="phone-assist-server")
        except BaseException:
            listener.close()
            if bound:
                path.unlink(missing_ok=True)
            raise
        running = task
        closed = False

        async def close() -> None:
            nonlocal closed
            if closed:
                return
            stop_event.set()
            server.should_exit = True
            try:
                await asyncio.wait_for(running, timeout=5.0)
            except TimeoutError:
                running.cancel()
                with suppress(asyncio.CancelledError):
                    await running
            finally:
                listener.close()
                with suppress(FileNotFoundError):
                    current = path.lstat()
                    if (current.st_dev, current.st_ino) == (node.st_dev, node.st_ino):
                        path.unlink()
                closed = True

        return close

    await ctx.effect(setup, label="phone-assist.listener")
    assert task is not None
    ready = asyncio.create_task(server.ready.wait(), name="phone-assist-ready")
    try:
        await asyncio.wait((ready, task), return_when=asyncio.FIRST_COMPLETED)
        if task.done():
            await task
            raise RuntimeError("phone-assist listener 在就绪前退出")
        if not server.started:
            raise RuntimeError("phone-assist listener 未完成启动")
    finally:
        ready.cancel()
        await asyncio.gather(ready, return_exceptions=True)

    await ctx.endpoint(
        "phone-assist",
        protocol="http+unix",
        address=str(path),
        routes=("/api/phone-assist",),
    )
    return actions
