# Mini Rally — Reconciliation DEV Handoff

**Effective date:** 2026-08-14
**Status:** Active cross-phase Phase 0–6 business and DevInt handoff. Phase-specific SRS remains the implementation detail authority.
**Scope:** Phase 0–6 frontend behavior, business rules, DevInt verification and UAT. Database, schema and infrastructure remain outside this handoff.

## 1. Documents DEV must use

1. `../RECONCILED_SOURCE_OF_TRUTH.md` — cross-phase business baseline.
2. `../Mini_Rally_Product_Plan.xlsx` — product roadmap, BA tasks, DEV tasks and dependencies.
3. `../Phase 5/PHASE5_DEV_HANDOFF.md` — closed Phase 5 implementation authority.
4. Relevant `../Phase */.../SRS.md` and phase mockup checklist.
5. `../../07_Testing Plan/03_Retest/DEV_HANDOFF_RETEST_PHASE_0_6.md` — current consolidated DevInt Fail/Partial gaps and DEV actions.
6. `../../07_Testing Plan/01_test_phase_1_to_4/specs/` and `../../07_Testing Plan/02_test_phase_5_6/` — Phase 0–6 business acceptance and retest evidence.

If wording conflicts, use the source-of-truth document and raise the mismatch to BA before implementing a new interpretation.

## 2. Confirmed implementation changes

### Navigation and project context

- Product supports multiple Projects; data and page context must follow the selected Project.
- Project management exists only at `Settings gear > Workspaces & Projects`; remove the standalone `Manage Projects` navigation/page entry.
- Teams and User Management also live under the Settings gear.
- `Track > Iteration Status` is list-only. Team Board and Iteration Board are Future Backlog.
- Phase 3 Release management remains under `Plan > Timeboxes`.
- Portfolio contains Portfolio Items, Capacity Planning and Phase 6 Release Tracking. Release Planning remains Future Backlog. Phase 6 Reports are active under Reports.
- Phase 3 Release management remains the only Release create/edit registry; no Portfolio screen duplicates it.

### Work item and task lifecycle

- Backlog and Iteration screens reference the same Story/Defect record; edits must reflect across screens.
- Story/Defect Schedule State and Flow State both use `Idea`, `Defined`, `In-Progress`, `Completed`, `Accepted`, `Release`.
- A newly created Story/Defect defaults both fields to `Idea`; changing either field mirrors the other.
- Defect keeps a separate Defect State in addition to Schedule/Flow State.
- Task State uses `Defined`, `In-Progress`, `Completed` and Task is always a child of Story/Defect.
- Task `Estimate`, `To Do` and `Actual` are independent hour fields. On Task creation only, copy entered Estimate once to a blank To Do. After creation, editing one field or changing Task State never changes the others.
- Work Item and Task Owner default to `Unassigned`. A selected Team allows `Unassigned` plus its active members; No Team allows only `Unassigned`.
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
- Release Artifacts show directly assigned Story/Defect/Feature from existing Backlog/Work Item Detail/Portfolio assignment. Milestone Artifacts show direct Story/Defect/Feature/Epic and de-duplicated descendants inherited through Feature/Epic for the existing rollups. Artifact-origin `Add New Item` and its shared Work Item/Portfolio Item `Create with details` journey are Future Backlog by BA decision 2026-08-15.
- Timeboxes > Release Detail contains no Task Roll-up, accepted-progress or burndown widgets; all Release progress belongs to `Portfolio > Release Tracking`.
- Capacity Planning maps Rally child Project/Scrum Team rows to Mini Rally Teams under the selected Project, but Project scope only stores the plan; Teams are added through Project Breakdown.
- A Capacity Plan is unique per `Project + Release`, starts as Draft, and can be Published. Draft allocation rows are plan-specific, may split one Feature across multiple Teams, and use fixed manual `allocation.value` entered in the Capacity Plan; Feature has no Plan Estimate and allocation must not derive from Preliminary Estimate mapping. `Publish Without Updating Fields` changes visibility only; `Publish` also writes Release and planned dates to allocated Features, never overwrites Feature Project/Team, and must not cascade Release or Team to child Story/Defect.
- Feature Detail progress uses two denominator families: `Percent Done by...` and left-side `Total Accepted Children` Points/Count meter use live current child Story/Defect totals; `Estimated Progress by...` uses Feature top-down refined fields (`refinedEstimate`, `refinedWorkItemCountEstimate`) or Preliminary Estimate fallback. These refined fields are Feature progress inputs only, not Capacity allocation inputs.
- Capacity `Planned Team Assignment`, `Teams by Total` and the Team Capacity rail use the same Plan allocation ledger. The inline selector supports zero/one-Team assign, change and Unassign; multi-Team split uses Allocate. Portfolio Feature owning Team remains separate.
- Team Status shows only active members of its selected Team plus `Unassigned` for null-owner scoped Tasks; Team Capacity also attributes null-owner hours only to `Unassigned`.
- Project Key is required, unique, immutable, normalized to uppercase alphanumeric, and limited to 1–10 characters.
- Audit Log exact event coverage and business-sentence formatting are Not Required for current acceptance.

## 3. Required DEV execution order

1. Close Phase 0–1 DevInt context, navigation, shared work-item and Task roll-up gaps.
2. Close Phase 2 Iteration lifecycle, scope and metrics gaps.
3. Close Phase 3 Team Status, Release/Milestone and Quality gaps.
4. Implement and DevInt Phase 4 governance after Phase 0–3 critical paths are stable.
5. Close Phase 5 Portfolio Items and Capacity Planning gaps from their SRS and dedicated handoff.
6. Close Phase 6 Release Tracking and Reports gaps from the Phase 6 SRS/data contract.
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
- Theme/deeper hierarchy and Portfolio Overview.
- Release Tracking production historical accuracy until trustworthy snapshots or auditable history exist; the Phase 6 UI/business feature itself is active.
- Release Planning, Multi-Release/Plan of Plans, multiple what-if plans for the same Project+Release, automatic rebalance and velocity-driven automatic capacity.
- Database/schema/infra design or persistence implementation decisions.

Promote a deferred item only after BA/PO adds it to the active workbook and confirms its SRS/mockup.
