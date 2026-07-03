# OpsHub — Product Overview

> Status: Draft · Date: 2026-06-23 · Owner: TBD

---

## 1. Vision

OpsHub is an **internal Employee & Asset Operations Platform** — a single portal
where IT and HR manage the full lifecycle of an employee and the resources tied to
them: their device, their software, their access, and their working time.

It is an **orchestration and visibility layer**, not a replacement for enterprise
tooling. Microsoft Intune, Entra ID, and Defender remain the systems of enforcement;
OpsHub aggregates their data, adds workflow and audit, and fills the gaps between
consoles.

## 2. Problem

Today the work described in the enterprise laptop setup is spread across ~8 consoles
(Entra, Intune, Defender, Purview, Zscaler, GitHub, HR system, spreadsheets) with:

- No unified view of compliance, assets, or access
- Manual, error-prone onboarding/offboarding checklists
- No shared approval or audit trail across IT and HR requests
- Asset and license data living in spreadsheets (no source of truth)
- Workforce events (leave, OT, night shift) disconnected from IT context

## 3. Goals

- **Single source of truth** linking employee ↔ device ↔ software ↔ access ↔ time.
- **One reusable approval + audit engine** for every privileged/time-bound request.
- **Read-first visibility** that grows into safe, audited write actions.
- **Compliance evidence** generated automatically (2026: this is an obligation).

## 4. Non-Goals

- Not an MDM/EDR — never enforces policy on the device directly.
- Not an IdP — Entra remains identity authority.
- Not a payroll engine — integrates with payroll/HRIS, does not replace it.
- No fully-autonomous AI actions on privileged operations (guard-railed only).

## 5. Domains & Modules

| Domain | Modules |
|--------|---------|
| **Foundation** | SSO + RBAC, Employee Directory, Approval Workflow Engine, Notifications, Audit/Evidence Log, AI Assistant (guard-railed) |
| **IT Security Ops** | Device Compliance, App Whitelist / Shadow IT, Temp Admin (PIM), Security Posture & Drift, Onboarding/Offboarding |
| **IT Asset & Service Ops** | Hardware Inventory, Assignment & Lifecycle, Software & SaaS / FinOps, Service Requests / Helpdesk, Procurement & Stock |
| **HR / Workforce** | Timesheet, Leave, Overtime, Night Shift, Attendance (optional) |

See [01_CAPABILITY_MAP.md](01_CAPABILITY_MAP.md) for the full feature breakdown.

## 6. What it manages

People · Devices · Peripherals · Software licenses · SaaS subscriptions ·
Device compliance · App-whitelist violations · Temp-admin grants · Security drift ·
Onboarding/offboarding · Service requests · Procurement/stock · Timesheets · Leave ·
Overtime · Night shifts · Approvals · Audit evidence · Costs (FinOps) · Analytics.

## 7. Primary users

| Role | Uses OpsHub to |
|------|----------------|
| Employee | Request hardware/software/access, submit leave/OT, view assigned devices |
| Manager | Approve requests, view team compliance and time |
| Helpdesk | Fulfil service requests, manage stock |
| IT Admin | Manage assets, approve temp admin, track compliance/drift |
| HR | Manage leave/OT/shift, run workforce reports |
| Security | Review posture, shadow IT, audit privileged access |
| Auditor | Pull compliance evidence (read-only) |

## 8. 2026 alignment

Grounded in current ITAM/ITSM research (InvGate, ITSM.tools, Scalefusion, Alloy, ALVAO):

- **ITAM + ITSM convergence** → assets and service requests in one platform.
- **Single source of truth** for hardware, software, SaaS, hybrid cloud.
- **Guard-railed AI** → assists and flags, never auto-acts on privileged operations.
- **FinOps + ITAM** → license/SaaS cost optimization built in.
- **Compliance-as-obligation** → asset lifecycle and access data as audit evidence.
