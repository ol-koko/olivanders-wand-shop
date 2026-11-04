// Meta tags, icons, the preview image and the first language.
//   node tools/e2e/meta.mjs
import fs from 'node:fs';
import path from 'node:path';
import { closeAll, serve, open, sleep, ROOT } from './lib.mjs';
const { srv, url } = await serve(), fails = [];
const check = (ok, what) => { console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) fails.push(what); };
const HOST = 'https://olivanders-wand-shop.vercel.app/';

console.log('== what a crawler reads, with no scripts');
{
  const html = await (await fetch(url)).text();
  const head = html.slice(0, html.indexOf('</head>'));
  const meta = (attr, name) => (head.match(new RegExp(`<meta ${attr}="${name}" content="([^"]*)"`)) || [])[1];
  const title = (head.match(/<title>([^<]*)/) || [])[1];
  console.log('    ' + title);
  check(/wand/i.test(title) && !/[а-яєіїґ]/i.test(title), 'English title');
  check(/^<!DOCTYPE html>\s*<html lang="en">/i.test(html), 'html lang is en');
  for (const [a, n] of [['name', 'description'], ['property', 'og:title'], ['property', 'og:description'], ['property', 'og:image:alt'], ['name', 'twitter:title'], ['name', 'twitter:description']]) { const v = meta(a, n); check(!!v && !/[а-яєіїґ]/i.test(v) && v.length < 200, `${n}: ${v}`); }
  check(meta('property', 'og:url') === HOST, 'og:url is the site');
  check(meta('property', 'og:image') === HOST + 'og.png' && meta('name', 'twitter:image') === HOST + 'og.png', 'absolute image address');
  check(meta('name', 'twitter:card') === 'summary_large_image', 'large Twitter card');
  check(head.includes('og:image:width" content="1200"') && head.includes('og:image:height" content="630"'), 'image size declared');
}
console.log('== files');
{
  const b = fs.readFileSync(path.join(ROOT, 'og.png')); const dim = [b.readUInt32BE(16), b.readUInt32BE(20)];
  check(dim[0] === 1200 && dim[1] === 630, `og.png is ${dim.join('×')}`);
  check(b.length < 1024 * 1024, `og.png is ${Math.round(b.length / 1024)} KB`);
  const a = fs.readFileSync(path.join(ROOT, 'apple-touch-icon.png')); check(a.readUInt32BE(16) === 180, 'apple-touch-icon.png is 180 wide');
  for (const f of ['og.png', 'favicon.svg', 'apple-touch-icon.png']) check((await fetch(url + f)).status === 200, f + ' is served');
}
console.log('== first language');
for (const [locale, want] of [['uk-UA', 'ua'], ['uk', 'ua'], ['en-US', 'en'], ['de-DE', 'en'], ['ru-RU', 'en'], ['pl-PL', 'en']]) {
  const { browser, page, errors } = await open(url, { locale });
  const st = await page.evaluate(() => ({ on: document.querySelector('#lang button.on').dataset.l, lang: document.documentElement.lang, title: document.title, label: document.querySelector('#street').getAttribute('aria-label') }));
  check(st.on === want && st.lang === (want === 'en' ? 'en' : 'uk'), `${locale} → ${st.on}, html lang ${st.lang}, "${st.title}", "${st.label}"`);
  check(!errors.length, 'no page errors ' + errors.join(' | ')); await browser.close();
}
{
  const { browser, page, errors } = await open(url, { locale: 'de-DE' });
  await page.evaluate(() => document.querySelector('#lang button[data-l="ua"]').click()); await page.reload({ waitUntil: 'load' });
  check((await page.evaluate(() => document.querySelector('#lang button.on').dataset.l)) === 'ua', 'a chosen language beats the browser after a reload'); check(!errors.length, 'no page errors ' + errors.join(' | ')); await browser.close();
  const { page: p2 } = await open(url, { locale: 'uk-UA' });
  await p2.evaluate(() => document.querySelector('#lang button[data-l="en"]').click()); await p2.reload({ waitUntil: 'load' });
  check((await p2.evaluate(() => document.querySelector('#lang button.on').dataset.l)) === 'en', 'and the other way round');
}
await closeAll(); srv.close();
console.log(fails.length ? `\n${fails.length} FAILED:\n- ${fails.join('\n- ')}` : '\nall passed');
process.exit(fails.length ? 1 : 0);
