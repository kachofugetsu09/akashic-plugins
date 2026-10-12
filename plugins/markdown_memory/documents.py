"""Markdown 记忆的文件模型：SELF、PROFILE、topics/ 与按 scope 归属的文件夹，以及提炼操作的校验和叠加。"""
from __future__ import annotations

from collections.abc import Mapping
from dataclasses import asdict, dataclass, field
import re
from typing import Literal, cast, get_args

PROFILE = "PROFILE.md"
SELF = "SELF.md"
TOPICS = "topics"
SCOPE_FILE = "_scope.md"
PROFILE_HEADINGS = ("# 用户画像", "## 用户事实", "## 用户偏好", "## 用户明确要求长期记住的关键内容")
SELF_HEADINGS = ("# Akashic 的自我认知", "## 人格与形象", "## 我对当前用户的理解", "## 我们关系的定义")
# 这些章节记录用户本人或关系判断，只能以用户原话为证据。
USER_SECTIONS: dict[str, frozenset[str]] = {PROFILE: frozenset(PROFILE_HEADINGS[1:]), SELF: frozenset(SELF_HEADINGS[2:])}
USER_HEADINGS: dict[str, tuple[str, ...]] = {PROFILE: PROFILE_HEADINGS[1:], SELF: SELF_HEADINGS[1:]}
MAX_LINE_CHARS = 120
MAX_DESCRIPTION_CHARS = 80
_FOLDER = re.compile(r"[^\s/\\._][^/\\]{0,39}")
_TOPIC_FILE = re.compile(r"[a-z0-9][a-z0-9-]{0,63}\.md")

OpName = Literal["add", "supersede", "retract", "create", "create_folder"]
_FIELDS: dict[str, frozenset[str]] = {
    "add": frozenset({"op", "doc", "line", "message_ids", "section"}),
    "supersede": frozenset({"op", "doc", "old", "line", "message_ids"}),
    "retract": frozenset({"op", "doc", "old", "message_ids"}),
    "create": frozenset({"op", "doc", "description", "line", "message_ids"}),
    "create_folder": frozenset({"op", "folder", "description"}),
}


class InvalidDraft(ValueError):
    """模型草稿违反档案合同；原文或持久状态错误不属于模型重试。"""


@dataclass(frozen=True, slots=True)
class Op:
    op: OpName
    doc: str
    line: str = ""
    old: str = ""
    section: str = ""
    description: str = ""
    message_ids: tuple[str, ...] = ()

    # 只写出该操作类型的字段，receipt 重放时与模型输出走同一解析。
    def to_json(self) -> dict[str, object]:
        values: dict[str, object] = {key: value for key, value in asdict(self).items() if key in _FIELDS[self.op]}
        if self.op == "create_folder":
            values["folder"] = self.doc.split("/", 1)[1]
        else:
            values["message_ids"] = list(self.message_ids)
        if self.op == "add" and not self.section:
            del values["section"]
        return values


# 解析模型或 receipt 中的操作；字段集合按操作类型严格匹配。
def parse_ops(raw: object) -> tuple[Op, ...]:
    if not isinstance(raw, dict) or set(cast(dict[str, object], raw)) != {"ops"}:
        raise InvalidDraft("模型必须只返回 {\"ops\": [...]}")
    items = cast(dict[str, object], raw)["ops"]
    if not isinstance(items, list):
        raise InvalidDraft("ops 必须是数组")
    return tuple(_parse_op(item) for item in cast(list[object], items))


def _parse_op(item: object) -> Op:
    if not isinstance(item, dict):
        raise InvalidDraft("每个操作必须是 JSON object")
    data = cast(dict[str, object], item)
    name = data.get("op")
    if name not in get_args(OpName):
        raise InvalidDraft(f"未知操作: {name!r}")
    allowed = _FIELDS[cast(str, name)]
    required = allowed - {"section"} if name == "add" else allowed
    if not required <= set(data) <= allowed:
        raise InvalidDraft(f"{name} 操作字段必须是 {sorted(allowed)}")
    values = {key: value for key, value in data.items() if key not in {"op", "message_ids", "folder"}}
    if any(not isinstance(value, str) for value in values.values()):
        raise InvalidDraft(f"{name} 操作的文本字段必须是字符串")
    ids = data.get("message_ids", [])
    if name != "create_folder" and (not isinstance(ids, list) or not ids
                                     or any(not isinstance(key, str) for key in cast(list[object], ids))):
        raise InvalidDraft("message_ids 必须是非空消息 ID 数组")
    if name == "create_folder":
        folder = data["folder"]
        if not isinstance(folder, str):
            raise InvalidDraft("folder 必须是字符串")
        values["doc"] = f"{TOPICS}/{folder}"
    return Op(cast(OpName, name), message_ids=tuple(cast(list[str], ids)), **cast(dict[str, str], values))


def split_frontmatter(text: str) -> tuple[dict[str, str], list[str]]:
    lines = text.splitlines()
    if lines[:1] != ["---"] or "---" not in lines[1:]:
        return {}, lines
    end = lines.index("---", 1)
    fields = {key.strip(): value.strip() for key, sep, value in
              (row.partition(":") for row in lines[1:end]) if sep}
    return fields, lines[end + 1:]


def scope_text(scope: str, description: str) -> str:
    return f"---\nscope: {scope}\ndescription: {description}\n---\n"


PROFILE_TEMPLATE = "\n\n".join(PROFILE_HEADINGS) + "\n"


def topic_text(description: str, line: str) -> str:
    return f"---\ndescription: {description}\n---\n{line}\n"


# 当前会话可写的路径：两份档案、全局主题和本 scope 文件夹内的主题。
def writable(doc: str, folder: str | None) -> bool:
    parts = doc.split("/")
    if doc in {PROFILE, SELF}:
        return True
    if parts[0] != TOPICS or not _TOPIC_FILE.fullmatch(parts[-1]):
        return False
    return len(parts) == 2 or (len(parts) == 3 and folder is not None and parts[1] == folder)


@dataclass(slots=True)
class Workspace:
    """一次提炼可见的文本副本；folders 为文件夹名 → scope 宽键。"""

    texts: dict[str, str]
    folders: dict[str, str]
    scope: str | None
    # 重放时前提失效而跳过的操作；与"已应用"区分，写入 applied receipt。
    conflicts: list[str] = field(default_factory=lambda: [])

    def folder(self) -> str | None:
        return next((name for name, key in self.folders.items() if key == self.scope), None)

    # 叠加操作；strict 校验模型给出的原始目标与前提，否则按已验证的 scope 重放并收敛（供 rebase 与崩溃恢复）。
    def apply(self, ops: tuple[Op, ...], *, strict: bool) -> None:
        for index, op in enumerate(ops):
            if op.op == "create_folder":
                self._create_folder(op, strict)
                continue
            doc = op.doc if strict else self._replay_target(op.doc)
            if doc is None:
                self.conflicts.append(f"#{index} {op.op} {op.doc}: 当前 scope 没有文件夹")
                continue
            if strict and not writable(doc, self.folder()):
                raise InvalidDraft(f"不可写入的路径: {op.doc}")
            if op.op == "create" and doc not in self.texts:
                self.texts[doc] = topic_text(op.description, op.line)
            elif op.op in {"add", "create"}:
                self._add(doc, op, strict, index)
            else:
                self._replace(doc, op, strict, index)

    def _replay_target(self, doc: str) -> str | None:
        # 校验时已确认三段路径只指向本 scope；重放按 scope 找实际文件夹，文件夹名只负责定位。
        parts = doc.split("/")
        if len(parts) != 3:
            return doc
        folder = self.folder()
        return None if folder is None else "/".join((parts[0], folder, parts[2]))

    def _create_folder(self, op: Op, strict: bool) -> None:
        name = op.doc.split("/", 1)[1]
        if strict and (self.scope is None or self.folder() is not None
                       or name in self.folders or not _FOLDER.fullmatch(name)):
            raise InvalidDraft("只能为尚无文件夹的当前 scope 新建一个未占用的合法文件夹")
        if self.scope is None or self.folder() is not None:
            return
        while name in self.folders:
            name += "-2"
        self.folders[name] = self.scope
        self.texts[f"{TOPICS}/{name}/{SCOPE_FILE}"] = scope_text(self.scope, op.description)

    def _add(self, doc: str, op: Op, strict: bool, index: int) -> None:
        text = self.texts.get(doc, "")
        if op.line in text.splitlines():
            if strict:
                raise InvalidDraft(f"重复已有条目: {op.line}")
            return
        if doc == PROFILE and not text.strip():
            text = PROFILE_TEMPLATE
        if strict and doc in USER_SECTIONS and op.section not in USER_HEADINGS[doc]:
            raise InvalidDraft(f"{doc} 的 section 必须是 {list(USER_HEADINGS[doc])} 之一")
        if doc in USER_SECTIONS:
            self.texts[doc] = append_section_lines(text, op.section, [op.line])
        elif doc in self.texts:
            self.texts[doc] = text.rstrip("\n") + "\n" + op.line + "\n"
        elif strict:
            raise InvalidDraft(f"主题不存在，应使用 create: {doc}")
        else:
            self.conflicts.append(f"#{index} add {doc}: 主题文件已不存在")

    def _replace(self, doc: str, op: Op, strict: bool, index: int) -> None:
        lines = self.texts.get(doc, "").splitlines()
        if op.old not in lines:
            if strict:
                raise InvalidDraft(f"旧条目不存在: {op.old}")
            # retract 的结果就是旧条目不在；supersede 只有新条目已在才算已应用。
            if op.op == "supersede" and op.line not in lines:
                self.conflicts.append(f"#{index} supersede {doc}: 旧条目与新条目都不在")
            return
        index = lines.index(op.old)
        lines[index:index + 1] = [] if op.op == "retract" or op.line in lines else [op.line]
        self.texts[doc] = "\n".join(lines) + "\n"


def append_section_lines(content: str, heading: str, lines: list[str]) -> str:
    values = content.rstrip().splitlines()
    if heading not in values:
        values.extend(["", heading])
    start = values.index(heading) + 1
    end = next((index for index in range(start, len(values)) if values[index].startswith("#")), len(values))
    while end > start and not values[end - 1].strip():
        end -= 1
    values[end:end] = [line for line in lines if line not in values]
    return "\n".join(values) + "\n"


def section_of(text: str, line: str) -> str:
    heading = ""
    for row in text.splitlines():
        if row.startswith("#"):
            heading = row.strip()
        elif row == line:
            return heading
    return ""


def _section_sizes(text: str) -> dict[str, int]:
    sizes: dict[str, int] = {}
    heading = ""
    for row in text.splitlines():
        if row.startswith("#"):
            heading = row.strip()
        elif row.startswith("- "):
            sizes[heading] = sizes.get(heading, 0) + len(row)
    return sizes


# 只校验模型新写的部分；既有手写内容不因超额或格式而阻断提炼。
def check_changes(before: Mapping[str, str], after: Mapping[str, str],
                  *, profile_budget: int, self_budgets: Mapping[str, int]) -> None:
    for doc, text in after.items():
        old = before.get(doc, "")
        if text == old:
            continue
        # 空行与该文档固定标题是程序维护的结构，不按条目校验。
        structure = {"", *(PROFILE_HEADINGS if doc == PROFILE else SELF_HEADINGS if doc == SELF else ())}
        added = [row for row in text.splitlines() if row not in old.splitlines() and row not in structure]
        if doc.endswith(SCOPE_FILE) or (doc.startswith(TOPICS) and not old):
            fields, _ = split_frontmatter(text)
            if not 0 < len(fields.get("description", "")) <= MAX_DESCRIPTION_CHARS:
                raise InvalidDraft(f"{doc} 需要不超过 {MAX_DESCRIPTION_CHARS} 字的 description")
            added = [row for row in added if not row.startswith(("---", "description:", "scope:"))]
        for row in added:
            if not row.startswith("- ") or len(row) > MAX_LINE_CHARS or "```" in row:
                raise InvalidDraft(f"新条目必须是不超过 {MAX_LINE_CHARS} 字的单行 '- ' 条目: {row[:40]}")
        if doc in USER_SECTIONS:
            _check_budget(doc, old, text, profile_budget, self_budgets)


def _check_budget(doc: str, old: str, text: str, profile_budget: int, self_budgets: Mapping[str, int]) -> None:
    before, after = _section_sizes(old), _section_sizes(text)
    if doc == PROFILE:
        total = sum(after.values())
        if total > profile_budget and total > sum(before.values()):
            raise InvalidDraft(f"PROFILE.md 超出 {profile_budget} 字配额：用 supersede 合并旧条目，或写入 topics/")
        return
    for heading, budget in self_budgets.items():
        if after.get(heading, 0) > budget and after.get(heading, 0) > before.get(heading, 0):
            raise InvalidDraft(f"SELF.md {heading} 超出 {budget} 字配额：用 supersede 合并旧条目")
