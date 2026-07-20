# Mini Rally — Reconciled BA/FE Source of Truth

**Effective date:** 2026-07-20
**Applies to:** Phase 0–4 BA documents, test pack and frontend mockup.
**Scope:** business behavior, screen behavior and session-level FE mock state only. Database, API, infrastructure and persistence after browser refresh remain outside this source.

## 1. Use this document

This is the current entry point for BA, FE development and QA. It consolidates the BA-confirmed reconciliation decisions C01–C07 and mockup checkpoints M1–M5.3. If an older phase document conflicts with this file, update that document before implementation; do not create a new behavior from the older wording.

Implementation handoff and acceptance references are consolidated in:

- `reconciliation/DEV_HANDOFF.md`
- `Mini_Rally_Product_Plan.xlsx`
- `../07_Test Business/specs/E2E_AGILE_LIFECYCLE_RECONCILIATION.md`

## 2. Canonical Agile lifecycle

```text
Release <-> Milestone
            ↓
Backlog US/DE -> Iteration -> child Tasks -> US/DE status -> Iteration status
```

1. Release and Milestone may be created in either order and linked many-to-many.
2. A Milestone can span multiple Projects/Teams. When it has no linked Release, user manually sets Target Start/End. Once one or more Releases are linked, Target Start = `MIN(startDate)` and Target End = `MAX(endDate)` of the linked Releases; the derived values replace manual dates while the links exist.
3. A Story/Defect has zero or one Release and zero or many Milestones. Changing Release never removes existing selected Milestones. If a Release is selected, only *new* Milestone options are limited to that Release's related Milestones.
4. New US/DE defaults to Schedule State = Flow State = `Idea`.
5. New Iteration defaults to `Planning`. Assigning a US/DE does not change it. An authorized user manually changes it to `Committed` when the scope is committed. `Committed` never locks scope.
6. Task is always a child of Story/Defect, inherits its Iteration and never appears as a standalone Backlog/Iteration Status row.
7. All child Tasks `Completed` auto-change the parent US/DE to `Completed`. Reopening any Task auto-changes the parent to `In-Progress`. Manual parent status changes remain available.
8. When an Iteration is non-empty and all assigned US/DE are `Accepted`, it auto-changes to `Accepted`. Manual Iteration status changes remain available; the system does not auto-reverse it.

## 3. Status contracts

| Entity | Allowed values | Rule |
|---|---|---|
| Story / Defect Schedule State | Idea, Defined, In-Progress, Completed, Accepted, Release | Mirrors Flow State in both directions for the MVP |
| Story / Defect Flow State | Idea, Defined, In-Progress, Completed, Accepted, Release | Mirrors Schedule State in both directions for the MVP |
| Task State | Defined, In-Progress, Completed | Separate Task lifecycle |
| Defect State | Submitted, Open, Fixed, Closed, Closed Declined | Separate from Schedule/Flow State |
| Iteration State | Planning, Committed, Accepted | Assignment never auto-commits |
| Release State | Planning, Active, Accepted | Release management state, separate from US/DE state |

`Code Review`, `Testing` and `Released` are not valid US/DE Schedule/Flow values. A screen must not silently normalize legacy values; invalid legacy data needs migration or validation at its source.

## 4. Screen and navigation boundaries

| Area | Current Phase 0–4 behavior |
|---|---|
| Plan | Backlog and Timeboxes |
| Track | Iteration Status (List-only) and Team Status |
| Plan > Timeboxes > Releases | Sole Phase 3 Release create/edit/detail/artifact surface |
| Portfolio > Release Planning | Phase 5 placeholder only; no Release create/edit or progress calculation in Phase 0–4 |
| Team Board / Iteration Board | Future Backlog; absent from active navigation |
| Manage Projects | Projects only |
| Settings gear | Teams and User Management |

Iteration Status shows current-context Story/Defect rows only. `Tasks — N active` counts all persisted child Tasks under the scoped US/DE. The Totals row derives Plan Estimate from scoped US/DE and Task Estimate/To Do from their child Tasks.

## 5. Identity and mock-state contract

The frontend mockup uses shared, session-level collections for Work Items, Tasks, Iterations, Releases and Milestones. Create creates one record; Cancel creates none. Changes made in Backlog, Work Item Detail, Iteration Status, Team Status, Quality and Timeboxes must show the same ID and business values in the related screens during the session.

This does **not** claim persistence after refresh, API behavior or database behavior.

## 6. Access model

Technical roles are only `Workspace Admin`, `Project Admin` and `Project Member`. Business personas may be mentioned for workflow context, but are not additional technical access roles. Project Member is limited to assigned Project/Team and does not access Timeboxes, Release/Milestone planning, Team Status, Quality or administration.

## 7. Deferred work

- Release Progress, percentage, zero-state and recalculation: Phase 5 `Portfolio > Release Planning`.
- Team Board, Iteration Board, drag/drop, WIP limit and board-specific transitions: Future Backlog.
- Refresh/API/database persistence and all infrastructure behavior: DevInt implementation/verification.

## 8. Required acceptance reference

Before accepting FE work, run `../07_Test Business/specs/E2E_AGILE_LIFECYCLE_RECONCILIATION.md` together with the relevant `../07_Test Business/specs/PHASE*_TEST_SCENARIOS.md`. Acceptance requires shared identity, status/roll-up behavior and metrics to agree across screens.
