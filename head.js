'use strict';
// Answering the Hat with the head: tilt toward an option and hold it, and a gold line runs around it until it's picked.
// Runs after hall.js and reads its names directly. The camera starts only on the player's tap. Only the head's tilt is read, on its own thread
// (head-worker.js): no face analysis, nothing recorded or sent, and the picture never leaves the browser. Taps and swipes keep working throughout.
// Any trouble (no camera, a refused prompt, a slow model, a lost face for too long, a hidden tab that can't come back) turns it off quietly: the player taps instead.

Object.assign(S, {
  bHead: ['Відповідати головою', 'Answer with my head'],
  bTap: ['Відповідати дотиком', 'Tap instead'],
  headLoad: ['Готую чари. Якщо браузер спитає про камеру, дозволь її.', 'Preparing the charm. If your browser asks about the camera, allow it.'],
  headPriv: ['Камера бачить лише нахил голови. Нічого не записується й не надсилається.', 'The camera only reads the tilt of your head. Nothing is recorded or sent.'],
  headLook: ['Подивись прямо на мене.', 'Look straight at me.'],
  headTry: ['Нахили голову до відповіді й потримай.', 'Tilt your head toward an answer and hold it.'],
  headL: ['Сюди', 'This way'],
  headR: ['Або сюди', 'Or this way'],
  headLost: ['Не бачу обличчя. Подивись на екран.', 'I can’t see your face. Look at the screen.'],
  headDenied: ['Без камери теж можна: просто торкнись відповіді.', 'No camera is fine too: just tap your answer.'],
  headFail: ['Камера не відповідає, тож відповідай дотиком.', 'The camera isn’t answering, so tap your answers.'],
});

const HEAD_MP = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14';
const HEAD_MODEL = 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';
const HEAD_RANGE = 20, HEAD_FLIP = 1; // degrees from straight to the outermost option; the sign that makes a tilt to the player's right light the right-hand option
const HEAD_CALM = 30; // frames with a face to learn where straight is
const HEAD = { on: false, wanted: false, failed: false, phase: null, worker: null, stream: null, token: 0, busy: false, sentAt: 0, lastT: -1, lastFrame: 0, fresh: false, lastTs: 0,
  zero: null, samples: [], tracker: null, items: null, aim: null, seenAt: 0, lostSince: 0, intro: null, resume: false, warmed: null };
const headVideo = $('#headCam');
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
  HEAD.stream = stream; headVideo.srcObject = stream; headVideo.hidden = false;
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
  setNote(() => ({ kicker: T('hatK'), hand: T('headLoad'), instr: T('headPriv'), btns: [{ label: T('bTap'), ghost: true, fn: () => { headOff(); beginQuestions(); } }] }));
  try { if (!await headCamera(tok)) return; }
  catch (e) { if (tok === HEAD.token) headOff(e && (e.name === 'NotAllowedError' || e.name === 'SecurityError') ? 'headDenied' : 'headFail'); return; }
  HEAD.phase = 'look'; setNote(() => ({ kicker: T('hatK'), hand: T('headLook'), btns: [{ label: T('bTap'), ghost: true, fn: () => { headOff(); beginQuestions(); } }] }));
  if (document.hidden) headSuspend();
}
// Straight is learned: a short practice the first time, then the questions.
function headReady() {
  if (HEAD.phase !== 'look') return;
  if (HEAD.again) { HEAD.phase = 'play'; return beginQuestions(); }
  HEAD.phase = 'try'; HEAD.tracker = null;
  setNote(() => ({ kicker: T('hatK'), hand: T('headTry'), cls: 'try', btns: [{ label: '← ' + T('headL'), ghost: true, cls: 'hp', fn: headPracticeDone }, { label: T('headR') + ' →', ghost: true, cls: 'hp', fn: headPracticeDone }, { label: T('bTap'), ghost: true, cls: 'wide', fn: () => { headOff(); beginQuestions(); } }] }));
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
  HEAD.stream = null; headVideo.srcObject = null; headVideo.hidden = true; headVideo.classList.remove('seen'); HEAD.busy = false;
}
function headClear() { if (HEAD.items) HEAD.items.forEach(b => { b.classList.remove('aim', 'hfill'); b.style.removeProperty('--f'); }); HEAD.items = null; HEAD.aim = null; HEAD.tracker = null; }

// A hidden tab stops the camera; coming back starts it again and learns straight again, on the same screen.
function headSuspend() { if (!HEAD.on) return; HEAD.resume = HEAD.phase; HEAD.token++; headClear(); headCamOff(); }
document.addEventListener('visibilitychange', async () => {
  if (document.hidden) return headSuspend();
  if (!HEAD.on || !HEAD.resume) return; const phase = HEAD.resume, tok = ++HEAD.token; HEAD.resume = false;
  try { if (!await headCamera(tok)) return; } catch (_) { if (tok === HEAD.token) headOff('headFail'); return; }
  HEAD.phase = phase === 'load' ? 'look' : phase; HEAD.recal = true;
});

// What the head can pick on the current screen: the practice, the answers, or the four banners. Nothing while the Hat talks or thinks.
function headTargets() {
  if (HEAD.phase === 'try') return [...document.querySelectorAll('#nBtns .hp')];
  if (HEAD.phase !== 'play' || st.phase !== 'hall' || st.deciding) return [];
  if (st.picking) return [...document.querySelectorAll('#nBtns button')];
  const w = $('#nBtns.wish'); return w && !st.avoiding ? [...w.querySelectorAll('.ban')] : [];
}

function headTick(t) {
  if (!HEAD.on || !HEAD.worker || !HEAD.stream || HEAD.phase === 'load') return;
  if (HEAD.busy) { if (t - HEAD.sentAt > 5000) headOff('headFail'); return; } // one frame at a time, and the game never waits forever
  const v = headVideo, moved = v.currentTime !== HEAD.lastT, fresh = HEAD.fresh || (moved && t - HEAD.lastFrame > 200);
  if (v.readyState < 2 || !fresh) { if (!moved && t - HEAD.lastFrame > 4000 && !document.hidden) headOff('headFail'); return; }
  if (t - HEAD.lastFrame < 30) return; // about 30 a second is plenty for a tilt
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
// One reading of the head: learn straight, then light, fill and pick the option it leans toward.
function headAngle(a, t) {
  headVideo.classList.toggle('seen', !!a);
  if (!a) {
    if (!HEAD.lostSince) HEAD.lostSince = t;
    if (t - HEAD.lostSince > 600) { headUi(null, 0); if (HEAD.tracker) HEAD.tracker.reset(); }
    if (t - HEAD.lostSince > 1500 && $('#nStatus').textContent !== T('headLost')) setStatus(T('headLost'));
    if (t - HEAD.lostSince > 25000) headOff('headFail');
    return;
  }
  if (HEAD.lostSince && $('#nStatus').textContent === T('headLost')) setStatus('');
  HEAD.lostSince = 0;
  if (!HEAD.zero || HEAD.recal) {
    if (HEAD.recal) { HEAD.recal = false; HEAD.zero = null; HEAD.samples = []; }
    HEAD.samples.push(a); if (HEAD.samples.length < HEAD_CALM) return;
    const s = HEAD.samples.map(x => x.roll).sort((p, q) => p - q); HEAD.zero = { roll: s[s.length >> 1] }; HEAD.samples = []; // the median: a glance away while it learns doesn't count
    return headReady();
  }
  const items = headTargets();
  if (!items.length) { headUi(null, 0); HEAD.tracker = null; return; }
  if (!HEAD.tracker || !HEAD.items || items.length !== HEAD.items.length || items[0] !== HEAD.items[0]) { headClear(); HEAD.items = items; HEAD.tracker = HeadLogic.createTracker({ options: items.length, range: HEAD_RANGE, armed: false }); } // a new screen: the head first comes back to straight
  const u = HEAD.tracker.update(t, { side: (a.roll - HEAD.zero.roll) * HEAD_FLIP });
  headUi(u.aim, u.fill);
  if (u.picked !== null) headPick(items[u.picked]);
}
function headUi(aim, fill) {
  const items = HEAD.items || [];
  items.forEach((b, i) => { const on = i === aim; b.classList.toggle('aim', on); b.classList.toggle('hfill', on && fill > 0); b.style.setProperty('--f', on ? fill.toFixed(3) : 0); });
  const b = aim !== null && items[aim]; if (b && b.isConnected) { const r = b.getBoundingClientRect(); FACE.focus = { x: r.left + r.width / 2, y: r.top + r.height / 2, at: now }; } // the Hat looks at it, as with a swipe
  HEAD.aim = aim;
}
function headPick(b) {
  if (!b || !b.isConnected) return;
  const wish = b.classList.contains('ban'); headUi(null, 0); b.click();
  if (wish) setTimeout(() => { if (HEAD.on && st.wish && !st.deciding) decide(); }, 700); // a banner picked by the head is the wish, and the Hat goes on: the other buttons there are tap only
}
(function loop(t) { requestAnimationFrame(loop); headTick(t); })(performance.now());
