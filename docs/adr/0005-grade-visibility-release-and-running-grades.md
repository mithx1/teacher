# ADR-005: Grades are released per assessment, with optional automatic release; running quarter grades are shown with context

* Status: Accepted
* Date: 2026-11-20

## Context and problem

Students seeing their grades in real time is a key motivation benefit, according to the partner teacher (domain expert). Teachers also need to correct entry mistakes before students see them. We need rules for when a student can see a grade, and whether and how they see an in-progress quarter grade ([ADR-004](0004-grading-model-configurable-weighted-categories.md)).

## Decision drivers

* Motivation: students see results quickly
* Teacher control and trust: no premature or mistaken grades exposed
* Clarity: running grades must not mislead, especially early in a quarter
* Simplicity for teachers

## Options considered

**Release timing**
1. Instant on save
2. Teacher releases each assessment
3. Per-assessment release, plus a per-class "release automatically" setting
4. Released only at the end of the quarter

**Running quarter grade**
- (i) Show the running grade, labelled "so far, based on N of M assessments"
- (ii) Show category scores only until the quarter ends
- (iii) Teacher chooses per class

## Decision

* **Release timing: Option 3.** By default, each assessment's grades are drafts until the teacher **releases** that assessment. Each class has an optional **"release automatically"** setting that makes grades visible on save. Edits to an assessment that's already released are visible immediately.
* **Running grade: Option (i).** Students see their running quarter grade, computed **only from released assessments**, with a clear label such as *"So far: 84, based on 5 of 8 assessments."* The breakdown (category subtotals and weights) is available next to it.
* Students only ever see released data. Drafts are never sent to student clients.

## Rationale

* Keeps the motivation benefit (results visible as soon as the teacher is satisfied) without exposing typos or partly marked batches.
* Automatic release serves teachers who want instant visibility.
* The "N of M" context stops an early low score from reading as a final verdict.

Rejected: Option 1 has no safety net. Option 4 removes the motivation benefit. Option (ii) is less motivating. Option (iii) adds a setting with no clear demand yet.

## Consequences

* Each assessment needs a **release state** (draft or released) and a release timestamp. Authorization must filter by release state on the server.
* **"M" (the total) needs a definition.** Proposal: M is the assessments the teacher has created for the quarter, including drafts. If the teacher hasn't planned all assessments yet, the label falls back to "based on N assessments so far". To confirm with the partner teacher during UX testing.
* How the running grade is computed when some categories have no released assessments yet (for example, no Quarterly Assessment until the end) needs a rule. Proposal: compute over the categories that have data, re-weighted proportionally, and say so in the breakdown. To validate with real sheets.
* Edits after release interact with audit history and correction visibility. This will be decided in the records and corrections ADR.
* Release is a natural trigger for notifications later (out of MVP scope until decided).

## Risks and mitigations

* **Teachers forgetting to release:** show unreleased assessments prominently on the teacher dashboard and nudge them.
* **Running grades misread as final:** use the "so far" label, give a plain-language explanation, and make the label accessible to screen readers rather than relying on colour.
* **Draft data leaking through the API:** filter on the server and add authorization tests that student endpoints never return unreleased scores.

## Follow-up actions

* Validate the definition of M and the re-weighting rule with the partner teacher.
* Decide the correction and audit history policy.
* Decide whether release triggers notifications.

## Sources

None. This is a product decision based on workshop discussion and domain-expert input.
