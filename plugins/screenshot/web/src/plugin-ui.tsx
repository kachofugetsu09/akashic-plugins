import type { PluginUiDefinition } from "@akashic/chat-ui-v1";
import { startScreenshot } from "./shot-preview";
import "./plugin-ui.css";

// lucide scan-line：菜单项图标由宿主按 SVG 源码绘制。
const SCAN_LINE = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12h10"/></svg>';

const definition: PluginUiDefinition = {
  slots: {
    // 回答菜单里的「截图这一轮」：框住提问到这条回答；宿主决定放进右键菜单和「⋯」菜单。
    "message.actions": {
      mount(_host, context) {
        context.menu.publish([{ id: "screenshot", label: "截图这一轮", iconSvg: SCAN_LINE,
          run: () => { void startScreenshot(context, { around: context.messageId }); } }]);
        return () => context.menu.publish([]);
      },
    },
  },
};

export default definition;
