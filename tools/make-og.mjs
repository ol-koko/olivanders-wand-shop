// Generates the link preview image and the icons from the game's own drawing.
//   node tools/make-og.mjs
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
fs.writeFileSync(path.join(ROOT, 'favicon.svg'), ICON);

const { srv, url } = await serve();
{
  const { page } = await open(url, { viewport: { width: 1200, height: 630 }, locale: 'en-US' });
  await page.evaluate(() => document.fonts.ready); await sleep(700);
  await page.addStyleTag({ content: '#cta,.topbar,#stFan{display:none!important}' });
  await page.evaluate(() => {
    document.querySelector('#stS').textContent = 'Which Harry Potter wand are you?';
    const c = document.createElement('canvas'); c.width = 1200; c.height = 630; c.style.cssText = 'position:absolute;inset:0;z-index:9'; document.querySelector('#street').appendChild(c);
    const x = c.getContext('2d'), w = __wand.WANDS.find(v => v.id === 'harry');
    __wand.drawWand(x, 690, 545, 470, -.05, w, .9);
  });
  await sleep(300);
  await page.screenshot({ path: path.join(ROOT, 'og.png') });
}
{
  const { page } = await open('about:blank', { viewport: { width: 180, height: 180 } });
  await page.setContent(`<body style="margin:0;background:#0e0705">${ICON.replace('<svg ', '<svg width="180" height="180" ')}</body>`);
  await page.screenshot({ path: path.join(ROOT, 'apple-touch-icon.png') });
}
await closeAll(); srv.close();
for (const f of ['og.png', 'favicon.svg', 'apple-touch-icon.png']) console.log(f, Math.round(fs.statSync(path.join(ROOT, f)).size / 1024) + ' KB');
process.exit(0);
