// In-browser store for the prototype: React context + reducer, persisted to localStorage.
// In the MVP this is replaced by a server API that enforces the same rules.
import { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react';
import { createDemoState } from './demoData';
import type { Assessment, DemoState, Role, Student } from './types';
import { scoreKey } from './types';

const STORAGE_KEY = 'gradebook-demo-v1';

export type Action =
  | { type: 'setRole'; role: Role }
  | { type: 'viewAsStudent'; studentId: string }
  | { type: 'setScore'; assessmentId: string; studentId: string; points: number | null; comment: string }
  | { type: 'release'; assessmentId: string }
  | { type: 'setAutoRelease'; classId: string; value: boolean }
  | { type: 'addAssessment'; assessment: Omit<Assessment, 'id' | 'createdAt' | 'releasedAt'> }
  | { type: 'addStudents'; classId: string; students: Omit<Student, 'id' | 'status'>[] }
  | { type: 'markSeen'; studentId: string; assessmentIds: string[] }
  | { type: 'reset' };

const now = () => new Date().toISOString();
const newId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

export function reducer(state: DemoState, action: Action): DemoState {
  switch (action.type) {
    case 'setRole':
      return { ...state, role: action.role };
    case 'viewAsStudent':
      return { ...state, viewAsStudentId: action.studentId };
    case 'setScore': {
      const assessment = state.assessments.find((a) => a.id === action.assessmentId);
      if (!assessment) return state;
      const cls = state.classes.find((c) => c.id === assessment.classId);
      const key = scoreKey(action.assessmentId, action.studentId);
      const prev = state.scores[key];
      if (prev && prev.points === action.points && prev.comment === action.comment) return state;
      if (!prev && action.points === null && action.comment === '') return state;
      const t = now();
      // ADR-005: auto-release classes release an assessment as soon as scores are saved.
      const releasedAt = assessment.releasedAt ?? (cls?.autoRelease ? t : null);
      const assessments =
        releasedAt === assessment.releasedAt
          ? state.assessments
          : state.assessments.map((a) => (a.id === assessment.id ? { ...a, releasedAt } : a));
      return {
        ...state,
        assessments,
        scores: {
          ...state.scores,
          [key]: {
            assessmentId: action.assessmentId,
            studentId: action.studentId,
            points: action.points,
            comment: action.comment,
            updatedAt: t,
            // ADR-006: changes after release are marked "Updated" for the student.
            updatedAfterReleaseAt: assessment.releasedAt ? t : (prev?.updatedAfterReleaseAt ?? null),
          },
        },
      };
    }
    case 'release':
      return {
        ...state,
        assessments: state.assessments.map((a) =>
          a.id === action.assessmentId && !a.releasedAt ? { ...a, releasedAt: now() } : a,
        ),
      };
    case 'setAutoRelease':
      return {
        ...state,
        classes: state.classes.map((c) => (c.id === action.classId ? { ...c, autoRelease: action.value } : c)),
      };
    case 'addAssessment':
      return {
        ...state,
        assessments: [
          ...state.assessments,
          { ...action.assessment, id: newId('a'), createdAt: now(), releasedAt: null },
        ],
      };
    case 'addStudents': {
      const created: Student[] = action.students.map((s) => ({ ...s, id: newId('s'), status: 'invited' }));
      return {
        ...state,
        students: [...state.students, ...created],
        classes: state.classes.map((c) =>
          c.id === action.classId ? { ...c, studentIds: [...c.studentIds, ...created.map((s) => s.id)] } : c,
        ),
      };
    }
    case 'markSeen': {
      const t = now();
      const mine = { ...(state.seen[action.studentId] ?? {}) };
      for (const id of action.assessmentIds) mine[id] = t;
      return { ...state, seen: { ...state.seen, [action.studentId]: mine } };
    }
    case 'reset':
      return createDemoState();
  }
}

function load(): DemoState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DemoState;
      if (parsed.version === 1) return parsed;
    }
  } catch {
    // Corrupt or unavailable storage: fall back to fresh demo data.
  }
  return createDemoState();
}

const StoreContext = createContext<{ state: DemoState; dispatch: (a: Action) => void } | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage full or blocked; the demo still works for this session.
    }
  }, [state]);
  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
