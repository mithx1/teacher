import { Link } from 'react-router';
import { Badge, PageHeading, usePageTitle } from '../../components/common';
import { useStore } from '../../data/store';
import { getTemplate } from '../../grading/templates';

export function TeacherHome() {
  usePageTitle('My classes');
  const { state } = useStore();
  return (
    <>
      <PageHeading sub="School year 2026–2027">My classes</PageHeading>
      <ul className="cards">
        {state.classes.map((c) => {
          const drafts = state.assessments.filter((a) => a.classId === c.id && !a.releasedAt).length;
          return (
            <li key={c.id} className="card">
              <h2>
                <Link to={`/teacher/classes/${c.id}`}>
                  {c.subject} – {c.section}
                </Link>
              </h2>
              <p className="muted">
                {c.studentIds.length} students · {getTemplate(c.schemeId).name}
              </p>
              <p>
                {c.autoRelease ? 'Scores are released automatically' : 'You release scores per assessment'}
              </p>
              {drafts > 0 && (
                <p>
                  <Badge tone="warn">
                    {drafts} unreleased {drafts === 1 ? 'assessment' : 'assessments'}
                  </Badge>
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
