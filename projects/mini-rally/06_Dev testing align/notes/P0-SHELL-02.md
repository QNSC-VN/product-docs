# P0-SHELL-02 — Project and Team context selector

## Audit scope

- Environment: `https://rally-dev.qnsc.vn/`
- Account: `hieuvbm@qnsc.vn`
- Audit date: 2026-07-19
- Checkpoint: Fixed Company root, Project switch, Team selection, All Teams aggregation and refresh persistence
- Mutation level: context selection only; no application data changed

## Expected business behavior

- The application has one fixed Company/Workspace root and no self-service workspace switch.
- Project and Team context are explicit.
- Team options belong to the selected Project.
- `All Teams` aggregates Work Items within the current Project only.
- Switching Project invalidates/refetches scoped data and does not leave stale records from the previous Project.
- Selected context remains stable across normal navigation/refresh.

## DevInt selector observed

```text
Organization: ACME Corp / Active
Projects: NXP, MOB, OPS, LEG, PRT
Selected Project Team section:
  All Teams
  Project-linked Team, when configured
```

DevInt uses a two-stage Project list plus Team section rather than the mockup's expandable nested tree. The same Company > Project > Team relationship remains explicit, so this visual difference is not treated as a business gap.

## Execution results

1. Initial context was `LEG / All Teams`; LEG displayed no Backlog items.
2. Switched to `NXP / All Teams`.
   - Header updated immediately.
   - Backlog reloaded with 12 NXP records.
   - Selector exposed `Team Alpha` under NXP.
3. Selected `NXP / Team Alpha`.
   - Header updated to Team Alpha.
   - Backlog returned 0 records.
4. Returned to NXP / All Teams, then switched to `MOB / All Teams`.
   - Backlog reloaded with 10 MOB records and different titles from NXP.
   - Selector exposed `Team Beta` under MOB.
5. Selected `MOB / Team Beta`.
   - Header updated to Team Beta.
   - Backlog returned 0 records.
6. Refreshed `/backlog`.
   - `MOB / Team Beta` persisted.
7. Restored the working context to `NXP / All Teams`.

Project switching, All Teams project scope, Team selection control and context persistence therefore pass.

## BA confirmation

On 2026-07-19, BA explicitly classified **Team filter when selecting a Team as NOT TESTED**. The available Teams contain no Work Items, so this checkpoint must not be reported as either a filter pass or a filter defect. The Screen Inventory remains blocked for positive filter coverage until a controlled Team-linked Work Item is available.

## Pending coverage — GAP-P0-SHELL-005

Both available Team examples returned zero Work Items. A zero result can be correct, but it cannot prove the positive inclusion path.

During Phase 1 Work Item create testing:

1. Create one `DEVINT-AUDIT` Story or Defect under NXP / Team Alpha using the existing UI.
2. Confirm it appears in NXP / Team Alpha.
3. Confirm the same item appears in NXP / All Teams.
4. Confirm it is absent from MOB and any unrelated Team.

This is recorded as a P2 test-data dependency, not yet as a DevInt filtering defect. No schema or infrastructure change is proposed.
