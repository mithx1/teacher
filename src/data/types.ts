// Prototype data model. Mirrors the intended MVP entities (ADR-004–ADR-010),
// but lives only in the browser (ADR-013).

export type Role = 'teacher' | 'student';

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  /** invited = invite sent, not yet accepted (ADR-007). */
  status: 'active' | 'invited';
}

export interface GradingPeriod {
  id: string;
  name: string;
}

export interface ClassRoom {
  id: string;
  subject: string;
  section: string;
  schoolYear: string;
  schemeId: string;
  periods: GradingPeriod[];
  /** ADR-005: when on, scores are released to students as they are saved. */
  autoRelease: boolean;
  studentIds: string[];
}

export interface Assessment {
  id: string;
  classId: string;
  periodId: string;
  title: string;
  categoryId: string;
  maxPoints: number;
  createdAt: string;
  /** null = draft (not visible to students). */
  releasedAt: string | null;
}

export interface Score {
  assessmentId: string;
  studentId: string;
  points: number | null;
  comment: string;
  updatedAt: string;
  /** Set when a score/comment changes after release, which drives the "Updated" marker (ADR-006). */
  updatedAfterReleaseAt: string | null;
}

export interface DemoState {
  version: 1;
  role: Role;
  /** Which student the "student view" is showing. */
  viewAsStudentId: string;
  students: Student[];
  classes: ClassRoom[];
  assessments: Assessment[];
  /** Keyed by `${assessmentId}:${studentId}`. */
  scores: Record<string, Score>;
  /** seen[studentId][assessmentId] = ISO time the student last viewed it (ADR-009 indicators). */
  seen: Record<string, Record<string, string>>;
}

export const scoreKey = (assessmentId: string, studentId: string) => `${assessmentId}:${studentId}`;
