# Phase 4 DevInt Audit Index

Date: 2026-07-24
Environment: `https://rally-dev.qnsc.vn/`
Baseline: Phase 4 SRS + mockup + confirmed Phase 4 tracking/checklist
Tracker: `DEVINT_PHASE_0_4_AUDIT_TRACKER.xlsx`

## Scope

Phase 4 is audited as three approved features:

1. P4.1 Notifications.
2. P4.2 Roles & Permissions.
3. P4.3 Settings & Audit.

Workflow Status, Labels and Team Board remain Future Backlog. Portfolio, Release Planning/Tracking and Reports remain Phase 5.

## Current Result

| Status | Checkpoints |
|---|---:|
| Retest Passed | 2 |
| Partial Match | 2 |
| Gap Confirmed | 6 |
| Blocked | 5 |
| Total | 15 |

All Phase 4 classifications and correction directions were BA confirmed on 2026-07-24. SRS/mockup reconciliation proceeds by approved alignment package.

## Checkpoint Trace

| Checkpoint | Result | Main observation | Gap/dependency |
|---|---|---|---|
| P4-NOTIF-01 | Retest Passed | Bell popup and `View all` route work | None |
| P4-NOTIF-02 | Partial Match | Four filters exist; no rows to verify count/cards/results | GAP-P4-NOTIF-001 |
| P4-NOTIF-03 | Blocked | No row exists for read/mark-all persistence | GAP-P4-NOTIF-002 |
| P4-NOTIF-04 | Blocked | No safe sender/recipient pair | GAP-P4-NOTIF-003 |
| P4-RBAC-01 | Gap Confirmed | DevInt uses legacy/persona roles and entity/action toggles | GAP-P1-USER-004 |
| P4-RBAC-02 | Gap Confirmed | Workspace Admin detail is editable and has Save | GAP-P4-RBAC-002 |
| P4-RBAC-03 | Blocked | Project Admin account/assignment data unavailable | GAP-P4-RBAC-003 |
| P4-RBAC-04 | Blocked | Project Member account/assignment data unavailable | GAP-P4-RBAC-003 |
| P4-RBAC-05 | Blocked | Cannot exercise denied route/action as Workspace Admin | GAP-P4-RBAC-003 |
| P4-SET-01 | Partial Match | Core Workspace fields exist; single-company scope missing | GAP-P4-SET-001 |
| P4-SET-02 | Gap Confirmed | User fields/roles/detail rules mismatch | GAP-P4-SET-002 |
| P4-SET-03 | Retest Passed | Project Settings has one entry point via Manage Projects | None |
| P4-SET-04 | Gap Confirmed | Columns/filter work; event scope/detail mismatch | GAP-P4-SET-003 |
| P4-SET-05 | Gap Confirmed | Team/User confirmation flows absent or unreachable | GAP-P4-SET-004 |
| P4-SET-06 | Gap Confirmed | Notification Preferences placeholder is outside approved Phase 4 scope | GAP-P4-SET-005 |

## Key Business Mismatches

### Roles & Permissions

- Approved roles: `workspace_admin`, `project_admin`, `project_member`.
- Approved permission representation: Phase 0–4 screen/action matrix with `E`, `R`, `D`, `H`.
- DevInt currently exposes Scrum Master, Product Owner, Developer, QA Engineer, Project Viewer, Workspace Member and other legacy/persona roles.
- Workspace Admin must remain the locked system-owner baseline.
- Workspace Admin user detail must be fully read-only and must not expose Save.

### User Management

- Approved list columns: Name, Email, Phone number, Role, Status, Last Login.
- DevInt replaces Phone number with Teams.
- Unsupported/blank roles are still present.
- Non-admin detail must support Name, Phone number, Role and Status; Email remains read-only.
- Remove User Access must exist and use typed confirmation.

### Audit Log

- Approved columns: Time, Actor, Detail.
- Actor/date filtering works in DevInt.
- Phase 4 Audit Log is limited to administrative/settings changes.
- DevInt currently includes authentication/session events and technical identifiers.
- Detail must be rendered as a clear business sentence with enough before/after context.

## Blocked Test Data

Phase 4 cannot be fully closed until the environment provides:

- Controlled assignment and Note-mention notifications for the audit user.
- A dedicated notification sender/recipient pair.
- One `project_admin` account with an assigned managed Project and one unassigned Project.
- One `project_member` account with explicit Project and Team assignments.

No cross-user mention, role mutation, Workspace mutation or destructive action was performed during this audit.

## Evidence

- `evidence/phase4_2026-07-24/P4-NOTIF-dev-direct.png`
- `evidence/phase4_2026-07-24/P4-NOTIF-mock.png`
- `evidence/phase4_2026-07-24/P4-RBAC-dev.png`
- `evidence/phase4_2026-07-24/P4-RBAC-mock.png`
- `evidence/phase4_2026-07-24/P4-AUDIT-dev.png`
- `evidence/phase4_2026-07-24/P4-AUDIT-mock.png`
