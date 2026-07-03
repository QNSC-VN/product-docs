# IT Infrastructure & Security Proposal
> Where we are today, what we should improve, and what it costs.
> Framed against our **current stack**: Microsoft 365 Business Standard, Windows Home laptops, GitHub Free, AWS, and self-built internal tools.

---

## 1. Our current state

| Area | What we have today | Limitation |
|------|--------------------|------------|
| **Identity** | Entra ID Free (comes with M365 Business Standard) | Can't enforce per-group rules, no device management |
| **Email / Office** | M365 Business Standard ($12.50/user/mo) | Good — but no Intune, no advanced threat protection |
| **Laptops** | Windows 11 **Home** | ❌ Can't domain-join, no BitLocker, no AppLocker, no Group Policy |
| **Antivirus** | Windows Defender (built-in) | Good baseline, but no central console / cross-device view |
| **Source control** | GitHub Free | No branch protection enforcement, no SSO |
| **Cloud** | AWS | Per-project — fine, cost handled per project |
| **Internal tools** | Building ourselves (PM, leave, OT, asset, request) | Need to give these SSO + secure hosting |
| **Monitoring** | None | No visibility into servers, uptime, or security events |
| **Backup** | OneDrive 1TB/user (in Business Standard) | Covers user files; need strategy for servers/AWS |

> **Key gap:** Windows Home blocks almost every device-level control. Fixing the OS edition is the highest-impact first step.

---

## 2. Proposal summary — what to change

| # | Change | Why it matters | Cost | Priority |
|---|--------|----------------|------|----------|
| 1 | **Windows 11 Home → Pro** | Required for domain join, BitLocker, AppLocker, Group Policy | ~$99 one-time/device | 🔴 Now |
| 2 | **Entra ID Join all laptops** | One company login for Windows + auto BitLocker key backup | $0 (Pro + Entra Free) | 🔴 Now |
| 3 | **Cloudflare Zero Trust** | DNS/web filtering + secure access to internal tools (no VPN) | $0 (≤50 users) | 🔴 Now |
| 4 | **GitHub Team** | Branch protection, required reviews, enforce 2FA | $4/user/mo | 🟠 Soon |
| 5 | **Bitwarden Teams** | Shared team credentials, stop password reuse | ~$4/user/mo | 🟠 Soon |
| 6 | **Endpoint protection upgrade** (Defender for Business or Sophos) | Central console, EDR, cross-device threat view | see §4 | 🟠 Soon |
| 7 | **Monitoring stack** (Grafana/Uptime Kuma + Wazuh) | Uptime + infra metrics + security events | $0 + ~$20/mo VPS | 🟡 Next |
| 8 | **M365 Business Standard → Premium** | Intune (MDM), Entra P1 (Conditional Access), Defender for Business, Windows Pro upgrade included | +$9.50/user/mo | 🟡 At ~15 ppl |
| 9 | **GitHub Team → Enterprise Cloud** | SAML SSO with company account + SCIM auto-provisioning | $21/user/mo | ⚪ Compliance |

---

## 3. Identity, SSO & laptops (the foundation)

### Windows edition — the blocker
Windows Home cannot join Entra ID, run BitLocker, AppLocker, or Group Policy. **Every laptop needs Windows 11 Pro.**

| Path | Cost | Notes |
|------|------|-------|
| Buy Win 11 Pro license per device | ~$99 one-time/device | Cheapest if staying on Business Standard |
| Buy laptops with Pro pre-installed | +$30–50 on purchase | Best for new hardware |
| Upgrade M365 Standard → **Business Premium** | +$9.50/user/mo | Includes Windows Pro upgrade right **+ Intune + Entra P1 + Defender for Business** |

> If we upgrade ~8+ laptops, **Business Premium often beats buying Pro licenses one-by-one** — and we get MDM and better security in the same step.

### SSO — one company login everywhere
Entra ID (we already have it free) becomes the single login for Windows + every app.

| Login target | How | Plan needed |
|--------------|-----|-------------|
| Windows laptop | Entra ID Join | Win Pro (free with Entra) |
| Microsoft apps (Teams, OneDrive, Outlook) | Built-in SSO | Already have it |
| AWS | IAM Identity Center + Entra SAML | **Free** |
| Our internal tools (PM, leave, OT, asset) | Entra OIDC login or Cloudflare Access | **Free** |
| GitHub (SAML SSO) | Entra SAML | GitHub **Enterprise Cloud** ($21/user) |
| Slack / Jira / Notion etc. | Entra SAML | Each app's paid tier |

> **Correction worth noting:** GitHub **Team ($4)** does *not* include SAML SSO — it gives branch protection + 2FA enforcement. SAML SSO with our company account requires GitHub **Enterprise Cloud ($21/user/mo)**. Recommend Team now, Enterprise only when compliance demands it.

---

## 4. Antivirus / endpoint protection — free vs paid

Windows Defender is genuinely good now (top AV-TEST scores). The question is whether we need a **central management console + EDR** (cross-device detection, isolate a compromised laptop remotely, threat hunting).

| Option | Type | Central console | Cost (approx) | Best for |
|--------|------|-----------------|---------------|----------|
| **Windows Defender** (current) | AV | ❌ Per-device only | $0 | Baseline — fine to start |
| **Microsoft Defender for Business** | AV + EDR | ✅ M365 portal | **Included in Business Premium** ($9.50/user upgrade) | Best value — bundles with MDM |
| **Sophos Intercept X Advanced** | AV + EDR | ✅ Sophos Central | ~$3–4/user/mo | Cross-platform, strong managed console, independent of M365 |
| **SentinelOne / CrowdStrike** | EDR/XDR | ✅ | ~$5–12/user/mo | Enterprise-grade, overkill for our size now |

**Recommendation:**
- **Short term:** keep Windows Defender (free) + run our hardening script.
- **When upgrading to Business Premium:** use **Defender for Business** — no extra cost, integrates with Intune and our identity.
- **Choose Sophos** only if we want a dedicated security console *now* without paying for the full Business Premium upgrade. Defender for Business wins on cost since it's bundled.

---

## 5. Monitoring — infra, uptime & security

Different tools for different jobs. We need three layers:

| Layer | Purpose | Recommended (free) | Paid alternative |
|-------|---------|--------------------|--------------------|
| **App / infra metrics** | CPU, memory, API latency, DB health | **Prometheus + Grafana** (modern, great for our web apps + containers) | Datadog (~$15/host/mo) |
| **Uptime / status** | Is the site up? alert if down | **Uptime Kuma** (simple, self-hosted, status page) | Better Uptime, Pingdom |
| **Security events / SIEM** | Login attempts, malware, file changes | **Wazuh** (EDR + SIEM, open source) | Microsoft Sentinel (pay-per-GB) |
| **AWS resources** | AWS service metrics, billing alarms | **AWS CloudWatch** (built-in) | — |

**On Zabbix:** it's solid and mature, but it shines for **traditional servers + network gear (SNMP)**. Since we're building **cloud-native web apps on AWS**, **Prometheus + Grafana** is the better fit — better for containers, app metrics, and modern dashboards. Use **Zabbix only if** we end up with lots of on-prem servers or network appliances to monitor.

> All recommended monitoring tools are free/open-source. Cost is just a small VPS (~$20/mo) to host Grafana + Wazuh + Uptime Kuma — can share one box to start.

---

## 6. Securing our self-built internal tools

We're building PM, employee, leave, OT, asset, and request systems ourselves. To make them enterprise-grade:

| Concern | Approach | Cost |
|---------|----------|------|
| **Login** | Entra ID OIDC (MSAL library) → employees log in with company account + MFA | $0 |
| **Or, faster** | Put the app behind **Cloudflare Access** → it handles company-account SSO, no auth code needed | $0 (≤50 users) |
| **Authorization** | Map app roles to **Entra ID groups** (Engineering, HR, Manager) | $0 |
| **Hosting** | AWS (per-project cost, calculated separately) | per project |
| **Secrets** | AWS Secrets Manager / SSM Parameter Store — no hardcoded keys | minimal |
| **Audit** | Log all approve/reject actions (leave, OT, asset requests) for accountability | $0 |

> This is the big win: **the request/approval workflows we're building (temp admin, leave, OT, asset) all tie into the same company identity** — one account controls access to everything, and offboarding instantly revokes it.

---

## 7. AWS (mentioned — costed per project)

| Item | Approach |
|------|----------|
| Login to AWS console | Entra ID SAML via IAM Identity Center (free SSO) |
| CI/CD → AWS auth | OIDC federation — **no long-lived access keys** |
| Per-project cost | Calculated individually as projects are built |
| Backups | AWS Backup for RDS/EBS; S3 versioning for assets |
| Monitoring | CloudWatch + billing alarms |

---

## 8. Office network & backup

| Item | Decision | Cost |
|------|----------|------|
| **Physical server for AD** | ❌ Not needed — cloud Entra ID replaces it | $0 |
| **NAS for backup** | ⏳ Defer — OneDrive 1TB/user covers user files; AWS Backup covers cloud | $0 now |
| **Office network** (router, managed switch, Wi-Fi APs — Ubiquiti) | One-time, enables VLANs + secure Wi-Fi | ~$1,100 one-time |
| **Printers** | Network-capable units on isolated VLAN — no print server | per printer |

---

## 9. Cost roadmap (20 users, approximate)

```
PHASE 0 — Now (low cost, high impact)
  Win 11 Pro on all laptops        ~$99 × 20  = $1,980 one-time
  Entra ID Join                    $0
  Cloudflare Zero Trust            $0
  Windows Defender + hardening     $0
  Monitoring (Grafana/Wazuh VPS)   ~$20/mo
  → Recurring: ~$20/month

PHASE 1 — Soon
  GitHub Team                      20 × $4   = $80/mo
  Bitwarden Teams                  20 × $4   = $80/mo
  → Recurring: ~$180/month

PHASE 2 — At ~15 people / first compliance ask
  M365 Standard → Business Premium  20 × $9.50 = $190/mo extra
    (adds Intune MDM + Entra P1 + Defender for Business
     + Windows Pro upgrade — can skip the $99 Pro buys)
  → Recurring: ~$370/month

PHASE 3 — Enterprise / customer compliance
  GitHub Team → Enterprise Cloud    20 × $21  = $420/mo (SAML SSO + SCIM)
  Microsoft Sentinel (SIEM)         ~$50–150/mo
  → Recurring: ~$900/month
```

> **Note:** If we plan to upgrade to **Business Premium** soon (Phase 2), **don't buy individual Win 11 Pro licenses** — the Pro upgrade is included. Buy Pro one-by-one only if staying on Business Standard long-term.

---

## 10. Decisions needed

1. **Windows 11 Pro** — buy per-device ($99 each) now, **or** commit to Business Premium upgrade (includes Pro + MDM + better security)?
2. **Endpoint protection** — stay on free Defender for now, plan Defender for Business via Premium (vs paying separately for Sophos)?
3. **GitHub** — approve Team ($4/user) now for branch protection + 2FA; defer Enterprise ($21) until SAML SSO is required?
4. **Approve free rollout immediately** — Entra ID Join, Cloudflare Zero Trust, monitoring stack (only ~$20/mo VPS cost).

---

*Detailed step-by-step implementation guides (for IT execution):*
- *Free-tier build:* [ENTERPRISE_LAPTOP_SETUP_FREE.md](ENTERPRISE_LAPTOP_SETUP_FREE.md)
- *Full enterprise build:* [ENTERPRISE_LAPTOP_SETUP.md](ENTERPRISE_LAPTOP_SETUP.md)
