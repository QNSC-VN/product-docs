# Mini Rally - Project Access Use Case Matrix

> **Correction 2026-08-13 (BA-confirmed):** the Access Model is **3-level — Workspace Admin, Admin, Editor.** The `Viewer` and `No Access` levels are **removed**. "No Access" remains the implicit state of a user who has no `project_members` row for a Project (the Project is hidden and direct URLs are denied). This revises the earlier 4-level wording; all matrices below are updated to the three levels.

## 1. Purpose

This document is the business-facing authorization map for Mini Rally. It uses the approved 2026-08-10 model (corrected to 3-level on 2026-08-13) and supersedes the former PM/BA/Developer/QA role matrix.

## 2. Authorization Model

- `Workspace Admin` is the only company-level role. It is assigned internally and has company-wide authority.
- Workspace Admin is not a Project member and does not appear in Project user or Team-member candidates.
- Every normal user receives one Access Level independently in each Project: `Admin` or `Editor`. A user with no Project row has implicit **No Access** (the Project is hidden).
- Access in one Project never grants access to another Project.
- Business personas such as PM, BA, Developer or QA do not grant permissions.

## 3. Access Levels

| Level | Scope | Meaning |
|---|---|---|
| Workspace Admin | Company | Manage all users, Projects, Teams, access and delivery data |
| Admin | Assigned Project, All Teams | Manage delivery features; Project/Team/user-access structure remains read-only |
| Editor | Assigned Project and explicit Teams | Manage Backlog Work Items/Tasks, Quality Defects and Iteration Status in assigned Teams |
| (No Access) | None | Implicit — no `project_members` row. Project is hidden and direct URLs are denied safely |

## 4. Company And Structure

| Use Case | Workspace Admin | Admin | Editor |
|---|---:|---:|---:|
| Sign in/out and manage own profile | Yes | Yes | Yes |
| View accessible Project/Team context | All | Assigned Project / All Teams | Assigned Project / assigned Teams |
| Edit Workspace Settings | Yes | No | No |
| Invite/disable/remove company user | Yes | No | No |
| Create/edit/archive/restore/delete Project | Yes | No | No |
| Create/edit/deactivate/restore Team | Yes | No | No |
| Assign Project Access Level | Yes | No | No |
| Assign Team membership | Yes | No | No |
| View Project Details/Teams | Yes | Read-only | Scoped read-only |
| View Project Users & Permissions | Yes | Read-only | No |
| View Permission Model | Yes | Own permissions only | Own permissions only |
| View Audit Log | Yes | No | No |

## 5. Delivery Features

| Feature / Action | Workspace Admin | Admin | Editor |
|---|---:|---:|---:|
| Backlog / Work Item / Task - View | All | Project | Assigned Teams |
| Backlog / Work Item / Task - Create/Edit/Delete | All | Project | Assigned Teams |
| Iteration Status - View | All | Project | Assigned Teams |
| Iteration Status - Edit | All | Project | Assigned Teams |
| Timeboxes: Iteration/Release/Milestone - View | All | Project | No |
| Timeboxes: Create/Edit/Archive | All | Project | No |
| Team Status - View | All | Project | Assigned Teams |
| Team Status - Edit | All | Project | No |
| Quality Defects - View | All | Project | Assigned Teams |
| Quality Defects - Create/Edit/Delete | All | Project | Assigned Teams |
| Portfolio Items - View | All | Project | No |
| Portfolio Items - Manage | All | Project | No |
| Capacity Planning - View | All | Project | No |
| Capacity Planning - Manage | All | Project | No |
| Release Tracking / Reports - View | All | Project | No |
| Release Tracking controls, where provided | All | Project | No |

## 6. Notifications

- A user receives a notification when a US/DE is assigned to that user.
- A user receives a notification when mentioned in the Notes of a US/DE.
- Clicking the notification opens the related Work Item.
- Current Project access is checked again before showing target data.
- If access was removed, no restricted Project or Work Item metadata is leaked.

## 7. Access Management Journeys

### User-centric

`Settings > Users > User Details > Project Access`

- One user can join many Projects.
- Each Project row has its own Access Level.
- `Admin` automatically shows `All Teams`.
- `Editor` requires one or more explicit Teams.

### Project-centric

`Settings > Workspaces & Projects > Project > Users & Permissions`

- List columns: User, Status, Access Level, Action.
- Workspace Admin can add an existing company user, change Access Level or remove the user from the Project.
- Remove requires confirmation.

### Team creation/edit

- Workspace Admin can select existing users while creating/editing a Team.
- Selecting `Admin` grants Project Admin access and therefore All Teams.
- Selecting `Editor` grants Project Editor access and membership in that Team.
- All three journeys update the same Project access and Team membership data.

## 8. Effective Time

- Project Access Level and Team membership changes take effect on the user's next request (shipped behavior — stricter than next sign-in).
- Company disable/removal takes effect on the user's next page refresh.

## 9. UI Outcomes

| Outcome | Meaning |
|---|---|
| Allowed | Action is available and can be executed |
| Read-only | Data is visible; mutation controls are absent |
| Hidden | Feature, Project or action is not shown |
| Disabled | Temporary validation/dependency/lifecycle state; not an Access Level |
