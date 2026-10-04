import type { Lesson } from './types';

// RSC data verification and family terminology: docs/lesson-data.md.
export const firstLesson: Lesson = {
  id: 'first-families',
  titleKey: 'lesson.title',
  families: [
    { id: 'alkali', nameKey: 'families.alkali.name', group: 1, tone: 'lime', descriptionKey: 'families.alkali.description' },
    { id: 'noble', nameKey: 'families.noble.name', group: 18, tone: 'mint', descriptionKey: 'families.noble.description' },
  ],
  elements: [
    { atomicNumber: 3, symbol: 'Li', nameKey: 'elements.Li', familyId: 'alkali', sourceUrl: 'https://periodic-table.rsc.org/element/3/lithium' },
    { atomicNumber: 2, symbol: 'He', nameKey: 'elements.He', familyId: 'noble', sourceUrl: 'https://periodic-table.rsc.org/element/2/helium' },
    { atomicNumber: 11, symbol: 'Na', nameKey: 'elements.Na', familyId: 'alkali', sourceUrl: 'https://periodic-table.rsc.org/element/11/sodium' },
    { atomicNumber: 10, symbol: 'Ne', nameKey: 'elements.Ne', familyId: 'noble', sourceUrl: 'https://periodic-table.rsc.org/element/10/neon' },
    { atomicNumber: 19, symbol: 'K', nameKey: 'elements.K', familyId: 'alkali', sourceUrl: 'https://periodic-table.rsc.org/element/19/potassium' },
    { atomicNumber: 18, symbol: 'Ar', nameKey: 'elements.Ar', familyId: 'noble', sourceUrl: 'https://periodic-table.rsc.org/element/18/argon' },
  ],
};
export const lessons: readonly Lesson[] = [firstLesson];
