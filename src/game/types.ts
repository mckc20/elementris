/** Future rules operate on lesson IDs and state, without importing React. */
export interface GameState {
  lessonId: string;
  mode: 'guided' | 'practice';
  elementIndex: number;
  placements: readonly {
    atomicNumber: number;
    familyId: string;
    correct: boolean;
  }[];
  hintsUsed: number;
}
