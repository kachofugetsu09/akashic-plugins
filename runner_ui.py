"""Session-scoped subagent lineage, attention banner, and external activity projection."""
from __future__ import annotations

import asyncio
from agent.plugin_composition import Context
from plugins.jobs.contract import JOB_NOTICES
from plugins.operations.contract import QueryHandler
from plugins.ui.contract import UI_SLOTS, PluginUiDefinition, PluginUiRpcInvalidRequest
from .control import cancel_job, read_messages, send_message, session_tree, stop_runner
from .runners import Runners
from .runtime import SubagentBusy, Subagents


# 对话内任务面板的 RPC：界面与 Self-CLI 镜像共用；参数校验失败或不属于本会话一律拒绝。
def runner_query(ctx: Context, runners: Runners, jobs: Subagents) -> QueryHandler:
    async def query(method: str, payload: dict[str, object], *, session_id: str | None,
                    turn_id: str | None) -> dict[str, object]:
        if not session_id:
            raise PluginUiRpcInvalidRequest("需要会话")
        try:
            return await _dispatch(ctx, runners, jobs, method, payload, session_id)
        except (LookupError, PermissionError, SubagentBusy) as error:
            raise PluginUiRpcInvalidRequest(str(error)) from None

    return query


async def _dispatch(ctx: Context, runners: Runners, jobs: Subagents, method: str,
                    payload: dict[str, object], session_id: str) -> dict[str, object]:
    if method == "runners.list" and not payload:
        tree = await session_tree(jobs, runners, session_id)
        return {"runs": tree["runs"], "subagents": tree["subagents"], "catalog": runners.catalog()}
    if method == "runners.stop" and set(payload) == {"id"}:
        identity = payload["id"]
        if not isinstance(identity, str):
            raise PluginUiRpcInvalidRequest("任务不属于本会话")
        return await stop_runner(runners, ctx.require(JOB_NOTICES), session_id, identity)
    if method == "subagent.cancel" and set(payload) == {"job_id"}:
        job_id = payload["job_id"]
        if not isinstance(job_id, str) or not job_id:
            raise PluginUiRpcInvalidRequest("缺少 job_id")
        return await cancel_job(jobs, session_id, job_id)
    if method == "subagent.read" and {"job_id"}.issubset(payload):
        job_id, after_seq = payload["job_id"], payload.get("after_seq", -1)
        if not isinstance(job_id, str) or not isinstance(after_seq, int):
            raise PluginUiRpcInvalidRequest("参数无效")
        return await read_messages(jobs, session_id, job_id, after_seq=after_seq)
    if method == "subagent.send" and set(payload) == {"job_id", "message"}:
        job_id, msg = payload["job_id"], payload["message"]
        if not isinstance(job_id, str) or not isinstance(msg, str) or not msg.strip():
            raise PluginUiRpcInvalidRequest("发送参数无效")
        return await send_message(jobs, session_id, job_id, msg)
    raise PluginUiRpcInvalidRequest("未知任务操作")


async def register_ui(ctx: Context, runners: Runners, jobs: Subagents) -> None:
    query = runner_query(ctx, runners, jobs)

    async def follow(session_id: str):
        previous, seen = None, (-1, -1)
        while True:
            rev = (runners.revisions.get(session_id, 0), jobs.revision)
            if rev != seen:
                seen = rev
                await jobs.ensure_index()
                value = {
                    "runs": runners.records(session_id),
                    "subagents": jobs.session_tree(session_id),
                }
                if value != previous:
                    yield value
                    previous = value
            await asyncio.sleep(0.5)

    await ctx.require(UI_SLOTS).register_plugin_ui(
        ctx,
        PluginUiDefinition(
            module="runner_ui.js",
            stylesheet="runner_ui.css",
            slots=("header.meta", "tool.result", "tool.summary", "chat.notice"),
        ),
        query=query,
        follow=follow,
    )
