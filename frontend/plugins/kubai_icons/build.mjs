import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..", "..", "..");
const outRoot = resolve(repoRoot, "plugins", "kubai_icons");
const stagingRoot = resolve(repoRoot, "plugins", "kubai_icons", ".build-staging");
const genDir = resolve(here, ".generated");

const kubaiDist = resolve(here, "node_modules", "kubai-icons", "dist");
const lineIcons = JSON.parse(await readFile(resolve(kubaiDist, "line", "icons.json"), "utf8"));
const categories = JSON.parse(await readFile(resolve(kubaiDist, "categories.json"), "utf8"));

const byCategory = new Map();
const categoryByName = {};
for (const entry of lineIcons) {
  categoryByName[entry.name] = entry.category;
  const bucket = byCategory.get(entry.category);
  if (bucket) bucket.push(entry.name);
  else byCategory.set(entry.category, [entry.name]);
}

await rm(genDir, { recursive: true, force: true });
await mkdir(genDir, { recursive: true });

// 为官方 26 个分类各生成一个按需动态加载的 barrel，确保拆包文件数严格受控（≤ 30 个 chunk）。
const loaderLines = [
  "const CATEGORY_LOADERS = {",
];
for (const [catId, names] of [...byCategory.entries()].sort(([a], [b]) => a.localeCompare(b))) {
  const safeCat = catId.replace(/[^a-z0-9_-]/gi, "_");
  const modLines = [];
  names.forEach((name, idx) => {
    modLines.push(`import i${idx} from "kubai-icons/line/icons/${name}";`);
  });
  modLines.push("export const icons = {");
  names.forEach((name, idx) => {
    modLines.push(`  ${JSON.stringify(name)}: i${idx},`);
  });
  modLines.push("};");
  await writeFile(resolve(genDir, `cat-${safeCat}.js`), `${modLines.join("\n")}\n`, "utf8");
  loaderLines.push(`  ${JSON.stringify(catId)}: () => import("./cat-${safeCat}.js"),`);
}
loaderLines.push("};");
loaderLines.push(`export const CATEGORY_BY_NAME = ${JSON.stringify(categoryByName)};`);
loaderLines.push("export function loadCategoryIcons(categoryId) {");
loaderLines.push("  const loader = CATEGORY_LOADERS[categoryId];");
loaderLines.push("  return loader ? loader().then((mod) => mod.icons) : Promise.resolve({});");
loaderLines.push("}");
await writeFile(resolve(genDir, "loader.js"), `${loaderLines.join("\n")}\n`, "utf8");

// 独立的目录元数据 chunk：仅打开图标选择器时才懒加载，不占入口预算。
await writeFile(
  resolve(genDir, "catalog-data.js"),
  `export const CATEGORIES = ${JSON.stringify(categories)};\nexport const LINE_ICONS = ${JSON.stringify(lineIcons)};\n`,
  "utf8",
);

await rm(stagingRoot, { recursive: true, force: true });
await mkdir(stagingRoot, { recursive: true });

try {
  await build({
    entryPoints: { plugin_ui: resolve(here, "src", "entry.tsx") },
    bundle: true,
    splitting: true,
    format: "esm",
    target: "es2022",
    minify: true,
    jsx: "automatic",
    legalComments: "none",
    outdir: stagingRoot,
    entryNames: "[name]",
    chunkNames: "static/chunks/[name]-[hash]",
    external: ["react", "react/jsx-runtime", "react-dom/client", "@akashic/chat-ui-v1"],
    nodePaths: [resolve(here, "node_modules")],
  });

  // 原子替换最终产物并清理历史遗留 chunk。
  await mkdir(resolve(outRoot, "static"), { recursive: true });
  await rm(resolve(outRoot, "static", "chunks"), { recursive: true, force: true });
  await rename(resolve(stagingRoot, "plugin_ui.js"), resolve(outRoot, "plugin_ui.js"));
  await rename(resolve(stagingRoot, "plugin_ui.css"), resolve(outRoot, "plugin_ui.css"));
  await rename(resolve(stagingRoot, "static", "chunks"), resolve(outRoot, "static", "chunks"));
} finally {
  await rm(stagingRoot, { recursive: true, force: true });
  await rm(genDir, { recursive: true, force: true });
}
