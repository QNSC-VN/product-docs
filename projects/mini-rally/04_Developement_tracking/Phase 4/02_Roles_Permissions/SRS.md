# SRS - Phase 4.2 Roles & Permissions

## 0. Document Control

| Attribute | Value |
|---|---|
| Module ID | `P4-ROLES-PERMISSIONS` |
| Status | BA/Mockup Ready |
| Updated date | 2026-07-17 |
| Scope | Workspace/project roles, permission codes, backend enforcement, UI gating and access-denied handling |
| Priority | P4.2 - required for Governance |
| Depends on | Phase 0 auth/session, Phase 1-3 feature permissions, Phase 4.1 notification access rules |
| Mockup source | `03_Mockup Design/src/app/pages/SettingsPage.tsx` - Workspace > Roles & Permissions |
| Not included | Enterprise SSO policy administration, billing roles, external directory sync |

## 1. Goal

Roles & Permissions defines who can see and mutate workspace, project, team and work records. This feature turns earlier deferred permission notes into a single governance baseline.

BA decision: Phase 4 uses three access roles only. `workspace_admin` is the company-wide administrator. `project_admin` manages one or more assigned projects and may view other projects in read-only mode. `project_member` works only inside the assigned project. PM/BA/Developer/Tester/Viewer persona roles are removed from the mockup and RBAC documents. `workspace_member`, `project_viewer` and `guest` are also removed from the Phase 4 baseline.

## 2. Production Role Baseline

| Code | Role | Production slug | Intent |
|---|---|---|---|
| WA | Workspace Admin | `workspace_admin` | Full workspace ownership and workspace-level administration |
| PA | Project Admin | `project_admin` | Manage assigned projects; view all other projects without mutation access |
| PM | Project Member | `project_member` | Work only inside the assigned project |

Legend for mockup action states:

| State | Meaning |
|---|---|
| E | Enabled action |
| R | Read-only access |
| D | Visible but disabled action |
| H | Hidden or denied |

Action state behavior:

| State | Business behavior | Example usage |
|---|---|---|
| E - Enabled | User can see and perform the action normally | Project Member can create US/DE; Project Admin can edit assigned project settings; Workspace Admin can edit the role matrix |
| R - Read-only | User can see the screen/data but cannot mutate it | Project Admin can inspect another project, but all create/edit/delete actions in that project are unavailable |
| D - Disabled | User can see that an action exists, but the control is disabled in the current role/context | A viewer may see a create/edit control disabled when the product wants to show capability availability without allowing interaction |
| H - Hidden | User does not see the screen/action/menu; direct access must be blocked by access-denied or not-found behavior | Non-admin users do not see Roles & Permissions; Project Member does not see Delete Project or user-removal actions |

Action state selection rules:

- `View` permissions usually resolve to `E` for editable users or `R` for read-only users.
- `Create`, `Edit` and `Delete` actions must not be represented as `R`; use `E`, `D` or `H`.
- Use `D` only when the UI should intentionally reveal that the action exists but is unavailable in the current role/context.
- Use `H` for sensitive administrative, destructive or security-related actions such as role matrix changes, user removal and project deletion.
- Direct URL/API access must still be guarded even when the UI state is `H`; hidden UI is not a security control by itself.

Permission-code granularity:

- Every Screen + Action row has one independent permission code.
- Create, Edit, Delete, Archive, Restore and status-change actions must not share a generic `*:manage` permission.
- Workspace Admin can change one action without implicitly changing another action for the same module.
- Permission codes use the pattern `{surface}:{action}`, for example `iterations:create`, `iterations:edit` and `iterations:delete`.
- The row-level permission code and its E/R/D/H role states are the business source of truth for the matrix.

System baseline permissions:

- Auth session actions are fixed at `E` for all roles.
- Basic App Shell navigation, context switching and global work-item search are fixed at `E`; returned data still follows project/team access.
- Personal profile view/edit is fixed at `E` for the signed-in user.
- Assignment/mention notification view, read-state update and route-to-target behavior are fixed at `E`; the notification target still requires current project/item access.
- Notification Preferences is not exposed in Phase 4; assignment and mention notifications use the fixed business behavior from P4.1.
- System baseline rows display a lock and never become dropdowns in matrix Edit mode.

Governance override decision:

- User, Team, Project lifecycle, Workspace Settings, Role Matrix and Audit actions default to `H` for Project Admin and Project Member.
- These governance rows are not system-locked.
- Workspace Admin may override PA/PM states through the matrix when the company needs an exception.
- The small-company MVP accepts the edge case that an override can broaden a role beyond its default business baseline.
- Auth, App Shell, Personal and Notification system rows remain the only rows locked for all roles.

Matrix edit rule:

| Rule | Decision |
|---|---|
| Who can edit the matrix | `workspace_admin` only |
| Editable roles | `project_admin`, `project_member` |
| Locked role | `workspace_admin` column is locked as the system-owner baseline |
| Edit entry | Workspace Admin clicks `Edit` to unlock editable role cells |
| Editable values | `E`, `R`, `D`, `H` per screen/action/role cell |
| Action independence | Each row uses a separate permission code; changing one row does not change another row |
| System-locked rows | Auth, App Shell, Personal and Notifications remain fixed at `E` for all roles |
| Governance rows | Default WA-only, but WA may override PA/PM states through the matrix |
| Save behavior | Workspace Admin clicks `Save`; matrix returns to locked display mode after save |

## 3. Effective Permission Business Rules

This section intentionally defines business/mockup behavior only. Technical session payload shape is owned by development implementation.

### 3.1 Role Scope Rules

| Role | Business scope |
|---|---|
| `workspace_admin` | Full company/workspace administration across all projects and teams |
| `project_admin` | Administer one or more projects assigned by Workspace Admin; may open every other project in read-only mode |
| `project_member` | Work only inside the assigned project through Backlog management, Work Item/Task detail and Iteration Status |

Confirmed rules:

- There is no `workspace_member` role in Phase 4.
- There is no `project_viewer` role in Phase 4.
- There is no `guest` role in Phase 4.
- `project_admin` mutation permissions are effective only in projects assigned for administration.
- Workspace Admin may assign the same Project Admin to manage multiple projects.
- When `project_admin` opens a project outside that assigned list, project data is read-only and all create/edit/delete actions are unavailable.
- `project_member` can only access the assigned project.
- Only `workspace_admin` manages company users, project membership, team membership and resource allocation.
- Project Admin cannot invite/deactivate users, assign roles, add/remove project members or allocate users to teams.
- Only Workspace Admin can create, archive, restore or delete a Project.
- Project Admin can edit Project Settings only for assigned managed projects; configurable Workflow Status and Labels are deferred.

Confirmed Project Admin delivery scope:

- Has full View/Create/Edit/Delete access in assigned managed projects for Backlog, US/DE, Tasks, Iterations, Releases, Milestones, Team Status and Quality/Defect.
- Reports will follow the same assigned-project-list management rule when Reports is defined in Phase 5.
- When viewing another project, all supported delivery modules are read-only.
- Delete actions require a confirmation step.
- Delete must be blocked when the target has dependent or linked data that the module's business rules do not allow to be removed.
- A blocked delete must explain the dependency and leave the record unchanged.

Confirmed Project Member scope:

- Can view, create, edit, rank and delete US/DE items in Backlog.
- Can open Work Item Detail and edit fields, description, Notes, mentions, attachments, relations and watcher subscription.
- Can create, edit and delete child Tasks.
- Can assign or unassign a Work Item to an Iteration.
- Can view Iteration Status and create, edit or delete US/DE items from that screen.
- Cannot assign a Work Item to a Release.
- Cannot access Manage Projects, Timeboxes management, Releases, Milestones, Team Status, Quality dashboard, Project Settings, Workspace Settings or Audit Log.
- Can still access personal profile/preferences and personal assignment/mention notifications.

Confirmed Workspace Admin resource-management scope:

- Invites, activates, deactivates and removes company users.
- Assigns or revokes `project_admin` and `project_member` roles.
- Adds or removes users from projects.
- Adds or removes users from teams and allocates resources across teams.
- Creates, edits, deactivates and restores Teams.
- Creates, archives, restores and deletes Projects.
- Project Admin and Project Member may view the project/team context needed for their work but cannot mutate company structure or membership.

### 3.2 Project / Team Context Access Rules

| Rule | Decision |
|---|---|
| Project access | Project access is the primary gate for non-admin users |
| Workspace Admin access | `workspace_admin` can access every project and team in the company |
| Project selector | Project Admin can see all projects; Project Member sees only the assigned project |
| Direct URL access | If a user opens an inaccessible project by direct URL, show access-denied or not-found behavior |
| Team access | Team membership is a secondary filter under project access |
| Project Admin assignment | Workspace Admin can assign one or more managed Projects to a Project Admin |
| Project Admin cross-project access | In assigned managed Projects use the PA matrix states; in every other Project allow read-only viewing and block all mutations |
| Project Admin delivery access | Full View/Create/Edit/Delete for delivery modules in assigned managed Projects; read-only in other Projects |
| Project-level data | If a user has project access but is not in a specific team, they can still see project-level data allowed by their role |
| Team-specific screens | Team-specific delivery views follow project/team access, but all team membership and resource allocation mutations are Workspace Admin only |
| Project Member team scope | Project Member sees and mutates Backlog/Iteration Status only for Teams assigned by Workspace Admin |
| Project Member multiple teams | If assigned to multiple Teams in the same Project, Project Member can switch only among those Teams |
| All Teams | Available to Workspace Admin and Project Admin; hidden from Project Member |
| Notifications | Assignment and mention notifications are created/read only when the recipient has access to the target US/DE project/team context |

Recommended interpretation: project access is the main gate; team access narrows team-specific views and actions.

### 3.3 UI Behavior by Permission State

| State | UI behavior |
|---|---|
| `E` | Show the control/screen and allow the user to perform the action |
| `R` | Show data as read-only; create/edit/delete controls must not be active |
| `D` | Show the control disabled when the product intentionally wants users to know the action exists but is unavailable in the current role/context |
| `H` | Hide the control/menu/screen; direct URL access must resolve to access-denied or not-found behavior |

Confirmed rules:

- Destructive and administrative actions should usually use `H` when the user lacks permission.
- `D` should be used sparingly and only when exposing the unavailable action is useful to the workflow.
- `R` applies to data visibility, not mutation actions. Create, Edit and Delete actions should use `E`, `D` or `H`.
- The UI state is for user experience only; backend/API access checks still apply.

### 3.4 Access Denied / Not Found Behavior

| Scenario | Expected behavior |
|---|---|
| Direct URL to an existing but inaccessible project/team/item | Show `Access Denied` unless the surface is considered sensitive enough to mask existence |
| Direct URL to a missing record | Show `Not Found` |
| Sensitive or security-relevant record existence | Prefer `Not Found` to avoid exposing whether the record exists |
| List/search/dropdown data | Return and display only records the user can access |
| Notification target after access is revoked | Clicking the notification opens safe access-denied or not-found behavior without exposing restricted details |

Access-denied safety rules:

- Do not show restricted item title, owner, project name, team name or other metadata if the user lacks access.
- Search must not reveal inaccessible records.
- Project and team selectors must not reveal inaccessible projects/teams.
- Project Member selectors must not expose unassigned Teams or the `All Teams` option.
- Notification rows may remain visible only if they do not expose restricted target details after access is revoked.
- Backend/API guards are required even when UI hides inaccessible records.

Mockup states:

- A shared `Access Denied` state is used when the record/context exists but the current role cannot access it.
- A shared `Not Found` state is used when the target does not exist or its existence must be hidden.
- Neither state displays restricted record title, owner, Project or Team metadata.
- Both states provide a safe `Back to Backlog` action.
- Switching the mockup role to Project Member while an inaccessible page is open demonstrates Access Denied.
- Opening a notification whose target cannot be resolved demonstrates Not Found.

### 3.5 Role / Membership Change Effective Time

| Scenario | Decision |
|---|---|
| Workspace Admin changes a user's role | The administrative record is saved immediately, but the user's effective permissions change on the user's next login |
| Workspace Admin changes project/team membership | The administrative record is saved immediately, but the user's effective project/team access changes on the user's next login |
| User is currently online while role/access is changed | Existing session may continue with the previous permission set until the next login |
| Workspace Admin deactivates or removes a user from the company | The company membership change is saved immediately; the user loses company access on the next page refresh |
| Deactivated/removed user refreshes the page | Do not restore company/project data; route to sign-in or an access-denied state without exposing company data |
| Workspace Admin reactivates a user | The user must sign in again before restored company/project access is available |
| User signs out and signs in again | New role, project access and team access take effect |
| Audit trail | Role and membership changes must be auditable with actor, target user, old value, new value and timestamp |

Confirmed rules:

- Role, permission-matrix and project/team allocation changes become effective on the user's next login.
- Company deactivation/removal is the exception: it becomes effective on the user's next page refresh.
- Phase 4 does not require the UI to force-close the current page at the exact moment the admin saves deactivation/removal.

### 3.6 Mockup Role Simulation

- The mockup role switch contains only Workspace Admin, Project Admin and Project Member.
- The role switch exists for BA validation only and is not a production user-facing role-change function.
- Workspace Admin sees all projects, teams and navigation surfaces.
- Project Admin sees all Projects and Teams; assigned managed Projects are editable and every other Project is read-only.
- Project Member sees only the assigned Project and assigned Teams.
- Project Member navigation contains Home, Backlog and Iteration Status only, plus personal Notifications.
- Switching to Project Member resets invalid context to the assigned Project/Team and exits inaccessible pages.

### 3.7 RBAC Audit Rules

RBAC and membership mutations must be audit-visible in the workspace audit log.

Events to audit:

- User invited.
- User deactivated or reactivated.
- User removed from company/project/team.
- User role changed.
- Project membership added or removed.
- Team membership added or removed.
- Role matrix changed.

Audit row display:

| Column | Rule |
|---|---|
| Time | Show weekday, month, day, year, hour, minute and second |
| Actor | Show the user who performed the change |
| Detail | Single readable sentence describing the action performed, including target and old/new values when relevant |

Audit search/filter:

- User can search audit rows by actor name.
- User can search audit rows by time text.
- The mockup intentionally removes separate `Action` and `Entity` columns; the `Detail` column is the source of what happened.

Audit visibility:

- `workspace_admin` can view workspace-level audit log.
- Project-level audit visibility for `project_admin` is deferred to P4.3 Settings & Audit refinement.
- Audit rows are read-only. The UI must not provide edit/delete actions for audit entries.
- Audit is recorded when the admin saves the change, even though the changed user's effective permissions apply on next login.

### 3.8 Role Matrix Edit Business Rules

BA status: Confirmed.

| Rule | Decision |
|---|---|
| Who can edit | Only `workspace_admin` can edit the role matrix |
| Locked baseline | The `workspace_admin` column is always locked and cannot be changed from the UI |
| Editable role columns | `project_admin` and `project_member` |
| Default mode | Matrix opens in read-only display mode |
| Edit mode | Workspace Admin clicks `Edit`; editable cells become `E/R/D/H` dropdowns |
| Save behavior | Workspace Admin clicks `Save`; changes are stored and the matrix returns to read-only display mode |
| Effective time | Saved matrix changes apply to users on their next login |
| Versioning | Phase 4 does not require matrix versioning |

Role matrix audit:

- Saving matrix changes creates an audit event.
- Audit detail must identify actor, changed role, screen/action, old state, new state and time.
- If multiple cells are changed in one save, the audit detail may summarize the save while preserving enough detail for dev/support review.

## 4. Screen / Action Matrix Draft

The matrix now reflects the mockup surfaces completed from Phase 0 through Phase 4. The detailed row-by-row matrix is visible in the mockup under `Settings > Workspace > Roles & Permissions`.

Navigation distinction:

| Entry point | Scope |
|---|---|
| Top-right gear / Workspace Settings | Workspace-wide settings, role matrix, user management, audit and configuration surfaces |
| Workspace dropdown / Manage Projects | Project and team management under the selected workspace |
| Top-right gear / User Management | Company user invitation, role assignment, status and team allocation |

Phase 5 deferred surfaces:

| Surface | Decision |
|---|---|
| Portfolio | Phase 5; RBAC revisited after Portfolio scope is defined |
| Top-level Release Tracking | Phase 5; belongs under Portfolio direction |
| Reports | Phase 5; RBAC revisited after Reports scope is defined |

Out-of-scope or removed from the Phase 4 core matrix:

| Item | Reason |
|---|---|
| Workspace create UI | Phase 0 single-company MVP does not expose Workspace creation/switching |
| Workspace Member role | Removed because MVP has one workspace/company; workspace-level access is covered by `workspace_admin` |
| Project Viewer role | Removed; cross-project read-only behavior is provided only to `project_admin` |
| Guest role | Removed from Phase 4 because external collaborator behavior is not in scope |
| Iteration start/close workflow | Phase 2 baseline uses create/edit/assignment flows, not a dedicated start/close sprint workflow |
| Team Board | Future Backlog; visible legacy mockup surface but not Phase 0-4 RBAC core |

Coverage groups:

| Area | Included actions | Main permission codes |
|---|---|---|
| Auth | Create session; View restored session; Delete session | `auth:sign_in`, `auth:restore_session`, `auth:sign_out` |
| App Shell | View navigation/context/search results; Edit selected project/team context | `app_shell:view_navigation`, `app_shell:switch_context`, `app_shell:search_work_items` |
| Home | View dashboard, My Work, Recent Activity and Project Health | `project:view`, `work_item:view` |
| Manage Projects > Projects | View project list; Workspace Admin creates/archives/restores/deletes Projects; Project Admin edits Project Settings only for assigned managed Projects | `project:view`, `project:create`, `project:edit`, `project:archive`, `project:restore`, `project:delete` |
| Manage Projects > Teams | View team list; Create team; Edit team info/status/members; Delete team access by deactivation | `workspace:manage_teams` |
| Settings > User Management | View users; Create user invitation; Edit prod role/status/team membership; Delete user access | `workspace:manage_members` |
| Backlog | View rows/search/filter/sort/page/resize; Create US/DE; Edit fields/iteration/rank; Delete work item; Release assignment is Project Admin only | `work_item:view`, `work_item:create`, `work_item:edit`, `work_item:delete` |
| Work Item Detail | View fields/history; Create attachment/note mention; Edit fields/notes/relations/watchers; Delete attachment/work item | `work_item:view`, `work_item:edit`, `work_item:delete` |
| Task Dashboard/Detail | View child tasks/detail; Create task; Edit task fields/work product; Delete task | `work_item:view`, `work_item:edit` |
| Timeboxes > Iterations | View list/detail; Create iteration; Edit iteration/work item assignment; Delete iteration | `iterations:view`, `iterations:create`, `iterations:edit`, `iterations:delete`, `iterations:assign_work_item` |
| Track > Iteration Status | View selector/metrics/items; Create US/DE in iteration; Edit item fields; Delete item from iteration view | `iteration_status:view`, `iteration_status:create_item`, `iteration_status:edit_item`, `iteration_status:delete_item` |
| Track > Team Status | View grouped status and related item/task detail; Edit capacity/task fields | `team_status:view`, `team_status:edit_capacity`, `team_status:edit_task`, `team_status:view_related_item` |
| Timeboxes > Releases | View dashboard/detail; Create release; Edit release/artifacts; Delete release | `releases:view`, `releases:create`, `releases:edit`, `releases:delete` |
| Timeboxes > Milestones | View dashboard/detail/artifacts; Create milestone; Edit fields/relations; Delete milestone | `milestones:view`, `milestones:create`, `milestones:edit`, `milestones:delete` |
| Quality > Defect | View dashboard; Create defect; Edit defect fields; Delete defect | `quality:view_dashboard`, `defects:create`, `defects:edit`, `defects:delete` |
| Notifications | View alerts and related US/DE; Edit notification read state | `notifications:view`, `notifications:mark_read`, `notifications:view_target` |
| Settings | View/edit personal, project and workspace settings; Edit role matrix; View audit | `profile:*`, `project_settings:*`, `workspace_settings:*`, `permission_matrix:edit`, `audit_log:view` |

## 5. Initial Task Breakdown

| ID | Task | Output | Status |
|---|---|---|---|
| P4-RBAC-01 | Define role model and permission matrix | Workspace/project role baseline and permission codes | Done / BA confirmed |
| P4-RBAC-02 | Define effective permission business rules | Mockup/business rules for context-based access and UI behavior | Done / BA confirmed |
| P4-RBAC-03 | Define backend access enforcement | Workspace/project membership and record access guards | Pending |
| P4-RBAC-04 | Define action-level permission rules | Create/edit/delete/archive/restore/read-only guards | Pending |
| P4-RBAC-05 | Define frontend route/action/field gating | UI visibility, disabled states and 403 handling | Pending |
| P4-RBAC-06 | Define verification scenarios | PA cross-project read-only, PM project/team isolation and unauthorized mutation rejection | Pending |

## 6. Open Questions Gate

Questions will be raised before changing any rule that cannot be derived from the production role model.

Closed BA decisions:

- `workspace_member` is removed because this MVP has one workspace/company and does not need a non-admin workspace-level role.
- `project_viewer` is removed; the approved baseline has three roles only.
- `guest` is removed from Phase 4 RBAC. Future external collaborator behavior will require a separate scope decision.
