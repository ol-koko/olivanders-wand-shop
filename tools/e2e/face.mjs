// The Hall's first look and the Hat's face: eyes, blinks, brows, the mouth with and without sound, the lean, and the frame rate on a slowed CPU.
//   node tools/e2e/face.mjs
import { closeAll, serve, open, sleep } from './lib.mjs';
const { srv, url } = await serve(), fails = [];
const check = (ok, what) => { console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) fails.push(what); };
const QUIET = `localStorage.setItem('wand-sound', '0');`;
const pup = page => page.evaluate(() => { const m = /translate\(([-\d.]+) ([-\d.]+)\)/.exec(document.querySelector('#pupL').getAttribute('transform') || ''); return m ? [+m[1], +m[2]] : [0, 0]; });
const fly = page => page.evaluate(() => document.querySelector('#cta').click());
const hatIn = page => page.waitForFunction(() => document.querySelector('#hat').classList.contains('in'), null, { timeout: 25000 });
const ready = page => page.waitForFunction(() => __hall.st.phase === 'hall' && document.querySelector('#nBtns button'), null, { timeout: 25000 });

console.log('== the Hall before the Hat');
for (const [w, h] of [[390, 844], [1440, 900]]) {
  const { browser, page, errors } = await open(url + 'sorting', { viewport: { width: w, height: h }, mobile: w < 768, init: QUIET });
  await fly(page); await page.waitForFunction(() => __hall.st.phase === 'establish', null, { timeout: 20000 }); const t0 = Date.now();
  const a = await page.evaluate(() => ({ dim: document.querySelector('#hallDim').classList.contains('in'), hat: document.querySelector('#hat').classList.contains('in'), note: document.querySelector('#note').classList.contains('show'), s: __hall.layers.haBack.s })); await sleep(1500);
  const b = await page.evaluate(() => __hall.layers.haBack.s);
  check(!a.dim && !a.hat && !a.note, `${w}: a clear look at the Hall first, no blur, no Hat, no note`);
  check(b > a.s + .01, `${w}: a slow push-in: ${a.s.toFixed(3)} → ${b.toFixed(3)}`);
  await hatIn(page); const held = Date.now() - t0; await ready(page);
  check(held > 2400 && held < 4200, `${w}: then the Hat comes in after about ${(held / 1000).toFixed(1)} s`);
  check(await page.evaluate(() => document.querySelector('#hallDim').classList.contains('in') && document.querySelector('#hat').classList.contains('in')), `${w}: the background dims behind the Hat`);
  check(await page.evaluate(() => document.querySelectorAll('.spirit').length === 4), `${w}: ghosts drift in the Hall`);
  check(await page.evaluate(() => [...document.querySelectorAll('#nBtns button, #note')].every(b => getComputedStyle(b).animationName === 'none')), `${w}: the note and its buttons never drift`);
  check(!errors.length, 'no page errors ' + errors.join(' | ')); await browser.close();
}
{ const { browser, page } = await open(url + 'sorting', { viewport: { width: 390, height: 844 }, mobile: true, init: QUIET });
  await fly(page); await page.waitForFunction(() => __hall.st.phase === 'establish', null, { timeout: 20000 }); const t0 = Date.now(); await sleep(300); await page.mouse.click(200, 300);
  await hatIn(page); check(Date.now() - t0 < 1400, `a tap skips the wait: the Hat is in after ${Date.now() - t0} ms`); await browser.close(); }
{ const { browser, page } = await open(url + 'sorting', { viewport: { width: 390, height: 844 }, mobile: true, init: QUIET + `const m = window.matchMedia; window.matchMedia = q => /reduced-motion/.test(q) ? { matches: true, addEventListener() { } } : m.call(window, q);` });
  await fly(page); await page.waitForFunction(() => __hall.st.phase === 'establish', null, { timeout: 20000 }); const t0 = Date.now(); await sleep(600); const s = await page.evaluate(() => __hall.layers.haBack.s);
  await ready(page); check(s === 1 && Date.now() - t0 < 2200, `reduced motion: no push-in, a shorter hold (${Date.now() - t0} ms)`); await browser.close(); }
await closeAll();

console.log('== the face');
for (const [w, h] of [[390, 844], [1440, 900]]) {
  const { browser, page, errors } = await open(url + 'sorting', { viewport: { width: w, height: h }, mobile: false, init: QUIET });
  await fly(page); await ready(page); await sleep(400);
  await page.mouse.move(5, h * .4); await sleep(500); const left = await pup(page);
  await page.mouse.move(w - 5, h * .4); await sleep(500); const right = await pup(page);
  check(left[0] < -1.5 && right[0] > 1.5, `${w}: the eyes follow the pointer: ${left[0].toFixed(1)} / ${right[0].toFixed(1)}`);
  await sleep(1800); const rest = await pup(page); check(Math.abs(rest[0]) < 1 && rest[1] > .3, `${w}: then they look back at the player: ${rest.map(v => v.toFixed(1)).join(', ')}`);
  let blinks = await page.evaluate(() => new Promise(r => { let n = 0; const o = new MutationObserver(() => { if (document.querySelector('#hat').classList.contains('blink')) n++; }); o.observe(document.querySelector('#hat'), { attributes: true }); setTimeout(() => { o.disconnect(); r(n); }, 9000); }));
  check(blinks >= 1, `${w}: blinks on its own: ${blinks} in 9 s`);
  await page.evaluate(() => document.querySelector('#nBtns button').click()); await page.waitForFunction(() => __hall.st.picking, null, { timeout: 15000 }); await sleep(500);
  check(await page.evaluate(() => document.querySelector('#hat').classList.contains('raise')), `${w}: the brows rise on a question`);
  const b = await page.evaluate(() => { const bs = [...document.querySelectorAll('#nBtns button')]; const r = bs[0].getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, n: bs.length }; });
  await page.mouse.move(b.x, b.y); await sleep(450); const look = await pup(page); check(look[1] > 1, `${w}: hovering an option draws the eyes to it: ${look.map(v => v.toFixed(1)).join(', ')}`);
  const mouth = await page.evaluate(() => document.querySelector('#hatMouth').style.transform);
  check(/scaleY\(0\.3[0-9]*\)/.test(mouth), `${w}: with sound off the mouth stays closed: ${mouth}`);
  const lean = await page.evaluate(async () => { const bs = [...document.querySelectorAll('#nBtns button')], far = bs.reduce((a, x) => Math.abs(x.getBoundingClientRect().left + x.getBoundingClientRect().width / 2 - innerWidth / 2) > Math.abs(a.getBoundingClientRect().left + a.getBoundingClientRect().width / 2 - innerWidth / 2) ? x : a); far.click(); await new Promise(r => setTimeout(r, 120)); return document.querySelector('#hat').style.rotate; });
  check(w < 768 || lean !== '0deg', `${w}: the Hat leans toward the chosen option: ${lean}`);
  await page.waitForFunction(() => __hall.st.picking, null, { timeout: 15000 }); check(await page.evaluate(() => document.querySelector('#hat').style.rotate) === '0deg', `${w}: and straightens for the next question`);
  check(!errors.length, 'no page errors ' + errors.join(' | ')); await browser.close();
}
await closeAll();

console.log('== the mouth follows the voice');
{ const { browser, page, errors } = await open(url + 'sorting', { viewport: { width: 390, height: 844 }, mobile: true });
  await fly(page); await page.waitForFunction(() => __hall.VOICE.played.includes('introH'), null, { timeout: 30000 });
  const s = await page.evaluate(() => new Promise(r => { const v = []; const t = setInterval(() => v.push(+/scaleY\(([\d.]+)\)/.exec(document.querySelector('#hatMouth').style.transform)[1]), 50); setTimeout(() => { clearInterval(t); r(v); }, 2000); }));
  const max = Math.max(...s), min = Math.min(...s), changes = s.filter((v, i) => i && Math.abs(v - s[i - 1]) > .03).length;
  check(max > .6 && changes > 8, `the mouth opens and closes with the voice: ${min.toFixed(2)}–${max.toFixed(2)}, ${changes} moves`);
  await page.waitForFunction(() => __hall.VOICE.played.includes('introI'), null, { timeout: 15000 }); await sleep(4500);
  check(+/scaleY\(([\d.]+)\)/.exec(await page.evaluate(() => document.querySelector('#hatMouth').style.transform))[1] < .4, 'and rests closed after the line'); check(!errors.length, 'no page errors ' + errors.join(' | ')); await browser.close(); }
await closeAll();

console.log('== frame rate, CPU slowed 4x like a mid-range phone');
for (const [w, h] of [[390, 844], [1440, 900]]) {
  const { browser, page } = await open(url + 'sorting', { viewport: { width: w, height: h }, mobile: w < 768, init: QUIET });
  const cdp = await page.context().newCDPSession(page); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await fly(page); await page.waitForFunction(() => __hall.st.phase === 'establish', null, { timeout: 30000 });
  const est = await page.evaluate(() => new Promise(r => { const f = []; let l = performance.now(); const s = t => { f.push(t - l); l = t; if (f.length < 120) requestAnimationFrame(s); else r(f); }; requestAnimationFrame(s); }));
  await ready(page); await sleep(800);
  const hat = await page.evaluate(() => new Promise(r => { const f = []; let l = performance.now(); const s = t => { f.push(t - l); l = t; if (f.length < 180) requestAnimationFrame(s); else r(f); }; requestAnimationFrame(s); }));
  const stat = f => { const s = f.slice(5).sort((a, b) => a - b); return { fps: Math.round(1000 / (s.reduce((a, b) => a + b, 0) / s.length)), p95: Math.round(s[Math.floor(s.length * .95)]), long: s.filter(x => x > 50).length }; };
  const a = stat(est), b = stat(hat); console.log(`    ${w}: Hall push-in ${JSON.stringify(a)}, Hat on screen ${JSON.stringify(b)}`);
  check(a.fps >= 40 && b.fps >= 40 && b.long <= 3, `${w}: smooth on a slowed CPU: ${a.fps} / ${b.fps} fps`); await browser.close();
}
await closeAll(); srv.close();
console.log(fails.length ? `\n${fails.length} FAILED:\n- ${fails.join('\n- ')}` : '\nall passed');
process.exit(fails.length ? 1 : 0);
