# SRS — Phase 0.1 App Shell

## 0. Document Control

| Thuộc tính | Giá trị |
|---|---|
| Module ID | `P0-SHELL` |
| Trạng thái | Draft for Development |
| Phạm vi | Web App Shell dùng chung cho toàn bộ Mini Rally |
| Ưu tiên | P0 — bắt buộc trước các feature nghiệp vụ |
| Phụ thuộc | Authentication, Workspace Context, Project Context, RBAC contracts |
| Không bao gồm | CRUD Work Item, Sprint execution, Report calculation |

## 1. Mục tiêu

App Shell là khung ứng dụng luôn tồn tại khi người dùng đã đăng nhập. Nó chịu trách nhiệm điều hướng, giữ context, kiểm soát truy cập ở lớp UI và cung cấp các trạng thái dùng chung. Chỉ vùng page content thay đổi khi chuyển màn hình.

```text
App Shell
├── Top Navigation
├── Workspace/User Context
├── Project Context Bar
├── Global Actions
└── Page Outlet
```

## 2. Tài liệu tham chiếu

| Tài liệu | Phần tham chiếu | Mục đích |
|---|---|---|
| [`Mini_Rally_Product_Plan.xlsx`](../../Mini_Rally_Product_Plan.xlsx) | Phase 0 / App Shell | Phạm vi delivery |
| [`mini_rally_project_overview.md`](../../../00_Documents/mini_rally_project_overview.md) | §4 Application Structure, §11 Key Pages | Cấu trúc ứng dụng và route mong muốn |
| [`mini_rally_usecase_role_mapping.md`](../../../00_Documents/mini_rally_usecase_role_mapping.md) | §13–15 | Nguyên tắc role/permission |
| [`Prompt1.md`](../../../02_Prompt%20UI/Prompt1.md) | Toàn tài liệu | Design system và component vocabulary |
| [`Prompt2.md`](../../../02_Prompt%20UI/Prompt2.md) | Top Header, Context Selector, Role Rules | Yêu cầu trực tiếp cho App Shell |
| [`mini_rally_screen_traceability.md`](../../../00_Documents/mini_rally_screen_traceability.md) | §3–4 | Mapping prompt → mockup |
| [`mini_rally_ui_business_review.md`](../../../00_Documents/mini_rally_ui_business_review.md) | BUG-03 và App Shell observations | Lỗi quyền và runtime đã phát hiện |
| [`App.tsx`](../../../03_Mockup%20Design/src/app/App.tsx) | App state và page orchestration | Mockup tham chiếu visual |
| [`layout.tsx`](../../../03_Mockup%20Design/src/app/components/layout.tsx) | `TopNav`, `ContextBar`, hierarchy selector | App Shell components |
| [`LoginPage.tsx`](../../../03_Mockup%20Design/src/app/pages/LoginPage.tsx) | Public Login layout | Authenticated shell boundary |

Nếu SRS này mâu thuẫn với prompt cũ, dùng quyết định reconciliation: **Plan chứa Backlog và Timeboxes; Track chứa Iteration Status (List-only); không có top-level Releases hoặc Team Board; Portfolio là menu có `Release Planning` thuộc Future Backlog Phase 5**.

## 3. Actor

- Authenticated User: tất cả role.
- Workspace Admin: thấy workspace-level Settings.
- Project Manager: thấy project-level Settings.
- PO/BA, Developer, QA, Viewer: chỉ thấy module được cấp quyền.
- Anonymous User: không được render authenticated shell.

## 4. Navigation Information Architecture

Thứ tự navigation chuẩn:

```text
Home
Plan
  └── Backlog
Iteration Status
Quality
Portfolio
Releases
Reports
```

`Portfolio` có thể bị ẩn bằng feature flag trong MVP. `Settings` và `Notifications` là global actions, không nằm trong main navigation.

## 5. Route Specification

### 5.1 Public routes

```text
/login
/forgot-password
/reset-password/:token
```

### 5.2 Authenticated routes

```text
/projects
/p/:projectKey/home
/p/:projectKey/timeboxes
/p/:projectKey/backlog
/p/:projectKey/iteration-status
/p/:projectKey/quality
/p/:projectKey/portfolio
/p/:projectKey/reports
/p/:projectKey/settings
/settings/company
/notifications
/work-items/:itemKey
```

### 5.3 Route behavior

- Refresh phải giữ nguyên page, workspace và project.
- Browser Back/Forward phải hoạt động.
- Project trong URL phải được validate với fixed company context và membership.
- Route không tồn tại trả về 404.
- Route tồn tại nhưng thiếu quyền trả về Access Denied, không chỉ ẩn menu.
- Nếu project bị archive, page read-only hoặc redirect theo business rule của Project SRS.

## 6. Functional Requirements

| ID | Requirement |
|---|---|
| SHELL-FR-001 | Render TopNav sau khi session hợp lệ. |
| SHELL-FR-002 | Hiển thị Company/Workspace cố định từ deployment/session context; single-company MVP không có workspace switch. |
| SHELL-FR-003 | Hiển thị project context trên các project routes. |
| SHELL-FR-003A | Context selector hiển thị hierarchy `Company/Workspace → Project → Team`; một Team có thể xuất hiện dưới nhiều Project. |
| SHELL-FR-004 | Reserved cho multi-tenant phase sau; không áp dụng UI single-company MVP. |
| SHELL-FR-005 | Khi đổi project, invalidate/refetch toàn bộ project-scoped query. |
| SHELL-FR-006 | Active navigation phải phản ánh URL hiện tại. |
| SHELL-FR-007 | Breadcrumb phải được sinh từ route metadata, không hard-code theo page state. |
| SHELL-FR-008 | Main navigation được filter theo permission và feature flag. |
| SHELL-FR-009 | Global search entry mở search overlay/page; Phase 0 có thể chỉ cung cấp contract. |
| SHELL-FR-010 | Notification badge lấy từ shared notification state/query. |
| SHELL-FR-011 | User menu hỗ trợ Profile, Settings theo quyền và Logout. |
| SHELL-FR-012 | Có global loading indicator cho navigation chậm. |
| SHELL-FR-013 | Có Error Boundary theo page outlet để một page lỗi không làm trắng app. |
| SHELL-FR-014 | Có Access Denied, Not Found và Generic Error state. |
| SHELL-FR-015 | Không dùng role name trực tiếp để bảo vệ route; dùng permission code. |

## 7. Context Model

```ts
type AppContext = {
  currentUser: UserSummary;
  company: WorkspaceSummary;
  project: ProjectSummary | null;
  team: TeamSummary | null;
  permissions: string[];
  featureFlags: Record<string, boolean>;
};
```

Nguồn sự thật:

- User: session endpoint.
- Workspace/project/team identity: URL hoặc route/query contract đã chuẩn hóa.
- Workspace/project detail: API query.
- Permission: backend-computed effective permissions.
- Không lưu object đầy đủ vào localStorage; chỉ lưu `lastProjectKey` như preference nếu cần.

## 8. Screen Mapping với Mockup

| Shell area | Mockup component | Yêu cầu production |
|---|---|---|
| Top navigation | `TopNav` | Chuyển từ `currentPage` state sang URL router |
| Company hierarchy dropdown | `TopNav` trong `components/layout.tsx` | Company cố định → accessible Projects → Teams |
| Main menu | `NAV_ITEMS` trong `components/layout.tsx` | Home → Plan (Backlog, Timeboxes) → Track (Iteration Status List-only) → Quality → Portfolio (Release Planning Future Backlog) → Reports; không có top-level Releases/Team Board |
| Context bar | `ContextBar`, `CtxSelect` | Selector thật; sync URL/query |
| User menu | `TopNav` user dropdown | Bỏ demo role switch trong production |
| Settings icon | `TopNav` | Gate bằng permission |
| Page outlet | `App.tsx` + `pages/*.tsx` | Thay local page state bằng router outlet/layout route |

## 9. Database Usage

App Shell không sở hữu bảng riêng. Nó đọc dữ liệu từ:

| Table | Mục đích |
|---|---|
| `users` | User identity/avatar/status |
| `workspace_members` + `workspaces` | Fixed company context và membership |
| `project_members` + `projects` | Project selector và project access |
| `teams`, `team_members`, `project_teams` | Team context và Project–Team access mapping |
| `roles`, `permissions`, `role_permissions` | Effective permissions |
| `notifications` | Unread badge, triển khai ở Phase 4 |
| `saved_filters` | Saved Views, triển khai sau core |

Tham chiếu schema: [`mini_rally_database_design.md`](../../../01_DB%20design/mini_rally_database_design.md), §4–6, §13–14.

### 9.1 Session/User header field mapping

| UI field | API DTO | DB source | Mục đích | Rule/null handling |
|---|---|---|---|---|
| User display name | `session.user.fullName` | `users.full_name` | Hiển thị tên trong user menu | Required; fallback email prefix chỉ khi dữ liệu legacy lỗi |
| Email | `session.user.email` | `users.email` | Nhận diện account trong menu/profile | Read-only trong shell; normalized lowercase |
| Avatar | `session.user.avatarUrl` | `users.avatar_url` | Avatar header | Nullable; null → initials từ `full_name` |
| Account status | `session.user.status` | `users.status` | Quyết định có render authenticated shell | Chỉ `active` được render shell |
| Effective role label | `session.role.name` | `workspace_members.role_id → roles.name` và project role nếu route project | Hiển thị role context | Chỉ là display; authorization dùng permission codes |
| Permission codes | `session.effectivePermissions[]` | `workspace_members/project_members → roles → role_permissions → permissions.code` | Gate menu/action/route | Không render từ role name hard-code trong production |
| Unread count | `notificationUnreadCount` | `notifications.user_id`, `read_at IS NULL` | Badge notification | Derived `COUNT(*)`; không lưu count riêng |
| Session expiry | `session.expiresAt` | `auth_sessions.expires_at` | Refresh/redirect login | Không hiển thị mặc định; dùng cho session lifecycle |

### 9.2 Company → Project → Team hierarchy mapping

| UI field | API DTO | DB source/join | Mục đích | Filter/order |
|---|---|---|---|---|
| Company ID | `company.id` | `workspaces.id` | Stable tenant key cho request context | Không hiển thị; server-derived |
| Company name | `company.name` | `workspaces.name` | Root label `ACME Space Inc.` | Required |
| Company status | `company.status` | `workspaces.status` | Chặn app nếu tenant disabled/archived | Chỉ active cho mutation |
| Project ID | `projects[].id` | `projects.id` | Navigation/context key | Không hiển thị raw UUID |
| Project key | `projects[].key` | `projects.key` | Label ngắn `NXP` và route key | Uppercase; unique trong Company |
| Project name | `projects[].name` | `projects.name` | Tên node project | Chỉ project active/accessibile mặc định |
| Project status | `projects[].status` | `projects.status` | Ẩn/đánh dấu archived | Active trước, name ASC |
| Team ID | `projects[].teams[].id` | `project_teams.team_id → teams.id` | Selected team context | Không hiển thị UUID |
| Team key | `projects[].teams[].key` | `teams.key` | Route/query stable key | Unique trong Company |
| Team name | `projects[].teams[].name` | `teams.name` | Tên node team | `project_teams.status=active`, `teams.status=active` |
| Team selected | Client state/URL | Không lưu DB | Highlight node hiện tại | Derive từ route/query, không persist business table |
| Project team count | `projects[].teamCount` | `COUNT(project_teams.team_id)` | Dòng phụ “n teams” | Derived, chỉ active links |

Access query bắt buộc join membership/permission. Workspace Admin thấy toàn bộ Project/Team trong Company; role khác chỉ thấy project được cấp quyền và team theo policy.

### 9.3 Fields không lưu DB

| UI state | Nơi lưu | Lý do |
|---|---|---|
| Menu open/closed, expanded project nodes | Component state | Trạng thái trình bày tạm thời |
| Active navigation | URL/router | Không tạo DB column `current_page` |
| Breadcrumb labels | Route metadata + context DTO | Derived |
| Search text | Local state/query parameter | Chỉ lưu khi user chủ động tạo saved filter |
| Loading/error/retry | Query state | Runtime state |

### 9.4 Navigation-tree response tối thiểu

```json
{
  "company": { "id": "uuid", "name": "ACME Space Inc.", "status": "active" },
  "projects": [
    {
      "id": "uuid",
      "key": "NXP",
      "name": "Nexus Platform 2025",
      "status": "active",
      "teamCount": 3,
      "teams": [{ "id": "uuid", "key": "CORE", "name": "Core Platform" }]
    }
  ],
  "effectivePermissions": ["project.view", "team.view"]
}
```

## 10. API Contracts tối thiểu

```text
GET  /api/v1/session
GET  /api/v1/company/context
GET  /api/v1/company/projects
GET  /api/v1/company/navigation-tree
GET  /api/v1/projects/:projectId/context
GET  /api/v1/notifications/unread-count
POST /api/v1/auth/logout
```

`GET /session` response tối thiểu:

```json
{
  "user": { "id": "uuid", "fullName": "Marcus Webb", "email": "...", "avatarUrl": null },
  "sessionExpiresAt": "ISO-8601"
}
```

Project context response phải gồm project summary, workspace summary, membership và `effectivePermissions`.

## 11. Permission Rules

- UI hide/disable chỉ phục vụ UX; API luôn enforce lại.
- Không được render dữ liệu cũ sau khi permission/context đổi.
- Khi role bị hạ trong phiên, query cache nhạy cảm phải clear và route phải re-evaluate.
- Workspace Admin có workspace settings.
- PM có project settings trong project được assign.
- Viewer không có create/edit/settings actions.

## 12. UI States

Mỗi context selector/page outlet phải cover:

- Loading/skeleton.
- Empty workspace/project.
- Unauthorized/forbidden.
- Archived workspace/project.
- Network error + Retry.
- Session expired → redirect login kèm return URL.
- Context switching in progress; chống double-click/race condition.

## 13. Non-functional Requirements

- Shell render ban đầu sau session ≤ 2 giây ở mạng nội bộ bình thường.
- Navigation client-side không full reload.
- Keyboard focus rõ ràng; menu dùng ARIA phù hợp.
- Responsive tối thiểu desktop 1280px; tablet có overflow/collapse strategy.
- Không log token hoặc sensitive session data ra console.
- Page chunk phải lazy-load để giảm bundle ban đầu.

## 14. Acceptance Criteria

1. Login thành công mở đúng last valid workspace/project hoặc selector page.
2. Refresh ở `/backlog` vẫn mở Backlog và đúng context.
3. Back/Forward đổi active navigation chính xác.
4. Đổi project khiến page data đổi và không còn dữ liệu project cũ.
5. Viewer không thấy Settings và truy cập URL trực tiếp nhận 403 page.
6. Hạ role từ Admin xuống Viewer khi đang ở Audit/Settings phải redirect.
7. Page con throw exception chỉ làm hỏng page outlet; TopNav vẫn hoạt động.
8. Menu đúng thứ tự đã chốt; Plan đứng sau Home và Backlog là item con mặc định.

## 15. Test Scenarios bắt buộc

- Valid/expired/revoked session.
- Fixed company context hợp lệ/thiếu cấu hình/disabled.
- Company có 0, 1, nhiều project.
- Direct URL với workspace/project không thuộc membership.
- Role thay đổi trong lúc đang mở Settings.
- Network chậm khi switch project.
- API project context thất bại.
- Browser refresh/deep link/back/forward.
- Mobile/tablet overflow smoke test.

## 16. Implementation Breakdown

```text
SHELL-T01 Router + authenticated layout
SHELL-T02 Route metadata + breadcrumb
SHELL-T03 App context/query layer
SHELL-T04 Workspace selector
SHELL-T05 Project selector
SHELL-T06 Permission guard
SHELL-T07 TopNav/user menu
SHELL-T08 Loading/404/403/error boundary
SHELL-T09 Notification badge contract
SHELL-T10 Unit/integration/e2e tests
```

## 17. Definition of Done

- Tất cả Acceptance Criteria pass.
- Session/header/hierarchy DTO có automated contract test đối chiếu đúng field mapping §9.1–9.4.
- Không trả raw DB entity hoặc sensitive fields ra App Shell.
- Không còn page navigation dựa trên `currentPage` local state.
- Backend permission được test độc lập với UI.
- Có automated tests cho guards và context switching.
- Mockup visual được giữ, nhưng demo role switch bị loại khỏi production.
