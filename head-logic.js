// Turns where the head points into "this option is highlighted" and "picked". No DOM, so it can be tested with made-up angles.
// createPointer({ cols, rows }) follows a grid of options laid out as the page shows them. update(t, { dx, dy }) takes the time in ms and the head's turn (dx, right +)
// and lift (dy, up +) in degrees, relative to the neutral pose. It returns { col, row, fill, picked } with picked as { col, row } once.
// Pointing at a cell and holding still fills it, and a full cell is picked. The neutral pose points at nothing, and after a pick the head comes back to neutral first.
(function (root) {
  const DEAD = 3.5, SWITCH = 2.5, GRACE = 450, HOLD = 1000; // degrees around neutral that point at nothing; degrees past a border before the light moves; ms before the fill starts, ms of fill
  const RANGE_X = 18, RANGE_Y = 14; // degrees from neutral to the outer edge of the outermost option: a head turns further than it nods
  // One axis: n cells side by side over [-range, range]. With an even n, neutral sits on a border. Hysteresis keeps the current cell until a border is passed by SWITCH.
  function axis(n, range) {
    const w = 2 * range / n, cellOf = a => Math.min(n - 1, Math.max(0, Math.floor((a + range) / w))), side = c => Math.sign(-range + c * w + w / 2);
    return (a, cur) => {
      if (n === 1) return 0;
      if (Math.abs(a) < DEAD) return null;
      if (cur !== null) { const lo = -range + cur * w, hi = lo + w; if (a >= lo - SWITCH && a <= hi + SWITCH && (n % 2 || Math.sign(a) === side(cur))) return cur; } // never across neutral
      return cellOf(a);
    };
  }
  function createPointer({ cols = 1, rows = 4, rangeX = RANGE_X, rangeY = RANGE_Y, armed: startArmed = false } = {}) {
    const ax = axis(cols, rangeX), ay = axis(rows, rangeY);
    let col = null, row = null, armed = startArmed, last = 0, on = 0, held = 0;
    const calm = (dx, dy) => (cols === 1 || Math.abs(dx) < DEAD) && (rows === 1 || Math.abs(dy) < DEAD);
    return {
      reset() { col = row = null; on = held = 0; },
      update(t, { dx, dy }) {
        const dt = last ? Math.min(100, t - last) : 0; last = t;
        if (calm(dx, dy)) armed = true;
        const nc = ax(dx, col), nr = ay(-dy, row); // rows count from the top, and looking up is +dy
        if (nc === null || nr === null) { col = row = null; on = held = 0; return { col, row, fill: 0, picked: null }; }
        if (nc !== col || nr !== row) { col = nc; row = nr; on = held = 0; }
        if (!armed) return { col, row, fill: 0, picked: null };
        on += dt; if (on < GRACE) return { col, row, fill: 0, picked: null };
        held += dt; if (held < HOLD) return { col, row, fill: held / HOLD, picked: null };
        armed = false; on = held = 0; return { col, row, fill: 1, picked: { col, row } };
      },
    };
  }
  // Roll, yaw and pitch in degrees from MediaPipe's 4×4 matrix, which is stored column by column.
  function anglesFrom(d) { const deg = 180 / Math.PI; return { roll: Math.atan2(d[1], d[5]) * deg, yaw: Math.atan2(d[8], d[10]) * deg, pitch: Math.atan2(-d[9], Math.hypot(d[8], d[10])) * deg }; }
  // The grid the page shows: options grouped into columns and rows by where they stand. Returns { cols, rows, at(col, row) -> index or -1 }.
  function gridOf(rects, tol = 12) {
    const group = vals => { const s = [...vals].sort((a, b) => a - b), out = []; for (const v of s) if (!out.length || v - out[out.length - 1] > tol) out.push(v); return out; };
    const xs = group(rects.map(r => r.x)), ys = group(rects.map(r => r.y)), near = (list, v) => list.reduce((b, x, i) => Math.abs(x - v) < Math.abs(list[b] - v) ? i : b, 0);
    const cells = rects.map(r => ({ col: near(xs, r.x), row: near(ys, r.y) }));
    return { cols: xs.length, rows: ys.length, at: (c, r) => cells.findIndex(k => k.col === c && k.row === r) };
  }
  const api = { createPointer, anglesFrom, gridOf, DEAD };
  if (typeof module !== 'undefined') module.exports = api; else root.HeadLogic = api;
})(typeof window !== 'undefined' ? window : globalThis);
