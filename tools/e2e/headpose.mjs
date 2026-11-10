// The head-pose prototype: the gesture logic on made-up angles, then the page with a fake camera.
//   node tools/e2e/headpose.mjs
import { createRequire } from 'node:module';
import { closeAll, serve, open, sleep } from './lib.mjs';
const { createTracker, anglesFrom } = createRequire(import.meta.url)('../headpose.js'), fails = [];
const check = (ok, what) => { console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) fails.push(what); };
// Plays a list of [milliseconds, side, pitch] keyframes at 30 fps, moving smoothly between them.
function play(keys, o) { const tr = createTracker(o), out = { picks: [], aims: [] }; let t = 1000; for (let k = 1; k < keys.length; k++) { const [d0, s0, p0] = keys[k - 1], [d, s1, p1] = keys[k]; void d0; for (let e = 0; e < d; e += 33) { const u = e / d, r = tr.update(t, { side: s0 + (s1 - s0) * u, pitch: p0 + (p1 - p0) * u }); t += 33; if (r.picked !== null) out.picks.push(r.picked); if (out.aims.at(-1) !== r.aim) out.aims.push(r.aim); } } return out; }
const nod = (s, depth = 14) => [[150, s, depth], [150, s, 0]];
console.log('== the gesture');
let r = play([[0, 0, 0], [400, 15, 0], [500, 15, 0]]); check(r.aims.at(-1) === 3 && !r.picks.length, `tilting right lights the last option: ${r.aims.join()}`);
r = play([[0, 0, 0], [400, -15, 0], [500, -15, 0]]); check(r.aims.at(-1) === 0, `tilting left lights the first: ${r.aims.join()}`);
r = play([[0, 0, 0], [400, -6, 0], [500, -6, 0]]); check(r.aims.at(-1) === 1, `a small tilt lights the option next to the middle: ${r.aims.join()}`);
r = play([[0, 0, 0], [400, 15, 0], [500, 15, 0], ...nod(15)]); check(r.picks.length === 1 && r.picks[0] === 3, `a nod picks it: ${r.picks.join()}`);
r = play([[0, 0, 0], [300, 0, 0], ...nod(0)]); check(!r.picks.length, 'a nod with nothing lit picks nothing');
r = play([[0, 0, 0], [400, 15, 0], [40, 15, 0], ...nod(15)]); check(r.picks.length <= 1, 'one nod is one pick');
r = play([[0, 0, 0], [400, 15, 0], [500, 15, 0], [2500, 15, 18], [800, 15, 18], [2500, 15, 0]]); check(!r.picks.length, 'looking down slowly and back picks nothing');
r = play([[0, 0, 0], [400, 15, 0], [500, 15, 0], [180, -10, 14], [180, -10, 0]]); check(!r.picks.length, 'turning the head during a dip picks nothing');
r = play([[0, 0, 0], [400, 15, 0], [500, 15, 0], [150, 15, 5], [150, 15, 0]]); check(!r.picks.length, 'a small dip picks nothing');
r = play([[0, 0, 0], [400, 15, 0], [500, 15, 0], ...nod(15), [120, 15, 0], ...nod(15)]); check(r.picks.length === 1, 'a second quick nod is ignored');
{ const a = anglesFrom([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]); check(Math.abs(a.roll) + Math.abs(a.yaw) + Math.abs(a.pitch) < 1e-6, 'a head facing straight reads zero'); }

console.log('== the page, with a fake camera');
const { srv, url } = await serve();
{ const { browser, page, errors } = await open(url + 'tools/headpose.html', { viewport: { width: 1000, height: 800 }, fakeCam: true }); await page.waitForFunction(() => window.__ready, null, { timeout: 20000 });
  await page.click('#go'); await page.waitForFunction(() => __proto.run, null, { timeout: 60000 }); check(true, 'the model loads and the camera starts');
  await sleep(1500); const st = await page.textContent('#st'); check(/обличчя|прямо/.test(st), `without a face it says so: ${st}`);
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { value: true, configurable: true }); document.dispatchEvent(new Event('visibilitychange')); }); await sleep(200);
  check(await page.evaluate(() => !__proto.run && !__proto.stream), 'the camera stops when the tab is hidden'); const real = errors.filter(e => !/INFO:/.test(e)); check(!real.length, 'no page errors ' + real.join(' | ')); await browser.close(); } // MediaPipe writes its INFO lines to console.error
await closeAll(); srv.close();
console.log(fails.length ? `\n${fails.length} FAILED:\n- ${fails.join('\n- ')}` : '\nall passed');
process.exit(fails.length ? 1 : 0);
