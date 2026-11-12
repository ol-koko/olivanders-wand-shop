'use strict';
// The wand shop. Runs after logic.js and core.js, and reads their top-level names directly.

/* ================= strings ================= */
Object.assign(S, {
  title: ['Крамниця Олівандера', 'Ollivanders'],
  streetA: ['Зимова вулиця перед крамницею', 'A winter street in front of the shop'],
  shopA: ['Крамниця паличок', 'The wand shop'],
  sub: ['Серед тисяч паличок одна чекає саме на тебе', 'Among thousands of wands, one is waiting just for you.'],
  cta: ['Знайти свою паличку', 'Find your wand'],
  postQ: ['Вже маєш паличку?', 'Got a wand?'],
  postHall: ['До Гоґвортсу', 'To Hogwarts'],
  postA: ['Вже маєш паличку? До Гоґвортсу, на церемонію розподілу', 'Got a wand? On to Hogwarts, for the Sorting Ceremony'],
  postBank: ['Платформа 9¾', 'Platform 9¾'],
  postPub: ['Косий провулок', 'Diagon Alley'],
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
// The signpost: the top board leads to the Sorting Ceremony, the other two only swing. Built once in local units, placed by placePost.
function buildPost() {
  const s = $('#svgFg');
  s.insertAdjacentHTML('afterbegin', `<defs><linearGradient id="gPost" x1="0" x2="1"><stop offset="0" stop-color="#2a1a0e"/><stop offset=".45" stop-color="#6a4626"/><stop offset="1" stop-color="#24160b"/></linearGradient>
  <linearGradient id="gBoard" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></linearGradient>
  <filter id="fPostGlow" x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation="9"/></filter></defs>`);
  const snow = (x0, x1, y) => `<path d="M${x0 + 2},${y + 1} Q${x0 + 20},${y - 6} ${(x0 + x1) / 2},${y - 3} Q${x1 - 20},${y - 7} ${x1 - 2},${y + 1} Q${(x0 + x1) / 2},${y + 3} ${x0 + 2},${y + 1}Z" fill="#eef3fb"/>`;
  // a painted plank with a rough end and a pointed one
  const board = (x0, x1, y0, h, left, fill) => { const m = y0 + h / 2, y1 = y0 + h; return left
    ? `M${x0},${m} L${x0 + 20},${y0} L${x1 - 3},${y0 + 1} L${x1 + 2},${y0 + h * .3} L${x1 - 2},${y0 + h * .55} L${x1 + 3},${y1 - 2} L${x0 + 20},${y1}Z`
    : `M${x1},${m} L${x1 - 20},${y0} L${x0 + 2},${y0 + 1} L${x0 - 3},${y0 + h * .35} L${x0 + 1},${y0 + h * .6} L${x0 - 2},${y1 - 1} L${x1 - 20},${y1}Z`; };
  const plank = (d, fill) => `<path d="${d}" fill="${fill}"/><path d="${d}" fill="url(#gBoard)"/><path d="${d}" fill="none" stroke="#120a06" stroke-opacity=".6" stroke-width="1.5"/>`;
  const b1 = board(-232, 24, 6, 66, true), b2 = board(-150, 66, 82, 36, false), b3 = board(-182, 22, 126, 36, true);
  s.insertAdjacentHTML('beforeend', `<g id="post"><rect id="postBar" x="-7" y="-14" width="14" height="100" fill="url(#gPost)"/>
    <path d="M-10,-14 L0,-26 L10,-14Z" fill="#24160b"/><path d="M-11,-15 Q0,-30 11,-15" stroke="#eef3fb" stroke-width="4" fill="none" stroke-linecap="round"/>
    <a id="postHall" href="/sorting"><path class="glow" d="${b1}" fill="#ffcf7a" filter="url(#fPostGlow)"/>${plank(b1, '#4a2d55')}${snow(-212, 22, 6)}
      <path class="ring" d="${b1}" fill="none" stroke="#f4d895" stroke-width="3"/>
      <text id="postQ" x="-102" y="31" text-anchor="middle" font-family="Cormorant Garamond,Georgia,serif" font-style="italic" font-weight="600" font-size="17" fill="#e8d7b0"></text>
      <text id="postHallT" x="-102" y="60" text-anchor="middle" font-family="Cormorant Garamond,Georgia,serif" font-weight="700" font-size="27" letter-spacing=".5" fill="#f0cd84"></text>
      <circle cx="0" cy="22" r="2.2" fill="#1a1008"/><circle cx="0" cy="56" r="2.2" fill="#1a1008"/></a>
    <g class="sw" id="postBank">${plank(b2, '#8a8296')}${snow(-146, 46, 82)}<text id="postBankT" x="-78" y="107" text-anchor="middle" font-family="Cormorant Garamond,Georgia,serif" font-weight="700" font-size="20" fill="#2a1f34"></text><circle cx="0" cy="100" r="2" fill="#1a1008"/></g>
    <g class="sw" id="postPub">${plank(b3, '#5c2236')}${snow(-162, 20, 126)}<text id="postPubT" x="-82" y="151" text-anchor="middle" font-family="Cormorant Garamond,Georgia,serif" font-weight="700" font-size="20" fill="#e9cfa0"></text><circle cx="0" cy="144" r="2" fill="#1a1008"/></g>
  </g>`);
}
// Where there is street to the right of the shop it stands there; on narrow screens it rises into the sky at the right edge, below the title.
function placePost(vbX, vbY, vbW, vbH, title) {
  const ppu = H * 1.08 / vbH, xR = 500 + vbW / 2 / 1.08, yTop = vbY + vbH * (1 - 1 / 1.08) / 2, tU = yTop + title / ppu;
  let x, top, k;
  if (xR - 704 >= 300) { k = Math.min(clamp(28 / (27 * ppu), .8, 1.6), (xR - 724) / 300); x = Math.min(xR - 60 * k, Math.max(940, 724 + 236 * k)); /* the boards stay clear of the shop */ top = Math.max(945 - 400 * k, tU + 40 * k); }
  else { k = clamp(21 / (27 * ppu), .8, 1.3); x = xR - 34 * k; top = tU + 34 * k; }
  $('#post').setAttribute('transform', `translate(${x.toFixed(1)} ${top.toFixed(1)}) scale(${k.toFixed(3)})`);
  $('#postBar').setAttribute('height', ((946 - top) / k + 14).toFixed(1));
}
function fitPostText() { // long words in either language stay on their boards
  [['#postQ', 210], ['#postHallT', 214], ['#postBankT', 136], ['#postPubT', 176]].forEach(([id, max]) => { const t = $(id); t.removeAttribute('textLength'); try { if (t.getComputedTextLength() > max) { t.setAttribute('textLength', max); t.setAttribute('lengthAdjust', 'spacingAndGlyphs'); } } catch (_) { } });
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
  placePost(vbX, vbY, vbW, vbH, $('#stTitle').getBoundingClientRect().bottom);
  $('#moonG').setAttribute('transform', a > .9 ? `translate(${Math.min(-210, 200 - 400 * vbH / H).toFixed(1)} 0)` : ''); // on wide screens keep the moon clear of the title
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
$('#camBox').insertAdjacentHTML('beforeend', PORTRAIT_FRAME);
const cam = { on: false, hl: null, worker: null, busy: false, sentAt: 0, warmed: null, loading: null, video: $('#camv'), stream: null, token: 0, fresh: false, lastT: -1, lastTs: 0, lastFrame: 0, errs: 0, fps: 0, fpsN: 0, fpsT: 0, sm: null, seen: -1e9, firstSeen: 0, hist: [] };
// Hand tracking runs on its own thread (hand-worker.js), so preparing the model can't freeze the game or stop its sound. If the worker can't start, it runs on the page as before.
function loadWorker() {
  return new Promise(resolve => {
    let w, timer; const done = ok => { clearTimeout(timer); if (ok) { cam.worker = w; w.onmessage = onWorker; w.onerror = workerLost; } else if (w) w.terminate(); resolve(ok); };
    try { w = new Worker('/hand-worker.js'); } catch (_) { w = null; return done(false); }
    timer = setTimeout(() => done(false), 25000);
    w.onmessage = e => done(e.data.type === 'ready'); w.onerror = () => done(false);
    w.postMessage({ type: 'init', MP, MODEL });
  });
}
function workerLost() { const w = cam.worker; cam.worker = null; cam.busy = false; cam.loading = null; if (w) w.terminate(); toPointer('camLost'); }
function onWorker(e) {
  const m = e.data; if (m.type !== 'result') return;
  cam.delegate = m.delegate;
  if (m.warm) { if (cam.warmed) cam.warmed(); return; }
  cam.busy = false; if (m.tok !== cam.token || !cam.on || !st.cap) return;
  if (m.err) { if (++cam.errs >= 5) toPointer('camLost'); return; }
  cam.errs = 0; camHand(m.marks, m.t);
}
function sendFrame(v, t) {
  cam.busy = true; cam.sentAt = t; const tok = cam.token;
  createImageBitmap(v).then(frame => { if (!cam.worker) { frame.close(); cam.busy = false; return; } cam.lastTs = Math.max(t, cam.lastTs + 1); cam.worker.postMessage({ type: 'frame', frame, ts: cam.lastTs, t, tok }, [frame]); })
    .catch(() => { cam.busy = false; if (++cam.errs >= 5) toPointer('camLost'); });
}
async function warmWorker() {
  try { const frame = await createImageBitmap(cam.video); cam.lastTs = Math.max(performance.now(), cam.lastTs + 1); await withTimeout(new Promise(r => { cam.warmed = r; cam.worker.postMessage({ type: 'frame', frame, ts: cam.lastTs, warm: true }, [frame]); }), 8000); } catch (_) { }
  cam.warmed = null;
}
function loadHand() {
  if (cam.hl || cam.worker) return Promise.resolve();
  if (!cam.loading) cam.loading = (async () => {
    if (await loadWorker()) return;
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
  if (A.on && A.ctx && A.ctx.state !== 'running') A.ctx.resume().catch(() => { }); // phones can interrupt the page's sound when the camera starts
}
async function startCamera() {
  const tok = ++cam.token;
  await Promise.all([openStream(tok), loadHand()]);
  if (tok !== cam.token) return false;
  // the first detection compiles the model and can freeze the page for seconds: do it now, while the "loading" note is up
  if (cam.worker) { await warmWorker(); if (tok !== cam.token) return false; }
  else try { cam.lastTs = Math.max(performance.now(), cam.lastTs + 1); cam.hl.detectForVideo(cam.video, cam.lastTs); } catch (_) { }
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
  if (!cam.on || !(cam.hl || cam.worker)) return; const v = cam.video;
  if (!st.cap) { cam.lastFrame = t; cam.fpsT = 0; return; } // nothing to capture: leave the frame budget to the reaction effects
  if (cam.busy) { if (t - cam.sentAt > 5000) workerLost(); return; } // one frame at a time, and the game never waits forever
  // new-frame callback when the browser fires it; otherwise check a few times a second that the video is still moving
  const moved = v.currentTime !== cam.lastT, fresh = cam.fresh || (moved && t - cam.lastFrame > 200);
  if (v.readyState < 2 || !fresh) { if (!moved && t - cam.lastFrame > 4000 && !document.hidden) toPointer('camLost'); return; }
  cam.fresh = false; cam.lastT = v.currentTime; cam.lastFrame = t;
  if (!cam.fpsT) { cam.fpsT = t; cam.fpsN = 0; } else { cam.fpsN++; if (t - cam.fpsT >= 1000) { cam.fps = cam.fpsN * 1000 / (t - cam.fpsT); cam.fpsN = 0; cam.fpsT = t; } }
  if (cam.worker) return sendFrame(v, t);
  cam.lastTs = Math.max(t, cam.lastTs + 1);
  let r; try { r = cam.hl.detectForVideo(v, cam.lastTs); cam.errs = 0; } catch (e) { if (++cam.errs >= 5) toPointer('camLost'); return; }
  camHand(r && r.landmarks && r.landmarks[0], t);
}
function camHand(lm, t) {
  const v = cam.video;
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
  setRecentWins(recentWins()); logStep('wand', 'input');
  st.obs = []; st.traits = null; st.tried = []; st.attempt = 0; st.history = []; st.stroke = null; st.winner = null; st.camHelp = false;
  let r;
  if (lastWave) { st.obs.push(lastWave); st.traits = mergeTraits(); }
  else {
    setNote(() => ({ kicker: T('warmK'), hand: T('warmH'), instr: T(st.input === 'cam' ? 'warmIcam' : 'warmIdraw') }));
    await wait(450);
    r = await captureWave(null); logStep('wand', 'warmup'); st.obs.push(r.m); st.traits = mergeTraits(); st.stroke = r.pts;
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
    r = await captureWave(cand); logStep('wand', 'attempt');
    st.obs.push(r.m); st.traits = mergeTraits();
    const best = bestWand(st.traits);
    if (isChosen(cand, best, st.attempt)) { rememberWin(cand.id); logResult(cand, st.attempt, st.traits); logStep('wand', 'result'); stopCamera(); st.stroke = r.pts; await success(cand); return; }
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
    postRow('wand_results', row, 'wand-plays');
  } catch (_) { }
}
function recentWins() { try { const a = JSON.parse(localStorage.getItem('wand-recent')); return Array.isArray(a) ? a : []; } catch (_) { return []; } }
function rememberWin(id) { try { localStorage.setItem('wand-recent', JSON.stringify([id, ...recentWins()].slice(0, RECENT.length))); localStorage.setItem('wand-last', JSON.stringify({ id, traits: st.traits, at: Date.now() })); } catch (_) { } } // wand-last stays in the browser: the Sorting Hat's first impression
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
$('#bAgain').addEventListener('click', () => {
  logStep('wand', 'again');
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
/* ================= share card ================= */
async function makeCard() {
  try { await document.fonts.ready; } catch (_) { }
  const w = st.winner, CW = 1080, CH = 1350, c = document.createElement('canvas'); c.width = CW; c.height = CH; const x = c.getContext('2d');
  cardFrame(x, CW, CH);
  x.textAlign = 'center'; x.fillStyle = '#c79a55'; x.font = `700 34px ${serif}`; x.fillText(T('cardK').toUpperCase().split('').join(' '), CW / 2, 170);
  const tg = x.createLinearGradient(0, 190, 0, 420); tg.addColorStop(0, '#fff2cc'); tg.addColorStop(1, '#c9944a'); x.fillStyle = tg; x.font = `700 84px ${serif}`;
  wrapText(x, L(w.name), CW / 2, 290, 900, 92);
  drawWand(x, CW / 2, 650, 880 * (.8 + .2 * (w.lenN - 9.5) / 5.5), -.05, w, .6);
  x.fillStyle = '#ecdcb8'; x.font = `italic 500 44px ${serif}`; wrapText(x, L(w.lore), CW / 2, 910, 860, 56);
  cardHost(x, CW);
  return new Promise(r => c.toBlob(r, 'image/png'));
}
const cardFileName = () => lang === 'en' ? 'my-wand.png' : 'moya-palychka.png';

/* ================= language ================= */
function applyLang() {
  document.documentElement.lang = lang === 'en' ? 'en' : 'uk'; document.title = T('title'); $('#street').setAttribute('aria-label', T('streetA')); $('#shop').setAttribute('aria-label', T('shopA'));
  $('#stT').textContent = T('title'); $('#stS').textContent = T('sub'); $('#cta').textContent = T('cta'); $('#stFan').textContent = T('fan');
  $('#sign1').textContent = T('sign1'); $('#sign2').textContent = T('sign2');
  $('#postQ').textContent = T('postQ'); $('#postHallT').textContent = T('postHall'); $('#postBankT').textContent = T('postBank'); $('#postPubT').textContent = T('postPub'); $('#postHall').setAttribute('aria-label', T('postA')); fitPostText();
  document.querySelectorAll('#lang button').forEach(b => b.classList.toggle('on', b.dataset.l === lang));
  sndBtn.setAttribute('aria-label', T(A.on ? 'sndOff' : 'sndOn'));
  setViewBoxes(); // the title's height depends on the language
  if (st.noteFn) renderNote();
  if (!$('#result').hidden) fillResult();
}
document.querySelectorAll('#lang button').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); lang = b.dataset.l; try { localStorage.setItem('wand-lang', lang); } catch (_) { } applyLang(); }));

/* ================= enter ================= */
async function enterShop() {
  if (st.phase !== 'street') return; st.phase = 'entering'; logStep('wand', 'enter');
  // Browsers allow sound only after a tap, so the entry tap is what starts it.
  if (A.on) { audioInit(); if (A.ctx && A.ctx.state === 'suspended') A.ctx.resume(); SFX.bell(); }
  $('#cta').style.opacity = 0; $('#stFan').style.opacity = 0; $('#stTitle').style.opacity = 0; $('#stTitle').style.transform = 'translateY(-20px)';
  const dr = $('#doorHit').getBoundingClientRect(), cx = dr.left + dr.width / 2, cy = dr.top + dr.height * .55;
  ['stSky', 'stTown', 'stShop', 'stFg'].map(id => layers[id]).forEach(Ly => { const r = Ly.el.getBoundingClientRect(); Ly.el.style.transformOrigin = `${(cx - r.left) / Ly.s}px ${(cy - r.top) / Ly.s}px`; });
  const fl = $('#flash'); fl.style.setProperty('--fx', cx + 'px'); fl.style.setProperty('--fy', cy + 'px');
  if (matchMedia('(hover:hover) and (pointer:fine)').matches) ['stSky', 'stTown', 'stShop', 'stFg'].forEach(id => { layers[id].el.style.willChange = 'transform'; }); // drawn once and only moved after that, which keeps a computer smooth. On phones it made the door frame stutter.
  // The signpost's blurred glow pulses all the time, and on phones redrawing it while its layer zooms tenfold made the door stutter. Nobody sees it by then.
  document.querySelectorAll('#postHall .glow').forEach(g => g.removeAttribute('filter')); document.getAnimations().forEach(a => { if (a instanceof CSSAnimation) a.cancel(); });
  const leaf = $('#doorLeaf'), dur = 1900;
  const shop = $('#shop'); shop.hidden = false; st.shopVisible = true; readyInterior();
  ['shBack', 'shMid', 'shFront'].forEach(id => layers[id].s = 1.32); shop.style.opacity = 0; fx.style.opacity = 0;
  const t0 = performance.now(); // after the drawing above, so a slow phone doesn't lose the start of the door
  await new Promise(res => {
    const step = () => {
      const t = clamp((performance.now() - t0) / dur);
      const d = easeOut(clamp(t / .35)); leaf.setAttribute('transform', `translate(528 0) scale(${(1 - .86 * d).toFixed(3)} 1) translate(-528 0)`);
      const z = easeIO(clamp((t - .12) / .88));
      layers.stSky.s = 1 + .25 * z; layers.stTown.s = 1 + 1.6 * z; layers.stShop.s = 1 + 6 * Math.pow(z, 1.7); layers.stFg.s = 1 + 9 * Math.pow(z, 1.5);
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
// Drawing the shop takes a noticeable moment, so it happens before the tap on the door, not during it.
let interiorFor = '';
function readyInterior() { const k = W + 'x' + H; if (k !== interiorFor) { buildInterior(); interiorFor = k; } }
addEventListener('load', () => setTimeout(() => { if (st.phase === 'street') readyInterior(); }, 700));
// A tap enters the shop. A drag moves the scene instead, like the mouse on desktop, and eases back to the drift on release.
const street = $('#street');
dragDepth(street);
street.addEventListener('click', e => {
  if (touch.moved) { touch.moved = false; return; }
  const hall = e.target.closest('#postHall'), sw = e.target.closest('.sw');
  if (hall) { e.preventDefault(); toHall(); return; }
  if (sw) { sw.classList.remove('swing'); void sw.getBoundingClientRect(); sw.classList.add('swing'); return; } // the other boards only swing
  enterShop();
});
addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && st.phase === 'street' && !e.target.closest?.('a')) enterShop(); });
// To the Sorting Ceremony: the street fades out first. Coming back with the browser's Back button shows the street again.
function toHall() {
  if (st.phase !== 'street') return; st.phase = 'leaving'; logStep('wand', 'to_sorting');
  const go = () => { location.href = '/sorting'; };
  if (reduceMotion) return go();
  const app = $('#app'); app.style.transition = 'opacity .45s'; app.style.opacity = 0; setTimeout(go, 430);
}
addEventListener('pageshow', e => { if (e.persisted && st.phase === 'leaving') { st.phase = 'street'; $('#app').style.opacity = 1; } });

/* ================= boot ================= */
function onResize() {
  W = innerWidth; H = innerHeight; MIN = Math.min(W, H);
  setViewBoxes(); initSnow();
  if (st.shopVisible) { drawBack(); drawMid(); drawFront(); fxc = sizeCanvas(fx, W, H); }
}
let rT = 0; addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(onResize, 120); });
buildSky(); buildTown(); buildFg(); buildPost(); buildGarland(); setViewBoxes(); initSnow(); applyLang();
// The street waits for the title's real font, because the title's height sets the street's scale. Shown after that, nothing jumps. A slow font doesn't hold it up for long.
Promise.race([document.fonts.ready, wait(900)]).then(() => { setViewBoxes(); $('#street').classList.add('ready'); });
document.fonts.ready.then(() => { if (st.phase === 'street') setViewBoxes(); });
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
logStep('wand', 'open');
