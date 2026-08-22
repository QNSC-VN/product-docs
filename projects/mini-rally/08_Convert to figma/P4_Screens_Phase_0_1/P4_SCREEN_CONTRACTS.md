# Plan 4 — Screen-Level Contracts

Contracts for the screens P4 converted that `P3_UI_API_CONTRACTS.md` does not cover (that document scoped itself to the Backlog/Work Item Detail pilot). Same template, same rule: these are UI requirements, not an API specification — endpoint names are placeholder capabilities pending API-owner sign-off, per P0 finding G-007.

## Contract 6 — Login

| Field | Value |
|---|---|
| Context required | None (pre-session). |
| Read model | None — the form only needs its own field state. |
| Actions | Sign in (create session). |
| Mutation states | `idle` → `submitting` (button reads "Signing in…", disabled) → `success` (navigate to Home) or `server-error` (inline `Alert Type=Error` above the fields; field values are preserved, matching the mockup exactly). There is no field-level `validation-error` state distinct from the server error in the current mockup — empty-field submission and wrong-credential submission produce the same inline alert. |
| Authorization | `auth:sign_in` fixed `E` for all roles (RBAC SRS system baseline). |
| Navigation | Successful sign-in routes to Home. No deep-link return-URL behaviour is evidenced in the mockup — flag to BA if "return to the page I was trying to reach" is required. |
| Audit | Sign-in should be audit-visible per general security practice, though the RBAC SRS's audit event list (SRS §3.7) does not explicitly name it — only role/membership mutations are listed. Confirm with BA whether auth events belong in the same audit log. |

## Contract 7 — Access Denied / Not Found

| Field | Value |
|---|---|
| Context required | The route/record the user attempted to reach (used only to decide Denied vs Not Found — never displayed). |
| Read model | None — deliberately no record data is fetched for display, per RBAC SRS §3.4 safety rules. |
| Actions | Back to Backlog (client navigation only). |
| Query states | This screen **is** an error/forbidden state for some other query — it has no states of its own. |
| Authorization | Reached whenever any permission check resolves to `H`, or a record does not exist. See `P3_RBAC_AND_SYSTEM_STATES.md` for the full Access Denied vs Not Found decision table. |
| Navigation | Must not leak whether "Access Denied" or "Not Found" was chosen for a reason the user could use to infer record existence — SRS §3.4 prefers Not Found for sensitive records specifically to avoid this leak. |
| Audit | Repeated Access Denied attempts to the same resource may be worth logging for security monitoring — not specified in the SRS; flag to BA if abuse detection is in scope. |

## Contract 8 — Home

| Field | Value |
|---|---|
| Context required | Signed-in user, `workspaceId`. Home is workspace-scoped, not project/team-scoped (its Context Bar shows a Company selector, not Project/Team). |
| Read model | **Not fully specified — this is a known gap.** The screen needs: (a) six summary counts (active projects, open work items, active sprints, blocked items, open defects, assigned-to-me count); (b) a "My Work" list — work items assigned to the current user, across all accessible projects, sorted by an unspecified order (mockup shows arbitrary/insertion order), capped at 6 with a "+N more" affordance; (c) a Recent Activity feed — appears to be a workspace-wide feed, not user-scoped (shows other users' actions), unbounded page size shown (6 items, no visible pagination); (d) Project Health — per-project active sprint, progress %, open defect count, blocked count, owner, scoped to projects the user can access. |
| Actions | Every element navigates (to Portfolio/Backlog/Track/Quality/Notifications) — Home performs no mutations itself. |
| Query states | Not built with dedicated empty/error/loading variants in this pass. Given Home aggregates four independent data sources, each section likely needs its own partial-failure handling (e.g. Recent Activity fails to load while My Work still renders) rather than one all-or-nothing page state — this needs BA/API-owner input before it can be fully specified. |
| Authorization | No row/action-level permission gating observed within Home itself; access is governed entirely by what the aggregate queries return (a user only sees counts/rows for projects they can access). |
| Navigation | None — Home has no route parameters. |
| Audit | None. |

## Contract 9 — Manage Projects

| Field | Value |
|---|---|
| Context required | `workspaceId`, role. Not project-scoped — this screen manages the project list itself. |
| Read model | Project list: `key`, `name`, `description`, `status` (Active/Archived), `owner`, `teams[]`, `members` count, `startDate`, `updatedAt`. Plus the four summary metrics (Total/Active/Archived/Linked Teams). |
| Enumerations | Project lifecycle status → `Entity Status Badge` (Active/Archived; Invited/Deactive variants exist for Team/User surfaces built elsewhere under Settings, not this screen). |
| Actions | Create Project, Edit Project, Archive Project, Restore Project. |
| Mutation states | Create/Edit open a `Dialog` `Type=Standard` with Form Field instances (project name, key, description, owner, start date, team picker). Archive requires `Dialog` `Type=Destructive Confirmation` — per RBAC SRS §3.1, "Delete must be blocked when the target has dependent or linked data" is actually **Archive** here, not Delete (Workspace Admin can archive/restore; the SRS separately allows only Workspace Admin to delete a project outright, which this screen's mockup does not appear to expose as a distinct action — flag to BA whether hard-delete is in scope for Phase 0–1 or deferred). |
| Authorization | `project:view` (`E` all roles who can reach this screen — but see the gap below), `project:create`/`:archive`/`:restore` are Workspace-Admin-only (`H` for PA/PM, RBAC SRS §3.1). **Only the full-access Workspace Admin view was built in Figma** (`P4_SCREEN_ANNOTATIONS.md` flags this) — a read-only variant for PA/PM is still owed. |
| Navigation | No route parameters; the status segmented control (All/Active/Archived) and search are local UI state in the mockup, not URL-persisted — flag to BA whether this should be a shareable/bookmarkable filtered view like Backlog's query params (Contract 2). |
| Audit | Project create/archive/restore should be audit-visible — the RBAC SRS's audit event list (§3.7) enumerates user/role/membership events explicitly but does not name project lifecycle events; confirm with BA whether project audit trail is bundled into the same log or a separate one. |

## Open questions added by P4

These extend the Q-01…Q-08 list in `P3_UI_API_CONTRACTS.md`.

| ID | Question | Why it matters |
|---|---|---|
| Q-09 | Is Home's Recent Activity workspace-wide or user-scoped, and does it paginate? | Determines whether it needs its own access-filtering (so a user doesn't see activity on projects they can't access) and a "load more" affordance. |
| Q-10 | Does Manage Projects support hard delete, or only archive/restore? | RBAC SRS §3.1 says "Only Workspace Admin can create, archive, restore or delete a Project" — but the mockup's `ConfirmDestructive` on this screen is archive-only. Confirm whether delete is a separate, rarer action (e.g. from a project's own settings) not shown on this list screen. |
| ~~Q-11~~ | ~~Is the Backlog Defect-priority enum a display-label mapping or a separate field?~~ | **Resolved at the start of Plan 5.** `DEFECT_PRIORITY_LABELS = { Critical: "Urgent", High: "High", Medium: "Normal", Low: "Low" }` appears identically in `BacklogPage.tsx`, `QualityPage.tsx` and `WorkItemDetailPage.tsx` — a consistent 1:1 label mapping over the same underlying Critical/High/Medium/Low value, exactly like `Status Badge`'s `Completed`→"Done". Built as `Defect Priority Chip` (`Screens — Phase 0–1` / `130:1596`, 2 variants: Display/Editable). Colour is constant regardless of value (unlike the general `Priority Badge`) — only the label text changes. New token: `color/badge/defect-priority/text` (`#9a3412`); bg/border/dot reuse existing `badge/priority/high/bg`, `badge/status/in-progress/border` and the `orange/500` primitive. |

## Coverage note

Contracts 1–5 (Backlog, Work Item Detail, Create Work Item, Destructive delete, App Shell) are in `P3_UI_API_CONTRACTS.md`. Contracts 6–9 above cover every other screen built in P4. Tasks (within Work Item Detail) and Revision History reuse Contract 3's authorization/query rules and are not repeated here.
