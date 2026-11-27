"""Kubai 线性动画图标外置插件：通过 icon.provider 提供 1,285 枚按官方 26 分类懒加载的线性图标。"""
from __future__ import annotations

import dataclasses
from agent.plugin_composition import Context
from plugins.ui.contract import PLUGIN_UI_SLOTS, UI_SLOTS, PluginUiDefinition

api_version = 3
name = "kubai_icons"
version = "1.0.0"
desc = "Kubai 线性动画图标扩展（1,285 枚，按官方 26 分类按需懒加载）"
inject = (UI_SLOTS,)


def _supports_v2_icon_provider() -> bool:
    if "icon.provider" not in PLUGIN_UI_SLOTS:
        return False
    return any(f.name == "assets_dir" for f in dataclasses.fields(PluginUiDefinition))


async def apply(ctx: Context) -> None:
    """在支持 icon.provider 与多 chunk 资产分发的宿主上登记图标能力；旧宿主上静默跳过。"""
    if not _supports_v2_icon_provider():
        return

    async def query(
        method: str,
        payload: dict[str, object],
        *,
        session_id: str | None,
        turn_id: str | None,
    ) -> dict[str, object]:
        del method, payload, session_id, turn_id
        return {}

    ui_def = (
        PluginUiDefinition(
            module="plugin_ui.js",
            stylesheet="plugin_ui.css",
            slots=("icon.provider",),
            assets_dir="static/chunks",
            client_kernel=True,
        )
        if any(f.name == "client_kernel" for f in dataclasses.fields(PluginUiDefinition))
        else PluginUiDefinition(
            module="plugin_ui.js",
            stylesheet="plugin_ui.css",
            slots=("icon.provider",),
            assets_dir="static/chunks",
        )
    )
    _ = await ctx.require(UI_SLOTS).register_plugin_ui(ctx, ui_def, query=query)
