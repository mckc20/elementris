# Phase 5: MVP validation

Tracking issue: [#5](https://github.com/mckc20/elementris/issues/5). Phase 4 is merged in PR #11 and issue #4 is closed. This phase remains open until real beginner observations, device checks, and review/merge are complete. Automated placements are software checks, not learning evidence.

## Proposed browser baseline

Pending owner agreement: current stable desktop Chrome, Firefox, and Safari; Android Chrome and iOS Safari in portrait at widths of 320 CSS pixels and above. No older-version support claim is made. Revalidate current versions for each release. Browser engines supplied by Playwright are reproducible proxies, not proof of support on physical phones or installed stable Safari. Record OS, browser version, device, viewport and language for manual checks.

Playwright projects cover desktop Chromium, narrow portrait Chromium (375 × 667), desktop Firefox, desktop WebKit, Pixel 7 Chromium emulation and iPhone SE WebKit emulation. Both languages exercise guidance, wrong answers, hints, independent practice, results, replay, returning-player progress, targeted review, reset, unavailable storage, focus and reduced motion. Additional checks cover 320 × 568, doubled text, native touch taps, 44px controls, and axe WCAG 2.1 A/AA rules on the selection, guided, completion, practice, hint, correction, results and reset screens. Automated audits do not establish full WCAG conformance.

Safari's keyboard tests use Option-Tab, which navigates clickable controls with Safari's default settings; users can instead enable “Press Tab to highlight each item on a webpage.” See [Apple's keyboard guide](https://help.apple.com/safari/mac/8.0/en.lproj/cpsh003.html). Mobile engine keyboard checks are supplementary; real mobile assistive technology still needs manual evaluation.

## Repeatable checks

```sh
npm ci
npx playwright install --with-deps chromium firefox webkit
npm test
npm run typecheck
npm run build
npm run test:e2e
ELEMENTRIS_TEST_URL=https://elementris-alpha.vercel.app npm run test:e2e -- --project=desktop --project=portrait tests/lesson.spec.ts tests/practice.spec.ts tests/progress.spec.ts
```

An external test URL disables the local server. Tests use isolated browser contexts, exercising only their own local progress and language; they do not change shared server data. Use an accessible Vercel preview URL to repeat deployment checks. Authentication-protected previews require an authenticated browser or project-owner access; do not commit credentials or bypass tokens. Failure traces and screenshots are ignored under `test-results/`. GitHub Actions runs all six projects on Linux and retains failed browser artifacts for seven days.

## Findings and evidence

- Automated contrast testing found secondary text on the mint progress card at 4.34:1, below the 4.5:1 small-text threshold. It now uses the approved deep-green text color.
- Enlarged text checks prompted wrapping the header and collected element names, allowing current and collected tiles to grow, and letting the current element's explanation wrap within its column. The palette and raised tile styling remain.
- Local Firefox launch failed before navigation with “Could not find profile folder,” including after changing the temporary directory. This is an environment validation gap, not a passed browser flow. Linux CI supplies an independent check.
- Actual beginner observations: **none collected yet**. Recall improvement: **not established**.
- Local verification on 2026-10-04 (macOS 27.0.1, Playwright 1.63.0): translation parity, 20 unit tests, type check and production build passed. Final regression: 128 passed, two desktop touch-only checks intentionally skipped, across five runnable projects. The final symbol-sizing adjustment passed all ten narrow/enlarged-text cases. German 320px WebKit screenshots were visually inspected.
- Production https://elementris-alpha.vercel.app returned HTTP 200; all 20 desktop/portrait first-time and returning-player flows passed against it. These checks ran against the existing merged production application; PR CSS changes are in the preview.
- [PR #12](https://github.com/mckc20/elementris/pull/12) has a successful [Vercel preview](https://elementris-git-codex-eafff2-martinacarmenkranzl-1342s-projects.vercel.app), which requires Vercel authentication. Authenticated preview HTML was verified; interactive flows ran against the local production build. Linux CI found an additional enlarged-brand overflow with Linux system fonts; the brand button now wraps within its container. Final cross-platform results are recorded on PR #12.

## Manual device and accessibility protocol

On actual Android Chrome and iOS Safari, in both languages, complete a fresh guided lesson, make an intentional mistake, retry, practise with both hint stages, read results, reload, complete targeted review, cancel/reset progress, and switch languages mid-round. Check one-handed tapping, scrolling to feedback and Next, stable destinations, visible collected names, orientation changes and enlarged text. Note whether browser chrome or the on-screen keyboard obscures controls. Confirm reduced-motion settings suppress tile movement.

On desktop, repeat by keyboard, checking visible focus, focus after placement/Next/completion/home/reset, and absence of traps. With VoiceOver/Safari and an Android screen reader, confirm element/family labels, progress, hints and corrections are understandable and announced, without relying on color. Inspect 200% zoom and 320px reflow. Record failures and exact reproduction steps; automated axe results do not replace these observations.

## Beginner test protocol (about 15–20 minutes)

The owner recruits 3–5 beginners unfamiliar with these families, ideally including German and English speakers and both phone platforms. This is a small formative usability study, not a controlled demonstration of educational effectiveness. Obtain agreement to observe; use anonymous participant IDs and avoid personal details in this public repository. Record actual observations only.

1. Before showing the app or explanations, present the six symbols with localized names on paper in order Ar, Li, Ne, K, He, Na. Ask which family each belongs to (alkali metals / noble gases / do not know). Give no corrections. Record first answers, unknowns and confidence. This is the pre-guidance recall baseline.
2. Open a fresh isolated browser context with no progress. Ask: “Learn these two families using the guided lesson.” Observe without instruction. Ask the participant to explain the task and the meaning of the collected tiles. Record hesitation, mistaps, scrolling, requested help and any misconception that placement is a reaction. Do not describe guided completion as recall.
3. Ask: “Now practise from memory. You can ask for a hint if needed.” Remove guidance by starting practice. Record each first answer, hints (0–2) and retries; copy both first-answer and unaided totals from the result screen. Note when a correction teaches the next answer. A correct answer after a clue is not unaided recall.
4. After five minutes of an unrelated activity, hide the app and ask the same six family questions in order Na, He, K, Ar, Li, Ne. No highlights, hints, previous answers, collected tiles or feedback. Record first answers and unknowns before revealing any correction. Optionally repeat after 24–48 hours, recording elapsed time and intervening practice.
5. Reopen the app and ask the participant to find progress and practise elements marked for review. Ask what the results and review count mean, where progress is saved, and what happens on another device. Ask what felt unclear or difficult. Record quotes only with permission.

Use the participant's preferred language; translate moderator instructions without adding family clues. If the moderator helps, record the intervention rather than treating the task as independently completed. Ceiling scores (6/6 at baseline) cannot show improvement. Compare pre-guidance recall, immediate unaided practice and delayed paper recall within each participant; report raw counts, declines and unknowns as well as gains. Two-choice guessing, repeated exposure, the visible collection, small sample size and correction feedback limit interpretation.

## Observation template

Copy per actual session. All fields below are unfilled; there are no simulated participants.

- Anonymous ID / date / language / device / OS / browser / URL or commit:
- Prior familiarity / baseline correct out of 6 / unknowns:
- Guided completion / moderator interventions / input or layout problems:
- Practice first answers correct out of 6 / correct without help out of 6 / hint stages / retries:
- Per element (Li, He, Na, Ne, K, Ar): baseline answer; practice first answer; hints; retries; delayed answer:
- Delay duration / delayed correct out of 6 / unknowns / intervening practice:
- Difference from baseline / ceiling or guessing caveats:
- Understanding of results, review and device-only storage:
- Observed behavior / permitted quotes / severity / reproduction:
- Fix or linked outstanding issue / retest result:

## Readiness and next steps

Do not claim MVP readiness until the browser baseline is agreed, physical-device and assistive-technology checks are recorded, actual beginner sessions establish what happens after guidance disappears, and significant findings are fixed or explicitly tracked. Owner coordination and participant availability are outstanding dependencies. Keep #5 open through review.

Prioritize blockers that prevent completing a round or understanding feedback, then misleading learning claims and persistent input/layout problems. Use observations to decide whether feedback needs more prominence or the first lesson needs clearer instructions. Additional families and exact table positions follow only after this task is understandable; timed challenges and offline/PWA support remain later scope. Retention beyond the follow-up check and generalization to unseen elements are untested.

## Phase 6 falling-game validation

Issue [#13](https://github.com/mckc20/elementris/issues/13) builds on the merged catalogue PR #17. Implementation and checks are on `codex/phase-6-falling-game`, awaiting PR/preview review and merge.

- Translation parity, 31 unit tests plus the translation-check script test, TypeScript check, production build, and diff check passed on 2026-10-04. Catalogue tests validate all 1,330 two/three-destination selections; deterministic clock tests cover natural/early landing, late lane input, pause/resume, stale/duplicate events, correction retries, scoring, explicit advance, full coverage, and replay.
- Local browser regression: 166 passed, four non-touch-project touch checks intentionally skipped, across desktop/portrait Chromium, WebKit, Android Chromium emulation, and iPhone WebKit emulation. Both languages exercise complete two- and three-destination rounds, keyboard and touch, natural landing, frozen correction/collection states, results/replay/change selection/home, language switching in selection/correction/pause/results, unchanged lesson evidence, reload-to-selection, and existing guided/practice/progress flows. axe checks cover the new selection, active board, correction, and results screens. Three-lane checks use 320 × 568 and large targets.
- Browser clocks drive countdown/landing deterministically. Visibility tests dispatch hidden/visible events and verify that hidden controls cannot submit, returning stays paused, and resuming has no background-time jump. They are software checks, not physical-device observations.
- Local Firefox still fails before navigation with the previously documented profile-folder error, including outside the shell sandbox and with `/private/tmp` profiles. Linux CI will check all six browser projects; local Firefox is not counted as passing.
- Screenshot review prompted shorter instructions, a shorter track, and Drop/Pause immediately below lane selection for small-phone use. German three-lane and English results layouts were visually reviewed. Hosted playable preview validation is recorded on the implementation PR after deployment.
- No beginner study, physical-device screen-reader session, or recall improvement is claimed. The existing Phase 5 manual protocols remain applicable; round completion establishes software coverage, not learning mastery.

### Expanded selection and Space shortcut (2026-10-04)

At the owner's request, Phase 6 now permits two to twenty destinations. Space and down arrow both drop from the focused board; clicking a lane returns focus there. Native controls elsewhere retain Space behavior. Boards above three lanes scroll horizontally, and keyboard movement keeps the selected lane visible.

- Translation parity, TypeScript/build, diff check, 33 unit tests and the translation-check script test passed. Larger catalogue selections and a complete all-118-element/all-20-destination round are covered.
- Updated falling browser flows: 48 passed, two expected non-touch skips, across desktop/portrait Chromium, WebKit, Android and iPhone emulation. Both languages cover all-20 selection, 118-element round capacity, last-lane keyboard visibility, Space after clicking a lane, held-key rejection, native Space scope, axe audits, and no page overflow at 320px. Existing falling/correction/pause/results flows remain passing.
- German 320px all-20 board screenshot reviewed. Hosted preview and Linux CI results are recorded on PR #18 after deployment. The prior full-suite evidence above describes the earlier head.
