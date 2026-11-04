// How the wand moves during a wave, and the depth effect from tilting a phone.
//   node tools/e2e/motion.mjs        run everything
//   node tools/e2e/motion.mjs wand   wand motion only
import path from 'node:path';
import { closeAll, serve, open, enter, choosePointer, ensureShots, sleep } from './lib.mjs';
const SHOTS = ensureShots(), { srv, url } = await serve(), fails = [];
const check = (ok, what) => { console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) fails.push(what); };
const PHONE = { width: 390, height: 844 };
const only = process.argv[2];

async function wandRun() {
  console.log('== the wand pivots from the handle');
  const { page, errors } = await open(url, { viewport: PHONE, mobile: true });
  await enter(page); await choosePointer(page);
  await page.waitForFunction(() => __wand.st.cap, null, { timeout: 30000 });
  // put a wand in hand and record both ends of it on every frame of a side-to-side wave
  await page.evaluate(() => {
    const { st, WANDS, wandLen } = __wand, w = WANDS.find(x => x.id === 'harry'); st.cap.cand = w;
    st.wand = { w, x: innerWidth / 2, y: innerHeight * .4, tx: innerWidth / 2, ty: innerHeight * .4, ang: -1.25, s: 1, a: 1, mode: 'present', vx: 0, vy: 0, vr: 0 };
    window.__ends = []; const L = wandLen(w);
    (function f() { const o = st.wand; if (o && o.mode === 'follow') { const c = Math.cos(o.ang) * L / 2, s = Math.sin(o.ang) * L / 2; const q = st.cap && st.cap.pts[st.cap.pts.length - 1]; __ends.push([o.x + c, o.y + s, o.x - c, o.y - s, q ? Math.hypot(o.x + c - q.x, o.y + s - q.y) : 0]); } if (window.__ends) requestAnimationFrame(f); })();
  });
  const cx = 195, cy = 330, A = 130; await page.mouse.move(cx - A, cy); await page.mouse.down();
  for (let i = 1; i <= 60; i++) { await page.mouse.move(cx + Math.sin(i / 60 * 12.56 - 1.57) * A, cy + Math.sin(i / 60 * 25) * 30); await sleep(14); if (i === 40) await page.screenshot({ path: path.join(SHOTS, 'motion-wave.png') }); }
  const ends = await page.evaluate(() => __ends); await page.mouse.up();
  const trip = (a, b) => { let s = 0; for (let i = 1 + 4; i < ends.length; i++) s += Math.hypot(ends[i][a] - ends[i - 1][a], ends[i][b] - ends[i - 1][b]); return s; };
  const tip = trip(0, 1), handle = trip(2, 3), ratio = handle / tip;
  const gaps = ends.slice(5).map(e => e[4]).sort((x, y) => x - y), gap = gaps[gaps.length >> 1];
  console.log(`    ${ends.length} frames: tip travelled ${Math.round(tip)}px, handle ${Math.round(handle)}px, ratio ${ratio.toFixed(2)}, tip is ${Math.round(gap)}px from the finger (median)`);
  check(gap < 45, 'the tip stays close to the finger');
  check(ratio < .55, 'the handle moves much less than the tip');
  check(!errors.length, 'no page errors ' + errors.join(' | '));
}
async function tiltRun() {
  console.log('== tilting the phone moves the layers');
  const tilt = (page, gamma, beta) => page.evaluate(([g, b]) => dispatchEvent(new DeviceOrientationEvent('deviceorientation', { gamma: g, beta: b })), [gamma, beta]);
  const shift = page => page.evaluate(() => [__wand.layers.shFront.ox, __wand.layers.shFront.oy]);
  // behaves like iPhone Safari: rejected without a real tap, answers with a real one
  const iphone = answer => `window.__asked = 0; DeviceOrientationEvent.requestPermission = () => { if (!navigator.userActivation.isActive) return Promise.reject(new DOMException('needs a tap', 'NotAllowedError')); window.__asked++; return '${answer}' === 'throw' ? Promise.reject(new Error('no')) : Promise.resolve('${answer}'); };`;
  const tapAt = async (page, sel) => { const r = await page.evaluate(s => { const b = document.querySelector(s).getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2]; }, sel); await page.touchscreen.tap(r[0], r[1]); };
  const tapSky = page => page.touchscreen.tap(195, 330);
  const inStreet = page => page.evaluate(() => __wand.st.phase === 'street');
  const sway = async (page, g, b) => { for (let i = 0; i < 30; i++) { await tilt(page, g, b); await sleep(30); } };
  const readLayers = page => page.evaluate(k => [__wand.layers[k].ox, __wand.layers[k].oy], 'stShop');
  {
    const { page, errors } = await open(url, { viewport: PHONE, mobile: true, init: iphone('granted') });
    await sleep(400); check((await page.evaluate(() => __asked)) === 0, 'iPhone: no prompt on load');
    await tapSky(page); await sleep(500);
    check((await page.evaluate(() => __asked)) === 1 && await inStreet(page), 'iPhone: a tap on the street asks and stays on the street');
    await tilt(page, 0, 40); await sway(page, 15, 40); const right = await readLayers(page); await sway(page, -15, 40); const left = await readLayers(page);
    console.log('    street layer right', right.map(v => +v.toFixed(1)), 'left', left.map(v => +v.toFixed(1)));
    check(right[0] < -2 && left[0] > 2, 'iPhone: the street moves with tilt');
    await page.screenshot({ path: path.join(SHOTS, 'motion-street.png') });
    await tapSky(page); await sleep(500); check(!(await inStreet(page)), 'a second tap on the street enters, as before');
    await page.waitForFunction(() => __wand.st.phase === 'shop', null, { timeout: 30000 }); await sway(page, 15, 40); const r2 = await shift(page); await sway(page, -15, 40); const l2 = await shift(page); await sway(page, 0, 55); const f2 = await shift(page);
    console.log('    shop layer right', r2.map(v => +v.toFixed(1)), 'left', l2.map(v => +v.toFixed(1)), 'forward', f2.map(v => +v.toFixed(1)));
    check(r2[0] < -2 && l2[0] > 2 && Math.abs(f2[1]) > 1.5, 'the shop moves with tilt, both ways and forward');
    check(await page.evaluate(() => Math.max(...Object.values(__wand.layers).map(l => Math.abs(l.ox))) <= innerWidth * .04 + .5), 'the scene never slides past its overscan');
    check(!errors.length, 'no page errors ' + errors.join(' | '));
  }
  for (const answer of ['granted', 'denied', 'throw']) {
    const { page, errors } = await open(url, { viewport: PHONE, mobile: true, init: iphone(answer) });
    await sleep(400); await tapAt(page, '#cta');
    await page.waitForFunction(() => document.querySelectorAll('#nBtns button').length === 2, null, { timeout: 30000 });
    check((await page.evaluate(() => __asked)) === 1, `iPhone ${answer}: the button asks once and enters`);
    check(!errors.length, 'no page errors ' + errors.join(' | '));
  }
  {
    // already allowed earlier: works from the start with no prompt or extra tap
    const { page, errors } = await open(url, { viewport: PHONE, mobile: true, init: `DeviceOrientationEvent.requestPermission = () => Promise.resolve('granted');` });
    await sleep(400); await tilt(page, 0, 40); await sway(page, 15, 40); const r = await readLayers(page);
    check(r[0] < -2, 'allowed earlier: the street moves right away');
    await tapSky(page); await sleep(500); check(!(await inStreet(page)), 'allowed earlier: one tap enters');
    check(!errors.length, 'no page errors ' + errors.join(' | '));
  }
  {
    const { page, errors } = await open(url, { viewport: { width: 1440, height: 900 } });
    await page.mouse.move(100, 100); await sleep(700); const a = await shift(page); await page.mouse.move(1300, 700); await sleep(900); const b = await shift(page);
    check(Math.abs(a[0] - b[0]) > 2, 'desktop still follows the mouse'); check(!errors.length, 'no page errors ' + errors.join(' | '));
  }
}
if (only !== 'tilt') await wandRun();
if (only !== 'wand') await tiltRun();
await closeAll(); srv.close();
console.log(fails.length ? `\n${fails.length} FAILED:\n- ${fails.join('\n- ')}` : '\nall passed');
process.exit(fails.length ? 1 : 0);
