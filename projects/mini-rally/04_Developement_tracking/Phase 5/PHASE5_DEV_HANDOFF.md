# Phase 5 Portfolio Module - Developer Handoff

## 0. Document Control

| Attribute | Value |
|---|---|
| Status | `PHASE 5 BA/MOCKUP CLOSED -> DEV HANDOFF READY` |
| Effective date | 2026-07-28 |
| Closed scope | P5.1 Portfolio Items and P5.2 Capacity Planning |
| Removed from Phase 5 | Release Planning and Release Tracking |
| Future direction | Reports may later provide cross-release observation; no Report is specified or implemented by this handoff |
| Production implementation | Not started |
| Primary BA owner | Product/BA |
| Intended readers | DEV, QA, solution architect and Claude document reviewer |

This handoff is the implementation authority for the closed Phase 5 scope. It packages the accepted mockup behavior into development-ready business rules. It does not claim that session-level React mock data, visible controls or browser smoke evidence are production persistence, server authorization or deployment evidence.

## 1. Authoritative Sources

Use these sources in this order:

1. `PHASE5_DEV_HANDOFF.md` - closed scope, invariants, implementation sequence and readiness boundary.
2. `01_Portfolio_Items/SRS.md` - complete P5.1 Feature and Epic behavior.
3. `02_Capacity_Planning/SRS.md` - complete P5.2 functional and calculation rules.
4. `02_Capacity_Planning/BUSINESS_FLOW_AND_UI_CATALOG.md` - Capacity Planning flows and button-by-button behavior.
5. `PHASE5_DEVELOPMENT_TRACKING.md` - decision history and delivery evidence.
6. `../RECONCILED_SOURCE_OF_TRUTH.md` - cross-phase identity, lifecycle, navigation and access contracts.
7. `../../07_Testing Plan/02_test_phase_5_6/PHASE5_TEST_SCENARIOS.md` - DEV/QA acceptance scenarios and traceability.

If a historical Release Planning or Release Tracking document conflicts with this handoff, this handoff wins: neither feature belongs to the closed Phase 5 MVP.

## 2. Closure Decision and Scope

### 2.1 Included

- Portfolio Items hierarchy: `Epic -> Feature -> Story/Defect -> Task`.
- Portfolio Items list, create, inline edit, detail, children, archive and progress rollups.
- Capacity Plan list and single-Release Plan creation.
- Draft/Published lifecycle.
- Team selection, manual Capacity and forecast helper.
- Add Feature, assign, unassign, split allocation, re-rank and remove from Plan.
- Team, Feature and Plan metric calculations, warning rules and Breakdown.
- Publish, Publish Without Updating Fields and Revert to Draft.
- Mockup access behavior and the temporary Capacity Planner Full/View boundary.

### 2.2 Excluded

- Dedicated Release Planning.
- Dedicated Release Tracking.
- Reports, dashboards, burnup and historical trend snapshots.
- Multi Release, Plan of Plans and multiple what-if Plans for one Project and Release.
- Theme or Portfolio Item levels above Epic.
- Automatic capacity rebalance or velocity-driven automatic updates.
- Final Preliminary Estimate mapping configuration UI.
- Final action-level Capacity Planning RBAC redesign.
- Production API shape, database technology, migrations and deployment design.

Reports are the recommended future observation route. That recommendation is a backlog direction only; it is not permission to add a Report during Phase 5 implementation.

## 3. Canonical Domain Model

```text
Workspace
  -> Project
       -> Team
       -> Epic
            -> Feature
                 -> Story | Defect
                      -> Task
       -> Release
       -> CapacityPlan
            -> CapacityPlanTeam
            -> FeatureAllocation
```

Rally leaf/child Projects are represented as Mini Rally Teams. A Capacity Plan belongs to one Mini Rally Project and references one existing Release.

### 3.1 Required cardinalities

- One Epic belongs to exactly one Project and no Team.
- One Epic has zero or many Features.
- One Feature belongs to one Project, may belong to one Team for execution context and may belong to zero or one Epic.
- Story/Defect links to zero or one Feature. It never links directly to Epic.
- Task belongs to exactly one Story/Defect.
- One Capacity Plan belongs to one Project and one Release.
- Only one Capacity Plan may exist for a given `Project + Release`.
- One Capacity Plan has zero or many Team rows.
- One Feature may be present once in a Plan and may have zero, one or many Team allocation rows.
- Split allocation is represented by multiple Feature allocation rows inside the same Plan.

### 3.2 Identity and persistence invariants

- The same entity ID and values must appear in every screen; do not create screen-local copies.
- All edits must persist through a shared domain/API layer.
- Archive is soft removal; history remains addressable.
- Allocation belongs to the Plan. It does not overwrite `Feature.Project` or the Feature's normal execution Team.
- Mutations that change several allocation rows must be atomic.
- Derived metrics are calculated from authoritative current records, not stored as independently editable numbers.
- Publish/revert actions require an auditable actor, timestamp, prior status and result.

## 4. P5.1 Portfolio Items

### 4.1 Hierarchy and scope

- Epic is the Project-level portfolio item. Mini Rally uses the name Epic for the Rally Initiative-like level.
- Feature is the lowest portfolio item and the only portfolio item that Story/Defect can reference.
- Epic appears only in `All Teams` context.
- A specific Team context hides Epic and shows Features for that Team.
- Capacity Planning remains Feature-only; Epic is never allocatable.

### 4.2 Portfolio Items list

Toolbar:

| Control | Behavior |
|---|---|
| Type | Required selector with only `Epic` and `Feature`; no `All` option |
| Search | Filters current Type by ID/name |
| New Portfolio Item | Menu for `New Epic` and `New Feature`; hidden for read-only users |
| Filter | Reserved entry; no extra accepted criteria beyond Type/Search/Show Fields |
| Show Fields | Opens field checkboxes and immediately controls visible grid columns |
| Row checkbox / Select all | Selects visible root rows and opens bulk actions |
| Edit | Enabled for exactly one selection; opens the normal Detail view |
| Delete | Archives selected records; never hard-deletes |

Grid columns are Rank, Type, ID, Name, Release, State, Percent Done By Story Plan Estimate, Percent Done By Story Count, Project, Team and Owner. Columns are sortable/resizable where defined in the SRS.

Inline edit:

- Epic: Name, State, Project and Owner.
- Feature: Name, Release, State, Team and Owner; Project behavior follows the accepted SRS/mockup scope.
- Epic has no Release or Team editor. Its Release cell is `—`; its Team cell shows child Feature count.
- Root Epic/Feature rows have Rank. Child Feature rows under an expanded Epic do not show Rank.

Team/type behavior:

- `All Teams + Epic`: show Epic roots.
- `All Teams + Feature`: show Feature rows.
- `Specific Team + Feature`: show Features in that Team.
- `Specific Team + Epic`: show `Filter not show item`.

### 4.3 Epic

Epic create fields:

- Project - required.
- Name - required.
- State - defaults to `No Entry`.
- Preliminary Estimate - defaults to `No Entry`.
- Owner - required.

Epic Detail uses the shared Portfolio Item layout:

- Header: back, type, ID, Name and action menu.
- Tabs: Details and Children.
- Details main column: Total Accepted Children, Description, Attachments, Notes and What Success Looks Like.
- Right rail: Owner, Project, four progress bars, Preliminary Estimate, State, Milestone, Creation Date, Refined Estimate, Refined Work Item Count Estimate, Planned Start Date, Planned End Date and Market Release Date.
- Epic has no Release field.
- Children lists Features and provides `Add Feature` with the Epic pre-filled.
- Epic archive is blocked while any active child Feature remains.
- Archive never cascades to child Features.
- Epic State remains manual; child states do not auto-change it.
- Epic dates and Milestones do not cascade.

### 4.4 Feature

Feature create/detail must support:

- Project, Team, Epic, Name, State, Preliminary Estimate, Owner and Release where applicable.
- `Create` returns to the list.
- `Create with details` creates once and opens Feature Detail.
- `Epic = Unassigned` removes the parent link.
- Project-scoped Epic and Release choices only.
- Changing Project must clear an invalid cross-Project Epic/Feature relationship rather than preserve bad data.

Feature Detail:

- Details main column: Total Accepted Children, Description, Attachments, Notes and What Success Looks Like.
- Right rail begins with Owner and Project, followed by the four progress bars.
- Feature has Preliminary Estimate and optional Refined Estimate/Refined Work Item Count Estimate.
- Feature has no numeric Plan Estimate field.
- Children lists linked Story/Defect and expands Tasks read-only.
- `Add Item` reuses the shared Work Item creation flow and pre-fills Feature.
- Clicking a child opens the same complete Work Item Detail used by Backlog and execution screens.
- Authorized removal archives; it never hard-deletes.
- Archived Feature cannot receive new Story/Defect children.

### 4.5 Progress formulas

Accepted leaf states for Portfolio progress are `Accepted` and `Release`.

For Feature, let `ALL` be its linked Story/Defect. For Epic, let `ALL` be Story/Defect under every active child Feature.

```text
Percent Done by Story Plan Estimate
  = SUM(ALL.planEstimate where state in [Accepted, Release])
    / SUM(ALL.planEstimate)

Percent Done by Story Count
  = COUNT(ALL where state in [Accepted, Release])
    / COUNT(ALL)

Estimated Progress by Story Points
  = SUM(ALL.planEstimate where state in [Accepted, Release])
    / (portfolioItem.refinedEstimate
       ?? preliminaryPointsFallback)

Estimated Progress by Story Count
  = COUNT(ALL where state in [Accepted, Release])
    / (portfolioItem.refinedWorkItemCountEstimate
       ?? preliminaryCountFallback)
```

Rules:

- Zero denominator renders 0%, never `NaN` or infinity.
- Denominators use all currently existing leaf records; create/archive/reassign changes the value immediately.
- Epic top-down estimates are typed on Epic itself. Never sum child Feature top-down estimates for the Epic denominator.
- `Total Accepted Children` uses the same accepted numerator and switches between Points and Count without changing data.
- Preliminary fallback values in the mockup are temporary. Production must not silently hard-code them as a permanent product rule.

### 4.6 Shared Work Item and Task effects

- Story/Defect created from Feature uses the shared template and is linked by `featureId`.
- `Plan > Backlog` shows only Unscheduled Story/Defect.
- Assigning an Iteration removes the item from Backlog and shows it in the Iteration view; returning to Unscheduled restores it.
- Task Estimate, To Do and Actual are independent.
- Entering Estimate first copies that value to To Do once.
- Later edits are independent.
- Completing a Task sets To Do to 0.
- Reopening does not restore To Do.

## 5. P5.2 Capacity Planning

### 5.1 Plan list and create

Plan list fields: ID, Name, Release, Status, Last Updated and Teams in Plan.

`Add New` requires planner Full access and opens New Capacity Plan:

- Project scope is auto-selected and defines where the Plan is stored.
- Name is required.
- Plan Type is fixed to Single Release.
- Release is required and references an existing Project Release.
- Portfolio Item Type is fixed to Feature.
- View Work Items By is Points or Count and becomes immutable after creation.
- Create makes an empty Draft Plan; it does not auto-add Teams or Features.
- Enforce uniqueness on `Project + Release`.

### 5.2 Draft and Published lifecycle

Draft:

- Visible to planner roles with access to the Project.
- Fully editable for planner Full.
- View-only for planner View.

Published:

- Visible to permitted non-planner viewers.
- Locked for editing.
- Must be manually reverted to Draft before replanning.

Actions:

| Control | Effect |
|---|---|
| Publish Without Updating Fields | Set Plan to Published and change visibility only |
| Publish | Set Plan to Published and copy Release plus accepted planned dates to allocated Features |
| Revert to Draft | Unlock Plan for editing; previously copied Feature values are not rolled back |

Publish never overwrites Feature Project/Team and never cascades to Story/Defect. Release is copied only when the Plan planned start/end dates match the referenced Release start/end dates; on mismatch, publish visibility may proceed but the Feature Release must not be silently overwritten, and the user must receive a clear advisory result.

### 5.3 Team rows and Capacity

- `Add Team` selects Team records from the current Project breakdown.
- Capacity is manually entered per Team and defaults to 0.
- Capacity Forecast is a Draft-only helper based on historical evidence; applying a value is explicit and does not create a continuously recalculated Capacity.
- Removing a Team removes that Team from the Plan and converts that Team's Feature allocation rows to unassigned Plan rows, preserving the Feature in the Plan and preserving its allocation value. The change is transactional.
- Team Capacity is Plan-specific and does not update the Team master record.

### 5.4 Add Feature and assignment

Features may be added:

- From the Features tab: added to the Plan without a Team and shown as yellow `Not assigned`.
- From an expanded Team: added to the Plan with Planned Team Assignment pre-filled to that Team.

Both entry points write the same Plan Feature/allocation ledger. Changes in one tab must immediately appear in the other.

Eligibility:

- Correct Project and Feature type.
- Active and not Archived/Cancelled.
- The Team picker ignores Release so an active Feature from another Release may be discussed in the Plan.
- Display resolution must use the full Feature collection so an existing cross-Release allocation never disappears from the grid.

### 5.5 Allocation, split and removal

`Allocate` is the only split-allocation editor.

- Zero/one Team allocation may be assigned inline or opened in Allocate.
- Multiple Team allocation is edited in Allocate.
- Adding a Team row in Allocate is the split action.
- Each row has a fixed Plan allocation value.
- Save is atomic.
- `SUM(allocation.value)` should not exceed the chosen Feature estimate without an advisory warning; blocking behavior is not accepted.
- `Unassign` on a one-Team row keeps the Feature in the Plan and returns it to yellow `Not assigned`.
- `Remove from Plan` deletes every allocation row for the Feature across all Teams and removes it from the Plan. It does not edit/archive the Portfolio Feature.
- There is no `Remove from Team` action in the final UI.

Estimate precedence for the Features tab and allocation default:

```text
Displayed Feature Estimated:
  1. Total Allocated across assigned Team rows, when > 0
  2. Feature Refined Estimate, when > 0
  3. Preliminary Estimate fallback
  4. 0 / Point Estimated missing

Blank allocation-dialog default:
  Refined Estimate -> Preliminary Estimate fallback -> 0
```

Do not feed Total Allocated back into a blank allocation field; that creates a circular definition.

### 5.6 Metrics

Capacity Planning counts `Completed`, `Accepted` and `Release` as complete. Moving a child back to `In-Progress` removes it from Complete immediately.

Feature within one Team allocation:

```text
Complete Points = SUM(linked Story/Defect planEstimate
                      where state in [Completed, Accepted, Release]
                      and scoped to that Team allocation)
Rollup Points   = SUM(all linked Story/Defect planEstimate
                      scoped to that Team allocation)
Estimated       = allocation.value for the Team row
```

Count mode uses child count instead of Plan Estimate.

Feature tab parent row:

- Complete and Rollup are total live child values across the Feature.
- Estimated uses the precedence rule above.
- Split Feature parent shows total; allocation subrows show Team slices.
- Features-tab metric columns are ordered `Dependencies → Rollup → Estimated → Complete`; the numeric values show numbers only, not percentages.

Team:

```text
Demand/Estimated = SUM(allocation.value for Team)
Rollup           = SUM(Feature/Team Rollup)
Complete         = SUM(Feature/Team Complete)
Capacity         = manual Plan input
percentage       = metric / Capacity * 100
```

Plan totals sum Team metrics once. Avoid double-counting split Feature parent and allocation subrows.

### 5.7 Progress and warning rules

Color contract:

- Complete - dark blue.
- Rollup - light blue.
- Estimated - hatched/forecast.
- Capacity - green baseline.

Warnings are advisory:

- `Rollup > Estimated`.
- `Rollup > Capacity` at Team/Plan level.
- `Estimated > Capacity` at Team/Plan level.
- `Point Estimated missing` when Preliminary, Refined and Allocated values are all absent.

Feature has no Capacity baseline, so its exceed rule is only `Rollup > Estimated`.

Warning icons and tooltips:

- Use red triangle/exclamation.
- Team Feature count shows how many child Features require attention.
- Hover/focus overlays must render above the grid and must not be clipped by overflow containers.
- Breakdown must use one shared scale for Complete, Rollup, Estimated and Capacity.

### 5.8 Final action catalog

The exhaustive visual/button catalog is in `02_Capacity_Planning/BUSINESS_FLOW_AND_UI_CATALOG.md`. Critical actions are:

- Add New.
- Create / Cancel.
- Add Team / remove Team.
- Capacity edit.
- Calculate Capacity Forecast / Apply.
- Add Feature.
- Planned Team Assignment / Unassign.
- Allocate / add split row / remove split row / Save / Cancel.
- Move up / Move down.
- Remove from Plan.
- Breakdown.
- Publish Without Updating Fields.
- Publish.
- Revert to Draft.

All mutation controls are hidden or disabled in Published and Viewer contexts.

## 6. Access and Authorization Boundary

### 6.1 Portfolio Items

- Workspace Admin: manage every Project.
- Project `Admin`: manage Portfolio Items in the assigned Project.
- Project `Viewer`: read-only across the assigned Project.
- Project `Editor` and `No Access`: Portfolio is hidden.
- Access in one Project grants nothing in another Project.
- Archive and create/edit actions require management permission.

### 6.2 Capacity Planning

- Workspace Admin manages plans in every Project.
- Project `Admin` manages Draft/Published plans in the assigned Project.
- Project `Viewer` can open Draft/Published plans read-only for the assigned Project.
- Project `Editor` and `No Access` cannot open Capacity Planning.
- Permission Model is explanatory and read-only; Capacity permissions are not customized per action.
- DEV must enforce Project access server-side and not rely on hidden UI controls.

## 7. Cross-Module Integration Contract

- Timeboxes owns Release and Iteration creation/edit.
- Portfolio never creates a Release.
- Feature Release selectors are Project-scoped.
- Capacity Plan references one existing Release.
- Portfolio Feature fields and Work Item `featureId` use shared identity.
- Portfolio child progress reacts to Work Item lifecycle edits made anywhere.
- Capacity Complete/Rollup reacts to the same Work Item records.
- Capacity publish changes only the accepted Feature fields.
- Backlog and Iteration visibility follows Iteration assignment.
- Task hours follow the shared Task rule; Portfolio introduces no Task variant.
- Audit should capture create/edit/archive, allocation, publish and revert mutations.

## 8. Recommended DEV Implementation Order

1. Finalize schema/domain objects and migration plan for Epic, Feature estimates, Capacity Plan, Plan Team and Allocation.
2. Implement repositories/services with uniqueness, archive and transaction invariants.
3. Implement server-side authorization and Project/Team scoping.
4. Implement derived Portfolio leaf aggregation and tests.
5. Implement Portfolio Items APIs and UI.
6. Implement Capacity Plan lifecycle APIs.
7. Implement Team Capacity and allocation ledger, including split transactions.
8. Implement metrics, warnings and Breakdown from shared calculation services.
9. Implement publish/revert with audit history and idempotency.
10. Integrate Timeboxes, Backlog, Work Item Detail and Task data.
11. Run Phase 5 functional, negative, authorization and regression scenarios.
12. Obtain DEV/QA/UAT evidence before production-readiness sign-off.

Do not implement Reports or Release Tracking as an opportunistic extra during this sequence.

## 9. Minimum API/Service Expectations

The handoff does not prescribe REST versus another transport, but production behavior needs:

- Query Portfolio Items by Project, Team context, Type, active/archive state, search, sort and pagination.
- Create/update/archive Epic and Feature with optimistic concurrency or equivalent conflict protection.
- Query leaf rollups without client-side full-dataset assumptions.
- Query/create/update Capacity Plans with `Project + Release` uniqueness.
- Add/remove Plan Teams and update manual Capacity.
- Add Feature to Plan, assign/unassign, split, reorder and remove from Plan.
- Publish without Feature updates; Publish with atomic validated Feature updates; Revert to Draft.
- Calculate the same metrics on every surface from one shared rules implementation.
- Return explicit validation/authorization errors; UI visibility is not security.
- Provide audit facts for state-changing actions.

## 10. Validation and Error Rules

- Required fields reject blank submission.
- IDs and foreign keys must resolve inside authorized scope.
- Cross-Project Epic/Feature/Release assignment is rejected.
- Archived/Cancelled records are excluded from new planning assignment.
- Duplicate Plan for the same Project+Release is rejected.
- Allocation values and Capacity are non-negative numeric values.
- Split Save rejects duplicate Team rows for the same Feature unless product design explicitly supports them later.
- Published Plan rejects every mutation except authorized Revert to Draft.
- Archive Epic with active child Features is rejected.
- Archive Feature with new-child attempts is rejected.
- Zero-denominator progress safely returns zero.
- Concurrent publish/replan actions must not partially update Features or allocations.

## 11. DEV/QA Acceptance Package

Primary scenario pack: `../../07_Testing Plan/02_test_phase_5_6/PHASE5_TEST_SCENARIOS.md`.

The mockup evidence in that file proves BA behavior and visual direction only. DEV must execute the scenarios again against the production implementation, including:

- CRUD and archive persistence.
- Cross-screen identity.
- Project/Team negative scope.
- Project `Admin` assigned-Project manage scope and denied unassigned-Project scope.
- Project `Viewer` read-only scope; `Editor`/`No Access` hidden scope.
- Draft visibility and Published lock.
- Split allocation atomicity.
- Remove from Plan across all Teams.
- Metric recalculation after child state/estimate changes.
- Publish without fields versus Publish with fields.
- Revert without rollback.
- Error handling and audit evidence.
- Regression for Timeboxes, Backlog, Iteration Status, Work Item Detail and Task flow.

Phase 5 is not production-ready until these checks pass in the target environment.

## 12. Known Mockup Constraints

- Current state is session-level React data.
- Browser refresh may reset data.
- Mockup permissions demonstrate UX paths, not server enforcement.
- Current Preliminary Estimate mapping is temporary.
- The Capacity Planner permission is coarse Full/View.
- Some historical test rows are marked Not Run or Partial because they are retained as DEV acceptance coverage, not because Phase 5 BA scope remains open.
- Vite build currently emits a chunk-size warning; it is not a Phase 5 functional failure.

## 13. Future Backlog

- User-defined Preliminary Estimate points/count mapping under `Settings > Workspace > Project Management`.
- Detailed Portfolio and Capacity action-level RBAC.
- Reports for cross-release/portfolio observation.
- Release Planning.
- Release Tracking only if later evidence shows Reports are insufficient.
- Historical snapshots, burnup and trend analysis.
- Multi Release, Plan of Plans and multiple scenarios.
- Automatic rebalance and velocity-driven Capacity.
- Theme/deeper Portfolio hierarchy.

Every future item requires a new proposal, explicit BA confirmation, SRS/test alignment and its own delivery gate.

## 14. Claude Review Checklist

Claude should verify:

1. No active source still requires Release Tracking to close Phase 5.
2. Reports are described only as Future Backlog, never as implemented.
3. Epic has no Team or Release and archives without cascade.
4. Epic Estimated Progress denominators use Epic-owned top-down estimates.
5. Feature has no Plan Estimate field.
6. Portfolio accepted states and Capacity complete states are intentionally different.
7. Allocation is Plan-specific and never overwrites Feature Project/Team.
8. Feature Estimated precedence and allocation-dialog default are not circular.
9. Split totals are not double-counted.
10. Publish Without Updating Fields, Publish and Revert have distinct effects.
11. Draft/Published visibility and mutation rules are explicit.
12. Mockup close, developer handoff readiness and production readiness are not conflated.

## 15. Handoff Disposition

Phase 5 is closed for BA/mockup scope on 2026-07-28. DEV may begin production analysis and implementation from this package. Any rule change discovered during design or implementation must be returned to BA for confirmation before the SRS or behavior is changed.
