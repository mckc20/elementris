# Elementris

A mobile-first browser game that helps players learn the periodic table through guided element placement.

## MVP direction

- Small lesson boards, starting with alkali metals and noble gases.
- Guided placement followed by practice with optional hints.
- Tap to place, untimed beginner rounds, and helpful feedback on mistakes.
- Local progress without accounts.

## Proposed browser stack

- React and TypeScript for the interface and game state.
- Vite for development and production builds.
- HTML and CSS Grid for the board, with CSS animations for tile drops.
- Browser localStorage for versioned learning progress.
- Vitest for game rules and Playwright for mobile browser flows.
- An installable progressive web app with offline lessons in a later iteration.

The browser stack is a recommendation pending agreement; application scaffolding has not been created yet.

## Hosting

The [Vercel project](https://vercel.com/martinacarmenkranzl-1342s-projects/elementris) is connected to [mckc20/elementris](https://github.com/mckc20/elementris), with `main` as the production branch.

This folder is linked locally through `.vercel/project.json`, which is ignored by Git. Application deployment will follow once the app is scaffolded.
