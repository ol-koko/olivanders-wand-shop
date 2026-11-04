// The 3D view on the result card: loads lazily, makes one turn, follows a drag, pauses offscreen, falls back to 2D.
//   node tools/e2e/wand3d.mjs
import path from 'node:path';
import { closeAll, serve, open, ensureShots, sleep } from './lib.mjs';
const SHOTS = ensureShots(), { srv, url } = await serve(), fails = [];
const check = (ok, what) => { console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) fails.push(what); };
const IDS = process.argv.slice(2).length ? process.argv.slice(2) : ['harry', 'voldemort', 'bellatrix'];
const win = (page, id) => page.evaluate(i => { const { st, WANDS, showResult, v3 } = __wand; document.querySelector('#street').hidden = true; st.winner = WANDS.find(w => w.id === i); st.traits = { speed: .5, amp: .5, sharp: .5, flow: .5, curl: .5 }; st.stroke = [{ x: 10, y: 10 }, { x: 100, y: 90 }, { x: 220, y: 40 }]; st.tried = []; showResult(); }, id);
const three = [];

console.log('== normal');
{
  const { page, errors } = await open(url, { viewport: { width: 390, height: 844 }, mobile: true });
  page.on('request', r => { if (/three/.test(r.url())) three.push(r.url()); });
  await sleep(800); check(!three.length, 'three.js is not loaded before the result screen');
  for (const id of IDS) {
    await win(page, id); await page.waitForFunction(() => document.querySelector('#rStage').classList.contains('is3d'), null, { timeout: 30000 });
    await sleep(500); await page.screenshot({ path: path.join(SHOTS, `3d-${id}.png`) });
  }
  check(three.length === 1, 'three.js loaded once, on the result screen');
  // a fresh card: one full turn, then it stays put
  const f = () => page.evaluate(() => __wand.v3.frames), spinning = () => page.evaluate(() => !!__wand.v3.spin);
  await win(page, 'draco'); await page.waitForFunction(() => __wand.v3.spin > 0, null, { timeout: 15000 });
  const seen = await page.evaluate(() => new Promise(r => { const { v3 } = __wand; let min = 1e9, max = -1e9; const t0 = performance.now(); (function g() { const y = v3.yawG.rotation.y; min = Math.min(min, y); max = Math.max(max, y); if (!v3.spin || performance.now() - t0 > 12000) r({ turned: max - min, rest: v3.yawG.rotation.y, yaw: v3.yaw, left: v3.spin }); else requestAnimationFrame(g); })(); }));
  console.log('    turned', seen.turned.toFixed(2), 'rad, rest', seen.rest.toFixed(2));
  check(seen.turned > 6 && seen.turned < 6.4, 'one full turn when the card appears');
  await sleep(300); check(Math.abs((await page.evaluate(() => __wand.v3.yawG.rotation.y)) - seen.yaw) < .001, 'ends where it started, with no jump');
  const a = await f(); await sleep(600); check((await f()) === a && !(await spinning()), 'then stops drawing, as nothing moves');
  const yaw0 = await page.evaluate(() => __wand.v3.yaw), roll0 = await page.evaluate(() => __wand.v3.roll), box = await page.locator('#rWand3d').boundingBox();
  const c = await page.context().newCDPSession(page);
  await c.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: box.x + 100, y: box.y + 60 }] });
  for (let i = 1; i <= 10; i++) { await c.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: box.x + 100 + i * 12, y: box.y + 60 + i * 6 }] }); await sleep(30); }
  await c.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await sleep(200);
  const yaw1 = await page.evaluate(() => __wand.v3.yaw), roll1 = await page.evaluate(() => __wand.v3.roll);
  check(Math.abs(yaw1 - yaw0) > .5 && Math.abs(roll1 - roll0) > .3, `a finger turns it both ways (yaw ${yaw0.toFixed(2)} → ${yaw1.toFixed(2)}, roll ${roll0.toFixed(2)} → ${roll1.toFixed(2)})`);
  check(Math.abs((await page.evaluate(() => __wand.v3.yawG.rotation.y)) - yaw1) < .001, 'and the model shows it');
  await page.screenshot({ path: path.join(SHOTS, '3d-turned.png') });
  // a drag during the turn takes over from where the wand is
  await win(page, 'luna'); await page.waitForFunction(() => __wand.v3.spin > 1500, null, { timeout: 15000 });
  const jump = await page.evaluate(() => new Promise(r => {
    const { v3 } = __wand, cv = document.querySelector('#rWand3d'), y0 = v3.yaw + (v3.spin ? (t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2))(v3.spin / 3600) * 2 * Math.PI : 0);
    cv.dispatchEvent(new PointerEvent('pointerdown', { clientX: 200, clientY: 100, pointerId: 9, bubbles: true }));
    requestAnimationFrame(() => requestAnimationFrame(() => { const after = [v3.yawG.rotation.y, v3.spin]; cv.dispatchEvent(new PointerEvent('pointerup', { pointerId: 9, bubbles: true })); r([y0, ...after]); }));
  }));
  check(jump[2] === 0 && Math.abs(jump[1] - jump[0]) < .01, `a drag during the turn stops it without a jump (${jump[0].toFixed(3)} → ${jump[1].toFixed(3)})`);
  // pauses offscreen, carries on when back
  await win(page, 'snape'); await page.waitForFunction(() => __wand.v3.spin > 300, null, { timeout: 15000 });
  await page.setViewportSize({ width: 390, height: 150 }); await page.evaluate(() => { document.querySelector('#result').scrollTop = 99999; }); await sleep(500);
  check(await page.evaluate(() => document.querySelector('#rWand3d').getBoundingClientRect().bottom <= 0), 'the model is really off the screen');
  const c1 = await f(); await sleep(500); check((await f()) === c1, 'stops rendering when scrolled offscreen');
  await page.setViewportSize({ width: 390, height: 844 }); await page.evaluate(() => { document.querySelector('#result').scrollTop = 0; }); await sleep(300); const e = await f(); await sleep(400); check((await f()) > e, 'resumes the turn when back on screen');
  check(!errors.length, 'no page errors ' + errors.join(' | '));
}
console.log('== reduced motion');
{
  const { page, errors } = await open(url, { viewport: { width: 390, height: 844 }, mobile: true });
  await page.emulateMedia({ reducedMotion: 'reduce' }); await page.reload({ waitUntil: 'load' });
  await win(page, 'harry'); await page.waitForFunction(() => document.querySelector('#rStage').classList.contains('is3d'), null, { timeout: 30000 }); await sleep(600);
  check(await page.evaluate(() => !__wand.v3.spin && Math.abs(__wand.v3.yawG.rotation.y - __wand.v3.yaw) < .001), 'no automatic turn');
  check(!errors.length, 'no page errors ' + errors.join(' | '));
}
console.log('== three.js blocked');
{
  const { page, errors } = await open(url, { route: p => p.route(/three/, r => r.abort()) });
  await win(page, 'luna'); await sleep(1500);
  const s = await page.evaluate(() => ({ is3d: document.querySelector('#rStage').classList.contains('is3d'), op: getComputedStyle(document.querySelector('#rWand')).opacity }));
  check(!s.is3d && s.op === '1', 'falls back to the 2D drawing');
  check(!errors.length, 'no page errors ' + errors.join(' | '));
}
console.log('== WebGL unavailable');
{
  const { page, errors } = await open(url, { init: `HTMLCanvasElement.prototype.getContext = (o => function (t, ...a) { return /webgl/.test(t) ? null : o.call(this, t, ...a); })(HTMLCanvasElement.prototype.getContext);` });
  await win(page, 'snape'); await page.waitForFunction(() => __wand.v3.three, null, { timeout: 30000 }); await sleep(500);
  const is3d = await page.evaluate(() => document.querySelector('#rStage').classList.contains('is3d'));
  check(!is3d, 'falls back to the 2D drawing');
  check(!errors.filter(e => !/WebGL/.test(e)).length, 'no page errors ' + errors.join(' | '));
}
await closeAll(); srv.close();
console.log(fails.length ? `\n${fails.length} FAILED:\n- ${fails.join('\n- ')}` : '\nall passed');
process.exit(fails.length ? 1 : 0);
