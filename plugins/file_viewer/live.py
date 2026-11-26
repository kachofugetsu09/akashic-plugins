"""文件工作台的实时通道：把 Agent 主动打开的文件与定位锚点推给同一会话里打开的侧边栏。"""
from __future__ import annotations

import asyncio
import json
from dataclasses import dataclass

from fastapi import WebSocket, WebSocketDisconnect

from agent.plugin_composition import ServiceKey

MAX_MESSAGE = 16 * 1024
SEND_TIMEOUT_SECONDS = 2.0


@dataclass(eq=False)
class _Client:
    socket: WebSocket
    session: str


class ReaderLive:
    """登记每个会话里连着的文件标签；只往外推打开与定位指令，无连接时返回 0。"""

    def __init__(self) -> None:
        self._clients: dict[str, list[_Client]] = {}

    async def serve(self, socket: WebSocket, session: str) -> None:
        await socket.accept()
        client = _Client(socket, session)
        self._clients.setdefault(session, []).append(client)
        try:
            while True:
                message = await socket.receive()
                if message.get("type") == "websocket.disconnect":
                    return
                text = message.get("text")
                data = message.get("bytes")
                if data is not None or (isinstance(text, str) and len(text) > MAX_MESSAGE):
                    await socket.close(code=1009, reason="reader message rejected")
                    return
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
        if page is not None:
            payload["page"] = page
        if line is not None:
            payload["line"] = line
        if sheet:
            payload["sheet"] = sheet
        if search:
            payload["search"] = search
        if note:
            payload["note"] = note
        return await self._send(session, payload)

    async def _send(self, session: str, message: dict[str, object]) -> int:
        peers = list(self._clients.get(session, ()))
        if not peers:
            return 0
        text = json.dumps(message, ensure_ascii=False)

        async def _deliver(client: _Client) -> bool:
            try:
                await asyncio.wait_for(client.socket.send_text(text), timeout=SEND_TIMEOUT_SECONDS)
                return True
            except (TimeoutError, RuntimeError, WebSocketDisconnect):
                self._remove(client)
                return False

        results = await asyncio.gather(*(_deliver(client) for client in peers), return_exceptions=True)
        return sum(1 for ok in results if ok is True)

    def _remove(self, client: _Client) -> None:
        peers = self._clients.get(client.session)
        if not peers:
            return
        if client in peers:
            peers.remove(client)
        if not peers:
            _ = self._clients.pop(client.session, None)


READER_LIVE = ServiceKey[ReaderLive]("file_viewer.live.v1")
