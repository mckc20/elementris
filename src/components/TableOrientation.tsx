import { useTranslation } from 'react-i18next';

export function TableOrientation() {
  const { t } = useTranslation();
  return (
    <figure className="orientation">
      <div className="table-map" role="img" aria-label={t('orientation.label')}>
        {Array.from({ length: 126 }, (_, index) => {
          const row = Math.floor(index / 18);
          const column = index % 18;
          const exists = row === 0 ? column === 0 || column === 17 : row < 3 ? column < 2 || column > 11 : true;
          const tone = column === 0 && row > 0 ? 'lime' : column === 17 ? 'mint' : 'neutral';
          return <span key={index} className={exists ? `map-cell tile-${tone}` : 'map-gap'} />;
        })}
      </div>
      <figcaption><span>{t('orientation.left')}</span><span>{t('orientation.right')}</span></figcaption>
    </figure>
  );
}
