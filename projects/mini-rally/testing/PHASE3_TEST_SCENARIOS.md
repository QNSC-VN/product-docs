# Phase 3 Test Scenarios - Team Status, Release, Milestones, Quality/Defect

Phase 3 validates the delivery and quality layer on top of Phase 2 Agile execution.

Important scope rules:

- Phase 3 includes Team Status, Release Management, Milestones and Quality/Defect.
- Team Status is a dense dashboard/table grouped by member, not a board.
- Team Board, board drag/drop, WIP limits and board transition rules are Future Backlog only.
- Tasks remain child records under Story/Defect; Task is not an independent Backlog item.
- If all child Tasks under a Story/Defect are `Completed`, the parent Story/Defect can auto-complete to `Completed`.
- Auto-complete is only a convenience behavior; authorized users can still manually change parent Story/Defect status.
- Iteration lifecycle is manual-first: users manually manage `Planning`, `Committed`, `Accepted`; system auto-sets Iteration to `Accepted` only when all assigned Story/Defect items are `Accepted`.

## P3-TS - Team Status

| ID | Priority | Scenario | Steps | Expected result | Status |
|---|---|---|---|---|---|
| P3-TS-001 | P0 | Open Team Status | Open `Track -> Team Status` | Dedicated Team Status page opens; it is not Team Board | Not Run |
| P3-TS-002 | P0 | Project/Team/Iteration context | Select Project/Team and Iteration | Team Status data is filtered by selected context and Iteration | Not Run |
| P3-TS-003 | P0 | Group by member/owner | Open Team Status with assigned Tasks | Rows are grouped by member/owner; task rows remain task-level rows | Not Run |
| P3-TS-004 | P1 | No local search/KPI strip | Inspect Team Status header | Local Team Status search input and KPI strip are not shown | Not Run |
| P3-TS-005 | P1 | Task state options | Open task state inline control | Options are exactly `Defined`, `In-Progress`, `Completed` | Not Run |
| P3-TS-006 | P0 | Inline edit Task name/state | Edit Task Name and State from Team Status | Values persist; parent roll-up refreshes | Not Run |
| P3-TS-007 | P0 | Partial task completion does not auto-complete parent | Complete only one child Task while other child Tasks remain not Completed | Parent Story/Defect does not auto-complete | Not Run |
| P3-TS-008 | P0 | All Tasks completed auto-completes parent | Complete all child Tasks under a Story/Defect | Parent Story/Defect auto-completes to `Completed` | Not Run |
| P3-TS-009 | P0 | Manual parent status override remains allowed | After auto-complete, open Work Item Detail and manually change parent Schedule State | Manual change is allowed for authorized user and persists | Not Run |
| P3-TS-010 | P0 | Task Dashboard inline edit | Open parent Work Item Detail -> Tasks tab; edit Task Name, State, Owner, To Do, Actuals and Estimate inline | Edits persist and remain on Task Dashboard | Not Run |
| P3-TS-011 | P1 | Task detail still opens | Click a Task row from Task Dashboard | Task Detail opens and reflects latest inline edits | Not Run |
| P3-TS-012 | P1 | Unsupported source states normalize | Load source task/work item states outside Team Status task enum | Display normalizes to Team Status task values per SRS | Not Run |
| P3-TS-013 | P1 | Capacity edit | Edit member capacity where permitted | Capacity persists; viewer/read-only user cannot edit | Not Run |
| P3-TS-014 | P0 | Viewer/read-only | Open Team Status and Task Dashboard as Viewer | Values are readable; inline edit controls are hidden/disabled; backend rejects mutation | Not Run |
| P3-TS-015 | P0 | Team Board future guard | Inspect Track navigation and Phase 3 acceptance | Team Board is not required for Phase 3 pass; if visible, it is treated as Future Backlog | Not Run |

## P3-REL - Release Management

| ID | Priority | Scenario | Steps | Expected result | Status |
|---|---|---|---|---|---|
| P3-REL-001 | P0 | Open Releases from Timeboxes | Open `Plan -> Timeboxes`; select `Releases` | Release dashboard loads as Phase 3.2 planning surface | Not Run |
| P3-REL-002 | P0 | Release dashboard columns | Inspect Release list | Columns match Timeboxes template: Name, Theme, Start Date, Release Date, Project, Planned Velocity, Task Estimate, State | Not Run |
| P3-REL-003 | P1 | Release dashboard table controls | Search/sort/resize/page Release list | Table controls work consistently with Timeboxes/dashboard pattern | Not Run |
| P3-REL-004 | P0 | Create Release modal type locked | Click Create Release | Modal opens with Type = Release and Type cannot be changed to Iteration/Milestone | Not Run |
| P3-REL-005 | P0 | Release state options | Inspect create/detail state dropdown | Options are exactly `Planning`, `Active`, `Accepted`; legacy states are not valid | Not Run |
| P3-REL-006 | P0 | Create Release happy path | Create Release with required Project, dates and state | Release appears in dashboard/detail | Not Run |
| P3-REL-007 | P1 | Create with details | Use Create with details | Release detail opens with prefilled fields | Not Run |
| P3-REL-008 | P1 | Release detail fields | Open Release detail | Theme, Notes, Release Notes and right-panel metadata are visible | Not Run |
| P3-REL-009 | P0 | Inline edit Release dashboard/detail | Edit supported Release fields | Changes persist with validation and permission enforcement | Not Run |
| P3-REL-010 | P0 | Assign Story/Defect to Release | Assign a Story/Defect from Backlog or Work Item Detail | Item appears in Release Artifacts and remains same Backlog work item | Not Run |
| P3-REL-011 | P0 | One active Release per Story/Defect | Assign same Story/Defect to a different Release | Old Release assignment is replaced; no duplicate active Release assignment remains | Not Run |
| P3-REL-012 | P0 | Reassignment refreshes artifacts and counters | Move Story/Defect from Release A to Release B | Item disappears from Release A artifacts, appears in Release B, and counters/roll-ups refresh | Not Run |
| P3-REL-013 | P1 | Release Artifacts table behavior | Open Release Artifacts | Assigned Story/Defect rows use Backlog-style search/sort/resize/pagination/inline edit where permitted | Not Run |
| P3-REL-014 | P1 | Release readiness is user-managed | Inspect Release readiness behavior | System does not auto-calculate readiness; user reads linked US/DE release notes and Release Notes | Not Run |
| P3-REL-015 | P0 | Viewer/read-only | Open Release dashboard/detail as Viewer | Viewer can read; inline edit/create/assignment is hidden/disabled and API rejects mutation | Not Run |

## P3-MS - Milestones

| ID | Priority | Scenario | Steps | Expected result | Status |
|---|---|---|---|---|---|
| P3-MS-001 | P0 | Open Milestones from Timeboxes | Open `Plan -> Timeboxes`; select `Milestones` | Milestone dashboard loads | Not Run |
| P3-MS-002 | P0 | Milestone dashboard columns | Inspect dashboard | Only Name, Target Start Date, Target End Date and Status are shown | Not Run |
| P3-MS-003 | P0 | Create Milestone | Create a Milestone | Milestone is created and detail can open | Not Run |
| P3-MS-004 | P0 | Milestone status options | Inspect State dropdown | Options are exactly `Planned`, `At Risk`, `Met`, `Missed`, `Cancelled`, `Completed` | Not Run |
| P3-MS-005 | P0 | Multiple Projects/Teams/Releases | Use detail count controls to select multiple Projects, Teams and Releases | Selections persist; count summaries update | Not Run |
| P3-MS-006 | P1 | Searchable selection modals | Open Projects/Teams/Releases selectors | Modal supports search and checkbox selection | Not Run |
| P3-MS-007 | P0 | Derived target dates | Link Releases with dates | Target Start Date derives from earliest linked Release start; Target End Date derives from latest linked Release date and is read-only | Not Run |
| P3-MS-008 | P0 | No readiness checklist | Inspect Milestone detail | No readiness checklist is required or shown for Phase 3.3 | Not Run |
| P3-MS-009 | P0 | Milestone Artifacts tab | Open Artifacts tab | Right metadata panel is hidden; assigned Story/Defect table is shown | Not Run |
| P3-MS-010 | P0 | Assign Story/Defect artifact | Assign Story/Defect within Milestone Project/Team scope | Artifact appears in Milestone Artifacts using Backlog-style presentation | Not Run |
| P3-MS-011 | P0 | Reject artifact outside scope | Attempt assign Story/Defect outside selected Project/Team scope | Assignment is rejected | Not Run |
| P3-MS-012 | P0 | Milestone artifact independent from Release | Add/remove Story/Defect from Milestone | Release assignment, Iteration assignment, Backlog rank and Work Item identity do not change | Not Run |
| P3-MS-013 | P1 | Same Story/Defect in multiple Milestones | Assign same Story/Defect to multiple valid Milestones | Multiple Milestone relations are allowed when scope rules pass | Not Run |
| P3-MS-014 | P0 | Viewer/read-only | Open Milestone dashboard/detail as Viewer | Viewer can read; create/edit/artifact assignment is hidden/disabled and API rejects mutation | Not Run |

## P3-QA - Quality / Defect

| ID | Priority | Scenario | Steps | Expected result | Status |
|---|---|---|---|---|---|
| P3-QA-001 | P0 | Open Quality Defect dashboard | Open `Quality -> Defect` | Dedicated Defect dashboard loads | Not Run |
| P3-QA-002 | P0 | Quality Defect shares Backlog source | Open a Defect from Quality and Backlog | Both surfaces use the same Defect work item and shared detail page | Not Run |
| P3-QA-003 | P0 | Dashboard columns | Inspect Quality Defect dashboard | Columns include Rank, ID, Name, User Story, Severity, Priority, State, Flow State, Fixed In Build, Iteration, Submitted By, Owner | Not Run |
| P3-QA-004 | P1 | Dashboard controls | Search/sort/page/resize Quality Defect table | Table controls work consistently | Not Run |
| P3-QA-005 | P0 | Defect field option sets | Inspect Severity, Priority, State and Flow State dropdowns | Options match SRS exactly | Not Run |
| P3-QA-006 | P0 | Create Defect from Quality | Create Defect from `Quality -> Defect` | Defect is created as normal Backlog Defect work item | Not Run |
| P3-QA-007 | P0 | Create Defect from Backlog | Create Defect from Backlog | Defect appears in Quality dashboard | Not Run |
| P3-QA-008 | P0 | User Story optional | Create/edit Defect without User Story | Defect can be saved without User Story | Not Run |
| P3-QA-009 | P0 | Inline edit defect fields | Edit editable dashboard fields | Values persist and shared detail reflects changes | Not Run |
| P3-QA-010 | P0 | Core Defect state flow | Move through Submitted -> Open -> Fixed -> Closed | Valid transitions succeed | Not Run |
| P3-QA-011 | P0 | Closed Declined path | Move Submitted/Open -> Closed Declined | Valid decline transition succeeds | Not Run |
| P3-QA-012 | P1 | Reopen deferred | Try reopen from Closed/Closed Declined | Reopen is hidden/rejected unless BA later confirms permission/audit behavior | Not Run |
| P3-QA-013 | P0 | Defect cannot be deleted | Look for/delete Defect action | Delete is unavailable or rejected; use Closed/Closed Declined instead | Not Run |
| P3-QA-014 | P0 | Fixed In Build | Edit Fixed In Build | Optional manual text persists; no required format/blocking validation | Not Run |
| P3-QA-015 | P1 | Flow State independent from State | Edit Flow State without changing Defect State | Flow State persists independently | Not Run |
| P3-QA-016 | P1 | Bulk actions future only | If bulk-action placeholder is visible, attempt action | Placeholder is disabled/future and does not execute mutation | Not Run |
| P3-QA-017 | P0 | Viewer/read-only | Open Quality Defect dashboard/detail as Viewer | Viewer can read; create/edit/state mutation is hidden/disabled and API rejects mutation | Not Run |

## Phase 3 smoke path

1. Select Project/Team context.
2. Create or use an existing Iteration with assigned Story/Defect and child Tasks.
3. Open Team Status and verify task rows are grouped by owner/member.
4. Complete all Tasks under one Story/Defect and verify the parent auto-completes to `Completed`.
5. Manually change parent Story/Defect status from Work Item Detail to prove manual override still works.
6. Open Timeboxes -> Releases, create a Release, assign Story/Defect artifacts and verify one active Release assignment.
7. Open Timeboxes -> Milestones, create a Milestone, link Projects/Teams/Releases and assign Story/Defect artifacts.
8. Open Quality -> Defect, create/edit a Defect and verify state flow plus Fixed In Build.
9. Confirm Team Board is not required for Phase 3 acceptance and remains Future Backlog.
