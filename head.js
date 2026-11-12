'use strict';
// Answering the Hat with the head: point the face at an answer and hold still. Reading is not choosing: every screen first gives time to read, when nothing lights up
// and nothing can be picked. Then the answer pointed at lights up and the timer runs in the camera mirror: an hourglass over the picture, the gold ring filling around it
// and 3-2-1 at the end. A full ring picks the answer exactly as a tap does, and a back arrow takes an answer picked by the head back.
// Runs after hall.js and reads its names directly. The camera starts only on the player's tap. Only where the head points is read, on its own thread
// (head-worker.js): no face analysis, nothing recorded or sent, and the picture never leaves the browser. Taps and swipes keep working throughout.
// Any trouble (no camera, a refused prompt, a slow model, a lost face for too long, a hidden tab that can't come back) turns it off quietly: the player taps instead.

Object.assign(S, {
  bHead: ['Відповідати головою', 'Answer with my head'],
  bTap: ['Без камери? Відповідати дотиком', 'No camera? Tap instead'],
  headLoad: ['Готую чари. Якщо браузер спитає про камеру, дозволь її.', 'Preparing the charm. If your browser asks about the camera, allow it.'],
  headPriv: ['Камера бачить лише, куди дивиться голова. Нічого не записується й не надсилається.', 'The camera only reads where your head points. Nothing is recorded or sent.'],
  // The intro scroll: the neutral pose is learned while the player reads it. Neutral is the middle of the answers, which sit on the scroll: on a computer the Hat is far above them.
  headIntroH: ['Читай спокійно. Поки читаєш, нічого не вибирається.', 'Read calmly. Nothing is chosen while you read.'],
  headIntroI: ['Щоб відповісти, поверни обличчя до відповіді й тримай, доки в дзеркалі мине 3-2-1. Відвернешся, і відлік скинеться. Готово? Опусти обличчя до кнопки й потримай, або торкнись її.',
    'To answer, point your face at an answer and hold until the mirror counts 3-2-1. Look away and the count resets. Ready? Lower your face toward the button and hold, or tap it.'],
  bGo: ['Почати', 'Start'],
  headBack: ['Повернутися до попереднього запитання', 'Back to the previous question'],
  headBackWish: ['Скасувати вибір факультету', 'Take the house back'],
  headLost: ['Не бачу обличчя. Подивись на екран.', 'I can’t see your face. Look at the screen.'],
  headDenied: ['Без камери теж можна: просто торкнись відповіді.', 'No camera is fine too: just tap your answer.'],
  headFail: ['Камера не відповідає, тож відповідай дотиком.', 'The camera isn’t answering, so tap your answers.'],
});

const HEAD_MP = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14';
const HEAD_MODEL = 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';
// Which way is right and which is up, as MediaPipe's angles read on the mirrored picture.
const HEAD_SIGN = { x: -1, y: deviceType() === 'desktop' ? -1 : 1 }; // y from the owner's tests: up is the other sign on a computer than on a phone held below the face
const HEAD_CALM = 30; // frames with a face to learn the neutral pose

/* ===== Head mode timings: tune here. All in milliseconds. ===== */
const HEAD_TIMING = {
  readMs: 5000,      // a question or the four banners: time to read before any answer can light up or be picked
  introArmMs: 4000,  // the intro scroll: time to read before «Почати» can be held with the head
  graceMs: 450,      // the face rests on an answer this long before the hold starts
  holdMs: 3500,      // the hold: the ring fills over this time, and a full ring picks the answer
  countdownMs: 3000, // the end of the hold, shown as 3-2-1 in the mirror
  wishGoMs: 2500,    // after the head picks a banner, how long the back arrow can take it back before the Hat goes on
};
const HEAD = { on: false, wanted: false, failed: false, phase: null, worker: null, stream: null, token: 0, busy: false, sentAt: 0, lastT: -1, lastFrame: 0, fresh: false, lastTs: 0,
  zero: null, samples: [], tracker: null, items: null, aim: null, seenAt: 0, lostSince: 0, intro: null, resume: false, warmed: null, readUntil: 0, digit: 0, undo: null, wishT: 0 };
const headVideo = $('#headCam');
// The mirror: the camera picture in the shop's portrait frame, glowing when a face is seen. While the player reads, a calm ring and a still hourglass. While an answer is held,
// the ring fills like a clock hand and the hourglass pours, and the last seconds count 3-2-1, all over the picture.
const headMirror = $('#headMirror'), HG = 'M4.5 3.5C4.5 10.5 9 12.5 9 15S4.5 19.5 4.5 26.5h11C15.5 19.5 11 17.5 11 15s4.5-4.5 4.5-11.5z';
headMirror.insertAdjacentHTML('beforeend', PORTRAIT_FRAME);
headMirror.firstElementChild.insertAdjacentHTML('beforeend', '<svg class="ring" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="31" pathLength="1"/></svg>'
  + `<svg class="hglass" viewBox="0 0 20 30" aria-hidden="true"><defs><clipPath id="hgClip"><path d="${HG}"/></clipPath></defs><path d="${HG}" fill="rgba(255,248,230,.35)"/>`
  + '<g clip-path="url(#hgClip)"><rect class="sand top" x="0" y="7" width="20" height="8"/><rect class="sand bot" x="0" y="18" width="20" height="8.5"/><line class="fall" x1="10" y1="15" x2="10" y2="26.5"/></g>'
  + `<path d="${HG}" fill="none" stroke="#f3dca8" stroke-width=".9"/><rect x="2" y="1" width="16" height="2.6" rx="1.2" fill="#d9b46a"/><rect x="2" y="26.4" width="16" height="2.6" rx="1.2" fill="#d9b46a"/></svg>`);
headMirror.firstElementChild.insertAdjacentHTML('beforeend', '<div class="count"></div>');
const headCount = headMirror.querySelector('.count');
// `state`: 'reading' while nothing can be picked. `digit`: 3, 2, 1 at the end of a hold, with a soft tick when the sound is on.
function headTimer(fill, state = '', digit = 0) {
  headMirror.style.setProperty('--f', fill.toFixed(3)); headMirror.classList.toggle('hold', fill > 0 && fill < 1);
  headMirror.classList.toggle('read', state === 'reading'); headMirror.classList.toggle('count', digit > 0);
  if (digit !== HEAD.digit) { HEAD.digit = digit; if (digit) { headCount.textContent = digit; if (A.on && A.ctx) tone(digit === 1 ? 990 : 780, .07, { vol: .045 }); } }
}
// The way in shows only where it can work: a secure page with a camera API, workers and frame grabbing, outside the in-app browsers that block cameras.
const headPossible = () => !IN_APP && !HEAD.failed && window.isSecureContext && !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) && !!window.Worker && !!window.createImageBitmap;

function headWorker() {
  return new Promise((resolve, reject) => {
    let w; try { w = new Worker('/head-worker.js'); } catch (e) { return reject(e); }
    const timer = setTimeout(() => { w.terminate(); reject(new Error('timeout')); }, 30000);
    w.onmessage = e => { clearTimeout(timer); if (e.data.type === 'ready') { w.onmessage = onHeadWorker; w.onerror = () => headOff('headFail'); resolve(w); } else { w.terminate(); reject(new Error(e.data.message || 'fail')); } };
    w.onerror = () => { clearTimeout(timer); w.terminate(); reject(new Error('worker')); };
    w.postMessage({ type: 'init', MP: HEAD_MP, MODEL: HEAD_MODEL });
  });
}
async function headStream(tok) {
  const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }, audio: false });
  if (tok !== HEAD.token) { stream.getTracks().forEach(t => t.stop()); throw new Error('stale'); }
  HEAD.stream = stream; headVideo.srcObject = stream; headMirror.hidden = false;
  stream.getVideoTracks().forEach(tr => tr.addEventListener('ended', () => { if (HEAD.stream === stream) headOff('headFail'); }));
  if (headVideo.requestVideoFrameCallback) { const f = () => { if (HEAD.stream === stream) { HEAD.fresh = true; headVideo.requestVideoFrameCallback(f); } }; headVideo.requestVideoFrameCallback(f); }
  await headVideo.play();
  if (A.on && A.ctx && A.ctx.state !== 'running') A.ctx.resume().catch(() => { }); // phones can interrupt the page's sound when the camera starts
}
// The first detection compiles the model and can take a while: done before the player is asked to look.
async function headWarm() {
  try { const frame = await createImageBitmap(headVideo); HEAD.lastTs = Math.max(performance.now(), HEAD.lastTs + 1); await withTimeout(new Promise(r => { HEAD.warmed = r; HEAD.worker.postMessage({ type: 'frame', frame, ts: HEAD.lastTs, warm: true }, [frame]); }), 8000); } catch (_) { }
  HEAD.warmed = null;
}
async function headCamera(tok) {
  await Promise.all([withTimeout(headStream(tok), 30000), HEAD.worker ? null : headWorker().then(w => { if (tok === HEAD.token) HEAD.worker = w; else w.terminate(); })]);
  if (tok !== HEAD.token) return false;
  await headWarm(); if (tok !== HEAD.token) return false;
  Object.assign(HEAD, { busy: false, lastFrame: performance.now(), zero: null, samples: [], lostSince: 0, seenAt: 0 });
  return true;
}

// The player's choice on the Hat's first screen. `again`: a new game after a head-mode game.
async function startHead(again = false) {
  if (!headPossible()) return beginQuestions();
  const tok = ++HEAD.token; HEAD.wanted = true; HEAD.on = true; HEAD.phase = 'load'; if (!again) HEAD.intro = st.noteFn; HEAD.again = again;
  note.classList.add('head');
  setNote(() => ({ kicker: T('hatK'), hand: T('headLoad'), instr: T('headPriv'), btns: [{ label: T('bTap'), cls: 'tapLink', fn: () => { headOff(); beginQuestions(); } }] }));
  try { if (!await headCamera(tok)) return; }
  catch (e) { if (tok === HEAD.token) headOff(e && (e.name === 'NotAllowedError' || e.name === 'SecurityError') ? 'headDenied' : 'headFail'); return; }
  HEAD.phase = 'intro'; setNote(headIntroNote);
  if (document.hidden) headSuspend();
}
// The intro scroll: how it works, with «Почати». It never goes on by itself. The neutral pose is learned while the player reads it; then, after a reading pause,
// lowering the face toward the button and holding presses it. A tap works at once.
const headIntroNote = () => ({ kicker: T('hatK'), hand: T('headIntroH'), instr: T('headIntroI'), btns: [{ label: T('bGo'), cls: 'hgo', fn: headStart }, { label: T('bTap'), cls: 'tapLink', fn: () => { headOff(); beginQuestions(); } }] });
function headStart() { if (HEAD.phase !== 'intro') return; HEAD.phase = 'play'; beginQuestions(); }

// Turns head mode off. With a message, the player learns why; during the set-up, back to the Hat's first screen without the head button.
function headOff(msg) {
  const was = HEAD.on, setup = HEAD.phase === 'load' || HEAD.phase === 'intro';
  HEAD.token++; HEAD.on = false; HEAD.wanted = false; HEAD.phase = null; HEAD.resume = false; headClear(); headCamOff(); note.classList.remove('head'); headSync();
  if (msg) { HEAD.failed = true; if (HEAD.worker) { HEAD.worker.terminate(); HEAD.worker = null; } }
  if (!was || !msg) return;
  if (setup && !HEAD.again && HEAD.intro) { setNote(HEAD.intro); setTimeout(() => setStatus(T(msg)), 400); return; } // the first screen again, now without the head button
  if (setup) { beginQuestions(); setTimeout(() => setStatus(T(msg)), 400); return; }
  if (st.noteFn) renderNote(); setStatus(T(msg));
}
// The Hat has its answers: the camera goes off, and a new game asks for it again.
function headDone() { if (!HEAD.on) return; HEAD.token++; HEAD.on = false; HEAD.phase = null; headClear(); headCamOff(); note.classList.remove('head'); headSync(); }
function headCamOff() {
  try { HEAD.stream && HEAD.stream.getTracks().forEach(t => t.stop()); } catch (_) { }
  HEAD.stream = null; headVideo.srcObject = null; headMirror.hidden = true; headMirror.classList.remove('seen'); headTimer(0); HEAD.busy = false;
}
function headClear() { if (HEAD.items) HEAD.items.forEach(b => b.classList.remove('aim', 'soon')); headTimer(0); HEAD.state = ''; HEAD.items = null; HEAD.aim = null; HEAD.tracker = null; HEAD.shape = ''; }

// A hidden tab stops the camera; coming back starts it again and learns the neutral pose again, on the same screen.
function headSuspend() { if (!HEAD.on) return; HEAD.resume = HEAD.phase; HEAD.token++; headClear(); headCamOff(); }
document.addEventListener('visibilitychange', async () => {
  if (document.hidden) return headSuspend();
  if (!HEAD.on || !HEAD.resume) return; const phase = HEAD.resume, tok = ++HEAD.token; HEAD.resume = false;
  try { if (!await headCamera(tok)) return; } catch (_) { if (tok === HEAD.token) headOff('headFail'); return; }
  HEAD.phase = phase === 'load' ? 'intro' : phase; HEAD.recal = true; if (phase === 'load') setNote(headIntroNote);
});

// What the head can pick on the current screen: «Почати» on the intro scroll, the answers, or the four banners. Nothing while the Hat talks or thinks.
function headTargets() {
  if (noteIn.classList.contains('fade')) return []; // between two screens the old buttons are still there for a moment
  if (HEAD.phase === 'intro') return [...document.querySelectorAll('#nBtns .hgo')];
  if (HEAD.phase !== 'play' || st.phase !== 'hall' || st.deciding) return [];
  if (st.picking) return [...document.querySelectorAll('#nBtns button:not(.tapLink)')];
  const w = $('#nBtns.wish'); return w && !st.avoiding ? [...w.querySelectorAll('.ban')] : [];
}

function headTick(t) {
  if (!HEAD.on || !HEAD.worker || !HEAD.stream || HEAD.phase === 'load') return;
  if (HEAD.busy) { if (t - HEAD.sentAt > 5000) headOff('headFail'); return; } // one frame at a time, and the game never waits forever
  const v = headVideo, moved = v.currentTime !== HEAD.lastT, fresh = HEAD.fresh || (moved && t - HEAD.lastFrame > 200);
  if (v.readyState < 2 || !fresh) { if (!moved && t - HEAD.lastFrame > 4000 && !document.hidden) headOff('headFail'); return; }
  if (t - HEAD.lastFrame < 30) return; // about 30 a second is plenty for a head
  HEAD.fresh = false; HEAD.lastT = v.currentTime; HEAD.lastFrame = t; HEAD.busy = true; HEAD.sentAt = t; const tok = HEAD.token;
  createImageBitmap(v).then(frame => { if (!HEAD.worker || tok !== HEAD.token) { frame.close(); HEAD.busy = false; return; } HEAD.lastTs = Math.max(t, HEAD.lastTs + 1); HEAD.worker.postMessage({ type: 'frame', frame, ts: HEAD.lastTs, t, tok }, [frame]); })
    .catch(() => { HEAD.busy = false; });
}
function onHeadWorker(e) {
  const m = e.data; if (m.type !== 'result') return;
  if (m.warm) { if (HEAD.warmed) HEAD.warmed(); return; }
  HEAD.busy = false; if (m.tok !== HEAD.token || !HEAD.on) return;
  headAngle(m.matrix ? HeadLogic.anglesFrom(m.matrix) : null, m.t || performance.now());
}
// One reading of the head: learn the neutral pose, then light, time and pick the answer it points at.
const median = (list, k) => { const v = list.map(x => x[k]).sort((p, q) => p - q); return v[v.length >> 1]; }; // a glance away while it learns doesn't count
function headAngle(a, t) {
  headMirror.classList.toggle('seen', !!a);
  if (!a) {
    if (!HEAD.lostSince) HEAD.lostSince = t;
    if (HEAD.tracker) HEAD.tracker.reset(); headUi(null, 0); HEAD.sm = null; // looking away resets the timer at once
    if (t - HEAD.lostSince > 1500 && $('#nStatus').textContent !== T('headLost')) setStatus(T('headLost'));
    if (t - HEAD.lostSince > 25000) headOff('headFail');
    return;
  }
  if (HEAD.lostSince && $('#nStatus').textContent === T('headLost')) setStatus('');
  HEAD.lostSince = 0;
  if (!HEAD.zero || HEAD.recal) {
    if (HEAD.recal) { HEAD.recal = false; HEAD.zero = null; HEAD.samples = []; HEAD.sm = null; }
    HEAD.samples.push(a); if (HEAD.samples.length < HEAD_CALM) return;
    HEAD.zero = { yaw: median(HEAD.samples, 'yaw'), pitch: median(HEAD.samples, 'pitch'), roll: median(HEAD.samples, 'roll') }; HEAD.samples = [];
    return;
  }
  const raw = { dx: (a.yaw - HEAD.zero.yaw) * HEAD_SIGN.x, dy: (a.pitch - HEAD.zero.pitch) * HEAD_SIGN.y }, sm = HEAD.sm;
  const d = HEAD.sm = sm ? { dx: sm.dx + (raw.dx - sm.dx) * .4, dy: sm.dy + (raw.dy - sm.dy) * .4 } : raw; // smoothed: the model's angles shake, most of all with the head turned
  const items = headTargets();
  if (!items.length) { headUi(null, 0); HEAD.tracker = null; return; }
  // The grid as the page shows it right now: one column on a phone, two on a computer, four banners in a row. On the intro scroll the text is the upper half and «Почати» the lower:
  // only a face lowered toward the button points at it, so reading the scroll points at nothing.
  const intro = HEAD.phase === 'intro', TM = HEAD_TIMING;
  const grid = intro ? { cols: 1, rows: 2, at: (c, r) => r === 1 ? 0 : -1 } : HeadLogic.gridOf(items.map(b => { const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })), shape = intro ? 'intro' : grid.cols + 'x' + grid.rows;
  if (!HEAD.tracker || !HEAD.items || items[0] !== HEAD.items[0] || items.length !== HEAD.items.length || shape !== HEAD.shape) { // a new screen starts with time to read
    headClear(); HEAD.items = items; HEAD.shape = shape; HEAD.tracker = HeadLogic.createPointer({ cols: grid.cols, rows: grid.rows, hold: TM.holdMs, grace: TM.graceMs, free: true }); HEAD.readUntil = t + (intro ? TM.introArmMs : TM.readMs);
  }
  if (t < HEAD.readUntil) return headUi(null, 0, 'reading', HEAD.readUntil - t); // reading is not choosing: nothing lights up, nothing is picked
  const u = HEAD.tracker.update(t, d), i = u.col === null ? -1 : grid.at(u.col, u.row);
  headUi(i < 0 ? null : i, i < 0 ? 0 : u.fill);
  if (u.picked && i >= 0) headPick(items[i]);
}
// `state` is given only for 'reading'; otherwise it follows the hold: armed (nothing held yet), holding, countdown (the last seconds, 3-2-1 in the mirror and a glow on the answer).
function headUi(aim, fill = 0, state = '', left = 0) {
  const items = HEAD.items || [], TM = HEAD_TIMING, on = aim !== null && fill > 0 && fill < 1, remain = on ? (1 - fill) * TM.holdMs : 0, count = on && remain <= TM.countdownMs;
  items.forEach((b, i) => { b.classList.toggle('aim', i === aim); b.classList.toggle('soon', count && i === aim); });
  headTimer(aim === null ? 0 : fill, state, count ? Math.max(1, Math.ceil(remain / 1000)) : 0);
  const b = aim !== null && items[aim]; if (b && b.isConnected) { const r = b.getBoundingClientRect(); FACE.focus = { x: r.left + r.width / 2, y: r.top + r.height / 2, at: now }; } // the Hat looks at it, as with a swipe
  HEAD.aim = aim; HEAD.state = state || (!HEAD.tracker ? '' : count ? 'countdown' : on ? 'holding' : 'armed'); HEAD.left = state ? left : remain;
}
function headPick(b) {
  if (!b || !b.isConnected) return;
  const wish = b.classList.contains('ban'), question = !wish && st.picking, before = HEAD.undo; headUi(null, 0); b.click();
  if (question) HEAD.undo = { kind: 'q', n: st.answers.length }; // the back arrow can take this answer back
  if (wish) { // a banner picked by the head is the wish, and the Hat goes on after a moment in which the arrow can still take it back: the other buttons there are tap only
    HEAD.undo = st.wish ? { kind: 'wish', n: st.answers.length, wish: st.wish, prev: before && before.kind === 'q' ? before : null } : before;
    clearTimeout(HEAD.wishT); HEAD.wishT = setTimeout(() => { if (HEAD.on && st.wish && !st.deciding) decide(); }, HEAD_TIMING.wishGoMs);
  }
  headSync();
}

// The back arrow: shown only after the head picked an answer, so an accidental pick can be taken back. Tap and keyboard only: the head can't point at it.
// A question's answer goes back to that question (undoAnswer in hall.js keeps the scoring right); a banner just stops being the wish.
const headBack = $('#headBack');
function headUndo() {
  const u = HEAD.undo; if (!u || !headUndoLive()) return;
  if (u.kind === 'wish') { clearTimeout(HEAD.wishT); HEAD.undo = u.prev; st.wish = null; showWish(); } else { HEAD.undo = null; undoAnswer(); }
  headSync();
}
const headUndoLive = () => { const u = HEAD.undo; return !!u && HEAD.on && st.phase === 'hall' && !st.deciding && st.answers.length === u.n && (u.kind !== 'wish' || st.wish === u.wish); };
// The arrow goes as soon as its answer is no longer the last one: a tap answered the next question, the Hat started thinking, or the camera went off.
function headSync() {
  if (HEAD.undo && !headUndoLive()) HEAD.undo = null;
  const u = HEAD.undo, label = u ? T(u.kind === 'wish' ? 'headBackWish' : 'headBack') : '';
  if (headBack.hidden !== !u) headBack.hidden = !u;
  if (u && headBack.getAttribute('aria-label') !== label) { headBack.setAttribute('aria-label', label); headBack.title = label; }
}
headBack.addEventListener('click', e => { e.stopPropagation(); headUndo(); });

(function loop(t) { requestAnimationFrame(loop); headTick(t); headSync(); })(performance.now());

// TEMPORARY: ?debug=head shows the current phase, the time left and the answer pointed at. Removed before merge.
if (/[?&]debug=head\b/.test(location.search)) {
  const box = document.createElement('div'); box.id = 'headDbg'; document.body.appendChild(box);
  setInterval(() => { box.style.top = (headMirror.hidden ? 8 : headMirror.getBoundingClientRect().bottom + 6) + 'px'; const it = HEAD.items && HEAD.aim !== null && HEAD.items[HEAD.aim]; box.textContent = !HEAD.on ? 'head: off' : `screen: ${HEAD.phase}${HEAD.zero ? '' : ' (learning neutral)'}\nphase: ${HEAD.state || '-'}\nleft: ${HEAD.state && HEAD.state !== 'armed' ? (HEAD.left / 1000).toFixed(1) + ' s' : '-'}\nanswer: ${it ? it.textContent.trim().slice(0, 28) : '-'}`; }, 100);
}
