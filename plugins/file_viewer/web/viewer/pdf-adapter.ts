import * as pdfjsLib from "pdfjs-dist";
import type { PDFDocumentProxy, PDFPageProxy, RenderTask } from "pdfjs-dist/types/src/display/api";

declare const __AKASHIC_PDF_WORKER_URL__: string;
declare const __AKASHIC_PDF_CMAP_URL__: string;
declare const __AKASHIC_PDF_FONT_URL__: string;

const WORKER_URL =
  typeof __AKASHIC_PDF_WORKER_URL__ === "string"
    ? __AKASHIC_PDF_WORKER_URL__
    : "/file_viewer/assets/pdf.worker.mjs";
const CMAP_URL =
  typeof __AKASHIC_PDF_CMAP_URL__ === "string"
    ? __AKASHIC_PDF_CMAP_URL__
    : "/file_viewer/assets/cmaps/";
const FONT_URL =
  typeof __AKASHIC_PDF_FONT_URL__ === "string"
    ? __AKASHIC_PDF_FONT_URL__
    : "/file_viewer/assets/standard_fonts/";

pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_URL;

const MAX_CONCURRENT_RENDERS = 2;

export type PdfOutlineItem = {
  title: string;
  page: number;
  level: number;
};

export type PdfRegionCapture = {
  page: number;
  bbox: [number, number, number, number];
  text: string;
  imageDataUrl?: string;
};

type PageSlot = {
  pageNumber: number;
  el: HTMLDivElement;
  canvas: HTMLCanvasElement;
  textLayerEl: HTMLDivElement;
  rendered: boolean;
  rendering: boolean;
  renderGen: number;
  renderTask: RenderTask | null;
  renderedScale: number;
};

export class PdfAdapter {
  private loadingTask: pdfjsLib.PDFDocumentLoadingTask | null = null;
  private doc: PDFDocumentProxy | null = null;
  private slots: PageSlot[] = [];
  private observer: IntersectionObserver | null = null;
  private scale = 1;
  private baseWidth = 612;
  private baseHeight = 792;
  private currentPage = 1;
  private searchQuery = "";
  private searchHits: number[] = [];
  private searchCursor = -1;
  private searchGen = 0;
  private activeRenders = 0;
  private renderQueue: number[] = [];
  private zoomLockUntil = 0;
  private disposed = false;
  private pageFrame = 0;
  private readonly onStageScroll = (): void => {
    if (this.pageFrame) return;
    this.pageFrame = requestAnimationFrame(() => {
      this.pageFrame = 0;
      this.syncCurrentPage();
    });
  };

  constructor(
    private readonly stackEl: HTMLElement,
    private readonly stageEl: HTMLElement,
    private readonly callbacks: {
      onPageChange: (page: number, total: number) => void;
      onOutline: (items: PdfOutlineItem[]) => void;
    }
  ) {}

  async load(data: ArrayBuffer, initialPage?: number): Promise<{ totalPages: number }> {
    const task = pdfjsLib.getDocument({
      data: new Uint8Array(data),
      cMapUrl: CMAP_URL,
      cMapPacked: true,
      standardFontDataUrl: FONT_URL,
    });
    this.loadingTask = task;
    const doc = await task.promise;
    if (this.disposed) {
      await task.destroy();
      return { totalPages: 0 };
    }
    const firstPage = await doc.getPage(1);
    if (this.disposed) {
      await task.destroy();
      return { totalPages: 0 };
    }
    this.doc = doc;
    const vp = firstPage.getViewport({ scale: 1 });
    this.baseWidth = vp.width;
    this.baseHeight = vp.height;
    this.scale = this.computeFitWidthScale();

    this.buildSlots(doc.numPages);
    this.setupObserver();
    this.callbacks.onPageChange(1, doc.numPages);
    void this.loadOutline(doc);

    if (initialPage && initialPage >= 1 && initialPage <= doc.numPages) {
      await this.goToPage(initialPage, true);
    } else {
      this.enqueueRender(1);
      if (doc.numPages >= 2) this.enqueueRender(2);
    }
    return { totalPages: doc.numPages };
  }

  get pageCount(): number {
    return this.doc?.numPages ?? 0;
  }

  async setZoomFactor(relativeFactor: number): Promise<number> {
    const clamped = Math.max(0.6, Math.min(2.4, relativeFactor));
    const keepPage = this.currentPage;
    const anchorSlot = this.slots[keepPage - 1];
    let offsetRatio = 0;
    if (anchorSlot && anchorSlot.el.offsetHeight > 0) {
      offsetRatio = Math.max(
        0,
        Math.min(1, (this.stageEl.scrollTop - anchorSlot.el.offsetTop) / anchorSlot.el.offsetHeight)
      );
    }

    // 缩放期间锁定 observer，避免页槽高度变化瞬间把 currentPage 误改到别的页
    this.zoomLockUntil = performance.now() + 420;
    this.scale = this.computeFitWidthScale() * clamped;
    this.renderQueue = [];
    for (const slot of this.slots) {
      this.cancelSlot(slot);
      slot.rendered = false;
      this.applySlotSize(slot);
    }

    if (anchorSlot) {
      this.stageEl.scrollTop = Math.round(anchorSlot.el.offsetTop + offsetRatio * anchorSlot.el.offsetHeight);
      this.currentPage = keepPage;
      this.callbacks.onPageChange(keepPage, this.pageCount);
      await this.renderSlotNow(anchorSlot);
    }
    this.renderVisibleWindow(keepPage);
    return Math.round(clamped * 100);
  }

  async goToPage(pageNumber: number, pulse = false): Promise<void> {
    const clamped = Math.max(1, Math.min(this.pageCount || 1, pageNumber));
    const slot = this.slots[clamped - 1];
    if (!slot || this.disposed) return;
    this.currentPage = clamped;
    this.callbacks.onPageChange(clamped, this.pageCount);
    slot.el.scrollIntoView({ behavior: "smooth", block: "start" });
    await this.renderSlotNow(slot);
    if (this.disposed) return;
    this.renderVisibleWindow(clamped);
    if (pulse) {
      slot.el.classList.remove("is-pulsing");
      void slot.el.offsetWidth;
      slot.el.classList.add("is-pulsing");
      window.setTimeout(() => slot.el.classList.remove("is-pulsing"), 1800);
    }
  }

  async search(query: string, preferPage?: number): Promise<{ total: number; current: number } | null> {
    const gen = ++this.searchGen;
    const cleaned = query.trim();
    this.searchQuery = cleaned;
    this.searchHits = [];
    this.searchCursor = -1;
    this.clearSearchHighlights();
    if (!cleaned || !this.doc) return { total: 0, current: 0 };

    const needle = cleaned.toLowerCase();
    const localHits: number[] = [];
    const totalPages = this.doc.numPages;
    for (let i = 1; i <= totalPages; i += 1) {
      if (this.disposed || gen !== this.searchGen) return null;
      const page = await this.doc.getPage(i);
      if (this.disposed || gen !== this.searchGen) return null;
      const content = await page.getTextContent();
      if (this.disposed || gen !== this.searchGen) return null;
      const joined = content.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" ")
        .toLowerCase();
      if (joined.includes(needle)) {
        localHits.push(i);
      }
    }
    if (this.disposed || gen !== this.searchGen) return null;
    this.searchHits = localHits;
    if (localHits.length === 0) return { total: 0, current: 0 };
    if (preferPage) {
      const idx = localHits.indexOf(preferPage);
      if (idx >= 0) this.searchCursor = idx - 1;
    }
    return this.stepSearch(1, gen);
  }

  async stepSearch(delta: 1 | -1, expectedGen?: number): Promise<{ total: number; current: number } | null> {
    const gen = expectedGen ?? this.searchGen;
    if (this.disposed || gen !== this.searchGen) return null;
    if (this.searchHits.length === 0) return { total: 0, current: 0 };
    this.searchCursor = (this.searchCursor + delta + this.searchHits.length) % this.searchHits.length;
    const pageNum = this.searchHits[this.searchCursor];
    await this.goToPage(pageNum, true);
    if (this.disposed || gen !== this.searchGen) return null;
    this.highlightSlotMatches(this.slots[pageNum - 1], true);
    return { total: this.searchHits.length, current: this.searchCursor + 1 };
  }

  clearSearch(): void {
    this.searchGen += 1;
    this.searchQuery = "";
    this.searchHits = [];
    this.searchCursor = -1;
    this.clearSearchHighlights();
  }

  getPageForNode(node: Node | null): number {
    let cur: Node | null = node;
    while (cur) {
      if (cur instanceof HTMLElement && cur.dataset.pageNumber) {
        const parsed = Number.parseInt(cur.dataset.pageNumber, 10);
        if (Number.isInteger(parsed) && parsed > 0) return parsed;
      }
      cur = cur.parentNode;
    }
    return this.currentPage;
  }

  extractRegionContext(rect: DOMRect): PdfRegionCapture | null {
    let bestSlot: PageSlot | null = null;
    let bestArea = 0;
    for (const slot of this.slots) {
      const sr = slot.el.getBoundingClientRect();
      const ix = Math.max(0, Math.min(rect.right, sr.right) - Math.max(rect.left, sr.left));
      const iy = Math.max(0, Math.min(rect.bottom, sr.bottom) - Math.max(rect.top, sr.top));
      const area = ix * iy;
      if (area > bestArea) {
        bestArea = area;
        bestSlot = slot;
      }
    }
    if (!bestSlot || bestArea < 16) return null;
    const sr = bestSlot.el.getBoundingClientRect();
    const clamp01 = (v: number) => Math.max(0, Math.min(1, Number(v.toFixed(3))));
    const bbox: [number, number, number, number] = [
      clamp01((rect.left - sr.left) / Math.max(sr.width, 1)),
      clamp01((rect.top - sr.top) / Math.max(sr.height, 1)),
      clamp01((rect.right - sr.left) / Math.max(sr.width, 1)),
      clamp01((rect.bottom - sr.top) / Math.max(sr.height, 1)),
    ];
    const spans = Array.from(bestSlot.textLayerEl.querySelectorAll("span"));
    const picked: string[] = [];
    for (const span of spans) {
      const r = span.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) continue;
      const intersects = !(r.right < rect.left || r.left > rect.right || r.bottom < rect.top || r.top > rect.bottom);
      if (intersects) {
        const t = span.textContent?.trim();
        if (t) picked.push(t);
      }
    }

    // 从当前页高分 Canvas 真实裁剪框选区域为 PNG，供聊天输入框作为多模态图片附件发送
    let imageDataUrl: string | undefined;
    if (bestSlot.canvas.width > 0 && bestSlot.canvas.height > 0) {
      try {
        const sx = Math.max(0, Math.floor(bbox[0] * bestSlot.canvas.width));
        const sy = Math.max(0, Math.floor(bbox[1] * bestSlot.canvas.height));
        const sw = Math.max(1, Math.min(bestSlot.canvas.width - sx, Math.ceil((bbox[2] - bbox[0]) * bestSlot.canvas.width)));
        const sh = Math.max(1, Math.min(bestSlot.canvas.height - sy, Math.ceil((bbox[3] - bbox[1]) * bestSlot.canvas.height)));
        const maxEdge = 1440;
        const downscale = Math.min(1, maxEdge / Math.max(sw, sh));
        const dw = Math.max(1, Math.round(sw * downscale));
        const dh = Math.max(1, Math.round(sh * downscale));
        const crop = document.createElement("canvas");
        crop.width = dw;
        crop.height = dh;
        const cctx = crop.getContext("2d");
        if (cctx) {
          cctx.fillStyle = "#ffffff";
          cctx.fillRect(0, 0, dw, dh);
          cctx.drawImage(bestSlot.canvas, sx, sy, sw, sh, 0, 0, dw, dh);
          imageDataUrl = crop.toDataURL("image/png");
        }
      } catch {
        // 裁剪失败时降级为纯坐标引用
      }
    }

    return {
      page: bestSlot.pageNumber,
      bbox,
      text: picked.join(" ").replace(/\s+/g, " ").trim(),
      imageDataUrl,
    };
  }

  // 当前页：视口上方三分之一处落在哪一页（读者视线所在），缩放锁定期间不动。
  private syncCurrentPage(): void {
    if (this.disposed || performance.now() < this.zoomLockUntil || !this.slots.length) return;
    const stage = this.stageEl.getBoundingClientRect();
    const line = stage.top + stage.height / 3;
    const slot = this.slots.find((item) => item.el.getBoundingClientRect().bottom > line) ?? this.slots[this.slots.length - 1];
    if (slot.pageNumber === this.currentPage) return;
    this.currentPage = slot.pageNumber;
    this.callbacks.onPageChange(this.currentPage, this.pageCount);
    this.evictFarPages(this.currentPage);
  }

  destroy(): void {
    this.disposed = true;
    this.stageEl.removeEventListener("scroll", this.onStageScroll);
    if (this.pageFrame) cancelAnimationFrame(this.pageFrame);
    this.searchGen += 1;
    this.renderQueue = [];
    this.observer?.disconnect();
    this.observer = null;
    for (const slot of this.slots) {
      this.cancelSlot(slot);
      slot.canvas.width = 0;
      slot.canvas.height = 0;
    }
    this.slots = [];
    this.stackEl.replaceChildren();
    this.doc = null;
    if (this.loadingTask) {
      void this.loadingTask.destroy();
      this.loadingTask = null;
    }
  }

  private computeFitWidthScale(): number {
    const avail = Math.max(280, this.stageEl.clientWidth - 40);
    return Math.min(2.0, avail / Math.max(this.baseWidth, 200));
  }

  private buildSlots(total: number): void {
    this.stackEl.replaceChildren();
    this.slots = [];
    const frag = document.createDocumentFragment();
    for (let i = 1; i <= total; i += 1) {
      const el = document.createElement("div");
      el.className = "dr-pdf-page";
      el.dataset.pageNumber = String(i);

      const canvas = document.createElement("canvas");
      canvas.className = "dr-pdf-canvas";

      const textLayerEl = document.createElement("div");
      textLayerEl.className = "dr-text-layer";

      const badge = document.createElement("span");
      badge.className = "dr-page-badge";
      badge.textContent = `${i}`;

      el.append(canvas, textLayerEl, badge);
      const slot: PageSlot = {
        pageNumber: i,
        el,
        canvas,
        textLayerEl,
        rendered: false,
        rendering: false,
        renderGen: 0,
        renderTask: null,
        renderedScale: 0,
      };
      this.applySlotSize(slot);
      this.slots.push(slot);
      frag.appendChild(el);
    }
    this.stackEl.appendChild(frag);
  }

  private applySlotSize(slot: PageSlot): void {
    slot.el.style.width = `${Math.round(this.baseWidth * this.scale)}px`;
    slot.el.style.height = `${Math.round(this.baseHeight * this.scale)}px`;
  }

  private setupObserver(): void {
    this.observer?.disconnect();
    this.observer = new IntersectionObserver(
      (entries) => {
        if (this.disposed) return;
        // 观察器带预渲染边距、且只报变化的页，只用来排渲染；当前页按视口几何算。
        for (const entry of entries) {
          const pageNum = Number.parseInt((entry.target as HTMLElement).dataset.pageNumber ?? "", 10);
          if (Number.isInteger(pageNum) && entry.isIntersecting) this.enqueueRender(pageNum);
        }
        this.syncCurrentPage();
      },
      { root: this.stageEl, rootMargin: "520px 0px", threshold: [0.05, 0.4, 0.75] }
    );
    for (const slot of this.slots) {
      this.observer.observe(slot.el);
    }
    this.stageEl.removeEventListener("scroll", this.onStageScroll);
    this.stageEl.addEventListener("scroll", this.onStageScroll, { passive: true });
  }

  private renderVisibleWindow(centerPage: number): void {
    for (let p = Math.max(1, centerPage - 1); p <= Math.min(this.pageCount, centerPage + 2); p += 1) {
      this.enqueueRender(p);
    }
    this.evictFarPages(centerPage);
  }

  private isFarPage(pageNumber: number, centerPage: number): boolean {
    return this.slots.length > 12 && Math.abs(pageNumber - centerPage) > 6;
  }

  private releaseSlotBuffers(slot: PageSlot): void {
    slot.canvas.width = 0;
    slot.canvas.height = 0;
    slot.textLayerEl.replaceChildren();
    slot.rendered = false;
  }

  private evictFarPages(centerPage: number): void {
    if (this.slots.length <= 12) return;
    this.renderQueue = this.renderQueue.filter((p) => !this.isFarPage(p, centerPage));
    for (const slot of this.slots) {
      if (this.isFarPage(slot.pageNumber, centerPage)) {
        if (slot.rendering) this.cancelSlot(slot);
        if (slot.rendered) this.releaseSlotBuffers(slot);
      }
    }
  }

  private cancelSlot(slot: PageSlot): void {
    slot.renderGen += 1;
    if (slot.renderTask) {
      try {
        slot.renderTask.cancel();
      } catch {
        // 忽略已结束任务取消错误
      }
      slot.renderTask = null;
    }
    slot.rendering = false;
  }

  private enqueueRender(pageNumber: number): void {
    const slot = this.slots[pageNumber - 1];
    if (!slot || this.disposed) return;
    if ((slot.rendered && slot.renderedScale === this.scale) || slot.rendering) return;
    if (!this.renderQueue.includes(pageNumber)) {
      this.renderQueue.push(pageNumber);
    }
    this.pumpRenderQueue();
  }

  private pumpRenderQueue(): void {
    while (!this.disposed && this.activeRenders < MAX_CONCURRENT_RENDERS && this.renderQueue.length > 0) {
      const next = this.renderQueue.shift();
      if (next === undefined) break;
      const slot = this.slots[next - 1];
      if (!slot || (slot.rendered && slot.renderedScale === this.scale) || slot.rendering) continue;
      if (this.isFarPage(slot.pageNumber, this.currentPage)) continue;
      this.activeRenders += 1;
      void this.renderSlotNow(slot).finally(() => {
        this.activeRenders = Math.max(0, this.activeRenders - 1);
        this.pumpRenderQueue();
      });
    }
  }

  private async renderSlotNow(slot: PageSlot): Promise<void> {
    if (!this.doc || this.disposed) return;
    if ((slot.rendered && slot.renderedScale === this.scale) || slot.rendering) return;
    const myGen = ++slot.renderGen;
    slot.rendering = true;
    const targetScale = this.scale;
    try {
      const page: PDFPageProxy = await this.doc.getPage(slot.pageNumber);
      if (this.disposed || slot.renderGen !== myGen || targetScale !== this.scale) return;
      const viewport = page.getViewport({ scale: targetScale });
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      slot.el.style.width = `${Math.round(viewport.width)}px`;
      slot.el.style.height = `${Math.round(viewport.height)}px`;
      slot.canvas.width = Math.max(1, Math.floor(viewport.width * dpr));
      slot.canvas.height = Math.max(1, Math.floor(viewport.height * dpr));
      const ctx = slot.canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const task = page.render({ canvas: slot.canvas, canvasContext: ctx, viewport });
      slot.renderTask = task;
      await task.promise;
      if (this.disposed || slot.renderGen !== myGen || targetScale !== this.scale) return;
      slot.renderTask = null;

      // 渲染透明文本选区层（对齐 PDF.js 6.x --total-scale-factor 变量）
      slot.textLayerEl.replaceChildren();
      slot.textLayerEl.style.setProperty("--total-scale-factor", String(targetScale));
      slot.textLayerEl.style.setProperty("--scale-factor", String(targetScale));
      const textContent = await page.getTextContent();
      if (this.disposed || slot.renderGen !== myGen || targetScale !== this.scale) return;
      const textLayer = new pdfjsLib.TextLayer({
        textContentSource: textContent,
        container: slot.textLayerEl,
        viewport,
      });
      await textLayer.render();
      if (this.disposed || slot.renderGen !== myGen || targetScale !== this.scale) return;
      slot.rendered = true;
      slot.renderedScale = targetScale;
      if (this.isFarPage(slot.pageNumber, this.currentPage)) {
        this.releaseSlotBuffers(slot);
        return;
      }
      if (this.searchQuery) {
        this.highlightSlotMatches(slot, false);
      }
    } catch (error) {
      if (error instanceof Error && error.name === "RenderingCancelledException") return;
    } finally {
      if (slot.renderGen === myGen) {
        slot.rendering = false;
        slot.renderTask = null;
      }
    }
  }

  private clearSearchHighlights(): void {
    for (const slot of this.slots) {
      slot.textLayerEl.querySelectorAll("span.is-search-hit, span.is-search-current").forEach((el) => {
        el.classList.remove("is-search-hit", "is-search-current");
      });
    }
  }

  private highlightSlotMatches(slot: PageSlot | undefined, scrollToFirst: boolean): void {
    if (!slot || !this.searchQuery) return;
    const needle = this.searchQuery.toLowerCase();
    let firstHit: HTMLElement | null = null;
    slot.textLayerEl.querySelectorAll("span").forEach((span) => {
      const hit = (span.textContent ?? "").toLowerCase().includes(needle);
      span.classList.toggle("is-search-hit", hit);
      span.classList.remove("is-search-current");
      if (hit && !firstHit) firstHit = span;
    });
    if (firstHit) {
      (firstHit as HTMLElement).classList.add("is-search-current");
      if (scrollToFirst) {
        (firstHit as HTMLElement).scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }

  private async loadOutline(doc: PDFDocumentProxy): Promise<void> {
    try {
      const raw = await doc.getOutline();
      if (!raw || raw.length === 0 || this.disposed) {
        this.callbacks.onOutline([]);
        return;
      }
      const items: PdfOutlineItem[] = [];
      const walk = async (nodes: typeof raw, level: number): Promise<void> => {
        for (const node of nodes) {
          if (items.length >= 80 || this.disposed) return;
          let page = 1;
          try {
            const dest = typeof node.dest === "string" ? await doc.getDestination(node.dest) : node.dest;
            if (Array.isArray(dest) && dest[0]) {
              const idx = await doc.getPageIndex(dest[0] as Parameters<PDFDocumentProxy["getPageIndex"]>[0]);
              page = idx + 1;
            }
          } catch {
            // 无效目标回落首页
          }
          items.push({ title: node.title.trim() || `第 ${page} 页`, page, level });
          if (node.items && node.items.length > 0 && level < 2) {
            await walk(node.items, level + 1);
          }
        }
      };
      await walk(raw, 0);
      if (!this.disposed) this.callbacks.onOutline(items);
    } catch {
      this.callbacks.onOutline([]);
    }
  }
}
