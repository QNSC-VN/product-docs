# SRS - Phase 4.2 Project Access & Permissions

## 0. Document Control

| Attribute | Value |
|---|---|
| Module ID | `P4-PROJECT-ACCESS` |
| Status | BA/Mockup Ready |
| Updated date | 2026-08-10 |
| Scope | Workspace authority, per-project access, team scope, permission presentation and safe denied states |
| Priority | P4.2 - required for Governance |
| Depends on | Phase 0 identity/context and Phase 1 Project Management |
| Mockup sources | `SettingsPage.tsx`, `WorkspaceProjectsPanel.tsx`, `layout.tsx`, `model.ts` |
| Not included | API payloads, database schema, policy engine design or custom permission editing |

## 1. Goal

Mini Rally uses one company workspace. The permission model therefore has:

1. One company-level authority: `Workspace Admin`.
2. Four access levels assigned independently for each Project: `Admin`, `Editor`, `Viewer`, `No Access`.

The former global labels `Project Admin` and `Project Member` are retired. A normal user may be Admin in Project A, Editor in Project B, Viewer in Project C and have No Access to every other Project.

This SRS defines business and mockup behavior only. Development owns payload, persistence and enforcement implementation.

## 2. Access Model

### 2.1 Workspace Admin

- Workspace Admin is assigned by internal/dev setup.
- Workspace Admin has full company, Project and delivery authority.
- Workspace Admin is not added as a Project user or Team member.
- Workspace Admin does not appear in Project `Users & Permissions` lists or `Add Existing User` candidates.
- Workspace Admin appears in the company Users list, but its User Details are fully read-only.
- Only Workspace Admin can manage company users, Project access and Team membership.

### 2.2 Per-Project Access Levels

| Access level | Scope | Business meaning |
|---|---|---|
| Admin | One assigned Project; automatically `All Teams` | Full delivery administration inside that Project, but no structural Project/Team/user-access administration |
| Editor | One assigned Project and one or more explicitly assigned Teams | Create, edit and delete team-scoped delivery work; update Iteration Status |
| Viewer | One assigned Project; no Team membership | Project-wide read-only access |
| No Access | No visible Project scope | Project is hidden and direct access is rejected safely |

Rules:

- Access levels are independent per Project.
- Access in one Project never grants access to another Project.
- A new Project defaults to `No Access` for every normal user until Workspace Admin grants access.
- Admin always receives `All Teams`; individual Team selection is not shown.
- Editor must be assigned to at least one active Team and may belong to multiple Teams in the same Project.
- Viewer has project-wide read-only access and no Team membership.
- Removing Project access sets the effective level to `No Access` and removes all Team memberships in that Project.

## 3. Capability Baseline

### 3.1 Company And Structure Administration

| Screen / action | Workspace Admin | Admin | Editor | Viewer | No Access |
|---|---:|---:|---:|---:|---:|
| View Workspace Settings | Edit | Hidden | Hidden | Hidden | Hidden |
| View company Users | Edit | Hidden | Hidden | Hidden | Hidden |
| Invite, disable or remove company user | Edit | Hidden | Hidden | Hidden | Hidden |
| Assign Project access and Team membership | Edit | Read-only view only | Hidden | Hidden | Hidden |
| View Permission Model | View | View | Hidden | Hidden | Hidden |
| View Audit Log | View | Hidden | Hidden | Hidden | Hidden |
| View `Workspaces & Projects` | All Projects | Assigned Project, all Teams | Assigned Project and assigned Teams | Assigned Project, all Teams read-only | Hidden |
| Create, edit, archive, restore or delete Project | Edit | Hidden | Hidden | Hidden | Hidden |
| Create, edit, deactivate or restore Team | Edit | Hidden | Hidden | Hidden | Hidden |
| View Project Details and Teams | Edit | Read-only | Read-only, scoped | Read-only | Hidden |
| View Project `Users & Permissions` | Edit | Read-only | Hidden | Hidden | Hidden |

`Admin` is powerful for delivery management, but Workspace Admin alone owns company structure, Project configuration, Team configuration and access assignment.

### 3.2 Delivery Features

| Feature | Workspace Admin | Admin | Editor | Viewer | No Access |
|---|---:|---:|---:|---:|---:|
| Backlog and US/DE/Task | Create, View, Edit, Delete | Create, View, Edit, Delete | Create, View, Edit, Delete in assigned Teams | View | Hidden |
| Iteration Status | View and update | View and update | View and update in assigned Teams | View | Hidden |
| Quality / Defects | Create, View, Edit, Delete | Create, View, Edit, Delete | Create, View, Edit, Delete in assigned Teams | View | Hidden |
| Timeboxes / Iterations | Create, View, Edit, Delete | Create, View, Edit, Delete | Hidden | View | Hidden |
| Releases and Milestones | Create, View, Edit, Delete | Create, View, Edit, Delete | Hidden | View | Hidden |
| Team Status | View and update | View and update | Hidden | View | Hidden |
| Portfolio Items | Create, View, Edit, Archive | Create, View, Edit, Archive | Hidden | View | Hidden |
| Capacity Planning | Create, View, Edit, Publish | Create, View, Edit, Publish | Hidden | View | Hidden |
| Release Tracking and Reports | View | View | Hidden | View | Hidden |

Additional rules:

- Admin actions are limited to the assigned Project even when the same account has a different level elsewhere.
- Editor results, selectors, search and mutations are limited to assigned Teams.
- Viewer never receives create, edit, delete, publish or status-change controls.
- Archived Projects are read-only regardless of access level until Workspace Admin restores them.
- Entity lifecycle and dependency rules still apply after permission checks.

## 4. Permission Evaluation

Effective access is determined by all of these conditions:

```text
Workspace authority
+ Project access level
+ Team scope when level is Editor
+ Feature/action rule
+ Project/entity lifecycle state
```

Permission is therefore action-based and context-based, not assigned once per screen and not represented by a single company-wide role.

UI presentation states:

| State | Meaning |
|---|---|
| Enabled | User may perform the action in the current scope |
| Read-only | Data is visible but mutation controls are not available |
| Hidden | Project, screen or action is not shown because the user has no applicable access |
| Disabled | Control is visible but temporarily unavailable because of validation, lifecycle or dependency state; this is not an assignable access level |

The Permission Model screen is a read-only explanation of the fixed baseline. Workspace Admin does not customize a role/action matrix in this MVP.

## 5. Access Management Journeys

### 5.1 User-Centric Journey

```text
Settings gear
-> Users
-> Select user
-> Project Access
-> Add or select Project
-> Choose Admin / Editor / Viewer / No Access
-> Choose Teams only when level is Editor
-> Review Changes
-> Confirm & Save
```

Rules:

- One user may have many Project Access rows.
- The same Project cannot appear twice for one user.
- Admin displays `All Teams` automatically.
- Editor requires at least one Team.
- Viewer and No Access do not show Team selection.
- Workspace Admin User Details displays workspace authority only and cannot be edited.

### 5.2 Project-Centric Journey

```text
Settings gear
-> Workspaces & Projects
-> Select Project
-> Users & Permissions
-> Add Existing User or change Access Level
```

The Project user list has exactly:

- `User`
- `Status`
- `Access Level`
- `Action`

Rules:

- `Add Existing User` selects an existing company user; it does not send an invitation.
- Access Level remains a dropdown for Workspace Admin.
- Selecting Editor opens Team selection.
- Selecting Admin automatically grants `All Teams`.
- `Remove` removes the user from the Project, changes access to No Access and removes Project Team memberships.
- `Remove` always opens a confirmation modal before applying.
- Workspace Admin is excluded from this list and candidate selector.

### 5.3 Team-Creation Journey

When Workspace Admin adds a Team inside a Project:

- The form may select existing company users.
- Each selected user is assigned either Admin or Editor access for that Project.
- Admin becomes `All Teams` for the Project.
- Editor becomes a member of the new Team.
- Viewer and No Access are not Team-member choices.

All three journeys update the same Project access and Team membership source. A change made in one journey must appear in the other two without creating a duplicate assignment.

## 6. Navigation And Demo Behavior

- The mockup switch is labelled `Demo: Switch Access`.
- Workspace Admin demo shows all administration and delivery surfaces.
- Admin demo shows only its assigned Project, `All Teams`, delivery administration and read-only Project structure.
- Editor demo shows only its assigned Project and Teams, delivery-editing surfaces and read-only `Workspaces & Projects` context.
- A contextual `Admin`, `Editor` or `Viewer` badge may appear in the selected Project header to explain the user's current Project access.
- A global role badge must not imply that a normal user has the same access in every Project.
- No Access Projects must not appear in navigation, selectors, search or results.

## 7. Safe Denied States

- A known route without sufficient action permission shows Access Denied.
- A missing item, inaccessible Project or guessed identifier may show Not Found to avoid metadata disclosure.
- Denied states must not show restricted title, owner, Project, Team or other business data.
- Notifications must apply the current Project/Team access before displaying or routing to a Work Item.

## 8. Effective Time And Audit

- Project access and Team membership changes take effect for the affected user at the next sign-in.
- Company disable/removal takes effect at the affected user's next page refresh.
- Successful company/settings actions create an Audit Log entry with Time, Actor and Detail.
- Project access level changes, Team membership changes and Project-user removal are administrative audit events.
- Delivery work changes remain in item/activity history, not the Phase 4 administrative Audit Log.

## 9. Feature Task Breakdown

| ID | Task | Output | Status |
|---|---|---|---|
| P4-RBAC-01 | Define authority model | Workspace Admin plus per-Project access levels | Done / BA confirmed |
| P4-RBAC-02 | Define capability baseline | Company/structure and delivery feature matrix | Done / BA confirmed |
| P4-RBAC-03 | Define access journeys | User, Project and Team entry points with shared state | Done / BA confirmed |
| P4-RBAC-04 | Define scope and denied behavior | All Teams, Editor Team scope, Viewer and No Access behavior | Done / BA confirmed |
| P4-RBAC-05 | Define demo behavior | Workspace Admin, Admin and Editor views | Done / BA confirmed |
| P4-RBAC-06 | Align SRS and tests | Cross-phase documents and test pack use the same model | Done / BA confirmed |

## 10. Acceptance Criteria

1. Only Workspace Admin is a company-level authority.
2. Normal users have independent Admin, Editor, Viewer or No Access values per Project.
3. Admin in one Project has No Access elsewhere until Workspace Admin grants another level.
4. Admin automatically uses All Teams and cannot maintain Projects, Teams or access assignments.
5. Editor is limited to explicitly assigned Teams and approved delivery features.
6. Viewer is project-wide read-only and has no Team membership.
7. No Access Projects are hidden and direct access is rejected safely.
8. Workspace Admin is not a Project member and is excluded from Project user lists.
9. User-centric, Project-centric and Team-creation journeys update one shared access source.
10. Only Workspace Admin can invite/disable users, CRUD Projects/Teams and manage Project access or Team membership.
11. Permission Model is read-only and no editable E/R/D/H role matrix remains.
12. Access timing and administrative Audit Log rules are visible in SRS and test coverage.

## 11. Open Questions

No open business question remains for the Phase 4.2 BA/mockup baseline.
