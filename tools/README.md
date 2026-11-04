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

## Recording real waves
Open `http://localhost:8000/tools/record.html` (from `python3 -m http.server 8000` in the repo root), wave about 30 times, press "Зберегти JSON", then:

    node tools/simulate.js --validate waves.json phone.json

The page saves in the browser as you go, and it isn't linked from the game.

For a finger on a phone, open the same page at the laptop's network address over the same Wi-Fi. The camera mode needs https or localhost, so on a phone over http only the pointer mode works.

Validation re-measures the saved points with the current code, so old recordings stay usable after a metric change. Recordings hold your movements and stay out of git.
