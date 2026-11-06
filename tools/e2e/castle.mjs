// /sorting: the castle, routing, language, depth and the way into the hall.
//   node tools/e2e/castle.mjs
import { closeAll, serve, open, sleep } from './lib.mjs';
const { srv, url } = await serve(), fails = [];
const check = (ok, what) => { console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) fails.push(what); };
const box = (page, sel) => page.evaluate(q => { const r = document.querySelector(q).getBoundingClientRect(); return { l: r.left, t: r.top, r: r.right, b: r.bottom }; }, sel);
const hit = (a, b) => a.l < b.r && b.l < a.r && a.t < b.b && b.t < a.b;
const words = (page, sel) => page.evaluate(q => { const g = document.createRange(); g.selectNodeContents(document.querySelector(q)); const r = g.getBoundingClientRect(); return { l: r.left, t: r.top, r: r.right, b: r.bottom }; }, sel);
const inHall = page => page.waitForFunction(() => __hall.st.phase === 'hall', null, { timeout: 20000 });

console.log('== layout and the way in');
for (const [w, h] of [[320, 568], [360, 662], [390, 844], [430, 932], [844, 390], [1440, 900]]) {
  const reqs = [], { browser, page, errors } = await open(url + 'sorting', { viewport: { width: w, height: h }, mobile: w < 1000, route: async p => p.on('request', r => reqs.push(r.url())) });
  await page.evaluate(() => document.fonts.ready); await sleep(400);
  for (const l of ['ua', 'en']) {
    await page.evaluate(x => document.querySelector(`#lang button[data-l="${x}"]`).click(), l); await sleep(80);
    const top = await box(page, '.topbar'), title = await box(page, '#stT'), sub = await box(page, '#stS'), cta = await box(page, '#cta'), moon = await box(page, '#caMoonDisc'), fanTop = await page.evaluate(() => { const r = document.createRange(); r.selectNodeContents(document.querySelector('#stFan')); return r.getBoundingClientRect().top; });
    check(!hit(top, title) && !hit(top, sub), `${w}×${h} ${l}: the top buttons clear the title`);
    check(cta.b <= fanTop, `${w}×${h} ${l}: the button clears the fan notice`);
    check(!hit(moon, await words(page, '#stT')) && !hit(moon, await words(page, '#stS')), `${w}×${h} ${l}: the moon clears the title`);
    check(cta.r <= w && cta.l >= 0, `${w}×${h} ${l}: the button fits the width`);
  }
  await page.evaluate(() => document.querySelector('#lang button[data-l="ua"]').click());
  await page.evaluate(() => document.querySelector('#cta').click()); await inHall(page); await page.waitForFunction(() => document.querySelector('#nBtns button'), null, { timeout: 5000 });
  const n = await page.evaluate(() => ({ castle: document.querySelector('#castle').hidden, hall: !document.querySelector('#hall').hidden, btn: document.querySelector('#nBtns button')?.textContent, shown: document.querySelector('#note').classList.contains('show'), over: document.documentElement.scrollWidth <= innerWidth }));
  check(n.castle && n.hall && n.shown && n.btn === 'Вдягти капелюха' && n.over, `${w}×${h}: the flight ends in the hall with a note`);
  check(!reqs.some(u => /supabase/.test(u)), `${w}×${h}: nothing is logged`);
  check(!errors.length, 'no page errors ' + errors.join(' | '));
  await browser.close();
}
console.log('== routing and language');
{ const { browser, page, errors } = await open(url, { viewport: { width: 390, height: 844 }, mobile: true, locale: 'en-US' });
  await page.evaluate(() => document.querySelector('#lang button[data-l="ua"]').click());
  await page.goto(url + 'sorting', { waitUntil: 'load' });
  check(await page.evaluate(() => document.querySelector('#stT').textContent) === 'Церемонія Розподілу', 'the language chosen in the shop carries over');
  await page.goBack({ waitUntil: 'load' }); check(new URL(page.url()).pathname === '/' && await page.evaluate(() => !!document.querySelector('#cta')), 'back returns to the street');
  await page.goForward({ waitUntil: 'load' }); check(/\/sorting/.test(page.url()), 'forward returns to the castle');
  await page.evaluate(() => document.querySelector('#cta').click()); await inHall(page); await page.waitForFunction(() => document.querySelector('#nBtns button'));
  check(!errors.length, 'no page errors ' + errors.join(' | ')); await browser.close(); }
{ const { browser, page } = await open(url + 'sorting/', { viewport: { width: 390, height: 844 }, mobile: true, locale: 'en-US' }); check(await page.evaluate(() => document.querySelector('#stT').textContent) === 'The Sorting Ceremony', 'a deep link with a slash works, English for a non-Ukrainian browser'); await browser.close(); }
console.log('== depth');
{ const { browser, page, errors } = await open(url + 'sorting', { viewport: { width: 390, height: 844 }, mobile: true, init: `window.__asked = 0; if (window.DeviceOrientationEvent) DeviceOrientationEvent.requestPermission = () => { __asked++; return Promise.resolve('granted'); }; if (window.DeviceMotionEvent) DeviceMotionEvent.requestPermission = () => { __asked++; return Promise.resolve('granted'); }; const gum = navigator.mediaDevices && navigator.mediaDevices.getUserMedia; if (gum) navigator.mediaDevices.getUserMedia = () => { __asked++; return Promise.reject(new Error('no')); };` });
  const cdp = await page.context().newCDPSession(page); await sleep(300); const b = await page.evaluate(() => [...document.querySelectorAll('.pl')].map(e => e.style.transform).join());
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 60, y: 300 }] }); for (let i = 0; i < 10; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 60 + i * 26, y: 300 }] }); await sleep(30); }
  const during = await page.evaluate(() => __hall.par.tx); await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await sleep(100);
  check(Math.abs(during) > .3 && await page.evaluate(() => __hall.st.phase === 'castle'), `a finger drag moves the depth without entering: ${during.toFixed(2)}`);
  check(b !== await page.evaluate(() => [...document.querySelectorAll('.pl')].map(e => e.style.transform).join()), 'the layers move');
  check(await page.evaluate(() => __asked) === 0, 'no permission is asked for'); check(!errors.length, 'no page errors ' + errors.join(' | ')); await browser.close(); }
{ const { browser, page } = await open(url + 'sorting', { viewport: { width: 390, height: 844 }, mobile: true, init: `const m = window.matchMedia; window.matchMedia = q => /reduced-motion/.test(q) ? { matches: true, addEventListener() { } } : m.call(window, q);` });
  await sleep(600); const a = await page.evaluate(() => [...document.querySelectorAll('.pl')].map(e => e.style.transform).join()); await sleep(600); check(a === await page.evaluate(() => [...document.querySelectorAll('.pl')].map(e => e.style.transform).join()), 'reduced motion keeps the layers still');
  const t0 = Date.now(); await page.evaluate(() => document.querySelector('#cta').click()); await inHall(page); check(Date.now() - t0 < 4000, `reduced motion: no long flight, ${Date.now() - t0} ms`); await browser.close(); }
await closeAll(); srv.close();
console.log(fails.length ? `\n${fails.length} FAILED:\n- ${fails.join('\n- ')}` : '\nall passed');
process.exit(fails.length ? 1 : 0);
