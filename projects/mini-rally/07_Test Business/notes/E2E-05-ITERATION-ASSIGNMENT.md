# E2E-05 — Existing Work Item Iteration Assignment

**Execution date:** 2026-07-20
**Surrogate Work Item:** `US-12 / Automate dependency graph visualisation in CI`
**Target Iteration:** `IT-5 / BA-E2E-20260720 Iteration`
**Overall result:** `Not Testable — Backlog assignment passed; Team-scoped Iteration Status deferred`

## Why a surrogate was used

`E2E-04` could not create the controlled Story. BA directed the remaining checkpoints to use existing Work Items, so `US-12` is now the shared surrogate record. This does not convert the failed Create checkpoint into a pass.

## Passed behavior

1. On Backlog, US-12 changed from Unscheduled to `BA-E2E-20260720 Iteration` using inline edit.
2. After full route reload and exact-ID search, the same US-12 row retained the assignment.
3. Timeboxes still showed IT-5 exactly once in `Planning`; assignment did not auto-commit the Iteration.

## Scope decision

1. BA confirmed Iteration Status does not need to support `All Teams`.
2. Dev must not implement the previously proposed All Teams aggregation.
3. Iteration Status is accepted as a selected-Team screen; Team Alpha currently exposes Sprint 26.2.
4. IT-5 uses `No team`, so same-ID US-12 display, metrics and totals are deferred until valid Team-linked test data exists.

## DEV-010 disposition

- `Accepted As-Is` for All Teams behavior.
- No All Teams implementation is required.
- Retest shared Work Item identity and totals only after valid Team-linked data is available.

## Evidence

- `evidence/E2E-05/01-us12-before-assignment.png`
- `evidence/E2E-05/02-us12-assigned-inline.png`
- `evidence/E2E-05/03-us12-assignment-persisted.png`
- `evidence/E2E-05/04-iteration-status-no-iterations.png`
- `evidence/E2E-05/05-team-alpha-iteration-status.png`
