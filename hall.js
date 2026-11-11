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

const st = { phase: 'castle', cap: null, noteFn: null, input: 'pointer', questions: [], step: 0, answers: [], picking: false, wand: null, wandId: null, house: null, wish: null, avoid: null, avoiding: false, deciding: false, take: 1 };
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
  // quiet presences: a figure under a long veil that falls in folds and thins out to nothing, with no face
  const ghost = (x, y, s, k) => `<g transform="translate(${x} ${y}) scale(${s})"><g class="spirit g${k}"><ellipse cx="2" cy="52" rx="46" ry="70" fill="url(#gGhost)" opacity=".26"/><path d="M0-6C-7-6-10 2-10 10C-11 18-22 22-25 34C-30 58-36 86-47 114Q-22 122 0 115Q26 124 56 117C42 88 31 58 25 34C22 22 11 18 10 10C10 2 7-6 0-6Z" fill="url(#gShade)"/><ellipse cx="0" cy="5" rx="7.4" ry="9.2" fill="#f4f8ff" opacity=".2"/><path d="M-5 13C-7 42-15 82-26 114M3 14C4 46 9 84 16 116M-15 28C-19 56-27 88-38 112M15 28C20 58 31 90 44 114M-1 40C-2 66-3 92-5 114" fill="none" stroke="url(#gShade)" stroke-width="1.3" stroke-linecap="round" opacity=".55"/></g></g>`;
  const ghosts = ghost(352, 300, 1.25, 1) + ghost(676, 262, 1, 2) + ghost(150, 360, .9, 3) + ghost(860, 380, .85, 4);
  $('#svgHaMid').innerHTML = `<defs><radialGradient id="gGhost" cx=".5" cy=".3" r=".8"><stop offset="0" stop-color="#f4f8ff" stop-opacity=".62"/><stop offset=".7" stop-color="#cfdcff" stop-opacity=".22"/><stop offset="1" stop-color="#cfdcff" stop-opacity="0"/></radialGradient><linearGradient id="gShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f8ff" stop-opacity=".58"/><stop offset=".55" stop-color="#cfdcff" stop-opacity=".26"/><stop offset="1" stop-color="#cfdcff" stop-opacity="0"/></linearGradient><linearGradient id="gSide" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#20160e"/><stop offset=".5" stop-color="#6b4728"/><stop offset="1" stop-color="#8a5c31"/></linearGradient>
    <radialGradient id="gFire"><stop offset="0" stop-color="#ffb65f" stop-opacity=".6"/><stop offset="1" stop-color="#ffb65f" stop-opacity="0"/></radialGradient>
    <radialGradient id="gCandle"><stop offset="0" stop-color="#ffd38c" stop-opacity=".42"/><stop offset="1" stop-color="#ffd38c" stop-opacity="0"/></radialGradient></defs>
    ${wall(-1)}${wall(1)}${sideTree(210, 632, 220)}${sideTree(790, 632, 220)}${roof}${ghosts}${can}`;

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
      <g id="browL" class="brow"><path d="M146 186q24-20 48-4" fill="none" stroke="#000" stroke-width="8" stroke-linecap="round"/><path d="M146 190q24-20 48-4" fill="none" stroke="${rim}" stroke-width="2" stroke-linecap="round" opacity=".8"/></g><g id="browR" class="brow"><path d="M222 178q22-12 44 8" fill="none" stroke="#000" stroke-width="8" stroke-linecap="round"/><path d="M222 182q22-12 44 8" fill="none" stroke="${rim}" stroke-width="2" stroke-linecap="round" opacity=".8"/></g>
      <g id="eyeL" class="eye"><g id="pupL"><path d="M155 208q17-14 34 0q-17 11-34 0z" fill="#000"/></g></g>
      <g id="eyeR" class="eye"><g id="pupR"><path d="M228 202q17-13 34 0q-17 10-34 0z" fill="#000"/></g></g>
      <path id="hatMouth" d="M140 252q28 16 60 12t62-22q-8 22-30 32t-50 6q-24-6-42-28z" fill="#000"/><path d="M140 252q30 14 60 10t62-20" fill="none" stroke="${rim}" stroke-width="2.4" opacity=".85"/><path d="M146 262q24 26 56 22t52-34" fill="none" stroke="${rim}" stroke-width="1.6" opacity=".5"/>
    </g></svg>`;
}
// The tallest note this screen can show, measured on a hidden copy, so the Hat keeps one place while notes change.
const houseName = h => pickLang(HAT.houses[h][0], HAT.houses[h][1]);
const wishBtns = () => ['G', 'S', 'R', 'H'].map(h => ({ cls: 'ban' + (st.wish === h ? ' want' : '') + (st.avoid === h ? ' nope' : ''), html: `${Crests.svg(h)}<span>${houseName(h)}</span>`, fn: () => tapHouse(h) })).concat([
  { cls: 'wide', label: pickLang(...(st.wish ? HAT.yes.go : HAT.yes.skip)), fn: decide },
  { cls: 'wide', ghost: true, label: st.avoiding ? pickLang(...HAT.no.back) : pickLang(HAT.no.ua, HAT.no.en), fn: () => { st.avoiding = !st.avoiding; showWish(); if (st.avoiding) say('unwant', 900); } },
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
  h.classList.toggle('none', size < 90); h.style.width = h.style.height = size + 'px'; h.style.marginLeft = -size / 2 + 'px'; h.style.bottom = line + 'px'; sizeHat3D(size);
  $('#hallDim').style.setProperty('--hy', (H - line - size * .5) + 'px');
}
let talkT = 0;
function hatTalk(ms = 1200, tap = true, mood = null) { const h = $('#hat'); h.classList.remove('raise', 'furrow'); if (mood) h.classList.add(mood); clearTimeout(talkT); talkT = setTimeout(() => h.classList.remove('raise', 'furrow'), ms + 300); if (A.on && tap) noise(.05, { vol: .035, freq: 1500, q: .6 }); } // a soft tap of cloth, neutral: the low tones in core.js mean a wand said no

/* ================= the Hat's face ================= */
// Eyes follow the pointer or the option under it and come back to the player; random blinks; brows by the line's mood; the mouth by the words, or by the voice's level.
const FACE = { tx: 0, ty: 0, x: 0, y: 0, moved: -1e9, focus: null, blinkAt: 0, open: 0, level: null, mouth: { open: 0, wide: 0, pucker: 0 }, lips: false, last: 0 };
addEventListener('pointermove', e => { FACE.mx = e.clientX; FACE.my = e.clientY; FACE.moved = now; }, { passive: true });
const focusOn = el => { if (SWIPE.aim) return; const b = el && el.closest && el.closest('#nBtns button'); if (b) { const r = b.getBoundingClientRect(); FACE.focus = { x: r.left + r.width / 2, y: r.top + r.height / 2, at: now }; } };
addEventListener('pointerover', e => focusOn(e.target)); addEventListener('focusin', e => focusOn(e.target));
// Which way the brows go for a line: up for questions and surprises, down while thinking.
const moodOf = id => /^(think|build|any1$|w5r2|t3r2)/.test(id) ? 'furrow' : /^(any3|any4|denied|overruled|house|wish|unwant|[tsw]\d+$|s4r1|w3rat|s7forget)/.test(id) ? 'raise' : null;
function faceTick(t) {
  const h = $('#hat'); if ($('#hall').hidden || !h.classList.contains('in')) return;
  const hb = h.getBoundingClientRect(), ex = hb.left + hb.width * .52, ey = hb.top + hb.height * .51;
  let gx = 0, gy = .35; // looking at the player
  if (SWIPE.aim && FACE.focus) FACE.focus.at = t; // keeps looking for as long as the finger holds the option
  const f = FACE.focus && t - FACE.focus.at < 1600 ? FACE.focus : t - FACE.moved < 1400 ? { x: FACE.mx, y: FACE.my } : null;
  if (f) { gx = clamp((f.x - ex) / (W * .35), -1, 1); gy = clamp((f.y - ey) / (H * .35), -1, 1); }
  if (PONDER.on) { if (t > PONDER.next) lookAround(t); gx = PONDER.x; gy = PONDER.y; orbitCrests(t); }
  FACE.x += (gx - FACE.x) * .14; FACE.y += (gy - FACE.y) * .14;
  const tr = `translate(${(FACE.x * 4.6).toFixed(2)} ${(FACE.y * 2.6).toFixed(2)})`; $('#pupL').setAttribute('transform', tr); $('#pupR').setAttribute('transform', tr);
  if (t > FACE.blinkAt) { if (FACE.blinkAt) { h.classList.add('blink'); setTimeout(() => h.classList.remove('blink'), 130); } FACE.blinkAt = t + (Math.random() < .15 ? 260 : 2400 + Math.random() * 4200); }
  // the mouth opens with the voice's loudness and rests closed when there's no voice
  // Bytes, not floats: every browser fills them. If the level stays silent while a line plays, the mouth moves on its own.
  let target = 0, rms = 0; if (FACE.level && VOICE.src && VOICE.playing) { FACE.level.getByteTimeDomainData(FACE.buf); let sum = 0; for (const v of FACE.buf) sum += ((v - 128) / 128) ** 2; rms = Math.sqrt(sum / FACE.buf.length); if (rms > .004) FACE.heard = t; target = t - (FACE.heard || 0) < 400 ? Math.min(1.25, rms * 9) : .45 + .4 * Math.sin(t / 70) * Math.sin(t / 113); }
  if (PONDER.on && !VOICE.playing && !reduceMotion) target = .1 + .09 * Math.sin(t / 95) * Math.sin(t / 151); // mumbling to itself between the lines
  const dt = Math.min(100, t - (FACE.last || t)); FACE.last = t;
  FACE.lips = !!(VOICE.lips && VOICE.src && VOICE.playing && A.ctx);
  if (FACE.lips) lipsTick(dt, t - (FACE.heard || 0) < 400 ? rms : 0); else { FACE.open += (target - FACE.open) * (target > FACE.open ? .55 : .25); FACE.mouth.open = FACE.open / 2; }
  $('#hatMouth').style.transform = `scaleY(${(.32 + FACE.open).toFixed(3)})`;
  tickHat3D(t, h);
}
// The mouth by the words: the line's keyframes (audio/hat/<id>.lips.json, from scripts/align-hat.mjs) read at the voice's own clock, a little ahead,
// because lips move before the sound is heard. The voice's level only makes the shape bigger or smaller.
const LIPS_LEAD = .05;
function lipsTick(dt, rms) {
  const c = A.ctx, at = c.currentTime - VOICE.t0 - (c.outputLatency || c.baseLatency || 0) + LIPS_LEAD, k = VOICE.lips.k;
  let i = 0; while (i + 1 < k.length && k[i + 1][0] <= at) i++;
  const to = Hat3D.MOUTH[at < 0 ? 'X' : k[i][1]] || Hat3D.MOUTH.X, loud = rms ? clamp(.55 + rms * 4.5, .7, 1.2) : 1, m = FACE.mouth;
  for (const n of ['open', 'wide', 'pucker']) { const goal = (to[n] || 0) * (n === 'open' ? loud : 1); m[n] += (goal - m[n]) * (1 - Math.exp(-dt / (goal > m[n] ? 38 : 50))); }
  FACE.open = m.open * 2; // the drawn Hat opens by the same amount
}
// Leans a little toward the option the player picked, until the next question.
function leanTo(o) { const b = [...document.querySelectorAll('#nBtns button')].find(x => x.textContent === pickLang(o.u, o.e)), h = $('#hat'); if (!b || reduceMotion) return; const r = b.getBoundingClientRect(), hb = h.getBoundingClientRect(); h.style.rotate = clamp((r.left + r.width / 2 - (hb.left + hb.width / 2)) / W * 22, -7, 7).toFixed(1) + 'deg'; }

/* ================= answering by swipe ================= */
// Press anywhere and slide toward an option: it lights up and the Hat looks at it. Letting go picks it; sliding back or away picks nothing. A tap on a button works as before.
// Works on the questions and the four banners. The other buttons of the wish screen are tap only.
const SWIPE = { id: null, x: 0, y: 0, from: null, moved: false, aim: null, swallow: 0 };
const SWIPE_MIN = 22, SWIPE_CONE = .4; // px before a slide counts; cosine of how far off the slide's direction an option may lie
const swipeItems = () => st.phase !== 'hall' || st.deciding ? [] : [...document.querySelectorAll(st.picking ? '#nBtns button' : '#nBtns.wish .ban')];
function setAim(b) {
  if (b !== SWIPE.aim) { if (SWIPE.aim) SWIPE.aim.classList.remove('aim'); SWIPE.aim = b; if (b) b.classList.add('aim'); else FACE.focus = null; }
  if (b) { const r = b.getBoundingClientRect(); FACE.focus = { x: r.left + r.width / 2, y: r.top + r.height / 2, at: now }; }
}
// The option nearest the finger, among those in the slide's direction. Measured to the nearest edge of each button, so a wide button counts right above the finger, not only at its centre.
function aimAt(x, y) {
  const dx = x - SWIPE.x, dy = y - SWIPE.y, d = Math.hypot(dx, dy); if (d < SWIPE_MIN) return setAim(null);
  let best = null, bestD = Infinity;
  for (const b of swipeItems()) {
    if (b === SWIPE.from) continue; // a slide that starts on an option means another one
    const r = b.getBoundingClientRect(), qx = clamp(x, r.left, r.right), qy = clamp(y, r.top, r.bottom), vx = qx - SWIPE.x, vy = qy - SWIPE.y;
    if ((dx * vx + dy * vy) / (d * (Math.hypot(vx, vy) || 1)) < SWIPE_CONE) continue;
    const dist = Math.hypot(x - qx, y - qy) - (b === SWIPE.aim ? 10 : 0); if (dist < bestD) { bestD = dist; best = b; } // the small bonus stops the light flickering between neighbours
  }
  setAim(best);
}
function endSwipe(e, pick) {
  if (e.pointerId !== SWIPE.id) return; SWIPE.id = null; const b = SWIPE.aim, f = FACE.focus; setAim(null); if (!SWIPE.moved) return;
  SWIPE.swallow = performance.now() + 400; if (pick && b && b.isConnected) { FACE.focus = f; b.click(); } // the eyes stay on the picked option
}
addEventListener('pointerdown', e => {
  SWIPE.swallow = 0; if (!e.isPrimary || e.button) return; setAim(null); SWIPE.id = null;
  if (e.target.closest('.topbar, a, #result') || !swipeItems().length) return;
  SWIPE.id = e.pointerId; SWIPE.x = e.clientX; SWIPE.y = e.clientY; SWIPE.from = e.target.closest('#nBtns button'); SWIPE.moved = false;
});
addEventListener('pointermove', e => { if (e.pointerId !== SWIPE.id || (!SWIPE.moved && Math.hypot(e.clientX - SWIPE.x, e.clientY - SWIPE.y) < SWIPE_MIN)) return; SWIPE.moved = true; aimAt(e.clientX, e.clientY); }, { passive: true });
addEventListener('pointerup', e => endSwipe(e, true)); addEventListener('pointercancel', e => endSwipe(e, false));
addEventListener('click', e => { if (e.isTrusted && performance.now() < SWIPE.swallow) { SWIPE.swallow = 0; e.stopPropagation(); e.preventDefault(); } }, true); // the browser's own click after a slide isn't a tap

/* ================= the Hat in 3D ================= */
// three.js and the model load in the background once the page has settled. The drawn Hat stays underneath: it remains if WebGL or the CDN fails, on Save-Data, or if the phone can't keep up.
// The face follows the same signals as the drawing, so everything that moves the drawn Hat moves this one.
const HAT3D_URL = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js';
const H3 = { api: null, on: false, canvas: null, px: 0, ratio: 2, last: 0, frames: [], yaw: 0, pitch: 0, pose: { blink: 0, browUp: 0, furrow: 0, open: 0, pucker: 0, wide: 0, smile: .1, lookX: 0, lookY: 0, droop: 0, perk: 0 } };
function sizeHat3D(px) { px = Math.round(px); if (H3.api && px && px !== H3.px) { H3.px = px; H3.api.size(px); } }
async function loadHat3D() {
  try {
    if (!window.WebGLRenderingContext || (navigator.connection && navigator.connection.saveData)) return;
    const THREE = await withTimeout(import(HAT3D_URL), 15000), c = document.createElement('canvas'); c.id = 'hat3d'; c.setAttribute('aria-hidden', 'true');
    H3.api = await Hat3D.create(THREE, c); H3.canvas = c; c.addEventListener('webglcontextlost', dropHat3D);
    const h = $('#hat'); h.appendChild(c); H3.ratio = Math.min(2, devicePixelRatio || 1); sizeHat3D(parseFloat(h.style.width) || 300); H3.api.set(H3.pose); H3.api.render(); H3.on = true; h.classList.add('d3');
  } catch (_) { H3.api = null; }
}
function dropHat3D() { H3.on = false; $('#hat').classList.remove('d3'); const a = H3.api, c = H3.canvas; H3.api = null; setTimeout(() => { try { a && a.dispose(); } catch (_) { } if (c) c.remove(); }, 600); }
// Rounder lips for low sounds (о, у), wider for bright ones (е, и), read from the voice itself.
function vowel() {
  if (!FACE.level || !VOICE.playing) return 0; if (!FACE.bins) FACE.bins = new Uint8Array(FACE.level.frequencyBinCount); FACE.level.getByteFrequencyData(FACE.bins);
  let low = 0, high = 0; for (let i = 2; i < 60; i++) { if (i < 13) low += FACE.bins[i]; else high += FACE.bins[i]; } low /= 11; high /= 47; return low + high < 12 ? 0 : clamp((low / (low + high) - .52) / .12, 0, 1); // the range measured on the Hat's recordings
}
function tickHat3D(t, h) {
  if (!H3.on || $('#result').classList.contains('show')) return;
  const p = H3.pose, c = h.classList, ease = (k, to, r = .16) => { p[k] += (to - p[k]) * r; }, brow = (k, to) => ease(k, to, to > p[k] ? .14 : .03), ponder = c.contains('ponder'), crowned = c.contains('crowned'), raise = c.contains('raise');
  ease('blink', c.contains('blink') ? 1 : 0, .55); brow('browUp', crowned ? 1 : raise ? .85 : 0); brow('furrow', ponder ? 1 : c.contains('furrow') ? .7 : 0); ease('smile', crowned ? .42 : raise ? .2 : .1, .07); // the brows rise quickly and settle slowly, so they don't drop when a line ends
  ease('perk', crowned ? 1 : 0, .07); ease('droop', ponder ? .85 : reduceMotion ? 0 : .12 * Math.sin(t / 1500), .08);
  if (FACE.lips) { p.open = FACE.mouth.open; p.wide = FACE.mouth.wide; p.pucker = FACE.mouth.pucker; } else { p.open = Math.min(.6, FACE.open * .5); ease('pucker', vowel(), .25); ease('wide', 0, .25); } p.lookX = FACE.x; p.lookY = (.35 - FACE.y) * .9;
  const yaw = reduceMotion ? 0 : FACE.x * .24 + .05 * Math.sin(t / 2300), pitch = reduceMotion ? 0 : (FACE.y - .35) * .07; H3.yaw += (yaw - H3.yaw) * .08; H3.pitch += (pitch - H3.pitch) * .08;
  H3.api.set(p); H3.api.turn(H3.yaw, H3.pitch); H3.api.render();
  // A phone that can't keep up: first fewer pixels, then the drawn Hat.
  if (H3.last && t - H3.last < 250) H3.frames.push(t - H3.last); H3.last = t;
  if (H3.frames.length >= 60) { const mid = H3.frames.sort((a, b) => a - b)[30]; H3.frames.length = 0; if (mid > 38) { if (H3.ratio > 1) { H3.ratio = 1; H3.api.ratio(1); H3.px = 0; sizeHat3D(parseFloat(h.style.width)); } else dropHat3D(); } }
}

/* ================= the Hat's voice ================= */
// Recordings in /audio/hat (English) and /audio/hat/ua (Ukrainian), named by the ids in scripts/hat-lines-short.md. The Hat speaks the page's language; a switch mid-game applies from the next line.
// The voice plays through the page's sound, so the sound button mutes it. Without sound, or if a file is slow, the Hat stays silent and the game goes on.
// Each line may have its mouth keyframes next to it (<id>.lips.json). Without them the mouth follows the voice's level as before.
const VOICE = { files: new Map(), buffers: new Map(), lipsFiles: new Map(), src: null, n: 0, chain: null, played: [], lips: null, t0: 0 };
const LIPS_LANGS = ['en', 'ua']; // the voices that have .lips.json, from scripts/align-hat.mjs
const voiceUrl = id => `/audio/hat/${lang === 'ua' ? 'ua/' : ''}${id}.mp3`, lipsUrl = id => voiceUrl(id).replace(/\.mp3$/, '.lips.json');
const readLips = k => fetch(k).then(r => r.ok ? r.json() : null).then(j => j && Array.isArray(j.k) && j.k.length ? j : null).catch(() => null);
function prefetch(ids) { if (A.on) ids.forEach(id => { const k = voiceUrl(id), l = lipsUrl(id); if (!VOICE.files.has(k)) VOICE.files.set(k, fetch(k).then(r => r.ok ? r.arrayBuffer() : null).catch(() => null)); if (!VOICE.lipsFiles.has(l)) VOICE.lipsFiles.set(l, LIPS_LANGS.includes(lang) ? readLips(l) : Promise.resolve(null)); }); }
const lipsFor = id => { prefetch([id]); return Promise.race([VOICE.lipsFiles.get(lipsUrl(id)) || null, wait(800).then(() => null)]); };
function stopVoice() { VOICE.n++; VOICE.playing = false; VOICE.lips = null; if (VOICE.src) { try { VOICE.src.stop(); } catch (_) { } VOICE.src = null; } }
async function voiceBuffer(id) {
  const k = voiceUrl(id); if (VOICE.buffers.has(k)) return VOICE.buffers.get(k);
  prefetch([id]); const raw = await Promise.race([VOICE.files.get(k), wait(800).then(() => null)]); // a line that isn't there in time is skipped
  if (!raw || !A.ctx) return null;
  try { const b = await A.ctx.decodeAudioData(raw.slice(0)); VOICE.buffers.set(k, b); return b; } catch (_) { return null; }
}
// Says one line and resolves when it ends. Text-only timing when there's no voice.
async function say(id, fallback = 1200, chained = false) {
  if (!chained) VOICE.chain = null; stopVoice(); const n = VOICE.n;
  const [b, lips] = A.on && A.ctx ? await Promise.all([voiceBuffer(id), lipsFor(id)]) : [null, null];
  if (n !== VOICE.n) return; // another line started meanwhile
  if (!b) { hatTalk(fallback, true, moodOf(id)); return; }
  if (!FACE.level) { FACE.level = A.ctx.createAnalyser(); FACE.level.fftSize = 512; FACE.buf = new Uint8Array(FACE.level.fftSize); FACE.level.connect(A.master); } // in the chain, not a side branch: some browsers leave an unconnected analyser silent
  const src = A.ctx.createBufferSource(), g = A.ctx.createGain(); g.gain.value = 2.2; src.buffer = b; src.connect(g); g.connect(FACE.level); src.start(); VOICE.src = src; VOICE.playing = true; VOICE.lips = lips; VOICE.t0 = A.ctx.currentTime; FACE.heard = now; VOICE.played.push((lang === 'ua' ? 'ua/' : '') + id); if (VOICE.ended) (VOICE.gaps = VOICE.gaps || []).push(performance.now() - VOICE.ended);
  hatTalk(b.duration * 1000, false, moodOf(id));
  await new Promise(r => { src.onended = r; setTimeout(r, b.duration * 1000 + 400); }); if (VOICE.src === src) VOICE.playing = false; VOICE.ended = n === VOICE.n ? performance.now() : 0; // 0: cut short by the next line
}
const GAP = 750; // a breath between lines, so they don't run together
const sayAll = async ids => { const me = {}; VOICE.chain = me; for (const [i, id] of ids.entries()) { if (VOICE.chain !== me) return; if (i) await wait(GAP); if (VOICE.chain !== me) return; await say(id, 1200, true); } }; // stops if anything else is said
// Says a line, then the pause after it. The step also lasts at least `min`, as it did before the voice.
const sayStep = (id, fallback, min) => Promise.all([wait(min), say(id, fallback).then(() => wait(GAP))]);
// The verdicts and build-up lines have three recordings each. In Ukrainian the owner picked one take per house name.
const UA_HOUSE_TAKE = { G: 3, H: 2, R: 3, S: 3 };
const take = id => { const h = /^house([GSRH])$/.exec(id); return `${id}-${h && lang === 'ua' ? UA_HOUSE_TAKE[h[1]] : st.take}`; };
sndBtn.addEventListener('click', () => { if (!A.on) stopVoice(); });

/* ================= the Hat decides ================= */
// While it thinks: brows down, eyes searching, the tip drooping, and the four crests circling it and flaring in turn, slower and slower. They go out before the verdict, so they give nothing away.
// When it has decided: it rises, a golden glow opens behind it and magic dust spirals up around it. Reduced motion: no flaring, no searching, no rise, no dust; the glow only fades in.
const PONDER = { on: false, next: 0, x: 0, y: -.8, run: null, up: 0, rise: 0 };
const LOOKS = [[-.85, -.8], [.85, -.8], [-1, .1], [1, .1], [0, -1], [.5, -.9], [-.5, -.9]];
function lookAround(t) {
  PONDER.next = t + 420 + Math.random() * 480; if (reduceMotion) return;
  const l = LOOKS[Math.floor(Math.random() * LOOKS.length)]; PONDER.x = l[0]; PONDER.y = l[1]; $('#hat').style.rotate = (l[0] * 3.5).toFixed(1) + 'deg';
}
const hatSpot = () => { const h = $('#hat'); return { size: parseFloat(h.style.width) || 0, bottom: parseFloat(h.style.bottom) || 0 }; };
function startPonder() {
  const h = $('#hat'); h.style.rotate = '0deg'; h.classList.add('ponder'); PONDER.on = true; PONDER.next = 0; PONDER.x = 0; PONDER.y = -.8;
  const box = $('#hatCrests'), me = PONDER.run = {}; PONDER.orbit = null; if (reduceMotion || h.classList.contains('none')) return;
  const { size, bottom } = hatSpot(), c = Math.round(clamp(size * .3, 52, 96)), tall = c * 1.09, cy = H - bottom - size * .48, barB = $('.topbar').getBoundingClientRect().bottom;
  box.innerHTML = SortingLogic.shuffled(['G', 'S', 'R', 'H']).map(house => `<div class="crest" style="width:${c}px">${Crests.svg(house)}</div>`).join('');
  const all = [...box.children];
  PONDER.orbit = { all, c, tall, cy, a: Math.random() * 6.283, t0: 0, last: 0, rx: Math.min(size * .66, W / 2 - c / 2 - 5), ry: Math.max(0, Math.min(size * .66, cy - barB - tall / 2 - 4, note.getBoundingClientRect().top - 8 - tall / 2 - cy)) };
  placeCrests(); requestAnimationFrame(() => box.classList.add('on'));
  let i = 0, gap = 150;
  const flare = () => { if (PONDER.run !== me) return; all.forEach(x => x.classList.remove('lit')); all[i++ % 4].classList.add('lit'); gap = Math.min(560, gap * 1.1); setTimeout(flare, gap); };
  flare();
}
// The crests circle behind the Hat, so they never cover its face, fast at first and then settling.
function placeCrests() { const o = PONDER.orbit; o.all.forEach((e, i) => { const a = o.a + i * Math.PI / 2; e.style.translate = `${(W / 2 + Math.cos(a) * o.rx - o.c / 2).toFixed(1)}px ${(o.cy + Math.sin(a) * o.ry - o.tall / 2).toFixed(1)}px`; }); }
function orbitCrests(t) { const o = PONDER.orbit; if (!o) return; if (!o.last) o.last = o.t0 = t; const dt = Math.min(50, t - o.last) / 1000; o.last = t; o.a += (.8 + 1.9 * Math.exp(-(t - o.t0) / 2000)) * dt; placeCrests(); }
function stopPonder() { PONDER.on = false; PONDER.run = null; PONDER.orbit = null; const h = $('#hat'); h.classList.remove('ponder'); h.style.rotate = '0deg'; const box = $('#hatCrests'); box.classList.remove('on'); [...box.children].forEach(x => x.classList.remove('lit')); }
function crownHat() {
  const h = $('#hat'), a = $('#hatAura'); if (h.classList.contains('none')) return;
  const { size, bottom } = hatSpot(), barB = $('.topbar').getBoundingClientRect().bottom, up = reduceMotion ? 0 : Math.round(clamp(H - bottom - size - barB, 0, Math.min(72, H * .09)));
  PONDER.up = up; h.classList.add('crowned');
  const w = size * 2.1; a.style.width = a.style.height = w + 'px'; a.style.marginLeft = -w / 2 + 'px'; a.style.bottom = bottom + up + size / 2 - w / 2 + 'px';
  if (!a.children.length) a.innerHTML = '<div class="glow"></div>';
  requestAnimationFrame(() => a.classList.add('on')); if (!reduceMotion) startDust(size, bottom, up);
}
function uncrownHat() { $('#hat').classList.remove('crowned'); PONDER.up = 0; $('#hatAura').classList.remove('on'); endDust(); }
// Magic dust climbing around the Hat in two spirals, from the brim to above the tip. Dust on the far side is drawn behind the Hat, on the near side in front of it.
const DUST = { on: false, raf: 0, stop: 0 };
function dustSprite() { const s = document.createElement('canvas'); s.width = s.height = 32; const x = s.getContext('2d'), g = x.createRadialGradient(16, 16, 0, 16, 16, 16); g.addColorStop(0, 'rgba(255,244,210,1)'); g.addColorStop(.28, 'rgba(255,214,130,.85)'); g.addColorStop(1, 'rgba(255,190,90,0)'); x.fillStyle = g; x.fillRect(0, 0, 32, 32); return s; }
function startDust(size, bottom, up) {
  clearTimeout(DUST.stop); const w = Math.min(W, size * 2.2), h = size * 1.75, ratio = Math.min(2, devicePixelRatio || 1), back = $('#dustBack'), front = $('#dustFront');
  for (const c of [back, front]) { c.width = w * ratio; c.height = h * ratio; c.style.width = w + 'px'; c.style.height = h + 'px'; c.style.left = (W - w) / 2 + 'px'; c.style.bottom = bottom + up - size * .25 + 'px'; c.classList.add('on'); c.getContext('2d').setTransform(ratio, 0, 0, ratio, 0, 0); c.getContext('2d').globalCompositeOperation = 'lighter'; }
  Object.assign(DUST, { on: true, w, h, size, up, t0: 0, bx: back.getContext('2d'), fx: front.getContext('2d'), sprite: DUST.sprite || dustSprite(), parts: Array.from({ length: W < 768 ? 130 : 180 }, (_, i) => ({ strand: i % 2 * Math.PI, off: Math.random(), speed: .26 + Math.random() * .1, jit: (Math.random() - .5) * size * .09, spin: (Math.random() - .5) * .5, r: 2.4 + Math.random() * 4.2, tw: 3 + Math.random() * 7, ph: Math.random() * 6.283 })) });
  cancelAnimationFrame(DUST.raf); DUST.raf = requestAnimationFrame(dustFrame);
}
function dustFrame(t) {
  if (!DUST.on) return; DUST.raf = requestAnimationFrame(dustFrame); if (!DUST.t0) DUST.t0 = t;
  const { w, h, size, up, bx, fx, parts, sprite } = DUST, age = (t - DUST.t0) / 1000, base = h - size * .25 + up - PONDER.rise, cx = w / 2, reached = Math.min(1, age / 1.15); // the spiral climbs up from the brim as it appears
  bx.clearRect(0, 0, w, h); fx.clearRect(0, 0, w, h);
  for (const p of parts) {
    const u = (age * p.speed + p.off) % 1; if (u > reached) continue;
    const r = size * (.58 - .4 * u) + p.jit, th = p.strand + p.spin + u * 10 + age * .9, depth = Math.sin(th), near = (depth + 1) / 2;
    const alpha = Math.min(1, u * 7) * Math.min(1, (1 - u) * 4) * (.42 + .58 * near) * (.62 + .38 * Math.sin(age * p.tw + p.ph)), s = p.r * (.7 + .4 * near), c = depth > 0 ? fx : bx;
    c.globalAlpha = alpha; c.drawImage(sprite, cx + Math.cos(th) * r - s, base - u * size * 1.22 + depth * r * .16 - s, s * 2, s * 2);
  }
}
function endDust() { $('#dustBack').classList.remove('on'); $('#dustFront').classList.remove('on'); clearTimeout(DUST.stop); DUST.stop = setTimeout(() => { DUST.on = false; cancelAnimationFrame(DUST.raf); }, 800); }

/* ================= the ceremony ================= */
function recall(key) { try { return JSON.parse(localStorage.getItem(key)); } catch (_) { return null; } }
function loadWand() { const w = recall('wand-last'), ok = w && w.traits && Date.now() - w.at < 864e5; st.wandId = ok ? w.id : null; return ok ? SortingLogic.wandImpression(w.traits) : null; }
function startCeremony() {
  st.phase = 'hall'; st.step = 0; st.answers = []; st.picking = false; st.house = null; st.wand = loadWand();
  const wi = st.wand ? Math.floor(Math.random() * HAT.wand.length) : -1, line = wi >= 0 ? HAT.wand[wi] : null, ids = ['introH', ...(line ? ['wand' + (wi + 1)] : []), 'introI'];
  setNote(() => ({ kicker: T('hatK'), hand: T('introH'), instr: line ? pickLang(line[0], line[1]) + ' ' + T('introI') : T('introI'), btns: [{ label: T('bStart'), fn: beginQuestions }, ...(typeof headPossible === 'function' && headPossible() ? [{ label: T('bHead'), ghost: true, fn: () => startHead() }] : [])] })); // head mode lives in head.js
  prefetch(ids); sayAll(ids);
}
function beginQuestions() {
  const seen = recall('hat-seen'), p = SortingLogic.pickQuestions(POOL, Array.isArray(seen) ? seen : []);
  try { localStorage.setItem('hat-seen', JSON.stringify(p.seen)); } catch (_) { }
  st.questions = p.questions.map(q => ({ ...q, o: SortingLogic.shuffled(q.o) })); st.step = 0; st.answers = []; st.house = null; st.wish = st.avoid = null; st.avoiding = st.deciding = false;
  st.take = 1 + Math.floor(Math.random() * 3);
  prefetch([...st.questions.flatMap(q => [q.id, q.id + 'r1', q.id + 'r2', ...q.o.filter(o => o.r).map(o => o.r[2])]), 'wish', 'unwant', 'think', 'decide1', ...HAT.build.map((_, i) => take('build' + (i + 1))), ...'GSRH'.split('').map(h => take('house' + h)), 'got2', 'denied1', 'denied2', 'denied3', 'avoided1', 'overruled1']);
  ask();
}
function ask() {
  const q = st.questions[st.step]; st.picking = true; $('#hat').style.rotate = '0deg';
  setNote(() => ({ kicker: T('hatK'), hand: pickLang(q.ua, q.en), btns: q.o.map(o => ({ label: pickLang(o.u, o.e), ghost: true, fn: () => answer(q, o) })) }));
  say(q.id, 900);
}
async function answer(q, o) {
  if (!st.picking) return; st.picking = false; st.answers.push(o.w); leanTo(o);
  let r, id; // a few lines answer one option only
  if (o.r) { r = o.r; id = o.r[2]; } else if (Math.random() < .85) { const i = Math.floor(Math.random() * q.r.length); r = q.r[i]; id = q.id + 'r' + (i + 1); } else { const i = Math.floor(Math.random() * SHARED.length); r = SHARED[i]; id = 'any' + (i + 1); }
  setNote(() => ({ kicker: T('hatK'), hand: pickLang(r[0], r[1]) }));
  await sayStep(id, 1000, 1900);
  if (++st.step < st.questions.length) return ask();
  $('#hat').style.rotate = '0deg'; showWish(true);
}
function showWish(first) {
  setNote(() => ({ kicker: T('hatK'), hand: pickLang(HAT.yes.ua, HAT.yes.en), instr: st.avoiding ? pickLang(...HAT.no.hint) : '', cls: 'wish', btns: wishBtns() }), !first);
  if (first) say('wish', 900);
}
function tapHouse(h) {
  if (st.avoiding) { st.avoid = st.avoid === h ? null : h; if (st.wish === h) st.wish = null; }
  else { st.wish = st.wish === h ? null : h; if (st.avoid === h) st.avoid = null; }
  showWish();
}
async function decide() {
  if (st.deciding) return; st.deciding = true; if (typeof headDone === 'function') headDone(); // the answers are in: the camera goes off
  const open = !st.wish && !st.avoid, first = open ? pick(HAT.decide) : null;
  setNote(() => ({ kicker: T('hatK'), hand: first ? pickLang(first[0], first[1]) : T('thinkH') })); startPonder();
  await sayStep(first ? 'decide1' : 'think', 1400, reduceMotion ? 500 : 2000);
  const bi = Math.floor(Math.random() * HAT.build.length), build = HAT.build[bi]; setNote(() => ({ kicker: T('hatK'), hand: pickLang(build[0], build[1]) }));
  await sayStep(take('build' + (bi + 1)), 1300, reduceMotion ? 500 : 1800);
  st.house = SortingLogic.sortHouse({ answers: st.answers, wand: st.wand, wish: st.wish, avoid: st.avoid });
  const kind = st.wish ? (st.house === st.wish ? 'got' : 'denied') : st.avoid ? (st.house === st.avoid ? 'overruled' : 'avoided') : null, li = kind === 'got' ? 1 : kind ? Math.floor(Math.random() * HAT[kind].length) : -1, line = kind ? HAT[kind][li] : null; // a granted wish always hears «Ти просиш. І це в тобі є»
  stopPonder();
  postRow('sorting_results', { house: st.house, wish: st.wish, unwanted: st.avoid, wand_prior: !!st.wand, device_type: deviceType(), language: lang });
  // The Hat's line about the wish if there is one, a held breath, then the house as it rises in gold with the chime, then the card.
  if (line) { setNote(() => ({ kicker: T('hatK'), hand: pickLang(line[0], line[1]) })); await Promise.all([wait(reduceMotion ? 800 : 1300), say(kind + (li + 1), 1200)]); await wait(reduceMotion ? 250 : GAP + 200); }
  setNote(() => ({ kicker: T('doneK'), hand: houseName(st.house) + '!' })); crownHat(); if (A.on && A.ctx) SFX.reveal();
  await Promise.all([wait(reduceMotion ? 1200 : 2100), say(take('house' + st.house), 1500).then(() => wait(450))]);
  showCard();
}

/* ================= result card ================= */
function fillCard() {
  const h = st.house; if (!h) return;
  $('#rKicker').textContent = T('doneK'); $('#rName').textContent = houseName(h); $('#rLore').textContent = T(h.toLowerCase() + 'Line');
  // A medal you can turn: the live crest in front, a darker copy behind and a few layers between for the edge.
  const flat = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(Crests.svg(h, houseName(h)));
  $('#rSeal').innerHTML = `<div class="coin"><div class="face front">${Crests.svg(h, houseName(h), true)}</div>${[1, 2, 3, 4, 5].map(i => `<img class="face edge" style="transform:translateZ(${-i * 1.6}px)" src="${flat}" alt="">`).join('')}<img class="face back" src="${flat}" alt=""></div>`;
  applyCoin();
  const w = st.wandId && WANDS.find(x => x.id === st.wandId), sp = $('#rSpecs'), to = $('#rToShop');
  sp.hidden = !w; if (w) sp.textContent = T('wandIs', { w: L(w.name) }); to.hidden = !!w; to.textContent = T('toShop');

  $('#bShare').textContent = T('share'); $('#bDown').textContent = T('download'); $('#bAgain').textContent = T('bAgain'); $('#rSavedCap').textContent = T('saveHold');
  refreshCard();
}
// The card opens after the verdict. The chime has already played, with the rising dust.
function showCard() {
  endDust(); fillCard(); setShareMode(canShareFiles());
  const res = $('#result'), seal = $('#rSeal'), card = $('.rcard'); res.hidden = false; res.scrollTop = 0; note.classList.remove('show'); st.noteFn = null;
  seal.classList.remove('stamp', 'fade'); card.classList.remove('thud');
  requestAnimationFrame(() => {
    res.classList.add('show');
    stampSeal(seal, card);
  });
}
// The emblem drops onto the card like a wax seal: a squash on impact, a small shake and a soft thud. Reduced motion: it just fades in.
function stampSeal(seal, card, landed = () => { }) {
  if (reduceMotion) { seal.classList.add('fade'); setTimeout(landed, 400); return; }
  setTimeout(() => {
    seal.classList.add('stamp');
    setTimeout(() => { card.classList.add('thud'); if (A.on && A.ctx) { tone(82, .3, { vol: .16, glide: 46 }); noise(.16, { vol: .09, freq: 320, q: .5 }); } setTimeout(() => card.classList.remove('thud'), 360); setTimeout(() => turnCoin(), 500); landed(); }, 420);
  }, 380);
}
$('#bAgain').addEventListener('click', () => {
  stopVoice(); uncrownHat(); COIN.turn = 0; $('.topbar').classList.remove('away'); const res = $('#result'); res.classList.remove('show'); setTimeout(() => { res.hidden = true; }, 700);
  $('#rSaved').hidden = true; setTimeout(() => typeof HEAD !== 'undefined' && HEAD.wanted && headPossible() ? startHead(true) : beginQuestions(), 500); // a head-mode game asks for the camera again, with no practice
});
// Turning the crest: one slow turn after the stamp, then drag to spin it, with a little momentum. It stops drawing when still.
const COIN = { yaw: 0, pitch: 0, vy: 0, drag: null, turn: 0, raf: 0, last: 0 };
const TURN_MS = 2600;
function applyCoin() { const c = $('#rSeal .coin'); if (!c) return; const extra = COIN.turn ? easeIO(Math.min(1, COIN.turn / TURN_MS)) * 360 : 0; c.style.transform = `rotateX(${COIN.pitch.toFixed(2)}deg) rotateY(${(COIN.yaw + extra).toFixed(2)}deg)`; }
function coinTick(t) {
  COIN.raf = 0; const dt = Math.min(50, t - (COIN.last || t)); COIN.last = t;
  if (COIN.turn) { COIN.turn += dt; if (COIN.turn >= TURN_MS) { COIN.turn = 0; COIN.yaw += 360; } }
  if (!COIN.drag) { COIN.yaw += COIN.vy * dt; COIN.vy *= Math.pow(.91, dt / 16); if (Math.abs(COIN.vy) < .002) COIN.vy = 0; COIN.pitch *= Math.pow(.9, dt / 16); if (Math.abs(COIN.pitch) < .05) COIN.pitch = 0; }
  applyCoin();
  if (COIN.turn || COIN.drag || COIN.vy || COIN.pitch) COIN.raf = requestAnimationFrame(coinTick);
}
const wakeCoin = () => { if (!COIN.raf) { COIN.last = 0; COIN.raf = requestAnimationFrame(coinTick); } };
function turnCoin() { if (reduceMotion) return; COIN.turn = 1e-6; wakeCoin(); }
{ const s = $('#rSeal');
  s.addEventListener('pointerdown', e => { COIN.drag = { x: e.clientX, y: e.clientY, t: performance.now() }; if (COIN.turn) { COIN.yaw += easeIO(Math.min(1, COIN.turn / TURN_MS)) * 360; COIN.turn = 0; } COIN.vy = 0; try { s.setPointerCapture(e.pointerId); } catch (_) { } wakeCoin(); });
  s.addEventListener('pointermove', e => { const d = COIN.drag; if (!d) return; const now = performance.now(), dx = e.clientX - d.x; COIN.yaw += dx * .6; COIN.pitch = clamp(COIN.pitch - (e.clientY - d.y) * .3, -25, 25); COIN.vy = dx * .6 / Math.max(8, now - d.t); COIN.drag = { x: e.clientX, y: e.clientY, t: now }; });
  const up = () => { COIN.drag = null; wakeCoin(); }; s.addEventListener('pointerup', up); s.addEventListener('pointercancel', up); }
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
  $('#haMid').after($('#snowBack')); $('#haFront').after($('#snowFront')); $('#haFront').after($('#hallDim')); $('#hallDim').after($('#snowFront')); $('#snowFront').after($('#hatAura'), $('#hatCrests'), $('#dustBack'), $('#hat'), $('#dustFront'));
  $('#castle').hidden = true; hall.style.opacity = 1; placeHat();
  await run(reduceMotion ? 400 : 1300, t => { const e = easeOut(t); if (!reduceMotion) inn.forEach((id, i) => { layers[id].s = 1 + (.3 + i * .1) * (1 - e); }); fl.style.opacity = 1 - easeOut(clamp(t / .75)); });
  await establish(inn);
  $('#hallDim').classList.add('in'); await wait(reduceMotion ? 150 : 550); void $('#hat').offsetWidth; $('#hat').classList.add('in');
  startCeremony();
}
// A clear look at the Hall before the Hat: a slow push-in for about a second. A tap or a key skips it.
async function establish(inn) {
  st.phase = 'establish'; let skip; const skipped = new Promise(r => { skip = r; });
  const end = () => skip(); addEventListener('pointerdown', end, { once: true }); addEventListener('keydown', end, { once: true });
  const hold = reduceMotion ? 400 : 900, t0 = performance.now(); let going = true;
  if (!reduceMotion) { const step = () => { if (!going) return; const k = easeIO(clamp((performance.now() - t0) / hold)); inn.forEach((id, i) => { layers[id].s = 1 + (.04 + i * .025) * k; }); requestAnimationFrame(step); }; step(); }
  await Promise.race([wait(hold), skipped]); going = false;
  removeEventListener('pointerdown', end); removeEventListener('keydown', end);
}
const castle = $('#castle');
dragDepth(castle);
castle.addEventListener('click', () => { if (touch.moved) { touch.moved = false; return; } });
$('#cta').addEventListener('click', e => { e.stopPropagation(); enterHall(); });

/* ================= boot ================= */
function onResize() { W = innerWidth; H = innerHeight; MIN = Math.min(W, H); setViewBoxes(); initSnow(); placeHat(); }
let resizeT = 0; addEventListener('resize', () => { clearTimeout(resizeT); resizeT = setTimeout(onResize, 120); });
buildSky(); buildFar(); buildMain(); buildFg(); buildHat(); setViewBoxes(); initSnow(); applyLang(); setTimeout(loadHat3D, 1200);
function frame(t) {
  requestAnimationFrame(frame); // first, so an error in one frame can't stop the page
  now = t; updatePar(t); faceTick(t);
  PONDER.rise += (PONDER.up - PONDER.rise) * .06; // eased here, because this line sets the Hat's position every frame
  $('#hat').style.translate = `${(-par.x * MIN * .035).toFixed(1)}px ${(-par.y * MIN * .022 - PONDER.rise).toFixed(1)}px`;
  if (st.phase === 'castle') drawSnow(t); else if ($('#castle').hidden) drawSnow(t, .75);
}
requestAnimationFrame(frame);
