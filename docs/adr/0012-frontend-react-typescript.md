# ADR-012: Frontend is React with TypeScript

* Status: Accepted
* Date: 2026-11-21
* Supersedes: [ADR-011](0011-frontend-framework.md) (Proposed, never accepted)

## Context and problem

ADR-011 compared frontend options and proposed Solid 2.0 for the prototype. Research showed Solid 2.0 core went stable on 2026-11-17, but SolidStart and the main accessible-component library (Kobalte) don't yet support it. The user chose to switch to **React with TypeScript**. See ADR-011 for the full comparison and the Solid research, which is kept for future reference.

## Decision drivers

* WCAG 2.2 AA as an acceptance criterion: mature accessible component primitives
* Ecosystem maturity: routing, forms, testing, full-stack options
* A small team on a side project: plenty of documentation and community help
* Type safety for the grading engine and data model

## Options considered

See ADR-011: a Solid 2.0 SPA; Solid 1.9 + SolidStart; **React (+ React Aria)**; SvelteKit.

## Decision

* **React + TypeScript** for the frontend.
* **Prototype:** a single-page app built with **Vite** (see ADR-013 for the prototype plan).
* **Production rendering approach deferred.** Whether production stays a Vite SPA with a separate API, or moves to a full-stack React framework (React Router framework mode or Next.js), will be decided with the backend/API and hosting ADRs.

## Rationale

* React Aria Components gives well-tested, accessible primitives (dialogs, menus, comboboxes, tables, tabs), which directly support the WCAG 2.2 AA criteria.
* The largest ecosystem and community, which matters for a two-person side project.
* All current core packages are mutually compatible (see Sources).

Trade-offs accepted: a larger runtime than Solid. We'll hold to the performance budget for mid-range phones through code-splitting and keeping dependencies minimal. The user gives up trying Solid 2.0 for now. Revisit only if a strong reason appears.

## Consequences

* The grade calculation engine stays **framework-independent plain TypeScript** in its own module.
* Performance budgets for the student view are set in the prototype and measured on a mid-range Android device or emulation.
* Pin dependency versions.

## Risks and mitigations

* **Bundle size on slow connections:** route-level code-splitting; avoid heavy UI kits; measure bundle size in CI later.
* **Choosing a full-stack framework prematurely:** deliberately deferred to the backend ADR.

## Follow-up actions

* Confirm the prototype plan (ADR-013).
* Backend/API ADR to decide the production rendering approach.

## Sources

npm registry metadata, https://registry.npmjs.org/ (accessed 2026-11-21). Latest versions: `react`/`react-dom` 19.3.1 (2026-10-14); `typescript` 7.0.2; `vite` 8.3.8; `@vitejs/plugin-react` 6.3.0 (peer `vite ^8`); `react-router` 8.5.2 (peer `react >=19.2.7`); `next` 16.4.6; `react-aria-components` 1.22.1 (peer includes React 19); `vitest` 5.1.1 (peer `vite ^8`); `@testing-library/react` 16.3.3 (peer React 19); `tailwindcss` 4.3.5.
