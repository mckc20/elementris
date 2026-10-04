import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { destinations, elementCatalogue, elementsForDestinations, getElement, type DestinationId } from '../content/catalogue';
import { fallDurationMs, fallingResults, startFalling, updateFalling, type FallingAction, type FallingState } from '../game/falling';
import { Button } from './Button';
import { ElementTile } from './ElementTile';
import { PageLayout } from './PageLayout';

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setReduced(media.matches);
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, []);
  return reduced;
}

type Input = FallingAction extends infer A ? A extends FallingAction ? Omit<A, 'now' | 'turn'> : never : never;

export function FallingPlay({ onHome }: { onHome: () => void }) {
  const { t } = useTranslation();
  const [selection, setSelection] = useState<DestinationId[]>([]);
  const [game, setGame] = useState<FallingState | null>(null);
  const reducedMotion = useReducedMotion();
  const [stationaryChoice, setStationaryChoice] = useState(false);
  const stationary = reducedMotion || stationaryChoice;
  const heading = useRef<HTMLHeadingElement>(null);
  const board = useRef<HTMLDivElement>(null);
  const lanes = useRef<HTMLDivElement>(null);
  const advance = useRef<HTMLButtonElement>(null);
  const status = game?.status;
  const turn = game?.turn;

  useEffect(() => {
    if (status === 'falling') board.current?.focus();
    else if (status === 'correction' || status === 'collected' || status === 'paused') advance.current?.focus();
    else { heading.current?.focus(); window.scrollTo(0, 0); }
  }, [status, turn]);

  useEffect(() => {
    const scroller = lanes.current;
    const active = scroller?.querySelector<HTMLElement>('.active-lane');
    if (!scroller || !active) return;
    const left = active.offsetLeft;
    const right = left + active.offsetWidth;
    if (left < scroller.scrollLeft) scroller.scrollLeft = left;
    else if (right > scroller.scrollLeft + scroller.clientWidth) scroller.scrollLeft = right - scroller.clientWidth;
  }, [game?.lane, turn, status]);

  useEffect(() => {
    if (status !== 'falling' || turn === undefined) return;
    const timer = window.setInterval(() => {
      const now = performance.now();
      setGame(current => current && updateFalling(current, document.hidden
        ? { type: 'pause', reason: 'hidden', now, turn }
        : { type: 'tick', now, turn }));
    }, 50);
    return () => window.clearInterval(timer);
  }, [status, turn]);

  useEffect(() => {
    const pauseForHiddenPage = () => {
      const now = performance.now();
      setGame(current => current && updateFalling(current, { type: 'pause', reason: 'hidden', now, turn: current.turn }));
    };
    const hide = () => { if (document.hidden) pauseForHiddenPage(); };
    document.addEventListener('visibilitychange', hide);
    window.addEventListener('pagehide', pauseForHiddenPage);
    return () => { document.removeEventListener('visibilitychange', hide); window.removeEventListener('pagehide', pauseForHiddenPage); };
  }, []);

  function act(input: Input) {
    if (!game || document.hidden) return;
    const action = { ...input, now: performance.now(), turn: game.turn } as FallingAction;
    setGame(current => current && updateFalling(current, action));
  }
  function begin() {
    if (document.hidden) return;
    setGame(startFalling(selection, performance.now()));
  }
  function keyboard(event: KeyboardEvent<HTMLDivElement>) {
    // Only the focusable board owns shortcuts; native controls keep their keys.
    if (event.target !== event.currentTarget || status !== 'falling' || event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); act({ type: 'move', direction: event.key === 'ArrowLeft' ? -1 : 1 });
    } else if (event.key === 'ArrowDown' || event.key === ' ') { event.preventDefault(); act({ type: 'drop' }); }
  }
  const destinationName = (id: DestinationId) => t(`destinations.${id}`);
  const results = game && fallingResults(game);
  const element = game && getElement(game.order[game.index]);
  const selectedElements = selection.length >= 2 ? elementsForDestinations(selection) : [];

  return <PageLayout className={game && status !== 'complete' ? 'falling-page' : ''} onHome={onHome} showHome>
    <div className="lesson falling-play">
      {!game ? <>
        <p className="eyebrow">{t('falling.roundLabel')}</p>
        <h1 ref={heading} tabIndex={-1}>{t('falling.selectionTitle')}</h1>
        <p className="description">{t('falling.selectionIntro')}</p>
        <p role="status" aria-live="polite">{t('falling.selectedCount', { count: selection.length })}</p>
        <fieldset className="destination-selector">
          <legend>{t('falling.selectionLabel')}</legend>
          <div className="destination-options">{destinations.map(destination => <label key={destination.id} className={`destination-option ${selection.includes(destination.id) ? 'is-selected' : ''}`}>
            <input type="checkbox" checked={selection.includes(destination.id)}
              onChange={() => setSelection(current => current.includes(destination.id) ? current.filter(id => id !== destination.id) : [...current, destination.id])} />
            <span><strong>{t(destination.nameKey)}</strong><small>{t('falling.destinationCount', { count: elementCatalogue.filter(element => element.destinationId === destination.id).length })}</small></span>
          </label>)}</div>
        </fieldset>
        <section className="round-summary" aria-labelledby="round-summary-title">
          <h2 id="round-summary-title">{t('falling.summaryTitle')}</h2>
          <p>{selection.map(destinationName).join(' · ')}</p>
          <p>{selection.length >= 2 ? t('falling.summary', { count: selectedElements.length }) : t('falling.selectionRequired')}</p>
          <Button className="start-button" disabled={selection.length < 2} onClick={begin}>{t('falling.start')}</Button>
        </section>
        <p className="small-note">{t('falling.convention')}</p>
        <p className="small-note">{t('falling.reload')}</p>
      </> : status === 'complete' ? <>
        <p className="eyebrow">{t('falling.resultsLabel')}</p>
        <h1 ref={heading} tabIndex={-1}>{t('falling.resultsTitle')}</h1>
        <p className="intro">{t('falling.resultsIntro', { total: results!.total })}</p>
        <dl className="result-metrics">
          <div><dt>{t('falling.score')}</dt><dd data-testid="falling-score">{results!.score} / {results!.total}</dd></div>
          <div><dt>{t('falling.corrected')}</dt><dd>{results!.corrected.length}</dd></div>
          <div><dt>{t('falling.retries')}</dt><dd>{results!.retries}</dd></div>
        </dl>
        <p className="small-note">{t('falling.scoreRule')}</p>
        <section className="review-card"><h2>{t('falling.correctedTitle')}</h2>
          {results!.corrected.length ? <ul>{results!.corrected.map(record => { const item = getElement(record.atomicNumber); return <li key={record.atomicNumber}><strong>{item.symbol} · {t(item.nameKey)}</strong><span>{destinationName(item.destinationId)}</span></li>; })}</ul> : <p>{t('falling.noCorrections')}</p>}
        </section>
        <Button className="start-button" onClick={begin}>{t('falling.replay')}</Button>
        <Button className="secondary-action" onClick={() => setGame(null)}>{t('falling.change')}</Button>
      </> : <>
        <div className="round-meta"><span className="eyebrow">{t('falling.roundLabel')}</span><span>{t('falling.placed', { placed: results!.collected, total: results!.total })}</span></div>
        <progress aria-label={t('falling.progress')} value={results!.collected} max={results!.total} />
        <h1 className="round-title" ref={heading} tabIndex={-1}>{t('falling.roundTitle', { element: t(element!.nameKey) })}</h1>
        <p className="round-identity">{t('falling.identity', { symbol: element!.symbol, number: element!.atomicNumber })}</p>
        <p className="board-instruction" id="falling-instructions">{t('falling.instructions')}</p>
        {game.selection.length > 3 && <p className="small-note">{t('falling.scrollLanes')}</p>}
        <div className={`falling-board ${stationary ? 'stationary-board' : ''}`} ref={board} tabIndex={0} role="group" aria-label={t('falling.board')} aria-describedby="falling-instructions" onKeyDown={keyboard}
          style={{ '--lane-count': game.selection.length } as CSSProperties} data-status={status} data-atomic-number={element!.atomicNumber} data-turn={game.turn}>
          <div className={`falling-lanes ${game.selection.length > 3 ? 'many-lanes' : ''}`} ref={lanes}>
          <div className="falling-lanes-content">
          <div className="falling-tracks" aria-hidden="true">{game.selection.map((id, index) => <div key={id} className={`falling-track lane-${index % 3} ${index === game.lane ? 'active-lane' : ''}`}>
            {index === game.lane && <div className="falling-tile" style={{ transform: stationary ? 'none' : `translateY(${game.elapsedMs / fallDurationMs * 56}px)` }}><ElementTile element={element!} tone="peach" /></div>}
            <span className="lane-floor">{destinationName(id)}</span>
          </div>)}</div>
          <div className="lane-controls">{game.selection.map((id, index) => <Button key={id} className={`lane-control lane-${index % 3}`} aria-label={t('falling.selectLane', { destination: destinationName(id) })} aria-pressed={game.lane === index} aria-disabled={status !== 'falling'} onClick={() => { act({ type: 'select', lane: index }); if (status === 'falling') board.current?.focus({ preventScroll: true }); }}>
            <strong>{destinationName(id)}</strong><span>{t(index === game.lane ? 'falling.selected' : 'falling.chooseLane')}</span>
          </Button>)}</div>
          </div></div>
        </div>
        {status === 'falling' && <div className="falling-actions"><Button onClick={() => act({ type: 'drop' })}>{t('falling.drop')}</Button><Button className="pause-button" onClick={() => act({ type: 'pause', reason: 'manual' })}>{t('falling.pause')}</Button></div>}
        {status === 'falling' || status === 'paused' ? <p className="falling-countdown" role="timer" aria-live="off">{t('falling.countdown', { seconds: Math.max(0, Math.ceil((fallDurationMs - game.elapsedMs) / 1000)) })}</p> : <p className="falling-countdown">{t('falling.landed')}</p>}
        {stationary && <p className="small-note">{t('falling.stationary')}</p>}
        <div className="feedback" role="status" aria-live="polite" aria-atomic="true">{status === 'paused' ? t(game.pauseReason === 'hidden' ? 'falling.hidden' : 'falling.paused')
          : status === 'correction' || status === 'collected' ? t(status === 'correction' ? 'falling.incorrect' : 'falling.correct', { element: t(element!.nameKey), destination: destinationName(element!.destinationId) })
          : t('falling.active', { destination: destinationName(game.selection[game.lane]) })}</div>
        {status !== 'falling' && <div className="falling-actions"><Button ref={advance} onClick={() => act({ type: status === 'paused' ? 'resume' : status === 'correction' ? 'retry' : 'next' })}>{t(status === 'paused' ? 'falling.resume' : status === 'correction' ? 'falling.retry' : game.index === game.order.length - 1 ? 'falling.finish' : 'falling.next')}</Button></div>}
        <label className="motion-option"><input type="checkbox" checked={stationary} disabled={reducedMotion} onChange={event => setStationaryChoice(event.target.checked)} />{t('falling.motion')}</label>
        <Button className="secondary-action" onClick={() => setGame(null)}>{t('falling.change')}</Button>
        <section className="falling-collection" aria-labelledby="collection-title"><h2 id="collection-title">{t('falling.collectionTitle')}</h2>
          {results!.collected ? <ul>{game.records.filter(record => record.collected).map(record => { const item = getElement(record.atomicNumber); return <li key={record.atomicNumber}><strong>{item.symbol}</strong> {t(item.nameKey)} <small>{destinationName(item.destinationId)}</small></li>; })}</ul> : <p>{t('falling.emptyCollection')}</p>}
          <p className="small-note">{t('falling.collectionNote')}</p>
        </section>
      </>}
    </div>
  </PageLayout>;
}
