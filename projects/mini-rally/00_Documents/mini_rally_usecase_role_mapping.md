# Mini Rally - Project Access Use Case Matrix

## 1. Purpose

This document is the business-facing authorization map for Mini Rally. It uses the approved 2026-08-14 model and supersedes the former PM/BA/Developer/QA and Viewer/No Access matrices.

## 2. Authorization Model

- `Workspace Admin` is the only company-level role. It is assigned internally and has company-wide authority.
- Workspace Admin is not a Project member and does not appear in Project user or Team-member candidates.
- Every normal user receives one Access Level independently in each Project: `Admin` or `Editor`.
- A user without a Project assignment does not see that Project and direct access is denied safely. This is not a selectable Access Level.
- Access in one Project never grants access to another Project.
- Business personas such as PM, BA, Developer or QA do not grant permissions.

## 3. Access Levels

| Level | Scope | Meaning |
|---|---|---|
| Workspace Admin | Company | Manage all users, Projects, Teams, access and delivery data |
| Admin | Assigned Project, All Teams | Manage delivery features; Project/Team/user-access structure remains read-only |
| Editor | Assigned Project and explicit Teams | Manage Backlog Work Items/Tasks, Quality Defects and Iteration Status in assigned Teams |
| Unassigned user | None | No Project assignment; Project is hidden and direct URLs are denied safely |

## 4. Company And Structure

| Use Case | Workspace Admin | Admin | Editor | Unassigned user |
|---|---:|---:|---:|---:|
| Sign in/out and manage own profile | Yes | Yes | Yes | Yes |
| View accessible Project/Team context | All | Assigned Project / All Teams | Assigned Project / assigned Teams | No |
| Edit Workspace Settings | Yes | No | No | No |
| Invite/disable/remove company user | Yes | No | No | No |
| Create/edit/archive/restore/delete Project | Yes | No | No | No |
| Create/edit/deactivate/restore Team | Yes | No | No | No |
| Assign Project Access Level | Yes | No | No | No |
| Assign Team membership | Yes | No | No | No |
| View Project Details/Teams | Yes | Read-only | Scoped read-only | No |
| View Project Users & Permissions | Yes | Read-only | No | No |
| View Permission Model | Yes | Own permissions only | Own permissions only | Own permissions only |
| View Audit Log | Yes | No | No | No |

## 5. Delivery Features

| Feature / Action | Workspace Admin | Admin | Editor | Unassigned user |
|---|---:|---:|---:|---:|
| Backlog / Work Item / Task - View | All | Project | Assigned Teams | No |
| Backlog / Work Item / Task - Create/Edit/Delete | All | Project | Assigned Teams | No |
| Iteration Status - View/Edit | All | Project | Assigned Teams | No |
| Timeboxes: Iteration/Release/Milestone - View/Manage | All | Project | No | No |
| Team Status - View/Edit | All | Project | No | No |
| Quality Defects - View/Create/Edit/Delete | All | Project | Assigned Teams | No |
| Portfolio Items - View/Manage | All | Project | No | No |
| Capacity Planning - View/Manage | All | Project | No | No |
| Release Tracking / Reports | All | Project | No | No |

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
- Removing a row removes the Project assignment and all Team scope for that Project.

### Project-centric

`Settings > Workspaces & Projects > Project > Users & Permissions`

- List columns: User, Status, Access Level, Action.
- Workspace Admin can add an existing company user, change Access Level or remove the user from the Project.
- Remove requires confirmation.

### Team creation/edit

- Workspace Admin can select existing users while creating/editing a Team.
- Selecting `Admin` grants Admin access and therefore All Teams.
- Selecting `Editor` grants Project Editor access and membership in that Team.
- All three journeys update the same Project access and Team membership state.

## 8. Future Backlog

- `Viewer` Project-wide read-only access.
- A selectable `No Access` value. Current behavior removes the assignment instead.

## 9. Effective Time

- Project Access Level and Team membership changes take effect on the user's next sign-in.
- Company disable/removal takes effect on the user's next page refresh.

## 10. UI Outcomes

| Outcome | Meaning |
|---|---|
| Allowed | Action is available and can be executed |
| Read-only | Data is visible; mutation controls are absent |
| Hidden | Feature, Project or action is not shown |
| Disabled | Temporary validation/dependency/lifecycle state; not an Access Level |
