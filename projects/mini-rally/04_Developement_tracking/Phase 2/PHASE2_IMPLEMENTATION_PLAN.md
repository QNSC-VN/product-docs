# Phase 2 — Technical Implementation Plan

> **Audience:** Engineering (tech lead + dev agents). Pairs with the BA SRS files in this folder.
> **Codebase:** `/Users/nghiavt/QNSC/rally` — NestJS DDD monorepo (hexagonal per module), Drizzle + Postgres (RLS multi-tenant), Vite/React FSD frontend.
> **Author:** Solution Architect / Tech Lead
> **Status:** Draft for review
> **Date:** 2026-07-02

---

## 1. Scope

Phase 2 delivers three slices from the SRS:

| Slice | SRS | Summary |
|---|---|---|
| **P2.1 Backlog Enhancement** | `01_Backlog_Enhancement/SRS.md` | Richer backlog: filters (owner/release/iteration), inline edit, bulk assign release/iteration, reorder by rank. |
| **P2.2 Iteration Management** | `02_Iterations/SRS.md` | `Plan > Timeboxes > Iterations`: list/search/sort/filter, quick-create, full-page detail, assign backlog items. |
| **P2.3 Iteration Status** | `03_Iteration_Status/SRS.md` | Read model / dashboard for a selected iteration (metrics from assigned work items). |

**Out of scope (per SRS):** Releases CRUD UI, Milestones, Team Board / Team Status, board drag-drop execution, burndown reporting → Phase 3+.

---

## 2. Architecture decisions (locked)

| # | Decision | Rationale |
|---|---|---|
| **D1** | **Domain vocabulary = "Iteration"** (Ubiquitous Language). Code, API, UI all speak *Iteration*, not *Sprint*. | The business/BA/UI all say Iteration. Code should match the domain language. |
| **D2** | **Expand/contract (parallel-change) rename** — NOT big-bang. Phase 2 renames the **domain/application/interface** layers to Iteration; the **physical** `planning.sprints` table + `sprint_status` enum are renamed in a **separate later migration PR**. | Enterprise-safe: no broken in-flight branches, no risky single mega-migration, running system never breaks. Physical rename decoupled from behavior delivery. |
| **D3** | **Iterations = the existing `planning.sprints` entity, extended** (no new parallel table). | A separate `iterations` table alongside the renamed one would be incoherent and duplicate the lifecycle logic already built. |
| **D4** | **UI states map to existing DB enum.** `Planning→planned`, `Committed→active`, `Accepted→completed`. Mapping lives in the DTO layer. | Preserves the existing `start`/`complete` lifecycle state machine. Zero enum migration in Phase 2. Physical enum rename deferred to the D2 contract PR. |
| **D5** | **Assignment is a Work Item mutation.** Canonical field is `work_items.iteration_id`; assignment endpoints live in the Work Items API, not the Iteration API. | Matches SRS §8.6 / §2.3, and the existing `iterationId` field + index. Single source of truth. |
| **D6** | **Permissions stay pragmatic:** `iteration:view` + `iteration:manage` (2 perms), not one-per-verb. Assignment reuses `work_item:edit`. | Avoid permission sprawl; matches existing `work_item:*` granularity. |

### 2.1 What "expand/contract" means concretely for Phase 2

```
Layer                     Phase 2 (now)              Later contract PR
------------------------- -------------------------- -------------------------
HTTP route                /api/v1/iterations   ✅    (already Iteration)
DTO / response            IterationResponseDto ✅    (already Iteration)
Application service       IterationService     ✅    (rename from PlanningService)
Domain types / ports      Iteration / IIterationRepo (already Iteration)
Permission                iteration:view/manage ✅   (seed migration)
Drizzle table binding     sprints (aliased)          rename table planning.sprints→iterations
DB enum                   sprint_status (mapped)     rename → iteration_state
sprint_daily_snapshots    (unchanged)                → iteration_daily_snapshots
```

The Drizzle schema object can be exported under an `iterations` alias now (`export { sprints as iterations }`) so application code reads Iteration-native while the physical table is untouched — the physical DDL rename becomes a mechanical, low-risk follow-up.

---

## 3. What already exists (reuse — do NOT rebuild)

| Capability | Location | Notes |
|---|---|---|
| Iteration lifecycle (list/create/get/update/delete/**start**/**complete** w/ item rollover) | `libs/modules/planning/**` | Rename to `IterationService`; extend, don't replace. |
| `iteration_id` FK on work items + `ix_wi_iteration` | `db/schema/work.ts` | Assignment target ready. |
| Backlog listing (story+defect, filter/search/paginate) | `WorkItemsService.listBacklog` | `WorkItemFilters` already has `iterationId/releaseId/assigneeId/scheduleState/priority/q`. |
| Rank / reorder (LexoRank) | `WorkItemsService.reorderWorkItems` + `rank` col + `ix_wi_backlog` | Reshape signature to SRS `beforeId/afterId`. |
| Releases entity + service | `libs/modules/releases/**` | For release filter/bulk-assign. |
| Burndown read-model table | `sprint_daily_snapshots` | Feeds P2.3 metrics. |
| Key generation pattern | `project_counters` table | Reuse for `iterationKey` (IT-24-3). |
| RLS tenant isolation | migrations 0005/0018 | Every new query inherits it. |
| FE scaffolds | `apps/web/src/features/sprints/api.ts`, `features/releases` | Rename to `features/iterations`; wire generated client. |

---

## 4. The delta (what to build)

### 4.1 Schema (one migration: `0021_phase2_iterations.sql`)

`ALTER planning.sprints ADD`:
- `team_id uuid` (Team-scoped iterations — SRS P2-IT-FR-001*)
- `theme text` (rich-text goal/description)
- `notes text`
- `planned_velocity integer` (>= 0, nullable)
- `iteration_key varchar(30)` + backfill + unique index `(project_id, iteration_key)`; extend `project_counters` or add an iteration counter.
- Index `ix_sprints_team (team_id)`.

> No enum change. No table rename in this migration (D2/D4).

### 4.2 Backend — Iteration module (`libs/modules/planning` → rename to iterations)

- Rename `PlanningService→IterationService`, `ISprintRepository→IIterationRepository`, `sprint.types→iteration.types`, controller route `/sprints→/iterations`.
- Extend domain type with `teamId, theme, notes, plannedVelocity, iterationKey`.
- List: add **search (name/theme), sort (all SRS columns), state filter, team filter, `taskEstimate` rollup**.
- Create/update: validate `team ∈ project` (reuse `assertTeamLinked` pattern from work-items), date range, velocity ≥ 0.
- DTO mapper does UI-state ⇄ DB-state mapping (D4) and exposes `iterationKey`.
- Permissions: `iteration:view` (list/get), `iteration:manage` (create/update/delete/state).

### 4.3 Backend — Work Items additions (Backlog + assignment)

- `PATCH /work-items/:id` — allow `iterationId`, `releaseId`, `assigneeId`, `storyPoints`, `title`, `priority`, `scheduleState` inline (validate iteration/release/team scope).
- `PATCH /work-items/bulk-iteration` — all-or-nothing; validate each item ∈ same project/team as iteration; story/defect only. (UoW transaction, like `reorderWorkItems`.)
- `PATCH /work-items/bulk-release` — all-or-nothing; release ∈ project.
- `PATCH /work-items/:id/rank` — neighbor-based (`beforeId`/`afterId`) → compute LexoRank between neighbors; reuse existing rebalance path.

### 4.4 Backend — Iteration Status (P2.3)

- Read-model service: given `iterationId`, aggregate assigned work items (counts by schedule state, sum story points, task estimate rollup). Prefer querying live work items in P2.2/2.3; wire `sprint_daily_snapshots` only if a historical burndown is in P2.3 scope (confirm with BA — SRS lists burndown as Phase 5).

### 4.5 Frontend

- Rename `features/sprints → features/iterations`; regenerate API client from updated OpenAPI.
- `Plan > Timeboxes` route + Iterations list (search/sort/state filter), quick-create modal, full-page detail (Theme/Notes editors + right panel).
- Backlog: wire filters (owner/release/iteration), inline edit w/ optimistic save+rollback, bulk-assign bars, reorder controls.
- Iteration Status page consuming the P2.3 read model.
- Read-only rendering for Viewer (hide/disable mutating controls).

---

## 5. Task breakdown (maps to SRS task IDs)

### Sprint A — Backend foundation
| Task | SRS | Deliverable |
|---|---|---|
| A1 | — | Migration `0021_phase2_iterations.sql` (columns, key, indexes) |
| A2 | P2-IT-T01/T04 | Rename planning→iterations module; extend domain type + DTOs; UI-state mapper |
| A3 | P2-IT-T02 | List: search/sort/state+team filter/taskEstimate rollup |
| A4 | P2-IT-T03/T05 | Create/update validation (team∈project, dates, velocity); `iterationKey` gen |
| A5 | — | Seed `iteration:view`/`iteration:manage` permissions; keep `sprint:manage` alias during transition |

### Sprint B — Backlog + assignment API
| Task | SRS | Deliverable |
|---|---|---|
| B1 | P2-BL-T01/02 | Backlog list: expose owner/release/iteration filters + sort in controller/DTO |
| B2 | P2-BL-T03 | Inline `PATCH /work-items/:id` with scope validation |
| B3 | P2-BL-T04/T05 | `bulk-release` + `bulk-iteration` (all-or-nothing, UoW) |
| B4 | P2-BL-T06 | `PATCH /work-items/:id/rank` neighbor-based reorder |

### Sprint C — Frontend
| Task | SRS | Deliverable |
|---|---|---|
| C1 | P2-IT-T06/07/08/09 | Timeboxes list + quick-create + full-page detail + viewer read-only |
| C2 | P2-BL-T07/08/09 | Backlog filters, inline edit optimistic, bulk bars, reorder |
| C3 | P2-IS-* | Iteration Status page + read-model wiring |

### Sprint D — Verification
| Task | Deliverable |
|---|---|
| D1 | Unit tests (services/validation/state mapping) |
| D2 | Contract/e2e smoke: create iteration → assign backlog item → appears in Iteration Status → unassign |
| D3 | Permission + tenant/project/team isolation tests (RLS) |

### Later (separate PR, not Phase 2 delivery)
- **Contract migration:** rename `planning.sprints→iterations`, `sprint_status→iteration_state`, `sprint_daily_snapshots→iteration_daily_snapshots`, drop `sprint:manage` alias. Pure mechanical rename once nothing references old names.

---

## 6. Enterprise principles applied

- **Ubiquitous Language** — Iteration everywhere in the domain (D1).
- **Parallel-change / expand-contract** — safe rename without downtime or broken branches (D2).
- **Hexagonal boundaries preserved** — interface→application→domain→infrastructure per module; no logic in controllers.
- **Backward-compatible migrations** — additive first; destructive rename isolated and deferred.
- **Single source of truth** — assignment on `work_items.iteration_id` only (D5).
- **All-or-nothing bulk ops** in a Unit-of-Work transaction with RLS active (matches SRS "partial success not allowed").
- **Least-privilege but not sprawling** permissions (D6).
- **Test pyramid** — unit → contract → e2e smoke, plus explicit tenant-isolation tests.

---

## 7. Open questions for BA / Product

1. **P2.3 burndown:** SRS §15 lists burndown as Phase 5, but `sprint_daily_snapshots` exists. Is P2.3 Iteration Status **live aggregation only**, or does it include historical daily snapshots now?
2. **Iteration date overlap:** SRS §10 says "warn but don't block" across teams; block same-team only "if BA confirms." Confirm the rule.
3. **Accepted (completed) iterations read-only:** SRS §10 wants date changes locked once Accepted unless a reopen flow exists. Is a reopen flow in Phase 2 or later?
4. **`iterationKey` format:** confirm the display key scheme (e.g. `IT-<n>` per project vs. `IT-YY-N`).
