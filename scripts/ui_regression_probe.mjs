/**
 * 部署后界面回归探针：在真实运行的 Akashic 实例上核对"样式或插件界面突然消失"。
 *
 *   node scripts/ui_regression_probe.mjs --url http://127.0.0.1:2236 \
 *     --token-file <workspace>/web-auth/secret --out <dir> [--baseline <上次的 out>] [--send]
 *     [--session <会话 key>] [--plugin-route akasha-settings] [--timeout 30000]
 *
 * 决定通过与否：资源完整（目录摘要与实际字节一致、页面无失败的 js/css、无控制台错误）、
 * 主题令牌可解析、锚点样式未回落到浏览器默认值（有基线时与基线逐项一致）、插件插槽实际挂上。
 * 截图差异只记录，不判失败。鉴权用本机门禁密钥（Bearer），页面、接口与 WebSocket 都放行。
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright-core';

const args = parseArgs(process.argv.slice(2));
const base = args.url.replace(/\/+$/, '');
const out = resolve(args.out);
const timeout = Number(args.timeout ?? 30_000);
const token = readFileSync(args['token-file'], 'utf8').trim();
const auth = { Authorization: 'Bearer ' + token };
const baseline = args.baseline ? JSON.parse(readFileSync(resolve(args.baseline, 'report.json'), 'utf8')) : null;
const SEND_TEXT = 'UI 回归探针：请回复一句话';
// 唯一放行的良性失败：外壳按内容寻址 URL 用 cache: 'only-if-cached' 试探 HTTP 缓存，Chromium 未命中时
// 记为 net::ERR_CACHE_MISS 并在控制台报 "Failed to load resource"，随后回落到 bootstrap 内联字节
// （frontend/plugins/ui/dashboard/src/webHost.ts importModule）。只按这个 URL 加这个错误码放行。
// 模块从启动响应的内联字节执行；页面空闲 20 秒后才用 fetch 预热 HTTP 缓存，切页或关页会中断这些预热，
// 只缓存探测失败（ERR_CACHE_MISS）和预热被取消（ERR_ABORTED）不算资源故障，模块真实加载由锚点与插槽判定。
const benignCacheProbe = (url, error) => /\/api\/chat\/web-ui\/module\?/.test(url) && /ERR_CACHE_MISS|ERR_ABORTED/.test(error ?? '');
const report = { pass: false, url: base, startedAt: new Date().toISOString(), baseline: args.baseline ?? null,
  failures: [], resources: { webUi: [], pluginUi: [], pageRequests: [], console: [] },
  tokens: {}, anchors: {}, slots: [], screenshots: {}, send: null };
const fail = (check, detail, page) => report.failures.push(page ? { check, page, detail } : { check, detail });
mkdirSync(resolve(out, 'screenshots'), { recursive: true });

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index++) {
    const key = argv[index].replace(/^--/, '');
    if (key === 'send') parsed.send = true;
    else parsed[key] = argv[++index];
  }
  for (const key of ['url', 'token-file', 'out']) {
    if (!parsed[key]) throw new Error('缺少参数 --' + key);
  }
  return parsed;
}

const sha256 = data => createHash('sha256').update(data).digest('hex');

async function get(path) {
  const response = await fetch(base + path, { headers: auth, signal: AbortSignal.timeout(timeout) });
  return { status: response.status, body: Buffer.from(await response.arrayBuffer()) };
}

async function getJson(path) {
  const { status, body } = await get(path);
  if (status !== 200) throw new Error(path + ' 返回 ' + status);
  return JSON.parse(body.toString('utf8'));
}

// 1. 资源：外壳 bootstrap 内联字节与内容寻址 URL、聊天插件目录的模块与样式表，逐个核对状态码与摘要。
async function checkResources() {
  const boot = await getJson('/api/chat/web-ui/bootstrap');
  for (const module of boot.modules) {
    const row = { plugin: module.pluginId, inlineModule: sha256(module.module) === module.moduleSha256 };
    if (module.stylesheetSha256 !== null) row.inlineStylesheet = sha256(module.stylesheet) === module.stylesheetSha256;
    const fetched = await get('/api/chat/web-ui/module?plugin_id=' + encodeURIComponent(module.pluginId)
      + '&sha256=' + module.moduleSha256);
    row.moduleUrl = { status: fetched.status, sha256Match: sha256(fetched.body) === module.moduleSha256 };
    report.resources.webUi.push(row);
    if (!row.inlineModule || row.inlineStylesheet === false) fail('resource.inline', row);
    if (fetched.status !== 200 || !row.moduleUrl.sha256Match) fail('resource.web-ui-module', row);
  }
  const catalog = await getJson('/api/chat/plugin-ui/catalog');
  for (const item of catalog.items) {
    const row = { plugin: item.id, slots: item.slots };
    for (const kind of ['module', 'stylesheet']) {
      const expected = item[kind + '_sha256'];
      if (!expected) continue;
      const query = new URLSearchParams({ plugin_id: item.id, plugin_revision: item.revision, kind, sha256: expected });
      const fetched = await get('/api/chat/plugin-ui/asset?' + query);
      row[kind] = { status: fetched.status, bytes: fetched.body.length, sha256Match: sha256(fetched.body) === expected };
      if (fetched.status !== 200 || !row[kind].sha256Match) fail('resource.plugin-ui-' + kind, { plugin: item.id, ...row[kind] });
    }
    report.resources.pluginUi.push(row);
  }
  return { boot, catalog };
}

// 页面集合固定；slots 是该页必须挂上的插槽（只核对目录里真有插件声明的那些）。
// expect 列出锚点必须带的样式：background 不得透明、radius 不得为 0；fixed 表示尺寸不随内容变，可比尺寸。
function pageSet(session) {
  const chrome = [
    { key: 'composer', selector: '.composer', expect: ['radius'], fixed: true },
    { key: 'sidebar', selector: '.chat-sidebar', expect: ['background'], fixed: true },
    { key: 'sidebar-search', selector: '.chat-sidebar__search', expect: ['radius'], fixed: true },
  ];
  const settings = [
    { key: 'settings-dialog', selector: '.shell-settings-dialog', expect: ['background', 'radius'], fixed: true },
    { key: 'settings-nav', selector: '.shell-settings-nav', expect: [], fixed: true },
  ];
  return [
    { name: 'home', path: '/', ready: '.composer textarea', anchors: chrome,
      slots: ['composer.toolbar', 'chat.notice', 'navigation.groups'] },
    session && { name: 'conversation', path: '/?session=' + encodeURIComponent(session), ready: '.timeline-output',
      anchors: [...chrome,
        { key: 'user-bubble', selector: '.user-bubble', expect: ['background', 'radius'] },
        { key: 'assistant-text', selector: '.timeline-output .agent-content :is(.markdown-reading, .plain-message-response)', expect: [] },
        { key: 'heading', selector: '.conversation-heading', expect: [], fixed: true }],
      slots: ['header.meta', 'header.end', 'message.meta', 'message.actions', 'turn.after_answer', 'composer.toolbar', 'chat.notice'] },
    { name: 'settings-models', path: '/#models', ready: '.settings-provider-list, .settings-section', anchors: [...settings,
      { key: 'settings-card', selector: '.settings-role-grid', expect: ['background', 'radius'] },
      { key: 'settings-primary-button', selector: '.settings-primary-button', expect: ['background', 'radius'], fixed: true }],
      slots: [] },
    { name: 'settings-plugin', path: '/#' + (args['plugin-route'] ?? 'akasha-settings'), ready: '.shell-settings-body [data-akashic-entry] > *',
      anchors: settings, slots: [] },
    { name: 'narrow', path: '/', ready: '.composer textarea', viewport: { width: 390, height: 844 },
      anchors: [{ key: 'composer', selector: '.composer', expect: ['radius'], fixed: true },
        { key: 'compact-navigation', selector: '.compact-navigation-trigger', expect: [], fixed: true }], slots: [] },
  ].filter(Boolean);
}

async function newContext(browser, viewport) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce',
    locale: 'zh-CN', timezoneId: 'Asia/Tokyo', extraHTTPHeaders: auth });
  await context.addCookies([{ name: 'akashic_theme', value: 'light', url: base }]);
  return context;
}

// 打开页面并记录失败的 js/css 请求与控制台错误；返回 detach，关闭页面前先停止记录，避免把关页取消算进去。
async function openPage(context, name, path, ready) {
  const page = await context.newPage();
  let live = true;
  const asset = request => ['script', 'stylesheet'].includes(request.resourceType())
    || /\/api\/chat\/(plugin-ui\/asset|web-ui\/module)/.test(request.url());
  page.on('requestfailed', request => {
    if (live && asset(request) && !benignCacheProbe(request.url(), request.failure()?.errorText)) report.resources.pageRequests.push({ page: name, url: request.url(), error: request.failure()?.errorText });
  });
  page.on('response', response => {
    if (live && response.status() >= 400 && asset(response.request())) {
      report.resources.pageRequests.push({ page: name, url: response.url(), status: response.status() });
    }
  });
  page.on('console', message => {
    if (live && message.type() === 'error' && !benignCacheProbe(message.location().url, message.text())) {
      report.resources.console.push({ page: name, text: message.text() });
    }
  });
  page.on('pageerror', error => { if (live) report.resources.console.push({ page: name, text: 'pageerror: ' + error.message }); });
  await page.goto(base + path, { waitUntil: 'load', timeout });
  await page.waitForSelector(ready, { timeout });
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  // 插件模块按视口挂载、查询异步返回；等目录更新提示消失后再留一段静默时间。
  await page.waitForFunction(() => ![...document.querySelectorAll('.plugin-ui-slot > p[role=status]')]
    .some(node => node.textContent.includes('正在更新')), undefined, { timeout }).catch(() => undefined);
  await page.waitForTimeout(1500);
  return { page, detach: () => { live = false; } };
}

// 2. 令牌：主题在 :root 上声明的公开令牌必须都解析为非空；样式里无回退引用的 --ak-/--md- 令牌必须能在 :root 解析。
async function checkTokens(page) {
  const tokens = await page.evaluate(() => {
    const declared = new Set();
    const referenced = new Set();
    const walk = rules => {
      for (const rule of rules) {
        if (rule.cssRules) walk(rule.cssRules);
        if (!rule.style) continue;
        if (/(^|,\s*)(:root|html)\b/.test(rule.selectorText ?? '')) {
          for (const name of rule.style) if (/^--(ak|md|chat)-/.test(name)) declared.add(name);
        }
        for (const match of rule.style.cssText.matchAll(/var\(\s*(--(?:ak|md)-[\w-]+)\s*\)/g)) referenced.add(match[1]);
      }
    };
    for (const sheet of document.styleSheets) { try { walk(sheet.cssRules); } catch { /* 跨源样式表不可读 */ } }
    const computed = getComputedStyle(document.documentElement);
    for (const name of computed) if (/^--(ak|md|chat)-/.test(name)) declared.add(name);
    const values = Object.fromEntries([...declared].sort().map(name => [name, computed.getPropertyValue(name).trim()]));
    return { theme: document.documentElement.dataset.theme ?? null, values,
      unresolvedReferences: [...referenced].filter(name => !computed.getPropertyValue(name).trim()).sort() };
  });
  const names = new Set([...Object.keys(tokens.values), ...Object.keys(baseline?.tokens?.values ?? {})]);
  tokens.empty = [...names].filter(name => !tokens.values[name]).sort();
  tokens.count = Object.keys(tokens.values).length;
  if (baseline?.tokens?.values) {
    tokens.changed = [...names].filter(name => tokens.values[name] && baseline.tokens.values[name]
      && tokens.values[name] !== baseline.tokens.values[name]).sort();
  }
  if (tokens.empty.length) fail('tokens.empty', tokens.empty);
  if (tokens.unresolvedReferences.length) fail('tokens.unresolved-reference', tokens.unresolvedReferences);
  report.tokens = tokens;
}

// 3a. 插件样式真的进了页面：外壳模块的 @scope 样式有规则，聊天插件的 <link> 已加载且有规则。
async function checkInstalledStyles(page, boot, catalog) {
  const shell = boot.modules.filter(module => module.stylesheetSha256).map(module => ({ plugin: module.pluginId, scope: module.stylesheetSha256 }));
  const chat = catalog.items.filter(item => item.stylesheet_sha256).map(item => ({ plugin: item.id, sha256: item.stylesheet_sha256 }));
  const result = await page.evaluate(({ shell, chat }) => ({
    shell: shell.map(({ plugin, scope }) => {
      const node = [...document.querySelectorAll('style[data-akashic-module-style]')]
        .find(style => style.textContent.startsWith('@scope ([data-akashic-style="' + scope + '"])'));
      const rules = node?.sheet?.cssRules?.[0]?.cssRules?.length ?? 0;
      return { plugin, installed: Boolean(node), rules };
    }),
    chat: chat.map(({ plugin, sha256 }) => {
      const node = document.querySelector('link[data-plugin-ui="' + CSS.escape(plugin) + '"]');
      let rules = 0;
      try { rules = node?.sheet?.cssRules?.length ?? 0; } catch { rules = -1; }
      return { plugin, installed: Boolean(node?.href.includes(sha256)), rules };
    }),
  }), { shell, chat });
  report.resources.installedStyles = result;
  for (const row of [...result.shell, ...result.chat]) {
    if (!row.installed || row.rules <= 0) fail('style.not-applied', row, 'home');
  }
}

// 3b. 锚点：固定选择器加上每个插件插槽根、每个外壳条目根，抓计算样式与可见尺寸。
async function captureAnchors(page, specs, catalog) {
  const declared = Object.fromEntries(catalog.items.map(item => [item.id, item.slots]));
  return page.evaluate(([specs, declared]) => {
    const props = ['fontFamily', 'fontSize', 'color', 'backgroundColor', 'borderRadius', 'padding', 'display'];
    const measure = (element, spec) => {
      const style = getComputedStyle(element);
      const range = document.createRange();
      range.selectNodeContents(element);
      const box = element.getBoundingClientRect();
      const content = range.getBoundingClientRect();
      // 固定布局只量自身盒子：侧栏这类滚动容器的内容高度随会话数量变化，不是样式。
      const width = Math.round(spec.fixed ? box.width : Math.max(box.width, content.width));
      const height = Math.round(spec.fixed ? box.height : Math.max(box.height, content.height));
      const result = { ...Object.fromEntries(props.map(name => [name, style[name]])), width, height,
        ...(spec.fixed ? { sizeMode: 'box' } : {}), ...spec };
      // 插件根自身常不带样式；前 6 个出盒后代的盒模型签名能反映插件样式表是否生效。
      if (spec.plugin) {
        result.subtree = [...element.querySelectorAll('*')].filter(node => !(node instanceof SVGElement))
          .map(node => [node, getComputedStyle(node)]).filter(([, css]) => css.display !== 'contents').slice(0, 6)
          .map(([node, css]) => [node.tagName.toLowerCase(), css.display, css.padding, css.borderRadius,
            css.backgroundColor, css.fontSize, css.gap].join(' ')).join(' | ');
      }
      return result;
    };
    // 插件根常是 display: contents 的包装层，没有自己的盒子；往下找第一个真正出盒的元素。
    const boxed = element => {
      while (element && getComputedStyle(element).display === 'contents') element = element.firstElementChild;
      return element;
    };
    const anchors = {};
    for (const spec of specs) {
      const element = document.querySelector(spec.selector);
      anchors[spec.key] = element ? measure(element, { selector: spec.selector, expect: spec.expect, fixed: Boolean(spec.fixed) })
        : { missing: true, selector: spec.selector, expect: spec.expect };
    }
    for (const host of document.querySelectorAll('.plugin-ui-host[data-plugin]')) {
      const slots = declared[host.dataset.plugin] ?? [];
      const slot = host.closest('[data-slot]')?.dataset.slot ?? (slots.length === 1 ? slots[0] : 'mount');
      const key = 'slot:' + slot + ':' + host.dataset.plugin;
      const root = boxed(host.firstElementChild);
      if (root && !anchors[key]) anchors[key] = measure(root, { expect: [], plugin: true });
    }
    for (const host of document.querySelectorAll('[data-akashic-module][data-akashic-entry]')) {
      const key = 'entry:' + host.dataset.akashicModule + ':' + host.dataset.akashicEntry;
      const root = boxed(host.firstElementChild);
      if (root && !anchors[key] && host.getClientRects().length) anchors[key] = measure(root, { expect: [], plugin: true });
    }
    return anchors;
  }, [specs, declared]);
}

const DEFAULT_FONT = /^("?Times New Roman"?|Times|serif)$/i;
const TRANSPARENT = 'rgba(0, 0, 0, 0)';
const STYLE_KEYS = ['fontFamily', 'fontSize', 'color', 'backgroundColor', 'borderRadius', 'padding', 'display', 'subtree'];

// 判定锚点：缺失、回落到浏览器默认值；有基线时样式逐项一致，固定尺寸锚点尺寸偏差不超过 max(24px, 25%)。
function judgeAnchors(name, anchors) {
  const previous = baseline?.anchors?.[name];
  for (const [key, anchor] of Object.entries(anchors)) {
    if (anchor.missing) { fail('anchor.missing', { key, selector: anchor.selector }, name); continue; }
    if (DEFAULT_FONT.test(anchor.fontFamily.trim())) fail('anchor.default-font', { key, fontFamily: anchor.fontFamily }, name);
    if (anchor.expect.includes('background') && anchor.backgroundColor === TRANSPARENT) {
      fail('anchor.default-background', { key }, name);
    }
    if (anchor.expect.includes('radius') && /^0px$/.test(anchor.borderRadius)) fail('anchor.default-radius', { key }, name);
    if (!anchor.plugin && anchor.width * anchor.height === 0) fail('anchor.zero-size', { key }, name);
  }
  if (!previous) return;
  for (const [key, before] of Object.entries(previous)) {
    const now = anchors[key];
    if (before.missing) continue;
    if (!now || now.missing) { fail('anchor.disappeared', { key }, name); continue; }
    const diff = STYLE_KEYS.filter(prop => before[prop] !== now[prop])
      .map(prop => ({ prop, baseline: before[prop], now: now[prop] }));
    // 旧基线按内容范围量固定布局，与按盒子量的结果不可比，只比样式。
    if (before.fixed && before.sizeMode === now.sizeMode) {
      for (const prop of ['width', 'height']) {
        if (Math.abs(before[prop] - now[prop]) > Math.max(24, before[prop] * 0.25)) diff.push({ prop, baseline: before[prop], now: now[prop] });
      }
    } else if (before.width * before.height > 0 && now.width * now.height === 0) {
      diff.push({ prop: 'size', baseline: [before.width, before.height], now: [now.width, now.height] });
    }
    if (diff.length) fail('anchor.changed', { key, diff }, name);
  }
}

// 4. 插槽：目录里声明了本页插槽的插件必须挂出宿主节点，且没有加载错误提示；有基线时原本可见的不能变为空。
async function checkSlots(page, name, required, catalog) {
  // 侧栏、会话列表在数据多时加载更慢：期限内等本页必需插槽都挂出宿主节点再判定，超时照常按缺失报告。
  const expected = catalog.items.flatMap(item => item.slots.filter(slot => required.includes(slot)).map(slot => [item.id, slot]));
  await page.waitForFunction(pairs => pairs.every(([plugin, slot]) => [...document.querySelectorAll('.plugin-ui-host[data-plugin]')]
    .some(host => host.dataset.plugin === plugin && (host.closest('[data-slot]')?.dataset.slot ?? slot) === slot)),
  expected, { timeout }).catch(() => undefined);
  const observed = await page.evaluate(() => ({
    hosts: [...document.querySelectorAll('.plugin-ui-host[data-plugin]')].map(host => {
      const range = document.createRange();
      range.selectNodeContents(host);
      const box = range.getBoundingClientRect();
      return { plugin: host.dataset.plugin, slot: host.closest('[data-slot]')?.dataset.slot ?? null,
        hidden: host.hidden, width: Math.round(box.width), height: Math.round(box.height) };
    }),
    notices: [...document.querySelectorAll('.plugin-ui-slot > p[role=status], .plugin-ui-slot [role=alert], .web-host-entry-error')]
      .map(node => node.textContent.trim()).concat([...document.querySelectorAll('.plugin-ui-host[hidden] + p[role=status]')]
        .map(node => node.textContent.trim())),
  }));
  for (const notice of observed.notices) fail('slot.error-notice', notice, name);
  for (const item of catalog.items) {
    for (const slot of item.slots) {
      const hosts = observed.hosts.filter(host => host.plugin === item.id && (host.slot === slot || host.slot === null));
      const visible = hosts.filter(host => !host.hidden && host.width * host.height > 0);
      const isRequired = required.includes(slot);
      const status = visible.length ? 'rendered' : hosts.length ? 'mounted-empty' : isRequired ? 'missing' : 'not-on-page';
      const size = visible[0] ? [visible[0].width, visible[0].height] : [0, 0];
      report.slots.push({ page: name, plugin: item.id, slot, required: isRequired, status, size });
      if (isRequired && !hosts.length) fail('slot.missing', { plugin: item.id, slot }, name);
      const before = baseline?.slots?.find(row => row.page === name && row.plugin === item.id && row.slot === slot);
      if (isRequired && before?.status === 'rendered' && status !== 'rendered') {
        fail('slot.collapsed', { plugin: item.id, slot, baseline: before.size, now: size }, name);
      }
    }
  }
}

// 5. 截图差异只记录：在浏览器画布里逐像素比较，任一通道差超过 16 算不同。
async function screenshotDiff(browser, name, file) {
  const previous = args.baseline && resolve(args.baseline, 'screenshots', name + '.png');
  if (!previous || !existsSync(previous)) return null;
  const page = await browser.newPage();
  try {
    return await page.evaluate(async ([left, right]) => {
      const load = async source => createImageBitmap(await (await fetch('data:image/png;base64,' + source)).blob());
      const [a, b] = await Promise.all([load(left), load(right)]);
      if (a.width !== b.width || a.height !== b.height) return { ratio: 1, note: 'size changed' };
      const pixels = image => {
        const canvas = new OffscreenCanvas(image.width, image.height);
        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);
        return context.getImageData(0, 0, image.width, image.height).data;
      };
      const [pa, pb] = [pixels(a), pixels(b)];
      let differing = 0;
      for (let index = 0; index < pa.length; index += 4) {
        if (Math.abs(pa[index] - pb[index]) > 16 || Math.abs(pa[index + 1] - pb[index + 1]) > 16
          || Math.abs(pa[index + 2] - pb[index + 2]) > 16) differing++;
      }
      return { ratio: Number((differing / (pa.length / 4)).toFixed(6)), differing };
    }, [readFileSync(previous).toString('base64'), readFileSync(file).toString('base64')]);
  } finally { await page.close(); }
}

// 6. 真实发送：新会话发一条消息，等助手回复完成并渲染出可见文字；返回会话 key 供对话页使用。
async function sendMessage(context) {
  const { page, detach } = await openPage(context, 'send', '/', '.composer textarea');
  const started = Date.now();
  try {
    await page.fill('.composer textarea', SEND_TEXT);
    await page.keyboard.press('Enter');
    await page.waitForFunction(text => {
      const sent = [...document.querySelectorAll('.timeline-input')].find(node => node.textContent.includes(text));
      const REPLY = '.timeline-output .agent-content :is(.markdown-reading, .plain-message-response)';
      const reply = [...document.querySelectorAll(REPLY)].at(-1);
      const busy = document.querySelector('.composer-action-button')?.dataset.mode === 'stop';
      const after = sent && reply && sent.compareDocumentPosition(reply) & Node.DOCUMENT_POSITION_FOLLOWING;
      return Boolean(after) && !busy && Boolean(reply.textContent.trim());
    }, SEND_TEXT, { timeout: Math.max(timeout, 60_000) });
    const result = await page.evaluate(() => {
      const REPLY = '.timeline-output .agent-content :is(.markdown-reading, .plain-message-response)';
      const reply = [...document.querySelectorAll(REPLY)].at(-1);
      const box = reply.getBoundingClientRect();
      return { session: sessionStorage.getItem('akashic.chat.active-session'), reply: reply.textContent.trim().slice(0, 200),
        fontFamily: getComputedStyle(reply).fontFamily, size: [Math.round(box.width), Math.round(box.height)],
        errors: [...document.querySelectorAll('.timeline-output .error-line')].map(node => node.textContent.trim()) };
    });
    report.send = { ok: true, seconds: (Date.now() - started) / 1000, ...result };
    if (!result.session) fail('send.no-session', result);
    if (result.errors.length || result.size[0] * result.size[1] === 0 || DEFAULT_FONT.test(result.fontFamily)) {
      fail('send.reply-not-rendered', result);
    }
    await page.screenshot({ path: resolve(out, 'screenshots', 'send.png') });
    return result.session;
  } catch (error) {
    report.send = { ok: false, error: error.message };
    fail('send.no-reply', error.message);
    await page.screenshot({ path: resolve(out, 'screenshots', 'send-failed.png') }).catch(() => undefined);
    return null;
  } finally { detach(); await page.close(); }
}

async function latestSession() {
  const sessions = await getJson('/api/chat/sessions?limit=1');
  return sessions.items?.[0]?.key ?? null;
}

async function main() {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? chromium.executablePath(),
    headless: true, args: ['--no-sandbox', '--no-proxy-server', '--hide-scrollbars', '--font-render-hinting=none'] });
  try {
    const { boot, catalog } = await checkResources();
    report.resources.catalog = { snapshotId: boot.snapshotId, catalogId: boot.catalogId, catalogRevision: catalog.catalog_revision };
    const desktop = await newContext(browser, { width: 1440, height: 900 });
    const session = args.send ? await sendMessage(desktop) : args.session ?? await latestSession();
    report.session = session;
    if (!session) report.notes = ['没有可用会话，跳过对话页；加 --send 或 --session 可覆盖'];
    for (const spec of pageSet(session)) {
      const context = spec.viewport ? await newContext(browser, spec.viewport) : desktop;
      let opened;
      try {
        opened = await openPage(context, spec.name, spec.path, spec.ready);
      } catch (error) {
        fail('page.not-ready', { ready: spec.ready, error: error.message.split('\n')[0] }, spec.name);
        if (spec.viewport) await context.close();
        continue;
      }
      const { page, detach } = opened;
      if (spec.name === 'home') {
        await checkTokens(page);
        await checkInstalledStyles(page, boot, catalog);
      }
      const anchors = await captureAnchors(page, spec.anchors, catalog);
      report.anchors[spec.name] = anchors;
      judgeAnchors(spec.name, anchors);
      await checkSlots(page, spec.name, spec.slots, catalog);
      const file = resolve(out, 'screenshots', spec.name + '.png');
      await page.mouse.move(0, 0);
      await page.screenshot({ path: file, animations: 'disabled', caret: 'hide' });
      report.screenshots[spec.name] = { file, diff: await screenshotDiff(browser, spec.name, file) };
      detach();
      await page.close();
      if (spec.viewport) await context.close();
    }
    await desktop.close();
  } catch (error) {
    fail('probe.error', error.stack ?? String(error));
  } finally {
    await browser.close();
  }
  for (const request of report.resources.pageRequests) fail('resource.page-request', request, request.page);
  for (const message of report.resources.console) fail('console.error', message.text, message.page);
  report.pass = report.failures.length === 0;
  report.finishedAt = new Date().toISOString();
  writeFileSync(resolve(out, 'report.json'), JSON.stringify(report, null, 2));
  console.log((report.pass ? 'PASS' : 'FAIL') + ' ' + resolve(out, 'report.json'));
  for (const failure of report.failures) console.log('  - ' + failure.check + (failure.page ? ' [' + failure.page + ']' : '') + ' ' + JSON.stringify(failure.detail).slice(0, 300));
  process.exitCode = report.pass ? 0 : 1;
}

await main();
