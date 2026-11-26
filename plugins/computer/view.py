"""浏览器面板对网关的视图动作：面板路由与 self 命令共用同一份网关路径、载荷形状与错误语义。"""
from __future__ import annotations

from collections.abc import Mapping
from typing import Literal, cast

import httpx

ViewAction = Literal["activity", "wake", "restart", "show", "navigate", "open", "close", "touch"]
NAVIGATE_ACTIONS = ("go", "back", "forward", "reload")

# 每个动作的网关方法、路径与放行的载荷键；GET 不带请求体。
_ROUTES: dict[ViewAction, tuple[str, str, tuple[str, ...]]] = {
    "activity": ("GET", "/activity", ()),
    "wake": ("POST", "/wake", ()),
    "restart": ("POST", "/restart", ()),
    "show": ("POST", "/view/show", ("target",)),
    "navigate": ("POST", "/view/navigate", ("target", "action", "url")),
    "open": ("POST", "/view/open", ("url",)),
    "close": ("POST", "/view/close", ("target",)),
    "touch": ("POST", "/view/touch", ("input",)),
}


class GatewayError(RuntimeError):
    """网关拒绝（400，调用方可改参数重试）或不可用（502）。"""

    def __init__(self, status: int, message: str) -> None:
        super().__init__(message)
        self.status = status


def _gateway_error(response: httpx.Response) -> str:
    value: object = response.json()
    message = cast(dict[str, object], value).get("error") if isinstance(value, dict) else None
    return message if isinstance(message, str) else f"Computer returned {response.status_code}"


# 网关原样回包；连不上与 5xx 一律报不可用，400 保留网关给的原因。
def gateway_request(client: httpx.Client, method: str, path: str, payload: object | None = None) -> httpx.Response:
    try:
        response = client.request(method, path, json=payload)
    except httpx.HTTPError as error:
        raise GatewayError(502, str(error)) from error
    if response.status_code >= 400:
        raise GatewayError(400 if response.status_code == 400 else 502, _gateway_error(response))
    return response


# show 总带 target（空表示回到前台标签）；touch 的 input 归一为布尔；其余只转发给出的键。
def view_body(action: ViewAction, payload: Mapping[str, object]) -> dict[str, object] | None:
    method, _, keys = _ROUTES[action]
    if method == "GET":
        return None
    if action == "show":
        return {"target": str(payload.get("target") or "")}
    if action == "touch":
        return {"input": bool(payload.get("input"))}
    return {key: payload[key] for key in keys if key in payload}


def call_view(client: httpx.Client, action: ViewAction, payload: Mapping[str, object]) -> bytes:
    method, path, _ = _ROUTES[action]
    return gateway_request(client, method, path, view_body(action, payload)).content
