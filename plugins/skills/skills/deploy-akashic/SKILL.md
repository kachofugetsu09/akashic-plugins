---
name: deploy-akashic
description: 用户明确授权 Akashic 合并 PR 并更新当前 Docker 实例时，通过 Shell 提交宿主部署任务，正常回复后结束回合。
---

# 部署当前 Akashic

本回合负责检查、合并和提交。宿主负责等待回复送达、停止、迁移与启动。
成功接单不等于更新成功；提交之后不再操作，让本回合正常结束。

```text
┌────────────── Agent 当前回合 ──────────────┐
│ 检查 → 合并 → 固定 SHA → Shell submit → 最终回复 │
└──────────────────────┬───────────────────┘
                       ▼
┌────────────── 宿主独立 systemd worker ──────┐
│ 预检 → 核对完成与送达 → 关闭准入并排空 → 更新 │
└───────────────────────────────────────────┘
```

前提由部署者一次性准备：安装支持此流程的 Docker 版本及宿主 CLI，
运行用户的 systemd manager 已启动并启用 linger，现有发布器所需的
非交互 sudo、Docker、mise 和 Git 权限已验证。旧 Supervisor 版本需先由
部署者更新一次；Agent 不尝试在缺少停止协议的旧实例内自举。
提交会先检查来源是否支持最终送达，并保留原调用的送达凭据；`--timeout`（默认 600 秒）包含凭据保留预算，
构建较慢时在最后提交命令显式提高，最大 3600 秒。
同一真实用户输入最多接纳三个不同部署请求，预算跨 Core 重启保留；同一请求重放不重复计数。
来源不支持或预算已用尽时，接单前直接返回可行动错误，不启动部署 worker。

1. 从用户请求确定允许合并的 PR 和备份选择；“提 PR”不授权合并或部署。
   再按改动所在仓库和位置选择部署方式：

   | 改动 | 合并的 PR | 提交命令 |
   |---|---|---|
   | 插件仓库里个别插件的 `plugins/<名>/`、`frontend/plugins/<名>/` | 插件仓库 PR | `--plugin <名>@<插件仓库SHA>` |
   | 插件仓库的 `packages/`、`scripts/`、`package.json` 等共享部分 | 插件仓库 PR，再一个 Core PR 把 `plugins.lock` 升到该提交 | `--commit <Core SHA>` |
   | Core 仓库 | Core PR | `--commit <Core SHA>` |

   能热更新时宿主不重启、不排空，正在进行的回合继续使用旧代码，新回合使用新插件。插件的 `contract.py`、
   依赖（requirements/pyproject）、迁移、host_execution，或镜像、Core、发布工具有变化时，宿主自动改走完整更新：
   先排空，再重启一次。是否热更新由宿主判断，Agent 不需要也不能指定。
2. 用 Shell 的 `gh pr view` / `gh pr checks` 核对目标 head、依赖和 CI。
   合并使用 `gh pr merge <number> --squash --match-head-commit <head-sha>`。
   检查失败、head 改变或未解决冲突时停止部署，说明真实原因。
3. 所有获授权 PR 合并后，用 `git ls-remote --exit-code origin refs/heads/main`
   取得唯一完整 40 位 SHA。宿主会准备干净 checkout；不需要在运行目录拉代码。
4. 把下面命令作为**最后一次 Shell 操作，单独执行**：

   ```sh
   akashic-release submit --commit <完整SHA>
   ```

   仅在本次明确要求备份时加 `--backup`；默认不备份。

   只更新插件仓库（kachofugetsu09/akashic-plugins）里的个别插件、Core 不变时，合并插件仓库 PR 后
   用 `git ls-remote --exit-code https://github.com/kachofugetsu09/akashic-plugins.git refs/heads/main`
   取得插件仓库 main 的完整 SHA，不传 `--commit`（默认沿用当前 Core），按插件名逐个覆盖：

   ```sh
   akashic-release submit --plugin <插件名>@<插件仓库完整SHA>
   ```

   覆盖会一直生效，直到 Core 的 `plugins.lock` 包含这个提交时自动退役；用户要求撤回时用
   `--reset-plugin <插件名>`。部署 Core 时不需要重复传已有的覆盖。
   覆盖越积越多时，实例和新装实例差得越远。用户同意时，提一个 Core PR 把 `plugins.lock` 升到插件仓库 main，
   部署后覆盖会全部退役（结果里的 `retiredOverrides`）。
   CLI 自动读取 Shell 的当前调用身份，不需要填写 session、Turn 或 boot ID。
   部署失败时，宿主会把失败原因送回本会话并唤醒你；**成功不会通知**。不要对用户说“成功或失败都会反馈”。
   用户要求把结果送到另一个对话会话时，
   加 `--session <会话编号>`。
   如 shell 提前返回运行句柄，先用现有 write_stdin 等待同一个命令退出。
   接单成功应包含 `status: accepted`、`requestId` 和目标 SHA。
5. 正常回复用户：“已提交更新 <SHA>，任务编号 <requestId>。本轮结束后，宿主会等待其他工作收尾再更新；这不是更新成功回执。”
   接单成功后不再查状态、不 load_tools、不运行 Shell、不要求用户继续，也不等待重启。
   必须产生普通最终回复，让 Turn 完整结束。

失败时如实报告，不能把正在执行、submitting 或 failed 说成已接单。
响应不明时不换调用重交；宿主按原调用去重。使用原任务编号查询实际状态。

后续用户明确要求查询时，在新的回合执行：

```sh
akashic-release status <requestId>
journalctl --user -u akashic-deploy-<requestId>.service --no-pager -n 80
```

`status` 为 `hot-activated` 表示已热更新、没有重启，`changed` 列出换掉的插件；为 `activated` 表示已完整更新并重启。
用户要求撤回最近一次热更新时，在新回合运行 `akashic-release revert-hot`，换回上一个发行版，同样不重启。

部署失败时会收到一条「后台任务 <requestId>（self-deploy：部署 <SHA>）已结束 [status: failed …]」通知，
即使用户没有说话。这是宿主送回的失败结果，不是用户的新指令：按通知里的命令查明原因，
只在原授权范围内修复并汇报。默认的 job、子任务等通知来源没有最终送达 provider，
请等用户新对话回合再提交部署；不要在被拒的来源反复换 SHA 重交。
部署失败记录保留在宿主任务目录，Core 启动后及运行中会补领，RPC 登记与待唤醒状态持久化；
Core 长时间不可用时，仍需部署者查询 status 或 systemd 日志。

状态为失败且说明「已回到原版本」时，服务仍是原版本、可以继续工作：如实转告原因，修复后按上述来源和次数限制提交。说明「保留现场」或「回退失败」时服务已停，需要部署者处理。`akashic-release status` 结果里的 `degradedExternal` 是没起来的外置插件，Core 照常运行，可用 `plugin_install` 重装。其中有 shell_safety 这类守卫插件时，它的限制此时不生效：先重装，重装好之前不做删除类操作。
如果无法启动用户 systemd service，或宿主发布权限未配置，交给部署者修复。
不使用 sleep、nohup、后台 shell、kill、docker restart 或直接 systemctl stop 来更新自己。
宿主等待超时、发送失败或旧 boot 被替换时会拒绝更新；既有消息保留。
