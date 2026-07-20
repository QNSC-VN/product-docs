# P1-WID-01 - Work Item Detail

## Scope

Compare the Phase 1 Work Item Detail mockup/SRS and the confirmed reconciliation rules against DevInt using mockup Story `US-4822` and DevInt Story `US-7`.

## Expected

- US/DE Detail uses the mockup tab structure: `Details`, `Tasks`, `Revision History`.
- Sidebar includes Owner, Project, Team, Schedule State, Flow State, Plan Estimate, Releases, Milestones and Iteration.
- A Work Item can have multiple Releases and multiple Milestones according to the confirmed reconciliation rule.
- Schedule State is a dropdown and Flow State is a six-box control.
- Both states use exactly: `Idea`, `Defined`, `In-Progress`, `Completed`, `Accepted`, `Release`.
- Schedule State and Flow State mirror each other in both directions.
- Owner defaults to the authenticated user and may be changed to `Unassigned`.
- Team remains required and must be linked to Project; `No team` is not allowed.
- Direct item URL and reload return to the same Work Item with persisted data.

## Mockup Observed

- `US-4822` opens a same-screen detail view with tabs `Details`, `Tasks`, `Revision History`.
- Sidebar includes Owner, Project, Team, Schedule State, Flow State, Plan Estimate, Release, Milestones and Iteration.
- Schedule State and Flow State currently render as dropdowns with the six approved values.
- Release is still a single-select dropdown and therefore does not yet reflect the later multi-Release reconciliation decision.
- Owner currently contains named users only and must add `Unassigned`.

## DevInt Observed

- Direct route `/item/US-7` opens Story `Migrate all apps to ESLint flat-config` and reload returns to the same item.
- Tabs are `Details`, `Tasks`, `Defects`, `Revision History`; `Defects` is additional to the approved mockup/SRS scope.
- Detail content also adds Linked Items and Comments beyond the current mockup/SRS.
- Sidebar has Owner, Team, Schedule State, Flow State, Feature, Plan Estimate, Iteration, Release and Creation Date.
- Project and Milestones are missing.
- Release is single-select.
- Owner includes `Unassigned`, which matches the newly confirmed allowed value, but DevInt Quick Create still defaults to `Unassigned` instead of the authenticated user.
- Team includes `No team`, which conflicts with the confirmed required linked-Team rule.
- Schedule State is a dropdown but only offers `Defined`, `In Progress`, `Completed`, `Accepted`.
- Flow State is correctly presented as six boxes, but uses `In Progress` instead of `In-Progress`.

## Status Mirror Test

1. Original DevInt `US-7`: Schedule State `In Progress`, Flow State `Accepted`.
2. Changed Schedule State to `Completed`: Flow State remained `Accepted`.
3. Changed Flow State to `Defined`: Schedule State remained `Completed`.
4. Restored the item to its original Schedule State `In Progress` and Flow State `Accepted`.
5. Reload retained the restored values and reopened the same `/item/US-7` route.

The two states are currently stored and updated independently, so the confirmed two-way mirror rule is not implemented.

## Confirmed Fix Direction

- Dev: make US/DE Detail follow the mockup tab structure and hide/remove the additional `Defects` tab from this Phase 1 scope.
- BA/Mockup: evaluate extra Linked Items and Comments for Future Backlog; they are not part of the current approved Detail contract.
- Dev: add Project and multi-select Milestones.
- Dev + BA/Mockup: replace single Release with multi-select Releases according to reconciliation.
- BA/Mockup: change Flow State from dropdown to the six-box control.
- Dev: expand Schedule State to all six exact values and use the exact `In-Progress` label in both controls.
- Dev: mirror Schedule State and Flow State in both directions and persist one synchronized value.
- BA/Mockup: add `Unassigned` to Owner while keeping the authenticated user as the default.
- Dev: remove `No team`; Team remains required and must be linked to Project.
- No change is required for direct item URL/reload behavior; it passed.

## BA Confirmation

- Confirmed on 2026-07-19: Detail follows the mockup structure.
- Confirmed on 2026-07-19: Release and Milestone behavior follows the reconciliation rules.
- Confirmed on 2026-07-19: state controls, six-value catalog and two-way mirror follow the previously approved business rules.
- Confirmed on 2026-07-19: Owner includes `Unassigned` and this rule must also be applied to backlog creation.
- Confirmed on 2026-07-19: direct URL/reload behavior is correct.

## Status

- Audit Status: `Confirmed`.
- Disposition: `Fix Direction Approved`.
- Retest is required after Dev and BA/mockup alignment changes are implemented.
