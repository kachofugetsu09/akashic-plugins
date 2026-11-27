export interface PrivacyMaskState {
  enabled: boolean;
  redactTitles: boolean;
  blurContent: boolean;
}

export interface PrivacyMaskEngine {
  getSnapshot(): PrivacyMaskState;
  subscribe(listener: () => void): () => void;
  toggle(force?: boolean): void;
  setScope(patch: Partial<Omit<PrivacyMaskState, "enabled">>): void;
  release(): void;
}

const STORAGE_KEY = "akashic.privacy.mask.v1";

const DEFAULT_STATE: PrivacyMaskState = {
  enabled: false,
  redactTitles: true,
  blurContent: true,
};

// 只认宿主与插件打的 data-akashic-private 标记（@akashic/chat-ui-v1 的 ChatDomAttribute）。
const TITLE_REDACT_TARGETS = '[data-akashic-private="title"]';

// 带标记子树里的悬停提示（title / data-tip）同样是隐私。
const CONTENT_BLUR_TARGETS = [
  "[data-akashic-private][title]",
  "[data-akashic-private][data-tip]",
  "[data-akashic-private] [title]",
  "[data-akashic-private] [data-tip]",
].join(", ");

// 骨架条宽度按文档顺序错落，看起来像长短不一的真实名称。
const BAR_WIDTHS = ["62%", "48%", "74%", "56%"];

function loadState(): PrivacyMaskState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw) as Partial<PrivacyMaskState>;
    return {
      enabled: typeof parsed.enabled === "boolean" ? parsed.enabled : DEFAULT_STATE.enabled,
      redactTitles: typeof parsed.redactTitles === "boolean" ? parsed.redactTitles : DEFAULT_STATE.redactTitles,
      blurContent: typeof parsed.blurContent === "boolean" ? parsed.blurContent : DEFAULT_STATE.blurContent,
    };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

function saveState(state: PrivacyMaskState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // 隐私窗口或存储受限时退回内存状态。
  }
}

interface SavedTooltip {
  title?: string;
  tip?: string;
}

interface InternalEngine extends PrivacyMaskEngine {
  refs: number;
}

declare global {
  interface Window {
    __akashicPrivacyMask?: InternalEngine;
  }
}

export function acquirePrivacyMaskEngine(): PrivacyMaskEngine {
  if (window.__akashicPrivacyMask) {
    window.__akashicPrivacyMask.refs += 1;
    return window.__akashicPrivacyMask;
  }

  let state: PrivacyMaskState = loadState();
  const listeners = new Set<() => void>();
  // 记录所有被剥离了 title / data-tip 的节点（即使节点随后移出 document 仍可精确无损恢复）。
  const trackedTooltips = new Map<HTMLElement, SavedTooltip>();
  const barred = new Set<HTMLElement>();
  let scanFrame = 0;
  let applyingAttributes = false;

  const notify = () => {
    for (const listener of listeners) listener();
  };

  const restoreTrackedElement = (el: HTMLElement, saved: SavedTooltip) => {
    if (saved.title !== undefined && !el.hasAttribute("title")) {
      el.setAttribute("title", saved.title);
    }
    if (saved.tip !== undefined && !el.hasAttribute("data-tip")) {
      el.setAttribute("data-tip", saved.tip);
    }
    el.removeAttribute("data-privacy-raw-title");
    el.removeAttribute("data-privacy-raw-tip");
  };

  const restoreAllTooltips = () => {
    for (const [el, saved] of trackedTooltips.entries()) {
      restoreTrackedElement(el, saved);
    }
    trackedTooltips.clear();
  };

  // 名称打码开着时给每个名称写骨架条宽度；关掉或节点离开范围时撤回。
  const syncBars = () => {
    const next = new Set<HTMLElement>();
    if (state.enabled && state.redactTitles) {
      let index = 0;
      for (const el of document.querySelectorAll<HTMLElement>(TITLE_REDACT_TARGETS)) {
        if (el.closest("[data-privacy-ui]")) continue;
        el.style.setProperty("--privacy-bar-width", BAR_WIDTHS[index % BAR_WIDTHS.length]);
        index += 1;
        next.add(el);
      }
    }
    for (const el of barred) if (!next.has(el)) el.style.removeProperty("--privacy-bar-width");
    barred.clear();
    for (const el of next) barred.add(el);
  };

  const syncTooltips = () => {
    scanFrame = 0;
    applyingAttributes = true;
    try {
      syncBars();
      if (!state.enabled) {
        restoreAllTooltips();
        return;
      }

      const activeElements = new Set<HTMLElement>();
      const collectTargets = (selector: string) => {
        for (const el of document.querySelectorAll<HTMLElement>(selector)) {
          if (el.closest("[data-privacy-ui]")) continue;
          activeElements.add(el);
        }
      };

      if (state.redactTitles) collectTargets(TITLE_REDACT_TARGETS);
      if (state.blurContent) collectTargets(CONTENT_BLUR_TARGETS);

      // 1. 已移出遮罩范围或已移出 document 的节点立即恢复原值。
      for (const [el, saved] of trackedTooltips.entries()) {
        if (!activeElements.has(el)) {
          restoreTrackedElement(el, saved);
          trackedTooltips.delete(el);
        }
      }

      // 2. 对当前遮罩范围内的节点：若带有宿主新写入或初始的 title / data-tip，更新记录并剥离。
      for (const el of activeElements) {
        const existing = trackedTooltips.get(el);
        const currentTitle = el.getAttribute("title");
        const currentTip = el.getAttribute("data-tip");
        if (currentTitle === null && currentTip === null && existing) continue;

        const nextSaved: SavedTooltip = existing ? { ...existing } : {};
        if (currentTitle !== null) {
          nextSaved.title = currentTitle;
          el.setAttribute("data-privacy-raw-title", currentTitle);
          el.removeAttribute("title");
        }
        if (currentTip !== null) {
          nextSaved.tip = currentTip;
          el.setAttribute("data-privacy-raw-tip", currentTip);
          el.removeAttribute("data-tip");
        }
        if (nextSaved.title !== undefined || nextSaved.tip !== undefined) {
          trackedTooltips.set(el, nextSaved);
        }
      }
    } finally {
      applyingAttributes = false;
    }
  };

  const scheduleTooltipSync = () => {
    if (scanFrame) return;
    scanFrame = window.requestAnimationFrame(syncTooltips);
  };

  const syncDomDataset = () => {
    const root = document.documentElement;
    applyingAttributes = true;
    try {
      if (state.enabled) {
        root.setAttribute("data-privacy-mask", "true");
        if (state.redactTitles) root.setAttribute("data-privacy-titles", "true");
        else root.removeAttribute("data-privacy-titles");
        if (state.blurContent) root.setAttribute("data-privacy-content", "true");
        else root.removeAttribute("data-privacy-content");
      } else {
        root.removeAttribute("data-privacy-mask");
        root.removeAttribute("data-privacy-titles");
        root.removeAttribute("data-privacy-content");
      }
    } finally {
      applyingAttributes = false;
    }
    syncTooltips();
  };

  const observer = new MutationObserver(() => {
    if (applyingAttributes || !state.enabled) return;
    scheduleTooltipSync();
  });

  if (document.body) {
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["title", "data-tip"],
    });
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== STORAGE_KEY) return;
    state = loadState();
    syncDomDataset();
    notify();
  };

  window.addEventListener("storage", onStorage);

  const engine: InternalEngine = {
    refs: 1,
    getSnapshot() {
      return state;
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    toggle(force?: boolean) {
      const nextEnabled = typeof force === "boolean" ? force : !state.enabled;
      const bothOff = !state.redactTitles && !state.blurContent;
      state = {
        enabled: nextEnabled,
        redactTitles: nextEnabled && bothOff ? true : state.redactTitles,
        blurContent: nextEnabled && bothOff ? true : state.blurContent,
      };
      saveState(state);
      syncDomDataset();
      notify();
    },
    setScope(patch: Partial<Omit<PrivacyMaskState, "enabled">>) {
      const next = { ...state, ...patch };
      const anyOn = next.redactTitles || next.blurContent;
      const enablingSubScope = (patch.redactTitles === true || patch.blurContent === true) && !state.enabled;
      state = {
        ...next,
        enabled: enablingSubScope ? true : anyOn ? state.enabled : false,
      };
      saveState(state);
      syncDomDataset();
      notify();
    },
    release() {
      engine.refs -= 1;
      if (engine.refs > 0) return;
      if (scanFrame) window.cancelAnimationFrame(scanFrame);
      observer.disconnect();
      window.removeEventListener("storage", onStorage);
      restoreAllTooltips();
      for (const el of barred) el.style.removeProperty("--privacy-bar-width");
      barred.clear();
      const root = document.documentElement;
      root.removeAttribute("data-privacy-mask");
      root.removeAttribute("data-privacy-titles");
      root.removeAttribute("data-privacy-content");
      delete window.__akashicPrivacyMask;
    },
  };

  window.__akashicPrivacyMask = engine;
  syncDomDataset();
  return engine;
}
