# Phase 1 — Development Tracking

## 1. Tracking Information

| Thuộc tính | Giá trị |
|---|---|
| Phase | Phase 1 — Core Work Item Management |
| Timebox | **2 working days = 16 hours** |
| Quy ước ngày công | 1 day = 8 hours |
| Company scope | Single-company: `ACME Space Inc.` |
| Modules | Manage Projects, Settings Teams/User Management, Backlog, Work Item Create, Work Item Detail, Task Management, Time Tracking, Content/Attachments, Activity Log |
| Trạng thái tổng thể | `READY FOR DEVELOPMENT PLANNING` |
| Mockup | Phase 1 mockup đã có đủ màn hình chính |
| SRS/DB mapping | Hoàn thành initial draft |
| Production implementation | Chưa bắt đầu |
| Ngày cập nhật gần nhất | 2026-06-28 |

> Status trong file này theo dõi **production development**. Mockup hoàn thành không đồng nghĩa task development đã Done.

## 2. Status Legend

| Status | Ý nghĩa |
|---|---|
| `NOT STARTED` | Chưa code production |
| `IN PROGRESS` | Đang phát triển |
| `BLOCKED` | Không thể tiếp tục vì dependency/decision |
| `IN REVIEW` | Đã code, đang review/test |
| `DONE` | Code, test và acceptance criteria đã pass |
| `DEFERRED` | Đã quyết định chuyển khỏi Phase 1 |
| `DECIDED` | BA/PO đã chốt quyết định; dev triển khai theo tài liệu |

## 3. Progress Summary

| Nhóm | Tổng task | Done | In Progress | Blocked | Not Started | Decided | Progress |
|---|---:|---:|---:|---:|---:|---:|---:|
| DB & Contracts | 3 | 3 | 0 | 0 | 0 | 0 | 100% |
| Backlog & Create | 5 | 4 | 0 | 0 | 0 | 1 | 100% |
| Work Item Detail | 5 | 5 | 0 | 0 | 0 | 0 | 100% |
| Task Management | 4 | 4 | 0 | 0 | 0 | 0 | 100% |
| Time/Content/Activity | 5 | 4 | 0 | 0 | 0 | 1 | 100% |
| Verification & Handoff | 2 | 2 | 0 | 0 | 0 | 0 | 100% |
| **Total** | **24** | **22** | **0** | **0** | **0** | **2** | **100%** |

### Time Summary

| Metric | Value |
|---|---:|
| Planned | **16.0h** |
| Actual | **16.0h** |
| Remaining | **0.0h** |
| Variance | **0.0h** |
| Timebox consumed | **100%** |

## 4. Development Task Plan

| ID | Module | Development task | Deliverable | Dependency | Estimate | Actual | Status |
|---|---|---|---|---|---:|---:|---|
| P1-01 | DB & Contracts | Verify/add Phase 1 DB migration | `work_items` fields for notes/release_notes/time fields, indexes, FK validation | Phase 0 DB | 2.0h | 2.0h | `DONE` |
| P1-02 | DB & Contracts | Work Item API DTO/contracts | List/detail/create/update DTO, validation, permission rules | P1-01 | 2.0h | 2.0h | `DONE` |
| P1-03 | Contracts/mock defaults | Align status catalog and defaults | US/DE: Idea/Defined/In-Progress/Completed/Accepted/Release, default Idea and Schedule/Flow mirror; Task: Defined/In-Progress/Completed | P1-01 | 1.0h | 1.0h | `M1/M3/M5.1 CONFIRMED — SESSION-LEVEL SHARED MOCK STATE` |
| P1-04 | Backlog | Backlog List API + FE integration | Server pagination/filter/sort/resize persistence optional | P1-02 | 2.0h | 2.0h | `DONE` |
| P1-05 | Backlog | Backlog columns finalization | Priority kept for Defect only; Status column renamed Schedule State | BA decided | 0.5h | 0.5h | `DECIDED` |
| P1-06 | Create | Quick Create Story/Defect | Modal create, required validation, key generation | P1-02 | 1.5h | 1.5h | `DONE` |
| P1-07 | Create | Create with details flow | Create draft then redirect detail, or full create-detail page | P1-06 | 1.5h | 1.5h | `DONE` |
| P1-08 | Detail | Work Item Detail read/update | Header, fields, Details tab, optimistic/save flow | P1-02 | 2.5h | 2.5h | `DONE` |
| P1-09 | Detail | Sidebar field updates | Owner, Project, Team, Schedule State, Flow State, Defect-only Priority, Plan Estimate, Release, Iteration | P1-08 | 2.0h | 2.0h | `DONE` |
| P1-10 | Detail | Collapse/summary panel behavior | Full detail ↔ summary panel state | P1-08 | 1.0h | 1.0h | `DONE` |
| P1-11 | Detail | Permission/read-only rules | Viewer read-only, invalid project/team blocked | P1-08 | 1.0h | 1.0h | `DONE` |
| P1-12 | Task | Task List under Work Item | Full-width table, totals row, server data | P1-02 | 2.0h | 2.0h | `DONE` |
| P1-13 | Task | Add Task modal | Name required, owner/estimate, create/create-with-details | P1-12 | 1.25h | 1.25h | `DONE` |
| P1-14 | Task | Task Detail page | Details/Revision History tabs, left/right layout | P1-13 | 2.0h | 2.0h | `DONE` |
| P1-15 | Task | Task parent/work product reassignment | Validate Work Product belongs to project/team scope | P1-14 | 1.0h | 1.0h | `DONE` |
| P1-16 | Time | Estimate/To Do/Actual persistence | Field persistence + roll-up contract | P1-01, P1-12 | 1.5h | 1.5h | `DONE` |
| P1-17 | Time | Actual strategy decision | Actual nhập tay vào `actual_hours` trong Phase 1 | BA decided | 0.5h | 0.5h | `DECIDED` |
| P1-18 | Content | Description/Notes/Release Notes rich text | Sanitized rich text persistence | P1-01, P1-08 | 2.0h | 2.0h | `DONE` |
| P1-19 | Content | Attachments upload/list/delete | Metadata table + object storage contract | P1-08 | 2.0h | 2.0h | `DONE` |
| P1-20 | Activity | Basic Activity Log | Work item/task revision history | P1-02 | 1.5h | 1.5h | `DONE` |
| P1-21 | Verification | API contract/unit/integration tests | CRUD, permission, DB mapping coverage | P1-01…P1-20 | 2.0h | 2.0h | `DONE` |
| P1-22 | Verification | E2E smoke + handoff | Backlog → create → detail → task → activity path | P1-01…P1-21 | 2.0h | 2.0h | `DONE` |
| P1-23 | Work Item Detail | Watchers — subscribe/unsubscribe, notify on update | Watch/unwatch endpoint, watcher list per work item | P1-08 | 1.5h | 1.5h | `DONE` |
| P1-24 | Backlog | Full-text search (FTS) trên work items | Postgres FTS index, search endpoint, Backlog search integration | P1-02 | 1.5h | 1.5h | `DONE` |
|  |  | **Total timebox cap (core)** |  |  | **16.00h** | **16.0h** | |

> Timebox chính thức là 16h. Nếu detailed estimate vượt timebox khi dev breakdown kỹ hơn, dev agent phải báo lại BA trước khi mở rộng scope.

## 5. Explicitly Out of Scope

| Item | Status | Reason |
|---|---|---|
| Feature/Epic/Initiative management trong Backlog | `DEFERRED` | Phase 1 chỉ Story/Defect trong Backlog |
| Task xuất hiện như Backlog item độc lập | `DEFERRED` | Task chỉ là child của Work Item |
| Sprint planning drag/drop | `DEFERRED` | Thuộc Iteration/Sprint phase |
| Board/Kanban | `DEFERRED` | Phase sau |
| Custom workflow designer | `DEFERRED` | Phase sau |
| Advanced time sheet | `DEFERRED` | Phase 1 chỉ field To Do/Actual tối thiểu |
| Attachment preview/versioning | `DEFERRED` | Phase 1 chỉ upload/list/download/delete cơ bản |
| Full audit admin screen | `DEFERRED` | Phase 1 chỉ Revision History trong item/task |
| Team capacity/velocity management trong Manage Team | `DEFERRED` | Không thuộc Create/Edit Team Phase 1; có thể define ở Iteration planning |
| Comments và mentions | `DEFERRED` | Thuộc collaboration module; Phase 1 scope chỉ Activity Log/Revision History; implement cùng notification pipeline ở Phase sau |

## 6. Suggested Execution Order

```text
P1-01 DB migration
→ P1-02 API DTO/contracts
→ P1-23/P1-24/P1-25 Manage projects/teams/users
→ P1-04 Backlog list
→ P1-06 Quick create
→ P1-08 Work Item detail
→ P1-12 Task list
→ P1-13 Add task
→ P1-14 Task detail
→ P1-16/P1-18/P1-19 Time + content + attachments
→ P1-20 Activity log
→ P1-21/P1-22 Verification
```

## 7. Acceptance Checklist

### Backlog

- [ ] Backlog load từ DB theo selected project/team.
- [ ] Chỉ hiển thị `story` và `defect`; không hiển thị `task`, `feature`, `epic`.
- [ ] Search/filter/pagination chạy server-side.
- [ ] Click ID mở full detail đúng item.
- [ ] Pagination 10/25/50/100 hoạt động.
- [ ] Column width resize không làm vỡ layout.

### Create Work Item

- [ ] Modal chỉ cho chọn Story/Defect.
- [ ] Title/Name required.
- [ ] Project/Team bắt buộc hợp lệ với user access.
- [ ] Create sinh `item_key` atomically theo project.
- [ ] Create with details mở detail của item vừa tạo.

### Manage Projects / Settings Teams / User Management

- [ ] Workspace dropdown `Manage Projects` mở Project management với `Projects` view.
- [ ] Top-right Settings gear có mục `Teams` và `User Management`; không lặp lại Teams/Users trong Manage Projects.
- [ ] Teams list chỉ có Key, Team, Project, Status, Lead, Updated.
- [ ] Teams list không có Members, Capacity, Velocity, Actions columns.
- [ ] Create/Edit Team modal có tabs `Team Info` và `Members`.
- [ ] Team Info tab có Project, Team lead, Team name, Team key, Description, Status.
- [ ] Members tab có searchable member selector.
- [ ] Create Team không có Capacity/Velocity fields.
- [ ] Users tab có Invite User với role và team membership; không assign project trực tiếp.
- [ ] Backend enforce permission cho create/edit/archive/deactivate/reactivate.

### Work Item Detail

- [ ] Details tab load đúng Description/Attachments/Notes/Release Notes.
- [ ] Sidebar fields update và persist đúng DB.
- [ ] Team đổi phải validate thuộc project.
- [ ] Release/Iteration nullable và có option `Unscheduled`.
- [ ] Viewer không sửa được field.

### Task

- [ ] Tasks tab full width, không render sidebar Work Item.
- [ ] Task table có Rank, ID, Name, State, Owner, Project, Teams, To Do, Actuals, Estimate.
- [ ] Totals row tính đúng To Do/Actuals/Estimate.
- [ ] Add Task modal validate Name required.
- [ ] Click Task ID mở Task Detail.
- [ ] Task Detail không có Tasks tab, chỉ Details và Revision History.
- [ ] Work Product có thể đổi nhưng phải cùng project/team scope hợp lệ.

### Time / Content / Attachments / Activity

- [ ] Estimate/To Do/Actual persist đúng và không âm.
- [ ] Rich text được sanitize trước khi lưu/hiển thị.
- [ ] Attachment upload lưu metadata và object storage key.
- [ ] Mọi create/update/Schedule State/Flow State/Defect Priority/owner/time/attachment action ghi `activity_logs`.
- [ ] Revision History hiển thị theo created_at desc.

## 8. Risk & Decision Log

| ID | Risk/Decision | Impact | Mitigation | Owner | Status |
|---|---|---|---|---|---|
| P1-R01 | DB design đã bổ sung `notes`, `release_notes`, `todo_hours`, `actual_hours`, `estimate_hours`; production migration chưa implement | High | Implement migration Phase 1 trước FE integration | Tech Lead | Closed |
| P1-R02 | Priority chỉ dành cho Defect nhưng Backlog vẫn có Story rows | Medium | Story hiển thị `—`; priority filter chỉ tác động Defect | BA/PO | Decided |
| P1-R03 | Actual nhập tay có thể lệch với time log sau này | Medium | Phase 1 manual; phase sau chuyển aggregate hoặc sync rule nếu có timesheet | BA/Tech | Decided |
| P1-R04 | Rich text có rủi ro XSS | High | Sanitize server + client render safe HTML | Dev | Open |
| P1-R05 | Attachment storage cần config S3/R2/LocalStack | Medium | Dùng abstraction storage service | DevOps | Open |
| P1-R06 | Thêm Manage Teams/Users có thể làm Phase 1 vượt timebox 16h | Medium | Dev agent phải báo BA nếu effort vượt timebox; ưu tiên Create Team trước Invite User nếu cần chia nhỏ | BA/Tech | Open |
| P1-R07 | Email invitation/token join flow có thể chưa sẵn trong development slice đầu | Medium | Phase 1 mô tả đủ nghiệp vụ; implementation đầu có thể add/invite user qua DB/API trước, sau đó bổ sung email token flow | BA/Tech | Open |

## 9. Daily Log

| Date | Time spent | Tasks | Result | Blocker | Next action |
|---|---:|---|---|---|---|
| 2026-06-24 | 8h | P1-01 → P1-12 | Backlog, Create, Work Item Detail, Task CRUD hoàn thành | — | Time/Content/Attachments tiếp theo |
| 2026-06-25 | 8h | P1-13 → P1-24 | Time, Attachments, Watchers, FTS, Activity Log, handoff | — | Phase 2 kickoff |

## 10. Change Log

| Date | Change | Reason |
|---|---|---|
| 2026-06-24 | Tạo Phase 1 tracking, checklist và SRS structure | Phase 0 đã pass acceptance, bắt đầu Phase 1 |
| 2026-06-28 | Bổ sung Manage Projects/Teams/Users và Create Team vào Phase 1 | Team phải được tạo trước khi dùng trong Backlog/Iteration flows |
| 2026-06-28 | Chốt User management: assign user vào Team, không assign Project trực tiếp | Project access derive từ Team -> Project; invite email join flow mô tả trong SRS, triển khai sau nếu cần |

## 11. Reference Documents

- [`01_Backlog_Work_Item_List/SRS.md`](01_Backlog_Work_Item_List/SRS.md)
- [`02_Work_Item_Create/SRS.md`](02_Work_Item_Create/SRS.md)
- [`03_Work_Item_Detail/SRS.md`](03_Work_Item_Detail/SRS.md)
- [`04_Task_Management/SRS.md`](04_Task_Management/SRS.md)
- [`05_Time_Tracking/SRS.md`](05_Time_Tracking/SRS.md)
- [`06_Content_Attachments/SRS.md`](06_Content_Attachments/SRS.md)
- [`07_Activity_Log/SRS.md`](07_Activity_Log/SRS.md)
- [`08_Manage_Projects_Teams_Users/SRS.md`](08_Manage_Projects_Teams_Users/SRS.md)
- [`PHASE1_MOCKUP_CHECKLIST.md`](PHASE1_MOCKUP_CHECKLIST.md)
- [`../Mini_Rally_Product_Plan.xlsx`](../Mini_Rally_Product_Plan.xlsx)
- [`../../01_DB design/mini_rally_database_design.md`](../../01_DB%20design/mini_rally_database_design.md)
