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
| P2-BL-007 | P0 | Iteration field visible/editable | Assign Story/Defect to a valid Iteration | Item stores `iterationId`; it remains in Backlog and appears in selected Iteration Status | Pass (M5.2 runtime: US-4822 -> Sprint M5.2) |
| P2-BL-008 | P0 | Invalid iteration assignment rejected | Assign item to Iteration from different Project/Team | Validation rejects assignment | Not Run |
| P2-BL-009 | P0 | Unassign Iteration | Set Iteration to Unscheduled/null | Item leaves Iteration Status but remains in Backlog with rank/history preserved | Not Run |
| P2-BL-010 | P1 | Bulk iteration assignment | Select multiple valid rows; assign Iteration | Selected rows receive Iteration and appear in Iteration Status | Not Run |
| P2-BL-011 | P1 | Bulk release assignment boundary | If visible, bulk release should be gated/deferred per scope | Phase 2 must not force Release Management to complete P2 delivery | Not Run |
| P2-BL-012 | P1 | Rank reorder | Move item up/down or reorder | Rank changes persist; order remains stable after refresh | Not Run |
| P2-BL-013 | P1 | Out-of-scope Project Admin read-only | Open Backlog as Project Admin outside managed Project | Inline edit, bulk assign and reorder are disabled/rejected | Not Run |

## P2-IT - Timeboxes / Iterations

| ID | Priority | Scenario | Steps | Expected result | Status |
|---|---|---|---|---|---|
| P2-IT-001 | P0 | Open Timeboxes | Open Plan -> Timeboxes | Page opens with Iterations as default type | Not Run |
| P2-IT-002 | P0 | Release/Milestone hidden in Phase 2 | Inspect Timeboxes type options | Release and Milestone options are not visible as P2.2 production capability | Not Run |
| P2-IT-003 | P0 | Iteration list columns | Open Timeboxes | Columns include Name, Theme, Start Date, End Date, Project, Planned Velocity, Task Estimate, State | Not Run |
| P2-IT-004 | P1 | Search iterations | Search by name/theme/project/state | Matching Iterations show | Not Run |
| P2-IT-005 | P1 | Filter by State | Filter Planning/Committed/Accepted | Only matching state rows show | Not Run |
| P2-IT-006 | P1 | Sort Iterations | Sort dates, numbers and text columns | Date/numeric/text sort correctly | Not Run |
| P2-IT-007 | P0 | Create Iteration modal | Click Create Iteration | Modal opens with Type, Project, Team, Name, Start Date, End Date, State | Pass (M5.2 runtime) |
| P2-IT-008 | P0 | Create Iteration auto-fills context | Select Project/Team; open create modal | Project and Team default from active context | Not Run |
| P2-IT-009 | P0 | Required field validation | Submit missing Name/Start/End/State | Inline validation blocks submit | Pass (M5.2 runtime: Create disabled until required inputs valid) |
| P2-IT-010 | P0 | End Date before Start Date | Enter invalid date range | Validation rejects invalid range | Not Run |
| P2-IT-011 | P0 | Create Iteration happy path | Fill valid modal; save | Iteration is created and appears in list/selector | Pass (M5.2 runtime: IT-006 / Sprint M5.2) |
| P2-IT-012 | P1 | Create with details | Use Create with details | Full-page Iteration detail opens | Not Run |
| P2-IT-013 | P1 | Open existing detail | Click existing Iteration row | Detail page opens with preloaded values | Not Run |
| P2-IT-014 | P1 | Detail fields persist | Edit Theme, Notes, State, Planned Velocity | Values persist after refresh | Not Run |
| P2-IT-015 | P0 | Assign valid existing Story/Defect | Assign item from same Project/Team to Iteration | Item appears in Iteration Status | Not Run |
| P2-IT-016 | P0 | Reject cross-team assignment | Assign item from another Project/Team | Validation rejects assignment | Not Run |
| P2-IT-017 | P1 | Out-of-scope Project Admin cannot create/edit Iteration | Open as Project Admin outside managed Project | Create/edit controls are hidden/disabled; API rejects direct mutation | Not Run |
| P2-IT-018 | P0 | Auto-Accept non-empty Iteration | Set the last assigned Story/Defect to Accepted | Iteration automatically changes to Accepted only when at least one item is assigned and all assigned US/DE are Accepted | Pass (M4 runtime: Sprint 24.3) |
| P2-IT-019 | P0 | Manual Iteration override | Move Planning to Committed; after auto-Accept, manually choose Committed | Authorized user change is allowed; assignment never auto-commits and the auto-Accept rule does not immediately reverse a manual value | Not Run |
| P2-IT-020 | P0 | Shared Iteration State | Change Iteration State on Iteration Status or Timeboxes | The same Planning/Committed/Accepted value appears on both screens | Not Run |

## P2-IS - Iteration Status

| ID | Priority | Scenario | Steps | Expected result | Status |
|---|---|---|---|---|---|
| P2-IS-001 | P0 | Open Iteration Status | Open Track -> Iteration Status | Page opens; Phase 2 only exposes Iteration Status under Track | Not Run |
| P2-IS-002 | P0 | Team Status/Future Team Board out of Phase 2 | Inspect Track menu | Team Status is the Phase 3 destination; Team Board is absent from active navigation and remains Future Backlog | Pass (mockup 2026-07-18) |
| P2-IS-003 | P0 | Page layout scope | Open Iteration Status | Title is Iteration; no old top Project/Release/Iteration/Team filter bar; Saved Views not shown | Not Run |
| P2-IS-004 | P0 | Iteration selector source | Open selector | Options come from Timeboxes Iteration records and show name/date range | Pass (M5.2 runtime: newly created Sprint M5.2 available) |
| P2-IS-005 | P0 | Selector filtered by context | Switch Project/Team | Selector options change to matching Iterations only | Not Run |
| P2-IS-006 | P0 | Previous/next Iteration | Click previous/next controls | Selected Iteration changes; metrics and list refresh | Not Run |
| P2-IS-007 | P0 | Metrics calculate from scoped Work Items and child Tasks | Select Iteration containing Story/Defect with child Tasks | Planned Velocity, Iteration End, Accepted and Defects use scoped US/DE; Tasks counts only non-`Completed` child Tasks inherited through those US/DE | Pass (M2 baseline: 10 active; M4 live update: 9 after one Task reopened) |
| P2-IS-008 | P0 | Defects metric meaning | Assign Defect items to Iteration | Defects metric counts work items where type = Defect | Not Run |
| P2-IS-009 | P0 | List source of truth | Assign Work Item from Backlog to Iteration; open Iteration Status | Same item appears; no duplicate execution-only copy is created | Pass (M5.2 runtime: US-4822 appeared once) |
| P2-IS-010 | P0 | List only selected Iteration | Select Iteration A then B | List contains only items whose `iterationId` matches selected Iteration | Pass (M5.2 runtime: Sprint M5.2 scoped list) |
| P2-IS-011 | P1 | Required columns | Inspect list | Columns include checkbox, rank, ID, Type, Name, Schedule State, Iteration, Blocked, Plan Est, Task Est, To Do, Owner | Not Run |
| P2-IS-012 | P1 | No per-row Defects column | Inspect list | Per-row Defects column is not displayed | Not Run |
| P2-IS-013 | P1 | Quick search and Manage Filters | Search/filter list | Behavior matches Backlog Enhancement patterns | Not Run |
| P2-IS-014 | P1 | Sort/resize/pagination | Use grid controls | Sort, resize and pagination work | Not Run |
| P2-IS-015 | P0 | Inline edit supported fields | Edit Name, Schedule State, Iteration, Plan Est, Owner | Changes persist with validation and permission enforcement | Not Run |
| P2-IS-016 | P0 | Row click opens Work Item Detail | Click row ID/name | Same Work Item Detail page opens | Not Run |
| P2-IS-017 | P0 | Detail shows Iteration field | Open detail from Iteration Status | Right panel shows editable Iteration field where permitted | Not Run |
| P2-IS-018 | P0 | Add Item modal supports Story/Defect only | Click Add Item | Modal supports Story and Defect; no Task/Feature/Epic choices | Not Run |
| P2-IS-019 | P0 | Add Item does not choose existing backlog item | Inspect Add Item modal | Modal creates new Story/Defect; no Choose Existing Backlog Item control | Not Run |
| P2-IS-020 | P0 | Add Item creates into selected Iteration | Create Story/Defect from Add Item | New item appears in Iteration Status and also in Backlog with same source item | Pass (M5.2 runtime: one US-4823 in Track and Backlog) |
| P2-IS-021 | P0 | Create with details from Add Item | Use Create with details | Full Work Item Detail opens using Backlog detail flow | Not Run |
| P2-IS-022 | P1 | Empty/no iteration states | Open context with no Iterations or empty Iteration | Clear empty state and CTA/link to Timeboxes when permitted | Not Run |
| P2-IS-023 | P1 | Out-of-scope Project Admin read-only | Open Iteration Status as Project Admin outside managed Project | Inline edit and Add Item hidden/disabled; API rejects mutation | Not Run |
| P2-IS-024 | P0 | Child Task inherits Iteration | Assign or move a parent Story/Defect to another Iteration | All child Tasks contribute to the new Iteration metrics without an independent Task iteration assignment | Not Run |
| P2-IS-025 | P0 | No standalone Task rows | Open Iteration Status for an Iteration with child Tasks | List contains only Story/Defect rows; child Tasks affect metrics and totals but are not rendered as rows | Pass (mockup: 5 US/DE rows, no Task row) |
| P2-IS-026 | P0 | Totals row | Inspect the line immediately under the table title/header | Totals show sums for scoped US/DE Plan Estimate, child Task Estimate and child Task To Do | Pass (M2 baseline: 21 / 34 / 14; M4 live To Do recalculation observed) |
| P2-IS-027 | P0 | Shared status values | Change Schedule/Flow State in Backlog, Detail or Iteration Status | The same mirrored value appears on every surface; Iteration Status does not locally normalize legacy values | Pass (mockup M3: US-4821 Backlog -> Track/Detail; DE-1142 Quality -> Backlog) |
| P2-IS-028 | P0 | List-only MVP guard | Inspect Iteration Status view controls | No active Board toggle/view is required; Iteration Status Board remains Future Backlog | Pass (mockup 2026-07-18) |

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
