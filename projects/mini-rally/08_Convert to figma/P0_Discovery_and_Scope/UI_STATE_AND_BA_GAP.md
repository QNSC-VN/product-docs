# Plan 0 — UI State and BA Gap Audit

## Status convention

- `Present / local`: mockup can display or toggle the state using local state/mock data.
- `Visual only`: UI affordance exists but does not perform the business operation.
- `Missing`: no reliable UI state or contract is visible in the current mockup.

## Cross-cutting UI/BE state audit

| State/contract | Current evidence | Status | Required Figma/handoff outcome |
|---|---|---|---|
| Initial loading | Login has simulated submit loading; data pages start from static arrays | Partial | Standard page/table/detail skeleton and loading rules. |
| Empty result | `EmptyState` exists; some page-specific empty messaging exists | Partial | Reusable empty pattern with title, explanation and permitted next action. |
| API/network error | No API/query layer in mockup | Missing | Inline error, page error, retry and non-retryable error pattern. |
| Form validation | Login and selected forms have local validation | Partial | Field error, summary, submit blocked/submitting/server-error rules. |
| Save/mutation success | Local state updates some entities | Partial | Toast/inline confirmation and refetch/optimistic rule by mutation. |
| Authorization | Role UI gating plus access-denied page | Partial | Backend permission outcome → hidden/disabled/read-only/403 mapping. |
| Not found | `AccessStatePage` used for missing notification target | Partial | 404 entity/page behavior and safe back navigation. |
| Destructive action | Project/settings confirmations exist | Partial | Standard confirm dialog, impact text, typed confirmation when high risk, error handling. |
| Table query state | Local filter/sort/paging/resize in multiple screens | Partial | One query model: URL/query params, loading/empty/error/reset and saved-view behavior. |
| Reorder/drag-drop | Some visual affordances; complete BE flow not present | Partial/Missing | Explicit optimistic/revert/conflict design before dev implementation. |
| Deep link | Full detail is app local state; notifications link only partly | Partial | Route and entity-ID contract, permission/not-found outcomes. |
| Audit/activity | Static/mock activity logs | Visual only | Event list schema, pagination, actor/time/action/entity representation. |

## Important BA/UI discrepancies or risks

| ID | Area | Observation | Recommended conversion decision |
|---|---|---|---|
| G-001 | Screen traceability | The traceability document describes a prior role model in places, while current code exposes Workspace Admin / Project Admin / Project Member. | Treat current Phase 4 RBAC SRS as business source; record older mappings as historical. |
| G-002 | Future screens | Team Board, Portfolio, Reports and Release Planning have code, but BA files mark important portions as future/backlog/Phase 5. | Convert as labelled reference screens only unless scope is explicitly expanded. |
| G-003 | Backlog action semantics | UI includes bulk actions, resize/sort/filter and create, but mockup cannot prove persistence/optimistic/error rules. | Create `BacklogQuery` and `BacklogMutation` contracts before handoff. |
| G-004 | Status semantics | Work-item, defect, release, iteration and milestone state labels overlap but do not share one domain model. | Use domain-specific Figma wrappers and a documented enum adapter. |
| G-005 | RBAC security boundary | UI role switch and hide/read-only gates are demo behavior only. | Annotate UI response to authoritative BE permission; never infer security from Figma visibility. |
| G-006 | Responsive behavior | The mockup targets dense desktop data screens; responsive rules are not documented consistently. | Plan 3 must define desktop baseline, min widths, horizontal overflow and narrow-layout behavior. |
| G-007 | Mock data | `model.ts` is a rich static data source but not API schema. | Use it only for content examples and field discovery; derive API contracts from SRS/production API owners. |

## Required UI/API contract template

Every Figma pattern/screen that consumes server data must receive a companion contract in Plan 3 onward:

```text
Pattern/screen:
Context required: workspaceId, projectId, teamId, role/permission
Read model: endpoint/query key + fields consumed by UI
Enumerations: BE value → display label → semantic token
Actions: user event → mutation payload → success behavior
Query states: initial loading, refetching, empty, error, retry
Mutation states: idle, validation error, submitting, success, server error/conflict
Authorization: hidden vs disabled vs read-only vs 403/404
Navigation: route params/deep link and return behavior
Audit/telemetry: event that must be visible or recorded
```

## Plan 0 recommendation

Approve `Backlog → Work Item Detail → Create/Edit/permission/error` as the first end-to-end pilot. It is representative of the integration challenge and gives Plan 2–3 a practical acceptance target.

