# WINDOWS GHOST IMAGE — Creation & Deployment Guide
**Prepared by:** Nghia-VanTrong | Date: 2026-06-28  
**Purpose:** Build a Windows 11 Pro reference image pre-loaded with all approved software, deploy to new laptops in 30-45 minutes instead of 4-6 hours of manual setup.

---

## OVERVIEW

```
[Reference PC] → Sysprep → [Clonezilla USB] → Capture image → [NAS storage]
                                                                      ↓
                                              [New laptop] ← Restore image ← [Clonezilla USB]
```

**Tools needed:**
- Clonezilla Live USB (bootable) — https://clonezilla.org/downloads.php
- Ventoy USB (to hold multiple ISOs) — https://github.com/ventoy/Ventoy/releases
- NAS or external drive (≥500GB) for image storage
- All offline installers from `MASTER_DOWNLOAD_LIST.md`

---

## PHASE 1 — BUILD THE REFERENCE MACHINE

> Use a dedicated PC or VM (not someone's daily laptop) as the reference image machine.

### Step 1: Fresh Windows 11 Pro install
- [ ] Boot from Windows 11 Pro ISO (USB)
- [ ] During OOBE: create a **local admin account** named `ITAdmin` (do NOT connect to Microsoft account yet)
- [ ] Skip all optional steps (Cortana, telemetry, etc.)
- [ ] Complete first boot to desktop

### Step 2: Windows baseline
- [ ] Run Windows Update — install ALL updates until none remain (may need 2-3 reboots)
- [ ] Enable BitLocker (if capturing with BitLocker: suspend it before imaging, re-enable after)
- [ ] Set timezone: Asia/Ho_Chi_Minh
- [ ] Set display language: English (or Vietnamese if standard)
- [ ] Set power settings: Never sleep (so imaging doesn't interrupt)

### Step 3: Install all approved software
Install from the offline installers stored on NAS (`MASTER_DOWNLOAD_LIST.md`). Follow this order:

**Group A — Core (install first):**
- [ ] Microsoft 365 Apps (via M365 admin portal offline installer)
- [ ] Cloudflare WARP
- [ ] Bitwarden
- [ ] Google Chrome (enterprise MSI)
- [ ] Mozilla Firefox ESR (MSI)
- [ ] 7-Zip
- [ ] Notepad++
- [ ] Adobe Acrobat Reader
- [ ] VLC Media Player

**Group B — Utilities:**
- [ ] Greenshot
- [ ] ShareX
- [ ] OBS Studio
- [ ] Obsidian
- [ ] Joplin
- [ ] Zoom
- [ ] Slack

**Group C — Development (install only if making a Dev image):**
- [ ] Git
- [ ] Visual Studio Code (System Installer)
- [ ] JetBrains Toolbox (then install IDEs from it)
- [ ] GitHub Desktop + GitHub CLI
- [ ] Docker Desktop (requires WSL2 — install WSL2 first)
- [ ] Windows Terminal
- [ ] Node.js LTS
- [ ] Python (latest 3.x)
- [ ] AWS CLI + Azure CLI
- [ ] Postman / Bruno
- [ ] DBeaver Community
- [ ] Cursor or Windsurf

**Group D — Runtimes & CLIs (for dev image):**
- [ ] Java JDK (Adoptium Temurin LTS)
- [ ] Go
- [ ] Rust (rustup-init.exe)
- [ ] .NET SDK
- [ ] kubectl, Helm, Terraform (extract to C:\Tools and add to PATH)

### Step 4: Configure baseline settings
- [ ] Set default browser to Microsoft Edge (for first-run) OR Chrome (per policy)
- [ ] Set Greenshot as default screenshot tool (Win+Print Screen)
- [ ] Pin approved apps to taskbar
- [ ] Set company wallpaper (optional)
- [ ] Disable Cortana search telemetry in Settings
- [ ] Turn off consumer Microsoft account suggestions
- [ ] Configure Windows Update: defer feature updates 30 days, install security updates immediately

### Step 5: Verify everything works
- [ ] Open each installed app — confirm it launches cleanly
- [ ] Confirm no trial/expired license popups
- [ ] Run Windows Defender quick scan — confirm clean
- [ ] Check disk usage — target < 80GB for base image (easier to store + transfer)

---

## PHASE 2 — SYSPREP (GENERALIZE THE IMAGE)

> Sysprep removes the computer-specific info (SID, hostname, drivers) so the image can be deployed to any machine. **Do this LAST — the machine will shut down.**

### Step 6: Pre-Sysprep cleanup
- [ ] Delete all browser history, cached files, temp files
- [ ] Run Disk Cleanup (including system files)
- [ ] Delete C:\Users\ITAdmin\Downloads\* (remove all installers downloaded during setup)
- [ ] Empty Recycle Bin
- [ ] Defragment if HDD (skip for SSD)

### Step 7: Run Sysprep
Open **Command Prompt as Administrator**:
```
C:\Windows\System32\Sysprep\sysprep.exe /generalize /oobe /shutdown
```
- `/generalize` — removes machine-specific data (SID, activation, etc.)
- `/oobe` — sets Windows to run first-time setup on next boot
- `/shutdown` — shuts down after Sysprep completes

> ⚠️ Do NOT boot the machine again after Sysprep — image it immediately.

---

## PHASE 3 — CAPTURE THE IMAGE

### Step 8: Boot from Clonezilla USB
- [ ] Insert Clonezilla bootable USB into the reference machine
- [ ] Connect the external drive / NAS where image will be stored
- [ ] Boot from USB (change BIOS/UEFI boot order or press F12)
- [ ] Select: **Clonezilla Live (VGA 800x600)**

### Step 9: Capture with Clonezilla
In Clonezilla menu:
1. Select **device-image** mode
2. Choose where to save image: **local_dev** (external USB) or **samba_server** (NAS over network)
3. Select **savedisk** — save entire disk as image
4. Name the image: `WIN11PRO_BASE_YYYYMMDD` or `WIN11PRO_DEV_YYYYMMDD`
5. Select the source disk (usually `/dev/sda` or `/dev/nvme0n1`)
6. Compression: **z9p** (best compression, slower) or **z1p** (fast, larger file)
7. Confirm — Clonezilla captures the image
8. When done: **Power off**

> Typical image size: 30-60GB compressed (base) / 60-100GB (dev image)

### Step 10: Store and label the image
```
NAS/
└── IT/
    └── GhostImages/
        ├── WIN11PRO_BASE_20260628/          ← Base (non-dev) image
        ├── WIN11PRO_DEV_20260628/           ← Dev image with all dev tools
        └── WIN11PRO_BASE_20260628.sha256    ← Checksum file
```
- [ ] Run `sha256sum` on the image folder and save to a `.sha256` file
- [ ] Document what software version was installed in a `README.txt` inside the image folder

---

## PHASE 4 — DEPLOY TO NEW LAPTOP

### Step 11: Prepare new laptop
- [ ] Confirm BIOS/UEFI is set to UEFI mode (not Legacy)
- [ ] Confirm Secure Boot is ON
- [ ] Confirm TPM 2.0 is enabled (required for BitLocker)
- [ ] Disable BitLocker or Fast Boot if enabled on source

### Step 12: Restore image with Clonezilla
- [ ] Boot new laptop from Clonezilla USB
- [ ] Select **device-image** mode
- [ ] Select image source: external drive or NAS
- [ ] Select **restoredisk** — restore image to disk
- [ ] Select the correct image: `WIN11PRO_BASE_YYYYMMDD`
- [ ] Select the target disk (the new laptop's internal drive)
- [ ] Confirm — Clonezilla restores the image
- [ ] When done: **Reboot** (remove USB)

### Step 13: First-boot (OOBE) on new laptop
Windows runs through Out-of-Box Experience:
- [ ] Choose region: Vietnam
- [ ] Skip / choose keyboard layout
- [ ] **Do NOT sign in with a personal Microsoft account**
- [ ] Join Entra ID: "Set up for work or school" → enter company email
- [ ] Complete Entra join — laptop is now managed

### Step 14: Post-image IT setup per laptop
After image restore, per-laptop tasks:
- [ ] Rename computer: `QNSC-[NAME]-[DEPT]` (e.g. `QNSC-NGHIA-DEV`)
- [ ] Enable BitLocker — back up recovery key to Entra (automatic if Entra-joined)
- [ ] Install Microsoft Intune Remote Help (deploy from Intune portal)
- [ ] Confirm Cloudflare WARP connected and policies applied
- [ ] Assign Bitwarden company vault to user
- [ ] Confirm Windows Defender is active and updated
- [ ] Run Windows Update on the new machine

---

## IMAGE MAINTENANCE

| When | Action |
|---|---|
| Every 3 months | Rebuild reference machine, apply all updates, re-capture new image |
| When major software version changes (e.g. new Node.js LTS) | Rebuild dev image |
| When new approved software is added to whitelist | Add to reference machine, re-capture |
| Before major new hire batch | Verify image still deploys cleanly on test laptop |

---

## TWO RECOMMENDED IMAGES TO MAINTAIN

| Image name | Who it's for | Includes dev tools? |
|---|---|---|
| `WIN11PRO_BASE` | HR, Admin, Accounting, non-dev staff | No |
| `WIN11PRO_DEV` | Developers, DevOps, QA | Yes — full dev toolchain |

> **Tip:** Keep base image small (~40GB compressed). Dev image will be ~70-90GB compressed. Both save 4-6 hours of manual setup per new hire.
