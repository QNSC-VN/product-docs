# Plan 5 — Screen-Level Contracts

Same template and rule as `P4_SCREEN_CONTRACTS.md`: UI requirements, not an API specification. Endpoint names are placeholder capabilities pending API-owner sign-off (P0 finding G-007). Contracts continue the numbering from `P3_UI_API_CONTRACTS.md` (1–5) and `P4_SCREEN_CONTRACTS.md` (6–9).

## Contract 10 — Iteration Status (`SCR-05`)

| Field | Value |
|---|---|
| Context required | `projectId`, `teamId`, selected `iterationId`. Iteration and Status selector chips are local UI state in the mockup, not confirmed as URL-persisted — same open question as Backlog's query params (Contract 2). |
| Read model | Selected iteration's metadata (name, date range, schedule state); 5 summary metrics (Planned Velocity, Iteration End countdown, Accepted %, Defects count, Tasks count); the item list itself — `#`/`ID`/`Type`/`Name`/`Schedule State`/`Iteration`/`Blocked`/`Plan Est`/`Task Est`/`To Do`/`Owner`, scoped to the selected iteration. |
| Enumerations | `Type` → `Type Badge`; `Schedule State` → `Status Badge` (shared Story/Defect enum per `P3_UI_API_CONTRACTS.md`'s enumeration adapter); `Blocked` is a boolean, not an enum — rendered as an `Icon/AlertTriangle` + "Yes" in danger colour when true, an em dash when false. |
| Actions | Add Item (opens the same create flow as Backlog); row-level edit of name/schedule state when editable; reorder is **not** exposed on this screen in the mockup (no rank drag/move-up-down control, unlike Backlog) — Rank (`#`) here is read-only, display-only ordering. |
| Mutation states | Follows the shared query/mutation state machines in `P3_UI_API_CONTRACTS.md`. No screen-specific deviation found. |
| Authorization | `editable = !readOnly && can.manageBacklog(role)` in the mockup — `can.manageBacklog` is unconditionally `true` for every role at the code level, so the **only** effective gate is the `readOnly` prop (project-scope access via `ROLE_SCOPE`, RBAC SRS §3.2), not role differentiation within a project a user can already reach. Flag to BA: confirm whether Iteration Status editing should differ between Project Admin and Project Member within the same accessible project, since the mockup does not currently express that distinction. |
| Navigation | None beyond the iteration/status selectors described above. |
| Audit | Not specified in RBAC SRS §3.7 (only role/membership events are named); flag to BA whether schedule-state changes belong in the audit trail. |

## Contract 11 — Team Status (`SCR-06`)

| Field | Value |
|---|---|
| Context required | `projectId`, `teamId`, selected `iterationId` (prev/next stepper, not a dropdown — navigates sequentially through `ITERATIONS_DATA`). |
| Read model | Per-owner groups: task count, capacity (hours), estimate/todo/actuals sums, completion %. Each group expands to its member tasks: task id/name, parent work item (type dot + id + title + schedule-state chip), release, task-level schedule state, estimate/todo/actuals, owner. A totals row sums capacity/estimate/todo/actuals in hours across all owners for the iteration. |
| Enumerations | Task-level `State` is a **distinct three-value set** (`Defined`/`In-Progress`/`Completed`) — narrower than the shared Story/Defect Schedule State enum (which also has `Idea`/`Accepted`/`Release`). This is a genuine sub-enum for tasks, not a display-label remap; do not reuse `Status Badge`'s full variant set for this column, and do not add `Accepted`/`Release` options to a task-state control. |
| Actions | Toggle group expand/collapse (client-only); edit capacity (per-owner, numeric input); edit task name and schedule state (when editable); every row navigates to the parent work item's full detail on click. No create/delete actions on this screen. |
| Mutation states | Capacity edits and task-name/state edits are in-place, no dedicated `submitting` state observed in the mockup (optimistic, synchronous local state update) — flag to BA/API-owner whether capacity should be a debounced-save field or an explicit-save form field once wired to a real API. |
| Authorization | `editable = !readOnly && can.edit(role)` — `can.edit` is unconditionally `true` for every role, so again the only effective gate is the project-scope `readOnly` flag. Same BA flag as Contract 10: confirm whether capacity-setting specifically should be Workspace-Admin/Project-Admin-only rather than open to any role that can reach the project. |
| Navigation | Iteration stepper is local UI state; not confirmed as URL-persisted. |
| Audit | Not specified; capacity changes affect planning math shown to the whole team, so flag to BA whether they warrant an audit trail entry. |

## Contract 12 — Quality / Defects (`SCR-07`)

| Field | Value |
|---|---|
| Context required | `projectId`. Not team-scoped in the mockup (no Team context selector shown for this screen per `layout.tsx`'s `showSaved`/context-bar config). |
| Read model | Defect list filtered to `type === "Defect"` for the current project: Rank, ID, Name, User Story (linked story ID or em dash), Severity, Priority, State (defect-specific lifecycle), Flow State (shared Schedule State enum), Fixed In Build, Iteration, Submitted By, Owner. Search matches against id/title/user-story/state/flow-state/iteration/owner/submitted-by. |
| Enumerations | **Three separate enums coexist on one row** — do not conflate them: (1) `Severity` (`None`/`Critical`/`Major Problem`/`Minor Problem`/`Trivial`) → new `Severity Badge`, a defect-only concept unrelated to `Priority Badge`; (2) `Priority` (`None`/`Urgent`/`High`/`Normal`/`Low`) → reuses `Defect Priority Chip` from P5.a, itself a display-label mapping over the shared Critical/High/Medium/Low `PriorityType` (Q-11); (3) `State` (`Submitted`/`Open`/`Fixed`/`Closed`/`Closed Declined`) — a defect-specific lifecycle, distinct from (4) `Flow State`, which is the shared Story/Defect Schedule State enum reused via `Status Badge`. Four visually similar but semantically distinct fields on one row; confirm with BA that `State` and `Flow State` are genuinely intended to be tracked independently (the mockup keeps them as separate local state maps with no derivation rule between them) rather than one deriving from the other. |
| Actions | Log Defect (create); inline edit of name, severity, priority, state, flow state, owner when editable; bulk actions (Assign Owner/Set State/Set Build/Link Story/Delete) shown in a selection toolbar once rows are checked — same `Bulk Action Bar` pattern as Backlog, not a new component. |
| Mutation states | Follows the shared mutation state machine (`P3_UI_API_CONTRACTS.md`). Severity/priority/state edits are local-state-only in the mockup (no persistence signal modeled) — flag to BA/API-owner for the real save contract, especially whether `Priority` edits here should also patch the underlying work item's canonical `priority` field (the mockup's `updatePriority` does exactly this via `DEFECT_PRIORITY_TO_LEGACY`) or are meant to be defect-view-only. |
| Authorization | `editable = !readOnly && can.createDefects(role)` — **this is the one screen in Plan 5 where role actually differentiates**: `can.createDefects` returns `false` for Project Member, `true` for Workspace Admin and Project Admin. So Project Member sees this screen in a genuine `R` (read-only, no mutation controls) state regardless of project-scope access, not merely due to `readOnly`. This matches the RBAC SRS's general pattern of Project Member having reduced write scope compared to PA/WA. |
| Navigation | Row click opens the shared `Detail Panel` (docked), "open full" navigates to the full-page Work Item Detail — same pattern as Backlog's pilot (Contract 1/`P3_PILOT_VALIDATION.md`). |
| Audit | Not specified in RBAC SRS §3.7. Given defects have their own lifecycle independent of general work-item audit, flag to BA whether defect state/severity/priority changes need their own audit entries. |

## Open questions added by P5

These extend the Q-01…Q-11 list in `P3_UI_API_CONTRACTS.md` / `P4_SCREEN_CONTRACTS.md`.

| ID | Question | Why it matters |
|---|---|---|
| Q-12 | Should Iteration Status / Team Status editing differentiate Project Admin from Project Member within a project both can already reach? | The mockup's `can.manageBacklog`/`can.edit` are unconditionally `true` for every role — the only observed gate is project-scope `readOnly`. RBAC SRS should confirm whether this is the intended final behaviour or a mockup simplification. |
| Q-13 | Is `ReleasesPage.tsx` (`case "releases"`) meant to be wired into navigation in a future phase, or is it superseded dead code left over from before the `IterationsPage` Releases-tab consolidation? | It is fully coded (own metric strip, expandable rows, 12-column table) but has zero reachable nav entry in `NAV_ITEMS`. Resolved for this pass as Tier B/reference-only under D-002's existing precedent (same treatment as `TeamBoardPage`/`PortfolioPage`), but a BA/PM decision would let a future plan build it for real if intended. |
| Q-14 | Should Quality's defect-specific `State` (Submitted/Open/Fixed/Closed/Closed Declined) derive from or constrain `Flow State` (the shared Schedule State enum), or are they genuinely independent? | The mockup tracks them as two unrelated local state maps with no derivation rule. Getting this wrong either duplicates status tracking or silently drops one of the two fields once a real API is wired up. |

## Coverage note

Contracts 1–5 (Backlog, Work Item Detail, Create Work Item, Destructive delete, App Shell) are in `P3_UI_API_CONTRACTS.md`. Contracts 6–9 (Login, Access states, Home, Manage Projects) are in `P4_SCREEN_CONTRACTS.md`. Contracts 10–12 above cover every screen Plan 5 converted. `SCR-04 Timeboxes — Iterations` (P5.b) reuses Backlog's list/query/mutation contract shape with no screen-specific deviation found, so it is not repeated here.
