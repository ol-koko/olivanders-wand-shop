// TEMPORARY — remove before merge. Camera-mode readout, loaded by shop.js only with ?debug=hand.
// Shows: camera fps, inference ms, frames in flight, capture → wand latency, delegate, model ready and warm-up time, stale drops.
(() => {
  const D = { t0: 0, ready: 0, warm: 0, out: 0, inn: 0, maxIn: 0, inf: [], lat: [], latMax: 0, vf: [], del: '-' };
  const box = document.createElement('pre');
  box.style.cssText = 'position:fixed;right:8px;bottom:8px;z-index:99999;margin:0;padding:8px 10px;font:12px/1.35 ui-monospace,Menlo,monospace;color:#9f9;background:rgba(0,0,0,.78);border:1px solid #d9b46a;border-radius:6px;pointer-events:none;white-space:pre';
  addEventListener('DOMContentLoaded', () => document.body.append(box)); if (document.body) document.body.append(box);
  const push = (a, v) => { a.push(v); if (a.length > 30) a.shift(); };
  const avg = a => a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length) : '-';
  // the worker: when it's made, when it's ready, every frame out and every result in
  const W0 = window.Worker;
  window.Worker = class extends W0 {
    constructor(...a) {
      super(...a); D.t0 = performance.now(); D.ready = D.warm = 0;
      this.addEventListener('message', e => {
        const m = e.data, now = performance.now();
        if (m.type === 'ready') { D.ready = now - D.t0; D.del = m.delegate; }
        if (m.type === 'result') { D.inn++; D.del = m.delegate; push(D.inf, m.ms); if (m.warm) D.warm = m.ms; }
      });
    }
    postMessage(m, tr) { if (m && m.type === 'frame') { D.out++; D.maxIn = Math.max(D.maxIn, D.out - D.inn); } return super.postMessage(m, tr); }
  };
  // applied: the moment a result reaches camHand, which moves the cursor and feeds the wand's next frame
  const ch = camHand;
  camHand = (lm, t) => { const l = performance.now() - (cam.sentCap || t); push(D.lat, l); D.latMax = Math.max(D.latMax, l); return ch(lm, t); };
  let hooked = null;
  function hookVideo() {
    const v = cam.video; if (!v || !v.srcObject || hooked === v.srcObject || !v.requestVideoFrameCallback) return; hooked = v.srcObject;
    const f = now => { D.vf.push(now); while (D.vf.length && now - D.vf[0] > 1000) D.vf.shift(); if (v.srcObject === hooked) v.requestVideoFrameCallback(f); };
    v.requestVideoFrameCallback(f);
  }
  setInterval(() => {
    hookVideo();
    const age = cam.capT ? Math.round(performance.now() - cam.capT) : '-';
    box.textContent = [
      'DEBUG hand (temporary)',
      `camera fps     ${D.vf.length}`,
      `delegate       ${D.del}`,
      `model ready    ${D.ready ? Math.round(D.ready) + ' ms' : '-'}`,
      `warm-up        ${D.warm ? D.warm + ' ms' : '-'}`,
      `inference      ${avg(D.inf)} ms (last ${D.inf.length ? D.inf[D.inf.length - 1] : '-'})`,
      `in flight      ${D.out - D.inn} (max ${D.maxIn})`,
      `capture→wand   ${avg(D.lat)} ms (max ${D.latMax ? Math.round(D.latMax) : '-'})`,
      `frame age now  ${age} ms`,
      `stale dropped  ${cam.dropF || 0} frames, ${cam.dropR || 0} results`,
      `listening      ${cam.on && st.cap ? 'yes' : 'no'}`
    ].join('\n');
  }, 250);
  window.__handDbg = D;
})();
