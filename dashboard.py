"""Authenticated dashboard routes; paths refer to the execution host, not Core."""
from __future__ import annotations

from collections.abc import AsyncIterator
import os
from pathlib import Path
from urllib.parse import quote

from fastapi import FastAPI, Query, Request, WebSocket
from fastapi.responses import JSONResponse, Response, StreamingResponse
from starlette.types import Scope

from agent.plugin_composition import DashboardContext
from plugins.host_execution.contract import FILE_IMPORT_BYTES, FILES, FileError
from plugins.ui.contract import CompressedStaticFiles
from plugins.working_directory.contract import WORKING_DIRECTORY

from .browse import FileBrowser, workspace_candidate
from .live import READER_LIVE

inject = (FILES, WORKING_DIRECTORY, READER_LIVE)
ASSETS = "/file_viewer/assets/"
VIEWER = "viewer.html"
VIEWER_POLICY = (
    "default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; "
    "img-src 'self' data: blob:; font-src 'self' data: blob:; connect-src 'self' data: blob:; "
    "worker-src 'self' blob:; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'self'"
)


class _ViewerAssets(CompressedStaticFiles):
    def file_response(
        self,
        full_path: os.PathLike[str] | str,
        stat_result: os.stat_result,
        scope: Scope,
        status_code: int = 200,
    ) -> Response:
        response = super().file_response(full_path, stat_result, scope, status_code)
        is_html = str(full_path).endswith(".html")
        response.headers["Cache-Control"] = "no-cache" if is_html else "public, max-age=31536000, immutable"
        if Path(full_path).name == VIEWER:
            response.headers["Content-Security-Policy"] = VIEWER_POLICY
        return response


def asset_names(plugin_dir: Path) -> tuple[str, ...]:
    folder = plugin_dir / "static"
    if not folder.is_dir():
        return ()
    return tuple(sorted(path.relative_to(folder).as_posix() for path in folder.rglob("*") if path.is_file()))


def _asset_route(app: FastAPI, assets: _ViewerAssets, name: str) -> None:
    async def asset(request: Request) -> Response:
        return await assets.get_response(name, request.scope)

    app.add_api_route(f"{ASSETS}{name}", asset, methods=["GET"], include_in_schema=False)


def _detect_image_mime(head: bytes) -> str | None:
    if head.startswith(b"\x89PNG\r\n\x1a\n"):
        return "image/png"
    if head.startswith(b"\xff\xd8\xff"):
        return "image/jpeg"
    if len(head) >= 12 and head[:4] == b"RIFF" and head[8:12] == b"WEBP":
        return "image/webp"
    if head.startswith((b"GIF87a", b"GIF89a")):
        return "image/gif"
    return None


def register(app: FastAPI, context: DashboardContext) -> None:
    assets = _ViewerAssets(directory=context.plugin_dir / "static", check_dir=False)
    for name in asset_names(context.plugin_dir):
        _asset_route(app, assets, name)

    @app.websocket("/api/dashboard/file_viewer/live")
    async def live(socket: WebSocket, session: str = Query(min_length=1, max_length=512)) -> None:
        await context.require(READER_LIVE).serve(socket, session)

    browser = FileBrowser(workspace_candidate(context.data_root))

    @app.get("/api/dashboard/file_viewer/files")
    async def files(
        session: str = Query(default="", max_length=512),
        path: str = Query(default="", max_length=4096),
        after: str | None = Query(default=None, max_length=512),
        hidden: bool = Query(default=False),
    ) -> dict[str, object]:
        return await browser.files(context.require(FILES), context.require(WORKING_DIRECTORY),
                                   session=session, path=path, after=after, hidden=hidden)

    @app.get("/api/dashboard/file_viewer/document")
    async def document(
        session: str = Query(default="", max_length=512),
        path: str = Query(min_length=1, max_length=4096),
        tail: bool = Query(default=False),
    ) -> dict[str, object]:
        return await browser.document(context.require(FILES), context.require(WORKING_DIRECTORY),
                                      session=session, path=path, tail=tail)

    @app.get("/api/dashboard/file_viewer/raw")
    async def raw(
        session: str = Query(default="", max_length=512),
        path: str = Query(min_length=1, max_length=4096),
        download: bool = Query(default=False),
    ) -> Response:
        files_service = context.require(FILES)
        async with files_service.paths() as reader:
            target, err = await browser.target(reader, context.require(WORKING_DIRECTORY), session, path)
        if err is not None or target is None:
            return JSONResponse({"status": "invalid_path", **(err or {})}, status_code=400)
        async with files_service.bytes() as byte_reader:
            first = await byte_reader.read(target, offset=0)
            if isinstance(first, FileError):
                status_code = 413 if f"{FILE_IMPORT_BYTES // (1024 * 1024)} MiB" in first.text else 400
                return JSONResponse({"status": "error", "message": first.text}, status_code=status_code)
            image_mime = None if download else _detect_image_mime(first.data)
            media_type = image_mime or "application/octet-stream"
            mode = "inline" if image_mime else "attachment"
            headers = {
                "Content-Disposition": f"{mode}; filename*=UTF-8''{quote(first.filename)}",
                "Content-Length": str(first.size),
                "X-Content-Type-Options": "nosniff",
                "Content-Security-Policy": "default-src 'none'",
                "Cache-Control": "private, no-store",
            }
            if len(first.data) >= first.size:
                return Response(content=first.data, media_type=media_type, headers=headers)

        async def stream() -> AsyncIterator[bytes]:
            yield first.data
            offset = len(first.data)
            async with files_service.bytes() as rest_reader:
                while offset < first.size:
                    chunk = await rest_reader.read(target, offset=offset, version=first.version)
                    if isinstance(chunk, FileError) or not chunk.data:
                        break
                    yield chunk.data
                    offset += len(chunk.data)

        return StreamingResponse(stream(), media_type=media_type, headers=headers)
