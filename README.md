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
- [Agent development instructions](AGENTS.md)

## Browser stack

- React and TypeScript for the interface and game state.
- Vite for development and production builds.
- HTML and CSS Grid for the board, with CSS animations for tile drops.
- Browser localStorage for versioned learning progress.
- Vitest for game rules and Playwright for mobile browser flows.
- An installable progressive web app with offline lessons in a later iteration.

Phase 2 replaces Coming Soon with the first guided family lesson: an introduction, six untimed placements with corrections and retries, a periodic-table overview, completion, and replay. `src/content/` contains verified structured lesson data; `src/game/` holds pure progression rules; UI components render the lesson. See [lesson data and sources](docs/lesson-data.md).

Phase 2 includes the local review feedback: collected names and symbols align on one row, including small phones, while retaining compact tiles. Independent practice and saved progress follow in later phases.

## Local development and checks

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
npx playwright install chromium
npm run test:e2e
```

Vitest checks retries, progression, duplicate placement protection, completion, and replay. Playwright builds and serves the production output, then checks the full guided flow, corrections, replay, keyboard focus, reduced motion, asset loading, and portrait layout in Chromium. Screenshots are saved in ignored `test-results/`. On Linux, browser setup may require `npx playwright install --with-deps chromium`.

## Hosting

The [Vercel project](https://vercel.com/martinacarmenkranzl-1342s-projects/elementris) is connected to [mckc20/elementris](https://github.com/mckc20/elementris), with `main` as the production branch.

This folder is linked locally through `.vercel/project.json`, which is ignored by Git. `vercel.json` selects the Vite framework, runs `npm run build`, and serves `dist/`. The favicon remains in `public/` and Vite copies it into the build. Git branches receive Vercel previews for PR review; only `main` deploys to production. Use the preview URL on the PR to check the actual deployed application and assets before merging. Credentials, environment files, and Vercel metadata must remain untracked.
