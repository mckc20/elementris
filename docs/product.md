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

## Phase 2 implementation choices

These choices are implemented for local review; they can be adjusted based on user feedback before the phase PR:

- Six elements, once each, in the order Li, He, Na, Ne, K, Ar. Alternating families introduces both early and keeps the lesson short.
- Alkali metals use lime, noble gases use mint. The current element uses peach; the family name and highlighted destination explicitly teach its membership.
- Both labelled columns remain large native buttons. Touch, Enter, and Space place a tile. A visible outline and “Place here” cue identify the guided destination.
- Incorrect placement explains the correct family and group. The same element remains available for unlimited retries, without losing progress.
- Correct placement collects the tile and shows confirmation. A separate Next element button lets the player read the feedback at their own pace; it receives keyboard focus. No timer or automatic advance.
- Completion requires all six correct placements and confirmation with Finish lesson. Replay resets the round. Completion describes guided exposure, without claiming independent recall.
- The miniature periodic table locates groups 1 and 18, with hydrogen excluded from the alkali highlight. Collection slots represent family membership, not exact table positions or chemical reactions.
- Lesson data and scientific references are recorded in [lesson-data.md](lesson-data.md).

Independent practice, optional hints, learning results, and saved progress remain planned for phases 3 and 4. The round currently resets on page refresh. Browser validation covers Chromium on desktop and small portrait viewports; a broader support baseline and the versioned progress schema remain to be resolved.

## Language support (issue #8)

The implementation provides German and English for all current lesson screens, feedback, metadata, and accessibility labels. Initial selection uses only the highest-priority browser preference: German regional tags use German; unsupported preferences use English. A saved manual choice overrides browser detection. The top-right DE / EN switch updates immediately without resetting the round and persists when local storage is available. German uses informal `du`. All subsequent features and lesson prose must include both languages in external JSON resources; see [translation guidance](translations.md).

## Later scope

Additional families and lessons, exact table positions, timed challenges, and installable/offline PWA support follow the learning MVP. Accounts, leaderboards, and chemistry reaction mechanics are outside the current MVP scope.
