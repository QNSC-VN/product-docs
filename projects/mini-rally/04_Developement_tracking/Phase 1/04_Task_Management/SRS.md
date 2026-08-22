# SRS — Phase 1.4 Task Management

## 0. Document Control

| Thuộc tính | Giá trị |
|---|---|
| Module ID | `P1-TASK` |
| Trạng thái | Draft for Development |
| Phạm vi | Child Task dưới Work Item |
| Ưu tiên | P1 — bắt buộc |
| Phụ thuộc | Work Item Detail, Time Tracking, Activity Log |
| Không bao gồm | Task standalone backlog, task board, subtasks cấp sâu |

## 1. Mục tiêu

Task là đơn vị chia nhỏ công việc của Story/Defect. Trong DB, Task vẫn là một record trong `work_items` với `type='task'` và `parent_id` trỏ tới Work Item cha.

## 1.1 DevInt Audit Reconciliation - 2026-07-24

BA confirmed the current Task contract:

- Task has one `Task State` only: `Defined / In-Progress / Completed`.
- Task does not expose `Schedule State` or `Flow State`.
- Task inherits Iteration from its parent Story/Defect and has no independent Iteration selector.
- Task `Estimate`, `To Do` and `Actual` are three independent editable hour fields.
- On create only, when Estimate is entered and To Do is blank, the system copies Estimate to To Do once. An explicitly entered To Do is not overwritten.
- After creation, editing Estimate, To Do or Actual never recalculates another field. Completing or reopening a Task does not change any of the three values.
- All Tasks Completed auto-moves the parent Story/Defect Schedule/Flow to `Completed`; reopening any Task auto-moves the parent to `In-Progress`. Authorized users may still manually change the parent state afterward.

## 2. Tài liệu tham chiếu

| Tài liệu | Phần tham chiếu | Mục đích |
|---|---|---|
| [`PHASE1_MOCKUP_CHECKLIST.md`](../PHASE1_MOCKUP_CHECKLIST.md) | Task List, Task Detail | Coverage |
| [`mini_rally_database_design.md`](../../../01_DB%20design/mini_rally_database_design.md) | §8.1 `work_items` | Task model |
| [`WorkItemDetailPage.tsx`](../../../03_Mockup%20Design/src/app/pages/WorkItemDetailPage.tsx) | Task tab/detail/modal | Mockup |

## 3. Functional Requirements

| ID | Requirement |
|---|---|
| TASK-FR-001 | Work Item Detail có tab Tasks. |
| TASK-FR-002 | Khi mở Tasks tab, content full width và bỏ sidebar Work Item. |
| TASK-FR-003 | Task list columns: Rank, ID, Name, State, Owner, Project, Teams, To Do, Actuals, Estimate. |
| TASK-FR-004 | Totals row tính tổng To Do/Actuals/Estimate. |
| TASK-FR-005 | Add Task mở modal tạo task child. |
| TASK-FR-006 | Add Task fields: Name required, Estimate, To Do, Actual and Owner. If Estimate is entered while To Do is blank, copy Estimate to To Do once during creation. |
| TASK-FR-007 | Buttons: Cancel, Create, Create with details. |
| TASK-FR-008 | Click Task ID mở Task Detail. |
| TASK-FR-009 | Task Detail có banner riêng, tabs Details và Revision History, không có Tasks tab. |
| TASK-FR-010 | Task Detail left: Description, Notes, Attachments. |
| TASK-FR-011 | Task Detail right: Task State, Owner, Project, Team, Work Product, Estimate, To Do, Actual. All three hour fields remain independently editable. |
| TASK-FR-012 | Work Product có thể chỉnh nhưng phải validate cùng project/team scope. |
| TASK-FR-013 | Task Dashboard trong Work Item Detail hỗ trợ inline edit Name, Task State, Owner, Estimate, To Do và Actuals; Task State displays the full labels `Defined`, `In-Progress`, `Completed`; click Task ID vẫn mở Task Detail. |
| TASK-FR-014 | Task Dashboard và Team Status đọc/ghi cùng một Task identity trong session mockup; không có page-local Task copy. |
| TASK-FR-015 | Task kế thừa Iteration từ parent Story/Defect; Task không có assignment Iteration độc lập. |
| TASK-FR-016 | Khi tất cả child Task của một parent Completed, system tự đổi Schedule State và Flow State của parent sang Completed. Khi bất kỳ Task được reopen, system tự đổi parent sang In-Progress. User vẫn có thể đổi parent status thủ công. |
| TASK-FR-017 | Task Owner follows the parent Team: `Unassigned` plus active parent-Team members; a parent with `No team` allows only `Unassigned`. |

## 4. DB ↔ UI Mapping — Task List

| UI field | API DTO | DB source | Mục đích | Rule/null handling |
|---|---|---|---|---|
| Rank | `rank` | `work_items.position` | Sort task trong parent | Required; default append |
| ID | `itemKey` | `work_items.item_key` | Task key | Required |
| Name | `title` | `work_items.title` | Task name | Required |
| State | `state` | `work_items.status_id → workflow_statuses` | Task state | Phase 1 states: Defined/In-Progress/Completed |
| Owner | `assignee` | `work_items.assignee_id → users` | Task owner | Nullable |
| Project | `project` | `work_items.project_id → projects` | Scope | Always inherited from parent and read-only; Task cannot move to another Project |
| Teams | `team` | `work_items.team_id → teams` | Responsible team | Nullable/default parent team |
| To Do | `todoHours` | `work_items.todo_hours` | Remaining work | Decimal >= 0; requires Phase 1 migration |
| Actuals | `actualHours` | `work_items.actual_hours` | Actual time spent | Decimal >= 0; requires Phase 1 migration |
| Estimate | `estimateHours` | Task estimate field | Task estimate in hours | Decimal >= 0; independent after create |
| Parent | `parentId` | `work_items.parent_id` | Link to Story/Defect | Required for task |

## 5. DB ↔ UI Mapping — Add Task Modal

| UI field | API request | DB target | Rule |
|---|---|---|---|
| Name | `title` | `work_items.title` | Required |
| To Do | `todoHours` | `work_items.todo_hours` | Nullable/0, decimal >= 0 |
| Actual | `actualHours` | `work_items.actual_hours` | Nullable/0, decimal >= 0 |
| Estimate | `estimateHours` | Task estimate field | Nullable/0, decimal >= 0; if To Do blank on create, copy once to To Do |
| Owner | `assigneeId` | `work_items.assignee_id` | Nullable/Unassigned; named value must be active member of inherited parent Team |
| Parent work item | route/context | `work_items.parent_id` | Current Story/Defect |
| Type | server default | `work_items.type='task'` | Not user editable |
| Project/team | server default | `project_id`, `team_id` | Project always inherits parent and is not user-editable; Team follows the parent Team rule |
| State | server default | `status_id` | Default `Defined` |

## 6. DB ↔ UI Mapping — Task Detail

| UI field | API DTO | DB source/target | Mục đích |
|---|---|---|---|
| Task ID | `itemKey` | `work_items.item_key` | Human key |
| Task name | `title` | `work_items.title` | Name |
| Description | `description` | `work_items.description` | Implementation detail |
| Notes | `notes` | `work_items.notes` | Internal notes |
| Attachments | `attachments[]` | `attachments.work_item_id` | Task files |
| State | `status` | `work_items.status_id` | Defined/In-Progress/Completed |
| Owner | `assigneeId` | `work_items.assignee_id` | Responsible user |
| Project | `projectId` | `work_items.project_id` | Scope |
| Team | `teamId` | `work_items.team_id` | Scope |
| Work Product | `parentId` | `work_items.parent_id` | Parent Story/Defect |
| Estimate | `estimateHours` | Task estimate field | Independently editable planned hours |
| To Do | `todoHours` | `work_items.todo_hours` | Remaining hours |
| Actual | `actualHours` | `work_items.actual_hours` | Spent hours |

## 7. API Contracts

```text
GET  /api/v1/work-items/:parentId/tasks
POST /api/v1/work-items/:parentId/tasks
GET  /api/v1/tasks/:taskId
PATCH /api/v1/tasks/:taskId
```

Implementation note: endpoints may internally use `work_items`; separate task route is for clarity.

## 8. Validation Rules

- Task parent must be `story` or `defect`.
- Task cannot parent another task in Phase 1.
- Task project/team must be compatible with parent.
- State only Defined/In-Progress/Completed unless workflow config expands later.
- Time fields cannot be negative.
- Estimate, To Do and Actual are independently editable after create.
- Create copies Estimate to To Do only when To Do was blank; this copy is not repeated on later edits.
- Completed/reopened state changes do not change Estimate, To Do or Actual.
- Changing Work Product moves `parent_id` and must log activity.
- Task inherits the parent Iteration for Team Status and Iteration metrics; it must not expose an independent Iteration selector.
- All child Tasks Completed triggers the parent US/DE roll-up to `Completed`; reopening any child Task triggers the parent to `In-Progress`. The automatic rule does not remove authorized manual parent status editing.

## 9. Permission Rules

| Action | Permission |
|---|---|
| View tasks | `task.view` or `work_item.view` |
| Create task | `task.create` |
| Update task | `task.update` |
| Reassign work product | `task.parent.update` |
| View task activity | `task.activity.view` |

## 10. Acceptance Criteria

1. Tasks tab for US-4821 loads only tasks where `parent_id` = US-4821 DB id.
2. Add Task without Name shows validation.
3. Create Task generates key and `type='task'`.
4. Task is not visible in Backlog list.
5. Click Task ID opens Task Detail.
6. Task Detail has no Tasks tab.
7. Update State/Owner/Estimate/To Do/Actual persists and logs activity without recalculating another hour field.
8. Totals row equals sum of visible tasks.
9. Completing the final child Task automatically changes the parent Story/Defect Schedule State and Flow State to `Completed`.
10. Reopening a child Task after all child Tasks were completed automatically changes the parent to `In-Progress` and recalculates task metrics.
11. Inline edits in Task Dashboard are reflected for the same Task ID in Team Status; no independent Task Iteration assignment is available.
12. Create with Estimate and blank To Do copies Estimate to To Do once; all later edits and Task State transitions leave the three hour fields independent.
13. Owner options are `Unassigned` plus active members of the inherited parent Team; a `No team` parent exposes only `Unassigned`.
14. Task Project always equals the parent Story/Defect Project and is read-only in Task create, inline edit and Task Detail.

## 11. Implementation Breakdown

```text
TASK-T01 Child task list API
TASK-T02 Add task API + modal integration
TASK-T03 Task detail GET/PATCH
TASK-T04 Work Product reassignment validation
TASK-T05 Totals calculation
TASK-T06 Activity logging
TASK-T07 Tests
```
