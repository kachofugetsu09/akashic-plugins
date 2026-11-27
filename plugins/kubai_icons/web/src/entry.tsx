import "./styles.css";
import { useEffect, useMemo, useState } from "react";
import { KubaiIcon } from "kubai-icons-react";
import folderIcon from "kubai-icons/line/icons/folder";
import type {
  ChatPluginRuntimeContext, IconPickerViewProps, IconProvider, IconRenderProps,
} from "@akashic/chat-ui-v1";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore 由 build.mjs 在构建期生成，按官方 26 个分类拆分懒加载 chunk。
import { CATEGORY_BY_NAME, loadCategoryIcons } from "../.generated/loader.js";

type KubaiIconDef = typeof folderIcon;

interface CatalogEntry {
  readonly name: string;
  readonly category: string;
  readonly tags: readonly string[];
  readonly searchText: string;
}

interface CatalogCategory {
  readonly id: string;
  readonly label: string;
  readonly icons: readonly CatalogEntry[];
}

interface ParsedCatalog {
  readonly categories: readonly CatalogCategory[];
  readonly allIcons: readonly CatalogEntry[];
}

const CATEGORY_ZH: Readonly<Record<string, string>> = {
  files: "文件文档",
  development: "开发编程",
  devices: "设备硬件",
  science: "科学实验",
  education: "学业阅读",
  tools: "工具效率",
  interface: "界面通用",
  communication: "通讯协作",
  home: "家居生活",
  commerce: "财务消费",
  media: "影音创作",
  charts: "数据图表",
  time: "时间日程",
  travel: "旅行地图",
  nature: "自然植物",
  weather: "天气气候",
  food: "饮食咖啡",
  transport: "交通出行",
  people: "人物社交",
  security: "安全隐私",
  health: "健康医疗",
  sports: "运动游戏",
  text: "文字编辑",
  layout: "布局视图",
  arrows: "方向箭头",
  shapes: "基础图形",
};

const PRIORITY: readonly string[] = [
  "files", "development", "devices", "education", "science", "tools",
  "commerce", "communication", "media", "home", "interface", "charts",
];

const SEARCH_RESULT_LIMIT = 96;

const categoryMap = CATEGORY_BY_NAME as Readonly<Record<string, string>>;
const iconCache = new Map<string, KubaiIconDef>([["folder", folderIcon]]);
const categoryPromises = new Map<string, Promise<Record<string, KubaiIconDef>>>();

function loadIconDef(name: string): Promise<KubaiIconDef | null> {
  const cached = iconCache.get(name);
  if (cached) return Promise.resolve(cached);
  const category = categoryMap[name];
  if (!category) return Promise.resolve(null);
  let pending = categoryPromises.get(category);
  if (!pending) {
    pending = (loadCategoryIcons(category) as Promise<Record<string, KubaiIconDef>>).then(
      (icons) => {
        for (const [iconName, def] of Object.entries(icons)) {
          iconCache.set(iconName, def);
        }
        return icons;
      },
      () => {
        categoryPromises.delete(category);
        return {};
      },
    );
    categoryPromises.set(category, pending);
  }
  return pending.then((icons) => icons[name] ?? null, () => null);
}

let catalogPromise: Promise<ParsedCatalog> | null = null;
function loadCatalog(): Promise<ParsedCatalog> {
  if (!catalogPromise) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore 由 build.mjs 生成的独立目录 chunk，打开选择器时按需加载。
    catalogPromise = (import("../.generated/catalog-data.js") as Promise<{
      CATEGORIES: { id: string; en: string }[];
      LINE_ICONS: { name: string; category: string; tags?: string[] }[];
    }>).then(({ CATEGORIES, LINE_ICONS }) => {
      const entries: CatalogEntry[] = LINE_ICONS.map((item) => {
        const tags = Array.isArray(item.tags) ? item.tags : [];
        const zh = CATEGORY_ZH[item.category] ?? item.category;
        return {
          name: item.name,
          category: item.category,
          tags,
          searchText: `${item.name} ${tags.join(" ")} ${item.category} ${zh}`.toLowerCase(),
        };
      });
      const grouped = new Map<string, CatalogEntry[]>();
      for (const entry of entries) {
        const bucket = grouped.get(entry.category);
        if (bucket) bucket.push(entry);
        else grouped.set(entry.category, [entry]);
      }
      const metaMap = new Map(CATEGORIES.map((item) => [item.id, item]));
      const orderedIds = [
        ...PRIORITY.filter((id) => grouped.has(id)),
        ...[...grouped.keys()].filter((id) => !PRIORITY.includes(id)),
      ];
      return {
        categories: orderedIds.map((id) => ({
          id,
          label: CATEGORY_ZH[id] ?? metaMap.get(id)?.en ?? id,
          icons: grouped.get(id) ?? [],
        })),
        allIcons: entries,
      };
    }).catch((err) => {
      catalogPromise = null;
      throw err;
    });
  }
  return catalogPromise;
}

function KubaiLineIcon({ name, size = 18, trigger = "parent", className }: IconRenderProps) {
  const clean = name.trim() || "folder";
  const [loaded, setLoaded] = useState<{ name: string; def: KubaiIconDef } | null>(() => {
    const hit = iconCache.get(clean);
    return hit ? { name: clean, def: hit } : null;
  });

  useEffect(() => {
    if (iconCache.has(clean)) return;
    let live = true;
    void loadIconDef(clean).then((def) => {
      if (live && def) setLoaded({ name: clean, def });
    });
    return () => { live = false; };
  }, [clean]);

  const iconDef = iconCache.get(clean) ?? (loaded?.name === clean ? loaded.def : folderIcon);
  return <KubaiIcon
    icon={iconDef}
    size={size}
    variant="outline"
    strokeWidth={1.75}
    trigger={trigger}
    aria-hidden={true}
    className={className}
  />;
}

function KubaiLinePicker({ value, disabled = false, onChange }: IconPickerViewProps) {
  const [catalog, setCatalog] = useState<ParsedCatalog | null>(null);
  const [categoryId, setCategoryId] = useState<string>(() => (value && categoryMap[value]) || "files");
  const [query, setQuery] = useState("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let live = true;
    void loadCatalog().then(
      (data) => { if (live) setCatalog(data); },
      () => { if (live) setFailed(true); },
    );
    return () => { live = false; };
  }, []);

  const selected = value?.trim() || "folder";
  const keyword = query.trim().toLowerCase();

  const visibleIcons: readonly CatalogEntry[] = useMemo(() => {
    if (!catalog) return [];
    if (keyword) {
      const terms = keyword.split(/\s+/).filter(Boolean);
      const matched: CatalogEntry[] = [];
      for (const item of catalog.allIcons) {
        if (terms.every((term) => item.searchText.includes(term))) {
          matched.push(item);
          if (matched.length >= SEARCH_RESULT_LIMIT) break;
        }
      }
      return matched;
    }
    const activeCat = catalog.categories.find((cat) => cat.id === categoryId) ?? catalog.categories[0];
    return activeCat?.icons ?? [];
  }, [catalog, categoryId, keyword]);

  return <div className="kubai-icons-root">
    <label className="kubai-icons-root__search">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        type="search"
        className="kubai-icons-root__input"
        value={query}
        disabled={disabled}
        placeholder="搜索图标名称或关键词（如 terminal、book、phone）"
        onChange={(event) => setQuery(event.target.value)}
      />
      {query ? <button
        type="button"
        className="kubai-icons-root__clear"
        aria-label="清空搜索"
        onClick={() => setQuery("")}
      >
        ×
      </button> : null}
    </label>

    {!keyword && catalog ? <div className="kubai-icons-root__cats" role="tablist" aria-label="图标分类">
      {catalog.categories.map((cat) => <button
        key={cat.id}
        type="button"
        role="tab"
        aria-selected={categoryId === cat.id}
        className="kubai-icons-root__cat"
        onClick={() => setCategoryId(cat.id)}
      >
        <span>{cat.label}</span>
        <span className="kubai-icons-root__cat-count">{cat.icons.length}</span>
      </button>)}
    </div> : null}

    <div className="kubai-icons-root__grid" role="radiogroup" aria-label="选择线性图标">
      {failed ? <p className="kubai-icons-root__empty">图标目录加载失败，请稍后重试</p>
        : !catalog ? <p className="kubai-icons-root__empty">正在加载图标目录…</p>
        : visibleIcons.length === 0 ? <p className="kubai-icons-root__empty">没有匹配的图标</p>
        : visibleIcons.map((item) => {
          const active = selected === item.name;
          return <button
            key={item.name}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={item.name}
            title={item.name}
            disabled={disabled}
            data-kubai-trigger=""
            className="kubai-icons-root__cell"
            onClick={() => onChange(item.name === "folder" ? null : item.name)}
          >
            <KubaiLineIcon name={item.name} size={20} trigger="parent" />
          </button>;
        })}
    </div>
  </div>;
}

const provider: IconProvider = {
  id: "kubai-line",
  label: "Kubai 线性图标",
  Icon: KubaiLineIcon,
  Picker: KubaiLinePicker,
};

/** 纯 ChatKernel 微内核激活：直接向 DI 服务表注册 icon.provider 服务。 */
export function activate(ctx: ChatPluginRuntimeContext): () => void {
  return ctx.services.provide("icon.provider", provider);
}
