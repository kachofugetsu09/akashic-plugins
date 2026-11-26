"""file_viewer 后端测试：live 通道广播与清理、open_document 工具校验与静态资产列表。"""
from __future__ import annotations

import asyncio
from pathlib import Path
from types import SimpleNamespace

import pytest
from fastapi import WebSocketDisconnect

from plugins.file_viewer.dashboard import VIEWER, VIEWER_POLICY, asset_names
from plugins.file_viewer.live import ReaderLive
from plugins.file_viewer.tools import OpenDocumentArgs


class _FakeSocket:
    def __init__(self, fail_after: int | None = None) -> None:
        self.accepted = False
        self.sent: list[str] = []
        self._fail_after = fail_after
        self._release = asyncio.Event()

    async def accept(self) -> None:
        self.accepted = True

    async def receive(self) -> dict[str, object]:
        await self._release.wait()
        return {"type": "websocket.disconnect"}

    async def send_text(self, text: str) -> None:
        if self._fail_after is not None and len(self.sent) >= self._fail_after:
            raise RuntimeError("broken pipe")
        self.sent.append(text)

    async def close(self, code: int = 1000, reason: str = "") -> None:
        _ = (code, reason)
        self._release.set()

    def disconnect(self) -> None:
        self._release.set()


def test_reader_live_broadcast_and_cleanup() -> None:
    async def run() -> None:
        live = ReaderLive()
        sock = _FakeSocket()
        task = asyncio.create_task(live.serve(sock, "s1"))  # type: ignore[arg-type]
        await asyncio.sleep(0)
        assert sock.accepted is True

        delivered = await live.open_document(
            "s1", turn="t1", path="/papers/demo.pdf", page=4, search="attention", note="定位第 4 页"
        )
        assert delivered == 1
        assert len(sock.sent) == 1
        assert '"page": 4' in sock.sent[0]
        assert '"search": "attention"' in sock.sent[0]

        # 其他会话不应收到
        assert await live.open_document("s2", turn="t2", path="/other.pdf") == 0

        sock.disconnect()
        await task
        assert await live.open_document("s1", turn="t3", path="/papers/demo.pdf") == 0

    asyncio.run(run())


def test_open_document_args_validation() -> None:
    req = OpenDocumentArgs.model_validate({"path": "docs/a.pdf", "page": 3, "sheet": "Sheet1", "search": "Raft"})
    assert req.path == "docs/a.pdf"
    assert req.page == 3
    with pytest.raises(Exception):
        OpenDocumentArgs.model_validate({"path": "docs/a.pdf", "page": 0})
    with pytest.raises(Exception):
        OpenDocumentArgs.model_validate({"path": "docs/a.pdf", "unknown": 1})


def test_asset_names_and_csp(tmp_path: Path) -> None:
    static = tmp_path / "static"
    static.mkdir()
    (static / VIEWER).write_text("<html></html>", encoding="utf-8")
    (static / "pdf.worker.mjs").write_text("", encoding="utf-8")
    (static / "subdir").mkdir()
    assert asset_names(tmp_path) == ("pdf.worker.mjs", "viewer.html")
    assert "'wasm-unsafe-eval'" in VIEWER_POLICY
    assert "worker-src 'self' blob:" in VIEWER_POLICY
    assert SimpleNamespace(path=tmp_path).path == tmp_path
