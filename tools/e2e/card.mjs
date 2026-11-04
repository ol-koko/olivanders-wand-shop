// The result card and its sharing paths, in both languages and at both sizes.
//   node tools/e2e/card.mjs
import path from 'node:path';
import fs from 'node:fs';
import { closeAll, serve, open, ensureShots, sleep } from './lib.mjs';
const SHOTS = ensureShots(), { srv, url } = await serve(), fails = [];
const check = (ok, what) => { console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) fails.push(what); };
const PHONE = { width: 390, height: 844 }, DESK = { width: 1440, height: 900 };
const show = (page, id, lang = 'ua') => page.evaluate(([i, l]) => {
  document.querySelector(`#lang button[data-l="${l}"]`).click();
  const { st, WANDS, showResult } = __wand; document.querySelector('#street').hidden = true;
  st.winner = WANDS.find(w => w.id === i); st.traits = { speed: .85, amp: .8, sharp: .78, flow: .5, curl: .5 }; st.stroke = [{ x: 10, y: 10 }, { x: 100, y: 90 }, { x: 220, y: 40 }]; st.tried = []; showResult();
}, [id, lang]);
const visible = (page, sel) => page.evaluate(s => { const e = document.querySelector(s); return !!e && !e.hidden && !e.closest('[hidden]'); }, sel);
const pngSize = b => [b.readUInt32BE(16), b.readUInt32BE(20)];

console.log('== content');
{
  const { page, errors } = await open(url, { viewport: PHONE, mobile: true });
  await show(page, 'voldemort'); await sleep(1500); await page.screenshot({ path: path.join(SHOTS, 'card-ua.png') });
  const text = await page.evaluate(() => document.querySelector('.rcard').innerText);
  console.log('    ' + text.replace(/\n+/g, ' | '));
  for (const gone of ['Твій почерк', 'сигіл', 'Майже', 'Чому вона', 'Це гра']) check(!text.includes(gone), 'removed: ' + gone);
  check(/Ця паличка обрала тебе, тому що ти чаклуєш: швидко, широко, різко/.test(text), 'why it chose you');
  check(!/Покрути/.test(text), 'no rotate hint');
  check(!/Неофіційний фан-проєкт/.test(text), 'fan notice only on the street, not on the card');
  check(!/Копіювати|LinkedIn|Telegram/.test(text), 'no copy link, no social links');
  check(/made by Oleksandra Kokozei/.test(text) && (await page.getAttribute('#rCredit', 'href')) === 'https://oleksandra-kokozei.com', 'creator credit links to the site');
  const lore = await page.evaluate(() => __wand.st.winner.lore.ua); check(!text.includes(lore), 'no lore sentence on the card');
  const fitBtns = await page.$$eval('.r-btns button:not([hidden])', e => e.map(x => [x.textContent, Math.round(x.getBoundingClientRect().width), x.scrollWidth <= x.clientWidth + 1]));
  check(fitBtns.every(b => b[1] === 173 && b[2]), 'buttons are 173px and their labels fit: ' + JSON.stringify(fitBtns));
  const h = await page.evaluate(() => document.querySelector('.rcard').offsetHeight); const gaps = await page.evaluate(() => { const r = document.querySelector('.rcard').getBoundingClientRect(), o = document.querySelector('#result').getBoundingClientRect(); return { l: Math.round(r.left), r: Math.round(o.right - r.right), scroll: document.querySelector('#result').scrollHeight <= document.querySelector('#result').clientHeight + 1, bg: getComputedStyle(document.querySelector('#result')).backgroundImage, glow: (() => { const t = document.querySelector('#rStage').getBoundingClientRect(), g = getComputedStyle(document.querySelector('#rStage'), '::before'); return [g.left, g.top, t.width / 2 + 'px', t.height / 2 + 'px']; })() }; });
  check(gaps.l === 16 && gaps.r === 16 && /rgba\(5, 3, 2, 0\.88\)/.test(gaps.bg), `see-through overlay, margins around the card: ${gaps.l}/${gaps.r}`);
  check(gaps.glow[0] === gaps.glow[2] && gaps.glow[1] === gaps.glow[3], `the light is centred on the wand: ${gaps.glow.join(' ')}`);
  check(h < 790, `card fits a phone screen (${h}px)`);
  await show(page, 'dumbledore', 'en'); await sleep(1200); await page.screenshot({ path: path.join(SHOTS, 'card-en-rare.png') });
  const en = await page.evaluate(() => document.querySelector('.rcard').innerText); check(/This wand chose you because you cast quickly, widely, sharply/.test(en) && /A RARE CHOICE/i.test(en) && /made by Oleksandra Kokozei/.test(en), 'English, rare badge, credit');
  await show(page, 'luna'); await sleep(300); const luna = await page.evaluate(() => document.querySelector('.rcard').innerText); check(!/канон|canon|книж|книз|book/i.test(luna) && !(await visible(page, '#rSpecs')), 'a wand with no canon spec shows no spec line and no label');
  await show(page, 'neville'); await sleep(200); const nev = await page.evaluate(() => document.querySelector('#rSpecs').textContent); check(!/дюйм/.test(nev), 'Neville has no length: ' + nev);
  check(!errors.length, 'no page errors ' + errors.join(' | '));
}
await closeAll();
console.log('== share image');
for (const [id, lang] of [['voldemort', 'ua'], ['hermione', 'en']]) {
  const { page } = await open(url, { viewport: DESK });
  await show(page, id, lang); await sleep(600);
  const data = await page.evaluate(async () => { const b = await __wand.makeCard(); const r = new FileReader(); return new Promise(res => { r.onload = () => res(r.result.split(',')[1]); r.readAsDataURL(b); }); });
  const buf = Buffer.from(data, 'base64'), [w, h] = pngSize(buf); fs.writeFileSync(path.join(SHOTS, `share-${id}.png`), buf);
  check(w === 1080 && h === 1350, `${id} PNG ${w}×${h}`);
}
await closeAll();
console.log('== desktop: no file sharing');
{
  const { page, errors } = await open(url, { viewport: DESK, init: `delete Navigator.prototype.share; delete Navigator.prototype.canShare;` });
  await show(page, 'harry', 'en'); await sleep(800);
  check(!(await visible(page, '#bShare')) && await visible(page, '#bDown'), 'Download, no Share button');
  const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 10000 }), page.click('#bDown')]);
  const buf = fs.readFileSync(await dl.path()); check(dl.suggestedFilename() === 'my-wand.png' && pngSize(buf)[1] === 1350, 'download gives the PNG: ' + dl.suggestedFilename());
  await page.screenshot({ path: path.join(SHOTS, 'card-desktop.png') });
  check(!errors.length, 'no page errors ' + errors.join(' | '));
}
await closeAll();
console.log('== phone: share sheet');
{
  const mock = kind => `window.__shared = []; navigator.canShare = () => true; navigator.share = async d => { window.__shared.push({ names: d.files.map(f => f.name + ':' + f.type), text: d.text, url: d.url }); ${kind} };`;
  { const { page, errors } = await open(url, { viewport: PHONE, mobile: true, init: mock('') });
    await show(page, 'harry'); await sleep(800); check(await visible(page, '#bShare') && !(await visible(page, '#bDown')), 'Share button only');
    await page.tap('#bShare'); await sleep(300); const s = await page.evaluate(() => __shared[0]); console.log('    ', JSON.stringify(s)); check(s && /png/.test(s.names[0]) && s.text && s.url, 'shares PNG, text and URL'); check(!errors.length, 'no page errors ' + errors.join(' | ')); }
  { const { page, errors } = await open(url, { viewport: PHONE, mobile: true, init: mock(`throw new DOMException('x', 'AbortError');`) });
    await show(page, 'harry'); await sleep(800); await page.tap('#bShare'); await sleep(300);
    check(await visible(page, '#bShare') && !(await visible(page, '#bDown')), 'cancel stays silent'); check(!errors.length, 'no page errors ' + errors.join(' | ')); }
  { const { page, errors } = await open(url, { viewport: PHONE, mobile: true, init: mock(`throw new DOMException('x', 'NotAllowedError');`) });
    await show(page, 'harry'); await sleep(800); await page.tap('#bShare'); await sleep(300);
    check(await visible(page, '#bDown'), 'a failed share offers the download'); check(!errors.length, 'no page errors ' + errors.join(' | ')); }
}
await closeAll();
console.log('== in-app browser');
{
  const { page, errors } = await open(url, { viewport: PHONE, mobile: true, userAgent: 'Mozilla/5.0 (iPhone) AppleWebKit/605.1.15 Mobile/15E148 Instagram 300.0', init: `delete Navigator.prototype.share; delete Navigator.prototype.canShare;` });
  await show(page, 'luna'); await sleep(800); await page.tap('#bDown'); await sleep(400);
  check(await visible(page, '#rSavedImg'), 'shows the image to press and hold'); check(await page.evaluate(() => document.querySelector('#rSavedImg').naturalWidth === 1080), 'image is the 1080 card');
  await page.screenshot({ path: path.join(SHOTS, 'card-inapp.png'), fullPage: false }); check(!errors.length, 'no page errors ' + errors.join(' | '));
}
await closeAll(); srv.close();
console.log(fails.length ? `\n${fails.length} FAILED:\n- ${fails.join('\n- ')}` : '\nall passed');
process.exit(fails.length ? 1 : 0);
