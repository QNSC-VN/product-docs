# Phase 2 - Mockup Coverage Checklist

Synced date: 2026-06-28

## 1. Phase Scope

Phase 2 is Agile Execution. Current Phase 2 capabilities:

1. P2.1 Backlog Enhancement.
2. P2.2 Iteration Management under `Plan > Timeboxes`.
3. P2.3 Iteration Status under `Track`.

BA decision 2026-06-28:

- `Team Status` moves to Phase 3.
- `Team Board` moves to Backlog for the future.
- Phase 2 focuses on `Iteration Status` linked with Backlog.
- Release Management and Milestones are not Phase 2. They remain Phase 3 scope.
- Workspace selector Project/Team context controls Phase 2 data visibility: Backlog, Timeboxes/Iterations, Iteration Status and related records show only data for the selected Project/Team.
- Create Work Item and Create Iteration auto-fill Project/Team from the selected context.
- Current mock account is Workspace Admin, so admin may switch Project/Team in create/edit forms where enabled; final Project/Team must still be a valid pair.

BA decision 2026-07-06:

- `All Teams` is allowed as a valid Phase 2 context for Backlog, Timeboxes/Iterations and Iteration Status.
- Permission-specific restrictions for create/edit under `All Teams` are deferred to the permissions phase.
- Phase 2 UI hides Release and Milestone type options; those return in Phase 3.
- Backlog and Iteration Status move controls call the real rank/LexoRank behavior, not visual-only mock movement.

## 1A. Global Project/Team Context Rules

| Rule | Requirement |
|---|---|
| Context source | Top workspace selector is the source of selected Project and Team. |
| Data visibility | Backlog, Iterations and related records are filtered to the selected Project/Team. |
| Create defaults | Create Work Item and Create Iteration default Project/Team from the selected context. |
| Admin override | Workspace Admin can change Project/Team in forms where enabled. |
| Validation | Selected Team must belong to selected Project; Iteration assignment must match Work Item Project/Team. |

## 2. P2.1 Backlog Enhancement Scope

Backlog Phase 2.1 inherits Phase 1 Backlog and adds:

- Owner and Release filters.
- Keep quick search `Search work...` in the toolbar.
- Manage Filters lets user select multiple columns and combine filters.
- Sort icon on column headers.
- Header and record typography use consistent 11px text.
- Inline edit Title, Defect Priority, Plan Estimate, Owner, Schedule State, Release.
- Inline edit Iteration; Work Item Detail right panel also shows Iteration.
- Bulk assign Release for selected rows.
- Bulk/selected assignment to Iteration for selected rows if implemented in production controls.
- Backlog reorder by rank controls in mockup.
- Iteration assignment is part of Backlog P2.1 as a Work Item field. It is not Sprint Planning and does not show Iteration metrics.

## 3. P2.1 Mockup Coverage Summary

| Area | Requirement | Mockup status | Mockup source | Notes |
|---|---|---:|---|---|
| Search/filter | Search work + Manage filters | Done | `BacklogPage.tsx` | User selects multiple columns and applies combined filters |
| Filter controls | ID/Name/Est use input; other fields use dropdown | Done | `BacklogPage.tsx` | Includes Iteration dropdown |
| Column sorting | Sort icon on Rank, Type, ID, Name, Priority, Est, Owner, Schedule State, Release | Done | `BacklogPage.tsx` | Rank/text/date/number sorting behavior |
| Table typography | Header title and record text are 11px | Done | `BacklogPage.tsx` | Dense Rally-like list |
| Inline edit | Title | Done | `BacklogPage.tsx` | Mock local state |
| Inline edit | Defect Priority | Done | `BacklogPage.tsx` | Defect only |
| Inline edit | Plan Estimate | Done | `BacklogPage.tsx` | Number input |
| Inline edit | Owner | Done | `BacklogPage.tsx` | Select owner |
| Inline edit | Schedule State | Done | `BacklogPage.tsx` | Select state |
| Inline edit | Release | Done | `BacklogPage.tsx` | Select release |
| Inline edit | Iteration | Done | `BacklogPage.tsx` | Select Timeboxes Iteration or Unscheduled |
| Detail panel | Iteration field | Done | `WorkItemDetailPage.tsx` | Right panel uses same assignment options |
| Bulk action | Assign selected rows to release | Done | `BacklogPage.tsx` | Local mock |
| Backlog reorder | Move up/down rank controls | Done | `BacklogPage.tsx` | Calls production rank/LexoRank behavior |
| Pagination | 10/25/50/100 | Done | `BacklogPage.tsx` | Inherits Phase 1 |
| Column resize | Resizable columns | Done | `BacklogPage.tsx` | Inherits Phase 1 |
| Create Work Item | Story/Defect only | Done | `BacklogPage.tsx` | Inherits Phase 1 decision |
| Context default | Project/Team auto-fill from workspace selector | Business rule | `layout.tsx`, `BacklogPage.tsx` | Admin can override with valid Project/Team pair |

## 4. P2.2 Iteration Management Scope

P2.2 focuses on Iterations inside `Plan > Timeboxes`.

Included:

- Navigation label `Timeboxes`.
- Phase 2 shows Iterations only; Release and Milestone type options are hidden until Phase 3.
- Iterations list view.
- Search, state filter, sortable columns.
- Quick create modal.
- Full-page detail from `Create with details`.
- Full-page detail from row click.
- Detail left content: Theme and Notes.
- Detail right panel: Project, Team, Start Date, End Date, State, Planned Velocity.
- Iterations created in Timeboxes are available as assignment options for Backlog list and Work Item Detail.

Not included:

- Release CRUD/detail/readiness.
- Milestones.
- Dedicated carry-over workflow/modal.
- Iteration Status metrics.
- Team Board, Team Status or Board drag/drop execution.

## 5. P2.2 Mockup Coverage Summary

| Area | Requirement | Mockup status | Mockup source | Notes |
|---|---|---:|---|---|
| Navigation | `Plan > Timeboxes` | Done | `layout.tsx` | Plan submenu label is Timeboxes |
| Page title | Timeboxes | Done | `IterationsPage.tsx` | Subtitle removed |
| Type dropdown | Hidden in Phase 2 | Done | `IterationsPage.tsx` | Iterations is P2.2 scope; Releases/Milestones return in Phase 3 |
| Iterations list | Name, Theme, Start Date, End Date, Project, Planned Velocity, Task Estimate, State | Done | `IterationsPage.tsx` | Rally-like list style |
| Search | Search iterations | Done | `IterationsPage.tsx` | Searches name/theme/project/state |
| Filter | State filter | Done | `IterationsPage.tsx` | All/Planning/Committed/Accepted; assigning scope does not auto-commit |
| Sort | Header sort icons | Done | `IterationsPage.tsx` | Text/date/number/state sorting |
| Quick create | New Iteration modal | Done | `IterationsPage.tsx` | Project, Team, Name, Start Date, End Date, State |
| Context default | Project/Team auto-fill from workspace selector | Business rule | `layout.tsx`, `IterationsPage.tsx` | Admin can override with valid Project/Team pair |
| Required fields | Name, Start Date, End Date, State | Done | `IterationsPage.tsx` | Visual required markers in mock |
| Create with details | Opens full-page detail | Done | `IterationsPage.tsx` | Not modal detail |
| Row click | Opens full-page detail | Done | `IterationsPage.tsx` | Existing record values prefill detail |
| Detail header | Back, type badge, id, name | Done | `IterationsPage.tsx` | Header create button removed |
| Detail left | Theme, Notes | Done | `IterationsPage.tsx` | Theme replaces Description |
| Detail right | Project, Team, Start Date, End Date, State, Planned Velocity | Done | `IterationsPage.tsx` | Project/Team moved from context/subtitle |
| Context duplication | No Project/Team context in top context bar for Timeboxes | Done | `layout.tsx` | Avoid duplicate context in detail |
| Date prefill | Existing row opens valid date input values | Done | `IterationsPage.tsx` | Date string normalized to YYYY-MM-DD |
| Existing backlog assignment | Iteration options available to Backlog and Work Item Detail | Done in mockup | `BacklogPage.tsx`, `WorkItemDetailPage.tsx` | Required to link Backlog with Iteration Status |

## 6. Explicitly Not In Phase 2.2

| Item | Status | Target phase/reason |
|---|---|---|
| Release Management | Deferred | Phase 3 - Release Management |
| Milestones | Deferred | Phase 3 - delivery checkpoint |
| Dedicated Start/Close workflow | Not required by confirmed baseline | User changes Iteration status manually |
| Carry-over unfinished work | Not required by confirmed baseline | Teams manually move Story/Defect items between Iterations |
| Burndown/velocity reporting | Deferred | Reports or future Iteration analytics |
| Team Board | Future backlog | Optional future board view |
| Team Status | Deferred | Phase 3 |
| Board drag/drop | Future backlog | Optional future board behavior |

## 6A. P2.3 Iteration Status Scope

P2.3 focuses only on `Track > Iteration Status`.

Included:

- Phase 2 `Track` scope is Iteration Status only.
- Iteration selector reads Iteration records from `Plan > Timeboxes`.
- Iteration selector combines name and date range in one dropdown control.
- Changing Iteration refreshes summary metrics and list data.
- Metrics: Planned Velocity, Iteration End, Accepted, Defects, Tasks.
- Defects metric counts work items where Type = Defect in the selected Iteration.
- Work item list shows selected Iteration items only.
- Work item list is sourced from Backlog/work_items assigned to the selected Iteration.
- Work item list shows Iteration column and supports inline Iteration update.
- Add Item in Iteration Status creates a new work item directly into the selected Iteration.
- Create-new flow supports Story and Defect only; Feature and Task are not shown in the modal.
- Add Item modal does not include Schedule State.
- Add Item modal does not include Choose Existing Backlog Item.
- Create with details opens the full Work Item Detail page, reusing the Backlog create/detail flow.
- Iteration Status list follows Backlog Enhancement behavior: quick search, Manage Filters, sortable headers, inline edit, pagination, and row click to full work item detail.
- Work item Schedule State values are `Idea / Defined / In-Progress / Completed / Accepted / Release`.
- Per-row Defects column is not shown.
- Quick Create button and bottom Add work item row are not shown.
- Admin has full access during mockup review; detailed permissions will be defined later.

## 6B. P2.3 Mockup Coverage Summary

| Area | Requirement | Mockup status | Mockup source | Notes |
|---|---|---:|---|---|
| Navigation | `Track > Iteration Status` | Done | `layout.tsx` | Team Status is Phase 3; Team Board is future backlog |
| Page title | Title is `Iteration` | Done | `IterationStatusPage.tsx` | Replaces old `Iteration Status` header text |
| Context bar | Remove Project/Release/Iteration/Team top context filters | Done | `IterationStatusPage.tsx`, `layout.tsx` | Avoid duplicated Rally-like context controls |
| Saved Views | Remove Saved Views | Done | `IterationStatusPage.tsx` | Deferred |
| Iteration selector | Combined name/date dropdown + prev/next | Done | `IterationStatusPage.tsx` | Reads `ITERATIONS_DATA` from Timeboxes mock data |
| Context filter | Iteration selector filtered by Project/Team context | Business rule | `layout.tsx`, `IterationStatusPage.tsx` | Only Iterations for selected Project/Team |
| Metrics | Planned Velocity, Iteration End, Accepted, Defects, Tasks | Done | `IterationStatusPage.tsx` | Tasks counts non-Completed child Tasks from the scoped US/DE aggregate; NXP Sprint 24.3 smoke result = 10 active |
| List scope | Show current Iteration Story/Defect work items only | Done | `IterationStatusPage.tsx`, `App.tsx` | Filters selected Iteration and current Project; child Tasks contribute only through parent aggregates and are not rows |
| List columns | Selection, Rank, ID, Type, Name, Schedule State, Iteration, Blocked, Plan Est, Task Est, To Do, Owner | Done | `IterationStatusPage.tsx` | Per-row Defects column removed |
| Totals row | Plan Est, Task Est, To Do totals below column header | Done | `IterationStatusPage.tsx` | NXP Sprint 24.3 smoke result = 21 / 34 / 14 |
| View mode | List only in Phase 0-4 | Done | `IterationStatusPage.tsx` | Active Board toggle removed; Board implementation retained only as Future Backlog |
| Search/filter | Quick search plus Manage Filters | Done | `IterationStatusPage.tsx` | Inherits Backlog Enhancement |
| Filter behavior | ID/Name/Plan Est/Task Est/To Do as input; Type/State/Iteration/Blocked/Owner as dropdown | Done | `IterationStatusPage.tsx` | Multi-column combined filters |
| Sort/resize | Sort icons and resizable columns | Done | `IterationStatusPage.tsx` | Inherits Backlog list pattern |
| Inline edit | Name, Schedule State, Iteration, Plan Est, Owner | Done | `IterationStatusPage.tsx` | Mock local state |
| Detail panel | Iteration field | Done | `WorkItemDetailPage.tsx` | Right panel shows assignment field |
| Schedule State | Idea, Defined, In-Progress, Completed, Accepted, Release | Done | `IterationStatusPage.tsx`, `model.ts` | Shared mock catalog contains no Code Review/Testing/Released and this screen no longer normalizes legacy values locally |
| Row click | Opens full Work Item Detail | Done | `IterationStatusPage.tsx` | Reuses Backlog detail flow |
| Add Item placement | Beside filter controls | Done | `IterationStatusPage.tsx` | Quick Create removed |
| Add Item modal | Create new Story/Defect into selected Iteration | Done | `IterationStatusPage.tsx` | Existing backlog assignment is handled by Work Item Iteration field |
| Create with details | Opens full Work Item Detail | Done | `IterationStatusPage.tsx` | Same behavior pattern as Backlog |
| Bottom add row | Remove bottom Add work item row | Done | `IterationStatusPage.tsx` | Single Add Item entry point |

Follow-up notes to avoid scope loss:

- Define permissions for PO/PM/Developer/Tester/Viewer.
- Move existing backlog items into an Iteration by updating the Work Item Iteration field from Backlog list or Work Item Detail.
- Keep Team Board and Team Status out of Phase 2.
- Keep Iteration Status Board view/toggle and Board drag/drop in Future Backlog; Phase 0-4 uses List only. Dedicated Start/Close and carry-over workflow is not required by the confirmed baseline.
- Keep Release and Milestone management in Phase 3.

## 6C. Moved To Later Phases

`Team Status` and `Team Board` are no longer Phase 2 scope.

Team Status is preserved under Phase 3 documentation. Team Board is preserved under Future Backlog documentation so it is not lost, but dev agents must not prioritize it in current planned phases.

## 7. BA Decisions

| ID | Decision | Status |
|---|---|---|
| P2-BL-DC-001 | Backlog Phase 2.1 still shows only Story and Defect | Decided |
| P2-BL-DC-002 | Iteration assignment is in Backlog Phase 2.1 as a Work Item field, but Sprint Planning/metrics are not | Decided |
| P2-BL-DC-003 | Inline edit is allowed for selected Backlog fields | Decided |
| P2-BL-DC-004 | Move controls call production rank/LexoRank reorder behavior | Decided |
| P2-BL-DC-005 | Quick search stays outside Manage Filters | Decided |
| P2-BL-DC-006 | Manage Filters supports multi-column filter selection | Decided |
| P2-BL-DC-007 | Backlog header/list typography uses 11px | Decided |
| P2-IT-DC-001 | Navigation name is Timeboxes; current production slice is Iterations | Decided |
| P2-IT-DC-002 | Theme is the iteration description field; do not label it Description | Decided |
| P2-IT-DC-003 | Create with details opens full-page detail | Decided |
| P2-IT-DC-004 | Row click opens full-page detail | Decided |
| P2-IT-DC-005 | Project/Team belong in the detail right panel, not top context bar/subtitle | Decided |
| P2-IT-DC-006 | Releases and Milestones move to Phase 3 | Decided |
| P2-IT-DC-007 | Existing backlog Story/Defect assignment into Iteration is a Work Item field available from Backlog and Work Item Detail | Decided |
| P2-IS-DC-001 | P2.3 scope is Iteration Status only under Track | Decided |
| P2-IS-DC-002 | Iteration selector uses Timeboxes Iteration records | Decided |
| P2-IS-DC-003 | Existing backlog item assignment is not in Iteration Status Add Item; it is handled by the Work Item Iteration field | Decided |
| P2-IS-DC-004 | Add Item modal creates Story/Defect only | Decided |
| P2-IS-DC-005 | Work item Schedule State options in Iteration Status are Idea, Defined, In-Progress, Completed, Accepted, Release | Decided |
| P2-IS-DC-006 | Defects metric counts Defect work item type in the selected Iteration; no per-row Defects column | Decided |
| P2-IS-DC-007 | Quick Create and bottom Add work item row are removed from Iteration Status | Decided |
| P2-IS-DC-008 | Tasks card keeps `N active` and counts non-Completed child Tasks of scoped US/DE | Decided |
| P2-IS-DC-009 | Totals row under column header sums Plan Est, child Task Est and child To Do | Decided |
| P2-IS-DC-010 | Iteration Status Board view/toggle moves to Future Backlog; List only in Phase 0-4 | Decided |
| P2-CONTEXT-DC-001 | Workspace selector Project/Team is the global data context for Phase 2 Backlog, Timeboxes/Iterations and Iteration Status | Decided |
| P2-CONTEXT-DC-002 | Create Work Item and Create Iteration auto-fill Project/Team from workspace selector context | Decided |
| P2-CONTEXT-DC-003 | Workspace Admin may override Project/Team in enabled forms, but Team must belong to Project and Iteration assignment must match Project/Team | Decided |
| P2-PHASE-DC-001 | Team Board moves to Backlog for the future | Decided |
| P2-PHASE-DC-002 | Team Status moves to Phase 3 | Decided |

## 8. Conclusion

Mockup coverage is enough to hand P2.1, P2.2 and P2.3 to development planning. Existing Backlog Story/Defect assignment is covered as a Work Item `Iteration` field in Backlog, Work Item Detail and Iteration Status list.

The global workspace selector Project/Team context is a Phase 2 business rule, not only a UI preference. Development must use it to filter data and default Project/Team on create flows.

Phase 2 is now focused on Iteration Status linked with Backlog. Team Status is Phase 3. Team Board is Backlog for the future.

Primary SRS documents:

- [`01_Backlog_Enhancement/SRS.md`](01_Backlog_Enhancement/SRS.md)
- [`02_Iterations/SRS.md`](02_Iterations/SRS.md)
- [`03_Iteration_Status/SRS.md`](03_Iteration_Status/SRS.md)
- [`../Phase 3/01_Team_Status/SRS.md`](../Phase%203/01_Team_Status/SRS.md)
- [`../Future_Backlog/01_Team_Board.md`](../Future_Backlog/01_Team_Board.md)
