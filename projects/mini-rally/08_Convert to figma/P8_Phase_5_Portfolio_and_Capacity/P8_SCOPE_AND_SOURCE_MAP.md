# P8 Scope and Source Map

## Authoritative Phase 5 result

Phase 5 is closed for BA/mockup scope and developer handoff. P8 converts that closed UX contract to Figma; it does not claim production persistence, APIs, server-side authorization, migrations or deployment are implemented.

| Included capability | Source code | Figma target | Notes |
|---|---|---|---|
| Portfolio Items list | `PortfolioPage.tsx` | `SCR-P8-01 Portfolio Items` | Type switch, search/filter, columns, sorting, bulk state and project/team scope. |
| Epic hierarchy and detail | `PortfolioPage.tsx` | `SCR-P8-02 Epic Detail` | Epic is Project-level, groups Features, has no Team/Release assignment. |
| Feature detail and children | `PortfolioPage.tsx` | `SCR-P8-03 Feature Detail` | Read-only rollups, details/children tabs, scoped release/milestone fields and archive behavior. |
| Create Portfolio Item | `NewEpicModal`, `NewFeatureModal` | `DIA-P8-01/02` | Project-scoped create dialogs, required fields and create-with-details branch. |
| Capacity Plan list and create | `CapacityPlanningPage.tsx` | `SCR-P8-04 Capacity Plans`, `DIA-P8-03` | Single Release, Feature-only plan; Draft/Published lifecycle. |
| Capacity plan Features | `CapacityPlanningPage.tsx` | `SCR-P8-05 Capacity Plan — Features` | Rank, assignment, allocation slices, cutline, progress/warnings and row actions. |
| Capacity plan Teams | `CapacityPlanningPage.tsx` | `SCR-P8-06 Capacity Plan — Teams by Total` | Team capacity rail, expandable rows, sort, feature attention and forecast action. |
| Allocation and forecast | `AllocateDialog`, `AddFeaturesModal`, `TeamPickerModal`, `CapacityForecastDialog` | `DIA-P8-04..07` | Add/allocate/remove plan-wide, manual vs feature estimate and forecast inputs. |
| Publish/read-only states | `CapacityPlanningPage.tsx` + P5 handoff | `SCR-P8-07 State overlays` | Draft manager, Published viewer and advisory mismatch disposition. |

## Existing Figma delta

- Existing `SCR-15 Portfolio (Future)` (`175:1713`) is reference-only and does not satisfy P5.1. P8 will supersede it after review.
- Capacity Planning has no approved dev-ready Figma screen today.
- Existing shared library, Data Table, Dialog, Form Field, Query Controls, Detail patterns and RBAC states remain the first reuse choice.

## Explicit exclusions

| Excluded surface | Disposition |
|---|---|
| Release Planning | Future backlog; no P8 Figma implementation. |
| Release Tracking | Removed from active Phase 5 scope. |
| Reports/dashboards/burnup trends | Future direction only; no P8 screen. |
| Multi-release / Plan of Plans | Out of MVP scope. |
| Theme/deeper Portfolio hierarchy | Out of MVP scope. |
| Configurable preliminary-estimate mapping | Deferred Settings > Project Management design slice. |
