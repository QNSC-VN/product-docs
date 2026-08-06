# E2E-01 - Create Iteration

## Status

`Passed; Team behavior Not Testable; one confirmed UI enhancement remains`

## Controlled input

- Name: `BA-E2E-20260720 Iteration`
- Project context: `NXP`
- Team selected in form: `Team Alpha`
- Start Date: `2026-07-21`
- End Date: `2026-08-03`
- Expected default status: `Planning`

## Expected business

- Quick create uses a valid Project/Team context.
- New Iteration defaults to `Planning`.
- Iteration status catalog contains `Planning`, `Committed` and `Accepted`.
- Submit creates exactly one Iteration and the record persists after reload.

## DevInt actual

- Signed-in user: `Hieu Vu Minh Bui`.
- Header context: `ACME Corp / NXP / All Teams`.
- The form lists `No team` and `Team Alpha`; it does not display Project or Type.
- The status dropdown contains the correct confirmed values `Planning`, `Committed`, and `Accepted`.
- Submit with `Team Alpha` is rejected with `Team is not linked to this project`.
- BA directed the test to continue with `No team` because Team data is not currently testable.
- Retry with `No team` created `IT-5` exactly once with default `Planning` and the planned dates.
- `IT-5` remained visible after reloading `/timeboxes`.

## Logged gaps

- `DEV-001`: invalidated; `Committed` is correct according to reconciliation and BA reconfirmation.
- `DEV-002`: confirmed; add `Type` and `Project`, with Project inherited from active context.
- `DEV-003`: named Team validation is marked `Not Testable`; the E2E chain continues with `No team`.

## BA decision

- Use `No team` for this business E2E run.
- Mark Team behavior `Not Testable` until linked Team data is available.
- Do not let unavailable Team data block Release, Milestone, Backlog, Task or status-flow testing.
- Treat the reconciliation record as authoritative for the three-state Iteration lifecycle; synchronize the main Phase 2 SRS after testing.

## Evidence

- `evidence/E2E-01/01-create-form.png`
- `evidence/E2E-01/02-team-not-linked.png`
- `evidence/E2E-01/03-create-no-team.png`
- `evidence/E2E-01/04-created-persisted.png`
