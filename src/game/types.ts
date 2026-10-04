import type { FamilyId } from '../content/types';

export interface GameState {
  lessonId: string;
  status: 'ready' | 'placed' | 'complete';
  elementIndex: number;
  placed: readonly number[];
  feedback: 'guide' | 'incorrect' | 'correct';
}
export type GameAction = { type: 'place'; familyId: FamilyId } | { type: 'next' };
