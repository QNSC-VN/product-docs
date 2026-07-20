# Phase 4 - Mockup Coverage Checklist

Synced date: 2026-07-17

## 1. Phase Scope

Phase 4 is split into 3 features so BA can approve one feature and one task at a time:

1. P4.1 Notifications.
2. P4.2 Roles & Permissions.
3. P4.3 Settings & Audit.

BA working rule:

- Finish the current task, wait for BA confirmation, then move to the next task.
- If a question appears, ask BA before deciding.
- Team Board is Future Backlog and is not part of Phase 4 core scope.

## 2. P4.1 Notifications Current Mockup Scope

Current observed behavior:

- Bell icon in top navigation opens the `Notifications` page.
- Page header shows title, unread count and `Mark all as read`.
- Filters shown: `All`, `Unread`, `Assigned`, `Mentions`.
- Popup notification appears for the newest unread assignment/mention notification.
- Notification cards show title, body, project context, actor avatar and relative time.
- Unread notifications have distinct visual treatment.
- Clicking a notification marks it read in local mock state.
- Clicking a notification or `Go to item` routes to the related US/DE Work Item detail.

## 3. Mockup Coverage Summary

| Area | Requirement | Mockup status | Mockup source | Notes |
|---|---|---:|---|---|
| Notification entry | Top nav bell opens Notification Center | Done | `App.tsx`, `layout.tsx` | Bell currently has icon-only behavior |
| Unread count | Header displays unread count | Done | `NotificationsPage.tsx` | Local mock data |
| Filters | Only approved category tabs are visible | Done | `NotificationsPage.tsx` | Approved tabs: All, Unread, Assigned, Mentions |
| Popup | New unread assignment/mention shows a popup | Done | `NotificationsPage.tsx` | Local mock display only |
| Read one | Click notification marks it read | Done | `NotificationsPage.tsx` | Local state only |
| Mark all read | Header action marks all read | Done | `NotificationsPage.tsx` | Local state only |
| Item route | Notification card and `Go to item` route to related US/DE | Done | `NotificationsPage.tsx`, `App.tsx` | Opens Work Item Detail in mockup |
| Preferences | Notification preferences | Not in scope | `01_Notifications/SRS.md` | Removed from Phase 4.1 baseline |
| Permission guard | User only sees allowed notifications | Business rule | `01_Notifications/SRS.md` | Requires P4.2 alignment |

## 4. P4.1 Acceptance Checklist

### Mockup Baseline

- [x] Bell opens Notifications page.
- [x] Notifications page shows unread count.
- [x] Notifications page shows category filters.
- [x] Notification card displays core event information.
- [x] Read/unread visual treatment is present.
- [x] Clicking a notification can mark it read.
- [x] Mark all as read exists.
- [x] Popup is shown for an unread assignment/mention notification.
- [x] Clicking notification opens related US/DE Work Item detail.
- [x] Clicking `Go to item` opens related US/DE Work Item detail.

### Development Must Verify

- [ ] API returns only current user's notifications.
- [ ] API unread count matches UI count.
- [ ] Read/unread state persists.
- [ ] Mark all as read persists.
- [ ] Filters return correct categories.
- [ ] US/DE assignment creates notification for assigned user only.
- [ ] US/DE Note mention creates notification popup/list entry for mentioned user only.
- [ ] Notification card displays enough US/DE context for the user.
- [ ] Assignment notification route opens assigned US/DE.
- [ ] Mention notification route opens US/DE containing the Note mention.
- [ ] Inaccessible targets show safe access-denied/not-found states.
- [ ] Notification creation respects project/team access.

## 5. P4.2 Roles & Permissions Current Mockup Scope

Current observed/planned behavior:

- Workspace > Roles & Permissions uses production role codes instead of older business-persona roles.
- Role list includes only `workspace_admin`, `project_admin` and `project_member`.
- `workspace_member` is removed because this MVP has one workspace/company; workspace-level access is admin-only.
- `project_viewer` is removed. Project Admin may view other projects in read-only mode.
- `guest` is removed from Phase 4 RBAC; future external collaborator behavior is out of scope.
- Matrix is organized by Phase 0-4 screen and CRUD-style action so BA/dev can see where View, Create, Edit and Delete operations should be enabled, read-only, disabled or hidden.
- Legend states: `E` Enabled, `R` Read-only, `D` Disabled, `H` Hidden/Denied.
- PM/BA/Developer/Tester/Viewer persona roles are removed; the mockup uses only Workspace Admin, Project Admin and Project Member.
- Top-right gear is labeled as Workspace Settings for workspace-wide configuration.
- Workspace dropdown action is labeled Manage Projects for project management under the workspace.
- Team Management and User Management are moved to the top-right Settings gear.
- Workspace Admin can click `Edit` to unlock permission states for other production roles, then click `Save` to lock the matrix again.
- Workspace Admin role column is locked as the system-owner baseline.
- Project Member is limited to the assigned project's Backlog, Work Item/Task detail and Iteration Status workflows.
- Project Member can create, edit and delete US/DE and Tasks, but cannot assign Release or access project administration/planning modules.
- Workspace Admin alone invites/deactivates users, assigns roles, manages project/team membership and allocates resources to teams.
- Project and Team rows open edit modals only for Workspace Admin.
- Workspace Admin alone creates, archives, restores and deletes Projects.
- Workspace Admin may assign a Project Admin to manage one or more Projects.
- Project Admin edits Project Settings only for assigned managed Projects; configurable Workflow Status and Labels are deferred.
- Project Admin has full CRUD for delivery modules in assigned managed Projects and read-only access to those modules in other Projects.
- Project Admin Delete actions require confirmation and dependency validation.
- Every Screen + Action row has its own permission code; generic `*:manage` permissions are removed from the editable matrix.
- Archive/Restore, user role/status/team allocation and team info/status/lead are separate actions.
- Auth, App Shell, Personal and Notification baseline rows are locked at `E` for all roles.
- Role/matrix/project-team allocation changes apply at next login; company deactivation/removal applies at the user's next page refresh.
- Project Member sees only assigned Teams and has no `All Teams`; Workspace Admin and Project Admin may use `All Teams`.
- Backlog subtitle uses the active Project/Team context instead of a hard-coded `All Teams`.
- Demo role switch uses only the three approved roles and updates visible navigation and scope.
- Project Admin is read-only when the selected Project is not in the assigned managed-project list.
- Notification Preferences is removed from Settings; Phase 4 notifications remain fixed to assignment and mention events.
- Every role can open Profile & Account; Project Member sees Project/Workspace settings as unavailable.
- Governance actions default to WA-only but remain editable for PA/PM as an accepted MVP override.
- Portfolio, top-level Release Tracking and Reports are marked Phase 5 deferred in the plan/docs and excluded from Phase 4 RBAC core.

### P4.2 Mockup Coverage Summary

| Area | Requirement | Mockup status | Mockup source | Notes |
|---|---|---:|---|---|
| Prod roles | Show approved role codes and slugs | Done | `SettingsPage.tsx` | Workspace Admin, Project Admin, Project Member |
| Screen/action matrix | Break permissions by Phase 0-4 screen and CRUD-style user action | Done | `SettingsPage.tsx` | Matrix rows include Auth, App Shell, Home, Manage Projects, Backlog, Work Item Detail, Task, Timeboxes, Track, Quality, Notifications, Settings and Audit |
| Action states | Show enable/read-only/disabled/hidden decision | Done | `SettingsPage.tsx` | E/R/D/H legend visible |
| Role selection | Select a role and visually inspect its column | Done | `SettingsPage.tsx` | Selected column is highlighted |
| Phase 5 exclusion | Exclude Portfolio, top-level Release Tracking and Reports from Phase 4 core | Done | `02_Roles_Permissions/SRS.md` | RBAC returns after Phase 5 scope; no UI banner in matrix |
| Shell entry points | Distinguish Workspace Settings from Manage Projects | Done | `layout.tsx`, `ProjectsPage.tsx`, `SettingsPage.tsx` | Top-right gear opens workspace/team/user/role/audit settings; workspace dropdown opens project management |
| Team Management entry | Move team administration to top-right Settings gear | Done | `SettingsPage.tsx`, `ProjectsPage.tsx` | Manage Projects no longer shows Teams tab |
| User Management entry | Move user administration to top-right Settings gear | Done | `SettingsPage.tsx`, `ProjectsPage.tsx` | Manage Projects no longer shows Users tab |
| User Management list | Show user identity and contact fields without inline row action buttons | Done | `SettingsPage.tsx` | Columns: Name, Email, Phone number, Role, Status, Last Login |
| Workspace Admin account | Keep Workspace Admin in list but make detail read-only | Done | `SettingsPage.tsx` | Internal setup account cannot be edited and has no Save action |
| User search | Search users by name, phone number and email beside role filter | Done | `SettingsPage.tsx` | Search works with role filter |
| User detail dialog | Click a user row to edit basic information | Done | `SettingsPage.tsx` | Editable: Name, Role, Status, Phone number; Email read-only |
| Permission edit flow | Workspace Admin clicks Edit, changes non-WA role states, then clicks Save | Done | `SettingsPage.tsx` | Dropdown values: E/R/D/H only appear in edit mode; WA locked |
| Audit log shape | Audit rows use Time, Actor and Detail only | Done | `SettingsPage.tsx` | Time includes weekday/date/month/year/hour/minute/second; Action and Entity columns removed |
| Audit filtering | Search audit rows by actor name and time text | Done | `SettingsPage.tsx` | Filters are mockup-local |
| Backend enforcement | API permission guard | Not in mockup | `02_Roles_Permissions/SRS.md` | Requires dev implementation |
| Access denied | Shared Access Denied and Not Found states | Done | `AccessStatePage.tsx`, `App.tsx` | Safe fallback without restricted metadata |

### P4.2 Acceptance Checklist

- [x] Mockup follows production role model.
- [x] Matrix is grouped by screen/action.
- [x] Action wording uses explicit `View`, `Create`, `Edit` or `Delete` verbs instead of generic workflow labels.
- [x] Each action has an intended permission code.
- [x] Each role/action has E/R/D/H state.
- [x] Documentation records the draft matrix.
- [x] Matrix excludes Phase 5 Portfolio, Release Tracking and Reports.
- [x] Top-right gear is workspace-wide settings.
- [x] Workspace dropdown Manage Projects opens project management under the workspace.
- [x] User Management is under top-right Settings gear.
- [x] Workspace Admin can click `Edit` to unlock E/R/D/H cells for non-WA roles.
- [x] Workspace Admin can click `Save` to lock the matrix after changes.
- [x] Workspace Admin column remains locked.
- [x] BA removed `workspace_member` from MVP role scope.
- [x] BA removed `project_viewer`; Project Admin gets read-only access in other projects.
- [x] BA removed `guest` from Phase 4 RBAC scope.
- [x] Project Member can create, edit and delete US/DE and Tasks in the assigned project.
- [x] Project Member is excluded from Release assignment and non-Backlog/Iteration Status management modules.
- [x] Workspace Admin is the only role allowed to manage users, project/team membership and team resource allocation.
- [x] Workspace Admin owns Project create/archive/restore/delete actions.
- [x] Project Admin can be assigned one or more managed Projects.
- [x] Project Admin can edit Project Settings in assigned managed Projects; configurable Workflow Status and Labels remain deferred.
- [x] Project Admin delivery modules are full CRUD in assigned managed Projects and read-only in other Projects.
- [x] Delete behavior requires confirmation and blocks removal when dependencies disallow it.
- [x] Each matrix row has an independent permission code.
- [x] Create/Edit/Delete/Archive/Restore actions can be configured separately.
- [x] System baseline actions remain visible but cannot be edited.
- [x] Effective-time rules distinguish next-login permission changes from next-refresh company removal.
- [x] Team-scope rules distinguish Project Member assigned Teams from WA/PA `All Teams`.
- [x] Backlog displays the selected Project/Team context.
- [x] Legacy persona roles are removed from the mockup source.
- [x] Role simulation updates navigation, project/team scope and PA cross-project read-only state.
- [x] Settings does not expose Notification Preferences.
- [x] Project Member can access personal Profile without gaining Project/Workspace settings access.
- [x] Final RBAC business-rule review completed and confirmed by BA.
- [x] Only system baseline rows are hard-locked; governance rows remain configurable by WA.
- [x] Access Denied and Not Found mockup states provide a safe Back to Backlog action.

## 6. P4.3 Settings & Audit Current Mockup Scope

Current observed/planned behavior:

- Workspace Settings represents the single company/workspace configuration.
- Workspace Settings is opened from the top-right gear and is workspace-wide, not project management.
- Top-right gear Settings sidebar does not show Project Settings, Workflow Status or Labels.
- Project Settings has one entry point only: `Manage Projects > Projects`.
- Only Workspace Admin can access Workspace Settings.
- Workspace Settings shows Company Name, Workspace Slug, Company Scope and Workspace Admin.
- Workspace Slug, Company Scope and Workspace Admin are read-only.
- Workspace Admin is assigned by internal/dev setup and displayed in Workspace Settings.
- Save Changes is available only to Workspace Admin.
- Saving Workspace Settings must create an audit event.
- Project Settings reuses the Phase 1 Manage > Projects baseline; Phase 4 only removes duplicate entry points and clarifies role context.
- Project-specific Workflow Status configuration is deferred because all projects use the approved default Agile statuses in this MVP.
- Label management is deferred because Phase 4 has no confirmed label assignment/filtering workflow.
- User Management, Audit Log and destructive confirmations are confirmed for the Phase 4.3 baseline.

### P4.3 Mockup Coverage Summary

| Area | Requirement | Mockup status | Mockup source | Notes |
|---|---|---:|---|---|
| Workspace Settings access | Company-level settings are WA-only | Done | `SettingsPage.tsx` | PA/PM cannot open workspace admin sections |
| Company identity | Show editable Company Name | Done | `SettingsPage.tsx` | Uses single-company language |
| Workspace slug | Show system slug as read-only | Done | `SettingsPage.tsx` | Slug is reference only |
| Company scope | Show single-company workspace scope | Done | `SettingsPage.tsx` | Confirms no workspace-member role needed |
| Workspace Admin | Display primary admin assigned by internal/dev setup | Done | `SettingsPage.tsx` | View-only; no admin dropdown in Workspace Settings |
| Save action | Save button appears only for Workspace Admin | Done | `SettingsPage.tsx` | Audit requirement recorded in SRS |
| Project settings entry | Keep project settings in one place | Done | `SettingsPage.tsx`, `ProjectsPage.tsx` | Top-right gear removes project settings; Manage Projects owns project configuration |
| Project settings baseline | Reuse Phase 1 Manage > Projects create/edit/archive behavior | Done | `Phase 1/08_Manage_Projects_Teams_Users/SRS.md`, `ProjectsPage.tsx` | No new Project CRUD fields in Phase 4 |
| Workflow Status | Defer project-specific workflow configuration | Deferred | `03_Settings_Audit/SRS.md` | Default Agile statuses remain the MVP baseline |
| Labels | Defer label management | Deferred | `03_Settings_Audit/SRS.md` | No label assignment/filtering/reporting workflow in Phase 4 |
| User Management entry | Move user administration to top-right Settings gear | Done | `SettingsPage.tsx`, `ProjectsPage.tsx` | Manage Projects no longer shows Users tab |
| User Management list | Show user identity and contact fields without inline row action buttons | Done | `SettingsPage.tsx` | Columns: Name, Email, Phone number, Role, Status, Last Login |
| Workspace Admin account | Keep Workspace Admin in list but make detail read-only | Done | `SettingsPage.tsx` | Internal setup account cannot be edited and has no Save action |
| User search | Search users by name, phone number and email beside role filter | Done | `SettingsPage.tsx` | Search works with role filter |
| User detail dialog | Click a user row to edit basic information | Done | `SettingsPage.tsx` | Editable for non-WA: Name, Role, Status, Phone number; Email read-only |
| Audit log shape | Audit rows use Time, Actor and Detail only | Done | `SettingsPage.tsx` | Time includes weekday/date/month/year/hour/minute/second; Action and Entity columns removed |
| Audit filtering | Search audit rows by actor name and time text | Done | `SettingsPage.tsx` | Filters are mockup-local |
| Audit event scope | Record administrative/settings actions only | Done | `SettingsPage.tsx`, `03_Settings_Audit/SRS.md` | Work item and execution changes are excluded |
| Destructive confirmation modal | Require confirm modal before destructive or high-impact actions | Done | `SettingsPage.tsx`, `ProjectsPage.tsx`, `03_Settings_Audit/SRS.md` | Archive/restore project and deactivate/restore team use modal confirmation |
| High-risk typed confirmation | Require typed target name for Delete Project and Remove User Access | Done | `SettingsPage.tsx`, `03_Settings_Audit/SRS.md` | Remove User Access requires typing the user name before the confirm button is enabled |

### P4.3 Acceptance Checklist

- [x] Workspace Settings uses company-level terminology.
- [x] Workspace Settings is scoped to a single company/workspace.
- [x] Workspace Settings is Workspace Admin only.
- [x] Workspace Slug is read-only.
- [x] Company Scope is read-only.
- [x] Workspace Admin is view-only and assigned outside the mockup by internal/dev setup.
- [x] Save Changes is visible only to Workspace Admin.
- [x] SRS records that saving Workspace Settings creates an audit event.
- [x] Top-right gear Settings does not duplicate Project Settings.
- [x] Project Settings entry point is `Manage Projects > Projects`.
- [x] Project Settings reuses Phase 1 Manage > Projects create/edit/archive baseline.
- [x] Team Management moved out of Manage Projects and into top-right Settings gear.
- [x] Workflow Status configuration deferred to Future Backlog.
- [x] Labels management deferred to Future Backlog.
- [x] User Management moved out of Manage Projects and into top-right Settings gear.
- [x] User Management list includes Phone number.
- [x] Workspace Admin account remains in user list but opens read-only detail.
- [x] User Management list removes inline Change Role and Remove buttons.
- [x] User Management search supports name, phone and email.
- [x] Clicking a user opens a detail dialog for Name, Role, Status and Phone number.
- [x] User Management baseline confirmed.
- [x] Audit Log baseline confirmed.
- [x] Destructive confirmation baseline confirmed.

## 7. Phase 4 Mockup Closeout

- [x] P4.1 Notifications mockup and business rules verified.
- [x] P4.2 Roles & Permissions mockup and business rules verified.
- [x] P4.3 Settings & Audit mockup and business rules verified.
- [x] Production build passed on 2026-07-17.
- [x] Full Phase 4 browser smoke test completed with no runtime console errors.
- [x] Workflow Status, Labels and Team Board remain explicitly deferred.
- [x] Portfolio, top-level Release Tracking and Reports remain Phase 5 scope.

Closeout result: `BA/MOCKUP READY`. Unchecked items above are production/API persistence and security-verification work owned by development; they do not block BA/mockup closeout.
