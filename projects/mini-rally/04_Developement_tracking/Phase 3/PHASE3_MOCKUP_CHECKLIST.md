# Phase 3 - Mockup Coverage Checklist

Synced date: 2026-07-12

## 1. Phase Scope

Phase 3 is split into smaller slices so each mockup and SRS can be approved before development:

1. P3.1 Team Status.
2. P3.2 Release Management.
3. P3.3 Milestones.
4. P3.4 Quality / Defect dashboard, create/edit, shared detail and core workflow.

BA decisions already confirmed:

- `Team Status` is a dashboard/table grouped by member, not a board.
- `Team Board` moves to Backlog for the future.
- Team Board menu can remain visible in the mockup for now, but it is not a Phase 3.1 deliverable and not part of the current MVP scope.
- Board drag/drop, WIP enforcement and board transition rules are not Phase 3.1.
- Release Management is Project-level and will be handled after Team Status.
- Milestones are a type beside Iterations/Releases/Milestones under Timeboxes.
- Quality/Defect is Phase 3 scope as a dedicated `Quality > Defect` dashboard entry with create/edit and shared Defect detail.
- Timeline file is updated after Phase 3 mockup/docs alignment and Future Backlog scope closure.

## 2. P3.1 Team Status Approved Scope

Team Status approved behavior:

- Open from `Track > Team status`.
- Use the same Iteration selector pattern as Iteration Status.
- Remove Team Status local search input.
- Remove Team Status KPI strip.
- Use a dense table template aligned with Iteration Status: same header style, row height and font size.
- Columns are `Rank`, `ID`, `Task Name`, `Work Product`, `Release`, `State`, `Capacity`, `Estimate`, `ToDo`, `Actuals`, `Owner`.
- Columns are resizable.
- Rows are grouped by member/owner.
- Member group row shows owner, task count, progress, editable capacity, estimate, todo and actuals.
- Expand/collapse control is arrow-only without visible border.
- ID column shows Task IDs such as `TA-404821`.
- Work Product column shows the parent US/DE item.
- Task Name is inline editable.
- Task State is a dropdown.
- Task State options are exactly `Defined`, `In-Progress`, `Completed`.
- Work Item Detail `Tasks` tab is the Task Dashboard and supports inline edit for Task Name, State, Owner, To Do, Actuals and Estimate.
- Completing a task refreshes the referenced US/DE Work Product roll-up. If any child task under the same parent is still not `Completed`, the parent status stays unchanged; when all child tasks are `Completed`, the parent US/DE status becomes `Completed`. Auto-completion does not remove manual parent status editing from existing Work Item edit surfaces.
- Viewer/read-only roles cannot mutate inline fields.

## 3. Mockup Coverage Summary

| Area | Requirement | Mockup status | Mockup source | Notes |
|---|---|---:|---|---|
| Track nav | `Track > Team status` opens dedicated page | Done | `App.tsx`, `TeamStatusPage.tsx` | Team Board can remain visible but is future backlog |
| Iteration selector | Same picker style as Iteration Status | Done | `TeamStatusPage.tsx` | Prev/next + combined name/date dropdown |
| Search input | Removed | Done | `TeamStatusPage.tsx` | No local Team Status search in P3.1 |
| KPI strip | Removed | Done | `TeamStatusPage.tsx` | Table totals row is used instead |
| Table template | Match Iteration Status header/column/font style | Done | `TeamStatusPage.tsx` | Dense table, h-8 rows, 11px content |
| Columns | Rank, ID, Task Name, Work Product, Release, State, Capacity, Estimate, ToDo, Actuals, Owner | Done | `TeamStatusPage.tsx` | Matches approved reference |
| Column resize | Header resize handles | Done | `TeamStatusPage.tsx` | Local mock behavior |
| Totals row | Capacity, Estimate, ToDo, Actuals totals | Done | `TeamStatusPage.tsx` | Under header |
| Member grouping | Group by owner/member | Done | `TeamStatusPage.tsx` | Owner avatar/name/task count |
| Capacity | Inline edit on member group row | Done | `TeamStatusPage.tsx` | Numeric hours |
| Collapse icon | Arrow only, no bordered button | Done | `TeamStatusPage.tsx` | Approved refinement |
| Task ID | Show task ID, not US/DE | Done | `TeamStatusPage.tsx` | `TA-...` format in mockup |
| Work Product | Show parent US/DE | Done | `TeamStatusPage.tsx` | Parent title truncated |
| Task Name | Inline editable | Done | `TeamStatusPage.tsx` | Stops row navigation |
| State dropdown | Defined/In-Progress/Completed only | Done | `TeamStatusPage.tsx` | Accepted/Release removed |
| State propagation | Task Completed refreshes parent US/DE roll-up | Documented | `01_Team_Status/SRS.md` | Parent auto-completes when all child tasks are Completed |
| Row click | Opens existing detail flow | Done in mockup | `TeamStatusPage.tsx`, `App.tsx` | Inline controls stop propagation |
| Viewer read-only | No inline mutation for Viewer | Business rule | `01_Team_Status/SRS.md` | API must enforce |

## 4. P3.1 Acceptance Checklist

### Mockup Approved

- [x] `Track > Team status` opens the dedicated Team Status page.
- [x] Iteration picker matches the Iteration Status picker style.
- [x] Local Team Status search input is removed.
- [x] KPI strip is removed.
- [x] Dashboard/table template matches Iteration Status dense table.
- [x] Required columns are present.
- [x] Columns can be resized.
- [x] Table groups rows by owner/member.
- [x] Member capacity is inline editable.
- [x] Task ID displays `TA-...`, not `US`/`DE`.
- [x] Work Product column displays `US`/`DE`.
- [x] Task Name is inline editable.
- [x] Task State dropdown is inline editable.
- [x] Task State dropdown contains only `Defined`, `In-Progress`, `Completed`.
- [x] Task Dashboard inline edit is available from Work Item Detail `Tasks` tab.
- [x] Collapse/expand button is arrow-only.

### Development Must Verify

- [ ] API query filters by selected Project/Team/Iteration.
- [ ] Iteration selector options are sourced from Timeboxes/Iterations.
- [ ] Team Status response groups task rows by owner/member.
- [ ] Capacity persists by Project/Team/Iteration/User.
- [ ] Capacity rejects invalid negative values.
- [ ] Task Name patch persists task title only.
- [ ] State patch accepts only `Defined`, `In-Progress`, `Completed`.
- [ ] Source states outside the Team Status enum are normalized for display.
- [ ] Task `Completed` refreshes referenced US/DE Work Product roll-up.
- [ ] Parent US/DE remains unchanged while any child task is still not `Completed`.
- [ ] Parent US/DE auto-completes when all child tasks are `Completed`.
- [ ] Parent US/DE remains manually editable from existing Work Item edit surfaces after auto-completion.
- [ ] Task Dashboard inline edit persists Task Name, State, Owner, To Do, Actuals and Estimate without opening Task Detail.
- [ ] Clicking Task ID in Task Dashboard opens Task Detail.
- [ ] Viewer cannot edit via UI.
- [ ] Viewer cannot mutate via direct API call.
- [ ] Row click opens detail; inline controls do not trigger row navigation.
- [ ] Totals row recalculates after capacity/task updates.
- [ ] Table does not crash for empty Iteration result.

## 5. P3.1 BA Decisions

| ID | Decision | Status |
|---|---|---|
| P3-TS-DC-001 | Team Status is Phase 3.1 | Decided |
| P3-TS-DC-002 | Team Status is dashboard/table, not Team Board | Decided |
| P3-TS-DC-003 | Team Board moves to Backlog for the future | Decided |
| P3-TS-DC-004 | Team Board can remain visible in mockup for now | Decided |
| P3-TS-DC-005 | Iteration selector reuses Iteration Status picker style | Decided |
| P3-TS-DC-006 | Remove Team Status local search input | Decided |
| P3-TS-DC-007 | Remove KPI strip from Team Status | Decided |
| P3-TS-DC-008 | Team Status table uses Iteration Status dense table template | Decided |
| P3-TS-DC-009 | Member Capacity is inline editable | Decided |
| P3-TS-DC-010 | Task Name is inline editable | Decided |
| P3-TS-DC-011 | Task State is inline editable dropdown | Decided |
| P3-TS-DC-012 | Team Status task states are only Defined, In-Progress and Completed | Decided |
| P3-TS-DC-013 | Task ID is shown in ID column; US/DE belongs to Work Product column | Decided |
| P3-TS-DC-014 | Completing a task refreshes the referenced US/DE roll-up; parent US/DE auto-completes when all child tasks are Completed; manual parent status editing remains available from Work Item edit surfaces | Decided |

## 6. Phase 3 Mockup Handoff Status

| Slice | Status | Next action |
|---|---|---|
| P3.1 Team Status | Approved for SRS/dev handoff | Keep only bugfix corrections if BA finds an issue |
| P3.2 Release Management | Timeboxes dashboard approved; readiness and assignment rules confirmed | Handoff release scope |
| P3.3 Milestones | Mockup/docs ready including artifact-as-work-item behavior | Handoff milestone scope |
| P3.4 Quality/Defect | Mockup/docs ready | Handoff Quality/Defect scope |

## 6A. P3.2 Release Management Approved Mockup Scope

- Release is managed under `Plan > Timeboxes > Releases`.
- Release is Project-level.
- Release status options are exactly `Planning`, `Active`, `Accepted`.
- Timebox dashboard supports inline edit across the Release row fields.
- Timebox dashboard columns can be resized/expanded.
- `Create Release` opens a modal with Type locked to `Release`.
- User cannot change Type inside the create modal.
- Create Release state dropdown uses `Planning`, `Active`, `Accepted`.
- Release detail direction includes Theme and Notes rich text areas on the left.
- Release detail right panel direction includes Start Date, Release Date, Project, State, Planned Velocity, Plan Estimate, Task Roll-up, Accepted and Version.
- Version is optional.
- Plan Estimate is manual input.
- Accepted releases remain editable for authorized users.
- Release readiness information is manually gathered by users from linked US/DE release notes.
- Reassigning a Story/Defect from one Release to another removes it from the old Release artifact view, recalculates old/new Release counts and shows user feedback.

### P3.2 Development Must Verify

- [ ] Release list query filters by selected Project context.
- [ ] Inline edit persists Name, Theme, Start Date, Release Date, Project, Planned Velocity, Task Estimate and State.
- [ ] Release State accepts only `Planning`, `Active`, `Accepted`.
- [ ] Legacy release state values are normalized or rejected.
- [ ] Create Release modal locks Type to Release.
- [ ] Viewer cannot edit via UI.
- [ ] Viewer cannot mutate via direct API call.
- [ ] Release detail shows Theme, Notes and required right-panel fields.
- [ ] Release readiness rule does not require system-calculated readiness in P3.2.
- [ ] Reassigning a Story/Defect to another Release removes it from the previous Release artifact list and refreshes both Release counters.

## 6B. P3.3 Milestones Ready Mockup Scope

- Milestone is managed under `Plan > Timeboxes > Milestones`.
- Milestone can span multiple Projects.
- Milestone can span multiple Teams.
- Milestone status options are exactly `Planned`, `At Risk`, `Met`, `Missed`, `Cancelled`, `Completed`.
- Milestone detail has a Details tab and an Artifacts tab beside it in the top detail navigation.
- Details tab uses Description and Notes on the left.
- Artifacts tab hides the right metadata panel.
- Milestone detail right panel includes compact selected-count controls for Projects, Teams and Releases, plus Owner, Target Start Date, Target End Date and State.
- Project, Team and Release count controls open searchable selection modals showing currently selected items.
- Milestone can link to multiple Releases.
- Milestone Artifacts are assigned US/DE Story/Defect work items and use the Backlog dashboard presentation.
- Milestone artifact assignment is independent from Release assignment; adding/removing a Milestone artifact must not change Release assignment.
- Story/Defect artifact assignment must be rejected if the item is outside the Milestone's selected Project/Team scope.
- Milestone does not include a readiness checklist in P3.3.
- Milestone dashboard shows only Name, Target Start Date, Target End Date and Status.
- Target Start Date is read-only and derived from the earliest linked Release Start Date.
- Target End Date is read-only and derived from the latest linked Release end/release date.
- Timebox dashboard columns can be resized/expanded.

### P3.3 Development Must Verify

- [ ] Milestone can persist multiple Project IDs.
- [ ] Milestone can persist multiple Team IDs/names.
- [ ] Milestone can persist multiple linked Release IDs.
- [ ] Milestone detail can open searchable Project, Team and Release selection modals from count summaries.
- [x] Milestone Artifacts tab hides the right metadata panel.
- [x] Milestone Artifacts are defined as assigned Story/Defect work items.
- [ ] Target Start Date recalculates when linked Releases change.
- [ ] Target End Date recalculates when linked Releases change.
- [ ] Target dates cannot be manually edited.
- [ ] Milestone dashboard response includes only Name, Target Start Date, Target End Date and Status columns.
- [ ] Milestone State accepts only `Planned`, `At Risk`, `Met`, `Missed`, `Cancelled`, `Completed`.
- [ ] Owner is editable for authorized users.
- [ ] Viewer cannot edit via UI.
- [ ] Viewer cannot mutate via direct API call.

### P3.3 Development Must Verify - Artifacts

- [ ] Milestone Artifacts query returns assigned Story/Defect work items.
- [ ] Milestone Artifacts dashboard reuses Backlog-style row presentation.
- [ ] Milestone artifact assignment is independent from Release assignment.
- [ ] Removing a Milestone artifact leaves Release assignment unchanged.
- [ ] Assigning an artifact outside selected Project/Team scope is rejected.

## 6C. P3.4 Quality / Defect Ready Scope

- Quality has a dedicated top navigation entry.
- Defect dashboard opens from `Quality > Defect`.
- Current mockup dashboard uses the Backlog dashboard template.
- Defects in Quality and Backlog are the same work items; Quality only provides a defect-focused dashboard view.
- Confirmed Defect dashboard columns: Rank, ID, Name, User Story, Severity, Priority, State, Flow State, Fixed In Build, Iteration, Submitted By and Owner.
- Defect Severity options: None, Critical, Major Problem, Minor Problem, Trivial.
- Defect Priority options: None, Urgent, High, Normal, Low.
- Defect State options: Submitted, Open, Fixed, Closed, Closed Declined.
- Defect Flow State options: Idea, Defined, In-Progress, Completed, Accepted, Released.
- Current mockup supports search, filter placeholder, row selection, disabled/future bulk-action placeholder, sortable/resizable columns, pagination and detail panel.
- Defect can be created from Backlog and `Quality > Defect`.
- User Story is optional for Defect.
- Defect dashboard supports inline edit across editable fields.
- Backlog Defect and Quality Defect use the same detail page.
- Defect cannot be deleted; use Closed or Closed Declined.
- Defect State transitions follow Submitted -> Open -> Fixed -> Closed, with Submitted/Open -> Closed Declined.
- Reopen from Closed/Closed Declined is deferred until BA confirms permission and audit rules.
- Defect Flow State updates independently from State.
- Fixed In Build is an optional manual text field for the build/version/release label where the fix is expected or delivered.

### P3.4 Development Must Verify

- [x] Confirm current P3.4 handoff covers Defect dashboard, create/edit, shared detail and core workflow.
- [x] Confirm defect state and flow state option sets.
- [x] Confirm required dashboard columns.
- [x] Confirm defect creation from Backlog and Quality > Defect.
- [x] Confirm User Story is optional.
- [x] Confirm shared Defect detail page.
- [x] Confirm no delete behavior.
- [x] Confirm Flow State is independent from State.
- [x] Confirm Fixed In Build input rule: optional manual text field.
- [x] Confirm bulk actions are not executable in Phase 3.4; placeholder must be disabled/future until BA confirms actions and permissions.
- [x] Confirm reopen from Closed/Closed Declined is deferred until BA confirms permission and audit rules.

## 7. Deferred Scope

| Item | Target | Note |
|---|---|---|
| Team Board | Future backlog | Optional board view, drag/drop and WIP rules |
| Board drag/drop transitions | Future backlog | Not part of Team Status or current MVP |
| WIP limits | Future backlog | Not part of Team Status or current MVP |
| Saved Team Status views | Future | Not needed for P3.1 |
| Advanced analytics/charts | Reports phase | Not needed for P3.1 |

## 8. Conclusion

P3.1 Team Status mockup is approved and the SRS is ready for development. The remaining Phase 3 slices must be handled one-by-one after mockup approval.
