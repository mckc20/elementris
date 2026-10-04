import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import { Button } from './components/Button';
import { ElementTile } from './components/ElementTile';
import { PageLayout } from './components/PageLayout';
import { TableOrientation } from './components/TableOrientation';
import { firstLesson as lesson } from './content/lessons';
import { startLesson, updateGame } from './game/rules';
import type { GameAction } from './game/types';
import { PracticeResults } from './components/PracticeResults';
import { FallingPlay } from './components/FallingPlay';
import { clearProgress, emptyLessonProgress, emptyProgress, readProgress, recordProgress, reviewElements, writeProgress } from './game/progress';

export function App() {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(readProgress);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [confirmReset, setConfirmReset] = useState(false);
  const saved = progress.lessons[lesson.id] ?? emptyLessonProgress();
  const review = reviewElements(saved);
  const [started, setStarted] = useState(false);
  const [playOpen, setPlayOpen] = useState(() => window.location.hash === '#play');
  const [game, setGame] = useState(() => startLesson(lesson));
  const heading = useRef<HTMLHeadingElement>(null);
  const next = useRef<HTMLButtonElement>(null);
  const resetConfirmation = useRef<HTMLButtonElement>(null);
  const hasStarted = useRef(playOpen);
  const element = lesson.elements[game.order[game.elementIndex]];
  const family = lesson.families.find(item => item.id === element.familyId)!;
  const practice = game.mode === 'practice';
  const hints = game.records[game.elementIndex].hints;

  useEffect(() => {
    if (playOpen) return;
    if (!started) {
      if (hasStarted.current) {
        heading.current?.focus();
        window.scrollTo(0, 0);
      }
      return;
    }
    hasStarted.current = true;
    if (game.status === 'placed') next.current?.focus();
    else heading.current?.focus();
  }, [started, playOpen, game.status, game.elementIndex, game.mode]);

  useEffect(() => { setStorageAvailable(writeProgress(progress)); }, []);

  useEffect(() => {
    if (confirmReset) resetConfirmation.current?.focus();
  }, [confirmReset]);

  function resetProgress() {
    setProgress(emptyProgress());
    setStorageAvailable(clearProgress());
    setConfirmReset(false);
    heading.current?.focus();
  }
  function begin() {
    setGame(startLesson(lesson));
    setStarted(true);
  }
  function act(action: GameAction) {
    const updated = updateGame(lesson, game, action);
    const updatedProgress = recordProgress(progress, game, updated);
    setGame(updated);
    if (updatedProgress !== progress) {
      setProgress(updatedProgress);
      setStorageAvailable(writeProgress(updatedProgress));
    }
  }
  function beginPractice() {
    setGame(startLesson(lesson, 'practice'));
    setStarted(true);
  }
  function beginReview() {
    if (!review.length) return;
    setGame(startLesson(lesson, 'practice', Math.random, review));
    setStarted(true);
  }
  function goHome() {
    setPlayOpen(false);
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
    setStarted(false);
    setGame(startLesson(lesson));
  }
  function beginPlay() {
    hasStarted.current = true;
    window.history.replaceState(null, '', '#play');
    setPlayOpen(true);
  }

  if (playOpen) return <FallingPlay onHome={goHome} />;

  return (
    <PageLayout className={started && game.status !== 'complete' ? 'game-page' : ''} onHome={goHome} showHome={started}>
      <div className="lesson">
        {!started ? <>
          <p className="eyebrow">{t('lesson.guided')}</p>
          <h1 ref={heading} tabIndex={-1}>{t('lesson.headingStart')}<br /><span>{t('lesson.headingEnd')}</span></h1>
          <p className="intro">{t('lesson.intro')}</p>
          <section className="play-card" aria-labelledby="play-title">
            <h2 id="play-title">{t('falling.homeTitle')}</h2>
            <p>{t('falling.homeDescription')}</p>
            <Button className="start-button" onClick={beginPlay}>{t('falling.play')} <span aria-hidden="true">→</span></Button>
          </section>
          <section className="progress-card" aria-label={t('progress.selection')}>
            <h2>{t('progress.selection')}</h2>
            <h3>{t(lesson.titleKey)}</h3>
            <p>{t('progress.guided', { placed: saved.guided.length, total: lesson.elements.length })} · {t(saved.guidedComplete ? 'progress.complete' : 'progress.incomplete')}</p>
            <p>{t('progress.practice')} · {t(saved.practiceComplete ? 'progress.complete' : 'progress.incomplete')}</p>
            <p>{t('progress.recalled', { count: Object.values(saved.answers).filter(Boolean).length, total: lesson.elements.length })}</p>
            <p>{t('progress.reviewCount', { count: review.length })}</p>
            <Button className="start-button" onClick={begin}>{t('lesson.start')} <span aria-hidden="true">→</span></Button>
            <p className="small-note">{t('lesson.pace')}</p>
            <Button className="start-button secondary-action" onClick={beginPractice}>{t('practice.start')} <span aria-hidden="true">→</span></Button>
            <p className="small-note">{t('practice.intro')}</p>
            {review.length > 0 && <Button className="start-button" onClick={beginReview}>{t('progress.review')}</Button>}
            <p className="small-note">{t('progress.reviewRule')}</p>
            <p className="small-note">{t('progress.device')}</p>
            {!storageAvailable && <p role="status">{t('progress.unavailable')}</p>}
          </section>
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
          <section className="reset-progress">
            {confirmReset ? <><p>{t('progress.resetQuestion')}</p><Button ref={resetConfirmation} onClick={resetProgress}>{t('progress.confirmReset')}</Button> <Button className="secondary-action" onClick={() => { setConfirmReset(false); heading.current?.focus(); }}>{t('progress.cancel')}</Button></> : <Button className="secondary-action" onClick={() => setConfirmReset(true)}>{t('progress.reset')}</Button>}
          </section>
        </> : game.status === 'complete' && practice ? <PracticeResults game={game} lesson={lesson} headingRef={heading} onReplay={beginPractice} onGuided={begin} onReview={review.length ? beginReview : undefined} /> : game.status === 'complete' ? <>
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
          <Button className="start-button" onClick={beginPractice}>{t('practice.start')} <span aria-hidden="true">→</span></Button>
          <p className="small-note">{t('practice.intro')}</p>
        </> : <>
          <div className="round-meta"><span className="eyebrow">{t(practice ? game.order.length < lesson.elements.length ? 'progress.reviewLabel' : 'practice.label' : 'lesson.guided')}</span><span>{t('lesson.placed', { placed: game.placed.length, total: game.order.length })}</span></div>
          <progress aria-label={t(practice ? 'practice.progress' : 'lesson.progress')} value={game.placed.length} max={game.order.length} />
          <h1 className="round-title" ref={heading} tabIndex={-1}>{t('lesson.findFamily', { element: t(element.nameKey) })}</h1>
          <div className="current-element">
            <ElementTile element={element} tone="peach" />
            <div><p className="group-label">{t('lesson.elementIndex', { index: game.elementIndex + 1, total: game.order.length })}</p><p className="current-name">{t(element.nameKey)}</p><p className="description">{t('lesson.atomicNumber', { number: element.atomicNumber })}</p>{!practice && <p className="family-guide">{t('lesson.familyGuide', { family: t(family.nameKey), group: family.group })}</p>}</div>
          </div>
          <p className="board-instruction">{t(game.status === 'placed' ? 'lesson.continue' : practice ? 'practice.instruction' : 'lesson.placeInstruction')}</p>
          <div className="board" aria-label={t('lesson.board')}>
            {lesson.families.map(item => {
              const highlighted = game.status === 'ready' && (!practice || hints === 2) && item.id === element.familyId;
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
          <div className="feedback" role="status" aria-live="polite" aria-atomic="true">{t(practice && game.feedback === 'incorrect' ? 'practice.incorrect' : `feedback.${game.feedback}`, { element: t(element.nameKey), family: t(`families.${family.id}.sentenceName`), group: family.group })}</div>
          <div className="round-action">{game.status === 'placed' ? <Button ref={next} className="next-button" onClick={() => act({ type: 'next' })}>{t(game.placed.length === game.order.length ? practice ? 'practice.finish' : 'lesson.finish' : 'lesson.next')} <span aria-hidden="true">→</span></Button> : practice && <Button className="hint-button" aria-disabled={hints === 2} onClick={() => act({ type: 'hint' })}>{t(hints === 0 ? 'practice.hint' : hints === 1 ? 'practice.moreHelp' : 'practice.hintShown')}</Button>}</div>
          <TableOrientation />
          <p className="small-note">{t('lesson.collection')}</p>
        </>}
      </div>
    </PageLayout>
  );
}
