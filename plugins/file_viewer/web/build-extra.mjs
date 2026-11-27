import { createHash } from "node:crypto";
import { cp, mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build as bundle } from "esbuild";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..", "..", "..");
const outDir = resolve(here, "..");
const localModules = resolve(here, "node_modules");
const readerAssets = resolve(outDir, "static");
const stagingAssets = resolve(outDir, ".static-staging");

await rm(stagingAssets, { recursive: true, force: true });
await mkdir(stagingAssets, { recursive: true });

const copyHashed = async (sourcePath, stem, ext) => {
  const bytes = await readFile(sourcePath);
  const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 8);
  const filename = `${stem}-${hash}${ext}`;
  await writeFile(resolve(stagingAssets, filename), bytes);
  return `/file_viewer/assets/${filename}`;
};

const pdfWorkerUrl = await copyHashed(resolve(localModules, "pdfjs-dist/build/pdf.worker.min.mjs"), "pdf.worker", ".mjs");
const docxWasmUrl = await copyHashed(resolve(localModules, "@silurus/ooxml/dist/docx_parser_bg.wasm"), "docx_parser_bg", ".wasm");
const xlsxWasmUrl = await copyHashed(resolve(localModules, "@silurus/ooxml/dist/xlsx_parser_bg.wasm"), "xlsx_parser_bg", ".wasm");
const pptxWasmUrl = await copyHashed(resolve(localModules, "@silurus/ooxml/dist/pptx_parser_bg.wasm"), "pptx_parser_bg", ".wasm");

await cp(resolve(localModules, "pdfjs-dist/cmaps"), resolve(stagingAssets, "cmaps"), { recursive: true });
await cp(resolve(localModules, "pdfjs-dist/standard_fonts"), resolve(stagingAssets, "standard_fonts"), { recursive: true });

const readerBuild = await bundle({
  entryPoints: { viewer: resolve(here, "viewer/main.ts") },
  bundle: true,
  format: "esm",
  target: "es2022",
  minify: true,
  metafile: true,
  outdir: stagingAssets,
  entryNames: "[name]-[hash]",
  assetNames: "[name]-[hash]",
  publicPath: "/file_viewer/assets/",
  legalComments: "none",
  nodePaths: [localModules],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
    "__AKASHIC_PDF_WORKER_URL__": JSON.stringify(pdfWorkerUrl),
    "__AKASHIC_DOCX_WASM_URL__": JSON.stringify(docxWasmUrl),
    "__AKASHIC_XLSX_WASM_URL__": JSON.stringify(xlsxWasmUrl),
    "__AKASHIC_PPTX_WASM_URL__": JSON.stringify(pptxWasmUrl),
    "__AKASHIC_PDF_CMAP_URL__": JSON.stringify("/file_viewer/assets/cmaps/"),
    "__AKASHIC_PDF_FONT_URL__": JSON.stringify("/file_viewer/assets/standard_fonts/"),
  },
  external: ["node:*", "fs", "path", "module", "url", "worker_threads"],
  loader: { ".wasm": "file", ".woff2": "file" },
});

const assetName = (p) => p.slice(p.lastIndexOf("/") + 1);
const readerOutputs = Object.entries(readerBuild.metafile.outputs);
const readerEntry = readerOutputs.find(([, output]) => output.entryPoint?.endsWith("viewer/main.ts"));
if (!readerEntry) throw new Error("文档阅读器没有产出入口");
const readerStyles = readerOutputs.filter(([p]) => p.endsWith(".css")).map(([p]) => assetName(p));

const themeBuild = await bundle({
  entryPoints: [resolve(repoRoot, "packages/akashic-theme/src/theme-runtime.ts")],
  bundle: true,
  format: "esm",
  platform: "node",
  write: false,
});
const themeModule = await import(`data:text/javascript;base64,${Buffer.from(themeBuild.outputFiles[0].contents).toString("base64")}`);
const readerTheme = themeModule.themeCss() + await readFile(resolve(repoRoot, "packages/akashic-theme/src/brand-tokens.css"), "utf8");

await writeFile(resolve(stagingAssets, "viewer.html"), `<!doctype html>
<html lang="zh-CN" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>文档阅读器</title>
<style>${readerTheme}</style>
${readerStyles.map((name) => `<link rel="stylesheet" href="/file_viewer/assets/${name}">`).join("\n")}
<script type="module" src="/file_viewer/assets/${assetName(readerEntry[0])}"></script>
</head>
<body><div id="reader-root"></div></body>
</html>
`);

await rm(readerAssets, { recursive: true, force: true });
await rename(stagingAssets, readerAssets);
