"""self 命令里的会话终端：列出、新开、关闭与工作台同一组 PTY；不读写终端内容（ADR-0122）。"""
from __future__ import annotations

from agent.plugin_composition import Context
from plugins.host_execution.contract import TERMINAL_MAX_COLS, TERMINAL_MAX_ROWS
from plugins.operations.contract import session_of, OPERATIONS_V1, OperationRequest, OperationResult, OperationSpec, OptionSpec

from .sessions import SessionTerminals, terminal_view

_SESSION = OptionSpec("session", "终端所属会话；省略时用当前会话")


# 显式 --session 优先，否则落到调用所在会话；两者都没有时拒绝。
def _session(req: OperationRequest) -> str:
    # 用户可指定任意会话；助手只能作用于自己所在的会话。
    return session_of(req)


def _bounded(req: OperationRequest, name: str, limit: int) -> int:
    value = req.args.get(name)
    if not isinstance(value, int) or not 1 <= value <= limit:
        raise ValueError(f"--{name} 必须在 1..{limit} 之间")
    return value


async def register_operations(ctx: Context, terminals: SessionTerminals) -> None:
    async def list_terminals(req: OperationRequest) -> OperationResult:
        try:
            items = [terminal_view(item) for item in await terminals.list(_session(req))]
        except OSError as error:
            return OperationResult(False, f"终端服务暂不可用：{error.strerror or error}", error_code="unavailable")
        return OperationResult(True, f"{len(items)} 个终端", data={"terminals": items})

    async def open_terminal(req: OperationRequest) -> OperationResult:
        cols, rows = _bounded(req, "cols", TERMINAL_MAX_COLS), _bounded(req, "rows", TERMINAL_MAX_ROWS)
        try:
            info = await terminals.open(_session(req), cols=cols, rows=rows)
        except RuntimeError as error:
            return OperationResult(False, str(error), error_code="conflict")
        except OSError as error:
            return OperationResult(False, f"终端启动失败：{error.strerror or error}", error_code="unavailable")
        return OperationResult(True, f"已新开终端 {info.terminal_id}（{info.cwd}）", data=terminal_view(info))

    async def close_terminal(req: OperationRequest) -> OperationResult:
        terminal_id = req.args.get("terminal_id")
        if not isinstance(terminal_id, int) or terminal_id < 1:
            raise ValueError("--terminal_id 必须是正整数")
        try:
            closed = await terminals.close(_session(req), terminal_id)
        except OSError as error:
            return OperationResult(False, f"关闭终端失败：{error.strerror or error}", error_code="unavailable")
        return OperationResult(True, "已关闭" if closed else "终端不存在或已关闭", data={"closed": closed})

    operations = ctx.require(OPERATIONS_V1)
    _ = await operations.register(ctx, OperationSpec(
        operation_id="terminal.list", path=("terminal", "list"), summary="列出会话里用户的交互终端（不含输出）",
        handler=list_terminals, options=(_SESSION,),
        mirrors=("http:terminal:GET /api/dashboard/terminal/terminals",),
    ))
    _ = await operations.register(ctx, OperationSpec(
        operation_id="terminal.open", path=("terminal", "open"), summary="在会话工作目录新开一个交互终端",
        handler=open_terminal,
        options=(_SESSION, OptionSpec("cols", "列数", "int", default=120), OptionSpec("rows", "行数", "int", default=32)),
        mirrors=("http:terminal:POST /api/dashboard/terminal/terminals",),
    ))
    _ = await operations.register(ctx, OperationSpec(
        operation_id="terminal.close", path=("terminal", "close"), summary="关闭会话里的一个交互终端",
        handler=close_terminal,
        options=(_SESSION, OptionSpec("terminal_id", "终端 ID（来自 terminal list）", "int", required=True)),
        mirrors=("http:terminal:DELETE /api/dashboard/terminal/terminals/{terminal_id}",),
    ))
