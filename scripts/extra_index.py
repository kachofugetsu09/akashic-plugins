"""生成 index 分支的内容：组、说明、每包大小、包间依赖、前置条件。只读源码与已构建的 release 分支，结果由输入决定。"""

from __future__ import annotations

import ast
import json
import re
import subprocess
import tomllib
from dataclasses import dataclass
from pathlib import Path

SCHEMA_VERSION = 1
_NEEDS = re.compile(r"docker|command:[A-Za-z0-9][A-Za-z0-9._-]*")


@dataclass(frozen=True)
class PluginInfo:
    directory: str
    name: str
    desc: str
    images: tuple[str, ...]
    imports: frozenset[str]


# 只读 plugin.py 顶层字面量：name、desc、images。
def _literals(path: Path) -> tuple[str, str, tuple[str, ...]]:
    found: dict[str, object] = {}
    for statement in ast.parse(path.read_text(encoding="utf-8")).body:
        if isinstance(statement, ast.Assign) and len(statement.targets) == 1 and isinstance(statement.targets[0], ast.Name):
            if statement.targets[0].id in ("name", "desc", "images"):
                found[statement.targets[0].id] = ast.literal_eval(statement.value)
    return str(found.get("name", "")), str(found.get("desc", "")), tuple(str(item) for item in found.get("images", ()))  # type: ignore[arg-type]


# 插件目录里所有 import 到的 plugins.<目录> 名字（含相对写法之外的绝对导入）。
def _imports(directory: Path) -> frozenset[str]:
    found: set[str] = set()
    for path in directory.rglob("*.py"):
        for node in ast.walk(ast.parse(path.read_text(encoding="utf-8"))):
            if isinstance(node, ast.ImportFrom) and node.module and node.module.startswith("plugins."):
                found.add(node.module.split(".")[1])
            elif isinstance(node, ast.Import):
                found.update(alias.name.split(".")[1] for alias in node.names if alias.name.startswith("plugins."))
    return frozenset(found)


def scan_plugins(root: Path) -> dict[str, PluginInfo]:
    plugins: dict[str, PluginInfo] = {}
    for directory in sorted(path for path in (root / "plugins").iterdir() if path.is_dir() and not path.name.startswith((".", "_"))):
        name, desc, images = _literals(directory / "plugin.py")
        plugins[name] = PluginInfo(directory.name, name, desc, images, _imports(directory))
    return plugins


# release/<名> 分支 tree 里所有文件的字节数之和（git 对象大小，由 tree 决定）。
def tree_size(bare: Path, name: str) -> int:
    out = subprocess.run(["git", "ls-tree", "-r", "-l", f"refs/heads/release/{name}"], cwd=bare, check=True,
                         capture_output=True, text=True).stdout
    return sum(int(line.split(None, 4)[3]) for line in out.splitlines() if line.split(None, 4)[3] != "-")


# 插件声明的资源归档（resources.json）：sha256 -> 字节数。安装时另行下载，不在 release 分支里；
# 按 sha256 列出，客户端汇总总大小时可按 sha256 去重（多个包共用同一份浏览器只下载一次）。
def resource_sizes(root: Path, name: str) -> dict[str, int]:
    path = root / "plugins" / name / "resources.json"
    if not path.is_file():
        return {}
    document = json.loads(path.read_text(encoding="utf-8"))
    return {str(item["sha256"]): int(item.get("size", 0)) for item in document.get("resources", [])}


# 校验 groups.toml 与插件目录一致；返回全部问题（空表示通过）。
def validate(groups: dict[str, dict[str, object]], packages: dict[str, dict[str, object]], plugins: dict[str, PluginInfo]) -> list[str]:
    problems: list[str] = []
    owner: dict[str, str] = {}
    for group_id, group in groups.items():
        for member in group.get("members", []):  # type: ignore[union-attr]
            if member not in plugins:
                problems.append(f"组 {group_id} 的成员 {member} 不是 plugins/ 里的插件")
            elif member in owner:
                problems.append(f"插件 {member} 同时属于组 {owner[member]} 和 {group_id}")
            else:
                owner[member] = group_id
    problems += [f"插件 {name} 没有归入任何组（请加进 groups.toml）" for name in sorted(set(plugins) - set(owner))]
    for name, package in packages.items():
        if name not in plugins:
            problems.append(f"[packages.{name}] 不是 plugins/ 里的插件")
        problems += [f"[packages.{name}] 的前置条件 {item!r} 不合法（只支持 docker、command:<命令>）"
                     for item in package.get("needs", []) if not isinstance(item, str) or not _NEEDS.fullmatch(item)]  # type: ignore[union-attr]
    return problems


# 包间依赖：import 了另一个 extra 插件，就依赖它（按 manifest 名）；检查无环。
def _requires(plugins: dict[str, PluginInfo]) -> dict[str, list[str]]:
    by_directory = {info.directory: name for name, info in plugins.items()}
    requires = {name: sorted(by_directory[item] for item in info.imports if item in by_directory and item != info.directory)
                for name, info in plugins.items()}
    for start in requires:
        seen, stack = set(), list(requires[start])
        while stack:
            current = stack.pop()
            if current == start:
                raise SystemExit(f"插件依赖成环: {start}")
            if current not in seen:
                seen.add(current)
                stack.extend(requires[current])
    return requires


# index.json 的完整内容（文本，键排序、末尾换行：相同输入得到相同字节）。
def build_index(root: Path, bare: Path) -> str:
    document = tomllib.loads((root / "groups.toml").read_text(encoding="utf-8"))
    groups = dict(document.get("groups", {}))
    packages = dict(document.get("packages", {}))
    plugins = scan_plugins(root)
    problems = validate(groups, packages, plugins)
    if problems:
        raise SystemExit("groups.toml 校验失败:\n  " + "\n  ".join(problems))
    requires = _requires(plugins)
    group_of = {member: group_id for group_id, group in groups.items() for member in group["members"]}
    index = {
        "schema_version": SCHEMA_VERSION,
        "groups": {group_id: {"title": group["title"], "description": group["description"],
                              "required": bool(group.get("required", False)), "members": sorted(group["members"])}
                   for group_id, group in groups.items()},
        "packages": {name: {"desc": info.desc, "group": group_of[name], "requires": requires[name],
                            "needs": sorted(packages.get(name, {}).get("needs", [])), "images": list(info.images),
                            "size_bytes": tree_size(bare, name), "resources": resource_sizes(root, name)}
                     for name, info in plugins.items()},
    }
    return json.dumps(index, ensure_ascii=False, indent=1, sort_keys=True) + "\n"
