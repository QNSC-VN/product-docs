# Phase 2 Test Scenarios - Agile Execution

Phase 2 validates the execution chain: Backlog Enhancement, Timeboxes/Iterations and Iteration Status.

Important scope rules:

- `All Teams` is allowed as a valid Phase 2 context.
- Permission-specific restrictions for create/edit under `All Teams` are deferred.
- Team Status, Release Management, Milestones and Quality/Defect are Phase 3.
- Team Board, board drag/drop, WIP limits and board transition rules are Future Backlog.
- Iteration Status must read Work Items assigned from Backlog; it must not use a separate execution-only item store.

## P2-CONTEXT - Global Project/Team Context

| ID | Priority | Scenario | Steps | Expected result | Status |
|---|---|---|---|---|---|
| P2-CTX-001 | P0 | Context filters Backlog | Select Project A/Team A; open Backlog | Backlog shows only Story/Defect for selected Project/Team | Not Run |
| P2-CTX-002 | P0 | Context filters Timeboxes | Select Project A/Team A; open Plan -> Timeboxes | Iterations shown belong only to selected Project/Team | Not Run |
| P2-CTX-003 | P0 | Context filters Iteration Status selector | Select Project A/Team A; open Track -> Iteration Status | Iteration selector only lists Iterations for selected context | Not Run |
| P2-CTX-004 | P0 | Switching context refreshes all Phase 2 screens | Switch Project/Team while on Backlog/Timeboxes/Iteration Status | Lists/selectors reload; stale data from old context is not shown | Not Run |
| P2-CTX-005 | P1 | All Teams context | Select Project with All Teams | Backlog, Timeboxes and Iteration Status accept this context per Phase 2 rule | Not Run |
| P2-CTX-006 | P0 | Invalid Project/Team pair rejected | Attempt create/update with Team outside selected Project | Validation rejects mutation | Not Run |

## P2-BL - Backlog Enhancement

| ID | Priority | Scenario | Steps | Expected result | Status |
|---|---|---|---|---|---|
| P2-BL-001 | P0 | Enhanced Backlog loads with context | Open Backlog under selected Project/Team | List respects context and inherits Phase 1 Story/Defect scope | Not Run |
| P2-BL-002 | P1 | Quick search | Search by ID/title/owner | Matching rows appear; no-result state works | Not Run |
| P2-BL-003 | P1 | Manage Filters | Add combined filters such as Type + Owner + Iteration | Filtered list matches criteria; filters can be cleared | Not Run |
| P2-BL-004 | P1 | Sort columns | Sort by ID, Name, Schedule State, Plan Est, Iteration | Rows sort correctly by data type | Not Run |
| P2-BL-005 | P1 | Column resize | Resize columns | Table remains usable and layout stable | Not Run |
| P2-BL-006 | P0 | Inline edit title/status/estimate/owner | Edit supported cells | Save persists; validation errors stay visible; failed save rolls back or marks retry | Not Run |
| P2-BL-007 | P0 | Iteration field visible/editable | Assign Story/Defect to a valid Iteration | Item stores `iterationId`; it remains in Backlog and appears in selected Iteration Status | Not Run |
| P2-BL-008 | P0 | Invalid iteration assignment rejected | Assign item to Iteration from different Project/Team | Validation rejects assignment | Not Run |
| P2-BL-009 | P0 | Unassign Iteration | Set Iteration to Unscheduled/null | Item leaves Iteration Status but remains in Backlog with rank/history preserved | Not Run |
| P2-BL-010 | P1 | Bulk iteration assignment | Select multiple valid rows; assign Iteration | Selected rows receive Iteration and appear in Iteration Status | Not Run |
| P2-BL-011 | P1 | Bulk release assignment boundary | If visible, bulk release should be gated/deferred per scope | Phase 2 must not force Release Management to complete P2 delivery | Not Run |
| P2-BL-012 | P1 | Rank reorder | Move item up/down or reorder | Rank changes persist; order remains stable after refresh | Not Run |
| P2-BL-013 | P1 | Viewer/read-only | Open Backlog as read-only user | Inline edit, bulk assign and reorder are disabled/rejected | Not Run |

## P2-IT - Timeboxes / Iterations

| ID | Priority | Scenario | Steps | Expected result | Status |
|---|---|---|---|---|---|
| P2-IT-001 | P0 | Open Timeboxes | Open Plan -> Timeboxes | Page opens with Iterations as default type | Not Run |
| P2-IT-002 | P0 | Release/Milestone hidden in Phase 2 | Inspect Timeboxes type options | Release and Milestone options are not visible as P2.2 production capability | Not Run |
| P2-IT-003 | P0 | Iteration list columns | Open Timeboxes | Columns include Name, Theme, Start Date, End Date, Project, Planned Velocity, Task Estimate, State | Not Run |
| P2-IT-004 | P1 | Search iterations | Search by name/theme/project/state | Matching Iterations show | Not Run |
| P2-IT-005 | P1 | Filter by State | Filter Planning/Committed/Accepted | Only matching state rows show | Not Run |
| P2-IT-006 | P1 | Sort Iterations | Sort dates, numbers and text columns | Date/numeric/text sort correctly | Not Run |
| P2-IT-007 | P0 | Create Iteration modal | Click Create Iteration | Modal opens with Type, Project, Team, Name, Start Date, End Date, State | Not Run |
| P2-IT-008 | P0 | Create Iteration auto-fills context | Select Project/Team; open create modal | Project and Team default from active context | Not Run |
| P2-IT-009 | P0 | Required field validation | Submit missing Name/Start/End/State | Inline validation blocks submit | Not Run |
| P2-IT-010 | P0 | End Date before Start Date | Enter invalid date range | Validation rejects invalid range | Not Run |
| P2-IT-011 | P0 | Create Iteration happy path | Fill valid modal; save | Iteration is created and appears in list/selector | Not Run |
| P2-IT-012 | P1 | Create with details | Use Create with details | Full-page Iteration detail opens | Not Run |
| P2-IT-013 | P1 | Open existing detail | Click existing Iteration row | Detail page opens with preloaded values | Not Run |
| P2-IT-014 | P1 | Detail fields persist | Edit Theme, Notes, State, Planned Velocity | Values persist after refresh | Not Run |
| P2-IT-015 | P0 | Assign valid existing Story/Defect | Assign item from same Project/Team to Iteration | Item appears in Iteration Status | Not Run |
| P2-IT-016 | P0 | Reject cross-team assignment | Assign item from another Project/Team | Validation rejects assignment | Not Run |
| P2-IT-017 | P1 | Viewer cannot create/edit Iteration | Open as Viewer | Create/edit controls are hidden/disabled; API rejects direct mutation | Not Run |

## P2-IS - Iteration Status

| ID | Priority | Scenario | Steps | Expected result | Status |
|---|---|---|---|---|---|
| P2-IS-001 | P0 | Open Iteration Status | Open Track -> Iteration Status | Page opens; Phase 2 only exposes Iteration Status under Track | Not Run |
| P2-IS-002 | P0 | Team Status/Future Team Board out of Phase 2 | Inspect Track menu | Team Status is absent/disabled/marked Phase 3; Team Board is absent/disabled/marked Future Backlog; neither is required for Phase 2 pass | Not Run |
| P2-IS-003 | P0 | Page layout scope | Open Iteration Status | Title is Iteration; no old top Project/Release/Iteration/Team filter bar; Saved Views not shown | Not Run |
| P2-IS-004 | P0 | Iteration selector source | Open selector | Options come from Timeboxes Iteration records and show name/date range | Not Run |
| P2-IS-005 | P0 | Selector filtered by context | Switch Project/Team | Selector options change to matching Iterations only | Not Run |
| P2-IS-006 | P0 | Previous/next Iteration | Click previous/next controls | Selected Iteration changes; metrics and list refresh | Not Run |
| P2-IS-007 | P0 | Metrics calculate from assigned items | Select Iteration with Story/Defect/Task data | Planned Velocity, Iteration End, Accepted, Defects and Tasks match selected Iteration data | Not Run |
| P2-IS-008 | P0 | Defects metric meaning | Assign Defect items to Iteration | Defects metric counts work items where type = Defect | Not Run |
| P2-IS-009 | P0 | List source of truth | Assign Work Item from Backlog to Iteration; open Iteration Status | Same item appears; no duplicate execution-only copy is created | Not Run |
| P2-IS-010 | P0 | List only selected Iteration | Select Iteration A then B | List contains only items whose `iterationId` matches selected Iteration | Not Run |
| P2-IS-011 | P1 | Required columns | Inspect list | Columns include checkbox, rank, ID, Type, Name, Schedule State, Iteration, Blocked, Plan Est, Task Est, To Do, Owner | Not Run |
| P2-IS-012 | P1 | No per-row Defects column | Inspect list | Per-row Defects column is not displayed | Not Run |
| P2-IS-013 | P1 | Quick search and Manage Filters | Search/filter list | Behavior matches Backlog Enhancement patterns | Not Run |
| P2-IS-014 | P1 | Sort/resize/pagination | Use grid controls | Sort, resize and pagination work | Not Run |
| P2-IS-015 | P0 | Inline edit supported fields | Edit Name, Schedule State, Iteration, Plan Est, Owner | Changes persist with validation and permission enforcement | Not Run |
| P2-IS-016 | P0 | Row click opens Work Item Detail | Click row ID/name | Same Work Item Detail page opens | Not Run |
| P2-IS-017 | P0 | Detail shows Iteration field | Open detail from Iteration Status | Right panel shows editable Iteration field where permitted | Not Run |
| P2-IS-018 | P0 | Add Item modal supports Story/Defect only | Click Add Item | Modal supports Story and Defect; no Task/Feature/Epic choices | Not Run |
| P2-IS-019 | P0 | Add Item does not choose existing backlog item | Inspect Add Item modal | Modal creates new Story/Defect; no Choose Existing Backlog Item control | Not Run |
| P2-IS-020 | P0 | Add Item creates into selected Iteration | Create Story/Defect from Add Item | New item appears in Iteration Status and also in Backlog with same source item | Not Run |
| P2-IS-021 | P0 | Create with details from Add Item | Use Create with details | Full Work Item Detail opens using Backlog detail flow | Not Run |
| P2-IS-022 | P1 | Empty/no iteration states | Open context with no Iterations or empty Iteration | Clear empty state and CTA/link to Timeboxes when permitted | Not Run |
| P2-IS-023 | P1 | Viewer/read-only | Open Iteration Status as Viewer | Inline edit and Add Item hidden/disabled; API rejects mutation | Not Run |

## Phase 2 smoke path

1. Select Project/Team context.
2. Open Backlog and create Story/Defect.
3. Open Timeboxes and create Iteration for the same Project/Team.
4. Assign Story/Defect to Iteration from Backlog or Work Item Detail.
5. Open Iteration Status and select that Iteration.
6. Verify assigned items, metrics and list source of truth.
7. Create a new Story/Defect from Iteration Status Add Item.
8. Verify the new item appears in both Iteration Status and Backlog.
9. Switch Project/Team and confirm the previous Iteration/items disappear from the new context.
