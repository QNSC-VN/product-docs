# E2E-07 — Child Task Creation

**Execution date:** 2026-07-20
**Parent:** `US-12 / Automate dependency graph visualisation in CI`
**Created Tasks:** `TA-8`, `TA-9`
**Overall result:** `Failed — creation and persistence pass; count and editing contracts fail`

## Passed behavior

1. TA-8 and TA-9 were each created once under US-12.
2. Both defaulted to `Defined`.
3. Both displayed Project NXP and the parent's No-team context.
4. Both persisted after a full route reload.
5. Detail Task Roll-up showed Estimate 6, To Do 0 and Actual 0.
6. Exact Task-prefix search returned no Backlog items, so Tasks remain child entities.

## DEV-012 / P0 — Task count mismatch

- Expected: Task tab count equals the number of child Tasks.
- Actual: two persisted Task rows exist and roll-up is 6h, but the tab remains `0 Tasks`.
- Fix: derive tab count, table rows and roll-up from the same child Task collection and refresh after mutations.

## DEV-013 / P0 — Create Task time contract

- Expected: Estimate is read-only and equals `To Do + Actuals`.
- Actual: Create Task accepts an independent Estimate and has no To Do/Actuals fields.
- Fix: capture To Do/Actuals or initialize both to zero; calculate Estimate rather than accepting it as an independent input.

## DEV-014 / P0 — Missing inline edit

- Expected: Task Dashboard supports inline Name, State, Owner, To Do and Actuals, with read-only derived Estimate.
- Actual: Task rows render static values without inline controls.
- Fix: add inline controls backed by the shared Task update action and recalculate row/parent totals immediately.

## Evidence

- `evidence/E2E-07/01-empty-task-dashboard.png`
- `evidence/E2E-07/02-add-task-form.png`
- `evidence/E2E-07/03-task-a-created.png`
- `evidence/E2E-07/04-task-b-created-count-mismatch.png`
- `evidence/E2E-07/05-tasks-persisted-after-reload.png`
- `evidence/E2E-07/06-tasks-not-in-backlog.png`
