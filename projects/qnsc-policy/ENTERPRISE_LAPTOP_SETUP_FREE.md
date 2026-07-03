# Enterprise Laptop Setup — Free Tier
> Full security baseline for a product company using **zero paid licenses**.
> When you're ready to scale, see [ENTERPRISE_LAPTOP_SETUP.md](ENTERPRISE_LAPTOP_SETUP.md) for the premium path.

---

## Table of Contents
1. [Free Tools Stack](#1-free-tools-stack)
2. [Coverage vs Premium Gap](#2-coverage-vs-premium-gap)
3. [Entra ID Free — Identity Setup](#3-entra-id-free--identity-setup)
4. [MFA with Security Defaults](#4-mfa-with-security-defaults)
5. [Per-Laptop: BIOS Hardening](#5-per-laptop-bios-hardening)
6. [Per-Laptop: BitLocker (manual)](#6-per-laptop-bitlocker-manual)
7. [Per-Laptop: Windows Hardening Script](#7-per-laptop-windows-hardening-script)
8. [Cloudflare Zero Trust (free, ≤50 users)](#8-cloudflare-zero-trust-free-50-users)
9. [Wazuh EDR + SIEM (free, self-hosted)](#9-wazuh-edr--siem-free-self-hosted)
10. [Bitwarden — Password Manager](#10-bitwarden--password-manager)
11. [Developer Security (all free)](#11-developer-security-all-free)
12. [Email Security — SPF / DKIM / DMARC](#12-email-security--spf--dkim--dmarc)
13. [Patch Management (manual process)](#13-patch-management-manual-process)
14. [Asset Inventory (Snipe-IT or Sheet)](#14-asset-inventory-snipe-it-or-sheet)
15. [Incident Response (manual runbooks)](#15-incident-response-manual-runbooks)
16. [New Employee Onboarding Checklist](#16-new-employee-onboarding-checklist)
17. [Employee Exit Checklist](#17-employee-exit-checklist)
18. [Upgrade Path — When to Move to Paid](#18-upgrade-path--when-to-move-to-paid)
19. [Entra ID Join — Login with Company Account](#19-entra-id-join--login-with-company-account)
20. [BitLocker Status Check](#20-bitlocker-status-check)
21. [Antivirus — Free Options](#21-antivirus--free-options)
22. [Software Whitelist / Blacklist (AppLocker)](#22-software-whitelist--blacklist-applocker)
23. [Web Filtering (SmartScreen + Cloudflare)](#23-web-filtering-smartscreen--cloudflare)

---

## 1. Free Tools Stack

| Area | Free Tool | Notes |
|------|-----------|-------|
| **Identity** | Microsoft Entra ID Free | User management, basic SSO |
| **MFA** | Security Defaults + Microsoft Authenticator | All users, no config needed |
| **Disk Encryption** | BitLocker (Windows 11 Pro built-in) | AES-256, TPM-backed |
| **EDR / Antivirus** | Windows Defender (built-in) | Real-time protection, ASR rules |
| **EDR Agent (advanced)** | Wazuh Community Edition | Open source, self-hosted |
| **SIEM** | Wazuh Dashboard (open source) | Self-hosted on cheap VPS |
| **DNS Filtering** | Cloudflare Gateway (Zero Trust free) | Block malware/phishing at DNS |
| **Zero Trust Access** | Cloudflare Access (free ≤50 users) | Replaces VPN |
| **Endpoint Agent** | Cloudflare WARP (free) | Secure DNS + ZTA tunnel |
| **Password Manager** | Bitwarden (free / $3/user Teams) | Open source, self-hosted option |
| **Secrets scanning** | detect-secrets + trufflehog | Block secrets from git commits |
| **SSH keys** | ssh-keygen (built-in) | ed25519, free |
| **Git signing** | SSH signing (built-in git) | Free, no GPG needed |
| **Email protection** | SPF + DKIM + DMARC (DNS records) | Free DNS configuration |
| **Browser hardening** | Edge / Chrome local policy | gpedit.msc — no license |
| **Firewall** | Windows Defender Firewall (built-in) | Free |
| **App control** | AppLocker (Windows 11 Pro built-in) | Whitelist/blacklist by publisher or path |
| **Web filtering** | SmartScreen + Cloudflare Gateway | Block malicious/phishing URLs |
| **Credential Guard** | Windows 11 built-in | Free, registry enable |
| **Antivirus** | Windows Defender + Malwarebytes Free | Defender: real-time; Malwarebytes: on-demand scan |
| **Cloud domain join** | Entra ID Join (free) | Login to Windows with company Microsoft account |
| **Asset inventory** | Snipe-IT (free, self-hosted) | Or Google Sheet for < 20 devices |

**Total cost: $0** (or ~$3/user/month if you want Bitwarden Teams — highly recommended)

---

## 2. Coverage vs Premium Gap

> Honest assessment of what you have free vs what you give up.

| Security Domain | Free Coverage | Gap Without Paid |
|----------------|--------------|-----------------|
| MFA | ✅ Security Defaults — all users forced | ❌ No custom Conditional Access rules |
| Disk Encryption | ✅ BitLocker manual per laptop | ❌ No central key escrow to cloud (save manually) |
| Malware protection | ✅ Defender + ASR + Credential Guard | ❌ No EDR telemetry correlation across devices |
| DNS / web filtering | ✅ Cloudflare Gateway free | ❌ No per-user policy, no SSL inspection |
| Zero Trust access | ✅ Cloudflare Access free (50 users) | ❌ No device posture checks |
| Logging / SIEM | ✅ Wazuh self-hosted | ❌ No native Entra ID log correlation |
| Patch management | ⚠️ Windows Update manual | ❌ No forced update rings, no compliance reporting |
| App whitelist/blacklist | ✅ AppLocker (built-in Windows 11 Pro) | ❌ No central push — configure per laptop |
| Web whitelist/blacklist | ✅ SmartScreen + Cloudflare Gateway | ❌ No per-user URL category policy |
| Windows login with company account | ✅ Entra ID Join (free) | ❌ No Conditional Access on login |
| Antivirus | ✅ Defender (excellent) + Malwarebytes Free | ❌ No central management dashboard |
| MDM (central) | ❌ Not available | Requires Intune (paid) |
| Remote wipe | ❌ Not available | Requires Intune |
| Compliance dashboard | ❌ Not available | Requires Intune |
| PIM (temp admin) | ❌ Not available | Requires Entra ID P2 |

**Bottom line:** Free covers the critical security layers (encryption, MFA, malware, DNS). What's missing is **central management** — you do things manually per laptop instead of pushing policies from a dashboard.

---

## 3. Entra ID Free — Identity Setup

### 3.1 Add your company domain
```
entra.microsoft.com → Custom domain names → Add custom domain
→ Enter: yourcompany.com
→ Add the TXT record shown to your DNS provider
→ Click Verify
```

### 3.2 Create user accounts
```
Entra ID → Users → New user → Create user
  Username:    firstname.lastname@yourcompany.com
  Display name: First Last
  Auto-generate password: Yes → copy and send to user
```

### 3.3 Create groups (for future use when upgrading)
```
Entra ID → Groups → New group
  Type: Security
  Create: Engineering, GeneralStaff, ITAdmin
→ Add members to each group
```

### 3.4 Set account policies
```
Entra ID → Users → User settings
  → Users can register applications: No
  → Restrict non-admin users from creating tenants: Yes
  → Users can create security groups: No
```

### 3.5 Block external email guest accounts
```
Entra ID → External Identities → External collaboration settings
  → Guest user access: Most restrictive
  → Guest invite settings: Only admins can invite
```

---

## 4. MFA with Security Defaults

> **Do this first, before setting up any laptop.** Takes 2 minutes and protects every account.

```
entra.microsoft.com → Properties (bottom of left menu)
→ Manage Security defaults (link at bottom of page)
→ Security defaults: Enabled
→ Save
```

**What this does automatically:**
- Every user must register Microsoft Authenticator on next login
- Admin accounts require MFA on every login
- Legacy authentication (basic auth, SMTP AUTH) is blocked
- No configuration needed — Microsoft enforces it

**Users will see a prompt on next login:**
```
"Your organization needs more information to keep your account secure"
→ User downloads Microsoft Authenticator on phone
→ Scans QR code to register
→ Done — MFA active for that user
```

> **Limitation:** Security Defaults cannot be customized. If you need to exclude specific accounts or set different rules per group — you need Entra ID P1 (Conditional Access). For now, this is fine.

---

## 5. Per-Laptop: BIOS Hardening

Do this physically before Windows setup on every laptop.

Power on → press `F2` / `Del` / `F10` (varies by brand) immediately.

| Setting | Where | Value |
|---------|-------|-------|
| Secure Boot | Security tab | **Enabled** |
| Boot order | Boot tab | Internal SSD only — disable USB/PXE |
| BIOS/UEFI password | Security tab | Set a strong password, save to Bitwarden |
| TPM | Security tab | **Enabled** (TPM 2.0) |
| Virtualization (VT-x) | Advanced | **Enabled** |
| Thunderbolt security | Advanced | **User Authorization** |

Save & Exit.

---

## 6. Per-Laptop: BitLocker (manual)

### 6.1 Verify Windows 11 Pro (required for BitLocker)
```powershell
(Get-WmiObject Win32_OperatingSystem).Caption
# Must say: Windows 11 Pro or Enterprise
# If Home: Settings → System → Activation → Upgrade to Pro (~$99 one-time or included in some laptop purchases)
```

### 6.2 Enable BitLocker
```powershell
# Run PowerShell as Administrator
Enable-BitLocker -MountPoint "C:" -EncryptionMethod XtsAes256 -UsedSpaceOnly -TpmProtector

# Get the recovery key — SAVE THIS IMMEDIATELY
$key = (Get-BitLockerVolume -MountPoint C:).KeyProtector |
       Where-Object { $_.KeyProtectorType -eq "RecoveryPassword" } |
       Select-Object -ExpandProperty RecoveryPassword
Write-Host "RECOVERY KEY: $key" -ForegroundColor Yellow
# → Paste this into Bitwarden → Secure Note → "[Username] laptop recovery key"
```

### 6.3 Verify encryption
```powershell
manage-bde -status C:
# Protection Status: Protection On  ✓
# Encryption Method: XTS-AES 256    ✓
```

### 6.4 Save recovery key to Entra ID (free — works even on Free tier)
```powershell
# This works free — Entra ID stores BitLocker keys at no cost
BackupToAAD-BitLockerKeyProtector -MountPoint "C:" -KeyProtectorId (
  (Get-BitLockerVolume -MountPoint C:).KeyProtector |
  Where-Object { $_.KeyProtectorType -eq "RecoveryPassword" }
).KeyProtectorId

# Verify at: entra.microsoft.com → Devices → [device] → Recovery keys
```

---

## 7. Per-Laptop: Windows Hardening Script

> Run this once on each laptop after Windows setup. It applies all the free hardening that Intune would normally push automatically.

Save as `harden-laptop.ps1` and run as Administrator:

```powershell
#Requires -RunAsAdministrator
<#
.SYNOPSIS
    Enterprise laptop hardening — Free tier
    Applies all Windows built-in security controls without requiring Intune or paid licenses.
    Run once per laptop during setup.
#>

param(
    [string]$Username = $env:USERNAME
)

$ErrorActionPreference = "Stop"
function Write-Step { param($msg) Write-Host "`n[*] $msg" -ForegroundColor Cyan }
function Write-OK   { param($msg) Write-Host "    ✓ $msg" -ForegroundColor Green }
function Write-Warn { param($msg) Write-Host "    ⚠ $msg" -ForegroundColor Yellow }

Write-Host "=== Enterprise Laptop Hardening Script ===" -ForegroundColor Magenta
Write-Host "    User: $Username | $(Get-Date -Format 'yyyy-MM-dd HH:mm')"

# ── 1. Screen lock & session policy ──────────────────────────────────────────
Write-Step "Screen lock (5 min idle)"
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System" /v InactivityTimeoutSecs /t REG_DWORD /d 300 /f | Out-Null
reg add "HKCU\Control Panel\Desktop" /v ScreenSaveActive /t REG_SZ /d 1 /f | Out-Null
reg add "HKCU\Control Panel\Desktop" /v ScreenSaverIsSecure /t REG_SZ /d 1 /f | Out-Null
reg add "HKCU\Control Panel\Desktop" /v ScreenSaveTimeOut /t REG_SZ /d 300 /f | Out-Null
Write-OK "Screen locks after 5 minutes idle"

# ── 2. Disable AutoRun / AutoPlay ─────────────────────────────────────────────
Write-Step "Disable AutoRun/AutoPlay (USB attack prevention)"
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Explorer" /v NoDriveTypeAutoRun /t REG_DWORD /d 255 /f | Out-Null
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Explorer" /v NoAutorun /t REG_DWORD /d 1 /f | Out-Null
Write-OK "AutoRun disabled for all drive types"

# ── 3. Disable SMBv1 (ransomware vector) ─────────────────────────────────────
Write-Step "Disable SMBv1 (EternalBlue / WannaCry vector)"
Set-SmbServerConfiguration -EnableSMB1Protocol $false -Force
Disable-WindowsOptionalFeature -Online -FeatureName SMB1Protocol -NoRestart | Out-Null
Write-OK "SMBv1 disabled"

# ── 4. Disable PowerShell v2 (bypasses AMSI) ─────────────────────────────────
Write-Step "Disable PowerShell v2"
Disable-WindowsOptionalFeature -Online -FeatureName MicrosoftWindowsPowerShellV2Root -NoRestart | Out-Null
Disable-WindowsOptionalFeature -Online -FeatureName MicrosoftWindowsPowerShellV2 -NoRestart | Out-Null
Write-OK "PowerShell v2 disabled"

# ── 5. Enable PowerShell Script Block Logging ─────────────────────────────────
Write-Step "Enable PowerShell script block logging"
$psLogPath = "HKLM:\SOFTWARE\Policies\Microsoft\Windows\PowerShell\ScriptBlockLogging"
New-Item -Path $psLogPath -Force | Out-Null
Set-ItemProperty -Path $psLogPath -Name EnableScriptBlockLogging -Value 1
Set-ItemProperty -Path $psLogPath -Name EnableScriptBlockInvocationLogging -Value 1
$psModPath = "HKLM:\SOFTWARE\Policies\Microsoft\Windows\PowerShell\ModuleLogging"
New-Item -Path $psModPath -Force | Out-Null
Set-ItemProperty -Path $psModPath -Name EnableModuleLogging -Value 1
Write-OK "PowerShell logging enabled — feeds Windows Event Log"

# ── 6. LSA Protection (block credential dumping) ─────────────────────────────
Write-Step "Enable LSA Protection (block Mimikatz)"
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Lsa" /v RunAsPPL /t REG_DWORD /d 1 /f | Out-Null
Write-OK "LSA protection enabled — restart required to take effect"

# ── 7. Credential Guard ───────────────────────────────────────────────────────
Write-Step "Enable Credential Guard (VBS)"
reg add "HKLM\SYSTEM\CurrentControlSet\Control\DeviceGuard" /v EnableVirtualizationBasedSecurity /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\DeviceGuard" /v RequirePlatformSecurityFeatures /t REG_DWORD /d 3 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Lsa" /v LsaCfgFlags /t REG_DWORD /d 1 /f | Out-Null
Write-OK "Credential Guard configured — restart required"

# ── 8. Attack Surface Reduction (ASR) Rules ───────────────────────────────────
Write-Step "Enable ASR rules (11 rules)"
$asrRules = @{
    "D4F940AB-401B-4EFC-AADC-AD5F3C50688A" = "Block Office child processes"
    "3B576869-A4EC-4529-8536-B80A7769E899" = "Block Office executable content"
    "75668C1F-73B5-4CF0-BB93-3ECF5CB7CC84" = "Block Office injection into processes"
    "9E6C4E1F-7D60-472F-BA1A-A39EF669E4B2" = "Block credential stealing from LSASS"
    "BE9BA2D9-53EA-4CDC-84E5-9B1EEEE46550" = "Block executable content from email"
    "5BEB7EFE-FD9A-4556-801D-275E5FFC04CC" = "Block obfuscated scripts"
    "D3E037E1-3EB8-44C8-A917-57927947596D" = "Block JS/VBS launching executables"
    "B2B3F03D-6A65-4F7B-A9C7-1C7EF74A9BA4" = "Block untrusted USB processes"
    "92E97FA1-2EDF-4476-BDD6-9DD0B4DDDC7B" = "Block Win32 API from Office macro"
    "01443614-CD74-433A-B99E-2ECDC07BFC25" = "Block untrusted executables (smart screen)"
    "E6DB77E5-3DF2-4CF1-B95A-636979351E5B" = "Block persistence through WMI"
}
foreach ($id in $asrRules.Keys) {
    Add-MpPreference -AttackSurfaceReductionRules_Ids $id -AttackSurfaceReductionRules_Actions Enabled
    Write-OK $asrRules[$id]
}

# ── 9. Enable Defender features ────────────────────────────────────────────────
Write-Step "Harden Windows Defender"
Set-MpPreference -EnableNetworkProtection Enabled
Set-MpPreference -EnableControlledFolderAccess Enabled
Set-MpPreference -CloudBlockLevel High
Set-MpPreference -CloudExtendedTimeout 50
Set-MpPreference -PUAProtection Enabled
Set-MpPreference -DisableRealtimeMonitoring $false
Write-OK "Network protection, controlled folder access, cloud protection enabled"

# ── 10. Windows Firewall ────────────────────────────────────────────────────────
Write-Step "Harden Windows Firewall"
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True
Set-NetFirewallProfile -Profile Public -DefaultInboundAction Block -DefaultOutboundAction Allow
Set-NetFirewallProfile -Profile Private -DefaultInboundAction Block -DefaultOutboundAction Allow
# Disable inbound RDP from public (allow only private network)
Set-NetFirewallRule -Name "RemoteDesktop-UserMode-In-TCP" -Profile Private -Enabled True
Set-NetFirewallRule -Name "RemoteDesktop-UserMode-In-TCP" -Profile Public -Enabled False
Write-OK "Firewall enabled on all profiles, RDP blocked on public"

# ── 11. Disable Remote Desktop for standard users ─────────────────────────────
Write-Step "Disable Remote Desktop (standard users)"
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server" /v fDenyTSConnections /t REG_DWORD /d 1 /f | Out-Null
Write-OK "Remote Desktop disabled"

# ── 12. Disable unnecessary services ─────────────────────────────────────────
Write-Step "Disable attack-surface services"
$servicesToDisable = @(
    "RemoteRegistry",    # Remote registry access
    "WinRM",             # Windows Remote Management
    "XboxGipSvc",        # Xbox services (not needed on work laptop)
    "XblAuthManager",
    "XblGameSave",
    "XboxNetApiSvc"
)
foreach ($svc in $servicesToDisable) {
    try {
        Set-Service -Name $svc -StartupType Disabled -ErrorAction SilentlyContinue
        Stop-Service -Name $svc -Force -ErrorAction SilentlyContinue
        Write-OK "Disabled: $svc"
    } catch { Write-Warn "Could not disable $svc (may not exist)" }
}

# ── 13. Audit Policy ──────────────────────────────────────────────────────────
Write-Step "Enable audit policy"
auditpol /set /subcategory:"Logon" /success:enable /failure:enable | Out-Null
auditpol /set /subcategory:"Logoff" /success:enable | Out-Null
auditpol /set /subcategory:"Account Lockout" /success:enable /failure:enable | Out-Null
auditpol /set /subcategory:"User Account Management" /success:enable /failure:enable | Out-Null
auditpol /set /subcategory:"Sensitive Privilege Use" /success:enable /failure:enable | Out-Null
auditpol /set /subcategory:"Removable Storage" /success:enable /failure:enable | Out-Null
auditpol /set /subcategory:"Policy Change" /success:enable /failure:enable | Out-Null
# Increase Security log size (default 20MB → 256MB)
wevtutil sl Security /ms:268435456 | Out-Null
Write-OK "Audit policy configured, Security log size 256MB"

# ── 14. Account lockout policy ───────────────────────────────────────────────
Write-Step "Set account lockout policy (10 attempts → 15 min)"
net accounts /lockoutthreshold:10 /lockoutwindow:15 /lockoutduration:15 | Out-Null
Write-OK "Account lockout: 10 failed attempts → 15 min lockout"

# ── 15. Disable anonymous access ─────────────────────────────────────────────
Write-Step "Disable anonymous SID/name translation"
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Lsa" /v RestrictAnonymous /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Lsa" /v RestrictAnonymousSAM /t REG_DWORD /d 1 /f | Out-Null
Write-OK "Anonymous access restricted"

# ── 16. Show login info security ─────────────────────────────────────────────
Write-Step "Don't display last username on login screen"
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System" /v DontDisplayLastUserName /t REG_DWORD /d 1 /f | Out-Null
Write-OK "Last username hidden on login"

# ── 17. Disable USB storage (optional — comment out for engineers) ────────────
Write-Step "Block USB storage devices"
reg add "HKLM\SYSTEM\CurrentControlSet\Services\USBSTOR" /v Start /t REG_DWORD /d 4 /f | Out-Null
Write-Warn "USB storage BLOCKED — to re-enable: reg add HKLM\SYSTEM\CurrentControlSet\Services\USBSTOR /v Start /t REG_DWORD /d 3 /f"

# ── 18. Summary ────────────────────────────────────────────────────────────────
Write-Host "`n=== Hardening Complete ===" -ForegroundColor Magenta
Write-Host "ACTION REQUIRED:" -ForegroundColor Yellow
Write-Host "  1. Restart laptop for Credential Guard + LSA protection to take effect"
Write-Host "  2. Save BitLocker recovery key to Bitwarden before restart"
Write-Host "  3. Verify Secure Boot is ON in BIOS (Confirm-SecureBootUEFI)"
Write-Host "  4. Remove local admin from user account (see Section 3 of this guide)"
Write-Host ""
```

### Run it
```powershell
# Right-click PowerShell → Run as Administrator
Set-ExecutionPolicy Bypass -Scope Process -Force
.\harden-laptop.ps1
```

---

## 8. Cloudflare Zero Trust (free, ≤50 users)

> This is the biggest free win most people miss. Cloudflare Zero Trust free tier replaces a corporate VPN and DNS security product — for zero cost up to 50 users.

### What you get free
| Feature | What it does |
|---------|-------------|
| **DNS Gateway** | Block malware/phishing/ad domains at DNS layer |
| **Zero Trust Access** | Secure access to internal apps without VPN |
| **WARP client** | Endpoint agent — enforces DNS filtering on all networks |
| **Device posture** (basic) | Check OS version, disk encryption status |
| **Tunnel** | Expose internal services securely without firewall holes |

### 8.1 Create account
```
1. dash.cloudflare.com → Sign up (free)
2. Zero Trust → Get started → Choose team name: yourcompany
3. Select plan: Free
```

### 8.2 Enable DNS Gateway (malware blocking)
```
Zero Trust → Gateway → DNS policies → Add a policy

Policy name: "Block malicious categories"
Selector: DNS Category
Categories to block (check all):
  ✓ Malware
  ✓ Phishing
  ✓ Command and Control
  ✓ Cryptomining
  ✓ Spyware
  ✓ DNS Tunneling
Action: Block
```

Add another policy:
```
Policy name: "Block high-risk file types"
Selector: DNS Domain matches regex: .*\.(exe|msi|bat|ps1)$
Action: Block
```

### 8.3 Deploy WARP client on each laptop
```powershell
# Download and install Cloudflare WARP for Windows
winget install Cloudflare.Warp

# Or download from: one.one.one.one/warp → Windows
```

Configure WARP to connect to your Zero Trust org:
```
WARP tray icon → Preferences → Account → Login with Cloudflare Zero Trust
→ Enter your team name: yourcompany
→ Authenticate with company email (Entra ID SSO)
```

### 8.4 Enforce WARP via script (until you have Intune)
```powershell
# Deploy via MDM or run manually — ensures WARP always connects
# Set WARP to start on boot and connect automatically
$warpPath = "C:\Program Files\Cloudflare\Cloudflare WARP"
$warpConfig = @"
{
  "organization": "yourcompany",
  "display_name": "YourCompany VPN",
  "switch_locked": true,
  "service_mode_v2": {
    "mode": "warp"
  }
}
"@
$warpConfig | Out-File "$warpPath\mdm.json" -Encoding UTF8
Write-Host "WARP configured — user cannot disconnect"
```

### 8.5 Protect internal tools with Cloudflare Access (zero VPN)
```
Zero Trust → Access → Applications → Add an application
  → Type: Self-hosted
  → Application name: "Internal Dashboard"
  → Domain: dashboard.yourcompany.com

  → Add policy:
    Name: "Company employees only"
    Include: Emails ending in @yourcompany.com
    Require: Identity (Entra ID SSO)
```

Users visit `dashboard.yourcompany.com` → redirected to company SSO → access granted. No VPN needed.

---

## 9. Wazuh EDR + SIEM (free, self-hosted)

> Wazuh is a fully open-source security platform. It gives you EDR agent, file integrity monitoring, vulnerability detection, and a SIEM dashboard for free.

### 9.1 Deploy Wazuh Server (one-time, runs on cheap VPS)

**Minimum server:** 2 CPU / 4GB RAM / 50GB disk — a $10/month VPS (DigitalOcean, Hetzner, Linode) is sufficient for a small team.

```bash
# On Ubuntu 22.04 VPS
curl -sO https://packages.wazuh.com/4.7/wazuh-install.sh
chmod +x wazuh-install.sh
sudo bash wazuh-install.sh -a   # Installs manager + dashboard + indexer

# Get auto-generated password
sudo tar -axf wazuh-install-files.tar wazuh-install-files/wazuh-passwords.txt -O \
  | grep -P "\"admin\""

# Dashboard at: https://<your-vps-ip>
# Login: admin / <generated-password>
```

### 9.2 Install Wazuh Agent on each laptop

```powershell
# PowerShell on laptop — replace WAZUH_MANAGER with your VPS IP
$env:WAZUH_MANAGER  = "your.vps.ip"
$env:WAZUH_AGENT_NAME = $env:COMPUTERNAME

Invoke-WebRequest -Uri "https://packages.wazuh.com/4.x/windows/wazuh-agent-4.7.0-1.msi" `
  -OutFile "$env:TEMP\wazuh-agent.msi"

Start-Process msiexec -ArgumentList `
  "/i $env:TEMP\wazuh-agent.msi WAZUH_MANAGER=$env:WAZUH_MANAGER WAZUH_AGENT_NAME=$env:WAZUH_AGENT_NAME /qn" `
  -Wait

NET START WazuhSvc
Write-Host "Wazuh agent installed and connected"
```

### 9.3 Key alerts to enable in Wazuh Dashboard

```
Dashboard → Security Events → Add rule groups:

Enable:
  ✓ Windows authentication failures (rule 60106)
  ✓ New user created (rule 60107)
  ✓ Admin group modification (rule 60105)
  ✓ Malware detected (rule 87000+)
  ✓ File integrity monitoring — monitor C:\Users\<user>\Documents
  ✓ Vulnerability detection — weekly CVE scan
```

### 9.4 File Integrity Monitoring (FIM)
```xml
<!-- Add to agent ossec.conf (C:\Program Files (x86)\ossec-agent\ossec.conf) -->
<syscheck>
  <frequency>43200</frequency>  <!-- scan every 12 hours -->
  <directories check_all="yes">C:\Users\%USERNAME%\Documents</directories>
  <directories check_all="yes">C:\Program Files</directories>
  <ignore>C:\Windows\SoftwareDistribution</ignore>
</syscheck>
```

---

## 10. Bitwarden — Password Manager

### 10.1 Free option (individual accounts, no sharing)
```
bitwarden.com → Create account (use company email)
Install: winget install Bitwarden.Bitwarden
Browser extension: Edge/Chrome → Bitwarden extension
```

### 10.2 Bitwarden Teams ($3/user/month — strongly recommended)
Enables shared vaults for team credentials (server passwords, API keys, shared accounts):

```
bitwarden.com → Organizations → New organization → Teams ($3/user/month)
→ Invite all team members by company email
→ Create collections:
    - "Engineering shared" — team shared credentials
    - "IT Admin" — admin passwords (restricted to IT Admin group)
    - "Individual" — each user's personal vault
```

### 10.3 Set up emergency access
```
Bitwarden → Settings → Emergency access → Invite
→ Invite: IT Admin / founder account as emergency contact
→ Wait time: 7 days (they can access after 7-day grace period)
→ Prevents complete lockout if an admin leaves
```

### 10.4 Enforce strong master password
```
Bitwarden Org → Settings → Policies
  → Master password strength: Minimum strength 4 (Very strong)
  → Two-step login required: On
  → Single organization: On (prevents personal vaults from mixing)
```

---

## 11. Developer Security (all free)

### 11.1 SSH Key Setup
```bash
# In WSL or Git Bash
ssh-keygen -t ed25519 -C "firstname.lastname@yourcompany.com"
# Enter passphrase (strong, save in Bitwarden)

# Add to ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Add public key to GitHub/GitLab
cat ~/.ssh/id_ed25519.pub
# → GitHub → Settings → SSH keys → New SSH key
```

### 11.2 Git Commit Signing (SSH, no GPG needed)
```bash
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true
git config --global tag.gpgsign true
git config --global user.name "First Last"
git config --global user.email "firstname.lastname@yourcompany.com"
```

### 11.3 Block Secrets from Git (free tools)
```bash
# Install detect-secrets
pip3 install detect-secrets

# Set up global pre-commit hook for ALL repos
git config --global init.templateDir ~/.git-template
mkdir -p ~/.git-template/hooks

cat > ~/.git-template/hooks/pre-commit << 'HOOK'
#!/bin/sh
# Block commits containing secrets
if [ -f .secrets.baseline ]; then
    detect-secrets-hook --baseline .secrets.baseline "$@"
else
    echo "⚠ No .secrets.baseline found. Run: detect-secrets scan > .secrets.baseline"
fi
HOOK
chmod +x ~/.git-template/hooks/pre-commit
echo "Pre-commit hook installed globally"
```

Enable GitHub's free secret scanning (already free for all repos since 2023):
```
GitHub → Repo → Settings → Security → Code security and analysis
→ Secret scanning: Enable
→ Push protection: Enable   ← blocks push if secret detected
```

### 11.4 AWS / Cloud — No Long-Lived Keys
```bash
# Never use: aws configure (creates ~/.aws/credentials — persists on disk)
# Use instead: AWS SSO (short-lived tokens)
aws configure sso
# Profile name, SSO URL, region
aws sso login --profile yourcompany-dev
# Credentials auto-expire — no static keys stored
```

### 11.5 Shell History — Prevent Secret Leakage
```bash
# Add to ~/.bashrc or ~/.zshrc
export HISTIGNORE="*secret*:*token*:*password*:*key*:*aws*:*bearer*"
export HISTCONTROL=ignoreboth   # ignore duplicates + lines starting with space

# For zsh: also disable history for specific patterns
setopt HIST_IGNORE_SPACE        # lines starting with space are not saved
```

### 11.6 WSL .wslconfig (engineers only)
```ini
# C:\Users\<username>\.wslconfig
[wsl2]
networkingMode=mirrored
firewall=true
dnsTunneling=false

[experimental]
autoMemoryReclaim=gradual
```

---

## 12. Email Security — SPF / DKIM / DMARC

> Free DNS record configuration — prevents spoofing of your domain in phishing attacks. Takes 30 minutes, protects forever.

### 12.1 SPF — authorize your mail server
Add a TXT record to your domain DNS:
```dns
Name:  @
Type:  TXT
Value: v=spf1 include:_spf.google.com ~all
       (replace with your email provider's SPF)
       Google: v=spf1 include:_spf.google.com ~all
       Microsoft 365: v=spf1 include:spf.protection.outlook.com ~all
```

### 12.2 DKIM — cryptographic email signing
```
Google Workspace: Admin → Apps → Gmail → Authenticate email → Generate DKIM key
  → Add the TXT record shown to your DNS
  → Click Start authentication

Microsoft 365: Defender portal → Email & Collaboration → Policies → DKIM
  → Select your domain → Enable → copy CNAME records to DNS
```

### 12.3 DMARC — policy enforcement + reporting
```dns
Name:  _dmarc
Type:  TXT
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@yourcompany.com; ruf=mailto:dmarc-reports@yourcompany.com; pct=100
```

Start with `p=none` (reporting only) → review weekly → move to `p=quarantine` → then `p=reject`.

### 12.4 Verify all three records
```bash
# Free online check
# https://mxtoolbox.com/SuperTool.aspx
# Enter your domain → check SPF, DKIM, DMARC
```

---

## 13. Patch Management (manual process)

Without Intune, patch management is a manual discipline. Make it a habit.

### 13.1 Windows Update — enforce immediately
```
Settings → Windows Update → Advanced options
  → Receive updates for other Microsoft products: On
  → Download updates over metered connections: On
  → Active hours: 8am – 6pm (updates install outside this)
  → Restart this device as soon as possible: On
```

### 13.2 Weekly IT reminder (until you have Intune)
Send a Slack/Teams message every Monday:
```
📋 Weekly Security Reminder
Please do the following on your laptop:
1. Windows Update: Settings → Windows Update → Check for updates
2. Restart if any updates pending
3. Reply ✅ when done

Any laptop more than 14 days behind on patches = blocked from company resources (honor system for now)
```

### 13.3 Track patch status manually
Add to asset spreadsheet (Section 14):
| Column | Content |
|--------|---------|
| Last patched date | User self-reports each week |
| OS version | User reports: `winver` command |
| Status | Green / Yellow (7-14 days) / Red (>14 days) |

---

## 14. Asset Inventory (Snipe-IT or Sheet)

### Option A: Google Sheet (< 20 devices, simplest)

Create a sheet with these columns:
```
Asset Tag | Serial Number | Make/Model | OS | Assigned To | Department |
Purchase Date | Warranty Expiry | BitLocker Key Location | Wazuh Agent | Last Patched | Notes
```

Update on every new device, reassignment, or exit.

### Option B: Snipe-IT (free, self-hosted, proper CMDB)
Better for 15+ devices — has barcodes, check-in/check-out, email alerts on warranty expiry.

```bash
# Deploy on same VPS as Wazuh (or separate cheap VPS)
# Docker install (simplest)
docker run -d \
  --name snipe-it \
  -p 8080:80 \
  -e APP_URL=http://your-vps-ip:8080 \
  -e MYSQL_PORT_3306_TCP_ADDR=db \
  -e MYSQL_PORT_3306_TCP_PORT=3306 \
  -e MYSQL_DATABASE=snipeit \
  -e MYSQL_USER=snipeit \
  -e MYSQL_PASSWORD=changeme \
  snipe/snipe-it:latest

# Access at: http://your-vps-ip:8080
# Full docs: snipe-it.io/docs
```

---

## 15. Incident Response (manual runbooks)

Without a SIEM correlation engine, you detect incidents via:
- Wazuh alerts (email/webhook configured)
- User reports
- Cloudflare Gateway block logs

### Lost/Stolen Laptop
```
1. Ask user: "Was BitLocker enabled?" → Yes: data is protected
2. Entra ID → Users → [user] → Revoke sessions (invalidates all tokens)
3. Change user's password immediately
4. Disable MFA methods → re-register on new device
5. Mark device as lost in asset inventory
6. If found: re-image before returning to service
```

### Suspected Malware
```
1. Physically disconnect laptop from network (pull cable, disable Wi-Fi)
2. Do NOT power off — preserves memory artifacts
3. Boot into Windows Recovery → run Defender offline scan
4. Check Wazuh dashboard for timeline of events on that device
5. If confirmed: wipe and re-image from known-good state
6. Re-run harden-laptop.ps1 after re-image
```

### Account Compromise (password leaked)
```
1. Entra ID → Users → [user] → Revoke sessions
2. Reset password immediately
3. Check sign-in logs: Entra ID → Users → [user] → Sign-in logs
   → Look for unfamiliar IP / location / time
4. If suspicious activity found → check what apps/data were accessed
5. Notify user, update Bitwarden (change any passwords they knew)
```

---

## 16. New Employee Onboarding Checklist

### IT Actions (before Day 1)
- [ ] Create Entra ID account (`firstname.lastname@yourcompany.com`)
- [ ] Add to Engineering group in Entra ID
- [ ] Assign Bitwarden Teams seat + invite
- [ ] Add to asset inventory (serial, model, assigned user)
- [ ] Run `harden-laptop.ps1` on the new laptop
- [ ] Enable BitLocker → save recovery key to Bitwarden IT vault
- [ ] Install Wazuh agent → verify agent appears in dashboard
- [ ] Install Cloudflare WARP → verify device appears in Zero Trust dashboard

### Employee Actions (Day 1)
- [ ] Sign in with Entra ID account
- [ ] Register MFA (Microsoft Authenticator) — Security Defaults will prompt
- [ ] Set up Windows Hello PIN (8+ digits)
- [ ] Install Bitwarden → log in with company account
- [ ] Install Cloudflare WARP → connect to team org
- [ ] Set up SSH key (`ssh-keygen -t ed25519`)
- [ ] Configure git (`user.name`, `user.email`, commit signing)
- [ ] Install detect-secrets pre-commit hook
- [ ] Read and sign: Acceptable Use Policy

---

## 17. Employee Exit Checklist

### Within 1 Hour of Notice
- [ ] Entra ID → Users → [user] → Revoke all sessions
- [ ] Entra ID → Users → [user] → Block sign-in: Yes
- [ ] Remove from Bitwarden org (revokes access to all shared vaults)
- [ ] Revoke GitHub/GitLab org membership
- [ ] Revoke Cloudflare Zero Trust user (auto-blocks WARP)

### Within 24 Hours
- [ ] Retrieve company laptop
- [ ] Wipe: `Settings → System → Recovery → Reset this PC → Remove everything`
- [ ] Remove from asset inventory (or mark "decommissioned")
- [ ] Remove from Wazuh (deregister agent)
- [ ] Change any shared passwords the user knew (from Bitwarden audit)
- [ ] Transfer any GitHub repos they owned to team org

### Within 7 Days
- [ ] Review Entra ID sign-in logs for the last 30 days
- [ ] Review Wazuh events for last 30 days on their device
- [ ] Delete Entra ID account (after audit complete) or keep disabled 90 days per policy

---

## 18. Upgrade Path — When to Move to Paid

Use this guide until one of these triggers happens — then upgrade to M365 Business Premium:

| Trigger | Why it forces upgrade |
|---------|----------------------|
| **> 10 laptops** | Manual setup per laptop becomes unsustainable |
| **First SOC 2 audit scoping** | Auditors require central MDM evidence (Intune) |
| **First enterprise customer asking for compliance** | Conditional Access + Intune = required evidence |
| **Remote wipe needed** (lost laptop) | Not possible without Intune |
| **Engineer leaves and has local admin** | No way to force policy without MDM |
| **Team > 50** | Cloudflare Zero Trust free tier cap |

### Upgrade cost for 20 people
```
M365 Business Premium:  20 × $22 = $440/month
Entra ID P2 add-on:      2 × $6  = $12/month (IT admins only)
─────────────────────────────────────────────
Total:                             ~$452/month
```

### Migration is painless
All configuration in this guide survives the upgrade:
- Entra ID users/groups → already there, just assign new licenses
- BitLocker keys → already escrowed to Entra ID (from Step 6.4)
- Cloudflare Zero Trust → continues working alongside Intune
- Wazuh → continues running, can be replaced with MDE later
- Bitwarden → continues, or migrate to 1Password Business

---

## 19. Entra ID Join — Login with Company Account

> This is the free "domain join" for cloud. After joining, users log into Windows with their company email (`firstname.lastname@yourcompany.com`) instead of a local Windows account. BitLocker recovery key is also automatically escrowed to Entra ID at no cost.

### 19.1 Join the laptop to Entra ID

**Important:** Do this as local Administrator — before giving the laptop to the user.

```
Settings → Accounts → Access work or school
→ Click "Connect"
→ Choose: "Join this device to Microsoft Entra ID"  ← NOT "Add a work or school account"
→ Sign in with IT Admin account (yourname@yourcompany.com)
→ Confirm the org name is correct → Join
→ Restart the laptop
```

### 19.2 First login after joining

At the Windows login screen:
```
→ Click "Other user" (bottom left)
→ Enter: firstname.lastname@yourcompany.com
→ Enter password
→ Microsoft Authenticator MFA prompt appears → approve
→ Windows sets up the user profile (takes ~2 min first time)
```

User is now logged in with their company account. No local Windows account needed.

### 19.3 Verify the join

```powershell
dsregcmd /status
# Look for:
# AzureAdJoined  : YES  ✓
# DomainJoined   : NO   (expected — cloud-only, no on-prem AD)
# TenantName     : yourcompany
```

Also verify in Entra portal:
```
entra.microsoft.com → Devices → All devices
→ [laptop name] should appear with Join Type: Microsoft Entra joined ✓
```

### 19.4 BitLocker key auto-escrow (free)

After Entra ID join, BitLocker recovery key is automatically saved to Entra ID:
```
entra.microsoft.com → Devices → [device name] → Recovery keys
→ Key should appear here (may take up to 15 min after first login)
```

If key is missing, run manually:
```powershell
# Run as Administrator
BackupToAAD-BitLockerKeyProtector -MountPoint "C:" -KeyProtectorId (
  (Get-BitLockerVolume -MountPoint C:).KeyProtector |
  Where-Object { $_.KeyProtectorType -eq "RecoveryPassword" }
).KeyProtectorId
```

### 19.5 Set up Windows Hello after join

After first login with company account:
```
Settings → Accounts → Sign-in options
→ Windows Hello PIN: Set up
  → Must verify identity with MFA first
  → Choose PIN (8+ digits) or fingerprint/face
→ This replaces password for daily login — faster and more secure
```

### 19.6 What Entra ID Join gives you (free)

| Benefit | Detail |
|---------|--------|
| Login with company email | No separate local Windows account |
| BitLocker key in cloud | Recover from `entra.microsoft.com → Devices` |
| Device visible in Entra ID | Audit who has what device |
| SSO to Microsoft apps | OneDrive, Teams, etc. auto-sign-in |
| Security Defaults MFA | Applied at login automatically |
| No cost | Entra ID Free supports this |

---

## 20. BitLocker Status Check

> Quick reference — run these any time to verify a laptop is encrypted.

### Full status
```powershell
manage-bde -status C:
# What to look for:
# Conversion Status:  Fully Encrypted     ✓
# Percentage:         100%                ✓
# Encryption Method:  XTS-AES 256         ✓
# Protection Status:  Protection On       ✓
# Lock Status:        Unlocked            ✓ (normal — TPM unlocks on boot)
# Key Protectors:     TPM, Numerical Password
```

### Quick one-liner
```powershell
(Get-BitLockerVolume -MountPoint C:) | Select-Object MountPoint, VolumeStatus, ProtectionStatus, EncryptionMethod
# VolumeStatus:    FullyEncrypted    ✓
# ProtectionStatus: On               ✓
```

### View and confirm recovery key
```powershell
(Get-BitLockerVolume -MountPoint C:).KeyProtector |
  Where-Object { $_.KeyProtectorType -eq 'RecoveryPassword' } |
  Select-Object RecoveryPassword
# Shows the 48-digit recovery key
# Confirm this key is saved in Bitwarden or Entra ID
```

### Confirm key is in Entra ID
```
entra.microsoft.com → Devices → [device name] → Recovery keys
→ Should show: Drive C: → BitLocker recovery key ✓
```

### Common issues

| Status | Meaning | Fix |
|--------|---------|-----|
| `Protection Off` | BitLocker paused (e.g. after Windows Update) | `manage-bde -protectors -enable C:` |
| `Encryption in progress` | Still encrypting | Wait and re-check |
| `Not encrypted` | BitLocker not enabled | Run Section 6.2 |
| No recovery key in Entra ID | Key not uploaded | Run Section 6.4 |

---

## 21. Antivirus — Free Options

> **Windows Defender (Microsoft Defender Antivirus) is the recommendation.** It consistently scores 6/6 in AV-TEST and AV-Comparatives — matching or beating paid competitors. It's already installed, has zero privacy concerns, and integrates deeply with Windows.

### 21.1 Windows Defender — verify it's fully active

```powershell
Get-MpComputerStatus | Select-Object `
  AMRunningMode, RealTimeProtectionEnabled, `
  IoavProtectionEnabled, AntispywareEnabled, `
  AntivirusSignatureLastUpdated, NISSignatureLastUpdated

# Expected:
# AMRunningMode:               Normal ✓
# RealTimeProtectionEnabled:   True   ✓
# AntispywareEnabled:          True   ✓
# AntivirusSignatureLastUpdated: [within last 24 hours] ✓
```

If signatures are old:
```powershell
Update-MpSignature
# Force immediate signature update
```

### 21.2 Strengthen Defender (already in harden-laptop.ps1, verify here)

```powershell
# Run as Administrator
Set-MpPreference -CloudBlockLevel High          # Block at high confidence
Set-MpPreference -CloudExtendedTimeout 50       # 50s cloud analysis for unknowns
Set-MpPreference -PUAProtection Enabled         # Block potentially unwanted apps
Set-MpPreference -EnableNetworkProtection Enabled  # Block malicious URLs/IPs
Set-MpPreference -EnableControlledFolderAccess Enabled  # Ransomware protection
Set-MpPreference -SubmitSamplesConsent SendAllSamples    # Send unknowns to cloud

# Schedule regular scans
Set-MpPreference -ScanScheduleDay Everyday
Set-MpPreference -ScanScheduleTime 360         # 6:00 AM daily quick scan
```

### 21.3 Antivirus comparison — free options

| Tool | Detection | Performance | Privacy | Use for |
|------|-----------|-------------|---------|--------|
| **Windows Defender** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ No data selling | **Primary — always on** |
| **Malwarebytes Free** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ✅ Good | Secondary on-demand scan |
| **Bitdefender Free** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ✅ Good | Alternative to Defender |
| Avast Free | ⭐⭐⭐⭐ | ⭐⭐⭐ | ❌ Sells usage data | Not recommended |
| AVG Free | ⭐⭐⭐⭐ | ⭐⭐⭐ | ❌ Sells usage data | Not recommended |
| Kaspersky Free | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⚠️ Russian company | Not for company use |

> **Never install two real-time antivirus products simultaneously** — they will conflict and degrade performance. Use Defender as real-time + Malwarebytes Free for on-demand scans only.

### 21.4 Add Malwarebytes Free (on-demand secondary scanner)

```powershell
winget install Malwarebytes.Malwarebytes
```

After install:
```
Malwarebytes → Settings → Real-Time Protection → Off
(Keep real-time OFF — only use for manual scans)

Use: Scan → Threat Scan → once per week or when suspicious
```

### 21.5 Run Defender Offline Scan (for persistent malware)

Runs before Windows boots — detects rootkits and boot-level malware:
```powershell
# Schedule an offline scan on next restart
Start-MpWDOScan
# → Restart the laptop → Defender scans before Windows loads
# Results visible in: Windows Security → Virus & threat protection → Scan history
```

---

## 22. Software Whitelist / Blacklist (AppLocker)

> AppLocker is built into Windows 11 Pro/Enterprise — free, no license needed. It controls which applications can run based on publisher, path, or file hash.

### 22.1 What AppLocker can do

| Rule type | Example |
|-----------|--------|
| **Publisher** (recommended) | Allow only apps signed by Microsoft, Adobe, JetBrains — block everything else |
| **Path** | Block anything running from `%TEMP%`, `%USERPROFILE%\Downloads` |
| **Hash** | Allow only a specific version of an app |

### 22.2 Enable AppLocker service

```powershell
# Run as Administrator
Set-Service -Name AppIDSvc -StartupType Automatic
Start-Service -Name AppIDSvc
Write-Host "AppLocker service running"
```

### 22.3 Create rules via Local Group Policy (gpedit.msc)

```
Win + R → gpedit.msc → Enter

Computer Configuration
→ Windows Settings
→ Security Settings
→ Application Control Policies
→ AppLocker
→ Right-click "Executable Rules" → Create Default Rules
   (creates 3 default rules: allow %WINDIR%, allow %PROGRAMFILES%, block everything else)
```

### 22.4 Recommended ruleset for engineers

```
AppLocker → Executable Rules → Create New Rule

# Rule 1: Allow signed Microsoft apps (publisher rule)
Action: Allow
User: Everyone
Publisher: O=MICROSOFT CORPORATION, L=REDMOND, S=WASHINGTON, C=US
           (any version, any product)

# Rule 2: Allow apps in Program Files (path rule)
Action: Allow
User: Everyone
Path: %PROGRAMFILES%\*

# Rule 3: Allow apps in Windows directory (path rule)
Action: Allow
User: Everyone
Path: %WINDIR%\*

# Rule 4: Block execution from Downloads (path rule)
Action: Deny
User: Everyone
Path: %USERPROFILE%\Downloads\*.exe

# Rule 5: Block execution from Temp (path rule — stops malware droppers)
Action: Deny
User: Everyone
Path: %TEMP%\*.exe

# Rule 6: Block execution from AppData\Roaming (stops many malware families)
Action: Deny
User: Everyone
Path: %APPDATA%\*.exe
```

### 22.5 Audit mode first — then enforce

```powershell
# Start in audit mode — logs what WOULD be blocked without actually blocking
# This prevents breaking things before you know the impact

# Check AppLocker logs (audit mode)
Get-AppLockerFileInformation -EventLog -LogPath "Microsoft-Windows-AppLocker/EXE and DLL" -Statistics

# Or view in Event Viewer:
# Applications and Services Logs → Microsoft → Windows → AppLocker → EXE and DLL
# Event ID 8003 = would have been blocked (audit)
# Event ID 8004 = blocked (enforcement)
```

Review for 1 week → add exceptions for any legitimate apps that would be blocked → switch to enforcement:

```
gpedit.msc → AppLocker → Configure rule enforcement
→ Executable rules: Enforce rules
```

### 22.6 Block specific blacklisted apps

```powershell
# Example: Block TeamViewer by publisher
# AppLocker → Executable Rules → New Rule
# Action: Deny
# Publisher: O=TEAMVIEWER GMBH

# Block Steam
# Publisher: O=VALVE CORP

# Block uTorrent
# Publisher: O=BITTORRENT, INC.

# Or block by path (if not code-signed):
# Path: C:\Users\*\AppData\Roaming\uTorrent\*
```

---

## 23. Web Filtering (SmartScreen + Cloudflare)

> Two layers: Cloudflare Gateway blocks at DNS level (before connection), SmartScreen blocks at browser level (when visiting).

### 23.1 Layer 1 — Cloudflare Gateway (DNS blocking)

Already set up in Section 8. Verify it's working:

```
Zero Trust → Gateway → DNS policies
→ Confirm "Block malicious categories" policy is Active ✓
→ Logs → DNS queries → filter by "Blocked" → should see blocked malware domains
```

Add more blocked categories for non-engineering staff:
```
Zero Trust → Gateway → DNS policies → Edit policy
→ Add categories:
  ✓ Gambling          (if not work-relevant)
  ✓ Adult content
  ✓ Peer-to-peer
  ✓ Proxy & filter avoidance  ← important — blocks VPN bypass attempts
  ✓ Newly registered domains  ← common for phishing sites
```

### 23.2 Layer 2 — Microsoft SmartScreen (browser + file)

SmartScreen blocks:
- Known phishing / malware websites in Edge and Chrome
- Downloaded files with bad reputation
- Apps with no signing history (PUA)

**Enable SmartScreen via registry (gpedit.msc alternative):**
```powershell
# Run as Administrator

# SmartScreen for Edge
reg add "HKLM\SOFTWARE\Policies\Microsoft\MicrosoftEdge\PhishingFilter" /v EnabledV9 /t REG_DWORD /d 2 /f

# SmartScreen for Windows Explorer (file downloads)
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\System" /v EnableSmartScreen /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\System" /v ShellSmartScreenLevel /t REG_SZ /d Block /f

# SmartScreen for Microsoft Store apps
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender\SmartScreen" /v ConfigureAppInstallControlEnabled /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender\SmartScreen" /v ConfigureAppInstallControl /t REG_SZ /d StoreOnly /f

Write-Host "SmartScreen enforced at Block level"
```

**Verify in Windows Security:**
```
Windows Security → App & browser control
→ Check apps and files:           Block ✓
→ SmartScreen for Edge:           Block ✓
→ SmartScreen for Microsoft Store apps: Block ✓
```

### 23.3 Edge enterprise policy — block specific URLs

```powershell
# Block specific websites via registry (gpedit.msc)
# HKLM\SOFTWARE\Policies\Microsoft\Edge\URLBlocklist

$blockedSites = @(
    "*://chatgpt.com",        # block personal AI tools
    "*://chat.openai.com",
    "*://claude.ai",
    "*://gemini.google.com",
    "*://torrentfreak.com",   # torrents
    "*://*.torrent*"
)

$regPath = "HKLM:\SOFTWARE\Policies\Microsoft\Edge\URLBlocklist"
New-Item -Path $regPath -Force | Out-Null
for ($i = 0; $i -lt $blockedSites.Count; $i++) {
    Set-ItemProperty -Path $regPath -Name ($i + 1) -Value $blockedSites[$i]
}
Write-Host "URL blocklist applied — restart Edge to take effect"
```

**To allow specific sites that SmartScreen flags (false positives):**
```powershell
$allowedSites = @(
    "*://github.com",
    "*://npmjs.com",
    "*://registry.npmjs.org"
)

$allowPath = "HKLM:\SOFTWARE\Policies\Microsoft\Edge\URLAllowlist"
New-Item -Path $allowPath -Force | Out-Null
for ($i = 0; $i -lt $allowedSites.Count; $i++) {
    Set-ItemProperty -Path $allowPath -Name ($i + 1) -Value $allowedSites[$i]
}
```

### 23.4 Web filtering summary — what each layer covers

| Layer | What it blocks | Free? |
|-------|---------------|-------|
| Cloudflare Gateway DNS | Malware/phishing domains before connection | ✅ |
| SmartScreen (Edge) | Known bad URLs + reputation-based | ✅ |
| SmartScreen (files) | Downloaded files with bad/no reputation | ✅ |
| Edge URL blocklist | Specific sites you explicitly block | ✅ |
| Cloudflare WARP | Enforces DNS policy on any network (including home) | ✅ |
| SSL inspection | Inspect HTTPS traffic content | ❌ Requires Zscaler/paid |

---

## Appendix: Verification Script

Run after `harden-laptop.ps1` to confirm all controls are active:

```powershell
Write-Host "`n=== Security Verification ===" -ForegroundColor Magenta

# BitLocker
$bl = Get-BitLockerVolume -MountPoint C:
Write-Host "`nBitLocker: " -NoNewline
if ($bl.ProtectionStatus -eq "On") { Write-Host "✓ ON ($($bl.EncryptionMethod))" -ForegroundColor Green }
else { Write-Host "✗ OFF - ENCRYPT NOW" -ForegroundColor Red }

# Secure Boot
Write-Host "Secure Boot: " -NoNewline
try { if (Confirm-SecureBootUEFI) { Write-Host "✓ Enabled" -ForegroundColor Green } }
catch { Write-Host "✗ Disabled or not supported" -ForegroundColor Red }

# TPM
$tpm = Get-Tpm
Write-Host "TPM 2.0: " -NoNewline
if ($tpm.TpmPresent -and $tpm.TpmReady) { Write-Host "✓ Present and ready" -ForegroundColor Green }
else { Write-Host "✗ Not ready" -ForegroundColor Red }

# Defender
$def = Get-MpComputerStatus
Write-Host "Defender Real-Time: " -NoNewline
if ($def.RealTimeProtectionEnabled) { Write-Host "✓ On" -ForegroundColor Green }
else { Write-Host "✗ Off" -ForegroundColor Red }

# Credential Guard
$dg = (Get-CimInstance -ClassName Win32_DeviceGuard -Namespace root\Microsoft\Windows\DeviceGuard).SecurityServicesRunning
Write-Host "Credential Guard: " -NoNewline
if ($dg -contains 1) { Write-Host "✓ Running" -ForegroundColor Green }
else { Write-Host "⚠ Not running (restart required?)" -ForegroundColor Yellow }

# LSA Protection
$lsa = (Get-ItemProperty "HKLM:\SYSTEM\CurrentControlSet\Control\Lsa" -Name RunAsPPL -ErrorAction SilentlyContinue).RunAsPPL
Write-Host "LSA Protection: " -NoNewline
if ($lsa -eq 1) { Write-Host "✓ Enabled" -ForegroundColor Green }
else { Write-Host "✗ Not enabled" -ForegroundColor Red }

# ASR Rules
$asr = Get-MpPreference | Select-Object -ExpandProperty AttackSurfaceReductionRules_Actions
Write-Host "ASR Rules active: " -NoNewline
Write-Host "$($asr.Count)" -ForegroundColor $(if ($asr.Count -ge 7) { "Green" } else { "Yellow" })

# SMBv1
$smb = (Get-SmbServerConfiguration).EnableSMB1Protocol
Write-Host "SMBv1: " -NoNewline
if (-not $smb) { Write-Host "✓ Disabled" -ForegroundColor Green }
else { Write-Host "✗ ENABLED — run: Set-SmbServerConfiguration -EnableSMB1Protocol `$false -Force" -ForegroundColor Red }

# Entra ID join
$join = (dsregcmd /status | Select-String "AzureAdJoined").ToString().Trim()
Write-Host "Entra ID join: " -NoNewline
if ($join -match "YES") { Write-Host "✓ Joined" -ForegroundColor Green }
else { Write-Host "⚠ Not joined (connect via Settings → Accounts)" -ForegroundColor Yellow }

Write-Host "`n=== Done ===" -ForegroundColor Magenta
```

---

*Last updated: 2026-06-23*
*Owner: IT Security Team*
*Companion doc: [ENTERPRISE_LAPTOP_SETUP.md](ENTERPRISE_LAPTOP_SETUP.md) — premium/paid tier*
