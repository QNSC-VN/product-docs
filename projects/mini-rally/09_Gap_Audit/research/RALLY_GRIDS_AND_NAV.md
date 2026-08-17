# Rally Grids, Navigation and List Interactions — Evidence Review

**Date:** 2026-08-04
**Scope:** Broadcom Rally Software (formerly CA Agile Central) vs. our mini-rally clone.
**Purpose:** settle open BA decisions on backlog scope (Q1), Iteration Status list/board toggle (Q2), and rank/reorder interaction (Q3); plus 7 secondary grid/nav questions.

---

## READ THIS FIRST — provenance correction on the screenshots

The seven files at `/home/nghiavt18/personal/qnsc/rally-*.png` were handed to me as "real-Rally screenshots". **They are not.** All seven are screenshots of **our own clone**. Evidence:

- Every frame carries a **TanStack Router/Query devtools badge** bottom-right (`rally-02-plan-menu.png`, all others). Real Rally is not a TanStack app.
- Workspace header reads **"ACME Corp / NXP · All Teams"** — our seed data, not a Rally subscription/workspace/project picker.
- `rally-05-timeboxes.png` lists **"E2E Iteration 1784030391954"** and **"E2E Iteration 1784032385955"** — our Playwright fixtures.
- `rally-12-iteration-status.png` and `rally-03b-backlog.png` show a **"Rows per page 25"** TanStack-table footer and a **"Show Fields"** button in our visual style.
- Iterations are shown with display keys **IT-1 … IT-5** (`rally-05-timeboxes.png`). Rally's `Iteration` object has no FormattedID at all (see Q5).

**Consequence for this report:** the screenshots are excellent *primary evidence for what our clone does* — I use them that way and cite them by filename. They are **zero evidence for what Rally does**. All Rally-side claims below rest on techdocs.broadcom.com. Where Rally's docs are silent I say "no authoritative source found" rather than inferring from these images.

**Second correction:** the screenshots disagree with the shipped-state description in the brief on two points. The brief says "our clone folds Type into the ID cell" and "we shipped a [board] toggle [on Iteration Status] with drag". But `rally-03b-backlog.png` shows a **separate `Type` column** (icon) distinct from the `ID` column, and `rally-12-iteration-status.png` shows **no board toggle on Iteration Status** — the board is a separate `Track > Team Board` page (`rally-06-team-board.png`). Either the screenshots are a newer build than the brief describes, or the brief is describing a different screen. Flagged in Q2/Q4; the BA should re-confirm shipped state before acting on those two.

---

## Q1. Backlog scope — unscheduled only, or all items with Iteration as a filterable column?

**Rally does: unscheduled only.** This is unambiguous and stated three separate ways in the docs.

- "The backlog is the collection of all unscheduled customer input represented by user stories, any open defects, or defect suites." … "**Once the item is scheduled into a release or iteration, it is removed from the Backlog page.**" — [Building Your Backlog](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/building-your-backlog.html)
- "The Backlog page is a prioritized list of user stories, defects, and defect suites **that have not yet been scheduled into a release or iteration**." — [Team Planning Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/team-planning-page.html)
- A second exclusion rule applies: "If a parent story contains child stories, the parent story cannot be scheduled and is not displayed in the Backlog page." — [Building Your Backlog](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/building-your-backlog.html)

**How Rally divides responsibility across three pages** (this is the part that settles the BA decision):

| Page | Nav | Scope |
|---|---|---|
| **Backlog** | `Plan > Backlog` | Unscheduled only. Ranking + grooming surface. Scheduled items disappear from it. |
| **Team Planning** | `Plan > Team Planning` | Two panes: "**Plan:** Work that already has been scheduled in a specific iteration" and "**Backlog:** Work that has not yet been added to a release or iteration". This is where scheduling happens. ([Team Planning Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/team-planning-page.html)) |
| **Iteration Status** | `Track > Iteration Status` | "a view of work items **within an iteration** organized by schedule state" — i.e. the scheduled-work grid. ([Iteration Status Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/iteration-status-page.html)) |

Note the one place Rally *does* offer scheduled/unscheduled as a filter: the Team Planning page's backlog pane has quick views, where "Unscheduled Work" = items "with a Schedule State of less than In Progress and **not scheduled into a release or an iteration**", while other quick views such as "Unfinished Work" deliberately surface items previously scheduled into other timeboxes. — [Reviewing the Backlog on the Team Planning Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/team-planning-page/reviewing-the-backlog-on-the-team-planning-page.html). So the "filterable" model exists in Rally — but on **Team Planning**, not on **Backlog**.

**Our clone: DIVERGES.** `rally-03b-backlog.png` shows the Backlog grid rendering an **`Iteration` column with a populated value** (`US000007` → "Sprint 26.2"), and also a `Release` column with values (`v2.0`, `v2.1`) — i.e. we list items already scheduled into both timebox types. We also have no Team Planning page to absorb the "show me scheduled work too" use case.

**Consequence:** our Backlog double-counts work that Iteration Status already owns, so "backlog size" and "backlog burndown" numbers are not comparable to Rally's, and product owners cannot trust the page as a grooming queue — every ranked item they groom may already be committed to a sprint.

---

## Q2. Iteration Status — list vs board toggle, and where does the Kanban live?

**Rally does: yes, Iteration Status has a built-in List/Board toggle, and the board changes Schedule State by drag.** The Team Board is a *separate, additional* page with a different purpose (flow-based, not timebox-based).

- "You can view the page either as a **list or a board**, with each view providing a different look into your iteration." — [Iteration Status Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/iteration-status-page.html)
- "Select **Track, Iteration Status**. Select the **toggle** to switch between these two views." — [Set Up the Iteration Status Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/iteration-status-page/set-up-the-iteration-status-page.html)
- Board semantics: "In the board view, each card resides in a column according to its current Schedule State field value. **To update the state of a card, drag it into the appropriate column.**" List semantics: "In the list view, you can update the Schedule State for a work item by using the **drop-down list**." — [Iteration Status Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/iteration-status-page.html)
- Board view also supports configurable **swimlanes** and card **age** (days in current schedule state). — [Set Up the Iteration Status Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/iteration-status-page/set-up-the-iteration-status-page.html)
- Rally's own guidance on which to use: "The board view is good for getting a sense of if the team will meet their commitments in time, while the list view is good for updating the status of multiple work items." — [Iteration Status Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/iteration-status-page.html)

**Rally's Team Board is a different animal.** It is filed under *flow-based* tracking, not timebox tracking: "The Team board provides a visualization of your workflow, represented by columns", columns are mapped to **flow states** the team defines, it supports **WIP limits** and **exit agreements**, and its secondary view is **Charts** (Cycle Time, Cumulative Flow, Flow Metrics, Scatterplot/Histogram, Capacity/Delivery Forecast, Aging) — not a list. — [Team Board Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/team-board-page.html), [Set Up Your Team Board](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/team-board-page/set-up-your-team-board.html), [Set Up WIP Limits](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/team-board-page/set-up-work-in-progress-wip-limits.html). Drag on the Team Board likewise mutates the mapped attribute: "when you [drag-and-drop cards between swimlanes], the associated attribute of the card (such as Owner or Scheduled State) changes as well", and vertical drag within a column re-ranks. — [Work with Cards on the Team Board](https://techdocs.broadcom.com/us/en/ca-enterprise-software/agile-development-and-management/rally-platform-ca-agile-central/rally/using/use-flow-based-boards-kanban/flow-based-tracking/team-board-page/work-with-cards-on-the-team-board.html)

**Our clone: DIVERGES — and the reconciled spec is wrong.** Per `rally-12-iteration-status.png`, our Iteration Status is **list-only**: the toolbar is `Search Work Items | Add New | Filters | Show Fields` with a `View Charts` link, and there is **no List/Board toggle**. Our board lives only on a separate `Track > Team Board` page (`rally-06-team-board.png`), which *is* drag-enabled ("Drop cards here" placeholders) — but it is **iteration-scoped** (`Sprint 26.1 2026-06-16 – 2026-06-27` picker + `NX Platform`), which is precisely what Rally's Team Board is *not*.

So we have the split inverted: Rally puts the board **inside** Iteration Status (timebox-scoped) and keeps Team Board **outside** any timebox (flow-scoped). We removed the board from Iteration Status and then rebuilt an iteration-scoped board under the Team Board name.

**Consequence:** the reconciled spec's "Iteration Status is list-only, board is future scope" is a documented mismatch with Rally and should be reopened; separately, our Team Board is mis-scoped and will not support WIP limits, flow states or flow metrics without re-founding it on flow rather than iteration.

Minor related defect from `rally-06-team-board.png`: our board columns read `Idea | Defined | In Progress | Completed | Accepted | Release`. Rally's terminal schedule state is **Released**, not "Release".

---

## Q3. Rank / reorder interaction

**Rally does: drag-and-drop is the *default*, and toolbar rank actions exist alongside it. There are no up/down arrow buttons documented anywhere.**

- "**Drag-and-drop ranking is the default ranking method for workspaces.**" … "With drag-and-drop ranking, you can prioritize work items by dragging them up or down in priority relative to other work items on the page." … "Drag-and-drop ranking is used **throughout the Rally application, not just the backlog page**" (summary pages, custom views, boards, list views). — [Drag-and-Drop Ranking](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/building-your-backlog/prioritizing-work/drag-and-drop-ranking.html)
- Hard precondition: "**Rank must be included in the view and the page must be sorted by rank ascending in order to use this feature.**" — same page.
- The toolbar alternative offers exactly three actions: "**Rank Highest**" (to beginning of list), "**Rank Lowest**" (to end of list), "**Move to Position**" (pick a specific location). Usage: ensure rank-ascending sort, tick the work item checkbox(es), choose the action. — [Rank a List with a Toolbar Action](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/building-your-backlog/prioritizing-work/rank-a-list-with-a-toolbar-action.html), [Rank a Work Item with a Toolbar Action](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/common-pages-and-elements/using-the-toolbar-to-modify-work-items/rank-a-work-item-with-a-toolbar-action.html)
- Important semantic that a naive implementation gets wrong: "the work item moves to the end of **the list**, not to the end of **the page**" — with 25/page and 30 items, Rank Lowest lands the row on page 2. — [Rank a List with a Toolbar Action](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/building-your-backlog/prioritizing-work/rank-a-list-with-a-toolbar-action.html)
- Drag ranking is also available on the Team Planning backlog pane, "by using drag and drop or by using the gear menu". — [Reviewing the Backlog on the Team Planning Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/team-planning-page/reviewing-the-backlog-on-the-team-planning-page.html)
- Ranking method is a workspace-level admin setting, so drag can be switched off org-wide. — [Change Your Ranking Method](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/managing-your-workspace/customize-workspace-details/change-your-ranking-method.html)
- The same drag-rank pattern is documented independently for portfolio items. — [Drag-and-Drop Rank Portfolio Items](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/managing-portfolio-items/portfolio-item-planning/creating-portfolio-items/drag-and-drop-rank-portfolio-items.html)

**Our clone: MATCHES on the primary interaction (drag-and-drop), INCOMPLETE on the secondary.** `rally-03b-backlog.png` shows a leading `#` rank column with sequential 1–13, consistent with drag ranking; `rally-12-iteration-status.png` shows a sortable `Rank` column. We have no Rank Highest / Rank Lowest / Move to Position toolbar, and no documented guard that drag is disabled unless the grid is sorted by Rank ascending. The spec's "up/down buttons only" is an **INVENTION** — no Rally source describes per-row up/down arrows.

**Consequence:** the shipped drag behaviour is the correct call and the spec should be amended to match, not the code; the remaining real gaps are the three toolbar rank actions and the rank-ascending precondition (without the latter, dragging while sorted by, say, Name silently writes nonsense ranks).

---

## Q4. Is Type a distinct sortable column, or encoded in the formatted ID?

**Rally does: encodes type in the ID by design, and exposes type as a *filter*, not as a documented grid column.**

- Type-in-ID is deliberate: "As the subscription or workspace administrator, you must configure each work item type with a unique prefix or tag **to help you identify the type of work item at a glance**." … "You can set up user stories with a prefix of US, so a user story would look like this: US1103. You can set defects with a prefix of DE, so a defect would look like this: DE0415." — [Define Work Product Prefixes](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/managing-your-workspace/customize-workspace-details/define-work-product-prefixes.html)
- Default columns are only three, and Type is not among them: "**Rank, ID, and Name display as columns by default**." — [View Work Items Using the Custom List 2.0 App](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reference/extending-rally-with-apps/app-catalog/custom-list-2-0-app/view-work-items-using-the-custom-list-2-0-app.html)
- Type appears as a **filter** on every mixed-type surface: Custom List 2.0 "includes default filters for **Projects and Work Item Types**" (same page); quick filters guidance says "you may need to add a **Work Item Type filter** to limit results to specific item types" — [Use Quick Filters](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/common-tasks/using-filters/use-quick-filters.html); Timeboxes uses a "**Type drop-down menu**" to pick Iterations/Releases/Milestones — [Edit a Release](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-releases/managing-releases/edit-a-release.html); Portfolio Items uses a "Type drop-down menu … to specify the type of portfolio item displayed" — [Using the Portfolio Items Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/managing-portfolio-items/portfolio-item-tracking/using-the-portfolio-items-page.html).
- **No authoritative source found** for a user-selectable, sortable `Type` column in a Rally work-item list, and none for a type icon rendered inside the ID cell. Rally's grids do render artifact-type iconography in practice, but I could not confirm that from docs and I have no genuine Rally screenshot, so I am not asserting it.

**Our clone: DIVERGES from Rally, but in the *opposite* direction from what the brief states.** `rally-03b-backlog.png` shows a dedicated `Type` column (icon-only, headed "Type") positioned *before* `Name`, with `ID` as a separate later column. `rally-12-iteration-status.png` instead renders the type icon inline with the `ID` cell (`DE000002`, `US000005`) and has **no** Type column — so the two grids are internally inconsistent with each other. Neither matches Rally, which has no Type column on either and instead relies on the prefix plus a Type filter.

**Consequence:** we are carrying two different type-rendering conventions across two grids; converging on Rally's model (prefix in ID + a Work Item Type *filter*) removes the column entirely and simultaneously fixes the "unsortable/unhideable" complaint, because Type stops pretending to be a column.

---

## Q5. Default column sets per screen

**Rally does: defaults are deliberately minimal — `Rank`, `ID`, `Name` — with everything else opt-in via `Show Fields`.**

- "Rank, ID, and Name display as columns by default." — [Custom List 2.0](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reference/extending-rally-with-apps/app-catalog/custom-list-2-0-app/view-work-items-using-the-custom-list-2-0-app.html)
- Those three are also the pinned/immovable ones: "You can reorder columns (**except for Rank, ID, and Name**) by dragging and dropping the column header to the new location." — [Customizing How a List Displays](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/customizing-pages-and-views/customizing-how-a-list-displays.html)
- Adding columns: "In the **Show Columns** dialog box, select or clear the corresponding check box next to each field you want to display in the list", reached via **Show Fields**. Hard limit: "If you choose to use **more than 25 columns** on a list view (including required columns), you can only display **up to 50 rows per page**." — [Customize Number of Columns to Display](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/customizing-pages-and-views/customizing-how-a-list-displays/customize-number-of-columns-to-display.html)
- Sorting is per-column and toggles: "You can select a column header to sort the list by the contents of that column. Select the column again to reverse the sort order." — [Customizing How a List Displays](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/customizing-pages-and-views/customizing-how-a-list-displays.html)

Per-screen, what the docs actually pin down:

| Screen | Rally evidence | Verdict on our columns |
|---|---|---|
| **Backlog** | Defaults not enumerated. Rally *recommends* adding `Dependencies` plus status fields: "Rally recommends displaying the Dependencies field as a column on the page as well as any status fields that could be helpful" (Task Status, Defect Status, Test Case Status). — [Customizing the Backlog Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/building-your-backlog/managing-the-backlog/customizing-the-backlog-page.html) | Ours (`rally-03b-backlog.png`): `☐ · # · Type · Name · ID · Schedule State · Priority · Est. · Owner · Release · Iteration`. Two divergences: (a) `Name` precedes `ID`, inverting Rally's fixed `Rank, ID, Name`; (b) `Release`/`Iteration` columns exist at all (see Q1). No `Dependencies` column. |
| **Iterations / Timeboxes list** | One page, `Plan > Timeboxes`, `Type` dropdown. Columns are customizable; defaults **not documented**. Fields that exist on an Iteration: `Name`, `Theme`, `Start Date`, `End Date`, `State` (Planning/Committed/Accepted), `Planned Velocity`, `Notes`, `Cascade`, `Inherit`, plus rollups — "**Plan Estimate, Task Estimate, Accepted, and To Do** … These totals are rolled up from the estimates given for the associated scheduled items" — and "**Project** — The current project for the iteration. The project field defaults to the project you are in and cannot be edited." — [Iteration Fields](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-iterations/iteration-fields.html); rollup definitions also in [Managing Iterations](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-iterations/managing-iterations.html) | Ours (`rally-05-timeboxes.png`): `IT-key · Name · Theme · Start Date · End Date · Planned Velocity · State`. **The SRS is vindicated on field existence**: `Project` and `Task Estimate` are both real, documented Iteration fields, and the screenshot simply does not display them — so this is a missing-column gap, not a spec error. Also note our leading `IT-1…IT-5` key: **Rally iterations have no FormattedID** (the Iteration entity has no such field; only artifacts and Milestones do). That column is an INVENTION. |
| **Iteration Status** | List view exists; columns customizable; `Dependencies` column callable out specifically. Default set **not documented**. — [Set Up the Iteration Status Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/iteration-status-page/set-up-the-iteration-status-page.html) | Ours (`rally-12-iteration-status.png`): `☐ · Rank · ID · Name · Feature · Schedule State · Block · Blocked Reason · Plan Est · To Do · Tasks · Actual · Task Est · Owner · Defects · Defect Status · Milestones` + a `Totals (3)` footer row. `Rank, ID, Name` leading = **MATCHES** Rally's pinned order. 17 columns is aggressive against Rally's 3-column default but every field is a real Rally field. No `Dependencies` column. |
| **Releases list** | Same page as Iterations: "Select Plan, Timeboxes." → "Select **Releases** from the **Type** drop-down menu." Default columns **not documented**. — [Edit a Release](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-releases/managing-releases/edit-a-release.html) | Not screenshotted. Structural divergence covered in Q8. |
| **Milestones list** | Same page: "Select Plan, Timeboxes." → "Select **Milestones** from the **Type** drop-down menu." → "Select **Add New** from the toolbar." Fields on create: `Name` (≤32 chars), `Target Date`, `Projects` (or `Workspace Scoped`). — [Add a Milestone](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-milestones/managing-milestones/add-a-milestone.html) On the **ID column question**: Milestones *do* carry a FormattedID with an `MI` prefix (e.g. `MI444`) — confirmed via Broadcom KB / WSAPI usage, not via the Rally help UI docs: [Querying Milestones … in WS API](https://knowledge.broadcom.com/external/article/57533/querying-milestones-and-their-revisionhi.html), [How to search for a Milestone using the WebServices API](https://knowledge.broadcom.com/external/article/10947/rally-how-to-search-for-a-milestone-usi.html). Whether the Timeboxes list *displays* it by default: **no authoritative source found.** | Not screenshotted. An `MS-`/`MI-` style ID column is defensible for Milestones (unlike for Iterations/Releases). |
| **Team Status** | Documented and quite specific: rows are team members (bold) expandable to Project rows and then individual tasks; columns show "the cumulative totals per project … rolled up for all projects on the team member row", including **Capacity**, **Estimate**, **To Do**, and a colour-coded **Status** progress bar showing "the percentage of stated individual capacity taken up by tasks assigned to that person"; the `Project` dropdown row is suppressed when scoped to a single project; column headers with arrows re-sort. — [Team Status Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/additional-tracking-pages/view-team-status-page.html) | Not screenshotted; not assessed. This is the best-documented column set of the six and is worth using verbatim if we build the page. |

**Our clone: MIXED.** Iteration Status column order MATCHES Rally's pinned `Rank, ID, Name`; Backlog DIVERGES (`Name` before `ID`, plus timebox columns); Timeboxes is missing SRS-required `Project` and `Task Estimate` (both legitimate Rally fields) and adds an invented iteration ID.

**Consequence:** the `Rank, ID, Name` pinned prefix is the single cheapest cross-grid fix; and the Timeboxes SRS should be treated as correct — add the two columns rather than deleting the requirement.

---

## Q6. Filters — configurable builder or fixed dropdowns?

**Rally does: a configurable, any-column filter builder with two tiers, plus a Clear Filters reset.**

- Two tiers, mutually exclusive: "You can define either **quick filters** or **advanced filters**. Advanced filters allow you to create more complex filters using operators and conditions." … "You can work with quick filters or advanced filters, but **you cannot combine the two**." — [Using Filters](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/common-tasks/using-filters.html)
- The builder itself: select "**Add or Remove Filters**" to open the "**Manage Filters**" list, then pick fields from a dropdown or by search. Each entry is annotated with "which work item types the filter will apply to" in parentheses. "**The fields you chose display below the toolbar.**" Reset via "**Clear Filters**". — [Use Quick Filters](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/common-tasks/using-filters/use-quick-filters.html)
- Multi-value per field is supported: "you can select more than one value per field". Advanced filters add operators beyond `=`/`contains`; there is a documented operator catalogue. — [Filter Operators List](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/common-tasks/using-filters/filter-operators-list.html)
- Coverage: "you can filter **most pages** to narrow down what displays" — [Using Filters](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/common-tasks/using-filters.html). Explicitly including the Timeboxes list: common actions are "filtering items on the page, selecting columns to display on the page, and export (download) options" — [Planning with Timeboxes](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes.html).
- Related: filters (plus grouping, columns, page count, scoping) are persistable as **saved views** — "This can include filters, grouping, displayed fields or columns, page count, and scoping." — [Planning with Timeboxes](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes.html)
- On removable *chips* specifically: Rally documents "fields you chose display below the toolbar" and an add/remove mechanism, but **no authoritative source found** for chip/pill visual treatment with per-chip dismiss affordances. The behaviour (add/remove arbitrary filter fields, clear all) is documented; the chip metaphor is our reading.

**Our clone: DIVERGES.** `rally-06-team-board.png` shows exactly the fixed-dropdown pattern the brief describes: `Filter cards…` text box, `All types`, `All owners`, `Blocked only` checkbox — three fixed controls, no field picker. The grids in `rally-03b-backlog.png` and `rally-12-iteration-status.png` show a generic `Filters` button whose contents I cannot see; the brief states it is 3 fixed dropdowns.

**Consequence:** with fixed dropdowns, saved views can never be built (there is nothing variable to save), and any new filterable field requires a UI change — so the spec's configurable builder is the Rally-faithful target and also the prerequisite for saved views.

---

## Q7. Quick view / peek panel vs. navigate to full page

**Rally does: both, from one control — a right-anchored slide-out panel and a full page, with an explicit toggle between them.**

- "**Select the ID of a work item to view the work item in the detail editor.**"
- "The **anchored view** panel **slides out from the right side of your window** when you select the ID. You can **drag the color bar on the left side to resize it. The maximum size is 800 pixels.**"
- "When used in **full view** mode, the detail editor provides you with additional space to work more efficiently."
- The panel header carries the switch: a "Default View toggle (opens the full view)" and a control that "opens the anchored view".
- `Name` is listed as a header element that is "**full-view only**".
- Also: "you can **right-click the ID** in the board or list view to access many of the same functions as selecting the ID directly."
— all from [Detail Editor](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/common-pages-and-elements/detail-editor.html)

Complementary point: Rally expects most edits to happen without opening anything at all — "Make rapid changes within a card or list line **without opening the detail page**" ([Iteration Status Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/iteration-status-page.html)), and "In most pages, you can inline edit displayed fields. Select the field and type your changes. Your changes are saved when you navigate away from the field." ([Edit a Release](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-releases/managing-releases/edit-a-release.html)).

**Our clone: DIVERGES.** We navigate straight to a detail route; the mockup's peek panel was never built. Note we *do* have Rally-style inline editing — `rally-03b-backlog.png` shows editable `Priority`, `Est.`, `Owner`, `Release`, `Iteration` cells with caret affordances, and `rally-12-iteration-status.png` shows inline `Schedule State`/`Owner` — so the inline half of Rally's model is present and the peek half is missing.

**Consequence:** every drill-down costs a full route transition and loses grid scroll/filter position, which is the exact friction Rally's 800px anchored panel exists to remove; the mockup was right.

---

## Q8. Navigation structure

**Rally does: Releases are NOT top-level. One `Plan > Timeboxes` page covers Iterations + Releases + Milestones via a `Type` dropdown. Release *tracking* is a separate page under `Track`.**

- Timeboxes is one page for all three: "**The Timeboxes page allows you to manage iterations, releases, and milestones.**" … "Timeboxes uses a **list page** that you can customize to meet your needs." — [Planning with Timeboxes](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes.html)
- The switcher is a Type dropdown, confirmed by two independent task pages:
  - Releases: "Select **Plan, Timeboxes**." → "Select **Releases** from the **Type** drop-down menu." — [Edit a Release](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-releases/managing-releases/edit-a-release.html)
  - Milestones: "Select **Plan, Timeboxes**." → "Select **Milestones** from the **Type** drop-down menu." — [Add a Milestone](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-milestones/managing-milestones/add-a-milestone.html)
- Confirmed menu paths elsewhere: `Track > Iteration Status` ([Set Up the Iteration Status Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/iteration-status-page/set-up-the-iteration-status-page.html)), `Track > Team Board` ([Team Board Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/team-board-page.html)), `Track > Release Tracking` ([Release Tracking Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/release-tracking-page.html)), `Quality > Defects` ([Viewing Defects](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/testing/managing-defects-and-defect-suites/defects/viewing-defects.html)), `Plan > Backlog`, `Plan > Team Planning` ([Team Planning Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/team-planning-page.html)).
- Chrome shape: Rally's navigation is a **pinnable sidebar**, not a fixed top menu bar — you "select the menu icon to open the sidebar", pages can be hidden, reordered ("You can order the pages listed in your sidebar by selecting the page name and dragging it to the desired location"), a start page set, and projects pinned in a `My Projects` selector. — [Personalized Navigation](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/customizing-pages-and-views/customize-navigation/personalized-navigation.html)

**Our clone: DIVERGES on two counts.** `rally-02-plan-menu.png` shows a fixed top bar `Home · Plan · Track · Quality · Portfolio · Releases · Reports`, with the Plan menu opened to `Backlog | Timeboxes | Milestones`. So:
1. **`Releases` is a top-level nav item** — an INVENTION. In Rally the release *list* lives inside `Plan > Timeboxes` (Type = Releases) and release *tracking* lives at `Track > Release Tracking`.
2. **We split Timeboxes into two menu entries** (`Timeboxes` for iterations, `Milestones` separately) plus the top-level `Releases` — i.e. three screens where Rally has one page with a Type dropdown. `rally-05-timeboxes.png` confirms our Timeboxes page is iteration-only: the toolbar reads `Search iterations…` and `+ Create Iteration`, with no Type switcher.

Also: our nav is a static top bar with no per-user pinning/hiding/reordering and no start-page setting.

**Consequence:** three separate timebox screens triple the list/filter/column plumbing that Rally implements once, and a top-level `Releases` entry trains users into a mental model that will not transfer back to Rally.

---

## Q9. Pagination

**Rally does: paginate, default 25 per page, with a user-settable page size at the bottom of the page.**

- "**By default, 25 work items display**" and the number is customizable. — [Customizing How a List Displays](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/customizing-pages-and-views/customizing-how-a-list-displays.html)
- The control's location: "**Select the number of items per page list at the bottom of the page.**" — [Viewing the Recycle Bin Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/common-pages-and-elements/recycle-bin/viewing-the-recycle-bin-page.html)
- Generic statement: "The list includes **pagination if the number of items exceeds a single page**, and you can set the number of items that display per page." — [Custom List Widget](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reference/rally-widgets/custom-list-widget.html)
- Page size interacts with column count: "If you choose to use more than 25 columns on a list view (including required columns), you can only display **up to 50 rows per page**." — [Customize Number of Columns to Display](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/customizing-pages-and-views/customizing-how-a-list-displays/customize-number-of-columns-to-display.html) (This implies the normal ceiling is above 50.)
- Page size is part of a saved view: saved settings "can include filters, grouping, displayed fields or columns, **page count**, and scoping." — [Planning with Timeboxes](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes.html)
- Pagination changes rank-action semantics — Rank Lowest moves to the end of the *list*, landing the row on a later page. — [Rank a List with a Toolbar Action](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/building-your-backlog/prioritizing-work/rank-a-list-with-a-toolbar-action.html)
- **The exact option list (10/25/50/100/200) is not documented — no authoritative source found.** Only the 25 default and the 50-row cap above 25 columns are stated.
- Adjacent hard cap, for reference: "If you have 200 or more attachments, only the newest 200 display on the page." — [Viewing Defects](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/testing/managing-defects-and-defect-suites/defects/viewing-defects.html)

**Our clone: PARTIAL MATCH.** Backlog and Iteration Status both show `Rows per page 25` with a range readout (`1–13`, `1–3 of 3`) — correct default, correct placement (`rally-03b-backlog.png`, `rally-12-iteration-status.png`). Timeboxes shows only `1-5 of 5` with **no page-size selector** (`rally-05-timeboxes.png`). The Quality/Defects grid has no pagination at all and fetches the entire unfiltered set (per brief; not screenshotted) — that DIVERGES from Rally on every axis and is the only one with a scaling failure mode.

**Consequence:** the Defects grid will degrade non-linearly as defect volume grows and has no ceiling on payload size; Timeboxes needs only the selector wired up, since the range readout is already there.

---

## Q10. KPI strips on list pages

**Rally does: a metrics banner on Iteration Status only. The timebox and defect *list* pages are documented as plain lists with filter/columns/export — no summary tile strip.**

- The banner is scoped to Iteration Status and named: "The **Iteration Progress banner** provides a quick view of some popular metrics used for reporting when using Scrum." Its tiles are exactly five — **Planned Velocity** ("Total number of story points (or another unit type) the team estimates they can complete within the iteration"), **Iteration End** ("Number of days left in the iteration out of the number of total days in the iteration"), **Accepted** ("Percentage and number of accepted points out of the total points in the iteration"), **Defects** ("Number of active defects in the iteration"), **Tasks** ("Number of active tasks in the iteration") — plus three charts (Pie, Burndown, Cumulative Flow). — [Using the Iteration Progress Banner](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/iteration-status-page/using-the-iteration-progress-banner.html)
- Timeboxes list: described purely as a customizable list page — "Common actions for iterations, releases, and milestones include filtering items on the page, selecting columns to display on the page, and export (download) options." **No banner or tiles mentioned.** — [Planning with Timeboxes](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes.html)
- Defects list: "The defect page displays in a list view that you can customize", with `Group By` swimlanes where "The total work item count displays to the right of each group" and "If you display the Task Estimate field within your list, task estimates are rolled up by each Group By row." Aggregation is therefore **in-grid, per group** — not a top strip. **No top-of-page tiles mentioned.** — [Viewing Defects](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/testing/managing-defects-and-defect-suites/defects/viewing-defects.html)
- Portfolio Items list: likewise in-grid — `Percent Done by Story Count` and `Percent Done by Story Plan Estimate` are **columns** shown by default, with "hover callouts" for Status/Accepted Points/Accepted User Stories/Actual End Date. **No top strip.** — [Using the Portfolio Items Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/managing-portfolio-items/portfolio-item-tracking/using-the-portfolio-items-page.html)
- Team Board: metrics are per-column (counts, WIP limits) and a separate **Charts** toggle — again not a KPI tile strip. — [Team Board Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/team-board-page.html), [Set Up WIP Limits](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/team-board-page/set-up-work-in-progress-wip-limits.html)
- Caveat: this is **argument from documented silence**. Rally's help pages describe features they have; none of the four list pages mentions a banner while Iteration Status has a whole page devoted to one. That is strong but not conclusive.

**Our clone: MIXED — one MATCH, three-plus INVENTIONS.**
- Iteration Status strip **MATCHES** almost tile-for-tile (`rally-12-iteration-status.png`): `PLANNED VELOCITY 38% 8 of 21 Points`, `ITERATION END Done Completed`, `ACCEPTED 100% 8 of 8 Points`, `1 Active Defects`, `0 Active Tasks`, plus `View Charts`. This is a faithful reproduction of the five documented tiles and the charts entry point — good work.
- Timeboxes has **no** strip (`rally-05-timeboxes.png`) — which is Rally-correct, and contradicts the brief's claim that we ship strips on four list pages. Re-verify which four.
- Portfolio **INVENTION**: `INITIATIVES 0 · FEATURES 1 · TOTAL STORIES 8 · ACCEPTED STORIES 3 · TOTAL POINTS 37` above `Portfolio Hierarchy` (`rally-09-portfolio.png`). Rally puts this information in columns, not a strip.
- Team Board **INVENTION**: `CARDS 3 · ACTIVE 0 · PLAN EST 8 · ACCEPTED 8 · TO DO 6 · BLOCKED 1` (`rally-06-team-board.png`). Rally's board aggregates per column (our board also shows per-column counts and pts, which *is* Rally-like) — the top strip is additional.
- Home dashboard strip (`ACTIVE PROJECTS · … · ACTIVE SPRINTS · BLOCKED ITEMS · OPEN DEFECTS · ASSIGNED TO ME`, `rally-02-plan-menu.png`) is fine — the spec already allows KPIs on Dashboard.

**Consequence:** the spec's rule ("KPI strips belong to Iteration Status / Dashboard / Reports only") is Rally-consistent and should stand; the Portfolio and Team Board strips are the ones to retire or convert into columns/per-column aggregates.

---

## Recommended changes, ranked by confidence

### Tier 1 — documented directly, act on these

1. **Restrict Backlog to unscheduled items** (Q1). Rally states it twice in near-identical words; add the parent-story exclusion too. If the "show me scheduled work as well" use case is real, satisfy it the way Rally does — a Team Planning page with Plan/Backlog panes and named quick views — not by widening Backlog. *Settles BA decision #1: the docs that say "unscheduled only" win.*
2. **Keep drag-and-drop ranking; amend the spec, not the code** (Q3). Drag is Rally's *default* ranking method and is used app-wide. The "up/down buttons only" line is an invention with no source. *Settles BA decision #3 in favour of shipped behaviour.*
3. **Add the three rank toolbar actions — Rank Highest, Rank Lowest, Move to Position** (Q3) and implement "end of the **list**, not end of the **page**" semantics.
4. **Gate drag-ranking on sort = Rank ascending** (Q3). Rally makes this a hard precondition; without it, dragging under any other sort writes meaningless ranks.
5. **Collapse Timeboxes/Releases/Milestones into one `Plan > Timeboxes` page with a `Type` dropdown, and remove `Releases` from the top nav** (Q8). Two independent task pages spell out the exact interaction. Release *tracking* becomes `Track > Release Tracking`.
6. **Retire the Portfolio and Team Board KPI strips** (Q10); express that data as columns (Rally's `Percent Done by …` pattern) or per-column aggregates. Keep the Iteration Status strip exactly as is — it matches the five documented tiles.
7. **Add pagination + a page-size selector to the Quality/Defects grid**, default 25 (Q9). Also wire the missing page-size selector on Timeboxes. Default of 25 is explicitly documented.
8. **Pin `Rank, ID, Name` as the first three columns everywhere, non-reorderable, and put `ID` before `Name`** (Q5). Iteration Status already does this; Backlog does not.
9. **Add `Project` and `Task Estimate` columns to the Iterations list** (Q5). Both are documented Iteration fields (`Project` is read-only; `Task Estimate` is a rollup) — the SRS requirement is correct and the screenshot is simply missing them.

### Tier 2 — well supported, needs a design decision

10. **Reopen BA decision #2: put a List/Board toggle back on Iteration Status** (Q2). Rally documents the toggle, the board's drag-to-change-Schedule-State behaviour, swimlanes and card age. "List-only, board is future scope" is a documented mismatch. *Settles BA decision #2 against the reconciled spec.*
11. **Re-found Team Board on flow, not iteration** (Q2). Rally's Team Board is flow-based tracking with team-defined flow-state columns, WIP limits, exit agreements and a Charts toggle — it is not scoped to a sprint. Our iteration picker there is the wrong axis.
12. **Replace the fixed filter dropdowns with an "Add or Remove Filters" / "Manage Filters" builder** (Q6): any eligible field, multi-value, chosen fields rendered below the toolbar, plus `Clear Filters`. This is also the prerequisite for saved views (Rally saves filters + grouping + columns + page count + scoping together).
13. **Build the anchored detail panel** (Q7): open on ID click, slide from the right, resizable to 800px max, with a toggle to full view. Keep the inline-edit cells we already have — that half is already Rally-faithful.
14. **Drop the `Type` column and rely on prefix-in-ID plus a Work Item Type filter** (Q4). Rally's prefixes exist precisely so type is legible "at a glance" from the ID; type appears as a dropdown filter on every mixed-type Rally surface. This also resolves the unsortable/unhideable complaint by deleting the column. Fix the Backlog/Iteration Status inconsistency either way.
15. **Rename the terminal board column `Release` → `Released`** (Q2) to match Rally's schedule-state vocabulary.

### Tier 3 — lower confidence / evidence thin

16. **Drop the invented `IT-`/`RE-` display keys for iterations and releases** (Q5). Rally's `Iteration` and `Release` entities have no FormattedID; only artifacts and Milestones do (`MI444`, evidenced via Broadcom KB/WSAPI rather than the help UI docs). Keep an ID column for Milestones; consider removing it for Iterations/Releases. Weigh against our own established display-key convention before acting.
17. **Consider a `Dependencies` column** on Backlog and Iteration Status — Rally explicitly recommends it on both, but we have no dependency model yet, so this is a roadmap item.
18. **Adopt the documented Team Status column set verbatim if/when we build that page** (Q5): member rows → project rows → task rows, with `Capacity`, `Estimate`, `To Do` and a colour-coded capacity-utilisation `Status` bar. Best-documented column set of the six.
19. **Add per-page-size option values** (Q9) — the exact option list is undocumented; 25 default is safe, and any set including 50 satisfies the ">25 columns caps you at 50 rows" rule. Low confidence on the specific numbers.
20. **Consider `Group By` swimlanes with per-group counts and Task Estimate rollups** (Q10) as the Rally-native replacement for our top-strip aggregates on Defects.
21. **Sidebar navigation with per-user pin/hide/reorder and a start-page setting** (Q8). Documented as Rally's model, but a large chrome rewrite for modest gain; low priority.

### Open items — no authoritative source found

- Whether any Rally grid exposes a sortable **`Type` column** (as opposed to a Type *filter*), and whether Rally renders a type icon inside the ID cell. (Q4)
- The **default column set** for Backlog, Iteration Status list, the Releases list and the Milestones list. Rally documents customizability and the `Rank, ID, Name` default trio, but never enumerates per-page defaults. (Q5)
- Whether the Timeboxes list shows a **Milestone ID column** by default. (Q5)
- Whether Rally's filter chips have per-chip dismiss affordances, versus only add/remove via Manage Filters plus Clear Filters. (Q6)
- The concrete **page-size option values**. (Q9)
- Whether Rally's Iteration Status list has a **Totals footer row** like ours. Group-level rollups are documented for defects; a grand-total row is not. (Q5/Q10)
- Confirmation of KPI-strip **absence** on Rally list pages is argument from documented silence, not a positive statement. (Q10)

---

## Source list

Rally help (techdocs.broadcom.com):
[Building Your Backlog](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/building-your-backlog.html) ·
[Managing the Backlog](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/building-your-backlog/managing-the-backlog.html) ·
[Customizing the Backlog Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/building-your-backlog/managing-the-backlog/customizing-the-backlog-page.html) ·
[Drag-and-Drop Ranking](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/building-your-backlog/prioritizing-work/drag-and-drop-ranking.html) ·
[Rank a List with a Toolbar Action](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/building-your-backlog/prioritizing-work/rank-a-list-with-a-toolbar-action.html) ·
[Rank a Work Item with a Toolbar Action](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/common-pages-and-elements/using-the-toolbar-to-modify-work-items/rank-a-work-item-with-a-toolbar-action.html) ·
[Change Your Ranking Method](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/managing-your-workspace/customize-workspace-details/change-your-ranking-method.html) ·
[Drag-and-Drop Rank Portfolio Items](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/managing-portfolio-items/portfolio-item-planning/creating-portfolio-items/drag-and-drop-rank-portfolio-items.html) ·
[Team Planning Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/team-planning-page.html) ·
[Reviewing the Backlog on the Team Planning Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/team-planning-page/reviewing-the-backlog-on-the-team-planning-page.html) ·
[Planning with Timeboxes](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes.html) ·
[Managing Iterations](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-iterations/managing-iterations.html) ·
[Iteration Fields](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-iterations/iteration-fields.html) ·
[Edit a Release](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-releases/managing-releases/edit-a-release.html) ·
[Working with Milestones](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-milestones.html) ·
[Managing Milestones](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-milestones/managing-milestones.html) ·
[Add a Milestone](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-milestones/managing-milestones/add-a-milestone.html) ·
[Iteration Status Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/iteration-status-page.html) ·
[Set Up the Iteration Status Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/iteration-status-page/set-up-the-iteration-status-page.html) ·
[Using the Iteration Progress Banner](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/iteration-status-page/using-the-iteration-progress-banner.html) ·
[Team Board Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/team-board-page.html) ·
[Set Up Your Team Board](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/team-board-page/set-up-your-team-board.html) ·
[Set Up WIP Limits](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/team-board-page/set-up-work-in-progress-wip-limits.html) ·
[Customize the Flow State Columns on your Team Board](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/team-board-page/customize-the-flow-state-columns-on-your-team-board.html) ·
[Work with Cards on the Team Board](https://techdocs.broadcom.com/us/en/ca-enterprise-software/agile-development-and-management/rally-platform-ca-agile-central/rally/using/use-flow-based-boards-kanban/flow-based-tracking/team-board-page/work-with-cards-on-the-team-board.html) ·
[Release Tracking Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/release-tracking-page.html) ·
[Team Status Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/additional-tracking-pages/view-team-status-page.html) ·
[Using the Portfolio Items Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/managing-portfolio-items/portfolio-item-tracking/using-the-portfolio-items-page.html) ·
[Viewing Defects](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/testing/managing-defects-and-defect-suites/defects/viewing-defects.html) ·
[Customizing How a List Displays](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/customizing-pages-and-views/customizing-how-a-list-displays.html) ·
[Customize Number of Columns to Display](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/customizing-pages-and-views/customizing-how-a-list-displays/customize-number-of-columns-to-display.html) ·
[Set Display Preferences on List Pages](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/customizing-pages-and-views/customizing-how-a-list-displays/set-display-preferences-on-list-pages.html) ·
[Using Filters](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/common-tasks/using-filters.html) ·
[Use Quick Filters](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/common-tasks/using-filters/use-quick-filters.html) ·
[Filter Operators List](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/common-tasks/using-filters/filter-operators-list.html) ·
[Detail Editor](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/common-pages-and-elements/detail-editor.html) ·
[Work Views Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/common-pages-and-elements/work-views-page.html) ·
[Viewing the Recycle Bin Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/common-pages-and-elements/recycle-bin/viewing-the-recycle-bin-page.html) ·
[Personalized Navigation](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/customizing-pages-and-views/customize-navigation/personalized-navigation.html) ·
[Define Work Product Prefixes](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/managing-your-workspace/customize-workspace-details/define-work-product-prefixes.html) ·
[View Work Items Using the Custom List 2.0 App](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reference/extending-rally-with-apps/app-catalog/custom-list-2-0-app/view-work-items-using-the-custom-list-2-0-app.html) ·
[Custom List Widget](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reference/rally-widgets/custom-list-widget.html) ·
[Tutorial: Learn Rally in Five Easy Steps](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/getting-started/tutorial-learn-rally-in-five-easy-steps.html)

Broadcom knowledge base (Milestone FormattedID):
[Querying Milestones and their RevisionHistory by Project in WS API](https://knowledge.broadcom.com/external/article/57533/querying-milestones-and-their-revisionhi.html) ·
[Rally — How to search for a Milestone using the WebServices API](https://knowledge.broadcom.com/external/article/10947/rally-how-to-search-for-a-milestone-usi.html)

Screenshots (all of **our clone**, not Rally): `rally-02-plan-menu.png`, `rally-03-backlog.png` (loading spinner only — no evidential content), `rally-03b-backlog.png`, `rally-05-timeboxes.png`, `rally-12-iteration-status.png`, `rally-06-team-board.png`, `rally-09-portfolio.png` — all at `/home/nghiavt18/personal/qnsc/`.
