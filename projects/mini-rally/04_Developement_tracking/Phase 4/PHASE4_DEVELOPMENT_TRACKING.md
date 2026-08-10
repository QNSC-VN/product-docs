# Phase 4 - Development Tracking

## 1. Tracking Information

| Attribute | Value |
|---|---|
| Phase | Phase 4 - Collaboration & Governance |
| Current delivery slice | Feature-by-feature BA handoff |
| Company scope | Single company: `ACME Space Inc.` |
| Overall status | `PHASE 4 BA/MOCKUP READY; DEV NOT STARTED` |
| Production implementation | Not started |
| Last updated | 2026-08-10 |

BA working rule:

- Phase 4 is split into three features and handled one feature at a time.
- Within a feature, complete one task and wait for BA confirmation before the next task.
- Ask BA whenever a business question appears.
- Team Board, configurable Workflow Status, Labels and Notification Preferences remain Future Backlog.

## 2. Phase 4 Features

| Feature | Name | Purpose | BA status | Dev status |
|---|---|---|---|---|
| P4.1 | Notifications | Assignment and Note-mention notification, popup, read state and route to US/DE | Ready | Not started |
| P4.2 | Project Access & Permissions | Workspace Admin authority plus per-Project Admin/Editor/Viewer/No Access | Ready | Not started |
| P4.3 | Settings & Audit | Workspace settings, Users, Workspaces & Projects, Permission Model, Audit and confirmations | Ready | Not started |

## 3. Status Legend

| Status | Meaning |
|---|---|
| `PENDING` | Not started |
| `READY` | BA/SRS/mockup ready for development |
| `IN PROGRESS` | Development in progress |
| `BLOCKED` | Cannot continue without a dependency or decision |
| `DONE` | Implementation, tests and acceptance passed |
| `DEFERRED` | Moved out of the current phase |

## 4. Development Task Plan - P4.1 Notifications

| ID | Module | Task | Deliverable | Dependency | Status |
|---|---|---|---|---|---|
| P4-NOTIF-01 | BA/SRS | Define event scope | US/DE assignment and Note mention only | Phase 1 Work Items | `DONE` |
| P4-NOTIF-02 | Contract | Define notification contract | List, filters, read, popup and target route | P4-NOTIF-01 | `PENDING` |
| P4-NOTIF-03 | Backend | Persist notifications | Recipient isolation, read state and pagination | P4-NOTIF-02 | `PENDING` |
| P4-NOTIF-04 | Backend | Emit assignment event | Assigned user receives one notification | P4-NOTIF-03 | `PENDING` |
| P4-NOTIF-05 | Backend | Emit Note mention event | Mentioned user receives popup/list entry | P4-NOTIF-03 | `PENDING` |
| P4-NOTIF-06 | Frontend | Notification Center | Bell, unread count, filters and read actions | P4-NOTIF-02..05 | `PENDING` |
| P4-NOTIF-07 | Frontend | Route to item | Open related US/DE from card and popup | P4-NOTIF-06 | `PENDING` |
| P4-NOTIF-08 | Security | Permission-aware delivery | Do not expose inaccessible Project/Team items | P4.2 | `PENDING` |
| P4-NOTIF-09 | Verification | Notification tests | Event, recipient, state, route and denied-target tests | P4-NOTIF-01..08 | `PENDING` |

## 5. Development Task Plan - P4.2 Project Access & Permissions

| ID | Module | Task | Deliverable | Dependency | Status |
|---|---|---|---|---|---|
| P4-RBAC-01 | BA/SRS | Define authority model | WA plus independent Admin/Editor/Viewer/No Access per Project | Phase 0-4 access rules | `DONE` |
| P4-RBAC-02 | BA/SRS | Define capabilities | Fixed company/structure and delivery-feature baseline | P4-RBAC-01 | `DONE` |
| P4-RBAC-03 | BA/SRS + Mockup | User-centric access journey | User Details > Project Access | P4-RBAC-02 | `DONE` |
| P4-RBAC-04 | BA/SRS + Mockup | Project-centric access journey | Project > Users & Permissions | P4-RBAC-02 | `DONE` |
| P4-RBAC-05 | BA/SRS + Mockup | Team-creation access journey | Add Team with Admin/Editor assignment | P4-RBAC-02 | `DONE` |
| P4-RBAC-06 | Mockup | Demo access views | WA, Admin and Editor navigation/scope | P4-RBAC-01..05 | `DONE` |
| P4-RBAC-07 | Backend | Enforce Project and Team scope | No cross-Project/Team data leakage | P4-RBAC-02 | `PENDING` |
| P4-RBAC-08 | Backend | Enforce actions | WA structure authority and delivery feature guards | P4-RBAC-02 | `PENDING` |
| P4-RBAC-09 | Frontend | Gate routes, data and controls | Enabled/read-only/hidden/disabled presentation | P4-RBAC-07..08 | `PENDING` |
| P4-RBAC-10 | Verification | Access regression tests | All access levels, synchronization and denied-state coverage | P4-RBAC-01..09 | `PENDING` |

## 6. Development Task Plan - P4.3 Settings & Audit

| ID | Module | Task | Deliverable | Dependency | Status |
|---|---|---|---|---|---|
| P4-SET-01 | BA/SRS + Mockup | Workspace Settings | WA-only company fields and read-only internal WA | P4-RBAC-02 | `DONE` |
| P4-SET-02 | BA/SRS + Mockup | Workspaces & Projects | One Project/Team/access administration entry | P4-RBAC-03..05 | `DONE` |
| P4-SET-03 | BA/SRS + Mockup | Workflow Status | Default Agile statuses only | P4-SET-02 | `DEFERRED` |
| P4-SET-04 | BA/SRS + Mockup | Labels | No active tagging flow | P4-SET-02 | `DEFERRED` |
| P4-SET-05 | BA/SRS + Mockup | Users | Company directory, User Details and Project Access | P4-RBAC-03 | `DONE` |
| P4-SET-06 | BA/SRS + Mockup | Permission Model | Read-only access-level explanation | P4-RBAC-02 | `DONE` |
| P4-SET-07 | BA/SRS + Mockup | Audit Log | WA-only Time, Actor and Detail | P4-SET-01..06 | `DONE` |
| P4-SET-08 | BA/SRS + Mockup | Destructive confirmations | Project/Team/user/access guardrails | P4-SET-02..07 | `DONE` |
| P4-SET-09 | Backend/Frontend | Implement Settings | Persist and authorize approved settings flows | P4-RBAC-07..09 | `PENDING` |
| P4-SET-10 | Verification | Settings/Audit tests | Field, access, confirmation and audit coverage | P4-SET-09 | `PENDING` |

## 7. Current Task Gate

| Feature | BA/SRS | Mockup | Business confirmation | Development |
|---|---:|---:|---:|---:|
| P4.1 Notifications | Complete | Complete | Confirmed | Not started |
| P4.2 Project Access & Permissions | Complete | Complete | Confirmed | Not started |
| P4.3 Settings & Audit | Complete | Complete | Confirmed | Not started |

## 8. Phase 4 Closeout Summary

BA-confirmed scope:

- Notifications are limited to US/DE assignment and Note mentions and route to the related Work Item.
- Workspace Admin is the only company-level authority and is internally assigned.
- Normal users receive Admin, Editor, Viewer or No Access independently per Project.
- Only Workspace Admin manages company users, Projects, Teams, Project access and Team membership.
- Admin manages delivery in assigned Projects with All Teams, while Project structure remains read-only.
- Editor edits approved delivery work only in assigned Teams.
- Viewer is project-wide read-only; No Access Projects are hidden.
- User, Project and Team access journeys share one assignment source.
- Audit Log records administrative/settings actions only.

Phase 4 remains `BA/MOCKUP READY`. Production implementation, persistence, security enforcement and runtime acceptance remain development/QA work.
