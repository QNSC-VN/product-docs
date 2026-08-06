# Mini Rally — Reconciliation DEV Handoff

**Effective date:** 2026-07-28
**Status:** Active Phase 0–4 handoff. Phase 5 is now BA/mockup closed and has its own implementation handoff at `../Phase 5/PHASE5_DEV_HANDOFF.md`.
**Scope:** Phase 0–4 frontend behavior, business rules, DevInt verification and UAT. Use the dedicated Phase 5 handoff, not this document, to implement Phase 5. Database, schema and infrastructure remain outside this Phase 0–4 handoff.

## 1. Documents DEV must use

1. `../RECONCILED_SOURCE_OF_TRUTH.md` — cross-phase business baseline.
2. `../Mini_Rally_Product_Plan.xlsx` — product roadmap, BA tasks, DEV tasks and dependencies.
3. `../Phase 5/PHASE5_DEV_HANDOFF.md` — closed Phase 5 implementation authority.
4. Relevant `../Phase */.../SRS.md` and phase mockup checklist.
5. `../../06_Dev testing align/DEVINT_PHASE_0_4_AUDIT_TRACKER.xlsx` — DevInt gap execution.
6. `../../07_Testing Plan/01_test_phase_1_to_4/specs/` and `../../07_Testing Plan/01_test_phase_1_to_4/BUSINESS_E2E_TEST_TRACKER.xlsx` — Phase 0-4 business acceptance.

If wording conflicts, use the source-of-truth document and raise the mismatch to BA before implementing a new interpretation.

## 2. Confirmed implementation changes

### Navigation and project context

- Product supports multiple Projects; data and page context must follow the selected Project.
- `Settings gear > Workspace > Project Management` contains Projects only.
- Teams and User Management also live under the Settings gear.
- `Track > Iteration Status` is list-only. Team Board and Iteration Board are Future Backlog.
- Phase 3 Release management remains under `Plan > Timeboxes`.
- Closed Phase 5 is Portfolio-only: Portfolio Items and Capacity Planning. Release Planning and Release Tracking are excluded. Reports are a future observation direction only and are not authorized by the Phase 5 handoff.
- Phase 3 Release management remains the only Release create/edit registry; no Portfolio screen duplicates it.

### Work item and task lifecycle

- Backlog and Iteration screens reference the same Story/Defect record; edits must reflect across screens.
- Story/Defect Schedule State and Flow State both use `Idea`, `Defined`, `In-Progress`, `Completed`, `Accepted`, `Release`.
- A newly created Story/Defect defaults both fields to `Idea`; changing either field mirrors the other.
- Defect keeps a separate Defect State in addition to Schedule/Flow State.
- Task State uses `Defined`, `In-Progress`, `Completed` and Task is always a child of Story/Defect.
- Task `Estimate`, `To Do` and `Actual` are independent hour fields. If the Owner enters Estimate first, copy the same value to To Do once. After that first copy, editing one field must not auto-recalculate the others. Marking a Task `Completed` sets To Do to 0; reopening does not auto-restore To Do.
- All child Tasks Completed auto-set the parent to Completed. Reopening any Task auto-sets the parent to In-Progress.
- Automatic status changes are convenience behavior; an authorized user can still change the parent status manually.
- Task Dashboard supports inline edit. Task count and iteration Task Active use all persisted child Tasks in scope.

### Iteration lifecycle

- New Iteration defaults to `Planning`.
- Assigning backlog does not auto-change the Iteration to `Committed`.
- Plan > Backlog shows only Story/Defect rows with Iteration = `Unscheduled`. Assigning a Story/Defect to an Iteration removes it from Backlog and makes it visible in that Iteration's status/execution views; moving it back to `Unscheduled` returns it to Backlog.
- User manually commits scope; `Committed` does not lock scope or board behavior.
- Users may add, remove or move US/DE while the sprint is running.
- When a non-empty Iteration has all assigned US/DE in `Accepted`, the system may auto-set Iteration to `Accepted`.
- Iteration status remains manually editable and the system does not auto-reverse it.
- Iteration Status Totals show Plan Estimate, Task Estimate and To Do.

### Release, Milestone and work-item linkage

- Release and Milestone are independent; either may be created first and they link many-to-many.
- A Milestone may span multiple Projects and Teams.
- Without linked Releases, Milestone Target Start/End are manually editable.
- With linked Releases, Target Start is the earliest linked Release start and Target End is the latest linked Release end; derived values are read-only.
- Removing all Release links returns the Milestone to manual-date mode.
- A Story/Defect has zero or one Release and zero or many Milestones.
- A Story/Defect has zero or one Portfolio Feature. Creating a Story/Defect from a Feature uses the same Work Item creation template as Backlog and pre-fills the Feature field.
- Selecting a Release filters new Milestone options to related Milestones; changing Release does not silently delete existing Milestone selections.
- Capacity Planning maps Rally child Project/Scrum Team rows to Mini Rally Teams under the selected Project, but Project scope only stores the plan; Teams are added through Project Breakdown.
- A Capacity Plan is unique per `Project + Release`, starts as Draft, and can be Published. Draft allocation rows are plan-specific, may split one Feature across multiple Teams, and use fixed manual `allocation.value` entered in the Capacity Plan; Feature has no Plan Estimate and allocation must not derive from Preliminary Estimate mapping. `Publish Without Updating Fields` changes visibility only; `Publish` also writes Release and planned dates to allocated Features, never overwrites Feature Project/Team, and must not cascade Release or Team to child Story/Defect.
- Feature Detail progress uses two denominator families: `Percent Done by...` and left-side `Total Accepted Children` Points/Count meter use live current child Story/Defect totals; `Estimated Progress by...` uses Feature top-down refined fields (`refinedEstimate`, `refinedWorkItemCountEstimate`) or Preliminary Estimate fallback. These refined fields are Feature progress inputs only, not Capacity allocation inputs.

## 3. Required DEV execution order

1. Close Phase 0–1 DevInt context, navigation, shared work-item and Task roll-up gaps.
2. Close Phase 2 Iteration lifecycle, scope and metrics gaps.
3. Close Phase 3 Team Status, Release/Milestone and Quality gaps.
4. Implement and DevInt Phase 4 governance after Phase 0–3 critical paths are stable.
5. Phase 5 BA/mockup work is closed: P5.1 Portfolio Items and P5.2 Capacity Planning were accepted; Release Tracking was removed from scope; P5.4 published the dedicated handoff.
6. Start Phase 5 production analysis/implementation only from `../Phase 5/PHASE5_DEV_HANDOFF.md`.
7. Preserve the confirmed delivery gate for any future feature or rule change: propose -> BA confirm -> align docs -> implement -> verify -> BA accept -> close.

The task-level order, owners, proposed dates and acceptance criteria are maintained in `../Mini_Rally_Product_Plan.xlsx`.

## 4. Acceptance gates

- Same entity ID and values appear consistently in Backlog, Work Item Detail, Iteration Status, Team Status, Quality and Timeboxes.
- Create creates one record; Cancel creates none; reload/persistence behavior is verified in DevInt where applicable.
- Automatic status changes and manual overrides both pass the confirmed rules.
- Release/Milestone cardinality, filtering and derived dates pass positive and negative cases.
- Every confirmed gap has owner, fix note, retest evidence and BA disposition in the DevInt tracker.
- Relevant Phase test scenarios and the E2E Agile lifecycle suite pass before phase sign-off.
- Phase 5 mockup presence is not production evidence; BA/Mockup readiness and Production implementation readiness must remain separate.

## 5. Deferred — do not implement implicitly

- Team Board, Iteration Board, drag/drop and WIP rules.
- Release Tracking, Reports, Theme/deeper hierarchy and Portfolio Overview.
- Release burnup/trend until trustworthy historical snapshots exist.
- Release Planning, Multi-Release/Plan of Plans, multiple what-if plans for the same Project+Release, automatic rebalance and velocity-driven automatic capacity.
- Database/schema/infra design or persistence implementation decisions.

Promote a deferred item only after BA/PO adds it to the active workbook and confirms its SRS/mockup.
