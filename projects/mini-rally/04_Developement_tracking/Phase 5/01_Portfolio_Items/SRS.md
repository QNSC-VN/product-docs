# SRS - Phase 5.1 Portfolio Items

## 0. Document Control

| Attribute | Value |
|---|---|
| Module ID | `P5-PORTFOLIO-ITEMS` |
| Status | BA Accepted + Closed for P5.1 Mockup Scope |
| Updated date | 2026-07-26 |
| Scope | `Portfolio > Portfolio Items` list, Feature create, Feature Detail (Details tab + Children tab) |
| Priority | P5.1 - required before P5.2 Release Planning, P5.3 Release Tracking and P5.4 Capacity Planning can start |
| Depends on | Phase 1 Backlog Work Item base (Story/Defect/Task), Phase 2 Backlog inline-edit and resizable-column conventions, Phase 3 Release Management (Target Release field), Phase 4 RBAC (`manageFeatures` permission gate) |
| Mockup source | `03_Mockup Design/src/app/pages/PortfolioPage.tsx` |
| Not included | Initiative/Theme level (evaluated and rejected, see §2), P5.2 Release Planning / P5.3 Release Tracking / P5.4 Capacity Planning, Reports, API payloads and persistence design, "link/unlink existing Story-Defect" (removed, superseded by Add Item), bulk actions, drag-and-drop Rank reordering |

## 1. Goal

Portfolio Items gives leadership a Feature-level view of work that sits one layer above Story/Defect, so a large capability can be tracked, staffed and rolled up without reading every individual Story. It is the foundation the rest of the Portfolio module (Release Planning, Capacity Planning, Release Tracking) is built on.

## 2. Confirmed Direction

- Mini Rally uses a **single Portfolio Item level: Feature**. Rally's own model allows `Theme -> Initiative -> Feature`; BA evaluated adding an `Initiative` level above Feature and decided against it - ACME Space Inc. is one small company with no current need for a "group of Features into one cross-quarter goal" view, and the extra level would add fields, permissions and a rollup layer nobody would use yet. It can be added later without breaking the Feature<->Story link.
- A Feature is the **only** Portfolio Item type that attaches directly to the Story/Defect hierarchy, matching Rally's rule that only the lowest Portfolio Item type links to User Stories. Story, Defect and Task below Feature are unchanged from Phase 1/2.
- A Feature does **not** store a Plan Estimate field. Feature progress indicators are read-only rollups computed from the Story/Defect linked to that Feature (see §6). The two `Estimated Progress by...` indicators compare accepted child work against optional top-down Feature forecasts (`Refined Estimate` and `Refined Work Item Count Estimate`) with a Preliminary Estimate fallback. Capacity Planning uses plan-specific allocation values entered inside the Capacity Plan.
- `Portfolio Items` is the first entry in the top-nav `Portfolio` dropdown, ahead of `Release Planning`.
- The Portfolio Items list has no page-level summary metrics strip (Features / Total Stories / Accepted Stories / Total Points was built, then explicitly removed per BA - "no need"). The page goes straight from the breadcrumb to the list toolbar.
- Readiness is split: current UI presence means `Mockup Implemented`, not `Production Ready`. P5.1 is BA accepted and closed for mockup scope after the project/RBAC, field-data, Archive and test gaps below were implemented, verified and accepted.

## 3. Portfolio Items List

### 3.1 Columns

| Column | Editable inline | Notes |
|---|---|---|
| Rank | Yes (up/down reorder buttons only, no drag-and-drop) | Manual stack-rank order, same convention as Backlog's Rank column |
| Type | No | Always shows `Feature` - this collection currently holds only Features |
| ID | No | Feature identifier, e.g. `FE-318` |
| Name | Yes | Feature name |
| Release | Yes | Target Release, `Unscheduled` or a confirmed Release |
| State | Yes | 11-value Portfolio Item State, see §7 |
| Percent Done By Story Plan Estimate | No | Progress bar: accepted linked Story/Defect Plan Estimate / all current linked Story/Defect Plan Estimate; same live formula as §6 |
| Percent Done By Story Count | No | Progress bar: accepted linked Story/Defect count / all current linked Story/Defect count; same live formula as §6 |
| Project | Yes | Changing Project resets Team to that Project's first Team |
| Team | Yes | Options scoped to the Feature's current Project |
| Owner | Yes | |

### 3.2 List Behavior

- Every column is resizable (drag the column border) and sortable (click the column header).
- Inline edit is available on every editable column above, gated by the `manageFeatures` permission - a user without that permission sees read-only values instead of inputs/selects.
- Workspace Admin can view and edit Features across all Projects. Project Admin can view and edit only Features in Projects they manage. Project Member can view assigned Project/Team Portfolio data read-only and cannot create, edit or archive a Feature.
- Release options in list, create and detail are scoped to the Feature's current Project.
- Clicking anywhere on a Feature row other than an inline-edit control, the Rank reorder buttons, or the expand chevron opens that Feature's Detail page (§5).
- Each Feature row has an expand chevron (only shown when the Feature has at least one linked Story/Defect) that reveals up to 5 linked items as an inline, read-only preview: Type, ID, Name, Release, Project, Team, Owner are shown; **State and the two Percent Done columns are intentionally left blank in this preview** - the full State (as the app-wide Schedule State bar) and per-item progress are available on the Children tab (§5.2) or that item's own full detail, and were judged unnecessary clutter for a quick preview. If more than 5 items are linked, a static "+N more - see Children tab" line is shown; it is not clickable. Expanding/collapsing a Feature's preview does not open its Detail page, and the preview rows themselves are not inline-editable and do not navigate anywhere on click.

## 4. Create Feature

- `New Feature` button is visible only to roles with the `manageFeatures` permission (not `Project Member`).
- Create modal fields: Project (select, cascades Team), Team (select, scoped to Project), Name (required), State (11-value Portfolio Item State, defaults to `No Entry`), Preliminary Estimate (T-shirt size, defaults to `No Entry`), Owner, Target Release (`Unscheduled` or a confirmed Release).
- Two submit actions:
  - `Create Feature` - creates the Feature and returns to the Portfolio Items list.
  - `Create with details` - creates the Feature and immediately opens its Detail page.
- Progress is not manually set and only appears from linked Story/Defect rollups (§6). Capacity allocation is not set on the Feature; it is entered later inside Capacity Planning.

## 5. Feature Detail

Feature Detail is a full page (replaces the list, same chrome pattern as Work Item Detail: dark header bar, back button, Feature badge + ID + Name), not a docked side panel. It has two tabs: **Details** and **Children** (the Children tab label shows a live count of linked items).

### 5.1 Details Tab

Main column (rich text, all read-only when the viewer lacks `manageFeatures`):

- Description
- Attachments
- Notes
- What Success Looks Like

Description, Notes and What Success Looks Like must be backed by the shared session-level Feature record. Attachments use session-level attachment metadata in the mockup; binary upload/storage and persistence after refresh remain development scope.

Left Details content area, above Description:

| Field | Behavior |
|---|---|
| Total Accepted Children | Read-only progress-meter summary, switchable between Points and Count, see §6 |

Right rail, in order:

| Field | Behavior |
|---|---|
| Owner | Select |
| Project | Select; changing it resets Team to that Project's first Team |
| Preliminary Estimate | T-shirt sizing value: No Entry, XS, S, M, L, XL |
| Refined Estimate | Optional numeric top-down points forecast for `Estimated Progress by Story Points`; blank falls back to Preliminary Estimate mapping |
| Refined Work Item Count Estimate | Optional numeric top-down child-count forecast for `Estimated Progress by Story Count`; blank falls back to Preliminary Estimate mapping |
| State | Select, 11-value Portfolio Item State |
| Release | Select, `Unscheduled` or a confirmed Release |
| Milestone | Multi-select checklist, scoped to the Feature's Project plus any already-selected Milestones |
| Creation Date | Read-only, full weekday/month/day/year/hour/minute/second format matching the Audit Log |
| Planned Start Date | Plain free-text field (intentionally not a date picker) |
| Planned End Date | Native date picker |
| Market Release Date | Native date picker |

### 5.2 Children Tab

Full Backlog-style table of every Story/Defect linked to this Feature: search box, Show/Hide filter with a Manage Filters panel and active-filter chips, resizable and sortable columns, pagination footer, and a Totals row summing Plan Estimate.

Columns: Type, ID, Name (inline edit), Priority (Defect only, inline edit), Est (inline edit), Owner (inline edit), Schedule State (the app-wide segmented I/D/P/C/A/R bar, inline edit), Iteration (read-only text - deliberately not sortable/resizable, a scope trim rather than an oversight), Release (inline edit).

Each row can expand to reveal its linked Tasks, read-only: ID, Name, state badge, Owner, Estimate, To Do/Actual hours.

`Add Item` opens the same creation flow Backlog uses, restricted to Story/Defect, pre-filled with this Feature's Project/Team, and automatically linked to this Feature.

Clicking anywhere on a Children row other than an inline-edit control opens the **same full-page Work Item Detail used everywhere else in the app** (Backlog, Iteration Status, Team Board, Quality) - identical tabs and fields, nothing reduced or Portfolio-specific. "Back" from that page returns to the flat Portfolio Items list (the same behavior every other entry point into that page already has).

There is no "link existing Story/Defect" or "unlink" control anywhere in Feature Detail. A Story/Defect's Feature membership is set only at creation (`Add Item`) or by editing that Story/Defect's own record elsewhere.

### 5.3 Work Item Feature Field and Backlog Rule

Story/Defect remains the child level under Feature. Creating a Story/Defect from Feature Detail uses the same `New Work Item` flow/template as Plan > Backlog and automatically fills the Story/Defect `Feature` field with the current Feature.

Work Item Detail shows a `Feature` field in the right rail:

- `Unassigned` is allowed.
- The selectable Feature list is scoped to the Work Item's Project.
- Archived Features are not offered as new assignment targets.
- Changing a Work Item's Project clears the Feature if the existing Feature no longer belongs to that Project.

Plan > Backlog is the planning backlog only. It shows Story/Defect rows whose Iteration is `Unscheduled`. Assigning a row to an Iteration removes it from Backlog and makes it visible in that Iteration's execution/status views. Moving it back to `Unscheduled` returns it to Backlog.

### 5.4 Taskflow Hours

Task `Estimate`, `To Do` and `Actual` are three independent hour fields:

- If the Owner enters `Estimate` first, the system copies the same number of hours to `To Do` once.
- After that first copy, `Estimate`, `To Do` and `Actual` do not auto-recalculate each other.
- Owner fills `Actual` when work is done.
- Marking a Task `Completed` sets `To Do` to 0.
- Reopening a completed Task does not auto-restore `To Do`; the Owner must enter a new To Do value if remaining work exists.

This replaces the older task rule that displayed `Estimate = To Do + Actual`.

### 5.5 Archive

- Feature removal uses **Archive**, not hard delete.
- Workspace Admin and the managing Project Admin may archive a Feature within their allowed Project scope.
- Project Member cannot archive.
- Archived Features remain available for history/audit, do not appear in the default active list and cannot receive newly created or newly assigned Story/Defect children.
- Restoring an archived Feature is outside the P5.1 mockup baseline unless separately proposed and confirmed.

## 6. Feature Progress Rollups

A Feature does not store a numeric Plan Estimate. Capacity Planning stores allocation as a plan-specific value, so planning demand can stay fixed even if the Feature's child Story/Defect estimate changes later.

A Feature may store two optional top-down refined forecasts used only by the two `Estimated Progress by...` indicators:

- `refinedEstimate` = fixed top-down points forecast for the Feature.
- `refinedWorkItemCountEstimate` = fixed top-down Story/Defect count forecast for the Feature.

If either refined field is blank, the mockup derives a fallback from Preliminary Estimate:

| Preliminary Estimate | Points fallback | Count fallback |
|---|---:|---:|
| No Entry | 0 | 0 |
| XS | 1 | 1 |
| S | 3 | 2 |
| M | 5 | 3 |
| L | 8 | 5 |
| XL | 13 | 8 |

**Deferred Project Management configuration note - 2026-07-27:** The fallback table above is temporary mockup data. BA confirmed that Mini Rally needs a user-defined Preliminary Estimate scale/mapping, and the configuration location will be `Settings gear > Workspace > Project Management`. Do not treat the current values as hard-coded product rules; implementation must wait for the Project Management design slice to be confirmed.

The Feature Detail screen shows:

- Left Details content area: `Total Accepted Children`, a read-only progress meter based on accepted linked Story/Defect, switchable between Points and Count.
- Right panel top fields: `Owner`, then `Project`.
- Right panel progress section: four read-only progress indicators from linked Story/Defect (`featureId`).

- **Percent Done by Story Plan Estimate** = accepted linked Story/Defect Plan Estimate / all linked Story/Defect Plan Estimate.
- **Percent Done by Story Count** = accepted linked Story/Defect count / all linked Story/Defect count.
- **Estimated Progress by Story Points** = accepted linked Story/Defect Plan Estimate / `feature.refinedEstimate` (or Preliminary Estimate points fallback if not refined).
- **Estimated Progress by Story Count** = accepted linked Story/Defect count / `feature.refinedWorkItemCountEstimate` (or Preliminary Estimate count fallback if not refined).

The progress indicators are read-only everywhere they are shown. A Feature with no linked Story/Defect shows 0% progress.

## 7. Confirmed Field Options

| Field | Options |
|---|---|
| Feature State (Portfolio Item State) | No Entry, Intake, Idea Prioritization, Problem Discovery, Solution Discovery, Feature Prioritization, Developing, Accepted, Measuring, Done, Cancelled |
| Preliminary Estimate | No Entry, XS, S, M, L, XL |
| Schedule State (on linked Story/Defect - existing Phase 1/2 enum, unchanged, shown as the app-wide segmented bar) | Idea, Defined, In-Progress, Completed, Accepted, Release |

## 8. Functional Requirements

| ID | Requirement |
|---|---|
| P5-PI-FR-001 | User can open `Portfolio > Portfolio Items`. |
| P5-PI-FR-002 | Portfolio Items list shows Rank, Type, ID, Name, Release, State, Percent Done By Story Plan Estimate, Percent Done By Story Count, Project, Team, Owner. |
| P5-PI-FR-003 | Every list column is sortable and resizable. |
| P5-PI-FR-027 | The two Portfolio Items list Percent Done columns render progress bars using the live child Story/Defect denominator formulas: accepted Plan Estimate over all current child Plan Estimate, and accepted child count over all current child count. |
| P5-PI-FR-004 | User with `manageFeatures` can inline-edit Name, Release, State, Project, Team and Owner directly from the list. |
| P5-PI-FR-005 | User can reorder Features via Rank up/down controls. |
| P5-PI-FR-006 | User can expand a Feature row to preview up to 5 linked Story/Defect without leaving the list. |
| P5-PI-FR-007 | Clicking a Feature row (outside inline-edit/reorder/expand controls) opens Feature Detail. |
| P5-PI-FR-008 | User with `manageFeatures` can create a Feature via `New Feature`, with either immediate return to the list or immediate entry into the new Feature's Detail page. |
| P5-PI-FR-009 | Feature Detail Details tab shows Description/Attachments/Notes/What Success Looks Like plus the left computed summary and right-rail fields listed in §5.1. |
| P5-PI-FR-010 | Feature Detail Children tab lists every Story/Defect linked to the Feature with Backlog-equivalent search/filter/sort/resize/pagination. |
| P5-PI-FR-011 | User with `manageFeatures` can inline-edit Name, Priority (Defect), Est, Owner, Schedule State and Release directly from the Children tab. |
| P5-PI-FR-012 | User can expand a Children-tab row to see its linked Tasks read-only. |
| P5-PI-FR-013 | User can add a new Story/Defect to a Feature via `Add Item`, pre-assigned to the Feature. |
| P5-PI-FR-014 | Clicking a Children-tab row (outside inline-edit controls) opens the same full Work Item Detail page used by Backlog/Iteration Status/Team Board/Quality. |
| P5-PI-FR-015 | Feature Detail shows Owner and Project first in the right panel, shows Preliminary Estimate and optional refined top-down estimates without any Feature Plan Estimate field, moves the old Progress field to left Details as `Total Accepted Children`, and keeps progress indicators computed from linked Story/Defect plus the confirmed top-down denominator formulas. |
| P5-PI-FR-026 | `Total Accepted Children` uses the same progress-meter visual format as the right-panel progress bars and lets the user switch between Points and Count. |
| P5-PI-FR-016 | `Portfolio Items` is the first entry in the `Portfolio` nav dropdown. |
| P5-PI-FR-017 | Portfolio visibility and edit actions follow Workspace Admin, managed-Project Project Admin and assigned-context read-only Project Member rules. |
| P5-PI-FR-018 | Every Release selector is limited to Releases belonging to the Feature's Project. |
| P5-PI-FR-019 | Description, Notes, What Success Looks Like and attachment metadata have a session-level Feature data contract rather than display-only placeholders. |
| P5-PI-FR-020 | Authorized users can Archive a Feature; the UI does not hard-delete it. |
| P5-PI-FR-021 | Archived Features cannot receive new Story/Defect children and are hidden from the default active list. |
| P5-PI-FR-022 | Story/Defect creation from Feature Detail reuses the Backlog Work Item creation flow and pre-fills the Feature field. |
| P5-PI-FR-023 | Work Item Detail exposes a Project-scoped Feature field; invalid cross-Project Feature assignment is cleared when Project changes. |
| P5-PI-FR-024 | Plan > Backlog shows only Unscheduled Story/Defect; assigning an Iteration removes the row from Backlog and moving it back to Unscheduled returns it. |
| P5-PI-FR-025 | Task Estimate, To Do and Actual follow the independent-field rule: Estimate-first copies to To Do once, Completed sets To Do to 0, and reopening does not restore To Do. |

## 9. BA Confirmations

| ID | Question | Confirmed answer |
|---|---|---|
| P5-PI-Q01 | Does Mini Rally need an Initiative/Theme level above Feature? | No - single-level Feature only; revisit if a future need for cross-quarter grouping appears. |
| P5-PI-Q02 | What columns belong on the Portfolio Items list? | Rank, Type, ID, Name, Release, State, Percent Done By Story Plan Estimate, Percent Done By Story Count, Project, Team, Owner - replacing the earlier single Progress column and the older ID/Type/Name/Owner/Status/Progress/Target Release/Related/Blocked/Updated set. |
| P5-PI-Q03 | Should the list still preview a Feature's children inline? | Yes - kept as an expand-to-preview interaction, but simplified: State and Percent Done columns are blank in the preview since the Children tab and full item detail already cover them in depth. |
| P5-PI-Q04 | Should clicking a Children-tab row do anything? | Yes - it must open the real, complete Work Item Detail page (same one Backlog uses), not a partial or Portfolio-specific view. |
| P5-PI-Q05 | Is the Features/Total Stories/Accepted Stories/Total Points summary bar needed? | No - removed from the page entirely. |
| P5-PI-Q06 | Should Story/Defect be linkable to a Feature after creation via a separate link/unlink picker? | No - membership is set only at creation (`Add Item`) or by editing the Story/Defect's own record; the picker was built, then explicitly removed. |
| P5-PI-Q07 | What is the Feature State field's option set? | The 11-value Portfolio Item State list in §7, matching the real Rally Portfolio Item State field the BA referenced. |
| P5-PI-Q08 | How is Portfolio access scoped? | Workspace Admin: all Projects editable; Project Admin: managed Projects editable; Project Member: assigned Project/Team read-only. |
| P5-PI-Q09 | How is Feature removal handled? | Archive, never hard delete; archived Features retain history and cannot receive new children. |
| P5-PI-Q10 | Are Release choices global? | No. Every Feature Release choice is scoped to the Feature's Project. |
| P5-PI-Q11 | Should Feature children be represented as Work Items? | Yes. Children of a Feature are Story/Defect Work Items. Creating one inside a Feature uses the same Work Item template and pre-fills the Feature field. |
| P5-PI-Q12 | What belongs in Plan > Backlog after Iteration assignment? | Only planned/unassigned Story/Defect work. Once a Work Item is assigned to an Iteration it leaves Backlog and appears under that Iteration; Unscheduled returns it to Backlog. |
| P5-PI-Q13 | How should Task Estimate, To Do and Actual behave? | They are independent fields. Estimate-first copies to To Do once; complete sets To Do to 0; no later automatic recalculation or restore. |
| P5-PI-Q14 | How should `Total Accepted Children` display accepted child rollup? | Use the same progress-meter visual style as `Percent Done by Story Plan Estimate`; user may toggle Points/Count. Points uses accepted child Plan Estimate over all current child Plan Estimate; Count uses accepted child count over all current child count. |
| P5-PI-Q15 | Where should Preliminary Estimate scale/mapping be defined? | Deferred. BA confirmed it must be user-configurable under `Settings gear > Workspace > Project Management`, not hard-coded in Portfolio. Design and implementation will be confirmed later. |

## 10. Acceptance Criteria

1. User can open `Portfolio > Portfolio Items` and see the confirmed column set.
2. All list columns are sortable and resizable.
3. User with `manageFeatures` can inline-edit Name, Release, State, Project, Team and Owner from the list.
4. Rank can be changed via up/down controls and the new order persists across a Rank-column sort.
5. Expanding a Feature row previews up to 5 linked Story/Defect with State and Percent Done cells blank.
6. Clicking a Feature row opens Feature Detail; inline-edit controls, Rank buttons and the expand chevron do not trigger navigation.
7. `New Feature` creates a Feature via both `Create Feature` and `Create with details` paths.
8. Feature Detail Details tab shows all fields listed in §5.1.
9. Feature Detail Children tab shows Backlog-equivalent search/filter/sort/resize/pagination over linked Story/Defect.
10. Children-tab rows are inline-editable on the confirmed fields and expandable to show linked Tasks read-only.
11. `Add Item` creates a new Story/Defect already linked to the current Feature.
12. Clicking a Children-tab row opens the full Work Item Detail page, identical to opening the same item from Backlog.
13. Feature has no Plan Estimate field; Preliminary Estimate remains the rough Feature sizing field; optional Refined Estimate and Refined Work Item Count Estimate provide top-down denominators for the `Estimated Progress by...` bars; the old Progress field is shown in the left Details area as `Total Accepted Children`; the four progress indicators remain read-only.
13a. The Portfolio Items list does not show a generic `Progress` column; it shows two progress-bar columns: `Percent Done By Story Plan Estimate` and `Percent Done By Story Count`.
14. `Total Accepted Children` is formatted as a progress meter and can toggle between Points and Count; accepted child work rolls up when a child Story/Defect reaches Accepted or Release.
15. No summary metrics strip appears above the Portfolio Items list.
16. No link/unlink-existing control exists anywhere in Feature Detail.
17. `Portfolio Items` is the first entry in the `Portfolio` nav dropdown.
18. Project-scoped visibility/edit behavior passes positive and negative checks for all three technical roles.
19. Release selectors never offer a Release from another Project.
20. Editing Description, Notes and What Success Looks Like updates the shared session Feature record; attachment metadata has an explicit mock-state behavior.
21. Authorized users can archive but not hard-delete a Feature; archived Features are hidden by default and reject new children.
22. Phase 5.1 business/UAT scenarios, traceability, build and live browser smoke evidence are complete.
23. Creating a Story/Defect from Feature Detail opens the shared Work Item creation flow and the resulting Work Item has the current Feature pre-filled.
24. Work Item Detail allows changing Feature within the same Project, supports Unassigned, and clears the value if Project changes make the old Feature invalid.
25. Assigning an Unscheduled Story/Defect to an Iteration removes it from Plan > Backlog; setting it back to Unscheduled returns it.
26. Task Estimate-first copy, independent hour editing, Completed -> To Do 0, and reopen-without-restore behavior are verified.

## 11. Open Questions

No governance-level business question remains after `P5-GOV v1`. P5.1 was BA accepted and closed on 2026-07-26 after Amendment v3 implementation/build/runtime smoke evidence. Project/RBAC, field-data, Archive and Phase 5.1 test requirements are implemented and runtime-smoke verified in the mockup; API payloads, database persistence and server-side authorization remain production-development scope and must not be inferred from the mockup.
