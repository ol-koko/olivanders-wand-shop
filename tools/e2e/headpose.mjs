// The head-pose prototype: the gesture logic on made-up angles, then the page with a fake camera.
//   node tools/e2e/headpose.mjs
import { createRequire } from 'node:module';
import { closeAll, serve, open, sleep } from './lib.mjs';
const { createTracker, anglesFrom } = createRequire(import.meta.url)('../headpose.js'), fails = [];
const check = (ok, what) => { console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) fails.push(what); };
// Plays a list of [milliseconds, side] keyframes at 30 fps, moving smoothly between them.
function play(keys, o) { const tr = createTracker(o), out = { picks: [], aims: [], fills: [] }; let t = 1000; for (let k = 1; k < keys.length; k++) { const [, s0] = keys[k - 1], [d, s1] = keys[k]; for (let e = 0; e < d; e += 33) { const r = tr.update(t, { side: s0 + (s1 - s0) * e / d }); t += 33; out.fills.push(r.fill); if (r.picked !== null) out.picks.push(r.picked); if (out.aims.at(-1) !== r.aim) out.aims.push(r.aim); } } return out; }
console.log('== the gesture');
let r = play([[0, 0], [300, 15], [300, 15]]); check(r.aims.at(-1) === 3 && !r.picks.length && Math.max(...r.fills) === 0, `tilting right lights the last option at once, with no fill yet: ${r.aims.join()}`);
r = play([[0, 0], [300, 15], [1200, 15]]); check(!r.picks.length && Math.max(...r.fills) > .4 && Math.max(...r.fills) < 1, `then it fills as it is held: ${Math.max(...r.fills).toFixed(2)}`);
r = play([[0, 0], [300, -15], [300, -15]]); check(r.aims.at(-1) === 0, `tilting left lights the first: ${r.aims.join()}`);
r = play([[0, 0], [300, -7], [300, -7]]); check(r.aims.at(-1) === 1, `a small tilt lights the option next to the middle: ${r.aims.join()}`);
r = play([[0, 0], [300, 15], [2000, 15]]); check(r.picks.length === 1 && r.picks[0] === 3, `holding the tilt picks it: ${r.picks.join()}`);
r = play([[0, 0], [300, 15], [4000, 15]]); check(r.picks.length === 1, 'holding on picks only once');
r = play([[0, 0], [300, 15], [2000, 15], [300, 0], [300, 0], [300, 15], [2000, 15]]); check(r.picks.length === 2, 'straightening up allows the next pick');
r = play([[0, 0], [3000, 0]]); check(!r.picks.length && r.aims.every(a => a === null), 'a straight head lights and picks nothing');
r = play([[0, 0], [300, 15], [500, 15], [300, 0], [1500, 0]]); check(!r.picks.length, 'straightening up cancels');
r = play([[0, 0], [200, 3.8], [2500, 3.8]]); check(!r.picks.length, 'a slight lean picks nothing');
r = play([[0, 0], [300, 15], [1000, 15], [200, -15], [1000, -15]]); check(!r.picks.length, 'moving to another option starts the fill again');
r = play([[0, 0], [300, 15], [450, 15], [250, -15], [450, -15], [250, 15], [450, 15]]); check(!r.picks.length && Math.max(...r.fills) === 0, 'there is time to move between options without any fill');
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
