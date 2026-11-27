#!/usr/bin/env python3
"""extra 仓库的构建与发布胶水：只负责合成源码、记录分支前后状态、带租约推送；构建与 release 提交逻辑全在固定版本 Core 的 scripts/pkg_fixture_repo.py。"""

from __future__ import annotations

import argparse
from concurrent.futures import ThreadPoolExecutor
import importlib.util
import io
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tarfile
import tempfile
import time


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(Path(__file__).resolve().parent))
from extra_index import build_index  # noqa: E402
# 与 Core 相同的相对布局：业务插件前端已随插件归属在 plugins/<name>/web/ 下。
OVERLAY_DIRS = ("plugins", "tests")
EXTRA_TIERS_FILE = "extra_tiers.toml"
# 用户界面入口与 Agent operation 一对一门禁的 extra 清单；合成树里与 Core 清单合并检查。
PARITY_FILE = "interaction_parity.extra.json"
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
    # 2. 覆盖：同名插件整目录替换，保证 Core 里的旧副本不会混进来；显式忽略本地 node_modules 与 .generated。
    ignore = shutil.ignore_patterns("node_modules", ".generated", ".build-staging")
    for name in plugin_names():
        for base in OVERLAY_DIRS:
            source, target = ROOT / base / name, out / base / name
            if source.is_dir():
                shutil.rmtree(target, ignore_errors=True)
                shutil.copytree(source, target, ignore=ignore)
    # 3. 层级声明文件（如有）放到合成树根目录，边界门禁自动读取。
    for name in (EXTRA_TIERS_FILE, PARITY_FILE):
        if (ROOT / name).is_file():
            shutil.copy(ROOT / name, out / name)
    # 4. 提交成单个提交，供 Core 的脚本按提交读取。
    _ = run("git", "init", "-q", "-b", "compose", cwd=out)
    _ = run("git", "add", "-A", "-f", cwd=out)
    _ = run("git", "-c", "commit.gpgSign=false", "commit", "-q", "-m", f"compose core {ref}", cwd=out, env=_COMMIT_ENV)


# 分支名到提交 SHA；分支不存在的不出现。
def release_heads(bare: Path) -> dict[str, str]:
    out = run("git", "for-each-ref", "--format=%(refname:short) %(objectname)", "refs/heads/release/", cwd=bare)
    return dict(line.split() for line in out.splitlines())


# index 分支的固定身份与时间：与 release 分支同一套规则，提交只由 tree 决定。
_INDEX_ENV = {
    "GIT_AUTHOR_NAME": "Akashic release", "GIT_AUTHOR_EMAIL": "release@akashic.invalid",
    "GIT_COMMITTER_NAME": "Akashic release", "GIT_COMMITTER_EMAIL": "release@akashic.invalid",
    "GIT_AUTHOR_DATE": "2000-01-01T00:00:00+0000", "GIT_COMMITTER_DATE": "2000-01-01T00:00:00+0000",
}


# 把 index.json 写成只含这一个文件的无父提交；内容不变则不推进分支。返回与 release 行同形的状态行。
def publish_index(bare: Path, text: str, old: str) -> dict[str, str]:
    blob = subprocess.run(["git", "hash-object", "-w", "--stdin"], cwd=bare, input=text, check=True,
                          stdout=subprocess.PIPE, text=True).stdout.strip()
    tree = subprocess.run(["git", "mktree"], cwd=bare, input=f"100644 blob {blob}\tindex.json\n", check=True,
                          stdout=subprocess.PIPE, text=True).stdout.strip()
    old_tree = run("git", "rev-parse", f"{old}^{{tree}}", cwd=bare) if old else ""
    if old_tree == tree:
        return {"name": "index", "branch": "index", "tree": tree, "sha": old, "status": "unchanged", "old": old}
    sha = run("git", "-c", "commit.gpgSign=false", "commit-tree", tree, "-m", f"index {tree}\n", cwd=bare, env=_INDEX_ENV)
    _ = run("git", "update-ref", "refs/heads/index", sha, old or "0" * 40, cwd=bare)
    return {"name": "index", "branch": "index", "tree": tree, "sha": sha, "status": "updated", "old": old}


# 加载合成树（源自固定版本 Core）里的 pkg_fixture_repo 模块（只复用其中的 staging 与 release 提交函数）。
def _load_pkg_fixture(synth: Path):
    if str(synth) not in sys.path:
        sys.path.insert(0, str(synth))
    spec = importlib.util.spec_from_file_location("_core_pkg_fixture_repo", synth / "scripts/pkg_fixture_repo.py")
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


# 复用 synth 已装好的 node_modules 构建插件前端并并行写入 release tree；与 pkg_fixture_repo.py 逐字节等价。
def _build_release_fast(
    synth: Path,
    bare: Path,
    names: list[str],
    fetch_future=None,
) -> list[dict[str, str]]:
    fixture = _load_pkg_fixture(synth)
    commit = fixture.git(synth, "rev-parse", "--verify", "--end-of-options", "HEAD^{commit}").decode().strip()
    fixture.ensure_bare_repo(bare)
    # 外壳应用归 ui / akashic_clients；extra 不含这两个插件时只构插件前端，省掉 dashboard/chat。
    needs_shell = any(n in ("ui", "akashic_clients") for n in names)
    build_cmd = ["npm", "run", "build" if needs_shell else "build:web-plugins"]
    env = {**os.environ, "CI": "1"}
    _ = subprocess.run(build_cmd, cwd=synth, env=env, check=True)
    generated_root = synth / "plugins"

    # 确保远端 release/* fetch 已完成，再向 bare 写对象和比对分支。
    if fetch_future is not None:
        fetch_future.result()

    def stage_one(name: str) -> tuple[str, str]:
        root = f"plugins/{name}"
        with tempfile.TemporaryDirectory(prefix="akashic-release-") as directory:
            scratch = Path(directory)
            package = scratch / "package"
            package.mkdir()
            fixture.stage_plugin_package(synth, commit, root, package, generated_root)
            plugin = fixture.load_static_plugin_manifest(package).name
            tree = fixture.write_tree(bare, package, scratch)
        return plugin, tree

    workers = min(8, os.cpu_count() or 4)
    with ThreadPoolExecutor(max_workers=workers) as pool:
        staged = list(pool.map(stage_one, names))

    rows: list[dict[str, str]] = []
    for plugin, tree in staged:
        branch = f"release/{plugin}"
        old_tree, old_sha = fixture.branch_head(bare, branch)
        if old_tree == tree:
            rows.append({"name": plugin, "branch": branch, "tree": tree, "sha": old_sha, "status": "unchanged"})
            continue
        sha = fixture.commit_tree(bare, tree, plugin)
        _ = fixture.git(bare, "update-ref", f"refs/heads/{branch}", sha, old_sha or "0" * 40)
        rows.append({"name": plugin, "branch": branch, "tree": tree, "sha": sha, "status": "updated"})
    return rows


# 构建：先把远端已有 release 分支取进裸仓库（tree 对比的基准），再生成 release 分支与发布计划。
def build(core: Path, synth: Path, bare: Path, remote: str | None, plan: Path) -> None:
    _ = run("git", "init", "-q", "--bare", "--initial-branch=release", str(bare))

    def _fetch_remote() -> tuple[dict[str, str], str]:
        if remote:
            _ = run("git", "fetch", "-q", "--no-tags", "--depth=1", remote,
                    "+refs/heads/release/*:refs/heads/release/*", cwd=bare)
            # index 分支可能还不存在（第一次发布前）：取不到就当作新分支。
            _ = subprocess.run(["git", "fetch", "-q", "--no-tags", "--depth=1", remote,
                                "+refs/heads/index:refs/heads/index"], cwd=bare)
        heads = release_heads(bare)
        idx = subprocess.run(["git", "rev-parse", "--verify", "--quiet", "refs/heads/index"], cwd=bare,
                             stdout=subprocess.PIPE, text=True).stdout.strip()
        return heads, idx

    names = plugin_names()
    if (synth / "node_modules").is_dir():
        with ThreadPoolExecutor(max_workers=1) as fetch_pool:
            fetch_future = fetch_pool.submit(_fetch_remote)
            rows = _build_release_fast(synth, bare, names, fetch_future=fetch_future)
            before, old_index = fetch_future.result()
    else:
        before, old_index = _fetch_remote()
        out = run(sys.executable, str(core / "scripts/pkg_fixture_repo.py"), *names,
                  "--repository", str(synth), "--revision", "HEAD", "--output", str(bare))
        rows = json.loads(out)
    for row in rows:
        row["old"] = before.get(row["branch"], "")
    # index 放在最后：推送按计划顺序，release 分支先到位，index 不会指向还没发布的包。
    rows.append(publish_index(bare, build_index(ROOT, bare), old_index))
    plan.write_text(json.dumps(rows, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(rows, ensure_ascii=False, indent=2))


def _discover_plugin_tsconfigs(synth: Path) -> list[Path]:
    found: list[Path] = []
    for base, sub in ((synth / "plugins", "web"), (synth / "frontend" / "plugins", "")):
        if not base.is_dir():
            continue
        for entry in sorted(base.iterdir()):
            if not entry.is_dir():
                continue
            container = entry / sub if sub else entry
            if not container.is_dir():
                continue
            for child in sorted(container.iterdir()):
                if not child.is_dir() or child.name == "node_modules" or child.name.startswith("."):
                    continue
                cfg = child / "tsconfig.json"
                if cfg.is_file():
                    found.append(cfg)
    return found


# 为 tsgo（TypeScript 7）生成兼容配置：移除已废弃的 baseUrl、补齐相对 paths、关闭副作用导入检查。
def _prepare_tsgo_configs(synth: Path) -> list[Path]:
    main_src = synth / "tsconfig.json"
    main_cfg = json.loads(main_src.read_text(encoding="utf-8"))
    co = main_cfg.setdefault("compilerOptions", {})
    co.pop("baseUrl", None)
    co["noUncheckedSideEffectImports"] = False
    if "paths" in co:
        co["paths"] = {
            k: [v if v.startswith("./") else "./" + v for v in vs]
            for k, vs in co["paths"].items()
        }
    main_out = synth / ".tsconfig.tsgo.json"
    main_out.write_text(json.dumps(main_cfg, indent=2) + "\n", encoding="utf-8")

    configs = [main_out]
    for sub_src in _discover_plugin_tsconfigs(synth):
        sub_cfg = json.loads(sub_src.read_text(encoding="utf-8"))
        rel_main = Path(os.path.relpath(main_out, sub_src.parent)).as_posix()
        sub_cfg["extends"] = rel_main if rel_main.startswith(".") else f"./{rel_main}"
        sco = sub_cfg.setdefault("compilerOptions", {})
        sco.pop("baseUrl", None)
        sco["noUncheckedSideEffectImports"] = False
        sub_out = sub_src.parent / ".tsconfig.tsgo.json"
        sub_out.write_text(json.dumps(sub_cfg, indent=2) + "\n", encoding="utf-8")
        configs.append(sub_out)
    return configs


# 并发执行 CI 检查与 release 分支构建；scope 支持 all / python / web。
def verify(
    core: Path,
    synth: Path,
    bare: Path | None,
    remote: str | None,
    plan: Path | None,
    scope: str = "all",
    skip_boundary: bool = False,
) -> None:
    names = plugin_names()
    plugin_paths = [f"plugins/{name}" for name in names]
    test_dirs = [f"tests/{p.name}" for p in sorted((ROOT / "tests").iterdir()) if p.is_dir()] if (ROOT / "tests").is_dir() else []

    tasks: list[tuple[str, list[list[str]], Path]] = []

    if scope in ("all", "python", "static"):
        if not skip_boundary:
            tasks.append(("Plugin boundary gate", [[sys.executable, "scripts/plugin_boundary.py", "check"]], synth))
        tasks.append(("User interface and agent operations stay one-to-one", [
            [sys.executable, "scripts/check_interaction_parity.py", "self-test"],
            [sys.executable, "scripts/check_interaction_parity.py", "check"],
        ], synth))
        tasks.append(("Check bundled wheels", [[
            sys.executable, str(ROOT / "scripts/bundled_wheels.py"), "check", "--lock", str(ROOT / "wheels.lock.json"),
        ]], ROOT))

    if scope in ("all", "python", "lint"):
        pyright_cmd = ["pyright", "--threads", "--level", "error", *plugin_paths] if scope == "lint" else [
            "pyright", "--threads", "2", "--level", "error", *plugin_paths,
        ]
        tasks.append(("Lint and type check Python", [
            ["ruff", "check", *plugin_paths],
            pyright_cmd,
        ], synth))
        tasks.append(("Check in-process dependencies", [[
            sys.executable, str(ROOT / "scripts/check_inprocess.py"),
            "docker/host-runtime/requirements.lock", str(ROOT / "plugins"),
        ]], synth))

    if scope in ("all", "python", "test"):
        pytest_cmd = ["pytest", "-q", "-n", "2", *test_dirs] if scope == "test" else ["pytest", "-q", *test_dirs]
        tasks.append(("Run plugin tests", [pytest_cmd] if test_dirs else [], synth))

    if scope in ("all", "web"):
        assert bare is not None and plan is not None
        build_cmd = [
            sys.executable, str(Path(__file__).resolve()), "build",
            "--core", str(core), "--synth", str(synth),
            "--bare", str(bare), "--plan", str(plan),
        ]
        if remote:
            build_cmd.extend(["--remote", remote])

        tsgo = shutil.which("tsgo")
        if tsgo:
            tsgo_configs = _prepare_tsgo_configs(synth)
            frontend_typecheck_cmds = [[tsgo, "--noEmit", "-p", str(cfg)] for cfg in tsgo_configs]
        else:
            frontend_typecheck_cmds = [
                ["npx", "--no-install", "tsc", "--noEmit"],
                ["node", "scripts/typecheck-plugin-projects.mjs"],
            ]
        tasks.append(("Build release branches", [build_cmd], ROOT))
        tasks.append(("Check frontend", [
            *frontend_typecheck_cmds,
            ["npm", "run", "check:css-tokens"],
            ["npm", "run", "check:motion"],
        ], synth))

    def run_task(item: tuple[str, list[list[str]], Path]) -> tuple[str, int, float, str]:
        label, commands, cwd = item
        started = time.monotonic()
        if not commands:
            return label, 0, 0.0, "skipped (no targets)\n"
        chunks: list[str] = []
        for cmd in commands:
            proc = subprocess.run(cmd, cwd=cwd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
            if proc.stdout:
                chunks.append(proc.stdout)
            if proc.returncode != 0:
                return label, proc.returncode, time.monotonic() - started, "".join(chunks)
        return label, 0, time.monotonic() - started, "".join(chunks)

    total_start = time.monotonic()
    workers = min(len(tasks), max(2, os.cpu_count() or 2))
    with ThreadPoolExecutor(max_workers=workers) as pool:
        results = list(pool.map(run_task, tasks))
    total_elapsed = time.monotonic() - total_start

    failed: list[tuple[str, int, float, str]] = []
    print(f"=== CI verify[{scope}] summary (wall: {total_elapsed:.1f}s, workers: {workers}) ===")
    for label, code, elapsed, output in results:
        status = "PASS" if code == 0 else f"FAIL(exit={code})"
        print(f"  [{status:12s}] {elapsed:5.1f}s  {label}")
        if code != 0:
            failed.append((label, code, elapsed, output))
    for label, code, elapsed, output in results:
        if code == 0:
            print(f"::group::{label} ({elapsed:.1f}s)")
            if output:
                print(output, end="" if output.endswith("\n") else "\n")
            print("::endgroup::")
    for label, code, elapsed, output in failed:
        print(f"::error::{label} failed (exit={code}, {elapsed:.1f}s)")
        if output:
            print(output, end="" if output.endswith("\n") else "\n")
    if failed:
        raise SystemExit(1)


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
    compose_p, build_p, verify_p, push_p = (sub.add_parser(n) for n in ("compose", "build", "verify", "push"))
    for item in (compose_p, build_p, verify_p):
        item.add_argument("--core", type=Path, required=True, help="固定版本的 Core 检出")
        item.add_argument("--synth", type=Path, required=True, help="合成源码目录（compose 输出、build 输入）")
    compose_p.add_argument("--ref", default=None, help="默认读 CORE_REF")
    for item in (build_p, push_p):
        item.add_argument("--bare", type=Path, required=True)
        item.add_argument("--plan", type=Path, required=True)
    verify_p.add_argument("--bare", type=Path, default=None)
    verify_p.add_argument("--plan", type=Path, default=None)
    verify_p.add_argument("--scope", choices=("all", "python", "static", "lint", "test", "web"), default="all")
    verify_p.add_argument("--skip-boundary", action="store_true")
    for item in (build_p, verify_p):
        item.add_argument("--remote", default=None)
    push_p.add_argument("--remote", required=True)
    args = parser.parse_args()
    if args.command == "compose":
        ref = args.ref or (ROOT / "CORE_REF").read_text(encoding="utf-8").strip()
        compose(args.core.resolve(), ref, args.synth.resolve())
    elif args.command == "build":
        build(args.core.resolve(), args.synth.resolve(), args.bare.resolve(), args.remote, args.plan.resolve())
    elif args.command == "verify":
        verify(
            args.core.resolve(),
            args.synth.resolve(),
            args.bare.resolve() if args.bare else None,
            args.remote,
            args.plan.resolve() if args.plan else None,
            scope=args.scope,
            skip_boundary=args.skip_boundary,
        )
    else:
        push(args.bare.resolve(), args.remote, args.plan.resolve())


if __name__ == "__main__":
    main()
