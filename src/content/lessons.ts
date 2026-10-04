import type { Lesson } from './types';

// RSC data verification and family terminology: docs/lesson-data.md.
export const firstLesson: Lesson = {
  id: 'first-families',
  title: 'Meet two element families',
  families: [
    { id: 'alkali', name: 'Alkali metals', group: 1, tone: 'lime', description: 'Reactive metals on the left of the table.' },
    { id: 'noble', name: 'Noble gases', group: 18, tone: 'mint', description: 'Very unreactive gases on the right of the table.' },
  ],
  elements: [
    { atomicNumber: 3, symbol: 'Li', name: 'Lithium', familyId: 'alkali', sourceUrl: 'https://periodic-table.rsc.org/element/3/lithium' },
    { atomicNumber: 2, symbol: 'He', name: 'Helium', familyId: 'noble', sourceUrl: 'https://periodic-table.rsc.org/element/2/helium' },
    { atomicNumber: 11, symbol: 'Na', name: 'Sodium', familyId: 'alkali', sourceUrl: 'https://periodic-table.rsc.org/element/11/sodium' },
    { atomicNumber: 10, symbol: 'Ne', name: 'Neon', familyId: 'noble', sourceUrl: 'https://periodic-table.rsc.org/element/10/neon' },
    { atomicNumber: 19, symbol: 'K', name: 'Potassium', familyId: 'alkali', sourceUrl: 'https://periodic-table.rsc.org/element/19/potassium' },
    { atomicNumber: 18, symbol: 'Ar', name: 'Argon', familyId: 'noble', sourceUrl: 'https://periodic-table.rsc.org/element/18/argon' },
  ],
};
export const lessons: readonly Lesson[] = [firstLesson];
