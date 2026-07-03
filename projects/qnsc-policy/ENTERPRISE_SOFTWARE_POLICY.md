# ENTERPRISE SOFTWARE POLICY
**Version:** 1.1 — Effective: 2026-06-28  
**Owner:** IT / Security  
**Scope:** Applies to all company-issued devices only (laptops, workstations)  
**Enforced by:** AppLocker (executables) + Cloudflare Zero Trust (web/categories)  
**Principle:** Default-deny — if not on the whitelist, it is blocked. Request via internal tool.

---

## WHITELIST — Approved Software

| App / Tool | Category | Notes |
|---|---|---|
| Windows 11 Pro + Windows Defender | OS / AV | Required on all laptops — no third-party AV |
| Microsoft 365 (Word, Excel, PowerPoint, Outlook, Teams, OneNote, OneDrive) | Productivity | Core — installed on all |
| Microsoft Authenticator | MFA | Required on all accounts |
| Bitwarden (Enterprise) | Password manager | Company vault — single approved PM |
| Cloudflare WARP | VPN / web filter | Required on all laptops |
| Microsoft Edge | Browser | Primary — managed, enforced SSO |
| Google Chrome | Browser | Secondary |
| Mozilla Firefox | Browser | Secondary |
| Zoom | Meeting | Client meetings only |
| Slack | Communication | If team uses it |
| Adobe Acrobat Reader | PDF | Viewing only (free) |
| 7-Zip | Archive | File compression |
| Notepad++ | Text editor | Plain text / config files |
| VLC Media Player | Media | Video/audio playback |
| Microsoft Intune Remote Help | IT remote access | Approved tool for IT support sessions only |
| Windows Quick Assist (built-in) | IT remote access | Backup IT support tool — company account only |
| GitHub Copilot | AI coding | Managed via GitHub Enterprise — code stays in tenant |
| Microsoft Copilot (in M365 / Teams) | AI productivity | Managed via M365 Business Premium — data stays in tenant |
| ChatGPT / Claude / Gemini (browser only) | AI general | Browser access only — see AI data rule below |
| Visual Studio Code | IDE | Primary editor |
| JetBrains suite (IntelliJ, WebStorm, GoLand, DataGrip, PyCharm, Rider) | IDE | Licensed devs |
| Android Studio | IDE | Mobile devs |
| Visual Studio 2022 | IDE | .NET / C# devs |
| Cursor / Windsurf | AI IDE | Approved AI editors |
| Git (git-scm.com) | VCS | Required for all devs |
| GitHub Desktop | VCS | GUI for Git |
| GitHub CLI (gh) | VCS | CLI |
| Docker Desktop | Container | Dev environment |
| WSL2 | Linux env | Windows-only devs |
| Windows Terminal | Terminal | Terminal emulator |
| Postman / Bruno / Insomnia | API testing | Pick one per dev |
| DBeaver / TablePlus / pgAdmin | Database | DB management |
| MongoDB Compass / Redis Insight | Database | MongoDB / Redis GUI |
| Node.js LTS (nodejs.org) | Runtime | JS / TS dev |
| Python (python.org) | Runtime | Python dev |
| Java JDK (Adoptium/OpenJDK) | Runtime | Java dev |
| Go (go.dev) | Runtime | Go dev |
| Rust (rustup.rs) | Runtime | Rust dev |
| .NET SDK (microsoft.com) | Runtime | .NET dev |
| AWS CLI | Cloud CLI | AWS access |
| Azure CLI | Cloud CLI | Entra / Azure management |
| kubectl / Helm / k9s / Lens | Cloud CLI | Kubernetes management |
| Terraform | IaC | Infrastructure as code |
| Cloudflare CLI (wrangler) | Cloud CLI | Cloudflare Workers dev |
| Figma (web-based) | Design | No install needed |
| Adobe Creative Cloud | Design | Licensed designers only |
| Canva (browser) | Design | Marketing team |
| Wireshark / Nmap / Burp Suite | Security tools | IT / Security role only |
| Greenshot | Screenshot + annotation | Free / open source — recommended capture tool |
| ShareX | Screenshot + screen recording | Free / open source — advanced capture + annotation |
| Flameshot | Screenshot + annotation | Free / open source — cross-platform alternative |
| OBS Studio | Screen recording | Free / open source — full recording + streaming |
| Obsidian | Notes | Free — local markdown, no account required, dev-friendly |
| Joplin | Notes | Free / open source — E2E encrypted sync, supports markdown |
| Standard Notes | Notes | Free / open source — minimal, encrypted |
| Power BI Desktop | Data analytics (EDA) | Free from Microsoft — data visualization + reporting |
| Orange | Data analytics (EDA) | Free / open source — visual data mining, no-code analytics |
| KNIME Community Edition | Data analytics (EDA) | Free / open source — workflow-based analytics |
| RStudio Desktop | Data analytics (EDA) | Free / open source — R language IDE + data science |
| KiCad | IC / PCB design | Free / open source — full schematic + PCB layout suite |
| LTspice | Circuit simulation | Free (Analog Devices) — SPICE circuit simulator |
| ngspice | Circuit simulation | Free / open source — SPICE3 simulator, CLI-based |
| Xschem | Schematic editor (IC) | Free / open source — IC schematic capture, works with ngspice |
| Icarus Verilog (iverilog) | HDL simulation | Free / open source — Verilog / SystemVerilog simulator |
| GHDL | HDL simulation | Free / open source — VHDL simulator |
| GTKWave | Waveform viewer | Free / open source — view simulation output (.vcd / .fst) |
| Yosys | RTL synthesis | Free / open source — Verilog synthesis tool |
| Intel Quartus Prime Lite | FPGA design | Free (Intel) — FPGA synthesis + place-and-route for Intel/Altera FPGAs |

> **AI data rule:** Do NOT paste source code, customer data, credentials, or internal documents into any external AI tool (browser or app). Browser-only AI tools are allowed for general questions only.

---

## BLACKLIST — Blocked Software

| App / Tool | Category | Why blocked |
|---|---|---|
| TeamViewer / AnyDesk / LogMeIn (personal) | Remote access | Unauthorized access vector — common malware channel |
| Ammyy Admin / UltraVNC (personal) | Remote access | Same — known malware distribution |
| Chrome Remote Desktop (personal Gmail) | Remote access | Bypasses corporate identity — use Intune Remote Help |
| NordVPN / ExpressVPN / ProtonVPN | VPN | Bypasses Cloudflare Zero Trust web filter |
| Psiphon / Hotspot Shield / CyberGhost | VPN / Proxy | Same |
| Tor Browser | Anonymizer | Fully unmonitorable — bypasses all controls |
| Any unapproved browser extension | Browser extension | Can read all page content — data exfiltration risk |
| Any browser proxy extension | Proxy | Bypasses web filtering |
| Dropbox desktop / Google Drive desktop sync | Cloud storage | Company data exits M365 DLP boundary — use OneDrive |
| MEGA desktop / pCloud / Box Drive (personal) | Cloud storage | Same |
| LastPass / 1Password / Keeper / Dashlane (personal) | Password manager | Not company-managed — use Bitwarden |
| Browser built-in password saving | Password manager | Unmanaged vault — use Bitwarden |
| ChatGPT desktop app / Claude desktop / Gemini desktop | AI desktop app | Unmanaged — no DLP control, code/data leakage risk |
| Any unapproved local AI model runner (LM Studio, Ollama personal) | AI | Requires IT security review before use |
| WhatsApp desktop / Telegram desktop | Personal messaging | Data exfiltration risk + unmanaged communication channel |
| Discord desktop | Social / messaging | Not a business tool — personal use only |
| qBittorrent / uTorrent / BitTorrent / Vuze | Torrent | P2P traffic + copyright + malware risk |
| Any software keygen / crack / activator | Piracy | Legal risk + malware vector |
| KMS activator / Windows-Office crack | Piracy | License violation + security risk |
| Any cryptocurrency mining software | Crypto mining | CPU/GPU abuse at company cost |
| Steam / Epic Games / Battle.net / Ubisoft Connect | Games | Not allowed on company-issued devices |
| TikTok desktop | Social media | Known data collection / exfiltration risk |
| Any EOL software (Windows < 11, Office < M365, Python 2, Node < LTS) | Outdated | Unpatched CVEs — security risk |

---

## CLOUDFLARE ZERO TRUST — Web Category Block Rules

> Applied at network level — covers all browsers and apps on the device.

| Category | Rule | Reason |
|---|---|---|
| Malware / Phishing | Block | Automatic via Cloudflare threat intel feed |
| Botnet / C2 | Block | Automatic via Cloudflare threat intel feed |
| Spyware / Adware | Block | Automatic via Cloudflare threat intel feed |
| Newly Registered Domains (< 30 days) | Block | ~70% of phishing domains are newly registered |
| Anonymizers & VPNs | Block | Bypasses WARP / Zero Trust controls |
| P2P / Torrent | Block | Copyright + malware risk |
| Cryptocurrency mining | Block | Mining pool traffic |
| Adult content | Block | Workplace policy |
| Gambling | Block | Workplace policy |
| Web-based games | Block | Productivity |
| TikTok | Block | Data exfiltration risk (app + web) |
| Facebook / Instagram / Twitter-X (desktop browser) | Block | Productivity + data exfiltration risk |
| Unauthorized cloud storage (MEGA, pCloud) | Block | Data exits M365 DLP boundary |
| Software piracy / keygen sites | Block | Legal + malware risk |
| LinkedIn | Allow | Business networking |
| YouTube | Allow | Dev tutorials / legitimate business use |

---

## DEV / PACKAGE REGISTRY ALLOWLIST — Always Allow

> Explicitly whitelisted so aggressive category rules never block dev tools.

| Domain | Used by | Notes |
|---|---|---|
| github.com / raw.githubusercontent.com / ghcr.io | All devs | VCS + container registry |
| hub.docker.com / registry-1.docker.io | Docker Desktop | Container image pull |
| npmjs.com / registry.npmjs.org | Node.js / JS devs | npm packages |
| pypi.org / files.pythonhosted.org | Python devs | pip packages |
| crates.io / static.crates.io | Rust devs | cargo packages |
| proxy.golang.org / pkg.go.dev / sum.golang.org | Go devs | Go modules |
| repo1.maven.org / maven.apache.org | Java devs | Maven packages |
| nuget.org / api.nuget.org | .NET devs | NuGet packages |
| registry.terraform.io / releases.hashicorp.com | DevOps | Terraform providers |
| quay.io | DevOps | Red Hat container registry |
| cdn.jsdelivr.net / unpkg.com | Frontend devs | JS CDN — used in local dev |
| amazonaws.com / aws.amazon.com | All | AWS services + CLI |
| azure.com / microsoftonline.com / microsoft.com | All | Azure / M365 / Entra auth |
| googleapis.com / accounts.google.com | All | Google OAuth + APIs (used by many SaaS tools) |
| cloudflare.com / developers.cloudflare.com | All | Cloudflare services + docs |
| letsencrypt.org / acme-v02.api.letsencrypt.org | DevOps | TLS certificate issuance |
| stackoverflow.com / stackexchange.com | Devs | Knowledge base |
| developer.mozilla.org / mdn.dev | Frontend devs | Web API reference |
| docs.github.com / docs.docker.com | All devs | Official docs |
| figma.com | Designers | Web-based design tool |
| fonts.google.com / fonts.gstatic.com | Frontend devs | Web fonts |
| linkedin.com | All | Business networking (aligned with Cloudflare allow rule) |
| youtube.com | Devs | Tutorials / official product demos |

---

**Request process:** Submit via internal tool -> manager approves -> IT unblocks within 4 hours.  
**1h temp admin for install:** Request in internal tool -> manager approves -> local admin granted 1 hour -> auto-revoked.  
**Policy review:** Reviewed every 6 months by IT / Security owner.
