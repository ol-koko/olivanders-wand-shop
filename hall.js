'use strict';
// The Sorting Ceremony: the Hogwarts exterior and the way into the Great Hall. Runs after logic.js and core.js, and reads their top-level names directly.

/* ================= strings ================= */
Object.assign(S, {
  title: ['Церемонія сортування', 'The Sorting Ceremony'],
  sub: ['Капелюх уже чекає. Він давно нічого не вирішував', 'The Hat is waiting. It hasn’t decided anything in a while'],
  cta: ['Увійти до Великої зали', 'Enter the Great Hall'],
  castleA: ['Нічний замок над озером', 'A castle above a lake at night'],
  soonK: ['Велика зала', 'The Great Hall'],
  soonH: ['Зала ще готується.', 'The Hall isn’t ready yet.'],
  soonI: ['Свічки вже запалили, а Капелюха ще латають. Заходь трохи згодом.', 'The candles are lit, but the Hat is still being patched. Come back a little later.'],
  bShop: ['До крамниці', 'To the wand shop'],
});

const st = { phase: 'castle', cap: null, noteFn: null, input: 'pointer' };

/* ================= castle ================= */
const CASTLE_TOP = 285; // the highest spire: the view keeps it below the title
function setViewBoxes() {
  if (!W || !H) return;
  const a = W / H, base = a > .9 ? 760 : 1080, title = $('#stTitle').getBoundingClientRect().bottom + 28;
  const vbH = st.phase === 'castle' && title < H * .8 ? Math.max(base, Math.min((1018 - CASTLE_TOP) / (1 - title / H), 2800 / a)) : base;
  const vbW = vbH * a, vb = `${(500 - vbW / 2).toFixed(1)} ${(1018 - vbH).toFixed(1)} ${vbW.toFixed(1)} ${vbH.toFixed(1)}`;
  ['#svgCaSky', '#svgCaFar', '#svgCaMain', '#svgCaFg'].forEach(s => $(s).setAttribute('viewBox', vb));
  // the moon stays clear of the title: lower on tall screens, to the side on wide ones
  const titleY = 1018 - vbH + ($('#stTitle').getBoundingClientRect().bottom + H * .04) / (H * 1.08) * vbH; // the layer is 108% of the screen
  $('#caMoon').setAttribute('transform', a > .9 ? `translate(-${Math.round(vbW * .3)} 0)` : `translate(0 ${Math.max(0, Math.round(titleY + 22 - 153))})`);
}
function buildSky() {
  const R = rng(11), s = $('#svgCaSky');
  let stars = ''; for (let i = 0; i < 260; i++) { const r = .5 + R() * 1.3, x = -900 + R() * 2800, y = -1400 + R() * 2100; stars += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(1)}" fill="#fff" opacity="${(.3 + R() * .6).toFixed(2)}"${R() < .12 ? ' class="tw"' : ''}/>`; }
  s.innerHTML = `<defs><linearGradient id="gCaSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#04060f"/><stop offset=".62" stop-color="#101a3c"/><stop offset=".86" stop-color="#2b2c58"/><stop offset="1" stop-color="#3f3560"/></linearGradient>
    <radialGradient id="gCaMoon"><stop offset="0" stop-color="#fff2cf" stop-opacity=".5"/><stop offset=".35" stop-color="#d9ddf5" stop-opacity=".16"/><stop offset="1" stop-color="#d9ddf5" stop-opacity="0"/></radialGradient></defs>
    <rect x="-1500" y="-1800" width="4000" height="3000" fill="url(#gCaSky)"/>${stars}
    <g id="caMoon"><circle cx="335" cy="205" r="210" fill="url(#gCaMoon)"/><circle id="caMoonDisc" cx="335" cy="205" r="52" fill="#f5ecd2"/><circle cx="320" cy="190" r="9" fill="#dcd2b4" opacity=".6"/><circle cx="352" cy="222" r="13" fill="#dcd2b4" opacity=".45"/><circle cx="348" cy="184" r="5" fill="#dcd2b4" opacity=".5"/></g>
    <g fill="#c9cfee" opacity=".07"><ellipse cx="120" cy="330" rx="340" ry="26"/><ellipse cx="760" cy="240" rx="300" ry="20"/><ellipse cx="1260" cy="400" rx="420" ry="30"/></g>`;
}
function buildFar() {
  const R = rng(23); let a = '-1500,860', b = '-1500,860';
  for (let x = -1500; x <= 2500; x += 70) { a += ` ${x},${(610 + Math.sin(x * .004) * 70 + R() * 70).toFixed(0)}`; b += ` ${x},${(700 + Math.sin(x * .006 + 2) * 50 + R() * 45).toFixed(0)}`; }
  a += ' 2500,860'; b += ' 2500,860';
  $('#svgCaFar').innerHTML = `<defs><linearGradient id="gMnt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c3160"/><stop offset="1" stop-color="#1a1d40"/></linearGradient></defs>
    <polygon points="${a}" fill="url(#gMnt)"/><polygon points="${b}" fill="#141633"/>`;
}
// One tower: stone body, conical roof with snow, lit windows.
function tower(x, base, w, h, roof, R, windows = 3) {
  const top = base - h, l = x - w / 2;
  let out = `<rect x="${l}" y="${top}" width="${w}" height="${h}" fill="url(#gStone)"/><rect x="${l}" y="${top}" width="${(w * .28).toFixed(1)}" height="${h}" fill="#000" opacity=".22"/>`;
  out += `<polygon points="${l - 5},${top} ${x},${top - roof} ${l + w + 5},${top}" fill="url(#gRoof)"/><polygon points="${x - w * .2},${(top - roof * .62).toFixed(1)} ${x},${top - roof} ${x + w * .2},${(top - roof * .62).toFixed(1)} ${x + w * .05},${(top - roof * .55).toFixed(1)} ${x - w * .1},${(top - roof * .58).toFixed(1)}" fill="#e6ecfa"/><rect x="${l - 3}" y="${top - 2}" width="${w + 6}" height="5" fill="#0d0c1e"/>`;
  for (let i = 0; i < windows; i++) { const wy = top + 16 + (h - 34) * (i + R() * .4) / windows, wx = x - 3 + (R() - .5) * w * .4; out += `<path d="M${wx.toFixed(1)} ${(wy + 13).toFixed(1)}v-9a3.2 3.2 0 0 1 6.4 0v9z" fill="#f5c774"${R() < .3 ? ' class="tw"' : ''}/>`; }
  return out;
}
function buildMain() {
  const R = rng(37), sw = -1400, se = 2400;
  let hall = ''; for (let i = 0; i < 5; i++) { const x = 416 + i * 37; hall += `<path d="M${x} 716v-72a11 11 0 0 1 22 0v72z" fill="url(#gLit)"/><path d="M${x + 11} 633v83M${x} 672h22" stroke="#3a2614" stroke-width="1.6"/>`; }
  let rippl = ''; for (let i = 0; i < 46; i++) { const y = 836 + R() * 170, w = 20 + R() * 110, x = -500 + R() * 2000; rippl += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${w.toFixed(0)}" height="1.6" fill="#8fa0da" opacity="${(.06 + R() * .14).toFixed(2)}"/>`; }
  let lit = ''; for (let i = 0; i < 26; i++) { const y = 842 + i * 6.5, w = 40 + R() * 70; lit += `<rect x="${(505 - w / 2 + (R() - .5) * 26).toFixed(0)}" y="${y.toFixed(0)}" width="${w.toFixed(0)}" height="2" fill="#f0bb6d" opacity="${(.36 - i * .011).toFixed(2)}"/>`; }
  $('#svgCaMain').innerHTML = `<defs>
    <linearGradient id="gStone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3560"/><stop offset="1" stop-color="#1a1730"/></linearGradient>
    <linearGradient id="gRoof" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#141633"/><stop offset="1" stop-color="#2f3a72"/></linearGradient>
    <linearGradient id="gLit" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe3a4"/><stop offset="1" stop-color="#e99b47"/></linearGradient>
    <linearGradient id="gRock" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2748"/><stop offset="1" stop-color="#0d0c1e"/></linearGradient>
    <linearGradient id="gLake" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b2150"/><stop offset="1" stop-color="#070a20"/></linearGradient>
    <radialGradient id="gHalo"><stop offset="0" stop-color="#ffc98a" stop-opacity=".42"/><stop offset="1" stop-color="#ffc98a" stop-opacity="0"/></radialGradient></defs>
    <rect x="${sw}" y="824" width="${se - sw}" height="300" fill="url(#gLake)"/>${rippl}${lit}
    ${tower(38, 760, 44, 150, 96, R)}${tower(960, 760, 48, 170, 104, R)}${tower(-210, 790, 40, 110, 80, R, 2)}${tower(1200, 790, 44, 120, 84, R, 2)}
    <polygon points="-420,840 -300,780 -120,760 40,716 170,700 300,690 700,690 830,704 980,724 1140,770 1320,790 1460,842" fill="url(#gRock)"/>
    <path d="M40 716l50 8 40-14 54 8M830 704l44 12 56-4 50 14M-120 760l60 6 48-14" stroke="#c8d2f0" stroke-width="3" fill="none" opacity=".55"/>
    ${tower(178, 708, 46, 190, 100, R)}${tower(822, 708, 50, 212, 108, R)}
    <rect x="178" y="650" width="210" height="26" fill="#22203f"/><rect x="178" y="646" width="210" height="4" fill="#d6def5" opacity=".7"/>
    <rect x="640" y="650" width="182" height="26" fill="#22203f"/><rect x="640" y="646" width="182" height="4" fill="#d6def5" opacity=".7"/>
    ${tower(288, 716, 58, 290, 120, R, 5)}${tower(696, 716, 66, 300, 131, R, 5)}
    <rect x="388" y="618" width="224" height="106" fill="url(#gStone)"/><polygon points="376,620 500,540 624,620" fill="url(#gRoof)"/><polygon points="438,582 500,540 562,582 528,574 500,560 470,578" fill="#e6ecfa"/>
    <ellipse cx="500" cy="680" rx="170" ry="120" fill="url(#gHalo)"/>${hall}
    <rect id="hallHit" x="412" y="630" width="176" height="90" fill="transparent"/>`;
}
function buildFg() {
  const R = rng(51);
  const pine = (x, y, h) => { const w = h * .42; let o = `<rect x="${x - 4}" y="${y - 14}" width="8" height="16" fill="#120d0c"/>`; for (let i = 0; i < 4; i++) { const t = y - h + i * h * .2, bw = w * (.38 + i * .22), bh = h * .34; o += `<polygon points="${x},${t.toFixed(0)} ${(x - bw).toFixed(0)},${(t + bh).toFixed(0)} ${(x + bw).toFixed(0)},${(t + bh).toFixed(0)}" fill="#0d1c1c"/><polygon points="${x},${t.toFixed(0)} ${(x - bw * .46).toFixed(0)},${(t + bh * .42).toFixed(0)} ${x},${(t + bh * .34).toFixed(0)} ${(x + bw * .46).toFixed(0)},${(t + bh * .42).toFixed(0)}" fill="#e6ecfa" opacity=".82"/>`; } return o; };
  let trees = ''; for (const [x, y, h] of [[-420, 1000, 300], [-250, 1010, 240], [-90, 1000, 310], [70, 1012, 210], [205, 1008, 190], [262, 1016, 130], [752, 1014, 145], [806, 1008, 205], [930, 1012, 240], [1090, 1000, 310], [1260, 1010, 250], [1430, 1000, 300]]) trees += pine(x, y, h);
  let bank = '-1500,1100 -1500,985'; for (let x = -1500; x <= 2500; x += 90) bank += ` ${x},${(982 + Math.sin(x * .011) * 14 + R() * 6).toFixed(0)}`; bank += ' 2500,1100';
  $('#svgCaFg').innerHTML = `${trees}<polygon points="${bank}" fill="#dce4f6"/><polygon points="${bank}" fill="#9aa8d8" opacity=".18"/>`;
}
function buildHall() {
  const R = rng(61);
  let win = ''; for (const x of [90, 250, 680, 840]) win += `<path d="M${x} 620V190a35 35 0 0 1 70 0v430z" fill="#1c2452"/><path d="M${x + 35} 155v465M${x} 300h70M${x} 420h70M${x} 530h70" stroke="#0c0a18" stroke-width="3"/>`;
  $('#svgHaBack').innerHTML = `<defs><linearGradient id="gWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#07060f"/><stop offset=".6" stop-color="#231a24"/><stop offset="1" stop-color="#3a2618"/></linearGradient></defs>
    <rect x="-400" y="-400" width="1800" height="1800" fill="url(#gWall)"/>${win}<rect x="-400" y="650" width="1800" height="600" fill="#1a110c"/>`;
  let can = ''; for (let i = 0; i < 44; i++) { const x = R() * 1000, y = 60 + R() * 420, s = .6 + R() * .9; can += `<g class="${R() < .35 ? 'tw' : ''}"><circle cx="${x.toFixed(0)}" cy="${(y - 8 * s).toFixed(0)}" r="${(14 * s).toFixed(1)}" fill="#ffc98a" opacity=".16"/><rect x="${(x - 1.7 * s).toFixed(1)}" y="${y.toFixed(0)}" width="${(3.4 * s).toFixed(1)}" height="${(16 * s).toFixed(1)}" fill="#f0e6cf"/><ellipse cx="${x.toFixed(0)}" cy="${(y - 3 * s).toFixed(1)}" rx="${(1.9 * s).toFixed(1)}" ry="${(4 * s).toFixed(1)}" fill="#ffd787"/></g>`; }
  let tab = ''; for (const [a, b] of [[80, 250], [300, 420], [580, 700], [750, 920]]) tab += `<polygon points="${a},640 ${b},640 ${b + (b - 500) * .28},1000 ${a + (a - 500) * .28},1000" fill="#2c1a0e"/><polygon points="${a},640 ${b},640 ${b + 2},648 ${a - 2},648" fill="#6a4524"/>`;
  $('#svgHaMid').innerHTML = can + tab;
}

/* ================= language ================= */
function applyLang() {
  document.documentElement.lang = lang === 'en' ? 'en' : 'uk'; document.title = T('title'); $('#castle').setAttribute('aria-label', T('castleA'));
  $('#stT').textContent = T('title'); $('#stS').textContent = T('sub'); $('#cta').textContent = T('cta'); $('#stFan').textContent = T('fan');
  document.querySelectorAll('#lang button').forEach(b => b.classList.toggle('on', b.dataset.l === lang));
  sndBtn.setAttribute('aria-label', T(A.on ? 'sndOff' : 'sndOn'));
  setViewBoxes();
  if (st.noteFn) renderNote();
}
document.querySelectorAll('#lang button').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); lang = b.dataset.l; try { localStorage.setItem('wand-lang', lang); } catch (_) { } applyLang(); }));

/* ================= into the hall ================= */
async function enterHall() {
  if (st.phase !== 'castle') return; st.phase = 'entering';
  // Browsers allow sound only after a tap, so the entry tap is what starts it.
  if (A.on) { audioInit(); if (A.ctx && A.ctx.state === 'suspended') A.ctx.resume(); SFX.whoosh(); SFX.chime(); }
  $('#cta').style.opacity = 0; $('#stFan').style.opacity = 0; $('#stTitle').style.opacity = 0; $('#stTitle').style.transform = 'translateY(-20px)';
  const wr = $('#hallHit').getBoundingClientRect(), cx = wr.left + wr.width / 2, cy = wr.top + wr.height / 2;
  const out = ['caSky', 'caFar', 'caMain', 'caFg'].map(id => layers[id]), inn = ['haBack', 'haMid'];
  out.forEach(Ly => { const r = Ly.el.getBoundingClientRect(); Ly.el.style.transformOrigin = `${(cx - r.left) / Ly.s}px ${(cy - r.top) / Ly.s}px`; });
  const fl = $('#flash'); fl.style.setProperty('--fx', cx + 'px'); fl.style.setProperty('--fy', cy + 'px');
  const hall = $('#hall'), dur = reduceMotion ? 500 : 2100; hall.hidden = false; buildHall(); hall.style.opacity = 0;
  inn.forEach(id => { layers[id].s = reduceMotion ? 1 : 1.3; });
  const run = (ms, f) => new Promise(res => { const t0 = performance.now(), step = () => { const t = clamp((performance.now() - t0) / ms); f(t); if (t < 1) requestAnimationFrame(step); else res(); }; step(); });
  await run(dur, t => {
    const z = easeIO(t);
    if (!reduceMotion) { layers.caSky.s = 1 + .3 * z; layers.caFar.s = 1 + 1.1 * z; layers.caMain.s = 1 + 7 * Math.pow(z, 1.8); layers.caFg.s = 1 + 10 * Math.pow(z, 1.4); layers.caMain.blur = z > .55 ? (z - .55) * 10 : 0; layers.caFg.blur = z * 9; }
    fl.style.opacity = clamp((t - .5) / .42); drawSnow(performance.now(), 1 - z);
  });
  $('#castle').hidden = true; hall.style.opacity = 1;
  await run(reduceMotion ? 400 : 1300, t => { const e = easeOut(t); if (!reduceMotion) inn.forEach((id, i) => { layers[id].s = 1 + (.3 + i * .1) * (1 - e); }); fl.style.opacity = 1 - easeOut(clamp(t / .75)); });
  st.phase = 'hall';
  setNote(() => ({ kicker: T('soonK'), hand: T('soonH'), instr: T('soonI'), btns: [{ label: T('bShop'), fn: () => { location.href = '/'; } }] }));
}
const castle = $('#castle');
dragDepth(castle);
castle.addEventListener('click', () => { if (touch.moved) { touch.moved = false; return; } });
$('#cta').addEventListener('click', e => { e.stopPropagation(); enterHall(); });

/* ================= boot ================= */
function onResize() { W = innerWidth; H = innerHeight; MIN = Math.min(W, H); setViewBoxes(); initSnow(); }
let resizeT = 0; addEventListener('resize', () => { clearTimeout(resizeT); resizeT = setTimeout(onResize, 120); });
buildSky(); buildFar(); buildMain(); buildFg(); setViewBoxes(); initSnow(); applyLang();
function frame(t) {
  requestAnimationFrame(frame); // first, so an error in one frame can't stop the page
  now = t; updatePar(t);
  if (st.phase === 'castle') drawSnow(t);
}
requestAnimationFrame(frame);
