// Hand tracking on its own thread, and the fallback when the worker can't start.
//   node tools/e2e/camworker.mjs
import { closeAll, serve, open, enter, chooseCamera, sleep } from './lib.mjs';
const { srv, url } = await serve(), fails = [];
const check = (ok, what) => { console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) fails.push(what); };
const init = `window.__long = []; new PerformanceObserver(l => { for (const e of l.getEntries()) __long.push(Math.round(e.duration)); }).observe({ entryTypes: ['longtask'] });`;
async function run(name, route) {
  console.log('== ' + name);
  const { browser, page, errors } = await open(url, { viewport: { width: 1440, height: 900 }, video: 'wave.y4m', init, route });
  await enter(page); await sleep(500); await chooseCamera(page);
  await page.waitForFunction(() => __wand.cam.on, null, { timeout: 90000, polling: 100 });
  await page.evaluate(() => { __long.length = 0; window.__seen = false; new MutationObserver(() => { if (document.querySelector('#camBox').classList.contains('seen')) __seen = true; }).observe(document.querySelector('#camBox'), { attributes: true }); });
  await page.waitForFunction(() => __wand.st.cap, null, { timeout: 60000 }); await sleep(7000);
  const r = await page.evaluate(() => ({ worker: !!__wand.cam.worker, hl: !!__wand.cam.hl, seen: __seen, delegate: __wand.cam.delegate, sound: A.ctx && A.ctx.state, long: __long }));
  await browser.close(); return { ...r, errors: errors.filter(e => !/INFO:|OpenGL error|Graph successfully/.test(e)) };
}
let r = await run('on its own thread');
check(r.worker && !r.hl, `tracking runs in the worker, on ${r.delegate}`); check(r.seen, 'it finds the hand'); check(r.sound === 'running', 'the sound keeps running');
console.log('    longest tasks on the page: ' + r.long.sort((a, b) => b - a).slice(0, 3).join(', ') + ' ms'); check(!r.long.some(x => x > 800), 'the page never freezes while the hand is tracked'); check(!r.errors.length, 'no page errors ' + r.errors.join(' | '));
r = await run('when the worker can\'t start', p => p.route(/hand-worker/, x => x.abort()));
check(!r.worker && r.hl, 'it runs on the page instead'); check(r.seen, 'and still finds the hand'); check(!r.errors.length, 'no page errors ' + r.errors.join(' | '));
await closeAll(); srv.close();
console.log(fails.length ? `\n${fails.length} FAILED:\n- ${fails.join('\n- ')}` : '\nall passed');
process.exit(fails.length ? 1 : 0);
