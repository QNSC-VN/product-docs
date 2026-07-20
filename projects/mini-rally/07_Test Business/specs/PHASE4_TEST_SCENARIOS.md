# Phase 4 Test Scenarios - Governance and Administration

Phase 4 validates the BA/FE behavior for Notifications, Roles & Permissions, Workspace/User Settings and Audit. Schema, database and infrastructure verification are outside this document.

## P4-NOT - Notifications

| ID | Priority | Scenario | Steps | Expected result | Status |
|---|---|---|---|---|---|
| P4-NOT-001 | P0 | Open Notification Center | Click the top navigation bell | Notifications page opens with unread count and approved filters | Not Run |
| P4-NOT-002 | P0 | Assignment notification | Assign a US/DE to another user | Assigned user receives an `Assigned` notification that routes to the same Work Item | Not Run |
| P4-NOT-003 | P0 | Mention notification | Mention a user in a US/DE Note | Mentioned user receives a `Mentions` notification that routes to the same Work Item | Not Run |
| P4-NOT-004 | P0 | Read one | Click an unread notification | It becomes read and unread count decreases | Not Run |
| P4-NOT-005 | P0 | Mark all read | Click `Mark all as read` | All visible notifications become read and unread count becomes zero | Not Run |
| P4-NOT-006 | P1 | Filter categories | Switch All/Unread/Assigned/Mentions | Each tab shows only matching notifications | Not Run |
| P4-NOT-007 | P0 | Inaccessible target | Open notification for an item no longer accessible | Safe access-denied/not-found state appears without restricted metadata | Not Run |
| P4-NOT-008 | P1 | Empty state and popup delivery | Open an empty category and trigger an approved notification event | Empty state is clear; one in-app notification/popup is created without duplicate event | Not Run |
| P4-NOT-009 | P1 | Generic Note and duplicate prevention | Create a Note without mention, then repeat the same event | No mention notification is created for generic Note; duplicate delivery is prevented | Not Run |
| P4-NOT-010 | P0 | Recipient isolation | Attempt to open another user's notification target | No notification data or restricted Work Item metadata is exposed | Not Run |

## P4-RBAC - Roles & Permissions

| ID | Priority | Scenario | Steps | Expected result | Status |
|---|---|---|---|---|---|
| P4-RBAC-001 | P0 | Approved role catalog | Open Roles & Permissions | Only Workspace Admin, Project Admin and Project Member are shown | Not Run |
| P4-RBAC-002 | P0 | Matrix states | Inspect screen/action matrix | Each action uses E/R/D/H and has an independent permission code | Not Run |
| P4-RBAC-003 | P0 | Workspace Admin edit flow | Click Edit, change a non-WA cell, save | Non-WA cells unlock only in edit mode; save locks them again; WA baseline stays locked | Not Run |
| P4-RBAC-004 | P0 | Project Admin managed project | Simulate PA in an assigned managed Project | Delivery modules allow confirmed CRUD behavior | Not Run |
| P4-RBAC-005 | P0 | Project Admin other project | Simulate PA in a non-managed Project | Delivery modules are read-only | Not Run |
| P4-RBAC-006 | P0 | Project Member scope | Simulate PM and inspect context/navigation | Only assigned Projects/Teams are visible; no All Teams, Release assignment or admin/planning access | Not Run |
| P4-RBAC-007 | P0 | Access state | Directly open denied and missing routes | Shared Access Denied/Not Found states appear safely | Not Run |
| P4-RBAC-008 | P1 | Phase 5 exclusion | Inspect matrix/navigation scope | Portfolio Release Planning, Release Progress and Reports are not Phase 4 core permissions | Not Run |
| P4-RBAC-009 | P1 | Role/membership effective timing | Change role, team or Project membership, then sign in again | New access takes effect on next login; Company access removal takes effect on next refresh | Not Run |
| P4-RBAC-010 | P0 | Fixed permission rows | Inspect Auth, App Shell, Personal and Notifications rows | Fixed rows remain locked at E and cannot be edited | Not Run |

## P4-SET - Settings, Users and Audit

| ID | Priority | Scenario | Steps | Expected result | Status |
|---|---|---|---|---|---|
| P4-SET-001 | P0 | Workspace Settings entry | Click top-right Settings gear as Workspace Admin | Workspace-wide settings open; Project Settings is not duplicated there | Not Run |
| P4-SET-002 | P0 | Workspace fields | Inspect Workspace Settings | Company Name is editable; Slug, Company Scope and Workspace Admin are read-only | Not Run |
| P4-SET-003 | P0 | Save creates audit row | Change Company Name and save | UI confirms save and Audit Log records actor, time and detail | Not Run |
| P4-SET-004 | P0 | Project Settings single entry | Open Manage Projects and top-right Settings | Project configuration exists only under Manage Projects > Projects | Not Run |
| P4-SET-005 | P0 | User list and search | Open User Management; search name/email/phone and filter role | Columns and search/filter results match the confirmed baseline | Not Run |
| P4-SET-006 | P0 | User detail | Click a non-WA user | Name, Role, Status and Phone are editable; Email is read-only | Not Run |
| P4-SET-007 | P0 | Workspace Admin account guard | Open WA user from list | Detail is read-only and has no save mutation | Not Run |
| P4-SET-008 | P0 | Destructive confirmation | Archive/restore/delete Project or remove User access | Confirm modal appears; high-risk actions require typed target name where specified | Not Run |
| P4-SET-009 | P1 | Audit search | Search Audit Log by actor and time text | Matching Time/Actor/Detail rows appear | Not Run |
| P4-SET-010 | P1 | Deferred settings guard | Inspect top-right Settings | Workflow Status, Labels and Notification Preferences are not active Phase 4 features | Not Run |
| P4-SET-011 | P0 | Team administration entry | Open Manage Projects, then top-right Settings > Teams | Manage Projects has Projects only; Settings > Teams shows the Team list and authorized Create/Edit/Deactivate actions | Pass (runtime smoke 2026-07-19) |
| P4-SET-012 | P1 | Administrative audit coverage | Change a role, user/team membership and Project/Team administration setting | Audit records actor, time and meaningful detail; delivery-item delete is excluded from Admin Audit | Not Run |
| P4-SET-013 | P0 | Remove user access typed confirmation | Remove a user's access from workspace/project/team | Dependency rejection is clear; destructive action requires the specified typed confirmation before save | Not Run |

## Phase 4 smoke path

1. Open Notifications, filter, mark one and all as read, then route to a US/DE.
2. As Workspace Admin, review and edit a non-WA permission cell, save and verify locked state.
3. Simulate Project Admin in managed and non-managed Projects, then simulate Project Member scope.
4. Open Settings > Teams, verify Team list/Create Team, and confirm Manage Projects has no Teams tab.
5. Update Company Name and verify the administrative audit entry.
6. Search/open a user, verify WA account protection and exercise a destructive confirmation.
7. Confirm Portfolio Release Planning, Release Progress, Reports, Workflow Status, Labels and Team/Iteration Boards remain deferred.
