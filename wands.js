'use strict';
// The wands' looks, shared by the shop and the Sorting card: one shape spec, the 2D drawing and the 3D view. Runs after logic.js and core.js.

/* ================= wand drawing ================= */
// One shape spec per wand; every appearance (box, hand, result card, saved card, 3D) renders from it.
// s runs along the wand: 0 = butt of the handle, 1 = tip. All sizes are fractions of the wand's length.
//   r     radius control points [s, r]           bend  centreline offset [s, dy]
//   beads raised rings [s, half-width, height, colour?]
//   rough knobbly relief [from, to, height, frequency]
//   wood  colour zones [s, [light, mid, dark]]
//   art   carving and inlay painted onto the surface: spiral, vine, flutes, comb, bark, studs, knots
const IVORY = ['#f6eedd', '#d8cbb0', '#9a8c70'], SILVER = '#d7dbe0', BRASS = '#d9b46a';
const SHAPES = {
  // official design notes: a handle like a tree trunk, organic and whittled
  harry: { r: [[0, .03], [.02, .05], [.08, .056], [.16, .05], [.25, .053], [.31, .036], [.36, .024], [1, .009]], rough: [0, .33, .005, 62], wood: [[0, ['#6e4a2c', '#42281a', '#1e120a']], [.33, ['#6e4a2c', '#42281a', '#1e120a']], [.37, ['#b57b47', '#7c4d29', '#3a2110']]], art: [{ t: 'bark', from: .01, to: .34 }, { t: 'knots', at: [[.1, .4, .012], [.22, .62, .01]] }] },
  // vine carving winding up the handle
  hermione: { r: [[0, .022], [.02, .036], [.14, .04], [.28, .036], [.33, .025], [1, .009]], bend: [[0, 0], [.35, .004], [.6, -.006], [.82, .004], [1, 0]], beads: [[.3, .009, .006]], wood: [[0, ['#c99a68', '#8f6238', '#4a2e16']], [1, ['#c99a68', '#8f6238', '#4a2e16']]], art: [{ t: 'vine', from: .025, to: .295, turns: 4.5, col: '#3e2410' }] },
  // the long one: plain willow, one band and a round pommel
  ron: { r: [[0, .018], [.012, .032], [.035, .034], [.05, .024], [.1, .029], [.27, .029], [.32, .021], [1, .008]], beads: [[.05, .006, .005], [.29, .007, .005]], wood: [[0, ['#dec59a', '#a98a60', '#5e462a']], [1, ['#dec59a', '#a98a60', '#5e462a']]], art: [{ t: 'flutes', from: .07, to: .27, n: 6, col: 'rgba(70,45,20,.5)' }] },
  // knobbed clusters along the whole length
  dumbledore: { r: [[0, .012], [.03, .036], [.1, .04], [.3, .03], [1, .012]], beads: [[.035, .012, .018], [.085, .013, .018], [.15, .012, .017], [.22, .012, .016], [.3, .012, .016], [.385, .012, .015], [.47, .012, .014], [.56, .012, .013], [.65, .012, .012], [.74, .012, .01], [.83, .011, .008], [.91, .01, .006]], rough: [0, 1, .003, 44], wood: [[0, ['#a79c88', '#6c6352', '#322d25']], [1, ['#a79c88', '#6c6352', '#322d25']]], art: [{ t: 'bark', from: 0, to: 1, soft: true }] },
  // dark and ornate: fine rings, tall flared handle
  mcgonagall: { r: [[0, .024], [.015, .042], [.05, .03], [.13, .027], [.22, .04], [.27, .026], [.33, .019], [1, .007]], beads: [[.03, .006, .007], [.07, .005, .007, BRASS], [.1, .004, .005], [.2, .005, .006], [.27, .006, .007, BRASS]], wood: [[0, ['#5c4436', '#2c1e15', '#0e0805']], [1, ['#5c4436', '#2c1e15', '#0e0805']]], art: [{ t: 'flutes', from: .11, to: .19, n: 8, col: 'rgba(240,210,150,.35)' }] },
  // dark shaft, pale banded handle ending in a carved knob
  sirius: { r: [[0, .03], [.02, .056], [.05, .05], [.075, .027], [.15, .036], [.27, .034], [.33, .02], [1, .009]], beads: [[.09, .006, .006], [.13, .004, .004], [.2, .004, .004], [.28, .007, .006]], wood: [[0, IVORY], [.3, ['#cbb99a', '#94826a', '#544634']], [.34, ['#5e4a3c', '#2e221c', '#100a08']]], art: [{ t: 'spiral', from: .09, to: .28, turns: 4, col: 'rgba(40,24,14,.7)', w: 7 }, { t: 'knots', at: [[.03, .35, .012], [.03, .65, .012]] }] },
  // the twins: warm wood, Fred's with two wide bands
  fred: { r: [[0, .02], [.015, .034], [.27, .031], [.32, .021], [1, .008]], beads: [[.05, .012, .006, '#3e220e'], [.1, .012, .006, '#3e220e'], [.28, .007, .005]], wood: [[0, ['#d0965a', '#945d2e', '#442510']], [1, ['#d0965a', '#945d2e', '#442510']]], art: [] },
  // ...and George's with a spiral wrap between single bands
  george: { r: [[0, .02], [.015, .034], [.27, .031], [.32, .021], [1, .008]], beads: [[.04, .007, .006, '#3a200c'], [.28, .007, .006, '#3a200c']], wood: [[0, ['#c08a50', '#855228', '#3e220e']], [1, ['#c08a50', '#855228', '#3e220e']]], art: [{ t: 'spiral', from: .05, to: .27, turns: 3, col: 'rgba(40,20,6,.75)', w: 9 }] },
  // slim and dark with a tight run of rings
  ginny: { r: [[0, .018], [.015, .03], [.25, .027], [.31, .018], [1, .007]], beads: [.05, .08, .11, .14, .17, .2, .23].map(s => [s, .0065, .006]), wood: [[0, ['#6e4a30', '#3d2717', '#160d07']], [.28, ['#6e4a30', '#3d2717', '#160d07']], [.34, ['#7c5436', '#4a2f1b', '#1c1009']]], art: [] },
  // cherry with a diagonal twist and a swollen grip
  neville: { r: [[0, .022], [.02, .038], [.1, .045], [.22, .038], [.3, .026], [1, .009]], beads: [[.27, .007, .006]], wood: [[0, ['#c4644a', '#7c2f1e', '#3a120a']], [1, ['#c4644a', '#7c2f1e', '#3a120a']]], art: [{ t: 'spiral', from: .02, to: .26, turns: 2.5, col: 'rgba(30,8,2,.8)', w: 13 }] },
  // pale, wavering, with a leaf-like flare at the base
  luna: { r: [[0, .012], [.04, .05], [.08, .03], [.13, .036], [.2, .03], [.3, .024], [1, .009]], bend: [[0, -.012], [.2, .006], [.45, -.012], [.7, .011], [.88, -.005], [1, 0]], wood: [[0, ['#efe3cb', '#bbaa8a', '#6c5e46']], [1, ['#efe3cb', '#bbaa8a', '#6c5e46']]], art: [{ t: 'flutes', from: .005, to: .1, n: 7, col: 'rgba(90,70,40,.65)' }, { t: 'spiral', from: .11, to: .3, turns: 2, col: 'rgba(90,70,40,.55)', w: 5 }] },
  // black and straight, silver bands around a rounded pommel
  draco: { r: [[0, .018], [.02, .04], [.05, .038], [.08, .024], [.26, .028], [.31, .018], [1, .008]], beads: [[.08, .008, .007, SILVER], [.275, .006, .006, SILVER]], wood: [[0, ['#4e4640', '#1e1916', '#060403']], [1, ['#4e4640', '#1e1916', '#060403']]], art: [{ t: 'flutes', from: .1, to: .26, n: 5, col: 'rgba(210,215,225,.4)' }] },
  // official design notes: slim and spare, no embellishments
  snape: { r: [[0, .014], [.012, .024], [.26, .021], [.3, .016], [1, .006]], wood: [[0, ['#403a36', '#1a1613', '#050403']], [1, ['#403a36', '#1a1613', '#050403']]], art: [] },
  // crooked and worn, with a knot and a cord wrap
  lupin: { r: [[0, .024], [.03, .042], [.12, .036], [.17, .044], [.27, .034], [.33, .022], [1, .009]], bend: [[0, .014], [.2, -.008], [.5, .007], [.78, -.006], [1, 0]], rough: [0, .3, .003, 22], wood: [[0, ['#b98a5e', '#7a5232', '#37230f']], [1, ['#b98a5e', '#7a5232', '#37230f']]], art: [{ t: 'spiral', from: .05, to: .12, turns: 4, col: 'rgba(40,22,8,.8)', w: 6 }, { t: 'knots', at: [[.17, .45, .016], [.5, .55, .007]] }] },
  // official design notes: a curve in the wood, like a bird of prey's talon
  bellatrix: { r: [[0, .028], [.03, .05], [.14, .042], [.3, .027], [.65, .017], [1, .004]], bend: [[0, -.02], [.25, .036], [.55, .062], [.8, .05], [1, 0]], beads: [[.06, .007, .005]], rough: [.1, .35, .002, 46], wood: [[0, ['#5a4a42', '#2a1f1a', '#0b0705']], [1, ['#5a4a42', '#2a1f1a', '#0b0705']]], art: [{ t: 'bark', from: .1, to: .38, soft: true }] },
  // official design notes: carved like a bone, with a honeycomb section, a knuckle-like joint and a claw at the end
  voldemort: { r: [[0, .004], [.03, .018], [.06, .03], [.075, .042], [.1, .034], [.2, .036], [.26, .05], [.3, .028], [.55, .019], [1, .006]], bend: [[0, .058], [.03, .034], [.065, .008], [.1, 0], [1, 0]], beads: [[.078, .012, .012], [.26, .016, .012], [.32, .006, .004]], wood: [[0, IVORY], [1, IVORY]], art: [{ t: 'comb', from: .1, to: .24 }, { t: 'bark', from: .3, to: 1, soft: true }] }
};
WANDS.forEach(w => { w.shape = SHAPES[w.id]; });
const smooth = t => t * t * (3 - 2 * t);
function ctrl(pts, s) {
  if (!pts) return 0; if (s <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) if (s <= pts[i][0]) { const a = pts[i - 1], b = pts[i]; return lerp(a[1], b[1], smooth((s - a[0]) / (b[0] - a[0]))); }
  return pts[pts.length - 1][1];
}
function gauss(s, c, w, a) { return a * Math.exp(-(((s - c) / w) ** 2)); }
function bumpNoise(s, f) { return Math.sin(s * f) * .5 + Math.sin(s * f * 1.73 + 1.3) * .3 + Math.sin(s * f * 2.91 + 4.1) * .2; }
function wandR(w, s) {
  const d = w.shape; let r = ctrl(d.r, s);
  if (d.beads) for (const b of d.beads) r += gauss(s, b[0], b[1], b[2]);
  if (d.rough && s >= d.rough[0] && s <= d.rough[1]) { const edge = Math.min(1, Math.min(s - d.rough[0], d.rough[1] - s) / .025); r += bumpNoise(s, d.rough[3]) * d.rough[2] * edge; }
  if (s < .012) r *= Math.sqrt(s / .012) * .75 + .25; if (s > .985) r *= .35 + .65 * (1 - s) / .015;
  return Math.max(.001, r);
}
function wandY(w, s) { return ctrl(w.shape.bend, s); }
// Colour and carving painted onto the unrolled surface: x = s along the wand, y = the way round it (the visible half is the middle).
const TEX_W = 1024, TEX_H = 256;
function wandTexture(w) {
  if (w.tex) return w.tex;
  const cv = document.createElement('canvas'); cv.width = TEX_W; cv.height = TEX_H; const x = cv.getContext('2d'), d = w.shape, R = rng(w.id.length * 97 + w.id.charCodeAt(0));
  const g = x.createLinearGradient(0, 0, TEX_W, 0); for (const [s, c] of d.wood) g.addColorStop(s, c[1]); x.fillStyle = g; x.fillRect(0, 0, TEX_W, TEX_H);
  // lengthwise grain
  for (let i = 0; i < 90; i++) { const y = R() * TEX_H, a = .05 + R() * .14; x.strokeStyle = R() < .6 ? `rgba(0,0,0,${a})` : `rgba(255,235,200,${a * .7})`; x.lineWidth = .6 + R() * 1.6; x.beginPath(); const x0 = R() * TEX_W * .8, x1 = x0 + 60 + R() * 420; x.moveTo(x0, y); x.bezierCurveTo(lerp(x0, x1, .3), y + (R() - .5) * 8, lerp(x0, x1, .7), y + (R() - .5) * 8, x1, y + (R() - .5) * 4); x.stroke(); }
  const X = s => s * TEX_W;
  for (const a of d.art || []) {
    if (a.t === 'spiral') {
      const steps = 120; x.strokeStyle = a.col; x.lineWidth = a.w || 8; x.lineCap = 'round';
      for (let off = -1; off <= 1; off++) { x.beginPath(); for (let i = 0; i <= steps; i++) { const u = i / steps, px = X(lerp(a.from, a.to, u)), py = (u * a.turns + off * 0) * TEX_H; const wy = ((py % TEX_H) + TEX_H) % TEX_H; if (i && wy < 6) x.moveTo(px, wy); else x.lineTo(px, wy); } x.stroke(); }
    } else if (a.t === 'vine') {
      x.strokeStyle = a.col; x.fillStyle = a.col; x.lineWidth = 9; x.lineCap = 'round';
      const yAt = u => (u * a.turns * TEX_H + TEX_H * .5) % TEX_H; let prev = null;
      for (let i = 0; i <= 200; i++) { const u = i / 200, px = X(lerp(a.from, a.to, u)), py = yAt(u); if (prev && Math.abs(py - prev[1]) < TEX_H / 2) { x.beginPath(); x.moveTo(prev[0], prev[1]); x.lineTo(px, py); x.stroke(); } prev = [px, py]; }
      for (let i = 1; i < 26; i++) { const u = i / 26, px = X(lerp(a.from, a.to, u)), py = yAt(u), side = i % 2 ? 1 : -1; x.save(); x.translate(px, py); x.rotate(side * .9); x.beginPath(); x.ellipse(15, 0, 15, 8, 0, 0, 6.283); x.fill(); x.restore(); }
    } else if (a.t === 'flutes') {
      x.strokeStyle = a.col; x.lineWidth = 3.5; for (let i = 0; i < a.n * 2; i++) { const y = (i + .5) / (a.n * 2) * TEX_H; x.beginPath(); x.moveTo(X(a.from), y); x.lineTo(X(a.to), y); x.stroke(); }
    } else if (a.t === 'comb') {
      x.fillStyle = 'rgba(70,58,38,.7)'; const step = 11; for (let i = 0; X(a.from) + i * step < X(a.to); i++) for (let j = -1; j * 13 < TEX_H + 13; j++) { x.beginPath(); x.arc(X(a.from) + i * step, j * 13 + (i % 2 ? 6.5 : 0), 3.6, 0, 6.283); x.fill(); }
    } else if (a.t === 'bark') {
      const n = Math.round((a.to - a.from) * (a.soft ? 90 : 220)); for (let i = 0; i < n; i++) { const px = X(lerp(a.from, a.to, R())), py = R() * TEX_H, len = 10 + R() * 34; x.strokeStyle = `rgba(0,0,0,${a.soft ? .08 + R() * .16 : .2 + R() * .35})`; x.lineWidth = .8 + R() * (a.soft ? 1.2 : 2.6); x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(px + len / 2, py + (R() - .5) * 12, px + len, py + (R() - .5) * 8); x.stroke(); }
    } else if (a.t === 'knots') {
      for (const [s, v, size] of a.at) { const px = X(s), py = v * TEX_H, rx = size * TEX_W, ry = rx * .55; for (let k = 3; k > 0; k--) { x.strokeStyle = 'rgba(15,6,2,.6)'; x.lineWidth = 2.5; x.beginPath(); x.ellipse(px, py, rx * k / 3, ry * k / 3, 0, 0, 6.283); x.stroke(); } x.fillStyle = 'rgba(15,6,2,.55)'; x.beginPath(); x.ellipse(px, py, rx * .3, ry * .3, 0, 0, 6.283); x.fill(); }
    }
  }
  // inlaid colour on the rings goes on last so it stays clean
  for (const b of d.beads || []) if (b[3]) { x.fillStyle = b[3]; const hw = b[1] * TEX_W * .95; x.fillRect(X(b[0]) - hw, 0, hw * 2, TEX_H); }
  w.tex = cv; return cv;
}
// Cylinder shading across the wand, as [position -1..1, colour], top edge to bottom edge. Lit from above by the candles.
const SHADE = [[-1, '0,0,0,.5'], [-.8, '0,0,0,.08'], [-.46, '255,240,215,.38'], [-.16, '255,240,215,.04'], [.5, '0,0,0,.34'], [1, '0,0,0,.72']];
function shadeAt(v) { let i = 1; while (i < SHADE.length - 1 && v > SHADE[i][0]) i++; const a = SHADE[i - 1], b = SHADE[i], t = (v - a[0]) / (b[0] - a[0]), ca = a[1].split(',').map(Number), cb = b[1].split(',').map(Number); return `rgba(${ca.map((q, n) => n < 3 ? Math.round(lerp(q, cb[n], t)) : +lerp(q, cb[n], t).toFixed(3)).join(',')})`; }
// Sprites are rendered at a few fixed sizes, then rotated and scaled when drawn.
const SPRITE_SIZES = [320, 640, 1280];
function wandSprite(w, px) {
  w.sprites = w.sprites || {};
  const size = SPRITE_SIZES.find(z => z >= px) || SPRITE_SIZES[SPRITE_SIZES.length - 1]; if (w.sprites[size]) return w.sprites[size];
  const tex = wandTexture(w), N = Math.round(size / 1.5), pad = Math.ceil(size * .03); let maxY = 0;
  for (let i = 0; i <= N; i++) { const s = i / N; maxY = Math.max(maxY, Math.abs(wandY(w, s)) + wandR(w, s) * 1.15); }
  const hh = Math.ceil(maxY * size) + pad, cv = document.createElement('canvas'); cv.width = size + pad * 2; cv.height = hh * 2; const c = cv.getContext('2d');
  const at = s => [pad + s * size, hh + wandY(w, s) * size];
  // silhouette first, so the slices below have a clean base and no gaps on tight bends
  const edge = (s, side) => { // side -1..1 across the wand, on the normal to the centreline
    const [x0, y0] = at(s), [x1, y1] = at(Math.min(1, s + 1 / N)), a = Math.atan2(y1 - y0, x1 - x0), r = wandR(w, s) * size * side; return [x0 - Math.sin(a) * r, y0 + Math.cos(a) * r]; };
  c.beginPath(); for (let i = 0; i <= N; i++) c.lineTo(...edge(i / N, 1)); for (let i = N; i >= 0; i--) c.lineTo(...edge(i / N, -1));
  c.closePath(); c.fillStyle = w.shape.wood[0][1][2]; c.fill();
  for (let i = 0; i < N; i++) {
    const s0 = i / N, s1 = (i + 1) / N, [x0, y0] = at(s0), [x1, y1] = at(s1), len = Math.hypot(x1 - x0, y1 - y0), a = Math.atan2(y1 - y0, x1 - x0), sm = (s0 + s1) / 2, r = wandR(w, sm) * size;
    c.save(); c.translate(x0, y0); c.rotate(a);
    c.drawImage(tex, s0 * TEX_W, TEX_H * .25, Math.max(1, (s1 - s0) * TEX_W), TEX_H * .5, 0, -r, len + .8, r * 2);
    // a surface tilted towards the handle catches the candlelight, one tilted towards the tip falls into shade: this is what makes rings and knots read
    const slope = (wandR(w, s1 + .004) - wandR(w, s0 - .004)) / (s1 - s0 + .008), k = sm > .96 ? 0 : clamp(slope * 1.7, -1, 1);
    if (Math.abs(k) > .04) { c.fillStyle = k > 0 ? `rgba(0,0,0,${k * .42})` : `rgba(255,236,200,${-k * .3})`; c.fillRect(0, -r, len, r * 2); }
    c.restore();
  }
  // shading runs lengthwise in ribbons, so it leaves no seams across the wand
  const bands = 16; for (let b = 0; b < bands; b++) {
    const v0 = -1 + 2 * b / bands, v1 = -1 + 2 * (b + 1) / bands;
    c.beginPath(); for (let i = 0; i <= N; i++) c.lineTo(...edge(i / N, v0)); for (let i = N; i >= 0; i--) c.lineTo(...edge(i / N, v1)); c.closePath();
    c.fillStyle = shadeAt((v0 + v1) / 2); c.fill();
  }
  w.sprites[size] = { cv, size, pad, hh }; return w.sprites[size];
}
function drawWand(c, cx, cy, L, ang, w, glow = 0) {
  const sp = wandSprite(w, L * DPR * 1.2), k = L / sp.size;
  c.save(); c.translate(cx, cy); c.rotate(ang);
  if (glow) { c.shadowColor = `rgba(255,200,110,${glow})`; c.shadowBlur = 30; }
  c.imageSmoothingQuality = 'high';
  c.drawImage(sp.cv, -sp.pad * k - L / 2, -sp.hh * k, sp.cv.width * k, sp.cv.height * k);
  c.restore();
}

/* ================= 3D view of the chosen wand ================= */
// three.js loads only here, on the result screen. The 2D drawing stays underneath until the model is ready, and for good if WebGL or the CDN fails.
const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js';
const v3 = { gl: null, three: null, scene: null, cam: null, yawG: null, rollG: null, mesh: null, wand: null, run: false, seen: true, frames: 0, yaw: -.16, roll: .2, drag: null, spin: 0, raf: 0, last: 0 };
function wandGeometry(THREE, w) {
  // same radius and centreline as the 2D drawing; v runs round the wand as the texture expects: top .25, front .5, bottom .75
  const N = 220, M = 18, pos = [], uv = [], idx = [];
  for (let i = 0; i <= N; i++) {
    const s = i / N, a = wandY(w, Math.max(0, s - .003)), b = wandY(w, Math.min(1, s + .003)), dx = (s < .003 || s > .997 ? .003 : .006), ty = -(b - a), len = Math.hypot(dx, ty);
    const nx = -ty / len, ny = dx / len, cx = s - .5, cy = -wandY(w, s), r = i === 0 || i === N ? 0 : wandR(w, s);
    for (let j = 0; j <= M; j++) { const f = j / M * 2 * Math.PI; pos.push(cx + nx * r * Math.cos(f), cy + ny * r * Math.cos(f), r * Math.sin(f)); uv.push(s, .25 + j / M); }
  }
  for (let i = 0; i < N; i++) for (let j = 0; j < M; j++) { const a = i * (M + 1) + j, b = a + M + 1; idx.push(a, a + 1, b, b, a + 1, b + 1); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals();
  const n = g.attributes.normal; for (let i = 0; i <= N; i++) { const a = i * (M + 1), b = a + M; const x = n.getX(a) + n.getX(b), y = n.getY(a) + n.getY(b), z = n.getZ(a) + n.getZ(b), l = Math.hypot(x, y, z) || 1; n.setXYZ(a, x / l, y / l, z / l); n.setXYZ(b, x / l, y / l, z / l); }
  return g;
}
async function show3D(w) {
  v3.wand = w; const stage = $('#rStage'), cv = $('#rWand3d');
  try {
    if (!v3.three) v3.three = await withTimeout(import(THREE_URL), 15000);
    if (v3.wand !== w || $('#result').hidden) return; const THREE = v3.three;
    if (!v3.gl) {
      v3.gl = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: true }); v3.gl.setPixelRatio(Math.min(2, DPR));
      v3.scene = new THREE.Scene(); v3.cam = new THREE.PerspectiveCamera(18, 1, .1, 20);
      v3.yawG = new THREE.Group(); v3.rollG = new THREE.Group(); v3.yawG.add(v3.rollG); v3.scene.add(v3.yawG);
      // candlelight: warm from above, a soft fill, an amber rim from behind
      const key = new THREE.DirectionalLight(0xffe6c4, 3.6); key.position.set(-.6, 1.4, 1.6); const rim = new THREE.DirectionalLight(0xff9a50, 1.6); rim.position.set(.8, -.3, -1.4);
      v3.scene.add(key, rim, new THREE.HemisphereLight(0xfff4e4, 0x3a2412, 1.9));
      new IntersectionObserver(es => { v3.seen = es[0].isIntersecting; wake3D(); }).observe(cv);
      document.addEventListener('visibilitychange', wake3D);
      cv.addEventListener('webglcontextlost', () => { v3.run = false; stage.classList.remove('is3d'); });
      cv.addEventListener('pointerdown', e => { v3.drag = { x: e.clientX, y: e.clientY }; v3.yaw += spinAngle(); v3.spin = 0; wake3D(); try { cv.setPointerCapture(e.pointerId); } catch (_) { } });
      cv.addEventListener('pointermove', e => { if (!v3.drag) return; v3.yaw += (e.clientX - v3.drag.x) * .012; v3.roll += (e.clientY - v3.drag.y) * .012; v3.drag = { x: e.clientX, y: e.clientY }; wake3D(); });
      const up = () => { v3.drag = null; }; cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
    }
    if (v3.mesh) { v3.rollG.remove(v3.mesh); v3.mesh.geometry.dispose(); v3.mesh.material.map.dispose(); v3.mesh.material.dispose(); }
    const tex = new THREE.CanvasTexture(wandTexture(w)); tex.colorSpace = THREE.SRGBColorSpace; tex.wrapT = THREE.RepeatWrapping; tex.flipY = false; tex.anisotropy = 4;
    v3.mesh = new THREE.Mesh(wandGeometry(THREE, w), new THREE.MeshStandardMaterial({ map: tex, roughness: .62, metalness: .04 }));
    const k = .8 + .2 * (w.lenN - 9.5) / 5.5; v3.mesh.scale.setScalar(k); v3.rollG.add(v3.mesh);
    const cw = cv.clientWidth, chh = cv.clientHeight; v3.gl.setSize(cw, chh, false); v3.cam.aspect = cw / chh; v3.cam.position.z = (1.08 / v3.cam.aspect / 2) / Math.tan(9 * Math.PI / 180); v3.cam.updateProjectionMatrix();
    v3.yaw = -.16; v3.roll = .2; v3.run = true; v3.spin = reduceMotion ? 0 : 1e-6; v3.yawG.rotation.y = v3.yaw; v3.rollG.rotation.x = v3.roll; v3.gl.render(v3.scene, v3.cam); stage.classList.add('is3d'); wake3D();
  } catch (e) { v3.run = false; stage.classList.remove('is3d'); } // the 2D drawing stays
}
function hide3D() { v3.wand = null; v3.run = false; $('#rStage').classList.remove('is3d'); }
function wake3D() { if (v3.run && v3.seen && !document.hidden && !v3.raf) { v3.last = performance.now(); v3.raf = requestAnimationFrame(tick3D); } }
const SPIN_MS = 3600, spinAngle = () => v3.spin ? easeIO(v3.spin / SPIN_MS) * 2 * Math.PI : 0;
function tick3D(t) {
  v3.raf = 0; if (!v3.run || !v3.seen || document.hidden) return; // stops when offscreen or hidden; wake3D restarts it
  const dt = Math.min(50, t - v3.last); v3.last = t;
  if (v3.spin) { v3.spin += dt; if (v3.spin >= SPIN_MS) v3.spin = 0; } // one full turn when the card appears
  v3.yawG.rotation.y = v3.yaw + spinAngle(); v3.rollG.rotation.x = v3.roll; v3.gl.render(v3.scene, v3.cam); v3.frames++;
  if (v3.spin || v3.drag) v3.raf = requestAnimationFrame(tick3D); // otherwise nothing moves, so nothing to draw
}
