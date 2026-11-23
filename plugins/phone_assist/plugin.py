"""手机看屏唤起与半屏浮层外置插件（phone-assist）。"""
from __future__ import annotations

from agent.plugin_composition import Context
from core.common.file_io import run_file_io
from plugins.channels.contract import CHANNEL_INPUT_V2
from plugins.ledger.contract import ARTIFACT_IMPORT, MESSAGE_CATALOG

from .server import start_assist_listener
from .store import (
    DEFAULT_PROJECT_ID,
    DEFAULT_PROJECT_NAME,
    DEFAULT_RESUME_WINDOW_SECONDS,
    AssistStore,
)

api_version = 3
name = "phone-assist"
version = "0.2.0"
desc = "手机端看屏唤起与半屏浮层对话：按住横条或默认助理唤起，自动折叠进「手机」项目"
inject = (CHANNEL_INPUT_V2, MESSAGE_CATALOG, ARTIFACT_IMPORT)


async def apply(ctx: Context) -> None:
    cfg = ctx.config if isinstance(ctx.config, dict) else {}
    project_id = str(cfg.get("project_id") or DEFAULT_PROJECT_ID)
    project_name = str(cfg.get("project_name") or DEFAULT_PROJECT_NAME)
    raw_window = cfg.get("resume_window_seconds")
    resume_window = (
        raw_window
        if isinstance(raw_window, int) and not isinstance(raw_window, bool)
        else DEFAULT_RESUME_WINDOW_SECONDS
    )

    store = AssistStore(
        ctx.data_root,
        project_id=project_id,
        project_name=project_name,
        resume_window_seconds=resume_window,
    )
    await run_file_io(store.load_sync)
    await start_assist_listener(ctx, store)
