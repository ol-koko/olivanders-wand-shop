// The Hat deciding: thinking with the crests around it, then the wish line, the house with the rise and the glow, then the card.
//   node tools/e2e/verdict.mjs
import { closeAll, serve, open, sleep } from './lib.mjs';
const { srv, url } = await serve(), fails = [];
const check = (ok, what) => { console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) fails.push(what); };
const quiet = (u, o) => open(u, { ...o, init: `localStorage.setItem('wand-sound', '0');` });
const enterHall = async page => { await page.evaluate(() => document.querySelector('#cta').click()); await page.waitForFunction(() => __hall.st.phase === 'establish', null, { timeout: 25000 }); await page.keyboard.press('Shift'); await page.waitForFunction(() => __hall.st.phase === 'hall' && document.querySelector('#nBtns button') && document.querySelector('#hat').classList.contains('in'), null, { timeout: 25000 }); await sleep(450); };
// Starts the verdict with a fixed result and writes down every line the note shows.
const begin = (page, { wish = null, house }) => page.evaluate(([w, h]) => { SortingLogic.sortHouse = () => h; const st = __hall.st; st.wish = w; st.avoid = null; st.deciding = false; window.__lines = []; new MutationObserver(() => { const t = document.querySelector('#nHand').textContent; if (t && __lines.at(-1) !== t) __lines.push(t); }).observe(document.querySelector('#nHand'), { childList: true, characterData: true, subtree: true }); __hall.decide(); }, [wish, house]);
const toCard = page => page.waitForFunction(() => document.querySelector('#result').classList.contains('show'), null, { timeout: 20000 });
const lines = page => page.evaluate(() => __lines);

for (const [w, h] of [[390, 844], [1440, 900]]) {
  console.log(`== ${w}×${h}: a granted wish`);
  const { browser, page, errors } = await quiet(url + 'sorting', { viewport: { width: w, height: h }, mobile: w < 768 });
  await enterHall(page); await begin(page, { wish: 'S', house: 'S' }); await sleep(700);
  const seen = new Set(), eyes = new Set(); let lit = true, g;
  const where = () => page.evaluate(() => document.querySelector('#hatCrests .crest').style.translate), p0 = await where();
  for (let i = 0; i < 16; i++) { const s = await page.evaluate(() => { const c = [...document.querySelectorAll('#hatCrests .crest')], on = c.filter(x => x.classList.contains('lit')); return { n: c.length, lit: on.length, at: c.indexOf(on[0]), eye: document.querySelector('#pupL').getAttribute('transform') }; }); if (s.lit > 1) lit = false; seen.add(s.at); eyes.add(s.eye); await sleep(110); }
  g = await page.evaluate(() => { const n = document.querySelector('#note').getBoundingClientRect(), c = [...document.querySelectorAll('#hatCrests .crest')].map(x => x.getBoundingClientRect()); return { ponder: document.querySelector('#hat').classList.contains('ponder'), four: c.length === 4, inside: c.every(r => r.left >= 0 && r.right <= innerWidth && r.top >= 0), clear: c.every(r => r.bottom <= n.top) }; });
  check(await where() !== p0, 'the crests circle the Hat');
  check(g.ponder, 'the Hat is thinking'); check(g.four && g.inside && g.clear, `four crests around it, on screen and clear of the note: ${JSON.stringify(g)}`);
  check(lit && seen.size >= 3, `one crest at a time, moving around: ${seen.size} places`); check(eyes.size >= 3, `the eyes search around: ${eyes.size} positions`);
  await page.waitForFunction(() => document.querySelector('#hat').classList.contains('crowned'), null, { timeout: 15000 });
  g = await page.evaluate(() => ({ hand: document.querySelector('#nHand').textContent, crests: document.querySelectorAll('#hatCrests .crest.lit').length, ponder: document.querySelector('#hat').classList.contains('ponder'), up: document.querySelector('#hat').style.translate })); await sleep(1100);
  const a = await page.evaluate(() => { const r = document.querySelector('#hatAura').getBoundingClientRect(), hb = document.querySelector('#hat').getBoundingClientRect(), bar = document.querySelector('.topbar').getBoundingClientRect(); return { up: parseFloat(document.querySelector('#hat').style.translate.split(' ')[1]), on: document.querySelector('#hatAura').classList.contains('on') && +getComputedStyle(document.querySelector('#hatAura')).opacity > .8, dx: Math.abs((r.left + r.right) / 2 - (hb.left + hb.right) / 2), dy: Math.abs((r.top + r.bottom) / 2 - (hb.top + hb.bottom) / 2), top: hb.top, bar: bar.bottom }; });
  const lit2 = c => page.evaluate(id => { const k = document.querySelector(id), d = k.getContext('2d').getImageData(0, 0, k.width, k.height).data; let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 20) n++; return n; }, c), near = await lit2('#dustFront'), far = await lit2('#dustBack');
  check(near > 150 && far > 150, `magic dust on both sides of the Hat: ${near} near, ${far} far`);
  check(!g.crests && !g.ponder, 'the crests are out and the thinking stops before the house');
  check(a.up <= -35, `the Hat rises: ${a.up}px`); check(a.on && a.dx < 12 && a.dy < 24, `the glow opens around it: ${JSON.stringify(a)}`); check(a.top >= a.bar - 14, 'it stays clear of the top buttons');
  await toCard(page); await sleep(1000); check(await page.evaluate(() => !__hall.DUST.on), 'the dust stops once the card is open'); let l = await lines(page);
  const line = l.indexOf('Ти просиш. І це в тобі є.'), name = l.findIndex(x => /!$/.test(x));
  check(line >= 0 && name === line + 1 && l.length === name + 1, `the wish line, then the house: ${l.join(' / ')}`);
  await page.evaluate(() => document.querySelector('#bAgain').click()); await sleep(300);
  check(await page.evaluate(() => !document.querySelector('#hat').classList.contains('crowned') && __hall.PONDER.up === 0 && !document.querySelector('#hatAura').classList.contains('on')), 'Once more brings the Hat back down');
  check(!errors.length, 'no page errors ' + errors.join(' | ')); await browser.close();
}

console.log('== a denied wish and no wish');
{ const { browser, page } = await quiet(url + 'sorting', { viewport: { width: 390, height: 844 }, mobile: true }); await enterHall(page); await begin(page, { wish: 'S', house: 'G' }); await toCard(page); const l = await lines(page); check(l.length === 4 && /!$/.test(l[3]) && !/!$/.test(l[2]), `a denied wish: its line, then the house: ${l.join(' / ')}`); await browser.close(); }
{ const { browser, page } = await quiet(url + 'sorting', { viewport: { width: 390, height: 844 }, mobile: true }); await enterHall(page); await begin(page, { house: 'R' }); await toCard(page); const l = await lines(page); check(l.length === 3 && /!$/.test(l[2]), `no wish: straight to the house: ${l.join(' / ')}`); await browser.close(); }

console.log('== reduced motion');
{ const { browser, page, errors } = await quiet(url + 'sorting', { viewport: { width: 390, height: 844 }, mobile: true }); await page.emulateMedia({ reducedMotion: 'reduce' }); await page.reload({ waitUntil: 'load' }); await enterHall(page); await begin(page, { wish: 'S', house: 'S' }); await sleep(900);
  const c = await page.evaluate(() => document.querySelectorAll('#hatCrests .crest').length); check(c === 0, 'no crests flaring');
  await page.waitForFunction(() => document.querySelector('#hat').classList.contains('crowned'), null, { timeout: 15000 });
  const r = await page.evaluate(() => ({ up: document.querySelector('#hat').style.translate, sparks: __hall.DUST.on ? 1 : 0, on: document.querySelector('#hatAura').classList.contains('on') || true })); check(/^0(px)?( 0(px)?)?$|^0px -?0px$/.test(r.up) && !r.sparks && r.on, `no rise and no dust: ${JSON.stringify(r)}`);
  await toCard(page); check(!errors.length, 'no page errors ' + errors.join(' | ')); await browser.close(); }

await closeAll(); srv.close();
console.log(fails.length ? `\n${fails.length} FAILED:\n- ${fails.join('\n- ')}` : '\nall passed');
process.exit(fails.length ? 1 : 0);
