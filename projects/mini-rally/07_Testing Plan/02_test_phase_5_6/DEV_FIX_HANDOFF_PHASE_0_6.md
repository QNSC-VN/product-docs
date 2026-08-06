# DEV Fix Handoff — DevInt Audit Phase 0–6

**Ngày audit:** 2026-08-06
**Môi trường:** `https://rally-dev.qnsc.vn/`
**Nguồn kết quả chính:** `PHASE_0_6_AUDIT_TRACKER.xlsx`
**Log kiểm tra:** `../Codex_audit_06_tracker.md`

## 1. Phạm vi bàn giao

- Tổng số scenario: **192**.
- DEV cần xử lý: **24 Fail**.
- Không tự coi **Partial**, **Blocked** hoặc **Not Run** là bug. Các trạng thái này cần thêm dữ liệu, account hoặc BA xác nhận nhánh còn lại.
- Chỉ xử lý FE và business behavior theo SRS/mockup đã duyệt; không mở rộng sang schema, DB hoặc hạ tầng.

## 2. Thứ tự ưu tiên

| Priority | Số lỗi | Cách xử lý |
|---|---:|---|
| P0 | 9 | Sửa trước; đang chặn luồng chính hoặc làm sai dữ liệu/trạng thái. |
| P1 | 7 | Sửa sau P0; ảnh hưởng thao tác và tính nhất quán. |
| P2 | 7 | Lệch UI/contract đã duyệt. |
| P3 | 1 | Chuẩn hóa label. |

## 3. Danh sách lỗi cần sửa

### Phase 0–4 carryover — 16 lỗi

| ID | Priority | Hiện tại | DEV cần sửa |
|---|---:|---|---|
| `GAP-P1-BL-001` | P1 | Clear Backlog search không ổn định; dữ liệu còn bị lọc đến khi reload. | Clear search phải cập nhật danh sách ngay, không cần reload. |
| `GAP-P1-BL-002` | P1 | Priority `None` vẫn giữ cả Story và Defect. | Priority filter chỉ áp dụng Defect; Story hiển thị dấu gạch và không thuộc `None`. |
| `GAP-P1-CREATE-006` | P1 | Owner mặc định Unassigned; sau khi Hieu được thêm vào Pegasus, Settings đã có Hieu nhưng Owner của US-1 vẫn chỉ có No Entry và Anh. | Giữ rule default đã duyệt; lấy allowed Owner từ membership hiện tại và refresh/invalidate cache sau khi add/remove member. |
| `GAP-P2-IT-001` | P1 | Iteration list thiếu Project và Task Estimate. | Bổ sung đúng hai cột đã duyệt. |
| `GAP-P2-IS-003` | P2 | Iteration Status thiếu cột Type. | Bổ sung cột Type. |
| `GAP-P2-IS-004` | P2 | Iteration Status có cột Defects ngoài scope. | Xóa cột Defects. |
| `GAP-P3-TS-001` | P2 | Team Status còn local Search tasks. | Xóa local search. |
| `GAP-P3-TS-002` | P2 | Team Status còn Filters, Show Fields và rows-per-page. | Xóa các control ngoài scope. |
| `GAP-P3-TS-003` | P2 | Thiếu breadcrumb Project > Track > Team Status. | Bổ sung breadcrumb đúng hierarchy. |
| `GAP-P3-TS-005` | P2 | Task State là segmented control. | Dùng inline dropdown `Defined / In-Progress / Completed`. |
| `GAP-P3-TS-007` | P3 | Label Task State bị viết tắt hoặc dùng câu lệnh hành động. | Dùng chính xác ba catalog label. |
| `GAP-P3-TS-008` | P0 | User từng xuất hiện ở Team Status khi chưa thuộc Team; sau khi được add vào Team lại chưa xuất hiện trong Owner dropdown. | Dùng một nguồn Team membership hiện tại cho Team Status và mọi Owner selector; đồng bộ ngay sau add/remove. Cách xử lý Task đang thuộc member bị remove vẫn `Pending BA`. |
| `GAP-P4-SET-002` | P0 | User Management thiếu Phone và thừa Teams. | Đồng nhất column/field theo SRS đã duyệt. |
| `GAP-P4-SET-003` | P1 | Audit Log dùng technical event/ID, không có business detail trước/sau. | Hiển thị business-readable event và before/after. |
| `GAP-P4-SET-004` | P1 | Deactive Team lưu ngay, không có confirmation theo đối tượng. | Bổ sung confirmation trước destructive status action. |
| `GAP-P4-SET-005` | P2 | Notification Preferences vẫn còn trong Settings. | Xóa khỏi scope/navigation hiện tại. |

### Phase 5 — 4 lỗi P0

| ID | Hiện tại | DEV cần sửa |
|---|---|---|
| `P5-CP-005` | Draft Team Capacity chỉ là text; chỉ Forecast mới ghi được Capacity. | Cho phép sửa Capacity thủ công khi Draft; không thay đổi allocation hoặc live Feature estimate. |
| `P5-CP-031` | Thứ tự metrics là Dependencies, Rollup, Estimated, Complete. | Đổi thành Dependencies, Complete, Rollup, Estimated. |
| `P5-CP-032` | Chọn Planned Team làm counters đổi nhưng selector vẫn `Not assigned`, kể cả reload. | Persist và render Planned Team từ cùng allocation ledger. |
| `P5-CP-034` | Không thể Unassign vì Planned Team không render trạng thái đã gán. | Sửa `P5-CP-032`, sau đó Unassign phải xóa Team nhưng giữ Feature trong plan. |

### Phase 6 — 4 lỗi

| ID | Priority | Hiện tại | DEV cần sửa |
|---|---:|---|---|
| `P6-COM-006` | P1 | Reports và Release Tracking reset view/filter sau reload. | Persist Reports Type/window và Release Tracking Chart Unit/bucket. |
| `P6-VEL-006` | P0 | Velocity mặc định `Last 10 sprints`. | Mặc định `Last 5 sprints` và giữ lựa chọn của user. |
| `P6-E2E-001` | P0 | `Create with details` có thể tạo ngầm nhiều Work Item nhưng modal vẫn mở, không có xác nhận. | Mỗi submission chỉ tạo đúng một record; chống double-submit và đóng/chuyển màn hình sau thành công. |
| `P6-E2E-002` | P0 | State không persist/mirror ổn định; reload về Idea và báo cáo không tính Accepted. | Persist atomic và mirror hai chiều Schedule State/Flow State trước khi refresh report totals. |

## 4. Retest gate

1. DEV ghi commit/PR và Scenario ID cho từng fix.
2. Không đổi Expected Result trong workbook để làm case Pass.
3. Sau deploy, BA retest đúng row trong `PHASE_0_6_AUDIT_TRACKER.xlsx`.
4. Chỉ đổi `Fail` thành `Pass` khi toàn bộ Expected Result đúng và reload vẫn giữ kết quả.
5. Những case cần data/account vẫn giữ nguyên `Partial`, `Blocked` hoặc `Not Run` đến khi đủ điều kiện.
