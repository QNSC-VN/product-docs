# Phase 0 — Mockup Coverage Checklist

Ngày đồng bộ: 2026-06-20

## Quyết định đã chốt

- Workspace là root context người dùng nhìn thấy; không dùng `Company/Organization` làm nhãn UI hiện tại.
- App context: `Workspace → Project → Team`.
- Team thuộc Workspace và có thể liên kết với nhiều Project qua `project_teams`.
- Main navigation: `Home → Plan → Track → Quality → Portfolio → Reports`.
- `Plan` chứa Backlog và Timeboxes; `Track` chứa Iteration Status List-only. Không có top-level `Releases` hoặc Team Board trong active navigation. `Portfolio > Release Planning` là Future Backlog Phase 5.
- Backlog chỉ tập trung US/DE; không chứa Sprint planning.

## Coverage

| Module | Screen/state | Trạng thái | Mockup source |
|---|---|---:|---|
| Authentication | Login — Microsoft SSO | ✅ | `pages/LoginPage.tsx` |
| Authentication | SSO redirect/callback simulation + loading | ✅ | `pages/LoginPage.tsx` |
| Authentication | Sign out → Login | ✅ | `App.tsx`, `components/layout.tsx` |
| Authentication | Forgot Password | Future Backlog | Local-auth scope deferred under Microsoft SSO baseline |
| Authentication | Reset Password + invalid/expired token | Future Backlog | Local-auth scope deferred under Microsoft SSO baseline |
| Authentication | Session Expired | ⬜ | Chưa có |
| Authentication | Edit Profile / Change Password | 🟡 | Profile prototype remains; Change Password is Future Backlog under SSO baseline |
| App Shell | Authenticated TopNav/Breadcrumb/Page outlet | ✅ | `components/layout.tsx`, `App.tsx` |
| App Shell | Workspace → Project → Team dropdown | ✅ | `components/layout.tsx` |
| App Shell | 403 Access Denied | ⬜ | Chưa có |
| App Shell | 404 Not Found | ⬜ | Chưa có |
| App Shell | Global Error/Retry/Loading | ⬜ | Chưa có |
| Workspace | Workspace selector | ✅ | Hierarchy dropdown |
| Workspace | Workspace Settings/User table | 🟡 | `pages/SettingsPage.tsx` |
| Workspace | Workspace List/Create/Edit/Archive | N/A | Ngoài phạm vi single-company MVP |
| Workspace | Invite lifecycle/Suspend/Remove confirmation | ⬜ | Chưa có |
| Project | Project selector/Project Health/Settings | 🟡 | Layout, Home, Settings |
| Project | Project List/Create/Edit | ✅ | `pages/ProjectsPage.tsx` |
| Project | Archive/Restore | ✅ | Local actions + confirmation trong `ProjectsPage` |
| Project | Project Overview | ⬜ | Chưa có screen riêng |
| Project | Project Members/read-only archived state | ⬜ | Chưa có |
| Team | Team shown under Project in dropdown | ✅ | `components/layout.tsx` |
| Team | Team List/Create/Edit/Archive | ⬜ | Chưa có |
| Team | Team Members/Lead | ⬜ | Chưa có |
| Team | Link Team to multiple Projects | ⬜ | Chưa có |

## DB ↔ UI Mapping Coverage

| SRS | Mapping đã mô tả | Trạng thái |
|---|---|---:|
| App Shell | Session/user header, permission, unread badge, Workspace–Project–Team tree, UI-only state, navigation-tree DTO | ✅ |
| Authentication | Microsoft SSO entry, callback/session response, logout, protected route/session guard, sensitive fields | ✅ |
| Workspace Context | Workspace settings, member list, invitation list/form, derived fields, pagination DTO, indexes | ✅ |
| Project | Project list, Create/Edit form, member list, Team links, archive/restore, DTO, aggregate/index rules | ✅ |

Definition: ✅ nghĩa là SRS chỉ rõ UI field, API DTO, DB source/target, mục đích, validation/editability và null/derived handling. Khi UI thêm hoặc bỏ field, SRS mapping tương ứng phải được update trong cùng change set.

## Thứ tự mockup tiếp theo

```text
Project Overview/Members
→ Team Management + Project linking
→ Member Management
→ 403/404/Error states
→ Profile
→ Future Backlog: Forgot/Reset Password, Change Password
```

## Lưu ý production

- Login mockup mô phỏng Microsoft SSO redirect/callback; không dùng demo Admin credential hoặc local password trong current scope.
- Local `currentPage` và `isAuthenticated` phải được thay bằng router + session API.
- Permission phải do backend enforce; UI gating chỉ phục vụ UX.
- Tất cả list production dùng server-side pagination/filter và tenant isolation.
