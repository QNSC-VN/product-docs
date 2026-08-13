# Phase 6 - Reports > Iteration Burndown

> **Project Access:** Workspace Admin and assigned-Project `Admin` can open this read-only report. `Editor` and `No Access` cannot open Reports. (Access model is now 3-level: Workspace Admin / Admin / Editor; the former Viewer level is removed.)

## 1. Scope boundary

Iteration Burndown displays execution progress for one selected Iteration. It uses Task hours for remaining and ideal work, plus accepted Story/Defect points on a separate axis.

This package defines BA rules and the approved mockup contract. Production persistence, the daily scheduler, APIs, timezone implementation and automated tests remain DEV-owned.

## 2. Filter and timebox contract

- Project and Team come from the global workspace context.
- The Iteration picker contains previous/select/next controls plus the selected Iteration date range.
- A selected Team includes only that Team's work.
- `All Teams` aggregates the Teams in the selected Project for the same shared Iteration timebox.
- DEV must align Team-specific Iterations using a stable shared timebox key. Do not aggregate by display name alone.
- The x-axis renders Iteration working days in Workspace local time. The first point is the first working day and the Ideal line reaches zero on the last working day.

## 3. Chart formulas

### IB-BR-01 - Remaining To Do

```text
remainingToDo(d) = SUM(task.todo at end of day d)
  WHERE task.parent is Story or Defect
    AND parent is in selected Project/Team/Iteration scope
```

- Unit: hours, left axis.
- Source: end-of-day snapshot, not today's live Task values.
- Completed Tasks normally have `todo = 0` under the shared Task rules and therefore contribute zero.
- Editing Task ToDo later must not rewrite a past value.

### IB-BR-02 - Accepted Points

```text
acceptedPoints(d) = SUM(workItem.planEstimate)
  WHERE workItem.type IN (Story, Defect)
    AND workItem is in selected Project/Team/Iteration scope
    AND workItem.state IN (Accepted, Release) at end of day d
    AND workItem.acceptedDate <= endOfDay(d)
```

- Unit: points, right axis.
- This is cumulative by date.
- An item moved from `Accepted` to `Release` remains accepted-equivalent and keeps the same `acceptedDate`.
- If an item is reopened, the next daily snapshot no longer counts it; already finalized snapshots remain unchanged.
- The value stored in the daily snapshot is authoritative for history. A later scope or estimate edit does not recalculate old snapshots.

### IB-BR-03 - Ideal line

Capture one immutable baseline when the Iteration starts:

```text
totalTaskEstimateAtStart = SUM(task.estimate at Iteration start)
  WHERE task.parent is Story or Defect
    AND parent is in the Iteration scope at that time
```

For working-day index `i`, where the first working day is `0` and the last is `N - 1`:

```text
ideal(i) = totalTaskEstimateAtStart * (1 - i / (N - 1))
```

If the Iteration contains only one working day, render the start baseline at the beginning of that day and zero at the Iteration-end boundary. Clamp Ideal to `[0, totalTaskEstimateAtStart]`.

The baseline and Ideal line do not change when Tasks are added, removed or re-estimated after the Iteration starts. For `All Teams`, the baseline is the sum of the participating Team baselines for the shared timebox.

## 4. Required persistence

```text
Iteration {
  ...,
  totalTaskEstimateAtStart: number,
  totalTaskEstimateCapturedAt: timestamp
}

IterationDailySnapshot {
  iterationId,
  date,                 // Workspace-local date
  remainingToDo,
  acceptedPoints,
  capturedAt
}
```

Required constraints:

- one baseline capture per Iteration start;
- unique daily key `(iterationId, date)`;
- scheduled job is idempotent and upserts/retries the same date rather than creating duplicates;
- once a date is finalized, normal application changes cannot rewrite it;
- corrections require an audited administrative process owned by DEV/operations.

Suggested daily process:

```text
for each Active Iteration at Workspace end of day:
  scopedItems = current Story/Defect items assigned to Iteration
  remainingToDo = SUM(todo of Tasks under scopedItems)
  acceptedPoints = SUM(planEstimate of scopedItems currently Accepted/Release and accepted by that date)
  save one finalized snapshot for iterationId + localDate
```

If an Iteration starts today, capture its start baseline once and write today's first daily snapshot. Weekend/holiday snapshots may be stored for audit, but the approved chart renders the configured working-day calendar.

## 5. Historical semantics

Burndown is intentionally frozen history:

- Task edits today affect today's/future snapshots only.
- Moving a Story/Defect after a snapshot does not rewrite that snapshot.
- Changing Plan Estimate after a snapshot does not rewrite its Accepted Points.
- Changing Task Estimate after Iteration start does not change Ideal.
- Missing historical snapshots are reported as unavailable. Production must not interpolate or fabricate them.

## 6. Status indicator

For the latest available snapshot date `d`:

```text
if remainingToDo(d) > ideal(d): Behind plan
else: On track
```

This is informational only. It does not change Task state, snapshots or the baseline.

## 7. UI contract

- Title: `Iteration Burndown`.
- Centered, bold context title on a separate line: `{Project Name} - {Team Name|All Teams}`.
- Series:
  - blue/teal bars: `Task To Do (Hours)`;
  - dark line: `Ideal`;
  - green bars: `Accepted (Points)`.
- Left axis: Task To Do hours and Ideal hours.
- Right axis: Accepted points.
- Legend below the chart explains the three colors/series.
- Do not show the removed explanatory banner or the removed four metric summary cards.
- Empty state distinguishes no selected Iteration, no scheduled work, and missing snapshot history.

## 8. Acceptance examples

1. Changing a Task's ToDo today does not change yesterday's Remaining To Do bar.
2. A 5-point Story with `acceptedDate` on day 4 contributes 0 points on days 1-3 and 5 points from day 4 onward.
3. Moving that Story out of the Iteration on day 6 does not rewrite snapshots for days 1-5.
4. Re-estimating Tasks after Iteration start does not move the Ideal line.
5. When latest Remaining To Do is above Ideal, the report shows `Behind plan`; equality is `On track`.
6. Selecting `All Teams` sums the aligned Team snapshots and start baselines without double-counting stable Work Item or Task IDs.

## 9. Mockup limitation

`ITERATION_DAILY_SNAPSHOTS` and `buildFallbackSnapshots(...)` are display fixtures. The fallback is prohibited in production because historical Task ToDo cannot be reconstructed reliably.
