# Traceability Matrix - Phase 0, 1, 2, 3

This matrix links business scope to test coverage and source documents.

## Phase 0 traceability

| Module | Source | Key business requirement | Test coverage | Out-of-scope / note |
|---|---|---|---|---|
| Authentication | `Phase 0/02_Authentication/SRS.md` | Login, session, logout, return URL, neutral auth errors | `P0-AUTH-*`, `E2E-001` | Forgot/reset may be deferred in short Phase 0 delivery but remains documented. |
| App Shell | `Phase 0/01_App_Shell/SRS.md` | Protected layout, route metadata, deep link, 403/404/error states | `P0-SHELL-*`, `E2E-008` | Permission-specific nav depends on role data. |
| Company Context | `Phase 0/03_Workspace/SRS.md` | Fixed Company, no Workspace create/switch, Project/Team tree | `P0-COMPANY-*`, `P0-SHELL-004`, `E2E-001` | Workspace CRUD/switch is `N/A` for single-company MVP. |
| Project Management | `Phase 0/04_Project/SRS.md` | Project list/create/edit/archive/restore, key validation, owner/member rules | `P0-PRJ-*`, `E2E-001` | Project overview and project member screen are deferred unless separately scoped. |

## Phase 1 traceability

| Module | Source | Key business requirement | Test coverage | Out-of-scope / note |
|---|---|---|---|---|
| Manage Projects/Teams/Users | `Phase 1/08_Manage_Projects_Teams_Users/SRS.md` | Manage tabs, Team create/edit, User invite, team membership access | `P1-MANAGE-*`, `E2E-002` | Team capacity/velocity fields are not in Phase 1 create/edit. |
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
| Iteration Status | `Phase 2/03_Iteration_Status/SRS.md` | Selector, metrics, assigned Work Item list, Add Item, detail route | `P2-IS-*`, `E2E-006`, `E2E-007` | Team Status is Phase 3; Team Board is Future Backlog. |

## Phase 3 traceability

| Module | Source | Key business requirement | Test coverage | Out-of-scope / note |
|---|---|---|---|---|
| Team Status | `Phase 3/01_Team_Status/SRS.md` | Member-grouped task dashboard, capacity/task inline edit, parent Story/Defect roll-up | `P3-TS-*`, `E2E-011`, `E2E-012` | Team Board, board drag/drop and WIP limits are Future Backlog. |
| Release Management | `Phase 3/02_Release_Management/SRS.md` | Release dashboard/detail, one active Release per Story/Defect, artifacts, user-managed readiness | `P3-REL-*`, `E2E-013` | System-calculated readiness and advanced release governance are not Phase 3.2. |
| Milestones | `Phase 3/03_Milestones/SRS.md` | Milestone dashboard/detail, multi-project/team/release links, Story/Defect artifacts | `P3-MS-*`, `E2E-014` | No readiness checklist or artifact upload/link objects in Phase 3.3. |
| Quality / Defect | `Phase 3/04_Quality_Defect/SRS.md` | Quality Defect dashboard, shared Backlog Defect source, create/edit/detail, state flow, Fixed In Build | `P3-QA-*`, `E2E-015` | Delete, reopen and executable bulk actions are deferred/future. |
| Future Team Board guard | `Future_Backlog/01_Team_Board.md` | Team Board is preserved only as optional future backlog | `P3-TS-015`, `E2E-010`, `E2E-016` | Missing Team Board implementation must not fail Phase 3. |

## Cross-phase critical chains

| Chain | Covered by | Why it matters |
|---|---|---|
| Auth -> fixed Company -> Project create | `E2E-001` | Confirms Phase 0 usable foundation. |
| Project -> Team -> User -> Backlog | `E2E-002`, `E2E-003` | Confirms Phase 1 starts from valid organization setup. |
| Backlog Story/Defect -> Detail -> Task/Time/Activity | `E2E-003`, `E2E-004`, `E2E-005` | Confirms core work item management. |
| Backlog item -> Iteration assignment -> Iteration Status | `E2E-006` | Confirms Phase 2 source-of-truth design. |
| Iteration Status Add Item -> Backlog visibility | `E2E-007` | Confirms direct execution flow still creates normal Backlog item. |
| Context switch isolation | `E2E-008` | Prevents cross-project/team data leakage. |
| Viewer/read-only enforcement | `E2E-009` | Confirms UI gating plus backend permission enforcement. |
| Deferred scope guard | `E2E-010` | Prevents Phase 3 scope from blocking Phase 2 acceptance. |
| Team Status task roll-up | `E2E-011`, `E2E-012` | Confirms task completion updates parent Work Item and Iteration status without removing manual control. |
| Release artifact assignment | `E2E-013` | Confirms Release uses existing Story/Defect work items and one active Release assignment. |
| Milestone artifact assignment | `E2E-014` | Confirms Milestone artifacts are assigned Story/Defect work items independent from Release assignment. |
| Quality Defect lifecycle | `E2E-015` | Confirms Quality and Backlog Defect share one work item source. |
| Future Backlog guard | `E2E-016` | Prevents Team Board from becoming a hidden Phase 3/4 blocker. |

## Coverage summary

| Phase | Covered business areas | Main open verification dependency |
|---|---|---|
| Phase 0 | Auth, app shell, fixed Company, Project CRUD | Environment/account availability and permission-role test users. |
| Phase 1 | Manage, Backlog, Create, Detail, Task, Time, Content, Attachment, Activity | Seed data and storage/email config for attachments/invitations. |
| Phase 2 | Context filter, Backlog Enhancement, Iterations, Iteration Status | Iteration data and Work Item assignment API/runtime availability. |
| Phase 3 | Team Status, Release Management, Milestones, Quality/Defect | Phase 2 Work Item/Iteration data plus Release/Milestone/Defect test data. |
