# DEV Handoff — Confirmed Failures Retest 2026-08-17

## 1. Mục đích và phạm vi

- Môi trường kiểm tra: `https://rally-dev.qnsc.vn/`
- Nguồn theo dõi: `../PHASE_0_6_AUDIT_TRACKER.xlsx`
- Kế hoạch xác nhận: `DEVINT_RETEST_CONFIRMATION_PLAN_2026-08-17.md`
- **Business source of truth:** các file `SRS.md` hiện hành đã được cập nhật trong phiên retest ngày 2026-08-17. Tài liệu reconciliation/history không phải nguồn acceptance cho handoff này.
- Chỉ ghi các case đã được BA xem trực tiếp trên DevInt và xác nhận là **Fail** hoặc **Partial có phần cần DEV sửa** trong vòng retest ngày 2026-08-17.
- Phạm vi sửa: FE và business behavior. Không tự mở rộng sang schema, database hoặc infrastructure.
- DEV/AI phải tái hiện lỗi trước khi sửa và chạy lại toàn bộ Acceptance Criteria sau khi sửa.

## 2. Tổng hợp hiện tại

| Case ID | Phase | Priority | Module | SRS evidence | Kết quả BA |
|---|---|---|---|---|---|
| GAP-P1-WID-007 | Phase 1 | P1 | Work Item Detail / Task Owner | `WID-FR-016`, `TASK-FR-017` | Confirmed Fail |
| GAP-P2-IS-004 | Phase 2 | P1 | Iteration Status inline Dev Owner | `P2-IS-FR-032B`, `P2-IS-FR-032C` | Confirmed Fail |
| GAP-P3-REL-001 | Phase 3 | P2 | Release Detail | `P3-REL-FR-023`, `P3-REL-FR-024` | Confirmed Fail |
| GAP-P4-RBAC-003 | Phase 4 | P0 | Admin/Editor/Unassigned enforcement | P4 Roles SRS §2.2, §3, §7, AC #3–#5 | Confirmed Fail |
| P5-PI-003 | Phase 5 | P0 | Portfolio Children > Add New | `WIC-FR-004`, `WID-FR-017`, `P5-PI-FR-013` | Confirmed Fail |
| P5-CP-029 | Phase 5 | P0 | Capacity Planning metrics | `P5-CAP-AC-016` | Confirmed Fail |
| P5-CP-035 | Phase 5 | P1 | Capacity Publish advisory | `P5-CAP-AC-009`, `P5-CAP-AC-019` | Confirmed Partial — DEV fix required |
| P6-VEL-004 | Phase 6 | P1 | Work Item Iteration selector / Velocity | Velocity SRS §4, AC example #5 | Confirmed Partial — DEV fix required |

## 3. Chi tiết lỗi đã xác nhận

### GAP-P1-WID-007 — Owner dropdown thiếu active Team members

#### Business rule

1. Work Item và Task được phép không có Owner; giá trị mặc định là `Unassigned`.
2. Khi Work Item đã chọn Team, Owner dropdown của Work Item chỉ gồm:
   - `Unassigned`.
   - Các member đang active của chính Team đã chọn.
3. Task thuộc Work Item và kế thừa Team/Iteration scope của Work Item. Owner dropdown của Task áp dụng cùng quy tắc với Work Item.
4. Khi Work Item không có Team, Owner dropdown chỉ có `Unassigned`.
5. Không hiển thị member ngoài Team, member inactive, `No Team`, hoặc toàn bộ Workspace users trong Owner dropdown.

#### SRS / business source evidence

**Work Item Owner — nguồn chính**

- File: `04_Developement_tracking/Phase 1/03_Work_Item_Detail/SRS.md`
- `WID-FR-016`: Owner selector luôn có `Unassigned`; Work Item có Team thì chỉ thêm active members của Team đó; Work Item `No team` chỉ cho `Unassigned`.
- Data/validation rule tại phần Work Item Update: `assigneeId` nullable; named Owner phải là active member của selected Team; nếu `teamId` null thì `assigneeId` phải null/Unassigned.
- Acceptance Criteria số 8: Owner dropdown hiển thị `Unassigned` cộng với active members của Work Item Team; không có Team thì chỉ có `Unassigned`.

**Task Owner — nguồn chính**

- File: `04_Developement_tracking/Phase 1/04_Task_Management/SRS.md`
- `TASK-FR-013`: Task Dashboard hỗ trợ inline edit Owner.
- `TASK-FR-017`: Task Owner theo parent Team — `Unassigned` cộng với active parent-Team members; parent `No team` chỉ cho `Unassigned`.
- Add/Update data rule: named Task Owner phải là active member của inherited parent Team.
- Acceptance Criteria số 13: Owner options là `Unassigned` cộng với active members của inherited parent Team; parent `No team` chỉ có `Unassigned`.

**Traceability ngắn**

| Behavior kiểm tra | Requirement evidence |
|---|---|
| Work Item Owner candidate list | `WID-FR-016`; WID AC #8 |
| Work Item Owner phải thuộc Team | Work Item Detail SRS — Update validation rule |
| Task inline Owner | `TASK-FR-013` |
| Task Owner theo parent Team | `TASK-FR-017`; Task AC #13 |

#### Dữ liệu tái hiện

- Workspace: QNSC.
- Project: TEST.
- Team: Pegasus.
- Active Team member dùng đối chiếu: `Anh Nguyen Thi Ngoc`.
- Work Item: `US-1 — P56-AUDIT Carryover Story`.
- Task: `TA-1 — P56-AUDIT Carryover Task`.
- `US-1` và `TA-1` đang thuộc Team Pegasus.

#### Cách test / tái hiện lỗi

1. Đăng nhập DevInt bằng tài khoản có quyền xem Project TEST.
2. Chọn context `Project = TEST`, `Team = Pegasus`.
3. Mở `Track > Team Status`.
4. Xác nhận Team Status của Pegasus đang hiển thị member active `Anh Nguyen Thi Ngoc`.
5. Mở trực tiếp `https://rally-dev.qnsc.vn/item/US-1`.
6. Trong sidebar Details, xác nhận trường Team của `US-1` là Pegasus.
7. Mở Owner dropdown của `US-1` và ghi lại toàn bộ option.
8. Chuyển sang tab Tasks trong Work Item Detail.
9. Tại dòng `TA-1`, mở inline Owner dropdown và ghi lại toàn bộ option.

#### Actual result

- Owner hiện tại của `US-1` và `TA-1` là `Unassigned`.
- Owner dropdown của cả `US-1` và `TA-1` chỉ hiển thị `— No Entry —`.
- Active member `Anh Nguyen Thi Ngoc` không xuất hiện dù Team Status xác nhận người này thuộc Team Pegasus.
- Kết quả: người dùng không thể assign Work Item hoặc Task cho active member của Team.

#### Expected result đầy đủ

- Owner dropdown của `US-1` phải hiển thị tối thiểu:
  - `Unassigned`.
  - `Anh Nguyen Thi Ngoc` và mọi member active khác của Pegasus nếu có.
- Owner dropdown của `TA-1` phải sử dụng cùng tập candidate như `US-1`.
- Option phải lấy động theo Team hiện tại, không hard-code tên người dùng.
- Sau khi chọn một active Team member và lưu/reload, Owner phải được giữ đúng.
- Nếu đổi Work Item sang Team khác và Owner cũ không thuộc Team mới, hệ thống phải đưa Owner về `Unassigned` thay vì giữ một Owner không hợp lệ.
- Nếu chọn `No Team`, Owner phải về `Unassigned` và dropdown chỉ còn `Unassigned`.

#### Acceptance Criteria cho DEV/AI

- **AC1 — Work Item candidate list:** Given Work Item thuộc Pegasus và Pegasus có active member, when mở Owner dropdown, then hiển thị `Unassigned` cộng với toàn bộ active Pegasus members.
- **AC2 — Task candidate list:** Given Task thuộc Work Item của Pegasus, when mở inline Owner dropdown, then candidate list giống quy tắc của Work Item.
- **AC3 — Scope isolation:** Candidate list không chứa member ngoài Pegasus hoặc member inactive.
- **AC4 — Persistence:** Chọn active member, lưu và reload; Owner vẫn giữ đúng ở Backlog, Work Item Detail, Tasks và Iteration/Team views có liên quan.
- **AC5 — Team change validation:** Khi Team thay đổi, Owner không hợp lệ phải tự về `Unassigned`.
- **AC6 — No Team:** Work Item không có Team chỉ cho chọn `Unassigned`; Task của Work Item đó áp dụng tương tự.
- **AC7 — No regression:** `Unassigned` vẫn là lựa chọn hợp lệ; không tự gán user đang đăng nhập.

#### Gợi ý phạm vi code cần kiểm tra

- Hàm/API/state cung cấp Owner candidates cho Work Item Detail.
- Hàm/API/state cung cấp Owner candidates cho inline Task editor.
- Mapping giữa Team membership active và Owner option.
- Cache/query invalidation sau khi thêm/xóa/deactivate Team member hoặc thay đổi Team của Work Item.
- Không tạo logic riêng lệch nhau giữa Work Item Owner và Task Owner; nên dùng chung business rule/candidate selector.

#### Evidence

- Work Item: `https://rally-dev.qnsc.vn/item/US-1`
- Team membership: `https://rally-dev.qnsc.vn/team-status`, filter Pegasus.
- SRS Work Item: `04_Developement_tracking/Phase 1/03_Work_Item_Detail/SRS.md` — `WID-FR-016`, Update validation rule, AC #8.
- SRS Task: `04_Developement_tracking/Phase 1/04_Task_Management/SRS.md` — `TASK-FR-013`, `TASK-FR-017`, AC #13.
- BA confirmation: **Confirmed Fail — 2026-08-17**.

### P5-PI-003 — Project selector phải read-only theo active context

#### Business rule

1. Khi user đang ở Project nào, mọi Work Item, Task, Feature hoặc Epic được tạo mới phải thuộc Project context đó.
2. Project được auto-fill và read-only trong Quick Create, Create with details, Feature/Epic create và Feature Children > Add New.
3. Muốn tạo item ở Project khác, user phải đổi global Project context trước khi mở create flow.
4. Project vẫn read-only sau khi item được tạo; không hỗ trợ move item giữa Projects từ detail/inline edit.

#### SRS evidence — updated in session 2026-08-17

- `04_Developement_tracking/Phase 1/02_Work_Item_Create/SRS.md`
  - `WIC-FR-004`: Project required, auto-filled from active Project context and read-only in every Work Item create flow.
  - Acceptance Criteria #11: Project không thể đổi trong Quick Create, Create with details hoặc modal được reuse.
- `04_Developement_tracking/Phase 1/03_Work_Item_Detail/SRS.md`
  - `WID-FR-017`: Project inherited at creation and remains read-only; moving between Projects is unsupported.
  - Acceptance Criteria #9: Project displayed read-only in Work Item Detail.
- `04_Developement_tracking/Phase 1/04_Task_Management/SRS.md`
  - Acceptance Criteria #14: Task Project luôn bằng parent Story/Defect Project và read-only.
- `04_Developement_tracking/Phase 5/01_Portfolio_Items/SRS.md`
  - `P5-PI-FR-013`: Feature `Add Item` inherits current Feature/active Project and Project is read-only.
  - Acceptance Criteria #11: Project auto-filled and cannot be changed in the create modal.

#### Dữ liệu tái hiện

- Active Project context: AUDIT26.
- Feature: `FE-6 — AUD-FE2 Release Mismatch`.
- Route: Feature Detail > Children > Add New.

#### Cách test / tái hiện lỗi

1. Chọn global Project context `AUDIT26`.
2. Mở `https://rally-dev.qnsc.vn/portfolio/019fff2d-06d7-7956-9ee1-85d45b36ec0c`.
3. Mở tab Children.
4. Chọn `Add New`.
5. Xác nhận modal `New Work Item` prefill Project AUDIT26.
6. Bấm trường Project.
7. Quan sát danh sách Project được mở ra.

#### Actual result

- Project được prefill AUDIT26 nhưng vẫn là button tương tác.
- Dropdown hiển thị `TEST`, `AUDIT26` và `P6RT014`.
- User có thể bắt đầu chuyển child Work Item sang Project khác ngay trong create flow.
- Không tạo Work Item mới trong lần retest này.

#### Expected result đầy đủ

- Project hiển thị AUDIT26 dưới dạng read-only; không mở dropdown.
- Create Item và Create with details luôn gửi Project của active/Feature context.
- Team options tiếp tục được scope theo Project AUDIT26.
- Work Item mới tự liên kết với FE-6 và không thể thuộc Project khác FE-6.
- Work Item Detail sau tạo tiếp tục hiển thị Project read-only.

#### Acceptance Criteria cho DEV/AI

- **AC1:** Mọi create modal hiển thị Project context dưới dạng read-only.
- **AC2:** Feature Children > Add New không render Project dropdown hoặc option Project khác.
- **AC3:** Create và Create with details tạo item trong đúng active Project.
- **AC4:** Team, Owner, Release, Iteration và Feature options được filter theo fixed Project.
- **AC5:** Detail/inline edit không cho đổi Project sau tạo.
- **AC6:** Task Project luôn bằng parent Work Item Project.
- **AC7:** Muốn tạo ở Project khác phải đổi global Project context trước khi mở modal.

#### Gợi ý phạm vi code cần kiểm tra

- Shared `New Work Item` modal đang nhận danh sách Projects và render Project picker.
- Wrapper Feature Children > Add New phải truyền fixed Project context, không truyền editable project options.
- Create with details và Create Item phải dùng cùng fixed Project source.
- Work Item/Portfolio detail không render Project editor.
- Không thay đổi schema hoặc DB; đây là FE/business constraint.

#### Evidence

- Runtime: `https://rally-dev.qnsc.vn/portfolio/019fff2d-06d7-7956-9ee1-85d45b36ec0c`, Children > Add New > Project.
- SRS source of truth updated 2026-08-17: `WIC-FR-004`, `WID-FR-017`, Task AC #14, `P5-PI-FR-013`.
- BA confirmation: **Confirmed Fail — 2026-08-17**.

### GAP-P3-REL-001 — Release Detail hiển thị progress widget ngoài scope

#### Business rule

1. `Plan > Timeboxes > Release Detail` là màn quản lý metadata và nội dung Release.
2. Release Detail không hiển thị Task Roll-up, Accepted progress, Burndown hoặc progress widget khác.
3. Toàn bộ Release progress/tracking chỉ hiển thị tại `Portfolio > Release Tracking`.
4. Việc bỏ progress khỏi Release Detail không được làm mất các metadata: Start Date, Release Date, Project, State, Planned Velocity, Plan Estimate và Version.

#### SRS evidence

- File: `04_Developement_tracking/Phase 3/02_Release_Management/SRS.md`
- `P3-REL-FR-023`: Release Detail không được hiển thị Task Roll-up, Burndown hoặc Release progress widget khác.
- `P3-REL-FR-024`: Accepted/progress totals chỉ hiển thị trong `Portfolio > Release Tracking`.
- `P3-REL-FR-037`: Phase 3 Release list/detail không thêm Release Progress column/widget.
- Acceptance Criteria #10: right panel chỉ có metadata và không có Task Roll-up, Accepted progress hoặc Burndown.
- Test scenario `P3-REL-TS-016`: mở Release Detail thì không render Task Roll-up, Accepted progress hoặc Burndown.

#### Dữ liệu tái hiện

- Project: AUDIT26.
- Release: `RE-2 — AUD-R2 2026`.
- URL: `https://rally-dev.qnsc.vn/releases/019fff28-51be-7024-a876-dd7cc6eb0ec0`.

#### Cách test / tái hiện lỗi

1. Đăng nhập DevInt bằng tài khoản có quyền xem Project AUDIT26.
2. Mở URL Release Detail nêu trên.
3. Giữ tab `Details` được chọn.
4. Quan sát right sidebar `Metadata Details`.
5. Kiểm tra các section nằm dưới Version Release Tag.
6. Đối chiếu với `P3-REL-FR-023`, `P3-REL-FR-024` và `P3-REL-TS-016`.

#### Actual result

- Right sidebar vẫn render heading `Task Roll-up`.
- Widget hiển thị `Estimate 0h`, `To Do 0h`, `Actual 0h` và `Accepted 0`.
- Không thấy Burndown trong lần retest này, nhưng Task Roll-up và Accepted đã đủ làm case Fail.

#### Expected result đầy đủ

- Release Detail không render `Task Roll-up`.
- Không render Estimate/To Do/Actual roll-up hoặc Accepted total/progress trong Release Detail.
- Không render Burndown hay progress widget khác tại Release Detail.
- Release Detail vẫn hiển thị đúng metadata và các tab Details, Artifacts, Revision History.
- Release Tracking tiếp tục hiển thị các progress/report đã được Phase 6 quy định; sửa lỗi này không được xóa hoặc thay đổi chức năng Release Tracking.

#### Acceptance Criteria cho DEV/AI

- **AC1:** Given user mở Timeboxes > Release Detail, then không có Task Roll-up section.
- **AC2:** Release Detail không có Accepted progress/total và không có Burndown.
- **AC3:** Metadata Start Date, Release Date, Project, State, Planned Velocity, Plan Estimate và Version vẫn hoạt động.
- **AC4:** Details, Artifacts và Revision History vẫn mở được bình thường.
- **AC5:** Portfolio > Release Tracking không bị ảnh hưởng bởi thay đổi này.
- **AC6:** Không thay đổi schema/DB hoặc công thức progress; chỉ loại bỏ presentation ngoài scope khỏi Release Detail.

#### Gợi ý phạm vi code cần kiểm tra

- Release Detail component/right sidebar đang render `Task Roll-up`.
- Điều kiện hoặc shared component khiến Phase 6 metrics xuất hiện trong Phase 3 surface.
- Không xóa shared roll-up component nếu Release Tracking còn sử dụng; chỉ bỏ việc mount/render trong Release Detail.

#### Evidence

- Runtime: `https://rally-dev.qnsc.vn/releases/019fff28-51be-7024-a876-dd7cc6eb0ec0`.
- SRS: `04_Developement_tracking/Phase 3/02_Release_Management/SRS.md` — `P3-REL-FR-023`, `P3-REL-FR-024`, `P3-REL-FR-037`, AC #10, `P3-REL-TS-016`.
- BA confirmation: **Confirmed Fail — 2026-08-17**.

### P5-CP-029 — Complete và Rollup không tính từ child Plan Estimate

#### Business rule và SRS evidence

- File: `04_Developement_tracking/Phase 5/02_Capacity_Planning/SRS.md`.
- `P5-CAP-AC-016`: Complete là tổng Plan Estimate của Story/Defect child ở `Completed`, `Accepted` hoặc `Release`; Rollup là tổng Plan Estimate của mọi Story/Defect child liên kết.
- Complete và Rollup phải cập nhật khi child đổi trạng thái; Team slice và Feature/Plan total phải nhất quán.

#### Cách test

1. Mở Capacity Plan `CP-1 — P56-AUDIT Phase 5 Capacity Plan`.
2. Mở Feature `FE-2 — P56-AUDIT Phase 5 Active Feature`, tab Children.
3. Xác nhận child `US-5` có Plan Estimate = 3 và trạng thái Idea.
4. Chuyển US-5 sang Completed.
5. Tải lại Capacity Plan và kiểm tra Complete/Rollup tại Plan header, Team Pegasus và FE-2.
6. Hoàn tác US-5 về Idea sau khi ghi nhận kết quả.

#### Actual result

- FE-2 có đúng một child US-5, Plan Estimate = 3.
- Sau khi US-5 chuyển sang Completed, Plan header vẫn `Complete = 0`, `Rollup = 0`.
- Team Pegasus vẫn `Complete = 0`, `Rollup = 0`.
- Hệ thống không recalculation từ child đang liên kết.

#### Expected result / Acceptance Criteria

- Khi US-5 ở Completed: Complete = 3 và Rollup = 3 tại Feature/Plan aggregation tương ứng.
- Khi US-5 quay lại Idea: Complete giảm về 0 nhưng Rollup vẫn bằng 3.
- Các Team slice cộng lại phải khớp Feature total; không nhân đôi child khi Feature được split allocation.
- Reload không được làm mất hoặc thay đổi số tổng hợp đúng.

#### Evidence

- Feature children: `https://rally-dev.qnsc.vn/portfolio/019fd5d9-9137-731a-aa13-aee2e012ac5d`.
- Capacity Plan: `https://rally-dev.qnsc.vn/capacity-planning/41d10dd3-6392-47c0-8972-bc4e521d319e`.
- BA confirmation: **Confirmed Fail — 2026-08-17**.

### GAP-P2-IS-004 — Inline Dev Owner mất giá trị sau reload

#### Business rule và SRS evidence

- File: `04_Developement_tracking/Phase 2/03_Iteration_Status/SRS.md`.
- `P2-IS-FR-032B`: người có quyền edit được inline edit Dev Owner tại nơi cột này hiển thị.
- `P2-IS-FR-032C`: Owner/Dev Owner đã update thành công phải giữ nguyên sau refresh hoặc reload.

#### Cách test

1. Đăng nhập DevInt bằng account có quyền sửa Work Item trong Project TEST.
2. Mở `Track > Iteration Status` và chọn Iteration có Work Item kiểm soát.
3. Tại cột `Dev Owner`, chọn một user hợp lệ, ví dụ `vuhieu24042000`.
4. Xác nhận hệ thống báo update thành công và tên user xuất hiện tại dòng.
5. Reload trang và kiểm tra lại `Dev Owner` của cùng Work Item.

#### Actual result

- Inline dropdown có user và thao tác assignment tạo notification.
- Sau reload, `Dev Owner` trở về `No Entry`; giá trị vừa chọn không được giữ.

#### Expected result / Acceptance Criteria

- **AC1:** Chọn Dev Owner hợp lệ và update thành công thì giá trị được persist.
- **AC2:** Refresh/reload vẫn hiển thị đúng Dev Owner vừa chọn.
- **AC3:** Các màn hình dùng chung Work Item phải đọc cùng giá trị Dev Owner, không giữ state cục bộ riêng tại Iteration Status.
- **AC4:** Notification chỉ được tạo cho assignment thành công; sửa persistence không được làm phát sinh notification trùng.

#### Evidence

- Runtime: `https://rally-dev.qnsc.vn/iteration-status`.
- BA confirmation: **Confirmed Fail — 2026-08-17**.
- Đây là lỗi độc lập với `GAP-P1-WID-007`: Detail Page lỗi candidate list Owner; Iteration Status lỗi persistence của Dev Owner.

### GAP-P4-RBAC-003 — Editor vượt Team scope và Unassigned còn lộ Project metadata

#### Business rule và SRS evidence

- File: `04_Developement_tracking/Phase 4/02_Roles_Permissions/SRS.md`.
- §2.2: Editor bắt buộc có ít nhất một active Team và chỉ làm việc trong các Team được gán.
- §3.1–3.2: Admin có All Teams nhưng structure/access chỉ đọc; Editor chỉ sửa delivery data trong assigned Teams; unassigned Project bị ẩn.
- §7: direct route thiếu quyền phải trả Access Denied hoặc Not Found an toàn, không lộ restricted metadata.
- Acceptance Criteria #3–#5 là acceptance source chính.

#### Cách test

**A. Admin**

1. Đăng nhập `vuhieu24042000`.
2. Mở Settings > My Permissions và xác nhận TEST = Admin.
3. Mở Workspaces & Projects > TEST > Details / Users & Permissions.
4. Kiểm tra chỉ thấy Project được gán, All Teams và không có structural mutation action.

**B. Editor ngoài Team scope**

1. Đăng nhập `vubuiminhhieu2000` khi account còn TEST = Editor nhưng không thuộc Team nào.
2. Đối chiếu Settings > Teams: Pegasus chỉ có `Anh Nguyen Thi Ngoc`; RTCAP chỉ có `benq061097`.
3. Mở top Project/Team selector và ghi lại Team options.
4. Mở trực tiếp `/item/US-17`, là Work Item của Pegasus.

**C. Unassigned Project**

1. Bằng WA, remove TEST access của `vubuiminhhieu2000` và xác nhận row biến mất.
2. Đăng nhập lại account đó.
3. Kiểm tra Home KPI, header context và Project selector.
4. Mở `/backlog` và `/item/US-17` trực tiếp.

#### Actual result chi tiết

**Phần đạt — không được regression**

- Admin chỉ thấy TEST, có All Teams và Project structure read-only.
- Sau Remove Access, delivery navigation bị ẩn, Project list rỗng và `/backlog` trả Access Denied.

**Phần Fail 1 — Editor Team-scope enforcement**

- WA UI xác nhận Editor không có assigned Team.
- Editor vẫn thấy `All Teams`, Pegasus và RTCAP trong selector.
- Editor vẫn mở được full `/item/US-17` của Pegasus và thấy các control Work Item.

**Phần Fail 2 — Unassigned metadata/context leak**

- Home vẫn hiển thị TEST aggregate counts như Work Items, Active Sprint và Open Defects.
- Header vẫn hiển thị stale context `TEST · All Teams` sau khi Project access đã bị xóa.

**Phần Fail 3 — Missing denied state cho entity URL**

- `/item/US-17` không lộ record nhưng render trang trắng.
- Không có Access Denied/Not Found message hoặc recovery action như `/backlog`.

#### Expected result / Acceptance Criteria cho DEV/AI

- **AC1 — Editor assignment validity:** Không cho tạo/giữ Editor assignment mà không có ít nhất một active Team; nếu dữ liệu cũ vi phạm, runtime phải coi user không có delivery scope.
- **AC2 — Editor Team isolation:** Editor chỉ thấy assigned Teams; không hiển thị `All Teams` hoặc Team ngoài assignment.
- **AC3 — Entity enforcement:** Editor mở entity ngoài assigned Team phải nhận Access Denied/Not Found và không thấy metadata/control.
- **AC4 — Unassigned Home:** Sau Remove Access, Home KPI không được tính hoặc hiển thị dữ liệu của Project đã mất quyền.
- **AC5 — Context reset:** Header/context phải xóa TEST khỏi active context và không giữ stale `TEST · All Teams`.
- **AC6 — Safe denied state:** `/item/{id}` thiếu quyền phải hiển thị Access Denied/Not Found nhất quán với `/backlog`, không render blank page.
- **AC7 — Preserve passing behavior:** Admin read-only structure và `/backlog` denied state hiện có phải tiếp tục hoạt động.
- **AC8 — No metadata leak:** Search, notifications, selector, dashboard aggregates và direct routes đều phải recheck current Project/Team access.

#### Evidence

- Runtime: `/settings`, `/`, `/backlog`, `/item/US-17` trên các session nêu trên.
- BA confirmation: **Confirmed Fail — 2026-08-17**.

### P5-CP-035 — Publish đúng logic nhưng advisory sai nghĩa và lặp theo Team allocation

#### Business rule bắt buộc

1. `Publish` có thể chuyển Plan từ Draft sang Published dù ngày Plan không khớp Release.
2. Feature có ít nhất một Team allocation nhận Planned Start/End của Plan.
3. Feature Release chỉ được gán khi hai cặp ngày khớp **chính xác**:
   - `plan.plannedStartDate === release.startDate`.
   - `plan.plannedEndDate === release.releaseDate`.
4. “Khớp chính xác” không đồng nghĩa với “Plan nằm trong khoảng Release”.
5. Một Feature split cho nhiều Team vẫn là một artifact: update và advisory phải chạy một lần theo unique `featureId`.
6. Feature không có Team allocation không nhận Release/dates và chỉ có một advisory.

#### SRS / business source evidence

- File: `04_Developement_tracking/Phase 5/02_Capacity_Planning/SRS.md`.
- Confirmed Direction #10–#12: hai Publish action; Revert/Unpublish không rollback Feature fields; Release chỉ được ghi khi Plan dates khớp Release dates.
- `P5-CAP-AC-009`: Publish ghi Release và planned dates mà không đổi Feature Project hoặc child fields.
- `P5-CAP-AC-019`: mismatch không được âm thầm ghi đè Release và phải báo kết quả.

#### Dữ liệu và cách tái hiện

- Project TEST, Capacity Plan CP-1, Release RE-1.
- RE-1 dates: `2026-08-07` đến `2026-08-31`.
- FE-2 có hai Team allocation; FE-4 không có Team.

1. Đưa CP-1 về Draft và đặt FE-2 Release = No Entry.
2. Đặt Plan dates `2026-08-07` đến `2026-08-30`.
3. Chọn `Publish > Publish and update fields`.
4. Đọc publish result; mở FE-2 để kiểm tra Release và dates.
5. Unpublish, đổi Plan dates thành `2026-08-07` đến `2026-08-31`.
6. Publish and update fields lần nữa; mở FE-2 kiểm tra.
7. Unpublish và khôi phục baseline sau test.

#### Actual result

- Mismatch: Plan Published; FE-2 nhận dates `2026-08-07..2026-08-30`; Release vẫn No Entry. Core behavior đúng.
- Advisory sai nghĩa: `the plan’s window reaches outside its release`, dù Plan kết thúc sớm hơn Release và không hề nằm ngoài khoảng.
- Advisory FE-2 xuất hiện hai lần vì FE-2 split hai Team.
- Match: FE-2 nhận RE-1 và dates `2026-08-07..2026-08-31` đúng.
- FE-4 không có Team được bỏ qua và báo một lần đúng.

#### Hướng sửa cho DEV/AI

1. Chuẩn hóa ngày thành date-only `YYYY-MM-DD` trước khi so sánh; không so sánh timestamp/timezone trực tiếp.
2. Dùng đúng predicate:

```text
releaseDatesMatch =
  planStartDate === releaseStartDate
  AND planEndDate === releaseEndDate
```

3. Không dùng containment predicate như `planStart >= releaseStart && planEnd <= releaseEnd`.
4. Tạo danh sách `uniqueFeatures` bằng `featureId` trước khi update Feature và tạo publish-result message. Không iterate trực tiếp allocation rows để sinh advisory.
5. Wording modal trước Publish phải đổi từ “falls inside its release” thành “exactly matches the selected Release start and end dates”.
6. Wording mismatch đề xuất:

```text
FE-2 — Plan dates 2026-08-07 to 2026-08-30 do not exactly match
Release dates 2026-08-07 to 2026-08-31. Planned dates were updated;
Release was not changed.
```

7. Giữ nguyên các behavior đang đúng: Plan vẫn Published khi mismatch; planned dates vẫn được ghi; Release không đổi; Publish without updating fields không ghi Feature fields; Published read-only; Unpublish không rollback fields.

#### Acceptance Criteria cho DEV/AI

- **AC1 — Exact match:** Publish exact-match gán Release và dates đúng một lần cho mỗi unique Feature có Team.
- **AC2 — Mismatch safety:** Mismatch vẫn Published, ghi dates, không đổi Release.
- **AC3 — Correct advisory:** Message nói rõ “does not exactly match”, hiển thị Plan dates và Release dates; không dùng “outside” nếu không nằm ngoài.
- **AC4 — Split de-duplication:** FE-2 split hai Team chỉ update một lần và chỉ có một advisory.
- **AC5 — Unassigned Feature:** FE-4 không Team không được update và chỉ có một advisory.
- **AC6 — No regression:** Publish without updating fields, lifecycle read-only và Unpublish giữ nguyên.

#### Evidence

- Runtime: `https://rally-dev.qnsc.vn/capacity-planning/41d10dd3-6392-47c0-8972-bc4e521d319e`.
- BA confirmation: **Confirmed Partial — 2026-08-17; DEV fix required**.
- Sau test, CP-1 đã được Unpublish về Draft và dữ liệu Release/date của FE-2 đã khôi phục baseline.

### P6-VEL-004 — Không thể gán Work Item vào completed Iteration

#### Business rule

1. Velocity được tính lại theo Iteration assignment hiện tại của Story/Defect, không dùng frozen snapshot.
2. Chuyển item ra khỏi completed Iteration phải loại points khỏi bar ở query kế tiếp.
3. Chuyển item vào completed Iteration phải cộng points vào bar ở query kế tiếp.
4. Work Item Iteration selector phải cho phép chọn completed Iteration thuộc đúng Project/Team scope; trạng thái hoàn thành hoặc end date đã qua không phải lý do khóa assignment.
5. Việc đổi Iteration không tự đổi Schedule State hoặc Flow State của Work Item.

#### SRS / business source evidence

- `04_Developement_tracking/Phase 6/03_Velocity_Chart/SRS.md`, §4 Real-time attribution rule và Acceptance example #5.
- `04_Developement_tracking/Phase 6/PHASE6_REPORTS_BUSINESS_AND_DATA_CONTRACT.md`, §5.2.
- Source of truth bổ sung trong phiên retest 2026-08-17: Iteration selector phải hỗ trợ completed Iteration để thực hiện đủ move-in/move-out.

#### Cách tái hiện

1. Mở `/reports`, chọn Velocity và ghi nhận `P56-AUDIT Carryover Sprint = 8 Not Accepted`.
2. Mở Carryover Sprint tại `/iteration-status`; US-2 có Plan Estimate 5 points.
3. Chuyển US-2 về Backlog.
4. Query lại Velocity: Carryover Sprint giảm còn 3 Not Accepted.
5. Tại `/backlog`, mở Iteration selector của US-2 để gán lại Carryover Sprint.

#### Actual result

- Chiều move-out và Velocity recalculation hoạt động đúng: `8 → 3`.
- Dropdown chỉ hiện `--` và `P56-AUDIT Empty Sprint`; completed Carryover Sprint không xuất hiện.
- Không thể chạy chiều move-in và không thể restore US-2 về assignment ban đầu bằng UI.

#### Hướng sửa cho DEV/AI

1. Bỏ filter loại Iteration chỉ vì `endDate < today` hoặc status đã hoàn thành.
2. Trả về completed Iteration cùng Project và Team scope trong mọi Iteration selector dùng cho Work Item.
3. Giữ `--`/Backlog là lựa chọn bỏ assignment.
4. Khi chọn completed Iteration, persist `iterationId` theo cùng update flow với Iteration bình thường.
5. Đồng bộ assignment sau save trên Backlog, Work Item Detail và Iteration Status; reload vẫn giữ giá trị.
6. Không thay đổi Schedule State, Flow State hoặc acceptedDate chỉ vì đổi Iteration.
7. Query Velocity kế tiếp phải phản ánh assignment mới, không cần rebuild snapshot.

#### Acceptance Criteria cho DEV/AI

- **AC1:** Dropdown cho phép chọn completed Iteration đúng Project/Team scope.
- **AC2:** Gán US-2 5 points vào Carryover Sprint làm Not Accepted tăng `3 → 8` ở query kế tiếp.
- **AC3:** Bỏ US-2 về Backlog làm Not Accepted giảm `8 → 3`.
- **AC4:** Reload giữ đúng Iteration assignment trên mọi màn hình.
- **AC5:** Schedule State, Flow State và acceptedDate không bị thay đổi ngoài ý muốn.
- **AC6:** Không hiển thị Iteration ngoài Project/Team scope hợp lệ.

#### Evidence

- Runtime: `https://rally-dev.qnsc.vn/iteration-status`, `/backlog`, `/reports`.
- BA confirmation: **Confirmed Partial — 2026-08-17; DEV fix required**.

## 4. Case liên quan cần retest sau khi sửa

- `P6-TC-007 — Use unassigned Task`: chưa được BA xác nhận lại trong vòng hiện tại, nhưng có thể bị ảnh hưởng bởi cùng nguồn Owner/Team membership.
- `P6-VEL-008 — Accepted/Release thiếu acceptedDate`: **Blocked, không phải confirmed failure**. DEV cần tạo controlled invalid fixture trên localhost/test database, xác nhận Velocity đưa points vào `unclassified`, hiển thị data-quality warning và không dùng points đó trong During/After/Not Accepted hoặc averages. Không seed dữ liệu lỗi vào DevInt dùng chung.
- Không tự đổi trạng thái case liên quan thành Pass; phải chạy lại theo test plan.

## 5. Quy tắc cập nhật file

- Chỉ bổ sung case khi BA đã xác nhận **Fail** hoặc **Partial có hành vi cần DEV sửa**.
- Case được xác nhận Pass không đưa vào handoff lỗi.
- Nếu một lỗi là nguyên nhân gốc khiến nhiều case fail, phải ghi rõ chuỗi phụ thuộc và không báo trùng thành nhiều root cause độc lập.
