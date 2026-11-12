// Answering the Hat with the head: pointing on made-up angles, then the ceremony with a fake camera and made-up head readings.
//   node tools/e2e/head.mjs
import { createRequire } from 'node:module';
import { closeAll, serve, open, sleep } from './lib.mjs';
const { createPointer, anglesFrom, gridOf } = createRequire(import.meta.url)('../../head-logic.js'), fails = [];
const check = (ok, what) => { console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) fails.push(what); };
// Plays [milliseconds, dx, dy] keyframes at 30 fps, moving smoothly between them.
function play(keys, o) { const p = createPointer(o), out = { picks: [], aims: [], fills: [] }; let t = 1000; for (let k = 1; k < keys.length; k++) { const [, x0, y0] = keys[k - 1], [d, x1, y1] = keys[k]; for (let e = 0; e < d; e += 33) { const r = p.update(t, { dx: x0 + (x1 - x0) * e / d, dy: y0 + (y1 - y0) * e / d }); t += 33; out.fills.push(r.fill); if (r.picked) out.picks.push(r.picked.col + ',' + r.picked.row); const a = r.col === null ? '-' : r.col + ',' + r.row; if (out.aims.at(-1) !== a) out.aims.push(a); } } return out; }
const col4 = { cols: 1, rows: 4 }, grid22 = { cols: 2, rows: 2 };

console.log('== pointing');
let r = play([[0, 0, 0], [300, 0, 12], [2000, 0, 12]], col4); check(r.picks.join() === '0,0', `phone: looking well up picks the top answer: ${r.picks}`);
r = play([[0, 0, 0], [300, 0, 5], [2000, 0, 5]], col4); check(r.picks.join() === '0,1', `a little up, the second: ${r.picks}`);
r = play([[0, 0, 0], [300, 0, -5], [2000, 0, -5]], col4); check(r.picks.join() === '0,2', `a little down, the third: ${r.picks}`);
r = play([[0, 0, 0], [300, 0, -12], [2000, 0, -12]], col4); check(r.picks.join() === '0,3', `well down, the bottom one: ${r.picks}`);
r = play([[0, 0, 0], [300, 9, 0], [2000, 9, 0]], col4); check(!r.picks.length, 'on a phone turning sideways picks nothing');
r = play([[0, 0, 0], [300, -9, 6], [2000, -9, 6]], grid22); check(r.picks.join() === '0,0', `computer: left and up is the top-left answer: ${r.picks}`);
r = play([[0, 0, 0], [300, 9, -6], [2000, 9, -6]], grid22); check(r.picks.join() === '1,1', `right and down, the bottom-right: ${r.picks}`);
r = play([[0, 0, 0], [3000, 1.5, -2]], grid22); check(!r.picks.length && r.aims.join() === '-', 'the neutral pose and small drift light nothing');
r = play([[0, 0, 0], [300, 0, 7], [3000, 0, 7.6], [1000, 0, 6.4]], col4); check(r.aims.join() === '-,0,1', `hysteresis: hovering on a border doesn't flicker: ${r.aims.join(' ')}`);
r = play([[0, 0, 0], [300, 0, 12], [4000, 0, 12]], col4); check(r.picks.length === 1, 'holding on picks only once');
r = play([[0, 0, 0], [300, 0, 12], [700, 0, 12], [200, 0, 0], [1500, 0, 0]], col4); check(!r.picks.length, 'coming back to neutral cancels');
r = play([[0, 0, 0], [300, 0, 12], [800, 0, 12], [200, 0, -12], [800, 0, -12]], col4); check(!r.picks.length, 'moving to another answer starts the timer again');
r = play([[0, 0, 12], [2500, 0, 12]]); check(!r.picks.length, 'on a new screen a head already pointing picks nothing');
r = play([[0, 0, 12], [300, 0, 0], [300, 0, 0], [300, 0, 12], [2000, 0, 12]], col4); check(r.picks.join() === '0,0', 'after coming back to neutral it picks');
{ const p = createPointer(col4); let t = 1000, max = 0, picks = 0; for (let i = 0; i < 70; i++) { const shake = i % 9 === 4 ? 0 : -12; const u = p.update(t += 33, { dx: 0, dy: i < 10 ? 0 : shake }); max = Math.max(max, u.fill); if (u.picked) picks++; } check(picks === 1, `a single shaky reading neither resets the timer nor stops the pick (${picks} pick)`); }
r = play([[0, 0, 0], [300, 0, 12], [1700, 0, 12], [300, 0, -12], [2000, 0, -12]], col4); check(r.picks.join(' ') === '0,0 0,3', `after a pick, going straight to another answer picks it, no stop at neutral needed: ${r.picks.join(' ')}`);
r = play([[0, 0, -6], [500, 0, -6], [300, 0, -12], [2000, 0, -12]], { cols: 2, rows: 2 }); check(!r.picks.length, 'pointing at the same cell the screen opened on stays unarmed');
{ const g = gridOf([{ x: 100, y: 10 }, { x: 300, y: 10 }, { x: 100, y: 60 }, { x: 300, y: 60 }]); check(g.cols === 2 && g.rows === 2 && g.at(1, 1) === 3, 'the grid is read from where the answers stand'); }
{ const a = anglesFrom([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]); check(Math.abs(a.roll) + Math.abs(a.yaw) + Math.abs(a.pitch) < 1e-6, 'a head facing straight reads zero'); }

// The page's own timings reach the pointer: a slow hold picks only when it is full, and a free pointer needs no trip to neutral first.
{ const p = createPointer({ ...col4, hold: 3500, grace: 450, free: true }); let t = 1000, at = 0, max = 0; for (let i = 0; i < 150 && !at; i++) { const u = p.update(t += 33, { dx: 0, dy: 12 }); if (u.picked) at = t - 1000; else max = Math.max(max, u.fill); }
  check(at > 3800 && at < 4200 && max > .95, `a 3.5 s hold after a 0.45 s rest picks at about 4 s, even from a head already pointing: ${at} ms`); }

const { srv, url } = await serve();
const PHONE = { viewport: { width: 390, height: 844 }, mobile: true, locale: 'uk-UA', init: `localStorage.setItem('wand-sound', '0');` };
const toIntro = async page => { await page.evaluate(() => document.querySelector('#cta').click()); await page.waitForFunction(() => __hall.st.phase === 'hall' && document.querySelector('#nBtns button'), null, { timeout: 25000 }); await sleep(500); };
const btns = page => page.$$eval('#nBtns button', b => b.map(x => x.textContent));
const real = errors => errors.filter(e => !/INFO:|W0000|gl_context|OpenGL/.test(e)); // MediaPipe writes its own lines to console.error
// Readings go straight into the game, as dx / dy; the camera's own frames are held back so they can't interfere.
const hold = page => page.evaluate(() => { __head.HEAD.lastFrame = Infinity; __head.HEAD.token++; }); // no new frame is ever due, and one still in the worker is dropped
// The readings carry their own clock, far faster than the page's, so each screen must be fully shown before they start.
const shown = (page, sel = '#nBtns button') => page.waitForFunction(s => !document.querySelector('#noteIn').classList.contains('fade') && document.querySelector(s), sel, { timeout: 15000 });
const feed = (page, keys) => page.evaluate(async keys => { const S = __head.HEAD_SIGN, m = document.querySelector('#headMirror'), out = { ring: 0, inButton: 0, read: 0, lit: '', states: [], digits: [], soon: 0 }; let t = window.__ft || performance.now();
  for (const [ms, dx, dy] of keys) for (let e = 0; e < ms; e += 33) { t += 33; __head.headAngle(dx === null ? null : { yaw: dx / S.x, pitch: dy / S.y, roll: 0 }, t);
    if (m.classList.contains('hold') && +m.style.getPropertyValue('--f') > 0) out.ring++; if (m.classList.contains('read')) out.read++; if (document.querySelector('#nBtns .hglass')) out.inButton++; if (document.querySelector('#nBtns .soon')) out.soon++;
    const lit = document.querySelector('#nBtns .aim'); if (lit) out.lit = lit.textContent; const st = __head.HEAD.state; if (st && out.states[out.states.length - 1] !== st) out.states.push(st);
    const d = m.classList.contains('count') ? m.querySelector('.count').textContent : ''; if (d && out.digits[out.digits.length - 1] !== d) out.digits.push(d); await new Promise(r => setTimeout(r, 4)); }
  window.__ft = t; return out; }, keys);
const READ = 5200, HOLD = 4300; // a little over the reading pause, and over the rest plus the hold
const look = (page, dx, dy) => feed(page, [[READ, 0, 0], [300, dx, dy], [HOLD, dx, dy], [400, 0, 0]]);
const state = page => page.evaluate(() => ({ phase: __head.HEAD.phase, picking: __hall.st.picking, answers: __hall.st.answers.length, heads: __hall.st.heads, step: __hall.st.step, wish: __hall.st.wish, deciding: __hall.st.deciding, on: __head.HEAD.on, stream: !!__head.HEAD.stream, back: !document.querySelector('#headBack').hidden, label: document.querySelector('#headBack').getAttribute('aria-label'), hand: document.querySelector('#nHand').textContent, aim: !!document.querySelector('#nBtns .aim') }));
// To the intro scroll with the neutral pose learned.
const toHead = async page => { await toIntro(page); await page.evaluate(() => startHead()); await page.waitForFunction(() => __head.HEAD.phase === 'intro', null, { timeout: 60000 }); await hold(page); await shown(page, '#nBtns .hgo'); await feed(page, [[1100, 0, 0]]); };
const logged = `window.__rows = []; addEventListener('DOMContentLoaded', () => { const p = window.postRow; window.postRow = (t, r, k) => { __rows.push(t + ':' + (r.step || r.house)); return p(t, r, k); }; });`; // every row the game would send

console.log('== a whole ceremony with the head, on a phone');
{ const { browser, page, errors } = await open(url + 'sorting', { ...PHONE, init: PHONE.init + logged, fakeCam: true });
  await toIntro(page); check((await btns(page)).includes('Почати з камерою'), 'the first screen offers the head');
  await page.evaluate(() => [...document.querySelectorAll('#nBtns button')].find(b => /з камерою/.test(b.textContent)).click());
  await page.waitForFunction(() => __head.HEAD.phase === 'intro', null, { timeout: 60000 }); check(true, 'the camera and the model start');
  check(await page.evaluate(() => !document.querySelector('#headMirror').hidden), 'the mirror shows');
  await hold(page); await shown(page, '#nBtns .hgo'); check((await btns(page))[0] === 'Почати церемонію' && await page.$$eval('#nInstr li', l => l.length) === 3, 'the intro scroll has its three steps and «Почати церемонію»');
  await feed(page, [[1100, 0, 0]]); let s = await state(page); check(s.phase === 'intro' && !s.picking, 'learning the neutral pose leaves the intro scroll where it is');
  let f = await feed(page, [[3500, 0, -8]]); s = await state(page); check(s.phase === 'intro' && !s.aim && f.read > 50 && !f.ring && f.states.join() === 'reading', `during the reading pause a face on the button does nothing: ${f.states}`);
  f = await feed(page, [[700, 0, 0], [6000, 0, 0], [300, 0, 8], [5000, 0, 8], [400, 0, 0]]); s = await state(page); check(s.phase === 'intro' && !f.ring, 'reading the scroll, or looking up from it, never starts the questions');
  f = await feed(page, [[300, 0, -8], [HOLD, 0, -8], [400, 0, 0]]); s = await state(page); check(s.picking, 'lowering the face to «Почати церемонію» and holding starts them');
  check(f.ring > 5 && !f.inButton && f.digits.join('') === '321' && f.soon > 5, `the timer runs in the mirror, not in the button, and ends with ${f.digits.join('-')} and a glow on the button`);
  await shown(page); await sleep(300); const rows = await page.$$eval('#nBtns button', b => b.map(x => Math.round(x.getBoundingClientRect().top)));
  check(rows.length === 4 && new Set(rows).size === 4, `the answers keep their places, one under another: ${rows.join(' ')}`);
  { const m = await page.evaluate(() => { const r = s => document.querySelector(s).getBoundingClientRect(), a = r('#headMirror'), t = r('.topbar'), h = r('#hat'), n = r('#noteIn'); return { w: Math.round(a.width), frame: !!document.querySelector('#headMirror svg.cam-frame'), flip: getComputedStyle(document.querySelector('#headCam')).transform, clear: a.right < t.left && a.bottom < h.top && a.bottom < n.top, wide: document.documentElement.scrollWidth > innerWidth }; });
    check(m.frame && m.w >= 130 && m.clear && !m.wide && /^matrix\(-1/.test(m.flip), `it is the shop's portrait, mirrored, ${m.w}px wide, clear of the buttons, the Hat and the scroll`); }
  const q1 = (await state(page)).hand;
  f = await feed(page, [[400, 0, 0], [300, 0, -12], [4000, 0, -12]]); s = await state(page); check(!s.answers && !s.aim && !f.ring && f.states.join() === "reading" && f.read > 100, `question 1: while reading, a face on an answer lights nothing and picks nothing: ${f.states}`);
  f = await feed(page, [[300, 0, 0], [300, 0, -12], [2000, 0, -12], [300, 0, 0], [1500, 0, 0]]); s = await state(page); check(!s.answers && f.ring > 5 && f.states.includes('holding'), 'then a hold cut short by looking away picks nothing');
  f = await feed(page, [[300, 0, -12], [HOLD, 0, -12], [400, 0, 0]]); s = await state(page);
  check(s.answers === 1 && s.heads === 1 && f.digits.join('') === '321' && f.states.join().includes('holding,countdown'), `a full hold picks the bottom answer after ${f.digits.join('-')}`);
  check(s.back && /попереднього/.test(s.label), `after a pick by the head the back arrow shows: ${s.label}`);
  check(!(await page.evaluate(() => [...document.querySelectorAll('#nBtns button')].includes(document.querySelector('#headBack')))), 'the arrow is not among the answers the head can point at');
  await page.focus('#headBack'); await page.keyboard.press('Enter'); await shown(page); await sleep(300); s = await state(page);
  check(!s.answers && !s.heads && s.step === 0 && s.picking && s.hand === q1 && !s.back, 'Enter on the arrow asks question 1 again, with its answer taken back');
  for (let i = 0; i < 3; i++) {
    await page.waitForFunction(n => __hall.st.picking && __hall.st.step === n, i, { timeout: 15000 }); await shown(page); await sleep(300);
    const want = (await btns(page))[3]; await look(page, 0, -12);
    check((await state(page)).answers === i + 1, `question ${i + 1}: after the reading pause, looking down picks the bottom answer (${want})`);
  }
  await page.waitForFunction(() => document.querySelector('#nBtns.wish'), null, { timeout: 15000 }); await shown(page, '#nBtns.wish .ban'); await sleep(300);
  s = await state(page); check(s.back, 'on the banners the arrow still leads back to question 3');
  await look(page, 14, 0); s = await state(page); check(s.wish === 'H' && !s.deciding && s.back && /факультет/.test(s.label), `turning right picks the last banner as the wish, and the arrow can take it back: ${s.label}`);
  await page.click('#headBack'); await sleep(3000); s = await state(page); check(!s.wish && !s.deciding && s.back && /попереднього/.test(s.label), 'a tap on the arrow takes the wish back, and the Hat does not go on');
  await shown(page, '#nBtns.wish .ban'); await look(page, 14, 0); await sleep(3200);
  const end = await page.evaluate(() => ({ wish: __hall.st.wish, deciding: __hall.st.deciding, answers: __hall.st.answers.length, heads: __hall.st.heads, on: __head.HEAD.on, stream: !!__head.HEAD.stream, hidden: document.querySelector('#headMirror').hidden, back: !document.querySelector('#headBack').hidden }));
  check(end.wish === 'H' && end.deciding && end.answers === 3 && end.heads === 3, `picked again, the wish stands and the Hat goes on with three answers: ${end.wish}`);
  check(!end.on && !end.stream && end.hidden && !end.back, 'the camera and the arrow go once the answers are in');
  await page.waitForFunction(() => document.querySelector('#result').classList.contains('show'), null, { timeout: 20000 }); check(true, 'the card opens');
  const sent = await page.evaluate(() => __rows), steps = sent.filter(r => /^game_steps/.test(r)).map(r => r.split(':')[1]);
  check(new Set(steps).size === steps.length && ['q1', 'q2', 'q3', 'wish', 'result'].every(k => steps.includes(k)) && sent.filter(r => /^sorting_results/.test(r)).length === 1, `taking answers back logs nothing twice: ${steps.join(' ')}, one result`);
  check(!real(errors).length, 'no page errors ' + real(errors).join(' | ')); await browser.close(); }

console.log('== on a computer, two by two');
{ const { browser, page, errors } = await open(url + 'sorting', { viewport: { width: 1440, height: 900 }, locale: 'uk-UA', init: PHONE.init, fakeCam: true });
  await toHead(page); await feed(page, [[4200, 0, 0], [300, 0, -8], [HOLD, 0, -8], [400, 0, 0]]); await page.waitForFunction(() => __hall.st.picking, null, { timeout: 5000 }); await shown(page); await sleep(300);
  const pos = await page.$$eval('#nBtns button', b => b.map(x => { const r = x.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top), x.textContent]; }));
  const br = pos.reduce((b, p) => p[0] + p[1] > b[0] + b[1] ? p : b), seen = await look(page, 9, -7);
  const picked = await page.evaluate(() => __hall.st.answers.length); check(picked === 1 && seen.lit === br[2], `right and down lights and picks the bottom-right answer: ${seen.lit}`);
  check(!real(errors).length, 'no page errors ' + real(errors).join(' | ')); await browser.close(); }

console.log('== looking away, a hidden tab, and tapping instead');
{ const { browser, page, errors } = await open(url + 'sorting', { ...PHONE, fakeCam: true });
  await toHead(page); await page.evaluate(() => document.querySelector('#nBtns .hgo').click()); await sleep(200); check((await state(page)).picking, 'a tap on «Почати церемонію» starts the questions at once'); await shown(page); await sleep(300);
  await feed(page, [[READ, 0, 0], [300, 0, 8], [2200, 0, 8]]); const mid = await page.evaluate(() => +document.querySelector('#headMirror').style.getPropertyValue('--f'));
  await feed(page, [[100, null, null]]); const lost = await page.evaluate(() => ({ f: +document.querySelector('#headMirror').style.getPropertyValue('--f'), hold: document.querySelector('#headMirror').classList.contains('hold'), count: document.querySelector('#headMirror').classList.contains('count'), aim: !!document.querySelector('#nBtns .aim') }));
  check(mid > .1 && lost.f === 0 && !lost.hold && !lost.count && !lost.aim, `looking away clears the ring, the hourglass, the count and the highlight at once (was ${mid.toFixed(2)})`);
  await feed(page, [[2000, null, null]]); check(/Не бачу обличчя/.test(await page.textContent('#nStatus')), 'without a face it says so');
  await feed(page, [[300, 0, 0]]); check(!(await page.textContent('#nStatus')), 'and the line goes when the face is back');
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { value: true, configurable: true }); document.dispatchEvent(new Event('visibilitychange')); }); await sleep(300);
  check(await page.evaluate(() => !__head.HEAD.stream && __head.HEAD.on && document.querySelector('#headMirror').hidden), 'a hidden tab stops the camera');
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { value: false, configurable: true }); document.dispatchEvent(new Event('visibilitychange')); });
  await page.waitForFunction(() => !!__head.HEAD.stream && __head.HEAD.recal, null, { timeout: 20000 }); check(true, 'coming back starts it again and learns the neutral pose again');
  await page.evaluate(() => document.querySelector('#nBtns button').click()); await sleep(300); let s = await state(page);
  check(s.answers === 1 && !s.back, 'an answer given by a tap shows no back arrow');
  check(!real(errors).length, 'no page errors ' + real(errors).join(' | ')); await browser.close(); }
{ const { browser, page } = await open(url + 'sorting', { ...PHONE, fakeCam: true });
  await toHead(page); await page.evaluate(() => document.querySelector('#nBtns .tapLink').click()); await sleep(800);
  const s = await state(page); check(!s.on && !s.stream && s.picking, 'tapping instead turns the camera off and the questions begin'); await browser.close(); }

console.log('== reduced motion, no camera, in-app browsers');
{ const { browser, page } = await open(url + 'sorting', { ...PHONE, fakeCam: true });
  await page.emulateMedia({ reducedMotion: 'reduce' }); await toHead(page); await page.evaluate(() => document.querySelector('#nBtns .hgo').click()); await shown(page); await sleep(300);
  await feed(page, [[READ, 0, 0], [300, 0, 8], [2600, 0, 8]]); await sleep(300);
  const v = await page.evaluate(() => ({ glass: getComputedStyle(document.querySelector('#headMirror .hglass')).display, ring: getComputedStyle(document.querySelector('#headMirror .ring circle')).opacity, count: getComputedStyle(document.querySelector('#headMirror .count')).opacity, digit: document.querySelector('#headMirror .count').textContent }));
  check(v.glass === 'none' && +v.ring > .5 && +v.count > .5 && /^[123]$/.test(v.digit), `with reduced motion the ring fills and the count stays, with no hourglass: hourglass ${v.glass}, ring ${v.ring}, count ${v.digit}`); await browser.close(); }
{ const { browser, page, errors } = await open(url + 'sorting', { ...PHONE, init: PHONE.init + `navigator.mediaDevices.getUserMedia = () => Promise.reject(Object.assign(new Error('no'), { name: 'NotAllowedError' }));` });
  await toIntro(page); await page.evaluate(() => startHead()); await sleep(1500);
  const s = await page.evaluate(() => ({ on: __head.HEAD.on, status: document.querySelector('#nStatus').textContent, btns: [...document.querySelectorAll('#nBtns button')].map(b => b.textContent) }));
  check(!s.on && /торкнись/.test(s.status) && !s.btns.some(b => /з камерою/.test(b)) && s.btns.length === 1, `a refused camera brings back the first screen, without the head: ${s.status}`);
  check(!errors.length, 'no page errors ' + errors.join(' | ')); await browser.close(); }
{ const { browser, page } = await open(url + 'sorting', { ...PHONE, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Instagram 300.0' });
  await toIntro(page); check(!(await btns(page)).some(b => /з камерою/.test(b)), 'in-app browsers don’t offer the head'); await browser.close(); }

await closeAll(); srv.close();
console.log(fails.length ? `\n${fails.length} FAILED:\n- ${fails.join('\n- ')}` : '\nall passed');
process.exit(fails.length ? 1 : 0);
