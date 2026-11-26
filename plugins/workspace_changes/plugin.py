"""会话工作目录的改动：按范围（未提交、本分支、单个提交）查看，每轮记下摘要；只读，不改用户的 index、HEAD 与 refs。"""
from typing import cast

from agent.plugin_composition import Context
from plugins.host_execution.contract import PROCESSES
from plugins.ledger.contract import MESSAGE_CATALOG, OWNER_STATE
from plugins.sources.contract import SOURCE_CHANGED_V3
from plugins.working_directory.contract import WORKING_DIRECTORY
from plugins.turn_projection.contract import TURN_PROJECTION
from plugins.ui.contract import UI, UI_SLOTS, PluginUiDefinition, PluginUiRpcInvalidRequest

from plugins.operations.contract import (
    OPERATIONS_V1, OperationRequest, OperationResult, OperationSpec, OptionSpec, QueryHandler, QueryMirror,
    register_query_mirrors,
)

from . import dashboard
from .changes import WORKSPACE_CHANGES, WorkspaceChanges

api_version = 3
name = "workspace_changes"
version = "1.0.0"
desc = "查看会话工作目录（git 仓库）的改动，回复下方给出每轮的摘要"
author = "Akashic Core"
inject = (PROCESSES, WORKING_DIRECTORY, MESSAGE_CATALOG, OWNER_STATE, TURN_PROJECTION)
workspace_roots = ()
workspace_files = ()


async def apply(ctx: Context) -> None:
    changes = WorkspaceChanges(ctx)
    _ = await ctx.provide(WORKSPACE_CHANGES, changes)
    # 插件停用时不采集：窗口任务与监听随本插件的生命周期。
    _ = await ctx.spawn(changes.windows.run(), name="workspace-changes-turns")
    _ = await ctx.on(SOURCE_CHANGED_V3, changes.windows.changed)

    # UI 缺席时只是没有浏览器入口，统计照常进行。
    async def register_ui(child: Context) -> None:
        _ = await child.require(UI).register(
            child, web="web_module.js", dashboard=lambda: dashboard,
            requires=("conversation.tools.v2",),
            contract_digests={
                "conversation.tools.v2": "b3f5e9aea07351d69ab1ae55d2dcf18c5e352fc61b6354d4af34dbeca16787eb",
            },
        )

    _ = await ctx.inject((UI, WORKSPACE_CHANGES), register_ui, name="workspace-changes-ui")

    # 回复下方的摘要只要计数与第一个文件（点开时定位），不把整份文件列表送进聊天界面。
    async def query(method: str, payload: dict[str, object], *, session_id: str | None, turn_id: str | None) -> dict[str, object]:
        message_id = payload.get("message_id")
        if method != "turn.message" or set(payload) != {"message_id"} or not session_id \
                or not isinstance(message_id, str) or not message_id:
            raise PluginUiRpcInvalidRequest("改动摘要需要会话与消息")
        return summarize(await changes.windows.by_message(session_id, message_id))

    async def message_ui(child: Context) -> None:
        _ = await child.require(UI_SLOTS).register_plugin_ui(
            child, PluginUiDefinition(module="message_ui.js", stylesheet="message_ui.css", slots=("turn.after_answer",)),
            query=query,
        )

    _ = await ctx.inject((UI_SLOTS,), message_ui, name="workspace-changes-message-ui")
    _ = await ctx.inject((OPERATIONS_V1,), lambda child: register_operations(child, changes, query), name="operations")


def summarize(turn: dict[str, object]) -> dict[str, object]:
    files = cast(list[dict[str, object]], turn.get("files") or [])
    return {
        "phase": turn["phase"], "turn_id": turn.get("turn_id"), "error": turn.get("error"),
        "path": files[0]["path"] if files else None,
        "files": len(files), "added": sum(cast(int, item["added"] or 0) for item in files),
        "removed": sum(cast(int, item["removed"] or 0) for item in files),
        "uncertain": bool(turn.get("baseline_late") or turn.get("end_late") or turn.get("truncated")),
    }


def _session(req: OperationRequest) -> str:
    value = req.args.get("session") or req.session_id
    if not isinstance(value, str) or not value:
        raise ValueError("需要 --session 或在会话内调用")
    return value


def _result(found: dict[str, object]) -> OperationResult:
    if found.get("status") != "ok":
        return OperationResult(False, str(found.get("message") or found.get("reason") or "改动不可用"), data=found,
                               error_code="unavailable")
    return OperationResult(True, "工作目录改动", data=found)


_SESSION = OptionSpec("session", "会话 ID；省略时为当前会话")


# 浏览器改动面板的两个 HTTP 入口与回复下方的摘要 RPC 各自一个 operation，调同一个 WorkspaceChanges。
async def register_operations(ctx: Context, changes: WorkspaceChanges, query: QueryHandler) -> None:
    operations = ctx.require(OPERATIONS_V1)

    async def scope(req: OperationRequest) -> OperationResult:
        return _result(await changes.scope(_session(req), str(req.args["scope"])))

    async def patch(req: OperationRequest) -> OperationResult:
        args = req.args
        return _result(await changes.patch(_session(req), str(args["before"]), str(args["after"]), str(args["path"])))

    _ = await operations.register(ctx, OperationSpec(
        "workspace_changes.scope", ("changes", "scope"), "列出一个范围内改动的文件：wt 未提交、base 本分支、或单个提交 SHA",
        scope, options=(_SESSION, OptionSpec("scope", "wt | base | 提交 SHA", required=True)),
        mirrors=("http:workspace_changes:GET /api/dashboard/workspace_changes/scope",),
    ))
    _ = await operations.register(ctx, OperationSpec(
        "workspace_changes.patch", ("changes", "patch"), "读取单个文件在两棵树之间的 patch（树 ID 取自 changes scope）",
        patch, options=(
            _SESSION, OptionSpec("before", "改动前的树 ID", required=True),
            OptionSpec("after", "改动后的树 ID", required=True), OptionSpec("path", "仓库内文件路径", required=True),
        ), mirrors=("http:workspace_changes:GET /api/dashboard/workspace_changes/patch",),
    ))
    await register_query_mirrors(ctx, operations, query=query, mirrors=(
        QueryMirror("turn.message", ("changes", "turn"), "读取某条回复那一轮的改动摘要",
                    options=(OptionSpec("message_id", "回复消息 ID", required=True),)),
    ))
