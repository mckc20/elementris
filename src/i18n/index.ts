import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { initialLanguage, languages, resources } from './language';

export function updateDocumentLanguage() {
  document.documentElement.lang = i18n.resolvedLanguage || 'en';
  document.title = i18n.t('document.title');
  document.querySelector('meta[name="description"]')?.setAttribute('content', i18n.t('document.description'));
}

await i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage(),
  supportedLngs: languages,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});
updateDocumentLanguage();
i18n.on('languageChanged', updateDocumentLanguage);

export default i18n;
