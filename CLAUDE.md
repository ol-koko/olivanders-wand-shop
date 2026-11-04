# Ollivanders — "The wand chooses you"

A small winter-themed web app (fan project, Harry Potter world). The user enters Ollivanders,
waves trial wands, and one of 16 character wands eventually chooses them.

## Current state
- Static site, no build step. `index.html` holds the page, styles, drawing, FX and flow. `logic.js` holds the game logic with no DOM (wands, metrics, choosing, camera motion), shared with `tools/`.
- Visuals are drawn in code: SVG street scene, canvas shop interior, canvas FX layer. The only image files are `og.png`, `favicon.svg` and `apple-touch-icon.png`, for link previews and icons; `tools/make-og.mjs` generates them from the game's own drawing.
- `tools/` is local only and never ships: balance simulator, wave recorder, Playwright tests. See `tools/README.md`.
- Sound is generated with WebAudio (off by default, toggle top-right).
- Depth effect: layers follow the mouse on desktop. On touch screens they follow a finger dragged over the street, and the tilt where the browser gives orientation events with no prompt, easing back to a slow drift. Reduced motion keeps the layers still: no drift, tilt, drag or mouse. Never ask for motion permission: the camera is the only permission in the app.
- UA / EN toggle; all strings live in the `S`, `OFFER`, `FAIL`, `WIN`, `WAVE_WORDS` objects and in `WANDS`. The first language comes from the browser: Ukrainian for `uk`, English for the rest, and the person's choice is remembered. The meta tags are in English.

## Key logic (keep it this way unless asked)
- Flow: street → door transition → input choice (camera / finger-mouse) → warm-up wave → wand attempts → result card.
- Notes during attempts show only the wand's spec and Ollivander's line, with no spell.
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
- `strokeMetrics` measures on a fixed 33 ms grid and on the min(w, h) scale, so input rate doesn't change traits. `SCALES` in `logic.js` holds separate ranges for pointer and camera, read from recorded waves, because a hand moves about half as fast as a finger. Check changes against real waves with `node tools/simulate.js --validate`.
- During a wave the tip follows the hand and the handle moves only as a rigid wand requires, so the wand pivots from the grip.
- Wand looks: `SHAPES` in `index.html` is the single shape spec. The box, hand, result card, saved card and 3D view all render from it. Matching doesn't use it.
- Canon facts only: wands whose wood/core are not named in canon have `spec: null` and show no spec line, with no label about it.
  Do not invent canon specs. A detail no source confirms stays out: Neville's wand shows no length.

## Camera mode
- The video shows inside a vintage portrait frame (`#camBox`, SVG drawn in code), like the magical portraits at Hogwarts.
- MediaPipe Tasks Vision HandLandmarker 0.10.14 from jsDelivr, model from storage.googleapis.com.
- Tracks landmark 8 (index fingertip), mirrored. A wave starts when the hand speeds up, ends when it stops.
- Requires https or localhost (getUserMedia). Falls back to finger/mouse on any error, and the game never waits forever:
  loading offers the pointer at 6 s and falls back 15 s after permission (30 s for an unanswered prompt), a capture with no wave gives a hint at 8 s and falls back at 25 s.
- The stream and detection stop after the final wave, on the result card, on fallback and while the tab is hidden.
- Common in-app browsers default to the pointer with a one-line hint.

## Result card
- A full-page dark overlay with the card centred in it: name, spec, 3D view with plenty of space, one line about why the wand chose you, sharing and Try again. The fan notice appears only on the street screen. "made by Oleksandra Kokozei 🪄" is in English in both languages, links to oleksandra-kokozei.com and stays on the card, not on the share image. The design source is the owner's Figma file.
- The share image is a 1080×1350 PNG from `makeCard`, drawn from `SHAPES`, and made ahead of the click because browsers need the share sheet right after a tap.
- With file sharing: Share. Without it, or when a share fails: Download. In-app browsers show the image to press and hold. A cancelled share stays silent.

## 3D view
- three.js r160 from jsDelivr, loaded only on the result screen. Geometry and texture come from `SHAPES`. The wand makes one full turn when the card appears, then can be rotated freely by drag.
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
