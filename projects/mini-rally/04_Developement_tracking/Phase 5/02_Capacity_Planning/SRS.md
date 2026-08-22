# P5.2 Capacity Planning - SRS

## 1. Document Control

| Attribute | Value |
|---|---|
| Phase | Phase 5 - Portfolio Module |
| Feature | P5.2 Capacity Planning |
| Status | BA accepted; P5.2 feature closed for BA/mockup scope |
| Effective date | 2026-08-17 |
| Reference model | Broadcom Rally Capacity Planning, simplified for Mini Rally |
| Scope boundary | Verified BA/mockup behavior using session-level frontend state only; production implementation is not started |

Phase 5 closed on 2026-07-28. Production implementation must use `../PHASE5_DEV_HANDOFF.md`; this SRS and `BUSINESS_FLOW_AND_UI_CATALOG.md` remain the detailed P5.2 requirement sources.

Companion operating specification:
`BUSINESS_FLOW_AND_UI_CATALOG.md`. It provides the complete end-to-end flow,
screen catalog, button behavior, validation and traceability for this SRS.

## 2. Business Goal

Capacity Planning lets Planners create a single-Release plan, add Teams from the Project Breakdown, add Portfolio Features to the plan, allocate fixed demand to one or more Teams, and compare committed demand against manual Team capacity while tracking execution progress from live Story/Defect children.

Mini Rally hierarchy is:

```text
Workspace -> Project -> Team
```

Rally's Capacity Planning groups rows by child Project/Scrum Team. In Mini Rally, those rows are represented by Teams under the selected Project.

## 3. Confirmed Direction

1. Release Planning is deferred. Capacity Planning becomes P5.2.
2. A Capacity Plan has lifecycle `Draft -> Published`.
3. There is one Capacity Plan per `Project + Release`.
4. Project scope stores the plan only; it does not decide which Teams are included.
5. Teams are added through Project Breakdown. In Mini Rally, selectable leaf Projects are shown as Teams.
6. Features are added to the plan from the eligible Portfolio Feature list after plan creation.
7. Draft allocations are plan-specific. One Feature may have one or many allocation rows.
8. Allocation value is fixed at planning time and changes only through replan/split/edit allocation.
9. Feature does not have a Plan Estimate field. Planning `Estimated` follows the confirmed fallback chain: Preliminary Estimate size mapping, overridden by Refined Estimate when supplied, then overridden by the total points/count allocated to Teams in this Plan.
10. Publishing has two actions: `Publish Without Updating Fields` and `Publish`.
11. Published plans are read-only. Revert to Draft allows further planning, but previously written Feature fields are not rolled back.
12. `Publish` writes Feature Release only when the Plan planned start/end dates exactly equal the selected Release start/end dates after date-only normalization. A mismatch still allows Publish and writes planned dates, but does not change Feature Release; the result must advise the user with both date ranges and must not claim the Plan is outside the Release when it merely differs.
13. Publish processing de-duplicates allocation rows by Feature ID before updating Feature fields or producing advisory messages. A Feature split across multiple Teams is updated/reported once.

## 4. Capacity Plan List

Navigation: `Portfolio > Capacity Planning`.

The list shows Capacity Plan records for the selected Project context.

Columns:

| Column | Rule |
|---|---|
| ID | Plan identifier such as `CP-001`; clicking opens detail |
| Name | Required plan name |
| Release | Selected Project Release |
| Status | `Draft` or `Published` |
| Last Updated | Human-readable session timestamp |
| Teams in Plan | Count of included Teams |

Available controls:

- Search plans by ID, Name or Release.
- Filter by Release.
- Add New.
- Open a plan by clicking ID or row.

## 5. New Capacity Plan Modal

Fields:

| Field | Rule |
|---|---|
| Project | Current Project context, read-only |
| Name | Required |
| Plan Type | Fixed `Single Release` |
| Release | Required; options are Releases for the current Project |
| Portfolio Item Type | Fixed `Feature` |
| View Work Items By | Required `Points` or `Count`; fixed after create |

Create is disabled until Name and Release are populated. On create, no Team or Feature is auto-added because Project scope only controls where the plan is stored.

## 6. Plan Detail

The detail page uses Rally's `Projects by Total` concept but labels it `Teams by Total`.

Header content:

- Plan ID.
- Name.
- Status.
- Release badge.
- Plan-level totals for Complete, Demand, Rollup, Estimated and Capacity. Complete, Rollup and Estimated show both their numeric value and percent of total Team Capacity.
- `Publish Without Updating Fields` and `Publish` actions for authorized users while Draft.
- `Revert to Draft` for authorized users after Published.

Tabs included in P5.2:

- `Teams by Total`
- `Features` (record-detail v2 amendment, 2026-07-27)

Tabs deferred:

- `Alignment`
- `Progress`
- `Revision History`

`Breakdown` is not a separate tab. It is an implemented read-only overlay
opened from the Plan summary bar.

## 7. Teams by Total

Each Team row shows:

| Field | Rule |
|---|---|
| Team Name | Team under the selected Project |
| Features | Count of allocated Features, left-aligned. If one or more allocated Features under the Team exceed their Feature-level rule (`Rollup > Estimated`), show a red attention badge beside the count. Hover/focus on the badge shows `{N} Feature(s) require attention`. |
| Unnamed progress | Composite progress bar using the Team Capacity baseline; hover shows Complete, Rollup, Estimated and Capacity breakdown. Tooltip overlays above the grid/list, not clipped inside the table. |
| Complete | Sum of Plan Estimate for Team-scoped Story/Defect children whose state is `Completed`, `Accepted` or `Release`, shown with percent of Team Capacity. The value is live: moving a child back to `In-Progress` subtracts it. |
| Rollup | Sum of Plan Estimate for all Team-scoped Story/Defect children generated from the Team's allocated Features, shown with percent of Team Capacity |
| Estimated | Sum of allocation values committed to this Team, shown with percent of Team Capacity |
| Capacity | Total capacity entered manually by the user for this Team inside the Plan; editable in Draft and read-only in Published |

Exceed warnings are advisory and never block planning actions. They render as a red warning triangle on the progress bar and in the hover breakdown when any applicable comparison is exceeded:

- Rollup > Estimated.
- Rollup > Capacity (Team and Plan levels).
- Estimated > Capacity (Team and Plan levels).

Feature rows do not carry their own Capacity number, so they warn only on Rollup > Estimated. Team and Plan progress bars evaluate all three rules against their Capacity baseline.

The plan summary bar also has a `Breakdown` action. Clicking it opens a read-only overlay showing the same Complete, Rollup, Estimated and Capacity totals, percentages/base label, and composite bar used by the hover breakdown. Each row also has its own mini bar segment aligned to the same baseline/position as the top composite bar so the planner can compare Complete, Rollup, Estimated and Capacity against one shared scale.

The Team columns `Complete`, `Rollup` and `Estimated` are right-aligned to the expanded Feature rows underneath that Team. The Team progress bar sits immediately to the left of `Complete`, and `Capacity` remains the final Team-only column.

The page includes `Add Team` from Project Breakdown at the plan-detail action level. `Add Features` inside an expanded Team remains the targeted path: it attaches the selected Feature directly to that Team. Removing a Team moves its allocation rows back to Unallocated.

While Draft, the action bar also provides `Calculate Capacity Forecast`. It is a planner aid that proposes capacities from a supplied historic velocity; the planner may edit every proposed value before Publish. Capacity stays disabled after Publish.

## 8. Features Tab (Record-detail v2)

`Features` is the Feature-centric view of the same Plan allocation records. It uses the grid column headers/sort icons as the sorting affordance and does not show a separate intro/sort toolbar above the list.

The right rail is `Team Capacity`, listing every Team in the Plan and its fixed demand / Team Capacity with advisory warning icons when Team rollup/estimated/capacity rules are exceeded. It uses the plan unit mode label (`Points / Capacity` or `Count / Capacity`).

| Column / element | Rule |
|---|---|
| Change marker | Reserved for added/removed-after-publish display; neutral before Publish. |
| Rank | Sequential display order within the currently sorted Feature list. When sorted by Rank, this comes from the Plan allocation order and shows `1..N` without gaps. The Capacity Cutline appears only while Rank sort is selected. |
| ID / Name | Read-only Feature identity. |
| Planned Team Assignment | Plan-specific Team assignment read from and written to the same allocation ledger used by `Teams by Total` and the Team Capacity rail. If the Feature has no Team allocation, the cell shows a yellow `Not assigned` selector; choosing a Team assigns the existing unallocated row to that Team and uses the default estimate rule below. If the Feature has one Team allocation, the selector shows that Team and can be changed; its first dropdown item is `Unassign`, which clears the Team and returns the cell to the yellow `Not assigned` state. If the Feature is split across multiple Teams, the parent row shows `N teams`; split edits are made through the Allocate dialog. This never changes the Feature's Portfolio owning Team or Project. |
| Team | The Feature's current Portfolio Item Team ownership. Allocation can differ from this value; this column is the Feature's original/current Team, not the Plan assignment. |
| Dependencies | Placeholder column retained for Rally visual parity. It shows `0` until dependency modelling is added. |
| Complete | Sum of Plan Estimate for Feature children at `Completed` or later (`Completed`, `Accepted`, `Release`). It updates live when a child moves forward or back in the flow. The cell shows the number only. |
| Rollup | Sum of Plan Estimate for every Story/Defect child generated from the Feature. The cell shows the number only. If Rollup exceeds Estimated, show the red warning triangle with tooltip `Rollup exceeds Estimated`. |
| Estimated | Planning estimate for the plan unit. It uses Preliminary Estimate as the initial forecast, Refined Estimate when supplied, and finally the sum allocated to Teams when allocation exists. The cell shows the number only plus the estimate-source indicator; there is no progress bar in the Features-tab grid. If Preliminary, Refined and Allocated estimates are all missing, show the red warning triangle with tooltip `Point Estimated missing`. |
| Feature reorder and menu | Draft-only drag-and-drop is the primary rank interaction. The settings menu may also provide `Move up` / `Move down` as equivalent rank shortcuts, hiding or disabling the action that is impossible at the list boundary. The accepted menu actions are `Move up` / `Move down`, `Allocate to Teams`, `Move to another plan`, `Remove all assignments`, and `Remove from Plan`. `Move to another plan` transfers the Feature's plan membership/allocation records to another eligible Capacity Plan without changing the Portfolio Feature's Project or owning Team. `Remove all assignments` clears every Team assignment but keeps the Feature in the current Plan as `Not assigned`. `Remove from Plan` deletes every allocation row for the Feature from the current Plan while leaving the Portfolio Feature unchanged. |

The tab also has a Draft-only `Add Feature` action above the list. It lists eligible Portfolio Features not already in this Plan and creates an Unassigned plan allocation row. The planner may then choose a Team directly from `Planned Team Assignment` or open `Allocate` for split allocation.

Quick assignment estimate rule:

- If an existing Unassigned allocation already has a value, keep that value.
- Otherwise set the allocation value from the same default used by the Allocate dialog: `Refined Estimate > Preliminary Estimate`.
- Selecting `Unassign` removes the Team from the single allocation row but keeps the row/value in the Plan as Unassigned.
- Split allocation is still controlled by the Allocate dialog; the inline selector only handles zero-or-one Team assignment.

Allocation dialog rules:

The dialog is reachable from two places: the `Allocate to Teams` action on a Feature in the `Features` tab, and the `Allocate` item in a Feature row's settings menu inside an expanded Team (§9). Both open the same dialog.

Layout, mirroring Rally's `Allocate to Projects` with Project replaced by **Team** per the Mini Rally hierarchy:

- A read-only header row identifying the Portfolio Item: `ID`, `Name`, `Prelim Estimate`, `Refined Estimate`.
- A `Team` / `Estimate` table, one row per contributing Team, each row removable.
- An `Add Team` action, and a live `Total allocated` readout showing what the Feature's Estimated will become once applied.

Rules:

- Planner may add one or more Plan Teams.
- Blank Estimate copies the Feature's top-down estimate into a fixed allocation row and labels its source `Feature Estimate`. That top-down value is Refined Estimate, or the Preliminary Estimate size mapping when no Refined Estimate exists - it deliberately excludes Total Allocated, see §11.
- A supplied Estimate becomes a fixed `Manual` allocation row.
- Every Team Estimate is the final allocation value for that Team. Adding or editing another Team row does not auto-subtract from the primary Team. Example: Pegasus `6` plus Retest Capacity `2` produces Total allocated `8`.
- Re-applying allocation replaces the Feature's Team allocation rows only; it never edits its Project or execution children.

Capacity Cutline is calculated only for ascending Rank: it is rendered after the first Feature where cumulative planning Estimated (§11) reaches or exceeds Plan total Capacity. The line disappears for all other sorting choices.

## 9. Expanded Team Feature List

Expanding a Team shows allocated Features and the Team-level `Add Features` action.

Columns:

| Column | Rule |
|---|---|
| Settings | Draft-only gear icon at the start of the row. It uses the same accepted Feature menu as the Features tab: `Move up` / `Move down`, `Allocate to Teams`, `Move to another plan`, `Remove all assignments`, and `Remove from Plan`. Drag-and-drop remains the primary rank interaction; Move up/down are accepted shortcut actions. Allocation/removal side effects follow §8 and never change the Portfolio Feature's Project or owning Team. |
| Rank | Plan-level display order inside the Team |
| ID | Feature ID |
| Name | Feature Name |
| State | Feature lifecycle state |
| Allocation | States where this allocation row came from or where its owned work is also allocated. A Feature carries its own Team from Portfolio Items; that Team is its origin. If the Feature is allocated only to its own Team, the cell shows `—`. If the Feature is split, the own-Team row shows `to {other Team}` (or a compact multi-Team equivalent), while each different-Team row shows `from {Feature's own Team}`. Example: Feature A owned by `Core Platform` is split into `Data & Reporting`; the Core Platform row shows `to Data & Reporting` and the Data & Reporting row shows `from Core Platform`. Read-only — allocation values are changed only in the Allocate dialog. |
| Dependencies | Column present but **not implemented in this slice**; every row shows numeric placeholder `0`. Mini Rally has no dependency data contract yet, so no dependency is modelled or displayed. |
| Unnamed progress | Composite Feature progress bar; hover shows numeric Complete, Rollup and Estimated only, without percentages. Tooltip overlays above the grid/list, not clipped inside the table. |
| Complete | Sum of Plan Estimate for this Team's Story/Defect children at `Completed`, `Accepted` or `Release`. Number only. |
| Rollup | Sum of Plan Estimate for all Story/Defect children in this Team slice of the Feature. Number only. |
| Estimated | Fixed allocation value for this Team/Feature allocation row. Number only and read-only; the value is changed only in the Allocate dialog. |

The expanded Feature table ends before the Team `Capacity` column so that Team-level capacity remains visually distinct from Feature-level progress and estimates.

Layout note (revised 2026-07-27): with `Allocation` and `Dependencies` added the table carries nine columns and no longer fits inside the width the Team row occupies, so it scrolls horizontally within its own container at a fixed minimum width. The column-for-column alignment with the Team row described above therefore holds only until the table is scrolled. This was accepted in preference to squeezing `Name`, which was already at its minimum width before these columns were added.

`Dependencies` is displayed as a column but is not implemented: Mini Rally still has no dependency data contract in this slice, so every row shows numeric placeholder `0`.

## 10. Add Features, Unallocated Features and Split Allocation

`Add Features` is available from the expanded Team record and `Add Feature` is available in the Features-tab list. The Team action creates or moves allocation rows directly under that Team. The Features-tab action lists only Features not yet in this Plan and creates an Unallocated row.

The two pickers deliberately use different scopes:

| Picker | Scope | Columns |
|---|---|---|
| Team-level `Add Features` (expanded Team, `Teams by Total`) | Every Feature across the Project's Teams - **no Release filter** | ID, Name, Project, Team, Allocation |
| Plan-level `Add Feature` (Features tab) | Features matching Feature eligibility below that are not yet in this Plan | ID, Name, Project, Allocation |

Team picker scope (revised 2026-07-27):

- Same Project as the plan.
- Not Archived.
- State is not `Cancelled`.
- Release is **not** filtered: a Feature on any Release, or none, may be pulled into a Team, because a planner needs to see the Project's whole Feature inventory when staffing a Team. The `Team` column exists so the planner can see which Team currently owns each Feature.

Feature eligibility (plan-level picker and the `Eligible` counter):

- Same Project as the plan.
- Not Archived.
- State is not `Cancelled`.
- Release is `Unscheduled` or matches the Plan Release.

Adding a Feature from a Team follows these rules:

- If the Feature is not yet in the plan, create one allocation row for the selected Team with default allocation value `0`.
- If the Feature already has an Unallocated row, move that existing row to the selected Team and keep its current allocation value.
- If the Feature is already allocated to another Team, create an additional split allocation row for the selected Team with default allocation value `0`.
- If the Feature is already allocated to the selected Team, keep it visible in the list marked as added, with selection disabled. It is deliberately **not** removed from the list, so the planner can see what is already in the Team instead of the row disappearing.

Because the Team picker ignores Release, a Feature outside the Plan Release can hold an allocation. Every Feature display in the plan must therefore resolve against the full Feature list, never against the eligibility-filtered list, or such an allocation would count toward Team totals while rendering no row.

The planner enters or adjusts the committed value during allocation/replanning.

For zero-or-one Team assignment, the Features-tab `Planned Team Assignment` selector supports assigning, changing Team and `Unassign`. Multi-Team split allocation and committed values are managed through the shared Allocate dialog (§8) while Draft. Adding a Team row in that dialog is the split action. A Feature that is in the plan but has no Team yet has no dedicated `Unallocated Features` block on `Teams by Total` - the plan header still counts it under `Unassigned`, and it appears in the `Features` tab carrying a `Not assigned` badge. `Remove from Plan` removes the Feature from the Plan by deleting all allocation rows for that Feature, including every row in a multi-Team split.

## 11. Calculations

Feature Allocation:

```text
fixed allocation.value set during planning/replanning
```

Feature metrics inside an expanded Team row:

```text
Complete:
  Points: SUM(child.planEstimate WHERE child belongs to Feature/Team
              AND state IN [Completed, Accepted, Release])
  Count: COUNT(child WHERE child belongs to Feature/Team
               AND state IN [Completed, Accepted, Release])

Rollup:
  Points: SUM(child.planEstimate WHERE child belongs to Feature/Team)
  Count: COUNT(child WHERE child belongs to Feature/Team)

Estimated:
  allocation.value for this Feature/Team row
```

Feature Estimated - planning view, used in the `Features` tab and the Capacity Cutline (revised 2026-07-27):

```text
1. Total Allocated  = SUM(allocation.value WHERE Feature matches AND Team is assigned) -> if > 0
2. Refined Estimate = Feature.refinedEstimate | refinedWorkItemCountEstimate -> if > 0
3. Preliminary      = Preliminary Estimate size mapping
otherwise 0 ("No estimate")
```

Once a planner has committed demand, that allocated total is the truth and outranks any top-down forecast; the forecasts only stand in until an allocation exists. The UI labels which tier produced the number (`ALLOCATED` / `REFINED` / `PRELIMINARY`) so the planner can see whether they are looking at a commitment or a forecast.

Two rules keep this from becoming circular and keep Estimated aligned with Team Demand:

- The **default offered when allocating** (blank Estimate in the Allocate dialog) uses only tiers 2 and 3. Folding tier 1 back in would mean a blank field commits the sum of the very allocations it is meant to create.
- `Total Allocated` counts only allocation rows assigned to a Team. An Unallocated placeholder does not override Refined or Preliminary, so Feature Estimated reconciles with the Team Demand totals.

Temporary Preliminary Estimate size mapping used by the mockup (shared with Portfolio Items so both surfaces agree):

| Size | Points | Count |
|---|---:|---:|
| No Entry | 0 | 0 |
| XS | 1 | 1 |
| S | 3 | 2 |
| M | 5 | 3 |
| L | 8 | 5 |
| XL | 13 | 8 |

The values above are temporary mockup defaults, not final product configuration. The confirmed future configuration location is `Settings gear > Workspace > Project Management`; that later slice will replace these defaults with user-defined values.

These are the documented defaults. A user-configurable mapping remains deferred to `Settings > Workspace > Project Management`.

Feature Rollup in the Features tab:

```text
Points: SUM(child.planEstimate WHERE child belongs to Feature)
Count: COUNT(child WHERE child belongs to Feature)
```

Feature Complete in the Features tab:

```text
Points: SUM(child.planEstimate WHERE state IN [Completed, Accepted, Release])
Count: COUNT(child WHERE state IN [Completed, Accepted, Release])
```

`Complete` and `Rollup` are live. If a completed child is moved back to `In-Progress`, it is immediately removed from Complete but remains in Rollup.

Feature row display:

```text
Feature-grid metric order is Dependencies / Rollup / Estimated / Complete.
Rollup / Estimated / Complete show numbers only.
No textual percentage is shown in the Feature row or its progress tooltip.
```

Team Demand and Team Estimated:

```text
SUM(allocation.value)
```

Team Rollup:

```text
SUM(Feature/Team Rollup for allocation rows in Team)
```

Team Complete:

```text
SUM(Feature/Team Complete for allocation rows in Team)
```

Team display keeps both number and percent for Complete, Rollup and Estimated:

```text
metric percentage = metric value / manually entered Team Capacity * 100
```

Capacity/Demand and Execution/Completion are intentionally separate. Allocation uses fixed planning values so execution estimate drift does not change committed demand. In a split Feature, the Features tab shows total Estimated across all Team allocations; Teams by Total shows each Team's allocation slice.

## 12. RBAC

Revised 2026-08-10. Capacity Planning follows the fixed Phase 4 Project Access baseline. The temporary editable Capacity Planner Full/View matrix is removed.

| Access | Behavior |
|---|---|
| Workspace Admin | Full create, edit, allocate, forecast, publish and revert across all Projects |
| Admin | Full create, edit, allocate, forecast, publish and revert in assigned Projects only |
| Editor | Capacity Planning hidden |
| Unassigned user | Project plans hidden and direct access rejected safely |

Draft and Published plan visibility follows Project Access. Published lifecycle state remains read-only for everyone until an authorized Workspace Admin/Admin explicitly reverts it to Draft.

## 13. Acceptance Criteria

| ID | Criteria |
|---|---|
| P5-CAP-AC-001 | `Portfolio > Capacity Planning` opens the Capacity Plan list for the selected Project. |
| P5-CAP-AC-002 | New Capacity Plan modal matches the confirmed fields and creates one Draft plan per Project+Release. |
| P5-CAP-AC-003 | Creating a plan stores Project scope, Release and View By, but does not auto-add Teams or Features. |
| P5-CAP-AC-004 | Plan detail shows `Teams by Total` with Feature count, progress bar, Complete, Rollup, Estimated and Capacity. Team metrics show both number and percent of manually entered Team Capacity. Advisory exceed warnings appear when Rollup > Estimated, Rollup > Capacity or Estimated > Capacity. |
| P5-CAP-AC-005 | Add Team uses Project Breakdown and removed Teams move their allocation rows back to Unallocated. |
| P5-CAP-AC-006 | Add Features from an expanded Team lists eligible Features and creates/moves a Team allocation row without changing Feature Project. |
| P5-CAP-AC-007 | Split allocation lets one Feature have multiple Team allocation rows while Draft. |
| P5-CAP-AC-008 | Allocation values are plan-specific final manual inputs; split allocation creates another editable Team row and never auto-subtracts from another row. Team Demand uses `allocation.value`, and Total allocated is the sum of all Team rows. |
| P5-CAP-AC-009 | `Publish Without Updating Fields` changes visibility/status only; `Publish` also writes Release and planned dates to allocated Features without overwriting Feature Project or child Story/Defect fields. |
| P5-CAP-AC-010 | Workspace Admin manages all Projects; Admin manages assigned Projects; Editor and unassigned users do not access Capacity Planning. |
| P5-CAP-AC-012 | Capacity Planning uses the fixed Phase 4 Project Access baseline and has no temporary editable Full/View permission row. |
| P5-CAP-AC-014 | Feature Estimated resolves in priority order: Team-assigned Total Allocated, Refined Estimate, then temporary Preliminary Estimate mapping. Unallocated rows do not count toward Total Allocated. |
| P5-CAP-AC-015 | `Remove from Plan` removes all allocations for that Feature across all Teams without deleting or editing the Portfolio Feature. One-Team removal is not part of the current P5.2 UI. |
| P5-CAP-AC-016 | Feature Complete is the live sum of child Plan Estimate at `Completed`, `Accepted` or `Release`; Feature Rollup is the live sum of every linked Story/Defect Plan Estimate. Moving a child back to `In-Progress` reduces Complete immediately. |
| P5-CAP-AC-017 | Feature-grid columns use `Dependencies → Rollup → Estimated → Complete`; the three numeric metrics show numbers without percentages. A split Feature shows total Estimated in the Features tab and its Team allocation slice under Teams by Total; Team summary rows retain number plus percent and Capacity remains manual Plan input. |
| P5-CAP-AC-013 | Viewer behavior is Future Backlog and is not an acceptance criterion for the current release. |
| P5-CAP-AC-011 | Record detail has independently retained Teams by Total and Features tab view state; the Features tab supports Rank-only capacity cutline and Draft-only multi-Team allocation. |
| P5-CAP-AC-018 | Features tab has no separate intro/sort toolbar. `Planned Team Assignment` supports `Unassign` for one-Team rows, returning the row to yellow `Not assigned`; the summary `Breakdown` shows per-metric bars aligned to the same scale as the total composite bar. |
| P5-CAP-AC-020 | `Planned Team Assignment`, `Teams by Total` and the Team Capacity rail resolve from the same persisted Plan allocation ledger. A zero-Team row shows `Not assigned`, one Team shows that Team, and multiple Teams show `N teams` after save and reload; Feature Portfolio ownership remains unchanged. |
| P5-CAP-AC-019 | `Publish` compares date-only values using `planStart === releaseStart AND planEnd === releaseEnd`. Exact match copies Feature Release and planned dates. Mismatch still publishes and writes planned dates, keeps Feature Release unchanged, and reports both date ranges with `does not exactly match` wording. Feature updates/advisories are de-duplicated by Feature ID so a split Feature appears once. |
| P5-CAP-AC-021 | A split Feature shows `to {other Team}` on its own-Team row and `from {own Team}` on cross-Team rows. Dependencies remains a numeric placeholder `0` until dependency modelling is implemented. |
| P5-CAP-AC-022 | While Draft, the Feature settings menu may expose Move up/down rank shortcuts together with `Allocate to Teams`, `Move to another plan`, `Remove all assignments`, and `Remove from Plan`. Moving/removing Plan assignments never changes the Portfolio Feature's Project or owning Team. |

## 14. Out of Scope

- Release Planning screen.
- Multi Release and Plan of Plans.
- Multiple what-if plans for the same Project+Release.
- Automatic rebalance.
- Velocity-driven automatic capacity.
- Dependency data and behavior. The `Dependencies` column exists on the expanded Team Feature table as a numeric placeholder showing `0`; nothing is modelled behind it.
- Full Rally-style Breakdown chart beyond the compact plan summary `Breakdown` overlay.
- Alignment, Progress and Revision History tabs.
- Production API, database persistence or server-side authorization.

## 15. Closure Decisions and Deferred Configuration

P5.2 was BA accepted and closed for BA/mockup scope on 2026-07-28.

The Team-level Add Features picker excludes Archived and Cancelled Features.
This is the accepted P5.2 baseline because those records are not actionable
planning demand. The picker still ignores Release so a Planner can bring an
active Feature from another Release into the Team planning discussion.

Project Management remains the confirmed future location for user-defined
Preliminary Estimate configuration. The current mapping is temporary mockup
data only and is not a production default.

Any future change to lifecycle, allocation, publish, formulas, tabs, picker
eligibility or RBAC is a new business-rule change and requires BA confirmation.
