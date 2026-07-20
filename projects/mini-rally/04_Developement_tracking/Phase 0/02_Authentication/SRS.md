# SRS — Phase 0.2 Authentication & Account

## 0. Document Control

| Thuộc tính | Giá trị |
|---|---|
| Module ID | `P0-AUTH` |
| Trạng thái | Draft for Development |
| Phạm vi | Xác thực, session, password recovery, profile cơ bản |
| Phụ thuộc | User database, email provider, App Shell |
| Không bao gồm | Workspace invitation workflow chi tiết, custom SSO/OAuth enterprise |

## 1. Mục tiêu

Auth trả lời “người dùng là ai?” và tạo session an toàn. Authorization trả lời “người dùng được làm gì?” và thuộc SRS Workspace/Project/RBAC; không trộn hai khái niệm.

## 2. Tài liệu tham chiếu

| Tài liệu | Phần |
|---|---|
| [`Mini_Rally_Product_Plan.xlsx`](../../Mini_Rally_Product_Plan.xlsx) | Phase 0 / Authentication |
| [`mini_rally_project_overview.md`](../../../00_Documents/mini_rally_project_overview.md) | §6.1 Authentication & Account, §11.1 Auth Pages |
| [`mini_rally_usecase_role_mapping.md`](../../../00_Documents/mini_rally_usecase_role_mapping.md) | §3 Account & Workspace |
| [`mini_rally_database_design.md`](../../../01_DB%20design/mini_rally_database_design.md) | §4.1–4.3 `users`, `auth_sessions`, `password_reset_tokens` |
| [`Prompt2.md`](../../../02_Prompt%20UI/Prompt2.md) | User menu và role context |
| [`LoginPage.tsx`](../../../03_Mockup%20Design/src/app/pages/LoginPage.tsx) | Login Workspace Admin mockup |
| [`App.tsx`](../../../03_Mockup%20Design/src/app/App.tsx) | Authenticated/public shell switch |
| [`layout.tsx`](../../../03_Mockup%20Design/src/app/components/layout.tsx) | User menu và Sign out |
| [`SettingsPage.tsx`](../../../03_Mockup%20Design/src/app/pages/SettingsPage.tsx) | Profile & Account prototype |

## 3. Actor và quyền

- Anonymous: login, forgot password, reset password.
- Authenticated User: logout, xem/sửa profile, đổi password.
- Workspace Admin: activate/suspend user thông qua Workspace member management, không sửa password của user.
- System/Email Worker: gửi reset/invitation email.

## 4. Functional Requirements

| ID | Requirement |
|---|---|
| AUTH-FR-001 | Login bằng email + password. |
| AUTH-FR-002 | Email được normalize lowercase/trim trước lookup. |
| AUTH-FR-003 | Chỉ user `active` được tạo session. |
| AUTH-FR-004 | Login thành công cập nhật `last_login_at`. |
| AUTH-FR-005 | Logout revoke session hiện tại. |
| AUTH-FR-006 | Logout all devices revoke toàn bộ session của user. |
| AUTH-FR-007 | Forgot password luôn trả response trung tính, không lộ email tồn tại. |
| AUTH-FR-008 | Reset token một lần dùng, có expiry và được lưu dạng hash. |
| AUTH-FR-009 | Reset password revoke tất cả session cũ. |
| AUTH-FR-010 | User đổi password phải cung cấp current password. |
| AUTH-FR-011 | User xem/cập nhật full name, avatar, timezone/language nếu schema hỗ trợ. |
| AUTH-FR-012 | Session hết hạn redirect về login kèm return URL an toàn. |
| AUTH-FR-013 | Tài khoản suspended/inactive không được refresh session. |
| AUTH-FR-014 | Rate-limit login/forgot/reset endpoints. |

## 5. User Flows

### 5.1 Login

```text
Open /login
→ nhập email/password
→ validate client
→ POST /auth/login
→ set secure session cookie
→ GET /session
→ resolve fixed company và restore last valid Project
→ Home
```

Sai credential trả message chung: `Email or password is incorrect`.

### 5.2 Forgot/Reset Password

```text
Forgot form
→ submit email
→ response trung tính
→ email chứa one-time link
→ reset form validate token
→ nhập password mới + confirm
→ revoke token/sessions
→ redirect login
```

### 5.3 Change Password

```text
Profile & Account
→ Current password
→ New password + Confirm
→ save
→ revoke other sessions
→ confirmation
```

## 6. Screen Mapping với Mockup

| Screen | Mockup hiện tại | Development requirement |
|---|---|---|
| Login — Workspace Admin | `LoginPage` | ✅ Có form email/password, show password, remember me, loading, invalid credential, demo Admin và public layout |
| Forgot Password | Chưa có | Thiết kế mới |
| Reset Password | Chưa có | Thiết kế mới |
| Profile & Account | `SettingsPage` Personal/Profile | Tách thành route/profile form thật |
| User menu | `TopNav` | Profile, Settings, Logout; bỏ demo switch role |
| Session expired | Chưa có | Modal/toast + redirect login |

Auth pages không dùng authenticated TopNav. Chúng dùng minimal public layout với logo, form card và support link.

### 6.1 Mockup-only behavior

- Demo account: `admin@acme.com`; password hiển thị trong mockup chỉ để test local và **không được đưa vào production seed/config**.
- Mockup validate credential bằng local state và delay giả lập; production phải gọi `POST /api/v1/auth/login`.
- Login thành công hiện set role `Workspace Admin` và mở Home; production phải lấy user/role/effective permissions từ session API.
- Sign out hiện trả về Login bằng local state; production phải revoke session phía server trước khi clear client state.
- `Forgot password?`, Privacy và Support hiện mới là extension point, chưa có route/action.

## 7. Database Design

### 7.1 Bảng hiện có: `users`

Theo DB design:

```text
id, full_name, email, password_hash, avatar_url,
status, last_login_at, created_at, updated_at
```

Constraints:

- `UNIQUE(lower(email))` hoặc normalized email column unique.
- `password_hash` không bao giờ trả qua API.
- `status`: invited, active, inactive, suspended.

### 7.2 Bảng `auth_sessions`

```text
id UUID PK
user_id UUID FK users.id
token_hash TEXT UNIQUE
user_agent TEXT NULL
ip_address VARCHAR(64) NULL
expires_at TIMESTAMP
revoked_at TIMESTAMP NULL
created_at TIMESTAMP
last_seen_at TIMESTAMP NULL
```

### 7.3 Bảng `password_reset_tokens`

```text
id UUID PK
user_id UUID FK users.id
token_hash TEXT UNIQUE
expires_at TIMESTAMP
used_at TIMESTAMP NULL
created_at TIMESTAMP
```

### 7.4 Optional profile extension

DB hiện chưa có `timezone`, `locale`. Nếu Profile mockup cần lưu thật, bổ sung vào `users` hoặc `user_preferences`.

### 7.5 Login UI → request/DB mapping

| UI field/state | Request/API | DB source/target | Mục đích | Validation/security |
|---|---|---|---|---|
| Email address | `POST /auth/login.email` | Lookup `users.email` | Xác định account | Trim + lowercase; required; không báo email có tồn tại hay không |
| Password | `POST /auth/login.password` | So sánh với `users.password_hash` | Xác thực credential | Không log/lưu raw password; min/max length ở request boundary |
| Remember me | `rememberMe` | Ảnh hưởng `auth_sessions.expires_at` | Chọn thời hạn session | Không tạo column trong `users`; policy server quyết định TTL |
| Show password | Không gửi | Không map DB | UX toggle input type | Local UI state only |
| Submit/loading | Không gửi | Không map DB | Chống double submit | Runtime request state |
| Invalid credential alert | Error code `AUTH_INVALID_CREDENTIALS` | Không map DB | Feedback chung | Không phân biệt sai email/sai password |
| Return URL | `returnUrl` query/session state | Không map business DB | Quay lại route trước login | Chỉ internal relative URL |
| Last login | Không nhập từ UI | Update `users.last_login_at` | Audit/hiển thị member list | Backend update sau login thành công |

`password_hash`, `token_hash`, raw session token và reset token **không bao giờ** xuất hiện trong response DTO hoặc UI props.

### 7.6 Login success/session response mapping

| Response field | DB source | Mục đích UI |
|---|---|---|
| `user.id` | `users.id` | Internal identity |
| `user.fullName` | `users.full_name` | Header/profile |
| `user.email` | `users.email` | User menu/profile |
| `user.avatarUrl` | `users.avatar_url` | Avatar; null dùng initials |
| `user.status` | `users.status` | Chỉ active được vào app |
| `sessionExpiresAt` | `auth_sessions.expires_at` | Session refresh/expiry |
| `company` | `workspace_members → workspaces` | Fixed Company context |
| `workspaceRole` | `workspace_members.role_id → roles` | Display role |
| `effectivePermissions[]` | `roles → role_permissions → permissions.code` | Gate route/action |
| `lastProjectKey` | User preference nếu triển khai; không lấy từ project table | Chọn landing project |

### 7.7 Forgot/reset password field mapping

| UI/API field | DB source/target | Mục đích | Rule |
|---|---|---|---|
| Forgot email | Lookup `users.email` | Tìm account để phát link | Response luôn trung tính |
| Reset token từ URL | Hash lookup `password_reset_tokens.token_hash` | Validate one-time link | Raw token không lưu DB |
| Token expiry | `password_reset_tokens.expires_at` | Chặn link hết hạn | Server time UTC |
| Token used state | `password_reset_tokens.used_at` | Chặn replay | Set cùng transaction đổi password |
| New password | Update `users.password_hash` | Credential mới | Hash Argon2id/bcrypt; không lưu raw value |
| Confirm password | Không gửi hoặc validate client/request | Bắt lỗi nhập | Không có DB column |
| Revoke sessions | Update `auth_sessions.revoked_at` | Buộc đăng nhập lại | Transaction/policy rõ ràng |

### 7.8 Profile/Change Password mapping

| UI field | DB column | Editable | Mục đích/null handling |
|---|---|---:|---|
| Full name | `users.full_name` | ✅ | Required, 2–255 ký tự |
| Email | `users.email` | Theo policy | Nếu editable cần verify flow; MVP có thể read-only |
| Avatar | `users.avatar_url` | ✅ | Nullable; upload service trả URL |
| Account status | `users.status` | ❌ self | Admin/member flow quản lý |
| Last login | `users.last_login_at` | ❌ | Display/audit |
| Current password | Verify `users.password_hash` | Input only | Không persist raw |
| New/confirm password | Update `users.password_hash` | Input only | Confirm không map DB |
| Timezone/locale | `user_preferences` hoặc schema extension | ✅ nếu triển khai | Không tự thêm vào UI mà thiếu migration |

### 7.9 Required indexes/constraints

```text
UNIQUE INDEX users_email_normalized_uq ON users(lower(email))
UNIQUE(auth_sessions.token_hash)
INDEX auth_sessions_user_active_idx ON auth_sessions(user_id, revoked_at, expires_at)
UNIQUE(password_reset_tokens.token_hash)
INDEX password_reset_tokens_user_idx ON password_reset_tokens(user_id, expires_at)
```

Login query chỉ select field cần thiết để verify; response mapper phải loại `password_hash/token_hash` bằng allow-list DTO, không dựa vào serialize entity tự động.

## 8. API Contracts

```text
POST /api/v1/auth/login
POST /api/v1/auth/logout
POST /api/v1/auth/logout-all
POST /api/v1/auth/refresh             # chỉ nếu dùng refresh-token model
POST /api/v1/auth/forgot-password
POST /api/v1/auth/reset-password
GET  /api/v1/session
GET  /api/v1/me
PATCH /api/v1/me
POST /api/v1/me/change-password
```

Login request:

```json
{ "email": "user@acme.com", "password": "string" }
```

Login response không trả raw token nếu dùng HttpOnly cookie:

```json
{
  "user": { "id": "uuid", "fullName": "...", "email": "...", "status": "active" },
  "expiresAt": "ISO-8601"
}
```

## 9. Security Requirements

- Password hash dùng Argon2id hoặc bcrypt cost phù hợp; không tự viết crypto.
- Session cookie: `HttpOnly`, `Secure` production, `SameSite=Lax/Strict`, scoped path.
- CSRF protection nếu dùng cookie session cho mutation.
- Không lưu access token trong localStorage.
- Reset token entropy đủ mạnh, lưu hash, TTL đề xuất 30 phút.
- Login rate limit theo IP + account identifier; lockout mềm tránh DoS account.
- Audit các event: login success/failure aggregate, logout, password changed/reset, account suspended.
- Không log password, token, cookie hoặc reset link.
- Return URL chỉ cho phép internal relative URL để tránh open redirect.

## 10. Validation và Error Codes

| Case | HTTP | Code |
|---|---:|---|
| Invalid credentials | 401 | `AUTH_INVALID_CREDENTIALS` |
| Account suspended | 403 | `AUTH_ACCOUNT_SUSPENDED` |
| Session expired | 401 | `AUTH_SESSION_EXPIRED` |
| Reset token invalid/expired | 400 | `AUTH_RESET_TOKEN_INVALID` |
| Current password wrong | 400 | `AUTH_CURRENT_PASSWORD_INVALID` |
| Rate limited | 429 | `RATE_LIMITED` |

Password policy MVP đề xuất: tối thiểu 10 ký tự, chấp nhận passphrase, chặn password phổ biến; không bắt đổi định kỳ nếu không có policy doanh nghiệp.

## 11. UI States

- Idle, submitting, success, field error, server error.
- Disable submit khi đang request.
- Hiện Caps Lock warning nếu khả thi.
- Forgot response luôn giống nhau.
- Reset expired có action request link mới.
- Profile save dùng optimistic UI chỉ khi rollback rõ ràng; mặc định chờ server.

## 12. Non-functional Requirements

- Login endpoint p95 < 800ms không tính email worker.
- Session lookup p95 < 200ms.
- Auth flows có integration tests với database thật/test container.
- Email job retry idempotent.
- Tất cả timestamp UTC.

## 13. Acceptance Criteria

1. Active user login và tới Home/context selector.
2. Wrong password không tiết lộ account existence.
3. Suspended user không login/refresh được.
4. Logout làm cookie/session không còn hợp lệ.
5. Reset token chỉ dùng một lần và hết hạn đúng TTL.
6. Reset/change password revoke session theo rule.
7. Refresh protected route khi còn session không bị đá về login.
8. Anonymous truy cập project URL được redirect login rồi quay lại đúng URL sau login.

## 14. Test Scenarios

- Email case/space normalization.
- Wrong email/password, suspended/invited/inactive user.
- Expired/revoked session.
- Concurrent sessions và logout-all.
- Forgot với email tồn tại/không tồn tại.
- Reset invalid/expired/already-used token.
- Password policy boundary.
- CSRF/rate limit/open redirect tests.

## 15. Implementation Breakdown

```text
AUTH-T01 User/auth schema migrations
AUTH-T02 Password hashing service
AUTH-T03 Session service + cookie strategy
AUTH-T04 Login/logout/session endpoints
AUTH-T05 Forgot/reset flow + email job
AUTH-T06 Profile/change-password endpoints
AUTH-T07 Public auth pages
AUTH-T08 App Shell auth guard
AUTH-T09 Replace mock credential/local timer with real API/session cookie
AUTH-T10 Security/integration/e2e tests
```

## 16. Definition of Done

- Schema migration và rollback được review.
- Request/response DTO và migration khớp field mapping §7.5–7.9; có contract test.
- Test xác nhận `password_hash`, session/reset `token_hash` không xuất hiện trong response/log.
- Security requirements có automated test phù hợp.
- Auth pages match global design tokens.
- Không có secret/token trong client storage/log.
- API docs/OpenAPI được generate.
- Acceptance Criteria pass trên desktop browser mục tiêu.
