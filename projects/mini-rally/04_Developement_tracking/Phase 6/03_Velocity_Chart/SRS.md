# Phase 6 - Reports > Velocity

> **Project Access:** Workspace Admin, assigned-Project `Admin` and `Viewer` can open this read-only report. `Editor` and `No Access` cannot open Reports.

## 1. Scope boundary

Velocity compares point outcomes for recent completed Iterations and explicitly separates work accepted on time, accepted late, and still not accepted.

This package defines BA rules and the approved mockup contract. Production query logic, accepted-date backfill, authorization and automated tests remain DEV-owned.

## 2. Eligible Iterations

An Iteration is eligible only when:

1. its Workspace-local end date is before today; and
2. at least one Story or Defect is currently assigned to it.

Tasks, Features and empty Iterations are excluded. Sort eligible Iterations by end date ascending, then display the most recent 5 or 10 according to the selected window.

For a selected Team, use that Team only. For `All Teams`, align Team-specific Iterations by stable shared timebox key, aggregate them into one bar per timebox, and de-duplicate Work Items by ID.

## 3. Mutually exclusive stacked-bar formulas

For each eligible Iteration `X`, classify every currently assigned Story/Defect into exactly one segment:

```text
acceptedDuring = SUM(workItem.planEstimate)
  WHERE workItem.iterationId = X
    AND workItem.state IN (Accepted, Release)
    AND workItem.acceptedDate IS NOT NULL
    AND workItem.acceptedDate <= endOfDay(X.endDate)

acceptedAfter = SUM(workItem.planEstimate)
  WHERE workItem.iterationId = X
    AND workItem.state IN (Accepted, Release)
    AND workItem.acceptedDate IS NOT NULL
    AND workItem.acceptedDate > endOfDay(X.endDate)

notAccepted = SUM(workItem.planEstimate)
  WHERE workItem.iterationId = X
    AND workItem.state NOT IN (Accepted, Release)
```

| Segment | Meaning | Color |
|---|---|---|
| Accepted During Iteration | Reached Accepted no later than the Iteration end boundary | Dark green |
| Accepted After Iteration | Was scheduled in the Iteration but first reached Accepted after it ended | Light green |
| Not Accepted | Has never reached Accepted as of now | Red |

Classification uses both current state and `acceptedDate`. A Story/Defect currently in `Release` still belongs to During or After according to its accepted timestamp. A reopened item belongs to Not Accepted even if audit history shows an earlier acceptance.

Required invariant:

```text
acceptedDuring + acceptedAfter + notAccepted
= SUM(planEstimate of all currently assigned Story/Defect items in X)
```

An Accepted/Release item without `acceptedDate` is a data-quality error. DEV must backfill it from auditable history; the report must not guess whether it was accepted during or after the Iteration.

## 4. Real-time attribution rule

Velocity is recalculated from current Iteration assignment:

- moving an item out of an old Iteration removes it from that Iteration's bar;
- moving an item into an old Iteration adds it to that Iteration's bar;
- changing Plan Estimate changes the current chart result;
- entering `Accepted` sets `acceptedDate`; moving onward to `Release` retains it; reopening clears it; a later re-acceptance sets the new timestamp. Audit/event history retains the earlier transitions.

Unlike Burndown, Velocity is not frozen by a daily or Iteration-end snapshot.

## 5. Trend and averages

Only `acceptedDuring` is a velocity input. `acceptedAfter` and `notAccepted` are visual context and are excluded from every trend/average calculation.

For the selected Last 5 or Last 10 window:

```text
trend = AVG(all acceptedDuring values in the selected window)
last3 = AVG(3 most recent acceptedDuring values)
best3 = AVG(3 highest acceptedDuring values in the selected window)
worst3 = AVG(3 lowest acceptedDuring values in the selected window)
```

If fewer than three eligible Iterations exist, Last/Best/Worst use all available values and the UI must expose the actual sample size. Aggregate full-precision points and round only the displayed result to a maximum of two decimals.

## 6. UI contract

- Report title: `Velocity - Accepted Iterations`.
- Team context line: `Team: {Team Name|All Teams}` and it updates from the global Team selector.
- Window selector: `Last 5 sprints` and `Last 10 sprints`; default is Last 10. The user's selected window persists after reload.
- Compact centered summary: `Averages over Last N Iterations`, with Last 3, Best 3 and Worst 3.
- Chart: vertical stacked bars with a horizontal/connected dark-green Trend line.
- Legend: Accepted During Iteration, Accepted After Iteration, Not Accepted, Trend value.
- Y-axis unit: Velocity points.
- The bar width remains visually narrow enough to distinguish separate Iterations in both windows.
- Empty state: no completed Iteration with scheduled work in the selected Project/Team scope.

## 7. Acceptance examples

1. A 5-point Story accepted on the Iteration end date contributes 5 to During.
2. A 3-point Defect accepted one day after the end date contributes 3 to After and 0 to trend/averages.
3. An 8-point Story currently in `Completed` contributes 8 to Not Accepted and 0 to trend/averages.
4. If an item is now in `Release` with an accepted date before the Iteration end, it remains in During.
5. Moving a Story out of a completed Iteration changes that bar immediately on the next query.
6. Switching Last 5 to Last 10 changes both displayed bars and calculations to the selected window.
7. First use opens Last 10; after the user selects Last 5 or Last 10, reload restores that selected window.
8. With During values `[36, 51, 43, 52, 34]`, Last 3 uses `[43, 52, 34]`, Best 3 uses `[51, 52, 43]`, and Worst 3 uses `[36, 43, 34]`.

## 8. Logical field requirement

```text
StoryOrDefect {
  ...,
  planEstimate: number,
  iterationId: id | null,
  acceptedDate: timestamp | null
}
```

`acceptedDate` is set when the item enters Accepted and retained when it moves to Release. If the item is reopened to a non-accepted state, clear the current `acceptedDate`; a later transition back to Accepted sets the new timestamp. The Audit Log/event history must retain earlier acceptance and reopen events even though the current field changes.

## 9. Mockup limitation

`VELOCITY_DATA` is representative static data. Production must calculate the three segments from current Work Item assignment and persisted `acceptedDate`.
