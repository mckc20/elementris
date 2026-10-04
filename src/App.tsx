import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import { Button } from './components/Button';
import { ElementTile } from './components/ElementTile';
import { PageLayout } from './components/PageLayout';
import { TableOrientation } from './components/TableOrientation';
import { firstLesson as lesson } from './content/lessons';
import { startLesson, updateGame } from './game/rules';
import type { GameAction } from './game/types';

export function App() {
  const { t } = useTranslation();
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
          <p className="eyebrow">{t('lesson.guided')}</p>
          <h1>{t('lesson.headingStart')}<br /><span>{t('lesson.headingEnd')}</span></h1>
          <p className="intro">{t('lesson.intro')}</p>
          <p className="description">{t('lesson.description')}</p>
          <div className="family-intro">
            {lesson.families.map(item => <section key={item.id} className={`family-card tile-${item.tone}`}>
              <span className="group-label">{t('lesson.group', { group: item.group })}</span>
              <h2>{t(item.nameKey)}</h2>
              <p>{t(item.descriptionKey)}</p>
              <p className="family-symbols">{lesson.elements.filter(tile => tile.familyId === item.id).map(tile => tile.symbol).join(' · ')}</p>
            </section>)}
          </div>
          <TableOrientation />
          <p className="small-note">{t('lesson.hydrogen')}</p>
          <Button className="start-button" onClick={begin}>{t('lesson.start')} <span aria-hidden="true">→</span></Button>
          <p className="small-note">{t('lesson.pace')}</p>
        </> : game.status === 'complete' ? <>
          <p className="eyebrow">{t('lesson.complete')}</p>
          <h1 ref={heading} tabIndex={-1}>{t('lesson.completeStart')}<br /><span>{t('lesson.completeEnd')}</span></h1>
          <p className="intro">{t('lesson.completeIntro')}</p>
          <p className="description">{t('lesson.completeDescription')}</p>
          <div className="family-intro result-families">
            {lesson.families.map(item => <section key={item.id} className={`family-card tile-${item.tone}`}>
              <span className="group-label">{t('lesson.group', { group: item.group })}</span><h2>{t(item.nameKey)}</h2>
              <ul>{lesson.elements.filter(tile => tile.familyId === item.id).map(tile => <li key={tile.symbol}><strong>{tile.symbol}</strong> {t(tile.nameKey)}</li>)}</ul>
            </section>)}
          </div>
          <Button onClick={begin}>{t('lesson.replay')} <span aria-hidden="true">↻</span></Button>
        </> : <>
          <div className="round-meta"><span className="eyebrow">{t('lesson.guided')}</span><span>{t('lesson.placed', { placed: game.placed.length, total: lesson.elements.length })}</span></div>
          <progress aria-label={t('lesson.progress')} value={game.placed.length} max={lesson.elements.length} />
          <h1 className="round-title" ref={heading} tabIndex={-1}>{t('lesson.findFamily', { element: t(element.nameKey) })}</h1>
          <div className="current-element">
            <ElementTile element={element} tone="peach" />
            <div><p className="group-label">{t('lesson.elementIndex', { index: game.elementIndex + 1, total: lesson.elements.length })}</p><p className="current-name">{t(element.nameKey)}</p><p className="description">{t('lesson.atomicNumber', { number: element.atomicNumber })}</p><p className="family-guide">{t('lesson.familyGuide', { family: t(family.nameKey), group: family.group })}</p></div>
          </div>
          <p className="board-instruction">{t(game.status === 'placed' ? 'lesson.continue' : 'lesson.placeInstruction')}</p>
          <div className="board" aria-label={t('lesson.board')}>
            {lesson.families.map(item => {
              const highlighted = game.status === 'ready' && item.id === element.familyId;
              const placed = lesson.elements.filter(tile => tile.familyId === item.id && game.placed.includes(tile.atomicNumber));
              return <Button key={item.id} className={`family-column tile-${item.tone} ${highlighted ? 'highlighted' : ''}`}
                aria-label={t('lesson.placeLabel', { element: t(element.nameKey), family: t(item.nameKey), highlighted: highlighted ? t('lesson.highlighted') : '' })}
                aria-disabled={game.status === 'placed'} onClick={() => act({ type: 'place', familyId: item.id })}>
                <span className="group-label">{t('lesson.group', { group: item.group })}</span><span className="column-title">{t(item.nameKey)}</span>
                <span className="destination">{t(highlighted ? 'lesson.placeHere' : game.status === 'placed' && item.id === element.familyId ? 'lesson.placedHere' : 'lesson.familyColumn')}</span>
                <span className="tile-slots" aria-hidden="true">
                  {Array.from({ length: 3 }, (_, index) => placed[index]
                    ? <ElementTile key={placed[index].symbol} element={placed[index]} tone={item.tone} className={placed[index].atomicNumber === element.atomicNumber ? 'placed-tile' : ''} />
                    : <span key={`empty-${index}`} className="empty-slot">·</span>)}
                </span>
              </Button>;
            })}
          </div>
          <div className="feedback" role="status" aria-live="polite" aria-atomic="true">{t(`feedback.${game.feedback}`, { element: t(element.nameKey), family: t(`families.${family.id}.sentenceName`), group: family.group })}</div>
          <div className="round-action">{game.status === 'placed' && <Button ref={next} className="next-button" onClick={() => act({ type: 'next' })}>{t(game.placed.length === lesson.elements.length ? 'lesson.finish' : 'lesson.next')} <span aria-hidden="true">→</span></Button>}</div>
          <TableOrientation />
          <p className="small-note">{t('lesson.collection')}</p>
        </>}
      </div>
    </PageLayout>
  );
}
