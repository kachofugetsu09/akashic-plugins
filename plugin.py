"""Read-only document workbench using execution-host file access, with PDF/Office reader and Agent live navigation."""
from agent.plugin_composition import Context
from plugins.host_execution.contract import FILES
from plugins.operations.contract import OPERATIONS_V1
from plugins.tools.contract import TOOLS
from plugins.ui.contract import UI
from plugins.working_directory.contract import WORKING_DIRECTORY

from . import dashboard
from .live import READER_LIVE, ReaderLive
from .operations import register_operations
from .tools import register_tools

api_version = 3
name = "file_viewer"
version = "1.1.0"
desc = "在右侧工作台浏览与阅读 PDF、Word、Excel、PPT、Markdown、代码与图片，支持划词/框选引用及 Agent 主动打开定位"
inject = (TOOLS, FILES, WORKING_DIRECTORY)


async def apply(ctx: Context) -> None:
    _ = await ctx.provide(READER_LIVE, ReaderLive())
    await register_tools(ctx)

    async def register_ui(child: Context) -> None:
        _ = await child.require(UI).register(
            child,
            web="web_module.js",
            dashboard=lambda: dashboard,
            navigation_paths=tuple(dashboard.ASSETS + item for item in dashboard.asset_names(child.runtime.plugin_dir)),
            requires=("conversation.tools.v2",),
            contract_digests={"conversation.tools.v2": "b3f5e9aea07351d69ab1ae55d2dcf18c5e352fc61b6354d4af34dbeca16787eb"},
        )

    _ = await ctx.inject((UI, FILES, WORKING_DIRECTORY, READER_LIVE), register_ui, name="file_viewer-ui")

    # 没有 operations 插件时只是 self 里没有文件浏览命令。
    async def register_ops(child: Context) -> None:
        await register_operations(child, ctx)

    _ = await ctx.inject((OPERATIONS_V1,), register_ops, name="operations")
