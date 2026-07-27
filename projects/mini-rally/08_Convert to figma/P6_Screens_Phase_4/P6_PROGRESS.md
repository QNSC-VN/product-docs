# Plan 6 — Live Progress

## Current item

Plan 6 confirmed by the user (`2026-07-21`). Plan 7 (QA, Dev Mode and handoff) is now unblocked — see `CONVERSION_PROGRESS.md`.

### P6.f — Validation, contracts, gate

Reuse audit (script-based, same method as P3.i/P5.g): `SCR-08` through `SCR-13` checked via `findAllWithCriteria({types:['INSTANCE']})` — 51/121/41/48/55/38 instances respectively across the six screens, 0 broken (every instance resolves to an existing `mainComponent`). `P6_SCREEN_CONTRACTS.md` written: Contracts 13 (Notifications), 14 (Roles & Permissions), 15 (Settings: Workspace/Teams/Users), 16 (Destructive Confirmation pattern), 17 (Audit Log); Q-15 and Q-16 recorded. `CONVERSION_PROGRESS.md` updated: coverage matrix now shows NotificationsPage and every SettingsPage sub-surface as Converted (Workflow Status/Labels marked Out of scope with the SRS citation), gate log row set to `Awaiting confirmation`.

### P6.e — Prototype Workspace Admin / Project Admin / Project Member paths

Per the precedent set in P3.f, RBAC is represented as a **documented behavior overlay** on existing screens/components, not as duplicated per-role screen sets (building 3x copies of every Plan 6 screen would be transcription, not design work, and the Permission State Chip/Entity Status Badge/RBAC pattern already carries the E/R/D/H semantics). Confirmed for Plan 6 specifically:

- **Notifications (`SCR-08`)**: universal — all three roles reach the same screen via the bell icon; no role-gated content within it (RBAC SRS marks all three Notification permission rows as system-locked `E` for every role).
- **Settings sidebar (`SCR-09`–`SCR-13`)**: Workspace Settings, Teams, User Management, Roles & Permissions and Audit Log are all Workspace-Admin-only per SRS. Project Admin and Project Member reach neither the sidebar items nor the screens.

**Discrepancy found between SRS wording and mockup rendering, resolved by source precedence:** `04_Developement_tracking/Phase 4/03_Settings_Audit/SRS.md` §7 states plainly "Project Admin and Project Member do not see User Management" (and equivalently for Roles & Permissions, Workspace Settings, Audit Log) — implying `H` (fully hidden). But `SettingsPage.tsx`'s actual sidebar code (`sections.items`, lines 582-589) renders these items as **visible-but-disabled** (`opacity-40`, `cursor-not-allowed`, a trailing lock icon) rather than removing them from the DOM — a `D`-style rendering, not `H`. Per Plan 0's source precedence (SRS/BA rules rank above mockup code), the SRS's `H` intent is treated as authoritative for the Figma conversion: Project Admin/Project Member App Shell instances should **omit** these sidebar items entirely rather than show them locked. This is recorded as a contract note (see P6.f) rather than resolved by building separate PA/PM sidebar variants, since the existing `Screens — Phase 4` screens were all built from the Workspace Admin perspective (matching the pattern already accepted for Manage Projects/Work Item Detail in Plan 4, where a PA/PM read-only variant remains a carried-forward item, not a blocking gap for this plan's confirmation).

### P6.d — Destructive confirmation and security-sensitive patterns

Source: `04_Developement_tracking/Phase 4/03_Settings_Audit/SRS.md` §9 (P4-SET-07).

**Gap found and fixed:** the existing `Dialog` component (`65:20`, `Type=Destructive Confirmation`, built in P2 for `ConfirmRemoveUserAccess`) unconditionally showed the typed-name confirmation field (`confirm-label` + `confirm-input`) with no way to hide it. But SRS §9 requires typed confirmation **only** for the two high-risk actions (Delete Project, Remove User Access) — every other destructive action (Archive/Restore Project, Deactivate/Restore Team) uses a plain confirm modal, exactly matching `TeamsSettingsPanel`'s separate `ConfirmDestructive` calls in `ProjectsPage.tsx` (no typed input, just Cancel + a labeled destructive button). Using the single existing variant as-is for both cases would have incorrectly forced typing onto simple archive/restore flows. Fixed by adding a `Require Typed Name` boolean property to the `Dialog` component set, bound to the visibility of `confirm-label`/`confirm-input`/their spacer — defaults to `true` (preserving the exact behavior the component already had), settable to `false` for the ordinary-risk case. Verified both states render correctly (typed field present for Delete Project style content; cleanly absent, with spacing collapsing, for Deactivate Team style content). This extends the existing component rather than duplicating it. |

No new screens were built for P6.d — the fix above, plus confirming every Plan 6 screen's destructive actions route through this one component (Teams' Deactivate/Restore, User Management's Remove Access), satisfies the exit criterion "no security claim is based on Figma/UI alone" by keeping exactly one authoritative confirmation pattern rather than several inconsistent ones.

### P6.c — Settings, users, audit (Workflow Statuses and Labels out of scope — see finding)

**Scope-narrowing finding, resolved from BA evidence before building:** `04_Developement_tracking/Phase 4/03_Settings_Audit/SRS.md` §5 and §6 explicitly defer both Workflow Status and Labels to Future Backlog for Phase 4 ("Do not add Workflow Status configuration to Workspace Settings... Do not add Label management to Workspace Settings..."). The Plan 6 checklist wording ("workflow statuses, labels") pre-dates this SRS section; resolved autonomously by not building either, consistent with the standing rule to resolve from BA/SRS evidence rather than build scope the BA has explicitly closed. `SettingsPage.tsx` still *codes* `workflow`/`labels` tab content (reachable only when `activeTab` is forced past the sidebar's `gate` check, which never exposes them via `sections`) — same "coded but not reachable via nav" category as `ReleasesPage.tsx` (Q-13), not rebuilt here either.

Source: `SettingsPage.tsx` lines 44-172 (types, `PROD_ROLE_ACTION_MATRIX` already used in P6.b, `ConfirmRemoveUserAccess`, `UserDetailModal`), 354-605 (workspace/members/audit render blocks, sidebar `sections`), `ProjectsPage.tsx` line 733 (`TeamsSettingsPanel`, confirming Teams reuses the pre-existing `ConfirmDestructive` dialog for Deactivate/Restore).

| Item | Figma page/node | Result |
|---|---|---|
| `SCR-10 Settings — Workspace Settings` | `Screens — Phase 4` / `166:825` | Company Name (editable), Workspace Slug/Company Scope (read-only), Workspace Admin (Avatar+name, display-only), Save Changes button — matches `content.workspace` exactly, WA-only per SRS §3.2. |
| `SCR-11 Settings — Teams` | `Screens — Phase 4` / `167:987` | Team Name/Project/Lead/Members/Status/Updated table, `Entity Status Badge` reused for Active/Deactive (this is the exact surface the badge's Invited/Deactive variants were built for per `MACHINE_HANDOFF.md`'s P4 notes). |
| `SCR-12 Settings — User Management` | `Screens — Phase 4` / `168:1191` | Search + role filter toolbar, Name/Email/Phone/Role/Status/Last Login table, `Role Badge` + `Entity Status Badge` (Active/Invited/Deactive) reused. |
| `SCR-13 Settings — Audit Log` | `Screens — Phase 4` / `169:1422` | Search-by-actor + search-by-time toolbar, Time/Actor/Detail 3-column table (explicitly no Action/Entity columns per SRS §8), 5 example rows spanning every included event type (role change, matrix save, project archive, team create, user invite). |

**Reuse-vs-new note:** did not rebuild `User Details` modal, `Remove User Access` typed-confirmation modal, or Teams' `ConfirmDestructive` (Deactivate/Restore) — all three are compositions of the existing `Dialog` component (`63:60`, `Type=Standard` and `Type=Destructive Confirmation`) already built in P2 specifically anticipating these exact flows (see `P2_COMPONENT_CATALOG.md`'s Dialog row, which names `ConfirmRemoveUserAccess` directly). Building new modal instances here would duplicate, not extend, the component library — covered instead in P6.d as a validation/reuse-confirmation pass rather than new construction.

### P6.b — Roles matrix and project/team scope UI

Source: `04_Developement_tracking/Phase 4/02_Roles_Permissions/SRS.md` (re-read for this plan; originally used in P3.f), `03_Mockup Design/src/app/pages/SettingsPage.tsx` (`PROD_ROLE_ACTION_MATRIX`, `STATE_STYLE`, lines 44-160 and the render block at 470-539).

| Item | Figma page/node | Result |
|---|---|---|
| `color/permission/{enabled,readonly,disabled,hidden}/{bg,text,border}` | Color collection | 12 new tokens, exact hex match to `STATE_STYLE`. |
| Permission State Chip | `Screens — Phase 0–1` / `162:6122` | 4 variants (Enabled/Read-only/Disabled/Hidden) + `Locked` boolean property (shows `Icon/LockKeyhole`, reused rather than building a new lock icon). |
| Settings sidebar (reusable frame, not componentized) | Built inline on `SCR-09` | Personal / Workspace section groups matching `sections` in `SettingsPage.tsx` line 279-282; active item = Roles & Permissions. |
| `SCR-09 Settings — Roles & Permissions` | `Screens — Phase 4` / `163:397` | Sidebar + content panel. Header: Shield icon, "Role Action Matrix" title, E/R/D/H legend (4 chip instances), `Edit` button (Secondary, Edit3 icon). Table: Screen/Action/Permission/WA/PA/PM columns, 12 representative rows spanning: 3 system-locked rows (Auth/App Shell/Notifications, all `E`+lock), delivery rows showing full PA vs PM variance (Backlog create=E/E/E, Backlog release-assign=E/E/H, Iterations create=E/E/H, Team Status capacity=E/E/H), the one row in the entire 75-row source matrix that uses `R` (Settings > Teams view=E/R/H), and 4 governance rows defaulting WA-only (Delete Project, Edit user role, Edit role matrix, View audit log — all E/H/H). |

**Scope note:** the full mockup matrix has ~75 rows across every module built so far; building all of them in Figma would be transcription, not design work, since every row uses the same `Permission State Chip` instance with no new visual pattern. 12 rows were chosen to demonstrate every distinct visual case (locked-system, WA-only-governance, PA-editable/PM-hidden delivery, and the sole `R` example) — this matches the sampling approach used for every other Data Table screen in Plans 4-5 (5-6 example rows demonstrating the pattern, not exhaustive mock data). Flagged as **not exhaustive** in the P6 contract so a reviewer knows to check the mockup source directly for any specific row not shown here.

**Project/team scope UI:** SRS §3.2's behavior (Project Admin sees all projects — read-only outside assigned managed projects; Project Member sees only the assigned project; "All Teams" hidden from Project Member) is a *state variation of the existing App Shell Project/Team context selector* (built in P3.a), not a new screen or component. No new Figma UI was built for this — it's documented as a contract/annotation in `P6_SCREEN_CONTRACTS.md` (P6.f) describing which selector options are visible per role, consistent with treating RBAC as a behavior overlay on existing components rather than a parallel set of role-specific screens.

## Completed native Figma work

### P6.a — Notifications

Source: `03_Mockup Design/src/app/pages/NotificationsPage.tsx`, `04_Developement_tracking/Phase 4/01_Notifications/SRS.md`.

| Item | Figma page/node | Result |
|---|---|---|
| `color/notification/{assigned,mention}/{bg,icon}` | Color collection | 4 new tokens, exact hex match to `NotificationsPage.tsx`'s `bgMap`/`iconMap` (`#f5f3ff`/`#6d28d9` assigned, `#fef5e4`/`#e59f0c` mention). |
| `Icon/Flag`, `Icon/Hash` | `Icons` page `156:7` / `156:2` | New 24x24 stroke icons (simplified geometry matching lucide's Flag/Hash silhouette, same construction pattern as `AlertTriangle`). |
| Notification Card | `Screens — Phase 0–1` / `157:1664` | 4 variants (`State`=Read/Unread × `Type`=Assigned/Mention). Title/Body/Project/Time/Initials are freely-overridable shared properties (correct use of the shared-property pattern — content genuinely varies per instance regardless of variant, same category as Alert/Toast Title-Description). Unread state: `color/status/info` 3px left accent border + `color/bg/subtle` fill + orange dot next to title, matching the mockup's `border-left: 3px solid #2558a6` / `#f7f9fd` bg / `#f97316` dot exactly. |
| `SCR-08 Notifications` | `Screens — Phase 4` / `158:23` (grouped with the popup overlay as `160:423`) | Header (title, unread count, "Mark all as read"), 4-tab filter row (All/Unread/Assigned/Mentions, All active by default), centered list (`max-w-2xl` → 640px) with 3 `Notification Card` instances (2 unread: one Assigned one Mention; 1 read), plus the floating `notification-popup` overlay positioned top-right (`fixed right-4 top-14` in the mockup) showing the newest unread Mention notification, exactly matching `NotificationsPage.tsx`'s `popup` logic (`notifs.find(n => !n.read && n.type === "mention") ?? notifs.find(n => !n.read)`). |

**Reuse-vs-new note:** the popup could not be a child of the App Shell instance (instances only accept children into their declared Slots), so it was built as a page-level sibling frame positioned to overlap the screen's top-right corner, then grouped with the screen for a single reviewable unit — this mirrors how a `position: fixed` overlay actually behaves in the running app (independent of the scrollable content beneath it).

**Scoped out of this pass:** the empty-filter state (`System State Type=Empty`, already built in P3) was not placed on this screen instance since the default `All` filter always has 3 example rows — flag if a reviewer wants an explicit empty-state variant of this screen for the `Unread`-with-zero-results case.

## Next autonomous action

Continue `P6.b`: Roles matrix and project/team scope UI (editable/read-only/denied states). Source: `04_Developement_tracking/Phase 4/02_Roles_Permissions/SRS.md` (already read in P3.f), `03_Mockup Design/src/app/pages/SettingsPage.tsx` (permissions matrix tab), `model.ts`'s `PERMISSIONS_MATRIX`.
