import type { FamilyId } from '../content/types';

export interface GameState {
  lessonId: string;
  mode: 'guided' | 'practice';
  order: readonly number[];
  records: readonly PlacementRecord[];
  status: 'ready' | 'placed' | 'complete';
  elementIndex: number;
  placed: readonly number[];
  feedback: 'guide' | 'recall' | 'clue' | 'destination' | 'incorrect' | 'correct';
}
export interface PlacementRecord {
  atomicNumber: number;
  attempts: number;
  hints: 0 | 1 | 2;
  firstAttemptCorrect: boolean | null;
}
export type GameAction = { type: 'place'; familyId: FamilyId } | { type: 'next' } | { type: 'hint' };
