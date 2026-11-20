import { describe, expect, it } from 'vitest';
import { parseRoster } from './rosterImport';

describe('parseRoster', () => {
  it('parses tab-separated rows pasted from a spreadsheet, skipping the header', () => {
    const rows = parseRoster('First\tLast\tEmail\nJuan\tDela Cruz\tjuan@example.com\nIsabel\tPeña\tisabel@example.com', []);
    expect(rows).toHaveLength(2);
    expect(rows[1]).toMatchObject({ firstName: 'Isabel', lastName: 'Peña', email: 'isabel@example.com', errors: [] });
  });

  it('parses "Last, First" names in two-column CSV', () => {
    const [row] = parseRoster('"Dela Cruz, Juan",juan@example.com', []);
    expect(row).toMatchObject({ firstName: 'Juan', lastName: 'Dela Cruz', errors: [] });
  });

  it('parses "First Last" names', () => {
    const [row] = parseRoster('Maria Clara Santos\tmaria@example.com', []);
    expect(row).toMatchObject({ firstName: 'Maria', lastName: 'Clara Santos' });
  });

  it('flags invalid, duplicate, existing and missing values per row', () => {
    const rows = parseRoster(
      ['Ana\tBautista\tana@example', 'Jose\tReyes\tjose@example.com', 'Jose\tReyes\tJOSE@example.com', 'Miguel\tGarcia\tmiguel@example.com', '\tRamos\tpaolo@example.com'].join('\n'),
      ['miguel@example.com'],
    );
    expect(rows.map((r) => r.errors)).toEqual([
      ['Email looks invalid'],
      [],
      ['Duplicate of row 2'],
      ['Already on this roster'],
      ['Missing first name'],
    ]);
  });

  it('ignores blank lines', () => {
    expect(parseRoster('\n\nJuan\tDela Cruz\tjuan@example.com\n\n', [])).toHaveLength(1);
  });
});
