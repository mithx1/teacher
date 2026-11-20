// Grading scheme templates (ADR-004). Templates are data, not code paths.
//
// WARNING: The DepEd-style values below are UNVERIFIED PLACEHOLDERS based on our
// understanding of DepEd Order No. 8, s. 2015. They must be checked against the current
// DepEd order and real grade sheets before any real use (see ADR-003, ADR-004).
import Big from 'big.js';
import type { Descriptor, GradingScheme, TransmutationRow } from './types';

/**
 * Builds the DepEd-style transmutation table:
 * 100 → 100; 60.00–99.99 in 1.60 steps → 75–99; 0.00–59.99 in 4.00 steps → 60–74.
 */
function depEdStyleTransmutation(): TransmutationRow[] {
  const rows: TransmutationRow[] = [{ min: 100, max: 100, grade: 100 }];
  for (let g = 99; g >= 75; g--) {
    const min = new Big(60).plus(new Big(1.6).times(g - 75));
    rows.push({ min: Number(min.toFixed(2)), max: Number(min.plus(1.59).toFixed(2)), grade: g });
  }
  for (let g = 74; g >= 60; g--) {
    const min = new Big(4).times(g - 60);
    rows.push({ min: Number(min.toFixed(2)), max: Number(min.plus(3.99).toFixed(2)), grade: g });
  }
  return rows;
}

const depEdDescriptors: Descriptor[] = [
  { min: 90, label: 'Outstanding' },
  { min: 85, label: 'Very Satisfactory' },
  { min: 80, label: 'Satisfactory' },
  { min: 75, label: 'Fairly Satisfactory' },
  { min: 0, label: 'Did Not Meet Expectations' },
];

const placeholderNote =
  'DepEd-style placeholder values. Not yet verified against the current DepEd order. Check with a real grade sheet.';

function depEdStyle(id: string, name: string, ww: number, pt: number, qa: number): GradingScheme {
  return {
    id,
    name,
    note: placeholderNote,
    categories: [
      { id: 'ww', name: 'Written Work', weight: ww },
      { id: 'pt', name: 'Performance Tasks', weight: pt },
      { id: 'qa', name: 'Quarterly Assessment', weight: qa },
    ],
    transmutation: depEdStyleTransmutation(),
    passingGrade: 75,
    descriptors: depEdDescriptors,
    initialGradeDecimals: 2,
  };
}

export const TEMPLATES: GradingScheme[] = [
  depEdStyle('deped-jhs-math-sci', 'DepEd-style JHS: Math & Science', 40, 40, 20),
  depEdStyle('deped-jhs-lang', 'DepEd-style JHS: Languages, AP, EsP', 30, 50, 20),
  depEdStyle('deped-jhs-mapeh-tle', 'DepEd-style JHS: MAPEH, TLE', 20, 60, 20),
];

export function getTemplate(id: string): GradingScheme {
  const t = TEMPLATES.find((x) => x.id === id);
  if (!t) throw new Error(`Unknown grading scheme ${id}`);
  return t;
}
