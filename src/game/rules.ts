import type { Lesson } from '../content/types';
import type { GameAction, GameState } from './types';

export function startLesson(lesson: Lesson): GameState {
  return { lessonId: lesson.id, status: 'ready', elementIndex: 0, placed: [], feedback: 'guide' };
}
export function updateGame(lesson: Lesson, state: GameState, action: GameAction): GameState {
  if (state.lessonId !== lesson.id || state.status === 'complete') return state;
  if (action.type === 'next') {
    if (state.status !== 'placed') return state;
    return state.elementIndex === lesson.elements.length - 1
      ? { ...state, status: 'complete', feedback: 'guide' }
      : { ...state, status: 'ready', elementIndex: state.elementIndex + 1, feedback: 'guide' };
  }
  if (state.status !== 'ready') return state;
  const element = lesson.elements[state.elementIndex];
  if (action.familyId !== element.familyId) {
    return { ...state, feedback: 'incorrect' };
  }
  return {
    ...state, status: 'placed', placed: [...state.placed, element.atomicNumber],
    feedback: 'correct',
  };
}
