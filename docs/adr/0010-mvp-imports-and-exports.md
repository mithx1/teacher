# ADR-010: MVP supports roster import (CSV or paste from a spreadsheet) and CSV grade export

* Status: Accepted
* Date: 2026-11-21

## Context and problem

Teachers need to get rosters in without retyping them, and to get grades out. The app isn't the school's official record ([ADR-006](0006-grade-corrections-audit-history-and-locking.md)), so final grades are transcribed into school systems or spreadsheets. Export also supports data portability, which is believed to be a data-subject right under the Data Privacy Act (to verify in legal review).

## Decision drivers

* Remove manual roster entry
* Get grades out into existing school workflows
* Data portability, so data isn't locked in
* Small scope; no unknown school formats

## Options considered

1. None
2. Roster import plus CSV grade export
3. Option 2 plus score import
4. Option 2 plus export in the school's class-record format

## Decision

Option 2:

* **Roster import:** upload a CSV **or paste rows copied from Excel or Google Sheets** (name, email). A **preview with row-by-row validation** (missing fields, invalid or duplicate emails, students already on the roster) appears before saving. Nothing is written until the teacher confirms. Import creates roster entries and queues invites (ADR-007).
* **Grade export:** per-class CSV of assessment scores, category subtotals and grading-period grades, encoded as UTF-8 so names like "Peña" survive. Exports are recorded in the history.
* **CSV safety:** escape values beginning with `=`, `+`, `-`, `@`, tab or carriage return to prevent formula injection when the file is opened in spreadsheets.

## Rationale

Covers both core needs at low cost. Pasting matches how teachers keep lists. Validating before saving prevents corrupted rosters.

Deferred: score import (Option 3) and export in the school's format (Option 4), pending real grade-sheet samples from the partner teacher.

## Consequences

* Import parsing and validation run on the server. Limits on size and row count.
* An export is a disclosure of sensitive data. Only the class's teacher can export it, and each export is recorded.
* No file storage needed: imports are parsed and discarded, and exports are generated on demand.

## Risks and mitigations

* **Encoding problems (Excel and UTF-8, Filipino names with ñ):** use a UTF-8 BOM for Excel compatibility and test with real names.
* **Exported files leaking from teacher devices:** outside our control. Warn in the UI that the file contains student data.

## Follow-up actions

* Collect sample grade sheets to evaluate Options 3 and 4 after the MVP.
* Legal review: confirm data-portability obligations.

## Sources

None. This is a product decision. The data-portability right is an unverified assumption.
