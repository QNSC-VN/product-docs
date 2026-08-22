# Future Backlog — Portfolio / Release Planning

## Status

**DEFERRED BY BA DECISION 2026-07-26 - historical stub only.**

> **2026-07-26 disposition:** Release Planning is not active in the Phase 5 MVP. Capacity Planning is promoted to P5.2 and handles single-Release planning, Team selection, Feature add-to-plan, split allocation and Publish variants; Release Tracking follows as P5.3. Older progress %, zero-state and formula content on this page belongs to Release Tracking traceability only. Active planning continues only in `../Phase 5/PHASE5_DEVELOPMENT_TRACKING.md`. This file remains a traceability record and is not an active specification.

## Navigation direction

- Remove `Releases` from top-level navigation.
- `Portfolio` opens a dropdown menu.
- Dropdown contains `Capacity Planning` while Release Planning remains deferred.
- Phase 3 Release management remains at `Plan > Timeboxes > Releases`.
- Release Planning must not become a second Release create/edit source without a new Phase 5 decision.

## Deferred scope

- Release tracking dashboard.
- Release progress percentage and progress bar.
- Empty Release / 0% presentation.
- Release progress formula and fallback behavior.
- Recalculation after Work Item state, Plan Estimate or Release assignment changes.
- Historical progress/trend views.
- Release-level filtering, saved views and reporting.

## Preliminary business inputs

These inputs were accepted during Phase 0-4 reconciliation but must be reviewed again with the complete Phase 5 scope:

- Release Tracking reads only US/DE assigned to the selected Release.
- US/DE in Schedule/Flow State `Accepted` or `Release` is considered completed for Release Tracking.
- Current mock percentages are not a source of truth. Example: Q1 mock shows 12% while its stored `5/38` values do not calculate to 12%.

## Explicit Phase 0-4 exclusion

- Do not add a Progress column to `Plan > Timeboxes > Releases`.
- Do not add a Release Progress widget to the Phase 3 Release Detail.
- Phase 3 keeps Release artifacts, Accepted total and task roll-up requirements already documented.

## 2026-07-26 deferred Release Planning backlog

Future Release Planning may be reopened only after BA confirms a separate problem statement. Candidate scope:

- Unassigned Feature backlog by Project.
- Assign/move/unassign Features across Releases without creating a second Release registry.
- Release planning board or list separate from Capacity Planning.
- Validation against Release state and Project scope.

## Governance disposition

`P5-GOV v1` confirmed:

1. Release and Feature progress use completed Plan Estimate, not completed item count.
2. Zero-estimate items are shown separately and are not included in the progress denominator.
3. An empty or wholly unestimated Release shows 0% plus an explicit no-estimated-scope state.
4. Reaching 100% does not automatically change Release state.
5. P5.3 MVP contains KPI and Feature-list tracking; burnup/trend stays deferred until trustworthy historical snapshots exist.
