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

Phase 1 implements the React/TypeScript/Vite foundation. The application still shows the approved Coming Soon page; lessons and game rules are not implemented yet. `src/components/` contains reusable element tiles, a native button, and the page layout. `src/content/` defines structured lesson types and an empty lesson catalog; `src/game/` defines the proposed state boundary without React dependencies.

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

Vitest is configured for future pure game-rule tests in `src/**/*.test.ts`. It currently allows no tests because Phase 1 has no game behavior. Playwright builds and serves the production output, then checks the Coming Soon page, asset loading, portrait/desktop layout, and reduced-motion rendering in Chromium. Screenshots are saved in ignored `test-results/`. On Linux, browser setup may require `npx playwright install --with-deps chromium`.

## Hosting

The [Vercel project](https://vercel.com/martinacarmenkranzl-1342s-projects/elementris) is connected to [mckc20/elementris](https://github.com/mckc20/elementris), with `main` as the production branch.

This folder is linked locally through `.vercel/project.json`, which is ignored by Git. `vercel.json` selects the Vite framework, runs `npm run build`, and serves `dist/`. The favicon remains in `public/` and Vite copies it into the build. Git branches receive Vercel previews for PR review; only `main` deploys to production. Use the preview URL on the PR to check the actual deployed application and assets before merging. Credentials, environment files, and Vercel metadata must remain untracked.
