# ADR-002: MVP roles are teacher and student (high school); guardians come after the MVP

* Status: Accepted
* Date: 2026-11-20

## Context and problem

The initial customer is an individual teacher ([ADR-001](0001-initial-customer-individual-teacher.md)). Each role we add is someone the teacher must invite, link and support, and each adds a permissions surface over student data. We need the smallest set of roles that still delivers the core value: a teacher records grades and feedback, and the learner sees them.

## Decision drivers

* Deliver the core sharing loop: the teacher enters grades and the student sees their own grades and feedback
* Keep the permissions surface and data about minors small
* Avoid hard trust problems that no school can resolve for us (verifying guardian links)
* Fit the target student population

## Options considered

1. **Teacher only:** the safest option, but it doesn't meet the vision of students seeing their grades.
2. **Teacher + students:** delivers the sharing loop. Guardian verification is deferred.
3. **Teacher + students + guardians:** the full vision, but verifying guardian links without a school is high risk.
4. **Teacher + guardians, no student logins:** suits younger grades, which are not the target.

## Decision

Option 2. The MVP has two roles:

* **Teacher:** owns a workspace, creates classes, enrols students, enters grades and feedback.
* **Student:** joins classes they're invited to and sees only their own grades and feedback, in classes they're enrolled in.

The target population for now is **high school students only**. **Guardians** are planned as the first role added after the MVP, under their own ADR.

## Rationale

* This proves the core value loop with the fewest trust relationships.
* High school students can generally manage their own accounts, so student logins are practical.
* It defers the riskiest design problem, a guardian wrongly linked to a child, until it gets careful design.

Rejected: Option 1 doesn't validate the sharing value. Option 3 is deferred because of guardian-verification risk. Option 4 doesn't fit high school users.

## Consequences

* Authorization rules for the MVP: a teacher sees all data in their own workspace's classes; a student sees only their own records in classes they're enrolled in. Students never see other students' data.
* Student onboarding needs a design (class join code or invite link, whether an email address is required, account recovery). This will be a separate decision.
* The data model should still allow a guardian ↔ student relationship later, without migrating existing data.
* No admin role in the MVP. Platform operations (support, abuse handling, deletion requests) still need an internal operator capability. This will be a separate decision.

## Risks and mitigations

* **Some high school students may be under 13 (for example, where secondary school starts around age 12).** Age-related consent rules such as COPPA (US) or local equivalents may apply. This needs qualified legal review once the target region is known. We don't claim compliance.
* **Guardians expect visibility from day one:** teachers can share exports or reports outside the system until the guardian role ships.
* **Students accessing other students' data (horizontal privilege escalation):** enforce student scoping on the server and at the data layer, and add automated authorization tests.

## Follow-up actions

* Confirm target geography and school types (needed for compliance review and data residency).
* Decide student onboarding and account recovery.
* Write the guardian role ADR as the first post-MVP item.

## Sources

None. This is a product decision based on workshop discussion.
