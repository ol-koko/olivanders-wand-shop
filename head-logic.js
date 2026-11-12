// Turns where the head points into "this option is highlighted" and "picked". No DOM, so it can be tested with made-up angles.
// createPointer({ cols, rows }) follows a grid of options laid out as the page shows them. update(t, { dx, dy }) takes the time in ms and the head's turn (dx, right +)
// and lift (dy, up +) in degrees, relative to the neutral pose. It returns { col, row, fill, picked } with picked as { col, row } once.
// Pointing at a cell and holding still fills it, and a full cell is picked. The neutral pose points at nothing. After a pick, and on a new screen, the head first leaves the cell it points at.
(function (root) {
  const DEAD = 3.5, SWITCH = 2.5, GRACE = 450, HOLD = 1000, SETTLE = 180; // degrees around neutral that point at nothing; degrees past a border before the light moves; ms before the fill starts; ms of fill; ms a change must last
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
  // `hold` and `grace` are the page's timings (HEAD_TIMING in head.js). `free`: the pointer starts armed, for a screen that opens with its own reading pause.
  function createPointer({ cols = 1, rows = 4, rangeX = RANGE_X, rangeY = RANGE_Y, hold = HOLD, grace = GRACE, free = false } = {}) {
    const ax = axis(cols, rangeX), ay = axis(rows, rangeY);
    let col = null, row = null, last = 0, on = 0, held = 0, armed = false, stay, away = 0, next = null;
    return {
      reset() { col = row = null; on = held = away = 0; next = null; },
      update(t, { dx, dy }) {
        const dt = last ? Math.min(100, t - last) : 0; last = t;
        let nc = ax(dx, col), nr = ay(-dy, row); // rows count from the top, and looking up is +dy
        if (nc === null || nr === null) nc = nr = null;
        const key = nc === null ? '-' : nc + ',' + nr, cur = col === null ? '-' : col + ',' + row;
        // Armed once the head leaves where it pointed when the screen opened or at the last pick: no pick carried over, none twice.
        if (stay === undefined) { stay = key; armed = free || key === '-'; } else if (!armed && key !== stay) armed = true;
        // A change counts only after it lasts SETTLE ms: one shaky reading neither moves the light nor resets the timer.
        if (key !== cur) {
          if (key !== next) { next = key; away = 0; } away += dt;
          if (away < SETTLE && cur !== '-') return { col, row, fill: armed && on >= grace ? held / hold : 0, picked: null };
          col = nc; row = nr; on = held = away = 0; next = null;
        } else { away = 0; next = null; }
        if (col === null || !armed) return { col, row, fill: 0, picked: null };
        on += dt; if (on < grace) return { col, row, fill: 0, picked: null };
        held += dt; if (held < hold) return { col, row, fill: held / hold, picked: null };
        armed = false; stay = key; on = held = 0; return { col, row, fill: 1, picked: { col, row } };
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
