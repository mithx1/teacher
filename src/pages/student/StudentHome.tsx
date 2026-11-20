import { Link } from 'react-router';
import { Badge, PageHeading, usePageTitle } from '../../components/common';
import { currentPeriodId, studentClasses, studentClassView } from '../../data/selectors';
import { useStore } from '../../data/store';

export function StudentHome() {
  usePageTitle('My grades');
  const { state } = useStore();
  const student = state.students.find((s) => s.id === state.viewAsStudentId);
  if (!student) return <PageHeading>Choose a student</PageHeading>;
  const classes = studentClasses(state, student.id);

  return (
    <>
      <PageHeading sub="Your released grades and feedback">Hi, {student.firstName}!</PageHeading>
      {classes.length === 0 && <p>You're not in any classes yet.</p>}
      <ul className="cards">
        {classes.map((cls) => {
          const periodId = currentPeriodId(state, cls);
          const view = studentClassView(state, student.id, cls, periodId);
          const period = cls.periods.find((p) => p.id === periodId)?.name;
          return (
            <li key={cls.id} className="card">
              <h2>
                <Link to={`/student/classes/${cls.id}`}>
                  {cls.subject} – {cls.section}
                </Link>
              </h2>
              {view.breakdown.grade === null ? (
                <p>No grades released yet.</p>
              ) : (
                <p className="grade-line">
                  {period} so far: <strong className="grade-inline">{view.breakdown.grade}</strong>{' '}
                  <span className="muted">({view.breakdown.descriptor})</span>
                </p>
              )}
              <p className="muted small-text">
                Based on {view.releasedCount} of {view.totalCount} assessments
              </p>
              {view.newCount > 0 && <Badge tone="new">{view.newCount} new</Badge>}
            </li>
          );
        })}
      </ul>
    </>
  );
}
