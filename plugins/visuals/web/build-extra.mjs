import { copyFile, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build as bundle } from "esbuild";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..", "..", "..");
const outDir = resolve(here, "..");
const srcDir = resolve(here, "src");

const visualCharts = await bundle({
  entryPoints: [resolve(srcDir, "charts.ts")],
  bundle: true,
  format: "iife",
  target: "es2022",
  minify: true,
  write: false,
});

const visualFrameSource = await readFile(resolve(srcDir, "frame.html"), "utf8");
if (visualFrameSource.split("/*visual-charts*/").length !== 2) {
  throw new Error("visuals frame.html 必须恰有一处 /*visual-charts*/ 占位符");
}
const visualFrame = visualFrameSource.replace(
  "/*visual-charts*/",
  () => visualCharts.outputFiles[0].text.trim().replaceAll("</script", "<\\/script"),
);

await bundle({
  entryPoints: [resolve(srcDir, "message-entry.ts")],
  bundle: true,
  format: "esm",
  target: "es2022",
  minify: true,
  plugins: [{
    name: "frame-template",
    setup(b) {
      b.onResolve({ filter: /\.html\?raw$/ }, (args) => ({
        path: resolve(args.resolveDir, args.path.slice(0, -4)),
        namespace: "frame",
      }));
      b.onLoad({ filter: /.*/, namespace: "frame" }, async (args) => ({
        contents: args.path.endsWith("frame.html") ? visualFrame : await readFile(args.path, "utf8"),
        loader: "text",
      }));
    },
  }],
  outfile: resolve(outDir, "message_ui.js"),
});

const themeBuild = await bundle({
  entryPoints: [resolve(repoRoot, "packages/akashic-theme/src/theme-runtime.ts")],
  bundle: true,
  format: "esm",
  platform: "node",
  write: false,
});
const themeModule = await import(`data:text/javascript;base64,${Buffer.from(themeBuild.outputFiles[0].contents).toString("base64")}`);

await writeFile(resolve(outDir, "frame.html"), visualFrame);
await copyFile(resolve(srcDir, "bootstrap.html"), resolve(outDir, "bootstrap.html"));
await writeFile(resolve(outDir, "preview-theme.css"), themeModule.themeCss());
await writeFile(
  resolve(outDir, ".akashic-generated-assets.json"),
  `${JSON.stringify(["frame.html", "bootstrap.html", "preview-theme.css"], null, 2)}\n`,
);
