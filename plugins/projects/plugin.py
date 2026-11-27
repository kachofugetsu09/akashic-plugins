"""Project 是 Session 宽键中的 project 维度；拥有项目记录与侧栏项目分组，不解释记忆。"""
from __future__ import annotations

from datetime import UTC, datetime
import re
from typing import cast
from pathlib import Path
from collections.abc import Callable
from core.common.file_io import run_file_io

from plugins.working_directory.contract import WORKING_DIRECTORY
from .operations import ProjectCreation

from agent.plugin_composition import Context
from plugins.ui.contract import UI_SLOTS, PluginUiDefinition, PluginUiRpcInvalidRequest
from plugins.ledger.contract import (
    OWNER_STATE,
    SESSION_ADMISSION,
    MessageConflict,
    OwnerStore,
    OwnerTransaction,
)

api_version = 3
name = "projects"
version = "1.0.0"
desc = "按项目组织对话，并为 Session 宽键提供 project 维度"
inject = (SESSION_ADMISSION, OWNER_STATE, UI_SLOTS)

DIMENSION = "project"
_PREFIX = "project:"
_NAME_LIMIT = 80
_PROJECT_ID = re.compile(r"p_[0-9a-f]{32}")
_ICON_NAME = re.compile(r"^[a-z0-9][a-z0-9-]{0,63}$")


class Projects:
    """项目记录只追加或原位改名、归档；从不删除，历史 Session 永远能解析。"""

    def __init__(self, store: OwnerStore):
        self._store = store

    def list(self) -> list[dict[str, object]]:
        rows = self._store.scan(start=_PREFIX, stop=_PREFIX + "\uffff", limit=1000)
        projects = [_project_row(key[len(_PREFIX):], dict(record.value)) for key, record in rows]
        return sorted(projects, key=lambda row: cast(str, row["created_at"]))

    @property
    def store(self) -> OwnerStore:
        return self._store

    def create(self, project_id: str, project_name: str, directory: str | None = None) -> dict[str, object]:
        try:
            return self._store.transact(self.writer(project_id, project_name, directory))
        except MessageConflict as error:
            raise PluginUiRpcInvalidRequest("项目正在并发创建，请重试") from error

    # 由请求的稳定 ID 创建一次；响应丢失后同名重放返回原记录。可单独提交，也可进依赖插件的联合事务。
    def writer(
        self, project_id: str, project_name: str, directory: str | None = None,
    ) -> Callable[[OwnerTransaction], dict[str, object]]:
        if _PROJECT_ID.fullmatch(project_id) is None:
            raise PluginUiRpcInvalidRequest("项目 ID 无效")
        name = _check_name(project_name)
        value: dict[str, object] = {
            "name": name, "created_name": name, "archived": False,
            "created_at": datetime.now(UTC).isoformat(), "created_directory": directory,
        }
        if directory is not None:
            value["directory"] = directory
        def save(transaction: OwnerTransaction) -> dict[str, object]:
            current = transaction.read(_PREFIX + project_id)
            if current is not None:
                if current.value.get("created_name", current.value["name"]) != name:
                    raise PluginUiRpcInvalidRequest("项目 ID 已用于其他名称")
                if current.value.get("created_directory") != directory:
                    raise PluginUiRpcInvalidRequest("项目 ID 已用于其他初始目录")
                return _project_row(project_id, dict(current.value))
            _ = transaction.save(_PREFIX + project_id, value, expected_version=None)
            return _project_row(project_id, value)
        return save

    def exists(self, project_id: str) -> bool:
        return self._store.read(_PREFIX + project_id) is not None

    def update(self, project_id: str, **changes: object) -> dict[str, object]:
        if set(changes) - {"name", "archived", "icon"}:
            raise PluginUiRpcInvalidRequest("项目更新只允许改名、更换图标或归档")
        key = _PREFIX + project_id
        def save(transaction: OwnerTransaction) -> dict[str, object]:
            current = transaction.read(key)
            if current is None:
                raise PluginUiRpcInvalidRequest("项目不存在")
            value = {**dict(current.value), **changes}
            if "icon" in changes and changes["icon"] is None:
                value.pop("icon", None)
            _ = transaction.save(key, value, expected_version=current.version)
            return _project_row(project_id, value)
        try:
            return self._store.transact(save)
        except MessageConflict as error:
            raise PluginUiRpcInvalidRequest("项目已被并发修改，请刷新后重试") from error

    def directory(self, project_id: str) -> str | None:
        record = self._store.read(_PREFIX + project_id)
        if record is None:
            raise PluginUiRpcInvalidRequest("项目不存在")
        path = record.value.get("directory")
        if path is not None and (not isinstance(path, str) or not Path(path).is_absolute()):
            raise ValueError("Project 目录记录损坏")
        return path

    def bind_directory(self, project_id: str, path: str) -> dict[str, object]:
        """Set the default once while preserving concurrent rename/archive fields."""
        def save(transaction: OwnerTransaction) -> dict[str, object]:
            record = transaction.read(_PREFIX + project_id)
            if record is None:
                raise PluginUiRpcInvalidRequest("项目不存在")
            current = record.value.get("directory")
            if current is not None:
                if current != path:
                    raise PluginUiRpcInvalidRequest("项目默认目录已固定，不可更改或清空")
                return _project_row(project_id, dict(record.value))
            value = {**dict(record.value), "directory": path}
            _ = transaction.save(_PREFIX + project_id, value, expected_version=record.version)
            return _project_row(project_id, value)

        return self._store.transact(save)

    # Session 首次接纳时由 Core 调用；归档项目不再接纳新对话。
    def check(self, project_id: str) -> None:
        record = self._store.read(_PREFIX + project_id)
        if record is None:
            raise MessageConflict(f"项目不存在: {project_id}")
        if record.value.get("archived") is True:
            raise MessageConflict(f"项目已归档: {project_id}")


def _check_name(value: object) -> str:
    if not isinstance(value, str) or not value.strip() or len(value.strip()) > _NAME_LIMIT:
        raise PluginUiRpcInvalidRequest(f"项目名称必须是 1 到 {_NAME_LIMIT} 个字符")
    return value.strip()


def _check_icon(value: object) -> str | None:
    if value is None:
        return None
    if not isinstance(value, str):
        raise PluginUiRpcInvalidRequest("项目图标格式无效")
    cleaned = value.strip()
    if not cleaned:
        return None
    if _ICON_NAME.fullmatch(cleaned) is None:
        raise PluginUiRpcInvalidRequest("项目图标标识无效")
    return cleaned


def _project_id(payload: dict[str, object]) -> str:
    value = payload.get("project_id")
    if not isinstance(value, str) or not value:
        raise PluginUiRpcInvalidRequest("请选择一个项目")
    return value


def _project_row(project_id: str, value: dict[str, object]) -> dict[str, object]:
    return {
        "id": project_id, "name": value["name"],
        "archived": value["archived"], "created_at": value["created_at"],
        "directory": value.get("directory"),
        "icon": value.get("icon"),
    }


async def apply(ctx: Context) -> None:
    """注册 project 维度的唯一 owner，并经 navigation.groups 提供侧栏项目分组与增改。"""
    projects = Projects(ctx.require(OWNER_STATE).open(ctx))
    def check_project(project_id: str) -> None:
        projects.check(project_id)
        if projects.directory(project_id) is not None:
            with ctx.borrow(WORKING_DIRECTORY) as directories:
                if directories is None:
                    raise MessageConflict("已关联目录的项目需要当前目录能力才能创建 Session")

    _ = await ctx.require(SESSION_ADMISSION).register_dimension(ctx, name=DIMENSION, check=check_project)

    async def defaults(child: Context) -> None:
        _ = await child.require(WORKING_DIRECTORY).register_default(
            child, dimension=DIMENSION, read=projects.directory,
        )

    _ = await ctx.inject((WORKING_DIRECTORY,), defaults, name="directory-default")

    def notify_groups_changed() -> None:
        invalidate = getattr(ctx.require(UI_SLOTS), "invalidate_slot", None)
        if callable(invalidate):
            _ = invalidate(ctx, "navigation.groups")

    async def query(method: str, payload: dict[str, object], *, session_id: str | None,
              turn_id: str | None) -> dict[str, object]:
        if method == "project.list" and not payload:
            return {"dimension": DIMENSION, "items": await run_file_io(projects.list)}
        if method == "project.create" and {"project_id", "name"} <= set(payload) <= {
            "project_id", "name", "directory", "extensions",
        }:
            return await create_from_ui(payload)
        if method == "project.rename" and set(payload) == {"project_id", "name"}:
            project_id, project_name = _project_id(payload), _check_name(payload["name"])
            row = await run_file_io(lambda: projects.update(project_id, name=project_name))
            notify_groups_changed()
            return row
        if method == "project.set_icon" and {"project_id"} <= set(payload) <= {"project_id", "icon"}:
            project_id, icon = _project_id(payload), _check_icon(payload.get("icon"))
            row = await run_file_io(lambda: projects.update(project_id, icon=icon))
            notify_groups_changed()
            return row
        if method == "project.archive" and set(payload) == {"project_id"}:
            project_id = _project_id(payload)
            row = await run_file_io(lambda: projects.update(project_id, archived=True))
            notify_groups_changed()
            return row
        if method in {"project.bind_directory", "project.directory", "directory.browse"}:
            with ctx.borrow(WORKING_DIRECTORY) as directories:
                if directories is None:
                    raise PluginUiRpcInvalidRequest("当前组合没有可用的目录工具")
                if method == "project.bind_directory" and set(payload) == {"project_id", "path"}:
                    project_id = _project_id(payload)
                    path = payload["path"]
                    if not isinstance(path, str) or not Path(path).is_absolute():
                        raise PluginUiRpcInvalidRequest("请选择执行主机上的绝对目录")
                    if await run_file_io(lambda: projects.directory(project_id)) == path:
                        return await run_file_io(lambda: projects.bind_directory(project_id, path))
                    try:
                        checked = await directories.check_directory(path)
                    except ValueError as error:
                        raise PluginUiRpcInvalidRequest(str(error)) from error
                    row = await run_file_io(lambda: projects.bind_directory(project_id, checked))
                    notify_groups_changed()
                    return row
                if method == "project.directory" and set(payload) == {"project_id"}:
                    project_id = _project_id(payload)
                    path = await run_file_io(lambda: projects.directory(project_id))
                    return dict(await directories.inspect(path))
                if method == "directory.browse" and not set(payload) - {"path", "after"}:
                    path, after = payload.get("path", "~"), payload.get("after")
                    if not isinstance(path, str) or not path or (after is not None and not isinstance(after, str)):
                        raise PluginUiRpcInvalidRequest("目录路径或翻页参数无效")
                    return dict(await directories.browse(path, after=after))
        raise PluginUiRpcInvalidRequest(f"不支持的项目查询：{method}")

    creation = ProjectCreation(ctx, projects, on_changed=notify_groups_changed)

    # 界面新建与 self project create 是同一个操作：带附加设置时经操作总线，与项目记录同一事务提交。
    async def create_from_ui(payload: dict[str, object]) -> dict[str, object]:
        project_id, project_name = _project_id(payload), _check_name(payload["name"])
        directory = payload.get("directory")
        if directory is not None and not isinstance(directory, str):
            raise PluginUiRpcInvalidRequest("请选择执行主机上的绝对目录")
        extensions = payload.get("extensions") or {}
        if not isinstance(extensions, dict):
            raise PluginUiRpcInvalidRequest("附加设置格式无效")
        if not extensions:
            return await creation.create(project_id, project_name, directory, ())
        return await creation.create_with_extensions(
            project_id, project_name, directory, cast(dict[str, object], extensions),
        )

    await creation.register_operations(query)
    _ = await ctx.require(UI_SLOTS).register_plugin_ui(
        ctx, PluginUiDefinition(module="plugin_ui.js", stylesheet="plugin_ui.css", slots=("navigation.groups",)), query=query,
    )
