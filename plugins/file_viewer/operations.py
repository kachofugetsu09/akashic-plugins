"""self 命令里的文件标签：与工作台同一套根目录与路径解析，列目录、读文档预览。"""
from __future__ import annotations

from agent.plugin_composition import Context
from plugins.host_execution.contract import FILES
from plugins.operations.contract import OPERATIONS_V1, OperationRequest, OperationResult, OperationSpec, OptionSpec
from plugins.working_directory.contract import WORKING_DIRECTORY

from .browse import FileBrowser, workspace_candidate

_SESSION = OptionSpec("session", "按哪个会话的工作目录解析相对路径；省略时用当前会话")


def _text(req: OperationRequest, name: str, limit: int) -> str:
    value = req.args.get(name) or ""
    if not isinstance(value, str) or len(value) > limit:
        raise ValueError(f"--{name} 最长 {limit} 字符")
    return value


def _session(req: OperationRequest) -> str:
    return _text(req, "session", 512) or req.session_id or ""


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
