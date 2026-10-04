import type { ElementSymbol } from './catalogue';
export type { ElementSymbol } from './catalogue';

/** Verified lesson content, independent of UI and game rules. */
export interface ElementData {
  atomicNumber: number;
  symbol: string;
  nameKey: `elements.${ElementSymbol}`;
}
export type FamilyId = 'alkali' | 'noble';
export interface LessonElement extends ElementData {
  familyId: FamilyId;
  sourceUrl: string;
}
export interface ElementFamily {
  id: FamilyId;
  nameKey: `families.${FamilyId}.name`;
  group: number;
  tone: 'lime' | 'mint';
  descriptionKey: `families.${FamilyId}.description`;
}
export interface Lesson {
  id: string;
  titleKey: 'lesson.title';
  families: readonly ElementFamily[];
  elements: readonly LessonElement[];
}
