"""Kubai 线性动画图标外置插件：作为纯 ChatKernel 微内核插件，通过 DI 服务表提供 1,285 枚按 26 分类懒加载的线性图标。"""

from __future__ import annotations

from agent.plugin_composition import Context
from plugins.ui.contract import UI_SLOTS, PluginUiDefinition

api_version = 3
name = "kubai_icons"
version = "1.0.0"
desc = "Kubai 线性动画图标库（26 个官方分类、1,285 枚线性动画图标，按需分块加载）"
inject = (UI_SLOTS,)


async def apply(ctx: Context) -> None:
    """登记纯微内核前端模块与多 chunk 资产目录。"""

    async def query(
        method: str,
        payload: dict[str, object],
        *,
        session_id: str | None = None,
        turn_id: str | None = None,
    ) -> dict[str, object]:
        del method, payload, session_id, turn_id
        return {}

    _ = await ctx.require(UI_SLOTS).register_plugin_ui(
        ctx,
        PluginUiDefinition(
            module="plugin_ui.js",
            stylesheet="plugin_ui.css",
            slots=(),
            assets_dir="static/chunks",
            client_kernel=True,
        ),
        query=query,
    )
