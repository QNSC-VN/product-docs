# E2E-02 - Create Releases

## Status

`Passed with confirmed navigation/scope gaps`

## Controlled records

- `BA-E2E-20260720 Release A`: `2026-07-20` to `2026-08-15`, `Planning`.
- `BA-E2E-20260720 Release B`: `2026-08-01` to `2026-08-31`, `Planning`.

## Results

- Both records were created successfully.
- Total Release count changed from 2 to 4.
- Each controlled name appeared exactly once after reload.
- Dates and default `Planning` persisted.
- Status options are exactly `Planning`, `Active`, `Accepted`.
- Release is treated as Project-level; Team was not requested.

## Confirmed gaps

- `DEV-004`: DevInt exposes active top-level `Releases`; Phase 3 Release Management belongs under `Plan > Timeboxes`.
- `DEV-005`: the list exposes `Progress`; Release Tracking belongs to Future Phase 5 at `Portfolio > Release Planning`.

## Evidence

- `evidence/E2E-02/01-release-a-form.png`
- `evidence/E2E-02/02-release-b-form.png`
- `evidence/E2E-02/03-releases-persisted.png`
