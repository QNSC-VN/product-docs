# SRS — Phase 1.1 Backlog Work Item List

## 0. Document Control

| Thuộc tính | Giá trị |
|---|---|
| Module ID | `P1-BACKLOG-LIST` |
| Trạng thái | Draft for Development |
| Phạm vi | Backlog list cho Story và Defect |
| Ưu tiên | P1 — bắt buộc |
| Phụ thuộc | Phase 0 App Shell, Project/Team context, Work Item DB |
| Không bao gồm | Sprint planning, board, Feature/Task backlog độc lập |

## 1. Mục tiêu

Backlog là màn hình trung tâm để user nhìn toàn bộ Story/Defect của project/team hiện tại, tìm kiếm, lọc, phân trang và mở chi tiết item.

Phase 1 Backlog không dùng để gán sprint hay theo dõi sprint. Sprint/Iteration thuộc phase khác.

## 2. Tài liệu tham chiếu

| Tài liệu | Phần tham chiếu | Mục đích |
|---|---|---|
| [`PHASE1_MOCKUP_CHECKLIST.md`](../PHASE1_MOCKUP_CHECKLIST.md) | Backlog coverage | Đối chiếu mockup |
| [`Project_developement_plan.md`](../../Project_developement_plan.md) | Phase 1 scope | Phạm vi delivery |
| [`mini_rally_database_design.md`](../../../01_DB%20design/mini_rally_database_design.md) | §8 Work Item Management, §9 Sprint, §10 Release | Schema nguồn |
| [`mini_rally_erd.md`](../../../00_Documents/mini_rally_erd.md) | Work item relationships | Quan hệ DB |
| [`BacklogPage.tsx`](../../../03_Mockup%20Design/src/app/pages/BacklogPage.tsx) | Toàn file | Mockup màn hình |
| [`App.tsx`](../../../03_Mockup%20Design/src/app/App.tsx) | Backlog route/detail open | Page orchestration |

## 3. Actor

- Workspace Admin.
- Project Manager.
- Product Owner / BA.
- Developer / QA.
- Viewer.

## 4. Functional Requirements

| ID | Requirement |
|---|---|
| BL-FR-001 | Backlog load theo selected Project và Team context. |
| BL-FR-002 | Chỉ hiển thị `story` và `defect`; không hiển thị `task`, `feature`, `epic`, `initiative`. |
| BL-FR-003 | User chỉ thấy item thuộc project/team họ có quyền xem. |
| BL-FR-004 | Search theo `item_key` hoặc `title`. |
| BL-FR-005 | Filter Type gồm All/Story/Defect. |
| BL-FR-006 | Backlog hiển thị `Schedule State`; Priority chỉ áp dụng cho Defect. |
| BL-FR-007 | Pagination server-side, rows per page 10/25/50/100. |
| BL-FR-008 | Click ID hoặc row mở full Work Item Detail. |
| BL-FR-009 | List có column resize ở FE; width có thể lưu local preference, không bắt buộc lưu DB. |
| BL-FR-010 | Empty state rõ ràng khi không có item. |
| BL-FR-011 | Loading/error/retry state không làm mất App Shell. |
| BL-FR-012 | Soft-deleted item không hiển thị. |

## 5. Screen Mapping với Mockup

| UI area | Mockup component | Production behavior |
|---|---|---|
| Page title | `BacklogPage` heading | Hiển thị Backlog + context project/team |
| Create button | `Create Work Item` | Mở modal create Story/Defect |
| Project/team selector | Top/context/create controls | Lấy từ App Context/API, không hard-code |
| Search box | Search input | Debounce query, server-side |
| Type filter | Select All/Story/Defect | Map `work_items.type` |
| Schedule State/Priority/Release filters | Select controls hiện có | Priority filter chỉ áp dụng Defect; Schedule State map `work_items.schedule_state` |
| Table header | Resizable headers | Resize UI-only hoặc user preference |
| Rows | `WORK_ITEMS` mock data | Replace bằng API result |
| Footer pagination | Rows per page + prev/next | Server pagination |

## 6. DB ↔ UI Field Mapping

| UI field | API DTO | DB source | Mục đích | Rule/null handling |
|---|---|---|---|---|
| Row number `#` | `rowNumber` | Derived from `page`, `pageSize`, index | Hiển thị thứ tự trong page | Không lưu DB |
| Type | `type` | `work_items.type` | Phân biệt Story/Defect | Required; query chỉ `story`,`defect` |
| ID | `itemKey` | `work_items.item_key` | Link mở detail, key user thấy | Required, unique theo project number generation |
| Name | `title` | `work_items.title` | Tên item | Required, max 500 |
| Priority | `priority` | `work_items.priority` | Ưu tiên Defect | Chỉ hiển thị/áp dụng cho Defect; Story hiển thị `—` |
| Estimate | `planEstimate` | `work_items.story_point` | Estimate cấp Story/Defect bằng point | Nullable → hiển thị `—` hoặc 0 theo rule |
| Owner avatar | `owner` | `work_items.assignee_id → users` | Người phụ trách | Nullable → Unassigned |
| Schedule State | `scheduleState` | `work_items.schedule_state` | Trạng thái lập lịch/độ chín nghiệp vụ | Required default `Defined`; enum Idea/Defined/In-Progress/Completed/Accepted/Release |
| Release | `release` | `work_items.release_id → releases` | Release target nếu giữ cột | Nullable → `Unscheduled` |
| Project | `project` | `work_items.project_id → projects` | Context/filter/security | Không cần hiển thị nếu đang ở project |
| Team | `team` | `work_items.team_id → teams` | Team chịu trách nhiệm | Nullable nếu All Teams |
| Updated at | `updatedAt` | `work_items.updated_at` | Sort/cache invalidation | Không nhất thiết hiển thị |

## 7. Query Contract

```text
GET /api/v1/projects/:projectId/backlog
```

Query params:

| Param | Type | Required | Rule |
|---|---|---:|---|
| `teamId` | UUID | No | Nếu có, validate team thuộc project và user access |
| `type` | `story`,`defect` | No | Omit = all Story/Defect |
| `q` | string | No | Search item_key/title |
| `scheduleState` | enum | No | Filter theo Schedule State |
| `priority` | enum | No | Chỉ áp dụng cho Defect; values `Low/Normal/High/Urgent/None` |
| `releaseId` | UUID | No | Nếu giữ release filter |
| `page` | number | Yes | 1-based |
| `pageSize` | 10/25/50/100 | Yes | Default 25 |
| `sort` | string | No | Default `position ASC, item_no ASC` |

Response:

```json
{
  "items": [
    {
      "id": "uuid",
      "itemKey": "US-4821",
      "type": "story",
      "title": "Implement SSO authentication...",
      "priority": "Urgent",
      "scheduleState": "In-Progress",
      "planEstimate": 8,
      "owner": { "id": "uuid", "fullName": "Marcus Webb", "initials": "MW" },
      "release": { "id": "uuid", "name": "Q4 2024" }
    }
  ],
  "page": 1,
  "pageSize": 25,
  "total": 17
}
```

## 8. Permission Rules

- View Backlog cần permission `work_item.view`.
- Create button chỉ enable khi có `work_item.create`.
- API phải enforce project/team access; UI hide không đủ.
- Viewer thấy list và mở detail nhưng không sửa.

## 9. Acceptance Criteria

1. Backlog chỉ trả Story/Defect của selected project/team.
2. Task child không xuất hiện trong Backlog list.
3. Search `US-4821` trả đúng item.
4. Pagination 10/25/50/100 hoạt động và total đúng.
5. Click `itemKey` mở full Work Item Detail.
6. User không có quyền project không xem được item qua direct API.
7. Soft-deleted item không xuất hiện.

## 10. Implementation Breakdown

```text
BL-T01 Backlog API query + DTO
BL-T02 Server-side pagination/filter/search
BL-T03 FE integration thay mock data
BL-T04 Detail navigation/open full page
BL-T05 Loading/empty/error states
BL-T06 Permission gating
BL-T07 Contract/e2e tests
```

## 11. Open Questions

| ID | Question | Default đề xuất |
|---|---|---|
| BL-Q01 | Production Backlog có giữ Priority/Schedule State/Release không? | Đã chốt: giữ cả 3; Priority chỉ dành cho Defect |
