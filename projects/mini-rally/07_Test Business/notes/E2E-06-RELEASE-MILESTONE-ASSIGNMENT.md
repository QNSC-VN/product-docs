# E2E-06 — Work Item Release and Milestone Assignment

**Execution date:** 2026-07-20
**Surrogate Work Item:** `US-12 / Automate dependency graph visualisation in CI`
**Overall result:** `Blocked — Release passes; Milestone control missing`

## Confirmed business baseline

1. A Work Item has at most one active Release.
2. A Work Item can be assigned to multiple Milestones.
3. Release and Milestone relations are independent.
4. With no Release, the Milestone add-new options show valid current-project Milestones.
5. With a Release, already-selected Milestones remain visible and add-new options show only Milestones related to that Release.
6. Changing Release must not remove selected Milestones.

## Passed behavior

1. US-12 accepted controlled Release A.
2. Selecting controlled Release B replaced Release A, matching the one-active-Release rule.
3. Release B persisted after route reload.
4. IT-5 remained selected while Release changed.
5. Backlog showed the same US-12 with Release B and IT-5.

## Blocked behavior — DEV-011 / P0

Work Item Detail has no Milestone field or control. The following cannot be executed:

- multi-select assignment;
- related-option filtering based on Release B;
- preserving selected Milestones when Release changes;
- independent persistence between Release, Milestone and Iteration.

## Proposed fix direction

- Add a Milestone multi-select to Work Item Detail.
- Load valid current-project options when Release is empty.
- When Release is selected, filter only the add-new option set to related Milestones.
- Keep all selected Milestones visible and persisted when Release changes.
- Do not change Release or Iteration when Milestones are added or removed.

## Evidence

- `evidence/E2E-06/01-us12-detail-mismatch.png`
- `evidence/E2E-06/02-us12-release-a.png`
- `evidence/E2E-06/03-us12-release-b-replaces-a.png`
- `evidence/E2E-06/04-us12-release-b-persisted-no-milestone.png`
- `evidence/E2E-06/05-us12-release-b-backlog-mirror.png`
