#!/usr/bin/env node
// Wand balance simulator. No dependencies: it runs the real logic.js on synthetic players.
//   node tools/simulate.js                   win distribution for the current BIAS, both models
//   node tools/simulate.js --calibrate       search for BIAS values and print them
//   node tools/simulate.js --parity          the same motion through pointer and camera capture
//   node tools/simulate.js --validate f.json real waves saved by tools/record.html
// The players are a model, not recorded people. Treat the numbers as a balance check, not a forecast.
const fs = require('fs'), path = require('path');
const { TR, WANDS, wandDist, strokeMetrics, averageTraits, bestMatch, chooseCandidate, isChosen, MAX_ATTEMPTS, CAM, camSmooth, camSpeed, camStep } = require('../logic.js');

const MIN = 900, MIN_LEN = MIN * .35, MIN_DUR = .2; // the game asks for a bolder wave below these
const RARE = 'dumbledore', RARE_TARGET = .02, TARGET = (1 - RARE_TARGET) / (WANDS.length - 1), FLOOR = .03;
const target = w => w.id === RARE ? RARE_TARGET : TARGET;
const gauss = () => Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random());
const rand = (a, b) => a + Math.random() * (b - a);
const logn = (m, s) => m * Math.exp(gauss() * s);
const cl = v => Math.max(0, Math.min(1, v));

/* ---------- abstract model: traits directly, a stable personal mean plus noise per wave ---------- */
function abstractPlayer() { const mean = TR.map(() => Math.random()), waves = []; for (let i = 0; i <= MAX_ATTEMPTS; i++) { const o = {}; TR.forEach((k, j) => o[k] = cl(mean[j] + gauss() * .12)); waves.push(o); } return { waves }; }

/* ---------- stroke model: one person has a habit, each wave varies around it ---------- */
const FAMILIES = [
  // shares and ranges tuned so the trait spread matches recorded waves (see --validate)
  { w: .05, f: () => ({ kind: 'sweep', bow: rand(-.4, .4) }) },           // one arc across
  { w: .2, f: () => ({ kind: 'zig', n: 3 + Math.floor(rand(0, 9)) }) },  // back and forth, angular
  { w: .67, f: () => ({ kind: 'swirl', loops: rand(1.5, 7) }) },            // circles and spirals
  { w: .08, f: () => ({ kind: 's', n: rand(2, 6) }) }                     // soft S-curves
];
function habit() {
  let r = Math.random(), fam = FAMILIES[0];
  for (const f of FAMILIES) { if (r < f.w) { fam = f; break; } r -= f.w; }
  return { ...fam.f(), dur: logn(1.5, .35), amp: Math.min(1.6, logn(1, .3)), gust: rand(.1, 1.3), tilt: rand(-.6, .6) };
}
function shape(s, u) {
  switch (s.kind) {
    case 'sweep': return [-1 + 2 * u, s.bow * Math.sin(Math.PI * u)];
    case 'zig': { const q = u * s.n, seg = Math.floor(q), f = q - seg; return [seg % 2 ? 1 - 2 * f : -1 + 2 * f, (u - .5) * .9]; }
    case 'swirl': { const a = 2 * Math.PI * s.loops * u, r = .35 + .65 * u; return [r * Math.cos(a), r * Math.sin(a)]; }
    default: return [-1 + 2 * u, .7 * Math.sin(2 * Math.PI * s.n * u)];
  }
}
// Dense ground-truth motion (px, ms); speed varies through the wave with `gust`.
function motion(h) {
  const dur = Math.max(.25, h.dur * rand(.8, 1.2)) * 1000, A = h.amp * rand(.85, 1.15) * MIN * .5, ph = rand(0, 6.28), ca = Math.cos(h.tilt), sa = Math.sin(h.tilt);
  const N = Math.max(24, Math.round(dur / 8)), pts = []; let prog = 0;
  for (let i = 0; i < N; i++) {
    prog += 1 + h.gust * Math.sin(ph + i / N * 21);
    const [a, b] = shape(h, Math.min(1, prog / N)), x = a * A, y = b * A;
    pts.push({ x: x * ca - y * sa + MIN, y: x * sa + y * ca + MIN, t: i / (N - 1) * dur });
  }
  return pts;
}
function viaPointer(m, hz = 60) {
  const out = []; let last = -99, gap = 1000 / hz;
  for (const p of m) if (p.t - last >= gap) { out.push({ x: p.x + gauss() * .5, y: p.y + gauss() * .5, t: p.t }); last = p.t; }
  return out;
}
// Frame sampling and landmark noise around the same camSmooth/camSpeed/camStep the game runs.
// Recordings: a hand covers about 65% of a finger's sweep at about half its speed.
const HAND_AMP = .65, HAND_SLOW = 1.33;
function viaCamera(m, fps = 30) {
  const gain = HAND_AMP, noise = .0015 * CAM.span * MIN, dt = 1000 / fps, T = m[m.length - 1].t * HAND_SLOW, base = 2000;
  const at = t => { const raw = t <= 0 ? m[0] : t >= T ? m[m.length - 1] : m[Math.min(m.length - 1, Math.floor(t / T * (m.length - 1)))]; return { x: MIN + (raw.x - MIN) * gain, y: MIN + (raw.y - MIN) * gain }; };
  const c = { active: false }, hist = []; let sm = null, prev = 0, pts = [];
  for (let t = -600; t < T + 1400; t += dt) {
    const p = at(t), x = p.x + gauss() * noise, y = p.y + gauss() * noise, now = t + base;
    if (!sm) sm = { x, y }; else camSmooth(sm, x, y, now - prev);
    prev = now; hist.push({ x: sm.x, y: sm.y, t: now }); if (hist.length > 10) hist.shift();
    const ev = camStep(c, camSpeed(hist, MIN), now, 0);
    if (ev === 'start') { c.active = true; c.t0 = hist[Math.max(0, hist.length - 3)].t; pts = hist.slice(-3).map(q => ({ ...q })); continue; }
    if (ev === 'wait') continue;
    pts.push({ x: sm.x, y: sm.y, t: now });
    if (now - c.t0 > CAM.maxWave) return pts;
    if (ev === 'end') return pts.filter(q => q.t <= c.slow - CAM.lag);
  }
  return c.active ? pts : null;
}
function wave(h, capture) {
  for (let tries = 0; tries < 6; tries++) {
    const pts = capture(motion(h));
    if (pts && pts.length >= 4) { const m = strokeMetrics(pts, MIN, capture === viaCamera ? 'camera' : 'pointer'); if (m.len >= MIN_LEN && m.dur >= MIN_DUR) return m; }
    h = { ...h, amp: h.amp * 1.25, dur: h.dur * 1.1 };
  }
  return null;
}
const CAM_SHARE = .25;
function strokePlayer() {
  const camera = Math.random() < CAM_SHARE, cap = camera ? viaCamera : viaPointer, h = habit(), waves = [];
  for (let i = 0; i <= MAX_ATTEMPTS; i++) { const w = wave(h, cap); if (!w) return null; waves.push(w); }
  return { waves, camera };
}
function makePool(n, make) { const pool = []; while (pool.length < n) { const p = make(); if (p) pool.push(p); } return pool; }

/* ---------- the ritual, through the game's own chooseCandidate/isChosen ---------- */
function play(p, stats) {
  const obs = [p.waves[0]], tried = []; let traits = averageTraits(obs), attempt = 0;
  while (true) {
    attempt++;
    const cand = chooseCandidate(traits, tried, attempt);
    obs.push(p.waves[attempt]); traits = averageTraits(obs);
    const best = bestMatch(traits, tried);
    if (isChosen(cand, best, attempt)) { stats.wins[cand.id]++; stats.att[attempt]++; if (stats.pairs) stats.pairs.push([traits, cand]); return; }
    tried.push(cand);
  }
}
function tally(pool, rounds = 4, pairs = false) {
  const stats = { wins: Object.fromEntries(WANDS.map(w => [w.id, 0])), att: new Array(MAX_ATTEMPTS + 1).fill(0), n: 0 }; if (pairs) stats.pairs = [];
  for (let r = 0; r < rounds; r++) for (const p of pool) { play(p, stats); stats.n++; }
  return stats;
}
function report(title, stats) {
  const rows = WANDS.map(w => ({ id: w.id, share: stats.wins[w.id] / stats.n, t: target(w) })).sort((a, b) => b.share - a.share);
  console.log('\n' + title);
  for (const r of rows) console.log(' ', r.id.padEnd(11), (r.share * 100).toFixed(1).padStart(5) + '%', r.share < (r.id === RARE ? 0 : FLOOR) ? ' BELOW FLOOR' : '');
  const mean = stats.att.reduce((s, a, i) => s + a * i, 0) / stats.n;
  console.log('  attempts 1..6:', stats.att.slice(1).map(a => (a / stats.n * 100).toFixed(1) + '%').join(' '), '| average', mean.toFixed(2));
}
const corr = (a, b) => { const ma = a.reduce((x, y) => x + y, 0) / a.length, mb = b.reduce((x, y) => x + y, 0) / b.length; let c = 0, va = 0, vb = 0; a.forEach((_, i) => { c += (a[i] - ma) * (b[i] - mb); va += (a[i] - ma) ** 2; vb += (b[i] - mb) ** 2; }); return c / Math.sqrt(va * vb); };

const clamp2 = v => Math.max(-2, Math.min(2, v));
const arg = process.argv[2];
if (arg === '--parity') {
  // A pipeline with no bias gives a mean difference near zero.
  for (const fps of [30, 15]) {
    const d = Object.fromEntries(TR.map(k => [k, []])); let missed = 0, n = 0;
    while (n < 3000) {
      const m = motion(habit()), a = viaPointer(m), b = viaCamera(m, fps); n++;
      const ok = (x, mode) => { if (!x || x.length < 4) return null; const r = strokeMetrics(x, MIN, mode); return r.len >= MIN_LEN && r.dur >= MIN_DUR ? r : null; };
      const ma = ok(a, 'pointer'), mb = ok(b, 'camera'); if (!ma) continue; if (!mb) { missed++; continue; }
      TR.forEach(k => d[k].push(mb[k] - ma[k]));
    }
    console.log(`camera vs pointer at ${fps} fps (positive = camera reads higher), waves not caught ${(missed / n * 100).toFixed(1)}%`);
    for (const k of TR) { const v = d[k]; console.log(' ', k.padEnd(6), 'mean', (v.reduce((s, x) => s + x, 0) / v.length).toFixed(3).padStart(7), ' abs', (v.reduce((s, x) => s + Math.abs(x), 0) / v.length).toFixed(3)); }
  }
  // Input rate alone must not change traits.
  const d = Object.fromEntries(TR.map(k => [k, 0])); for (let i = 0; i < 2000; i++) { const m = motion(habit()), a = strokeMetrics(viaPointer(m, 120), MIN), b = strokeMetrics(viaPointer(m, 40), MIN); TR.forEach(k => d[k] += Math.abs(a[k] - b[k]) / 2000); }
  console.log('pointer 120 Hz vs 40 Hz, mean abs difference:', TR.map(k => k + ' ' + d[k].toFixed(3)).join(', '));
} else if (arg === '--calibrate') {
  // Fitted on the stroke model only: it goes through the real strokeMetrics. The abstract model has a different trait distribution, so no single BIAS fits both.
  const pool = makePool(10000, strokePlayer);
  let bestErr = 1e9, bestB = null;
  for (let it = 0; it < 150; it++) {
    const s = tally(pool, 2), rate = it < 60 ? .012 : it < 110 ? .006 : .003; let err = 0;
    for (const w of WANDS) err = Math.max(err, Math.abs(s.wins[w.id] / s.n - target(w)));
    if (err < bestErr) { bestErr = err; bestB = Object.fromEntries(WANDS.map(w => [w.id, w.b])); }
    for (const w of WANDS) w.b += rate * clamp2(Math.log((s.wins[w.id] / s.n + 1e-4) / target(w)));
  }
  const mean = Object.values(bestB).reduce((a, b) => a + b, 0) / WANDS.length; WANDS.forEach(w => w.b = bestB[w.id] - mean);
  console.log('worst error while fitting:', (bestErr * 100).toFixed(2) + ' points');
  report('fresh stroke players', tally(makePool(6000, strokePlayer), 4));
  report('fresh abstract players', tally(makePool(30000, abstractPlayer), 2));
  console.log('\nconst BIAS = { ' + WANDS.map(w => `${w.id}: ${w.b.toFixed(3)}`).join(', ') + ' };');
} else if (arg === '--validate') {
  // Real waves re-measured from their saved points with the current code, then replayed as games. One person's waves show spread, not a fair share per wand.
  const groups = {};
  for (const f of process.argv.slice(3)) {
    const rec = JSON.parse(fs.readFileSync(path.resolve(f), 'utf8')), kind = /iPhone|Android/.test(rec.userAgent) ? 'phone' : 'desktop';
    for (const w of rec.waves) { const g = w.mode === 'camera' ? 'camera' : kind, min = Math.min(...w.viewport), m = strokeMetrics(w.pts.map(p => ({ x: p[0], y: p[1], t: p[2] })), min, w.mode); (groups[g] = groups[g] || []).push(m); }
  }
  const q = (arr, f) => [...arr].sort((a, b) => a - b)[Math.floor(f * arr.length)].toFixed(2);
  const syn = makePool(1500, strokePlayer), pools = { pointer: syn.filter(p => !p.camera).flatMap(p => p.waves), camera: syn.filter(p => p.camera).flatMap(p => p.waves) };
  for (const g in groups) {
    const waves = groups[g], model = g === 'camera' ? pools.camera : pools.pointer;
    console.log(`\n${g}: ${waves.length} waves. trait, real p10 p50 p90, model p10 p50 p90`);
    for (const k of TR) console.log(' ', k.padEnd(7), [.1, .5, .9].map(f => q(waves.map(w => w[k]), f)).join(' '), '   ', [.1, .5, .9].map(f => q(model.map(w => w[k]), f)).join(' '));
    const players = Array.from({ length: 4000 }, () => ({ waves: Array.from({ length: MAX_ATTEMPTS + 1 }, () => waves[Math.floor(Math.random() * waves.length)]) }));
    report(`  games replayed from ${g} waves`, tally(players, 1));
  }
} else {
  const strokes = makePool(8000, strokePlayer), abstract = makePool(30000, abstractPlayer);
  report('STROKE MODEL (all players)', tally(strokes, 4));
  report('  of which camera', tally(strokes.filter(p => p.camera), 8));
  report('  of which pointer', tally(strokes.filter(p => !p.camera), 3));
  report('ABSTRACT MODEL', tally(abstract, 2));
  const s = tally(strokes, 1, true);
  console.log('\ndoes the wave still decide the wand? correlation of wave trait and winner taste:');
  TR.forEach((k, i) => console.log(' ', k.padEnd(6), corr(s.pairs.map(p => p[0][k]), s.pairs.map(p => p[1].t[i])).toFixed(2)));
  console.log('\ntrait p10 p50 p90 (stroke model):');
  TR.forEach(k => { const v = strokes.flatMap(p => p.waves.map(w => w[k])).sort((a, b) => a - b); console.log(' ', k.padEnd(6), [.1, .5, .9].map(f => v[Math.floor(f * v.length)].toFixed(2)).join(' ')); });
}
