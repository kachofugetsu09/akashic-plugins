"""项目增改操作触发 navigation.groups 插槽失效通知。"""

from __future__ import annotations

from pathlib import Path
from typing import Any

import pytest

from agent.plugin_composition import CompositionRoot, Context, PluginRuntime
from plugins.ledger.contract import OWNER_STATE, SESSION_ADMISSION
from plugins.ledger.log import MessageLog
from plugins.ledger.services import OwnerState
from plugins.projects.plugin import apply as apply_projects
from plugins.ui.contract import UI_SLOTS


class _FakeSessionAdmission:
    async def register_dimension(self, ctx: Context, *, name: str, check: Any) -> Any:
        return await ctx.effect(lambda: (lambda: None), label=f"dim:{name}")


class _FakeUiSlots:
    def __init__(self) -> None:
        self.query: Any = None
        self.invalidated: list[tuple[str, str]] = []

    async def register_plugin_ui(
        self, ctx: Context, definition: Any, *, query: Any, available: Any = None, follow: Any = None,
    ) -> Any:
        self.query = query
        return await ctx.effect(lambda: (lambda: None), label="fake-ui-slot")

    def invalidate_slot(self, ctx: Context, slot: str) -> None:
        self.invalidated.append((ctx.runtime.plugin_id, slot))


@pytest.mark.asyncio
async def test_projects_mutations_invalidate_navigation_groups_slot(tmp_path: Path) -> None:
    root = CompositionRoot("projects-slot-invalidation")
    log = MessageLog(tmp_path / "sessions.db")
    slots = _FakeUiSlots()
    plugin_dir = tmp_path / "projects_plugin"
    plugin_dir.mkdir()
    (plugin_dir / "plugin_ui.js").write_text("export default {};\n")
    (plugin_dir / "plugin_ui.css").write_text("")

    async def providers(ctx: Context) -> None:
        await ctx.provide(OWNER_STATE, OwnerState(log))
        await ctx.provide(SESSION_ADMISSION, _FakeSessionAdmission())
        await ctx.provide(UI_SLOTS, slots)

    try:
        await root.mount(providers, name="providers")
        await root.mount(
            apply_projects,
            name="projects",
            inject=(SESSION_ADMISSION, OWNER_STATE, UI_SLOTS),
            runtime=PluginRuntime("projects", "test", plugin_dir, tmp_path, tmp_path, {}),
        )
        assert slots.query is not None

        project_id = "p_" + "a" * 32
        await slots.query(
            "project.create",
            {"project_id": project_id, "name": "Alpha"},
            session_id=None,
            turn_id=None,
        )
        assert slots.invalidated == [("projects", "navigation.groups")]

        await slots.query(
            "project.rename",
            {"project_id": project_id, "name": "Beta"},
            session_id=None,
            turn_id=None,
        )
        assert slots.invalidated == [
            ("projects", "navigation.groups"),
            ("projects", "navigation.groups"),
        ]

        updated = await slots.query(
            "project.set_icon",
            {"project_id": project_id, "icon": "terminal", "color": "pine"},
            session_id=None,
            turn_id=None,
        )
        assert updated["icon"] == "terminal"
        assert updated["color"] == "pine"
        assert len(slots.invalidated) == 3

        cleared = await slots.query(
            "project.set_icon",
            {"project_id": project_id, "icon": None, "color": None},
            session_id=None,
            turn_id=None,
        )
        assert cleared["icon"] is None
        assert cleared["color"] is None
        assert len(slots.invalidated) == 4

        await slots.query(
            "project.archive",
            {"project_id": project_id},
            session_id=None,
            turn_id=None,
        )
        assert len(slots.invalidated) == 5
    finally:
        await root.dispose()
        log.close()
