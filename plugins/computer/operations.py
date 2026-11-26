"""self 命令里的浏览器面板动作：与面板按钮走同一网关视图动作（唤醒、重启、切换/新开/关闭标签、导航、在场续期）。"""
from __future__ import annotations

import asyncio
from collections.abc import Callable, Mapping
import json

import httpx

from agent.plugin_composition import Context
from plugins.operations.contract import (
    OPERATIONS_V1, OperationHandler, OperationRequest, OperationResult, OperationSpec, OptionSpec,
)

from .view import NAVIGATE_ACTIONS, GatewayError, ViewAction, call_view

_TARGET = OptionSpec("target", "标签 ID（来自 computer activity 的 targets）")


# 面板路由用常驻客户端；这里每次按当前 generation 的网关地址临时建一个，超时与面板一致。
def _request(gateway: str, action: ViewAction, payload: Mapping[str, object]) -> object:
    with httpx.Client(base_url=gateway, timeout=125.0) as client:
        body = call_view(client, action, payload)
    return json.loads(body) if body else {}


def _handler(gateway: Callable[[], str], action: ViewAction) -> OperationHandler:
    async def handle(req: OperationRequest) -> OperationResult:
        payload = {key: value for key, value in req.args.items() if value is not None}
        try:
            value = await asyncio.to_thread(_request, gateway(), action, payload)
        except GatewayError as error:
            code = "rejected" if error.status == 400 else "unavailable"
            return OperationResult(False, str(error), error_code=code)
        except RuntimeError as error:
            return OperationResult(False, f"浏览器还没有就绪：{error}", error_code="unavailable")
        data = value if isinstance(value, dict) else {"value": value}
        return OperationResult(True, f"computer {action} 完成", data=data)
    return handle


async def register_operations(ctx: Context, gateway: Callable[[], str]) -> None:
    operations = ctx.require(OPERATIONS_V1)
    _ = await operations.register(ctx, OperationSpec(
        operation_id="computer.activity", path=("computer", "activity"), summary="读取浏览器状态、标签列表与当前操作位置",
        handler=_handler(gateway, "activity"),
        mirrors=("http:computer:GET /api/dashboard/computer/activity",),
    ))
    _ = await operations.register(ctx, OperationSpec(
        operation_id="computer.wake", path=("computer", "wake"), summary="唤醒休眠的浏览器",
        handler=_handler(gateway, "wake"),
        mirrors=("http:computer:POST /api/dashboard/computer/wake",),
    ))
    _ = await operations.register(ctx, OperationSpec(
        operation_id="computer.restart", path=("computer", "restart"), summary="重启浏览器（保留登录状态）",
        handler=_handler(gateway, "restart"),
        mirrors=("http:computer:POST /api/dashboard/computer/restart",),
    ))
    _ = await operations.register(ctx, OperationSpec(
        operation_id="computer.show", path=("computer", "show"), summary="把一个标签切到屏幕最前",
        handler=_handler(gateway, "show"), options=(_TARGET,),
        mirrors=("http:computer:POST /api/dashboard/computer/show",),
    ))
    _ = await operations.register(ctx, OperationSpec(
        operation_id="computer.navigate", path=("computer", "navigate"), summary="在标签里打开地址、前进、后退或刷新",
        handler=_handler(gateway, "navigate"),
        options=(_TARGET, OptionSpec("action", "导航动作", required=True, choices=NAVIGATE_ACTIONS),
                 OptionSpec("url", "action=go 时的地址")),
        mirrors=("http:computer:POST /api/dashboard/computer/navigate",),
    ))
    _ = await operations.register(ctx, OperationSpec(
        operation_id="computer.open", path=("computer", "open"), summary="新开一个标签（可带地址）",
        handler=_handler(gateway, "open"), options=(OptionSpec("url", "新标签的地址"),),
        mirrors=("http:computer:POST /api/dashboard/computer/open",),
    ))
    _ = await operations.register(ctx, OperationSpec(
        operation_id="computer.close", path=("computer", "close"), summary="关闭一个标签",
        handler=_handler(gateway, "close"), options=(OptionSpec("target", "标签 ID", required=True),),
        mirrors=("http:computer:POST /api/dashboard/computer/close",),
    ))
    # 续期代表“人正在面板前操作”：Agent 的下一步会等人停手，Agent 不能替人声明在场。
    _ = await operations.register(ctx, OperationSpec(
        operation_id="computer.touch", path=("computer", "touch"), summary="声明用户正在直接操作画面并续期短租约",
        handler=_handler(gateway, "touch"), options=(OptionSpec("input", "是否正在键鼠输入", "bool", default=False),),
        audience="user_only",
        mirrors=("http:computer:POST /api/dashboard/computer/touch",),
    ))
