# Ollivanders — "The wand chooses you"

A small winter-themed web app (fan project, Harry Potter world). The user enters Ollivanders,
waves trial wands, and one of 16 character wands eventually chooses them.

## Current state
- Static site, no build step. `index.html` holds the page, styles, drawing, FX and flow. `logic.js` holds the game logic with no DOM (wands, metrics, choosing, camera motion), shared with `tools/`.
- Visuals are drawn in code: SVG street scene, canvas shop interior, canvas FX layer. No image assets.
- `tools/` is local only and never ships: balance simulator, wave recorder, Playwright tests. See `tools/README.md`.
- Sound is generated with WebAudio (off by default, toggle top-right).
- UA / EN toggle; all strings live in the `S`, `OFFER`, `SPELLS`, `FAIL`, `WIN`, `PHR` objects and in `WANDS`.

## Key logic (keep it this way unless asked)
- Flow: street → door transition → input choice (camera / finger-mouse) → warm-up wave → wand attempts → result card.
- Every trial is a wave. Each wave produces 5 traits: speed, amp, sharp, flow, curl (`strokeMetrics`).
- Attempts are NOT a fixed count. Before each attempt `chooseCandidate()` offers the current best match
  with probability q = [.3, .42, .58, .75, .9, 1] by attempt, otherwise another close wand.
  A wand chooses the user only if it is still the best match after the wave. Hard cap: 6 attempts.
  Never show attempt counters or hint that an attempt is the last one.
- Failure reactions (`REACT`): fizzle (near miss), drop, fly, crack, avalanche, blackout, bubbles,
  butterflies, snow, smoke. No reaction repeats within the last 4.
- Wand profiles: `t` = displayed taste, `tc` = calibrated profile (compressed toward 0.5), `BIAS` = per-wand
  offset tuned so each wand wins ~6–7% (Elder Wand ~2%, every wand at least 3%). After any change to profiles or
  metrics, re-run `node tools/simulate.js --calibrate`.
- `strokeMetrics` measures on a fixed 33 ms grid and on the min(w, h) scale, so input rate doesn't change traits. `SCALES` in `logic.js` holds separate ranges for pointer and camera, read from recorded waves, because a hand moves far slower than a finger. Check changes against real waves with `node tools/simulate.js --validate`.
- Wand looks: `SHAPES` in `index.html` is the single shape spec. The box, hand, result card, saved card and 3D view all render from it. Matching doesn't use it.
- Canon facts only: wands whose wood/core are not named in canon have `spec: null` and show
  "not named in canon". Do not invent canon specs. A detail no source confirms stays out: Neville's wand shows no length.

## Camera mode
- MediaPipe Tasks Vision HandLandmarker 0.10.14 from jsDelivr, model from storage.googleapis.com.
- Tracks landmark 8 (index fingertip), mirrored. A wave starts when the hand speeds up, ends when it stops.
- Requires https or localhost (getUserMedia). Falls back to finger/mouse on any error, and the game never waits forever:
  loading offers the pointer at 6 s and falls back 15 s after permission (30 s for an unanswered prompt), a capture with no wave gives a hint at 8 s and falls back at 25 s.
- The stream and detection stop after the final wave, on the result card, on fallback and while the tab is hidden.
- Common in-app browsers default to the pointer with a one-line hint.

## Result card
- Shows the wand's name, 3D view, spec, one plain lore sentence, one line about the wave, sharing and Try again. The fan notice appears only on the street screen.
- The share image is a 1080×1350 PNG from `makeCard`, drawn from `SHAPES`, and made ahead of the click because browsers need the share sheet right after a tap.
- With file sharing: Share. Without it, or when a share fails: Download. In-app browsers show the image to press and hold. A cancelled share stays silent.

## 3D view
- three.js r160 from jsDelivr, loaded only on the result screen. Geometry and texture come from `SHAPES`, with custom drag-to-rotate.
- The 2D drawing stays underneath as the fallback if WebGL or the CDN fails. Rendering stops when offscreen or hidden.
- Run locally with: `npx serve .` or `python3 -m http.server 8000`, then open http://localhost:8000

## Conventions
- Talk to the user in Ukrainian. UI copy must exist in both UA and EN.
- Keep the visual style: warm candlelight, gold #d9b46a, parchment notes, Cormorant Garamond + Marck Script.
- Test on desktop (1440×900) and phone (390×844) after changes.

## Git & GitHub workflow
- One branch and one PR per task. No direct commits to `main`, no force-push, no pushing to other remotes.
- Nothing is pushed without the owner's approval.
- No AI attribution anywhere: no "Co-Authored-By", "Generated with Claude Code" or similar lines in commits, PR titles or PR descriptions.
