import { DocxScrollViewer, type DocxSelectionContext } from "@silurus/ooxml/docx";
import { PptxScrollViewer, type PptxSelectionContext } from "@silurus/ooxml/pptx";
import { XlsxViewer, type XlsxSelectionContext } from "@silurus/ooxml/xlsx";
import type { DocumentFormat } from "./contract";

declare const __AKASHIC_DOCX_WASM_URL__: string;
declare const __AKASHIC_XLSX_WASM_URL__: string;
declare const __AKASHIC_PPTX_WASM_URL__: string;

const DOCX_WASM_URL =
  typeof __AKASHIC_DOCX_WASM_URL__ === "string"
    ? __AKASHIC_DOCX_WASM_URL__
    : "/file_viewer/assets/docx_parser_bg.wasm";
const XLSX_WASM_URL =
  typeof __AKASHIC_XLSX_WASM_URL__ === "string"
    ? __AKASHIC_XLSX_WASM_URL__
    : "/file_viewer/assets/xlsx_parser_bg.wasm";
const PPTX_WASM_URL =
  typeof __AKASHIC_PPTX_WASM_URL__ === "string"
    ? __AKASHIC_PPTX_WASM_URL__
    : "/file_viewer/assets/pptx_parser_bg.wasm";

export type OoxmlSelectionPayload = {
  label: string;
  text: string;
};

type OoxmlKind = Exclude<DocumentFormat, "pdf">;

function colLabel(col: number): string {
  let n = col + 1;
  let out = "";
  while (n > 0) {
    const rem = (n - 1) % 26;
    out = String.fromCharCode(65 + rem) + out;
    n = Math.floor((n - 1) / 26);
  }
  return out;
}

function formatXlsxSelection(ctx: XlsxSelectionContext): OoxmlSelectionPayload | null {
  if (ctx.kind !== "range") return null;
  const sheet = ctx.sheetName || `Sheet${ctx.sheetIndex + 1}`;
  const areas = ctx.selection?.areas ?? [];
  let rangeTag = sheet;
  if (areas.length > 0) {
    const first = areas[0];
    if (first.kind === "cells") {
      const start = `${colLabel(first.left)}${first.top + 1}`;
      const end = `${colLabel(first.right)}${first.bottom + 1}`;
      rangeTag = start === end ? `${sheet}!${start}` : `${sheet}!${start}:${end}`;
    } else if (first.kind === "rows") {
      rangeTag = `${sheet}!${first.firstRow + 1}:${first.lastRow + 1}`;
    } else if (first.kind === "columns") {
      rangeTag = `${sheet}!${colLabel(first.firstColumn)}:${colLabel(first.lastColumn)}`;
    }
  }
  if (!ctx.cells || ctx.cells.length === 0) return null;

  // 组织为紧凑 Markdown 表格，便于 AI 直接阅读结构化数值
  const rows = new Map<number, Map<number, string>>();
  let minCol = Number.POSITIVE_INFINITY;
  let maxCol = -1;
  for (const cell of ctx.cells) {
    const val = (cell.displayText ?? "").replace(/\r?\n/g, " ").replace(/\|/g, "\\|").trim();
    const row = cell.address.row;
    const col = cell.address.col;
    if (!rows.has(row)) rows.set(row, new Map());
    rows.get(row)?.set(col, val);
    if (col < minCol) minCol = col;
    if (col > maxCol) maxCol = col;
  }
  const sortedRows = Array.from(rows.keys()).sort((a, b) => a - b).slice(0, 60);
  if (sortedRows.length === 0 || maxCol < minCol) return null;

  const colCount = Math.min(maxCol - minCol + 1, 20);
  const cols = Array.from({ length: colCount }, (_, i) => minCol + i);
  const header = `| ${cols.map((c) => colLabel(c)).join(" | ")} |`;
  const sep = `| ${cols.map(() => "---").join(" | ")} |`;
  const body = sortedRows.map((r) => {
    const map = rows.get(r);
    return `| ${cols.map((c) => map?.get(c) ?? "").join(" | ")} |`;
  });
  return {
    label: rangeTag,
    text: [header, sep, ...body].join("\n"),
  };
}

export class OoxmlAdapter {
  private docx: DocxScrollViewer | null = null;
  private xlsx: XlsxViewer | null = null;
  private pptx: PptxScrollViewer | null = null;
  private sheetNames: string[] = [];
  private kind: OoxmlKind;
  private zoom = 1;

  constructor(
    kind: OoxmlKind,
    private readonly hostEl: HTMLElement,
    private readonly callbacks: {
      onPageChange: (page: number, total: number) => void;
      onSheetChange: (sheetName: string, totalSheets: number) => void;
      onSelection: (payload: OoxmlSelectionPayload | null) => void;
    }
  ) {
    this.kind = kind;
  }

  async load(data: ArrayBuffer, anchor?: { page?: number; sheet?: string }): Promise<void> {
    this.hostEl.replaceChildren();
    if (this.kind === "docx") {
      const viewer = new DocxScrollViewer(this.hostEl, {
        wasmUrl: DOCX_WASM_URL,
        enableTextSelection: true,
        onSelectionContextChange: (ctx: DocxSelectionContext | null) => {
          if (ctx && ctx.kind === "text" && ctx.text.trim()) {
            const page = ctx.pageIndexes[0] !== undefined ? `p.${ctx.pageIndexes[0] + 1}` : "";
            this.callbacks.onSelection({ label: page, text: ctx.text.trim() });
          } else {
            this.callbacks.onSelection(null);
          }
        },
      });
      this.docx = viewer;
      await viewer.load(data);
      this.callbacks.onPageChange(1, Math.max(1, viewer.pageCount));
      if (anchor?.page && anchor.page > 1) {
        await this.goToPage(anchor.page);
      }
      return;
    }

    if (this.kind === "pptx") {
      const viewer = new PptxScrollViewer(this.hostEl, {
        wasmUrl: PPTX_WASM_URL,
        enableTextSelection: true,
        onSelectionContextChange: (ctx: PptxSelectionContext | null) => {
          if (ctx && ctx.kind === "text" && ctx.text.trim()) {
            const slide = ctx.slideIndexes[0] !== undefined ? `Slide ${ctx.slideIndexes[0] + 1}` : "";
            this.callbacks.onSelection({ label: slide, text: ctx.text.trim() });
          } else {
            this.callbacks.onSelection(null);
          }
        },
      });
      this.pptx = viewer;
      await viewer.load(data);
      this.callbacks.onPageChange(1, Math.max(1, viewer.slideCount));
      if (anchor?.page && anchor.page > 1) {
        await this.goToPage(anchor.page);
      }
      return;
    }

    const viewer = new XlsxViewer(this.hostEl, {
      wasmUrl: XLSX_WASM_URL,
      onReady: (names) => {
        this.sheetNames = names;
        if (names.length > 0) this.callbacks.onSheetChange(names[0], names.length);
      },
      onSheetChange: (index, total) => {
        this.callbacks.onSheetChange(this.sheetNames[index] || `Sheet${index + 1}`, total);
      },
      onSelectionContextChange: (ctx: XlsxSelectionContext | null) => {
        this.callbacks.onSelection(ctx ? formatXlsxSelection(ctx) : null);
      },
    });
    this.xlsx = viewer;
    await viewer.load(data);
    if (anchor?.sheet) {
      await this.goToSheet(anchor.sheet);
    }
  }

  async goToPage(page: number): Promise<void> {
    const idx = Math.max(0, page - 1);
    if (this.docx) {
      const target = this.docx as unknown as { scrollToPage?: (i: number) => Promise<void> | void };
      await target.scrollToPage?.(idx);
    } else if (this.pptx) {
      const target = this.pptx as unknown as { scrollToSlide?: (i: number) => Promise<void> | void };
      await target.scrollToSlide?.(idx);
    }
  }

  async goToSheet(sheetName: string): Promise<void> {
    if (!this.xlsx) return;
    const idx = this.sheetNames.findIndex((s) => s.toLowerCase() === sheetName.toLowerCase());
    if (idx >= 0) await this.xlsx.goToSheet(idx);
  }

  setZoomFactor(factor: number): number {
    this.zoom = Math.max(0.6, Math.min(2.2, factor));
    const target = (this.docx ?? this.xlsx ?? this.pptx) as unknown as { setScale?: (s: number) => void } | null;
    target?.setScale?.(this.zoom);
    return Math.round(this.zoom * 100);
  }

  destroy(): void {
    this.docx?.destroy();
    this.xlsx?.destroy();
    this.pptx?.destroy();
    this.docx = null;
    this.xlsx = null;
    this.pptx = null;
    this.hostEl.replaceChildren();
  }
}
