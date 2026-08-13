# P5.2 Capacity Planning — Closed BA/Mockup Handoff

> **Historical handoff notice (2026-08-10, updated 2026-08-13 to 3-level):** Any Project Admin/Project Member or editable Capacity-permission wording below is superseded. Current authorization is defined in `02_Capacity_Planning/SRS.md` and Phase 4 `02_Roles_Permissions/SRS.md`: Workspace Admin company-wide; assigned-Project Admin manage; Editor/No Access hidden. (Access model is now 3-level: Workspace Admin / Admin / Editor; the former Viewer level is removed.)

## Resume status

- Date: 2026-07-28 (finalized after explicit user acceptance)
- Phase state: `P5.2 BA ACCEPTED + TARGETED UAT PASS + DOCUMENTS ALIGNED -> FEATURE CLOSED`
- P5.2 is closed for BA/mockup scope. The later P5.1 Epic amendment is also accepted and Portfolio Items has been re-closed. Phase 5 was closed on 2026-07-28 after BA removed Release Tracking from the active scope. Use `PHASE5_DEV_HANDOFF.md` for phase-level continuation.
- Mockup scope only: session-level React state. This is not production API/persistence/RBAC evidence.
- The five 2026-07-27 targeted UAT items remain done. The 2026-07-28 amendment scenarios through `P5-CP-034` now also pass in the browser. Build passes and the final console error log is empty.
- Git publication is not implied by this document. Re-check the live worktree before any stage/commit/push action.

## What is implemented

1. `Portfolio > Capacity Planning` list, single-Release plan creation, Draft/Published actions and session state.
2. Plan detail `Teams by Total`:
   - Add Team, Draft capacity editing, capacity forecast, Team progress/hover breakdown.
   - Expanded Team Feature rows and Team-level `Add Features`.
   - The expanded Feature row has no inline allocation input, `Split` control, `Remove from Team` control or `Unallocated Features in Plan` block. Each row has a settings-gear menu (`Move up` / `Move down` / `Allocate` / `Remove from Plan`) and two extra columns (`Allocation`, `Dependencies`).
3. Plan detail `Features`:
   - Rally-style Feature grid with `Rank`, `ID`, `Name`, `Planned Team Assignment`, `Team`, `Dependencies`, `Rollup`, `Estimated`, and `Complete` (C8-confirmed order).
   - It reuses the Feature-row language from `Teams by Total` but deliberately removes the progress-bar column. Complete/Rollup/Estimated are right-aligned numeric cells.
   - ID shows only the Feature ID. Do not add the `Feature` type badge back into this grid.
   - `Planned Team Assignment` is an inline Team selector only when the Feature has zero-or-one Team allocation. It is yellow `Not assigned` when empty; when one Team is selected the first option is `Unassign`, which clears the Team and returns to yellow. Split Features stay as `N teams` and are edited through Allocate.
   - Rank-only Capacity Cutline, unassigned warning, split Team subrows. The separate Features-tab intro/sort toolbar was removed; do not add it back unless BA explicitly reopens it.
   - Rank displays dense list order `1..N` from Plan allocation order, not sparse Portfolio rank values. Feature settings menu includes `Move up`, `Move down`, `Allocate`, `Remove from Plan`.
   - Rollup warning appears in the Rollup cell when `Rollup > Estimated`; Estimated warning appears when Preliminary, Refined and Allocated estimates are all missing.
   - `Allocate to Teams` dialog supports one/many Teams; blank estimate snapshots refined Feature estimate, entered value is fixed manual allocation.
   - `Add Feature` adds an eligible Feature that is absent from the Plan as `Not assigned`; it must be allocated afterwards.
   - Right rail is `Team Capacity`, showing Team demand / capacity and overload warning.
   - Capacity progress bars at Plan, Team and Feature levels show advisory exceed warnings. Plan/Team evaluate `Rollup > Estimated`, `Rollup > Capacity`, and `Estimated > Capacity`; Feature rows evaluate `Rollup > Estimated` only because they have no Capacity column. Team `Features` cells are left-aligned and show a red attention badge with the count of child Features requiring attention.
4. Capacity Planning uses a temporary Preliminary Estimate size-to-number mapping as the last tier of `Estimated`. It lives in `model.ts` and is shared with Portfolio Items. BA confirmed the Feature stores the XS-XL value; user-defined mapping remains deferred to `Settings gear > Workspace > Project Management`, so the current numeric values are mockup defaults rather than final product rules.

## Confirmed business decisions

- Mini Rally hierarchy: `Workspace -> Project -> Team`.
- Capacity Planning is Single Release only. Release Planning is deferred.
- Feature has no Plan Estimate; allocation is fixed and plan-specific.
- A Feature may split allocation across Teams. Allocation never writes back to `Feature.projectId`.
- Team-level Add Features attaches directly to a Team. Features-tab Add Feature is a second, user-approved entry point and creates an Unallocated row.
- Published plans are read-only until explicit Revert to Draft.
- Capacity Planner temporarily uses one Full/View permission; detailed action-level RBAC is deferred.
- Feature planning Estimated uses Team-assigned Total Allocated > Refined > Preliminary.
- Feature Complete is the live sum of Story/Defect Plan Estimate at `Completed`, `Accepted` or `Release`; Feature Rollup is the live sum of every linked Story/Defect Plan Estimate.
- Feature rows show Complete/Rollup/Estimated numbers without percentages. Features tab shows the whole-Feature total; expanded Team rows show that Team's slice. Team summary rows keep both number and percent of manually entered Team Capacity.
- Features-tab grid has no `State` or old `Planned Team` column. Planned allocation appears as `Planned Team Assignment`; Portfolio ownership appears separately as `Team`; `Dependencies` is a visual placeholder only.
- Quick assignment from the Features tab keeps an existing Unassigned allocation value if one exists; otherwise it snapshots the same default as the Allocate dialog (`Refined > Preliminary`). Split remains Allocate-dialog-only.
- Publish actions sit beside the Back button as a white square with blue vertical dots.
- Summary `Breakdown` is a click action beside the top Complete/Rollup/Estimated/Capacity metrics; it opens a read-only panel with the total composite bar and Complete/Rollup/Estimated/Capacity values. Each metric row has its own bar segment aligned to the same baseline as the top composite bar.
- Team Capacity rail must show the same warning rules as `Teams by Total` (`Rollup > Estimated`, `Rollup > Capacity`, `Estimated > Capacity`).
- There is no one-Team removal action in the current UI. `Remove from Plan` removes all allocations for the Feature across all Teams in the Plan.
- Preliminary Estimate is supplied during Feature creation and remains on the Feature right panel. Refined estimate fields appear immediately below Creation Date.

## Evidence and closure record

- `npm.cmd run build` passed on 2026-07-27 (only Vite chunk-size warning).
- `npm.cmd run build` passed again on 2026-07-28 after the latest amendments (only Vite chunk-size warning).
- `npm.cmd run build` passed again on 2026-07-28 after exceed-warning and tooltip-overlay amendments (only Vite chunk-size warning).
- `npm.cmd run build` passed again on 2026-07-28 after the Features-tab grid rebuild, quick assignment selector, rank/warning polish and summary Breakdown panel (only Vite chunk-size warning).
- `npm.cmd run build` passed again on 2026-07-28 after the `Unassign` selector, aligned Breakdown row bars and Features-tab toolbar removal (only Vite chunk-size warning).
- Browser visual smoke confirmed CP-001 > Features, `Add Feature`, and `Team Capacity` rail.
- A transient Vite HMR error appeared while JSX was being edited; the final build and reloaded DOM rendered correctly.
- Closure checklist - **all five completed 2026-07-27; see the session log and `PHASE5_TEST_SCENARIOS.md` for evidence**:
  1. ~~Add Feature selection with a seed Feature not already in the Plan.~~ Done - `P5-CP-017` Pass.
  2. ~~Apply Capacity Forecast.~~ Done - `P5-CP-016` Pass.
  3. ~~Per-tab sort retention.~~ Done - `P5-CP-014` Pass.
  4. ~~Publish/Revert behavior.~~ Done - `P5-CP-010` Partial Pass; the defect it exposed (`P5-CP-DEF-001`) is fixed.
  5. ~~Workspace Admin / Project Admin / Project Member matrix.~~ Done - `P5-CP-011` Partial Pass; the branch that was not executable is now unblocked.

The 2026-07-28 browser gate is complete:

1. `P5-PI-012` **Pass** - FE-318 right-rail field order and New Feature Preliminary Estimate.
2. `P5-CP-023` **Pass** - `8 Allocated` (`5 + 3`) -> `8 Refined` after Team allocations became zero; FE-315 remained `5 Preliminary` despite its Unallocated placeholder.
3. `P5-CP-024` **Pass, amended later** - allocation remains dialog-only; the current settings menu contains Allocate and Remove from Plan, with no inline Split/allocation editor.
4. `P5-CP-026` **Pass** - Project Admin Read-only kept list/detail/sort and removed all manage actions.
5. `P5-CP-027` **Pass** - Remove from Plan cleared FE-318 from both Teams and recalculated Demand to zero.
6. `P5-CP-028` **Superseded** - historical one-Team removal scenario. BA later removed `Remove from Team`; current removal is only `Remove from Plan`.
7. `P5-CP-030` **Pass** - Exceed warning rule: Data & Reporting naturally triggers `Rollup exceeds Estimated`; Team and Feature progress bars show a red warning triangle and fixed-overlay tooltip text. The Team `Features` cell shows the attention badge count, and badge hover reports `N Feature(s) require attention`.
8. `P5-CP-031` **Pass / Not a Defect after C8** - Features-tab grid uses `Rank`, `ID`, `Name`, `Planned Team Assignment`, `Team`, `Dependencies`, `Rollup`, `Estimated`, `Complete`; split rows and Feature menu behavior remain unchanged.
9. `P5-CP-032` **Pass** - Features-tab quick assignment selector: FE-315 rendered a yellow `Not assigned` combobox listing the Project Teams. FE-318 stayed as `2 teams`, because split changes remain in the Allocate dialog.
10. `P5-CP-033` **Pass** - Features-tab ranking/warnings and plan summary breakdown: ranks displayed `1`/`2`, Feature menu contained `Move up`, `Move down`, `Allocate`, `Remove from Plan`, Data & Reporting exposed `Rollup exceeds Estimated`, the Team Capacity rail surfaced the same warning, Publish actions moved beside Back, and `Breakdown` opened `By Points`.
11. `P5-CP-034` **Pass** - Features-tab unassign/breakdown polish: assigning FE-315 to `Core Platform` changed the selector's first option to `Unassign`; selecting it cleared the Team and returned to yellow `⚠ Not assigned`. The Features-tab intro/sort toolbar was absent while `Add Feature` remained. `Breakdown` opened `By Points` and each Complete/Rollup/Estimated/Capacity row had an aligned bar segment.

P5.2 was accepted and closed for BA/mockup scope on 2026-07-28. Production
implementation remains outside this handoff.

## Session log 2026-07-28

BA resolved two of the three prior open decisions and added two UI/behavior requirements:

1. Collapsed the three Capacity Planning action keys into one temporary `capacity_planning:manage` row. `Enabled` is Full; `Read-only` is View. Create, edit and publish use the same gate; Project scope remains an independent gate. Detailed RBAC is deferred.
2. Confirmed the estimate precedence as Team-assigned Total Allocated > Refined > Preliminary. `featureEstimated` now excludes allocation rows without a Team, aligning Feature Estimated with Team Demand. `topDownEstimate` remains Refined > Preliminary for the allocation dialog default and must stay separate.
3. Added `Remove from Plan` to the expanded Team Feature settings menu. It filters all allocation rows for the Feature, so a Feature split across two Teams is removed from both. The later BA review removed `Remove from Team`; do not reintroduce a one-Team removal action unless BA confirms a new replan flow.
4. Preliminary Estimate remains available in the New Feature modal and right panel. Refined Estimate and Refined Work Item Count Estimate moved immediately below Creation Date.
5. Updated P5.1/P5.2 SRS, tracker and test pack. Build passed.
6. Browser UAT passed for `P5-PI-012`, `P5-CP-023`, `-024`, `-026`, `-027`, and `-028`. The final browser console error log was empty. Reload restored the default in-memory permission matrix and Workspace Admin role after the Read-only test.
7. The metric amendment passed as `P5-CP-029`: FE-318 total was `0 / 6 / 8`, Data & Reporting `0 / 6 / 5`, and Core Platform `0 / 0 / 3` for Complete/Rollup/Estimated. Feature rows and tooltip showed numbers only, while Team rows and tooltip retained percentages. Moving US-4798 from `Completed` back to `In-Progress` changed FE-315 Complete from `5` to `0` without changing Rollup/Estimated (`5 / 5`). Build passed and a clean reload produced no new console errors.
8. The Features-tab grid rebuild passed as `P5-CP-031`: Rally-style columns are `Planned Team Assignment`, `Team`, `Dependencies`, `Rollup`, `Estimated`, `Complete` per C8; no Feature-grid progress bar; split allocation subrows and the `Allocate` / `Remove from Plan` menu remain.
9. The quick assignment amendment passed as `P5-CP-032`: ID no longer shows the type badge; `Not assigned` is yellow; zero-or-one allocation rows can be assigned/reassigned from `Planned Team Assignment`; split Feature rows remain `N teams` and are edited through Allocate. Direct assignment uses an existing unassigned value when present, otherwise `Refined > Preliminary`.
10. The rank/warning/breakdown amendment passed as `P5-CP-033`: rank display is dense `1..N`; Feature menu has Move up/down; Rollup/Estimated cells carry the warning triangles; Team Capacity rail reuses Team warning rules; Publish actions moved to the left near Back; summary `Breakdown` opens the plan-total panel.
11. The latest Features-tab polish passed as `P5-CP-034`: `Unassign` is available for one-Team Planned Team Assignment rows, the removed intro/sort toolbar stays out of the UI, and the Breakdown rows now carry aligned bar segments.

## Session log 2026-07-27 (Claude)

This session was picked up on a different machine after `git pull`, starting from HEAD `426731f`. It did two things: finished the five outstanding UAT items, then implemented six rounds of BA-directed business-rule changes on top. Tracker rows `P5-CAP-10` through `P5-CAP-16` carry the full detail; this section is the orientation a developer needs before editing.

### 1. Targeted UAT - all five closed

Two of the five were previously blocked, and both blockers were removed rather than skipped:

- "No eligible Feature outside the Plan" was solved by creating the precondition **through the product itself** (Portfolio Items > New Feature) instead of editing seed data. That way the real `Add Feature` path was exercised.
- Sort retention was initially **unfalsifiable**: the seeded capacities `13 / 10 / 8` make name-sort and capacity-sort produce identical row order. Core Platform capacity was lowered to `5` first so the two orders actually differ, then the assertion was made. If you re-run this test, do the same - otherwise a passing result proves nothing.

Read-only enforcement after Publish was verified against the accessibility tree, not screenshots, so "looks disabled" was never accepted as evidence.

### 2. Defects found and fixed in this session

| ID | What was wrong | Fix |
|---|---|---|
| `P5-CP-DEF-001` | Full `Publish` silently lost `plannedEndDate`. `publishCapacityPlan` wrote `release.releaseDate` (human-readable, e.g. `"Feb 1, 2025"`) into a field rendered as `<input type="date">`, which only accepts ISO `YYYY-MM-DD` and discarded it. Seeded Features already use ISO, so the writer was the wrong side. | Promoted the existing `toDateInputValue` helper from `IterationsPage.tsx` into `model.ts` and wrapped the write with it. `plannedStartDate` intentionally still carries the human-readable value because that field is free text per the P5.1 SRS. |
| `P5-CP-DEF-002` | The Teams-by-Total `Sort` control lived inside the `editable`-gated action bar, so every read-only viewer lost Team sorting while the Features tab kept its own sort. | The action bar always renders; only the two mutating buttons carry the `editable` gate. Sorting is a read action. |
| `P5-CP-DEF-003` | **Self-inflicted, caught during verification.** Widening the Team picker to all Project Features let a non-Release-matching Feature be added, but all five display lookups still resolved Features through `eligibleFeatures`, which excludes it - so the allocation counted toward the Team's `Features` total while its row silently vanished. Observed as `Features 3` with 2 rows. | All display lookups resolve against the full Feature list. `getPlanFeature` now carries a comment saying an eligibility-filtered list must never be passed to it. **If you add another Feature display, use the full list.** |

### 3. Business rules that changed - read before editing

1. **Graded Capacity Planner permission (historical; superseded 2026-07-28).** The Phase 4 role matrix in `Settings > Workspace > Roles & Permissions` now actually gates Capacity Planning. Previously it was display-only local state inside `SettingsPage`; it was lifted into `App.tsx` and is passed to both `SettingsPage` and `CapacityPlanningPage`. This 2026-07-27 version used three separate permissions. The current implementation uses one temporary `capacity_planning:manage` Full/View row; see the 2026-07-28 log.
2. **Project Member only sees Published plans.** Enforced in both the list filter and the active-plan resolver, so a Draft plan is unreachable even through stale state.
3. **Team-level `Add Features` ignores Release.** It lists every Feature across the Project's Teams (`projectFeatures`), not the Release-filtered `eligibleFeatures`. It also keeps already-added Features visible, greyed, marked `Added`, instead of removing them. `eligibleFeatures` still drives the plan-level picker and the `Eligible` counter - the two are deliberately different and must not be merged.
4. **Allocation has exactly one value-editing surface.** The Allocate dialog. The inline Rollup input, the `Split` control, one-Team removal and the whole `Unallocated Features in Plan` block were removed. The 2026-07-28 `Remove from Plan` action is the explicit way to drop the Feature and all of its Team rows from the Plan.
5. **`Estimated` is now three-tier: Total Allocated > Refined > Preliminary.** Two guards matter:
   - The value offered as the **default when allocating** (`topDownEstimate`) uses only Refined > Preliminary. Folding Total Allocated back in would be circular - a blank Estimate field would commit the sum of the allocations that blank field exists to create. **Do not "simplify" these two functions into one.**
   - `featureEstimated` returns a `source` label (`ALLOCATED` / `REFINED` / `PRELIMINARY`) that the UI shows. The seeded numbers coincide across tiers (FE-318 is `8` under both Allocated and Refined; FE-315 is `5` under both Allocated and Preliminary), so **the label is the only thing that discriminates the tiers when testing**.
   - **Revised 2026-07-28:** Total Allocated includes Team-assigned rows only. Unallocated placeholders do not override Refined/Preliminary.
6. **`Allocation` and `Dependencies` columns** on the expanded Team Feature table. `Allocation` reads `From {Feature's own Team}` when the row's Team differs from `feature.team`, and `—` on the Feature's own Team row. `Dependencies` is a placeholder showing `—`; nothing is modelled behind it.

### 4. Layout debt introduced knowingly

Adding `Allocation` and `Dependencies` made the expanded Feature table nine columns wide. The identity block was already at its floor - measured `370px = 30 + 44 + 74 + 180 + 130`, with `Name` pinned at its `180px` minimum - so the columns could not fit beside the Team row. The table now scrolls horizontally inside `FEATURE_TABLE_MIN_WIDTH` (1180px). **Consequence:** the column-for-column alignment with the Team row that `P5-CAP-09` deliberately built now holds only until the table is scrolled. This was accepted in preference to crushing `Name`. If a future change needs that alignment back, the space has to come from somewhere else - the 240px progress-bar column and the empty 92px column are the two candidates.

### 5. Session-only test artifacts

State is in-memory, so nothing below survives a reload, but be aware if you inspect screenshots or re-run tests:

- `FE-323 "UAT Probe - Capacity Add Feature"` was created in NXP through the UI to unblock `P5-CP-017`.
- `REL-005 Mobile App MVP R1` was added to **seed data** (this one is permanent) so that a second Project has a Release. Without it the `MOB` Capacity Plan cannot be created and the Project-Admin-in-unmanaged-Project branch of `P5-CAP-AC-010` is untestable. It intentionally keeps the human-readable date convention so it also exercises the `P5-CP-DEF-001` fix.

## Decision log

All P5.2 closure decisions were resolved on 2026-07-28.

### Q1 - Capacity Planner permission

**Resolved:** temporarily use one `capacity_planning:manage` Full/View permission. Detailed RBAC will be defined later.

### Q2 - Total Allocated and Unallocated rows

**Resolved:** only Team-assigned rows count. An Unallocated placeholder does not override Refined or Preliminary.

### Q3 - Team picker eligibility

**Resolved at closure:** Archived and Cancelled Features remain excluded because
they are not actionable planning demand. The Team-level picker still ignores
Release and lists active Features across the Plan Project.

## Important files

- `03_Mockup Design/src/app/pages/CapacityPlanningPage.tsx` - the whole feature. Key functions: `canManageCapacityPlan` (two-gate permission), `topDownEstimate` vs `featureEstimated` (do not merge - see session log §3.5), `getPlanFeature` (never pass a filtered list), `moveAllocationRank`, `applyFeatureAllocations`, `AddFeaturesModal`, `AllocateDialog`.
- `03_Mockup Design/src/app/App.tsx` - owns `permissionMatrix` state (lifted out of SettingsPage so the matrix gates other screens) and `publishCapacityPlan`.
- `03_Mockup Design/src/app/model.ts` - `toDateInputValue`, `PRELIMINARY_ESTIMATE_*_FALLBACK`, `CapacityPlan` types, `REL-005` seed.
- `03_Mockup Design/src/app/pages/SettingsPage.tsx` - `PROD_ROLE_ACTION_MATRIX`, the temporary `capacity_planning:manage` Full/View row, `permissionAllows`, and the intentionally locked `WA` column.
- `04_Developement_tracking/Phase 5/02_Capacity_Planning/SRS.md` - business rules. §8 Allocate dialog, §9 expanded Team table incl. the new columns, §10 the two picker scopes, §11 the three-tier Estimated + Preliminary mapping table.
- `04_Developement_tracking/Phase 5/PHASE5_DEVELOPMENT_TRACKING.md` - `P5-CAP-10`..`P5-CAP-18`; `P5-CAP-08` holds the closure gate.
- `07_Testing Plan/02_test_phase_5_6/PHASE5_TEST_SCENARIOS.md` - historical evidence plus the 2026-07-28 Pass evidence for `P5-PI-012`, `P5-CP-023`, `-024`, `-026`..`-028`.

## Local run

```powershell
Set-Location 'D:\Mini_Rally_pj\03_Mockup Design'
npm.cmd run dev -- --host 127.0.0.1 --port 4175
```

## Historical continuation prompt

```text
This machine handoff is retained as the detailed P5.2 history. It is superseded for phase-level continuation by `PHASE5_DEV_HANDOFF.md`. Do not resume the old P5.3 Release Tracking prompt: BA removed that screen from Phase 5 and selected future Reports as the preferred observation direction. Do not stage/commit/push unless asked.

Capacity Planning targeted browser scenarios pass through P5-CP-034. Do not reopen P5.2 behavior unless the user explicitly requests a change. Archived and Cancelled Features remain excluded from Team-level Add Features; active Features across the Project remain visible without a Release filter.

Preserve these approved rules: Single Release only; Workspace -> Project -> Team; allocation is plan-specific and may split across Teams; allocation never changes Feature.projectId; Feature has no Plan Estimate; published plans are read-only until reverted; temporary Capacity Planner RBAC is one Full/View row and Workspace Admin stays locked Full; Project Member sees Published plans only; allocation is edited only in the Allocate dialog; there is no `Remove from Team`; `Remove from Plan` removes all rows for the Feature; Estimated resolves Team-assigned Total Allocated > Refined > Preliminary while the allocate-time default stays Refined > Preliminary; Complete is the live total of child Plan Estimate at Completed or later; Rollup is all linked child Plan Estimate; Feature rows show numbers only, Features tab shows totals, expanded Team rows show Team slices, and Team summaries keep number plus percent of manual Capacity. Exceed warnings are advisory: Plan/Team warn on Rollup > Estimated, Rollup > Capacity and Estimated > Capacity; Feature rows warn on Rollup > Estimated.

Two traps to avoid: never pass an eligibility-filtered Feature list to getPlanFeature (it silently hides allocations - that was P5-CP-DEF-003), and never merge topDownEstimate into featureEstimated (it makes a blank Estimate field circular).

When testing sort or estimate tiers, note the seed values coincide across tiers, so change a value first or read the source label - otherwise a pass proves nothing. Verify read-only states against the accessibility tree, not screenshots. Do not treat build or visual UI alone as phase acceptance.
```
