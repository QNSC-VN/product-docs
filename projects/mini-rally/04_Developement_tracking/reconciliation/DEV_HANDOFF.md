# Mini Rally — Reconciliation DEV Handoff

**Effective date:** 2026-07-20
**Status:** BA and mockup reconciliation applied to the active Phase 0–4 documents.
**Scope:** frontend behavior, business rules, DevInt verification and UAT. Database, schema and infrastructure are outside this handoff.

## 1. Documents DEV must use

1. `../RECONCILED_SOURCE_OF_TRUTH.md` — cross-phase business baseline.
2. `../Mini_Rally_Product_Plan.xlsx` — product roadmap, BA tasks, DEV tasks and dependencies.
3. Relevant `../Phase */.../SRS.md` and phase mockup checklist.
4. `../../06_Dev testing align/DEVINT_PHASE_0_3_AUDIT_TRACKER.xlsx` — DevInt gap execution.
5. `../../07_Test Business/specs/` and `../../07_Test Business/BUSINESS_E2E_TEST_TRACKER.xlsx` — business acceptance.

If wording conflicts, use the source-of-truth document and raise the mismatch to BA before implementing a new interpretation.

## 2. Confirmed implementation changes

### Navigation and project context

- Product supports multiple Projects; data and page context must follow the selected Project.
- `Manage Projects` contains Projects only.
- Teams and User Management move under the Settings gear.
- `Track > Iteration Status` is list-only. Team Board and Iteration Board are Future Backlog.
- Phase 3 Release management remains under `Plan > Timeboxes`.
- `Portfolio > Release Planning` is a Phase 5 entry point; Release progress/tracking is not Phase 0–4 scope.

### Work item and task lifecycle

- Backlog and Iteration screens reference the same Story/Defect record; edits must reflect across screens.
- Story/Defect Schedule State and Flow State both use `Idea`, `Defined`, `In-Progress`, `Completed`, `Accepted`, `Release`.
- A newly created Story/Defect defaults both fields to `Idea`; changing either field mirrors the other.
- Defect keeps a separate Defect State in addition to Schedule/Flow State.
- Task State uses `Defined`, `In-Progress`, `Completed` and Task is always a child of Story/Defect.
- All child Tasks Completed auto-set the parent to Completed. Reopening any Task auto-sets the parent to In-Progress.
- Automatic status changes are convenience behavior; an authorized user can still change the parent status manually.
- Task Dashboard supports inline edit. Task count and iteration Task Active use all persisted child Tasks in scope.

### Iteration lifecycle

- New Iteration defaults to `Planning`.
- Assigning backlog does not auto-change the Iteration to `Committed`.
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
- Selecting a Release filters new Milestone options to related Milestones; changing Release does not silently delete existing Milestone selections.

## 3. Required DEV execution order

1. Close Phase 0–1 DevInt context, navigation, shared work-item and Task roll-up gaps.
2. Close Phase 2 Iteration lifecycle, scope and metrics gaps.
3. Close Phase 3 Team Status, Release/Milestone and Quality gaps.
4. Implement and DevInt Phase 4 governance after Phase 0–3 critical paths are stable.
5. Start Phase 5 only after BA confirms Release Planning and Reports SRS/mockup.

The task-level order, owners, proposed dates and acceptance criteria are maintained in `../Mini_Rally_Product_Plan.xlsx`.

## 4. Acceptance gates

- Same entity ID and values appear consistently in Backlog, Work Item Detail, Iteration Status, Team Status, Quality and Timeboxes.
- Create creates one record; Cancel creates none; reload/persistence behavior is verified in DevInt where applicable.
- Automatic status changes and manual overrides both pass the confirmed rules.
- Release/Milestone cardinality, filtering and derived dates pass positive and negative cases.
- Every confirmed gap has owner, fix note, retest evidence and BA disposition in the DevInt tracker.
- Relevant Phase test scenarios and the E2E Agile lifecycle suite pass before phase sign-off.

## 5. Deferred — do not implement implicitly

- Team Board, Iteration Board, drag/drop and WIP rules.
- Release progress percentage, zero-state and progress recalculation.
- Database/schema/infra design or persistence implementation decisions.

Promote a deferred item only after BA/PO adds it to the active workbook and confirms its SRS/mockup.
