# Phase 4 Test Scenarios - Governance and Project Access

Phase 4 validates Notifications, Project Access, Settings and Audit. Database/infrastructure implementation is outside this BA test specification.

## P4-NOT - Notifications

| ID | Priority | Scenario | Steps | Expected result | Status |
|---|---|---|---|---|---|
| P4-NOT-001 | P0 | Open Notification Center | Click top navigation bell | Page opens with unread count and All/Unread/Assigned/Mentions | Not Run |
| P4-NOT-002 | P0 | Assignment notification | Assign a US/DE to another user | Assigned user receives one notification that routes to the same Work Item | Not Run |
| P4-NOT-003 | P0 | Mention notification | Mention a user in a US/DE Note | Mentioned user receives popup/list entry that routes to the same Work Item | Not Run |
| P4-NOT-004 | P0 | Read state | Read one item, then Mark all as read | Item/count states update correctly | Not Run |
| P4-NOT-005 | P1 | Filter categories | Switch the four filters | Results match the selected category | Not Run |
| P4-NOT-006 | P0 | Recipient isolation | Attempt to read another user's notification | No notification or restricted Work Item metadata is exposed | Not Run |
| P4-NOT-007 | P0 | Revoked target access | Revoke Project access, sign in again, then open old notification | Safe Access Denied/Not Found appears without target metadata | Not Run |
| P4-NOT-008 | P1 | Unsupported events | Add generic Note or change status/attachment/due date | No Phase 4 notification is created | Not Run |

## P4-RBAC - Project Access & Permissions

| ID | Priority | Scenario | Steps | Expected result | Status |
|---|---|---|---|---|---|
| P4-RBAC-001 | P0 | Approved access model | Open Permission Model | Only Workspace Admin plus per-Project Admin/Editor are explained; Viewer/selectable No Access and editable role matrix are absent | Not Run |
| P4-RBAC-002 | P0 | WA authority | Switch demo to Workspace Admin and open Settings | All Projects and administration entries/actions are available | Not Run |
| P4-RBAC-003 | P0 | WA is not Project member | Open Project Users & Permissions and Add Existing User | WA is absent from rows and candidates | Not Run |
| P4-RBAC-004 | P0 | Admin assigned Project | Switch demo to Admin | Only assigned Project is visible; All Teams and delivery management are available | Not Run |
| P4-RBAC-005 | P0 | Admin structural read-only | As Admin open Workspaces & Projects > Details/Users & Permissions/Teams | Content is readable; Project/Team/access mutation controls are absent or read-only | Not Run |
| P4-RBAC-006 | P0 | Editor scope | Switch demo to Editor | Only assigned Project/Teams appear; no Users & Permissions; approved delivery edits remain available | Not Run |
| P4-RBAC-007 | P0 | Unassigned Project isolation | Remove the user's assignment, then attempt navigation/direct URL/search | Project is hidden and direct access returns safe denied/not-found state; no No Access row is stored/shown | Not Run |
| P4-RBAC-008 | P0 | Removal clears Team scope | Remove a user's Project assignment | Assignment row and all Team scope for that Project are removed; Project becomes hidden | Not Run |
| P4-RBAC-009 | P0 | Different level per Project | Give same user Admin in A and Editor in B; leave C unassigned | Each Project resolves independently; Project C remains hidden/denied | Not Run |
| P4-RBAC-010 | P0 | Admin All Teams | Set Project access to Admin from either access journey | All Teams is automatic and individual Team selection is unavailable | Not Run |
| P4-RBAC-011 | P0 | Editor Team validation | Set access to Editor with zero then multiple Teams | Save is blocked at zero; one or more active Teams save successfully | Not Run |
| P4-RBAC-012 | P1 | Access effective timing | Change Project access/Team membership and sign in again | New access is applied on next sign-in | Not Run |
| P4-RBAC-013 | P1 | Company disable timing | Disable normal user, then refresh that user's page | Company access is removed on next refresh | Not Run |
| P4-RBAC-014 | P0 | Archived Project | Archive an assigned Project | Delivery mutations are blocked for every access level until WA restores it | Not Run |

## P4-ACCESS - Synchronized Access Journeys

| ID | Priority | Scenario | Steps | Expected result | Status |
|---|---|---|---|---|---|
| P4-ACCESS-001 | P0 | Add from User Details | Users > user > Project Access; add Project and Editor Teams; save | User appears in Project Users & Permissions with same level and Teams | Not Run |
| P4-ACCESS-002 | P0 | Add from Project | Project > Users & Permissions > Add Existing User; choose Admin | User Details gains that Project with Admin and All Teams | Not Run |
| P4-ACCESS-003 | P0 | Change from Project | Change Access Level dropdown to Editor and choose Teams | User Details shows same Editor Teams | Not Run |
| P4-ACCESS-004 | P0 | Remove from Project | Click Remove and confirm | Project assignment row and all Team memberships in that Project are removed; Project becomes hidden/direct access denied | Not Run |
| P4-ACCESS-005 | P0 | Add Team with users | Create Team; select existing users as Admin/Editor | Admin receives All Teams; Editor receives new Team; both access views synchronize | Not Run |
| P4-ACCESS-006 | P1 | Duplicate prevention | Try to add same Project twice to a user or same user twice to a Project | Duplicate assignment is unavailable/rejected | Not Run |

## P4-SET - Settings, Users and Audit

| ID | Priority | Scenario | Steps | Expected result | Status |
|---|---|---|---|---|---|
| P4-SET-001 | P0 | Settings navigation | Compare WA, Admin and Editor demos | Each sees only approved personal/administration entries | Not Run |
| P4-SET-002 | P0 | Workspace fields | Open Workspace Settings as WA | Name editable; Slug, Scope and Workspace Admin read-only | Not Run |
| P4-SET-003 | P0 | Workspace Admin account guard | Open WA from Users | All fields are read-only; no Project membership and no save/remove action | Not Run |
| P4-SET-004 | P0 | Users list/search | Search name/email/phone and filter status | Columns and results match confirmed baseline | Not Run |
| P4-SET-005 | P0 | Normal user detail | Open non-WA user | General and Project Access tabs show approved fields and controls | Not Run |
| P4-SET-006 | P0 | Invite with access | Invite user with initial Project access and review | Review shows Project, level and Teams before Send Invite | Not Run |
| P4-SET-007 | P0 | Project/Team CRUD authority | Compare WA and Admin in Workspaces & Projects | Only WA can mutate Project or Team structure | Not Run |
| P4-SET-008 | P0 | Administrative audit | Save Workspace/user/Project/access/Team change | Audit adds Time, Actor and clear Detail | Not Run |
| P4-SET-009 | P1 | Audit filter | Search by actor and full time text | Matching Time/Actor/Detail rows appear | Not Run |
| P4-SET-010 | P0 | Remove Project user confirmation | Click Remove in Project Users & Permissions | Confirmation appears before the assignment is deleted and the Project becomes hidden/denied | Not Run |
| P4-SET-011 | P0 | High-risk confirmation | Delete Project or remove company user | Exact typed Project key/user name is required | Not Run |
| P4-SET-012 | P1 | Deferred guard | Inspect Settings | Workflow Status, Labels and Notification Preferences are not active | Not Run |

## Phase 4 Smoke Path

1. Verify assignment and mention notifications, read state and Work Item route.
2. Switch to Workspace Admin; review Users, Workspaces & Projects and Permission Model.
3. Add Project access from User Details and verify it in Project Users & Permissions.
4. Add another existing user from the Project and verify User Details.
5. Add a Team with Admin/Editor assignments and verify synchronized access.
6. Switch to Admin; verify delivery access and read-only Project/Team structure.
7. Switch to Editor; verify assigned Project/Team isolation and approved delivery edits.
8. Remove a Project assignment; verify navigation, search and direct-URL isolation.
9. Exercise Project-user removal, destructive confirmation and administrative Audit Log.
