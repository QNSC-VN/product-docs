# Plan 3 — Live Progress

## Current item

**Plan 3 is complete.** All of P3.a–P3.i are done and validated. `P3_UI_API_CONTRACTS.md`, `P3_RBAC_AND_SYSTEM_STATES.md` and `P3_PILOT_VALIDATION.md` are written. Status is `AWAITING PLAN 3 CONFIRMATION` — per `AI_EXECUTION_WORKFLOW.md`, do not start Plan 4 until the user sends `CONFIRM PLAN 3` or an equally unambiguous approval.

Items were built in the order a → b → c → **e** → d → f → g → h → i. System states were pulled ahead of the detail patterns because every other pattern has to express them.

## Completed native Figma work

### P3.a — App Shell

| Item | Figma page/node | Result |
|---|---|---|
| Nav icon set | `Icons` / `11:2` | 11 new icons built from real lucide SVG via `createNodeFromSvg`: Home `70:5`, Calendar `70:11`, Activity `70:14`, CheckCircle `70:18`, Package `70:24`, BarChart2 `70:29`, Search `70:33`, Bell `70:37`, HelpCircle `70:42`, Settings `70:46`, Layers `73:6`. All strokes bound to `color/icon/default`, SCALE constraints, placeholder fill `visible:false`. |
| App Shell documentation | `App Shell` / frame `71:8` | Documents the shell composition, the translucent-overlay exception and the 10px→8px padding normalisation. |
| TopNav Item | `App Shell` / `71:157` | 3 variants: `State` (Default/Hover/Active). `Icon` instance-swap, `Label` text, `Has Menu` boolean. Component set frame is filled with `color/nav/surface` so the translucent overlays are readable in QA. |
| Context Select | `App Shell` / `72:21` | 2 variants: `State` (Default/Hover). `Label` and `Value` text properties. Hover uses the new `color/bg/accent-subtle`. |
| Breadcrumb Item | `App Shell` / `72:34` | 3 variants: `Level` (Root/Middle/Current). `Label` text property; separator chevron baked per level (see corrections). |
| TopNav | `App Shell` / `75:397` | 3 variants: `Role` (Workspace Admin/Project Admin/Project Member). 1440×40 on `color/nav/surface`. Composes TopNav Item instances plus global search, notification bell with unread dot, help, settings gear, and the user block with an Avatar instance. |
| Context Bar | `App Shell` / `75:398` | 1440×32 on `color/bg/surface`. Breadcrumb Item instances on the left; a border-separated group of Context Select instances on the right. |
| App Shell | `App Shell` / `75:425` | 1440×900. TopNav instance + Context Bar instance + a real `Content` Slot on `color/bg/canvas`. This is the single frame every Plan 4–6 screen composes into. |

### P3.b — Data Table

| Item | Figma page/node | Result |
|---|---|---|
| Table icons | `Icons` / `11:2` | ArrowUpDown `77:10`, ArrowUp `77:14`, ArrowDown `77:18`, ChevronLeft `77:21`, ChevronUp `77:24`. |
| Data Table documentation | `Data Table` / frame `78:277` | Documents that this is one shared pattern behind Backlog, Quality and Iteration Status — columns differ, chrome does not. |
| Table Header Cell | `Data Table` / `78:302` | 3 variants: `Sort` (None/Ascending/Descending). `Label` text property, resize handle. Alignment is set by overriding the label's text alignment on the instance rather than adding Align variants. |
| Table Row | `Data Table` / `79:455` | 4 variants: `State` (Default/Hover/Selected/Active). Selection Checkbox instance, hover-only reorder arrows, and a `Cells` Slot. Selected uses `color/bg/accent-faint`; Active (open in drawer) uses `color/bg/accent-subtle`. |
| Bulk Action Bar | `Data Table` / `80:18` | Selection count, six reusable Button Secondary Small instances, and a Ghost Icon Button to clear selection. `Count` text property. |
| Table Pagination | `Data Table` / `80:51` | Rows-per-page Select instance, record range, page indicator, prev/next Ghost Icon Buttons. |
| Data Table | `Data Table` / `82:42` | 1200px composed pattern: Bulk Action Bar instance (toggled by a `Show Bulk Bar` boolean), sticky header row of Header Cell instances with select-all Checkbox, a `Rows` Slot, and the Pagination instance. |
| Populated example | `Data Table` / `83:148` | An instance with three real rows demonstrating Default/Selected/Active, composed entirely from existing components: Type Badge, Priority Badge, Status Badge, Avatar and Checkbox instances. This is the concrete evidence for the P3 exit criterion that tables are a reusable pattern rather than a copied screen fragment. |

### P3.c — Query controls

| Item | Figma page/node | Result |
|---|---|---|
| Query icons | `Icons` / `11:2` | Filter `84:4`, Bookmark `84:7`. |
| Query Controls documentation | `Query Controls` / frame `84:370` | States that search/filter/saved-view/pagination are one query model shared by every list screen, not per-screen filter UI. |
| Search Field | `Query Controls` / `84:390` | 3 variants: `State` (Default/Focused/Filled). Leading search icon, `Value` text property. Built as its own component rather than extending Text Input, because the mockup styles search distinctly (subtle fill, leading icon) and Text Input's 10 variants are already approved. |
| Filter Chip | `Query Controls` / `85:8` | Column `Label` + `Value` text properties and a Ghost Icon Button remove action. |
| Filter Bar | `Query Controls` / `85:16` | Manage filters (Button Primary) + Clear filters (Button Secondary) over a wrapping row of Filter Chip instances. |
| List Toolbar | `Query Controls` / `86:33` | Page `Title`/`Subtitle`, Create action, Search Field instance, filter toggle with active count, and the Saved Views trigger. |
| Saved Views menu | reuses `Dropdown Menu` `67:21` | No new component — the P2 Dropdown with Menu Item instances already covers My Views / Shared Views / Save current view / Reset view. |

Colour normalisations in P3.c (no new tokens): filter panel `#f5f8fc`→`color/bg/accent-faint`, its border `#cfdced`→`color/border/accent`, Manage-filters `#4b74d9`→`color/status/info` via Button Primary, dashed empty-state border `#cfd6e3`→`color/border/subtle`.

### P3.e — System states

Built before `P3.d` deliberately: every other pattern (table, drawer, detail) has to express these states, so they are a prerequisite rather than a follow-on.

| Item | Figma page/node | Result |
|---|---|---|
| State icons | `Icons` / `11:2` | ShieldX `87:6`, FileQuestion `87:12`, ArrowLeft `87:16`, RefreshCw `87:22`. |
| System States documentation | `System States` / frame `88:46` | Records the RBAC §3.4 safety rule that Access Denied and Not Found must not reveal the restricted record's title, owner, project or team. |
| System State | `System States` / `88:107` | 4 variants: `Type` (Empty/Error/Forbidden/Not Found). Icon tile + title + description + a recovery action built from a Button Secondary instance (Clear filters / Retry / Back to Backlog). |
| Skeleton Row | `System States` / `89:31` | Placeholder bars matching the Data Table column rhythm; bars bind to the `neutral/200` primitive because they are a neutral placeholder grey, not a border. |
| Table Skeleton | `System States` / `89:44` | Composed header + five Skeleton Row instances — the loading state for any list screen. |

Destructive confirmation was already delivered in P2.d as `Dialog` `Type=Destructive Confirmation`, so it is not rebuilt here.

### P3.d — Detail patterns

| Item | Figma page/node | Result |
|---|---|---|
| Detail Patterns documentation | `Detail Patterns` / frame `90:91` | Explains that these compose into the P2 Drawer's Content slot rather than being rebuilt per screen. |
| Detail Field | `Detail Patterns` / `90:96` | Uppercase `Label` text property over a `Value` Slot, so the value can be a Status/Priority Badge, an Avatar, a Progress instance, tags or plain text. |
| Tag | `Detail Patterns` / `90:100` | Small neutral pill with a `Label` text property. |
| Activity Row | `Detail Patterns` / `90:102` | Revision-history row with `Timestamp`, `Actor`, `Action`, `Target` and `Detail` text properties plus an Avatar instance, matching the ActivityLogView column grid. |
| Work Item Drawer example | `Detail Patterns` / `91:3` | A Drawer instance whose Content slot holds five Detail Field instances carrying Status Badge, Priority Badge, Avatar, Progress and Tag values — proving the drawer composes from existing components. |

Progress was already delivered as a P2.c component and is reused here rather than rebuilt.

### P3.f — RBAC

| Item | Figma page/node | Result |
|---|---|---|
| RBAC documentation | `RBAC` / frame `95:58` | States the four outcomes, the SRS selection rules, and that Figma visibility is not security. |
| RBAC Outcome | `RBAC` / `95:105` | 4 variants: `State` (Enabled/Read-only/Disabled/Hidden). Each carries its code tile, the governing rule, and a live example — Button Destructive for E, a plain-text Detail Field for R, Button Destructive Disabled for D, and a dashed "Control not rendered" placeholder for H. |
| `P3_RBAC_AND_SYSTEM_STATES.md` | — | Full role baseline, pilot-surface gating table, Access Denied vs Not Found safety rules, effective-time rules, and the mockup-vs-SRS permission discrepancy. |

The most important design decision recorded here: **`R` means the mutation control is absent, not greyed out.** A disabled input still signals "there is a field you might edit"; read-only means the user is simply viewing data. This is the most common way an RBAC design goes wrong, so the Read-only variant deliberately shows a plain-text `Detail Field` rather than a disabled `Text Input`.

### P3.h — Pilot prototype

Page `Pilot — Backlog to Detail` (`96:12`). Every frame is composed from instances; none contains a hand-drawn copy of a pattern.

| Frame | Node | Demonstrates |
|---|---|---|
| 1 — Backlog (Workspace Admin) | `96:723` | App Shell + List Toolbar + Filter Bar + Data Table, all instances. |
| 2 — Backlog with Work Item drawer | `96:1719` | Drawer docks beside the table; the table narrows and its columns truncate correctly; the Active row state is visible. |
| 3 — Create Work Item dialog | `97:1747` | Standard Dialog over a scrim at the mockup's exact `rgba(0,0,0,0.28)`, Content slot filled with Form Field instances. |
| 4 — Backlog query error | `98:1676` | `System State Type=Error` replaces the table body. Filters are preserved (contract: query state survives retry); the bulk bar is hidden because selection cannot survive a failed refetch. |
| 5 — Backlog as Project Member | `98:2215` | RBAC `H` in three places at once: navigation reduced to Home/Plan/Track, settings gear absent, and the "Move to Release" bulk action removed. Context narrowed to the assigned team. |

### P3.g — UI/API contracts

`P3_UI_API_CONTRACTS.md` written. Deliberately framed as **UI requirements, not API specification**, per P0 finding G-007 and the `RECONCILED_SOURCE_OF_TRUTH.md` scope note that database/API/persistence are outside that source. Endpoint names are placeholder capabilities; the authoritative content is the enum adapter and the lifecycle rules, quoted from BA-confirmed sources.

Eight open questions were raised rather than guessed — the substantive ones being the concurrency model (Q-04), whether backlog rank is server-ordered with an optimistic reorder (Q-03), the structured shape of a blocked delete (Q-02), and the missing Defect State badge mapping (Q-05).

## New tokens added in P3.b

| Token | Value | Why |
|---|---|---|
| `color/border/row` | `#edf0f4` | Dense table row divider; lighter than `color/border/default`. |
| `color/bg/accent-faint` | `#f3f6fb` | Selected row tint, one step lighter than `color/bg/accent-subtle`. |
| `color/border/accent` | `#bdd0ef` | Bulk-action bar border and accent control outlines. |

## Corrections and findings during P3.b

1. **`createSlot()` assigns a default opaque white fill.** This silently covered the parent's background: Table Row's Selected and Active tints only rendered in the ~44px left gutter, with the rest of the row painted white by the slot. Cleared on every slot created so far — Table Row `Cells` (×4 variants), Dialog `Content`, Drawer `Content`. Always set `slot.fills = []` immediately after `createSlot()`.
2. **Select had a latent resize defect from P2.** Its `value` text was `FIXED` width (a carry-over from the Text Input zero-width ellipsis fix), so narrowing a Select instance made the text overflow outside the control instead of reflowing — first seen on the pagination rows-per-page control. Fixed at source across all 10 Select variants: `textAutoResize = 'HEIGHT'` + `layoutSizingHorizontal = 'FILL'` + `maxLines = 1` + `textTruncation = 'ENDING'`. Re-verified that the original ellipsis bug did not reappear at full width.
3. **Bulk-action buttons reuse Button Secondary Small rather than the mockup's blue-outlined buttons.** The mockup styles these with accent border/text; using the standard secondary button keeps one button system instead of introducing a fifth style, and the bar's own accent tint already signals selection mode. Documented deviation.
4. **The P2 Drawer hugged its height instead of filling.** Its Content slot stayed at its authored 200px while the panel was 640px tall, and `clipsContent` silently swallowed everything below — the TAGS field existed in the tree with all three Tag instances but never rendered. Fixed at source: the Drawer is now a fixed-height docked panel (320×640) whose Content slot is `FILL` on both axes. Any slot intended to hold variable-length content must be `FILL` inside a `FIXED`-height parent, never inside an `AUTO` one.
5. **Minimum column widths are real.** `RANK` at 48px and `EST` at 40px truncated their own headers once the sort icon and resize handle were accounted for; both were widened (64px / 56px). Any column carrying a sortable header needs roughly 56px minimum. This feeds the D-006 / G-006 desktop minimum-width rules.

## RBAC already demonstrated in P3.a

The TopNav `Role` axis is the first concrete evidence for P3.f's `H` (Hidden) state, sourced from `Phase 4/02_Roles_Permissions/SRS.md` §3.6 and `model.ts` `can.viewAdmin`:

| Role | Navigation | Workspace settings gear |
|---|---|---|
| Workspace Admin | Home, Plan, Track, Quality, Portfolio, Reports | Visible |
| Project Admin | Home, Plan, Track, Quality, Portfolio, Reports | **Hidden** (`can.viewAdmin` is Workspace Admin only) |
| Project Member | Home, Plan, Track only | **Hidden** |

## New tokens added in P3.a

| Token | Value | Why |
|---|---|---|
| `color/nav/surface` | alias `navy/700` (`#1d3f73`) | The actual TopNav background. The pre-existing `color/nav/bg` resolves to `navy/800` (`#162d56`) and does **not** match the mockup — see corrections below. |
| `color/bg/accent-subtle` | `#edf2fb` | Selected/hover tint used by nav dropdown rows, the selected project row and Context Select hover. No existing token matched. |

## Corrections and findings during P3.a

1. **`color/nav/bg` is misnamed.** It resolves to `navy/800` (`#162d56`), but the real TopNav in `layout.tsx:66` is `#1d3f73` (`navy/700`). The token is currently consumed by Button's Primary **hover** state, where a darker navy is genuinely wanted. Rather than repoint an approved P1 token and silently change Button, a correctly-named `color/nav/surface` was added for the nav surface and `color/nav/bg` was left untouched. Recommend renaming `color/nav/bg` → `color/action/primary/bg-hover` in a future foundations pass.
2. **Breadcrumb separator hit the shared-property merge bug again.** `Show Separator` was added per-variant before `combineAsVariants`, which merged the three into one shared boolean and forced every level to the default (`false`). Since the separator must track the level (Root never has one; Middle and Current always do), the shared property was deleted and visibility baked per variant — the same resolution used for Type Badge and Alert in P2.
3. **Spacing normalisation.** The mockup's nav item horizontal padding is `px-2.5` (10px), which the approved spacing scale deliberately omits. Normalised to the 8px token rather than adding a `10` step that would pollute the scale.
4. **Translucent overlays stay literal.** Every white-on-navy overlay in TopNav (`0.08`/`0.16` item backgrounds, `0.15` logo, `0.65`/`0.55`/`0.5`/`0.4` text and icon tints, `0.2` divider, `0.1`/`0.15` search field) is a literal rgba paint. A bound colour variable forces alpha to 1 — the same constraint already documented for the P2 focus ring. This is the P1 rule 2 documented exception.
5. **`createNodeFromSvg` is far more reliable than hand-authored vector paths** for real icon glyphs. All 11 nav icons were imported this way and needed no geometry correction, versus the manual path arithmetic used for AlertCircle/InfoCircle/AlertTriangle in P2.

## Next autonomous action

Continue `P3.b`: DataTable, sortable/resizable header, row action, selection and bulk-action patterns. Source: `BacklogPage.tsx` (`ResizableBacklogHeader` at line 74, the row/bulk toolbar and pagination footer), cross-checked against `QualityPage.tsx` and `IterationStatusPage.tsx` so the pattern is shared rather than Backlog-specific.

Do not request a plan confirmation until all P3 checklist items are review-ready.
