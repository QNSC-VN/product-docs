# Phase 6 Reports - Business and Data Contract

> **Authorization baseline (2026-08-10):** Reports are available to Workspace Admin plus assigned-Project `Admin` and `Viewer`; they remain read-only. `Editor` and `No Access` cannot open Reports. Server-side queries must enforce the selected Project boundary.

## 1. Document control

| Attribute | Value |
|---|---|
| Status | BA and mockup approved; ready for DEV handoff |
| Updated | 2026-07-31 |
| Scope | `Reports` with exactly three types: Iteration Burndown, Velocity, Team Capacity |
| Separate surface | Release Tracking remains under `Portfolio > Release Tracking` |
| Validation boundary | Documentation review only for this handoff; Playwright verification is not required by BA |

This document is the canonical Phase 6 report contract. If an older Phase 6 plan conflicts with this document or one of the report SRS files, this document and the report SRS take precedence.

## 2. Approved information architecture

- The `Reports` header has a `Type` selector beside the page title.
- `Type` contains exactly:
  1. Iteration Burndown;
  2. Velocity;
  3. Team Capacity.
- Only the selected report is rendered.
- Project and Team come from the global workspace context. A report must not create a second Project or Team filter.
- Iteration Burndown and Team Capacity have their own Iteration picker because they display one selected timebox.
- Velocity has a Last 5 / Last 10 completed-Iteration window because it compares multiple timeboxes.

## 3. Common scope and terminology

| Term | Contract |
|---|---|
| Project scope | Include only records belonging to the globally selected Project. |
| Selected Team | Include only records belonging to that Team. |
| All Teams | Aggregate all Teams in the selected Project. Team Capacity also preserves Team rows so they can expand to members. |
| Iteration timebox | A stable timebox identity. For an All Teams aggregate, DEV must align Team-specific Iterations by a shared timebox key; display name alone is not a safe key. |
| Scheduled work | Story or Defect currently assigned to the Iteration. Feature and Task points are not included in point totals. |
| Task scope | Tasks whose parent Story/Defect is in the selected Project, Team and Iteration scope. |
| Accepted-equivalent | The item has reached `Accepted`. A later `Release` state remains accepted-equivalent and must not make the item disappear from reports. |
| `acceptedDate` | Timestamp that established the item's current Accepted outcome; set on entering `Accepted`, retained into `Release`, cleared on reopen, and set again on a later re-acceptance. Audit/event history preserves every transition. |
| Points | `Story.planEstimate` or `Defect.planEstimate`. |
| Hours | Task `estimate`, `todo`, `actuals`, or persisted member capacity, depending on the metric. |

All timestamps and date cutoffs use the Workspace timezone. Store timestamps in UTC and convert to Workspace local date when applying an end-of-day or Iteration-end boundary.

## 4. Source-to-report matrix

| Source data | Iteration Burndown | Velocity | Team Capacity |
|---|---|---|---|
| Project / Team / Iteration | Query scope | Query and grouping scope | Query and grouping scope |
| Story/Defect `planEstimate` | Accepted Points snapshot | Three stacked point segments | Not used |
| Story/Defect `acceptedDate` | Determines whether accepted by snapshot date | Separates During and After | Not used |
| Task `estimate` | Fixed baseline captured at Iteration start | Not used | Current Estimate hours |
| Task `todo` | End-of-day Remaining To Do snapshot | Not used | Current ToDo hours |
| Task `actuals` | Not used | Not used | Current Actual hours |
| Member Iteration capacity | Not used | Not used | Capacity hours from Team Status |

## 5. Historical behavior by report

### 5.1 Iteration Burndown - frozen daily history

Burndown cannot reconstruct prior days from current Tasks. It requires one immutable start baseline and one idempotent daily snapshot per active Iteration and Workspace-local date.

- Past snapshots do not change when Task ToDo, scope, state, or estimate changes later.
- The Ideal line uses the estimate baseline captured once at Iteration start.
- A production screen must show an empty/no-history state when snapshots do not exist. It must not fabricate a historical curve from current values.

Detailed contract: `02_Iteration_Burndown/SRS.md`.

### 5.2 Velocity - real-time classification of current assignment

Velocity is recalculated from the current Story/Defect assignment, current accepted-equivalent state and persisted `acceptedDate`.

- Moving an item out of a completed Iteration removes it from that Iteration's current chart result.
- Moving an item into a completed Iteration adds it to that Iteration's current chart result.
- The acceptance timestamp determines whether its points are During, After, or Not Accepted.
- Velocity does not use a frozen end-of-Iteration snapshot.

Detailed contract: `03_Velocity_Chart/SRS.md`.

### 5.3 Team Capacity - live Team Status projection

Team Capacity is a read-only report projection of the same capacity and Task-hour sources used by Team Status.

- It must not maintain a separate capacity store.
- Capacity is persisted by Project, Team, Iteration and Member.
- Estimate, ToDo and Actual are current Task values in the selected scope.
- Changing the Iteration or global Team context recalculates every total and row.

Detailed contract: `04_Team_Capacity/SRS.md`.

## 6. Data quality rules

1. `planEstimate`, Task hour fields and capacity are numeric and cannot be negative.
2. `actuals` may exceed `estimate`; do not cap it.
3. `todo` is an independent remaining-work field; do not derive it as `estimate - actuals`.
4. A Story/Defect currently in `Accepted` or `Release` must have `acceptedDate`; a reopened item must not retain a current accepted date. Historical records require a controlled backfill before Velocity is considered trustworthy.
5. Aggregation must de-duplicate by stable Work Item or Task ID. This is especially important for All Teams.
6. Round only display values. Aggregate full-precision source values first, then display points/hours consistently (maximum two decimals unless the product-wide number format says otherwise).
7. Empty or unavailable data must produce an explicit empty/data-unavailable state, not a zero that could be mistaken for measured performance.

## 7. Mockup versus production

The approved React mockup is the visual and interaction contract, not proof of production data behavior.

- `VELOCITY_DATA` is representative static data.
- `ITERATION_DAILY_SNAPSHOTS` is representative static snapshot data.
- `TEAM_CAPACITY_DATA` is representative static member capacity data.
- `buildFallbackSnapshots(...)` exists only to keep the mockup visible when a fixture is missing. Production must never use equivalent fallback logic for historical Burndown.

DEV owns database persistence, scheduler/cron implementation, APIs, timezone handling, historical backfill, authorization, automated tests and deployment.

## 8. Report-level acceptance summary

| Report | Must prove |
|---|---|
| Iteration Burndown | Daily ToDo history is preserved; Accepted Points are cumulative by date; Ideal remains fixed after Iteration start. |
| Velocity | Each point belongs to exactly one of During, After, Not Accepted; trend and averages use During only. |
| Team Capacity | Totals use the same Team Status source; All Teams expands Team to Member; selected Team shows only that Team. |

## 9. Out of scope for this documentation handoff

- Production implementation details beyond the required logical data contract.
- Scheduler technology selection and operational monitoring design.
- Export file format and print styling.
- Saved report configurations and custom date ranges.
- Playwright execution or production readiness certification.
