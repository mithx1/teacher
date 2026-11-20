# ADR-009: Text feedback on each score; in-app notifications only for the MVP

* Status: Accepted
* Date: 2026-11-21

## Context and problem

The product vision includes students seeing grades **and feedback**. Students coming back to see new results is the motivation benefit identified by the partner teacher ([ADR-005](0005-grade-visibility-release-and-running-grades.md)). We need to decide what feedback teachers can give, and how students learn about new grades.

## Decision drivers

* Deliver the feedback part of the vision cheaply
* Accessibility and low bandwidth
* Privacy: keep grade data behind sign-in
* Keep MVP scope and operational dependencies small

## Options considered

**Feedback:** (A) scores only; (B) a short text comment per student score; (C) B plus attachments or rubrics.
**Notifications:** (A) in-app only; (B) in-app plus a daily email digest; (C) in-app plus an email for every release; (D) browser push.

## Decision

* **Feedback: B.** A teacher can add an optional plain-text comment to each student's score. It's released together with the score and follows the same visibility, history and "Updated" rules (ADR-005, ADR-006).
* **Notifications: A, in-app only.** Students see "new" and "updated" indicators (per class and per assessment) when they open the app. No grade-related emails or push notifications in the MVP.
* **Transactional email is still required** for invites and account recovery ([ADR-007](0007-student-onboarding-roster-invites.md)). It never contains scores or feedback.

## Rationale

* Per-score comments deliver meaningful feedback with minimal complexity, and plain text is accessible and light on bandwidth.
* In-app only keeps all grade-related signals behind sign-in and avoids email volume, deliverability and opt-out work in the MVP. It also lets us learn whether students return on their own before adding notifications.

Rejected or deferred: scores-only misses the vision. Attachments and rubrics need file storage and scanning, so they're deferred. The email digest, per-release emails and push are deferred. If we add them, emails must not include grade content.

## Consequences

* Each score has an optional comment field, included in the audit history.
* Indicators need per-student read state ("seen" timestamps per assessment or score).
* No file storage is needed in the MVP, which simplifies the storage decision.
* Without notifications, the motivation benefit depends on students opening the app. Measure return visits during the pilot.

## Risks and mitigations

* **Students not coming back:** track return-visit metrics in the pilot (privacy-respecting) and revisit the email digest or push notifications if engagement is low.
* **Comments containing inappropriate or very sensitive remarks:** comments are teacher-authored and sensitive; they're covered by the same access control and history. Add guidance in the teacher UI.

## Follow-up actions

* Open: include an optional **whole-class comment per assessment**? (Suggested but not confirmed.)
* Define pilot engagement metrics.
* Email provider decision (transactional only).

## Sources

None. This is a product decision based on workshop discussion.
