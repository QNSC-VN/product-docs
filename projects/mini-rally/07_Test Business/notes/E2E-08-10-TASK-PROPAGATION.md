# E2E-08/09/10 — Task time & status propagation (DevInt live)

**Execution date:** 2026-07-20
**Environment:** `https://rally-dev.qnsc.vn/` (Microsoft SSO, `hieuvbm@qnsc.vn`), context `NXP / All Teams`
**Parent surrogate:** `US-9 / Automate dependency graph visualisation in CI` (No team)
**Controlled Tasks:** `TA-6 / BA-E2E-20260720 Task A`, `TA-7 / BA-E2E-20260720 Task B`

## Precondition — DevInt was reseeded

DevInt was regenerated when it restarted. All controlled records from E2E-01→E2E-07 are gone: `TA-8`/`TA-9`, `IT-5 / BA-E2E-20260720 Iteration`, the two controlled Releases and the Milestone no longer exist. The item formerly noted as `US-12` is now keyed `US-9`; every item's Creation Date is 2026-07-20; the Iteration list is only `Sprint 26.1 / Sprint 26.2`. The E2E-08 resume note's condition ("recreate only once persistence proves the records are gone") is therefore satisfied, and `TA-6`/`TA-7` were created fresh under `US-9`.

## Build changes vs the P1-TASK-01 / E2E-07 audit

Fixed on this build:
- Task **create** now works for the parent (previously failed with opaque error refs). `GAP-P1-TASK-002` improved.
- Task Detail is **reachable** — clicking a Task ID and direct `/item/TA-6` both open the Task with tabs Details / Revision History and no Tasks tab. `GAP-P1-TASK-004` fixed.

Still present:
- `GAP-P1-TASK-001` / `DEV-012` — Tasks tab badge shows `0` while rows exist (Totals row is correct).
- `GAP-P1-TASK-003` / `DEV-014` — no inline edit on the Task Dashboard rows (only checkbox + ID button).
- `GAP-P1-TASK-005` — Add Task modal has only `Create Task`; no `Create with details`.
- `GAP-P1-TASK-006` — state label is `In Progress`, not canonical `In-Progress`.
- First-render blank: opening Task Detail via the in-app tab click renders an empty Details body until the Details tab is re-clicked; direct URL renders fine.

## E2E-08 — Task time recalculation: FAIL

- `Estimate = To Do + Actuals` is **not** implemented. On `TA-6` set To Do = 3 and logged Actual = 2h; the Estimate field stayed empty (expected 5).
- `US-9` Task Roll-up read **Estimate 4 / To Do 3 / Actual 2**, i.e. Total Estimate 4 ≠ To Do 3 + Actual 2 = 5. `DEV-013` / `GAP-P1-TIME-001` confirmed still present at both Task Detail and roll-up level.
- Estimate is an independent editable number field (and the Add Task modal accepts an independent Estimate — `TA-7` created with Estimate 4 while To Do/Actual were 0).
- **Model divergences:** Actual is captured through a **"Time Logs" entry list** (Actual = sum of entries), not the Phase-1-confirmed manual `actual_hours` field. Task Detail exposes **Schedule State (6 buttons) + Flow State (4-option dropdown)** instead of a single Task State (`Defined/In-Progress/Completed`).
- **Side effect:** setting a Task to Completed zeroes its To Do (`TA-6` To Do 3 → 0 on completion).

## E2E-09 — all child Tasks Completed → parent auto-Complete: PARTIAL PASS

- Completing only `TA-6` (1 of 2) left `US-9` at `Defined` — partial completion correctly does not complete the parent.
- Completing `TA-7` as well auto-changed `US-9` **Schedule State → Completed**. Auto-complete works.
- ❌ `US-9` **Flow State stayed `Defined`** — it did not mirror to Completed. TASK-FR-016 and the state contract require Schedule State ↔ Flow State to mirror and both to become Completed. Mirror/dual-field roll-up is only half implemented (the same non-mirror was seen on the Tasks themselves).

## E2E-10 — reopen a Task → parent auto-In-Progress: FAIL

- Reopened `TA-6` (Completed → In Progress); the change persisted (`TA-6` = In Progress after reload).
- ❌ `US-9` **stayed Completed**; it did not auto-roll-back to `In-Progress`. The reconciled rule (reopening any child Task → parent In-Progress) is not implemented; the auto-roll-up is one-way only.

## Live data state left for BA inspection (not cleaned up)

- `US-9`: Schedule State = Completed, Flow State = Defined.
- `TA-6`: In Progress; To Do 0; Actual 2h (one time-log entry 2026-07-20).
- `TA-7`: Completed; Estimate 4; To Do 0; Actual 0.

Per the workspace rule, controlled data is preserved for BA inspection; awaiting BA decision on whether to revert `US-9` to `Defined` and/or delete `TA-6`/`TA-7`.

## E2E-05 cross-screen roll-up retest (post-reseed): PARTIAL PASS + new gap

Assigned `US-9` to `Sprint 26.2` and checked the Track screens (this was `Not Testable` before because the old `IT-5` had No team).

- **Iteration Status / Sprint 26.2:** `US-9` appears exactly once with the same identity and Schedule State `C`; Totals roll up correctly (Plan 13 pts; Task Est 4h; To Do 0h). Cross-screen identity + metric roll-up now pass.
- ❌ **Metric inconsistency (`DEV-019`):** for the same US-9 (TA-6 In Progress, TA-7 Completed), **Team Status** shows Alice Developer `(2 Tasks) 50%` (state-based, correct) but **Iteration Status** shows `US-9 Tasks 100%` and the top tile `0 Active Tasks` (To-Do-based). The two screens disagree, and Iteration Status contradicts the confirmed metric definition (`N active = child Tasks not Completed`). Iteration Status appears to derive completion from To Do (which completion zeroes) rather than Task State.
- **Team Status / Sprint 26.2:** child Tasks TA-6/TA-7 roll up to owner Alice Developer with Estimate 4 / To Do 0 / Actuals 2 — identity roll-up correct.

## BA dispositions — confirmed 2026-07-20

All logged as `Confirmed` in the tracker Gap Log.

1. **DEV-015** — Estimate must be derived read-only = To Do + Actuals (Task, roll-up, Add Task modal). BA 2026-07-20: **Actual is a manual input as in the mockup** (replace the Time Logs entry-sum), and completing a Task must **not** silently zero To Do.
2. **DEV-016** — Confirmed: remove Schedule + Flow State on Tasks; Task Detail/Dashboard must expose a single Task State (`Defined/In-Progress/Completed`) exactly as the mockup.
3. **DEV-017** — Confirmed: on all-Tasks-Completed the parent must change both Schedule State and Flow State (mirror), and the two must mirror bidirectionally.
4. **DEV-018** — Confirmed: reopening a child Task must roll the parent back to `In-Progress`.
5. **DEV-019** — Confirmed with scope: **Planned Velocity** is not defined yet → **Phase 5**; **Iteration End** = day count (correct); **Accepted** = percent of US/DE in `Accepted` state; task active-count and Task % must be **State-based** and consistent between Iteration Status and Team Status (not To-Do-based).
