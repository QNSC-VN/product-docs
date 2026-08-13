# Traceability Matrix - Phase 0, 1, 2, 3, 4

This matrix links business scope to test coverage and source documents.

## Phase 0 traceability

| Module | Source | Key business requirement | Test coverage | Out-of-scope / note |
|---|---|---|---|---|
| Authentication | `Phase 0/02_Authentication/SRS.md` | Microsoft SSO entry/callback, app session, logout, return URL, protected-route session guard | `P0-AUTH-*`, `E2E-001` | Local email/password, forgot/reset password and change-password are Future Backlog unless BA reopens local-auth scope. |
| App Shell | `Phase 0/01_App_Shell/SRS.md` | Protected layout, access-aware Project/Team navigation, deep link and safe denied/error states | `P0-SHELL-*`, `E2E-008`, `P4-RBAC-*` | Navigation resolves Workspace authority plus per-Project access. |
| Workspace Context | `Phase 0/03_Workspace/SRS.md` | Fixed Workspace, no Workspace create/switch, Workspace/Project/Team tree, Workspace name edit/audit | `P0-WS-*`, `P0-SHELL-004`, `E2E-001` | Workspace CRUD/switch is `N/A` for single-workspace MVP. |
| Project Management | `Phase 0/04_Project/SRS.md` | WA-only Project CRUD, accessible Project list, key validation and safe scope isolation | `P0-PRJ-*`, `E2E-001`, `P4-RBAC-*` | Current administration journey is Phase 1 `Workspaces & Projects`. |

## Phase 1 traceability

| Module | Source | Key business requirement | Test coverage | Out-of-scope / note |
|---|---|---|---|---|
| Workspaces & Projects | `Phase 1/08_Manage_Projects_Teams_Users/SRS.md` | One Workspace/Project/Team tree; WA-only Project/Team/access administration; synchronized User/Project/Team assignment journeys | `P1-MANAGE-*`, `P4-ACCESS-*`, `E2E-002` | Admin/Editor receive scoped read-only structure. |
| Backlog List | `Phase 1/01_Backlog_Work_Item_List/SRS.md` | Backlog lists Story/Defect only by Project/Team context | `P1-BL-*`, `E2E-003`, `E2E-004` | Task, Feature, Epic are not independent backlog items in Phase 1. |
| Work Item Create | `Phase 1/02_Work_Item_Create/SRS.md` | Quick create and create-with-details for Story/Defect | `P1-CREATE-*`, `E2E-003`, `E2E-004` | Feature/Epic/Initiative create is deferred. |
| Work Item Detail | `Phase 1/03_Work_Item_Detail/SRS.md` | Header, details, sidebar fields, validation, read-only | `P1-WID-*`, `E2E-003` | Advanced project change rules may be disabled if not ready. |
| Task Management | `Phase 1/04_Task_Management/SRS.md` | Task as child of Work Item, task table/detail, totals | `P1-TASK-*`, `E2E-005` | Task is not a standalone Backlog item. |
| Time Tracking | `Phase 1/05_Time_Tracking/SRS.md` | Estimate, To Do and Actual persistence | `P1-TIME-*`, `E2E-005` | Phase 1 Actual is manual, not timesheet aggregation. |
| Content/Attachments | `Phase 1/06_Content_Attachments/SRS.md` | Description, Notes, Release Notes, upload/list/delete | `P1-CONTENT-*`, `P1-ATT-*`, `E2E-003` | Attachment preview/versioning is deferred. |
| Activity Log | `Phase 1/07_Activity_Log/SRS.md` | Work Item/Task revision history and mutation events | `P1-ACT-*`, `E2E-003`, `E2E-005` | Full admin audit screen is deferred. |

## Phase 2 traceability

| Module | Source | Key business requirement | Test coverage | Out-of-scope / note |
|---|---|---|---|---|
| Global Project/Team Context | `Phase 2/PHASE2_DEVELOPMENT_TRACKING.md`, `PHASE2_MOCKUP_CHECKLIST.md` | Backlog, Timeboxes and Iteration Status all respect selected Project/Team | `P2-CTX-*`, `E2E-008` | `All Teams` is allowed; permission-specific restrictions deferred. |
| Backlog Enhancement | `Phase 2/01_Backlog_Enhancement/SRS.md` | Search, Manage Filters, inline edit, bulk assignment, rank reorder, Iteration field | `P2-BL-*`, `E2E-006` | Saved views can follow after filter/list contract stabilizes. |
| Timeboxes / Iterations | `Phase 2/02_Iterations/SRS.md` | Create/list/detail Iterations, Project/Team defaulting, assignment options | `P2-IT-*`, `E2E-006` | Release/Milestone options hidden/deferred to Phase 3. |
| Iteration Status | `Phase 2/03_Iteration_Status/SRS.md` | Selector, shared US/DE list, active child Task metric, Plan/Task/To Do Totals, Add Item, detail route | `P2-IS-*`, `E2E-006`, `E2E-007`, lifecycle reconciliation | Team Status is Phase 3; Iteration Status Board is Future Backlog. |

## Phase 3 traceability

| Module | Source | Key business requirement | Test coverage | Out-of-scope / note |
|---|---|---|---|---|
| Team Status | `Phase 3/01_Team_Status/SRS.md` | Member-grouped task dashboard, capacity/task inline edit, parent Story/Defect roll-up | `P3-TS-*`, `E2E-011`, `E2E-012` | Team Board, board drag/drop and WIP limits are Future Backlog. |
| Release Management | `Phase 3/02_Release_Management/SRS.md` | Release dashboard/detail, zero/one Release per Story/Defect, artifacts, user-managed readiness | `P3-REL-*`, `E2E-013` | Release Progress belongs to `Portfolio > Release Tracking`, not Phase 3 list/detail. |
| Milestones | `Phase 3/03_Milestones/SRS.md` | Multi-Project/Team Milestones, independent many-to-many Release links, manual dates without Release/derived dates with Release, zero/many Work Item Milestones and Story/Defect artifacts | `P3-MS-*`, `E2E-014` | No readiness checklist or artifact upload/link objects in Phase 3.3. |
| Quality / Defect | `Phase 3/04_Quality_Defect/SRS.md` | Quality Defect dashboard, shared Backlog Defect source, create/edit/detail, state flow, Fixed In Build | `P3-QA-*`, `E2E-015` | Delete, reopen and executable bulk actions are deferred/future. |
| Future Team Board guard | `Future_Backlog/01_Team_Board.md` | Team Board is preserved only as optional future backlog | `P3-TS-015`, `E2E-010`, `E2E-016` | Missing Team Board implementation must not fail Phase 3. |
| Future Iteration Status Board guard | `Future_Backlog/03_Iteration_Status_Board.md` | Iteration Status remains List-only in Phase 0-4 | `P2-IS-028`, `E2E-016` | No Board toggle/drag/drop requirement. |
| Release Planning guard | `Future_Backlog/02_Release_Planning.md` | Release Planning remains Future Backlog and is separate from active Release Tracking | `P3-REL-016`, `E2E-016` | No Release Progress in Phase 3 Timeboxes Release list/detail. |

## Phase 4 traceability

| Module | Source | Key business requirement | Test coverage | Out-of-scope / note |
|---|---|---|---|---|
| Notifications | `Phase 4/01_Notifications/SRS.md` | Assignment/mention notifications, filters, read state and safe Work Item routing | `P4-NOT-*` | Notification preferences are deferred. |
| Project Access & Permissions | `Phase 4/02_Roles_Permissions/SRS.md` | WA authority; Admin/Editor independently per Project; No Access is the implicit hidden state; Team scope and fixed capabilities | `P4-RBAC-*`, `P4-ACCESS-*` | No editable custom role matrix. |
| Settings & Audit | `Phase 4/03_Settings_Audit/SRS.md` | Workspace/Users/Workspaces & Projects/Permission Model, synchronized access, confirmations and administrative audit | `P4-SET-*`, `P4-ACCESS-*` | Workflow Status configuration and Labels are deferred. |

## Cross-phase critical chains

| Chain | Covered by | Why it matters |
|---|---|---|
| Auth -> fixed Company -> Project create | `E2E-001` | Confirms Phase 0 usable foundation. |
| Project -> Team -> User Access -> Backlog | `E2E-002`, `P4-ACCESS-*`, `E2E-003` | Confirms WA setup is synchronized before delivery work begins. |
| Backlog Story/Defect -> Detail -> Task/Time/Activity | `E2E-003`, `E2E-004`, `E2E-005` | Confirms core work item management. |
| Backlog item -> Iteration assignment -> Iteration Status | `E2E-006` | Confirms Phase 2 source-of-truth design. |
| Iteration Status Add Item -> Backlog visibility | `E2E-007` | Confirms direct execution flow still creates normal Backlog item. |
| Context switch isolation | `E2E-008` | Prevents cross-project/team data leakage. |
| Per-Project access isolation | `E2E-008`, `E2E-009`, `P4-RBAC-*` | Confirms one Project's Admin/Editor access never leaks into another Project. |
| Deferred scope guard | `E2E-010` | Prevents Phase 3 scope from blocking Phase 2 acceptance. |
| Team Status task roll-up | `E2E-011`, `E2E-012` | Confirms task completion updates parent Work Item and Iteration status without removing manual control. |
| Release artifact assignment | `E2E-013` | Confirms Release uses existing Story/Defect work items and one active Release assignment. |
| Milestone artifact assignment | `E2E-014` | Confirms Milestone artifacts are assigned Story/Defect work items independent from Release assignment. |
| Quality Defect lifecycle | `E2E-015` | Confirms Quality and Backlog Defect share one work item source. |
| Future Backlog guard | `E2E-016` | Prevents Team Board from becoming a hidden Phase 3/4 blocker. |
| Full reconciled Agile lifecycle | `E2E_AGILE_LIFECYCLE_RECONCILIATION.md` | Proves Release/Milestone, Iteration, Backlog, Tasks, roll-up, metrics and cross-screen status as one chain. |

## Coverage summary

| Phase | Covered business areas | Main open verification dependency |
|---|---|---|
| Phase 0 | Auth, app shell, fixed Company, Project CRUD | Environment/account availability and permission-role test users. |
| Phase 1 | Manage, Backlog, Create, Detail, Task, Time, Content, Attachment, Activity | Seed data and storage/email config for attachments/invitations. |
| Phase 2 | Context filter, Backlog Enhancement, Iterations, Iteration Status | Iteration data and Work Item assignment API/runtime availability. |
| Phase 3 | Team Status, Release Management, Milestones, Quality/Defect | Phase 2 Work Item/Iteration data plus Release/Milestone/Defect test data. |
| Phase 4 | Notifications, Project Access, synchronized administration journeys, Settings and Audit | WA plus normal users with Admin/Editor across multiple Projects and Teams, plus an unassigned user to confirm implicit No Access. |
