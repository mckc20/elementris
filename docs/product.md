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

Independent practice, optional hints, and learning results are implemented in Phase 3. Saved progress remains planned for Phase 4. The round currently resets on page refresh. Browser validation covers Chromium on desktop and small portrait viewports; a broader support baseline and the versioned progress schema remain to be resolved.

## Language support (issue #8)

The implementation provides German and English for all current lesson screens, feedback, metadata, and accessibility labels. Initial selection uses only the highest-priority browser preference: German regional tags use German; unsupported preferences use English. A saved manual choice overrides browser detection. The top-right DE / EN switch updates immediately without resetting the round and persists when local storage is available. German uses informal `du`. All subsequent features and lesson prose must include both languages in external JSON resources; see [translation guidance](translations.md).

## Phase 3 implementation choices

- Guided completion offers Start practice alongside guided replay. Practice uses the same elements in the fixed order Na, He, Li, Ar, K, Ne; practice replay resets records and repeats this order.
- Practice removes the automatic family guide and destination highlight. Family labels, group numbers, and collected tiles remain visible. The first requested hint names the family; the second highlights the destination. Each element starts with no hints. Both hint stages remain available after a wrong answer.
- A wrong answer explains the correct family and group, keeps the tile available, and never ends the round. It does not automatically highlight the destination. Players advance explicitly after each correct placement.
- Each element records answer attempts, the correctness of the first answer, and hint stages requested (0–2). Only completed placements contribute to placement totals. Duplicate placement, hint, or Next actions after placement/completion cannot alter results.
- **Correct on first answer** counts elements whose first submitted answer was correct, even after a hint. **Correct without help** requires a correct first answer with no requested hints. A corrected answer never counts as unaided recall.
- **Placements with help or correction** counts each element once if it used a hint or required another answer. This and unaided placements partition the six elements. First-answer correctness overlaps these categories rather than adding to them.
- **Hint stages used** counts each stage requested once, up to twelve per round. **Retry answers** counts every answer after the first for each element (attempts minus one), including the eventual correct answer. Multiple wrong answers can produce multiple retries.
- Results list every element with a hint or correction, with its hint stages and retries. Perfect unaided rounds show encouragement to replay. Players can replay practice or return to guided learning. Switching language preserves all records and results.
- Practice and results remain in memory; refresh resets the lesson. Persistence and targeted review rounds belong to Phase 4. Chromium validation covers desktop and small portrait screens in both languages, keyboard focus, reduced motion, hint stages, correction, results, and replay.

## Later scope

Additional families and lessons, exact table positions, timed challenges, and installable/offline PWA support follow the learning MVP. Accounts, leaderboards, and chemistry reaction mechanics are outside the current MVP scope.
