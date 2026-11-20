import { useEffect, useRef } from 'react';
import { Button, Label, Radio, RadioGroup } from 'react-aria-components';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { useStore } from '../data/store';
import { fullName } from '../data/selectors';
import type { Role } from '../data/types';

export function Layout() {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const role: Role = location.pathname.startsWith('/student') ? 'student' : 'teacher';
  const mainRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);

  // Move focus to the new page's heading on navigation, so screen-reader and keyboard users land in context.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    mainRef.current?.querySelector<HTMLElement>('h1')?.focus();
  }, [location.pathname]);

  const switchRole = (value: string) => {
    const next = value as Role;
    dispatch({ type: 'setRole', role: next });
    navigate(next === 'teacher' ? '/teacher' : '/student');
  };

  const reset = () => {
    if (window.confirm('Reset the demo? All changes you made will be lost.')) {
      dispatch({ type: 'reset' });
      navigate('/teacher');
    }
  };

  return (
    <>
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          mainRef.current?.focus();
        }}
      >
        Skip to content
      </a>
      <div className="demo-banner" role="note">
        <span>
          <strong>Demo with fake data.</strong> Don't enter real student information. Changes are saved only in this
          browser.
        </span>
        <Button className="react-aria-Button small" onPress={reset}>
          Reset demo
        </Button>
      </div>
      <header className="app-header">
        <p className="brand">
          Gradebook <span className="brand-tag">prototype</span>
        </p>
        <div className="view-controls">
          <RadioGroup value={role} onChange={switchRole} orientation="horizontal" className="role-switch">
            <Label>View as</Label>
            <div className="segmented">
              <Radio value="teacher">Teacher</Radio>
              <Radio value="student">Student</Radio>
            </div>
          </RadioGroup>
          {role === 'student' && (
            <label className="student-picker">
              <span>Student</span>
              <select
                value={state.viewAsStudentId}
                onChange={(e) => dispatch({ type: 'viewAsStudent', studentId: e.target.value })}
              >
                {state.students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {fullName(s)}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      </header>
      <main id="main" ref={mainRef} tabIndex={-1}>
        <Outlet />
      </main>
    </>
  );
}
