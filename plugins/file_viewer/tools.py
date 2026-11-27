"""Agent 的文档阅读器工具：在用户侧边栏打开并精准定位 PDF、Word、Excel、PPT、Markdown 或代码文件。"""
from __future__ import annotations

from collections.abc import AsyncGenerator, Mapping
from contextlib import asynccontextmanager
from typing import cast

from pydantic import BaseModel, ConfigDict, Field

from agent.plugin_composition import Context
from plugins.host_execution.contract import FILES
from plugins.ledger.contract import ContentPart, Input, json_value
from plugins.tools.contract import TOOLS, CallSource, Result
from plugins.working_directory.contract import WORKING_DIRECTORY

from .live import READER_LIVE
from .navigate import Navigator, OpenTarget

GROUP = (
    "侧边栏文档阅读器：在用户工作台的“文件”标签里主动打开并定位 PDF、Word (.docx)、Excel (.xlsx)、"
    "PowerPoint (.pptx)、Markdown、代码或图片，方便用户边看原文边划词引用。"
)

OPEN_DESCRIPTION = (
    "在用户右侧工作台“文件”标签中打开指定文件，并可选精准跳转到页码、行号、工作表或关键词位置。"
    "支持 PDF、Word (.docx)、Excel (.xlsx)、PowerPoint (.pptx)、Markdown、代码与图片。"
    "当你在讲解某份文档、论文、讲义或代码，希望用户直接看到对应位置时调用。"
)


class OpenDocumentArgs(BaseModel):
    model_config = ConfigDict(extra="forbid", strict=True)
    path: str = Field(min_length=1, max_length=4096, description="文件路径：绝对路径或相对当前会话工作目录的路径")
    page: int | None = Field(default=None, ge=1, le=100000, description="可选：跳转到 1-based 页码（PDF / Word）或幻灯片编号（PPT）")
    line: int | None = Field(default=None, ge=1, le=1000000, description="可选：跳转到 1-based 行号（Markdown / 代码 / 文本）")
    sheet: str | None = Field(default=None, max_length=120, description="可选：跳转到指定 Excel 工作表名称")
    search: str | None = Field(default=None, max_length=240, description="可选：在文档中定位并高亮的关键词或短语")
    note: str | None = Field(default=None, max_length=200, description="可选：展示给用户的简短导览提示")


class OpenDocumentTool:
    idempotent = False

    def __init__(self, navigator: Navigator) -> None:
        self._navigator = navigator

    async def prepare(self, arguments: Mapping[str, object], source: CallSource | None = None) -> Mapping[str, object] | str:
        if source is None:
            return "open_document 只能由对话里的调用触发"
        target = next((message for message in source.messages if message.message_id == source.call_ref.message_id), None)
        if target is None:
            return "open_document 调用缺少所在消息"
        inputs = [message for message in source.messages if isinstance(message.body, Input) and message.seq <= target.seq]
        values = dict(arguments)
        values["_reader"] = {"session": target.session_id, "turn": (inputs[-1] if inputs else target).message_id}
        return values

    async def invoke(self, key: str, arguments: Mapping[str, object]) -> Result:
        values = cast(dict[str, object], json_value(arguments))
        identity = cast(dict[str, str], values.pop("_reader"))
        try:
            req = OpenDocumentArgs.model_validate(values)
        except Exception as error:
            return Result("error", (ContentPart("text", f"参数无效：{error}"),))
        done = await self._navigator.open(identity["session"], identity["turn"], OpenTarget(
            req.path, page=req.page, line=req.line, sheet=req.sheet, search=req.search, note=req.note))
        return Result("success" if done.ok else "error", (ContentPart("text", done.message),))

    async def query(self, key: str) -> Result | None:
        return None


# ctx 须能解析执行主机文件、工作目录与实时通道（插件自身的 Context）。
def navigator_for(ctx: Context) -> Navigator:
    return Navigator(ctx.require(READER_LIVE), ctx.require(FILES), ctx.require(WORKING_DIRECTORY), str(ctx.runtime.workspace))


async def register_tools(ctx: Context) -> None:
    tool = OpenDocumentTool(navigator_for(ctx))
    catalog = ctx.require(TOOLS)
    _ = await catalog.declare_group(ctx, description=GROUP, icon="file-text")

    @asynccontextmanager
    async def open_tool(_state: Mapping[str, object]) -> AsyncGenerator[OpenDocumentTool, None]:
        yield tool

    _ = await catalog.register(
        ctx,
        name="open_document",
        description=OPEN_DESCRIPTION,
        parameters=OpenDocumentArgs.model_json_schema(),
        open=open_tool,
        parallel=True,
        icon="book-open",
    )
