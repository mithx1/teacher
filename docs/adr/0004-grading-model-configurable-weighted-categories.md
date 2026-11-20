# ADR-004: Grading model uses configurable weighted categories, with DepEd-style templates as the default

* Status: Accepted
* Date: 2026-11-20

## Context and problem

The target teachers are at Philippine private high schools ([ADR-003](0003-initial-market-philippines-private-high-schools.md)). DepEd Order 8, s. 2015 sets a component-based grading scheme for public schools. Private schools are urged to follow it and may adapt it, so their schemes may vary. We don't yet know how closely the target teachers follow DepEd. The grading model is the core of the product and shapes the data model.

## Decision drivers

* Teachers must recognise and trust how grades are calculated
* Support for DepEd-style computation and for school-specific variants
* Calculations that are explainable to students (transparency and accessibility)
* Correct, reproducible results with no rounding surprises
* Fast setup: a teacher shouldn't have to build a scheme from scratch

## Options considered

1. **DepEd-style only:** fixed components, weights and transmutation. Simple, but rigid.
2. **Configurable weighted categories with DepEd templates:** flexible, moderate complexity.
3. **Simple points or percentages:** too simple; doesn't match local practice.
4. **Fully flexible, including standards-based grading:** too complex for an MVP.

## Decision

Option 2. Each class has a **grading scheme** made of:

* **Grading periods** (default: 4 quarters) and how they combine into a final grade
* **Categories**, each with a weight (for example Written Work, Performance Tasks, Quarterly Assessment), with weights validated to total 100%
* **Assessments**, each in one category, with maximum points
* **Conversion rules**: an optional transmutation table, the passing grade, descriptors, and rounding rules

Teachers start from a **template**, initially DepEd-style templates for Junior High and Senior High once the current rules are verified, and can adjust it per class. A US-style "weighted categories of points" scheme is expressible in the same model, which matches the workflow the partner teacher has used.

## Rationale

* Covers both DepEd-conformant and adapted private-school schemes without forking the product.
* Templates keep setup quick for teachers who follow DepEd as written.
* One general model is simpler to test thoroughly than several hard-coded schemes.

Rejected: Option 1 excludes adapted schemes. Option 3 forces teachers back to spreadsheets. Option 4 is out of scope for the MVP and can be revisited after it.

## Consequences

* The grade calculation engine is a **pure, isolated, heavily tested module**: inputs are scores plus the scheme, and the output is grades plus a step-by-step breakdown.
* Calculations use **exact decimal arithmetic** (no binary floating point), and rounding happens only at defined steps.
* Transmutation tables and templates are **data, not code**, so they can be corrected without a release.
* Students see **how** their grade was computed (category subtotals, weights, conversion), in plain language.
* We need a policy for **changing a scheme mid-period** (recalculate, version the scheme, record it in the audit history). This will be decided in the records and audit ADR.
* Showing a running, partial-quarter grade needs care. A transmuted grade based on partial work can mislead. This will be decided with the visibility rules.

## Risks and mitigations

* **Wrong DepEd template values:** verify against the current DepEd order and test with the partner teacher's real grade sheets before release.
* **Configuration errors by teachers** (weights that don't add up, wrong table): validate on input, preview against sample scores, warn on changes.
* **Calculation bugs eroding trust:** golden test cases from real sheets, property-based tests, and a visible breakdown so errors get noticed.

## Follow-up actions

* Collect one or more real (anonymised) grading sheets from the partner teacher or her school.
* Verify the current DepEd assessment order and its weights and transmutation table.
* Decide when grades become visible to students and how running grades are shown.
* Decide the mid-period scheme-change and correction policy.

## Sources

* DepEd Order No. 8, s. 2015 (cover memo): https://www.deped.gov.ph/2015/04/01/do-8-s-2015-policy-guidelines-on-classroom-assessment-for-the-k-to-12-basic-education-program/ (accessed 2026-11-20)
