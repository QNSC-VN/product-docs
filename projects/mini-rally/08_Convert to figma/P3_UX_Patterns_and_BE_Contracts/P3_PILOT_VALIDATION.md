# Plan 3 — Pilot Validation

## Method

Every pattern was validated in two passes before being marked complete, the same protocol used in Plan 2:

1. **Structural** — metadata reads confirming variant axes, component property keys/types, and that every colour/spacing/radius/type value resolves to a bound variable rather than a literal.
2. **Visual** — a screenshot of the component set or assembled frame, checked for clipped text, collapsed layout, invisible states and incorrect composition.

For the pilot specifically, a third pass was run: a **reuse audit** that walks each frame's node tree and counts anything authored locally rather than instanced.

## Exit criterion 1 — "Developers can see what data a component consumes and how it behaves for every server state"

| Evidence | Where |
|---|---|
| Six-state query machine (initial-loading, refetching, empty, success, error, forbidden/not-found) defined once and referenced by every contract | `P3_UI_API_CONTRACTS.md` § Shared conventions |
| Six-state mutation machine (idle, validation-error, submitting, success, server-error, conflict) | same |
| Per-pattern read models, actions, authorization and navigation | `P3_UI_API_CONTRACTS.md` contracts 1–5 |
| Every state has a named Figma component, not just prose | `System State` (4 variants), `Table Skeleton`, `Alert`, `Toast`, `Form Field State=Error`, `Dialog Type=Destructive Confirmation` |
| Enumerations bound to BA-confirmed values with their display mapping | `P3_UI_API_CONTRACTS.md` § Enumeration adapter |

**Met.** With one honest qualification: the contracts specify what the UI consumes and how it behaves, not the transport. Eight questions that genuinely cannot be answered from the SRS, the mockup or this workspace are raised as Q-01…Q-08 rather than invented. Q-01 (transport/route shape), Q-03 (server-side rank + reorder) and Q-04 (concurrency model) must be answered before Backlog can be implemented.

## Exit criterion 2 — "Table/filter/modal/status are reusable patterns, not copied screen fragments"

Reuse audit across the five pilot frames:

| Frame | Top-level instances | Total instances incl. nested | Locally authored leaf nodes |
|---|---:|---:|---:|
| 1 — Backlog (Workspace Admin) | 5 | 133 | **0** |
| 2 — Backlog with Work Item drawer | 6 | 151 | **0** |
| 3 — Create Work Item dialog | 2 | 143 | **0** |
| 4 — Backlog query error | 5 | 110 | **0** |
| 5 — Backlog as Project Member | 5 | 133 | **0** |
| 6 — Destructive delete confirmation (Contract 5) | 1 | 7 | **0** |

A "locally authored leaf node" is any TEXT, VECTOR, ELLIPSE, RECTANGLE, POLYGON or LINE that sits inside a pilot frame but outside every instance — i.e. something drawn by hand instead of composed. **The count is zero in every frame.** Every visible pixel in the pilot comes from a component instance. (Frame 6 is a single `Dialog` instance; its title/description/confirm-label text are that component's own overridable properties with realistic values substituted in, not hand-authored content sitting alongside the component — the same category as any Button's overridden `Label`.)

Distinct pattern sources consumed by the pilot: `App Shell`, `TopNav`, `Context Bar`, `List Toolbar`, `Filter Bar`, `Data Table`, `Drawer`, `Dialog`.

**Met.** Frame 6 was added in Plan 7's dev-handoff walkthrough (`P7_DEV_HANDOFF_WALKTHROUGH.md`) after finding Contract 5 (Destructive delete) had no persisted Figma evidence anywhere in the file despite being fully specified in `P3_UI_API_CONTRACTS.md` — the pilot's five-frame coverage was one contract short of the five it documents.

## Exit criterion 3 — "Pilot flow has visual, state and contract evidence"

| Aspect | Evidence |
|---|---|
| Visual | Five screenshot-verified frames on `Pilot — Backlog to Detail` (`96:12`) |
| State | Frame 4 shows the error state with filters preserved and selection cleared; the skeleton, empty, forbidden and not-found states exist as components on `System States` |
| Permission | Frame 5 shows three simultaneous `H` outcomes — navigation reduced, settings gear absent, release bulk action removed — plus context narrowed to the assigned team |
| Contract | `P3_UI_API_CONTRACTS.md` contracts 2 and 3 cover exactly this flow; `P3_RBAC_AND_SYSTEM_STATES.md` carries the pilot-surface gating table |

**Met.**

## Per-item validation status

| Item | Structural | Visual | Notes |
|---|---|---|---|
| P3.a App Shell | Pass | Pass | TopNav `Role` axis doubles as the first RBAC evidence |
| P3.b Data Table | Pass | Pass | Populated example proves P2 badge/avatar/checkbox reuse |
| P3.c Query controls | Pass | Pass | Saved Views reuses the P2 Dropdown rather than adding a component |
| P3.d Detail patterns | Pass | Pass | Drawer example composes five Detail Fields with badge/avatar/progress/tag values |
| P3.e System states | Pass | Pass | Built before P3.d because every other pattern needs them |
| P3.f RBAC | Pass | Pass | `R` correctly renders as absent control, not a disabled one |
| P3.g Contracts | Pass | n/a | Document; completeness assessed against the P0 template |
| P3.h Pilot | Pass | Pass | Reuse audit: zero locally authored nodes |

## Defects found and fixed during Plan 3

Four were latent defects in **already-approved Plan 2 components** that only surfaced once real patterns consumed them. This is the main argument for building a pilot rather than shipping a component library untested.

1. **`createSlot()` assigns a default opaque white fill.** It silently covered the parent background — Table Row's Selected and Active tints rendered only in the 44px left gutter. Cleared on every slot in the file (Table Row ×4, Dialog, Drawer, App Shell). Always set `slot.fills = []` immediately after `createSlot()`.
2. **Select's value text was FIXED width.** A carry-over from the P2 Text Input ellipsis fix. Narrowing a Select instance pushed its text outside the control — first seen on the pagination rows-per-page picker. Fixed across all 10 variants with FILL + HEIGHT auto-resize + single-line truncation, and re-verified that the original ellipsis bug did not return.
3. **Drawer hugged its height instead of filling.** Its Content slot stayed at the authored 200px inside a 640px panel while `clipsContent` swallowed the overflow: the TAGS field existed in the tree with all three Tag instances but never rendered. Fixed to a fixed-height panel with a FILL slot.
4. **Dialog had the same slot-fill defect**, found while assembling pilot frame 3 — only two of four form fields were visible. Fixed the same way.
5. **Breadcrumb separator hit the P2 shared-property merge bug again.** `Show Separator` was added per-variant before `combineAsVariants`, which merged the three into one boolean and forced every level to the default. Baked per variant instead, matching the Type Badge and Alert resolutions.

The generalised rule from 3 and 4, now recorded in `P3_PROGRESS.md`: **a slot holding variable-length content must be `FILL` inside a `FIXED`-height parent, never inside an `AUTO` one.**

## Findings raised to BA / dev

| Finding | Impact |
|---|---|
| `model.ts` `PERMISSIONS_MATRIX` contradicts the Phase 4 SRS matrix in granularity, state model and content (it grants Reports access that the SRS defers to Phase 5) | Recorded in `P3_RBAC_AND_SYSTEM_STATES.md`. It is mock data — rank 4 under the Plan 0 source-precedence rule — so the SRS governs. Flagged so nobody implements the array as the permission model. Extends P0 findings G-001 and G-005. |
| `color/nav/bg` is misnamed | It resolves to `navy/800` but the real TopNav is `navy/700`; it is currently consumed by Button's Primary hover state, where the darker navy is genuinely wanted. A correctly named `color/nav/surface` was added rather than repointing an approved P1 token and silently changing Button. Recommend renaming it `color/action/primary/bg-hover` in a future foundations pass. |
| Sortable columns need ~56px minimum | `RANK` at 48px and `EST` at 40px truncated their own headers once the sort icon and resize handle were accounted for. Feeds the D-006 / G-006 desktop minimum-width rules. |
| P3 fills SRS task `P4-RBAC-05` (frontend route/action/field gating), which the SRS lists as Pending | It does **not** close `P4-RBAC-03`, `-04` or `-06` — backend enforcement and verification remain open and owned elsewhere. |

## Scope notes

- **Relations** (P3.d's "relation" element) are covered structurally by `Detail Field` with a slot, but no dedicated Relation Row component was built: the mockup's relation section is a static list with no confirmed interaction contract, and inventing one would violate workflow rule 6. Flagged for Plan 4 when a real screen needs it.
- **Reports, Portfolio and top-level Release Tracking** carry no RBAC or contract work here — the Phase 4 SRS defers all three to Phase 5.
- **Responsive rules** (D-006 / G-006) are partially addressed: minimum column widths and horizontal-overflow behaviour are evidenced by the Data Table, but a full breakpoint specification was not in the P3 checklist and belongs with the screens in Plans 4–6.
