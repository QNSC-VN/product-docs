# SRS - Phase 1.8 Project Management

## 0. Document Control

| Attribute | Value |
|---|---|
| Module ID | `P1-PROJECT-MANAGEMENT` |
| Status | BA/Mockup Ready |
| Updated date | 2026-08-14 |
| Scope | Project, Project Team and Project-user administration under the top-right Settings gear |
| Priority | P1 - required |
| Depends on | Phase 0 App Shell, company Users and Phase 4 Project Access |
| Mockup source | `03_Mockup Design/src/app/pages/WorkspaceProjectsPanel.tsx` |
| Permission source | `Phase 4/02_Roles_Permissions/SRS.md` |
| Replaces | Old standalone Manage Projects and separate Team administration journeys |

## 1. Goal

Project Management provides one structural administration journey:

```text
Company Workspace
-> Project
   -> Details
   -> Users & Permissions
   -> Teams
```

The screen consolidates Project CRUD, Project Teams and Project-user access under `Settings gear > Workspaces & Projects`.

This SRS defines business flow and mockup behavior. API payloads and database implementation remain development-owned. Effective permissions come from the Phase 4 Project Access SRS.

## 2. Scope Boundary

### 2.1 Included

- Open Project Management from the top-right Settings gear.
- View the company Workspace, Projects and Teams in one tree according to effective access.
- Create, view, edit, archive, restore and delete Projects as Workspace Admin.
- Configure Project Details, Preliminary Estimate values and point-to-hour conversion.
- Add existing company users to a Project and set per-Project Access Level.
- Create, view, edit, deactivate and restore Teams as Workspace Admin.
- Add users and Access Levels while creating a Team.
- Keep User, Project and Team access journeys synchronized.
- Confirm destructive or high-impact Project, Team and Project-user actions.

### 2.2 Not Included

- Company-user invitation, disable or removal. These remain in `Settings > Users`.
- Editable custom role/permission matrices.
- API request/response design and database mapping.
- Capacity Planning and Report calculations. This module stores only the Project estimation configuration they consume.
- Configurable Workflow Status and Labels. These remain Future Backlog.

## 3. Navigation And Access-Aware Journey

### 3.1 Entry Point

```text
Top navigation
-> Click Settings gear
-> Select Workspaces & Projects
```

The old `Workspace dropdown > Manage Projects` entry is removed. Project Management has one entry point.

### 3.2 Screen Layout

| Area | Behavior |
|---|---|
| Left tree | Displays only Projects and Teams accessible to the current user |
| Workspace node | Workspace Admin opens the Project overview |
| Project node | Opens the selected Project and allowed tabs |
| Team node | Opens Team Details for the selected Team |
| Main content | Changes according to selected Workspace, Project or Team |

Access-aware navigation:

- Workspace Admin sees every Project and Team and all structural actions.
- Admin sees only assigned Projects and automatically sees `All Teams`; Project structure is read-only.
- Editor sees only assigned Projects and explicitly assigned Teams; Project structure is read-only.
- Users without an Admin/Editor assignment do not see the Project or its Teams.
- Selecting another Project resets the main content to `Details`.
- A non-WA Project header shows contextual `Admin` or `Editor` access so the user understands the current Project scope.
- No global Project role badge is shown in the top navigation because access can differ by Project.

## 4. Workspace Project Overview

The Workspace overview is the Workspace Admin's company-level Project list.

### 4.1 List Columns

| Column | Rule |
|---|---|
| Key | Unique Project key |
| Project | Project name and description |
| Status | `Active` or `Archived` |
| Owner | Business owner of the Project |
| Teams | Number of Teams inside the Project |

The list does not show Access, Members, Start Date, Updated or row-level Actions columns. Clicking a row opens the Project.

### 4.2 Create Project

Only Workspace Admin sees `Create Project`.

| Field | Required | Rule |
|---|---:|---|
| Project name | Yes | Trimmed non-empty name |
| Project key | Yes | 1-10 uppercase letters/numbers after normalization; capped at 10 and immutable after creation |
| Description | No | Short Project description |
| Project owner | No | Business owner selected from existing company users |
| Start date | No | Project start date |
| Preliminary Estimate | Yes | Fixed T-shirt labels mapped to positive point values |
| Hours per point | Yes | Positive value used by Capacity Planning and Reports |

After save, the new Project is added to the tree and list and becomes selected. Normal users have no assignment until Workspace Admin grants Admin or Editor access.

## 5. Project Header And Tabs

The Project header shows:

- Project name.
- Project key.
- Project status.
- Team count.
- Contextual Access Level for Admin or Editor.
- Workspace Admin-only Project action icons.

Tabs by access:

| Access | Details | Users & Permissions | Teams |
|---|---:|---:|---:|
| Workspace Admin | Edit | Edit | Edit |
| Admin | Read-only | Read-only | Read-only |
| Editor | Read-only | Hidden | Read-only, assigned Teams only |
| Unassigned user | Hidden | Hidden | Hidden |

## 6. Project Details

### 6.1 Display Fields

| Field | Display behavior |
|---|---|
| Project name | Saved Project name |
| Project key | Immutable key |
| Status | `Active` or `Archived` |
| Start date | Saved Project start date |
| Project owner | Business ownership information; not an access assignment |
| Description | Saved Project description |

### 6.2 Estimation Settings

Estimation Settings are configured independently for each Project.

The mockup uses sample data:

```text
XS = 1 pt
S = 2 pts
M = 3 pts
L = 5 pts
XL = 8 pts
1 point = 8 hours
```

Rules:

- Labels `XS`, `S`, `M`, `L` and `XL` are fixed and cannot be added, removed or renamed.
- Each point value must be greater than zero and is editable only by Workspace Admin.
- `Hours per point` must be greater than zero and is editable only by Workspace Admin.
- Sample values are mock data, not product-mandated defaults.
- Read view displays labels vertically in the format `XS = 1 pt`.
- Point-to-hour conversion is consumed only by Capacity Planning and Reports.
- Saving configuration does not populate or change Task Estimate hours.

### 6.3 Edit Project

Only Workspace Admin can edit a Project.

- Project key remains disabled and immutable.
- Project name, description, owner, start date and Estimation Settings can change.
- Invalid values prevent save and show validation.
- Save updates the Project Details read view.

## 7. Users & Permissions

This tab associates existing company users with the selected Project. It never creates or invites a company account.

### 7.1 Visibility And Toolbar

- Workspace Admin can search, add, change and remove Project users.
- Admin can view the tab and current assignments but cannot mutate them.
- Editor does not see the tab.

| Control | Behavior |
|---|---|
| Search | Filters by user name or email |
| User count | Shows current Project users in the result |
| Add Existing User | WA-only selector of eligible company users not already in the Project |

Workspace Admin is excluded from the Project list and candidate selector. Disabled company users cannot be newly added.

### 7.2 List Columns

| Column | Behavior |
|---|---|
| User | Name, avatar and email |
| Status | Company account status |
| Access Level | `Admin` or `Editor`; dropdown for Workspace Admin and read-only for Admin |
| Action | `Remove` for Workspace Admin; dash for read-only users |

Rules:

- Admin automatically displays `All Teams`.
- Changing a user to Editor opens Team selection and requires at least one active Team.
- `Remove` opens a confirmation modal, deletes the Project assignment and removes Team memberships in that Project.
- Project access changes take effect for the affected user on next sign-in.

### 7.3 Add Existing User

```text
Select existing company user
-> Select Admin / Editor
-> Select Teams when Editor
-> Add User
```

The same assignment must appear in `Settings > Users > User Details > Project Access`.

## 8. Teams

Teams belong to exactly one parent Project in this MVP.

### 8.1 Team List

| Column | Rule |
|---|---|
| Key | Team key |
| Team | Team name |
| Lead | Current Team lead |
| Status | `Active` or `Deactive` |
| Members | Number of Team members |
| Actions | Workspace Admin-only Edit, Deactivate or Restore |

Admin and Editor receive read-only Team presentation in their assigned scope. Only Workspace Admin can add, edit, deactivate or restore a Team.

### 8.2 Add/Edit Team Fields

| Field | Required | Rule |
|---|---:|---|
| Team name | Yes | Trimmed non-empty name |
| Team key | Yes | 2-10 uppercase letters/numbers; immutable after creation |
| Team lead | No | Selected from eligible existing company users |
| Status | Yes for edit | `Active` or `Deactive` |
| Members & Access | No | Select existing users and set Admin or Editor |

Member and access rules:

- Admin sets Project Access Level to Admin and automatically uses All Teams.
- Editor grants Project Editor access and adds the user to the new Team.
- Existing higher access is not reduced by adding a Team.
- Disabled users and Workspace Admin are not selectable as Team members.
- Newly created Team and assignments appear in both User Project Access and Project Users & Permissions.

### 8.3 Team Details

Selecting a Team shows:

- Team key.
- Status.
- Team lead.
- Member count.
- Member name and email list.

## 9. Project And Team Lifecycle

| Action | Authority | Mockup behavior |
|---|---|---|
| Create Project | Workspace Admin | Opens Project form and adds the saved Project |
| Edit Project | Workspace Admin | Opens current Project fields and estimation settings |
| Archive Project | Workspace Admin | Confirmation; Project becomes read-only and leaves active selectors |
| Restore Project | Workspace Admin | Returns Archived Project to Active |
| Delete Project | Workspace Admin | Typed Project-key confirmation, then removes Project from administration tree |
| Add/Edit Team | Workspace Admin | Maintains Team and optional member access |
| Deactivate/Restore Team | Workspace Admin | Confirmation; history remains available |

Archived Project and deactivated Team history must be preserved. Dependency rules may block an action and must explain the blocker before confirmation.

## 10. Shared-State Synchronization

Three administration journeys use one source of truth:

1. `Users > User Details > Project Access`.
2. `Workspaces & Projects > Project > Users & Permissions`.
3. `Workspaces & Projects > Project > Teams > Add/Edit Team`.

Required behavior:

- Adding Project access from User Details adds the user to the Project list.
- Adding an existing user from Project Users & Permissions adds a Project Access row in User Details.
- Creating a Team with an Editor adds that Team to the Editor's Project Access.
- Admin always resolves to All Teams in every journey.
- Removing Project access clears that Project's Team memberships everywhere.
- The mockup demonstrates shared session state; refresh/API persistence remains development-owned.

## 11. Changes From Previous Mockup

| Area | Previous mockup | Current approved mockup |
|---|---|---|
| Entry point | Workspace dropdown > Manage Projects | Settings gear > Workspaces & Projects |
| Structure | Separate Project, Team and User administration | Workspace -> Project -> Team tree |
| Access model | One global Project role | Admin/Editor independently per Project; no assignment means hidden/denied |
| Header badge | Global-looking role badge or no access context | Contextual per-Project badge for non-WA users |
| Project user columns | Disabled, Permission, Team Member | User, Status, Access Level, Action |
| Access editing | Unclear or separate | Access Level dropdown plus Editor Team selection |
| WA in Project users | Included as Admin | Excluded; WA has workspace authority and no Project membership |
| Team management | Separate workspace Teams page | Teams managed inside selected Project by WA only |
| Add Team | Team fields only | Team fields plus existing user and Admin/Editor assignment |
| Estimation | No Project estimation setup | Fixed T-shirt labels with editable points and Hours per point |

## 12. Functional Requirements

| ID | Requirement |
|---|---|
| PM-FR-001 | Settings gear opens `Workspaces & Projects`. |
| PM-FR-002 | Tree and selectors expose only accessible Projects and Teams. |
| PM-FR-003 | Workspace Admin alone can Create/Edit/Archive/Restore/Delete Projects. |
| PM-FR-004 | Workspace Admin alone can Add/Edit/Deactivate/Restore Teams. |
| PM-FR-005 | Project opens on Details and shows a contextual access badge for non-WA users. |
| PM-FR-006 | Project Details displays general and project-specific Estimation Settings. |
| PM-FR-007 | Preliminary labels are fixed; only positive point values are editable. |
| PM-FR-008 | Point-to-hour conversion is used only by Capacity Planning and Reports. |
| PM-FR-009 | Users & Permissions uses User, Status, Access Level and Action columns. |
| PM-FR-010 | Add Existing User never invites or creates a company user. |
| PM-FR-011 | Admin resolves to All Teams; Editor requires at least one active Team. |
| PM-FR-012 | Workspace Admin is excluded from Project membership and candidate lists. |
| PM-FR-013 | Admin views Project structure and Users & Permissions read-only. |
| PM-FR-014 | Editor sees only assigned Projects/Teams and no Users & Permissions tab. |
| PM-FR-015 | Remove Project user and destructive structure actions require confirmation. |
| PM-FR-016 | User, Project and Team access journeys remain synchronized. |

## 13. Acceptance Criteria

1. Project Management has one entry point under the Settings gear.
2. Workspace Admin sees all Projects/Teams and all structural actions.
3. Admin sees only assigned Projects with All Teams and cannot mutate Project/Team/access structure.
4. Editor sees only assigned Projects/Teams and cannot view Users & Permissions.
5. A user without Admin/Editor assignment does not see or access the Project.
6. Workspace Admin is not listed as a Project user.
7. Project access can be added or changed from User Details and Project Users & Permissions.
8. Add Team can assign existing users as Admin or Editor.
9. Changes from every access journey appear in the other journeys in the same session.
10. Confirmation is required before removing a Project user or applying a destructive structure action.
11. Project-specific estimation settings are saved and displayed consistently.

## 14. Open Questions

No open business question remains for the Project Management and Project Access mockup baseline.
