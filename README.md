# akashic-plugins

Akashic 官方 extra 插件仓库。`main` 放插件源码，CI 把每个插件构建成完整的插件根，推到 `release/<插件名>` 分支；Core 的 `akashic pkg` 从这些分支安装和升级。目前 32 个插件都在这里。

## 分支约定

- `main`：源码。每个插件一个目录，布局与 Core 完全相同：
  - `plugins/<name>/`：后端（`plugin.py` 等）
  - `frontend/plugins/<name>/`：前端源码
  - `tests/<name>/`：随插件走的测试（可选，只参与 CI，不进 release）
- `release/<name>`：`<name>` 是插件 manifest 里的名字，不一定等于目录名（例如目录 `plugins/opencode_go`，分支 `release/opencode-go`，身份 `opencode-go@release`）。构建产物，插件根（`plugin.py` 在根，含编译后的 `web_module.*`、`plugin_ui.js`、`static/`）。无父提交、作者和时间固定、说明只含名字和 tree，所以提交 SHA 完全由内容决定；tree 不变就不推进。不要手工改，也不要对它们设分支保护（CI 用默认 `GITHUB_TOKEN` 带租约强推）。
- `CORE_REF`：固定的 Core 提交，不是要安装的 Core 版本，只决定构建和检查用哪一份 Core。前端共享包（`packages/`）、构建脚本、边界门禁、pyright/ruff 配置全部取自这个版本的 Core，共享包不发 npm。

## CI

PR 与 main 都会：检出固定版本 Core，把本仓库的 `plugins/`、`frontend/plugins/`、`tests/` 覆盖到 Core 同名位置合成一份源码，然后跑插件边界门禁、ruff、pyright、前端类型与样式合同，并构建全部插件的前端和 release 分支；PR 上还会检查已发布的迁移只能追加（见下）。main 上构建通过后，只推 tree 有变化的分支；同一时间只有一个发布在跑，且只发布 main 当前的最新提交。发布作业偶发被 GitHub 拒绝推送时，直接重跑该次运行即可（构建是确定的，重跑得到同样的提交）。

## 进程内依赖

插件在主进程里直接 import 的第三方包写进插件根的 `requirements.inprocess.txt`（普通 PEP 508 要求，非空才算）。装进插件自己的环境，其 site-packages 追加到 `sys.path` 末尾，Core 自带的同名包永远优先；安装时按 Core 锁和其他已装插件的版本作约束，冲突在改状态前失败。写法：下界取 Core 的 `requirements.txt`，上界取下一个主版本（如 `aiohttp>=3.14.3,<4`），不钉死版本，这样 Core 在同一主版本内升级不会让安装被拒。两个插件的声明文件逐字节相同时共用一个环境。PR 上由 `scripts/check_inprocess.py` 检查：只含普通包要求、与 Core 锁兼容、声明的包确实被导入。

## 迁移只能追加

带数据库迁移的插件（目前只有 `scheduler`：`migration.catalog.toml` 与 `scheduler_migrations/`）一旦发布，已有的迁移源码和 catalog 里已登记的条目就不能改或删，只能追加。PR 上用固定版本 Core 的 `scripts/check_yoyo_migrations.py --root . --base <main>` 检查；本地同样可跑。

## 包组与 index 分支

`groups.toml` 把插件归成组（标题、说明、成员、是否必需）并声明外部前置条件（`docker`、`command:<命令>`），供 Core 的终端选装与 `pkg install @组` 使用；它不决定任何实例装什么。每个插件必须恰好属于一个组，新增插件忘了归组，构建会失败。包间依赖不用写：构建时从插件源码里对另一个 extra 插件的 import 自动算出。

`index` 分支（与 `release/*` 同一套规则：无父提交、固定作者和时间，内容不变则提交不变）只有一个 `index.json`：组、说明、每包大小（`release/<名>` 树里文件字节数之和）、包间依赖、前置条件、镜像。不含版本，版本仍只看 `release/<名>`。本地验证：对已有 release 分支的裸仓库运行 `python scripts/extra_ci.py build ...` 会一并生成并报告 `index` 行。

## 本地构建与验证

```bash
git clone https://github.com/kachofugetsu09/akashic-agent core && git -C core checkout "$(cat CORE_REF)"
python scripts/extra_ci.py compose --core core --synth /tmp/synth
python scripts/extra_ci.py build --core core --synth /tmp/synth --bare /tmp/release.git --plan /tmp/plan.json
git -C /tmp/release.git ls-tree -r release/<name>      # 看产物内容
```

门禁与类型检查在合成目录里跑（需要 `uv pip install -r requirements-dev.txt -e sdk/python` 和 `npm ci`）：`python scripts/plugin_boundary.py check`、`ruff check plugins/<name>`、`pyright plugins/<name>`、`npm run typecheck`。

安装者：用 Core 的 `akashic pkg install <name>`，它读取 `release/<name>` 的最新提交。

## 层级声明

边界门禁要求每个插件声明层级（core 或 extra）：

- 从 Core 迁出的插件：Core 已把它列在 `plugin_boundary.toml` 的 `[tiers].external`，这里不用声明。
- extra 里新建的插件：写进仓库根的 `extra_tiers.toml`（只有 `extra = ["name"]`，只能追加 extra 层，不能改写 Core 的声明）。CI 合成时把它放到合成树根目录。

## 升固定的 Core 版本

1. 把 `CORE_REF` 改成新的 Core 提交，提 PR；CI 会用新版本重新跑门禁和构建。
2. 如果产物的 tree 变了（共享包升级导致），合并后对应分支会自动推进；没变就什么都不发生。
