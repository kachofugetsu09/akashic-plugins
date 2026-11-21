"""standard_web 的提供方登记只列出 ACTIVE 的贡献方：卸载窗口里的提供方不被选择。"""
import asyncio
from pathlib import Path

import pytest

from agent.plugin_composition import CompositionRoot, Context, FiberState, PluginRuntime
from plugins.standard_web.contract import WEB_PROVIDERS, SearchRequest
from plugins.standard_web.web import Providers, WebConfig


class _DummySearch:
    async def search(self, request: SearchRequest) -> dict[str, object]:
        return {"ok": True}


@pytest.mark.asyncio
async def test_providers_filter_non_active_contributors(tmp_path: Path) -> None:
    root = CompositionRoot("test")
    gate, entered = asyncio.Event(), asyncio.Event()
    holders: list[Context] = []

    async def mount_web(ctx: Context) -> None:
        _ = await ctx.provide(WEB_PROVIDERS, Providers(ctx, WebConfig()))

    async def mount_flaky(ctx: Context) -> None:
        holders.append(ctx)
        _ = await ctx.require(WEB_PROVIDERS).register_search(ctx, _DummySearch(), label="FlakyWeb")

    try:
        await root.mount(mount_web, name="standard_web")
        await root.mount(mount_flaky, name="flaky_contrib", inject=(WEB_PROVIDERS,),
                         runtime=PluginRuntime("flaky@local", "local", tmp_path, tmp_path / "fd", tmp_path, {}))
        fiber = next(item for item in root.fibers() if item.name == "flaky_contrib")

        async def hold() -> None:
            async with holders[0].runtime_scope():
                entered.set()
                _ = await gate.wait()

        async with asyncio.timeout(3):
            holder = asyncio.create_task(hold())
            _ = await entered.wait()
            unloader = asyncio.create_task(fiber.dispose())
            while fiber.state is not FiberState.UNLOADING:
                await asyncio.sleep(0.01)
            providers = root.service_value(WEB_PROVIDERS)
            assert providers is not None
            assert providers.choices("search") == []
            assert "error" in await providers.search(SearchRequest(query="hello", num_results=3))
            gate.set()
            await holder
            await unloader
    finally:
        gate.set()
        await root.dispose()
