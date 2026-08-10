# Plan 3 - Project Access and System States

## Scope And Authority

This is the design-side contract for permission outcomes. It follows the BA source:

`04_Developement_tracking/Phase 4/02_Roles_Permissions/SRS.md`

Figma and frontend visibility are not security. Backend/service guards must enforce the same Project, Team and action scope.

## Access Model

Mini Rally has one company-level authority:

| Authority | Scope |
|---|---|
| Workspace Admin | Full company, Project, Team, user-access and delivery authority; assigned internally |

Every normal user receives one level independently for each Project:

| Access Level | Scope |
|---|---|
| Admin | Assigned Project and All Teams; full delivery management; structure/access read-only |
| Editor | Assigned Project and explicit Teams; edits approved delivery work |
| Viewer | Assigned Project; project-wide read-only; no Team membership |
| No Access | Project hidden and direct access rejected |

Workspace Admin is not a Project member and must not appear in Project Users & Permissions or Team-member candidates.

## UI Outcomes

| Outcome | UI behavior | Figma representation |
|---|---|---|
| Allowed | Control is visible and actionable | Normal component state |
| Read-only | Data is visible; mutation control is absent | Plain value/detail field, not a disabled input |
| Hidden | Project, screen or action does not render | Node hidden; direct route uses Forbidden/Not Found |
| Disabled | Control is visible but temporarily unavailable because of validation, dependency or lifecycle state | Disabled component state |

Disabled is not an assignable access level. It must not be used as a replacement for Viewer or No Access.

## Navigation Presentation

| Demo access | Navigation and scope | Settings gear |
|---|---|---|
| Workspace Admin | All Projects/Teams and all delivery features | Full Administration |
| Admin | Assigned Project, All Teams and delivery planning/execution | My Permissions, Workspaces & Projects, Permission Model |
| Editor | Assigned Project/Teams; Backlog, Iteration Status and Quality | My Permissions and Workspaces & Projects |
| Viewer | Assigned Project delivery in read-only form | My Permissions and read-only Project context |
| No Access | No Project navigation | Personal only |

Normal users may show a contextual Admin/Editor/Viewer badge in the selected Project header. Do not present it as one global account role.

## Project Structure Gating

| Surface / action | WA | Admin | Editor | Viewer | No Access |
|---|---:|---:|---:|---:|---:|
| View assigned Project Details/Teams | Allowed | Read-only | Read-only, scoped | Read-only | Hidden |
| View Project Users & Permissions | Allowed | Read-only | Hidden | Hidden | Hidden |
| Create/Edit/Archive/Delete Project | Allowed | Hidden | Hidden | Hidden | Hidden |
| Add/Edit/Deactivate/Restore Team | Allowed | Hidden | Hidden | Hidden | Hidden |
| Add/change/remove Project user | Allowed | Hidden | Hidden | Hidden | Hidden |

## Pilot Surface Gating - Backlog And Work Item Detail

| Surface / action | WA | Admin | Editor | Viewer | No Access |
|---|---:|---:|---:|---:|---:|
| View rows, search, filter, sort and detail | Allowed | Allowed | Allowed in assigned Teams | Read-only | Hidden |
| Create US/DE | Allowed | Allowed | Allowed in assigned Teams | Hidden | Hidden |
| Edit fields, notes, relations and rank | Allowed | Allowed | Allowed in assigned Teams | Hidden | Hidden |
| Create/Edit/Delete child Task | Allowed | Allowed | Allowed in assigned Teams | Hidden | Hidden |
| Delete US/DE/Task | Allowed | Allowed | Allowed in assigned Teams | Hidden | Hidden |
| Assign to Iteration | Allowed | Allowed | Allowed in assigned Teams | Hidden | Hidden |
| Assign to Release | Allowed | Allowed | Hidden | Hidden | Hidden |

## Access Management Presentation

### User Details

- General and Project Access are separate tabs.
- Each Project row has Project, Access Level and Teams.
- Admin shows All Teams automatically.
- Editor requires Team selection.
- Viewer/No Access show explanatory read-only text instead of Team controls.
- Review Changes summarizes every Project assignment before confirmation.

### Project Users & Permissions

Use exactly:

`User | Status | Access Level | Action`

- Workspace Admin receives editable Access Level dropdown and Remove action.
- Admin receives read-only Access Level and no Remove action.
- Remove opens confirmation before changing access to No Access.

### Add Team

- Workspace Admin may select existing users and set Admin or Editor.
- Admin resolves to All Teams.
- Editor joins the new Team.
- The result must be visible in User Details and Project Users & Permissions.

## Access Denied Vs Not Found

| Scenario | Outcome |
|---|---|
| Known route, insufficient action permission | Access Denied unless existence must be masked |
| Missing or inaccessible sensitive record | Not Found |
| List/search/selector | Return only accessible records |
| Notification target after access revoke | Access Denied or Not Found without target metadata |

Neither state may reveal restricted title, owner, Project, Team or other business data. Both provide a safe navigation action.

## Effective Time

| Change | Effective time | UI consequence |
|---|---|---|
| Project Access Level | Next sign-in | No forced live role switch required |
| Team membership | Next sign-in | New Team scope appears after sign-in |
| Company disable/removal | Next refresh | Do not restore company data; route to sign-in or denied state |

## System States

| State | Component | Recovery |
|---|---|---|
| Loading | Table Skeleton / Skeleton Row | None |
| Empty | System State `Empty` | Clear filters or primary create action when authorized |
| Error | System State `Error` | Retry while preserving query state |
| Forbidden | System State `Forbidden` | Safe navigation |
| Not Found | System State `Not Found` | Safe navigation |
| Destructive confirmation | Dialog `Destructive Confirmation` | Cancel or exact action confirmation |

## Current Design Decisions

- Permission Model is read-only; no editable E/R/D/H role matrix.
- Workspace Admin is the only account with structural administration.
- Admin is not allowed to Create/Edit Project or Add/Edit Team.
- Access in one Project never creates read-only access to another Project.
- Editor has no All Teams option.
- Viewer has no Team membership.
- Internal TypeScript names retained for demo compatibility are not product-facing role definitions.

## Not Decided Here

- API payload and persistence shape.
- Database schema or policy-engine implementation.
- Production authorization proof.
- Audit retention/export policy.
