# Plan 7 — Future/Reference Code, QA and Dev Handoff

## Goal

Cover every remaining coded mockup surface, label future material correctly, then complete quality and handoff work.

## Checklist

- [x] P7.a Convert Team Board, Portfolio, Reports and Release Planning placeholder as `Future / reference only` unless user expanded BA scope.
  - [x] New `future-reference-banner` marker pattern; `SCR-14` Release Planning, `SCR-15` Portfolio, `SCR-16` Team Board, `SCR-17` Reports — all deliberately lower-fidelity than Phase 0-4 screens per D-002.
- [x] P7.b Run naming audit for pages, components, properties, variables and styles.
  - [x] Consistent naming confirmed; recorded the P5+ badge-family placement convention shift (inline on Screens page, not a dedicated component page) for Dev Mode awareness.
- [x] P7.c Audit unresolved token bindings and hard-coded values in components/screens.
  - [x] **Real defect found and fixed at the root:** `font/size/base`/`lg`/`xl` were used throughout Plans 5-7 but never existed as tokens; `setBoundVariable` with an undefined variable silently falls back rather than erroring. Created the 3 missing tokens as correct aliases. Not retroactively rebound on already-built nodes (documented, low-priority cosmetic gap) — see `P7_PROGRESS.md`.
- [x] P7.d Run accessibility and desktop-responsive behavior audit.
  - [x] `P7_ACCESSIBILITY_AND_RESPONSIVE_AUDIT.md` — computed real WCAG contrast ratios (found `color/text/muted` fails AA at 3.1:1, inherited from mockup, flagged not fixed unilaterally); confirmed focus-state coverage and gaps; documented keyboard/ARIA requirements; confirmed no silent responsive column collapse.
- [x] P7.e Prepare Dev Mode documentation: component use, variable syntax, assets and export policy.
  - [x] `P7_DEV_MODE_GUIDE.md` — component index addendum (P3-P7 components not in the P2 catalog), variable syntax, icon/asset policy (lucide-react mapping, no exported images), export policy.
- [x] P7.f Add Code Connect mappings where corresponding code components are stable; otherwise create a refactor/mapping backlog.
  - [x] No stable production codebase exists (mockup only, explicitly not backend-ready) — live Code Connect mappings would be misleading. Wrote `P7_CODE_CONNECT_BACKLOG.md` instead: a Figma-component → mockup-reference → production-action table for whoever builds the real component library.
- [x] P7.g Run one dev-handoff walkthrough using the pilot UI/API contract.
  - [x] Walked Contracts 1-5 against the built pilot. **Real gap found and fixed:** Contract 5 (Destructive delete) had zero persisted Figma evidence anywhere in the file — added pilot frame 6 (`183:2802`) and updated `P3_PILOT_VALIDATION.md`'s reuse-audit table.
- [x] P7.h Publish final coverage matrix, known gaps, implementation order and release notes.
  - [x] Final reuse audit: 0 broken instances across all 10 Plan 6-7 screens.
  - [x] `CONVERSION_PROGRESS.md` coverage matrix fully updated (Team Board/Portfolio/Reports/Release Planning now Converted-Future/Reference, 0 remaining "Needs decision" rows).
  - [x] `RELEASE_NOTES.md` — consolidated Q-01–Q-16 ledger, every found-and-fixed defect, recommended implementation order, final coverage summary.
  - [x] Tracker set to `AWAITING PLAN 7 CONFIRMATION`.

## Exit criteria

- Every code surface is `Converted`, `Future/reference`, `Out of scope by decision`, or `Needs decision`.
- All reusable components/patterns/screens pass final visual and structural validation.
- Dev handoff distinguishes Figma-ready from implementation-ready and lists all remaining BE/code work.

## Gate

Set tracker to `AWAITING PLAN 7 CONFIRMATION`; stop until `CONFIRM PLAN 7`, then mark workflow complete.

