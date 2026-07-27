# E2E-08 Deferred — DevInt unavailable

Date: 2026-07-20

## Confirmed before suspension

- `DEV-012`: Task tab count must equal the number of persisted child Tasks.
- `DEV-013`: Task Estimate follows the confirmed business contract `Estimate = To Do + Actuals` and is not independently editable.
- `DEV-014`: Task Dashboard must support inline editing for the confirmed editable fields.

## Suspension reason

DevInt was turned off immediately before E2E-08. BA instructed the test to stop and resume later.

## Resume point

1. Reopen `US-12` and verify existing Tasks `TA-8` and `TA-9` still persist.
2. Continue `E2E-08` with Task time-field recalculation.
3. Continue `E2E-09` by completing both Tasks and checking automatic parent Work Item completion.
4. Continue `E2E-10` by reopening one Task and checking automatic parent rollback to `In-Progress`.

Do not recreate `TA-8` or `TA-9` unless persistence verification proves that the records no longer exist.
