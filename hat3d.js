// The Hat in 3D, built in code: one crumpled cloth surface whose folds make the face. Every expression is a morph of that surface.
// await Hat3D.create(three, canvas) returns { set(pose), turn(yaw, pitch), render(), size(px), ratio(r), dispose() }. Building yields often, so the page stays smooth. A pose holds any of the values in MORPHS, from 0 to 1 (look and turn run from -1 to 1).
const Hat3D = (() => {
  const MORPHS = ['blink', 'browUp', 'furrow', 'open', 'smile', 'lookX', 'lookY', 'droop', 'perk'];
  const H = 2.8, R0 = .9, TAU = Math.PI * 2;
  const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const g = (dx, dy, sx, sy) => Math.exp(-(dx * dx) / (sx * sx) - (dy * dy) / (sy * sy));
  const browY = (x, s, m) => { const inner = 1 - smooth(.03, .15, s * x); return .545 + .04 * m.browUp - .015 * m.furrow - .055 * m.furrow * inner + .024 * m.browUp * (1 - inner) - .05 * Math.pow(s * x / .17 - .5, 2); };
  const pause = () => new Promise(r => setTimeout(r));
  const clear = m => Object.assign({ blink: 0, browUp: 0, furrow: 0, open: 0, smile: 0, lookX: 0, lookY: 0, droop: 0, perk: 0 }, m);

  // Creases: sharp valleys rather than soft waves. ao is how deep in shadow the cloth sits there.
  function folds(x, v) {
    const a = x * TAU, quiet = 1 - .72 * g(x, v - .37, .22, .24), s1 = Math.sin(v * 12.5 + 1.15 * Math.sin(a * 2 + 1)), s2 = Math.sin(v * 6.5 - a * 1.5 + .6), s3 = Math.sin(a * 2.5 + v * 4.5 + 2), damp = .5 + .5 * smooth(0, .24, v);
    return { d: quiet * damp * (.17 * (Math.abs(s1) - .6) * (1 - .35 * v) + .1 * (Math.abs(s2) - .6) + .07 * (Math.abs(s3) - .6) + .016 * Math.sin(a * 13 + v * 37)), ao: Math.min(.8, quiet * (.75 * Math.exp(-s1 * s1 / .02) + .5 * Math.exp(-s2 * s2 / .015) + .35 * Math.exp(-s3 * s3 / .012))) };
  }

  // Where the cloth is. x runs around the Hat (0 is the middle of the face, ±.5 the back), v from the brim to the tip, lift pushes outward.
  function point(x, v, m, lift = 0) {
    const a = x * TAU, bend = smooth(.42, 1, v), ax = Math.abs(x);
    const fold = folds(x, v).d;
    let r = (R0 * Math.pow(1 - v, .78) + .035) * (1 + fold) + .16 * Math.pow(1 - smooth(0, .09, v), 2);
    let d = 0;
    for (const s of [-1, 1]) {
      const by = browY(x, s, m);
      d += .17 * g(x - s * .086, v - by, .1, .02) - .085 * g(x - s * .08, v - .445, .066, .04) * (1 - .4 * m.blink);
      d += .034 * g(ax - .165, v - .33, .05, .055) * m.smile;
    }
    d += m.furrow * .03 * Math.sin((v - .6) * 120) * g(x, v - .645, .11, .05);
    const curve = m.smile * Math.pow(x / .125, 2) * .05, my = .275 + curve;
    d -= .11 * g(x, v - my, .135, .03 + .055 * m.open);
    d += .062 * g(x, v - (my - .058 - .05 * m.open), .12, .022) + .05 * g(x, v - (my + .05 + .03 * m.open), .13, .018);
    r += d * (1 - v * .4) + lift;
    const sx = (.68 + .3 * m.droop - .36 * m.perk) * bend * bend, sy = v * H - (.5 + .36 * m.droop - .4 * m.perk) * bend * bend * bend, sz = -.12 * bend;
    return [sx + Math.sin(a) * r, sy, sz + Math.cos(a) * r];
  }

  // Builds a grid whose every vertex comes from fn(i, j, pose), with one morph target per expression.
  async function grid(THREE, cols, rows, fn, uv, tint) {
    const base = [], uvs = [], idx = [], at = m => { const p = []; for (let j = 0; j <= rows; j++) for (let i = 0; i <= cols; i++) p.push(...fn(i / cols, j / rows, m)); return p; };
    base.push(...at(clear()));
    if (uv) for (let j = 0; j <= rows; j++) for (let i = 0; i <= cols; i++) uvs.push(...uv(i / cols, j / rows));
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) { const a = j * (cols + 1) + i, b = a + 1, c = a + cols + 1, d = c + 1; idx.push(a, b, d, a, d, c); }
    const norm = pos => { const q = new THREE.BufferGeometry(); q.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); q.setIndex(idx); q.computeVertexNormals(); return q.getAttribute('normal').array; };
    const geo = new THREE.BufferGeometry(), n0 = norm(base); geo.setAttribute('position', new THREE.Float32BufferAttribute(base, 3)); geo.setAttribute('normal', new THREE.BufferAttribute(n0, 3)); if (uv) geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2)); if (tint) { const col = []; for (let j = 0; j <= rows; j++) for (let i = 0; i <= cols; i++) { const k = tint(i / cols, j / rows); col.push(k, k, k); } geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); } geo.setIndex(idx);
    geo.morphAttributes.position = []; geo.morphAttributes.normal = []; geo.morphTargetsRelative = true;
    await pause(); for (const name of MORPHS) { await pause(); const p = at(clear({ [name]: 1 })), n = norm(p); geo.morphAttributes.position.push(new THREE.Float32BufferAttribute(p.map((v, i) => v - base[i]), 3)); geo.morphAttributes.normal.push(new THREE.Float32BufferAttribute(Array.from(n, (v, i) => v - n0[i]), 3)); }
    return geo;
  }

  // Worn cloth with sewn patches. The same picture gives the colour and the relief.
  function cloth(THREE) {
    let seed = 7; const R = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }; const c = document.createElement('canvas'); c.width = 2048; c.height = 1024; const x = c.getContext('2d'), W = c.width, Hh = c.height;
    const v = x.createLinearGradient(0, 0, 0, Hh); v.addColorStop(0, '#30323f'); v.addColorStop(.55, '#22242e'); v.addColorStop(1, '#14151c'); x.fillStyle = v; x.fillRect(0, 0, W, Hh);
    x.fillStyle = 'rgba(0,0,0,.08)'; for (let i = 0; i < W; i += 3) x.fillRect(i, 0, 1, Hh); x.fillStyle = 'rgba(255,245,225,.025)'; for (let i = 0; i < Hh; i += 3) x.fillRect(0, i, W, 1);
    for (let i = 0; i < 9000; i++) { x.fillStyle = `rgba(${R() < .5 ? '255,245,225' : '0,0,0'},${R() * .05})`; x.fillRect(R() * W, R() * Hh, 1 + R() * 28, 1 + R() * 2); }
    for (let i = 0; i < 26; i++) { const r = 40 + R() * 130; const g2 = x.createRadialGradient(0, 0, 0, 0, 0, r), px = R() * W, py = R() * Hh; g2.addColorStop(0, `rgba(${R() < .5 ? '120,110,100' : '0,0,0'},.16)`); g2.addColorStop(1, 'rgba(0,0,0,0)'); x.save(); x.translate(px, py); x.fillStyle = g2; x.fillRect(-r, -r, 2 * r, 2 * r); x.restore(); }
    const patch = (cx, cy, w, h, rot, tone) => { x.save(); x.translate(cx, cy); x.rotate(rot); x.fillStyle = tone; x.fillRect(-w / 2, -h / 2, w, h); x.strokeStyle = 'rgba(0,0,0,.65)'; x.lineWidth = 4; x.strokeRect(-w / 2, -h / 2, w, h); x.strokeStyle = '#94815f'; x.lineWidth = 3.5; x.lineCap = 'round'; const st = (ax, ay, bx, by) => { const n = Math.round(Math.hypot(bx - ax, by - ay) / 17); for (let i = 0; i <= n; i++) { const t = i / n, sx = ax + (bx - ax) * t, sy = ay + (by - ay) * t, nx = (by - ay) / Math.hypot(bx - ax, by - ay) * 6, ny = -(bx - ax) / Math.hypot(bx - ax, by - ay) * 6; x.beginPath(); x.moveTo(sx - nx, sy - ny); x.lineTo(sx + nx, sy + ny); x.stroke(); } }; st(-w / 2, -h / 2, w / 2, -h / 2); st(w / 2, -h / 2, w / 2, h / 2); st(w / 2, h / 2, -w / 2, h / 2); st(-w / 2, h / 2, -w / 2, -h / 2); x.restore(); };
    patch(W * .335, Hh * .82, 150, 105, -.14, '#272935'); patch(W * .665, Hh * .73, 125, 140, .1, '#2c2e3b'); patch(W * .56, Hh * .1, 210, 80, .2, '#292b37'); patch(W * .29, Hh * .42, 105, 90, -.25, '#252733');
    for (let i = 0; i < 22; i++) { let px = R() * W, py = R() * Hh; if (px > W * .34 && px < W * .66 && py > Hh * .36 && py < Hh * .84) continue; const dx = 90 + R() * 200, dy = (R() - .5) * 90, bend = (R() - .5) * 70, line = (off, style, wid) => { x.strokeStyle = style; x.lineWidth = wid; x.lineCap = 'round'; x.beginPath(); x.moveTo(px, py + off); x.quadraticCurveTo(px + dx / 2, py + off + bend, px + dx, py + off + dy); x.stroke(); }; line(5, 'rgba(160,160,185,.1)', 3); x.filter = 'blur(2px)'; line(0, 'rgba(0,0,0,.55)', 6); x.filter = 'none'; }
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4; const bump = new THREE.CanvasTexture(c); return { tex, bump };
  }

  async function create(THREE, canvas) {
    const gl = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true }); gl.setPixelRatio(Math.min(2, devicePixelRatio || 1)); gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.15;
    const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(26, 1, .1, 40); cam.position.set(0, 1.6, 8.1); cam.lookAt(.12, 1.14, 0);
    const key = new THREE.DirectionalLight(0xfff1dd, 4.6); key.position.set(-3.2, 4, 5); const rim = new THREE.DirectionalLight(0xffc27a, 5); rim.position.set(3.6, 2.4, -4); const rim2 = new THREE.DirectionalLight(0x9db4ff, 5); rim2.position.set(-4, 1.2, -3.5); const front = new THREE.DirectionalLight(0xffe2bd, 2.3); front.position.set(.4, 1.2, 8); scene.add(key, rim, rim2, front, new THREE.HemisphereLight(0x9aa4c8, 0x201816, .85));
    const { tex, bump } = cloth(THREE), group = new THREE.Group(); scene.add(group); const meshes = [];
    const add = (geo, mat) => { const m = new THREE.Mesh(geo, mat); group.add(m); meshes.push(m); return m; };
    const cl = new THREE.MeshPhysicalMaterial({ map: tex, bumpMap: bump, bumpScale: 3, roughness: .92, metalness: 0, side: THREE.DoubleSide, vertexColors: true, sheen: .22, sheenRoughness: .6, sheenColor: new THREE.Color(0x4a4d62) });
    add(await grid(THREE, 150, 110, (i, j, m) => point(i - .5, j, m), (i, j) => [i, j], (i, j) => 1 - folds(i - .5, j).ao), cl);
    // the brim: heavy cloth with a sagging, rolled edge
    const brimY = (a, t) => (.09 * Math.sin(a * 3 + 1) + .06 * Math.sin(a * 7 + .5) + .03 * Math.sin(a * 13)) * t - .16 * t * t * t + .02, brimR = (a, t) => R0 + .13 + t * .6 + .03 * Math.sin(a * 5 + 1) * t;
    const felt = new THREE.MeshPhysicalMaterial({ map: tex, bumpMap: bump, bumpScale: 2, roughness: 1, color: 0x3a3b46, side: THREE.DoubleSide, vertexColors: true, sheen: .1, sheenRoughness: .8, sheenColor: new THREE.Color(0x4a4d62) });
    add(await grid(THREE, 180, 16, (i, j) => { const a = (i - .5) * TAU, r = brimR(a, j); return [Math.sin(a) * r, brimY(a, j), Math.cos(a) * r]; }, (i, j) => [i, .03 + j * .12], (i, j) => (.3 + .7 * smooth(0, .4, j)) * (1 - .4 * j * Math.exp(-Math.pow(Math.sin((i - .5) * TAU * 3.5 + 1), 2) / .08))), felt);
    add(await grid(THREE, 180, 5, (i, j) => { const a = (i - .5) * TAU, phi = j * Math.PI, r = brimR(a, 1) + .05 * Math.sin(phi); return [Math.sin(a) * r, brimY(a, 1) + .05 * Math.cos(phi), Math.cos(a) * r]; }, (i, j) => [i, .03], () => .85), felt);
    // the dark of the eyes and the mouth, sitting in the folds
    const black = new THREE.MeshBasicMaterial({ color: 0x030304, depthTest: false }), dark = geo => { const m = add(geo, black); m.renderOrder = 2; return m; };
    const eye = async s => dark(await grid(THREE, 22, 8, (i, j, m) => { const q = i * 2 - 1, t = j * 2 - 1, lid = 1 - .94 * m.blink, inner = (s * q + 1) / 2 < .5 ? 1 : 0, wid = Math.pow(1 - q * q, .62), x = s * .08 + q * .052 + m.lookX * .017, y = .447 + m.lookY * .011 - m.furrow * .012 * (1 - s * q) + t * wid * .025 * lid + m.browUp * .006; return point(x, y, m, .014); }));
    await eye(-1); await eye(1);
    const brow = async s => dark(await grid(THREE, 24, 3, (i, j, m) => { const q = i * 2 - 1, wid = Math.pow(1 - q * q, .5), x = s * .088 + q * .082; return point(x, browY(x, s, m) - .027 + (j * 2 - 1) * wid * .0085, m, .02); }));
    await brow(-1); await brow(1);
    dark(await grid(THREE, 36, 8, (i, j, m) => { const q = i * 2 - 1, t = j * 2 - 1, wid = Math.pow(1 - q * q, .55), x = q * .128, cur = m.smile * q * q * .05, y = .275 + cur + t * wid * (.012 + .062 * m.open); return point(x, y, m, .012); }));
    const api = { pose: clear(), set(p) { Object.assign(api.pose, p); meshes.forEach(k => { if (k.morphTargetInfluences) MORPHS.forEach((n, i) => { k.morphTargetInfluences[i] = api.pose[n]; }); }); }, turn(y, x = 0) { group.rotation.y = y; group.rotation.x = x; }, render() { gl.render(scene, cam); }, size(px) { gl.setSize(px, px, false); }, ratio(r) { gl.setPixelRatio(r); }, dispose() { gl.dispose(); } };
    return api;
  }
  return { create, MORPHS };
})();
