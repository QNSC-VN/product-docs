# SRS - Phase 4.3 Settings & Audit

## 0. Document Control

| Attribute | Value |
|---|---|
| Module ID | `P4-SETTINGS-AUDIT` |
| Status | BA/Mockup Ready |
| Updated date | 2026-08-10 |
| Scope | Workspace settings, Users, Workspaces & Projects, Permission Model, Audit Log and destructive confirmations |
| Priority | P4.3 - required for Governance |
| Depends on | P4.2 Project Access & Permissions |
| Mockup sources | `SettingsPage.tsx`, `WorkspaceProjectsPanel.tsx` |
| Not included | API payloads, persistence design, retention policy, external audit export, Workflow Status and Labels |

## 1. Goal

The top-right Settings gear is the single entry point for personal access information and company administration.

```text
Personal
- Profile & Account
- My Permissions

Administration
- Workspace Settings
- Users
- Workspaces & Projects
- Permission Model
- Audit Log
```

Visibility depends on Workspace authority and the current Project Access Level. This feature defines business and mockup behavior only.

## 2. Feature Task Breakdown

| ID | Task | Output | Status |
|---|---|---|---|
| P4-SET-01 | Workspace Settings | Single-company settings and internal WA display | Done / BA confirmed |
| P4-SET-02 | Workspaces & Projects | One Project/Team/access administration journey | Done / BA confirmed |
| P4-SET-03 | Workflow Status | Project-specific workflow configuration | Deferred |
| P4-SET-04 | Labels | Label management and Work Item tagging | Deferred |
| P4-SET-05 | Users | Company user directory, details, invitation and Project Access | Done / BA confirmed |
| P4-SET-06 | Permission Model | Read-only explanation of fixed access levels | Done / BA confirmed |
| P4-SET-07 | Audit Log | Administrative/settings event list and filters | Done / BA confirmed |
| P4-SET-08 | Destructive Confirmations | Guardrail for remove, archive, deactivate and delete actions | Done / BA confirmed |

## 3. Settings Navigation By Access

| Entry | Workspace Admin | Admin | Editor | No Access |
|---|---:|---:|---:|---:|
| Profile & Account | View/Edit own profile | View/Edit own profile | View/Edit own profile | View/Edit own profile |
| My Permissions | View all effective access | View own assigned Projects | View own assigned Projects/Teams | View own access or no-access state |
| Workspace Settings | View/Edit | Hidden | Hidden | Hidden |
| Users | View/Edit | Hidden | Hidden | Hidden |
| Workspaces & Projects | Full administration | Assigned Projects read-only | Assigned Projects/Teams read-only | Hidden |
| Permission Model | View | View | Hidden | Hidden |
| Audit Log | View | Hidden | Hidden | Hidden |

Admin does not receive Project, Team or user-access administration controls. Only Workspace Admin changes company structure and access.

## 4. Workspace Settings

Workspace Settings represents the fixed company workspace.

### 4.1 Access

- Workspace Admin alone can open and save Workspace Settings.
- Other users do not see the entry.

### 4.2 Fields

| Field | Behavior |
|---|---|
| Workspace Name | Editable by Workspace Admin |
| Workspace Slug | Read-only system identifier |
| Workspace Scope | Read-only; displays single-company scope |
| Workspace Admin | Read-only; assigned by internal/dev setup |

Workspace Admin is labelled consistently with the permission model. There is no Owner selector, Workspace Admin count, Company Status field or Last Saved row in this mockup.

### 4.3 Save

- `Save Changes` is visible only to Workspace Admin.
- A successful save creates an administrative Audit Log event.

## 5. Workspaces & Projects

Project and Team configuration has one location:

```text
Settings gear
-> Workspaces & Projects
```

The old Workspace dropdown `Manage Projects` entry and separate Teams page are removed.

The detailed journey, fields, Project estimation settings, access tabs and synchronization rules are governed by:

- `Phase 1/08_Manage_Projects_Teams_Users/SRS.md`
- `Phase 4/02_Roles_Permissions/SRS.md`

Only Workspace Admin can:

- Create, edit, archive, restore or delete a Project.
- Create, edit, deactivate or restore a Team.
- Add/remove Project users or change Access Level and Team membership.

## 6. Users

Users is the company account directory and is available only to Workspace Admin.

### 6.1 User List

Approved entry:

```text
Settings gear
-> Users
```

List columns:

- `Name`
- `Email`
- `Phone Number`
- `Status`
- `Last Login`

Rules:

- Search matches name, phone number or email.
- Status filter supports All, Active, Invited and Disabled.
- Clicking a row opens User Details.
- Workspace Admin remains in the company list, but its detail is read-only.
- Do not show a single global Project role column because access may differ by Project.

### 6.2 User Details - General

| Field | Normal user | Workspace Admin |
|---|---|---|
| Name | Editable by WA | Read-only |
| Email | Read-only after invitation | Read-only |
| Phone Number | Editable by WA | Read-only |
| Status | Editable by WA | Read-only |

Workspace Admin is assigned internally and cannot be changed, disabled or removed from this mockup.

### 6.3 User Details - Project Access

For a normal user, Workspace Admin can:

- Add more than one Project Access row.
- Select `Admin` or `Editor` independently per Project (No Access is implicit when no Project row exists).
- Assign one or more Teams only when the level is Editor.
- Review all changed Project access before confirming save.

Rules:

- Admin automatically displays All Teams.
- Editor requires at least one Team.
- No Access hides the Project and has no Team membership.
- Removing a Project Access row is equivalent to No Access for that Project.
- The same Project cannot be added twice for one user.
- Saving must update `Workspaces & Projects > Project > Users & Permissions` in the same session.

Workspace Admin detail instead displays `No Project Membership` because its authority is workspace-level.

### 6.4 Invite User

- `Invite User` is Workspace Admin-only.
- Invitation captures basic user information and optional initial Project Access.
- Review Invitation shows Project, Access Level and Team assignment before Send Invite.
- Invitation does not create a Workspace Admin account.

### 6.5 Effective Time

- Project Access and Team membership changes apply to the affected user at next request (stricter than next sign-in).
- Company disable/removal applies at the affected user's next page refresh.

## 7. Permission Model

Permission Model is a read-only business reference.

- It explains Workspace Admin and the four Project Access Levels.
- It describes action outcomes as Allowed, Read-only or Hidden.
- Disabled is a temporary UI state caused by validation, dependency or lifecycle rules, not an assignable permission.
- It does not expose an editable E/R/D/H role matrix.
- Workspace Admin cannot override the fixed capability baseline in this MVP.

The complete capability baseline lives in `Phase 4/02_Roles_Permissions/SRS.md`.

## 8. Workflow Status And Labels

Both areas remain Future Backlog.

- All Projects use the approved default Agile status definitions.
- Phase 4 does not include a workflow designer or Project-specific status CRUD.
- Phase 4 does not include Label CRUD, Work Item Label fields or Label filtering/reporting.

## 9. Audit Log

Audit Log is Workspace Admin-only and read-only.

List columns:

- `Time`
- `Actor`
- `Detail`

Rules:

- Time displays weekday, day, month, year, hour, minute and second.
- Search supports Actor name and Time text.
- Detail is one clear business sentence describing the completed action.
- Separate Action and Entity columns are not shown.

Included events:

- Workspace Settings save.
- User invitation and company status change.
- User basic-information update.
- Project Access Level and Team membership change.
- Project-user removal.
- Project create/edit/archive/restore/delete.
- Team create/edit/deactivate/restore.

Excluded events:

- Work Item, Task, Note, attachment or execution-status activity.
- Those events belong to item Activity/Revision History, not administrative Audit Log.

## 10. Destructive Confirmations

Required pattern:

1. User starts a destructive or high-impact action.
2. System opens a modal naming the target and consequence.
3. User may cancel without changing data.
4. The primary button uses the exact action name.
5. System applies the action only after confirmation.

Actions requiring confirmation include:

- Archive or restore Project.
- Delete Project.
- Deactivate or restore Team.
- Remove user from Project.
- Remove or disable company user access.
- Delivery-item deletes on their owning screens.

High-risk rules:

- Delete Project requires typing the Project key.
- Remove company user access requires typing the user name.
- Remove user from Project requires a clear confirmation but no typed text.
- A blocked action shows the dependency reason and does not allow confirmation.
- Successful administrative actions create Audit Log entries.

## 11. Acceptance Criteria

1. Settings gear is the single Project Management and company administration entry point.
2. Settings navigation changes according to Workspace authority and Project Access.
3. Workspace Settings is WA-only and the Workspace Admin field is read-only.
4. Users list does not imply one global Project role.
5. User Details separates General and Project Access.
6. Workspace Admin User Details is fully read-only and has no Project membership.
7. A normal user can hold different access levels in different Projects.
8. Project access changed in Users is synchronized with Workspaces & Projects.
9. Permission Model is explanatory and read-only.
10. Audit Log contains only administrative/settings events with Time, Actor and Detail.
11. Destructive Project, Team and access actions require the approved confirmation pattern.
12. Workflow Status, Labels and Notification Preferences remain outside active Phase 4 settings.

## 12. Open Questions

No open business question remains for the Phase 4.3 BA/mockup baseline.
