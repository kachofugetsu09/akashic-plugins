"""子任务会话树的控制入口：Workbench HTTP、对话内 RPC 与 Self-CLI operation 共用同一段领域代码。"""
from __future__ import annotations

from agent.plugin_composition import Context
from plugins.jobs.contract import JobNotices
from plugins.operations.contract import (
    OPERATIONS_V1,
    OperationHandler,
    OperationRequest,
    OperationResult,
    OperationSpec,
    OptionSpec,
    QueryHandler,
    QueryMirror,
    register_query_mirrors,
)

from .runners import Runners
from .runtime import SubagentBusy, Subagents


# 当前会话所在根会话树下的本地子任务与外部任务。
async def session_tree(jobs: Subagents, runners: Runners, session: str) -> dict[str, object]:
    await jobs.ensure_index()
    return {"session": session, "subagents": jobs.session_tree(session), "runs": runners.records(session)}


# 按父会话树权限读子任务的内部消息；不属于该树抛 KeyError / PermissionError。
async def read_messages(
    jobs: Subagents, session: str, job_id: str, *,
    after_seq: int = -1, before_seq: int | None = None, limit: int = 50,
) -> dict[str, object]:
    await jobs.ensure_index()
    root_id, _ = jobs.resolve_lineage(session)
    return await jobs.read_child_messages(root_id, job_id, after_seq=after_seq, before_seq=before_seq, limit=limit)


# 向会话树下的子任务插话或续聊；准入已满抛 SubagentBusy。
async def send_message(jobs: Subagents, session: str, job_id: str, message: str) -> dict[str, object]:
    text = message.strip()
    if not text:
        raise ValueError("消息不能为空")
    await jobs.ensure_index()
    root_id, _ = jobs.resolve_lineage(session)
    return await jobs.send(root_id, job_id, text, background=True)


# 只取消属于当前会话树的子任务。
async def cancel_job(jobs: Subagents, session: str, job_id: str) -> dict[str, object]:
    await jobs.ensure_index()
    root_id, _ = jobs.resolve_lineage(session)
    owned = any(
        item.get("job_id") == job_id and item.get("root_session_id") == root_id
        for item in jobs.session_tree(session, limit=100)
    )
    if not owned:
        raise LookupError("子任务不属于当前会话树")
    return {"accepted": await jobs.cancel(job_id)}


# 停止本会话登记过的外部任务；结算照常通知模型并注明是用户停止。
async def stop_runner(runners: Runners, notices: JobNotices, session: str, job_id: str) -> dict[str, object]:
    if runners.receipt(session, job_id) is None:
        raise LookupError("外部任务不属于当前会话")
    return {"accepted": await notices.stop_job(session, job_id)}


_JOB = OptionSpec("job_id", "子任务 ID", required=True)
_SESSION = OptionSpec("session", "目标会话 ID；省略时为当前会话")
# 对话内 RPC 绑定调用方当前会话；参数名即界面载荷键。
_RPC_MIRRORS = (
    QueryMirror("runners.list", ("subagent", "runners", "list"), "列出本会话的外部任务、子任务与可用外部执行器"),
    QueryMirror("runners.stop", ("subagent", "runners", "stop"), "停止本会话的一个外部任务",
                options=(OptionSpec("id", "外部任务 ID", required=True),)),
    QueryMirror("subagent.cancel", ("subagent", "cancel"), "取消本会话树下的一个子任务", options=(_JOB,)),
    QueryMirror("subagent.read", ("subagent", "read"), "读取本会话树下一个子任务的内部消息",
                options=(_JOB, OptionSpec("after_seq", "只读该序号之后的消息", "int"))),
    QueryMirror("subagent.send", ("subagent", "send"), "向本会话树下的子任务插话或续聊",
                options=(_JOB, OptionSpec("message", "要发送的指令", required=True))),
)


def _session(req: OperationRequest) -> str:
    value = req.args.get("session") or req.session_id
    if not isinstance(value, str) or not value:
        raise ValueError("需要 --session 或在会话内调用")
    return value


def _text(req: OperationRequest, name: str) -> str:
    return str(req.args[name])


def _int(req: OperationRequest, name: str) -> int | None:
    value = req.args.get(name)
    return value if isinstance(value, int) else None


def _workbench_handlers(jobs: Subagents, runners: Runners, notices: JobNotices) -> dict[str, OperationHandler]:
    async def tree(req: OperationRequest) -> OperationResult:
        data = await session_tree(jobs, runners, _session(req))
        return OperationResult(True, "子任务会话树", data=data)

    async def messages(req: OperationRequest) -> OperationResult:
        after, limit = _int(req, "after_seq"), _int(req, "limit")
        limit = 100 if limit is None else limit
        if not 1 <= limit <= 200:
            raise ValueError("--limit 须在 1-200 之间")
        data = await read_messages(
            jobs, _session(req), _text(req, "job_id"), after_seq=-1 if after is None else after,
            before_seq=_int(req, "before_seq"), limit=limit,
        )
        return OperationResult(True, "子任务消息", data=data)

    async def send(req: OperationRequest) -> OperationResult:
        try:
            data = await send_message(jobs, _session(req), _text(req, "job_id"), _text(req, "message"))
        except SubagentBusy as error:
            return OperationResult(False, str(error), error_code="busy")
        return OperationResult(True, "已发送给子任务", data=data)

    async def cancel(req: OperationRequest) -> OperationResult:
        data = await cancel_job(jobs, _session(req), _text(req, "job_id"))
        return OperationResult(True, "已提交取消", data=data)

    async def runner_stop(req: OperationRequest) -> OperationResult:
        data = await stop_runner(runners, notices, _session(req), _text(req, "job_id"))
        return OperationResult(True, "已提交停止", data=data)

    return {"tree": tree, "messages": messages, "send": send, "cancel": cancel, "runner-stop": runner_stop}


# Workbench HTTP 入口可指定任意会话；与对话内 RPC 各自一个 operation，共用上面的领域函数。
def _workbench_specs(handlers: dict[str, OperationHandler]) -> tuple[OperationSpec, ...]:
    def path(verb: str) -> tuple[str, ...]:
        return ("subagent", "workbench", verb)

    return (
        OperationSpec("subagent.workbench_tree", path("tree"), "查看会话树下的子任务与外部任务",
                      handlers["tree"], options=(_SESSION,), mirrors=("http:subagent:GET /api/dashboard/subagent/tree",)),
        OperationSpec("subagent.workbench_messages", path("messages"), "分页读取子任务的内部消息",
                      handlers["messages"], options=(
                          _SESSION, _JOB, OptionSpec("after_seq", "只读该序号之后的消息", "int", default=-1),
                          OptionSpec("before_seq", "只读该序号之前的消息", "int"),
                          OptionSpec("limit", "最多条数（1-200）", "int", default=100),
                      ), mirrors=("http:subagent:GET /api/dashboard/subagent/messages",)),
        OperationSpec("subagent.workbench_send", path("send"), "向子任务插话或续聊", handlers["send"],
                      options=(_SESSION, _JOB, OptionSpec("message", "要发送的指令", required=True)),
                      mirrors=("http:subagent:POST /api/dashboard/subagent/send",)),
        OperationSpec("subagent.workbench_cancel", path("cancel"), "取消会话树下的一个子任务",
                      handlers["cancel"], options=(_SESSION, _JOB),
                      mirrors=("http:subagent:POST /api/dashboard/subagent/cancel",)),
        OperationSpec("subagent.workbench_runner_stop", path("runner-stop"), "停止会话的一个外部任务",
                      handlers["runner-stop"], options=(_SESSION, _JOB),
                      mirrors=("http:subagent:POST /api/dashboard/subagent/runner-stop",)),
    )


# operations 插件在场时注册；不在场时子任务照常工作。
async def register_operations(
    ctx: Context, jobs: Subagents, runners: Runners, notices: JobNotices, query: QueryHandler,
) -> None:
    operations = ctx.require(OPERATIONS_V1)
    await register_query_mirrors(ctx, operations, query=query, mirrors=_RPC_MIRRORS)
    for spec in _workbench_specs(_workbench_handlers(jobs, runners, notices)):
        _ = await operations.register(ctx, spec)
