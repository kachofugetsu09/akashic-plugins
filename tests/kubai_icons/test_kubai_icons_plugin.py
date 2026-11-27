"""kubai_icons 外置插件登记 icon.provider 与多 chunk 静态资产。"""
from __future__ import annotations

from pathlib import Path
from typing import cast

import pytest

from agent.plugin_composition import CompositionRoot, Context, PluginRuntime
from plugins.kubai_icons.plugin import apply as apply_kubai_icons
from plugins.ui.contract import PLUGIN_UI, UI_SLOTS
from plugins.ui.plugin_ui import PluginUiSlots
from plugins.ui.queries import LivePluginUiProvider


@pytest.mark.asyncio
async def test_kubai_icons_registers_icon_provider_and_chunks(tmp_path: Path) -> None:
    root = CompositionRoot("kubai-icons-plugin")
    plugin_dir = tmp_path / "kubai_icons"
    chunks_dir = plugin_dir / "static" / "chunks"
    chunks_dir.mkdir(parents=True)
    (plugin_dir / "plugin_ui.js").write_text("export default { slots: {} };\n", encoding="utf-8")
    (plugin_dir / "plugin_ui.css").write_text(".kubai-icons-root {}\n", encoding="utf-8")
    (chunks_dir / "cat-files-abc123.js").write_text("export const icons = {};\n", encoding="utf-8")

    async def providers(ctx: Context) -> None:
        directory = PluginUiSlots(ctx)
        await ctx.provide(UI_SLOTS, directory)
        await ctx.provide(PLUGIN_UI, LivePluginUiProvider(ctx, directory))

    await root.mount(providers, name="ui")
    provider = cast(LivePluginUiProvider, root.context.require(PLUGIN_UI))

    try:
        await root.mount(
            apply_kubai_icons,
            name="kubai_icons",
            inject=(UI_SLOTS,),
            runtime=PluginRuntime("kubai_icons", "release", plugin_dir, tmp_path, tmp_path, {}),
        )
        # v1 catalog 隐藏纯 v2 图标扩展，避免旧浏览器拒绝整份目录。
        v1 = await provider.catalog(protocol=1)
        assert v1["items"] == []

        # v2 catalog 暴露 icon.provider 与路径式分块资产。
        v2 = await provider.catalog(protocol=2)
        items = cast(list[dict[str, object]], v2["items"])
        assert len(items) == 1
        item = items[0]
        assert item["id"] == "kubai_icons"
        assert item["slots"] == ["icon.provider"]
        assert item["module_path"] == "plugin_ui.js"
        assert item["stylesheet_path"] == "plugin_ui.css"

        chunk = await provider.file_asset(
            "kubai_icons",
            str(item["revision"]),
            str(item["bundle_sha256"]),
            "static/chunks/cat-files-abc123.js",
        )
        assert chunk["content"] == b"export const icons = {};\n"
        assert chunk["media_type"] == "text/javascript"
    finally:
        await provider.aclose()
        await root.dispose()
