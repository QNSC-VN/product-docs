# SRS — Phase 1.3 Work Item Detail

## 0. Document Control

| Thuộc tính | Giá trị |
|---|---|
| Module ID | `P1-WI-DETAIL` |
| Trạng thái | Draft for Development |
| Phạm vi | Full page detail cho Story/Defect |
| Ưu tiên | P1 — bắt buộc |
| Phụ thuộc | Work Item List/Create, Content, Activity Log |
| Không bao gồm | Custom workflow designer, test cases, child stories |

## 1. Mục tiêu

Work Item Detail là nơi user xem/sửa dữ liệu nghiệp vụ của Story/Defect. UI gồm banner, tab Details/Tasks/Revision History, vùng nội dung trái và field sidebar phải.

## 2. Tài liệu tham chiếu

| Tài liệu | Phần tham chiếu | Mục đích |
|---|---|---|
| [`PHASE1_MOCKUP_CHECKLIST.md`](../PHASE1_MOCKUP_CHECKLIST.md) | Work Item Detail | Kiểm coverage |
| [`mini_rally_database_design.md`](../../../01_DB%20design/mini_rally_database_design.md) | §8.1, §9, §10, §11, §12 | Schema |
| [`WorkItemDetailPage.tsx`](../../../03_Mockup%20Design/src/app/pages/WorkItemDetailPage.tsx) | Work Item detail | Mockup |
| [`shared.tsx`](../../../03_Mockup%20Design/src/app/components/shared.tsx) | Summary panel | Collapse behavior |

## 3. Functional Requirements

| ID | Requirement |
|---|---|
| WID-FR-001 | Click item ID từ Backlog mở full Work Item Detail. |
| WID-FR-002 | Header hiển thị Type, Item Key, Title. |
| WID-FR-003 | Có icon collapse để thu về summary panel. |
| WID-FR-004 | Tab Details hiển thị Description, Attachments, Notes, Release Notes. |
| WID-FR-005 | Tab Tasks hiển thị task list full width. |
| WID-FR-006 | Tab Revision History hiển thị basic activity log. |
| WID-FR-007 | Sidebar hiển thị Owner, Project, Team, Schedule State, Flow State, Plan Estimate, Release, Milestones, Iteration. Nếu Work Item là Defect thì hiển thị thêm Priority. |
| WID-FR-008 | Field update phải persist DB và ghi activity log. |
| WID-FR-009 | Project/team/status/release/iteration dropdown chỉ hiển thị option hợp lệ. |
| WID-FR-010 | Project Admin outside managed Project chỉ có read-only access và không sửa được field. |
| WID-FR-011 | Refresh/direct URL detail phải load đúng item. |
| WID-FR-012 | Schedule State và Flow State dùng cùng catalog `Idea/Defined/In-Progress/Completed/Accepted/Release`; đổi một field phải phản ánh field còn lại trong MVP. |
| WID-FR-013 | Rule Schedule/Flow áp dụng cho Story/Defect; child Task tiếp tục chỉ dùng `Defined/In-Progress/Completed`. |
| WID-FR-014 | Work Item có zero/one Release và zero/many Milestones. Milestone selector luôn giữ visible các giá trị đã chọn; đổi Release không tự thêm/xóa Milestone. Nếu đã có Release, chỉ option thêm mới bị lọc theo Milestone liên kết Release đó. |
| WID-FR-015 | Gán Work Item vào Iteration chỉ thay đổi membership; không tự chuyển Iteration sang Committed và không khóa scope. Lifecycle Iteration tham chiếu Phase 2. |

## 4. Screen Mapping với Mockup

| UI area | Mockup component | Production behavior |
|---|---|---|
| Banner | `WorkItemDetailPage` header | Route `/work-items/:itemKey` hoặc `/p/:projectKey/work-items/:itemKey` |
| Collapse icon | `onMinimize` | Trở về Backlog + summary panel selected |
| Details tab | `RichTextEditor`, `AttachmentBlock` | Persist rich fields/attachments |
| Tasks tab | `TASKS` table | Query child tasks |
| Revision tab | `RevisionHistoryPanel` | Query `activity_logs` |
| Sidebar | `Field` controls | Patch field-level updates |

## 5. DB ↔ UI Field Mapping

| UI field | API DTO | DB source/target | Mục đích | Rule/null handling |
|---|---|---|---|---|
| Type badge | `type` | `work_items.type` | Story/Defect label | Read-only in Phase 1 |
| ID | `itemKey` | `work_items.item_key` | Stable human key | Read-only |
| Title | `title` | `work_items.title` | Item name | Required; editable if permission |
| Description | `description` | `work_items.description` | Business description | Nullable; rich text sanitized |
| Attachments | `attachments[]` | `attachments.work_item_id` | Files linked to item | Empty list if none |
| Notes | `notes` | `work_items.notes` | Internal notes | Nullable; requires Phase 1 migration |
| Release Notes | `releaseNotes` | `work_items.release_notes` | Technical writer content | Nullable; requires Phase 1 migration |
| Owner | `assignee` | `work_items.assignee_id → users` | Responsible person | Nullable → Unassigned |
| Project | `project` | `work_items.project_id → projects` | Scope | Required; changing project is advanced, may be disabled |
| Team | `team` | `work_items.team_id → teams` | Team scope | Nullable; validate `project_teams` |
| Schedule State | `scheduleState` | `work_items.schedule_state` | Trạng thái lập lịch/độ chín nghiệp vụ | Required; enum `Idea/Defined/In-Progress/Completed/Accepted/Release`; default Idea; mirror Flow State trong MVP |
| Flow State | `flowState` | `work_items.flow_state` | Trạng thái luồng thực thi | Required; cùng enum/default với Schedule State; mirror Schedule State trong MVP |
| Priority | `priority` | `work_items.priority` | Mức ưu tiên Defect | Chỉ show/edit khi `type='defect'`; enum `Low/Normal/High/Urgent/None` |
| Plan Estimate | `planEstimate` | `work_items.story_point` | Story point estimate | Nullable/decimal >=0 |
| Release | `release` | `work_items.release_id → releases` | Release target | Nullable → Unscheduled |
| Milestones | `milestoneIds[]` | Work Item–Milestone relation | Zero/many Milestone targets | Selected values persist; add-new options filter by current Release relation |
| Iteration | `iteration` | `work_items.sprint_id → sprints` | Sprint/iteration assignment | Nullable → Unscheduled |
| Created/Updated | `audit` | `created_at`, `updated_at`, `created_by`, `updated_by` | Audit/debug | Not necessarily visible in Phase 1 |

## 6. API Contracts

```text
GET   /api/v1/work-items/:itemKey
PATCH /api/v1/work-items/:id
```

Patch request supports partial update:

```json
{
  "title": "Updated title",
  "description": "<p>...</p>",
  "notes": "<p>...</p>",
  "releaseNotes": "<p>...</p>",
  "assigneeId": "uuid",
  "teamId": "uuid",
  "scheduleState": "In-Progress",
  "flowState": "In-Progress",
  "priority": "Urgent",
  "storyPoint": 8,
  "releaseId": "uuid",
  "milestoneIds": ["uuid"],
  "sprintId": "uuid"
}
```

## 7. Validation Rules

- `title` required, max 500.
- `storyPoint >= 0`.
- `teamId` must be active team linked to project.
- `scheduleState` and `flowState` must be one of `Idea`, `Defined`, `In-Progress`, `Completed`, `Accepted`, `Release`.
- Story/Defect update của một trong hai field phải lưu cùng giá trị cho field còn lại trong MVP; không dùng legacy `Code Review`, `Testing` hoặc spelling `Released`.
- `priority` is accepted only for Defect and must be one of `Low`, `Normal`, `High`, `Urgent`, `None`.
- `releaseId` and `sprintId` must belong to same project.
- `milestoneIds[]` accepts zero or more valid Milestones. Changing `releaseId` never removes existing values; it limits only the option set for adding another Milestone.
- Assigning `sprintId` does not auto-commit the Iteration or lock scope.
- Rich text must be sanitized.
- Cannot patch soft-deleted item.

## 8. Permission Rules

| Action | Permission |
|---|---|
| View detail | `work_item.view` |
| Edit title/content/sidebar | `work_item.update` |
| Change Schedule State / Flow State | `work_item.status.update` |
| Change Defect Priority | `work_item.priority.update` |
| Change release/iteration | `work_item.schedule.update` |
| Upload attachment | `work_item.attachment.upload` |
| View activity | `work_item.activity.view` |

## 9. Acceptance Criteria

1. Direct open `/work-items/:itemKey` loads correct Story/Defect.
2. Details tab render Description/Attachments/Notes/Release Notes.
3. Sidebar updates persist after refresh.
4. Invalid team/release/iteration from another project is rejected.
5. Viewer sees read-only fields.
6. Every update writes activity log with old/new value.
7. Collapse icon returns user to summary panel state without losing selected item.

## 10. Implementation Breakdown

```text
WID-T01 Detail GET API + DTO
WID-T02 PATCH API + field validation
WID-T03 FE detail page integration
WID-T04 Sidebar field patch/save UX
WID-T05 Rich content persistence hooks
WID-T06 Collapse/summary behavior
WID-T07 Permission/read-only states
WID-T08 Tests
```
