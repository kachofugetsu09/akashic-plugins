import { ScanLine } from "lucide-react";
import { render, type PluginUiDefinition } from "@akashic/chat-ui-v1";
import { startScreenshot } from "./shot-preview";
import "./plugin-ui.css";

const definition: PluginUiDefinition = {
  slots: {
    // 回答工具栏的截图钮：框住这一轮（提问到这条回答）。
    "message.actions": {
      mount(host, context) {
        return render(host, <button type="button" aria-label="截图这一轮" data-tip="截图"
          onClick={() => { void startScreenshot(context, { around: context.messageId }); }}>
          <ScanLine size={16} aria-hidden="true" />
        </button>);
      },
    },
  },
};

export default definition;
