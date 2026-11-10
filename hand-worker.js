// Hand tracking on its own thread. Preparing the model for the graphics card can take seconds, and here that doesn't stop the game, its drawing or its sound.
// A classic worker on purpose: MediaPipe loads its files with importScripts, which module workers don't allow.
let hand = null, lastTs = 0, make = null, delegate = 'GPU', slow = 0;
const SLOW_MS = 120, SLOW_FRAMES = 15; // a graphics card this slow does worse than the processor

async function init({ MP, MODEL }) {
  self.module = { exports: {} }; self.exports = self.module.exports;
  // jsDelivr serves .cjs under a type importScripts refuses, so it's loaded by hand
  const code = await (await fetch(MP + '/vision_bundle.cjs')).text();
  importScripts(URL.createObjectURL(new Blob([code], { type: 'text/javascript' })));
  const { FilesetResolver, HandLandmarker } = self.module.exports;
  const files = await FilesetResolver.forVisionTasks(MP + '/wasm');
  const opts = delegate => ({ baseOptions: { modelAssetPath: MODEL, delegate }, runningMode: 'VIDEO', numHands: 1, minHandDetectionConfidence: .5, minHandPresenceConfidence: .5, minTrackingConfidence: .5 });
  make = d => HandLandmarker.createFromOptions(files, opts(d));
  try { hand = await make('GPU'); }
  catch (_) { hand = await make('CPU'); delegate = 'CPU'; }
  return delegate;
}

self.onmessage = async ({ data: m }) => {
  if (m.type === 'init') {
    try { self.postMessage({ type: 'ready', delegate: await init(m) }); }
    catch (e) { self.postMessage({ type: 'fail', message: String(e && e.message) }); }
    return;
  }
  // type 'frame'
  let marks = null, err = false; const t0 = performance.now();
  try { lastTs = Math.max(m.ts, lastTs + 1); const r = hand.detectForVideo(m.frame, lastTs); marks = (r.landmarks && r.landmarks[0]) || null; }
  catch (_) { err = true; }
  m.frame.close(); const ms = performance.now() - t0;
  if (!m.warm && delegate === 'GPU') { slow = ms > SLOW_MS ? slow + 1 : Math.max(0, slow - 1); if (slow >= SLOW_FRAMES) { try { const next = await make('CPU'); hand.close(); hand = next; delegate = 'CPU'; } catch (_) { slow = 0; } } }
  self.postMessage({ type: 'result', warm: !!m.warm, tok: m.tok, t: m.t, marks, err, delegate, ms: Math.round(ms) });
};
