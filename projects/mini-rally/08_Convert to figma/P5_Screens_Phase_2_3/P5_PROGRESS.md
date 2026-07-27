# Plan 5 — Live Progress

## Current item

Plan 5 confirmed by the user (`2026-07-21`). Plan 6 (Phase 4 governance screens) is now unblocked — see `CONVERSION_PROGRESS.md`.

### P5.g — Validation

Reuse audit (script-based, same method as P3.i): `SCR-05`/`SCR-06`/`SCR-07` were checked via `findAllWithCriteria({types:['INSTANCE']})` — 73/59/76 instances respectively, every one resolving to an existing component (badges, Avatar, Checkbox, Button, TopNav icons, Metric Card); no locally-authored leaf duplicates found. App Shell placeholder text ("Screen content goes here") is hidden or absent on all three screens.

**Live-browser validation was blocked.** Attempted to compare the built screens against the running mockup (same method as P4.f) but navigating to Track (needed for Iteration Status and Team Status) reproducibly crashes the app to a blank screen, even after a full dev-server restart. Root cause found by reading source: `03_Mockup Design/src/app/pages/PortfolioPage.tsx` calls `<SavedViewsDrop />` (line 78) without importing it — it's only defined/exported from `components/layout.tsx`. This throws a `ReferenceError` with no error boundary anywhere in the tree, which blanks the entire app, not just Portfolio. This is a genuine pre-existing mockup bug, unrelated to anything Plan 5 touched; flagged as a separate spawned task rather than fixed here (out of scope for a design-conversion plan). Fell back to direct source-code comparison instead — column names, enum values and labels for `SCR-05`/`06`/`07` were copied verbatim from `IterationStatusPage.tsx`/`TeamStatusPage.tsx`/`QualityPage.tsx` during construction (see each screen's build log above), which is actually the higher-precedence evidence source per Plan 0's stated precedence order (source code ranks above rendered runtime).

`CONVERSION_PROGRESS.md` updated: screen coverage matrix now shows Iterations/Iteration Status/Team Status/Quality as Converted, gate log row set to `Awaiting confirmation`, Q-12/13/14 recorded.

### P5.f — Contracts

`P5_SCREEN_CONTRACTS.md` written: Contract 10 (Iteration Status), 11 (Team Status), 12 (Quality/Defects). Key findings: Iteration Status and Team Status editability in the mockup reduces entirely to the project-scope `readOnly` flag (`can.manageBacklog`/`can.edit` are unconditionally `true` for every role) — flagged as Q-12. Quality/Defects is the one Plan 5 screen where role genuinely differentiates (`can.createDefects` is `false` for Project Member). Quality also has four coexisting near-look-alike enums on one row (Severity/Priority/State/Flow State) — documented explicitly so they don't get conflated later (Q-14).

## Release Management resolution (supersedes part of the P5.b architectural finding)

The P5.b finding that `IterationsPage.tsx` covers Iterations/Releases/Milestones via one Type-switched list is still correct for what's **reachable in the app** — `NAV_ITEMS` (`layout.tsx`) only wires Plan → Timeboxes and Portfolio → "Release Planning (Phase 5)" (the `ReleasePlanningPlaceholder`, already out of scope as Tier B). But `App.tsx` also has a third route, `case "releases"` → `ReleasesPage.tsx`, a real, fully-coded screen (own metric strip: Total/Active/Accepted/Planning; expandable rows with description, 4 stat cards, "View Included Items"; its own 12-column set) with **no nav entry pointing to it**. Resolved autonomously as the same category of gap already decided in P0 (D-002: orphaned-but-coded screens like `TeamBoardPage`/`PortfolioPage` are Tier B, reference-only, not dev-ready) — not re-raised as a new open question. No Figma screen built for it; recorded in `CONVERSION_PROGRESS.md`.

## Architectural finding — P5.b and P5.e share one screen

`IterationsPage.tsx`'s main export renders Iterations, Releases **and** Milestones through a single list (`TimeboxListItem`, a common shape all three build into) switched by a `Type` segmented control — the same architecture the `RECONCILED_SOURCE_OF_TRUTH.md` navigation table describes ("Plan > Timeboxes > Releases | Sole Phase 3 Release create/edit/detail/artifact surface"). So `SCR-04 Timeboxes` (built for P5.b, showing the Iterations tab) **is** the screen P5.e needs for Release Management too — selecting the Releases tab is a data/column change, not a new screen. P5.e's remaining work is therefore the Release-specific detail/artifact view, not a second list screen.

## Completed native Figma work

### P5.a — Backlog

**Resolved Q-11 before building** (open from Plan 4): `DEFECT_PRIORITY_LABELS = { Critical: "Urgent", High: "High", Medium: "Normal", Low: "Low" }` appears identically in `BacklogPage.tsx`, `QualityPage.tsx` and `WorkItemDetailPage.tsx` — a consistent 1:1 display-label mapping over the same underlying Critical/High/Medium/Low value, exactly like `Status Badge`'s `Completed`→"Done". This was resolvable from workspace evidence (three independent source files agreeing), not a genuine business-decision fork, so it was resolved autonomously rather than re-raised to the user.

| Item | Figma page/node | Result |
|---|---|---|
| `color/badge/defect-priority/text` | Color collection | New token, `#9a3412`. Bg/border/dot reuse existing `badge/priority/high/bg`, `badge/status/in-progress/border` and the `orange/500` primitive — only the text colour was genuinely new. |
| Defect Priority Chip | `Screens — Phase 0–1` / `130:1596` | 2 variants: `Mode` (Display/Editable). Colour is constant regardless of the label value (unlike the general `Priority Badge`, which varies colour per value) — only the text changes, matching the mockup's flat amber treatment for every Defect priority. |
| `SCR-02 Backlog` | `Screens — Phase 2–3` / `132:3740` | Promoted from the P3 pilot's Backlog frame (App Shell + List Toolbar + Filter Bar + Data Table, all instances) rather than rebuilt from scratch — the pilot already proved this exact composition. The one correction: `DE-1180`'s priority cell now uses `Defect Priority Chip` `Mode=Display` instead of the general `Priority Badge`. |

## Correction technique note

Swapping an instance inside a populated row (Priority Badge → Defect Priority Chip) failed once with `insertChild: Cannot insert node at a negative index` when using the pattern "compute old index, insert new at that index, remove old" — likely because the wrapper's child index wasn't what was assumed once the container had auto-layout reflow between steps. Fixed by simplifying to **append the new instance, then remove the old one** — order-independent for a single-child wrapper and avoids index arithmetic entirely. Prefer this pattern for any future single-child instance swap.

### P5.b — Iterations / Timeboxes

| Item | Figma page/node | Result |
|---|---|---|
| Timebox State Badge | `Screens — Phase 0–1` / `133:1639` | 10 variants (Planned/Planning/Committed/Active/Accepted/At Risk/Met/Missed/Cancelled/Completed), new `color/badge/timebox/*` tokens (30 total) — a distinct domain from `Status Badge` per D-005, matching `IterationsPage.tsx`'s `STATE_STYLES` table verbatim. Hit the same shared-property-merge bug as Type Badge (all 10 forced to "Planned"); fixed the same way — delete the shared property, bake text per variant. |
| `SCR-04 Timeboxes — Iterations` | `Screens — Phase 2–3` / `134:751` | Header with a `Type` segmented control (Iterations/Releases/Milestones), toolbar, and a Data Table with Name/Theme/Start/End/Project/Planned Velocity/Task Estimate/State columns, 5 example rows. |

**Scoped out of this pass:** the Create Timebox modal (`NewTimeboxModal`) and the Iteration Create/Detail page (`IterationCreateDetailPage`) were not built — both are structurally the same Dialog+Form Field / Drawer-style composition already proven in P3/P4 (create dialog, field aside), so rebuilding them here would be a redundant example rather than new coverage, consistent with the `AddTaskModal` scoping decision in P4.d. Flag if a screen-specific nuance in either surfaces before Plan 6.

### P5.e — Quality / Defects (Release Management detail still pending)

| Item | Figma page/node | Result |
|---|---|---|
| `color/badge/severity/{critical,major,minor,neutral}/{bg,text,border}` | Color collection | 12 new tokens, exact hex match to `QualityPage.tsx`'s `SeverityBadge` inline styles. `None` and `Trivial` both bind to the `neutral` set (mockup's default `else` branch covers both identically). |
| Severity Badge | `Screens — Phase 0–1` / `146:5438` | 5 variants (None/Critical/Major Problem/Minor Problem/Trivial), literal label baked per variant (same shared-property-merge avoidance as every prior badge family). |
| `SCR-07 Quality — Defects` | `Screens — Phase 2–3` / `147:1533` | Toolbar (title, search, Filter, Log Defect button), 12-column Data Table (Rank/ID/Name/User Story/Severity/Priority/State/Flow State/Fixed In Build/Iteration/Submitted By/Owner) reusing Severity Badge, `Defect Priority Chip` (`Mode=Display`, reused as-is from P5.a — its labels already match `QualityPage.tsx`'s own `DEFECT_PRIORITY_LABELS`), Status Badge (Flow State column), Avatar (Submitted By/Owner), Checkbox. Pagination footer (rows-per-page, range, page indicator). Breadcrumb/nav corrected to Quality > Defects. |

**Reuse-vs-rebuild note:** attempted to instantiate the shared `Data Table`/`Header Cell`/`Table Row` components (used by `SCR-02 Backlog`) first, since Quality is a flat sortable table like Backlog. Blocked: `header-row` is fixed instance content inside the `Data Table` component (not a Slot), sized for Backlog's 9 columns — inserting/removing header cells on an instance throws (`Cannot move node... inside of an instance`), and editing the shared component directly would retroactively change the already-approved Backlog screen. Built Quality's table from a bespoke frame instead (same approach as P5.c/P5.d), but reused every *cell-content* component (badges, chips, Avatar, Checkbox) rather than re-deriving them. Flag for Plan 7 QA: the shared Data Table component may be worth generalizing (a real Rows-style Slot for header cells too) if a future screen needs this reuse to actually work end-to-end.

### P5.c — Iteration Status

| Item | Figma page/node | Result |
|---|---|---|
| `SCR-05 Iteration Status` | `Screens — Phase 2–3` / `136:952` | Header with Iteration/Status selector chips, 5-`Metric Card` strip (Planned Velocity, Iteration End, Accepted, Defects using `Emphasis=Danger`, Tasks), toolbar (Show filter + Add Item), Data Table (`137:1115`) with columns `#/ID/Type/Name/Schedule State/Iteration/Blocked/Plan Est/Task Est/To Do/Owner` matching `IterationStatusPage.tsx`'s `IterationColumnKey`. 5 example rows mixing Story/Defect types, one `Blocked=Yes` row using `Icon/AlertTriangle` + danger text. Breadcrumb and TopNav active-state corrected from the inherited App Shell default (`Plan > Backlog`) to `Track > Iteration Status`. |

No new components were needed — Type Badge, Status Badge, Avatar (XS), Checkbox and Metric Card were all reused as-is from P2/P4.

## Next autonomous action

Continue `P5.d`: Team Status capacity/task tracking. Source: `03_Mockup Design/src/app/pages/TeamStatusPage.tsx`.

Do not request a plan confirmation until all P5 checklist items are review-ready.
