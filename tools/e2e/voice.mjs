// The Hat's voice: what loads, what plays, and that the game goes on muted or without the files.
//   node tools/e2e/voice.mjs
import { closeAll, serve, open, sleep } from './lib.mjs';
const { srv, url } = await serve(), fails = [];
const check = (ok, what) => { console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) fails.push(what); };
const inHall = page => page.waitForFunction(() => __hall.st.phase === 'hall' && document.querySelector('#nBtns button'), null, { timeout: 25000 });
const enterHall = async page => { await page.evaluate(() => document.querySelector('#cta').click()); await inHall(page); };
const buttons = page => page.$$eval('#nBtns button', b => b.map(x => x.textContent));
const press = (page, i = 0) => page.evaluate(n => document.querySelectorAll('#nBtns button')[n].click(), i);
async function game(page, onQ) { const asked = []; await page.waitForFunction(() => document.querySelectorAll('#nBtns button').length >= 2 && __hall.st.picking, null, { timeout: 15000 }); for (let i = 0; i < 3; i++) { await page.waitForFunction(n => __hall.st.picking && __hall.st.step === n && document.querySelector('#nHand').textContent, i, { timeout: 15000 }); await sleep(450); const s = await page.evaluate(() => { const q = __hall.st.questions[__hall.st.step]; return { id: q.id, cat: q.cat, order: q.o.map(o => o.u), hand: document.querySelector('#nHand').textContent, btns: [...document.querySelectorAll('#nBtns button')].map(b => b.textContent) }; }); asked.push(s); if (onQ) await onQ(s); await press(page, Math.floor(Math.random() * s.btns.length)); } await page.waitForFunction(() => document.querySelector('#nBtns').classList.contains('wish'), null, { timeout: 15000 }); return asked; }
const wishPick = (page, i) => page.evaluate(n => document.querySelectorAll('#nBtns .ban')[n].click(), i);
const wide = (page, i) => page.evaluate(n => document.querySelectorAll('#nBtns .wide')[n].click(), i);
const toCard = page => page.waitForFunction(() => document.querySelector('#result').classList.contains('show'), null, { timeout: 15000 });

console.log('== the voice');
for (const [name, opts] of [['sound on', {}], ['sound off', { init: `localStorage.setItem('wand-sound', '0');` }], ['files missing', { route: async p => p.route(u => /\/audio\/hat\//.test(u.pathname), r => r.fulfill({ status: 404, body: '' })) }]]) {
  const reqs = [], { browser, page, errors } = await open(url + 'sorting', { viewport: { width: 390, height: 844 }, mobile: true, ...opts, route: async p => { p.on('request', r => { const m = /\/audio\/hat\/(.+)\.mp3$/.exec(r.url()); if (m) reqs.push(m[1]); }); if (opts.route) await opts.route(p); } });
  await page.evaluate(() => document.querySelector('#cta').click()); await page.waitForFunction(() => __hall.st.phase === 'hall' && document.querySelector('#nBtns button'), null, { timeout: 25000 });
  if (name === 'sound on') await page.waitForFunction(() => __hall.VOICE.played.includes('introI'), null, { timeout: 15000 }); await sleep(1500); await press(page); const a = await game(page); await wide(page, 0); await toCard(page);
  const v = await page.evaluate(() => ({ played: __hall.VOICE.played.slice(), take: __hall.st.take, house: __hall.st.house, mine: __hall.st.questions.flatMap(q => [q.id, q.id + 'r1', q.id + 'r2', ...q.o.filter(o => o.r).map(o => o.r[2])]) }));
  if (name === 'sound on') {
    const gaps = await page.evaluate(() => __hall.VOICE.gaps || []);
    check(gaps.length >= 4 && gaps.every(g => g >= 650), `a pause between lines: ${gaps.map(Math.round).join(' ')} ms`);
    check(['introH', 'introI'].every(x => v.played.includes(x)), `the Hat greets aloud: ${v.played.slice(0, 2).join(', ')}`);
    check(a.every(q => v.played.includes(q.id)), 'every question is said aloud');
    check(v.played.includes('wish') && v.played.includes(`house${v.house}-${v.take}`), `the wish and the verdict are said: house${v.house}-${v.take}`);
    check(reqs.length < 45 && reqs.filter(x => /^[tsw]\d/.test(x)).every(x => v.mine.includes(x)), `only this game's lines load: ${reqs.length} files`);
  } else if (name === 'sound off') check(!reqs.length && !v.played.length, 'with sound off nothing loads or plays');
  else check(v.house && !v.played.length, 'without the files the game still ends, silently');
  const real = errors.filter(e => !(name === 'files missing' && /404/.test(e))); check(!real.length, `${name}: no page errors ` + real.join(' | ')); await browser.close();
}
await closeAll();
await closeAll(); srv.close();
console.log(fails.length ? `\n${fails.length} FAILED:\n- ${fails.join('\n- ')}` : '\nall passed');
process.exit(fails.length ? 1 : 0);
