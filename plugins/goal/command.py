"""`/goal` 命令：设置、查看、暂停、恢复、清除与预算。"""

from __future__ import annotations

from collections.abc import Awaitable, Callable
from uuid import uuid4

from agent.plugin_composition import Context
from plugins.commands.contract import CommandInvocation, CommandResult
from plugins.ledger.contract import MessageConflict
from plugins.operations.contract import (
    OPERATIONS_V1, OperationRequest, OperationResult, OperationSpec, OptionSpec,
)

from .state import (
    Goal,
    GoalStatus,
    new_goal,
    normalize_objective,
    normalize_token_budget,
    pause,
    resume,
    set_token_budget,
    status_text,
)
from .store import GoalStore, digest

_CLEAR_ALIASES = frozenset({"clear", "stop", "off", "reset", "none", "cancel"})
_RETRIES = 3


def _error(text: str) -> CommandResult:
    return CommandResult("error", text)


def _success(text: str) -> CommandResult:
    return CommandResult("success", text)


class GoalCommand:
    def __init__(self, store: GoalStore) -> None:
        self._store = store

    async def __call__(self, invocation: CommandInvocation) -> CommandResult:
        raw = invocation.raw_input.strip()
        session_id, key = invocation.session_key, invocation.message_id
        if not raw:
            return await self.show(session_id)
        lowered = raw.lower()
        if lowered in _CLEAR_ALIASES:
            return await self.clear(session_id, key)
        if lowered == "pause":
            return await self.pause(session_id, key)
        if lowered == "resume":
            return await self.resume(session_id, key)
        if lowered == "budget" or lowered.startswith("budget "):
            parts = raw.split(maxsplit=2)
            if len(parts) != 2:
                return _error("用法：/goal budget <正整数> 或 /goal budget clear")
            return await self.budget(session_id, key, parts[1])
        # 自由文本 objective 里可能以 clear/pause 等词开头；只有整条输入
        # 等于子命令时才走控制分支，其余一律当目标。
        return await self.set(session_id, key, raw)

    # 以下每个方法是 /goal 的一个子动作（见 CommandDefinition.subcommands）；key 是幂等回执键（Slash 为消息 ID，Self-CLI 为 request_id）。
    async def show(self, session_id: str) -> CommandResult:
        goal = await self._store.get(session_id)
        return _success("当前没有目标" if goal is None else status_text(goal))

    async def set(self, session_id: str, key: str, raw: str) -> CommandResult:
        try:
            objective = normalize_objective(raw)
        except ValueError as error:
            return _error(str(error))
        last_error: Exception | None = None
        for _attempt in range(_RETRIES):
            head = await self._store.conversation_head(session_id)

            def action(current: Goal | None, *, head: int = head) -> tuple[Goal | None, str]:
                if current is not None and current.status is not GoalStatus.COMPLETE:
                    raise ValueError("当前目标尚未完成；先完成或清除它")
                goal = new_goal(
                    session_id=session_id,
                    goal_id=f"goal-{digest([session_id, objective, key])[:24]}",
                    objective=objective,
                    settled_through_seq=head,
                )
                return goal, f"目标已设置：{objective}"

            try:
                goal, text = await self._store.apply(
                    session_id, key, "command", digest({"set": objective}),
                    action, expected_head=head,
                )
            except MessageConflict as error:
                last_error = error
                continue
            except ValueError as error:
                return _error(str(error))
            return _success(text + "\n" + status_text(goal) if goal is not None else text)
        return _error(f"目标设置冲突，请重试：{last_error}")

    async def clear(self, session_id: str, key: str) -> CommandResult:
        def action(current: Goal | None) -> tuple[Goal | None, str]:
            if current is None:
                return None, "当前没有目标"
            return None, f"目标已清除：{current.objective}"

        _goal, text = await self._store.apply(
            session_id, key, "command", digest({"clear": True}), action,
        )
        return _success(text)

    async def pause(self, session_id: str, key: str) -> CommandResult:
        def action(current: Goal | None) -> tuple[Goal | None, str]:
            if current is None:
                raise ValueError("当前没有目标")
            goal = pause(current, "用户暂停目标")
            return goal, f"目标已暂停：{goal.objective}"

        try:
            _goal, text = await self._store.apply(
                session_id, key, "command", digest({"pause": True}), action,
            )
        except ValueError as error:
            return _error(str(error))
        return _success(text)

    async def resume(self, session_id: str, key: str) -> CommandResult:
        def action(current: Goal | None) -> tuple[Goal | None, str]:
            if current is None:
                raise ValueError("当前没有目标")
            goal = resume(current)
            return goal, f"目标已恢复：{goal.objective}"

        try:
            _goal, text = await self._store.apply(
                session_id, key, "command", digest({"resume": True}), action,
            )
        except ValueError as error:
            return _error(str(error))
        return _success(text)

    async def budget(self, session_id: str, key: str, raw: str) -> CommandResult:
        value = raw.strip().lower()
        try:
            budget = None if value == "clear" else normalize_token_budget(int(value))
        except (ValueError, TypeError) as error:
            return _error(f"预算无效：{error}")

        def action(current: Goal | None) -> tuple[Goal | None, str]:
            if current is None:
                raise ValueError("当前没有目标")
            goal = set_token_budget(current, budget)
            return goal, (
                "目标预算已清除" if budget is None
                else f"目标预算已设为 {budget} tokens"
            )

        try:
            goal, text = await self._store.apply(
                session_id, key, "command",
                digest({"budget": budget}), action,
            )
        except ValueError as error:
            return _error(str(error))
        return _success(text + ("" if goal is None else "\n" + status_text(goal)))



def _handler(
    owner: Context, action: Callable[[str, str, OperationRequest], Awaitable[CommandResult]],
) -> Callable[[OperationRequest], Awaitable[OperationResult]]:
    async def handle(req: OperationRequest) -> OperationResult:
        if not req.session_id:
            return OperationResult(False, "目标属于会话；请在会话内调用", error_code="missing_session")
        # 回执键沿用 request_id，重放同一请求得到同一结果；没有时本次调用单独成键。
        # 与 Slash 一样在本插件的 activation 里执行：目标状态按 owner 身份打开。
        async with owner.runtime_scope():
            result = await action(req.session_id, req.request_id or f"self:{uuid4().hex}", req)
        ok = result.kind == "success"
        return OperationResult(ok, result.text, error_code=None if ok else "rejected")
    return handle


# /goal 每个子动作一个 operation，与 Slash 共用 GoalCommand 的同名方法；operations 插件不在场时 /goal 照常工作。
async def register_operations(ctx: Context, owner: Context, command: GoalCommand) -> None:
    operations = ctx.require(OPERATIONS_V1)
    specs = (
        OperationSpec("goal.show", ("goal", "show"), "查看当前会话的目标",
                      _handler(owner, lambda sid, _key, _req: command.show(sid)), mirrors=("slash:goal#show",)),
        OperationSpec("goal.set", ("goal", "set"), "设置持久目标并自动续跑（当前目标未完成时拒绝）",
                      _handler(owner, lambda sid, key, req: command.set(sid, key, str(req.args["objective"]))),
                      options=(OptionSpec("objective", "要追求的具体目标", required=True),),
                      mirrors=("slash:goal#set",)),
        OperationSpec("goal.pause", ("goal", "pause"), "暂停当前目标",
                      _handler(owner, lambda sid, key, _req: command.pause(sid, key)), mirrors=("slash:goal#pause",)),
        OperationSpec("goal.resume", ("goal", "resume"), "恢复已暂停或阻塞的目标",
                      _handler(owner, lambda sid, key, _req: command.resume(sid, key)), mirrors=("slash:goal#resume",)),
        OperationSpec("goal.clear", ("goal", "clear"), "清除当前目标",
                      _handler(owner, lambda sid, key, _req: command.clear(sid, key)), mirrors=("slash:goal#clear",)),
        OperationSpec("goal.budget", ("goal", "budget"), "设置或清除目标 token 预算",
                      _handler(owner, lambda sid, key, req: command.budget(sid, key, str(req.args["tokens"]))),
                      options=(OptionSpec("tokens", "正整数 token 预算，或 clear 清除", required=True),),
                      mirrors=("slash:goal#budget",)),
    )
    for spec in specs:
        _ = await operations.register(ctx, spec)
