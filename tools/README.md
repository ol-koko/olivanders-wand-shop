# Local tools

Nothing in this folder ships with the site.

## Browser tests
Run once from the repo root:

    (cd tools && npm install)
    sh tools/e2e/make-fixtures.sh      # needs ffmpeg

Then:

    node tools/e2e/camera.mjs          # camera flow, real MediaPipe model, fake camera device
    node tools/e2e/reactions.mjs       # forces all 10 reactions, plays at 390×844, screenshots in tools/e2e/shots

They start their own headless Chrome and test server, so open browser tabs stay untouched. To reach the game's internals, the test server adds an inspection hook to its own copy of `index.html`; the real file has none.
