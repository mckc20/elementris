# Learning MVP roadmap

Each phase has one GitHub tracking issue. Implement phases in order; a phase may be delivered through multiple focused pull requests.

| Phase | Tracking issue | Outcome |
| --- | --- | --- |
| 1. Foundation | [#1](https://github.com/mckc20/elementris/issues/1) | A deployable React/TypeScript/Vite app and reusable visual components |
| 2. First lesson | [#2](https://github.com/mckc20/elementris/issues/2) | A beginner can complete a guided family-placement lesson on a phone |
| 3. Independent practice | [#3](https://github.com/mckc20/elementris/issues/3) | Players practise recall with optional hints, corrections, and learning results |
| 4. Progress | [#4](https://github.com/mckc20/elementris/issues/4) | Players can return to their progress and practise elements they find difficult |
| 5. MVP validation | [#5](https://github.com/mckc20/elementris/issues/5) | Mobile usability, accessibility, and beginner learning have been evaluated |

## Context handoff

Start a new chat with “Implement phase issue #N.” The issue contains scope, acceptance criteria, dependencies, and validation. Read `AGENTS.md` and the linked product and design documents to restore project context.

Merged PRs and issue comments record completion. For unfinished work, record the branch/PR, what works, what remains, validation, and blockers on the phase issue before clearing context.

## Current state

The public repository and Vercel Git integration are configured. The production Coming Soon page is at https://elementris-alpha.vercel.app. Phase 1 introduces the React/TypeScript/Vite foundation, reusable visual components, structured content/state boundaries, and browser checks while retaining that page. Its PR preview must be validated and merged before Phase 1 is considered complete. Lessons, practice, and progress remain planned for subsequent phases.
