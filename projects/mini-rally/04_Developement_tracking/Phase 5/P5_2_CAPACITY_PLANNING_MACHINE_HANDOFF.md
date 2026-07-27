# P5.2 Capacity Planning — Cross-machine Handoff

## Resume status

- Date: 2026-07-27
- Phase state: `P5.2 IMPLEMENTED -> BA REVIEW / TARGETED UAT PENDING`
- Do **not** close P5.2 or Phase 5. The user has explicitly said this slice remains open.
- Mockup scope only: session-level React state. This is not production API/persistence/RBAC evidence.

## What is implemented

1. `Portfolio > Capacity Planning` list, single-Release plan creation, Draft/Published actions and session state.
2. Plan detail `Teams by Total`:
   - Add Team, Draft capacity editing, capacity forecast, Team progress/hover breakdown.
   - Expanded Team Feature rows and Team-level `Add Features`.
3. Plan detail `Features`:
   - Rank/Name/Estimated/Rollup sort, Rank-only Capacity Cutline, unassigned warning, split Team subrows.
   - `Allocate to Teams` dialog supports one/many Teams; blank estimate snapshots refined Feature estimate, entered value is fixed manual allocation.
   - `Add Feature` adds an eligible Feature that is absent from the Plan as `Not assigned`; it must be allocated afterwards.
   - Right rail is `Team Capacity`, showing Team demand / capacity and overload warning.
4. No Preliminary Estimate mapping is hard-coded. User-defined Preliminary Estimate configuration is deferred to `Settings gear > Workspace > Project Management`.

## Confirmed business decisions

- Mini Rally hierarchy: `Workspace -> Project -> Team`.
- Capacity Planning is Single Release only. Release Planning is deferred.
- Feature has no Plan Estimate; allocation is fixed and plan-specific.
- A Feature may split allocation across Teams. Allocation never writes back to `Feature.projectId`.
- Team-level Add Features attaches directly to a Team. Features-tab Add Feature is a second, user-approved entry point and creates an Unallocated row.
- Published plans are read-only until explicit Revert to Draft.

## Evidence and remaining UAT

- `npm.cmd run build` passed on 2026-07-27 (only Vite chunk-size warning).
- Browser visual smoke confirmed CP-001 > Features, `Add Feature`, and `Team Capacity` rail.
- A transient Vite HMR error appeared while JSX was being edited; the final build and reloaded DOM rendered correctly.
- Still test before proposing P5.2 close:
  1. Add Feature selection with a seed Feature not already in the Plan.
  2. Apply Capacity Forecast.
  3. Per-tab sort retention.
  4. Publish/Revert behavior.
  5. Workspace Admin / Project Admin / Project Member matrix.

## Important files

- `03_Mockup Design/src/app/pages/CapacityPlanningPage.tsx`
- `03_Mockup Design/src/app/App.tsx`
- `03_Mockup Design/src/app/model.ts`
- `04_Developement_tracking/Phase 5/02_Capacity_Planning/SRS.md`
- `04_Developement_tracking/Phase 5/PHASE5_DEVELOPMENT_TRACKING.md`
- `07_Test Business/specs/PHASE5_TEST_SCENARIOS.md`

## Local run

```powershell
Set-Location 'D:\Mini_Rally_pj\03_Mockup Design'
npm.cmd run dev -- --host 127.0.0.1 --port 4175
```

## Copy-paste continuation prompt for Claude

```text
Continue work in D:\Mini_Rally_pj. Read 04_Developement_tracking/Phase 5/P5_2_CAPACITY_PLANNING_MACHINE_HANDOFF.md, 04_Developement_tracking/Phase 5/02_Capacity_Planning/SRS.md, 04_Developement_tracking/Phase 5/PHASE5_DEVELOPMENT_TRACKING.md, and 07_Test Business/specs/PHASE5_TEST_SCENARIOS.md before editing.

We are in Phase 5, P5.2 Capacity Planning. Do not close P5.2 or Phase 5. Follow the existing plan and ask the user for confirmation before any new business-rule/scope change. Preserve unrelated dirty worktree changes and do not stage/commit/push unless asked.

Current implementation is mockup-only React session state. Capacity Planning has Teams by Total and Features record-detail tabs. Preserve these approved rules: Single Release only; Workspace -> Project -> Team; allocation is plan-specific and may split across Teams; allocation never changes Feature.projectId; Feature has no Plan Estimate; no hard-coded Preliminary Estimate mapping; published plans are read-only until reverted.

Latest approved amendment: Features tab has a right Team Capacity panel (Team demand / capacity) and an Add Feature button. Add Feature adds an eligible Feature absent from the Plan as Not assigned; it does not auto-assign a Team. Expanded Team Add Features remains available and assigns directly to that Team.

First, inspect Git status and run the mockup. Then perform only the remaining targeted UAT listed in the handoff, record evidence in PHASE5_TEST_SCENARIOS.md and PHASE5_DEVELOPMENT_TRACKING.md, and present results for BA confirmation. Do not treat build or visual UI alone as phase acceptance.
```
