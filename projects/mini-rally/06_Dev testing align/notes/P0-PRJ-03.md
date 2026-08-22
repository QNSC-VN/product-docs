# P0-PRJ-03 — Archive, Restore and archived read-only state

## Audit scope

- Environments: DevInt `https://rally-dev.qnsc.vn/projects` and local mockup.
- Account: `hieuvbm@qnsc.vn` as Workspace Admin.
- Controlled Project: `AUD719 — DEVINT Audit Project 20260719`.
- Audit date: 2026-07-19.
- Final data state: `AUD719` was restored to **Active** after testing.

## Archive execution

1. Active state before Archive: Total `6`, Active `6`, Archived `0`; selector contained six Projects including `AUD719`.
2. DevInt opened an Archive dialog explaining that the Project becomes read-only, remains visible for history, leaves Active filtering and prevents new Work Items, Iterations and Releases.
3. Archive remained disabled until `AUD719` was typed exactly.
4. Archive succeeded and displayed a success notification.
5. Resulting metrics: Total `6`, Active `5`, Archived `1`.
6. `AUD719` disappeared from the Active list, appeared in Archived with its name, description, Owner, Member count and Team count preserved, and disappeared from the active Project selector.

This matches the SRS soft-state and selector behavior. DevInt's typed-key confirmation is stronger than the current mockup and matches the SRS requirement to confirm the Project key/name.

## Archived read-only execution

- DevInt exposed both `Edit project` and `Restore project` for archived `AUD719`.
- `Edit project` opened a normal editable-looking form with Save Changes.
- Submitting Save without changing data was rejected with: `This project is archived and read-only. Only restoring it to active is permitted.`
- The backend guard therefore protects data integrity, but the FE affordance is misleading and differs from the mockup, which exposes only Restore for archived rows.

## Restore execution

1. DevInt restored `AUD719` immediately when `Restore project` was selected; no confirmation dialog appeared.
2. Metrics returned to Total `6`, Active `6`, Archived `0`.
3. `AUD719` returned to the Active list and the Project selector.
4. Mockup behavior differs: selecting Restore opens a confirmation dialog that explains the Project will return to active selectors and become manageable again.

## BA confirmation

BA confirmed **PASS** for the current DevInt Archive/Restore behavior on 2026-07-19 because the workflow works end to end and the backend protects archived Projects from updates.

1. Archived `Edit project` affordance is accepted as-is because Save is rejected by the backend. No mandatory DevInt change.
2. Immediate one-click Restore is accepted as-is. Reconcile the mockup's Restore confirmation during the final documentation pass.
3. Typed-key Archive is accepted and remains authoritative because it matches the SRS. Reconcile the mockup during the final documentation pass.

Checkpoint status: **Confirmed / Match Confirmed**. Execution result: **Pass**.

## Coverage not tested

- Blocking creation/update of child Work Items, Iterations and Releases while archived: `AUD719` has no controlled child data in this checkpoint.
- Archive/Restore audit event visibility: no in-scope audit-event viewer was used in this Phase 0 checkpoint.
- Permission denial for Project Manager/member/viewer: only the Workspace Admin account is available.
- Data/history preservation beyond the visible Project row aggregates requires controlled child data.

These items are **NOT TESTED**, not confirmed defects.
