"""self 命令里的文件标签：与工作台同一套根目录与路径解析，列目录、读文档预览，在侧栏打开、定位、回目录与查看当前视图。"""
from __future__ import annotations

from agent.plugin_composition import Context
from plugins.host_execution.contract import FILES
from plugins.operations.contract import OPERATIONS_V1, OperationRequest, OperationResult, OperationSpec, OptionSpec
from plugins.working_directory.contract import WORKING_DIRECTORY

from .browse import FileBrowser, workspace_candidate
from .live import READER_LIVE
from .navigate import Navigated, OpenTarget
from .tools import navigator_for

_SESSION = OptionSpec("session", "按哪个会话的工作目录解析相对路径；省略时用当前会话")


def _text(req: OperationRequest, name: str, limit: int) -> str:
    value = req.args.get(name) or ""
    if not isinstance(value, str) or len(value) > limit:
        raise ValueError(f"--{name} 最长 {limit} 字符")
    return value


def _session(req: OperationRequest) -> str:
    return _text(req, "session", 512) or req.session_id or ""


def _int(req: OperationRequest, name: str, limit: int) -> int | None:
    value = req.args.get(name)
    if value is None:
        return None
    if not isinstance(value, int) or isinstance(value, bool) or not 1 <= value <= limit:
        raise ValueError(f"--{name} 须是 1 到 {limit} 的整数")
    return value


def _navigated(done: Navigated) -> OperationResult:
    data: dict[str, object] = {"path": done.path, "delivered": done.delivered}
    return OperationResult(done.ok, done.message, data=data, error_code=None if done.ok else "invalid_target")


def _result(data: dict[str, object], ok_summary: str) -> OperationResult:
    status = data.get("status")
    if status not in (None, "available"):
        return OperationResult(False, str(data.get("message") or status), data=data, error_code=str(status))
    return OperationResult(True, ok_summary, data=data)


# owner 是插件自身的 Context：执行主机文件与工作目录能力在它上面解析。
async def register_operations(ctx: Context, owner: Context) -> None:
    browser = FileBrowser(workspace_candidate(owner.data_root))

    async def list_files(req: OperationRequest) -> OperationResult:
        after = _text(req, "after", 512) or None
        data = await browser.files(owner.require(FILES), owner.require(WORKING_DIRECTORY), session=_session(req),
                                   path=_text(req, "path", 4096), after=after, hidden=req.args.get("hidden") is True)
        return _result(data, str(data.get("path") or "目录"))

    async def read_document(req: OperationRequest) -> OperationResult:
        path = _text(req, "path", 4096)
        if not path:
            raise ValueError("缺少 --path")
        data = await browser.document(owner.require(FILES), owner.require(WORKING_DIRECTORY), session=_session(req),
                                      path=path, tail=req.args.get("tail") is True)
        return _result(data, str(data.get("path") or path))

    navigator = navigator_for(owner)

    async def open_document(req: OperationRequest) -> OperationResult:
        path = _text(req, "path", 4096)
        if not path:
            raise ValueError("缺少 --path")
        target = OpenTarget(path, page=_int(req, "page", 100000), line=_int(req, "line", 1000000),
                            sheet=_text(req, "sheet", 120) or None, search=_text(req, "search", 240) or None,
                            note=_text(req, "note", 200) or None)
        return _navigated(await navigator.open(_session(req), req.request_id or "", target))

    async def close_document(req: OperationRequest) -> OperationResult:
        return _navigated(await navigator.close(_session(req)))

    async def reader_state(req: OperationRequest) -> OperationResult:
        state = owner.require(READER_LIVE).state(_session(req))
        view = state["view"]
        if view is None:
            summary = "文件标签未打开" if not state["connected"] else "文件标签已打开，尚未回报视图"
        elif view.get("mode") == "read":
            summary = f"正在看 {view.get('path', '')}" + (f" 第 {view['page']} 页" if "page" in view else "")
        else:
            summary = f"在目录 {view.get('path', '')}"
        return OperationResult(True, summary, data=dict(state))

    operations = ctx.require(OPERATIONS_V1)
    _ = await operations.register(ctx, OperationSpec(
        operation_id="file_viewer.list", path=("file_viewer", "list"),
        summary="列出执行主机上的目录（文件标签同款：会话目录、工作区、记忆、主目录为根）",
        handler=list_files,
        options=(_SESSION, OptionSpec("path", "目录或文件路径；省略时用默认根"),
                 OptionSpec("after", "分页游标（来自上一页）"), OptionSpec("hidden", "包含隐藏文件", "bool", default=False)),
        mirrors=("http:file_viewer:GET /api/dashboard/file_viewer/files",),
    ))
    _ = await operations.register(ctx, OperationSpec(
        operation_id="file_viewer.read", path=("file_viewer", "read"), summary="读取文件的预览内容（最多 256 KiB）",
        handler=read_document,
        options=(_SESSION, OptionSpec("path", "文件路径", required=True), OptionSpec("tail", "读文件末尾", "bool", default=False)),
        mirrors=("http:file_viewer:GET /api/dashboard/file_viewer/document",),
    ))
    _ = await operations.register(ctx, OperationSpec(
        operation_id="file_viewer.open", path=("file_viewer", "open"),
        summary="在用户侧栏「文件」标签里打开文件并可选定位；标签没开时等用户点开再显示",
        handler=open_document,
        options=(_SESSION, OptionSpec("path", "文件路径：绝对路径或相对会话工作目录", required=True),
                 OptionSpec("page", "1 起的页码（PDF/Word）或幻灯片编号", "int"),
                 OptionSpec("line", "1 起的行号（Markdown/代码/文本）", "int"),
                 OptionSpec("sheet", "Excel 工作表名"), OptionSpec("search", "定位并高亮的关键词"),
                 OptionSpec("note", "给用户看的一句导览提示")),
    ))
    _ = await operations.register(ctx, OperationSpec(
        operation_id="file_viewer.close", path=("file_viewer", "close"), summary="让「文件」标签从阅读回到目录",
        handler=close_document, options=(_SESSION,),
    ))
    _ = await operations.register(ctx, OperationSpec(
        operation_id="file_viewer.state", path=("file_viewer", "state"),
        summary="查看「文件」标签现在停在哪：连接数、正在看的文件与页码、还没送达的打开指令",
        handler=reader_state, options=(_SESSION,),
        mirrors=("http:file_viewer:WEBSOCKET /api/dashboard/file_viewer/live",),
    ))
