# Phase 5 + Phase 6 — Decision Matrix (BA gap vs. real Rally)

**Date:** 2026-08-04
**Purpose:** decide *approach* before writing any Phase 5/6 fix. Every gap the audit found in Portfolio Items, Capacity Planning, Reports and Release Tracking is listed here against what real Rally does, with a verdict.
**Code:** `rally@main` = `0d5fbba5`
**Scope:** Phase 5 = Portfolio Items + Capacity Planning. Phase 6 = Reports + Release Tracking. Nothing else.

**Evidence base:** nine research files in `09_Gap_Audit/research/`, each claim URL-cited to techdocs.broadcom.com / knowledge.broadcom.com / official RallyTools+RallyApps SDK repos, and labelled *documented* / *inferred from API schema* / *community* / *no authoritative source found*. Phase-5/6-specific: `RALLY_PORTFOLIO_ITEMS.md`, `RALLY_CAPACITY_PLANNING.md`, `RALLY_REPORTS.md`, `RALLY_RELEASE_TRACKING.md`.

---

## How to read the verdicts

| Verdict | Meaning |
|---|---|
| **FIX CODE** | Rally's behavior is documented and we diverge from it. Change the app. |
| **AMEND SRS** | Our code is right and the BA spec is wrong about Rally. Change the doc, not the app. |
| **SPLIT** | Part of the finding is a code bug, part is a doc error. Both, in stated proportions. |
| **BA DECIDES** | Rally has no analogue, or Rally and our product goals genuinely differ. Needs a human call; a recommendation is given. |
| **NO CHANGE** | Verified correct. Recorded so it is not re-litigated. |
| **VERIFY FIRST** | Cannot be settled from public docs. Needs a live Rally tenant before any code moves. |

**Headline count:** 12 FIX CODE, 11 AMEND SRS, 3 SPLIT, 7 BA DECIDES, 9 NO CHANGE, 6 VERIFY FIRST.

**The single most important number in this document:** of the gaps the audit blamed on our code, **11 turned out to be the BA spec being wrong about Rally.** Fixing those in code would have moved us *away* from the product we are cloning. Read §0 before starting anything.

---

## 0-A. Decisions taken — 2026-08-04

Recorded so the rest of this document is read through them. These supersede the recommendations below where they differ.

| Decision | Ruling |
|---|---|
| **Precedence when BA spec and Rally conflict** | **Rally wins; the SRS gets amended.** Documented Rally behavior is the target. The 11 AMEND SRS rows become doc tickets, not code tickets. |
| **D-1 / D-2 — portfolio State + PreliminaryEstimate enum shape** | **Defer the schema change. Correct values only for now.** Log the shape gap as a known divergence. See §0-B — the honest scope of "values only" is smaller than it appears. |
| **D-3 — reporting history** | **Fix the self-contradiction only.** No bitemporal rebuild. Pick one history rule and apply it to all three reports; record the snapshot-table scaling cost in the SRS as accepted. |
| **P6-RT-1 — Release Tracking Breakdown** | **Expose it.** RT-AC-12 gets amended. |

### The note-taking convention for Rally-driven changes

Every change made because Rally does it differently from the BA design **must be marked in two places**, so the BA can review exactly what moved away from their spec and why.

**1. In the code**, at the changed site:

```ts
// RALLY PARITY (differs from BA design)
// Rally: <what Rally actually does> — <source URL>
// BA spec said: <what the spec required> (<doc path + section>)
// Decided 2026-08-04: Rally wins. See 09_Gap_Audit/PHASE_5_6_DECISION_MATRIX.md#<row-id>
```

Use the row id from this document (`P5-PI-3`, `P6-RT-2`, …) so the comment and the matrix stay linked. Where a divergence is *deliberate and against* Rally, invert the tag to `DELIBERATE DIVERGENCE FROM RALLY` with the same three lines — that distinction is what makes the ledger trustworthy.

**2. In §8 of this document** — the divergence ledger. One row per landed change. That table is the BA's review surface; it is not optional and should be filled as the work lands, not reconstructed afterwards.

Commit messages for these changes should name the row id too, so `git log` alone answers "why did this behavior change".

---

## 0-B. What "correct values only" actually scopes to

Checked against the code after the ruling. **It is close to a no-op, and one part of it would be actively harmful.** Stating this plainly because it changes the sprint estimate.

- **`portfolio_item_state` — change nothing.** Rally's states are **admin-configurable up to 20 values**, which means our 11 (`no_entry`, `intake`, `idea_prioritization`, `problem_discovery`, `solution_discovery`, `feature_prioritization`, `developing`, `accepted`, `measuring`, `done`, `cancelled`) are a **legal Rally configuration** — not wrong values. They are also visibly the BA's designed intake funnel. Rewriting them to Rally's four defaults (Discovering / Developing / Measuring / Done) would destroy BA product intent for **zero parity gain** and require migrating live rows. D-1's original framing listed "wrong values / cardinality" as one of four counts; that was an overstatement. The real defects are shape, scoping (Feature and Epic share one list where Rally keeps them independent) and the missing per-value columns (Rank, WIP Limit, Description, Enabled) — all deferred by this ruling. **Action: document only.**

- **`preliminary_estimate_size` — labels already correct.** Our members (`no_entry` + `xs`…`xl`) match Rally's five defaults plus an unsized state, and `enums.ts:457-469` already documents why the extra member exists and why its 0 is safe (it falls through the tier chain, so an unsized item shows a blank meter rather than 0%). **Action: none on the enum.**

- **The numeric map — VERIFY, do not change blind.** Direct source conflict:
  - `db/schema/enums.ts:471-472` asserts "XS=1 / S=3 / M=5 / L=8 / XL=13 matches Rally's documented defaults exactly (Broadcom KB 94797, *How Plan Progression Capacity is calculated*)".
  - `research/RALLY_PORTFOLIO_ITEMS.md` found the Rally admin page documents **XS 13, S 20, M 40, L 100, XL 250**.

  Ours is a Fibonacci story-point scale, which the BA spec itself called "temporary mockup data" — so the likely explanation is that KB 94797 shows a *capacity-calculation example* rather than the shipped defaults. **Resolve before touching it:** changing `DEFAULT_PRELIMINARY_ESTIMATE_MAP` silently re-scales every Estimated figure, every Estimated Progress meter and the capacity Preliminary tier across the product. Added to §6 as a verification item.

**Net scope of the "values only" ruling: one verification, no value edits.** The two enum shapes stay as they are with a documented divergence. Everything else in §1 proceeds under the Rally-wins precedence.

---

## 0. Three structural decisions that gate everything else

These are not line-item fixes. Each changes the shape of the schema or of the reporting layer, and each invalidates downstream work if decided after coding starts.

### D-1. `portfolio_item_state` — a fixed enum where Rally has an admin-editable, per-type object

**Rally:** `State` is a workspace-scoped first-class object — `class State(WorkspaceDomainObject)` in the official pyral SDK, beside `Release`/`Iteration`/`Project`. "You can define different states for each of your portfolio item types." **Four** defaults (Discovering, Developing, Measuring, Done), maximum 20, and **each value carries its own attributes**: Name, `Rank` (which orders Kanban columns), `WIP Limit` (−1..200), `Description` (used as the Kanban exit agreement), `Enabled` (retire without deleting).

**Ours:** `portfolio_item_state` is an 11-value `pgEnum` at `db/schema/enums.ts:280-292`, shared by every portfolio item type.

Wrong on four independent counts: **shape** (a Postgres enum cannot carry per-value columns), **scoping** (Rally's Feature states and Initiative states are *independent lists*; ours is one global list), **values and cardinality** (11 invented values vs 4 configurable defaults), and **no home** for Rank / WIP Limit / Description / Enabled.

**Verdict: FIX CODE — but it is a schema change, not a value-list change.** A `portfolio_item_states` table keyed by (workspace, portfolio item type) with the five per-value columns, plus a FK from `portfolio_items`. Everything that reads the enum — grid cells, filters, the Kanban-ish surfaces, the CHECK constraints in `0071` — moves with it.

**Do this first or not at all this phase.** Every other Portfolio Items fix touches the same files, and doing them before D-1 means doing them twice.

### D-2. `preliminary_estimate_size` — same class of error, and it discards the field's purpose

**Rally:** `PreliminaryEstimate` is likewise `class PreliminaryEstimate(WorkspaceDomainObject)`. **Five** defaults, each with a **numeric value**: XS 13, S 20, M 40, L 100, XL 250. Both Display Name and Value are workspace-editable; an Enabled flag retires values. Also documented: "Preliminary estimates will not roll up", and they have no relationship to Plan Estimate.

**Ours:** a 6-value label-only `pgEnum` (`no_entry|xs|s|m|l|xl`), with the size→points map held separately in `workspace.workspace_settings.preliminary_estimate_map`.

The instinct behind that map was right — and the comment at `enums.ts:294-301` correctly notes "Rally also makes it a workspace-admin setting". But splitting the label from its value across an enum and a JSON blob means the two can drift, and the numeric value *is* the field's reason to exist.

**Verdict: FIX CODE.** Fold both into one `preliminary_estimates` table (workspace, name, value, enabled), FK from `portfolio_items`, and retire both the enum and the settings blob. Same migration window as D-1.

### D-3. Reporting history — right outcome, non-Rally mechanism, and our spec contradicts itself

**Rally:** one rule for every chart. Persist **artifact history**, recompute **every series at view time**. The store is the Lookback snapshot schema: "every time there is a change, an entirely new snapshot is saved… The older snapshot is not removed. It is only updated to adjust its `_ValidTo` timestamp." Stated design principle: "We want to encourage you to think of the past as unchangeable." That Rally's own UI charts run on it is confirmed by KB 57608 — a **403 from the Lookback API when a non-admin loads a chart**, which only occurs on a view-time query.

**Ours:** persist the **computed chart point**, keyed by iteration + date, written by a nightly job.

- The *outcome* matches — historical bars stay immune to later edits and moves. **Verified correct.**
- The *mechanism* diverges, and the cost is real: every future historical report needs its own table plus its own job, where Rally serves ~12 charts from one schema. A missed run is unrecoverable. Our own SRS §9 already concedes this.
- **Our spec contradicts itself.** It freezes Burndown but leaves Velocity live — "Unlike Burndown, Velocity is not frozen…". Rally has no such split.

**Verdict: BA DECIDES, with a strong recommendation.** Do **not** rebuild onto a Lookback-style bitemporal store this phase — that is a platform project, and the outcome is already correct. **Do** fix the self-contradiction: pick one rule and apply it to all three reports. Recommend attributing velocity by iteration membership *as at iteration end*, which makes Velocity consistent with Burndown without new infrastructure. Record the snapshot-table scaling cost in the SRS as a known, accepted trade-off rather than leaving it implicit.

---

## 1. Phase 5 — Portfolio Items

| # | Gap | BA/SRS says | Rally does | Verdict |
|---|---|---|---|---|
| P5-PI-1 | State model | 11 fixed values | Admin-editable per-type object, 4 defaults, max 20, five per-value columns | **FIX CODE** — see **D-1** |
| P5-PI-2 | Preliminary Estimate | 6 label-only sizes; map in workspace settings | Editable object, 5 defaults with numeric values XS 13 … XL 250 | **FIX CODE** — see **D-2** |
| P5-PI-3 | `refined_estimate` / `refined_work_item_count_estimate` are `NOT NULL DEFAULT 0` (§3.6, declared divergence `0079`) | Optional; blank falls back to Preliminary | Fields page marks exactly three fields Required (Name, Project, Portfolio Item Type) and marks read-only fields explicitly; RefinedEstimate carries neither marking | **FIX CODE.** The declared divergence does not survive contact with Rally — every new item is currently born claiming "refined, answer 0", which is a different assertion from "not yet refined". Raw WSAPI nullability is unsourceable, so this rests on the doc markings plus workflow semantics. Nullable + fall back to Preliminary |
| P5-PI-4 | `refined_work_item_count_estimate` exists at all | SRS requires it | **Real Rally field, our exact name.** Caveat: Rally counts stories **and defects** | **NO CHANGE** to the field; **verify** our count includes defects |
| P5-PI-5 | `planned_start_date` is a `date` column | SRS: "plain free-text field (intentionally not a date picker)" (`Phase 5/01:107`) | A real date: `Late Child Count` compares against Planned End Date, the progress bar branches on Planned Start Date being undefined vs future, WSAPI requires ISO 8601 | **AMEND SRS.** Our DB is right. The BA's free-text line has no source and would break three documented behaviours |
| P5-PI-6 | Epic carries no Team / no Release (DB CHECK, `0071:80-93`) | SRS forbids both at Epic level | `Project` is marked ***Required*** for portfolio items with **no level qualification**; Rally writes "each team (project)". For Release, Rally only *recommends*: "**Use** the Release attribute on the lowest level" | **SPLIT.** Team: **FIX CODE** — drop that half of the CHECK; we forbid what Rally mandates. Release: **AMEND SRS** — we hardened a recommendation into an invariant; keep the behaviour, relabel it a deliberate constraint |
| P5-PI-7 | Epic archive blocked when it has children | SRS requires the block | `Archived` is an unguarded filterable checkbox. Deletion **cascades to children** with a confirm prompt, explicitly including portfolio items. Portfolio items are **absent from the Recycle Bin** — which is why archive exists as the reversible option | **BA DECIDES.** Rally has neither our gate nor our safety. Recommend keeping the block (it prevents silent orphaning that Rally's own missing Recycle Bin entry makes unrecoverable) and recording it as a deliberate improvement — but do not call it parity |
| P5-PI-8 | Epic Children rows do not expand to preview ≤5 leaves (§5.17, P1) | SRS §404 requires expansion capped at 5 | Expandable rows are a documented idiom; **no cap exists anywhere in Rally** | **SPLIT.** Build the expansion (**FIX CODE**); drop the cap (**AMEND SRS**) — silent truncation invents a limit Rally does not have |
| P5-PI-9 | Four progress bars on detail, two in grid | SRS specifies four | Rally has **six** `PercentDone*` fields, two as default grid columns, with hover callouts (Status / Accepted Points / Accepted User Stories / **Missing Estimates**) and blue/green/yellow/red status colours | **BA DECIDES.** Our four detail bars correspond to nothing documented. Recommend adopting Rally's hover callout — especially **Missing Estimates**, which is the one number that tells a planner their forecast is untrustworthy — and the status colours, before adding more bars |
| P5-PI-10 | Type folded into the ID cell, not its own column (§5.18) | SRS P5-PI-002/Q02/AC-1 wants a Type column | Type is encoded in the ID prefix **by design** ("configure each work item type with a unique prefix… to identify the type at a glance"); grids default to `Rank, ID, Name`; Type appears as a **filter**. No source for a sortable Type column anywhere | **AMEND SRS.** Keep the ID-cell glyph; answer the "unsortable/unhideable" complaint by adding a **Work Item Type filter**, which is Rally's actual mechanism |
| P5-PI-11 | Rank uses drag-and-drop, not ▲▼ buttons | SRS §14/§37: buttons only, drag explicitly "not included" | `DragAndDropRank` (base-94), "the default ranking method for workspaces… used throughout the Rally application". Confirmed independently for portfolio items. No per-row arrows documented anywhere | **AMEND SRS.** Third independent confirmation. Also add the two missing pieces: the **Rank Highest / Rank Lowest / Move to Position** toolbar actions, and Rally's hard precondition — drag requires sort = Rank ascending, else we write nonsense ranks |
| P5-PI-12 | Single `New Portfolio Item` button | SRS FR-030 + AC-27 want a menu offering New Epic / New Feature | Rally has a single `Add New` whose type comes from the page's Type filter | **AMEND SRS.** Our shipped code beats our spec |
| P5-PI-13 | Portfolio KPI strip (Initiatives / Features / Total Stories / Accepted Stories / Total Points) | Not specified; audit flagged as leakage | Rally aggregates **in-grid** via `Group By` with per-group counts and rollups. Documented banner exists on Iteration Status **only** | **FIX CODE** — retire the strip or convert to `Group By` aggregates. Caveat: absence on list pages is documented silence, not a positive statement |
| P5-PI-14 | Portfolio hierarchy tree | — | **No hierarchy-tree page exists.** Portfolio Items is a flat single-type list driven by the Type dropdown | **FIX CODE** if we ship a tree; **NO CHANGE** if the audit's "tree" referred only to parent/child columns. Verify which we actually built before acting |
| P5-PI-15 | "Epic" as a type name | SRS uses Epic + Feature | Shipped type list is `Strategy / Theme / Initiative / Feature`; defaults Theme(3) / Initiative(2) / Feature(1), extensible to five. **"Epic" is in no Rally list.** Broadcom's own documented Epic rename renames **Feature** — the lowest level, the *opposite* of ours | **BA DECIDES.** Recommend keeping our names (renaming is Rally-sanctioned and the product is not Rally) but recording in the SRS that our Epic sits at Rally's *Initiative* level, so nobody maps them wrongly later |
| P5-PI-16 | Portfolio list gated on `workspace:view` (§1.4) | P5-PI-FR-017 gives Project Member read access | Reports and lists follow project visibility | **FIX CODE.** `workspace:view` is admin-reserved, so a correctly project-scoped PA/PM 403s and the service's own `listReadableProjectIds` narrowing never runs. One-line gate change |
| P5-PI-17 | Preliminary Estimate config UI location (§5.19) | SRS: `Workspace > Project Management`; deferred | Rally makes it a workspace-admin setting | **AMEND SRS.** Ours ships under Settings ▸ Workspace. Behaviour is right, location differs; document rather than move |
| P5-PI-18 | Portfolio column order: `state` / `release` transposed vs mockup; children grid 12 cols vs mockup 10 | Mockup order | Rally defaults to `Rank, ID, Name`, everything else opt-in, first three pinned non-reorderable | **AMEND SRS** for the transposition (mockup is not authority over Rally); **FIX CODE** to pin `Rank, ID, Name` first. The children grid's extra TaskEst/ToDo/Actual columns are justified by the three-independent-hours rule |

---

## 2. Phase 5 — Capacity Planning

**Framing correction that changes this whole section:** `app-shell.tsx:120-122` claims "Rally names the capacity screen 'Release Planning'". **That is wrong.** Rally has a page literally called **Capacity Planning**, under Portfolio — "Select **Portfolio, Capacity Planning**" — *and* a separate Release Planning board (backlog column + release columns, drag to schedule, no plan object, no lifecycle), *and* a Team Planning page (story-level, per-iteration capacity bar). Ours maps to Rally's Capacity Planning, and it tracks it unusually closely. Delete that comment.

| # | Gap | BA/SRS says | Rally does | Verdict |
|---|---|---|---|---|
| P5-CP-1 | The wrong `app-shell.tsx` comment | — | Capacity Planning and Release Planning are different Rally pages | **FIX CODE** — delete the comment. It is actively misleading; it already sent one research pass down a false trail |
| P5-CP-2 | Four "undeclared verbs" — Move To Another Plan, bulk Delete, Delete Plan, Edit Plan Details (§5.12, P1) | SRS §14 + `PHASE5_DEV_HANDOFF.md` §5.8 allow only Draft → Published → Revert | Rally documents **Edit Plan Details, Delete Plan, Move To Another Plan, Bulk Edit, Bulk Delete, Unpublish, and Export to CSV** | **AMEND SRS.** The spec understates Rally badly. Rally has *more* than we do — consider adding Bulk Edit and CSV export. Only "Remove all assignments" is undocumented |
| P5-CP-3 | Inline `Estimated` edit on the Team row (§5.12, P1) | SRS §209 + test P5-CP-024: read-only, "no inline number input" | Rally splits them: `Points/Count Capacity` **is** inline-editable ("defined directly in this page and can be modified at any time until the plan is published"); `Points/Count Estimated` is derived (Allocated → Refined → Preliminary), edited only via the Allocate dialog | **SPLIT — and the audit finding was misdirected.** Team row: **NO CHANGE** — `capacity-team-row.tsx:202` already renders Estimated as a read-only `MetricValue`; the `InlineEditableCell` at `:211` is on **Capacity**, which Rally also makes editable. The real divergence is one row down at `allocation-row.tsx:292`, where our own comment admits it: "Rally edits the allocation through its assignment dialog; we put it on the number it changes." **Fixing the Team row would have broken parity** |
| P5-CP-4 | Bulk delete permits deleting a **Published** plan (warns only) | Not specified | Rally documents Bulk Delete and Unpublish, but not deleting a published plan specifically | **BA DECIDES.** Recommend blocking it — publish is our read-only gate, and deleting through it makes the gate meaningless |
| P5-CP-5 | `Add Features` picker shows `key — name` only (§5.12) | SRS §225-233: ID / Name / **Project** / **Team** / **Allocation** in team scope, "so the planner can see which Team currently owns each Feature" | Rally's Items tab carries Planned Project Assignment, Project, Dependencies alongside the numerics | **FIX CODE.** The scope logic at `add-features-modal.tsx:63-99` is already correct; only the rendered columns are missing |
| P5-CP-6 | Tail column order `Rollup → Estimated → Complete` (§6.8, flagged "unverified real-Rally claim") | Mockup: `Complete, Rollup, Estimated` | **Confirmed:** Items tab is `+/-`, Rank, ID, Name, Planned Project Assignment, Project, Dependencies, **Rollup → Estimated → Complete**. Projects By Total inserts Capacity: `Rollup → Estimated → Capacity → Complete` | **AMEND SRS.** Our `capacity-item-row.tsx:253` comment was right; the mockup is wrong |
| P5-CP-7 | Publish variants | SRS specifies Publish and Publish Without Updating Fields; audit verified both | Rally has both, and additionally **disables publish on an empty plan** | **FIX CODE** — add the empty-plan block. Small |
| P5-CP-8 | Missing columns/tabs | — | Rally has `+/-` republish diff, Dependencies, outside-the-plan Project, an Allocation to/from column, and Alignment / Progress / Revision History tabs | **BA DECIDES.** Recommend triaging: the `+/-` republish diff is the highest-value one for a planner re-publishing a changed plan |
| P5-CP-9 | Our `CompositeBar` collapses the three numerics into one control | Not specified | Rally renders them as three separate columns | **AMEND SRS** — record as a conscious deviation |
| P5-CP-10 | `capacity:view_draft` — invented fourth permission code (§2.11 I-4) | BA has one `capacity_planning:manage` with two settings, making AC-012 and AC-013 jointly unsatisfiable | Rally gates the whole page on a **Planner** role set by a subscription/workspace admin: only Planners create/modify/publish/view drafts, and "a planner can publish or edit **anyone's** plans" | **AMEND SRS** — the invented code has a Rally precedent. Also **VERIFY** our gate against Planner semantics, particularly the edit-anyone's-plan part |
| P5-CP-11 | Unit fixed at creation; allocations need not sum to the estimate; advisory-only over-allocation; asymmetric Revert | SRS specifies all four | All four confirmed. Unit choice **renames the columns**. Worked example: 40 + 10 = **50**. Warnings never block. Unpublish does not undo field writes | **NO CHANGE** ×4 |
| P5-CP-12 | WSAPI object naming in the ERD | ERD may cite `UserIterationCapacity` | `UserIterationCapacity` is the **task-hours, per-person** model on the Team/Iteration Status pages — **not** the capacity-plan object. The plan family is `CapacityPlanProject`, `CapacityPlanItem`, `CapacityPlanAssignment`, with `WorkingCapacityPlan` vs `PublishedCapacityPlan` as **distinct types** (Rally snapshots on publish) | **AMEND SRS** if the ERD cites it here. The distinct working/published types independently validate our fixed-value-plus-source-label design |
| P5-CP-13 | Whether plan capacity is written to `Release.PlannedVelocity` | — | Rally deliberately does **not** reuse `PlannedVelocity` as plan capacity: plan capacity is "stored in this plan only, not globally" | **VERIFY FIRST** that we do not write through to the release. If we do, **FIX CODE** |

---

## 3. Phase 6 — Reports

| # | Gap | BA/SRS says | Rally does | Verdict |
|---|---|---|---|---|
| P6-R-1 | Reporting history model | Burndown frozen; "Unlike Burndown, Velocity is not frozen" | One rule for all charts: persist artifact history, recompute series at view time | **BA DECIDES** — see **D-3**. Recommend fixing the self-contradiction, not the storage layer |
| P6-R-2 | Ideal line: working days, frozen at iteration start | SRS example 4: changing Task Estimate after start does not change Ideal | "calculates the total amount of story or task work scheduled in the iteration, and divides that figure by the **total number of days**" — straight line, **total calendar days**, recomputed **present-tense from currently-scheduled work** | **FIX CODE.** Our SRS example 4 is the exact opposite of Rally. Recompute from current scope over total days; if the frozen baseline has value to us, keep it as a clearly-labelled second series, not as "Ideal" |
| P6-R-3 | Iteration Burndown units | SRS: dual unit | Blue bars = remaining task hours, green bars = completed story points, black line = ideal from task estimate. Dual axis | **NO CHANGE** — matches exactly |
| P6-R-4 | Velocity default window | SRS/our default | "all accepted plan estimate units for each of the last **10** completed iterations" | **FIX CODE** — set the default to 10 |
| P6-R-5 | Velocity segments and trend line | SRS: three mutually exclusive segments + trend | Three exclusive stacked segments — **dark green** accepted by last day, **light green** accepted since, **red** not accepted — plus dark green line = "proposed velocity, the average accepted points in the last 10 iterations". Uses accepted `PlanEstimate`, **not** `PlannedVelocity` | **NO CHANGE.** Our colours match too. Confirm we source from accepted PlanEstimate |
| P6-R-6 | Last3 / Best3 / Worst3 selectors | Ours | No Rally analogue | **AMEND SRS** — relabel as a deliberate non-Rally extension |
| P6-R-7 | Team Capacity report | SRS: one of the three report types | **No such Rally report** — absent from all six categories. Closest is the Team Status **page**: Capacity / Estimate / To Do, **no Actuals**, grouped member→project (we group team→member), capacity **editable** there | **BA DECIDES.** Recommend keeping it as an acknowledged extension, adopting Rally's measures (drop Actuals, add the utilization indicator), and relabelling in the SRS so nobody defends it as parity |
| P6-R-8 | Utilization indicator | Deliberately removed | It is the Team Status page's **defining feature**: "dividing the task estimate total by the individual's cumulative capacity across all of their projects", green ≤100% / red >100% | **FIX CODE.** Converges with audit §4.6: delete our fabricated `actualHours / estimateHours` bar and implement Rally's estimate-vs-capacity one. Note the meanings are inverted — Rally's red means *over-committed*, ours meant *mostly burned* |
| P6-R-9 | No scope line on any chart | Not specified | Rally ships **three** burnup charts whose sole documented purpose is "a scope line that allows you to visualize when work has been added or removed" | **BA DECIDES — recommend yes.** Biggest functional hole in Phase 6 after Team Capacity. Scope churn is the thing a burndown cannot show and the reason burnups exist |
| P6-R-10 | Report coverage | SRS: exactly three types | Six categories, ~19 named charts: Burndown/Burnup (6), Cumulative Flow (3), Throughput & Velocity (3), Defect Analysis (7), Build Health, Custom Reports | **NO CHANGE** to scope this phase; **AMEND SRS** to state that three is a deliberate subset, not a complete port |
| P6-R-11 | No export | Role-mapping §10 lists a role-gated "Export Report" | Rally saves reports as **PDF, JPG or CSV** from a control in the report preview's upper-right, plus CSV from most list pages. Rally gates **save/share** on admin — not export itself | **SPLIT.** Add CSV export (**FIX CODE**); drop the role gate (**AMEND SRS**) |
| P6-R-12 | `report:view` granted to `project_member` (§2.11 I-10) | SRS defers Reports RBAC and never rules on PM | No Rally permission level mentions reports; they follow project visibility, and Viewer = "Access to view the project and all work items within the project" | **AMEND SRS** — our grant is Rally-consistent. A separate "view reports" right would be the invention |
| P6-R-13 | No second project/team filter | SRS: deliberate | Rally's standard charts inherit the **global** project scope; per-widget override exists only on Dashboards | **NO CHANGE** |
| P6-R-14 | Platform limits | Not specified | **13 months** max date range, **200 projects** max | **FIX CODE** (small) — or at minimum record them, since exceeding them is how Rally itself degrades |
| P6-R-15 | Parent-project scoping | Our shared-timebox-key rule | Rally requires all child teams share the same iteration cadence for parent-project scoping to work | **NO CHANGE** — our rule maps to this |

---

## 4. Phase 6 — Release Tracking

**Two corrections first.** (a) An earlier research pass reported "Rally puts Release Tracking under Track" — **wrong.** Rally's instruction is verbatim "Select **Portfolio**, Release Tracking"; `Track` is the help-book chapter, not the menu. **Our nav already matches — do not move the page.** (b) Our three-bucket model is **not** a BA invention: `Features in Release` / `Derived Features` / `Unparented User Stories and Defects` are Rally's own labels, near-verbatim, with matching exclusivity, the same "explicitly assigned" rule, and the same asymmetry (percent for direct, bare count for derived). The BA got this one right with unusual fidelity.

| # | Gap | BA/SRS says | Rally does | Verdict |
|---|---|---|---|---|
| P6-RT-1 | Breakdown view built but not exposed | RT-AC-12 forbids showing it | Breakdown is Rally's **default** view: a team × iteration matrix with feature tiles, an `Unscheduled` column, `D` markers and drill-down | **BA DECIDES — recommend exposing it.** Suppressing it collapses the page's documented left/right architecture and is *why* we bolted on a `Team` column Rally does not have. Biggest Phase 6 decision |
| P6-RT-2 | Chart includes derived features | — | "Data for the derived features is **not** included" | **FIX CODE.** Our `TrackedLeaves` includes derived-causing children, so Planned and Accepted both read high. This is a numeric correctness bug, not a presentation choice |
| P6-RT-3 | `Ideal` = persisted 0→target baseline | SRS specifies the persisted baseline | Rally's `Ideal (Accepted Points)` is a **trend-based prediction** from recent acceptance activity, feeding a predicted completion date | **FIX CODE or rename.** Different artifact wearing the same label. Either implement the trend prediction or stop calling ours Ideal. Ties to **D-3** and P6-R-2 — same disease in three places |
| P6-RT-4 | Two ranked lists, no `D` marker | SRS §9 explicitly superseded both the merged list and the marker | Rally interleaves **one** ranked list with a `D` marker on derived rows | **AMEND SRS.** We superseded correct Rally behaviour. Reverting also removes the need for a separate list |
| P6-RT-5 | Column order buries Name 5th; sorts by Team | SRS ordering | Rally: `Rank, ID, Name, Status, Issues` — first three pinned, sortable by Name | **FIX CODE** |
| P6-RT-6 | One Issue type shipped | SRS | Rally has **three**: ours, plus `blocked` and unscheduled-predecessor. Also a **20-item cap** we lack | **FIX CODE.** `blocked` is cheap — it is just the flag |
| P6-RT-7 | Control labelled other than `Grid Unit` | SRS §9 renamed it | `Grid Unit` is Rally's actual control name | **AMEND SRS** — we kept the right behaviour and dropped the right label |
| P6-RT-8 | Release-level completion percentage on the detail page (§5.2) | SRS forbids it | **No release-level percentage anywhere in Rally.** Percent exists only per direct feature and per team-iteration cell. **Three** independent confirmations. Also: Rally ships **no Release Burndown** — only Release Burnup | **FIX CODE.** Delete the percent, the progress bar and the burndown table. Net deletion. Our `Phase 6/01_Release_Tracking` spec is partly baselined against a chart that does not exist — **AMEND SRS** to re-baseline on Burnup |
| P6-RT-9 | Bucket rule RT-BR-02 requires `releaseId != R` | SRS | Rally treats **release-assigned but out-of-scope-team** features as *derived*. Under our rule such features fail **both** tests and **vanish from the page entirely** | **VERIFY FIRST, then FIX CODE.** Highest-severity latent bug in Phase 6 — silent data loss on a tracking page. The agent's source page currently 404s, so confirm before changing |
| P6-RT-10 | No in-app explanation of the buckets (§6.6) | Mockup has an AlertCircle popover | Rally's labels are self-describing; our shortened names are not | **FIX CODE** (small). The classification is inherently non-obvious under our labels |
| P6-RT-11 | Milestones on this page | Not specified | Absent from all five Release Tracking topics | **NO CHANGE** — do not add |
| P6-RT-12 | Features-only, one-level rollup, Tasks excluded | SRS | Confirmed on all three | **NO CHANGE** |

---

## 5. Corrections owed to the main audit document

Fold these into `2026-08-04_FULL_STACK_GAP_AUDIT.md` §0.5 so the two documents do not disagree.

1. **§5.12 inline Estimated edit** — misdirected. The Team row is already correct; the divergence is on the allocation child row. As written, the finding would have caused a parity-breaking "fix".
2. **§5.12 four undeclared verbs** — inverted. Rally documents all four (plus three more). The SRS is wrong.
3. **§6.8 capacity tail column order** — resolved in our favour. `Rollup → Estimated → Complete` is Rally's order; the mockup is wrong.
4. **§3.6 refined estimate `NOT NULL DEFAULT 0`** — the "declared divergence, leave as-is" verdict does not survive Rally. Now **FIX CODE**.
5. **§3.6 `planned_start_date`** — resolved in favour of the DB. The SRS's free-text line is unsourced.
6. **§5.18 portfolio rank drag** — settled. Third confirmation; amend the SRS.
7. **§9 verified-matching list** — three entries must move out: the "persisted Ideal baseline", the Release Tracking `Ideal`, and Release Tracking's exclusion of the Breakdown view. All three match the *spec* and diverge from *Rally*.
8. **Release Tracking nav placement** — retract. Rally says Portfolio; we already match. (My earlier report of a divergence here was wrong.)
9. **`portfolio_item_state` / `preliminary_estimate_size`** — new structural findings, not in the audit at all. See D-1, D-2.

---

## 6. Verify on a live Rally tenant before coding

Phase-5/6-specific additions to the audit's §0.5.6 list.

1. **P6-RT-9** — does Rally really classify release-assigned-but-out-of-scope-team features as derived? Decides whether we are silently dropping rows from a tracking page. **Do this one first.**
2. **P5-CP-13** — does a capacity plan ever write through to `Release.PlannedVelocity`?
3. **P5-CP-3** — is the *allocation row* amount editable inline in Rally, or dialog-only?
4. **P5-CP-10** — Planner-role semantics, especially "can edit anyone's plans".
5. **P6-R-2** — does the stock Iteration Burndown x-axis drop weekends? (Rally is internally inconsistent: the ideal uses total days, capacity math uses working days.)
6. Rally's velocity attribution for items moved into or out of a **completed** iteration. Decides the D-3 tie-breaker.
7. **P5-PI-4** — does Rally's Refined Work Item Count include defects as well as stories?
8. Whether deleting a Feature hard-deletes or unparents its stories — Broadcom's cascade rule and its remove-is-unparent rule point opposite ways and are never reconciled.

---

## 7. Execution plan (as ruled 2026-08-04)

Revised for the four decisions in §0-A. D-1/D-2 migrations are **out of scope**; the schema-shape gap is documented instead. Every code change below carries the `RALLY PARITY` comment block from §0-A and a §8 ledger row.

**Step 0 — verify, before any code.** Two items where building on the wrong answer is expensive:
- **P6-RT-9** — does Rally classify release-assigned-but-out-of-scope-team features as derived? Under our RT-BR-02 those features currently **vanish from the page**. Silent row loss on a tracking page outranks everything else in this plan.
- **The Preliminary Estimate map conflict** (§0-B) — resolve `enums.ts:471-472` against the Rally admin page before touching `DEFAULT_PRELIMINARY_ESTIMATE_MAP`.

**Step 1 — net deletions.** Cheapest, all authorised, all reduce surface:
- P6-RT-8 — delete the Release Tracking completion percent, progress bar and burndown table (three independent confirmations that Rally has no release-level percentage, and no Release Burndown at all)
- P5-PI-13 — retire the Portfolio KPI strip, or convert to `Group By` aggregates
- P5-CP-1 — delete the false "Rally names the capacity screen Release Planning" comment
- P6-R-8 — delete our fabricated `actualHours / estimateHours` Team Status bar

**Step 2 — numeric correctness.** Wrong-number bugs outrank layout:
- P6-RT-2 — exclude derived features from the chart ("Data for the derived features is not included"); our `TrackedLeaves` currently inflates Planned and Accepted
- P6-R-2 — recompute Ideal from current scope over **total calendar days**; if the frozen baseline still has value, keep it as a second labelled series, not as "Ideal"
- P6-RT-3 — stop calling the Release Tracking baseline `Ideal`, or implement Rally's trend-based prediction
- P6-R-4 — velocity default window → 10 completed iterations
- P6-R-8 (second half) — implement Rally's utilization formula: `taskEstimateTotal ÷ member capacity`, green ≤100% / red >100%. Note the meaning inverts — Rally's red is *over-committed*
- P5-PI-3 — make `refined_estimate` and `refined_work_item_count_estimate` nullable, falling back to Preliminary. Reverses the `0079` declared divergence
- P5-PI-6 (Team half) — drop the Epic Team CHECK; Rally marks `Project` required with no level qualification

**Step 3 — D-3, one history rule.** Attribute velocity by iteration membership *as at iteration end*, matching Burndown's frozen semantics. No new infrastructure. Then record the snapshot-table scaling cost in the SRS as an accepted trade-off.

**Step 4 — expose Breakdown (P6-RT-1).** Team × iteration matrix with feature tiles, `Unscheduled` column, drill-down. Already built. Amend RT-AC-12. Once exposed, re-evaluate the `Team` column we added only because Breakdown was hidden.

**Step 5 — small parity fixes.** P5-PI-16 (portfolio `workspace:view` → `portfolio:view`), P5-CP-5 (Add Features picker columns), P5-CP-7 (block publish on an empty plan), P6-RT-5 (column order `Rank, ID, Name, Status, Issues`), P6-RT-6 (add the `blocked` Issue type + 20-item cap), P6-RT-10 (bucket explanation popover), P5-PI-18 (pin Rank/ID/Name first), P6-R-14 (13-month / 200-project limits).

**Step 6 — build-outs.** P5-PI-8 (children expansion, **no ≤5 cap**), P6-R-11 (CSV export, no role gate), P5-PI-11 (Rank Highest / Rank Lowest / Move to Position + the rank-ascending drag guard).

**Step 7 — remaining BA decisions.** P6-R-9 (scope line — recommend yes), P5-PI-9 (progress hover callouts incl. Missing Estimates), P5-PI-7 (archive gate), P5-CP-4 (block deleting a published plan), P5-CP-8 (missing columns/tabs — `+/-` republish diff first), P5-PI-15 (record that our Epic = Rally's Initiative level).

**Step 8 — doc pass.** The 11 AMEND SRS rows, §5's nine corrections to the main audit, the two deferred schema-shape divergences from §0-B, and the §8 ledger review with the BA.

**Net effect on surface area:** deletes more UI than it adds — a release progress bar, a burndown table, two KPI strips, one fabricated metric, one false comment — while adding one chart series, one export, a Breakdown view that already exists, and roughly six columns.

---

## 8. Divergence ledger — Rally-driven changes away from BA design

**Fill one row per change as it lands.** This is the BA's review surface: it answers "what did we change away from my spec, on whose authority, and where can I see it". Do not reconstruct it after the fact.

Every row must correspond to a `RALLY PARITY (differs from BA design)` comment in the code, per §0-A.

| Row id | What changed | BA spec said | Rally does (source) | Files | Commit | BA reviewed |
|---|---|---|---|---|---|---|
| `P5-CP-1` | Replaced the comment claiming "Rally names the capacity screen Release Planning" with the corrected mapping | n/a — a factual error in our own note, not a spec position | Rally has **both** pages and they are different products: Capacity Planning (Portfolio; plan object, draft/published, per-team allocations) and Release Planning (Planning; a drag board, no plan object). [create-a-capacity-plan](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page/creating-a-capacity-plan/create-a-capacity-plan.html) | `apps/web/src/widgets/app-shell/app-shell.tsx` | `96a6e1a5` | pending |
| `0-B` | Rewrote the Preliminary Estimate map citation. **Values unchanged.** | BA table XS 1 / S 3 / M 5 / L 8 / XL 13, flagged "temporary mockup data" (`Phase 5/01:170-177`) | Rally ships XS 13 / S 20 / M 40 / L 100 / XL 250, unitless, one number per size — and makes it a per-workspace admin setting, so any seed value is legal. The old comment cited KB 94797 (undated, retired Plan Progression page, worked example) as proof of parity | `db/schema/enums.ts` | `96a6e1a5` | pending |
| `P5-PI-16` | `GET /portfolio-items` — removed `@RequirePermission('workspace:view')`; authorization now resolve-then-check in the service. Route-policy ratchet baseline 44 → 45 with a documented exception | P5-PI-FR-017 grants Project Member read access — which the guard was preventing | Access to an artifact follows from permission on its **project**, not a per-artifact grant | `libs/modules/portfolio/src/interface/http/portfolio-items.controller.ts`, `test/route-policy.ratchet.spec.ts` | `78b6dc79` | pending |
| `P5-CP-5` | `Add Features` picker rows now carry a trailing line naming the team(s) that currently hold an allocation and the committed amount. Added an optional `meta` slot to the shared `SelectionModal` | Capacity SRS §225-233 asks for ID / Name / Project / Team / Allocation; we shipped key + name only, and this file's docblock argued that was sufficient | Rally's `Add Items` dialog carries Planned Project Assignment, Project and the numerics beside ID and Name | `apps/web/src/shared/ui/selection-modal.tsx`, `apps/web/src/pages/capacity-planning/ui/add-features-modal.tsx`, `apps/web/src/shared/i18n/locales/en/capacity.json` | `821e6465` | pending |
| `P6-R-4` | Velocity report now opens on the **last 10** completed iterations. Both windows stay selectable | Velocity SRS §6: default Last 5 | "all accepted plan estimate units for each of the last **10** completed iterations", trend = "the average accepted points in the last 10 iterations" | `libs/modules/reporting/src/domain/velocity.ts`, `.../dto/reporting-request.dto.ts`, `apps/web/src/features/reporting/api.ts`, `apps/web/src/pages/reports/ui/velocity-report.tsx` | `72f3aea6` | pending |

| `P6-RT-10` | Each Release Tracking bucket tile now carries Rally's own definition on hover | Mockup had an AlertCircle popover; the build dropped it, leaving explanations only in the three EMPTY states | Labels and taxonomy are Rally's near-verbatim, incl. the percent-for-direct / bare-count-for-derived asymmetry | `apps/web/src/pages/release-tracking/release-tracking-page.tsx`, `.../locales/en/release-tracking.json` | `0198cf2a` | pending |
| `P6-RT-5` | Release Tracking grid is now sortable by `Name` | §246 does not name Name as a sort key; the grid sorted Rank / ID / Team | Rally sorts its three pinned columns — "You can reorder columns (except for Rank, ID, and Name)" | `apps/web/src/pages/release-tracking/ui/tracking-grid.tsx` | `ed3e6cef` | pending |

### Rows WITHDRAWN on inspection — do not action

Four matrix rows did not survive contact with the code. All four failed the same way: a research agent read Rally's docs without reading the reasoning already recorded at the code site. Recorded so they are not re-opened.

| Row | Original verdict | Why withdrawn |
|---|---|---|
| `P5-PI-3` | FIX CODE — make refined estimates nullable | `0079_refined_estimate_zero_default.sql` reversed `0071` deliberately, citing **observed product behaviour**: "real Rally shows these fields as 0 rather than blank, and lets a planner type 0. Broadcom documents no rule either way, so the observed product wins." The research counter is only the *absence* of a Required marking, and it labels raw WSAPI nullability `[NO SOURCE]`. Observed product beats doc-absence inference. Reverting is also **information-destroying** — 0 → NULL cannot distinguish "planner typed 0" from "never forecast". → live-tenant verification instead |
| `P5-PI-6` | FIX CODE — drop the Epic Team CHECK | Model mismatch. The finding rests on Rally marking `Project` required "with no level qualification" — but **in Rally, project == team**, which is why our own iteration model is project-required/team-optional. Our `portfolio_items.project_id` already satisfies that requirement; Rally's rule says nothing about our separate `team_id`. CHECK stands |
| `P5-CP-7` | FIX CODE — block publish on an empty plan | **Already implemented**, with a sharper rule than the matrix stated: `capacity-plans.service.ts:456-465` blocks only when never-published AND no items AND no projects, because "a plan that has been published before may be re-published even when empty — that is how a planner undoes an over-eager clear-out." Both publish variants exist too (`options.updateFields`) |
| `P5-PI-13` | FIX CODE — retire the Portfolio KPI strip | **Already gone.** `portfolio-page.tsx:130`: "`total` is deliberately unused: the BA removed the summary metrics strip that read it". The finding came from `rally-09-portfolio.png`, a stale clone screenshot |

### Verified NO CHANGE on inspection — 2026-08-05

Checked in code, no tenant needed. All three were carried as FIX CODE and none needed one.

| Row | Was | Verified |
|---|---|---|
| `P5-CP-13` | verify plan capacity is not written to `Release.PlannedVelocity` | **Clean.** The capacity module only ever SELECTs from `releases` (dates, name, id — `capacity-plan.drizzle-repository.ts:523,767`, `capacity-plans.service.ts:1741`). The sole write to `plannedVelocity` is `release.drizzle-repository.ts:84`, driven by release edits. Plan capacity stays "stored in this plan only, not globally", matching Rally |
| `P5-PI-14` | FIX CODE if we ship a portfolio hierarchy tree | **No tree exists.** `portfolio-page.tsx:5-6` records that a client-side `parentId` tree was REMOVED at migration 0072. What ships is a flat list with expandable child rows — Rally's model plus Rally's documented expandable-rows idiom. The audit's "our tree is an invention" mistook the disclosure for a tree |
| `P5-PI-18` | FIX CODE — pin `Rank, ID, Name` first | **Already pinned.** `ID` and `Name` carry `locked: true` on all three portfolio grids (`columns.ts:69,75`; `children-columns.ts:40,50,98,101`), and Rank is structural — rendered by `RankCell` outside the column list, so it cannot be reordered or hidden |

### Re-sized on inspection

| Row | Was | Actually |
|---|---|---|
| `P6-RT-5` (order half) | "Name buried 5th" | **Already correct.** The code puts Name 3rd, matching Rally — `tracking-grid.tsx:143-166` and its own docblock ("Rank, ID, NAME, Team, Issue, Status"). The 5th position was the **SRS's** order, not the code's; the research compared Rally against the spec and the audit transcribed it as the implementation. Only the sort key was genuinely missing, and that shipped as `ed3e6cef`. The extra `Team` column and `Issue`-before-`Status` remain, both pending `P6-RT-1` |
| `P6-RT-1` | "already built — expose it" | **NOT BUILT.** No Breakdown component and no backend endpoint exist for Release Tracking. `release-tracking-page.tsx:9-11` states it: "Breakdown is not in the approved slice at all." Every `Breakdown` in the repo belongs to **Capacity Planning** or Portfolio; Release Tracking only references Capacity Planning's. The audit's "Breakdown correctly not exposed" was read as "exists but hidden". Exposing it is a from-scratch feature: backend team x iteration aggregation with feature tiles, an `Unscheduled` column, `D` markers, drill-down, plus the pane. **Largest remaining Phase 6 item.** The ruling to expose it stands; the sizing does not |
| `P6-RT-6` | "small — `blocked` is just the flag" | **Medium slice.** Two blockers: SRS §5 states "the approved type in this slice is `Release mismatch`; adding other issue types requires a separate BA rule", so this is a deferred feature addition rather than a divergence fix. And Rally's 20-item cap is "in order of **oldest to newest**" — our `ReleaseChild` carries no creation date, so capping without one returns an arbitrary 20, which is worse than uncapped. Needs `createdAt` threaded through the repository first |

### Reverse ledger — deliberate divergences *from* Rally

Tracked separately so the two are never confused. These need `DELIBERATE DIVERGENCE FROM RALLY` comments.

| Row id | What we do | Rally does | Why we differ | Decided |
|---|---|---|---|---|
| P5-PI-7 | Block Epic archive when it has children | Unguarded `Archived` checkbox; delete cascades to children | Rally has no Recycle Bin entry for portfolio items, so silent orphaning is unrecoverable | pending BA |
| P5-PI-15 | Type names Epic / Feature | `Strategy / Theme / Initiative / Feature`; Broadcom's own Epic rename targets **Feature**, the opposite level | Renaming is Rally-sanctioned; our Epic sits at Rally's *Initiative* level | 2026-08-04 |
| P5-CP-9 | `CompositeBar` collapses Rollup / Estimated / Complete | Three separate columns | Density; conscious deviation | 2026-08-04 |
| D-1 | `portfolio_item_state` is a fixed 11-value enum | Admin-editable per-type object, ≤20 values, each with Rank / WIP Limit / Description / Enabled | Schema change deferred (§0-A). Our 11 values are a *legal* Rally configuration; the gap is shape and scoping, not values | 2026-08-04 |
| D-2 | `preliminary_estimate_size` enum + separate settings map | One editable object carrying name **and** numeric value | Schema change deferred (§0-A). Labels already match; only the numeric defaults are in question (§0-B) | 2026-08-04 |
| D-3 | Persist computed chart points, nightly job | Persist artifact history, recompute series at view time (Lookback) | Outcome already matches; bitemporal rebuild is a platform project, not a Phase 6 fix. Scaling cost accepted | 2026-08-04 |
| P6-R-6 | Last3 / Best3 / Worst3 velocity selectors | No analogue | Product extension | 2026-08-04 |
| P6-R-7 | Team Capacity as a *report* | No such report; closest is the Team Status page | Product extension; measures to follow Rally's (drop Actuals, add utilization) | 2026-08-04 |
| P6-R-10 | Three report types only | Six categories, ~19 charts | Deliberate subset, not a complete port | 2026-08-04 |
