# Phase 0 Test Scenarios - Foundation

Phase 0 validates the base platform: authentication, app shell, fixed Company context and Project Management.

## P0-AUTH - Authentication

| ID | Priority | Scenario | Steps | Expected result | Status |
|---|---|---|---|---|---|
| P0-AUTH-001 | P0 | Login with active admin | Open `/login`; enter valid Workspace Admin credentials; submit | User lands on Home or last valid protected route; session is created; app shell visible | Not Run |
| P0-AUTH-002 | P0 | Invalid password does not expose account existence | Enter existing email with wrong password | Generic error only; no message proving whether account exists | Not Run |
| P0-AUTH-003 | P0 | Email normalization | Login with uppercase email and leading/trailing spaces | Login succeeds for valid account after trim/lowercase normalization | Not Run |
| P0-AUTH-004 | P0 | Refresh protected route keeps session | Login; open `/projects`; refresh browser | User remains on `/projects`; no redirect to login | Not Run |
| P0-AUTH-005 | P0 | Logout revokes current session | Login; logout from user menu; access `/projects` directly | User returns to login; protected route requires login | Not Run |
| P0-AUTH-006 | P1 | Return URL after anonymous protected access | Logout; open `/projects`; login successfully | System redirects back to original protected URL if return URL is safe | Not Run |
| P0-AUTH-007 | P1 | Suspended/inactive user cannot access | Login or refresh session with suspended/inactive account | Access rejected; no valid protected session | Not Run |
| P0-AUTH-008 | P1 | Forgot password neutral response | Submit forgot password for existing and non-existing email | Same neutral response for both cases | Not Run |
| P0-AUTH-009 | P1 | Reset token one-time and expiry | Use reset token once; retry; test expired token | First valid use works; reused/expired token is rejected | Not Run |
| P0-AUTH-010 | P1 | No sensitive auth data in client logs | Login/logout and inspect console/network-visible app logs | No raw password, raw token, password hash or session hash is logged | Not Run |

## P0-SHELL - App Shell and Navigation

| ID | Priority | Scenario | Steps | Expected result | Status |
|---|---|---|---|---|---|
| P0-SHELL-001 | P0 | Protected app shell renders after login | Login successfully | Top navigation, user menu and main content render | Not Run |
| P0-SHELL-002 | P0 | Active navigation follows URL | Navigate Home, Projects, Backlog if available; use browser back/forward | Active menu and breadcrumb match URL | Not Run |
| P0-SHELL-003 | P0 | Deep link and refresh | Open a protected deep URL directly after login; refresh | Same page reloads with correct context | Not Run |
| P0-SHELL-004 | P0 | Fixed Company is shown as root context | Open context selector | Company root appears before Project/Team; no workspace switcher | Not Run |
| P0-SHELL-005 | P0 | Project context switch invalidates data | Select Project A; observe page data; switch to Project B | Scoped pages reload and do not show stale Project A data | Not Run |
| P0-SHELL-006 | P1 | Team hierarchy display | Open context selector for Project with teams | Teams are nested/available under valid Project context | Not Run |
| P0-SHELL-007 | P1 | 404 page | Open unknown route | Not Found page renders while shell remains stable if authenticated | Not Run |
| P0-SHELL-008 | P1 | 403/access denied | Open route without permission as restricted user | Access Denied page is shown; sensitive data not rendered | Not Run |
| P0-SHELL-009 | P1 | Generic page error containment | Trigger or simulate child page error | Error boundary affects page outlet only; top nav remains usable | Not Run |
| P0-SHELL-010 | P2 | Slow navigation/loading state | Throttle network or use slow route | Loading/skeleton visible; duplicate clicks/race are handled | Not Run |

## P0-COMPANY - Fixed Company Context and Membership

| ID | Priority | Scenario | Steps | Expected result | Status |
|---|---|---|---|---|---|
| P0-COMPANY-001 | P0 | Single-company resolution | Login as valid user | App resolves provisioned Company from server/session, not from user-created workspace selection | Not Run |
| P0-COMPANY-002 | P0 | No Workspace create/switch in MVP | Inspect app shell/settings/project context | No self-service Workspace create, archive or switch control is available | Not Run |
| P0-COMPANY-003 | P0 | Company tree respects permission | Login as user with limited access | Only accessible Project/Team entries are visible | Not Run |
| P0-COMPANY-004 | P1 | Invite existing/new member | Admin invites member by email and role | Invitation is created; accepted user becomes active member | Not Run |
| P0-COMPANY-005 | P1 | Resend/cancel/expired invitation | Resend/cancel invitation; try old token | Old token cannot be used | Not Run |
| P0-COMPANY-006 | P1 | Suspend member immediately blocks access | Suspend active user; user refreshes or calls API | UI and direct API access are blocked immediately | Not Run |
| P0-COMPANY-007 | P1 | Cannot remove sole active Admin | Attempt to suspend/remove only active Workspace Admin | Action is rejected with clear error | Not Run |
| P0-COMPANY-008 | P1 | Member role/status audit | Change role/status/settings | Audit/activity event is created | Not Run |

## P0-PROJECT - Project Management

| ID | Priority | Scenario | Steps | Expected result | Status |
|---|---|---|---|---|---|
| P0-PRJ-001 | P0 | Project list loads accessible projects | Open `/projects` | List shows only projects user can access | Not Run |
| P0-PRJ-002 | P0 | Create Project happy path | Create project with unique name/key/owner/team link if available | Project is created; settings and owner membership are created atomically | Not Run |
| P0-PRJ-003 | P0 | Duplicate project key rejected | Create project with existing key | Validation rejects duplicate key | Not Run |
| P0-PRJ-004 | P0 | Invalid key rejected | Create project with key below allowed length or invalid chars | Field-level or form validation rejects input | Not Run |
| P0-PRJ-005 | P0 | Project key immutable | Edit an existing project | Key is read-only or cannot be changed | Not Run |
| P0-PRJ-006 | P1 | Search project | Search by project name/key | Matching projects show; non-matching hidden | Not Run |
| P0-PRJ-007 | P1 | Status filter active/archived | Filter active and archived | Active/archived results match state; empty state appears when no result | Not Run |
| P0-PRJ-008 | P1 | Pagination and aggregates | Verify list page size and member/team counts | Pagination works; `memberCount` and `teamCount` are accurate | Not Run |
| P0-PRJ-009 | P1 | Archive project | Archive project with permission | Project becomes read-only and hidden from active list by default | Not Run |
| P0-PRJ-010 | P1 | Restore project permission | Restore archived project as authorized/unauthorized user | Authorized succeeds; unauthorized gets 403/rejection | Not Run |
| P0-PRJ-011 | P1 | Project owner must be active member | Create/update owner with inactive/non-member user | Action is rejected | Not Run |
| P0-PRJ-012 | P1 | Project mutation audit | Create/update/archive/restore project | Audit event is recorded | Not Run |

## Phase 0 smoke path

Use this as the minimal BA smoke after deployment:

1. Login with Workspace Admin.
2. Confirm fixed Company context and no Workspace create/switch.
3. Open Project list.
4. Create a Project with unique key.
5. Search the created Project.
6. Attempt duplicate key and invalid key.
7. Edit project and confirm key is immutable.
8. Logout and verify protected route redirects to login.
