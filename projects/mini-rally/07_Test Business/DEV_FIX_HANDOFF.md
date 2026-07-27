# DevInt — Bản dặn dò sửa lỗi cho Dev (Business E2E, 2026-07-20)

**Nguồn:** phiên Business E2E chạy trực tiếp trên `https://rally-dev.qnsc.vn/` (context `NXP / All Teams`, account `hieuvbm@qnsc.vn`).
**Chuẩn nghiệm thu:** `04_Developement_tracking/RECONCILED_SOURCE_OF_TRUTH.md` (BR-*), các SRS Phase 1–3, và **mockup** `03_Mockup Design`. Khi SRS cũ mâu thuẫn quyết định BA mới nhất → **theo BA mới nhất**.
**Chi tiết đầy đủ:** `BUSINESS_E2E_TEST_TRACKER.xlsx` (sheet *Gap Log*), và 2 note `notes/E2E-08-10-TASK-PROPAGATION.md`, `notes/E2E-11-13-STATUS-ITERATION.md`.

> Quy ước: mỗi mục ghi **Hiện tại (sai)** → **Cần sửa (đúng business)** + tham chiếu. Sửa xong item nào, để BA retest theo checklist cuối file.

---

## 0. Thứ tự ưu tiên (P0 làm trước)

**P0 (chặn nghiệm thu):** DEV-006, DEV-007, DEV-009, DEV-011, DEV-012, DEV-013, DEV-014, DEV-017, DEV-018, DEV-020, DOC-002
**P1:** DEV-002, DEV-004, DEV-005, DEV-008, DEV-015, DEV-016, DEV-019, DEV-021, DEV-022
**P2:** DEV-003 (test data)

Gợi ý gom theo module để sửa 1 lần: **(A) Work Item State**, **(B) Task**, **(C) Iteration**, **(D) Release/Milestone**, **(E) Backlog create**, **(F) Docs/Test data**.

---

## A. Work Item — Schedule / Flow State

### DEV-020 · P0 · Catalog State + mirror 2 chiều (Work Item Detail)
- **Hiện tại:** Schedule State đủ 6 nút nhưng ghi **"In Progress"** (sai chính tả). **Flow State dropdown chỉ 4 giá trị** (`Defined/In Progress/Completed/Accepted`) — **thiếu `Idea` và `Release`**. Đổi Schedule **không** cập nhật Flow và ngược lại (hai field độc lập hoàn toàn).
- **Cần sửa:** Cả Schedule State và Flow State dùng **đúng 6 giá trị** `Idea / Defined / In-Progress / Completed / Accepted / Release` (đúng chính tả `In-Progress`). **Schedule State hiển thị dạng 6 ô**, **Flow State là dropdown**. Hai field **mirror 2 chiều**: đổi bên nào thì bên kia đổi theo, lưu atomic. **Thiết kế đúng như mockup/SRS A3.**
- **Ref:** BR-WI-01; WIC-FR-012..013; WID-FR-012; mockup.

### DEV-009 · P0 · Control State trên Backlog
- **Hiện tại:** Backlog chỉ hiện 1 cột **Schedule State** dạng 6 nút; **không có Flow State**.
- **Cần sửa:** Trên Backlog, **Schedule State = control 6 nút**, thêm **Flow State = dropdown**; đúng catalog 6 giá trị; cập nhật cả hai atomic theo cả 2 chiều (đồng bộ DEV-020).
- **Ref:** BR-WI-01; reconciliation DevInt alignment.

### DEV-017 · P0 · Auto-complete phải mirror cả Schedule + Flow
- **Hiện tại:** khi tất cả child Task Completed, parent chỉ đổi **Schedule State → Completed**; **Flow State giữ nguyên** (không mirror).
- **Cần sửa:** auto roll-up đổi **cả** Schedule State **và** Flow State sang `Completed`; giữ mirror 2 chiều như DEV-020.
- **Ref:** BR-WI-01; TASK-FR-016.

### DEV-018 · P0 · Reopen Task phải kéo parent về In-Progress
- **Hiện tại:** reopen 1 child Task (Completed → In Progress) **không** đổi parent; parent giữ `Completed`. Roll-up chỉ chạy 1 chiều.
- **Cần sửa:** reopen bất kỳ child Task ⇒ parent tự về **In-Progress** (cả Schedule + Flow); vẫn cho user chỉnh tay sau đó.
- **Ref:** BR-TASK-02; TASK-FR-016.

---

## B. Task Management

### DEV-013 · P0 · Estimate = To Do + Actuals (derived, read-only)
- **Hiện tại:** modal Create Task có ô **Estimate nhập tay độc lập**, không có To Do/Actuals; roll-up sai (VD Estimate 4 ≠ To Do 3 + Actual 2 = 5).
- **Cần sửa:** **Estimate read-only, luôn = To Do + Actuals** ở mọi nơi (Task Detail, dòng dashboard, dòng Totals, modal Create). Modal thu To Do/Actuals (hoặc khởi tạo 0) thay cho Estimate.
- **Ref:** BR-TIME-01; DOC-002; mockup.

### DEV-015 · P1 · Mô hình Actual + không auto-zero To Do
- **Hiện tại:** Actual nhập qua danh sách **"Time Logs" (cộng dồn entry)**; hoàn tất Task **tự đưa To Do về 0**.
- **Cần sửa (BA chốt):** **Actual là ô nhập tay như mockup** (bỏ mô hình Time Logs entry-sum). Hoàn tất Task **không** được tự động zero To Do.
- **Ref:** BR-TIME-01; mockup; Phase 1 Time SRS (đã reconcile).

### DEV-012 · P0 · Badge đếm Task
- **Hiện tại:** tab **"Tasks 0"** dù đã có dòng Task; tile TASKS trên Iteration detail cũng = 0 dù có child Task.
- **Cần sửa:** badge/tile đếm **cùng nguồn** với bảng Task + roll-up; refresh ngay sau create/delete.
- **Ref:** TASK-FR (count); metric assertions.

### DEV-014 · P0 · Inline edit trên Task Dashboard
- **Hiện tại:** dòng Task chỉ hiển thị text tĩnh, **không sửa inline** được (chỉ có checkbox + link ID).
- **Cần sửa:** inline edit **Name, State, Owner, To Do, Actuals**; Estimate read-only derived `Estimate = To Do + Actuals`; cập nhật Totals + parent ngay.
- **Ref:** TASK-FR-013/014; mockup.

### DEV-016 · P1 · Task Detail — một Task State duy nhất
- **Hiện tại:** Task Detail hiện **Schedule State + Flow State** (giống Story/Defect).
- **Cần sửa:** Task chỉ có **một Task State** = `Defined / In-Progress / Completed`. Bỏ Schedule/Flow trên Task. **Đúng như mockup.**
- **Ref:** BR-TASK-01; mockup.

---

## C. Iteration

### DEV-021 · P1 · Iteration tự Accept
- **Hiện tại:** khi tất cả US/DE trong iteration = Accepted, iteration **vẫn `Planning`** (không tự chuyển). Metric ACCEPTED% đã đúng.
- **Cần sửa:** iteration non-empty có tất cả US/DE `Accepted` ⇒ **tự chuyển State → `Accepted`**, và **vẫn cho sửa tay** (không auto-reverse). Đúng SRS/mockup.
- **Ref:** BR-IT-02.

### DEV-022 · P1 · Cho phép nhiều iteration Committed
- **Hiện tại:** commit iteration thứ 2 bị chặn *"Another iteration is already committed for this project"* (ép mỗi project 1 Committed).
- **Cần sửa (BA chốt):** cho phép **nhiều iteration `Committed`** cùng project; bỏ ràng buộc single-committed.
- **Ref:** BR-IT-01/03 (không có ràng buộc single-committed).

### DEV-019 · P1 · Metric Iteration Status
- **Hiện tại:** Iteration Status cho US-9 hiện **Tasks 100% / 0 Active Tasks** (tính theo To Do) trong khi Team Status cho **50%** (theo State) — 2 màn hình lệch nhau.
- **Cần sửa (BA chốt):**
  - **Planned Velocity:** chưa định nghĩa → **để Phase 5**.
  - **Iteration End:** đếm ngày (đang đúng, giữ nguyên).
  - **Accepted:** = % US/DE ở trạng thái `Accepted` (đang đúng).
  - **Task active-count / Task %:** tính theo **Task State** (task chưa Completed), **nhất quán** giữa Iteration Status và Team Status (không tính theo To Do).
- **Ref:** BR-TASK-01; metric assertions.

---

## D. Release / Milestone

### DEV-011 · P0 · Work Item Detail thiếu field Milestone
- **Hiện tại:** Work Item Detail **không có** control Milestone.
- **Cần sửa:** thêm **Milestone multi-select**; khi chưa chọn Release → hiện Milestone hợp lệ trong project; khi có Release → option add-new lọc theo Release nhưng **giữ** các Milestone đã chọn; lưu độc lập.
- **Ref:** reconciliation C01; P3 Release/Milestone SRS.

### DEV-006 · P0 · Milestone không link được Release
- **Hiện tại:** Create/Edit Milestone hiện *"No releases available"* dù Release A/B tồn tại trong NXP.
- **Cần sửa:** nạp Release cùng project vào multi-select của Milestone; lưu quan hệ many-to-many; **derive date** Start = MIN(start Release), End = MAX(end Release), read-only, recalculate khi add/remove.
- **Ref:** BR-MS-01/02; P3-MS-FR-011..013.

### DEV-004 · P1 · Điều hướng Release
- **Hiện tại:** Release là mục top-level `/releases`.
- **Cần sửa:** đưa Release Management vào **Plan > Timeboxes**; bỏ mục top-level. (`Portfolio > Release Planning` là Phase 5.)
- **Ref:** reconciliation §4.

### DEV-005 · P1 · Bỏ cột Progress ở Release (Phase 3)
- **Hiện tại:** list Release có cột **Progress**.
- **Cần sửa:** ẩn/bỏ Progress ở Release Management hiện tại; Release Progress thuộc **Phase 5** `Portfolio > Release Planning`.
- **Ref:** reconciliation §7 (deferred work).

---

## E. Backlog Create / Quick-create

### DEV-007 · P0 · Tạo Story từ Backlog bị lỗi
- **Hiện tại:** `No team` → *"An unexpected error occurred"*; `Team Alpha` → *"Team is not linked to this project"*; không tạo được record nào.
- **Cần sửa:** có đường tạo hợp lệ tạo **đúng 1 Story** trong project hiện tại; chặn Team không hợp lệ; trả **validation theo field** (bỏ lỗi chung chung).
- **Ref:** P1 Work Item Create FR-001..013; BR-ID-01.

### DEV-008 · P1 · Quick-create thiếu Project + lọc Team
- **Hiện tại:** form quick-create **thiếu Project**; hiện `No team` và `Team Alpha` (không thuộc NXP).
- **Cần sửa:** thêm **Project** (default context hiện tại); **Team optional**: blank = Project backlog, selected Team = Team backlog; Team options lọc theo Project; căn requiredness/option theo mockup (Iteration/Release không nằm trong quick-create).
- **Ref:** P1 Work Item Create; mockup.

### DEV-002 · P1 · Quick-create Iteration thiếu Type + Project
- **Hiện tại:** form New Iteration chỉ có Team; thiếu **Type** và **Project**.
- **Cần sửa:** thêm Type + Project (Project inherit context); giữ Team testable riêng.
- **Ref:** P2 Iterations.

---

## F. Docs / Test data

### DOC-002 · P0 · Reconcile SRS thời gian Task
- **Cần sửa:** triển khai theo `04_Developement_tracking/Phase 1/04_Task_Management/SRS.md` và `05_Time_Tracking/SRS.md` đã cập nhật A3: **Estimate = To Do + Actuals** (derived, read-only), **Actual nhập tay**, Completed không tự zero To Do.

### DEV-003 · P2 · Test data Team
- **Cần sửa:** cung cấp Team **link đúng** vào project NXP để test lại luồng Team-scoped (hiện `Team Alpha` không link NXP nên nhiều checkpoint phải dùng `No team`).

---

## Checklist retest (sau khi Dev fix)

Ưu tiên nhóm P0, retest theo E2E gốc:

- [ ] **DEV-020/009/017/018** → retest **E2E-11** (catalog 6 giá trị + mirror 2 chiều; auto-complete + reopen mirror).
- [ ] **DEV-012/013/014/015/016** → retest **E2E-07/08** (Task count, Estimate derived, inline edit, Actual manual, single Task State).
- [ ] **DEV-021/022/019** → retest **E2E-12/13** + metric Iteration/Team Status.
- [ ] **DEV-006/011** → retest **E2E-03/06** (Milestone link + Work Item Milestone field) — hiện **Blocked**, chỉ test được sau fix.
- [ ] **DEV-007/008** → retest **E2E-04** (tạo Story) — hiện **Blocked**.
- [ ] **DEV-004/005** → verify điều hướng Release + bỏ Progress.

> Lưu ý dữ liệu test hiện còn sống trên DevInt (prefix `BA-E2E-20260720`): `US-9` + `TA-6`/`TA-7`, và `US-7`/`US-9` đang Schedule `Accepted`, Sprint 26.2 `Planning`. Giữ cho BA soi; **đừng xoá khi chưa được duyệt.**
