// Read models. The student selectors return ONLY released data, mirroring the
// server-side filtering the MVP API must enforce (ADR-005).
import { computePeriodGrade } from '../grading/engine';
import { getTemplate } from '../grading/templates';
import type { GradeBreakdown } from '../grading/types';
import type { Assessment, ClassRoom, DemoState, Score, Student } from './types';
import { scoreKey } from './types';

export const fullName = (s: Pick<Student, 'firstName' | 'lastName'>) => `${s.firstName} ${s.lastName}`;

export function getClass(state: DemoState, classId: string): ClassRoom | undefined {
  return state.classes.find((c) => c.id === classId);
}

export function classStudents(state: DemoState, cls: ClassRoom): Student[] {
  return cls.studentIds
    .map((id) => state.students.find((s) => s.id === id))
    .filter((s): s is Student => Boolean(s))
    .sort((a, b) => a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName));
}

export function periodAssessments(state: DemoState, classId: string, periodId: string): Assessment[] {
  return state.assessments
    .filter((a) => a.classId === classId && a.periodId === periodId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

function pointsFor(state: DemoState, assessments: Assessment[], studentId: string) {
  const out: Record<string, number | null> = {};
  for (const a of assessments) out[a.id] = state.scores[scoreKey(a.id, studentId)]?.points ?? null;
  return out;
}

/** Teacher view: includes drafts, so the teacher sees where grades are heading. */
export function teacherPeriodGrade(state: DemoState, cls: ClassRoom, periodId: string, studentId: string): GradeBreakdown {
  const list = periodAssessments(state, cls.id, periodId);
  return computePeriodGrade(getTemplate(cls.schemeId), list, pointsFor(state, list, studentId));
}

export interface StudentAssessmentView {
  assessment: Assessment;
  score: Score | undefined;
  isNew: boolean;
  isUpdated: boolean;
}

export interface StudentClassView {
  cls: ClassRoom;
  periodId: string;
  /** Released assessments only. */
  items: StudentAssessmentView[];
  breakdown: GradeBreakdown;
  /** N = released assessments; M = all assessments created for the period (ADR-005 proposal). */
  releasedCount: number;
  totalCount: number;
  newCount: number;
}

export function studentClassView(
  state: DemoState,
  studentId: string,
  cls: ClassRoom,
  periodId: string,
  seenSnapshot: Record<string, string> = state.seen[studentId] ?? {},
): StudentClassView {
  const all = periodAssessments(state, cls.id, periodId);
  const released = all.filter((a) => a.releasedAt !== null);
  const items = released
    .map((assessment) => {
      const score = state.scores[scoreKey(assessment.id, studentId)];
      const seenAt = seenSnapshot[assessment.id];
      const changedAt = score?.updatedAfterReleaseAt ?? assessment.releasedAt!;
      return {
        assessment,
        score,
        isNew: !seenAt || seenAt < changedAt,
        isUpdated: Boolean(score?.updatedAfterReleaseAt),
      };
    })
    .sort((a, b) => (b.assessment.releasedAt ?? '').localeCompare(a.assessment.releasedAt ?? ''));
  return {
    cls,
    periodId,
    items,
    breakdown: computePeriodGrade(getTemplate(cls.schemeId), released, pointsFor(state, released, studentId)),
    releasedCount: released.length,
    totalCount: all.length,
    newCount: items.filter((i) => i.isNew).length,
  };
}

export function studentClasses(state: DemoState, studentId: string): ClassRoom[] {
  return state.classes.filter((c) => c.studentIds.includes(studentId));
}

/** The period to show by default: the latest one that has any assessments. */
export function currentPeriodId(state: DemoState, cls: ClassRoom): string {
  const withData = cls.periods.filter((p) => state.assessments.some((a) => a.classId === cls.id && a.periodId === p.id));
  return (withData[withData.length - 1] ?? cls.periods[0]).id;
}

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
