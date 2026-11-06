// The signpost on the street: its top board leads to the Sorting Ceremony, the others only swing, and the rest of the street still opens the shop.
//   node tools/e2e/signpost.mjs
import { closeAll, serve, open, sleep } from './lib.mjs';
const { srv, url } = await serve(), fails = [];
const check = (ok, what) => { console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) fails.push(what); };
const center = (page, sel) => page.evaluate(s => { const b = document.querySelector(s).getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2, b.width, b.height, b.right]; }, sel);
for (const [w, h] of [[390, 844], [320, 568], [1440, 900], [844, 390]]) for (const l of ['ua', 'en']) {
  const mobile = w < 768 || h < 500; console.log(`== ${w}×${h} ${l}`);
  { const { browser, page, errors } = await open(url, { viewport: { width: w, height: h }, mobile, init: `localStorage.setItem('wand-lang','${l}');localStorage.setItem('wand-sound','0')` });
    await page.evaluate(() => document.fonts.ready); await sleep(400);
    const [x, y, bw, bh] = await center(page, '#postHallT'), title = await page.evaluate(() => document.querySelector('#stTitle').getBoundingClientRect().bottom), cta = await page.evaluate(() => document.querySelector('#cta').getBoundingClientRect().top);
    const txt = await page.evaluate(() => [document.querySelector('#postQ').textContent, document.querySelector('#postHallT').textContent, document.querySelector('#postHall').getAttribute('aria-label')]);
    check(x - bw / 2 >= 0 && x + bw / 2 <= w && y - bh > title && y < cta, `"${txt[1]}" is on screen, below the title and above the button (${Math.round(bh)} px tall)`);
    check(bh >= 14, `readable: ${Math.round(bh)} px`);
    check(l === 'ua' ? /Гоґвортсу/.test(txt[2]) : /Hogwarts/.test(txt[2]), `named for screen readers: ${txt[2]}`);
    await page.mouse.click(...(await center(page, '#postBankT')).slice(0, 2)); await sleep(200);
    check(await page.evaluate(() => __wand.st.phase === 'street' && document.querySelector('#postBank').classList.contains('swing')), 'the Gringotts board swings and the shop stays shut');
    if (mobile) { await page.touchscreen.tap(x, y); } else await page.mouse.click(x, y);
    await page.waitForURL(/\/sorting/, { timeout: 5000 }).catch(() => { });
    check(/\/sorting/.test(page.url()) , `the top board leads to the Sorting Ceremony: ${page.url().replace(url, '/')}`);
    check(!errors.length, 'no page errors ' + errors.join(' | ')); await browser.close(); }
}
console.log('== keyboard and the rest of the street');
{ const { browser, page } = await open(url, { viewport: { width: 1440, height: 900 }, init: `localStorage.setItem('wand-sound','0')` });
  for (let i = 0; i < 12 && !(await page.evaluate(() => document.activeElement && document.activeElement.id === 'postHall')); i++) await page.keyboard.press('Tab');
  check(await page.evaluate(() => getComputedStyle(document.querySelector('#postHall .ring')).opacity) === '1', 'Tab reaches the board and shows a gold ring');
  await page.keyboard.press('Enter'); await page.waitForURL(/\/sorting/, { timeout: 5000 }).catch(() => { });
  check(/\/sorting/.test(page.url()), 'Enter on the focused board goes to Hogwarts, not into the shop'); await browser.close(); }
{ const { browser, page } = await open(url, { viewport: { width: 390, height: 844 }, mobile: true, init: `localStorage.setItem('wand-sound','0')` });
  await sleep(300); await page.mouse.click(120, 500); await sleep(400);
  check(await page.evaluate(() => __wand.st.phase !== 'street') && !/sorting/.test(page.url()), 'a tap elsewhere on the street still opens the shop'); await browser.close(); }
await closeAll(); srv.close();
console.log(fails.length ? `\n${fails.length} FAILED:\n- ${fails.join('\n- ')}` : '\nall passed');
process.exit(fails.length ? 1 : 0);
