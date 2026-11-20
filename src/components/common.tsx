import { useEffect, type ReactNode } from 'react';
import { NavLink } from 'react-router';

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `${title} · Gradebook prototype`;
  }, [title]);
}

export function PageHeading({ children, sub }: { children: ReactNode; sub?: ReactNode }) {
  return (
    <div className="page-heading">
      <h1 tabIndex={-1}>{children}</h1>
      {sub && <p className="muted">{sub}</p>}
    </div>
  );
}

export function Badge({ tone, children }: { tone: 'new' | 'updated' | 'draft' | 'released' | 'warn'; children: ReactNode }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export function ClassNav({ classId }: { classId: string }) {
  const base = `/teacher/classes/${classId}`;
  return (
    <nav aria-label="Class sections" className="subnav">
      <NavLink to={base} end>
        Gradebook
      </NavLink>
      <NavLink to={`${base}/roster`}>Roster</NavLink>
      <NavLink to={`${base}/scheme`}>Grading scheme</NavLink>
    </nav>
  );
}

export function PeriodSelect({
  periods,
  value,
  onChange,
  id,
}: {
  periods: { id: string; name: string }[];
  value: string;
  onChange: (id: string) => void;
  id: string;
}) {
  return (
    <div className="field-inline">
      <label htmlFor={id}>Grading period</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        {periods.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
    </div>
  );
}

/** Polite live region for status messages like "Saved". */
export function Status({ message }: { message: string }) {
  return (
    <p className="status" role="status" aria-live="polite">
      {message}
    </p>
  );
}
