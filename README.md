# Elementris

A mobile-first browser game that helps players learn the periodic table through guided element placement.

## MVP direction

- Small lesson boards, starting with alkali metals and noble gases.
- Guided placement followed by practice with optional hints.
- Tap to place, untimed beginner rounds, and helpful feedback on mistakes.
- Local progress without accounts.

## Visual direction

The Coming Soon page is the approved visual reference for the game. Carry its colors, typography, and raised tile treatment into the lesson boards, controls, hints, and results screens.

- Warm off-white background (`#f5f7f2`) with a subtle dotted grid.
- Deep green text and outlines (`#20332d`), with green accents (`#377f64`).
- Soft lime (`#d9e9b9`), mint (`#bce5d9`), and peach (`#f3d7a6`) tile fills. These are the visual palette; element-family color assignments are still to be defined.
- Rounded tiles with a crisp dark outline and solid downward shadow: `border: 1.5px solid #20332d`, `border-radius: 12px`, and `box-shadow: 0 5px 0 #20332d`.
- Bold, readable element symbols, clear atomic numbers, and smaller element names.
- Spacious mobile layouts and playful details. Keep placement targets stable; decorative tile rotations are for illustrations.
- For interactive tiles and buttons, use a shorter shadow and a small downward movement to convey pressing. Respect reduced-motion preferences and pair color feedback with text or icons.

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
