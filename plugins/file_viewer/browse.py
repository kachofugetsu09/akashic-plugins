"""文件标签的浏览与阅读：列目录、读文档预览与解析路径；浏览器路由和 self 命令共用这一份。"""
from __future__ import annotations

from pathlib import Path, PurePosixPath

from plugins.host_execution.contract import Files, PathReader
from plugins.working_directory.contract import WorkingDirectories

PREVIEW_MAX_BYTES = 256 * 1024


# 插件数据目录在 <workspace>/plugin-data/<插件> 下时，工作区就是它的上两级。
def workspace_candidate(data_root: Path) -> str | None:
    parent = data_root.parent
    return str(parent.parent) if parent.name == "plugin-data" else None


class FileBrowser:
    """路径都指执行主机；工作区、记忆与主目录三个固定根读到一次后缓存（离线时不缓存）。"""

    def __init__(self, workspace_hint: str | None) -> None:
        self._hint = workspace_hint
        self._static: dict[str, str | None] = {}

    async def files(self, files: Files, directories: WorkingDirectories, *, session: str, path: str,
                    after: str | None, hidden: bool) -> dict[str, object]:
        async with files.paths() as reader:
            workdir, base, roots = await self._roots(reader, directories, session)
            target, err = await self._resolve(reader, directories, session, path.strip(), base)
            if err is not None or target is None:
                return {**(err or {"status": "invalid_path"}), "root": workdir, "roots": roots}
            action = "file_list_hidden" if hidden else "file_list"
            result = await reader.read(action, target, after=after, limit=200)
            if result.status == "not_directory" and after is None:
                inspected = await reader.read("inspect", target)
                if inspected.status == "available" and inspected.kind == "file":
                    parent_dir = str(PurePosixPath(inspected.path).parent)
                    listed = await reader.read(action, parent_dir, limit=200)
                    return {**listed.model_dump(exclude_none=True), "root": workdir, "roots": roots, "open_file": inspected.path}
            return {**result.model_dump(exclude_none=True), "root": workdir, "roots": roots}

    async def document(self, files: Files, directories: WorkingDirectories, *, session: str, path: str,
                       tail: bool) -> dict[str, object]:
        async with files.paths() as reader:
            target, err = await self.target(reader, directories, session, path)
            if err is not None or target is None:
                return err or {"status": "invalid_path"}
            result = await reader.read("file_tail" if tail else "file_read", target, max_bytes=PREVIEW_MAX_BYTES)
            return result.model_dump(exclude_none=True)

    # 相对路径先按会话目录解析，没有会话目录时按默认根（会话目录、工作区或主目录）。
    async def target(self, reader: PathReader, directories: WorkingDirectories, session: str,
                     path: str) -> tuple[str | None, dict[str, object] | None]:
        _, base, _ = await self._roots(reader, directories, session)
        return await self._resolve(reader, directories, session, path.strip(), base)

    async def _static_roots(self, reader: PathReader) -> tuple[str | None, str | None, str | None]:
        if "ready" not in self._static:
            ws: str | None = None
            mem: str | None = None
            home: str | None = None
            offline = False
            if self._hint:
                ws_info = await reader.read("inspect", self._hint)
                offline = offline or ws_info.status == "offline"
                if ws_info.status == "available" and ws_info.kind == "directory":
                    ws = ws_info.path
                    mem_info = await reader.read("inspect", f"{ws}/memory")
                    offline = offline or mem_info.status == "offline"
                    if mem_info.status == "available" and mem_info.kind == "directory":
                        mem = mem_info.path
            home_info = await reader.read("inspect", "~")
            offline = offline or home_info.status == "offline"
            if home_info.status == "available" and home_info.kind == "directory":
                home = home_info.path
            if offline:
                return ws, mem, home
            self._static.update(ready="1", workspace=ws, memory=mem, home=home)
        return self._static.get("workspace"), self._static.get("memory"), self._static.get("home")

    async def _roots(self, reader: PathReader, directories: WorkingDirectories,
                     session: str) -> tuple[str | None, str | None, list[dict[str, str]]]:
        workdir = directories.snapshot(session).path if session else None
        ws, mem, home = await self._static_roots(reader)
        roots: list[dict[str, str]] = []
        seen: set[str] = set()
        for root_id, label, candidate in (
            ("workdir", "会话目录", workdir),
            ("workspace", "工作区", ws),
            ("memory", "记忆", mem),
            ("home", "主目录", home),
        ):
            if candidate and candidate not in seen:
                seen.add(candidate)
                roots.append({"id": root_id, "label": label, "path": candidate})
        return workdir, (workdir or ws or home), roots

    async def _resolve(self, reader: PathReader, directories: WorkingDirectories, session: str,
                       raw_path: str, base: str | None) -> tuple[str | None, dict[str, object] | None]:
        if not raw_path:
            return base or "/", None
        if session and directories.snapshot(session).path and not raw_path.startswith(("/", "~")):
            try:
                target, _ = await directories.resolve_target(session, raw_path)
                return target, None
            except ValueError as error:
                return None, {"status": "invalid_path", "message": str(error)}
        resolved = await reader.read("resolve", raw_path, base_dir=base)
        if resolved.status != "available":
            return None, resolved.model_dump(exclude_none=True)
        return resolved.path, None
