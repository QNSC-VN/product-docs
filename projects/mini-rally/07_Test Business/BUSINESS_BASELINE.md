# Business Baseline for DevInt E2E

**Effective date:** 2026-07-20
**Scope:** UI/business behavior for Phase 0–4. The complete baseline is `../04_Developement_tracking/RECONCILED_SOURCE_OF_TRUTH.md`.

## Timeboxes

- Iteration, Release and Milestone are separate records and can be created in any order.
- Iteration status is exactly `Planning`, `Committed`, `Accepted`; default is `Planning`.
- Assignment does not auto-commit. `Committed` never locks scope or board behavior.
- Authorized users can always edit Iteration status manually.
- A non-empty Iteration auto-changes to `Accepted` when all assigned Story/Defect items are `Accepted`; the system does not auto-reverse it.
- Users may add, remove or move Story/Defect items while a sprint is running.

## Release and Milestone

- Release and Milestone are independent and link many-to-many; neither is the parent of the other.
- A Milestone may span multiple Projects and Teams.
- Without linked Releases, Milestone Target Start/End are manually editable.
- With linked Releases, Target Start is the earliest linked Release start and Target End is the latest linked Release end; the derived dates are read-only.
- Removing all Release links restores manual-date editing.
- A Story/Defect may have zero or one Release and zero or many Milestones.
- Changing Release never silently adds or removes existing Milestones. New Milestone options are filtered to Milestones related to the selected Release.

## Work item

- Backlog contains Story and Defect; Task exists only under a Story/Defect.
- New Story/Defect defaults Schedule State and Flow State to `Idea`.
- Both fields use `Idea`, `Defined`, `In-Progress`, `Completed`, `Accepted`, `Release` and mirror in both directions.
- Defect retains a separate Defect State.
- Backlog, detail and iteration screens must show the same record and values.

## Task and propagation

- Task State uses `Defined`, `In-Progress`, `Completed`; default is `Defined`.
- A Task inherits Project, Team, Iteration and Release/Milestone context through its parent Story/Defect.
- Task Dashboard supports inline edit. Task count and Task Active count all persisted child Tasks in scope.
- When all child Tasks are Completed, the parent auto-changes to Completed.
- Reopening any child Task auto-changes the parent to In-Progress.
- Automatic status is a convenience; users retain manual control of Story/Defect status.

## Acceptance reference

Run `specs/E2E_AGILE_LIFECYCLE_RECONCILIATION.md` with the relevant `specs/PHASE*_TEST_SCENARIOS.md`, and record Match/Gap, decision, owner and retest evidence in the business and DevInt trackers.
