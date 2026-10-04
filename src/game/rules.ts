import type { Lesson } from '../content/types';
import type { GameAction, GameState } from './types';

export function startLesson(lesson: Lesson, mode: GameState['mode'] = 'guided'): GameState {
  // Reverse each half to repeat the same elements without the guided sequence.
  const indexes = lesson.elements.map((_, index) => index);
  const order = mode === 'guided' ? indexes : [...indexes.slice(0, 3).reverse(), ...indexes.slice(3).reverse()];
  return {
    lessonId: lesson.id, mode, order, status: 'ready', elementIndex: 0, placed: [],
    records: order.map(index => ({ atomicNumber: lesson.elements[index].atomicNumber, attempts: 0, hints: 0, firstAttemptCorrect: null })),
    feedback: mode === 'guided' ? 'guide' : 'recall',
  };
}
export function updateGame(lesson: Lesson, state: GameState, action: GameAction): GameState {
  if (state.lessonId !== lesson.id || state.status === 'complete') return state;
  if (action.type === 'next') {
    if (state.status !== 'placed') return state;
    return state.elementIndex === lesson.elements.length - 1
      ? { ...state, status: 'complete' }
      : { ...state, status: 'ready', elementIndex: state.elementIndex + 1, feedback: state.mode === 'guided' ? 'guide' : 'recall' };
  }
  if (state.status !== 'ready') return state;
  const record = state.records[state.elementIndex];
  if (action.type === 'hint') {
    if (state.mode !== 'practice' || record.hints === 2) return state;
    const hints = record.hints === 0 ? 1 : 2;
    return { ...state, records: state.records.map((item, index) => index === state.elementIndex ? { ...item, hints } : item), feedback: hints === 1 ? 'clue' : 'destination' };
  }
  const element = lesson.elements[state.order[state.elementIndex]];
  const correct = action.familyId === element.familyId;
  const records = state.records.map((item, index) => index === state.elementIndex
    ? { ...item, attempts: item.attempts + 1, firstAttemptCorrect: item.firstAttemptCorrect ?? correct } : item);
  if (action.familyId !== element.familyId) {
    return { ...state, records, feedback: 'incorrect' };
  }
  return {
    ...state, records, status: 'placed', placed: [...state.placed, element.atomicNumber],
    feedback: 'correct',
  };
}

export function practiceResults(state: GameState) {
  const completed = state.records.filter(record => state.placed.includes(record.atomicNumber));
  return {
    firstAttemptCorrect: completed.filter(record => record.firstAttemptCorrect).length,
    unaided: completed.filter(record => record.firstAttemptCorrect && record.hints === 0).length,
    assisted: completed.filter(record => record.hints > 0 || record.attempts > 1).length,
    hints: state.records.reduce((total, record) => total + record.hints, 0),
    retries: state.records.reduce((total, record) => total + Math.max(0, record.attempts - 1), 0),
    review: completed.filter(record => record.hints > 0 || record.attempts > 1),
  };
}
