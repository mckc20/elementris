import { describe, expect, it } from 'vitest';
import { destinations, elementCatalogue, elementsForDestinations, getElement, type DestinationId } from './catalogue';
import { firstLesson } from './lessons';
import en from '../locales/en/translation.json';
import de from '../locales/de/translation.json';

// Independent column-by-column transcription of the source tables, with full
// series taking precedence over group 3. This detects swaps that counts miss.
const expectedColumns = [
  'H Li Na K Rb Cs Fr', 'Be Mg Ca Sr Ba Ra', 'Sc Y',
  'Ti Zr Hf Rf', 'V Nb Ta Db', 'Cr Mo W Sg', 'Mn Tc Re Bh',
  'Fe Ru Os Hs', 'Co Rh Ir Mt', 'Ni Pd Pt Ds', 'Cu Ag Au Rg',
  'Zn Cd Hg Cn', 'B Al Ga In Tl Nh', 'C Si Ge Sn Pb Fl',
  'N P As Sb Bi Mc', 'O S Se Te Po Lv', 'F Cl Br I At Ts',
  'He Ne Ar Kr Xe Rn Og',
  'La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu',
  'Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr',
];

describe('whole-table catalogue', () => {
  it('covers atomic numbers 1–118 once, with unique symbols and complete names', () => {
    expect(elementCatalogue.map(element => element.atomicNumber)).toEqual(Array.from({ length: 118 }, (_, index) => index + 1));
    expect(new Set(elementCatalogue.map(element => element.symbol)).size).toBe(118);
    expect(Object.keys(en.elements).sort()).toEqual(elementCatalogue.map(element => element.symbol).sort());
    expect(Object.keys(de.elements).sort()).toEqual(Object.keys(en.elements).sort());
    for (const element of elementCatalogue) {
      expect(element.nameKey).toBe(`elements.${element.symbol}`);
      expect(en.elements[element.symbol].trim().length).toBeGreaterThan(0);
      expect(de.elements[element.symbol].trim().length).toBeGreaterThan(0);
    }
    expect(en.elements.Al).toBe('Aluminium');
    expect(en.elements.Cs).toBe('Caesium');
    expect(de.elements.Ts).toBe('Tenness');
    expect(getElement(118).symbol).toBe('Og');
    for (const invalid of [0, 119, 1.5, NaN]) expect(() => getElement(invalid)).toThrow(RangeError);
  });

  it('matches every group/series and period in the documented source convention', () => {
    expect(destinations).toHaveLength(20);
    expect(new Set(destinations.map(destination => destination.id)).size).toBe(20);
    expect(destinations.filter(destination => destination.kind === 'group').map(destination => destination.group)).toEqual(Array.from({ length: 18 }, (_, i) => i + 1));
    destinations.forEach((destination, index) => {
      expect(elementCatalogue.filter(element => element.destinationId === destination.id).map(element => element.symbol)).toEqual(expectedColumns[index].split(' '));
      expect(en.destinations[destination.id]).toBeTruthy();
      expect(de.destinations[destination.id]).toBeTruthy();
    });
    const periods = ['H He', 'Li Be B C N O F Ne', 'Na Mg Al Si P S Cl Ar',
      'K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr',
      'Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe',
      'Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn',
      'Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr Rf Db Sg Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og'];
    periods.forEach((symbols, index) => expect(elementCatalogue.filter(element => element.period === index + 1).map(element => element.symbol)).toEqual(symbols.split(' ')));
    expect(destinations.filter(destination => destination.kind === 'series').every(destination => !('group' in destination))).toBe(true);
  });

  it('provides exact, unique coverage for every possible two- or three-destination selection', () => {
    const reached = new Set<number>();
    for (let a = 0; a < destinations.length; a++) {
      for (let b = a + 1; b < destinations.length; b++) {
        const pair = [destinations[a].id, destinations[b].id];
        const selections = [pair, ...destinations.slice(b + 1).map(destination => [...pair, destination.id])];
        for (const selection of selections) {
          const elements = elementsForDestinations(selection);
          expect(elements.map(element => element.symbol).sort()).toEqual(selection.flatMap(id => expectedColumns[destinations.findIndex(destination => destination.id === id)].split(' ')).sort());
          expect(new Set(elements.map(element => element.atomicNumber)).size).toBe(elements.length);
          elements.forEach(element => reached.add(element.atomicNumber));
        }
      }
    }
    expect(reached.size).toBe(118);
  });

  it('supports larger selections through complete 118-element coverage', () => {
    for (let count = 4; count <= destinations.length; count++) {
      const selection = destinations.slice(0, count).map(destination => destination.id);
      const elements = elementsForDestinations(selection);
      expect(elements.map(element => element.symbol).sort()).toEqual(expectedColumns.slice(0, count).flatMap(column => column.split(' ')).sort());
      expect(new Set(elements.map(element => element.atomicNumber)).size).toBe(elements.length);
    }
    expect(elementsForDestinations(destinations.map(destination => destination.id))).toEqual(elementCatalogue);
  });

  it('rejects incomplete, duplicate or unknown destination selections', () => {
    for (const selection of [[], ['group-1'], ['group-1', 'group-1'], ['group-1', 'unknown']]) {
      expect(() => elementsForDestinations(selection as DestinationId[])).toThrow(RangeError);
    }
  });

  it('keeps the original six-element lesson order, identities and family memberships', () => {
    expect(firstLesson.elements.map(element => [element.atomicNumber, element.symbol, element.familyId])).toEqual([
      [3, 'Li', 'alkali'], [2, 'He', 'noble'], [11, 'Na', 'alkali'],
      [10, 'Ne', 'noble'], [19, 'K', 'alkali'], [18, 'Ar', 'noble'],
    ]);
    for (const element of firstLesson.elements) {
      expect(getElement(element.atomicNumber).destinationId).toBe(element.familyId === 'alkali' ? 'group-1' : 'group-18');
    }
  });
});
