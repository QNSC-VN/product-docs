# SRS — Phase 2.1 Backlog Enhancement

## 0. Document Control

| Thuộc tính | Giá trị |
|---|---|
| Module ID | `P2-BACKLOG-ENHANCEMENT` |
| Trạng thái | Draft for Development |
| Ngày cập nhật | 2026-06-28 |
| Phạm vi | Backlog nâng cao cho Story và Defect, bao gồm gán Iteration |
| Ưu tiên | P2.1 — bắt buộc |
| Phụ thuộc | Phase 1 Backlog, Work Item API, Release data, Iteration data, Project/Team context |
| Không bao gồm | Sprint summary, Sprint planning, Board drag/drop |

## 1. Mục tiêu

Backlog Enhancement giúp BA/PO/Scrum Master thao tác trực tiếp trên danh sách Story/Defect: lọc tốt hơn, chỉnh field nhanh, ưu tiên lại backlog, gán release và gán iteration mà không phải mở từng item.

P2.1 không biến Backlog thành Sprint Planning. Iteration assignment trong Backlog chỉ là cập nhật field `iterationId` của Work Item để xác định item thuộc Iteration nào. Metric, execution summary và tracking chi tiết nằm ở P2.3 Iteration Status.

## 2. Tài liệu tham chiếu

| Tài liệu | Phần tham chiếu | Mục đích |
|---|---|---|
| [`PHASE2_MOCKUP_CHECKLIST.md`](../PHASE2_MOCKUP_CHECKLIST.md) | P2.1 Backlog Enhancement | Đối chiếu mockup |
| [`PHASE2_DEVELOPMENT_TRACKING.md`](../PHASE2_DEVELOPMENT_TRACKING.md) | Development task plan | Theo dõi dev |
| [`Project_developement_plan.md`](../../Project_developement_plan.md) | Phase 2 / Backlog | Phạm vi delivery |
| [`Phase 1/01_Backlog_Work_Item_List/SRS.md`](../../Phase%201/01_Backlog_Work_Item_List/SRS.md) | Base Backlog contract | Kế thừa Phase 1 |
| [`mini_rally_database_design.md`](../../../01_DB%20design/mini_rally_database_design.md) | Work items, sprints, releases, rank | Schema nguồn |
| [`DATABASE_SCHEMA.md`](../../../05_Architecture/DATABASE_SCHEMA.md) | `work_items.rank`, `iteration_id`, `release_id` | Physical design |
| [`DOMAIN_DESIGN.md`](../../../05_Architecture/DOMAIN_DESIGN.md) | LexoRank, board/backlog ordering | Domain rules |
| [`BacklogPage.tsx`](../../../03_Mockup%20Design/src/app/pages/BacklogPage.tsx) | Toàn file | Mockup màn hình |

## 3. Actor

- Workspace Admin.
- Project Manager / Scrum Master.
- Product Owner / BA.
- Developer / QA.
- Viewer.

## 3A. Business Rules / Business Flow

Backlog là nguồn sự thật của Story/Defect trước khi và trong khi item được đưa vào Iteration.

Business flow chuẩn của Phase 2:

```text
Workspace selector chọn Project/Team
-> Backlog hiển thị Story/Defect của Project/Team đó
-> User ưu tiên, chỉnh owner/state/estimate/release
-> User gán hoặc đổi Iteration cho từng Story/Defect
-> Work Item Detail cũng hiển thị và cho chỉnh Iteration ở panel phải
-> Iteration Status đọc các Work Item có iterationId bằng Iteration đang chọn
```

Nghiệp vụ chính:

- Project/Team context được lấy từ workspace selector ở top navigation.
- Khi user chọn một Team thuộc Project nào, Backlog chỉ load Story/Defect thuộc đúng Project/Team đó.
- Khi tạo Work Item từ Backlog, field Project và Team được auto-fill theo Project/Team context hiện tại.
- Account hiện tại trong mockup là Workspace Admin, nên vẫn có quyền đổi Project/Team trong form tạo/chỉnh sửa nếu cần.
- Một Story/Defect có thể chưa thuộc Iteration nào; UI hiển thị `Unscheduled`.
- Gán Iteration không tạo bản sao Work Item và không xóa item khỏi Backlog.
- Khi đổi Iteration, Work Item chuyển sang Iteration mới và sẽ không còn xuất hiện trong Iteration Status của Iteration cũ.
- Iteration được chọn phải thuộc cùng Project/Team context với Work Item, trừ khi BA/PO sau này cho phép cross-team planning.
- Backlog vẫn là danh sách quản lý scope; Iteration Status là màn tracking các item đã được assign.

## 4. Functional Requirements

| ID | Requirement |
|---|---|
| P2-BL-FR-001 | Backlog load theo selected Project và Team context. |
| P2-BL-FR-001A | Changing workspace selector Project/Team refreshes Backlog and only shows records in that Project/Team. |
| P2-BL-FR-001B | Create Work Item defaults Project and Team from the current workspace selector context. |
| P2-BL-FR-001C | Workspace Admin may override Project and Team during create/edit, but selected Team must be valid for selected Project. |
| P2-BL-FR-002 | Backlog chỉ hiển thị Story và Defect; không hiển thị Task/Feature như backlog item độc lập. |
| P2-BL-FR-003 | User có thể search theo `item_key` hoặc `title` bằng quick search `Search work...` ở toolbar. |
| P2-BL-FR-004 | Filter gồm Type, Schedule State, Defect Priority, Owner, Release và Iteration. |
| P2-BL-FR-005 | User có thể mở Manage Filters và chọn nhiều column để combine filter. |
| P2-BL-FR-006 | Filter ID, Name và Est dùng text/number input; các field còn lại dùng dropdown. |
| P2-BL-FR-007 | Column header có sort icon; click để sort theo column. |
| P2-BL-FR-008 | Rank sort low-high/high-low; text columns sort A-Z/Z-A; Estimate sort largest-smallest/smallest-largest; ID sort newest-oldest/oldest-newest. |
| P2-BL-FR-009 | User có quyền edit có thể inline edit Title. |
| P2-BL-FR-010 | User có quyền edit có thể inline edit Defect Priority; Story không có priority editable trong Backlog. |
| P2-BL-FR-011 | User có quyền edit có thể inline edit Plan Estimate. |
| P2-BL-FR-012 | User có quyền edit có thể inline edit Owner. |
| P2-BL-FR-013 | User có quyền edit có thể inline edit Schedule State. |
| P2-BL-FR-014 | User có quyền edit có thể inline edit Release. |
| P2-BL-FR-014A | User có quyền edit có thể inline edit Iteration. |
| P2-BL-FR-015 | User có quyền edit có thể bulk assign Release cho selected items. |
| P2-BL-FR-015A | User có quyền edit có thể bulk assign Iteration cho selected items. |
| P2-BL-FR-016 | User có quyền manage backlog có thể reorder backlog; production cập nhật `rank`. |
| P2-BL-FR-017 | Viewer được xem, search/filter/pagination/open detail nhưng không được inline edit, bulk assign hoặc reorder. |
| P2-BL-FR-018 | Sprint summary và Sprint planning không xuất hiện trong Backlog P2.1; Iteration assignment chỉ là field của Work Item. |
| P2-BL-FR-019 | KPI/metric summary strip không hiển thị trong Backlog; pattern này giữ lại cho Iteration Status, Dashboard hoặc Reports. |
| P2-BL-FR-020 | Manage Filters nằm bên trái trong filter banner; user chọn nhiều column bằng checkbox và Apply để combine filter. |
| P2-BL-FR-021 | Header title của các cột và text record trong list dùng typography đồng đều 11px. |

## 5. Screen Mapping với Mockup

| UI area | Mockup component | Production behavior |
|---|---|---|
| Page header | `BacklogPage` heading | Hiển thị Backlog + selected project/team context |
| Search | Search work input | Quick search by ID/title |
| Manage filters | Left-side popover with checkbox column selection | User chooses visible filter fields |
| Text filters | ID, Name, Est controls | Search-style input |
| Dropdown filters | Type, Priority, Owner, Schedule State, Release, Iteration | Select values from allowed options |
| Sort icons | Header buttons on visible columns including Rank | Server-side sort in production; local sort in mockup |
| Table typography | 11px header title and record text | Consistent dense backlog list |
| Inline title | Input trong Name column | PATCH title |
| Inline priority | Select trong Priority column | PATCH priority cho Defect |
| Inline estimate | Number input trong Est column | PATCH story points/plan estimate |
| Inline owner | Owner select | PATCH assignee |
| Inline status | Schedule State select | PATCH schedule state/status field |
| Inline release | Release select | PATCH release |
| Inline iteration | Iteration select | PATCH iteration assignment |
| Bulk release | Selected bar release select | Bulk mutation |
| Bulk iteration | Selected bar iteration select | Bulk mutation |
| Reorder | Move up/down controls | Production có thể dùng drag/drop; API dùng rank |

## 6. DB ↔ UI Field Mapping

| UI field | API DTO | DB source | Rule/null handling |
|---|---|---|---|
| Type | `type` | `work_items.type` | Chỉ `story`,`defect` |
| ID | `itemKey` | `work_items.item_key` | Read-only trong list |
| Title | `title` | `work_items.title` | Required; trim; max theo Phase 1 |
| Defect Priority | `priority` | `work_items.priority` | Chỉ Defect; Story hiển thị `-` |
| Plan Estimate | `planEstimate` | `work_items.story_points` | Numeric >= 0; nullable theo DB nhưng UI nên default empty/0 |
| Owner | `owner` | `work_items.assignee_id -> users` | Nullable -> Unassigned |
| Schedule State | `scheduleState` | `work_items.schedule_state` hoặc `status_id` tùy implementation hiện tại | Required default |
| Release | `release` | `work_items.release_id -> releases` | Nullable -> Unscheduled |
| Iteration | `iteration` | `work_items.iteration_id -> planning.sprints` hoặc equivalent Iteration table | Nullable -> Unscheduled |
| Blocked | `isBlocked` | `work_items.is_blocked` | Read-only trong P2.1 list |
| Rank | `rank` | `work_items.rank` | LexoRank scoped by project/backlog |

## 7. API Contracts

### 7.1 List Backlog

```text
GET /api/v1/projects/:projectId/backlog
```

Query params:

| Param | Type | Required | Rule |
|---|---|---:|---|
| `teamId` | UUID | No | Validate team thuộc project |
| `type` | `story`,`defect` | No | Omit = all |
| `q` | string | No | Search `item_key`/`title` |
| `scheduleState` | enum | No | Filter schedule state |
| `priority` | enum | No | Chỉ áp dụng Defect |
| `ownerId` | UUID | No | Filter assignee |
| `releaseId` | UUID | No | Filter release |
| `iterationId` | UUID/string | No | Filter iteration; special value may represent Unscheduled |
| `pageSize` | 10/25/50/100 | Yes | Default 25 |
| `cursor` hoặc `page` | string/number | Yes | Theo pagination standard |
| `sortBy` | enum | No | `rank`,`type`,`itemKey`,`title`,`priority`,`storyPoints`,`assignee`,`scheduleState`,`release`,`iteration` |
| `sortDirection` | `asc`,`desc` | No | Default rank order if omitted |

Response:

```json
{
  "items": [
    {
      "id": "uuid",
      "itemKey": "US-4821",
      "type": "story",
      "title": "Implement SSO authentication",
      "priority": null,
      "scheduleState": "in_progress",
      "planEstimate": 8,
      "owner": { "id": "uuid", "fullName": "Marcus Webb", "initials": "MW" },
      "release": { "id": "uuid", "name": "Q4 2024" },
      "iteration": { "id": "uuid", "name": "Sprint 24.3" },
      "isBlocked": false,
      "rank": "0|hzzzzz:"
    }
  ],
  "pageInfo": {
    "hasNextPage": false,
    "endCursor": null
  }
}
```

### 7.2 Inline Update

```text
PATCH /api/v1/work-items/:id
```

Allowed fields from Backlog:

| Field | Rule |
|---|---|
| `title` | Required after trim |
| `priority` | Defect only |
| `storyPoints` | Number >= 0 |
| `assigneeId` | User must be project/workspace member |
| `scheduleState` or `statusId` | Must be valid project workflow/status |
| `releaseId` | Release must belong to same project |
| `iterationId` | Iteration must belong to same project/team context; nullable/unassigned allowed |

### 7.3 Bulk Assign Release

```text
PATCH /api/v1/work-items/bulk-release
```

Request:

```json
{
  "projectId": "uuid",
  "itemIds": ["uuid"],
  "releaseId": "uuid"
}
```

Rules:

- All items must belong to same tenant/project.
- User must have edit permission for every item.
- Release must belong to same project.
- Partial success is not allowed in P2.1; fail the whole request if any item is invalid.

### 7.4 Bulk Assign Iteration

```text
PATCH /api/v1/work-items/bulk-iteration
```

Request:

```json
{
  "projectId": "uuid",
  "teamId": "uuid",
  "itemIds": ["uuid"],
  "iterationId": "uuid-or-null"
}
```

Rules:

- All items must belong to same tenant/project.
- Each item must be Story or Defect in P2.1 scope.
- Iteration must belong to the same Project/Team context as the work items.
- `iterationId = null` or explicit unassigned value moves selected items to `Unscheduled`.
- Partial success is not allowed in P2.1; fail the whole request if any item is invalid.

### 7.5 Reorder Backlog

```text
PATCH /api/v1/work-items/:id/rank
```

Request:

```json
{
  "projectId": "uuid",
  "beforeId": "uuid-or-null",
  "afterId": "uuid-or-null"
}
```

Rules:

- API computes new LexoRank between neighbors.
- Do not update every row for normal moves.
- If rank space is exhausted, run rebalance under project/backlog lock.

## 8. Permission Rules

| Action | Required permission |
|---|---|
| View backlog | `work_item:view` |
| Inline edit title/estimate/owner/state/release/iteration | `work_item:update` |
| Edit Defect Priority | `work_item:update` |
| Bulk assign release | `work_item:update` plus project/release access |
| Bulk assign iteration | `work_item:update` plus project/team/iteration access |
| Reorder backlog | `backlog:prioritize` or `work_item:rank_update` |
| Create item | `work_item:create` |

Viewer role must render read-only controls and must be blocked by API if direct mutation is attempted.

## 9. Validation Rules

- Title cannot be empty after trim.
- Plan Estimate must be numeric and >= 0.
- Priority update is rejected for Story unless product later allows story priority.
- Owner must be assignable in current project/team context.
- Release must belong to the same project.
- Iteration must belong to the same project/team context.
- Reorder neighbors must belong to the same project/backlog scope.
- Soft-deleted items cannot be edited, bulk assigned or reordered.

## 10. UI States

- Loading: keep App Shell visible, table area shows loading skeleton.
- Empty: show empty state after filters/search.
- Inline saving: edited cell may show pending state; list must not jump.
- Inline error: rollback cell value and show field-level/toast error.
- Read-only: Viewer sees text/badges instead of editable selects/inputs.
- Bulk action empty: selected bar hidden when no row selected.
- Reorder disabled: first row cannot move up; last row cannot move down.

## 11. Acceptance Criteria

1. Backlog P2.1 only displays Story and Defect.
2. Backlog list respects the active workspace selector Project/Team context.
3. Changing workspace selector Project/Team refreshes Backlog records.
4. Create Work Item auto-fills Project and Team from the active workspace selector context.
5. Workspace Admin can override Project/Team in create/edit where enabled, but selected Team must belong to selected Project.
6. Quick search `Search work...` remains visible in the toolbar and searches ID/title.
7. Manage Filters allows selecting multiple columns and combines active filters after Apply.
8. ID/Name/Est filters use text or number input; other supported fields use dropdown values.
9. Owner and Release filters narrow the result correctly.
10. KPI/metric summary strip is not shown in Backlog P2.1.
11. Header sort icon changes order by the selected column, including Rank.
12. Header title and record text render consistently at 11px.
13. Inline title edit persists and is visible after refresh.
14. Inline Defect Priority edit persists; Story priority remains unavailable.
15. Inline Plan Estimate rejects negative values.
16. Inline Owner validates project/workspace membership.
17. Inline Release validates same-project release.
18. Inline Iteration validates same-project/team iteration and updates `iterationId`.
19. Work Item Detail right panel shows Iteration and allows the same assignment rule.
20. Bulk assign Release updates all selected valid items or fails all.
21. Bulk assign Iteration updates all selected valid items or fails all.
22. Reorder updates item rank and preserves order after refresh.
23. Viewer cannot edit inline, bulk assign or reorder.
24. Sprint summary and Sprint planning are not present in Backlog P2.1.

## 12. Test Scenarios

| ID | Scenario | Expected |
|---|---|---|
| P2-BL-TS-001 | Filter owner Marcus Webb | Only items assigned to Marcus Webb show |
| P2-BL-TS-002 | Filter release Q4 2024 | Only Q4 2024 items show |
| P2-BL-TS-003 | Edit Defect priority Urgent -> High | Defect priority persists as High |
| P2-BL-TS-004 | Sort Est descending | Largest Plan Estimate appears first |
| P2-BL-TS-005 | Sort Name ascending | Names appear A-Z |
| P2-BL-TS-006 | Try edit Story priority | UI unavailable or API rejects |
| P2-BL-TS-007 | Switch workspace selector from Core Platform team to Identity & Access team | Backlog reloads and shows only Story/Defect records for Identity & Access |
| P2-BL-TS-008 | Create Work Item after selecting Core Platform team | Project and Team fields default to Nexus Platform 2025 / Core Platform |
| P2-BL-TS-009 | Workspace Admin changes Team in create form to a team outside selected Project | Validation rejects invalid Project/Team pair |
| P2-BL-TS-010 | Bulk assign selected to Q1 2025 | All selected valid items move to release |
| P2-BL-TS-011 | Move item down then refresh | Order remains changed |
| P2-BL-TS-012 | Viewer opens Backlog | Controls are read-only |
| P2-BL-TS-013 | Invalid release from another project | API returns validation error |
| P2-BL-TS-014 | Select Name and Owner in Manage Filters, apply both values | Result matches both filter conditions |
| P2-BL-TS-015 | Search work by `US-4821` while filters are open | Quick search still works independently from Manage Filters |
| P2-BL-TS-016 | Sort Rank ascending/descending | Rank order changes correctly |
| P2-BL-TS-017 | Change Iteration from Unscheduled to Sprint 24.3 | Item appears in Sprint 24.3 Iteration Status |
| P2-BL-TS-018 | Change Iteration from Sprint 24.3 to Sprint 24.4 | Item leaves Sprint 24.3 Iteration Status and appears in Sprint 24.4 |
| P2-BL-TS-019 | Try assign item to iteration from another team | API returns validation error |

## 13. Implementation Breakdown

```text
P2-BL-T01 Extend list query contract + generated client types
P2-BL-T02 Add backend filters Owner/Release/Iteration
P2-BL-T03 Add inline update support and validation
P2-BL-T04 Add bulk release assignment endpoint
P2-BL-T05 Add bulk iteration assignment endpoint
P2-BL-T06 Add rank/reorder endpoint using LexoRank
P2-BL-T07 Integrate FE filters
P2-BL-T08 Integrate inline edit optimistic save/rollback
P2-BL-T09 Integrate bulk release/iteration + reorder controls
P2-BL-T10 Add unit, contract and e2e smoke tests
```

## 14. Definition of Done

- API/OpenAPI updated and frontend generated client stays valid.
- All Acceptance Criteria pass.
- Permission and tenant/project isolation are tested.
- P2.1 mockup behavior has production equivalent or documented deviation.
- No Sprint summary/planning, Iteration Status metrics or Board scope is accidentally added.
