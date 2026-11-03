// Shared helpers for the local browser tests. Nothing here ships: tools/ is excluded from the deployment.
import { chromium } from 'playwright-core';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.join(HERE, '..', '..');
export const SHOTS = path.join(HERE, 'shots');
export const sleep = ms => new Promise(r => setTimeout(r, ms));
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json', '.ico': 'image/x-icon' };

// Test seam: the page keeps its internals private, so the test server adds an inspection hook to its own copy of index.html.
const HOOK_AT = 'requestAnimationFrame(frame);\n})();';
const HOOK = 'requestAnimationFrame(frame);\nwindow.__wand = { st, WANDS, wandDist, REACT, cam, pickReact, showResult, v3 };\n})();';

export function serve() {
  return new Promise(resolve => {
    const srv = http.createServer((req, res) => {
      const p = decodeURIComponent(new URL(req.url, 'http://x').pathname), file = path.join(ROOT, p === '/' ? 'index.html' : p);
      if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
      let body = fs.readFileSync(file);
      if (file.endsWith('index.html')) { const html = body.toString('utf8'); if (!html.includes(HOOK_AT)) throw new Error('test hook anchor not found in index.html'); body = html.replace(HOOK_AT, HOOK); }
      res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' }); res.end(body);
    }).listen(0, '127.0.0.1', () => resolve({ srv, url: `http://localhost:${srv.address().port}/` }));
  });
}

const live = new Set();
export const closeAll = () => Promise.all([...live].map(b => b.close().catch(() => { })));
// A separate headless Chrome per scenario, so the owner's browser tabs stay untouched.
export async function open(url, { video, fakeCam = !!video, grant = fakeCam, viewport = { width: 1440, height: 900 }, mobile = false, userAgent, init, route } = {}) {
  const args = ['--autoplay-policy=no-user-gesture-required', '--disable-renderer-backgrounding', '--disable-background-timer-throttling', '--disable-backgrounding-occluded-windows', '--use-angle=metal', '--ignore-gpu-blocklist', '--enable-gpu'];
  if (fakeCam) args.push('--use-fake-device-for-media-stream');
  if (video) args.push('--use-file-for-fake-video-capture=' + path.join(HERE, 'fixtures', video));
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args });
  live.add(browser);
  const ctx = await browser.newContext({ viewport, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 2 : 1, userAgent, permissions: grant ? ['camera'] : [] });
  const page = await ctx.newPage(), errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !/ERR_FAILED|ERR_ABORTED|favicon/.test(m.text() + m.location().url)) errors.push('console: ' + m.text()); });
  if (init) await page.addInitScript(init);
  if (route) await route(page);
  await page.goto(url, { waitUntil: 'load' });
  return { browser, page, errors };
}
export const note = page => page.evaluate(() => ({ head: document.querySelector('#nHand').textContent, instr: document.querySelector('#nInstr').textContent, status: document.querySelector('#nStatus').textContent, btns: [...document.querySelectorAll('#nBtns button')].map(b => b.textContent) }));
export const camState = page => page.evaluate(() => { const { cam, st } = __wand; return { input: st.input, on: cam.on, stream: !!cam.stream, fps: +(cam.fps || 0).toFixed(1), attempt: st.attempt, waves: st.obs.length, cap: st.cap ? (st.cap.active ? 'active' : 'armed') : 'none', help: !!st.camHelp }; });
export const resultShown = page => page.evaluate(() => document.querySelector('#result').classList.contains('show'));
export const traits = page => page.evaluate(() => __wand.st.obs.map(o => ['speed', 'amp', 'sharp', 'flow', 'curl'].map(k => o[k].toFixed(2)).join(' ') + ` len=${Math.round(o.len)} dur=${o.dur.toFixed(2)}`));
export async function enter(page) { await page.evaluate(() => document.querySelector('#cta').click()); // the button pulses forever, so it never counts as stable for page.click
  await page.waitForFunction(() => document.querySelectorAll('#nBtns button').length > 0, null, { timeout: 30000 }); }
export const clickBtn = (page, re) => page.evaluate(s => { const b = [...document.querySelectorAll('#nBtns button')].find(x => new RegExp(s, 'i').test(x.textContent)); if (!b) return false; b.click(); return true; }, re);
export const chooseCamera = page => clickBtn(page, 'камер|camera');
export const choosePointer = page => clickBtn(page, 'мишкою|mouse');
export const recordReactions = page => page.evaluate(() => { window.__reacts = []; const { REACT } = __wand; for (const k of Object.keys(REACT)) { const f = REACT[k]; REACT[k] = c => { __reacts.push(k); return f(c); }; } });
export async function pointerWave(page, { width, height }, wiggle = 1) {
  const cx = width / 2, cy = height * .36, A = Math.min(width, height) * .36;
  await page.mouse.move(cx - A, cy); await page.mouse.down();
  for (let i = 1; i <= 36; i++) { const u = i / 36; await page.mouse.move(cx - A + 2 * A * u, cy + Math.sin(u * 6.28 * (1 + wiggle)) * A * .6); await sleep(14); }
  await page.mouse.up();
}
export async function pointerGame(page, viewport, timeout = 150000, onWave) {
  const t0 = Date.now(); let waves = 0;
  while (!(await resultShown(page)) && Date.now() - t0 < timeout) {
    const armed = await page.evaluate(() => document.querySelector('#stage').classList.contains('on') && __wand.st.cap && !__wand.st.cap.active);
    if (armed) { await sleep(300); if (onWave) await onWave(waves); await pointerWave(page, viewport); waves++; }
    await sleep(150);
  }
  return { waves, done: await resultShown(page) };
}
export function ensureShots() { fs.mkdirSync(SHOTS, { recursive: true }); return SHOTS; }
