# Local tools

Nothing in this folder ships with the site.

## Browser tests
Run once from the repo root:

    (cd tools && npm install)
    sh tools/e2e/make-fixtures.sh      # needs ffmpeg

Then:

    node tools/e2e/camera.mjs          # camera flow, real MediaPipe model, fake camera device
    node tools/e2e/reactions.mjs       # forces all 10 reactions, plays at 390×844, screenshots in tools/e2e/shots
    node tools/e2e/wand3d.mjs          # 3D view: lazy load, drag, offscreen pause, 2D fallback
    node tools/e2e/recent.mjs          # a win is remembered and counts against that wand next game
    node tools/e2e/retry.mjs           # Try again goes straight to the wands, no warm-up wave
    node tools/e2e/logging.mjs         # one anonymous row from the live host only, the game never waits, no real requests
    node tools/e2e/castle.mjs          # /sorting: castle, routing, language, depth, the way into the hall
    node tools/e2e/hat.mjs             # the Hat: full games, every question on small screens, first impression
    node tools/e2e/swipe.mjs           # answering the Hat by swipe, finger and mouse
    node tools/e2e/face.mjs            # the Hall's first look, the Hat's eyes, blinks, brows, mouth and lean, frame rate
    node tools/e2e/voice.mjs           # the Hat's voice: what loads and plays, muted, missing files
    node tools/e2e/housecard.mjs       # the house card: 3D wand, stamped seal and shimmer, the shop link, reduced motion
    node tools/e2e/card.mjs            # result card and every sharing path, both languages
    node tools/e2e/ui.mjs              # first screens across phone and desktop sizes
    node tools/e2e/sound.mjs           # sound starts on the entry tap, the choice is remembered
    node tools/e2e/meta.mjs            # meta tags, icons, preview image, first language
    node tools/e2e/motion.mjs          # how the wand moves in a wave, depth from a finger or tilt

They start their own headless Chrome and test server, so open browser tabs stay untouched. To reach the game's internals, the test server adds an inspection hook to its own copy of `index.html`; the real file has none.

## Link preview image and icons

    node tools/make-og.mjs

Regenerates `og.jpg`, `favicon.svg` and `apple-touch-icon.png` in the repo root from the game's own drawing.

## Wand balance
No dependencies:

    node tools/simulate.js              # distribution for the current BIAS, both player models
    node tools/simulate.js --calibrate  # search for BIAS values, printed at the end
    node tools/simulate.js --parity     # the same motion through pointer and camera capture

The simulator runs the game's own `logic.js`. Re-run it after any change to wand profiles or metrics.

## Sorting balance
No dependencies:

    node tools/simulate-sorting.js      # checks the pool and the balance targets on the game's own sorting-logic.js

## Recording real waves
Open `http://localhost:8000/tools/record.html` (from `python3 -m http.server 8000` in the repo root), wave about 30 times, press "Зберегти JSON", then:

    node tools/simulate.js --validate waves.json phone.json
    node tools/simulate.js --repeat waves.json phone.json   # one person playing 20 games in a row

The page saves in the browser as you go, and it isn't linked from the game.

For a finger on a phone, open the same page at the laptop's network address over the same Wi-Fi. The camera mode needs https or localhost, so on a phone over http only the pointer mode works.

Validation re-measures the saved points with the current code, so old recordings stay usable after a metric change. Recordings hold your movements and stay out of git.

## The Hat's voice
The English lines live in `scripts/hat-lines-short.md`. With an ElevenLabs key in `.env`:

    node scripts/voice-hat.mjs --dry    # counts characters, no API calls
    node scripts/voice-hat.mjs          # asks, then records only the missing files into audio/hat
