# DevInt Retest Plan — new build verification (Phase 0–2 confirmed gaps)

**Created:** 2026-07-23 · **Owner:** BA + Claude · **Environment:** `https://rally-dev.qnsc.vn/` (Microsoft SSO, `hieuvbm@qnsc.vn`)

> **Historical plan status 2026-07-24:** This document remains the Phase 0–2 retest plan. Phase 3 and the first Phase 4 audit have since been executed; their current trace is in `DEVINT_PHASE_0_4_AUDIT_TRACKER.xlsx`. SRS/mockup reconciliation starts only after the applicable BA confirmation gate.

## 1. Mục tiêu (Objective)

Dev đã có **build mới**. Trước khi audit các checkpoint chưa chạy (Phase 2 còn lại + Phase 3), phải **xác nhận lại từng gap đã confirm** xem **đã fix chưa hay vẫn còn**, để biết cái gì đã sạch. Không mở gap mới ngoài scope trừ khi phát hiện lệch thật.

## 2. Phạm vi (Scope)

Retest các gap **BA đã confirm hướng sửa** (Dev Status = Not Started) trên 13 checkpoint Confirmed, **theo thứ tự Phase 0 → Phase 1 → P2-IS-03**. Bỏ qua các gap đã đóng dạng *Match Confirmed / No Change / Invalidated / Future Backlog / Accepted As-Is* (chỉ điểm nhanh xem có regression không). Các gap *Not Tested* (thiếu Team data / Invite / role catalog) vẫn giữ Blocked.

**Nhóm retest (ước ~40 gap):**
| Cụm | Checkpoint | Gap chính cần xác nhận |
|---|---|---|
| A | P0-SHELL-01 | bỏ Releases top-level; Portfolio dropdown; bỏ Plan>Milestones; đổi "Iteration"→"Iteration Status" |
| B | P0-WS-01 | "Organization"→"Workspace" |
| C | P0-PRJ-01/02 | Manage Projects/Owner; Start Date column; Name 2-255; Key 2-10; menu Edit dòng cuối bị cắt |
| D | P1-USER-01 | columns Email/Teams; search/filter; Edit User; admin trùng |
| E | P1-BL-01/02 | Priority filter; pagination total; Flow+Schedule State; inline Title autosave |
| F | P1-CREATE-01/02 | Project bắt buộc; bỏ "No team"; Owner default; Create with details |
| G | P1-WID-01 | Project field; multi Release/Milestone; catalog 6 giá trị + In-Progress; **mirror 2 chiều** |
| H | P1-TASK-01 / TIME-01 / TASK-02 | badge count; inline edit; Task Detail; Estimate=To Do+Actuals; complete/reopen roll-up |
| I | P2-IS-03 | inline Iteration hiển thị cũ; first-load empty state |

## 3. Phân loại kết quả (mỗi gap)

- ✅ **Fixed** — hành vi giờ đúng business đã confirm.
- 🟡 **Partial** — đúng một phần, còn thiếu.
- ❌ **Still Gap** — vẫn như cũ.
- ⚪ **Not Retestable** — còn chặn (thiếu Team data / chưa có surface / phụ thuộc gap khác).
- 🔵 **New Divergence** — hành vi khác **cả** mockup lẫn SRS, chưa có trong gap cũ → dừng hỏi BA.

## 4. Cách Claude tự chạy (Self-run)

Với mỗi gap: **navigate → quan sát (read_page / screenshot / network) → so với Expected Business trong Gap Log → phân loại → ghi 1 dòng kết quả + con trỏ evidence.** Claude chạy liên tục hết một **cụm/checkpoint** rồi mới dừng báo cáo (không hỏi giữa từng gap).

**Quy tắc mutation & an toàn:**
- Test cần tạo/sửa: dùng tiền tố **`DEVINT-AUDIT`**, thao tác **không phá huỷ**, **hoàn nguyên** sau khi test.
- **Không** đụng: xoá cứng, đổi role, đổi workspace settings, đóng/accept sprint thật — nếu cần thì dừng hỏi.
- Không lưu password/token vào tài liệu.

## 5. Điểm BA confirm (Confirmation gates)

Claude tự chạy, chỉ **dừng xin xác nhận** tại 3 cửa:

- **Gate 1 — cuối mỗi Phase (chính, BA đã chọn):** Claude gom kết quả **cả Phase** thành 1 bảng (gap → Fixed/Partial/Still/…) + đề xuất đóng cái Fixed, giữ cái Still. **BA xác nhận 1 lần cho cả Phase**. → ~3 lần confirm (Phase 0, Phase 1, P2-IS-03).
- **Gate 2 — khi gặp 🔵 New Divergence:** dừng ngay, trình Expected vs Actual, BA quyết log gap mới hay không.
- **Gate 3 — trước thao tác rủi ro/khó hoàn tác:** dừng hỏi trước khi làm.

Giữa các cửa: Claude tự navigate/quan sát/tạo-sửa an toàn-rồi-hoàn-nguyên, **không hỏi vặt**.

## 6. Cập nhật tracker (sau khi BA confirm mỗi checkpoint)

Trong `DEVINT_PHASE_0_4_AUDIT_TRACKER.xlsx` (Gap Log):
- **Không ghi đè lịch sử gap.** Cập nhật cột **Retest (O)** = `Passed` / `Still Open` / `Partial` (+ ngày 2026-07-23) và **Dev Status (N)** = `Fixed (retest)` / `Still Open`.
- Checkpoint nào mọi gap Fixed → Audit Status có thể chuyển `Confirmed → Retest Passed`.
- Cập nhật ô Live summary (Retest passed) ở sheet Audit Control.

## 7. Nhịp báo cáo

Báo cáo **theo checkpoint** (hoặc gộp Phase 0 nếu nhanh): bảng kết quả gọn → BA confirm → Claude update tracker → sang checkpoint tiếp. Cuối cùng: tổng kết Phase 0–2 đã retest, rồi mới bàn tới Phase 2 còn lại + Phase 3.

## 8. Ngoài phạm vi lần này
Phase 2 (BL-01, IT-01/02, IS-01/02/04) và toàn bộ Phase 3 vẫn **chưa audit** — chỉ chạy **sau khi** retest xong và BA chốt.
