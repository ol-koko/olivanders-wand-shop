// Answering the Hat by swipe: with a finger and with a mouse, on the questions and the banners, next to the taps.
//   node tools/e2e/swipe.mjs
import { closeAll, serve, open, sleep } from './lib.mjs';
const { srv, url } = await serve(), fails = [];
const check = (ok, what) => { console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) fails.push(what); };
const quiet = (u, o) => open(u, { ...o, init: `localStorage.setItem('wand-sound', '0');` });
const enterHall = async page => { await page.evaluate(() => document.querySelector('#cta').click()); await page.waitForFunction(() => __hall.st.phase === 'establish', null, { timeout: 25000 }); await page.keyboard.press('Shift'); await page.waitForFunction(() => __hall.st.phase === 'hall' && document.querySelector('#nBtns button'), null, { timeout: 25000 }); await sleep(450); };
const question = async (page, n) => { await page.waitForFunction(k => __hall.st.picking && __hall.st.step === k && document.querySelectorAll('#nBtns button').length >= 2, n, { timeout: 15000 }); await sleep(450); };
const centre = (page, sel, i) => page.evaluate(([s, k]) => { const r = document.querySelectorAll(s)[k].getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, [sel, i]);
const aimed = page => page.evaluate(() => { const a = [...document.querySelectorAll('#nBtns .aim')], all = [...document.querySelectorAll('#nBtns button')], f = __hall.FACE.focus, r = a[0] && a[0].getBoundingClientRect(); return { n: a.length, i: all.indexOf(a[0]), eyes: !!(f && r && Math.abs(f.x - (r.left + r.width / 2)) < 2 && Math.abs(f.y - (r.top + r.height / 2)) < 2) }; });
const answers = page => page.evaluate(() => __hall.st.answers.length);
// Above the note, where nothing is pressable: the Hall itself.
const blank = page => page.evaluate(() => ({ x: innerWidth / 2, y: document.querySelector('#note').getBoundingClientRect().top - 24 }));

function driver(page, kind) {
  if (kind === 'mouse') return { down: async p => { await page.mouse.move(p.x, p.y); await page.mouse.down(); }, move: p => page.mouse.move(p.x, p.y, { steps: 6 }), up: () => page.mouse.up(), tap: p => page.mouse.click(p.x, p.y) };
  let cdp, at; const send = async (type, p) => { cdp = cdp || await page.context().newCDPSession(page); await cdp.send('Input.dispatchTouchEvent', { type, touchPoints: p ? [{ x: p.x, y: p.y }] : [] }); };
  return { down: async p => { at = p; await send('touchStart', p); }, move: async p => { const a = at; for (let i = 1; i <= 6; i++) { await send('touchMove', { x: a.x + (p.x - a.x) * i / 6, y: a.y + (p.y - a.y) * i / 6 }); await sleep(16); } at = p; }, up: () => send('touchEnd'), tap: p => page.touchscreen.tap(p.x, p.y) };
}

for (const [kind, w, h] of [['finger', 390, 844], ['mouse', 1440, 900]]) {
  console.log(`== ${kind}, ${w}×${h}`);
  const { browser, page, errors } = await quiet(url + 'sorting', { viewport: { width: w, height: h }, mobile: kind === 'finger' }), d = driver(page, kind);
  await enterHall(page);

  const a0 = await blank(page), b0 = await centre(page, '#nBtns button', 0);
  await d.down(a0); await d.move(b0); check((await aimed(page)).n === 0, 'the first note has no swipe, only its button'); await d.up(); await sleep(150);
  await page.evaluate(() => document.querySelector('#nBtns button').click());
  await question(page, 0);

  // Each slide starts on the Hall, above the note.
  const a = await blank(page), last = await page.$$eval('#nBtns button', b => b.length - 1), b = await centre(page, '#nBtns button', last);
  await d.down(a); await d.move(b); await sleep(120);
  let s = await aimed(page); check(s.n === 1 && s.i === last, `a slide lights the option it points to: ${JSON.stringify(s)}`); check(s.eyes, 'the Hat looks at that option');
  await d.move(a); await sleep(60); s = await aimed(page); check(s.n === 0, 'sliding back turns the light off'); await d.up(); await sleep(150);
  check(await answers(page) === 0, 'letting go after sliding back picks nothing');

  await d.down(a); await d.move({ x: a.x, y: a.y + 40 }); await sleep(60); s = await aimed(page); check(s.n === 1, 'a short slide already lights the nearest option in its direction'); await d.move(a); await d.up(); await sleep(150);

  await d.down(a); await d.move({ x: a.x, y: a.y - 120 }); await sleep(60); s = await aimed(page); check(s.n === 0, 'a slide away from the options lights nothing'); await d.up(); await sleep(150);
  check(await answers(page) === 0, 'and picks nothing');

  await d.down(a); await d.move(b); await sleep(60); await d.up(); await sleep(150);
  const picked = await page.evaluate(k => { const q = __hall.st.questions[0], st = __hall.st; return st.answers.length === 1 && JSON.stringify(st.answers[0]) === JSON.stringify(q.o[k].w); }, last);
  check(picked, 'letting go picks exactly that option');
  check(await page.evaluate(() => !document.querySelector('#nBtns .aim')), 'the light is gone after the pick');

  await question(page, 1);
  const from = await centre(page, '#nBtns button', 0), to = await centre(page, '#nBtns button', await page.$$eval('#nBtns button', x => x.length - 1));
  await d.down(from); await d.move(to); await sleep(60); await d.up(); await sleep(150);
  check(await page.evaluate(() => { const st = __hall.st, q = st.questions[1]; return st.answers.length === 2 && JSON.stringify(st.answers[1]) === JSON.stringify(q.o[q.o.length - 1].w); }), 'a slide from one option to another picks the second, once');

  await question(page, 2);
  await d.tap(await centre(page, '#nBtns button', 0)); await sleep(150);
  check(await page.evaluate(() => { const st = __hall.st, q = st.questions[2]; return st.answers.length === 3 && JSON.stringify(st.answers[2]) === JSON.stringify(q.o[0].w); }), 'a tap still answers');

  await page.waitForFunction(() => document.querySelector('#nBtns').classList.contains('wish'), null, { timeout: 15000 }); await sleep(450);
  const c = await blank(page), ban = await centre(page, '#nBtns .ban', 1);
  await d.down(c); await d.move(ban); await sleep(60); s = await aimed(page); check(s.n === 1 && s.i === 1 && s.eyes, `a banner lights up and the Hat looks at it: ${JSON.stringify(s)}`); await d.up(); await sleep(150);
  check(await page.evaluate(() => __hall.st.wish === 'S'), 'letting go picks the banner, once');

  const b1 = await centre(page, '#nBtns .ban', 0), b2 = await centre(page, '#nBtns .ban', 2);
  await d.down(b1); await d.move(b2); await sleep(60); await d.up(); await sleep(150);
  check(await page.evaluate(() => __hall.st.wish === 'R'), 'a slide from one banner to another picks the second only');

  await d.tap(await centre(page, '#nBtns .ban', 2)); await sleep(150);
  check(await page.evaluate(() => __hall.st.wish === null), 'a tap on the picked banner still takes it back');

  const wide = await centre(page, '#nBtns .wide', 0);
  await d.down(c); await d.move(wide); await sleep(60); s = await page.evaluate(() => ({ wide: !!document.querySelector('#nBtns .wide.aim') })); await d.move(c); await d.up(); await sleep(150);
  check(!s.wide && await page.evaluate(() => !__hall.st.deciding), 'the buttons under the banners stay tap only');

  check(!errors.length, 'no page errors ' + errors.join(' | '));
  await browser.close();
}
await closeAll(); srv.close();
console.log(fails.length ? `\n${fails.length} FAILED:\n- ${fails.join('\n- ')}` : '\nall passed');
process.exit(fails.length ? 1 : 0);
