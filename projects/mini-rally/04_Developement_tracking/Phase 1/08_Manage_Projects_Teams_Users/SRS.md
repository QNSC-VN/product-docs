# SRS - Phase 1.8 Project Management

## 0. Document Control

| Attribute | Value |
|---|---|
| Module ID | `P1-PROJECT-MANAGEMENT` |
| Status | BA/Mockup Ready |
| Updated date | 2026-08-22 |
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
- Maintain Team membership from active users already eligible in the selected Project, without granting Project Access from the Team flow.
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
| Project key | Yes | 2-10 uppercase letters/numbers; immutable after creation |
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

Workspace Admin is excluded from the Project Access candidate selector but always appears in the Project list as a system-generated, read-only row with a fixed `Workspace Admin` badge. The row is independent of Team membership. Disabled company users cannot be newly added.

### 7.2 List Columns

| Column | Behavior |
|---|---|
| User | Name, avatar and email |
| Status | Company account status |
| Access Level | `Admin` or `Editor` for Project Access rows; derived WA rows show fixed `Workspace Admin` |
| Action | `Remove` for editable Admin/Editor assignments; dash for Admin viewers and derived WA rows |

Rules:

- Admin automatically displays `All Teams`.
- Changing a user to Editor opens Team selection and requires at least one active Team.
- `Remove` opens a confirmation modal, deletes the Project assignment and removes Team memberships in that Project.
- The WA system row has no Admin/Editor dropdown or Project removal action, creates no Project Access and is excluded from Project-member metrics; WA Team membership is maintained separately from the Team.
- When no normal user has Project Access, the WA row remains visible and the list must not show a full-list `No members in this project yet` empty state.
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
| Team key | Yes | Auto-generated from Team name by the current product rule; editable before first save; final value must be unique and contain 2-10 uppercase letters/numbers; immutable after creation |
| Team lead | No | Selected from active members of this Team; selecting a lead never grants separate access or Owner privilege |
| Status | Yes for edit | `Active` or `Deactive` |
| Members | No | Maintained from active users already eligible in the selected Project; Project Access is read-only in this flow |

Member and access rules:

- Team membership never creates, upgrades, downgrades or removes Project Access.
- Eligible normal-user candidates must already have active Admin or Editor Project Access in the selected Project. Active Admins already resolve to `All Teams`; they are treated as effective members and are not offered as new Team-member candidates.
- An active Workspace Admin is an eligible derived Project candidate even though it has no `project_members` row; it receives no Admin/Editor Project Access assignment and is not added automatically to other Teams.
- Disabled users, users outside the selected Project and users already effective in the Team are excluded from the candidate list.
- Team Lead must be an active member of that Team. Assigning Team Lead status alone must not create Team membership or change Work Item Owner eligibility.
- Removing WA from a Team removes only the Team membership; Workspace access remains unchanged.
- Newly created Team and membership changes appear in Team Details. Existing Project Access remains unchanged; WA appears only as a derived Project user and an operational Team member when explicitly added.

### 8.3 Team Details

Selecting a Team shows:

- Team key.
- Status.
- Team lead.
- Member count.
- Member name, email and access badge list; WA uses the fixed `Workspace Admin` badge.

Only Workspace Admin sees the `Add` member button. It opens a modal with search and the eligible candidate list defined in section 8.2. Save adds only Team membership; cancel makes no change. If there is no eligible candidate, the modal shows an empty state and does not fall back to the company directory.

## 9. Project And Team Lifecycle

| Action | Authority | Mockup behavior |
|---|---|---|
| Create Project | Workspace Admin | Opens Project form and adds the saved Project |
| Edit Project | Workspace Admin | Opens current Project fields and estimation settings |
| Archive Project | Workspace Admin | Confirmation; Project becomes read-only and leaves active selectors |
| Restore Project | Workspace Admin | Returns Archived Project to Active |
| Delete Project | Workspace Admin | Typed Project-key confirmation, then removes Project from administration tree |
| Add/Edit Team | Workspace Admin | Maintains Team fields and membership without changing Project Access |
| Deactivate/Restore Team | Workspace Admin | Confirmation; history remains available |

Archived Project and deactivated Team history must be preserved. Dependency rules may block an action and must explain the blocker before confirmation.

## 10. Shared-State Synchronization

Three administration journeys use one source of truth:

1. `Users > User Details > Project Access`.
2. `Workspaces & Projects > Project > Users & Permissions`.
3. `Workspaces & Projects > Project > Teams > Team Details > Add member`.

Required behavior:

- Adding Project access from User Details adds the user to the Project list.
- Adding an existing user from Project Users & Permissions adds a Project Access row in User Details.
- Adding an eligible Editor to a Team updates that Editor's Team scope under the existing Project Access row; it does not create a new Project Access row.
- Admin always resolves to All Teams in every journey.
- Removing Project access clears that Project's Team memberships everywhere.
- Adding or removing WA from a Team updates Team Details without adding, removing or changing the always-visible WA system row in Project Users & Permissions.
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
| WA in Project users | Included as Admin | Always shown as a system-generated read-only `Workspace Admin` row; no Admin/Editor Project Access and no Team-membership dependency |
| Team management | Separate workspace Teams page | Teams managed inside selected Project by WA only |
| Add Team member | Inline company-user selector | `Add` button opens a modal limited to eligible users already in the selected Project; Team membership never grants Project Access |
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
| PM-FR-012 | Workspace Admin is excluded from Admin/Editor Project Access candidates but may be manually added to active Teams as an operational member. |
| PM-FR-013 | Admin views Project structure and Users & Permissions read-only. |
| PM-FR-014 | Editor sees only assigned Projects/Teams and no Users & Permissions tab. |
| PM-FR-015 | Remove Project user and destructive structure actions require confirmation. |
| PM-FR-016 | User, Project and Team access journeys remain synchronized. |
| PM-FR-017 | WA Team membership never creates a Project Access assignment or changes Workspace authority; remove affects only the selected Team membership. |
| PM-FR-018 | Active WA may be Project Owner and may be Team Lead or Work Item Owner only in a Team where it is an active member. |
| PM-FR-019 | Every Project Users & Permissions list always includes the WA system row; the row has no dropdown/Remove action, creates no Project Access and is excluded from Project-member metrics. |
| PM-FR-020 | Team Details uses an `Add` button and modal whose candidates are active eligible users already in the selected Project plus the active WA system user; users outside the Project, disabled users and existing effective Team members are excluded. |
| PM-FR-021 | Adding or removing a Team member never creates or changes Project Access; Team Lead must be an active Team member and does not receive separate Owner privilege. |
| PM-FR-022 | New Team Key is auto-generated from Team Name, can be edited before the first successful save, and becomes immutable after creation. |

## 13. Acceptance Criteria

1. Project Management has one entry point under the Settings gear.
2. Workspace Admin sees all Projects/Teams and all structural actions.
3. Admin sees only assigned Projects with All Teams and cannot mutate Project/Team/access structure.
4. Editor sees only assigned Projects/Teams and cannot view Users & Permissions.
5. A user without Admin/Editor assignment does not see or access the Project.
6. Workspace Admin is not assignable as Project Admin/Editor and always appears in every Project Users & Permissions list as a read-only system row with a `Workspace Admin` badge.
7. Project access can be added or changed from User Details and Project Users & Permissions.
8. Team Details `Add` opens a modal that lists only eligible active Project users plus active WA, and saving changes only Team membership.
9. Changes from every access journey appear in the other journeys in the same session.
10. Confirmation is required before removing a Project user or applying a destructive structure action.
11. Project-specific estimation settings are saved and displayed consistently.
12. Removing WA from a Team removes only that Team membership and keeps Workspace authority unchanged.
13. The WA system row remains visible when a Project has no normal members and never changes Project-member metrics.
14. A user outside the selected Project or a disabled user never appears in the Team-member candidate modal.
15. Team Lead must be an active member of the Team; the Team Lead label alone does not change Work Item Owner eligibility.
16. Creating a Team auto-fills Team Key; Workspace Admin may edit it before save, invalid/duplicate values are rejected, and edit mode keeps the saved key read-only.

## 14. Open Questions

No open business question remains for the Project Management and Project Access mockup baseline.
