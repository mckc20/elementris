import { useEffect, useRef, useState } from 'react';
import { Button } from './components/Button';
import { ElementTile } from './components/ElementTile';
import { PageLayout } from './components/PageLayout';
import { TableOrientation } from './components/TableOrientation';
import { firstLesson as lesson } from './content/lessons';
import { startLesson, updateGame } from './game/rules';
import type { GameAction } from './game/types';

export function App() {
  const [started, setStarted] = useState(false);
  const [game, setGame] = useState(() => startLesson(lesson));
  const heading = useRef<HTMLHeadingElement>(null);
  const next = useRef<HTMLButtonElement>(null);
  const element = lesson.elements[game.elementIndex];
  const family = lesson.families.find(item => item.id === element.familyId)!;

  useEffect(() => {
    if (!started) return;
    if (game.status === 'placed') next.current?.focus();
    else heading.current?.focus();
  }, [started, game.status, game.elementIndex]);

  function begin() {
    setGame(startLesson(lesson));
    setStarted(true);
  }
  function act(action: GameAction) {
    setGame(current => updateGame(lesson, current, action));
  }

  return (
    <PageLayout className={started && game.status !== 'complete' ? 'game-page' : ''}>
      <div className="lesson">
        {!started ? <>
          <p className="eyebrow">LESSON 01 · GUIDED</p>
          <h1>Meet two<br /><span>element families.</span></h1>
          <p className="intro">Six small tiles. Two sides of the table.</p>
          <p className="description">An element family is a group of elements with similar properties. Let’s get to know two of them.</p>
          <div className="family-intro">
            {lesson.families.map(item => <section key={item.id} className={`family-card tile-${item.tone}`}>
              <span className="group-label">GROUP {item.group}</span>
              <h2>{item.name}</h2>
              <p>{item.description}</p>
              <p className="family-symbols">{lesson.elements.filter(tile => tile.familyId === item.id).map(tile => tile.symbol).join(' · ')}</p>
            </section>)}
          </div>
          <TableOrientation />
          <p className="small-note">Hydrogen sits above the alkali metals, but is not an alkali metal.</p>
          <Button className="start-button" onClick={begin}>Start guided lesson <span aria-hidden="true">→</span></Button>
          <p className="small-note">Tap the highlighted family. No timer. Take your time.</p>
        </> : game.status === 'complete' ? <>
          <p className="eyebrow">LESSON 01 · COMPLETE</p>
          <h1 ref={heading} tabIndex={-1}>Two families.<br /><span>Six discoveries.</span></h1>
          <p className="intro">You placed all six elements.</p>
          <p className="description">You followed the guides. Replay to get familiar with the names and symbols.</p>
          <div className="family-intro result-families">
            {lesson.families.map(item => <section key={item.id} className={`family-card tile-${item.tone}`}>
              <span className="group-label">GROUP {item.group}</span><h2>{item.name}</h2>
              <ul>{lesson.elements.filter(tile => tile.familyId === item.id).map(tile => <li key={tile.symbol}><strong>{tile.symbol}</strong> {tile.name}</li>)}</ul>
            </section>)}
          </div>
          <Button onClick={begin}>Replay lesson <span aria-hidden="true">↻</span></Button>
        </> : <>
          <div className="round-meta"><span className="eyebrow">LESSON 01 · GUIDED</span><span>{game.placed.length} / {lesson.elements.length} placed</span></div>
          <progress aria-label="Lesson progress" value={game.placed.length} max={lesson.elements.length} />
          <h1 className="round-title" ref={heading} tabIndex={-1}>Find {element.name}’s family</h1>
          <div className="current-element">
            <ElementTile element={element} tone="peach" />
            <div><p className="group-label">ELEMENT {game.elementIndex + 1} OF {lesson.elements.length}</p><p className="current-name">{element.name}</p><p className="description">Atomic number {element.atomicNumber}</p><p className="family-guide">{family.name} · group {family.group}</p></div>
          </div>
          <p className="board-instruction">{game.status === 'placed' ? 'Placed! Continue when you’re ready.' : 'Tap the highlighted family to place the tile.'}</p>
          <div className="board" aria-label="Element family columns">
            {lesson.families.map(item => {
              const highlighted = game.status === 'ready' && item.id === element.familyId;
              const placed = lesson.elements.filter(tile => tile.familyId === item.id && game.placed.includes(tile.atomicNumber));
              return <Button key={item.id} className={`family-column tile-${item.tone} ${highlighted ? 'highlighted' : ''}`}
                aria-label={`Place ${element.name} in ${item.name}${highlighted ? ' (highlighted)' : ''}`}
                aria-disabled={game.status === 'placed'} onClick={() => act({ type: 'place', familyId: item.id })}>
                <span className="group-label">GROUP {item.group}</span><span className="column-title">{item.name}</span>
                <span className="destination">{highlighted ? '↓ Place here' : game.status === 'placed' && item.id === element.familyId ? '✓ Placed' : 'Family column'}</span>
                <span className="tile-slots" aria-hidden="true">
                  {Array.from({ length: 3 }, (_, index) => placed[index]
                    ? <ElementTile key={placed[index].symbol} element={placed[index]} tone={item.tone} className={placed[index].atomicNumber === element.atomicNumber ? 'placed-tile' : ''} />
                    : <span key={`empty-${index}`} className="empty-slot">·</span>)}
                </span>
              </Button>;
            })}
          </div>
          <div className="feedback" role="status" aria-live="polite" aria-atomic="true">{game.feedback || `${element.name} is in the ${family.name.toLowerCase()} family. Follow the guide above.`}</div>
          <div className="round-action">{game.status === 'placed' && <Button ref={next} className="next-button" onClick={() => act({ type: 'next' })}>{game.placed.length === lesson.elements.length ? 'Finish lesson' : 'Next element'} <span aria-hidden="true">→</span></Button>}</div>
          <TableOrientation />
          <p className="small-note">The columns collect families, not exact table positions.</p>
        </>}
      </div>
    </PageLayout>
  );
}
