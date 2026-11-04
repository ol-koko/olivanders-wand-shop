// How the wand moves during a wave, and the depth effect from a finger or from tilting a phone.
//   node tools/e2e/motion.mjs        run everything
//   node tools/e2e/motion.mjs tilt   depth only
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
async function depthRun() {
  const tilt = (page, gamma, beta) => page.evaluate(([g, b]) => dispatchEvent(new DeviceOrientationEvent('deviceorientation', { gamma: g, beta: b })), [gamma, beta]);
  const sway = async (page, g, b) => { for (let i = 0; i < 30; i++) { await tilt(page, g, b); await sleep(30); } };
  const read = (page, k) => page.evaluate(n => [__wand.layers[n].ox, __wand.layers[n].oy], k);
  const inStreet = page => page.evaluate(() => __wand.st.phase === 'street');
  const noOverscan = page => page.evaluate(() => Math.max(...Object.values(__wand.layers).map(l => Math.abs(l.ox))) <= innerWidth * .04 + .5);
  // a real finger, so the browser produces real pointer events and decides about the click itself
  const sessions = new Map(), cdp = async page => { if (!sessions.has(page)) sessions.set(page, await page.context().newCDPSession(page)); return sessions.get(page); };
  const drag = async (page, from, to, { lift = true } = {}) => {
    const c = await cdp(page), pt = (x, y) => [{ x, y }];
    await c.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: pt(...from) });
    for (let i = 1; i <= 12; i++) { await c.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: pt(from[0] + (to[0] - from[0]) * i / 12, from[1] + (to[1] - from[1]) * i / 12) }); await sleep(40); }
    await sleep(400);
    if (lift) await c.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  };
  const cta = page => page.evaluate(() => { const b = document.querySelector('#cta').getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2]; });
  // what iPhone Safari does: orientation events stay silent, and the permission function exists but must never be called
  const iphone = `window.__asked = 0; DeviceOrientationEvent.requestPermission = () => { window.__asked++; return Promise.resolve('granted'); };`;

  console.log('== iPhone: depth from a finger, no prompts');
  {
    const { page, errors } = await open(url, { viewport: PHONE, mobile: true, init: iphone });
    await sleep(500);
    await drag(page, [60, 400], [40, 300], { lift: false }); const left = await read(page, 'stShop');
    const c = await cdp(page); await c.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await sleep(300); check(await inStreet(page), 'a drag does not enter the shop');
    await drag(page, [330, 300], [350, 500], { lift: false }); const right = await read(page, 'stShop');
    console.log('    street layer, finger left', left.map(v => +v.toFixed(1)), 'finger right', right.map(v => +v.toFixed(1)));
    check(left[0] > 3 && right[0] < -3 && right[1] < left[1], 'dragging moves the layers both ways, as the mouse does');
    check(await noOverscan(page), 'the scene never slides past its overscan');
    await c.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await sleep(2500);
    const after = await read(page, 'stShop'); console.log('    after release', after.map(v => +v.toFixed(1)));
    check(Math.abs(after[0]) < Math.abs(right[0]) * .6, 'it eases back to the drift on release');
    check(await inStreet(page), 'still on the street');
    await drag(page, await cta(page), [195, 500]); await sleep(300); check(await inStreet(page), 'a drag that starts on the button does not enter either');
    await page.screenshot({ path: path.join(SHOTS, 'motion-street.png') });
    const t = await cta(page); const t0 = Date.now(); await page.touchscreen.tap(t[0], t[1]);
    const opened = await page.evaluate(() => new Promise(r => { const a = performance.now(); (function f() { if (__wand.st.phase !== 'street') r(Math.round(performance.now() - a)); else if (performance.now() - a > 3000) r(-1); else requestAnimationFrame(f); })(); }));
    check(opened >= 0 && opened < 300, `a tap on the button opens the door at once (${opened} ms)`);
    await page.waitForFunction(() => document.querySelectorAll('#nBtns button').length === 2, null, { timeout: 30000 });
    check((await page.evaluate(() => __asked)) === 0, 'no motion permission was ever asked');
    check(!errors.length, 'no page errors ' + errors.join(' | '));
  }
  {
    const { page, errors } = await open(url, { viewport: PHONE, mobile: true, init: iphone });
    await sleep(400); await page.touchscreen.tap(195, 330); await sleep(400);
    check(!(await inStreet(page)), 'a tap on the street enters, as before'); check((await page.evaluate(() => __asked)) === 0, 'still no prompt'); check(!errors.length, 'no page errors ' + errors.join(' | '));
  }
  console.log('== Android: tilt works by itself');
  {
    const { page, errors } = await open(url, { viewport: PHONE, mobile: true, init: `delete DeviceOrientationEvent.requestPermission;` });
    await sleep(400); await tilt(page, 0, 40); await sway(page, 15, 40); const r = await read(page, 'stShop'); await sway(page, -15, 40); const l = await read(page, 'stShop');
    console.log('    street layer right', r.map(v => +v.toFixed(1)), 'left', l.map(v => +v.toFixed(1)));
    check(r[0] < -2 && l[0] > 2, 'the street moves with tilt, with no tap and no UI');
    await page.evaluate(() => document.querySelector('#cta').click()); await page.waitForFunction(() => __wand.st.phase === 'shop', null, { timeout: 30000 });
    await sway(page, 15, 40); const r2 = await read(page, 'shFront'); await sway(page, -15, 40); const l2 = await read(page, 'shFront'); await sway(page, 0, 55); const f2 = await read(page, 'shFront');
    console.log('    shop layer right', r2.map(v => +v.toFixed(1)), 'left', l2.map(v => +v.toFixed(1)), 'forward', f2.map(v => +v.toFixed(1)));
    check(r2[0] < -2 && l2[0] > 2 && Math.abs(f2[1]) > 1.5, 'the shop moves with tilt too');
    check(await noOverscan(page), 'the scene never slides past its overscan');
    check(!errors.length, 'no page errors ' + errors.join(' | '));
  }
  console.log('== reduced motion: no tilt, no drag');
  {
    const { page, errors } = await open(url, { viewport: PHONE, mobile: true, init: `delete DeviceOrientationEvent.requestPermission;` });
    await page.emulateMedia({ reducedMotion: 'reduce' }); await page.reload({ waitUntil: 'load' }); await sleep(400);
    await tilt(page, 0, 40); await sway(page, 15, 40); const felt = await page.evaluate(() => __wand.par.tx);
    await drag(page, [60, 400], [40, 300], { lift: false }); const dragged = await page.evaluate(() => __wand.par.tx);
    const c = await cdp(page); await c.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await sleep(300);
    console.log('    target after tilt', felt.toFixed(2), 'after drag to the left', dragged.toFixed(2));
    check(felt < .75 && dragged > -.5, 'neither tilt nor drag drives the layers');
    check(await inStreet(page), 'a drag still does not enter');
    check(!errors.length, 'no page errors ' + errors.join(' | '));
  }
  console.log('== desktop');
  {
    const { page, errors } = await open(url, { viewport: { width: 1440, height: 900 } });
    await page.mouse.move(100, 100); await sleep(700); const a = await read(page, 'stShop'); await page.mouse.move(1300, 700); await sleep(900); const b = await read(page, 'stShop');
    check(Math.abs(a[0] - b[0]) > 2, 'still follows the mouse'); check(!errors.length, 'no page errors ' + errors.join(' | '));
  }
}
if (only !== 'tilt') await wandRun();
if (only !== 'wand') await depthRun();
await closeAll(); srv.close();
console.log(fails.length ? `\n${fails.length} FAILED:\n- ${fails.join('\n- ')}` : '\nall passed');
process.exit(fails.length ? 1 : 0);
