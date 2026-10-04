import { useTranslation } from 'react-i18next';
import { LanguageSwitch } from './LanguageSwitch';
import type { ReactNode } from 'react';

export function PageLayout({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { t } = useTranslation();
  return (
    <div className={`page ${className}`}>
      <header className="page-header"><div className="brand"><span className="brand-mark" aria-hidden="true">e</span>elementris<span className="brand-dot">.</span></div><LanguageSwitch /></header>
      <main>{children}</main>
      <footer>{t('footer')}</footer>
    </div>
  );
}
