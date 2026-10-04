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

Independent practice, optional hints, and learning results are implemented in Phase 3. Saved progress is implemented in Phase 4. Active rounds reset on page refresh. Browser validation covers Chromium on desktop and small portrait viewports; a broader support baseline remains to be resolved; Phase 4 defines the progress schema.

## Language support (issue #8)

The implementation provides German and English for all current lesson screens, feedback, metadata, and accessibility labels. Initial selection uses only the highest-priority browser preference: German regional tags use German; unsupported preferences use English. A saved manual choice overrides browser detection. The top-right DE / EN switch updates immediately without resetting the round and persists when local storage is available. German uses informal `du`. All subsequent features and lesson prose must include both languages in external JSON resources; see [translation guidance](translations.md).

## Phase 3 implementation choices

- The introduction offers Start practice below the guided lesson button, so returning players can practise immediately. Guided completion also offers Start practice alongside guided replay. Both entry points start a fresh round with no collected tiles, hints, or answer records. Practice shuffles the same six elements at the start of every round, including replay, using Fisher–Yates. Each element appears exactly once. Order stays stable during the round; replay also resets all records. Independent random rounds can coincidentally have the same order. Guided order remains unchanged.
- Practice removes the automatic family guide and destination highlight. Family labels, group numbers, and collected tiles remain visible. The first requested hint names the family; the second highlights the destination. Each element starts with no hints. Both hint stages remain available after a wrong answer.
- A wrong answer explains the correct family and group, keeps the tile available, and never ends the round. It does not automatically highlight the destination. Players advance explicitly after each correct placement.
- Each element records answer attempts, the correctness of the first answer, and hint stages requested (0–2). Only completed placements contribute to placement totals. Duplicate placement, hint, or Next actions after placement/completion cannot alter results.
- **Correct on first answer** counts elements whose first submitted answer was correct, even after a hint. **Correct without help** requires a correct first answer with no requested hints. A corrected answer never counts as unaided recall.
- **Placements with help or correction** counts each element once if it used a hint or required another answer. This and unaided placements partition the six elements. First-answer correctness overlaps these categories rather than adding to them.
- **Hint stages used** counts each stage requested once, up to twelve per round. **Retry answers** counts every answer after the first for each element (attempts minus one), including the eventual correct answer. Multiple wrong answers can produce multiple retries.
- Results list every element with a hint or correction, with its hint stages and retries. Perfect unaided rounds show encouragement to replay. Players can replay practice or return to guided learning. Switching language preserves all records and results.
- The brand symbol and wordmark return to the introduction from every screen. A centered Back to home button is available below the content on lesson, practice, guided completion, and results screens. Returning home clears the current round, preserves language selection, focuses the introduction heading, and scrolls to the top. Starting again creates fresh records.
- Practice rounds and result screens remain in memory; refresh returns to lesson selection. Phase 4 saves learning progress and provides targeted review rounds. Chromium validation covers desktop and small portrait screens in both languages, keyboard focus, reduced motion, hint stages, correction, results, and replay.

## Phase 4 implementation choices

- The introduction now doubles as lesson selection. A mint lesson card offers guided learning, full practice, and targeted review alongside saved progress. Only the implemented first lesson is shown. Progress is keyed by stable lesson IDs, ready for additional lessons.
- Successful placements save immediately, including placements from unfinished rounds. Guided progress counts distinct visited elements across rounds; guided completion requires explicitly finishing a full round. Full-practice completion likewise requires finishing a full six-element practice round. Completion stays earned through replay. Guided exposure is not presented as independent recall.
- Each element's latest completed practice placement stores whether its first answer was correct without any hints. A hint or correction marks it for review. A later correct first answer without hints clears that mark. Guided placements never clear practice review. Unseen elements are neither counted as recalled nor added to review; unfinished attempts do not replace earlier evidence.
- Targeted practice shuffles every currently marked element exactly once, with the same optional hints, corrections, and untimed controls as full practice. Its subset stays fixed during the round, while saved evidence updates after each placement. Results use the subset size. Review again uses the updated review list; Replay practice always starts all six elements. Completing a subset does not earn full-practice completion.
- `elementris.progress` stores schema version 1: a lesson-ID map containing distinct guided atomic numbers, guided/full-practice completion flags, and latest per-element unaided booleans. Only this summary is persisted; round order, attempts, hint counts, active screens, and historical result totals are not restored. Reload returns to selection and starting a round creates fresh state.
- Absent, malformed, unknown-version, or inconsistent data starts with empty progress. Unknown lesson/element identifiers are rejected. Storage reads, writes, and removal are guarded; failures never prevent play. The selection card reports saving failures and progress continues in memory. If removal fails, previously saved data may return on reload.
- Reset uses an inline confirmation with Cancel and Clear progress. It removes only learning progress and preserves the saved language. No account or backend is used. The interface explains that data is stored in this browser on this device and does not sync across devices; clearing browser data also removes it.
- Validation covers partial persistence, guided and full-practice completion, hinted/corrected selection, unaided resolution, subset completion, reset/cancel, invalid data, and unavailable storage. Browser flows cover German/English on desktop and portrait Chromium.

## Phase 6 catalogue foundation

The agreed next release is a falling single-element game with all 118 elements, accessible through Play without lesson completion (issue #13). Its selector will require two or three distinct group/series destinations and offer complete-selection rounds. The implemented shared catalogue includes all names in German and English, periods, and one destination per element. The full La–Lu and Ac–Lr series take precedence over numbered groups; the group-3 game destination contains Sc and Y. See [scientific sources and the convention](lesson-data.md#whole-table-catalogue-phase-6).

This first focused change provides catalogue selection coverage and reuses element identities in the existing lesson. The falling state machine, Play entry, selection UI, results, and timed accessibility controls remain to be implemented. The defaults in issue #13 for speed, pause, corrections, scoring, and reduced motion are still proposed until the engine/interface PR records final choices. Falling results must remain separate from untimed recall evidence.

## Later scope

Additional families and lessons, exact table positions, timed challenges, and installable/offline PWA support follow the learning MVP. Accounts, leaderboards, and chemistry reaction mechanics are outside the current MVP scope.

## Phase 5 validation status

Cross-browser validation and a formative beginner protocol are documented in [MVP validation](mvp-validation.md). The proposed baseline is current desktop Chrome/Firefox/Safari and mobile Android Chrome/iOS Safari, pending owner agreement and real-device verification. Automated guided/practice flows establish software behavior only. No beginner results or recall improvement are claimed until actual participants complete baseline, unaided practice and follow-up recall tasks. See the validation document for findings and outstanding acceptance criteria.
