# Rally — Verification of BA DevInt Audit (Phase 0–3)

**Date:** 2026-07-24 · **Auditor:** SA / Test Lead (assisted)
**Verifies:** `06_Dev testing align/DEVINT_PHASE_0_3_AUDIT_TRACKER.xlsx` (Gap Log, 62 gaps; BA testing of DevInt ~2026-07-19).
**Oracles:** `04_Developement_tracking/RECONCILED_SOURCE_OF_TRUTH.md` (SoT) + `07_Test Business/AUDIT_2026-07-23_SRS_DEVIATIONS.md` (prior SA audit) + current `rally` code on `main`.

## Purpose
Two questions: (1) is the BA report correct? (2) does Rally align with the reconciled SRS scope + business flow? This maps every BA gap to a verdict against the CURRENT code — because the BA tested a 07-19 build and main advanced heavily 07-20→07-24.

## BA report assessment
Careful and honest — BA even self-invalidated GAP-P1-BL-001 (automation artifact) and flagged seed-data limits. Trust the observations **as of 07-19**. Two systemic caveats:
- **Stale:** ~1/3 of gaps (incl. most P0) were already fixed after 07-19 (Module 08, work-item detail, tasks, pagination). BA could not know.
- **Old-SRS oracle:** a few BA "expected" values follow the pre-reconciliation Phase-0 SRS, not the SoT — so they are wrong against the current design (see BA-WRONG).

## Verdict legend
- **FIXED** — real at 07-19, closed in current code (verified).
- **BA-WRONG** — BA's expected contradicts the reconciled SoT; Rally is correct; fix the BA report, not the code.
- **REAL** — still broken in current code; SRS-aligned expectation; needs a fix.
- **PARTIAL** — mostly fixed; minor residual.
- **VERIFY** — plausibly real, not yet code-verified (second pass).
- **INTENTIONAL / DOC** — approved deviation; update SRS text, not code.
- **BEYOND-SPEC** — extra feature; keep-or-cut decision.
- **PHASE4 / DEFERRED** — out of current phase scope; BA agrees.
- **SEED** — test-data gap, not code.
- **INVALIDATED / BLOCKED / MINOR / CONTESTED / ACCEPTED / OK** — self-explanatory.

## Counts
FIXED 28 · REAL 16 · PARTIAL 2 · BA-WRONG 2 · INTENTIONAL 2 · SEED 2 · ACCEPTED 2 · DOC 1 · BEYOND-SPEC 1 · CONTESTED 1 · OK 1 · DEFERRED 1 · INVALIDATED 1 · BLOCKED 1 · PHASE4 1  = **62**.

## Per-gap verdicts

| Gap ID | Sev | Screen | Verdict | Note |
|---|---|---|---|---|
| GAP-P1-BL-003 | P0 | Backlog | **FIXED** | total = independent COUNT before cursor; keyset seek fixed (10-vs-25 symptom). [verified] |
| GAP-P1-BL-007 | P0 | Backlog | **FIXED** | Plan Estimate autosave/persist — match-confirmed/passed. |
| GAP-P1-BL-008 | P0 | Backlog | **FIXED** | Rank persist/restore — match-confirmed/passed. |
| GAP-P1-CREATE-001 | P0 | Work Item Create | **FIXED** | Cancel creates nothing — match-confirmed/passed. |
| GAP-P1-CREATE-003 | P0 | Work Item Create | **REAL** | Team filtered by Project (fixed) BUT 'No team' option still offered. [verified] |
| GAP-P1-CREATE-004 | P0 | Work Item Create | **REAL** | Team NOT required — DTO teamId optional, no client validation; can create teamless. [verified] |
| GAP-P1-CREATE-007 | P0 | Work Item Create | **FIXED** | Create-with-details = one create + nav by returned itemKey. [verified] |
| GAP-P1-CREATE-008 | P0 | Work Item Create | **REAL** | Create works BUT default Schedule=Flow='defined' not SoT 'Idea' (service:339). [verified] |
| GAP-P1-TASK-001 | P0 | Work Item Detail / T | **FIXED** | Tasks badge derives from same useTasks query as table. [verified] |
| GAP-P1-TASK-002 | P0 | Task Dashboard | **FIXED** | createTask inherits project/team/iteration/owner from parent. [verified] |
| GAP-P1-TASK-003 | P0 | Task Dashboard | **FIXED** | Task rows inline-editable (Name/State/Owner/ToDo/Actuals autosave); Estimate read-only. [verified] |
| GAP-P1-TASK-004 | P0 | Task Detail | **FIXED** | TA id resolves via tasks-table fallback; /item/TA-1 opens Task detail. [verified] |
| GAP-P1-TASK-006 | P0 | Task Dashboard | **REAL** | Task State label 'In Progress' (space); SoT §3 'In-Progress'. types.ts:210. [verified] |
| GAP-P1-TIME-001 | P0 | Task Dashboard / Tas | **PARTIAL** | Per-row + write-path Estimate=ToDo+Actuals correct; totals SUM stored col (seed surfaces 10h). Defensive-derive optional. [verified] |
| GAP-P1-USER-003 | P0 | User Management | **FIXED** | Editable 'Edit User' modal (Role/Status/Teams); inline role dropdown removed. [verified] |
| GAP-P1-USER-004 | P0 | User Management | **PHASE4** | 9 roles vs SoT §6 = 3 technical roles. Known (prior audit 4.2). BA deferred to Phase-4 Roles&Perms. |
| GAP-P1-WID-002 | P0 | Work Item Detail | **FIXED** | Project field present read-only on Detail sidebar. [verified] |
| GAP-P1-WID-003 | P0 | Work Item Detail | **BA-WRONG** | Multi-Release contradicts SoT §2.3 (zero-or-ONE Release). Rally single-select correct. [verified] |
| GAP-P1-WID-004 | P0 | Work Item Detail | **FIXED** | Milestones multi-select present (zero/one/many). [verified] |
| GAP-P1-WID-005 | P0 | Work Item Detail | **FIXED** | Schedule State = 6 values incl Idea+Release; 'In-Progress' hyphen. [verified] |
| GAP-P1-WID-006 | P0 | Work Item Detail | **FIXED** | Two-way Schedule<->Flow mirror in service; conflicts rejected. BA's US-7 mismatch = SEED. [verified] |
| GAP-P1-WID-008 | P0 | Work Item Detail | **REAL** | 'No team' option still selectable + Team clearable to null. Project-filter works. [verified] |
| GAP-P1-WID-009 | P0 | Work Item Detail | **FIXED** | Direct /item/:key route + reload persist — match-confirmed/passed. |
| GAP-P2-IS-001 | P0 | Backlog / Iteration  | **FIXED** | Inline iteration assign patches row from mutation response; no revert. [verified] |
| GAP-P0-AUTH-001 | P1 | Login | **BA-WRONG** | BA wants local email+password; Entra SSO is the APPROVED org model (supersedes Auth SRS). Not a gap — fix BA report. |
| GAP-P0-PRJ-002 | P1 | Manage Projects | **FIXED** | Start Date column present on Projects list. [verified 07-25] |
| GAP-P0-PRJ-004 | P1 | Create Project | **REAL** | Name min is 1 (DTO min(1)) + FE no 2-char check; needs min 2. [verified 07-25] |
| GAP-P0-PRJ-005 | P1 | Create Project | **FIXED** | Project Key cap raised 6->10 (prior audit 07-23). BA saw 6 at 07-19. |
| GAP-P0-PRJ-007 | P1 | Manage Projects | **REFRAME** | Not a popover patch: refactor Projects page to the shared toolbar/Show-Fields/checkbox-bulk pattern (as iteration-status) and drop the row-actions popover. |
| GAP-P0-SHELL-001 | P1 | Global navigation | **FIXED** | No top-level Releases nav (Timeboxes type). [verified 07-25] |
| GAP-P0-SHELL-002 | P1 | Global navigation | **REAL** | Portfolio is a direct link; needs dropdown + 'Release Planning' Phase-5 placeholder child. [verified 07-25] |
| GAP-P0-SHELL-003 | P1 | Global navigation | **FIXED** | No top-level Milestones nav (Timeboxes type). [verified 07-25] |
| GAP-P0-WS-002 | P1 | Workspace identity | **DOC** | Workspace name editable — now BA-APPROVED (Docs Change). Update SRS, no code fix. |
| GAP-P1-BL-002 | P1 | Backlog | **REFRAME** | Superseded by a broader feature: searchable 'Show Fields' column chooser across ALL tables (real-Rally style). Priority-filter-only ask dropped unless re-requested. |
| GAP-P1-BL-004 | P1 | Backlog | **FIXED** | Sortable columns, rank preserved. Match-confirmed/passed. |
| GAP-P1-BL-005 | P1 | Backlog | **BA-WRONG** | Two distinct state fields + correct catalog. Controls (Schedule=six-box, Flow=dropdown) kept per PO; BA's swap request declined. Leave as-is. |
| GAP-P1-BL-006 | P1 | Backlog | **INTENTIONAL** | Fixed filter panel Accepted As-Is (Priority as the one approved add). No Manage-Filters (Future). |
| GAP-P1-BL-009 | P1 | Backlog | **FIXED** | No reload-revert (refetch corrects); only a minor optimistic-flash. [verified 07-25] |
| GAP-P1-BL-010 | P1 | Backlog | **INTENTIONAL** | Hover-drag rank handle — Fix-direction/UX approved. |
| GAP-P1-CREATE-002 | P1 | Work Item Create | **FIXED** | Quick-create now has Project dropdown driving Team (useProjectTeams). [verified] |
| GAP-P1-CREATE-006 | P1 | Work Item Create | **REAL** | Create owner inits '' (Unassigned); seed from current user. [verified 07-25] |
| GAP-P1-TASK-005 | P1 | Create Task modal | **REAL** | add-task modal lacks 'Create with details'. [verified 07-25] |
| GAP-P1-TASK-007 | P1 | Create Task modal | **REAL** | Task owner inits '' (Unassigned); seed from current user. [verified 07-25] |
| GAP-P1-USER-001 | P1 | User Management | **FIXED** | User list rebuilt Module 08 07-23: User·Email·Role·Status·Teams·LastLogin; Phone/Joined dropped. |
| GAP-P1-USER-002 | P1 | User Management | **FIXED** | Role+Status filters + metric strip added Module 08. (verify local search). |
| GAP-P1-USER-005 | P1 | User Management | **REAL** | Server join yields dup rows per workspace role-assignment; no dedup. [verified 07-25] |
| GAP-P1-USER-006 | P1 | User Management | **FIXED** | Invite opens InviteUserModal (email+role). [verified 07-25] |
| GAP-P1-WID-001 | P1 | Work Item Detail | **BEYOND-SPEC** | Extra Defects tab/LinkedItems/Comments beyond Phase-1 mockup. Keep-or-cut (prior audit 🟠). |
| GAP-P1-WID-007 | P1 | Work Item Detail | **FIXED** | Detail owner offers Unassigned + named users. [verified 07-25] |
| GAP-P2-IS-002 | P1 | Iteration Status | **REAL** | No loading guard; false 'No iterations' flash before query settles. [verified 07-25] |
| GAP-P0-PRJ-001 | P2 | Manage Projects | **CONTESTED** | 'Projects'/'Lead' vs 'Manage Projects'/'Owner'. Pending BA; label only. |
| GAP-P0-PRJ-003 | P2 | Manage Projects | **SEED** | Linked-team display depends on team seed/data. Not tested. |
| GAP-P0-PRJ-006 | P2 | Create Project | **FIXED** | Start Date persists (full create/edit round-trip). [verified 07-25] |
| GAP-P0-PRJ-008 | P2 | Manage Projects | **ACCEPTED** | Archived edit affordance — Accepted As-Is (backend rejects Save). |
| GAP-P0-PRJ-009 | P2 | Manage Projects | **ACCEPTED** | Restore w/o confirm — Accepted As-Is. |
| GAP-P0-PRJ-010 | P2 | Manage Projects | **OK** | Archive parity — DevInt Accepted (typed-key gate works). |
| GAP-P0-SHELL-004 | P2 | Global navigation | **REAL** | Track nav label 'Iteration' -> 'Iteration Status' (minor). [verified 07-25] |
| GAP-P0-SHELL-005 | P2 | Workspace context | **SEED** | Team Alpha/Beta 0 items = missing team-scoped seed data, not a code gap. |
| GAP-P0-SHELL-006 | P2 | Global Search | **DEFERRED** | Global Search non-functional — SHELL-FR-009 allows contract-only; functional search is Future. BA agrees. |
| GAP-P0-WS-001 | P2 | Workspace identity | **REAL** | Switcher uses 'Organization' (3 strings) vs 'Workspace' elsewhere. [verified 07-25] |
| GAP-P1-BL-001 | P2 | Backlog | **INVALIDATED** | BA self-invalidated: automation fill-empty artifact, not a real gap. Passed. |
| GAP-P1-CREATE-005 | P2 | Work Item Create | **BLOCKED** | Post-create visibility under filter — not testable (create was blocked at 07-19). |

## BA-WRONG (do NOT change code — reconcile the report)
- **GAP-P0-AUTH-001** — BA wants local email+password and calls SSO "out of scope". Entra SSO is the approved org model (prior audit 🟣, supersedes AUTH-FR-001..010). Update the Phase-0 Auth SRS to the SSO reality.
- **GAP-P1-WID-003** — BA wants multiple Releases per US/DE. SoT §2.3: "A Story/Defect has zero or **one** Release and zero or many Milestones." Rally's single-Release control is correct.

## REAL — the actionable align worklist (P0)
1. **Team mandatory + remove "No team"** — GAP-P1-WID-008 + GAP-P1-CREATE-003 + GAP-P1-CREATE-004. Root: shared `TeamSelectField` injects `{value:'', label:'No team'}`; create DTO `teamId` optional; no client required-validation; Detail Team clearable to null. Project-filtering already correct. SoT: Team required, linked to Project.
2. **New US/DE default Schedule=Flow=`Idea`** — GAP-P1-CREATE-008. `work-items.service.ts` create defaults `scheduleState='defined'`; SoT §2.4 = Idea.
3. **Task State label `In-Progress` (hyphen)** — GAP-P1-TASK-006. `entities/work-item/model/types.ts` simplified label set uses `'In Progress'` (space) on the Task Dashboard; SoT §3 = `In-Progress`.
4. *(deferred by decision)* **TIME-001** totals defensive re-derive — write-path already derives Estimate=ToDo+Actuals; only stale/seed rows differ. Skipped for now.

## Note on seed data
BA's WID-006 (state mismatch) and TIME-001 (10h≠7h) reproduce because **seed fixtures write scheduleState/flowState/estimateHours directly, bypassing the service invariants**. The live write paths are correct. Recommend a seed-hygiene pass so demo data obeys mirror + estimate rules.

## Second-pass verification (2026-07-25)
Ran a code-verification pass on the 18 previously-unverified gaps. Result: **7 FIXED, 11 REAL** (1 of the reals, BL-005, needs a PO decision — the two backlog state controls are swapped vs BA, both save correctly).

**FIXED (7):** SHELL-001, SHELL-003, WID-007, BL-009, USER-006, PRJ-002, PRJ-006.

**REAL (11) — align worklist (P1/P2):**
- CREATE-006 / TASK-007 — create owner should default to the authenticated user (currently Unassigned).
- TASK-005 — add-task modal needs 'Create with details'.
- SHELL-004 — Track nav label 'Iteration' -> 'Iteration Status'.
- WS-001 — switcher 'Organization' -> 'Workspace' (terminology).
- IS-002 — iteration-status loading guard (kill false empty-state flash).
- PRJ-004 — Project Name minimum 2 chars (DTO + FE).
- BL-002 — add Priority filter to Backlog.
- SHELL-002 — Portfolio dropdown + 'Release Planning' Phase-5 placeholder child.
- USER-005 — dedup member rows (server join emits one row per workspace role-assignment).
- PRJ-007 — Manage Projects actions menu -> portal/overflow-safe (bottom-row clip).
- BL-005 (PARTIAL, PO decision) — swap Schedule/Flow controls to BA layout (Flow=six-box, Schedule=dropdown).

## Post-merge status (2026-07-26)

**All P0 + P1/P2 REAL items CLOSED** (verified on `main`):
- **P0 batch — PR #149**: Team mandatory + no "No team" (CREATE-003/004, WID-008); default Schedule=Flow=`Idea` (CREATE-008); Task state `In-Progress` hyphen (TASK-006).
- **P1/P2 batch — PR #152**: CREATE-006 + TASK-007 (owner defaults to current user), TASK-005 (add-task create-with-details), SHELL-004 (`Iteration Status` nav), WS-001 (`Workspace` terminology), IS-002 (loading guard), PRJ-004 (name ≥2, DTO + FE), BL-002 (Backlog priority filter), SHELL-002 (Portfolio dropdown + Release Planning Phase-5 placeholder), USER-005 (member-row dedup).
- **PRJ-007 — PR #153**: Projects list refactored onto the shared toolbar / Show-Fields / checkbox-bulk pattern; the row-actions popover is gone (no more clip).
- **PRJ-001 — resolved (this pass)**: adopted BA terms — screen "Manage Projects", field "Owner".
- **WID-001 — decided KEEP**: the beyond-spec Work Item Detail tabs (Defects / Linked Items / Comments) stay (built, tested, real-Rally parity).
- **BL-005 — decided LEAVE AS-IS**: two state controls kept (Schedule=six-box, Flow=dropdown); both save correctly. BA swap declined.

**Seed redesign (this pass)** — addresses the WID-006 / TIME-001 seed-hygiene root cause + demo-data quality:
- Workspace renamed **ACME Corp → QNSC**.
- Seed split: `pnpm db:seed` = **clean dev baseline** (roles + QNSC workspace + SSO + one platform-admin, NO fixtures); `pnpm db:seed:test` = the **one-project** (NXP) full end-to-end fixture for E2E + manual testing. Dropped the 2nd project (MOB) + PBAC demo users (cross-project permission moves to a service test).
- Fixture already writes invariant-correct values (flow=schedule mirror, estimate=todo+actual), so **WID-006 + TIME-001 no longer reproduce** in demo data.

**E2E consolidation (DONE 2026-07-26)** — added `golden-journey.e2e.ts` (one coherent UI flow: create iteration → story into it → surfaces on Iteration Status + Backlog with iteration name → schedule-state transition persists → Release detail); removed a dead skipping test; renamed the redundant `ba-retest-flow` Vitest spec → `core-business-rules` and dropped its 4 duplicate rules (owned by the richer flow specs). Verified: Playwright 14/14 + core-business-rules 9/9 pass on a freshly-seeded QNSC DB.

**REMAINING worklist**
- **Docs-only reconciliation** (no code): **AUTH-001** (rewrite Phase-0 Auth SRS to Entra SSO reality), **WID-003** (SoT §2.3 = zero-or-one Release; reconcile BA's multi-Release ask), **WS-002** (workspace-name-editable now BA-approved — update SRS).
- **CREATE-005** — retest post-create visibility under an active filter (was BLOCKED at audit time; create now works).
- **TIME-001** (optional) — defensive total re-derive; deferred (write-path already derives; seed now correct).
- **USER-004** — 9 roles vs SoT 3; deferred to **Phase-4** Roles & Permissions.
