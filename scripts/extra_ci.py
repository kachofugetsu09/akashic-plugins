#!/usr/bin/env python3
"""extra 仓库的构建与发布胶水：只负责合成源码、记录分支前后状态、带租约推送；构建与 release 提交逻辑全在固定版本 Core 的 scripts/pkg_fixture_repo.py。"""

from __future__ import annotations

import argparse
import io
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tarfile


ROOT = Path(__file__).resolve().parents[1]
# 与 Core 相同的相对布局：这些目录里的内容覆盖到 Core 检出的同名位置。
OVERLAY_DIRS = ("plugins", "frontend/plugins", "tests")
_COMMIT_ENV = {
    "GIT_AUTHOR_NAME": "extra-ci", "GIT_AUTHOR_EMAIL": "extra-ci@akashic.invalid",
    "GIT_COMMITTER_NAME": "extra-ci", "GIT_COMMITTER_EMAIL": "extra-ci@akashic.invalid",
}


# 运行命令；失败直接抛出，输出透传。
def run(*args: str, cwd: Path | None = None, env: dict[str, str] | None = None) -> str:
    result = subprocess.run(args, cwd=cwd, env={**os.environ, **(env or {})}, check=True,
                            stdout=subprocess.PIPE, text=True)
    return result.stdout.strip()


# extra 里的插件名：plugins/ 下的子目录。
def plugin_names(root: Path = ROOT) -> list[str]:
    return sorted(p.name for p in (root / "plugins").iterdir() if p.is_dir() and not p.name.startswith((".", "_")))


# 合成源码：固定版本 Core 的提交树，加 extra 的插件、前端与测试覆盖同名目录，提交成一个临时仓库。
def compose(core: Path, ref: str, out: Path) -> None:
    # 1. 取 Core 固定版本的源码，不带 .git。
    out.mkdir(parents=True)
    archive = subprocess.run(["git", "archive", "--format=tar", ref], cwd=core, check=True, stdout=subprocess.PIPE).stdout
    with tarfile.open(fileobj=io.BytesIO(archive), mode="r:") as stream:
        stream.extractall(out, filter="data")
    # 2. 覆盖：同名插件整目录替换，保证 Core 里的旧副本不会混进来。
    for name in plugin_names():
        for base in OVERLAY_DIRS:
            source, target = ROOT / base / name, out / base / name
            if source.is_dir():
                shutil.rmtree(target, ignore_errors=True)
                shutil.copytree(source, target)
    # 3. 提交成单个提交，供 Core 的脚本按提交读取。
    _ = run("git", "init", "-q", "-b", "compose", cwd=out)
    _ = run("git", "add", "-A", "-f", cwd=out)
    _ = run("git", "-c", "commit.gpgSign=false", "commit", "-q", "-m", f"compose core {ref}", cwd=out, env=_COMMIT_ENV)


# 分支名到提交 SHA；分支不存在的不出现。
def release_heads(bare: Path) -> dict[str, str]:
    out = run("git", "for-each-ref", "--format=%(refname:short) %(objectname)", "refs/heads/release/", cwd=bare)
    return dict(line.split() for line in out.splitlines())


# 构建：先把远端已有 release 分支取进裸仓库（tree 对比的基准），再调用 Core 的脚本，写出发布计划。
def build(core: Path, synth: Path, bare: Path, remote: str | None, plan: Path) -> None:
    _ = run("git", "init", "-q", "--bare", "--initial-branch=release", str(bare))
    if remote:
        _ = run("git", "fetch", "-q", remote, "+refs/heads/release/*:refs/heads/release/*", cwd=bare)
    before = release_heads(bare)
    names = plugin_names()
    out = run(sys.executable, str(core / "scripts/pkg_fixture_repo.py"), *names,
              "--repository", str(synth), "--revision", "HEAD", "--output", str(bare))
    rows: list[dict[str, str]] = json.loads(out)
    for row in rows:
        row["old"] = before.get(row["branch"], "")
    plan.write_text(json.dumps(rows, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(rows, ensure_ascii=False, indent=2))


# 推送：只推 tree 变化的分支；远端必须仍停在构建时观察到的提交（租约），否则放弃，不覆盖更新的内容。
def push(bare: Path, remote: str, plan: Path) -> None:
    for row in json.loads(plan.read_text(encoding="utf-8")):
        if row["status"] != "updated":
            continue
        branch = row["branch"]
        lease = f"--force-with-lease=refs/heads/{branch}:{row['old']}"
        _ = run("git", "push", lease, remote, f"{row['sha']}:refs/heads/{branch}", cwd=bare)
        print(f"pushed {branch} {row['old'] or '(new)'} -> {row['sha']}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)
    compose_p, build_p, push_p = (sub.add_parser(n) for n in ("compose", "build", "push"))
    for item in (compose_p, build_p):
        item.add_argument("--core", type=Path, required=True, help="固定版本的 Core 检出")
        item.add_argument("--synth", type=Path, required=True, help="合成源码目录（compose 输出、build 输入）")
    compose_p.add_argument("--ref", default=None, help="默认读 CORE_REF")
    for item in (build_p, push_p):
        item.add_argument("--bare", type=Path, required=True)
        item.add_argument("--plan", type=Path, required=True)
    build_p.add_argument("--remote", default=None)
    push_p.add_argument("--remote", required=True)
    args = parser.parse_args()
    if args.command == "compose":
        ref = args.ref or (ROOT / "CORE_REF").read_text(encoding="utf-8").strip()
        compose(args.core.resolve(), ref, args.synth.resolve())
    elif args.command == "build":
        build(args.core.resolve(), args.synth.resolve(), args.bare.resolve(), args.remote, args.plan.resolve())
    else:
        push(args.bare.resolve(), args.remote, args.plan.resolve())


if __name__ == "__main__":
    main()
