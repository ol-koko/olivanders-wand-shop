// The Hat in the Great Hall: full games, every question on small screens, the wand's first impression.
//   node tools/e2e/hat.mjs
import { closeAll, serve, open, sleep } from './lib.mjs';
const { srv, url } = await serve(), fails = [];
// Sound off here: the voice has its own test, and its pauses would make these games slow.
const quiet = (u, o = {}) => open(u, { ...o, init: `localStorage.setItem('wand-sound', '0');` + (o.init || '') });
const check = (ok, what) => { console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) fails.push(what); };
const inHall = page => page.waitForFunction(() => __hall.st.phase === 'hall' && document.querySelector('#nBtns button'), null, { timeout: 25000 });
// The first look at the Hall is skipped with a key, as a player can: tools/e2e/face.mjs checks it.
const enterHall = async page => { await page.evaluate(() => document.querySelector('#cta').click()); await page.waitForFunction(() => __hall.st.phase === 'establish', null, { timeout: 25000 }); await page.keyboard.press('Shift'); await inHall(page); };
const buttons = page => page.$$eval('#nBtns button', b => b.map(x => x.textContent));
const press = (page, i = 0) => page.evaluate(n => document.querySelectorAll('#nBtns button')[n].click(), i);
async function game(page, onQ) { const asked = []; await page.waitForFunction(() => document.querySelectorAll('#nBtns button').length >= 2 && __hall.st.picking, null, { timeout: 15000 }); for (let i = 0; i < 3; i++) { await page.waitForFunction(n => __hall.st.picking && __hall.st.step === n && document.querySelector('#nHand').textContent, i, { timeout: 15000 }); await sleep(450); const s = await page.evaluate(() => { const q = __hall.st.questions[__hall.st.step]; return { id: q.id, cat: q.cat, order: q.o.map(o => o.u), hand: document.querySelector('#nHand').textContent, btns: [...document.querySelectorAll('#nBtns button')].map(b => b.textContent) }; }); asked.push(s); if (onQ) await onQ(s); await press(page, Math.floor(Math.random() * s.btns.length)); } await page.waitForFunction(() => document.querySelector('#nBtns').classList.contains('wish'), null, { timeout: 15000 }); return asked; }
const wishPick = (page, i) => page.evaluate(n => document.querySelectorAll('#nBtns .ban')[n].click(), i);
const wide = (page, i) => page.evaluate(n => document.querySelectorAll('#nBtns .wide')[n].click(), i);
const toCard = page => page.waitForFunction(() => document.querySelector('#result').classList.contains('show'), null, { timeout: 15000 });

console.log('== a full game');
for (const [w, h] of [[390, 844], [1440, 900]]) {
  const reqs = [], { browser, page, errors } = await quiet(url + 'sorting', { viewport: { width: w, height: h }, mobile: w < 768, route: async p => p.on('request', r => reqs.push(r.url())) });
  await enterHall(page); check((await buttons(page))[0] === 'Вдягти капелюха', `${w}: the Hat opens with one button`);
  const spot = () => page.evaluate(() => { const h = document.querySelector('#hat'); return h.style.bottom + ' ' + h.style.width; }), spot0 = await spot(); await press(page);
  const a = await game(page, async () => { if (await spot() !== spot0) check(false, `${w}: the Hat moved between notes`); });
  check(await spot() === spot0, `${w}: the Hat keeps its place through every note: ${spot0}`);
  check(a.map(q => q.cat).join() === '1,2,3', `${w}: one question per category, then the result: ${a.map(q => q.id).join(' ')}`);
  check(a.every(q => q.btns.join() === q.order.join() && q.btns.length >= 2 && q.btns.length <= 4), `${w}: the buttons are the shuffled options`);
  check(await page.$$eval('#nBtns .ban', b => b.length) === 4, `${w}: the wish screen shows 4 banners`);
  check((await page.$$eval('#nBtns .wide', b => b.map(x => x.textContent)))[0] === 'Хай вирішує Капелюх', `${w}: letting the Hat decide is offered`);
  await wishPick(page, 1); check(await page.evaluate(() => __hall.st.wish === 'S' && document.querySelectorAll('#nBtns .ban')[1].classList.contains('want') && document.querySelectorAll('#nBtns .wide')[0].textContent === 'Готово, вирішуй'), `${w}: a banner can be picked`);
  await wide(page, 1); await wishPick(page, 0); check(await page.evaluate(() => __hall.st.avoid === 'G' && __hall.st.wish === 'S' && document.querySelectorAll('#nBtns .ban')[0].classList.contains('nope') && document.querySelector('#nInstr').textContent === 'А куди точно ні?'), `${w}: an unwanted house is an action on the same screen`);
  await wishPick(page, 1); check(await page.evaluate(() => __hall.st.avoid === 'S' && __hall.st.wish === null), `${w}: one house can't be both`);
  await wide(page, 1); await wishPick(page, 2); await wide(page, 0); await toCard(page); await sleep(300);
  const r = await page.evaluate(() => ({ house: __hall.st.house, wish: __hall.st.wish, avoid: __hall.st.avoid, name: document.querySelector('#rName').textContent, lore: document.querySelector('#rLore').textContent, seen: JSON.parse(localStorage.getItem('hat-seen')), page: document.body.innerText, fit: document.querySelector('.rcard').getBoundingClientRect().right <= innerWidth, share: !document.querySelector('#bShare').hidden || !document.querySelector('#bDown').hidden, credit: /Kokozei/.test(document.querySelector('#rCredit').textContent) }));
  check('GSRH'.includes(r.house) && r.wish === 'R' && r.avoid === 'S', `${w}: the Hat sorts with the wish: ${r.name}`);
  check(r.name && r.lore && r.fit && r.share && r.credit, `${w}: the card shows the house, a line, sharing and the credit`);
  check(a.every(q => r.seen.includes(q.id)), `${w}: asked questions are stored`);
  check(!/\d\s*\/\s*\d|запитання \d|question \d/i.test(r.page), `${w}: no counter on screen`);
  const img = await page.evaluate(async () => { const b = await __hall.makeCard(), i = await createImageBitmap(b); return [i.width, i.height]; }); check(img[0] === 1080 && img[1] === 1350, `${w}: the share image is ${img.join('×')}`);
  await page.evaluate(() => document.querySelector('#bAgain').click()); const b = await game(page); check(!b.some(q => a.some(x => x.id === q.id)), `${w}: Once more asks new questions: ${b.map(q => q.id).join(' ')}`);
  await wide(page, 0); await toCard(page); check(await page.evaluate(() => !document.querySelector('#rToShop').hidden && document.querySelector('#rToShop').getAttribute('href') === '/'), `${w}: without a wand the card points to the shop`);
  check(!reqs.some(u => /supabase/.test(u)), `${w}: nothing is logged from this host`); check(!errors.length, 'no page errors ' + errors.join(' | '));
  await browser.close();
}
await closeAll();
console.log('== every question fits, with the Hat clear of the top buttons');
for (const [w, h] of [[320, 568], [360, 662], [390, 844], [844, 390], [1440, 900]]) {
  const { browser, page, errors } = await quiet(url + 'sorting', { viewport: { width: w, height: h }, mobile: w < 1000 });
  await enterHall(page);
  for (const l of ['ua', 'en']) { await page.evaluate(x => document.querySelector(`#lang button[data-l="${x}"]`).click(), l);
    const bad = await page.evaluate(async x => { const { POOL, setNote, placeHat, st } = __hall, out = []; for (const q of POOL) { setNote(() => ({ kicker: 'K', hand: x === 'en' ? q.en : q.ua, btns: q.o.map(o => ({ label: x === 'en' ? o.e : o.u, ghost: true, fn() { } })) }), true); await new Promise(r => requestAnimationFrame(r)); placeHat(); const n = document.querySelector('#note').getBoundingClientRect(), bar = document.querySelector('.topbar').getBoundingClientRect(), hat = document.querySelector('#hat'), hb = hat.getBoundingClientRect(), wide = [...document.querySelectorAll('#nBtns button')].some(b => b.getBoundingClientRect().right > innerWidth + 1); if (n.top < bar.bottom || n.bottom > innerHeight + 1 || wide || (getComputedStyle(hat).display !== 'none' && hb.top < bar.bottom - 14)) out.push(`${q.id} note ${Math.round(n.top)}-${Math.round(n.bottom)} hat ${Math.round(hb.top)}`); } return out; }, l);
    check(!bad.length, `${w}×${h} ${l}: all ${36} questions fit ${bad.slice(0, 5).join(', ')}`); }
  check(!errors.length, 'no page errors ' + errors.join(' | ')); await browser.close();
}
await closeAll();
console.log('== the wish screen fits');
for (const [w, h] of [[320, 568], [360, 662], [390, 844], [844, 390], [1440, 900]]) {
  const { browser, page } = await quiet(url + 'sorting', { viewport: { width: w, height: h }, mobile: w < 1000 }); await enterHall(page);
  for (const l of ['ua', 'en']) { await page.evaluate(x => document.querySelector(`#lang button[data-l="${x}"]`).click(), l); await page.evaluate(() => { __hall.st.avoiding = true; __hall.showWish(); }); await sleep(120);
    const g = await page.evaluate(() => { const n = document.querySelector('#note').getBoundingClientRect(), bar = document.querySelector('.topbar').getBoundingClientRect(), overflow = [...document.querySelectorAll('#nBtns .ban span')].some(s => s.scrollWidth > s.parentElement.clientWidth + 1), hat = document.querySelector('#hat').getBoundingClientRect(), shown = getComputedStyle(document.querySelector('#hat')).display !== 'none'; return { top: Math.round(n.top), bar: Math.round(bar.bottom), bot: Math.round(n.bottom), overflow, hat: shown ? Math.round(hat.top) : null }; });
    check(g.top >= g.bar && g.bot <= h + 1 && !g.overflow && (g.hat === null || g.hat >= g.bar - 14), `${w}×${h} ${l}: fits ${JSON.stringify(g)}`); }
  await browser.close();
}
await closeAll();
console.log('== logging');
{ const LIVE = 'https://olivanders-wand-shop.vercel.app/', posts = [];
  const { browser, page, errors } = await quiet(LIVE + 'sorting', { viewport: { width: 390, height: 844 }, mobile: true, route: async p => { await p.route(u => u.hostname === 'olivanders-wand-shop.vercel.app', async r => { const pth = new URL(r.request().url()).pathname, res = await fetch(url + pth.slice(1)); await r.fulfill({ status: res.status, contentType: res.headers.get('content-type') || 'text/plain', body: Buffer.from(await res.arrayBuffer()) }); }); await p.route(u => u.hostname.endsWith('.supabase.co'), r => { if (r.request().method() === 'POST') posts.push(r.request()); return r.fulfill({ status: 201, headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*' } }); }); } });
  await enterHall(page); await press(page); const a = await game(page); await wishPick(page, 3); await wide(page, 1); await wishPick(page, 0); await wide(page, 0); await toCard(page);
  check(posts.length === 1 && /sorting_results$/.test(posts[0].url()), `one row per game: ${posts.length}`); const row = JSON.parse(posts[0].postData()); console.log('    ' + posts[0].postData());
  check(Object.keys(row).sort().join() === 'device_type,house,language,unwanted,wand_prior,wish', 'only the agreed fields, no answers'); check(row.wish === 'H' && row.unwanted === 'G' && row.wand_prior === false && 'GSRH'.includes(row.house), 'the values are right'); check(!(await posts[0].allHeaders()).cookie, 'no cookie'); check(!errors.length, 'no page errors ' + errors.join(' | ')); await browser.close(); }
await closeAll();
console.log('== reactions to one specific answer');
{ const { browser, page } = await quiet(url + 'sorting', { viewport: { width: 390, height: 844 }, mobile: true }); await enterHall(page);
  const r = await page.evaluate(async () => { const { POOL, st, answer } = __hall, out = []; for (const q of POOL) for (const o of q.o) { const own = !!o.r; for (let i = 0; i < (own ? 3 : 1); i++) { st.questions = [q, q, q]; st.step = 0; st.picking = true; answer(q, o); await new Promise(z => setTimeout(z, 700)); const hand = document.querySelector('#nHand').textContent; out.push({ id: q.id, own, ok: own ? hand === o.r[0] : !q.o.some(x => x.r && x.r[0] === hand) }); } } return out; });
  check(r.filter(x => x.own).length === 12 && r.every(x => x.ok), `the four option lines play right after their option, and never after another: ${r.filter(x => !x.ok).map(x => x.id).join(' ') || 'all right'}`); await browser.close(); }
await closeAll();
console.log('== the wand as a first impression');
{ const { browser, page } = await quiet(url + 'sorting', { viewport: { width: 390, height: 844 }, mobile: true, init: `localStorage.setItem('wand-last', JSON.stringify({ id: 'harry', traits: { speed: .95, amp: .95, sharp: .5, flow: .5, curl: .5 }, at: Date.now() }));` });
  await enterHall(page); const r = await page.evaluate(() => ({ wand: __hall.st.wand, instr: document.querySelector('#nInstr').textContent })); check(r.wand === 'G' && /паличка|змах/i.test(r.instr), `a recent wand counts and the Hat mentions it: ${r.wand}, ${r.instr}`); await browser.close(); }
{ const { browser, page } = await quiet(url + 'sorting', { viewport: { width: 390, height: 844 }, mobile: true, init: `localStorage.setItem('wand-last', JSON.stringify({ id: 'harry', traits: { speed: .95, amp: .95, sharp: .5, flow: .5, curl: .5 }, at: Date.now() - 2 * 864e5 }));` });
  await enterHall(page); check(await page.evaluate(() => __hall.st.wand) === null, 'an old wand no longer counts'); await browser.close(); }
await closeAll(); srv.close();
console.log(fails.length ? `\n${fails.length} FAILED:\n- ${fails.join('\n- ')}` : '\nall passed');
process.exit(fails.length ? 1 : 0);
