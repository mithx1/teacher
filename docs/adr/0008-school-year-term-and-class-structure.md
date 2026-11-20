# ADR-008: Configurable school year and term structure with JHS/SHS presets; classes can be copied between sections

* Status: Accepted
* Date: 2026-11-21

## Context and problem

Classes need a time structure for grading periods and final grades ([ADR-004](0004-grading-model-configurable-weighted-categories.md)). My understanding, not yet verified, is that Philippine Junior High uses a school year of 4 quarters and Senior High uses 2 semesters of 2 quarters, with many semester-long subjects. Private schools may vary. Teachers often teach the same subject to several sections.

## Decision drivers

* Fits both JHS and SHS without a later migration
* A well-defined final-grade calculation
* Minimal setup through presets
* Less repeated work for teachers with several sections

## Options considered

1. Fixed: school year → 4 quarters
2. Configurable terms (school year → optional semesters → grading periods) with presets
3. Free-form periods

**Multiple sections:** (a) copy a class setup; (b) keep sections in sync.

## Decision

* **Option 2.** A teacher's workspace contains **school years**. A school year contains **terms**: either the whole year or semesters. Terms contain **grading periods**, usually quarters. A **class** (subject + section, for example "Math 9 – Rizal") belongs to a term and inherits its grading periods. Presets: **"JHS: 4 quarters"** and **"SHS: 2 semesters × 2 quarters"**, with editable dates.
* How period grades roll up into term and final grades is part of the class's grading scheme (ADR-004), with defaults from the template.
* **Multiple sections: copy only (a).** A teacher can create a class by copying another class's grading scheme, assessments and dates. Copies are independent afterwards. Rosters and scores are never copied.

## Rationale

* The same "presets plus configuration" pattern as grading. It covers JHS and SHS and tolerates private-school variants.
* Copying removes most of the repeated work with none of the complexity of keeping sections in sync (conflicts, partial divergence).

Rejected: Option 1 doesn't fit SHS semesters. Option 3 is easy to misconfigure and makes final-grade rules ambiguous. Syncing (b) is deferred until there's evidence of demand.

## Consequences

* Data hierarchy: workspace → school year → term → grading period. Separately: class → term, and assessment → class + grading period.
* Locks (ADR-006) apply per class per grading period.
* Copying is a one-time operation, recorded in the history as created from class X.
* Archiving past school years needs a policy. This will be covered in the retention ADR.

## Risks and mitigations

* **Presets not matching actual school calendars:** dates are editable; confirm the structure with the partner teacher.
* **Teachers expecting copies to stay in sync:** label the action clearly as "Copy setup".

## Follow-up actions

* Verify the JHS/SHS term structure and final-grade roll-up rules with the partner teacher and the current DepEd guidance.

## Sources

None. This is a product decision. The term structure is an unverified assumption.
