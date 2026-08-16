# SRS - Phase 5.1 Portfolio Items

## 0. Document Control

| Attribute | Value |
|---|---|
| Module ID | `P5-PORTFOLIO-ITEMS` |
| Status | BA accepted; P5.1 Portfolio Items (`Epic -> Feature`) closed for BA/mockup scope |
| Updated date | 2026-08-14 |
| Scope | `Portfolio > Portfolio Items` Epic + Feature hierarchy, Feature create/detail/children, Epic create/detail/children |
| Priority | P5.1 - Portfolio Item foundation; Epic amendment is now part of the accepted P5.1 baseline |
| Depends on | Phase 1 Backlog Work Item base, Phase 2 list conventions, Phase 3 Release Management and Phase 4 Project Access |
| Mockup source | `03_Mockup Design/src/app/pages/PortfolioPage.tsx` |
| Not included | Theme/deeper custom Portfolio Item levels, Release Planning, Reports, API payloads and persistence design, "link/unlink existing Story-Defect" (removed, superseded by Add Item), drag-and-drop Rank reordering |

Phase 5 closed on 2026-07-28. Production implementation must use `../PHASE5_DEV_HANDOFF.md`; this SRS remains the detailed P5.1 requirement source.

## 1. Goal

Portfolio Items gives leadership an Epic-and-Feature view of work above Story/Defect, so large outcomes can be grouped into Epics, broken into Features, staffed and rolled up without reading every individual Story. Feature remains the lowest Portfolio Item type and the only level that attaches directly to Story/Defect. Epic is a Project-level grouping above Feature.

## 2. Confirmed Direction

- Mini Rally uses a **two-level Portfolio Item hierarchy: Epic -> Feature**. Rally's level commonly named `Initiative` is labelled **Epic** in Mini Rally for product clarity.
- A Feature is still the **only** Portfolio Item type that attaches directly to the Story/Defect hierarchy, matching Rally's rule that only the lowest Portfolio Item type links to User Stories. Epic rolls up through its child Features and never links directly to Story/Defect. Story, Defect and Task below Feature are unchanged from Phase 1/2.
- A Feature does **not** store a Plan Estimate field. Feature progress indicators are read-only rollups computed from the Story/Defect linked to that Feature (see Â§6). The two `Estimated Progress by...` indicators compare accepted child work against optional top-down Feature forecasts (`Refined Estimate` and `Refined Work Item Count Estimate`) with a Preliminary Estimate fallback. Capacity Planning uses plan-specific allocation values entered inside the Capacity Plan.
- `Portfolio Items` is the first entry in the top-nav `Portfolio` dropdown, followed by `Capacity Planning` and `Release Tracking`. `Release Planning` remains Future Backlog and is not an active entry.
- The Portfolio Items list has no page-level summary metrics strip (Features / Total Stories / Accepted Stories / Total Points was built, then explicitly removed per BA - "no need"). The page goes straight from the breadcrumb to the list toolbar.
- Readiness is split: current UI presence means `Mockup Implemented`, not `Production Ready`. The Feature baseline and Epic amendment were BA accepted and P5.1 was re-closed for BA/mockup scope on 2026-07-28. API persistence, server-side authorization and production integration are not started.

## 3. Portfolio Items List

### 3.1 Columns

| Column | Editable inline | Notes |
|---|---|---|
| Rank | Yes (up/down reorder buttons only, no drag-and-drop) | Manual stack-rank order, same convention as Backlog's Rank column |
| Type | No | Shows `Epic` or `Feature` |
| ID | No | Portfolio Item identifier, e.g. `EP-101`, `FE-318` |
| Name | Yes | Portfolio Item name |
| Release | Feature only | Feature supports `Unscheduled` or a confirmed Project-scoped Release. Epic does not use Release and renders `—` in this column. |
| State | Yes | 11-value Portfolio Item State, see Â§7 |
| Percent Done By Story Plan Estimate | No | Progress bar: accepted linked Story/Defect Plan Estimate / all current linked Story/Defect Plan Estimate; same live formula as Â§6 |
| Percent Done By Story Count | No | Progress bar: accepted linked Story/Defect count / all current linked Story/Defect count; same live formula as Â§6 |
| Project | No | Inherited from the current Project context at creation and read-only afterward for both Feature and Epic. |
| Team | Yes for Feature; No for Epic | Feature options are scoped to the Feature's current Project. Epic has no Team and shows child Feature count where applicable |
| Owner | Yes | |

### 3.2 List Behavior

- The breadcrumb/header contains a `Type` selector with exactly two choices: `Epic` and `Feature`; there is no combined `All` option.
- With `All Teams`, the selected Type controls whether Epic roots or Feature rows are listed. With a specific Team, `Feature` shows only that Team's Features; selecting `Epic` shows the explicit empty message `Filter not show item`.
- The list toolbar starts with `Search portfolio items`, followed by `New Portfolio Item`, `Filter` and `Show Fields`. `Show Fields` controls which grid columns are visible. The old Active/Archived/All selector is removed; the current mockup list defaults to active items.
- Every visible root row has a checkbox. Selecting rows exposes Backlog-style bulk `Edit` and `Delete` actions. `Edit` requires exactly one row. `Delete` archives the selected Portfolio Items rather than hard-deleting them; an Epic with active child Features is skipped and reported.
- Every column is resizable (drag the column border) and sortable (click the column header).
- Inline edit follows effective Project Access. Feature supports Name, Release, State, Team and Owner. Epic supports Name, State and Owner; Project is read-only for both types, and Epic has no Release or Team editor.
- Workspace Admin manages Portfolio across all Projects. Admin manages Portfolio in assigned Projects. Editor and unassigned users do not access Portfolio Items.
- Feature Release options in list, create and detail are scoped to the Feature's current Project. Epic never exposes a Release selector in create, list inline edit or detail.
- Clicking anywhere on an Epic or Feature row other than an inline-edit control, the Rank reorder buttons, or the expand chevron opens that item's Detail page.
- Epic root rows keep Rank. Feature child rows revealed under an expanded Epic do not display Rank because their order is contextual to the parent preview; root Feature rows retain Rank.
- Each Feature row has an expand chevron (only shown when the Feature has at least one linked Story/Defect) that reveals up to 5 linked items as an inline, read-only preview: Type, ID, Name, Release, Project, Team, Owner are shown; **State and the two Percent Done columns are intentionally left blank in this preview** - the full State (as the app-wide Schedule State bar) and per-item progress are available on the Children tab (Â§5.2) or that item's own full detail, and were judged unnecessary clutter for a quick preview. If more than 5 items are linked, a static "+N more - see Children tab" line is shown; it is not clickable. Expanding/collapsing a Feature's preview does not open its Detail page, and the preview rows themselves are not inline-editable and do not navigate anywhere on click.

## 4. Create Feature

- `New Portfolio Item` is visible only to Workspace Admin or Admin in the assigned Project. It opens `New Epic` and `New Feature`.
- Create modal fields: Project (auto-filled from the current Project context and read-only), Team (select, scoped to that Project), Name (required), State (11-value Portfolio Item State, defaults to `No Entry`), Preliminary Estimate (T-shirt size, defaults to `No Entry`), Owner, Target Release (`Unscheduled` or a confirmed Release).
- Two submit actions:
  - `Create Feature` - creates the Feature and returns to the Portfolio Items list.
  - `Create with details` - creates the Feature and immediately opens its Detail page.
- Progress is not manually set and only appears from linked Story/Defect rollups (Â§6). Capacity allocation is not set on the Feature; it is entered later inside Capacity Planning.

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
| Total Accepted Children | Read-only progress-meter summary, switchable between Points and Count, see Â§6 |

Right rail, in order:

| Field | Behavior |
|---|---|
| Owner | Select |
| Project | Read-only; inherited from the Project context used at creation |
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

Right-rail order note (revised 2026-07-28): `Preliminary Estimate` remains in the right panel and is supplied during Feature creation. `Refined Estimate` and `Refined Work Item Count Estimate` appear immediately below the read-only `Creation Date`, because refinement happens after the Feature has been created.

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
- A Work Item's Project is selected during creation and is read-only after the Work Item is created. The user may change or clear the Feature, but every selectable Feature must belong to that fixed Project.

Plan > Backlog is the planning backlog only. It shows Story/Defect rows whose Iteration is `Unscheduled`. Assigning a row to an Iteration removes it from Backlog and makes it visible in that Iteration's execution/status views. Moving it back to `Unscheduled` returns it to Backlog.

### 5.4 Taskflow Hours

Task `Estimate`, `To Do` and `Actual` are three independent hour fields:

- On Task creation only, if `Estimate` is entered and `To Do` is blank, the system copies the same number of hours to `To Do` once.
- After that first copy, `Estimate`, `To Do` and `Actual` do not auto-recalculate each other.
- Owner fills `Actual` when work is done.
- Changing Task State, including completing or reopening it, never changes any of the three hour fields.

This is the current cross-phase Task-hour contract.

### 5.5 Archive

- Feature removal uses **Archive**, not hard delete.
- Workspace Admin and Admin may archive a Feature within allowed Project scope.
- Editor and unassigned users cannot archive.
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
| P5-PI-FR-004 | User with `manageFeatures` can inline-edit Feature Name, Release, State, Team and Owner; Epic Name, State and Owner are inline-editable. Project is read-only after creation; Epic Release/Team are absent. |
| P5-PI-FR-005 | User can reorder Features via Rank up/down controls. |
| P5-PI-FR-006 | User can expand a Feature row to preview up to 5 linked Story/Defect without leaving the list. |
| P5-PI-FR-007 | Clicking a Feature row (outside inline-edit/reorder/expand controls) opens Feature Detail. |
| P5-PI-FR-008 | User with `manageFeatures` can create a Feature via `New Feature`, with either immediate return to the list or immediate entry into the new Feature's Detail page. |
| P5-PI-FR-009 | Feature Detail Details tab shows Description/Attachments/Notes/What Success Looks Like plus the left computed summary and right-rail fields listed in Â§5.1. |
| P5-PI-FR-010 | Feature Detail Children tab lists every Story/Defect linked to the Feature with Backlog-equivalent search/filter/sort/resize/pagination. |
| P5-PI-FR-011 | User with `manageFeatures` can inline-edit Name, Priority (Defect), Est, Owner, Schedule State and Release directly from the Children tab. |
| P5-PI-FR-012 | User can expand a Children-tab row to see its linked Tasks read-only. |
| P5-PI-FR-013 | User can add a new Story/Defect to a Feature via `Add Item`, pre-assigned to the Feature. |
| P5-PI-FR-014 | Clicking a Children-tab row (outside inline-edit controls) opens the same full Work Item Detail page used by Backlog/Iteration Status/Team Board/Quality. |
| P5-PI-FR-015 | Feature Detail shows Owner and Project first in the right panel, shows Preliminary Estimate and optional refined top-down estimates without any Feature Plan Estimate field, moves the old Progress field to left Details as `Total Accepted Children`, and keeps progress indicators computed from linked Story/Defect plus the confirmed top-down denominator formulas. |
| P5-PI-FR-026 | `Total Accepted Children` uses the same progress-meter visual format as the right-panel progress bars and lets the user switch between Points and Count. |
| P5-PI-FR-016 | `Portfolio Items` is the first entry in the `Portfolio` nav dropdown. |
| P5-PI-FR-017 | Portfolio follows Phase 4 Project Access: WA all Projects; Admin manages assigned Projects; Editor and unassigned users are hidden. |
| P5-PI-FR-018 | Every Release selector is limited to Releases belonging to the Feature's Project. |
| P5-PI-FR-019 | Description, Notes, What Success Looks Like and attachment metadata have a session-level Feature data contract rather than display-only placeholders. |
| P5-PI-FR-020 | Authorized users can Archive a Feature; the UI does not hard-delete it. |
| P5-PI-FR-021 | Archived Features cannot receive new Story/Defect children and are hidden from the default active list. |
| P5-PI-FR-022 | Story/Defect creation from Feature Detail reuses the Backlog Work Item creation flow and pre-fills the Feature field. |
| P5-PI-FR-023 | Work Item Detail exposes an editable Project-scoped Feature field with `Unassigned`; Work Item Project is read-only after creation. |
| P5-PI-FR-024 | Plan > Backlog shows only Unscheduled Story/Defect; assigning an Iteration removes the row from Backlog and moving it back to Unscheduled returns it. |
| P5-PI-FR-025 | Task Estimate, To Do and Actual are independent editable fields. On Task creation only, Estimate is copied once to a blank To Do; later edits and Task State changes never recalculate or reset any hour field. |
| P5-PI-FR-028 | Portfolio Items supports Epic rows above Feature rows in `All Teams` context. |
| P5-PI-FR-029 | Team-specific context hides Epic rows and shows only Features for the selected Team. |
| P5-PI-FR-030 | `New Portfolio Item` supports both `New Epic` and `New Feature`; Epic create has no Team field. |
| P5-PI-FR-031 | Feature create and Feature Detail include a Project-scoped Epic field with `Unassigned` support. |
| P5-PI-FR-032 | Epic Detail reuses the Feature detail template and shows child Features in its Children tab. |
| P5-PI-FR-033 | Epic progress bars roll up leaf Story/Defect through child Features and use only Epic-owned top-down estimates for the Estimated Progress denominators. |
| P5-PI-FR-034 | Epic archive is blocked when active child Features exist and never cascades to Features. |
| P5-PI-FR-035 | Portfolio header exposes a Type selector with only `Epic` and `Feature`; a specific-Team plus Epic selection shows `Filter not show item`. |
| P5-PI-FR-036 | Portfolio toolbar exposes Search, New Portfolio Item, Filter and Show Fields; Show Fields controls visible grid columns and the old archive selector is absent. |
| P5-PI-FR-037 | Root rows support checkbox selection and Backlog-style bulk Edit/Delete; Delete archives and preserves the Epic active-child guard. |
| P5-PI-FR-038 | Feature child rows under an expanded Epic omit Rank; root Epic and root Feature rows retain Rank. |
| P5-PI-FR-039 | Epic has no Release assignment in create, inline list editing or Detail; the shared Release column renders `—` for Epic. |

## 9. BA Confirmations

| ID | Question | Confirmed answer |
|---|---|---|
| P5-PI-Q01 | Does Mini Rally need a level above Feature? | Yes - Mini Rally now uses `Epic -> Feature`; Rally's `Initiative` concept is labelled `Epic`. Theme/deeper hierarchy remains out of scope. |
| P5-PI-Q02 | What columns belong on the Portfolio Items list? | Rank, Type, ID, Name, Release, State, Percent Done By Story Plan Estimate, Percent Done By Story Count, Project, Team, Owner - replacing the earlier single Progress column and the older ID/Type/Name/Owner/Status/Progress/Target Release/Related/Blocked/Updated set. |
| P5-PI-Q03 | Should the list still preview a Feature's children inline? | Yes - kept as an expand-to-preview interaction, but simplified: State and Percent Done columns are blank in the preview since the Children tab and full item detail already cover them in depth. |
| P5-PI-Q04 | Should clicking a Children-tab row do anything? | Yes - it must open the real, complete Work Item Detail page (same one Backlog uses), not a partial or Portfolio-specific view. |
| P5-PI-Q05 | Is the Features/Total Stories/Accepted Stories/Total Points summary bar needed? | No - removed from the page entirely. |
| P5-PI-Q06 | Should Story/Defect be linkable to a Feature after creation via a separate link/unlink picker? | No - membership is set only at creation (`Add Item`) or by editing the Story/Defect's own record; the picker was built, then explicitly removed. |
| P5-PI-Q07 | What is the Feature State field's option set? | The 11-value Portfolio Item State list in Â§7, matching the real Rally Portfolio Item State field the BA referenced. |
| P5-PI-Q08 | How is Portfolio access scoped? | Workspace Admin: all Projects editable; Admin: assigned Projects editable; Editor and unassigned users: hidden. |
| P5-PI-Q09 | How is Feature removal handled? | Archive, never hard delete; archived Features retain history and cannot receive new children. |
| P5-PI-Q10 | Are Release choices global? | No. Every Feature Release choice is scoped to the Feature's Project. |
| P5-PI-Q11 | Should Feature children be represented as Work Items? | Yes. Children of a Feature are Story/Defect Work Items. Creating one inside a Feature uses the same Work Item template and pre-fills the Feature field. |
| P5-PI-Q12 | What belongs in Plan > Backlog after Iteration assignment? | Only planned/unassigned Story/Defect work. Once a Work Item is assigned to an Iteration it leaves Backlog and appears under that Iteration; Unscheduled returns it to Backlog. |
| P5-PI-Q13 | How should Task Estimate, To Do and Actual behave? | They are independent editable fields. On Task creation only, Estimate copies once to a blank To Do; after creation, changing any field or Task State never changes the other hour fields. |
| P5-PI-Q14 | How should `Total Accepted Children` display accepted child rollup? | Use the same progress-meter visual style as `Percent Done by Story Plan Estimate`; user may toggle Points/Count. Points uses accepted child Plan Estimate over all current child Plan Estimate; Count uses accepted child count over all current child count. |
| P5-PI-Q15 | Where should Preliminary Estimate scale/mapping be defined? | Deferred. BA confirmed it must be user-configurable under `Settings gear > Workspace > Project Management`, not hard-coded in Portfolio. Design and implementation will be confirmed later. |
| P5-PI-Q16 | When should Epic rows display? | The Type selector has only Epic/Feature. Epic displays only in `All Teams`; specific Team + Epic shows `Filter not show item`, while specific Team + Feature shows that Team's Features. |
| P5-PI-Q17 | Does Epic use Release? | No. Epic is Project-level and has no Release assignment. Release remains a Feature field only. |

## 10. Acceptance Criteria

1. User can open `Portfolio > Portfolio Items` and see the confirmed column set.
2. All list columns are sortable and resizable.
3. User with `manageFeatures` can inline-edit Feature Name, Release, State, Team and Owner; Epic supports Name, State and Owner only. Project is inherited from current context and read-only after creation.
4. Rank can be changed via up/down controls and the new order persists across a Rank-column sort.
5. Expanding a Feature row previews up to 5 linked Story/Defect with State and Percent Done cells blank.
6. Clicking a Feature row opens Feature Detail; inline-edit controls, Rank buttons and the expand chevron do not trigger navigation.
7. `New Feature` creates exactly one Feature via both paths. `Create Feature` returns to the list; `Create with details` opens the Detail page of the same newly created Feature without creating a duplicate.
8. Feature Detail Details tab shows all fields listed in Â§5.1.
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
18. Project-scoped visibility/edit behavior passes for Workspace Admin and every per-Project Access Level.
19. Release selectors never offer a Release from another Project.
20. Editing Description, Notes and What Success Looks Like updates the shared session Feature record; attachment metadata has an explicit mock-state behavior.
21. Authorized users can archive but not hard-delete a Feature; archived Features are hidden by default and reject new children.
22. Phase 5.1 business/UAT scenarios, traceability, build and live browser smoke evidence are complete.
23. Creating a Story/Defect from Feature Detail opens the shared Work Item creation flow and the resulting Work Item has the current Feature pre-filled.
24. Work Item Detail allows changing Feature within the same fixed Project and supports Unassigned; Project remains read-only after creation.
25. Assigning an Unscheduled Story/Defect to an Iteration removes it from Plan > Backlog; setting it back to Unscheduled returns it.
26. Task create-time Estimate-to-blank-To Do copy, independent hour editing, and no Task-State-driven hour mutation are verified.
27. `New Portfolio Item` opens a menu with `New Epic` and `New Feature`; only Workspace Admin/Admin see create actions.
28. `New Epic` creates a Project-level Epic with no Team field, and `Create with details` opens the Epic Detail page.
29. Portfolio list shows Epic rows only in `All Teams` context; selecting a specific Team hides Epic rows and shows that Team's Features.
30. Expanding an Epic row shows its child Features; Features without an Epic remain visible as root Feature rows.
31. Feature create and Feature Detail allow selecting, changing, or clearing the parent Epic, scoped to the Feature's Project.
32. Epic Detail reuses the Feature detail template, shows Details and Children tabs, and lists child Features in the Children tab.
33. Epic shows the four progress bars using leaf Story/Defect rollup through all child Features; top-down denominators come from the Epic's own Refined/Preliminary estimates, never from the sum of child Feature estimates.
34. Epic archive is blocked while active child Features exist and never cascades archive to Features.
35. The header Type selector contains only Epic and Feature; specific Team + Epic shows `Filter not show item`.
36. Search, New Portfolio Item, Filter and Show Fields appear in the confirmed toolbar order; Show Fields changes visible columns.
37. Root-row checkbox selection exposes Edit/Delete; Delete archives and reports any Epic blocked by active child Features.
38. Feature child rows under an expanded Epic do not show Rank.
39. Epic has no Release selector in create/detail and no inline Release editor; the list Release cell shows `—`.

## 11. P5.1.1 Epic Extension - 2026-07-28

This amendment reopens only the Portfolio Items hierarchy slice and does not reopen P5.2 Capacity Planning. Capacity Planning remains Feature-only.

### 11.1 Business Rules

- Mini Rally supports `Epic -> Feature -> Story/Defect -> Task`.
- The Rally level sometimes named `Initiative` is labelled `Epic` in Mini Rally.
- Epic is stored at Project level. It has no Team field.
- One Epic can contain many Features. One Feature can belong to zero or one Epic.
- A Feature with no Epic remains visible as an unassigned top-level Feature in `Portfolio > Portfolio Items`.
- A Story/Defect still links only to Feature. Epic never links directly to Story/Defect.
- Epic State is manually changed and never auto-derived from child Feature states.
- Epic Milestone and planned dates do not cascade to child Features. Epic has no Release assignment.
- Epic archive is blocked while it still has active child Features. Archive never cascades to Features.
- Existing Portfolio permission rules are reused: Workspace Admin and Admin can manage Epic in allowed Project scope; Editor and unassigned users are hidden.
- Team context rule: Epic rows appear only when the context Team is `All Teams`. If the user filters to a specific Team, Portfolio Items hides Epic rows and shows only Features in that Team.

### 11.2 Epic Create

The `New Portfolio Item` action opens a menu with:

- `New Epic`
- `New Feature`

`New Epic` fields:

| Field | Behavior |
|---|---|
| Project | Auto-filled from current Project context; read-only |
| Name | Required |
| State | Portfolio Item State, defaults to `No Entry` |
| Preliminary Estimate | T-shirt sizing value, defaults to `No Entry` |
| Owner | Required |

Actions:

- `Create Epic` creates the Epic and returns to the list.
- `Create with details` creates the Epic and opens Epic Detail immediately.

### 11.3 Portfolio List

The list keeps the existing column set: Rank, Type, ID, Name, Release, State, Percent Done By Story Plan Estimate, Percent Done By Story Count, Project, Team, Owner.

Epic row behavior:

- Type shows `Epic`.
- Team column shows the child Feature count instead of a Team name.
- Expand reveals child Features.
- Clicking an Epic row opens Epic Detail.
- Inline edit follows Feature conventions only where applicable: Name, State and Owner. Project is read-only. Epic has no Release or Team editor and its shared Release column renders `—`.

Feature row behavior:

- Feature rows under an Epic are shown when the Epic is expanded.
- Feature child rows under an Epic do not show Rank.
- Feature rows without an Epic remain as root rows.
- Feature create and Feature Detail include an `Epic` field. Selecting `Unassigned` removes the parent Epic.
- Creating a Feature from an Epic Detail page pre-fills that Epic.

### 11.4 Epic Detail

Epic Detail reuses the Feature detail template: dark header, back button, Details tab and Children tab.

Details tab main column:

- Total Accepted Children, switchable between Points and Count
- Description
- Attachments
- Notes
- What Success Looks Like

Details tab right rail:

| Field | Behavior |
|---|---|
| Owner | Select |
| Project | Read-only; inherited from current Project context at creation |
| Four progress bars | Read-only formulas in 11.5 |
| Preliminary Estimate | T-shirt sizing on the Epic itself |
| State | Manual Portfolio Item State |
| Milestone | Multi-select scoped to Epic Project |
| Creation Date | Read-only |
| Refined Estimate | Optional top-down Epic points forecast |
| Refined Work Item Count Estimate | Optional top-down Epic count forecast |
| Planned Start Date | Free text |
| Planned End Date | Date |
| Market Release Date | Date |

Children tab:

- Lists Features where `feature.epicId = epic.id`.
- Shows Rank, ID, Name, Team, State, Complete, Rollup, Estimated and Owner.
- Feature rows can expand to preview up to five leaf Story/Defect rows.
- `Add Feature` reuses the Feature creation flow with the current Epic pre-filled.
- Clicking a Feature child opens the normal Feature Detail page.

### 11.5 Epic Progress Formulas

Let `ALL` be every leaf Story/Defect under every Feature whose `feature.epicId` equals the Epic ID.

| Bar | Formula |
|---|---|
| Percent Done by Story Plan Estimate | `SUM(story.planEstimate WHERE Accepted/Release) / SUM(story.planEstimate)` across `ALL` |
| Percent Done by Story Count | `COUNT(story WHERE Accepted/Release) / COUNT(story)` across `ALL` |
| Estimated Progress by Story Points | `SUM(story.planEstimate WHERE Accepted/Release) / (epic.refinedEstimate ?? Preliminary points fallback)` |
| Estimated Progress by Story Count | `COUNT(story WHERE Accepted/Release) / (epic.refinedWorkItemCountEstimate ?? Preliminary count fallback)` |

Epic top-down estimates are typed on the Epic itself. They are not the sum of child Feature estimates. The temporary Preliminary Estimate fallback mapping is shared with Feature and Capacity Planning until the deferred Project Management configuration slice is built.

### 11.6 Data Model

```text
Epic {
  id, name, status, priority, owner,
  project,
  preliminaryEstimate,
  refinedEstimate,
  refinedWorkItemCountEstimate,
  milestoneIds,
  plannedStartDate, plannedEndDate, marketReleaseDate,
  description, notes, successCriteria, attachments,
  archivedAt
}

Feature {
  ...existing fields,
  epicId?: string
}
```

`preliminaryCount` is not stored independently. It is derived from the shared Preliminary Estimate mapping.

### 11.7 End-to-End Flow and Button Catalog

Accepted Epic flow:

1. Open `Portfolio > Portfolio Items`; select `Type = Epic` in `All Teams`.
2. Search or inspect existing Epic roots. Expand an Epic to preview child Features, or click the row to open Epic Detail.
3. Use `New Portfolio Item > New Epic` to create a Project-level Epic. `Create Epic` returns to the list; `Create with details` opens the created Epic.
4. Maintain Epic Name, State, Owner and top-down Preliminary/Refined estimates. Project remains read-only; Epic has no Team or Release assignment.
5. Open `Children` and use `Add Feature`; the shared Feature create flow opens with the current Epic pre-filled.
6. Leaf Story/Defect changes under child Features update the four Epic progress bars live. Epic State remains manual.
7. Archive is enabled only when no active child Feature remains. Archive never cascades.

| Control | Location | Behavior |
|---|---|---|
| Type: Epic / Feature | Breadcrumb/header | Switches the Portfolio Item level. There is no `All` option. Specific Team + Epic shows `Filter not show item`. |
| Search portfolio items | List toolbar | Filters the current Type view by ID/name text. |
| New Portfolio Item | List toolbar | Opens `New Epic` / `New Feature`; hidden for read-only users. |
| Filter | List toolbar | Reserved visual entry in the current mockup. No additional filter criteria contract is accepted in P5.1; Type/Search/Show Fields are the implemented filters. |
| Show Fields | List toolbar | Opens column checkboxes and immediately controls visible grid fields. |
| Row checkbox / Select all | Grid | Selects visible root records and opens the bulk action bar. |
| Edit | Bulk bar | Enabled for exactly one selection and opens that Portfolio Item's normal Detail page. |
| Delete | Bulk bar | Archives selected records. An Epic with active child Features is skipped and reported; no hard delete occurs. |
| Expand chevron | Epic row | Expands/collapses child Features without opening Detail. Child Feature Rank is blank. |
| Epic row | Grid | Opens Epic Detail when the click is outside inline controls/chevron. |
| Details / Children | Epic Detail header | Switches between Epic fields/progress and child Feature grid. |
| Points / Count | Total Accepted Children | Switches the accepted rollup display denominator/unit without changing data. |
| Add Feature | Epic Children | Opens shared Feature creation with the Epic pre-filled. |
| Archive | Epic detail action menu | Disabled when active child Features exist; otherwise opens confirmation and archives only the Epic. |

## 12. Open Questions

No governance-level business question remains for the accepted Epic extension. P5.1 Feature baseline was accepted on 2026-07-26; the Epic amendment was accepted after iterative in-app browser review on 2026-07-28, so `Portfolio Items` is closed for BA/mockup scope. API payloads, database persistence and server-side authorization remain production-development scope and must not be inferred from the mockup.
