# Learning MVP roadmap

Each phase has one GitHub tracking issue. Implement phases in order; a phase may be delivered through multiple focused pull requests.

| Phase | Tracking issue | Outcome |
| --- | --- | --- |
| 1. Foundation | [#1](https://github.com/mckc20/elementris/issues/1) | A deployable React/TypeScript/Vite app and reusable visual components |
| 2. First lesson | [#2](https://github.com/mckc20/elementris/issues/2) | A beginner can complete a guided family-placement lesson on a phone |
| Bilingual foundation | [#8](https://github.com/mckc20/elementris/issues/8) | German and English support before Phase 3 |
| 3. Independent practice | [#3](https://github.com/mckc20/elementris/issues/3) | Players practise recall with optional hints, corrections, and learning results |
| 4. Progress | [#4](https://github.com/mckc20/elementris/issues/4) | Players can return to their progress and practise elements they find difficult |
| 5. MVP validation | [#5](https://github.com/mckc20/elementris/issues/5) | Mobile usability, accessibility, and beginner learning have been evaluated |
| 6. Falling game | [#13](https://github.com/mckc20/elementris/issues/13) | Falling single-element play with all 118 elements and two or three selected destinations |
| 7. Whole-table lessons | [#14](https://github.com/mckc20/elementris/issues/14) | Expand guided learning and untimed practice |
| 8. Evidence and review | [#15](https://github.com/mckc20/elementris/issues/15) | Shared evidence, coverage, short rounds, and review |
| 9. Challenges | [#16](https://github.com/mckc20/elementris/issues/16) | Challenge modes and gameplay polish |

## Context handoff

Start a new chat with “Implement phase issue #N.” The issue contains scope, acceptance criteria, dependencies, and validation. Read `AGENTS.md` and the linked product and design documents to restore project context.

Merged PRs and issue comments record completion. For unfinished work, record the branch/PR, what works, what remains, validation, and blockers on the phase issue before clearing context.

## Current state

Phase 6 starts on `codex/phase-6-element-catalogue` with the verified 118-element catalogue, bilingual names/destination labels, documented classification convention, and complete-selection coverage helper. This is the first of the focused PRs suggested by #13. Falling rules/controls and Play/selection/results/accessibility screens remain; #13 stays open. Phase 6 does not depend on #14. See [catalogue sources](lesson-data.md#whole-table-catalogue-phase-6).

Phase 1 is complete and merged through PR #6 (`c54b231`); issue #1 is closed. The production application is at https://elementris-alpha.vercel.app.

Phase 2 is complete and merged through [PR #7](https://github.com/mckc20/elementris/pull/7); issue #2 is closed. The guided six-element lesson supports corrections, replay, and periodic-table orientation.

Issue #8 is complete and merged. German/English UI and lesson resources, highest-priority browser detection, remembered manual choices, semantic feedback, and the accessible top-right switch are available on `main`. Future features must ship in both languages; see [translation guidance](translations.md).

Phase 3 is implemented through [PR #10](https://github.com/mckc20/elementris/pull/10): direct practice from the introduction and guided-to-practice transition, a newly randomized element order on each practice start and replay, optional two-stage hints, unlimited corrections, transparent result calculations, elements to review, and practice replay. See [Phase 3 decisions](product.md#phase-3-implementation-choices). Validation covers result rules and complete desktop/portrait browser flows in both languages. Phase 4 implementation now adds versioned local learning progress, lesson selection, targeted review from latest practice evidence, and reset. See [Phase 4 decisions](product.md#phase-4-implementation-choices). Phase 4 is complete and merged in [PR #11](https://github.com/mckc20/elementris/pull/11); issue #4 is closed. Phase 5 adds cross-browser and accessibility validation, production checks, a beginner test protocol, and findings in [mvp-validation.md](mvp-validation.md). Actual beginner and physical-device observations remain pending; issue #5 stays open.
