import en from '../locales/en/translation.json';
import de from '../locales/de/translation.json';

export const resources = { de: { translation: de }, en: { translation: en } };
export type Language = keyof typeof resources;
export const languages = Object.keys(resources) as Language[];
export const languageStorageKey = 'elementris.language';

export function isLanguage(value: unknown): value is Language {
  return typeof value === 'string' && languages.includes(value as Language);
}

export function selectLanguage(saved: unknown, preferred: readonly string[], fallback?: string): Language {
  if (isLanguage(saved)) return saved;
  const primary = (preferred[0] || fallback || '').toLowerCase().split('-')[0];
  return isLanguage(primary) ? primary : 'en';
}

export function initialLanguage(): Language {
  let saved: unknown;
  try { saved = localStorage.getItem(languageStorageKey); } catch { /* Storage is optional. */ }
  return selectLanguage(saved, navigator.languages, navigator.language);
}

export function rememberLanguage(language: Language): void {
  try { localStorage.setItem(languageStorageKey, language); } catch { /* Switching still works. */ }
}
