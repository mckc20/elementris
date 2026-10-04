import { ElementTile } from './components/ElementTile';
import { PageLayout } from './components/PageLayout';

// Preserve the approved illustration. These colors do not assign element families.
export function App() {
  return (
    <PageLayout>
      <div className="elements" aria-hidden="true">
        <ElementTile element={{ atomicNumber: 11, symbol: 'Na', name: 'Sodium' }} tone="lime" className="sodium" />
        <ElementTile element={{ atomicNumber: 8, symbol: 'O', name: 'Oxygen' }} tone="mint" className="oxygen" />
        <ElementTile element={{ atomicNumber: 10, symbol: 'Ne', name: 'Neon' }} tone="peach" className="neon" />
      </div>
      <p className="status"><span aria-hidden="true" /> A little chemistry. A lot of play.</p>
      <h1>Coming <span>soon.</span></h1>
      <p className="intro">Learn the periodic table,<br />one element at a time.</p>
      <p className="description">A new puzzle game for curious minds.<br />Your next discovery is just a drop away.</p>
    </PageLayout>
  );
}
