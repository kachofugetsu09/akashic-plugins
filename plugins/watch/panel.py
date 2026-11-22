"""值班面板的数据：全部从已有的日志、事件文件和账本现读，不另存一份。"""
from __future__ import annotations

import json
import re
from collections.abc import Callable, Iterable, Mapping
from datetime import date, datetime, timedelta
from pathlib import Path
from typing import cast

from plugins.ledger.contract import ContentPart, Message, MessageReader, Output, ToolCall, ToolResult
from plugins.models.contract import ModelCallStats
from plugins.ui.contract import PluginUiRpcInvalidRequest

from . import recent
from .events import Event, clip, read_day
from .watcher import ModelStats

_VERDICT = re.compile(r"^- (\d\d:\d\d) #(\S+) \[(.+?)\] (.*?) → (wake|inbox|log)(?:｜(.*?))?（[^（）]*）$")
_ROUND = re.compile(r"^- (\d\d:\d\d) (.+?)：(.+?)（会话 (\S+)）$")
_FAILURE = re.compile(r"^- (\d\d:\d\d) 模型失败：(.*)$")
_MEMORY = re.compile(r"^- (\d\d:\d\d) 记忆改动：([+-]) (.*)$")
_WATCHER_USAGE = re.compile(
    r"^- (\d\d:\d\d) 值班模型：(.+?)｜(\d+) 次｜(?:(用量未知)|输入 (\d+)(?:（命中 (\d+)(?:/(\d+))?）)?｜输出 (\d+))$"
)


# 一天的值班记录按轮次归拢：同一分钟写下的判断、值班用量、模型失败和主 Agent 的回合是同一轮。
def read_ticks(root: Path, day: date) -> list[dict[str, object]]:
    path = root / "log" / f"{day:%Y-%m-%d}.md"
    ticks: dict[str, dict[str, list[dict[str, object]]]] = {}
    watcher: dict[str, dict[str, ModelStats]] = {}
    for text in path.read_text(encoding="utf-8").splitlines() if path.exists() else ():
        if match := _VERDICT.match(text):
            at, event_id, source, title, to, why = match.groups()
            row, item = "verdicts", dict[str, object](id=event_id, source=source, title=title, to=to, why=why or "")
        elif match := _ROUND.match(text):
            at, label, status, session = match.groups()
            row, item = "rounds", dict[str, object](label=label, status=status, session=session)
        elif match := _MEMORY.match(text):
            at, row, item = match.group(1), "memory", dict[str, object](mark=match.group(2), text=match.group(3))
        elif match := _FAILURE.match(text):
            at, row, item = match.group(1), "failures", dict[str, object](text=match.group(2))
        elif match := _WATCHER_USAGE.match(text):
            at = match.group(1)
            ticks.setdefault(at, {"verdicts": [], "rounds": [], "failures": [], "memory": []})
            stat = _parse_watcher_usage(match)
            bucket = watcher.setdefault(at, {})
            if stat.model in bucket:
                bucket[stat.model].merge(stat)
            else:
                bucket[stat.model] = stat
            continue
        else:
            continue
        ticks.setdefault(at, {"verdicts": [], "rounds": [], "failures": [], "memory": []})[row].append(item)
    return [
        {"at": at, **rows, "watcher": [item.to_dict() for item in watcher.get(at, {}).values()]}
        for at, rows in sorted(ticks.items())
    ]


def _parse_watcher_usage(match: re.Match[str]) -> ModelStats:
    _, model, raw_calls, unknown, raw_in, raw_hit, raw_hit_in, raw_out = match.groups()
    calls = int(raw_calls)
    if unknown:
        return ModelStats(model=model, calls=calls)
    input_tokens = int(raw_in)
    output_tokens = int(raw_out)
    if raw_hit is None:
        return ModelStats(model=model, calls=calls, input_tokens=input_tokens, output_tokens=output_tokens, reported_calls=calls)
    hit_tokens = int(raw_hit)
    hit_input_tokens = int(raw_hit_in) if raw_hit_in is not None else input_tokens
    return ModelStats(
        model=model, calls=calls, input_tokens=input_tokens, hit_tokens=hit_tokens,
        hit_input_tokens=hit_input_tokens, output_tokens=output_tokens,
        reported_calls=calls, cache_reported_calls=calls,
    )


def _as_int(value: object) -> int:
    return value if isinstance(value, int) else 0


def summarize_stats(items: Iterable[Mapping[str, object]]) -> dict[str, object]:
    grouped: dict[str, ModelStats] = {}
    total = ModelStats("total")
    for raw in items:
        model = str(raw["model"])
        stat = ModelStats(
            model=model,
            calls=_as_int(raw.get("calls")),
            input_tokens=_as_int(raw.get("input_tokens")),
            hit_tokens=_as_int(raw.get("hit_tokens")),
            hit_input_tokens=_as_int(raw.get("hit_input_tokens")),
            output_tokens=_as_int(raw.get("output_tokens")),
            reported_calls=_as_int(raw.get("reported_calls")),
            cache_reported_calls=_as_int(raw.get("cache_reported_calls")),
        )
        if model in grouped:
            grouped[model].merge(stat)
        else:
            grouped[model] = stat
        total.merge(stat)
    return {"models": [item.to_dict() for item in grouped.values()], "total": total.to_dict()}


def read_day_usage(
    root: Path, day: date, reader_for: Callable[[str], MessageReader], call_stats: Callable[[str], ModelCallStats],
) -> tuple[list[dict[str, object]], dict[str, object]]:
    ticks = read_ticks(root, day)
    watcher_items: list[Mapping[str, object]] = []
    agent_items: list[Mapping[str, object]] = []
    for tick in ticks:
        raw_watcher = tick["watcher"]
        if isinstance(raw_watcher, list):
            for entry in raw_watcher:
                if isinstance(entry, Mapping):
                    watcher_items.append(entry)
        raw_rounds = tick["rounds"]
        if isinstance(raw_rounds, list):
            for round_item in raw_rounds:
                if not isinstance(round_item, dict):
                    continue
                messages = read_tail_messages(reader_for(str(round_item["session"])), 5)
                usage = _collect_usage(messages, call_stats)
                steps = _read_steps(messages, lambda _binding: "")
                # 回合收尾时它自己写的那段话就是这一轮的交代；列表里直接给出来，不用点进去才知道做了什么。
                round_item["said"] = next((step["text"] for step in reversed(steps) if step["kind"] == "text"), "")
                round_item["steps"] = sum(step["kind"] == "call" for step in steps)
                round_item["left"] = read_left(messages)
                round_item["usage"] = usage
                models = usage.get("models")
                if isinstance(models, list):
                    for entry in models:
                        if isinstance(entry, Mapping):
                            agent_items.append(entry)
    return ticks, {"watcher": summarize_stats(watcher_items), "agent": summarize_stats(agent_items)}


# 每个报过状态的来源一行：一段是相邻两条状态事件之间的时间，文字是事件原文。前一天最后一条带到当天零点。
def read_lanes(root: Path, day: date) -> list[dict[str, object]]:
    lanes: dict[str, list[dict[str, str]]] = {}
    carried: dict[str, Event] = {}
    for event in read_day(root, day - timedelta(days=1)):
        if event.state:
            carried[event.source] = event
    for source, event in carried.items():
        lanes[source] = [{"at": "00:00", "text": _state_text(event), "since": event.at}]
    for event in read_day(root, day):
        if event.state:
            lanes.setdefault(event.source, []).append({"at": event.at[11:16], "text": _state_text(event), "since": event.at})
    return [{"source": source, "segments": segments} for source, segments in sorted(lanes.items())]


def _state_text(event: Event) -> str:
    return clip(" — ".join(part for part in (event.title, event.text) if part), 200)


# 主对话当天的往来：用户说话和主动消息各在什么时刻。
def read_talk(reader: MessageReader, day: date, now: datetime) -> list[dict[str, str]]:
    hours = int((now - datetime.combine(day, datetime.min.time(), now.tzinfo)).total_seconds() // 3600) + 1
    rows: list[dict[str, str]] = []
    for turn in recent.read_turns(reader, now, hours=hours, scan=3000):
        local = turn.at.astimezone(now.tzinfo)
        if local.date() == day and turn.kind != "reply":
            rows.append({"at": f"{local:%H:%M}", "kind": turn.kind, "text": clip(turn.text, 400)})
    return rows


def read_tail_messages(reader: MessageReader, pages: int = 5) -> list[Message]:
    try:
        page = reader.read_tail(limit=200)
    except KeyError:
        return []
    messages = list(page.messages)
    while page.has_more and pages > 1 and page.messages:
        page, pages = reader.read_tail(before_seq=page.messages[0].seq, through_seq=page.through_seq, limit=200), pages - 1
        messages[:0] = page.messages
    return messages


def _collect_usage(messages: Iterable[Message], call_stats: Callable[[str], ModelCallStats]) -> dict[str, object]:
    grouped: dict[str, ModelStats] = {}
    total = ModelStats("total")
    for message in messages:
        body = message.body
        if not isinstance(body, Output):
            continue
        for part in body.parts:
            if not (isinstance(part, ContentPart) and part.kind == "model.facts" and isinstance(part.value, Mapping)):
                continue
            call_id = part.value.get("call_record_id")
            if not isinstance(call_id, str) or not call_id:
                continue
            try:
                stats = call_stats(call_id)
            except (KeyError, ValueError):
                continue
            bucket = grouped.get(stats.model)
            if bucket is None:
                bucket = grouped[stats.model] = ModelStats(stats.model)
            bucket.add(stats.usage)
            total.add(stats.usage)
    return {"models": [item.to_dict() for item in grouped.values()], "total": total.to_dict()}


# 主 Agent 一个后台回合里的动线：按顺序列出工具调用、每次的结果摘要，以及它最后写下的话。
def read_round_detail(
    reader: MessageReader, name: Callable[[str], str], call_stats: Callable[[str], ModelCallStats], pages: int = 5,
) -> tuple[list[dict[str, str]], dict[str, object]]:
    messages = read_tail_messages(reader, pages)
    return _read_steps(messages, name), _collect_usage(messages, call_stats)


def _read_steps(messages: Iterable[Message], name: Callable[[str], str]) -> list[dict[str, str]]:
    steps: list[dict[str, str]] = []
    for message in messages:
        body = message.body
        if isinstance(body, Output):
            for part in body.parts:
                if isinstance(part, ToolCall):
                    steps.append({"kind": "call", "tool": name(part.binding_id), "text": clip(_plain(part.arguments), 300)})
                elif isinstance(part, ContentPart) and part.kind == "text" and str(part.value).strip():
                    steps.append({"kind": "text", "tool": "", "text": str(part.value).strip()[:2400]})
        elif isinstance(body, ToolResult) and steps and steps[-1]["kind"] == "call":
            text = _output(" ".join(str(part.value) for part in body.parts if part.kind == "text"))
            steps[-1]["result"] = ("" if body.outcome == "success" else f"[{body.outcome}] ") + clip(" ".join(text.split()), 200)
    return steps


# 一个回合留下了什么：对用户说的话和改过的文件。只看成功的调用，按参数的形状认，不认具体是哪个工具。
def read_left(messages: Iterable[Message]) -> list[dict[str, str]]:
    calls: dict[tuple[str, int], ToolCall] = {}
    done: list[ToolCall] = []
    for message in messages:
        body = message.body
        if isinstance(body, Output):
            calls.update({(message.message_id, index): part for index, part in enumerate(body.parts) if isinstance(part, ToolCall)})
        elif isinstance(body, ToolResult) and body.outcome == "success":
            call = calls.get((body.call_ref.message_id, body.call_ref.part_index))
            text = " ".join(str(part.value) for part in body.parts if part.kind == "text")
            if call is not None and not text.startswith("错误"):
                done.append(call)
    left: list[dict[str, str]] = []
    for call in done:
        item = _left_item(call.arguments)
        if item is not None and item not in left:
            left.append(item)
    return left


# 列表记号和行首的方括号标记是文件的格式，不是内容。
def _bare(line: str) -> str:
    return re.sub(r"^\s*(?:[-*#]+\s*)?(?:\[[^\]]*\]\s*)*", "", line)


def _left_item(arguments: Mapping[str, object]) -> dict[str, str] | None:
    if isinstance(arguments.get("message"), str) and "target_chat_id" in arguments:
        return {"kind": "said", "text": str(arguments["message"])[:2400]}
    path = arguments.get("path")
    new = arguments.get("new_text", arguments.get("content"))
    if not isinstance(path, str) or not isinstance(new, str) or path.endswith("inbox.md"):
        return None
    old = str(arguments.get("old_text") or "").splitlines()
    added = [_bare(line) for line in new.splitlines() if line.strip() and line not in old]
    removed = [_bare(line) for line in old if line.strip() and line not in new.splitlines()]
    text = "；".join(added[:2]) if added else "删去：" + "；".join(removed[:2]) if removed else ""
    kind = "rule" if path.endswith(("WATCH.md", "cases.md")) else "note" if path.endswith("notes.md") else "memory" if "memory/" in path else "file"
    return {"kind": kind, "text": clip(text, 140), "path": path.rsplit("/", 1)[-1]}


# 工具结果常是一个 JSON 对象：有 output 字段就只取它，读起来是命令的输出而不是一层包装。
def _output(text: str) -> str:
    try:
        value = json.loads(text)
    except ValueError:
        return text
    return str(value["output"]) if isinstance(value, dict) and isinstance(value.get("output"), str) else text


def _plain(arguments: Mapping[str, object]) -> str:
    return "  ".join(f"{key}={' '.join(str(value).split())}" for key, value in arguments.items())


def parse_day(payload: Mapping[str, object], today: date) -> date:
    raw = payload.get("date")
    if raw is None:
        return today
    try:
        return date.fromisoformat(str(raw))
    except ValueError as error:
        raise PluginUiRpcInvalidRequest("date 需要是 YYYY-MM-DD") from error


def parse_session(payload: Mapping[str, object]) -> str:
    session = str(payload.get("session") or "")
    if not session.startswith("programmatic:watch-"):
        raise PluginUiRpcInvalidRequest("只能读取值班自己的后台会话")
    return session


def has_day_ticks(root: Path, day: date) -> bool:
    path = root / "log" / f"{day:%Y-%m-%d}.md"
    if not path.exists():
        return False
    for text in path.read_text(encoding="utf-8").splitlines():
        if (
            _VERDICT.match(text)
            or _ROUND.match(text)
            or _MEMORY.match(text)
            or _FAILURE.match(text)
            or _WATCHER_USAGE.match(text)
        ):
            return True
    return False


def read_status(root: Path, day: date, reader: MessageReader | None, now: datetime) -> dict[str, object]:
    if not has_day_ticks(root, day):
        return {"has_ticks": False, "said": 0}
    talk = read_talk(reader, day, now) if reader is not None else []
    said = sum(1 for row in talk if row.get("kind") == "push")
    return {"has_ticks": True, "said": said}


def compact_ticks_for_day(ticks: Iterable[Mapping[str, object]]) -> list[dict[str, object]]:
    out: list[dict[str, object]] = []
    log_seq = 0
    for tick in ticks:
        raw_verdicts = tick.get("verdicts")
        verdicts = raw_verdicts if isinstance(raw_verdicts, list) else []
        compacted: list[dict[str, object]] = []
        run_count = 0
        run_start = log_seq
        run_sources: dict[str, int] = {}

        def flush_run() -> None:
            nonlocal run_count, run_start, run_sources
            if not run_count:
                return
            compacted.append({
                "to": "log_summary",
                "count": run_count,
                "sources": dict(run_sources),
                "from_seq": run_start,
                "to_seq": log_seq,
            })
            run_count = 0
            run_sources = {}

        for item in verdicts:
            if not isinstance(item, Mapping):
                continue
            if item.get("to") == "log":
                if not run_count:
                    run_start = log_seq
                src = str(item.get("source") or "unknown")
                run_sources[src] = run_sources.get(src, 0) + 1
                run_count += 1
                log_seq += 1
            else:
                flush_run()
                compacted.append(dict(item))
        flush_run()
        copied = dict(tick)
        copied["verdicts"] = compacted
        out.append(copied)
    return out


def read_log_verdicts(
    root: Path,
    day: date,
    *,
    start: int | None = None,
    end: int | None = None,
    offset: int = 0,
    limit: int = 200,
    max_bytes: int = 128 * 1024,
) -> dict[str, object]:
    path = root / "log" / f"{day:%Y-%m-%d}.md"
    logs: list[dict[str, str]] = []
    for text in path.read_text(encoding="utf-8").splitlines() if path.exists() else ():
        match = _VERDICT.match(text)
        if not match:
            continue
        at, event_id, source, title, to, why = match.groups()
        if to == "log":
            logs.append({"at": at, "id": event_id, "source": source, "title": title, "why": why or ""})

    total_logs = len(logs)
    lo = 0 if start is None else max(0, min(start, total_logs))
    hi = total_logs if end is None else max(lo, min(end, total_logs))
    selected = list(reversed(logs[lo:hi]))
    total = len(selected)
    off = max(0, min(offset, total))
    lim = max(1, min(limit, 200))

    items: list[dict[str, str]] = []
    used_bytes = 64
    for row in selected[off:off + lim]:
        encoded_len = len(json.dumps(row, ensure_ascii=False).encode("utf-8")) + 2
        if items and used_bytes + encoded_len > max_bytes:
            break
        if encoded_len > max_bytes:
            row = {**row, "title": clip(row["title"], 240), "why": clip(row["why"], 240)}
            encoded_len = len(json.dumps(row, ensure_ascii=False).encode("utf-8")) + 2
        items.append(row)
        used_bytes += encoded_len

    next_offset = off + len(items)
    return {
        "items": items,
        "total": total,
        "offset": off,
        "next_offset": next_offset if next_offset < total else None,
    }


def parse_int_arg(
    payload: Mapping[str, object],
    key: str,
    *,
    default: int | None = None,
    minimum: int = 0,
    maximum: int | None = None,
) -> int | None:
    raw = payload.get(key)
    if raw is None:
        return default
    if isinstance(raw, bool) or not isinstance(raw, int):
        raise PluginUiRpcInvalidRequest(f"{key} 必须是整数")
    value = cast(int, raw)
    if value < minimum or (maximum is not None and value > maximum):
        raise PluginUiRpcInvalidRequest(f"{key} 超出允许范围")
    return value
