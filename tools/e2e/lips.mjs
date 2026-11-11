// The Hat's mouth by the words: it follows the .lips.json keyframes in time with the voice, and falls back to the voice's level without them.
//   node tools/e2e/lips.mjs
import { closeAll, serve, open, sleep } from './lib.mjs';
const { srv, url } = await serve(), fails = [];
const check = (ok, what) => { console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) fails.push(what); };
// Every frame: whether the keyframes drive the mouth, which shape the line asks for right then, and where the mouth is.
const SAMPLE = `window.__mouth = []; (function tick() { requestAnimationFrame(tick); const H = window.__hall; if (!H || !H.VOICE.playing) return;
  const { VOICE, A, FACE, H3 } = H; let shape = null; if (VOICE.lips && A.ctx) { const c = A.ctx, at = c.currentTime - VOICE.t0 - (c.outputLatency || c.baseLatency || 0) + .05, k = VOICE.lips.k; let i = 0; while (i + 1 < k.length && k[i + 1][0] <= at) i++; shape = at < 0 ? 'X' : k[i][1]; }
  __mouth.push({ id: VOICE.played[VOICE.played.length - 1], lips: FACE.lips, shape, open: FACE.mouth.open, wide: FACE.mouth.wide, pucker: FACE.mouth.pucker, svg: FACE.open, p3: H3.on ? { open: H3.pose.open, wide: H3.pose.wide, pucker: H3.pose.pucker } : null }); })();`;
const mean = a => a.length ? a.reduce((s, x) => s + x, 0) / a.length : NaN;
const enterHall = async page => { await page.evaluate(() => document.querySelector('#cta').click()); await page.waitForFunction(() => __hall.st.phase === 'hall' && document.querySelector('#nBtns button'), null, { timeout: 25000 }); };

console.log('== with the keyframes');
{ const { browser, page, errors } = await open(url + 'sorting', { viewport: { width: 390, height: 844 }, mobile: true, locale: 'en-US', init: SAMPLE });
  await enterHall(page); await page.waitForFunction(() => __hall.VOICE.played.includes('introI') && !__hall.VOICE.playing, null, { timeout: 20000 });
  const s = await page.evaluate(() => __mouth), on = s.filter(x => x.lips), by = k => on.filter(x => x.shape === k);
  check(s.length > 60 && on.length / s.length > .9, `the keyframes drive the mouth while a line plays: ${on.length}/${s.length} frames`);
  const A = by('A'), O = by('O'), shut = [...by('M'), ...by('X')];
  check(mean(A.map(x => x.wide)) > mean(O.map(x => x.wide)) + .15, `a, e, i are wider than o, u: ${mean(A.map(x => x.wide)).toFixed(2)} vs ${mean(O.map(x => x.wide)).toFixed(2)}`);
  check(mean(O.map(x => x.pucker)) > mean(A.map(x => x.pucker)) + .25, `o, u are rounder than a, e, i: ${mean(O.map(x => x.pucker)).toFixed(2)} vs ${mean(A.map(x => x.pucker)).toFixed(2)}`);
  check(mean(A.map(x => x.open)) > mean(shut.map(x => x.open)) + .1, `open on vowels, closing on m, b, p and between words: ${mean(A.map(x => x.open)).toFixed(2)} vs ${mean(shut.map(x => x.open)).toFixed(2)}`);
  check(on.every(x => Math.abs(x.svg - x.open * 2) < 1e-6), 'the drawn Hat opens by the same amount');
  const d3 = on.filter(x => x.p3); check(!d3.length || d3.every(x => Math.abs(x.p3.wide - x.wide) < .05), `the 3D Hat takes the same shape (${d3.length} frames in 3D)`);
  const after = await page.evaluate(async () => { await new Promise(r => setTimeout(r, 400)); return __hall.VOICE.playing ? null : __hall.FACE.mouth.open; });
  check(after === null || after < .05, `the mouth closes after the line: ${after}`);
  check(!errors.length, 'no page errors ' + errors.join(' | ')); await browser.close(); }

console.log('== without the keyframes');
{ const { browser, page, errors } = await open(url + 'sorting', { viewport: { width: 390, height: 844 }, mobile: true, locale: 'en-US', init: SAMPLE, route: p => p.route(u => /\.lips\.json$/.test(u.pathname), r => r.abort()) });
  await enterHall(page); await page.waitForFunction(() => __hall.VOICE.played.includes('introI') && !__hall.VOICE.playing, null, { timeout: 20000 });
  const s = await page.evaluate(() => __mouth);
  check(s.length > 60 && s.every(x => !x.lips), `the mouth follows the voice's level: ${s.length} frames, none from keyframes`);
  check(Math.max(...s.map(x => x.svg)) > .2, `and still moves: up to ${Math.max(...s.map(x => x.svg)).toFixed(2)}`);
  check(!errors.length, 'no page errors ' + errors.join(' | ')); await browser.close(); }

console.log('== sound off');
{ const { browser, page, errors } = await open(url + 'sorting', { viewport: { width: 390, height: 844 }, mobile: true, locale: 'en-US', init: `localStorage.setItem('wand-sound', '0');` });
  await enterHall(page); await sleep(4000);
  const m = await page.evaluate(() => ({ open: __hall.FACE.open, lips: __hall.FACE.lips }));
  check(m.open < .05 && !m.lips, `the mouth stays closed: ${m.open.toFixed(3)}`);
  check(!errors.length, 'no page errors ' + errors.join(' | ')); await browser.close(); }

await closeAll(); srv.close();
console.log(fails.length ? `\n${fails.length} FAILED:\n- ${fails.join('\n- ')}` : '\nall passed');
process.exit(fails.length ? 1 : 0);
