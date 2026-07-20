# E2E-03 - Create and Link Milestone

## Status

`Standalone creation Passed; Release linkage and derived dates Blocked`

## Controlled Milestone

- Name: `BA-E2E-20260720 Milestone`
- Initial status: `Planned`
- Expected associated Releases: Release A and Release B
- Expected derived Target Start: `2026-07-20`
- Expected derived Target End: `2026-08-31`

## Passed behavior

- A Milestone can be created without a Release.
- The controlled Milestone was created exactly once and persisted after reload.
- Without a linked Release, Target Start and Target End remain blank.
- Status catalog matches: `Planned`, `At Risk`, `Met`, `Missed`, `Cancelled`, `Completed`.

## Blocked behavior

- `Associated Releases` shows `No releases available` in both Create and Edit.
- Release A and Release B already exist and persist in Project NXP.
- The test cannot select two Releases, verify many-to-many persistence, or verify the derived range `2026-07-20..2026-08-31`.

## Proposed Dev fix

- Load current-project Releases into the Milestone multi-select.
- Allow multiple Release selections and persist the many-to-many relation.
- Recalculate Target Start as the earliest selected Release start.
- Recalculate Target End as the latest selected Release end.
- Recalculate again whenever a Release is added or removed.

## Evidence

- `evidence/E2E-03/01-form-no-releases.png`
- `evidence/E2E-03/02-milestone-persisted.png`
- `evidence/E2E-03/03-edit-no-releases.png`
