"""self 命令里的手机看屏助手：与手机浮条、半屏浮层同一组动作；替人提问与上报屏幕的动作只给用户本人。"""
from __future__ import annotations

from collections.abc import Awaitable, Callable
from typing import Any

from fastapi import HTTPException

from agent.plugin_composition import Context
from plugins.operations.contract import OPERATIONS_V1, OperationHandler, OperationRequest, OperationResult, OperationSpec, OptionSpec

from .server import AssistActions

_SCREEN = (
    OptionSpec("source", "唤起来源（默认 nav_handle）"),
    OptionSpec("package_name", "前台应用包名"),
    OptionSpec("app_label", "前台应用名"),
    OptionSpec("captured_at", "采集时间（HH:MM）"),
    OptionSpec("ui_tree_text", "屏幕可见文本/控件摘录"),
    OptionSpec("screenshot_png_b64", "屏幕截图（PNG/JPEG 的 base64）"),
)


def _rejected(error: HTTPException) -> OperationResult:
    return OperationResult(False, str(error.detail), data={"status": error.status_code}, error_code="rejected")


# 参数名即浮层请求体的键；拒绝沿用浮层的状态码与原因。
def _body(action: Callable[[dict[str, Any]], Awaitable[dict[str, object]]], done: str) -> OperationHandler:
    async def handle(req: OperationRequest) -> OperationResult:
        body: dict[str, Any] = {key: value for key, value in req.args.items() if value is not None}
        try:
            return OperationResult(True, done, data=await action(body))
        except HTTPException as error:
            return _rejected(error)
    return handle


def _keyed(action: Callable[[str], Awaitable[dict[str, object]]], key: str, done: str) -> OperationHandler:
    async def handle(req: OperationRequest) -> OperationResult:
        try:
            return OperationResult(True, done, data=await action(str(req.args.get(key) or "")))
        except HTTPException as error:
            return _rejected(error)
    return handle


async def register_operations(ctx: Context, actions: AssistActions) -> None:
    async def resume(_req: OperationRequest) -> OperationResult:
        return OperationResult(True, "最近的手机会话", data=await actions.resume())

    operations = ctx.require(OPERATIONS_V1)
    _ = await operations.register(ctx, OperationSpec(
        operation_id="phone_assist.resume", path=("phone_assist", "resume"), summary="续聊窗口内最近一次手机助手会话",
        handler=resume, mirrors=("http:phone_assist:GET /api/phone-assist/resume",),
    ))
    _ = await operations.register(ctx, OperationSpec(
        operation_id="phone_assist.history", path=("phone_assist", "history"), summary="读取手机助手会话的消息摘要",
        handler=_keyed(actions.history, "session_id", "手机会话历史"),
        options=(OptionSpec("session_id", "受管的手机会话 ID", required=True),),
        mirrors=("http:phone_assist:GET /api/phone-assist/history/{session_id}",),
    ))
    _ = await operations.register(ctx, OperationSpec(
        operation_id="phone_assist.invoke_show", path=("phone_assist", "invoke", "show"), summary="读取一次看屏唤起的快照",
        handler=_keyed(actions.get_invoke, "invoke_id", "看屏唤起快照"),
        options=(OptionSpec("invoke_id", "唤起 ID", required=True),),
        mirrors=("http:phone_assist:GET /api/phone-assist/invoke/{invoke_id}",),
    ))
    # 下面三个以用户本人的身份提问或上报屏幕：消息按用户输入入账，Agent 不能代人发起（ADR-0145）。
    _ = await operations.register(ctx, OperationSpec(
        operation_id="phone_assist.invoke", path=("phone_assist", "invoke", "create"), summary="登记一次看屏唤起（屏幕截图与控件摘录）",
        handler=_body(actions.invoke, "已登记看屏唤起"), options=_SCREEN, audience="user_only",
        mirrors=("http:phone_assist:POST /api/phone-assist/invoke",),
    ))
    _ = await operations.register(ctx, OperationSpec(
        operation_id="phone_assist.send", path=("phone_assist", "send"), summary="在看屏唤起上向手机会话提问",
        handler=_body(actions.send, "已发送"), audience="user_only",
        options=(OptionSpec("invoke_id", "唤起 ID", required=True), OptionSpec("text", "提问内容", required=True),
                 OptionSpec("session_id", "续聊的会话 ID；省略时新开"),
                 OptionSpec("client_request_id", "幂等键：同一唤起内重复提交返回第一次的结果"),
                 OptionSpec("include_screenshot", "首条消息带截图", "bool"), OptionSpec("include_ui_tree", "首条消息带控件摘录", "bool")),
        mirrors=("http:phone_assist:POST /api/phone-assist/send",),
    ))
    _ = await operations.register(ctx, OperationSpec(
        operation_id="phone_assist.ask", path=("phone_assist", "ask"), summary="一步完成看屏提问（导入截图、建会话并发送）",
        handler=_body(actions.ask, "已发送"), audience="user_only",
        options=(OptionSpec("text", "提问内容", required=True), OptionSpec("session_id", "续聊的会话 ID；省略时新开"),
                 OptionSpec("include_screenshot", "带上截图", "bool"), *_SCREEN),
        mirrors=("http:phone_assist:POST /api/phone-assist/ask",),
    ))
