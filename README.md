# Elementris

A mobile-first browser game that helps players learn the periodic table through guided element placement.

## MVP direction

- Small lesson boards, starting with alkali metals and noble gases.
- Guided placement followed by practice with optional hints.
- Tap to place, untimed beginner rounds, and helpful feedback on mistakes.
- Local progress without accounts.

## Visual direction

The Coming Soon page is the approved visual reference: soft lime, mint, and peach tiles with deep green outlines and solid raised shadows. See [the visual guide](docs/design.md) for colors, tile treatment, and interaction guidance.

## Project documentation

- [Product decisions and scope](docs/product.md)
- [Visual guide](docs/design.md)
- [Development phases and context handoff](docs/roadmap.md)
- [Language selection and adding translations](docs/translations.md)
- [Agent development instructions](AGENTS.md)

## Browser stack

- React and TypeScript for the interface and game state.
- Vite for development and production builds.
- HTML and CSS Grid for the board, with CSS animations for tile drops.
- Browser localStorage for versioned learning progress.
- Vitest for game rules and Playwright for mobile browser flows.
- An installable progressive web app with offline lessons in a later iteration.

Phase 2 replaces Coming Soon with the first guided family lesson: an introduction, six untimed placements with corrections and retries, a periodic-table overview, completion, and replay. `src/content/` contains verified structured lesson data; `src/game/` holds pure progression rules; UI components render the lesson. See [lesson data and sources](docs/lesson-data.md).

Phase 2 includes the local review feedback: collected names and symbols align on one row, including small phones, while retaining compact tiles. Phase 3 adds independent practice and learning results; saved progress and targeted review are available in Phase 4.

German and English are available throughout the lesson, with a top-right DE / EN switch. A saved manual choice overrides the highest-priority browser language; unsupported preferences use English. New features must provide external JSON translations in both languages. See [translation guidance](docs/translations.md).

Phase 3 offers practice directly from the introduction or after guided completion, with untimed placement of the same six elements in a freshly shuffled order each round. Family clues and destination highlights are optional. Results separate first-answer correctness from unaided recall, show hint stages and retries, and identify elements to review. Round results remain in memory until replay or refresh; learning progress is saved locally. See [calculation decisions](docs/product.md#phase-3-implementation-choices).

Phase 4 adds a lesson selection card with guided progress, full-practice completion, latest unaided answers, and targeted review. Placements save immediately in versioned local storage. Reloads return to lesson selection; unfinished rounds restart. Review uses the latest completed practice placement for each element, and an unaided first answer removes it from review. Reset clears learning progress while preserving language. Progress is specific to this browser/device and is not synced; unavailable storage permits play in memory. See [Phase 4 decisions](docs/product.md#phase-4-implementation-choices).

## Local development and checks

Phase 6 adds Play directly from home: select two or three of the 18 groups or two series and steer every selected element once in a shuffled falling round. Tiles fall over 12 seconds, with touch/keyboard lane selection, early Drop, pause, correction/retry, results, and replay. Reduced motion uses a stationary countdown; hidden pages pause until explicit resume. Falling results stay separate from saved lesson evidence. All 118 elements and bilingual names come from `src/content/catalogue.ts`; see [rules and decisions](docs/product.md#phase-6-implementation-choices) and [scientific sources](docs/lesson-data.md#whole-table-catalogue-phase-6). This implementation awaits PR review and merge for [issue #13](https://github.com/mckc20/elementris/issues/13).

Use Node.js 22.12 or later and npm. From a fresh checkout:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite (normally http://localhost:5173).

```sh
npm run typecheck
npm run build
npm run preview
```

The build writes the deployable application to `dist/`. `preview` serves that build locally.

```sh
npm test
npx playwright install chromium firefox webkit
npm run test:e2e
```

Vitest checks retries, progression, duplicate placement protection, completion, replay, staged hints, and practice result calculations. Playwright builds and serves the production output, then checks the full guided-to-practice-to-results flow in both languages, corrections, replay, keyboard focus, reduced motion, asset loading, and portrait layout in Chromium, Firefox, and WebKit (desktop and emulated portrait devices). See [MVP validation](docs/mvp-validation.md) for evidence and pending real-device/beginner checks. Screenshots are saved in ignored `test-results/`. On Linux, browser setup may require `npx playwright install --with-deps chromium`.

## Hosting

The [Vercel project](https://vercel.com/martinacarmenkranzl-1342s-projects/elementris) is connected to [mckc20/elementris](https://github.com/mckc20/elementris), with `main` as the production branch.

This folder is linked locally through `.vercel/project.json`, which is ignored by Git. `vercel.json` selects the Vite framework, runs `npm run build`, and serves `dist/`. The favicon remains in `public/` and Vite copies it into the build. Git branches receive Vercel previews for PR review; only `main` deploys to production. Use the preview URL on the PR to check the actual deployed application and assets before merging. Credentials, environment files, and Vercel metadata must remain untracked.
