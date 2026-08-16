# Phase 6 Deployed Product Test Scenarios

All scenarios start as `Not Run`. Evidence and BA confirmation are recorded in `PHASE_0_6_AUDIT_TRACKER.xlsx`.

## A. Navigation, scope and common behavior

| ID | Pri | Test steps | Expected result |
|---|---|---|---|
| P6-COM-001 | P0 | Open Portfolio menu | Order is Portfolio Items, Capacity Planning, Release Tracking; Release Tracking is last |
| P6-COM-002 | P0 | Open Reports and inspect Type | Exactly Iteration Burndown, Velocity and Team Capacity are available |
| P6-COM-003 | P0 | Switch global Project/Team context | Every summary, row and chart uses the new scope; no duplicate page Project/Team filter |
| P6-COM-004 | P0 | Test Workspace Admin, Project `Admin`/`Editor` and unassigned user | Workspace Admin and assigned-Project `Admin` can use Release Tracking and Reports; `Editor` and unassigned users cannot open these surfaces; direct URLs do not leak data |
| P6-COM-005 | P1 | Open each Phase 6 route with empty valid scope | **Pass / BA confirmed 2026-08-14.** Disposable Project P6RT014 showed explicit empty states in Release Tracking, Iteration Burndown, Velocity and Team Capacity; no data was reused from another Project. |
| P6-COM-006 | P1 | Reload each selected view/filter | Selection and persisted business data remain consistent; no console error |

## B. Portfolio > Release Tracking

| ID | Pri | Test steps | Expected result |
|---|---|---|---|
| P6-RT-001 | P0 | Select a Release with Direct, Derived and Unparented data | Three bucket totals match RT-BR-01/02/04 and do not overlap |
| P6-RT-002 | P0 | Switch bucket selector | Only one bucket is listed; Rank restarts as 1..N |
| P6-RT-003 | P0 | Sort Rank, ID and Team both directions; resize columns | **Pass / BA confirmed 2026-08-14.** Sort directions and a real Name-column resize were verified; layout was restored afterward. |
| P6-RT-004 | P0 | Switch Chart Unit Points -> Count | List Status and all Burnup values switch together; bucket counts do not change |
| P6-RT-005 | P0 | Inspect Direct Feature status | Numerator/denominator uses all direct Story/Defect children, including other/unassigned Releases |
| P6-RT-006 | P0 | Inspect Derived Feature status | Only matching selected-Release and selected-scope children are included; no percentage is shown |
| P6-RT-007 | P0 | Use Completed, Accepted and Release child states | **Pass / BA confirmed 2026-08-14.** Controlled US-6 produced 3/3 accepted points at Accepted and Release, and 0/3 at Completed; restored to Accepted. |
| P6-RT-008 | P0 | Compare Burnup totals to controlled Work Items | Planned, Accepted and Preliminary totals follow RT-BR-06/07/08 and de-duplicate IDs |
| P6-RT-009 | P0 | Inspect Burnup history and axes | Title/date/unit/iteration row match Release; history is snapshot/event based; missing history is explicit |
| P6-RT-010 | P1 | Create partial and full Release mismatch | Red issue icon opens an unclipped grouped overlay; full mismatch warning is separate from percent done |
| P6-RT-011 | P1 | Click inside and outside Issues panel | Inside click keeps it open; outside click closes it |
| P6-RT-012 | P0 | Inspect views and placeholders | Chart is active; Breakdown is absent; Dependencies is absent or clearly disabled as Future |
| P6-RT-013 | P1 | Search each bucket and open an Unparented row | Search is bucket-scoped; row opens the shared full Work Item Detail |
| P6-RT-014 | P0 | Select Project with no Releases and Release with empty bucket | **Pass / BA confirmed 2026-08-14.** Disposable Project P6RT014 showed the explicit no-Release state; empty Release buckets showed correct messaging without fabricated history. The Project was archived afterward. |

## C. Reports > Iteration Burndown

| ID | Pri | Test steps | Expected result |
|---|---|---|---|
| P6-IB-001 | P0 | Select Team and Iteration | Header, date range and working-day x-axis match global scope and selected Iteration |
| P6-IB-002 | P0 | Compare daily Task ToDo snapshots | Remaining ToDo equals scoped end-of-day Task ToDo and past days remain frozen |
| P6-IB-003 | P0 | Accept a Story/Defect on a controlled date | Accepted Points becomes cumulative from acceptedDate; Release remains accepted-equivalent |
| P6-IB-004 | P0 | Reopen accepted work after prior snapshots | New snapshots exclude it; finalized old snapshots remain unchanged |
| P6-IB-005 | P0 | Add/remove/re-estimate Tasks after Iteration start | Ideal line remains based on immutable start estimate baseline and reaches zero at end |
| P6-IB-006 | P1 | Compare latest Remaining ToDo with Ideal | Above Ideal = Behind plan; equal/below = On track |
| P6-IB-007 | P0 | Switch Team -> All Teams | Aligned Team snapshots/baselines aggregate without duplicate IDs |
| P6-IB-008 | P0 | Test no Iteration, no work and missing snapshots | Three explicit empty/unavailable states appear; no fabricated curve |

## D. Reports > Velocity

| ID | Pri | Test steps | Expected result |
|---|---|---|---|
| P6-VEL-001 | P0 | Inspect eligible Iterations | Only ended, non-empty Iterations appear, ordered by end date |
| P6-VEL-002 | P0 | Seed During, After and Not Accepted items | Each item's points enter exactly one segment; stack sum equals scheduled points |
| P6-VEL-003 | P0 | Use Accepted/Release/Completed states | Release retains During/After; Completed is Not Accepted |
| P6-VEL-004 | P0 | Move Work Item into/out of completed Iteration | Chart recalculates from current assignment on next query |
| P6-VEL-005 | P0 | Reopen and re-accept an item | Current acceptedDate clears/recreates; classification uses latest current outcome |
| P6-VEL-006 | P0 | Switch Last 5/Last 10 | Bars, trend and Last/Best/Worst averages use selected window; default is Last 10 and the selected 5/10 window persists after reload |
| P6-VEL-007 | P1 | Use fewer than three Iterations | Averages use available sample and expose its size |
| P6-VEL-008 | P0 | Use Accepted/Release item without acceptedDate | Explicit data-quality error/unavailable state; system does not guess |
| P6-VEL-009 | P0 | Select Team and All Teams | Team scope filters; All Teams aligns by stable timebox key and de-duplicates Work Items |
| P6-VEL-010 | P0 | Select a scope with no eligible Iteration | Explicit empty state appears; loading finishes |

## E. Reports > Team Capacity

| ID | Pri | Test steps | Expected result |
|---|---|---|---|
| P6-TC-001 | P0 | Select Team and Iteration | Only selected Team plus members appear; title and date match scope |
| P6-TC-002 | P0 | Select All Teams | Team rows remain separate and expand/collapse to members |
| P6-TC-003 | P0 | Compare four totals to Team Status/Tasks | Capacity, Estimate, ToDo and Actual reuse the same source and match displayed rows |
| P6-TC-004 | P0 | Sum member -> Team -> All Teams | Every parent total equals displayed child totals without duplicate Task IDs |
| P6-TC-005 | P1 | Member has capacity but no Task | Member remains visible with capacity and zero Task hours |
| P6-TC-006 | P1 | Task owner has no capacity | Owner remains visible with 0h capacity and their Task hours |
| P6-TC-007 | P1 | Use a null-owner Task | Task hours appear only under `Unassigned` with 0h capacity and never under a named member |
| P6-TC-008 | P0 | Use Estimate 6, ToDo 2, Actual 8; complete and reopen Task | Values remain independent and unchanged by State; Actual is not capped and ToDo is not derived |
| P6-TC-009 | P0 | Change Iteration | Indicators and every Team/member row recalculate |
| P6-TC-010 | P0 | Inspect report controls | Read-only report has no capacity editing, Utilization card, progress bar or extra chart |
| P6-TC-011 | P0 | Test no capacity and no Task data | Explicit empty state explains missing scoped data |

## F. Cross-phase E2E regression

| ID | Pri | Test steps | Expected result |
|---|---|---|---|
| P6-E2E-001 | P0 | Create Epic -> Feature -> Story/Defect -> Task and assign Iteration/Release | Stable IDs and relationships are shared across Portfolio, Backlog, Detail, Iteration and Phase 6 views |
| P6-E2E-002 | P0 | Complete Tasks, accept parent and publish/report | **Pass / BA confirmed 2026-08-14.** TA-1 Completed auto-completed US-1; manual Accepted produced 3/8 Iteration points, 3/3 Release Tracking points and 3 Accepted-After Velocity points. Reopening TA-1 returned US-1 to In-Progress; temporary data was restored. |
| P6-E2E-003 | P0 | Change Project/Team/Release/Iteration context | **Fail / BA confirmed 2026-08-14.** AUDIT26 Work Item Detail exposed TEST Release `RE-1: P56-AUDIT Phase 5 Release` and TEST Team/Task roll-up values while Project remained AUDIT26. Valid Iterations were unavailable. Release Tracking route isolation passed. |
| P6-E2E-004 | P0 | Reload and sign out/in after mutations | **Pass / BA confirmed 2026-08-14.** Clean TA-1 retest verified Completed → US-1 Completed and reopened Defined → US-1 In-Progress; the result persisted after reload, sign-out/sign-in and TEST → AUDIT26 → TEST switching. |
