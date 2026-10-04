import { elementsForDestinations, getElement, type DestinationId } from '../content/catalogue';

export const fallDurationMs = 12_000;
export interface FallingRecord {
  atomicNumber: number;
  attempts: number;
  firstLandingCorrect: boolean | null;
  collected: boolean;
}
export interface FallingState {
  selection: readonly DestinationId[];
  order: readonly number[];
  records: readonly FallingRecord[];
  index: number;
  lane: number;
  elapsedMs: number;
  lastTick: number;
  /** Identifies an attempt, rejecting queued events from a previous tile/retry. */
  turn: number;
  status: 'falling' | 'paused' | 'correction' | 'collected' | 'complete';
  pauseReason: 'manual' | 'hidden';
}
export type FallingAction = { now: number; turn: number } & (
  | { type: 'tick' | 'drop' | 'resume' | 'retry' | 'next' }
  | { type: 'select'; lane: number }
  | { type: 'move'; direction: -1 | 1 }
  | { type: 'pause'; reason: 'manual' | 'hidden' }
);

export function startFalling(selection: readonly DestinationId[], now: number, random = Math.random): FallingState {
  if (!Number.isFinite(now)) throw new RangeError('A finite clock value is required');
  const order = elementsForDestinations(selection).map(element => element.atomicNumber);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return { selection: [...selection], order, records: order.map(atomicNumber => ({ atomicNumber, attempts: 0, firstLandingCorrect: null, collected: false })),
    index: 0, lane: 0, elapsedMs: 0, lastTick: now, turn: 0, status: 'falling', pauseReason: 'manual' };
}

function land(state: FallingState): FallingState {
  const correct = getElement(state.order[state.index]).destinationId === state.selection[state.lane];
  return { ...state, status: correct ? 'collected' : 'correction', records: state.records.map((record, i) => i === state.index
    ? { ...record, attempts: record.attempts + 1, firstLandingCorrect: record.firstLandingCorrect ?? correct, collected: correct } : record) };
}

/** The clock is supplied by the caller; rules never read browser time or storage. */
export function updateFalling(state: FallingState, action: FallingAction): FallingState {
  if (action.turn !== state.turn || !Number.isFinite(action.now) || action.now < state.lastTick || state.status === 'complete') return state;
  if (action.type === 'pause') {
    // Do not integrate time from a delayed visibility event or a suspended tab.
    return state.status === 'falling' ? { ...state, status: 'paused', pauseReason: action.reason, lastTick: action.now } : state;
  }
  if (action.type === 'resume') return state.status === 'paused' ? { ...state, status: 'falling', lastTick: action.now } : state;
  if (action.type === 'retry') return state.status === 'correction'
    ? { ...state, status: 'falling', elapsedMs: 0, lane: 0, lastTick: action.now, turn: state.turn + 1 } : state;
  if (action.type === 'next') {
    if (state.status !== 'collected') return state;
    return state.index === state.order.length - 1 ? { ...state, status: 'complete', lastTick: action.now }
      : { ...state, index: state.index + 1, elapsedMs: 0, lastTick: action.now, turn: state.turn + 1, status: 'falling' };
  }
  if (state.status !== 'falling') return state;
  // Integrate before input: a tile whose deadline passed lands in its old lane.
  const elapsedMs = Math.min(fallDurationMs, state.elapsedMs + action.now - state.lastTick);
  const timed = { ...state, elapsedMs, lastTick: action.now };
  if (elapsedMs === fallDurationMs) return land(timed);
  if (action.type === 'drop') return land(timed);
  if (action.type === 'select') return Number.isInteger(action.lane) && action.lane >= 0 && action.lane < state.selection.length
    ? { ...timed, lane: action.lane } : timed;
  if (action.type === 'move') return { ...timed, lane: Math.max(0, Math.min(state.selection.length - 1, state.lane + action.direction)) };
  return timed;
}

export function fallingResults(state: FallingState) {
  const collected = state.records.filter(record => record.collected);
  return { total: state.order.length, collected: collected.length,
    score: collected.filter(record => record.firstLandingCorrect).length,
    corrected: collected.filter(record => record.firstLandingCorrect === false),
    retries: state.records.reduce((sum, record) => sum + Math.max(0, record.attempts - 1), 0) };
}
