"""Akasha 在 self 下的操作：记忆策略读写、按轮召回、重建，以及随任意 scope 创建一起固定的 `--akasha.*` 参数。

Akasha 不知道维度由哪个插件拥有：扩展挂在 `scope.create` 扩展点上，
由维度 owner（如 projects）在自己的联合事务里一起提交。
"""
from __future__ import annotations

from collections.abc import Awaitable, Callable, Mapping
from typing import cast

from agent.plugin_composition import Context
from plugins.commands.contract import CommandResult
from plugins.ledger.contract import OwnerWrite
from plugins.operations.contract import (
    OPERATIONS_V1,
    ExtensionSpec,
    OperationRequest,
    OperationResult,
    OperationSpec,
    OptionSpec,
    QueryHandler,
    QueryMirror,
    register_query_mirrors,
)

from .scopes import LEARN_POLICIES, LearnPolicy, ScopePolicies

_SCOPE = (OptionSpec("dimension", "维度名，如 project", required=True), OptionSpec("value", "维度取值", required=True))

MIRRORS = (
    QueryMirror("scope.policy.get", ("memory", "policy", "get"), "读取某个范围的记忆策略", _SCOPE),
    QueryMirror(
        "scope.policy.set", ("memory", "policy", "set"), "固定某个范围的记忆策略（只能在该范围出现第一个会话前设置一次）",
        (*_SCOPE, OptionSpec("learn", "学习去向", required=True, choices=LEARN_POLICIES),
         OptionSpec("recall", "是否召回", value_type="bool", default=True)),
    ),
    QueryMirror(
        "scope.policy.list", ("memory", "policy", "list"), "批量读取多个范围的记忆策略",
        (OptionSpec("scopes", "JSON 数组：[{dimension, value}, ...]", value_type="json", required=True),),
    ),
    QueryMirror(
        "recall.turn", ("memory", "recall", "turn"), "查看当前会话某一轮回复前召回了哪些记忆",
        (OptionSpec("message_id", "该轮输入的消息 ID", required=True), OptionSpec("source", "消息来源", required=True),
         OptionSpec("offset", "分页偏移", value_type="int", default=0)),
    ),
)


# 联合写入前的校验：界面只能表示 recall=false 搭配 learn=off（「不使用记忆」），CLI 不开放界面无法显示的组合。
async def _validate(_req: OperationRequest, values: Mapping[str, object]) -> None:
    if values.get("recall") is False and values.get("learn", "global") != "off":
        raise ValueError("关闭召回只能与 --akasha.learn off 一起使用")


def _stager(policies: ScopePolicies) -> Callable[[OperationRequest, Mapping[str, object], Mapping[str, object]], Awaitable[OwnerWrite | None]]:
    async def stage(_req: OperationRequest, values: Mapping[str, object], target: Mapping[str, object]) -> OwnerWrite:
        dimension, value = target.get("dimension"), target.get("value")
        if not isinstance(dimension, str) or not isinstance(value, str):
            raise ValueError("主操作没有给出 scope 目标")
        learn = cast(LearnPolicy, values.get("learn", "global"))
        recall = values.get("recall", True)
        return OwnerWrite(policies.store, policies.writer(dimension, value, learn, recall=recall is True))
    return stage


async def register_operations(
    ctx: Context, *, query: QueryHandler, policies: ScopePolicies,
    reindex: Callable[[], Awaitable[CommandResult]],
) -> None:
    """软挂载：没有 operations 插件时什么都不注册。"""
    async def handle_reindex(req: OperationRequest) -> OperationResult:
        if req.args.get("confirm") is not True:
            return OperationResult(False, "重建会整体替换派生学习图；确认后加 --confirm 执行", error_code="confirm_required")
        result = await reindex()
        return OperationResult(result.kind == "success", result.text)

    async def register(child: Context) -> None:
        operations = child.require(OPERATIONS_V1)
        await register_query_mirrors(child, operations, query=query, mirrors=MIRRORS)
        _ = await operations.register(child, OperationSpec(
            operation_id="akasha.reindex", path=("memory", "reindex"),
            summary="从 canonical 来源全量重建 Akasha 学习图（等同 /akasha_reindex confirm）",
            handler=ctx.entrypoint(handle_reindex), mirrors=("slash:akasha_reindex",),
            options=(OptionSpec("confirm", "确认执行", value_type="bool"),),
        ))
        _ = await operations.extend(child, ExtensionSpec(
            namespace="akasha", extension_point="scope.create",
            description="新范围的记忆策略，随范围创建一起固定",
            options=(
                OptionSpec("learn", "学习去向：global 共享 / isolated 独立 / off 不学习", choices=LEARN_POLICIES, set_once=True),
                OptionSpec("recall", "是否召回；false 只能配 learn=off", value_type="bool", set_once=True),
            ),
            validate=_validate, stage=_stager(policies),
        ))

    _ = await ctx.inject((OPERATIONS_V1,), register, name="operations")
