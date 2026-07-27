# P1-TASK-01 - Task Dashboard

## Scope

This checkpoint starts only after BA confirmed `P2-IS-03`. It compares Task list, create, inline edit, totals and Task identity under:

- Mockup `US-4822 / Sprint 24.5`.
- DevInt `US-1 / Sprint 26.2`.

Parent roll-up behavior is explicitly deferred to `P1-TASK-02`.

## Approved baseline

- A Task is a child of one Story/Defect and inherits the parent Project, Team, Iteration and Release context.
- Task State uses exactly `Defined`, `In-Progress`, `Completed`.
- Task Dashboard supports inline editing for Name, State, Owner, To Do and Actuals.
- Estimate is read-only and always equals `To Do + Actuals`; Total Estimate equals Total To Do plus Total Actuals and recalculates immediately.
- Clicking a Task ID opens the same Task identity in Task Detail.
- Quick Create and Create with details create only one Task; Create with details opens that same Task.

## Mockup evidence

- `US-4822` shows `1 Tasks` and lists exactly `TA-482201`.
- The Task row exposes inline controls for Name, State, Owner, To Do, Actuals and Estimate.
- A controlled Name edit was saved in the row and restored to the original value.
- State options are `Defined`, `In-Progress`, `Completed`.
- Totals are 2 Hours To Do, 0 Hours Actuals and 2 Hours Estimate, matching the row.
- Clicking `TA-482201` opens Task Detail with the same identity and its parent Work Product `US-4822`.
- Create Task provides `Cancel`, `Create` and `Create with details`.

Evidence: `evidence/P1-TASK-01/mockup-US-4822-task-dashboard.png`.

## DevInt evidence

- The `US-1` tab badge says `0 Tasks`, but the dashboard contains four rows: `TA-1`, `TA-2`, `TA-4`, `TA-5`.
- The columns sum their stored values to 4h To Do, 3h Actuals and 10h Estimate, but this violates the confirmed formula; Estimate must be 7h.
- Task rows expose no textboxes, comboboxes or spinbuttons, so Name, State, Owner and time fields are not inline editable.
- Create Task failed with Owner `Unassigned` and `Admin User`. Both attempts kept the modal open and returned opaque error references; no Task was created.
  - `16dd70a7-978b-4478-9159-1bbd26926647`
  - `19364154-727f-4a9f-8d93-96baba2b7738`
- Clicking `TA-1` navigates to `/item/TA-1`, which renders `Work item "TA-1" not found.`
- Create Task has only `Cancel` and `Create Task`; `Create with details` is missing.
- Existing rows display `In Progress` instead of canonical `In-Progress`.
- Create Task defaults Owner to `Unassigned`; the mockup defaults to the authenticated user and does not expose Unassigned.

Evidence: `evidence/P1-TASK-01/devint-US-1-task-dashboard.png`.

## Gaps confirmed by BA

1. `GAP-P1-TASK-001`: badge count must use the same Task source as the dashboard.
2. `GAP-P1-TASK-002`: fix Task create for an Iteration-assigned parent and replace opaque errors with actionable validation.
3. `GAP-P1-TASK-003`: implement inline edit for Name, State, Owner, To Do and Actuals; Estimate is derived and read-only.
4. `GAP-P1-TASK-004`: route Task IDs to Task Detail with the same Task identity.
5. `GAP-P1-TASK-005`: add Create with details without creating a duplicate.
6. `GAP-P1-TASK-006`: use the exact Task State catalog and spelling `Defined`, `In-Progress`, `Completed`.
7. `GAP-P1-TASK-007`: Owner defaults to the authenticated user and retains an explicit Unassigned option.

BA confirmed all seven directions on 2026-07-20.

## Confirmed Task time rule

- Per Task: `Estimate = To Do + Actuals`.
- `To Do` and `Actuals` are editable inputs.
- `Estimate` is calculated and must not be edited independently.
- Totals follow the same formula: `Total Estimate = Total To Do + Total Actuals`.
- DevInt currently shows totals `4h + 3h != 10h`; the expected Estimate is `7h`, so `GAP-P1-TIME-001` is logged as `Fix Direction Approved`.
- Quick Create and the mockup must be reconciled so an independently editable Estimate cannot violate the formula.

## Test-data state

- The two failed DevInt create attempts produced no Task.
- Mockup `TA-482201` was restored to its original Name and remains available for inspection.
- DevInt remains on the `US-1` Task Dashboard; mockup remains on the `US-4822` Task Dashboard.
- `P1-TASK-01` is confirmed.
- `P1-TASK-02` and dynamic `P1-TIME-01` testing are blocked until DevInt provides Task State/time mutation through Dashboard or Task Detail.
