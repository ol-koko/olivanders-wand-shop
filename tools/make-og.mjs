// Generates the link preview images and the icons from the game's own drawing.
//   node tools/make-og.mjs            everything
//   node tools/make-og.mjs sorting    only the Sorting Ceremony's preview, og-sorting.jpg
import fs from 'node:fs';
import path from 'node:path';
import { closeAll, serve, open, sleep, ROOT } from './e2e/lib.mjs';

const ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <radialGradient id="b" cx=".5" cy=".3" r=".9"><stop offset="0" stop-color="#3a2212"/><stop offset="1" stop-color="#0e0705"/></radialGradient>
    <linearGradient id="w" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#6e4a1c"/><stop offset=".45" stop-color="#d9b46a"/><stop offset="1" stop-color="#fff0c4"/></linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="url(#b)"/>
  <rect x="2.5" y="2.5" width="59" height="59" rx="12" fill="none" stroke="#d9b46a" stroke-opacity=".6" stroke-width="2"/>
  <path d="M13 52 L18 47 L44 21 L46 23 L20 49 L15 54Z" fill="url(#w)"/>
  <path d="M12 53 L19 46 L22 49 L15 56Z" fill="#8a5f28"/>
  <path d="M46 8 L48.4 15.6 L56 18 L48.4 20.4 L46 28 L43.6 20.4 L36 18 L43.6 15.6Z" fill="#fff0c4"/>
</svg>
`;
const ONLY = process.argv[2], made = [];
const { srv, url } = await serve();
if (ONLY !== 'sorting') {
  fs.writeFileSync(path.join(ROOT, 'favicon.svg'), ICON);
  const { browser, page } = await open(url, { viewport: { width: 1200, height: 630 }, scale: 2, locale: 'en-US' }); // twice the size, so sites that re-compress it keep the detail
  await page.evaluate(() => document.fonts.ready); await sleep(700);
  await page.addStyleTag({ content: '#cta,.topbar,#stFan,#post{display:none!important}' }); // the signpost stays out, so the wand has the picture to itself
  await page.evaluate(() => {
    document.querySelector('#stS').textContent = 'Which Harry Potter wand are you?';
    const c = document.createElement('canvas'); c.width = 2400; c.height = 1260; c.style.cssText = 'position:absolute;left:0;top:0;width:1200px;height:630px;z-index:9'; document.querySelector('#street').appendChild(c);
    const x = c.getContext('2d'); x.scale(2, 2); const w = __wand.WANDS.find(v => v.id === 'harry'), cx = 600, cy = 390, L = 430, ang = -Math.PI / 2 - .24, tx = cx + Math.cos(ang) * L / 2, ty = cy + Math.sin(ang) * L / 2, ux = -Math.cos(ang), uy = -Math.sin(ang); // leans left, tip up
    let seed = 7; const R = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    // a soft pool of dark and candlelight, so the wand reads over the shop
    let g = x.createRadialGradient(cx, cy, 10, cx, cy, 190); g.addColorStop(0, 'rgba(8,4,2,.5)'); g.addColorStop(.6, 'rgba(8,4,2,.22)'); g.addColorStop(1, 'rgba(8,4,2,0)'); x.fillStyle = g; x.fillRect(0, 0, 1200, 630);
    x.globalCompositeOperation = 'lighter';
    g = x.createRadialGradient(tx, ty, 0, tx, ty, 150); g.addColorStop(0, 'rgba(255,214,140,.75)'); g.addColorStop(.3, 'rgba(255,180,90,.24)'); g.addColorStop(1, 'rgba(255,160,60,0)'); x.fillStyle = g; x.fillRect(0, 0, 1200, 630);
    x.globalCompositeOperation = 'source-over';
    // magic dust: thicker around the tip, thinning towards the handle
    x.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 380; i++) {
      const u = Math.pow(R(), 1.7), spread = 34 + u * 215, a = R() * 6.283, d = Math.pow(R(), .7) * spread;
      const px = tx + ux * u * L * .92 + Math.cos(a) * d, py = ty + uy * u * L * .92 + Math.sin(a) * d * .55, r = .5 + Math.pow(R(), 3) * 2.6, o = (.35 + R() * .65) * (1 - u * .55);
      const gr = x.createRadialGradient(px, py, 0, px, py, r * 3); gr.addColorStop(0, `rgba(255,240,205,${o})`); gr.addColorStop(.35, `rgba(255,205,120,${o * .55})`); gr.addColorStop(1, 'rgba(255,170,70,0)'); x.fillStyle = gr; x.fillRect(px - r * 3, py - r * 3, r * 6, r * 6);
    }
    // the wand goes over the dust, with one bright spark on the tip and a few stars left in front
    x.globalCompositeOperation = 'source-over';
    x.save(); x.shadowColor = 'rgba(255,214,140,.95)'; x.shadowBlur = 22; __wand.drawWand(x, cx, cy, L, ang, w, 1); x.restore();
    x.globalCompositeOperation = 'lighter';
    g = x.createRadialGradient(tx, ty, 0, tx, ty, 34); g.addColorStop(0, 'rgba(255,248,225,1)'); g.addColorStop(.25, 'rgba(255,220,150,.75)'); g.addColorStop(1, 'rgba(255,180,90,0)'); x.fillStyle = g; x.fillRect(tx - 40, ty - 40, 80, 80);
    x.fillStyle = '#fff4d6';
    for (let i = 0; i < 26; i++) {
      const u = Math.pow(R(), 1.4), a = R() * 6.283, d = 40 + R() * 180 * (.4 + u), px = tx + ux * u * L * .8 + Math.cos(a) * d, py = ty + uy * u * L * .8 + Math.sin(a) * d * .55, s = 3 + R() * 7;
      x.beginPath(); x.moveTo(px, py - s); x.quadraticCurveTo(px, py, px + s, py); x.quadraticCurveTo(px, py, px, py + s); x.quadraticCurveTo(px, py, px - s, py); x.quadraticCurveTo(px, py, px, py - s); x.fill();
    }
  });
  await sleep(300);
  await page.screenshot({ path: path.join(ROOT, 'og.jpg'), type: 'jpeg', quality: 90 });
  await browser.close();
  const ic = (await open('about:blank', { viewport: { width: 180, height: 180 } })).page;
  await ic.setContent(`<body style="margin:0;background:#0e0705">${ICON.replace('<svg ', '<svg width="180" height="180" ')}</body>`);
  await ic.screenshot({ path: path.join(ROOT, 'apple-touch-icon.png') });
  made.push('og.jpg', 'favicon.svg', 'apple-touch-icon.png');
}
if (!ONLY || ONLY === 'sorting') { // the castle at night, with the Hall's title
  const { browser, page } = await open(url + 'sorting', { viewport: { width: 1200, height: 630 }, scale: 2, locale: 'en-US', init: "localStorage.setItem('wand-lang','en')" });
  await page.evaluate(() => document.fonts.ready); await sleep(900);
  await page.addStyleTag({ content: '#cta,.topbar,#stFan{display:none!important}' });
  await page.evaluate(() => { document.querySelector('#stS').textContent = 'Which Hogwarts house are you?'; });
  await sleep(300);
  await page.screenshot({ path: path.join(ROOT, 'og-sorting.jpg'), type: 'jpeg', quality: 90 });
  await browser.close(); made.push('og-sorting.jpg');
}
await closeAll(); srv.close();
for (const f of made) console.log(f, Math.round(fs.statSync(path.join(ROOT, f)).size / 1024) + ' KB');
process.exit(0);
