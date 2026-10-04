import { describe, expect, it, vi } from 'vitest';
import { initialLanguage, rememberLanguage, selectLanguage } from './language';

describe('language preference precedence', () => {
  it.each(['de', 'de-AT', 'de-DE', 'de-CH', 'DE-at'])('uses German for primary %s', language => {
    expect(selectLanguage(null, [language, 'en'])).toBe('de');
  });
  it('does not promote a lower-priority supported language', () => {
    expect(selectLanguage(null, ['en-US', 'de-AT'])).toBe('en');
    expect(selectLanguage(null, ['fr', 'de'])).toBe('en');
    expect(selectLanguage(null, [], 'de-CH')).toBe('de');
    expect(selectLanguage(null, [])).toBe('en');
  });
  it('uses a valid saved choice and ignores malformed or unsupported choices', () => {
    expect(selectLanguage('en', ['de'])).toBe('en');
    expect(selectLanguage('de', ['en'])).toBe('de');
    for (const saved of ['fr', '', '{bad}', null]) expect(selectLanguage(saved, ['de'])).toBe('de');
  });
  it('survives unavailable storage for detection and manual choice', () => {
    vi.stubGlobal('navigator', { languages: ['de-AT'], language: 'en' });
    vi.stubGlobal('localStorage', { getItem: () => { throw new Error('blocked'); }, setItem: () => { throw new Error('full'); } });
    try {
      expect(initialLanguage()).toBe('de');
      expect(() => rememberLanguage('en')).not.toThrow();
    } finally { vi.unstubAllGlobals(); }
  });
});
