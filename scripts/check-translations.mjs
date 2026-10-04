import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export function translationEntries(value, prefix = '') {
  if (typeof value === 'string' && value.trim()) return [[prefix, value]];
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`Invalid translation: ${prefix}`);
  return Object.entries(value).flatMap(([key, child]) => translationEntries(child, prefix ? `${prefix}.${key}` : key));
}

export function validateTranslations(reference, candidate) {
  const expected = new Map(translationEntries(reference));
  const actual = new Map(translationEntries(candidate));
  const errors = [];
  const tokens = value => [...value.matchAll(/{{\s*([^}]+?)\s*}}/g)].map(match => match[1]).sort().join(',');
  for (const [key, text] of expected) {
    if (!actual.has(key)) errors.push(`Missing key: ${key}`);
    else if (tokens(text) !== tokens(actual.get(key))) errors.push(`Interpolation mismatch: ${key}`);
  }
  for (const key of actual.keys()) if (!expected.has(key)) errors.push(`Unexpected key: ${key}`);
  return errors;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const directory = new URL('../src/locales/', import.meta.url);
  const load = language => JSON.parse(readFileSync(new URL(`${language}/translation.json`, directory), 'utf8'));
  const reference = load('en');
  translationEntries(reference);
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const language = entry.name;
    const errors = validateTranslations(reference, load(language));
    if (errors.length) throw new Error(`${language}:\n${errors.join('\n')}`);
  }
  console.log('All locale keys and interpolation parameters match English.');
}
