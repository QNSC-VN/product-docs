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
- Activate/suspend account.

### 3. Workspace

- Deployment hiện tại là single-company: `ACME Space Inc.` được cấu hình cố định như Workspace/tenant root.
- Không build Workspace List/Create/Edit/Archive UI trong MVP.
- Invite/remove/suspend member.
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
- Search/filter.
- Resizable columns.
- Pagination 10/25/50/100 records per page.
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
# Current Baseline Update — 2026-06-24

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
