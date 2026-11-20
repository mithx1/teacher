# Architecture Decision Records

Lightweight MADR-style records. An ADR becomes Accepted only once the decision is confirmed. Superseded ADRs are kept, not deleted.

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| [ADR-001](0001-initial-customer-individual-teacher.md) | Initial customer is the individual teacher (self-serve), with a school-ready data model | Accepted | 2026-11-20 |
| [ADR-002](0002-mvp-roles-teacher-and-student.md) | MVP roles are teacher and student (high school); guardians come after the MVP | Accepted | 2026-11-20 |
| [ADR-003](0003-initial-market-philippines-private-high-schools.md) | Initial market is teachers at private/independent high schools in the Philippines | Accepted | 2026-11-20 |
| [ADR-004](0004-grading-model-configurable-weighted-categories.md) | Grading model uses configurable weighted categories, with DepEd-style templates as the default | Accepted | 2026-11-20 |
| [ADR-005](0005-grade-visibility-release-and-running-grades.md) | Grades are released per assessment, with optional automatic release; running quarter grades are shown with context | Accepted | 2026-11-20 |
| [ADR-006](0006-grade-corrections-audit-history-and-locking.md) | Grade changes keep a permanent history, released changes are marked "Updated", and quarters can be locked | Accepted | 2026-11-20 |
| [ADR-007](0007-student-onboarding-roster-invites.md) | Students join through teacher roster invites (personal email), with an optional join code that needs teacher approval | Accepted | 2026-11-20 |
| [ADR-008](0008-school-year-term-and-class-structure.md) | Configurable school year and term structure with JHS/SHS presets; classes can be copied between sections | Accepted | 2026-11-21 |
| [ADR-009](0009-feedback-and-in-app-notifications.md) | Text feedback on each score; in-app notifications only for the MVP | Accepted | 2026-11-21 |
| [ADR-010](0010-mvp-imports-and-exports.md) | MVP supports roster import (CSV or paste from a spreadsheet) and CSV grade export | Accepted | 2026-11-21 |
| [ADR-011](0011-frontend-framework.md) | Frontend framework (Solid 2.0 research) | Superseded by ADR-012 | 2026-11-21 |
| [ADR-012](0012-frontend-react-typescript.md) | Frontend is React with TypeScript | Accepted | 2026-11-21 |
| [ADR-013](0013-prototype-plan.md) | Clickable prototype with fake data, hosted as a static site | Accepted | 2026-11-21 |
