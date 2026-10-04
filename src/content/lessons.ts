import { getElement } from './catalogue';
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
    { ...getElement(3), familyId: 'alkali', sourceUrl: 'https://periodic-table.rsc.org/element/3/lithium' },
    { ...getElement(2), familyId: 'noble', sourceUrl: 'https://periodic-table.rsc.org/element/2/helium' },
    { ...getElement(11), familyId: 'alkali', sourceUrl: 'https://periodic-table.rsc.org/element/11/sodium' },
    { ...getElement(10), familyId: 'noble', sourceUrl: 'https://periodic-table.rsc.org/element/10/neon' },
    { ...getElement(19), familyId: 'alkali', sourceUrl: 'https://periodic-table.rsc.org/element/19/potassium' },
    { ...getElement(18), familyId: 'noble', sourceUrl: 'https://periodic-table.rsc.org/element/18/argon' },
  ],
};
export const lessons: readonly Lesson[] = [firstLesson];
