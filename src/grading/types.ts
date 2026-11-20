// Framework-independent grading types (ADR-004). No React imports here.

export interface Category {
  id: string;
  name: string;
  /** Weight as a percentage, e.g. 40 for 40%. Weights in a scheme must total 100. */
  weight: number;
}

/** Maps an initial grade range (inclusive, 2 decimals) to a reported grade. */
export interface TransmutationRow {
  min: number;
  max: number;
  grade: number;
}

export interface Descriptor {
  /** Lowest reported grade that earns this descriptor. */
  min: number;
  label: string;
}

export interface GradingScheme {
  id: string;
  name: string;
  /** Shown to teachers, e.g. to flag unverified placeholder values. */
  note?: string;
  categories: Category[];
  /** Optional. If absent, the reported grade is the rounded initial grade. */
  transmutation?: TransmutationRow[];
  passingGrade: number;
  descriptors: Descriptor[];
  /** Decimal places the initial grade is rounded to before transmutation. */
  initialGradeDecimals: number;
}

export interface GradedAssessment {
  id: string;
  title: string;
  categoryId: string;
  maxPoints: number;
}

export interface CategoryResult {
  categoryId: string;
  name: string;
  /** Configured weight (percent). */
  weight: string;
  /** Weight actually applied after re-weighting (percent), or null if no data. */
  effectiveWeight: string | null;
  earned: string;
  possible: string;
  /** Percentage score for the category (0–100, 2 dp), or null if no data. */
  percentage: string | null;
  /** Contribution to the initial grade (2 dp), or null if no data. */
  weightedScore: string | null;
  assessmentsCounted: number;
}

export interface GradeBreakdown {
  categories: CategoryResult[];
  /** True when some categories had no data and the others were re-weighted to 100%. */
  reweighted: boolean;
  /** Names of categories with no counted assessments yet. */
  categoriesWithoutData: string[];
  /** Initial grade before transmutation (rounded per scheme), or null if nothing counted. */
  initialGrade: string | null;
  /** Reported grade after transmutation, or null if nothing counted. */
  grade: number | null;
  descriptor: string | null;
  passed: boolean | null;
  /** Assessments that had a score and were counted. */
  countedAssessments: number;
  /** Assessments provided that had no score for this student. */
  unscoredAssessments: GradedAssessment[];
}
