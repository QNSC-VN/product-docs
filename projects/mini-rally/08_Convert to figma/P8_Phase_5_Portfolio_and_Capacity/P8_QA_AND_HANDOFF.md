# P8 QA and Developer Handoff

## Figma coverage

| ID | Figma node | Coverage |
|---|---:|---|
| `SCR-P8-01` | `222:1830` | Portfolio Item list; Epic -> Feature hierarchy, filter/action surface and role note |
| `SCR-P8-02` | `229:268` | Editable Epic detail; four read-only leaf rollups and archive dependency rule |
| `SCR-P8-03` | `232:400` | Archived Feature history/read-only state |
| `DIA-P8-01/02` | `233:521` | New Epic and New Feature dialogs |
| `SCR-P8-04` | `234:529` | Capacity Plan list with Draft/Published statuses |
| `SCR-P8-05` | `236:644` | Draft Features/Teams planning surface |
| `SCR-P8-06` | `240:762` | Published/read-only Capacity Plan state |
| `DIA-P8-04/07` | `242:880` | Allocation and forecast rules |

## Reuse / component QA

- Portfolio lifecycle: `Portfolio State Badge` `217:36`, 11 variants.
- Estimate categories: `Estimate Size Badge` `219:15`, 6 variants.
- Capacity lifecycle: `Capacity Plan Status Badge` `220:7`, Draft/Published.
- Existing `Type Badge` extended with Epic `217:43`; existing Type variants preserved.
- Reused App Shell, Button, Data Table, Progress, Form/feedback and RBAC primitives. No P8 screen uses a raster screenshot as its editable UI source.

## Developer implementation sequence

1. Implement scoped read APIs for Portfolio Items and Capacity Plans.
2. Implement Portfolio create/update/archive commands plus server-side Epic-child dependency validation.
3. Implement Capacity Draft mutation commands, allocations and forecast with audit fields.
4. Implement explicit Publish/Revert transitions and enforce immutable Published state.
5. Bind Figma variant/state annotations to API results; test role and scope rules before visual polish.

## Production boundary

P8 is Figma/BA/dev-handoff ready. It does not assert production-ready persistence, API authorization, audit storage, concurrency handling, migration, deployment or server-side test evidence.
