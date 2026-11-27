"""在文件标签里打开、定位与返回目录：open_document 工具与 self 的 file_viewer.open/close 共用这一段。"""
from __future__ import annotations

from dataclasses import dataclass

from plugins.host_execution.contract import Files
from plugins.working_directory.contract import WorkingDirectories

from .live import ReaderLive


@dataclass(frozen=True, slots=True)
class OpenTarget:
    path: str
    page: int | None = None
    line: int | None = None
    sheet: str | None = None
    search: str | None = None
    note: str | None = None


@dataclass(frozen=True, slots=True)
class Navigated:
    ok: bool
    message: str
    path: str = ""
    delivered: int = 0


class Navigator:
    def __init__(self, live: ReaderLive, files: Files, directories: WorkingDirectories, workspace: str | None) -> None:
        self._live = live
        self._files = files
        self._directories = directories
        self._workspace = workspace

    # 1. 校验路径；2. 解析并确认是可读的普通文件；3. 推给标签（没连上就留待补推）。
    async def open(self, session: str, turn: str, target: OpenTarget) -> Navigated:
        raw_path = target.path.strip()
        if not raw_path or any(ord(ch) < 32 for ch in raw_path) or raw_path.startswith("//"):
            return Navigated(False, "路径格式无效")
        resolved, error = await self._resolve(session, raw_path)
        if resolved is None:
            return Navigated(False, error or "无法解析文件路径")
        delivered = await self._live.open_document(
            session, turn=turn, path=resolved, page=target.page, line=target.line,
            sheet=target.sheet, search=target.search, note=target.note,
        )
        anchor = _anchor_text(target)
        if delivered:
            return Navigated(True, f"已在用户侧边栏打开 {resolved}{anchor}。", resolved, delivered)
        return Navigated(True, f"已确认文件可读：{resolved}{anchor}。文件标签还没打开，用户点开「文件」标签时会直接显示它。",
                         resolved, 0)

    async def close(self, session: str) -> Navigated:
        delivered = await self._live.close_document(session)
        if delivered:
            return Navigated(True, "文件标签已回到目录。", delivered=delivered)
        return Navigated(True, "文件标签还没打开，下次打开时停在目录。")

    async def _resolve(self, session: str, raw_path: str) -> tuple[str | None, str | None]:
        workdir = self._directories.snapshot(session).path if session else None
        base = workdir or self._workspace
        async with self._files.paths() as reader:
            if session and workdir and not raw_path.startswith(("/", "~")):
                try:
                    target, _ = await self._directories.resolve_target(session, raw_path)
                except ValueError as error:
                    return None, str(error)
            else:
                resolved = await reader.read("resolve", raw_path, base_dir=base)
                if resolved.status != "available" or not resolved.path:
                    return None, f"无法访问路径：{raw_path}（{resolved.status}）"
                target = resolved.path
            inspected = await reader.read("inspect", target)
            if inspected.status != "available":
                return None, f"文件不可访问：{target}（{inspected.status}）"
            if inspected.kind != "file":
                return None, f"目标不是普通文件：{target}"
            return inspected.path or target, None


def _anchor_text(target: OpenTarget) -> str:
    anchors: list[str] = []
    if target.page is not None:
        anchors.append(f"第 {target.page} 页")
    if target.line is not None:
        anchors.append(f"第 {target.line} 行")
    if target.sheet:
        anchors.append(f"工作表「{target.sheet}」")
    if target.search:
        anchors.append(f"定位「{target.search}」")
    return f"（{'，'.join(anchors)}）" if anchors else ""
