# P8 UI / API Contract Matrix

## Boundary

This is a Figma-to-development handoff for the accepted Phase 5 mockup scope. It specifies client contracts and state/role behavior; it is not evidence of production persistence, server authorization or reporting implementation.

## Portfolio Items

| Screen / state | Read model | Commands | Rules to enforce server-side |
|---|---|---|---|
| `SCR-P8-01 Portfolio Items` | Portfolio Item list filtered by project, team, type, release, lifecycle state and archive filter; hierarchy payload contains `Epic -> Feature` and leaf progress rollups | Create Epic, Create Feature, update allowable fields, archive selected item | Epic rows are available only for `All Teams`; a Feature belongs to at most one Epic; project/team scoping and archive visibility must be authorization-aware. |
| `SCR-P8-02 Epic Detail` | Epic fields, active child Features, leaf Story/Defect rollups and four progress measures | Update Epic; create child Feature; archive Epic | Archive Epic only if it has no active child Feature. All rollup values are read-only and calculated from leaf data. |
| `SCR-P8-03 Feature Detail — Archived / Read-only` | Feature fields, Epic parent, current allocation-derived context and history visibility | None in archived state | Archived Feature remains visible in history and must be read-only. Restore is not P5 scope. |
| `DIA-P8 New Epic / New Feature` | Projects, role-scoped teams, eligible Epic parents, releases and Portfolio lifecycle options | Create Epic / Feature, optionally return new item for details route | Feature has no direct Plan Estimate. Preliminary estimate is a size category; numeric point/count mapping is configuration-owned and not hard-coded. |

### Portfolio response fields

`id`, `type`, `name`, `projectId`, `teamId` (Feature only), `epicId` (Feature only), `owner`, `releaseId`, `portfolioState`, `preliminaryEstimate`, `refinedEstimate`, `refinedWorkItemCountEstimate`, `archivedAt`, child/leaf rollup summaries.

### Portfolio role matrix

| Role | View | Create / edit | Archive |
|---|---|---|---|
| Workspace Admin | All scoped Portfolio Items | Yes | Yes, subject to dependency rules |
| Project Admin | Project-scoped items | Yes, inside authorized project | Yes, subject to dependency rules |
| Project Member | Published/readable scoped data only | No | No |

## Capacity Planning

| Screen / state | Read model | Commands | Rules to enforce server-side |
|---|---|---|---|
| `SCR-P8-04 Capacity Plans` | Plans filtered by project/release; visible status, release, team summary, last updated | Create Capacity Plan; open plan | Project Member may see only Published plans. One plan per Project + Release is the P5 assumption. |
| `SCR-P8-05 Capacity Plan — Draft` | Plan, Features, Teams by Total, allocations, demand/capacity/forecast and warnings | Add Feature, add/remove team, allocate, forecast, publish | All planning mutation is Draft-only. Allocation is fixed and plan-specific, may split one Feature across Teams and never changes `Feature.projectId`. |
| `SCR-P8-06 Capacity Plan — Published / Read-only` | Same read model as Draft | Revert to Draft for an authorized planner | Published is immutable/read-only until explicit Revert to Draft. |
| `DIA-P8 Capacity Allocation & Forecast` | Eligible Features, selectable Teams, existing allocations and historic velocity input | Apply allocations; calculate/apply forecast | Forecast is a Draft-only planning aid and may be overwritten. Exceed-capacity warnings must remain visible after apply. |

### Capacity response fields

`planId`, `projectId`, `releaseId`, `name`, `status`, `viewBy`, `features[]`, `teams[]`, `allocations[]`, `totalCapacity`, `complete`, `rollup`, `estimated`, `forecast`, `warningFlags`, `lastUpdated`.

### Critical validation rules

1. Do not use client-only hidden controls as authorization; authorize every query and command.
2. Treat Portfolio rollups as derived/read-only values, not user-editable payload fields.
3. Keep Draft/Published transitions explicit, auditable and concurrency-safe.
4. Reject capacity allocation changes for a Published plan.
5. Preserve the selected project/release/team scope when returning from dialog or detail flows.
