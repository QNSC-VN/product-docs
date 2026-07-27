# Plan 4 — Convert Screens: Phase 0 and Phase 1

## Goal

Convert Tier A foundational, authentication, project/workspace and work-item screens using confirmed components and patterns.

## Checklist

- [x] P4.a Convert Login and access-state flow.
  - [x] `SCR-00 Login — Default` and `— Invalid credentials`; `SCR-11 Access Denied` and `Not Found` inside the App Shell.
  - [x] Measured against the running mockup; `Search Field` generalised to `Input with Icon`; Button/Icon Button radius corrected to match the mockup on user decision.
- [x] P4.b Convert Home/dashboard and shell entry behavior.
  - [x] `SCR-01 Home — Workspace Admin`: summary strip, My Work, Recent Activity, Project Health, all composed from existing badge/avatar/progress atoms.
  - [x] New `Metric Card` component (3 emphasis variants) for the summary strip.
- [x] P4.c Convert Manage Projects/Teams/Users surfaces that belong to approved scope.
  - [x] `SCR-01A Manage Projects`: header/tab, metric strip, toolbar, projects table with new `Entity Status Badge` component.
  - [x] Scope finding: Teams/User Management are Settings surfaces (Phase 4/Plan 6), not Manage Projects tabs — `ProjectsPage.tsx`'s own `Tabs` only renders "Projects".
- [x] P4.d Convert Work Item Detail, Tasks, Activity and Create/Edit flows not already covered by the pilot.
  - [x] New `Work Item Detail Header` and `Rich Text Field` patterns; 3 screens (Details/Tasks/Revision History) built from existing + new components.
  - [x] Reused P3 `Activity Row` for revision history and P2 `Status Badge` for task state (exact colour match, no new component).
- [x] P4.e Annotate role rules, loading/empty/error and action behavior for each screen.
  - [x] `P4_SCREEN_ANNOTATIONS.md` written for all 7 screens. Two real gaps found: Home has no dedicated read-model contract yet; Manage Projects and Work Item Detail were only built in their full-access (Workspace Admin) form, with a read-only variant still owed.
- [x] P4.f Compare Figma to mockup runtime and correct visual/layout/font mismatches.
  - [x] Confirmed Home structure, Priority Badge colours and Progress track colour against the live app.
  - [x] Found and scoped a real domain-mapping gap: Backlog's Defect priority control is distinct from the standard Priority Badge (P0 G-004) — flagged for Plan 5, not fixed here since it needs a business decision.
- [x] P4.g Update screen coverage, known gaps and screen-level contracts.
  - [x] `P4_SCREEN_CONTRACTS.md` written (Contracts 6-9: Login, Access states, Home, Manage Projects) plus Q-09/Q-10/Q-11.
  - [x] Screen coverage matrix in `CONVERSION_PROGRESS.md` updated for all 5 P4 screens.

## Exit criteria

- Every converted screen uses instances and established patterns.
- Primary and permission/system-state flows are annotated.
- Coverage distinguishes UI parity from real BE readiness.

## Gate

Set tracker to `AWAITING PLAN 4 CONFIRMATION`; stop until `CONFIRM PLAN 4`.

