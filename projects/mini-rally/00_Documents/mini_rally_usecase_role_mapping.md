# Mini Rally - Project Access Use Case Matrix

## 1. Purpose

This document is the business-facing authorization map for Mini Rally. It uses the approved 2026-08-10 model and supersedes the former PM/BA/Developer/QA role matrix.

## 2. Authorization Model

- `Workspace Admin` is the only company-level role. It is assigned internally and has company-wide authority.
- Workspace Admin is not a Project member and does not appear in Project user or Team-member candidates.
- Every normal user receives one Access Level independently in each Project: `Admin`, `Editor`, `Viewer` or `No Access`.
- Access in one Project never grants access to another Project.
- Business personas such as PM, BA, Developer or QA do not grant permissions.

## 3. Access Levels

| Level | Scope | Meaning |
|---|---|---|
| Workspace Admin | Company | Manage all users, Projects, Teams, access and delivery data |
| Admin | Assigned Project, All Teams | Manage delivery features; Project/Team/user-access structure remains read-only |
| Editor | Assigned Project and explicit Teams | Manage Backlog Work Items/Tasks, Quality Defects and Iteration Status in assigned Teams |
| Viewer | Assigned Project, all Teams read-only | View Project delivery data; no mutations |
| No Access | None | Project is hidden and direct URLs are denied safely |

## 4. Company And Structure

| Use Case | Workspace Admin | Admin | Editor | Viewer | No Access |
|---|---:|---:|---:|---:|---:|
| Sign in/out and manage own profile | Yes | Yes | Yes | Yes | Yes |
| View accessible Project/Team context | All | Assigned Project / All Teams | Assigned Project / assigned Teams | Assigned Project / all Teams | No |
| Edit Workspace Settings | Yes | No | No | No | No |
| Invite/disable/remove company user | Yes | No | No | No | No |
| Create/edit/archive/restore/delete Project | Yes | No | No | No | No |
| Create/edit/deactivate/restore Team | Yes | No | No | No | No |
| Assign Project Access Level | Yes | No | No | No | No |
| Assign Team membership | Yes | No | No | No | No |
| View Project Details/Teams | Yes | Read-only | Scoped read-only | Read-only | No |
| View Project Users & Permissions | Yes | Read-only | No | No | No |
| View Permission Model | Yes | Own permissions only | Own permissions only | Own permissions only | Own permissions only |
| View Audit Log | Yes | No | No | No | No |

## 5. Delivery Features

| Feature / Action | Workspace Admin | Admin | Editor | Viewer | No Access |
|---|---:|---:|---:|---:|---:|
| Backlog / Work Item / Task - View | All | Project | Assigned Teams | Project read-only | No |
| Backlog / Work Item / Task - Create/Edit/Delete | All | Project | Assigned Teams | No | No |
| Iteration Status - View | All | Project | Assigned Teams | Project read-only | No |
| Iteration Status - Edit | All | Project | Assigned Teams | No | No |
| Timeboxes: Iteration/Release/Milestone - View | All | Project | No | Project read-only | No |
| Timeboxes: Create/Edit/Archive | All | Project | No | No | No |
| Team Status - View | All | Project | No | Project read-only | No |
| Team Status - Edit | All | Project | No | No | No |
| Quality Defects - View | All | Project | Assigned Teams | Project read-only | No |
| Quality Defects - Create/Edit/Delete | All | Project | Assigned Teams | No | No |
| Portfolio Items - View | All | Project | No | Project read-only | No |
| Portfolio Items - Manage | All | Project | No | No | No |
| Capacity Planning - View | All | Project | No | Project read-only | No |
| Capacity Planning - Manage | All | Project | No | No | No |
| Release Tracking / Reports - View | All | Project | No | Project read-only | No |
| Release Tracking controls, where provided | All | Project | No | No | No |

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
- `Viewer` has Project-wide read-only access and no Team membership.

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

- Project Access Level and Team membership changes take effect on the user's next sign-in.
- Company disable/removal takes effect on the user's next page refresh.

## 9. UI Outcomes

| Outcome | Meaning |
|---|---|
| Allowed | Action is available and can be executed |
| Read-only | Data is visible; mutation controls are absent |
| Hidden | Feature, Project or action is not shown |
| Disabled | Temporary validation/dependency/lifecycle state; not an Access Level |
