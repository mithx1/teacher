import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTrigger,
  FieldError,
  Form,
  Heading,
  Input,
  Label,
  Modal,
  Switch,
  TextField,
} from 'react-aria-components';
import { Link, useParams } from 'react-router';
import { Badge, ClassNav, PageHeading, PeriodSelect, Status, usePageTitle } from '../../components/common';
import { classStudents, currentPeriodId, formatDate, getClass, periodAssessments, teacherPeriodGrade } from '../../data/selectors';
import { useStore } from '../../data/store';
import { scoreKey } from '../../data/types';
import { getTemplate } from '../../grading/templates';
import { NotFound } from '../NotFound';

export function ClassPage() {
  const { classId = '' } = useParams();
  const { state, dispatch } = useStore();
  const cls = getClass(state, classId);
  const [periodId, setPeriodId] = useState(() => (cls ? currentPeriodId(state, cls) : 'q1'));
  const [status, setStatus] = useState('');
  usePageTitle(cls ? `${cls.subject} – ${cls.section}` : 'Class');
  if (!cls) return <NotFound />;

  const scheme = getTemplate(cls.schemeId);
  const assessments = periodAssessments(state, cls.id, periodId);
  const students = classStudents(state, cls);
  const periodName = cls.periods.find((p) => p.id === periodId)?.name ?? '';

  return (
    <>
      <PageHeading sub={`${cls.schoolYear} · ${students.length} students`}>
        {cls.subject} – {cls.section}
      </PageHeading>
      <ClassNav classId={cls.id} />

      <div className="toolbar">
        <PeriodSelect id="period" periods={cls.periods} value={periodId} onChange={setPeriodId} />
        <Switch
          isSelected={cls.autoRelease}
          onChange={(value) => {
            dispatch({ type: 'setAutoRelease', classId: cls.id, value });
            setStatus(value ? 'Automatic release is on.' : 'Automatic release is off.');
          }}
        >
          <div className="indicator" aria-hidden="true" />
          Release scores to students automatically
        </Switch>
      </div>
      <p className="muted small-text">
        {cls.autoRelease
          ? 'Scores become visible to students as soon as you save them.'
          : 'Scores stay as drafts until you release each assessment.'}
      </p>
      <Status message={status} />

      <section aria-labelledby="assessments-h">
        <div className="section-head">
          <h2 id="assessments-h">Assessments · {periodName}</h2>
          <AddAssessment
            categories={scheme.categories}
            onAdd={(title, categoryId, maxPoints) => {
              dispatch({ type: 'addAssessment', assessment: { classId: cls.id, periodId, title, categoryId, maxPoints } });
              setStatus(`Added "${title}" as a draft.`);
            }}
          />
        </div>
        {scheme.categories.map((cat) => {
          const list = assessments.filter((a) => a.categoryId === cat.id);
          return (
            <div key={cat.id} className="category-block">
              <h3>
                {cat.name} <span className="muted">({cat.weight}%)</span>
              </h3>
              {list.length === 0 ? (
                <p className="muted">No assessments yet.</p>
              ) : (
                <ul className="assessment-list">
                  {list.map((a) => {
                    const scored = students.filter((s) => state.scores[scoreKey(a.id, s.id)]?.points != null).length;
                    return (
                      <li key={a.id}>
                        <div>
                          <Link to={`/teacher/classes/${cls.id}/assessments/${a.id}`} className="assessment-title">
                            {a.title}
                          </Link>
                          <div className="muted small-text">
                            {a.maxPoints} points · {scored} of {students.length} scored
                          </div>
                        </div>
                        <div className="assessment-actions">
                          {a.releasedAt ? (
                            <Badge tone="released">Released {formatDate(a.releasedAt)}</Badge>
                          ) : (
                            <>
                              <Badge tone="draft">Draft</Badge>
                              <Button
                                className="react-aria-Button small"
                                onPress={() => {
                                  dispatch({ type: 'release', assessmentId: a.id });
                                  setStatus(`Released "${a.title}" to students.`);
                                }}
                              >
                                Release<span className="sr-only"> {a.title}</span>
                              </Button>
                            </>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </section>

      <section aria-labelledby="grades-h">
        <h2 id="grades-h">Grades so far · {periodName}</h2>
        <p className="muted small-text">Includes draft scores. Students only see released ones.</p>
        <div className="table-scroll" role="region" aria-labelledby="grades-h" tabIndex={0}>
          <table>
            <thead>
              <tr>
                <th scope="col">Student</th>
                {scheme.categories.map((c) => (
                  <th scope="col" key={c.id}>
                    {c.name}
                  </th>
                ))}
                <th scope="col">Grade</th>
                <th scope="col">Descriptor</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => {
                const g = teacherPeriodGrade(state, cls, periodId, s.id);
                return (
                  <tr key={s.id}>
                    <th scope="row">
                      {s.lastName}, {s.firstName}
                      {s.status === 'invited' && <span className="muted small-text"> (invited)</span>}
                    </th>
                    {g.categories.map((c) => (
                      <td key={c.categoryId}>{c.percentage === null ? '–' : `${c.percentage}%`}</td>
                    ))}
                    <td>
                      <strong>{g.grade ?? '–'}</strong>
                      {g.passed === false && <span className="sr-only"> (below passing)</span>}
                    </td>
                    <td>{g.descriptor ?? '–'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {students.length === 0 && <p>No students yet. Add them from the Roster tab.</p>}
      </section>
    </>
  );
}

function AddAssessment({
  categories,
  onAdd,
}: {
  categories: { id: string; name: string }[];
  onAdd: (title: string, categoryId: string, maxPoints: number) => void;
}) {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '');
  const [max, setMax] = useState('');
  const maxNumber = Number(max);
  const maxError = max !== '' && (!Number.isFinite(maxNumber) || maxNumber <= 0) ? 'Enter a number above 0' : undefined;

  return (
    <DialogTrigger>
      <Button className="react-aria-Button primary">Add assessment</Button>
      <Modal isDismissable>
        <Dialog>
          {({ close }) => (
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                if (!title.trim() || maxError || max === '') return;
                onAdd(title.trim(), categoryId, maxNumber);
                setTitle('');
                setMax('');
                close();
              }}
            >
              <Heading slot="title">Add assessment</Heading>
              <TextField isRequired value={title} onChange={setTitle} autoFocus>
                <Label>Title</Label>
                <Input />
                <FieldError />
              </TextField>
              <div className="field">
                <label htmlFor="new-category">Category</label>
                <select id="new-category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <TextField isRequired value={max} onChange={setMax} inputMode="decimal" isInvalid={Boolean(maxError)}>
                <Label>Maximum points</Label>
                <Input />
                <FieldError>{maxError}</FieldError>
              </TextField>
              <div className="dialog-actions">
                <Button className="react-aria-Button" onPress={close}>
                  Cancel
                </Button>
                <Button className="react-aria-Button primary" type="submit">
                  Add as draft
                </Button>
              </div>
            </Form>
          )}
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
}
