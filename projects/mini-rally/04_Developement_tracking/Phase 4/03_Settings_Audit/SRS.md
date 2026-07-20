# SRS - Phase 4.3 Settings & Audit

## 0. Document Control

| Attribute | Value |
|---|---|
| Module ID | `P4-SETTINGS-AUDIT` |
| Status | BA/Mockup Ready |
| Updated date | 2026-07-17 |
| Scope | Workspace settings, Phase 1 project settings entry-point alignment, user management, audit log and destructive confirmations |
| Priority | P4.3 - required for Governance |
| Depends on | P4.2 Roles & Permissions |
| Mockup source | `03_Mockup Design/src/app/pages/SettingsPage.tsx` |
| Not included | API payloads, persistence design, advanced compliance reports, retention policies, external audit exports |

## 1. Goal

Settings & Audit gives administrators controlled configuration surfaces and traceability for important mutations. Phase 4.3 is a BA/mockup baseline only; developers will define payload and implementation contracts separately.

Entry-point rule: top-right gear is only for company/workspace-level settings. Project-level settings must live in one place only: `Manage Projects > Projects`.

This feature follows the Phase 4 working rule: complete one task, wait for BA confirmation, then continue to the next task.

## 2. Feature Task Breakdown

| ID | Task | Output | Status |
|---|---|---|---|
| P4-SET-01 | Workspace Settings | Single-company workspace settings business rules and mockup baseline | Done / BA confirmed |
| P4-SET-02 | Project Settings | Reuse Phase 1 Manage > Projects baseline; document single entry point and Phase 4 RBAC context | Done / BA confirmed |
| P4-SET-03 | Workflow Status | Project-specific workflow status configuration | Deferred |
| P4-SET-04 | Labels | Label management and work-item tagging | Deferred |
| P4-SET-05 | User Management | Move user administration to top-right Settings gear and keep it WA-only | Done / BA confirmed |
| P4-SET-06 | Audit Log | Audit list columns, search by actor/time and governance/settings mutation event coverage | Done / BA confirmed |
| P4-SET-07 | Destructive Confirmations | Confirmation behavior for delete/archive/deactivate/remove actions | Done / BA confirmed |

## 3. P4-SET-01 Workspace Settings

### 3.1 Purpose

Workspace Settings represents the company-level configuration for the single company/workspace used by this MVP. The top-right gear opens this workspace-wide Settings area; it is not the same as the workspace dropdown `Manage Projects` entry.

### 3.2 Access Rules

| Role | View Workspace Settings | Edit Workspace Settings |
|---|---:|---:|
| Workspace Admin | Yes | Yes |
| Project Admin | No | No |
| Project Member | No | No |

Rules:

- Only `workspace_admin` can view and edit Workspace Settings.
- Project Admin can manage assigned Project Settings later in `P4-SET-02`, but cannot open company-level Workspace Settings.
- Project Member cannot access Workspace Settings.

### 3.3 Fields

| Field | Behavior | Notes |
|---|---|---|
| Company Name | Editable by Workspace Admin | Display name for the company/workspace |
| Workspace Slug | Read-only | System identifier; shown for reference, not edited from the mockup |
| Company Scope | Read-only | Shows that this MVP has one company workspace |
| Workspace Admin | Read-only | Internal/dev setup assigns the primary admin account; Workspace Settings only displays it |

### 3.4 Save Behavior

- `Save Changes` is visible only to Workspace Admin.
- Saving Workspace Settings updates company-level settings.
- Saving Workspace Settings creates an audit event with actor, changed fields and timestamp.
- Permission-effect timing remains aligned with RBAC rules: role or membership changes apply on next login; removing a user from company access applies on next page refresh.

### 3.5 Mockup Acceptance

- Workspace Settings screen uses company language, not generic multi-workspace language.
- Workspace slug is read-only.
- Company scope is explicitly single-company.
- Workspace Admin is display-only and comes from internal/dev setup.
- Save button appears only for Workspace Admin.
- Phase 4 docs record Workspace Settings as company-level and WA-only.

## 4. P4-SET-02 Project Settings - Entry Point Decision

Phase 1 already defines Manage Projects create/edit/archive/restore behavior in `Phase 1/08_Manage_Projects_Teams_Users/SRS.md`. Phase 4 must not redefine those CRUD fields or create a second Project Settings surface.

Project Settings will not appear in the top-right gear Settings sidebar.

Approved entry point:

- Open workspace dropdown.
- Click `Manage Projects`.
- Use the `Projects` tab.
- Edit a Project row to manage that Project's settings.

This avoids having two Project Settings locations in the mockup.

### 4.1 Phase 1 Baseline Reused

Phase 1 owns the Project management baseline:

- Phase 1 originally defined Manage page with `Projects`, `Teams` and `Users` tabs.
- The reconciled navigation keeps only Project management under `Manage Projects`; Team and User administration live under the top-right Settings gear.
- Projects tab keeps list/create/edit/archive/restore project behavior.
- Create/Edit Project fields are Project name, Project key, Description, Project owner, Start date and Teams.
- Project key is required and immutable after create.
- Project row actions cover Edit, Archive and Restore.

### 4.2 Phase 4 Additions Only

Phase 4 only clarifies permission/context behavior over the Phase 1 baseline:

- Workspace Admin can use the full Phase 1 Project management behavior.
- Project Admin can edit Project Settings only for assigned managed projects.
- Project Admin can view other projects read-only.
- Project Member does not access Manage Projects or Project Settings.
- Top-right gear remains company/workspace-level only.

## 5. P4-SET-03 Workflow Status - Deferred

Project-specific Workflow Status configuration is moved to Future Backlog.

Reason:

- Current MVP assumes all Projects run Agile.
- Iteration, Release, Milestone and Work Item statuses already have approved default definitions.
- Phase 4 does not need a configurable workflow designer or project-level workflow status CRUD.

Decision:

- Do not add Workflow Status configuration to Workspace Settings.
- Do not add Workflow Status configuration to Project Settings in Phase 4.
- Existing default status behavior remains the baseline for Backlog, Work Item Detail, Iteration Status, Release and Milestone surfaces.

## 6. P4-SET-04 Labels - Deferred

Label management is moved to Future Backlog.

Reason:

- Phase 0-4 mockup does not currently have a required flow for assigning labels to US/DE/Task.
- Backlog and Work Item workflows already use Project, Team, Type, Priority, Schedule/Flow State, Release and Iteration for MVP categorization.
- Adding Label CRUD without a confirmed tagging/filtering workflow would create configuration surface without clear business value.

Decision:

- Do not add Label management to Workspace Settings.
- Do not add Label management to Project Settings in Phase 4.
- Do not add Label field/filter to Backlog or Work Item Detail in Phase 4.
- Revisit labels when there is a concrete need for tagging, cross-cutting grouping, or label-based reporting/filtering.

## 7. P4-SET-05 User Management

User Management is a company/workspace-level administration surface, not a project-management surface.

Approved entry point:

- Open top-right gear.
- Click `User Management`.

Rejected entry point:

- `Workspace dropdown > Manage Projects > Users`

Rules:

- `Manage Projects` keeps only `Projects`; `Teams` is a workspace administration section under the top-right Settings gear.
- User invite, role assignment, status changes, team allocation and company access removal are under Settings > User Management.
- User Management list does not show inline row action buttons such as `Change Role` or `Remove`.
- User Management list columns are Name, Email, Phone number, Role, Status and Last Login.
- Workspace Admin appears in the User Management list like other users.
- Workspace Admin account is assigned by internal/dev setup.
- Clicking Workspace Admin opens User Details in read-only mode.
- Workspace Admin User Details dialog must not allow editing any field and must not show `Save Changes`.
- User Management provides search by name, phone number and email.
- Search bar is placed beside the role filter.
- Clicking a user row opens a User Details dialog.
- User Details dialog allows Workspace Admin to update Name, Role, Status and Phone number.
- Email is displayed read-only in the User Details dialog.
- Workspace Admin is the only role that can access User Management.
- Project Admin and Project Member do not see User Management.
- Role/matrix/project-team allocation changes still take effect on the affected user's next login.
- Removing/deactivating a user from company access takes effect on that user's next page refresh.

## 8. P4-SET-06 Audit Log

Audit Log is a Workspace Admin governance surface for administrative and settings changes only.

Approved entry point:

- Open top-right gear.
- Click `Audit Log`.

Access rules:

- Workspace Admin can view Audit Log.
- Project Admin and Project Member do not see Audit Log.
- Audit Log is read-only.
- No role can edit, delete or manually create audit rows from the mockup.

List columns:

- `Time`
- `Actor`
- `Detail`

Column rules:

- `Time` displays weekday, month, day, year, hour, minute and second.
- `Actor` displays the user who performed the administrative/settings action.
- `Detail` is the only action description column and must be written as a clear business sentence.
- Do not show separate `Action` or `Entity` columns.

Filtering rules:

- Search by actor name.
- Search/filter by time text.
- Filtering is mockup-local; payload and persistence behavior are dev-owned.

Included event scope:

- Workspace Settings save.
- User invitation.
- User basic information update.
- User role update.
- User status update.
- User team/resource allocation update.
- User company access removal/deactivation.
- Role permission matrix save.
- Project administrative changes handled from `Manage Projects`; team administrative changes handled from `Settings > Teams`.

Excluded event scope:

- Work item create/edit/delete.
- User Story, Defect or Task field changes.
- Note, mention, attachment and watcher activity.
- Iteration Status execution updates.
- Sprint/release/milestone execution activity.
- Reporting and portfolio activity; these are Phase 5 or later.

## 9. P4-SET-07 Destructive Confirmations

Destructive Confirmations defines the required guardrail before the system applies a high-impact administrative or deletion action.

Required confirmation pattern:

- User clicks a destructive or high-impact action.
- System opens a confirmation modal before applying the change.
- The modal names the target object clearly.
- The modal explains the main consequence in business language.
- The primary button uses the exact action label, not a generic `OK`.
- The user can cancel without changing data.
- The confirmed action executes only after the modal primary button is clicked.

Actions requiring confirmation:

- Archive Project.
- Restore Project.
- Deactivate Team.
- Restore Team.
- Delete Project.
- Delete work item.
- Delete task.
- Delete iteration/release/milestone/defect.
- Remove user access from the company.
- Deactivate user access.

High-risk confirmation rule:

- `Delete Project` and `Remove User Access` should require typing the target name before the confirm button is enabled.
- Other destructive actions use a clear modal without typed confirmation unless the implementation team decides the action carries equivalent risk.

Dependency blocking rule:

- If business dependencies prevent the action, the modal must not allow confirmation.
- The modal should show the blocking reason in read-only form.
- Examples: project has active teams or active delivery items; release/milestone has linked artifacts; user is the only Workspace Admin.

Audit rule:

- Administrative/settings destructive actions create an Audit Log entry after success.
- Delivery item deletes are not included in the Phase 4 Audit Log because Audit Log is scoped to administrative/settings actions only.

Current mockup coverage:

- `Manage Projects > Projects` uses confirmation modals for Archive Project and Restore Project.
- `Settings > Teams` uses confirmation modals for Deactivate Team and Restore Team.
- `Settings > User Management > User Details` uses a typed confirmation modal for Remove User Access.
- The reusable modal pattern supports typed confirmation for the high-risk actions when those actions are surfaced.

## 10. Open Questions

No open business question remains for the Phase 4.3 BA/mockup baseline. Phase 4.3 is closed for BA/mockup scope; production implementation remains development-owned.
