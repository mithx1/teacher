# ADR-003: Initial market is teachers at private/independent high schools in the Philippines

* Status: Accepted
* Date: 2026-11-20

## Context and problem

The initial customer is an individual teacher ([ADR-001](0001-initial-customer-individual-teacher.md)) and the MVP users are teachers and high school students ([ADR-002](0002-mvp-roles-teacher-and-student.md)). The target geography and school type decide which privacy laws need qualified review, any hosting and data-residency constraints, grading conventions, and localization.

## Decision drivers

* One jurisdiction, so the MVP has one set of rules to review
* Grading conventions teachers will recognise
* Not blocking expansion to other countries later

## Options considered

Australia; United States; UK/EU; Philippines; several regions. The choice is based on where the first users are, so there was no trade-off analysis between options.

## Decision

The MVP targets **teachers at private/independent schools in the Philippines**, teaching **high school**: Junior High (Grades 7–10) and Senior High (Grades 11–12), roughly ages 12–18. *(The grade bands and age range are an assumption to confirm.)*

Region-specific behaviour (grading templates, locale, date and number formats) will be configurable rather than hard-coded, so other markets remain possible later.

## Rationale

The first users are there. A single jurisdiction keeps compliance review and grading design focused.

## Consequences

**Facts (verified 2026-11-20, see Sources):**

* The Philippine **Data Privacy Act of 2012 (RA 10173)** lists information about an individual's **education** under **sensitive personal information** (Sec. 3(l)). Grades and feedback are therefore likely sensitive personal information, which carries stricter processing conditions than ordinary personal information.
* The Act requires reasonable organisational, physical and technical security measures, plus prompt **breach notification** to the National Privacy Commission (NPC) and affected individuals when sensitive data is likely compromised and there's a real risk of serious harm (Sec. 20).
* Controllers stay **accountable for data processed by third parties, including abroad**. Comparable protection must be ensured by contract or other means (Sec. 21).
* The Act's text contains **no general data-localization requirement**. Hosting outside the Philippines isn't prohibited by the statute itself.
* DepEd Order No. 8, s. 2015 (classroom assessment for K to 12) applies to public schools. **Non-DepEd schools are "urged" to implement it and may adapt it, subject to DepEd Regional Office approval.**

**Implications for the product:**

* Lawful basis and consent for processing students' education data, including minors' data, need qualified legal review. That includes who the "personal information controller" is when a teacher uses the app on their own (the teacher, the school, or us) and what our role is.
* Whether NPC registration, a Data Protection Officer, or a privacy impact assessment applies to us needs verification against current NPC circulars.
* Breach detection and an incident response plan with an NPC notification path are MVP requirements, not later additions.
* Vendors and sub-processors (hosting, email, monitoring) need agreements that give comparable protection.
* The grading model should support DepEd-style computation but probably can't assume every private school follows it exactly.
* Hosting region: no statutory localization, but latency to the Philippines and school or parent expectations still matter. This will be decided in the hosting ADR.
* UI language: English is likely sufficient for high school MVP users (assumption). Filipino localization is a later option.

## Risks and mitigations

* **Misreading Philippine privacy obligations:** get qualified Philippine data-privacy counsel to review before any real student data is collected. Don't claim compliance.
* **Private schools forbidding teacher-adopted tools:** state in onboarding that teachers are responsible for following school policy; offer data export and deletion.
* **Grading conventions varying between private schools:** handle in the grading-model ADR (configurable schemes with a DepEd-style template).

## Follow-up actions

* Check current NPC circulars on registration, DPO and PIA requirements, and on processing minors' data (couldn't be verified in this session).
* Confirm the current DepEd assessment and grading order, including whether DO 8 s. 2015 has been amended or replaced, and its exact weights and transmutation table.
* Decide the grading model.
* Arrange legal review before the pilot.

## Sources

* Republic Act No. 10173 (Data Privacy Act of 2012), Lawphil: https://lawphil.net/statutes/repacts/ra2012/ra_10173_2012.html (accessed 2026-11-20)
* DepEd Order No. 8, s. 2015 (cover memo), DepEd: https://www.deped.gov.ph/2015/04/01/do-8-s-2015-policy-guidelines-on-classroom-assessment-for-the-k-to-12-basic-education-program/ (accessed 2026-11-20). The enclosed guidelines PDF is a scanned image and couldn't be machine-read, so the computation details aren't yet verified.
* NPC website (privacy.gov.ph) returned HTTP 403 when accessed on 2026-11-20; NPC circulars remain to be checked.
