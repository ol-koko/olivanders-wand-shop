// Turns the head's tilt into "this option is highlighted" and "picked". No DOM, so it can be tested with made-up angles.
// update(t, { side }) takes the time in ms and the angle in degrees, relative to where the head was at calibration. It returns { aim, fill, picked }.
// Holding a tilt fills the option, and a full option is picked. Straightening the head cancels, and the next pick has to start from a straight head.
(function (root) {
  const SWITCH = 2.5, START = 3, TILT = 5, GRACE = 600, HOLD = 1000; // GRACE: time on an option before it starts to fill, so there's room to move on to another
  function createTracker({ options = 4, range = 20, armed: startArmed = true } = {}) {
    let aim = null, armed = startArmed, last = 0, held = 0, on = 0;
    // Three options use the zones of four, with the middle option on both inner ones: a straight head picks nothing, so no option can live there.
    const zones = options === 3 ? 4 : options, shown = i => options === 3 ? [0, 1, 1, 2][i] : i;
    const cell = a => Math.min(zones - 1, Math.max(0, Math.floor((a + range) / (2 * range) * zones))), zone = a => shown(cell(a));
    // Hysteresis: a boundary has to be passed by a few degrees, so the light doesn't flicker on it.
    const inside = (i, a) => { const w = 2 * range / zones; return Array.from({ length: zones }, (_, k) => k).some(k => { if (shown(k) !== i) return false; const lo = -range + k * w, hi = lo + w; return a >= lo - SWITCH && a <= hi + SWITCH; }); };
    return {
      get aim() { return aim; },
      reset() { aim = null; held = 0; on = 0; armed = true; },
      update(t, { side }) {
        const dt = last ? Math.min(100, t - last) : 0; last = t;
        if (Math.abs(side) < START) { aim = null; held = 0; on = 0; armed = true; return { aim, fill: 0, picked: null }; }
        if (aim === null || !inside(aim, side)) { const next = zone(side); if (next !== aim) { aim = next; held = 0; on = 0; } }
        if (!armed || Math.abs(side) < TILT) return { aim, fill: armed ? held / HOLD : 0, picked: null };
        on += dt; if (on < GRACE) return { aim, fill: 0, picked: null };
        held += dt; if (held < HOLD) return { aim, fill: held / HOLD, picked: null };
        armed = false; held = 0; on = 0; return { aim, fill: 1, picked: aim };
      },
    };
  }
  // Roll, yaw and pitch in degrees from MediaPipe's 4×4 matrix, which is stored column by column.
  function anglesFrom(d) { const deg = 180 / Math.PI; return { roll: Math.atan2(d[1], d[5]) * deg, yaw: Math.atan2(d[8], d[10]) * deg, pitch: Math.atan2(-d[9], Math.hypot(d[8], d[10])) * deg }; }
  const api = { createTracker, anglesFrom };
  if (typeof module !== 'undefined') module.exports = api; else root.HeadLogic = api;
})(typeof window !== 'undefined' ? window : globalThis);
