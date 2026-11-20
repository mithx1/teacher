import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { Badge, PageHeading, PeriodSelect, usePageTitle } from '../../components/common';
import { GradeExplanation } from '../../components/GradeExplanation';
import { currentPeriodId, formatDate, getClass, studentClassView } from '../../data/selectors';
import { useStore } from '../../data/store';
import { getTemplate } from '../../grading/templates';
import { NotFound } from '../NotFound';

export function StudentClassPage() {
  const { state } = useStore();
  // Re-mount per student so the "seen" snapshot is per student.
  return <StudentClass key={state.viewAsStudentId} studentId={state.viewAsStudentId} />;
}

function StudentClass({ studentId }: { studentId: string }) {
  const { classId = '' } = useParams();
  const { state, dispatch } = useStore();
  const cls = getClass(state, classId);
  const enrolled = cls?.studentIds.includes(studentId);
  // Snapshot of what was seen before this visit, so "New" badges stay visible while reading.
  const [seenBefore] = useState(() => state.seen[studentId] ?? {});
  const [periodId, setPeriodId] = useState(() => (cls ? currentPeriodId(state, cls) : 'q1'));
  usePageTitle(cls ? `${cls.subject} – ${cls.section}` : 'Class');

  const view = cls && enrolled ? studentClassView(state, studentId, cls, periodId, seenBefore) : null;
  const ids = view?.items.map((i) => i.assessment.id).join(',') ?? '';
  useEffect(() => {
    if (ids) dispatch({ type: 'markSeen', studentId, assessmentIds: ids.split(',') });
  }, [ids, studentId, dispatch]);

  if (!cls || !view) return <NotFound />;
  const scheme = getTemplate(cls.schemeId);
  const { breakdown } = view;
  const periodName = cls.periods.find((p) => p.id === periodId)?.name ?? '';
  const remaining = view.totalCount - view.releasedCount;

  return (
    <>
      <p className="breadcrumb">
        <Link to="/student">← My grades</Link>
      </p>
      <PageHeading>
        {cls.subject} – {cls.section}
      </PageHeading>
      <PeriodSelect id="student-period" periods={cls.periods} value={periodId} onChange={setPeriodId} />

      <section className="grade-card" aria-labelledby="sofar-h">
        <h2 id="sofar-h">{periodName} so far</h2>
        {breakdown.grade === null ? (
          <p>No grades released yet for {periodName}.</p>
        ) : (
          <>
            <p className="big-grade">
              <span className="sr-only">Grade so far: </span>
              {breakdown.grade}
            </p>
            <p>
              <strong>{breakdown.descriptor}</strong>
              {breakdown.passed === false && <> · below the passing grade of {scheme.passingGrade}</>}
            </p>
            <p className="muted">
              Based on {view.releasedCount} of {view.totalCount} assessments
              {remaining > 0 && <>. {remaining} more to come, so this can still change</>}.
            </p>
            <details>
              <summary>How is this calculated?</summary>
              <GradeExplanation breakdown={breakdown} scheme={scheme} />
            </details>
          </>
        )}
      </section>

      <section aria-labelledby="results-h">
        <h2 id="results-h">Results and feedback</h2>
        {view.items.length === 0 && <p>Nothing released yet.</p>}
        <ul className="result-list">
          {view.items.map(({ assessment, score, isNew, isUpdated }) => {
            const category = scheme.categories.find((c) => c.id === assessment.categoryId)?.name;
            return (
              <li key={assessment.id} className="result">
                <div className="result-head">
                  <h3>{assessment.title}</h3>
                  <div className="badges">
                    {isNew && <Badge tone="new">New</Badge>}
                    {isUpdated && score?.updatedAfterReleaseAt && (
                      <Badge tone="updated">Updated {formatDate(score.updatedAfterReleaseAt)}</Badge>
                    )}
                  </div>
                </div>
                <p className="muted small-text">
                  {category} · released {formatDate(assessment.releasedAt!)}
                </p>
                <p className="score">
                  {score?.points != null ? (
                    <>
                      <strong>{score.points}</strong> / {assessment.maxPoints}
                    </>
                  ) : (
                    <span className="muted">No score yet</span>
                  )}
                </p>
                {score?.comment && (
                  <blockquote className="comment">
                    <span className="sr-only">Teacher's comment: </span>
                    {score.comment}
                  </blockquote>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
