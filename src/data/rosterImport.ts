// Roster paste/CSV parsing with row-by-row validation (ADR-010).
// Accepts rows copied from Excel/Google Sheets (tab-separated) or simple CSV, in either
//   First name | Last name | Email      or      Full name | Email
// A header row (containing "email") is skipped.

export interface RosterRow {
  line: number;
  firstName: string;
  lastName: string;
  email: string;
  errors: string[];
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function splitLine(line: string): string[] {
  if (line.includes('\t')) return line.split('\t').map((c) => c.trim());
  // Simple CSV: supports "quoted, values" without escaped quotes.
  const cells: string[] = [];
  let current = '';
  let quoted = false;
  for (const ch of line) {
    if (ch === '"') quoted = !quoted;
    else if (ch === ',' && !quoted) {
      cells.push(current.trim());
      current = '';
    } else current += ch;
  }
  cells.push(current.trim());
  return cells;
}

export function parseRoster(text: string, existingEmails: string[]): RosterRow[] {
  const existing = new Set(existingEmails.map((e) => e.toLowerCase()));
  const seen = new Map<string, number>();
  const rows: RosterRow[] = [];

  text.split(/\r?\n/).forEach((raw, i) => {
    if (!raw.trim()) return;
    const cells = splitLine(raw);
    while (cells.length > 1 && cells[cells.length - 1] === '') cells.pop(); // trailing empty columns
    if (rows.length === 0 && cells.some((c) => /e-?mail/i.test(c))) return; // header row

    let firstName = '';
    let lastName = '';
    let email = '';
    if (cells.length >= 3) {
      [firstName, lastName, email] = cells;
    } else if (cells.length === 2) {
      const name = cells[0];
      email = cells[1];
      if (name.includes(',')) {
        // "Dela Cruz, Juan"
        const [last, first] = name.split(',').map((s) => s.trim());
        firstName = first ?? '';
        lastName = last ?? '';
      } else {
        const parts = name.split(/\s+/);
        firstName = parts.shift() ?? '';
        lastName = parts.join(' ');
      }
    } else {
      email = cells[0]?.includes('@') ? cells[0] : '';
      firstName = email ? '' : (cells[0] ?? '');
    }

    const errors: string[] = [];
    if (!firstName) errors.push('Missing first name');
    if (!lastName) errors.push('Missing last name');
    if (!email) errors.push('Missing email');
    else if (!EMAIL.test(email)) errors.push('Email looks invalid');
    const lower = email.toLowerCase();
    if (email && existing.has(lower)) errors.push('Already on this roster');
    if (email && seen.has(lower)) errors.push(`Duplicate of row ${seen.get(lower)}`);
    if (email && !seen.has(lower)) seen.set(lower, i + 1);

    rows.push({ line: i + 1, firstName, lastName, email, errors });
  });
  return rows;
}
