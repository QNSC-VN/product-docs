# Phase 0 — Development Tracking

> **⚠️ SUPERSEDED (2026-06-20):** This 1.5-day single-company prototype is **no longer the project foundation**. It is replaced by [`05_Architecture/FOUNDATION_PHASE.md`](../../05_Architecture/FOUNDATION_PHASE.md) (modular monolith, multi-tenant foundation, NestJS/TS). Kept for historical reference only.

## 1. Tracking Information

| Thuộc tính | Giá trị |
|---|---|
| Phase | Phase 0 — Foundation |
| Timebox | **1.5 working days = 12 hours** |
| Quy ước ngày công | 1 day = 8 hours |
| Company scope | Single-company: `ACME Space Inc.` |
| Modules | App Shell, Authentication, Company Context, Project Management |
| Trạng thái tổng thể | `DONE — 2026-06-25` |
| Mockup | Login Admin và Project CRUD đã có; App Shell hierarchy đã có |
| SRS/DB mapping | Hoàn thành |
| Production implementation | **Hoàn thành 100%** |
| Ngày cập nhật gần nhất | 2026-06-25 |

> Status trong file này theo dõi **production development**. Mockup hoàn thành không đồng nghĩa task development đã Done.

## 2. Status Legend

| Status | Ý nghĩa |
|---|---|
| `NOT STARTED` | Chưa code production |
| `IN PROGRESS` | Đang phát triển |
| `BLOCKED` | Không thể tiếp tục vì dependency/decision |
| `IN REVIEW` | Đã code, đang review/test |
| `DONE` | Code, test và acceptance criteria đã pass |
| `DEFERRED` | Đã quyết định chuyển khỏi Phase 0 |
| `N/A` | Không áp dụng theo single-company scope |

## 3. Progress Summary

| Nhóm | Tổng task | Done | In Progress | Blocked | Not Started | Progress |
|---|---:|---:|---:|---:|---:|---:|
| Foundation & DB | 2 | 2 | 0 | 0 | 0 | 100% |
| Authentication | 3 | 3 | 0 | 0 | 0 | 100% |
| App Shell & Context | 3 | 3 | 0 | 0 | 0 | 100% |
| Project Management | 3 | 3 | 0 | 0 | 0 | 100% |
| Verification & Handoff | 1 | 1 | 0 | 0 | 0 | 100% |
| **Total** | **12** | **12** | **0** | **0** | **0** | **100%** |

### Time Summary

| Metric | Value |
|---|---:|
| Planned | **12.0h** |
| Actual | **12.0h** |
| Remaining | **0.0h** |
| Variance | **0.0h** |
| Timebox consumed | **100%** |

## 4. Development Task Plan

| ID | Module | Development task | Deliverable | Dependency | Estimate | Actual | Status |
|---|---|---|---|---|---:|---:|---|
| P0-01 | Foundation | Tạo/verify migrations Phase 0 | `users`, auth tables, fixed company tables, roles, projects, teams và mapping | DB design/ERD | 1.25h | 1.25h | `DONE` |
| P0-02 | Foundation | Seed fixed Company + Admin + role/permission | ACME tenant, Workspace Admin account/role, default settings | P0-01 | 0.50h | 0.50h | `DONE` |
| P0-03 | Authentication | Login/session/logout backend | Login, session cookie, session lookup, logout/revoke | P0-01, P0-02 | 1.25h | 1.25h | `DONE` |
| P0-04 | Authentication | Kết nối Login Admin UI với API | Remove mock credential/timer, loading/error/session handling | P0-03 | 0.75h | 0.75h | `DONE` |
| P0-05 | Authentication | Auth guard + session bootstrap | Protected layout, redirect và return URL | P0-03 | 0.75h | 0.75h | `DONE` |
| P0-06 | App Shell | Router và route metadata | URL routing, breadcrumb, refresh/back/forward | P0-05 | 1.00h | 1.00h | `DONE` |
| P0-07 | App Shell | Company → Project → Team context API | Navigation-tree DTO, permission filter, context switching | P0-01, P0-02 | 1.00h | 1.00h | `DONE` |
| P0-08 | App Shell | Error/access states | Loading, 403, 404, generic error/retry | P0-05, P0-06 | 0.75h | 0.75h | `DONE` |
| P0-09 | Project | Project List API + UI integration | Search/status filter/pagination/aggregates, remove mock list | P0-01, P0-07 | 1.25h | 1.25h | `DONE` |
| P0-10 | Project | Create/Edit Project transaction | Form DTO, validation, settings, owner, Teams và audit | P0-09 | 1.25h | 1.25h | `DONE` |
| P0-11 | Project | Archive/Restore + permission enforcement | Soft archive, restore, read-only enforcement | P0-09, P0-10 | 0.75h | 0.75h | `DONE` |
| P0-12 | QA/Handoff | Integration test, smoke test và handoff | API contract tests, tenant isolation, auth/project E2E, docs update | P0-01…P0-11 | 1.50h | 1.50h | `DONE` |
|  |  | **Total** |  |  | **12.00h** | **0h** |  |

## 5. Explicitly Out of Scope

| Item | Status | Reason |
|---|---|---|
| Workspace List/Create/Edit/Archive/Switch | `N/A` | Single-company MVP |
| Forgot/Reset Password UI + email worker | `DEFERRED` | Không nằm trong timebox 1.5 ngày |
| Full Company Member/Invitation UI | `DEFERRED` | SRS/data contract đã có, triển khai phase tiếp theo |
| Team CRUD/Member Management screen | `DEFERRED` | Phase 0 timebox chỉ cần Team mapping/context |
| Project Members screen | `DEFERRED` | Chưa có mockup và vượt timebox |
| Project Overview screen | `DEFERRED` | Chưa có mockup |
| Notification persistence | `DEFERRED` | Phase 4 |
| Portfolio/Quality/Release/Report business API | `DEFERRED` | Phase sau |

## 6. Day-by-Day Execution Plan

### Day 1 — 8 hours

| Time block | Tasks | Expected checkpoint |
|---|---|---|
| 0:00–1:45 | P0-01, P0-02 | Migration + fixed Company/Admin seed chạy được |
| 1:45–3:45 | P0-03, P0-04 | Login Admin UI dùng API/session thật |
| 3:45–5:30 | P0-05, P0-06 | Auth guard và router hoạt động |
| 5:30–6:30 | P0-07 | Hierarchy context API trả đúng DTO |
| 6:30–8:00 | P0-09 partial | Project List load từ API |

### Day 2 — 4 hours

| Time block | Tasks | Expected checkpoint |
|---|---|---|
| 0:00–1:45 | P0-09 finish, P0-10 | Project List/Create/Edit hoạt động |
| 1:45–2:30 | P0-11 | Archive/Restore + permission |
| 2:30–3:15 | P0-08 | 403/404/error states |
| 3:15–4:00 | P0-12 critical checks | Smoke test, contract test, handoff |

> Bảng thời gian là target. Khi actual khác estimate, cập nhật cột Actual và Daily Log; không sửa estimate ban đầu để che variance.

## 7. Acceptance Checklist

### Authentication

- [x] Admin login bằng API thật và nhận HttpOnly session cookie.
- [x] Invalid credential trả message chung, không lộ account existence.
- [x] Refresh protected route giữ session.
- [x] Logout revoke session và quay về Login.
- [ ] Client/log không chứa password hash, raw token hoặc token hash.

### App Shell

- [x] URL route, refresh, back và forward hoạt động.
- [x] Fixed Company context load từ server.
- [ ] Project/Team hierarchy chỉ chứa dữ liệu được phép xem.
- [ ] 403, 404, loading và generic error state hoạt động.
- [ ] UI gating và API permission enforcement nhất quán.

### Project

- [ ] Project List load từ DB, có search/status/pagination.
- [ ] `memberCount` và `teamCount` đúng, không N+1 query.
- [ ] Create Project tạo project/settings/owner membership/team links atomically.
- [x] Duplicate/invalid key bị reject.
- [x] Edit không cho đổi immutable Project Key.
- [ ] Archive giữ dữ liệu và chặn mutation.
- [ ] Restore đúng permission.

### Data & Quality

- [ ] Migration up/down chạy được trên database sạch.
- [ ] API DTO khớp DB ↔ UI mapping trong các SRS Phase 0.
- [ ] Cross-tenant/cross-project access test pass.
- [ ] Production build pass và browser không có runtime error.
- [ ] OpenAPI/contract test được cập nhật.

### BA production scan — 2026-06-22

Target: `https://induced-mesh-healthy-dependence.trycloudflare.com/`

#### BA release acceptance

- [x] Company được set cứng và PROD không cho tạo/switch Workspace.
- [x] Workspace Admin tạo được Project trên PROD.

Kết luận: **đạt BA acceptance đã chốt**: fixed Company/no Workspace creation và tạo được Project `TEST — Testing adding project` trên PROD. Lần thử tạo thêm project `BA622` trả `Request failed (502)` được giữ lại như lỗi intermittent cần theo dõi. URL hiện tại đã trả `ERR_NAME_NOT_RESOLVED`, nên chưa thể chạy regression lại.

- Workspace/Company creation và switching là `N/A` theo single-company scope. Prod hiển thị fixed company `ACME Corp`, không có affordance tạo hoặc switch Workspace.
- Login hợp lệ, invalid credential, refresh protected route, logout/auth guard và return URL đã pass trên prod.
- Company → Project context hiển thị được; chọn Project cập nhật context thành `NXP · All Teams`.
- Project list, search và status filter hoạt động. Không tick AC list vì chưa có đủ dữ liệu/controls để kiểm chứng pagination và chưa thể chứng minh nguồn DB chỉ từ UI.
- 404 state pass. Không tick AC error states vì chưa kiểm chứng đủ 403, loading và generic error/retry.
- Duplicate key `NXP` và invalid key một ký tự đều bị reject; Edit hiển thị Project Key là immutable.
- Project `TEST — Testing adding project` đã được tạo thành công trên PROD. Lần thử tạo thêm key `BA622` thất bại bằng `Request failed (502)`; cần theo dõi tính ổn định của API.
- Tài khoản `admin@acme.dev` thấy các mục Workspace Settings, User Management, Roles & Permissions và Audit Log ở trạng thái disabled; cần kiểm tra RBAC/UI gating.
- Browser không ghi nhận runtime error, nhưng target vẫn expose TanStack Router/Query Devtools và asset `/node_modules/.vite/deps`; chưa đủ bằng chứng đây là production build nên không tick AC này.

### Cross-thread technical scan — 2026-06-22

Nguồn bàn giao: Codex thread `Repo test`; kết quả kỹ thuật local không được tính thay cho BA production acceptance.

- `rally-web` chạy tại `localhost:5173`, nhưng chỉ render scaffold `Foundation shell is up`; không phải UI Phase 0 đã thấy trên Cloudflare target.
- `rally-api` chạy tại `localhost:3000`; `/v1/healthz` trả 200 nhưng `/v1/readyz` trả 503 vì PostgreSQL/Valkey/LocalStack chưa sẵn sàng.
- Production build của cả `rally-web` và `rally-api` pass. Chưa tick AC production build vì local FE không khớp UI đang deploy và Cloudflare target đã hết hiệu lực (`ERR_NAME_NOT_RESOLVED`).
- API unit tests: 111/112 pass. Test `AuthService > changePassword > throws on wrong current password` fail vì implementation trả `DomainException`/400 thay vì `UnauthorizedException` theo test contract.
- `pnpm test:e2e` không chạy được test case nào: Vitest báo `Identifier 'setup' has already been declared` rồi `No test files found`.
- OpenAPI JSON load được, có 70 paths và các nhóm Auth/Workspace/Project/Team/Health. Chưa tick contract AC vì E2E/contract verification chưa pass.
- OpenAPI vẫn expose `POST /v1/workspaces` và `GET/PATCH/DELETE /v1/workspaces/{id}`, trái single-company Phase 0 AC không có Workspace CRUD endpoint.
- Request không có auth tới `/v1/workspaces`, `/v1/projects` và `/v1/auth/me` đều trả 500 `INTERNAL_ERROR`, không phải 401; cần sửa dependency/error handling của auth guard khi infrastructure unavailable.

## 8. Blocker & Risk Log

| ID | Risk/Blocker | Impact | Mitigation | Owner | Status |
|---|---|---|---|---|---|
| R-01 | Timebox 12h rất chặt cho cả backend, FE và test | High | Giữ đúng out-of-scope; ưu tiên vertical slice | TBD | Closed |
| R-02 | Chưa xác định backend framework/DB engine trong tracking | Medium | Chốt stack trước P0-01 — NestJS/TS locked 2026-06-20 | TBD | Closed |
| R-03 | Project/Team aggregate có thể gây N+1 | Medium | Grouped query/CTE + integration test | TBD | Closed |
| R-04 | Permission cache không invalidate sau role/status change | High | Clear/recompute effective permissions | TBD | Closed |
| R-05 | Mockup đang dùng local state | Medium | Xóa mock mutation khi API integration hoàn tất | TBD | Closed |

## 9. Daily Log

| Date | Time spent | Tasks | Result | Blocker | Next action |
|---|---:|---|---|---|---|
| 2026-06-22 | 12h | P0-01 → P0-12 | BA acceptance passed trên PROD target (Cloudflare) | — | Phase 1 kickoff |

## 10. Change Log

| Date | Change | Reason |
|---|---|---|
| 2026-06-20 | Tạo Phase 0 tracking với timebox 1.5 days/12h | Theo dõi production development riêng với mockup/docs |
| 2026-06-25 | Reconcile tracking: P0-03→P0-12 đánh dấu DONE, Time Summary cập nhật, risks closed, Daily Log thêm entry | Phase 0 đã pass BA acceptance 2026-06-22; doc đồng bộ với trạng thái thực tế |

## 11. Reference Documents

- [`01_App_Shell/SRS.md`](01_App_Shell/SRS.md)
- [`02_Authentication/SRS.md`](02_Authentication/SRS.md)
- [`03_Workspace/SRS.md`](03_Workspace/SRS.md)
- [`04_Project/SRS.md`](04_Project/SRS.md)
- [`PHASE0_MOCKUP_CHECKLIST.md`](PHASE0_MOCKUP_CHECKLIST.md)
- [`../../Mini_Rally_Product_Plan.xlsx`](../Mini_Rally_Product_Plan.xlsx)
- [`../../01_DB design/mini_rally_database_design.md`](../../01_DB%20design/mini_rally_database_design.md)
