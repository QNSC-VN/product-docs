# Historical DevInt Audit Evidence — Phase 0 to Phase 4

> **Current source:** The active tracker is `07_Testing Plan/PHASE_0_6_AUDIT_TRACKER.xlsx`; the only current DEV handoff is `07_Testing Plan/03_Retest/DEV_HANDOFF_RETEST_PHASE_0_6.md`. This folder now retains detailed notes and screenshots only.

> **Access-model update:** Current acceptance uses Workspace Admin plus per-Project `Admin`/`Editor`. A user without a Project assignment may be described as No Access, but Viewer and selectable No Access permissions are not in the current scope.

## Objective

Audit `https://rally-dev.qnsc.vn/` screen by screen and function by function against the confirmed Mini Rally business rules, SRS, test scenarios and FE mockup for Phase 0–4.

This workstream is separate from the completed mockup reconciliation. A feature is not considered aligned merely because a similar control exists in DevInt.

## Working rule

1. Audit one screen and one bounded function group at a time.
2. Record expected business behavior, mockup behavior and DevInt actual behavior with evidence.
3. Classify the result as Match, Partial Match, Gap or Blocked.
4. Present each gap and proposed correction to BA.
5. Do not close the checkpoint or move to the next screen until BA confirms both the gap and correction direction.
6. Retest confirmed fixes and keep the original gap history.

## Scope

- Phase 0: Authentication, App Shell, workspace/project/team context and Project management.
- Phase 1: Settings Teams/User Management, Backlog, Work Item create/detail, Task, Time, Content/Attachments and Activity Log.
- Phase 2: Backlog enhancements, Iterations and Iteration Status.
- Phase 3: Team Status, Release Management, Milestones and Quality/Defect.
- Phase 4: Notifications, Roles & Permissions, Workspace/Team/User Settings, Audit Log and administrative confirmation guards.

Out of scope unless BA explicitly expands it: Phase 4 Workflow Status, Labels and Team Board (Future Backlog), Phase 5 Portfolio/Release Planning/Reports, database/schema/infra changes and production deployment.

## Evidence and safety

- Use account `hieuvbm@qnsc.vn`; never store a password or session token in this folder or tracker.
- Use unique test-data names prefixed with `DEVINT-AUDIT` when create/edit testing is needed.
- Avoid destructive cleanup, role changes or workspace-wide settings mutation until BA approves the specific test.
- Store the current full-regression screenshots under `evidence/retest_2026-07-24/`. Older phase/checkpoint evidence remains historical.
- Store detailed walkthrough notes under `notes/` when a tracker cell is not sufficient.

## Tracker

The historical Phase 0–4 trackers and completed run plans were removed after consolidation into `07_Testing Plan/PHASE_0_6_AUDIT_TRACKER.xlsx`.

## Dev handoff

Use only `07_Testing Plan/03_Retest/DEV_HANDOFF_RETEST_PHASE_0_6.md`. Older Phase 0–4 handoff files were deleted to avoid conflicting status counts.

## Current full regression — 2026-07-24

- Scope: all 82 Phase 0–3 gap records.
- Result: 27 Passed, 11 Partial, 33 Still Open and 11 Not Required.
- The BA authorized overwriting the current `Dev Status`, `Retest`, `Evidence`, `Notes` and checkpoint `Audit Status` fields. Older `Execution Log` rows were preserved.
- Current screenshots: `evidence/retest_2026-07-24/`.
- Controlled records created during this run: US-13, US-14 and TA-11 with the `DEVINT-AUDIT` prefix. Temporary Iteration, Release and Milestone relationships were restored.
- BA confirmed the current gap classifications. The next gate is SRS/mockup reconciliation by approved alignment package before the Dev handoff is updated.

## Phase 4 first audit — 2026-07-24

- Scope: 15 checkpoints across Notifications, Roles & Permissions and Settings & Audit.
- Result: 2 Passed, 2 Partial, 6 Gap Confirmed and 5 Blocked.
- Ten new Phase 4 gap/dependency rows were appended, and the previously deferred role-catalog gap `GAP-P1-USER-004` was executed under `P4-RBAC-01`.
- Notification data-dependent tests remain blocked because the audit account has no notification rows and no safe sender/recipient test pair.
- Project Admin and Project Member enforcement remain blocked until controlled non-admin test accounts and Project/Team assignments are available.
- Evidence: `evidence/phase4_2026-07-24/`.
- BA confirmed all Phase 4 classifications and fix directions on 2026-07-24. Phase 4 SRS/mockup reconciliation is now authorized by approved alignment package before the Dev handoff is updated.

## Phase 3 trace and reconciliation gate

- `notes/PHASE3_TRACE_INDEX.md` maps every Phase 3 checkpoint to its execution record, evidence note and confirmed gap IDs.
- A recorded live observation without a committed screenshot is explicitly labeled as such; screenshot evidence must be captured during retest before the related Dev fix is closed.
- Audit completion does not automatically change the product baseline. BA has confirmed the complete audit and fix directions; confirmed decisions are now reconciled into SRS/mockup by alignment package, then packaged for Dev handoff.
