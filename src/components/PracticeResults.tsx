import type { RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import type { Lesson } from '../content/types';
import type { GameState } from '../game/types';
import { practiceResults } from '../game/rules';
import { Button } from './Button';

export function PracticeResults({ game, lesson, headingRef, onReplay, onGuided }: {
  game: GameState; lesson: Lesson; headingRef: RefObject<HTMLHeadingElement | null>;
  onReplay: () => void; onGuided: () => void;
}) {
  const { t } = useTranslation();
  const results = practiceResults(game);
  return <>
    <p className="eyebrow">{t('practice.complete')}</p>
    <h1 ref={headingRef} tabIndex={-1}>{t('practice.resultsTitle')}</h1>
    <p className="intro">{t('practice.resultsIntro')}</p>
    <dl className="result-metrics">
      <div><dt>{t('practice.firstCorrect')}</dt><dd>{results.firstAttemptCorrect} / {lesson.elements.length}</dd></div>
      <div><dt>{t('practice.unaided')}</dt><dd>{results.unaided} / {lesson.elements.length}</dd></div>
      <div><dt>{t('practice.assisted')}</dt><dd>{results.assisted} / {lesson.elements.length}</dd></div>
      <div><dt>{t('practice.hintsUsed')}</dt><dd>{results.hints}</dd></div>
      <div><dt>{t('practice.retries')}</dt><dd>{results.retries}</dd></div>
    </dl>
    <p className="description">{t('practice.calculation')}</p>
    <section className="review-card">
      <h2>{t('practice.reviewTitle')}</h2>
      {results.review.length === 0 ? <p>{t('practice.noReview')}</p> : <ul>{results.review.map(record => {
        const element = lesson.elements.find(item => item.atomicNumber === record.atomicNumber)!;
        return <li key={record.atomicNumber}><strong>{element.symbol} · {t(element.nameKey)}</strong><span>{t('practice.reviewDetails', { hints: record.hints, retries: record.attempts - 1 })}</span></li>;
      })}</ul>}
    </section>
    <Button className="start-button" onClick={onReplay}>{t('practice.replay')} <span aria-hidden="true">↻</span></Button>
    <Button className="secondary-action" onClick={onGuided}>{t('lesson.replay')}</Button>
  </>;
}
