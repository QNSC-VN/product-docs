# Phase 5 Test Scenarios - Portfolio Module

Phase 5 validates the BA/mockup behavior for the Portfolio module. The active scope is Portfolio-only: Portfolio Items, Capacity Planning and Release Tracking. Release Planning, Generic Reports, Theme/Initiative, API payloads, database persistence and server-side authorization are outside this document until separately planned.

## P5-PI - Portfolio Items

| ID | Priority | Scenario | Steps | Expected result | Status |
|---|---|---|---|---|---|
| P5-PI-001 | P0 | Portfolio Items navigation | Open `Portfolio > Portfolio Items` as Workspace Admin | Portfolio Items opens as the first Portfolio dropdown entry and shows the confirmed Feature grid | Pass (runtime smoke 2026-07-26) |
| P5-PI-002 | P0 | Project-scoped list | Switch workspace context between `NXP` and `MOB` | Portfolio list shows only Features for the selected Project context | Pass (runtime smoke 2026-07-26: NXP excludes MOB Feature) |
| P5-PI-003 | P0 | Workspace Admin edit | As Workspace Admin in `NXP`, edit Feature Name, State, Release, Project, Team and Owner from the list | Inline edits apply immediately; changing Project resets Team and invalid Release to `Unscheduled` | Not Run |
| P5-PI-004 | P0 | Project Admin managed Project | As Project Admin in managed Project `NXP`, create/edit/archive a Feature | Allowed actions are available only inside the managed Project | Not Run |
| P5-PI-005 | P0 | Project Admin unmanaged Project | As Project Admin, switch to an unmanaged Project such as `MOB` | Portfolio remains visible but create/edit/archive controls are read-only or absent | Not Run |
| P5-PI-006 | P0 | Project Member read-only Portfolio | As Project Member in assigned `NXP / Core Platform` context, open Portfolio Items | Portfolio is visible; New Feature and editable controls are absent; restricted Portfolio sub-features remain unavailable | Pass (runtime smoke 2026-07-26) |
| P5-PI-007 | P0 | Project-scoped Release options | Open/create/edit a Feature in `NXP`, then inspect Release selectors; switch a Feature to `MOB` | Release choices are limited to the Feature Project; `MOB` has no `Nexus Platform` Release choices and defaults to `Unscheduled` | Pass (runtime smoke 2026-07-26) |
| P5-PI-008 | P0 | Create Feature paths | Use `Create Feature` and `Create with details` | Both create a Feature in the current Project/Team; the details path opens the new Feature Detail page | Not Run |
| P5-PI-009 | P0 | Feature detail backing fields | Edit Description, Notes, What Success Looks Like and attachment metadata, then navigate away and reopen the Feature | Values remain in the session-level Feature state and are not display-only placeholders | Pass (runtime smoke 2026-07-26: seeded backing state visible; edit persistence remains BA/UAT path) |
| P5-PI-010 | P0 | Archive Feature | Archive a Feature from Feature Detail, confirm the dialog, then inspect Active/Archived/All filters | Feature disappears from default Active list, appears under Archived/All, is read-only, and there is no hard delete or Restore action | Pass (runtime smoke 2026-07-26: modal + Active hiding verified) |
| P5-PI-011 | P0 | Archived Feature child guard | Open an archived Feature's Children tab | Add Item is absent and existing child/history data remains visible read-only | Not Run |
| P5-PI-012 | P0 | Feature progress/detail panel | Open a Feature with linked Story/Defect items | Feature right panel starts with Owner then Project, shows four progress bars, Preliminary Estimate, Refined Estimate and Refined Work Item Count Estimate, does not show Feature Plan Estimate; Percent Done bars use live child totals, Estimated Progress bars use refined/top-down denominators; old Progress field appears in left Details as a progress meter with Points/Count toggle | Pass (runtime smoke 2026-07-26: FE-318 Total Accepted Children Points showed `0/6 points complete`, Count showed `0/2 stories complete`; right bars kept refined formula; exact Feature Plan Estimate field count 0; console errors empty) |
| P5-PI-022 | P0 | Portfolio list Percent Done columns | Open `Portfolio > Portfolio Items` as Workspace Admin | Feature grid does not show generic `Progress`; it shows `Percent Done By Story Plan Estimate` and `Percent Done By Story Count`, and both columns render progress bars with live child Story/Defect denominators | Pass (runtime smoke 2026-07-27: headers present, generic Progress header absent, FE rows show points/count denominators such as `0% (0/6)` and `0% (0/2)`, 8 progress-bar nodes rendered, sort header active, console errors empty) |
| P5-PI-013 | P1 | Children tab work-item behavior | Open a Feature, switch to Children, search/filter/sort/resize/paginate, expand a Story/Defect to view Tasks | Children table behaves like the Backlog pattern; Task rows are read-only | Not Run |
| P5-PI-014 | P1 | Child row detail routing | Click a Story/Defect row from the Children tab | The shared full Work Item Detail page opens with the same fields as Backlog/Iteration Status/Quality | Not Run |
| P5-PI-015 | P1 | Build and smoke evidence | Run `npm.cmd run build` and browser-smoke Workspace Admin, Project Admin and Project Member flows | Build passes; no console errors; evidence records any known BA/mockup limitations separately from production readiness | Partial Pass (build + WA/PM smoke 2026-07-26; full PA managed/unmanaged path still BA/UAT Not Run) |
| P5-PI-016 | P0 | Feature child Work Item creation | Open a Feature > Children > Add Item, create a Story/Defect with details | Shared New Work Item flow opens; Feature is pre-filled; created Work Item Detail shows that Feature value | Pass (runtime smoke 2026-07-26: FE-315 created US-4822 via shared Add Item flow and detail showed FE-315) |
| P5-PI-017 | P0 | Work Item Feature field | Open a Story/Defect Work Item Detail, change Feature within the same Project, then change Project | Feature selector offers only active same-Project Features; Project change clears invalid Feature assignment | Partial Pass (runtime smoke 2026-07-26: same-Project active Feature options and selected value verified; Project-change invalid-clear remains BA/UAT Not Run) |
| P5-PI-018 | P0 | Backlog-to-Iteration movement | From Plan > Backlog, assign an Unscheduled Story/Defect to an Iteration | Item disappears from Backlog and appears in that Iteration's status/execution view | Pass (runtime smoke 2026-07-26: US-4822 moved to Sprint 24.3, left Backlog and appeared in Iteration Status) |
| P5-PI-019 | P0 | Return item to Backlog | Open the assigned Work Item and change Iteration back to `Unscheduled` | Item returns to Plan > Backlog | Pass (runtime smoke 2026-07-26: US-4822 returned to Backlog after setting Iteration back to Unscheduled) |
| P5-PI-020 | P0 | Task Estimate-first copy | Add a Task, enter Estimate before To Do, then create with details | To Do is copied from Estimate once; later Estimate/To Do/Actual edits do not recalculate each other | Pass (runtime smoke 2026-07-26: TA-482201 copied Estimate 4 to To Do 4; later Estimate 6 left To Do unchanged) |
| P5-PI-021 | P0 | Task Complete hour rule | Mark a Task `Completed`, then reopen it | Completed sets To Do to 0; reopening does not restore the old To Do value | Pass (runtime smoke 2026-07-26: TA-482201 Completed set To Do 0; In-Progress did not restore; Actual 3 remained independent) |

## P5-RT - Release Tracking

| ID | Priority | Scenario | Steps | Expected result | Status |
|---|---|---|---|---|---|
| P5-RT-001 | P0 | Release Tracking feature gate | Attempt to validate Release Tracking before P5.2 Capacity Planning closure | Work remains planned/blocked; no Release Tracking acceptance scenario is executable until P5.3 is explicitly confirmed | Blocked |

## P5-CP - Capacity Planning

| ID | Priority | Scenario | Steps | Expected result | Status |
|---|---|---|---|---|---|
| P5-CP-001 | P0 | Capacity Planning navigation | Open `Portfolio > Capacity Planning` as Workspace Admin in `NXP` | Capacity Plan list opens and shows ID, Name, Release, Status, Last Updated and Teams in Plan | Pass (runtime smoke 2026-07-26) |
| P5-CP-002 | P0 | New plan modal | Click Add New | Modal shows read-only Project scope, required Name, fixed Single Release, required Release, fixed Feature item type and selectable Points/Count view fixed after create | Pass (build 2026-07-26; browser re-smoke pending after allocation revision) |
| P5-CP-003 | P0 | Create plan uniqueness | Create a plan for `NXP + Nexus Platform Q1 2025`, then attempt another for the same Project+Release | First plan is created as Draft with no auto-added Teams/Features; duplicate create is blocked or disabled with a clear message | Pending re-smoke |
| P5-CP-004 | P0 | Teams by Total summary | Open a Draft plan | Detail shows Team rows with Feature count, composite progress bar, Complete, Rollup, Estimated and Capacity; Utilization and separate Demand columns are not shown | Pass 2026-07-27: browser smoke on CP-001 after build |
| P5-CP-005 | P0 | Manual capacity | Edit a Team Capacity in Draft | Capacity updates without changing allocation values or live Feature estimates; demand-vs-capacity warning is advisory | Pending re-smoke |
| P5-CP-006 | P0 | Add/Remove Teams | Add Teams from Project Breakdown, remove a Team and add it back | Added Teams appear as leaf Project/Team rows; removed Team disappears; its allocation rows return to Unallocated; adding it restores the Team row | Pending re-smoke |
| P5-CP-007 | P0 | Add Features to Team | Expand a Team row, open Add Features, and add an eligible Feature | Only same-Project, active, non-Cancelled Features with Unscheduled or matching Release appear; modal excludes Features already allocated to that Team; selecting a not-in-plan Feature creates a Team allocation row with default value `0`; selecting an Unallocated Feature moves it to the Team; selecting a Feature allocated to another Team creates a split allocation row | Pending re-smoke after 2026-07-27 amendment |
| P5-CP-008 | P0 | Assign and split allocation | Assign an unallocated allocation row to a Team, then split it to another Team | Feature may have multiple allocation rows; Team Demand uses `allocation.value`; split allocation creates another editable row with default value `0` | Pending re-smoke |
| P5-CP-009 | P0 | Expanded Feature list | Expand a Team row | Feature list shows Rank, ID, Name, State, composite progress bar, Complete, editable Rollup allocation and Estimated; no Warning or Dependencies column appears; Complete/Rollup/Estimated align with the Team row and the expanded table ends before the Team Capacity column | Pass 2026-07-27: browser smoke on CP-001 / Data & Reporting expanded row |
| P5-CP-013 | P0 | Capacity progress hover breakdown | Hover the Team progress bar and a Feature progress bar inside the Team expansion | Team tooltip shows Complete, Rollup, Estimated and Capacity/base; Feature tooltip shows Complete, Rollup and Estimated without Capacity, using the parent Team Capacity baseline | Pass 2026-07-27: browser smoke verified tooltip content by focus/click interaction |
| P5-CP-014 | P0 | Record-detail tab state | Open a Plan record, select `Features`, choose a sort, switch to `Teams by Total`, then return | Both `Teams by Total` and `Features` are available; each preserves its own selected sort while the record is open | Pending browser smoke after record-detail v2 |
| P5-CP-015 | P0 | Features allocation and cutline | In the Features tab, sort by Rank, allocate a Feature to two Teams with one blank and one manual Estimate, then change sort | Rank view shows a cutline at the first cumulative top-down estimate reaching plan Capacity; blank Estimate uses the refined Feature estimate as a fixed source-labeled allocation; manual Estimate stays fixed; split Team subrows appear; cutline hides for non-Rank sort | Pending browser smoke after record-detail v2 |
| P5-CP-016 | P1 | Capacity forecast | In Draft, open Calculate Capacity Forecast and apply a forecast | Suggested capacities update Team rows optimistically and remain editable; the control is unavailable after Publish | Pending browser smoke after record-detail v2 |
| P5-CP-017 | P0 | Features-tab Add Feature and Team Capacity rail | Open Features, use Add Feature, then inspect the Team Capacity rail | Add Feature lists only eligible Features absent from the Plan and adds them as `Not assigned` rows; Team Capacity shows every Plan Team with fixed demand / capacity and overload warning | Partial Pass 2026-07-27: CP-001 Features tab, button and Team Capacity values rendered; actual selection remains Not Run because current seed has no eligible Feature outside the Plan |
| P5-CP-010 | P0 | Publish behavior | Try both publish actions | `Publish Without Updating Fields` changes plan visibility/status only; `Publish` also writes Release and planned dates to allocated Features, never overwrites Feature Project/Team, and does not cascade to child Story/Defect | Pending re-smoke |
| P5-CP-011 | P0 | RBAC | Verify Workspace Admin, Project Admin managed/unmanaged Project and Project Member assigned Team | Manage actions follow confirmed permissions; Project Member sees read-only assigned Team only | Partial Pass (runtime smoke 2026-07-26: Project Member read-only assigned Team verified; Project Admin managed/unmanaged remains BA/UAT Not Run) |
| P5-CP-012 | P1 | Build and smoke evidence | Run `npm.cmd run build` and browser-smoke P5-CP critical paths | Build passes; no console errors; evidence records BA/mockup limitations separately from production readiness | Pass (build + runtime smoke 2026-07-26; Vite chunk-size warning only) |

## P5-RP - Release Planning

| ID | Priority | Scenario | Steps | Expected result | Status |
|---|---|---|---|---|---|
| P5-RP-001 | P1 | Release Planning deferred gate | Open the Portfolio dropdown after P5-GOV v2 | Release Planning is not the active P5.2 path; deferred scope remains documented in Future Backlog | Not Run |

## Phase 5.1 smoke path

1. Open Portfolio Items as Workspace Admin in `NXP`.
2. Verify list columns, sort/resize, Feature row open and child preview.
3. Create a Feature in `NXP`, then create with details.
4. Edit Description, Notes, What Success Looks Like and attachment metadata.
5. Verify Release selectors are scoped to `NXP`; switch Project to `MOB` and confirm Release resets to `Unscheduled`.
6. Archive a Feature and verify Active/Archived/All filters plus read-only detail behavior.
7. Switch to Project Admin and confirm managed/unmanaged Project behavior.
8. Switch to Project Member and confirm Portfolio is visible but read-only.
9. Run the production build and capture browser console status.

## Traceability

| Requirement source | Scenario coverage |
|---|---|
| `P5-PI-FR-001..003`, `P5-PI-FR-016`, `P5-PI-FR-027` | P5-PI-001, P5-PI-013, P5-PI-022 |
| `P5-PI-FR-004..008` | P5-PI-003, P5-PI-004, P5-PI-005, P5-PI-006, P5-PI-008 |
| `P5-PI-FR-009`, `P5-PI-FR-019` | P5-PI-009 |
| `P5-PI-FR-010..014` | P5-PI-011, P5-PI-012, P5-PI-013, P5-PI-014 |
| `P5-PI-FR-015` | P5-PI-012 |
| `P5-PI-FR-017..018` | P5-PI-002, P5-PI-004, P5-PI-005, P5-PI-006, P5-PI-007 |
| `P5-PI-FR-020..021` | P5-PI-010, P5-PI-011 |
| `P5-PI-FR-022..023` | P5-PI-016, P5-PI-017 |
| `P5-PI-FR-024` | P5-PI-018, P5-PI-019 |
| `P5-PI-FR-025` | P5-PI-020, P5-PI-021 |
| `P5-CAP-AC-001..003` | P5-CP-001, P5-CP-002, P5-CP-003 |
| `P5-CAP-AC-004..005` | P5-CP-004, P5-CP-005 |
| `P5-CAP-AC-006..008` | P5-CP-006, P5-CP-007, P5-CP-008, P5-CP-009 |
| `P5-CAP-AC-009..010` | P5-CP-010, P5-CP-011, P5-CP-012 |
