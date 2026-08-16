# SRS - Phase 4.2 Project Access & Permissions

## 0. Document Control

| Attribute | Value |
|---|---|
| Module ID | `P4-PROJECT-ACCESS` |
| Status | BA/Mockup Ready |
| Updated date | 2026-08-14 |
| Scope | Workspace authority, Project Admin/Editor assignment, Team scope, permission presentation and safe denied states |
| Depends on | Phase 0 identity/context and Phase 1 Project Management |
| Mockup sources | `SettingsPage.tsx`, `WorkspaceProjectsPanel.tsx`, `layout.tsx`, `model.ts` |
| Future Backlog | Viewer access level and selectable No Access permission |
| Not included | API payloads, database schema, policy engine design or custom permission editing |

## 1. Goal

The current permission model has:

1. One company-level authority: `Workspace Admin`.
2. Two Access Levels assigned independently per Project: `Admin` and `Editor`.

`Viewer` and a selectable `No Access` permission are not implemented in the current scope. A normal user without an Admin/Editor assignment has no Project Access row; the Project is hidden and direct access is denied safely.

The former global labels `Project Admin` and `Project Member` are retired. This SRS defines business and mockup behavior only.

## 2. Access Model

### 2.1 Workspace Admin

- Assigned internally.
- Has full company, Project and delivery authority.
- Is not added as a Project user or Team member.
- Does not appear in Project `Users & Permissions` rows or `Add Existing User` candidates.
- Its User Details are fully read-only.
- Alone manages company users, Projects, Teams, Project access and Team membership.

### 2.2 Per-Project Access Levels

| Access level | Scope | Business meaning |
|---|---|---|
| Admin | One assigned Project; automatically `All Teams` | Full delivery administration in that Project; Project/Team/access structure remains read-only |
| Editor | One assigned Project and one or more active Teams | Create, edit and delete team-scoped US/DE/Task and Quality Defects; update Iteration Status |

Rules:

- A user may be Admin in one Project and Editor in another Project.
- Access in one Project never grants access to another Project.
- A new Project has no normal-user assignments until Workspace Admin grants Admin or Editor.
- Admin always resolves to `All Teams`; individual Team selection is not shown.
- Editor requires at least one active Team and may belong to multiple Teams.
- Removing Project access deletes the Project assignment and all Team memberships in that Project.
- An unassigned user cannot see the Project in navigation, selectors, search or results; direct access is denied safely.

## 3. Capability Baseline

### 3.1 Company And Structure Administration

| Screen / action | Workspace Admin | Admin | Editor |
|---|---:|---:|---:|
| Workspace Settings | Edit | Hidden | Hidden |
| Company Users | Edit | Hidden | Hidden |
| Invite, disable or remove company user | Edit | Hidden | Hidden |
| Assign Project access and Team membership | Edit | Read-only view | Hidden |
| Permission Model | View | View | Hidden |
| Audit Log | View | Hidden | Hidden |
| `Workspaces & Projects` | All Projects | Assigned Projects, All Teams, read-only | Assigned Projects/Teams, read-only |
| Create/edit/archive/restore/delete Project | Edit | Hidden | Hidden |
| Create/edit/deactivate/restore Team | Edit | Hidden | Hidden |
| Project `Users & Permissions` | Edit | Read-only | Hidden |

### 3.2 Delivery Features

| Feature | Workspace Admin | Admin | Editor |
|---|---:|---:|---:|
| Backlog and US/DE/Task | Create/View/Edit/Delete | Create/View/Edit/Delete | Create/View/Edit/Delete in assigned Teams |
| Iteration Status | View/Update | View/Update | View/Update in assigned Teams |
| Quality / Defects | Create/View/Edit/Delete | Create/View/Edit/Delete | Create/View/Edit/Delete in assigned Teams |
| Timeboxes / Iterations | Create/View/Edit/Delete | Create/View/Edit/Delete | Hidden |
| Releases and Milestones | Create/View/Edit/Delete | Create/View/Edit/Delete | Hidden |
| Team Status | View/Update | View/Update | Hidden |
| Portfolio Items | Create/View/Edit/Archive | Create/View/Edit/Archive | Hidden |
| Capacity Planning | Create/View/Edit/Publish | Create/View/Edit/Publish | Hidden |
| Release Tracking and Reports | View | View | Hidden |

Archived Projects are read-only for every Access Level until Workspace Admin restores them.

## 4. Permission Evaluation

```text
Workspace authority
+ Project assignment (Admin or Editor)
+ Team scope when Editor
+ Feature/action rule
+ Project/entity lifecycle state
```

| UI state | Meaning |
|---|---|
| Enabled | Action is allowed in the current scope |
| Read-only | Data is visible but mutation controls are unavailable |
| Hidden | No applicable Project assignment or feature permission |
| Disabled | Temporarily unavailable due to validation, lifecycle or dependency state |

Permission Model is a fixed, read-only explanation. Custom E/R/D/H matrix editing is not in scope.

## 5. Access Management Journeys

### 5.1 User-Centric

```text
Settings > Users > User Details > Project Access
-> Add Project
-> Choose Admin or Editor
-> Choose at least one Team when Editor
-> Review Changes
-> Confirm & Save
```

- The same Project cannot appear twice for one user.
- Admin displays `All Teams` automatically.
- Removing the Project row removes the assignment.

### 5.2 Project-Centric

```text
Settings > Workspaces & Projects
-> Select Project
-> Users & Permissions
-> Add Existing User or change Access Level
```

The list columns are exactly `User`, `Status`, `Access Level`, `Action`.

- `Add Existing User` never invites or creates a company user.
- Access Level offers only Admin and Editor.
- Remove requires confirmation, deletes the Project assignment and clears Team memberships.
- Workspace Admin is excluded from rows and candidates.

### 5.3 Team-Creation

- Workspace Admin may select existing users while adding a Team.
- An Admin assignment always receives `All Teams`.
- Editor becomes Project Editor and joins the new Team.
- All access journeys update one shared assignment source.

## 6. Navigation And Demo Behavior

- Mockup switch: `Demo: Switch Access`.
- Workspace Admin demo shows all administration and delivery surfaces.
- Admin demo shows its assigned Project, `All Teams`, delivery administration and read-only Project structure.
- Editor demo shows its assigned Project/Teams, team-scoped delivery editing and read-only Project context.
- Project headers may show contextual `Admin` or `Editor` badges.
- Unassigned Projects never appear in navigation, selectors, search or results.

## 7. Safe Denied States

- Known route without sufficient permission shows Access Denied.
- Missing or inaccessible identifiers may show Not Found to avoid metadata disclosure.
- Denied states do not reveal restricted title, owner, Project, Team or business data.
- Notifications recheck the current Project/Team assignment before displaying or routing to a Work Item.

## 8. Effective Time And Audit

- Project access and Team membership changes take effect on the affected user's next sign-in.
- Company disable/removal takes effect on the affected user's next page refresh.
- Project assignment, Team membership and Project-user removal create administrative Audit events.
- Delivery changes remain in item/activity history.

## 9. Acceptance Criteria

1. Only Workspace Admin is a company-level authority.
2. Normal users receive only Admin or Editor per assigned Project.
3. Admin automatically has All Teams and cannot mutate Project/Team/access structure.
4. Editor requires at least one active Team and is restricted to those Teams.
5. A user with no assignment has no Project Access row; the Project is hidden and direct access is denied.
6. Viewer and selectable No Access are absent from current forms, dropdowns, badges and Permission Model.
7. Workspace Admin is excluded from Project membership and candidate lists.
8. User-centric, Project-centric and Team-creation journeys stay synchronized.
9. Only Workspace Admin manages users, Projects, Teams, Project access and Team membership.
10. Permission Model is read-only and shows only Workspace Admin, Admin and Editor.

## 10. Open Questions

No open business question remains for the current Admin/Editor baseline.
