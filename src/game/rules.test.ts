import { describe, expect, it } from 'vitest';
import { firstLesson } from '../content/lessons';
import { startLesson, updateGame } from './rules';

describe('guided family placement', () => {
  it('keeps an incorrect element available for retry without collecting it', () => {
    const initial = startLesson(firstLesson);
    const wrong = updateGame(firstLesson, initial, { type: 'place', familyId: 'noble' });
    expect(wrong.status).toBe('ready');
    expect(wrong.elementIndex).toBe(0);
    expect(wrong.placed).toEqual([]);
    expect(wrong.feedback).toContain('Lithium belongs to the alkali metals in group 1');
    const corrected = updateGame(firstLesson, wrong, { type: 'place', familyId: 'alkali' });
    expect(corrected.status).toBe('placed');
    expect(corrected.placed).toEqual([3]);
    expect(initial.placed).toEqual([]);
  });
  it('prevents skipping elements and duplicate placements', () => {
    const initial = startLesson(firstLesson);
    expect(updateGame(firstLesson, initial, { type: 'next' })).toBe(initial);
    const placed = updateGame(firstLesson, initial, { type: 'place', familyId: 'alkali' });
    expect(updateGame(firstLesson, placed, { type: 'place', familyId: 'alkali' })).toBe(placed);
    expect(updateGame(firstLesson, placed, { type: 'place', familyId: 'noble' })).toBe(placed);
    expect(updateGame(firstLesson, placed, { type: 'next' }).elementIndex).toBe(1);
  });
  it('finishes only after every element is placed and allows a fresh replay', () => {
    let state = startLesson(firstLesson);
    for (const element of firstLesson.elements) {
      expect(state.status).toBe('ready');
      state = updateGame(firstLesson, state, { type: 'place', familyId: element.familyId });
      expect(state.status).toBe('placed');
      state = updateGame(firstLesson, state, { type: 'next' });
    }
    expect(state.status).toBe('complete');
    expect(state.placed).toEqual([3, 2, 11, 10, 19, 18]);
    expect(updateGame(firstLesson, state, { type: 'next' })).toBe(state);
    expect(updateGame(firstLesson, state, { type: 'place', familyId: 'alkali' })).toBe(state);
    const replay = startLesson(firstLesson);
    expect(replay.status).toBe('ready');
    expect(replay.placed).toEqual([]);
    expect(replay.feedback).toBe('');
  });
});
