#!/usr/bin/env python3
"""插件自带的纯 Python wheel：从锁定 sha256 的 sdist 用固定的构建环境重建，产物必须与锁文件和已提交的 wheel 完全一致。

用法：bundled_wheels.py build|check [--lock wheels.lock.json]
build 重建并写入 plugins/<插件>/wheels/；check 只比对（逐字节，不同时再比对 wheel 内容并如实说明）。
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import subprocess
import sys
import tempfile
import urllib.request
import zipfile
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


@dataclass(frozen=True)
class Entry:
    plugin: str
    name: str
    sdist_url: str
    sdist_sha256: str
    source_date_epoch: int
    build_requires: tuple[str, ...]
    wheel: str
    wheel_sha256: str


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


# 读取锁文件。
def load_entries(lock: Path) -> list[Entry]:
    document = json.loads(lock.read_text(encoding="utf-8"))
    return [Entry(item["plugin"], item["name"], item["sdist_url"], item["sdist_sha256"], int(item["source_date_epoch"]),
                  tuple(item["build_requires"]), item["wheel"], item["wheel_sha256"]) for item in document["wheels"]]


def run(*args: str, env: dict[str, str] | None = None) -> None:
    _ = subprocess.run(args, check=True, env={**os.environ, **(env or {})}, stdout=subprocess.DEVNULL)


# 下载 sdist 并先校验 sha256，不对就一个字节都不构建。
def fetch_sdist(entry: Entry, directory: Path) -> Path:
    target = directory / entry.sdist_url.rsplit("/", 1)[1]
    with urllib.request.urlopen(entry.sdist_url, timeout=120) as response:  # noqa: S310
        target.write_bytes(response.read())
    if sha256(target) != entry.sdist_sha256:
        raise SystemExit(f"{entry.name}: sdist 的 sha256 与锁文件不一致: {sha256(target)}")
    return target


# 在新建的 venv 里装固定版本的构建后端，固定 SOURCE_DATE_EPOCH 构建 wheel，返回产物路径。
def build_wheel(entry: Entry, work: Path) -> Path:
    sdist = fetch_sdist(entry, work)
    venv = work / "venv"
    run(sys.executable, "-m", "venv", str(venv))
    python = str(venv / "bin" / "python")
    run(python, "-m", "pip", "install", "-q", "--disable-pip-version-check", *entry.build_requires)
    out = work / "out"
    out.mkdir()
    run(python, "-m", "pip", "wheel", "-q", "--no-deps", "--no-build-isolation", "--no-binary", ":all:", "-w", str(out), str(sdist),
        env={"SOURCE_DATE_EPOCH": str(entry.source_date_epoch)})
    built = out / entry.wheel
    if not built.is_file():
        raise SystemExit(f"{entry.name}: 构建产物不是 {entry.wheel}: {sorted(item.name for item in out.iterdir())}")
    return built


# wheel 的内容指纹：成员名与各成员字节的 sha256（忽略压缩与时间戳差异）。
def content_digest(path: Path) -> dict[str, str]:
    with zipfile.ZipFile(path) as archive:
        return {name: hashlib.sha256(archive.read(name)).hexdigest() for name in sorted(archive.namelist())}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=("build", "check"))
    parser.add_argument("--lock", type=Path, default=ROOT / "wheels.lock.json")
    args = parser.parse_args()
    failed = False
    for entry in load_entries(args.lock):
        committed = ROOT / "plugins" / entry.plugin / "wheels" / entry.wheel
        with tempfile.TemporaryDirectory(prefix="bundled-wheel-") as directory:
            built = build_wheel(entry, Path(directory))
            digest = sha256(built)
            print(f"{entry.wheel}: 构建 {digest}  锁文件 {entry.wheel_sha256}")
            if args.command == "build":
                committed.parent.mkdir(parents=True, exist_ok=True)
                committed.write_bytes(built.read_bytes())
                continue
            if not committed.is_file() or sha256(committed) != entry.wheel_sha256:
                print(f"错误: 已提交的 {committed} 与锁文件不一致", file=sys.stderr)
                failed = True
            elif digest != entry.wheel_sha256:
                same = content_digest(built) == content_digest(committed)
                print(f"{'警告' if same else '错误'}: 重建的字节与锁文件不同；wheel 内容{'完全相同（只是压缩或打包字节不同）' if same else '也不同'}",
                      file=sys.stderr)
                failed = failed or not same
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
