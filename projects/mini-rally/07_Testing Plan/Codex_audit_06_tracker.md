# Codex Audit 0-6 Tracker
> **Historical execution log:** Results before 2026-08-10 used the former Project Admin/Project Member model. They remain evidence of what was tested at that time, but do not certify the current per-Project `Admin`/`Editor`/`Viewer`/`No Access` baseline. Re-run current access scenarios before authorization sign-off.

**Source:** `02_test_phase_5_6/PHASE_0_6_AUDIT_TRACKER.xlsx`  \n**Purpose:** Codex working log for audit execution. The Excel tracker remains the formal BA result source.

## Rules

1. Execute one Scenario ID at a time.
2. Record browser evidence and conclusion below the matching ID.
3. Do not create, edit, archive or delete deployed records unless BA has authorized that specific action.
4. Current access cases remain `Blocked` until WA and normal users with controlled per-Project `Admin`, `Editor`, `Viewer` and `No Access` assignments exist.

## Current Summary

- **Carryover P0-4:** 61 cases — Pass 8, Partial 5, Fail 16, Blocked 6, Not Run 17, Future Backlog 9
- **Phase 5 Scenarios (DevInt run 2026-08-06):** 78 cases — Pass 37, Partial 22, Fail 4, Blocked 7, Not Required 4, Not Run 4
- **Phase 6 Scenarios (DevInt run 2026-08-06):** 53 cases — Pass 22, Partial 6, Fail 4, Blocked 1, Not Run 20

## Carryover Test Queue

### GAP-P0-AUTH-001 — Authentication method

- **Phase / Module:** Phase 0 / Login
- **Priority:** P1
- **Current Status:** Not Run
- **Previous Result:** Still Open
- **Reference:** P0-AUTH-01
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đã sign out hoặc dùng phiên chưa đăng nhập.
- **Test Data:** Tài khoản test hợp lệ; email không có quyền hoặc credential sai khi case yêu cầu negative test; phiên browser đã sign out.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở /login; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Login, kiểm tra chức năng "Authentication method" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: DevInt /login offers only Sign in with Microsoft. It redirects to Microsoft Entra ID and returns to / Home after successful sign-in with hieuvbm@qnsc.vn..
8. Kiểm tra hướng sửa đã chốt: Recommended: make Microsoft SSO the authoritative internal-product rule; update Phase 0 SRS, login mockup and tests to SSO-first, and move local password/forgot/reset/change-password to Future Backlog. If local auth is still required, DevInt must add an explicit local sign-in path..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** Phase 0 SRS/mockup require local email + password, show/hide password, remember-me and generic invalid-credential handling; enterprise SSO/OAuth is explicitly out of scope.
- **Evidence:** evidence/retest_2026-07-24/P0-AUTH-01-login.png
- **Gap / Comment:** Current build retest 2026-07-24: DevInt login now shows Work email + Continue and Sign in with Microsoft, but still has no local password, show/hide password or remember-me flow required by Phase 0. Email Continue returned No access.
- **BA Confirmation:** Fix Direction Approved
- **Codex Audit Log:** Pending

### GAP-P0-SHELL-002 — Portfolio menu behavior (C2 reconciled)

- **Phase / Module:** Phase 0 / Global navigation
- **Priority:** P1
- **Current Status:** Pass — Not a Defect
- **Previous Result:** Still Open
- **Reference:** P0-SHELL-01
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
- **Test Data:** Dùng dữ liệu test riêng trong Project TEST. Nếu chưa có dữ liệu bắt buộc, ghi Blocked và nêu rõ dữ liệu còn thiếu.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở global header/navigation; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Global navigation, kiểm tra chức năng "Portfolio menu behavior" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: DevInt Portfolio dropdown contains Portfolio Items, Capacity Planning and Release Tracking.
8. Kiểm tra hướng sửa đã chốt: C2 xác nhận Release Planning thuộc Future Backlog và không cần hiện trong navigation hiện tại.
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** Portfolio là dropdown gồm Portfolio Items, Capacity Planning và Release Tracking. Release Planning thuộc Future Backlog, không phải mục navigation hiện hành.
- **Evidence:** evidence/retest_2026-07-24/P0-SHELL-01-dev.png; evidence/retest_2026-07-24/P0-SHELL-01-mock.png
- **Gap / Comment:** C2 BA confirmed 2026-08-06. Previous mismatch was caused by stale SRS/mockup; reclassified as Not a Defect.
- **BA Confirmation:** Confirmed C2 — Closed / Not a Defect
- **Codex Audit Log:** Reconciled 2026-08-09

### GAP-P0-SHELL-004 — Iteration Status label

- **Phase / Module:** Phase 0 / Global navigation
- **Priority:** P2
- **Current Status:** Not Run
- **Previous Result:** Still Open
- **Reference:** P0-SHELL-01
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
- **Test Data:** Project TEST; một Iteration active và một Iteration completed; Work Item/Task có thể nhận biết bằng prefix P56-AUDIT.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở global header/navigation; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Global navigation, kiểm tra chức năng "Iteration Status label" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: DevInt uses Track > Iteration and Track > Team Status. No Team Board item is present..
8. Kiểm tra hướng sửa đã chốt: Rename the DevInt Track child from Iteration to Iteration Status. Keep Team Status and continue excluding Team Board..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** Track dropdown uses the explicit child label Iteration Status; Team Status remains the other current Track child and Team Board is future backlog.
- **Evidence:** evidence/retest_2026-07-24/P0-SHELL-01-dev.png; evidence/retest_2026-07-24/P0-SHELL-01-mock.png
- **Gap / Comment:** Current build retest 2026-07-24: DevInt Track menu label remains Iteration; mockup requires Iteration Status.
- **BA Confirmation:** Fix Direction Approved
- **Codex Audit Log:** Pending

### GAP-P0-SHELL-006 — Functional search scope

- **Phase / Module:** Phase 0 / Global Search
- **Priority:** P2
- **Current Status:** Future Backlog
- **Previous Result:** Future Backlog
- **Reference:** P0-SHELL-03
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
- **Test Data:** Dùng dữ liệu test riêng trong Project TEST. Nếu chưa có dữ liệu bắt buộc, ghi Blocked và nêu rõ dữ liệu còn thiếu.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Global Search; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Global Search, kiểm tra chức năng "Functional search scope" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: DevInt renders the input and accepts text, but DE-1, Enter, and DEVINT-NO-MATCH-999 produced no overlay, results, empty state, or route change..
8. Kiểm tra hướng sửa đã chốt: Recommended: confirm contract-only Global Search for Phase 0-3, classify DevInt as matching current scope, and add functional Global Search to Future Backlog. Update this audit checkpoint expectation so it does not incorrectly require functional search now. If BA wants search in current scope, DevInt needs a result overlay/page, permission filtering, ID/title matching, empty/loading/error states, and identity-preserving result navigation..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** Phase 0 App Shell SRS SHELL-FR-009 allows Global Search to be contract-only; a later functional search should return permitted Work Items and preserve identity when opening a result.
- **Evidence:** evidence/retest_2026-07-24/P0-SHELL-01-dev.png
- **Gap / Comment:** Current build retest 2026-07-24: Global Search remains visual-only/non-functional, consistent with Future Backlog scope. BA confirmed 2026-07-24: move this item to Future Backlog; not part of current dev fix package.
- **BA Confirmation:** Future Backlog Approved
- **Codex Audit Log:** Pending

### GAP-P0-WS-002 — Company display-name editability

- **Phase / Module:** Phase 0 / Workspace identity
- **Priority:** P1
- **Current Status:** Future Backlog
- **Previous Result:** Future Backlog
- **Reference:** P0-WS-01
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
Chỉ dùng dữ liệu audit có prefix P56-AUDIT; không sửa dữ liệu nghiệp vụ có sẵn.
- **Test Data:** Dùng dữ liệu test riêng trong Project TEST. Nếu chưa có dữ liệu bắt buộc, ghi Blocked và nêu rõ dữ liệu còn thiếu.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Workspace identity; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Workspace identity, kiểm tra chức năng "Company display-name editability" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: DevInt Workspace Settings exposes an enabled required Workspace name textbox containing ACME Corp and a Save changes button..
8. Kiểm tra hướng sửa đã chốt: Keep DevInt Workspace name editing. Reconcile SRS and mockup to allow Workspace Admin rename, with required-name validation, authorization, save feedback and audit-event acceptance criteria..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** BA-confirmed rule: Workspace Admin may edit Workspace name, while users still cannot create, switch, archive or delete Workspaces in the MVP.
- **Evidence:** evidence/retest_2026-07-24/P0-WS-01-dev.png
- **Gap / Comment:** Current build retest 2026-07-24: Workspace name is editable; separate Company/Environment CRUD is not required by confirmed business scope. BA confirmed 2026-07-24: move this item to Future Backlog; not part of current dev fix package.
- **BA Confirmation:** Docs Change Approved / Future Backlog
- **Codex Audit Log:** Pending

### GAP-P0-PRJ-001 — Screen and owner labels

- **Phase / Module:** Phase 0 / Manage Projects
- **Priority:** P2
- **Current Status:** Future Backlog
- **Previous Result:** Future Backlog
- **Reference:** P0-PRJ-01
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
- **Test Data:** Dùng dữ liệu test riêng trong Project TEST. Nếu chưa có dữ liệu bắt buộc, ghi Blocked và nêu rõ dữ liệu còn thiếu.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Manage Projects; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Manage Projects, kiểm tra chức năng "Screen and owner labels" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: DevInt uses Projects and Lead..
8. Kiểm tra hướng sửa đã chốt: Rename the DevInt heading/breadcrumb entry to Manage Projects where it represents the administration screen, and rename Lead to Owner. Keep the underlying route and stable identity unchanged..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** The administrative list is named Manage Projects and the responsible person is consistently labeled Owner.
- **Evidence:** evidence/retest_2026-07-24/P0-PRJ-01-list.png
- **Gap / Comment:** Current build retest 2026-07-24: Projects heading remains as-is per BA acceptance; Owner label is consistent. BA confirmed 2026-07-24: move this item to Future Backlog; not part of current dev fix package.
- **BA Confirmation:** DevInt Accepted / Future Backlog
- **Codex Audit Log:** Pending

### GAP-P0-PRJ-004 — Project Name validation

- **Phase / Module:** Phase 0 / Create Project
- **Priority:** P1
- **Current Status:** Not Run
- **Previous Result:** Still Open
- **Reference:** P0-PRJ-02
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
Chỉ dùng dữ liệu audit có prefix P56-AUDIT; không sửa dữ liệu nghiệp vụ có sẵn.
- **Test Data:** Dùng dữ liệu test riêng trong Project TEST. Nếu chưa có dữ liệu bắt buộc, ghi Blocked và nêu rõ dữ liệu còn thiếu.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Create Project; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Create Project, kiểm tra chức năng "Project Name validation" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: DevInt enabled Create Project with a one-character name A when the key was valid; no one-character Project was submitted..
8. Kiểm tra hướng sửa đã chốt: Add client-side trim and 2-255 validation with inline feedback; keep Create disabled until valid and retain server-side validation..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** Project Name is required, trimmed and 2-255 characters before submission.
- **Evidence:** evidence/retest_2026-07-24/P0-PRJ-02-create-validation.png
- **Gap / Comment:** Current build retest 2026-07-24: Create Project becomes enabled with one-character Project Name A.
- **BA Confirmation:** Fix Direction Approved
- **Codex Audit Log:** Pending

### GAP-P0-PRJ-005 — Project Key rule

- **Phase / Module:** Phase 0 / Create Project
- **Priority:** P1
- **Current Status:** Not Run
- **Previous Result:** Partial (retest)
- **Reference:** P0-PRJ-02
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
Chỉ dùng dữ liệu audit có prefix P56-AUDIT; không sửa dữ liệu nghiệp vụ có sẵn.
- **Test Data:** Dùng dữ liệu test riêng trong Project TEST. Nếu chưa có dữ liệu bắt buộc, ghi Blocked và nêu rõ dữ liệu còn thiếu.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Create Project; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Create Project, kiểm tra chức năng "Project Key rule" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: DevInt uppercases and strips invalid characters, accepts digits, but truncates at 6 characters and displays helper text 2-6 uppercase letters. AUD719 was accepted and created..
8. Kiểm tra hướng sửa đã chốt: Align DevInt validation and helper copy to 2-10 uppercase alphanumeric characters, preserving immutable-after-create behavior..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** Current SRS defines immutable Project Key as 2-10 uppercase A-Z/0-9 characters.
- **Evidence:** evidence/retest_2026-07-24/P0-PRJ-02-create-validation.png
- **Gap / Comment:** Current build retest 2026-07-24: Functional key input accepts 10 uppercase alphanumeric characters, but helper text still incorrectly says 2–6 letters.
- **BA Confirmation:** Fix Direction Approved
- **Codex Audit Log:** Pending

### GAP-P0-PRJ-008 — Edit affordance for an archived Project

- **Phase / Module:** Phase 0 / Manage Projects
- **Priority:** P2
- **Current Status:** Future Backlog
- **Previous Result:** Future Backlog
- **Reference:** P0-PRJ-03
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
Có account và Project assignment tương ứng để kiểm tra quyền.
Chỉ dùng dữ liệu audit có prefix P56-AUDIT; không sửa dữ liệu nghiệp vụ có sẵn.
- **Test Data:** Dùng dữ liệu test riêng trong Project TEST. Nếu chưa có dữ liệu bắt buộc, ghi Blocked và nêu rõ dữ liệu còn thiếu.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Manage Projects; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Manage Projects, kiểm tra chức năng "Edit affordance for an archived Project" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: DevInt still exposes Edit project and opens a normal Edit Project form for AUD719. Save is correctly rejected by the backend with an archived/read-only message..
8. Kiểm tra hướng sửa đã chốt: Hide Edit for archived rows and expose only Restore. If an archived detail route is opened directly, present a read-only banner and disabled fields while retaining the existing backend guard..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** An archived Project is read-only. Its row exposes Restore, not an editable form or Save action.
- **Evidence:** evidence/retest_2026-07-24/P0-PRJ-01-list.png
- **Gap / Comment:** Current build retest 2026-07-24: Archived Project edit affordance remains accepted as-is; no retest mutation required. BA confirmed 2026-07-24: move this item to Future Backlog; not part of current dev fix package.
- **BA Confirmation:** Accepted As-Is / Future Backlog
- **Codex Audit Log:** Pending

### GAP-P0-PRJ-009 — Restore confirmation behavior

- **Phase / Module:** Phase 0 / Manage Projects
- **Priority:** P2
- **Current Status:** Future Backlog
- **Previous Result:** Future Backlog
- **Reference:** P0-PRJ-03
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
- **Test Data:** Dùng dữ liệu test riêng trong Project TEST. Nếu chưa có dữ liệu bắt buộc, ghi Blocked và nêu rõ dữ liệu còn thiếu.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Manage Projects; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Manage Projects, kiểm tra chức năng "Restore confirmation behavior" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: DevInt restores AUD719 immediately from the row action with no confirmation dialog; counts, Active filter and selector update correctly..
8. Kiểm tra hướng sửa đã chốt: Recommended: follow the mockup and require a simple Restore confirmation dialog. No typed key is needed because Restore is reversible..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** Restore behavior follows the BA-approved interaction contract before changing an archived Project back to Active.
- **Evidence:** evidence/retest_2026-07-24/P0-PRJ-01-list.png
- **Gap / Comment:** Current build retest 2026-07-24: Restore without confirmation remains accepted as-is. BA confirmed 2026-07-24: move this item to Future Backlog; not part of current dev fix package.
- **BA Confirmation:** Accepted As-Is / Future Backlog
- **Codex Audit Log:** Pending

### GAP-P0-PRJ-010 — Archive confirmation parity

- **Phase / Module:** Phase 0 / Manage Projects
- **Priority:** P2
- **Current Status:** Future Backlog
- **Previous Result:** Future Backlog
- **Reference:** P0-PRJ-03
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
Chỉ dùng dữ liệu audit có prefix P56-AUDIT; không sửa dữ liệu nghiệp vụ có sẵn.
- **Test Data:** Dùng dữ liệu test riêng trong Project TEST. Nếu chưa có dữ liệu bắt buộc, ghi Blocked và nêu rõ dữ liệu còn thiếu.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Manage Projects; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Manage Projects, kiểm tra chức năng "Archive confirmation parity" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: DevInt requires typing AUD719, lists the read-only/visibility effects, disables Archive until the key matches, and archives successfully..
8. Kiểm tra hướng sửa đã chốt: Keep the stronger DevInt typed-key Archive flow because it matches the SRS. Update the mockup to require the Project key and keep the same impact copy..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** Archive warns about impact and requires the Project key/name before the destructive state change.
- **Evidence:** evidence/retest_2026-07-24/P0-PRJ-01-list.png
- **Gap / Comment:** Current build retest 2026-07-24: Archive confirmation parity was already accepted; no destructive archive rerun needed. BA confirmed 2026-07-24: move this item to Future Backlog; not part of current dev fix package.
- **BA Confirmation:** DevInt Accepted / Future Backlog
- **Codex Audit Log:** Pending

### GAP-P1-USER-004 — Role catalog and matrix model

- **Phase / Module:** Phase 4 / Roles & Permissions
- **Priority:** P0
- **Current Status:** Blocked
- **Previous Result:** Still Open
- **Reference:** P4-RBAC-01
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
Có account và Project assignment tương ứng để kiểm tra quyền.
- **Test Data:** Dùng dữ liệu test riêng trong Project TEST. Nếu chưa có dữ liệu bắt buộc, ghi Blocked và nêu rõ dữ liệu còn thiếu.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Roles & Permissions; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Roles & Permissions, kiểm tra chức năng "Role catalog and matrix model" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: DevInt shows nine roles including Scrum Master, Product Owner, Developer, QA Engineer, Project Viewer and Workspace Member, plus entity/action pressed toggles..
8. Kiểm tra hướng sửa đã chốt: Replace the legacy/persona role surface with the approved three production roles and screen/action E/R/D/H matrix. Keep Workspace Admin column locked and allow Edit/Save only for PA/PM cells..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** Only workspace_admin, project_admin and project_member exist. Matrix is organized by Phase 0–4 screen/action with E/R/D/H states and explicit permission codes.
- **Current Result:** Chưa test được RBAC vì chưa có đủ account/role và Project assignment để kiểm tra quyền.
- **Evidence:** evidence/phase4_2026-07-24/P4-RBAC-dev.png; evidence/phase4_2026-07-24/P4-RBAC-mock.png
- **Gap / Comment:** BA confirmed 2026-07-24: DevInt must replace the legacy/persona role surface with the approved three production roles and screen/action E/R/D/H matrix.
RBAC blocked: cần Workspace Admin, Project Admin managed/unmanaged và/hoặc Project Member theo Preconditions.
- **BA Confirmation:** Pending RBAC test accounts
- **Codex Audit Log:** Pending

### GAP-P1-USER-006 — Invite User flow

- **Phase / Module:** Phase 1 / User Management
- **Priority:** P1
- **Current Status:** Not Run
- **Previous Result:** Deferred (not tested)
- **Reference:** P1-USER-01
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
Có account và Project assignment tương ứng để kiểm tra quyền.
- **Test Data:** Dùng dữ liệu test riêng trong Project TEST. Nếu chưa có dữ liệu bắt buộc, ghi Blocked và nêu rõ dữ liệu còn thiếu.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở User Management; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình User Management, kiểm tra chức năng "Invite User flow" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: Current build retest 2026-07-24: DevInt Invite member opens an Invite a new member dialog with Email address, Role, Send invitation and Cancel. Actual Send invitation was not executed to avoid an external invite side effect..
8. Kiểm tra hướng sửa đã chốt: Do not treat Invite UI as a current DevInt failure. BA to document the minimum invite contract; Dev to complete/own the detailed Invite flow design. Retest later for validation, delivery, invited status, resend/expire behavior if in scope..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** Workspace Admin can invite a User. Invite UI is allowed to follow Dev design as long as it supports business validation: email, role selection, and later invitation delivery/status behavior. Actual sending/delivery is deferred for later test.
- **Evidence:** evidence/retest_2026-07-24/P1-USER-01-invite.png
- **Gap / Comment:** BA confirmed 2026-07-24: Invite flow is dev-designed and not a strict mockup-match requirement. Current dialog exists, but send/delivery was intentionally not tested.
- **BA Confirmation:** Deferred / Test Later
- **Codex Audit Log:** Pending

### GAP-P1-BL-001 — Audit correction - filter execution

- **Phase / Module:** Phase 1 / Backlog
- **Priority:** P1
- **Current Status:** Not Run
- **Previous Result:** Still Open
- **Reference:** P1-BL-01
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
- **Test Data:** Project TEST; một User Story và một Defect; mỗi item có Tasks; dữ liệu dùng prefix P56-AUDIT.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Plan > Backlog; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Backlog, kiểm tra chức năng "Audit correction - filter execution" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: Current build retest 2026-07-24: Searching filters rows, but clearing the Backlog search sometimes leaves stale partial text (e.g. long audit title remains partially, or US- remains), keeping rows filtered until stronger repeated actions or page reload. This is now reopened by BA as a current gap..
8. Kiểm tra hướng sửa đã chốt: Dev must fix Backlog search clear behavior so Control+A/Delete, Backspace, clear button if present, blur and normal clearing all reset the value and restore the scoped list without reload. Add regression for long text and ID-prefix searches..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** Backlog search/filter clearing must behave like a normal user action: after text is cleared, the full scoped backlog list returns without requiring page reload. Search text must fully clear with standard keyboard interactions and not leave stale partial values.
- **Evidence:** evidence/retest_2026-07-24/P1-BL-01-list-states.png
- **Gap / Comment:** BA confirmed 2026-07-24: reopen this gap. Search clear must work reliably; page reload is not acceptable as the user recovery path.
- **BA Confirmation:** Fix Direction Approved
- **Codex Audit Log:** Pending

### GAP-P1-BL-002 — Priority filter availability

- **Phase / Module:** Phase 1 / Backlog
- **Priority:** P1
- **Current Status:** Not Run
- **Previous Result:** Still Open
- **Reference:** P1-BL-01
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
- **Test Data:** Project TEST; một User Story và một Defect; mỗi item có Tasks; dữ liệu dùng prefix P56-AUDIT.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Plan > Backlog; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Backlog, kiểm tra chức năng "Priority filter availability" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: DevInt displays Priority as a column but its Filters panel has no Priority filter..
8. Kiểm tra hướng sửa đã chốt: Add Priority to DevInt Filters with the approved Defect-only values and clear behavior. Include it in combined filter testing..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** Backlog supports Priority filtering for Defects using Low, Normal, High, Urgent and None; Story priority remains dash and is not treated as a Story value.
- **Evidence:** evidence/retest_2026-07-24/P1-BL-01-list-states.png
- **Gap / Comment:** Current build retest 2026-07-24: Filters expose Type, State, Owner, Release and Iteration; Priority filter is still absent.
- **BA Confirmation:** Fix Direction Approved
- **Codex Audit Log:** Pending

### GAP-P1-BL-004 — Column sort controls

- **Phase / Module:** Phase 1 / Backlog
- **Priority:** P1
- **Current Status:** Not Run
- **Previous Result:** Still Open
- **Reference:** P1-BL-01
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
- **Test Data:** Project TEST; một User Story và một Defect; mỗi item có Tasks; dữ liệu dùng prefix P56-AUDIT.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Plan > Backlog; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Backlog, kiểm tra chức năng "Column sort controls" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: Current build retest 2026-07-24: visible evidence clearly exposes Sort by rank only; other Backlog headers do not show clear sortable affordance/aria behavior in the current UI inspection. BA confirmed expectation: headers should be sortable..
8. Kiểm tra hướng sửa đã chốt: Dev must implement or expose header sort for the approved sortable Backlog columns, with visible affordance and stable behavior. Sorting must be read-only and must not change persisted rank/order..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** Backlog headers expose approved sortable columns. Header sort must work for the expected columns and must not mutate rank/position data; rank remains default ordering when no sort is active.
- **Evidence:** evidence/retest_2026-07-24/P1-BL-01-list-states.png
- **Gap / Comment:** BA confirmed 2026-07-24: reopen this gap. Expectation is header sort works, not Rank-only sorting.
- **BA Confirmation:** Fix Direction Approved
- **Codex Audit Log:** Pending

### GAP-P1-BL-006 — Filter configuration model

- **Phase / Module:** Phase 1 / Backlog
- **Priority:** P1
- **Current Status:** Future Backlog
- **Previous Result:** Future Backlog
- **Reference:** P1-BL-01
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
- **Test Data:** Project TEST; một User Story và một Defect; mỗi item có Tasks; dữ liệu dùng prefix P56-AUDIT.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Plan > Backlog; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Backlog, kiểm tra chức năng "Filter configuration model" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: DevInt uses one fixed Filters panel with Type, Schedule State, Owner, Release and Iteration. It has no Manage Filters, removable cards or Clear filters action..
8. Kiểm tra hướng sửa đã chốt: Keep the DevInt fixed filter panel. Reconcile the mockup/document wording to allow this accepted model. Record Manage Filters and any additional configurable filter fields in Future Backlog; track Priority separately as the approved current fix..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** Backlog uses the accepted fixed DevInt filter panel for the current delivery, with Priority added as the one approved current-scope filter; optional configurable filters remain Future Backlog.
- **Evidence:** evidence/retest_2026-07-24/P1-BL-01-list-states.png
- **Gap / Comment:** Current build retest 2026-07-24: Fixed DevInt filter panel remains the accepted current delivery model. BA confirmed 2026-07-24: move this item to Future Backlog; not part of current dev fix package.
- **BA Confirmation:** Accepted As-Is / Future Backlog
- **Codex Audit Log:** Pending

### GAP-P1-BL-008 — Rank persistence and restore

- **Phase / Module:** Phase 1 / Backlog
- **Priority:** P0
- **Current Status:** Future Backlog
- **Previous Result:** Future Backlog
- **Reference:** P1-BL-02
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
- **Test Data:** Project TEST; một User Story và một Defect; mỗi item có Tasks; dữ liệu dùng prefix P56-AUDIT.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Plan > Backlog; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Backlog, kiểm tra chức năng "Rank persistence and restore" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: DevInt drag handle moved DE-4 above DE-1; the order persisted after reload. Dragging DE-1 back restored the original DE-1, DE-4, DE-5 order, which also persisted after reload..
8. Kiểm tra hướng sửa đã chốt: No data-integrity fix is required from this execution. Retest rank using the controlled item created in P1-CREATE-01 and under a Team scope when Team test data becomes available..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** Rank changes only reorder Work Items in the current Backlog scope, persist after reload and do not mutate Work Item identity or field values.
- **Evidence:** evidence/retest_2026-07-24/P1-BL-01-list-states.png
- **Gap / Comment:** Current build retest 2026-07-24: Rank persistence remains an already confirmed match; no reorder mutation was needed in this regression pass. BA confirmed 2026-07-24: move this item to Future Backlog; not part of current dev fix package.
- **BA Confirmation:** Future Backlog Approved
- **Codex Audit Log:** Pending

### GAP-P1-CREATE-001 — Cancel behavior

- **Phase / Module:** Phase 1 / Work Item Create
- **Priority:** P0
- **Current Status:** Future Backlog
- **Previous Result:** Future Backlog
- **Reference:** P1-CREATE-01
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
Chỉ dùng dữ liệu audit có prefix P56-AUDIT; không sửa dữ liệu nghiệp vụ có sẵn.
- **Test Data:** Project TEST; một User Story và một Defect; mỗi item có Tasks; dữ liệu dùng prefix P56-AUDIT.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Work Item Create; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Work Item Create, kiểm tra chức năng "Cancel behavior" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: DevInt Cancel passed: entered DEVINT CANCEL AUDIT 20260719 2059, clicked Cancel, the modal closed, and searching that title returned no record..
8. Kiểm tra hướng sửa đã chốt: No change required for the verified Cancel path. Retest during regression after create fixes land..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** Cancel closes the quick-create modal without creating a Story or Defect.
- **Evidence:** evidence/retest_2026-07-24/P1-CREATE-01-quick-create.png
- **Gap / Comment:** Current build retest 2026-07-24: Cancel behavior remains previously confirmed; no persistent record is created on cancel. BA confirmed 2026-07-24: move this item to Future Backlog; not part of current dev fix package.
- **BA Confirmation:** Future Backlog Approved
- **Codex Audit Log:** Pending

### GAP-P1-CREATE-003 — Team optional and Project/Team scope (C1 reconciled)

- **Phase / Module:** Phase 1 / Work Item Create
- **Priority:** P0
- **Current Status:** Pass — Not a Defect
- **Previous Result:** Still Open
- **Reference:** P1-CREATE-01
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
Chỉ dùng dữ liệu audit có prefix P56-AUDIT; không sửa dữ liệu nghiệp vụ có sẵn.
- **Test Data:** Project TEST; một Team có member và một Team không có member; Team Lead để trống khi case yêu cầu.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Work Item Create; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Work Item Create, kiểm tra chức năng "Team selector contains invalid project team" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: In DevInt NXP / All Teams, the modal listed No team and Team Alpha. Selecting Team Alpha and submitting returned Team is not linked to this project..
8. Kiểm tra hướng sửa đã chốt: Team là optional. Không chọn Team thì Work Item thuộc Project backlog; chọn Team thì Team phải thuộc Project đã chọn.
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** Project là required; Team là optional. `No team` tạo Work Item ở Project backlog; Team được chọn phải linked với Project.
- **Evidence:** evidence/retest_2026-07-24/P1-CREATE-01-quick-create.png
- **Gap / Comment:** C1 BA confirmed 2026-08-06. `No team` là hành vi hợp lệ; chỉ Team không thuộc Project mới là invalid.
- **BA Confirmation:** Confirmed C1 — Closed / Not a Defect
- **Codex Audit Log:** Reconciled 2026-08-09

### GAP-P1-CREATE-006 — Owner default and allowed values

- **Phase / Module:** Phase 1 / Work Item Create
- **Priority:** P1
- **Current Status:** Fail
- **Previous Result:** Still Open
- **Reference:** P1-CREATE-01
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
Chỉ dùng dữ liệu audit có prefix P56-AUDIT; không sửa dữ liệu nghiệp vụ có sẵn.
- **Test Data:** Project TEST; một User Story và một Defect; mỗi item có Tasks; dữ liệu dùng prefix P56-AUDIT.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Work Item Create; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Work Item Create, kiểm tra chức năng "Owner default and allowed values" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: DevInt defaults Owner to Unassigned and exposes Unassigned as the first option, while the authenticated user is Hieu Vu Minh Bui and is not shown as the selected default..
8. Kiểm tra hướng sửa đã chốt: Default Owner to the authenticated user, keep Unassigned as an explicit user-selectable option, and filter named Owner options by selected Project/Team access. Add Unassigned to the mockup and reconcile SRS WIC-FR-006 after the full audit..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** Owner defaults to the authenticated/current user, lists users valid for the selected Project/Team, and also allows an explicit Unassigned choice.
- **Actual Result (2026-08-06):** After Hieu was added to Team Pegasus, Settings > Teams showed both Anh and Hieu, but the Owner dropdown on US-1 still showed only `— No Entry —` and Anh. The Owner selector therefore did not refresh from current Team membership.
- **Evidence:** evidence/retest_2026-07-24/P1-CREATE-01-quick-create.png
- **Gap / Comment:** Keep the approved default rule, but source every Owner selector from current Project/Team membership and invalidate stale membership options after a member is added or removed.
- **BA Confirmation:** Confirmed C10 — DEV fix required
- **Codex Audit Log:** Reconciled 2026-08-09

### GAP-P1-CREATE-008 — Default values and field persistence on Detail

- **Phase / Module:** Phase 1 / Work Item Create
- **Priority:** P0
- **Current Status:** Not Run
- **Previous Result:** Partial (retest)
- **Reference:** P1-CREATE-02
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
Chỉ dùng dữ liệu audit có prefix P56-AUDIT; không sửa dữ liệu nghiệp vụ có sẵn.
- **Test Data:** Project TEST; một User Story và một Defect; mỗi item có Tasks; dữ liệu dùng prefix P56-AUDIT.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Work Item Create; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Work Item Create, kiểm tra chức năng "Default values and field persistence on Detail" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: Retest 2026-07-24 using newly created US-15: Type/US, Title, Project NX Platform, Team Alpha, Owner No Entry, Iteration No iteration, Release No release and Milestones No milestones persisted correctly. Schedule State and Flow State defaulted to Defined instead of Idea..
8. Kiểm tra hướng sửa đã chốt: Dev must set both Schedule State and Flow State defaults to Idea when a new Work Item is created. Keep the verified persistence behavior for Type, Title, Project, optional Team, Owner, Plan Estimate, Iteration, Release and Milestones..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** The created Detail preserves Type, Title, Project, Team, Owner and Plan Estimate from Quick Create; Schedule State and Flow State default to Idea; Release and Iteration default to Unscheduled.
- **Evidence:** Live browser retest: US-15 detail after Quick Create on 2026-07-24
- **Gap / Comment:** BA confirmed Partial: dev must fix default Schedule State and Flow State to Idea.
- **BA Confirmation:** Gap Confirmed
- **Codex Audit Log:** Pending

### GAP-P1-WID-001 — US/DE detail tabs and content scope

- **Phase / Module:** Phase 1 / Work Item Detail
- **Priority:** P1
- **Current Status:** Not Run
- **Previous Result:** Still Open
- **Reference:** P1-WID-01
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
- **Test Data:** Project TEST; một User Story và một Defect; mỗi item có Tasks; dữ liệu dùng prefix P56-AUDIT.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Backlog or Iteration Status > Work Item Detail; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Work Item Detail, kiểm tra chức năng "US/DE detail tabs and content scope" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: DevInt US-7 adds a Defects tab plus Linked Items and Comments beyond the current approved Phase 1 mockup/SRS contract..
8. Kiểm tra hướng sửa đã chốt: Align the Phase 1 US/DE Detail tabs to the mockup. Hide/remove the additional Defects tab from this scope; route Linked Items and Comments to BA review/Future Backlog unless separately approved..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** US/DE Detail follows the approved mockup/SRS tab structure: Details, Tasks and Revision History.
- **Evidence:** evidence/retest_2026-07-24/P1-WID-01-US-13-detail.png
- **Gap / Comment:** Current build retest 2026-07-24: US Detail still includes Defects tab plus Linked Items and Comments outside the approved Phase 1 tab/content scope.
- **BA Confirmation:** Fix Direction Approved
- **Codex Audit Log:** Pending

### GAP-P1-WID-003 — Multiple Releases

- **Phase / Module:** Phase 1 / Work Item Detail
- **Priority:** P0
- **Current Status:** Not Run
- **Previous Result:** Still Open
- **Reference:** P1-WID-01
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
- **Test Data:** Project TEST; Release, Milestone và Iteration có ngày rõ ràng; dùng prefix P56-AUDIT.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Backlog or Iteration Status > Work Item Detail; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Work Item Detail, kiểm tra chức năng "Multiple Releases" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: DevInt US-7 also uses a single Release dropdown..
8. Kiểm tra hướng sửa đã chốt: Change Release on Work Item Detail to a multi-select control in both DevInt and mockup/SRS reconciliation. Preserve zero/one/many Release assignments..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** A Work Item may be assigned zero, one or multiple Releases, independently of Milestones, per the confirmed reconciliation rule.
- **Evidence:** evidence/retest_2026-07-24/P1-WID-01-US-13-detail.png
- **Gap / Comment:** Current build retest 2026-07-24: Release remains one single-select button/dropdown on Work Item Detail.
- **BA Confirmation:** Fix Direction Approved
- **Codex Audit Log:** Pending

### GAP-P1-WID-006 — Two-way Schedule/Flow mirroring

- **Phase / Module:** Phase 1 / Work Item Detail
- **Priority:** P0
- **Current Status:** Not Run
- **Previous Result:** Still Open
- **Reference:** P1-WID-01
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
- **Test Data:** Project TEST; một User Story và một Defect; mỗi item có Tasks; dữ liệu dùng prefix P56-AUDIT.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Backlog or Iteration Status > Work Item Detail; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Work Item Detail, kiểm tra chức năng "Two-way Schedule/Flow mirroring" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: DevInt started with Schedule In Progress and Flow Accepted. Schedule -> Completed left Flow at Accepted; Flow -> Defined left Schedule at Completed. The item was restored to its original mismatch and reload preserved it..
8. Kiểm tra hướng sửa đã chốt: Implement two-way mirroring and prevent mismatched persisted state. Updating either control must atomically synchronize and refresh the other control..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** Changing Schedule State updates Flow State to the same value; changing Flow State updates Schedule State to the same value; both persist as one synchronized Work Item status.
- **Evidence:** evidence/retest_2026-07-24/P1-WID-01-US-13-detail.png
- **Gap / Comment:** Current build retest 2026-07-24: Manual Flow→In-Progress did not update Schedule; manual Schedule→Completed did not update Flow. Test item was restored to both Idea.
- **BA Confirmation:** Fix Direction Approved
- **Codex Audit Log:** Pending

### GAP-P1-WID-007 — Owner default and Unassigned option

- **Phase / Module:** Phase 1 / Work Item Detail
- **Priority:** P1
- **Current Status:** Not Run
- **Previous Result:** Still Open
- **Reference:** P1-WID-01
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
Chỉ dùng dữ liệu audit có prefix P56-AUDIT; không sửa dữ liệu nghiệp vụ có sẵn.
- **Test Data:** Project TEST; một User Story và một Defect; mỗi item có Tasks; dữ liệu dùng prefix P56-AUDIT.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Backlog or Iteration Status > Work Item Detail; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Work Item Detail, kiểm tra chức năng "Owner default and Unassigned option" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: DevInt Detail includes Unassigned and named users. DevInt Quick Create currently defaults to Unassigned instead of the authenticated user..
8. Kiểm tra hướng sửa đã chốt: Keep Unassigned in DevInt Owner options, default new Work Items to the authenticated user, and add Unassigned to the mockup. Apply the same rule consistently in Quick Create and Detail..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** Owner defaults to the authenticated user and also allows the user to explicitly choose Unassigned.
- **Evidence:** evidence/retest_2026-07-24/P1-CREATE-01-quick-create.png
- **Gap / Comment:** Current build retest 2026-07-24: Unassigned/No Entry exists, but Owner default on create remains No Entry instead of the authenticated user.
- **BA Confirmation:** Fix Direction Approved
- **Codex Audit Log:** Pending

### GAP-P1-WID-008 — Optional Team and Project backlog (C1 reconciled)

- **Phase / Module:** Phase 1 / Work Item Detail
- **Priority:** P0
- **Current Status:** Pass — Not a Defect
- **Previous Result:** Still Open
- **Reference:** P1-WID-01
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
- **Test Data:** Project TEST; một Team có member và một Team không có member; Team Lead để trống khi case yêu cầu.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Backlog or Iteration Status > Work Item Detail; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Work Item Detail, kiểm tra chức năng "Required Team and No team option" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: DevInt US-7 Team dropdown includes No team and Team Alpha while Project is not displayed..
8. Kiểm tra hướng sửa đã chốt: Đồng nhất Quick Create và Detail: Team optional; `No team` thuộc Project backlog; Team được chọn phải linked với Project.
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** Team là optional. `No team` là giá trị hợp lệ và đặt Work Item trong Project backlog; Team được chọn phải linked với Project.
- **Evidence:** evidence/retest_2026-07-24/P1-WID-01-US-13-detail.png
- **Gap / Comment:** C1 BA confirmed 2026-08-06. Previous required-Team expectation is obsolete.
- **BA Confirmation:** Confirmed C1 — Closed / Not a Defect
- **Codex Audit Log:** Reconciled 2026-08-09

### GAP-P1-TASK-005 — Create with details action is missing

- **Phase / Module:** Phase 1 / Create Task modal
- **Priority:** P1
- **Current Status:** Not Run
- **Previous Result:** Still Open
- **Reference:** P1-TASK-01
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
Chỉ dùng dữ liệu audit có prefix P56-AUDIT; không sửa dữ liệu nghiệp vụ có sẵn.
- **Test Data:** Project TEST; một User Story và một Defect; mỗi item có Tasks; dữ liệu dùng prefix P56-AUDIT.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Create Task modal; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Create Task modal, kiểm tra chức năng "Create with details action is missing" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: DevInt provides only Cancel and Create Task..
8. Kiểm tra hướng sửa đã chốt: Add Create with details and navigate to the created Task Detail using the same Task identity; do not create a duplicate record..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** Task Quick Create supports Cancel, Create and Create with details; the latter opens the same created Task in Detail.
- **Evidence:** evidence/retest_2026-07-24/P1-TASK-01-create.png
- **Gap / Comment:** Current build retest 2026-07-24: Create Task modal still offers only Cancel and Create Task; Create with details is absent.
- **BA Confirmation:** Fix Direction Approved
- **Codex Audit Log:** Pending

### GAP-P1-TASK-006 — Task State label/catalog mismatch

- **Phase / Module:** Phase 1 / Task Dashboard
- **Priority:** P0
- **Current Status:** Not Run
- **Previous Result:** Partial (retest)
- **Reference:** P1-TASK-01
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
- **Test Data:** Project TEST; một User Story và một Defect; mỗi item có Tasks; dữ liệu dùng prefix P56-AUDIT.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Task Dashboard; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Task Dashboard, kiểm tra chức năng "Task State label/catalog mismatch" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: Retest 2026-07-24: Task Detail uses the correct dropdown catalog Defined, In-Progress, Completed. Task Dashboard row state control still exposes action/title labels Define, In Progress and Complete instead of the canonical state values Defined, In-Progress and Completed..
8. Kiểm tra hướng sửa đã chốt: Dev must align Task Dashboard state labels/tooltips/catalog with Task Detail: Defined, In-Progress, Completed. Preserve the inline control behavior verified in GAP-P1-TASK-003..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** Task State uses the exact catalog Defined, In-Progress, Completed across Dashboard, Detail and roll-up logic.
- **Evidence:** Live browser retest: US-1 Tasks dashboard and TA-2 Task Detail state dropdown on 2026-07-24
- **Gap / Comment:** BA confirmed Partial: dev must fix Dashboard Task State labels to Defined, In-Progress, Completed.
- **BA Confirmation:** Gap Confirmed
- **Codex Audit Log:** Pending

### GAP-P1-TASK-007 — Task Owner default and Unassigned option are inconsistent

- **Phase / Module:** Phase 1 / Create Task modal
- **Priority:** P1
- **Current Status:** Not Run
- **Previous Result:** Still Open
- **Reference:** P1-TASK-01
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
Chỉ dùng dữ liệu audit có prefix P56-AUDIT; không sửa dữ liệu nghiệp vụ có sẵn.
- **Test Data:** Project TEST; một User Story và một Defect; mỗi item có Tasks; dữ liệu dùng prefix P56-AUDIT.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Create Task modal; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Create Task modal, kiểm tra chức năng "Task Owner default and Unassigned option are inconsistent" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: DevInt defaults Owner to Unassigned and also offers named users..
8. Kiểm tra hướng sửa đã chốt: Recommended: align with Work Item creation—default to the authenticated user and retain an explicit Unassigned option because Task ownership is not required..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** Task Owner behavior is explicit and consistent between Mockup and DevInt.
- **Evidence:** evidence/retest_2026-07-24/P1-TASK-01-create.png
- **Gap / Comment:** Current build retest 2026-07-24: Create Task Owner defaults to — No Entry — rather than the agreed current-user default.
- **BA Confirmation:** Fix Direction Approved
- **Codex Audit Log:** Pending

### GAP-P1-CREATE-009 — Default Schedule/Flow State on create

- **Phase / Module:** Phase 1 / Work Item Create
- **Priority:** P1
- **Current Status:** Not Run
- **Previous Result:** Still Open
- **Reference:** P1-CREATE-01
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
Chỉ dùng dữ liệu audit có prefix P56-AUDIT; không sửa dữ liệu nghiệp vụ có sẵn.
- **Test Data:** Project TEST; một User Story và một Defect; mỗi item có Tasks; dữ liệu dùng prefix P56-AUDIT.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Work Item Create; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Work Item Create, kiểm tra chức năng "Default Schedule/Flow State on create" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: DevInt US-8 (DEVINT-AUDIT CREATE 20260723) was created with Schedule State and Flow State = Defined, not Idea..
8. Kiểm tra hướng sửa đã chốt: Default new Work Item Schedule State and Flow State to Idea on create, in both quick-create and detail..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** A newly created Story/Defect defaults Schedule State and Flow State to Idea.
- **Evidence:** evidence/retest_2026-07-24/P1-BL-01-list-states.png
- **Gap / Comment:** Current build retest 2026-07-24: New US-14 created with Schedule State = Defined and Flow State = Defined, not Idea.
- **BA Confirmation:** Confirmed
- **Codex Audit Log:** Pending

### GAP-P1-TEAM-001 — Team Lead requiredness contract

- **Phase / Module:** Phase 1 / Settings > Teams / Create Team
- **Priority:** P1
- **Current Status:** Not Run
- **Previous Result:** Failed (retest)
- **Reference:** P1-TEAM-02
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
Chỉ dùng dữ liệu audit có prefix P56-AUDIT; không sửa dữ liệu nghiệp vụ có sẵn.
- **Test Data:** Project TEST; một Team có member và một Team không có member; Team Lead để trống khi case yêu cầu.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Settings > Teams / Create Team; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Settings > Teams / Create Team, kiểm tra chức năng "Team Lead requiredness contract" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: Current build retest 2026-07-24: DevInt Create Team shows Team Lead as optional/No lead, but submitting a valid Team with No lead fails with generic Validation failed. Modal stays open and no Team is created..
8. Kiểm tra hướng sửa đã chốt: Dev must allow Team creation with No lead/null lead and keep Lead assignment editable after creation. BA must update SRS/mockup to document Team Lead optional and assign-later rule. If validation fails for other reasons, show actionable field-level error..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** Team Lead is optional. Create Team must allow No lead/null lead and the Team can be created first; Lead can be assigned later after Team creation.
- **Evidence:** evidence/retest_2026-07-24/P1-TEAM-02-create-no-lead.png
- **Gap / Comment:** BA confirmed 2026-07-24: Team Lead optional; No lead must be accepted on create; add Team Lead later is allowed. Marked Not Pass for DevInt; BA docs/mockup need supplemental rule.
- **BA Confirmation:** Fix Direction Approved
- **Codex Audit Log:** Pending

### GAP-P1-HIST-001 — State-change activity labeling / duplicate

- **Phase / Module:** Phase 1 / Work Item Detail / Revision History
- **Priority:** P2
- **Current Status:** Not Run
- **Previous Result:** Still Open
- **Reference:** P1-HIST-01
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
- **Test Data:** Project TEST; một User Story và một Defect; mỗi item có Tasks; dữ liệu dùng prefix P56-AUDIT.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Work Item Detail / Revision History; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Work Item Detail / Revision History, kiểm tra chức năng "State-change activity labeling / duplicate" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: On US-8 each state change (via Task roll-up) produced two identical rows both labeled "Schedule State changed from X to Y". The Flow State change is mislabeled as Schedule State or duplicated..
8. Kiểm tra hướng sửa đã chốt: Log Schedule and Flow changes as separate correctly-labeled actions; avoid duplicate entries for a single mutation..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** Schedule State and Flow State changes log as distinct, correctly-labeled actions (schedule_state_changed vs flow_state_changed); a single change does not create duplicate rows.
- **Evidence:** evidence/retest_2026-07-24/P1-HIST-01-parent-duplicate.png
- **Gap / Comment:** Current build retest 2026-07-24: US-13 history still duplicates/mislabels paired status changes as Schedule State: two rows for completed→in_progress and two Schedule-labeled completion rows.
- **BA Confirmation:** Confirmed
- **Codex Audit Log:** Pending

### GAP-P1-HIST-002 — Task-level activity not logged

- **Phase / Module:** Phase 1 / Task Detail / Revision History
- **Priority:** P1
- **Current Status:** Not Run
- **Previous Result:** Still Open
- **Reference:** P1-HIST-01
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
- **Test Data:** Project TEST; một User Story và một Defect; mỗi item có Tasks; dữ liệu dùng prefix P56-AUDIT.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Task Detail / Revision History; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Task Detail / Revision History, kiểm tra chức năng "Task-level activity not logged" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: TA-6 Task Revision History shows "No activity recorded yet" despite task create, state changes (Complete then reopen) and time set. Task events appear only in the parent Work Item history..
8. Kiểm tra hướng sửa đã chốt: Write task-level activity rows (create/state/time) to the Task activity log and show them in Task Revision History..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** Task Revision History logs task.created, task.state_changed and task time updates for the Task (ACT-FR-002/005).
- **Evidence:** evidence/retest_2026-07-24/P1-HIST-02-task-empty.png
- **Gap / Comment:** Current build retest 2026-07-24: TA-11 Revision History remains No activity recorded after task creation and state changes.
- **BA Confirmation:** Confirmed
- **Codex Audit Log:** Pending

### GAP-P2-IT-001 — Missing Task Estimate column (C9 narrowed)

- **Phase / Module:** Phase 2 / Timeboxes > Iterations list
- **Priority:** P1
- **Current Status:** Not Run
- **Previous Result:** Still Open
- **Reference:** P2-IT-01
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
- **Test Data:** Project TEST; một Iteration active và một Iteration completed; Work Item/Task có thể nhận biết bằng prefix P56-AUDIT.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Timeboxes > Iterations list; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Timeboxes > Iterations list, kiểm tra chức năng "Missing Project and Task Estimate columns" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: DevInt list shows ID, Name, Theme, Start Date, End Date, Planned Velocity and State only. Project and Task Estimate are absent..
8. Kiểm tra hướng sửa đã chốt: Không thêm Project column trong single-project scope. Chỉ bổ sung Task Estimate.
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** Iterations list shows ID, Name, Theme, Start Date, End Date, Planned Velocity, Task Estimate and State. Project column/search/sort is omitted in single-project scope.
- **Evidence:** evidence/retest_2026-07-24/P2-IT-01-timeboxes.png
- **Gap / Comment:** C9 BA confirmed 2026-08-06. Project omission is correct; only missing Task Estimate remains a DEV gap.
- **BA Confirmation:** Confirmed C9 — Dev fix Task Estimate only
- **Codex Audit Log:** Reconciled 2026-08-09

### GAP-P2-IS-003 — Type column not required (C3 reconciled)

- **Phase / Module:** Phase 2 / Iteration Status list
- **Priority:** P2
- **Current Status:** Pass — Not a Defect
- **Previous Result:** Still Open
- **Reference:** P2-IS-01
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
- **Test Data:** Project TEST; một Iteration active và một Iteration completed; Work Item/Task có thể nhận biết bằng prefix P56-AUDIT.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Iteration Status list; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Iteration Status list, kiểm tra nhận diện loại Work Item qua prefix/glyph theo Expected Result.
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: DevInt list has no Type column; it also adds Feature, Blocked Reason, Tasks, Actual, Defect Status, Milestones and Dev Owner beyond the contract..
8. Kiểm tra hướng sửa đã chốt: Không thêm Type column; ID prefix/glyph đã đủ nhận diện US/DE.
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** List không có Type column riêng. Work Item type được nhận diện bằng ID prefix/glyph; các cột còn lại theo P2-IS-FR-018.
- **Evidence:** evidence/retest_2026-07-24/P2-IS-01-iteration-status.png
- **Gap / Comment:** C3 BA confirmed 2026-08-06. Missing Type column is correct behavior; other optional/extra columns are assessed separately.
- **BA Confirmation:** Confirmed C3 — Closed / Not a Defect
- **Codex Audit Log:** Reconciled 2026-08-09

### GAP-P2-IS-004 — Forbidden per-row Defects column

- **Phase / Module:** Phase 2 / Iteration Status list
- **Priority:** P2
- **Current Status:** Not Run
- **Previous Result:** Still Open
- **Reference:** P2-IS-01
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
- **Test Data:** Project TEST; một Iteration active và một Iteration completed; Work Item/Task có thể nhận biết bằng prefix P56-AUDIT.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Iteration Status list; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Iteration Status list, kiểm tra chức năng "Forbidden per-row Defects column" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: DevInt list renders a per-row Defects column plus Defect Status..
8. Kiểm tra hướng sửa đã chốt: Remove the per-row Defects column; keep Defects as the summary metric only..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** The list must not include a per-row Defects column (P2-IS-FR-019). Defects is a summary metric only.
- **Evidence:** evidence/retest_2026-07-24/P2-IS-01-iteration-status.png
- **Gap / Comment:** Current build retest 2026-07-24: Per-row Defects and Defect Status columns are still present.
- **BA Confirmation:** Confirmed
- **Codex Audit Log:** Pending

### GAP-P2-IS-005 — Board view toggle exposed

- **Phase / Module:** Phase 2 / Iteration Status
- **Priority:** P2
- **Current Status:** Not Run
- **Previous Result:** Still Open
- **Reference:** P2-IS-01
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
- **Test Data:** Project TEST; một Iteration active và một Iteration completed; Work Item/Task có thể nhận biết bằng prefix P56-AUDIT.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Track > Iteration Status; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Iteration Status, kiểm tra chức năng "Board view toggle exposed" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: DevInt Iteration Status exposes a List / Board toggle..
8. Kiểm tra hướng sửa đã chốt: Hide the Board toggle until the board scope is approved, or get BA approval to bring board execution into scope..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** Iteration Board / Team Board are Future Backlog and absent from active navigation per the reconciled source of truth.
- **Evidence:** evidence/retest_2026-07-24/P2-IS-01-iteration-status.png
- **Gap / Comment:** Current build retest 2026-07-24: List / Board toggle remains exposed even though Board is Future Backlog.
- **BA Confirmation:** Confirmed
- **Codex Audit Log:** Pending

### GAP-P2-BL-001 — Missing bulk assign Release/Iteration; unexpected Delete/Copy

- **Phase / Module:** Phase 2 / Backlog bulk actions
- **Priority:** P1
- **Current Status:** Not Run
- **Previous Result:** Still Open
- **Reference:** P2-BL-01
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
Chỉ dùng dữ liệu audit có prefix P56-AUDIT; không sửa dữ liệu nghiệp vụ có sẵn.
- **Test Data:** Project TEST; một Iteration active và một Iteration completed; Work Item/Task có thể nhận biết bằng prefix P56-AUDIT.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Backlog bulk actions; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Backlog bulk actions, kiểm tra chức năng "Missing bulk assign Release/Iteration; unexpected Delete/Copy" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: DevInt selection bar shows only Delete and Copy. Bulk assign Release and Iteration are absent; Delete and Copy are not part of the P2.1 bulk contract..
8. Kiểm tra hướng sửa đã chốt: Add bulk assign Release and Iteration to the selected bar. Get BA decision on whether bulk Delete/Copy stay in scope and, if kept, define soft-delete and permission rules..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** With rows selected the bar offers bulk assign Release (P2-BL-FR-015) and bulk assign Iteration (P2-BL-FR-015A).
- **Evidence:** evidence/retest_2026-07-24/P2-BL-01-bulk-actions.png
- **Gap / Comment:** Current build retest 2026-07-24: Selecting US-13 still exposes only Delete and Copy; bulk Assign Release and Assign Iteration are absent.
- **BA Confirmation:** Confirmed
- **Codex Audit Log:** Pending

### GAP-P3-TS-001 — Local search input

- **Phase / Module:** Phase 3 / Team Status
- **Priority:** P2
- **Current Status:** Not Run
- **Previous Result:** Still Open
- **Reference:** P3-TS-01
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
- **Test Data:** Project TEST; một Team có member và một Team không có member; Team Lead để trống khi case yêu cầu.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Track > Team Status; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Team Status, kiểm tra chức năng "Local search input" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: DevInt Track > Team Status shows a Search Tasks search input above the table..
8. Kiểm tra hướng sửa đã chốt: Remove the Team Status local search input to match the approved SRS/mockup..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** SRS FR-006 requires Team Status to not show a local search input.
- **Evidence:** evidence/retest_2026-07-24/P3-TS-01-team-status.png
- **Gap / Comment:** Current build retest 2026-07-24: Team Status still shows local Search tasks input.
- **BA Confirmation:** Gap Confirmed
- **Codex Audit Log:** Pending

### GAP-P3-TS-002 — Show Fields remains out of scope (C4 narrowed)

- **Phase / Module:** Phase 3 / Team Status
- **Priority:** P2
- **Current Status:** Partial
- **Previous Result:** Still Open
- **Reference:** P3-TS-01
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
- **Test Data:** Project TEST; một Team có member và một Team không có member; Team Lead để trống khi case yêu cầu.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Track > Team Status; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Team Status, kiểm tra chức năng "Filters/Show Fields/pagination controls" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: DevInt shows a Filters button, a Show Fields button and full pagination (Rows per page, Page X of Y) copied from the Iteration Status/Backlog template..
8. Kiểm tra hướng sửa đã chốt: Giữ Filters và pagination; bỏ Show Fields. Totals luôn tính trên toàn bộ Iteration, không phụ thuộc filter hoặc trang hiện tại.
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** Team Status cho phép Filters và pagination, không có local Search Tasks hoặc Show Fields. Totals tính trên toàn bộ Iteration.
- **Evidence:** evidence/retest_2026-07-24/P3-TS-01-team-status.png
- **Gap / Comment:** C4 BA confirmed 2026-08-06. Filters/pagination are accepted; only Show Fields remains a DEV gap. Retest Totals against full Iteration after fix.
- **BA Confirmation:** Confirmed C4 — Partial / Dev remove Show Fields
- **Codex Audit Log:** Reconciled 2026-08-09

### GAP-P3-TS-003 — Breadcrumb

- **Phase / Module:** Phase 3 / Team Status
- **Priority:** P2
- **Current Status:** Not Run
- **Previous Result:** Still Open
- **Reference:** P3-TS-01
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
- **Test Data:** Project TEST; một Team có member và một Team không có member; Team Lead để trống khi case yêu cầu.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Track > Team Status; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Team Status, kiểm tra chức năng "Breadcrumb" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: DevInt breadcrumb shows ACME Corp > Team Status only - uses the Org name instead of the Project name and drops the Track segment entirely..
8. Kiểm tra hướng sửa đã chốt: Fix breadcrumb to show [Project] > Track > Team status..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** FR-002: breadcrumb displays current Project, Track, and Team status.
- **Evidence:** evidence/retest_2026-07-24/P3-TS-01-team-status.png
- **Gap / Comment:** Current build retest 2026-07-24: Breadcrumb remains ACME Corp > Team Status; Project > Track > Team Status hierarchy is absent.
- **BA Confirmation:** Gap Confirmed
- **Codex Audit Log:** Pending

### GAP-P3-TS-004 — Parent auto-completion reopen rule

- **Phase / Module:** Phase 3 / Team Status
- **Priority:** P2
- **Current Status:** Not Run
- **Previous Result:** Still Open
- **Reference:** P3-TS-01
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
Chỉ dùng dữ liệu audit có prefix P56-AUDIT; không sửa dữ liệu nghiệp vụ có sẵn.
- **Test Data:** Project TEST; một Team có member và một Team không có member; Team Lead để trống khi case yêu cầu.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Track > Team Status; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Team Status, kiểm tra chức năng "Parent auto-completion reopen rule" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: Verified live on two cases. US-8/TA-6 (parent purely Completed): reopening TA-6 correctly reverts US-8 to In-Progress. US-11/TA-8 (parent already manually promoted to Accepted): reopening the only child Task TA-8 does NOT revert the parent; US-11 stays Accepted..
8. Kiểm tra hướng sửa đã chốt: BA to confirm intended behavior - should reopening a Task always force the parent back to In-Progress even from Accepted, or is Accepted meant to be protected from this automation..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** FR-041: reopening a Task after all child Tasks had been Completed must recalculate metrics and automatically set the parent Story/Defect status to In-Progress.
- **Evidence:** evidence/retest_2026-07-24/P3-TS-01-accepted-reopen.png
- **Gap / Comment:** Current build retest 2026-07-24: US-13 moved to Completed when TA-11 completed, but after manual parent Accepted then reopening TA-11, parent remained Accepted instead of reverting to In-Progress. Test data was manually restored.
- **BA Confirmation:** Fix Direction Approved
- **Codex Audit Log:** Pending

### GAP-P3-TS-005 — Task State control type

- **Phase / Module:** Phase 3 / Team Status
- **Priority:** P2
- **Current Status:** Not Run
- **Previous Result:** Still Open
- **Reference:** P3-TS-01
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
- **Test Data:** Project TEST; một Team có member và một Team không có member; Team Lead để trống khi case yêu cầu.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Track > Team Status; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Team Status, kiểm tra chức năng "Task State control type" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: DevInt renders a 3-segment icon toggle group instead of a dropdown; the 2 non-active segments render with transparent text so no label is visible, only the active segment shows a letter..
8. Kiểm tra hướng sửa đã chốt: Match the approved dropdown control, or at minimum fix the toggle label visibility for the non-selected states..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** FR-021/022: Task State is an inline editable dropdown with exactly Defined, In-Progress, Completed.
- **Evidence:** evidence/retest_2026-07-24/P3-TS-01-TA10.png
- **Gap / Comment:** Current build retest 2026-07-24: Team Status Task State remains a three-segment toggle group, not the required inline dropdown.
- **BA Confirmation:** Gap Confirmed
- **Codex Audit Log:** Pending

### GAP-P3-TS-006 — Estimate/ToDo/Actuals default display

- **Phase / Module:** Phase 3 / Team Status
- **Priority:** P3
- **Current Status:** Not Run
- **Previous Result:** Still Open
- **Reference:** P3-TS-01
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
- **Test Data:** Project TEST; một Team có member và một Team không có member; Team Lead để trống khi case yêu cầu.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Track > Team Status; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Team Status, kiểm tra chức năng "Estimate/ToDo/Actuals default display" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: Task row TA-10 (no estimate/todo/actual data) displays an em-dash in all three columns instead of 0..
8. Kiểm tra hướng sửa đã chốt: Default missing Estimate/ToDo/Actuals to 0 instead of a dash placeholder..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** SRS 8.3: Estimate, ToDo and Actuals default to 0 when not set.
- **Evidence:** evidence/retest_2026-07-24/P3-TS-01-TA10.png
- **Gap / Comment:** Current build retest 2026-07-24: Expanded TA-10 still displays em dashes for Estimate, To Do and Actuals instead of 0.
- **BA Confirmation:** Gap Confirmed
- **Codex Audit Log:** Pending

### GAP-P3-TS-007 — Task Dashboard state labels

- **Phase / Module:** Phase 3 / Team Status
- **Priority:** P3
- **Current Status:** Not Run
- **Previous Result:** Still Open
- **Reference:** P3-TS-01
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
- **Test Data:** Project TEST; một Team có member và một Team không có member; Team Lead để trống khi case yêu cầu.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Track > Team Status; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Team Status, kiểm tra chức năng "Task Dashboard state labels" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: Work Item Detail Tasks tab state buttons are labeled Define, In Progress, Complete instead of the exact catalog wording..
8. Kiểm tra hướng sửa đã chốt: Correct the button labels to Defined / In-Progress / Completed..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** FR-022/038: Task State values are exactly Defined, In-Progress, Completed.
- **Evidence:** evidence/retest_2026-07-24/P1-TASK-01-dashboard.png
- **Gap / Comment:** Current build retest 2026-07-24: Task Dashboard still uses Define, In Progress and Complete rather than Defined, In-Progress and Completed.
- **BA Confirmation:** Gap Confirmed
- **Codex Audit Log:** Pending

### GAP-P3-TS-008 — Team Status membership scope

- **Phase / Module:** Phase 3 / Team Status
- **Priority:** P0
- **Current Status:** Fail
- **Previous Result:** New defect found 2026-08-06
- **Reference:** Phase 3/01_Team_Status/SRS.md; Phase 1/03_Work_Item_Detail/SRS.md
- **Preconditions:** Signed in to DevInt. Project TEST, Team Pegasus and Iteration IT-1 are available. Team membership can be checked in Settings > Teams.
- **Test Data:** Team Pegasus; users Anh and Hieu; US-1 and a Task assigned to Hieu.
- **Steps:** 1. Check the current member list in Settings > Teams for Pegasus. 2. Open Team Status in the same Project/Team/Iteration scope and compare the member groups. 3. Add Hieu to Pegasus. 4. Reload Team Status and verify Hieu appears once. 5. Open US-1 and inspect the Owner dropdown. 6. Reload and confirm all views use the same current membership.
- **Expected:** Team Status member groups and all Owner selectors use the same current Team membership source. A non-member is not presented as a current Team member. After an active member is added, that person becomes available in Owner selectors without stale data.
- **Actual Result (2026-08-06):** Hieu appeared in Team Status before belonging to Pegasus. After Hieu was added, Settings > Teams and Team Status both showed Anh and Hieu, but the US-1 Owner dropdown still showed only `— No Entry —` and Anh.
- **Evidence:** Live DevInt review recorded in this tracker; no screenshot file was added.
- **Gap / Comment:** DEV must use one current Team-membership source for Team Status and Owner selectors, and refresh/invalidate membership caches after add/remove. The treatment of existing Tasks owned by a removed member remains **Pending BA**.
- **BA Confirmation:** Bug confirmed; removed-member Task behavior pending
- **Codex Audit Log:** Fail recorded 2026-08-06

### GAP-P3-REL-001 — Release Progress widget

- **Phase / Module:** Phase 3 / Release Detail
- **Priority:** P2
- **Current Status:** Not Run
- **Previous Result:** Still Open
- **Reference:** P3-REL-01
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
- **Test Data:** Project TEST; Release, Milestone và Iteration có ngày rõ ràng; dùng prefix P56-AUDIT.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Release Detail; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Release Detail, kiểm tra chức năng "Release Progress widget" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: DevInt Release detail (RE-2) shows a Burndown section with a chart placeholder below the Task Roll-up panel..
8. Kiểm tra hướng sửa đã chốt: Remove the Burndown widget from Release detail for Phase 3.2; defer to Phase 5 Release Planning per SRS..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** FR-037: Phase 3 Release list/detail must not add a Release Progress column or widget; Progress is deferred to Phase 5 Portfolio > Release Planning.
- **Evidence:** evidence/retest_2026-07-24/P3-REL-01-detail-burndown.png
- **Gap / Comment:** Current build retest 2026-07-24: RE-2 Detail still shows Task Roll-up plus Burndown placeholder, which is deferred to Phase 5.
- **BA Confirmation:** Gap Confirmed
- **Codex Audit Log:** Pending

### GAP-P3-REL-002 — Release Artifacts assignment display

- **Phase / Module:** Phase 3 / Release Artifacts
- **Priority:** P0
- **Current Status:** Not Run
- **Previous Result:** Still Open
- **Reference:** P3-REL-02
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
Chỉ dùng dữ liệu audit có prefix P56-AUDIT; không sửa dữ liệu nghiệp vụ có sẵn.
- **Test Data:** Project TEST; Release, Milestone và Iteration có ngày rõ ràng; dùng prefix P56-AUDIT.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Release Artifacts; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Release Artifacts, kiểm tra chức năng "Release Artifacts assignment display" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: Assigned US-11 to RE-2 from the Backlog Release picker; Backlog Release column and the Release list Task Est. roll-up both updated correctly (6h), but RE-2 Artifacts tab still showed No artifacts linked to this release even after a hard page reload..
8. Kiểm tra hướng sửa đã chốt: Fix the Release Artifacts query so it returns work items whose Release assignment matches; this blocks all reassignment-refresh testing (FR-031/036/038) until fixed..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** FR-029/032: Release Artifacts view shows the Story/Defect work items assigned to the Release.
- **Evidence:** evidence/retest_2026-07-24/P3-REL-02-artifacts-empty.png
- **Gap / Comment:** Current build retest 2026-07-24: Assigned US-13 to RE-2 successfully, but RE-2 Artifacts still showed No artifacts linked after reload; release was then cleared from US-13.
- **BA Confirmation:** Gap Confirmed
- **Codex Audit Log:** Pending

### GAP-P3-MS-001 — Add Artifact control

- **Phase / Module:** Phase 3 / Milestone Artifacts
- **Priority:** P0
- **Current Status:** Not Run
- **Previous Result:** Still Open
- **Reference:** P3-MS-03
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
- **Test Data:** Project TEST; Release, Milestone và Iteration có ngày rõ ràng; dùng prefix P56-AUDIT.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Milestone Artifacts; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Milestone Artifacts, kiểm tra chức năng "Add Artifact control" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: MS-2 Artifacts tab shows only a search box and a No artifacts linked to this milestone empty state; there is no Add Artifact button or control anywhere on the tab..
8. Kiểm tra hướng sửa đã chốt: Implement the Add Artifact control on the Milestone Artifacts tab following the Backlog picker pattern..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** FR-028: Add Artifact follows the Backlog Story/Defect create/picker pattern and appends the current Milestone relationship.
- **Evidence:** evidence/retest_2026-07-24/P3-MS-03-artifacts-no-add.png
- **Gap / Comment:** Current build retest 2026-07-24: MS-2 Artifacts still has search and empty state only; no Add Artifact control.
- **BA Confirmation:** Gap Confirmed
- **Codex Audit Log:** Pending

### GAP-P3-QA-001 — Create Defect from Quality

- **Phase / Module:** Phase 3 / Quality/Defect
- **Priority:** P0
- **Current Status:** Not Run
- **Previous Result:** Still Open
- **Reference:** P3-QA-01
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
Chỉ dùng dữ liệu audit có prefix P56-AUDIT; không sửa dữ liệu nghiệp vụ có sẵn.
- **Test Data:** Project TEST; một User Story và một Defect; mỗi item có Tasks; dữ liệu dùng prefix P56-AUDIT.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Quality/Defect; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Quality/Defect, kiểm tra chức năng "Create Defect from Quality" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: Filled Name, Severity (Major Problem) and Priority (Normal) in the Quality > Defect Add New modal and submitted; the modal closed with no visible error, but no new Defect row appeared and the Open Defects KPI stayed at 3. Reproduced twice, confirmed again after a fresh navigation..
8. Kiểm tra hướng sửa đã chốt: Fix Defect creation from the Quality > Defect entry point; also verify Backlog-side Defect creation still works as a comparison point..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** FR-006/AC-6: user can create a Defect from Quality > Defect.
- **Evidence:** evidence/retest_2026-07-24/P3-QA-01-create-defect.png
- **Gap / Comment:** Current build retest 2026-07-24: Quality > Defects create still fails; current build keeps the modal open and shows Failed to create defect (405), and no new row/KPI change occurs.
- **BA Confirmation:** Gap Confirmed
- **Codex Audit Log:** Pending

### GAP-P4-NOTIF-001 — Notification result data and unread count

- **Phase / Module:** Phase 4 / Notification Center
- **Priority:** P1
- **Current Status:** Not Run
- **Previous Result:** Blocked (test data)
- **Reference:** P4-NOTIF-02
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
- **Test Data:** Dùng dữ liệu test riêng trong Project TEST. Nếu chưa có dữ liệu bắt buộc, ghi Blocked và nêu rõ dữ liệu còn thiếu.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Notification Center; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Notification Center, kiểm tra chức năng "Notification result data and unread count" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: DevInt has the complete empty-state/filter shell but the current account has 0 notifications..
8. Kiểm tra hướng sửa đã chốt: Seed controlled assignment and mention notifications for the audit user, or provide a dedicated sender/recipient test pair. Then verify count, card fields, filter results and inaccessible-target handling..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** Current user receives accessible assignment/mention rows; unread count and four category filters return correct result sets.
- **Evidence:** evidence/phase4_2026-07-24/P4-NOTIF-dev-direct.png; evidence/phase4_2026-07-24/P4-NOTIF-mock.png
- **Gap / Comment:** BA confirmed 2026-07-24: keep as Partial until controlled notification data exists; dev/test data required to verify counts, cards and filters.
- **BA Confirmation:** BA Confirmed 2026-07-24
- **Codex Audit Log:** Pending

### GAP-P4-NOTIF-002 — Read-state persistence

- **Phase / Module:** Phase 4 / Notification Center
- **Priority:** P1
- **Current Status:** Not Run
- **Previous Result:** Blocked (test data)
- **Reference:** P4-NOTIF-03
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
- **Test Data:** Dùng dữ liệu test riêng trong Project TEST. Nếu chưa có dữ liệu bắt buộc, ghi Blocked và nêu rõ dữ liệu còn thiếu.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Notification Center; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Notification Center, kiểm tra chức năng "Read-state persistence" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: No notification row exists, so neither interaction can be exercised..
8. Kiểm tra hướng sửa đã chốt: After controlled rows exist, verify one-read, mark-all, badge/count update, reload persistence and session restore..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** Clicking one notification and Mark all as read persist after reload/session restore.
- **Evidence:** evidence/phase4_2026-07-24/P4-NOTIF-dev-direct.png
- **Gap / Comment:** BA confirmed 2026-07-24: keep as Blocked until notification rows exist; persistence remains unverified.
- **BA Confirmation:** BA Confirmed 2026-07-24
- **Codex Audit Log:** Pending

### GAP-P4-NOTIF-003 — Recipient event and target route

- **Phase / Module:** Phase 4 / Assignment / Note mention
- **Priority:** P0
- **Current Status:** Not Run
- **Previous Result:** Blocked (test data)
- **Reference:** P4-NOTIF-04
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
Chỉ dùng dữ liệu audit có prefix P56-AUDIT; không sửa dữ liệu nghiệp vụ có sẵn.
- **Test Data:** Dùng dữ liệu test riêng trong Project TEST. Nếu chưa có dữ liệu bắt buộc, ghi Blocked và nêu rõ dữ liệu còn thiếu.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Assignment / Note mention; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Assignment / Note mention, kiểm tra chức năng "Recipient event and target route" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: No safe alternate recipient/test account or pre-seeded event is available in this session..
8. Kiểm tra hướng sửa đã chốt: Provide a dedicated Project Member recipient and sender in a test Project, then verify event creation, popup, list row, target route and permission filtering..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** Assignment and Note mention notify only the intended accessible user and route to the same US/DE identity.
- **Evidence:** evidence/phase4_2026-07-24/P4-NOTIF-dev-direct.png; evidence/phase4_2026-07-24/P4-NOTIF-mock.png
- **Gap / Comment:** BA confirmed 2026-07-24: keep as Blocked; audit intentionally did not send a mention to another real person.
- **BA Confirmation:** BA Confirmed 2026-07-24
- **Codex Audit Log:** Pending

### GAP-P4-RBAC-002 — Workspace Admin account safeguard

- **Phase / Module:** Phase 4 / User Management
- **Priority:** P0
- **Current Status:** Blocked
- **Previous Result:** Still Open
- **Reference:** P4-RBAC-02
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
Có account và Project assignment tương ứng để kiểm tra quyền.
- **Test Data:** Dùng dữ liệu test riêng trong Project TEST. Nếu chưa có dữ liệu bắt buộc, ghi Blocked và nêu rõ dữ liệu còn thiếu.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở User Management; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình User Management, kiểm tra chức năng "Workspace Admin account safeguard" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: DevInt current Workspace Admin detail has enabled Workspace role and Teams controls plus enabled Save..
8. Kiểm tra hướng sửa đã chốt: Render Workspace Admin account detail as read-only, remove Save and prevent role/team/status mutations for the system-owner account at the API boundary..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** Internally assigned Workspace Admin user detail is entirely read-only and does not expose Save.
- **Current Result:** Chưa test được RBAC vì chưa có đủ account/role và Project assignment để kiểm tra quyền.
- **Evidence:** evidence/phase4_2026-07-24/P4-RBAC-dev.png; evidence/phase4_2026-07-24/P4-RBAC-mock.png
- **Gap / Comment:** BA confirmed 2026-07-24: Workspace Admin detail must be fully read-only; no mutation was submitted.
RBAC blocked: cần Workspace Admin, Project Admin managed/unmanaged và/hoặc Project Member theo Preconditions.
- **BA Confirmation:** Pending RBAC test accounts
- **Codex Audit Log:** Pending

### GAP-P4-RBAC-003 — Project Admin / Project Member enforcement

- **Phase / Module:** Phase 4 / Cross-role access
- **Priority:** P0
- **Current Status:** Blocked
- **Previous Result:** Blocked (test account)
- **Reference:** P4-RBAC-03
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
Có account và Project assignment tương ứng để kiểm tra quyền.
- **Test Data:** Dùng dữ liệu test riêng trong Project TEST. Nếu chưa có dữ liệu bắt buộc, ghi Blocked và nêu rõ dữ liệu còn thiếu.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Cross-role access; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Cross-role access, kiểm tra chức năng "Project Admin / Project Member enforcement" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: Only a Workspace Admin session is available, so PA/PM navigation, action gating and API rejection cannot be tested..
8. Kiểm tra hướng sửa đã chốt: Provide controlled project_admin and project_member accounts with explicit managed/assigned Project and Team mappings, plus one unassigned Project for negative tests..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** Project Admin assigned-vs-other Project behavior and Project Member Project/Team scope match the matrix; unauthorized routes/actions fail safely.
- **Current Result:** Chưa test được RBAC vì chưa có đủ account/role và Project assignment để kiểm tra quyền.
- **Evidence:** evidence/phase4_2026-07-24/P4-RBAC-dev.png
- **Gap / Comment:** BA confirmed 2026-07-24: keep P4-RBAC-03..05 Blocked until controlled Project Admin/Project Member accounts are available.
RBAC blocked: cần Workspace Admin, Project Admin managed/unmanaged và/hoặc Project Member theo Preconditions.
- **BA Confirmation:** Pending RBAC test accounts
- **Codex Audit Log:** Pending

### GAP-P4-SET-001 — Single-company field baseline

- **Phase / Module:** Phase 4 / Workspace Settings
- **Priority:** P2
- **Current Status:** Not Run
- **Previous Result:** Still Open
- **Reference:** P4-SET-01
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
Có account và Project assignment tương ứng để kiểm tra quyền.
- **Test Data:** Dùng dữ liệu test riêng trong Project TEST. Nếu chưa có dữ liệu bắt buộc, ghi Blocked và nêu rõ dữ liệu còn thiếu.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Workspace Settings; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Workspace Settings, kiểm tra chức năng "Single-company field baseline" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: DevInt shows Slug and Workspace admin, plus editable Workspace name/Description, but no explicit single-company scope..
8. Kiểm tra hướng sửa đã chốt: Add the read-only single-company scope value or reconcile BA documentation if the explicit field is intentionally omitted. Keep Workspace terminology consistent..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** Workspace Settings explicitly shows read-only single-company scope beside read-only Slug and Workspace Admin identity.
- **Evidence:** evidence/phase4_2026-07-24/P4-AUDIT-dev.png
- **Gap / Comment:** BA confirmed 2026-07-24: keep as Partial; add explicit single-company scope or reconcile BA documentation if intentionally omitted. Save/audit persistence was not mutated.
- **BA Confirmation:** BA Confirmed 2026-07-24
- **Codex Audit Log:** Pending

### GAP-P4-SET-002 — List columns, role values and detail fields

- **Phase / Module:** Phase 4 / User Management
- **Priority:** P0
- **Current Status:** Not Run
- **Previous Result:** Still Open
- **Reference:** P4-SET-02
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
Có account và Project assignment tương ứng để kiểm tra quyền.
- **Test Data:** Dùng dữ liệu test riêng trong Project TEST. Nếu chưa có dữ liệu bắt buộc, ghi Blocked và nêu rõ dữ liệu còn thiếu.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở User Management; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình User Management, kiểm tra chức năng "List columns, role values and detail fields" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: DevInt list contains Teams and unsupported/blank roles; non-admin detail has no Name/Phone or Remove User Access.
8. Kiểm tra hướng sửa đã chốt: List chỉ gồm Name, Email, Role, Status, Last Login. Phone chỉ ở Detail/Profile; Teams chỉ ở User Detail/Team Members. Giữ ba role đã duyệt và guarded Remove User Access.
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** List columns are Name, Email, Role, Status and Last Login; không có Phone/Teams. Detail edits Name/Phone/Role/Status, keeps Email read-only, shows team membership and exposes Remove User Access.
- **Evidence:** evidence/phase4_2026-07-24/P4-RBAC-dev.png; evidence/phase4_2026-07-24/P4-RBAC-mock.png
- **Gap / Comment:** C5 BA confirmed 2026-08-06. Missing Phone in list is not a defect; Teams in list, missing Phone/detail fields, unsupported roles and missing Remove User Access remain DEV gaps.
- **BA Confirmation:** Confirmed C5 — Dev fix narrowed scope
- **Codex Audit Log:** Reconciled 2026-08-09

### GAP-P4-SET-003 — Event scope and business detail

- **Phase / Module:** Phase 4 / Audit Log
- **Priority:** P1
- **Current Status:** Fail
- **Previous Result:** Still Open
- **Reference:** P4-SET-04
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
- **Test Data:** Dùng dữ liệu test riêng trong Project TEST. Nếu chưa có dữ liệu bắt buộc, ghi Blocked và nêu rõ dữ liệu còn thiếu.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Audit Log; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Audit Log, kiểm tra chức năng "Event scope and business detail" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: DevInt columns and filters work, but visible rows are dominated by auth.login.sso, auth.logout and access.role_elevated technical records with session/user IDs..
8. Kiểm tra hướng sửa đã chốt: Exclude authentication/session activity from the Phase 4 administrative Audit Log or move it to a separate security log. Format allowed admin events as clear business sentences with actor and changed values..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** Audit Log contains administrative/settings mutations only and writes Detail as a clear business sentence with enough before/after context.
- **Evidence:** evidence/phase4_2026-07-24/P4-AUDIT-dev.png; evidence/phase4_2026-07-24/P4-AUDIT-mock.png
- **Gap / Comment:** BA confirmed 2026-07-24: filters/columns pass, but event scope/detail must match administrative business audit only.
- **BA Confirmation:** BA Confirmed 2026-07-24
- **Codex Audit Log:** Pending

### GAP-P4-SET-004 — Team/User guardrails

- **Phase / Module:** Phase 4 / Destructive confirmations
- **Priority:** P1
- **Current Status:** Not Run
- **Previous Result:** Still Open
- **Reference:** P4-SET-05
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
- **Test Data:** Project TEST; một Team có member và một Team không có member; Team Lead để trống khi case yêu cầu.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Destructive confirmations; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Destructive confirmations, kiểm tra chức năng "Team/User guardrails" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: DevInt Team uses an Active/Deactive dropdown plus Save, and non-admin User Detail exposes no Remove User Access action, so required confirmation paths are absent/unreachable..
8. Kiểm tra hướng sửa đã chốt: Implement explicit Deactivate/Restore Team actions with confirmation and Remove User Access with typed target confirmation. Keep Cancel non-mutating and dependency reasons visible..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** Deactivate/restore Team and deactivate/remove User access require a target-specific confirmation; Remove User Access requires typed target confirmation.
- **Evidence:** evidence/phase4_2026-07-24/P4-AUDIT-dev.png
- **Gap / Comment:** BA confirmed 2026-07-24: dev must add Phase 4 Team/User guardrail confirmations. No destructive/status mutation was submitted.
- **BA Confirmation:** BA Confirmed 2026-07-24
- **Codex Audit Log:** Pending

### GAP-P4-SET-005 — Notification Preferences scope

- **Phase / Module:** Phase 4 / Settings navigation
- **Priority:** P2
- **Current Status:** Not Run
- **Previous Result:** Still Open
- **Reference:** P4-SET-06
- **Preconditions:** DevInt truy cập được và không có lỗi tải trang nghiêm trọng.
Đăng nhập bằng đúng role nêu trong case; nếu case không nêu role thì dùng Workspace Admin.
- **Test Data:** Dùng dữ liệu test riêng trong Project TEST. Nếu chưa có dữ liệu bắt buộc, ghi Blocked và nêu rõ dữ liệu còn thiếu.
- **Steps:** 1. Mở https://rally-dev.qnsc.vn/ và xác nhận đúng tài khoản/role của case.
2. Chọn Workspace/Project/Team theo Test Data; ghi lại scope trước khi thao tác.
3. Mở Settings navigation; chụp trạng thái ban đầu nếu case liên quan UI, số liệu hoặc quyền.
4. Thực hiện nghiệp vụ: Tại màn hình Settings navigation, kiểm tra chức năng "Notification Preferences scope" theo Expected Result..
5. Kiểm tra ngay UI, validation, quyền thao tác và các giá trị thay đổi so với Expected Result.
6. Reload trang hoặc chuyển sang màn hình liên quan rồi quay lại; xác nhận dữ liệu và scope vẫn đúng.
7. So sánh với lỗi/kết quả cũ: DevInt Settings shows Notification Preferences and opens an Available in a future release placeholder..
8. Kiểm tra hướng sửa đã chốt: Remove the Settings entry from the Phase 4 delivered navigation. Track future preference configuration in Future Backlog rather than exposing an in-scope placeholder..
9. Ghi Actual Result, chọn Current Status, điền Evidence và Gap/Comment trong chính dòng case.
- **Expected:** Notification Preferences is removed from the Phase 4 baseline; notifications are fixed to assignment and Note mention events.
- **Evidence:** evidence/phase4_2026-07-24/P4-AUDIT-dev.png
- **Gap / Comment:** C6 was explicitly not confirmed. Notification Preferences belongs to Future Backlog and must be hidden from the Phase 4 delivered navigation.
- **BA Confirmation:** C6 Not Confirmed — Dev hide entry
- **Codex Audit Log:** Reconciled 2026-08-09

## Phase 5 Scenarios Index

| ID | Priority | Objective | Current Status | Previous Result |
|---|---:|---|---|---|
| P5-PI-001 | P0 | Portfolio Items navigation | Not Run | Pass / BA accepted 2026-07-28. Feature baseline smoke plus iterative Epic in-app browser review completed. |
| P5-PI-002 | P0 | Project/Team-scoped list | Not Run | Pass / BA accepted 2026-07-28. Final Type/context behavior reviewed in app. |
| P5-PI-003 | P0 | Workspace Admin inline edit | Not Run | Pass / BA accepted 2026-07-28. Type-specific inline controls reviewed in app. |
| P5-PI-004 | P0 | Project Admin managed Project | Blocked | Not Run |
| P5-PI-005 | P0 | Project Admin unmanaged Project | Blocked | Not Run |
| P5-PI-006 | P0 | Project Member read-only Portfolio | Blocked | Pass (runtime smoke 2026-07-26) |
| P5-PI-007 | P0 | Project-scoped Release options | Not Run | Pass (runtime smoke 2026-07-26) |
| P5-PI-008 | P0 | Create Feature paths | Not Run | Not Run |
| P5-PI-009 | P0 | Feature detail backing fields | Not Run | Pass (runtime smoke 2026-07-26: seeded backing state visible; edit persistence remains BA/UAT path) |
| P5-PI-010 | P0 | Archive Feature | Not Run | Pass (runtime smoke 2026-07-26 plus toolbar amendment 2026-07-28) |
| P5-PI-011 | P0 | Archived Feature child guard | Not Run | Not Run |
| P5-PI-012 | P0 | Feature progress/detail panel | Not Run | Pass 2026-07-28. Browser DOM on FE-318 confirmed Preliminary Estimate in the right rail, then State/Release/Milestone/Creation Date followed immediately by both Refined fields; New Feature also exposes Preliminary Estimate. Prior formula and Plan Estimate checks passed 2026-07-26. |
| P5-PI-022 | P0 | Portfolio list Percent Done columns | Not Run | Pass (runtime smoke 2026-07-27: headers present, generic Progress header absent, FE rows show points/count denominators such as 0% (0/6) and 0% (0/2), 8 progress-bar nodes rendered, sort header active, console errors empty) |
| P5-PI-013 | P1 | Children tab work-item behavior | Not Run | Not Run |
| P5-PI-014 | P1 | Child row detail routing | Not Run | Not Run |
| P5-PI-015 | P1 | Build and smoke evidence | Blocked | Partial Pass (build + WA/PM smoke 2026-07-26; full PA managed/unmanaged path still BA/UAT Not Run) |
| P5-PI-016 | P0 | Feature child Work Item creation | Not Run | Pass (runtime smoke 2026-07-26: FE-315 created US-4822 via shared Add Item flow and detail showed FE-315) |
| P5-PI-017 | P0 | Work Item Feature field | Not Run | Partial Pass (runtime smoke 2026-07-26: same-Project active Feature options and selected value verified; Project-change invalid-clear remains BA/UAT Not Run) |
| P5-PI-018 | P0 | Backlog-to-Iteration movement | Not Run | Pass (runtime smoke 2026-07-26: US-4822 moved to Sprint 24.3, left Backlog and appeared in Iteration Status) |
| P5-PI-019 | P0 | Return item to Backlog | Not Run | Pass (runtime smoke 2026-07-26: US-4822 returned to Backlog after setting Iteration back to Unscheduled) |
| P5-PI-020 | P0 | Task Estimate-first copy | Not Run | Pass (runtime smoke 2026-07-26: TA-482201 copied Estimate 4 to To Do 4; later Estimate 6 left To Do unchanged) |
| P5-PI-021 | P0 | Task Complete hour rule | Not Run | Pass (runtime smoke 2026-07-26: TA-482201 Completed set To Do 0; In-Progress did not restore; Actual 3 remained independent) |
| P5-PI-028 | P0 | Epic rows in All Teams | Not Run | Pass / BA accepted 2026-07-28. |
| P5-PI-029 | P0 | Team context blocks Epic list | Not Run | Pass / BA accepted 2026-07-28. |
| P5-PI-030 | P0 | New Epic create paths | Not Run | Pass / BA accepted 2026-07-28. |
| P5-PI-031 | P0 | Feature parent Epic assignment | Not Run | Pass / BA accepted 2026-07-28. |
| P5-PI-032 | P0 | Epic Detail and Children | Not Run | Pass / BA accepted 2026-07-28. |
| P5-PI-033 | P0 | Epic progress formulas | Not Run | Pass / BA accepted 2026-07-28. |
| P5-PI-034 | P0 | Epic archive child guard | Not Run | Pass / BA accepted 2026-07-28. |
| P5-PI-035 | P0 | Header Type selector | Not Run | Pass / BA accepted 2026-07-28. |
| P5-PI-036 | P0 | Search, create and Show Fields toolbar | Not Run | Pass / BA accepted 2026-07-28. |
| P5-PI-037 | P0 | Root-row bulk actions | Not Run | Pass / BA accepted 2026-07-28. |
| P5-PI-038 | P1 | Child Feature rank display | Not Run | Pass / BA accepted 2026-07-28. |
| P5-PI-039 | P0 | Epic has no Release assignment | Not Run | Pass / BA accepted 2026-07-28. |
| P5-RT-001 | P0 | Release Tracking scope disposition | Not Required | Superseded / Not applicable 2026-07-28 by BA scope decision. |
| P5-CP-001 | P0 | Capacity Planning navigation | Not Run | Pass (runtime smoke 2026-07-26) |
| P5-CP-002 | P0 | New plan modal | Not Run | Pass (build 2026-07-26; browser re-smoke pending after allocation revision) |
| P5-CP-003 | P0 | Create plan uniqueness | Not Run | Pending re-smoke |
| P5-CP-004 | P0 | Teams by Total summary | Not Run | Pass 2026-07-27: browser smoke on CP-001 after build |
| P5-CP-005 | P0 | Manual capacity | Not Run | Pending re-smoke |
| P5-CP-006 | P0 | Add/Remove Teams | Not Run | Pending re-smoke |
| P5-CP-007 | P0 | Add Features to Team | Not Run | Pending re-smoke after 2026-07-27 amendment |
| P5-CP-008 | P0 | Assign and split allocation | Not Run | Pending re-smoke |
| P5-CP-009 | P0 | Expanded Feature list | Not Run | Pass 2026-07-27: browser smoke on CP-001 / Data & Reporting expanded row |
| P5-CP-013 | P0 | Capacity progress hover breakdown | Not Run | Pass 2026-07-27: browser smoke verified tooltip content by focus/click interaction. Re-smoked 2026-07-28 under P5-CP-030 for fixed overlay and warnings |
| P5-CP-014 | P0 | Record-detail tab state | Not Run | Pass 2026-07-27: CP-001. Teams by Total set to Capacity (row order became 10/8/5, proving the sort actually applied and not just the label - Core Platform capacity was first lowered 13 -> 5 because the seeded 13/10/8 values happened to make name-sort and capacity-sort identical). Features set to Estimated, which also surfaced the footer hint Capacity cutline is hidden while sorted by estimated; sort by Rank to view it.. Switching Features -> Teams by Total -> Features preserved Capacity + 10/8/5 order and Estimated + the cutline hint independently. Note: leaving the record entirely (to Portfolio Items) and reopening resets both tabs to default sort, which matches the documented scope "while the record is open" |
| P5-CP-015 | P0 | Features allocation and cutline | Not Run | Pending browser smoke after record-detail v2 |
| P5-CP-016 | P1 | Capacity forecast | Not Run | Pass 2026-07-27: CP-001. Dialog states it is a Draft-only aid and that capacities may be overwritten afterwards. Changing Historic velocity/team from 24 to 30 recomputed the proposal live (24/19/22 -> 30/24/27). Apply wrote Core Platform 5 -> 30, Data & Reporting 10 -> 27, Identity & Access 8 -> 24; plan Capacity total 23 -> 81 and Rollup percentages rebased (Core Platform 3 pts read 60% of 5, then 10% of 30). Demand stayed 8, confirming forecast touches Capacity only and never allocation values. Values remained editable after apply (Identity & Access 24 -> 12, total 81 -> 69). Control absence after Publish verified in P5-CP-010 |
| P5-CP-017 | P0 | Features-tab Add Feature and Team Capacity rail | Not Run | Pass 2026-07-27: the seed-data blocker was resolved by creating the precondition through the product itself instead of editing seed data - a new NXP Feature FE-323 UAT Probe - Capacity Add Feature (Release Unscheduled, so eligible) was created via Portfolio Items > New Feature. Before: dialog showed No matching Features found / 0 items and the header read 2 Eligible. After: header read 3 Eligible, and the dialog listed only FE-323 with Allocation Not in plan while correctly excluding FE-318 and FE-315 (already in the Plan). Adding it produced a Not assigned Features row with Rank — and Estimated Not refined; plan counters moved 2 -> 3 Features and 1 -> 2 Unassigned; Teams by Total showed it under Unallocated Features in Plan with value 0 and 2 allocation rows waiting for Team; Team Capacity rail and header Demand 8 were unchanged, confirming no Team was auto-assigned and no demand was invented |
| P5-CP-010 | P0 | Publish behavior | Not Run | Partial Pass 2026-07-27 - one defect found (P5-CP-DEF-001). Probe setup: FE-323 (Release = Unscheduled, Team = Core Platform) was allocated to a *different* Team, Identity & Access, so a Team overwrite would be visible. Publish Without Updating Fields: status Draft -> Published, banner shown, and FE-323 Release stayed Unscheduled - visibility only, no field write. Published state is genuinely read-only, not just visually disabled: the accessibility tree contained no capacity textbox, no Add Team, no Calculate Capacity Forecast, no Assign-to-Team, no Split/Remove and no Add Feature/Allocate on either tab - only navigation plus Revert to Draft. Revert to Draft restored every control with all values intact. Full Publish: FE-323 Release Unscheduled -> Nexus Platform Q1 2025 (written), while Team stayed Core Platform and Project stayed NXP despite the Identity & Access allocation, and FE-318's children DE-1138/DE-1145 kept Release Nexus Platform Q4 2024 (no cascade). Defect: the plannedEndDate half of the write is silently lost - see P5-CP-DEF-001 below |
| P5-CP-DEF-001 | P0 | DEFECT - Publish loses Planned End Date | Not Run | Fixed and retested Pass 2026-07-27. Fix reused the existing toDateInputValue helper (promoted from IterationsPage to model.ts) inside the publish writer rather than adding new conversion code. Retest on FE-315: plannedEndDate 2025-02-15 -> 2025-02-01, rendering as 02/01/2025 instead of blank; plannedStartDate correctly still carries the human-readable Nov 1, 2024 because that field is free text by design. Timeboxes/Milestones unaffected by the helper move. Original finding kept below for traceability. Original Fail 2026-07-27. After Publish, FE-323 showed Planned Start Date = Nov 1, 2024 but Planned End Date rendered empty. Root cause is a format mismatch, not a missing write: App.tsx:262-263 writes plannedStartDate: release?.startDate and plannedEndDate: release?.releaseDate, and REL-002 stores human-readable strings (startDate: "Nov 1, 2024", releaseDate: "Feb 1, 2025"). Planned Start Date is a free-text field per the P5.1 SRS so it displays fine, but Planned End Date is an <input type="date">, which only accepts ISO YYYY-MM-DD and therefore discards "Feb 1, 2025". DOM probe confirmed {type:"date", value:""} for Planned End Date versus {type:"text", value:"Nov 1, 2024"} for Planned Start Date. The seeded Features use ISO for this field (FE-318 plannedEndDate: "2025-01-31"), so the data contract is ISO and the publish writer is the side that is wrong. Fix requires converting the Release date to ISO on write (or normalising ReleaseItem date storage); awaiting BA decision before any code change |
| P5-CP-011 | P0 | RBAC | Blocked | Partial Pass 2026-07-27 - one path not executable on current seed. Workspace Admin: full manage in every Project, Add New present in both NXP and MOB. Project Admin in managed NXP: Add New present and manage rights proven by action, not just by control visibility - PA successfully executed Revert to Draft on the Published CP-001 and regained every Draft control. Project Admin in unmanaged MOB: list is readable but Add New is absent, and it reappears for Workspace Admin in the same Project, so the gate is role x project rather than a global switch. Project Member in NXP / Core Platform: Add New absent; list Teams in Plan read 1 instead of 3; plan detail rendered only the Core Platform row and the accessibility tree had no capacity textbox, no Publish/Revert, no Add Team/Forecast and no Assign/Split/Remove; Quality and Reports nav entries were hidden. Not executable: "PA in an unmanaged Project sees plan *detail* read-only" - MOB has zero seeded Releases, so the New Capacity Plan Release selector is empty (optionCount: 0) and no MOB plan can exist to open. Closing this needs a seeded MOB Release, which was deliberately not added without BA approval. Note also that the ContextBar Project:/Team: selectors are decorative (CtxSelect in layout.tsx has no onClick); real scope switching is the workspace button in TopNav |
| P5-CP-012 | P1 | Build and smoke evidence | Not Run | Pass (build + runtime smoke 2026-07-26; Vite chunk-size warning only) |
| P5-CP-018 | P0 | Graded Capacity Planner permission (historical three-row version) | Not Required | Superseded 2026-07-28; prior three-row behavior passed 2026-07-27 |
| P5-CP-019 | P0 | Project Member sees only Published plans | Blocked | Pass 2026-07-27: while CP-001 was Draft the list showed Total Plans: 0 / No items found - previously the Draft plan was visible to a Project Member, so this is corrected behavior. After Publish Without Updating Fields the same plan appeared and opened read-only showing only the Core Platform row. Enforced in both the list filter and the active-plan resolver, so a Draft plan cannot be reached through stale state either |
| P5-CP-020 | P0 | Team-level Add Features lists the whole Project and keeps added rows | Not Run | Pass 2026-07-27: Core Platform dialog listed all 4 NXP Features including FE-311 (Release Q4 2024) and FE-308 (Q2 2025), which the old Release-filtered list had hidden. Columns render ID / Name / Project / Team plus the existing Allocation status. FE-318, already allocated to Data & Reporting in this plan, stayed in the list greyed out with a green ✓ Added badge and a disabled checkbox, so it cannot be double-added. Header reads Total Work Items: 4 · 3 available to add. Adding FE-315 moved its existing Unallocated row to the Team and preserved its value 5, and Demand went 8 -> 13; FE-308 was added with value 0 |
| P5-CP-021 | P0 | Rank reorder from the per-row settings menu | Not Run | Pass 2026-07-27: gear icon renders as the new leading column on every Feature row with a matching blank header cell. On Core Platform holding FE-318 (rank 2) and FE-308 (rank 4), Move down was disabled on the last row and Move up on the first, flipping correctly as position changed. Move up on FE-308 swapped the pair to rank 2 / rank 4 and the display order followed; Move down restored it. Data & Reporting kept Features 1 and Rollup 5 throughout, confirming the swap is scoped to the acting Team. Menu closes after each action and via click-away |
| P5-CP-022 | P0 | Allocate from the Team row settings menu | Not Run | Pass 2026-07-27: the gear menu now reads Move up / Move down / separator / Allocate. Choosing Allocate on FE-318 opened Allocate to Teams showing FE-318 · Advanced Reporting Module, header row FE-318 / Advanced Reporting Module / L / 8, existing split rows Data & Reporting 5 and Core Platform 3, + Add Team, and Total allocated: 8 points. Cancel left the plan untouched |
| P5-CP-023 | P0 | Estimated priority - Team Allocated then Refined then Preliminary | Not Run | Pass 2026-07-28. FE-318 showed 8 Allocated for Team allocations 5 + 3; after both Team allocations were set to 0, it showed 8 Refined. FE-315 retained 5 Preliminary although its Unallocated placeholder held 5, proving the placeholder is excluded. |
| P5-CP-024 | P0 | Allocation is edited only through the Allocate dialog | Not Run | Pass 2026-07-28; amended by BA after test. Expanded FE-318 exposed the Allocate dialog through settings; the later BA direction removed Remove from Team, leaving Remove from Plan as the only removal action. No inline allocation editor, Split control or Unallocated section remains. |
| P5-CP-025 | P0 | Allocation origin column on the expanded Team Feature table | Not Run | Pass 2026-07-27: FE-318 is owned by Data & Reporting in Portfolio Items and is split across both Teams in CP-001. Its row under Core Platform read From Data & Reporting while its row under Data & Reporting read —, so the column attributes the split to the origin Team and stays silent on the origin's own row. Hover text on each state explains the attribution. Dependencies showed — on every row with a tooltip stating it is not modelled in this slice. Both new columns are read-only. With nine columns the table now scrolls horizontally: measured scrollWidth 1180 against clientWidth 1103, and scrolling to the end revealed the Estimated column intact |
| P5-CP-026 | P0 | Temporary single Capacity Planner Full/View permission | Blocked | Pass 2026-07-28. With Project Admin set to R, the plan list/detail and Sort remained visible while Add New, Add Team, Capacity inputs, Feature settings/Allocate/Remove and both Publish actions were absent. Reload restored the default matrix and Workspace Admin Full state. |
| P5-CP-027 | P0 | Remove split Feature from Plan | Not Run | Pass 2026-07-28. Removing FE-318 from Plan cleared it from Core Platform and Data & Reporting, changed both Team Feature counts to 0, removed the Feature text from the plan and recalculated Demand to 0. |
| P5-CP-028 | P0 | Remove one allocation from Team | Not Required | Superseded 2026-07-28. Historical pass retained only for traceability; do not use this as a current acceptance requirement. |
| P5-CP-029 | P0 | Live Complete/Rollup/Estimated and Team-split display | Not Run | Pass 2026-07-28. FE-318 total showed Complete 0 / Rollup 6 / Estimated 8; Data & Reporting showed 0 / 6 / 5, Core Platform 0 / 0 / 3. Feature rows and Feature tooltip contained numbers only; Data & Reporting Team row/tooltip retained 0 (0%) / 6 (60%) / 5 (50%) against Capacity 10. FE-315 showed 5 / 5 / 5; changing US-4798 Completed -> In-Progress changed it to 0 / 5 / 5. Clean reload had no new console errors. |
| P5-CP-030 | P0 | Exceed warnings on Capacity Plan progress bars | Not Run | Pass 2026-07-28. Seeded Data & Reporting row (Rollup 6, Estimated 5) displayed the warning triangle and tooltip text; the expanded FE-318 row under Data & Reporting also displayed Rollup exceeds Estimated. Tooltip used fixed overlay and was not clipped by the grid. Build passed with only the standard Vite chunk-size warning. |
| P5-CP-031 | P0 | Features tab Rally-style grid rebuild | Pass | C8 BA confirmed the DevInt order `Dependencies, Rollup, Estimated, Complete`; previous expected order was stale documentation. Closed / Not a Defect on 2026-08-09. |
| P5-CP-032 | P0 | Features tab quick Planned Team Assignment | Not Run | Pass 2026-07-28. Browser smoke confirmed FE-315 showed the yellow ⚠ Not assigned combobox with Teams Core Platform, Identity & Access, and Data & Reporting; FE-318 stayed as 2 teams with split allocation subrows and no inline one-Team selector. Build passed with only the standard Vite chunk-size warning. |
| P5-CP-033 | P0 | Capacity Plan ranking, warnings and summary breakdown polish | Not Run | Pass 2026-07-28. Browser smoke confirmed FE-318/FE-315 ranks displayed 1/2, FE-318 menu contained Move up, Move down, Allocate, Remove from Plan, Data & Reporting showed Rollup exceeds Estimated in the Feature subrow and Team Capacity rail, Breakdown opened By Points with Complete/Rollup/Estimated/Capacity totals, and Publish actions rendered next to Back. Build passed with only the standard Vite chunk-size warning. |
| P5-CP-034 | P0 | Features-tab unassign and compact Breakdown refinement | Not Run | Pass 2026-07-28. Browser smoke on CP-001 confirmed FE-315 selector options changed to Unassign after assigning Core Platform, and selecting the empty option returned value "", text ⚠ Not assigned, yellow background/border, and Team options intact. DOM smoke confirmed the removed intro/sort bar text was absent, Add Feature remained, and the By Points Breakdown panel had four metric rows with one aligned bar segment each. Build passed with only the standard Vite chunk-size warning. |
| P5-CP-035 | P0 | Publish Release/date consistency | Not Run | DEV/QA acceptance coverage - production API behavior Not Run |
| P5-CP-DEF-003 | P0 | DEFECT - allocation added but row invisible | Not Run | Found and fixed 2026-07-27, introduced by the P5-CP-020 change. Widening the picker to all Project Features let a non-Release-matching Feature (FE-308, Q2 2025) be added, but every display lookup still resolved the Feature through eligibleFeatures, which excludes it - so getPlanFeature returned undefined and the row was silently dropped while the allocation still counted in the Team's Features total. Observed as Core Platform reporting Features 3 with only 2 rows rendered. Fixed by resolving all five display lookups against the full Feature list instead of the eligibility-filtered one, with a comment on getPlanFeature recording why an eligibility-filtered list must never be passed there; eligibleFeatures still governs what the plan-level picker offers. Re-verified: FE-308 now renders as a real row (rank 4, value 0) and the Team's Features count matches the rows shown |
| P5-CP-DEF-002 | P2 | DEFECT - Team sort unavailable to read-only viewers | Not Run | Fixed and verified 2026-07-27 (found 2026-07-27, pre-existing; not caused by the graded-permission change). Cause: the Sort select sat inside the editable-gated action bar at CapacityPlanningPage.tsx:636 alongside Add Team and Calculate Capacity Forecast, so it vanished whenever the plan was not editable, while the Features tab kept its own sort in the same states. Fix: the action bar now always renders on the Teams by Total tab and only the two mutating buttons carry the editable gate; the ml-auto on the Sort label keeps it right-aligned when those buttons are absent. Verified in both read-only paths - Published plan as Workspace Admin, and Draft plan as Project Admin with planner View - Sort renders, changing it to Capacity is accepted and retained, and Add Team/Calculate Capacity Forecast stay correctly hidden. Removes the read-only gap this had opened in P5-CP-014 |
| P5-RP-001 | P1 | Release Planning deferred gate | Not Required | Superseded / Not applicable to Phase 5 close |
| P5-CLOSE-001 | P0 | Closed scope consistency | Not Run | Pass 2026-07-28 |
| P5-CLOSE-002 | P0 | Dedicated developer handoff | Not Run | Pass 2026-07-28 |
| P5-CLOSE-003 | P0 | Build verification | Not Run | Pass 2026-07-28; existing Vite chunk-size warning only |
| P5-CLOSE-004 | P0 | Readiness boundary | Not Run | Pass 2026-07-28 |

## Phase 5 DevInt Execution Results — 2026-08-06

This section is the current DevInt execution result and overrides the older `Current Status` values in the Phase 5 scenario index above. Test scope used Workspace Admin in `QNSC / TEST / All Teams`; RBAC cases remain blocked as agreed.

### Controlled test data

| Record | Purpose | Final state |
|---|---|---|
| `EP-1` — P56-AUDIT Phase 5 Epic | Epic/Feature hierarchy | Active; contains `FE-2` |
| `FE-1` — P56-AUDIT Phase 5 Feature | Feature child creation/archive | Archived; child `US-3` persisted |
| `FE-2` — P56-AUDIT Phase 5 Active Feature | Capacity allocation and Publish | Active; allocated 8 points; Release/dates written by full Publish |
| `FE-3` — P56-AUDIT Phase 5 Rank Feature | Team Add Feature, rank and remove | Active Portfolio item; removed from Capacity Plan after test |
| `RE-1` — P56-AUDIT Phase 5 Release | Capacity Plan scope | `2026-08-07` to `2026-08-31` |
| `CP-1` — P56-AUDIT Phase 5 Capacity Plan | End-to-end Capacity Planning | Draft after Publish/Unpublish tests; Pegasus capacity 30; `FE-2` remains in plan |

### Status by Scenario ID

| Status | Count | Scenario IDs |
|---|---:|---|
| Pass | 38 | `P5-PI-001`, `002`, `010`, `012`, `022`, `014`, `018`, `019`, `020`, `021`, `028`, `029`, `030`, `031`, `032`, `034`, `035`, `036`, `039`; `P5-CP-001`, `002`, `003`, `004`, `007`, `009`, `016`, `017`, `020`, `021`, `022`, `024`, `031`; `P5-CP-DEF-001`, `P5-CP-DEF-002`; `P5-CLOSE-001..004` |
| Partial | 22 | `P5-PI-003`, `007`, `008`, `009`, `011`, `013`, `016`, `017`, `033`, `037`, `038`; `P5-CP-006`, `008`, `014`, `015`, `010`, `023`, `025`, `027`, `029`, `033`, `035` |
| Fail | 3 | `P5-CP-005`, `P5-CP-032`, `P5-CP-034` |
| Blocked | 7 | `P5-PI-004`, `005`, `006`, `015`; `P5-CP-011`, `019`, `026` |
| Not Required | 4 | `P5-RT-001`, `P5-CP-018`, `P5-CP-028`, `P5-RP-001` |
| Not Run | 4 | `P5-CP-012`, `P5-CP-013`, `P5-CP-030`, `P5-CP-DEF-003` |

### Confirmed live behavior

- Portfolio navigation, Epic/Feature type switch, Epic-only All Teams rule, creation, Feature-to-Epic parent link, Epic child expansion and Epic archive guard work.
- Feature child creation persists and routes to the shared Work Item Detail. The new child and rollup appeared only after reload, so refresh behavior is Partial.
- Capacity Plan creation works and duplicate `Project + Release` creation is blocked with `Every release in this project already has a plan.`
- Add/Remove Teams modal, plan-level Add Features, team-level Add Features, allocation dialog, manual allocation value, rank move, and Remove from Plan persistence work.
- Forecast works after Plan dates are entered: velocity `10` over the three-iteration window proposed `30` points and applied Capacity `30`.
- `Publish without updating fields` changes Draft to Published and removes edit actions. Unpublish restores Draft controls.
- Full Publish with Plan dates matching Release updated `FE-2` to Release `RE-1`, Planned Start `2026-08-07`, and Planned End `2026-08-31`.

### Failures for DEV handoff

| Scenario | Actual DevInt result | Expected / fix direction |
|---|---|---|
| `P5-CP-005` | Team Capacity renders as text (`Not entered` / `30 points`); no inline capacity editor is exposed in Draft. Capacity can currently be populated only through Forecast. | Restore Draft-only manual Capacity editing without changing allocations or live Feature estimates. |
| `P5-CP-032` | Selecting Pegasus in `Planned Team Assignment` changes allocation counters but the selector stays `Not assigned`; reload still shows `Not assigned`. | Persist and render the selected planned team from the same allocation ledger. |
| `P5-CP-034` | Because the quick planned-team selection does not persist/render, the selector never reaches a one-Team state and `Unassign` cannot be exercised from the Features grid. | Fix `P5-CP-032`, then ensure `Unassign` clears the team and keeps the Feature in the plan. |

### Partial / follow-up notes

- Several successful mutations show stale rows until a full reload: Feature child creation, planned-team selection, and Remove from Plan. DEV should invalidate/refetch the affected child/plan queries immediately after success.
- `P5-CP-006` tested add Team only; remove-and-restore was not repeated because only Pegasus is available and it owns the active allocation.
- Split-allocation, origin attribution, cross-Team warnings and exceed tooltips remain Partial/Not Run because only one usable Team exists in `TEST`.
- `P5-CP-010` and `P5-CP-035` passed both visibility-only Publish and the matching-date full Publish branch; mismatching Plan-vs-Release dates remain untested.
- `P5-CP-012` is a build/console-evidence case and was not executed against the deployed DevInt browser session.

## Phase 6 Scenarios Index

| ID | Priority | Objective | Current Status | Previous Result |
|---|---:|---|---|---|
| P6-COM-001 | P0 | Open Portfolio menu | Pass | Portfolio menu order is Portfolio Items, Capacity Planning, Release Tracking. |
| P6-COM-002 | P0 | Open Reports and inspect Type | Pass | Type contains exactly Iteration Burndown, Velocity and Team Capacity. |
| P6-COM-003 | P0 | Switch global Project/Team context | Pass | All Teams -> Pegasus updates Team Capacity scope and no duplicate local Project/Team filter appears. |
| P6-COM-004 | P0 | Test Workspace Admin, Project Admin and Project Member | Blocked | Only a Workspace Admin session is available; RBAC roles cannot be compared. |
| P6-COM-005 | P1 | Open each Phase 6 route with empty valid scope | Partial | Explicit empty states were confirmed in Reports and Release Tracking; a second empty Project is unavailable. |
| P6-COM-006 | P1 | Reload each selected view/filter | Fail | Reports and Release Tracking reset the selected view/filter after reload. |
| P6-RT-001 | P0 | Select a Release with Direct, Derived and Unparented data | Pass | RE-1 shows disjoint counts Direct 1, Derived 1 and Unparented 1. |
| P6-RT-002 | P0 | Switch bucket selector | Pass | Each selector shows only its own bucket and rank restarts at 1. |
| P6-RT-003 | P0 | Sort Rank, ID and Team both directions; resize columns | Partial | Rank, ID and Team sort states changed correctly; column resizing was not executed. |
| P6-RT-004 | P0 | Switch Chart Unit Points -> Count | Pass | Points -> Count changes units while bucket membership remains 1/1/1. |
| P6-RT-005 | P0 | Inspect Direct Feature status | Pass | Direct FE-2 uses its direct child even when that child has no Release; current status is 0/3 accepted. |
| P6-RT-006 | P0 | Inspect Derived Feature status | Pass | Derived FE-3 shows 3/3 points accepted without a percentage. |
| P6-RT-007 | P0 | Use Completed, Accepted and Release child states | Partial | Completed is excluded and Accepted is included; Release-state branch lacks controlled data. |
| P6-RT-008 | P0 | Compare Burnup totals to controlled Work Items | Pass | Controlled totals match UI: Planned 6 points, Accepted 3 points, Preliminary 0. |
| P6-RT-009 | P0 | Inspect Burnup history and axes | Pass | Missing history is shown explicitly with the correct Release title and date range. |
| P6-RT-010 | P1 | Create partial and full Release mismatch | Not Run | A second Release/non-null mismatch data set is unavailable. |
| P6-RT-011 | P1 | Click inside and outside Issues panel | Not Run | No qualifying mismatch exists, so the Issues panel cannot be opened. |
| P6-RT-012 | P0 | Inspect views and placeholders | Pass | Chart is active, Breakdown is absent and Dependencies is clearly marked Future. |
| P6-RT-013 | P1 | Search each bucket and open an Unparented row | Pass | Search matched US-4 and the row opened the shared Work Item Detail route. |
| P6-RT-014 | P0 | Select Project with no Releases and Release with empty bucket | Partial | Valid Release empty-bucket messaging passed; no second Project without Releases is available. |
| P6-IB-001 | P0 | Select Team and Iteration | Pass | Pegasus and IT-1 are selectable and the report shows the correct Iteration dates. |
| P6-IB-002 | P0 | Compare daily Task ToDo snapshots | Not Run | No daily Task ToDo snapshot history exists. |
| P6-IB-003 | P0 | Accept a Story/Defect on a controlled date | Not Run | No historical accepted-date snapshot data exists. |
| P6-IB-004 | P0 | Reopen accepted work after prior snapshots | Not Run | No prior snapshot baseline exists for reopen comparison. |
| P6-IB-005 | P0 | Add/remove/re-estimate Tasks after Iteration start | Not Run | No start baseline/history exists for an auditable comparison. |
| P6-IB-006 | P1 | Compare latest Remaining ToDo with Ideal | Not Run | No plotted series exists because daily history is empty. |
| P6-IB-007 | P0 | Switch Team -> All Teams | Not Run | Only one usable Team/Iteration data set exists, so aggregation cannot be compared. |
| P6-IB-008 | P0 | Test no Iteration, no work and missing snapshots | Pass | Explicit no-burndown, no daily history and no start-baseline messages are displayed. |
| P6-VEL-001 | P0 | Inspect eligible Iterations | Not Run | No ended Iteration with scheduled work exists. |
| P6-VEL-002 | P0 | Seed During, After and Not Accepted items | Not Run | Required historical acceptance data is unavailable. |
| P6-VEL-003 | P0 | Use Accepted/Release/Completed states | Not Run | No eligible completed Iteration exists for state comparison. |
| P6-VEL-004 | P0 | Move Work Item into/out of completed Iteration | Not Run | No controlled completed Iteration exists. |
| P6-VEL-005 | P0 | Reopen and re-accept an item | Not Run | No historical accepted-date data exists. |
| P6-VEL-006 | P0 | Switch Last 5/Last 10 | Pass | C7 BA confirmed default Last 10, toggle 5/10 and persistence. Previous Last-5 expectation was stale documentation; closed / Not a Defect on 2026-08-09. |
| P6-VEL-007 | P1 | Use fewer than three Iterations | Not Run | No eligible Iteration exists. |
| P6-VEL-008 | P0 | Use Accepted/Release item without acceptedDate | Not Run | Required malformed historical test record is unavailable. |
| P6-VEL-009 | P0 | Select Team and All Teams | Not Run | There is no eligible velocity data to compare Team aggregation. |
| P6-VEL-010 | P0 | Select a scope with no eligible Iteration | Pass | Explicit No completed iterations state replaces the previous endless Loading state. |
| P6-TC-001 | P0 | Select Team and Iteration | Pass | Pegasus and IT-1 load successfully with the correct reporting scope. |
| P6-TC-002 | P0 | Select All Teams | Pass | All Teams view loads and can switch back to Pegasus. |
| P6-TC-003 | P0 | Compare four totals to Team Status/Tasks | Pass | Cards show Capacity 60h, Estimate 4h, ToDo 0h and Actual 0h. |
| P6-TC-004 | P0 | Sum member -> Team -> All Teams | Pass | Member rows reconcile to the Team totals for the available data. |
| P6-TC-005 | P1 | Member has capacity but no Task | Pass | Anh shows Capacity 60h with Estimate/ToDo/Actual all 0h. |
| P6-TC-006 | P1 | Task owner has no capacity | Pass | Hieu shows Capacity 0h and Estimate 4h without dropping the Task total. |
| P6-TC-007 | P1 | Use unassigned Task | Not Run | No unassigned Task is available. |
| P6-TC-008 | P0 | Use Estimate 6, ToDo 2, Actual 8 | Not Run | The required controlled Task values are unavailable. |
| P6-TC-009 | P0 | Change Iteration | Not Run | Only one usable Iteration exists. |
| P6-TC-010 | P0 | Inspect report controls | Pass | Show Fields, sortable columns, utilization/progress visuals and report cards are present; no editor is exposed. |
| P6-TC-011 | P0 | Test no capacity and no Task data | Not Run | No valid zero-capacity/zero-task Team and Iteration branch is available. |
| P6-E2E-001 | P0 | Create Epic -> Feature -> Story/Defect -> Task and assign Iteration/Release | Fail | Create with details silently created duplicate/orphan Work Items while leaving the dialog open and showing no confirmation. |
| P6-E2E-002 | P0 | Complete Tasks, accept parent and publish/report | Fail | Work Item state update did not persist/mirror reliably; Schedule/Flow returned to Idea after reload and reporting did not count it as accepted. |
| P6-E2E-003 | P0 | Change Project/Team/Release/Iteration context | Partial | Project/Team scope changed correctly; only one Release and one Iteration prevent cross-context validation. |
| P6-E2E-004 | P0 | Reload and sign out/in after mutations | Partial | Record data persisted in several flows, but report filters reset on reload; sign-out/in was not repeated. |

## Phase 6 DevInt Execution — 2026-08-06

**Scope:** Project `TEST`, Team `Pegasus`, Release `RE-1`, Iteration `IT-1`; tested Reports and Release Tracking using the signed-in Workspace Admin account. RBAC comparison remains blocked.

### Final count

| Result | Count | Conclusion |
|---|---:|---|
| Pass | 23 | Expected behavior was observed with available data, including C7-reconciled Velocity default. |
| Partial | 6 | Main branch passed, but another branch lacks data or a manual interaction. |
| Fail | 3 | DevInt conflicts with the approved Phase 6 contract or the shared Work Item rules. |
| Blocked | 1 | Requires Project Admin and Project Member accounts. |
| Not Run | 20 | Requires snapshots, historical Iterations, a second Release/Project/Iteration, or controlled Task data. |

### Failures for DEV handoff

| Scenario | Actual DevInt result | Expected / fix direction |
|---|---|---|
| `P6-COM-006` | Reload resets Reports Type/window and Release Tracking Chart Unit/bucket. | Preserve the selected Phase 6 view/filter state across reload using the agreed URL or client preference mechanism. |
| `P6-E2E-001` | In Feature Children, `Create with details` created records silently while the modal stayed open. Repeated clicks produced extra Work Items before `Create Item` closed the dialog. | One user submission must create exactly one record. Show success, close/navigate as designed, and disable/debounce submission while saving. |
| `P6-E2E-002` | A controlled child changed to Accepted did not persist/mirror reliably. After reload, Schedule State and Flow State returned to Idea, and Direct Feature status remained `0/3 points accepted`. | Persist Work Item state changes and enforce two-way Schedule State/Flow State mirroring before refreshing Release Tracking and report totals. |

### Controlled data and key evidence

- Release Tracking showed Direct `1`, Derived `1`, Unparented `1`; Points totals were Planned `6`, Accepted `3`, Preliminary Feature Estimate `0`.
- `FE-3` Derived status showed `3/3 points accepted` without a percentage; `US-4` Completed was excluded from Accepted totals.
- Rank, ID and Team sorting changed between ascending/descending states; column resize remains a manual follow-up.
- Iteration Burndown explicitly reported no daily history and no start baseline for `IT-1`.
- Velocity now has a correct explicit `No completed iterations` empty state; the former endless Loading result is closed.
- Team Capacity reconciled to Capacity `60h`, Estimate `4h`, ToDo `0h`, Actual `0h`; member rows preserved both capacity-without-task and task-without-capacity cases.
- Browser handoff was left open on DevInt Release Tracking for BA review.

## Current Execution Results

These results are from the read-only Carryover retest on 2026-08-05. They override the `Pending` placeholder inside the relevant case until the formal Excel result is updated.

| ID | Result | Evidence / conclusion |
|---|---|---|
| GAP-P0-SHELL-002 | Pass — Not a Defect | C2 confirmed Portfolio Items, Capacity Planning and Release Tracking; Release Planning is Future Backlog. |
| GAP-P0-SHELL-004 | Pass | Track menu label is `Iteration Status`; Team Status is also present. |
| GAP-P1-BL-001 | Blocked | TEST has no Backlog rows. Browser keyboard `Ctrl+A` did not select the full search value, so this cannot distinguish an automation limitation from a product defect. Manual retest with backlog data is required. |
| GAP-P1-BL-002 | Partial | Priority filter exists with None, Low, Normal, High and Urgent. Defect-only filtering and Story dash behavior need real records. |
| GAP-P1-BL-004 | Partial | Header sort controls are available for Rank, ID, Name, Schedule State, Priority and Est.; ID changed to ascending state. No rows exist to prove sort order and rank preservation. |
| GAP-P1-CREATE-003 | Pass — Not a Defect | C1 confirmed Team optional: `No team` means Project backlog; selected Team must belong to Project. |
| GAP-P1-CREATE-006 | Fail | Owner defaults to Unassigned/No Entry. After Hieu was added to Pegasus, Settings showed him as a member but the US-1 Owner dropdown still listed only No Entry and Anh; Owner membership options are stale/inconsistent. |
| GAP-P1-CREATE-008 / 009 | Blocked | State defaults and persistence require a submitted Work Item. Submission would create deployed data and was not performed. |
| GAP-P1-WID-008 | Pass — Not a Defect | C1 confirmed the same optional-Team rule for Quick Create and Detail. |
| GAP-P1-TEAM-001 | Pass | New Team form shows optional `Team lead` without required marker and offers `— No lead —`; create remains available after other required fields are supplied. |
| GAP-P2-IT-001 | Fail | C9 confirms Project omission in single-project scope; only missing Task Estimate remains a defect. |
| GAP-P2-IS-003 | Pass — Not a Defect | C3 confirms no Type column; ID prefix/glyph identifies US/DE. |
| GAP-P2-IS-004 / 005 | Mixed | Separate results retained: per-row Defects column fails; List/Board toggle passes. |
| GAP-P3-TS-001 to GAP-P3-TS-007 | Blocked | Team Status shows `No iterations in this project/team yet`; all Team Status list/task behavior requires an Iteration with Work Items. |
| GAP-P3-QA-001 | Blocked | Quality > Defects exposes Add New but has no defects. Creating/submitting a Defect would mutate deployed data and was not performed. |
| GAP-P4-NOTIF-001 / 002 / 003 | Blocked | Notification Center is empty (`You're all caught up`); event, unread-count and read-persistence branches need generated notification data. |
| GAP-P4-SET-001 | Partial | Workspace Settings shows read-only Slug and Workspace Admin identities, but no explicit single-company scope. |
| GAP-P4-SET-002 | Fail | C5 confirms Phone is Detail/Profile-only and not required in list. Teams in list, unsupported roles and missing detail actions remain defects. |
| GAP-P4-SET-003 | Fail | Audit Log contains `auth.login.sso` and `access.role_elevated` technical events; Detail is technical label/ID rather than an administrative business sentence with before/after context. |
| GAP-P4-SET-004 | Fail — side effect observed | Selecting `Deactive` for Team Pegasus saved immediately with toast `Status updated`; no target-specific confirmation was shown. With BA approval, Pegasus was restored to Active and DevInt displayed `Active 1 / Deactive 0`. |
| GAP-P4-SET-005 | Fail | Notification Preferences is still shown in Settings navigation, despite the approved Phase 4 scope removing it. |

## Carryover Completion — 2026-08-05

The controlled data set used for this completion was `P56-AUDIT Carryover Sprint` (IT-1), `P56-AUDIT Carryover Story` (US-1), `P56-AUDIT Carryover Defect` (DE-1) and `P56-AUDIT Carryover Task` (TA-1), all in Project TEST / Team Pegasus.

| ID | Final result | Evidence / reason |
|---|---|---|
| GAP-P1-BL-001 | Fail | Searching worked, but clearing with normal automation interaction left `P56-AUDIT Carryover Story` in the search box and the list remained filtered until reload. The required clear-without-reload behavior is not reliable. |
| GAP-P1-BL-002 | Fail | Priority filter offers the values, but selecting `None` kept both the Defect and the Story visible. Story rows must remain dash/not be treated as Priority `None`. |
| GAP-P1-BL-004 | Pass | ID header sorted DE-1 before US-1; selecting Rank restored US-1 then DE-1. Reload restored default rank order, with no persisted field mutation observed. |
| GAP-P1-CREATE-008 / 009 | Pass | New US-1 persisted default Schedule State = Idea and Flow State = Idea on Detail after creation. |
| GAP-P2-IS-003 | Pass — Not a Defect | C3 confirms no Type column; ID prefix/glyph is the approved type indicator. |
| GAP-P2-IS-004 | Fail | Iteration Status exposes the prohibited per-row Defects column. |
| GAP-P2-IS-005 | Pass | List and Board toggle are both visible. |
| GAP-P3-TS-001 | Fail | Team Status still exposes the forbidden local `Search tasks` input. |
| GAP-P3-TS-002 | Partial | C4 accepts Filters and pagination. Show Fields remains out of scope; Totals must be regression-tested against the full Iteration. |
| GAP-P3-TS-003 | Fail | No breadcrumb showing Project > Track > Team Status is present. |
| GAP-P3-TS-004 | Pass | Completing TA-1 changed US-1 to Completed; reopening TA-1 to In-Progress recalculated US-1 to In-Progress. |
| GAP-P3-TS-005 | Fail | Team Status task state is a three-segment control, not the required inline dropdown. |
| GAP-P3-TS-006 | Partial | The controlled Task's omitted Actuals displayed 0, but Estimate/To Do were populated by the test data; a fully-empty Task needs a separate regression to prove all three defaults. |
| GAP-P3-TS-007 | Fail | Task controls render abbreviated/verb labels (`D`, `I`, `Move to Completed`) rather than exact Defined / In-Progress / Completed catalog labels. |
| GAP-P3-TS-008 | Fail | Hieu appeared in Team Status before Team membership existed; after membership was added, Hieu was still missing from the US-1 Owner dropdown. Team Status and Owner selectors do not share the same current Team-membership scope. |
| GAP-P3-QA-001 | Pass | Quality > Add New opens the dedicated Defect form; DE-1 is listed in Quality with Submitted state, Owner and Submitted By. |
| GAP-P4-NOTIF-001 / 002 / 003 | Blocked | No recipient account/event data is available. Actions performed by the same signed-in user did not create a testable recipient notification; unread/read persistence and target routing require a second test user. |

### Final count for the 17 carryover cases completed in this run

| Result | Count | Meaning |
|---|---:|---|
| Pass | 6 | Expected behavior confirmed, including C3 reclassification. |
| Fail | 7 | Current DevInt behavior conflicts with the approved SRS/mockup rule. |
| Partial | 2 | One branch is confirmed; the remaining branch still needs a fix or controlled regression. |
| Blocked | 2 | Cannot be completed without a second recipient/RBAC test account. |

## Fail / Partial Re-test — 2026-08-09

Scope: re-test all 51 scenarios whose current status was `Fail` or `Partial`. Existing `Blocked` scenarios were excluded. Controlled records created in this run: `US-7 P56-AUDIT RETEST E2E 20260809` and `FE-4 P56-AUDIT RETEST Feature 20260809`.

| Result | Count |
|---|---:|
| Pass | 11 |
| Partial | 31 |
| Fail | 9 |

| ID | Result | Re-test conclusion |
|---|---|---|
| GAP-P1-BL-001 | Fail | Clearing Backlog search still leaves one filtered row until reload. |
| GAP-P1-BL-002 | Pass | Priority=None now returns Defects only. |
| GAP-P1-CREATE-006 | Fail | Owner still defaults to Unassigned; current user is not offered. |
| GAP-P2-IT-001 | Pass | Task Estimate column is present; Project remains correctly omitted. |
| GAP-P2-IS-004 | Pass | Per-row Defects column is removed. |
| GAP-P3-TS-001 | Pass | Local Task search is removed. |
| GAP-P3-TS-002 | Pass | Filters/pagination retained, Show Fields removed, full-Iteration Totals shown. |
| GAP-P3-TS-003 | Pass | Project > Track > Team Status breadcrumb is present. |
| GAP-P3-TS-005 | Fail | Counted Task row/control is not rendered, so inline State dropdown is unavailable. |
| GAP-P3-TS-006 | Partial | Fully-empty Task data is still unavailable. |
| GAP-P3-TS-007 | Fail | Exact Task State catalog cannot be used because the Task control is absent. |
| GAP-P3-TS-008 | Fail | Hieu is absent from Pegasus membership but still appears in Team Status with one Task. |
| GAP-P4-SET-001 | Pass | Single-company scope is now explicit. |
| GAP-P4-SET-002 | Partial | User list columns align; User Detail/roles/actions remain incomplete. |
| GAP-P4-SET-003 | Fail | Audit Log still contains technical auth/access events and IDs. |
| GAP-P4-SET-004 | Partial | Team Deactive now has confirmation; typed User-access confirmation remains untested. |
| GAP-P4-SET-005 | Pass | Notification Preferences is hidden. |
| P5-PI-003 | Partial | Full Project-change validity branch needs a second Project. |
| P5-PI-007 | Partial | Cross-Project Release filtering needs a second Project. |
| P5-PI-008 | Pass | Create with details created FE-4 once and opened Feature Detail. |
| P5-PI-009 | Partial | Description persisted; attachment branch remains. |
| P5-PI-011 | Partial | Archived-item branch is unavailable. |
| P5-PI-013 | Partial | Complete child/Task grid branch lacks data. |
| P5-PI-016 | Partial | Fresh child-create immediate rollup was not executable. |
| P5-PI-017 | Partial | Invalid Feature clearing needs multiple Projects. |
| P5-PI-033 | Partial | Multi-level Epic denominator data is unavailable. |
| P5-PI-037 | Partial | Destructive bulk archive needs disposable records. |
| P5-PI-038 | Partial | Rank comparison needs multiple Feature children. |
| P5-CP-005 | Fail | Draft Capacity remains read-only text; only Forecast is actionable. |
| P5-CP-006 | Partial | Remove/restore Team needs a second disposable Team. |
| P5-CP-008 | Partial | Split allocation needs a second Team. |
| P5-CP-014 | Partial | Independent sort persistence could not complete in the current UI session. |
| P5-CP-015 | Partial | Cutline/split branches lack data. |
| P5-CP-010 | Partial | Publish mismatch/non-cascade branches need a disposable Draft plan. |
| P5-CP-023 | Partial | Allocated tier passes; Refined/Preliminary fallbacks lack data. |
| P5-CP-025 | Partial | Cross-Team origin attribution needs a second Team. |
| P5-CP-027 | Partial | Immediate refresh after Remove from Plan still needs disposable data. |
| P5-CP-029 | Partial | Child status rollback branch lacks controlled child data. |
| P5-CP-032 | Fail | FE-2 is allocated to Pegasus but Planned Team still says Not assigned. |
| P5-CP-033 | Partial | Warning branches lack suitable data. |
| P5-CP-034 | Fail | Unassign remains blocked by the P5-CP-032 Planned Team defect. |
| P5-CP-035 | Partial | Mismatching-date publish needs a disposable plan. |
| P6-COM-005 | Partial | A second empty Project is unavailable. |
| P6-COM-006 | Pass | Reports and Release Tracking selections now persist after reload. |
| P6-RT-003 | Partial | Sorting remains; resize was not executed. |
| P6-RT-007 | Partial | Completed is excluded from accepted; Release-state data is unavailable. |
| P6-RT-014 | Partial | Empty snapshot gaps pass; no-Release Project is unavailable. |
| P6-E2E-001 | Pass | One submission created exactly US-7 and navigated to detail. |
| P6-E2E-002 | Partial | State save/mirroring/reload passes; full parent/Iteration/Release rollup remains. |
| P6-E2E-003 | Partial | Cross-context validation needs multiple Releases/Iterations/Projects. |
| P6-E2E-004 | Partial | Persistence passes; sign-out/sign-in cycle remains. |

## Execution Sessions

- **Correction and restoration — 2026-08-05:** the Team guardrail check persisted a real status change: Pegasus changed from Active to Deactive immediately after selecting `Deactive`, without a confirmation dialog. BA then approved the restoration. Pegasus was set back to Active and the page confirmed `Active 1 / Deactive 0` with toast `Status updated`.
- **2026-08-05 — Carryover retest:** tested navigation, Backlog UI, Timeboxes, Iteration Status empty state, Team Status empty state, Settings, Notifications, Teams and Quality. No deployed record was created, edited, archived or deleted; the only intentional state changes were the Team guardrail check and its BA-approved restoration above.
