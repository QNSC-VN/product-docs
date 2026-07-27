# Plan 0 — UI Screen Inventory

## Method and source of truth

Inventory read from `03_Mockup Design/src/app/App.tsx`, `components/`, `pages/`, `model.ts`, `styles/` and the phase SRS/checklists under `04_Developement_tracking`.

The current mockup is a React/Vite SPA with local state and mock data. A `✅ UI` status below means the visual/interaction exists in the mockup; it does **not** mean that a backend contract or persistence exists.

## App-level surfaces

| ID | Surface | Source | Figma classification | Notes |
|---|---|---|---|---|
| SYS-01 | Authentication → app shell transition | `App.tsx`, `LoginPage.tsx` | Flow + shell state | App has no URL router; route design must be specified in handoff. |
| SYS-02 | Top navigation and hierarchy selector | `components/layout.tsx` | `AppShell/TopNav`, `WorkspaceProjectTeamSelector` | Depends on current role, workspace/project/team context. |
| SYS-03 | Context bar and breadcrumbs | `components/layout.tsx` | `ContextBar`, `Breadcrumbs`, contextual selector pattern | Visible rule changes by page. |
| SYS-04 | Role simulation and access guard | `App.tsx`, `model.ts`, `AccessStatePage.tsx` | RBAC pattern + access-state screens | Mockup roles: Workspace Admin, Project Admin, Project Member. |
| SYS-05 | Item detail opening/minimizing | `App.tsx`, `DetailPanel`, `WorkItemDetailPage` | Detail drawer + full-detail flow | Important prototype and UI/API contract flow. |

## Screen inventory

| ID | Mockup source | BA phase/domain | Primary Figma target | Current UI behavior | Conversion status |
|---|---|---|---|---|---|
| SCR-00 | `LoginPage.tsx` | P0 Authentication | Login and auth feedback flow | Controlled form, invalid credential, simulated loading; forgot-password is placeholder. | In scope |
| SCR-01 | `HomePage.tsx` | P0 workspace overview | Dashboard pattern | Summary, My Work, activity and health rely on mock/static data. | In scope |
| SCR-01A | `ProjectsPage.tsx` | P0 Project + P1 teams/users | Manage projects workspace pattern | Project/team/user CRUD-style UI, tabs, search and confirmation are local state. | In scope |
| SCR-02 | `BacklogPage.tsx` | P1 base + P2 backlog enhancement | Backlog list/table pattern | Filters, sort, resize, select/bulk toolbar, create, detail handoff. Several actions are visual/local only. | In scope — recommended pilot |
| SCR-03 | `WorkItemDetailPage.tsx` | P1 detail/tasks/activity | Work-item full detail pattern | Detail, task and revision tabs; rich fields, comments/attachments/relation sections require BE state contracts. | In scope — pilot companion |
| SCR-04 | `IterationsPage.tsx` | P2 Iteration Management | Iteration list/detail/create pattern | Largest page; list, state, release/milestone linkage and forms. | In scope |
| SCR-05 | `IterationStatusPage.tsx` | P2 Iteration Status | Tracking list/board pattern | Select, list/board, columns, selection and quick-create. | In scope |
| SCR-06 | `TeamStatusPage.tsx` | P3 Team Status | Capacity/team-status pattern | Resizable dense task table, capacity and task state. | In scope |
| SCR-07 | `ReleasesPage.tsx` | P3 Release Management | Release management pattern | Release list, expansion and summaries; creation/detail coverage is partial. | In scope |
| SCR-08 | `QualityPage.tsx` | P3 Quality/Defect | Defect management pattern | Summary, defect table, filters and create/bulk affordances. | In scope |
| SCR-09 | `NotificationsPage.tsx` | P4 Notifications | Notifications list/popup pattern | Tabs/read state are local; deep-link behavior needs final contract. | In scope |
| SCR-10 | `SettingsPage.tsx` | P4 Roles, settings and audit | Admin/settings/RBAC pattern | Project/workspace settings, users, role matrix, workflow, labels, audit. | In scope |
| SCR-11 | `AccessStatePage.tsx` | P4 RBAC system state | Access denied/not-found state | Used by role/scope guards and missing item flow. | In scope |
| FUT-01 | `TeamBoardPage.tsx` | Future backlog Team Board | Team board pattern | Working UI exists but BA scope is not P0–P4; do not label as dev-ready without confirmation. | Needs decision |
| FUT-02 | `PortfolioPage.tsx` | Future backlog / Phase 5 | Portfolio hierarchy pattern | Initiative hierarchy has static/local behavior. | Needs decision |
| FUT-03 | `ReportsPage.tsx` | Future backlog / Phase 5 | Reporting dashboard pattern | Charts/widgets use static mock data. | Needs decision |
| FUT-04 | `ReleasePlanningPlaceholder()` in `App.tsx` | Future backlog / Phase 5 | Placeholder/info state only | Explicitly says Phase 5 scope is unconfirmed; not a functional screen. | Needs decision |

## Required component/pattern dependencies by screen

| Screen family | Must reuse after conversion |
|---|---|
| Login/access | FormField, Input, Button, Alert, Empty/Access state |
| Shell/dashboard | TopNav, ContextBar, Breadcrumbs, Context selector, Metric card, Data table, Avatar |
| Backlog/iteration/quality/team status | DataTable, sortable/resizable header, row action, filter bar, bulk toolbar, status/type/priority badges, detail drawer, empty/error/loading state |
| Work item detail | Page header, tabs, field layout, rich-text placeholder, task table, activity log, relation/attachment rows, confirmation modal |
| Admin/settings/projects | Tabs, segmented control, table, modal, form field, role badge/matrix, destructive confirmation, audit row |
| Notifications | Notification row, unread/read state, filter tabs, deep-link action |
| Future portfolio/reports/board | Hierarchy row, progress, chart/card widget, kanban column/card, WIP indicator |

## Findings that affect conversion order

1. `BacklogPage` + `WorkItemDetailPage` are the highest-value pilot: they exercise table, filter, bulk actions, item state, drawer/full detail, form and RBAC.
2. `IterationsPage` (1,030 lines), `ProjectsPage` (888), `IterationStatusPage` (754) and `SettingsPage` (606) contain many local subcomponents. They should be decomposed into shared patterns before screen recreation.
3. The four `FUT-*` surfaces must be converted as clearly labelled **reference/future** material unless you extend scope beyond the approved P0–P4 baseline.

