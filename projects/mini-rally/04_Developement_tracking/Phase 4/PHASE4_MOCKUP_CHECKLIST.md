# Phase 4 - Mockup Coverage Checklist

Synced date: 2026-08-10

## 1. Phase Scope

Phase 4 contains three confirmed features:

1. P4.1 Notifications.
2. P4.2 Project Access & Permissions.
3. P4.3 Settings & Audit.

This checklist verifies BA/mockup behavior. API, persistence and production security remain development-owned.

## 2. P4.1 Notifications

Approved behavior:

- Bell opens Notification Center.
- Filters are `All`, `Unread`, `Assigned` and `Mentions` only.
- US/DE assignment notifies the assigned user.
- Mentioning a user in a US/DE Note notifies that user and may show an in-app popup.
- Generic Notes, status changes, attachments, sprint updates and due dates do not create Phase 4 notifications.
- Clicking a notification or `Go to item` opens the related US/DE.
- Access is checked before target data is displayed.

### Mockup Checklist

- [x] Bell opens Notification Center.
- [x] Unread count and Mark all as read are present.
- [x] Only four approved filters are visible.
- [x] Assignment and mention examples are present.
- [x] Popup example is present.
- [x] Card and Go to item route to Work Item Detail.
- [x] Read/unread local mock state works.
- [ ] DEV persists notification/read state.
- [ ] DEV verifies recipient isolation and inaccessible targets.

## 3. P4.2 Project Access & Permissions

Approved model:

- `Workspace Admin` is the only company-level authority.
- Workspace Admin is assigned internally, is not a Project member and is excluded from Project user lists.
- Normal users receive `Admin` or `Editor` independently per Project; absence of a Project row means implicit No Access. (Access model is now 3-level: Workspace Admin / Admin / Editor; the former Viewer level is removed.)
- Only Workspace Admin manages users, Projects, Teams, Project access and Team membership.
- Permission Model is read-only; there is no editable E/R/D/H role matrix.

### Access Level Checklist

- [x] Admin is Project-scoped and automatically uses All Teams.
- [x] Admin has full delivery management in assigned Projects.
- [x] Admin sees Workspaces & Projects, Teams and Users & Permissions read-only.
- [x] Admin cannot Create/Edit/Archive/Delete Project.
- [x] Admin cannot Add/Edit/Deactivate/Restore Team.
- [x] Admin cannot assign or remove Project users.
- [x] Editor sees only assigned Projects and Teams.
- [x] Editor can Create/Edit/Delete US/DE/Task and Quality Defects in assigned Teams.
- [x] Editor can update Iteration Status in assigned Teams.
- [x] Editor cannot access Timeboxes, Releases, Milestones, Portfolio, Capacity or Reports.
- [x] Editor views Team Status read-only for assigned Teams (view-only; cannot edit capacity or task fields).
- [x] Editor does not see Project Users & Permissions.
- [x] No Access Project is hidden and direct access is rejected safely.

### Access Journey Checklist

- [x] `Users > User Details > Project Access` supports multiple Projects per user.
- [x] Project Access uses Admin/Editor (3-level model; No Access is implicit).
- [x] Admin automatically displays All Teams.
- [x] Editor requires one or more Team selections.
- [x] Team selection appears only for Editor.
- [x] `Workspaces & Projects > Project > Users & Permissions` uses User, Status, Access Level and Action.
- [x] Access Level remains a dropdown for Workspace Admin.
- [x] Add Existing User selects a company user and initial access.
- [x] Remove Project user opens confirmation.
- [x] Add Team can select existing users and assign Admin or Editor.
- [x] User, Project and Team journeys share session-level access state.
- [x] Workspace Admin is excluded from Project access and Team-member candidates.

### Demo Checklist

- [x] Top user menu is labelled `Demo: Switch Access`.
- [x] Workspace Admin demo shows all Projects, administration and delivery features.
- [x] Admin demo shows assigned Project, All Teams and read-only structure.
- [x] Editor demo shows assigned Project/Teams and contextual access.
- [x] Non-WA Project header shows contextual access badge.
- [x] No global badge claims one normal-user role across all Projects.
- [ ] DEV enforces the same scopes in API/service and not only in UI.
- [ ] DEV verifies next-request access timing.

## 4. P4.3 Settings & Audit

### Settings Navigation

- [x] Top-right gear is the single Settings entry.
- [x] Personal contains Profile & Account and My Permissions.
- [x] Administration contains Workspace Settings, Users, Workspaces & Projects, Permission Model and Audit Log according to access.
- [x] Old workspace-dropdown Manage Projects entry is removed.
- [x] Separate Teams administration page is removed.

### Workspace Settings

- [x] Workspace Name is editable by Workspace Admin.
- [x] Workspace Slug and Workspace Scope are read-only.
- [x] Workspace Admin is read-only and assigned internally.
- [x] Owner selector, WA count, Company Status and Last Saved rows are absent.
- [x] Save Changes is Workspace Admin-only.

### Users

- [x] Users is Workspace Admin-only.
- [x] List uses Name, Email, Phone Number, Status and Last Login.
- [x] Search supports name, phone and email.
- [x] Status filter supports All, Active, Invited and Disabled.
- [x] User Details separates General and Project Access.
- [x] Normal user General fields support Name, Phone and Status; Email is read-only after invite.
- [x] Workspace Admin User Details is fully read-only.
- [x] User invitation can include initial Project Access.
- [x] Review step summarizes Project access before save/send.

### Workspaces & Projects

- [x] One Workspace -> Project -> Team tree is present.
- [x] Project Details includes fixed XS/S/M/L/XL labels with editable point values for WA.
- [x] Hours per point is Project-specific and WA-editable.
- [x] WA-only Project and Team actions are present.
- [x] Admin/Editor read-only presentation is demonstrated.
- [x] Project-user access changes are synchronized with User Details.

### Permission Model

- [x] Permission Model explains fixed access levels.
- [x] Action outcomes use Allowed, Read-only and Hidden.
- [x] Disabled is explained as a temporary UI state, not an access level.
- [x] Editable role/action matrix is removed from the approved business baseline.

### Audit And Confirmation

- [x] Audit Log is Workspace Admin-only and read-only.
- [x] Audit columns are Time, Actor and Detail only.
- [x] Time includes weekday, date, month, year, hour, minute and second.
- [x] Search supports Actor and Time text.
- [x] Audit includes administrative/settings actions only.
- [x] Remove Project user opens confirmation.
- [x] Archive/restore Project and deactivate/restore Team open confirmation.
- [x] Delete Project requires typed Project key.
- [x] Remove company user access requires typed user name.
- [ ] DEV persists audit entries and enforces dependency blockers.

## 5. Deferred Items

- [x] Notification Preferences remains Future Backlog.
- [x] Configurable Workflow Status remains Future Backlog.
- [x] Labels remain Future Backlog.
- [x] Team Board and Iteration Board remain Future Backlog.

## 6. Phase 4 Closeout

- [x] P4.1 BA rules and mockup confirmed.
- [x] P4.2 BA rules and mockup confirmed.
- [x] P4.3 BA rules and mockup confirmed.
- [x] Permission terminology is aligned across Phase 1 and Phase 4 SRS documents.
- [x] Test scenarios and traceability are aligned to the new Project Access model.

Closeout result: `BA/MOCKUP READY`. Unchecked items are production implementation and runtime security verification; they do not change the approved business baseline.
