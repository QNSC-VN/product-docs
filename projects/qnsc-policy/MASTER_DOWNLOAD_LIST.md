# MASTER SOFTWARE DOWNLOAD LIST
**Purpose:** Offline installer collection for ghost image creation and IT deployment  
**Prepared by:** Nghia-VanTrong | Date: 2026-06-28  
**Rule:** Download from official sources only. Store installers on NAS/shared drive. Verify SHA256 checksum where available.

---

## 1. OS & CORE SECURITY

| App | Edition | Official Download URL | Installer | Notes |
|---|---|---|---|---|
| Windows 11 Pro | Latest (23H2+) | https://www.microsoft.com/software-download/windows11 | ISO | Use Media Creation Tool. Requires license key or VL. |
| Windows Defender | Built-in | — | — | Included with Windows. Update via Windows Update. |
| Microsoft Intune Remote Help | Latest | https://aka.ms/intune-remote-help | .exe | Deployed via Intune portal for IT staff |
| Windows Quick Assist | Built-in | — | — | Included in Windows 11. Enable if disabled. |

---

## 2. PRODUCTIVITY & IDENTITY

| App | Edition | Official Download URL | Installer | Notes |
|---|---|---|---|---|
| Microsoft 365 Apps | Business Premium | https://portal.office.com → Install Office | Click-to-Run | Deploy via M365 admin portal. Includes Word, Excel, PPT, Teams, Outlook, OneDrive. |
| Microsoft Authenticator | Latest | https://aka.ms/AuthenticatorAppAndroid (Android) / iOS App Store | APK / App Store | Deploy link to users for phone setup |
| Bitwarden | Latest | https://bitwarden.com/download/ | .exe | Desktop app for Windows |
| Cloudflare WARP | Latest | https://1.1.1.1/ → Download | .msi | Required on all laptops. Auto-updates. |

---

## 3. BROWSERS

| App | Edition | Official Download URL | Installer | Notes |
|---|---|---|---|---|
| Microsoft Edge | Latest (stable) | Built-in Windows 11 | — | Already installed. Keep updated. |
| Google Chrome | Latest (stable) | https://www.google.com/chrome/ | .msi (enterprise) | Use enterprise MSI for silent install |
| Mozilla Firefox | Latest ESR | https://www.mozilla.org/firefox/enterprise/ | .msi | Use ESR for stability in enterprise |

---

## 4. SCREENSHOT, NOTES & SCREEN RECORDING

| App | Edition | Official Download URL | Installer | Notes |
|---|---|---|---|---|
| Greenshot | Latest | https://getgreenshot.org/downloads/ | .exe | Lightweight screenshot + annotation. Free/open source. |
| ShareX | Latest | https://getsharex.com/ | .exe | Advanced screenshot + screen recording + annotation. Free/open source. |
| Flameshot | Latest | https://flameshot.org/#download | .exe | Alternative screenshot + annotation. Free/open source. |
| OBS Studio | Latest | https://obsproject.com/download | .exe | Full screen recording + streaming. Free/open source. |
| Obsidian | Latest | https://obsidian.md/download | .exe | Local markdown notes. Free. No account required. |
| Joplin | Latest | https://joplinapp.org/download/ | .exe | Open source notes with E2E sync. Free. |
| Standard Notes | Latest | https://standardnotes.com/download | .exe | Encrypted notes. Free/open source. |

---

## 5. COMMUNICATION & MEETINGS

| App | Edition | Official Download URL | Installer | Notes |
|---|---|---|---|---|
| Zoom | Latest | https://zoom.us/download | .msi (IT deploy) | Use IT deployment version for silent install |
| Slack | Latest | https://slack.com/downloads/windows | .exe / .msi | Desktop app |

---

## 6. UTILITIES

| App | Edition | Official Download URL | Installer | Notes |
|---|---|---|---|---|
| Adobe Acrobat Reader | DC (latest) | https://get.adobe.com/reader/ | .exe | Free viewer. Use offline installer link. |
| 7-Zip | Latest (64-bit) | https://www.7-zip.org/download.html | .msi | Use .msi for silent enterprise deploy |
| Notepad++ | Latest | https://notepad-plus-plus.org/downloads/ | .exe | Use 64-bit installer |
| VLC Media Player | Latest | https://www.videolan.org/vlc/ | .msi | Use .msi for silent deploy |

---

## 7. DEVELOPMENT — IDEs & EDITORS

| App | Edition | Official Download URL | Installer | Notes |
|---|---|---|---|---|
| Visual Studio Code | Latest (System Installer) | https://code.visualstudio.com/download | .exe (system) | Use System Installer — installs for all users |
| JetBrains Toolbox App | Latest | https://www.jetbrains.com/toolbox-app/ | .exe | Install Toolbox first, then install IDEs from it |
| Android Studio | Latest | https://developer.android.com/studio | .exe | Mobile devs only |
| Visual Studio 2022 | Community / Professional | https://visualstudio.microsoft.com/downloads/ | .exe | .NET / C# devs |
| Cursor | Latest | https://cursor.sh/ | .exe | AI IDE — approved |
| Windsurf | Latest | https://codeium.com/windsurf | .exe | AI IDE — approved |

---

## 8. VERSION CONTROL

| App | Edition | Official Download URL | Installer | Notes |
|---|---|---|---|---|
| Git | Latest (64-bit) | https://git-scm.com/download/win | .exe | Use default installer options |
| GitHub Desktop | Latest | https://desktop.github.com/ | .exe | |
| GitHub CLI | Latest | https://cli.github.com/ | .msi | |

---

## 9. CONTAINERS & TERMINALS

| App | Edition | Official Download URL | Installer | Notes |
|---|---|---|---|---|
| Docker Desktop | Latest | https://www.docker.com/products/docker-desktop/ | .exe | Requires WSL2 backend — install WSL2 first |
| Windows Terminal | Latest | https://aka.ms/terminal | .msixbundle | Also available via Microsoft Store |
| WSL2 | Latest | `wsl --install` in admin PowerShell | — | Enable via PowerShell, then install Ubuntu or Debian distro |

---

## 10. API TESTING

| App | Edition | Official Download URL | Installer | Notes |
|---|---|---|---|---|
| Postman | Latest | https://www.postman.com/downloads/ | .exe | |
| Bruno | Latest | https://www.usebruno.com/downloads | .exe | Open source — recommended |
| Insomnia | Latest | https://insomnia.rest/download | .exe | |

---

## 11. DATABASE TOOLS

| App | Edition | Official Download URL | Installer | Notes |
|---|---|---|---|---|
| DBeaver Community | Latest | https://dbeaver.io/download/ | .exe | Free. Supports all major DBs. |
| pgAdmin | Latest | https://www.pgadmin.org/download/pgadmin-4-windows/ | .exe | PostgreSQL GUI |
| MongoDB Compass | Latest | https://www.mongodb.com/try/download/compass | .exe | MongoDB GUI |
| Redis Insight | Latest | https://redis.io/insight/ | .exe | Redis GUI |
| TablePlus | Latest (free tier) | https://tableplus.com/windows | .exe | Free tier: 2 connections |

---

## 12. RUNTIMES & LANGUAGES

| App | Edition | Official Download URL | Installer | Notes |
|---|---|---|---|---|
| Node.js | LTS (latest) | https://nodejs.org/en/download/ | .msi | Use LTS, not Current |
| Python | Latest 3.x | https://www.python.org/downloads/windows/ | .exe | Check "Add to PATH" during install |
| Java JDK | Temurin LTS (Adoptium) | https://adoptium.net/temurin/releases/ | .msi | OpenJDK — free, enterprise-grade |
| Go | Latest stable | https://go.dev/dl/ | .msi | |
| Rust | Latest (via rustup) | https://rustup.rs/ → rustup-init.exe | .exe | Installs rustup + cargo |
| .NET SDK | Latest LTS | https://dotnet.microsoft.com/download | .exe | Choose SDK, not Runtime only |

---

## 13. CLOUD CLIs & DEVOPS TOOLS

| App | Edition | Official Download URL | Installer | Notes |
|---|---|---|---|---|
| AWS CLI v2 | Latest | https://aws.amazon.com/cli/ | .msi | |
| Azure CLI | Latest | https://aka.ms/installazurecliwindows | .msi | |
| kubectl | Latest stable | https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/ | .exe | Add to PATH |
| Helm | Latest | https://helm.sh/docs/intro/install/ | binary .exe | Extract and add to PATH |
| k9s | Latest | https://github.com/derailed/k9s/releases | .zip | Extract k9s.exe and add to PATH |
| Lens | Latest | https://k8slens.dev/ | .exe | Kubernetes Desktop IDE |
| Terraform | Latest | https://developer.hashicorp.com/terraform/downloads | .zip | Extract terraform.exe and add to PATH |
| Cloudflare Wrangler | Latest | via npm: `npm install -g wrangler` | — | Install after Node.js |

---

## 14. DESIGN TOOLS

| App | Edition | Official Download URL | Installer | Notes |
|---|---|---|---|---|
| Figma | Web-based | https://figma.com | — | No install needed. Browser only. |
| Adobe Creative Cloud | Latest | https://creativecloud.adobe.com/apps/download/creative-cloud | .exe | Licensed users only |
| Canva | Web-based | https://canva.com | — | No install needed. Browser only. |

---

## 15. DATA ANALYTICS (EDA)

| App | Edition | Official Download URL | Installer | Notes |
|---|---|---|---|---|
| Power BI Desktop | Latest | https://powerbi.microsoft.com/desktop/ | .msi | Free from Microsoft. Direct download or via Microsoft Store. |
| Orange | Latest | https://orangedatamining.com/download/ | .exe | Free / open source. Visual data mining. |
| KNIME Community Edition | Latest | https://www.knime.com/downloads | .exe | Free / open source. Workflow analytics. |
| RStudio Desktop | Latest | https://posit.co/download/rstudio-desktop/ | .exe | Free / open source. Requires R installation first. |
| R (base language) | Latest | https://cran.r-project.org/bin/windows/base/ | .exe | Install before RStudio |

---

## 16. IC / PCB / CIRCUIT DESIGN (EDA)

| App | Edition | Official Download URL | Installer | Notes |
|---|---|---|---|---|
| KiCad | Latest (8.x) | https://www.kicad.org/download/windows/ | .exe | Free / open source. Full schematic + PCB design suite. |
| LTspice | Latest | https://www.analog.com/en/resources/design-tools-and-calculators/ltspice-simulator.html | .exe | Free (Analog Devices). SPICE circuit simulator. |
| ngspice | Latest | https://ngspice.sourceforge.io/download.html | .zip | Free / open source. SPICE3 simulator — extract and add to PATH. |
| Xschem | Latest | https://xschem.sourceforge.io/stefan/xschem_man/xschem_install_win.html | installer | Free / open source. IC schematic capture, integrates with ngspice. |
| Icarus Verilog (iverilog) | Latest | https://bleyer.org/icarus/ | .exe | Free / open source. Verilog + SystemVerilog HDL simulator. |
| GHDL | Latest | https://github.com/ghdl/ghdl/releases | .zip | Free / open source. VHDL simulator — extract and add to PATH. |
| GTKWave | Latest | https://github.com/gtkwave/gtkwave/releases | .zip | Free / open source. Waveform viewer for .vcd / .fst simulation output. |
| Yosys | Latest (via OSS CAD Suite) | https://github.com/YosysHQ/oss-cad-suite-build/releases | .exe | Free / open source. RTL synthesis. Install via OSS CAD Suite (includes Yosys + nextpnr). |
| Intel Quartus Prime Lite | Latest | https://www.intel.com/content/www/us/en/software-kit/825278/intel-quartus-prime-lite-edition-design-software-version-23-1-1-for-windows.html | .exe | Free (Intel). FPGA synthesis + P&R for Intel/Altera FPGAs. Large install (~30GB). |

---

## 17. SECURITY TOOLS (IT / Security role only)

| App | Edition | Official Download URL | Installer | Notes |
|---|---|---|---|---|
| Wireshark | Latest | https://www.wireshark.org/download.html | .exe | Install WinPcap/Npcap driver during setup |
| Nmap | Latest (with Zenmap) | https://nmap.org/download.html | .exe | Includes Zenmap GUI |
| Burp Suite Community | Latest | https://portswigger.net/burp/communitydownload | .exe | Free community edition |

---

## 18. GHOST IMAGE TOOLS (IT use only)

| App | Edition | Official Download URL | Installer | Notes |
|---|---|---|---|---|
| Clonezilla Live | Latest stable | https://clonezilla.org/downloads.php | ISO | Boot from USB to capture/restore images |
| Ventoy | Latest | https://github.com/ventoy/Ventoy/releases | .zip | Create multi-boot USB for Clonezilla + WinPE + tools |
| Macrium Reflect (Free) | Latest | https://www.macrium.com/reflectfree.aspx | .exe | Windows-based image capture (alternative to Clonezilla) |

---

## DOWNLOAD NOTES

1. **Store all offline installers** on NAS under `/IT/Software/Approved/[Category]/[App]/[Version]/`
2. **Verify checksums** (SHA256) after download — compare against vendor's published hash
3. **Date-stamp the folder** when downloaded — e.g. `2026-06-28_NodeJS-LTS-22.x.msi`
4. **Refresh quarterly** — check for new LTS/stable releases every 3 months
5. **Do not store cracked/patched versions** — legal and security risk
