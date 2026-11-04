// The first game opens with the warm-up wave, Try again goes straight to the wands.
//   node tools/e2e/retry.mjs
import { closeAll, serve, open, enter, choosePointer, pointerGame, sleep } from './lib.mjs';
const { srv, url } = await serve(), fails = [];
const check = (ok, what) => { console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) fails.push(what); };
const LOG = `window.__notes = []; addEventListener('DOMContentLoaded', () => { new MutationObserver(() => { const k = document.querySelector('#nKicker').textContent + ' | ' + document.querySelector('#nHand').textContent; if (__notes[__notes.length - 1] !== k) __notes.push(k); }).observe(document.querySelector('#noteIn'), { childList: true, subtree: true, characterData: true }); });`;
for (const [name, opts] of [['phone', { viewport: { width: 390, height: 844 }, mobile: true }], ['desktop', { viewport: { width: 1440, height: 900 } }]]) {
  console.log('== ' + name);
  const { page, errors } = await open(url, { ...opts, init: LOG });
  await enter(page); await choosePointer(page);
  let g = await pointerGame(page, opts.viewport);
  let notes = await page.evaluate(() => __notes);
  check(g.done && notes.some(n => /^Перший змах/.test(n)) && notes.some(n => /Цікава рука/.test(n)), 'the first game opens with the warm-up wave');
  const last = await page.evaluate(() => { const o = __wand.st.obs[__wand.st.obs.length - 1]; __notes.length = 0; document.querySelector('#bAgain').click(); return o.speed; });
  await page.waitForFunction(() => __wand.st.attempt === 1 && document.querySelector('#stage').classList.contains('on') && __wand.st.cap, null, { timeout: 30000 });
  const s = await page.evaluate(() => ({ obs: __wand.st.obs.length, first: __wand.st.obs[0].speed, attempt: __wand.st.attempt }));
  check(s.obs === 1 && s.first === last && s.attempt === 1, 'Try again starts on the first wand with the last wave kept');
  g = await pointerGame(page, opts.viewport);
  notes = await page.evaluate(() => __notes);
  check(g.done, `the second game reaches the card in ${g.waves} waves`);
  check(!notes.some(n => /Перший змах|Цікава рука/.test(n)), 'no warm-up note in the second game: ' + notes[0]);
  check(!errors.length, 'no page errors ' + errors.join(' | '));
}
await closeAll(); srv.close();
console.log(fails.length ? `\n${fails.length} FAILED:\n- ${fails.join('\n- ')}` : '\nall passed');
process.exit(fails.length ? 1 : 0);
