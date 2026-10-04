# Working on Elementris

## Start here

- Read `README.md`, `docs/product.md`, `docs/design.md`, and `docs/roadmap.md` before implementing a feature.
- When working from a GitHub issue, read its current description, comments, dependencies, and acceptance criteria. Use the issue and repository documents as the handoff between chats.
- Inspect the current implementation and Git status before changing files; preserve unrelated work.

## Implementation workflow

- Implement phase work on a branch and open a pull request with a Vercel preview for review. A phase issue can span several focused PRs; link each PR to the phase issue without closing it prematurely.
- Keep game rules separate from rendering and store lesson content as structured data.
- Ship all new player-facing features and lesson prose in German and English using external JSON resources, including accessibility labels. Follow `docs/translations.md` and run `npm run check:translations`; keep feedback semantic and scientific identifiers independent of language.
- Preserve the approved visual direction in `docs/design.md`. Build for portrait mobile use, keyboard access, and reduced-motion preferences.
- Keep scientific facts accurate. Verify lesson data against authoritative chemistry sources when adding it; do not imply that collecting or clearing tiles represents a chemical reaction.
- Run checks appropriate to the change. Once app scripts exist, use the documented build, type-check, and relevant tests. Verify meaningful game rules and browser flows; avoid tests that merely repeat the implementation.
- Update documentation when behavior or decisions change. Distinguish agreed requirements, proposed choices, and implemented behavior.

## Finish or hand off

- In a PR, describe the resulting behavior, validation, and any remaining limitations. Link the phase issue.
- Close a phase issue only once all its acceptance criteria are met and the relevant changes are merged.
- Before leaving incomplete work, comment on the issue with the branch/PR, completed work, remaining work, checks run, and blockers. Do not rely on chat history to carry those details.
- Keep credentials, `.env` files, and `.vercel/` metadata out of Git. The GitHub repository is public.

## Current deployment

- GitHub: `mckc20/elementris`; production branch: `main`.
- Hosting: Vercel. The Coming Soon page currently uses static files in `public/` and settings in `vercel.json`.
- Update the deployment settings when introducing the game application. Use Vercel previews to validate implementation PRs.
