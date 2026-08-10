# Plan 4 — Live Progress

## Current item

**Plan 4 is complete.** All of P4.a–P4.g are done: 5 screens built and QA-passed against the running mockup, plus `P4_SCREEN_ANNOTATIONS.md` and `P4_SCREEN_CONTRACTS.md`. Status is `AWAITING PLAN 4 CONFIRMATION` — per `AI_EXECUTION_WORKFLOW.md`, do not start Plan 5 until the user sends `CONFIRM PLAN 4` or an equally unambiguous approval.

## Runtime comparison setup

The mockup dev server is running via `.claude/launch.json` (`preview_start` name `mockup`, port 5173) and every P4 screen is measured against it at 1440×900 rather than eyeballed. `launch.json` was broken on Windows — `runtimeExecutable: "npm"` resolved to `C:\Program Files\nodejs\npm.ps1` and the unquoted space made the runner fail with `'C:\Program' is not recognized`. Fixed by invoking through `cmd /c npm …`, since `cmd` lives at a space-free path.

## Completed native Figma work

### P4.a — Login and access states

| Item | Figma page/node | Result |
|---|---|---|
| Login icons | `Icons` / `11:2` | Mail `102:5`, LockKeyhole `102:10`, Eye `102:14`, ShieldCheck `102:18`. |
| Phase 0–1 documentation | `Screens — Phase 0–1` / frame `104:2296` | Records the 14px-root measurement caveat. |
| Login brand panel | `104:2301` | 648×900 navy column: logo lockup, workspace badge, 38px headline, lede, three feature items, copyright. |
| Login form card | `105:10` | 430px card: header with eyebrow/title/shield mark, email and password fields, remember-me Checkbox, full-width Primary Button, demo-account footer. |
| `SCR-00 Login — Default` | `106:31` | Full 1440×900 screen at the runtime's measured 648/792 column split. |
| `SCR-00 Login — Invalid credentials` | `109:31` | Same screen with an inline `Alert Type=Error` above the email field. |
| `SCR-11 Access Denied` | `109:140` | App Shell instance with `System State Type=Forbidden` in the Content slot. |
| `SCR-11 Not Found` | `109:481` | App Shell instance with `System State Type=Not Found`. |

## Component amendment made during P4.a

**`Search Field` was generalised into `Input with Icon`** (`84:390`) with an added `Icon` instance-swap property. The Login email and password fields need a leading-icon input, which is structurally the same control; renaming and parameterising it avoided shipping a near-duplicate component. This amends a Plan 3 artifact during Plan 4 — recorded here because the plan gate for P3 had already closed. Its only prior consumer was the List Toolbar, which is unaffected.

## Corrections found by runtime comparison

1. **Button radius mismatch — corrected on user decision.** The Figma `Button` was bound to `radius/full`, rendering as a pill, while the mockup uses Tailwind `rounded` which computes to **3.5px** for every button including the Login submit and Backlog's Create Work Item. Confirmed in the running app, not inferred. Under the Plan 0 source-precedence rule the mockup governs visual language during conversion, but the pill had been approved at the Plan 2 gate and could have been a deliberate upgrade, so it was raised rather than changed unilaterally. The user chose to match the mockup. `Button` (27 variants) and `Icon Button` (27 variants) were rebound from `radius/full` and `radius/md` to `radius/sm`; because radius is variable-bound, every downstream instance updated automatically with no per-screen rework.

2. **The mockup renders at a 14px html root font-size, not 16px.** Every Tailwind `rem` utility therefore resolves to **87.5%** of its nominal value: `px-4` is 14px not 16px, `py-2.5` is 8.75px not 10px, `rounded` is 3.5px not 4px, `gap-2` is 7px not 8px. Values written as explicit inline `style={{ }}` pixels or as arbitrary Tailwind values (`text-[11px]`) are unaffected.

   Consequence: any spacing or radius that Plans 2–3 derived from a Tailwind class is roughly 14% larger in Figma than in the running mockup. This was **not** corrected, for three reasons: the approved P1 spacing scale is a deliberate 16px-based system; the 14px root looks like an artifact of the mockup's CSS rather than a design decision; and rescaling the whole library to off-scale values (7, 10.5, 14…) would damage it. Screens use the measured runtime pixels for structural dimensions — panel widths, card widths, input heights — and the nearest approved token for padding, which lands within about a pixel. Flagged so nobody reads a Figma/runtime spacing delta as a conversion error.

3. **Inter genuinely loads in the runtime** (`document.fonts.check('16px Inter')` returns true and the computed family resolves to Inter). Decision D-004 holds; no font substitution risk.

## Measured reference values (Login, 1440×900)

| Element | Runtime |
|---|---|
| Grid columns | `648px 792px` |
| Card | 430 × 457, radius 1.5px, border 0.8px `#d9dee7` |
| h1 | 38px / 47.5 line height / −0.95px letter spacing |
| h2 | 21px / 31.5 / −0.525px |
| Email input | 379 × 37, padding `8.75 10.5 8.75 31.5`, radius 3.5px |
| Submit button | 379 × 36, radius 3.5px, `#1d3f73` |

### P4.b — Home dashboard

| Item | Figma page/node | Result |
|---|---|---|
| Home icons | `Icons` / `11:2` | MessageSquare `110:4`, Flag `110:8`, Paperclip `110:11`, Zap `110:14`, Archive `110:19`. |
| Metric Card | `Screens — Phase 0–1` / `110:553` | 3 variants: `Emphasis` (Default/Primary/Danger), matching the mockup's per-metric colour logic (dark/navy/red). `Label`, `Value` text properties. |
| `SCR-01 Home — Workspace Admin` | `111:526` | Full screen: page title + greeting, 6-metric summary strip (dividers between cells), My Work card (2/3 width), Recent Activity card (1/3 width), full-width Project Health card. |

My Work, Recent Activity and Project Health are built as screen-local frames composed from existing atoms (Type/Status/Priority Badge, Avatar, Progress instances), not as new named patterns — they are simpler than `Data Table` (no select/sort/resize/bulk) and the mockup itself does not reuse `ResizableBacklogHeader` here either. Building a lightweight bespoke table matches the mockup's own approach; a generic pattern was not warranted for a single "top 6 items" widget.

Project Health's progress bars reuse the P2 `Progress` component with its `Value/Max` text property overridden to a plain percentage string, and the fill bar's width resized per-instance to the actual percentage — the same "resize the fill proportionally" usage documented for `Progress` in P2's catalog.

Home's TopNav/Context Bar were corrected for the Home context: `nav-home` swapped to `State=Active` and `nav-plan` back to `State=Default` (component instances can't have children removed, only hidden — `remove()` on an instance child throws); breadcrumb reduced to `ACME Space Inc. > Home` (Middle crumb hidden, not removed); the right-hand context group shows a single `Company:` selector instead of Project/Team, matching `ContextBar`'s own routing logic for `home`/`projects` pages.

### P4.c — Manage Projects

**Scope finding:** `ProjectsPage.tsx`'s own `Tabs` component renders a single "Projects" tab — `TeamsTab`/`UsersTab` exist as functions but are not reachable from this screen. `TeamsTab` is actually mounted via the separate `TeamsSettingsPanel` export, consistent with the Phase 4 RBAC SRS navigation table (`Top-right gear / Teams` and `Top-right gear / User Management` are their own Workspace Settings surfaces, not Manage Projects tabs). So P4.c converts **Manage Projects** only; Teams and User Management belong under Settings, which is Phase 4 scope (Plan 6), not Phase 0–1.

| Item | Figma page/node | Result |
|---|---|---|
| Edit3 icon | `Icons` / `11:2` | `Icon/Edit3` `119:1089`. |
| Entity Status Badge | `Screens — Phase 0–1` / `116:938` | 4 variants: `Status` (Active/Invited/Deactive/Archived). New tokens `color/lifecycle/{active,invited,deactive}/{bg,border}` — a distinct domain from the work-item `Status Badge` per D-005, since this covers project/team/user lifecycle, not Schedule/Flow State. |
| `SCR-01A Manage Projects` | `117:920` | Full screen: header with single active "Projects" tab pill + Create Project button, 4-metric strip, toolbar (Search Field + segmented status filter), and a projects table (key, name/description, Entity Status Badge, Avatar+owner, team chips, members, dates, row actions) with 4 example rows including one Archived row showing the Restore action. |

Row actions reuse `Icon Button` `Style=Ghost` instances (Edit/Archive) or a text "Restore" link for archived rows, matching `RowActions`'s exact conditional behaviour in the mockup.

### P4.d — Work Item Detail (full page)

**Scope note:** this is the full-page detail (`WorkItemDetailPage.tsx`), distinct from the P3 pilot's docked `Drawer`. It replaces the App Shell entirely with its own header — the mockup never nests this page inside TopNav/Context Bar. Create is already covered by the P3 pilot's `Dialog` `Type=Standard`; Edit happens in-place via this page's field aside (there is no separate edit modal in the mockup). `AddTaskModal` was not separately built — it is structurally identical to the already-demonstrated Dialog+Form Field composition with fewer fields, so building it again would be a redundant example rather than new coverage.

| Item | Figma page/node | Result |
|---|---|---|
| Detail-page icons | `Icons` / `11:2` | Minimize2 `120:7`, FileText `120:14`, ListChecks `120:21`, History `120:26`, Bold `120:29`, Italic `120:34`, Underline `120:38`, List `120:46`, Link2 `120:51`, ImagePlus `120:58`. |
| Work Item Detail Header | `Screens — Phase 0–1` / `122:1197` | Dark title bar (back, Type Badge, id, title, minimize, more) + 3-tab strip (Details/Tasks/Revision History, Tasks carries a live count). Two literal colours — `#173f78` bar, `#2f6fc5` active tab — documented as exceptions distinct from `color/nav/surface`, since the mockup itself uses different navy tones for this page vs. the App Shell. |
| Rich Text Field | `Screens — Phase 0–1` / `124:1218` | Header + condensed toolbar (Bold/Italic/Underline/List/Link/Image — 6 of the mockup's 13 icons, representative rather than exhaustive) + content area. `Title`, `Content` text properties. |
| `SCR-03 Work Item Detail — Details` | `127:1244` | Header + main column (Description/Attachments/Notes Rich Text Fields) + 340px field aside with 10 Form Field instances (Owner/Project/Team/Schedule State/Flow State/Priority/Plan Estimate/Release/Milestones/Iteration). |
| `SCR-03 Work Item Detail — Tasks` | `129:1516` | Header (Tasks tab active) + task table: checkbox selection, rank/id/name, task state via the existing `Status Badge` `Defined`/`In-Progress`/`Completed` variants (colours match exactly — no new component needed), Avatar+owner, project/teams, To Do/Actuals/Estimate columns, and a Totals row. |
| `SCR-03 Work Item Detail — Revision History` | `128:1431` | Header (Revision History tab active) + a table of `Activity Row` instances (reused verbatim from P3.d) — the mockup's `ActivityLogView` uses exactly the timestamp/actor/action/target+detail grid that pattern already covers. |

### P4.f — Runtime comparison

Compared against the live mockup (`preview_start` name `mockup`, port 5173) by logging in as the demo Workspace Admin and driving Home, Backlog/Iteration Status and Track, using `read_page`/`javascript_tool` for exact computed-style measurements rather than eyeballing screenshots.

**Confirmed correct:**
- Home's structure (6-metric strip, My Work / Recent Activity / Project Health) matches the live screen exactly, including column order.
- My Work's `Priority` column uses the standard `Priority Badge` colours (`#fff7ed` / `#c2610c` for High) — confirms P4.b's badge usage was right.
- Progress track colour (`#e4e8ed`) matches `color/border/default`, confirming the P2 `Progress` component's track binding.

**New finding — a real, narrow domain-mapping gap (P0 G-004 in action):**

Backlog's Defect rows have their own priority control, **distinct from the general `Priority Badge`** (Critical/High/Medium/Low) used everywhere else. When a Defect row is editable, its Priority cell renders a `<select>` with options `Low / Normal / High / Urgent / None` (`BACKLOG_PRIORITY_OPTIONS` in the mockup), styled `color: #9a3412` / `border: #f5d899` — colours that don't match any existing token. This is scoped **only** to Backlog's inline Defect-priority cell; Home, and every other Priority Badge usage checked, use the standard Critical/High/Medium/Low badge correctly.

This was not built in the P3 pilot (which rendered Defect priority with the standard `Priority Badge`, e.g. `DE-1180` shown as "High"). Per P0 finding G-004 ("status semantics overlap but do not share one domain model — use domain-specific wrappers and a documented enum adapter") and decision D-005, this is exactly the kind of conflict that policy anticipated. **Not fixed here**: the P3 pilot is already gated/confirmed, and choosing whether to (a) add a distinct "Defect Priority Select" component, (b) treat `Low/Normal/High/Urgent/None` as display labels over the same underlying Critical/High/Medium/Low values (matching how `Status Badge` already maps `Completed`→"Done"), or (c) treat it as a mockup inconsistency to raise with BA, is a genuine content/business decision, not a visual correction — flagged for the Backlog screen when Plan 5 builds it for real, and noted as an open item in `P4_SCREEN_ANNOTATIONS.md`'s cross-screen findings.

No other visual/layout/font mismatches were found beyond the two already corrected in P4.a (Button radius, 14px root font-size scaling).

## Next autonomous action

Continue `P4.g`: update the screen coverage matrix in `CONVERSION_PROGRESS.md`, record known gaps, and set the Plan 4 gate.

Do not request a plan confirmation until all P4 checklist items are review-ready.
