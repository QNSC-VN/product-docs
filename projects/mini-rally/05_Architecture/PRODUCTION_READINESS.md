# Rally-Clone SaaS — Production Readiness

> **Purpose:** Single source of truth for *what production-grade SaaS requires* and *when each capability must land*. Complements the architecture docs (`ARCHITECTURE_CURRENT.md`, `ARCHITECTURE_FUTURE_SCALE.md`).
> **Classification lens — retrofit cost:**
> - 🔴 **Foundation (launch-blocking):** catastrophic or re-platform to add later → build day 1.
> - 🟡 **Fast-follow:** needed before GA / first paying enterprise; skeleton now, flesh out soon.
> - 🟢 **Scale / triggered:** safe to defer; add on a measured trigger.

---

## 1. How to read this

A feature being "important" does **not** put it in the foundation. The test is: *how expensive is it to add after we have live tenants and data?* High retrofit cost → foundation. Low retrofit cost → defer. This keeps the first phase lean **and** safe.

---

## 2. 🔴 Foundation — Launch-Blocking

These must exist (at least as working plumbing) before the first real customer byte.

### Tenancy & data integrity
- [ ] **Multi-tenancy**: `tenant_id` on every domain table + **PostgreSQL RLS** policies, even while only one tenant exists.
- [ ] **Provable tenant isolation**: automated tests asserting cross-tenant access is impossible.
- [ ] **Soft-delete + data lifecycle** columns (`deleted_at`, status) baked into schema.
- [ ] **UTC everywhere**: store timestamps in UTC; convert at presentation. No local-time columns.
- [ ] **Optimistic concurrency** (`version`) on editable entities.

### Identity & access
- [ ] **Identity module** with session/JWT (access + rotating refresh).
- [ ] **SSO-ready seam** (OIDC/SAML pluggable) — stub now, implement fast-follow.
- [ ] **MFA-ready seam** (TOTP/WebAuthn hook) — stub now.
- [ ] **RBAC + ABAC** permission engine (workspace + project scope, permission codes).
- [ ] **Account protection**: brute-force lockout, generic auth errors, session revoke.
- [ ] **No secrets in logs** (no password hash / raw token / token hash).

### Auditability & events
- [ ] **Transactional outbox**: every mutation writes domain row + event atomically.
- [ ] **Immutable audit log** (who/what/when/before/after) from the first mutation.
- [ ] **Idempotency keys** on mutating endpoints + event consumers.

### Data safety
- [ ] **Automated backups + PITR** (RDS) with a **tested restore drill**; documented **RTO/RPO**.
- [ ] **Encryption at rest** (RDS/S3 via KMS) + **TLS in transit**.
- [ ] **Secrets in AWS Secrets Manager**; rotation policy defined.

### Delivery & operability
- [ ] **Zero-downtime migrations** (expand-contract pattern) as the standing convention.
- [ ] **IaC** (Terraform) for all infra; reproducible environments.
- [ ] **CI/CD** (GitHub Actions, trunk-based) + **staging env** with prod parity.
- [ ] **OpenTelemetry** instrumentation from line one → managed backend (Grafana Cloud / CloudWatch).
- [ ] **Health checks, graceful shutdown, structured logs + correlation IDs**.
- [ ] **Test pyramid baseline**: unit + integration + API contract + tenant-isolation tests.

### Security baseline
- [ ] Input validation at boundary, parameterized queries, OWASP Top 10 controls.
- [ ] WAF on edge, per-tenant + per-user rate limiting.
- [ ] Dependency + secret scanning in CI (SAST).

### Minimum platform plumbing (skeleton in foundation)
- [ ] **Transactional email** provider wired (SES/Postmark) via outbox (invite/reset).
- [ ] **Background job/scheduler** worker skeleton (reminders, rollover, cleanup).

---

## 3. 🟡 Fast-Follow — Before GA / First Enterprise

Skeleton/seam exists in foundation; full implementation here.

### SaaS business plane
- [ ] **Billing/subscriptions/metering** (Stripe): plans, seats, usage limits, invoices, trials, dunning. *(Tenant model must already allow plan/seat fields.)*
- [ ] **Tenant lifecycle**: self-serve signup, provisioning, plan-limit enforcement, suspend, offboard, data-export-on-churn.

### Security & compliance ops
- [ ] **SSO (OIDC/SAML) + SCIM** provisioning — enterprise table-stakes.
- [ ] **MFA enforced** (TOTP/WebAuthn) + breach-password check.
- [ ] **Attachment AV/malware scanning** on upload.
- [ ] **Admin impersonation** (support "log in as") — consented + audited.
- [ ] **GDPR ops**: DSAR automation (export/erase), consent, cookie policy, **DPA + sub-processor list**.
- [ ] **DDoS/bot/abuse**: CAPTCHA on auth, quota tiers.

### Quality & delivery
- [ ] **Realtime via SSE** (notifications, activity feed, board-invalidate) over the outbox fan-out — seam emitted in foundation, endpoint here. *(WebSocket only on live-co-editing trigger.)*
- [ ] **Feature flags** (progressive rollout, kill-switch, per-tenant beta).
- [ ] **API versioning + deprecation policy**.
- [ ] **Load testing in CI**; performance budgets.
- [ ] **e2e test suite**.

### Reliability & insight
- [ ] **SLOs + error budgets** defined.
- [ ] **Status page + incident management + on-call** + runbooks + postmortems.
- [ ] **Product analytics** (PostHog/Amplitude).
- [ ] **FinOps**: resource tagging, budget alerts.

### Global readiness
- [ ] **i18n/l10n** (UI translation, locale formats). *(UTC + externalized strings already a foundation habit.)*
- [ ] **WCAG 2.1 AA accessibility**.

---

## 4. 🟢 Scale / Triggered — Defer Until Signal

Driven by triggers in `ARCHITECTURE_FUTURE_SCALE.md`.

- [ ] **Webhooks (outbound) + integrations** (GitHub, Slack, CI, Jira).
- [ ] **Import/migration tooling** (Jira/Rally/CSV).
- [ ] **OpenSearch** (search slows on Postgres).
- [ ] **ClickHouse** (reporting/OLAP outgrows Postgres).
- [ ] **Kafka** (replace SQS — many consumers, replay, throughput).
- [ ] **Table partitioning** → **tenant/region DB sharding** (writer ceiling / EU residency).
- [ ] **Service extraction** (notifications/realtime, search-indexer, reporting).
- [ ] **SAGA** (only for a flow spanning multiple service DBs).
- [ ] **Self-hosted LGTM + Alloy** (managed telemetry bill/control/volume trigger).
- [ ] **ArgoCD** (on EKS/k8s adoption).
- [ ] **Cloudflare R2** (object-storage egress-cost trigger).
- [ ] **Silo (DB-per-tenant)** enterprise isolation tier.
- [ ] **Pen test + bug bounty + SIEM export** (SOC 2 Type II cadence).
- [ ] **HIPAA / FedRAMP** (only if pursuing health/gov segments).

---

## 5. Priority Summary

| Tier | Mantra |
|---|---|
| 🔴 Foundation | "Impossible/painful to retrofit" → build now, even if only one tenant uses it |
| 🟡 Fast-follow | "Needed to sell + run safely" → skeleton now, complete before GA |
| 🟢 Triggered | "Pay when the metric demands it" → never premature |

> Cross-references: data/auth/audit design → `ARCHITECTURE_CURRENT.md`; evolution triggers → `ARCHITECTURE_FUTURE_SCALE.md`; first-phase task plan → `FOUNDATION_PHASE.md`.
