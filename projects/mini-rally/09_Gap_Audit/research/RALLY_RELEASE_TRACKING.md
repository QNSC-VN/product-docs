# Rally Release Tracking — Ground Truth vs. Phase 6 Clone

**Researched** 2026-08-04 · **Product** Broadcom Rally Software (ValueOps Rally, ex-CA Agile Central)
**Clone contract under audit** `04_Developement_tracking/Phase 6/01_Release_Tracking/SRS.md` (2026-07-31, "BA/MOCKUP APPROVED", 174 audited checkpoints)

**Evidence labels:** `[DOCUMENTED]` = Rally help/KB page text · `[API-SCHEMA]` = WSAPI/field reference · `[COMMUNITY]` = forum/GitHub · `[NO SOURCE]` = not found.

**Search-hazard note:** `help.rallyuxr.com` and `rally.com` were excluded from all queries. Nothing below is sourced from either.

**Retrievability caveat.** Rally's docs contain a *second*, newer subtree — `.../release-tracking-page/release-tracking-for-rally-saas/{track-features-and-work,view-overall-release-status,view-the-release-burnup-chart}.html`. These URLs are live in Broadcom's search index and returned substantive quoted text through search, but **all three currently return HTTP 404 on direct fetch** (recent doc restructure). Where a claim rests only on those pages it is labelled `[DOCUMENTED — index-only]` and its confidence is reduced. Every high-stakes claim below is additionally corroborated from a page that fetches cleanly.

---

## Headline

Two of this audit's working assumptions were wrong, and they were wrong in *opposite* directions:

1. **The parallel researcher's "Rally puts Release Tracking under Track" is incorrect.** Rally's in-app menu path is literally **`Portfolio > Release Tracking`**. Our clone matches Rally exactly. `Track` is the *documentation chapter* name, not the menu.
2. **Our three-bucket model is NOT a BA invention.** `Direct` / `Derived` / `Unparented` are Rally's own concepts, and two of the three names are near-verbatim Rally strings. The BA got the model right.

But the *presentation* of those buckets diverges hard: Rally shows one merged, rank-ordered list with a `D` rank marker for derived rows; our SRS explicitly forbids both. And our chart's `Ideal` line is a genuine invention — Rally's identically-named line is a trend projection, not a planned baseline.

---

## 1. Nav location and purpose

**Rally does X.** Rally's step-by-step instruction for opening the page is, verbatim: **"Select Portfolio, Release Tracking."** [[View the Release Tracking Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/release-tracking-page/view-the-release-tracking-page.html)] — `[DOCUMENTED]`. The ValueOps capability page independently states the location as **"Portfolio > Release Tracking"** [[Rally Release Tracking capability](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/valueops-solution/ValueOps-Solution/n-valueops-capabilities/n-release-tracking-capability.html)] — `[DOCUMENTED]`. Two independent pages agree.

The `.../rally-help/tracking/release-tracking-page.html` URL and the `Home > Rally > Tracking > Release Tracking Page` breadcrumb describe the **help-book chapter** ("Tracking"), not the product menu. Rally's help tree groups Release Tracking, Iteration Status and Timeline under a *Tracking* chapter while those pages live in different app menus. The parallel researcher read the breadcrumb as nav.

**Purpose.** "Use the Release Tracking page in Rally to track the status of teams and features in a common release... compare the features that are planned into a release against the current status of the work for the release and **identify issues and dependencies**." Audience: "Program managers, product owners, engineering leads." Layout: features on the **left**, "a matrix of teams and iterations" on the **right**. [[Release Tracking Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/release-tracking-page.html)] — `[DOCUMENTED]`

The problem it solves, per the capability page: "progress visualization that is based on aggregated delivery team data... near real-time status... tracking progress across intricate digital transformation initiatives." `[DOCUMENTED]`

**Verdict: MATCHES.** SRS §0/§5 places the page at `Portfolio > Release Tracking` as the final Portfolio item. Rally agrees on the menu. Purpose also matches (multi-team release status roll-up).

One sub-divergence: Rally's stated purpose is *"identify issues **and dependencies**"* — dependencies are half the page's reason to exist. Our SRS §10 defers all dependency analysis to `FB-P6-001`, so we ship the page without one of its two documented jobs.

---

## 2. Bucket classification — **THE PRIORITY QUESTION**

**Rally does X, and it uses our vocabulary.** The Features List page defines exactly three categories, with a filter drop-down to narrow to each:

| Rally's term | Rally's definition (quoted) |
|---|---|
| **Features in Release** | "The number of features currently in the selected release and within the current project scope." |
| **Derived Features** | "The number of features that are **not** associated with the selected release but have at least one child user story or defect that is within the current project scope and **explicitly assigned** to the selected release." |
| **Unparented User Stories and Defects** | "The number of user stories and defects that are **explicitly in the release** but that are **not parented to a feature**." |

[[Release Tracking Features List](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/release-tracking-page/release-tracking-features-list.html)] — `[DOCUMENTED]`

Rally also uses "**direct features**" as the contrasting term for the first bucket: "Direct features display a percentage complete value in the status indicator, as the **entire feature** is planned into the release. Derived features display a **count** of completed versus planned work items, as **only some of the work** from the feature is planned into the current release and project scope." [[View Overall Release Status](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/release-tracking-page/release-tracking-for-rally-saas/view-overall-release-status.html)] — `[DOCUMENTED — index-only]`, corroborated verbatim-equivalent on the Features List page above. The capability page likewise enumerates "Direct features / Derived features / Unparented stories-defects" as the three tracked item classes — `[DOCUMENTED]`.

**Verdict: MATCHES — decisively. This is not a BA invention.** SRS §3 RT-BR-01/02/04 reproduce Rally's three categories, Rally's exact bucket labels ("Features in Release", "Derived Features", "Unparented User Stories and Defects"), Rally's mutual-exclusivity-by-`releaseId`, Rally's "explicitly assigned" requirement (our RT-BR-03: a child with no release does not make its parent derived), *and* Rally's asymmetric status rendering (percent for direct, bare count for derived — SRS §3 RT-BR-05, "The Derived cell displays `accepted/total` only; it does not display a percentage"). The BA either had access to this page or reconstructed it with unusual fidelity. **No SRS change is needed for the model itself.**

**Three real divergences inside the matching model:**

**2a — Rally has a *fourth* path into "Derived" that we drop entirely.** "Additionally, **features assigned to the release, but not to the scoped project team or teams, also display as derived features**." [[Track Features and Work](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/release-tracking-page/release-tracking-for-rally-saas/track-features-and-work.html)] — `[DOCUMENTED — index-only]`. Our RT-BR-02 gates derived on `Feature.releaseId != R`, so a feature that *is* on release `R` but is owned outside scope `S` fails RT-BR-01 (scope test) *and* RT-BR-02 (release test) and **vanishes from the page**. In Rally it appears as derived. This also means Rally's exclusivity is not purely `releaseId`-based the way SRS §3 asserts. **This is the one substantive correctness gap in our classification.**

**2b — Rally does not separate the buckets into distinct lists; we do.** "**Rank is determined by the position of any work item in the release, so you may see some derived features, identified with a rank of `D`, listed among numerically ranked features.** The ranking system's process first ranks all items (direct and derived) in the list, and then re-numbers direct features to show a sequential rank order." `[DOCUMENTED — index-only]`, corroborated by the capability page ("Derived features... marked with rank 'D'") and by the Breakdown page (feature tiles carry a "'D' designation for derived features") — both `[DOCUMENTED]`, fetch cleanly. The Features List page confirms the filter is *optional* narrowing: "The drop-down above the list of features lets you filter the list of the features to the same categories." `[DOCUMENTED]`

Our SRS §5 does the opposite on both counts, and does so *deliberately*: "The list filter displays one bucket at a time... Direct, Derived and Unparented rows are **not** mixed into one default list," and §9 "The earlier Derived `D` rank marker is **superseded**: Derived rows use numeric sequential rank in their own bucket." **We superseded the correct Rally behaviour.** The `D` marker exists precisely because Rally *does* interleave; once you force one-bucket-at-a-time the marker becomes redundant — so our two changes are internally consistent but jointly non-Rally.

**2c — Ambiguity in Rally's "Features in Release" count (flagged, low confidence).** One fetch of the Features List page rendered the definition as "features currently in the selected release and within the current project scope **plus those outside scope if containing child stories/defects within scope**"; a second fetch of the same page rendered only the first clause. This may be summarizer drift across the direct/derived boundary. Treat as **unresolved** — do not act on it. `[NO SOURCE]` for the extended reading.

---

## 3. Chart

**Rally does X.** The Chart view is a **burn-up** (never a burndown, no progress bar). Four labelled series:

| Series | Rally's definition (quoted) |
|---|---|
| **Preliminary Estimate** | "Sum of the numeric preliminary estimate for all features in the list. This label indicates the high-level scope of the release." |
| **Planned Points/Count** | "Sum of plan estimate values of stories and defects in features in the list, **plus unparented user stories and defects**." |
| **Accepted Points/Count** | "Sum of plan estimate values of stories and defects whose schedule state is accepted. The stories and defects must be scoped to a release **or associated with a feature that is scoped to the release**." |
| **Ideal (Accepted Points)** | see Q4 |

Plus **Prediction (Planned Points)** and **Prediction (Accepted Points)** lines. Legend items toggle on/off; hovering reveals detail; selecting features in the Features List filters the burnup. [[Release Tracking Chart](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/release-tracking-page/release-tracking-chart.html)] — `[DOCUMENTED]`

**Unit selector.** Rally has exactly one, called **`GRID UNIT`**, in the upper-right, with exactly two values: **"whether you want to view the data on this page by user story points (`Points`) or user story count (`Count`)"** — and it governs the whole page: "The values in feature blocks and status indicators will update to reflect your choice," and the Status column's "display of user story points or count [is] determined by the selection in the Grid Unit field." [[View the Release Tracking Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/release-tracking-page/view-the-release-tracking-page.html), [Features List](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/release-tracking-page/release-tracking-features-list.html)] — `[DOCUMENTED]`

**There is no hours option.** Hours are Rally's *task* unit (Task Estimate / To Do) and are documented as belonging to iteration-level daily tracking, never to Release Tracking. [[What is an Estimate?](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/building-your-backlog/sizing-and-estimates-overview/size-and-estimate-for-your-team/what-is-an-estimate.html)] — `[DOCUMENTED, by absence in the Release Tracking unit enumeration]`

**Verdict: MATCHES on substance, DIVERGES on naming and scope.**
- Burnup, not burndown, and one shared unit selector driving both grid and chart: **MATCHES** (SRS §9 "The earlier separate `Grid Unit` control is superseded: `Chart Unit` controls both list and chart" arrives at Rally's actual single-control behaviour).
- `Points` / `Count` only, no hours: **MATCHES**.
- **Control name DIVERGES.** Rally's control is `GRID UNIT`. Our SRS mandates the label `Chart Unit` and §9 records deleting the name `Grid Unit`. We kept Rally's semantics and threw away Rally's label — the opposite of what a clone wants.
- Series set **partially DIVERGES**: SRS §5 lists four lines (Accepted, Planned, Preliminary Estimate, Ideal). Rally has those four *plus* `Prediction (Planned Points)` and `Prediction (Accepted Points)`. We are missing the two prediction lines.
- Y-axis labels `Work Items Total Points` / `Work Items Total Count` and the secondary iteration-name row beneath the X axis (SRS §4 RT-BR-09): **NO SOURCE** — the chart page documents no axis labels. Treat as BA styling, not Rally-verified.

---

## 4. Ideal / baseline line — **our clone inverts Rally's meaning**

**Rally does X.** Rally's `Ideal (Accepted Points)` is, verbatim: **"Using recent activity as a trend, provides an estimated (predicted) rate of acceptance. Where the Prediction (Planned Points) and Prediction (Accepted Points) lines intersect is the predicted completion date."** [[Release Tracking Chart](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/release-tracking-page/release-tracking-chart.html)] — `[DOCUMENTED]`

So in Rally this line is:
- **backward-looking and recomputed** — derived from *recent observed acceptance activity*;
- **not** a plan: there is no `PlannedVelocity × iterations` term, no "PlanEstimate at release start" term, and no persisted baseline anywhere in the definition;
- **forward-projecting** — its job is to produce a *predicted completion date* via line intersection.

Rally's separate, generic release *Ideal Lines* feature (a different surface, under Reports) does describe "the ideal rate of completing work during the course of the release" — that is the classic 0→total ramp, and it is **not** what the Release Tracking chart's `Ideal (Accepted Points)` is. [[Burnup and Burndown Charts in Rally](https://academy.broadcom.com/blog/valueops/burnup-burndown-charts-in-rally)] — `[COMMUNITY]` (Broadcom Academy blog; useful for the contrast, not authoritative for Release Tracking).

**Persistence.** Rally's Release Tracking burnup is computed from **Lookback/snapshot data**, not from a saved baseline row: the known-limitation text is "There is a known limitation with the milestone burnup and release tracking charts with large amounts of data. Burnup charts display **'An error occurred while fetching snapshots for specified portfolio items.'**" [[How to Troubleshoot Chart-Related Issues](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reporting/rally-reports-and-charts/how-to-troubleshoot-chart-related-issues.html)] — `[DOCUMENTED]`. `[NO SOURCE]` for any persisted release baseline object in Rally.

**Verdict: DIVERGES — our `Ideal` is an INVENTION under a borrowed name.** SRS §4 RT-BR-09 specifies `Ideal(d) = ideal accepted trajectory from 0 at Release start to the approved Release target at Release end`, and §6 requires a **"Persisted Release ideal baseline"** entity for a "Stable Ideal trajectory", with an explicit prohibition: "DEV must not silently use today's mutable Planned value to reconstruct an old ideal line."

That is a defensible piece of engineering — arguably *better* than Rally's, and the BA's reasoning about baseline mutability is sound. But it is a different artifact with the same label, and it commits us to a persistence concept Rally does not have. Meanwhile Rally's actual behaviour (trend-based projection + intersection → predicted completion date) is **absent from our build**, and it is the feature that makes the chart decision-useful.

Two corroborations for the BA on adjacent points: our snapshot/event-history requirement (RT-BR-09) matches Rally's snapshot-backed implementation, and our RT-BR-08 `Preliminary Estimate` definition ("sum of the top-down Feature estimate") matches Rally's ("Sum of the numeric preliminary estimate for all features in the list") — **MATCHES**.

---

## 5. Issues / risk overlay

**Rally does X.** The Features List carries an **`Issues` column** rendered as an icon; the icon "displays if there are problems with the feature, user story, or defect," and selecting it opens a pop-up. Rally documents exactly **three** issue types:

1. **blocked user stories or defects**;
2. **release mismatch** — "one or more user stories/defects have a release assignment that does not match the parent feature";
3. **unscheduled predecessor** — "a user story/defect is dependent on another through a predecessor relationship but the predecessor is **not scheduled into an earlier iteration**".

The pop-up "is limited to displaying **20 items** in order of oldest to newest... If there are more than 20 issues, those beyond the limit are not displayed until the older issues are resolved," and it shows "planned dates, story points accepted, teams involved, and issue descriptions." [[Release Tracking Features List](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/release-tracking-page/release-tracking-features-list.html)] — `[DOCUMENTED]`. Capability page corroborates: "Exclamation icons surface issues; pop-ups display completion percentages, story/defect counts, planned dates, accepted story points, development team assignments, blocking issues and dependencies." — `[DOCUMENTED]`

Rally has **no "risk" concept** on this page. There is no risk object, no risk severity, no RAID overlay. `[NO SOURCE]` for risks.

**Verdict: PARTIALLY MATCHES.** SRS §5 gets the shape right — icon in the list, click opens an overlay panel, panel grouped by issue type, panel shows "Feature planned dates, Teams involved, total-point progress, Story progress and Defect progress", and "`% Done` and Issues are independent." All four correspond to documented Rally behaviour. Rally also has no risks, and neither do we.

Divergences:
- **We implement 1 of Rally's 3 issue types.** SRS §5: "The approved type in this slice is `Release mismatch`; adding other issue types requires a separate BA rule." **Blocked items** and **unscheduled predecessor** are missing. Blocked is the cheap one — it needs no dependency engine, only the `Blocked` flag on story/defect — and it is the type most users look for.
- **The 20-item cap, oldest-to-newest, is not in our SRS.** `NO RALLY-MATCHING RULE IN OUR SPEC` — an unbounded panel will diverge on large features.
- **Two BA additions with no Rally source:** the "full-mismatch warning" when every release-assigned child mismatches (SRS §5, RT-AC-11), and outside-click-to-close (RT-AC-10). Both harmless; both `[NO SOURCE]`.

---

## 6. Grid columns

**Rally does X.** Documented Features List columns: **`Rank`, `ID`, `Name`, `Status`, `Issues`**.
- `ID` — "Hover over the ID of an item to see a brief summary."
- `Status` — "shows the total user story points or count in each feature and the points/count that are complete."
- `Issues` — icon column.
- `Rank` — "The list is sorted in **rank order ascending by default**"; derived rows show `D` instead of a number.
- `Name` — present via "You can also sort the list by **Rank, ID, or Name** in either ascending or descending order," and via search "by ID/name."

[[Release Tracking Features List](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/release-tracking-page/release-tracking-features-list.html)] — `[DOCUMENTED]`

Column mechanics: "You can reorder columns (**except for Rank, ID, and Name**) by dragging and dropping the column header" — i.e. Rank/ID/Name are pinned leftmost in that order, and Status/Issues are the movable ones. [[Customizing How a List Displays](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/customizing-pages-and-views/customizing-how-a-list-displays.html)] — `[DOCUMENTED]`

**There is no `Team` column on the Features List.** Team lives on the *right* pane — "Teams display as rows in the Iterations grid" — which is the whole left/right split of the page. `[DOCUMENTED, by absence in the Features List column enumeration + presence in the Breakdown]`

**Verdict: DIVERGES on three points.** SRS §5 specifies `Rank, ID, Team, Issue, Name, Status`.

| | Rally | Ours |
|---|---|---|
| Order | Rank, ID, Name, Status, Issues | Rank, ID, **Team**, **Issue**, Name, Status |
| `Team` column | absent (teams are the right-pane rows) | present, 3rd |
| Sortable by | Rank, ID, **Name** | Rank, ID, **Team** |
| Reorderable | all except Rank/ID/Name | all ("horizontally resizable" per SRS; reorder unspecified) |

1. **`Team` is an addition.** Defensible *because* we suppressed the Breakdown (Q7) — with the team matrix gone, team affiliation has nowhere else to live, so the column is compensating for the missing view. Note our `Team` semantics are themselves a BA invention: "Team column shows Feature Team for Direct, **the scoped child Team(s) that caused inclusion for Derived**, and the item Team for Unparented." That per-bucket polymorphism has `[NO SOURCE]`.
2. **`Name` is pushed to 5th, behind Team and Issue.** Rally pins Name 3rd and forbids moving it. Our order buries the human-readable identifier behind two narrow columns.
3. **We sort by `Team` and not by `Name`.** Rally sorts Rank/ID/Name. We swapped the one Rally sort key that isn't an identifier for a column Rally doesn't have.

---

## 7. Breakdown view — **Rally's default; we hide it**

**Rally does X.** Breakdown is a real view and it is the **default**: "Select one of the following views for the right side of the page: **Breakdown (default view)**, Dependencies, or Chart." [[View the Release Tracking Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/release-tracking-page/view-the-release-tracking-page.html)] — `[DOCUMENTED]`

It is a **team × iteration matrix**, not a portfolio-item breakdown:
- **Columns = iterations.** "Each iteration within the boundaries for the selected release displays as a column in the Release Breakdown," with iteration titles, dates and current-iteration highlighting. Plus an **`Unscheduled` column**: "Unscheduled displays features that contain user stories or defects that have been assigned to the release, but have **not** been assigned to an iteration."
- **Rows = projects/teams as expandable swimlanes**, individually or all-at-once collapsible.
- **Cells = feature tiles** showing feature ID, total points-or-count, completed points-or-count, a dependency icon, and the **`D`** designation for derived features. Example: "14 user stories/defects parented to this feature, and 5 of them are complete."
- **Status bars** show "user story points/count that were completed as a percentage of the points/count that were assigned to the iteration for that project," colour-coded "according to the rules used on the **Iteration Status page**" — Green = completed, Light blue = in-progress, Dark blue = incomplete past-iteration work.
- **Drill-down** to child user stories and defects with predecessor dependencies.
- Filterable by specific features.

[[Release Tracking Breakdown](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/release-tracking-page/release-tracking-breakdown.html), [Rally Release Tracking capability](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/valueops-solution/ValueOps-Solution/n-valueops-capabilities/n-release-tracking-capability.html), [Iteration Status Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/iteration-status-page.html)] — `[DOCUMENTED]`

**Breakdown-by-portfolio-item does not exist.** Rally's breakdown axis is team × iteration. `[NO SOURCE]` for any PI-axis breakdown on this page.

**Verdict: DIVERGES — we suppress Rally's default view, and this is the largest functional gap on the page.** SRS §5/§9/RT-AC-12: "Breakdown: not implemented in the approved slice and **must not be shown as an active view**"; "The earlier active Breakdown view is superseded." Our clone reportedly *has* an implementation and deliberately does not expose it.

Consequence chain: with Breakdown suppressed, the page's documented left/right architecture ("features on the left, **a matrix of teams and iterations** on the right") collapses to features-plus-chart. That is why we needed to bolt a `Team` column onto the grid (Q6) and why the page can no longer answer its headline question — *which team is behind in which iteration*. Rally answers that only in the Breakdown.

If our hidden Breakdown is team × iteration with per-cell feature tiles, unhiding it is the single highest-value change available. If it is a breakdown *by portfolio item*, it has no Rally analogue and should stay hidden.

---

## 8. Release progress metric — prior finding CORROBORATED

**Rally does X: there is no release-level completion percentage anywhere on this page.** Every percentage Rally computes here is scoped *below* the release:

- **Per direct feature** (Status column): "Direct features display a percentage complete value in the status indicator, as the entire feature is planned into the release." `[DOCUMENTED — index-only]` / `[DOCUMENTED]` via Features List.
- **Per derived feature: no percentage at all** — "Derived features display a **count** of completed versus planned work items." `[DOCUMENTED]`
- **Per team-iteration cell** (Breakdown): completed ÷ assigned-to-that-iteration-for-that-project. `[DOCUMENTED]`
- **Release level: nothing.** The chart shows absolute Planned / Accepted / Preliminary magnitudes, not a ratio. No header percentage, no release progress bar, no "release % done" in any of the five Release Tracking pages.

This corroborates the earlier finding from both directions: Rally's complete Release field reference lists only rolled-up totals — "Plan Estimate, Task Estimate, Accepted, and To Do" — and **no** percent-done field [[Release Fields](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-releases/release-fields.html)] — `[API-SCHEMA, by absence]`; while `PercentDoneByStoryCount` / `PercentDoneByStoryPlanEstimate` are **PortfolioItem** attributes [[Portfolio Item Fields](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/managing-portfolio-items/portfolio-item-planning/creating-portfolio-items/portfolio-item-fields.html)] — `[API-SCHEMA]`. Rally's release chart is a **burn-up**, and the standalone one lives under Reports [[Release Burnup Chart](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reporting/rally-reports-and-charts/burndown-burnup-charts/release-burnup-chart.html)] — `[DOCUMENTED]`.

**No contradiction found.** The Release Tracking page is exactly the "Rally-shaped home for release progress" the earlier research predicted: it renders release progress as *a burnup plus per-feature percentages*, never as a release percentage.

**Verdict: MATCHES.** SRS defines no release-level percentage; §3 RT-BR-05 puts percent on the direct-feature row (`Math.floor(accepted/total × 100)`) and withholds it from derived rows. Rally-correct on both.

Note for the wider audit: this *strengthens* recommendation #4 in `2026-08-04_FULL_STACK_GAP_AUDIT.md` (drop `Progress` from the Releases list and the percent/bar/burndown from Release detail). Release Tracking is where that intent belongs, and it belongs there as a burnup — which is what we built.

---

## 9. Relationship to Portfolio

**Rally does X.** The list contains **only the lowest-level portfolio item type** — "The features (or your **custom-named, lowest-level portfolio items**) that are planned for a release display on the left side of the page." [[Release Tracking Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/release-tracking-page.html)] — `[DOCUMENTED]`. Higher levels (Initiative, Theme) never appear; only the lowest PI level "flows through execution teams to be implemented in a series of user stories" [[Portfolio Item Types](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/managing-your-workspace/customizing-portfolio-item-types/portfolio-item-types.html)] — `[DOCUMENTED]`.

**Rollup is exactly one level: leaf story/defect → parent feature.** Features are the row; their child stories and defects supply every number. Unparented stories/defects are the escape hatch for leaves with no feature.

**The critical rollup rule:** the chart "displays data **from all the child user stories and defects of the direct features in the Features List. Data for the derived features is not included.**" [[Release Tracking Chart](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/release-tracking-page/release-tracking-chart.html)] — `[DOCUMENTED]`. Consistently, `Planned` = "stories and defects in features in the list, **plus unparented user stories and defects**" — direct features' children + unparented, derived excluded.

**Verdict: MATCHES on scope, DIVERGES on the chart population.**
- Features-only, no Initiatives/Epics: **MATCHES** (SRS §6 keys everything off `Feature` and `Story/Defect`).
- One-level rollup, Tasks excluded: **MATCHES** (SRS §3 "Tasks are excluded because Plan Estimate and release classification are owned by Story/Defect").
- **Chart population DIVERGES.** SRS §4.1 defines `TrackedLeaves(R, S) = DISTINCT Story/Defect WHERE releaseId = R AND teamProjectId ∈ S` and states this "includes children of Direct Features, **children that cause Derived Features**, and Unparented Story/Defect items." Rally explicitly excludes derived-feature data from the chart. Our Planned/Accepted/Ideal series therefore run **higher** than Rally's for any release containing derived features — a silent numeric divergence, not a cosmetic one.
- Two SRS points are internally inconsistent with each other here, independent of Rally: RT-BR-08 sums `Preliminary Estimate` over **direct ∪ derived** features, while Rally's Preliminary is "all features in the list" and the chart's other series exclude derived. Whichever way this is resolved, Preliminary and Planned should share one population rule.
- Also note Rally's `Accepted` admits leaves "scoped to a release **or associated with a feature that is scoped to the release**" — a *broader* net than our strict `releaseId = R`. `[DOCUMENTED]`, and a second reason our totals will not reconcile with Rally's.

---

## 10. Milestones on this page

**Rally does X: nothing.** Milestones are **not documented anywhere on the Release Tracking page** — not in the Features List columns, not as Breakdown columns or markers, not as chart annotations, not in the Issues types. Across all five Release Tracking topics, the word does not appear. `[NO SOURCE]` / `[DOCUMENTED, by absence]`

Rally's milestone surfaces are elsewhere:
- **Timeline page** — the documented place to see milestones against time [[View Milestones on the Timeline Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/using-the-timeline-page/view-milestones-on-the-timeline-page.html)] — `[DOCUMENTED]`;
- **Milestone Burnup app** — "view a chart of accepted user stories that are associated with a milestone... helps you anticipate whether work is completed by the milestone date" `[DOCUMENTED]`;
- **Milestone detail** — `Percent Done By Work Item Count` / `Percent Done By Work Item Points` [[Managing Milestones](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-milestones/managing-milestones.html)] — `[DOCUMENTED]`.

The architectural reason is clean: a Rally milestone is a single `TargetDate` attached to arbitrary artifacts across projects, with no start date and no containment relationship to a release. It has no natural cell in a team × iteration matrix and no natural row in a feature list.

**Verdict: MATCHES (by shared absence).** Our SRS §5/§6 mentions no milestones on this page. Correct, and correct for the right reason. **Do not add them** — a milestone marker on the burnup X-axis would be plausible-looking and unsourced.

---

## Recommendations, ranked by confidence

### Tier 1 — act on these (two independent Rally sources, clean-fetching pages)

| # | Item | Action | Why |
|---|---|---|---|
| 1 | **Nav location** | **No change — and correct the audit record.** | Rally = `Portfolio > Release Tracking`, stated twice. Our clone already matches. Retract the "should be under Track" finding before anyone moves the page; that would be a regression. (Q1) |
| 2 | **Three-bucket model** | **No change — and record the provenance in the SRS.** | Direct / Derived / Unparented are Rally's own, with matching names, matching exclusivity, matching "explicitly assigned" rule, matching percent-vs-count asymmetry. Add the Features List URL to SRS §3 so this is never re-litigated as a BA invention. (Q2) |
| 3 | **Un-hide the Breakdown** — *if* ours is team × iteration | **Fix code.** | Breakdown is Rally's **default** view and the page's reason for existing ("a matrix of teams and iterations on the right side"). Confirm our implementation's axes first; ship iterations-as-columns, team swimlanes as rows, feature tiles with ID + completed/total + `D`, plus the `Unscheduled` column. Then amend SRS §5/§9/RT-AC-12, which currently *forbid* it. (Q7) |
| 4 | **Chart excludes derived-feature data** | **Fix code + amend SRS §4.1.** | Rally: "Data for the derived features is not included." Our `TrackedLeaves` includes derived-causing children, so Planned/Accepted/Ideal read high. Silent numeric divergence. While in there, align RT-BR-08's Preliminary population with the corrected Planned population. (Q9) |
| 5 | **`Ideal` line semantics** | **Amend SRS §4 + fix code.** | Rally's `Ideal (Accepted Points)` = trend-based *prediction* from recent acceptance activity, feeding a predicted completion date via intersection with `Prediction (Planned Points)`. Ours = persisted 0→target baseline. Either rename ours (`Planned Baseline`) and add Rally's trend line, or replace. Do **not** ship two differently-defined lines both called "Ideal". Our snapshot-sourced-history requirement is right — keep it; Rally's chart is snapshot-backed too. (Q4) |
| 6 | **Rename `Chart Unit` → `Grid Unit`** | **Fix code + amend SRS §9.** | Rally's control is `GRID UNIT` and it already governs grid *and* chart. §9 deliberately deleted the correct name while keeping the correct behaviour. Cheap, purely cosmetic, removes a gratuitous vocabulary divergence. (Q3) |
| 7 | **Add `blocked` as an Issues type** | **Fix code + amend SRS §5.** | Rally documents 3 issue types; we ship 1. `Blocked` needs no dependency engine — just the flag on story/defect — and it is the type users expect. Also add Rally's **20-item cap, oldest→newest**; our panel is unbounded. Defer the predecessor type with `FB-P6-001`. (Q5) |
| 8 | **Release-level percentage** | **No change — and use this to close audit item #4.** | Corroborated: no release percent anywhere in Rally, on this page or on the Release object. Per-feature percent + burnup is the Rally shape, and it is what we built. Strengthens the case for deleting `Progress` from the Releases list and the percent/bar/burndown from Release detail. (Q8) |
| 9 | **Milestones** | **No change. Do not add.** | Absent from all five Release Tracking topics; a single-`TargetDate` artifact has no place in a team × iteration matrix. Rally's homes are Timeline and the Milestone Burnup app. (Q10) |

### Tier 2 — act, with a judgement call (single clean source, or a defensible deliberate deviation)

| # | Item | Action | Why |
|---|---|---|---|
| 10 | **Grid column order** | **Fix code + amend SRS §5.** | Rally pins `Rank, ID, Name` leftmost and non-reorderable, then `Status`, `Issues`. Move `Name` to 3rd; make `Rank/ID/Name` non-reorderable and `Status/Issues` movable. Also **add `Name` as a sort key** — Rally sorts Rank/ID/Name; we sort Rank/ID/Team. (Q6) |
| 11 | **Interleaved list + `D` rank marker** | **BA decides — but decide *knowing* Rally's behaviour.** | Rally shows ONE merged rank-ordered list, `D` for derived rows, with the category drop-down as optional narrowing: "Rank is determined by the position of any work item in the release, so you may see some derived features, identified with a rank of `D`, listed among numerically ranked features." SRS §5/§9 forbid both, *by explicit supersession*. Our version is arguably clearer for new users; it is definitively not Rally. If fidelity wins, restore the merged default + `D` and keep the filter. If clarity wins, re-record §9 as a **conscious deviation from documented Rally behaviour**, not as a correction. (Q2b) |
| 12 | **Keep the `Team` column** | **Amend SRS to record it as a compensating addition.** | Rally has no `Team` column — teams are the Breakdown's rows. Our column is a reasonable prosthesis *for as long as Breakdown stays hidden*. Tie it to #3: **if Breakdown ships, revisit.** Its per-bucket polymorphic semantics ("scoped child Team(s) that caused inclusion" for derived) are pure BA invention — document as such. (Q6) |
| 13 | **In-app bucket explanation** | **Fix code.** | Independent of Rally, and it closes audit §6.6: the mockup had an AlertCircle popover explaining Direct/Derived/Unparented; the build dropped it. Now that the taxonomy is confirmed as Rally's, quote Rally's own definitions in the tooltip. |

### Tier 3 — index-only source; verify before acting

| # | Item | Action | Why |
|---|---|---|---|
| 14 | **Out-of-scope-team features should be Derived** | **Fix code + amend SRS §3 RT-BR-02 — after re-verifying.** | "Features assigned to the release, but not to the scoped project team or teams, also display as derived features." Our RT-BR-02 requires `Feature.releaseId != R`, so such a feature fails RT-BR-01 (scope) *and* RT-BR-02 (release) and **disappears from the page entirely** — a data-loss-shaped bug, not a cosmetic one. But the source page currently 404s on direct fetch. Re-verify against a live Rally tenant or a re-published doc before changing RT-BR-02, since it also breaks the SRS's "exclusivity by opposite `releaseId`" argument. |
| 15 | **Add `Prediction (Planned Points)` / `Prediction (Accepted Points)`** | **BA decides.** | Documented on the clean-fetching Chart page and the capability page, but with no stated formula. This is the pair that yields Rally's predicted completion date. Needs its own BA rule for the trend window before it can be specified. Reasonable `FB-P6-002`. (Q3, Q4) |
| 16 | **Dependencies view** | **Leave in `FB-P6-001` — with one Rally fact captured now.** | Rally shows "all items with a dependency relationship where at least one of the items is assigned to the selected release," including when the counterpart is in a *different* release. And critically, per KB: "In order for a dependency to appear under iterations on the Release Tracking page the dependency must be listed as a **successor**. Only successors will appear." [[KB 103169](https://knowledge.broadcom.com/external/article/103169/rally-release-tracking-what-dependencie.html)] — `[DOCUMENTED]`. Record the successor-only rule in `FB-P6-001` now; it is the kind of detail that gets invented wrongly later. Note Rally frames this page's purpose as "identify issues **and dependencies**", so the deferral removes half the page's stated job. (Q1, Q5) |

### Explicitly unresolved

- **Q2c** — whether Rally's "Features in Release" count also includes out-of-scope features holding in-scope children. Two fetches of the same page disagreed; likely summarizer drift. `[NO SOURCE]`. **Do not act.**
- **Y-axis labels and the secondary iteration-name row** beneath the burnup (SRS §4 RT-BR-09). No authoritative source found. BA styling; harmless; not Rally-verified.
- **Whether the `release-tracking-for-rally-saas` subtree is a newer redesign or a re-hosting of the same content.** Its three pages 404 on fetch. Everything cited from it is corroborated elsewhere, but if Broadcom has shipped a redesigned Release Tracking, this report describes the classic page.

---

## Source inventory

**Fetched successfully (primary):**
- [Release Tracking Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/release-tracking-page.html)
- [View the Release Tracking Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/release-tracking-page/view-the-release-tracking-page.html)
- [Release Tracking Features List](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/release-tracking-page/release-tracking-features-list.html)
- [Release Tracking Breakdown](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/release-tracking-page/release-tracking-breakdown.html)
- [Release Tracking Dependencies](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/release-tracking-page/release-tracking-dependencies.html)
- [Release Tracking Chart](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/release-tracking-page/release-tracking-chart.html)
- [Rally Release Tracking capability (ValueOps)](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/valueops-solution/ValueOps-Solution/n-valueops-capabilities/n-release-tracking-capability.html)
- [KB 103169 — dependency icon on Release Tracking](https://knowledge.broadcom.com/external/article/103169/rally-release-tracking-what-dependencie.html)
- [How to Troubleshoot Chart-Related Issues](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reporting/rally-reports-and-charts/how-to-troubleshoot-chart-related-issues.html)

**Index-only (404 on direct fetch; quoted text via Broadcom search index):**
- [Track Features and Work — Rally SaaS](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/release-tracking-page/release-tracking-for-rally-saas/track-features-and-work.html)
- [View Overall Release Status — Rally SaaS](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/release-tracking-page/release-tracking-for-rally-saas/view-overall-release-status.html)
- [View the Release Burnup Chart — Rally SaaS](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/release-tracking-page/release-tracking-for-rally-saas/view-the-release-burnup-chart.html)

**Supporting:**
- [Release Fields](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-releases/release-fields.html) · [Portfolio Item Fields](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/managing-portfolio-items/portfolio-item-planning/creating-portfolio-items/portfolio-item-fields.html) · [Portfolio Item Types](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/managing-your-workspace/customizing-portfolio-item-types/portfolio-item-types.html) · [Iteration Status Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/iteration-status-page.html) · [Customizing How a List Displays](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/customizing-pages-and-views/customizing-how-a-list-displays.html) · [Release Burnup Chart](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reporting/rally-reports-and-charts/burndown-burnup-charts/release-burnup-chart.html) · [What is an Estimate?](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/building-your-backlog/sizing-and-estimates-overview/size-and-estimate-for-your-team/what-is-an-estimate.html) · [View Milestones on the Timeline Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/using-the-timeline-page/view-milestones-on-the-timeline-page.html) · [Managing Milestones](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-milestones/managing-milestones.html)

**Community (contrast only, not authoritative):**
- [Burnup and Burndown Charts in Rally](https://academy.broadcom.com/blog/valueops/burnup-burndown-charts-in-rally) · [RallyTechServices/release-burnup](https://github.com/RallyTechServices/release-burnup) · [RallyTechServices/portfolio-release-tracking](https://github.com/RallyTechServices/portfolio-release-tracking)
