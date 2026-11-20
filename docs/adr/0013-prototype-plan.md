# ADR-013: Clickable prototype with fake data, hosted as a static site

* Status: Accepted
* Date: 2026-11-21

## Context and problem

The user wants something running, at no cost, to show the partner teacher and collect feedback on the use cases before committing to backend, database and authentication choices. The MVP scope is confirmed ([docs/mvp-scope.md](../mvp-scope.md)). Real student data can't be used until the legal review is done ([ADR-003](0003-initial-market-philippines-private-high-schools.md)).

## Decision drivers

* $0 cost
* Fast feedback on the use cases
* No real student data
* Avoid locking in backend, database or authentication decisions prematurely
* Reuse whatever survives (especially the grading engine)

## Options considered

1. **Clickable frontend-only prototype with fake data on a free static host**
2. Working prototype on the Supabase free tier (pauses after 1 week of inactivity, no backups on Free)
3. Option 1 now, then Option 2 or a chosen backend after feedback

## Decision (proposed)

Option 3, starting with Option 1:

* **Stack:** Vite + React + TypeScript; React Router; **React Aria Components** for accessible widgets; plain CSS (CSS Modules) for styling; **Vitest** for unit tests on the grading engine.
* **Data:** fake sample data (Philippine-style names, a JHS class with a DepEd-style template), held in the browser (memory plus `localStorage`). A **"Reset demo"** button.
* **Roles:** no real sign-in. A visible **role switcher** (Teacher / Student "Juan") to demo both views.
* **Screens in scope (first version, trimmed):** teacher class list → gradebook (enter scores and comments, release an assessment, auto-release setting) → grading scheme view; student view with released scores, comments, the running grade "so far, N of M" with breakdown, and "new" and "updated" indicators; roster paste preview. **Cut from the first version:** change-history view and CSV export. They remain in the MVP scope.
* **Grading engine:** a framework-independent TypeScript module with exact decimal arithmetic and unit tests. This is the part intended to survive into the MVP.
* **Hosting:** **GitHub Pages** from the public repo `mithx1/teacher`, deployed by GitHub Actions (URL: https://mithx1.github.io/teacher/). It can also run locally. Hash-based routing (`#/...`) avoids GitHub Pages' lack of SPA fallback routing.
* **Tooling:** Node 24 (`.nvmrc`); current React Router and Vitest require Node ≥ 22.
* **Clearly labelled** in the UI as a demo with fake data.

## Rationale

Fastest path to partner feedback at $0 with no privacy risk. Backend choices are made later on validated use cases.

## Consequences

* Not production code, apart from the grading engine. Expect to rewrite the data layer.
* The DepEd template values in the demo are **unverified placeholders** until checked against real grade sheets and the current DepEd order.

## Risks and mitigations

* **The demo being mistaken for a real product and used with real student data:** a demo banner, no sign-in, data only in the browser.
* **Placeholder grading values misleading feedback:** label them as placeholders; ask the partner teacher to correct them.

## Follow-up actions

* Build the prototype (confirmed by the user 2026-11-21, with the trimmed scope and GitHub Pages).
* Gather partner feedback, then the backend, database and authentication ADRs.

## Sources

* Supabase pricing (free-plan pausing and backups): https://supabase.com/pricing (accessed 2026-11-21)
* Cloudflare Pages limits: https://developers.cloudflare.com/pages/platform/limits/ (accessed 2026-11-21). Considered; GitHub Pages chosen to match the user's existing setup.
