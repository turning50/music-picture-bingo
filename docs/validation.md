# Validation

Checked locally on 2026-10-04:

- TypeScript type check: passed.
- Vitest: 25 tests passed. Includes all eight bingo lines, wrong answers, repeated marked squares, 2–4 player simultaneous scoring, ties, guards against duplicate actions, complete category cycles with skips, recording bags, saved-state validation and catalog shape.
- Playwright against the **production Vite build**: 12 Chromium tests passed. Covers Together, Pass & Play for 2/3/4 players, private handoffs, delayed reveals, reload during player selection, QR image decoding back to the exact Spotify link, wrong choices, skipping, replace-game confirmation, simultaneous bingo, replay, marked-square selection, modal keyboard/focus handling, catalog metadata report, and the complete 3×3 grid at widths 320, 390 and 430.
- Production build: passed; base path is `/music-picture-bingo/`.
- Screenshots at three mobile widths inspected; no horizontal overflow, card overlap or clipped pictures. Representative screenshots are in `docs/screenshots/`.
- All 27 individual track pages returned HTTP 200 with title/artist metadata matching the catalog. Evidence in `spotify-verification.json`. Three recordings in each of nine categories, including alternate performances of familiar compositions.

## Actual limits

- No full audio listening or Finnish-account Spotify playback was performed. Track identity is metadata-verified, not audio-verified. Picture mappings are editorial judgments based on familiar subjects and titles.
- Physical iPhone and Safari/WebKit testing have not been performed locally. WebKit browser download was unavailable in this environment. The GitHub workflow is configured to test both Chromium and WebKit after upload.
- Local Chromium tests used a Chromium binary supplied through the npm package `@sparticuz/chromium` because the normal Playwright download was unavailable. This package is not a project dependency or production asset. `LOCAL_CHROMIUM_PATH` optionally selects an existing local executable in the test configuration.
- GitHub API writes returned HTTP 403 “Resource not accessible by integration” for both contents and Git objects. The source, tests, local commit history, and publication workflow are prepared, but no remote push or Pages publication has succeeded yet. The public deployment target is not a verified live game.
