import { useTranslation } from 'react-i18next';
import { languages, rememberLanguage } from '../i18n/language';
import { Button } from './Button';

export function LanguageSwitch() {
  const { t, i18n } = useTranslation();
  return <div className="language-switch" role="group" aria-label={t('language.label')}>
    {languages.map(language => <Button key={language}
      aria-label={t(`language.${language}`)} lang={language}
      aria-pressed={i18n.resolvedLanguage === language}
      onClick={() => {
        rememberLanguage(language);
        void i18n.changeLanguage(language);
      }}>{language.toUpperCase()}</Button>)}
  </div>;
}
