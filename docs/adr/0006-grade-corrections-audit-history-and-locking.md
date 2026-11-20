# ADR-006: Grade changes keep a permanent history, released changes are marked "Updated", and quarters can be locked

* Status: Accepted
* Date: 2026-11-20

## Context and problem

Grades are education data, likely sensitive personal information under the Philippine Data Privacy Act ([ADR-003](0003-initial-market-philippines-private-high-schools.md)). Students see released grades and edits to them right away ([ADR-005](0005-grade-visibility-release-and-running-grades.md)). We need a policy for changes to released grades that supports accountability, dispute resolution and security investigation without slowing teachers down. The app holds the teacher's working records, not the school's official record.

## Decision drivers

* Accountability and auditability for sensitive data
* Transparency to students when a visible grade changes
* Protecting finished grading periods from accidental edits
* Little extra work for teachers
* No second approver available in the MVP

## Options considered

1. Simple edits with no history
2. Change history visible only to the teacher
3. Change history, plus an "Updated" marker for students and teacher-controlled quarter locking
4. Formal record workflow with approval of corrections

## Decision

Option 3, with **optional** change notes:

* **Change history that can only be added to:** every create, change and delete of a score, assessment, grading scheme or release state records who, when, the old value, the new value and an optional note. Teachers can view the history for their classes. History entries can't be edited or deleted through the application.
* **"Updated" marker:** when a released score changes, the student sees "Updated on [date]" and the teacher's note if there is one. Students see the current value, not the full history.
* **Quarter locking:** a teacher can lock a grading period. Locked periods reject edits until unlocked. Locking and unlocking are recorded in the history.
* **Change notes are optional**, including for released grades.

## Rationale

* A permanent history is the minimum reasonable bar for sensitive data and supports incident investigation.
* The marker keeps real-time visibility honest and reduces disputes.
* Locking protects finished grades that teachers transcribe into the school's official record.
* Optional notes avoid friction. Accountability comes from the automatic who, when and what record.

Rejected: Option 1 offers no accountability. Option 2 leaves students confused by silent changes. Option 4 needs a second approver and an official-record role we don't have. Reconsider it when schools become customers.

## Consequences

* The data model needs an audit or event table for grade-related entities. The database ADR must cover how its integrity is protected (for example, only allowing inserts through the app's database role) and how long it's kept.
* Grading-scheme changes mid-period (weights, transmutation) are recorded and trigger recalculation. The breakdown reflects the current scheme.
* The audit data is itself sensitive personal information and falls under the same access control, encryption, retention and deletion rules.
* Deleting a student or workspace must also handle its audit records. This will be covered in the data retention and deletion decision.

## Risks and mitigations

* **Audit history growing without limit:** it's small per class. Define a retention policy in the retention ADR.
* **Tampering by someone with database access:** restricted database roles, backups, and possibly a hash chain later if needed.
* **The marker alarming students:** use neutral wording and show the note when given.

## Follow-up actions

* Database ADR: how the audit table is stored, how its integrity is protected, and indexes.
* Data retention and deletion ADR: audit retention, and handling audit records on account or workspace deletion.
* Ask the partner teacher how often post-release corrections happen, to confirm optional notes are enough.

## Sources

None. This is a product decision based on workshop discussion.
