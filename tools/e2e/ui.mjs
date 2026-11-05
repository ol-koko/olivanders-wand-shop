// Layout of the first screens across phone and desktop widths.
//   node tools/e2e/ui.mjs
import path from 'node:path';
import { closeAll, serve, open, enter, ensureShots, sleep } from './lib.mjs';
const SHOTS = ensureShots(), { srv, url } = await serve(), fails = [];
const check = (ok, what) => { console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) fails.push(what); };
for (const [w, h] of [[320, 568], [360, 740], [390, 844], [430, 932], [768, 1024], [1440, 900], [844, 390]]) {
  const mobile = w < 1000;
  const { browser, page, errors } = await open(url, { viewport: { width: w, height: h }, mobile });
  await sleep(400);
  const samples = [];
  for (let i = 0; i < 6; i++) { samples.push(await page.evaluate(() => { const r = document.querySelector('#cta').getBoundingClientRect(); return (r.left + r.right) / 2 - innerWidth / 2; })); await sleep(350); }
  const off = Math.max(...samples.map(Math.abs));
  check(off < 1, `${w}×${h}: main button centred, off by ${off.toFixed(2)}px while pulsing`);
  if (w === 390) await page.screenshot({ path: path.join(SHOTS, 'ui-street.png') });
  await enter(page); await sleep(500);
  const b = await page.$$eval('#nBtns button', e => e.map(x => { const r = x.getBoundingClientRect(); return { t: x.textContent, w: Math.round(r.width), h: Math.round(r.height), ghost: x.classList.contains('ghost') }; }));
  check(b.length === 2 && b[0].w === b[1].w, `${w}: both choices are ${b[0].w}px / ${b[1].w}px wide`);
  check(/камер|camera/i.test(b[0].t) && !b[0].ghost && b[1].ghost, `${w}: hand is the accent, finger or mouse is secondary`);
  const fit = await page.$$eval('#nBtns button', e => e.every(x => x.scrollWidth <= x.clientWidth + 1 && x.getBoundingClientRect().right <= innerWidth));
  check(fit, `${w}: labels fit`);
  if (w === 390 || w === 1440) await page.screenshot({ path: path.join(SHOTS, `ui-intro-${w}.png`) });
  check(!errors.length, 'no page errors ' + errors.join(' | ')); await browser.close();
}
console.log('== title stays clear of the shop sign on short screens');
for (const [w, h] of [[1440, 600], [1280, 640], [1024, 600], [1920, 600], [1100, 700], [844, 390], [390, 844]]) {
  const { page } = await open(url, { viewport: { width: w, height: h }, mobile: w < 1000 });
  for (const l of ['ua', 'en']) {
    await page.evaluate(x => document.querySelector(`#lang button[data-l="${x}"]`).click(), l); await sleep(350);
    const g = await page.evaluate(() => { const t = document.querySelector('#stTitle').getBoundingClientRect(), b = document.querySelector('#svgShop rect[y="490"]').getBoundingClientRect(), roof = document.querySelector('#svgShop polygon').getBoundingClientRect(), c = document.querySelector('#cta').getBoundingClientRect(); return { gap: Math.round(b.top - t.bottom), roofGap: Math.round(roof.top - t.bottom), sign: Math.round(b.bottom), cta: Math.round(c.top), inside: b.left >= -1 && b.right <= innerWidth + 1 }; });
    check(g.gap >= 0 && g.roofGap >= -8, `${w}×${h} ${l}: clear of the sign by ${g.gap}px, of the roof by ${g.roofGap}px, sign ends at ${g.sign}, button starts at ${g.cta}`);
    check(g.sign <= g.cta, `${w}×${h} ${l}: button stays below the sign`);
  }
  if (h <= 600 || h === 844) await page.screenshot({ path: path.join(SHOTS, `ui-title-${w}x${h}.png`) });
  await page.context().browser().close();
}
console.log('== nothing overlaps on small phones, every wand fits');
await closeAll();
const box = (page, sel) => page.evaluate(q => { const r = document.querySelector(q).getBoundingClientRect(); return { l: r.left, t: r.top, r: r.right, b: r.bottom }; }, sel);
const hit = (a, b) => a.l < b.r && b.l < a.r && a.t < b.b && b.t < a.b;
for (const [w, h] of [[320, 568], [360, 640], [360, 662], [390, 844], [412, 780], [430, 932], [1440, 900]]) {
  const { browser, page, errors } = await open(url, { viewport: { width: w, height: h }, mobile: w < 768 });
  await page.evaluate(() => document.fonts.ready); await sleep(400);
  for (const l of ['ua', 'en']) {
    await page.evaluate(x => document.querySelector(`#lang button[data-l="${x}"]`).click(), l); await sleep(60);
    const top = await box(page, '.topbar'), title = await box(page, '#stT'), sub = await box(page, '#stS'), cta = await box(page, '#cta'), fan = await box(page, '#stFan');
    check(!hit(top, title) && !hit(top, sub), `${w}×${h} ${l}: the top buttons clear the title`);
    const words = await page.evaluate(() => { const r = document.createRange(); r.selectNodeContents(document.querySelector('#stFan')); const b = r.getBoundingClientRect(); return b.top; });
    check(cta.b <= words, `${w}×${h} ${l}: the button clears the fan notice`);
    check(fan.b <= h + 1, `${w}×${h} ${l}: the fan notice stays on screen`);
  }
  await page.evaluate(() => { document.querySelector('#street').hidden = true; });
  const bad = await page.evaluate(async () => { const { st, WANDS, showResult } = __wand, out = []; st.traits = { speed: .5, amp: .5, sharp: .5, flow: .5, curl: .5 }; st.tried = []; const res = document.querySelector('#result'), bar = document.querySelector('.topbar').getBoundingClientRect();
    for (const l of ['ua', 'en']) { document.querySelector(`#lang button[data-l="${l}"]`).click(); for (const w of WANDS) { st.winner = w; showResult(); await new Promise(r => setTimeout(r, 20)); const kick = document.querySelector('#rKicker').getBoundingClientRect(), over = res.scrollHeight - res.clientHeight; if (over > 1 || kick.top < bar.bottom) out.push(`${w.id} ${l} over ${over}`); } } return out; });
  for (const l of ['ua', 'en']) { const heights = await page.evaluate(async x => { document.querySelector(`#lang button[data-l="${x}"]`).click(); await new Promise(r => setTimeout(r, 40)); return [...document.querySelectorAll('.r-btns button:not([hidden])')].map(b => b.getBoundingClientRect().height); }, l); check(heights.every(v => v < 50), `${w}×${h} ${l}: the card buttons stay on one line: ${heights.map(Math.round).join('/')}`); }
  check(!bad.length, `${w}×${h}: all 16 cards fit under the top buttons, both languages ${bad.join(', ')}`);
  check(!errors.length, 'no page errors ' + errors.join(' | '));
  await browser.close();
}
{ const { browser, page } = await open(url, { viewport: { width: 844, height: 390 }, mobile: true });
  await page.evaluate(() => { const { st, WANDS, showResult } = __wand; document.querySelector('#street').hidden = true; st.winner = WANDS[0]; st.traits = { speed: .5, amp: .5, sharp: .5, flow: .5, curl: .5 }; st.tried = []; showResult(); }); await sleep(300);
  await page.evaluate(() => { document.querySelector('#result').scrollTop = 200; }); await sleep(400);
  check(await page.evaluate(() => getComputedStyle(document.querySelector('.topbar')).opacity === '0'), 'landscape: the top buttons step aside while the card scrolls');
  await page.evaluate(() => { document.querySelector('#result').scrollTop = 0; }); await sleep(400);
  check(await page.evaluate(() => getComputedStyle(document.querySelector('.topbar')).opacity === '1'), 'landscape: they come back at the top');
  await browser.close(); }
await closeAll(); srv.close();
console.log(fails.length ? `\n${fails.length} FAILED:\n- ${fails.join('\n- ')}` : '\nall passed');
process.exit(fails.length ? 1 : 0);
