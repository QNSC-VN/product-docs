# Phase 6 Reports - Current Handoff Plan

## 1. Status

| Item | Status |
|---|---|
| Business scope | Confirmed |
| Mockup | BA approved |
| Report types | Iteration Burndown, Velocity, Team Capacity |
| Release Tracking | Separate Portfolio surface; BA/mockup approved and closed for DEV handoff in `01_Release_Tracking/SRS.md` |
| Business/data documentation | Complete for DEV handoff |
| Playwright | Deferred by BA; not required for this mockup approval |
| Production implementation and QA | DEV-owned |

This file replaces the earlier build/test-loop proposal. Earlier formulas for point-based Burndown, Planned-versus-Accepted Velocity, report tabs, Capacity utilization cards, and mandatory Playwright mockup testing are superseded.

## 2. Authoritative documents

Read in this order:

1. `PHASE6_REPORTS_BUSINESS_AND_DATA_CONTRACT.md` - cross-report scope, common terminology, data sources and historical behavior.
2. `02_Iteration_Burndown/SRS.md` - daily snapshots, Accepted Points and fixed Task Estimate ideal line.
3. `03_Velocity_Chart/SRS.md` - During/After/Not Accepted, trend and averages.
4. `04_Team_Capacity/SRS.md` - Team Status-based Capacity, Estimate, ToDo and Actual hours.
5. `01_Release_Tracking/SRS.md` - separate Portfolio Release Tracking classification, list, issues and Burnup contract.

## 3. DEV implementation sequence

### P6-RPT-01 - Shared report query contract

- Implement stable Project, Team, Iteration/timebox, Work Item, Task and Member identifiers.
- Apply Workspace timezone at date boundaries.
- Enforce Project/Team authorization before returning aggregates.
- Add accepted-equivalent state semantics and the confirmed `acceptedDate` transition rules.

### P6-RPT-02 - Burndown history

- Persist `totalTaskEstimateAtStart` once at Iteration start.
- Run an idempotent end-of-day snapshot job for active Iterations.
- Serve stored Remaining To Do and Accepted Points history.
- Never reconstruct missing past dates from current Tasks.

### P6-RPT-03 - Velocity query

- Recalculate eligible completed Iterations from current Story/Defect assignment.
- Split each item into During, After or Not Accepted using `acceptedDate`.
- Calculate Trend, Last 3, Best 3 and Worst 3 from During only.
- Support Last 5 and Last 10 windows.

### P6-RPT-04 - Team Capacity projection

- Reuse Team Status capacity storage and Task-hour sources.
- Return Capacity, Estimate, ToDo and Actual at Project/Team/Member levels.
- Support selected Team and All Teams expandable grouping.
- Reuse the Iteration picker behavior from Iteration Burndown.

### P6-RPT-05 - Production validation

DEV selects the automated test stack. Minimum coverage should include:

- formula unit tests and date/timezone boundaries;
- snapshot idempotency and missed-job recovery;
- selected Team versus All Teams aggregation and de-duplication;
- accepted-date data quality and historical backfill;
- authorization and empty/unavailable states;
- UI smoke/regression tests appropriate to the production implementation.

No Playwright result is claimed by this BA/mockup handoff.

## 4. Readiness definition

Phase 6 Reports is **DEV-handoff ready**, not production-ready. Production readiness requires DEV implementation, migration/backfill where necessary, scheduler operations, authorization verification, automated test evidence and deployment validation.
