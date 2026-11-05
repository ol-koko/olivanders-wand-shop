// Sorting balance on the real pool, through the game's own sorting-logic.js. Exits with an error if a target is missed.
//   node tools/simulate-sorting.js
const { HOUSES, CATEGORIES, shuffled, pickQuestions, wandImpression, sortHouse } = require('../sorting-logic.js');
const { POOL } = require('../sorting-questions.js');
const N = 60000, any = a => a[Math.floor(Math.random() * a.length)], fails = [];
const check = (ok, what) => { console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) fails.push(what); };

console.log('pool');
const ids = POOL.map(q => q.id), totals = { G: 0, S: 0, R: 0, H: 0 }; POOL.forEach(q => q.o.forEach(o => { for (const c of o.w) totals[c]++; }));
check(new Set(ids).size === ids.length, `${ids.length} questions, ids are unique`);
check(POOL.every(q => q.o.length >= 2 && q.o.length <= 4), 'every question has 2 to 4 options');
check(POOL.every(q => q.o.every(o => o.w.length <= 2)), 'every option adds to at most 2 houses');
check(Math.max(...Object.values(totals)) - Math.min(...Object.values(totals)) <= 2, 'weights are even across houses: ' + JSON.stringify(totals));
check(POOL.some(q => q.o.some(o => !o.w)), `neutral options: ${POOL.reduce((n, q) => n + q.o.filter(o => !o.w).length, 0)}`);
check(POOL.every(q => q.ua && q.en && q.o.every(o => o.u && o.e) && q.r.length >= 2), 'both languages and reactions everywhere');

const answers = lean => pickQuestions(POOL).questions.map(q => { const f = lean ? q.o.filter(o => o.w.includes(lean)) : []; return any(f.length ? f : q.o).w; });
function share(opts) { const n = { G: 0, S: 0, R: 0, H: 0 }; for (let i = 0; i < N; i++) n[sortHouse({ answers: answers(opts.lean), wish: opts.wish, avoid: opts.avoid, wand: opts.wand })]++; for (const h of HOUSES) n[h] = n[h] / N * 100; return n; }
const row = n => HOUSES.map(h => `${h} ${n[h].toFixed(1).padStart(4)}`).join('  ');

console.log('\nbalance');
const rnd = share({}); console.log('  random answers     ', row(rnd)); check(HOUSES.every(h => Math.abs(rnd[h] - 25) < 2), 'about 25% per house');
for (const h of HOUSES) { const n = share({ wish: h }); console.log('  wish ' + h + '             ', row(n)); check(n[h] >= 60 && n[h] <= 70, `wish ${h} between 60% and 70%`); }
for (const h of HOUSES) { const n = share({ avoid: h }); console.log('  avoid ' + h + '            ', row(n)); check(n[h] < 10, `unwanted ${h} below 10%`); }
const wand = share({ wand: 'G' }); console.log('  wand leans G       ', row(wand)); check(wand.G - 25 > 2 && wand.G - 25 < 10, 'the wand is a small nudge');
for (const h of HOUSES) console.log('  answers lean ' + h + '     ', row(share({ lean: h })));
console.log('  lean G, wish S     ', row(share({ lean: 'G', wish: 'S' })));

console.log('\nquestions');
{ let s = [], early = 0; for (let i = 0; i < 11; i++) { const p = pickQuestions(POOL, s); if (p.questions.some(q => s.includes(q.id))) early++; s = p.seen; } check(early === 0, 'no question repeats in the first 11 games');
  let seen = [], prev = [], back = 0, cats = true; for (let i = 0; i < 2000; i++) { const p = pickQuestions(POOL, seen); if (p.questions.some(q => prev.includes(q.id))) back++; if (p.questions.map(q => q.cat).join() !== CATEGORIES.join()) cats = false; prev = p.questions.map(q => q.id); seen = p.seen; } check(cats, 'always one question per category'); check(back === 0, 'no question twice in a row, even after a category starts over'); }
{ const c = { G: 0, S: 0, R: 0, H: 0, none: 0 }; for (let i = 0; i < N; i++) { const h = wandImpression({ speed: Math.random(), amp: Math.random(), sharp: Math.random(), flow: Math.random(), curl: Math.random() }); c[h || 'none']++; } console.log('  wand impression on random traits', Object.entries(c).map(([k, v]) => `${k} ${(v / N * 100).toFixed(0)}%`).join('  ')); check(HOUSES.every(h => Math.abs(c[h] - c.G) / N < .03), 'the impression favours no house on random traits'); }
{ const o = POOL[0].o, seen = new Set(); for (let i = 0; i < 200; i++) seen.add(shuffled(o)[0].u); check(seen.size === o.length, 'option order is shuffled'); }

console.log(fails.length ? `\n${fails.length} FAILED:\n- ${fails.join('\n- ')}` : '\nall passed');
process.exit(fails.length ? 1 : 0);
