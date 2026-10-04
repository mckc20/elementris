import type { ReactNode } from 'react';

export function PageLayout({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`page ${className}`}>
      <header className="brand"><span className="brand-mark" aria-hidden="true">e</span>elementris<span className="brand-dot">.</span></header>
      <main>{children}</main>
      <footer>Small tiles. Big discoveries.</footer>
    </div>
  );
}
