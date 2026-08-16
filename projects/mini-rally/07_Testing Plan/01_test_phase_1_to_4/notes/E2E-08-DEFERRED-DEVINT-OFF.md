# E2E-08 Deferred — DevInt unavailable

> Historical evidence only. The Task hour interpretation below was superseded by BA on 2026-08-14: Estimate, To Do and Actual are independent after a one-time create copy from Estimate to blank To Do; State changes do not mutate hours.

Date: 2026-07-20

## Confirmed before suspension

- `DEV-012`: Task tab count must equal the number of persisted child Tasks.
- `DEV-013` current rule: Task Estimate, To Do and Actual are independently editable after the create-time copy.
- `DEV-014`: Task Dashboard must support inline editing for the confirmed editable fields.

## Suspension reason

DevInt was turned off immediately before E2E-08. BA instructed the test to stop and resume later.

## Resume point

1. Reopen `US-12` and verify existing Tasks `TA-8` and `TA-9` still persist.
2. Continue `E2E-08` with Task time-field recalculation.
3. Continue `E2E-09` by completing both Tasks and checking automatic parent Work Item completion.
4. Continue `E2E-10` by reopening one Task and checking automatic parent rollback to `In-Progress`.

Do not recreate `TA-8` or `TA-9` unless persistence verification proves that the records no longer exist.
