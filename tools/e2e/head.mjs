// Answering the Hat with the head: the gesture on made-up angles, then the ceremony with a fake camera and made-up head readings.
//   node tools/e2e/head.mjs
import { createRequire } from 'node:module';
import { closeAll, serve, open, sleep } from './lib.mjs';
const { createTracker, anglesFrom } = createRequire(import.meta.url)('../../head-logic.js'), fails = [];
const check = (ok, what) => { console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) fails.push(what); };
// Plays [milliseconds, side] keyframes at 30 fps, moving smoothly between them.
function play(keys, o) { const tr = createTracker(o), out = { picks: [], aims: [], fills: [] }; let t = 1000; for (let k = 1; k < keys.length; k++) { const [, s0] = keys[k - 1], [d, s1] = keys[k]; for (let e = 0; e < d; e += 33) { const r = tr.update(t, { side: s0 + (s1 - s0) * e / d }); t += 33; out.fills.push(r.fill); if (r.picked !== null) out.picks.push(r.picked); if (out.aims.at(-1) !== r.aim) out.aims.push(r.aim); } } return out; }

console.log('== the gesture');
let r = play([[0, 0], [300, 15], [2000, 15]]); check(r.picks.join() === '3', `holding a tilt to the right picks the last answer: ${r.picks}`);
r = play([[0, 0], [300, -15], [2000, -15]]); check(r.picks.join() === '0', `to the left, the first: ${r.picks}`);
r = play([[0, 0], [300, -7], [2000, -7]]); check(r.picks.join() === '1', `a small tilt left, the second: ${r.picks}`);
r = play([[0, 0], [300, 15], [4000, 15]]); check(r.picks.length === 1, 'holding on picks only once');
r = play([[0, 0], [3000, 0]]); check(!r.picks.length, 'a straight head picks nothing');
r = play([[0, 0], [300, 15], [500, 15], [300, 0], [1500, 0]]); check(!r.picks.length, 'straightening up cancels');
r = play([[0, 0], [300, 15], [450, 15], [250, -15], [450, -15]]); check(!r.picks.length && Math.max(...r.fills) === 0, 'there is time to move between answers before the line starts');
r = play([[0, 0], [300, 15], [2000, 15]], { options: 2 }); check(r.picks.join() === '1', `two answers: right is the second: ${r.picks}`);
r = play([[0, 15], [2500, 15]], { armed: false }); check(!r.picks.length, 'on a new screen a head still tilted picks nothing');
r = play([[0, 15], [300, 0], [300, 0], [300, 15], [2000, 15]], { armed: false }); check(r.picks.join() === '3', 'after coming back to straight it picks');
{ const a = anglesFrom([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]); check(Math.abs(a.roll) + Math.abs(a.yaw) < 1e-6, 'a head facing straight reads zero'); }

const { srv, url } = await serve();
const PHONE = { viewport: { width: 390, height: 844 }, mobile: true, locale: 'uk-UA', init: `localStorage.setItem('wand-sound', '0');` };
const toIntro = async page => { await page.evaluate(() => document.querySelector('#cta').click()); await page.waitForFunction(() => __hall.st.phase === 'hall' && document.querySelector('#nBtns button'), null, { timeout: 25000 }); await sleep(500); };
const btns = page => page.$$eval('#nBtns button', b => b.map(x => x.textContent));
// Readings go straight into the game; the camera's own frames are held back so they can't interfere.
const hold = page => page.evaluate(() => { __head.HEAD.busy = true; __head.HEAD.sentAt = Infinity; });
const feed = (page, keys) => page.evaluate(async keys => { const out = { fills: 0 }; let t = performance.now(); for (const [ms, roll] of keys) for (let e = 0; e < ms; e += 33) { t += 33; __head.headAngle(roll === null ? null : { roll, yaw: 0, pitch: 0 }, t); if (document.querySelector('#nBtns .hfill')) out.fills++; await new Promise(r => setTimeout(r, 4)); } return out; }, keys);
const tilt = (page, roll) => feed(page, [[500, 0], [300, roll], [2000, roll], [400, 0]]);

console.log('== a whole ceremony with the head');
{ const { browser, page, errors } = await open(url + 'sorting', { ...PHONE, fakeCam: true });
  await toIntro(page); const intro = await btns(page); check(intro.includes('Відповідати головою'), `the first screen offers the head: ${intro.join(' / ')}`);
  await page.evaluate(() => [...document.querySelectorAll('#nBtns button')].find(b => /головою/.test(b.textContent)).click());
  await page.waitForFunction(() => __head.HEAD.phase === 'look', null, { timeout: 60000 }); check(true, 'the camera and the model start');
  check(await page.evaluate(() => !document.querySelector('#headCam').hidden && !!__head.HEAD.stream), 'the little mirror shows the camera');
  await hold(page); await feed(page, [[1100, 0]]);
  check(await page.waitForFunction(() => __head.HEAD.phase === 'try' && document.querySelectorAll('#nBtns .hp').length === 2, null, { timeout: 3000 }).then(() => true, () => false), 'after learning straight comes the practice, with two answers');
  let f = await tilt(page, 14); check(await page.evaluate(() => __hall.st.picking), 'tilting and holding finishes the practice'); check(f.fills > 5, `the gold line runs while it is held: ${f.fills} frames`);
  await sleep(600); const row = await page.$$eval('#nBtns button', b => b.map(x => Math.round(x.getBoundingClientRect().top)));
  check(row.length === 4 && new Set(row).size === 1, `the four answers stand in one row: ${row.join(' ')}`);
  for (let i = 0; i < 3; i++) {
    await page.waitForFunction(n => __hall.st.picking && __hall.st.step === n, i, { timeout: 15000 }); await sleep(600);
    const first = (await btns(page))[0]; await tilt(page, -15);
    const got = await page.evaluate(() => __hall.st.answers.length); check(got === i + 1, `question ${i + 1}: a tilt to the left answers it (${first})`);
  }
  await page.waitForFunction(() => document.querySelector('#nBtns.wish'), null, { timeout: 15000 }); await sleep(500);
  await tilt(page, 15); await sleep(1000);
  const end = await page.evaluate(() => ({ wish: __hall.st.wish, deciding: __hall.st.deciding, on: __head.HEAD.on, stream: !!__head.HEAD.stream, cam: document.querySelector('#headCam').hidden }));
  check(end.wish === 'H' && end.deciding, `the last banner on the right is the wish, and the Hat decides: ${end.wish}`);
  check(!end.on && !end.stream && end.cam, 'the camera goes off once the answers are in');
  await page.waitForFunction(() => document.querySelector('#result').classList.contains('show'), null, { timeout: 20000 }); check(true, 'the card opens');
  const real = errors.filter(e => !/INFO:|W0000|gl_context|OpenGL/.test(e)); check(!real.length, 'no page errors ' + real.join(' | ')); await browser.close(); } // MediaPipe writes its own lines to console.error

console.log('== losing the face, a hidden tab, and tapping instead');
{ const { browser, page, errors } = await open(url + 'sorting', { ...PHONE, fakeCam: true });
  await toIntro(page); await page.evaluate(() => startHead());
  await page.waitForFunction(() => __head.HEAD.phase === 'look', null, { timeout: 60000 }); await hold(page); await feed(page, [[1100, 0]]);
  await feed(page, [[2000, null]]); check(/Не бачу обличчя/.test(await page.textContent('#nStatus')), 'without a face it says so');
  await feed(page, [[300, 0]]); check(!(await page.textContent('#nStatus')), 'and the line goes when the face is back');
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { value: true, configurable: true }); document.dispatchEvent(new Event('visibilitychange')); }); await sleep(300);
  check(await page.evaluate(() => !__head.HEAD.stream && __head.HEAD.on), 'a hidden tab stops the camera');
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { value: false, configurable: true }); document.dispatchEvent(new Event('visibilitychange')); });
  await page.waitForFunction(() => !!__head.HEAD.stream && __head.HEAD.recal, null, { timeout: 20000 }); check(true, 'coming back starts it again and learns straight again');
  await page.evaluate(() => [...document.querySelectorAll('#nBtns button')].pop().click()); await sleep(800);
  const s = await page.evaluate(() => ({ on: __head.HEAD.on, stream: !!__head.HEAD.stream, picking: __hall.st.picking }));
  check(!s.on && !s.stream && s.picking, 'tapping instead turns the camera off and the questions begin');
  const real = errors.filter(e => !/INFO:|W0000|gl_context|OpenGL/.test(e)); check(!real.length, 'no page errors ' + real.join(' | ')); await browser.close(); }

console.log('== no camera');
{ const { browser, page, errors } = await open(url + 'sorting', { ...PHONE, init: PHONE.init + `navigator.mediaDevices.getUserMedia = () => Promise.reject(Object.assign(new Error('no'), { name: 'NotAllowedError' }));` });
  await toIntro(page); await page.evaluate(() => startHead()); await sleep(1500);
  const s = await page.evaluate(() => ({ on: __head.HEAD.on, status: document.querySelector('#nStatus').textContent, btns: [...document.querySelectorAll('#nBtns button')].map(b => b.textContent) }));
  check(!s.on && /торкнись/.test(s.status) && !s.btns.some(b => /головою/.test(b)) && s.btns.length === 1, `a refused camera brings back the first screen, without the head: ${s.status}`);
  check(!errors.length, 'no page errors ' + errors.join(' | ')); await browser.close(); }
{ const { browser, page } = await open(url + 'sorting', { ...PHONE, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Instagram 300.0' });
  await toIntro(page); check(!(await btns(page)).some(b => /головою/.test(b)), 'in-app browsers don’t offer the head'); await browser.close(); }

await closeAll(); srv.close();
console.log(fails.length ? `\n${fails.length} FAILED:\n- ${fails.join('\n- ')}` : '\nall passed');
process.exit(fails.length ? 1 : 0);
