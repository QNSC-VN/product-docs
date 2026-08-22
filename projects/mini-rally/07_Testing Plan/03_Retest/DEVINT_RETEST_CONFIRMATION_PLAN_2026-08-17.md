# DevInt Retest Confirmation Plan — Phase 0-6

Ngày lập: 2026-08-17
Nguồn: `../PHASE_0_6_AUDIT_TRACKER.xlsx`
Phạm vi: toàn bộ case đang có trạng thái **Fail**, **Partial** hoặc **Blocked**.

## Cách thực hiện

1. Retest trên `https://rally-dev.qnsc.vn/` bằng dữ liệu thuộc Project TEST hoặc dữ liệu audit an toàn.
2. Đi từng case theo thứ tự dưới đây; không tự chuyển sang case tiếp theo trước khi BA confirm.
3. Với mỗi case, ghi rõ Expected, Actual mới, Evidence và trạng thái đề xuất.
4. BA xác nhận một trong các trạng thái: `Pass`, `Fail`, `Partial`, `Blocked`.
5. Chỉ cập nhật workbook tổng sau khi hoàn tất toàn bộ vòng xác nhận hoặc khi BA yêu cầu.

## Baseline trước retest

- Tổng case cần retest: **32**
- Fail: **8**
- Partial: **8**
- Blocked: **16**
- Case đang thực hiện: **Hoàn tất 32/32 case — chờ tổng hợp workbook/handoff**

## A. Fail — 8 case

| STT | Case ID | Phase | Nội dung | Route | Trạng thái xác nhận |
|---:|---|---|---|---|---|
| 01 | GAP-P1-WID-007 | Phase 1 | Owner mặc định và danh sách Unassigned/thành viên Team | `/item/US-1` | **Fail — BA confirmed** |
| 02 | GAP-P3-TS-006 | Phase 3 | Hiển thị mặc định Estimate/To Do/Actual | `/team-status` | **Pass — BA confirmed** |
| 03 | GAP-P3-REL-001 | Phase 3 | Loại bỏ progress widget khỏi Release Detail | `/releases/{id}` | **Fail — BA confirmed** |
| 04 | GAP-P3-MS-002 | Phase 3 | Hiển thị artifact trực tiếp và artifact con của Milestone | `/milestones/{id}` | **Pass — BA confirmed** |
| 05 | P5-PI-003 | Phase 5 | Khóa Project theo context khi tạo/sửa Portfolio Item | `/portfolio/{id}` | **Fail — BA confirmed** |
| 06 | P5-CP-025 | Phase 5 | Cột nguồn allocation trong Team Feature table | `/capacity-planning/{id}` | **Pass — BA confirmed; SRS updated** |
| 07 | P5-CP-029 | Phase 5 | Tính Complete/Rollup/Estimated và Team split | `/capacity-planning/{id}` | **Fail — BA confirmed** |
| 08 | P6-TC-007 | Phase 6 | Task Unassigned không được gán số liệu cho member | `/reports` | **Pass — BA confirmed** |

## B. Partial — 8 case

| STT | Case ID | Phase | Nội dung | Route | Trạng thái xác nhận |
|---:|---|---|---|---|---|
| 09 | GAP-P1-WID-001 | Phase 1 | Phạm vi tab và nội dung Work Item Detail | `/item/US-1` | **Pass — BA confirmed; SRS updated** |
| 10 | GAP-P4-SET-002 | Phase 4 | User list/detail, role và runtime enforcement | `/settings` | **Pass — BA confirmed; SRS updated** |
| 11 | GAP-P4-SET-004 | Phase 4 | Confirmation khi deactivate/remove Team/User | `/settings` | **Pass — BA confirmed; SRS updated** |
| 12 | P5-PI-015 | Phase 5 | Build/current-access smoke của Portfolio | `/portfolio` | **Pass — BA confirmed** |
| 13 | P5-CP-013 | Phase 5 | Hover breakdown của Capacity progress | `/capacity-planning/{id}` | **Partial — BA confirmed; dependent rollup bug P5-CP-029** |
| 14 | P5-CP-012 | Phase 5 | Build/current-access smoke của Capacity Planning | `/capacity-planning/{id}` | **Pass — BA confirmed** |
| 15 | P5-CP-030 | Phase 5 | Warning khi Rollup/Estimated vượt Capacity | `/capacity-planning/{id}` | **Partial — BA confirmed; Rollup warning blocked by P5-CP-029** |
| 16 | P5-CP-033 | Phase 5 | Rank, action, warning và Breakdown | `/capacity-planning/{id}` | **Partial — BA confirmed; only Rollup blocked by P5-CP-029** |

## C. Blocked — 16 case

| STT | Case ID | Phase | Nội dung | Điều kiện còn thiếu | Trạng thái xác nhận |
|---:|---|---|---|---|---|
| 17 | GAP-P4-NOTIF-001 | Phase 4 | Notification data, filter và unread count | Notification có kiểm soát | **Pass — BA confirmed; SRS updated** |
| 18 | GAP-P4-NOTIF-002 | Phase 4 | Read/Mark all read và persistence | Notification có kiểm soát | **Pass — BA confirmed** |
| 19 | GAP-P4-NOTIF-003 | Phase 4 | Notification khi assign/mention và target route | Sender/recipient riêng | **Pass — BA confirmed; SRS updated** |
| 20 | GAP-P4-RBAC-003 | Phase 4 | Enforcement Admin/Editor/unassigned Project | Session nhiều role | **Fail — BA confirmed** |
| 21 | P5-PI-004 | Phase 5 | Project Admin quản lý Portfolio trong Project được gán | Project Admin session | **Pass — BA confirmed** |
| 22 | P5-PI-005 | Phase 5 | Cô lập Portfolio của Project chưa được gán | Unassigned-user session | **Pass — BA confirmed** |
| 23 | P5-PI-006 | Phase 5 | Editor không được mở Portfolio | Editor session | **Pass — BA confirmed** |
| 24 | P5-CP-011 | Phase 5 | Quyền truy cập Capacity Planning theo role | Session nhiều role | **Pass — BA confirmed** |
| 25 | P5-CP-019 | Phase 5 | Editor không được mở Capacity Planning | Editor session | **Pass — BA confirmed** |
| 26 | P5-CP-026 | Phase 5 | Mapping quyền cố định của Capacity Planning | Project Admin/Editor session | **Pass — BA confirmed** |
| 27 | P5-CP-035 | Phase 5 | Publish với Release/date match và mismatch | Hai plan kiểm soát và rollback | **Partial — BA confirmed; advisory wording/duplicate defect** |
| 28 | P6-COM-004 | Phase 6 | Quyền truy cập Phase 6 theo role | Session nhiều role | **Pass — BA confirmed** |
| 29 | P6-IB-003 | Phase 6 | Accepted Points theo acceptedDate | Snapshot/ngày có kiểm soát | **Blocked — BA confirmed; missing post-Accept finalized snapshot** |
| 30 | P6-IB-004 | Phase 6 | Reopen item sau snapshot đã finalized | Historical snapshot có kiểm soát | **Blocked — BA confirmed; missing finalized Accepted snapshot** |
| 31 | P6-VEL-004 | Phase 6 | Move item vào/ra completed Iteration | Iteration và item rollback-safe | **Partial — BA confirmed; move-out/chart Pass, completed Iteration selector missing** |
| 32 | P6-VEL-008 | Phase 6 | Accepted/Release item thiếu acceptedDate | Dữ liệu lịch sử không hợp lệ có kiểm soát | **Blocked — BA confirmed; DEV controlled-data verification required** |

## D. Defect phát sinh trong retest

Các defect dưới đây được phát hiện trong lúc tạo precondition cho 32 case gốc; không làm thay đổi số lượng baseline ban đầu.

| Case ID | Phase | Nội dung | Route | Trạng thái xác nhận |
|---|---|---|---|---|
| GAP-P2-IS-004 | Phase 2 | Inline Dev Owner mất giá trị sau reload | `/iteration-status` | **Fail — BA confirmed** |

## Nhật ký xác nhận

### 01 — GAP-P1-WID-007

- Trạng thái cũ: `Fail`
- Expected: Work Item và Task mặc định `Unassigned`. Khi có Team, Owner dropdown hiển thị `Unassigned` và các member active của Team đó; không có Team thì chỉ hiển thị `Unassigned`.
- Test data: Project TEST, Work Item `US-1`, Task `TA-1`, Team Pegasus.
- Actual mới:
  - `US-1` thuộc Team Pegasus, Owner hiện là `Unassigned`.
  - Owner dropdown của `US-1` chỉ có `— No Entry —`, không có member active của Pegasus.
  - Task `TA-1` thuộc cùng Team Pegasus; inline Owner dropdown cũng chỉ có `— No Entry —`.
  - Màn Team Status với filter Pegasus đang hiển thị member active `Anh Nguyen Thi Ngoc`, chứng minh Team có member hợp lệ để gán.
- Evidence:
  - `https://rally-dev.qnsc.vn/item/US-1`
  - `https://rally-dev.qnsc.vn/team-status` với Team Pegasus.
- Trạng thái đề xuất: `Fail` — DEV chưa đưa active Team member vào Owner dropdown của Work Item và Task.
- BA confirmation: **Confirmed Fail**.

### 02 — GAP-P3-TS-006

- Trạng thái cũ: `Fail`
- Expected: Trên Team Status, các trường Task `Estimate`, `To Do` và `Actual` chưa có dữ liệu phải hiển thị số `0`, không dùng dấu `--`.
- Test data: Project TEST, Team Pegasus, Iteration chứa Task audit.
- Actual mới:
  - Team Status, Team Pegasus, Iteration `P56-AUDIT History Sprint` hiển thị Task `TA-3`.
  - Dòng Task lần lượt hiển thị `Estimate = 4`, `To Do = 4`, `Actual = 0`, `Owner = --`.
  - Dấu `--` nằm ở cột Owner vì Task đang Unassigned; không nằm ở cột Actual như kết luận test cũ.
  - Iteration rỗng hiển thị toàn bộ totals là `0h`.
- Evidence: `https://rally-dev.qnsc.vn/team-status`, filter Team Pegasus, mở nhóm Unassigned.
- Trạng thái đề xuất: `Pass` — kết quả Fail cũ là do đọc lệch cột Owner thành Actual.
- BA confirmation: **Confirmed Pass**.

### 03 — GAP-P3-REL-001

- Trạng thái cũ: `Fail`
- Expected: Release Detail không hiển thị Task Roll-up, Accepted progress, Burndown hoặc progress widget; toàn bộ Release progress thuộc Portfolio > Release Tracking.
- Test data: Project TEST, Release có dữ liệu Artifact/Task.
- Actual mới:
  - Release Detail `RE-2 — AUD-R2 2026` vẫn hiển thị section `Task Roll-up` trong right sidebar.
  - Section gồm `Estimate 0h`, `To Do 0h`, `Actual 0h` và `Accepted 0`.
  - Không thấy Burndown, nhưng chỉ cần Task Roll-up/Accepted xuất hiện đã trái Phase 3 SRS.
- SRS evidence: `04_Developement_tracking/Phase 3/02_Release_Management/SRS.md` — `P3-REL-FR-023`, `P3-REL-FR-024`, AC #10 và test scenario `P3-REL-TS-016`.
- Evidence: `https://rally-dev.qnsc.vn/releases/019fff28-51be-7024-a876-dd7cc6eb0ec0`.
- Trạng thái đề xuất: `Fail` — DEV cần bỏ toàn bộ Task Roll-up/Accepted progress khỏi Release Detail; progress chỉ nằm tại Portfolio > Release Tracking.
- BA confirmation: **Confirmed Fail**.

### 04 — GAP-P3-MS-002

- Trạng thái cũ: `Fail`
- Expected: Milestone Artifacts hiển thị các US/DE/Feature/Epic được gán trực tiếp và descendant kế thừa của Feature/Epic đúng một lần, không duplicate.
- Test data: Milestone `MS-1`, Feature `FE-6` và các descendants đã được gán.
- Actual mới:
  - Trước test, `FE-6` đang là `No Milestone`, nên evidence cũ không còn hợp lệ.
  - Đã gán `FE-6` vào `MS-1 — AUD-MS1 Cross Release` từ Feature Detail và Save thành công.
  - Sau khi reload Milestone Artifacts, danh sách hiển thị 4 item: `US-18`, `US-9`, `FE-6`, `US-8`.
  - Parent `FE-6` được hiển thị; descendants `US-8`, `US-9` cũng xuất hiện; không thấy ID duplicate.
- SRS evidence: `04_Developement_tracking/Phase 3/03_Milestones/SRS.md` — `P3-MS-FR-014`, `P3-MS-FR-029`, `P3-MS-FR-030`, AC #8/#17, `P3-MS-TS-001`, `P3-MS-TS-002`.
- Evidence:
  - `https://rally-dev.qnsc.vn/portfolio/019fff2d-06d7-7956-9ee1-85d45b36ec0c`
  - `https://rally-dev.qnsc.vn/milestones/019fff28-b5b6-714d-a7e4-f05cbd5430c5`
- Trạng thái đề xuất: `Pass` — direct Feature và inherited descendants đang hiển thị đúng sau Save/reload.
- BA confirmation: **Confirmed Pass**.

### 05 — P5-PI-003

- Trạng thái cũ: `Fail`
- Expected: Project của Portfolio Item và Work Item được kế thừa từ Project context hiện tại, không cho đổi sang Project khác trong create/detail flow.
- Test data: Project AUDIT26, Feature `FE-6`, Children > Add Item/New Work Item.
- Actual mới:
  - Từ `FE-6` thuộc Project AUDIT26, mở Children > Add New.
  - Modal `New Work Item` prefill Project AUDIT26 nhưng Project vẫn là button tương tác.
  - Mở Project dropdown thấy ba lựa chọn: `TEST`, `AUDIT26`, `P6RT014`.
  - Người dùng có thể bắt đầu tạo child Work Item sang Project khác, trái rule Project context đã chốt.
- SRS evidence đã cập nhật trong phiên 2026-08-17:
  - `04_Developement_tracking/Phase 1/02_Work_Item_Create/SRS.md` — `WIC-FR-004`, AC #11.
  - `04_Developement_tracking/Phase 1/03_Work_Item_Detail/SRS.md` — `WID-FR-017`, AC #9.
  - `04_Developement_tracking/Phase 5/01_Portfolio_Items/SRS.md` — `P5-PI-FR-013`, AC #11.
- Evidence: `https://rally-dev.qnsc.vn/portfolio/019fff2d-06d7-7956-9ee1-85d45b36ec0c`, Children > Add New > Project.
- Trạng thái đề xuất: `Fail` — khóa Project theo active/Feature Project context.
- BA confirmation: **Confirmed Fail**; Project must be read-only. SRS updated in this session.

### 06 — P5-CP-025

- Trạng thái cũ: `Fail`
- Expected theo BA confirmation 2026-08-17: own-Team split hiển thị `to {other Team}`; cross-Team hiển thị `from {own Team}`; Dependencies placeholder = `0`; mỗi Team Estimate là giá trị cuối cùng và không tự động trừ Team khác.
- Test data: Capacity Plan trong Project TEST có Feature được allocate theo Team.
- Actual mới:
  - Đã thêm Team audit `Retest Capacity` vào plan và split FE-2: Pegasus 6 points, Retest Capacity 2 points.
  - Dòng FE-2 dưới own-Team Pegasus hiển thị `to Retest Capacity`; Expected phải là `—`.
  - Dòng FE-2 dưới Retest Capacity hiển thị `from Pegasus`; nhánh cross-Team này đúng.
  - Cột Dependencies hiển thị `0` ở cả hai dòng; BA đã xác nhận giá trị này được chấp nhận.
- SRS evidence: `04_Developement_tracking/Phase 5/02_Capacity_Planning/SRS.md` — Allocation rule, Dependencies rule, `P5-CAP-AC-017`.
- SRS đã được cập nhật trong phiên 2026-08-17 để thống nhất Dependencies placeholder = `0`.
- Evidence: `https://rally-dev.qnsc.vn/capacity-planning/41d10dd3-6392-47c0-8972-bc4e521d319e`, Teams tab, mở Pegasus và Retest Capacity.
- Trạng thái đề xuất: `Pass` — DevInt đang đúng theo business rule vừa chốt.
- BA confirmation: **Confirmed Pass**; SRS updated in session 2026-08-17.

### 07 — P5-CP-029

- Trạng thái cũ: `Fail`
- Expected: Complete và Rollup tính từ child Story/Defect Plan Estimate; chuyển child status phải recalculation ngay; Team slices và Feature total phải khớp.
- Test data: Capacity Plan CP-1, Feature FE-2 và child có Plan Estimate.
- Actual mới: FE-2 có đúng 1 child US-5, Plan Estimate = 3. Trước test US-5 ở Idea. Sau khi chuyển US-5 sang Completed và tải lại Capacity Plan, header Plan vẫn hiển thị `Complete = 0`, `Rollup = 0`; Team Pegasus cũng vẫn `Complete = 0`, `Rollup = 0`. Hệ thống không recalculation theo child đang liên kết. Sau test đã hoàn tác US-5 về Idea.
- Evidence: `https://rally-dev.qnsc.vn/portfolio/019fd5d9-9137-731a-aa13-aee2e012ac5d` (Children tab: US-5, Est 3) và `https://rally-dev.qnsc.vn/capacity-planning/41d10dd3-6392-47c0-8972-bc4e521d319e` (sau khi child Completed: Complete 0, Rollup 0).
- SRS evidence: `04_Developement_tracking/Phase 5/02_Capacity_Planning/SRS.md`, metric rules và `P5-CAP-AC-016`.
- Trạng thái đề xuất: `Fail`.
- BA confirmation: **Confirmed Fail**.
- Retest bổ sung trong Case 13 ngày 2026-08-17:
  - Tạo Task `TA-4 — AUDIT Rollup Task 20260817` dưới US-5 với Estimate = 2h; hệ thống copy To Do = 2h khi tạo.
  - Chuyển TA-4 sang Completed: To Do về 0h và US-5 tự chuyển Completed đúng.
  - Tạo mới trực tiếp từ FE-2 một child sạch `US-19 — AUDIT Capacity Rollup Story 20260817`, Plan Estimate = 2, Team Pegasus; sau đó chuyển US-19 sang Completed.
  - FE-2 lúc này có hai child Completed với tổng Plan Estimate = 5, nhưng Capacity Plan CP-1 sau reload vẫn hiển thị Complete = 0 và Rollup = 0 ở Plan và Team Pegasus.
  - Kết luận: lỗi rollup được tái hiện cả với dữ liệu cũ đã sửa liên kết và dữ liệu mới tạo đúng journey; không phải do riêng US-5 bị lệch dữ liệu.

### 08 — P6-TC-007

- Trạng thái cũ: `Fail`
- Expected: Task không có Owner chỉ được tổng hợp vào dòng `Unassigned` với Capacity = 0h; không được cộng sang member có tên.
- Test data: Iteration `IT-2 — P56-AUDIT History Sprint`, US-17 và Task `TA-3 — P56-AUDIT Burndown Task`.
- Actual mới:
  - Iteration Status xác nhận TA-3 đang `Unassigned`, Estimate = 4h, To Do = 4h, Actual = 0h.
  - Reports > Team Capacity hiển thị Team Pegasus và đúng một dòng `Unassigned`: Capacity = 0h, Estimate = 4h, ToDo = 4h, Actual = 0h.
  - Không có member có tên nhận số giờ của TA-3.
- Evidence: `https://rally-dev.qnsc.vn/iteration-status` và `https://rally-dev.qnsc.vn/reports`, Type = Team Capacity, Iteration IT-2.
- SRS evidence: `04_Developement_tracking/Phase 6/04_Team_Capacity/SRS.md`, null-owner rule và AC #7.
- Trạng thái đề xuất: `Pass`.
- BA confirmation: **Confirmed Pass**.

### 09 — GAP-P1-WID-001

- Trạng thái cũ: `Partial`.
- Expected theo SRS hiện hành: Work Item Detail có ba tab `Details`, `Tasks`, `Revision History`; Details gồm Description, Attachments, Notes và Release Notes.
- Actual mới:
  - Ba tab bắt buộc đều có và hoạt động trên US-1.
  - DevInt có thêm tab `Connections`.
  - Details có thêm `Linked Items` và `Comments`; BA đã chấp nhận và SRS đã được mở rộng để bao gồm các phần này.
- Evidence: `https://rally-dev.qnsc.vn/item/US-1`.
- SRS evidence: `04_Developement_tracking/Phase 1/03_Work_Item_Detail/SRS.md` — scope UI, `WID-FR-004`, `WID-FR-005`, `WID-FR-006`.
- Trạng thái đề xuất: `Pass` — BA chấp nhận các phần Dev tự bổ sung.
- BA confirmation: **Confirmed Pass**; bổ sung `Connections`, `Linked Items`, `Comments` vào Phase 1 Work Item Detail SRS.

### 10 — GAP-P4-SET-002

- Trạng thái cũ: `Partial`.
- Expected: Users list chỉ gồm User, Email, Status, Last Login; không có global Project Role. User Detail tách General và Project Access. Current access levels chỉ gồm Admin/Editor; Workspace Admin detail read-only.
- Actual mới:
  - Users list hiển thị đúng User, Email, Status, Last Login; không có Phone, Teams hoặc global Role column.
  - Workspace Admin detail hiển thị read-only và không áp dụng Project Access riêng.
  - Normal-user detail có hai tab General/Project Access; Project TEST đang có Access Level Editor và Team Retest Capacity.
  - Access Level dropdown chỉ có Admin và Editor; không có Viewer/selectable No Access.
  - Chưa xác minh được runtime enforcement bằng session Editor hoặc user không được gán Project trong vòng test hiện tại.
- Runtime Editor retest 2026-08-17:
  - Editor account `vuhieu24042000` chỉ thấy menu Home, Plan, Track và Quality; Settings chỉ có Profile & Account/My Permissions.
  - Direct URL bị chặn đúng: Timeboxes, Releases, Portfolio, Capacity Planning và Reports.
  - Direct URL `/team-status` vẫn mở đầy đủ Team Status và dữ liệu member/Unassigned, trái capability baseline yêu cầu Editor không được truy cập Team Status.
  - Sau khi đăng nhập lại Editor, mở trực tiếp `/team-status` lần hai vẫn hiển thị đầy đủ Team Status, Iteration, member rows và Unassigned totals. Lỗi được tái hiện ổn định.
- Evidence: `https://rally-dev.qnsc.vn/settings`, User Management > Manage Access.
- SRS evidence: `04_Developement_tracking/Phase 4/03_Settings_Audit/SRS.md` và `Phase 4/02_Roles_Permissions/SRS.md`.
- Trạng thái cuối: `Pass` theo BA decision mới — Editor được xem Team Status read-only; các route Timeboxes/Release/Portfolio/Capacity Planning/Reports vẫn bị chặn đúng.
- BA confirmation: **Confirmed Pass**; Phase 3 Team Status và Phase 4 Roles/Permissions SRS updated 2026-08-17.

### 11 — GAP-P4-SET-004

- Trạng thái cũ: `Partial`.
- Expected: destructive/high-impact Team/User/access actions mở confirmation nêu rõ target và consequence; company-user removal yêu cầu gõ tên; remove Project access chỉ cần clear confirmation theo SRS hiện hành.
- Actual mới:
  - Deactivate user `vuhieu24042000` mở modal đúng target/consequence và có Cancel; primary button đang ghi `Deactive` thay vì `Deactivate`.
  - Remove company user access đã có modal, nêu đúng target/consequence, bắt gõ `vuhieu24042000`, và giữ primary action disabled khi chưa nhập.
  - Deactivate Team mở modal nêu target/consequence và yêu cầu gõ tên Team trước khi cho Deactivate.
  - Remove Project access mở modal đúng target/consequence và yêu cầu gõ username.
  - BA đã thực hiện Remove Access; account bị đưa về login, xác nhận enforcement hoạt động.
- Evidence: `https://rally-dev.qnsc.vn/settings`, User Management và Workspaces & Projects > TEST.
- SRS evidence: `04_Developement_tracking/Phase 4/03_Settings_Audit/SRS.md`, section 10 Destructive Confirmations và AC #11.
- Trạng thái cuối: `Pass`; typed confirmation của Remove Project Access được chấp nhận và cập nhật vào SRS. Copy `Deactive` là lỗi chữ nhỏ, không chặn acceptance.
- BA confirmation: **Confirmed Pass**.

### 12 — P5-PI-015

- Trạng thái cũ: `Partial`.
- Expected: Portfolio build/access smoke cho Workspace Admin, Project Admin, Editor và unassigned user; list, Epic/Feature switching và detail load không có lỗi nghiêm trọng.
- Actual mới:
  - Workspace Admin mở `/portfolio` thành công; Feature list tải 3 rows với Type, progress, Project, Team và Owner.
  - Chuyển Type sang Epic hiển thị EP-1 và hierarchy count đúng; chuyển lại Feature hoạt động.
  - Mở FE-2 Detail thành công; Details, Children, Revision History, progress và sidebar render đầy đủ.
  - Editor runtime ở vòng Case 10 đã bị chặn đúng khi mở trực tiếp `/portfolio`.
  - Unassigned account sau khi bị Remove Access đã được BA đăng nhập thử và xác nhận không truy cập được Project/Portfolio: Pass.
  - Project Admin `vuhieu24042000` được xác nhận tại My Permissions: chỉ có Project TEST, Access Level Admin. Portfolio mở và tải đúng ba Feature của TEST.
  - Project isolation pass: Manage Projects chỉ hiển thị đúng một assigned Project là TEST; AUDIT26/P6RT014 không xuất hiện.
  - Build/console evidence được tách sang DEV technical checklist và không chặn BA acceptance.
- Evidence: `https://rally-dev.qnsc.vn/portfolio` và FE-2 Detail.
- SRS evidence: `04_Developement_tracking/Phase 5/01_Portfolio_Items/SRS.md` và Phase 4 Roles/Permissions SRS.
- Trạng thái đề xuất: `Pass` — WA, Project Admin, Editor và Unassigned boundaries đã được xác minh; Portfolio list/detail smoke pass. Technical build evidence không thuộc BA acceptance.
- BA confirmation: **Confirmed Pass**.

### 13 — P5-CP-013

- Trạng thái cũ: `Partial`.
- Expected theo Phase 5 Capacity Planning SRS:
  - Hover thanh progress cấp Team hiển thị `Complete`, `Rollup`, `Estimated` và `Capacity/base`.
  - Hover thanh progress cấp Feature hiển thị số `Complete`, `Rollup`, `Estimated`; không hiển thị Capacity hoặc phần trăm.
  - Tooltip phải nổi phía trên grid/list và không bị cắt bởi vùng overflow của bảng.
- Test data: Capacity Plan `CP-1 — P56-AUDIT Phase 5 Capacity Plan`, Team `Pegasus`, Feature `FE-2`.
- Actual mới đã quan sát:
  - Thanh progress cấp Team Pegasus render đầy đủ trong Team row.
  - Sau khi bung Team Pegasus, thanh progress cấp Feature FE-2 render trong bảng con.
  - BA xác nhận tooltip không bị che/khuất.
  - Tuy nhiên dữ liệu hiển thị trong progress vẫn sai do lỗi phụ thuộc `P5-CP-029`: FE-2 có US-5 và US-19 đều Completed, tổng Plan Estimate = 5, nhưng Complete/Rollup vẫn là 0 sau reload.
  - Task TA-4 Completed đã làm US-5 tự Completed đúng; lỗi nằm ở Capacity Planning rollup, không nằm ở Task-to-US automation.
- Evidence: `https://rally-dev.qnsc.vn/capacity-planning/41d10dd3-6392-47c0-8972-bc4e521d319e`, tab Teams, Pegasus expanded.
- SRS evidence: `04_Developement_tracking/Phase 5/02_Capacity_Planning/SRS.md`, mục 7 `Teams by Total`, bảng Feature rows và `P5-CAP-AC-004`.
- Trạng thái đề xuất: `Partial` — UI hover/overlay đạt; dữ liệu Complete/Rollup không phản ánh child work do lỗi `P5-CP-029`.
- BA confirmation: **Confirmed Partial**; giữ `P5-CP-029` là **Fail**.

### 14 — P5-CP-012

- Trạng thái cũ: `Partial`.
- Expected cho BA smoke test: Capacity Plan route và record CP-1 tải được; các view chính hoạt động; không có lỗi UI nghiêm trọng làm chặn sử dụng. Build/console là checklist kỹ thuật của DEV, không phải BA acceptance blocker.
- Actual mới:
  - Mở trực tiếp CP-1 thành công; header, Draft status, Release, summary metrics và Team rows đều render.
  - Chuyển `Teams -> Features -> Teams` thành công; Feature rows, Planned Team Assignment và Team Capacity rail tải đầy đủ.
  - Không gặp blank page, crash hoặc lỗi điều hướng nghiêm trọng.
  - Lỗi Complete/Rollup = 0 đã được tách và giữ tại `P5-CP-029`; không làm thay đổi kết quả smoke/load của case này.
- Evidence: `https://rally-dev.qnsc.vn/capacity-planning/41d10dd3-6392-47c0-8972-bc4e521d319e`.
- SRS evidence: `04_Developement_tracking/Phase 5/02_Capacity_Planning/SRS.md`.
- Trạng thái đề xuất: `Pass` — BA runtime smoke đạt; build/console để DEV xác nhận riêng.
- BA confirmation: **Confirmed Pass**.

### 15 — P5-CP-030

- Trạng thái cũ: `Partial`.
- Expected:
  - Plan và Team hiển thị cảnh báo khi `Estimated > Capacity` hoặc `Rollup > Capacity`.
  - Feature/Team hiển thị cảnh báo `Rollup exceeds Estimated` và attention badge khi có Feature vi phạm.
  - Cảnh báo chỉ mang tính advisory, không khóa thao tác.
- Test data: CP-1; Pegasus Estimated = 6, Plan Estimated = 8. Tạm đổi Pegasus Capacity từ 20 xuống 5.
- Actual mới:
  - Plan lập tức hiển thị icon `Estimated exceeds Capacity`; Estimated = 8 / Capacity = 5, tương ứng 160%.
  - Team Pegasus hiển thị cùng warning; Estimated = 6 / Capacity = 5, tương ứng 120%.
  - Việc sửa Capacity vẫn lưu thành công; warning không chặn thao tác.
  - Không thể xác minh nhánh `Rollup > Estimated/Capacity` vì lỗi `P5-CP-029` vẫn trả Complete/Rollup = 0 dù FE-2 có 5 points child Completed.
- Evidence: `https://rally-dev.qnsc.vn/capacity-planning/41d10dd3-6392-47c0-8972-bc4e521d319e`, Pegasus Capacity = 5.
- SRS evidence: `04_Developement_tracking/Phase 5/02_Capacity_Planning/SRS.md`, exceed-warning rules và `P5-CAP-AC-004`.
- Trạng thái đề xuất: `Partial` — Estimated-over-Capacity pass; Rollup warning bị chặn bởi confirmed Fail `P5-CP-029`.
- BA confirmation: **Confirmed Partial**.

### 16 — P5-CP-033

- Trạng thái cũ: `Partial`.
- Expected theo SRS hiện hành:
  - Feature có Rank `1..N` và drag handle để reorder.
  - Feature settings menu cung cấp `Allocate to Teams` và `Remove from Plan`; không cần Move up/Move down.
  - Missing Estimate và exceed warnings hiển thị đúng.
  - `Breakdown` mở Complete/Rollup/Estimated/Capacity totals và các mini bar cùng scale.
- Actual mới:
  - FE-2/FE-4 hiển thị Rank 1/2 và có `Drag to rank`: Pass.
  - FE-4 hiển thị warning `Point Estimated missing`: Pass.
  - Breakdown mở đúng, có Complete, Rollup, Estimated, Capacity, Remaining và các bar segment: Pass về UI; số Rollup vẫn sai do `P5-CP-029`.
  - Menu FE-2 có `Move down`, `Allocate to teams`, `Move to another plan`, `Remove all assignments`, `Remove from plan`.
  - BA xác nhận menu hiện tại hợp lý và được giữ. SRS đã cập nhật để coi Move up/down là shortcut, cho phép chuyển Plan, bỏ toàn bộ Team assignment nhưng giữ Feature trong Plan, hoặc xóa Feature khỏi Plan.
- Evidence: CP-1, tab Features, menu `Actions for FE-2` và nút Breakdown.
- SRS evidence: `04_Developement_tracking/Phase 5/02_Capacity_Planning/SRS.md`, Feature reorder/menu rule, §8/§9 và `P5-CAP-AC-018`.
- Trạng thái đề xuất: `Partial` — Rank/menu/missing-estimate warning/Breakdown UI đạt; chỉ còn Rollup phụ thuộc confirmed Fail `P5-CP-029`.
- BA confirmation: **Confirmed Partial**; menu accepted và Phase 5 Capacity Planning SRS updated ngày 2026-08-17.

### 17 — GAP-P4-NOTIF-001

- Trạng thái cũ: `Blocked` do thiếu notification có kiểm soát.
- Expected:
  - Bell mở notification popover và Notification Center.
  - Notification Center chỉ có bốn filter `All`, `Unread`, `Assigned`, `Mentions`.
  - Bell/header unread count khớp số notification chưa đọc; list hiển thị đúng category và newest first.
  - Filter không có dữ liệu hiển thị empty state phù hợp.
- Actual mới:
  - Bell mở popover thành công; popover hiển thị `Unread only`, `Showing 0 of 0` và link `View all`.
  - `View all` mở `/notifications` thành công.
  - Đủ đúng bốn filter `All`, `Unread`, `Assigned`, `Mentions`; mỗi filter chuyển active state đúng.
  - Empty state đúng: All = `New notifications will appear here`; Unread = `No unread notifications`; Assigned/Mentions hướng người dùng về All.
  - BA đã kiểm tra và xác nhận: khi gán `Owner` hoặc `Dev Owner` bằng inline edit, hệ thống tạo/trả notification đúng.
  - Iteration Status hiện ghi nhận `vuhieu24042000` được gán Owner cho US-17 và TA-3; đây là dữ liệu kiểm soát cho notification assignment.
  - Khi assign Owner trong Detail Page, dropdown không hiện đúng active Team members. Đây là confirmed defect `GAP-P1-WID-007`, không phải lỗi notification delivery.
  - Khi inline edit `Dev Owner`, hệ thống báo update thành công và notification hoạt động nhưng giá trị mất sau reload. Đây là defect persistence riêng `GAP-P2-IS-004`, không phải lỗi notification delivery.
  - Business được chốt bổ sung: assignment notification áp dụng cho `Owner` và `Dev Owner` của US/DE/Task; inline edit và Detail Page phải dùng chung business event.
- Evidence: `https://rally-dev.qnsc.vn/iteration-status`, inline Owner/Dev Owner assignment; `https://rally-dev.qnsc.vn/notifications`.
- SRS evidence: `04_Developement_tracking/Phase 4/01_Notifications/SRS.md`, `P4-NOTIF-DC-012`, `P4-NOTIF-DC-015`, `P4-NOTIF-FR-023..024` và acceptance checklist.
- Trạng thái đề xuất: `Pass` — BA xác nhận notification được tạo khi gán Owner/Dev Owner inline; Detail Page thiếu user được theo dõi riêng tại `GAP-P1-WID-007`.
- BA confirmation: **Confirmed Pass**.

### Defect phát sinh — GAP-P2-IS-004

- Expected: Chọn `Dev Owner` bằng inline edit trên Iteration Status, hệ thống lưu thành công và giữ đúng giá trị sau refresh/reload.
- Actual: Dropdown có user và thao tác tạo notification, nhưng `Dev Owner` trở về `No Entry` sau reload.
- Evidence: `https://rally-dev.qnsc.vn/iteration-status`, inline Dev Owner của dữ liệu Project TEST.
- SRS evidence: `04_Developement_tracking/Phase 2/03_Iteration_Status/SRS.md`, `P2-IS-FR-032B`, `P2-IS-FR-032C` và acceptance checklist.
- Trạng thái: **Fail — BA confirmed**.
- Quan hệ lỗi: độc lập với `GAP-P1-WID-007`; một lỗi là persistence của inline Dev Owner, lỗi còn lại là candidate list của Owner tại Detail Page.

### 18 — GAP-P4-NOTIF-002

- Trạng thái cũ: `Blocked` do thiếu notification có kiểm soát.
- Expected: đọc một notification chỉ giảm một unread; `Mark all as read` đưa unread về 0; trạng thái đọc giữ nguyên sau reload/relogin.
- Actual mới:
  - Account `vuhieu24042000` có 2 assignment notifications chưa đọc; bell count = 2.
  - Chọn `Mark as read` cho một notification làm bell count giảm từ 2 xuống 1.
  - Reload giữ count = 1 và notification đã đọc vẫn ở trạng thái `Read`.
  - Chọn `All read` làm bell count về 0; reload lần nữa vẫn giữ cả hai notification ở trạng thái `Read`.
  - Nhãn runtime là `All read` thay vì `Mark all as read`; BA chấp nhận vì behavior đúng.
- Evidence: `https://rally-dev.qnsc.vn/`, notification bell/popover của account `vuhieu24042000`.
- SRS evidence: `04_Developement_tracking/Phase 4/01_Notifications/SRS.md`, `P4-NOTIF-FR-011..013` và acceptance checklist.
- Trạng thái: **Pass — BA confirmed**.

### 19 — GAP-P4-NOTIF-003

- Trạng thái cũ: `Blocked` do cần sender/recipient riêng.
- Expected: assign Owner/Dev Owner hoặc `@mention` người dùng tạo đúng category notification; click notification mở đúng Work Item/Task target.
- Actual mới:
  - Assignment notifications của `TA-3` và `US-17` xuất hiện đúng trong filter `Assigned`.
  - Click notification `TA-3` mở đúng `/item/TA-3`; click notification `US-17` mở đúng `/item/US-17`.
  - WA tạo Comment `@vuhieu24042000` trên `US-17`; account nhận có unread count tăng 1 và notification `You were mentioned in US-17`.
  - Filter `Mentions` chỉ hiển thị notification mention; click mở đúng `/item/US-17`.
  - BA chốt source của mention là Comments có `@mention`, không phải Notes; Notification SRS đã cập nhật.
- Evidence: `https://rally-dev.qnsc.vn/notifications`, `/item/TA-3`, `/item/US-17`.
- SRS evidence: `04_Developement_tracking/Phase 4/01_Notifications/SRS.md`, `P4-NOTIF-DC-012..015`, `P4-NOTIF-FR-015..017`, `P4-NOTIF-FR-023..024` và acceptance checklist.
- Trạng thái: **Pass — BA confirmed**.

### 20 — GAP-P4-RBAC-003

- Trạng thái cũ: `Blocked` do thiếu session nhiều role.
- Business baseline:
  - Admin chỉ thấy Project được gán, tự động `All Teams`, quản lý delivery nhưng Project/Team/access structure chỉ đọc.
  - Editor chỉ xem/sửa delivery data trong các active Team được gán; không được có `All Teams` ngoài phạm vi Team assignment.
  - User không còn Project assignment không được thấy Project/context/data; direct URL phải trả Access Denied hoặc Not Found an toàn.
- Actual — nhánh Admin `vuhieu24042000`:
  - `My Permissions` xác nhận TEST = Admin; chỉ thấy Project TEST và `All Teams`.
  - Project Details, estimation settings và Users & Permissions hiển thị read-only; không có action sửa cấu trúc/access.
  - Kết quả nhánh Admin: **Pass**.
- Actual — nhánh Editor `vubuiminhhieu2000`:
  - `My Permissions` xác nhận TEST = Editor.
  - WA Settings hiển thị cảnh báo `Editor has no assigned team — can't act on any work in this project yet.`
  - Team Pegasus chỉ có `Anh Nguyen Thi Ngoc`; RTCAP chỉ có `benq061097`; account không thuộc Team nào.
  - Tuy nhiên Team selector vẫn hiển thị `All Teams`, Pegasus và RTCAP.
  - Account vẫn mở được `/item/US-17` thuộc Pegasus và nhìn thấy đầy đủ dữ liệu/control của Work Item.
  - Kết quả nhánh Editor: **Fail — Team-scope enforcement leak**.
- Actual — nhánh Unassigned sau khi WA Remove Access:
  - Row Project access biến mất và WA nhận toast `Access removed (No Access)`.
  - Delivery navigation bị ẩn; Project selector không còn danh sách Project; `/backlog` trả thông báo Access Denied đúng.
  - Tuy nhiên Home vẫn hiển thị aggregate của TEST: `Open Work Items 20`, `Active Sprints 1`, `Open Defects 1` và các KPI liên quan.
  - Header/context button vẫn giữ `TEST · All Teams` dù user không còn Project assignment.
  - Direct URL `/item/US-17` không lộ record nhưng chỉ render trang trắng, không có Access Denied hoặc Not Found state.
  - Kết quả nhánh Unassigned: **Fail — metadata/context leak và missing denied state**.
- Evidence:
  - `https://rally-dev.qnsc.vn/settings` — My Permissions, Team membership, Remove Access.
  - `https://rally-dev.qnsc.vn/` — KPI sau Remove Access.
  - `https://rally-dev.qnsc.vn/backlog` — Access Denied.
  - `https://rally-dev.qnsc.vn/item/US-17` — blank denied page.
- SRS evidence: `04_Developement_tracking/Phase 4/02_Roles_Permissions/SRS.md`, §2.2, §3.1–3.2, §7 và Acceptance Criteria #3–#5.
- Trạng thái: **Fail — BA confirmed**.

### 21 — P5-PI-004

- Trạng thái cũ: `Blocked` do thiếu Admin session theo access baseline mới.
- Expected: normal user có Admin access trong Project được phép mở Portfolio Items và create/edit/archive Feature trong Project đó.
- Actual mới trên account `vuhieu24042000`, TEST = Admin:
  - Mở Portfolio Items của TEST và thấy `New Feature`.
  - Tạo thành công `FE-8 — P5-PI-004 Admin Retest 20260817`.
  - Inline edit Name thành `P5-PI-004 Admin Retest Edited 20260817`; reload vẫn giữ giá trị.
  - Archive thành công; Detail chuyển read-only và FE-8 rời active Portfolio list.
  - Dialog dùng wording Delete nhưng BA quyết định không log vì hành vi Archive đúng và ngoài trọng tâm access case này.
- Evidence: `https://rally-dev.qnsc.vn/portfolio`, archived detail `/portfolio/01a00e36-f881-75c6-947c-ec9865d82730`.
- SRS evidence: `04_Developement_tracking/Phase 5/01_Portfolio_Items/SRS.md`, `P5-PI-FR-004`, `P5-PI-FR-008`, `P5-PI-FR-017`, `P5-PI-FR-020`.
- Trạng thái: **Pass — BA confirmed**.

### 22 — P5-PI-005

- Expected: người dùng chỉ được truy cập Portfolio của Project đã được gán; Portfolio thuộc Project chưa được gán phải được cô lập.
- BA decision: không cần thực hiện thêm bước direct-URL trong phiên này; xác nhận behavior cô lập Project hiện tại đạt yêu cầu.
- Trạng thái: **Pass — BA confirmed**.

### 23 — P5-PI-006

- Expected: Editor không được thấy menu Portfolio và không được truy cập Portfolio list/detail bằng direct URL.
- Actual trên account Editor `vubuiminhhieu2000`:
  - Menu Portfolio không hiển thị.
  - Truy cập `/portfolio` trả `You don't have access to this page.`
  - Truy cập trực tiếp `/portfolio/019fd5d9-9137-731a-aa13-aee2e012ac5d` cũng trả Access Denied.
  - Không quan sát thấy dữ liệu Portfolio bị lộ.
- Evidence: `https://rally-dev.qnsc.vn/portfolio` và direct Portfolio Item URL nêu trên.
- Trạng thái: **Pass — BA confirmed**.

### 24 — P5-CP-011

- Expected theo `P5-CAP-AC-010`: Workspace Admin quản lý mọi Project; Admin quản lý Project được gán; Editor và user không được gán Project không truy cập Capacity Planning.
- Actual tổng hợp từ các session đã retest:
  - Workspace Admin truy cập và quản lý Capacity Planning được.
  - Project Admin truy cập và chỉnh sửa plan trong Project được gán.
  - Editor `vubuiminhhieu2000` không thấy menu Portfolio; direct URL Capacity Plan trả Access Denied.
  - User không được gán Project bị chặn direct access trong nhánh RBAC đã kiểm tra.
- Evidence: `https://rally-dev.qnsc.vn/capacity-planning/41d10dd3-6392-47c0-8972-bc4e521d319e` và các session role của vòng retest hiện tại.
- SRS evidence: `04_Developement_tracking/Phase 5/02_Capacity_Planning/SRS.md`, §12 và `P5-CAP-AC-010`.
- Trạng thái: **Pass — BA confirmed**.

### 25 — P5-CP-019

- Expected: Editor không thấy menu Capacity Planning; truy cập trực tiếp list/detail phải bị từ chối an toàn và không lộ dữ liệu plan.
- Actual trên Editor `vubuiminhhieu2000`:
  - Không có menu Portfolio/Capacity Planning.
  - Direct URL Capacity Plan trả `You don't have access to this page.`
  - Không quan sát thấy dữ liệu plan bị lộ.
- Evidence: `https://rally-dev.qnsc.vn/capacity-planning/41d10dd3-6392-47c0-8972-bc4e521d319e`.
- SRS evidence: `04_Developement_tracking/Phase 5/02_Capacity_Planning/SRS.md`, §12 và `P5-CAP-AC-010`.
- Trạng thái: **Pass — BA confirmed**.

### 26 — P5-CP-026

- Expected: Capacity Planning dùng mapping quyền cố định theo Project Access; không có custom permission hoặc Full/View matrix riêng.
- Actual retest theo từng role:
  - Workspace Admin: Settings > Permission Model ghi rõ mô hình cố định và không có custom role/permission editor; Capacity Planning = Full. WA mở CP-1 và có các control quản lý.
  - Project Admin `vuhieu24042000`: My Permissions xác nhận TEST = Admin; mở CP-1 và có `Edit Plan Details`, `Publish`, `Delete Plan`, `Add / Remove Teams`, Forecast.
  - Editor `vubuiminhhieu2000`: menu Portfolio/Capacity Planning bị ẩn; direct URL Capacity Plan trả Access Denied.
- Evidence: `https://rally-dev.qnsc.vn/settings` và `https://rally-dev.qnsc.vn/capacity-planning/41d10dd3-6392-47c0-8972-bc4e521d319e`.
- SRS evidence: `04_Developement_tracking/Phase 5/02_Capacity_Planning/SRS.md`, §12 và `P5-CAP-AC-010`, `P5-CAP-AC-012`.
- Trạng thái: **Pass — BA confirmed**.

### 27 — P5-CP-035

- Business source of truth: `Publish` luôn có thể chuyển Plan từ Draft sang Published. Planned dates được ghi cho Feature có Team allocation. Feature Release chỉ được ghi khi Plan start/end **khớp chính xác** Release start/end; không dùng điều kiện “nằm trong khoảng Release”.
- Dữ liệu kiểm soát:
  - Release RE-1: `2026-08-07` đến `2026-08-31`.
  - Feature FE-2 được split cho hai Team; trước mismatch đã đưa Release về No Entry để quan sát kết quả rõ ràng.
- Nhánh mismatch:
  - Plan: `2026-08-07` đến `2026-08-30`.
  - Publish thành công; FE-2 nhận planned dates nhưng Release vẫn No Entry: logic chính đạt.
  - Advisory hiển thị `FE-2 — the plan’s window reaches outside its release...` dù Plan không nằm ngoài Release mà chỉ không khớp chính xác.
  - Cùng advisory FE-2 xuất hiện hai lần do FE-2 có hai Team allocation.
- Nhánh match:
  - Plan được đổi lại `2026-08-07` đến `2026-08-31`.
  - Publish thành công; FE-2 nhận RE-1 và đúng planned dates: đạt.
  - FE-4 không có Team được báo một lần và không bị cập nhật: đạt.
- Rollback: Plan đã Unpublish về Draft; FE-2 và Plan đã trở về Release/date baseline ban đầu.
- DEV/AI fix direction:
  1. Chuẩn hóa bốn ngày thành date-only `YYYY-MM-DD`, rồi dùng điều kiện `planStart === releaseStart && planEnd === releaseEnd`.
  2. Thay toàn bộ wording `falls inside`/`reaches outside` bằng wording “Plan dates do not exactly match Release dates”.
  3. Trước khi update hoặc tạo advisory, de-duplicate allocation rows theo `featureId`; một Feature split nhiều Team chỉ được update và báo một lần.
  4. Khi mismatch: vẫn Publish; ghi planned dates; không đổi Feature Release; advisory nêu rõ cả Plan dates và Release dates.
  5. Không thay đổi hành vi `Publish without updating fields`, Published read-only hoặc Unpublish hiện đang hoạt động.
- Acceptance để retest:
  - Exact match ghi Release và dates đúng một lần cho mỗi unique allocated Feature.
  - Mismatch vẫn Published, dates được ghi, Release giữ nguyên và advisory đúng lý do.
  - Split Feature hai Team chỉ xuất hiện một advisory.
  - Feature không có Team chỉ xuất hiện một advisory và không được update.
- Evidence: CP-1, RE-1, FE-2 tại `https://rally-dev.qnsc.vn/capacity-planning/41d10dd3-6392-47c0-8972-bc4e521d319e`.
- SRS evidence: `04_Developement_tracking/Phase 5/02_Capacity_Planning/SRS.md`, confirmed direction #10–#12, `P5-CAP-AC-009`, `P5-CAP-AC-019`.
- Trạng thái: **Partial — BA confirmed**; core Publish behavior Pass, advisory wording và de-duplication cần DEV sửa.

### 28 — P6-COM-004

- Expected: Workspace Admin và assigned-Project Admin mở được Release Tracking/Reports; Editor và user không được gán Project bị ẩn menu và direct URL phải từ chối an toàn, không lộ dữ liệu Phase 6.
- Actual theo từng session:
  - Project Admin `vuhieu24042000`: mở được Release Tracking của TEST và Reports; Reports có đúng Iteration Burndown, Velocity, Team Capacity.
  - Workspace Admin `hieuvbm@qnsc.vn`: mở được cả hai surface và dữ liệu TEST bình thường.
  - Editor `vubuiminhhieu2000`: không có Portfolio/Reports; `/release-tracking` và `/reports` trả Access Denied.
  - Unassigned sau khi tạm Remove TEST access: navigation chỉ còn Home; cả hai direct URL trả Access Denied và không lộ Phase 6 data.
- Ghi chú độc lập: Home của Unassigned vẫn hiển thị aggregate TEST và stale context; lỗi đã được ghi tại `GAP-P4-RBAC-003`, không làm Fail riêng P6-COM-004 vì hai Phase 6 surface được bảo vệ đúng.
- Evidence: `https://rally-dev.qnsc.vn/release-tracking`, `https://rally-dev.qnsc.vn/reports`, các session role nêu trên.
- SRS evidence: Phase 6 `PHASE6_REPORTS_BUSINESS_AND_DATA_CONTRACT.md` authorization baseline và access header của bốn SRS Phase 6.
- Trạng thái: **Pass — BA confirmed**.

### 29 — P6-IB-003

- Expected: Story/Defect 3 points được Accepted trong ngày d phải đóng góp 0 trước d và 3 points từ d trở đi; Release vẫn accepted-equivalent.
- Dữ liệu kiểm soát: US-17, 3 points, `P56-AUDIT History Sprint`.
- Actual:
  - Snapshot 2026-08-17 hiện có Accepted Points = 0 và UI ghi rõ snapshot được record trước khi ngày đóng.
  - Chuyển US-17 sang Accepted làm Iteration Status đổi thành 100%, 3/3 points và Flow State/Schedule State = Accepted.
  - Burndown vẫn giữ snapshot 0 đúng frozen-history behavior; snapshot cũ không được tính lại từ live state.
  - Các Iteration cũ không có daily snapshot để đối chiếu trước/sau acceptedDate.
  - US-17 đã được restore về Idea sau test.
- Kết luận: chưa có bằng chứng finalized snapshot được tạo sau Accepted nên không thể xác nhận cumulative acceptedDate behavior; cũng chưa có bằng chứng để báo Fail.
- Điều kiện retest: giữ một Story/Defect Accepted qua lần chạy snapshot cuối ngày; xác nhận ngày trước acceptedDate = 0, từ acceptedDate trở đi = Plan Estimate; đổi Accepted sang Release và xác nhận points không mất.
- Evidence: `/reports` Iteration Burndown và `/iteration-status` của Project TEST.
- SRS evidence: `04_Developement_tracking/Phase 6/02_Iteration_Burndown/SRS.md`, `IB-BR-02`, acceptance example #2.
- Trạng thái: **Blocked — BA confirmed**; thiếu post-Accept finalized snapshot.

### 30 — P6-IB-004

- Expected: sau khi snapshot ngày D đã finalized với Accepted Points, reopen Work Item làm snapshot ngày D+1 loại points nhưng snapshot ngày D giữ nguyên.
- Precondition bắt buộc:
  1. Snapshot ngày D đã finalized và chứa Accepted Points.
  2. Work Item được reopen sau thời điểm finalized.
  3. Có snapshot ngày D+1 sau reopen để đối chiếu.
- Actual: DevInt hiện chỉ có snapshot 2026-08-17 được record trước khi US-17 Accepted và đang giữ 0 points; không có snapshot finalized chứa Accepted Points để làm mốc D.
- Kết luận: reopen live state lúc này không thể chứng minh frozen historical behavior; không có bằng chứng Fail.
- Điều kiện retest: hoàn tất P6-IB-003 qua EOD snapshot, sau đó reopen item, chờ snapshot kế tiếp và so sánh D/D+1.
- SRS evidence: `04_Developement_tracking/Phase 6/02_Iteration_Burndown/SRS.md`, `IB-BR-02`, historical semantics và acceptance examples.
- Trạng thái: **Blocked — BA confirmed**; phụ thuộc cùng snapshot chain với P6-IB-003.

### 31 — P6-VEL-004

- Expected:
  - Velocity được tính lại từ assignment hiện tại của Story/Defect.
  - Chuyển item ra khỏi completed Iteration phải loại points khỏi bar ở lần query kế tiếp.
  - Chuyển item vào completed Iteration phải cộng points vào bar ở lần query kế tiếp.
  - UI chọn Iteration phải cho phép chọn cả Iteration đã hoàn thành để thực hiện đủ hai chiều nghiệp vụ.
- Dữ liệu kiểm soát:
  - `P56-AUDIT Carryover Sprint` ban đầu có `8 Not Accepted` points.
  - `US-2` có Plan Estimate `5` points và đang thuộc Carryover Sprint.
- Actual:
  - Chuyển US-2 ra Backlog thành công.
  - Query lại Velocity: Carryover Sprint giảm từ `8` xuống `3 Not Accepted`; phép tính current-assignment hoạt động đúng ở chiều move-out.
  - Khi mở Iteration selector của US-2 tại Backlog, dropdown chỉ có `--` và `P56-AUDIT Empty Sprint`; không có `P56-AUDIT Carryover Sprint` hoặc các completed Iteration.
  - Vì UI không cho chọn completed Iteration nên không thể chạy nhánh move-in và không thể restore US-2 về Carryover Sprint qua UI.
- DEV/AI fix direction:
  1. Iteration selector của Work Item phải trả về cả Iteration đang mở và Iteration đã hoàn thành thuộc đúng Project/Team scope; không lọc bỏ chỉ vì end date đã qua hoặc status đã hoàn thành.
  2. Vẫn giữ lựa chọn `--`/Backlog để bỏ assignment.
  3. Khi chọn completed Iteration, persist `iterationId` giống Iteration bình thường; không tự đổi Schedule State/Flow State của Work Item.
  4. Sau save, Iteration Status, Work Item Detail và Backlog phải hiển thị cùng assignment; Velocity query kế tiếp phải cộng item vào đúng bar.
  5. Không mở Iteration ngoài Project scope hoặc Team scope hợp lệ.
- Acceptance để retest:
  - Chọn được completed Iteration trong dropdown của Work Item.
  - Gán US-2 5 points vào Carryover Sprint làm bar `Not Accepted` tăng `3 → 8` ở query kế tiếp.
  - Bỏ US-2 về Backlog làm bar giảm `8 → 3`.
  - Reload giữ đúng assignment; Schedule State và Flow State không bị thay đổi ngoài ý muốn.
- Evidence: `https://rally-dev.qnsc.vn/iteration-status`, `/backlog`, `/reports`.
- SRS evidence: `04_Developement_tracking/Phase 6/03_Velocity_Chart/SRS.md`, §4 và Acceptance example #5; `PHASE6_REPORTS_BUSINESS_AND_DATA_CONTRACT.md`, §5.2.
- Trạng thái: **Partial — BA confirmed**; Velocity move-out/recalculation Pass, completed Iteration selector cần DEV sửa.

### 32 — P6-VEL-008

- Expected: Story/Defect đang ở `Accepted` hoặc `Release` nhưng thiếu `acceptedDate` phải được báo là data-quality/unavailable; Velocity không được tự đoán During hoặc After.
- Retest trên DevInt:
  - US-1 được chuyển trực tiếp từ `Idea` sang `Release` để thử tạo precondition.
  - Velocity phân loại 3 points của US-1 vào `Accepted After`.
  - Source implementation xác nhận database trigger tự stamp `acceptedDate` khi Work Item đi vào accepted-equivalent family, kể cả chuyển trực tiếp sang Release.
  - Vì normal UI flow không thể tạo record `Accepted/Release + acceptedDate = null`, DevInt hiện không có controlled invalid row để quan sát warning.
  - US-1 đã được restore về `Idea`; thao tác reopen làm current `acceptedDate` được clear theo rule.
- Kết luận: không có bằng chứng Fail; live DevInt test bị chặn bởi precondition được hệ thống chủ động ngăn chặn.
- DEV verification required:
  1. Trên localhost/test database, tạo một Work Item thuộc completed Iteration, có Plan Estimate > 0 và Schedule State `Accepted` hoặc `Release`.
  2. Sau khi trigger stamp ngày, dùng controlled test fixture/raw test setup để đặt riêng `acceptedDate = null`; không thực hiện trên DevInt shared data.
  3. Query Velocity và xác nhận points không vào During, After hoặc Not Accepted.
  4. UI phải hiển thị data-quality/unavailable warning và số item bị unclassified; averages/trend không được dùng points đó.
  5. Chạy backfill từ auditable history, query lại và xác nhận item vào đúng During/After theo timestamp đã khôi phục.
- SRS evidence: `04_Developement_tracking/Phase 6/03_Velocity_Chart/SRS.md`, §3, §4; `PHASE6_REPORTS_BUSINESS_AND_DATA_CONTRACT.md`, §6 rules #4 và #7.
- Source evidence hỗ trợ, không thay thế live verification: `db/migrations/0087_phase6_accepted_date.sql`, reporting domain `velocity.ts`, Velocity UI warning và automated tests trong repo Rally.
- Trạng thái: **Blocked — BA confirmed; chuyển DEV chạy controlled-data verification**.
