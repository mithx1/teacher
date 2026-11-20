import { useState } from 'react';
import { Button, Label, Text, TextArea, TextField } from 'react-aria-components';
import { useParams } from 'react-router';
import { Badge, ClassNav, PageHeading, Status, usePageTitle } from '../../components/common';
import { parseRoster, type RosterRow } from '../../data/rosterImport';
import { classStudents, getClass } from '../../data/selectors';
import { useStore } from '../../data/store';
import { NotFound } from '../NotFound';

const SAMPLE = `First name\tLast name\tEmail
Carlo\tVillanueva\tcarlo.villanueva@example.com
Bea\tAquino\tbea.aquino@example.com
Liza\tTorres\tliza.torres@example`;

export function RosterPage() {
  const { classId = '' } = useParams();
  const { state, dispatch } = useStore();
  const [text, setText] = useState('');
  const [preview, setPreview] = useState<RosterRow[] | null>(null);
  const [status, setStatus] = useState('');
  const cls = getClass(state, classId);
  usePageTitle(cls ? `Roster · ${cls.subject} – ${cls.section}` : 'Roster');
  if (!cls) return <NotFound />;

  const students = classStudents(state, cls);
  const valid = preview?.filter((r) => r.errors.length === 0) ?? [];
  const invalidCount = (preview?.length ?? 0) - valid.length;

  return (
    <>
      <PageHeading sub={`${students.length} students`}>
        {cls.subject} – {cls.section}
      </PageHeading>
      <ClassNav classId={cls.id} />

      <section aria-labelledby="roster-h">
        <h2 id="roster-h">Roster</h2>
        <div className="table-scroll" role="region" aria-labelledby="roster-h" tabIndex={0}>
          <table>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Account</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <th scope="row">
                    {s.lastName}, {s.firstName}
                  </th>
                  <td>{s.email}</td>
                  <td>{s.status === 'active' ? 'Active' : <Badge tone="draft">Invite sent</Badge>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="import-h">
        <h2 id="import-h">Add students from a spreadsheet</h2>
        <TextField value={text} onChange={(v) => { setText(v); setPreview(null); }} className="react-aria-TextField">
          <Label>Paste rows here</Label>
          <Text slot="description">
            Copy columns from Excel or Google Sheets: First name, Last name, Email (or Full name, Email). A header row is
            fine.
          </Text>
          <TextArea rows={6} spellCheck={false} />
        </TextField>
        <div className="button-row">
          <Button className="react-aria-Button primary" isDisabled={!text.trim()} onPress={() => setPreview(parseRoster(text, students.map((s) => s.email)))}>
            Preview
          </Button>
          <Button className="react-aria-Button" onPress={() => { setText(SAMPLE); setPreview(null); }}>
            Fill with sample rows
          </Button>
        </div>

        {preview && (
          <div className="preview">
            <h3 id="preview-h">Preview: nothing has been saved yet</h3>
            {preview.length === 0 ? (
              <p>No rows found.</p>
            ) : (
              <div className="table-scroll" role="region" aria-labelledby="preview-h" tabIndex={0}>
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Row</th>
                      <th scope="col">First name</th>
                      <th scope="col">Last name</th>
                      <th scope="col">Email</th>
                      <th scope="col">Check</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((r) => (
                      <tr key={r.line} className={r.errors.length ? 'row-error' : undefined}>
                        <td>{r.line}</td>
                        <td>{r.firstName || '–'}</td>
                        <td>{r.lastName || '–'}</td>
                        <td>{r.email || '–'}</td>
                        <td>{r.errors.length ? <span className="error-text">⚠ {r.errors.join('; ')}</span> : '✓ OK'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {invalidCount > 0 && (
              <p className="error-text">
                {invalidCount} {invalidCount === 1 ? 'row has' : 'rows have'} problems and won't be added. Fix them in
                the box above and preview again, or continue without them.
              </p>
            )}
            <Button
              className="react-aria-Button primary"
              isDisabled={valid.length === 0}
              onPress={() => {
                dispatch({
                  type: 'addStudents',
                  classId: cls.id,
                  students: valid.map(({ firstName, lastName, email }) => ({ firstName, lastName, email })),
                });
                setStatus(`Added ${valid.length} ${valid.length === 1 ? 'student' : 'students'}. In the real app, invite emails would be sent now.`);
                setText('');
                setPreview(null);
              }}
            >
              Add {valid.length} {valid.length === 1 ? 'student' : 'students'}
            </Button>
          </div>
        )}
        <Status message={status} />
      </section>
    </>
  );
}
