# Plan 0 — Discovery, Inventory and Scope Lock

## Goal

Create a complete, evidence-backed conversion baseline before any Figma mutation.

## Inputs

- `03_Mockup Design/src/app/App.tsx`, `components/`, `pages/`, `model.ts`, `styles/`
- `00_Documents/` and `04_Developement_tracking/`
- Target Figma file: `ttpggMpbPwggOZl6umowzC`

## Checklist

- [x] P0.a Inventory app shell, pages, role gates and all currently coded UI surfaces.
- [x] P0.b Classify each surface as foundation, component, pattern, approved screen or future/reference screen.
- [x] P0.c Audit reusable code components and identify duplicated local UI patterns.
- [x] P0.d Audit token/font evidence and hard-coded visual values.
- [x] P0.e Audit API-facing UI states: loading, empty, error, validation, permission and destructive actions.
- [x] P0.f Compare mockup scope with phase SRS/checklists; record risks/conflicts.
- [x] P0.g Run read-only Figma preflight.
- [x] P0.h User confirmed Plan 0 on 2026-07-21; accepted the recorded scope baseline.

## Required artifacts

- `UI_SCREEN_INVENTORY.md`
- `COMPONENT_AND_TOKEN_AUDIT.md`
- `UI_STATE_AND_BA_GAP.md`
- `SCOPE_AND_DECISION_LOG.md`
- `FIGMA_PREFLIGHT.md`

## Exit criteria

- Every coded UI surface has a final conversion classification.
- Component, screen and token migration order is explicit.
- Scope conflicts are either resolved or recorded as named decisions.
- Target Figma file has passed a read-only preflight.
- User confirms the decision log and `CONFIRM PLAN 0`.

## Gate

Do not create Figma pages, variables, styles or components until the Plan 0 gate is approved.
