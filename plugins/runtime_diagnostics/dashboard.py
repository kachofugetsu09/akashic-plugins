"""Web 请求保留既有 UI 授权；只读导出与剖析控制分别登记。"""
from __future__ import annotations

from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ConfigDict, Field

from agent.plugin_composition.requests import RequestContext
from plugins.runtime_diagnostics.contract import DIAGNOSTICS
from .profiling import PROFILES, ProfileBusy

inject = (DIAGNOSTICS, PROFILES)


class ProfileRequest(BaseModel):
    model_config = ConfigDict(extra="forbid", strict=True)
    seconds: int = Field(default=30, ge=10, le=120)


def register(app: FastAPI, context: RequestContext) -> None:
    """不接受文件路径、日志内容或任意执行参数。"""
    @app.get("/api/dashboard/runtime-diagnostics")
    async def read(after: int = Query(default=0, ge=0)) -> JSONResponse:
        report = context.require(DIAGNOSTICS).read(after=after)
        report["profile"] = context.require(PROFILES).status()
        return JSONResponse(report, headers={"Cache-Control": "no-store"})

    @app.get("/api/dashboard/runtime-diagnostics/export")
    async def export() -> JSONResponse:
        report = context.require(DIAGNOSTICS).read()
        report["profile"] = context.require(PROFILES).status()
        return JSONResponse(report, headers={"Cache-Control": "no-store",
                            "Content-Disposition": 'attachment; filename="akashic-diagnostics.json"'})

    @app.post("/api/dashboard/runtime-diagnostics/profile")
    async def start(request: ProfileRequest) -> dict[str, object]:
        try:
            return await context.require(PROFILES).start(request.seconds)
        except ProfileBusy as error:
            raise HTTPException(409, str(error)) from error

    @app.post("/api/dashboard/runtime-diagnostics/profile/stop")
    async def stop() -> dict[str, object]:
        return await context.require(PROFILES).stop()
