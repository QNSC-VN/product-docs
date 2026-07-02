# `rally-api` — Backend Structure (Modular Monolith, Hexagonal)

> **Scope:** internal structure of the backend repo `rally-api`. Companion to `ARCHITECTURE_CURRENT.md` (decisions) and `FOUNDATION_PHASE.md` (task plan). This document is the **scaffold** every later domain decision drops into. Stack is already locked: NestJS + Fastify, TypeScript, Drizzle, PostgreSQL + RLS, Zod, transactional outbox → SQS, Valkey.

---

## 1. Goals & Principles

1. **Modular monolith** — one deployable, internally partitioned into **bounded contexts** with extraction-ready seams. No distributed system until a measured trigger (see `ARCHITECTURE_FUTURE_SCALE.md`).
2. **Hexagonal (Ports & Adapters)** inside each context — domain logic isolated from framework, DB, and transport. Infrastructure is swappable; domain is pure.
3. **Strict dependency rule** — dependencies point **inward**. The domain knows nothing about NestJS, Drizzle, HTTP, or SQS.
4. **Bounded contexts own their data** — a module never reads another module's tables or repositories directly. Cross-context flow is via published contracts or domain events.
5. **One transaction per command = the Unit of Work** — the architecture provides UoW, not the ORM (see §6).
6. **Pragmatism over purity** — the layering is the *target*; thin modules may collapse layers, but the dependency rule is never broken. Avoid abstractions with a single implementation and no extraction plan.
7. **DRY the right things** — centralize **technical/infra** code in `platform/` + `shared-kernel/` (config, errors, pagination, auth, UoW, IDs) so no context re-implements them. **Do *not* share *domain* models across bounded contexts**: a similar-looking `Member`/`Status` in two contexts is *acceptable duplication* because they are different concepts — sharing them welds the modules together and kills extraction. DRY infra aggressively; allow domain duplication across contexts.

---

## 2. Repository Top-Level Layout (NestJS monorepo: `apps` + `libs`)

We use NestJS's built-in monorepo workspace so the **HTTP process** and the **worker/scheduler process** are separate deployables that **share the same domain code**. This is the real-world enterprise split: the API and the async workers scale, deploy, and fail independently, but neither duplicates business logic.

```text
rally-api/
├─ apps/
│  ├─ api/                      # HTTP process (Fastify) — controllers, guards, REST + BFF
│  │  └─ src/
│  │     ├─ main.ts             # bootstrap: Fastify adapter, OpenAPI, global pipes/filters
│  │     ├─ app.module.ts       # imports bounded-context modules + platform
│  │     └─ bootstrap/          # versioning, swagger, security headers, graceful shutdown
│  └─ worker/                   # SQS consumers + scheduler process (no HTTP surface)
│     └─ src/
│        ├─ main.ts             # bootstrap: queue consumers, cron, outbox relay
│        └─ worker.module.ts
│
├─ libs/
│  ├─ modules/                  # bounded contexts — shared by api + worker
│  │  ├─ identity/              # users, auth, sessions, MFA/SSO seams
│  │  ├─ tenancy/               # workspace/org, membership, tenant context, RLS bootstrap
│  │  ├─ access/                # RBAC + ABAC permission engine, roles, permission codes
│  │  ├─ projects/              # projects, teams, project membership
│  │  ├─ work-items/            # unified item model, relations, ranking (LexoRank)
│  │  ├─ workflow/              # statuses, transitions, state-machine rules
│  │  ├─ planning/              # sprints, backlog, capacity
│  │  ├─ releases/              # releases, release items
│  │  ├─ quality/               # defects, test artifacts (later phases)
│  │  ├─ collaboration/         # comments, attachments, watchers, mentions
│  │  ├─ notifications/         # notification preferences + delivery
│  │  ├─ audit/                 # immutable activity log (outbox consumer)
│  │  └─ reporting/             # burndown, velocity, dashboard read models
│  │
│  ├─ shared-kernel/            # PURE domain primitives, no framework/infra deps
│  │  └─ src/
│  │     ├─ result/             # Result<T,E> / typed errors (no throw-for-control-flow)
│  │     ├─ ids/                # UUIDv7/ULID generation + branded id types
│  │     ├─ domain/             # AggregateRoot, Entity, ValueObject, DomainEvent base
│  │     └─ types/              # shared primitive types, branded scalars
│  │
│  ├─ platform/                 # infrastructure cross-cutting (framework-aware)
│  │  └─ src/
│  │     ├─ config/             # Zod-validated env loader (per app)
│  │     ├─ database/           # Drizzle client, connection pool, UnitOfWork, tx manager
│  │     ├─ rls/                # request tenant-context + SET LOCAL app.tenant_id (fail-closed)
│  │     ├─ outbox/             # outbox writer (port) + relay (worker side)
│  │     ├─ messaging/          # SQS publisher/consumer abstractions, DLQ, idempotency
│  │     ├─ cache/              # Valkey client, rate-limit, locks (advisory/distributed)
│  │     ├─ auth/               # JWT verify, session store, guards (Auth, Permission)
│  │     ├─ http/               # error filter, response envelope, logging/timeout/audit interceptors, pagination
│  │     ├─ context/            # AsyncLocalStorage request context (tenant, user, correlationId)
│  │     ├─ observability/      # OpenTelemetry setup, correlation, health/readiness
│  │     └─ errors/             # error codes registry, exception hierarchy
│  │
│  └─ contracts/                # (optional) shared Zod/OpenAPI DTO schemas surfaced in the public spec
│
├─ db/
│  ├─ schema/                   # Drizzle table definitions (co-located per module or namespaced)
│  ├─ migrations/               # drizzle-kit generated SQL + hand-written RLS policies / partitioning
│  └─ seeds/                    # tenant + admin + role/permission seed
│
├─ test/                        # e2e + integration (Testcontainers Postgres), isolation tests
├─ drizzle.config.ts
├─ nest-cli.json                # monorepo projects: api, worker, libs
├─ tsconfig.json                # path aliases @modules/*, @platform/*, @shared-kernel/*
└─ package.json
```

**Why `apps/` + `libs/` and not one flat app:** the worker (SQS consumers, scheduler, outbox relay) must run as its **own process/container** — it has a different scaling profile and must not share the HTTP request lifecycle. Sharing domain code via `libs/` avoids duplicating business rules across the two processes.

---

## 3. Bounded-Context Internal Layering (hexagonal)

Every context in `libs/modules/<context>/` follows the same four-layer shape. Example, `work-items`:

```text
libs/modules/work-items/
├─ domain/                      # PURE — no Nest, no Drizzle, no HTTP
│  ├─ work-item.aggregate.ts    # AggregateRoot: invariants, state transitions, emits events
│  ├─ value-objects/            # Rank (LexoRank), ItemKey, Priority, StoryPoints
│  ├─ events/                   # WorkItemCreated, WorkItemStatusChanged, WorkItemMoved
│  ├─ services/                 # pure domain services (rank rebalance policy, etc.)
│  └─ ports/                    # interfaces the domain/app needs:
│     ├─ work-item.repository.ts   #   WorkItemRepository (port)
│     └─ ...                       #   other outbound ports
│
├─ application/                 # use cases — orchestration, depends on domain + ports only
│  ├─ commands/                 # CreateWorkItem, MoveWorkItem, ChangeStatus (+ handlers)
│  ├─ queries/                  # GetBacklog, GetBoard, GetWorkItem (+ handlers, read models)
│  ├─ dto/                      # Zod input/output schemas for use cases
│  └─ work-items.service.ts     # application service (thin façade over handlers)
│
├─ infrastructure/             # adapters — implement ports, depend on platform
│  ├─ persistence/
│  │  ├─ work-item.drizzle-repository.ts   # implements WorkItemRepository
│  │  └─ work-item.mapper.ts               # row <-> aggregate
│  └─ ...
│
├─ interface/                  # entry points
│  ├─ http/
│  │  ├─ work-items.controller.ts          # REST resource endpoints
│  │  └─ board.controller.ts               # BFF aggregation endpoints (CQRS read)
│  └─ events/
│     └─ work-items.consumer.ts            # reacts to other contexts' events (worker side)
│
└─ work-items.module.ts        # NestJS module: binds ports → adapters via DI tokens
```

### The dependency rule (enforced)

```text
interface ──┐
            ├─► application ──► domain   (domain depends on NOTHING outward)
infrastructure ─(implements ports)─► domain
```

- `domain/` imports only `shared-kernel` and its own ports. **No `@nestjs/*`, no Drizzle, no `pg`, no HTTP types.**
- `application/` imports `domain` + ports. Knows use cases, not frameworks.
- `infrastructure/` imports `platform` + `domain` ports, and **implements** them.
- `interface/` (controllers/consumers) calls `application`.
- Wiring happens in `*.module.ts` via **DI tokens** (`provide: WORK_ITEM_REPOSITORY, useClass: DrizzleWorkItemRepository`) → adapters are swappable and the context is extraction-ready.
- **Enforce with ESLint** (`eslint-plugin-boundaries` or import-zone rules) so a domain file importing Drizzle is a lint failure, not a code-review hope.

---

## 4. Inter-Module Communication (the seams that make extraction possible)

Modules must not become a tangled ball. Two legal channels only:

1. **Synchronous, read/command:** call another context's **application service through its published interface** (a port), wired by DI. Never import its repositories, aggregates, or tables. Keep these calls few and explicit.
2. **Asynchronous, reactive:** emit a **domain event** (via outbox); the other context subscribes in its `interface/events/` consumer. This is the default for cross-context side effects (e.g. `WorkItemStatusChanged` → `audit` writes log, `notifications` notifies, `reporting` updates read model).

**Forbidden:** reaching into another module's tables, repositories, or domain objects. Each module **owns its tables**; cross-context data needs flow through contracts or events. This is precisely what lets a module later become its own service with no domain rewrite.

---

## 5. Cross-Cutting Concerns (in `platform/`)

| Concern | Where | Note |
|---|---|---|
| **Request context** | `platform/context` | `AsyncLocalStorage` holds `tenantId`, `userId`, `correlationId` for the whole request — no prop-drilling |
| **Auth** | `platform/auth` | `JwtAuthGuard` (verify access token), `PermissionGuard` (RBAC+ABAC via `access` module) |
| **Error model** | `platform/http` + `platform/errors` | One exception hierarchy → global filter → **stable error envelope** `{ code, message, details, correlationId }`; codes registry surfaced in OpenAPI for the FE |
| **Validation** | `platform/http` | `ZodValidationPipe` (`nestjs-zod`); DTOs composed from `drizzle-zod` bases (never expose raw DB shape) |
| **Pagination/filtering** | `platform/http` | One cursor-pagination + filter convention across all list endpoints |
| **Rate limiting** | `platform/cache` | Per-tenant + per-user token bucket on Valkey |
| **Logging / timeout / audit** | `platform/http` | Interceptors: structured log w/ correlationId, per-request timeout, audit emit |
| **Observability** | `platform/observability` | OpenTelemetry traces/metrics, `/healthz` + `/readyz`, graceful shutdown/draining |
| **Config** | `platform/config` | **Zod-validated env** per app — process fails fast on bad/missing config |

---

## 6. Unit of Work, Transactions & RLS Context (the heart of correctness)

Every state-changing use case runs inside **one database transaction** that is the Unit of Work:

```text
Command handler
  └─ UnitOfWork.run(async (tx) => {
       SET LOCAL app.tenant_id = <ctx.tenantId>     // RLS context, fail-closed
       repo.save(aggregate)                          // domain write(s)
       outbox.add(aggregate.pullEvents())            // outbox rows, same tx
     })                                               // commit = atomic domain + events
```

- The `UnitOfWork` / transaction manager lives in `platform/database`. It opens the Drizzle transaction, sets `SET LOCAL app.tenant_id` from the request context (**no context → reject**), and exposes the transactional handle to repositories.
- Domain writes **and** outbox writes commit atomically → no lost events, no dual-write problem (Transactional Outbox).
- The **worker** runs the **outbox relay** (poll `pending` → publish to SQS → mark published) and the **SQS consumers** (idempotent, DLQ on poison). At-least-once delivery + consumer idempotency = effectively-once.
- Aggregates collect events in memory (`pullEvents()`); the application layer persists them to the outbox — the domain never touches infrastructure.

---

## 7. CQRS-lite Stance (don't over-ceremony it)

- **Commands and queries are separate** application objects with their own handlers, but they live in the **same module and same database**. No separate write/read databases, no event sourcing.
- **Queries / BFF read models** may bypass the aggregate and read shaped projections directly via Drizzle (board, backlog, dashboard) — that's the point of CQRS-lite: cheap reads, rich writes.
- **Do not adopt `@nestjs/cqrs` event-bus machinery by default.** Plain command/query handler classes + application services are enough and clearer. Introduce a bus only if a real need (complex in-process saga orchestration) emerges — a triggered decision, not a default.

---

## 8. Database, Schema & Migrations (`db/`)

- **Drizzle table definitions** in `db/schema` (namespaced per bounded context; one physical DB now, logically separable later).
- **Migrations** in `db/migrations`: `drizzle-kit` generates the SQL diff; we **hand-extend** each with **RLS enable + policies (`USING` + `WITH CHECK`)**, partial indexes, and (later) partitioning. Expand-contract discipline (add → backfill → switch → drop) so deploys are zero-downtime.
- **Roles:** runtime connects as a dedicated **`NOBYPASSRLS`** app role; migrations run as a separate privileged role (see `ARCHITECTURE_CURRENT.md` §4.1).
- **Seeds** in `db/seeds`: first tenant, workspace admin, role/permission catalog.

---

## 9. Testing Strategy

| Level | What | Tooling |
|---|---|---|
| **Unit** | Pure domain (aggregates, value objects, policies) — fast, no I/O | Vitest/Jest |
| **Integration** | Repositories + RLS + outbox against real Postgres | **Testcontainers** Postgres |
| **Tenant-isolation** | Assert tenant A cannot read/write tenant B on **every** table | Integration suite (mandatory) |
| **Contract** | OpenAPI spec matches handlers; FE codegen stays valid | spec snapshot + contract tests (Pact optional) |
| **E2E** | Critical flows (auth, create/move work item) through HTTP | api app + Testcontainers |

---

## 10. Conventions

- **Folders** kebab-case; **classes** PascalCase; **files** `thing.role.ts` (`work-item.aggregate.ts`, `work-item.drizzle-repository.ts`).
- **Path aliases:** `@modules/*`, `@platform/*`, `@shared-kernel/*`, `@contracts/*` — no deep relative `../../..` imports.
- **DI tokens** for every port (`Symbol`/`abstract class`), never bind to a concrete class directly.
- **API versioning** URI-prefixed (`/v1`); OpenAPI generated from Zod via `nestjs-zod`.
- **No throw-for-control-flow** in domain — return `Result<T, E>`; map to HTTP at the boundary.

---

## 11. Anti-Over-Engineering Guardrails

1. **No port/adapter for a single forever-implementation with no extraction plan** — collapse the layer.
2. **No `@nestjs/cqrs` bus, no event sourcing, no microservices** until a named, measured trigger.
3. **One database**; modules separate by schema/ownership, not by physical DB.
4. **Cross-module = interface or event, never table reach** — this single rule preserves all future optionality at near-zero cost.
5. **Keep the worker thin** — it shares domain code; it does not grow a parallel architecture.
6. **DRY infra, not domain** — never share a domain model across contexts to “avoid duplication”; that coupling is more expensive than the duplication.

---

## 12. Error Model & Code Registry (A2)

One exception hierarchy → one wire envelope → a stable code registry the FE branches on.

- **Domain returns `Result<T, DomainError>`** — no throw-for-control-flow. Typed categories: `NotFound`, `Conflict`, `ValidationFailed`, `PermissionDenied`, `PreconditionFailed`, `RateLimited`, `Internal`.
- **Global exception filter** maps every error to one envelope:
  ```json
  { "error": { "code": "WORK_ITEM_RANK_CONFLICT", "message": "…", "details": [], "correlationId": "…", "traceId": "…" } }
  ```
- **`code` is the contract** — machine-readable `RESOURCE_REASON`, surfaced in OpenAPI so the FE switches on `code`, never on `message`. **Codes are append-only; never reused or renumbered.**
- **`message` is human/i18n** — a localization key; the backend's English text is a fallback, not the contract.
- **HTTP status by category** (404 / 409 / 422 / 403 / 429 / 500). Zod validation → **422 + field-level `details`**.
- **Never leak internals** (stack traces, SQL, driver errors). Log the full error server-side with `correlationId` + `traceId`; return a safe shape. 5xx = generic message + correlationId for support.
- **Registry** lives in `platform/errors` (single source); each code has category → HTTP status mapping.

---

## 13. Configuration & Secrets (A3)

Zod-validated env, fail-fast at boot; secrets injected at runtime, never baked into the image.

- **`platform/config`** parses `process.env` against a **Zod schema (per app)** → a typed, **immutable** config object. Missing/invalid var = **process refuses to start** (fail fast, not fail at 3am).
- **12-factor:** all config via env. **Secrets** (DB creds, JWT signing keys, SQS/Valkey auth) live in **AWS Secrets Manager / SSM Parameter Store**, injected into the ECS task at runtime (KMS-encrypted). **Nothing secret in repo, image, or logs.**
- **Config vs secrets** are separate concerns; **feature flags** are separate again (deferred).
- **JWT signing = asymmetric (EdDSA / RS256)** with **key rotation** (`kid` header, overlap window). API + worker verify with the public key.
- **Local dev:** `.env` (gitignored) + committed `.env.example`, both validated by the same Zod schema.

---

## 14. Observability & Correlation

OpenTelemetry from day 1, one correlation ID threaded everywhere — including across async hops.

- **OTel SDK** auto-instruments HTTP, `pg`, SQS/SNS, Valkey. Traces + metrics + logs → OTLP → managed backend (Grafana Cloud / CloudWatch); self-hosted LGTM on trigger.
- **Correlation:** accept inbound **W3C `traceparent`** (or `X-Request-Id`), else generate; held in **`AsyncLocalStorage` context** (`tenantId`, `userId`, `correlationId`, `traceId`, `spanId`) — no prop-drilling.
- **Async trace propagation (critical):** carry `traceparent` in the **event envelope + SQS message attributes** so a consumer's span links back to the producing request. Without this, worker errors are orphaned and async flows are undebuggable.
- **Logs = pino** (native Fastify), structured JSON; every line carries `correlationId` / `traceId` / `tenantId` / `userId`. **Never log PII, secrets, or tokens.**
- **Metrics:** RED (rate/errors/duration) per route, **queue depth**, **outbox lag**, DB pool saturation. **Trace sampling** for cost control.
- **Health:** `/healthz` (liveness) + `/readyz` (DB + cache reachable + migrations applied).

---

## 15. Rate-Limit Tiers

Distributed token bucket on Valkey — layered, plan-aware, standards-compliant.

- **Layers:** coarse at the edge (WAF / CloudFront) + **fine-grained in-app** (per-tenant, per-user, per-IP pre-auth).
- **Tiers are plan-driven** (config, not hard-coded): `free` / `pro` / `enterprise` get different sustained + burst limits, tied to the `plans` / `subscriptions` tables.
- **Per-endpoint cost weighting:** cheap `GET` ≠ expensive report/export; weight bucket cost per route. **Separate stricter buckets** for auth (brute-force defense) and for writes vs reads.
- **On limit:** `429` + **`Retry-After`** + IETF `RateLimit-Limit` / `RateLimit-Remaining` / `RateLimit-Reset` headers.
- **Distributed** (Valkey) → consistent across all ECS instances; integrates with load shedding under overload.

---

## 16. Pagination & Filtering Standard

Cursor (keyset) pagination by default; whitelisted-operator filtering validated by Zod → Drizzle. One convention on every list endpoint (in `platform/http`).

- **Keyset, not offset.** Offset is slow on large tables and skips/duplicates rows when data changes mid-scroll. Keyset rides our composite indexes (leading `tenant_id`) and is stable. Offset only for tiny bounded admin lists.
- **Deterministic order:** every sort appends **`id` (UUIDv7) as a tiebreaker** so the cursor is unambiguous.
- **No arbitrary query language** (injection + unbounded-query risk). A **constrained per-field operator whitelist** (`eq, ne, in, gte, lte, like, between`), each validated by Zod and mapped to a Drizzle condition. **Saved filters** persist this structured JSON.

### API pagination contract

**Request**
```http
GET /v1/projects/{id}/work-items
    ?limit=50
    &sort=-updatedAt                 # '-' = desc; whitelisted fields only; id auto-appended
    &filter[status]=in:open,in_progress
    &filter[priority]=eq:high
    &filter[updatedAt]=gte:2026-01-01T00:00:00Z
    &cursor=eyJ2IjoxLCJrIjpb...      # opaque; omit on first page
```
- `filter[field]=op:value` — `op` from the field's whitelist; multi-value = comma. Unknown field/op → `400 INVALID_FILTER`.
- `limit` default **50**, hard cap **100**.

**Response**
```json
{
  "data": [ ],
  "pageInfo": { "nextCursor": "eyJ2Ijox…", "hasNextPage": true, "limit": 50 }
}
```
- **`hasNextPage`** computed by fetching `limit + 1`.
- **No `totalCount` by default** (expensive on large keyset sets); offer an explicit, optional, possibly-approximate count only where the UI truly needs it.

**Cursor format**
- Opaque **base64url** of `{ "v":1, "k":[<lastSortValues>], "id":"<lastId>", "d":"asc|desc" }`.
- **Versioned (`v`)** so the format can evolve. Server **re-validates** decoded fields against the endpoint's allowed sort (tamper-safe); optional **HMAC** for integrity. Invalid → `400 INVALID_CURSOR`.

---

*Companion docs:* `ARCHITECTURE_CURRENT.md` (decisions/stack) · `FRONTEND_STRUCTURE.md` (`rally-web` SPA — the contract consumer) · `ARCHITECTURE_FUTURE_SCALE.md` (triggered evolution) · `FOUNDATION_PHASE.md` (first-phase tasks) · `PRODUCTION_READINESS.md` (launch checklist) · `DOMAIN_DESIGN.md` (permission engine, work-item core, outbox flow).
