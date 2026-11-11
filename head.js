'use strict';
// Answering the Hat with the head: point the face at an answer and hold still. The answer lights up, and the timer runs in the camera mirror:
// an hourglass over the picture and the gold ring filling around it. A full ring picks the answer exactly as a tap does.
// Runs after hall.js and reads its names directly. The camera starts only on the player's tap. Only where the head points is read, on its own thread
// (head-worker.js): no face analysis, nothing recorded or sent, and the picture never leaves the browser. Taps and swipes keep working throughout.
// Any trouble (no camera, a refused prompt, a slow model, a lost face for too long, a hidden tab that can't come back) turns it off quietly: the player taps instead.

Object.assign(S, {
  bHead: ['Відповідати головою', 'Answer with my head'],
  bTap: ['Без камери? Відповідати дотиком', 'No camera? Tap instead'],
  headLoad: ['Готую чари. Якщо браузер спитає про камеру, дозволь її.', 'Preparing the charm. If your browser asks about the camera, allow it.'],
  headPriv: ['Камера бачить лише, куди дивиться голова. Нічого не записується й не надсилається.', 'The camera only reads where your head points. Nothing is recorded or sent.'],
  headLook: ['Подивись сюди, на сувій, і не рухайся.', 'Look here at the scroll and hold still.'], // neutral is the middle of the answers, which sit on the scroll: on a computer the Hat is far above them
  headTry: ['Поверни обличчя до відповіді й потримай.', 'Point your face at an answer and hold still.'],
  headL: ['Ця', 'This one'],
  headR: ['Або ця', 'Or this one'],
  headLost: ['Не бачу обличчя. Подивись на екран.', 'I can’t see your face. Look at the screen.'],
  headDenied: ['Без камери теж можна: просто торкнись відповіді.', 'No camera is fine too: just tap your answer.'],
  headFail: ['Камера не відповідає, тож відповідай дотиком.', 'The camera isn’t answering, so tap your answers.'],
});

const HEAD_MP = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14';
const HEAD_MODEL = 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';
// Which way is right and which is up, as MediaPipe's angles read on the mirrored picture. TEMPORARY: ?debug=head can flip them while testing on a phone.
const HEAD_SIGN = { x: -1, y: -1 }; // y from the owner's test on a computer: lifting the head lowers the pitch MediaPipe reports
const HEAD_CALM = 30; // frames with a face to learn the neutral pose
const HEAD = { on: false, wanted: false, failed: false, phase: null, worker: null, stream: null, token: 0, busy: false, sentAt: 0, lastT: -1, lastFrame: 0, fresh: false, lastTs: 0,
  zero: null, samples: [], tracker: null, items: null, aim: null, seenAt: 0, lostSince: 0, intro: null, resume: false, warmed: null };
const headVideo = $('#headCam');
// The mirror: the camera picture in a gold ring. While an answer is held, the ring fills like a clock hand and an hourglass pours over the picture.
const headMirror = $('#headMirror'), HG = 'M4.5 3.5C4.5 10.5 9 12.5 9 15S4.5 19.5 4.5 26.5h11C15.5 19.5 11 17.5 11 15s4.5-4.5 4.5-11.5z';
headMirror.insertAdjacentHTML('beforeend', '<svg class="ring" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="31" pathLength="1"/></svg>'
  + `<svg class="hglass" viewBox="0 0 20 30" aria-hidden="true"><defs><clipPath id="hgClip"><path d="${HG}"/></clipPath></defs><path d="${HG}" fill="rgba(255,248,230,.35)"/>`
  + '<g clip-path="url(#hgClip)"><rect class="sand top" x="0" y="7" width="20" height="8"/><rect class="sand bot" x="0" y="18" width="20" height="8.5"/><line class="fall" x1="10" y1="15" x2="10" y2="26.5"/></g>'
  + `<path d="${HG}" fill="none" stroke="#f3dca8" stroke-width=".9"/><rect x="2" y="1" width="16" height="2.6" rx="1.2" fill="#d9b46a"/><rect x="2" y="26.4" width="16" height="2.6" rx="1.2" fill="#d9b46a"/></svg>`);
function headTimer(fill) { headMirror.style.setProperty('--f', fill.toFixed(3)); headMirror.classList.toggle('hold', fill > 0 && fill < 1); }
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

// The player's choice on the Hat's first screen. `again`: a new game after a head-mode game, with no practice.
async function startHead(again = false) {
  if (!headPossible()) return beginQuestions();
  const tok = ++HEAD.token; HEAD.wanted = true; HEAD.on = true; HEAD.phase = 'load'; if (!again) HEAD.intro = st.noteFn; HEAD.again = again;
  note.classList.add('head');
  setNote(() => ({ kicker: T('hatK'), hand: T('headLoad'), instr: T('headPriv'), btns: [{ label: T('bTap'), cls: 'tapLink', fn: () => { headOff(); beginQuestions(); } }] }));
  try { if (!await headCamera(tok)) return; }
  catch (e) { if (tok === HEAD.token) headOff(e && (e.name === 'NotAllowedError' || e.name === 'SecurityError') ? 'headDenied' : 'headFail'); return; }
  HEAD.phase = 'look'; setNote(() => ({ kicker: T('hatK'), hand: T('headLook'), btns: [{ label: T('bTap'), cls: 'tapLink', fn: () => { headOff(); beginQuestions(); } }] }));
  if (document.hidden) headSuspend();
}
// Straight is learned: a short practice the first time, then the questions.
function headReady() {
  if (HEAD.phase !== 'look') return;
  if (HEAD.again) { HEAD.phase = 'play'; return beginQuestions(); }
  HEAD.phase = 'try'; HEAD.tracker = null;
  setNote(() => ({ kicker: T('hatK'), hand: T('headTry'), btns: [{ label: T('headL'), ghost: true, cls: 'hp', fn: headPracticeDone }, { label: T('headR'), ghost: true, cls: 'hp', fn: headPracticeDone }, { label: T('bTap'), cls: 'tapLink', fn: () => { headOff(); beginQuestions(); } }] }));
}
function headPracticeDone() { if (HEAD.phase !== 'try') return; HEAD.phase = 'play'; beginQuestions(); }

// Turns head mode off. With a message, the player learns why; during the set-up, back to the Hat's first screen without the head button.
function headOff(msg) {
  const was = HEAD.on, setup = HEAD.phase === 'load' || HEAD.phase === 'look' || HEAD.phase === 'try';
  HEAD.token++; HEAD.on = false; HEAD.wanted = false; HEAD.phase = null; HEAD.resume = false; headClear(); headCamOff(); note.classList.remove('head');
  if (msg) { HEAD.failed = true; if (HEAD.worker) { HEAD.worker.terminate(); HEAD.worker = null; } }
  if (!was || !msg) return;
  if (setup && !HEAD.again && HEAD.intro) { setNote(HEAD.intro); setTimeout(() => setStatus(T(msg)), 400); return; } // the first screen again, now without the head button
  if (setup) { beginQuestions(); setTimeout(() => setStatus(T(msg)), 400); return; }
  if (st.noteFn) renderNote(); setStatus(T(msg));
}
// The Hat has its answers: the camera goes off, and a new game asks for it again.
function headDone() { if (!HEAD.on) return; HEAD.token++; HEAD.on = false; HEAD.phase = null; headClear(); headCamOff(); note.classList.remove('head'); }
function headCamOff() {
  try { HEAD.stream && HEAD.stream.getTracks().forEach(t => t.stop()); } catch (_) { }
  HEAD.stream = null; headVideo.srcObject = null; headMirror.hidden = true; headVideo.classList.remove('seen'); headTimer(0); HEAD.busy = false; headDebug(null);
}
function headClear() { if (HEAD.items) HEAD.items.forEach(b => b.classList.remove('aim')); headTimer(0); HEAD.items = null; HEAD.aim = null; HEAD.tracker = null; HEAD.shape = ''; }

// A hidden tab stops the camera; coming back starts it again and learns the neutral pose again, on the same screen.
function headSuspend() { if (!HEAD.on) return; HEAD.resume = HEAD.phase; HEAD.token++; headClear(); headCamOff(); }
document.addEventListener('visibilitychange', async () => {
  if (document.hidden) return headSuspend();
  if (!HEAD.on || !HEAD.resume) return; const phase = HEAD.resume, tok = ++HEAD.token; HEAD.resume = false;
  try { if (!await headCamera(tok)) return; } catch (_) { if (tok === HEAD.token) headOff('headFail'); return; }
  HEAD.phase = phase === 'load' ? 'look' : phase; HEAD.recal = true;
});

// What the head can pick on the current screen: the practice, the answers, or the four banners. Nothing while the Hat talks or thinks.
function headTargets() {
  if (noteIn.classList.contains('fade')) return []; // between two screens the old buttons are still there for a moment
  if (HEAD.phase === 'try') return [...document.querySelectorAll('#nBtns .hp')];
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
  headVideo.classList.toggle('seen', !!a);
  if (!a) {
    if (!HEAD.lostSince) HEAD.lostSince = t;
    if (HEAD.tracker) HEAD.tracker.reset(); headUi(null, 0); HEAD.sm = null; // looking away resets the timer at once
    if (t - HEAD.lostSince > 1500 && $('#nStatus').textContent !== T('headLost')) setStatus(T('headLost'));
    if (t - HEAD.lostSince > 25000) headOff('headFail');
    return headDebug(null);
  }
  if (HEAD.lostSince && $('#nStatus').textContent === T('headLost')) setStatus('');
  HEAD.lostSince = 0;
  if (!HEAD.zero || HEAD.recal) {
    if (HEAD.recal) { HEAD.recal = false; HEAD.zero = null; HEAD.samples = []; HEAD.sm = null; }
    HEAD.samples.push(a); headDebug(a); if (HEAD.samples.length < HEAD_CALM) return;
    HEAD.zero = { yaw: median(HEAD.samples, 'yaw'), pitch: median(HEAD.samples, 'pitch'), roll: median(HEAD.samples, 'roll') }; HEAD.samples = [];
    return headReady();
  }
  const raw = { dx: (a.yaw - HEAD.zero.yaw) * HEAD_SIGN.x, dy: (a.pitch - HEAD.zero.pitch) * HEAD_SIGN.y }, sm = HEAD.sm;
  const d = HEAD.sm = sm ? { dx: sm.dx + (raw.dx - sm.dx) * .4, dy: sm.dy + (raw.dy - sm.dy) * .4 } : raw; // smoothed: the model's angles shake, most of all with the head turned
  const items = headTargets();
  if (!items.length) { headUi(null, 0); HEAD.tracker = null; return headDebug(a, d); }
  // The grid as the page shows it right now: one column on a phone, two on a computer, four banners in a row.
  const grid = HeadLogic.gridOf(items.map(b => { const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })), shape = grid.cols + 'x' + grid.rows;
  if (!HEAD.tracker || !HEAD.items || items[0] !== HEAD.items[0] || items.length !== HEAD.items.length || shape !== HEAD.shape) { headClear(); HEAD.items = items; HEAD.shape = shape; HEAD.tracker = HeadLogic.createPointer({ cols: grid.cols, rows: grid.rows }); } // a new screen: the head first comes back to neutral
  const u = HEAD.tracker.update(t, d), i = u.col === null ? -1 : grid.at(u.col, u.row);
  headUi(i < 0 ? null : i, i < 0 ? 0 : u.fill); headDebug(a, d, grid, i, u.fill);
  if (u.picked && i >= 0) headPick(items[i]);
}
function headUi(aim, fill) {
  const items = HEAD.items || [];
  items.forEach((b, i) => b.classList.toggle('aim', i === aim));
  headTimer(aim === null ? 0 : fill);
  const b = aim !== null && items[aim]; if (b && b.isConnected) { const r = b.getBoundingClientRect(); FACE.focus = { x: r.left + r.width / 2, y: r.top + r.height / 2, at: now }; } // the Hat looks at it, as with a swipe
  HEAD.aim = aim;
}
function headPick(b) {
  if (!b || !b.isConnected) return;
  const wish = b.classList.contains('ban'); headUi(null, 0); b.click();
  if (wish) setTimeout(() => { if (HEAD.on && st.wish && !st.deciding) decide(); }, 700); // a banner picked by the head is the wish, and the Hat goes on: the other buttons there are tap only
}
(function loop(t) { requestAnimationFrame(loop); headTick(t); })(performance.now());

/* ===== TEMPORARY: debug overlay for testing on a phone, behind ?debug=head. Remove before merge. ===== */
const HEAD_DEBUG = /(^|[?&])debug=head(&|$)/.test(location.search) ? document.createElement('div') : null;
if (HEAD_DEBUG) {
  HEAD_DEBUG.id = 'headDebug'; document.body.appendChild(HEAD_DEBUG);
  HEAD_DEBUG.innerHTML = '<b>TEMPORARY head debug</b><pre></pre><button data-k="x">flip ↔</button><button data-k="y">flip ↕</button><button data-k="z">neutral again</button>';
  HEAD_DEBUG.addEventListener('pointerdown', e => e.stopPropagation()); // not a swipe
  HEAD_DEBUG.addEventListener('click', e => { e.stopPropagation(); const k = e.target.dataset && e.target.dataset.k; if (k === 'x' || k === 'y') HEAD_SIGN[k] *= -1; if (k === 'z') HEAD.recal = true; if (HEAD.tracker) HEAD.tracker.reset(); });
}
function headDebug(a, d, grid, i, fill) {
  if (!HEAD_DEBUG) return; const f = v => v === undefined || v === null ? '—' : (v >= 0 ? '+' : '') + v.toFixed(1), z = HEAD.zero;
  HEAD_DEBUG.querySelector('pre').textContent = [
    `phase ${HEAD.phase || 'off'}  face ${a ? 'yes' : 'no'}`,
    `raw     yaw ${f(a && a.yaw)} pitch ${f(a && a.pitch)} roll ${f(a && a.roll)}`,
    `neutral yaw ${f(z && z.yaw)} pitch ${f(z && z.pitch)} roll ${f(z && z.roll)}${HEAD.samples.length ? '  learning ' + HEAD.samples.length + '/' + HEAD_CALM : ''}`,
    `delta   dx ${f(d && d.dx)} dy ${f(d && d.dy)}  (dead ±${HeadLogic.DEAD})`,
    `grid ${grid ? grid.cols + '×' + grid.rows : '—'}  answer ${i === undefined || i < 0 ? '—' : i + 1}  hold ${Math.round((fill || 0) * 100)}%`,
    `sign ↔ ${HEAD_SIGN.x > 0 ? '+' : '−'}  ↕ ${HEAD_SIGN.y > 0 ? '+' : '−'}`,
  ].join('\n');
}
/* ===== end TEMPORARY ===== */
