"""侧栏顶部主对话的对外定义：别的插件只读当前指向哪段会话，不改指针。"""
from __future__ import annotations

from typing import Protocol

from agent.plugin_composition import ServiceKey


class MainSession(Protocol):
    # 当前固定在侧栏顶部的会话 ID（akashic:xxxx）；还没选定或已取消时为 None。
    def current(self) -> str | None: ...


MAIN_SESSION = ServiceKey[MainSession]("main_session.current.v1")
