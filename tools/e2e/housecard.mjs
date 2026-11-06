// The house card: the crest as a medal that turns in 3D, the stamp with its shimmer, the wand's name or the link to the shop.
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
    await toCard(page, l);
    const r = await page.evaluate(() => ({ stage: !!document.querySelector('#rStage, #rWand3d'), link: !document.querySelector('#rToShop').hidden, spec: document.querySelector('#rSpecs').textContent }));
    check(!r.stage && !r.link && /Герміони|Hermione/.test(r.spec), `with a wand: no wand drawn, only its name (${r.spec})`);
    await page.waitForFunction(() => __hall.COIN.turn > 0, null, { timeout: 5000 }).catch(() => { }); check(await page.evaluate(() => __hall.COIN.turn > 0), 'the crest makes one turn after the stamp');
    await page.waitForFunction(() => !__hall.COIN.turn && !__hall.COIN.raf, null, { timeout: 8000 }).catch(() => { });
    const tf0 = await page.evaluate(() => getComputedStyle(document.querySelector('#rSeal .coin')).transform), y0 = await page.evaluate(() => __hall.COIN.yaw);
    const box = await page.evaluate(() => { const b = document.querySelector('#rSeal').getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2]; });
    await page.mouse.move(box[0], box[1]); await page.mouse.down(); await page.mouse.move(box[0] + 80, box[1] + 10, { steps: 6 }); await page.mouse.up();
    const y1 = await page.evaluate(() => __hall.COIN.yaw); await sleep(500);
    const after = await page.evaluate(() => ({ yaw: __hall.COIN.yaw, tf: getComputedStyle(document.querySelector('#rSeal .coin')).transform, ts: getComputedStyle(document.querySelector('#rSeal .coin')).transformStyle }));
    check(y1 - y0 > 20 && after.tf !== tf0 && after.ts === 'preserve-3d', `dragging turns the crest in 3D (${Math.round(y1 - y0)}°)`);
    check(after.yaw > y1, `it keeps turning a little after release (+${Math.round(after.yaw - y1)}°)`);
    const back = await page.evaluate(() => { __hall.COIN.yaw = 180; __hall.COIN.pitch = 0; document.querySelector('#rSeal .coin').style.transform = 'rotateY(180deg)'; const b = document.querySelector('#rSeal .back').getBoundingClientRect(); return b.width > 50; });
    check(back, 'the back of the medal is there when turned over');
    const seal = await page.evaluate(() => { const s = document.querySelector('#rSeal'), c = document.querySelector('.rcard').getBoundingClientRect(), b = s.getBoundingClientRect(), bar = document.querySelector('.topbar').getBoundingClientRect(); return { inside: b.top >= c.top && b.bottom <= c.bottom && b.left >= c.left, clear: b.bottom <= bar.top || b.top >= bar.bottom || b.right <= bar.left, shine: getComputedStyle(s.querySelector('.shine')).animationName, op: +getComputedStyle(s).opacity }; });
    check(seal.inside && seal.clear && seal.op === 1, 'the seal sits on the card, clear of the top buttons');
    check(seal.shine === 'shine', 'a gold shimmer sweeps across it');
    const m = await page.evaluate(() => __marks); check(m[0] === 'stamp' && m[2] === 'thud' && m[3] - m[1] > 300 && m[3] - m[1] < 700, `stamped, then the card shakes on impact (${Math.round(m[3] - m[1])} ms)`);
    check(!errors.length, 'no page errors ' + errors.join(' | ')); await browser.close(); }
  { const { browser, page, errors } = await open(url + 'sorting', { viewport: { width: w, height: h }, mobile: w < 768, init: QUIET });
    await toCard(page, l); await sleep(1600);
    const r = await page.evaluate(() => { const a = document.querySelector('#rToShop'), cs = getComputedStyle(a); return { link: !a.hidden, text: a.textContent, deco: cs.textDecorationLine, color: cs.color, seal: document.querySelector('#rSeal').getBoundingClientRect().height }; });
    check(r.link && r.seal > 120, `without a wand: a big seal and the link: ${r.text}`);
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
  await sleep(2000); const r = await page.evaluate(() => ({ turned: __hall.COIN.turn || __hall.COIN.yaw, marks: __marks, cls: document.querySelector('#rSeal').className, shine: getComputedStyle(document.querySelector('#rSeal .shine')).display, op: +getComputedStyle(document.querySelector('#rSeal')).opacity }));
  check(!r.turned && !r.marks.length && /fade/.test(r.cls) && r.shine === 'none' && r.op === 1, `the seal just fades in, no stamp, shake, shimmer or turn (${r.cls})`); await browser.close(); }
console.log('== frame rate, CPU slowed 4x');
{ const { browser, page } = await open(url + 'sorting', { viewport: { width: 390, height: 844 }, mobile: true, init: WAND + QUIET });
  const cdp = await page.context().newCDPSession(page); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 }); await toCard(page);
  const f = await page.evaluate(() => new Promise(r => { const a = []; let l = performance.now(); const s = t => { a.push(t - l); l = t; if (a.length < 150) requestAnimationFrame(s); else r(a); }; requestAnimationFrame(s); }));
  const s = f.slice(5).sort((a, b) => a - b), fps = Math.round(1000 / (s.reduce((a, b) => a + b, 0) / s.length)); console.log(`    card with the stamp and the crest's turn: ${fps} fps, p95 ${Math.round(s[Math.floor(s.length * .95)])} ms`);
  check(fps >= 40, `smooth while the card appears: ${fps} fps`); await browser.close(); }
await closeAll(); srv.close();
console.log(fails.length ? `\n${fails.length} FAILED:\n- ${fails.join('\n- ')}` : '\nall passed');
process.exit(fails.length ? 1 : 0);
