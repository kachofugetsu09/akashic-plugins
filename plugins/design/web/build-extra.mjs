import { createRequire } from "node:module";
import { readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build as bundle } from "esbuild";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..", "..", "..");
const outDir = resolve(here, "..");
const editorDir = resolve(here, "editor");
const localModules = resolve(here, "node_modules");
const designAssets = resolve(outDir, "static");
const localRequire = createRequire(resolve(here, "package.json"));

await rm(designAssets, { recursive: true, force: true });

const designOptions = {
  bundle: true,
  format: "esm",
  target: "es2022",
  minify: true,
  metafile: true,
  outdir: designAssets,
  entryNames: "[name]-[hash]",
  assetNames: "[name]-[hash]",
  publicPath: "/design/assets/",
  legalComments: "none",
  nodePaths: [localModules],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
    __VUE_OPTIONS_API__: "true",
    __VUE_PROD_DEVTOOLS__: "false",
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "false",
  },
  external: ["node:*", "fs", "path", "module", "url", "worker_threads"],
  loader: { ".wasm": "file", ".ttf": "file", ".woff2": "file" },
};

const designName = (p) => p.slice(p.lastIndexOf("/") + 1);
const openPencilCore = resolve(localModules, "@open-pencil/core/dist");

const designWorkerBuild = await bundle({
  ...designOptions,
  entryPoints: {
    "export-worker": resolve(openPencilCore, "io/formats/fig/export-worker.js"),
    "fig-worker": resolve(openPencilCore, "kiwi/fig/session/worker.js"),
  },
});

const designWorkers = Object.fromEntries(
  Object.entries(designWorkerBuild.metafile.outputs)
    .filter(([, output]) => output.entryPoint)
    .map(([p, output]) => [
      output.entryPoint.endsWith("export-worker.js") ? "export-worker" : "worker",
      `/design/assets/${designName(p)}`,
    ]),
);

const designWorkerUrls = {
  name: "design-worker-urls",
  setup(b) {
    b.onLoad(
      { filter: /@open-pencil[\\/]core[\\/]dist[\\/](io[\\/]formats[\\/]fig[\\/]export|kiwi[\\/]fig[\\/]session[\\/]client)\.js$/ },
      async (args) => ({
        loader: "js",
        contents: (await readFile(args.path, "utf8")).replace(
          /new URL\("\.\/(export-worker|worker)\.ts", import\.meta\.url\)/gu,
          (_, name) => `new URL(${JSON.stringify(designWorkers[name])}, import.meta.url)`,
        ),
      }),
    );
  },
};

let designJSXPatched = 0;
const designJSXEval = {
  name: "design-jsx-sandbox",
  setup(b) {
    b.onLoad({ filter: /@open-pencil[\\/]design-jsx[\\/]dist[\\/]chunks[\\/]fields\.js$/ }, async (args) => {
      designJSXPatched += 1;
      const source = await readFile(args.path, "utf8");
      const patched = source
        .replace(
          "const element = createElement(buildComponent(jsxString, helperWarnings), null);\n\tconst tree = resolveToTree(element);",
          "const tree = await __akashicEvaluateJSX(jsxString, helperWarnings);",
        )
        .replace(
          'new Function("React", "__helpers", code)(mini_react_exports, designJSXHelpers(warnings))',
          '(() => { throw new Error("设计 JSX 只在沙箱里求值"); })()',
        );
      if (patched.split("__akashicEvaluateJSX").length !== 2 || patched.includes("new Function(")) {
        throw new Error(`@open-pencil/design-jsx 的 fields.js 已变化，无法确认 JSX 沙箱补丁（${args.path}）`);
      }
      const client = JSON.stringify(resolve(editorDir, "jsx.ts"));
      return { loader: "js", contents: `import { evaluateJSX as __akashicEvaluateJSX } from ${client};\n${patched}` };
    });
  },
};

const designSandbox = await bundle({
  ...designOptions,
  write: false,
  metafile: false,
  entryPoints: [resolve(editorDir, "jsx-sandbox.ts")],
});
const designSandboxScript = designSandbox.outputFiles
  .find((file) => file.path.endsWith(".js"))
  .text.replaceAll("</script", "<\\/script");

await writeFile(
  resolve(designAssets, "jsx.html"),
  `<!doctype html><meta charset="utf-8"><title>JSX</title><script type="module">${designSandboxScript}</script>\n`,
);
await writeFile(resolve(designAssets, "preview.html"), await readFile(resolve(editorDir, "preview.html"), "utf8"));

const designBuild = await bundle({
  ...designOptions,
  plugins: [designWorkerUrls, designJSXEval],
  entryPoints: {
    editor: resolve(editorDir, "main.ts"),
    worker: resolve(editorDir, "headless.ts"),
  },
});
if (designJSXPatched !== 1) throw new Error(`design-jsx-sandbox 补丁命中 ${designJSXPatched} 次，应为 1 次`);

const designOutputs = Object.entries(designBuild.metafile.outputs);
const designEntry = designOutputs.find(([, output]) => output.entryPoint?.endsWith("editor/main.ts"));
const designWorkerEntry = designOutputs.find(([, output]) => output.entryPoint?.endsWith("editor/headless.ts"));
if (!designEntry || !designWorkerEntry) throw new Error("设计编辑器没有产出入口");

await writeFile(
  resolve(designAssets, "worker.html"),
  `<!doctype html><meta charset="utf-8"><title>设计</title><script type="module" src="/design/assets/${designName(designWorkerEntry[0])}"></script>\n`,
);

const importLocal = (spec) => import(pathToFileURL(localRequire.resolve(spec)).href);
const { CORE_TOOLS } = await importLocal("@open-pencil/core");
const { toJsonSchema } = await importLocal("@valibot/to-json-schema");
const { JSX_REFERENCE } = await importLocal("@open-pencil/design-jsx");
const DESIGN_EXCLUDED = new Set(["stock_photo", "eval", "get_selection", "viewport_zoom_to_fit"]);
await writeFile(
  resolve(designAssets, "tools.json"),
  JSON.stringify(
    CORE_TOOLS.filter((tool) => !DESIGN_EXCLUDED.has(tool.name)).map((tool) => ({
      name: tool.name,
      description: tool.name === "render" ? `${tool.description}\n\n${JSX_REFERENCE}` : tool.description,
      parameters: toJsonSchema(tool.input, { errorMode: "ignore" }),
    })),
  ),
);

const themeBuild = await bundle({
  entryPoints: [resolve(repoRoot, "packages/akashic-theme/src/theme-runtime.ts")],
  bundle: true,
  format: "esm",
  platform: "node",
  write: false,
});
const themeModule = await import(`data:text/javascript;base64,${Buffer.from(themeBuild.outputFiles[0].contents).toString("base64")}`);
const designTheme = themeModule.themeCss() + await readFile(resolve(repoRoot, "packages/akashic-theme/src/brand-tokens.css"), "utf8");
const designStyles = designOutputs.filter(([p]) => p.endsWith(".css")).map(([p]) => designName(p));

await writeFile(resolve(designAssets, "editor.html"), `<!doctype html>
<html lang="zh-CN" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>设计</title>
<style>${designTheme}</style>
${designStyles.map((name) => `<link rel="stylesheet" href="/design/assets/${name}">`).join("\n")}
<script type="module" src="/design/assets/${designName(designEntry[0])}"></script>
</head>
<body><div id="design-root"></div></body>
</html>
`);
