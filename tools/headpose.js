// Prototype: turns head angles into "this option is highlighted" and "picked". No DOM, so it can be tested with made-up angles.
// update(t, { side, pitch }) takes the time in ms and the angles in degrees, and returns { aim, picked }.
// side is the head's roll or yaw, pitch its nod. Both are relative to where the head was at calibration.
(function (root) {
  const SWITCH = 2.5, START = 3, NOD = 9, BACK = 4, NOD_RISE = 350, NOD_FALL = 700, HOLD = 300, STILL = 6, REST = 1000;
  function createTracker({ options = 4, range = 20 } = {}) {
    let aim = null, aimAt = 0, base = null, lastT = 0, nod = null, restUntil = 0;
    const zone = a => Math.min(options - 1, Math.max(0, Math.floor((a + range) / (2 * range) * options)));
    // Hysteresis: a boundary has to be passed by a few degrees, so the light doesn't flicker on it.
    const edge = (i, a) => { const w = 2 * range / options, lo = -range + i * w, hi = lo + w; return a >= lo - SWITCH && a <= hi + SWITCH; };
    return {
      get aim() { return aim; },
      reset() { aim = null; base = null; nod = null; restUntil = 0; },
      update(t, { side, pitch }) {
        const dt = lastT ? Math.min(100, t - lastT) : 33; lastT = t; if (base === null) base = pitch;
        if (aim === null ? Math.abs(side) > START : !edge(aim, side)) { const next = zone(side); if (next !== aim) { aim = next; aimAt = t; } }
        const off = pitch - base; let picked = null;
        // A nod is quick and comes back. The direction isn't checked: which way the sign runs depends on the camera. Looking down slowly only moves the baseline.
        if (!nod) { if (Math.abs(off) > START) nod = { t, side, peak: false, peakAt: 0 }; else base += (pitch - base) * Math.min(1, dt / 1200); }
        else {
          if (Math.abs(side - nod.side) > STILL || (!nod.peak && t - nod.t > NOD_RISE) || (nod.peak && t - nod.peakAt > NOD_FALL)) { nod = null; base = pitch; }
          else if (!nod.peak && Math.abs(off) > NOD) { nod.peak = true; nod.peakAt = t; }
          else if (nod.peak && Math.abs(off) < BACK) { nod = null; if (aim !== null && t - aimAt >= HOLD && t >= restUntil) { picked = aim; restUntil = t + REST; } }
        }
        return { aim, picked };
      },
    };
  }
  // Roll, yaw and pitch in degrees from MediaPipe's 4×4 matrix, which is stored column by column.
  function anglesFrom(d) { const deg = 180 / Math.PI; return { roll: Math.atan2(d[1], d[5]) * deg, yaw: Math.atan2(d[8], d[10]) * deg, pitch: Math.atan2(-d[9], Math.hypot(d[8], d[10])) * deg }; }
  const api = { createTracker, anglesFrom };
  if (typeof module !== 'undefined') module.exports = api; else root.HeadPose = api;
})(typeof window !== 'undefined' ? window : globalThis);
