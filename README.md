# Ollivanders: the wand chooses you

A small winter-themed web game. Enter the shop, wave trial wands, and one of 16 wands chooses you, by finger, mouse or a hand in front of the camera.

Play it: https://olivanders-wand-shop.vercel.app

Everything is drawn in code, in a static site with no build step. To run it locally:

    python3 -m http.server 8000

Then open http://localhost:8000. Camera mode needs https or localhost. Local tools and tests are described in [tools/README.md](tools/README.md).

## Privacy
The live site records one anonymous row per finished game, to balance the wands: wand, attempts, input mode, language, device type and how the wave moved. No names, IDs or cookies. The camera image stays on your device.

## License and fan notice
The code is under the [MIT license](LICENSE).

Unofficial fan project, not affiliated with or endorsed by Warner Bros. or J.K. Rowling. Harry Potter names, characters and related marks belong to their owners and are not licensed here. See [NOTICE](NOTICE).

Made by [Oleksandra Kokozei](https://oleksandra-kokozei.com).
