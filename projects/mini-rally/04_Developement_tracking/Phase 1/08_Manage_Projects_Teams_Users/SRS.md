# SRS - Phase 1.8 Manage Projects and Workspace Teams/Users

## 0. Document Control

| Attribute | Value |
|---|---|
| Module ID | `P1-MANAGE-ORG` |
| Status | Draft for Development |
| Scope | Manage Projects entry point; Settings gear owns Teams and User Management |
| Priority | P1 - required |
| Depends on | Phase 0 App Shell, Auth/Role, Project/Team/User DB |
| Mockup source | `03_Mockup Design/src/app/pages/ProjectsPage.tsx` |
| Not included | Team capacity planning, velocity management, advanced RBAC designer, audit admin screen |

## 1. Objective

Phase 1 needs a clean Manage area so Workspace Admin can maintain the organization structure used by Backlog, Work Item Create, Work Item Detail, and later Iteration flows.

`Workspace menu > Manage Projects` contains the `Projects` list only. `Settings gear` owns `Teams` and `User Management`. The three surfaces together maintain the organization structure used by work management.

## 2. Actors

| Actor | Access |
|---|---|
| Workspace Admin | Full access to Manage Projects and Settings Teams/User Management |
| Project Admin | Project-scoped access only when granted by permission |
| Project Member | No organization administration access |

Backend permission must be enforced even if the FE hides buttons.

## 2A. Business Rules / Business Flow

Manage is the administration surface for the organization structure used by all later work flows.

Business flow:

```text
Workspace Admin opens Workspace menu
-> Opens Manage Projects and creates or maintains Projects
-> Opens Settings gear > Teams and creates Teams/links them to Projects
-> Opens Settings gear > User Management and invites/maintains Users
-> Grants Users workspace role and team membership
-> Backlog/Create/Detail/Iteration screens use only valid Project-Team-User relationships
```

Business rules:

- A Workspace contains Projects, Teams and Users.
- Project is the delivery container for Backlog, Work Items, Releases and Iterations.
- Team is the delivery group used for assignment and planning. In Phase 1, a Team must be linked to at least one active Project before it can be selected in Backlog/Create/Detail flows.
- User is a workspace member who may have a workspace role and team membership.
- User project access is derived from team membership. The User management screen must not assign projects directly to a user.
- Work Item Project and Team must be a valid pair. If a user selects Project `NXP`, the Team dropdown can only show teams linked to `NXP`.
- Owner/Assignee fields should only allow active users who belong to the selected Team, unless BA later allows broader workspace assignment.
- Team Lead must be an active or invited workspace user, depending final backend policy.
- Team Members are managed in Create/Edit Team because membership affects assignment/access, but members are not displayed as a Teams list column.
- Archived Projects and Deactive Teams remain for history but must be excluded from new create selectors by default.
- Deactive Users remain in history but cannot be newly assigned to work items.
- Capacity and Velocity are not Team management fields in Phase 1; they belong to future iteration planning/reporting decisions.

## 3. Navigation and Screen Structure

| UI area | Requirement |
|---|---|
| Workspace menu | `Manage Projects` opens the Projects page |
| Breadcrumb | Shows `ACME Space Inc. > Manage Projects` |
| Page title | `Manage Projects` |
| Tabs | Projects only |
| Primary action | `Create Project`; Team/User actions live under Settings gear |
| Style | Same dense list design language as Backlog and Timeboxes; no marketing/hero layout |

## 4. Projects Tab

Projects tab keeps the existing Phase 1 mockup behavior.

### 4.1 List Columns

| Column | Notes |
|---|---|
| Key | Project key, unique in workspace |
| Project | Name + description |
| Status | Active/Archived |
| Owner | Project owner |
| Teams | Linked teams summary |
| Members | Count summary |
| Start Date | Project start date |
| Updated | Last updated |
| Actions | Edit, Archive, Restore |

### 4.2 Create/Edit Project Fields

| Field | Required | Notes |
|---|---:|---|
| Project name | Yes | Trim and validate unique by name policy if required |
| Project key | Yes | 2-10 uppercase letters/numbers, immutable after create |
| Description | No | Text field |
| Project owner | No | User selector |
| Start date | No | Date |
| Teams | No | Multi-select existing teams |

## 5. Settings > Teams

Teams represent delivery teams under a project. Teams are used by Backlog, Work Item Create, Work Item Detail, and later Timebox/Iteration flows.

### 5.1 Team Metrics

| Metric | Rule |
|---|---|
| Total Teams | Count all teams in current workspace |
| Active | Count teams with status `Active` |
| Deactive | Count teams with status `Deactive` |

Do not show `Projects Covered`, team member count, capacity, or velocity metrics in the Phase 1 `Settings > Teams` screen.

### 5.2 Team List Columns

| Column | Source | Notes |
|---|---|---|
| Key | `teams.team_key` | Short team key, unique in workspace or project by backend rule |
| Team | `teams.name`, `teams.description` | Name and short description |
| Project | `project_teams.project_id -> projects` | Primary/linked project shown as `KEY / Project name` |
| Status | `teams.status` | `Active`, `Deactive` |
| Lead | `teams.lead_user_id -> users` | Avatar + name |
| Updated | `teams.updated_at` | Relative or formatted date |

The Teams list must not contain `Members`, `Capacity`, `Velocity`, or `Actions` columns. User opens Team detail/edit by clicking the Team row.

### 5.3 Team Filters

| Filter | Rule |
|---|---|
| Search | Search by team key, team name, project name, lead name |
| Project | `All projects` or one project |
| Status | `All`, `Active`, `Deactive`; default `Active` |

### 5.4 Create/Edit Team Fields

| Field | Required | Rule |
|---|---:|---|
| Project | Yes | Must be an active project user can manage |
| Team lead | No | User selector; must be active or invited user depending backend policy |
| Team name | Yes | Trim, max length defined by backend |
| Team key | Yes | Auto-suggest from name; uppercase; unique by backend rule |
| Description | No | Short team purpose/ownership text |
| Status | Yes | `Active` or `Deactive`; default `Active` |
| Members | No | Multi-select workspace users assigned to this team |

Create/Edit Team must not include capacity or velocity fields in Phase 1.

Create/Edit Team modal uses fixed-size modal tabs:

1. `Team Info`: Project, Team Lead, Team Name, Team Key, Description, Status.
2. `Members`: searchable vertical list of workspace users; selected users become Team members.

### 5.5 Team Behavior

| ID | Requirement |
|---|---|
| TEAM-FR-001 | User clicks `Create Team` from Manage > Teams. |
| TEAM-FR-002 | System opens Create Team modal using the shared Manage modal style. |
| TEAM-FR-003 | Project, Team name and Team key are required. |
| TEAM-FR-004 | Team key is normalized uppercase and validated unique. |
| TEAM-FR-005 | Members can be selected during create/edit but are not shown as a list column. |
| TEAM-FR-006 | Saving creates team and links it to selected project. |
| TEAM-FR-007 | Clicking a Team row opens Edit Team modal. |
| TEAM-FR-008 | Deactive makes team unavailable for new selectors but preserves history. |
| TEAM-FR-009 | Reactivating a team is done by setting status back to `Active`. |

## 6. Users Tab

Users tab provides the minimum workspace user management needed for Phase 1.

### 6.1 User Metrics

| Metric | Rule |
|---|---|
| Total Users | Count all users in workspace |
| Active | Count users with status `Active` |
| Admins | Count users with role `Workspace Admin` |

Do not show an `Invited` metric card in the Users tab. Invited remains available as a user status value, but it is not a top summary metric or a segmented list filter.

### 6.2 User List Columns

| Column | Source | Notes |
|---|---|---|
| User | `users.full_name`, avatar initials | Primary visible identity |
| Email | `users.email` | Unique login/contact |
| Workspace Role | Workspace membership role | Badge |
| Status | User status | `Active`, `Invited`, `Deactive` |
| Teams | Team memberships summary | Team names |
| Last Login | Auth/audit source | `-` for invited users |

The Users list must not show `Project Access` or `Actions` columns. User detail/edit opens by clicking the user row.

### 6.2A User Filters

| Filter | Rule |
|---|---|
| Search | Search by user name, email, workspace role |
| Role | `All roles` or one workspace role |
| Status | Segmented filter: `All`, `Active`, `Deactive` |

Invited users can appear in the list, but the current mockup does not provide a dedicated `Invited` filter chip.

### 6.3 Invite/Edit User Fields

| Field | Required | Rule |
|---|---:|---|
| Full name | No for invite | If blank, derive display name from email until profile is completed |
| Email | Yes | Valid email, unique in workspace |
| Workspace role | Yes | `Workspace Admin`, `Project Manager`, `Product Owner`, `Developer`, `Tester`, `Viewer` |
| Status | Yes | `Active`, `Invited`, `Deactive` |
| Team membership | No | Multi-select active teams; project access is derived from selected teams |

Invite/Edit User modal uses fixed-size modal tabs:

1. `Info`: Full name, Email, Workspace role, Status.
2. `Teams`: searchable list of active teams.

There is no `Projects` tab in the User modal.

### 6.4 User Invite Business Flow

Target business flow:

```text
Workspace Admin opens Manage > Users
-> Clicks Invite User
-> Enters email, optional full name, workspace role, status and team membership
-> System creates an invited workspace user
-> System sends invitation email to the user
-> User opens invitation email and clicks confirmation/join link
-> System validates invitation token
-> User completes account setup or signs in
-> User status becomes Active and user can access permitted team/project data
```

Phase 1 implementation note:

- Email sending and invitation token confirmation can be implemented later if it is not ready in the first development slice.
- For the initial backend implementation, dev may create/invite users directly through DB/API records and set status manually, while preserving the API shape for future email invite flow.
- The SRS still defines the full business flow so later implementation does not need to reinterpret the product requirement.

### 6.5 User CRUD Behavior

| ID | Requirement |
|---|---|
| USER-FR-001 | Workspace Admin opens Manage > Users. |
| USER-FR-002 | System shows user list with User, Email, Workspace Role, Status, Teams, Last Login. |
| USER-FR-003 | User list supports search by name/email/role, role filter and status filter. |
| USER-FR-004 | Workspace Admin clicks `Invite User` to open Invite User modal. |
| USER-FR-005 | Email is required, must be valid and unique in workspace. |
| USER-FR-006 | Workspace Role is required. |
| USER-FR-007 | Status is required and supports `Active`, `Invited`, `Deactive`. |
| USER-FR-008 | Admin can assign zero or more active Teams to the user. |
| USER-FR-009 | Admin cannot assign Projects directly to the user. Project access is derived from selected Teams. |
| USER-FR-010 | Saving an invited user creates user/workspace membership and team membership records. |
| USER-FR-011 | Clicking a user row opens the same modal in edit mode. |
| USER-FR-012 | In edit mode, email is read-only unless backend explicitly supports email change. |
| USER-FR-013 | Admin can update full name, workspace role, status and team membership. |
| USER-FR-014 | Setting status to `Deactive` prevents future assignment/login access according to backend auth policy, but preserves history. |
| USER-FR-015 | Re-activating a user is done by setting status back to `Active`. |

## 7. API Contracts

Suggested endpoints:

```text
GET    /api/v1/manage/projects
POST   /api/v1/manage/projects
PATCH  /api/v1/manage/projects/:projectId
POST   /api/v1/manage/projects/:projectId/archive
POST   /api/v1/manage/projects/:projectId/restore

GET    /api/v1/manage/teams
POST   /api/v1/manage/teams
PATCH  /api/v1/manage/teams/:teamId
POST   /api/v1/manage/teams/:teamId/deactivate
POST   /api/v1/manage/teams/:teamId/reactivate

GET    /api/v1/manage/users
POST   /api/v1/manage/users/invite
PATCH  /api/v1/manage/users/:userId
POST   /api/v1/manage/users/:userId/deactivate
POST   /api/v1/manage/users/:userId/reactivate
```

### 7.1 Create Team Request

```json
{
  "projectId": "uuid",
  "teamKey": "CP",
  "name": "Core Platform",
  "description": "Core product platform team.",
  "leadUserId": "uuid",
  "status": "Active",
  "memberUserIds": ["uuid-1", "uuid-2"]
}
```

Team `status` accepts `Active` and `Deactive`.

### 7.2 Team List Response Item

```json
{
  "id": "uuid",
  "teamKey": "CP",
  "name": "Core Platform",
  "description": "Core product platform team.",
  "project": { "id": "uuid", "key": "NXP", "name": "Nexus Platform 2025" },
  "status": "Active",
  "lead": { "id": "uuid", "fullName": "Marcus Webb", "initials": "MW" },
  "updatedAt": "2026-06-28T09:00:00Z"
}
```

### 7.3 Invite User Request

```json
{
  "email": "alex.morgan@acme.com",
  "fullName": "Alex Morgan",
  "workspaceRole": "Developer",
  "status": "Invited",
  "teamIds": ["team-uuid-1", "team-uuid-2"]
}
```

Rules:

- `email`, `workspaceRole` and `status` are required.
- `fullName` can be blank/null for invite; display name can be derived from email until the user completes profile.
- `teamIds` can be empty, but each selected team must be active and belong to the workspace.
- Request must not contain `projectIds` or direct project access.

### 7.4 Update User Request

```json
{
  "fullName": "Alex Morgan",
  "workspaceRole": "Developer",
  "status": "Active",
  "teamIds": ["team-uuid-1", "team-uuid-2"]
}
```

Rules:

- Email is immutable in Phase 1 edit flow unless backend explicitly supports account email change.
- Updating `teamIds` replaces the current user-team memberships.
- Project access for read/filter selectors is derived from the user's current teams.

### 7.5 User List Response Item

```json
{
  "id": "user-uuid",
  "fullName": "Alex Morgan",
  "email": "alex.morgan@acme.com",
  "workspaceRole": "Developer",
  "status": "Active",
  "teams": [
    { "id": "team-uuid-1", "key": "CP", "name": "Core Platform", "project": { "id": "project-uuid", "key": "NXP", "name": "Nexus Platform 2025" } }
  ],
  "lastLoginAt": "2026-06-28T09:00:00Z"
}
```

UI displays Team names in the list. Project data can be returned as nested context for validation/debugging, but it is not displayed as a separate Users list column in the current mockup.

## 8. DB Mapping

| Concept | Suggested DB source |
|---|---|
| Project | `projects` |
| Team | `teams` |
| Project-Team link | `project_teams` or `teams.project_id` if one team belongs to one project |
| Team lead | `teams.lead_user_id` |
| Team members | `team_members` |
| User | `users` |
| Workspace role | `workspace_members.role` or equivalent |
| User team membership | `team_members` |
| Derived user project access | `team_members -> teams -> project_teams/projects` |
| User status | `users.status` or membership status |

If current DB design uses different table names, dev should map these concepts to the existing schema and keep API DTO names stable.

## 9. Permission Rules

| Action | Required permission |
|---|---|
| View Manage | `manage.view` |
| Create/Edit Project | `project.manage` |
| Archive/Restore Project | `project.archive` |
| Create/Edit Team | `team.manage` |
| Deactivate/Reactivate Team | `team.manage` |
| Invite/Edit User | `user.manage` |
| Deactivate/Reactivate User | `user.manage` |

Workspace Admin has all permissions in current mockup. More granular permission policy can be refined later.

## 10. Acceptance Criteria

1. Workspace menu `Manage Projects` opens Project management with the `Projects` view only; the top-right Settings gear contains `Teams` and `User Management` as workspace administration sections.
2. `Settings > Teams` shows only columns: Key, Team, Project, Status, Lead, Updated.
3. `Settings > Teams` does not show Members, Capacity or Velocity columns; its Actions area is limited to permitted administration actions.
4. `Create Team` modal includes Team Info and Members tabs.
5. `Team Info` tab includes Project, Team lead, Team name, Team key, Description, Status.
6. `Members` tab includes searchable user list for selecting team members.
7. `Create Team` modal does not include capacity or velocity fields.
8. Creating a team links it to the selected project.
9. Deactive teams are excluded from active selectors used by create/edit flows.
10. Clicking a Team row opens Edit Team modal.
11. Users tab supports Invite/Edit User with role and team membership.
12. Viewer/non-admin cannot mutate Manage data through UI or API.
13. All create/edit/deactivate/reactivate actions write activity/audit logs if audit logging exists in Phase 1 implementation.
14. Users list does not show Project Access or Actions columns.
15. User modal does not show a Projects tab; user project access is derived from selected Teams.

## 11. Implementation Breakdown

```text
MNG-T01 Manage page route/tab shell
MNG-T02 Projects API integration with existing mock behavior
MNG-T03 Teams list/filter API
MNG-T04 Create/Edit Team modal + validation
MNG-T05 Team deactivate/reactivate behavior
MNG-T06 Users list/filter API
MNG-T07 Invite/Edit User modal + team membership updates
MNG-T08 Permission guards and API tests
MNG-T09 E2E smoke: Manage -> Teams -> Create Team -> Backlog team selector
```

## 12. Decisions

| ID | Decision | Dev note |
|---|---|---|
| P1-DC-008 | Manage is the admin entry for Projects, Teams and Users | Route can stay under current `projects` mock route, but product language is `Manage` |
| P1-DC-009 | Team list is intentionally lightweight | Do not show members/capacity/velocity/actions in Teams list |
| P1-DC-010 | Team members are selected in Create/Edit Team | Membership matters for assignment/access, but is not a table column |
| P1-DC-011 | Capacity/Velocity are not Team management fields in Phase 1 | Iteration planning may define capacity/velocity later |
| P1-DC-012 | User is assigned to Teams, not directly to Projects | Project access is derived from Team -> Project relationship |
| P1-DC-013 | Invite email confirmation is target business flow | Initial implementation may add invited users through DB/API first; email token join flow can be implemented later |
| P1-DC-014 | User status uses `Active`, `Invited`, `Deactive` | Replace old `Suspended` language in User management |
| P1-DC-015 | Team status uses `Active`, `Deactive` | Replace old Team `Archived` language; deactive team remains for history but is excluded from active selectors |
| P1-DC-016 | Teams list has no Actions column | Click Team row to open edit modal |
| P1-DC-017 | Team modal has `Team Info` and `Members` tabs | Members tab provides searchable member selection |
