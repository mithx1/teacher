# ADR-007: Students join through teacher roster invites (personal email), with an optional join code that needs teacher approval

* Status: Accepted
* Date: 2026-11-20

## Context and problem

Students see only their own grades ([ADR-002](0002-mvp-roles-teacher-and-student.md)). The biggest privacy risk is linking the wrong person to a student's roster entry, and the second is account recovery being used to take over an account. No school verifies identities for us ([ADR-001](0001-initial-customer-individual-teacher.md)). Students are expected to have email addresses. Whether schools issue Google Workspace or Microsoft 365 accounts is unknown, so personal email is the baseline.

## Decision drivers

* Strong binding between a person and their roster entry
* Safe account recovery
* Low setup effort for teachers
* Works with personal email addresses

## Options considered

1. Join code, students sign up themselves
2. Teacher's roster plus email invite links
3. Option 2 plus Google/Microsoft sign-in
4. Teacher-issued usernames and passwords

## Decision

Option 2, with a join code as a convenience:

* The **teacher's roster is the source of truth.** The teacher adds students (name and email, manually or by import).
* Each roster entry gets a **one-time, expiring invite link** sent by email. Accepting it creates or links the student's account to **that** roster entry.
* **Join code (optional):** a student who joins with a class code goes into a **pending** state and sees no grades until the teacher **approves and matches** them to a roster entry.
* **Personal email addresses are accepted.** No school-domain requirement.
* **Recovery:** a self-service, email-based reset (single-use, short-lived token). The teacher can also **re-send an invite** for a locked-out student. Every invite, approval, re-send and reset is recorded in the history.
* Google/Microsoft sign-in (Option 3) is **deferred to the authentication ADR**.

## Rationale

* Tying each invite to a roster entry prevents impersonation, which a code alone allows.
* The approval step keeps codes convenient without the impersonation risk.
* Email-based recovery is standard and works with personal addresses.

Rejected: Option 1 allows impersonation. Option 4 has weak credential handling and puts every reset on the teacher. Option 3 is not rejected, only deferred.

## Consequences

* A roster entry exists before (and without) an account. The data model separates the **roster entry** (a student in a class) from the **user account** (the login identity). One account can belong to several classes.
* We need transactional email (invites, resets), covered in the email ADR, with deliverability to Gmail, Yahoo and Outlook.
* Accounts are identified by email, so changing an email needs re-verification.
* Personal email addresses of minors are personal data. Collecting them is part of the legal review.

## Risks and mitigations

* **Teacher typos in email addresses (the invite goes to the wrong person):** invites expire; the student must confirm their name on acceptance; the teacher sees who accepted; the teacher can revoke the link.
* **Shared or family email addresses:** allow one account per address; the teacher can see linked accounts; document the limitation.
* **Invite links forwarded to someone else:** single-use links with a short expiry, plus notifying the teacher on acceptance.
* **Account takeover through reset:** rate limits, generic responses (no email enumeration), single-use tokens, and ending other sessions after a reset.

## Follow-up actions

* Authentication ADR: password vs. passwordless vs. Google/Microsoft sign-in, session handling, MFA for teachers.
* Email ADR: transactional email provider.
* Ask the partner teacher whether her school or her contacts' schools issue Google Workspace or Microsoft 365 accounts.

## Sources

None. This is a product and security decision based on workshop discussion.
