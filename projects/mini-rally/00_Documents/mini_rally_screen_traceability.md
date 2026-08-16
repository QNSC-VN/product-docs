# Mini Rally — Screen Specification & Frontend Traceability

> **Current navigation/access addendum (2026-08-14):** Settings contains Workspace Settings, Users, Workspaces & Projects, Permission Model and Audit Log. Current Project Access includes Admin/Editor only; no assignment means Project hidden/direct access denied. Viewer/selectable No Access and the former editable role matrix are not current scope.

## 1. Mục đích tài liệu

Tài liệu này nối ba lớp thông tin để team có thể truy vết nhanh từ yêu cầu đến giao diện hiện tại:

```text
Figma prompt → Screen specification → Mockup FE implementation
```

Phạm vi mapping là prototype trong `03_Mockup Design`. Đây là React/Vite single-page mockup dùng dữ liệu tĩnh và local state; chưa có URL router, API, database hay persistence.

### Nguồn yêu cầu

| Nguồn | Vai trò |
|---|---|
| [`02_Prompt UI/Prompt1.md`](../02_Prompt%20UI/Prompt1.md) | Global design system và component vocabulary |
| [`02_Prompt UI/Prompt2.md`](../02_Prompt%20UI/Prompt2.md) | App shell, navigation, context selector và role-based UI |
| [`02_Prompt UI/Prompt3.md`](../02_Prompt%20UI/Prompt3.md) | Screen 1–5: Home, Plan, Track, Backlog, Board |
| [`02_Prompt UI/Prompt4.md`](../02_Prompt%20UI/Prompt4.md) | Screen 6–12: Detail, Quality, Portfolio, Release, Reports, Notifications, Settings |
| [`App.tsx`](../03_Mockup%20Design/src/app/App.tsx) | Auth state và page orchestration |
| [`model.ts`](../03_Mockup%20Design/src/app/model.ts) | Types, permission helpers và mock data |
| [`components/layout.tsx`](../03_Mockup%20Design/src/app/components/layout.tsx) | TopNav, ContextBar, hierarchy selector |
| [`components/shared.tsx`](../03_Mockup%20Design/src/app/components/shared.tsx) | Badge, avatar, modal và detail panel dùng chung |
| [`pages/`](../03_Mockup%20Design/src/app/pages) | Một file cho mỗi screen |

### Quy ước trạng thái

| Ký hiệu | Ý nghĩa |
|---|---|
| ✅ | Đã có trong mockup và hành vi chính hoạt động bằng local state |
| 🟡 | Đã có UI nhưng hành vi chỉ một phần, dùng dữ liệu tĩnh hoặc nút chưa xử lý |
| ⬜ | Chưa có trong mockup |
| N/A | Không áp dụng ở lớp mockup |

> “Hoạt động” trong tài liệu này chỉ nói về tương tác phía client. Không đồng nghĩa với nghiệp vụ đã được lưu hoặc kết nối backend.

---

## 1A. Phase 1 mockup delta — 2026-06-24

Các thay đổi mockup mới nhất cho Phase 1 đã được áp dụng ở `03_Mockup Design` và được document chi tiết tại [`04_Developement_tracking/Phase 1`](../04_Developement_tracking/Phase%201).

| Area | Trạng thái mới | FE source | Ghi chú dev |
|---|---|---|---|
| Backlog | Chỉ tập trung Story/Defect | [`BacklogPage.tsx`](../03_Mockup%20Design/src/app/pages/BacklogPage.tsx) | Feature/Task không còn là type tạo từ Backlog |
| Backlog click behavior | Click Work Item ID mở full detail page | [`BacklogPage.tsx`](../03_Mockup%20Design/src/app/pages/BacklogPage.tsx), [`App.tsx`](../03_Mockup%20Design/src/app/App.tsx) | Summary panel chỉ còn là trạng thái collapse |
| Create Work Item | Modal gồm Type, Project, Team, Title, Owner, Plan Estimate | [`BacklogPage.tsx`](../03_Mockup%20Design/src/app/pages/BacklogPage.tsx) | Có `Create`, `Create with details`, `Cancel` |
| Work Item Detail | Header + tabs `Details`, `Tasks`, `Revision History` | [`WorkItemDetailPage.tsx`](../03_Mockup%20Design/src/app/pages/WorkItemDetailPage.tsx) | Details dùng left content + right field panel |
| Work Item Details tab | Description, Attachments, Notes, Release Notes | [`WorkItemDetailPage.tsx`](../03_Mockup%20Design/src/app/pages/WorkItemDetailPage.tsx) | Rich editor mock toolbar |
| Work Item Tasks tab | Full-width task list, không có sidebar phải | [`WorkItemDetailPage.tsx`](../03_Mockup%20Design/src/app/pages/WorkItemDetailPage.tsx) | Columns Rank/ID/Name/State/Owner/Project/Teams/To Do/Actuals/Estimate |
| Work Item Detail sidebar states | Schedule State + Flow State + Defect Priority | [`WorkItemDetailPage.tsx`](../03_Mockup%20Design/src/app/pages/WorkItemDetailPage.tsx) | `Status` sidebar đổi thành `Flow State`; Priority chỉ show cho Defect với Low/Normal/High/Urgent/None |
| Add Task | Modal Name required, Estimate, Owner | [`WorkItemDetailPage.tsx`](../03_Mockup%20Design/src/app/pages/WorkItemDetailPage.tsx) | Có `Create with details` |
| Task Detail | Banner riêng cho Task, tabs `Details`, `Revision History` | [`WorkItemDetailPage.tsx`](../03_Mockup%20Design/src/app/pages/WorkItemDetailPage.tsx) | Không có Tasks tab |
| Task Detail fields | State, Owner, Project, Team, Work Product, Estimate, To Do, Actual | [`WorkItemDetailPage.tsx`](../03_Mockup%20Design/src/app/pages/WorkItemDetailPage.tsx) | State gồm Defined/In-Progress/Completed |
| Activity Log | Revision History cho Work Item và Task | [`WorkItemDetailPage.tsx`](../03_Mockup%20Design/src/app/pages/WorkItemDetailPage.tsx) | Basic activity log |

---

## 2. Bản đồ tổng quan

Mockup chưa sử dụng route URL. `App` lưu `isAuthenticated/currentPage` trong local state và render screen từ thư mục `pages/`.

| ID | Màn hình | Prompt | Nav/page key | FE component | UI | Hành vi |
|---|---|---|---|---|---|---|
| SCR-00 | Login — Workspace Admin | Phase 0 Auth | public/login state | [`LoginPage`](../03_Mockup%20Design/src/app/pages/LoginPage.tsx) | ✅ | 🟡 local mock auth |
| SCR-01 | Home / Workspace Overview | Prompt 3, Screen 1 | `home` | [`HomePage`](../03_Mockup%20Design/src/app/pages/HomePage.tsx) | ✅ | 🟡 |
| SCR-01A | Project Management | Phase 0 Project | `projects` | [`ProjectsPage`](../03_Mockup%20Design/src/app/pages/ProjectsPage.tsx) | ✅ | 🟡 local CRUD |
| SCR-02 | Plan | Product decision | `Plan → Backlog` | Menu parent trong [`layout.tsx`](../03_Mockup%20Design/src/app/components/layout.tsx) | ✅ | ✅ local navigation |
| SCR-03 | Iteration Status | Prompt 3, Screen 3 | `track` + list mode | [`TrackPage`](../03_Mockup%20Design/src/app/pages/IterationStatusPage.tsx) | ✅ | 🟡 |
| SCR-04 | Backlog / Work Item List | Prompt 3, Screen 4 | `backlog`, child of Plan | [`BacklogPage`](../03_Mockup%20Design/src/app/pages/BacklogPage.tsx) | ✅ | 🟡 |
| SCR-05 | Board View | Prompt 3, Screen 5 | `track` + board mode | [`TrackBoardView`](../03_Mockup%20Design/src/app/pages/IterationStatusPage.tsx) | ✅ | 🟡 |
| SCR-06 | Work Item Detail | Prompt 4, Screen 6 | Overlay thay nội dung page | [`WorkItemDetailPage`](../03_Mockup%20Design/src/app/pages/WorkItemDetailPage.tsx) | ✅ | 🟡 |
| SCR-07 | Quality / Defect Management | Prompt 4, Screen 7 | `quality` | [`QualityPage`](../03_Mockup%20Design/src/app/pages/QualityPage.tsx) | ✅ | 🟡 |
| SCR-08 | Portfolio | Prompt 4, Screen 8 | `portfolio` | [`PortfolioPage`](../03_Mockup%20Design/src/app/pages/PortfolioPage.tsx) | ✅ | 🟡 |
| SCR-09 | Release Management | Prompt 4, Screen 9 | `releases` | [`ReleasesPage`](../03_Mockup%20Design/src/app/pages/ReleasesPage.tsx) | ✅ | 🟡 |
| SCR-10 | Reports | Prompt 4, Screen 10 | `reports` | [`ReportsPage`](../03_Mockup%20Design/src/app/pages/ReportsPage.tsx) | ✅ | 🟡 |
| SCR-11 | Notifications | Prompt 4, Screen 11 | `notifications` | [`NotificationsPage`](../03_Mockup%20Design/src/app/pages/NotificationsPage.tsx) | ✅ | 🟡 |
| SCR-12 | Settings / Admin | Prompt 4, Screen 12 | `settings` | [`SettingsPage`](../03_Mockup%20Design/src/app/pages/SettingsPage.tsx) | ✅ | 🟡 |

---

## 3. Global design system trace — Prompt 1

### 3.1 Visual foundation

| Yêu cầu | Mapping hiện tại | Trạng thái / ghi chú |
|---|---|---|
| Corporate, dense, table-first | Layout/components/pages đã được tách theo screen | ✅ |
| Navy primary, gray background, white surface | CSS variables tại [`theme.css`](../03_Mockup%20Design/src/styles/theme.css) | ✅ |
| Typography sans-serif | Inter/system font tại App/Login layout | ✅ |
| Minimal color, semantic status colors | `TYPE_CFG`, `STATUS_CFG`, `PRI_CFG` tại [`components/shared.tsx`](../03_Mockup%20Design/src/app/components/shared.tsx) | ✅ |
| Compact radius, borders and spacing | Theme tokens + Tailwind utility classes | ✅ |
| Dark theme tokens | Có token trong `theme.css`, không có UI chuyển theme | 🟡 |

### 3.2 Component vocabulary

| Prompt component | FE mapping | Ghi chú |
|---|---|---|
| Top navigation | [`TopNav`](../03_Mockup%20Design/src/app/components/layout.tsx) | Dùng xuyên suốt authenticated app |
| Context selector bar | [`ContextBar`](../03_Mockup%20Design/src/app/components/layout.tsx) | Backlog đã bỏ context controls theo quyết định UI |
| Company/Project/Team selector | [`TopNav`](../03_Mockup%20Design/src/app/components/layout.tsx) | ✅ Hierarchy và local selection; production cần API |
| Status summary strip | Implement riêng trong từng page | Chưa tách reusable component |
| Action toolbar | [`IterationStatusPage.tsx`](../03_Mockup%20Design/src/app/pages/IterationStatusPage.tsx) và toolbar riêng từng page | Các action chủ yếu chưa xử lý |
| List / Board toggle | [`TrackPage`](../03_Mockup%20Design/src/app/pages/IterationStatusPage.tsx) | Chuyển view bằng local state |
| Status / type / priority badges | [`components/shared.tsx`](../03_Mockup%20Design/src/app/components/shared.tsx) | Reusable trong mockup |
| Avatar | [`components/shared.tsx`](../03_Mockup%20Design/src/app/components/shared.tsx) | Reusable trong mockup |
| Progress bar | [`components/shared.tsx`](../03_Mockup%20Design/src/app/components/shared.tsx) | Reusable trong mockup |
| Modal | [`NewItemModal`](../03_Mockup%20Design/src/app/components/shared.tsx) | Type order Feature → Story → Defect → Task; submit chưa persist |
| Right-side detail panel | [`DetailPanel`](../03_Mockup%20Design/src/app/components/shared.tsx) | Mở từ table/card và dẫn tới full detail |
| Empty state | [`EmptyState`](../03_Mockup%20Design/src/app/components/shared.tsx) | Có component dùng chung |
| Table / row / inputs / buttons | JSX trực tiếp trong từng page | Scaffold `components/ui` không dùng đã được xóa |

### Nhận xét kiến trúc UI

Frontend đã được refactor khỏi App.tsx monolith: App chỉ điều phối state/screen, layout và shared components có module riêng, mỗi screen nằm trong `pages/`. Visual vẫn là prototype với Tailwind utilities và inline style; chưa phải production design-system package.

---

## 4. App shell và role trace — Prompt 2

### 4.1 App shell

| Yêu cầu | FE mapping | Coverage |
|---|---|---|
| Logo + hierarchy dropdown | [`TopNav`](../03_Mockup%20Design/src/app/components/layout.tsx) | ✅ Company/Workspace → Project → Team, chọn local context |
| Home, Plan, Iteration Status, Quality, Portfolio, Releases, Reports | `NAV_ITEMS` trong [`layout.tsx`](../03_Mockup%20Design/src/app/components/layout.tsx) | ✅ Backlog là child/default screen của Plan |
| Global search | [`layout.tsx`](../03_Mockup%20Design/src/app/components/layout.tsx) | 🟡 Input không search |
| Notifications | [`layout.tsx`](../03_Mockup%20Design/src/app/components/layout.tsx) | ✅ Điều hướng tới Notifications |
| Help | [`layout.tsx`](../03_Mockup%20Design/src/app/components/layout.tsx) | 🟡 Chưa có action |
| Settings theo quyền | [`layout.tsx`](../03_Mockup%20Design/src/app/components/layout.tsx) | ✅ WA quản trị; normal user thấy context Project/Team và My Permissions theo access |
| User menu, role switch demo và Sign out | [`layout.tsx`](../03_Mockup%20Design/src/app/components/layout.tsx) | ✅ Sign out về Login; role switch chỉ dành mockup |
| Context selector theo page | [`ContextBar`](../03_Mockup%20Design/src/app/components/layout.tsx) | 🟡 Selector local; Backlog đã bỏ cụm context bar bên phải |

### 4.2 Project Access model hiện tại

Role type và permission helper nằm tại [`model.ts`](../03_Mockup%20Design/src/app/model.ts).

| Authority / Level | Scope | Ghi chú |
|---|---|---|
| Workspace Admin | Company | Assigned internally; không nằm trong Project membership |
| Admin | Project | All Teams; manage delivery, không quản trị structure/access |
| Editor | Project + explicit Teams | Backlog/Work Item/Task, Quality, Iteration Status |
| Unassigned user | None | No access row; Project hidden and direct URL denied |

Mockup thể hiện UI outcome để review nghiệp vụ; implementation vẫn phải enforce access ở server. Permission Model là read-only và không có custom role/matrix editing.

---

## 5. Screen specification và trace chi tiết

### SCR-00 — Login / Workspace Admin

**Mục đích:** Public entry point cho Workspace Admin trước khi authenticated App Shell được render.

**Mapping:** Phase 0 Authentication → [`LoginPage.tsx`](../03_Mockup%20Design/src/app/pages/LoginPage.tsx).

| Khu vực / yêu cầu | FE hiện tại | Coverage |
|---|---|---|
| Public two-panel layout | Brand/value panel + form card | ✅ |
| Email/password | Controlled inputs | ✅ local state |
| Show/hide password | Toggle icon | ✅ |
| Remember me | Checkbox | ✅ UI only |
| Invalid credential | Generic alert | ✅ mock validation |
| Loading/submitting | Disabled button + label | ✅ simulated timer |
| Login success | Set Workspace Admin and open Home | ✅ local state |
| Sign out | User menu returns to Login | ✅ local state |
| Forgot Password | Link placeholder | ⬜ route/action |

Demo credential chỉ phục vụ local mockup; production không hard-code hoặc seed password này.

### SCR-01 — Home / Workspace Overview

**Mục đích:** Cho người dùng nhìn nhanh tình trạng delivery toàn workspace và công việc liên quan tới bản thân.

**Mapping:** Prompt 3 / Screen 1 → page key `home` → [`HomePage`](../03_Mockup%20Design/src/app/pages/HomePage.tsx).

| Khu vực / yêu cầu | FE hiện tại | Coverage |
|---|---|---|
| Summary: projects, items, sprints, blocked, defects, assigned | `summaryMetrics` | ✅ Tính từ mock data; Active Sprints hard-code |
| My Work table | Filter từ `WORK_ITEMS` theo Marcus Webb | ✅ |
| Recent Activity | `activityFeed` tĩnh | ✅ UI / 🟡 dữ liệu |
| Project Health | Render từ `PROJECTS` | ✅ |
| Click summary để drill down | Điều hướng tới Portfolio/Backlog/Track/Quality | ✅; Assigned to Me chưa action |

**Dữ liệu:** `PROJECTS` và `WORK_ITEMS` tại [`model.ts`](../03_Mockup%20Design/src/app/model.ts).

### SCR-01A — Project Management

**Mục đích:** Quản lý Project trong Công ty cố định `ACME Space Inc.`.

**Mapping:** hierarchy dropdown → New Project/Manage → [`ProjectsPage.tsx`](../03_Mockup%20Design/src/app/pages/ProjectsPage.tsx).

| Khu vực / yêu cầu | FE hiện tại | Coverage |
|---|---|---|
| Project List | Active/Archived, metrics, search, dense table | ✅ |
| Create | Name, key, description, owner, date, multi-Team | ✅ local state |
| Edit | Key immutable, cập nhật fields/Teams | ✅ local state |
| Archive | Confirmation + chuyển khỏi Active selector | ✅ local state |
| Restore | Action trong Archived tab | ✅ local state |
| Workspace CRUD | Không có | N/A — single-company decision |
| Project Members/Overview/API/audit | Chưa có | ⬜ production/next mockup |

### SCR-02 — Plan / Team Planning

**Trạng thái hiện tại:** Plan là navigation parent đứng sau Home. Backlog là child/default screen của Plan. Prototype `PlanPage` split-panel và `NewSprintModal` cũ đã bị xóa khỏi source.

Sprint planning không nằm trong Backlog hiện tại; Sprint Management và Iteration Status là capability riêng.

### SCR-03 — Iteration Status

**Mục đích:** Theo dõi tiến độ sprint hiện tại bằng list hoặc board.

**Mapping:** Prompt 3 / Screen 3 → page key `track` → [`TrackPage`](../03_Mockup%20Design/src/app/pages/IterationStatusPage.tsx).

| Khu vực / yêu cầu | FE hiện tại | Coverage |
|---|---|---|
| Sprint selector, previous/next, list/board toggle | Header của `TrackPage` | ✅ Toggle hoạt động; selector tĩnh |
| Planned Velocity, Iteration End, Accepted, Defects, Tasks | Summary strip tính từ `sprintItems` | ✅ |
| Selected item toolbar | [`IterationStatusPage.tsx`](../03_Mockup%20Design/src/app/pages/IterationStatusPage.tsx) | ✅ Hiện theo selection / 🟡 action chưa xử lý |
| Inline quick create | [`IterationStatusPage.tsx`](../03_Mockup%20Design/src/app/pages/IterationStatusPage.tsx) | ✅ UI / 🟡 không tạo item |
| Dense work item table | List mode trong `TrackPage` | ✅ |
| Row selection | `selectedIds` local state | ✅ |
| Work item side detail | `DetailPanel` | ✅ |

### SCR-04 — Backlog / Work Item List

**Mục đích:** Hiển thị tập trung toàn bộ User Story (`US`) và Defect (`DE`) trong context hiện tại.

**Mapping:** Prompt 3 / Screen 4 → page key `backlog` → [`BacklogPage`](../03_Mockup%20Design/src/app/pages/BacklogPage.tsx).

| Khu vực / yêu cầu | FE hiện tại | Coverage |
|---|---|---|
| Search và filter type/schedule state/priority | Header controls | ✅ local state |
| Backlog columns | Type, ID, Name, Priority, Est, Owner, Schedule State, Release | ✅; Priority chỉ dành cho Defect; đã bỏ Sprint và Updated |
| Create Work Item | Mở `NewItemModal` | 🟡 Không persist |
| Item type order | Feature → Story → Defect → Task; Feature mặc định | ✅ |
| Resizable columns | Drag separator ở mép phải header | ✅ local state |
| Pagination | 10/25/50/100 rows, Previous/Next | ✅ local state |
| Multi-select và bulk toolbar | Move Release/Edit Priority/Assign Owner/Link/Delete | 🟡 action chưa persist |
| Side detail và full detail | `DetailPanel` → `WorkItemDetailPage` | ✅ |
| Inline edit | Chưa có editable cell thực tế | ⬜ |
| Drag reorder | Chưa có | ⬜ |

Không còn trong Backlog: Unplanned strip, Sprint summary/capacity, Sprint filter, Create Sprint, inline/bulk Sprint assignment và Saved Views.

### SCR-05 — Board View

**Mục đích:** Theo dõi work item trực quan theo schedule state.

**Mapping:** Prompt 3 / Screen 5 → page key `track`, chọn `board` → [`TrackBoardView`](../03_Mockup%20Design/src/app/pages/IterationStatusPage.tsx).

| Khu vực / yêu cầu | FE hiện tại | Coverage |
|---|---|---|
| 6 status columns | Defined, In Progress, Code Review, Testing, Done/Completed, Accepted | ✅ |
| Rich work item card | Type, ID, title, priority, estimate, owner và indicators | ✅ |
| Owner quick filter | `filterOwner` local state | ✅ |
| Open item detail | Click card mở side panel/full detail | ✅ |
| Unassigned Project isolation | Project/board hidden; direct route denied | ✅ mockup access gating |
| Drag/drop between columns | Card có `draggable` attribute | 🟡 Không có `onDragStart`, `onDragOver`, `onDrop`; status không đổi |
| Filter type/priority/label/my items | Chưa đủ filter prompt | 🟡 Chỉ có owner |

### SCR-06 — Work Item Detail

**Mục đích:** Xem và chỉnh sửa đầy đủ một Story, Task, Feature hoặc Defect.

**Mapping:** Prompt 4 / Screen 6 → mở từ `DetailPanel` → [`WorkItemDetailPage`](../03_Mockup%20Design/src/app/pages/WorkItemDetailPage.tsx).

| Khu vực / yêu cầu | FE hiện tại | Coverage |
|---|---|---|
| Header: type, ID, status, title, watch, more | Sticky header | ✅ Watch dùng local state |
| Description | Editable cho WA/Admin/Editor trong scope; unassigned item không hiển thị | ✅ UI / 🟡 không lưu |
| Acceptance Criteria | Checklist local state | ✅ UI / 🟡 không lưu |
| Defect Details conditional | Chỉ render khi `item.type === "Defect"` | ✅ |
| Related Work Items | Static relation list + Link Existing | ✅ UI / 🟡 link chưa xử lý |
| Comments | Static thread + input | 🟡 Post chưa thêm comment |
| Attachments | Static file list | 🟡 Upload/download chưa xử lý |
| Activity Log | Static timeline | ✅ UI / 🟡 dữ liệu |
| Metadata panel | Owner, Project, Team, Schedule State, Flow State, Defect-only Priority, Plan Estimate, Release, Iteration | ✅ theo Phase 1 detail sidebar |
| Access behavior | WA/Admin chỉnh trong Project; Editor chỉnh assigned Teams; unassigned Project/item bị ẩn/denied | ✅ mockup gating; production vẫn phải enforce server-side |

### SCR-07 — Quality / Defect Management

**Mục đích:** Tạo, phân loại và theo dõi defect theo severity, environment và delivery context.

**Mapping:** Prompt 4 / Screen 7 → page key `quality` → [`QualityPage`](../03_Mockup%20Design/src/app/pages/QualityPage.tsx).

| Khu vực / yêu cầu | FE hiện tại | Coverage |
|---|---|---|
| Quality summary strip | Open, Critical, Testing, Verified/Accepted, Reopened, Blocker | ✅; một số metric hard-code |
| Quick create defect row | Title, severity, priority, environment, owner, related story | ✅ UI / 🟡 Create chưa thêm data |
| Defect table | Các cột chính theo prompt | ✅ |
| Log Defect modal | `NewItemModal` với type Defect | 🟡 Không persist |
| Multi-select bulk action | Assign, Verify, Reopen, Link, Delete | ✅ UI / 🟡 action chưa xử lý |
| Side/full detail | Dùng component detail chung | ✅ |

### SCR-08 — Portfolio

**Mục đích:** Theo dõi Initiative → Feature/Epic → Story và tiến độ delivery cấp cao.

**Mapping:** Prompt 4 / Screen 8 → page key `portfolio` → [`PortfolioPage`](../03_Mockup%20Design/src/app/pages/PortfolioPage.tsx).

| Khu vực / yêu cầu | FE hiện tại | Coverage |
|---|---|---|
| Summary strip | Initiative, Feature, Story, Accepted, Points | ✅ |
| Hierarchy table | Initiative → Feature → Story | ✅ |
| Expand/collapse | `expanded` set local state | ✅ |
| Progress bars và delivery metadata | Render trong hierarchy row | ✅ |
| New Initiative | Mở generic `NewItemModal` | 🟡 Model modal chưa có Initiative type và không persist |
| Owner/release/status filters | Chưa có đầy đủ | ⬜ |
| Link sang related story/defect | Số liệu hiển thị nhưng chưa điều hướng | 🟡 |

### SCR-09 — Release Management

**Mục đích:** Quản lý release/version và theo dõi mức sẵn sàng phát hành.

**Mapping:** Prompt 4 / Screen 9 → page key `releases` → [`ReleasesPage`](../03_Mockup%20Design/src/app/pages/ReleasesPage.tsx).

| Khu vực / yêu cầu | FE hiện tại | Coverage |
|---|---|---|
| Release list và các cột prompt | `RELEASES_DATA` tại [`model.ts`](../03_Mockup%20Design/src/app/model.ts) | ✅ |
| Status badges | [`ReleasesPage.tsx`](../03_Mockup%20Design/src/app/pages/ReleasesPage.tsx) | ✅ |
| Expand release detail | `expanded` local state + summary panel | ✅ |
| Create Release | Hiển thị theo quyền | 🟡 Chưa có modal/action |
| Included items/open defects/blocked/activity | Detail hiện chủ yếu là summary metrics và description | 🟡 Chưa đủ các bảng/detail prompt |

### SCR-10 — Reports

**Mục đích:** Hiển thị delivery analytics, project health và sprint/release progress.

**Mapping:** Prompt 4 / Screen 10 → page key `reports` → [`ReportsPage`](../03_Mockup%20Design/src/app/pages/ReportsPage.tsx).

| Khu vực / yêu cầu | FE hiện tại | Coverage |
|---|---|---|
| Burndown và Velocity | Recharts với mock data | ✅ UI / 🟡 static |
| Work items by status | Pie chart | ✅ |
| Defect summary | Summary/widget | ✅ |
| Release progress | Widget | ✅ |
| Workload by owner | Bar chart | ✅ |
| Blocked items | Table/list widget | ✅ |
| Sprint progress | Summary strip widget | ✅ |
| Planned vs completed | Chart | ✅ |
| Recent activity | Static widget | ✅ |
| Export Report | Gate cho Admin/PM/PO | 🟡 Nút chưa export |
| Customize Dashboard | Nút hiển thị | 🟡 Chưa có interaction |

### SCR-11 — Notifications

**Mục đích:** Tổng hợp assignment, mention, comment, status, sprint, release và due-date event.

**Mapping:** Prompt 4 / Screen 11 → page key `notifications` → [`NotificationsPage`](../03_Mockup%20Design/src/app/pages/NotificationsPage.tsx).

| Khu vực / yêu cầu | FE hiện tại | Coverage |
|---|---|---|
| Notification list và read/unread visual | State khởi tạo từ `NOTIFICATIONS` | ✅ |
| Filter tabs | All, Unread, Assigned, Comments, Status, Attachments, Sprint, Due Date | ✅ Local filter |
| Mark one/all as read | Local state | ✅ |
| Quick action “Go to item” | Nút xuất hiện khi hover | 🟡 Không điều hướng |
| Mentions tab | Notification type có `mention` nhưng không có tab riêng | 🟡 |
| Release updates tab | Data type có `release` nhưng không có tab riêng | 🟡 |

### SCR-12 — Settings / Admin

**Mục đích:** Quản trị Company, users, Projects, Teams và Project Access trong cùng web app.

**Mapping:** Prompt 4 / Screen 12 → page key `settings` → [`SettingsPage`](../03_Mockup%20Design/src/app/pages/SettingsPage.tsx).

| Khu vực / yêu cầu | FE hiện tại | Coverage |
|---|---|---|
| Workspace Settings | Company fields + internal Workspace Admin display | ✅ Mockup |
| Users | Search/filter, User Details, Project Access | ✅ Mockup |
| Workspaces & Projects | Project tree, Details, Users & Permissions, Teams | ✅ Mockup |
| Permission Model | Fixed access-level explanation, read-only | ✅ Mockup |
| Audit Log | Administrative/settings actions only | ✅ Mockup |
| Access visibility | WA manages all; normal users see only accessible Project/Team context | ✅ Mockup |

---

## 6. Shared data và implementation map

| Concern | Vị trí hiện tại |
|---|---|
| Types, permission helpers và toàn bộ mock data | [`model.ts`](../03_Mockup%20Design/src/app/model.ts) |
| Navigation/context/user menu | [`components/layout.tsx`](../03_Mockup%20Design/src/app/components/layout.tsx) |
| Badge/avatar/modal/detail/empty state | [`components/shared.tsx`](../03_Mockup%20Design/src/app/components/shared.tsx) |
| Login | [`pages/LoginPage.tsx`](../03_Mockup%20Design/src/app/pages/LoginPage.tsx) |
| Business screens | [`pages/`](../03_Mockup%20Design/src/app/pages) |
| Auth state và page composition | [`App.tsx`](../03_Mockup%20Design/src/app/App.tsx) |

---

## 7. Gap tổng hợp cần lưu ý khi chuyển mockup thành production FE

### P0 — Nền tảng bắt buộc

1. Thêm URL router và định nghĩa route chính thức cho từng screen/detail.
2. ✅ Mockup đã tách `App.tsx` thành pages, layout/shared components và model; production tiếp tục tách API/query layer và lazy-loaded route chunks.
3. Chuyển inline mock data sang API contracts và query/mutation layer.
4. Thiết kế RBAC theo permission code; UI gate phải phản ánh quyền backend.
5. Chuẩn hóa form validation, loading, empty, error và permission-denied state.

### P1 — Hoàn thiện hành vi đã được prompt mô tả

1. Drag/drop thật cho Plan, Backlog ranking và Board status transitions.
2. Search/filter/saved views có state và query semantics thống nhất.
3. CRUD và bulk action cho work item, defect, sprint, release, user và settings.
4. Field-level permission cho Work Item Detail.
5. Notification deep-link và report export/customization.

### P2 — Đồng bộ design system

1. Trích badge, table, toolbar, summary metric, filter bar và page header thành shared components.
2. Giảm inline style; dùng semantic token từ theme.
3. Chọn một primitive layer thống nhất thay vì vừa có `components/ui` vừa dựng native JSX riêng.
4. Bổ sung responsive behavior và accessibility states.

---

## 8. Quy tắc duy trì traceability

Khi thêm hoặc thay đổi màn hình:

1. Gán một `SCR-xx` ổn định; không tái sử dụng ID cũ cho màn hình khác.
2. Cập nhật dòng trong “Bản đồ tổng quan”.
3. Link prompt hoặc requirement nguồn.
4. Link tới page component và shared component chính.
5. Đánh giá riêng UI coverage và behavior coverage.
6. Ghi rõ phần dùng mock/static/local state.
7. Khi có router/API, bổ sung route, endpoint/query key và permission code vào section của screen.

