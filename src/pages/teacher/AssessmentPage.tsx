import { useState } from 'react';
import { Button, FieldError, Input, Label, TextArea, TextField } from 'react-aria-components';
import { Link, useParams } from 'react-router';
import { Badge, PageHeading, Status, usePageTitle } from '../../components/common';
import { classStudents, formatDate, fullName, getClass } from '../../data/selectors';
import { useStore } from '../../data/store';
import { scoreKey, type Assessment, type Score, type Student } from '../../data/types';
import { getTemplate } from '../../grading/templates';
import { NotFound } from '../NotFound';

export function AssessmentPage() {
  const { classId = '', assessmentId = '' } = useParams();
  const { state, dispatch } = useStore();
  const [status, setStatus] = useState('');
  const cls = getClass(state, classId);
  const assessment = state.assessments.find((a) => a.id === assessmentId && a.classId === classId);
  usePageTitle(assessment?.title ?? 'Assessment');
  if (!cls || !assessment) return <NotFound />;

  const category = getTemplate(cls.schemeId).categories.find((c) => c.id === assessment.categoryId);
  const students = classStudents(state, cls);

  return (
    <>
      <p className="breadcrumb">
        <Link to={`/teacher/classes/${cls.id}`}>
          ← {cls.subject} – {cls.section}
        </Link>
      </p>
      <PageHeading sub={`${category?.name ?? ''} · ${assessment.maxPoints} points`}>{assessment.title}</PageHeading>

      <div className="release-box">
        {assessment.releasedAt ? (
          <p>
            <Badge tone="released">Released {formatDate(assessment.releasedAt)}</Badge> Students can see these scores.
            If you change a score now, the student sees an "Updated" marker.
          </p>
        ) : (
          <>
            <p>
              <Badge tone="draft">Draft</Badge>{' '}
              {cls.autoRelease
                ? 'This class releases scores automatically, so saving a score releases this assessment.'
                : "Students can't see these scores until you release them."}
            </p>
            {!cls.autoRelease && (
              <Button
                className="react-aria-Button primary"
                onPress={() => {
                  dispatch({ type: 'release', assessmentId: assessment.id });
                  setStatus('Released to students.');
                }}
              >
                Release to students
              </Button>
            )}
          </>
        )}
      </div>
      <Status message={status} />

      <p className="muted small-text">Scores save when you leave a field. Comments are optional and released with the score.</p>
      <ul className="score-list">
        {students.map((s) => (
          <ScoreRow
            key={s.id}
            assessment={assessment}
            student={s}
            score={state.scores[scoreKey(assessment.id, s.id)]}
            onSave={(points, comment) => {
              dispatch({ type: 'setScore', assessmentId: assessment.id, studentId: s.id, points, comment });
              setStatus(`Saved for ${fullName(s)}.`);
            }}
          />
        ))}
      </ul>
    </>
  );
}

function ScoreRow({
  assessment,
  student,
  score,
  onSave,
}: {
  assessment: Assessment;
  student: Student;
  score: Score | undefined;
  onSave: (points: number | null, comment: string) => void;
}) {
  const [points, setPoints] = useState(score?.points?.toString() ?? '');
  const [comment, setComment] = useState(score?.comment ?? '');
  const parsed = points.trim() === '' ? null : Number(points);
  const error =
    parsed !== null && (!Number.isFinite(parsed) || parsed < 0 || parsed > assessment.maxPoints)
      ? `Enter a number from 0 to ${assessment.maxPoints}`
      : undefined;

  const commit = () => {
    if (error) return;
    const changed = parsed !== (score?.points ?? null) || comment.trim() !== (score?.comment ?? '');
    if (changed) onSave(parsed, comment.trim());
  };

  return (
    <li>
      <fieldset className="score-row">
        <legend>
          {fullName(student)}
          {score?.updatedAfterReleaseAt && (
            <>
              {' '}
              <Badge tone="updated">Updated {formatDate(score.updatedAfterReleaseAt)}</Badge>
            </>
          )}
        </legend>
        <TextField
          value={points}
          onChange={setPoints}
          onBlur={commit}
          inputMode="decimal"
          isInvalid={Boolean(error)}
          className="react-aria-TextField score-field"
        >
          <Label>Score (out of {assessment.maxPoints})</Label>
          <Input />
          <FieldError>{error}</FieldError>
        </TextField>
        <TextField value={comment} onChange={setComment} onBlur={commit} className="react-aria-TextField comment-field">
          <Label>Comment for student (optional)</Label>
          <TextArea rows={2} />
        </TextField>
      </fieldset>
    </li>
  );
}
