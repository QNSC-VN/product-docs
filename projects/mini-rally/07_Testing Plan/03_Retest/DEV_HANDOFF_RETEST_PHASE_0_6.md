# DEV Handoff — Phase 0–6 Retest Fail & Partial

**Status date:** 2026-08-15

**Environment:** <https://rally-dev.qnsc.vn/>

**Source of truth:** `../PHASE_0_6_AUDIT_TRACKER.xlsx`

**Scope:** FE and approved business behavior only. Schema, database and infrastructure are out of scope.
**Supersedes:** All older DEV handoff summaries under `01_test_phase_1_to_4` and `02_test_phase_5_6`.

## 1. Current result

- Total workbook scenarios: **191**.
- **20 Fail** — DEV correction required.
- **13 Partial** — 3 need DEV/BA scope attention; 10 need upstream fixes, test data, accounts or technical evidence before closure.
- Other workbook statuses remain tracked only in the master workbook: 120 Pass, 7 additional Partial rows, 17 Blocked, 2 Not Run, 11 Future Backlog and 1 Not Required.

| Phase | Fail | Partial | Total open |
|---|---:|---:|---:|
| Phase 0 | 1 | 0 | 1 |
| Phase 1 | 1 | 3 | 4 |
| Phase 3 | 6 | 1 | 7 |
| Phase 4 | 1 | 2 | 3 |
| Phase 5 | 9 | 5 | 14 |
| Phase 6 | 2 | 2 | 4 |
| **Total** | **20** | **13** | **33** |

Fail priority: P0 = 14, P1 = 3, P2 = 2, P3 = 1.

## 2. Required fix order and failure chains

1. **Team membership chain:** `GAP-P3-TS-008 → GAP-P1-WID-007 → P6-TC-007`. Use one current active-Team membership source; Owner shows Unassigned plus active selected-Team members; null-owner hours remain under Unassigned.
2. **Team Status Task chain:** `GAP-P3-TS-005 → GAP-P3-TS-007`, then retest `GAP-P3-TS-006`. Render every counted Task before validating inline State and numeric defaults.
3. **Capacity Team chain:** fix `P5-CP-006`, then retest `P5-CP-015`, the cross-Team branch of `P5-CP-025`, `P5-CP-030` and `P5-CP-033`.
4. **Capacity metric chain:** fix `P5-CP-029`, then retest Rollup warnings in `P5-CP-030` and `P5-CP-033`.
5. **Portfolio hierarchy chain:** `P5-PI-017 → P5-PI-033`. Use the same leaf relationship for Work Item Detail, Children and progress formulas.
6. **Project-context chain:** fix the editable Project behavior in `P5-PI-003` and the cross-Project relationship leak in `P6-E2E-003` using the active Project context.
7. Artifact display, RBAC safeguard, Release Detail scope, Planned Team projection and Create-with-details findings are independent unless their case says otherwise. Release/Milestone Artifact `Add New Item` is Future Backlog and is not part of the current fix queue.

## 3. Confirmed Fail — DEV must fix

### GAP-P1-WID-007 — Owner default and Unassigned option

- **Phase / Priority / Module:** Phase 1 / P1 / Work Item Detail
- **Expected:** Work Item and Task Owner default to Unassigned. Selected Team offers Unassigned plus its active members; No Team offers only Unassigned.
- **Actual after retest:** BA confirmed live 2026-08-14: Owner selector omits active Work Item Team members.
- **Required DEV action / next check:** Owner must default to Unassigned. After a Team is selected, Owner must list only Unassigned plus active members of that Team. Do not add No Team or unrelated Workspace users to Owner options.
- **Dependency:** Related root: GAP-P3-TS-008. Retest Owner candidates after Team membership is corrected.
- **SRS / Mockup reference:** P1-WID-01
- **Evidence:** https://rally-dev.qnsc.vn/item/US-1
- **BA state:** BA confirmed 2026-08-14

### GAP-P3-TS-005 — Task State control type

- **Phase / Priority / Module:** Phase 3 / P2 / Team Status
- **Expected:** Every counted scoped Task renders exactly once under the correct active selected-Team member or Unassigned group and supports inline editing.
- **Actual after retest:** BA confirmed live 2026-08-14: Team Status counts a Task but does not render its Task row/inline State control.
- **Required DEV action / next check:** Member summary says one Task, but no Task row/inline State dropdown is rendered.
- **Dependency:** Independent unless noted in the failure-chain section.
- **SRS / Mockup reference:** P3-TS-01
- **Evidence:** https://rally-dev.qnsc.vn/team-status
- **BA state:** Pending BA review

### GAP-P3-TS-007 — Task Dashboard state labels

- **Phase / Priority / Module:** Phase 3 / P3 / Team Status
- **Expected:** Every rendered Task State control uses the full labels Defined, In-Progress and Completed and persists inline changes.
- **Actual after retest:** BA confirmed live 2026-08-14: counted Task cannot expose the required inline State values because its row is absent.
- **Required DEV action / next check:** Counted Task row is absent, so exact editable Task State labels cannot be used.
- **Dependency:** Direct downstream of GAP-P3-TS-005.
- **SRS / Mockup reference:** P3-TS-01
- **Evidence:** https://rally-dev.qnsc.vn/team-status
- **BA state:** Pending BA review

### GAP-P3-REL-001 — Release Progress widget

- **Phase / Priority / Module:** Phase 3 / P2 / Release Detail
- **Expected:** Timeboxes > Release Detail contains no Task Roll-up, Accepted progress, Burndown or other progress widgets; all Release progress belongs to Portfolio > Release Tracking.
- **Actual after retest:** BA confirmed live 2026-08-14: Task Roll-up/progress is still shown in Release Detail.
- **Required DEV action / next check:** Release Detail still includes Task Roll-up and Burndown, which Phase 3 defers.
- **Dependency:** Independent unless noted in the failure-chain section.
- **SRS / Mockup reference:** P3-REL-01
- **Evidence:** https://rally-dev.qnsc.vn/releases
- **BA state:** Pending BA review

### GAP-P3-REL-002 — Release Artifacts assignment display

- **Phase / Priority / Module:** Phase 3 / P0 / Release Artifacts
- **Expected:** Release Artifacts shows directly assigned US/DE/Feature after assignment from Backlog/Work Item Detail or Portfolio Feature.
- **Actual after retest:** Live retest 2026-08-15: Release Add Artifact can add/remove existing US/DE and persists after reload. RE-1 shows its assigned US, but FE-6 still shows RE-2 in Portfolio after reload while RE-2 Artifacts reports `0 items`.
- **Required DEV action / next check:** Keep the working US/DE assignment behavior and fix the Release Artifacts query/display for a directly assigned Feature. Do not implement Artifact-origin Create/Create with details in the current fix scope.
- **Dependency:** Independent unless noted in the failure-chain section.
- **SRS / Mockup reference:** P3-REL-02
- **Evidence:** https://rally-dev.qnsc.vn/releases/019fff28-51be-7024-a876-dd7cc6eb0ec0; https://rally-dev.qnsc.vn/portfolio
- **BA state:** BA confirmed Fail 2026-08-15

### GAP-P3-MS-002 — Milestone Artifacts assignment display

- **Phase / Priority / Module:** Phase 3 / P0 / Milestone Artifacts
- **Expected:** Milestone Artifacts shows directly assigned US/DE/Feature/Epic after reload. Feature/Epic descendants enter the inherited display/rollup scope once, without duplicate counting. Artifact-origin Create/Create with details remains Future Backlog.
- **Actual after retest:** Live retest 2026-08-15: Milestone Add Artifact can add/remove existing US/DE and persists after reload. FE-6 can be assigned MS-1 from Portfolio and the Milestone field persists after Save/reload, but MS-1 Artifacts still shows only US-8 and US-9; FE-6 is absent.
- **Required DEV action / next check:** Fix Milestone Artifacts query/display for directly assigned Feature/Epic and the de-duplicated inherited descendants. Keep the existing US/DE behavior. Do not implement Artifact-origin Create/Create with details in the current fix scope.
- **Dependency:** Direct Feature/Epic display must work before inherited descendant and rollup acceptance can be completed.
- **SRS / Mockup reference:** P3-MS-009; Phase 3/03_Milestones/SRS.md
- **Evidence:** https://rally-dev.qnsc.vn/milestones/019fff28-b5b6-714d-a7e4-f05cbd5430c5; https://rally-dev.qnsc.vn/portfolio
- **BA state:** BA confirmed Fail 2026-08-15

### GAP-P4-RBAC-002 — Workspace Admin account safeguard

- **Phase / Priority / Module:** Phase 4 / P0 / User Management
- **Expected:** Workspace Admin detail is entirely read-only, has no Project assignment and cannot be added as a Project member.
- **Actual after retest:** WA General is read-only, but WA Project Access still exposes Add project access.
- **Required DEV action / next check:** WA General is read-only, but WA Project Access still exposes Add project access.
- **Dependency:** Independent unless noted in the failure-chain section.
- **SRS / Mockup reference:** P4-RBAC-02
- **Evidence:** https://rally-dev.qnsc.vn/settings
- **BA state:** Pending BA review

### GAP-P3-TS-008 — Team membership scope consistency

- **Phase / Priority / Module:** Phase 3 / P0 / Team Status
- **Expected:** Team Status shows only active members of the Team selected in the top filter. Null-owner Tasks appear under Unassigned with 0h capacity; no outside-Team member group appears.
- **Actual after retest:** BA confirmed live 2026-08-14: Team Status member scope is inconsistent with selected Team membership.
- **Required DEV action / next check:** Settings lists only Anh in Pegasus while Team Status still groups non-member Hieu with one Task.
- **Dependency:** Independent unless noted in the failure-chain section.
- **SRS / Mockup reference:** Phase 3/01_Team_Status/SRS.md; Phase 1/03_Work_Item_Detail/SRS.md
- **Evidence:** https://rally-dev.qnsc.vn/team-status
- **BA state:** Pending BA review

### GAP-P0-SHELL-007 — Remove Manage Projects from Project/Team dropdown

- **Phase / Priority / Module:** Phase 0 / P1 / Global navigation
- **Expected:** The Project/Team dropdown only changes delivery context. Project administration is available only under the top-right Settings gear > Workspaces & Projects.
- **Actual after retest:** DevInt still shows Manage Projects at the bottom of the Project/Team dropdown.
- **Required DEV action / next check:** Remove Manage Projects from the selector. Keep Project administration under Settings gear only.
- **Dependency:** Independent unless noted in the failure-chain section.
- **SRS / Mockup reference:** 04_Developement_tracking/RECONCILED_SOURCE_OF_TRUTH.md; 04_Developement_tracking/reconciliation/DEV_HANDOFF.md
- **Evidence:** https://rally-dev.qnsc.vn/
- **BA state:** BA confirmed Fail 2026-08-14

### P5-PI-003 — Workspace Admin inline edit

- **Phase / Priority / Module:** Phase 5 / P0 / P5-PI - Portfolio Items
- **Expected:** Inline edits apply immediately; Feature Project change keeps Team/Release valid; Epic has no Release or Team editor
- **Actual after retest:** Project must be inherited from the active context and read-only. DevInt exposes an interactive Project selector; selecting AUDIT26 returns an unexpected error.
- **Required DEV action / next check:** Remove the editable Project selector and always inherit the current Project context.
- **Dependency:** Independent unless noted in the failure-chain section.
- **SRS / Mockup reference:** Phase 5/01_Portfolio_Items/SRS.md
- **Evidence:** https://rally-dev.qnsc.vn/portfolio
- **BA state:** BA confirmed Fail 2026-08-14

### P5-PI-016 — Feature child Work Item creation

- **Phase / Priority / Module:** Phase 5 / P0 / P5-PI - Portfolio Items
- **Expected:** Create with details creates exactly one item and opens that same item's Detail with Feature/Release/Milestone prefills preserved.
- **Actual after retest:** BA confirmed live 2026-08-14: Create works but Create with details cannot complete/open the created detail flow.
- **Required DEV action / next check:** Make Create with details executable. It must create exactly one Work Item, preserve the current Feature prefill and open that same Work Item Detail. Normal Create remains valid.
- **Dependency:** Independent unless noted in the failure-chain section.
- **SRS / Mockup reference:** Phase 5/01_Portfolio_Items/SRS.md
- **Evidence:** https://rally-dev.qnsc.vn/portfolio
- **BA state:** Pending BA review

### P5-PI-017 — Work Item Feature field

- **Phase / Priority / Module:** Phase 5 / P0 / P5-PI - Portfolio Items
- **Expected:** Feature selector offers only active same-Project Features; Project change clears invalid Feature assignment
- **Actual after retest:** Feature selection persists in Work Item Detail, but the inverse Feature/Epic Children relation is inconsistent for US-5 and US-12.
- **Required DEV action / next check:** Synchronize Work Item Feature assignment with the Feature/Epic Children projection.
- **Dependency:** Independent unless noted in the failure-chain section.
- **SRS / Mockup reference:** Phase 5/01_Portfolio_Items/SRS.md
- **Evidence:** https://rally-dev.qnsc.vn/item/US-12; https://rally-dev.qnsc.vn/portfolio
- **BA state:** BA confirmed Fail 2026-08-14

### P5-PI-033 — Epic progress formulas

- **Phase / Priority / Module:** Phase 5 / P0 / P5-PI - Portfolio Items
- **Expected:** Four Epic progress bars roll up leaf Story/Defect through Features; Estimated Progress denominators use Epic-owned Refined/Preliminary estimates only
- **Actual after retest:** Epic/Feature Children and Work Item Detail disagree on the leaf set, so Epic progress numerators and denominators cannot be trusted.
- **Required DEV action / next check:** Fix the hierarchy leaf set before retesting Epic progress formulas.
- **Dependency:** Downstream of P5-PI-017 hierarchy projection.
- **SRS / Mockup reference:** Phase 5/01_Portfolio_Items/SRS.md
- **Evidence:** https://rally-dev.qnsc.vn/portfolio
- **BA state:** BA confirmed Fail 2026-08-14

### P5-CP-006 — Add/Remove Teams

- **Phase / Priority / Module:** Phase 5 / P0 / P5-CP - Capacity Planning
- **Expected:** Added Teams appear as leaf Project/Team rows; removed Team disappears; its allocation rows return to Unallocated; adding it restores the Team row
- **Actual after retest:** Add/Remove Teams exposes only Pegasus and another eligible Team cannot be added. This blocks the split-allocation chain.
- **Required DEV action / next check:** Root defect for P5-CP-008 and the cross-Team branch of P5-CP-025. Fix Team eligibility/addition and retest.
- **Dependency:** Independent unless noted in the failure-chain section.
- **SRS / Mockup reference:** Phase 5/02_Capacity_Planning/SRS.md
- **Evidence:** https://rally-dev.qnsc.vn/capacity-planning/41d10dd3-6392-47c0-8972-bc4e521d319e
- **BA state:** BA confirmed Fail 2026-08-14

### P5-CP-025 — Allocation origin column on the expanded Team Feature table

- **Phase / Priority / Module:** Phase 5 / P0 / P5-CP - Capacity Planning
- **Expected:** The row under the Feature's own Team shows —; the row under a Team the Feature was split into reads From {Feature's own Team}. Dependencies renders as a placeholder — on every row
- **Actual after retest:** FE-2 own-Team Allocation and Dependencies show 0 instead of —. From Pegasus remains downstream-blocked by P5-CP-006.
- **Required DEV action / next check:** Render — for own-Team Allocation and Dependencies; retest cross-Team origin after P5-CP-006.
- **Dependency:** Cross-Team branch depends on P5-CP-006; the own-Team 0-versus-dash defect is independently reproducible.
- **SRS / Mockup reference:** Phase 5/02_Capacity_Planning/SRS.md
- **Evidence:** https://rally-dev.qnsc.vn/capacity-planning/41d10dd3-6392-47c0-8972-bc4e521d319e
- **BA state:** BA confirmed Fail 2026-08-14

### P5-CP-029 — Live Complete/Rollup/Estimated and Team-split display

- **Phase / Priority / Module:** Phase 5 / P0 / P5-CP - Capacity Planning
- **Expected:** Complete sums child Plan Estimate at Completed or later; Rollup sums every child Plan Estimate; Estimated follows allocation/refined/preliminary. Feature rows show numbers without percentages. Features tab shows the Feature total; expanded Team rows show Team slices; Team summary rows retain number plus percent of manual Capacity. Moving a child backward reduces Complete only
- **Actual after retest:** FE-2 child US-5 has Plan Estimate 3, but Complete/Rollup remain 0 at Idea and Completed after reload. US-5 was restored to Idea.
- **Required DEV action / next check:** Fix child Plan Estimate aggregation and status rollback recalculation.
- **Dependency:** Independent unless noted in the failure-chain section.
- **SRS / Mockup reference:** Phase 5/02_Capacity_Planning/SRS.md
- **Evidence:** https://rally-dev.qnsc.vn/capacity-planning/41d10dd3-6392-47c0-8972-bc4e521d319e
- **BA state:** BA confirmed Fail 2026-08-14

### P5-CP-030 — Exceed warnings on Capacity Plan progress bars

- **Phase / Priority / Module:** Phase 5 / P0 / P5-CP - Capacity Planning
- **Expected:** Red warning triangle appears on the progress bar; tooltip lists Rollup exceeds Estimated. The Team Features cell is left-aligned and shows a red attention badge counting child Features with Feature-level exceed; badge hover says N Feature(s) require attention. Plan and Team levels also warn on Rollup > Capacity and Estimated > Capacity when applicable. Feature rows do not show Capacity warnings because Feature rows have no Capacity column. Header total progress bar is widened.
- **Actual after retest:** Missing-estimate and Estimated-over-Capacity warnings pass. Rollup warnings are blocked by P5-CP-029 and cross-Team warnings by P5-CP-006; Capacity was restored to 20.
- **Required DEV action / next check:** Retest Rollup and cross-Team warning branches after P5-CP-029 and P5-CP-006 are fixed.
- **Dependency:** Retest Rollup warnings after P5-CP-029 and cross-Team warnings after P5-CP-006.
- **SRS / Mockup reference:** Phase 5/02_Capacity_Planning/SRS.md
- **Evidence:** https://rally-dev.qnsc.vn/capacity-planning/41d10dd3-6392-47c0-8972-bc4e521d319e
- **BA state:** BA confirmed Fail 2026-08-14

### P5-CP-032 — Features tab quick Planned Team Assignment

- **Phase / Priority / Module:** Phase 5 / P0 / P5-CP - Capacity Planning
- **Expected:** Planned Team Assignment, Teams by Total and Team Capacity rail use the same allocation ledger: zero Team = Not assigned, one Team = selected Team, split = N teams; Portfolio owning Team remains separate.
- **Actual after retest:** BA confirmed live 2026-08-14: Planned Team Assignment is inconsistent with allocation ledger/team rail.
- **Required DEV action / next check:** FE-2 Planned Team displays `Not assigned` while the same row shows Team Pegasus, estimate `Allocated 8`, and Team rail 8/30; the selector and allocation ledger disagree.
- **Dependency:** Independent unless noted in the failure-chain section.
- **SRS / Mockup reference:** Phase 5/02_Capacity_Planning/SRS.md
- **Evidence:** https://rally-dev.qnsc.vn/capacity-planning/41d10dd3-6392-47c0-8972-bc4e521d319e
- **BA state:** Pending BA review

### P6-TC-007 — Use unassigned Task

- **Phase / Priority / Module:** Phase 6 / P1 / E. Reports > Team Capacity
- **Expected:** A null-owner Task contributes only to an Unassigned row with 0h capacity and is never attributed to a named member.
- **Actual after retest:** BA confirmed live 2026-08-14: null-owner Task hours are attributed to a named member.
- **Required DEV action / next check:** Fail: an unassigned Task must not be attributed to a named member; use the Unassigned group defined by the report rule.
- **Dependency:** Shares the Team/Owner chain but still needs an independent null-owner aggregation fix.
- **SRS / Mockup reference:** Phase 6/04_Team_Capacity/SRS.md
- **Evidence:** https://rally-dev.qnsc.vn/reports
- **BA state:** Pending BA review

### P6-E2E-003 — Change Project/Team/Release/Iteration context

- **Phase / Priority / Module:** Phase 6 / P0 / F. Cross-phase E2E regression
- **Expected:** Invalid relationships clear or filter by approved rules; unrelated data does not leak
- **Actual after retest:** Under AUDIT26, Work Item US-1 exposed TEST Release RE-1 and TEST Team/Task roll-up values while Project remained AUDIT26. Valid Iterations were unavailable; Release Tracking route isolation itself passed.
- **Required DEV action / next check:** Scope Work Item relationship queries and late responses by active Project; prevent cross-Project Release, Iteration, Team, Feature and Task data leakage.
- **Dependency:** Shared Project-context boundary with P5-PI-003; verify late responses as well as selectors.
- **SRS / Mockup reference:** Phase 6/PHASE6_REPORTS_BUSINESS_AND_DATA_CONTRACT.md
- **Evidence:** https://rally-dev.qnsc.vn/item/US-1; https://rally-dev.qnsc.vn/release-tracking
- **BA state:** BA confirmed Fail 2026-08-14

## 4. Partial — DEV/BA scope attention

These rows expose a visible difference that needs implementation alignment or an explicit BA scope decision.

### GAP-P1-WID-001 — US/DE detail tabs and content scope

- **Phase / Priority / Module:** Phase 1 / P1 / Work Item Detail
- **Expected:** US/DE Detail follows the approved mockup/SRS tab structure: Details, Tasks and Revision History.
- **Actual after retest:** Details, Tasks and Revision History exist, but an extra Connections tab plus Linked Items/Comments remains.
- **Required DEV action / next check:** Details, Tasks and Revision History exist, but an extra Connections tab plus Linked Items/Comments remains.
- **Dependency:** Independent unless noted in the failure-chain section.
- **SRS / Mockup reference:** P1-WID-01
- **Evidence:** https://rally-dev.qnsc.vn/item/US-1
- **BA state:** Pending BA review

### GAP-P1-HIST-002 — Task-level activity not logged

- **Phase / Priority / Module:** Phase 1 / P1 / Task Detail / Revision History
- **Expected:** Task Revision History logs task.created, task.state_changed and task time updates for the Task (ACT-FR-002/005).
- **Actual after retest:** Task history now records Task Created, state and To Do, but Task State events are labelled Schedule State.
- **Required DEV action / next check:** Task history now records Task Created, state and To Do, but Task State events are labelled Schedule State.
- **Dependency:** Independent unless noted in the failure-chain section.
- **SRS / Mockup reference:** P1-HIST-01
- **Evidence:** https://rally-dev.qnsc.vn/item/US-1
- **BA state:** Pending BA review

### GAP-P4-SET-004 — Team/User guardrails

- **Phase / Priority / Module:** Phase 4 / P1 / Destructive confirmations
- **Expected:** Deactivate/restore Team and deactivate/remove User access require a target-specific confirmation; Remove User Access requires typed target confirmation.
- **Actual after retest:** Team deactivation and Project-access removal have clear confirmation; company-user removal is unavailable.
- **Required DEV action / next check:** Team deactivation and Project-access removal have clear confirmation; company-user removal is unavailable.
- **Dependency:** Independent unless noted in the failure-chain section.
- **SRS / Mockup reference:** P4-SET-05
- **Evidence:** https://rally-dev.qnsc.vn/settings
- **BA state:** Pending BA review

## 5. Partial — retest prerequisite, not an automatic code defect

DEV/QA should prepare the missing account/data/evidence or deploy the upstream fix, then rerun only the remaining branch. Do not close these rows only from code review.

### GAP-P1-USER-006 — Invite User flow

- **Phase / Priority / Module:** Phase 1 / P1 / User Management
- **Expected:** Workspace Admin can invite a User. Invite UI is allowed to follow Dev design as long as it supports business validation: email, role selection, and later invitation delivery/status behavior. Actual sending/delivery is deferred for later test.
- **Actual after retest:** Invite dialog exists but captures email only; no optional Project Access or review step. Delivery was not triggered.
- **Required DEV action / next check:** Invite dialog exists but captures email only; no optional Project Access or review step. Delivery was not triggered.
- **Dependency:** Independent unless noted in the failure-chain section.
- **SRS / Mockup reference:** P1-USER-01
- **Evidence:** https://rally-dev.qnsc.vn/settings
- **BA state:** Pending BA review

### GAP-P3-TS-006 — Estimate/ToDo/Actuals default display

- **Phase / Priority / Module:** Phase 3 / P3 / Team Status
- **Expected:** SRS 8.3: Estimate, ToDo and Actuals default to 0 when not set.
- **Actual after retest:** Totals render, but no empty Task row exists to prove all numeric defaults.
- **Required DEV action / next check:** Totals render, but no empty Task row exists to prove all numeric defaults.
- **Dependency:** Retest after GAP-P3-TS-005 renders the counted Task row.
- **SRS / Mockup reference:** P3-TS-01
- **Evidence:** https://rally-dev.qnsc.vn/team-status
- **BA state:** Pending BA review

### GAP-P4-SET-002 — List columns, role values and detail fields

- **Phase / Priority / Module:** Phase 4 / P0 / User Management
- **Expected:** User list contains Name, Email, Role, Status and Last Login; it excludes Phone and Teams. Phone is in Detail/Profile; Team membership is in User Detail/Team Members. Approved roles and guarded Remove User Access remain required.
- **Actual after retest:** User list scope is accepted. User Detail, Project Access and role-specific actions remain pending the Admin/Editor/unassigned account set.
- **Required DEV action / next check:** Retest with the approved RBAC account set before closure.
- **Dependency:** Independent unless noted in the failure-chain section.
- **SRS / Mockup reference:** P4-SET-02
- **Evidence:** https://rally-dev.qnsc.vn/settings
- **BA state:** BA confirmed Partial 2026-08-14

### P5-PI-013 — Children tab work-item behavior

- **Phase / Priority / Module:** Phase 5 / P1 / P5-PI - Portfolio Items
- **Expected:** Children table behaves like the Backlog pattern; Task rows are read-only
- **Actual after retest:** Children uses the Backlog-like grid and expands Work Items, but available child US-5 has no Task rows to verify read-only behavior.
- **Required DEV action / next check:** Children uses the Backlog-like grid and expands Work Items, but available child US-5 has no Task rows to verify read-only behavior.
- **Dependency:** Independent unless noted in the failure-chain section.
- **SRS / Mockup reference:** Phase 5/01_Portfolio_Items/SRS.md
- **Evidence:** https://rally-dev.qnsc.vn/portfolio
- **BA state:** Pending BA review

### P5-PI-015 — Build and current access smoke evidence

- **Phase / Priority / Module:** Phase 5 / P1 / P5-PI - Portfolio Items
- **Expected:** Build passes; no serious console error; each current access boundary matches the 2026-08-14 baseline.
- **Actual after retest:** DevInt Portfolio route loads and Workspace Admin access works; alternate access boundaries and deployment build evidence are unavailable.
- **Required DEV action / next check:** DevInt Portfolio route loads and Workspace Admin access works; alternate access boundaries and deployment build evidence are unavailable.
- **Dependency:** Independent unless noted in the failure-chain section.
- **SRS / Mockup reference:** Phase 5/01_Portfolio_Items/SRS.md
- **Evidence:** https://rally-dev.qnsc.vn/portfolio
- **BA state:** Pending BA review

### P5-CP-015 — Features allocation and cutline

- **Phase / Priority / Module:** Phase 5 / P0 / P5-CP - Capacity Planning
- **Expected:** Rank view shows a cutline at the first cumulative top-down estimate reaching plan Capacity; blank Estimate uses the refined Feature estimate as a fixed source-labeled allocation; manual Estimate stays fixed; split Team subrows appear; cutline hides for non-Rank sort
- **Actual after retest:** Cutline, Estimated warning and non-Rank hiding pass. Split-Team branch still requires a second Team.
- **Required DEV action / next check:** Retest only the split-Team branch after P5-CP-006 is fixed.
- **Dependency:** Retest split-Team branch after P5-CP-006.
- **SRS / Mockup reference:** Phase 5/02_Capacity_Planning/SRS.md
- **Evidence:** https://rally-dev.qnsc.vn/capacity-planning/41d10dd3-6392-47c0-8972-bc4e521d319e
- **BA state:** BA confirmed Partial 2026-08-14

### P5-CP-012 — Build and smoke evidence

- **Phase / Priority / Module:** Phase 5 / P1 / P5-CP - Capacity Planning
- **Expected:** Build passes; no console errors; evidence records BA/mockup limitations separately from production readiness
- **Actual after retest:** Capacity Planning route and CP-1 load without a visible fatal UI error; deployment build/console evidence is outside this UI-only retest.
- **Required DEV action / next check:** Capacity Planning route and CP-1 load without a visible fatal UI error; deployment build/console evidence is outside this UI-only retest.
- **Dependency:** Independent unless noted in the failure-chain section.
- **SRS / Mockup reference:** Phase 5/02_Capacity_Planning/SRS.md
- **Evidence:** https://rally-dev.qnsc.vn/capacity-planning/41d10dd3-6392-47c0-8972-bc4e521d319e
- **BA state:** Pending BA review

### P5-CP-033 — Capacity Plan ranking, warnings and summary breakdown polish

- **Phase / Priority / Module:** Phase 5 / P0 / P5-CP - Capacity Planning
- **Expected:** Feature Rank displays dense list order 1..N; Feature settings menu includes Move up, Move down, Allocate, Remove from Plan; Publish actions button sits beside Back as a white square with blue vertical dots. Rollup warning appears when Rollup exceeds Estimated; Estimated warning appears when Preliminary, Refined and Allocated estimates are all missing; Team Capacity rail shows the same Team-level warning rules. Breakdown opens a plan-total panel with Complete/Rollup/Estimated/Capacity and the composite bar.
- **Actual after retest:** Drag/drop Rank, Allocate to Teams, Remove from Plan, Plan Actions placement and Breakdown are accepted. Warning branches remain pending P5-CP-029 and P5-CP-006 fixes.
- **Required DEV action / next check:** Retest only the remaining warning branches after upstream fixes.
- **Dependency:** Retest warning branches after P5-CP-006 and P5-CP-029.
- **SRS / Mockup reference:** Phase 5/02_Capacity_Planning/SRS.md
- **Evidence:** https://rally-dev.qnsc.vn/capacity-planning/41d10dd3-6392-47c0-8972-bc4e521d319e
- **BA state:** BA confirmed Partial 2026-08-14

### P6-COM-004 — Current Phase 6 access enforcement

- **Phase / Priority / Module:** Phase 6 / P0 / A. Navigation, scope and common behavior
- **Expected:** Workspace Admin and assigned-Project Admin can use Phase 6 surfaces; Editor and unassigned users cannot open them; no data leaks through direct URLs.
- **Actual after retest:** Workspace Admin can open Release Tracking and all three Reports. No Admin, Editor or unassigned login is available for authorization boundaries.
- **Required DEV action / next check:** Workspace Admin can open Release Tracking and all three Reports. No Admin, Editor or unassigned login is available for authorization boundaries.
- **Dependency:** Independent unless noted in the failure-chain section.
- **SRS / Mockup reference:** Phase 6/PHASE6_REPORTS_BUSINESS_AND_DATA_CONTRACT.md
- **Evidence:** https://rally-dev.qnsc.vn/reports
- **BA state:** Pending BA review

### P6-VEL-009 — Select Team and All Teams

- **Phase / Priority / Module:** Phase 6 / P0 / D. Reports > Velocity
- **Expected:** Team scope filters; All Teams aligns by stable timebox key and de-duplicates Work Items
- **Actual after retest:** Pegasus and All Teams return the same single-Team 0/0/8 result; multi-Team alignment and duplicate-ID prevention cannot be proved.
- **Required DEV action / next check:** Pegasus and All Teams return the same single-Team 0/0/8 result; multi-Team alignment and duplicate-ID prevention cannot be proved.
- **Dependency:** Independent unless noted in the failure-chain section.
- **SRS / Mockup reference:** Phase 6/03_Velocity_Chart/SRS.md
- **Evidence:** https://rally-dev.qnsc.vn/reports
- **BA state:** Pending BA review

## 6. DEV completion gate

1. Reference the exact Scenario ID in the commit or pull request.
2. Fix root cases before downstream cases in the chains above.
3. Deploy to DevInt.
4. BA retests the same workbook row using the recorded Expected Result and Evidence field.
5. Change to Pass only when the full behavior persists after reload; use sign-out/sign-in or Project switching when the scenario requires it.
6. Do not modify Blocked, Future Backlog, Not Required or Not Run rows unless BA explicitly reopens them.
