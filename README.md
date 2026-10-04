# Music Picture Bingo 🐾

A colourful, cat-themed music bingo game for families aged 6 and up. Listen to a Finnish children's song in Spotify, choose its picture, and collect three squares in a row. The interface is English; reading is not required to recognise the pictures.

## Play

- **Together:** one card and one shared goal.
- **Pass & Play:** 2–4 players on one phone, with private answers and differently arranged cards.
- An adult uses **Open Spotify** or **Show QR** to play the selected song. Hide the Spotify screen from players: Spotify displays song names and artwork.
- After listening, select one picture and confirm. Everyone answers before the correct picture appears.
- A correct answer marks the square; a wrong answer preserves earlier marks. Already marked squares remain selectable but are never counted twice.
- Three in a row horizontally, vertically, or diagonally makes bingo. Simultaneous winners share the win.
- There is no timer. **Skip song** skips without marking squares; the category returns in a later cycle.
- Every nine drawn songs include each picture once. Different recordings are used before repeating a recording in that category.
- Progress is saved on this device. Reload or return from Spotify and use **Resume game**. A new game asks before replacing unfinished progress.

## Local development

Requires Node.js 24 or later.

```sh
npm ci
npm run dev
```

Open the URL printed by Vite, including `/music-picture-bingo/`.

```sh
npm run typecheck
npm test
npx playwright install --with-deps chromium webkit
npm run test:e2e
npm run build
npm run preview
```

## Deployment

This repository is configured for GitHub Pages at `/music-picture-bingo/`. In **Settings → Pages → Build and deployment**, select **GitHub Actions**. `.github/workflows/deploy.yml` checks types, tests game logic, runs Chromium and WebKit browser tests, builds the static app, and deploys successful pushes to `main`. Pull requests are checked without publishing. No server, secrets, Spotify API key or application account is needed.

Play the published game: https://turning50.github.io/music-picture-bingo/

Published and checked on 2026-10-04. GitHub Actions passed 25 unit tests and 24 browser tests across Chromium and WebKit. See `docs/validation.md` for the checks and actual limits.

## Song catalog

`src/catalog.ts` contains nine categories and 27 individual Spotify recordings (including alternate performances of the same familiar songs). Fields include ID, title, artist, URL, language, category, explanation, source, check date, and verification flags.

Names and artists were checked against the public Spotify track pages on 2026-10-04. `docs/spotify-verification.json` records the observed metadata. This is **metadata verification**, not listening verification. Audio, lyrical detail, and playback availability on a Finnish Spotify account have not been verified in this environment. Familiar Finnish children's-song subjects guided the picture mappings. An adult should listen through the catalog before a children's session and skip any unavailable or unsuitable recording.

No recordings, cover artwork or lyrics are distributed with the app. Spotify playback is controlled manually by the adult; app switching, advertisements and playback restrictions depend on Spotify and the device. Automatic playback or fixed-length excerpts are not promised.

To check public metadata again (Python 3, no additional packages):

```sh
python scripts/verify_spotify.py
```

### Extend the catalog

Add a row to `src/catalog.ts` using a verified Spotify track ID, artist, and an unambiguous category. Keep at least two recordings in each category. Update sources/check flags after verification, then run checks. Avoid songs whose main subjects match several pictures on the same board. `docs/catalog-notes.md` explains the current choices.

Add or change categories in `categories` and provide an illustration in `src/art.tsx`. A board must still contain exactly nine different categories. If changing category IDs or saved-game format, increment the storage version and update validation. Old invalid saves are ignored safely.

## Privacy and accessibility

No analytics, tracking scripts, external image/font services or application ads. Progress and optional names stay in browser localStorage. Opening Spotify shares the selected track request with Spotify, whose own policies apply.

Large labelled picture buttons, keyboard controls, native modal focus handling, visible focus styles, and colour-independent selection/mark symbols. Reduced-motion preferences are respected. Illustrations are original local SVGs. The game uses no sound effects.

## License

Original code and SVG illustrations: MIT, see `LICENSE`. Spotify recordings and metadata retain their respective owners' rights. Dependency licenses are documented in `THIRD_PARTY_NOTICES.md`.
