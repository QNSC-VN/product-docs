# Plan 8 — Phase 5 Portfolio and Capacity

## Goal

Replace the existing lower-fidelity Portfolio future/reference frame with dev-handoff-ready native Figma coverage for the closed Phase 5 scope: Portfolio Items (`Epic → Feature`) and Capacity Planning.

## Scope lock

- Include P5.1 Portfolio Items and P5.2 Capacity Planning only.
- Use the Phase 5 developer handoff, SRS files, mockup code and test scenarios as source of truth.
- Do not create Release Planning, Release Tracking, Reports, multi-release, plan-of-plans, deeper hierarchy or Project Management estimate configuration.
- Preserve the current P0–P7 approved conversion; P8 is an additive delta and will explicitly supersede the old Portfolio future/reference frame when ready.

## Checklist

- [x] P8.0 Establish closed scope, source precedence and initial screen/component inventory.
- [x] P8.1 Reconcile P8-specific component gaps against the approved library; build and validate only the missing reusable components.
- [ ] P8.2 Convert Portfolio Items list, Epic/Feature detail states, hierarchy, progress and create/archive permission states. (List hierarchy and default Workspace Admin screen QA-passed; detail/dialog/permission states pending.)
- [ ] P8.3 Convert Capacity Plan list, Draft/Published plan detail, Features/Teams views, allocation and forecast dialogs, warnings and read-only states.
- [x] P8.4 Add BE/API-facing contracts, role/state annotations, prototypes and screen coverage mapping.
- [x] P8.5 Run structural/visual QA, update release notes and create the P8 dev handoff package.

## Required source order

1. `04_Developement_tracking/Phase 5/PHASE5_DEV_HANDOFF.md`
2. `01_Portfolio_Items/SRS.md` and `02_Capacity_Planning/SRS.md`
3. `02_Capacity_Planning/BUSINESS_FLOW_AND_UI_CATALOG.md` and `07_Test Business/specs/PHASE5_TEST_SCENARIOS.md`
4. `03_Mockup Design/src/app/pages/PortfolioPage.tsx` and `CapacityPlanningPage.tsx`
5. Approved Figma P0–P7 library and screens.

## Gate

Plan 8 was confirmed on 2026-07-29. The Phase 5 Portfolio and Capacity Planning Figma delta is complete at the Figma/BA/dev-handoff boundary; production implementation remains separately owned.
