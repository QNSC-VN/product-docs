# 07 - Business E2E Test

## Purpose

This workspace validates the real DevInt business chain against the latest BA-confirmed Mini Rally baseline:

```text
Create Iteration
-> Create Release and Milestone
-> Create Backlog Story/Defect
-> Assign Iteration, Release and Milestone
-> Create child Task
-> Change Task and Work Item states
-> Verify Task, Work Item and Iteration propagation
```

## Scope

- UI and business behavior only.
- No database, schema, API implementation or infrastructure changes.
- Controlled DevInt records use the prefix `BA-E2E-20260720`.
- Test data remains available for BA inspection unless cleanup is explicitly approved.

## Source of truth order

1. Latest explicit BA confirmations.
2. Reconciled source of truth and `04_Developement_tracking/reconciliation/DEV_HANDOFF.md`.
3. Phase SRS and testing documents.
4. Mockup behavior.

When an older SRS conflicts with a later BA confirmation, the E2E test follows the latest BA decision and logs a documentation gap.

## Files

- `BUSINESS_E2E_TEST_TRACKER.xlsx`: master execution, baseline, data and gap tracker.
- `BUSINESS_BASELINE.md`: concise status/cardinality/propagation rules used by the test.
- `specs/`: test strategy, Phase 0–4 scenarios, E2E suites and traceability matrix.
- `notes/`: one note per checkpoint or confirmed gap group.
- `evidence/`: screenshots collected from Mockup and DevInt.

## Execution discipline

- Execute one business checkpoint at a time.
- Preserve entity identity across Backlog, Detail, Iteration Status and Timeboxes.
- Present exact Expected vs Actual behavior to BA before marking a gap confirmed.
- Do not infer a pass from visual similarity alone; persistence and reload are required where applicable.

## Current checkpoint

- `E2E-00`: Team behavior is `Not Testable`; BA directed the run to use `No team`.
- `E2E-01`: `IT-5 / BA-E2E-20260720 Iteration` was created once and persisted with default `Planning`.
- The Iteration catalog `Planning / Committed / Accepted` matches the reconciliation decision; the earlier status gap was invalidated.
- `Team Alpha` is selectable but is not linked to Project `NXP`; this is retained as a deferred Team-data finding.
- BA confirmed adding `Type` and `Project` to Iteration quick create; this remains a Dev UI change.
- `E2E-02`: two controlled Releases were created once and persisted with the correct status catalog.
- BA confirmed Release Management must move under Timeboxes and Release Progress belongs to Phase 5.
- `E2E-03`: standalone Milestone creation passed, but two-Release linkage and derived dates are blocked because the picker shows no Releases.
- BA confirmed the Milestone integration gap and the Release multi-select / derived-date fix direction.
- `E2E-04`: Backlog Story creation is blocked. `No team` returns a generic unexpected error; `Team Alpha` is not linked to `NXP`; exact-title search confirms no record was created.
- The quick-create contract is also mismatched: Project is missing and the Team options are not constrained to valid Project membership.
- The Backlog currently labels the six-button state control as Schedule State and exposes no Flow State; the confirmed target is Flow State as six buttons plus Schedule State as a dropdown, mirrored both ways.
- BA directed the create and quick-create gaps to Dev, reconfirmed the state-control baseline, and approved using existing Work Items for the remaining checkpoints.
- `E2E-05`: existing `US-12` was assigned inline to `IT-5 / BA-E2E-20260720 Iteration`; the assignment persisted after reload and IT-5 remained Planning.
- BA confirmed Iteration Status does not need All Teams support. The cross-screen portion is `Not Testable` until a valid Team-linked Iteration and Work Item are available; Dev must not implement All Teams for this screen.
- Final reconciliation was rechecked: one Work Item has at most one active Release and may have multiple Milestones. The earlier tracker expectation of multiple Releases was invalidated.
- `E2E-06`: Release A then Release B behaved correctly as a single-select replacement; Release B persisted and mirrored to Backlog while IT-5 remained unchanged.
- Work Item Detail has no Milestone field, blocking multi-select, related-option filtering and independent persistence.
- BA confirmed the missing Milestone control as a Dev change.
- `E2E-07`: `TA-8` and `TA-9` were created once under US-12, defaulted Defined, inherited NXP/no-Team context, persisted after reload, and did not appear in Backlog.
- Task count is inconsistent: the table has two rows and roll-up Estimate is 6h, but the tab still displays `0 Tasks`.
- Create Task exposes editable Estimate without To Do/Actuals, and Task rows do not expose the confirmed inline editing controls.
- BA confirmed all three Task gaps: count must equal the persisted child Task total, time fields must follow the defined `Estimate = To Do + Actuals` contract, and Task Dashboard must support inline editing.
- `E2E-08` is paused before execution because DevInt was turned off. Resume from Task time/status propagation using existing `TA-8` and `TA-9`; do not recreate the controlled Tasks.
