# Translations

Issue [#8](https://github.com/mckc20/elementris/issues/8) adds German and English before Phase 3. All new player-facing features and lesson content must ship in both languages. Repository documentation remains in English.

## Resources and keys

The app uses i18next and react-i18next with JSON files bundled by Vite:

- `src/locales/en/translation.json`
- `src/locales/de/translation.json`

Keep text outside components and game rules. Use stable semantic keys through `useTranslation().t`, including accessibility labels, document metadata, and feedback. Lesson data holds translation keys alongside stable scientific identifiers and facts; game state holds semantic feedback outcomes. Never translate element symbols, atomic numbers, or IDs. Sentence forms may differ from display names: German feedback uses the dative forms Alkalimetallen and Edelgasen.

The English resource defines TypeScript translation-key types in `src/i18n/i18next.d.ts`. `npm run check:translations` checks all locale folders for missing/extra keys, empty values, and mismatched interpolation parameters. Build and test run it automatically. English is the runtime fallback; the parity check prevents that fallback from hiding incomplete translations.

For a new message, add matching keys to both files. Translate complete sentences with named interpolation parameters rather than concatenating words. Keep German informal (`du`) and beginner-friendly. Verify scientific names against authoritative sources and record references in `lesson-data.md`.

## Adding a language

1. Copy the English JSON resource into `src/locales/<code>/translation.json` and translate all values, preserving keys and interpolation parameters.
2. Import and register it in `resources` in `src/i18n/language.ts`. Add its native language name under `language.<code>` in every resource. Supported languages and the switch options are derived from that registry.
3. Run the translation check, type check, build, and relevant browser flows. Verify layout with longer text and document metadata.

UI components and game rules do not need rewriting. The current text layout supports left-to-right languages; a right-to-left language would also need direction/layout work. Registration enables selection of that language when it is the highest-priority browser preference; English remains the fallback.

## Selection and persistence

A valid manual choice saved in `elementris.language` wins. Otherwise only the first `navigator.languages` entry is considered, falling back to `navigator.language` when absent. Regional tags resolve to their base language case-insensitively: German includes `de-AT`, `de-DE`, and `de-CH`. Unsupported or unavailable preferences use English. A lower-priority German preference never changes an English or unsupported primary choice.

Manual selection updates content, feedback, `<html lang>`, title, and description immediately and preserves the current round. Storage errors are ignored so play and switching still work. The choice survives reloads when storage is available; Phase 4 stores learning progress separately under `elementris.progress`; active rounds restart on reload.

## Validation

`npm test` covers preference precedence, regional tags, malformed choices, unavailable storage, feedback outcomes, and translation-check failures. Playwright covers both complete lesson flows, live switching during correction/success/completion, manual persistence, failed storage, keyboard focus, reduced motion, and portrait layout. German screenshots are written to ignored `test-results/`.
