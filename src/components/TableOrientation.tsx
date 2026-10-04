export function TableOrientation() {
  return (
    <figure className="orientation">
      <div className="table-map" role="img" aria-label="Periodic table overview: alkali metals in group 1 on the far left, excluding hydrogen; noble gases in group 18 on the far right. The detached rows are omitted.">
        {Array.from({ length: 126 }, (_, index) => {
          const row = Math.floor(index / 18);
          const column = index % 18;
          const exists = row === 0 ? column === 0 || column === 17 : row < 3 ? column < 2 || column > 11 : true;
          const tone = column === 0 && row > 0 ? 'lime' : column === 17 ? 'mint' : 'neutral';
          return <span key={index} className={exists ? `map-cell tile-${tone}` : 'map-gap'} />;
        })}
      </div>
      <figcaption><span>Group 1 · left edge</span><span>Group 18 · right edge</span></figcaption>
    </figure>
  );
}
