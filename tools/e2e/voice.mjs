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
for (const [name, opts] of [['sound on', { locale: 'en-US' }], ['Ukrainian', { locale: 'uk-UA' }], ['sound off', { init: `localStorage.setItem('wand-sound', '0');` }], ['files missing', { route: async p => p.route(u => /\/audio\/hat\//.test(u.pathname), r => r.fulfill({ status: 404, body: '' })) }]]) {
  const reqs = [], { browser, page, errors } = await open(url + 'sorting', { viewport: { width: 390, height: 844 }, mobile: true, ...opts, route: async p => { p.on('request', r => { const m = /\/audio\/hat\/(.+)\.mp3$/.exec(r.url()); if (m) reqs.push(m[1]); }); if (opts.route) await opts.route(p); } });
  await page.evaluate(() => document.querySelector('#cta').click()); await page.waitForFunction(() => __hall.st.phase === 'hall' && document.querySelector('#nBtns button'), null, { timeout: 25000 });
  if (name === 'sound on') await page.waitForFunction(() => __hall.VOICE.played.includes('introI'), null, { timeout: 15000 });
  if (name === 'Ukrainian') await page.waitForFunction(() => __hall.VOICE.played.includes('ua/introI'), null, { timeout: 15000 }); await sleep(1500); await press(page); const a = await game(page); await wide(page, 0); await toCard(page);
  const v = await page.evaluate(() => ({ played: __hall.VOICE.played.slice(), take: __hall.st.take, house: __hall.st.house, mine: __hall.st.questions.flatMap(q => [q.id, q.id + 'r1', q.id + 'r2', ...q.o.filter(o => o.r).map(o => o.r[2])]) }));
  if (name === 'sound on') {
    const gaps = await page.evaluate(() => __hall.VOICE.gaps || []);
    check(gaps.length >= 4 && gaps.every(g => g >= 650), `a pause between lines: ${gaps.map(Math.round).join(' ')} ms`);
    check(['introH', 'introI'].every(x => v.played.includes(x)), `the Hat greets aloud: ${v.played.slice(0, 2).join(', ')}`);
    check(a.every(q => v.played.includes(q.id)), 'every question is said aloud');
    check(v.played.includes('wish') && v.played.includes(`house${v.house}-${v.take}`), `the wish and the verdict are said: house${v.house}-${v.take}`);
    check(reqs.length < 45 && reqs.filter(x => /^[tsw]\d/.test(x)).every(x => v.mine.includes(x)), `only this game's lines load: ${reqs.length} files`);
  } else if (name === 'Ukrainian') {
    const pick = { G: 3, H: 2, R: 3, S: 3 }[v.house];
    check(v.played.length > 6 && v.played.every(x => x.startsWith('ua/')) && reqs.every(x => x.startsWith('ua/')), `in Ukrainian the Hat speaks Ukrainian: ${v.played.slice(0, 3).join(', ')}`);
    check(v.played.includes(`ua/house${v.house}-${pick}`), `and says the chosen take of the house: ua/house${v.house}-${pick}`);
  } else if (name === 'sound off') check(!reqs.length && !v.played.length, 'with sound off nothing loads or plays');
  else check(v.house && !v.played.length, 'without the files the game still ends, silently');
  const real = errors.filter(e => !(name === 'files missing' && /404/.test(e))); check(!real.length, `${name}: no page errors ` + real.join(' | ')); await browser.close();
}
console.log('== with a wish: the wish line, then the house with the chime, then the card');
{ const SPY = `window.__osc = []; { const AC = window.AudioContext; window.AudioContext = class extends AC { createOscillator() { __osc.push(performance.now()); return super.createOscillator(); } }; }`;
  const { browser, page, errors } = await open(url + 'sorting', { viewport: { width: 390, height: 844 }, mobile: true, locale: 'en-US', init: SPY });
  await enterHall(page); await page.waitForFunction(() => __hall.VOICE.played.includes('introI'), null, { timeout: 15000 }); await sleep(1500); await press(page); await game(page);
  await wishPick(page, 0); await sleep(300);
  await page.evaluate(() => { window.__t = {}; new MutationObserver(() => { if (!__t.card && document.querySelector('#result').classList.contains('show')) __t.card = performance.now(); if (!__t.land && document.querySelector('.rcard').classList.contains('thud')) __t.land = performance.now(); }).observe(document.querySelector('#result'), { attributes: true, subtree: true }); const p = __hall.VOICE.played, push = p.push.bind(p); p.push = (...x) => { for (const id of x) __t[id.replace(/^ua\//, '')] = performance.now(); return push(...x); }; });
  await page.evaluate(() => document.querySelectorAll('#nBtns .wide')[0].click());
  await toCard(page); await sleep(2500);
  const t = await page.evaluate(() => ({ ...__t, oscLand: __osc.filter(x => x > (__t.land || 0) - 50 && x < (__t.land || 0) + 400).length, osc: __osc.filter(x => { const h = __t[Object.keys(__t).find(k => /^house[GSRH]/.test(k))]; return x > h - 900 && x < h + 300; }).length, kind: Object.keys(__t).find(k => /^(got|denied)\d$/.test(k)), house: Object.keys(__t).find(k => /^house[GSRH]/.test(k)) }));
  check(t.house && t[t.house] < t.card, `the house is said before the card opens (${t.house})`);
  check(t.osc >= 4, `the chime plays with the house and the rising dust: ${t.osc} tones`); check(t.oscLand < 4, `no chime when the crest lands: ${t.oscLand} tones`);
  check(t.kind && t[t.kind] < t[t.house] && t[t.house] < t.card, `the wish line "${t.kind}" comes before the house, the house before the card`);
  check(t.kind !== 'got1', 'a granted wish always hears got2');
  check(!errors.length, 'no page errors ' + errors.join(' | ')); await browser.close(); }
await closeAll(); srv.close();
console.log(fails.length ? `\n${fails.length} FAILED:\n- ${fails.join('\n- ')}` : '\nall passed');
process.exit(fails.length ? 1 : 0);
