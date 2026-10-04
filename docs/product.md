# Product decisions and MVP scope

## Learning goal

Elementris helps players master the periodic table. Learning is the primary goal; falling tiles and satisfying placement borrow from Tetris to make practice engaging.

## Working MVP plan

- Start with a lesson comparing alkali metals and noble gases, using two labelled family columns.
- Follow a guided round with an assisted practice round. Guided rounds highlight the correct destination; practice rounds let the player request a hint.
- Hints teach family membership first, then reveal the correct destination if more help is needed.
- Incorrect placements explain the correct family and let the player retry. An unfamiliar element should not end a beginner's round.
- Use small sections of the table instead of squeezing the entire table onto a phone. A small overview can show how each section relates to the full table.
- Design for portrait mobile use with large tap targets. Tap a column to place the element, then animate its drop.
- Keep beginner rounds untimed. Falling speed and knowledge difficulty are separate choices for later modes.
- Show learning results, including correct placements, hints used, and elements worth practising again.
- Save progress locally without requiring an account.

The first lesson teaches family membership. Exact period/row placement is a later learning objective, not something this initial interaction already teaches.

## Learning validation

Assess whether a beginner understands the task, places tiles comfortably on a phone, and improves after placement highlights disappear. Repeat elements in a different order and include a short recall check after practice. Completing a guided round alone is not evidence of recall.

## Planned technical direction

- React and TypeScript with Vite.
- HTML and CSS Grid for the board; CSS animations for placement feedback.
- Game rules separated from UI components and lesson content stored as structured data.
- Versioned localStorage for progress.
- Vitest for meaningful game-rule checks and Playwright for important browser flows.
- Vercel production deployment from `main`, with previews for pull requests.

Phase 1 implements this application stack while retaining the Coming Soon experience. Structured lesson and game-state types establish boundaries; the lesson catalog is empty and no game rules, storage, or lesson UI are active. The game-state shape is provisional until Phase 2 resolves the lesson interaction. Vitest is ready for game-rule tests, and Playwright checks the production build on desktop and portrait mobile viewports.

## Decisions still needed during implementation

- The exact beginner element set, lesson length, and completion criteria.
- Consistent element-family color assignments within the approved palette.
- Hint wording, result calculations, and rules for choosing targeted practice elements.
- The browser support baseline and details of the progress schema.

Record these choices here as they are resolved. Verify scientific content against authoritative sources when preparing lesson data.

## Later scope

Additional families and lessons, exact table positions, timed challenges, and installable/offline PWA support follow the learning MVP. Accounts, leaderboards, and chemistry reaction mechanics are outside the current MVP scope.
