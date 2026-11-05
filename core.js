'use strict';
// Shared by every screen: helpers, language, depth, sound, the parchment note. Each page's own script declares `st` and adds to `S`.
const { clamp, lerp, wrapA, WANDS, RECENT, setRecentWins, wandDist, resample, strokeMetrics, averageTraits, bestMatch, chooseCandidate, isChosen, isNearMiss, CAM, camMap, camSmooth, camSpeed, camStep } = WandLogic;
const $ = s => document.querySelector(s);
const easeIO = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOut = t => 1 - Math.pow(1 - t, 3);
function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const wait = ms => new Promise(r => setTimeout(r, ms));
const pick = a => a[Math.floor(Math.random() * a.length)];
const SVGNS = 'http://www.w3.org/2000/svg';
let W = innerWidth, H = innerHeight, MIN = Math.min(W, H);
const DPR = Math.min(2, window.devicePixelRatio || 1);
let now = performance.now();
const hasHover = matchMedia('(hover:hover) and (pointer:fine)').matches;
const reduceMotion = matchMedia('(prefers-reduced-motion:reduce)').matches;
const IN_APP = /Instagram|FBAN|FBAV|FB_IAB|FBIOS|LinkedInApp|musical_ly|BytedanceWebview|TikTok/i.test(navigator.userAgent); // these webviews rarely give camera access

/* ================= i18n ================= */
// Ukrainian for a Ukrainian browser, English for everyone else, until the person picks a language.
let lang = /^uk\b/i.test((navigator.languages && navigator.languages[0]) || navigator.language || '') ? 'ua' : 'en';
try { const s = localStorage.getItem('wand-lang'); if (s === 'ua' || s === 'en') lang = s; } catch (_) { }
const S = {
  sndOn: ['Увімкнути звук', 'Turn sound on'], sndOff: ['Вимкнути звук', 'Turn sound off'],
  fan: ['Неофіційний фан-проєкт. Не пов’язаний із Warner Bros. чи Дж. К. Роулінг.', 'Unofficial fan project. Not affiliated with Warner Bros. or J.K. Rowling.']
};
const LI = lang => lang === 'en' ? 1 : 0;
function T(k, v) { let s = S[k][LI(lang)]; if (v) for (const x in v) s = s.split('{' + x + '}').join(v[x]); return s; }
const L = o => o ? o[lang] : '';

/* ================= layers & parallax ================= */
const layers = {};
document.querySelectorAll('.pl').forEach(el => { layers[el.id] = { el, d: +el.dataset.d, ox: 0, oy: 0, s: 1, blur: 0 }; });
const par = { tx: 0, ty: 0, x: 0, y: 0, k: 1, d: .022 };
addEventListener('pointermove', e => { if (e.pointerType === 'mouse') { par.tx = (e.clientX / W - .5) * 2; par.ty = (e.clientY / H - .5) * 2; } }, { passive: true });
function applyLayer(Ly) { Ly.el.style.transform = `translate3d(${Ly.ox.toFixed(2)}px,${Ly.oy.toFixed(2)}px,0) scale(${Ly.s.toFixed(4)})`; Ly.el.style.filter = Ly.blur > .05 ? `blur(${Ly.blur.toFixed(2)}px)` : ''; }
// On touch screens depth comes from tilt where the browser gives orientation events with no prompt, and from dragging a finger over the street.
const tilt = { seen: -1e9, x0: null, y0: null }, touch = { on: false, moved: false, x: 0, y: 0 };
function onTilt(e) {
  if (e.gamma == null || e.beta == null || touch.on) return;
  const wide = W > H, flip = wide && screen.orientation && screen.orientation.angle === 270 ? -1 : 1; // in landscape the axes swap
  const gx = wide ? e.beta * flip : e.gamma, gy = wide ? -e.gamma * flip : e.beta;
  if (tilt.x0 == null) { tilt.x0 = gx; tilt.y0 = gy; }
  tilt.x0 += (gx - tilt.x0) * .004; tilt.y0 += (gy - tilt.y0) * .004; // slowly re-centres on however the phone is being held
  par.tx = clamp((gx - tilt.x0) / 16, -1, 1); par.ty = clamp((gy - tilt.y0) / 16, -1, 1);
  tilt.seen = performance.now();
}
if (!hasHover && !reduceMotion) addEventListener('deviceorientation', onTilt);
function updatePar(t) {
  const felt = touch.on || t - tilt.seen < 1000;
  if (reduceMotion) par.tx = par.ty = 0; // the scene stays still: no drift, tilt, drag or mouse
  else if (!hasHover && !felt) { par.tx = Math.sin(t * .00021) * .7; par.ty = Math.sin(t * .00016 + 1) * .45; }
  const k = st.cap && st.cap.active ? .3 : 1;
  par.x += (par.tx * k - par.x) * .06; par.y += (par.ty * k - par.y) * .06;
  par.d += ((felt ? .034 : .022) - par.d) * .06; // eased, so letting go doesn't make the layers jump
  const sh = MIN * par.d;
  for (const id in layers) { const Ly = layers[id]; Ly.ox = -par.x * Ly.d * sh; Ly.oy = -par.y * Ly.d * sh * .7; applyLayer(Ly); }
}
function L2S(Ly, x, y) { return [x - W * .04 + Ly.ox, y - H * .04 + Ly.oy]; }
const sx = f => W * .04 + f * W, sy = f => H * .04 + f * H;
function sizeCanvas(c, w, h, dpr = DPR) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); const x = c.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); return x; }

/* ================= audio ================= */
const A = { ctx: null, on: true, master: null, nextCrackle: 0 };
try { A.on = localStorage.getItem('wand-sound') !== '0'; } catch (_) { }
function audioInit() { if (A.ctx) return; try { A.ctx = new (window.AudioContext || window.webkitAudioContext)(); A.master = A.ctx.createGain(); A.master.gain.value = .4; A.master.connect(A.ctx.destination); } catch (e) { A.ctx = null; } }
function tone(f, dur, { type = 'sine', vol = .15, when = 0, att = .006, glide = 0 } = {}) {
  if (!A.on || !A.ctx) return; const c = A.ctx, t0 = c.currentTime + when;
  const o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.setValueAtTime(f, t0);
  if (glide) o.frequency.exponentialRampToValueAtTime(glide, t0 + dur);
  g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(vol, t0 + att); g.gain.exponentialRampToValueAtTime(.0001, t0 + dur);
  o.connect(g); g.connect(A.master); o.start(t0); o.stop(t0 + dur + .05);
}
function noise(dur, { vol = .2, when = 0, freq = 800, q = .7, type = 'bandpass' } = {}) {
  if (!A.on || !A.ctx) return; const c = A.ctx, t0 = c.currentTime + when;
  const b = c.createBuffer(1, Math.ceil(c.sampleRate * dur), c.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2);
  const s = c.createBufferSource(); s.buffer = b; const f = c.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
  const g = c.createGain(); g.gain.value = vol; s.connect(f); f.connect(g); g.connect(A.master); s.start(t0);
}
const SFX = {
  bell() { [[1318, .16], [1976, .07], [2637, .04]].forEach(([f, v]) => { tone(f, 1.9, { vol: v }); tone(f * 1.003, 1.4, { vol: v * .7, when: .16 }); }); },
  chime() { [784, 988, 1175, 1568].forEach((f, i) => tone(f, 1.1, { vol: .07, when: i * .07 })); },
  dim() { tone(392, .9, { type: 'triangle', vol: .06, glide: 196 }); noise(.5, { vol: .05, freq: 2400, q: .4 }); },
  thud() { tone(70, .6, { vol: .35, glide: 40 }); noise(.7, { vol: .35, freq: 500 }); for (let i = 0; i < 6; i++) noise(.15, { vol: .12, freq: 900 + Math.random() * 1500, when: .1 + i * .09 }); },
  clatter() { for (let i = 0; i < 4; i++) { tone(1400 + Math.random() * 900, .12, { type: 'triangle', vol: .06, when: i * .07 }); noise(.08, { vol: .1, freq: 3000, when: i * .07 }); } },
  whoosh() { noise(.7, { vol: .35, freq: 600, q: .3 }); tone(300, .6, { type: 'sawtooth', vol: .03, glide: 1600 }); },
  crack() { noise(.12, { vol: .45, freq: 3500, q: 1 }); noise(.4, { vol: .2, freq: 900, when: .06 }); tone(120, .3, { vol: .2, glide: 60 }); },
  blips() { for (let i = 0; i < 8; i++) tone(600 + Math.random() * 900, .12, { vol: .05, when: i * .12, glide: 1400 }); },
  flutter() { for (let i = 0; i < 10; i++) noise(.06, { vol: .05, freq: 1800, when: i * .07, q: 2 }); [1046, 1318, 1568].forEach((f, i) => tone(f, .8, { vol: .04, when: .2 + i * .1 })); },
  wind() { noise(1.6, { vol: .25, freq: 400, q: .2 }); noise(1.2, { vol: .12, freq: 1600, q: .3, when: .3 }); },
  puff() { noise(.6, { vol: .3, freq: 300, q: .4 }); tone(90, .5, { vol: .12, glide: 50 }); },
  low() { tone(110, 1.4, { type: 'triangle', vol: .12, glide: 55 }); },
  fizz() { for (let i = 0; i < 5; i++) noise(.05, { vol: .05, freq: 5000, q: 3, when: i * .08 }); tone(700, .5, { vol: .04, glide: 300 }); },
  reveal() { [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, 3.2, { vol: .07, when: i * .09, att: .2 })); for (let i = 0; i < 14; i++) tone(1800 + Math.random() * 2600, .5, { vol: .025, when: .3 + i * .11 }); },
  crackle() { noise(.04 + Math.random() * .05, { vol: .03 + Math.random() * .04, freq: 1200 + Math.random() * 3000, q: 1.5 }); }
};
const ICON_OFF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="m22 9-6 6M16 9l6 6"/></svg>';
const ICON_ON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>';
const sndBtn = $('#snd'); sndBtn.innerHTML = A.on ? ICON_ON : ICON_OFF;
sndBtn.addEventListener('click', e => {
  e.stopPropagation(); audioInit(); if (!A.ctx) return;
  A.on = !A.on; if (A.on && A.ctx.state === 'suspended') A.ctx.resume();
  try { localStorage.setItem('wand-sound', A.on ? '1' : '0'); } catch (_) { }
  sndBtn.innerHTML = A.on ? ICON_ON : ICON_OFF; sndBtn.setAttribute('aria-label', T(A.on ? 'sndOff' : 'sndOn'));
  if (A.on) SFX.chime();
});

/* ================= note ================= */
const note = $('#note'), noteIn = $('#noteIn');
// The parchment behind the note: torn edges, mottled paper and a roll on top. Seeded, so the tears stay put when the text changes the height.
function drawNoteBg() {
  const c = $('#noteBg'), MX = 24, MT = 28, MB = 28, w = noteIn.offsetWidth + MX * 2, h = noteIn.offsetHeight + MT + MB, d = Math.min(2, devicePixelRatio || 1);
  if (!noteIn.offsetWidth) return;
  c.width = w * d; c.height = h * d; const x = c.getContext('2d'); x.scale(d, d);
  const torn = (len, seed) => { const r = rng(seed), o = []; let s = 0; while (s < len) { s = Math.min(len, s + 5 + r() * 13); o.push([s, r() * 3]); if (r() < .1 && s < len - 6) { o.push([s + 1.5, 5 + r() * 4]); s += 3; o.push([s, r() * 2]); } } return o; };
  const L = MX, R = w - MX, T = MT, B = h - MB, rT = T - 13, rB = T + 13, rL = L - 7, rR = R + 7;
  const mottle = (a, n, seed) => { const r = rng(seed); for (let i = 0; i < n; i++) { const px = L - 8 + r() * (R - L + 16), py = a + r() * (B - a), rad = 18 + r() * 60, dark = r() < .65, al = .03 + r() * .06, g = x.createRadialGradient(px, py, 0, px, py, rad); g.addColorStop(0, dark ? `rgba(135,88,36,${al})` : `rgba(255,246,220,${al * 1.4})`); g.addColorStop(1, 'rgba(135,88,36,0)'); x.fillStyle = g; x.fillRect(px - rad, py - rad, rad * 2, rad * 2); } };
  // paper
  const paper = new Path2D(); paper.moveTo(L, T); paper.lineTo(R, T);
  for (const [s, o] of torn(B - T, 11)) paper.lineTo(R - o, T + s);
  for (const [s, o] of torn(R - L, 23)) paper.lineTo(R - s, B - o);
  for (const [s, o] of torn(B - T, 37)) paper.lineTo(L + o, B - s);
  paper.closePath();
  x.save(); x.shadowColor = 'rgba(0,0,0,.62)'; x.shadowBlur = 20 * d; x.shadowOffsetY = 9 * d; x.fillStyle = '#e6d2a4'; x.fill(paper); x.restore();
  x.save(); x.clip(paper);
  const base = x.createRadialGradient((L + R) * .45, T + 20, 10, (L + R) * .5, (T + B) * .5, Math.max(R - L, B - T) * .75); base.addColorStop(0, '#f4e7c6'); base.addColorStop(.6, '#e8d5a8'); base.addColorStop(1, '#d6bb85'); x.fillStyle = base; x.fillRect(L - 4, T, R - L + 8, B - T + 4);
  mottle(T, Math.round((R - L) * (B - T) / 2600) + 12, 53);
  const fr = rng(71); x.lineWidth = .7; for (let i = 0, n = (R - L) * (B - T) / 90; i < n; i++) { const px = L + fr() * (R - L), py = T + fr() * (B - T), an = fr() * 6.28, ln = 2 + fr() * 6; x.strokeStyle = fr() < .6 ? 'rgba(120,78,30,.07)' : 'rgba(255,248,226,.09)'; x.beginPath(); x.moveTo(px, py); x.lineTo(px + Math.cos(an) * ln, py + Math.sin(an) * ln); x.stroke(); }
  for (const [lw, al] of [[22, .07], [12, .1], [5, .16], [1.6, .32]]) { x.lineWidth = lw; x.strokeStyle = `rgba(112,68,22,${al})`; x.stroke(paper); }
  const under = x.createLinearGradient(0, rB - 1, 0, rB + 15); under.addColorStop(0, 'rgba(70,40,12,.42)'); under.addColorStop(1, 'rgba(70,40,12,0)'); x.fillStyle = under; x.fillRect(L - 4, rB - 1, R - L + 8, 16);
  x.restore();
  // roll
  const roll = new Path2D(), er = rng(89); roll.moveTo(rL + 2, rT);
  roll.quadraticCurveTo((rL + rR) / 2, rT - .8, rR - 2, rT);
  for (let y = rT + 2; y < rB; y += 3 + er() * 3) roll.lineTo(rR - er() * 2.6, y);
  roll.lineTo(rR - 2, rB); roll.quadraticCurveTo((rL + rR) / 2, rB + .8, rL + 2, rB);
  for (let y = rB - 2; y > rT; y -= 3 + er() * 3) roll.lineTo(rL + er() * 2.6, y);
  roll.closePath();
  x.save(); x.shadowColor = 'rgba(40,20,5,.5)'; x.shadowBlur = 7 * d; x.shadowOffsetY = 4 * d; x.fillStyle = '#c7a56c'; x.fill(roll); x.restore();
  x.save(); x.clip(roll);
  const cyl = x.createLinearGradient(0, rT, 0, rB); cyl.addColorStop(0, '#a98450'); cyl.addColorStop(.14, '#d9bf8d'); cyl.addColorStop(.34, '#f7ebcb'); cyl.addColorStop(.58, '#e3cc9b'); cyl.addColorStop(.84, '#b08c55'); cyl.addColorStop(1, '#7f5e30'); x.fillStyle = cyl; x.fillRect(rL, rT - 1, rR - rL, rB - rT + 2);
  const sr = rng(97); for (let i = 0, n = (rR - rL) / 3; i < n; i++) { const px = rL + sr() * (rR - rL), py = rT + sr() * (rB - rT), ln = 6 + sr() * 26; x.lineWidth = .6 + sr() * .7; x.strokeStyle = sr() < .6 ? 'rgba(105,68,26,.1)' : 'rgba(255,250,230,.14)'; x.beginPath(); x.moveTo(px, py); x.lineTo(px + ln, py + (sr() - .5) * 1.2); x.stroke(); }
  for (const [a, b] of [[rL, rL + 17], [rR, rR - 17]]) { const g = x.createLinearGradient(a, 0, b, 0); g.addColorStop(0, 'rgba(92,58,20,.5)'); g.addColorStop(1, 'rgba(92,58,20,0)'); x.fillStyle = g; x.fillRect(Math.min(a, b), rT - 1, 17, rB - rT + 2); }
  x.restore();
  for (const [ex, dir] of [[rL + 7, 1], [rR - 7, -1]]) { x.strokeStyle = 'rgba(88,54,18,.42)'; x.lineWidth = 1; x.beginPath(); x.moveTo(ex, rT + 1.5); x.quadraticCurveTo(ex + dir * 2.6, T, ex, rB - 1.5); x.stroke(); }
}
if (window.ResizeObserver) new ResizeObserver(drawNoteBg).observe(noteIn); else addEventListener('resize', drawNoteBg);
drawNoteBg();
let noteTimer = null;
function renderNote() {
  const f = st.noteFn; if (!f) return; const n = f();
  $('#nKicker').textContent = n.kicker || ''; $('#nSpec').textContent = n.spec || ''; $('#nHand').textContent = n.hand || ''; $('#nInstr').innerHTML = n.instr || '';
  const bx = $('#nBtns'); bx.innerHTML = '';
  const btns = (n.btns || []).slice(); if (st.camHelp && st.input === 'cam') btns.push({ label: T('bInstead'), ghost: true, fn: () => toPointer() });
  bx.className = 'nbtns' + (btns.length > 1 ? ' eq' : '') + (n.cls ? ' ' + n.cls : '');
  btns.forEach(b => { const e = document.createElement('button'); e.className = 'btn' + (b.ghost ? ' ghost' : '') + (b.cls ? ' ' + b.cls : ''); if (b.html) e.innerHTML = b.html; else e.textContent = b.label; e.onclick = ev => { ev.stopPropagation(); b.fn(); }; bx.appendChild(e); });
}
function setNote(fn, instant = false) {
  st.noteFn = fn; $('#nStatus').textContent = ''; note.classList.add('show'); clearTimeout(noteTimer);
  if (instant) { renderNote(); noteIn.classList.remove('fade'); } else { noteIn.classList.add('fade'); noteTimer = setTimeout(() => { renderNote(); noteIn.classList.remove('fade'); }, 330); }
}
function setStatus(s) { $('#nStatus').textContent = s || ''; }
function nudgeNote() { noteIn.classList.remove('nudge'); void noteIn.offsetWidth; noteIn.classList.add('nudge'); }
function noteTop() { return note.classList.contains('show') ? note.getBoundingClientRect().top : H; }

/* ================= entry screens ================= */
function svgEl(tag, attrs, parent) { const e = document.createElementNS(SVGNS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
// snow
const snow = { back: [], front: [], cb: $('#snowBack'), cf: $('#snowFront'), xb: null, xf: null };
function initSnow() {
  snow.xb = sizeCanvas(snow.cb, W, H, 1); snow.xf = sizeCanvas(snow.cf, W, H, 1);
  const n = Math.round(W * H / 9000);
  snow.back = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, r: .6 + Math.random() * 1.3, v: .25 + Math.random() * .5, p: Math.random() * 6 }));
  snow.front = Array.from({ length: Math.round(n / 3.5) }, () => ({ x: Math.random() * W, y: Math.random() * H, r: 1.8 + Math.random() * 2.6, v: .7 + Math.random() * 1, p: Math.random() * 6 }));
}
function drawSnow(t, alpha = 1) {
  for (const [arr, x, c] of [[snow.back, snow.xb, '#dfe7ff'], [snow.front, snow.xf, '#ffffff']]) {
    x.clearRect(0, 0, W, H); x.fillStyle = c; x.globalAlpha = alpha * (arr === snow.front ? .85 : .7);
    for (const f of arr) {
      f.y += f.v; f.x += Math.sin(t * .0008 + f.p) * .35 - par.x * .05;
      if (f.y > H + 6) { f.y = -6; f.x = Math.random() * W; } if (f.x < -6) f.x = W + 6; if (f.x > W + 6) f.x = -6;
      x.beginPath(); x.arc(f.x, f.y, f.r, 0, 6.283); x.fill();
    }
  }
}
// A drag over a scene moves its depth, like the mouse on desktop, and eases back to the drift on release.
function dragDepth(el) {
  el.addEventListener('pointerdown', e => { if (e.pointerType === 'touch') Object.assign(touch, { on: true, moved: false, x: e.clientX, y: e.clientY }); });
  el.addEventListener('pointermove', e => {
    if (!touch.on) return;
    if (Math.hypot(e.clientX - touch.x, e.clientY - touch.y) > 10) touch.moved = true;
    if (!reduceMotion) { par.tx = clamp(e.clientX / W * 2 - 1, -1, 1); par.ty = clamp(e.clientY / H * 2 - 1, -1, 1); }
  });
  const end = () => { touch.on = false; }; el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
}

/* ================= result card ================= */
// Each page's script declares makeCard() and cardFileName().
// When the card can't fit and scrolls, the top buttons step aside instead of covering it.
$('#result').addEventListener('scroll', e => { $('.topbar').classList.toggle('away', e.target.scrollTop > 8); }, { passive: true });
const siteUrl = () => location.origin + location.pathname;
function wrapText(c, text, x, y, maxW, lh) { const words = text.split(' '); let line = '', yy = y; for (const w of words) { const t = line ? line + ' ' + w : w; if (c.measureText(t).width > maxW && line) { c.fillText(line, x, yy); line = w; yy += lh; } else line = t; } if (line) c.fillText(line, x, yy); return yy + lh; }
const serif = "'Cormorant Garamond', Georgia, serif";
function cardFrame(x, CW, CH) {
  const g = x.createRadialGradient(CW / 2, 300, 50, CW / 2, 600, 1100); g.addColorStop(0, '#2e1b10'); g.addColorStop(1, '#0b0604'); x.fillStyle = g; x.fillRect(0, 0, CW, CH);
  x.strokeStyle = 'rgba(217,180,106,.75)'; x.lineWidth = 3; x.strokeRect(40, 40, CW - 80, CH - 80); x.strokeStyle = 'rgba(217,180,106,.3)'; x.lineWidth = 1.5; x.strokeRect(56, 56, CW - 112, CH - 112);
}
// the default Vercel address is long, so the font shrinks to keep it inside the frame
function cardHost(x, CW) { x.fillStyle = '#e8c27a'; let hostPx = 38; do { x.font = `600 ${hostPx}px ${serif}`; } while (x.measureText(location.host).width > 900 && --hostPx > 18); x.fillText(location.host, CW / 2, 1230); }
// Made ahead of the click: browsers only allow the share sheet right after a tap, with no long wait before it.
let cardBlob = null;
function refreshCard() { cardBlob = null; const job = makeCard().then(b => { if (refreshCard.job === job) cardBlob = b; return b; }); refreshCard.job = job; return job; }
const cardFile = async () => new File([cardBlob || await refreshCard.job], cardFileName(), { type: 'image/png' });
function canShareFiles() {
  try { return !!(navigator.share && navigator.canShare && navigator.canShare({ files: [new File([new Blob(['x'], { type: 'image/png' })], 'x.png', { type: 'image/png' })] })); } catch (_) { return false; }
}
function setShareMode(sheet) { $('#bShare').hidden = !sheet; $('#bDown').hidden = sheet; }
$('#bShare').addEventListener('click', async () => {
  try { await navigator.share({ files: [await cardFile()], text: T('invite'), url: siteUrl() }); }
  catch (e) { if (e && e.name !== 'AbortError') setShareMode(false); } // a cancelled sheet stays silent; anything else offers the download
});
$('#bDown').addEventListener('click', async () => {
  const file = await cardFile(), url = URL.createObjectURL(file);
  if (IN_APP) { $('#rSavedImg').src = url; $('#rSaved').hidden = false; return; } // these webviews usually block downloads, but pressing on an image works
  const a = document.createElement('a'); a.href = url; a.download = file.name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 10000);
});

/* ================= logging ================= */
// Anonymous results for later recalibration, from the live site only. The key can only insert. Nothing waits for this and a failure stays silent.
const LOG = { host: 'olivanders-wand-shop.vercel.app', url: 'https://qozvbqhdavsazopdwrys.supabase.co/rest/v1/', key: 'sb_publishable__F3xGYcGMqsHdp-lHQtMbA_YgLToaBS' };
function deviceType() { return !matchMedia('(pointer:coarse)').matches ? 'desktop' : Math.min(screen.width, screen.height) < 600 ? 'phone' : 'tablet'; }
function postRow(table, row) {
  if (location.hostname !== LOG.host) return;
  fetch(LOG.url + table, { method: 'POST', keepalive: true, credentials: 'omit', headers: { apikey: LOG.key, 'Content-Type': 'application/json', Prefer: 'return=minimal' }, body: JSON.stringify(row) }).catch(() => { });
}
