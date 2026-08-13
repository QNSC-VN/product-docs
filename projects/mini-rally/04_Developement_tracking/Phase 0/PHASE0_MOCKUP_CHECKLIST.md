# Phase 0 - Mockup Coverage Checklist

Synced date: 2026-08-10

## Confirmed Foundation

- Workspace is the fixed root context visible to users.
- App hierarchy is `Workspace -> Project -> Team`.
- A Team belongs to one parent Project in the current Mini Rally MVP.
- Main navigation is `Home -> Plan -> Track -> Quality -> Portfolio -> Reports` according to effective Project Access.
- Plan contains Backlog and Timeboxes; Track contains Iteration Status and Team Status.
- Team Board and Iteration Board remain Future Backlog.

## Access Reconciliation

- Workspace Admin is the only company-level authority and is assigned internally.
- Normal users receive Admin or Editor independently per Project. A user with no `project_members` row has implicit No Access (Project hidden, direct URLs denied).
- Only Workspace Admin manages Users, Projects, Teams, Project access and Team membership.
- Admin receives All Teams and delivery authority in assigned Projects; structure is read-only.
- Editor sees assigned Projects/Teams and approved delivery-editing surfaces.
- The current authority is `Phase 4/02_Roles_Permissions/SRS.md`.

## Coverage

| Module | Screen/state | Status | Mockup source |
|---|---|---:|---|
| Authentication | Microsoft SSO Login/callback/sign out | Done | `LoginPage.tsx`, `App.tsx`, `layout.tsx` |
| Authentication | Forgot/Reset/Change Password | Future Backlog | Microsoft SSO baseline |
| App Shell | Authenticated TopNav, breadcrumb and page outlet | Done | `layout.tsx`, `App.tsx` |
| App Shell | Access-aware Workspace/Project/Team dropdown | Done | `layout.tsx` |
| App Shell | Access Denied and Not Found | Done | `AccessStatePage.tsx`, `App.tsx` |
| Workspace | Fixed Workspace Settings | Done | `SettingsPage.tsx` |
| Workspace | Workspace create/archive/switch | N/A | Single-company MVP |
| Users | Company list/search/details/invite | Done | `SettingsPage.tsx` |
| Users | Per-Project Access rows and review | Done | `SettingsPage.tsx` |
| Project | Workspace/Project/Team administration tree | Done | `WorkspaceProjectsPanel.tsx` |
| Project | Create/Edit/Archive/Restore/Delete | Done | `WorkspaceProjectsPanel.tsx` |
| Project | Details and estimation settings | Done | `WorkspaceProjectsPanel.tsx` |
| Project | Users & Permissions | Done | `WorkspaceProjectsPanel.tsx` |
| Team | List/Create/Edit/Deactivate/Restore | Done | `WorkspaceProjectsPanel.tsx` |
| Team | Members and Access on Add/Edit Team | Done | `WorkspaceProjectsPanel.tsx` |
| Project Access | WA/Admin/Editor demo views | Done | `model.ts`, `layout.tsx`, `SettingsPage.tsx` |

## Permission Acceptance

- [x] WA sees all administration and every Project/Team.
- [x] WA is excluded from Project membership lists.
- [x] Admin sees assigned Project and All Teams but cannot mutate structure/access.
- [x] Editor sees only assigned Project/Teams.
- [x] No Access (implicit: no `project_members` row) behavior is defined in SRS and test pack.
- [x] User Details and Project Users & Permissions use one shared session state.
- [x] Add Team can set Admin/Editor access and synchronize membership.
- [ ] Production API/service enforcement remains DEV/QA verification.

## Production Notes

- Frontend role-switch and local state are mockup evidence only.
- Backend must enforce Project, Team and action scope; UI gating is only UX.
- Production lists require authorized server-side filtering and pagination.
- Project access changes take effect on the user's next request; company disable/removal takes effect next refresh.
