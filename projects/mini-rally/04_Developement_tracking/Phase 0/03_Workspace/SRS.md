# SRS — Phase 0.3 Company Context & Membership

## 0. Document Control

| Thuộc tính | Giá trị |
|---|---|
| Module ID | `P0-COMPANY` |
| Trạng thái | Approved Scope — Single-company MVP |
| Phạm vi | Fixed company context, membership, invitation, company role và settings tối thiểu |
| Không bao gồm | Workspace List/Create/Edit/Archive/Switch UI, multi-tenant self-service |
| Phụ thuộc | Authentication, App Shell, RBAC primitives |

## 1. Quyết định sản phẩm

Web hiện phục vụ một Công ty cố định: `ACME Space Inc.`. Trong data model, Công ty vẫn được biểu diễn bởi một row `workspaces` để làm tenant/data boundary, nhưng user không tạo, xóa hoặc chuyển Workspace trong UI MVP.

```text
ACME Space Inc. (fixed Company/Workspace)
├── Projects
├── Teams
├── Members
└── Company Settings
```

Các yêu cầu Workspace CRUD/multi-workspace trong tài liệu hoặc prompt cũ được xem là future scope và không được đưa vào Phase 0 hiện tại.

## 2. Tài liệu tham chiếu

| Tài liệu | Phần |
|---|---|
| [`Project_developement_plan.md`](../../Project_developement_plan.md) | Phase 0 / Workspace |
| [`mini_rally_project_overview.md`](../../../00_Documents/mini_rally_project_overview.md) | Core Hierarchy và Workspace Management |
| [`mini_rally_database_design.md`](../../../01_DB%20design/mini_rally_database_design.md) | `workspaces`, `workspace_members`, roles/permissions |
| [`layout.tsx`](../../../03_Mockup%20Design/src/app/components/layout.tsx) | Fixed company hierarchy dropdown |
| [`SettingsPage.tsx`](../../../03_Mockup%20Design/src/app/pages/SettingsPage.tsx) | Company Settings và User Management prototype |
| [`PHASE0_MOCKUP_CHECKLIST.md`](../PHASE0_MOCKUP_CHECKLIST.md) | Mockup coverage |

## 3. Actor và Permission

| Action | Workspace Admin | PM | Other roles |
|---|---:|---:|---:|
| View company context | ✅ | ✅ | ✅ |
| View members | ✅ | theo permission | theo permission |
| Invite member | ✅ | ❌ mặc định | ❌ |
| Change company role/status | ✅ | ❌ | ❌ |
| Suspend/remove member | ✅ | ❌ | ❌ |
| Update company settings | ✅ | ❌ | ❌ |
| Create/archive/switch Workspace | N/A | N/A | N/A |

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
| COMPANY-FR-006 | Workspace Admin đổi role/status member nhưng không vi phạm sole-admin invariant. |
| COMPANY-FR-007 | Suspend/remove member làm mất quyền truy cập ngay; authored/history data không bị xóa. |
| COMPANY-FR-008 | Company settings tối thiểu gồm display name read-only/default, timezone và locale nếu được bật. |
| COMPANY-FR-009 | Member/invitation/settings mutations phải tạo audit event. |
| COMPANY-FR-010 | Không có endpoint/UI self-service tạo, archive hoặc switch Workspace trong MVP. |

## 5. Core Flows

### 5.1 Load Company Context

```text
Login
→ GET /session
→ response chứa fixed workspace/company summary
→ load accessible Projects/Teams
→ render hierarchy dropdown
```

### 5.2 Invite Member

1. Admin mở Settings → User Management.
2. Nhập email và company role.
3. Backend tạo/rotate invitation token hash.
4. Existing/new user accept đúng email.
5. Membership active và audit event được tạo.

### 5.3 Suspend/Remove Member

- Suspend: chặn access, giữ membership/history.
- Remove: membership chuyển trạng thái removed; không xóa authored/assigned/history.
- Không cho suspend/remove sole active Admin.

## 6. Screen Mapping

| Screen/area | Mockup hiện tại | Production requirement |
|---|---|---|
| Company root selector | `TopNav` hierarchy dropdown | ✅ Fixed company visual; load project/team tree từ API |
| Company Settings | `SettingsPage` → Workspace Settings | 🟡 Đổi label thành Company Settings, save/validation thật |
| User Management | `SettingsPage` → User Management | 🟡 Table có sẵn; cần invite/status/action modals thật |
| Invite lifecycle | Chưa có | Pending/expired/resend/cancel/accept states |
| Sole Admin error | Chưa có | Blocking message/confirmation |
| Workspace List/Create/Edit/Archive | N/A | Không xây dựng |

## 7. Database Usage

### `workspaces`

Một row được provision theo deployment; application user không CRUD row này.

```text
id, name, slug, description, owner_id, status, created_at, updated_at
```

### `workspace_members`

```text
id, workspace_id, user_id, role_id, status, joined_at, created_at, updated_at
UNIQUE(workspace_id, user_id)
```

### `workspace_invitations`

```text
id, workspace_id, email, role_id, token_hash, status,
invited_by, expires_at, accepted_by, accepted_at,
created_at, updated_at
```

Effective permission phải được backend tính; không tin role gửi từ client.

### `workspace_settings`

```text
id, workspace_id, timezone, default_locale, date_format, created_at, updated_at
UNIQUE(workspace_id)
```

## 7.1 Company header/settings field mapping

| UI field | API DTO | DB column | Mục đích | Editable/rule |
|---|---|---|---|---|
| Company ID | `company.id` | `workspaces.id` | Tenant key nội bộ | Hidden, server-derived |
| Company name | `company.name` | `workspaces.name` | Header/root hierarchy | Read-only trong MVP hoặc deployment-managed |
| Company slug | `company.slug` | `workspaces.slug` | Stable tenant identifier | Hidden/read-only; không dùng làm user input MVP |
| Company status | `company.status` | `workspaces.status` | Cho phép/chặn mutation | Read-only; active/archived |
| Timezone | `settings.timezone` | `workspace_settings.timezone` | Date/time display mặc định | Admin editable; IANA timezone |
| Default locale | `settings.defaultLocale` | `workspace_settings.default_locale` | Ngôn ngữ/format mặc định | Admin editable; allow-list |
| Date format | `settings.dateFormat` | `workspace_settings.date_format` | Cách render ngày | Nullable; fallback theo locale |
| Owner/Admin | `company.owner` | `workspaces.owner_id → users` | Governance/audit | Không đổi bằng text input; chọn active member theo flow riêng |

## 7.2 User Management list mapping

Endpoint list phải server-side pagination/search/filter. Không trả `password_hash` hoặc token.

| UI column | API DTO | DB source/join | Mục đích | Sort/filter/null handling |
|---|---|---|---|---|
| Member ID | `items[].membershipId` | `workspace_members.id` | Key cho update/remove action | Hidden |
| User ID | `items[].userId` | `workspace_members.user_id` | Identity/link profile | Hidden |
| Name | `items[].fullName` | `workspace_members.user_id → users.full_name` | Hiển thị người dùng | Search; required |
| Email | `items[].email` | `users.email` | Nhận diện/invite reconciliation | Search; normalized |
| Role | `items[].role` | `workspace_members.role_id → roles.name/code` | Hiển thị và change role | Filter role; API dùng role ID/code |
| Membership status | `items[].status` | `workspace_members.status` | Active/invited/suspended/removed | Filter status |
| User account status | `items[].accountStatus` | `users.status` | Phân biệt account suspended với membership | Read-only |
| Joined at | `items[].joinedAt` | `workspace_members.joined_at` | Audit membership | Nullable khi invited |
| Last login | `items[].lastLoginAt` | `users.last_login_at` | Admin xem mức sử dụng | Nullable → “Never” |
| Avatar | `items[].avatarUrl` | `users.avatar_url` | Avatar list | Nullable → initials |
| Actions | Không phải field | Dựa permission + IDs/status | Change role/suspend/remove | Không map DB column |

List response contract:

```json
{
  "items": [
    {
      "membershipId": "uuid",
      "userId": "uuid",
      "fullName": "Marcus Webb",
      "email": "marcus@acme.com",
      "role": { "id": "uuid", "code": "workspace_admin", "name": "Workspace Admin" },
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
| Role | `role_id → roles.name/code` | Role sau accept | Chỉ workspace-scope role hợp lệ |
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
| Sole Admin warning | Count active membership join admin role; không lưu boolean riêng |
| Selected table rows/filter/search | Client/query state; không map DB |
| Confirmation text | UI state; không map DB |

## 7.5 Required indexes/constraints

```text
UNIQUE(workspace_members.workspace_id, workspace_members.user_id)
INDEX workspace_members_list_idx ON workspace_members(workspace_id, status, updated_at)
INDEX workspace_members_role_idx ON workspace_members(workspace_id, role_id, status)
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
- Role/status changes có hiệu lực ngay và invalidate permission cache.
- Cross-tenant ID phải trả 403/404 theo security policy nhất quán, dù UI chỉ có một Company.

## 10. UI States

- Company context loading/error.
- Empty member list ngoại trừ Admin.
- Pending/expired/cancelled invitation badges.
- Member active/suspended/removed filters.
- Destructive confirmation.
- Cannot remove sole Admin.
- Company context unavailable/configuration error.

## 11. Acceptance Criteria

1. Login chỉ resolve Company đã provision và không hiển thị Workspace switch.
2. Company root hiển thị Project/Team tree đúng permission.
3. Invite existing/new user accept được đúng email.
4. Invitation cũ không dùng được sau resend/accept/cancel/expiry.
5. Suspended/removed user mất access ngay qua cả UI và direct API.
6. Không thể remove/suspend sole active Admin.
7. Member role/status/settings changes có audit event.
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
