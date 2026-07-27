# Plan 3 — UI / API Contracts

## How to read this document

Each contract states **what the UI consumes and how it must behave for every server state**. It is written from the design side using the template agreed in `P0_Discovery_and_Scope/UI_STATE_AND_BA_GAP.md`.

**This document does not define the API.** Two source constraints make that explicit:

- `04_Developement_tracking/RECONCILED_SOURCE_OF_TRUTH.md` scopes itself to "business behavior, screen behavior and session-level FE mock state only. Database, API, infrastructure and persistence after browser refresh remain outside this source."
- P0 finding **G-007**: `model.ts` "is a rich static data source but not API schema. Use it only for content examples and field discovery; derive API contracts from SRS/production API owners."

So: **field lists are UI requirements**, not schemas. **Endpoint names are placeholders** describing a capability the UI needs, not agreed routes. Every one needs API-owner confirmation before implementation. Open items are collected in the last section.

What *is* authoritative here: the enumerations and lifecycle rules, which come from BA-confirmed sources and must not be redesigned by either side.

## Shared conventions

### Context required by every authenticated request

| Key | Source | Notes |
|---|---|---|
| `workspaceId` | Session | Phase 0 is a single-company MVP; no workspace switching UI exists. |
| `projectId` | App Shell context selector | Primary access gate for non-admin users (RBAC SRS §3.2). |
| `teamId` | App Shell context selector | Secondary filter under project access. `All Teams` is available to WA/PA only, never to PM. |
| `role` + effective permissions | Session | Changes take effect on next login, not live (RBAC SRS §3.5). |

Switching project or team is a **context change, not a filter change**: it resets pagination to page 1 and re-evaluates every permission-gated control. Saved views and column widths are user preferences and survive the switch; active filters do not, because filter values may reference records from the previous project.

### Query state machine

Every list/detail surface must implement all six states. Figma components are named in brackets.

| State | UI |
|---|---|
| `initial-loading` | Structure-preserving skeleton [`Table Skeleton`], never a spinner, so layout does not jump. |
| `refetching` | Previous data stays visible; controls remain interactive. Do **not** fall back to the skeleton — that makes sorting and paging feel like a full page reload. |
| `success-empty` | [`System State` `Type=Empty`]. The description must distinguish "no records exist yet" from "no records match your filters". |
| `success` | Data rendered. |
| `error` | [`System State` `Type=Error`] with Retry. Query state (filters, sort, page) is preserved across the retry. |
| `forbidden` / `not-found` | [`System State` `Type=Forbidden` / `Type=Not Found`]. See the safety rules in `P3_RBAC_AND_SYSTEM_STATES.md` — these must never echo the restricted record's metadata. |

### Mutation state machine

| State | UI |
|---|---|
| `idle` | Control in its `E` state. |
| `validation-error` | Field-level error via [`Form Field` `State=Error`] plus a summary if more than two fields fail. Submit stays enabled so the user can retry after correcting. |
| `submitting` | Submit control disabled; the rest of the form stays readable. |
| `success` | [`Toast` `Type=Success`] for background/secondary mutations; inline confirmation for in-place edits. Refetch policy is stated per contract below. |
| `server-error` | [`Alert` `Type=Error`] inline in the form — **not** a toast, because the user must not lose the form contents. |
| `conflict` | Treated as a distinct outcome, not a generic server error. See open question Q-04. |

### Enumeration adapter

**Authoritative** — from `RECONCILED_SOURCE_OF_TRUTH.md` §3. The UI must not normalise or invent values.

| Entity | Allowed values | Figma component |
|---|---|---|
| Story / Defect Schedule State | `Idea`, `Defined`, `In-Progress`, `Completed`, `Accepted`, `Release` | `Status Badge` |
| Story / Defect Flow State | same as Schedule State; mirrors it in both directions for the MVP | `Status Badge` |
| Task State | `Defined`, `In-Progress`, `Completed` | `Status Badge` (subset) |
| Defect State | `Submitted`, `Open`, `Fixed`, `Closed`, `Closed Declined` | needs its own mapping — see Q-05 |
| Iteration State | `Planning`, `Committed`, `Accepted` | `Status Badge` (subset) |
| Release State | `Planning`, `Active`, `Accepted` | `Status Badge` (subset) |
| Work item Type | `Story`, `Defect`, `Task`, `Feature` | `Type Badge` |
| Priority | `Critical`, `High`, `Medium`, `Low` | `Priority Badge` |
| Role | `workspace_admin`, `project_admin`, `project_member` | `Role Badge` |

Two rules that fall out of this and matter to both sides:

1. **`Code Review`, `Testing` and `Released` are not valid US/DE Schedule/Flow values.** A screen must not silently normalise a legacy value into a valid one — invalid legacy data needs migration or validation at its source. If the UI receives one, it renders the raw value in a neutral badge and reports it, rather than guessing.
2. **The display label is not always the stored value.** `Completed` renders as "Done" in `Status Badge`. That mapping lives in the design system, so BE should send the enum value, never a display string.

### Lifecycle rules the UI must react to

**Authoritative** — `RECONCILED_SOURCE_OF_TRUTH.md` §2. These are server-side transitions, so the UI's job is to refetch rather than to compute them locally.

| Rule | UI consequence |
|---|---|
| All child Tasks `Completed` auto-changes the parent US/DE to `Completed` | After any Task mutation, the parent work item must be refetched — its status may have changed without the user touching it. |
| Reopening any Task auto-changes the parent to `In-Progress` | Same refetch requirement, in the other direction. |
| Iteration with all assigned US/DE `Accepted` auto-changes to `Accepted` | After a work-item status mutation, the iteration summary is stale. |
| New US/DE defaults to Schedule State = Flow State = `Idea` | The create form does not offer a status field. |
| New Iteration defaults to `Planning`; assignment never auto-commits | Assigning a work item to an iteration must not change iteration state. |
| Task always inherits its parent's Iteration | The Task form has no iteration field. |

> Because several transitions are server-computed, **optimistic updates are unsafe for status mutations.** Optimism is acceptable for rank/reorder (see Q-03) but not for anything that can cascade.

---

## Contract 1 — App Shell and context switching

**Pattern:** `App Shell` / `TopNav` / `Context Bar`

| Field | Value |
|---|---|
| Context required | `workspaceId`, session user, effective role |
| Read model | Current user (name, initials, role); accessible projects; teams within the selected project. Placeholder capability: *"list projects and teams the current user may access"*. |
| Enumerations | Role → `Role Badge` |
| Actions | Switch project; switch team; sign out; open notifications; open workspace settings |
| Query states | The shell renders its chrome immediately; the project/team lists may load asynchronously into the switcher. A failure to load the switcher list must not blank the whole shell. |
| Mutation states | Context switch is a client navigation, not a mutation. |
| Authorization | The project/team lists must contain **only** accessible records — filtering client-side is not acceptable (RBAC SRS §3.4). PM must not see `All Teams` or unassigned teams. Settings gear is `H` for PA and PM. |
| Navigation | Project/team belong in the URL so a deep link restores context. Opening an inaccessible context by direct URL resolves to Access Denied or Not Found. |
| Audit | None at the shell level. |

## Contract 2 — Backlog list  *(pilot)*

**Pattern:** `List Toolbar` + `Filter Bar` + `Data Table` + `Table Pagination`

| Field | Value |
|---|---|
| Context required | `workspaceId`, `projectId`, `teamId`, role |
| Read model | Per row the table consumes: `id`, `rank`, `type`, `title`, `priority`, `planEstimate`, `owner{name,initials}`, `scheduleState`, `iteration{id,name}`, `release{id,name}`. Plus a total count for pagination. Placeholder capability: *"query work items in a project/team context with search, filter, sort and pagination"*. |
| Query parameters | `search`, per-column `filters`, `sort{column,direction}`, `page`, `pageSize`. All belong in the URL so a filtered view is shareable and survives refresh. |
| Enumerations | Type → `Type Badge`; Priority → `Priority Badge`; Schedule State → `Status Badge` |
| Actions | Create work item; inline-edit title / estimate / owner / state / iteration / release; reorder rank; bulk assign release or iteration; bulk edit priority / owner; bulk delete |
| Query states | All six. Sorting, filtering and paging are `refetching`, not `initial-loading`. |
| Mutation states | Inline edits: `submitting` on the single cell, not the whole row. Bulk actions: the bar shows progress and the affected rows refetch on completion. |
| Authorization | `work_item:view` / `:create` / `:edit` / `:delete`. **Release assignment is `H` for Project Member** — that cell renders as text, not a Select. PA in a non-assigned project is `R` across the whole table. |
| Navigation | `?project=&team=&search=&filters=&sort=&page=`. Clicking a row opens the drawer; clicking the ID opens full detail. |
| Audit | Field changes are audit-visible in Revision History (`Activity Row`). |

Server-side ordering matters here: **rank ordering and pagination must both be server-side**, otherwise page 2 of a manually ranked backlog is meaningless. See Q-03.

## Contract 3 — Work Item Detail / Drawer  *(pilot)*

**Pattern:** `Drawer` + `Detail Field` + `Activity Row` + `Progress` + `Tag`

| Field | Value |
|---|---|
| Context required | `workspaceId`, `projectId`, `workItemId`, role |
| Read model | `id`, `type`, `title`, `description`, `scheduleState`, `flowState`, `priority`, `planEstimate`, `owner`, `iteration`, `release`, `milestones[]`, `tags[]`, `taskCount`, `completedTasks`, `lastUpdated`. Child tasks and revision history are separate reads — the drawer should not block on them. |
| Enumerations | As Contract 2, plus Task State for child tasks |
| Actions | Edit fields; add/edit/delete child Task; add note/comment; manage relations, attachments, watchers; assign iteration; delete work item |
| Query states | Header renders as soon as the summary resolves; the field grid and activity list get their own skeletons so a slow activity query does not block the fields. |
| Mutation states | Field edits are in-place with inline confirmation. **After any Task mutation the parent must be refetched** because of the auto-transition rules above. |
| Authorization | `work_item:view` / `:edit` / `:delete`. PM may edit fields, notes, attachments, relations, watchers and tasks, and may assign an Iteration, but **not** a Release. |
| Navigation | Drawer is a UI state over the list; full detail is its own route with the work item ID. Both must be deep-linkable, and the drawer must return the user to their preserved list query on close. |
| Audit | Every field change produces a Revision History entry with actor, action, target and old→new values. |

## Contract 4 — Create work item

**Pattern:** `Dialog` `Type=Standard` + `Form Field` + `Text Input` / `Textarea` / `Select`

| Field | Value |
|---|---|
| Context required | `workspaceId`, `projectId`, `teamId`, role |
| Read model | Option lists for type, project, team, owner, iteration — each filtered to what the user may access |
| Actions | Create, and "create and open details" |
| Mutation states | `validation-error` on the title field (required); `submitting` disables the submit button; `success` closes the dialog, refetches the list and shows a success Toast; `server-error` renders an inline Alert and **keeps the dialog open with its values intact**. |
| Authorization | `work_item:create`. When `H`, the Create button is not rendered — the dialog route must also be guarded. |
| Navigation | Modal state; on "create and open details", navigate to the new item's detail route. |
| Audit | Work item creation is an audit event. |

New items default to Schedule State = Flow State = `Idea`, so the form has no status field.

## Contract 5 — Destructive delete

**Pattern:** `Dialog` `Type=Destructive Confirmation` + `Button` `Style=Destructive`

| Field | Value |
|---|---|
| Actions | Delete work item / remove user access / delete project |
| Mutation states | Confirm starts **disabled** until the typed confirmation matches. `submitting` disables both buttons. On success the dialog closes and the list refetches. |
| Blocked delete | Per RBAC SRS §3.1, a delete must be blocked when the target has dependent or linked data the module's rules do not allow to be removed. The blocked case is **not** a generic error: the dialog stays open and explains the specific dependency, leaving the record unchanged. This needs a structured reason from BE — see Q-02. |
| Authorization | Destructive actions default to `H` when the user lacks permission, never `D`. |
| Audit | Always audited, with actor, target and timestamp. |

---

## Open questions for BA / API owners

These cannot be resolved from the SRS, the mockup or this workspace, and are the genuine blockers to implementation.

| ID | Question | Why it matters | Suggested owner |
|---|---|---|---|
| Q-01 | What is the actual transport and route shape (REST vs GraphQL, resource naming, pagination style — offset vs cursor)? | Every endpoint in this document is a placeholder capability. Cursor vs offset changes the pagination component's contract. | API owner |
| Q-02 | What structured shape does a **blocked delete** return? | The UI must explain the specific dependency rather than showing a generic error, per RBAC SRS §3.1. | BA + API owner |
| Q-03 | Is backlog **rank** a server-side ordered field with a reorder endpoint, and is reorder optimistic with revert-on-failure? | P0 finding G-003 flagged this as unproven. Rank ordering plus pagination must be server-side or paging a ranked backlog is meaningless. | BA + API owner |
| Q-04 | What is the **concurrency model** — last-write-wins, or version/ETag with a 409 conflict? | The mutation state machine treats `conflict` as distinct from `server-error`, but the UI cannot be designed until this is chosen. Dense multi-user tables with inline editing make this likely, not theoretical. | API owner |
| Q-05 | Defect State (`Submitted`/`Open`/`Fixed`/`Closed`/`Closed Declined`) has no badge colour mapping yet. | It is a separate lifecycle from Schedule/Flow State (P0 finding G-004). Needs its own domain mapping under decision D-005. | BA |
| Q-06 | Are **saved views** server-persisted and shareable, or local to the browser? | The mockup shows "My Views" and "Shared Views" but has no persistence. Shared views imply an ownership and permission model. | BA |
| Q-07 | Does search span all accessible projects, or only the current project/team context? | The TopNav search says "Search all work items…" while the Backlog search is context-scoped. The two need different contracts. | BA |
| Q-08 | Should permission changes surface to an **already-signed-in** user before their next login? | RBAC SRS §3.5 says changes take effect at next login and Phase 4 does not require force-closing the page. Confirming this means the UI needs no live permission subscription. | BA — likely already answered "no" |

## What this document deliberately does not do

- Name real endpoints, HTTP verbs, status codes or payload schemas.
- Specify persistence, caching or infrastructure behaviour.
- Redefine any enumeration or lifecycle rule — those are quoted from BA-confirmed sources and must be changed there first.
