// The Sorting Ceremony with no DOM: which questions to ask, and how answers become a house. Shared with tools/simulate-sorting.js.
const SortingLogic = (() => {
'use strict';
const HOUSES = ['G', 'S', 'R', 'H'], CATEGORIES = [1, 2, 3];
// Tuned with tools/simulate-sorting.js: about 25% per house on random answers, about 65% for a wished house, about 5% for an unwanted one.
const TEMP = 1.25, WISH = 2.5, AVOID = 2.5, WAND = .4;

const shuffled = (a, rnd = Math.random) => { const o = a.slice(); for (let i = o.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [o[i], o[j]] = [o[j], o[i]]; } return o; };
// One question per category, unseen ones first. A category that has run out starts over and forgets its seen ids.
function pickQuestions(pool, seen = [], rnd = Math.random) {
  let left = seen.slice();
  const out = CATEGORIES.map(c => {
    const all = pool.filter(q => q.cat === c);
    let fresh = all.filter(q => !left.includes(q.id));
    if (!fresh.length) { const last = [...left].reverse().find(id => all.some(q => q.id === id)); left = left.filter(id => !all.some(q => q.id === id)); fresh = all.filter(q => q.id !== last); }
    return fresh[Math.floor(rnd() * fresh.length)];
  });
  return { questions: out, seen: [...left, ...out.map(q => q.id)] };
}
// The wand's stroke leans a little towards one house, as the Hat's first impression. None when no trait pattern stands out.
function wandImpression(tr) {
  if (!tr) return null;
  const s = { G: tr.speed + tr.amp, S: tr.sharp + 1 - tr.amp, H: tr.flow + 1 - tr.sharp, R: 2 - tr.flow - tr.speed }; // a closed loop, so no house gets an edge from the formula
  const rank = HOUSES.slice().sort((a, b) => s[b] - s[a]);
  return s[rank[0]] - s[rank[1]] >= .1 ? rank[0] : null;
}
function scores({ answers = [], wand = null, wish = null, avoid = null }) {
  const s = { G: 0, S: 0, R: 0, H: 0 };
  for (const w of answers) for (const c of w) s[c]++;
  if (wand) s[wand] += WAND;
  if (wish) s[wish] += WISH;
  if (avoid) s[avoid] -= AVOID;
  return s;
}
function chances(input) { const s = scores(input), e = HOUSES.map(h => Math.exp(s[h] / TEMP)), sum = e.reduce((a, b) => a + b); return Object.fromEntries(HOUSES.map((h, i) => [h, e[i] / sum])); }
// Weighted by score rather than the highest score, so the Hat can still say no.
function sortHouse(input, rnd = Math.random) { const p = chances(input); let r = rnd(); for (const h of HOUSES) { r -= p[h]; if (r <= 0) return h; } return HOUSES[HOUSES.length - 1]; }

return { HOUSES, CATEGORIES, TEMP, WISH, AVOID, WAND, shuffled, pickQuestions, wandImpression, scores, chances, sortHouse };
})();
if (typeof module !== 'undefined') module.exports = SortingLogic;
