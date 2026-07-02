# Mini Rally — UI Runtime & Business Coverage Review

> Cập nhật 2026-06-20: `Plan` đã trở lại navigation như parent của `Backlog`; Backlog được đơn giản thành danh sách US/DE và không còn Sprint planning. Đã bổ sung Login Workspace Admin, hierarchy Company/Workspace → Project → Team, resizable columns, pagination và refactor frontend theo page/component. BUG-01 và BUG-02 vẫn ở trạng thái resolved.

## 1. Phạm vi review

- Ngày kiểm tra gần nhất: 2026-06-20
- Runtime: React 18 + Vite 6 tại `http://127.0.0.1:5173`
- Viewport mặc định: 1280 × 720
- Role kiểm tra chính: Workspace Admin; kiểm tra bổ sung với Viewer
- Nguồn đối chiếu: Prompt 1–4, project overview, database design và screen traceability
- Phương pháp: chạy UI thật, điều hướng, nhập filter/search, đổi view, chọn item, đổi role và kiểm tra console runtime

### Kết quả kỹ thuật tổng quan

| Hạng mục | Kết quả |
|---|---|
| Dev server | Pass |
| Production build | Pass |
| Runtime navigation cơ bản | Pass |
| Iteration Status List → Board | Pass sau retest |
| Backlog search/filter làm thay đổi số hàng | Pass sau retest |
| Bundle production | 755.58 kB JS sau Login/refactor; Vite cảnh báo chunk > 500 kB |
| Dependency audit | Chưa chạy lại trong lượt cập nhật 2026-06-20 |

## 2. Blocker phát hiện khi chạy thật

### BUG-01 — Track chuyển sang Board làm crash app

**Trạng thái: Resolved.** Đã bỏ hook khỏi vòng lặp render row; List → Board hoạt động và không còn console error.

- Severity: Blocker
- Bước tái hiện: Home → Track → Board.
- Actual: toàn bộ nội dung biến mất; console báo `Rendered fewer hooks than expected` trong `TrackPage`.
- Expected: render 6 board columns và giữ nguyên app shell.
- Tác động: SCR-05 Board hiện không sử dụng được.

### BUG-02 — Backlog search/filter có thể làm crash app

**Trạng thái: Resolved.** Search theo ID/title hoạt động sau khi bỏ hook khỏi vòng lặp render row.

- Severity: Blocker
- Bước tái hiện: Home → Backlog → nhập `US-4821` vào Search.
- Actual: toàn bộ app trắng; console báo `Rendered fewer hooks than expected` trong `BacklogPage`.
- Expected: lọc còn một dòng hoặc hiển thị empty state.
- Tác động: không thể sử dụng search/filter an toàn.

### BUG-03 — Viewer vẫn xem nội dung Admin tab đang mở

- Severity: High
- Bước tái hiện: mở Settings → Audit Log bằng Workspace Admin → đổi demo role thành Viewer.
- Actual: menu Settings bị disabled và icon Settings biến mất, nhưng nội dung Audit Log vẫn hiển thị.
- Expected: chuyển sang trang được phép hoặc hiển thị Access Denied.
- Tác động: UI authorization không bảo vệ nội dung khi quyền thay đổi trong phiên.

## 3. Review theo màn hình

| ID | Màn hình | Runtime | Business coverage | Kết luận |
|---|---|---:|---:|---|
| SCR-01 | Home | Pass | Partial | Đủ overview; thiếu drill-down/filter thật |
| SCR-01A | Project Management | Pass | Partial | List/Create/Edit/Archive/Restore local hoạt động; thiếu API/members/overview |
| SCR-00 | Login Admin | Pass | Partial | Đủ mock auth states; chưa có API/session thật |
| SCR-02 | Plan | Pass | Partial | Navigation parent; Backlog là child/default screen |
| SCR-03 | Iteration Status List | Pass | Partial | Đủ bảng execution; thiếu actual time và action thật |
| SCR-05 | Board | Pass | Partial | Render ổn; chưa có DnD status transition thật |
| SCR-04 | Backlog | Pass | Partial | US/DE list, search/filter, resize và pagination hoạt động |
| SCR-06 | Work Item Detail | Pass | Incomplete | Thiếu Task/time tracking trong US |
| SCR-07 | Quality | Pass | Partial | Đủ defect overview; CRUD/bulk chưa chạy |
| SCR-08 | Portfolio | Pass | Partial | Hierarchy hoạt động; dữ liệu child và filter chưa chuẩn |
| SCR-09 | Releases | Pass | Partial | Đủ release list/summary; thiếu release detail nghiệp vụ |
| SCR-10 | Reports | Pass | Partial | Đủ widget; toàn bộ dữ liệu/action còn static |
| SCR-11 | Notifications | Pass | Partial | Read/filter local hoạt động; thiếu deep-link và một số tab |
| SCR-12 | Settings | Pass | Partial | Tabs hoạt động; chưa persist và có BUG-03 |

### SCR-01 — Home

Đã có summary strip, My Work, Recent Activity và Project Health. Click các metric chính điều hướng đúng tới Portfolio, Backlog, Track và Quality.

Thiếu hoặc cần làm rõ:

- `Assigned to Me` không có drill-down.
- Workspace selector và global search không thay đổi dữ liệu.
- Active Sprint và activity vẫn là dữ liệu hard-code.
- Chưa có trạng thái loading, error, empty hoặc permission-specific dashboard.

### SCR-01A — Project Management

Đã có Project List với Active/Archived, summary metrics, search, owner, Team links và action column. Create/Edit validate Project Key, cho chọn owner và nhiều Team. Archive có confirmation; Restore hoạt động ở Archived tab.

Thiếu:

- API/persistence, audit và optimistic/error handling.
- Project Overview riêng.
- Project Members và role management.
- Archived read-only enforcement xuyên các module.
- Server-side pagination khi số Project lớn.

Workspace CRUD không xây dựng vì MVP phục vụ một Công ty cố định.

### SCR-02 — Plan

Plan hiện là navigation parent đứng sau Home; Backlog là child/default screen. Split-panel planning prototype cũ đã xóa. Sprint planning cần được đặc tả và mockup riêng trong Sprint Management thay vì quay lại Backlog.

### SCR-03 — Track / Iteration Status

List mode hiển thị đầy đủ Plan Estimate, Task Estimate, To Do, Owner và Defects. Selection toolbar và Quick Create xuất hiện đúng.

Thiếu hoặc chưa rõ:

- Các action Edit/Delete/Copy/Split/Add Child/Copy Tasks chưa chạy.
- Quick Create không tạo item.
- Không có Actual Time.
- `Task Estimate` và `To Do` chưa ghi rõ đơn vị.
- Planned Velocity hiển thị `34/103 pts` và `33%`, thực tế giống Accepted/Planned hơn là planned velocity; cần định nghĩa lại metric.
- Previous/next sprint và selector chưa đổi context.

### SCR-05 — Board

Retest thành công: chuyển List → Board render đủ 6 cột, 14 card draggable và không còn console error. Board vẫn chưa có drag/drop handler để thực sự đổi status; thuộc tính `draggable` một mình chưa hoàn thành nghiệp vụ Board.

### SCR-04 — Backlog

Retest thành công: search theo ID/title và filter không còn làm app crash. Backlog hiện chỉ hiển thị US/DE, có cột Type/ID/Name/Priority/Est/Owner/Status/Release, resize column và pagination 10/25/50/100.

Thiếu:

- Inline edit priority/owner/estimate/status.
- Drag reorder/rank.
- Bulk Move to Release, Assign, Link và Delete.
- Server-side pagination/virtualization cho dữ liệu production lớn.
- Empty state sau filter.

### SCR-06 — Work Item Detail

Đã có Description, Acceptance Criteria, conditional Defect Details, relations, comments, attachments, activity và metadata.

Gap nghiệp vụ lớn cho User Story:

- Không có section `Tasks` riêng.
- Không có Add Task hoặc task table.
- Không có Assignee/Status/Original Estimate/Remaining/Actual cho từng task.
- Không có roll-up Task Estimate, Remaining và Actual lên US.
- `Related Work Items` không thay thế task breakdown.
- Post comment, upload attachment và link existing chưa chạy.
- Role chỉ chia Viewer/non-Viewer, chưa có field-level permission.
- Viewer vẫn thấy một số action và có thể toggle Blocked trong UI.

Đề xuất task fields:

```text
original_estimate_minutes
remaining_estimate_minutes
actual_minutes = SUM(time_logs.time_spent_minutes)
```

Story Point vẫn giữ ở US; time estimate/actual nên nằm ở Task và được roll-up.

### SCR-07 — Quality

Đã có defect metrics, quick create row, defect table và bulk toolbar.

Thiếu:

- Create/Verify/Reopen/Assign/Link chưa thay đổi dữ liệu.
- Search/filter chưa thể hiện query semantics.
- Context bar thiếu Sprint, Release và Severity như prompt.
- Cần làm rõ khác biệt giữa Priority và Severity trong UI/validation.
- Chưa có verify result, resolved by, resolution date và reopen history.

### SCR-08 — Portfolio

Expand/collapse hierarchy hoạt động. Progress, release, related và blocked được hiển thị.

Thiếu hoặc sai:

- New Initiative mở generic work item modal nhưng modal không có Initiative type.
- Owner/release/status/timeframe filters chưa có.
- Related counts chưa drill-down.
- Một số Story mock được lặp dưới nhiều Feature; cần data relationship thật.
- Progress roll-up chưa có rule được mô tả rõ.

### SCR-09 — Releases

Release list, status, progress và expandable summary hoạt động.

Thiếu:

- Create Release chưa có form/action.
- Included Work Items table.
- Open Defects table.
- Blocked Items list.
- Release activity/history.
- Readiness criteria, release owner approval và go/no-go decision.
- `View Included Items` chưa điều hướng.

### SCR-10 — Reports

Các widget yêu cầu đều render, gồm Burndown, Velocity, Status, Defects, Release, Workload, Blocked, Planned vs Completed, Activity và Sprint Progress.

Thiếu:

- Data vẫn static.
- Export Report và Customize Dashboard chưa chạy.
- Context selector không cập nhật chart.
- Chưa có Saved Views/date range đúng như prompt.
- Chưa định nghĩa nguồn dữ liệu, cut-off time và calculation rule cho từng metric.

### SCR-11 — Notifications

Filter local và Mark all as read hoạt động; số unread trong page chuyển từ 3 về 0.

Thiếu hoặc chưa đồng bộ:

- Không có tab Mentions riêng dù có notification mention.
- Không có tab Release Updates dù có notification release.
- `Go to item` chưa deep-link.
- Read state không persist.
- Unread badge ở app shell được tính từ constant riêng, không đồng bộ state của Notifications page.

### SCR-12 — Settings / Admin

Project, Workflow, Labels, Workspace, Users, Roles và Audit tabs đều render. Role gating ở menu phản ánh phần lớn rule Admin/PM.

Thiếu:

- Save/Add/Edit/Delete/Invite/Change Role chưa persist.
- Chưa có validation, confirm destructive action và unsaved-change guard.
- Không có Access Denied page/redirect.
- BUG-03 làm lộ nội dung tab hiện hành khi đổi xuống Viewer.
- Permission matrix là visual, chưa map tới permission codes/backend enforcement.

## 4. Thứ tự xử lý đề xuất

### P0 — Trước khi review nghiệp vụ sâu hơn

1. ~~Sửa hooks violation ở Track Board.~~ Hoàn thành.
2. ~~Sửa hooks violation ở Backlog khi filter/search thay đổi row count.~~ Hoàn thành.
3. Thêm Error Boundary để lỗi một feature không làm trắng toàn app.
4. Chặn/redirect Settings khi role không còn quyền.

### P1 — Hoàn thiện luồng User Story → Task → Time

1. Thêm Tasks section trong Work Item Detail.
2. Add/Edit/Delete Task và task status.
3. Original Estimate, Remaining và time log/Actual theo Task.
4. Roll-up Task effort lên US.
5. Bổ sung quyền log/edit time và audit history.

### P2 — Hoàn thiện interaction prototype

1. DnD cho Backlog ranking và Board.
2. CRUD/bulk action local hoặc mock API để review flow end-to-end.
3. Context selector, filters và Saved Views hoạt động thống nhất.
4. Deep-link Work Item, Notifications và Release Detail.
