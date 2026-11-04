// A win is remembered and counts against that wand in the next game, both on a phone and on a desktop.
//   node tools/e2e/recent.mjs
import { closeAll, serve, open, enter, choosePointer, pointerGame, sleep } from './lib.mjs';
const { srv, url } = await serve(), fails = [];
const check = (ok, what) => { console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) fails.push(what); };
for (const [name, opts] of [['phone', { viewport: { width: 390, height: 844 }, mobile: true }], ['desktop', { viewport: { width: 1440, height: 900 } }]]) {
  console.log('== ' + name);
  const { page, errors } = await open(url, { ...opts, init: `try { if (!sessionStorage.getItem('seeded')) { sessionStorage.setItem('seeded', '1'); localStorage.setItem('wand-recent', JSON.stringify(['draco', 'luna', 'nobody', 'draco'])); } } catch (_) { }` });
  await enter(page); await choosePointer(page); await sleep(300);
  const before = await page.evaluate(() => Object.fromEntries(__wand.WANDS.filter(w => w.recent).map(w => [w.id, w.recent])));
  check(before.draco === .08 && before.luna === .07 && Object.keys(before).length === 2, 'the game starts with the stored wins, the latest counting most: ' + JSON.stringify(before));
  const { done } = await pointerGame(page, opts.viewport);
  check(done, 'a full game reaches the card');
  const winner = await page.evaluate(() => __wand.st.winner && __wand.st.winner.id), stored = await page.evaluate(() => JSON.parse(localStorage.getItem('wand-recent')));
  check(stored[0] === winner && stored.length === 5, `the winner goes first: ${stored.join(', ')}`);
  check(!errors.length, 'no page errors ' + errors.join(' | '));
}
await closeAll(); srv.close();
console.log(fails.length ? `\n${fails.length} FAILED:\n- ${fails.join('\n- ')}` : '\nall passed');
process.exit(fails.length ? 1 : 0);
