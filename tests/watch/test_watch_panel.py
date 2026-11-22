from __future__ import annotations

from datetime import date, datetime
import importlib
import json
from pathlib import Path
from zoneinfo import ZoneInfo

import pytest

from plugins.ledger.contract import ContentPart, Message, MessagePage, Output
from plugins.ui.contract import PluginUiRpcInvalidRequest
from plugins.watch import panel


TZ = ZoneInfo("Asia/Shanghai")


class _FakeReader:
    def __init__(self, messages: list[Message] | None = None) -> None:
        self._messages = messages or []

    def read_tail(
        self,
        *,
        before_seq: int | None = None,
        through_seq: int | None = None,
        limit: int = 200,
    ) -> MessagePage:
        _ = through_seq
        rows = self._messages
        if before_seq is not None:
            rows = [m for m in rows if m.seq < before_seq]
        sliced = rows[-limit:]
        return MessagePage(
            messages=tuple(sliced),
            attachments={},
            bindings={},
            through_seq=rows[-1].seq if rows else 0,
            has_more=len(rows) > len(sliced),
        )


def test_read_status_skips_heavy_day_scan(tmp_path: Path) -> None:
    log_dir = tmp_path / "log"
    log_dir.mkdir()
    day = date(2026, 11, 22)
    now = datetime(2026, 11, 22, 23, 30, tzinfo=TZ)

    assert panel.read_status(tmp_path, day, _FakeReader(), now) == {"has_ticks": False, "said": 0}

    (log_dir / "2026-11-22.md").write_text(
        "- 23:10 #e1 [phone.app] X 停留 19s → log｜常规（s1）\n",
        encoding="utf-8",
    )
    msg = Message(
        message_id="m1",
        session_id="main",
        seq=1,
        recorded_at=now,
        author="assistant",
        source="proactive",
        body=Output(parts=(ContentPart(kind="text", value="提醒你"),), finish="complete"),
    )
    res = panel.read_status(tmp_path, day, _FakeReader([msg]), now)
    assert res == {"has_ticks": True, "said": 1}


def test_compact_ticks_and_read_log_verdicts_split_and_paginate(tmp_path: Path) -> None:
    log_dir = tmp_path / "log"
    log_dir.mkdir()
    day = date(2026, 11, 22)
    lines = [
        "- 10:00 #e1 [phone.appops] A → log｜noise1（s1）",
        "- 10:00 #e2 [phone.app] B → log｜noise2（s2）",
        "- 10:00 #e3 [ucd] 考试通知 → wake｜重要（s3）",
        "- 10:00 #e4 [phone.appops] C → log｜noise3（s4）",
        "- 10:05 #e5 [phone.device] 充电 → log｜noise4（s5）",
    ]
    (log_dir / "2026-11-22.md").write_text("\n".join(lines) + "\n", encoding="utf-8")

    ticks = panel.read_ticks(tmp_path, day)
    compacted = panel.compact_ticks_for_day(ticks)
    assert len(compacted) == 2

    v0 = compacted[0]["verdicts"]
    assert isinstance(v0, list)
    assert v0[0] == {
        "to": "log_summary",
        "count": 2,
        "sources": {"phone.appops": 1, "phone.app": 1},
        "from_seq": 0,
        "to_seq": 2,
    }
    assert v0[1]["to"] == "wake"
    assert v0[1]["id"] == "e3"
    assert v0[2] == {
        "to": "log_summary",
        "count": 1,
        "sources": {"phone.appops": 1},
        "from_seq": 2,
        "to_seq": 3,
    }

    v1 = compacted[1]["verdicts"]
    assert isinstance(v1, list)
    assert v1[0] == {
        "to": "log_summary",
        "count": 1,
        "sources": {"phone.device": 1},
        "from_seq": 3,
        "to_seq": 4,
    }

    # Slice [0:2] reversed -> newest first (#e2 then #e1)
    p1 = panel.read_log_verdicts(tmp_path, day, start=0, end=2, offset=0, limit=1)
    assert p1["total"] == 2
    assert p1["next_offset"] == 1
    assert [it["id"] for it in p1["items"]] == ["e2"]

    p2 = panel.read_log_verdicts(tmp_path, day, start=0, end=2, offset=1, limit=1)
    assert p2["next_offset"] is None
    assert [it["id"] for it in p2["items"]] == ["e1"]

    # Slice [2:4] across ticks -> #e5 then #e4
    p3 = panel.read_log_verdicts(tmp_path, day, start=2, end=4)
    assert [it["id"] for it in p3["items"]] == ["e5", "e4"]


def test_read_log_verdicts_enforces_byte_budget(tmp_path: Path) -> None:
    log_dir = tmp_path / "log"
    log_dir.mkdir()
    day = date(2026, 11, 22)
    big_why = "x" * 600
    lines = [
        f"- 12:00 #e{i} [phone.appops] title-{i} → log｜{big_why}（s{i}）"
        for i in range(10)
    ]
    (log_dir / "2026-11-22.md").write_text("\n".join(lines) + "\n", encoding="utf-8")

    res = panel.read_log_verdicts(tmp_path, day, start=0, end=10, offset=0, limit=200, max_bytes=2000)
    assert 1 <= len(res["items"]) < 10
    assert res["next_offset"] == len(res["items"])
    assert len(json.dumps(res, ensure_ascii=False).encode("utf-8")) <= 2200


def test_parse_int_arg_validation() -> None:
    assert panel.parse_int_arg({}, "offset", default=0) == 0
    assert panel.parse_int_arg({"limit": 10}, "limit", minimum=1, maximum=200) == 10
    for bad in ({"offset": "0"}, {"offset": True}, {"offset": -1}, {"limit": 201}):
        with pytest.raises(PluginUiRpcInvalidRequest):
            panel.parse_int_arg(bad, next(iter(bad)), minimum=0 if "offset" in bad else 1, maximum=200)
