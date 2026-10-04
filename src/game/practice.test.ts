import { describe, expect, it } from 'vitest';
import { firstLesson as lesson } from '../content/lessons';
import { practiceResults, startLesson, updateGame } from './rules';

describe('independent practice', () => {
  it('reuses every lesson element once in a different order and starts with recall', () => {
    const state = startLesson(lesson, 'practice');
    expect(state.order).not.toEqual(startLesson(lesson).order);
    expect([...state.order].sort()).toEqual(lesson.elements.map((_, index) => index));
    expect(state.feedback).toBe('recall');
    expect(state.records.every(record => record.hints === 0)).toBe(true);
  });

  it('offers a family clue before a destination and resets hints for the next element', () => {
    const initial = startLesson(lesson, 'practice');
    const clue = updateGame(lesson, initial, { type: 'hint' });
    expect(clue.feedback).toBe('clue');
    expect(clue.records[0].hints).toBe(1);
    expect(initial.records[0].hints).toBe(0);
    const destination = updateGame(lesson, clue, { type: 'hint' });
    expect(destination.feedback).toBe('destination');
    expect(destination.records[0].hints).toBe(2);
    expect(updateGame(lesson, destination, { type: 'hint' })).toBe(destination);
    const placed = updateGame(lesson, destination, { type: 'place', familyId: lesson.elements[destination.order[0]].familyId });
    expect(updateGame(lesson, placed, { type: 'hint' })).toBe(placed);
    const next = updateGame(lesson, placed, { type: 'next' });
    expect(next.feedback).toBe('recall');
    expect(next.records[1].hints).toBe(0);
    expect(updateGame(lesson, startLesson(lesson), { type: 'hint' }).feedback).toBe('guide');
  });

  it('separates first answers, hints, corrections and repeated retries in a completed round', () => {
    let state = startLesson(lesson, 'practice');
    for (let index = 0; index < lesson.elements.length; index++) {
      const familyId = lesson.elements[state.order[index]].familyId;
      if (index === 1) state = updateGame(lesson, state, { type: 'hint' });
      if (index === 2 || index === 3) {
        const wrong = familyId === 'alkali' ? 'noble' : 'alkali';
        state = updateGame(lesson, state, { type: 'place', familyId: wrong });
        expect(state.records[index].firstAttemptCorrect).toBe(false);
        expect(state.placed).toHaveLength(index);
        if (index === 3) {
          state = updateGame(lesson, state, { type: 'place', familyId: wrong });
          state = updateGame(lesson, state, { type: 'hint' });
          state = updateGame(lesson, state, { type: 'hint' });
        }
      }
      state = updateGame(lesson, state, { type: 'place', familyId });
      state = updateGame(lesson, state, { type: 'next' });
    }
    expect(state.status).toBe('complete');
    expect(practiceResults(state)).toMatchObject({ firstAttemptCorrect: 4, unaided: 3, assisted: 3, hints: 3, retries: 3 });
    expect(practiceResults(state).review.map(record => record.atomicNumber)).toEqual(state.records.slice(1, 4).map(record => record.atomicNumber));
    expect(updateGame(lesson, state, { type: 'hint' })).toBe(state);
    const replay = startLesson(lesson, 'practice');
    expect(practiceResults(replay)).toMatchObject({ firstAttemptCorrect: 0, unaided: 0, assisted: 0, hints: 0, retries: 0, review: [] });
  });

  it('reports a perfect unaided round without elements to review', () => {
    let state = startLesson(lesson, 'practice');
    for (const index of state.order) {
      state = updateGame(lesson, state, { type: 'place', familyId: lesson.elements[index].familyId });
      const placed = state;
      expect(updateGame(lesson, state, { type: 'place', familyId: lesson.elements[index].familyId })).toBe(placed);
      state = updateGame(lesson, state, { type: 'next' });
    }
    expect(practiceResults(state)).toMatchObject({ firstAttemptCorrect: 6, unaided: 6, assisted: 0, hints: 0, retries: 0, review: [] });
  });
});
