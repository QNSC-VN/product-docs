# SRS — Phase 1.7 Basic Activity Log / Revision History

## 0. Document Control

| Thuộc tính | Giá trị |
|---|---|
| Module ID | `P1-ACTIVITY` |
| Trạng thái | Draft for Development |
| Phạm vi | Revision History trong Work Item và Task |
| Ưu tiên | P1 — bắt buộc |
| Phụ thuộc | Work Item Create/Update, Task Update, Attachment |
| Không bao gồm | Admin audit log full screen, diff viewer nâng cao |

## 1. Mục tiêu

Revision History là basic activity log để user biết ai đã thay đổi gì, lúc nào, trên Work Item/Task.

Phase 1 không cần audit enterprise đầy đủ; chỉ cần log các action chính và hiển thị trong tab Revision History.

## 2. Tài liệu tham chiếu

| Tài liệu | Phần tham chiếu | Mục đích |
|---|---|---|
| [`mini_rally_database_design.md`](../../../01_DB%20design/mini_rally_database_design.md) | §12.1 `activity_logs` | Schema |
| [`WorkItemDetailPage.tsx`](../../../03_Mockup%20Design/src/app/pages/WorkItemDetailPage.tsx) | Revision History panels | Mockup |
| [`PHASE1_MOCKUP_CHECKLIST.md`](../PHASE1_MOCKUP_CHECKLIST.md) | Activity Log | Coverage |

## 3. Functional Requirements

| ID | Requirement |
|---|---|
| ACT-FR-001 | Work Item Detail có tab Revision History. |
| ACT-FR-002 | Task Detail có tab Revision History. |
| ACT-FR-003 | Activity list sort `created_at DESC`. |
| ACT-FR-004 | Mỗi row hiển thị Time, Actor, Action, Details. |
| ACT-FR-005 | Create/update/Schedule State/Flow State/Defect Priority/owner/time/attachment actions ghi log. |
| ACT-FR-006 | Activity log read-only. |
| ACT-FR-007 | Log không bị xóa khi item đổi field, trừ khi hard-delete policy riêng. |
| ACT-FR-008 | Log chỉ hiển thị theo permission project/team. |

## 4. DB ↔ UI Field Mapping

| UI field | API DTO | DB source | Mục đích | Rule/null handling |
|---|---|---|---|---|
| Time | `createdAt` | `activity_logs.created_at` | Thời điểm action | Required |
| Actor avatar/name | `actor` | `activity_logs.actor_id → users` | Ai thực hiện | Required; deleted user show historical name if stored in metadata later |
| Action | `actionLabel` | `activity_logs.action` | Loại hành động | Map code → label |
| Target item | `target` | `entity_type`, `entity_id`, `work_item_id` | Item/task liên quan | Required for item activity |
| Details | `details` | `old_value`, `new_value`, `metadata` | Miêu tả thay đổi | Generate server-side |
| Work item filter | route id | `activity_logs.work_item_id` | Query history | Parent item or task id |
| Project scope | `projectId` | `activity_logs.project_id` | Security | Required for project action |

## 5. Action Codes Phase 1

| Action code | Trigger | Metadata/old/new |
|---|---|---|
| `work_item.created` | Create Story/Defect | new title/type/project/team |
| `work_item.updated` | Title/content/sidebar update | field name + old/new |
| `work_item.schedule_state_changed` | Schedule State change | old/new schedule state |
| `work_item.flow_state_changed` | Flow State change | old/new flow state |
| `work_item.priority_changed` | Defect Priority change | old/new priority |
| `work_item.assigned` | Owner change | old/new assignee |
| `work_item.estimate_updated` | Plan Estimate change | old/new story_point |
| `task.created` | Add Task | parent + task title |
| `task.updated` | Task title/content/sidebar update | field name + old/new |
| `task.state_changed` | Task State change | old/new state |
| `task.estimate_updated` | Task Estimate change | old/new hours |
| `task.todo_updated` | Task To Do change | old/new hours |
| `task.actual_updated` | Task Actual change | old/new hours |
| `attachment.uploaded` | Upload file | file name/size/type |
| `attachment.deleted` | Delete file | file name |
| `comment.created` | Nếu dùng comments later | comment id |

## 6. API Contract

```text
GET /api/v1/work-items/:id/activity
```

Query params:

| Param | Type | Required | Rule |
|---|---|---:|---|
| `page` | number | No | Default 1 |
| `pageSize` | number | No | Default 50 |

Response:

```json
{
  "items": [
    {
      "id": "uuid",
      "createdAt": "2026-06-24T10:18:00Z",
      "actor": { "id": "uuid", "fullName": "Marcus Webb", "initials": "MW" },
      "action": "task.actual_updated",
      "actionLabel": "updated Actual",
      "details": "TA-2291 · Actual time is now 8h"
    }
  ],
  "page": 1,
  "pageSize": 50,
  "total": 4
}
```

## 7. Logging Rules

- Log in the same DB transaction as business mutation.
- Do not log sensitive tokens/passwords.
- Do not store full rich text body in activity detail; store field name and optional short summary.
- For old/new values, use JSONB:

```json
{
  "field": "actual_hours",
  "old": 5,
  "new": 8
}
```

## 8. Permission Rules

| Action | Permission |
|---|---|
| View activity | `work_item.activity.view` |
| Create activity | Server internal only |

User cannot directly create/edit/delete activity via public API.

## 9. Acceptance Criteria

1. Work Item Revision History loads activity for selected Story/Defect.
2. Task Revision History loads activity for selected Task.
3. Updating status/owner/time writes activity row.
4. Uploading attachment writes activity row.
5. Activity sort newest first.
6. Unauthorized user cannot query another project activity.
7. Activity details are readable and do not expose raw sensitive payload.

## 10. Implementation Breakdown

```text
ACT-T01 Activity service/helper
ACT-T02 Add activity writes to create/update/task/attachment flows
ACT-T03 Activity query API
ACT-T04 FE Revision History integration
ACT-T05 Permission enforcement
ACT-T06 Tests
```
