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
await closeAll(); srv.close();
console.log(fails.length ? `\n${fails.length} FAILED:\n- ${fails.join('\n- ')}` : '\nall passed');
process.exit(fails.length ? 1 : 0);
