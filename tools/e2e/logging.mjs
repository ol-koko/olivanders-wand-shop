// One anonymous row per game from the live host only, and the game never waits for it. Supabase is intercepted, so nothing is written.
//   node tools/e2e/logging.mjs
import { closeAll, serve, open, enter, choosePointer, pointerGame } from './lib.mjs';
const { srv, url } = await serve(), fails = [];
const check = (ok, what) => { console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) fails.push(what); };
const LIVE = 'https://olivanders-wand-shop.vercel.app/', KEYS = 'amp,attempts,curl,device_type,flow,input_mode,language,sharp,speed,wand_id';
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
console.log('== other hosts send nothing');
{ const reqs = [], s = await play(url, PHONE, async page => { await page.route(u => u.hostname.endsWith('.supabase.co'), r => { reqs.push(r.request()); return r.abort(); }); });
  check(s.game.done && reqs.length === 0, 'localhost: no request'); }
await closeAll(); srv.close();
console.log(fails.length ? `\n${fails.length} FAILED:\n- ${fails.join('\n- ')}` : '\nall passed');
process.exit(fails.length ? 1 : 0);
