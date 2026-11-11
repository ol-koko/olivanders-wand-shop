// One anonymous row per game from the live host only, and the game never waits for it. Supabase is intercepted, so nothing is written.
//   node tools/e2e/logging.mjs
import { closeAll, serve, open, enter, choosePointer, pointerGame, sleep } from './lib.mjs';
const { srv, url } = await serve(), fails = [];
const check = (ok, what) => { console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) fails.push(what); };
const LIVE = 'https://olivanders-wand-shop.vercel.app/', KEYS = 'amp,attempts,curl,device_type,flow,input_mode,language,play_no,sharp,source,speed,wand_id,wave_dur,wave_len';
const live = (reqs, answer) => async page => {
  await page.route(u => u.hostname === 'olivanders-wand-shop.vercel.app', async r => { const res = await fetch(url + new URL(r.request().url()).pathname.slice(1)); await r.fulfill({ status: res.status, contentType: res.headers.get('content-type') || 'text/plain', body: Buffer.from(await res.arrayBuffer()) }); });
  await page.route(u => u.hostname.endsWith('.supabase.co'), r => { if (r.request().method() === 'POST') reqs.push(r.request()); return answer(r); });
};
const play = async (target, opts, route) => { const s = await open(target, { ...opts, route }); await enter(s.page); await choosePointer(s.page); s.game = await pointerGame(s.page, opts.viewport); return s; };
const OK = r => r.fulfill({ status: 201, headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*' } });

for (const [name, opts, device] of [['phone', { viewport: { width: 390, height: 844 }, mobile: true }, 'phone'], ['desktop', { viewport: { width: 1440, height: 900 } }, 'desktop']]) {
  console.log('== ' + name);
  const reqs = [], s = await play(LIVE, opts, live(reqs, OK));
  const winner = await s.page.evaluate(() => __wand.st.winner.id), attempts = await s.page.evaluate(() => __wand.st.attempt);
  check(s.game.done && reqs.length === 1, `one request for one game: ${reqs.length}`);
  const row = JSON.parse(reqs[0].postData()), h = await reqs[0].allHeaders();
  console.log('    ' + reqs[0].postData());
  check(Object.keys(row).sort().join() === KEYS, 'only the agreed fields');
  check(row.wand_id === winner && row.attempts === attempts && row.input_mode === 'pointer' && row.language === 'ua' && row.device_type === device, 'wand, attempts, input, language and device are right');
  check(['speed', 'amp', 'sharp', 'flow', 'curl'].every(k => row[k] >= 0 && row[k] <= 1), 'traits are between 0 and 1');
  check(row.source === null, 'a direct visit has no source');
  check(row.play_no === 1 && await s.page.evaluate(() => localStorage.getItem('wand-plays')) === '1', `a first game is play 1: ${row.play_no}`);
  check(row.wave_len > 0 && row.wave_dur > 0, `wave length and duration: ${row.wave_len}, ${row.wave_dur}`);
  check(!h.cookie && !h.authorization && h.prefer === 'return=minimal', 'no cookie, no authorization');
  check(!s.errors.length, 'no page errors ' + s.errors.join(' | '));
  await closeAll();
}
console.log('== the game never waits');
const PHONE = { viewport: { width: 390, height: 844 }, mobile: true };
for (const [what, answer] of [['server error', r => r.fulfill({ status: 500, headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*' } })], ['no network', r => r.abort()], ['no answer at all', () => { }]]) {
  const reqs = [], s = await play(LIVE, PHONE, live(reqs, answer));
  check(s.game.done && reqs.length === 1, `${what}: the card still appears`);
  await closeAll();
}
console.log('== a finger uses the touch scale, a mouse the pointer one');
{ const { page, browser } = await open(url, PHONE); await enter(page); await choosePointer(page); await page.waitForFunction(() => document.querySelector('#stage').classList.contains('on'));
  const cdp = await page.context().newCDPSession(page); await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 60, y: 200 }] });
  for (let i = 1; i <= 24; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 60 + i * 11, y: 200 + Math.sin(i / 2) * 60 }] }); await sleep(16); }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await sleep(300);
  const r = await page.evaluate(() => { const { st } = __wand, o = st.obs[0], M = Math.min(innerWidth, innerHeight), t = WandLogic.strokeMetrics(st.stroke, M, 'touch'), m = WandLogic.strokeMetrics(st.stroke, M, 'pointer'); return { got: o.speed, touch: t.speed, mouse: m.speed, gotAmp: o.amp, touchAmp: t.amp, mouseAmp: m.amp }; });
  check(r.got === r.touch && r.gotAmp === r.touchAmp && r.gotAmp > r.mouseAmp, `touch wave reads on the touch scale: amp ${r.gotAmp.toFixed(2)} (a mouse would read ${r.mouseAmp.toFixed(2)})`);
  await browser.close(); }
console.log('== the play counter');
{ const reqs = [], s = await play(LIVE, { ...PHONE, init: `if (!localStorage.getItem('wand-plays')) localStorage.setItem('wand-plays', '4');` }, live(reqs, OK)); const row = JSON.parse(reqs[0].postData());
  check(row.play_no === 5, `a fifth game is play 5: ${row.play_no}`); await s.page.reload({ waitUntil: 'load' }); await sleep(800);
  check(reqs.length === 1 && await s.page.evaluate(() => localStorage.getItem('wand-plays')) === '5', 'a reload sends nothing and counts nothing'); await closeAll(); }
{ const reqs = [], s = await play(LIVE, { ...PHONE, init: `Object.defineProperty(window, 'localStorage', { get() { throw new Error('closed'); } });` }, live(reqs, OK)); const row = JSON.parse(reqs[0].postData());
  check(s.game.done && reqs.length === 1 && row.play_no === null, `storage closed: the game finishes and play_no is null`); check(!s.errors.length, 'no page errors ' + s.errors.join(' | ')); await closeAll(); }
console.log('== where the visit came from');
{ const reqs = [], s = await play(LIVE + '?s=tg', PHONE, live(reqs, OK)); const row = JSON.parse(reqs[0].postData()), kept = await s.page.evaluate(() => sessionStorage.getItem('wand-src'));
  check(row.source === 'telegram' && kept === 'telegram' && !/[?&]s=|t\.me/.test(reqs[0].url() + reqs[0].postData()), `a tagged link names the source and sends no link: ${row.source}`); await closeAll(); }
{ const { page, browser } = await open(url, PHONE); const got = [];
  for (const [ua, ref, search, want] of [['Mozilla/5.0 Barcelona 300 Instagram 300', '', '', 'threads'], ['Mozilla/5.0 Instagram 300', '', '', 'instagram'], ['Mozilla/5.0 LinkedInApp', '', '', 'linkedin'], ['Mozilla/5.0', 'https://t.me/', '', 'telegram'], ['Mozilla/5.0', 'https://www.threads.net/x', '', 'threads'], ['Mozilla/5.0', 'https://www.google.com/', '', 'other'], ['Mozilla/5.0 FBAN', '', '', 'other'], ['Mozilla/5.0', '', '', null], ['Mozilla/5.0 Instagram', '', '?s=li', 'linkedin'], ['Mozilla/5.0', '', '?s=zz', 'other']])
    got.push([want, await page.evaluate(([ua, ref, search]) => new Function('navigator', 'document', 'location', 'sessionStorage', 'IN_APP', 'window', 'return (' + findSource + ')()')({ userAgent: ua }, { referrer: ref }, { search, hostname: 'olivanders-wand-shop.vercel.app' }, { getItem: () => null }, /FBAN/.test(ua), {}), [ua, ref, search])]);
  check(got.every(([a, b]) => a === b), 'apps, referrers and tags are told apart: ' + got.map(g => g[1]).join(', ')); await browser.close(); }
console.log('== other hosts send nothing');
{ const reqs = [], s = await play(url, PHONE, async page => { await page.route(u => u.hostname.endsWith('.supabase.co'), r => { reqs.push(r.request()); return r.abort(); }); });
  check(s.game.done && reqs.length === 0 && await s.page.evaluate(() => localStorage.getItem('wand-plays')) === null, 'localhost: no request, nothing counted'); }
await closeAll(); srv.close();
console.log(fails.length ? `\n${fails.length} FAILED:\n- ${fails.join('\n- ')}` : '\nall passed');
process.exit(fails.length ? 1 : 0);
