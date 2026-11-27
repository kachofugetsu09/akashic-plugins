"""项目在 self 下的操作；`project create` 与界面新建共用一条原子提交路径。

依赖项目维度的插件（如 akasha 的记忆策略）挂在 `scope.create` 扩展点上，
它们的写入与项目记录经 Ledger 联合事务同一次提交：任一失败，项目与设置都不出现。
"""
from __future__ import annotations

from collections.abc import Callable, Mapping, Sequence
import json
from pathlib import Path
import re
from typing import Protocol
from uuid import NAMESPACE_URL, uuid4, uuid5

from agent.plugin_composition import Context
from core.common.file_io import run_file_io
from plugins.ledger.contract import OWNER_STATE, MessageConflict, OwnerStore, OwnerTransaction, OwnerWrite
from plugins.operations.contract import (
    OPERATIONS_V1,
    OperationRequest,
    OperationResult,
    OperationSpec,
    OptionSpec,
    QueryHandler,
    QueryMirror,
    register_query_mirrors,
)
from plugins.ui.contract import PluginUiRpcInvalidRequest
from plugins.working_directory.contract import WORKING_DIRECTORY

DIMENSION = "project"
_PROJECT_ID = re.compile(r"p_[0-9a-f]{32}")
_ID = OptionSpec("project_id", "项目 ID（p_ 开头）", required=True)


class ProjectRecords(Protocol):
    @property
    def store(self) -> OwnerStore: ...
    def exists(self, project_id: str) -> bool: ...
    def writer(
        self, project_id: str, project_name: str, directory: str | None = None,
    ) -> Callable[[OwnerTransaction], dict[str, object]]: ...


MIRRORS = (
    QueryMirror("project.list", ("project", "list"), "列出全部项目（含默认目录与归档状态）"),
    QueryMirror("project.rename", ("project", "rename"), "重命名项目",
                (_ID, OptionSpec("name", "新名称", required=True))),
    QueryMirror("project.set_icon", ("project", "set-icon"), "更换或重置项目图标（留空恢复默认文件夹）",
                (_ID, OptionSpec("icon", "kubai-icons/line 图标标识，省略或留空恢复默认"))),
    QueryMirror("project.archive", ("project", "archive"), "归档项目；归档后不再接纳新会话", (_ID,)),
    QueryMirror("project.bind_directory", ("project", "bind-directory"), "为项目首次绑定默认目录（绑定后不可更改）",
                (_ID, OptionSpec("path", "执行主机上的绝对目录", required=True))),
    QueryMirror("project.directory", ("project", "directory"), "查看项目默认目录在执行主机上的状态", (_ID,)),
    QueryMirror("directory.browse", ("project", "browse"), "浏览执行主机目录，用于挑选项目目录",
                (OptionSpec("path", "起始目录，默认 ~"), OptionSpec("after", "翻页游标"))),
)


def _flag_value(value: object) -> str:
    if isinstance(value, bool):
        return "true" if value else "false"
    return value if isinstance(value, str) else json.dumps(value, ensure_ascii=False)


class ProjectCreation:
    """准备（名称、ID、目录检查）在事务外；项目与扩展写入一次联合提交。"""

    def __init__(self, ctx: Context, projects: ProjectRecords, *, on_changed: Callable[[], None] | None = None):
        self._ctx = ctx
        self._projects = projects
        self._on_changed = on_changed

    # 重放承认原提交，即使目录后来移动；首次创建才检查执行主机上的目录。
    async def _checked_directory(self, project_id: str, directory: str | None) -> str | None:
        if directory is None:
            return None
        if not Path(directory).is_absolute():
            raise PluginUiRpcInvalidRequest("请选择执行主机上的绝对目录")
        if await run_file_io(lambda: self._projects.exists(project_id)):
            return directory
        with self._ctx.borrow(WORKING_DIRECTORY) as directories:
            if directories is None:
                raise PluginUiRpcInvalidRequest("当前组合没有可用的目录工具")
            try:
                _ = await directories.check_directory(directory)
            except ValueError as error:
                raise PluginUiRpcInvalidRequest(str(error)) from error
        return directory

    async def create(
        self, project_id: str, name: str, directory: str | None, writes: Sequence[OwnerWrite],
    ) -> dict[str, object]:
        checked = await self._checked_directory(project_id, directory)
        own = OwnerWrite(self._projects.store, self._projects.writer(project_id, name, checked))
        try:
            results = await self._ctx.require(OWNER_STATE).transact_joint((own, *writes))
        except MessageConflict as error:
            raise PluginUiRpcInvalidRequest("项目正在并发创建，请重试") from error
        if self._on_changed is not None:
            self._on_changed()
        return dict(results[0]) if isinstance(results[0], Mapping) else {}

    # 界面附带的 scope.fields 取值翻成同一条命令，由操作总线解析、校验并收集扩展写入。
    async def create_with_extensions(
        self, project_id: str, name: str, directory: str | None, extensions: Mapping[str, object],
    ) -> dict[str, object]:
        # 每个参数写成单个 --k=v：以 -- 开头的名称或目录不会被当成选项。
        argv = ["project", "create", f"--project_id={project_id}", f"--name={name}"]
        if directory is not None:
            argv.append(f"--directory={directory}")
        for namespace, values in extensions.items():
            if not isinstance(values, Mapping):
                raise PluginUiRpcInvalidRequest(f"附加设置 {namespace} 格式无效")
            for key, value in values.items():
                argv.append(f"--{namespace}.{key}={_flag_value(value)}")
        with self._ctx.borrow(OPERATIONS_V1) as operations:
            if operations is None:
                raise PluginUiRpcInvalidRequest("当前组合缺少 operations，附加设置无法与项目一起提交")
            result = await operations.invoke(argv, actor="user", request_id=f"ui-project-create:{project_id}")
        if not result.ok:
            raise PluginUiRpcInvalidRequest(result.summary)
        return {key: value for key, value in result.data.items() if key != "extensions"}

    async def _handle_create(self, req: OperationRequest) -> OperationResult:
        given = req.args.get("project_id")
        project_id = given if isinstance(given, str) and given else (
            "p_" + (uuid5(NAMESPACE_URL, f"{req.actor}:{req.request_id}").hex if req.request_id else uuid4().hex))
        if _PROJECT_ID.fullmatch(project_id) is None:
            raise ValueError("项目 ID 必须是 p_ 加 32 位十六进制")
        name = req.args.get("name")
        directory = req.args.get("directory")
        writes = await req.staged({"dimension": DIMENSION, "value": project_id})
        row = await self.create(project_id, str(name), directory if isinstance(directory, str) else None, writes)
        return OperationResult(True, f"已创建项目 {row.get('name')}（{project_id}）", data=row)

    async def register_operations(self, query: QueryHandler) -> None:
        # 创建经项目插件自己的 Context 借用目录工具、写入主记录。
        handler = self._ctx.entrypoint(self._handle_create)

        async def register(child: Context) -> None:
            operations = child.require(OPERATIONS_V1)
            await register_query_mirrors(child, operations, query=query, mirrors=MIRRORS)
            _ = await operations.register(child, OperationSpec(
                operation_id="projects.project.create", path=("project", "create"),
                summary="新建项目；依赖插件的 --<ns>.<opt> 设置与项目记录同一事务提交",
                handler=handler, extension_points=("scope.create",),
                mirrors=("rpc:projects/project.create",),
                options=(
                    OptionSpec("name", "项目名称（1–80 字）", required=True),
                    OptionSpec("directory", "执行主机上的默认目录（绝对路径，创建后固定）", set_once=True),
                    OptionSpec("project_id", "稳定 ID；省略时由请求 ID 派生，重放得到同一项目"),
                ),
            ))

        _ = await self._ctx.inject((OPERATIONS_V1,), register, name="operations")
