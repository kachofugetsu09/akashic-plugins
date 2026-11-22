"""O/C4: subagent 的终态查询与取消在异步读取期间不阻塞控制、不改写已提交的前缀。"""
import asyncio

import pytest

from plugins.ledger.log import MessageLog
from plugins.ledger.contract import Input
from tests.test_message_log import writer
from tests.akasha.test_akasha_execution import WorkerGate


@pytest.mark.asyncio
async def test_subagent_outcome_read_keeps_control_responsive_and_prefix_fixed(tmp_path, monkeypatch):
    """O/C3/C4: 子任务终态查询不阻塞控制，也不把后来控制塞进旧快照。"""
    import plugins.ledger.log as storage
    from plugins.subagent.runtime import Subagents
    from plugins.ledger.contract import Control

    log = MessageLog(tmp_path / "sessions.db")
    writer(log, source="subagent").append("job-input", Input(()))
    reader = log.reader("s")
    gate = WorkerGate()
    original = storage._message

    def decode(row):
        if row["id"] == "job-input":
            gate.stop()
        return original(row)

    monkeypatch.setattr(storage, "_message", decode)

    async def query():
        return await Subagents.outcome(reader)

    job = asyncio.create_task(query())
    try:
        await gate.wait(job)
        control = writer(log, source="subagent", bodies=(Control,))
        control.append("pause", Control("pause", 0, "user stop"))
        writer(log, source="peer").append("peer", Input(()))
        gate.release.set()
        assert await job is None
        monkeypatch.setattr(storage, "_message", original)
        assert await Subagents.outcome(reader) == ("cancelled", "子任务已按请求取消。")
        assert [item.message_id for item in reader.snapshot()] == ["job-input", "pause", "peer"]
    finally:
        gate.release.set()
        await asyncio.gather(job, return_exceptions=True)
        log.close()


@pytest.mark.asyncio
async def test_subagent_cancel_rechecks_completion_committed_during_read(tmp_path, monkeypatch):
    """C3: 真实来源在异步读取期间完成，旧取消检查不能改写其终态。"""
    from agent.plugin_composition import CompositionRoot, PluginRuntime
    from plugins.ledger.services import MessageWriters, OwnerState
    from plugins.ledger.contract import MESSAGE_CATALOG, MESSAGE_WRITERS, OWNER_STATE
    from agent.plugin_composition.tasks import TASKS, PluginTasks
    from plugins.subagent.request import PROFILE_TOOLS, Request
    from plugins.subagent.runtime import Subagents
    from plugins.ledger.log import MessageReader
    from plugins.ledger.contract import ContentPart, ContentReferences, Output

    log = MessageLog(tmp_path / "sessions.db")
    root = CompositionRoot("subagent-cancel-read")
    contexts = []

    async def storage(ctx):
        await ctx.provide(MESSAGE_CATALOG, log.catalog())
        await ctx.provide(MESSAGE_WRITERS, MessageWriters(log))
        await ctx.provide(OWNER_STATE, OwnerState(log))
        await ctx.provide(TASKS, PluginTasks())

    async def consumer(ctx):
        contexts.append(ctx)

    await root.mount(storage, name="storage")
    await root.mount(consumer, name="jobs", inject=(MESSAGE_CATALOG, MESSAGE_WRITERS, OWNER_STATE, TASKS),
                     runtime=PluginRuntime("jobs", "jobs", tmp_path, tmp_path, tmp_path, {}))
    ctx = contexts[0]
    request = Request(job_id="a" * 32, label="job", profile="research", background=False,
                      retry_count=0, parent_session_id="parent", parent_message_id="parent-input",
                      parent_part_index=0, origin=None, sink=None, program_binding="program",
                      tools={name: name for name in PROFILE_TOOLS["research"]})
    messages = log.writer(request.session_id, author="subagent", source="subagent",
                          body_types=(Input, Output), content={"subagent.request": lambda _: ContentReferences()})
    messages.append(request.input_id, Input((ContentPart("subagent.request", request.model_dump()),)))
    async with ctx.runtime_scope():
        state = ctx.require(OWNER_STATE).open(ctx)
        state.transact(lambda tx: tx.save("job", {"session_id": request.session_id,
            "input_id": request.input_id, "settled": False}, expected_version=None))
    gate = WorkerGate()
    original = MessageReader.snapshot

    def snapshot(reader, **kwargs):
        gate.stop()
        return original(reader, **kwargs)

    monkeypatch.setattr(MessageReader, "snapshot", snapshot)

    async def cancel():
        async with ctx.runtime_scope():
            return await Subagents(ctx).cancel(request.job_id)

    job = asyncio.create_task(cancel())
    try:
        await gate.wait(job)
        messages.append("completed", Output((), "complete"))
        gate.release.set()
        assert await job is False
        monkeypatch.setattr(MessageReader, "snapshot", original)
        assert [item.message_id for item in log.reader(request.session_id).snapshot()] == [request.input_id, "completed"]
    finally:
        gate.release.set()
        await asyncio.gather(job, return_exceptions=True)
        await root.dispose()
        log.close()
