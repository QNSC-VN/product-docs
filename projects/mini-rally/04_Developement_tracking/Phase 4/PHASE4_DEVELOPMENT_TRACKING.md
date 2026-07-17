# Phase 4 - Development Tracking

## 1. Tracking Information

| Attribute | Value |
|---|---|
| Phase | Phase 4 - Collaboration & Governance |
| Current delivery slice | Feature-by-feature BA handoff |
| Company scope | Single-company: `ACME Space Inc.` |
| Overall status | `PHASE 4 BA/MOCKUP READY; DEV NOT STARTED` |
| Production implementation | Not started |
| Last updated | 2026-07-16 |

BA working rule:

- Phase 4 is split into 3 features and will be handled one feature at a time.
- Within a feature, complete one task, then wait for BA confirmation before starting the next task.
- If any business question appears, ask BA before deciding.
- Team Board remains Future Backlog and is not part of Phase 4 core scope.

## 2. Phase 4 Features

| Feature | Name | Purpose | BA status | Dev status |
|---|---|---|---|---|
| P4.1 | Notifications | In-app popup and Notification Center for US/DE assignment and Note mentions | Ready | Not started |
| P4.2 | Roles & Permissions | Three-role RBAC, contextual access, action matrix and safe denied states | Ready | Not started |
| P4.3 | Settings & Audit | Workspace settings, Phase 1 project settings alignment, user management, audit log and destructive confirmations | Ready | Not started |

## 3. Status Legend

| Status | Meaning |
|---|---|
| `PENDING` | Not yet started by BA |
| `IN BA BASELINE` | BA is drafting scope from current roadmap/mockup |
| `READY FOR BA REVIEW` | Draft is complete and waiting for BA confirmation before next task |
| `READY` | BA/mockup/SRS are ready for development |
| `NOT STARTED` | Production code not started |
| `IN PROGRESS` | Development in progress |
| `BLOCKED` | Cannot continue without dependency/decision |
| `DONE` | Code, tests and acceptance criteria passed |
| `DEFERRED` | Moved out of current phase/slice |

## 4. Development Task Plan - P4.1 Notifications

| ID | Module | Task | Deliverable | Dependency | Estimate | Actual | Status |
|---|---|---|---|---|---:|---:|---|
| P4-NOTIF-01 | BA/SRS | Define notification scope and event taxonomy | `01_Notifications/SRS.md` baseline from roadmap and mockup | Phase 1-3 records | 1.0h | 1.0h | `DONE` |
| P4-NOTIF-02 | Contract | Define Notification DTO and API contracts | List, mark read, mark all read, popup and route target contracts | P4-NOTIF-01 | 1.0h | 0h | `PENDING` |
| P4-NOTIF-03 | Backend | Implement notification storage and query | Persist notifications, read/unread state, filters and pagination | P4-NOTIF-02 | 2.0h | 0h | `PENDING` |
| P4-NOTIF-04 | Backend | Emit US/DE assignment events | Create notification when US/DE assignee becomes the current user | P4-NOTIF-03 | 1.5h | 0h | `PENDING` |
| P4-NOTIF-05 | Backend | Emit US/DE Note mention events | Create notification when user is mentioned in a Note on a US/DE | P4-NOTIF-03 | 1.5h | 0h | `PENDING` |
| P4-NOTIF-06 | Frontend | Notification bell and unread badge | Badge count sourced from API/session state | P4-NOTIF-02, P4-NOTIF-03 | 1.0h | 0h | `PENDING` |
| P4-NOTIF-07 | Frontend | Notification center list and filters | All, Unread, Assigned and Mentions filters | P4-NOTIF-03 | 1.5h | 0h | `PENDING` |
| P4-NOTIF-08 | Frontend | Read/unread interactions | Item click marks read; Mark all as read persists | P4-NOTIF-03, P4-NOTIF-07 | 1.0h | 0h | `PENDING` |
| P4-NOTIF-09 | Frontend | Notification route to item | Card and Go to item open the related US/DE Work Item | P4-NOTIF-02, P4-NOTIF-07 | 1.0h | 0h | `PENDING` |
| P4-NOTIF-10 | Frontend | In-app popup | New assignment/mention notification appears as popup for the recipient | P4-NOTIF-02, P4-NOTIF-03 | 1.0h | 0h | `PENDING` |
| P4-NOTIF-11 | Security | Permission-aware notification access | Users only receive/read notifications for accessible workspace/project/team records | P4.2 baseline | 1.0h | 0h | `PENDING` |
| P4-NOTIF-12 | Verification | Notification tests | API, permission, persistence and UI smoke tests | P4-NOTIF-01..11 | 2.0h | 0h | `PENDING` |

## 5. Development Task Plan - P4.2 Roles & Permissions

| ID | Module | Task | Deliverable | Dependency | Estimate | Actual | Status |
|---|---|---|---|---|---:|---:|---|
| P4-RBAC-01 | BA/SRS | Define role model and permission matrix | Three-role baseline: Workspace Admin, Project Admin and Project Member; Project Admin manages assigned Project list and views other Projects read-only | Phase 0-4 access rules | TBD | 2.0h | `DONE` |
| P4-RBAC-02 | BA/SRS | Define effective permission business rules | Three-role-only mockup, contextual role simulation, independent actions, fixed notifications, system/governance rules, effective timing, audit, and safe Access Denied/Not Found states | P4-RBAC-01 | TBD | 3.5h | `DONE` |
| P4-RBAC-03 | Backend | Enforce workspace/project membership | Access-denied behavior and data isolation | P4-RBAC-02 | TBD | 0h | `PENDING` |
| P4-RBAC-04 | Backend | Enforce action-level permissions | Create/edit/delete/archive/restore/read-only guards | P4-RBAC-02 | TBD | 0h | `PENDING` |
| P4-RBAC-05 | Frontend | Gate routes, menus and actions | Disabled/hidden UI states plus 403 page handling | P4-RBAC-02 | TBD | 0h | `PENDING` |
| P4-RBAC-06 | Verification | RBAC regression tests | PA cross-project read-only, PM project/team isolation, unauthorized mutation rejection and context switching | P4-RBAC-01..05 | TBD | 0h | `PENDING` |

## 6. Development Task Plan - P4.3 Settings & Audit

| ID | Module | Task | Deliverable | Dependency | Estimate | Actual | Status |
|---|---|---|---|---|---:|---:|---|
| P4-SET-01 | BA/SRS + Mockup | Workspace Settings | Single-company workspace/company settings, WA-only access, editable company name and readonly slug/admin baseline | P4-RBAC-02 | TBD | 0.5h | `DONE` |
| P4-SET-02 | BA/SRS + Mockup | Project Settings | Reuse Phase 1 Manage > Projects create/edit/archive baseline; document single entry point and Phase 4 role context | P4-SET-01 | TBD | 0.25h | `DONE` |
| P4-SET-03 | BA/SRS + Mockup | Workflow Status | Deferred: project-specific workflow configuration moves to Future Backlog; default Agile statuses remain baseline | P4-SET-02 | TBD | 0.25h | `DEFERRED` |
| P4-SET-04 | BA/SRS + Mockup | Labels | Deferred: label management moves to Future Backlog; no label assignment/filtering flow in Phase 4 | P4-SET-02 | TBD | 0.25h | `DEFERRED` |
| P4-SET-05 | BA/SRS + Mockup | User Management | Move user administration to top-right Settings gear; Manage Projects keeps Projects and Teams only | P4-SET-02 | TBD | 0.75h | `DONE` |
| P4-SET-06 | BA/SRS + Mockup | Audit Log | WA-only administrative/settings audit with Time, Actor and Detail columns | P4-SET-05 | TBD | 0.5h | `DONE` |
| P4-SET-07 | BA/SRS + Mockup | Destructive Confirmations | Confirmation modal for archive/restore/deactivate/delete/remove actions | P4-SET-06 | TBD | 0.5h | `DONE` |

## 7. Current Task Gate

Current active task:

| Task | Status | BA confirmation needed before next task |
|---|---|---|
| P4-NOTIF-01 | Done / BA confirmed | No |
| P4-RBAC-01 | Done / BA confirmed | No |
| P4-RBAC-02 | Done / BA confirmed | No |
| P4-SET-01 | Done / BA confirmed | No |
| P4-SET-02 | Done / BA confirmed | No |
| P4-SET-03 | Deferred - project workflow config moved to Future Backlog | No |
| P4-SET-04 | Deferred - label management moved to Future Backlog | No |
| P4-SET-05 | Done / BA confirmed | No |
| P4-SET-06 | Done / BA confirmed | No |
| P4-SET-07 | Done / BA confirmed | No |
| Phase 4 Closeout | Done - BA/mockup baseline reviewed and ready | No |

## 8. Phase 4 Closeout Summary

Phase 4 is closed for BA, business-rule and mockup scope.

| Area | Closeout result |
|---|---|
| P4.1 Notifications | Ready - assignment and Note mention notifications, approved filters, unread behavior, popup and route to related US/DE verified |
| P4.2 Roles & Permissions | Ready - three-role model, context-based PA/PM behavior, editable E/R/D/H matrix and safe access states verified |
| P4.3 Settings & Audit | Ready - workspace settings, user management, administrative audit and destructive confirmation flows verified |
| Production implementation | Not started - contract, backend, frontend integration and production verification tasks remain `PENDING` |
| Deferred from Phase 4 | Workflow Status, Labels and Team Board remain Future Backlog |
| Phase 5 boundary | Portfolio, top-level Release Tracking and Reports remain Phase 5; extend RBAC after those surfaces are defined |

Closeout verification on 2026-07-17:

- Mockup production build passed.
- Browser smoke test passed for Notifications filters and click-through routing.
- Browser smoke test passed for WA, PA assigned/cross-project read-only and PM restricted navigation/context.
- Browser smoke test passed for Workspace Settings, User Management, role matrix Edit/Save, Audit Log and destructive confirmation modals.
- No runtime console errors were observed during the closeout smoke test.
