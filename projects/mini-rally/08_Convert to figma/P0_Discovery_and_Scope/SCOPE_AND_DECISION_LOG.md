# Plan 0 — Scope Lock and Decision Log

## Proposed v1 scope

### Conversion commitment

The requested conversion should cover **every UI surface currently coded in `03_Mockup Design`**. Each one will have an explicit final status: `Converted`, `Reference/future`, `Out of scope by decision`, or `Needs decision`.

### Delivery tiers

| Tier | Content | Figma treatment | Dev-handoff label |
|---|---|---|---|
| A — Approved P0–P4 | Login, shell, home, projects, backlog, work-item detail, iterations, iteration status, team status, releases, quality, notifications, settings, access states | Full component-instance screen + flow + API/UI contract | `Integration-ready after implementation review` |
| B — Existing future code | Team Board, Portfolio, Reports, Release Planning placeholder | Convert to preserve existing UI, with prominent future/reference annotation | `Not approved for production implementation` unless scope is expanded |
| C — Component/foundation | Tokens, typography, icons, inputs, overlays, data, navigation, feedback and accessibility states | Published component library + usage docs | `Reusable implementation source` |

## Source-precedence rule

| Rank | Source | What it decides |
|---:|---|---|
| 1 | Per-feature SRS and phase tracking/checklist | Business scope, field meaning, permission rule, acceptance behavior |
| 2 | Current mockup runtime/code | Existing visual language, interaction reference and complete screen inventory |
| 3 | Approved Figma library/screens | Future UX/UI source of truth after this conversion |
| 4 | Mock data | Example content only; never an authority for API behavior/security |

## Migration order

1. Plan 1: foundations/rules — no screen recreation.
2. Plan 2: core UI components and variants.
3. Plan 3: app shell, data/navigation/RBAC patterns and API/UI contracts.
4. Plan 4: Tier A foundational screens plus Plan 0–1 flows.
5. Plan 5: Tier A Phase 2–3 flows.
6. Plan 6: Tier A Phase 4 governance flows.
7. Plan 7: Tier B future/reference screens, then final QA/Code Connect/handoff. The master plan is updated so its screen conversion sections remain governed by this tiering.

> Note: the original master plan grouped final QA after Phase 4. Tier B conversion must still happen before the final coverage matrix is closed, because the user requested coverage of all code currently in the mockup.

## Decisions requiring confirmation at Plan 0 gate

| ID | Decision | Recommendation | Your choice |
|---|---|---|---|
| D-001 | Figma destination | Create/select one dedicated Mini Rally Design System + Product UI file; do not reuse an unrelated file. | **Accepted** — `Mini Rally Figma` (`ttpggMpbPwggOZl6umowzC`) |
| D-002 | Future-coded screens | Include Tier B in Figma, clearly marked `Future / reference only`; do not call them dev-ready. | **Accepted** |
| D-003 | Pilot flow | Backlog → Work Item Detail → Create/Edit/error/permission. | **Accepted** — drives P3.h |
| D-004 | Font | Use Inter as current mockup source font for v1. | **Accepted** |
| D-005 | Status mapping | Treat work item, defect, iteration, release and milestone statuses as separate domain mappings over shared visual primitives. | **Accepted** — implemented in P2.c |
| D-006 | Responsive scope | Desktop-first data application; document minimum widths, overflow and narrow-layout rules rather than redesigning mobile screens in v1. | **Accepted** — drives P3 responsive rules |

## Plan 0 completion checklist

- [x] P0.a Source code inventory.
- [x] P0.b Screen inventory including coded future surfaces.
- [x] P0.c Component/pattern audit.
- [x] P0.d Token and font evidence audit.
- [x] P0.e UI/BE state audit.
- [x] P0.f BA/mockup conflict and risk log.
- [x] P0.g Proposed scope, tiers and pilot order.
- [x] User confirms D-001 through D-006 and Plan 0 gate.

## Gate outcome

`CONFIRM PLAN 0` received 2026-07-21, which per the review request below accepted all six recommendations as written. No decision was changed.

