# Rally-Clone SaaS — Foundation Phase (Revised First Phase)

> **Why this doc exists:** The existing `04_Developement_tracking/Phase 0` is a **1.5-day single-company prototype** (cookie auth, admin-only, no multi-tenancy, email/scheduler deferred). That is fine as a *prototype* but **not** the foundation for a multi-tenant global SaaS — building it as-is means re-platforming later.
> This document redefines the **real first phase** = existing Phase 0 features **+ the retrofit-expensive primitives** (🔴 in `PRODUCTION_READINESS.md`) baked in from day 1.
> **Primary stack:** modular monolith, **NestJS/TypeScript (LOCKED 2026-06-20)**, PostgreSQL 17+ + RLS, Valkey, outbox→SQS, S3, AWS + **OpenTofu** (in `rally-infra` repo). See `ARCHITECTURE_CURRENT.md`.

---

## 1. Core Principle

Build the **thinnest possible product** (single company `ACME Space Inc.` can be the only tenant at first) **on top of the full enterprise foundation**. Tenancy, identity, audit, and data-safety primitives are present even though only one tenant exists. Everything that is cheap-to-defer is deferred.

> Single-tenant **behaviour**, multi-tenant **foundation**.

---

## 2. Scope Decision (locks before coding)

| Decision | Resolution |
|---|---|
| Multi-tenancy now? | **Yes** — `tenant_id` + RLS on all tables, seeded with one tenant (`ACME`). No single-company shortcut |
| Tenant onboarding | **Atomic bootstrap transaction** built in foundation (tenant→workspace→admin role→default project+workflow→free subscription; see `DOMAIN_DESIGN.md §4`). Self-serve signup UI + enterprise SCIM = fast-follow; the **bootstrap UoW** is foundation |
| Realtime | **MVP = TanStack Query optimistic + refetch** (no realtime infra). Events emitted to outbox so **SSE seam** exists; SSE endpoint = fast-follow, WebSocket = triggered (`DOMAIN_DESIGN.md §5`) |
| Primary keys | **UUIDv7 / ULID** (time-ordered, globally unique) on every table from day 1 — enables future sharding with no ID migration. No auto-increment integers |
| Auth model | Identity module: session/JWT + rotating refresh; SSO/MFA **seams stubbed**, not implemented |
| Audit | Outbox + immutable audit log from first mutation |
| Email/scheduler | **Plumbing** built (provider + worker skeleton); full templates/flows fast-follow |
| Billing | **Not built**; tenant schema must allow future plan/seat fields |
| Repo topology | **Three repos** — `rally-api` (backend, this team) + `rally-web` (FE partner) + **`rally-infra`** (OpenTofu, `modules/` + `live/`). App↔FE boundary = **OpenAPI-first contract** (NestJS generates spec → FE codegen, contract tests). **Provision (`rally-infra`) decoupled from deploy** (app CI: Docker→ECR→`ecs update-service`); code deploy never runs `tofu apply`. See `ARCHITECTURE_CURRENT.md §8.1` |
| Data residency | **Single region (`ap-southeast-1`) for MVP.** EU/other residency = **triggered** (region routing / sharding — `ARCHITECTURE_FUTURE_SCALE.md §2`). EU-regulated customers gated until that trigger |
| i18n & timezone | **i18n-ready** (strings externalized) but ships **English-only**; per-user `locale` + `timezone` stored day-1 (UI converts, data stays UTC) |
| Attachments | DB stores **metadata only** (S3); **max 25 MB**, executable types blocked, **AV scan before serve** |
| Search | **Per-project Postgres filter** for MVP; global full-text search = **triggered** (OpenSearch) |
| Reports (MVP) | **Burndown + Velocity + Defect summary** only; Workload + Release-progress = fast-follow |
| Deferred features | Same functional deferrals as old Phase 0 (Portfolio/Quality/Release/Report business, full member UIs, etc.) |

---

## 3. Workstreams

### WS-1 — Platform Foundation
Multi-tenant schema + RLS, migration discipline (expand-contract), secrets (Secrets Manager + KMS), encryption at rest/in transit, backups + PITR + restore drill, **OpenTofu IaC (`rally-infra` repo, no Helm/Argo/Ansible)**, CI/CD + staging, OpenTelemetry + managed backend, health checks / graceful shutdown / correlation IDs.

### WS-2 — Identity & Access
Session/JWT auth, auth guard + session bootstrap, RBAC + ABAC permission engine (workspace + project scope), account protection (lockout, generic errors, session revoke), SSO + MFA **seams** (interfaces stubbed), no-secrets-in-logs guarantee.

### WS-3 — Cross-Cutting Conventions
Transactional outbox + immutable audit, idempotency keys, **UUIDv7/ULID primary keys** (sharding-safe), soft-delete + `deleted_at`, UTC-only timestamps, optimistic concurrency (`version`), input validation at boundary, per-tenant/user rate limiting.

### WS-4 — App Shell & Context  *(from existing Phase 0)*
URL routing + breadcrumb, `Company → Project → Team` context API with permission filter, error/access states (403/404/loading/retry), permission-based menu.

### WS-5 — Project & Work Foundation  *(from existing Phase 0)*
Project List (search/filter/pagination/aggregates), Create/Edit Project transaction (validation, owner, teams, audit), Archive/Restore + read-only enforcement, Team mapping/context.

### WS-6 — Platform Plumbing (skeleton)
Transactional email provider wired via outbox (invite/reset path ready), background job/scheduler worker skeleton.
---

## 4. Task Plan (merges existing P0 tasks + foundation primitives)

> IDs prefixed `F` for new foundation tasks; existing `P0-xx` tasks retained and re-anchored onto the multi-tenant base. Effort is **relative sizing** (S/M/L), not a fixed timebox — the original 1.5-day box applied only to the prototype and no longer holds.

| ID | WS | Task | Deliverable | Depends | Size |
|---|---|---|---|---|---|
| F-01 | WS-1 | **OpenTofu** base infra (`rally-infra` repo) | VPC, RDS (Multi-AZ, encrypted, PITR), ElastiCache/Valkey, S3, SNS/SQS, Secrets Manager, ECS cluster + service shell, GitHub-OIDC roles, remote state | — | L |
| F-02 | WS-1 | CI/CD + staging | GitHub Actions pipeline, staging env, preview envs, migration step | F-01 | M |
| F-02b | WS-1 | OpenAPI contract pipeline | NestJS OpenAPI gen; `rally-api` publishes spec on merge; `rally-web` codegen + **contract tests** in CI | F-02 | S |
| F-03 | WS-1 | OTel + observability | Instrumentation, managed backend, health checks, correlation IDs | F-01 | M |
| F-04 | WS-1 | Backup/DR drill | Automated backups, **tested restore**, documented RTO/RPO | F-01 | S |
| F-05 | WS-3 | Migration discipline | Expand-contract convention, migration tooling, seed framework | F-01 | S |
| P0-01′ | WS-1/3 | **Multi-tenant** Phase 0 migrations | `users`, auth, tenancy, roles, projects, teams, mapping — all with `tenant_id` + **RLS** + **UUIDv7/ULID PKs** + soft-delete + UTC | F-05 | L |
| P0-02′ | WS-3 | Seed tenant + admin | `ACME` tenant, Workspace Admin, role/permission, default settings | P0-01′ | S |
| F-06 | WS-3 | Outbox + audit log | Outbox table, relay→SQS, immutable audit log, idempotency keys | P0-01′ | M |
| P0-03′ | WS-2 | Auth backend | Session/JWT, refresh rotation, login/logout/revoke, lockout, generic errors | P0-01′ | M |
| F-07 | WS-2 | SSO/MFA seams | Pluggable OIDC/SAML + TOTP interfaces (stubbed), provider abstraction | P0-03′ | S |
| P0-04′ | WS-2 | Wire Login UI | Remove mock, loading/error/session handling | P0-03′ | S |
| P0-05′ | WS-2 | Auth guard + bootstrap | Protected layout, redirect + return URL | P0-03′ | S |
| F-08 | WS-2 | RBAC + ABAC engine | Permission codes, workspace+project scope, resolved-perm cache (Redis) | P0-01′ | M |
| P0-06′ | WS-4 | Router + metadata | URL routing, breadcrumb, refresh/back/forward | P0-05′ | M |
| P0-07′ | WS-4 | Context API | `Company→Project→Team` DTO, permission filter, context switch | P0-01′, F-08 | M |
| P0-08′ | WS-4 | Error/access states | Loading, 403, 404, generic error/retry | P0-05′, P0-06′ | S |
| P0-09′ | WS-5 | Project List API+UI | Search/status filter/pagination/aggregates | P0-01′, P0-07′ | M |
| P0-10′ | WS-5 | Create/Edit Project | Form DTO, validation, settings, owner, teams, audit (via outbox) | P0-09′ | M |
| P0-11′ | WS-5 | Archive/Restore | Soft archive, restore, read-only enforcement | P0-09′, P0-10′ | S |
| F-09 | WS-6 | Email plumbing | Provider (SES/Postmark) via outbox; invite/reset path ready | F-06 | S |
| F-10 | WS-6 | Scheduler skeleton | Background worker + job registry (no business jobs yet) | F-01 | S |
| F-11 | WS-1/3 | Security baseline | WAF, rate limiting, SAST/secret scan in CI, input validation conventions | F-02 | M |
| P0-12′ | QA | Verification + handoff | Contract tests, **tenant-isolation tests**, auth/project e2e, docs | all above | M |

---

## 5. Explicitly Out of Scope (deferred — unchanged from prototype intent)

| Item | Defer to |
|---|---|
| Workspace List/Create/Switch UI | N/A (single-tenant behaviour) |
| Full member/invitation UI | Next phase (plumbing ready) |
| Team CRUD / Project Members / Overview screens | Next phase |
| Notification persistence | Phase 4 |
| Portfolio / Quality / Release / Report business | Later phases |
| Billing, webhooks, import, i18n, MFA enforcement | Fast-follow (`PRODUCTION_READINESS.md` 🟡) |
| ClickHouse / Kafka / OpenSearch / sharding | Triggered (`ARCHITECTURE_FUTURE_SCALE.md`) |

---

## 6. Definition of Done (Foundation Phase exit criteria)

- [ ] All domain tables carry `tenant_id`; **RLS enforced and tested** (cross-tenant access provably blocked).
- [ ] All primary keys are **UUIDv7/ULID** (no auto-increment integers) — sharding-safe from day 1.
- [ ] Auth: session/JWT, refresh rotation, lockout, generic errors; no secrets in logs.
- [ ] Every mutation produces an outbox event + immutable audit entry.
- [ ] Migrations run via expand-contract; rollback path verified.
- [ ] Backups automated; **restore drill executed successfully**; RTO/RPO documented.
- [ ] Encryption at rest + in transit; secrets in Secrets Manager.
- [ ] OTel traces/metrics/logs flowing to backend; correlation IDs end-to-end.
- [ ] CI/CD green to staging; contract + tenant-isolation + auth/project e2e tests pass.
- [ ] Email + scheduler skeletons deployed (no business flows required yet).
- [ ] Project CRUD + App Shell + context working on the multi-tenant base.

> When these pass, the platform is a true enterprise foundation — every later feature and every scale step bolts on without re-platforming.

---

## 7. Locked Decisions (2026-06-20)

> Master registry is `ARCHITECTURE_CURRENT.md §11`. Below are the **phase-scoped** locks only.

1. **Primary language:** **NestJS/TypeScript** — LOCKED. Go reserved for future extracted hot-path services only.
2. **Compliance scope:** **SOC 2 + GDPR** baseline — LOCKED (designed in from day 1).
3. **Phase 0:** **SUPERSEDED** by this Foundation Phase — LOCKED (single-tenant behaviour, multi-tenant foundation).
