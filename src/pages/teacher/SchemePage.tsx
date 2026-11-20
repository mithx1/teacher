import { useParams } from 'react-router';
import { ClassNav, PageHeading, usePageTitle } from '../../components/common';
import { getClass } from '../../data/selectors';
import { useStore } from '../../data/store';
import { getTemplate } from '../../grading/templates';
import { NotFound } from '../NotFound';

export function SchemePage() {
  const { classId = '' } = useParams();
  const { state } = useStore();
  const cls = getClass(state, classId);
  usePageTitle(cls ? `Grading scheme · ${cls.subject} – ${cls.section}` : 'Grading scheme');
  if (!cls) return <NotFound />;
  const scheme = getTemplate(cls.schemeId);

  return (
    <>
      <PageHeading sub={scheme.name}>
        {cls.subject} – {cls.section}
      </PageHeading>
      <ClassNav classId={cls.id} />

      {scheme.note && (
        <p className="warning" role="note">
          <strong>Placeholder:</strong> {scheme.note}
        </p>
      )}

      <section aria-labelledby="cat-h">
        <h2 id="cat-h">Categories and weights</h2>
        <div className="table-scroll" role="region" aria-labelledby="cat-h" tabIndex={0}>
          <table>
            <thead>
              <tr>
                <th scope="col">Category</th>
                <th scope="col">Weight</th>
              </tr>
            </thead>
            <tbody>
              {scheme.categories.map((c) => (
                <tr key={c.id}>
                  <th scope="row">{c.name}</th>
                  <td>{c.weight}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted small-text">Editing the scheme comes later. In the prototype the template is read-only.</p>
      </section>

      <section aria-labelledby="how-h">
        <h2 id="how-h">How a quarter grade is calculated</h2>
        <ol>
          <li>For each category, add up the points earned and divide by the points possible to get a percentage.</li>
          <li>Multiply each category's percentage by its weight and add them up. This gives the initial grade, rounded to {scheme.initialGradeDecimals} decimal places.</li>
          <li>Convert the initial grade with the transmutation table to get the report-card grade. Passing is {scheme.passingGrade}.</li>
          <li>During the quarter, categories with no released scores yet are left out, and the others are scaled up to 100%.</li>
        </ol>
      </section>

      <section aria-labelledby="desc-h">
        <h2 id="desc-h">Descriptors</h2>
        <ul>
          {[...scheme.descriptors]
            .sort((a, b) => b.min - a.min)
            .map((d, i, arr) => (
              <li key={d.label}>
                {d.label}: {i === 0 ? `${d.min}–100` : d.min === 0 ? `below ${arr[i - 1].min}` : `${d.min}–${arr[i - 1].min - 1}`}
              </li>
            ))}
        </ul>
      </section>

      {scheme.transmutation && (
        <details>
          <summary>Show transmutation table ({scheme.transmutation.length} rows)</summary>
          <div className="table-scroll" role="region" aria-label="Transmutation table" tabIndex={0}>
            <table>
              <thead>
                <tr>
                  <th scope="col">Initial grade</th>
                  <th scope="col">Report-card grade</th>
                </tr>
              </thead>
              <tbody>
                {scheme.transmutation.map((r) => (
                  <tr key={r.grade}>
                    <td>{r.min === r.max ? r.min.toFixed(2) : `${r.min.toFixed(2)}–${r.max.toFixed(2)}`}</td>
                    <td>{r.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </>
  );
}
