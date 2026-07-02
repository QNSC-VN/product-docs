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
| TASK-FR-006 | Add Task fields: Name required, Estimate, Owner. |
| TASK-FR-007 | Buttons: Cancel, Create, Create with details. |
| TASK-FR-008 | Click Task ID mở Task Detail. |
| TASK-FR-009 | Task Detail có banner riêng, tabs Details và Revision History, không có Tasks tab. |
| TASK-FR-010 | Task Detail left: Description, Notes, Attachments. |
| TASK-FR-011 | Task Detail right: State, Owner, Project, Team, Work Product, Estimate, To Do, Actual. |
| TASK-FR-012 | Work Product có thể chỉnh nhưng phải validate cùng project/team scope. |

## 4. DB ↔ UI Mapping — Task List

| UI field | API DTO | DB source | Mục đích | Rule/null handling |
|---|---|---|---|---|
| Rank | `rank` | `work_items.position` | Sort task trong parent | Required; default append |
| ID | `itemKey` | `work_items.item_key` | Task key | Required |
| Name | `title` | `work_items.title` | Task name | Required |
| State | `state` | `work_items.status_id → workflow_statuses` | Task state | Phase 1 states: Defined/In-Progress/Completed |
| Owner | `assignee` | `work_items.assignee_id → users` | Task owner | Nullable |
| Project | `project` | `work_items.project_id → projects` | Scope | Same project as parent by default |
| Teams | `team` | `work_items.team_id → teams` | Responsible team | Nullable/default parent team |
| To Do | `todoHours` | `work_items.todo_hours` | Remaining work | Decimal >= 0; requires Phase 1 migration |
| Actuals | `actualHours` | `work_items.actual_hours` | Actual time spent | Decimal >= 0; requires Phase 1 migration |
| Estimate | `estimateHours` | `work_items.estimate_hours` | Task estimate in hours | Decimal >= 0; requires Phase 1 migration |
| Parent | `parentId` | `work_items.parent_id` | Link to Story/Defect | Required for task |

## 5. DB ↔ UI Mapping — Add Task Modal

| UI field | API request | DB target | Rule |
|---|---|---|---|
| Name | `title` | `work_items.title` | Required |
| Estimate | `estimateHours` | `work_items.estimate_hours` | Nullable/0, decimal >= 0 |
| Owner | `assigneeId` | `work_items.assignee_id` | Nullable; must be valid member |
| Parent work item | route/context | `work_items.parent_id` | Current Story/Defect |
| Type | server default | `work_items.type='task'` | Not user editable |
| Project/team | server default | `project_id`, `team_id` | Inherit parent unless provided |
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
| Estimate | `estimateHours` | `work_items.estimate_hours` | Planned hours |
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
- Changing Work Product moves `parent_id` and must log activity.

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
7. Update State/Owner/Estimate/To Do/Actual persists and logs activity.
8. Totals row equals sum of visible tasks.

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
