// The 3D view on the result card: loads lazily, turns under a drag, pauses offscreen, falls back to 2D.
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
  const yaw0 = await page.evaluate(() => __wand.v3.yaw), box = await page.locator('#rWand3d').boundingBox();
  await page.mouse.move(box.x + 100, box.y + 70); await page.mouse.down(); await page.mouse.move(box.x + 220, box.y + 70, { steps: 8 }); await page.mouse.up();
  const yaw1 = await page.evaluate(() => __wand.v3.yaw); check(Math.abs(yaw1 - yaw0) > .5, `a drag turns the wand (yaw ${yaw0.toFixed(2)} → ${yaw1.toFixed(2)})`);
  await page.screenshot({ path: path.join(SHOTS, '3d-turned.png') });
  const f = () => page.evaluate(() => __wand.v3.frames), a = await f(); await sleep(500); const b = await f(); check(b > a, `renders while visible (${b - a} frames in 0.5 s)`);
  await page.setViewportSize({ width: 390, height: 420 }); await sleep(300); // the card fits a full phone screen, so make it short enough to scroll the model away
  await page.evaluate(() => { document.querySelector('#result').scrollTop = 99999; }); await sleep(400); const c = await f(); await sleep(500); const d = await f();
  check(d === c, 'stops rendering when scrolled offscreen');
  check((await page.evaluate(() => document.querySelector('#result').scrollTop)) > 150, 'the page really scrolled');
  await page.evaluate(() => { document.querySelector('#result').scrollTop = 0; }); await sleep(400); const e = await f(); await sleep(400); check((await f()) > e, 'resumes when back on screen');
  check(!errors.length, 'no page errors ' + errors.join(' | '));
}
console.log('== three.js blocked');
{
  const { page, errors } = await open(url, { route: p => p.route(/three/, r => r.abort()) });
  await win(page, 'luna'); await sleep(1500);
  const s = await page.evaluate(() => ({ is3d: document.querySelector('#rStage').classList.contains('is3d'), hint: !document.querySelector('#rSpin').hidden, op: getComputedStyle(document.querySelector('#rWand')).opacity }));
  check(!s.is3d && !s.hint && s.op === '1', 'falls back to the 2D drawing, no hint');
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
