// Forces each failure reaction and plays a full pointer game at phone size, with screenshots in tools/e2e/shots.
//   node tools/e2e/reactions.mjs
import path from 'node:path';
import { closeAll, serve, open, note, enter, choosePointer, recordReactions, pointerGame, resultShown, ensureShots, sleep } from './lib.mjs';

const PHONE = { width: 390, height: 844 }, SHOTS = ensureShots();
const { srv, url } = await serve();
const fails = [];
const check = (ok, what) => { console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) fails.push(what); };
const KINDS = ['fizzle', 'drop', 'fly', 'crack', 'avalanche', 'blackout', 'bubbles', 'butterflies', 'snow', 'smoke'];

console.log('== each reaction, forced');
{
  const { browser, page, errors } = await open(url, { viewport: PHONE, mobile: true });
  await enter(page); await choosePointer(page);
  // wait for the warm-up to be armed, so the shop is built and a wave is expected
  await page.waitForFunction(() => __wand.st.cap, null, { timeout: 20000 });
  for (const kind of KINDS) {
    await page.evaluate(k => {
      const { st, WANDS, REACT } = __wand, w = WANDS[Math.floor(Math.random() * WANDS.length)];
      st.wand = { w, x: innerWidth / 2, y: innerHeight * .35, tx: innerWidth / 2, ty: innerHeight * .35, ang: -.9, s: 1, a: 1, mode: 'present', vx: 0, vy: 0, vr: 0 };
      window.__done = false; Promise.resolve(REACT[k](w)).then(() => { window.__done = true; });
    }, kind);
    await sleep(kind === 'blackout' ? 900 : 650);
    await page.screenshot({ path: path.join(SHOTS, `reaction-${kind}.png`) });
    const n = await note(page);
    await page.waitForFunction(() => window.__done, null, { timeout: 15000 });
    check(!!n.head, `${kind}: "${n.head}"`);
    await sleep(300);
  }
  check(!errors.length, 'no page errors ' + errors.join(' | '));
  await browser.close();
}

console.log('== no reaction repeats within the last 4 (fizzle included)');
{
  const { browser, page } = await open(url);
  const bad = await page.evaluate(() => {
    const { st, pickReact } = __wand; let bad = 0;
    for (let g = 0; g < 4000; g++) { const seq = []; st.lastReacts = []; for (let i = 0; i < 12; i++) { const k = pickReact(Math.random() < .5); if (seq.slice(-4).includes(k)) bad++; seq.push(k); } }
    return bad;
  });
  check(bad === 0, `${bad} repeats in 48 000 picks`);
  await browser.close();
}

console.log('== full pointer game, 390×844');
{
  const { browser, page, errors } = await open(url, { viewport: PHONE, mobile: true });
  await page.screenshot({ path: path.join(SHOTS, 'play-0-street.png') });
  await enter(page); await sleep(500);
  await page.screenshot({ path: path.join(SHOTS, 'play-1-intro.png') });
  await recordReactions(page); await choosePointer(page);
  const r = await pointerGame(page, PHONE, 170000, async i => { await sleep(250); await page.screenshot({ path: path.join(SHOTS, `play-2-wave-${i}.png`) }); });
  check(r.done, `reaches the result after ${r.waves} waves`);
  await sleep(1500);
  await page.screenshot({ path: path.join(SHOTS, 'play-3-result.png') });
  console.log('    reactions', await page.evaluate(() => __reacts), 'winner', await page.evaluate(() => __wand.st.winner.id));
  check(await resultShown(page), 'result card is showing');
  check(!errors.length, 'no page errors ' + errors.join(' | '));
  await browser.close();
}

await closeAll(); srv.close();
console.log(fails.length ? `\n${fails.length} FAILED:\n- ${fails.join('\n- ')}` : '\nall passed');
process.exit(fails.length ? 1 : 0);
