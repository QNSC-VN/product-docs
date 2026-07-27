# Conversion Progress — Mini Rally Mockup to Figma

> Cập nhật file này ở cuối mỗi plan trước khi gửi review. Không bắt đầu plan tiếp theo nếu plan hiện tại chưa được bạn xác nhận.

## Current status

- Current plan: `PLAN 7 — QA, Dev Mode and handoff` — **PROJECT COMPLETE**
- Active plan folder: `P7_Future_QA_and_Handoff`
- Status: `APPROVED — ALL 8 PLANS (0–7) CONFIRMED`
- Figma file: `Mini Rally Figma` (`ttpggMpbPwggOZl6umowzC`) — read-only preflight passed
- Scope version: `LOCKED` (project complete; reopen a specific plan folder only for a requested change, per `AI_EXECUTION_WORKFLOW.md` rule 3)
- Figma write status: All 8 plans (0 through 7) approved. Full conversion delivered — see `P7_Future_QA_and_Handoff/RELEASE_NOTES.md` for the complete summary.
- Full open-question ledger (Q-01 through Q-16) and every known gap is consolidated in `P7_Future_QA_and_Handoff/RELEASE_NOTES.md` — this is the authoritative single list going forward.
- Last updated: `2026-07-21` (Plan 7 confirmed same day — conversion project complete)

## Gate log

| Plan | Status | Review package | User decision | Notes |
|---|---|---|---|---|
| Plan 0 | Approved | `P0_Discovery_and_Scope/UI_SCREEN_INVENTORY.md`, `COMPONENT_AND_TOKEN_AUDIT.md`, `UI_STATE_AND_BA_GAP.md`, `SCOPE_AND_DECISION_LOG.md`, `FIGMA_PREFLIGHT.md` | Confirmed 2026-07-21 | Inventory, scope lock and Figma preflight |
| Plan 1 | Approved | `P1_Design_Rules_and_Foundations/PLAN.md`, `P1_DESIGN_RULES.md`, `P1_TOKEN_MAPPING.md`, `P1_VALIDATION.md` | Confirmed 2026-07-21 | Rules and foundations |
| Plan 2 | Approved | `P2_Core_Component_Library/PLAN.md`, `P2_PROGRESS.md`, `P2_FIGMA_STATE_LEDGER.json`, `P2_COMPONENT_CATALOG.md`, `P2_VALIDATION.md` | Confirmed 2026-07-21 | Full core component library (23 components across actions, forms, feedback/identity, overlays) built and validated |
| Plan 3 | Approved | `P3_UX_Patterns_and_BE_Contracts/PLAN.md`, `P3_PROGRESS.md`, `P3_UI_API_CONTRACTS.md`, `P3_RBAC_AND_SYSTEM_STATES.md`, `P3_PILOT_VALIDATION.md` | Confirmed 2026-07-21 | App Shell, Data Table, query controls, detail patterns, system states, RBAC, contracts and the Backlog→Detail pilot |
| Plan 4 | Approved | `P4_Screens_Phase_0_1/PLAN.md`, `P4_PROGRESS.md`, `P4_SCREEN_ANNOTATIONS.md`, `P4_SCREEN_CONTRACTS.md` | Confirmed 2026-07-21 | Login, Access states, Home, Manage Projects (WA view), full-page Work Item Detail |
| Plan 5 | Approved | `P5_Screens_Phase_2_3/PLAN.md`, `P5_PROGRESS.md`, `P5_SCREEN_CONTRACTS.md` | Confirmed 2026-07-21 | Backlog, Timeboxes/Iterations, Iteration Status, Team Status, Quality/Defects; new `Severity Badge` component; Release Management resolved as Tier B/reference (Q-13) |
| Plan 6 | Approved | `P6_Screens_Phase_4/PLAN.md`, `P6_PROGRESS.md`, `P6_SCREEN_CONTRACTS.md` | Confirmed 2026-07-21 | Notifications, Roles & Permissions, Workspace Settings, Teams, User Management, Audit Log; new `Notification Card`, `Icon/Hash`, `Permission State Chip` components; `Dialog` extended with `Require Typed Name`; Workflow Status/Labels resolved as SRS-deferred (out of scope) |
| Plan 7 | **Approved — final plan** | `P7_Future_QA_and_Handoff/PLAN.md`, `P7_PROGRESS.md`, `P7_ACCESSIBILITY_AND_RESPONSIVE_AUDIT.md`, `P7_DEV_MODE_GUIDE.md`, `P7_CODE_CONNECT_BACKLOG.md`, `P7_DEV_HANDOFF_WALKTHROUGH.md`, `RELEASE_NOTES.md` | Confirmed 2026-07-21 | Future/reference screens (Team Board, Portfolio, Reports, Release Planning); naming/token/a11y audits; fixed missing `font/size/base/lg/xl` tokens; Dev Mode + Code Connect backlog docs; fixed a real gap in the Plan 3 pilot (Contract 5 had no Figma evidence). **Conversion workflow complete.** |

## Coverage status legend

- `Not inventoried`: chưa đọc/ghi nhận từ mockup.
- `In scope`: đã khóa cho conversion v1.
- `Converted`: đã có Figma screen/component đã QA.
- `Out of scope`: không chuyển trong v1, có lý do.
- `Needs decision`: mâu thuẫn BA/mockup/Figma hoặc thiếu business rule.

## Screen coverage matrix

| Source mockup page | Phase / domain | Status | Figma page/link | Notes |
|---|---|---|---|---|
| LoginPage | Phase 0 | **Converted** | `Screens — Phase 0–1` / `SCR-00 Login — Default` `106:31`, `— Invalid credentials` `109:31` | UI parity only — Contract 6 in `P4_SCREEN_CONTRACTS.md`; no BE session contract |
| AccessStatePage | Phase 4/RBAC | **Converted** | `Screens — Phase 0–1` / `SCR-11 Access Denied` `109:140`, `Not Found` `109:481` | Contract 7; safety rules from RBAC SRS §3.4 preserved |
| HomePage | Phase 0 | **Converted** | `Screens — Phase 0–1` / `SCR-01 Home — Workspace Admin` `111:526` | UI parity only — Contract 8 flags the read model as an open gap (Q-09) |
| ProjectsPage | Phase 0 + Phase 1 | **Converted (WA view only)** | `Screens — Phase 0–1` / `SCR-01A Manage Projects` `117:920` | Contract 9; PA/PM read-only variant not yet built (see P4 cross-screen finding) |
| WorkItemDetailPage | Phase 1 | **Converted** | `Screens — Phase 0–1` / `SCR-03 — Details` `127:1244`, `— Tasks` `129:1516`, `— Revision History` `128:1431` | Full page, distinct from the P3 pilot's docked Drawer; Contract 3 in `P3_UI_API_CONTRACTS.md` covers it |
| BacklogPage | Phase 1 + Phase 2 | **Converted (pilot only)** | `Pilot — Backlog to Detail` `96:12` | Pilot proved the pattern; P4.f found the Defect-priority enum gap (Q-11) not yet resolved on this screen |
| IterationsPage | Phase 2 | **Converted** | `Screens — Phase 2–3` / `SCR-04 Timeboxes — Iterations` `134:751` | Type segmented control (Iterations/Releases/Milestones) also covers Release Management's reachable list view — see P5_PROGRESS.md finding |
| IterationStatusPage | Phase 2 | **Converted** | `Screens — Phase 2–3` / `SCR-05 Iteration Status` `136:952` | Contract 10 in `P5_SCREEN_CONTRACTS.md` |
| TeamBoardPage | Future backlog | **Converted (Future/Reference)** | `Screens — Phase 4` / `SCR-16 Team Board (Future)` `176:1930` | Lower fidelity than Phase 0-4 screens by design (D-002); metric strip + 3 Kanban columns with WIP-limit chips |
| TeamStatusPage | Phase 3 | **Converted** | `Screens — Phase 2–3` / `SCR-06 Team Status` `140:5157` | Contract 11 |
| QualityPage | Phase 3 | **Converted** | `Screens — Phase 2–3` / `SCR-07 Quality — Defects` `147:1533` | Contract 12; new `Severity Badge` component |
| PortfolioPage | Future backlog / Phase 5 | **Converted (Future/Reference)** | `Screens — Phase 4` / `SCR-15 Portfolio (Future)` `175:1713` | Lower fidelity by design (D-002); also the screen with the `SavedViewsDrop` import bug found and fixed in P5.g/P6 (`ebc431b`) |
| ReleasesPage | Phase 3 | Out of scope (Tier B, reference only) | — | `case "releases"` renders a real, polished screen (own metric strip, expandable release rows, its own column set) but has **no reachable nav entry** — `NAV_ITEMS` in `layout.tsx` only wires Portfolio → "Release Planning (Phase 5)" (the placeholder) and Plan → Timeboxes (which covers Releases via `IterationsPage`'s Type control, confirmed in P5.b). Same orphaned-but-coded situation as `TeamBoardPage`/`PortfolioPage`; resolved the same way under D-002 (Tier B, reference only, not dev-ready) rather than re-litigated as a new open question. |
| ReportsPage | Future backlog / Phase 5 | **Converted (Future/Reference)** | `Screens — Phase 4` / `SCR-17 Reports (Future)` `177:2156` | Lower fidelity by design (D-002); charts simplified, not pixel-exact `recharts` reproduction |
| ReleasePlanningPlaceholder | Future backlog / Phase 5 | **Converted (Future/Reference)** | `Screens — Phase 4` / `SCR-14 Release Planning (Placeholder, Future)` `174:1737` | Near-verbatim match to `App.tsx`'s placeholder text |
| NotificationsPage | Phase 4 | **Converted** | `Screens — Phase 4` / `SCR-08 Notifications` `158:23` (grouped with popup `160:423`) | Contract 13; new `Notification Card` component, new `Icon/Hash`, reused pre-existing `Icon/Flag` (found and fixed a duplicate-icon mistake, see P6_PROGRESS.md) |
| SettingsPage — Roles & Permissions | Phase 4 | **Converted** | `Screens — Phase 4` / `SCR-09` `163:397` | Contract 14; new `Permission State Chip` component; 12 of 75 matrix rows shown (representative sample, not exhaustive) |
| SettingsPage — Workspace Settings | Phase 4 | **Converted** | `Screens — Phase 4` / `SCR-10` `166:825` | Contract 15 |
| SettingsPage — Teams | Phase 4 | **Converted** | `Screens — Phase 4` / `SCR-11` `167:987` | Contract 15; destructive actions use `Dialog` `Type=Destructive Confirmation` |
| SettingsPage — User Management | Phase 4 | **Converted** | `Screens — Phase 4` / `SCR-12` `168:1191` | Contract 15; `Dialog` extended with `Require Typed Name` property (P6.d fix) for Remove User Access |
| SettingsPage — Workflow Status / Labels | Phase 4 | Out of scope | — | SRS-confirmed deferral to Future Backlog (§5/§6 of Settings & Audit SRS) — not built, not an open question |
| SettingsPage — Audit Log | Phase 4 | **Converted** | `Screens — Phase 4` / `SCR-13` `169:1422` | Contract 17 |

## Decision log

| ID | Plan | Decision / question | Status | Owner | Resolution |
|---|---|---|---|---|---|
| D-001 | P0 | Chọn Figma file đích hoặc tạo Figma file mới | Resolved | User | Mini Rally Figma; read-only preflight passed |
| D-002 | P0 | Convert future-coded screens as reference only | Resolved | User | Accepted via `CONFIRM PLAN 0`: include Tier B in Figma marked `Future / reference only`, not dev-ready |
| D-003 | P0 | Pilot integration flow | Resolved | User | Accepted via `CONFIRM PLAN 0`: Backlog → Work Item Detail → Create/Edit/error/permission. Drives P3.h |
| D-004 | P0 | Use Inter as source font for v1 | Resolved | User | Accepted via `CONFIRM PLAN 0`: Inter, as already bound in the P1 Typography collection |
| D-005 | P0 | Keep domain-specific status mappings over shared badge primitive | Resolved | User | Accepted via `CONFIRM PLAN 0`; implemented in P2.c as separate Type/Status/Priority/Role badge families |
| D-006 | P0 | Responsive scope | Resolved | User | Accepted via `CONFIRM PLAN 0`: desktop-first; document min widths/overflow/narrow-layout rather than redesign mobile. Drives the P3 responsive rules answering G-006 |

> `CONFIRM PLAN 0` (2026-07-21) explicitly accepted all six recommendations per the review request in `P0_Discovery_and_Scope/SCOPE_AND_DECISION_LOG.md`. These rows were left as `Open` by a bookkeeping oversight and were reconciled at the start of Plan 3.

## Artifact index

| Artifact | Created in plan | Status |
|---|---|---|
| `README.md` | Setup | Complete |
| `CONVERSION_PROGRESS.md` | Setup | Complete |
| `P0_Discovery_and_Scope/UI_SCREEN_INVENTORY.md` | P0 | Review ready |
| `P0_Discovery_and_Scope/COMPONENT_AND_TOKEN_AUDIT.md` | P0 | Review ready |
| `P0_Discovery_and_Scope/UI_STATE_AND_BA_GAP.md` | P0 | Review ready |
| `P0_Discovery_and_Scope/SCOPE_AND_DECISION_LOG.md` | P0 | Review ready |
| `P0_Discovery_and_Scope/FIGMA_PREFLIGHT.md` | P0 | Review ready |
| `P1_Design_Rules_and_Foundations/PLAN.md`, `P1_DESIGN_RULES.md`, `P1_TOKEN_MAPPING.md`, `P1_VALIDATION.md` | P1 | Approved |
| `P2_Core_Component_Library/PLAN.md`, `P2_PROGRESS.md`, `P2_FIGMA_STATE_LEDGER.json` | P2 | Review ready |
| `P2_Core_Component_Library/P2_COMPONENT_CATALOG.md` | P2 | Review ready |
| `P2_Core_Component_Library/P2_VALIDATION.md` | P2 | Review ready |
| `P3_UX_Patterns_and_BE_Contracts/PLAN.md`, `P3_PROGRESS.md` | P3 | Review ready |
| `P3_UX_Patterns_and_BE_Contracts/P3_UI_API_CONTRACTS.md` | P3 | Review ready |
| `P3_UX_Patterns_and_BE_Contracts/P3_RBAC_AND_SYSTEM_STATES.md` | P3 | Review ready |
| `P3_UX_Patterns_and_BE_Contracts/P3_PILOT_VALIDATION.md` | P3 | Review ready |
