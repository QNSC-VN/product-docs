# SRS — Phase 0.3 Workspace Context & Membership

## 0. Document Control

| Thuộc tính | Giá trị |
|---|---|
| Module ID | `P0-WORKSPACE` |
| Trạng thái | Approved Scope — Single-company MVP |
| Phạm vi | Fixed Workspace context, company users, Workspace Admin authority và settings tối thiểu |
| Không bao gồm | Workspace List/Create/Edit/Archive/Switch UI, multi-tenant self-service |
| Phụ thuộc | Authentication, App Shell, RBAC primitives |

## 0.1 DevInt Audit Reconciliation - 2026-07-24

BA confirmed the user-facing term is **Workspace**. Older `Company` wording in this file is legacy terminology and must not drive UI labels, mockup copy, test names or dev handoff wording for Phase 0-4.

Authoritative current-scope rules:

- Single-workspace MVP: one fixed Workspace, no Workspace create/switch/archive UI.
- App Shell hierarchy is `Workspace → Project → Team`.
- Workspace Admin can edit the Workspace display name.
- Save Workspace name must validate input, show feedback and create an administrative audit event.
- Environment/sample-data mismatch is not a business gap; business confirmation uses the Workspace concept, not the literal sample name.
- Schema/API/infra naming is out of scope for this BA alignment pass.

## 0.2 Project Access Reconciliation - 2026-08-10

This addendum supersedes older global Project role wording in this Phase 0 document:

- `Workspace Admin` is the only company-level authority and is assigned by internal/dev setup.
- Normal users do not receive a global Project Admin/Project Member role.
- Workspace Admin assigns `Admin` or `Editor` independently for each Project. A user with no `project_members` row has implicit No Access (the Project is hidden and direct URLs are denied).
- Only Workspace Admin invites/disables users and manages Project access or Team membership.
- Project access changes apply on the user's next request; company disable/removal applies on next refresh.
- Detailed capabilities are governed by `Phase 4/02_Roles_Permissions/SRS.md`.

## 1. Quyết định sản phẩm

Web hiện phục vụ một Công ty cố định: `ACME Space Inc.`. Trong data model, Công ty vẫn được biểu diễn bởi một row `workspaces` để làm tenant/data boundary, nhưng user không tạo, xóa hoặc chuyển Workspace trong UI MVP.

```text
ACME Space Inc. (fixed Workspace)
├── Projects
├── Teams
├── Members
└── Workspace Settings
```

Các yêu cầu Workspace CRUD/multi-workspace trong tài liệu hoặc prompt cũ được xem là future scope và không được đưa vào Phase 0 hiện tại.

## 2. Tài liệu tham chiếu

| Tài liệu | Phần |
|---|---|
| [`Mini_Rally_Product_Plan.xlsx`](../../Mini_Rally_Product_Plan.xlsx) | Phase 0 / Workspace |
| [`mini_rally_project_overview.md`](../../../00_Documents/mini_rally_project_overview.md) | Core Hierarchy và Workspace Management |
| [`mini_rally_database_design.md`](../../../01_DB%20design/mini_rally_database_design.md) | `workspaces`, `workspace_members`, roles/permissions |
| [`layout.tsx`](../../../03_Mockup%20Design/src/app/components/layout.tsx) | Fixed company hierarchy dropdown |
| [`SettingsPage.tsx`](../../../03_Mockup%20Design/src/app/pages/SettingsPage.tsx) | Company Settings và User Management prototype |
| [`PHASE0_MOCKUP_CHECKLIST.md`](../PHASE0_MOCKUP_CHECKLIST.md) | Mockup coverage |

## 3. Actor và Permission

| Action | Workspace Admin | Normal user |
|---|---:|---:|
| View fixed company context | Yes | Yes after sign-in |
| View company Users | Yes | No |
| Invite user | Yes | No |
| Change user status | Yes | No |
| Assign Project Access/Team membership | Yes | No |
| Suspend/remove company access | Yes | No |
| Update Workspace Settings | Yes | No |
| Create/archive/switch Workspace | N/A | N/A |

Permission codes:

```text
workspace.view
workspace.member.view
workspace.member.invite
workspace.member.manage
workspace.setting.manage
```

## 4. Functional Requirements

| ID | Requirement |
|---|---|
| COMPANY-FR-001 | App resolve Workspace/Company từ deployment config hoặc authenticated session, không từ user-selected workspace payload. |
| COMPANY-FR-002 | App Shell luôn hiển thị company root `ACME Space Inc.` trước Project và Team. |
| COMPANY-FR-003 | User chỉ thấy Project/Team mà effective permission cho phép. |
| COMPANY-FR-004 | Workspace Admin mời user hiện có hoặc user mới qua email. |
| COMPANY-FR-005 | Invitation token one-time, có expiry, lưu hash và rotate khi resend. |
| COMPANY-FR-006 | Workspace Admin đổi company status và Project Access của normal user; Workspace Admin account được quản lý nội bộ và read-only trong UI. |
| COMPANY-FR-007 | Disable/remove company access có hiệu lực ở lần refresh tiếp theo; authored/history data không bị xóa. |
| COMPANY-FR-008 | Company settings tối thiểu gồm display name read-only/default, timezone và locale nếu được bật. |
| COMPANY-FR-009 | Member/invitation/settings mutations phải tạo audit event. |
| COMPANY-FR-010 | Không có endpoint/UI self-service tạo, archive hoặc switch Workspace trong MVP. |

## 5. Core Flows

### 5.1 Load Workspace Context

```text
Login
→ GET /session
→ response chứa fixed workspace/company summary
→ load accessible Projects/Teams
→ render hierarchy dropdown
```

### 5.2 Invite Member

1. Workspace Admin mở Settings → Users.
2. Nhập thông tin user và Project Access ban đầu nếu cần.
3. Backend tạo/rotate invitation token hash.
4. Existing/new user accept đúng email.
5. Membership active và audit event được tạo.

### 5.3 Suspend/Remove Member

- Suspend: chặn access, giữ membership/history.
- Remove: membership chuyển trạng thái removed; không xóa authored/assigned/history.
- Chỉ áp dụng cho normal user. Workspace Admin được internal/dev quản lý và không có action edit/suspend/remove trong Mini Rally UI.

## 6. Screen Mapping

| Screen/area | Mockup hiện tại | Production requirement |
|---|---|---|
| Workspace root selector | `TopNav` hierarchy dropdown | ✅ Fixed Workspace visual; load project/team tree từ API |
| Workspace Settings | `SettingsPage` → Workspace Settings | 🟡 Use Workspace labels, real save/validation and audit event |
| Users | `SettingsPage` → Users | 🟡 List, User Details, Project Access và invitation review có mockup; cần persistence/enforcement thật |
| Invite lifecycle | Chưa có | Pending/expired/resend/cancel/accept states |
| Workspace Admin guard | User Details read-only | Không có edit/suspend/remove action; internal/dev quản lý |
| Workspace List/Create/Edit/Archive | N/A | Không xây dựng |

## 7. Database Usage

### `workspaces`

Một row được provision theo deployment; application user không CRUD row này.

```text
id, name, slug, description, owner_id, status, created_at, updated_at
```

### `workspace_members`

```text
id, workspace_id, user_id, status, joined_at, created_at, updated_at
UNIQUE(workspace_id, user_id)
```

Workspace Admin được internal/dev gán qua `access.user_role_assignments`; normal-user Project Access được lưu riêng trong `project_members.access_level`.

### `workspace_invitations`

```text
id, workspace_id, email, token_hash, status,
invited_by, expires_at, accepted_by, accepted_at,
created_at, updated_at
```

Invitation không gán global role. Project Access ban đầu, nếu có, là command riêng sau khi user accept invitation. Effective capability phải được backend tính; không tin Access Level hoặc role gửi từ client.

### `workspace_settings`

```text
id, workspace_id, timezone, default_locale, date_format, created_at, updated_at
UNIQUE(workspace_id)
```

## 7.1 Company header/settings field mapping

| UI field | API DTO | DB column | Mục đích | Editable/rule |
|---|---|---|---|---|
| Company ID | `company.id` | `workspaces.id` | Tenant key nội bộ | Hidden, server-derived |
| Company name | `company.name` | `workspaces.name` | Header/root hierarchy | Workspace Admin editable; required |
| Company slug | `company.slug` | `workspaces.slug` | Stable tenant identifier | Hidden/read-only; không dùng làm user input MVP |
| Company status | `company.status` | `workspaces.status` | Cho phép/chặn mutation | Read-only; active/archived |
| Timezone | `settings.timezone` | `workspace_settings.timezone` | Date/time display mặc định | Admin editable; IANA timezone |
| Default locale | `settings.defaultLocale` | `workspace_settings.default_locale` | Ngôn ngữ/format mặc định | Admin editable; allow-list |
| Date format | `settings.dateFormat` | `workspace_settings.date_format` | Cách render ngày | Nullable; fallback theo locale |
| Workspace Admin | `company.workspaceAdmin` | Internal assignment source → `users` | Governance/audit | View-only trong UI; internal/dev quản lý account này |

## 7.2 User Management list mapping

Endpoint list phải server-side pagination/search/filter. Không trả `password_hash` hoặc token.

| UI column | API DTO | DB source/join | Mục đích | Sort/filter/null handling |
|---|---|---|---|---|
| Member ID | `items[].membershipId` | `workspace_members.id` | Key cho update/remove action | Hidden |
| User ID | `items[].userId` | `workspace_members.user_id` | Identity/link profile | Hidden |
| Name | `items[].fullName` | `workspace_members.user_id → users.full_name` | Hiển thị người dùng | Search; required |
| Email | `items[].email` | `users.email` | Nhận diện/invite reconciliation | Search; normalized |
| Workspace authority | `items[].workspaceAuthority` | Internal assignment source | Chỉ nhận biết Workspace Admin; normal user không có global Project role | WA read-only; normal user null |
| Membership status | `items[].status` | `workspace_members.status` | Active/invited/suspended/removed | Filter status |
| User account status | `items[].accountStatus` | `users.status` | Phân biệt account suspended với membership | Read-only |
| Joined at | `items[].joinedAt` | `workspace_members.joined_at` | Audit membership | Nullable khi invited |
| Last login | `items[].lastLoginAt` | `users.last_login_at` | Admin xem mức sử dụng | Nullable → “Never” |
| Avatar | `items[].avatarUrl` | `users.avatar_url` | Avatar list | Nullable → initials |
| Actions | Không phải field | Dựa permission + IDs/status | Change status, Project Access hoặc remove | Không map DB column |

List response contract:

```json
{
  "items": [
    {
      "membershipId": "uuid",
      "userId": "uuid",
      "fullName": "Marcus Webb",
      "email": "marcus@acme.com",
      "workspaceAuthority": "workspace_admin",
      "status": "active",
      "accountStatus": "active",
      "joinedAt": "ISO-8601",
      "lastLoginAt": "ISO-8601",
      "avatarUrl": null
    }
  ],
  "page": 1,
  "pageSize": 25,
  "total": 1
}
```

## 7.3 Invitation list/form mapping

| UI field/column | DB column/join | Mục đích | Validation/display |
|---|---|---|---|
| Invitation ID | `workspace_invitations.id` | Action resend/cancel | Hidden |
| Email | `workspace_invitations.email` | Người được mời | Required, normalized, valid email |
| Initial Project Access | Dev-defined invitation/access contract | Quyền ban đầu sau accept | Optional Project + Admin/Editor + Editor Teams |
| Status | `workspace_invitations.status` | Pending/accepted/expired/cancelled badge | Derived expired nếu now > expires_at và pending |
| Invited by | `invited_by → users.full_name` | Audit display | Read-only |
| Expires at | `expires_at` | Cho biết link còn hiệu lực | UTC → company timezone |
| Accepted by | `accepted_by → users` | Audit accept | Nullable |
| Accepted at | `accepted_at` | Audit accept | Nullable |
| Resend/Cancel | Không phải field | Command dùng invitation ID | Gate permission/status |
| Raw invite token | Không trả UI list | Secret link | Chỉ gửi email; DB chỉ lưu hash |

## 7.4 Derived/UI-only fields

| Field | Cách tính/lưu |
|---|---|
| Member total | `COUNT(workspace_members WHERE status=active)` |
| Pending invite total | `COUNT(workspace_invitations WHERE status=pending AND expires_at>now())` |
| Workspace Admin guard | Internal assignment state; không lưu boolean UI riêng |
| Selected table rows/filter/search | Client/query state; không map DB |
| Confirmation text | UI state; không map DB |

## 7.5 Required indexes/constraints

```text
UNIQUE(workspace_members.workspace_id, workspace_members.user_id)
INDEX workspace_members_list_idx ON workspace_members(workspace_id, status, updated_at)
UNIQUE(workspace_settings.workspace_id)
UNIQUE(workspace_invitations.token_hash)
INDEX workspace_invitations_list_idx ON workspace_invitations(workspace_id, status, expires_at)
```

Pending invitation uniqueness cần partial unique index theo DB engine cho `(workspace_id, lower(email)) WHERE status='pending'`, hoặc enforce transactionally nếu engine không hỗ trợ.

## 8. API Contracts

```text
GET    /api/v1/company/context
GET    /api/v1/company/navigation-tree
GET    /api/v1/company/members
POST   /api/v1/company/invitations
POST   /api/v1/company/invitations/:id/resend
DELETE /api/v1/company/invitations/:id
POST   /api/v1/company-invitations/:token/accept
PATCH  /api/v1/company/members/:memberId
DELETE /api/v1/company/members/:memberId
GET    /api/v1/company/settings
PATCH  /api/v1/company/settings
```

Không expose `POST /workspaces`, archive Workspace hoặc switch Workspace trong MVP.

## 9. Security & Isolation

- Mọi project/team/work-item query bắt buộc scope theo fixed `workspace_id` lấy từ server context.
- Không dùng workspace ID trong request payload làm nguồn authorization duy nhất.
- Invitation token lưu hash, one-time và TTL đề xuất 7 ngày.
- Project Access/Team membership changes có hiệu lực ở next request (stricter than next sign-in); company disable/remove có hiệu lực ở next refresh và phải invalidate permission cache phù hợp.
- Cross-tenant ID phải trả 403/404 theo security policy nhất quán, dù UI chỉ có một Company.

## 10. UI States

- Company context loading/error.
- Empty normal-user list; Workspace Admin vẫn hiển thị dưới dạng read-only.
- Pending/expired/cancelled invitation badges.
- Member active/suspended/removed filters.
- Destructive confirmation.
- Workspace Admin row/detail không có edit, suspend hoặc remove action.
- Company context unavailable/configuration error.

## 11. Acceptance Criteria

1. Login chỉ resolve Company đã provision và không hiển thị Workspace switch.
2. Company root hiển thị Project/Team tree đúng permission.
3. Invite existing/new user accept được đúng email.
4. Invitation cũ không dùng được sau resend/accept/cancel/expiry.
5. Disabled/removed user mất company access ở lần refresh tiếp theo qua cả UI và direct API.
6. Workspace Admin hiển thị read-only và không thể edit/suspend/remove từ Mini Rally UI.
7. User status, Project Access, Team membership và Workspace Settings changes có audit event.
8. Không có Workspace CRUD endpoint hoặc UI trong MVP build.

## 12. Implementation Breakdown

```text
COMPANY-T01 Provision fixed Workspace/company config
COMPANY-T02 Company context + navigation-tree API
COMPANY-T03 Membership/invitation service and email job
COMPANY-T04 Effective permission guard
COMPANY-T05 User Management + invitation UI
COMPANY-T06 Company Settings minimal UI
COMPANY-T07 Audit integration
COMPANY-T08 Unit/integration/e2e/isolation tests
```

## 13. Definition of Done

- Single-company scope được enforce ở route/API/UI.
- Company/member/invitation/settings DTO khớp mapping §7.1–7.5; list pagination metadata có contract test.
- Mọi UI action dùng stable ID, không dùng name/email làm foreign key.
- Không còn Workspace CRUD/switch affordance trong production UI.
- Invitation lifecycle và tenant isolation tests pass.
- Company hierarchy selector tích hợp API thật.
- Loading/error/empty/permission states có mockup hoặc implementation được duyệt.
