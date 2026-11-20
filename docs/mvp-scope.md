# MVP scope (confirmed 2026-11-21)

Consolidated from ADR-001 to ADR-010. Updated 2026-11-21.

## Who

* **Customer:** an individual teacher at a Philippine private high school (JHS Grades 7–10, SHS Grades 11–12). Self-serve. *(ADR-001, ADR-003)*
* **Users:** teachers and students. Guardians are the first addition after the MVP. *(ADR-002)*

## Core workflow

1. A teacher signs up and gets a **workspace**.
2. The teacher creates a **school year** from a preset (JHS: 4 quarters / SHS: 2 semesters × 2 quarters) and creates **classes** (subject + section). Setup can be copied between sections. *(ADR-008)*
3. The teacher chooses a **grading scheme template** (DepEd-style JHS/SHS or custom weighted categories) and adjusts it if needed. *(ADR-004)*
4. The teacher **imports the roster** (CSV or paste), previews it, and confirms. Students receive **invite links** by email. Code-joins need teacher approval. *(ADR-007, ADR-010)*
5. The teacher creates **assessments** and enters **scores and an optional comment for each score**. *(ADR-004, ADR-009)*
6. The teacher **releases** each assessment, or release is automatic if the class is set that way. *(ADR-005)*
7. Students sign in and see **released scores, comments, the running quarter grade ("so far, N of M") and a plain-language breakdown**, with "new" and "updated" indicators. *(ADR-005, ADR-009)*
8. Corrections are kept in a **permanent history**. Changed released grades show "Updated". The teacher **locks** finished quarters. *(ADR-006)*
9. The teacher **exports** grades to CSV for the school's official record. *(ADR-010)*

## Cross-cutting acceptance criteria

* **Authorization:** students see only their own released data; teachers see only their own workspace. Enforced on the server and tested.
* **Accessibility:** WCAG 2.2 AA for all MVP screens. Full keyboard operation, screen-reader-labelled grades and breakdowns, no meaning carried by colour alone, 200% zoom and reflow, a minimum target size for touch.
* **Mobile and low bandwidth:** works on a mid-range Android phone on a slow mobile connection. The student grade view loads quickly with small page weight (budgets set in the frontend ADR).
* **Privacy:** no grade data in emails. Sensitive data encrypted in transit and at rest. Every grade change, export, invite and reset is recorded in the history.
* **Language:** English UI. Filipino characters (ñ) are supported throughout.

## Explicitly out of the MVP

Guardian accounts; school or admin accounts; email or push grade notifications; attachments and rubrics; standards-based grading; score import; export in the school's own format; SIS/LMS integrations; Google/Microsoft sign-in (to be decided in the authentication ADR); syncing classes across sections; Filipino localization.

## Prerequisites before real student data

* Qualified Philippine data-privacy legal review (controller role, consent for minors, NPC obligations, data portability).
* Verified DepEd grading templates, validated against real grade sheets.
* An incident response plan with an NPC breach-notification path.
