# DevInt Audit — Phase 0 to Phase 3

## Objective

Audit `https://rally-dev.qnsc.vn/` screen by screen and function by function against the confirmed Mini Rally business rules, SRS, test scenarios and FE mockup for Phase 0–3.

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

Out of scope unless BA explicitly expands it: Phase 4 governance features, Phase 5 Portfolio/Release Planning/Reports, database/schema/infra changes and production deployment.

## Evidence and safety

- Use account `hieuvbm@qnsc.vn`; never store a password or session token in this folder or tracker.
- Use unique test-data names prefixed with `DEVINT-AUDIT` when create/edit testing is needed.
- Avoid destructive cleanup, role changes or workspace-wide settings mutation until BA approves the specific test.
- Store screenshots or exported evidence under `evidence/Phase_<n>/<audit-id>/`.
- Store detailed walkthrough notes under `notes/` when a tracker cell is not sufficient.

## Tracker

`DEVINT_PHASE_0_3_AUDIT_TRACKER.xlsx` is the operational source of truth for screen order, executions, gaps, BA decisions and retest status.
