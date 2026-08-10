# DEV Fix Handoff — DevInt Audit Phase 0–6

> **Access-model supersession (2026-08-10):** Authorization findings from the 2026-08-09 re-test remain historical. Current acceptance must use Workspace Admin plus per-Project `Admin`/`Editor`/`Viewer`/`No Access` and be re-tested with controlled assignments.

**Latest re-test:** 2026-08-09

**Environment:** `https://rally-dev.qnsc.vn/`

**Primary result:** `PHASE_0_6_AUDIT_TRACKER.xlsx`

**Detailed log:** `../Codex_audit_06_tracker.md`

## 1. Current status

- Total scenarios: **192**.
- Current dashboard: **84 Pass / 31 Partial / 9 Fail / 14 Blocked / 41 Not Run / 9 Future Backlog / 4 Not Required**.
- This re-test covered all **51** scenarios that were previously `Fail` or `Partial`; existing `Blocked` scenarios were excluded.
- Only FE and approved business behavior are in scope. Do not expand into schema, DB or infrastructure.

## 2. Confirmed Fail — DEV must fix

| ID | Current evidence | Required behavior |
|---|---|---|
| `GAP-P1-BL-001` | Clearing Backlog search leaves the list at `1–1 of 1` until reload. | Clearing text restores the full scoped backlog immediately. |
| `GAP-P1-CREATE-006` | Quick Create still defaults Owner to Unassigned and does not offer the current user. | Apply the approved current-user default and membership-scoped Owner options. |
| `GAP-P3-TS-005` | Team Status counts a Task but does not render its Task row/State control. | Render the Task and provide an inline State dropdown. |
| `GAP-P3-TS-007` | Exact Task State values cannot be selected because the Task control is absent. | Use exactly `Defined / In-Progress / Completed`. |
| `GAP-P3-TS-008` | Settings says Pegasus contains only Anh; Team Status still groups Hieu with one Task. | Use one current Team-membership source and invalidate stale membership data. |
| `GAP-P4-SET-003` | Audit Log still contains `auth.login.sso`, `access.role_elevated` and technical IDs. | Show approved administrative mutations with business-readable before/after detail. |
| `P5-CP-005` | Draft Capacity remains read-only `30 points`; only Forecast is actionable. | Allow Draft-only manual Capacity editing without changing allocation or live Feature estimates. |
| `P5-CP-032` | FE-2 is allocated under Pegasus but Planned Team still shows `Not assigned`. | Persist/render Planned Team from the shared allocation ledger. |
| `P5-CP-034` | Unassign cannot work because the assigned Team state is not rendered. | Fix `P5-CP-032`, then let Unassign clear Team while retaining the Feature in the Plan. |

## 3. Partial scenarios

`Partial` does not automatically mean a DEV bug. Most remaining Partial cases need one of these controlled conditions:

- a second Project, Release, Iteration or Team;
- disposable Portfolio/Capacity records for archive, remove, split or publish branches;
- a fully-empty Task or controlled child Work Items;
- a no-Release Project, a Release-state Work Item, or a sign-out/sign-in cycle.

Two Partial areas still require follow-up implementation/regression attention:

- `GAP-P4-SET-002`: list columns now align, but User Detail, role behavior and guarded Remove User Access remain incomplete.
- `GAP-P4-SET-004`: Team Deactive confirmation now passes; typed confirmation for Remove User Access must be tested after User Detail is available.

## 4. Fixes confirmed in this re-test

- Backlog Priority `None` filters Defects only.
- Iteration list includes Task Estimate; Iteration Status removed per-row Defects.
- Team Status removed local Search and Show Fields, retained Filters/pagination and shows full-Iteration Totals.
- Team Status breadcrumb is correct.
- Workspace Settings shows single-company scope.
- Notification Preferences is hidden.
- Feature `Create with details` created one FE-4 and opened its detail.
- Reports Type/window and Release Tracking Chart Unit/bucket persist after reload.
- Work Item `Create with details` created exactly one US-7; Flow/Schedule State mirroring persisted after save and reload.

## 5. DEV completion gate

1. Reference the Scenario ID in each commit/PR.
2. Deploy the fix to DevInt.
3. BA re-tests the same row in `PHASE_0_6_AUDIT_TRACKER.xlsx`.
4. Change `Fail`/`Partial` to `Pass` only when the full Expected Result is met and still correct after reload.
