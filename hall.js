'use strict';
// The Sorting Ceremony: the Hogwarts exterior and the way into the Great Hall. Runs after logic.js and core.js, and reads their top-level names directly.

/* ================= strings ================= */
Object.assign(S, {
  title: ['Церемонія Розподілу', 'The Sorting Ceremony'],
  sub: ['Який твій факультет у Гоґвортсі?\nСортувальний Капелюх уже чекає на тебе.', 'Which Hogwarts house are you in?\nThe Sorting Hat is waiting for you.'],
  cta: ['Увійти до Великої зали', 'Enter the Great Hall'],
  castleA: ['Нічний замок над озером', 'A castle above a lake at night'],
  hatK: ['Капелюх', 'The Hat'],
  introH: ['Сідай. Я ще нікого не з’їв.', 'Sit. I haven’t eaten anyone yet.'],
  introI: ['Три запитання, і я знатиму.', 'Three questions, then I’ll know.'],
  bStart: ['Вдягти капелюха', 'Put the Hat on'],
  thinkH: ['Гм… Дай подумати.', 'Hmm… Let me think.'],
  doneK: ['Капелюх вирішив', 'The Hat has decided'],
  share: ['Поділитися', 'Share'],
  download: ['Завантажити картинку', 'Download image'],
  saveHold: ['Утримуй картинку, щоб зберегти її.', 'Press and hold the image to save it.'],
  invite: ['Капелюх вирішив. А куди потрапиш ти?', 'The Hat has decided. Where will you end up?'],
  wandIs: ['Твоя паличка: {w}', 'Your wand: {w}'],
  toShop: ['Ще немає палички? До крамниці', 'No wand yet? To the shop'],
  gLine: ['Тут спершу роблять, а потім думають, що це було.', 'Here people act first and work out what happened later.'],
  sLine: ['Тут знають, чого хочуть, і вже знають, як це дістати.', 'Here they know what they want, and how to get it.'],
  rLine: ['Тут запитання цікавіші за відповіді.', 'Here the questions are better than the answers.'],
  hLine: ['Тут тебе нагодують, вислухають і нікому не скажуть.', 'Here they’ll feed you, hear you out and tell no one.'],
  bAgain: ['Ще раз', 'Once more'],
});

const st = { phase: 'castle', cap: null, noteFn: null, input: 'pointer', questions: [], step: 0, answers: [], picking: false, wand: null, wandId: null, house: null, wish: null, avoid: null, avoiding: false, deciding: false };
const { POOL, WISH: HAT, SHARED } = SortingQuestions;
const pickLang = (ua, en) => lang === 'en' ? en : ua;

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
  const R = rng(61), VX = 500, VY = 390, BL = 268, BR = 732, BT = 190, BB = 560;
  // ---- far: night sky under the roof, back wall, two big windows, the tree between them
  let stars = ''; for (let i = 0; i < 90; i++) stars += `<circle cx="${(R() * 1400 - 200).toFixed(0)}" cy="${(R() * 300 - 120).toFixed(0)}" r="${(.5 + R() * 1.2).toFixed(1)}" fill="#e4eaff" opacity="${(.3 + R() * .6).toFixed(2)}"${R() < .15 ? ' class="tw"' : ''}/>`;
  let blocks = ''; for (let y = BT + 8; y < BB; y += 15) { const off = (y / 15 | 0) % 2 * 20; blocks += `<path d="M${BL} ${y}H${BR}" stroke="#1f140b" stroke-width="1" opacity=".3"/>`; for (let x = BL + off; x < BR; x += 40) blocks += `<path d="M${x} ${y}v15" stroke="#1f140b" stroke-width="1" opacity=".22"/>`; }
  const bigWindow = (x, w) => { const top = 212, bot = 512, r = w / 2, cx = x + r; let lead = ''; for (let i = 1; i < 4; i++) lead += `<path d="M${x + w * i / 4} ${top + 8}V${bot}" stroke="#0a0d1c" stroke-width="2.4"/>`; for (let y = top + r + 26; y < bot; y += 34) lead += `<path d="M${x} ${y}h${w}" stroke="#0a0d1c" stroke-width="1.6"/>`; lead += `<path d="M${x + 4} ${top + r}A${r - 4} ${r - 4} 0 0 1 ${x + w - 4} ${top + r}" fill="none" stroke="#0a0d1c" stroke-width="3"/><circle cx="${cx}" cy="${top + r * .62}" r="${r * .3}" fill="none" stroke="#0a0d1c" stroke-width="2.4"/>`; for (let i = 0; i < 22; i++) lead += `<circle cx="${(x + 6 + R() * (w - 12)).toFixed(0)}" cy="${(top + r * .5 + R() * (bot - top - r * .5)).toFixed(0)}" r="${(.8 + R() * 1.5).toFixed(1)}" fill="#f4f7ff" opacity=".75"/>`;
    return `<path d="M${x - 11} ${bot + 11}V${top + r}A${r + 11} ${r + 11} 0 0 1 ${x + w + 11} ${top + r}V${bot + 11}z" fill="#2b1d12"/><path d="M${x} ${bot}V${top + r}A${r} ${r} 0 0 1 ${x + w} ${top + r}V${bot}z" fill="url(#gHWin)"/>${lead}<rect x="${x - 14}" y="${bot + 6}" width="${w + 28}" height="8" fill="#dce4f4" opacity=".75"/>`; };
  let tree = `<ellipse cx="500" cy="395" rx="120" ry="200" fill="url(#gTreeGlow)"/><rect x="491" y="536" width="18" height="24" fill="#3a2212"/>`;
  for (let i = 0; i < 7; i++) { const t = 222 + i * 44, w = 19 + i * 13.5, h = 74; tree += `<polygon points="500,${t} ${500 - w},${t + h} ${500 + w},${t + h}" fill="url(#gTree)"/><polygon points="500,${t} ${500 - w * .44},${t + h * .55} ${500 - w * .1},${t + h * .4} ${500 + w * .1},${t + h * .58} ${500 + w * .4},${t + h * .42}" fill="#2c5a38" opacity=".55"/>`; }
  for (let i = 0; i < 74; i++) { const f = R(), y = 248 + f * 300, half = 12 + f * 94, x = 500 + (R() * 2 - 1) * half, c = R(); tree += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(1.4 + R() * 2.5).toFixed(1)}" fill="${c < .5 ? '#ffd787' : c < .75 ? '#d7543f' : '#f5ead0'}"${R() < .3 ? ' class="tw"' : ''}/>`; }
  for (let i = 0; i < 6; i++) { const y0 = 270 + i * 46, w = 20 + i * 15; tree += `<path d="M${500 - w} ${y0}Q500 ${y0 + 18} ${500 + w} ${y0 + 6}" fill="none" stroke="#e7c273" stroke-width="1.5" opacity=".65"/>`; }
  tree += `<polygon points="500,196 505,212 522,212 508,222 513,238 500,228 487,238 492,222 478,212 495,212" fill="#ffe08a"/>`;
  $('#svgHaBack').innerHTML = `<defs>
    <linearGradient id="gHSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050816"/><stop offset="1" stop-color="#15204a"/></linearGradient>
    <linearGradient id="gHBack" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b2a1b"/><stop offset=".55" stop-color="#7a5230"/><stop offset="1" stop-color="#a06c3a"/></linearGradient>
    <linearGradient id="gHWin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#101a44"/><stop offset=".65" stop-color="#27427e"/><stop offset="1" stop-color="#5b7bb4"/></linearGradient>
    <linearGradient id="gTree" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#173a26"/><stop offset="1" stop-color="#0c2418"/></linearGradient>
    <radialGradient id="gTreeGlow"><stop offset="0" stop-color="#ffd38c" stop-opacity=".46"/><stop offset="1" stop-color="#ffd38c" stop-opacity="0"/></radialGradient></defs>
    <rect x="-400" y="-400" width="1800" height="800" fill="url(#gHSky)"/>${stars}
    <rect x="${BL}" y="${BT}" width="${BR - BL}" height="${BB - BT}" fill="url(#gHBack)"/>${blocks}
    ${bigWindow(292, 132)}${bigWindow(576, 132)}${tree}`;

  // ---- middle: stone side walls, tall windows, fires, side trees, the wooden roof, floating candles
  const wall = side => {
    const m = x => side < 0 ? x : 1000 - x, X = t => BL - t * 620, Yt = t => BT - t * 560, Yb = t => BB + t * 620, pt = (t, f) => `${m(X(t)).toFixed(1)},${(Yt(t) + (Yb(t) - Yt(t)) * f).toFixed(1)}`;
    const quad = (a, b, f0, f1, fill, extra = '') => `<polygon points="${pt(a, f0)} ${pt(b, f0)} ${pt(b, f1)} ${pt(a, f1)}" fill="${fill}"${extra}/>`;
    let o = `<polygon points="${pt(0, 0)} ${pt(1, 0)} ${pt(1, 1)} ${pt(0, 1)}" fill="url(#gSide)"/>`;
    for (let f = .06; f < 1; f += .058) o += `<path d="M${pt(0, f)}L${pt(1, f)}" stroke="#1f140b" stroke-width="1.2" opacity=".28"/>`;
    for (let i = 0; i < 26; i++) { const t = R(), f = R(); o += `<path d="M${pt(t, f)}L${pt(t, f + .05)}" stroke="#1f140b" stroke-width="1" opacity=".22"/>`; }
    for (const [a, b] of [[.06, .17], [.26, .42], [.56, .8]]) {
      o += quad(a - .012, b + .012, .1, .72, '#2b1d12');
      o += quad(a, b, .13, .7, 'url(#gHWin)');
      const mid = (a + b) / 2; o += `<path d="M${pt(mid, .13)}L${pt(mid, .7)}" stroke="#0a0d1c" stroke-width="2.4"/>`; for (let f = .22; f < .7; f += .1) o += `<path d="M${pt(a, f)}L${pt(b, f)}" stroke="#0a0d1c" stroke-width="1.6"/>`;
      o += quad(a - .012, b + .012, .7, .72, '#dce4f4', ' opacity=".6"');
    }
    for (const t of [.21, .48]) {
      o += quad(t, t + .045, 0, 1, '#2a1a0d') + quad(t + .03, t + .045, 0, 1, '#120a05');
      const [fx, fy] = pt(t + .02, .44).split(',').map(Number), s = .55 + t * 1.6;
      o += `<ellipse cx="${fx}" cy="${fy}" rx="${70 * s}" ry="${80 * s}" fill="url(#gFire)"/><path d="M${fx - 15 * s} ${fy}h${30 * s}l-${6 * s} ${12 * s}h-${18 * s}z" fill="#20130a"/><path class="tw" d="M${fx - 12 * s} ${fy}q${2 * s} -${17 * s} ${7 * s} -${25 * s}q${1 * s} ${8 * s} ${5 * s} ${10 * s}q${3 * s} -${6 * s} ${1 * s} -${15 * s}q${10 * s} ${13 * s} ${11 * s} ${30 * s}z" fill="#ffb24c"/><path d="M${fx - 5 * s} ${fy}q${2 * s} -${8 * s} ${4 * s} -${11 * s}q${3 * s} ${5 * s} ${5 * s} ${11 * s}z" fill="#ffe7a8"/>`;
    }
    return o;
  };
  const sideTree = (x, y, h) => { let o = `<ellipse cx="${x}" cy="${y - h * .5}" rx="${h * .5}" ry="${h * .62}" fill="url(#gTreeGlow)"/><rect x="${x - h * .03}" y="${y - h * .08}" width="${h * .06}" height="${h * .08}" fill="#3a2212"/>`; for (let i = 0; i < 5; i++) { const t = y - h + i * h * .165, w = h * (.09 + i * .065); o += `<polygon points="${x},${t.toFixed(0)} ${(x - w).toFixed(0)},${(t + h * .26).toFixed(0)} ${(x + w).toFixed(0)},${(t + h * .26).toFixed(0)}" fill="url(#gTree)"/>`; } for (let i = 0; i < 26; i++) { const f = R(), yy = y - h * .9 + f * h * .8, half = h * (.03 + f * .27); o += `<circle cx="${(x + (R() * 2 - 1) * half).toFixed(0)}" cy="${yy.toFixed(0)}" r="${(1.2 + R() * 1.8).toFixed(1)}" fill="${R() < .6 ? '#ffd787' : '#d7543f'}"${R() < .3 ? ' class="tw"' : ''}/>`; } return o; };
  // the roof: wooden arches getting closer, joined by rafters that run towards the back wall
  let roof = ''; const arch = t => ({ hw: 232 + t * 620, sp: BT - t * 560 + (BB - BT + t * 1180) * .02, ap: 86 - t * 500 });
  for (let i = 0; i < 26; i++) { const a = -1.5 + i * .12, x0 = VX + Math.sin(a) * 232, y0 = 86 + (1 - Math.cos(a)) * 110, x1 = VX + Math.sin(a) * 980, y1 = -490 + (1 - Math.cos(a)) * 580; roof += `<path d="M${x0.toFixed(0)} ${y0.toFixed(0)}L${x1.toFixed(0)} ${y1.toFixed(0)}" stroke="#2c1a0c" stroke-width="${(3 + (i % 3 === 0 ? 3 : 0)).toFixed(0)}" opacity=".92"/>`; }
  for (const t of [.72, .48, .28, .12, 0]) { const { hw, sp, ap } = arch(t), w = 11 + t * 34, l = VX - hw, r = VX + hw, c = `M${l} ${sp + 40 + t * 70}Q${l + hw * .05} ${ap + 46} ${VX} ${ap}Q${r - hw * .05} ${ap + 46} ${r} ${sp + 40 + t * 70}`;
    roof += `<path d="${c}" fill="none" stroke="#1a0e06" stroke-width="${w * 1.5}"/><path d="${c}" fill="none" stroke="#4d2f16" stroke-width="${w}"/><path d="${c}" fill="none" stroke="#7a5128" stroke-width="${w * .22}" opacity=".85" transform="translate(0 ${(-w * .22).toFixed(1)})"/>`;
    for (const s of [-1, 1]) { const kx = VX + s * hw * .86, ky = ap + (sp - ap) * .66; roof += `<path d="M${kx.toFixed(0)} ${(ky - w).toFixed(0)}l${(s * w * .9).toFixed(0)} ${(w * 1.8).toFixed(0)}l${(-s * w * 1.1).toFixed(0)} ${(w * .55).toFixed(0)}z" fill="#6b4522"/>`; } }
  let can = ''; for (let i = 0; i < 52; i++) { const x = 40 + R() * 920, y = 80 + R() * 400, s = .55 + R() * 1; can += `<g${R() < .35 ? ' class="tw"' : ''}><circle cx="${x.toFixed(0)}" cy="${(y - 8 * s).toFixed(0)}" r="${(20 * s).toFixed(1)}" fill="url(#gCandle)"/><rect x="${(x - 1.7 * s).toFixed(1)}" y="${y.toFixed(0)}" width="${(3.4 * s).toFixed(1)}" height="${(17 * s).toFixed(1)}" fill="#f0e6cf"/><ellipse cx="${x.toFixed(0)}" cy="${(y - 3 * s).toFixed(1)}" rx="${(1.9 * s).toFixed(1)}" ry="${(4.2 * s).toFixed(1)}" fill="#ffd787"/></g>`; }
  $('#svgHaMid').innerHTML = `<defs><linearGradient id="gSide" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#20160e"/><stop offset=".5" stop-color="#6b4728"/><stop offset="1" stop-color="#8a5c31"/></linearGradient>
    <radialGradient id="gFire"><stop offset="0" stop-color="#ffb65f" stop-opacity=".6"/><stop offset="1" stop-color="#ffb65f" stop-opacity="0"/></radialGradient>
    <radialGradient id="gCandle"><stop offset="0" stop-color="#ffd38c" stop-opacity=".42"/><stop offset="1" stop-color="#ffd38c" stop-opacity="0"/></radialGradient></defs>
    ${wall(-1)}${wall(1)}${sideTree(210, 632, 220)}${sideTree(790, 632, 220)}${roof}${can}`;

  // ---- near: stone floor and four long tables running towards the back
  const quadP = (ax, bx, y0, y1, fill) => { const k = (x, y) => VX + (x - VX) * (y - VY) / (BB - VY); return `<polygon points="${ax},${y0} ${bx},${y0} ${k(bx, y1).toFixed(1)},${y1} ${k(ax, y1).toFixed(1)},${y1}" fill="${fill}"/>`; };
  let floor = `<polygon points="${BL},${BB} ${BR},${BB} ${BR + 800},${BB + 800} ${BL - 800},${BB + 800}" fill="url(#gFloor)"/>`; for (let i = 0; i <= 22; i++) { const x = BL + (BR - BL) * i / 22; floor += `<path d="M${x.toFixed(0)} ${BB}L${(VX + (x - VX) * 2.9).toFixed(0)} 1100" stroke="#1a110a" stroke-width="1" opacity=".35"/>`; } for (let y = BB + 8, d = 8; y < 1100; d *= 1.18, y += d) floor += `<path d="M${BL - (y - BB)} ${y.toFixed(0)}H${BR + (y - BB)}" stroke="#1a110a" stroke-width="1" opacity=".3"/>`;
  let tables = ''; for (const [a, b] of [[300, 342], [392, 434], [566, 608], [658, 700]]) {
    tables += quadP(a - 15, a - 4, BB + 1, 1080, '#1b0f07') + quadP(b + 4, b + 15, BB + 1, 1080, '#1b0f07') + quadP(a, b, BB, 1080, 'url(#gTable)');
    const k = (x, y) => VX + (x - VX) * (y - VY) / (BB - VY);
    for (let i = 0; i < 26; i++) { const f = R(), y = BB + 3 + f * f * 500, u = .15 + R() * .7, x = k(a + (b - a) * u, y), s = (y - VY) / (BB - VY); tables += R() < .55 ? `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${(4.4 * s).toFixed(1)}" ry="${(1.6 * s).toFixed(1)}" fill="#d7c39a" opacity=".85"/>` : `<g><ellipse cx="${x.toFixed(0)}" cy="${(y - 9 * s).toFixed(0)}" rx="${(11 * s).toFixed(1)}" ry="${(12 * s).toFixed(1)}" fill="url(#gTableGlow)"/><rect x="${(x - s).toFixed(1)}" y="${(y - 9 * s).toFixed(1)}" width="${(2 * s).toFixed(1)}" height="${(9 * s).toFixed(1)}" fill="#f0e6cf"/><circle cx="${x.toFixed(1)}" cy="${(y - 10 * s).toFixed(1)}" r="${(1.5 * s).toFixed(1)}" fill="#ffd787"/></g>`; }
  }
  $('#svgHaFront').innerHTML = `<defs><linearGradient id="gFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a4a2c"/><stop offset=".4" stop-color="#3a2a1b"/><stop offset="1" stop-color="#150e08"/></linearGradient>
    <radialGradient id="gTableGlow"><stop offset="0" stop-color="#ffd38c" stop-opacity=".4"/><stop offset="1" stop-color="#ffd38c" stop-opacity="0"/></radialGradient><linearGradient id="gTable" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a5a2c"/><stop offset=".3" stop-color="#5a3518"/><stop offset="1" stop-color="#2c170a"/></linearGradient></defs>${floor}${tables}`;
}

/* ================= the Hat ================= */
function buildHat() {
  const stitch = '#b8a57c', crease = '#000', rim = '#6d7288';
  $('#hat').innerHTML = `<svg viewBox="0 0 400 400"><defs>
    <linearGradient id="gHat" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4b4d5a"/><stop offset=".5" stop-color="#1e1f26"/><stop offset="1" stop-color="#08080b"/></linearGradient>
    <linearGradient id="gBrim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#34353f"/><stop offset="1" stop-color="#050507"/></linearGradient>
    <radialGradient id="gHatGlow"><stop offset="0" stop-color="#ffd9a0" stop-opacity=".55"/><stop offset=".55" stop-color="#ffc98a" stop-opacity=".2"/><stop offset="1" stop-color="#ffc98a" stop-opacity="0"/></radialGradient></defs>
    <ellipse cx="200" cy="205" rx="225" ry="225" fill="url(#gHatGlow)"/>
    <ellipse cx="200" cy="340" rx="182" ry="42" fill="url(#gBrim)"/><path d="M26 342q60 34 174 34t174-34" fill="none" stroke="#000" stroke-width="4"/><path d="M40 330q40-20 66-22M294 308q30 2 66 22" fill="none" stroke="${rim}" stroke-width="2.6" opacity=".75"/>
    <g id="hatBody"><path d="M88 332C104 262 128 206 150 150c7-18 24-40 52-46 14-3 36-2 50 4l26 136 28 84q-110 26-218 4z" fill="url(#gHat)"/><path d="M92 322C108 258 132 204 154 150c6-16 20-34 44-42" fill="none" stroke="${rim}" stroke-width="2.4" opacity=".8"/>
      <g id="hatTip"><path d="M150 152C164 94 196 62 244 44c20-8 44-8 62 2-16 2-30 12-34 24-3 12 4 24 2 38-2 12-14 20-26 22-34 6-68 12-98 22z" fill="url(#gHat)"/><path d="M156 142C170 94 200 68 246 50c16-6 34-7 48-3" fill="none" stroke="${rim}" stroke-width="2.2" opacity=".85"/><path d="M196 92q34-10 64 2M178 122q40-12 86-2" fill="none" stroke="${crease}" stroke-width="3.2" opacity=".8"/>
        <polygon points="236,66 262,58 268,84 242,92" fill="#2e2f38"/><path d="M236 66l3 3M244 63l2 4M254 60l2 4M262 58l-3 3M268 84l-3-3M242 92l2-4M252 90l1-4" stroke="${stitch}" stroke-width="1.6"/></g>
      <polygon points="112,288 158,276 170,316 118,326" fill="#2c2d35"/><path d="M112 288l5 3M122 285l3 4M134 282l3 4M146 279l3 4M158 276l-3 5M170 316l-4-3M155 319l-2-4M138 322l-2-4M118 326l3-4M114 306l4-1" stroke="${stitch}" stroke-width="1.8"/>
      <polygon points="242,246 284,240 292,288 248,294" fill="#34353f"/><path d="M242 246l4 4M254 244l2 4M270 241l2 4M284 240l-3 4M292 288l-4-3M270 291l-2-4M248 294l3-4M244 270l4 0M288 264l-4 0" stroke="${stitch}" stroke-width="1.8"/>
      <polygon points="176,136 212,126 220,158 184,168" fill="#2a2b33"/><path d="M176 136l4 3M190 132l2 4M204 128l2 4M212 126l-3 4M220 158l-4-3M202 163l-2-4M184 168l3-4" stroke="${stitch}" stroke-width="1.6"/>
      <path d="M124 262q40-22 76-12M104 310q44 6 84-4M226 216q24-14 48-6M214 318q30-4 60-16" fill="none" stroke="${crease}" stroke-width="3.6" opacity=".75"/>
      <g id="hatBrows"><path d="M146 186q24-20 48-4" fill="none" stroke="#000" stroke-width="8" stroke-linecap="round"/><path d="M146 190q24-20 48-4" fill="none" stroke="${rim}" stroke-width="2" stroke-linecap="round" opacity=".8"/><path d="M222 178q22-12 44 8" fill="none" stroke="#000" stroke-width="8" stroke-linecap="round"/><path d="M222 182q22-12 44 8" fill="none" stroke="${rim}" stroke-width="2" stroke-linecap="round" opacity=".8"/><path d="M158 204q14-8 28-2M232 198q14-6 26 2" fill="none" stroke="#000" stroke-width="5" stroke-linecap="round"/></g>
      <path id="hatMouth" d="M140 252q28 16 60 12t62-22q-8 22-30 32t-50 6q-24-6-42-28z" fill="#000"/><path d="M140 252q30 14 60 10t62-20" fill="none" stroke="${rim}" stroke-width="2.4" opacity=".85"/><path d="M146 262q24 26 56 22t52-34" fill="none" stroke="${rim}" stroke-width="1.6" opacity=".5"/>
    </g></svg>`;
}
// The tallest note this screen can show, measured on a hidden copy, so the Hat keeps one place while notes change.
const houseName = h => pickLang(HAT.houses[h][0], HAT.houses[h][1]);
const wishBtns = () => ['G', 'S', 'R', 'H'].map(h => ({ cls: 'ban' + (st.wish === h ? ' want' : '') + (st.avoid === h ? ' nope' : ''), html: `${Crests.svg(h)}<span>${houseName(h)}</span>`, fn: () => tapHouse(h) })).concat([
  { cls: 'wide', label: pickLang(...(st.wish ? HAT.yes.go : HAT.yes.skip)), fn: decide },
  { cls: 'wide', ghost: true, label: st.avoiding ? pickLang(...HAT.no.back) : pickLang(HAT.no.ua, HAT.no.en), fn: () => { st.avoiding = !st.avoiding; showWish(); } },
]);
function tallestNote() {
  const pool = POOL.slice().sort((a, b) => b.o.reduce((n, o) => n + pickLang(o.u, o.e).length, 0) - a.o.reduce((n, o) => n + pickLang(o.u, o.e).length, 0)).slice(0, 4);
  const c = note.cloneNode(true); c.style.visibility = 'hidden'; note.after(c); let max = 0;
  for (const q of pool) { c.querySelector('.hand').textContent = pickLang(q.ua, q.en); const b = c.querySelector('.nbtns'); b.className = 'nbtns eq'; b.innerHTML = q.o.map(o => `<button class="btn ghost">${pickLang(o.u, o.e)}</button>`).join(''); max = Math.max(max, c.offsetHeight); }
  { const b = c.querySelector('.nbtns'), inst = c.querySelector('.instr'); c.querySelector('.hand').textContent = pickLang(HAT.yes.ua, HAT.yes.en); inst.textContent = pickLang(...HAT.no.hint); b.className = 'nbtns eq wish'; b.innerHTML = wishBtns().map(x => `<button class="btn ${x.cls}${x.ghost ? ' ghost' : ''}">${x.html || x.label}</button>`).join(''); max = Math.max(max, c.offsetHeight); }
  c.remove(); return max;
}
function placeHat() {
  const h = $('#hat'); if ($('#hall').hidden) return;
  const barB = $('.topbar').getBoundingClientRect().bottom + 2, base = H - note.offsetHeight - note.offsetTop, line = tallestNote() + base + 6, room = H - line - barB;
  const size = Math.min(room, 340, W * .7);
  h.classList.toggle('none', size < 90); h.style.width = h.style.height = size + 'px'; h.style.marginLeft = -size / 2 + 'px'; h.style.bottom = line + 'px';
  $('#hallDim').style.setProperty('--hy', (H - line - size * .5) + 'px');
}
let talkT = 0;
function hatTalk(ms = 1200) { const h = $('#hat'); h.classList.add('talk'); clearTimeout(talkT); talkT = setTimeout(() => h.classList.remove('talk'), reduceMotion ? 0 : ms); if (A.on) noise(.05, { vol: .035, freq: 1500, q: .6 }); } // a soft tap of cloth, neutral: the low tones in core.js mean a wand said no

/* ================= the ceremony ================= */
function recall(key) { try { return JSON.parse(localStorage.getItem(key)); } catch (_) { return null; } }
function loadWand() { const w = recall('wand-last'), ok = w && w.traits && Date.now() - w.at < 864e5; st.wandId = ok ? w.id : null; return ok ? SortingLogic.wandImpression(w.traits) : null; }
function startCeremony() {
  st.phase = 'hall'; st.step = 0; st.answers = []; st.picking = false; st.house = null; st.wand = loadWand();
  const line = st.wand ? pick(HAT.wand) : null;
  setNote(() => ({ kicker: T('hatK'), hand: T('introH'), instr: line ? pickLang(line[0], line[1]) + ' ' + T('introI') : T('introI'), btns: [{ label: T('bStart'), fn: beginQuestions }] }));
  hatTalk();
}
function beginQuestions() {
  const seen = recall('hat-seen'), p = SortingLogic.pickQuestions(POOL, Array.isArray(seen) ? seen : []);
  try { localStorage.setItem('hat-seen', JSON.stringify(p.seen)); } catch (_) { }
  st.questions = p.questions.map(q => ({ ...q, o: SortingLogic.shuffled(q.o) })); st.step = 0; st.answers = []; st.house = null; st.wish = st.avoid = null; st.avoiding = st.deciding = false; ask();
}
function ask() {
  const q = st.questions[st.step]; st.picking = true;
  setNote(() => ({ kicker: T('hatK'), hand: pickLang(q.ua, q.en), btns: q.o.map(o => ({ label: pickLang(o.u, o.e), ghost: true, fn: () => answer(q, o) })) }));
  hatTalk(900);
}
async function answer(q, o) {
  if (!st.picking) return; st.picking = false; st.answers.push(o.w);
  const r = o.r || pick(Math.random() < .85 ? q.r : SHARED); // a few lines answer one option only
  setNote(() => ({ kicker: T('hatK'), hand: pickLang(r[0], r[1]) })); hatTalk(1000);
  await wait(1900);
  if (++st.step < st.questions.length) return ask();
  showWish(true);
}
function showWish(first) {
  setNote(() => ({ kicker: T('hatK'), hand: pickLang(HAT.yes.ua, HAT.yes.en), instr: st.avoiding ? pickLang(...HAT.no.hint) : '', cls: 'wish', btns: wishBtns() }), !first);
  if (first) hatTalk(900);
}
function tapHouse(h) {
  if (st.avoiding) { st.avoid = st.avoid === h ? null : h; if (st.wish === h) st.wish = null; }
  else { st.wish = st.wish === h ? null : h; if (st.avoid === h) st.avoid = null; }
  showWish();
}
async function decide() {
  if (st.deciding) return; st.deciding = true;
  const open = !st.wish && !st.avoid, first = open ? pick(HAT.decide) : null;
  setNote(() => ({ kicker: T('hatK'), hand: first ? pickLang(first[0], first[1]) : T('thinkH') })); hatTalk(1400);
  await wait(reduceMotion ? 500 : 2000);
  const build = pick(HAT.build); setNote(() => ({ kicker: T('hatK'), hand: pickLang(build[0], build[1]) })); hatTalk(1300);
  await wait(reduceMotion ? 500 : 1800);
  st.house = SortingLogic.sortHouse({ answers: st.answers, wand: st.wand, wish: st.wish, avoid: st.avoid });
  const said = st.wish ? (st.house === st.wish ? HAT.got : HAT.denied) : st.avoid ? (st.house === st.avoid ? HAT.overruled : HAT.avoided) : null, line = said ? pick(said) : null;
  setNote(() => ({ kicker: T('doneK'), hand: houseName(st.house) + '!', instr: line ? pickLang(line[0], line[1]) : '' }));
  hatTalk(1500); if (A.on) SFX.reveal();
  postRow('sorting_results', { house: st.house, wish: st.wish, unwanted: st.avoid, wand_prior: !!st.wand, device_type: deviceType(), language: lang });
  await wait(reduceMotion ? 1200 : 2600);
  showCard();
}

/* ================= result card ================= */
function fillCard() {
  const h = st.house; if (!h) return;
  $('#rKicker').textContent = T('doneK'); $('#rName').textContent = houseName(h); $('#rLore').textContent = T(h.toLowerCase() + 'Line');
  $('#rStage').innerHTML = Crests.svg(h, houseName(h));
  const w = st.wandId && WANDS.find(x => x.id === st.wandId), sp = $('#rSpecs'), to = $('#rToShop');
  sp.hidden = !w; if (w) sp.textContent = T('wandIs', { w: L(w.name) }); to.hidden = !!w; to.textContent = T('toShop');
  $('#bShare').textContent = T('share'); $('#bDown').textContent = T('download'); $('#bAgain').textContent = T('bAgain'); $('#rSavedCap').textContent = T('saveHold');
  refreshCard();
}
function showCard() {
  fillCard(); setShareMode(canShareFiles());
  const res = $('#result'); res.hidden = false; res.scrollTop = 0; note.classList.remove('show'); st.noteFn = null;
  requestAnimationFrame(() => res.classList.add('show'));
}
$('#bAgain').addEventListener('click', () => {
  $('.topbar').classList.remove('away'); const res = $('#result'); res.classList.remove('show'); setTimeout(() => { res.hidden = true; }, 700);
  $('#rSaved').hidden = true; setTimeout(beginQuestions, 500);
});
const cardFileName = () => lang === 'en' ? 'my-house.png' : 'miy-fakultet.png';
async function makeCard() {
  try { await document.fonts.ready; } catch (_) { }
  const h = st.house, CW = 1080, CH = 1350, c = document.createElement('canvas'); c.width = CW; c.height = CH; const x = c.getContext('2d');
  cardFrame(x, CW, CH);
  x.textAlign = 'center'; x.fillStyle = '#c79a55'; x.font = `700 34px ${serif}`; x.fillText(T('doneK').toUpperCase().split('').join(' '), CW / 2, 170);
  const tg = x.createLinearGradient(0, 190, 0, 330); tg.addColorStop(0, '#fff2cc'); tg.addColorStop(1, '#c9944a'); x.fillStyle = tg; x.font = `700 92px ${serif}`; x.fillText(houseName(h), CW / 2, 290);
  const img = new Image(); img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(Crests.svg(h)); await img.decode(); x.drawImage(img, CW / 2 - 240, 335, 480, 524);
  x.fillStyle = '#ecdcb8'; x.font = `italic 500 44px ${serif}`; let y = wrapText(x, T(h.toLowerCase() + 'Line'), CW / 2, 880, 860, 56);
  const w = st.wandId && WANDS.find(v => v.id === st.wandId); if (w) { x.fillStyle = '#d6c3a0'; x.font = `500 36px ${serif}`; wrapText(x, T('wandIs', { w: L(w.name) }), CW / 2, y + 26, 860, 46); }
  cardHost(x, CW);
  return new Promise(r => c.toBlob(r, 'image/png'));
}

/* ================= language ================= */
function applyLang() {
  document.documentElement.lang = lang === 'en' ? 'en' : 'uk'; document.title = T('title'); $('#castle').setAttribute('aria-label', T('castleA'));
  $('#stT').textContent = T('title'); $('#stS').textContent = T('sub'); $('#cta').textContent = T('cta'); $('#stFan').textContent = T('fan');
  document.querySelectorAll('#lang button').forEach(b => b.classList.toggle('on', b.dataset.l === lang));
  sndBtn.setAttribute('aria-label', T(A.on ? 'sndOff' : 'sndOn'));
  setViewBoxes();
  if (st.noteFn) renderNote();
  placeHat();
  if (!$('#result').hidden) fillCard();
}
document.querySelectorAll('#lang button').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); lang = b.dataset.l; try { localStorage.setItem('wand-lang', lang); } catch (_) { } applyLang(); }));

/* ================= into the hall ================= */
async function enterHall() {
  if (st.phase !== 'castle') return; st.phase = 'entering';
  // Browsers allow sound only after a tap, so the entry tap is what starts it.
  if (A.on) { audioInit(); if (A.ctx && A.ctx.state === 'suspended') A.ctx.resume(); SFX.bell(); }
  $('#cta').style.opacity = 0; $('#stFan').style.opacity = 0; $('#stTitle').style.opacity = 0; $('#stTitle').style.transform = 'translateY(-20px)';
  const wr = $('#hallHit').getBoundingClientRect(), cx = wr.left + wr.width / 2, cy = wr.top + wr.height / 2;
  const out = ['caSky', 'caFar', 'caMain', 'caFg'].map(id => layers[id]), inn = ['haBack', 'haMid', 'haFront'];
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
  // the snow keeps falling inside
  $('#haMid').after($('#snowBack')); $('#haFront').after($('#snowFront')); $('#haFront').after($('#hallDim')); $('#hallDim').after($('#snowFront')); $('#snowFront').after($('#hat'));
  $('#castle').hidden = true; hall.style.opacity = 1; placeHat();
  void $('#hat').offsetWidth; $('#hat').classList.add('in'); $('#hallDim').classList.add('in');
  await run(reduceMotion ? 400 : 1300, t => { const e = easeOut(t); if (!reduceMotion) inn.forEach((id, i) => { layers[id].s = 1 + (.3 + i * .1) * (1 - e); }); fl.style.opacity = 1 - easeOut(clamp(t / .75)); });
  startCeremony();
}
const castle = $('#castle');
dragDepth(castle);
castle.addEventListener('click', () => { if (touch.moved) { touch.moved = false; return; } });
$('#cta').addEventListener('click', e => { e.stopPropagation(); enterHall(); });

/* ================= boot ================= */
function onResize() { W = innerWidth; H = innerHeight; MIN = Math.min(W, H); setViewBoxes(); initSnow(); placeHat(); }
let resizeT = 0; addEventListener('resize', () => { clearTimeout(resizeT); resizeT = setTimeout(onResize, 120); });
buildSky(); buildFar(); buildMain(); buildFg(); buildHat(); setViewBoxes(); initSnow(); applyLang();
function frame(t) {
  requestAnimationFrame(frame); // first, so an error in one frame can't stop the page
  now = t; updatePar(t);
  $('#hat').style.translate = `${(-par.x * MIN * .035).toFixed(1)}px ${(-par.y * MIN * .022).toFixed(1)}px`;
  if (st.phase === 'castle') drawSnow(t); else if ($('#castle').hidden) drawSnow(t, .75);
}
requestAnimationFrame(frame);
