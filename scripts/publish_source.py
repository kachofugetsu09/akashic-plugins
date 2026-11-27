#!/usr/bin/env python3
"""把「插件已构建好、直接提交在仓库里」的插件源发布成与官方源同形的分支：每个插件一条 release/<名>，外加 index。

私有源（例如用子模块聚合各插件仓库的 fleet）用它发布后，就能在 Akashic 里 `pkg source add`。
官方源要合成 Core 构建前端，走 extra_ci.py；这里不构建，只按 git 已跟踪的文件原样发布。
"""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from extra_ci import publish_index, push, release_heads  # noqa: E402
from extra_index import build_index, scan_plugins  # noqa: E402

# 提交身份与时间固定：同一份文件得到同一个提交，内容不变就不推进分支。
_RELEASE_ENV = {
    "GIT_AUTHOR_NAME": "Akashic release", "GIT_AUTHOR_EMAIL": "release@akashic.invalid",
    "GIT_COMMITTER_NAME": "Akashic release", "GIT_COMMITTER_EMAIL": "release@akashic.invalid",
    "GIT_AUTHOR_DATE": "2000-01-01T00:00:00+0000", "GIT_COMMITTER_DATE": "2000-01-01T00:00:00+0000",
}


def _git(*args: str, cwd: Path, env: dict[str, str] | None = None) -> str:
    done = subprocess.run(["git", *args], cwd=cwd, check=True, capture_output=True, text=True,
                          env={**os.environ, **(env or {})})
    return done.stdout.strip()


# 插件目录里 git 跟踪的文件（子模块就是它自己仓库跟踪的文件）。只发布跟踪的文件：
# 未 git add 的目录里可能有 .env 之类的秘密，宁可拒绝也不退回打包整个目录。
def _tracked(directory: Path) -> list[str]:
    listed = _git("ls-files", "-z", cwd=directory)
    files = [item for item in listed.split("\0") if item]
    if not files:
        raise SystemExit(f"{directory} 里没有 git 跟踪的文件：先 git add 并提交，再发布")
    return files


# 把一个插件目录写成裸仓库里的一棵 tree：用临时 index，不碰插件仓库自己的 index。
def _tree(bare: Path, directory: Path) -> str:
    with tempfile.TemporaryDirectory(prefix="publish-index-") as scratch:
        env = {"GIT_DIR": str(bare), "GIT_WORK_TREE": str(directory), "GIT_INDEX_FILE": str(Path(scratch) / "index")}
        files = _tracked(directory)
        for start in range(0, len(files), 500):
            _ = _git("update-index", "--add", "--", *files[start:start + 500], cwd=directory, env=env)
        return _git("write-tree", cwd=directory, env=env)


# 生成全部 release 分支与 index，返回与 extra_ci 同形的发布计划（push 直接复用）。
def build(root: Path, bare: Path, remote: str | None) -> list[dict[str, str]]:
    # 1. 远端已有的分支是比较基准：tree 没变的插件不推进。
    _ = _git("init", "-q", "--bare", str(bare), cwd=root)
    if remote:
        # 第一次发布时远端还没有这些分支：只取存在的，避免空匹配让 fetch 失败。
        existing = _git("ls-remote", "--heads", remote, cwd=bare).splitlines()
        wanted = [f"+{ref}:{ref}" for ref in (line.split("\t", 1)[1] for line in existing if "\t" in line)
                  if ref.startswith("refs/heads/release/") or ref == "refs/heads/index"]
        if wanted:
            _ = _git("fetch", "-q", "--no-tags", "--depth=1", remote, *wanted, cwd=bare)
    before = release_heads(bare)
    old_index = subprocess.run(["git", "rev-parse", "--verify", "--quiet", "refs/heads/index"], cwd=bare,
                               stdout=subprocess.PIPE, text=True).stdout.strip()
    # 2. 每个插件一条 release/<插件名> 分支，分支名取 plugin.py 里的 name。
    rows: list[dict[str, str]] = []
    for name, info in sorted(scan_plugins(root).items()):
        branch = f"release/{name}"
        old = before.get(branch, "")
        tree = _tree(bare, root / "plugins" / info.directory)
        if old and _git("rev-parse", f"{old}^{{tree}}", cwd=bare) == tree:
            rows.append({"name": name, "branch": branch, "tree": tree, "sha": old, "status": "unchanged", "old": old})
            continue
        sha = _git("commit-tree", tree, "-m", f"{name} {tree}\n", cwd=bare, env=_RELEASE_ENV)
        _ = _git("update-ref", f"refs/heads/{branch}", sha, old or "0" * 40, cwd=bare)
        rows.append({"name": name, "branch": branch, "tree": tree, "sha": sha, "status": "updated", "old": old})
    # 3. index 最后写：推送按计划顺序，index 不会指向还没发布的包。
    rows.append(publish_index(bare, build_index(root, bare), old_index))
    return rows


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    _ = parser.add_argument("--root", type=Path, default=Path.cwd(), help="插件源仓库根目录（含 plugins/ 与 groups.toml）")
    _ = parser.add_argument("--bare", type=Path, required=True, help="生成分支用的裸仓库（不存在会新建）")
    _ = parser.add_argument("--remote", help="发布到的远端；给出时先取远端分支作比较，并推送有变化的分支")
    _ = parser.add_argument("--dry-run", action="store_true", help="只生成，不推送")
    options = parser.parse_args()
    root, bare = options.root.resolve(), options.bare.resolve()
    rows = build(root, bare, options.remote)
    plan = bare / "publish-plan.json"
    _ = plan.write_text(json.dumps(rows, ensure_ascii=False, indent=1), encoding="utf-8")
    for row in rows:
        print(f"{row['branch']:<36} {row['status']}")
    if options.remote and not options.dry_run:
        push(bare, options.remote, plan)


if __name__ == "__main__":
    main()
