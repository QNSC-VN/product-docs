# E2E Agile Lifecycle Reconciliation

## Purpose

This is the canonical BA/UAT flow proving that Phase 0-4 screens operate as one Agile management chain with shared Work Item identity and shared status values. Release Progress is explicitly excluded and belongs to Phase 5 `Portfolio > Release Planning`.

## Baseline data

- One Project and Team in the active context.
- One authorized Project Admin in the assigned Project and one Project Member in the assigned Team.
- Two Releases with different start/end dates.
- One Milestone linked to both Releases.
- One Iteration.
- One Story and one Defect, each with child Tasks.

## Reconciled flow

| Step | Action | Expected cross-screen result |
|---:|---|---|
| 1 | Create Milestone and Releases in either order; enter Milestone dates when it has no Release, then link both Releases | Objects remain independent; Milestone may span multiple Projects/Teams; relation is many-to-many. Once linked, Milestone start is earliest linked Release start and end is latest linked Release end. |
| 2 | Create Iteration | Default Iteration status is `Planning`; it appears in Timeboxes and Iteration selectors |
| 3 | Create Story and Defect in Backlog | Schedule State and Flow State both default to `Idea`; same IDs open in Work Item Detail |
| 4 | Assign zero/one Release and zero/many Milestones to each Work Item | Release and Milestone relations persist independently; related add options follow the selected Release without removing existing Milestones |
| 5 | Assign both Work Items to the Iteration, then commit sprint scope | Assignment leaves the Iteration in `Planning`; an authorized user manually changes it to `Committed`. Backlog retains the same items and scope remains editable. |
| 6 | Create child Tasks from Work Item Detail | Tasks inherit parent Iteration; no independent Task assignment and no standalone Task row in Backlog or Iteration Status |
| 7 | Edit Task state/time in Task Dashboard or Task Detail | Same Task ID/state/Estimate/To Do is reflected in Work Item Tasks and Team Status; Iteration Tasks active and Totals recalculate |
| 8 | Complete some but not all Tasks | Parent US/DE remains user-controlled and is not auto-completed |
| 9 | Complete all child Tasks of one parent | Parent Schedule/Flow State auto-mirrors to `Completed`; authorized user may still change it manually |
| 10 | Reopen one Task after all child Tasks completed | Task metrics recalculate; parent Schedule/Flow State auto-mirrors back to `In-Progress`; authorized user may still change it manually afterward |
| 11 | Complete the reopened Task and manually accept every scoped Story/Defect | Parent returns to `Completed`; same subsequent `Accepted` state appears in Backlog, Detail and Iteration Status; a non-empty Iteration whose assigned US/DE are all Accepted auto-moves to `Accepted`, remains manually editable and does not auto-reverse |
| 12 | Inspect Release and Milestone artifacts | Each surface shows the same assigned Story/Defect identities; no clone and no unrelated relation/status mutation |
| 13 | Inspect Quality Defect | Same Defect is visible; Defect State remains separate from mirrored Schedule/Flow State |

## Metric assertions

- `Tasks — N active` = count of child Tasks with State other than `Completed` under Story/Defect assigned to the selected Iteration.
- Plan Estimate total = sum of scoped Story/Defect Plan Estimate.
- Task Estimate total = sum of all child Task Estimate under those Story/Defect.
- To Do total = sum of all child Task To Do under those Story/Defect.
- Moving a parent Work Item to another Iteration moves all child Task metric contribution with it.
- US/DE without Tasks contributes zero to Task count/Task Estimate/To Do.

## Pass criteria

1. No duplicate Work Item or Task identity is created between screens.
2. Schedule State and Flow State use only `Idea`, `Defined`, `In-Progress`, `Completed`, `Accepted`, `Release`, default to `Idea` and mirror bidirectionally.
3. Child Task State uses only `Defined`, `In-Progress`, `Completed`.
4. Defect State stays independent: `Submitted`, `Open`, `Fixed`, `Closed`, `Closed Declined`.
5. Automatic parent/Iteration updates never lock authorized manual status changes or prevent adding US/DE during a `Committed` Iteration; assignment does not auto-commit and auto-accept never auto-reverses.
6. Phase 3 Release list/detail contains no Release Progress column, percentage or widget.

## Mockup execution evidence - 2026-07-19

- M1-M5.3 proved the shared Work Item/Task/Iteration portions of Steps 2-11 and the Release/Milestone portions of Steps 1, 4 and 12, including default state, manual Iteration status override, Task roll-up/reopen, Iteration auto-Accept, independent Release/Milestone creation, many-to-many linking and derived Milestone dates.
- M5.3 created `REL-005 / M5.3 Release A` (2026-07-01 to 2026-07-31) and `REL-006 / M5.3 Release B` (2026-07-15 to 2026-08-31).
- Linking both Releases to `MS-004 / M5.3 Milestone Window` derived the exact window 2026-07-01 to 2026-08-31.
- `US-4821` was assigned to `REL-005` and `MS-004`; both Artifacts tabs showed the same checked Story ID exactly once.
- With `REL-005` selected, the Work Item Milestone dropdown offered only related `MS-004`. After changing Release, the already-selected `MS-004` remained while add-new options recalculated; changing back restored the canonical assignment.
- Frontend production build passed. Evidence is session-level mock state only; refresh/API/database persistence is outside the BA/FE mockup scope.
