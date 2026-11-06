// The house card: the 3D wand when the player has one, the stamped seal with its shimmer, and the link to the shop.
//   node tools/e2e/housecard.mjs
import { closeAll, serve, open, sleep } from './lib.mjs';
const { srv, url } = await serve(), fails = [];
const check = (ok, what) => { console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) fails.push(what); };
const WAND = `localStorage.setItem('wand-last', JSON.stringify({ id: 'hermione', traits: { speed: .5, amp: .5, sharp: .5, flow: .5, curl: .5 }, at: Date.now() }));`;
const QUIET = `localStorage.setItem('wand-sound', '0');`;
const SPY = `window.__osc = []; { const AC = window.AudioContext; window.AudioContext = class extends AC { createOscillator() { __osc.push(performance.now()); return super.createOscillator(); } }; }`;
async function toCard(page, l = 'ua') {
  await page.evaluate(x => document.querySelector(`#lang button[data-l="${x}"]`).click(), l);
  await page.evaluate(() => document.querySelector('#cta').click()); await page.waitForFunction(() => __hall.st.phase === 'establish', null, { timeout: 25000 }); await page.keyboard.press('Shift');
  await page.waitForFunction(() => __hall.st.phase === 'hall' && document.querySelector('#nBtns button'), null, { timeout: 25000 });
  await page.evaluate(() => { __hall.st.answers = ['G', 'SR', 'H']; __hall.showWish(true); }); await page.waitForFunction(() => document.querySelector('#nBtns .wide'), null, { timeout: 10000 });
  await page.evaluate(() => { window.__marks = []; new MutationObserver(() => { const s = document.querySelector('#rSeal'), c = document.querySelector('.rcard'); if (s.classList.contains('stamp') && !__marks.includes('stamp')) __marks.push('stamp', performance.now()); if (c.classList.contains('thud') && !__marks.includes('thud')) __marks.push('thud', performance.now()); }).observe(document.querySelector('#result'), { attributes: true, subtree: true }); document.querySelectorAll('#nBtns .wide')[0].click(); });
  await page.waitForFunction(() => document.querySelector('#result').classList.contains('show'), null, { timeout: 25000 });
}

for (const [w, h] of [[390, 844], [1440, 900]]) for (const l of ['ua', 'en']) {
  console.log(`== ${w}×${h} ${l}`);
  { const { browser, page, errors } = await open(url + 'sorting', { viewport: { width: w, height: h }, mobile: w < 768, init: WAND + QUIET });
    await toCard(page, l); await page.waitForFunction(() => document.querySelector('#rStage').classList.contains('is3d'), null, { timeout: 30000 }).catch(() => { });
    const r = await page.evaluate(() => ({ is3d: document.querySelector('#rStage').classList.contains('is3d'), stage: !document.querySelector('#rStage').hidden, link: !document.querySelector('#rToShop').hidden, spec: document.querySelector('#rSpecs').textContent }));
    check(r.stage && r.is3d && !r.link && /Герміони|Hermione/.test(r.spec), `with a wand: the 3D wand, no shop link (${r.spec})`);
    const box = await page.evaluate(() => { const b = document.querySelector('#rWand3d').getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2]; });
    await page.waitForFunction(() => !__hall.v3.spin, null, { timeout: 15000 }).catch(() => { }); const y0 = await page.evaluate(() => __hall.v3.yaw);
    await page.mouse.move(box[0], box[1]); await page.mouse.down(); await page.mouse.move(box[0] + 90, box[1], { steps: 6 }); await page.mouse.up();
    check(Math.abs(await page.evaluate(() => __hall.v3.yaw) - y0) > .5, 'dragging spins the wand');
    const seal = await page.evaluate(() => { const s = document.querySelector('#rSeal'), c = document.querySelector('.rcard').getBoundingClientRect(), b = s.getBoundingClientRect(), bar = document.querySelector('.topbar').getBoundingClientRect(); return { inside: b.top >= c.top && b.bottom <= c.bottom && b.left >= c.left, clear: b.bottom <= bar.top || b.top >= bar.bottom || b.right <= bar.left, shine: getComputedStyle(s.querySelector('.shine')).animationName, op: +getComputedStyle(s).opacity }; });
    check(seal.inside && seal.clear && seal.op === 1, 'the seal sits on the card, clear of the top buttons');
    check(seal.shine === 'shine', 'a gold shimmer sweeps across it');
    const m = await page.evaluate(() => __marks); check(m[0] === 'stamp' && m[2] === 'thud' && m[3] - m[1] > 300 && m[3] - m[1] < 700, `stamped, then the card shakes on impact (${Math.round(m[3] - m[1])} ms)`);
    check(!errors.length, 'no page errors ' + errors.join(' | ')); await browser.close(); }
  { const { browser, page, errors } = await open(url + 'sorting', { viewport: { width: w, height: h }, mobile: w < 768, init: QUIET });
    await toCard(page, l); await sleep(1600);
    const r = await page.evaluate(() => { const a = document.querySelector('#rToShop'), cs = getComputedStyle(a); return { stage: !document.querySelector('#rStage').hidden, link: !a.hidden, text: a.textContent, deco: cs.textDecorationLine, color: cs.color, seal: document.querySelector('#rSeal').getBoundingClientRect().height }; });
    check(!r.stage && r.link && r.seal > 120, `without a wand: a big seal and the link: ${r.text}`);
    check(r.deco === 'none' && /232, 194, 122/.test(r.color), `the link is gold with no underline: ${r.deco}, ${r.color}`);
    await page.hover('#rToShop'); check(await page.evaluate(() => getComputedStyle(document.querySelector('#rToShop')).textDecorationLine) === 'underline', 'underlined on hover');
    await page.mouse.move(5, 5); await page.evaluate(() => document.querySelector('#bAgain').focus()); await page.keyboard.press('Tab');
    const f = await page.evaluate(() => { const a = document.activeElement, cs = getComputedStyle(a); return { id: a.id, deco: cs.textDecorationLine, outline: cs.outlineStyle + ' ' + cs.outlineWidth }; });
    check(f.id === 'rToShop' && f.deco === 'underline' && /solid 2px/.test(f.outline), `keyboard focus underlines it and shows a ring: ${f.outline}`);
    check(!errors.length, 'no page errors ' + errors.join(' | ')); await browser.close(); }
}
await closeAll();
console.log('== sound');
{ const { browser, page, errors } = await open(url + 'sorting', { viewport: { width: 390, height: 844 }, mobile: true, init: SPY });
  await toCard(page); await sleep(1500); const m = await page.evaluate(() => __marks), osc = await page.evaluate(() => __osc);
  check(osc.some(t => Math.abs(t - m[3]) < 120), 'with sound on, a soft thud on impact'); check(!errors.length, 'no page errors ' + errors.join(' | ')); await browser.close(); }
{ const { browser, page } = await open(url + 'sorting', { viewport: { width: 390, height: 844 }, mobile: true, init: SPY + QUIET });
  await toCard(page); await sleep(1500); const m = await page.evaluate(() => __marks), osc = await page.evaluate(() => __osc);
  check(!osc.some(t => Math.abs(t - m[3]) < 120), 'with sound off, no thud'); await browser.close(); }
console.log('== reduced motion');
{ const { browser, page } = await open(url + 'sorting', { viewport: { width: 390, height: 844 }, mobile: true, init: QUIET + `const m = window.matchMedia; window.matchMedia = q => /reduced-motion/.test(q) ? { matches: true, addEventListener() { } } : m.call(window, q);`, reducedMotion: 'reduce' });
  await page.emulateMedia({ reducedMotion: 'reduce' }); await toCard(page); await sleep(1200);
  const r = await page.evaluate(() => ({ marks: __marks, cls: document.querySelector('#rSeal').className, shine: getComputedStyle(document.querySelector('#rSeal .shine')).display, op: +getComputedStyle(document.querySelector('#rSeal')).opacity }));
  check(!r.marks.length && /fade/.test(r.cls) && r.shine === 'none' && r.op === 1, `the seal just fades in, no stamp, shake or shimmer (${r.cls})`); await browser.close(); }
console.log('== frame rate, CPU slowed 4x');
{ const { browser, page } = await open(url + 'sorting', { viewport: { width: 390, height: 844 }, mobile: true, init: WAND + QUIET });
  const cdp = await page.context().newCDPSession(page); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 }); await toCard(page);
  const f = await page.evaluate(() => new Promise(r => { const a = []; let l = performance.now(); const s = t => { a.push(t - l); l = t; if (a.length < 150) requestAnimationFrame(s); else r(a); }; requestAnimationFrame(s); }));
  const s = f.slice(5).sort((a, b) => a - b), fps = Math.round(1000 / (s.reduce((a, b) => a + b, 0) / s.length)); console.log(`    card with the stamp and the 3D spin: ${fps} fps, p95 ${Math.round(s[Math.floor(s.length * .95)])} ms`);
  check(fps >= 40, `smooth while the card appears: ${fps} fps`); await browser.close(); }
await closeAll(); srv.close();
console.log(fails.length ? `\n${fails.length} FAILED:\n- ${fails.join('\n- ')}` : '\nall passed');
process.exit(fails.length ? 1 : 0);
