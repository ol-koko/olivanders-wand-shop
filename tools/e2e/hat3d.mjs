// The Hat in 3D: it takes over from the drawing, follows the same signals, and the drawing stays as the fallback.
//   node tools/e2e/hat3d.mjs
import { closeAll, serve, open, sleep } from './lib.mjs';
const { srv, url } = await serve(), fails = [];
const check = (ok, what) => { console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) fails.push(what); };
const init = `localStorage.setItem('wand-sound', '0'); window.__long = 0; new PerformanceObserver(l => { for (const e of l.getEntries()) __long = Math.max(__long, e.duration); }).observe({ entryTypes: ['longtask'] });`;
const enterHall = async page => { await page.evaluate(() => document.querySelector('#cta').click()); await page.waitForFunction(() => __hall.st.phase === 'establish', null, { timeout: 25000 }); await page.keyboard.press('Shift'); await page.waitForFunction(() => __hall.st.phase === 'hall' && document.querySelector('#hat').classList.contains('in'), null, { timeout: 25000 }); };
const ready = page => page.waitForFunction(() => __hall.H3.on, null, { timeout: 40000 });

for (const [w, h] of [[390, 844], [1440, 900]]) {
  console.log(`== ${w}×${h}`);
  const { browser, page, errors } = await open(url + 'sorting', { viewport: { width: w, height: h }, mobile: w < 768, init });
  await ready(page); console.log('    longest task while building: ' + Math.round(await page.evaluate(() => __long)) + ' ms');
  await enterHall(page); await sleep(900);
  const s = await page.evaluate(() => { const c = document.querySelector('#hat3d'), r = c.getBoundingClientRect(), hb = document.querySelector('#hat').getBoundingClientRect(); return { on: document.querySelector('#hat').classList.contains('d3'), box: Math.abs(r.width - hb.width) < 2, svg: getComputedStyle(document.querySelector('#hat svg')).opacity, canvas: getComputedStyle(c).opacity, filter: getComputedStyle(document.querySelector('#hat')).filter }; });
  check(s.on && s.box, '3D takes over, in the Hat\'s place'); check(+s.svg < .05 && +s.canvas > .95, `the drawing is hidden behind it: ${s.svg}/${s.canvas}`); check(s.filter === 'none', 'no CSS shadow redrawn every frame');
  const pose = () => page.evaluate(() => ({ ...__hall.H3.pose, yaw: __hall.H3.yaw }));
  await page.evaluate(() => { const f = __hall.FACE; f.focus = { x: 0, y: innerHeight * .5, at: performance.now() + 1e5 }; }); await sleep(900); const left = await pose(); check(left.lookX < -.3 && left.yaw < -.03, `it looks and turns to the side: ${left.lookX.toFixed(2)}, ${left.yaw.toFixed(2)}`);
  await page.evaluate(() => { __hall.FACE.focus = null; window.__keep = setInterval(() => document.querySelector('#hat').classList.add('furrow'), 16); }); await sleep(700); check((await pose()).furrow > .5, 'the brows follow the line'); await page.evaluate(() => { clearInterval(__keep); document.querySelector('#hat').classList.remove('furrow'); });
  await page.evaluate(() => { __hall.st.deciding = false; SortingLogic.sortHouse = () => 'R'; __hall.st.wish = null; __hall.decide(); }); await sleep(1400); const th = await pose(); check(th.furrow > .8 && th.droop > .5, `thinking: brows down, tip droops: ${th.furrow.toFixed(2)}, ${th.droop.toFixed(2)}`);
  await page.waitForFunction(() => document.querySelector('#hat').classList.contains('crowned'), null, { timeout: 15000 }); await sleep(1200); const cr = await pose(); check(cr.perk > .6 && cr.browUp > .8, `decided: tip up, brows up: ${cr.perk.toFixed(2)}, ${cr.browUp.toFixed(2)}`);
  await page.waitForFunction(() => document.querySelector('#result').classList.contains('show'), null, { timeout: 15000 }); await sleep(300); const a = await pose(); await sleep(400); const b = await pose(); check(a.yaw === b.yaw, 'it stops drawing behind the card');
  await page.evaluate(() => __hall.dropHat3D()); await sleep(900); check(await page.evaluate(() => !document.querySelector('#hat3d') && !document.querySelector('#hat').classList.contains('d3') && getComputedStyle(document.querySelector('#hat svg')).opacity > .95), 'dropping 3D brings the drawing back');
  check(!errors.length, 'no page errors ' + errors.join(' | ')); await browser.close();
}
console.log('== without three.js');
{ const { browser, page, errors } = await open(url + 'sorting', { viewport: { width: 390, height: 844 }, mobile: true, init, route: p => p.route(/three/, r => r.abort()) }); await sleep(2500); await enterHall(page); await sleep(500);
  check(await page.evaluate(() => !__hall.H3.on && !document.querySelector('#hat3d') && +getComputedStyle(document.querySelector('#hat svg')).opacity > .95), 'the drawn Hat stays'); check(!errors.length, 'no page errors ' + errors.join(' | ')); await browser.close(); }
console.log('== reduced motion');
{ const { browser, page } = await open(url + 'sorting', { viewport: { width: 390, height: 844 }, mobile: true, init }); await page.emulateMedia({ reducedMotion: 'reduce' }); await page.reload({ waitUntil: 'load' }); await ready(page); await enterHall(page); await sleep(800); const y = await page.evaluate(() => __hall.H3.yaw); check(y === 0, `it doesn't turn or sway: ${y}`); await browser.close(); }
await closeAll(); srv.close();
console.log(fails.length ? `\n${fails.length} FAILED:\n- ${fails.join('\n- ')}` : '\nall passed');
process.exit(fails.length ? 1 : 0);
