# Validation

Checked locally on 2026-10-04:

- TypeScript type check: passed.
- Vitest: 25 tests passed. Includes all eight bingo lines, wrong answers, repeated marked squares, 2–4 player simultaneous scoring, ties, guards against duplicate actions, complete category cycles with skips, recording bags, saved-state validation and catalog shape.
- Playwright against the **production Vite build**: 12 Chromium tests passed. Covers Together, Pass & Play for 2/3/4 players, private handoffs, delayed reveals, reload during player selection, QR image decoding back to the exact Spotify link, wrong choices, skipping, replace-game confirmation, simultaneous bingo, replay, marked-square selection, modal keyboard/focus handling, catalog metadata report, and the complete 3×3 grid at widths 320, 390 and 430.
- Production build: passed; base path is `/music-picture-bingo/`.
- Screenshots at three mobile widths inspected; no horizontal overflow, card overlap or clipped pictures. Representative screenshots are retained in the development deliverables.
- All 27 individual track pages returned HTTP 200 with title/artist metadata matching the catalog. Evidence in `spotify-verification.json`. Three recordings in each of nine categories, including alternate performances of familiar compositions.

## Actual limits

- No full audio listening or Finnish-account Spotify playback was performed. Track identity is metadata-verified, not audio-verified. Picture mappings are editorial judgments based on familiar subjects and titles.
- No physical iPhone testing was performed. Automated WebKit and Chromium tests both passed in GitHub Actions.
- Local Chromium tests used a Chromium binary supplied through the npm package `@sparticuz/chromium` because the normal Playwright download was unavailable. This package is not a project dependency or production asset. `LOCAL_CHROMIUM_PATH` optionally selects an existing local executable in the test configuration.
## Publication verification

- Source files and their contents were verified in turning50/music-picture-bingo. GitHub API writes remained blocked; publication used the signed-in GitHub browser editor.
- GitHub Actions run https://github.com/turning50/music-picture-bingo/actions/runs/37214931514 passed type checking, the production build, 25 unit tests and 24 browser tests (12 each in Chromium and WebKit). The workflow uses Node 24, required by the QR decoding test dependency.
- GitHub Pages deployment succeeded at https://turning50.github.io/music-picture-bingo/ on 2026-10-04.
- The live game was opened and checked: Together start, hidden song screen, Spotify link, QR modal, complete picture card, answer reveal and saved-game recovery after refresh.
