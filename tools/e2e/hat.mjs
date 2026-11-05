// The Hat in the Great Hall: full games, every question on small screens, the wand's first impression.
//   node tools/e2e/hat.mjs
import { closeAll, serve, open, sleep } from './lib.mjs';
const { srv, url } = await serve(), fails = [];
const check = (ok, what) => { console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) fails.push(what); };
const inHall = page => page.waitForFunction(() => __hall.st.phase === 'hall' && document.querySelector('#nBtns button'), null, { timeout: 25000 });
const enterHall = async page => { await page.evaluate(() => document.querySelector('#cta').click()); await inHall(page); };
const buttons = page => page.$$eval('#nBtns button', b => b.map(x => x.textContent));
const press = (page, i = 0) => page.evaluate(n => document.querySelectorAll('#nBtns button')[n].click(), i);
async function game(page, onQ) { const asked = []; await page.waitForFunction(() => document.querySelectorAll('#nBtns button').length >= 2 && __hall.st.picking, null, { timeout: 15000 }); for (let i = 0; i < 3; i++) { await page.waitForFunction(n => __hall.st.picking && __hall.st.step === n && document.querySelector('#nHand').textContent, i, { timeout: 15000 }); await sleep(450); const s = await page.evaluate(() => { const q = __hall.st.questions[__hall.st.step]; return { id: q.id, cat: q.cat, order: q.o.map(o => o.u), hand: document.querySelector('#nHand').textContent, btns: [...document.querySelectorAll('#nBtns button')].map(b => b.textContent) }; }); asked.push(s); if (onQ) await onQ(s); await press(page, Math.floor(Math.random() * s.btns.length)); } await page.waitForFunction(() => __hall.st.house && document.querySelectorAll('#nBtns button').length === 2, null, { timeout: 15000 }); return asked; }

console.log('== a full game');
for (const [w, h] of [[390, 844], [1440, 900]]) {
  const reqs = [], { browser, page, errors } = await open(url + 'sorting', { viewport: { width: w, height: h }, mobile: w < 768, route: async p => p.on('request', r => reqs.push(r.url())) });
  await enterHall(page); check((await buttons(page))[0] === 'Вдягти', `${w}: the Hat opens with one button`);
  const spot = () => page.evaluate(() => { const h = document.querySelector('#hat'); return h.style.bottom + ' ' + h.style.width; }), spot0 = await spot(); await press(page);
  const a = await game(page, async () => { if (await spot() !== spot0) check(false, `${w}: the Hat moved between notes`); });
  check(await spot() === spot0, `${w}: the Hat keeps its place through every note: ${spot0}`);
  check(a.map(q => q.cat).join() === '1,2,3', `${w}: one question per category, then the result: ${a.map(q => q.id).join(' ')}`);
  check(a.every(q => q.btns.join() === q.order.join() && q.btns.length >= 2 && q.btns.length <= 4), `${w}: the buttons are the shuffled options`);
  const r = await page.evaluate(() => ({ house: __hall.st.house, hand: document.querySelector('#nHand').textContent, seen: JSON.parse(localStorage.getItem('hat-seen')), page: document.body.innerText }));
  check('GSRH'.includes(r.house) && /!$/.test(r.hand), `${w}: the Hat names a house: ${r.hand}`);
  check(a.every(q => r.seen.includes(q.id)), `${w}: asked questions are stored`);
  check(!/\d\s*\/\s*\d|запитання \d|question \d/i.test(r.page), `${w}: no counter on screen`);
  await press(page); const b = await game(page); check(!b.some(q => a.some(x => x.id === q.id)), `${w}: Once more asks new questions: ${b.map(q => q.id).join(' ')}`);
  const shops = await buttons(page); check(shops[1] === 'До крамниці', `${w}: the result can lead back to the shop`);
  await Promise.all([page.waitForURL(u => new URL(u).pathname === '/'), press(page, 1)]); check(await page.evaluate(() => !!document.querySelector('#cta')), `${w}: and the shop opens`);
  check(!reqs.some(u => /supabase/.test(u)), `${w}: nothing is logged`); check(!errors.length, 'no page errors ' + errors.join(' | '));
  await browser.close();
}
await closeAll();
console.log('== every question fits, with the Hat clear of the top buttons');
for (const [w, h] of [[320, 568], [360, 662], [390, 844], [844, 390], [1440, 900]]) {
  const { browser, page, errors } = await open(url + 'sorting', { viewport: { width: w, height: h }, mobile: w < 1000 });
  await enterHall(page);
  for (const l of ['ua', 'en']) { await page.evaluate(x => document.querySelector(`#lang button[data-l="${x}"]`).click(), l);
    const bad = await page.evaluate(async x => { const { POOL, setNote, placeHat, st } = __hall, out = []; for (const q of POOL) { setNote(() => ({ kicker: 'K', hand: x === 'en' ? q.en : q.ua, btns: q.o.map(o => ({ label: x === 'en' ? o.e : o.u, ghost: true, fn() { } })) }), true); await new Promise(r => requestAnimationFrame(r)); placeHat(); const n = document.querySelector('#note').getBoundingClientRect(), bar = document.querySelector('.topbar').getBoundingClientRect(), hat = document.querySelector('#hat'), hb = hat.getBoundingClientRect(), wide = [...document.querySelectorAll('#nBtns button')].some(b => b.getBoundingClientRect().right > innerWidth + 1); if (n.top < bar.bottom || n.bottom > innerHeight + 1 || wide || (getComputedStyle(hat).display !== 'none' && hb.top < bar.bottom - 14)) out.push(`${q.id} note ${Math.round(n.top)}-${Math.round(n.bottom)} hat ${Math.round(hb.top)}`); } return out; }, l);
    check(!bad.length, `${w}×${h} ${l}: all ${36} questions fit ${bad.slice(0, 5).join(', ')}`); }
  check(!errors.length, 'no page errors ' + errors.join(' | ')); await browser.close();
}
await closeAll();
console.log('== the wand as a first impression');
{ const { browser, page } = await open(url + 'sorting', { viewport: { width: 390, height: 844 }, mobile: true, init: `localStorage.setItem('wand-last', JSON.stringify({ id: 'harry', traits: { speed: .95, amp: .95, sharp: .5, flow: .5, curl: .5 }, at: Date.now() }));` });
  await enterHall(page); const r = await page.evaluate(() => ({ wand: __hall.st.wand, instr: document.querySelector('#nInstr').textContent })); check(r.wand === 'G' && /паличка|махаєш/i.test(r.instr), `a recent wand counts and the Hat mentions it: ${r.wand}, ${r.instr}`); await browser.close(); }
{ const { browser, page } = await open(url + 'sorting', { viewport: { width: 390, height: 844 }, mobile: true, init: `localStorage.setItem('wand-last', JSON.stringify({ id: 'harry', traits: { speed: .95, amp: .95, sharp: .5, flow: .5, curl: .5 }, at: Date.now() - 2 * 864e5 }));` });
  await enterHall(page); check(await page.evaluate(() => __hall.st.wand) === null, 'an old wand no longer counts'); await browser.close(); }
await closeAll(); srv.close();
console.log(fails.length ? `\n${fails.length} FAILED:\n- ${fails.join('\n- ')}` : '\nall passed');
process.exit(fails.length ? 1 : 0);
