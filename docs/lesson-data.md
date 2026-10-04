# Scientific data and sources

## Whole-table catalogue (Phase 6)

Verified on 2026-10-04. `src/content/catalogue.ts` is the shared structured catalogue of atomic numbers 1–118, unique symbols, name translation keys, periods, and one game destination per element. Lesson definitions choose their elements from this catalogue and add lesson-specific family membership and references. English and German names remain in external locale JSON files. No atomic weights, reactivity claims, or reactions are encoded here.

### Sources and spelling

- [IUPAC periodic table, 4 May 2022](https://iupac.org/wp-content/uploads/2022/07/IUPAC_Periodic_Table-04May22_CRA.pdf): verified all English names, symbols, atomic numbers, column positions, and periods, including the two detached rows. Display names use initial capitals and IUPAC spellings Aluminium, Caesium, and Sulfur.
- [Hessian education ministry / IQB mathematical and scientific formula collection](https://kultus.hessen.de/sites/kultus.hessen.de/files/2024-09/n_mathematisch-naturwissenschaftliche_formelsammlung.pdf), printed page 71: visually verified all German names against the complete table. Use its spellings Cobalt, Zirconium, Niobium, Cäsium, Silicium, and Tenness. The earlier one-page lesson reference omits individual series members and is insufficient for the complete catalogue.
- [GDCh: Deutsche Nomenklatur der neuen Elemente](https://www.gdch.de/my/article/deutsche-nomenklatur-der-neuen-elemente-4064443): confirms Nihonium, Moscovium, Tenness, and Oganesson in German. English Tennessine and German Tenness intentionally differ.
- [IUPAC groups and collective names](https://iupac.org/what-we-do/periodic-table-of-elements/), sections 6–7: groups are numbered 1–18; the collective series endpoints are La–Lu and Ac–Lr. The group-3 alternatives are discussed separately.

### Game classification convention — implemented before game rules

There are 20 destinations: groups 1–18, Lanthanoids / Lanthanoide, and Actinoids / Actinoide. The full inclusive series La–Lu (57–71, period 6) and Ac–Lr (89–103, period 7) take precedence over any numbered group assignment. Series destinations have no group number. Therefore the **group-3 game destination contains only Sc and Y**. La, Lu, Ac, and Lr each go exclusively to their series. This is an explicit game convention based on the detached-row table, not a claim to settle the scientific group-3 debate or a classification of every series member as an f-block element.

Hydrogen belongs to group 1 and helium to group 18. Numbered destination labels are neutral “Group N” / “Gruppe N”; group 1 is not labelled “alkali metals,” and the catalogue does not imply identical properties for every member of a column, including superheavy elements. The existing alkali lesson continues to exclude hydrogen. Collection and placement teach membership; they do not represent chemical reactions.

`elementsForDestinations` accepts two to twenty distinct valid destinations and returns every assigned element once in catalogue order. The falling rules in `src/game/falling.ts` shuffle that coverage once per round and retry mistakes on the same element. This helper itself does not implement a round or change saved learning evidence. Tests check the complete source-derived columns and periods, all pairs/triples and larger selections through all 20 destinations, translation coverage, invalid selections, and compatibility with the six-element lesson.

## First lesson data

Verified on 2026-10-04 against the Royal Society of Chemistry. The individual element pages' fact boxes confirm names, symbols, atomic numbers, and groups. Source URLs also live with the structured elements in `src/content/lessons.ts`.

| Name | Symbol | Atomic number | Family | Group | Source |
| --- | --- | --- | --- | --- | --- |
| Lithium | Li | 3 | Alkali metals | 1 | [RSC: Lithium](https://periodic-table.rsc.org/element/3/lithium) |
| Sodium | Na | 11 | Alkali metals | 1 | [RSC: Sodium](https://periodic-table.rsc.org/element/11/sodium) |
| Potassium | K | 19 | Alkali metals | 1 | [RSC: Potassium](https://periodic-table.rsc.org/element/19/potassium) |
| Helium | He | 2 | Noble gases | 18 | [RSC: Helium](https://periodic-table.rsc.org/element/2/helium) |
| Neon | Ne | 10 | Noble gases | 18 | [RSC: Neon](https://periodic-table.rsc.org/element/10/neon) |
| Argon | Ar | 18 | Noble gases | 18 | [RSC: Argon](https://periodic-table.rsc.org/element/18/argon) |

RSC's [Main Group Chemistry](https://books.rsc.org/books/monograph/405/Main-Group-Chemistry) explicitly identifies group 1 as alkali metals and group 18 as noble gases. Its chapter titles list these six elements in their respective families. RSC's [periodic table teaching guide](https://edu.rsc.org/cpd/the-periodic-table/3010823.article) supports the descriptions of alkali metals as reactive metals and noble gases as unreactive gases. Some school resources use “group 0” for noble gases; Elementris uses the 1–18 numbering confirmed by the element fact boxes.

The table overview shows the seven main rows and omits the detached lanthanide/actinide rows. Group 1 is highlighted below hydrogen; group 18 is highlighted on the right. Hydrogen is not an alkali metal and remains neutral. This overview orients players to families; the lesson's collection slots do not represent exact periods or a chemical reaction.

## German terminology

Verified on 2026-10-04 against the Hessian education ministry's [Chemie Periodensystem](https://kultus.hessen.de/sites/kultus.hessen.de/files/2021-10/la-chemie-periodensystem.pdf). It confirms Lithium (Li, 3), Helium (He, 2), Natrium (Na, 11), Neon (Ne, 10), Kalium (K, 19), Argon (Ar, 18), Wasserstoff, and the family names Alkalimetalle/Edelgase. That source uses Roman main-group labels; Elementris retains the RSC-verified 1–18 numbering. Translations change prose and element names, while symbols, atomic numbers, memberships, and chemistry descriptions retain their existing meaning.

UI and lesson prose live in `src/locales/en/translation.json` and `src/locales/de/translation.json`; lesson data stores translation keys. German uses the grammatically inflected Alkalimetallen/Edelgasen in feedback, without changing family identifiers.
