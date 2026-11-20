// Smoke test: every route renders with the demo data without throwing,
// and the student view never shows draft assessments.
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { AppRoutes } from './App';
import { StoreProvider } from './data/store';

const render = (path: string) =>
  renderToString(
    <StoreProvider>
      <MemoryRouter initialEntries={[path]}>
        <AppRoutes />
      </MemoryRouter>
    </StoreProvider>,
  );

describe('routes render', () => {
  it.each([
    '/teacher',
    '/teacher/classes/math9-rizal',
    '/teacher/classes/math9-rizal/assessments/m-quiz1',
    '/teacher/classes/math9-rizal/roster',
    '/teacher/classes/math9-rizal/scheme',
    '/student',
    '/student/classes/math9-rizal',
    '/nope',
  ])('%s', (path) => {
    const html = render(path);
    expect(html).toContain('Demo with fake data');
    expect(html).toContain('<h1');
  });

  it('teacher gradebook shows drafts and grades', () => {
    const html = render('/teacher/classes/math9-rizal');
    expect(html).toContain('Seatwork 1');
    expect(html).toContain('Draft');
  });

  it('student view shows only released work, with "so far" context and markers', () => {
    const html = render('/student/classes/math9-rizal');
    expect(html).toContain('Quiz 1: Quadratic equations');
    expect(html).not.toContain('Seatwork 1');
    expect(html).not.toContain('Quarterly exam');
    expect(html).toContain('Based on <!-- -->3<!-- --> of <!-- -->6<!-- --> assessments');
    expect(html).toContain('Updated');
    expect(html).toContain('New');
    expect(html).toContain('Re-checked item 7');
  });
});
