import type { ReactNode } from 'react';

export function PageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="page">
      <header className="brand"><span className="brand-mark" aria-hidden="true">e</span>elementris<span className="brand-dot">.</span></header>
      <main>{children}</main>
      <footer>Small tiles. Big discoveries.</footer>
    </div>
  );
}
