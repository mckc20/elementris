/** Whole-table scientific data. Source and game convention: docs/lesson-data.md. */
export type GroupNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18;
export type SeriesId = 'lanthanoids' | 'actinoids';
export type DestinationId = `group-${GroupNumber}` | SeriesId;
export type Destination =
  | { readonly id: `group-${GroupNumber}`; readonly kind: 'group'; readonly group: GroupNumber; readonly nameKey: `destinations.group-${GroupNumber}` }
  | { readonly id: SeriesId; readonly kind: 'series'; readonly nameKey: `destinations.${SeriesId}` };

export const destinations = [
  { id: 'group-1', kind: 'group', group: 1, nameKey: 'destinations.group-1' },
  { id: 'group-2', kind: 'group', group: 2, nameKey: 'destinations.group-2' },
  { id: 'group-3', kind: 'group', group: 3, nameKey: 'destinations.group-3' },
  { id: 'group-4', kind: 'group', group: 4, nameKey: 'destinations.group-4' },
  { id: 'group-5', kind: 'group', group: 5, nameKey: 'destinations.group-5' },
  { id: 'group-6', kind: 'group', group: 6, nameKey: 'destinations.group-6' },
  { id: 'group-7', kind: 'group', group: 7, nameKey: 'destinations.group-7' },
  { id: 'group-8', kind: 'group', group: 8, nameKey: 'destinations.group-8' },
  { id: 'group-9', kind: 'group', group: 9, nameKey: 'destinations.group-9' },
  { id: 'group-10', kind: 'group', group: 10, nameKey: 'destinations.group-10' },
  { id: 'group-11', kind: 'group', group: 11, nameKey: 'destinations.group-11' },
  { id: 'group-12', kind: 'group', group: 12, nameKey: 'destinations.group-12' },
  { id: 'group-13', kind: 'group', group: 13, nameKey: 'destinations.group-13' },
  { id: 'group-14', kind: 'group', group: 14, nameKey: 'destinations.group-14' },
  { id: 'group-15', kind: 'group', group: 15, nameKey: 'destinations.group-15' },
  { id: 'group-16', kind: 'group', group: 16, nameKey: 'destinations.group-16' },
  { id: 'group-17', kind: 'group', group: 17, nameKey: 'destinations.group-17' },
  { id: 'group-18', kind: 'group', group: 18, nameKey: 'destinations.group-18' },
  { id: 'lanthanoids', kind: 'series', nameKey: 'destinations.lanthanoids' },
  { id: 'actinoids', kind: 'series', nameKey: 'destinations.actinoids' },
] as const satisfies readonly Destination[];

// Series membership takes precedence over numbered groups for game destinations.
// In this convention La–Lu and Ac–Lr are separate series; group 3 contains Sc and Y.
export const elementCatalogue = [
  { atomicNumber: 1, symbol: 'H', nameKey: 'elements.H', period: 1, destinationId: 'group-1' },
  { atomicNumber: 2, symbol: 'He', nameKey: 'elements.He', period: 1, destinationId: 'group-18' },
  { atomicNumber: 3, symbol: 'Li', nameKey: 'elements.Li', period: 2, destinationId: 'group-1' },
  { atomicNumber: 4, symbol: 'Be', nameKey: 'elements.Be', period: 2, destinationId: 'group-2' },
  { atomicNumber: 5, symbol: 'B', nameKey: 'elements.B', period: 2, destinationId: 'group-13' },
  { atomicNumber: 6, symbol: 'C', nameKey: 'elements.C', period: 2, destinationId: 'group-14' },
  { atomicNumber: 7, symbol: 'N', nameKey: 'elements.N', period: 2, destinationId: 'group-15' },
  { atomicNumber: 8, symbol: 'O', nameKey: 'elements.O', period: 2, destinationId: 'group-16' },
  { atomicNumber: 9, symbol: 'F', nameKey: 'elements.F', period: 2, destinationId: 'group-17' },
  { atomicNumber: 10, symbol: 'Ne', nameKey: 'elements.Ne', period: 2, destinationId: 'group-18' },
  { atomicNumber: 11, symbol: 'Na', nameKey: 'elements.Na', period: 3, destinationId: 'group-1' },
  { atomicNumber: 12, symbol: 'Mg', nameKey: 'elements.Mg', period: 3, destinationId: 'group-2' },
  { atomicNumber: 13, symbol: 'Al', nameKey: 'elements.Al', period: 3, destinationId: 'group-13' },
  { atomicNumber: 14, symbol: 'Si', nameKey: 'elements.Si', period: 3, destinationId: 'group-14' },
  { atomicNumber: 15, symbol: 'P', nameKey: 'elements.P', period: 3, destinationId: 'group-15' },
  { atomicNumber: 16, symbol: 'S', nameKey: 'elements.S', period: 3, destinationId: 'group-16' },
  { atomicNumber: 17, symbol: 'Cl', nameKey: 'elements.Cl', period: 3, destinationId: 'group-17' },
  { atomicNumber: 18, symbol: 'Ar', nameKey: 'elements.Ar', period: 3, destinationId: 'group-18' },
  { atomicNumber: 19, symbol: 'K', nameKey: 'elements.K', period: 4, destinationId: 'group-1' },
  { atomicNumber: 20, symbol: 'Ca', nameKey: 'elements.Ca', period: 4, destinationId: 'group-2' },
  { atomicNumber: 21, symbol: 'Sc', nameKey: 'elements.Sc', period: 4, destinationId: 'group-3' },
  { atomicNumber: 22, symbol: 'Ti', nameKey: 'elements.Ti', period: 4, destinationId: 'group-4' },
  { atomicNumber: 23, symbol: 'V', nameKey: 'elements.V', period: 4, destinationId: 'group-5' },
  { atomicNumber: 24, symbol: 'Cr', nameKey: 'elements.Cr', period: 4, destinationId: 'group-6' },
  { atomicNumber: 25, symbol: 'Mn', nameKey: 'elements.Mn', period: 4, destinationId: 'group-7' },
  { atomicNumber: 26, symbol: 'Fe', nameKey: 'elements.Fe', period: 4, destinationId: 'group-8' },
  { atomicNumber: 27, symbol: 'Co', nameKey: 'elements.Co', period: 4, destinationId: 'group-9' },
  { atomicNumber: 28, symbol: 'Ni', nameKey: 'elements.Ni', period: 4, destinationId: 'group-10' },
  { atomicNumber: 29, symbol: 'Cu', nameKey: 'elements.Cu', period: 4, destinationId: 'group-11' },
  { atomicNumber: 30, symbol: 'Zn', nameKey: 'elements.Zn', period: 4, destinationId: 'group-12' },
  { atomicNumber: 31, symbol: 'Ga', nameKey: 'elements.Ga', period: 4, destinationId: 'group-13' },
  { atomicNumber: 32, symbol: 'Ge', nameKey: 'elements.Ge', period: 4, destinationId: 'group-14' },
  { atomicNumber: 33, symbol: 'As', nameKey: 'elements.As', period: 4, destinationId: 'group-15' },
  { atomicNumber: 34, symbol: 'Se', nameKey: 'elements.Se', period: 4, destinationId: 'group-16' },
  { atomicNumber: 35, symbol: 'Br', nameKey: 'elements.Br', period: 4, destinationId: 'group-17' },
  { atomicNumber: 36, symbol: 'Kr', nameKey: 'elements.Kr', period: 4, destinationId: 'group-18' },
  { atomicNumber: 37, symbol: 'Rb', nameKey: 'elements.Rb', period: 5, destinationId: 'group-1' },
  { atomicNumber: 38, symbol: 'Sr', nameKey: 'elements.Sr', period: 5, destinationId: 'group-2' },
  { atomicNumber: 39, symbol: 'Y', nameKey: 'elements.Y', period: 5, destinationId: 'group-3' },
  { atomicNumber: 40, symbol: 'Zr', nameKey: 'elements.Zr', period: 5, destinationId: 'group-4' },
  { atomicNumber: 41, symbol: 'Nb', nameKey: 'elements.Nb', period: 5, destinationId: 'group-5' },
  { atomicNumber: 42, symbol: 'Mo', nameKey: 'elements.Mo', period: 5, destinationId: 'group-6' },
  { atomicNumber: 43, symbol: 'Tc', nameKey: 'elements.Tc', period: 5, destinationId: 'group-7' },
  { atomicNumber: 44, symbol: 'Ru', nameKey: 'elements.Ru', period: 5, destinationId: 'group-8' },
  { atomicNumber: 45, symbol: 'Rh', nameKey: 'elements.Rh', period: 5, destinationId: 'group-9' },
  { atomicNumber: 46, symbol: 'Pd', nameKey: 'elements.Pd', period: 5, destinationId: 'group-10' },
  { atomicNumber: 47, symbol: 'Ag', nameKey: 'elements.Ag', period: 5, destinationId: 'group-11' },
  { atomicNumber: 48, symbol: 'Cd', nameKey: 'elements.Cd', period: 5, destinationId: 'group-12' },
  { atomicNumber: 49, symbol: 'In', nameKey: 'elements.In', period: 5, destinationId: 'group-13' },
  { atomicNumber: 50, symbol: 'Sn', nameKey: 'elements.Sn', period: 5, destinationId: 'group-14' },
  { atomicNumber: 51, symbol: 'Sb', nameKey: 'elements.Sb', period: 5, destinationId: 'group-15' },
  { atomicNumber: 52, symbol: 'Te', nameKey: 'elements.Te', period: 5, destinationId: 'group-16' },
  { atomicNumber: 53, symbol: 'I', nameKey: 'elements.I', period: 5, destinationId: 'group-17' },
  { atomicNumber: 54, symbol: 'Xe', nameKey: 'elements.Xe', period: 5, destinationId: 'group-18' },
  { atomicNumber: 55, symbol: 'Cs', nameKey: 'elements.Cs', period: 6, destinationId: 'group-1' },
  { atomicNumber: 56, symbol: 'Ba', nameKey: 'elements.Ba', period: 6, destinationId: 'group-2' },
  { atomicNumber: 57, symbol: 'La', nameKey: 'elements.La', period: 6, destinationId: 'lanthanoids' },
  { atomicNumber: 58, symbol: 'Ce', nameKey: 'elements.Ce', period: 6, destinationId: 'lanthanoids' },
  { atomicNumber: 59, symbol: 'Pr', nameKey: 'elements.Pr', period: 6, destinationId: 'lanthanoids' },
  { atomicNumber: 60, symbol: 'Nd', nameKey: 'elements.Nd', period: 6, destinationId: 'lanthanoids' },
  { atomicNumber: 61, symbol: 'Pm', nameKey: 'elements.Pm', period: 6, destinationId: 'lanthanoids' },
  { atomicNumber: 62, symbol: 'Sm', nameKey: 'elements.Sm', period: 6, destinationId: 'lanthanoids' },
  { atomicNumber: 63, symbol: 'Eu', nameKey: 'elements.Eu', period: 6, destinationId: 'lanthanoids' },
  { atomicNumber: 64, symbol: 'Gd', nameKey: 'elements.Gd', period: 6, destinationId: 'lanthanoids' },
  { atomicNumber: 65, symbol: 'Tb', nameKey: 'elements.Tb', period: 6, destinationId: 'lanthanoids' },
  { atomicNumber: 66, symbol: 'Dy', nameKey: 'elements.Dy', period: 6, destinationId: 'lanthanoids' },
  { atomicNumber: 67, symbol: 'Ho', nameKey: 'elements.Ho', period: 6, destinationId: 'lanthanoids' },
  { atomicNumber: 68, symbol: 'Er', nameKey: 'elements.Er', period: 6, destinationId: 'lanthanoids' },
  { atomicNumber: 69, symbol: 'Tm', nameKey: 'elements.Tm', period: 6, destinationId: 'lanthanoids' },
  { atomicNumber: 70, symbol: 'Yb', nameKey: 'elements.Yb', period: 6, destinationId: 'lanthanoids' },
  { atomicNumber: 71, symbol: 'Lu', nameKey: 'elements.Lu', period: 6, destinationId: 'lanthanoids' },
  { atomicNumber: 72, symbol: 'Hf', nameKey: 'elements.Hf', period: 6, destinationId: 'group-4' },
  { atomicNumber: 73, symbol: 'Ta', nameKey: 'elements.Ta', period: 6, destinationId: 'group-5' },
  { atomicNumber: 74, symbol: 'W', nameKey: 'elements.W', period: 6, destinationId: 'group-6' },
  { atomicNumber: 75, symbol: 'Re', nameKey: 'elements.Re', period: 6, destinationId: 'group-7' },
  { atomicNumber: 76, symbol: 'Os', nameKey: 'elements.Os', period: 6, destinationId: 'group-8' },
  { atomicNumber: 77, symbol: 'Ir', nameKey: 'elements.Ir', period: 6, destinationId: 'group-9' },
  { atomicNumber: 78, symbol: 'Pt', nameKey: 'elements.Pt', period: 6, destinationId: 'group-10' },
  { atomicNumber: 79, symbol: 'Au', nameKey: 'elements.Au', period: 6, destinationId: 'group-11' },
  { atomicNumber: 80, symbol: 'Hg', nameKey: 'elements.Hg', period: 6, destinationId: 'group-12' },
  { atomicNumber: 81, symbol: 'Tl', nameKey: 'elements.Tl', period: 6, destinationId: 'group-13' },
  { atomicNumber: 82, symbol: 'Pb', nameKey: 'elements.Pb', period: 6, destinationId: 'group-14' },
  { atomicNumber: 83, symbol: 'Bi', nameKey: 'elements.Bi', period: 6, destinationId: 'group-15' },
  { atomicNumber: 84, symbol: 'Po', nameKey: 'elements.Po', period: 6, destinationId: 'group-16' },
  { atomicNumber: 85, symbol: 'At', nameKey: 'elements.At', period: 6, destinationId: 'group-17' },
  { atomicNumber: 86, symbol: 'Rn', nameKey: 'elements.Rn', period: 6, destinationId: 'group-18' },
  { atomicNumber: 87, symbol: 'Fr', nameKey: 'elements.Fr', period: 7, destinationId: 'group-1' },
  { atomicNumber: 88, symbol: 'Ra', nameKey: 'elements.Ra', period: 7, destinationId: 'group-2' },
  { atomicNumber: 89, symbol: 'Ac', nameKey: 'elements.Ac', period: 7, destinationId: 'actinoids' },
  { atomicNumber: 90, symbol: 'Th', nameKey: 'elements.Th', period: 7, destinationId: 'actinoids' },
  { atomicNumber: 91, symbol: 'Pa', nameKey: 'elements.Pa', period: 7, destinationId: 'actinoids' },
  { atomicNumber: 92, symbol: 'U', nameKey: 'elements.U', period: 7, destinationId: 'actinoids' },
  { atomicNumber: 93, symbol: 'Np', nameKey: 'elements.Np', period: 7, destinationId: 'actinoids' },
  { atomicNumber: 94, symbol: 'Pu', nameKey: 'elements.Pu', period: 7, destinationId: 'actinoids' },
  { atomicNumber: 95, symbol: 'Am', nameKey: 'elements.Am', period: 7, destinationId: 'actinoids' },
  { atomicNumber: 96, symbol: 'Cm', nameKey: 'elements.Cm', period: 7, destinationId: 'actinoids' },
  { atomicNumber: 97, symbol: 'Bk', nameKey: 'elements.Bk', period: 7, destinationId: 'actinoids' },
  { atomicNumber: 98, symbol: 'Cf', nameKey: 'elements.Cf', period: 7, destinationId: 'actinoids' },
  { atomicNumber: 99, symbol: 'Es', nameKey: 'elements.Es', period: 7, destinationId: 'actinoids' },
  { atomicNumber: 100, symbol: 'Fm', nameKey: 'elements.Fm', period: 7, destinationId: 'actinoids' },
  { atomicNumber: 101, symbol: 'Md', nameKey: 'elements.Md', period: 7, destinationId: 'actinoids' },
  { atomicNumber: 102, symbol: 'No', nameKey: 'elements.No', period: 7, destinationId: 'actinoids' },
  { atomicNumber: 103, symbol: 'Lr', nameKey: 'elements.Lr', period: 7, destinationId: 'actinoids' },
  { atomicNumber: 104, symbol: 'Rf', nameKey: 'elements.Rf', period: 7, destinationId: 'group-4' },
  { atomicNumber: 105, symbol: 'Db', nameKey: 'elements.Db', period: 7, destinationId: 'group-5' },
  { atomicNumber: 106, symbol: 'Sg', nameKey: 'elements.Sg', period: 7, destinationId: 'group-6' },
  { atomicNumber: 107, symbol: 'Bh', nameKey: 'elements.Bh', period: 7, destinationId: 'group-7' },
  { atomicNumber: 108, symbol: 'Hs', nameKey: 'elements.Hs', period: 7, destinationId: 'group-8' },
  { atomicNumber: 109, symbol: 'Mt', nameKey: 'elements.Mt', period: 7, destinationId: 'group-9' },
  { atomicNumber: 110, symbol: 'Ds', nameKey: 'elements.Ds', period: 7, destinationId: 'group-10' },
  { atomicNumber: 111, symbol: 'Rg', nameKey: 'elements.Rg', period: 7, destinationId: 'group-11' },
  { atomicNumber: 112, symbol: 'Cn', nameKey: 'elements.Cn', period: 7, destinationId: 'group-12' },
  { atomicNumber: 113, symbol: 'Nh', nameKey: 'elements.Nh', period: 7, destinationId: 'group-13' },
  { atomicNumber: 114, symbol: 'Fl', nameKey: 'elements.Fl', period: 7, destinationId: 'group-14' },
  { atomicNumber: 115, symbol: 'Mc', nameKey: 'elements.Mc', period: 7, destinationId: 'group-15' },
  { atomicNumber: 116, symbol: 'Lv', nameKey: 'elements.Lv', period: 7, destinationId: 'group-16' },
  { atomicNumber: 117, symbol: 'Ts', nameKey: 'elements.Ts', period: 7, destinationId: 'group-17' },
  { atomicNumber: 118, symbol: 'Og', nameKey: 'elements.Og', period: 7, destinationId: 'group-18' },
] as const satisfies readonly {
  atomicNumber: number; symbol: string; nameKey: `elements.${string}`;
  period: 1 | 2 | 3 | 4 | 5 | 6 | 7; destinationId: DestinationId;
}[];

export type CatalogueElement = typeof elementCatalogue[number];
export type ElementSymbol = CatalogueElement['symbol'];

/** Resolve a stable scientific identifier without translated names. */
export function getElement(atomicNumber: number): CatalogueElement {
  const element = elementCatalogue.find(item => item.atomicNumber === atomicNumber);
  if (!element) throw new RangeError(`Unknown atomic number: ${atomicNumber}`);
  return element;
}

/** Catalogue-order coverage for a future complete-selection round; shuffling is a game rule. */
export function elementsForDestinations(selection: readonly DestinationId[]): readonly CatalogueElement[] {
  if (selection.length < 2 || new Set(selection).size !== selection.length
    || selection.some(id => !destinations.some(destination => destination.id === id))) {
    throw new RangeError('Choose at least two distinct valid destinations');
  }
  return elementCatalogue.filter(element => selection.includes(element.destinationId));
}
