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

The game stack is a recommendation pending agreement. The initial Coming Soon page uses static HTML and CSS in `public/`.

## Preview the Coming Soon page

Run `python3 -m http.server 5173 --directory public` and open http://localhost:5173.

## Hosting

The [Vercel project](https://vercel.com/martinacarmenkranzl-1342s-projects/elementris) is connected to [mckc20/elementris](https://github.com/mckc20/elementris), with `main` as the production branch.

This folder is linked locally through `.vercel/project.json`, which is ignored by Git. Vercel serves `public/` using the settings in `vercel.json`.
