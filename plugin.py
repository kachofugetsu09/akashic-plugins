"""对话截图：回答工具栏的截图钮，把一段对话截成长图，按自己选的档位打码后分享、保存或复制。"""
from agent.plugin_composition import Context
from plugins.ui.contract import UI_SLOTS, PluginUiDefinition, PluginUiRpcInvalidRequest

api_version = 3
name = "screenshot"
version = "1.0.0"
desc = "对话截图：把一段对话截成长图，可遮敏感信息或全部模糊，再分享、保存或复制"
author = "Akashic Core"
inject = (UI_SLOTS,)


async def apply(ctx: Context) -> None:
    async def query(
        method: str,
        payload: dict[str, object],
        *,
        session_id: str | None,
        turn_id: str | None,
    ) -> dict[str, object]:
        raise PluginUiRpcInvalidRequest(f"截图插件不支持远程查询: {method}")

    _ = await ctx.require(UI_SLOTS).register_plugin_ui(
        ctx,
        PluginUiDefinition(module="plugin_ui.js", stylesheet="plugin_ui.css", slots=("message.actions",)),
        query=query,
    )
