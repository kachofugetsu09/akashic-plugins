"""文件工作台的实时通道：把打开、定位、返回目录推给同一会话里的文件标签，并记下标签回报的当前视图。

没连上的会话把最后一条指令留着，标签连上时补推一次；标签每次换文件或回到目录都回报视图，self 读得到用户正在看什么。
"""
from __future__ import annotations

import asyncio
import json
from collections import OrderedDict
from dataclasses import dataclass
from typing import Literal, TypedDict

from fastapi import WebSocket, WebSocketDisconnect

from agent.plugin_composition import ServiceKey

MAX_MESSAGE = 16 * 1024
SEND_TIMEOUT_SECONDS = 2.0
# 只在内存里按会话保留，最旧的先丢；重启后由标签重连时回报的视图重新填上。
MAX_SESSIONS = 256


class ReaderView(TypedDict, total=False):
    mode: Literal["browse", "read"]
    path: str
    page: int


class ReaderState(TypedDict):
    connected: int
    view: ReaderView | None
    pending: dict[str, object] | None


@dataclass(eq=False)
class _Client:
    socket: WebSocket
    session: str


class ReaderLive:
    """登记每个会话里连着的文件标签：下行打开/返回指令，上行视图回报。"""

    def __init__(self) -> None:
        self._clients: dict[str, list[_Client]] = {}
        self._pending: OrderedDict[str, dict[str, object]] = OrderedDict()
        self._views: OrderedDict[str, ReaderView] = OrderedDict()

    async def serve(self, socket: WebSocket, session: str) -> None:
        await socket.accept()
        client = _Client(socket, session)
        self._clients.setdefault(session, []).append(client)
        try:
            # 1. 标签没连上时发出的指令，连上后补推一次。
            pending = self._pending.pop(session, None)
            if pending is not None and not await self._deliver(client, json.dumps(pending, ensure_ascii=False)):
                self._remember(self._pending, session, pending)
            # 2. 之后只收视图回报。
            while True:
                message = await socket.receive()
                if message.get("type") == "websocket.disconnect":
                    return
                text = message.get("text")
                if message.get("bytes") is not None or not isinstance(text, str) or len(text) > MAX_MESSAGE:
                    await socket.close(code=1009, reason="reader message rejected")
                    return
                self._record_view(session, text)
        except WebSocketDisconnect:
            return
        finally:
            self._remove(client)

    async def open_document(
        self,
        session: str,
        *,
        turn: str,
        path: str,
        page: int | None = None,
        line: int | None = None,
        sheet: str | None = None,
        search: str | None = None,
        note: str | None = None,
    ) -> int:
        payload: dict[str, object] = {"type": "open", "turn": turn, "path": path}
        optional: dict[str, object | None] = {"page": page, "line": line, "sheet": sheet or None,
                                              "search": search or None, "note": note or None}
        payload.update({key: value for key, value in optional.items() if value is not None})
        return await self._send(session, payload)

    async def close_document(self, session: str) -> int:
        return await self._send(session, {"type": "close"})

    def state(self, session: str) -> ReaderState:
        view = self._views.get(session)
        return ReaderState(connected=len(self._clients.get(session, ())), view=ReaderView(**view) if view else None,
                           pending=dict(self._pending[session]) if session in self._pending else None)

    # 没有连着的标签就留作待补推（同一会话只留最后一条）；推出去了就清掉旧的待补推。
    async def _send(self, session: str, message: dict[str, object]) -> int:
        peers = list(self._clients.get(session, ()))
        text = json.dumps(message, ensure_ascii=False)
        results = await asyncio.gather(*(self._deliver(client, text) for client in peers))
        delivered = sum(1 for ok in results if ok)
        if delivered:
            _ = self._pending.pop(session, None)
        else:
            self._remember(self._pending, session, message)
        return delivered

    async def _deliver(self, client: _Client, text: str) -> bool:
        try:
            await asyncio.wait_for(client.socket.send_text(text), timeout=SEND_TIMEOUT_SECONDS)
            return True
        except (TimeoutError, RuntimeError, WebSocketDisconnect):
            self._remove(client)
            return False

    def _record_view(self, session: str, text: str) -> None:
        try:
            raw = json.loads(text)
        except ValueError:
            return
        if not isinstance(raw, dict) or raw.get("type") != "view" or raw.get("mode") not in ("browse", "read"):
            return
        view = ReaderView(mode="read" if raw["mode"] == "read" else "browse")
        path = raw.get("path")
        if isinstance(path, str) and 0 < len(path) <= 4096:
            view["path"] = path
        page = raw.get("page")
        if isinstance(page, int) and not isinstance(page, bool) and page > 0:
            view["page"] = page
        self._remember(self._views, session, view)

    @staticmethod
    def _remember[T](store: OrderedDict[str, T], session: str, value: T) -> None:
        store[session] = value
        store.move_to_end(session)
        while len(store) > MAX_SESSIONS:
            _ = store.popitem(last=False)

    def _remove(self, client: _Client) -> None:
        peers = self._clients.get(client.session)
        if not peers:
            return
        if client in peers:
            peers.remove(client)
        if not peers:
            _ = self._clients.pop(client.session, None)


READER_LIVE = ServiceKey[ReaderLive]("file_viewer.live.v1")
