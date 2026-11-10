# akashic-plugins

[Akashic](https://github.com/kachofugetsu09/akashic-agent) 的内置插件（preset）、Web 界面与插件侧的场景脚本、测试。

这个仓库与 Core 在文件层面互不重叠：路径保持 monorepo 时的布局（`plugins/`、`frontend/`、`packages/`、`bundles/` 等），
两边的并集就是完整源码。Core 用根目录的 `plugins.lock` 锁定这里的一个提交；发布、构建、CI 都把两边合成为一个
确定性的源提交（`scripts/compose_source.py`）。插件按内容寻址，只有内容变化的插件会在部署时被替换。

## 开发

在 Core 的检出里挂载本仓库，两边共用一个工作目录，`python main.py`、`npm`、`pytest` 照常使用：

```bash
git clone https://github.com/kachofugetsu09/akashic-agent.git && cd akashic-agent
python3 scripts/plugins_workspace.py attach        # 检出 plugins.lock 锁定的提交
npm ci
scripts/plugins-git switch -c my-change            # 在本仓库开分支
python3 scripts/plugins_workspace.py status        # 两侧修改，以及两侧都未跟踪的新文件
```

`scripts/plugins-git` 就是指向本仓库的 `git`，提交、推送都用它。

## 改动怎么上线

1. 在本仓库提 PR。CI 用 Core `main` 与 PR 提交合成后跑 Core 的同一套检查。
2. 合入本仓库 `main` 后，在 Core 里运行 `python3 scripts/plugins_workspace.py lock`，提交 `plugins.lock` 的更新。
   Core 只接受已经进入本仓库 `main` 的提交。
3. 需要同时改 Core（契约、宿主扩展点）时，Core PR 与本仓库 PR 一起准备，本仓库先合入，再在 Core PR 里锁定合入后的提交。
