# SRS — Phase 0.4 Project Management

## 0. Document Control

| Thuộc tính | Giá trị |
|---|---|
| Module ID | `P0-PROJECT` |
| Trạng thái | Draft for Development |
| Phạm vi | Project CRUD, membership, role, settings, selector, Team CRUD và Project–Team mapping |
| Phụ thuộc | Auth, Workspace, App Shell, RBAC primitives |
| Không bao gồm | Work Item CRUD implementation, Sprint/Release CRUD chi tiết |

## 1. Mục tiêu và khái niệm

Project là phạm vi delivery trong Workspace. Work Item, Sprint, Release và Report đều project-scoped. Workspace member không tự động có quyền vào mọi Project trừ khi policy/role quy định.

```text
Workspace ACME
├── Project Nexus (NXP)
├── Project Mobile (MOB)
└── Team Core Platform
    ├── linked to NXP
    └── linked to MOB
```

## 2. Tài liệu tham chiếu

| Tài liệu | Phần |
|---|---|
| [`Project_developement_plan.md`](../../Project_developement_plan.md) | Phase 0 / Project |
| [`mini_rally_project_overview.md`](../../../00_Documents/mini_rally_project_overview.md) | §6.3 Project, §11.3 Project Pages |
| [`mini_rally_usecase_role_mapping.md`](../../../00_Documents/mini_rally_usecase_role_mapping.md) | §4 Project Management |
| [`mini_rally_database_design.md`](../../../01_DB%20design/mini_rally_database_design.md) | §6 Project Management, §7 Workflow |
| [`Prompt2.md`](../../../02_Prompt%20UI/Prompt2.md) | Project context và PM rules |
| [`Prompt4.md`](../../../02_Prompt%20UI/Prompt4.md) | Project Settings |
| [`mini_rally_screen_traceability.md`](../../../00_Documents/mini_rally_screen_traceability.md) | App Shell/Settings mapping |
| [`layout.tsx`](../../../03_Mockup%20Design/src/app/components/layout.tsx) | Project/Team hierarchy selector |
| [`HomePage.tsx`](../../../03_Mockup%20Design/src/app/pages/HomePage.tsx) | Project Health prototype |
| [`SettingsPage.tsx`](../../../03_Mockup%20Design/src/app/pages/SettingsPage.tsx) | Project Settings prototype |
| [`ProjectsPage.tsx`](../../../03_Mockup%20Design/src/app/pages/ProjectsPage.tsx) | Project List/Create/Edit/Archive/Restore mockup |

## 3. Actor và Permission Matrix

| Action | Workspace Admin | Project Manager | PO/Dev/QA/Viewer |
|---|---:|---:|---:|
| Create project | ✅ | ✅ theo policy | ❌ |
| List accessible projects | ✅ | ✅ | ✅ |
| View project | ✅ | member | member |
| Update project | ✅ | ✅ | ❌ |
| Archive project | ✅ | ❌ mặc định | ❌ |
| Restore project | ✅ | ❌ mặc định | ❌ |
| Manage members | ✅ | ✅ | ❌ |
| Project settings | ✅ | ✅ | ❌ |

Permission codes:

```text
project.create
project.view
project.update
project.archive
project.restore
project.member.view
project.member.manage
project.setting.manage
team.view
team.create
team.update
team.archive
team.member.manage
project.team.manage
```

## 4. Functional Requirements

| ID | Requirement |
|---|---|
| PRJ-FR-001 | List chỉ project user được phép truy cập trong workspace hiện tại. |
| PRJ-FR-002 | Create project yêu cầu name, unique key, owner. |
| PRJ-FR-003 | Create atomically tạo project, settings mặc định và owner membership. |
| PRJ-FR-004 | Project key unique trong workspace, normalize uppercase. |
| PRJ-FR-005 | Project key immutable sau khi đã sinh Work Item; MVP có thể immutable ngay từ create. |
| PRJ-FR-006 | Project owner phải là active workspace member. |
| PRJ-FR-007 | Chỉ workspace member mới được add vào project. |
| PRJ-FR-008 | Project member có một active project role tại một thời điểm trong model hiện tại. |
| PRJ-FR-009 | Remove member không xóa authored/assigned/history data. |
| PRJ-FR-010 | Archive là soft state; project trở thành read-only và ẩn mặc định khỏi active list. |
| PRJ-FR-011 | Restore project chỉ Workspace Admin hoặc permission tương ứng. |
| PRJ-FR-012 | Settings điều khiển enable sprint/release/story point. |
| PRJ-FR-013 | Project selector đổi URL/context và invalidate scoped cache. |
| PRJ-FR-014 | Tạo/update/archive/member/settings phải có audit event. |
| PRJ-FR-015 | Team thuộc Workspace và có thể liên kết với nhiều Project trong cùng Workspace qua `project_teams`. |
| PRJ-FR-016 | Team membership tồn tại độc lập với Project–Team link; permission authority vẫn ở Workspace/Project role. |
| PRJ-FR-017 | Dropdown chỉ hiển thị Project/Team user được phép truy cập; cùng Team có thể xuất hiện dưới nhiều Project. |
| PRJ-FR-018 | Work Item/Sprint có `team_id` chỉ khi cặp `(project_id, team_id)` đang hoặc từng có mapping hợp lệ theo history policy. |

## 5. Core Use Cases

### UC-PRJ-01 Create Project

1. Admin/PM mở Project List → Create Project.
2. Nhập name, key, description, owner, dates.
3. Chọn defaults: enable Sprint, Release, Story Point; workflow template.
4. Backend validate workspace permission/key/owner.
5. Transaction tạo project, project_settings, owner member, workflow binding/defaults.
6. Redirect Project Home/Backlog.

### UC-PRJ-02 Manage Members

1. PM mở Project Settings → Members.
2. Search active Workspace members.
3. Add member + project role.
4. Update role hoặc remove.
5. Permission có hiệu lực ngay; clear relevant cache/session permission snapshot.

### UC-PRJ-03 Archive Project

1. Workspace Admin chọn Archive.
2. UI cảnh báo tác động và yêu cầu confirm project key/name.
3. Backend chuyển status archived, không delete child rows.
4. Mutations project-scoped bị chặn; view/history theo policy.

## 6. Screen Mapping với Mockup

| Screen/area | Mockup hiện tại | Development requirement |
|---|---|---|
| Project List | `ProjectsPage` | ✅ Active/Archived tabs, search, metrics và dense table |
| Create Project | `ProjectsPage` → `ProjectModal` | ✅ Name/key/description/owner/start date/multi-Team validation |
| Project selector | `ContextBar` project button | Load accessible projects, switch context |
| Project Health | `HomePage` table | Link tới Project overview; dùng data thật |
| Project Overview | Chưa có riêng | Summary/home project route |
| Project Settings | `SettingsPage` Project Settings | Save thật, permission/validation |
| Project Members | Chưa có đầy đủ trong project settings | Member table/add role/remove |
| Edit/Archive/Restore | `ProjectsPage` | ✅ Local CRUD; production cần API, audit và archived read-only enforcement |
| Team List/Management | Chưa có | Bắt buộc bổ sung cho Phase 0 |
| Link Team to Projects | Chưa có | Multi-project assignment UI |
| Team Members | Chưa có | Add/remove/lead/status UI |
| Hierarchy selector | `TopNav` | ✅ Có visual/local selection; production load từ API |

Đề xuất Project List columns:

```text
Key | Project Name | Status | Owner | Members | Active Sprint | Updated | Actions
```

## 7. Database Design

### 7.1 `projects`

```text
id UUID PK
workspace_id UUID FK workspaces.id
key VARCHAR(20)
name VARCHAR(255)
description TEXT NULL
owner_id UUID FK users.id
status VARCHAR(50)       # active, archived, completed
start_date DATE NULL
end_date DATE NULL
created_at TIMESTAMP
updated_at TIMESTAMP
```

Constraint: `UNIQUE(workspace_id, key)`.

Recommended indexes: `(workspace_id, status)`, `owner_id`, `updated_at`.

### 7.2 `project_members`

```text
id UUID PK
project_id UUID FK projects.id
user_id UUID FK users.id
role_id UUID FK roles.id
status VARCHAR(50)       # active, removed
joined_at TIMESTAMP
created_at TIMESTAMP
updated_at TIMESTAMP     # bổ sung đề xuất
```

Constraint: `UNIQUE(project_id, user_id)`.

### 7.3 `project_settings`

```text
id UUID PK
project_id UUID UNIQUE FK
default_assignee_id UUID NULL FK users.id
default_workflow_id UUID NULL
enable_sprint BOOLEAN DEFAULT true
enable_release BOOLEAN DEFAULT true
enable_story_point BOOLEAN DEFAULT true
created_at TIMESTAMP
updated_at TIMESTAMP
```

`default_assignee_id` nếu có phải là active project member.

### 7.4 Workflow dependency

DB hiện có `workflow_statuses` gắn `project_id` và `workflow_transitions`. Project create phải chọn chiến lược:

- Clone system default statuses/transitions vào project; hoặc
- Dùng workflow template/version table (chưa có trong DB design).

MVP đề xuất clone defaults transactionally để giảm scope.

### 7.5 Work Item key sequence contract

Project SRS phải chuẩn bị key generation cho Phase 1. Không dùng `MAX(item_no)+1` vì race condition.

Quyết định đã chốt cho MVP:

```text
projects.next_item_no BIGINT DEFAULT 1
```

Reserve/update `next_item_no` phải atomic/transactional (`UPDATE ... RETURNING` hoặc row lock); key format `${PROJECT_KEY}-${number}`. Không tạo bảng `project_sequences` trong MVP.

### 7.6 Team và Project–Team mapping

```text
teams(id, workspace_id, name, key, description, lead_id, status, created_at, updated_at)
project_teams(id, project_id, team_id, status, linked_at, unlinked_at, created_at, updated_at)
team_members(id, team_id, user_id, status, joined_at, created_at, updated_at)
```

Constraints tối thiểu:

```text
UNIQUE(workspace_id, key) ON teams
UNIQUE(project_id, team_id) ON project_teams
UNIQUE(team_id, user_id) ON team_members
```

Project và Team trong một `project_teams` row phải thuộc cùng Workspace.

### 7.7 Project List UI ↔ DB mapping

Project List phải lấy dữ liệu từ DB/API; không dùng mảng `PROJECTS` production. Các count/list con nên aggregate trong query/DTO để tránh N+1.

| UI column/field | API DTO | DB source/join | Mục đích | Sort/filter/null handling |
|---|---|---|---|---|
| Project row ID | `items[].id` | `projects.id` | Key cho edit/archive/restore/navigation | Hidden UUID |
| Key | `items[].key` | `projects.key` | Stable display/route key như NXP | Sort/search; uppercase |
| Project | `items[].name` | `projects.name` | Tên project | Search/sort; required |
| Description | `items[].description` | `projects.description` | Dòng phụ giải thích scope | Nullable → “No description” |
| Status | `items[].status` | `projects.status` | Active/Archived badge và tabs | Filter; active/archived/completed |
| Owner | `items[].owner` | `projects.owner_id → users(id,full_name,avatar_url)` | Người chịu trách nhiệm | Required active company member |
| Teams | `items[].teams[]` | `project_teams → teams` | Hiển thị Team đang link | Chỉ active links; sort team name |
| Team count | `items[].teamCount` | `COUNT(project_teams WHERE status=active)` | Summary/+N badge | Derived, không lưu column |
| Members | `items[].memberCount` | `COUNT(project_members WHERE status=active)` | Quy mô project | Derived |
| Start Date | `items[].startDate` | `projects.start_date` | Timeline project | Nullable → “Not set” |
| End Date | `items[].endDate` | `projects.end_date` | Timeline/validation | Nullable; chưa hiện trong list mockup |
| Updated | `items[].updatedAt` | `projects.updated_at` | Cho biết thay đổi gần nhất | Sort DESC mặc định; render relative time |
| Actions | Không phải field | Dựa `id`, `status`, effective permissions | Edit/Archive/Restore | Không tạo DB column |

List endpoint query:

```text
GET /api/v1/company/projects?status=active&search=nexus&ownerId=uuid&page=1&pageSize=25&sort=updatedAt:desc
```

List response:

```json
{
  "items": [
    {
      "id": "uuid",
      "key": "NXP",
      "name": "Nexus Platform 2025",
      "description": "Core platform delivery",
      "status": "active",
      "owner": { "id": "uuid", "fullName": "Marcus Webb", "avatarUrl": null },
      "teams": [{ "id": "uuid", "key": "CORE", "name": "Core Platform" }],
      "teamCount": 1,
      "memberCount": 24,
      "startDate": "2025-01-06",
      "endDate": null,
      "updatedAt": "ISO-8601"
    }
  ],
  "page": 1,
  "pageSize": 25,
  "total": 1
}
```

### 7.8 Create/Edit Project form mapping

| UI field | Request field | DB target | Mục đích | Validation/editability |
|---|---|---|---|---|
| Project Name | `name` | `projects.name` | Tên project | Required, trim, 2–255 |
| Project Key | `key` | `projects.key` | Prefix work item/route | Required, 2–10, uppercase A–Z/0–9; immutable sau create |
| Description | `description` | `projects.description` | Mô tả scope/outcome | Nullable text |
| Project Owner | `ownerId` | `projects.owner_id` | Người chịu trách nhiệm | Chọn bằng user ID; phải active company member |
| Start Date | `startDate` | `projects.start_date` | Timeline | Nullable/ISO date theo policy |
| End Date | `endDate` | `projects.end_date` | Timeline | Nullable; phải >= startDate; mockup hiện chưa có input |
| Teams | `teamIds[]` | Insert/update `project_teams(project_id,team_id,status)` | Link nhiều Team vào Project | Team phải cùng Company; không ghi array vào `projects` |
| Enable Sprint | `settings.enableSprint` | `project_settings.enable_sprint` | Bật capability Sprint | Boolean; default true |
| Enable Release | `settings.enableRelease` | `project_settings.enable_release` | Bật capability Release | Boolean; default true |
| Enable Story Point | `settings.enableStoryPoint` | `project_settings.enable_story_point` | Bật estimation | Boolean; default true |
| Workflow template | `workflowTemplateId` | Clone/init `workflow_statuses/transitions` | Workflow mặc định | Không lưu raw template ID nếu clone; transaction |

Create transaction bắt buộc:

1. Insert `projects` với fixed `workspace_id` từ server context.
2. Insert `project_settings`.
3. Insert owner vào `project_members` với role phù hợp.
4. Insert `project_teams` cho từng `teamIds` sau khi validate cùng Workspace.
5. Khởi tạo workflow mặc định.
6. Ghi audit event.
7. Commit; nếu bước nào lỗi phải rollback toàn bộ.

Các field UI-only như modal open, selected Team checkbox, submit loading và validation message không map DB.

### 7.9 Project Members list/form mapping

| UI column/field | DB source/target | Mục đích | Rule |
|---|---|---|---|
| Membership ID | `project_members.id` | Action key | Hidden |
| User | `project_members.user_id → users` | Name/email/avatar | Chỉ active company member |
| Project Role | `project_members.role_id → roles` | Authorization project scope | Role phải scope project |
| Status | `project_members.status` | Active/removed badge | Filter |
| Joined At | `project_members.joined_at` | Audit | Nullable |
| Add Member userId | Insert `project_members.user_id` | Thêm user | Không gửi name/email làm FK |
| Change Role roleId | Update `role_id` | Đổi quyền | Re-evaluate permission cache ngay |
| Remove | Update status/soft remove | Mất project access | Không xóa authored/history |

### 7.10 Team/Project link mapping

| UI field/column | DB source/target | Mục đích | Rule |
|---|---|---|---|
| Team ID | `teams.id` | Link/action key | Hidden UUID |
| Team Key/Name | `teams.key`, `teams.name` | Selector/chip label | Read-only khi chọn link |
| Team Status | `teams.status` | Không link archived Team | active only |
| Linked state | `project_teams.status` | Checkbox/chip selected | Active row = linked |
| Linked At | `project_teams.linked_at` | Audit | Read-only |
| Unlinked At | `project_teams.unlinked_at` | Audit/history | Nullable |
| Team member count | `COUNT(team_members WHERE status=active)` | Team summary | Derived |
| Link action | Insert/reactivate `project_teams` | Gắn Team | Validate same Workspace |
| Unlink action | Set removed/unlinked_at | Gỡ Team | Không xóa Team/history |

### 7.11 Archive/Restore mapping

| Action/UI state | DB mutation/source | Mục đích |
|---|---|---|
| Archive confirmation | Không map DB | Chống thao tác nhầm |
| Archive Project | `projects.status='archived'`, `updated_at=now()` | Soft archive |
| Archived badge/tab | `projects.status` | Filter/display |
| Read-only banner | Derived từ status | Chặn mutation UI; backend vẫn enforce |
| Restore | `projects.status='active'` | Đưa Project hoạt động lại |
| Archived project history | Child rows giữ nguyên | Không cascade delete |

### 7.12 Required indexes/constraints

```text
UNIQUE(projects.workspace_id, projects.key)
INDEX projects_list_idx ON projects(workspace_id, status, updated_at)
INDEX projects_owner_idx ON projects(workspace_id, owner_id, status)
UNIQUE(project_members.project_id, project_members.user_id)
INDEX project_members_list_idx ON project_members(project_id, status, updated_at)
UNIQUE(project_settings.project_id)
UNIQUE(project_teams.project_id, project_teams.team_id)
INDEX project_teams_project_idx ON project_teams(project_id, status)
INDEX project_teams_team_idx ON project_teams(team_id, status)
UNIQUE(teams.workspace_id, teams.key)
```

List query phải aggregate `memberCount/teamCount` bằng grouped subquery/CTE hoặc pre-aggregated query; không chạy một query count cho từng row.

## 8. API Contracts

```text
GET    /api/v1/company/projects
POST   /api/v1/company/projects
GET    /api/v1/projects/:projectId
PATCH  /api/v1/projects/:projectId
POST   /api/v1/projects/:projectId/archive
POST   /api/v1/projects/:projectId/restore
GET    /api/v1/projects/:projectId/members
POST   /api/v1/projects/:projectId/members
PATCH  /api/v1/projects/:projectId/members/:memberId
DELETE /api/v1/projects/:projectId/members/:memberId
GET    /api/v1/projects/:projectId/settings
PATCH  /api/v1/projects/:projectId/settings
GET    /api/v1/projects/:projectId/context
GET    /api/v1/company/teams
POST   /api/v1/company/teams
PATCH  /api/v1/teams/:teamId
POST   /api/v1/teams/:teamId/archive
GET    /api/v1/teams/:teamId/members
POST   /api/v1/teams/:teamId/members
DELETE /api/v1/teams/:teamId/members/:userId
POST   /api/v1/projects/:projectId/teams/:teamId
DELETE /api/v1/projects/:projectId/teams/:teamId
```

List query:

```text
?status=active&search=nexus&ownerId=...&page=1&pageSize=25
```

Create request example:

```json
{
  "name": "Nexus Platform 2025",
  "key": "NXP",
  "description": "Core platform delivery",
  "ownerId": "uuid",
  "startDate": "2026-07-01",
  "endDate": null,
  "settings": { "enableSprint": true, "enableRelease": true, "enableStoryPoint": true }
}
```

## 9. Business Rules và Validation

- Key: 2–10 ký tự đề xuất, uppercase A–Z/0–9, bắt đầu bằng chữ, không whitespace.
- Name: 2–255 ký tự.
- `end_date >= start_date`.
- Workspace archived không create/update project.
- Project archived không create/update Work Item/Sprint/Release.
- Cannot remove sole owner/manager nếu policy yêu cầu manager tối thiểu.
- Project role phải có scope project.
- PM create project chỉ khi workspace policy cho phép; use-case matrix hiện cho phép PM.
- Status transition project: active → completed/archived; restore archived → active nếu workspace active.

## 10. Tenant Isolation và Security

- Project ID phải được kiểm tra thuộc workspace context hiện tại.
- Membership/permission enforce ở API/service, không chỉ UI.
- User có workspace membership nhưng không project membership không tự động xem project, trừ Workspace Admin/policy.
- Không expose project name/key qua guessed ID nếu không có access.
- Effective permissions re-evaluate sau member role change/remove.
- Audit before/after cho update settings/member/archive.

## 11. UI States

- Project List loading/empty/error.
- No accessible project onboarding.
- Active/Archived tabs.
- Create form validating/duplicate key/submitting.
- Settings saved/unsaved/error.
- Project archived read-only banner.
- Member already exists/not workspace member.
- Selector switching and failed context load.

## 12. Non-functional Requirements

- Project list pagination server-side.
- Selector query p95 < 300ms cho ≤200 users/project volume hợp lý.
- Project create transaction idempotency key để tránh double submit.
- All timestamps UTC, date fields ISO date.
- Key generation concurrency-safe.

## 13. Acceptance Criteria

1. Workspace Admin/allowed PM tạo project với unique key.
2. Duplicate key trong cùng workspace bị từ chối; cùng key ở workspace khác được phép.
3. Create transaction tạo settings và owner membership.
4. User chỉ thấy project được phép truy cập.
5. Add project member chỉ chọn active workspace member.
6. Archive giữ nguyên dữ liệu và chặn mutation.
7. Restore hoạt động đúng permission.
8. Project selector đổi URL/context và không lộ cache cũ.
9. Project key bất biến và sequence contract concurrency-safe.

## 14. Test Scenarios

- Key lowercase/invalid/reserved/duplicate.
- Create với owner không thuộc workspace.
- PM có/không policy create.
- Add duplicate/non-workspace/suspended member.
- Remove current user/owner/sole manager.
- Archive/restore với active sprint/release (policy phải xác định).
- Cross-workspace project ID attack.
- Concurrent project create cùng key.
- Concurrent Work Item sequence reservation (contract test Phase 1).
- Settings feature toggles ảnh hưởng navigation/feature access.

## 15. Implementation Breakdown

```text
PRJ-T01 Project/settings/member/sequence migrations
PRJ-T02 Project CRUD service/API
PRJ-T03 Project membership + permission guard
PRJ-T04 Default workflow initialization
PRJ-T05 Project List/Create UI
PRJ-T06 Project selector integration
PRJ-T07 Project Settings/Members UI
PRJ-T08 Archive/Restore/read-only handling
PRJ-T09 Audit integration
PRJ-T10 Unit/integration/e2e/isolation/concurrency tests
PRJ-T11 Team CRUD/membership API and UI
PRJ-T12 Project–Team linking and hierarchy selector integration
```

## 16. Definition of Done

- Project List/Create/Edit/Archive/Restore mockup đã được duyệt; production tích hợp API theo đúng template.
- Project list/form/member/team DTO khớp mapping §7.7–7.12; có API contract test và migration test.
- `memberCount/teamCount` được verify bằng integration test, không N+1 query.
- All Acceptance Criteria pass.
- Transaction và tenant isolation tests pass.
- API/OpenAPI và migration docs hoàn chỉnh.
- App Shell project context dùng API thật.
- Project archived state được test xuyên route/API.
