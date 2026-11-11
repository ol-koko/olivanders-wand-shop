// Head tracking on its own thread, for answering the Hat with the head. It returns only the head's angle: no face analysis, and the picture never leaves the browser.
// A classic worker, like hand-worker.js, because MediaPipe loads its files with importScripts.
let face = null, lastTs = 0, make = null, delegate = 'GPU', slow = 0;
const SLOW_MS = 120, SLOW_FRAMES = 15; // a graphics card this slow does worse than the processor

async function init({ MP, MODEL }) {
  self.module = { exports: {} }; self.exports = self.module.exports;
  const code = await (await fetch(MP + '/vision_bundle.cjs')).text(); // jsDelivr serves .cjs under a type importScripts refuses
  importScripts(URL.createObjectURL(new Blob([code], { type: 'text/javascript' })));
  const { FilesetResolver, FaceLandmarker } = self.module.exports;
  const files = await FilesetResolver.forVisionTasks(MP + '/wasm');
  make = d => FaceLandmarker.createFromOptions(files, { baseOptions: { modelAssetPath: MODEL, delegate: d }, runningMode: 'VIDEO', numFaces: 1, outputFacialTransformationMatrixes: true, outputFaceBlendshapes: false });
  try { face = await make('GPU'); } catch (_) { face = await make('CPU'); delegate = 'CPU'; }
}

self.onmessage = async ({ data: m }) => {
  if (m.type === 'init') { try { await init(m); self.postMessage({ type: 'ready', delegate }); } catch (e) { self.postMessage({ type: 'fail', message: String(e && e.message) }); } return; }
  let matrix = null, err = false; const t0 = performance.now();
  try { lastTs = Math.max(m.ts, lastTs + 1); const r = face.detectForVideo(m.frame, lastTs), f = r.facialTransformationMatrixes && r.facialTransformationMatrixes[0]; matrix = f ? Array.from(f.data) : null; }
  catch (_) { err = true; }
  m.frame.close(); const ms = performance.now() - t0;
  if (!m.warm && delegate === 'GPU') { slow = ms > SLOW_MS ? slow + 1 : Math.max(0, slow - 1); if (slow >= SLOW_FRAMES) { try { const next = await make('CPU'); face.close(); face = next; delegate = 'CPU'; } catch (_) { slow = 0; } } }
  self.postMessage({ type: 'result', warm: !!m.warm, tok: m.tok, t: m.t, matrix, err, delegate, ms: Math.round(ms) });
};
