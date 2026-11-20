# Gradebook prototype

A clickable prototype of a web gradebook for teachers and students at Philippine private high schools.
**It uses fake data only.** There's no backend and no real sign-in, and everything is stored in your browser.

**Live demo:** https://mithx1.github.io/teacher/

## What to try

1. **Teacher view:** open *Mathematics 9 – Rizal*.
   - Release a draft assessment, or open one and enter scores and comments.
   - Turn on automatic release.
   - Paste a roster on the **Roster** tab (use *Fill with sample rows*).
   - View the grading scheme.
2. **Student view:** switch *View as → Student* (Juan Dela Cruz) and look at:
   - the running grade, "so far, based on N of M assessments"
   - "How is this calculated?"
   - "New" and "Updated" markers, and teacher comments
3. Change a released score as the teacher, then check the student's "Updated" marker.
4. **Reset demo** restores the sample data.

The DepEd-style grading values are **unverified placeholders** (see [ADR-004](docs/adr/0004-grading-model-configurable-weighted-categories.md)).

## Run locally

Requires Node 24 (see `.nvmrc`).

```sh
npm install
npm run dev      # http://localhost:5173
npm test         # grading engine, roster import and route smoke tests
npm run build    # type-check + production build into dist/
```

Pushing to `main` runs the tests and deploys to GitHub Pages through GitHub Actions.

## Project docs

- [MVP scope](docs/mvp-scope.md)
- [Architecture Decision Records](docs/adr/README.md)

## Code map

- `src/grading/`: framework-independent grading engine (exact decimals, unit-tested). This is meant to carry over to the MVP.
- `src/data/`: demo data, the in-browser store, and read models (student selectors return only released data).
- `src/pages/`: teacher and student screens (React + React Aria Components).
