# Mini Rally — Project Development Plan

## Phase 0 — Nền tảng

Mockup coverage và danh sách màn hình còn thiếu được theo dõi tại [`Phase 0/PHASE0_MOCKUP_CHECKLIST.md`](Phase%200/PHASE0_MOCKUP_CHECKLIST.md).

Tiến độ production development, estimate/actual và timebox 1.5 ngày được theo dõi tại [`Phase 0/PHASE0_DEVELOPMENT_TRACKING.md`](Phase%200/PHASE0_DEVELOPMENT_TRACKING.md).

### 1. App Shell

- URL routing thật.
- Navigation và breadcrumb.
- Context hierarchy `Company/Workspace → Project → Team`.
- Main navigation `Home → Plan → Iteration Status → Quality → Portfolio → Releases → Reports`.
- `Backlog` là màn con mặc định của `Plan`.
- Permission-based menu.
- Global loading/error boundary.
- 404 và Access Denied.
- Notification badge đồng bộ.

### 2. Authentication

- Login/logout; mockup đầu tiên dùng tài khoản Workspace Admin.
- Session và refresh token.
- Forgot/reset password.
- Profile và đổi mật khẩu.
- Activate/deactivate account.

### 3. Workspace

- Deployment hiện tại là single-company: `ACME Space Inc.` được cấu hình cố định như Workspace/tenant root.
- Không build Workspace List/Create/Edit/Archive UI trong MVP.
- Invite/remove/deactivate member.
- Workspace role.
- Company settings tối thiểu; cấu hình tenant nâng cao thực hiện ngoài UI nếu cần.

### 4. Project

- Project List mockup đã có.
- Create/Edit/Archive/Restore Project.
- Project selector.
- Project key, ví dụ `NXP`.
- Project member và role.
- Project settings.
- Workflow mặc định.
- Team CRUD và Team membership.
- Gắn một Team vào nhiều Project thông qua `project_teams`.
- Team selector trong hierarchy dropdown.

## Phase 1 — Core Work Management

### 5. Work Item CRUD

Áp dụng cho Feature, Story, Task và Defect:

- Create/read/update/archive.
- Assign owner.
- Priority và status.
- Story point.
- Sprint và Release.
- Parent/child relationship.
- Labels.
- Search/filter/pagination.
- Bulk update.
- Activity log.

### 6. Work Item Detail

- Basic information.
- Description.
- Acceptance Criteria.
- Metadata.
- Related Work Items.
- Comments và mentions.
- Attachments.
- Watchers.
- Activity history.
- Field-level permission.

### 7. Child Task Management

```text
User Story
└── Tasks
```

- Add/Edit/Delete Task.
- Assign Task.
- Task status.
- Task list trong US Detail.
- Roll-up task progress lên US.

### 8. Task Time Tracking

- Original Estimate.
- Remaining Estimate.
- Log Time.
- Actual Time từ time logs.
- Estimate/Remaining/Actual roll-up lên US.
- Time-log history và permission.

## Phase 2 — Agile Execution

### 9. Backlog

Backlog là danh sách tập trung toàn bộ User Story (`US`) và Defect (`DE`) của Project/Team context:

- Rank và ưu tiên Work Item.
- Quick search `Search work...`.
- Manage Filters cho user chọn nhiều column để combine filter.
- Filter ID/Name/Est dạng search-style input; field còn lại dạng dropdown.
- Header sort icon cho các cột, bao gồm Rank.
- Resizable columns.
- Pagination 10/25/50/100 records per page.
- Header/list typography đồng đều 11px.
- Inline edit.
- Backlog reorder.
- Release assignment.
- Create Work Item với thứ tự type `Feature → Story → Defect → Task`.

Không hiển thị Unplanned, Sprint summary, Sprint filter, Sprint assignment hoặc cột Updated trong Backlog. Sprint management thuộc capability riêng; navigation dùng `Plan → Backlog`.

### 10. Sprint Management

- Create/Edit Sprint.
- Sprint goal và date range.
- Capacity.
- Planned points.
- Start Sprint.
- Close/Cancel Sprint.
- Khóa Sprint đã đóng.
- Chuyển item chưa hoàn thành.
- Sprint history.

### 11. Iteration Status

Thay cho `Track`:

- Sprint selector.
- Progress summary.
- Accepted/remaining points.
- Days remaining.
- Work Item list.
- Task Estimate/Remaining/Actual.
- Blocked items.
- List/Board toggle.
- Quick create.
- Bulk actions.

### 12. Board

Baseline update 2026-06-28: Board execution, Team Board and Team Status move to Phase 3. Do not implement this under Phase 2.

- Status columns.
- Drag/drop đổi status.
- Workflow transition validation.
- WIP limit.
- Filter theo owner/type/priority.
- Blocked indicator.
- Open Work Item Detail.
- Viewer read-only.

## Phase 3 — Quality và Delivery

### 13. Quality / Defect

- Create Defect.
- Severity và Priority.
- Environment.
- Steps to Reproduce.
- Expected/Actual Result.
- Root Cause và Resolution.
- Link Defect với Story.
- Assign Dev.
- Verify/Reopen.
- Defect history.
- Quality summary.

### 14. Release Management

- Release CRUD.
- Assign Work Item.
- Included items.
- Open Defects.
- Blocked items.
- Release progress.
- Release readiness.
- Release activity/history.
- Released/Cancelled/Archived states.

### 14A. Team Board / Team Status

Baseline update 2026-06-28:

- Team Board.
- Team Status.
- Board drag/drop execution.
- WIP limits and transition validation.

## Phase 4 — Collaboration và Governance

### 15. Notifications

- Assigned, mentioned, comment và status events.
- Sprint/Release/Due Date notifications.
- Read/unread persistence.
- Deep-link tới Work Item.
- Notification preferences.
- Email notification sau MVP.

### 16. Roles & Permissions

- Workspace-level role.
- Project-level role.
- Permission codes.
- Backend enforcement.
- Field/action-level UI gating.
- Access Denied handling.

### 17. Settings & Audit

- Project settings.
- Workflow statuses/transitions.
- Labels.
- User management.
- Role permission matrix.
- Workspace settings.
- Audit log.
- Confirmation cho destructive actions.

## Phase 5 — Reporting

### 18. Dashboard & Reports

- Sprint Burndown.
- Velocity.
- Work Items by Status.
- Defect Summary.
- Workload.
- Blocked Items.
- Release Progress.
- Planned vs Completed.
- Estimate vs Actual.
- Export report.
- Date/project/sprint filters.

## Làm sau MVP

### 19. Portfolio

- Initiative.
- Feature/Epic hierarchy.
- Progress roll-up.
- Roadmap.
- Target Release.
- Cross-project tracking.

Portfolio có thể chưa xuất hiện trong MVP nếu chỉ phục vụ một team/project nhỏ.

## Thứ tự build khuyến nghị

```text
App Shell
→ Auth
→ Workspace
→ Project
→ Team + Project–Team mapping
→ Work Item CRUD
→ Work Item Detail
→ Child Task
→ Time Tracking
→ Backlog + Sprint
→ Iteration Status
→ Board
→ Quality
→ Release
→ Notification
→ RBAC/Settings
→ Reports
→ Portfolio
```

## Vertical slice đầu tiên

```text
Login bằng Workspace Admin
→ Chọn Company/Workspace → Project → Team
→ Tạo User Story
→ Mở Detail
→ Thêm Task
→ Estimate Task
→ Log Actual Time
→ Gán US vào Sprint
→ Xem tại Iteration Status
```
# Current Baseline Update — 2026-06-28

Phase 0 đã pass BA acceptance. Phase đang chuẩn bị dev tiếp theo là **Phase 1 — Core Work Item Management**.

Các quyết định mới nhất của Phase 1 override những mô tả cũ bên dưới nếu có mâu thuẫn:

- Backlog thuộc `Plan → Backlog`.
- Backlog Phase 1 chỉ tập trung **Story** và **Defect**; không tạo/hiển thị Feature hoặc Task như backlog item độc lập.
- Task chỉ được tạo như **child task** bên trong Work Item Detail.
- Click Work Item ID từ Backlog mở **full Work Item Detail page** mặc định.
- Work Item Detail có tabs: `Details`, `Tasks`, `Revision History`.
- Task Detail có banner riêng và chỉ có tabs: `Details`, `Revision History`.
- Work Item content Phase 1 gồm: Description, Attachments, Notes, Release Notes.
- Task content Phase 1 gồm: Description, Notes, Attachments.
- Time fields Phase 1 gồm: Work Item `Plan Estimate`; Task `Estimate`, `To Do`, `Actual`.
- Basic Activity Log được thể hiện bằng tab `Revision History`.
- Manage thuộc workspace menu `Manage`, gồm tabs `Projects`, `Teams`, `Users`.
- Create Team thuộc Phase 1 để Backlog/Work Item/Iteration flows có Team context hợp lệ.
- Team list Phase 1 không có Actions/Members/Capacity/Velocity; click row mở Edit Team modal.
- Team status dùng `Active` và `Deactive`; không dùng `Archived` cho Team management.
- Team modal có 2 tab: `Team Info` và `Members`; Members có search/filter.
- User management thuộc Phase 1: Invite/Edit User, assign User vào Team; không assign Project trực tiếp cho User.
- User project access được derive từ Team -> Project.
- Invite email join flow là nghiệp vụ mục tiêu; implementation đầu có thể add/invite user qua DB/API trước.

Tài liệu Phase 1 chi tiết nằm tại:

- [`Phase 1/PHASE1_MOCKUP_CHECKLIST.md`](Phase%201/PHASE1_MOCKUP_CHECKLIST.md)
- [`Phase 1/PHASE1_DEVELOPMENT_TRACKING.md`](Phase%201/PHASE1_DEVELOPMENT_TRACKING.md)
- [`Phase 1/01_Backlog_Work_Item_List/SRS.md`](Phase%201/01_Backlog_Work_Item_List/SRS.md)
- [`Phase 1/02_Work_Item_Create/SRS.md`](Phase%201/02_Work_Item_Create/SRS.md)
- [`Phase 1/03_Work_Item_Detail/SRS.md`](Phase%201/03_Work_Item_Detail/SRS.md)
- [`Phase 1/04_Task_Management/SRS.md`](Phase%201/04_Task_Management/SRS.md)
- [`Phase 1/05_Time_Tracking/SRS.md`](Phase%201/05_Time_Tracking/SRS.md)
- [`Phase 1/06_Content_Attachments/SRS.md`](Phase%201/06_Content_Attachments/SRS.md)
- [`Phase 1/07_Activity_Log/SRS.md`](Phase%201/07_Activity_Log/SRS.md)
- [`Phase 1/08_Manage_Projects_Teams_Users/SRS.md`](Phase%201/08_Manage_Projects_Teams_Users/SRS.md)

## Phase 1 open confirmations

| ID | Nội dung đã được resolve | Trạng thái |
|---|---|---|
| P1-CF-001 | Backlog production giữ hay bỏ các cột `Priority`, `Status`, `Release` | SUPERSEDED BY P1-DC-001/002 |
| P1-CF-002 | Timebox Phase 1 chính thức | SUPERSEDED BY P1-DC-004 |
| P1-CF-003 | `Notes` là rich-text field riêng hay comment thread | SUPERSEDED BY P1-DC-005 |
| P1-CF-004 | `Actual` nhập tay trong Phase 1 hay aggregate từ time logs | SUPERSEDED BY P1-DC-006 |
## Phase 1 Final BA Decisions — 2026-06-24

Các quyết định này là baseline cuối cho Phase 1 và override các ghi chú cũ nếu có mâu thuẫn:

| ID | Quyết định | Trạng thái |
|---|---|---|
| P1-DC-001 | Backlog giữ `Priority`, nhưng chỉ dành cho Defect; Story hiển thị `—` | DECIDED |
| P1-DC-002 | Backlog đổi cột `Status` thành `Schedule State` | DECIDED |
| P1-DC-003 | Work Item Detail sidebar có `Schedule State` và `Flow State`; `Status` đổi thành `Flow State` | DECIDED |
| P1-DC-004 | Timebox Phase 1 = 2 working days = 16 hours | DECIDED |
| P1-DC-005 | `Notes` là text/rich-text field riêng | DECIDED |
| P1-DC-006 | `Actual` nhập tay vào `actual_hours` trong Phase 1 | DECIDED |
| P1-DC-007 | Defect Detail sidebar hiển thị `Priority`; options `Low/Normal/High/Urgent/None` | DECIDED |
| P1-DC-008 | Manage là entry point cho Projects/Teams/Users | DECIDED |
| P1-DC-009 | Team list không hiển thị Members/Capacity/Velocity/Actions | DECIDED |
| P1-DC-010 | Create/Edit Team vẫn có chọn Members | DECIDED |
| P1-DC-011 | Team Capacity/Velocity không thuộc Manage Team Phase 1 | DECIDED |
| P1-DC-012 | User chỉ assign vào Team, không assign Project trực tiếp | DECIDED |
| P1-DC-013 | Invite email join flow là nghiệp vụ mục tiêu; trước mắt có thể add/invite qua DB/API | DECIDED |
| P1-DC-014 | User status dùng `Active`, `Invited`, `Deactive` | DECIDED |
| P1-DC-015 | Team status dùng `Active`, `Deactive`; không dùng `Archived` | DECIDED |
| P1-DC-016 | Team list không có Actions; click row mở modal edit | DECIDED |
| P1-DC-017 | Team modal có `Team Info` và `Members`; Members có search/filter | DECIDED |
| P2-CONTEXT-DC-001 | Workspace selector Project/Team là global context cho Phase 2 Backlog, Timeboxes/Iterations và Iteration Status | DECIDED |
| P2-CONTEXT-DC-002 | Create Work Item và Create Iteration auto-fill Project/Team theo workspace selector context | DECIDED |
| P2-CONTEXT-DC-003 | Workspace Admin được đổi Project/Team trong form nếu enabled, nhưng Team phải thuộc Project và Iteration assignment phải cùng Project/Team | DECIDED |

## Phase 2 Current Baseline — 2026-06-25

Phase 2 là **Agile Execution**. Đợt tài liệu hiện tại chỉ chốt phần đầu tiên:

**P2.1 — Backlog Enhancement**

Scope P2.1:

- Backlog vẫn chỉ hiển thị **Story** và **Defect**.
- Giữ quick search `Search work...` ở toolbar.
- Dùng Manage Filters cho user chọn nhiều column để combine filter.
- Filter ID/Name/Est dạng search-style input; Type/Priority/Owner/Schedule State/Release dạng dropdown.
- Sort icon trên header cho Rank, Type, ID, Name, Priority, Est, Owner, Schedule State và Release.
- Header/list typography đồng đều 11px.
- Cho inline edit Title, Defect Priority, Plan Estimate, Owner, Schedule State và Release.
- Cho bulk assign Release.
- Backlog được lọc theo Project/Team đang chọn từ workspace selector.
- Khi tạo Work Item, Project và Team auto-fill theo workspace selector context.
- Cho reorder Backlog bằng `rank`/LexoRank ở production; mockup dùng move controls.
- Không đưa Sprint assignment, Sprint summary hoặc Sprint planning vào Backlog.
- KPI/metric summary strip giữ lại làm pattern cho Iteration Status, Dashboard hoặc Reports; không hiển thị trong Backlog.
- Current mock account là Workspace Admin, nên admin có thể đổi Project/Team trong form nếu enabled; production vẫn phải validate Team thuộc Project.

Tài liệu Phase 2 chi tiết nằm tại:

- [`Phase 2/PHASE2_MOCKUP_CHECKLIST.md`](Phase%202/PHASE2_MOCKUP_CHECKLIST.md)
- [`Phase 2/PHASE2_DEVELOPMENT_TRACKING.md`](Phase%202/PHASE2_DEVELOPMENT_TRACKING.md)
- [`Phase 2/01_Backlog_Enhancement/SRS.md`](Phase%202/01_Backlog_Enhancement/SRS.md)

Các phần Phase 2 còn lại cần SRS riêng trước khi dev:

- P2.2 Timeboxes / Iterations, including assignment of existing Backlog Story/Defect items into an Iteration.
- P2.3 Iteration Status linked with Backlog.
- Team Board, Team Status and Board drag/drop execution move to Phase 3.

## Phase 2.2 Current Baseline - 2026-06-26

Phase 2.2 is **Iteration Management** under `Plan > Timeboxes`.

BA decisions:

- Navigation label is `Timeboxes`.
- Production scope for Phase 2.2 is only `Iterations`.
- `Releases` and `Milestones` are not part of Phase 2.2.
- `Milestones` moves to Phase 3 together with Release/Delivery scope.
- Release CRUD/readiness/detail remains Phase 3 Release Management.
- Iteration detail uses the same full-page detail pattern as Backlog Work Item Detail.
- Iteration content fields are `Theme` and `Notes`.
- The list column `Theme` maps to the detail field `Theme`; do not label it `Description`.
- Project and Team belong in the detail right panel, not duplicated in the top context bar or under the Details title.
- Workspace selector Project/Team context filters Timeboxes/Iterations.
- Create Iteration auto-fills Project/Team from workspace selector context.
- Existing Backlog Story/Defect assignment into Iteration is required in P2.2 so P2.3 Iteration Status has a real Backlog source.

Scope P2.2:

- `Plan > Timeboxes` page defaults to Iterations.
- Iterations list columns: Name, Theme, Start Date, End Date, Project, Planned Velocity, Task Estimate, State.
- Search, State filter, sort, pagination.
- Quick create modal with Type, Project, Team, Name, Start Date, End Date, State.
- Required fields: Name, Start Date, End Date, State.
- `Create with details` opens full-page Iteration detail.
- Clicking an existing Iteration row opens full-page Iteration detail.
- Detail right panel: Project, Team, Start Date, End Date, State, Planned Velocity.
- Iterations list shows only Iterations for the selected Project/Team context.
- Assign/unassign existing Backlog Story/Defect items to/from an Iteration from Timeboxes/Iteration detail.
- Validate that assigned work items match the Iteration Project and Team.

P2.2 explicitly excludes:

- Release Management.
- Milestones.
- Start/Close iteration workflow and carry-over.
- Iteration Status metrics.
- Team Board, Team Status and Board drag/drop execution.

Detailed documents:

- [`Phase 2/02_Iterations/SRS.md`](Phase%202/02_Iterations/SRS.md)
- [`Phase 2/PHASE2_MOCKUP_CHECKLIST.md`](Phase%202/PHASE2_MOCKUP_CHECKLIST.md)
- [`Phase 2/PHASE2_DEVELOPMENT_TRACKING.md`](Phase%202/PHASE2_DEVELOPMENT_TRACKING.md)

## Phase 2.3 Current Baseline - 2026-06-28

Phase 2.3 is **Iteration Status** under `Track`.

BA decisions:

- Phase 2 implements only `Iteration Status` under Track.
- `Team Board` and `Team Status` are moved to Phase 3.
- Iteration selector reads Iteration records created in `Plan > Timeboxes`.
- Iteration selector is filtered by the current workspace selector Project/Team context.
- Iteration Status list reads Backlog/work_items assigned to the selected Iteration.
- Add Item creates a new Story/Defect directly into the selected Iteration and that item also belongs to Backlog.
- Add Item auto-fills Project/Team from workspace selector context and selected Iteration.
- Existing backlog item assignment is handled from Timeboxes/Iteration detail, not from the Iteration Status Add Item modal.
- Schedule State options are `Idea`, `Defined`, `In-Progress`, `Completed`, `Accepted`, `Release`.
- Defects metric counts work items where type = Defect in the selected Iteration.

Detailed documents:

- [`Phase 2/03_Iteration_Status/SRS.md`](Phase%202/03_Iteration_Status/SRS.md)
- [`Phase 2/PHASE2_MOCKUP_CHECKLIST.md`](Phase%202/PHASE2_MOCKUP_CHECKLIST.md)
- [`Phase 2/PHASE2_DEVELOPMENT_TRACKING.md`](Phase%202/PHASE2_DEVELOPMENT_TRACKING.md)

## Phase 3 Scope Update - 2026-06-28

Phase 3 now includes these Track follow-ups:

- Team Board.
- Team Status.
- Board drag/drop execution.

Placeholder document:

- [`Phase 3/01_Team_Board_Team_Status/SRS.md`](Phase%203/01_Team_Board_Team_Status/SRS.md)
