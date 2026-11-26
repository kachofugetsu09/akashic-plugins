"""self 命令里的设计文档：与“设计”标签同一份存储，列出、新建、改名、读写修订与读取网页预览。"""
from __future__ import annotations

import base64
import binascii
from dataclasses import asdict

from agent.plugin_composition import Context
from plugins.operations.contract import OPERATIONS_V1, OperationRequest, OperationResult, OperationSpec, OptionSpec

from .live import DesignLive, save_document
from .store import DOCUMENT_ID, DesignStore, DesignStoreError, RevisionConflict

_SESSION = OptionSpec("session", "文档所属会话；省略时用当前会话")
_DOCUMENT = OptionSpec("document", "设计文档 ID（来自 design list）", required=True)


def _session(req: OperationRequest) -> str:
    value = req.args.get("session") or req.session_id
    if not isinstance(value, str) or not 0 < len(value) <= 512:
        raise ValueError("需要 --session 或在会话里调用")
    return value


def _document(req: OperationRequest) -> str:
    value = req.args.get("document")
    if not isinstance(value, str) or not DOCUMENT_ID.fullmatch(value):
        raise ValueError("文档 ID 无效")
    return value


def _name(req: OperationRequest) -> str:
    value = req.args.get("name") or ""
    if not isinstance(value, str) or len(value) > 200:
        raise ValueError("--name 最长 200 字")
    return value


# 内容是 open-pencil 的 .fig 字节，命令行里以 base64 传递；写入带上自己基于的修订号，冲突时报出当前修订。
async def _write(store: DesignStore, live: DesignLive, req: OperationRequest) -> OperationResult:
    base = req.args.get("base")
    if not isinstance(base, int) or base < 0:
        raise ValueError("--base 必须是非负整数")
    try:
        data = base64.b64decode(str(req.args.get("data_b64") or ""), validate=True)
    except binascii.Error as error:
        raise ValueError(f"--data_b64 不是有效的 base64：{error}") from error
    try:
        saved = await save_document(store, live, _session(req), _document(req), data, base=base)
    except RevisionConflict as error:
        return OperationResult(False, str(error), data={"revision": error.current}, error_code="conflict")
    except DesignStoreError as error:
        return OperationResult(False, str(error), error_code="rejected")
    return OperationResult(True, f"已保存“{saved.name}”修订 {saved.revision}", data=asdict(saved))


async def register_operations(ctx: Context, store: DesignStore, live: DesignLive) -> None:
    await _catalog_operations(ctx, store)
    await _content_operations(ctx, store, live)


# 文档目录：列出、新建、改名
async def _catalog_operations(ctx: Context, store: DesignStore) -> None:
    async def list_documents(req: OperationRequest) -> OperationResult:
        items = [asdict(item) for item in await store.list(_session(req))]
        return OperationResult(True, f"{len(items)} 份设计文档", data={"documents": items})

    async def create(req: OperationRequest) -> OperationResult:
        try:
            created = await store.create(_session(req), _name(req))
        except DesignStoreError as error:
            return OperationResult(False, str(error), error_code="conflict")
        return OperationResult(True, f"已新建“{created.name}”（{created.id}）", data=asdict(created))

    async def rename(req: OperationRequest) -> OperationResult:
        try:
            renamed = await store.rename(_session(req), _document(req), _name(req))
        except DesignStoreError as error:
            return OperationResult(False, str(error), error_code="not_found")
        return OperationResult(True, f"已改名为“{renamed.name}”", data=asdict(renamed))

    operations = ctx.require(OPERATIONS_V1)
    _ = await operations.register(ctx, OperationSpec(
        operation_id="design.list", path=("design", "list"), summary="列出会话里的设计文档",
        handler=list_documents, options=(_SESSION,),
        mirrors=("http:design:GET /api/dashboard/design/documents",),
    ))
    _ = await operations.register(ctx, OperationSpec(
        operation_id="design.create", path=("design", "create"), summary="新建一份空白设计文档",
        handler=create, options=(_SESSION, OptionSpec("name", "文档名")),
        mirrors=("http:design:POST /api/dashboard/design/documents",),
    ))
    _ = await operations.register(ctx, OperationSpec(
        operation_id="design.rename", path=("design", "rename"), summary="给设计文档改名",
        handler=rename, options=(_SESSION, _DOCUMENT, OptionSpec("name", "新名字", required=True)),
        mirrors=("http:design:PATCH /api/dashboard/design/documents/{document}",),
    ))


# 文档内容：读修订、读网页预览、基于修订写入
async def _content_operations(ctx: Context, store: DesignStore, live: DesignLive) -> None:
    async def read(req: OperationRequest) -> OperationResult:
        try:
            meta, data = await store.read(_session(req), _document(req))
        except DesignStoreError as error:
            return OperationResult(False, str(error), error_code="not_found")
        return OperationResult(True, f"“{meta.name}”修订 {meta.revision}，{len(data)} 字节",
                               data={**asdict(meta), "data_b64": base64.b64encode(data).decode()})

    async def preview(req: OperationRequest) -> OperationResult:
        try:
            page = await store.preview(_session(req), _document(req))
        except (DesignStoreError, OSError) as error:
            return OperationResult(False, str(error), error_code="not_found")
        return OperationResult(True, f"网页预览 {len(page)} 字符", data={"html": page})

    async def write(req: OperationRequest) -> OperationResult:
        return await _write(store, live, req)

    operations = ctx.require(OPERATIONS_V1)
    _ = await operations.register(ctx, OperationSpec(
        operation_id="design.read", path=("design", "read"), summary="读取设计文档的当前修订（.fig 字节，base64）",
        handler=read, options=(_SESSION, _DOCUMENT),
        mirrors=("http:design:GET /api/dashboard/design/documents/{document}",),
    ))
    _ = await operations.register(ctx, OperationSpec(
        operation_id="design.preview", path=("design", "preview"), summary="读取设计文档的网页预览快照",
        handler=preview, options=(_SESSION, _DOCUMENT),
        mirrors=("http:design:GET /api/dashboard/design/documents/{document}/preview",),
    ))
    _ = await operations.register(ctx, OperationSpec(
        operation_id="design.write", path=("design", "write"), summary="基于某个修订保存设计文档的新内容",
        handler=write,
        options=(_SESSION, _DOCUMENT, OptionSpec("base", "写入所基于的修订号（来自 design read）", "int", required=True),
                 OptionSpec("data_b64", ".fig 内容的 base64", required=True)),
        mirrors=("http:design:PUT /api/dashboard/design/documents/{document}",),
    ))
