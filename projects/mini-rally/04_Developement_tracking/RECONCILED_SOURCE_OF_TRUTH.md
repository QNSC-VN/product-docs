# Mini Rally — Reconciled BA/FE Source of Truth

**Effective date:** 2026-07-26
**Applies to:** Phase 0–5 BA documents, test pack and frontend mockup.
**Scope:** business behavior, screen behavior and session-level FE mock state only. Database, API, infrastructure and persistence after browser refresh remain outside this source.

## 1. Use this document

This is the current entry point for BA, FE development and QA. It consolidates the BA-confirmed reconciliation decisions C01–C07, mockup checkpoints M1–M5.3 and the Phase 5 `P5-GOV v2` baseline. If an older phase document conflicts with this file, update that document before implementation; do not create a new behavior from the older wording.

Implementation handoff and acceptance references are consolidated in:

- `reconciliation/DEV_HANDOFF.md`
- `Mini_Rally_Product_Plan.xlsx`
- `../07_Test Business/specs/E2E_AGILE_LIFECYCLE_RECONCILIATION.md`

## 2. Canonical Agile lifecycle

```text
Portfolio Feature
       ↓
Backlog US/DE -> Iteration -> child Tasks -> US/DE status -> Iteration status
       ↓
Release <-> Milestone
```

1. Release and Milestone may be created in either order and linked many-to-many.
2. A Milestone can span multiple Projects/Teams. When it has no linked Release, user manually sets Target Start/End. Once one or more Releases are linked, Target Start = `MIN(startDate)` and Target End = `MAX(endDate)` of the linked Releases; the derived values replace manual dates while the links exist.
3. A Story/Defect has zero or one Release and zero or many Milestones. Changing Release never removes existing selected Milestones. If a Release is selected, only *new* Milestone options are limited to that Release's related Milestones.
4. New US/DE defaults to Schedule State = Flow State = `Idea`.
5. New Iteration defaults to `Planning`. Assigning a US/DE does not change it. An authorized user manually changes it to `Committed` when the scope is committed. `Committed` never locks scope.
6. Plan > Backlog shows only Story/Defect items whose Iteration is `Unscheduled`. Assigning a Story/Defect to an Iteration removes it from Backlog and makes it visible in that Iteration's execution/status views; moving it back to `Unscheduled` returns it to Backlog.
7. Task is always a child of Story/Defect, inherits its parent Work Item context and never appears as a standalone Backlog/Iteration Status row.
8. Task `Estimate`, `To Do` and `Actual` are independent hour fields. If the Owner enters Estimate first, the system copies that same value to To Do once; after that, the fields are manually editable independently. Marking a Task `Completed` sets To Do to 0; reopening does not auto-restore To Do.
9. All child Tasks `Completed` auto-change the parent US/DE to `Completed`. Reopening any Task auto-changes the parent to `In-Progress`. Manual parent status changes remain available.
10. When an Iteration is non-empty and all assigned US/DE are `Accepted`, it auto-changes to `Accepted`. Manual Iteration status changes remain available; the system does not auto-reverse it.
11. Feature is the only Phase 5 Portfolio Item level. A Story/Defect has zero or one Feature; Theme and Initiative are not active scope.
12. Feature has no Plan Estimate field. Capacity Planning stores committed demand as plan-specific manual `allocation.value`, while Feature progress bars show Story/Defect rollups. The `Percent Done by...` bars and left-side `Total Accepted Children` Points/Count meter use live child totals as denominator; the `Estimated Progress by...` bars use Feature top-down refined denominators (`refinedEstimate`, `refinedWorkItemCountEstimate`) or Preliminary Estimate fallback. These Feature progress denominators do not drive Capacity demand. Deferred BA note 2026-07-27: the Preliminary Estimate fallback scale/mapping must become user-configurable from `Settings gear > Workspace > Project Management`; the current mock mapping is not a hard-coded final product rule.
13. Capacity Planning uses the Mini Rally hierarchy `Workspace -> Project -> Team`. Rally child Project/Scrum Team rows are represented as Team rows under the selected Project.
14. A Capacity Plan is unique per `Project + Release`, starts as `Draft`, and can be `Published`. Draft allocation rows are plan-specific and may split one Feature across multiple Teams. `Publish Without Updating Fields` changes visibility/status only; `Publish` also writes Release and planned dates to allocated Features without overwriting Feature Project/Team and without cascading to child Story/Defect.

## 3. Status contracts

| Entity | Allowed values | Rule |
|---|---|---|
| Story / Defect Schedule State | Idea, Defined, In-Progress, Completed, Accepted, Release | Mirrors Flow State in both directions for the MVP |
| Story / Defect Flow State | Idea, Defined, In-Progress, Completed, Accepted, Release | Mirrors Schedule State in both directions for the MVP |
| Task State | Defined, In-Progress, Completed | Separate Task lifecycle |
| Defect State | Submitted, Open, Fixed, Closed, Closed Declined | Separate from Schedule/Flow State |
| Iteration State | Planning, Committed, Accepted | Assignment never auto-commits |
| Release State | Planning, Active, Accepted | Release management state, separate from US/DE state |
| Feature State | No Entry, Intake, Idea Prioritization, Problem Discovery, Solution Discovery, Feature Prioritization, Developing, Accepted, Measuring, Done, Cancelled | Portfolio lifecycle, separate from Story/Defect Schedule/Flow state |

`Code Review`, `Testing` and `Released` are not valid US/DE Schedule/Flow values. A screen must not silently normalize legacy values; invalid legacy data needs migration or validation at its source.

## 4. Screen and navigation boundaries

| Area | Current Phase 0–5 behavior |
|---|---|
| Plan | Backlog (Unscheduled Story/Defect only) and Timeboxes |
| Track | Iteration Status (List-only) and Team Status |
| Plan > Timeboxes > Releases | Sole Phase 3 Release create/edit/detail/artifact surface |
| Portfolio > Portfolio Items | P5.1 Feature list/detail/children mockup implemented; project/RBAC, field-data, Archive and acceptance gaps remain |
| Portfolio > Capacity Planning | P5.2 single-Release Capacity Plan list/detail; Add Team from Project Breakdown; Add Features to Plan; split allocation demand vs manual capacity; Publish variants |
| Portfolio > Release Tracking | P5.3 KPI + Feature list after Capacity Planning; Story/Defect Plan Estimate-based progress, zero-estimate items shown separately, no automatic Release state change |
| Portfolio > Release Planning | Future Backlog; not active in Phase 5 MVP |
| Team Board / Iteration Board | Future Backlog; absent from active navigation |
| Settings gear > Workspace > Project Management | Projects only |
| Settings gear | Workspace Settings, Project Management, Teams and User Management |

Iteration Status shows current-context Story/Defect rows assigned to the selected Iteration only. `Tasks — N active` counts all persisted child Tasks under the scoped US/DE. The Totals row derives Plan Estimate from scoped US/DE and Task Estimate/To Do from their child Tasks; Task Estimate is the explicit Task Estimate field, not `To Do + Actual`.

## 5. Identity and mock-state contract

The frontend mockup uses shared, session-level collections for Features, Work Items, Tasks, Iterations, Releases and Milestones. Create creates one record; Cancel creates none. Changes made in Portfolio, Backlog, Work Item Detail, Iteration Status, Team Status, Quality and Timeboxes must show the same ID and business values in the related screens during the session.

This does **not** claim persistence after refresh, API behavior or database behavior.

## 6. Access model

Technical roles are only `Workspace Admin`, `Project Admin` and `Project Member`. Business personas may be mentioned for workflow context, but are not additional technical access roles.

- Workspace Admin can view and manage Portfolio Features across all Projects.
- Project Admin can view and manage Portfolio Features only within Projects they manage.
- Project Member can view Portfolio data read-only only for their assigned Project/Team and cannot create, edit or archive Features.
- Workspace Admin can manage every Capacity Plan. Project Admin can manage Capacity Plans only for Projects they administer. Project Member can view Capacity Planning read-only only for the assigned Team.
- The existing Phase 0-4 restriction remains: Project Member does not access Timeboxes, Release/Milestone planning, Team Status, Quality or administration.

## 7. Deferred work

- Generic Reports and a Theme/Initiative hierarchy: outside Phase 5.
- Release burnup/trend charts: deferred until trustworthy historical snapshots exist.
- Release Planning, Multi-Release/Plan of Plans, multiple what-if plans for the same Project+Release, automatic rebalance and velocity-driven automatic capacity: outside the Phase 5 MVP.
- Team Board, Iteration Board, drag/drop, WIP limit and board-specific transitions: Future Backlog.
- Refresh/API/database persistence and all infrastructure behavior: DevInt implementation/verification.

## 8. Required acceptance reference

Before accepting FE work, run `../07_Test Business/specs/E2E_AGILE_LIFECYCLE_RECONCILIATION.md` together with the relevant `../07_Test Business/specs/PHASE*_TEST_SCENARIOS.md`. Phase 5 cannot close until its dedicated business/UAT scenarios and traceability are added and executed. Acceptance requires shared identity, project scope, authorization, status/roll-up behavior and metrics to agree across screens.
