// Sound starts on the entry tap and the choice is remembered. Launches its own Chrome with the autoplay policy of a normal browser, because lib.mjs turns that policy off.
//   node tools/e2e/sound.mjs
import { chromium } from 'playwright-core';
import { serve, sleep } from './lib.mjs';
const { srv, url } = await serve(), fails = [];
const check = (ok, what) => { console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) fails.push(what); };
const SPY = `window.__ac = []; window.__played = 0; { const AC = window.AudioContext;
  window.AudioContext = class extends AC { constructor(...a) { super(...a); __ac.push(this); } createOscillator() { __played++; return super.createOscillator(); } createBufferSource() { __played++; return super.createBufferSource(); } }; }`;
const state = page => page.evaluate(() => ({ made: __ac.length, ctx: __ac[0] ? __ac[0].state : null, played: __played, label: document.querySelector('#snd').getAttribute('aria-label'), stored: localStorage.getItem('wand-sound') }));
const inShop = page => page.waitForFunction(() => document.querySelectorAll('#nBtns button').length > 0, null, { timeout: 30000 });

// Playwright's page.evaluate counts as a user gesture, so before the entry tap these pages only get real input from coordinates measured on another page.
for (const [name, opts] of [['phone', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }], ['desktop', { viewport: { width: 1440, height: 900 } }]]) {
  console.log('== ' + name);
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--autoplay-policy=document-user-activation-required'] });
  const fresh = async (init = SPY) => { const ctx = await browser.newContext({ ...opts, locale: 'uk-UA' }); await ctx.addInitScript(init); const page = await ctx.newPage(); await page.goto(url, { waitUntil: 'load' }); return page; };
  const at = async (page, sel) => { const r = await page.locator(sel).boundingBox(); return [r.x + r.width / 2, r.y + r.height / 2]; };
  const press = (page, [x, y]) => opts.hasTouch ? page.touchscreen.tap(x, y) : page.mouse.click(x, y);

  let page = await fresh(); await sleep(500);
  const cta = await at(page, '#cta'), snd = await at(page, '#snd');
  let s = await state(page);
  check(s.made === 0 && s.played === 0, 'street: nothing plays before a tap');
  check(s.label === 'Вимкнути звук', 'street: the toggle already shows sound on');
  await page.context().close();

  page = await fresh(SPY + `addEventListener('load', () => { const c = new AudioContext(); setTimeout(() => { window.__control = c.state; }, 300); });`); await sleep(800);
  check(await page.evaluate(() => __control) === 'suspended', 'control: the browser blocks sound before a tap');
  await page.context().close();

  page = await fresh(); await sleep(500);
  await press(page, cta); await inShop(page); await sleep(300); s = await state(page);
  check(s.ctx === 'running' && s.played > 0, `entry tap starts sound: ${s.ctx}, ${s.played} sounds`);
  await page.context().close();

  page = await fresh(); await sleep(300);
  await press(page, snd); await sleep(200); s = await state(page);
  check(s.played === 0 && s.stored === '0' && s.label === 'Увімкнути звук', 'turning it off on the street makes no noise and is stored');
  await page.reload({ waitUntil: 'load' }); await sleep(300); s = await state(page);
  check(s.label === 'Увімкнути звук', 'the choice survives a reload');
  await press(page, cta); await inShop(page); await sleep(500); s = await state(page);
  check(s.played === 0, 'entering with sound off stays silent');
  await press(page, snd); await sleep(300); s = await state(page);
  check(s.ctx === 'running' && s.played > 0 && s.stored === '1' && s.label === 'Вимкнути звук', 'turning it back on plays and is stored');
  await browser.close();
}
srv.close();
console.log(fails.length ? `\n${fails.length} FAILED:\n- ${fails.join('\n- ')}` : '\nall passed');
process.exit(fails.length ? 1 : 0);
