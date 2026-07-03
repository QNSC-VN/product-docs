# OpsHub — Roadmap

> Phased delivery. Each phase is independently useful and ships before the next starts.

---

## Guiding principle

**Read-first, then write.** Start with visibility (low risk, immediate value), then add
audited write actions. Ship the foundation first because every module depends on it.

---

## Phase 1 — Foundation + Asset Ops

> Self-contained, immediate value, no labor-law risk. Proves the Entra/Intune integration.

- SSO (Entra OIDC) + app RBAC
- Employee directory sync from Entra
- Approval workflow engine (generic request → approve → audit)
- Audit/evidence log
- Hardware inventory + device ↔ employee assignment + lifecycle
- Basic dashboards (asset utilization, assignment status)

**Exit criteria:** IT can manage every device and its assignment in one place, with audit.

## Phase 2 — Security Ops (visibility)

> Leverages the Phase 1 foundation; read-only first.

- Device compliance dashboard (encryption, patch, MFA, EDR) from Intune/Defender
- App-whitelist / Shadow IT findings (read-only)
- Security posture & drift (Secure Score, baseline vs actual)

**Exit criteria:** Single compliance view; security can see non-compliant devices and shadow IT.

## Phase 3 — Privileged Workflows

> First audited write actions, built on the workflow engine.

- Temp-admin request → approval → time-bound grant → auto-revoke
- Onboarding/offboarding fan-out (Entra + Intune + GitHub + licenses) with SLA timers
- Notifications (email/Teams/in-app)

**Exit criteria:** Onboarding/offboarding and temp-admin are one-click, time-bound, audited.

## Phase 4 — Service Requests + FinOps

> Builds on asset + workflow.

- Self-service request catalog (hardware/software/access)
- Software & SaaS license inventory + utilization + renewals
- Cost optimization (flag unused/duplicate licenses)
- Procurement & stock

**Exit criteria:** Employees self-serve requests; IT sees and optimizes license spend.

## Phase 5 — HR / Workforce

> Last, after the build-vs-buy decision (build only if no HRIS, else integrate).

- Timesheet
- Leave (request/approve, balances, calendar)
- Overtime (multiplier rules, payroll export)
- Night shift (logging, allowances)

**Exit criteria:** Workforce events live in OpsHub, linked to employee/device context.

## Cross-cutting (added incrementally)

- Guard-railed AI assistant (NL queries, anomaly flagging) — introduce from Phase 2.
- Compliance & evidence center — grows with each phase.
- Mobile-friendly self-service — from Phase 4.

---

## Sequencing rationale

| Phase | Risk | Value | Dependency |
|-------|------|-------|------------|
| 1 Foundation + Asset | Low | High | none |
| 2 Security visibility | Low | High | Phase 1 |
| 3 Privileged workflows | Medium | High | Phase 1 engine |
| 4 Service + FinOps | Medium | Medium | Phase 1 + 3 |
| 5 HR/Workforce | Higher (labor law) | Medium | build-vs-buy decision |
