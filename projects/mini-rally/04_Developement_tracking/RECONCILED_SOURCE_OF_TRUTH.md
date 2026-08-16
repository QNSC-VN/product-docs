# Mini Rally — Reconciled BA/FE Source of Truth

**Effective date:** 2026-08-14
**Applies to:** Phase 0–6 BA documents, test pack and frontend mockup.
**Scope:** business behavior, screen behavior and session-level FE mock state only. Database, API, infrastructure and persistence after browser refresh remain outside this source.

**Phase 6 addendum (2026-07-31):** Reports are BA/mockup confirmed under `Phase 6/PHASE6_REPORTS_BUSINESS_AND_DATA_CONTRACT.md`. Portfolio Release Tracking is BA/mockup approved and closed for DEV handoff under `Phase 6/01_Release_Tracking/SRS.md`. These Phase 6 contracts supersede the earlier Future Backlog wording for these items only; the closed Phase 0–5 baseline remains unchanged.

**C1-C10 BA correction addendum (confirmed 2026-08-06, aligned 2026-08-09; Owner rule superseded 2026-08-14):** Team is optional on Work Items; Portfolio menu is Portfolio Items/Capacity Planning/Release Tracking; Iteration Status has no separate Type column; Team Status allows Filters and pagination but not local Search/Show Fields; User list excludes Phone and Teams while User Details keeps Phone; Notification Preferences remains Future Backlog; Velocity defaults to Last 10 and persists the user's 5/10 choice; Capacity Features use `Dependencies → Rollup → Estimated → Complete`; Iterations omit Project in single-Project scope but retain Task Estimate. Work Item and Task Owner default to `Unassigned`; when Team is selected, options are `Unassigned` plus that Team's active members; with No Team, only `Unassigned` is available.

**Live-test business alignment (confirmed 2026-08-14; Artifact scope amended 2026-08-15):** Project Key is required, immutable, unique and normalized to 1–10 uppercase alphanumeric characters. Task Estimate/To Do/Actual are independent after the one-time create copy from Estimate to a blank To Do; Task State never changes hours. Team Status shows active members of the selected Team plus `Unassigned` for null-owner Tasks. Release/Milestone assignments are made from existing Work Item and Portfolio Item surfaces; creating new items from an Artifact tab is Future Backlog. Release Detail contains no progress/Task-rollup widgets. Capacity Planned Team Assignment reads and writes the Plan allocation ledger. Audit Log's exact event coverage and sentence format are Not Required for current acceptance.

**Project Access reconciliation (confirmed 2026-08-14):** `Workspace Admin` is the only company-level authority. Every other user may receive `Admin` or `Editor` independently per Project. A user without an assignment has no Project Access row; the Project is hidden and direct access is denied. Viewer and selectable No Access are Future Backlog. Only Workspace Admin manages company users, Projects, Teams, Project access and Team membership. This supersedes every older global-role rule.

## 1. Use this document

This is the current entry point for BA, FE development and QA. It consolidates the BA-confirmed reconciliation decisions C01–C07, mockup checkpoints M1–M5.3 and the closed Phase 5 `P5-GOV v4` baseline. If an older phase document conflicts with this file, update that document before implementation; do not create a new behavior from the older wording.

Implementation handoff and acceptance references are consolidated in:

- `reconciliation/DEV_HANDOFF.md`
- `Phase 5/PHASE5_DEV_HANDOFF.md`
- `Phase 6/PHASE6_REPORTS_BUSINESS_AND_DATA_CONTRACT.md`
- `Mini_Rally_Product_Plan.xlsx`
- `../07_Testing Plan/01_test_phase_1_to_4/specs/E2E_AGILE_LIFECYCLE_RECONCILIATION.md`

## 2. Canonical Agile lifecycle

```text
Portfolio Epic
       ↓
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
8. Task `Estimate`, `To Do` and `Actual` are independent hour fields. On Task creation only, when Estimate is entered and To Do is blank, the system copies Estimate to To Do once. After creation, editing a field or changing Task State, including complete/reopen, never changes the other hour fields.
9. All child Tasks `Completed` auto-change the parent US/DE to `Completed`. Reopening any Task auto-changes the parent to `In-Progress`. Manual parent status changes remain available.
10. When an Iteration is non-empty and all assigned US/DE are `Accepted`, it auto-changes to `Accepted`. Manual Iteration status changes remain available; the system does not auto-reverse it.
11. Portfolio Items use `Epic -> Feature -> Story/Defect -> Task`. Rally's `Initiative` concept is labelled `Epic` in Mini Rally. Epic is Project-level and has no Team or Release assignment. Feature is the lowest Portfolio Item type and the only Portfolio Item type that attaches directly to Story/Defect. A Feature has zero or one Epic; a Story/Defect has zero or one Feature. The Portfolio header Type selector has only `Epic` and `Feature`: Epic renders only in `All Teams`; specific Team + Epic shows `Filter not show item`; specific Team + Feature shows only that Team's Features.
12. Feature has no Plan Estimate field. Capacity Planning stores committed demand as plan-specific manual `allocation.value`, while Feature progress bars show Story/Defect rollups. The `Percent Done by...` bars and left-side `Total Accepted Children` Points/Count meter use live child totals as denominator; the `Estimated Progress by...` bars use Feature top-down refined denominators (`refinedEstimate`, `refinedWorkItemCountEstimate`) or Preliminary Estimate fallback. Epic has the same four progress bars, but rolls up leaf Story/Defect through child Features and uses Epic-owned top-down denominators, not summed child Feature estimates. These Portfolio progress denominators do not drive Capacity demand. Deferred BA note 2026-07-27: the Preliminary Estimate fallback scale/mapping must become user-configurable from `Settings gear > Workspace > Project Management`; the current mock mapping is not a hard-coded final product rule.
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

| Area | Current Phase 0–6 behavior |
|---|---|
| Plan | Backlog (Unscheduled Story/Defect only) and Timeboxes |
| Track | Iteration Status (List-only) and Team Status |
| Plan > Timeboxes > Releases | Sole Phase 3 Release create/edit/detail/artifact surface |
| Portfolio > Portfolio Items | **P5.1 closed for BA/mockup scope 2026-07-28.** Accepted `Epic -> Feature` hierarchy; Type filter, search/show-fields toolbar, root checkbox bulk actions, type-specific inline edit, Epic list/create/detail/children, Feature parent-Epic assignment and four progress bars. Epic has no Team or Release assignment. |
| Portfolio > Capacity Planning | **P5.2 closed for BA/mockup scope 2026-07-28.** Single-Release Plan list/detail; Team selection from Project Breakdown; Plan-level and Team-level Feature add; one-Team assignment and multi-Team allocation; manual/forecast Capacity; live Complete/Rollup; fixed planning Estimated; advisory exceed warnings; Publish variants and Revert to Draft |
| Portfolio > Release Tracking | **Not included in closed Phase 5. Phase 6 BA/mockup approved and closed for DEV handoff.** Dedicated surface governed by `Phase 6/01_Release_Tracking/SRS.md`; it is the final item in the Portfolio menu. |
| Portfolio > Release Planning | Future Backlog; not active in Phase 5 MVP |
| Team Board / Iteration Board | Future Backlog; absent from active navigation |
| Settings gear > Workspaces & Projects | Sole Project-management surface; no separate `Manage Projects` page or top-level Workspace dropdown entry. Single Workspace -> Project -> Team administration tree. Workspace Admin alone performs Project/Team CRUD and manages Project access; Admin/Editor see only their assigned read-only structure. Project-specific Preliminary Estimate points and Hours per point are configurable by Workspace Admin. |
| Settings gear | Personal: Profile & Account, My Permissions. Administration: Workspace Settings, Users, Workspaces & Projects, Permission Model and Audit Log, filtered by effective access. |
| Settings > Users | WA-only company directory. List columns are Name, Email, Role, Status and Last Login; Phone and Team membership belong in User Details, not the list. User Details separates General from Project Access; normal users may have different Access Levels per Project. |
| Settings > Permission Model | Read-only explanation of Workspace Admin plus per-Project Admin and Editor. No custom E/R/D/H matrix editing in this MVP. |

Iteration Status shows current-context Story/Defect rows assigned to the selected Iteration only. `Tasks — N active` counts all persisted child Tasks under the scoped US/DE. The Totals row derives Plan Estimate from scoped US/DE and Task Estimate/To Do from their child Tasks; Task Estimate is the explicit Task Estimate field, not `To Do + Actual`.

Release Detail Artifacts show directly assigned Story, Defect and Feature records. Milestone Detail Artifacts support direct Story, Defect, Feature and Epic records; a directly assigned Feature contributes its Story/Defect descendants, and a directly assigned Epic contributes child Features plus their Story/Defect descendants, to the inherited artifact/rollup scope. Direct and inherited populations are de-duplicated by stable ID and do not rewrite descendant assignments. Creating a new item from Release/Milestone Artifacts, including the shared Work Item/Portfolio Item `Create with details` journeys with prefilled Release/Milestone, is Future Backlog. Release progress, accepted progress, burnup and Task rollups appear only in `Portfolio > Release Tracking`, never in Timeboxes > Release Detail.

Team Status is scoped by the Team selected in its top filter. It lists that Team's active members and groups every null-owner scoped Task under `Unassigned` with `0h` capacity; it must not show an outside-Team member group. Task counts include every persisted child Task whose parent US/DE belongs to the selected Iteration exactly once. Task State uses the full labels `Defined`, `In-Progress`, `Completed` and is inline-editable.

## 5. Identity and mock-state contract

The frontend mockup uses shared, session-level collections for Features, Work Items, Tasks, Iterations, Releases and Milestones. Create creates one record; Cancel creates none. Changes made in Portfolio, Backlog, Work Item Detail, Iteration Status, Team Status, Quality and Timeboxes must show the same ID and business values in the related screens during the session.

This does **not** claim persistence after refresh, API behavior or database behavior.

## 6. Access model

`Workspace Admin` is the only company-level authority and is assigned by internal/dev setup. Workspace Admin is not a Project member and is excluded from Project user/access lists.

Every normal user receives an independent Access Level for each Project:

| Access level | Scope | Effective behavior |
|---|---|---|
| Admin | Assigned Project, automatically All Teams | Full delivery management, including Timeboxes, Release/Milestone, Team Status, Quality, Portfolio, Capacity and Reports; Project/Team/access structure remains read-only |
| Editor | Assigned Project and one or more assigned Teams | Create/Edit/Delete team-scoped US/DE/Task and Quality Defects; update Iteration Status; no planning or administration modules |
| Unassigned user | No Project assignment | Project is hidden and direct access is rejected safely; this is not a selectable permission |

Only Workspace Admin can invite/disable company users, CRUD Projects/Teams, assign Project access or maintain Team membership. Access in one Project never grants visibility in another Project. Project access and Team membership changes apply on next sign-in; company disable/removal applies on next refresh.

Project Key is required, unique and immutable after creation. Input is normalized to uppercase `A-Z/0-9`, limited to 1–10 characters, and is invalid when normalization leaves it empty.

The detailed fixed capability baseline and synchronized User/Project/Team access journeys are governed by `Phase 4/02_Roles_Permissions/SRS.md`.

## 7. Deferred work

- Reports and Release Tracking remain outside the closed Phase 5 scope, but are no longer unconfirmed Future Backlog: they are governed as Phase 6 BA/mockup-approved work. Theme/deeper custom Portfolio Item hierarchy remains Future Backlog.
- Release Tracking's Burnup visual contract is approved. Production historical accuracy and readiness cannot be claimed until DEV implements trustworthy snapshots or auditable event history plus a persisted ideal baseline.
- Release Planning, Multi-Release/Plan of Plans, multiple what-if plans for the same Project+Release, automatic rebalance and velocity-driven automatic capacity: outside the Phase 5 MVP.
- Team Board, Iteration Board, drag/drop, WIP limit and board-specific transitions: Future Backlog.
- Refresh/API/database persistence and all infrastructure behavior: DevInt implementation/verification.

## 8. Required acceptance reference

Before accepting production FE work, run `../07_Testing Plan/01_test_phase_1_to_4/specs/E2E_AGILE_LIFECYCLE_RECONCILIATION.md` together with the relevant scenario pack under `../07_Testing Plan/`. Phase 5-6 production checks are tracked under `../07_Testing Plan/02_test_phase_5_6/`. Phase 5 is closed at BA/mockup scope and its remaining Not Run/Partial scenarios are carried into `Phase 5/PHASE5_DEV_HANDOFF.md` as required DEV/QA acceptance coverage. Production acceptance still requires shared identity, persistence, project scope, authorization, status/roll-up behavior and metrics to agree across screens.
