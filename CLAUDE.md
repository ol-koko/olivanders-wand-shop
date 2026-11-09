# Ollivanders — "The wand chooses you"

A small winter-themed web app (fan project, Harry Potter world). The user enters Ollivanders,
waves trial wands, and one of 16 character wands eventually chooses them.

## Current state
- Static site, no build step. `index.html` holds the page and the shop's styles. `core.js` and `core.css` hold what every screen shares: helpers, language, depth, sound, the parchment note, logging. `wands.js` holds the wands' looks: `SHAPES`, the 2D drawing and the 3D view. `shop.js` holds the shop's drawing, FX and flow. `logic.js` holds the game logic with no DOM (wands, metrics, choosing, camera motion), shared with `tools/`.
- The scripts are plain `<script>` tags in that order (`logic.js`, `core.js`, `wands.js`, `shop.js`) and share top-level names. `core.js` expects each page's script to declare `st` and add its strings to `S`.
- Visuals are drawn in code: SVG street scene, canvas shop interior, canvas FX layer. The only image files are `og.jpg`, `og-sorting.jpg`, `favicon.svg` and `apple-touch-icon.png`, for link previews and icons, and the only audio files are the Hat's voice in `audio/hat`; `tools/make-og.mjs` generates them from the game's own drawing.
- `tools/` is local only and never ships: balance simulator, wave recorder, Playwright tests. See `tools/README.md`.
- Sound is generated with WebAudio. It starts on the tap that enters the shop, because browsers allow sound only after a tap. The toggle is top-right and the person's choice is remembered.
- Depth effect: layers follow the mouse on desktop. On touch screens they follow a finger dragged over the street, and the tilt where the browser gives orientation events with no prompt, easing back to a slow drift. Reduced motion keeps the layers still: no drift, tilt, drag or mouse. Never ask for motion permission: the camera is the only permission in the app.
- UA / EN toggle; all strings live in the `S`, `OFFER`, `FAIL`, `WIN` objects and in `WANDS`. The first language comes from the browser: Ukrainian for `uk`, English for the rest, and the person's choice is remembered. The meta tags are in English.

## Key logic (keep it this way unless asked)
- Flow: street → door transition → input choice (camera / finger-mouse) → warm-up wave → wand attempts → result card. Try again skips the warm-up: the last wave of the game before stands in for it.
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
- A person's waves stay alike, so the wands that chose them last count as a little further away (`RECENT` in `logic.js`, kept in `wand-recent`). Check with `node tools/simulate.js --repeat`. The simulator's other modes run without this memory, so `BIAS` stays the balance for a first game.
- Draco's `BIAS` is set by hand below its calibrated value, about 4% in the stroke model, because real waves read sharper than the model and he won far more often for real players. Keep this value after `--calibrate`, or set it again from recorded waves.
- `strokeMetrics` measures on a fixed 33 ms grid and on the min(w, h) scale, so input rate doesn't change traits. `SCALES` in `logic.js` holds separate ranges for mouse, touch and camera, because a hand moves about half as fast as a finger. Pointer and camera come from recorded waves, checked with `node tools/simulate.js --validate`. Touch comes from logged games, because a finger in the game moves far slower and narrower than in free recording, so `tools/record.html` waves don't set it.
- The line a wave draws is softened a little by `smoothPath`, for the picture only. Traits are measured on the raw points.
- During a wave the tip follows the hand and the handle moves only as a rigid wand requires, so the wand pivots from the grip.
- Wand looks: `SHAPES` in `index.html` is the single shape spec. The box, hand, result card, saved card and 3D view all render from it. Matching doesn't use it.
- Canon facts only: wands whose wood/core are not named in canon have `spec: null` and show no spec line, with no label about it.
  Do not invent canon specs. A detail no source confirms stays out: Neville's wand shows no length.

## Sorting Ceremony
- `/sorting` is `sorting/index.html` with `hall.js`: the Hogwarts exterior, drawn in code with the same depth as the street, and a flight through the wall into the Great Hall. It has its own meta tags and preview image (`og-sorting.jpg`, `node tools/make-og.mjs sorting`). House crests, film designs and named ghosts stay out: everything is our own drawing.
- The way in is the signpost on the street (`buildPost` / `placePost` in `shop.js`), drawn after the reference the owner gave: the top board «Вже маєш паличку? До Гоґвортсу» is a real link to `/sorting`, and the Platform 9¾ and Diagon Alley boards only swing when tapped. Where there is street to the right of the shop it stands there; on narrow screens it rises into the sky at the right edge, below the title. The street fades out before the page changes. Check with `node tools/e2e/signpost.mjs`.
- `sorting-logic.js` holds the scoring with no DOM and `sorting-questions.js` the pool, both shared with `tools/simulate-sorting.js`. Each game asks 3 questions, one per category, then the wish. Not wanting a house is an optional action on the wish screen, not a separate screen.
- The Hat speaks the page's language, from the owner's script `scripts/hat-lines-short.md`, recorded with ElevenLabs by `scripts/voice-hat.mjs` into `audio/hat/<id>.mp3` (English) and `audio/hat/ua/<id>.mp3` (Ukrainian, `--lang ua`). These are the only audio files in the game. In Ukrainian only the owner's chosen take of each house name ships: G 3, H 2, R 3, S 3. The voice plays through the page's sound, so the sound button mutes it, and each game loads only its own lines. Verdicts and build-up lines have three takes, one picked per game. A few options carry their own reaction, which plays instead of the question's r1/r2. The verdict: while the Hat thinks its brows go down, its eyes search, its tip droops and the four crests circle behind it and flare in turn, slowing down, and go out before the verdict. Then its line about the wish if there is one (got / denied / avoided / overruled; a granted wish always hears got2), a held breath, the house on the note as the Hat rises in a golden glow with magic dust spiralling up around it (two canvases, behind and in front of the Hat), and the card opens with a chime as the crest lands. Reduced motion: no flaring, searching, rise or dust, the glow only fades in. Check with `node tools/e2e/verdict.mjs`.
- After the flight the Hall is shown clear for about 1.8 s with a slow push-in and a few drifting ghosts, class `spirit` because `.ghost` is the button style (a tap skips it), then it dims and the Hat floats in. The Hat's black eyes move to follow the pointer or the option under it and come back to the player, it blinks, raises or furrows its brows by the line, opens its mouth with the voice's level (closed without sound) and leans toward the picked option. Reduced motion: no push-in, a shorter hold, no sway or lean.
- The Hat is answered by tapping an option or by swiping toward it, with a finger or a mouse, from anywhere on the screen. The option in the slide's direction lights up and the Hat looks at it, letting go picks it, sliding back or away picks nothing. The four banners swipe too, the other buttons of the wish screen are tap only. Check with `node tools/e2e/swipe.mjs`. `hat-seen` keeps asked questions and `wand-last` keeps the last wand's traits for a day, both only in the browser. No counters or hints about how many questions remain.
- After the questions comes one wish screen: 4 banners, and not wanting a house is an action on that screen. Each house is an ornate crest from `crests.js`: gold scrollwork, a crown, a shield in its colours and our own drawing of its animal (lion, snake, raven, badger), not the official crests. The card shares like the wand card, from `core.js`. A finished ceremony logs one row to `sorting_results`: house, wish, unwanted house, whether the wand counted, device, language, no answers.
- Targets: about 25% per house on random answers, 60–70% for a wished house, under 10% for an unwanted one. After any change to the pool or the weights, re-run `node tools/simulate-sorting.js`.

- The house card shows the crest as a medal you can turn in 3D (CSS 3D: the live crest in front, layered copies for the edge, a darker back): one slow turn after the stamp, then drag to spin with a little momentum. The wand isn't shown; a line names it if there is one, otherwise the link to the shop. The crest stamps down like a wax seal with a small card shake and a soft thud (sound on only), then a gold shimmer sweeps across it every few seconds. Reduced motion: it fades in, no shimmer, no automatic turn.

## Result logging
- The live site sends one anonymous row per finished game to Supabase, project `ollivanders-wand-shop`, table `wand_results`: wand, attempts, input mode, language, device type, the 5 averaged traits, average wave length (in screen widths) and duration. No names, IDs or cookies, and `created_at` is cut to the hour. Previews, localhost and tests send nothing.
- The public key can only insert. The game never waits for this and a failure stays silent.
- Recalibrate on the logged traits, not on win shares, because `RECENT` also changes who wins. Rows from before the touch scale (#24) are on the old scale: separate them by `created_at`.

## Camera mode
- The video shows inside a vintage portrait frame (`#camBox`, SVG drawn in code), like the magical portraits at Hogwarts.
- MediaPipe Tasks Vision HandLandmarker 0.10.14 from jsDelivr, model from storage.googleapis.com.
- Tracks landmark 8 (index fingertip), mirrored. A wave starts when the hand speeds up, ends when it stops.
- Requires https or localhost (getUserMedia). Falls back to finger/mouse on any error, and the game never waits forever:
  loading offers the pointer at 6 s and falls back 15 s after permission (30 s for an unanswered prompt), a capture with no wave gives a hint at 8 s and falls back at 25 s.
- The stream and detection stop after the final wave, on the result card, on fallback and while the tab is hidden.
- Common in-app browsers default to the pointer with a one-line hint.

## Result card
- A see-through dark overlay over the shop with the card centred in it, and the card's light centred on the wand: name, spec, 3D view with plenty of space, the wand's own lore sentence, sharing and Try again. The fan notice appears only on the street screen. "made by Oleksandra Kokozei 🪄" is in English in both languages, links to oleksandra-kokozei.com and stays on the card, not on the share image. The design source is the owner's Figma file.
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
