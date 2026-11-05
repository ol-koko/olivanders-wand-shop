'use strict';
// The wand shop. Runs after logic.js and core.js, and reads their top-level names directly.

/* ================= strings ================= */
Object.assign(S, {
  title: ['Крамниця Олівандера', 'Ollivanders'],
  streetA: ['Зимова вулиця перед крамницею', 'A winter street in front of the shop'],
  shopA: ['Крамниця паличок', 'The wand shop'],
  sub: ['Серед тисяч паличок одна чекає саме на тебе', 'Among thousands of wands, one is waiting just for you.'],
  cta: ['Знайти свою паличку', 'Find your wand'],
  sign1: ['ОЛІВАНДЕР', 'OLLIVANDERS'],
  sign2: ['чарівні палички · з 382 р. до н. е.', 'makers of fine wands · since 382 B.C.'],
  shopK: ['Крамниця Олівандера', 'Ollivanders'],
  introH: ['Паличка обирає чарівника. Не навпаки.', 'The wand chooses the wizard. Not the other way round.'],
  introI: ['Я даватиму палички, а ти змахуй. Як чаклуватимеш?', 'I’ll hand you wands, you wave them. How would you like to cast?'],
  bCam: ['Рукою, через камеру', 'With my hand, on camera'],
  bDraw: ['Пальцем або мишкою', 'Finger or mouse'],
  camLoadH: ['Вмикаю камеру…', 'Starting the camera…'],
  camLoadI: ['Дозволь доступ до камери. Відео не записується й лишається на твоєму пристрої.', 'Please allow camera access. Video isn’t recorded and stays on your device.'],
  camFailH: ['Дзеркало сьогодні вередує.', 'The mirror is being stubborn today.'],
  camDenied: ['Доступ до камери заборонено. Нічого страшного — чаклуймо пальцем або мишкою.', 'Camera access was denied. No problem — let’s cast with a finger or mouse.'],
  camNone: ['Камери не знайдено — чаклуймо пальцем або мишкою.', 'No camera found — let’s cast with a finger or mouse.'],
  camBusy: ['Камеру зайняла інша програма — чаклуймо пальцем або мишкою.', 'Another app is using the camera — let’s cast with a finger or mouse.'],
  camInsecure: ['Камера працює лише через захищене з’єднання (https) — чаклуймо пальцем або мишкою.', 'The camera needs a secure (https) connection — let’s cast with a finger or mouse.'],
  camUnsupported: ['Цей браузер не дає доступу до камери — чаклуймо пальцем або мишкою.', 'This browser doesn’t allow camera access — let’s cast with a finger or mouse.'],
  camTimeout: ['Камера запускається надто довго — чаклуймо пальцем або мишкою.', 'The camera is taking too long to start — let’s cast with a finger or mouse.'],
  camAuto: ['Не вдалося побачити змах. Чаклуй далі пальцем або мишкою.', 'I couldn’t catch a wave. Carry on with a finger or mouse.'],
  hintHand: ['Не бачу руки. Підніми її вище й додай світла.', 'I can’t see your hand. Raise it higher and add some light.'],
  hintWave: ['Махни ширше й швидше.', 'Wave wider and faster.'],
  inAppHint: ['Камера працює у звичайному браузері: відкрий посилання там, якщо хочеш чаклувати рукою.', 'The camera works in a regular browser: open the link there to cast with your hand.'],
  camLoadFail: ['Не вдалося завантажити розпізнавання руки — чаклуймо пальцем або мишкою.', 'Hand tracking couldn’t load — let’s cast with a finger or mouse.'],
  camSlow: ['Інтернет повільний, ще завантажую. Можна не чекати.', 'Slow connection, still loading. You don’t have to wait.'],
  camLost: ['Камера вимкнулась. Чаклуй далі пальцем або мишкою.', 'The camera stopped. Carry on with a finger or mouse.'],
  bInstead: ['Краще пальцем або мишкою', 'Use finger or mouse instead'],
  bGo: ['Продовжити', 'Continue'],
  noHand: ['Покажи руку в рамці.', 'Show your hand in the frame.'],
  handSeen: ['Бачу руку. Змахни!', 'I see your hand. Wave!'],
  warmK: ['Перший змах', 'First wave'],
  warmH: ['Спершу просто змахни.', 'First, just wave.'],
  warmIdraw: ['Проведи пальцем або мишкою по екрану.', 'Draw across the screen with your finger or mouse.'],
  warmIcam: ['Помахай рукою перед камерою.', 'Wave your hand in front of the camera.'],
  warmDone: ['Цікава рука. Зараз щось підберемо.', 'An interesting hand. Let’s find you something.'],
  ollK: ['Олівандер', 'Ollivander'],
  tooShort: ['Надто коротко. Змахни ширше.', 'Too short. Wave wider.'],
  rKicker: ['Паличка обрала тебе', 'The wand has chosen you'],
  rare: ['рідкісний вибір', 'a rare choice'],
  share: ['Поділитися', 'Share'],
  download: ['Завантажити картинку', 'Download image'],
  saveHold: ['Утримуй картинку, щоб зберегти її.', 'Press and hold the image to save it.'],
  again: ['Спробувати ще раз', 'Try again'],
  invite: ['Паличка обрала мене. А яка обере тебе?', 'The wand chose me — which one will choose you?'],
  cardK: ['Паличка обрала мене', 'The wand chose me'],
});
const OFFER = [
  { ua: 'Спробуймо цю.', en: 'Let’s try this one.' },
  { ua: 'Гм… а як щодо цієї?', en: 'Hmm… how about this one?' },
  { ua: 'Ось. Ні, стривай — ось ця.', en: 'Here. No, wait — this one.' },
  { ua: 'Цю я давно відкладав для когось особливого.', en: 'I’ve been saving this one for someone special.' },
  { ua: 'А тепер — ця. Обережно, вона з характером.', en: 'Now this one. Careful, it has a temper.' },
  { ua: 'Мені здається, ця тебе вже помітила.', en: 'I believe this one has already noticed you.' },
  { ua: 'Не поспішаймо. Ось, візьми.', en: 'No rush. Here, take it.' }
];
const FAIL = {
  fizzle: [{ ua: 'Майже… майже…', en: 'Almost… almost…' }, { ua: 'Вона завагалася. Але ні — не твоя.', en: 'It hesitated. But no — not yours.' }],
  drop: [{ ua: 'Ох. Вона просто… випала.', en: 'Oh. It simply… fell out.' }, { ua: 'Палички, які не хочуть залишатися, кажуть про це чесно.', en: 'Wands that don’t want to stay say so honestly.' }],
  fly: [{ ua: 'Обережно!', en: 'Careful!' }, { ua: 'Вона явно хотіла втекти. Наступна.', en: 'It clearly wanted to escape. Next.' }],
  crack: [{ ua: 'Тріснула!', en: 'It cracked!' }, { ua: 'Не хвилюйся — вона давно на це напрошувалася.', en: 'Don’t worry — it’s been asking for it for years.' }],
  avalanche: [{ ua: 'Ні-ні-ні. Точно не ця.', en: 'No, no, no. Definitely not.' }, { ua: 'Палички бувають дуже… відверті.', en: 'Wands can be very… frank.' }],
  blackout: [{ ua: 'Хто вимкнув світло?', en: 'Who turned off the lights?' }, { ua: 'Це вона. Однозначно ні.', en: 'That was the wand. Definitely not.' }],
  bubbles: [{ ua: 'Бульбашки?', en: 'Bubbles?' }, { ua: 'Мило. Але ні.', en: 'Charming. But no.' }],
  butterflies: [{ ua: 'Метелики…', en: 'Butterflies…' }, { ua: 'Гарно, але це компліменти, а не відповідь.', en: 'Lovely — but that’s flattery, not an answer.' }],
  snow: [{ ua: 'Ну ось, тепер у мене в крамниці зима.', en: 'Well, now it’s winter inside my shop.' }, { ua: 'Цю — назад на полицю.', en: 'This one goes back on the shelf.' }],
  smoke: [{ ua: 'Кхе-кхе…', en: 'Cough, cough…' }, { ua: 'Ні. Хтось, відчиніть вікно.', en: 'No. Somebody open a window.' }]
};
const WIN = [
  [{ ua: 'Цікаво… дуже цікаво.', en: 'Curious… very curious.' }, { ua: 'Паличка зробила вибір.', en: 'The wand has made its choice.' }],
  [{ ua: 'Ось вона. Відчуваєш тепло?', en: 'There it is. Do you feel the warmth?' }, { ua: 'Паличка тебе впізнала.', en: 'The wand has recognised you.' }],
  [{ ua: 'Браво! Так, так, саме так!', en: 'Bravo! Yes, yes, exactly so!' }, { ua: 'Ви знайшли одне одного.', en: 'You two have found each other.' }]
];

/* ================= traits & wands ================= */
// How the wave line describes each trait, high and low.

/* ================= state ================= */
const st = {
  phase: 'street', input: 'pointer', obs: [], traits: null, tried: [], attempt: 0, lastReacts: [], usedOffers: [],
  cap: null, stroke: null, wand: null, winner: null, history: [],
  flameOut: 0, flareUntil: 0, windUntil: 0, wind: [0, 0], replay: null, halo: null, dark: 0, darkT: 0, frost: 0, frostT: 0,
  lean: 0, vx: 0, trails: [], sparks: [], falling: [], bubbles: [], flies: [], puffs: [], inSnow: [], focus: 0, shopVisible: false, noteFn: null, live: 0
};

/* ---------------- street ---------------- */
function svgEl(tag, attrs, parent) { const e = document.createElementNS(SVGNS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
function buildSky() {
  const s = $('#svgSky'); const R = rng(3);
  s.innerHTML = `<defs><linearGradient id="gSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#03060f"/><stop offset=".35" stop-color="#0b1532"/><stop offset=".62" stop-color="#1b2a55"/><stop offset=".82" stop-color="#34406b"/></linearGradient>
  <radialGradient id="gMoon"><stop offset="0" stop-color="#fff2cf" stop-opacity=".45"/><stop offset="1" stop-color="#fff2cf" stop-opacity="0"/></radialGradient>
  <mask id="mMoon"><rect x="0" y="0" width="1000" height="1000" fill="#fff"/><circle cx="314" cy="320" r="30" fill="#000"/></mask>
  <filter id="fCloud"><feGaussianBlur stdDeviation="14"/></filter></defs>
  <rect x="-900" y="-400" width="2800" height="1600" fill="url(#gSky)"/>`;
  const g = svgEl('g', {}, s);
  for (let i = 0; i < 170; i++) { const c = svgEl('circle', { cx: -800 + R() * 2600, cy: -300 + R() * 760, r: (.5 + R() * 1.4).toFixed(2), fill: R() < .2 ? '#ffe9c0' : '#dfe6ff', opacity: (.35 + R() * .6).toFixed(2) }, g); if (R() < .35) { c.setAttribute('class', 'tw'); c.style.animationDelay = (R() * 3).toFixed(2) + 's'; } }
  const moon = svgEl('g', { id: 'moonG' }, s);
  svgEl('circle', { cx: 300, cy: 330, r: 120, fill: 'url(#gMoon)' }, moon);
  svgEl('circle', { cx: 300, cy: 330, r: 33, fill: '#f8efd6', mask: 'url(#mMoon)' }, moon);
  const cl = svgEl('g', { filter: 'url(#fCloud)', opacity: .5 }, s);
  [[120, 380, 160, 22], [520, 300, 220, 18], [860, 360, 200, 24], [-200, 330, 240, 22], [1200, 300, 260, 20]].forEach(([x, y, rx, ry]) => svgEl('ellipse', { cx: x, cy: y, rx, ry, fill: '#5a6894', opacity: .5 }, cl));
  // distant castle on a snowy hill
  const c = svgEl('g', {}, s);
  svgEl('path', { d: 'M380,520 Q470,430 560,428 Q680,410 820,470 Q900,500 960,540 L960,600 L380,600Z', fill: '#1a2546' }, c);
  svgEl('path', { d: 'M470,450 Q560,424 650,420 Q740,425 820,470', fill: 'none', stroke: '#c9d4ee', 'stroke-opacity': .35, 'stroke-width': 4 }, c);
  const k = '#0c1430';
  const T = (x, y, w, h, rh) => { svgEl('rect', { x, y, width: w, height: h, fill: k }, c); svgEl('polygon', { points: `${x - 3},${y} ${x + w / 2},${y - rh} ${x + w + 3},${y}`, fill: k }, c); svgEl('path', { d: `M${x + w / 2 - 2},${y - rh + 4} L${x + w / 2},${y - rh} L${x + w / 2 + 2},${y - rh + 4}`, stroke: '#c9d4ee', 'stroke-opacity': .5, fill: 'none' }, c); };
  svgEl('rect', { x: 580, y: 392, width: 150, height: 36, fill: k }, c);
  T(565, 372, 18, 56, 34); T(600, 350, 30, 78, 52); T(640, 368, 22, 60, 36); T(676, 340, 26, 88, 58); T(712, 378, 16, 50, 30); T(738, 395, 14, 36, 24);
  const wins = [[606, 370], [618, 370], [606, 384], [682, 360], [694, 360], [688, 378], [645, 385], [570, 392], [716, 396], [600, 404], [630, 404], [660, 404], [700, 406], [620, 414], [680, 416]];
  wins.forEach(([x, y]) => { const r = svgEl('rect', { x, y, width: 3.2, height: 5, fill: '#ffcf7a' }, c); if (R() < .3) { r.setAttribute('class', 'tw'); r.style.animationDelay = (R() * 3) + 's'; } });
}
function building(g, R, x, w, top, kind, color) {
  const bottom = 945;
  svgEl('rect', { x, y: top, width: w, height: bottom - top, fill: color }, g);
  if (kind === 'gable') {
    const pk = top - w * .42;
    svgEl('polygon', { points: `${x - 10},${top + 2} ${x + w / 2},${pk} ${x + w + 10},${top + 2}`, fill: '#171320' }, g);
    svgEl('path', { d: `M${x - 14},${top + 4} L${x + w / 2},${pk - 8} L${x + w + 14},${top + 4} L${x + w + 4},${top + 10} L${x + w / 2},${pk + 6} L${x - 4},${top + 10}Z`, fill: '#e3ebf7' }, g);
  } else {
    svgEl('rect', { x: x - 8, y: top - 14, width: w + 16, height: 16, fill: '#16121c' }, g);
    svgEl('rect', { x: x - 10, y: top - 22, width: w + 20, height: 11, rx: 5, fill: '#e3ebf7' }, g);
    const cx = x + w * (.2 + R() * .55);
    svgEl('rect', { x: cx, y: top - 60, width: 22, height: 44, fill: '#2a2026' }, g);
    svgEl('rect', { x: cx - 3, y: top - 66, width: 28, height: 8, rx: 3, fill: '#e3ebf7' }, g);
  }
  const cols = Math.max(2, Math.round(w / 52)), cw = w / cols;
  for (let r = 0; r < 4; r++) {
    const y = top + 30 + r * 95; if (y > 820) break;
    for (let c = 0; c < cols; c++) {
      const lit = R() < .62, wx = x + c * cw + cw * .25, ww = cw * .5;
      svgEl('rect', { x: wx, y, width: ww, height: 46, fill: lit ? '#f2b05a' : '#141a2c', opacity: lit ? .92 : 1 }, g);
      if (lit) svgEl('rect', { x: wx, y, width: ww, height: 46, fill: '#ffe2a6', opacity: .35 }, g);
      svgEl('rect', { x: wx + ww / 2 - 1.5, y, width: 3, height: 46, fill: '#0e0c14' }, g);
      svgEl('rect', { x: wx, y: y + 21, width: ww, height: 3, fill: '#0e0c14' }, g);
      svgEl('rect', { x: wx - 4, y: y + 45, width: ww + 8, height: 5, rx: 2, fill: '#dfe7f5' }, g);
    }
  }
  // garland under eaves
  const gy = top + 12, path = `M${x},${gy} Q${x + w / 2},${gy + 26} ${x + w},${gy}`;
  svgEl('path', { d: path, fill: 'none', stroke: '#173a24', 'stroke-width': 5 }, g);
  for (let i = 1; i < 9; i++) { const t = i / 9, px = x + w * t, py = gy + 26 * 2 * t * (1 - t) * 1; const l = svgEl('circle', { cx: px, cy: py + 2, r: 2.6, fill: ['#ffd27a', '#ff7a6a', '#9fe0ff', '#ffd27a'][i % 4] }, g); l.setAttribute('class', 'tw'); l.style.animationDelay = (R() * 2.2) + 's'; }
}
function buildTown() {
  const s = $('#svgTown'); s.innerHTML = ''; const R = rng(11); const g = svgEl('g', {}, s);
  [[-420, 270, 520, 'flat', '#1b1e2a'], [-160, 190, 470, 'gable', '#251e22'], [24, 152, 505, 'flat', '#1e2230'], [172, 122, 520, 'gable', '#241d27'],
   [706, 128, 515, 'gable', '#231c26'], [830, 158, 500, 'flat', '#1d2130'], [984, 180, 470, 'gable', '#261f22'], [1160, 300, 510, 'flat', '#1b1e2a'], [-640, 220, 480, 'gable', '#231c26'], [-900, 260, 520, 'flat', '#1e2230'], [1460, 210, 490, 'gable', '#251e22'], [1670, 230, 520, 'flat', '#1d2130']]
    .forEach(([x, w, top, k, c]) => building(g, R, x, w, top, k, c));
}
function buildFg() {
  const s = $('#svgFg'); const R = rng(5);
  s.innerHTML = `<defs><linearGradient id="gSnow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9eef8"/><stop offset=".5" stop-color="#bac6df"/><stop offset="1" stop-color="#7d8ab0"/></linearGradient>
  <radialGradient id="gWarmSnow"><stop offset="0" stop-color="#ffc56e" stop-opacity=".45"/><stop offset="1" stop-color="#ffc56e" stop-opacity="0"/></radialGradient>
  <radialGradient id="gLamp"><stop offset="0" stop-color="#ffd58a" stop-opacity=".75"/><stop offset="1" stop-color="#ffd58a" stop-opacity="0"/></radialGradient></defs>
  <path d="M-900,945 C-500,930 -100,950 200,940 C400,932 600,955 800,942 C1100,930 1500,950 1900,940 L1900,1300 L-900,1300Z" fill="url(#gSnow)"/>
  <ellipse cx="560" cy="965" rx="300" ry="40" fill="url(#gWarmSnow)"/>`;
  const g = svgEl('g', {}, s);
  for (let i = 0; i < 9; i++) { const t = i / 8; const x = lerp(500, 590, t) + (i % 2 ? 9 : -9), y = lerp(1060, 950, t); svgEl('ellipse', { cx: x, cy: y, rx: 5 + 3 * (1 - t), ry: 2.5 + 1.5 * (1 - t), fill: '#8592b5', opacity: .55 }, g); }
  // mounds
  [[300, 942, 70, 16], [700, 944, 60, 13], [-60, 948, 120, 20], [1060, 946, 120, 18]].forEach(([x, y, rx, ry]) => svgEl('ellipse', { cx: x, cy: y, rx, ry, fill: '#e9eef8' }, g));
  // fir tree with lights
  const tx = 298, ty = 945;
  svgEl('rect', { x: tx - 5, y: ty - 26, width: 10, height: 26, fill: '#2a1a10' }, g);
  [[0, 150, 70], [40, 118, 56], [78, 86, 42], [112, 56, 28]].forEach(([dy, w, h]) => {
    svgEl('polygon', { points: `${tx - w / 2},${ty - 20 - dy} ${tx},${ty - 20 - dy - h - 30} ${tx + w / 2},${ty - 20 - dy}`, fill: '#0f2a1d' }, g);
    svgEl('path', { d: `M${tx - w / 2},${ty - 20 - dy} Q${tx},${ty - 30 - dy} ${tx + w / 2},${ty - 20 - dy}`, stroke: '#e9eef8', 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, g);
  });
  for (let i = 0; i < 18; i++) { const h = R(), w = (1 - h) * 66; const l = svgEl('circle', { cx: tx + (R() * 2 - 1) * w, cy: ty - 34 - h * 150, r: 2.6, fill: ['#ffd27a', '#ff8a6a', '#ffe9b0'][i % 3] }, g); l.setAttribute('class', 'tw'); l.style.animationDelay = (R() * 2.2) + 's'; }
  svgEl('polygon', { points: `${tx},${ty - 214} ${tx + 4},${ty - 204} ${tx + 14},${ty - 204} ${tx + 6},${ty - 197} ${tx + 9},${ty - 186} ${tx},${ty - 193} ${tx - 9},${ty - 186} ${tx - 6},${ty - 197} ${tx - 14},${ty - 204} ${tx - 4},${ty - 204}`, fill: '#ffd98a' }, g);
  // lampposts
  [[742, 1], [130, 1], [-260, 1], [1180, 1]].forEach(([x]) => {
    svgEl('circle', { cx: x, cy: 700, r: 70, fill: 'url(#gLamp)' }, g);
    svgEl('rect', { x: x - 4, y: 700, width: 8, height: 245, fill: '#0d0c12' }, g);
    svgEl('rect', { x: x - 10, y: 930, width: 20, height: 14, fill: '#0d0c12' }, g);
    svgEl('rect', { x: x - 11, y: 680, width: 22, height: 30, rx: 3, fill: '#ffd58a', stroke: '#0d0c12', 'stroke-width': 3 }, g);
    svgEl('path', { d: `M${x - 15},${682} L${x},${666} L${x + 15},${682}Z`, fill: '#0d0c12' }, g);
    svgEl('path', { d: `M${x - 16},${679} Q${x},${660} ${x + 16},${679}`, stroke: '#e9eef8', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, g);
  });
}
function buildGarland() {
  const g = $('#garland'); const R = rng(9);
  for (let i = 1; i < 16; i++) { const t = i / 16, half = t < .5, u = half ? t * 2 : (t - .5) * 2; const x = 302 + 396 * t, y = 493 + 27 * 2 * u * (1 - u) * 1.0; const l = svgEl('circle', { cx: x, cy: y + 3, r: 3, fill: ['#ffd27a', '#ff7a6a', '#ffe9b0'][i % 3] }, g); l.setAttribute('class', 'tw'); l.style.animationDelay = (R() * 2.2) + 's'; }
}
function setViewBoxes() {
  if (!W || !H) return;
  // on short screens show more sky, so the shop roof (its peak is at y=380) and the sign stay below the title
  const a = W / H, base = a > .9 ? 760 : 1080, title = $('#stTitle').getBoundingClientRect().bottom + 12;
  const vbH = st.phase === 'street' && title < H * .8 ? Math.max(base, Math.min(638 / (1 - title / H), 2800 / a)) : base;
  const vbW = vbH * a, vbY = 1018 - vbH, vbX = 500 - vbW / 2;
  const vb = `${vbX.toFixed(1)} ${vbY.toFixed(1)} ${vbW.toFixed(1)} ${vbH.toFixed(1)}`;
  ['#svgSky', '#svgTown', '#svgShop', '#svgFg'].forEach(s => $(s).setAttribute('viewBox', vb));
  $('#moonG').setAttribute('transform', a > .9 ? `translate(${Math.min(-210, 200 - 400 * vbH / H).toFixed(1)} 0)` : ''); // on wide screens keep the moon clear of the title
}
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

/* ---------------- interior ---------------- */
const geo = { win: null, sconces: [], counterY: 0, cCandles: [], rowsY: [], rowH: 40 };
const PAL = ['#5b2a1f', '#3a2a20', '#2b2f3a', '#1f3326', '#6a4a2a', '#2a1d16', '#4a1c22', '#7a6142', '#3b3348', '#8a7a5a', '#41261a', '#232a33'];
function shadeHex(hex, k) { const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = n >> 8 & 255, b = n & 255; r = clamp(Math.round(r * k), 0, 255); g = clamp(Math.round(g * k), 0, 255); b = clamp(Math.round(b * k), 0, 255); return `rgb(${r},${g},${b})`; }
function drawBack() {
  const LW = W * 1.08, LH = H * 1.08, c = $('#cvBack'), x = sizeCanvas(c, LW, LH), R = rng(21);
  let g = x.createLinearGradient(0, 0, 0, LH); g.addColorStop(0, '#080403'); g.addColorStop(.3, '#1a0f08'); g.addColorStop(1, '#140b06');
  x.fillStyle = g; x.fillRect(0, 0, LW, LH);
  const top = sy(.075), bot = sy(.86), rowH = clamp(H * .058, 30, 58), rows = Math.floor((bot - top) / rowH);
  const cols = Math.max(3, Math.round(LW / Math.max(170, MIN * .42))), colW = LW / cols, post = Math.max(7, W * .011), board = Math.max(4, rowH * .13);
  geo.rowH = rowH; geo.rowsY = [];
  const ww = clamp(W * .2, 110, 210), wh = ww * 1.3, wx0 = sx(.5) - ww / 2, wy0 = sy(.115);
  geo.win = { x: wx0, y: wy0, w: ww, h: wh };
  const fillBoxes = (xa, xb, y0, y1) => {
    const h = y1 - y0 - 2, n = h > 40 ? 3 : 2, bh = h / n;
    for (let k = 0; k < n; k++) {
      const yy = y0 + 1 + k * bh; let cx = xa + 1 + R() * 4;
      while (cx < xb - 6) {
        let bw = bh * (1.7 + R() * 1.6); if (cx + bw > xb - 1) bw = xb - 1 - cx; if (bw < bh * .9) break;
        if (R() < .05) { cx += bw * .7; continue; }
        const col = PAL[Math.floor(R() * PAL.length)], sh = .5 + R() * .38;
        const gg = x.createLinearGradient(0, yy, 0, yy + bh); gg.addColorStop(0, shadeHex(col, sh * 1.25)); gg.addColorStop(1, shadeHex(col, sh * .7));
        x.fillStyle = gg; x.fillRect(cx, yy + .5, bw - 1.4, bh - 1.4);
        x.fillStyle = 'rgba(0,0,0,.35)'; x.fillRect(cx + bw - 2.4, yy + .5, 1, bh - 1.4);
        if (R() < .55) { x.fillStyle = `rgba(232,217,181,${.18 + R() * .25})`; x.fillRect(cx + bw * .32, yy + bh * .3, bw * .36, bh * .38); }
        if (R() < .12) { x.fillStyle = 'rgba(210,170,90,.5)'; x.fillRect(cx + 2, yy + bh - 3, bw - 5, 1); }
        cx += bw;
      }
    }
  };
  for (let r = 0; r < rows; r++) {
    const y0 = top + r * rowH, y1 = y0 + rowH - board; geo.rowsY.push((y0 + y1) / 2);
    x.fillStyle = '#090402'; x.fillRect(0, y0, LW, rowH - board);
    for (let ci = 0; ci < cols; ci++) {
      const xa = ci * colW + post / 2, xb = (ci + 1) * colW - post / 2;
      const overlapsWin = y1 > wy0 - board * 3 && y0 < wy0 + wh + board * 3;
      if (overlapsWin) {
        const wa = wx0 - post * 1.5, wb = wx0 + ww + post * 1.5;
        if (xa < wa) fillBoxes(xa, Math.min(xb, wa), y0, y1);
        if (xb > wb) fillBoxes(Math.max(xa, wb), xb, y0, y1);
      } else fillBoxes(xa, xb, y0, y1);
    }
    const bg = x.createLinearGradient(0, y1, 0, y1 + board); bg.addColorStop(0, '#6a4426'); bg.addColorStop(.3, '#3e2614'); bg.addColorStop(1, '#1e1108');
    x.fillStyle = bg; x.fillRect(0, y1, LW, board);
  }
  for (let i = 0; i <= cols; i++) {
    const X = i * colW; const pg = x.createLinearGradient(X - post / 2, 0, X + post / 2, 0);
    pg.addColorStop(0, '#1e1008'); pg.addColorStop(.45, '#4e301a'); pg.addColorStop(1, '#1a0d06');
    x.fillStyle = pg; x.fillRect(X - post / 2, top - board * 3, post, bot - top + board * 3);
  }
  // cornice & ceiling
  let cg = x.createLinearGradient(0, top - board * 4, 0, top); cg.addColorStop(0, '#2c190c'); cg.addColorStop(1, '#4a2e18');
  x.fillStyle = cg; x.fillRect(0, top - board * 4, LW, board * 4);
  x.fillStyle = '#050201'; x.fillRect(0, 0, LW, top - board * 4);
  for (let i = 0; i < 7; i++) { x.fillStyle = `rgba(60,36,18,${.35 - i * .04})`; x.fillRect(0, (top - board * 4) * (i / 7), LW, 3); }
  // window (cut through shelves)
  const archR = ww / 2;
  const winPath = () => { x.beginPath(); x.moveTo(wx0, wy0 + wh); x.lineTo(wx0, wy0 + archR); x.arc(wx0 + archR, wy0 + archR, archR, Math.PI, 0); x.lineTo(wx0 + ww, wy0 + wh); x.closePath(); };
  x.save(); winPath(); x.clip();
  g = x.createLinearGradient(0, wy0, 0, wy0 + wh); g.addColorStop(0, '#081028'); g.addColorStop(.7, '#1d2c58'); g.addColorStop(1, '#3a4a78'); x.fillStyle = g; x.fillRect(wx0, wy0, ww, wh);
  for (let i = 0; i < 40; i++) { x.fillStyle = `rgba(230,236,255,${.3 + R() * .6})`; x.fillRect(wx0 + R() * ww, wy0 + R() * wh * .6, 1.2, 1.2); }
  x.fillStyle = 'rgba(255,245,215,.9)'; x.beginPath(); x.arc(wx0 + ww * .72, wy0 + wh * .2, ww * .06, 0, 6.283); x.fill();
  // tiny castle
  x.fillStyle = '#0a1128'; const cbx = wx0 + ww * .18, cby = wy0 + wh * .78, u = ww / 100;
  x.beginPath(); x.moveTo(wx0, wy0 + wh * .86); x.quadraticCurveTo(wx0 + ww * .5, wy0 + wh * .66, wx0 + ww, wy0 + wh * .84); x.lineTo(wx0 + ww, wy0 + wh); x.lineTo(wx0, wy0 + wh); x.fill();
  [[0, 14, 6, 10], [8, 22, 8, 16], [18, 16, 6, 12], [26, 26, 9, 18], [37, 12, 5, 9], [44, 18, 6, 12]].forEach(([dx, h, w, rh]) => { x.fillRect(cbx + dx * u, cby - h * u, w * u, h * u + 2); x.beginPath(); x.moveTo(cbx + dx * u - u, cby - h * u); x.lineTo(cbx + dx * u + w * u / 2, cby - (h + rh) * u); x.lineTo(cbx + dx * u + w * u + u, cby - h * u); x.fill(); });
  x.fillStyle = '#ffcf7a'; for (let i = 0; i < 9; i++) x.fillRect(cbx + R() * 50 * u, cby - R() * 18 * u, u * .9, u * 1.3);
  x.fillStyle = '#dfe7f6'; x.beginPath(); x.moveTo(wx0, wy0 + wh); x.quadraticCurveTo(wx0 + ww * .5, wy0 + wh * .9, wx0 + ww, wy0 + wh); x.fill();
  const fr = x.createRadialGradient(wx0, wy0 + wh, 0, wx0, wy0 + wh, ww * .6); fr.addColorStop(0, 'rgba(255,255,255,.55)'); fr.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = fr; x.fillRect(wx0, wy0, ww, wh);
  const fr2 = x.createRadialGradient(wx0 + ww, wy0 + wh, 0, wx0 + ww, wy0 + wh, ww * .5); fr2.addColorStop(0, 'rgba(255,255,255,.45)'); fr2.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = fr2; x.fillRect(wx0, wy0, ww, wh);
  x.restore();
  x.lineWidth = Math.max(6, ww * .06); x.strokeStyle = '#2a170b'; winPath(); x.stroke();
  x.lineWidth = Math.max(3, ww * .025); x.strokeStyle = '#1a0d05'; x.beginPath(); x.moveTo(wx0 + ww / 2, wy0); x.lineTo(wx0 + ww / 2, wy0 + wh); x.moveTo(wx0, wy0 + wh * .55); x.lineTo(wx0 + ww, wy0 + wh * .55); x.stroke();
  x.fillStyle = '#3a2412'; x.fillRect(wx0 - ww * .08, wy0 + wh, ww * 1.16, Math.max(6, ww * .06));
  x.fillStyle = '#e8eef8'; x.fillRect(wx0 - ww * .06, wy0 + wh - 2, ww * 1.12, 3);
  // sconces
  geo.sconces = [];
  for (let i = 1; i < cols; i++) {
    const X = i * colW, Y = (i % 2 ? sy(.33) : sy(.6));
    x.fillStyle = '#7a5a2a'; x.fillRect(X - post * .9, Y + 6, post * 1.8, 4);
    x.beginPath(); x.arc(X, Y + 10, post * .9, 0, Math.PI); x.fill();
    const cw = Math.max(5, post * .7), ch = Math.max(14, rowH * .4);
    const cgr = x.createLinearGradient(X - cw / 2, 0, X + cw / 2, 0); cgr.addColorStop(0, '#d8c8a0'); cgr.addColorStop(.5, '#fff4dc'); cgr.addColorStop(1, '#bba878');
    x.fillStyle = cgr; x.fillRect(X - cw / 2, Y + 6 - ch, cw, ch);
    geo.sconces.push({ x: X, y: Y + 6 - ch, s: cw * .9, seed: i * 1.7 });
  }
  // light
  x.globalCompositeOperation = 'lighter';
  for (const s of geo.sconces) { const lg = x.createRadialGradient(s.x, s.y, 0, s.x, s.y, MIN * .32); lg.addColorStop(0, 'rgba(255,150,60,.16)'); lg.addColorStop(1, 'rgba(255,120,40,0)'); x.fillStyle = lg; x.fillRect(0, 0, LW, LH); }
  const wl = x.createRadialGradient(wx0 + ww / 2, wy0 + wh * .6, 0, wx0 + ww / 2, wy0 + wh * .6, ww * 1.6); wl.addColorStop(0, 'rgba(90,120,200,.13)'); wl.addColorStop(1, 'rgba(90,120,200,0)'); x.fillStyle = wl; x.fillRect(0, 0, LW, LH);
  const fl = x.createRadialGradient(sx(.5), sy(1), 0, sx(.5), sy(1), MIN * .9); fl.addColorStop(0, 'rgba(255,140,50,.12)'); fl.addColorStop(1, 'rgba(255,140,50,0)'); x.fillStyle = fl; x.fillRect(0, 0, LW, LH);
  x.globalCompositeOperation = 'source-over';
  const vg = x.createRadialGradient(sx(.5), sy(.5), MIN * .25, sx(.5), sy(.5), Math.max(W, H) * .85); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.8)');
  x.fillStyle = vg; x.fillRect(0, 0, LW, LH);
}
function drawMid() {
  const LW = W * 1.08, LH = H * 1.08, x = sizeCanvas($('#cvMid'), LW, LH);
  const lw = clamp(W * .065, 30, 62), x0t = sx(.6), y0 = sy(.035), x0b = sx(.52), y1 = sy(.93);
  const rail = (ax, ay, bx, by, w) => { x.lineCap = 'round'; x.strokeStyle = 'rgba(0,0,0,.45)'; x.lineWidth = w + 6; x.beginPath(); x.moveTo(ax + 8, ay + 6); x.lineTo(bx + 8, by + 6); x.stroke(); const g = x.createLinearGradient(ax - w, 0, ax + w, 0); g.addColorStop(0, '#2a170b'); g.addColorStop(.5, '#6e4826'); g.addColorStop(1, '#2a170b'); x.strokeStyle = g; x.lineWidth = w; x.beginPath(); x.moveTo(ax, ay); x.lineTo(bx, by); x.stroke(); };
  const rw = Math.max(5, lw * .14), n = Math.round((y1 - y0) / (geo.rowH * 1.05));
  for (let i = 1; i < n; i++) { const t = i / n, ax = lerp(x0t, x0b, t), ay = lerp(y0, y1, t); x.strokeStyle = '#4a2e18'; x.lineWidth = rw * .8; x.beginPath(); x.moveTo(ax, ay); x.lineTo(ax + lw, ay); x.stroke(); x.strokeStyle = 'rgba(255,200,140,.15)'; x.lineWidth = 1; x.beginPath(); x.moveTo(ax, ay - rw * .35); x.lineTo(ax + lw, ay - rw * .35); x.stroke(); }
  rail(x0t, y0, x0b, y1, rw); rail(x0t + lw, y0, x0b + lw, y1, rw);
  x.fillStyle = '#7a5a2a'; x.fillRect(x0t - 4, y0 - 6, lw + 8, 6);
}
function drawFront() {
  const LW = W * 1.08, LH = H * 1.08, x = sizeCanvas($('#cvFront'), LW, LH), R = rng(33);
  const ct = sy(.87); geo.counterY = ct;
  let g = x.createLinearGradient(0, ct, 0, ct + 16); g.addColorStop(0, '#8a5a32'); g.addColorStop(.3, '#5a3a20'); g.addColorStop(1, '#2a170b');
  x.fillStyle = g; x.fillRect(0, ct, LW, 16);
  g = x.createLinearGradient(0, ct + 16, 0, LH); g.addColorStop(0, '#24140a'); g.addColorStop(1, '#0d0603'); x.fillStyle = g; x.fillRect(0, ct + 16, LW, LH - ct);
  x.strokeStyle = 'rgba(120,80,40,.35)'; x.lineWidth = 2;
  const pw = Math.max(120, W * .16); for (let px = sx(0) - 10; px < LW; px += pw) x.strokeRect(px + 14, ct + 32, pw - 28, LH - ct - 40);
  x.fillStyle = 'rgba(255,220,160,.18)'; x.fillRect(0, ct, LW, 1.5);
  // books
  const bx = sx(.86), bs = clamp(W * .09, 50, 110);
  [['#5a1f1a', 1], ['#2b3a2a', .92], ['#3a2a4a', .86]].forEach(([c, k], i) => { const w = bs * k, h = bs * .16; x.fillStyle = c; x.fillRect(bx - w / 2 + i * 3, ct - (i + 1) * h, w, h - 1); x.fillStyle = 'rgba(230,200,140,.6)'; x.fillRect(bx - w / 2 + i * 3, ct - (i + 1) * h + h * .4, w, 1.5); });
  // stacked wand boxes on counter
  const wx = sx(.64), wbw = clamp(W * .13, 70, 170);
  for (let i = 0; i < 3; i++) { const c = PAL[Math.floor(R() * PAL.length)]; x.fillStyle = shadeHex(c, 1.2); x.fillRect(wx - wbw / 2 + (i % 2) * 8, ct - (i + 1) * 12, wbw, 11); x.fillStyle = 'rgba(232,217,181,.6)'; x.fillRect(wx - 10 + (i % 2) * 8, ct - (i + 1) * 12 + 3, 20, 5); }
  // brass bell
  const bbx = sx(.14), br = clamp(W * .022, 12, 24);
  x.fillStyle = '#3a2412'; x.fillRect(bbx - br * 1.3, ct - 3, br * 2.6, 3);
  g = x.createRadialGradient(bbx - br * .3, ct - br * .9, 1, bbx, ct - br * .5, br * 1.2); g.addColorStop(0, '#ffe7a8'); g.addColorStop(.5, '#c99a3e'); g.addColorStop(1, '#6e4a18');
  x.fillStyle = g; x.beginPath(); x.arc(bbx, ct - 3, br, Math.PI, 0); x.fill(); x.beginPath(); x.arc(bbx, ct - br - 4, br * .2, 0, 6.283); x.fill();
  // holly sprig
  const hx = sx(.76);
  x.fillStyle = '#1e4a2a'; for (let i = 0; i < 3; i++) { x.save(); x.translate(hx + i * 9 - 9, ct - 4); x.rotate(-.6 + i * .6); x.beginPath(); x.ellipse(0, -8, 4, 10, 0, 0, 6.283); x.fill(); x.restore(); }
  x.fillStyle = '#c42a2a'; [[0, -6], [5, -3], [-4, -2]].forEach(([dx, dy]) => { x.beginPath(); x.arc(hx + dx, ct + dy, 3, 0, 6.283); x.fill(); });
  // candles on counter
  geo.cCandles = [];
  [[.045, 1.2], [.075, .8], [.93, 1], [.955, .65]].forEach(([f, k], i) => {
    const cx = sx(f), cw = clamp(W * .016, 9, 18), ch = cw * 3.2 * k;
    const cg = x.createLinearGradient(cx - cw / 2, 0, cx + cw / 2, 0); cg.addColorStop(0, '#cbb894'); cg.addColorStop(.5, '#fff3da'); cg.addColorStop(1, '#a8946a');
    x.fillStyle = cg; x.fillRect(cx - cw / 2, ct - ch, cw, ch);
    x.fillStyle = '#f6ead0'; x.beginPath(); x.ellipse(cx, ct - ch, cw / 2, cw * .18, 0, 0, 6.283); x.fill();
    x.fillStyle = 'rgba(255,240,210,.6)'; x.fillRect(cx - cw * .1, ct - ch, cw * .2, ch * .25);
    geo.cCandles.push({ x: cx, y: ct - ch - 1, s: cw * .8, seed: 9 + i * 2.3 });
  });
}

/* ---------------- wand drawing ---------------- */
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

/* ================= FX ================= */
const fx = $('#fx'); let fxc = null;
const dust = [], floaters = [], twinkles = [], winSnow = [];
function initFX() {
  fxc = sizeCanvas(fx, W, H);
  dust.length = 0; const n = Math.round(60 + MIN / 9);
  for (let i = 0; i < n; i++) dust.push({ x: Math.random() * W, y: Math.random() * H, vx: 0, vy: 0, r: .5 + Math.random() * 1.6, a: .2 + Math.random() * .6, p: Math.random() * 6 });
  floaters.length = 0; const R = rng(77), fn = Math.round(5 + W / 220);
  for (let i = 0; i < fn; i++) floaters.push({ fx: .05 + R() * .9, fy: .02 + R() * .07, p: R() * 6, s: clamp(W * .006, 3.5, 6) * (.8 + R() * .4) });
  twinkles.length = 0; for (let i = 0; i < 70; i++) twinkles.push({ fx: R(), fy: R() * .11, p: R() * 6, r: .6 + R() * 1.3 });
  winSnow.length = 0; for (let i = 0; i < 26; i++) winSnow.push({ u: Math.random(), v: Math.random(), s: .8 + Math.random() * 1.4, sp: .0005 + Math.random() * .0008 });
}
function flame(x, y, s, t, seed, lean, dim) {
  if (dim <= .02) return;
  if (t < st.flareUntil) s *= 1.55;
  const c = fxc, f = 1 + .09 * Math.sin(t * .013 + seed) + .06 * Math.sin(t * .031 + seed * 1.7) + .04 * Math.sin(t * .057 + seed * 3);
  const h = s * 2.2 * f * dim, w = s * .55 * (.6 + .4 * dim);
  c.globalCompositeOperation = 'lighter';
  const gr = c.createRadialGradient(x, y - h * .4, 0, x, y - h * .4, s * 7 * f);
  gr.addColorStop(0, `rgba(255,170,70,${.26 * dim})`); gr.addColorStop(1, 'rgba(255,120,40,0)');
  c.fillStyle = gr; c.fillRect(x - s * 8, y - h * .4 - s * 8, s * 16, s * 16);
  const lx = lean * s * 1.4 + Math.sin(t * .004 + seed) * s * .12;
  c.beginPath(); c.moveTo(x - w, y); c.quadraticCurveTo(x - w * 1.15, y - h * .55, x + lx, y - h); c.quadraticCurveTo(x + w * 1.15, y - h * .55, x + w, y); c.quadraticCurveTo(x, y + w * .7, x - w, y);
  const g2 = c.createLinearGradient(x, y, x, y - h); g2.addColorStop(0, 'rgba(255,190,110,.95)'); g2.addColorStop(.35, 'rgba(255,245,215,1)'); g2.addColorStop(1, 'rgba(255,140,40,0)');
  c.fillStyle = g2; c.fill(); c.globalCompositeOperation = 'source-over';
}
function spark(x, y, n, spd = 2.2, r = 1.8, hue = 'gold') {
  for (let i = 0; i < n; i++) { const a = Math.random() * 6.283, v = Math.random() * spd; st.sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - .4, life: 500 + Math.random() * 600, max: 1100, r: r * (.5 + Math.random()), hue }); }
  if (st.sparks.length > 700) st.sparks.splice(0, st.sparks.length - 700);
}
// Softens the corners of a drawn line a little. For the picture only: traits are measured on the raw wave. The ends stay put, so the line still reaches the finger.
function smoothPath(pts) {
  if (pts.length < 3) return pts;
  let a = resample(pts, MIN * .014); const end = pts[pts.length - 1]; a.push({ x: end.x, y: end.y });
  for (let pass = 0; pass < 4; pass++) {
    const b = a.slice();
    for (let i = 1; i < a.length - 1; i++) b[i] = { x: (a[i - 1].x + 2 * a[i].x + a[i + 1].x) / 4, y: (a[i - 1].y + 2 * a[i].y + a[i + 1].y) / 4 };
    a = b;
  }
  return a;
}
function strokePath(c, pts, n) { c.beginPath(); c.moveTo(pts[0].x, pts[0].y); for (let i = 1; i < n - 1; i++) { const mx = (pts[i].x + pts[i + 1].x) / 2, my = (pts[i].y + pts[i + 1].y) / 2; c.quadraticCurveTo(pts[i].x, pts[i].y, mx, my); } if (n > 1) c.lineTo(pts[n - 1].x, pts[n - 1].y); }
function drawTrail(c, pts, alpha, n = pts.length) {
  if (n < 2 || alpha <= 0) return;
  c.lineCap = 'round'; c.lineJoin = 'round'; c.globalCompositeOperation = 'lighter';
  c.strokeStyle = `rgba(255,150,50,${.16 * alpha})`; c.lineWidth = 22; strokePath(c, pts, n); c.stroke();
  c.strokeStyle = `rgba(255,190,90,${.35 * alpha})`; c.lineWidth = 9; strokePath(c, pts, n); c.stroke();
  c.strokeStyle = `rgba(255,244,214,${.95 * alpha})`; c.lineWidth = 2.6; strokePath(c, pts, n); c.stroke();
  c.globalCompositeOperation = 'source-over';
}
function wandLen(w) { return clamp(MIN * .5, 170, 300) * (.82 + .18 * (w.lenN - 9.5) / 5.5); }
function wandTip(o) { const L = wandLen(o.w) * o.s; return [o.x + Math.cos(o.ang) * L / 2, o.y + Math.sin(o.ang) * L / 2]; }
function updateWand(t, dt) {
  const o = st.wand; if (!o) return; const L = wandLen(o.w);
  const k = dt / 16.7;
  if (o.fadeIn != null) { o.a = Math.min(1, o.a + .05 * k); if (o.a >= 1) o.fadeIn = null; }
  if (o.mode === 'float' || o.mode === 'present') {
    const tx = o.tx, ty = o.ty + Math.sin(t * .0022) * 6; o.x += (tx - o.x) * .08 * k; o.y += (ty - o.y) * .08 * k;
    const ta = o.mode === 'present' ? -1.25 + Math.sin(t * .0015) * .05 : -.5 + Math.sin(t * .0017) * .06; o.ang += wrapA(ta - o.ang) * .06 * k;
  } else if (o.mode === 'follow') {
    let p = null; if (st.cap && st.cap.active && st.cap.pts.length) p = st.cap.pts[st.cap.pts.length - 1]; else if (st.input === 'cam' && cam.sm && t - cam.seen < 300) p = cam.sm;
    if (p) {
      // The tip follows the hand; the grip moves only as far as a rigid wand makes it, so the wand pivots from the handle.
      if (o.hx == null) { o.hx = p.x - Math.cos(o.ang) * L; o.hy = p.y - Math.sin(o.ang) * L; }
      o.hy += 1.2 * k; // a held wand settles grip-down
      const a = Math.min(1, .7 * k), g = Math.min(1, .4 * k);
      let dx = p.x - o.hx, dy = p.y - o.hy, d = Math.hypot(dx, dy) || 1;
      o.hx += (p.x - dx / d * L - o.hx) * g; o.hy += (p.y - dy / d * L - o.hy) * g; // the grip lags, like a wrist behind a flick
      dx = p.x - o.hx; dy = p.y - o.hy; const ta = Math.atan2(dy, dx);
      o.ang += wrapA(ta - o.ang) * a;
      o.x += (o.hx + Math.cos(ta) * L / 2 - o.x) * a; o.y += (o.hy + Math.sin(ta) * L / 2 - o.y) * a;
    }
  } else if (o.mode === 'fall') {
    o.vy += .55 * k; o.x += o.vx * k; o.y += o.vy * k; o.ang += o.vr * k;
    const floor = H * .86; if (o.y > floor && o.vy > 0) { if (o.bounces < 2) { o.vy *= -.38; o.vr *= .6; o.bounces++; SFX.clatter(); spark(o.x, floor, 8, 1.5, 1.2); } else { o.vy = 0; o.y = floor; o.vr *= .8; } }
  } else if (o.mode === 'fly') {
    const p = clamp((t - o.t0) / 520); o.s = 1 + p * p * 7; o.a = 1 - clamp((p - .55) / .45); o.y += (H * .5 - o.y) * .05; o.x += (W * .5 - o.x) * .05; o.ang += .02;
  } else if (o.mode === 'crack') {
    const p = (t - o.t0) / 1000; o.split = Math.min(1, p * 2.5); o.dy = Math.max(0, p - .25) ** 2 * H * 1.4;
  } else if (o.mode === 'sink') {
    o.y += .6 * k; o.ang += wrapA(1.2 - o.ang) * .02 * k; o.a = Math.max(0, o.a - .012 * k);
  } else if (o.mode === 'rise') {
    o.x += (o.tx - o.x) * .05 * k; o.y += (o.ty - o.y) * .05 * k; o.ang += wrapA(-1.3 - o.ang) * .05 * k; o.glow = Math.min(1, (o.glow || 0) + .02 * k);
  }
  if (o.fadeOut) { o.a = Math.max(0, o.a - .04 * k); if (o.a <= 0) st.wand = null; }
}
function drawHandWand(t) {
  const o = st.wand; if (!o || o.a <= .01) return; const c = fxc, L = wandLen(o.w) * o.s;
  c.save(); c.globalAlpha = o.a;
  if (o.mode === 'crack') {
    const sp = o.split * L * .12;
    for (const side of [-1, 1]) {
      c.save(); c.translate(o.x, o.y + o.dy * (side < 0 ? .8 : 1.1)); c.rotate(o.ang + side * o.split * .5); c.translate(side * sp, 0);
      c.beginPath(); if (side < 0) c.rect(-L, -L, L + Math.sin(0) * 0, L * 2); else c.rect(0, -L, L, L * 2); c.clip();
      drawWand(c, 0, 0, L, 0, o.w, 0); c.restore();
    }
    if (o.split < 1) { c.globalCompositeOperation = 'lighter'; const g = c.createRadialGradient(o.x, o.y, 0, o.x, o.y, 40); g.addColorStop(0, `rgba(255,230,180,${1 - o.split})`); g.addColorStop(1, 'rgba(255,180,90,0)'); c.fillStyle = g; c.fillRect(o.x - 40, o.y - 40, 80, 80); }
  } else {
    c.save(); c.shadowColor = 'rgba(255,214,150,.55)'; c.shadowBlur = 10; drawWand(c, o.x, o.y, L, o.ang, o.w, o.glow ? o.glow * .9 : .35); c.restore();
    if (o.mode === 'follow' || o.glow) {
      const [tx, ty] = wandTip(o); c.globalCompositeOperation = 'lighter';
      const gr = c.createRadialGradient(tx, ty, 0, tx, ty, 18 + (o.glow || 0) * 30); gr.addColorStop(0, `rgba(255,236,190,${.8})`); gr.addColorStop(1, 'rgba(255,190,90,0)'); c.fillStyle = gr; c.fillRect(tx - 60, ty - 60, 120, 120);
    }
  }
  c.restore();
}
function drawFX(t, dt) {
  const c = fxc; c.clearRect(0, 0, W, H);
  const B = layers.shBack, M = layers.shMid, F = layers.shFront, k = dt / 16.7;
  const dim = t < st.flameOut ? .03 : clamp((t - st.flameOut) / 700, .03, 1);
  const windOn = t < st.windUntil;
  let leanT = Math.sin(t * .0009) * .15 + st.vx * .02; if (windOn) leanT = Math.sin(t * .006) * 1.1;
  st.lean += (clamp(leanT, -1.3, 1.3) - st.lean) * .12;
  if (geo.win) {
    const w = geo.win, [wx, wy] = L2S(B, w.x, w.y), r = w.w / 2;
    c.save(); c.beginPath(); c.moveTo(wx, wy + w.h); c.lineTo(wx, wy + r); c.arc(wx + r, wy + r, r, Math.PI, 0); c.lineTo(wx + w.w, wy + w.h); c.closePath(); c.clip();
    c.fillStyle = 'rgba(240,244,255,.85)';
    for (const f of winSnow) { f.v += f.sp * dt * .06; f.u += Math.sin(t * .001 + f.s * 5) * .0006; if (f.v > 1) { f.v = 0; f.u = Math.random(); } c.beginPath(); c.arc(wx + f.u * w.w, wy + f.v * w.h, f.s, 0, 6.283); c.fill(); }
    c.restore();
  }
  for (const s of geo.sconces) { const [x, y] = L2S(B, s.x, s.y); flame(x, y, s.s, t, s.seed, st.lean * .6, dim); }
  c.globalCompositeOperation = 'lighter';
  for (const q of twinkles) { const [x, y] = L2S(M, sx(q.fx), sy(q.fy)); const a = (.35 + .65 * (.5 + .5 * Math.sin(t * .002 + q.p * 3))) * dim; c.fillStyle = `rgba(255,205,130,${a * .8})`; c.beginPath(); c.arc(x, y, q.r, 0, 6.283); c.fill(); }
  c.globalCompositeOperation = 'source-over';
  for (const fl of floaters) {
    let [x, y] = L2S(M, sx(fl.fx), sy(fl.fy)); y += Math.sin(t * .0011 + fl.p) * 5; x += Math.sin(t * .0007 + fl.p) * 2;
    c.fillStyle = '#efe2c2'; c.fillRect(x - fl.s * .45, y, fl.s * .9, fl.s * 3);
    flame(x, y, fl.s * .7, t, fl.p * 5, st.lean * .5, dim);
  }
  const [wcx, wcy] = st.wind;
  c.globalCompositeOperation = 'lighter';
  for (const d of dust) {
    d.vx += (Math.random() - .5) * .03; d.vy += (Math.random() - .5) * .03 - .002;
    if (windOn) { const dx = d.x - wcx, dy = d.y - wcy, dd = Math.hypot(dx, dy) + 30; d.vx += (-dy / dd) * .5 + dx / dd * .05; d.vy += (dx / dd) * .5 + dy / dd * .05; }
    const lim = windOn ? 6 : 1.2, spd = Math.hypot(d.vx, d.vy); if (spd > lim) { d.vx *= lim / spd; d.vy *= lim / spd; }
    d.vx *= .97; d.vy *= .97; d.x += d.vx; d.y += d.vy;
    if (d.x < -10) d.x = W + 10; if (d.x > W + 10) d.x = -10; if (d.y < -10) d.y = H + 10; if (d.y > H + 10) d.y = -10;
    const a = d.a * (.6 + .4 * Math.sin(t * .002 + d.p));
    c.fillStyle = `rgba(255,214,150,${clamp(a, 0, 1) * .75})`; c.beginPath(); c.arc(d.x, d.y, d.r, 0, 6.283); c.fill();
  }
  c.globalCompositeOperation = 'source-over';
  for (const cc of geo.cCandles) { const [x, y] = L2S(F, cc.x, cc.y); flame(x, y, cc.s, t, cc.seed, st.lean, dim); }
  // focus while waving
  const wantF = st.cap && !st.cap.done ? .7 : 0; st.focus += (wantF - st.focus) * .05;
  if (st.focus > .01) { const g = c.createRadialGradient(W / 2, H * .45, MIN * .15, W / 2, H * .45, Math.max(W, H) * .75); g.addColorStop(0, `rgba(8,4,2,${.35 * st.focus})`); g.addColorStop(1, `rgba(8,4,2,${.5 * st.focus})`); c.fillStyle = g; c.fillRect(0, 0, W, H); }
  // falling boxes
  for (let i = st.falling.length - 1; i >= 0; i--) {
    const b = st.falling[i]; b.vy += .45 * k; b.x += b.vx * k; b.y += b.vy * k; b.rot += b.vr * k;
    c.save(); c.translate(b.x, b.y); c.rotate(b.rot); c.fillStyle = b.col; c.fillRect(-b.w / 2, -b.h / 2, b.w, b.h); c.fillStyle = 'rgba(232,217,181,.6)'; c.fillRect(-b.w * .15, -b.h * .2, b.w * .3, b.h * .4); c.strokeStyle = 'rgba(226,190,120,.6)'; c.strokeRect(-b.w / 2, -b.h / 2, b.w, b.h); c.restore();
    if (b.y > H + 80) st.falling.splice(i, 1);
  }
  // indoor snow
  c.fillStyle = 'rgba(245,248,255,.9)';
  for (let i = st.inSnow.length - 1; i >= 0; i--) { const f = st.inSnow[i]; f.x += (f.vx + Math.sin(t * .002 + f.p) * .6) * k; f.y += f.vy * k; f.vx *= .985; f.vy += (.9 - f.vy) * .02; if (f.y > H + 10) { st.inSnow.splice(i, 1); continue; } c.beginPath(); c.arc(f.x, f.y, f.r, 0, 6.283); c.fill(); }
  // smoke
  for (let i = st.puffs.length - 1; i >= 0; i--) {
    const p = st.puffs[i]; p.life -= dt; if (p.life <= 0) { st.puffs.splice(i, 1); continue; } const a = p.life / p.max;
    p.x += p.vx * k; p.y += p.vy * k; p.r += p.gr * k;
    const g = c.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r); g.addColorStop(0, `rgba(${p.col},${.55 * a})`); g.addColorStop(1, `rgba(${p.col},0)`); c.fillStyle = g; c.beginPath(); c.arc(p.x, p.y, p.r, 0, 6.283); c.fill();
  }
  // bubbles
  for (let i = st.bubbles.length - 1; i >= 0; i--) {
    const b = st.bubbles[i]; b.life -= dt; b.x += (b.vx + Math.sin(t * .003 + b.p) * .5) * k; b.y += b.vy * k; b.vy *= .995;
    if (b.life <= 0) { spark(b.x, b.y, 5, 1.5, 1, 'white'); if (Math.random() < .5) tone(900 + Math.random() * 900, .06, { vol: .03 }); st.bubbles.splice(i, 1); continue; }
    c.globalCompositeOperation = 'lighter';
    const g = c.createRadialGradient(b.x - b.r * .3, b.y - b.r * .3, b.r * .1, b.x, b.y, b.r); g.addColorStop(0, 'rgba(255,255,255,.35)'); g.addColorStop(.7, 'rgba(160,200,255,.06)'); g.addColorStop(.92, `hsla(${(t * .1 + b.p * 60) % 360},90%,75%,.45)`); g.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = g; c.beginPath(); c.arc(b.x, b.y, b.r, 0, 6.283); c.fill(); c.globalCompositeOperation = 'source-over';
  }
  // butterflies
  for (let i = st.flies.length - 1; i >= 0; i--) {
    const f = st.flies[i]; f.life -= dt; if (f.life <= 0 || f.y < -40) { st.flies.splice(i, 1); continue; }
    f.vx += (Math.random() - .5) * .25; f.vy += (Math.random() - .5) * .2 - .02; f.vx *= .97; f.vy *= .97; f.x += f.vx * k; f.y += f.vy * k;
    const flap = Math.abs(Math.sin(t * .025 + f.p)), s = f.s, a = clamp(f.life / 800);
    c.save(); c.translate(f.x, f.y); c.rotate(Math.atan2(f.vy, f.vx) + Math.PI / 2); c.globalCompositeOperation = 'lighter';
    c.fillStyle = `hsla(${f.h},90%,72%,${.75 * a})`;
    for (const side of [-1, 1]) { c.beginPath(); c.ellipse(side * s * .55 * (.3 + .7 * flap), -s * .2, s * .55 * (.3 + .7 * flap), s * .7, side * .3, 0, 6.283); c.fill(); c.beginPath(); c.ellipse(side * s * .4 * (.3 + .7 * flap), s * .45, s * .35 * (.3 + .7 * flap), s * .45, -side * .3, 0, 6.283); c.fill(); }
    c.fillStyle = `rgba(255,250,230,${a})`; c.fillRect(-1, -s * .6, 2, s * 1.3); c.restore();
  }
  // trails
  for (let i = st.trails.length - 1; i >= 0; i--) {
    const tr = st.trails[i]; let a = 1; if (tr.fade) { a = 1 - (t - tr.fade) / 1300; if (a <= 0) { st.trails.splice(i, 1); continue; } }
    if (tr.drawn !== tr.pts.length) { tr.line = smoothPath(tr.pts); tr.drawn = tr.pts.length; } // recomputed only when the line grows
    drawTrail(c, tr.line, a);
  }
  // halo (success)
  if (st.halo) {
    // the frame clock can lag the moment the halo was started, and a negative time would make arc() throw
    const hl = st.halo, p = Math.max(0, t - hl.t0) / 1000; if (p > 3.4) st.halo = null; else {
      c.globalCompositeOperation = 'lighter'; const fade = p > 2.6 ? 1 - (p - 2.6) / .8 : clamp(p * 2);
      for (let r = 0; r < 3; r++) { const R = (40 + r * 34) * (1 + p * .25); for (let i = 0; i < 14; i++) { const a = i / 14 * 6.283 + p * (1.6 - r * .4) * (r % 2 ? -1 : 1); const x = hl.x + Math.cos(a) * R, y = hl.y + Math.sin(a) * R * .55; c.fillStyle = `rgba(255,${210 - r * 20},${140 - r * 30},${.8 * fade})`; c.beginPath(); c.arc(x, y, 2.4 - r * .4, 0, 6.283); c.fill(); } }
      const er = p * MIN * .6; c.strokeStyle = `rgba(255,220,150,${clamp(1 - p / 1.4) * .6})`; c.lineWidth = 3; c.beginPath(); c.arc(hl.x, hl.y, er, 0, 6.283); c.stroke();
      const sw = ((p * .55) % 1) * (H + 400) - 200; const g = c.createLinearGradient(0, sw - 120, 0, sw + 120); g.addColorStop(0, 'rgba(255,200,110,0)'); g.addColorStop(.5, `rgba(255,200,110,${.12 * fade})`); g.addColorStop(1, 'rgba(255,200,110,0)'); c.fillStyle = g; c.fillRect(0, sw - 120, W, 240);
      c.globalCompositeOperation = 'source-over';
    }
  }
  if (st.replay) {
    const R = st.replay, p = clamp((t - R.t0) / 1700), a = t > R.t0 + 2600 ? 1 - (t - R.t0 - 2600) / 900 : 1;
    if (a <= 0) st.replay = null; else if (t > R.t0) { const n = Math.max(2, Math.floor(R.pts.length * easeOut(p))); drawTrail(c, R.pts, a, n); if (p < 1 && Math.random() < .8) { const q = R.pts[n - 1]; spark(q.x, q.y, 2, 1.6); } }
  }
  // blackout & frost
  st.dark += (st.darkT - st.dark) * .08 * k; if (st.dark > .01) { c.fillStyle = `rgba(2,1,0,${st.dark})`; c.fillRect(0, 0, W, H); }
  st.frost += (st.frostT - st.frost) * .05 * k;
  if (st.frost > .01) { const g = c.createRadialGradient(W / 2, H / 2, MIN * .3, W / 2, H / 2, Math.max(W, H) * .75); g.addColorStop(0, 'rgba(220,235,255,0)'); g.addColorStop(1, `rgba(220,235,255,${.55 * st.frost})`); c.fillStyle = g; c.fillRect(0, 0, W, H); }
  updateWand(t, dt); drawHandWand(t);
  // camera cursor
  if (st.input === 'cam' && cam.sm && t - cam.seen < 300 && !(st.wand && st.wand.mode === 'follow')) { c.globalCompositeOperation = 'lighter'; const g = c.createRadialGradient(cam.sm.x, cam.sm.y, 0, cam.sm.x, cam.sm.y, 26); g.addColorStop(0, 'rgba(255,236,190,.9)'); g.addColorStop(1, 'rgba(255,190,90,0)'); c.fillStyle = g; c.fillRect(cam.sm.x - 30, cam.sm.y - 30, 60, 60); c.globalCompositeOperation = 'source-over'; }
  // sparks
  c.globalCompositeOperation = 'lighter';
  for (let i = st.sparks.length - 1; i >= 0; i--) {
    const p = st.sparks[i]; p.life -= dt; if (p.life <= 0) { st.sparks.splice(i, 1); continue; }
    p.vy += (p.hue === 'rain' ? .02 : .03) * k; p.vx *= .98; p.vy *= .98; p.x += p.vx * k; p.y += p.vy * k; const a = p.life / p.max;
    c.fillStyle = p.hue === 'red' ? `rgba(255,${110 + 60 * a | 0},90,${a})` : p.hue === 'white' ? `rgba(230,240,255,${a})` : `rgba(255,${190 + 50 * a | 0},${110 + 100 * a | 0},${a})`;
    c.beginPath(); c.arc(p.x, p.y, p.r * (.5 + a * .5), 0, 6.283); c.fill();
  }
  c.globalCompositeOperation = 'source-over';
}

/* ================= metrics ================= */
const inputMode = () => st.input === 'cam' ? 'camera' : st.touch ? 'touch' : 'pointer';
function mergeTraits(extra) { return averageTraits(extra ? [...st.obs, extra] : st.obs); }
function bestWand(tr) { return bestMatch(tr, st.tried); }

/* ================= input: pointer ================= */
const stage = $('#stage');
function accept(on) { stage.classList.toggle('on', on); }
function pt(e) { return { x: e.clientX, y: e.clientY, t: performance.now() }; }
stage.addEventListener('pointerdown', e => { const c = st.cap; if (!c || c.active || c.done || st.input !== 'pointer') return; e.preventDefault(); st.touch = e.pointerType === 'touch'; try { stage.setPointerCapture(e.pointerId); } catch (_) { } startCapture([pt(e)]); });
stage.addEventListener('pointermove', e => { const c = st.cap; if (!c || !c.active || st.input !== 'pointer') return; const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e]; for (const ev of evs) addPoint(pt(ev)); });
const endPointer = () => { const c = st.cap; if (c && c.active && st.input === 'pointer') finishCapture(); };
stage.addEventListener('pointerup', endPointer); stage.addEventListener('pointercancel', endPointer);

function captureWave(cand) { return new Promise(res => { st.cap = { active: false, done: false, pts: [], resolve: res, cand, armed: performance.now() }; if (st.input === 'pointer') accept(true); }); }
function startCapture(pts) {
  const c = st.cap; c.active = true; c.armed = performance.now(); c.t0 = pts[0].t; c.pts = pts.slice(); c.rs = [{ x: pts[0].x, y: pts[0].y }]; c.trail = { pts: c.pts.slice() }; st.trails.push(c.trail); st.vx = 0; setStatus('');
  if (st.wand && c.cand) { st.wand.mode = 'follow'; st.wand.hx = null; st.wand.fadeOut = false; }
  spark(pts[0].x, pts[0].y, 8, 1.6);
}
function addPoint(p) {
  const c = st.cap; const lp = c.pts[c.pts.length - 1]; if (Math.hypot(p.x - lp.x, p.y - lp.y) < 1) return;
  c.pts.push(p); c.trail.pts.push(p); st.vx = st.vx * .8 + (p.x - lp.x) * .2;
  const v = Math.hypot(p.x - lp.x, p.y - lp.y);
  const [ex, ey] = st.wand && st.wand.mode === 'follow' ? wandTip(st.wand) : [p.x, p.y];
  if (Math.random() < .3 + v * .02) spark(ex, ey, 1, 1 + v * .05, 1.4, st.live < .35 && c.cand ? 'red' : 'gold');
  const step = MIN * .025; const d = Math.hypot(p.x - c.rs[c.rs.length - 1].x, p.y - c.rs[c.rs.length - 1].y);
  if (d >= step) { c.rs.push({ x: p.x, y: p.y }); const r = c.rs, n = r.length; if (n > 4) { const a1 = Math.atan2(r[n - 3].y - r[n - 5].y, r[n - 3].x - r[n - 5].x), a2 = Math.atan2(r[n - 1].y - r[n - 3].y, r[n - 1].x - r[n - 3].x); if (Math.abs(wrapA(a2 - a1)) > 1.05 && now - (c.lastCorner || 0) > 120) { c.lastCorner = now; spark(r[n - 3].x, r[n - 3].y, 14, 3.2, 2); if (A.on) noise(.05, { vol: .06, freq: 4000, q: 2 }); } } }
}
function finishCapture() {
  const c = st.cap; if (!c || !c.active) return;
  const m = c.pts.length > 3 ? strokeMetrics(c.pts, MIN, inputMode()) : { len: 0, dur: 0 };
  if (m.len < MIN * .35 || m.dur < .2) {
    c.active = false; c.pts = []; c.fast = 0; c.slow = 0; c.msgUntil = performance.now() + 2500; if (c.trail) { c.trail.fade = performance.now(); c.trail = null; }
    if (st.wand && c.cand) st.wand.mode = 'float';
    setStatus(T('tooShort')); nudgeNote(); return;
  }
  c.active = false; c.done = true; accept(false); c.trail.fade = performance.now() + 500;
  const pts = c.pts; st.cap = null; c.resolve({ pts, m });
}
function liveTick(t) {
  const c = st.cap; if (!c) return;
  if (c.active && t - c.t0 > (st.input === 'cam' ? CAM.maxWave : 4200)) return finishCapture();
  if (st.input === 'cam' && !c.active) {
    const waited = t - c.armed, handOn = cam.sm && t - cam.seen < 500;
    if (t > (c.msgUntil || 0)) setStatus(waited > 8000 ? T(handOn ? 'hintWave' : 'hintHand') : T(handOn ? 'handSeen' : 'noHand'));
    if (!st.camHelp && (waited > 8000 || (waited > 4000 && cam.fps > 0 && cam.fps < 8))) { st.camHelp = true; renderNote(); }
    if (waited > 25000) return toPointer('camAuto'); // the game never waits forever
  }
  if (!c.active || t - (c.lastLive || 0) < 160 || c.pts.length < 6) return; c.lastLive = t;
  if (c.cand) { const tr = mergeTraits(strokeMetrics(c.pts, MIN, inputMode())); const bw = bestWand(tr); const d = wandDist(c.cand, tr) - wandDist(bw, tr); st.live = clamp(1 - d * 6); }
}

/* ================= input: camera (MediaPipe) ================= */
const MP = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14';
const MODEL = 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';
const cam = { on: false, hl: null, loading: null, video: $('#camv'), stream: null, token: 0, fresh: false, lastT: -1, lastTs: 0, lastFrame: 0, errs: 0, fps: 0, fpsN: 0, fpsT: 0, sm: null, seen: -1e9, firstSeen: 0, hist: [] };
const withTimeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);
function loadHand() {
  if (cam.hl) return Promise.resolve();
  if (!cam.loading) cam.loading = (async () => {
    const mod = await withTimeout(import(MP + '/vision_bundle.mjs'), 30000);
    const files = await withTimeout(mod.FilesetResolver.forVisionTasks(MP + '/wasm'), 30000);
    const opts = d => ({ baseOptions: { modelAssetPath: MODEL, delegate: d }, runningMode: 'VIDEO', numHands: 1, minHandDetectionConfidence: .5, minHandPresenceConfidence: .5, minTrackingConfidence: .5 });
    try { cam.hl = await withTimeout(mod.HandLandmarker.createFromOptions(files, opts('GPU')), 60000); }
    catch (e) { if (e.message === 'timeout') throw e; cam.hl = await withTimeout(mod.HandLandmarker.createFromOptions(files, opts('CPU')), 60000); }
  })().catch(e => { cam.loading = null; throw e; });
  return cam.loading;
}
async function openStream(tok) {
  if (!window.isSecureContext) throw Object.assign(new Error('insecure'), { name: 'Insecure' });
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw Object.assign(new Error('unsupported'), { name: 'Unsupported' });
  const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }, audio: false });
  if (tok !== cam.token) { stream.getTracks().forEach(t => t.stop()); return; }
  if (cam.onGrant) cam.onGrant();
  cam.stream = stream; cam.video.srcObject = stream; $('#camBox').hidden = false;
  stream.getVideoTracks().forEach(tr => tr.addEventListener('ended', () => { if (cam.stream === stream) toPointer('camLost'); }));
  // video.currentTime of a live stream advances with the clock, so it can't tell new frames apart at full rate; this callback can
  if (cam.video.requestVideoFrameCallback) { const onFrame = () => { if (cam.stream === stream) { cam.fresh = true; cam.video.requestVideoFrameCallback(onFrame); } }; cam.video.requestVideoFrameCallback(onFrame); }
  await cam.video.play();
}
async function startCamera() {
  const tok = ++cam.token;
  await Promise.all([openStream(tok), loadHand()]);
  if (tok !== cam.token) return false;
  // the first detection compiles the model and can freeze the page for seconds: do it now, while the "loading" note is up
  try { cam.lastTs = Math.max(performance.now(), cam.lastTs + 1); cam.hl.detectForVideo(cam.video, cam.lastTs); } catch (_) { }
  Object.assign(cam, { on: true, lastFrame: performance.now(), errs: 0, fps: 0, fpsN: 0, fpsT: 0, sm: null, seen: -1e9, hist: [] });
  if (document.hidden) suspendCamera();
  return true;
}
function stopCamera() {
  cam.token++; try { cam.stream && cam.stream.getTracks().forEach(t => t.stop()); } catch (_) { }
  cam.stream = null; cam.video.srcObject = null; cam.on = false; $('#camBox').hidden = true; $('#camBox').classList.remove('seen');
}
function camErrKey(e) {
  const n = e && e.name;
  if (n === 'NotAllowedError' || n === 'SecurityError') return 'camDenied';
  if (n === 'NotFoundError' || n === 'OverconstrainedError' || n === 'DevicesNotFoundError') return 'camNone';
  if (n === 'NotReadableError' || n === 'AbortError' || n === 'TrackStartError') return 'camBusy';
  if (n === 'Insecure') return 'camInsecure';
  if (n === 'Unsupported') return 'camUnsupported';
  return 'camLoadFail';
}
function toPointer(msg) {
  stopCamera(); st.input = 'pointer'; st.camHelp = false;
  const c = st.cap; if (c && c.active) finishCapture();
  if (st.cap) accept(true);
  if (st.noteFn) renderNote(); if (msg) setStatus(T(msg));
}
function suspendCamera() { cam.resume = true; if (st.cap && st.cap.active) finishCapture(); stopCamera(); }
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { if (cam.on) suspendCamera(); return; }
  if (!cam.resume) return; cam.resume = false; if (st.input !== 'cam') return;
  if (st.cap) st.cap.armed = performance.now();
  withTimeout(startCamera(), 8000).catch(() => toPointer('camLost'));
});
function camTick(t) {
  if (!cam.on || !cam.hl) return; const v = cam.video;
  if (!st.cap) { cam.lastFrame = t; cam.fpsT = 0; return; } // nothing to capture: leave the frame budget to the reaction effects
  // new-frame callback when the browser fires it; otherwise check a few times a second that the video is still moving
  const moved = v.currentTime !== cam.lastT, fresh = cam.fresh || (moved && t - cam.lastFrame > 200);
  if (v.readyState < 2 || !fresh) { if (!moved && t - cam.lastFrame > 4000 && !document.hidden) toPointer('camLost'); return; }
  cam.fresh = false; cam.lastT = v.currentTime; cam.lastFrame = t;
  if (!cam.fpsT) { cam.fpsT = t; cam.fpsN = 0; } else { cam.fpsN++; if (t - cam.fpsT >= 1000) { cam.fps = cam.fpsN * 1000 / (t - cam.fpsT); cam.fpsN = 0; cam.fpsT = t; } }
  cam.lastTs = Math.max(t, cam.lastTs + 1);
  let r; try { r = cam.hl.detectForVideo(v, cam.lastTs); cam.errs = 0; } catch (e) { if (++cam.errs >= 5) toPointer('camLost'); return; }
  const lm = r && r.landmarks && r.landmarks[0];
  $('#camBox').classList.toggle('seen', !!lm);
  if (lm) {
    const { x, y } = camMap(lm[8], v.videoWidth || 4, v.videoHeight || 3, W, H, MIN);
    if (!cam.sm || t - cam.seen > 500) { cam.sm = { x, y }; cam.hist = []; cam.firstSeen = t; }
    else camSmooth(cam.sm, x, y, t - cam.seen);
    cam.seen = t; cam.hist.push({ x: cam.sm.x, y: cam.sm.y, t }); while (cam.hist.length > 10) cam.hist.shift();
    camWave(t);
  } else if (st.cap && st.cap.active && t - cam.seen > 450) finishCapture(); // recordings show tracking gaps of up to 300 ms during a fast wave
}
function camWave(t) {
  const c = st.cap; if (!c || c.done || st.input !== 'cam') return;
  const ev = camStep(c, camSpeed(cam.hist, MIN), t, cam.firstSeen);
  if (ev === 'start') return startCapture(cam.hist.slice(-3).map(q => ({ ...q })));
  if (ev === 'wait') return;
  addPoint({ x: cam.sm.x, y: cam.sm.y, t });
  if (ev === 'end') { const end = c.slow - CAM.lag; c.pts = c.pts.filter(q => q.t <= end); finishCapture(); }
}

/* ================= shelf box & presentation ================= */
const bb = $('#bigbox'), bbC = $('#bbWand');
function bbTarget() { const top = Math.max(70, H * .08), nt = noteTop(); const tw = Math.min(W * .84, 440), th = tw * .2; return { w: tw, h: th, x: (W - tw) / 2, y: clamp((top + nt) / 2 - th / 2 - H * .04, top, H - th - 20) }; }
function pullShelfBox(w) {
  const el = document.createElement('div'); el.className = 'wbox jig'; el.style.setProperty('--c', w.box);
  w.num = '№ ' + (100 + Math.floor(Math.random() * 880)); el.innerHTML = `<div class="halo"></div><div class="lab">${w.num}</div>`;
  const hh = Math.max(16, geo.rowH * .62), ww = Math.min(hh * 2.75, W * .2);
  let fx0, fy0, tries = 0; do { fx0 = .1 + Math.random() * .8; fy0 = .14 + Math.random() * .52; tries++; } while (tries < 20 && Math.abs(fx0 - .5) < .16 && fy0 < .42);
  let yy = sy(fy0), best = geo.rowsY[0]; for (const r of geo.rowsY) if (Math.abs(r - yy) < Math.abs(best - yy)) best = r;
  Object.assign(el.style, { width: ww + 'px', height: hh + 'px', left: clamp(sx(fx0) - ww / 2, 4, W * 1.08 - ww - 4) + 'px', top: (best - hh / 2) + 'px' });
  $('#boxes').appendChild(el); requestAnimationFrame(() => el.style.setProperty('--g', 1)); return el;
}
async function flyOut(el, w) {
  const r = el.getBoundingClientRect(), Tg = bbTarget();
  el.style.visibility = 'hidden'; bb.style.setProperty('--c', w.box); $('#bbLab').textContent = w.num;
  const lid = bb.querySelector('.lid'); lid.getAnimations().forEach(a => a.cancel()); bbC.getAnimations().forEach(a => a.cancel()); bb.getAnimations().forEach(a => a.cancel()); bb.style.opacity = '';
  Object.assign(bb.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' }); bb.hidden = false;
  const cw = Tg.w * 1.2, ch = Tg.h * 4, x = sizeCanvas(bbC, cw, ch); x.clearRect(0, 0, cw, ch);
  drawWand(x, cw / 2, ch / 2, Math.min(cw * .7, Tg.w * .92) * (.82 + .18 * (w.lenN - 9.5) / 5.5), -.04, w); bbC.style.opacity = '0';
  const midX = lerp(r.left, Tg.x, .5), midY = Math.min(r.top, Tg.y) - 40;
  const an = bb.animate([
    { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px', transform: 'rotate(0deg)' },
    { left: midX + 'px', top: midY + 'px', width: lerp(r.width, Tg.w, .5) + 'px', height: lerp(r.height, Tg.h, .5) + 'px', transform: 'rotate(-6deg)', offset: .55 },
    { left: Tg.x + 'px', top: Tg.y + 'px', width: Tg.w + 'px', height: Tg.h + 'px', transform: 'rotate(0deg)' }
  ], { duration: 950, easing: 'cubic-bezier(.3,.7,.2,1)', fill: 'forwards' });
  await an.finished; Object.assign(bb.style, { left: Tg.x + 'px', top: Tg.y + 'px', width: Tg.w + 'px', height: Tg.h + 'px' }); an.cancel(); el.remove();
  SFX.dim();
  lid.animate([{ transform: 'none', opacity: 1 }, { transform: 'translate(8%,-160%) rotate(9deg)', opacity: 0 }], { duration: 650, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' });
  await bbC.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: 250, fill: 'forwards' }).finished;
  await wait(250);
  // hand the wand over: box fades, the wand floats free
  const L = wandLen(w); st.wand = { w, x: Tg.x + Tg.w / 2, y: Tg.y + Tg.h / 2, tx: W / 2, ty: Tg.y + Tg.h / 2, ang: -.04, s: 1, a: 0, fadeIn: true, mode: 'present', vx: 0, vy: 0, vr: 0 };
  await bb.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 450, fill: 'forwards' }).finished; bb.hidden = true;
}

/* ================= ritual ================= */
function pickNo(arr, used, keep) { const pool = arr.map((_, i) => i).filter(i => !used.includes(i)); const i = pick(pool.length ? pool : arr.map((_, i) => i)); used.push(i); while (used.length > keep) used.shift(); return i; }
// lastWave comes from the game before, after Try again: it stands in for the warm-up, so a known hand goes straight to the wands.
async function ritual(lastWave) {
  setRecentWins(recentWins());
  st.obs = []; st.traits = null; st.tried = []; st.attempt = 0; st.history = []; st.stroke = null; st.winner = null; st.camHelp = false;
  let r;
  if (lastWave) { st.obs.push(lastWave); st.traits = mergeTraits(); }
  else {
    setNote(() => ({ kicker: T('warmK'), hand: T('warmH'), instr: T(st.input === 'cam' ? 'warmIcam' : 'warmIdraw') }));
    await wait(450);
    r = await captureWave(null); st.obs.push(r.m); st.traits = mergeTraits(); st.stroke = r.pts;
    SFX.chime(); spark(r.pts[r.pts.length - 1].x, r.pts[r.pts.length - 1].y, 24, 3);
    setNote(() => ({ kicker: T('warmK'), hand: T('warmDone') }));
    await wait(1700);
  }
  while (true) {
    st.attempt++;
    const cand = chooseCandidate(st.traits, st.tried, st.attempt);
    const oi = pickNo(OFFER, st.usedOffers, 4), offer = () => ({ kicker: T('ollK'), spec: cand.spec ? specText(cand) : '', hand: L(OFFER[oi]) });
    setNote(offer);
    const el = pullShelfBox(cand); await wait(650); await flyOut(el, cand);
    r = await captureWave(cand);
    st.obs.push(r.m); st.traits = mergeTraits();
    const best = bestWand(st.traits);
    if (isChosen(cand, best, st.attempt)) { rememberWin(cand.id); logResult(cand, st.attempt, st.traits); stopCamera(); st.stroke = r.pts; await success(cand); return; }
    st.tried.push(cand);
    await REACT[pickReact(isNearMiss(cand, best, st.traits))](cand);
    await wait(500);
  }
}
function logResult(w, attempts, tr) {
  try {
    const row = { wand_id: w.id, attempts, input_mode: st.input === 'cam' ? 'camera' : 'pointer', language: lang, device_type: deviceType() };
    for (const k of ['speed', 'amp', 'sharp', 'flow', 'curl']) row[k] = +clamp(tr[k]).toFixed(3);
    const mean = f => st.obs.reduce((s, o) => s + f(o), 0) / st.obs.length;
    row.wave_len = +clamp(mean(o => o.len / MIN), 0, 100).toFixed(2); row.wave_dur = +clamp(mean(o => o.dur), 0, 60).toFixed(2);
    postRow('wand_results', row);
  } catch (_) { }
}
function recentWins() { try { const a = JSON.parse(localStorage.getItem('wand-recent')); return Array.isArray(a) ? a : []; } catch (_) { return []; } }
function rememberWin(id) { try { localStorage.setItem('wand-recent', JSON.stringify([id, ...recentWins()].slice(0, RECENT.length))); } catch (_) { } }
// No reaction repeats within the last 4, the near-miss fizzle included.
function pickReact(near) {
  const recent = st.lastReacts;
  const kind = near && !recent.includes('fizzle') ? 'fizzle' : pick(Object.keys(REACT).filter(k => k !== 'fizzle' && !recent.includes(k)));
  recent.push(kind); while (recent.length > 4) recent.shift();
  return kind;
}
function tipOrCenter() { return st.wand ? wandTip(st.wand) : [W / 2, H * .4]; }
function failNote(kind) { const L2 = FAIL[kind]; setNote(() => ({ kicker: T('ollK'), hand: L(L2[0]), instr: L(L2[1]) }), true); }
function shake() { const a = $('#app'); a.classList.remove('shake'); void a.offsetWidth; a.classList.add('shake'); }
function flashAt(x, y, peak = .7, dur = 700) { const f = $('#flash'); f.style.setProperty('--fx', x + 'px'); f.style.setProperty('--fy', y + 'px'); f.animate([{ opacity: peak }, { opacity: 0 }], { duration: dur, easing: 'ease-out' }); }
const REACT = {
  async fizzle() { const [x, y] = tipOrCenter(); failNote('fizzle'); SFX.fizz(); for (let i = 0; i < 5; i++) setTimeout(() => spark(x, y + i * 4, 5, 1, 1.2), i * 140); await wait(700); if (st.wand) st.wand.mode = 'sink'; await wait(1700); st.wand = null; },
  async drop() { const o = st.wand; failNote('drop'); if (o) Object.assign(o, { mode: 'fall', vx: (Math.random() - .5) * 3, vy: -2.5, vr: (Math.random() - .5) * .3, bounces: 0 }); await wait(2000); if (st.wand) st.wand.fadeOut = true; await wait(500); },
  async fly() { const o = st.wand; failNote('fly'); SFX.whoosh(); if (o) { o.mode = 'fly'; o.t0 = performance.now(); } await wait(380); flashAt(W / 2, H / 2, .75, 650); shake(); await wait(1500); st.wand = null; },
  async crack() { const o = st.wand; failNote('crack'); SFX.crack(); if (o) { o.mode = 'crack'; o.t0 = performance.now(); o.split = 0; o.dy = 0; spark(o.x, o.y, 40, 4.5, 2); for (let i = 0; i < 6; i++) st.puffs.push({ x: o.x + (Math.random() - .5) * 30, y: o.y, vx: (Math.random() - .5) * .8, vy: -.4 - Math.random() * .6, r: 10, gr: .5, life: 1600, max: 1600, col: '120,110,100' }); } await wait(2200); st.wand = null; },
  async avalanche() {
    failNote('avalanche'); shake(); SFX.thud(); st.flameOut = performance.now() + 900; const [x, y] = tipOrCenter(); spark(x, y, 40, 5, 2.2);
    for (let i = 0; i < 16; i++) setTimeout(() => st.falling.push({ x: W * (.06 + Math.random() * .88), y: -30 - Math.random() * 120, vx: (Math.random() - .5) * 3, vy: Math.random() * 2, rot: Math.random() * 3, vr: (Math.random() - .5) * .3, w: 40 + Math.random() * 40, h: 14 + Math.random() * 6, col: shadeHex(PAL[i % PAL.length], 1.3) }), i * 60);
    if (st.wand) Object.assign(st.wand, { mode: 'fall', vx: 0, vy: 0, vr: .15, bounces: 0 }); await wait(2300); if (st.wand) st.wand.fadeOut = true; await wait(400);
  },
  async blackout() { failNote('blackout'); SFX.low(); st.darkT = .9; st.flameOut = performance.now() + 2200; if (st.wand) st.wand.fadeOut = true; await wait(1900); st.darkT = 0; await wait(900); for (let i = 0; i < 4; i++) setTimeout(() => SFX.crackle(), i * 120); },
  async bubbles() { failNote('bubbles'); SFX.blips(); const t0 = performance.now(); while (performance.now() - t0 < 1300) { const [x, y] = tipOrCenter(); for (let i = 0; i < 3; i++) st.bubbles.push({ x, y, vx: (Math.random() - .5) * 2.4, vy: -1 - Math.random() * 1.8, r: 6 + Math.random() * 22, p: Math.random() * 6, life: 1200 + Math.random() * 1600 }); await wait(90); } if (st.wand) st.wand.mode = 'sink'; await wait(1600); st.wand = null; },
  async butterflies() { failNote('butterflies'); SFX.flutter(); const [x, y] = tipOrCenter(); for (let i = 0; i < 18; i++) st.flies.push({ x, y, vx: (Math.random() - .5) * 5, vy: -1 - Math.random() * 3, s: 7 + Math.random() * 7, p: Math.random() * 6, h: [40, 320, 190, 20, 280][i % 5], life: 2600 + Math.random() * 1200 }); if (st.wand) st.wand.fadeOut = true; await wait(2600); },
  async snow() { failNote('snow'); SFX.wind(); st.frostT = 1; st.windUntil = performance.now() + 1800; st.wind = [W / 2, H / 3]; const [x, y] = tipOrCenter(); for (let i = 0; i < 70; i++) { const a = Math.random() * 6.283, v = 2 + Math.random() * 6; st.inSnow.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: 1 + Math.random() * 2.4, p: Math.random() * 6 }); } for (let i = 0; i < 200; i++) st.inSnow.push({ x: Math.random() * W, y: -Math.random() * H * .8, vx: (Math.random() - .5) * 2, vy: 1 + Math.random() * 2, r: .8 + Math.random() * 2.2, p: Math.random() * 6 }); $('#shop').classList.add('wind'); if (st.wand) st.wand.fadeOut = true; await wait(2400); st.frostT = 0; $('#shop').classList.remove('wind'); await wait(300); },
  async smoke() { failNote('smoke'); SFX.puff(); const [x, y] = tipOrCenter(); const cols = ['110,160,110', '150,110,170', '120,120,130']; for (let i = 0; i < 26; i++) st.puffs.push({ x: x + (Math.random() - .5) * 40, y: y + (Math.random() - .5) * 40, vx: (Math.random() - .5) * 2.5, vy: (Math.random() - .5) * 2 - .3, r: 20 + Math.random() * 30, gr: .8 + Math.random() * 1.2, life: 1800 + Math.random() * 900, max: 2700, col: pick(cols) }); if (st.wand) st.wand.fadeOut = true; await wait(2500); }
};
async function success(w) {
  st.winner = w; const o = st.wand; const vi = Math.floor(Math.random() * 3);
  const cx = W / 2, cy = Math.max(H * .3, Math.min(H * .42, noteTop() - MIN * .35));
  if (o) Object.assign(o, { mode: 'rise', tx: cx, ty: cy, fadeOut: false });
  const lines = WIN[Math.floor(Math.random() * WIN.length)];
  setNote(() => ({ kicker: T('ollK'), hand: L(lines[0]), instr: L(lines[1]) }), true);
  SFX.reveal(); st.flareUntil = performance.now() + 2600; spark(cx, cy, 60, 4, 2.2);
  if (vi === 0) { st.wind = [cx, cy]; st.windUntil = performance.now() + 2800; $('#shop').classList.add('wind'); }
  else if (vi === 1) { for (let i = 0; i < 26; i++) setTimeout(() => { for (let j = 0; j < 6; j++) st.sparks.push({ x: Math.random() * W, y: -10, vx: (Math.random() - .5) * .6, vy: 1 + Math.random() * 2, life: 2600, max: 2600, r: 1.2 + Math.random() * 1.6, hue: 'rain' }); }, i * 70); }
  else { st.halo = { x: cx, y: cy, t0: performance.now() }; }
  if (st.stroke && st.stroke.length > 2) st.replay = { pts: smoothPath(fitStroke(st.stroke, cx, cy, Math.min(W * .9, MIN * .8), Math.min(H * .5, MIN * .62))), t0: performance.now() + 300 };
  await wait(3600); $('#shop').classList.remove('wind');
  showResult();
}

/* ================= result ================= */
function specText(w) { return w.spec ? [L(w.spec.wood), L(w.spec.core), L(w.spec.len), L(w.spec.flex)].filter(Boolean).join(' · ') : ''; }
function fillResult() {
  const w = st.winner; if (!w) return;
  $('#rKicker').textContent = T('rKicker'); $('#rName').textContent = L(w.name); $('#rRare').hidden = !w.rare; $('#rRareT').textContent = T('rare');
  const spc = $('#rSpecs'); spc.textContent = specText(w); spc.hidden = !w.spec;
  $('#rLore').textContent = L(w.lore);
  $('#bShare').textContent = T('share'); $('#bDown').textContent = T('download'); $('#bAgain').textContent = T('again');
  $('#rSavedCap').textContent = T('saveHold');
  refreshCard();
}
function showResult() {
  fillResult(); stopCamera(); setShareMode(canShareFiles());
  const res = $('#result'); res.hidden = false; res.scrollTop = 0; st.wand = null; note.classList.remove('show'); st.noteFn = null;
  requestAnimationFrame(() => {
    res.classList.add('show'); const w = st.winner;
    const rw = $('#rWand'), cw = rw.clientWidth, chh = rw.clientHeight, x = sizeCanvas(rw, cw, chh); drawWand(x, cw / 2, chh / 2, Math.min(cw * .92, 420) * (.8 + .2 * (w.lenN - 9.5) / 5.5), -.05, w, .5);
    show3D(w);
  });
}
// When the card can't fit and scrolls, the top buttons step aside instead of covering it.
$('#result').addEventListener('scroll', e => { $('.topbar').classList.toggle('away', e.target.scrollTop > 8); }, { passive: true });
$('#bAgain').addEventListener('click', () => {
  $('.topbar').classList.remove('away');
  const res = $('#result'); res.classList.remove('show'); setTimeout(() => { res.hidden = true; }, 700); hide3D();
  st.replay = null; st.trails = []; st.halo = null; st.winner = null;
  const lastWave = st.obs[st.obs.length - 1];
  setTimeout(async () => {
    if (st.input === 'cam') { try { await withTimeout(startCamera(), 8000); } catch (e) { st.input = 'pointer'; stopCamera(); } }
    ritual(lastWave);
  }, 650);
});
function fitStroke(pts, cx, cy, mw, mh) {
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const p of pts) { x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y); x1 = Math.max(x1, p.x); y1 = Math.max(y1, p.y); }
  const k = Math.min(mw / Math.max(1, x1 - x0), mh / Math.max(1, y1 - y0)); const mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
  return pts.map(p => ({ x: cx + (p.x - mx) * k, y: cy + (p.y - my) * k }));
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

/* ================= share card ================= */
const siteUrl = () => location.origin + location.pathname;
function wrapText(c, text, x, y, maxW, lh) { const words = text.split(' '); let line = '', yy = y; for (const w of words) { const t = line ? line + ' ' + w : w; if (c.measureText(t).width > maxW && line) { c.fillText(line, x, yy); line = w; yy += lh; } else line = t; } if (line) c.fillText(line, x, yy); return yy + lh; }
async function makeCard() {
  try { await document.fonts.ready; } catch (_) { }
  const w = st.winner, CW = 1080, CH = 1350, c = document.createElement('canvas'); c.width = CW; c.height = CH; const x = c.getContext('2d');
  let g = x.createRadialGradient(CW / 2, 300, 50, CW / 2, 600, 1100); g.addColorStop(0, '#2e1b10'); g.addColorStop(1, '#0b0604'); x.fillStyle = g; x.fillRect(0, 0, CW, CH);
  x.strokeStyle = 'rgba(217,180,106,.75)'; x.lineWidth = 3; x.strokeRect(40, 40, CW - 80, CH - 80); x.strokeStyle = 'rgba(217,180,106,.3)'; x.lineWidth = 1.5; x.strokeRect(56, 56, CW - 112, CH - 112);
  const serif = "'Cormorant Garamond', Georgia, serif";
  x.textAlign = 'center'; x.fillStyle = '#c79a55'; x.font = `700 34px ${serif}`; x.fillText(T('cardK').toUpperCase().split('').join(' '), CW / 2, 170);
  const tg = x.createLinearGradient(0, 190, 0, 420); tg.addColorStop(0, '#fff2cc'); tg.addColorStop(1, '#c9944a'); x.fillStyle = tg; x.font = `700 84px ${serif}`;
  wrapText(x, L(w.name), CW / 2, 290, 900, 92);
  drawWand(x, CW / 2, 650, 880 * (.8 + .2 * (w.lenN - 9.5) / 5.5), -.05, w, .6);
  x.fillStyle = '#ecdcb8'; x.font = `italic 500 44px ${serif}`; wrapText(x, L(w.lore), CW / 2, 910, 860, 56);
  // the default Vercel address is long, so the font shrinks to keep it inside the frame
  x.fillStyle = '#e8c27a'; let hostPx = 38; do { x.font = `600 ${hostPx}px ${serif}`; } while (x.measureText(location.host).width > 900 && --hostPx > 18); x.fillText(location.host, CW / 2, 1230);
  return new Promise(r => c.toBlob(r, 'image/png'));
}
// Made ahead of the click: browsers only allow the share sheet right after a tap, with no long wait before it.
let cardBlob = null;
function refreshCard() { cardBlob = null; const job = makeCard().then(b => { if (refreshCard.job === job) cardBlob = b; return b; }); refreshCard.job = job; return job; }
const cardFile = async () => new File([cardBlob || await refreshCard.job], lang === 'en' ? 'my-wand.png' : 'moya-palychka.png', { type: 'image/png' });
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

/* ================= language ================= */
function applyLang() {
  document.documentElement.lang = lang === 'en' ? 'en' : 'uk'; document.title = T('title'); $('#street').setAttribute('aria-label', T('streetA')); $('#shop').setAttribute('aria-label', T('shopA'));
  $('#stT').textContent = T('title'); $('#stS').textContent = T('sub'); $('#cta').textContent = T('cta'); $('#stFan').textContent = T('fan');
  $('#sign1').textContent = T('sign1'); $('#sign2').textContent = T('sign2');
  document.querySelectorAll('#lang button').forEach(b => b.classList.toggle('on', b.dataset.l === lang));
  sndBtn.setAttribute('aria-label', T(A.on ? 'sndOff' : 'sndOn'));
  setViewBoxes(); // the title's height depends on the language
  if (st.noteFn) renderNote();
  if (!$('#result').hidden) fillResult();
}
document.querySelectorAll('#lang button').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); lang = b.dataset.l; try { localStorage.setItem('wand-lang', lang); } catch (_) { } applyLang(); }));

/* ================= enter ================= */
async function enterShop() {
  if (st.phase !== 'street') return; st.phase = 'entering';
  // Browsers allow sound only after a tap, so the entry tap is what starts it.
  if (A.on) { audioInit(); if (A.ctx && A.ctx.state === 'suspended') A.ctx.resume(); SFX.bell(); }
  $('#cta').style.opacity = 0; $('#stFan').style.opacity = 0; $('#stTitle').style.opacity = 0; $('#stTitle').style.transform = 'translateY(-20px)';
  const dr = $('#doorHit').getBoundingClientRect(), cx = dr.left + dr.width / 2, cy = dr.top + dr.height * .55;
  ['stSky', 'stTown', 'stShop', 'stFg'].map(id => layers[id]).forEach(Ly => { const r = Ly.el.getBoundingClientRect(); Ly.el.style.transformOrigin = `${(cx - r.left) / Ly.s}px ${(cy - r.top) / Ly.s}px`; });
  const fl = $('#flash'); fl.style.setProperty('--fx', cx + 'px'); fl.style.setProperty('--fy', cy + 'px');
  const leaf = $('#doorLeaf'), dur = 1900, t0 = performance.now();
  const shop = $('#shop'); shop.hidden = false; st.shopVisible = true; buildInterior();
  ['shBack', 'shMid', 'shFront'].forEach(id => layers[id].s = 1.32); shop.style.opacity = 0; fx.style.opacity = 0;
  await new Promise(res => {
    const step = () => {
      const t = clamp((performance.now() - t0) / dur);
      const d = easeOut(clamp(t / .35)); leaf.setAttribute('transform', `translate(528 0) scale(${(1 - .86 * d).toFixed(3)} 1) translate(-528 0)`);
      const z = easeIO(clamp((t - .12) / .88));
      layers.stSky.s = 1 + .25 * z; layers.stTown.s = 1 + 1.6 * z; layers.stShop.s = 1 + 6 * Math.pow(z, 1.7); layers.stFg.s = 1 + 9 * Math.pow(z, 1.5);
      layers.stShop.blur = z > .5 ? (z - .5) * 10 : 0; layers.stFg.blur = z * 8;
      fl.style.opacity = clamp((t - .5) / .4); drawSnow(performance.now(), 1 - z);
      if (t < 1) requestAnimationFrame(step); else res();
    };
    step();
  });
  $('#street').hidden = true; shop.style.opacity = 1; const t1 = performance.now();
  await new Promise(res => {
    const step = () => {
      const t = clamp((performance.now() - t1) / 1300), e = easeOut(t);
      ['shBack', 'shMid', 'shFront'].forEach((id, i) => layers[id].s = 1 + (.32 + i * .08) * (1 - e));
      fl.style.opacity = 1 - easeOut(clamp(t / .75)); fx.style.opacity = clamp((t - .4) / .6);
      if (t < 1) requestAnimationFrame(step); else res();
    };
    step();
  });
  st.phase = 'shop';
  setNote(() => (IN_APP
    ? { kicker: T('shopK'), hand: T('introH'), instr: T('introI') + ' ' + T('inAppHint'), btns: [{ label: T('bDraw'), fn: choosePointer }] }
    : { kicker: T('shopK'), hand: T('introH'), instr: T('introI'), btns: [{ label: T('bCam'), fn: chooseCam }, { label: T('bDraw'), fn: choosePointer, ghost: true }] }));
}
function choosePointer() { st.input = 'pointer'; stopCamera(); ritual(); }
function camFallback(key) {
  stopCamera(); st.input = 'pointer';
  setNote(() => ({ kicker: T('shopK'), hand: T('camFailH'), instr: T(key), btns: [{ label: T('bGo'), fn: () => ritual() }] }), true);
}
async function chooseCam() {
  st.input = 'cam'; let offer = false; const waiting = () => st.input === 'cam' && !cam.on;
  setNote(() => ({ kicker: T('shopK'), hand: T('camLoadH'), instr: T('camLoadI'), btns: offer ? [{ label: T('bInstead'), ghost: true, fn: choosePointer }] : [] }), true);
  const t6 = setTimeout(() => { if (waiting()) { offer = true; renderNote(); setStatus(T('camSlow')); } }, 6000);
  // 15 s to load once the camera is allowed, 30 s for an unanswered prompt. A grant arriving after the fallback is dropped in openStream.
  const giveUp = () => { if (waiting()) camFallback('camTimeout'); }; let limit = setTimeout(giveUp, 30000);
  cam.onGrant = () => { clearTimeout(limit); limit = setTimeout(giveUp, 15000); };
  try { if (await startCamera()) ritual(); }
  catch (e) { if (st.input === 'cam') camFallback(camErrKey(e)); } // otherwise the person has already moved on to the pointer
  finally { clearTimeout(t6); clearTimeout(limit); cam.onGrant = null; }
}
function buildInterior() { drawBack(); drawMid(); drawFront(); initFX(); }
// A tap enters the shop. A drag moves the scene instead, like the mouse on desktop, and eases back to the drift on release.
const street = $('#street');
street.addEventListener('pointerdown', e => { if (e.pointerType === 'touch') Object.assign(touch, { on: true, moved: false, x: e.clientX, y: e.clientY }); });
street.addEventListener('pointermove', e => {
  if (!touch.on) return;
  if (Math.hypot(e.clientX - touch.x, e.clientY - touch.y) > 10) touch.moved = true;
  if (!reduceMotion) { par.tx = clamp(e.clientX / W * 2 - 1, -1, 1); par.ty = clamp(e.clientY / H * 2 - 1, -1, 1); }
});
const endTouch = () => { touch.on = false; }; street.addEventListener('pointerup', endTouch); street.addEventListener('pointercancel', endTouch);
street.addEventListener('click', () => { if (touch.moved) { touch.moved = false; return; } enterShop(); });
addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && st.phase === 'street') enterShop(); });

/* ================= boot ================= */
function onResize() {
  W = innerWidth; H = innerHeight; MIN = Math.min(W, H);
  setViewBoxes(); initSnow();
  if (st.shopVisible) { drawBack(); drawMid(); drawFront(); fxc = sizeCanvas(fx, W, H); }
}
let rT = 0; addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(onResize, 120); });
buildSky(); buildTown(); buildFg(); buildGarland(); setViewBoxes(); initSnow(); applyLang();
let last = performance.now();
function frame(t) {
  requestAnimationFrame(frame); // first, so an error in one frame can't stop the game
  const dt = Math.min(50, t - last); last = t; now = t;
  updatePar(t);
  if (st.phase === 'street') drawSnow(t);
  camTick(t);
  if (st.shopVisible && fxc) { liveTick(t); drawFX(t, dt); if (A.on && t > A.nextCrackle) { SFX.crackle(); A.nextCrackle = t + 120 + Math.random() * 500; } }
}
requestAnimationFrame(frame);
