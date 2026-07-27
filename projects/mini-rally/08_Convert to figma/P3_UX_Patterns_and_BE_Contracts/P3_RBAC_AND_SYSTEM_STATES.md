# Plan 3 — RBAC and System States

## Scope and authority

This document is the **design-side** contract for how permission decisions and server states surface in the UI. It does not invent business rules.

| Layer | Owner | Where it is decided |
|---|---|---|
| Which role may perform which action | BA | `04_Developement_tracking/Phase 4/02_Roles_Permissions/SRS.md` — BA-confirmed |
| What the UI renders for each permission outcome | This document + the Figma `RBAC Outcome` pattern | Plan 3 |
| Enforcement | Backend | `P4-RBAC-03` / `P4-RBAC-04`, both still **Pending** in the SRS |

> **Figma visibility is not security.** Every rule below describes user experience only. The backend must guard every route, action and field regardless of what the UI shows. This restates P1 rule 9 and SRS §3.3.

Plan 3 fills SRS task **`P4-RBAC-05` — Define frontend route/action/field gating**, which the SRS lists as Pending. It does not close `P4-RBAC-03`, `P4-RBAC-04` or `P4-RBAC-06`.

## The four permission outcomes

Defined by the BA in SRS §2 and §3.3. The Figma pattern is `RBAC` / `RBAC Outcome`.

| Code | State | UI behaviour | Figma representation |
|---|---|---|---|
| `E` | Enabled | Control is shown and actionable. | The component's normal Default/Hover states. |
| `R` | Read-only | Data is visible; no create/edit/delete control is rendered. | Value rendered as plain text via `Detail Field`, with no Text Input / Select / Button. |
| `D` | Disabled | Control is visible but inert. | The component's `State=Disabled` variant. |
| `H` | Hidden | Nothing renders. Direct URL access resolves to Access Denied or Not Found. | Node `visible = false`; the surface falls back to `System State` `Type=Forbidden` or `Type=Not Found`. |

### Selection rules (SRS §2, verbatim intent)

1. `View` permissions resolve to `E` for editable users or `R` for read-only users.
2. `Create`, `Edit` and `Delete` **must not** be represented as `R` — use `E`, `D` or `H`.
3. Use `D` only when the product deliberately wants to reveal that an action exists but is unavailable in the current role/context.
4. Use `H` for sensitive administrative, destructive or security-related actions: role matrix changes, user removal, project deletion.
5. Direct URL/API access must still be guarded when the UI state is `H`.

### Why `R` is not "a disabled input"

`R` means the mutation control is **absent**, not greyed out. A disabled Text Input still communicates "there is a field here you might edit"; read-only means the user is simply viewing data. Use `Detail Field` with a plain-text value, not `Text Input` `State=Disabled`. This distinction is the most common way an RBAC design goes wrong.

## Role baseline

Three technical roles only (SRS §2, §6 of `RECONCILED_SOURCE_OF_TRUTH.md`). `workspace_member`, `project_viewer` and `guest` are removed from the Phase 4 baseline.

| Code | Role | Scope |
|---|---|---|
| `WA` | `workspace_admin` | Full workspace administration across all projects and teams. |
| `PA` | `project_admin` | Full delivery access in **assigned managed** projects; read-only in every other project. |
| `PM` | `project_member` | Works only inside the assigned project and assigned teams. |

### Already demonstrated in Figma

`App Shell` / `TopNav` carries a `Role` variant axis proving the `H` outcome at navigation level:

| Role | Navigation items | Workspace settings gear |
|---|---|---|
| Workspace Admin | Home, Plan, Track, Quality, Portfolio, Reports | Visible (`E`) |
| Project Admin | Home, Plan, Track, Quality, Portfolio, Reports | **Hidden** (`H`) |
| Project Member | Home, Plan, Track | **Hidden** (`H`) |

Source for the gear rule: `model.ts` `can.viewAdmin = r === "Workspace Admin"`, consistent with SRS §3.1 ("Only `workspace_admin` manages company users, project membership, team membership and resource allocation").

Source for Project Member navigation: SRS §3.6 — "Project Member navigation contains Home, Backlog and Iteration Status only, plus personal Notifications."

## Pilot-surface gating (Backlog → Work Item Detail)

The D-003 pilot surfaces, resolved from SRS §3.1 and §4. Permission codes are the SRS's own.

| Surface + action | Permission code | WA | PA (assigned) | PA (other project) | PM |
|---|---|:--:|:--:|:--:|:--:|
| Backlog — view rows/search/filter/sort/page | `work_item:view` | E | E | R | E |
| Backlog — create US/DE | `work_item:create` | E | E | H | E |
| Backlog — edit fields / rank | `work_item:edit` | E | E | H | E |
| Backlog — delete work item | `work_item:delete` | E | E | H | E |
| Backlog — assign to Iteration | `iterations:assign_work_item` | E | E | H | E |
| Backlog — assign to Release | `releases:edit` | E | E | H | **H** |
| Work Item Detail — view fields/history | `work_item:view` | E | E | R | E |
| Work Item Detail — edit fields/notes/relations/watchers | `work_item:edit` | E | E | H | E |
| Work Item Detail — create/edit/delete child Tasks | `work_item:edit` | E | E | H | E |
| Work Item Detail — delete work item | `work_item:delete` | E | E | H | E |

Two rows carry business weight and are worth calling out to dev:

- **Release assignment is `H` for Project Member.** SRS §3.1: "Cannot assign a Work Item to a Release." The Backlog table's Release cell must render as text for PM, not a Select.
- **Project Admin outside assigned projects is `R`, not `D`.** SRS §3.2: "in every other Project allow read-only viewing and block all mutations." The row still renders; every mutation control is absent.

Governance rows (User, Team, Project lifecycle, Workspace Settings, Role Matrix, Audit) default to `H` for PA and PM and are **not** system-locked — Workspace Admin may override them through the matrix (SRS §2, "Governance override decision"). Only Auth, App Shell, Personal and Notification rows are locked at `E` for all roles.

## Access Denied vs Not Found

From SRS §3.4. Figma pattern: `System States` / `System State`.

| Scenario | Outcome |
|---|---|
| Direct URL to an existing but inaccessible project/team/item | `Access Denied` — unless the surface is sensitive enough to mask existence |
| Direct URL to a missing record | `Not Found` |
| Sensitive or security-relevant record existence | Prefer `Not Found`, to avoid confirming the record exists |
| List / search / dropdown data | Return and display only records the user can access |
| Notification target after access is revoked | Safe Access Denied or Not Found, without exposing restricted details |

### Safety rules the design must honour

- Neither state may display the restricted item's **title, owner, project name, team name or any other metadata**.
- Search must not reveal inaccessible records.
- Project and team selectors must not reveal inaccessible projects/teams. Project Member selectors must not expose unassigned Teams or the `All Teams` option.
- Both states provide a safe `Back to Backlog` action.

The Figma `System State` `Type=Forbidden` and `Type=Not Found` variants are deliberately written with generic copy only. **Do not** parameterise them with the record's name.

## Effective time of permission changes

From SRS §3.5. This matters for design because it determines whether the UI must react live.

| Change | When it takes effect | UI consequence |
|---|---|---|
| Role changed | Next login | No live re-render required. |
| Project/team membership changed | Next login | No live re-render required. |
| Role matrix saved | Next login | Matrix returns to read-only display mode after save. |
| User deactivated / removed from company | **Next page refresh** | On refresh, do not restore company data — route to sign-in or Access Denied. |

Phase 4 does not require the UI to force-close the current page at the moment an admin saves a deactivation.

## System states (non-permission)

Figma pattern: `System States` page.

| State | Component | Recovery action | Notes |
|---|---|---|---|
| Loading | `Table Skeleton` / `Skeleton Row` | — | Structure-preserving skeleton, not a spinner, so layout does not jump. |
| Empty | `System State` `Type=Empty` | Clear filters | Must distinguish "no records exist" from "no records match your filters" in the description. |
| Error | `System State` `Type=Error` | Retry | Filters and query state are preserved across the retry. |
| Forbidden | `System State` `Type=Forbidden` | Back to Backlog | See safety rules above. |
| Not Found | `System State` `Type=Not Found` | Back to Backlog | Also used to mask existence of sensitive records. |
| Destructive confirmation | `Dialog` `Type=Destructive Confirmation` | Cancel / confirm | Confirm button starts disabled until the typed name matches, mirroring `ConfirmRemoveUserAccess`. |

## Discrepancy found during Plan 3 — needs BA/dev awareness

`03_Mockup Design/src/app/model.ts` exports a `PERMISSIONS_MATRIX` of 14 rows with simple role arrays. It **does not match** the SRS matrix in three ways:

1. **Granularity.** The mockup array has one row per coarse action ("Edit Work Items"); the SRS requires one independent permission code per Screen + Action row, explicitly forbidding a generic `*:manage` permission.
2. **No E/R/D/H.** The mockup expresses permission as a boolean role list; the SRS requires a four-valued state per role cell.
3. **Content drift.** The mockup grants "View Reports" and "Export Reports" to WA and PA, but the SRS defers Reports entirely to Phase 5 with RBAC to be revisited. It also grants "Delete Work Items" to all three roles without the project-scope qualifier the SRS attaches.

`model.ts` is mock data — under the Plan 0 source-precedence rule it is "example content only; never an authority for API behaviour/security" (rank 4). The SRS matrix governs. This is recorded so nobody implements the mockup array as if it were the permission model. It extends P0 findings G-001 and G-005.

## What Plan 3 does not decide

- Backend enforcement design (`P4-RBAC-03`, `P4-RBAC-04`) — owned by dev.
- Verification scenarios (`P4-RBAC-06`) — owned by QA, though the Figma `RBAC Outcome` pattern gives them the expected UI per state.
- Project-level audit visibility for `project_admin` — SRS defers this to P4.3.
- RBAC for Portfolio, Reports and top-level Release Tracking — SRS defers all three to Phase 5.
