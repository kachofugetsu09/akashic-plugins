#!/usr/bin/env python3
"""检查插件的 requirements.inprocess.txt：只含普通包要求、与 Core 锁兼容、声明的包确实被导入；--hints 另列未声明的第三方导入。

用法：check_inprocess.py <Core 的 requirements.lock> [插件目录] [--hints]"""

from __future__ import annotations

import ast
import re
import sys
from importlib.metadata import packages_distributions
from pathlib import Path

from packaging.requirements import InvalidRequirement, Requirement
from packaging.utils import canonicalize_name
from packaging.version import Version

ROOT = Path(__file__).resolve().parents[1]
_PIN = re.compile(r"^([A-Za-z0-9][A-Za-z0-9._-]*)==([^\s;]+)", re.MULTILINE)
_INTERNAL = frozenset({"plugins", "agent", "core", "infra", "bootstrap", "sdk", "akashic_sdk"})


# Core 锁里的 name==version，包名规范化。
def core_pins(lock: Path) -> dict[str, Version]:
    return {canonicalize_name(name): Version(version) for name, version in _PIN.findall(lock.read_text(encoding="utf-8"))}


# 插件源码里导入的第三方顶层模块（相对导入、标准库、Core 内部与插件自己的包除外）。
def imported_modules(plugin: Path) -> set[str]:
    found: set[str] = set()
    for path in plugin.rglob("*.py"):
        for node in ast.walk(ast.parse(path.read_text(encoding="utf-8"))):
            names = [a.name for a in node.names] if isinstance(node, ast.Import) else (
                [node.module] if isinstance(node, ast.ImportFrom) and node.level == 0 and node.module else [])
            found.update(name.split(".")[0] for name in names)
    return {name for name in found if name not in sys.stdlib_module_names and name not in _INTERNAL}


# 逐个插件检查；返回错误行，并把提示行打印到标准输出。
def check_plugin(plugin: Path, pins: dict[str, Version]) -> list[str]:
    declared_file = plugin / "requirements.inprocess.txt"
    owners = packages_distributions()
    imported = {canonicalize_name(dist) for module in imported_modules(plugin) for dist in owners.get(module, ())}
    errors: list[str] = []
    declared: set[str] = set()
    if declared_file.is_file():
        for number, raw in enumerate(declared_file.read_text(encoding="utf-8").splitlines(), 1):
            line = raw.split(" #", 1)[0].strip()
            if not line or line.startswith("#"):
                continue
            try:
                requirement = Requirement(line)
            except InvalidRequirement:
                errors.append(f"{declared_file}:{number} 不是普通包要求: {line}")
                continue
            name = canonicalize_name(requirement.name)
            declared.add(name)
            if requirement.url is not None:
                errors.append(f"{declared_file}:{number} 不支持 URL/VCS: {line}")
            elif name in pins and not requirement.specifier.contains(pins[name], prereleases=True):
                errors.append(f"{declared_file}:{number} {line} 与 Core 锁的 {name}=={pins[name]} 不兼容")
            elif name not in imported:
                errors.append(f"{declared_file}:{number} 声明了 {name}，但插件源码没有导入它（过时的声明？）")
    undeclared = sorted(imported - declared - {canonicalize_name(n) for n in ("pydantic", "httpx")})
    for name in undeclared if "--hints" in sys.argv else ():
        print(f"提示 {plugin.name}: 导入了 {name} 但没有在 requirements.inprocess.txt 声明；Core 删掉该依赖后会失败")
    return errors


def main() -> int:
    arguments = [item for item in sys.argv[1:] if not item.startswith("--")]
    lock = Path(arguments[0])
    plugins_root = Path(arguments[1]) if len(arguments) > 1 else ROOT / "plugins"
    pins = core_pins(lock)
    errors = [error for plugin in sorted(plugins_root.iterdir()) if plugin.is_dir() for error in check_plugin(plugin, pins)]
    for error in errors:
        print(error, file=sys.stderr)
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
