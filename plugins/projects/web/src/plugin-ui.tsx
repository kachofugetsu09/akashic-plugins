import "./plugin-ui.css";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  GroupIconPicker, render,
  type ChatPluginRuntimeContext, type ChatSlotHandle, type NavigationForm, type NavigationGroup, type NavigationGroupView,
  type NavigationGroupsProvider, type PluginUiHostContext, type PluginUiNavigationContext, type PluginUiNavigationFormContext,
  type ScopeFieldValues, type ScopeMetaItem, type ScopeMetaRecord,
} from "@akashic/chat-ui-v1";

type Query = PluginUiHostContext["query"];

interface Project {
  id: string;
  name: string;
  archived: boolean;
  directory: string | null;
  icon: string | null;
  color: string | null;
}

interface PendingProject {
  id: string;
  name: string;
  directory?: string | null;
  /** 附加设置随请求记下：继续创建时原样重放，与项目记录同一事务提交。 */
  extensions?: ScopeFieldValues;
}

interface PendingRow {
  key: string;
  id?: string;
  name: string;
  directory?: string | null;
  invalid: boolean;
}

const PENDING_PREFIX = "akashic.project-create.";

function projectOf(value: unknown): Project {
  const row = typeof value === "object" && value !== null && !Array.isArray(value) ? value as Record<string, unknown> : null;
  if (!row || typeof row.id !== "string" || !row.id || typeof row.name !== "string" || typeof row.archived !== "boolean"
    || (row.directory !== undefined && row.directory !== null && typeof row.directory !== "string")
    || (row.icon !== undefined && row.icon !== null && typeof row.icon !== "string")
    || (row.color !== undefined && row.color !== null && typeof row.color !== "string")) {
    throw new Error("项目记录无效");
  }
  return {
    id: row.id,
    name: row.name,
    archived: row.archived,
    directory: typeof row.directory === "string" ? row.directory : null,
    icon: typeof row.icon === "string" && row.icon ? row.icon : null,
    color: typeof row.color === "string" && row.color ? row.color : null,
  };
}

function parsePending(key: string, raw: string | null): PendingProject {
  const value: unknown = JSON.parse(raw ?? "null");
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error("待创建项目记录无效");
  const row = value as Record<string, unknown>;
  // 旧版本的请求带记忆选择，继续创建会丢掉它；只能停止后重新新建。
  if (typeof row.id !== "string" || key !== PENDING_PREFIX + row.id
    || typeof row.name !== "string" || !row.name || "memory" in row
    || (row.directory !== undefined && row.directory !== null
      && (typeof row.directory !== "string" || !row.directory.startsWith("/")))
    || (row.extensions !== undefined && (typeof row.extensions !== "object" || row.extensions === null
      || Array.isArray(row.extensions)))) throw new Error("待创建项目记录无效");
  return row as unknown as PendingProject;
}

// 本地请求只供用户手动恢复；损坏的单条记录不阻断其他项目。
function listPending(): { items: PendingRow[]; error: string } {
  try {
    const items = Object.keys(localStorage).filter((key) => key.startsWith(PENDING_PREFIX)).map((key): PendingRow => {
      try {
        const pending = parsePending(key, localStorage.getItem(key));
        return { key, id: pending.id, name: pending.name, directory: pending.directory, invalid: false };
      } catch {
        return { key, name: "无法读取的本地请求", invalid: true };
      }
    });
    return { items, error: "" };
  } catch {
    return { items: [], error: "本地未确认请求暂不可读；已提交项目仍可使用。" };
  }
}

// 同一 ID 创建一次；只有项目记录提交后才开放 Session 入口。
async function finishProject(query: Query, pending: PendingProject): Promise<string> {
  const project = projectOf(await query("project.create", {
    project_id: pending.id, name: pending.name, ...(pending.directory ? { directory: pending.directory } : {}),
    ...(pending.extensions && Object.keys(pending.extensions).length ? { extensions: pending.extensions } : {}),
  }));
  if (project.id !== pending.id) throw new Error("项目创建响应 ID 不一致");
  localStorage.removeItem(PENDING_PREFIX + pending.id);
  return project.id;
}

// 项目与其他插件的附加设置（例如记忆策略）一次原子提交；响应丢失的请求只由用户显式继续。
async function createProject(query: Query, name: string, directory: string | null,
  extensions: ScopeFieldValues): Promise<string> {
  const snapshot = listPending();
  if (snapshot.error) throw new Error(snapshot.error);
  if (snapshot.items.some((item) => item.name === name)) throw new Error("同名项目存在未确认请求，请在项目栏继续创建或停止尝试");
  // 纯 HTTP 访问时没有 randomUUID，直接取 16 个随机字节。
  const id = Array.from(crypto.getRandomValues(new Uint8Array(16)), (value) => value.toString(16).padStart(2, "0")).join("");
  const pending = { id: `p_${id}`, name, directory, extensions };
  // 先记下请求，响应丢失时可在项目栏继续；同一 ID 重放得到同一项目与设置。
  localStorage.setItem(PENDING_PREFIX + pending.id, JSON.stringify(pending));
  try {
    return await finishProject(query, pending);
  } catch (error) {
    throw new Error(`${error instanceof Error ? error.message : "创建项目失败"}。可在项目栏继续创建或停止尝试。`);
  }
}

interface DirectoryPage {
  path: string;
  items: { name: string; path: string }[];
  parent: string | null;
  after: string | null;
}

const STATUS: Record<string, string> = { available: "可用", unset: "未设置", not_found: "目录已缺失",
  not_directory: "不是目录", permission_denied: "没有访问权限", offline: "执行主机离线", io_error: "读取失败" };

function directoryPage(row: Record<string, unknown>): DirectoryPage {
  if (row.status !== "available") {
    throw new Error(`${STATUS[String(row.status)] ?? String(row.status)}：${String(row.path ?? "")}${typeof row.error === "string" ? ` · ${row.error}` : ""}`);
  }
  const items = Array.isArray(row.items) ? row.items : null;
  if (typeof row.path !== "string" || !items || !items.every((item: unknown) => typeof item === "object" && item !== null
    && typeof (item as { name?: unknown }).name === "string" && typeof (item as { path?: unknown }).path === "string")) {
    throw new Error("目录列表响应无效");
  }
  return { path: row.path, items: items as DirectoryPage["items"],
    parent: typeof row.parent === "string" ? row.parent : null, after: typeof row.after === "string" ? row.after : null };
}

const message = (reason: unknown, fallback: string) => reason instanceof Error ? reason.message : fallback;

// 浏览执行主机目录；当前打开的目录经 onPage 交给表单决定如何使用。
function DirectoryBrowser({ query, busy, onPage, children }: {
  query: Query; busy: boolean; onPage: (path: string | null) => void; children?: ReactNode;
}) {
  const [path, setPath] = useState("~");
  const [page, setPage] = useState<DirectoryPage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // 只采纳最后一次读取；改路径或卸载即作废在途结果。
  const request = useRef(0);
  const browse = async (target: string, after?: string) => {
    const current = ++request.current;
    setPath(target); setPage(null); onPage(null); setLoading(true); setError("");
    try {
      const next = directoryPage(await query("directory.browse", { path: target, ...(after ? { after } : {}) }, { cache: "none" }));
      if (current !== request.current) return;
      setPage(next); setPath(next.path); onPage(next.path);
    } catch (reason) {
      if (current === request.current) setError(message(reason, "目录读取失败"));
    } finally {
      if (current === request.current) setLoading(false);
    }
  };
  // 必要 effect：打开即读取起始目录，卸载时作废仍在途的读取。
  useEffect(() => { void browse("~"); return () => { request.current += 1; }; }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return <div className="projects-ui-browser">
    <p className="projects-ui-muted">目录来自运行 Akashic 工具的执行主机。连接远程服务时，不是当前浏览器所在电脑的目录。</p>
    <label className="projects-ui-open">
      <span>执行主机路径</span>
      <span><input value={path} disabled={busy} onChange={(event) => { request.current += 1; setPath(event.target.value); setPage(null); onPage(null); setLoading(false); }}
        onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); if (path.trim() && !loading) void browse(path); } }} />
      <button type="button" disabled={!path.trim() || loading || busy} onClick={() => void browse(path)}>打开</button></span>
    </label>
    <p className="projects-ui-path" aria-live="polite">{page?.path ?? "尚未选择目录"}</p>
    {loading ? <p role="status">正在读取执行主机目录…</p> : null}
    {page && !loading ? <div className="projects-ui-list" aria-label="子目录">
      {page.parent ? <button type="button" disabled={busy} onClick={() => void browse(page.parent!)}>↑ 上一级</button> : null}
      {page.items.map((item) => <button type="button" key={item.name} disabled={busy} onClick={() => void browse(item.path)}>{item.name} /</button>)}
      {!page.items.length ? <p>没有子目录，可以选择当前目录。</p> : null}
      {page.after ? <button type="button" disabled={busy} onClick={() => void browse(page.path, page.after!)}>下一页</button> : null}
    </div> : null}
    {error ? <p className="projects-ui-error" role="alert">{error}</p> : null}
    {page && !loading ? children : null}
  </div>;
}

// 表单的提交状态由宿主持有，变化时经 onInvalidate 通知。
function useBusy(context: PluginUiNavigationFormContext): boolean {
  const [busy, setBusy] = useState(() => context.form.busy());
  useEffect(() => context.onInvalidate(() => setBusy(context.form.busy())), [context]);
  return busy;
}

// 新建项目：名称与可选的默认目录；宿主按钮提交，scope.fields 的附加设置随创建请求一起原子提交。
function CreateProject({ context }: { context: PluginUiNavigationFormContext }) {
  const [name, setName] = useState("");
  const [directory, setDirectory] = useState<string | null>(null);
  const [browsing, setBrowsing] = useState(false);
  const [page, setPage] = useState<string | null>(null);
  const busy = useBusy(context);
  const latest = useRef({ name, directory });
  latest.current = { name, directory };
  useEffect(() => context.form.onSubmit((extensions) =>
    createProject(context.query, latest.current.name.trim(), latest.current.directory, extensions())), [context]);
  useEffect(() => context.form.setReady(Boolean(name.trim())), [context, name]);
  return <div className="projects-ui-form">
    <label className="projects-ui-field">
      <span>项目名称</span>
      <input autoFocus value={name} maxLength={80} placeholder="例如：论文写作" disabled={busy} onChange={(event) => setName(event.target.value)} />
    </label>
    <p className="projects-ui-muted">把相关对话放在一起，方便持续开展同一项工作。</p>
    <div className="projects-ui-field">
      <strong>默认目录（可选）</strong>
      <p className="projects-ui-path">{directory ?? "未设置"}</p>
      {browsing ? <DirectoryBrowser query={context.query} busy={busy} onPage={setPage}>
        <span className="projects-ui-actions">
          <button type="button" disabled={!page || busy} onClick={() => { setDirectory(page); setBrowsing(false); }}>使用此目录</button>
          <button type="button" disabled={busy} onClick={() => setBrowsing(false)}>取消</button>
        </span>
      </DirectoryBrowser> : <span className="projects-ui-actions">
        <button type="button" disabled={busy} onClick={() => setBrowsing(true)}>{directory ? "重新选择" : "选择目录"}</button>
        {directory ? <button type="button" disabled={busy} onClick={() => setDirectory(null)}>取消选择</button> : null}
      </span>}
      {directory ? <p className="projects-ui-muted">创建后目录固定，之后的新会话使用这个默认目录。</p> : null}
    </div>
  </div>;
}

// 绑定目录：首次绑定由插件原子提交，不提供重绑或清空。
function BindDirectory({ context, projectId }: { context: PluginUiNavigationFormContext; projectId: string }) {
  const busy = useBusy(context);
  const page = useRef<string | null>(null);
  useEffect(() => context.form.onSubmit(async () => {
    if (!page.current) throw new Error("请先打开一个目录");
    projectOf(await context.query("project.bind_directory", { project_id: projectId, path: page.current }));
  }), [context, projectId]);
  return <div className="projects-ui-form">
    <p className="projects-ui-muted">目录可不设置。首次绑定后不可更改或清空；已有对话不变。</p>
    <DirectoryBrowser query={context.query} busy={busy} onPage={(path) => { page.current = path; context.form.setReady(Boolean(path)); }} />
  </div>;
}

// 固定目录只读：显示执行主机上的当前状态。
function FixedDirectory({ context, group }: { context: PluginUiNavigationFormContext; group: NavigationGroup }) {
  const [state, setState] = useState("正在检查执行主机…");
  const [error, setError] = useState("");
  useEffect(() => {
    let live = true;
    void context.query("project.directory", { project_id: group.id }, { cache: "none" }).then((row) => {
      if (!live) return;
      setState(STATUS[String(row.status)] ?? String(row.status));
      if (typeof row.error === "string") setError(row.error);
    }).catch((reason: unknown) => { if (live) { setState("状态未能读取"); setError(message(reason, "目录状态读取失败")); } });
    return () => { live = false; };
  }, [context, group.id]);
  return <div className="projects-ui-form">
    <p className="projects-ui-muted">这个项目的目录已固定。已有对话的工作目录各自独立。</p>
    <p className="projects-ui-path">{group.detail}</p>
    <p role="status">{state}</p>
    {error ? <p className="projects-ui-error">{error}</p> : null}
  </div>;
}

// 未确认的新建请求：仅在用户点“继续创建”时重试；没有请求时不渲染任何东西。
function PendingProjects({ context }: { context: PluginUiNavigationContext }) {
  const [snapshot, setSnapshot] = useState(listPending);
  const [busyKey, setBusyKey] = useState("");
  const [error, setError] = useState("");
  useEffect(() => context.onInvalidate(() => setSnapshot(listPending())), [context]);
  const settle = () => { setSnapshot(listPending()); context.navigation.reload(); };
  const resume = async (item: PendingRow) => {
    setBusyKey(item.key); setError("");
    try {
      const id = await finishProject(context.query, parsePending(item.key, localStorage.getItem(item.key)));
      context.navigation.startChat(id);
    } catch (reason) {
      setError(message(reason, "继续创建失败"));
    } finally {
      setBusyKey(""); settle();
    }
  };
  if (snapshot.error) return <p className="projects-ui-error" role="alert">{snapshot.error}</p>;
  if (!snapshot.items.length) return null;
  return <div className="projects-ui-pending" aria-label="未确认的项目创建">
    <strong>未确认的项目创建</strong>
    <p>仅在点“继续创建”时重试。停止尝试只清除本地请求，不撤销可能已提交的策略或项目。</p>
    {snapshot.items.map((item) => <div key={item.key} className="projects-ui-pending__item">
      <span title={item.name}>{item.name}</span>
      <small>{item.invalid ? "本地请求损坏，无法继续" : "创建结果未确认"}</small>
      {item.directory ? <small className="projects-ui-path">默认目录：{item.directory}</small> : null}
      <span className="projects-ui-actions">
        {!item.invalid ? <button type="button" disabled={Boolean(busyKey)} onClick={() => void resume(item)}>
          {busyKey === item.key ? "正在继续…" : "继续创建"}</button> : null}
        <button type="button" disabled={Boolean(busyKey)} onClick={() => { localStorage.removeItem(item.key); settle(); }}>停止尝试</button>
      </span>
    </div>)}
    {error ? <p className="projects-ui-error" role="alert">{error}</p> : null}
  </div>;
}

// 更换项目图标：复用宿主提供的 kubai-icons/line 全量分类选择器与纸面语义色板。
function ChangeIcon({ context, group }: { context: PluginUiNavigationFormContext; group: NavigationGroup }) {
  const [icon, setIcon] = useState<string | null>(group.icon ?? null);
  const [color, setColor] = useState<string | null>(group.color ?? null);
  const busy = useBusy(context);
  const latest = useRef({ icon, color });
  latest.current = { icon, color };
  useEffect(() => context.form.onSubmit(async () => {
    projectOf(await context.query("project.set_icon", {
      project_id: group.id,
      icon: latest.current.icon,
      color: latest.current.color,
    }));
  }), [context, group.id]);
  useEffect(() => context.form.setReady(true), [context]);
  return <div className="projects-ui-form">
    <GroupIconPicker value={icon} color={color} disabled={busy} onChange={setIcon} onColorChange={setColor} />
  </div>;
}

const mountWith = <C,>(view: (context: C) => ReactNode) =>
  (host: HTMLElement, context: C) => render(host, view(context));

const iconForm = (group: NavigationGroup): NavigationForm => ({
  title: `更换「${group.label}」图标`,
  submitLabel: "保存图标",
  mount: mountWith((context: PluginUiNavigationFormContext) => <ChangeIcon context={context} group={group} />),
});

const directoryForm = (group: NavigationGroup): NavigationForm => group.detail
  ? { title: "固定目录", mount: mountWith((context: PluginUiNavigationFormContext) => <FixedDirectory context={context} group={group} />) }
  : { title: "选择执行主机目录", submitLabel: "绑定此目录", mount: mountWith((context: PluginUiNavigationFormContext) => <BindDirectory context={context} projectId={group.id} />) };

const groups: NavigationGroupsProvider = {
  dimension: "project",
  label: "项目",
  async load({ query }) {
    const result = await query("project.list");
    if (!Array.isArray(result.items)) throw new Error("项目列表无效");
    return result.items.map(projectOf).filter((project) => !project.archived)
      .map((project) => ({
        id: project.id,
        label: project.name,
        ...(project.directory ? { detail: project.directory } : {}),
        ...(project.icon ? { icon: project.icon } : {}),
        ...(project.color ? { color: project.color } : {}),
      }));
  },
  create: { title: "创建项目", submitLabel: "创建项目", mount: mountWith((context: PluginUiNavigationFormContext) => <CreateProject context={context} />) },
  actions: (group) => [
    { label: "更换图标", icon: "sparkles", form: iconForm(group) },
    { label: group.detail ? "查看固定目录" : "选择目录", icon: "folder", form: directoryForm(group) },
  ],
  notice: { mount: mountWith((context: PluginUiNavigationContext) => <PendingProjects context={context} />) },
};

const PROJECT_COLOR_TOKENS: Readonly<Record<string, string>> = {
  pine: "var(--ak-chart-3)",
  blue: "var(--ak-chart-1)",
  ochre: "var(--ak-chart-2)",
  plum: "var(--ak-chart-4)",
  teal: "var(--ak-chart-6)",
  cinnabar: "var(--ak-chart-5)",
};

function ProjectIconMark({ icon, color, size, trigger, iconProvider }: {
  icon?: string;
  color?: string;
  size: number;
  trigger: "hover" | "parent" | "none";
  iconProvider?: Parameters<NonNullable<NavigationGroupView["renderLeading"]>>[0]["iconProvider"];
}) {
  const tint = color ? PROJECT_COLOR_TOKENS[color] : undefined;
  const IconComp = iconProvider?.Icon;
  return <span className="navigation-group__icon" style={tint ? { color: tint } : undefined} aria-hidden="true">
    {IconComp
      ? <IconComp name={icon || "folder"} size={size} trigger={trigger} />
      : <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
      </svg>}
  </span>;
}

interface ProjectHoverSectionProps {
  readonly group: NavigationGroup;
  readonly meta?: ScopeMetaItem;
}

interface KernelHoverRuntime {
  readonly handle: ChatSlotHandle;
  readonly Outlet: ChatPluginRuntimeContext["Outlet"];
  readonly useSlotEntries: ChatPluginRuntimeContext["useSlotEntries"];
}

let activeHoverRuntime: KernelHoverRuntime | null = null;

/**
 * v3 微内核激活：由 projects 自己声明自有命名空间子槽 "projects.hover_card.sections"，
 * 任何外部插件（如 akasha）可直接向该子槽贡献项目浮卡扩展块，Core 零知情、零白名单。
 */
export function activate(ctx: ChatPluginRuntimeContext): void {
  const handle = ctx.slots.declare("projects.hover_card.sections");
  const runtime: KernelHoverRuntime = {
    handle,
    Outlet: ctx.Outlet,
    useSlotEntries: ctx.useSlotEntries,
  };
  activeHoverRuntime = runtime;
  ctx.onDispose(() => {
    if (activeHoverRuntime === runtime) activeHoverRuntime = null;
  });
}

function DefaultMetaSection({ item }: { item: ScopeMetaItem }) {
  return <div className="group-hover-card__section">
    <div className="group-hover-card__kicker">
      <span className={`group-hover-card__dot group-hover-card__dot--${item.tone ?? "muted"}`} aria-hidden="true" />
      <span className="group-hover-card__policy">{item.label}</span>
    </div>
    {item.description ? <p className="group-hover-card__desc">{item.description}</p> : null}
  </div>;
}

function ProjectHoverCardBody({ group, metaRecords, hasActions, iconProvider }: {
  group: NavigationGroup;
  metaRecords: readonly ScopeMetaRecord[];
  hasActions: boolean;
  iconProvider?: Parameters<NonNullable<NavigationGroupView["renderLeading"]>>[0]["iconProvider"];
}) {
  const runtime = activeHoverRuntime;
  // 若 v3 微内核未激活（如运行在旧版宿主），安全退化到通用 meta 展示。
  if (!runtime || !runtime.handle.isCurrent()) {
    return <div data-project-hover-card="true">
      <div className="group-hover-card__head">
        <span className="group-hover-card__icon">
          <ProjectIconMark icon={group.icon} color={group.color} size={16} trigger="none" iconProvider={iconProvider} />
        </span>
        <strong className="group-hover-card__title">{group.label}</strong>
      </div>
      {metaRecords.map(({ key, item }) => <DefaultMetaSection key={key} item={item} />)}
      {group.detail ? <div className="group-hover-card__section group-hover-card__dir">
        <code className="group-hover-card__path">{group.detail}</code>
      </div> : null}
      {hasActions ? <div className="group-hover-card__foot">右键或点行尾菜单查看更多操作</div> : null}
    </div>;
  }

  return <ProjectHoverCardWithSlots
    runtime={runtime}
    group={group}
    metaRecords={metaRecords}
    hasActions={hasActions}
    iconProvider={iconProvider}
  />;
}

function ProjectHoverCardWithSlots({ runtime, group, metaRecords, hasActions, iconProvider }: {
  runtime: KernelHoverRuntime;
  group: NavigationGroup;
  metaRecords: readonly ScopeMetaRecord[];
  hasActions: boolean;
  iconProvider?: Parameters<NonNullable<NavigationGroupView["renderLeading"]>>[0]["iconProvider"];
}) {
  const { handle, Outlet, useSlotEntries } = runtime;
  const entries = useSlotEntries<ProjectHoverSectionProps>(handle);

  return <div data-project-hover-card="true">
    <div className="group-hover-card__head">
      <span className="group-hover-card__icon">
        <ProjectIconMark icon={group.icon} color={group.color} size={16} trigger="none" iconProvider={iconProvider} />
      </span>
      <strong className="group-hover-card__title">{group.label}</strong>
    </div>
    {/* 按 (owner, item.id) 逐项选择：同 owner 贡献了替代 section 时由受保护 Outlet 渲染，出错局部回退通用 meta。 */}
    {metaRecords.map(({ owner, key, item }) => {
      // 按内核确定性排序仅选首个获胜替代项，按其完整身份过滤并挂唯一通用回退，杜绝双渲染或双回退。
      const winner = entries.find((entry) => entry.ownerId === owner && entry.replacesMetaId === item.id);
      if (!winner) return <DefaultMetaSection key={key} item={item} />;
      return <Outlet
        key={key}
        handle={handle}
        props={{ group, meta: item }}
        filter={(entry) => entry.ownerId === winner.ownerId && entry.ownerRevision === winner.ownerRevision && entry.id === winner.id}
        entryFallback={() => <DefaultMetaSection item={item} />}
      />;
    })}
    {/* 独立扩展块（未声明 replacesMetaId）：任意外部插件均可追加展示而不改 Core 或 projects。 */}
    <Outlet
      handle={handle}
      props={{ group }}
      filter={(entry) => !entry.replacesMetaId}
    />
    {group.detail ? <div className="group-hover-card__section group-hover-card__dir">
      <code className="group-hover-card__path">{group.detail}</code>
    </div> : null}
    {hasActions ? <div className="group-hover-card__foot">右键或点行尾菜单查看更多操作</div> : null}
  </div>;
}

const projectGroupView: NavigationGroupView = {
  renderLeading: ({ group, iconProvider }) => (
    <ProjectIconMark icon={group.icon} color={group.color} size={18} trigger="parent" iconProvider={iconProvider} />
  ),
  renderHoverCard: ({ group, meta, metaRecords, hasActions, iconProvider }) => (
    <ProjectHoverCardBody
      group={group}
      metaRecords={metaRecords ?? meta.map((item, idx) => ({ owner: "", key: `${item.id}:${idx}`, item }))}
      hasActions={hasActions}
      iconProvider={iconProvider}
    />
  ),
};

export default {
  slots: { "navigation.groups": groups },
  navigationViews: { groups: projectGroupView },
};
