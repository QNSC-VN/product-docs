# P0-SHELL-01 — Global navigation and active state

## Audit scope

- Environment: `https://rally-dev.qnsc.vn/`
- Account: `hieuvbm@qnsc.vn`
- Audit date: 2026-07-19
- Checkpoint: Main navigation information architecture, routes, active state and browser history
- Mutation level: navigation-only; no application data changed

## Confirmed business baseline

- Home is a direct entry.
- Plan contains Backlog and Timeboxes.
- Iterations, Releases and Milestones are types inside `Plan > Timeboxes`.
- Track contains Iteration Status and Team Status.
- Team Board and Iteration Status Board are Future Backlog and must not appear as current functionality.
- Quality contains Defects.
- Top-level Releases is removed.
- Portfolio is a dropdown containing `Release Planning`; Release Planning is a Phase 5 placeholder and is not a Phase 0–4 Release management source.
- Reports remains a top-level entry.
- Active navigation follows the current URL and browser Back/Forward.

Authoritative reconciliation references:

- `04_Developement_tracking/RECONCILED_SOURCE_OF_TRUTH.md` — C04/C05
- `04_Developement_tracking/Future_Backlog/02_Release_Planning.md`
- `04_Developement_tracking/Phase 3/PHASE3_MOCKUP_CHECKLIST.md`
- `04_Developement_tracking/Phase 3/02_Release_Management/SRS.md`
- `04_Developement_tracking/Phase 3/03_Milestones/SRS.md`

## DevInt observed navigation

```text
Home
Plan
├── Backlog
├── Timeboxes
└── Milestones
Track
├── Iteration
└── Team Status
Quality
└── Defects
Portfolio              -> direct /portfolio link
Releases               -> direct /releases link
Reports
```

## Routing and active-state execution

1. Opened `Plan > Backlog`.
   - URL became `/backlog`.
   - Plan received the active visual style; Home and Track were inactive.
2. Opened `Track > Iteration`.
   - URL became `/iteration-status`.
   - Track received the active visual style; Plan became inactive.
3. Used browser Back.
   - URL returned to `/backlog`; Plan active state returned.
4. Used browser Forward.
   - URL returned to `/iteration-status`; Track active state returned.

Routing, active styling and browser history therefore pass.

## Gaps awaiting BA confirmation

### GAP-P0-SHELL-001 — Top-level Releases

DevInt exposes `Releases` as a top-level link. Confirmed business removes this item and keeps Phase 3 Release Management under `Plan > Timeboxes > Releases`.

The current mockup and older Phase 0/Phase 3 navigation wording are also stale and must be reconciled after the full audit.

### GAP-P0-SHELL-002 — Portfolio behavior

DevInt Portfolio is a direct `/portfolio` link. Confirmed business requires a dropdown with `Release Planning`, explicitly deferred to Phase 5 and without Release create/edit behavior in Phase 0–4.

The current mockup has the same stale direct-link behavior.

### GAP-P0-SHELL-003 — Direct Plan > Milestones entry

DevInt shows Milestones directly beside Backlog and Timeboxes. Confirmed business places Milestones inside `Plan > Timeboxes > Milestones`, beside Iterations and Releases.

### GAP-P0-SHELL-004 — Iteration Status label

DevInt labels the Track child as `Iteration`; confirmed business and mockup use `Iteration Status`. The `/iteration-status` route is already correct.

## Parts that match

- Home, Plan, Track, Quality and Reports are present.
- Plan > Backlog and Plan > Timeboxes are present.
- Track > Team Status is present.
- Team Board is absent.
- Quality > Defects is present.
- Routes change without full-page navigation and active styling follows URL/history.

## BA decision — confirmed 2026-07-19

1. Remove the current top-level `Releases` entry. Release Management remains inside `Plan > Timeboxes > Releases`.
2. Portfolio becomes a dropdown containing `Release Planning`. Until Phase 5 is implemented, the item may be shown as `Coming Soon`; it must not expose current Release create/edit behavior.
3. `Plan > Timeboxes` presents all three types — Iterations, Releases and Milestones — following the approved mockup. Remove the separate direct `Plan > Milestones` child.
4. Rename `Track > Iteration` to `Track > Iteration Status`.

After the complete DevInt audit, update the stale Phase 0/Phase 3 navigation wording and the mockup navigation together, then package the four FE changes for Dev handoff.
