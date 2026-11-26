"""Subagent Workbench 与配置 HTTP 路由：暴露会话树血缘、子流读取、Steer/续聊与取消控制。"""
from __future__ import annotations

from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel, ConfigDict, Field

from agent.plugin_composition import DashboardContext, ServiceKey
from plugins.jobs.contract import JOB_NOTICES
from plugins.ui.contract import SETTINGS_SLOT, UI, Configuration

from .control import cancel_job, read_messages, send_message, session_tree, stop_runner
from .runners import Runners
from .runtime import SubagentBusy, Subagents

SETTINGS = ServiceKey[Configuration]("subagent.settings.v1")
SUBAGENT_UI_SERVICE = ServiceKey[tuple[Subagents, Runners]]("subagent.ui_service.v1")
CONVERSATION_TOOLS_V2_DIGEST = "b3f5e9aea07351d69ab1ae55d2dcf18c5e352fc61b6354d4af34dbeca16787eb"
UI_CONTRACT_DIGESTS = {
    **SETTINGS_SLOT,
    "conversation.tools.v2": CONVERSATION_TOOLS_V2_DIGEST,
}

inject = (UI, SETTINGS, SUBAGENT_UI_SERVICE, JOB_NOTICES)


class SendBody(BaseModel):
    model_config = ConfigDict(extra="forbid")
    session: str = Field(min_length=1, max_length=512)
    job_id: str = Field(min_length=1, max_length=64)
    message: str = Field(min_length=1, max_length=32000)


class CancelBody(BaseModel):
    model_config = ConfigDict(extra="forbid")
    session: str = Field(min_length=1, max_length=512)
    job_id: str = Field(min_length=1, max_length=64)


def register(app: FastAPI, context: DashboardContext) -> None:
    context.require(UI).register_configuration(app, context, SETTINGS, "/api/dashboard/subagent/config")

    @app.get("/api/dashboard/subagent/tree")
    async def tree(session: str = Query(min_length=1, max_length=512)) -> dict[str, object]:
        jobs, runners = context.require(SUBAGENT_UI_SERVICE)
        return await session_tree(jobs, runners, session)

    @app.get("/api/dashboard/subagent/messages")
    async def messages(
        session: str = Query(min_length=1, max_length=512),
        job_id: str = Query(min_length=1, max_length=64),
        after_seq: int = Query(default=-1, ge=-1),
        before_seq: int | None = Query(default=None, ge=0),
        limit: int = Query(default=100, ge=1, le=200),
    ) -> dict[str, object]:
        jobs, _ = context.require(SUBAGENT_UI_SERVICE)
        try:
            return await read_messages(jobs, session, job_id, after_seq=after_seq, before_seq=before_seq, limit=limit)
        except PermissionError as error:
            raise HTTPException(status_code=403, detail=str(error)) from None
        except LookupError as error:
            raise HTTPException(status_code=404, detail=str(error)) from None

    @app.post("/api/dashboard/subagent/send")
    async def send(body: SendBody) -> dict[str, object]:
        jobs, _ = context.require(SUBAGENT_UI_SERVICE)
        try:
            return await send_message(jobs, body.session, body.job_id, body.message)
        except PermissionError as error:
            raise HTTPException(status_code=403, detail=str(error)) from None
        except LookupError as error:
            raise HTTPException(status_code=404, detail=str(error)) from None
        except SubagentBusy as error:
            raise HTTPException(status_code=409, detail=str(error)) from None
        except ValueError as error:
            raise HTTPException(status_code=422, detail=str(error)) from None

    @app.post("/api/dashboard/subagent/cancel")
    async def cancel(body: CancelBody) -> dict[str, object]:
        jobs, _ = context.require(SUBAGENT_UI_SERVICE)
        try:
            return await cancel_job(jobs, body.session, body.job_id)
        except LookupError as error:
            raise HTTPException(status_code=404, detail=str(error)) from None

    @app.post("/api/dashboard/subagent/runner-stop")
    async def runner_stop(body: CancelBody) -> dict[str, object]:
        _, runners = context.require(SUBAGENT_UI_SERVICE)
        try:
            return await stop_runner(runners, context.require(JOB_NOTICES), body.session, body.job_id)
        except LookupError as error:
            raise HTTPException(status_code=404, detail=str(error)) from None
