# BA SRS Correction Request — Rally Clone Phase 0–6 Audit

> **Historical review notice (2026-08-10):** This response records the 2026-08-06 baseline. Any Project Admin/Project Member role conclusions are superseded by the approved model in Phase 4 `02_Roles_Permissions/SRS.md`.

> **BA review completed 2026-08-06:** C1–C5 and C7–C10 are Confirmed. C6 is Not Confirmed and remains Future Backlog. SRS/mockup/audit alignment is the next controlled step.

**From:** Solution Architect (Dev)
**To:** BA
**Date:** 2026-08-06
**Re:** Audit response to `PHASE_0_6_AUDIT_TRACKER.xlsx` — items where the **SRS/mockup design is wrong** and must be corrected, and items that are **not code defects** (false positives / test-data gaps).

---

## 1. Headline

The Phase 0–6 audit report flags 57 active Fail/Partial rows. After a full code audit against (a) the repo implementation, (b) the Phase 0–6 SRS, and (c) how **real Broadcom Rally (rally1.rallydev.com / CA Agile Central)** actually behaves, the breakdown is:

| Class | Count | Meaning | Action |
|---|---|---|---|
| **DATA_TEST_GAP** | 31 | Code already implements the requirement; the test branch was never exercised, the fixture is stale/depleted, or a test account is missing. | Re-test against fresh fixtures. **No code change, no SRS change.** |
| **MATCHES_RALLY (false positive)** | 6 | The code matches the final BA product rule after C1-C10 confirmation. | **Close the bug. Correct the SRS/mockup.** |
| **PARTIAL_REAL** | 14 | Real but minor gap; several are already fixed in the current build. | Verify on current build, then small fix. |
| **REAL_BUG** | 6 | Genuine defect against the final BA product scope, including the rejected C6 request. | Dev fixes (separate list). |

**Net:** ~65% of the report (31 re-tests + 6 false positives) should not be treated as open code defects. The 6 real bugs + 14 partials remain tracked separately on the dev side.

---

## 2. SRS / Mockup corrections requested (10)

These are places where the SRS or mockup **contradicts real Broadcom Rally** or is **internally inconsistent** (e.g. Phase 1 vs Phase 4 disagree). Each correction kills one or more recurring bug reports.

### C1. Work Item — Team field is OPTIONAL, not required
> **BA Decision:** => Confirmed — Team is optional; blank Team means Project backlog; selected Team must be linked to the current Project. Close the two related gaps as Not a Defect.
**Affects:** `P1-CREATE-01`, `P1-WID-01` (historical wording); kills `GAP-P1-CREATE-003`, `GAP-P1-WID-008`.
**Current SRS says:** Team is required; "No team" option is not allowed.
**Real Rally:** Has no separate Team field on a User Story/Defect at all — work is scheduled to an Iteration and to a Project's teams via allocation, not via a mandatory Team selector on the create form.
**Requested SRS change:** Adopt the **already-approved reconciled rule** (consistent with `P1-WIC-FR-004/005`):
- Team is **optional** on create.
- A blank Team = item sits on the **Project backlog**.
- When a Team is selected, it must be **linked to the current Project**.

### C2. Portfolio menu = Portfolio Items + Capacity Planning + Release Tracking
> **BA Decision:** => Confirmed — Portfolio menu is Portfolio Items, Capacity Planning, Release Tracking. Release Planning remains Future Backlog; close GAP-P0-SHELL-002 as Not a Defect.
**Affects:** `P0-SHELL-01`; kills `GAP-P0-SHELL-002`.
**Current SRS says:** The Portfolio dropdown must contain **Release Planning**.
**Real Rally:** Release Planning lives under **Plan**, not Portfolio. Portfolio contains Portfolio Items, Capacity Planning, and Release Tracking.
**Requested SRS change:** Replace the Phase-0 "Portfolio dropdown contains Release Planning" placeholder with the three-item menu mandated by the Phase 5/6 SRS (`RT-AC-01`): **Portfolio Items, Capacity Planning, Release Tracking**. (The Phase 6 SRS already states it supersedes the older P0 wording — record this in the P0 trace.)

### C3. Iteration Status — no dedicated Type column
> **BA Decision:** => Confirmed — Remove the dedicated Type column because the Work Item type is already clear from the `US`/`DE` ID prefix. Close `GAP-P2-IS-003` as Not a Defect; the ID prefix remains required.
**Affects:** `P2-IS-FR-018`; kills `GAP-P2-IS-003`.
**Current SRS says:** Iteration Status must render a dedicated **Type** column.
**Real Rally:** Encodes type in the **Formatted ID prefix** (`US`/`DE`/`TA`). A Type column is at most an optional add-on, not standard.
**Requested SRS change:** Drop the dedicated Type column requirement. The clone already shows a type glyph + prefixed key inside the ID cell, which matches Rally.

### C4. Team Status — Filters and pagination are ALLOWED
> **BA Decision:** => Confirmed — Keep Filters and pagination; remove the local Search Tasks input and Show Fields. Totals must cover the full Iteration scope, not only the current page. Narrow `GAP-P3-TS-002` to the remaining Show Fields defect instead of closing the whole gap.
**Affects:** `P3-TS` controls section; kills the false-positive half of `GAP-P3-TS-002`.
**Current SRS says:** (read strictly) Team Status must not have Filters / Show Fields / pagination.
**Real Rally:** Team Status **does** have **Show Filters** and **pagination**. It does **not** have a dedicated local search box or a "Show Fields" column chooser.
**Requested SRS change:** Soften the blanket control ban:
- **Permit:** Filters (Show Filters) and pagination — genuine Rally features.
- **Keep prohibited:** local search box (`P3-TS-FR-006`) and the "Show Fields" column chooser.

### C5. User Management — Phone is a profile attribute, not a list column; remove Teams list column
> **BA Decision:** => Confirmed — Remove Phone and Teams from the User Management list. Phone remains required in User Detail/Profile; Team membership is managed in User Detail or Team Members. Narrow `GAP-P4-SET-002`: missing Phone on the list is Not a Defect, but a Teams list column or missing Phone in User Detail remains a defect.
**Affects:** `P4-SET-02`; reconciles Phase 1 vs Phase 4 column specs.
**Current SRS says:** (Phase 4) user list must show a Phone column; (Phase 1) adds a Teams column and omits Phone — the two phases disagree.
**Real Rally:** Phone number is a **profile / User-Details-dialog** attribute, not a mandatory user-list column. The user list does not carry a Teams column.
**Requested SRS change:**
- Make **Phone** a User-Details-dialog/profile attribute only — **not** a mandatory list column.
- **Remove the Teams list column** (neither Phase-4 SRS nor Rally has it).
- Reconcile the Phase 1 and Phase 4 column specs into **one consistent set**.

### C6. Notification Preferences — ALLOW in Phase 4
> **BA Decision:** => Not Confirmed — Keep Notification Preferences in Future Backlog. Phase 4 supports fixed in-app notifications for Work Item assignment and Note mentions only; email delivery and user-configurable preferences remain out of scope. `GAP-P4-SET-005` stays open and DEV must remove/hide the current Settings entry.
**Affects:** `P4-SET-06` / `P4-NOTIF-DC-008/009`; `GAP-P4-SET-005` remains open.
**Current SRS says:** Notification Preferences is out of Phase-4 scope.
**Real Rally:** Ships **per-user notification preferences** (Email Notifications / mentions / assignments via "My Notifications").
**Requested SRS change:** **Allow** Notification Preferences in Phase 4 (Rally parity). The clone's implementation (per-event In-App/Email toggles) is already strong. *(If the product team still wants to defer the tab, defer it explicitly instead of re-reporting it as a defect — this is a product-scoping call, flagged for your decision.)*

### C7. Velocity chart — default Last 10, not Last 5
> **BA Decision:** => Confirmed — Default Velocity to `Last 10 sprints` and keep the `Last 5 / Last 10` toggle. Preserve the user's selected window after reload. Close `P6-VEL-006` as Not a Defect after the SRS default is corrected.
**Affects:** P6 Velocity SRS; kills `GAP-P6-VEL-006`.
**Current SRS says:** Velocity chart defaults to **Last 5** iterations.
**Real Rally:** Velocity chart is fixed at the **last 10 completed iterations** with no built-in toggle.
**Requested SRS change:** Change default to **Last 10** (Rally parity). The clone keeps the 5/10 toggle as an enhancement on top of the Rally-accurate default.

### C8. Capacity Planning Features-tab — column order
> **BA Decision:** => Confirmed — Use the DevInt/Rally-aligned display order `Dependencies → Rollup → Estimated → Complete`. This changes column placement only, not metric formulas. Correct the SRS/mockup and close `P5-CP-031` as Not a Defect.
**Affects:** `P5-CAP` SRS; kills `GAP-P5-CP-031`.
**Current SRS says:** A specific numeric column order that differs from the build.
**Real Rally:** Documented order is **Dependencies, Rollup, Estimated, Complete**.
**Requested SRS change:** Correct the numeric column order to **Dependencies, Rollup, Estimated, Complete** (the clone already ships this order).

### C9. Iterations / Timeboxes list — Project column optional for single-project scope
> **BA Decision:** => Confirmed — Current Timeboxes is single-project scope from the global Project selector, so the Project column and Project search/sort are not required. Task Estimate remains mandatory. Narrow `GAP-P2-IT-001`: missing Project is Not a Defect, while missing Task Estimate remains an open defect. Add Project back only if a future cross-project view is approved.
**Affects:** `P2-IT-FR-005`.
**Current SRS says:** Iterations list must show a **Project** column.
**Real Rally:** The page is scoped by the global Project picker (single project), so a Project column is redundant.
**Requested SRS change:** Make the Project column **optional** for single-project scope (keep **Task Estimate** as required). If a cross-project view is intended, confirm scope and the column is a trivial add — please confirm which.

### C10. Work Item Owner default — document as intentional MORE-THAN-RALLY
> **BA Decision:** => Confirmed — Mini Rally intentionally defaults a new Work Item Owner to the authenticated current user while retaining an explicit Unassigned option. Owner options must use current Project/Team membership. Remove the ambiguous `current user or Unassigned by config` wording from `WIC-FR-006`. `GAP-P1-CREATE-006` remains open until DevInt implements the default and membership synchronization.
**Affects:** `P1-CREATE` Owner default; pre-empts future re-reports.
**Current SRS says:** Owner defaults to the authenticated current user.
**Real Rally:** Leaves **Owner blank / unassigned** on create.
**Requested SRS change:** No behavior change — just **document** that "Owner defaults to the current user" is a **deliberate product decision that exceeds Rally**, so it is not re-reported as a Rally divergence in future audits.

---

## 3. BA-approved bugs to CLOSE as Not a Defect

These 6 rows should be moved to **Closed / Not a Defect**. No code change.

| Bug ID | Module | Why it matches real Rally |
|---|---|---|
| `GAP-P1-CREATE-003` | Work Item Create | Code implements the approved Team-optional rule (see C1). Rally has no Team field to adjudicate this. |
| `GAP-P1-WID-008` | Work Item Detail | Same root rule via `allowUnassigned` on the shared Quick Create surface (see C1). |
| `GAP-P2-IS-003` | Iteration Status | No default Type column in Rally; type is in the ID prefix. Clone shows glyph + prefix (see C3). |
| `GAP-P0-SHELL-002` | Global navigation | Nav order matches Phase 6 SRS + Rally (see C2). |
| `P5-CP-031` | Capacity Planning | Features-tab column order = Rally documented order (see C8). |
| `P6-VEL-006` | Reports / Velocity | Rally Velocity is fixed Last-10; clone defaults Last-10 + adds toggle (see C7). |

---

## 4. Data / test-execution gaps (31) — re-test, do not code

These rows report "Fail/Partial" but the code already satisfies the requirement. The failures came from **stale or depleted test data, unrun branches, or missing test accounts** (e.g. only one usable Team, missing Project Admin / Project Member sessions, missing notification recipient rows). They should be **re-run against fresh fixtures with the required accounts** before any are treated as defects. Representative examples: split-allocation cases, cross-Team origin cases, RBAC denied-route proof, Phase 4 notification cases.

---

## 5. What Dev is fixing (for transparency)

So it is clear we are not rejecting everything — the following are **accepted as real defects** and Dev is fixing them now (separate dev tracker):

- **[P0] `GAP-P3-TS-008`** — Team membership source mismatch (root cause of "added member not in Owner dropdown").
- **[P0] `GAP-P4-SET-004`** — Missing destructive-action confirmations (Team deactivate; Remove-User-Access flow).
- **[P1] `P5-CP-032`** — Capacity quick-assign never promotes `isPrimary` (blocks `P5-CP-034`).
- **[P1] `GAP-P1-BL-002`** — Priority filter wrongly matches Stories.
- **[P1] `GAP-P2-IS-004`** — Iteration Status renders an SRS-forbidden per-row Defects column.

Plus 14 PARTIAL items, several already fixed in the current build (will be verified and closed).

- **[P2] `GAP-P4-SET-005`** — Notification Preferences remains outside Phase 4; remove/hide the Settings entry and track preferences in Future Backlog.

---

## 6. Final BA disposition

All ten decisions were completed on 2026-08-06:

- C1-C5 and C7-C10: Confirmed.
- C6: Not Confirmed; Notification Preferences remains Future Backlog and `GAP-P4-SET-005` remains open.
- C9: current Timeboxes is single-Project scope; Project column/search/sort is not required, while Task Estimate remains required.
- C10: current-user Owner default is intentional; explicit Unassigned remains available and named options must follow current Project/Team membership.

— Solution Architect
