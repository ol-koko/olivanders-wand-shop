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
const CASTLE_TOP = 165; // the highest spire: the view keeps it below the title
function setViewBoxes() {
  if (!W || !H) return;
  const a = W / H, base = a > .9 ? 760 : Math.max(1080, 600 / a), title = $('#stTitle').getBoundingClientRect().bottom + 28; // on a phone the whole castle fits the width
  const vbH = st.phase === 'castle' && title < H * .8 ? Math.max(base, Math.min((1018 - CASTLE_TOP) / (1 - title / H), 2800 / a)) : base;
  const vbW = vbH * a, vb = `${(514 - vbW / 2).toFixed(1)} ${(1018 - vbH).toFixed(1)} ${vbW.toFixed(1)} ${vbH.toFixed(1)}`;
  ['#svgCaSky', '#svgCaFar', '#svgCaMain', '#svgCaFg'].forEach(s => $(s).setAttribute('viewBox', vb));
  // the moon sits behind the main tower, and moves down if the title would touch it
  const titleY = 1018 - vbH + ($('#stTitle').getBoundingClientRect().bottom + H * .04) / (H * 1.08) * vbH; // the layer is 108% of the screen
  $('#caMoon').setAttribute('transform', `translate(0 ${Math.max(0, Math.round(titleY + 24 - 178))})`);
}
function buildSky() {
  const R = rng(11), s = $('#svgCaSky');
  let stars = ''; for (let i = 0; i < 300; i++) { const r = .4 + R() * 1.2, x = -1000 + R() * 3000, y = -1500 + R() * 2200; stars += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(1)}" fill="#dfe6ff" opacity="${(.25 + R() * .6).toFixed(2)}"${R() < .1 ? ' class="tw"' : ''}/>`; }
  let clouds = ''; for (let i = 0; i < 46; i++) { const near = i < 18, x = near ? 405 + (R() - .5) * 760 : -1000 + R() * 3000, y = near ? 250 + (R() - .5) * 330 : -300 + R() * 920, rx = 90 + R() * 240, ry = 26 + R() * 70, o = near ? .14 + R() * .2 : .08 + R() * .16; clouds += `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${rx.toFixed(0)}" ry="${ry.toFixed(0)}" fill="url(#${near ? 'gCloudLit' : 'gCloud'})" opacity="${o.toFixed(2)}"/>`; }
  s.innerHTML = `<defs><linearGradient id="gCaSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#010207"/><stop offset=".6" stop-color="#070a14"/><stop offset=".86" stop-color="#101626"/><stop offset="1" stop-color="#161c2e"/></linearGradient>
    <radialGradient id="gCaMoon"><stop offset="0" stop-color="#f4ecd2" stop-opacity=".62"/><stop offset=".3" stop-color="#b9c4dc" stop-opacity=".22"/><stop offset="1" stop-color="#8fa0c6" stop-opacity="0"/></radialGradient>
    <radialGradient id="gCloud"><stop offset="0" stop-color="#46536f"/><stop offset="1" stop-color="#46536f" stop-opacity="0"/></radialGradient>
    <radialGradient id="gCloudLit"><stop offset="0" stop-color="#aab6c8"/><stop offset="1" stop-color="#aab6c8" stop-opacity="0"/></radialGradient></defs>
    <rect x="-1500" y="-1800" width="4000" height="3000" fill="url(#gCaSky)"/>${stars}
    <g id="caMoon"><circle cx="405" cy="248" r="330" fill="url(#gCaMoon)"/><circle id="caMoonDisc" cx="405" cy="248" r="70" fill="#f1e8cd"/><circle cx="384" cy="228" r="13" fill="#d4c9a8" opacity=".6"/><circle cx="430" cy="270" r="18" fill="#d4c9a8" opacity=".45"/><circle cx="426" cy="222" r="7" fill="#d4c9a8" opacity=".5"/><circle cx="378" cy="276" r="8" fill="#d4c9a8" opacity=".4"/></g>${clouds}`;
}
function buildFar() {
  const R = rng(23); let a = '-1500,860', b = '-1500,860';
  for (let x = -1500; x <= 2500; x += 60) { const gap = Math.abs(x - 500) < 340 ? 70 : 0; a += ` ${x},${(640 + gap + Math.sin(x * .004) * 80 + R() * 60).toFixed(0)}`; b += ` ${x},${(730 + gap * .6 + Math.sin(x * .007 + 2) * 45 + R() * 36).toFixed(0)}`; }
  a += ' 2500,860'; b += ' 2500,860';
  $('#svgCaFar').innerHTML = `<polygon points="${a}" fill="#0c1120"/><polygon points="${b}" fill="#070a14"/>`;
}
// Shared glow behind a lit area.
const glow = (x, y, rx, ry, o = 1) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#gHalo)" opacity="${o}"/>`;
const litWindow = (x, y, w, h, R) => `<path d="M${x.toFixed(1)} ${(y + h).toFixed(1)}v-${(h - w / 2).toFixed(1)}a${(w / 2).toFixed(1)} ${(w / 2).toFixed(1)} 0 0 1 ${w.toFixed(1)} 0v${(h - w / 2).toFixed(1)}z" fill="${R() < .78 ? '#f7c56e' : '#c98b3e'}"${R() < .16 ? ' class="tw"' : ''}/>`;
// A round tower: shaded body, a band of battlements, a tall flared cone with snow on one side.
function tower(x, base, w, top, peak, R, windows = 3) {
  const l = x - w / 2, r = x + w / 2, ey = top + 2, flare = w * .22;
  let o = `<rect x="${l}" y="${top}" width="${w}" height="${base - top}" fill="url(#gCyl)"/>`;
  for (let i = 0; i < windows; i++) { const wy = top + 14 + (base - top - 34) * (i + R() * .5) / windows; o += litWindow(x - w * .08 + (R() - .5) * w * .34, wy, Math.max(3, w * .11), Math.max(8, w * .28), R); }
  o += `<rect x="${l - 2}" y="${top - 5}" width="${w + 4}" height="7" fill="#05060c"/>`;
  o += `<path d="M${l - flare} ${ey}Q${x - w * .17} ${(ey + peak) / 2} ${x} ${peak}Q${x + w * .17} ${(ey + peak) / 2} ${r + flare} ${ey}Q${x} ${ey + 9} ${l - flare} ${ey}Z" fill="url(#gCone)"/>`;
  o += `<path d="M${x - w * .05} ${peak + (ey - peak) * .12}Q${x - w * .22} ${(ey + peak) / 2} ${l - flare * .3} ${ey - 3}Q${x - w * .22} ${ey - (ey - peak) * .28} ${x - w * .02} ${peak + (ey - peak) * .4}Z" fill="#dbe3f4" opacity=".62"/>`;
  return o;
}
const spire = (x, base, w, peak) => `<polygon points="${x - w / 2},${base} ${x},${peak} ${x + w / 2},${base}" fill="url(#gCone)"/><polygon points="${x - w * .1},${peak + (base - peak) * .4} ${x},${peak} ${x + w * .04},${peak + (base - peak) * .3}" fill="#dbe3f4" opacity=".6"/>`;
// A rock mass: an outline filled with random facets, with snow lying on the upper ledges.
function rock(id, pts, R, top, bottom) {
  const xs = pts.map(p => p[0]), x0 = Math.min(...xs), x1 = Math.max(...xs), poly = pts.map(p => p.join(',')).join(' ');
  let f = ''; const n = Math.round((x1 - x0) / 7); for (let i = 0; i < n; i++) { const x = x0 + R() * (x1 - x0), y = top + R() * (bottom - top), w = 10 + R() * 30, h = 40 + R() * 90, lean = (R() - .5) * 14, c = R() < .6 ? '#05060c' : R() < .85 ? '#161b2a' : '#222a3e'; f += `<polygon points="${(x + lean).toFixed(0)},${y.toFixed(0)} ${(x + w).toFixed(0)},${(y + h * .55).toFixed(0)} ${(x + w * .4 - lean).toFixed(0)},${(y + h).toFixed(0)}" fill="${c}" opacity="${(.2 + R() * .32).toFixed(2)}"/>`; }
  for (let i = 0; i < n * .3; i++) { const x = x0 + R() * (x1 - x0), y = top + 6 + Math.pow(R(), 1.7) * (bottom - top) * .8, w = 5 + R() * 16; f += `<polygon points="${x.toFixed(0)},${y.toFixed(0)} ${(x + w).toFixed(0)},${(y + 2 + R() * 4).toFixed(0)} ${(x + w * .5).toFixed(0)},${(y + 4 + R() * 8).toFixed(0)}" fill="#d6dff2" opacity="${(.28 + R() * .46).toFixed(2)}"/>`; }
  return `<clipPath id="${id}"><polygon points="${poly}"/></clipPath><polygon points="${poly}" fill="url(#gRock)"/><g clip-path="url(#${id})">${f}</g>`;
}
function buildMain() {
  const R = rng(37), sw = -1500, se = 2500;
  let rippl = ''; for (let i = 0; i < 70; i++) { const y = 836 + R() * 180, w = 16 + R() * 120, x = -600 + R() * 2200; rippl += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${w.toFixed(0)}" height="1.5" fill="#9fb0d8" opacity="${(.05 + R() * .16).toFixed(2)}"/>`; }
  let lit = ''; for (let i = 0; i < 26; i++) { const y = 840 + i * 6.8, w = 26 + R() * 74; lit += `<rect x="${(372 - w / 2 + (R() - .5) * 40).toFixed(0)}" y="${y.toFixed(0)}" width="${w.toFixed(0)}" height="2" fill="#f0bb6d" opacity="${(.34 - i * .011).toFixed(2)}"/>`; }
  // the long hall on the left: buttresses and tall lit windows under a steep snowy roof
  let hallWin = '', butt = ''; for (let i = 0; i < 8; i++) { const x = 256 + i * 24.5; hallWin += litWindow(x, 450, 12, 80, R) + `<path d="M${x + 6} 454v76" stroke="#3a2614" stroke-width="1"/>`; butt += `<polygon points="${x - 7},562 ${x - 7},430 ${x - 3},420 ${x + 1},430 ${x + 1},562" fill="#0c0e18"/>`; }
  const castle = `
    ${tower(742, 590, 34, 452, 372, R, 2)}${spire(780, 480, 14, 396)}
    <rect x="628" y="478" width="110" height="112" fill="url(#gStone)"/>
    ${tower(696, 590, 48, 372, 268, R, 4)}${spire(650, 450, 18, 340)}${spire(722, 372, 12, 300)}
    <polygon points="622,480 662,424 702,480" fill="url(#gCone)"/><polygon points="648,444 662,424 676,444 662,438" fill="#dbe3f4" opacity=".6"/>
    ${litWindow(640, 505, 7, 20, R)}${litWindow(660, 500, 7, 22, R)}${litWindow(716, 520, 6, 18, R)}${litWindow(632, 546, 6, 16, R)}${litWindow(668, 548, 6, 16, R)}
    <rect x="520" y="584" width="130" height="58" fill="#10121d"/><path d="M520 584h130" stroke="#d6dff2" stroke-width="2.5" opacity=".6"/>
    ${[528, 556, 584, 612].map(x => `<path d="M${x} 642v-30a11 11 0 0 1 22 0v30z" fill="#06070d"/>`).join('')}
    <rect x="490" y="468" width="118" height="100" fill="url(#gStone)"/><polygon points="484,470 522,424 560,470" fill="url(#gCone)"/><polygon points="510,438 522,424 534,438 522,433" fill="#dbe3f4" opacity=".6"/>
    ${tower(576, 566, 42, 410, 306, R, 3)}${spire(530, 424, 11, 362)}${spire(612, 468, 13, 392)}
    ${litWindow(506, 490, 7, 22, R)}${litWindow(526, 490, 7, 22, R)}${litWindow(546, 492, 7, 22, R)}${litWindow(510, 530, 6, 16, R)}${litWindow(536, 530, 6, 16, R)}
    <rect x="244" y="430" width="212" height="132" fill="url(#gStone)"/>${butt}${hallWin}
    <polygon points="238,432 266,368 430,368 462,432" fill="url(#gCone)"/><polygon points="266,368 430,368 440,384 256,384" fill="#dbe3f4" opacity=".55"/>
    ${spire(262, 372, 12, 318)}${spire(312, 372, 9, 334)}${spire(374, 372, 9, 334)}
    ${glow(345, 500, 170, 110, .55)}
    ${tower(470, 566, 66, 322, 165, R, 5)}${spire(428, 372, 13, 296)}${spire(512, 400, 14, 318)}
    <rect id="hallHit" x="256" y="446" width="186" height="90" fill="transparent"/>`;
  $('#svgCaMain').innerHTML = `<defs>
    <linearGradient id="gStone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#232838"/><stop offset="1" stop-color="#0b0d16"/></linearGradient>
    <linearGradient id="gCyl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0a0c15"/><stop offset=".3" stop-color="#2c3346"/><stop offset=".62" stop-color="#1a1e2c"/><stop offset="1" stop-color="#07080f"/></linearGradient>
    <linearGradient id="gCone" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3a4560"/><stop offset=".5" stop-color="#141927"/><stop offset="1" stop-color="#05060c"/></linearGradient>
    <linearGradient id="gRock" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#20263a"/><stop offset=".5" stop-color="#0e111c"/><stop offset="1" stop-color="#040509"/></linearGradient>
    <linearGradient id="gLake" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c1224"/><stop offset="1" stop-color="#020308"/></linearGradient>
    <radialGradient id="gHalo"><stop offset="0" stop-color="#ffb868" stop-opacity=".5"/><stop offset="1" stop-color="#ffb868" stop-opacity="0"/></radialGradient></defs>
    <rect x="${sw}" y="826" width="${se - sw}" height="300" fill="url(#gLake)"/>${rippl}${lit}
    ${rock('rkB', [[600, 840], [612, 650], [636, 588], [760, 584], [812, 640], [848, 740], [930, 842]], R, 584, 842)}
    ${rock('rkA', [[60, 842], [120, 740], [176, 640], [226, 572], [250, 556], [500, 556], [536, 610], [560, 700], [600, 780], [650, 842]], R, 556, 842)}
    ${rock('rkL', [[-600, 842], [-340, 760], [-140, 690], [20, 720], [120, 780], [200, 842]], R, 690, 842)}
    ${glow(590, 620, 90, 70, .5)}${castle}`;
}
function buildFg() {
  const R = rng(51);
  const bare = (x, y, h) => { let o = `<path d="M${x} ${y}L${x + 3} ${y - h * .55}" stroke="#020307" stroke-width="${(h * .05).toFixed(1)}"/>`; for (let i = 0; i < 9; i++) { const t = .3 + R() * .68, a = (R() < .5 ? -1 : 1) * (.5 + R() * .9), l = h * (.16 + R() * .22), bx = x + 1.5, by = y - h * .55 * t - h * .2 * R(); o += `<path d="M${bx.toFixed(0)} ${by.toFixed(0)}L${(bx + Math.sin(a) * l).toFixed(0)} ${(by - Math.cos(a) * l).toFixed(0)}" stroke="#020307" stroke-width="${(1.5 + R() * 2).toFixed(1)}"/>`; } return o; };
  const pine = (x, y, h) => { const w = h * .4; let o = `<rect x="${x - 4}" y="${y - 12}" width="8" height="14" fill="#020307"/>`; for (let i = 0; i < 4; i++) { const t = y - h + i * h * .2, bw = w * (.38 + i * .22), bh = h * .34; o += `<polygon points="${x},${t.toFixed(0)} ${(x - bw).toFixed(0)},${(t + bh).toFixed(0)} ${(x + bw).toFixed(0)},${(t + bh).toFixed(0)}" fill="#04070c"/><polygon points="${x},${t.toFixed(0)} ${(x - bw * .44).toFixed(0)},${(t + bh * .4).toFixed(0)} ${x},${(t + bh * .32).toFixed(0)} ${(x + bw * .44).toFixed(0)},${(t + bh * .4).toFixed(0)}" fill="#cfd8ea" opacity=".6"/>`; } return o; };
  let trees = ''; for (const [x, y, h] of [[-470, 1000, 300], [-280, 1006, 230], [-130, 1000, 280], [10, 1008, 210], [130, 1010, 170], [230, 1014, 120], [772, 1014, 125], [880, 1008, 190], [1040, 1004, 270], [1240, 1006, 240], [1440, 1000, 300]]) trees += pine(x, y, h);
  // little boats with lanterns on the lake
  let boats = ''; for (const [x, y, s] of [[330, 852, .7], [438, 866, .85], [566, 856, .75], [676, 872, .9]]) boats += `<ellipse cx="${x}" cy="${y - 20 * s}" rx="${40 * s}" ry="${40 * s}" fill="url(#gLantern)"/><path d="M${x - 22 * s} ${y}q${22 * s} ${11 * s} ${44 * s} 0l-${5 * s} ${8 * s}h-${34 * s}z" fill="#040509"/><path d="M${x} ${y}v-${24 * s}" stroke="#040509" stroke-width="1.6"/><circle cx="${x}" cy="${y - 26 * s}" r="${3.4 * s}" fill="#ffd787"/><rect x="${x - 7 * s}" y="${y + 9 * s}" width="${14 * s}" height="1.6" fill="#f0bb6d" opacity=".5"/><rect x="${x - 4 * s}" y="${y + 14 * s}" width="${8 * s}" height="1.4" fill="#f0bb6d" opacity=".35"/>`;
  let bank = '-1500,1100 -1500,985'; for (let x = -1500; x <= 2500; x += 90) bank += ` ${x},${(984 + Math.sin(x * .011) * 12 + R() * 6).toFixed(0)}`; bank += ' 2500,1100';
  $('#svgCaFg').innerHTML = `<defs><radialGradient id="gLantern"><stop offset="0" stop-color="#ffc56e" stop-opacity=".5"/><stop offset="1" stop-color="#ffc56e" stop-opacity="0"/></radialGradient>
    <linearGradient id="gFgRock" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#141927"/><stop offset="1" stop-color="#030409"/></linearGradient></defs>
    <polygon points="880,1010 960,800 1020,700 1120,610 1260,560 1440,600 1700,540 1900,1010" fill="url(#gFgRock)"/>
    ${boats}${bare(60, 1000, 240)}${bare(942, 1000, 220)}${trees}<polygon points="${bank}" fill="#ccd6ea"/><polygon points="${bank}" fill="#5d6a90" opacity=".22"/>`;
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
  if (A.on) { audioInit(); if (A.ctx && A.ctx.state === 'suspended') A.ctx.resume(); SFX.bell(); }
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
