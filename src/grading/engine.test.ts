import { describe as group, expect, it } from 'vitest';
import Big from 'big.js';
import { computePeriodGrade, transmute, validateScheme } from './engine';
import { getTemplate, TEMPLATES } from './templates';
import type { GradedAssessment } from './types';

const math = getTemplate('deped-jhs-math-sci'); // WW 40 / PT 40 / QA 20

const assessments: GradedAssessment[] = [
  { id: 'q1', title: 'Quiz 1', categoryId: 'ww', maxPoints: 20 },
  { id: 'q2', title: 'Quiz 2', categoryId: 'ww', maxPoints: 20 },
  { id: 'pt1', title: 'Task 1', categoryId: 'pt', maxPoints: 50 },
  { id: 'qa1', title: 'Quarterly exam', categoryId: 'qa', maxPoints: 50 },
];

group('templates', () => {
  it('all templates are valid', () => {
    for (const t of TEMPLATES) expect(validateScheme(t)).toEqual([]);
  });

  it('transmutation table covers 0–100 without gaps or overlaps', () => {
    const rows = [...math.transmutation!].sort((a, b) => a.min - b.min);
    expect(rows[0].min).toBe(0);
    expect(rows[rows.length - 1].max).toBe(100);
    for (let i = 1; i < rows.length; i++) {
      expect(new Big(rows[i - 1].max).plus(0.01).eq(rows[i].min)).toBe(true);
    }
  });
});

group('validateScheme', () => {
  it('rejects weights that do not total 100', () => {
    const bad = { ...math, categories: [{ id: 'a', name: 'A', weight: 30 }, { id: 'b', name: 'B', weight: 60 }] };
    expect(validateScheme(bad)).toContain('Category weights must total 100% (currently 90%).');
  });
});

group('transmute (DepEd-style placeholder table)', () => {
  const t = (n: number | string) => transmute(new Big(n), math.transmutation, 2);
  it.each([
    [100, 100],
    [99.99, 99],
    [98.4, 99],
    [98.39, 98],
    [85, 90],
    [60, 75],
    [59.99, 74],
    [56, 74],
    [3.99, 60],
    [0, 60],
  ])('initial %s → %s', (initial, expected) => {
    expect(t(initial)).toBe(expected);
  });

  it('rounds the initial grade half-up to 2 dp before looking up', () => {
    expect(t('59.995')).toBe(75); // rounds to 60.00
    expect(t('59.994')).toBe(74); // rounds to 59.99
  });
});

group('computePeriodGrade', () => {
  it('computes a full-quarter grade with all categories', () => {
    // WW 33/40 = 82.5% × 40 = 33; PT 45/50 = 90% × 40 = 36; QA 40/50 = 80% × 20 = 16 → 85.00 → 90
    const r = computePeriodGrade(math, assessments, { q1: 18, q2: 15, pt1: 45, qa1: 40 });
    expect(r.initialGrade).toBe('85.00');
    expect(r.grade).toBe(90);
    expect(r.descriptor).toBe('Outstanding');
    expect(r.passed).toBe(true);
    expect(r.reweighted).toBe(false);
    expect(r.countedAssessments).toBe(4);
    expect(r.categories.map((c) => c.weightedScore)).toEqual(['33.00', '36.00', '16.00']);
  });

  it('re-weights proportionally when a category has no data yet', () => {
    // QA missing: WW 82.5% × 50% = 41.25; PT 90% × 50% = 45 → 86.25 → 91
    const r = computePeriodGrade(math, assessments, { q1: 18, q2: 15, pt1: 45 });
    expect(r.reweighted).toBe(true);
    expect(r.categoriesWithoutData).toEqual(['Quarterly Assessment']);
    expect(r.categories[0].effectiveWeight).toBe('50');
    expect(r.initialGrade).toBe('86.25');
    expect(r.grade).toBe(91);
    expect(r.unscoredAssessments.map((a) => a.id)).toEqual(['qa1']);
  });

  it('returns no grade when nothing is scored', () => {
    const r = computePeriodGrade(math, assessments, {});
    expect(r.grade).toBeNull();
    expect(r.initialGrade).toBeNull();
    expect(r.countedAssessments).toBe(0);
  });

  it('uses exact decimal arithmetic (no floating-point drift)', () => {
    const tiny: GradedAssessment[] = [
      { id: 'a', title: 'A', categoryId: 'ww', maxPoints: 0.3 },
      { id: 'b', title: 'B', categoryId: 'ww', maxPoints: 0.3 },
    ];
    // 0.1 + 0.2 = 0.3 exactly; 0.3 / 0.6 = 50%
    const r = computePeriodGrade(math, tiny, { a: 0.1, b: 0.2 });
    expect(r.categories[0].earned).toBe('0.3');
    expect(r.categories[0].percentage).toBe('50.00');
  });

  it('rejects scores outside the allowed range', () => {
    expect(() => computePeriodGrade(math, assessments, { q1: 21 })).toThrow(/outside 0–20/);
  });

  it('fails a student below the passing grade', () => {
    const r = computePeriodGrade(math, assessments, { q1: 5, q2: 6, pt1: 20, qa1: 15 });
    // WW 11/40 = 27.5% × 40 = 11; PT 40% × 40 = 16; QA 30% × 20 = 6 → 33 → 60 + floor(33/4) = 68
    expect(r.initialGrade).toBe('33.00');
    expect(r.grade).toBe(68);
    expect(r.passed).toBe(false);
    expect(r.descriptor).toBe('Did Not Meet Expectations');
  });
});
