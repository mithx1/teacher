# ADR-001: Initial customer is the individual teacher (self-serve), with a school-ready data model

* Status: Accepted
* Date: 2026-11-20

## Context and problem

Who the first customer is affects onboarding, the trust model for guardian links, tenant isolation, compliance work and how fast we can validate the product. We need to choose an initial customer for the MVP without blocking later growth into schools or districts.

## Decision drivers

* Get to a usable MVP quickly and validate it with real users
* Keep cost and operational load low early on
* Avoid rebuilding the core when schools adopt the product later
* Keep a clear trust model for sensitive student data

## Options considered

1. **Individual teacher (self-serve):** a teacher signs up, creates classes and invites students and guardians.
2. **Single school:** a school admin manages rosters, teachers and guardian links.
3. **District or organisation:** several schools, integrations and procurement.
4. **Other segment:** tutoring centres, homeschool co-ops and similar.

## Decision

Option 1: the initial customer is an individual teacher using the product self-serve. All teacher-owned data (classes, rosters, grades) lives inside a **workspace**, the tenant boundary, so a workspace can later be owned by a school (Option 2) without restructuring the data.

## Rationale

* Shortest path to real usage: no procurement, no school admin role, and no SIS integration needed to start.
* The workspace boundary keeps the path to schools open, which avoids an expensive data-model migration later.
* Districts (Option 3) bring integration and procurement work that's too heavy for an MVP. No specific alternative segment (Option 4) was identified.

Rejected for now: a single school (slower to start, needs admin onboarding and probably a data agreement) and a district (too complex for an MVP).

## Consequences

* The teacher, not a school, is the party that invites and links students and guardians. The guardian-link verification design must reflect that weaker trust model (to be decided in a later ADR).
* Grades are probably the teacher's working records, not the official school record. This is to be confirmed in the records ADR.
* Every data access path must be scoped by workspace from day one.
* We'll need to decide, before schools onboard, how a school "claims" or absorbs existing teacher workspaces.

## Risks and mitigations

* **Teachers using unapproved tools with student data, against school or district policy:** make clear in onboarding and the terms that teachers are responsible for following school policy; collect as little data as possible; flag this for qualified legal review once we know the target regions.
* **A weak guardian-verification trust model:** handle it in the roles and permissions ADR (for example invite codes the teacher distributes, links the teacher must approve, revocation).
* **Workspace boundary leaks:** enforce the boundary at the data layer and test it (database and authorization ADRs).

## Follow-up actions

* Identify a first real teacher or pilot user (open).
* Decide the MVP roles and guardian-link model.
* Confirm the target geography for compliance review.

## Sources

None. This is a product decision based on workshop discussion.
