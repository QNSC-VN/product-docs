# SRS — Phase 1.2 Work Item Create

## 0. Document Control

| Thuộc tính | Giá trị |
|---|---|
| Module ID | `P1-WI-CREATE` |
| Trạng thái | Draft for Development |
| Phạm vi | Tạo Story/Defect từ Backlog |
| Ưu tiên | P1 — bắt buộc |
| Phụ thuộc | Backlog, Project/Team context, Work Item DB |
| Không bao gồm | Tạo Feature/Epic/Task từ Backlog, bulk import |

## 1. Mục tiêu

Cho phép user tạo nhanh Story/Defect trong project/team đang chọn. Task không được tạo từ Backlog; Task chỉ tạo trong tab Tasks của Work Item Detail.

## 2. Tài liệu tham chiếu

| Tài liệu | Phần tham chiếu | Mục đích |
|---|---|---|
| [`PHASE1_MOCKUP_CHECKLIST.md`](../PHASE1_MOCKUP_CHECKLIST.md) | Create Work Item | Kiểm coverage |
| [`mini_rally_database_design.md`](../../../01_DB%20design/mini_rally_database_design.md) | §8.1 `work_items` | Schema create |
| [`BacklogPage.tsx`](../../../03_Mockup%20Design/src/app/pages/BacklogPage.tsx) | Create modal | Mockup |

## 3. Functional Requirements

| ID | Requirement |
|---|---|
| WIC-FR-001 | Button `Create Work Item` mở modal. |
| WIC-FR-002 | Type chỉ gồm Story và Defect. |
| WIC-FR-003 | Field `Title/Name` là required. |
| WIC-FR-004 | Project required, default current project. |
| WIC-FR-005 | Team required/optional theo policy; default current team nếu có. |
| WIC-FR-006 | Owner nullable; default current user hoặc Unassigned theo config. |
| WIC-FR-007 | Plan Estimate nullable, không âm. |
| WIC-FR-008 | `Create` tạo item và quay lại Backlog/list refresh. |
| WIC-FR-009 | `Create with details` tạo item rồi mở Work Item Detail của item vừa tạo. |
| WIC-FR-010 | Item key được sinh atomically, không dùng `MAX(item_no)+1`. |
| WIC-FR-011 | Defect có thể dùng cùng quick modal; defect-specific fields điền ở detail sau. |

## 4. Screen Mapping với Mockup

| UI field/action | Mockup | Production behavior |
|---|---|---|
| Modal title | `New Work Item` | Hiển thị context project/team |
| Type buttons | Story/Defect | Map enum `work_items.type` |
| Project select | Project dropdown | Lấy project user có quyền |
| Team select | Team dropdown | Lọc theo project selected |
| Title | Input placeholder | Required |
| Owner | Dropdown | User list theo project/team membership |
| Plan Estimate | Number input | Map story points |
| Cancel | Button | Đóng modal, không mutate |
| Create | Button | POST rồi refresh list |
| Create with details | Button | POST rồi navigate detail |

## 5. DB ↔ UI Field Mapping

| UI field | API request | DB target | Mục đích | Validation |
|---|---|---|---|---|
| Type | `type` | `work_items.type` | Story/Defect | Required; only `story`,`defect` |
| Project | `projectId` | `work_items.project_id` | Scope item | Required; user must access |
| Workspace | Server-derived | `work_items.workspace_id` | Tenant isolation/query | Derived from session/project |
| Team | `teamId` | `work_items.team_id` | Team owner | Nullable or required by policy; must exist in `project_teams` active |
| Title/Name | `title` | `work_items.title` | Item name | Required, trim, max 500 |
| Owner | `assigneeId` | `work_items.assignee_id` | Responsible user | Nullable; user must belong to project/team policy |
| Plan Estimate | `planEstimate` | `work_items.story_point` | Story point estimate | Nullable; decimal >= 0 |
| Schedule State | Server default | `work_items.schedule_state` | Initial schedule state | Default `Defined` |
| Flow State | Server default | `work_items.flow_state` | Initial flow state | Default `Defined` |
| Reporter | Server-derived | `work_items.reporter_id` | User reporting item | Current user |
| Created by | Server-derived | `work_items.created_by` | Audit | Current user |
| Position | Server-derived | `work_items.position` | Backlog ordering | Append bottom/top per policy |
| Release | Omitted in modal | `work_items.release_id` | Later edit in detail | Null default |
| Iteration | Omitted in modal | `work_items.sprint_id` | Later edit in detail | Null default |
| Description | Omitted in modal | `work_items.description` | Later edit in detail | Null default |

## 6. API Contracts

```text
POST /api/v1/work-items
```

Request:

```json
{
  "projectId": "uuid",
  "teamId": "uuid",
  "type": "story",
  "title": "Implement SSO authentication...",
  "assigneeId": "uuid",
  "planEstimate": 8
}
```

Response:

```json
{
  "id": "uuid",
  "itemKey": "US-4821",
  "type": "story",
  "title": "Implement SSO authentication...",
  "detailUrl": "/work-items/US-4821"
}
```

## 7. Transaction Rules

1. Validate permission.
2. Validate project/team/user references.
3. Reserve/update project item number atomically.
4. Insert `work_items`.
5. Insert `activity_logs` action `work_item.created`.
6. Commit.

## 8. Permission Rules

- Create Story requires `work_item.create.story`.
- Create Defect requires `work_item.create.defect` or generic `work_item.create`.
- Viewer cannot see/enable Create button.
- Backend must reject unauthorized create even if FE button is visible.

## 9. Acceptance Criteria

1. Modal chỉ có Story/Defect.
2. Create without title bị reject và show message.
3. Create Story tạo row `work_items.type='story'`.
4. Create Defect tạo row `work_items.type='defect'`.
5. `item_key` unique và tăng đúng trong project khi concurrent create.
6. Create with details mở detail item vừa tạo.
7. Activity log có `work_item.created`.

## 10. Implementation Breakdown

```text
WIC-T01 Create API + transaction/key generation
WIC-T02 Validation + permissions
WIC-T03 FE modal integration
WIC-T04 Create with details navigation
WIC-T05 Error/loading states
WIC-T06 Tests for concurrent key generation
```
