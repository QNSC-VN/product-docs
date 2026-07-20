# Phase 1 Test Scenarios - Core Work Item Management

Phase 1 validates the core work management slice: Manage Projects, Settings Teams/User Management, Backlog, Work Item Create/Detail, Task, Time, Content/Attachments and Activity Log.

## P1-MANAGE - Manage Projects and Settings Teams/Users

| ID | Priority | Scenario | Steps | Expected result | Status |
|---|---|---|---|---|---|
| P1-MANAGE-001 | P0 | Open Manage Projects | Open Workspace/Company menu; choose Manage Projects | Project management opens with Projects only; no Teams tab is present | Pass (navigation reconciliation 2026-07-19) |
| P1-MANAGE-002 | P0 | Settings Teams columns | Open top-right Settings gear; choose Teams | Columns are Key, Team, Project, Status, Lead, Updated and permitted Actions; no Members/Capacity/Velocity columns | Pass (runtime smoke 2026-07-19) |
| P1-MANAGE-003 | P0 | Create Team happy path | Create Team with Project, lead, name, key, description, status | Team is created under selected Project and available for context/backlog flows | Not Run |
| P1-MANAGE-004 | P0 | Create Team validation | Submit missing required name/key/project or duplicate key | Validation blocks save with clear errors | Not Run |
| P1-MANAGE-005 | P1 | Edit Team | Update Team Info fields | Changes persist and updated timestamp changes | Not Run |
| P1-MANAGE-006 | P1 | Team Members tab | Open Create/Edit Team modal Members tab; add/remove/search member | Searchable member selector works; membership persists | Not Run |
| P1-MANAGE-007 | P1 | No capacity/velocity fields in Create Team | Inspect Create/Edit Team modal | Capacity and Velocity are not present in Phase 1 team create/edit | Not Run |
| P1-MANAGE-008 | P0 | Invite User with role and team membership | Open Users tab; invite user with role/team | User invitation/member record is created; project access derives from Team, not direct project assignment | Not Run |
| P1-MANAGE-009 | P1 | Deactivate/reactivate user | Deactivate user; verify access; reactivate | Deactivated user loses access; reactivated user can access again per role | Not Run |
| P1-MANAGE-010 | P1 | Permission guard on manage mutations | Attempt create/edit/deactivate as Project Admin outside managed Project | UI hides/disables action and backend rejects direct mutation | Not Run |

## P1-BACKLOG - Backlog List

| ID | Priority | Scenario | Steps | Expected result | Status |
|---|---|---|---|---|---|
| P1-BL-001 | P0 | Backlog loads by selected Project/Team | Select Project/Team; open Backlog | Only Story/Defect for selected context are shown | Not Run |
| P1-BL-002 | P0 | Task is not independent backlog item | Ensure task records exist; open Backlog | Task records do not appear as backlog items | Not Run |
| P1-BL-003 | P0 | Story/Defect only | Create or seed Story, Defect, Task, Feature/Epic if available | Backlog displays only Story and Defect | Not Run |
| P1-BL-004 | P1 | Search/filter/pagination server-side | Use quick search, filters and page size 10/25/50/100 | Results update correctly; URL/query state if designed remains consistent | Not Run |
| P1-BL-005 | P1 | Column resize | Resize columns | Layout does not break; important columns remain readable | Not Run |
| P1-BL-006 | P0 | Click ID opens full detail | Click Story/Defect ID | Full Work Item Detail opens for correct item | Not Run |
| P1-BL-007 | P1 | Defect priority behavior | Compare Story and Defect rows | Priority applies to Defect; Story shows blank/dash or no priority behavior | Not Run |
| P1-BL-008 | P0 | Shared US/DE status catalog | Inspect Schedule State and Flow State on Backlog rows | Both fields use exactly `Idea`, `Defined`, `In-Progress`, `Completed`, `Accepted`, `Release`; `Code Review`, `Testing` and `Released` are absent | Pass |

## P1-CREATE - Create Work Item

| ID | Priority | Scenario | Steps | Expected result | Status |
|---|---|---|---|---|---|
| P1-CREATE-001 | P0 | Quick Create Story | Open Create Work Item; choose Story; fill required fields; save | Story is created with generated item key in selected Project/Team | Pass (M5.1 runtime: US-4822) |
| P1-CREATE-002 | P0 | Quick Create Defect | Open Create Work Item; choose Defect; fill required fields; save | Defect is created; defect-specific fields such as Priority are available where required | Pass (M5.1 runtime: DE-1146) |
| P1-CREATE-003 | P0 | Only Story/Defect allowed | Inspect Type choices in create modal | Only Story and Defect are selectable in Phase 1 | Pass (M5.1 runtime) |
| P1-CREATE-004 | P0 | Title/Name required | Submit empty or whitespace title | Validation blocks save | Not Run |
| P1-CREATE-005 | P0 | Project/Team must be valid | Select invalid Team for Project or unauthorized context | Validation rejects invalid Project/Team pair | Not Run |
| P1-CREATE-006 | P0 | Create with details | Use Create with details | Item is created and user lands on full Work Item Detail | Pass (M5.1 runtime: exactly one US-4822) |
| P1-CREATE-007 | P1 | Atomic item key generation | Create multiple items quickly in same Project | Unique item keys are generated without collision | Not Run |
| P1-CREATE-008 | P0 | New Work Item default states | Create Story and Defect without changing state fields | Schedule State and Flow State both default to `Idea` | Pass (M5.1 runtime: US-4822 and DE-1146) |

## P1-DETAIL - Work Item Detail

| ID | Priority | Scenario | Steps | Expected result | Status |
|---|---|---|---|---|---|
| P1-WID-001 | P0 | Detail loads correct data | Open existing Story/Defect detail | Header, type badge, title, detail tabs and sidebar fields match selected item | Not Run |
| P1-WID-002 | P0 | Update title/description | Edit title and description; save | Changes persist after refresh | Not Run |
| P1-WID-003 | P0 | Sidebar field update | Update Owner, Team, Schedule State, Flow State, Plan Estimate | Values persist and validate correctly | Not Run |
| P1-WID-004 | P0 | Team change validates Project | Change Team to one outside Project | Save is rejected | Not Run |
| P1-WID-005 | P1 | Release/Iteration nullable | Set Release/Iteration to Unscheduled/null | Field saves as unassigned without deleting item | Not Run |
| P1-WID-006 | P1 | Defect-only priority | Open Story and Defect detail | Priority is editable/visible only where Defect rules require | Not Run |
| P1-WID-007 | P1 | Summary/collapse panel | Toggle full detail and summary/collapsed panel | UI keeps selected item and does not lose unsaved/saved state unexpectedly | Not Run |
| P1-WID-008 | P0 | Out-of-scope Project Admin read-only | Open detail as Project Admin outside managed Project | Fields render read-only/disabled; backend rejects direct update | Not Run |
| P1-WID-009 | P0 | Schedule/Flow mirror | Change Schedule State, then change Flow State | Changing either field immediately persists the same value to the other field | Pass |
| P1-WID-010 | P0 | Defect State stays independent | Change Defect State, then change Schedule/Flow State | Defect State uses `Submitted/Open/Fixed/Closed/Closed Declined` and does not mirror Schedule/Flow State | Not Run |

## P1-TASK - Task Management

| ID | Priority | Scenario | Steps | Expected result | Status |
|---|---|---|---|---|---|
| P1-TASK-001 | P0 | Tasks tab full width | Open Work Item Detail -> Tasks tab | Task table uses full width and does not render Work Item sidebar | Not Run |
| P1-TASK-002 | P0 | Add Task happy path | Add Task with required name, owner and estimate if available | Task is created as child of Work Item | Pass (M5.1 runtime: TA-482201 under US-4822) |
| P1-TASK-003 | P0 | Add Task name required | Submit empty task name | Validation blocks save | Not Run |
| P1-TASK-004 | P1 | Task table columns | Open Tasks tab with tasks | Columns include Rank, ID, Name, State, Owner, Project, Teams, To Do, Actuals, Estimate | Not Run |
| P1-TASK-005 | P1 | Task totals row | Add/update To Do, Actuals, Estimate | Totals row calculates correctly | Pass (M4 runtime: US-4821 = 0 / 16 / 16 after all six Tasks completed) |
| P1-TASK-006 | P0 | Open Task Detail | Click Task ID | Task Detail opens with Details and Revision History only; no Tasks tab | Pass (M5.1 Create with details opened TA-482201) |
| P1-TASK-007 | P1 | Reassign Work Product | Change Task parent/work product | New parent must be in valid project/team scope | Not Run |
| P1-TASK-008 | P0 | Task state catalog remains separate | Inspect and edit a child Task State | Task uses only `Defined`, `In-Progress`, `Completed`; US/DE `Idea/Accepted/Release` values are not offered | Pass |
| P1-TASK-009 | P0 | Shared Task identity across screens | Edit a Task on Task Dashboard, then open Team Status; repeat in reverse | The same Task ID, State and edited values appear on both screens | Pass (M4 runtime: TA-482106) |
| P1-TASK-009A | P0 | Task Dashboard inline edit | Edit Name, State, Owner, To Do, Actuals and Estimate inline | Values update the same Task record without opening Task Detail | Pass (M4 runtime) |
| P1-TASK-009B | P0 | All Tasks complete parent | Complete the final non-Completed child Task | Parent Story/Defect Schedule State and Flow State automatically move to `Completed` | Pass (M4 runtime: US-4821) |
| P1-TASK-010 | P0 | Reopen Task auto-reverses completed parent | Complete all Tasks, then reopen one Task | Task metrics recalculate and parent US/DE automatically moves from `Completed` to `In-Progress` | Pass (M4 rerun: TA-482106 reopened; US-4821 Completed -> In-Progress) |
| P1-TASK-011 | P1 | Task inherits parent Iteration | Move parent US/DE to another Iteration | The Task is counted in the parent’s new Iteration and has no independent Iteration selector | Pass (M4/M5.2 runtime) |

## P1-TIME-CONTENT - Time, Content, Attachments

| ID | Priority | Scenario | Steps | Expected result | Status |
|---|---|---|---|---|---|
| P1-TIME-001 | P0 | Estimate/To Do/Actual persistence | Update estimate, to do and actual hours | Values persist and reload correctly | Not Run |
| P1-TIME-002 | P0 | Negative time rejected | Enter negative values | Validation rejects negative values | Not Run |
| P1-TIME-003 | P1 | Actual can exceed Estimate | Enter Actual greater than Estimate | Value is allowed in Phase 1; no blocking validation | Not Run |
| P1-CONTENT-001 | P0 | Description/Notes/Release Notes persistence | Edit rich text fields; save; refresh | Content persists and renders safely | Not Run |
| P1-CONTENT-002 | P0 | Rich text sanitization | Try script/unsafe HTML in rich text field | Unsafe content is sanitized and not executed | Not Run |
| P1-ATT-001 | P0 | Upload attachment | Upload supported file | Metadata and storage key are saved; attachment appears in list | Not Run |
| P1-ATT-002 | P1 | Download/delete attachment | Download then delete attachment | Download works; delete removes attachment from list without corrupting item | Not Run |

## P1-ACTIVITY - Activity Log / Revision History

| ID | Priority | Scenario | Steps | Expected result | Status |
|---|---|---|---|---|---|
| P1-ACT-001 | P0 | Work Item create activity | Create Story/Defect | Activity log records creation event | Not Run |
| P1-ACT-002 | P0 | Field update activity | Update owner/status/time/content | Activity log records before/after or meaningful change details | Not Run |
| P1-ACT-003 | P0 | Task activity | Create/update Task | Task Revision History records events | Not Run |
| P1-ACT-004 | P1 | Attachment activity | Upload/delete attachment | Activity log records file action metadata | Not Run |
| P1-ACT-005 | P1 | Revision order | Open Revision History | Events sort by created_at descending | Not Run |

## Phase 1 smoke path

1. Create or verify Team under a Project.
2. Invite or assign a user to Team.
3. Select Project/Team context.
4. Open Backlog and create Story.
5. Create Defect and verify Priority behavior.
6. Open Story detail and update sidebar fields.
7. Add Task, update time fields and open Task Detail.
8. Add Description/Notes/Attachment.
9. Verify Activity/Revision History records the changes.
