import { useTranslation } from 'react-i18next';
import { LanguageSwitch } from './LanguageSwitch';
import type { ReactNode } from 'react';
import { Button } from './Button';

export function PageLayout({ children, className = '', onHome, showHome = false }: {
  children: ReactNode; className?: string; onHome: () => void; showHome?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <div className={`page ${className}`}>
      <header className="page-header"><button type="button" className="brand" onClick={onHome} aria-label={t('navigation.brandHome')}><span className="brand-mark" aria-hidden="true">e</span>elementris<span className="brand-dot">.</span></button><LanguageSwitch /></header>
      <main>{children}</main>
      <footer>{showHome && <Button className="home-button" onClick={onHome}>{t('navigation.home')}</Button>}<p>{t('footer')}</p></footer>
    </div>
  );
}
