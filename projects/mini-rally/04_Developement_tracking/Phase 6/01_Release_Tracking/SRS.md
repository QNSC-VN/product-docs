# Phase 6 — Portfolio > Release Tracking

> **Project Access:** Workspace Admin and `Admin` in the assigned Project can use Release Tracking controls; `Viewer` is read-only; `Editor` and `No Access` cannot open this surface.

## 0. Document control

| Attribute | Value |
|---|---|
| Status | BA and mockup approved; Release Tracking scope closed for DEV handoff |
| Updated | 2026-07-31 |
| Navigation | `Portfolio > Release Tracking`, shown as the final item in the Portfolio menu |
| Delivery boundary | Business rules, logical data contract and clickable mockup |
| Production status | Not implemented or certified by this package |

This SRS is the canonical contract for Release Tracking. If an older plan, mockup note or report document conflicts with it, this SRS takes precedence for this surface.

## 1. Scope boundary

This package defines BA rules and a clickable mockup only. Production implementation, persistence, event-history storage, APIs, performance hardening, and deployment remain DEV responsibilities.

Release Tracking is a dedicated page under `Portfolio > Release Tracking`. It is no longer a generic card inside `Reports`.

The global workspace picker is the only Project/Team scope control. Release Tracking must not render a second Project or Team dropdown in its page header.

## 2. Primary user goal

For one selected Project, Team scope and Release, the user can:

- see Features assigned directly to the Release;
- see Features derived into the Release through Story/Defect children;
- see release-assigned Story/Defect items without a parent Feature;
- inspect accepted progress and burnup in Points or Count using one shared `Chart Unit` selector;
- use the Chart view only. Breakdown is not part of the approved slice. Dependency analysis is not part of the approved slice and is tracked as Future Backlog item `FB-P6-001`.

## 3. Classification rules

Let `R` be the selected Release and `S` be the current Project/Team scope:

- `All Teams`: every Team in the selected Project belongs to `S`;
- selected Team: only that Team in the selected Project belongs to `S`.

Classification uses the owning fields on Feature or Story/Defect. It must not infer group membership from completion percentage or from the percentage of children whose Release matches.

### RT-BR-01 — Features in Release

A Feature belongs to `Features in Release` when:

```text
Feature.releaseId = R
AND Feature.teamProjectId belongs to S
```

Summary value:

```text
Features in Release = COUNT(DISTINCT Feature.id satisfying the rule above)
```

### RT-BR-02 — Derived Features

A Feature belongs to `Derived Features` when:

1. `Feature.releaseId != R` (including an unassigned Feature); and
2. at least one direct child Story or Defect has `Child.releaseId = R` and `Child.teamProjectId` belongs to `S`.

Summary value:

```text
Derived Features = COUNT(DISTINCT Feature.id
  WHERE Feature.releaseId != R
    AND EXISTS direct Story/Defect child
      WHERE Child.releaseId = R
        AND Child.teamProjectId belongs to S)
```

The Feature is deduplicated by Feature ID and cannot appear in both `Features in Release` and `Derived Features` for the same selected Release.

Example: F1 is assigned to Release A and has at least one Story assigned to Release B. F1 appears:

- under `Features in Release` when filtering Release A;
- under `Derived Features` when filtering Release B.

### RT-BR-03 — Child without Release

A Story/Defect without a Release:

- remains included in its parent Feature progress;
- is not counted in Planned/Accepted Release totals;
- is not displayed as a tracked Release item;
- does not cause its parent Feature to become Derived for any Release.

This means “not assigned to a Release” is treated as “not ready for Release Tracking”.

### RT-BR-04 — Unparented Story/Defect

A Story/Defect belongs to `Unparented User Stories and Defects` when:

```text
StoryOrDefect.releaseId = R
AND StoryOrDefect.teamProjectId belongs to S
AND StoryOrDefect.portfolioItemId IS NULL
```

Summary value:

```text
Unparented = COUNT(DISTINCT StoryOrDefect.id satisfying the rule above)
```

An Unparented item appears only under its own Release and current Project/Team scope. It does not appear under every Release filter.

The three summary groups are independent and mutually exclusive for one selected Release: Direct and Derived are disjoint Feature groups because their Feature `releaseId` conditions are opposites; Unparented contains only Story/Defect items without a Feature parent.

### RT-BR-05 — Chart Unit and Status

`Chart Unit` is the single unit selector for both the list Status column and the Burnup chart. It has two values:

- `Points`: aggregate `Story/Defect.planEstimate`;
- `Count`: count Story/Defect items. It never counts Features.

For a Direct Feature, Status uses every direct Story/Defect child, including a child assigned to another Release or without a Release:

```text
Direct total = SUM(child.planEstimate) or COUNT(child)
Direct accepted = SUM/COUNT(child WHERE state IN {Accepted, Release})
Direct percent = Math.floor(Direct accepted / Direct total * 100)
```

The cell displays the floored percentage and `accepted/total` in the selected Chart Unit.

For a Derived Feature, Status uses only direct Story/Defect children whose `releaseId = R` and whose Team/Project ownership belongs to current scope `S`:

```text
Derived total = SUM(child.planEstimate) or COUNT(child)
Derived accepted = SUM/COUNT(child WHERE state IN {Accepted, Release})
```

The Derived cell displays `accepted/total` only; it does not display a percentage.

Tasks are excluded because Plan Estimate and release classification are owned by Story/Defect in this model.

## 4. Release totals and chart semantics

### 4.1 Tracked Release work-item population

The Burnup chart and its three totals use one leaf-item population:

```text
TrackedLeaves(R, S) = DISTINCT Story/Defect
  WHERE item.releaseId = R
    AND item.teamProjectId belongs to S
```

This population includes children of Direct Features, children that cause Derived Features, and Unparented Story/Defect items. De-duplicate by stable Work Item ID. Feature rows themselves and Tasks are never counted as Release work items.

### RT-BR-06 — Planned

For selected Release R:

`Planned Points = sum(Plan Estimate of Story/Defect where Item.Release = R)`

Unassigned items are excluded.

With the selected scope applied:

```text
Planned(R, S, Points) = SUM(TrackedLeaves(R, S).planEstimate)
Planned(R, S, Count)  = COUNT(TrackedLeaves(R, S))
```

### RT-BR-07 — Accepted

For selected Release R:

`Accepted Points = sum(Plan Estimate of Story/Defect where Item.Release = R and State in {Accepted, Release})`

This follows the confirmed Phase 6 reporting rule: Accepted is measured per Release.

```text
Accepted(R, S, Points) = SUM(item.planEstimate
  WHERE item IN TrackedLeaves(R, S)
    AND item.state IN {Accepted, Release})

Accepted(R, S, Count) = COUNT(item
  WHERE item IN TrackedLeaves(R, S)
    AND item.state IN {Accepted, Release})
```

`Completed` is not accepted-equivalent and does not contribute to Accepted.

### RT-BR-08 — Preliminary Estimate

The chart’s Preliminary Estimate line is the sum of the top-down Feature estimate for direct and derived Features in the selected Release and current Team scope.

- Chart Unit `Points`: use `Feature.refinedEstimate` when present; otherwise use the configured Preliminary Estimate size-to-points mapping.
- Chart Unit `Count`: use `Feature.refinedWorkItemCountEstimate`. The mockup may fall back to the current direct-child count when this optional fixture field is absent; production must distinguish that fallback from a saved top-down estimate.

This is a planning reference line, not the denominator of Feature progress.

```text
Preliminary(R, S, Points) = SUM(topDownPointEstimate(feature))
Preliminary(R, S, Count)  = SUM(topDownCountEstimate(feature))
WHERE feature IN DirectFeatures(R, S) UNION DerivedFeatures(R, S)
```

De-duplicate Features by stable Feature ID before summing.

### RT-BR-09 — Burnup history

The mockup demonstrates the visual contract only. DEV must derive historical series from immutable snapshots or auditable field-change events. The current data model contains only present-state records and cannot reconstruct a trustworthy historical burnup.

For each chart date `d`, production data must provide values as known at the end of that Workspace-local day:

```text
Accepted(d) = Accepted value for TrackedLeaves(R, S) as of end-of-day d
Planned(d)  = Planned value for TrackedLeaves(R, S) as of end-of-day d
Preliminary(d) = top-down Feature estimate as of end-of-day d
Ideal(d) = ideal accepted trajectory from 0 at Release start
           to the approved Release target at Release end
```

The approved Release target for `Ideal` must come from a persisted planning baseline. DEV must not silently use today's mutable Planned value to reconstruct an old ideal line. If that baseline or history is unavailable, return an explicit unavailable/partial-history state.

The mockup's generated curves are representative fixtures only; their intermediate values are not production formulas.

Burnup axis labels:

- Y-axis label is `Work Items Total Points` when Chart Unit = `Points`.
- Y-axis label is `Work Items Total Count` when Chart Unit = `Count`.
- X-axis shows dates and a secondary iteration-name row for the iterations crossed by the selected Release and current Project/Team scope.

## 5. Page contract

- Navigation: `Portfolio > Release Tracking`.
- Portfolio menu order: `Portfolio Items`, `Capacity Planning`, `Release Tracking`.
- Header: Release selector, start/end dates and previous/next Release controls. Project/Team comes from the global workspace context and is displayed as read-only context, not as a second filter.
- `Chart Unit` is the only unit selector. It defaults to Points and controls both the list Status values and the Burnup chart values.
- Views:
  - Chart: Accepted, Planned, Preliminary Estimate, and Ideal lines.
  - Breakdown: not implemented in the approved slice and must not be shown as an active view.
  - Dependencies: not implemented in the approved slice. If a placeholder remains visible in the mockup, it must state `Future`/not available and must not imply an active feature. Future behavior is tracked as `FB-P6-001`.
- Summary buckets are mutually exclusive for the selected Release:
  - Features in Release;
  - Derived Features;
  - Unparented Stories & Defects.
- The list filter displays one bucket at a time, matching the mockup. Direct, Derived and Unparented rows are not mixed into one default list.
- Rank is numeric and sequential inside the active bucket. Derived Features use `1, 2, 3...`; they do not use a `D` rank marker.
- Columns are `Rank`, `ID`, `Team`, `Issue`, `Name`, and `Status`. Columns are horizontally resizable.
- Rank, ID and Team support ascending and descending sorting.
- Team column shows Feature Team for Direct, the scoped child Team(s) that caused inclusion for Derived, and the item Team for Unparented.
- A Direct Feature displays an Issue warning when at least one direct child has a non-null `releaseId` different from the selected Release. An unassigned child does not trigger the warning.
- Issue warning is a red triangle/exclamation icon. Clicking it opens an Issues panel grouped by issue type.
- The Issues panel overlays the page above the grid/chart content. Clicking outside the panel closes it.
- The Issues panel lists each mismatched Story/Defect and labels the comparison as the selected Release name plus selected Release date window, not the mismatched item's own Release date.
- `% Done` and Issues are independent. A Feature can be 100% complete and still show 100% release mismatch.
- If every release-assigned child item mismatches the selected Release, the panel shows a separate full-mismatch warning because the Feature `releaseId` may be stale or assigned to the wrong Release.
- The panel groups issues by issue type. The approved type in this slice is `Release mismatch`; adding other issue types requires a separate BA rule.
- The panel also shows Feature planned dates, Teams involved, total-point progress, Story progress and Defect progress. Progress is calculated from all direct children and remains independent from mismatch classification.
- Search applies within the active bucket.
- Selecting an Unparented item opens its full Work Item detail.

### 5.1 Empty and unavailable states

- No Release in the selected Project: show an explicit no-Release state; do not reuse another Project's Release.
- Valid Release with no rows in the active bucket: show an empty bucket state while keeping all three summary totals visible.
- No historical Burnup data: show unavailable/partial history. Do not render a fabricated zero history as measured data.
- Points with missing `planEstimate`: apply the product-wide estimate validation rule; do not silently count the missing value as a Feature point.

### 5.2 Authorization boundary

The UI may request only Projects and Teams visible to the current user. The production query must enforce the same Project/Team authorization before classification and aggregation; hiding rows in the browser is not sufficient authorization.

## 6. Logical data contract

| Entity / field | Required use |
|---|---|
| Release `id`, `name`, `startDate`, `releaseDate`, `projectId` | Release selection, title, comparison window and chart range |
| Feature `id`, `releaseId`, `projectId`, `teamId`, `rank` | Direct/Derived classification, scope, list identity and ordering |
| Feature `refinedEstimate`, `refinedWorkItemCountEstimate`, `preliminaryEstimate` | Preliminary Feature Estimate line and total |
| Feature planned start/completion | Issues panel context |
| Story/Defect `id`, `featureId`, `releaseId`, `projectId`, `teamId` | Parent relation, Release population, scope and mismatch detection |
| Story/Defect `state`, `planEstimate` | Accepted/Planned status and Points/Count aggregation |
| Iteration `id`, `name`, `startDate`, `endDate`, `projectId`, `teamId` | Secondary timebox labels beneath the Release chart |
| Release history snapshots or auditable events | Historical Accepted, Planned and Preliminary series |
| Persisted Release ideal baseline | Stable Ideal trajectory |

Stable IDs are mandatory for joins and de-duplication. Display names are not valid join keys.

### 6.1 Query/result responsibilities

The production boundary may be implemented with any API shape, but it must return enough information to prove:

1. the selected Release and authorized Project/Team scope;
2. all three mutually exclusive bucket totals and the active bucket rows;
3. Direct/Derived/Unparented classification evidence;
4. Status numerator, denominator and selected unit;
5. mismatch issue items plus the selected Release comparison window;
6. historical chart points and an explicit history-quality state.

## 7. Acceptance examples

1. Feature F1 has `Release A`; Story S1 under F1 has `Release B`. Filtering A shows F1 as direct; filtering B shows F1 as Derived.
2. Story S2 under F1 has no Release. S2 contributes to F1 total/accepted progress but does not appear in any Release list or total.
3. Defect D1 has `Release B`, belongs to Team T1 and has no Feature. It appears in Unparented only when filtering Release B and a scope containing T1; it does not appear under Release A or another Team.
4. Completed is not Accepted. A Completed item contributes to planned totals but not accepted totals until its state becomes Accepted or Release.
5. Feature F2 belongs to Release B, so it cannot be counted as Derived for Release B even if only some of its children belong to B; classification uses `Feature.releaseId`, not a child-match percentage.
6. Chart Unit changes from Points to Count. Summary bucket counts do not change, while every Status numerator/denominator and Burnup series switches from Plan Estimate sums to Story/Defect counts.
7. All Teams shows every authorized Team in the selected Project. Selecting Team T1 recomputes the three bucket totals, list rows, status values, issues and Burnup from T1 scope only.
8. Feature F3 is 100% accepted but every release-assigned child points to another Release. Status remains 100%, the red issue icon remains visible, and the popup shows the full-mismatch warning.
9. A user clicks outside an open Issues panel. The overlay closes; clicks inside the panel do not close it.

## 8. Acceptance checklist

| ID | Acceptance condition |
|---|---|
| RT-AC-01 | Release Tracking is the final item in the Portfolio menu. |
| RT-AC-02 | Global Project/Team scope drives summary, list, issues and chart; no duplicate page-level Project/Team filter exists. |
| RT-AC-03 | Direct, Derived and Unparented totals match RT-BR-01, RT-BR-02 and RT-BR-04 and do not overlap. |
| RT-AC-04 | The bucket selector shows one list at a time; Rank is sequential within that list. |
| RT-AC-05 | Rank, ID and Team sort both directions; columns resize; Name wraps. |
| RT-AC-06 | One Chart Unit selector changes Status and chart between Points and Count. |
| RT-AC-07 | Direct Status uses all direct children; Derived Status uses matching Release/scope children only. |
| RT-AC-08 | Accepted includes `Accepted` and `Release`, excludes `Completed`, and is measured per selected Release. |
| RT-AC-09 | The Burnup title, date range, Y-axis label and iteration row reflect the selected Release and unit. |
| RT-AC-10 | A mismatch icon opens an unclipped overlay grouped by issue type; outside-click closes it. |
| RT-AC-11 | Full mismatch is warned separately and remains independent from `% Done`. |
| RT-AC-12 | Breakdown and Dependencies are not exposed as active approved capabilities. |

## 9. Confirmed decisions and superseded wording

`RT-Q-01` is superseded by the final scoped rule: an Unparented Story/Defect appears only when its own `releaseId` equals the selected Release and its Team/Project ownership belongs to the current scope.

The earlier Derived `D` rank marker is superseded: Derived rows use numeric sequential rank in their own bucket.

The earlier separate `Grid Unit` control is superseded: `Chart Unit` controls both list and chart.

The earlier active Breakdown view is superseded: Breakdown is not part of the approved slice.

## 10. Future backlog

| ID | Capability | Promotion gate |
|---|---|---|
| `FB-P6-001` | Release dependency analysis and cross-release risk view | Define supported item types, dependency direction, circular-link validation, risk severity, roll-up, permissions and navigation before enabling the view. |

## 11. Readiness statement

Release Tracking is **BA/MOCKUP APPROVED and DEV-HANDOFF READY**. It is not production-ready. DEV owns persistence, historical capture, API design, authorization enforcement, performance, automated tests, migration/backfill, scheduler/operations where required, and deployment validation.
