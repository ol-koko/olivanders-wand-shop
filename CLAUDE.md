# Ollivanders — "The wand chooses you"

A small winter-themed web app (fan project, Harry Potter world). The user enters Ollivanders,
waves trial wands, and one of 16 character wands eventually chooses them.

## Current state
- Everything lives in a single `index.html` (HTML + CSS + vanilla JS, no build step).
- Visuals are drawn in code: SVG street scene, canvas shop interior, canvas FX layer. No image assets.
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
  offset tuned so each wand wins ~6–7% (Elder Wand ~2%). Re-run a simulation if profiles change.
- Canon facts only: wands whose wood/core are not named in the books have `spec: null` and show
  "not named in the books". Do not invent canon specs.

## Camera mode
- MediaPipe Tasks Vision HandLandmarker 0.10.14 from jsDelivr, model from storage.googleapis.com.
- Tracks landmark 8 (index fingertip), mirrored. A wave starts when the hand speeds up, ends when it stops.
- Requires https or localhost (getUserMedia). Falls back to finger/mouse on any error.
- Run locally with: `npx serve .` or `python3 -m http.server 8000`, then open http://localhost:8000

## Conventions
- Talk to the user in Ukrainian. UI copy must exist in both UA and EN.
- Keep the visual style: warm candlelight, gold #d9b46a, parchment notes, Cormorant Garamond + Marck Script.
- Test on desktop (1440×900) and phone (390×844) after changes.
