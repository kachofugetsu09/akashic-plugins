import {
  READER_CHANNEL,
  type DocumentAnchor,
  type DocumentFormat,
  type ReaderFromFrame,
  type ReaderToFrame,
} from "./contract";
import { OoxmlAdapter, type OoxmlSelectionPayload } from "./ooxml-adapter";
import { PdfAdapter, type PdfOutlineItem } from "./pdf-adapter";
import "./viewer.css";

type PendingQuote = {
  source: string;
  text: string;
  rawCopy: string;
};

const ICON = {
  toc: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
  search: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  snip: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/></svg>',
  moon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
  quote: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>',
  prev: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>',
  next: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
  close: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
};

function basename(path: string): string {
  const parts = path.split("/").filter(Boolean);
  return parts[parts.length - 1] || path;
}

function sendToParent(message: ReaderFromFrame): void {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage(message, window.location.origin);
  }
}

class DocumentReaderApp {
  private readonly shell = document.createElement("div");
  private readonly stage = document.createElement("div");
  private readonly pdfStack = document.createElement("div");
  private readonly ooxmlHost = document.createElement("div");
  private readonly statusBox = document.createElement("div");
  private readonly noteBanner = document.createElement("div");
  private readonly drawer = document.createElement("aside");
  private readonly searchBar = document.createElement("div");
  private readonly searchInput = document.createElement("input");
  private readonly searchCount = document.createElement("span");
  private readonly pill = document.createElement("div");
  private readonly pillPage = document.createElement("span");
  private readonly pillZoom = document.createElement("span");
  private readonly tocBtn = document.createElement("button");
  private readonly searchBtn = document.createElement("button");
  private readonly snipBtn = document.createElement("button");
  private readonly darkBtn = document.createElement("button");
  private readonly rangeQuoteBtn = document.createElement("button");
  private readonly popover = document.createElement("div");
  private readonly snipBox = document.createElement("div");
  private readonly toast = document.createElement("div");

  private pdf: PdfAdapter | null = null;
  private ooxml: OoxmlAdapter | null = null;
  private currentPath = "";
  private currentFormat: DocumentFormat = "pdf";
  private zoomFactor = 1;
  private snipMode = false;
  private darkBlend = false;
  private snipStart: { x: number; y: number } | null = null;
  private pendingQuote: PendingQuote | null = null;
  private ooxmlSelection: OoxmlSelectionPayload | null = null;
  private openGeneration = 0;
  private docReady = false;
  private pendingAnchor: DocumentAnchor | null = null;
  private toastTimer = 0;

  constructor(root: HTMLElement) {
    this.shell.className = "dr-shell";
    this.stage.className = "dr-stage";
    this.pdfStack.className = "dr-pdf-stack";
    this.ooxmlHost.className = "dr-ooxml-host";
    this.statusBox.className = "dr-status";
    this.statusBox.textContent = "等待加载文档…";

    this.noteBanner.className = "dr-note-banner";
    this.noteBanner.hidden = true;

    this.drawer.className = "dr-drawer";
    this.buildSearchBar();
    this.buildPopover();
    this.buildPill();

    this.snipBox.className = "dr-snip-box";
    this.toast.className = "dr-toast";

    this.stage.append(this.statusBox);
    this.shell.append(
      this.noteBanner,
      this.drawer,
      this.searchBar,
      this.stage,
      this.pill,
      this.popover,
      this.snipBox,
      this.toast
    );
    root.replaceChildren(this.shell);
    this.bindEvents();
    sendToParent({ channel: READER_CHANNEL, type: "ready" });
  }

  private buildSearchBar(): void {
    this.searchBar.className = "dr-search-bar";
    this.searchInput.className = "dr-search-input";
    this.searchInput.type = "search";
    this.searchInput.placeholder = "在文档中查找…";
    this.searchCount.className = "dr-search-count";

    const prevBtn = document.createElement("button");
    prevBtn.className = "dr-btn is-icon";
    prevBtn.title = "上一个";
    prevBtn.innerHTML = ICON.prev;
    prevBtn.addEventListener("click", () => void this.stepSearch(-1));

    const nextBtn = document.createElement("button");
    nextBtn.className = "dr-btn is-icon";
    nextBtn.title = "下一个";
    nextBtn.innerHTML = ICON.next;
    nextBtn.addEventListener("click", () => void this.stepSearch(1));

    const closeBtn = document.createElement("button");
    closeBtn.className = "dr-btn is-icon";
    closeBtn.title = "关闭搜索";
    closeBtn.innerHTML = ICON.close;
    closeBtn.addEventListener("click", () => this.closeSearch());

    this.searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (e.shiftKey) void this.stepSearch(-1);
        else void this.runSearch(this.searchInput.value);
      } else if (e.key === "Escape") {
        this.closeSearch();
      }
    });

    this.searchBar.append(this.searchInput, this.searchCount, prevBtn, nextBtn, closeBtn);
  }

  private buildPopover(): void {
    this.popover.className = "dr-popover";
    // 防止点击浮条按钮时浏览器清掉选区或触发外层 mouseup 关闭浮条
    this.popover.addEventListener("mousedown", (e) => e.preventDefault());
    this.popover.addEventListener("mouseup", (e) => e.stopPropagation());
    const quoteBtn = document.createElement("button");
    quoteBtn.className = "dr-pop-btn is-primary";
    quoteBtn.innerHTML = `${ICON.quote}<span>引用</span><span class="dr-pop-kbd">Q</span>`;
    quoteBtn.addEventListener("click", () => this.commitQuote("quote"));

    const sep = document.createElement("span");
    sep.className = "dr-pop-sep";

    const explainBtn = document.createElement("button");
    explainBtn.className = "dr-pop-btn";
    explainBtn.innerHTML = `<span>解释</span><span class="dr-pop-kbd">E</span>`;
    explainBtn.addEventListener("click", () => this.commitQuote("explain"));

    const copyBtn = document.createElement("button");
    copyBtn.className = "dr-pop-btn";
    copyBtn.textContent = "复制";
    copyBtn.addEventListener("click", () => {
      if (!this.pendingQuote) return;
      void navigator.clipboard?.writeText(this.pendingQuote.rawCopy).then(() => {
        this.showToast("已复制到剪贴板");
      });
      this.hidePopover();
    });

    this.popover.append(quoteBtn, sep, explainBtn, copyBtn);
  }

  private buildPill(): void {
    this.pill.className = "dr-pill";

    this.tocBtn.className = "dr-btn is-icon";
    this.tocBtn.title = "目录大纲";
    this.tocBtn.innerHTML = ICON.toc;
    this.tocBtn.hidden = true;
    this.tocBtn.addEventListener("click", () => {
      this.drawer.classList.toggle("is-open");
      this.tocBtn.classList.toggle("is-active", this.drawer.classList.contains("is-open"));
    });

    this.pillPage.className = "dr-pill-label";
    this.pillPage.textContent = "1 / 1";

    const sep1 = document.createElement("span");
    sep1.className = "dr-pill-sep";

    const zoomOut = document.createElement("button");
    zoomOut.className = "dr-btn is-icon";
    zoomOut.title = "缩小";
    zoomOut.textContent = "−";
    zoomOut.addEventListener("click", () => void this.adjustZoom(-0.15));

    this.pillZoom.className = "dr-pill-label";
    this.pillZoom.textContent = "100%";

    const zoomIn = document.createElement("button");
    zoomIn.className = "dr-btn is-icon";
    zoomIn.title = "放大";
    zoomIn.textContent = "+";
    zoomIn.addEventListener("click", () => void this.adjustZoom(0.15));

    const sep2 = document.createElement("span");
    sep2.className = "dr-pill-sep";

    this.searchBtn.className = "dr-btn is-icon";
    this.searchBtn.title = "查找 (Ctrl/Cmd+F)";
    this.searchBtn.innerHTML = ICON.search;
    this.searchBtn.addEventListener("click", () => this.openSearch());

    this.snipBtn.className = "dr-btn";
    this.snipBtn.title = "框选区域引用（适合论文图表与公式）";
    this.snipBtn.innerHTML = `${ICON.snip}<span>框选</span>`;
    this.snipBtn.addEventListener("click", () => this.setSnipMode(!this.snipMode));

    this.rangeQuoteBtn.className = "dr-btn is-active";
    this.rangeQuoteBtn.hidden = true;
    this.rangeQuoteBtn.addEventListener("click", () => this.commitOoxmlSelection());

    this.darkBtn.className = "dr-btn is-icon";
    this.darkBtn.title = "纸面暗色护眼融合";
    this.darkBtn.innerHTML = ICON.moon;
    this.darkBtn.addEventListener("click", () => {
      this.darkBlend = !this.darkBlend;
      this.shell.dataset.darkBlend = this.darkBlend ? "true" : "false";
      this.darkBtn.classList.toggle("is-active", this.darkBlend);
    });

    this.pill.append(
      this.tocBtn,
      this.pillPage,
      sep1,
      zoomOut,
      this.pillZoom,
      zoomIn,
      sep2,
      this.searchBtn,
      this.snipBtn,
      this.rangeQuoteBtn,
      this.darkBtn
    );
  }

  private bindEvents(): void {
    window.addEventListener("message", (event) => {
      if (event.origin !== window.location.origin) return;
      if (window.parent && window.parent !== window && event.source !== window.parent) return;
      const msg = event.data as ReaderToFrame | null;
      if (!msg || typeof msg !== "object" || msg.channel !== READER_CHANNEL) return;
      if (msg.type === "theme") {
        if (msg.theme === "light" || msg.theme === "dark") {
          document.documentElement.dataset.theme = msg.theme;
        }
      } else if (msg.type === "open") {
        if (
          typeof msg.path !== "string" ||
          !(msg.data instanceof ArrayBuffer) ||
          (msg.format !== "pdf" && msg.format !== "docx" && msg.format !== "xlsx" && msg.format !== "pptx")
        ) {
          return;
        }
        document.documentElement.dataset.theme = msg.theme === "dark" ? "dark" : "light";
        void this.openDocument(msg.path, msg.format, msg.data, msg.anchor);
      } else if (msg.type === "jump" && msg.anchor && typeof msg.anchor === "object") {
        if (!this.docReady) {
          this.pendingAnchor = msg.anchor;
          return;
        }
        void this.applyAnchor(msg.anchor);
      }
    });

    // 划词监听（PDF / 通用 DOM 选区）
    this.stage.addEventListener("mouseup", () => {
      if (this.snipMode) return;
      if (this.currentFormat === "xlsx") return;
      const sel = window.getSelection();
      const text = sel?.toString().trim() ?? "";
      if (text.length < 2 || !sel || sel.rangeCount === 0) {
        if (!this.ooxmlSelection) this.hidePopover();
        return;
      }
      const rect = sel.getRangeAt(0).getBoundingClientRect();
      if (rect.width <= 0 && rect.height <= 0) return;
      const page = this.pdf ? this.pdf.getPageForNode(sel.anchorNode) : undefined;
      const label = page ? `${basename(this.currentPath)} · p.${page}` : basename(this.currentPath);
      this.showPopoverAt(rect.left + rect.width / 2, rect.top - 42, {
        source: `文档 · ${this.currentPath}${page ? `#p.${page}` : ""}`,
        text: `> [${label}]\n>\n> ${text.slice(0, 6000).replace(/\n/g, "\n> ")}`,
        rawCopy: text,
      });
    });

    // 区域框选监听（PDF Area Snip）
    this.stage.addEventListener("mousedown", (e) => {
      if (!this.snipMode || e.button !== 0) return;
      e.preventDefault();
      this.hidePopover();
      this.snipStart = { x: e.clientX, y: e.clientY };
      this.snipBox.style.left = `${e.clientX}px`;
      this.snipBox.style.top = `${e.clientY}px`;
      this.snipBox.style.width = "0px";
      this.snipBox.style.height = "0px";
      this.snipBox.classList.add("is-visible");
    });

    window.addEventListener("mousemove", (e) => {
      if (!this.snipStart) return;
      const left = Math.min(this.snipStart.x, e.clientX);
      const top = Math.min(this.snipStart.y, e.clientY);
      const width = Math.abs(e.clientX - this.snipStart.x);
      const height = Math.abs(e.clientY - this.snipStart.y);
      this.snipBox.style.left = `${left}px`;
      this.snipBox.style.top = `${top}px`;
      this.snipBox.style.width = `${width}px`;
      this.snipBox.style.height = `${height}px`;
    });

    window.addEventListener("mouseup", () => {
      if (!this.snipStart) return;
      const rect = this.snipBox.getBoundingClientRect();
      this.snipStart = null;
      if (rect.width < 16 || rect.height < 16) {
        this.snipBox.classList.remove("is-visible");
        return;
      }
      const captured = this.pdf?.extractRegionContext(rect);
      if (!captured) {
        this.snipBox.classList.remove("is-visible");
        this.showToast("请在文档页面区域内拉框");
        return;
      }
      const bboxStr = captured.bbox.join(", ");
      const header = `[${basename(this.currentPath)} · p.${captured.page} · 区域 (${bboxStr})]`;
      const body = captured.text
        ? `> ${header}\n>\n> ${captured.text.slice(0, 4000)}`
        : `> ${header}\n> （选区包含图表或公式，无内嵌纯文本，请结合第 ${captured.page} 页原图查看）`;
      this.showPopoverAt(rect.left + rect.width / 2, rect.top - 42, {
        source: `文档区域 · ${this.currentPath}#p.${captured.page}`,
        text: body,
        rawCopy: captured.text || header,
      });
    });

    // 快捷键
    window.addEventListener("keydown", (e) => {
      const target = e.target as HTMLElement | null;
      const inInput = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA");
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "f" && this.currentFormat === "pdf") {
        e.preventDefault();
        this.openSearch();
        return;
      }
      if (e.key === "Escape") {
        this.setSnipMode(false);
        this.hidePopover();
        this.closeSearch();
        this.drawer.classList.remove("is-open");
        this.tocBtn.classList.remove("is-active");
        return;
      }
      if (inInput || !this.popover.classList.contains("is-open")) return;
      if (e.key.toLowerCase() === "q") {
        e.preventDefault();
        this.commitQuote("quote");
      } else if (e.key.toLowerCase() === "e") {
        e.preventDefault();
        this.commitQuote("explain");
      }
    });
  }

  private async openDocument(
    path: string,
    format: DocumentFormat,
    data: ArrayBuffer,
    anchor?: DocumentAnchor
  ): Promise<void> {
    const gen = ++this.openGeneration;
    this.docReady = false;
    this.pendingAnchor = anchor ?? null;
    this.teardown();
    this.currentPath = path;
    this.currentFormat = format;
    this.zoomFactor = 1;
    this.pillZoom.textContent = "100%";
    this.tocBtn.hidden = true;
    this.rangeQuoteBtn.hidden = true;
    this.searchBtn.hidden = format !== "pdf";
    this.snipBtn.hidden = format !== "pdf";
    this.stage.classList.toggle("is-ooxml-full", format !== "pdf");

    this.statusBox.textContent = `正在加载 ${basename(path)}…`;
    this.stage.replaceChildren(this.statusBox);

    try {
      if (format === "pdf") {
        this.stage.replaceChildren(this.pdfStack);
        const adapter = new PdfAdapter(this.pdfStack, this.stage, {
          onPageChange: (page, total) => {
            if (gen !== this.openGeneration) return;
            this.pillPage.textContent = `p.${page} / ${total}`;
            sendToParent({ channel: READER_CHANNEL, type: "state", page, totalPages: total });
          },
          onOutline: (items) => {
            if (gen !== this.openGeneration) return;
            this.renderOutline(items);
          },
        });
        this.pdf = adapter;
        await adapter.load(data, anchor?.page);
      } else {
        this.stage.replaceChildren(this.ooxmlHost);
        const adapter = new OoxmlAdapter(format, this.ooxmlHost, {
          onPageChange: (page, total) => {
            if (gen !== this.openGeneration) return;
            const prefix = format === "pptx" ? "Slide " : "p.";
            this.pillPage.textContent = `${prefix}${page} / ${total}`;
            sendToParent({ channel: READER_CHANNEL, type: "state", page, totalPages: total });
          },
          onSheetChange: (sheetName, totalSheets) => {
            if (gen !== this.openGeneration) return;
            this.pillPage.textContent = `${sheetName} (${totalSheets})`;
            sendToParent({ channel: READER_CHANNEL, type: "state", sheet: sheetName });
          },
          onSelection: (payload) => {
            if (gen !== this.openGeneration) return;
            this.handleOoxmlSelection(payload);
          },
        });
        this.ooxml = adapter;
        await adapter.load(data, anchor);
      }
      if (gen !== this.openGeneration) return;
      this.docReady = true;
      const effectiveAnchor = this.pendingAnchor;
      this.pendingAnchor = null;
      if (effectiveAnchor) await this.applyAnchor(effectiveAnchor);
    } catch (error) {
      if (gen !== this.openGeneration) return;
      const message = error instanceof Error ? error.message : String(error);
      this.statusBox.textContent = `文档解析失败：${message}`;
      this.stage.replaceChildren(this.statusBox);
      sendToParent({ channel: READER_CHANNEL, type: "error", message });
    }
  }

  private async applyAnchor(anchor: DocumentAnchor): Promise<void> {
    if (anchor.note) {
      this.noteBanner.innerHTML = `<span class="dr-note-dot"></span><span class="dr-note-text"></span>`;
      const textEl = this.noteBanner.querySelector(".dr-note-text");
      if (textEl) textEl.textContent = anchor.note;
      this.noteBanner.hidden = false;
      window.setTimeout(() => {
        this.noteBanner.hidden = true;
      }, 6000);
    }
    if (this.pdf) {
      if (anchor.page) await this.pdf.goToPage(anchor.page, true);
      if (anchor.search) {
        this.openSearch(anchor.search);
        await this.runSearch(anchor.search, anchor.page);
      }
    } else if (this.ooxml) {
      if (anchor.page) await this.ooxml.goToPage(anchor.page);
      if (anchor.sheet) await this.ooxml.goToSheet(anchor.sheet);
    }
  }

  private handleOoxmlSelection(payload: OoxmlSelectionPayload | null): void {
    this.ooxmlSelection = payload;
    if (!payload) {
      this.rangeQuoteBtn.hidden = true;
      return;
    }
    const tag = payload.label || basename(this.currentPath);
    this.rangeQuoteBtn.textContent = `引用 ${tag}`;
    this.rangeQuoteBtn.hidden = false;
  }

  private commitOoxmlSelection(): void {
    if (!this.ooxmlSelection) return;
    const tag = this.ooxmlSelection.label ? `${this.currentPath} · ${this.ooxmlSelection.label}` : this.currentPath;
    const text =
      this.currentFormat === "xlsx"
        ? `【表格选区 ${basename(this.currentPath)} · ${this.ooxmlSelection.label}】\n\n${this.ooxmlSelection.text}`
        : `> [${basename(this.currentPath)}${this.ooxmlSelection.label ? ` · ${this.ooxmlSelection.label}` : ""}]\n>\n> ${this.ooxmlSelection.text.slice(0, 6000).replace(/\n/g, "\n> ")}`;
    sendToParent({
      channel: READER_CHANNEL,
      type: "quote",
      source: `文档 · ${tag}`.slice(0, 200),
      text: text.slice(0, 7800),
    });
    this.showToast(`已引用 ${this.ooxmlSelection.label || "选区"} 到对话`);
  }

  private renderOutline(items: PdfOutlineItem[]): void {
    this.drawer.replaceChildren();
    if (items.length === 0) {
      this.tocBtn.hidden = true;
      return;
    }
    this.tocBtn.hidden = false;
    const title = document.createElement("div");
    title.className = "dr-drawer-title";
    title.textContent = "文档目录";
    this.drawer.append(title);
    for (const item of items) {
      const btn = document.createElement("button");
      btn.className = "dr-toc-item";
      btn.style.paddingLeft = `${8 + item.level * 12}px`;
      const label = document.createElement("span");
      label.className = "dr-toc-label";
      label.textContent = item.title;
      const page = document.createElement("span");
      page.className = "dr-toc-page";
      page.textContent = `p.${item.page}`;
      btn.append(label, page);
      btn.addEventListener("click", () => {
        this.drawer.classList.remove("is-open");
        this.tocBtn.classList.remove("is-active");
        void this.pdf?.goToPage(item.page, true);
      });
      this.drawer.append(btn);
    }
  }

  private openSearch(initial?: string): void {
    this.searchBar.classList.add("is-open");
    this.searchBtn.classList.add("is-active");
    if (typeof initial === "string") this.searchInput.value = initial;
    this.searchInput.focus();
    this.searchInput.select();
  }

  private closeSearch(): void {
    this.searchBar.classList.remove("is-open");
    this.searchBtn.classList.remove("is-active");
    this.searchCount.textContent = "";
    this.pdf?.clearSearch();
  }

  private async runSearch(query: string, preferPage?: number): Promise<void> {
    if (!this.pdf) return;
    const res = await this.pdf.search(query, preferPage);
    if (!res) return;
    this.searchCount.textContent = res.total > 0 ? `${res.current}/${res.total}` : query.trim() ? "0" : "";
  }

  private async stepSearch(delta: 1 | -1): Promise<void> {
    if (!this.pdf) return;
    const res = await this.pdf.stepSearch(delta);
    if (!res) return;
    this.searchCount.textContent = res.total > 0 ? `${res.current}/${res.total}` : "";
  }

  private async adjustZoom(delta: number): Promise<void> {
    this.zoomFactor = Math.max(0.6, Math.min(2.2, Number((this.zoomFactor + delta).toFixed(2))));
    if (this.pdf) {
      const pct = await this.pdf.setZoomFactor(this.zoomFactor);
      this.pillZoom.textContent = `${pct}%`;
    } else if (this.ooxml) {
      const pct = this.ooxml.setZoomFactor(this.zoomFactor);
      this.pillZoom.textContent = `${pct}%`;
    }
  }

  private setSnipMode(enabled: boolean): void {
    this.snipMode = enabled;
    this.snipBtn.classList.toggle("is-active", enabled);
    this.stage.classList.toggle("is-snip-mode", enabled);
    if (!enabled) {
      this.snipBox.classList.remove("is-visible");
      this.snipStart = null;
    } else {
      this.showToast("按住鼠标在页面上拉框，松手即可引用该区域");
    }
  }

  private showPopoverAt(x: number, y: number, payload: PendingQuote): void {
    this.pendingQuote = payload;
    const clampedX = Math.max(105, Math.min(window.innerWidth - 105, x));
    const clampedY = Math.max(14, Math.min(window.innerHeight - 92, y));
    this.popover.style.left = `${clampedX}px`;
    this.popover.style.top = `${clampedY}px`;
    this.popover.classList.add("is-open");
  }

  private hidePopover(): void {
    this.popover.classList.remove("is-open");
    this.snipBox.classList.remove("is-visible");
    this.pendingQuote = null;
  }

  private commitQuote(mode: "quote" | "explain"): void {
    if (!this.pendingQuote) return;
    const text =
      mode === "explain"
        ? `${this.pendingQuote.text}\n\n请帮我解释上面这段内容。`
        : this.pendingQuote.text;
    sendToParent({
      channel: READER_CHANNEL,
      type: "quote",
      source: this.pendingQuote.source.slice(0, 200),
      text: text.slice(0, 7800),
    });
    this.hidePopover();
    this.setSnipMode(false);
    window.getSelection()?.removeAllRanges();
    this.showToast(mode === "explain" ? "已插入引用与提问" : "已引用到对话输入框");
  }

  private showToast(msg: string): void {
    this.toast.textContent = msg;
    this.toast.classList.add("is-show");
    window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => this.toast.classList.remove("is-show"), 1800);
  }

  private teardown(): void {
    this.hidePopover();
    this.setSnipMode(false);
    this.closeSearch();
    this.drawer.classList.remove("is-open");
    this.noteBanner.hidden = true;
    this.ooxmlSelection = null;
    this.pdf?.destroy();
    this.pdf = null;
    this.ooxml?.destroy();
    this.ooxml = null;
  }
}

const root = document.getElementById("reader-root");
if (root) {
  new DocumentReaderApp(root);
}
