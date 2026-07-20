# E2E-04 — Backlog Story Create

**Execution date:** 2026-07-20
**DevInt route:** `https://rally-dev.qnsc.vn/backlog`
**Controlled title:** `BA-E2E-20260720 Story`
**Overall result:** `Blocked — pending BA confirmation`

## Expected business behavior

1. Quick create contains Type, Title, Project, Team, Owner and Plan Estimate.
2. Project is required and defaults to the active Project `NXP`.
3. Team options are filtered by the selected Project and must not offer an incompatible Team.
4. One successful submit creates exactly one shared Story.
5. New Schedule State and Flow State both default to `Idea` and mirror thereafter.
6. On Backlog, Flow State is the six-button state control; Schedule State is a dropdown.

## DevInt actual

1. The form contains Type, Title, Team, Owner and Plan Estimate, but no Project.
2. It offers both `No team` and `Team Alpha`; Team Alpha is not linked to NXP.
3. Submit with `No team` returns `An unexpected error occurred` with reference `c13cf2d5-6ac5-4a87-aac2-5959c1a55fd2`.
4. Submit with `Team Alpha` returns `Team is not linked to this project`.
5. Exact-title search returns `No backlog items match your filters`; no partial or ghost record exists.
6. The Backlog shows only a `Schedule State` column rendered as six buttons; no Flow State control is exposed.

## Proposed fix direction

- `DEV-007 / P0`: provide a valid create path for the active Project, prevent incompatible Team selection, show field-level validation and commit exactly one record.
- `DEV-008 / P1`: add Project defaulted to current context and filter Team options to active Project membership; keep Iteration and Release out of quick create because they are assigned later.
- `DEV-009 / P0`: render Flow State as the six-button control, add Schedule State as a dropdown, use the exact six-value catalog and mirror both fields atomically.

## Evidence

- `evidence/E2E-04/01-create-form.png`
- `evidence/E2E-04/02-no-team-unexpected-error.png`
- `evidence/E2E-04/03-team-not-linked.png`
- `evidence/E2E-04/04-no-record-after-attempts.png`

Downstream Iteration assignment, Task creation and propagation testing cannot start until one controlled Work Item can be created.
