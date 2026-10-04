import { describe, expect, it } from 'vitest';
import { getElement, elementsForDestinations, type DestinationId } from '../content/catalogue';
import { fallDurationMs, fallingResults, startFalling, updateFalling, type FallingState, type FallingAction } from './falling';

const selection: DestinationId[] = ['group-3', 'group-4'];
const start = () => startFalling(selection, 100, () => 0);
const action = (state: FallingState, input: Omit<FallingAction, 'turn'>) => updateFalling(state, { ...input, turn: state.turn } as FallingAction);
const correctLane = (state: FallingState) => state.selection.indexOf(getElement(state.order[state.index]).destinationId);
const choose = (state: FallingState, lane = correctLane(state)) => updateFalling(state, { type: 'select', lane, turn: state.turn, now: state.lastTick });

describe('falling rules with deterministic clock', () => {
  it('covers exactly the selected elements and creates a new shuffle on replay', () => {
    const game = start();
    expect([...game.order].sort((a, b) => a - b)).toEqual(elementsForDestinations(selection).map(e => e.atomicNumber));
    expect(new Set(game.order).size).toBe(game.order.length);
    expect(startFalling(selection, 0, () => 0.999).order).not.toEqual(game.order);
    selection.push('group-5');
    expect(game.selection).toHaveLength(2);
    selection.pop();
    expect(() => startFalling(['group-3'], 0)).toThrow();
  });

  it('natural and early landing obey identical placement/scoring rules', () => {
    const game = choose(start());
    const near = action(game, { type: 'tick', now: game.lastTick + fallDurationMs - 1 });
    expect(near.status).toBe('falling');
    const natural = action(near, { type: 'tick', now: near.lastTick + 1 });
    const early = action(game, { type: 'drop', now: game.lastTick + 100 });
    expect(natural.status).toBe('collected');
    expect(early.records).toEqual(natural.records);
    expect(fallingResults(early).score).toBe(1);
    expect(action(natural, { type: 'drop', now: natural.lastTick })).toBe(natural);
  });

  it('freezes all timed input when paused and resumes without background-time jumps', () => {
    const game = action(start(), { type: 'tick', now: 1600 });
    for (const reason of ['manual', 'hidden'] as const) {
      const paused = updateFalling(game, { type: 'pause', reason, now: 2000, turn: game.turn });
      for (const type of ['tick', 'drop', 'retry', 'next'] as const) expect(action(paused, { type, now: 90_000 })).toBe(paused);
      expect(updateFalling(paused, { type: 'select', lane: 1, now: 90_000, turn: paused.turn })).toBe(paused);
      const resumed = action(paused, { type: 'resume', now: 90_000 });
      expect(resumed.elapsedMs).toBe(1500);
      expect(action(resumed, { type: 'tick', now: 90_250 }).elapsedMs).toBe(1750);
    }
  });

  it('retries the same tile, records corrections, and rejects stale/duplicate submissions', () => {
    let game = choose(start(), 1 - correctLane(start()));
    game = action(game, { type: 'drop', now: game.lastTick });
    expect(game.status).toBe('correction');
    const number = game.order[game.index];
    const staleTurn = game.turn;
    for (const type of ['tick', 'drop', 'next', 'resume'] as const) expect(action(game, { type, now: 50_000 })).toBe(game);
    game = action(game, { type: 'retry', now: 50_000 });
    expect(game.order[game.index]).toBe(number);
    expect(game.elapsedMs).toBe(0);
    expect(updateFalling(game, { type: 'drop', now: 50_000, turn: staleTurn })).toBe(game);
    game = choose(game);
    game = action(game, { type: 'drop', now: 50_000 });
    expect(fallingResults(game)).toMatchObject({ score: 0, collected: 1, retries: 1 });
    expect(fallingResults(game).corrected.map(r => r.atomicNumber)).toEqual([number]);
    expect(action(game, { type: 'tick', now: 99_000 })).toBe(game);
  });

  it('finishes only after explicit Continue and cannot alter completed results', () => {
    let game = start();
    for (let i = 0; i < game.order.length; i++) {
      game = action(choose(game), { type: 'drop', now: game.lastTick });
      expect(game.status).toBe('collected');
      const turn = game.turn;
      game = action(game, { type: 'next', now: game.lastTick });
      expect(updateFalling(game, { type: 'next', now: game.lastTick, turn })).toBe(game);
    }
    expect(game.status).toBe('complete');
    expect(fallingResults(game)).toMatchObject({ score: 6, collected: 6, total: 6, corrected: [], retries: 0 });
    for (const type of ['tick', 'drop', 'retry', 'next', 'resume'] as const) expect(action(game, { type, now: 99_000 })).toBe(game);
    const replay = start();
    expect(replay.records.every(r => r.attempts === 0 && !r.collected)).toBe(true);
  });

  it('clamps keyboard movement and lands before accepting late lane input', () => {
    let game = start();
    game = updateFalling(game, { type: 'move', direction: -1, now: 100, turn: 0 });
    expect(game.lane).toBe(0);
    game = updateFalling(game, { type: 'move', direction: 1, now: 100, turn: 0 });
    game = updateFalling(game, { type: 'move', direction: 1, now: 100, turn: 0 });
    expect(game.lane).toBe(1);
    const oldLane = game.lane;
    game = updateFalling(game, { type: 'select', lane: 0, now: 100 + fallDurationMs, turn: 0 });
    expect(game.lane).toBe(oldLane);
    expect(game.records[0].firstLandingCorrect).toBe(oldLane === correctLane(game));
    expect(action(start(), { type: 'tick', now: NaN })).toEqual(start());
    expect(action(start(), { type: 'tick', now: 99 })).toEqual(start());
  });
});
