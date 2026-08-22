# Plan 0 — Component and Token Audit

## Evidence snapshot

| Evidence | Result | Implication |
|---|---:|---|
| Page modules | 16 page files + 1 Phase 5 placeholder | Screen count is manageable, but each includes embedded UI primitives. |
| Explicit shared components | `layout.tsx`: 4 exported UI elements; `shared.tsx`: 10+ exported UI elements | A reusable base exists but is incomplete. |
| Inline `style={...}` occurrences | 1,256 | Visual values are distributed through JSX and cannot be assumed to be design tokens. |
| Unique hex colours found in source | 144 | Token normalization is mandatory before library creation. |
| Local `useState` uses | 216 | Mockup behavior is rich, but must be separated into UI states versus real API behavior. |
| Font | Inter (`fonts.css`, `App.tsx`) | Figma must use Inter as the verified source font for v1. |

## Existing reusable UI — map to Figma components

| Code source | Existing UI | Figma component proposal | Required API/state cleanup |
|---|---|---|---|
| `shared.tsx` | Avatar | `Avatar` / `AvatarGroup` | Size, image/initials/fallback and status indicator. |
| `shared.tsx` | TypeBadge | `WorkItemTypeBadge` | Bind semantic type colours, not hard-coded configuration. |
| `shared.tsx` | StatusBadge | `StatusBadge` | Separate schedule/flow/iteration/release semantics; do not reuse blindly. |
| `shared.tsx` | PriorityBadge | `PriorityBadge` | Align generic priority with Defect priority labels/enum. |
| `shared.tsx` | MiniProgress | `ProgressBar` | Value, label, semantic state, indeterminate/loading. |
| `shared.tsx` | RoleBadge | `RoleBadge` | Role and permission state must remain separate concepts. |
| `shared.tsx` | DetailPanel | `WorkItemDetailDrawer` | Loading/not-found/forbidden, sections and actions must be explicit. |
| `shared.tsx` | NewItemModal | `WorkItemCreateDialog` | FormField validation, type constraints, submit/loading/error/success states. |
| `shared.tsx` | EmptyState | `EmptyState` | Icon, title, description, action, contextual illustration. |
| `shared.tsx` | SectionCard | `SectionCard` | Header/action/body slots, surface/elevation token. |
| `layout.tsx` | TopNav | `AppShell/TopNav` | Page active state, nav/menu, scope selector, global action slots. |
| `layout.tsx` | CtxSelect | `ContextSelector` | Selected, disabled, permission restricted, loading options. |
| `layout.tsx` | SavedViewsDrop | `SavedViewMenu` | Query state, save/reset permissions and empty state. |
| `layout.tsx` | ContextBar | `ContextBar/Breadcrumbs` | Responsive overflow and page-specific selector rules. |

## High-value local components to extract as Figma patterns

| Seen in | Candidate | Reason |
|---|---|---|
| Backlog, Iteration Status, Quality, Team Status | `DataTable`, `TableHeaderCell`, `ResizableHeader`, `RowSelection`, `BulkActionToolbar` | Four screens repeat dense tables with sort/filter/resize/select behavior. |
| Projects, Iterations, Work Item, Team Board | `ModalHeader`, `ModalFooter`, `FormField`, `ConfirmDialog`, `SelectionDialog` | Several near-duplicate modals/forms should share layout and states. |
| Backlog, quality, iteration status | `FilterBar`, `SearchInput`, `SelectFilter`, `SavedViewMenu` | Data query controls need one UI/query contract. |
| Work Item, Iterations, Settings | `Tabs`, `DetailPageHeader`, `PropertyPanel`, `ActivityLog` | Repeated detail-information architecture. |
| Team Board and Iteration board | `KanbanBoard`, `KanbanColumn`, `WorkItemCard`, `WipLimit` | Board behavior is a reusable pattern, even if Team Board remains future scope. |
| Settings and Projects | `AdminTable`, `StatusDot`, `PermissionMatrix`, `AuditLogRow` | Necessary to distinguish data row, permission cell and destructive management action. |

## Design-token audit

### Observed token-like values

The most repeated values form a likely starting point: dark text `#1a2234`, secondary text `#5c6478`, muted text `#8c94a6`, primary `#1d3f73`, primary interactive `#2558a6`, canvas `#f0f2f5`, surface `#ffffff`, and common borders `#e2e6eb`/`#dde2ea`.

These are **candidates**, not final Figma tokens. Plan 1 must derive a complete primitive and semantic mapping from all screens and apply approved names.

### Proposed Figma taxonomy for Plan 1

```text
Primitives/
  neutral/*, navy/*, blue/*, green/*, amber/*, red/*, purple/*
Color/
  color/bg/{canvas,surface,subtle,selected}
  color/text/{primary,secondary,muted,inverse,link,danger}
  color/border/{default,subtle,focus,danger}
  color/action/{primary,secondary,danger}
  color/status/{info,warning,success,danger,neutral}
Spacing/  0, 1, 2, 3, 4, 5, 6, 8, 10, 12
Radius/   none, sm, md, lg, full
Typography/ body, label, caption, heading, mono
Elevation/ 0, 1, 2, overlay
```

## Component-design risks to resolve before Figma creation

1. `StatusBadge`, release status and iteration/milestone states use visually similar but semantically different enums. Build a generic badge visual primitive plus domain-specific wrapper components; do not create one giant `Status` variant set.
2. Defect priorities use `Low/Normal/High/Urgent/None`, while generic `PriorityType` uses `Low/Medium/High/Critical`. The data/label mapping needs an approved contract.
3. Current components mix data mapping, behavior and visual styling. Figma components should represent visual API and state; the future FE needs a separate adapter for BE enums/data.
4. Icons are sourced from `lucide-react`. Figma should use a single icon component with instance swap or imported SVG assets; never create an icon variant per glyph.

