# Plan 3 — UX Patterns and BE Contracts

## Goal

Normalize data-heavy/RBAC UX patterns and attach a usable UI/API contract before screen conversion.

## Checklist

- [x] P3.a Build App Shell, TopNav, breadcrumbs and project/team context pattern from approved components.
  - [x] 11 nav icons imported from lucide SVG; `color/nav/surface` and `color/bg/accent-subtle` tokens added.
  - [x] TopNav Item (3 states), Context Select (2 states), Breadcrumb Item (3 levels) component sets.
  - [x] TopNav with a `Role` axis (Workspace Admin/Project Admin/Project Member) demonstrating the RBAC `H` state.
  - [x] Context Bar and App Shell (with a real Content slot); visual/structural QA passed.
- [x] P3.b Build DataTable, sortable/resizable header, row action, selection and bulk-action patterns.
  - [x] Table Header Cell (3 sort states), Table Row (4 states with a Cells slot), Bulk Action Bar, Table Pagination.
  - [x] Composed `Data Table` component with a Rows slot, plus a populated example proving reuse of P2 badge/avatar/checkbox components.
  - [x] Fixed the `createSlot()` opaque-fill bug and the Select resize defect found during this work.
- [x] P3.c Build search/filter/saved-view/pagination query-control pattern.
  - [x] Search Field (3 states), Filter Chip, Filter Bar, List Toolbar; Saved Views reuses the P2 Dropdown Menu; pagination delivered with the Data Table in P3.b.
- [x] P3.d Build work-item drawer/detail, activity, relation and progress patterns.
  - [x] Detail Field (label + value slot), Tag, Activity Row; Progress reused from P2.c.
  - [x] Work Item Drawer example composing all of them into the P2 Drawer's Content slot; fixed the Drawer's hug-height/clipping defect found here.
- [x] P3.e Build system states: skeleton, empty, API error/retry, forbidden, not-found and destructive confirmation.
  - [x] System State component set (Empty/Error/Forbidden/Not Found) with recovery actions; Skeleton Row and Table Skeleton; destructive confirmation reuses the P2.d Dialog variant.
  - [x] Built ahead of P3.d because every other pattern must express these states.
- [x] P3.f Define RBAC pattern: hidden, disabled, read-only and denied outcomes.
  - [x] `RBAC Outcome` component set (E/R/D/H) with live example controls per state.
  - [x] `P3_RBAC_AND_SYSTEM_STATES.md` written: role baseline, pilot-surface gating table, Access Denied vs Not Found safety rules, effective-time rules, and the mockup-vs-SRS permission discrepancy.
- [x] P3.g Write one UI/API contract per pattern: context, read model, enums, actions, query/mutation states, authorization and navigation.
  - [x] `P3_UI_API_CONTRACTS.md`: shared query/mutation state machines, the authoritative enum adapter and lifecycle rules, five per-pattern contracts, and eight open questions raised to BA/API owners.
  - [x] Framed as UI requirements rather than API specification, per P0 finding G-007 and the RECONCILED_SOURCE_OF_TRUTH scope note.
- [x] P3.h Prototype Backlog → Work Item Detail → create/edit/error/permission pilot.
  - [x] Five frames on the `Pilot — Backlog to Detail` page: default, drawer open, create dialog, query error, Project Member permission view.
  - [x] Every frame composed from pattern instances only; fixed the Dialog slot-fill defect found while assembling frame 3.
- [x] P3.i Validate screen/pattern reuse, prototype and contract completeness.
  - [x] `P3_PILOT_VALIDATION.md` written: all three exit criteria evidenced, reuse audit showing zero locally authored nodes across the five pilot frames, five defects found and fixed, four findings raised to BA/dev.

## Deliverables

- Figma pages for data/navigation/feedback patterns and App Shell.
- `P3_UI_API_CONTRACTS.md`, `P3_RBAC_AND_SYSTEM_STATES.md`, `P3_PILOT_VALIDATION.md`.

## Exit criteria

- Developers can see what data a component consumes and how it behaves for every server state.
- Table/filter/modal/status are reusable patterns, not copied screen fragments.
- Pilot flow has visual, state and contract evidence.

## Gate

Set tracker to `AWAITING PLAN 3 CONFIRMATION`; stop until `CONFIRM PLAN 3`.

