# Plan 2 — Component Catalog

Every component in the Mini Rally Figma library (`ttpggMpbPwggOZl6umowzC`), mapped to its mockup source and the screens that will consume it. Node IDs are current as of the last entry in `P2_FIGMA_STATE_LEDGER.json` — re-verify with `get_metadata` before relying on an ID from an older snapshot.

## P2.a — Actions

| Component | Figma node | Variants / properties | Mockup source | Consuming screens |
|---|---:|---|---|---|
| Button | `15:20` | 27: `Size`(S/M/L) × `Style`(Primary/Secondary/Destructive) × `State`(Default/Hover/Disabled); `Label` text, `Show Icon` boolean, `Icon` instance-swap | `components/shared.tsx`, all form/modal primary actions; `Destructive` from `SettingsPage.tsx` `ConfirmRemoveUserAccess` | Every screen with a primary/secondary/destructive action — Login, Projects, Backlog, Settings, Dialog footers |
| Icon Button | `20:101` | 27: `Size` × `Style`(Primary/Secondary/Ghost) × `State`; `Icon` instance-swap | `components/shared.tsx` (row icon actions), `components/layout.tsx` (nav icons) | Table row actions, Drawer header actions, TopNav |
| Link Action | `21:76` | 6: `Size`(S/M) × `State`; `Label`, `Show Icon`, `Icon` instance-swap | Inline text links across list/detail pages | Backlog, Work Item Detail, Notifications |
| Overflow action | reuse `Icon Button` + `Icon/MoreHorizontal` (`23:6`) | — | Row/card overflow menus | Backlog, Quality, Team Status row actions |

## P2.b — Forms

| Component | Figma node | Variants / properties | Mockup source | Consuming screens |
|---|---:|---|---|---|
| Text Input | `24:79` | 10: `Size`(S/M) × `State`(Default/Focused/Filled/Error/Disabled); `Value` text | `shared.tsx` form fields, `ProjectsPage.tsx`, `SettingsPage.tsx` | New Item modal, Projects, Settings, Login |
| Form Field | `36:70` | 3: `State`(Default/Error/Disabled); `Label`, `Supporting Text` text, `Required` boolean; nests a Text Input instance | Every labelled field across forms | Login, Projects, Settings, New Item modal |
| Textarea | `39:17` | 5: `State`(Default/Focused/Filled/Error/Disabled); `Value` text | `ProjectsPage.tsx` description fields, `IterationsPage.tsx` rich-text placeholder | Projects (project/team description), Iterations |
| Select / Combobox | `40:31` | 10: `Size`(S/M) × `State`; `Value` text, `Icon` instance-swap (ChevronDown default) | `shared.tsx` team/owner selects | New Item modal, Projects, Settings |
| Checkbox | `41:91` | 6: `Checked`(F/T) × `State`(Default/Focused/Disabled) | `BacklogPage.tsx`, `QualityPage.tsx`, `IterationStatusPage.tsx`, `LoginPage.tsx` row/bulk selection | Backlog, Quality, Iteration Status, Login (remember me) |
| Radio | `45:88` | 6: `Checked` × `State` | Net-new (no direct mockup precedent; mutually-exclusive option groups implied by settings/workflow config) | Settings (future use), any single-choice group |
| Toggle | `46:20` | 6: `On`(F/T) × `State`(Default/Focused/Disabled) | `SettingsPage.tsx` `Toggle` component | Settings (feature/permission switches) |

## P2.c — Feedback / identity

| Component | Figma node | Variants / properties | Mockup source | Consuming screens |
|---|---:|---|---|---|
| Avatar | `52:69` | 4: `Size`(XS/S/M/L); `Initials` text (fill is per-instance override, not a token) | `shared.tsx` `Avatar` | Backlog rows, Work Item Detail owner, TopNav user menu |
| Type Badge | `50:15` | 4: `Type`(Story/Defect/Task/Feature), label baked per variant | `shared.tsx` `TYPE_CFG`/`TypeBadge` | Backlog, Work Item Detail, Drawer eyebrow |
| Status Badge | `52:25` | 6: `Status`(Idea/Defined/In-Progress/Completed/Accepted/Release), label baked per variant | `shared.tsx` `STATUS_CFG`/`StatusBadge` | Backlog, Iterations, Iteration Status, Work Item Detail |
| Priority Badge | `52:43` | 4: `Priority`(Critical/High/Medium/Low), label baked per variant | `shared.tsx` `PRI_CFG`/`PriorityBadge` | Backlog, Quality, Work Item Detail |
| Role Badge | `52:55` | 3: `Role`(Workspace Admin/Project Admin/Project Member), label baked per variant | `shared.tsx` `RoleBadge` | Settings user list, TopNav user menu |
| Progress | `53:86` | 3: `Tier`(Low/Mid/Complete) demo of threshold colour; `Value/Max` text; fill bar resized per-instance for arbitrary % | `shared.tsx` `MiniProgress` | Work Item Detail tasks, Backlog row progress |
| Alert | `55:79` | 4: `Type`(Error/Success/Warning/Info); `Title`/`Description` text, icon baked per variant | `LoginPage.tsx` `role="alert"` banner (Error only evidenced; other 3 types extend the pattern) | Login, any inline form/page feedback |
| Toast | `57:122` | 4: `Type`(Error/Success/Warning/Info); `Title`/`Description` text, icon baked per variant, `Elevation/Overlay`, close affordance | Not evidenced in mockup; reuses Alert's colour/icon language on an overlay surface | Any screen confirming a just-completed action |
| Tooltip | `58:29` | 2: `Position`(Top/Bottom); `Label` text | Not evidenced in mockup (native `title=` attrs only); dark-surface tokens reused from navigation | Icon-only buttons needing an accessible name/hint |

## P2.d — Overlays

| Component | Figma node | Variants / properties | Mockup source | Consuming screens |
|---|---:|---|---|---|
| Dialog | `65:20` | 2: `Type`(Standard/Destructive Confirmation); Standard has a `Content` Slot + Button-instance footer; Destructive Confirmation is a fixed composition | `shared.tsx` `NewItemModal` (Standard), `SettingsPage.tsx` `ConfirmRemoveUserAccess` (Destructive) | New Item modal, Settings (remove user access), any destructive delete flow |
| Menu Item | `66:129` | 2: `State`(Default/Hover); `Show Icon`, `Icon`, `Label` shared properties | `components/layout.tsx` menu buttons | Dropdown Menu (below), any custom menu |
| Dropdown / Popover | `67:21` (`Dropdown Menu`) | Composed of Menu Item instances + optional section-label wrapper; `Elevation/Overlay` | `components/layout.tsx` "My Views", "Switch Role", workspace/user menus | TopNav workspace/user menus, Backlog "My Views" filter menu |
| Drawer | `68:43` | Header (Type Badge + id + title + Expand/Close Icon Button instances) + `Content` Slot | `shared.tsx` `DetailPanel` | Backlog/Iteration/Quality/Team Status item detail drawer |

## Tokens and icons added beyond Plan 1

- 54 `color/badge/{type|status|priority|role}/*` tokens (P2.c), sourced exactly from `shared.tsx` config objects — kept separate from generic `Color` semantics per decision D-005 (domain-specific mappings, not one shared badge primitive).
- 8 `color/feedback/{success|warning|danger|info}/{bg|border}` tokens (P2.c), for Alert/Toast — danger sourced from `LoginPage.tsx`'s alert banner, the other three reuse established badge accent hues.
- `red/800` Primitive (P2.d), derived from `red/700` using the same darkening ratio already observed between `navy/700`→`navy/800`, for the Destructive button's hover state.
- Icons: `Icon/ChevronDown` (`40:2`), `Icon/Check` (`41:2`), `Icon/AlertCircle` (`54:2`), `Icon/InfoCircle` (`54:6`), `Icon/AlertTriangle` (`62:2`) — all built to match the existing `ChevronRight` construction (stroke bound to `color/icon/default`, placeholder frame fill `visible:false`).

## Explicitly out of scope for P2

- Data Table, filter bar, bulk toolbar, TopNav/ContextBar/Breadcrumbs, tabs, segmented control, audit row, notification row, kanban column/card, chart/card widgets, hierarchy row — these are screen-composition patterns belonging to Plan 3 (UX patterns/BE contracts) and Plans 4–6 (screens), not Plan 2's component library.
- A full "Sectioned" Dropdown variant matching the workspace-switcher header (icon square + title + subtitle + badge) — documented as composable from existing atoms rather than baked as a second Dropdown variant, to keep P2 scoped to the component library rather than screen assembly. Flag if a dedicated variant turns out to be needed once Plan 4+ screens are built.
