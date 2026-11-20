// Grade calculation engine (ADR-004, ADR-005).
// Pure functions, exact decimal arithmetic via big.js, no framework dependencies.
import Big from 'big.js';
import type {
  CategoryResult,
  GradeBreakdown,
  GradedAssessment,
  GradingScheme,
  TransmutationRow,
} from './types';

const HALF_UP = 1; // Big.roundHalfUp

const d = (n: number | string): Big => new Big(n);

/** Returns a list of human-readable problems with a scheme; empty if valid. */
export function validateScheme(scheme: GradingScheme): string[] {
  const errors: string[] = [];
  if (scheme.categories.length === 0) errors.push('Add at least one category.');
  const total = scheme.categories.reduce((sum, c) => sum.plus(d(c.weight)), d(0));
  if (!total.eq(100)) errors.push(`Category weights must total 100% (currently ${total.toString()}%).`);
  for (const c of scheme.categories) {
    if (c.weight <= 0) errors.push(`"${c.name}" must have a weight above 0%.`);
  }
  const ids = new Set(scheme.categories.map((c) => c.id));
  if (ids.size !== scheme.categories.length) errors.push('Category ids must be unique.');
  return errors;
}

export function transmute(initialGrade: Big, table: TransmutationRow[] | undefined, decimals: number): number {
  const rounded = initialGrade.round(decimals, HALF_UP);
  if (!table || table.length === 0) return Number(rounded.round(0, HALF_UP).toString());
  const row = table.find((r) => rounded.gte(d(r.min)) && rounded.lte(d(r.max)));
  if (!row) throw new Error(`No transmutation row covers initial grade ${rounded.toString()}`);
  return row.grade;
}

export function describe(grade: number, scheme: GradingScheme): string | null {
  const sorted = [...scheme.descriptors].sort((a, b) => b.min - a.min);
  return sorted.find((x) => grade >= x.min)?.label ?? null;
}

/**
 * Computes a grading-period grade for one student.
 *
 * @param assessments the assessments to consider (callers pass only released ones for student views)
 * @param scores points per assessment id for this student; missing/null = not scored yet (not counted)
 *
 * Categories with no counted assessments are excluded and the remaining weights are scaled
 * proportionally to 100% (ADR-005 proposal, to validate with the partner teacher).
 */
export function computePeriodGrade(
  scheme: GradingScheme,
  assessments: GradedAssessment[],
  scores: Record<string, number | null | undefined>,
): GradeBreakdown {
  const unscored: GradedAssessment[] = [];
  const perCategory = new Map<string, { earned: Big; possible: Big; count: number }>();
  for (const c of scheme.categories) perCategory.set(c.id, { earned: d(0), possible: d(0), count: 0 });

  for (const a of assessments) {
    const bucket = perCategory.get(a.categoryId);
    if (!bucket) throw new Error(`Assessment "${a.title}" uses unknown category ${a.categoryId}`);
    const points = scores[a.id];
    if (points === null || points === undefined) {
      unscored.push(a);
      continue;
    }
    if (points < 0 || points > a.maxPoints) {
      throw new Error(`Score ${points} for "${a.title}" is outside 0–${a.maxPoints}`);
    }
    bucket.earned = bucket.earned.plus(d(points));
    bucket.possible = bucket.possible.plus(d(a.maxPoints));
    bucket.count += 1;
  }

  const withData = scheme.categories.filter((c) => perCategory.get(c.id)!.possible.gt(0));
  const weightWithData = withData.reduce((s, c) => s.plus(d(c.weight)), d(0));
  const reweighted = withData.length > 0 && withData.length < scheme.categories.length;

  let initial = d(0);
  const categories: CategoryResult[] = scheme.categories.map((c) => {
    const b = perCategory.get(c.id)!;
    const base = {
      categoryId: c.id,
      name: c.name,
      weight: d(c.weight).toString(),
      earned: b.earned.toString(),
      possible: b.possible.toString(),
      assessmentsCounted: b.count,
    };
    if (b.possible.eq(0)) {
      return { ...base, effectiveWeight: null, percentage: null, weightedScore: null };
    }
    const percentage = b.earned.div(b.possible).times(100);
    const effectiveWeight = d(c.weight).div(weightWithData).times(100);
    const weighted = percentage.times(effectiveWeight).div(100);
    initial = initial.plus(weighted);
    return {
      ...base,
      effectiveWeight: effectiveWeight.round(2, HALF_UP).toString(),
      percentage: percentage.round(2, HALF_UP).toFixed(2),
      weightedScore: weighted.round(2, HALF_UP).toFixed(2),
    };
  });

  const counted = assessments.length - unscored.length;
  if (withData.length === 0) {
    return {
      categories,
      reweighted: false,
      categoriesWithoutData: scheme.categories.map((c) => c.name),
      initialGrade: null,
      grade: null,
      descriptor: null,
      passed: null,
      countedAssessments: 0,
      unscoredAssessments: unscored,
    };
  }

  const initialRounded = initial.round(scheme.initialGradeDecimals, HALF_UP);
  const grade = transmute(initial, scheme.transmutation, scheme.initialGradeDecimals);
  return {
    categories,
    reweighted,
    categoriesWithoutData: scheme.categories.filter((c) => !withData.includes(c)).map((c) => c.name),
    initialGrade: initialRounded.toFixed(scheme.initialGradeDecimals),
    grade,
    descriptor: describe(grade, scheme),
    passed: grade >= scheme.passingGrade,
    countedAssessments: counted,
    unscoredAssessments: unscored,
  };
}
