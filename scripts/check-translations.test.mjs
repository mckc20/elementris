import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateTranslations } from './check-translations.mjs';

test('rejects missing keys, extra keys, blank values and mismatched parameters', () => {
  const reference = { lesson: { placed: '{{placed}} / {{total}} placed' } };
  assert.deepEqual(validateTranslations(reference, {}), ['Missing key: lesson.placed']);
  assert.deepEqual(validateTranslations(reference, { lesson: { placed: '{{total}} von {{placed}} platziert' } }), []);
  assert.deepEqual(validateTranslations(reference, { lesson: { placed: '{{count}} platziert' } }), ['Interpolation mismatch: lesson.placed']);
  assert.deepEqual(validateTranslations({}, { extra: 'text' }), ['Unexpected key: extra']);
  assert.throws(() => validateTranslations(reference, { lesson: { placed: ' ' } }), /Invalid translation/);
});
