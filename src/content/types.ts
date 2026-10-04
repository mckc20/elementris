/** Verified lesson content, independent of UI and game rules. */
export interface ElementData {
  atomicNumber: number;
  symbol: string;
  name: string;
}
export type FamilyId = 'alkali' | 'noble';
export interface LessonElement extends ElementData {
  familyId: FamilyId;
  sourceUrl: string;
}
export interface ElementFamily {
  id: FamilyId;
  name: string;
  group: number;
  tone: 'lime' | 'mint';
  description: string;
}
export interface Lesson {
  id: string;
  title: string;
  families: readonly ElementFamily[];
  elements: readonly LessonElement[];
}
