import type { ElementData } from '../content/types';

export type TileTone = 'lime' | 'mint' | 'peach';

export function ElementTile({ element, tone, className = '' }: {
  element: ElementData;
  tone: TileTone;
  className?: string;
}) {
  return (
    <div className={`element tile-${tone} ${className}`}>
      <span className="number">{element.atomicNumber}</span>
      <strong>{element.symbol}</strong>
      <span className="name">{element.name}</span>
    </div>
  );
}
