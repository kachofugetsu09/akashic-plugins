import { useEffect, useRef, useState } from "react";
import { currentTheme, subscribeTheme, type WebHostContextV1 } from "@akashic/web-ui-v1";
import {
  READER_CHANNEL,
  type DocumentAnchor,
  type DocumentFormat,
  type ReaderFromFrame,
  type ReaderToFrame,
} from "../viewer/contract";

const FRAME_URL = "/file_viewer/assets/viewer.html";
const RETRY_MS = 3000;

export type LiveOpenEvent = {
  type: "open";
  turn: string;
  path: string;
  page?: number;
  line?: number;
  sheet?: string;
  search?: string;
  note?: string;
};

/** 维持到后端 /api/dashboard/file_viewer/live 的会话级 WebSocket，接收 Agent 主动打开与定位指令。 */
export class ReaderLiveLink {
  private socket: WebSocket | null = null;
  private timer = 0;
  private session: string | null = null;

  constructor(
    private readonly ctx: WebHostContextV1,
    private readonly onOpenEvent: (event: LiveOpenEvent) => void
  ) {}

  connectSession(session: string | null): void {
    if (session === this.session && this.socket) return;
    this.close();
    this.session = session;
    if (session) this.connect();
  }

  close(): void {
    window.clearTimeout(this.timer);
    const s = this.socket;
    this.socket = null;
    s?.close();
  }

  private connect(): void {
    const session = this.session;
    if (!session) return;
    let socket: WebSocket;
    try {
      const url = this.ctx.http.webSocketUrl(
        `/api/dashboard/file_viewer/live?${new URLSearchParams({ session })}`
      );
      socket = new WebSocket(url);
    } catch {
      return;
    }
    this.socket = socket;
    socket.addEventListener("message", (event) => {
      if (this.socket !== socket) return;
      try {
        const parsed = JSON.parse(String(event.data)) as LiveOpenEvent;
        if (parsed && parsed.type === "open" && typeof parsed.path === "string" && parsed.path) {
          this.onOpenEvent(parsed);
        }
      } catch {
        // 忽略非法消息
      }
    });
    socket.addEventListener("close", () => {
      if (this.socket !== socket) return;
      this.socket = null;
      this.timer = window.setTimeout(() => this.connect(), RETRY_MS);
    });
  }
}

type RichDocumentFrameProps = {
  ctx: WebHostContextV1;
  session: string;
  path: string;
  format: DocumentFormat;
  anchor: DocumentAnchor | null;
  anchorNonce: number;
  onQuote: (source: string, text: string) => void;
  onStateChange: (statusText: string) => void;
};

function resolveTheme(): "light" | "dark" {
  return currentTheme().colorScheme === "dark" ? "dark" : "light";
}

export function RichDocumentFrame({
  ctx,
  session,
  path,
  format,
  anchor,
  anchorNonce,
  onQuote,
  onStateChange,
}: RichDocumentFrameProps) {
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const readyRef = useRef(false);
  const loadedKeyRef = useRef("");
  const latestAnchorRef = useRef<DocumentAnchor | null>(anchor);
  latestAnchorRef.current = anchor;
  const activeSessionRef = useRef(session);
  activeSessionRef.current = session;
  const pendingOpenRef = useRef<{ path: string; format: DocumentFormat; data: ArrayBuffer } | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const onQuoteRef = useRef(onQuote);
  onQuoteRef.current = onQuote;
  const onStateRef = useRef(onStateChange);
  onStateRef.current = onStateChange;

  const postToFrame = (message: ReaderToFrame, transfer?: Transferable[]) => {
    const win = frameRef.current?.contentWindow;
    if (!win) return;
    if (transfer && transfer.length > 0) {
      win.postMessage(message, window.location.origin, transfer);
    } else {
      win.postMessage(message, window.location.origin);
    }
  };

  // 监听 iframe 回传事件与宿主明暗主题切换
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.source !== frameRef.current?.contentWindow) return;
      const msg = event.data as ReaderFromFrame | null;
      if (!msg || typeof msg !== "object" || msg.channel !== READER_CHANNEL) return;
      if (msg.type === "ready") {
        readyRef.current = true;
        const pending = pendingOpenRef.current;
        if (pending) {
          pendingOpenRef.current = null;
          postToFrame(
            {
              channel: READER_CHANNEL,
              type: "open",
              path: pending.path,
              format: pending.format,
              data: pending.data,
              theme: resolveTheme(),
              anchor: latestAnchorRef.current ?? undefined,
            },
            [pending.data]
          );
        }
      } else if (msg.type === "quote") {
        if (typeof msg.source === "string" && typeof msg.text === "string" && loadedKeyRef.current.startsWith(`${activeSessionRef.current}\0`)) {
          onQuoteRef.current(msg.source, msg.text);
        }
      } else if (msg.type === "state") {
        if (msg.sheet) {
          onStateRef.current(`工作表 · ${msg.sheet}`);
        } else if (msg.page && msg.totalPages) {
          onStateRef.current(`第 ${msg.page} / ${msg.totalPages} 页`);
        }
      } else if (msg.type === "error") {
        if (typeof msg.message === "string") setError(msg.message);
      }
    };
    window.addEventListener("message", onMessage);
    const stopTheme = subscribeTheme(() => {
      if (readyRef.current) {
        postToFrame({ channel: READER_CHANNEL, type: "theme", theme: resolveTheme() });
      }
    });
    return () => {
      window.removeEventListener("message", onMessage);
      stopTheme();
    };
  }, []);

  // 拉取二进制文档并零拷贝传给同源 iframe
  useEffect(() => {
    let cancelled = false;
    const abort = new AbortController();
    setLoading(true);
    setError("");
    const docKey = `${session}\0${path}`;
    loadedKeyRef.current = "";
    pendingOpenRef.current = null;

    const url = `/api/dashboard/file_viewer/raw?${new URLSearchParams({
      session,
      path,
      download: "false",
    })}`;

    void ctx.http
      .request(url, { method: "GET", signal: abort.signal })
      .then(async (response) => {
        if (!response.ok) {
          const text = await response.text().catch(() => "");
          throw new Error(text || `读取失败 (${response.status})`);
        }
        return response.arrayBuffer();
      })
      .then((buffer) => {
        if (cancelled) return;
        loadedKeyRef.current = docKey;
        setLoading(false);
        const payload = {
          path,
          format,
          data: buffer,
        };
        if (readyRef.current) {
          postToFrame(
            {
              channel: READER_CHANNEL,
              type: "open",
              path: payload.path,
              format: payload.format,
              data: payload.data,
              theme: resolveTheme(),
              anchor: latestAnchorRef.current ?? undefined,
            },
            [payload.data]
          );
        } else {
          pendingOpenRef.current = payload;
        }
      })
      .catch((err) => {
        if (cancelled || abort.signal.aborted) return;
        setLoading(false);
        setError(err instanceof Error ? err.message : String(err));
      });

    return () => {
      cancelled = true;
      abort.abort();
    };
  }, [ctx, format, path, session]);

  // 同一文件上的后续定位跳转（Agent 或引用再次定位时零重载瞬跳）
  useEffect(() => {
    if (!anchor || anchorNonce === 0) return;
    if (!readyRef.current || loadedKeyRef.current !== `${session}\0${path}`) return;
    postToFrame({ channel: READER_CHANNEL, type: "jump", anchor });
  }, [anchor, anchorNonce, path, session]);

  return (
    <div className="md-rich-viewer">
      {loading && <div className="md-rich-overlay">正在加载文档…</div>}
      {error && <div className="md-rich-overlay is-error">{error}</div>}
      <iframe
        ref={frameRef}
        src={FRAME_URL}
        title={`阅读器 · ${path}`}
        className="md-rich-iframe"
      />
    </div>
  );
}
