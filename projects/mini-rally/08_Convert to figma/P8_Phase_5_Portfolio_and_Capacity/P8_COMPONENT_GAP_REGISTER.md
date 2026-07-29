# P8 Component Gap Register

P8 must reuse approved P0–P7 components first. Create a new component only after validating that the current library cannot express the source API or token binding.

| Candidate | Source evidence | Initial P8 decision | Validation needed before Figma creation |
|---|---|---|---|
| Portfolio State Badge | 11 Portfolio lifecycle states in `PortfolioPage.tsx` | **Created** native reusable component set `217:36`, 11 `State` variants | 44 semantic P5 tokens in `Color`; structural and screenshot QA passed. |
| Portfolio Item Type Badge | Epic and Feature type labels | **Extended** existing `Type Badge` `50:15` with `Type=Epic` `217:43` | Existing Type Badge is text-only; documentation now includes the P5 source. |
| Estimate Size Badge | `No Entry`, `XS`, `S`, `M`, `L`, `XL` | **Created** reusable component set `219:15`, 6 `Estimate` variants | `No Entry` intentionally stays muted text; numeric point/count mapping is explicitly deferred. |
| Feature/Epic rollup meter | Four read-only progress formulas | Reusable P8 pattern, not a per-screen drawing | Bind status/warning colors and provide value/progress documentation. |
| Capacity Plan Status Badge | Draft/Published | **Created** semantic component set `220:7`, 2 `Status` variants | Draft/Published tokens alias the equivalent Portfolio color tokens; screenshot QA passed. |
| Capacity composite progress + warning | Complete/Rollup/Estimated/Capacity with exceed warnings | New P8 pattern if no existing progress component supports multiple measures | Document inputs and warning conditions for BE handoff. |
| Estimate source indicator | Allocated > Refined > Preliminary > None | New atom/pattern only if it recurs beyond one dialog | Confirm reuse in Features and allocation dialog. |
| Allocation/rank row actions | Move, allocate, remove/unassign | Reuse Icon Button, Menu/Popover, Dialog and Data Table | No new component expected. |

## Screen composition expectation

The Portfolio and Capacity screens must use approved App Shell, Data Table, Query Controls, Detail Pattern, Form Field, Dialog, Button, Icon Button, Tooltip, Empty State and RBAC/System State patterns as instances. P8 must not author page-local copies of those components.

## P8.1 completion record

- Reused without modification: App Shell, Data Table, Query Controls, Detail Patterns, Dialog, Form Field, Button, Icon Button, Alert, RBAC/System States and generic Progress.
- Created only where semantics differ: Portfolio State Badge, Estimate Size Badge, Capacity Plan Status Badge.
- Extended `Type Badge` with `Epic`; the prior four variants remain intact.
- Token additions: 44 Portfolio lifecycle colors, 3 Epic type colors, 3 Estimate colors and 6 Capacity Plan alias colors.
- QA: structural variant APIs and visual screenshots passed on 2026-07-29. P8.2 may now assemble Portfolio screens from these assets.
