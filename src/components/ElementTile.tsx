import { useTranslation } from 'react-i18next';
import type { ElementData } from '../content/types';

export type TileTone = 'lime' | 'mint' | 'peach';

export function ElementTile({ element, tone, className = '' }: {
  element: ElementData;
  tone: TileTone;
  className?: string;
}) {
  const { t } = useTranslation();
  return (
    <span className={`element tile-${tone} ${className}`}>
      <span className="number">{element.atomicNumber}</span>
      <strong>{element.symbol}</strong>
      <span className="name">{t(element.nameKey)}</span>
    </span>
  );
}
