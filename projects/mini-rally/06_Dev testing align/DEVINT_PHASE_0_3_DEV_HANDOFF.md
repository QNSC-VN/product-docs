# DevInt Phase 0–3 Dev Fix Handoff

Date: 2026-07-24

Source tracker: `06_Dev testing align/DEVINT_PHASE_0_4_AUDIT_TRACKER.xlsx`

Scope: FE/business behavior only. BA is not requesting DB schema, infrastructure, or destructive data changes in this handoff.

## Current status

- Current dev fix package: 39 items
  - Still Open: 35
  - Partial: 3
  - Failed: 1
- Future Backlog: 9 items; do not include in the current fix package unless BA reopens.
- Deferred / not tested: 1 item; test later when the flow is completed/approved.
- Passed/fixed: 33 items; no current action.

## How dev should use the tracker

In `DEVINT_PHASE_0_4_AUDIT_TRACKER.xlsx`, use sheet `Gap Log`.

Current fix filter:

- `Dev Status = Still Open`
- `Dev Status = Partial (retest)`
- `Dev Status = Failed (retest)`

Future/backlog filter:

- `Dev Status = Future Backlog`
- These are not part of the current fix package.

Deferred test filter:

- `Dev Status = Deferred (not tested)`
- This is not a current failure; retest after flow is completed.

## Current dev fix package by area

### Phase 0

- `GAP-P0-AUTH-001` — Login authentication method
- `GAP-P0-SHELL-002` — Portfolio dropdown / Release Planning placement
- `GAP-P0-SHELL-004` — Track child label must be `Iteration Status`
- `GAP-P0-PRJ-004` — Project Name validation
- `GAP-P0-PRJ-005` — Project Key helper/validation alignment

### Phase 1 — Backlog / Work Item / Task / Team

- `GAP-P1-BL-001` — Backlog search clear must restore scoped list without reload
- `GAP-P1-BL-002` — Add Priority filter
- `GAP-P1-BL-004` — Header sort expected for approved columns, not Rank-only
- `GAP-P1-CREATE-003` — Work Item create Team selector must follow selected Project
- `GAP-P1-CREATE-006` — Owner default and allowed values
- `GAP-P1-CREATE-008` — New Work Item defaults must set Schedule State and Flow State to `Idea`
- `GAP-P1-CREATE-009` — Default Schedule/Flow State on quick-create/detail
- `GAP-P1-WID-001` — Work Item Detail tabs/content scope
- `GAP-P1-WID-003` — Work Item supports multiple Releases
- `GAP-P1-WID-006` — Schedule State and Flow State two-way mirror
- `GAP-P1-WID-007` — Owner default and Unassigned option consistency
- `GAP-P1-WID-008` — Team behavior on Work Item Detail must match confirmed rule
- `GAP-P1-TASK-005` — Task create with details action
- `GAP-P1-TASK-006` — Task Dashboard state labels must be `Defined`, `In-Progress`, `Completed`
- `GAP-P1-TASK-007` — Task Owner default and Unassigned consistency
- `GAP-P1-TEAM-001` — Team Lead is optional; `No lead` must be accepted on Team create
- `GAP-P1-HIST-001` — Work Item Revision History state-change logging
- `GAP-P1-HIST-002` — Task Revision History logging

### Phase 2

- `GAP-P2-IT-001` — Iterations list missing Project and Task Estimate columns
- `GAP-P2-IS-003` — Iteration Status missing Type column
- `GAP-P2-IS-004` — Remove per-row Defects column from Iteration Status
- `GAP-P2-IS-005` — Hide/remove Board view toggle until approved
- `GAP-P2-BL-001` — Backlog bulk assign Release/Iteration; review unexpected Delete/Copy

### Phase 3

- `GAP-P3-TS-001` — Remove Team Status local search input
- `GAP-P3-TS-002` — Remove Team Status Filters/Show Fields/pagination unless BA approves deviation
- `GAP-P3-TS-003` — Fix Team Status breadcrumb
- `GAP-P3-TS-004` — Parent auto-completion reopen rule needs fix/BA-confirmed behavior
- `GAP-P3-TS-005` — Task State control type/label visibility
- `GAP-P3-TS-006` — Estimate/To Do/Actuals defaults should show `0`, not dash
- `GAP-P3-TS-007` — Task Dashboard state labels
- `GAP-P3-REL-001` — Remove Burndown/Release Progress widget from Phase 3 Release detail
- `GAP-P3-REL-002` — Release Artifacts assignment display/query is blocking reassignment tests
- `GAP-P3-MS-001` — Milestone Artifacts missing Add Artifact control
- `GAP-P3-QA-001` — Quality > Defect create flow is failing

## Future Backlog, not current fix

BA confirmed these should be marked Future Backlog and fixed later:

- `GAP-P0-SHELL-006` — Functional Global Search
- `GAP-P0-WS-002` — Workspace rename docs/mockup alignment
- `GAP-P0-PRJ-001` — Project screen label/admin naming cleanup
- `GAP-P0-PRJ-008` — Archived Project edit affordance cleanup
- `GAP-P0-PRJ-009` — Restore confirmation behavior
- `GAP-P0-PRJ-010` — Archive confirmation mockup/docs parity
- `GAP-P1-BL-006` — Configurable filter model / Manage Filters
- `GAP-P1-BL-008` — Rank persistence under additional team-scope retest
- `GAP-P1-CREATE-001` — Quick-create Cancel regression

## Deferred test

- `GAP-P1-USER-006` — Invite flow is dev-designed and deferred. Do not force DevInt to match the old mockup UI. Retest later for validation, delivery, invited status, resend/expire behavior if in scope.

## BA-confirmed business rules dev must preserve

- Release must live under `Timeboxes`, not top-level navigation.
- Work Item status catalog is: `Idea`, `Defined`, `In-Progress`, `Completed`, `Accepted`, `Release`.
- Work Item `Schedule State` is the six-box segmented control.
- Work Item `Flow State` is the dropdown.
- Schedule State and Flow State use the same six-value catalog and should mirror each other.
- Team on Work Item create is optional:
  - Blank/no team = Project backlog.
  - Selected Team = Team backlog.
- Team Lead on Team create is optional:
  - `No lead` must be accepted.
  - Lead can be assigned later.
- Task status catalog is: `Defined`, `In-Progress`, `Completed`.
- Task Estimate is derived: `Estimate = To Do + Actuals`.
- Parent Work Item task roll-up rules remain as confirmed in tracker:
  - All child Tasks completed -> parent US/DE auto-completed.
  - If a completed parent gets a reopened/incomplete Task, metrics recalculate and parent returns to `In-Progress`, unless BA later defines an Accepted protection rule.
- Invite flow is dev-designed and deferred for delivery testing.

## Retest expectation after dev fixes

After dev fixes, BA/Codex should retest the current dev fix package first, then rerun the canonical Agile flow:

1. Create Milestone / Release / Iteration.
2. Create Backlog Work Item.
3. Assign Backlog to Iteration.
4. Create Tasks under Work Item.
5. Complete Tasks.
6. Verify Work Item status/progress reflection.
7. Verify Iteration status/progress reflection.
