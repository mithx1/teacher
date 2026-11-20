// Fake sample data. All names and emails are invented; example.com is a reserved domain.
import type { Assessment, ClassRoom, DemoState, Score, Student } from './types';
import { scoreKey } from './types';

const students: Student[] = [
  ['s1', 'Juan', 'Dela Cruz'],
  ['s2', 'Maria', 'Santos'],
  ['s3', 'Jose', 'Reyes'],
  ['s4', 'Ana', 'Bautista'],
  ['s5', 'Miguel', 'Garcia'],
  ['s6', 'Sofia', 'Mendoza'],
  ['s7', 'Paolo', 'Ramos'],
  ['s8', 'Isabel', 'Peña'],
].map(([id, firstName, lastName], i) => ({
  id,
  firstName,
  lastName,
  email: `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/\s/g, '').replace('ñ', 'n')}@example.com`,
  status: i === 7 ? 'invited' : 'active',
}));

const periods = [1, 2, 3, 4].map((n) => ({ id: `q${n}`, name: `Quarter ${n}` }));

const classes: ClassRoom[] = [
  {
    id: 'math9-rizal',
    subject: 'Mathematics 9',
    section: 'Rizal',
    schoolYear: '2026–2027',
    schemeId: 'deped-jhs-math-sci',
    periods,
    autoRelease: false,
    studentIds: students.map((s) => s.id),
  },
  {
    id: 'eng9-rizal',
    subject: 'English 9',
    section: 'Rizal',
    schoolYear: '2026–2027',
    schemeId: 'deped-jhs-lang',
    periods,
    autoRelease: true,
    studentIds: students.map((s) => s.id),
  },
];

const day = (n: number) => new Date(Date.UTC(2026, 10, n, 1, 0, 0)).toISOString(); // November 2026

const assessments: Assessment[] = [
  // Mathematics 9 – Rizal, Quarter 1
  { id: 'm-quiz1', classId: 'math9-rizal', periodId: 'q1', title: 'Quiz 1: Quadratic equations', categoryId: 'ww', maxPoints: 20, createdAt: day(3), releasedAt: day(4) },
  { id: 'm-quiz2', classId: 'math9-rizal', periodId: 'q1', title: 'Quiz 2: Factoring', categoryId: 'ww', maxPoints: 20, createdAt: day(10), releasedAt: day(11) },
  { id: 'm-seat1', classId: 'math9-rizal', periodId: 'q1', title: 'Seatwork 1', categoryId: 'ww', maxPoints: 10, createdAt: day(17), releasedAt: null },
  { id: 'm-pt1', classId: 'math9-rizal', periodId: 'q1', title: 'Problem-solving task', categoryId: 'pt', maxPoints: 50, createdAt: day(12), releasedAt: day(18) },
  { id: 'm-pt2', classId: 'math9-rizal', periodId: 'q1', title: 'Group project: Parabolas around us', categoryId: 'pt', maxPoints: 50, createdAt: day(19), releasedAt: null },
  { id: 'm-qa', classId: 'math9-rizal', periodId: 'q1', title: 'Quarterly exam', categoryId: 'qa', maxPoints: 50, createdAt: day(19), releasedAt: null },
  // English 9 – Rizal, Quarter 1
  { id: 'e-ww1', classId: 'eng9-rizal', periodId: 'q1', title: 'Vocabulary quiz', categoryId: 'ww', maxPoints: 25, createdAt: day(5), releasedAt: day(5) },
  { id: 'e-pt1', classId: 'eng9-rizal', periodId: 'q1', title: 'Oral reading performance', categoryId: 'pt', maxPoints: 40, createdAt: day(13), releasedAt: day(13) },
];

// Deterministic "realistic" scores so the demo looks the same for everyone.
function fakePoints(studentIndex: number, a: Assessment): number {
  const base = [0.92, 0.85, 0.78, 0.88, 0.7, 0.95, 0.65, 0.82][studentIndex];
  const wobble = (((studentIndex + 3) * (a.id.length + 7)) % 9) / 100 - 0.04;
  return Math.max(0, Math.min(a.maxPoints, Math.round(a.maxPoints * (base + wobble))));
}

const scores: Record<string, Score> = {};
const scored = new Set(['m-quiz1', 'm-quiz2', 'm-seat1', 'm-pt1', 'e-ww1', 'e-pt1']);
for (const a of assessments) {
  if (!scored.has(a.id)) continue;
  students.forEach((s, i) => {
    if (s.status === 'invited' && a.id === 'm-seat1') return; // one missing score, for realism
    scores[scoreKey(a.id, s.id)] = {
      assessmentId: a.id,
      studentId: s.id,
      points: fakePoints(i, a),
      comment: '',
      updatedAt: a.releasedAt ?? a.createdAt,
      updatedAfterReleaseAt: null,
    };
  });
}

// Juan's story for the demo: comments, one post-release correction, one new result.
Object.assign(scores[scoreKey('m-quiz1', 's1')], {
  points: 16,
  comment: 'Re-checked item 7: your method was correct, so +1. Nice work!',
  updatedAt: day(15),
  updatedAfterReleaseAt: day(15),
});
Object.assign(scores[scoreKey('m-pt1', 's1')], {
  points: 46,
  comment: 'Clear solution steps. Next time, label the units in your final answer.',
});
Object.assign(scores[scoreKey('m-quiz2', 's1')], { points: 17 });

export function createDemoState(): DemoState {
  return {
    version: 1,
    role: 'teacher',
    viewAsStudentId: 's1',
    students: structuredClone(students),
    classes: structuredClone(classes),
    assessments: structuredClone(assessments),
    scores: structuredClone(scores),
    // Juan has seen Quiz 1 (before the correction) and Quiz 2, but not the task, so the demo shows "Updated" and "New".
    seen: { s1: { 'm-quiz1': day(4), 'm-quiz2': day(11), 'e-ww1': day(6), 'e-pt1': day(14) } },
  };
}
