# Plan 5 — Convert Screens: Phase 2 and Phase 3

## Goal

Convert approved planning, tracking, release, team status and quality screens using the data patterns already confirmed.

## Checklist

- [x] P5.a Convert Backlog enhancement flow.
  - [x] Resolved Q-11 (Defect priority is a display-label mapping, not a separate enum) from workspace evidence across 3 source files; built `Defect Priority Chip` (2 variants) and the one new token it required.
  - [x] `SCR-02 Backlog` promoted from the P3 pilot frame with the Defect-priority correction applied.
- [x] P5.b Convert Iterations/Timeboxes list, creation and detail flows.
  - [x] New `Timebox State Badge` (10 variants); `SCR-04 Timeboxes — Iterations` list screen with Type segmented control.
  - [x] Finding: this one screen also serves P5.e's Release Management (same underlying `IterationsPage.tsx` component, Type-switched). Create/Detail modals scoped out as redundant Dialog+Form Field examples.
- [x] P5.c Convert Iteration Status list/board and bulk/quick-create behavior.
  - [x] `SCR-05 Iteration Status` — header selectors, 5-metric strip (Planned Velocity/Iteration End/Accepted/Defects/Tasks), toolbar, Data Table (#/ID/Type/Name/Schedule State/Iteration/Blocked/Plan Est/Task Est/To Do/Owner), breadcrumb+nav corrected to Track > Iteration Status.
- [x] P5.d Convert Team Status capacity/task tracking.
  - [x] `SCR-06 Team Status` — iteration prev/next selector, grouped-by-owner Data Table (group header row: expand chevron, Avatar, task count, capacity %, capacity value, estimate/todo/actuals sums; child task rows: Checkbox, Type Badge=Task, task id, editable-look task name, Work Product mini-badge+id+title, release, state, estimate/todo/actuals, owner), breadcrumb+nav corrected to Track > Team Status.
- [x] P5.e Convert Release Management and Quality/Defect screens.
  - [x] `SCR-07 Quality — Defects` — 12-column Data Table (Rank/ID/Name/User Story/Severity/Priority/State/Flow State/Fixed In Build/Iteration/Submitted By/Owner), new `Severity Badge` (5 variants), reused `Defect Priority Chip` from P5.a, Status Badge for Flow State, pagination footer.
  - [x] Release Management: `ReleasesPage.tsx` (`case "releases"`) is real, coded UI but has **no reachable nav entry** (`NAV_ITEMS` only wires Timeboxes and the Phase-5 Release Planning placeholder) — same orphaned-but-coded situation as `TeamBoardPage`/`PortfolioPage`, resolved under the existing D-002 Tier-B/reference-only decision rather than built as a dev-ready screen. No new Figma screen created for it; documented in `CONVERSION_PROGRESS.md`'s coverage matrix.
- [x] P5.f Add/update query, mutation, rank/reorder and permission contracts.
  - [x] `P5_SCREEN_CONTRACTS.md` — Contracts 10 (Iteration Status), 11 (Team Status), 12 (Quality/Defects); Q-12/Q-13/Q-14 added.
- [x] P5.g Prototype primary transitions; compare Figma against mockup runtime; update coverage.
  - [x] Reuse audit (script-based): SCR-05/06/07 use only component instances, no locally-authored duplicate leaf content.
  - [x] Live-browser comparison blocked by an unrelated pre-existing mockup bug (`PortfolioPage.tsx` missing `SavedViewsDrop` import crashes the whole app on Track navigation) — flagged as a separate task; validated via direct source comparison instead.
  - [x] `CONVERSION_PROGRESS.md` coverage matrix and gate log updated; tracker set to `AWAITING PLAN 5 CONFIRMATION`.

## Exit criteria

- No duplicate tables/filter bars/status components are created for individual screens.
- Every data action has loading, failure and authorization behavior documented.
- All approved Phase 2–3 screens are covered or have an explicit unresolved decision.

## Gate

Set tracker to `AWAITING PLAN 5 CONFIRMATION`; stop until `CONFIRM PLAN 5`.

