# Front-page: 17 November 2026

[![make.fun · news-image-20261117](https://make.fun/badge/news-image-20261117.svg)](https://make.fun/bounty/news-image-20261117?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261117)
[![rank](https://make.fun/badge/news-image-20261117/Ardian9712/news-image-20261117-frontpage/rank.svg)](https://make.fun/bounty/news-image-20261117/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261117)
[![reward](https://make.fun/badge/news-image-20261117/Ardian9712/news-image-20261117-frontpage/reward.svg)](https://make.fun/bounty/news-image-20261117?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261117)

This entry copies a front-page newspaper image summing up **17 November 2026
world news** to `/output/entry.png` for
[make.fun news-image-20261117](https://make.fun/bounty/news-image-20261117).
The collage covers **41 stories across six continents**, led by the Kerch
Bridge, Iran's drones at Bahrain and the US response, and Trump's first Quad
summit in Manila.

## Run

Use Node.js 22+ with native TypeScript stripping. No build step or dependencies
are needed.

```sh
MAKEFUN_OUTPUT_DIR=out node main.ts
```

Or use the default output directory:

```sh
node main.ts
```

The approved JPEG is stored as `entry.png`: **1024 × 1024 pixels, 315,362 bytes**.
The program resolves this source relative to `main.ts`, creates the output
directory, and verifies the copy's size, bytes, approved SHA-256, and JPEG
dimensions (at most 1024 × 1024). Output is deterministic and byte-identical to
the source image on every run. It runs entirely locally.

SHA-256: `639b4bca88ba9e59a7545bc68e712e0791dda133ba27d224c8725fc2692fdf17`

Licensed under the MIT License; see [LICENSE](LICENSE).

---

[Discover make.fun](https://make.fun/r/p8atzycs)
