# Enterprise Laptop Setup Guide
> Strict security. Global scale. Windows + macOS + Linux.

---

## Table of Contents
1. [Prerequisites & Licensing](#1-prerequisites--licensing)
2. [Identity & Active Directory](#2-identity--active-directory)
3. [User Account Structure](#3-user-account-structure)
4. [Device Enrollment & MDM](#4-device-enrollment--mdm)
5. [Security Policies (GPO / Intune)](#5-security-policies-gpo--intune)
6. [App Whitelist / Blacklist](#6-app-whitelist--blacklist)
7. [Firewall & Proxy](#7-firewall--proxy)
8. [Endpoint Scanning & EDR](#8-endpoint-scanning--edr)
9. [Disk Encryption](#9-disk-encryption)
10. [Patch Management](#10-patch-management)
11. [Audit & Logging](#11-audit--logging)
12. [Privileged Access (Temp Admin)](#12-privileged-access-temp-admin)
13. [Data Loss Prevention (DLP)](#13-data-loss-prevention-dlp)
14. [VPN & Remote Access](#14-vpn--remote-access)
15. [Email & Phishing Protection](#15-email--phishing-protection)
16. [WSL (Windows Subsystem for Linux)](#16-wsl-windows-subsystem-for-linux)
17. [Phishing-Resistant MFA & Passkeys](#17-phishing-resistant-mfa--passkeys)
18. [Firmware & Secure Boot](#18-firmware--secure-boot)
19. [Attack Surface Reduction (ASR) Rules](#19-attack-surface-reduction-asr-rules)
20. [Credential Guard & LSA Protection](#20-credential-guard--lsa-protection)
21. [PowerShell Hardening](#21-powershell-hardening)
22. [Browser Hardening & Extension Control](#22-browser-hardening--extension-control)
23. [AI Tool & Copilot Data Governance](#23-ai-tool--copilot-data-governance)
24. [OAuth & Third-Party App Consent](#24-oauth--third-party-app-consent)
25. [Kernel DMA & Thunderbolt Protection](#25-kernel-dma--thunderbolt-protection)
26. [Bluetooth & Wireless Hardening](#26-bluetooth--wireless-hardening)
27. [Insider Threat & UEBA](#27-insider-threat--ueba)
28. [Supply Chain Integrity](#28-supply-chain-integrity)
29. [Continuous Threat Exposure (CTEM)](#29-continuous-threat-exposure-ctem)
30. [Incident Response Readiness](#30-incident-response-readiness)
31. [New Employee Onboarding Checklist](#31-new-employee-onboarding-checklist)
32. [Employee Exit Checklist](#32-employee-exit-checklist)
33. [Linux Endpoints (Engineering)](#33-linux-endpoints-engineering)
34. [Mobile Device & BYOD Policy](#34-mobile-device--byod-policy)
35. [PKI & Certificate Lifecycle](#35-pki--certificate-lifecycle)
36. [Developer Security](#36-developer-security)
37. [Endpoint Backup](#37-endpoint-backup)
38. [Asset Inventory & CMDB](#38-asset-inventory--cmdb)

---

## 1. Prerequisites & Licensing

### Required Licenses (per user/month)
| License | Covers | Cost Tier |
|--------|--------|-----------|
| **Microsoft 365 E3** | Entra ID P1, Intune, Defender, Office | Mid |
| **Microsoft 365 E5** | Above + Defender for Endpoint P2, Purview DLP, SIEM | High |
| **Entra ID P2** (add-on) | PIM (temp admin), Conditional Access advanced | Required for PAM |
| **Jamf Pro** (Mac only) | Mac MDM if not using Intune | Optional |

> **Recommendation:** M365 E5 + Entra ID P2 for strict enterprise.

---

## 2. Identity & Active Directory

### Option A: Cloud-Only (Entra ID — recommended)
No on-prem server needed. Best for distributed/global teams.

```
portal.azure.com → Microsoft Entra ID
```

**Steps:**
1. Create tenant at `entra.microsoft.com`
2. Add verified domain (e.g. `yourcompany.com`)
3. Create Organizational Units (OUs) as Groups:
   - `Engineering`, `HR`, `Finance`, `IT-Admin`
4. Create user accounts (format: `firstname.lastname@yourcompany.com`)
5. Assign licenses per user or per group
6. Enable MFA (mandatory, see Section 5)

### Option B: On-Premises Active Directory
Use if compliance requires local data residency.

**Requirements:**
- Windows Server 2022 (physical or VM, min 4 cores / 8GB RAM)
- Static IP, internal DNS

**Steps:**
1. Install Windows Server 2022
2. `Server Manager → Add Roles → Active Directory Domain Services`
3. Promote to Domain Controller:
   - Set forest root domain: `corp.yourcompany.local`
   - Set DSRM password (store in password vault!)
4. Create OUs: `Computers`, `Users`, `ServiceAccounts`, `AdminAccounts`
5. Join all Windows laptops to domain:
   - `Settings → System → About → Domain → corp.yourcompany.local`
6. For Mac: bind via `System Settings → Users & Groups → Network Account Server`
   - Or use Jamf / Intune (preferred — see Section 4)

### Hybrid (On-Prem + Entra ID Sync)
Use **Entra ID Connect** to sync on-prem AD to cloud:
```
Download: Microsoft Entra Connect
Install on domain controller
Configure: Password Hash Sync or Pass-Through Auth
```

---

## 3. User Account Structure

### Account Types
| Type | Purpose | Privileges |
|------|---------|-----------|
| **Standard User** | Daily work | No install, no admin |
| **Temp Admin** | Installs, config changes | Time-limited (via PIM) |
| **IT Admin** | Device management | Full local admin |
| **Service Account** | Automated tasks, apps | Locked-down, no interactive login |
| **Break-Glass Account** | Emergency IT access | Stored offline, MFA-protected |

### Standard User Rules (enforced via GPO/Intune)
- Cannot install software
- Cannot change system settings (network, firewall, time)
- Cannot disable security tools (Defender, EDR agent)
- Cannot access other users' directories
- Cannot use `cmd.exe` or `PowerShell` without approval (optional — strict mode)
- Desktop and Downloads auto-cleared on logout (optional)
- USB storage blocked (see Section 6)

### Password Policy
> Aligned with **NIST SP 800-63B (2017, revised 2024)** — forced periodic rotation is explicitly **not recommended**; it produces predictable patterns (`Password1!` → `Password2!`) without improving security.

```
Minimum length:          15 characters (longer = stronger; no upper limit)
Complexity:              Encouraged — no mandatory rules (avoids gaming the policy)
Maximum age:             None — change ONLY on confirmed or suspected compromise
Minimum age:             None
History:                 12 passwords remembered
Account lockout:         10 failed attempts → 15 min auto-unlock (rate limiting)
Reset lockout after:     15 minutes
Breached password check: Enabled — Entra ID Password Protection blocks known
                         breached passwords and company-specific banned terms
```

**Enable Entra ID Password Protection:**
```
Entra ID → Security → Authentication methods → Password protection
  → Enable password protection on-premises: Yes
  → Lockout threshold: 10
  → Custom banned passwords: add company name, product names, common patterns
  → Enforce custom list: Yes
```

---

## 4. Device Enrollment & MDM

### Windows — Microsoft Intune
1. `portal.azure.com → Intune → Devices → Windows → Enrollment`
2. Enable **Windows Autopilot** for new laptops (zero-touch):
   - Upload hardware hash CSV from vendor
   - Assign deployment profile → device auto-enrolls on first boot
3. For existing laptops:
   - `Settings → Accounts → Access work or school → Connect`

### macOS — Microsoft Intune (or Jamf)
**Intune:**
1. `Intune → Devices → macOS → Enrollment → Apple MDM Push Certificate`
2. Upload APNs certificate from Apple Business Manager
3. User downloads **Company Portal** app → enrolls device

**Jamf Pro (better Mac support):**
1. Purchase Jamf Pro license
2. Configure Apple School/Business Manager integration
3. Devices auto-enroll via Automated Device Enrollment (ADE)

### Compliance Policy (block non-compliant devices)
All devices must meet before accessing company resources:
- [ ] Enrolled in MDM
- [ ] OS version >= minimum (Win 11 22H2 / macOS 14+)
- [ ] Disk encrypted (BitLocker / FileVault)
- [ ] Antivirus active and up to date
- [ ] No jailbreak / root
- [ ] Screen lock configured
- [ ] MFA registered

---

## 5. Security Policies (GPO / Intune)

### Authentication
- **MFA mandatory** for all accounts (Microsoft Authenticator app)
- **Passwordless** option: Windows Hello for Business (fingerprint/PIN + TPM)
- **Conditional Access rules:**
  - Block login from outside approved countries
  - Block legacy authentication protocols (NTLM, basic auth)
  - Require compliant device to access M365, AWS, internal apps
  - High-risk sign-in → require MFA re-authentication

### Screen & Session
```
Screen lock:             5 minutes idle
Screen saver:            Password required on resume
Session timeout:         8 hours (force re-login)
Remote desktop:          Disabled for standard users
```

### Windows-Specific GPO Settings
Apply via: `Group Policy Management → Default Domain Policy`
```
Computer Config → Policies → Windows Settings → Security Settings

Password Policy:         (see Section 3)
Account Lockout:         (see Section 3)
Audit Policy:            (see Section 11)
User Rights Assignment:
  - "Deny log on locally" → Service Accounts
  - "Allow log on locally" → Domain Users, IT-Admins only
  - "Shut down the system" → IT-Admins only
Security Options:
  - Rename admin account → custom name
  - Do not display last username on login screen
  - Require Ctrl+Alt+Del to log in
  - Disable anonymous SID/name translation
```

Apply **Microsoft Security Baselines:**
```
Download: Microsoft Security Compliance Toolkit
Import GPO backups for: Windows 11, Edge, Defender
Apply to all device OUs
```

---

## 6. App Whitelist / Blacklist

### Windows — Windows Defender Application Control (WDAC)
Stricter than AppLocker. Kernel-level enforcement.

**Create policy:**
```powershell
# Generate base policy
New-CIPolicy -Level Publisher -FilePath "BasePolicy.xml" -ScanPath "C:\Windows"

# Add approved apps
Add-SignerRule -FilePath "BasePolicy.xml" -CertificatePath "approved-app.cer" -User

# Convert and deploy
ConvertFrom-CIPolicy -XmlFilePath "BasePolicy.xml" -BinaryFilePath "SIPolicy.p7b"
Copy-Item "SIPolicy.p7b" -Destination "C:\Windows\System32\CodeIntegrity\"
```

**Via Intune:**
`Intune → Endpoint security → Application control → Create policy (WDAC)`

### macOS — Gatekeeper + MDM
```
# Block apps not from App Store or identified developers
spctl --master-enable  # Gatekeeper on

# Via Intune/Jamf policy:
Allowed sources: App Store and identified developers only
```

### Blacklisted Apps (examples — adjust to policy)
| Category | Examples |
|----------|---------|
| Remote access (unapproved) | TeamViewer, AnyDesk, UltraVNC |
| P2P / Torrents | uTorrent, BitTorrent, qBittorrent |
| Crypto mining | Any `.exe` matching miner signatures |
| Unapproved cloud storage | Personal Dropbox, Google Drive (use OneDrive instead) |
| Unapproved messaging | Personal WhatsApp Desktop, Telegram (unless approved) |
| Password managers (personal) | Use company-approved one (1Password, Bitwarden Business) |
| Games | Steam, Epic Games Launcher |
| Browser extensions | Block all except approved list via GPO/Intune |

### USB / Peripheral Control
```
Block: USB storage (flash drives, external HDD)
Allow: USB keyboards, mice, approved company hardware
Exception: IT-Admin can grant per-device, per-time exception via MDM
```
`Intune → Endpoint security → Attack surface reduction → Device control`

---

## 7. Firewall & Proxy

### Host-Based Firewall

**Windows Defender Firewall (GPO):**
```
Default: Block all inbound, allow established outbound
Allow inbound: RDP only from IT subnet (e.g. 10.0.1.0/24)
Block outbound: Specific ports/IPs via rules
Enable logging: Dropped packets + successful connections
```

**macOS:**
```
System Settings → Network → Firewall → Enable
Enable stealth mode (don't respond to ICMP)
Block all incoming connections (allow exceptions per app)
```

### Corporate Proxy — Zscaler (recommended) or Squid

**Zscaler Internet Access (cloud proxy):**
- All web traffic tunneled through Zscaler cloud
- SSL inspection (decrypt/inspect HTTPS)
- Block categories: malware, phishing, adult, P2P, anonymizers
- Custom block list + allow list
- User-level policy (engineering vs HR vs finance)
- Deploy Zscaler Client Connector via Intune/Jamf

**Configure via GPO (on-prem proxy):**
```
User Config → Policies → Windows Settings → Internet Explorer → Connection
  → Proxy Settings → proxy.yourcompany.com:8080
  → Bypass for: localhost, 10.*, *.yourcompany.com
```

### DNS Security
- Use **Cloudflare Gateway** or **Cisco Umbrella** for DNS filtering
- Block malicious/phishing domains at DNS layer
- Log all DNS queries per device

---

## 8. Endpoint Scanning & EDR

### Endpoint Detection & Response (EDR) — Choose One

| Tool | Strength | Platform |
|------|---------|---------|
| **Microsoft Defender for Endpoint P2** | Deep M365 integration, free with E5 | Win + Mac |
| **CrowdStrike Falcon** | Industry leader, best detection rate | Win + Mac + Linux |
| **SentinelOne** | Autonomous AI response | Win + Mac + Linux |

**Deploy via Intune:**
```
Intune → Endpoint security → Microsoft Defender for Endpoint → Onboard
```

**Capabilities to enable:**
- Real-time protection
- Cloud-delivered protection
- Automatic sample submission
- Tamper protection (cannot be disabled by user)
- Network protection (block malicious IPs/domains)
- Controlled folder access (ransomware protection)
- Attack surface reduction rules

### Vulnerability Scanning
- **Microsoft Defender Vulnerability Management** (built into MDE)
- **Qualys** or **Tenable.io** for deeper scan
- Schedule weekly scan, auto-alert for CVSS >= 7.0
- Track: unpatched CVEs, misconfigured settings, expired certs

### Scheduled Scans
```
Full disk scan:     Weekly (Sunday 2am)
Quick scan:         Daily (6am, before work hours)
Network scan:       Daily from security subnet
Malware scan:       On every USB plug-in event
```

---

## 9. Disk Encryption

### Windows — BitLocker
```powershell
# Enable via GPO:
Computer Config → Admin Templates → Windows Components → BitLocker Drive Encryption
  → Require additional auth at startup: Enabled
  → OS Drives → Encryption method: AES-256

# Store recovery keys in Entra ID automatically
Computer Config → Admin Templates → Windows Components → BitLocker
  → Store BitLocker recovery info in AD DS: Enabled
```

**Via Intune:**
`Intune → Endpoint security → Disk encryption → Create policy → BitLocker`
- Algorithm: AES-256-XTS
- Require encryption at startup
- Escrow recovery key to Entra ID

### macOS — FileVault
```
Via Intune/Jamf: Enable FileVault on enrollment
Recovery key: Escrowed to MDM server
```

---

## 10. Patch Management

### Windows — Intune Update Rings
```
Intune → Devices → Windows → Update rings

Ring 1 (IT/Pilot):    Receive updates immediately
Ring 2 (General):     7-day deferral after Ring 1 passes
Ring 3 (Critical):    14-day deferral (finance, exec)

Quality updates:      Max 7-day deferral
Feature updates:      Max 30-day deferral
Deadline:             Force install after 3 days
Restart:              Outside business hours (8pm-6am)
```

### macOS — Software Update Policy
`Intune/Jamf → Configuration profiles → Software Update`
- Require latest minor OS within 30 days
- Block user from deferring security patches > 7 days

### Third-Party App Patching
- **Patch My PC** (Windows, integrates with Intune)
- **Munki** (macOS, open source)
- **Automox** (cross-platform)

---

## 11. Audit & Logging

### Windows Audit Policy (GPO)
```
Computer Config → Security Settings → Advanced Audit Policy

Logon/Logoff:
  ✓ Audit Logon (Success, Failure)
  ✓ Audit Logoff (Success)
  ✓ Audit Account Lockout (Success, Failure)
  ✓ Audit Special Logon (Success)

Account Management:
  ✓ Audit User Account Management (Success, Failure)
  ✓ Audit Security Group Management (Success, Failure)
  ✓ Audit Computer Account Management (Success, Failure)

Privilege Use:
  ✓ Audit Sensitive Privilege Use (Success, Failure)

Object Access:
  ✓ Audit File System (Success, Failure) — on sensitive dirs
  ✓ Audit Removable Storage (Success, Failure)

Policy Change:
  ✓ Audit Policy Change (Success, Failure)
  ✓ Audit Authentication Policy Change (Success)

System:
  ✓ Audit System Integrity (Success, Failure)
  ✓ Audit Security System Extension (Success)
```

### Log Retention
```
Security Event Log:   Max size 256MB, archive when full
Retention:            Minimum 1 year (regulatory standard)
```

### SIEM — Centralized Log Collection
Forward all device logs to SIEM:

| SIEM Option | Notes |
|------------|-------|
| **Microsoft Sentinel** | Best with M365/Entra ID, pay-per-GB |
| **Splunk** | Industry standard, expensive |
| **Elastic SIEM** | Open source option |

**Key alerts to configure in SIEM:**
- Multiple failed logins → same user, different IPs
- Admin account used outside business hours
- New local admin account created
- EDR tamper attempt
- Mass file deletion (ransomware signal)
- Sensitive file access by non-owner
- Login from blacklisted country

---

## 12. Privileged Access (Temp Admin)

### Privileged Identity Management (PIM) — Entra ID P2

**Setup:**
1. `Entra ID → Identity Governance → Privileged Identity Management`
2. Create role: `Local Admin - Temporary`
3. Configure:
   - Max duration: 2 hours
   - Require: MFA + business justification
   - Approval required: IT Admin must approve
   - Notification: Email to IT + manager on activation

**User workflow:**
```
1. User requests temp admin via PIM portal
2. Submits: reason, duration, affected machine
3. IT Admin approves (or auto-approve for approved reasons)
4. User gets admin for max 2 hours
5. Auto-revoked after time expires
6. Full audit trail in Entra ID logs → SIEM
```

**For on-prem:** Use **Microsoft LAPS (Local Administrator Password Solution)**
```powershell
# Deploy LAPS via GPO
# Each machine gets unique, rotating local admin password
# Stored in AD, visible only to IT Admins
# Auto-rotates every 30 days
```

---

## 13. Data Loss Prevention (DLP)

### Microsoft Purview DLP
`Microsoft Purview → Data loss prevention → Policies`

**Create policies for:**
- Block sending files with SSN / passport numbers via email
- Block uploading sensitive docs to personal cloud storage
- Warn when copying > 10 files to USB (block if classified)
- Block printing sensitive documents outside office network

### File Classification
`Microsoft Purview → Information Protection → Labels`
```
Labels:
  Public        → No restriction
  Internal      → Block external share
  Confidential  → Encrypt, no USB, no personal email
  Strictly Confidential → Encrypt + require approval to open
```

Apply labels: manually or auto-detect via content inspection (credit card patterns, PII, etc.)

---

## 14. VPN & Remote Access

### Zero Trust Network Access (ZTNA) — recommended
Replace traditional VPN with:
- **Zscaler Private Access (ZPA)**
- **Microsoft Entra Private Access**
- **Cloudflare Access**

Users access internal apps without full network access. Per-app tunnels. No lateral movement.

### Traditional VPN (if needed)
- **Cisco AnyConnect** or **Palo Alto GlobalProtect**
- Always-on VPN: connects automatically, cannot be disabled by user
- Split tunnel: only company traffic via VPN, personal browsing direct
- Certificate-based auth + MFA

---

## 15. Email & Phishing Protection

### Microsoft Defender for Office 365 (Plan 2)
```
Anti-phishing:
  ✓ Enable impersonation protection
  ✓ Enable mailbox intelligence
  ✓ Action on phish: Quarantine

Safe Links:
  ✓ Rewrite all URLs
  ✓ Block click-through on malicious links
  ✓ Scan links in Office documents

Safe Attachments:
  ✓ Dynamic delivery (preview while scanning)
  ✓ Detonate suspicious attachments in sandbox
  ✓ Block malware attachments

Anti-spam:
  ✓ SPF, DKIM, DMARC configured on domain
```

### User Training
- **Microsoft Attack Simulator**: send fake phishing emails quarterly
- Mandatory security awareness training (annual minimum)
- Report phishing button in Outlook

---

## 16. WSL (Windows Subsystem for Linux)

> **WSL is a critical security gap most enterprise policies miss.**

### Why WSL is dangerous by default
```
Standard user → opens WSL → runs as root inside Linux
→ can install any Linux tool (curl, nc, python, etc.)
→ bypasses Windows Defender (Linux processes not scanned by default)
→ accesses full Windows filesystem from Linux
→ exfiltrates data via Linux network stack
→ WDAC / AppLocker = useless inside WSL
```

### Policy by Role

| Role | WSL Policy |
|------|-----------|
| General staff (HR, Finance, Sales, etc.) | **Blocked** via GPO/Intune |
| Engineering | Allowed — restricted, proxy enforced, audited |
| IT Admin | Allowed — fully audited via MDE |

---

### Option 1: Block WSL Entirely (default for all non-engineers)

**Via GPO:**
```
Computer Config → Admin Templates → Windows Components
  → Windows Subsystem for Linux → Allow WSL: Disabled
```

**Via Intune — PowerShell script (deploy to "General Staff" group):**
```powershell
Disable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux -NoRestart
Disable-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform -NoRestart
```

**Via Intune Settings Catalog:**
```
Settings Catalog → search "WSL" → "Allow WSL" → Disabled
```

---

### Option 2: Allow WSL for Engineering (Restricted)

**Deploy enforced `.wslconfig` via Intune (push to `%USERPROFILE%\.wslconfig`):**
```ini
[wsl2]
networkingMode=mirrored
firewall=true
dnsTunneling=false

[experimental]
autoMemoryReclaim=gradual
```

**Additional restrictions:**
| Control | How |
|--------|-----|
| Block direct internet from WSL | Windows Firewall: block `vEthernet (WSL)` adapter outbound |
| Force corporate proxy | Deploy env vars: `http_proxy`, `https_proxy` via MDM |
| Block new distro installs | Intune: allow only approved distros (e.g. Ubuntu 22.04) |
| Audit all WSL activity | MDE: alert on `wsl.exe` + suspicious child processes |
| Scan WSL filesystem | Defender for Endpoint P2 — enables limited WSL scanning |

**SIEM alerts to add:**
- `wsl.exe` launched by non-engineering user
- Network connection from WSL process to external IP
- File copy from Windows drive to WSL home directory (bulk)

---

### Option 3: Cloud Dev Environment (Best for Engineering)
Block WSL locally. Provide cloud-based dev environment instead:

| Tool | Description |
|------|-------------|
| **GitHub Codespaces** | Cloud VS Code — nothing runs on laptop |
| **Microsoft Dev Box** | Cloud VM, scoped network, full audit trail |
| **Coder / Daytona** | Self-hosted cloud dev workspaces |

All code runs in cloud. Laptop stays fully locked down. Every action audited.

---

## 17. Phishing-Resistant MFA & Passkeys

> **Push-notification MFA is not enough.** MFA fatigue attacks bypass it. CISA + NIST SP 800-63B require phishing-resistant MFA for high-value environments.

### What to use instead

| Method | Phishing-resistant? | Notes |
|--------|-------------------|-------|
| SMS OTP | No | Never use |
| Authenticator app push | No | Vulnerable to MFA fatigue/prompt bombing |
| TOTP (6-digit code) | Partial | Better but still phishable |
| **FIDO2 Hardware Key** (YubiKey) | **Yes** | Best for privileged/exec accounts |
| **Windows Hello for Business** (TPM) | **Yes** | Best for all employees on Windows |
| **Passkeys** | **Yes** | Emerging standard, use where supported |

### Deploy Windows Hello for Business (WHfB)
```
Intune → Devices → Windows → Windows Hello for Business
  → Enable: Yes
  → Require TPM: Yes
  → PIN length minimum: 8
  → Require uppercase/lowercase/special: Yes
  → Biometric: Allowed (fingerprint / face)
  → Use security keys for sign-in: Allowed
```

### Enforce FIDO2 for IT Admins and Privileged Accounts
```
Entra ID → Security → Authentication methods → FIDO2 security keys
  → Enable: Yes
  → Target: IT-Admin group (require), All users (allow)
```

### Block Legacy / Weak MFA via Conditional Access
```
Entra ID → Security → Conditional Access → New Policy
  Name: "Block Legacy Auth"
  Users: All
  Conditions → Client apps → Legacy authentication clients: Yes
  Grant: Block
```

```
Name: "Require Phishing-Resistant MFA for Admins"
Users: IT-Admin group
Grant: Require authentication strength → Phishing-resistant MFA
```

### MFA Fatigue Protection
```
Entra ID → Security → Authentication methods → Microsoft Authenticator
  → Number matching: Enabled (user must type number shown on screen)
  → Additional context: Enabled (shows app name + location on push)
  → Rate limiting: Built-in
```

---

## 18. Firmware & Secure Boot

> Firmware-level malware (e.g. BlackLotus bootkit) bypasses ALL OS-layer controls including EDR, WDAC, and BitLocker.

### Secured-Core PC (buy these laptops)
Purchase only devices meeting **Microsoft Secured-Core PC** requirements:
- TPM 2.0 (required for BitLocker, WHfB, Credential Guard)
- Secure Boot enabled + enforced
- HVCI (Hypervisor-Protected Code Integrity) enabled
- Kernel DMA Protection hardware support

### BIOS / UEFI Hardening
Apply on every device before deployment:

| Setting | Value |
|---------|-------|
| Secure Boot | Enabled, enforced |
| Boot order | Internal disk only (disable USB/PXE boot) |
| UEFI password | Set strong password, store in IT vault |
| Firmware updates | Enable automatic (via vendor agent) |
| Virtualization (VT-x/AMD-V) | Enable (needed for Credential Guard) |
| Thunderbolt security | Set to "User Authorization" or "Secure Connect" |

### Firmware Update Management
- **Windows:** UEFI firmware updates via Windows Update + Dell/HP/Lenovo management agent
- **macOS:** Apple Silicon has built-in firmware attestation — keep macOS updated
- Deploy vendor management tools via Intune:
  - Dell: Dell Command Update
  - HP: HP Sure Admin
  - Lenovo: Lenovo System Update

### Verify Secure Boot Status
```powershell
# Check Secure Boot
Confirm-SecureBootUEFI  # Returns True if enabled

# Check HVCI
Get-CimInstance -ClassName Win32_DeviceGuard
# Look for: VirtualizationBasedSecurityStatus = 2 (running)
```

---

## 19. Attack Surface Reduction (ASR) Rules

> ASR blocks specific exploit techniques at kernel level. Separate from WDAC (execution control) and EDR (detection). Deploy both.

### Enable via Intune
```
Intune → Endpoint security → Attack surface reduction → Create policy
Platform: Windows 10 and later
Profile: Attack surface reduction rules
```

### Recommended Rules (set to Block)

| Rule | Mode | Why |
|------|------|-----|
| Block Office apps from creating child processes | Block | Stops macro-based malware |
| Block Office from creating executable content | Block | Stops dropper docs |
| Block credential stealing from LSASS | Block | Stops Mimikatz |
| Block executable content from email/webmail | Block | Stops email payload drops |
| Block execution of potentially obfuscated scripts | Block | Stops PowerShell obfuscation |
| Block JavaScript/VBScript launching executables | Block | Stops web-delivered payloads |
| Block untrusted/unsigned processes from USB | Block | Stops USB malware |
| Block persistence through WMI | Block | Stops fileless persistence |
| Block abuse of exploited vulnerable signed drivers | Block | Stops BYOVD attacks |
| Block Win32 API calls from Office macros | Block | Stops macro lateral movement |

> Start new rules in **Audit** mode first → review 2 weeks → switch to **Block**

### Monitor ASR Alerts
```
Microsoft Defender portal → Reports → Attack surface reduction
→ Review blocked events, tune exclusions per app
→ Forward to SIEM via MDE streaming API
```

---

## 20. Credential Guard & LSA Protection

> Prevents Pass-the-Hash, Pass-the-Ticket, credential dumping even if EDR misses the attempt.

### Credential Guard (Windows 11 — enable via Intune)
Isolates NTLM hashes and Kerberos tickets in a VBS (Virtualization-Based Security) enclave. Mimikatz and similar tools cannot extract credentials.

```
Intune → Configuration profiles → Settings Catalog
→ Search: "Credential Guard"
→ Turn On Virtualization Based Security: Enabled
→ Credential Guard Configuration: Enabled with UEFI lock
```

**GPO:**
```
Computer Config → Admin Templates → System → Device Guard
  → Turn On Virtualization Based Security: Enabled
  → Credential Guard Configuration: Enabled with UEFI lock
```

### LSA Protection
Prevents code injection into LSASS process (the process storing credentials).
```powershell
# Via Registry (deploy via Intune)
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Lsa" /v RunAsPPL /t REG_DWORD /d 1 /f
```

**Verify:**
```powershell
Get-ItemProperty "HKLM:\SYSTEM\CurrentControlSet\Control\Lsa" -Name RunAsPPL
# Should return: RunAsPPL = 1
```

### Verify Credential Guard Running
```powershell
Get-CimInstance -ClassName Win32_DeviceGuard -Namespace root\Microsoft\Windows\DeviceGuard |
  Select SecurityServicesRunning
# 1 = Credential Guard running
```

---

## 21. PowerShell Hardening

> WDAC controls executables. PowerShell is a script engine — needs separate controls.

### Constrained Language Mode (CLM)
Blocks access to .NET types, COM objects, and PowerShell features used in attacks.

```powershell
# Enforce via WDAC policy (CLM auto-enabled when WDAC in enforcement mode)
# Or set via GPO:
Computer Config → Admin Templates → Windows Components → Windows PowerShell
  → Turn on Script Execution: Signed scripts only (AllSigned)
```

### Script Block Logging (feed to SIEM)
Logs every PowerShell command executed — catches obfuscated/fileless attacks.
```
Computer Config → Admin Templates → Windows Components → Windows PowerShell
  → Turn on PowerShell Script Block Logging: Enabled
  → Log script block invocation start/stop: Enabled
  → Module Logging: Enabled → Module names: *
  → Transcription: Enabled → Output directory: \\siem-share\pslogs\
```

### Disable PowerShell v2 (bypasses AMSI)
```powershell
# Disable via Intune PowerShell script
Disable-WindowsOptionalFeature -Online -FeatureName MicrosoftWindowsPowerShellV2Root -NoRestart
Disable-WindowsOptionalFeature -Online -FeatureName MicrosoftWindowsPowerShellV2 -NoRestart
```

### AMSI Verification
AMSI scans PowerShell scripts before execution. Verify it's active:
```powershell
# Test AMSI (should be blocked by Defender)
[Ref].Assembly.GetType('System.Management.Automation.AmsiUtils')
# If AMSI working: throws error or triggers Defender alert
```

---

## 22. Browser Hardening & Extension Control

> Browser = #1 attack surface on endpoints. Network-layer proxy alone is insufficient.

### Managed Browser Policy (Edge — via Intune/GPO)
```
Intune → Configuration profiles → Settings Catalog → Microsoft Edge

Security settings:
  → SmartScreen: Enabled
  → Block malicious downloads: Enabled
  → Site isolation: Enabled
  → Block third-party cookies: Enabled
  → Disable password manager (use corporate password manager): Enabled
  → Block clipboard access by websites: Enabled (except approved)
  → Disable file system API for untrusted sites: Enabled
  → InPrivate mode: Disabled (or restricted)
```

### Extension Control (allowlist only)
```
Intune → Settings Catalog → Microsoft Edge → Extensions
  → Control which extensions cannot be installed: *  (block all)
  → Allow specific extensions: [list approved extension IDs]

Approved examples:
  - Microsoft Editor
  - 1Password / Bitwarden (company password manager)
  - uBlock Origin (if approved by security team)
```

**Google Chrome (if allowed):**
```
GPO → Computer Config → Admin Templates → Google Chrome → Extensions
  → Configure extension installation blocklist: *
  → Configure extension installation allowlist: [approved IDs]
```

### Microsoft Defender Application Guard (MDAG)
Opens untrusted websites in isolated Hyper-V container — malware cannot reach host.
```
Intune → Endpoint protection → Microsoft Defender Application Guard
  → Application Guard: Enabled for Edge
  → Clipboard behavior: Block
  → Print from Application Guard: Block
  → Allow camera/microphone: Block
```

---

## 23. AI Tool & Copilot Data Governance

> New in 2025-2026. AI tools create exfiltration vectors traditional DLP misses entirely.

### Risks
- Employee pastes confidential code/data into ChatGPT / Claude / Gemini
- M365 Copilot surfaces files the user shouldn't see (oversharing via broad permissions)
- GitHub Copilot trains on private code (if telemetry not disabled)
- Browser AI extensions send page content to external servers

### Controls

**Block unapproved AI web services via Zscaler:**
```
Zscaler → Policy → URL Categories → AI/ML Applications
  → Block: ChatGPT, Claude.ai, Gemini, Perplexity, Character.ai
  → Allow: M365 Copilot (internal), GitHub Copilot (if licensed)
```

**Microsoft Purview AI Hub:**
```
Microsoft Purview → AI Hub
  → Enable interaction monitoring for M365 Copilot
  → Alert on: sensitive label content sent to Copilot
  → DLP policy: block Copilot from accessing "Strictly Confidential" files
```

**GitHub Copilot — disable telemetry for enterprise:**
```json
// .github/copilot-settings.json (org-level)
{
  "telemetry": { "enabled": false },
  "suggestions": { "publicCodeSuggestions": "block" }
}
```

**Acceptable Use Policy additions:**
- Prohibited: entering customer PII, financial data, source code into public AI tools
- Required: use only company-approved AI tools for work tasks
- Required: treat AI-generated output as unverified until reviewed

---

## 24. OAuth & Third-Party App Consent

> Illicit consent grant attack: attacker tricks user into granting OAuth app access to M365 data — no credentials needed, persists after password change.

### Block User Consent to Third-Party Apps
```
Entra ID → Enterprise applications → Consent and permissions
  → User consent for applications: Do not allow user consent
  → Group owner consent: Do not allow group owner consent
```

### Require Admin Approval Workflow
```
Entra ID → Enterprise applications → Consent and permissions
  → Admin consent requests → Users can request admin consent: Yes
  → Reviewers: IT-Admin group
  → Request expiration: 30 days
```

### Audit Existing App Consents
```
Entra ID → Enterprise applications → All applications
  → Filter: "User consent" → review all granted permissions
  → Revoke suspicious or over-privileged apps
```

**SIEM alert:**
- New OAuth app granted `Mail.ReadWrite` or `Files.ReadWrite.All` by non-admin user

### Periodic App Access Review
```
Entra ID → Identity Governance → Access reviews
  → Create review: Enterprise applications
  → Frequency: Quarterly
  → Reviewers: Application owners + IT Security
```

---

## 25. Kernel DMA & Thunderbolt Protection

> Thunderbolt/USB4 allows direct memory access — can extract encryption keys, bypass OS auth, install firmware implants. Physical attack vector for devices that leave the building.

### Enable Kernel DMA Protection (requires hardware support)
```powershell
# Verify support
Get-ItemProperty "HKLM:\Software\Policies\Microsoft\FVE" | Select *
msinfo32 → System Summary → "Kernel DMA Protection": On
```

**Intune — enable via Settings Catalog:**
```
Settings Catalog → search "DMA" → Kernel DMA Protection: Enabled
```

### Thunderbolt Security Level (BIOS setting — set before deploy)
```
UEFI/BIOS → Thunderbolt Security → "User Authorization" or "Secure Connect"
Never set to "No Security" or "Legacy Mode"
```

### Disable Thunderbolt / Reduce DMA Attack Surface
```powershell
# Disable Thunderbolt for users who don't need it (via Intune)
# Device Manager → Disable Thunderbolt controller via policy
# Or: physical port disable via BIOS if no business need
```

---

## 26. Bluetooth & Wireless Hardening

### Bluetooth
```
Intune → Settings Catalog → Bluetooth
  → Allow Bluetooth: Allowed (or Disabled for high-security roles)
  → Allow Discoverable Mode: Blocked
  → Allow Advertising: Blocked
  → Allow Prompted Proximal Connections: Blocked
```

**Disable unused Bluetooth profiles via GPO:**
```
Block HID (keyboard/mouse) pairing from untrusted devices
Restrict to pre-approved device addresses for exec/finance roles
```

### Wi-Fi
```
Intune → Wi-Fi profile → deploy corporate SSID only
  → Security type: WPA3-Enterprise (or WPA2-Enterprise minimum)
  → Authentication: Certificate-based (EAP-TLS) — not password
  → Block connecting to open/public Wi-Fi: Yes (Zscaler provides security when on untrusted networks)
```

**802.1X enforcement:**
- Corporate Wi-Fi requires device certificate (deployed via Intune SCEP)
- Non-enrolled devices cannot join corporate network

---

## 27. Insider Threat & UEBA

> DLP blocks known patterns. SIEM fires on known rules. UEBA catches what neither sees: gradual, unusual, policy-compliant-but-anomalous behavior.

### Microsoft Sentinel UEBA
```
Microsoft Sentinel → Configuration → Settings → UEBA
  → Enable: Yes
  → Data sources: Entra ID, Microsoft 365, MDE, Azure Activity
```

**Behavioral baselines it creates:**
- Normal login hours per user
- Normal data volume accessed per user
- Normal apps used
- Normal peer group behavior

**Auto-alerts on deviation:**
- Login at 2am from new country
- Bulk download 3x above user's normal baseline
- First-time access to HR/Finance file shares
- Sequence: bulk download → USB plug-in (within 1 hour)

### High-Risk User Signals
```
Sentinel → Threat intelligence → User risk
  → HR feed integration: trigger review on resignation/PIP notice
  → Conditional Access: High-risk user → require re-auth + MFA
```

### Tools
| Tool | Strength |
|------|---------|
| **Microsoft Sentinel UEBA** | Deep M365 integration |
| **Varonis** | Best for file/SharePoint access analytics |
| **Exabeam** | Standalone UEBA with strong baselines |

---

## 28. Supply Chain Integrity

> Compromised-but-legitimately-signed software (SolarWinds, XZ Utils style) bypasses WDAC signing checks.

### Software Vetting Process
Before approving any tool for the whitelist:
- [ ] Verify publisher identity (known vendor, not lookalike)
- [ ] Check code signing certificate validity + revocation
- [ ] Review permissions the installer requests
- [ ] Run in sandboxed VM first (Windows Sandbox / isolated Intune test group)
- [ ] Monitor update channel — verify updates are signed by same cert

### Binary Integrity Monitoring
```powershell
# Baseline hash of critical security tool binaries on deploy
Get-FileHash "C:\Program Files\CrowdStrike\CSFalconService.exe" -Algorithm SHA256
# Store hash in SIEM → alert on change
```

### Security Tool Tamper Protection
All security tools must have tamper protection enabled:
```
Microsoft Defender: Tamper Protection → On (enforced via Intune, cannot be disabled by user)
CrowdStrike Falcon: Sensor tamper protection → Enabled in policy
```

### SBOM (Software Bill of Materials)
For critical internal apps deployed to endpoints:
- Generate SBOM on build (Syft, Microsoft SBOM Tool)
- Store in artifact registry
- Scan against known vulnerability databases (OSV, NVD)

---

## 29. Continuous Threat Exposure (CTEM)

> Patching = known CVEs fixed. CTEM = actual exploitability of your environment continuously verified. These are different.

### Microsoft Secure Score
```
Microsoft Defender portal → Secure Score
  → Target score: 80%+ (enterprise baseline)
  → Review improvement actions weekly
  → Assign actions to owners with due dates
  → Integrate score trend into security KPI dashboard
```

### Attack Path Analysis
```
Microsoft Defender XDR → Exposure Management → Attack paths
  → Identify paths from internet-exposed assets to domain admin
  → Prioritize: paths with < 3 hops to critical assets
```

### Misconfiguration Detection (beyond patching)
```
Defender Vulnerability Management → Security recommendations
  → Covers: misconfigs, deprecated features, overprivileged accounts
  → Export to SIEM weekly for trend tracking
```

### Tools
| Tool | Use |
|------|-----|
| **Microsoft Defender Exposure Management** | Built-in if using MDE |
| **Tenable One** | Deeper network/cloud exposure |
| **Axonius** | Asset inventory + exposure correlation |
| **PlexTrac** | Track remediation across teams |

---

## 30. Incident Response Readiness

> Having EDR fire is not the same as knowing what to do when it fires. Test the process.

### IR Runbook (create per scenario)
Minimum runbooks needed:
- Ransomware on endpoint
- Credential compromise / account takeover
- Data exfiltration detected
- Lost/stolen laptop
- Malware outbreak (multiple devices)

Each runbook contains:
```
Trigger:           What alert / how detected
Severity:          P1/P2/P3
Immediate steps:   Isolate device, revoke credentials, notify...
Investigation:     What to collect, where to look
Communication:     Who to notify (legal, exec, customers if breach)
Recovery:          Wipe/re-image procedure, credential rotation
Post-incident:     Timeline, root cause, lessons learned
```

### Endpoint Isolation (MDE)
```
MDE → Device inventory → [compromised device] → Isolate device
→ Device loses all network access except MDE channel
→ Investigate via MDE live response before re-imaging
```

### MDE Live Response (forensics without touching device)
```powershell
# Run in MDE Live Response console:
processes           # List running processes
connections         # List network connections
getfile "C:\Users\<user>\AppData\Roaming\malware.exe"  # Collect artifact
run <script>        # Run remediation script
```

### Tabletop Exercises
- Run quarterly tabletop simulation with IT + management
- Scenarios: ransomware, insider exfil, lost exec laptop
- Measure: time to detect, time to isolate, time to recover

---

## 31. New Employee Onboarding Checklist

### IT Actions (before Day 1)
- [ ] Create Entra ID account (`firstname.lastname@company.com`)
- [ ] Assign license (M365 E5)
- [ ] Add to correct security groups / OUs
- [ ] Enroll laptop in Autopilot / MDM
- [ ] Apply compliance + security policies
- [ ] Configure email, Teams, approved apps
- [ ] Register device in asset inventory

### Employee Actions (Day 1)
- [ ] Sign into laptop with company account
- [ ] Register MFA (Microsoft Authenticator)
- [ ] Set up Windows Hello (PIN / biometric)
- [ ] Verify disk encryption active
- [ ] Complete mandatory security training
- [ ] Read and sign: Acceptable Use Policy (AUP)
- [ ] Review app whitelist (what they can/cannot install)
- [ ] Learn PIM process for requesting admin access

---

## 32. Employee Exit Checklist

Execute immediately on resignation/termination:

### Within 1 Hour of Notice
- [ ] Disable Entra ID account (not delete — preserve audit trail)
- [ ] Revoke all active sessions: `Entra ID → User → Revoke sessions`
- [ ] Remove from all security groups
- [ ] Disable MFA methods
- [ ] Forward email to manager (if required by policy)

### Within 24 Hours
- [ ] Retrieve company laptop
- [ ] Wipe device via Intune Remote Wipe
- [ ] Revoke VPN/Zscaler access
- [ ] Transfer ownership of files/OneDrive to manager
- [ ] Remove from third-party app access (GitHub, AWS, Jira, etc.)
- [ ] Document in HR system + IT ticket

### Within 7 Days
- [ ] Audit last 30 days of activity logs
- [ ] Check for unusual data exfiltration before exit
- [ ] Delete/archive mailbox per retention policy
- [ ] Remove device from MDM after wipe confirmed

---

## 33. Linux Endpoints (Engineering)

> Engineering teams frequently request Linux laptops (Ubuntu, Fedora). These are **not covered** by Windows/macOS policies and require a separate hardening baseline.

### Approved Distros
| Distro | Support Tier | Notes |
|--------|-------------|-------|
| **Ubuntu 24.04 LTS** | Tier 1 — supported | 5-year LTS, best tooling |
| **Fedora 40+** | Tier 2 — self-service | Rolling updates, engineer responsibility |
| Other | **Not allowed** | No IT support, no MDM enrollment |

### Full-Disk Encryption (LUKS)
```bash
# During OS install: enable LUKS2 full-disk encryption
# Passphrase stored in company password vault (1Password) — not just in user's head

# Verify after install
cryptsetup status /dev/mapper/luks-*
# Status: active + encryption: aes-xts-plain64 + keysize: 512 bits
```

### Endpoint Detection & Response
Deploy one of:
- **CrowdStrike Falcon for Linux** — best detection, low overhead
- **SentinelOne Linux Agent** — autonomous response
- **Wazuh** — open source, self-hosted SIEM agent

```bash
# CrowdStrike Falcon install (Ubuntu)
dpkg -i falcon-sensor_<version>_amd64.deb
/opt/CrowdStrike/falconctl -s --cid=<CID>
systemctl start falcon-sensor
```

### CIS Benchmark Hardening (Level 1)
Apply **CIS Ubuntu Linux 24.04 Benchmark** via Ansible:

```yaml
# ansible/linux-hardening.yml (key controls)
- name: Disable unused filesystems
  lineinfile:
    path: /etc/modprobe.d/disable-filesystems.conf
    line: "install {{ item }} /bin/false"
  with_items: [cramfs, freevxfs, jffs2, hfs, hfsplus, udf]

- name: Enable auditd
  service: name=auditd state=started enabled=yes

- name: Set SSH hardening
  blockinfile:
    path: /etc/ssh/sshd_config
    block: |
      PermitRootLogin no
      PasswordAuthentication no
      PubkeyAuthentication yes
      MaxAuthTries 3
      ClientAliveInterval 300
      ClientAliveCountMax 0
      AllowTcpForwarding no
      X11Forwarding no
```

### Key Hardening Controls

| Control | Implementation |
|---------|---------------|
| No root login | `PermitRootLogin no` in sshd_config |
| `sudo` policy | Require password, no `NOPASSWD`, log all sudo |
| AppArmor | Enable + enforce profiles for browsers, services |
| Unattended security upgrades | `unattended-upgrades` package, security only |
| auditd logging | Log all `sudo`, file access, network connections → forward to SIEM |
| UFW firewall | Default deny inbound, allow established |
| USB storage | Block via udev rules or `udisks2` policy |
| Screen lock | 5-minute timeout via `gnome-screensaver` / `xdg-screensaver` |

### Entra ID Integration (SSO Login)
```bash
# Join Linux to Entra ID using Microsoft's packages
apt install sssd sssd-azure-ad
# Configure /etc/sssd/sssd.conf with tenant ID
# Users log in with company@yourcompany.com credentials
systemctl restart sssd
```

### auditd → SIEM
```bash
# /etc/audit/rules.d/enterprise.rules
-w /etc/passwd -p wa -k passwd_changes
-w /etc/sudoers -p wa -k sudoers_changes
-a always,exit -F arch=b64 -S execve -k exec_commands
-a always,exit -F arch=b64 -S connect -k network_connect
# Forward to Sentinel via auditbeat or rsyslog
```

---

## 34. Mobile Device & BYOD Policy

> Phones access company email, Slack, and code repositories. Unmanaged phones are a major exfiltration path.

### Device Categories

| Type | MDM Level | Policy |
|------|----------|--------|
| Company-owned phone | Full MDM (device wipe) | Highest control |
| Personal phone with work apps (BYOD) | MAM only (app-level) | Work data isolated; personal data untouched |
| Personal phone, no work apps | Conditional Access blocked | Cannot access company resources |

### Company-Owned Mobile — Full MDM

**iOS (Apple Business Manager + Intune):**
```
Apple Business Manager → Devices → enroll via ADE (zero-touch)
Intune → iOS/iPadOS → Enrollment → Apple enrollment → ADE
Assign supervision profile → devices become supervised (full control)
```

**Android (Android Enterprise + Intune):**
```
Intune → Android → Enrollment → Corporate-owned fully managed
Device owner mode — full device managed by IT
```

**Policies applied to company phones:**
- Screen lock: 5 min, biometric or 6-digit PIN minimum
- Full device encryption enforced
- Remote wipe enabled (full wipe on loss/theft)
- Block: personal app store, sideloading, screenshots in corporate apps
- Approved apps: Outlook, Teams, Authenticator, 1Password, Slack (if used)

### BYOD — Mobile App Management (MAM) Only

> MAM manages **only the work apps and their data**, never the personal device. This respects privacy while protecting company data.

```
Intune → App protection policies → iOS / Android
  → Target: Microsoft Outlook, Teams, OneDrive, Edge
  → Require PIN for work apps: Yes (separate from device PIN)
  → Block cut/copy/paste between work and personal apps: Yes
  → Block screen capture in work apps: Yes
  → Encrypt work app data: Yes
  → Offline access grace period: 72 hours
  → Wipe: selective wipe only (removes work data, not personal)
  → Minimum OS version: iOS 17+ / Android 13+
```

### Conditional Access for Mobile
```
Entra ID → Conditional Access → New Policy
  Name: "Mobile — Require Approved App + App Protection"
  Users: All
  Platforms: iOS, Android
  Grant: Require approved client app AND Require app protection policy
```

### Mobile Security Requirements (all users)
- [ ] Device PIN / biometric required (enforced by MAM policy)
- [ ] OS up to date (block access if > 2 versions behind)
- [ ] No jailbreak / root (compliance check via Intune)
- [ ] Authenticator app installed for MFA
- [ ] Lost/stolen: report to IT within 1 hour for remote wipe

---

## 35. PKI & Certificate Lifecycle

> Certificates underpin 802.1X Wi-Fi auth, VPN, device identity, and S/MIME email signing. Poor certificate management = hard-to-detect impersonation and sudden outages.

### CA Hierarchy
```
Root CA (offline, air-gapped)
  └── Intermediate CA (online, Intune SCEP/NDES)
        ├── Device certificates  (802.1X, VPN, device identity)
        ├── User certificates    (S/MIME email signing/encryption)
        └── Server certificates  (internal services TLS)
```

### Options

| Option | Best For | Notes |
|--------|---------|-------|
| **Microsoft Cloud PKI** (Intune add-on) | Cloud-native, no infra | Easiest; integrates directly with Intune SCEP |
| **Microsoft ADCS** (on-prem) | Hybrid environments | Requires NDES server for SCEP |
| **DigiCert / Sectigo** (public CA) | Public-facing certs | Use for public TLS, not device/user certs |

### Issue Device Certificates via SCEP (Intune)
```
Intune → Devices → Configuration → Create profile
  → Template: SCEP certificate
  → Subject name format: CN={{DeviceName}}, O=YourCompany
  → Key usage: Digital signature, Key encipherment
  → Validity: 1 year (auto-renew at 80% of lifetime)
  → Key size: RSA 2048 or ECDSA P-256
  → Extended key usage: Client Authentication (1.3.6.1.5.5.7.3.2)
  → Assign to: All devices group
```

### Certificate Validity Periods
| Certificate Type | Max Validity | Auto-Renew |
|-----------------|-------------|-----------|
| Root CA | 20 years | Manual |
| Intermediate CA | 5 years | Manual |
| Device certificate | 1 year | Yes (Intune SCEP) |
| User certificate | 1 year | Yes (Intune SCEP) |
| Internal server TLS | 1 year | Yes (ACME/certbot) |
| Public TLS (external) | 1 year | Yes (Let's Encrypt / DigiCert) |

> **Never use wildcard certificates** for internal devices — use Subject Alternative Names (SANs) instead.

### Certificate Revocation
```
CRL (Certificate Revocation List):
  → Published every 7 days, valid for 14 days (overlap prevents gaps)
  → LDAP + HTTP CDP (CRL Distribution Point) must be reachable

OCSP (Online Certificate Status Protocol):
  → Enabled for real-time revocation check
  → OCSP stapling enabled on all servers

Revoke immediately when:
  - Device lost/stolen
  - Employee exits (Section 32)
  - Certificate key suspected compromised
```

### Monitor Certificate Expiry
```bash
# Add to SIEM / monitoring platform — alert 60 days before expiry
# For Intune-managed certs: Intune → Devices → Monitor → Certificates
# For servers: use Qualys SSL Labs, Datadog, or Prometheus blackbox_exporter
```

---

## 36. Developer Security

> Engineers are the highest-risk user group for secrets leakage, credential theft, and supply chain compromise. Standard user policy is insufficient.

### Secrets Management — No Secrets on Disk

**Rule:** No secrets (API keys, tokens, passwords, private keys) ever stored in:
- Plain text files, `.env` files committed to git
- Shell history (`~/.bash_history`, `~/.zsh_history`)
- Code, config files, or Docker images

**Approved secrets storage:**
| Secret Type | Where to Store |
|------------|---------------|
| API keys / tokens | 1Password Business (developer vault) or HashiCorp Vault |
| AWS / cloud credentials | AWS SSO / OIDC (no long-lived keys) |
| Database passwords | Vault dynamic secrets or 1Password |
| SSH private keys | Hardware key (YubiKey) or encrypted keychain |
| CI/CD secrets | GitHub Actions encrypted secrets / Vault Agent |

### Pre-commit Hooks — Block Secret Commits
```bash
# Install detect-secrets (all engineers, enforced via onboarding script)
pip install detect-secrets
detect-secrets scan > .secrets.baseline  # initial scan
detect-secrets audit .secrets.baseline   # review findings

# Or use trufflehog
brew install trufflehog
trufflehog git file://. --since-commit HEAD --only-verified

# Add to .git/hooks/pre-commit (or use pre-commit framework)
# Block commits if secrets detected
```

**GitHub org-level (always enable):**
```
GitHub org → Settings → Code security → Secret scanning: Enabled
GitHub org → Settings → Code security → Push protection: Enabled
→ Push protection blocks commits containing secrets before they reach remote
```

### SSH Key Policy
```
Algorithm:     ed25519 (required) — no RSA < 4096, no DSA, no ECDSA
Passphrase:    Mandatory — minimum 20 characters
Storage:       macOS Keychain / KDE Wallet, or hardware key (YubiKey 5)
Rotation:      Annual, or immediately on device loss/employee exit
Key comment:   firstname.lastname@yourcompany.com (identifies owner)

# Generate compliant key
ssh-keygen -t ed25519 -C "firstname.lastname@yourcompany.com" -f ~/.ssh/id_ed25519
# Enter strong passphrase when prompted
```

**SSH agent forwarding policy:** Disabled by default. Allowed only with `-A` flag consciously used.

### Git Commit Signing (Mandatory for Main/Release Branches)
```bash
# Option A: GPG signing
gpg --full-generate-key  # RSA 4096 or ed25519
git config --global user.signingkey <KEY_ID>
git config --global commit.gpgsign true

# Option B: SSH signing (simpler, recommended)
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true
```

**GitHub branch protection (enforce signing):**
```
Repo → Settings → Branches → main / release/*
  → Require signed commits: Enabled
```

### Local Development — Credential Hygiene
```bash
# Prevent secrets in shell history
# Add to ~/.zshrc or ~/.bashrc:
export HISTIGNORE="*secret*:*token*:*password*:*key*:*aws*"

# Use direnv for project-scoped env vars (loaded from .envrc, never committed)
brew install direnv
echo 'eval "$(direnv hook zsh)"' >> ~/.zshrc
# .envrc is gitignored; secrets pulled from 1Password CLI on load

# 1Password CLI for secret injection
eval $(op signin)
export DB_PASSWORD=$(op read "op://Company/postgres-dev/password")
```

### Container & Image Security
```bash
# Sign Docker images (cosign)
cosign sign --key cosign.key <image>:<tag>
# Verify in CI/CD before deploy
cosign verify --key cosign.pub <image>:<tag>

# Scan images for secrets/CVEs before push
docker scan <image>          # Docker Scout
trivy image <image>          # Aqua Trivy (open source)
```

### AWS / Cloud Credentials — No Long-Lived Keys
```
Rule: No AWS access keys stored in ~/.aws/credentials on laptops
Use:  AWS IAM Identity Center (SSO) + short-lived credentials via aws sso login
MFA:  Required for all AWS console + CLI access
```

---

## 37. Endpoint Backup

> Without endpoint backup, a ransomware attack or hardware failure loses all local work. This is also required for SOC 2 Availability criteria.

### Windows — OneDrive Known Folder Move (KFM)
Automatically redirects Desktop, Documents, and Pictures to OneDrive. Transparent to the user.

```
Intune → Configuration profiles → Settings Catalog → OneDrive
  → Silently move known folders to OneDrive: Enabled
    → Tenant ID: <your-tenant-id>
  → Silently sign in users to OneDrive with Windows credentials: Enabled
  → Prevent users from redirecting known folders back to their PC: Enabled
  → Set OneDrive as default save location: Enabled
```

**What's backed up:** Desktop, Documents, Pictures (real-time sync to cloud)
**Retention:** OneDrive Version History — 93 days (configurable up to 180 days)
**Ransomware recovery:** OneDrive Files Restore — roll back up to 30 days

### macOS — Managed Backup Strategy
```
Option A: iCloud Drive with Managed Apple ID (company-controlled)
  Jamf/Intune → Configuration profile → iCloud
    → Allow iCloud Drive: Enabled (managed Apple ID only)
    → Enable Desktop & Documents sync: Enabled

Option B: Time Machine to network share
  Intune/Jamf → script: configure Time Machine to \\backup-server\timemachine\
  Backup frequency: Hourly (default)
  Retention: 1 month rolling
```

### What to Exclude
```
# Exclude from backup (reduce size + cost)
node_modules/
.cache/
build/ dist/ out/
*.log
__pycache__/
.venv/ env/
```

### Backup Verification Policy
| Check | Frequency | Owner |
|-------|----------|-------|
| OneDrive sync health (Intune report) | Weekly | IT |
| Spot-restore test (random 5 users) | Monthly | IT |
| Full restore drill (simulated laptop loss) | Quarterly | IT + Security |

### RTO / RPO Targets
```
RTO (Recovery Time Objective):   4 hours — new laptop provisioned + data restored
RPO (Recovery Point Objective):  24 hours — maximum acceptable data loss
```

---

## 38. Asset Inventory & CMDB

> You cannot secure what you do not know exists. A complete, accurate asset register is required for SOC 2 audit evidence (CC6.1) and incident response.

### Primary Source: Intune Device Inventory
Intune auto-populates when devices enroll. Treat as the source of truth.

```
Intune → Devices → All devices
Fields tracked: Device name, serial, model, OS + version, assigned user,
                compliance state, last check-in, disk encryption status,
                MDM enrollment date
```

### Asset Register — Required Fields
| Field | Source | Notes |
|-------|--------|-------|
| Asset tag / serial | Physical label + Intune | Applied before deployment |
| Make / model | Intune | Auto-populated |
| Purchase date | Finance system | Manual entry |
| Warranty expiry | Vendor | Alert 90 days before |
| Assigned user | Intune | Updated on reassignment |
| Department | Entra ID group | Synced from HR system |
| Location | Asset register | Office / remote / field |
| OS + version | Intune | Real-time |
| Compliance status | Intune | Fail = block access |
| EDR agent status | MDE / CrowdStrike | Alert if missing |

### CMDB Integration Options
| Tool | Integration |
|------|-----------|
| **ServiceNow** | Intune connector — auto-sync on enrollment/wipe |
| **Jira Assets** (Atlassian) | API pull from Intune Graph API |
| **Snipe-IT** (open source) | Intune webhook → Snipe-IT API |
| **Spreadsheet** (early stage) | Export from Intune weekly — acceptable for < 50 devices |

### Automated Sync (Intune → CMDB via Graph API)
```python
# Example: pull all devices from Intune Graph API
import requests
headers = {"Authorization": f"Bearer {access_token}"}
response = requests.get(
    "https://graph.microsoft.com/v1.0/deviceManagement/managedDevices",
    headers=headers
)
devices = response.json()["value"]
# Upsert into CMDB using serial number as unique key
```

### Physical Audit
- Annual physical reconciliation — match CMDB to devices on-hand
- Decommission devices in CMDB on MDM wipe confirmation
- Flag devices not seen in Intune for > 30 days (lost/forgotten)

### SOC 2 Evidence
The asset register must be producible for SOC 2 audit to satisfy:
- **CC6.1** — Identify and manage assets
- **CC6.7** — Restrict access to authorised devices only
- **A1.2** — Environmental protections for infrastructure

---

## Appendix A: Tools Summary

| Area | Tool (Recommended) |
|------|-------------------|
| Identity | Microsoft Entra ID |
| MDM — Windows | Microsoft Intune |
| MDM — Mac | Intune or Jamf Pro |
| MDM — Mobile (company) | Microsoft Intune (full MDM) |
| MDM — Mobile (BYOD) | Intune App Protection Policies (MAM) |
| EDR — Windows / Mac | Microsoft Defender for Endpoint / CrowdStrike |
| EDR — Linux | CrowdStrike Falcon for Linux / SentinelOne |
| SIEM | Microsoft Sentinel |
| DLP | Microsoft Purview |
| Proxy / Web Filter | Zscaler Internet Access |
| DNS Security | Cloudflare Gateway / Cisco Umbrella |
| VPN / ZTNA | Zscaler Private Access / Entra Private Access |
| Patching — Windows (3rd party) | Patch My PC |
| Patching — macOS (3rd party) | Munki / Automox |
| PAM / Temp Admin | Entra PIM + Microsoft LAPS |
| Password Manager | 1Password Business / Bitwarden Business |
| App Whitelist — Windows | WDAC |
| App Whitelist — macOS | Gatekeeper + MDM |
| Email Security | Microsoft Defender for Office 365 P2 |
| Vulnerability Scan | Defender Vulnerability Management / Tenable |
| PKI / Certificates | Microsoft Cloud PKI / ADCS + NDES |
| Secrets Management | 1Password Business / HashiCorp Vault |
| Secret scanning (pre-commit) | detect-secrets / trufflehog |
| Git commit signing | GPG or SSH signing (ed25519) |
| Endpoint Backup — Windows | OneDrive Known Folder Move |
| Endpoint Backup — macOS | Managed iCloud Drive / Time Machine |
| Asset Inventory / CMDB | Intune → ServiceNow / Snipe-IT |
| Linux Config Management | Ansible + CIS benchmark playbooks |

| Linux EDR | CrowdStrike Falcon / SentinelOne (Linux) |
| Mobile MDM | Microsoft Intune (iOS/Android) |
| Mobile MAM (BYOD) | Intune App Protection Policies |
| PKI / Certificates | Microsoft Cloud PKI / ADCS + NDES |
| Secrets Management | 1Password Business / HashiCorp Vault |
| Pre-commit secret scan | detect-secrets / trufflehog |
| Endpoint Backup (Win) | OneDrive Known Folder Move |
| Endpoint Backup (Mac) | Managed iCloud Drive / Time Machine |
| Asset Inventory | Intune → ServiceNow / Snipe-IT |

---

## Appendix B: Compliance Frameworks

### Target Frameworks for a SaaS Product Company

| Framework | Scope | Priority |
|-----------|-------|---------|
| **SOC 2 Type II** | Security, Availability, Confidentiality | **Must-have** — customers demand it |
| **ISO 27001** | ISMS — full information security management | Strong differentiator for enterprise sales |
| **NIST CSF 2.0** | US government + large enterprise alignment | Aligns to many customer requirements |
| **CIS Benchmarks** | Specific hardening for Windows/macOS/Linux/servers | Required evidence for SOC 2 |
| **GDPR** | EU personal data handling | Required if any EU users/customers |
| **HIPAA** | US health data | Required if handling PHI |

Apply **CIS Benchmarks** via GPO/Intune/Ansible — free downloadable templates:
- CIS Windows 11 Benchmark (Level 1 — mandatory, Level 2 — optional)
- CIS macOS 14 Benchmark
- CIS Ubuntu Linux 24.04 Benchmark
- CIS Google Chrome / Microsoft Edge Benchmark

---

## Appendix C: SOC 2 Control Mapping

> This table maps each section of this document to the relevant SOC 2 Trust Service Criteria (TSC). Use this during audit preparation and evidence collection.

### Trust Service Criteria (CC = Common Criteria, A = Availability)

| SOC 2 Criteria | Description | Covered By (Sections) |
|---------------|-------------|----------------------|
| **CC6.1** | Logical access security — identify assets, restrict access | §3 (User accounts), §5 (Policies), §38 (Asset Inventory) |
| **CC6.2** | User provisioning and deprovisioning | §31 (Onboarding), §32 (Exit) |
| **CC6.3** | Role-based access control | §3 (Account types), §12 (PIM) |
| **CC6.6** | Restrict logical access to authorised personnel only | §6 (WDAC), §4 (MDM compliance) |
| **CC6.7** | Restrict physical and logical transmission of data | §13 (DLP), §9 (Encryption), §14 (VPN/ZTNA) |
| **CC6.8** | Prevent/detect unauthorised software | §6 (App whitelist), §8 (EDR), §28 (Supply chain) |
| **CC7.1** | Detect and monitor for vulnerabilities | §8 (EDR + vuln scan), §10 (Patching), §29 (CTEM) |
| **CC7.2** | Monitor system components for anomalies and threats | §11 (Audit/SIEM), §27 (UEBA) |
| **CC7.3** | Evaluate security events to determine if incidents | §27 (UEBA), §11 (SIEM alerts) |
| **CC7.4** | Respond to identified security incidents | §30 (IR Readiness) |
| **CC8.1** | Authorise and manage changes | §12 (PIM), §6 (WDAC change process) |
| **CC9.2** | Monitor and manage vendor/third-party risk | §28 (Supply chain), §24 (OAuth) |
| **A1.1** | Maintain availability commitments | §10 (Patching), §37 (Backup) |
| **A1.2** | Protect infrastructure against environmental threats | §9 (Encryption), §37 (Backup), §38 (CMDB) |

### Evidence to Collect Per Audit Cycle (Annual)

| Evidence Item | Source | Section |
|--------------|--------|---------|
| Device compliance report (all devices 100% compliant) | Intune export | §4 |
| MFA enrollment report (100% of users) | Entra ID | §17 |
| Privileged access review log | Entra ID PIM | §12 |
| Software inventory (approved apps only) | Intune / WDAC logs | §6 |
| Vulnerability scan results + remediation | MDE / Tenable | §8 |
| Patch compliance report (< 14 day lag) | Intune Update Rings | §10 |
| SIEM alert log + investigation records | Sentinel | §11 |
| Onboarding/offboarding records | IT tickets + Entra ID | §31, §32 |
| Backup restore test results | IT records | §37 |
| Asset register (full, accurate) | CMDB / Intune | §38 |
| Security awareness training completion | LMS export | §15 |
| Penetration test report | External vendor | §29 |
| IR tabletop exercise records | IT records | §30 |

---

*Last updated: 2026-06-23*
*Owner: IT Security Team*
