export const READER_CHANNEL = "akashic.doc_reader.v1";

export type DocumentFormat = "pdf" | "docx" | "xlsx" | "pptx";

export type DocumentAnchor = {
  page?: number;
  sheet?: string;
  search?: string;
  note?: string;
};

export type ReaderToFrame =
  | {
      channel: typeof READER_CHANNEL;
      type: "open";
      path: string;
      format: DocumentFormat;
      data: ArrayBuffer;
      theme: "light" | "dark";
      anchor?: DocumentAnchor;
    }
  | {
      channel: typeof READER_CHANNEL;
      type: "jump";
      anchor: DocumentAnchor;
    }
  | {
      channel: typeof READER_CHANNEL;
      type: "theme";
      theme: "light" | "dark";
    };

export type ReaderFromFrame =
  | {
      channel: typeof READER_CHANNEL;
      type: "ready";
    }
  | {
      channel: typeof READER_CHANNEL;
      type: "quote";
      source: string;
      text: string;
    }
  | {
      channel: typeof READER_CHANNEL;
      type: "state";
      page?: number;
      totalPages?: number;
      sheet?: string;
    }
  | {
      channel: typeof READER_CHANNEL;
      type: "error";
      message: string;
    };

export function detectDocumentFormat(path: string): DocumentFormat | null {
  const lower = path.toLowerCase();
  if (lower.endsWith(".pdf")) return "pdf";
  if (lower.endsWith(".docx")) return "docx";
  if (lower.endsWith(".xlsx")) return "xlsx";
  if (lower.endsWith(".pptx")) return "pptx";
  return null;
}
