// Game logic with no DOM: the wands, how a wave is measured, how a wand is chosen. index.html and tools/ run this same code.
const WandLogic = (() => {
'use strict';
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const wrapA = a => { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; };

/* ================= wands ================= */
const TR = ['speed', 'amp', 'sharp', 'flow', 'curl'];
const sp = (wu, we, cu, ce, lu, le, n, fu, fe) => ({ wood: { ua: wu, en: we }, core: { ua: cu, en: ce }, len: lu ? { ua: lu, en: le } : null, lenN: n, flex: fu ? { ua: fu, en: fe } : null });
const PHX = ['перо фенікса', 'phoenix feather'], DRG = ['жила з серця дракона', 'dragon heartstring'], UNI = ['волос єдинорога', 'unicorn hair'];
// t = displayed taste [speed, amp, sharp, flow, curl]; tc = calibrated profile used for matching; b = calibration bias
const WANDS = [
  { id: 'harry', name: { ua: 'Паличка Гаррі Поттера', en: 'Harry Potter’s wand' }, spec: sp('Остролист', 'Holly', ...PHX, '11 дюймів', '11 inches', 11, 'гнучка', 'supple'), box: '#6b2420', t: [.82, .62, .55, .45, .35], lore: { ua: 'Остролист обирає тих, хто діє раніше, ніж устигне злякатися.', en: 'Holly chooses those who act before they have time to be afraid.' } },
  { id: 'hermione', name: { ua: 'Паличка Герміони Ґрейнджер', en: 'Hermione Granger’s wand' }, spec: sp('Виноградна лоза', 'Vine', ...DRG, '10¾ дюйма', '10¾ inches', 10.75), box: '#2c3a5a', t: [.5, .35, .3, .85, .5], lore: { ua: 'Лоза обирає тих, хто бачить порядок там, де інші бачать хаос.', en: 'Vine chooses those who see order where others see chaos.' } },
  { id: 'ron', name: { ua: 'Паличка Рона Візлі', en: 'Ron Weasley’s wand' }, spec: sp('Верба', 'Willow', ...UNI, '14 дюймів', '14 inches', 14), box: '#7a4a1e', t: [.55, .88, .5, .3, .4], lore: { ua: 'Верба любить широкі жести й не боїться помилок.', en: 'Willow likes big gestures and isn’t afraid of mistakes.' } },
  { id: 'dumbledore', name: { ua: 'Бузинова паличка Албуса Дамблдора', en: 'Albus Dumbledore’s Elder Wand' }, spec: sp('Бузина', 'Elder', 'волос із хвоста тестрала', 'Thestral tail hair', '15 дюймів', '15 inches', 15), box: '#3d2c4a', rare: true, t: [.3, .85, .1, .95, .85], lore: { ua: 'Бузина обирає рідко, і сьогодні вона обрала тебе.', en: 'Elder rarely chooses anyone, and today it chose you.' } },
  { id: 'mcgonagall', name: { ua: 'Паличка Мінерви Макґонеґел', en: 'Minerva McGonagall’s wand' }, spec: sp('Ялиця', 'Fir', ...DRG, '9½ дюйма', '9½ inches', 9.5, 'тверда', 'rigid'), box: '#1f3a2c', t: [.55, .4, .78, .82, .15], lore: { ua: 'Ялиця цінує точність і не терпить зайвих рухів.', en: 'Fir values precision and has no patience for wasted motion.' } },
  { id: 'sirius', name: { ua: 'Паличка Сіріуса Блека', en: 'Sirius Black’s wand' }, spec: null, lenN: 12.5, box: '#3a1418', t: [.88, .8, .7, .3, .3], lore: { ua: 'Ця паличка не терпить жодних кліток.', en: 'This wand can’t stand cages of any kind.' } },
  { id: 'fred', name: { ua: 'Паличка Фреда Візлі', en: 'Fred Weasley’s wand' }, spec: null, lenN: 12, box: '#8a3a16', t: [.78, .62, .4, .2, .75], lore: { ua: 'Ця паличка любить жарти більше, ніж закляття.', en: 'This wand likes jokes more than spells.' } },
  { id: 'george', name: { ua: 'Паличка Джорджа Візлі', en: 'George Weasley’s wand' }, spec: null, lenN: 12, box: '#6a3a14', t: [.68, .72, .58, .28, .6], lore: { ua: 'Ця паличка завжди готова до жарту й знає, де її пара.', en: 'This wand is always up for a joke and always knows where its twin is.' } },
  { id: 'ginny', name: { ua: 'Паличка Джіні Візлі', en: 'Ginny Weasley’s wand' }, spec: null, lenN: 11, box: '#4a2a3e', t: [.88, .42, .65, .58, .55], lore: { ua: 'Швидка, влучна й безстрашна: краще її не злити.', en: 'Quick, precise and fearless: best not to annoy it.' } },
  { id: 'neville', name: { ua: 'Паличка Невіла Лонґботома', en: 'Neville Longbottom’s wand' }, spec: sp('Вишня', 'Cherry', ...UNI, null, null, 13), box: '#2f4a2e', t: [.2, .45, .2, .7, .35], lore: { ua: 'Вишня відкривається повільно, зате назавжди.', en: 'Cherry opens up slowly, but for good.' } },
  { id: 'luna', name: { ua: 'Паличка Луни Лавґуд', en: 'Luna Lovegood’s wand' }, spec: null, lenN: 12, box: '#2a4a5e', t: [.3, .6, .15, .55, .9], lore: { ua: 'Ця паличка помічає те, чого не бачать інші.', en: 'This wand notices what others miss.' } },
  { id: 'draco', name: { ua: 'Паличка Драко Мелфоя', en: 'Draco Malfoy’s wand' }, spec: sp('Глід', 'Hawthorn', ...UNI, '10 дюймів', '10 inches', 10, 'досить пружна', 'reasonably springy'), box: '#1e2a22', t: [.6, .28, .65, .7, .25], lore: { ua: 'Глід однаково вправно лікує й ранить.', en: 'Hawthorn heals and harms with equal skill.' } },
  { id: 'snape', name: { ua: 'Паличка Северуса Снейпа', en: 'Severus Snape’s wand' }, spec: null, lenN: 13, box: '#141418', t: [.42, .25, .85, .9, .1], lore: { ua: 'Жодного зайвого руху, жодного зайвого слова.', en: 'No wasted motion, no wasted words.' } },
  { id: 'lupin', name: { ua: 'Паличка Ремуса Люпина', en: 'Remus Lupin’s wand' }, spec: sp('Кипарис', 'Cypress', ...UNI, '10¼ дюйма', '10¼ inches', 10.25, 'податлива', 'pliable'), box: '#4a3a2a', t: [.35, .58, .3, .75, .55], lore: { ua: 'Кипарис обирає шляхетних і лагідних.', en: 'Cypress chooses the noble and the gentle.' } },
  { id: 'bellatrix', name: { ua: 'Паличка Белатриси Лестранж', en: 'Bellatrix Lestrange’s wand' }, spec: sp('Горіх', 'Walnut', ...DRG, '12¾ дюйма', '12¾ inches', 12.75, 'непіддатлива', 'unyielding'), box: '#2a1626', t: [.92, .7, .9, .15, .65], lore: { ua: 'Горіх слухається лише дуже сильної волі.', en: 'Walnut obeys only a very strong will.' } },
  { id: 'voldemort', name: { ua: 'Паличка Лорда Волдеморта', en: 'Lord Voldemort’s wand' }, spec: sp('Тис', 'Yew', ...PHX, '13½ дюйма', '13½ inches', 13.5), box: '#1d1d24', t: [.75, .6, .88, .78, .3], lore: { ua: 'Тис не терпить вагань.', en: 'Yew tolerates no hesitation.' } }
];
const BIAS = { harry: -0.017, hermione: 0.025, ron: -0.013, dumbledore: 0.076, mcgonagall: -0.027, sirius: -0.021, fred: 0.007, george: -0.025, ginny: 0.005, neville: 0.057, luna: 0.038, draco: -0.027, snape: -0.010, lupin: 0.014, bellatrix: -0.041, voldemort: -0.042 };
WANDS.forEach(w => { w.tc = w.t.map(v => .5 + (v - .5) * .55); w.b = BIAS[w.id] || 0; w.lenN = w.spec ? w.spec.lenN : w.lenN; });
function wandDist(w, tr) { let s = 0, n = 0; TR.forEach((k, i) => { if (tr && tr[k] != null) { s += (tr[k] - w.tc[i]) ** 2; n++; } }); return n ? Math.sqrt(s / n) + w.b : 0; }

/* ================= metrics ================= */
function resample(pts, step) {
  if (!pts.length) return []; const out = [{ x: pts[0].x, y: pts[0].y }]; let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    let ax = pts[i - 1].x, ay = pts[i - 1].y; const bx = pts[i].x, by = pts[i].y; let d = Math.hypot(bx - ax, by - ay);
    while (acc + d >= step && d > 0) { const r = (step - acc) / d; ax += (bx - ax) * r; ay += (by - ay) * r; out.push({ x: ax, y: ay }); d = Math.hypot(bx - ax, by - ay); acc = 0; }
    acc += d;
  }
  return out;
}
function pathLen(p) { let l = 0; for (let i = 1; i < p.length; i++) l += Math.hypot(p[i].x - p[i - 1].x, p[i].y - p[i - 1].y); return l; }
// Traits are measured on a fixed time grid, so a 120 Hz mouse and a 30 Hz camera tracing the same motion read the same.
const METRIC_STEP = 33;
function resampleTime(pts, step) {
  const out = [{ x: pts[0].x, y: pts[0].y, t: pts[0].t }], end = pts[pts.length - 1].t; let i = 1;
  for (let t = pts[0].t + step; t < end; t += step) {
    while (pts[i].t < t) i++;
    const a = pts[i - 1], b = pts[i], u = (t - a.t) / Math.max(1e-6, b.t - a.t);
    out.push({ x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), t });
  }
  const z = pts[pts.length - 1]; out.push({ x: z.x, y: z.y, t: z.t });
  return out;
}
// Value ranges read from real recorded waves. A hand in front of a camera moves about half as fast as a finger or mouse and shakes more, so each input has its own scale.
const SCALES = { pointer: { speed: [1, 6], amp: [.3, 1.2], loops: 5, corners: 2.5, turn: .5 }, camera: { speed: [.8, 2.8], amp: [.3, .8], loops: 4.5, corners: 3.5, turn: .8 } };
const unit = (v, [lo, hi]) => clamp((v - lo) / (hi - lo));
function strokeMetrics(raw, MIN, mode = 'pointer') {
  const sc = SCALES[mode];
  const pts = resampleTime(raw, METRIC_STEP), len = pathLen(pts), dur = Math.max(.08, (pts[pts.length - 1].t - pts[0].t) / 1000);
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const p of pts) { x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y); x1 = Math.max(x1, p.x); y1 = Math.max(y1, p.y); }
  const v = len / MIN / dur, speed = unit(v, sc.speed);
  const a = Math.sqrt(Math.max(x1 - x0, MIN * .02) * Math.max(y1 - y0, MIN * .02)) / MIN, amp = unit(a, sc.amp);
  const rs = resample(pts, MIN * .025); let corners = 0, turn = 0, n = 0, last = -9, signed = 0;
  for (let i = 2; i < rs.length - 2; i++) {
    const a1 = Math.atan2(rs[i].y - rs[i - 2].y, rs[i].x - rs[i - 2].x), a2 = Math.atan2(rs[i + 2].y - rs[i].y, rs[i + 2].x - rs[i].x);
    const d = Math.abs(wrapA(a2 - a1)); turn += d; n++; if (d > 1.05 && i - last > 3) { corners++; last = i; }
  }
  for (let i = 1; i < rs.length - 1; i++) { const a1 = Math.atan2(rs[i].y - rs[i - 1].y, rs[i].x - rs[i - 1].x), a2 = Math.atan2(rs[i + 1].y - rs[i].y, rs[i + 1].x - rs[i].x); signed += wrapA(a2 - a1); }
  const sharp = clamp(.65 * clamp(corners / Math.max(len / MIN, .5) / sc.corners) + .35 * clamp((n ? turn / n : 0) / sc.turn)); // corners per length, so a longer wave isn't sharper by itself
  const curl = clamp(Math.abs(signed) / (Math.PI * 2) / sc.loops);
  // rhythm: variation of speed across ~60ms windows
  const sp = []; let j = 0;
  for (let i = 1; i < pts.length; i++) { if (pts[i].t - pts[j].t >= 60) { sp.push(Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y) / (pts[i].t - pts[j].t)); j = i; } }
  let flow = .6; if (sp.length >= 3) { const m = sp.reduce((s, v) => s + v, 0) / sp.length; const sd = Math.sqrt(sp.reduce((s, v) => s + (v - m) ** 2, 0) / sp.length); flow = clamp(1 - (sd / Math.max(m, 1e-6) - .2) / .9); }
  return { len, dur, speed, amp, sharp, flow, curl };
}

/* ================= choosing ================= */
const averageTraits = obs => { if (!obs.length) return null; const t = {}; TR.forEach(k => t[k] = obs.reduce((s, o) => s + o[k], 0) / obs.length); return t; };
const byMatch = (tr, tried) => WANDS.filter(w => !tried.includes(w)).sort((a, b) => wandDist(a, tr) - wandDist(b, tr));
const bestMatch = (tr, tried) => byMatch(tr, tried)[0];
const OFFER_Q = [.3, .42, .58, .75, .9, 1], MAX_ATTEMPTS = 6, NEAR_MISS = .025;
// Offers the current best match with a probability that grows by attempt, otherwise another close wand.
function chooseCandidate(tr, tried, attempt, rnd = Math.random) {
  const pool = byMatch(tr, tried);
  if (rnd() < OFFER_Q[Math.min(attempt - 1, OFFER_Q.length - 1)]) return pool[0];
  const others = pool.slice(1, 8); return others[Math.floor(Math.pow(rnd(), 1.4) * others.length)];
}
// A wand chooses the person only if it is still the best match after the wave. Hard cap on attempts.
const isChosen = (cand, best, attempt) => cand === best || attempt >= MAX_ATTEMPTS;
const isNearMiss = (cand, best, tr) => wandDist(cand, tr) - wandDist(best, tr) < NEAR_MISS;

/* ================= camera motion ================= */
// The long side of the video spans `span` × min(w, h), so hand traits read on the same scale as pointer strokes.
const CAM = { span: 1.75, tau: 42, startSpeed: .6, startFrames: 2, settle: 350, endSpeed: .22, endHold: 320, minWave: 500, maxWave: 3000, lag: 66 };
function camMap(p, vw, vh, W, H, MIN) { const vm = Math.max(vw, vh), span = CAM.span * MIN; return { x: W / 2 + (.5 - p.x) * vw / vm * span, y: H / 2 + (p.y - .5) * vh / vm * span }; }
function camSmooth(sm, x, y, dt) { const a = 1 - Math.exp(-dt / CAM.tau); sm.x += (x - sm.x) * a; sm.y += (y - sm.y) * a; }
function camSpeed(h, MIN) { if (h.length < 3) return 0; const a = h[h.length - 3], b = h[h.length - 1]; return Math.hypot(b.x - a.x, b.y - a.y) / Math.max(1, b.t - a.t) * 1000 / MIN; }
// One step of wave detection. c holds { active, fast, slow, t0 }. Returns 'wait', 'start', 'move' or 'end'.
function camStep(c, s, t, firstSeen) {
  if (!c.active) {
    if (t - firstSeen < CAM.settle) return 'wait'; // a hand entering the frame is not a wave
    if (s > CAM.startSpeed) { c.fast = (c.fast || 0) + 1; if (c.fast >= CAM.startFrames) { c.slow = 0; return 'start'; } } else c.fast = 0;
    return 'wait';
  }
  if (s < CAM.endSpeed) { if (!c.slow) c.slow = t; if (t - c.slow > CAM.endHold && t - c.t0 > CAM.minWave) return 'end'; } else c.slow = 0;
  return 'move';
}

return { clamp, lerp, wrapA, TR, WANDS, BIAS, wandDist, resample, strokeMetrics, averageTraits, bestMatch, chooseCandidate, isChosen, isNearMiss, MAX_ATTEMPTS, CAM, camMap, camSmooth, camSpeed, camStep };
})();
if (typeof module !== 'undefined') module.exports = WandLogic;
