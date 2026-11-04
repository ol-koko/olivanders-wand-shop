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
  {
    // a test can't make the real tap that grants motion access, so the answer is mocked as on an iPhone that allows it
    const { page, errors } = await open(url, { viewport: PHONE, mobile: true, init: `DeviceOrientationEvent.requestPermission = () => Promise.resolve('granted');` });
    await enter(page); await sleep(300);
    await tilt(page, 0, 40); await sleep(100);
    for (let i = 0; i < 30; i++) { await tilt(page, 15, 40); await sleep(30); } const right = await shift(page);
    for (let i = 0; i < 30; i++) { await tilt(page, -15, 40); await sleep(30); } const left = await shift(page);
    for (let i = 0; i < 30; i++) { await tilt(page, 0, 55); await sleep(30); } const fwd = await shift(page);
    console.log('    layer offset right', right.map(v => +v.toFixed(1)), 'left', left.map(v => +v.toFixed(1)), 'forward', fwd.map(v => +v.toFixed(1)));
    check(right[0] < -2 && left[0] > 2, 'side tilt shifts the scene both ways');
    check(Math.abs(fwd[1]) > 1.5, 'forward tilt shifts it vertically');
    const over = await page.evaluate(() => Math.max(...Object.values(__wand.layers).map(l => Math.abs(l.ox))) <= innerWidth * .04 + .5); check(over, 'the scene never slides past its overscan');
    check(!errors.length, 'no page errors ' + errors.join(' | '));
  }
  {
    // iPhone flow: a permission request that only works from the tap on the button
    for (const answer of ['granted', 'denied', 'throw']) {
      const { page, errors } = await open(url, { viewport: PHONE, mobile: true, init: `window.__asked = 0; DeviceOrientationEvent.requestPermission = () => { window.__asked++; return '${answer}' === 'throw' ? Promise.reject(new Error('no')) : Promise.resolve('${answer}'); };` });
      await sleep(300); const before = await page.evaluate(() => __asked);
      await enter(page); const asked = await page.evaluate(() => __asked);
      check(before === 0 && asked === 1, `iPhone ${answer}: asks once, on the tap`);
      const n = await page.$$eval('#nBtns button', e => e.length); check(n === 2, `iPhone ${answer}: the game goes on`);
      check(!errors.length, 'no page errors ' + errors.join(' | '));
    }
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
