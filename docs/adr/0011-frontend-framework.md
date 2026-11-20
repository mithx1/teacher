# ADR-011: Frontend framework

* Status: Superseded by [ADR-012](0012-frontend-react-typescript.md)
* Date: 2026-11-21

## Context and problem

We need a frontend framework for a responsive, accessible (WCAG 2.2 AA) web app used by teachers (data entry) and students (mostly read-only, often on mid-range phones over slow mobile connections). The team is two people (the user, plus a teacher partner as domain expert), working on it as a side project with little operations capacity. The user wants to try **SolidJS 2.0**. The first deliverable is a prototype to show the partner teacher and gather feedback on the use cases.

## Decision drivers

* Accessibility: WCAG 2.2 AA is an acceptance criterion, so accessible component primitives matter a lot
* Performance on mid-range phones and slow connections (small bundles)
* Ecosystem maturity: routing, forms, data fetching, testing, an SSR/full-stack option
* Developer motivation and familiarity (a side project needs to stay enjoyable)
* Low risk of rework if the prototype grows into the MVP

## Verified facts (npm registry and GitHub, accessed 2026-11-21)

| Package | Latest | Solid 2 support |
|---|---|---|
| `solid-js` | **2.0.3** (2.0.0 stable published 2026-11-17; patches 2.0.1–2.0.3 on 2026-11-18/19) | n/a (this is Solid 2) |
| `@solidjs/web` | 2.0.3 | Yes |
| `@solidjs/router` | 2.0.1 (2.0.0 on 2026-11-17) | Yes (requires `solid-js ^2.0.0`) |
| `@solidjs/vite-plugin` | 3.0.1 (2026-11-17) | Yes (requires `solid-js ^2.0.0`, Vite 8/9) |
| `@solid-primitives/utils` | 7.0.1 | Yes |
| `@solidjs/start` (SolidStart) | 2.2.3 | **No.** Requires `solid-js ^1.9.15` and router `<2.0.0` |
| `@kobalte/core` (accessible UI primitives) | 0.13.14 | **No.** Requires `solid-js ^1.9.8`; Solid 2 support only as `2.0.0-alpha.5` |
| `@ark-ui/solid` | 5.40.0 | Declares `solid-js >=1.6.0`; Solid 2 compatibility **not verified** |
| `@tanstack/solid-query`, `@tanstack/solid-form` | 5.108.2, 1.33.5 | Declare `>=1.x`; Solid 2 compatibility **not verified** |
| `@solidjs/testing-library` | 0.8.10 (2024); 1.0.0-rc.2 on `next` | **Not verified** |

**Interpretation:** the Solid 2.0 **core** (reactivity, DOM, router, Vite build) is stable but **days old**. The surrounding **ecosystem** (meta-framework, accessible component library, testing utilities) has **not yet caught up**.

## Options considered

1. **Solid 2.0 single-page app** (Vite + `@solidjs/router` 2), with a separate backend or backend service.
   *Strengths:* what the user wants to learn; fine-grained reactivity, small bundles, good mobile performance; the core packages are stable.
   *Drawbacks:* brand-new major version (expect bugs and fast-moving patches, and little community material or Q&A); no SolidStart, so no server rendering or server functions; no stable accessible component library, so we'd build accessible dialogs, menus, comboboxes and tabs ourselves or wait for Kobalte 2.
2. **Solid 1.9 + SolidStart now, migrate to 2.0 later.**
   *Strengths:* mature, with Kobalte, SolidStart, testing library and full-stack server functions all available.
   *Drawbacks:* a migration to 2.0 is guaranteed later (2.0 has breaking changes); doesn't satisfy the wish to try 2.0.
3. **React** (React Router or Next.js) with React Aria for accessibility.
   *Strengths:* the largest ecosystem; React Aria is among the strongest accessible-component options; hiring and help are easy.
   *Drawbacks:* heavier runtime than Solid; not what the user wants to learn; more boilerplate for fine-grained updates.
4. **SvelteKit.**
   *Strengths:* small bundles, a mature full-stack meta-framework, good developer experience.
   *Drawbacks:* not the user's preference; accessible component options less established than React Aria.

## Recommendation (not yet decided)

* **Prototype: Option 1 (Solid 2.0 SPA).** The risks of a days-old release matter much less for a demo with fake data, and the prototype doubles as a **hands-on evaluation** of Solid 2.0.
* **Production MVP: decide after the prototype**, using these criteria:
  * Did we hit blocking bugs or missing ecosystem pieces in Solid 2.0?
  * Is an accessible component approach viable (Kobalte 2 stable, Ark UI verified on Solid 2, or a small set of our own tested components)?
  * Has SolidStart shipped Solid 2 support, if we want server rendering or server functions?
  * If the answers are poor, fall back to Option 2 or 3.

## Consequences (if accepted as recommended)

* Keep UI components few and simple in the prototype. Write accessible patterns following the WAI-ARIA Authoring Practices.
* Keep the grade calculation engine **framework-independent** (plain TypeScript), so it survives any framework change.
* Pin exact versions and update deliberately, given the daily patch releases.

## Risks and mitigations

* **Breaking bugs in early 2.0.x:** pin versions; prototype only; keep a minimal dependency set.
* **Accessibility gaps without a component library:** few interactive widgets; automated a11y checks (for example axe) plus manual keyboard and screen-reader checks.
* **Prototype code becoming production by inertia:** treat the prototype as disposable, except the framework-independent grading engine.

## Follow-up actions

* User to confirm the prototype approach and accept or modify this ADR.
* Re-check SolidStart, Kobalte and testing-library Solid 2 support before the production decision.

## Sources

* npm registry metadata for `solid-js`, `@solidjs/web`, `@solidjs/router`, `@solidjs/vite-plugin`, `@solidjs/start`, `@kobalte/core`, `@ark-ui/solid`, `@tanstack/solid-query`, `@tanstack/solid-form`, `@solidjs/testing-library`, `@solid-primitives/utils`, `vite-plugin-solid`: https://registry.npmjs.org/ (accessed 2026-11-21)
* Solid GitHub releases: https://github.com/solidjs/solid/releases (accessed 2026-11-21)
