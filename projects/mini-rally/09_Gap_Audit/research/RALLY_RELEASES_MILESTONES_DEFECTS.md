# Rally Research: Releases, Milestones, Defects, Progress Display

**Date:** 2026-08-04
**Scope:** Broadcom Rally Software (formerly CA Agile Central / Rally Dev) — release & milestone artifact management, defect lifecycle, progress display.
**Method:** Broadcom TechDocs `rally-help` pages, `knowledge.broadcom.com` KB articles, Broadcom community threads, official Rally REST toolkit examples, plus the six on-disk screenshots.
**Evidence labels used throughout:** **[documented]** = stated on an official Broadcom page · **[inferred from API schema]** = derived from field/type names in official API artifacts · **[community report]** = Broadcom community or third-party · **[no authoritative source found]**.

---

## PROVENANCE CORRECTION: the screenshots are OUR CLONE, not Rally

The six `rally-*.png` files in `/home/nghiavt18/personal/qnsc/` were handed to me as "real-Rally screenshots." **They are not. They are screenshots of our own clone.** I established this independently before reading the coordinator's correction, from the images themselves:

- a **TanStack Router/Query devtools badge** sits in the bottom-right corner of all six frames; Rally is not a TanStack app
- the header reads **"ACME Corp / NXP · All Teams"** — our seed data
- the nav bar is our clone's (`Home / Plan / Track / Quality / Portfolio / Releases / Reports`)
- IDs are zero-padded clone keys (`US000008`, `DE000004`, `DE000002`); Rally uses unpadded `US123` / `DE123`
- `rally-08-releases.png` renders raw HTML `<input type="date">` controls showing the `mm/dd/yyyy` placeholder — a browser-native widget, not Rally's calendar picker

This corroborates the parallel researcher's finding. Consequently:

> **Every "Rally does X" claim below is sourced to a URL. The screenshots are cited only as evidence of what OUR CLONE does.** Where a Rally claim could not be sourced, it says so.

---

## 1. Artifact assignment from the timebox side

### Rally: Milestones — YES, and it is genuinely bidirectional

**From the milestone side.** Rally's milestone detail editor has its own **Artifacts** collection page. Verbatim steps:

> 1. "Select Plan, Timeboxes."
> 2. "Select Milestones from the Type drop-down menu."
> 3. "Select the ID of the work item."
> 4. "Select Artifacts [icon] to open the Artifacts page."
> 5. "Select Add New from the toolbar."
> 6. "Select a work item type from the drop-down list."
> 7. "Use the Projects field to select a project if you want to associate the work item with a different project than the one currently in scope."
> 8. "Select Create with details to view the item in the detail editor and complete any necessary fields."
> 9. "Select Create."

[Add a Work Item to Associate to a Milestone](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-milestones/managing-milestones/add-a-work-item-to-associate-to-a-milestone.html) — **[documented]**

**Adding an *existing* item to a collection.** Rally's collection toolbar has a **Link Existing** action: "In the Choose dialog box, you can choose filters from the drop-down list(s) and use the search field to help locate the work item(s) you want to associate." [Link an Existing Work Item as a Child Work Item Using a Toolbar Action](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/common-pages-and-elements/using-the-toolbar-to-modify-work-items/link-an-existing-work-item-as-a-child-work-item-using-a-toolbar-action.html) — **[documented]** for child/collection parents. That this same button appears on the *milestone* Artifacts page is **[inferred]**, not directly documented; only `Add New` is documented there by name.

**Removing from the timebox side** — documented, and multi-select:

> 1. "Navigate to a list view page."
> 2. "Select the box of the work item(s)."
> 3. "Select Remove from the toolbar."

with the caveat "The Remove action is not available for work items that must be associated with work items such as tasks and connections," and removal only disassociates — it does not delete. [Remove a Work Item from a Collection or Association](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/common-pages-and-elements/using-the-toolbar-to-modify-work-items/remove-a-work-item-from-a-collection-or-association.html) — **[documented]**

**From the artifact side — this is where the checkbox picker lives:**

> "Select the ID of the artifact to open the detail editor. Select **Edit** in the **Milestones** field on the right hand side. Select the **check box** for each milestone that you want to associate to the artifact. Use the search field to search for a specific milestone. Select Done."

[Associate Artifacts with a Milestone](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-milestones/managing-milestones/associate-artifacts-with-a-milestone.html) — **[documented]**

Rally states both cardinalities explicitly: you can "associate a milestone with multiple work items" and "associate a work item with multiple milestones." [Managing Milestones](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-milestones/managing-milestones.html) — **[documented]**

The milestone Artifacts page is not a dumb list — it carries roll-ups for **Plan Estimate, Leaf Story Plan Estimate Total, Accepted Leaf Story Count, Un-Estimated Leaf Story Count, To Do, and Actuals**. [Associate Artifacts with a Milestone](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-milestones/managing-milestones/associate-artifacts-with-a-milestone.html) — **[documented]**

### Rally: Releases — no artifact collection on the release record, but a dedicated drag-and-drop planning board

The Release record is edited from the Timeboxes page detail editor, and **no work-item/artifacts collection page on the release is documented**. [Edit a Release](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-releases/managing-releases/edit-a-release.html)

Rally does release membership on a **separate Release Planning board**: it "displays a backlog list of lowest level portfolio items that are not assigned to a release, and release columns showing the lowest level portfolio items assigned to that release," and "You can **drag a card into a column** to schedule it in a release." Each release column has "a status bar at the top of each release column" that "represents the release capacity," clickable to "set or update the planned velocity for this project in the release." [Release Planning Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/release-planning-page.html) — **[documented]**

One documented hard rule: **"You cannot add work items to an accepted release."** [Edit a Release](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-releases/managing-releases/edit-a-release.html) — **[documented]**

### Our clone: **DIVERGES** — the largest gap in this audit

Rally manages timebox membership from *both* ends: a real Artifacts collection page on the Milestone with `Add New` / `Remove` toolbar actions and six roll-up fields, plus a drag-and-drop Release Planning board for releases. Our Release and Milestone detail tabs are strictly read-only viewers with no add/remove at all.

**Consequence:** the BA mockup's checkbox toggling from the timebox tab was *correct Rally behaviour*, not scope creep; shipping read-only viewers means the only way to populate a release or milestone in our clone is to open work items one at a time — precisely the workflow Rally built these pages to eliminate.

---

## 2. Milestone model

### Rally: a single **manual** `TargetDate`, scoped to many **Projects**, owning **Artifacts** — never Releases

**Field set.** The official Rally-published REST Toolkit for Python milestone example fetches exactly: `FormattedID`, `Name`, `TargetProject`, `TargetDate`, `TotalArtifactCount`, `Projects`, `Artifacts`. [get_milestones.py](https://github.com/RallyTools/RallyRestToolkitForPython/blob/master/examples/get_milestones.py) — **[inferred from API schema]**, via an official Rally example. This is not the full schema; Rally's browsable WSAPI `typedefinition` endpoint is auth-gated and could not be read.

**Single target date, not a window.** Rally's definition: "Milestones are target dates for events that are important to the business." [Working with Milestones](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-milestones.html). The create step is singular — "Select the **Target Date** for the milestone." [Add a Milestone](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-milestones/managing-milestones/add-a-milestone.html). The examples are point-in-time events — a tradeshow, "an important code deployment." [Milestone Examples](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-milestones/milestone-examples.html). Rally's own KB confirms it is stored as a single date-only value: "When a Target Date is saved, the API strips off any time portion of the value and appends the workspace timezone offset." [Rally Milestone Target Date Properties](https://knowledge.broadcom.com/external/article/224914/rally-milestone-target-date-properties.html). **No start/end window exists in Rally.** — **[documented]**

**Create dialog.** `Name` is the only required field — "Enter the name of the new milestone. You can use up to **32 characters**." Plus `Target Date`, a **Workspace Scoped** checkbox, and a **Projects** multi-select: "Select Edit in the Projects field to open a list of available projects. Select the check box for each project you want this milestone to apply to." [Add a Milestone](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-milestones/managing-milestones/add-a-milestone.html) — **[documented]**

- **Multiple Projects: YES** — **[documented]** (`Projects` collection + `TargetProject`).
- **Multiple Releases: NO.** No `Releases` field in the documented field set, and no milestone help page mentions a Release association. **[no authoritative source found]** for any `Milestone.Releases` collection in Rally. Rally scopes milestones by **Project**.
- **Multiple Teams: NO.** No Teams field documented. In Rally a "team" *is* a Project, so project scoping is the team mechanism — **[inferred]**.

**FormattedID with an `MI` prefix.** Confirmed independently: Broadcom's KB uses the example FormattedID **`MI444`** for a milestone, and `FormattedID` is in the official fetch list above. [Rally - How to search for a Milestone using the WebServices API](https://knowledge.broadcom.com/external/article/10947/rally-how-to-search-for-a-milestone-usi.html) — **[documented]**

**Uniqueness.** Rally enforces name+date uniqueness per workspace: "Validation error: Milestone.name and date: Milestone '\<formatted ID\>: \<milestone name\>' already exists with the same name and date in this workspace" [KB 10947](https://knowledge.broadcom.com/external/article/10947/rally-how-to-search-for-a-milestone-usi.html) — **[documented]**

**Is TargetDate ever derived? No.** Every source treats it as a user selection; editable properties are "the associated project(s), target date, or name." [Managing Milestones](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-milestones/managing-milestones.html) — **[documented]**. **TargetDate is always manual.**

**Milestone does carry progress fields.** The milestone Details tab shows "Percent Done By Work Item Count" and "Percent Done By Work Item Points." [Associate Artifacts with a Milestone](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-milestones/managing-milestones/associate-artifacts-with-a-milestone.html) — **[documented]**

**Delete.** "Select the box of the work item(s). Select Delete from the toolbar. The work item is moved to the Recycle Bin." / "Deleting a milestone also removes the association from each work item that was associated with the milestone. The work item itself is not deleted." / "You must have at least project editor permissions for all projects associated with a milestone in order to delete a milestone." [Delete Milestones](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-milestones/managing-milestones/delete-milestones.html) — **[documented]**

### Independent check against the parallel researcher's Q2 claims

| Their claim | My finding |
|---|---|
| Single `TargetDate`, no start/end window | **Corroborated** — 4 independent sources incl. KB 224914 on date-only storage |
| Milestones associate with **Artifacts**, not Releases; no `Milestone.Releases` collection | **Corroborated** — `Artifacts` + `Projects` in the official fetch list; no Release field anywhere |
| `FormattedID` with `MI` prefix | **Corroborated** — KB 10947 uses `MI444` |
| (Name, TargetDate)-per-workspace uniqueness | **Corroborated** — verbatim validation-error text in KB 10947 |
| Rally flags artifacts whose timebox **ends after** the milestone target date (reverse dataflow) | **Not corroborated.** I searched for this specifically and found nothing. KB 224914, which is the dedicated TargetDate-behaviour article, describes only storage and display, not any at-risk flagging. **[no authoritative source found]** — plausible and directionally consistent with everything else, but do not cite it as documented. |

Nothing I found cuts *against* any of their claims.

### Our clone: **DIVERGES, with four inventions**

From `rally-07-milestones.png` and `rally-07b-milestone-modal.png` (clone evidence):

| Our clone | Rally | Verdict |
|---|---|---|
| `TARGET START DATE` + `TARGET END DATE` columns; `Target Start` / `Target End` inputs | single `TargetDate` | **INVENTION** — we modelled a milestone as a second timebox |
| Both date inputs **disabled**, helper text "**Derived from linked Releases**" | TargetDate is always manually selected; nothing derived. Rally's dataflow, if anything, runs the other way | **INVENTION** — and it makes the date unsettable with no release attached |
| **Associated Releases** checkbox list (`v2.0 — NX Platform Upgrade`, `v2.1 — Storybook & DX`) | Milestone owns **Artifacts** and is scoped by **Projects**; no Release association | **INVENTION** |
| `Status` field, `Planned` / `At Risk` badges | no Status/State field in the documented Milestone field set | **INVENTION** — **[no authoritative source found]** for a Rally milestone status enum |
| `Owner` select | not in the documented field set | thin — **[no authoritative source found]** either way; harmless |
| no Projects multi-select, no Workspace Scoped checkbox | both documented, and central to how milestones scope | **MISSING** |
| no ID column on the list | Milestone has `FormattedID` (`MI444`) | **MISSING** |
| no Artifacts surface or roll-ups | Artifacts page with 6 roll-ups + 2 percent-done fields | **MISSING** (see Q1) |

**Consequence:** our milestone is architecturally a *second Release* — a dated window that owns releases — rather than Rally's point-in-time, cross-project marker that owns artifacts. The date-derivation machinery, the Releases join table, and the status enum are all load-bearing code with no counterpart in the product being cloned.

---

## 3. Release progress

### Rally: a Release record carries NO percent-done field and NO progress bar

Rally's authoritative Release field reference documents **only rolled-up totals**, never a percentage: "**Plan Estimate, Task Estimate, Accepted, and To Do**" are "totals rolled up from the estimates given for the associated scheduled items," and `Accepted` "calculates and displays the total of scheduled item estimates whose state has been set to accepted." **There is no Percent Done, no progress bar, and no completion metric on the Release.** [Release Fields](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-releases/release-fields.html) — **[documented, by absence in the complete field reference]**

### The percent-done fields belong to **PortfolioItem**, not Release

> "**Percent Done by Story Plan Estimate:** The value of this field is calculated by dividing the number of accepted points by the total user story points for user stories associated with the portfolio item."
> "**Percent Done by Story Count:** The value of this field is calculated by the number of accepted user stories divided by the total number of user stories associated with the portfolio item."

plus `Percent Done By Defect Count`, `Percent Done By Defect Plan Estimate`, `Percent Done By Total Count`, `Percent Done By Total Plan Estimate`. [Portfolio Item Fields](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/managing-portfolio-items/portfolio-item-planning/creating-portfolio-items/portfolio-item-fields.html) — **[documented]**. The WSAPI names `PercentDoneByStoryCount` / `PercentDoneByStoryPlanEstimate` are confirmed as PortfolioItem attributes in Rally's own query docs. [Query Tips and Examples](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reference/writing-rally-queries/query-tips-and-tricks.html) — **[documented]**

### Where progress actually renders in Rally

1. **Portfolio Items page** — Rally's canonical progress-bar surface. It "helps you visually track your portfolio's progress (Percent Done) with **colored status indicators** based on an algorithm that takes into account the number of stories, story points (if applicable), current date, dates work is set to Accepted, and planned start/end dates," and "you can hover over either of the Percent Done fields to see the number of accepted points and user stories." [Using the Portfolio Items Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/managing-portfolio-items/portfolio-item-tracking/using-the-portfolio-items-page.html), [KB 144455](https://knowledge.broadcom.com/external/article/144455/rally-portfolio-items-when-should-the-p.html) — **[documented]**
2. **Milestone Details tab** — `Percent Done By Work Item Count` / `Percent Done By Work Item Points` (Q2) — **[documented]**
3. **Release Tracking page** — a *separate page* under Tracking, not the release record: "track the status of teams and features in a common release" and "compare the features that are planned into a release against the current status of the work." [Release Tracking Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/release-tracking-page.html) — **[documented]**
4. **Release Planning board** columns — the top status bar "represents the release **capacity**" (planned velocity), i.e. capacity, not completion. [Release Planning Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/release-planning-page.html) — **[documented]**

### Rally has no release burndown — it has a release BURNUP, under Reports

The Release Burnup Chart sits at Reporting > Rally Reports and Charts > Burndown / Burnup Charts. It "tracks how much work is done" and "can show more information than a burndown chart because it also has a line showing how much work is in the project as whole." Only a *Burnup* is listed for releases; burndowns exist for iterations and stories. [Release Burnup Chart](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reporting/rally-reports-and-charts/burndown-burnup-charts/release-burnup-chart.html), [Burndown / Burnup Charts](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reporting/rally-reports-and-charts/burndown-burnup-charts.html) — **[documented]**. Rally even cautions that the Release Tracking burnup "displays different counts than expected" and should be used "for trend analysis rather than a way of counting story points." [How to Troubleshoot Chart-Related Issues](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reporting/rally-reports-and-charts/how-to-troubleshoot-chart-related-issues.html)

### Our clone: **DIVERGES** — and one premise in the brief is wrong

**Correction:** `rally-08-releases.png` **does** show a `Progress` column on the Releases list — the header sits between `Task Est.` and `State`, and both rows render `—`. The brief's claim of "NO progress column on the list" is incorrect; we have a progress column that is simply dead against this data.

- Progress column on the Releases list: **DIVERGES** — Rally's release list shows rolled-up totals, never a percentage.
- Percent + progress bar on Release detail: **INVENTION** — no percent-done field exists on a Rally Release at all.
- Burndown on Release detail: **INVENTION twice over** — Rally uses a burn**up** for releases, and it lives under Reports, not on the release record.

**Consequence:** our spec's ban on release progress is correctly Rally-aligned and the shipped UI violates it; a release completion percentage would be a field Rally deliberately does not have. The Rally-shaped home for this is a Release Tracking page plus a burnup under Reports.

---

## 4. Release fields

All from [Release Fields](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-releases/release-fields.html) — **[documented]**:

| Field | Rally | Verbatim / note |
|---|---|---|
| `Name` | ✅ | "Enter the name of the release." |
| Start Date (`ReleaseStartDate`) | ✅ **required** | "…select the start date for the release… **This field is required.**" |
| Release Date (`ReleaseDate`) | ✅ **required** | "…select the date which targets a release… **This field is required.**" |
| `State` | ✅ | Planning / Active / Accepted — Q5 |
| `Theme` | ✅ | "Use this **rich text** field to enter a theme for your release." |
| `PlannedVelocity` | ✅ | "Specify the total number of points that the team thinks it can complete within this release." Renamed from `Resources` in an earlier API generation. |
| `Notes` | ✅ | "Record additional information associated with the release such as team decisions or discussion results." |
| `PlanEstimate` | ✅ read-only roll-up | with Task Estimate, Accepted, To Do |
| **`Version`** | ✅ **EXISTS** | "Enter an identifying version number for your release." |
| `Project` | ✅ **immutable** | "The current project for the release. This field defaults to the your current project and **cannot be edited**." |
| Cascade / Inherit | ✅ | toggles for parent/child project hierarchies |
| `FormattedID` / ID column | ❌ **not documented** | Absent from the Release field reference. Release is a **timebox**, not an Artifact, so it has no artifact-style formatted ID — **[inferred]** from the absence plus Rally's artifact/timebox split |

**Can a Release be moved to a different Project after creation? NO** — "cannot be edited." At create time you *do* pick scope — "Use the Projects field to select a project if needed" — and `Cascade` "can be selected to apply a release to all child projects… creating the release using the same Name, Start Date, and End Date in all child projects." [Add a Release](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-releases/managing-releases/add-a-release.html) — **[documented]**

**Navigation.** Releases are **not** a top-level nav item in Rally. They live at **Plan > Timeboxes** with the Type drop-down set to "Releases"; organizers "create, edit, and delete releases from the Timeboxes page," a list page supporting "filtering items on the page, selecting columns to display on the page, and export options," plus "inline edit displayed fields." [Add a Release](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-releases/managing-releases/add-a-release.html), [Edit a Release](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-releases/managing-releases/edit-a-release.html) — **[documented]**

### Our clone: **MATCHES on fields; DIVERGES on required-ness and navigation**

`rally-08-releases.png` columns: `Name, Theme, Version, Start Date, Release Date, Plan. Vel., Task Est., Progress, State`.

- `Name`, `Theme`, `Version`, both dates, `Plan. Vel.`, `Task Est.`, `State`: **MATCHES**. Notably **`Version` is real Rally**, not an invention.
- **No ID column: MATCHES** Rally — a Release genuinely has no FormattedID. (Contrast with Milestone, which does.)
- Inline-editable date inputs in the grid: **MATCHES** — Rally supports inline edit on timebox list views.
- `Progress` column: **DIVERGES** (Q3).
- Start Date empty on both rows: **DIVERGES** — Rally marks Start Date **required**.
- Top-level `Releases` nav + dedicated `Create Release` page: **DIVERGES**, cosmetically (Rally nests under Plan > Timeboxes). Low consequence.
- Project immutability after create: not observable from the screenshot — **flag for a code check**; Rally forbids it.

**Consequence:** Release is our closest-to-Rally entity; the only substantive fixes are making Start Date required, dropping the Progress column, and confirming Project is immutable post-create.

---

## 5. Release state

### Rally: exactly three values — `Planning`, `Active`, `Accepted`

> - "**Planning:** The release is not yet active and is still being planned for future activity."
> - "**Active:** The release is active and is currently in progress." — with "the earliest start considered the Active release if multiple releases have this state"
> - "**Accepted:** The release has met the release criteria."

[Release Fields](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-releases/release-fields.html) — **[documented]**

**Transitions.** No state machine is documented — `State` is a plain user-set drop-down, so backwards moves are not blocked. There is exactly one documented behavioural consequence: **"You cannot add work items to an accepted release."** [Edit a Release](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-releases/managing-releases/edit-a-release.html) — **[documented]**

Related: deleted releases are **unrecoverable** — "there is no recovery, undo, or revision histories for deleted releases and iterations." [Recycle Bin](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/common-pages-and-elements/recycle-bin.html) — **[documented]**

### Our clone: **MATCHES**

`planning | active | accepted` is exactly Rally's enum, and `rally-08-releases.png` renders it as an unconstrained drop-down in the grid — also Rally-correct, since Rally enforces no transitions.

**Consequence:** nothing to change on the enum. One documented rule is missing: block adding work items to an `accepted` release — a far better use of that state than a progress bar.

---

## 6. Defect lifecycle

### Rally: `State` and `ScheduleState` are two independent fields, by design

Broadcom's dedicated KB article on exactly this question is unambiguous:

> "**State and Schedule State are generally set independently of each other.**"

with the division of labour that **Schedule State** tracks "developer actions" and "progress toward completion," while **State** reflects "overall (big picture) status" for "product owners and higher-level executives." The article's worked example is a defect whose State moves **from Submitted to Closed without Schedule State changing at all**. **No auto-sync exists.** [Rally - Why do we have State and Schedule State for Defects in Rally - what is the relationship between them?](https://knowledge.broadcom.com/external/article/211628/rally-why-do-we-have-state-and-schedule.html) — **[documented]**

Rally's Defect Fields page confirms both are present on a Defect: `State` — "state from the drop-down list"; `Schedule State` — "progress that has been made toward the completion of the defect." [Defect Fields](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/testing/managing-defects-and-defect-suites/defects/defect-fields.html) — **[documented]**

**`State` default values: `Submitted`, `Open`, `Fixed`, `Closed`** — now **[documented]** via an official Broadcom KB. KB 57584 walks `TypeDefinition(Name=Defect)` → `/Attributes` → `/AllowedValues` for **State** and shows a **default workspace returning exactly those four values**, while a second, customized workspace in the same subscription returns six — the same four **plus `Reopen` and `Rejected`**. That single article proves both the default set *and* per-workspace customization. [KB 57584 — Get AllowedValues for Rally dropdown fields](https://knowledge.broadcom.com/external/article/57584/wsapi-api-get-allowedvalues-for-rally.html) — **[documented, official KB example]**

Rally's own Defect Fields page declines to enumerate the values, saying only "Select a state from the drop-down list. When the state is set to Closed, the date the defect was closed is appended." A `System Verify` value circulates in search snippets but appears on no live Broadcom page — treat it as a customized-workspace artefact, **[no authoritative source found]**.

**`State` default value on create: [no authoritative source found].** `Submitted` is first in the default allowed-values list and KB 211628 describes the lifecycle as "A defect's state may go from Submitted → Closed," so `Submitted` is the de-facto initial value — **[inferred]**, not asserted anywhere.

**`ScheduleState`: six states, four immutable + two customizable.** This corrects a common misreading:

> the four unchangeable states are **Defined, In-Progress, Completed, Accepted**. "There is a customizable value before Defined ('Custom 1'), and a customizable value after Accepted ('Custom 2')."

Fixed order: `Custom 1 → Defined → In-Progress → Completed → Accepted → Custom 2`, and "When you add custom values for the Schedule State field, your changes span across all work items that use the field." [Modifying Schedule States](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/managing-your-workspace/modifying-schedule-states.html) — **[documented]**

So **`Idea` and `Released` are not product defaults — they are the conventional customer names for Custom 1 and Custom 2.** Broadcom's own Work Rules page uses Idea that way: "work rules for the first schedule state of the workflow (Idea)."

**Can a Defect be REOPENED after Closed? YES by default — but Rally does have an opt-in enforcement mechanism.** Two-part answer:

1. **Out of the box there is no transition guard.** `State` is modelled purely as an enum (`AttributeDefinition` + `AllowedValues`), and no Rally help page or KB contains a transition graph, from/to table, or workflow designer for Defect State. **[documented]** that State is a free drop-down; **[no authoritative source found]** for any built-in restriction — which is itself the finding. Tellingly, customers implement reopen *as a State value* (`Reopen` in KB 57584's customized workspace), not as a transition primitive. There is **no built-in Reopen action, button, or API operation**.
2. **Work Rules can block it, if an admin configures them.** Rally ships admin-configured **Work Rules** in three flavours — Required, Read-only, and Must-match — each conditioned on up to three field comparisons, and "**Errors restrict the state movement of a Work or Portfolio item.**" Broadcom's own worked example is a Defect State rule: "if you have a Defect with Schedule State >=Accepted and the Flow State >=Communicate, then State=Closed." [Create a Work Rule](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/managing-your-workspace/administer-work-rules-/work-rules/create-a-work-rule.html), [Work Rules](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/managing-your-workspace/administer-work-rules-/work-rules.html) — **[documented]**. Note the shape: Work Rules are *field-level* rules, not transition whitelists — there is still no documented way to express "State may not go Closed → Open."

**Documented side-effects that DO auto-write State:** setting `State = Closed` "appends the date the defect was closed"; and converting a defect to a user story means "the defect is not deleted but is moved to closed state, the resolution is changed to **Converted**, and the release and iteration will be unscheduled." [Creating Defects](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/testing/managing-defects-and-defect-suites/defects/creating-defects.html) — **[documented]**

**Can a Defect be DELETED? YES — and Rally has a dedicated page saying so.**

> "Navigate to **Quality > Defects**. Check the box next to the defect(s) you want to remove. Click the **Delete** icon from the toolbar."

A defect can be deleted **at any point in its lifecycle**, and "Deleted work items are placed in the recycle bin for easy recovery." [Delete a Defect](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/testing/managing-defects-and-defect-suites/defects/delete-a-defect.html) — **[documented]**

Permissions and recovery: "Users that are owners of a work item or that have **Project Editor** privileges can delete work items"; individual restore needs "Project Editor privileges or higher," bulk restore needs "subscription or workspace administrator privileges," and "Items that appear in the Recycle Bin are privileges-based." [Recycle Bin](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/common-pages-and-elements/recycle-bin.html), [Restore Work Items from the Recycle Bin](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/common-pages-and-elements/recycle-bin/restore-work-items-from-the-recycle-bin.html) — **[documented]**

**Via WSAPI: delete YES, restore NO.** The REST operation table maps Delete → `DELETE`. But "You can **not** restore or recover artifacts from the Recycle Bin using WSAPI. You must be logged into the product and do that interactively," and on `RecycleBinEntry` "the 'Delete' method will **permanently** delete the artifact." [REST Services Overview](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reference/rally-web-services-api/rest-services-overview.html), [KB 100861](https://knowledge.broadcom.com/external/article/100861/rally-wsapi-can-we-restore-an-artifact.html) — **[documented]**. Recycle-bin retention/purge policy: **[no authoritative source found]**.

### Our clone: **DIVERGES in two opposite directions**

`rally-11-defects.png` shows `State` (Open/Fixed) and `Schedule State` (a segmented P/A control) as **separate columns** — that **MATCHES** Rally's two-independent-fields model, and it is the right call. Our nav also puts defects under **Quality**, which matches Rally's own "Select Quality, Defects" path. [Creating Defects](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/testing/managing-defects-and-defect-suites/defects/creating-defects.html)

- **Forbidding reopen: DIVERGES.** Rally permits `Closed → Open` by default — no transition enforcement ships out of the box, and customers who want a reopen concept add it as a **State value** (`Reopen`), exactly the shape Rally's own KB shows. Worse, our own Quality KPI strip renders a **`REOPENED 0`** tile (`rally-11-defects.png`), so we count a state our API forbids reaching. If we *want* enforcement, Rally's model for it is admin-configured Work Rules, not a hard-coded state machine.
- **Forbidding delete via API while shipping a live bulk Delete button: DIVERGES, and is internally inconsistent.** Rally has a dedicated help page whose steps are literally "Navigate to **Quality > Defects**… Click the Delete icon from the toolbar" — the exact page and gesture our clone ships — permitted "at any point in its lifecycle," for Project Editors, with a Recycle Bin. We have the button, no API, and no safety net.

**Consequence:** the reopen ban contradicts Rally, our own KPI strip, and the way Rally customers actually model reopen; the Delete button is an affordance wired to an API that refuses it — a guaranteed user-visible error path on the very page Rally documents delete for.

---

## 7. Defect fields

### Rally: only `Project` is required, and `Root Cause` is not in the documented field set

Rally's Defect Fields page enumerates a large field set. Confirmed present, verbatim descriptions: `Environment` ("describe the environment in which the defect was discovered"), `Found in Build` ("build number in which the defect was found"), `Fixed in Build` ("build number in which the defect was resolved"), `Resolution` ("best describes the resolution action for the defect"), `Severity` ("severity of the defect"), `Priority` ("importance of the defect"), `State`, `Schedule State`, `Plan Estimate`, `Iteration`, `Release`, `Target Date`, `Test Case`, `Owner` ("defaults to the user who creates" it), `Submitted By` ("defaults to the team member that creates the defect"), `User Story` / `Parent and Hierarchy` ("parent the defect to either a user story or feature"), `Portfolio Item`, `Project`, plus `Ancestors`, `Attachments`, `Blocked` / `Blocked Reason`, `Creation Date`, `Description`, `Discussions`, `Duplicates`, `Expedite`, `Found in Release`, `ID`, `Last Run`, `Last Verdict`, `Notes`, `Ready`, `Release Note/Affects Documentation`, `Status`, `Tags`, `Target Build`, `Task Rollup`, `Verified in Build`. [Defect Fields](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/testing/managing-defects-and-defect-suites/defects/defect-fields.html) — **[documented]**

Three findings that matter:

1. **`Root Cause` does NOT appear in Rally's documented Defect field list.** Rally documents `Resolution` but not `RootCause`. (Historically `RootCause` exists as a WSAPI Defect attribute in some subscriptions, but it is **not** in the default documented field set.) — **[documented by absence]**; **[no authoritative source found]** for `RootCause` as a default Rally Defect field.
2. **`Project` is the only field marked required.** The page states "Required fields are marked with an asterisk," and `Project` carries it. `Severity`, `Priority`, `State`, `Environment`, `Resolution` are **all optional on create**. The Creating Defects flow likewise names no required field beyond project scope. [Defect Fields](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/testing/managing-defects-and-defect-suites/defects/defect-fields.html), [Creating Defects](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/testing/managing-defects-and-defect-suites/defects/creating-defects.html) — **[documented]**
3. **`Requirement` is the WSAPI name for the parent-story link; `UserStory` is not valid.** The UI labels it "User Story" (or "Parent and Hierarchy"), the options are None / Portfolio Item / User Story and they are **mutually exclusive** — "cannot be both" — and the field "does NOT display in any list view" by default. Query it as `(Requirement = null)` / `(Requirement != null)`; "`UserStory` is not a valid Defect attribute." [KB 57589](https://knowledge.broadcom.com/external/article/57589/web-services-api-how-to-query-for-defect.html) — **[documented]**

**Enum values — partially published, and one of them contradicts our clone:**

| Field | Rally default values | Label |
|---|---|---|
| `State` | Submitted, Open, Fixed, Closed | **[documented]** [KB 57584](https://knowledge.broadcom.com/external/article/57584/wsapi-api-get-allowedvalues-for-rally.html) |
| **`Priority`** | **Resolve Immediately, High Attention, Normal, Low** | **[documented]** [KB 143259](https://knowledge.broadcom.com/external/article/143259/what-criteria-is-used-to-determine-the.html). Also documents ordering semantics: "The ranking of these 'values' is determined by the order in which they appear in the dropdown list" — top of the list is the *lesser* value for `<` / `>` filters. |
| `Severity` | Crash/Data Loss, Major Problem, Minor Problem, Cosmetic | **[community report / third-party only]** — no Broadcom page enumerates these |
| `Environment` | Development, Test, Staging, Production | **[community report / third-party only]** |
| `Resolution` | only **`Converted`** is documented (auto-written by defect→story conversion) | full list **[no authoritative source found]** |
| `RootCause` | n/a — field does not exist | **[documented by omission]** |

Rally does say these lists are "customizable by your subscription administrator," so members are configurable — but `Priority` **does** have a published default set, which I previously reported as unpublished. Correct way to read any subscription's real values: the `AllowedValues` walk in KB 57584.

**Are Severity/Priority nullable (blank / None)? [no authoritative source found].** Neither published list contains a blank entry, and no page states nullability. Verify empirically.

**Are defect-only fields hidden on other artifact types? YES — and this is now well sourced from three angles:**

1. **[documented by omission]** The complete User Story field list contains **no Severity, no Priority, no Root Cause, no Resolution, no Environment, no Found in Build — and no `State` either.** A User Story has `Schedule State` and `Flow State` only. [User Story Fields](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/building-your-backlog/user-stories/user-story-fields.html)
2. **[documented]** Rally's Jira-connector setup states plainly: "By default, **only Defect items have State and Resolution fields**. If you want to use these fields with user stories, you must create custom fields for that work item type." *(Caveat: this URL is search-indexed but returned 404 on direct fetch — verify before quoting in a spec.)*
3. **[community report — Broadcom employee]** On "can Rally user stories have priority and severity fields?": "**You are correct that these fields do not exist on User Stories out of the box.**" The recommended workarounds are custom fields, or `Expedite` + swimlanes, or plain backlog rank.

**A Rally User Story therefore has no Severity, no Root Cause, and no Priority field at all** — so the question of a story Priority enum is moot. Rally orders stories by **drag rank** plus the boolean **`Expedite`** flag. (For completeness: the `Useful / Important / Critical` set sometimes attributed to story priority actually belongs to **Test Case `Priority`** — and even that value list is **[no authoritative source found]** on Broadcom pages.)

### Our clone: **MATCHES on nullability; DIVERGES on priority values and on story field leakage**

`rally-11-defects.png` shows `ID`, `Name`, `User Story` (with `US000006` parent links), `Severity` (`Major Pro…`, `Critical`), `Priority` (`Urgent`, `High`, `Normal`), `State`, `Schedule State`, `Fixed In Build` (`v2.0.0-rc3`), `Iteration` (`Sprint 26.1`), `Submitted By`, `Owner`.

- **`severity` and `state` nullable: MATCHES Rally.** Only `Project` is required on a Rally defect. This was flagged as a suspected gap; it is not one. Remove it from the gap list.
- **Our `Severity` values look right.** `Major Pro…` is almost certainly `Major Problem`, matching the widely-reported (if not Broadcom-published) `Crash/Data Loss / Major Problem / Minor Problem / Cosmetic` set. `Critical` is not in that set — minor divergence.
- **Our `Priority` values DIVERGE from documented Rally.** Rally's published defect priority set is **`Resolve Immediately / High Attention / Normal / Low`**; ours is `Urgent / High / Normal / Low`. `Urgent` appears nowhere in Rally's docs. Low-stakes (values are admin-customizable) but it is a real, sourced divergence — and it means the "Urgent priority on a Story" complaint is doubly wrong.
- **A Story carrying `rootCause` and any `priority` at all: DIVERGES, worse than first assessed.** Three separate problems: (a) `RootCause` is not a Rally field even on Defects — Broadcom staff tell customers to add a custom field for RCA; (b) a Rally User Story has **no Priority field whatsoever**, so this is not a wrong-enum problem but a field that should not exist on the type; (c) a Rally User Story has no `State` either, only `Schedule State` / `Flow State`. This is field-model leakage across artifact types.
- Missing vs Rally: `Environment`, `Resolution`, `Found in Build`, `Target Build`, `Verified in Build`, `Found in Release`, `Duplicates`, `Blocked` / `Blocked Reason`, `Expedite`, `Target Date`. Free-text build fields in Rally are "alphanumeric and support the use of special characters" — not enums.
- One constraint we should enforce: for milestone association, "**Work items and milestones must share the same project.**" [Managing Milestones](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-milestones/managing-milestones.html) — **[documented]**

**Consequence:** letting one shared work-item table expose defect-only fields on stories is exactly the scope leakage our SRS rules out. The fix is per-type field visibility, not more columns — and `rootCause` has no Rally counterpart on *any* type, so it needs a product justification or removal.

---

## 8. Bulk actions

### Rally: one generic Bulk Edit dialog with hard limits, not a menu of per-field shortcuts

The canonical page is **Bulk Actions**: "You can perform bulk actions to **edit, delete, restore, and permanently delete** work items" — "the ability to modify multiple work items at once." [Bulk Actions](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/common-tasks/bulk-actions.html) — **[documented]**

**Edit Multiple Work Items** gives the exact capability envelope, verbatim:

> 1. "Navigate to a list page." 2. "Select the box of the work item(s)." 3. "Select Edit from the toolbar to view the **Bulk Edit** dialog box." 4. "In the Bulk Edit dialog box, **select the fields that you want to edit** and select a new value for each field." 5. "Select Apply to save your changes."

with these documented constraints:

- "You can edit up to **500 work items** at a time."
- "You can select up to **four values** to update across the checked work items."
- "**Hidden fields can be edited.**"
- "You can also **add or change the parent** of a group of user stories/defects, or **associate a group of tasks, defects, or test cases to related work items** in a single step."
- "**The Parent field is not an option for bulk editing defects**" — for defects you use the **User Story** or **Portfolio Item** field instead.
- Mixed types: "you can only edit the fields shared between the work items."
- Concurrency: "If two users edit the same story and one user is in bulk edit mode, the bulk edit user's work will **overwrite** the other user's changes."

[Edit Multiple Work Items](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/common-tasks/bulk-actions/edit-multiple-work-items.html) — **[documented]**

Other documented multi-select actions: **Bulk Delete** ("Navigate to a list page. Select the box of the work item(s). Select Delete from the toolbar") [Bulk Delete Work Items](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/common-tasks/bulk-actions/bulk-delete-work-items.html); **Remove** (disassociate from a collection) [Remove a Work Item…](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/common-pages-and-elements/using-the-toolbar-to-modify-work-items/remove-a-work-item-from-a-collection-or-association.html); **Add New** / **Link Existing**; **bulk Tag** via the same dialog ("select the **Tags** field and then select a tag(s) to use") [Tagging Multiple Items at Once](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/building-your-backlog/using-tags/tagging-multiple-items-at-once.html); **bulk restore / permanent delete** in the Recycle Bin; **CSV export**; and rank actions (**Rank Highest / Rank Lowest / Move to Position**). All **[documented]**.

Mapping the candidate list: assign-owner, set-state, set-schedule-state, set-iteration, set-release, set-build, add-to-milestone are **all just field choices inside the one Bulk Edit dialog** — Rally names none of them as discrete commands. Set-iteration and set-release are explicitly called out as examples ("moving all user stories to a new sprint and iteration"; "reassigning work items to different releases").

**`Copy` is NOT a bulk action in Rally.** It is a per-item toolbar / Detail-Editor action (`Copy`, `Deep Copy`, `Copy Tasks`), documented under the work-item toolbar and the Actions menu — never in the Bulk Actions family. [Using the Toolbar to Modify Work Items](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/common-pages-and-elements/using-the-toolbar-to-modify-work-items.html) — **[documented]**

Bulk edit is available on "most list pages," explicitly including **Quality > Defects**, Backlog, Iteration Status, Work Views, and detail-page collection tabs. Note **doc-version drift**: older CA Agile Central help described a gear menu with named bulk sub-actions; current Rally help describes a toolbar Edit icon → generic field picker. Build against the current model.

### Our clone: **DIVERGES**

We ship Delete + Copy on Quality, and Delete/Copy/Assign-Release/Assign-Iteration on Backlog — a hand-picked set of per-field shortcuts, missing the generic mechanism entirely, plus a **bulk `Copy` that Rally does not have as a bulk action at all**. `rally-11-defects.png` does show row checkboxes and a `Show Fields` column-picker, which **MATCHES** Rally's checkbox + column-selection pattern.

**Consequence:** every new bulk field becomes a new button. Rally's single Bulk Edit dialog would subsume Assign-Release, Assign-Iteration and every future set-owner / set-state / set-build in one surface — and it comes with ready-made, documented guard rails we can copy verbatim (500-item cap, 4-field cap, shared-fields-only for mixed selections, and the defect-specific rule that parent is set via User Story / Portfolio Item rather than `Parent`).

---

## 9. Portfolio hierarchy

### Rally: three default levels — Theme (3) > Initiative (2) > Feature (1) — renameable, up to five

> "Types display in descending order. For example, by default the highest level (3) are **themes**, level 2 are **initiatives**, and level 1 are **features**."
> "Only the lowest level of portfolio item type flows through execution teams to be implemented in a series of user stories."
> "you can customize the names of the portfolio item types you use as well as customize the fields that are used on portfolio types."

[Portfolio Item Types](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/managing-your-workspace/customizing-portfolio-item-types/portfolio-item-types.html) — **[documented]**

So **level 1 = Feature is the lowest**, and Feature is the type that parents user stories. WSAPI type names take the form `PortfolioItem/Feature`, `PortfolioItem/Initiative`, `PortfolioItem/Theme` — **[inferred from API schema]**; fully-qualified is the recommended form, and Rally warns admins to avoid custom type names "that correspond to Rally WSAPI endpoints" because "When you create a new portfolio item type, a new endpoint is generated for the REST API that can cause conflicts."

**A documented conflict worth knowing:** a second Broadcom page lists **four** default types — "Your Rally subscription comes with a defined portfolio item hierarchy that includes multiple default portfolio item types: Feature, Theme, Initiative, and **Strategy**." [Define the Rally Portfolio Item Hierarchy](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/valueops-insights-saas/insights/administration/for-organizations-that-do-not-use-rally/define-the-rally-portfolio-item-hierarchy.html) — **[documented]**, and pyral agrees ("Rally has 4 standard PortfolioItem sub-types (Theme, Strategy, Initiative, and Feature)" — **[community report]**). But **[no authoritative source found]** for Strategy's level number. Treat the **3-level Feature/Initiative/Theme ladder as the safe default**.

**Bounds and API representation.** "Rally allows you to configure up to **five levels** of portfolio items… The lowest level is P1 and the highest level is P5." Levels surface in the API as an **`Ordinal`**, **0-based from the bottom**: "The Ordinal field value starts with 0 for the lowest level of portfolio item (such as Feature), and increments by 1 for each portfolio item type as you go up." [Configure the Clarity–Rally Integration](https://techdocs.broadcom.com/us/en/ca-enterprise-software/business-management/clarity-project-and-portfolio-management-ppm-on-premise/16-4-1/add-ins-and-integrations/integrate-clarity-ppm-with-rally/Configure-the-Integration.html) — **[documented]**, though stated in a Clarity-integration context.

**Levels are admin-editable.** Setup → Workspaces & Projects → Fields → Type = Portfolio Item lets admins edit **Name** and **ID Prefix** per type, "Add level 4 and higher type names," and "Insert a new level and move existing levels" — but "You can modify the name and ID prefix of a portfolio type, **but not the order in the hierarchy**. If you want to change the hierarchy order… you must do so by renaming them," and "You can only delete a type if it has no associated portfolio items." [Rename Portfolio Item Types](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/managing-your-workspace/customizing-portfolio-item-types/rename-portfolio-item-types.html) — **[documented]**. A newer Insights-era Setup UI does allow drag-to-reorder — **[documented]**, and contradicts the above; Rally is mid-migration here.

**"Epic" is not a Rally portfolio level name.** The defaults are Theme / Initiative / Feature; Epic is what you'd *rename* Feature to when mapping Jira. **"Investment" is not a level either** — Rally has an `Investment Category` *field*.

**Only the lowest level parents user stories.** A user story's `PortfolioItem` field "is used to actually associate a user story with a portfolio item" and reaches only the lowest type; the story's own `Parent` field "can only be a user story," and `Parent` / `parentArtifact` are mutually exclusive. [KB 126310](https://knowledge.broadcom.com/external/article/126310/rally-user-stories-and-portfolio-items.html) — **[documented]**. The User Story field list even includes a field literally named **`Feature`** = "ID and name of parent feature." [User Story Fields](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/building-your-backlog/user-stories/user-story-fields.html)

### Rally's Portfolio Items page is a FLAT list — there is no hierarchy-tree page

This overturns the assumption behind our Portfolio screen. Rally's documented portfolio surfaces are:

| Surface | Nav | Documented description |
|---|---|---|
| **Portfolio Items page** | `Portfolio, Portfolio Items` | "provides a **list view** of all portfolio items in the select project… edit, create, copy, rank, and delete" |
| **Portfolio Kanban Board** | `Portfolio, Portfolio Kanban` | "a view of portfolio progress for a given type… custom states… custom exit agreements" |
| **Timeline** | `Portfolio, Timeline` | "visually display planned portfolio items over a time-based view, that is organized by project" |
| **Work Views** | `Plan, Work Views` | "cross-project views of portfolio items and associated children" |

[Finding Portfolio Items](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/managing-portfolio-items/finding-portfolio-items.html) — **[documented]**

- The Portfolio Items page "**is a list view** and supports filtering, customizing display columns, and saving views," with the level chosen from a **Type** drop-down — i.e. **one level at a time, flat**. [Using the Portfolio Items Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/managing-portfolio-items/portfolio-item-tracking/using-the-portfolio-items-page.html) — **[documented]**
- **There is no page called "Portfolio Hierarchy"** — **[no authoritative source found]**. "Portfolio Items Hierarchy" is a capability/concept page; building the hierarchy runs through the **Children** collection tab on the detail editor.
- Rally's actual nesting surface is **Work Views**, which does nest children under parents (with the documented quirk that a child appears twice — "one nested under the parent user story, and one as part of the list"). [Work Views Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/common-pages-and-elements/work-views-page.html) — **[documented]**
- **There is no "Roadmap" page** in Rally — **[no authoritative source found]**; "roadmap" is used descriptively and **Timeline** is the nearest equivalent.

### Progress display: per-row colored bars, not a KPI strip

The Portfolio Items page carries `Percent Done by Story Count` and `Percent Done by Story Plan Estimate` as **default columns**, rendered as colored progress bars: **Blue = Complete, Green = On Track, Yellow = At Risk (>20% below needed acceptance rate), Red = Late (>40% below)**, with hover callouts showing Status, Accepted Points, Accepted User Stories, Missing Estimates and dates. There is also a gear → **"Correct rollup discrepancy"** action and a `Last Rollup Date` field. [Using the Portfolio Items Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/managing-portfolio-items/portfolio-item-tracking/using-the-portfolio-items-page.html), [KB 144455](https://knowledge.broadcom.com/external/article/144455/rally-portfolio-items-when-should-the-p.html) — **[documented]**

**KPI strip: [no authoritative source found]** on any Rally portfolio page. Rally's aggregate mechanisms are per-row rollup columns and, on collection pages, a Plan Estimate **summary row** ("A summary row is added below the **Plan Estimate** header"). [Viewing Collections](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/common-pages-and-elements/viewing-collections.html)

### Rank: drag-and-drop is the default; there are no up/down arrows

"**Drag-and-drop ranking is the default ranking method for workspaces**… rank must be included in the view **and** the page must be sorted by rank **ascending**." Dragging is **sibling-relative** and has a global side effect: "When you change the rank of an item in one page or list, you are changing the rank of that item across all pages and lists in Rally." Portfolio items have their own dedicated page for it. [Drag-and-Drop Ranking](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/building-your-backlog/prioritizing-work/drag-and-drop-ranking.html), [Drag and Drop Rank Portfolio Items](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/managing-portfolio-items/portfolio-item-planning/creating-portfolio-items/drag-and-drop-rank-portfolio-items.html) — **[documented]**

The toolbar alternatives are **Rank Highest / Rank Lowest / Move to Position** — *not* up/down arrows. [Rank a List with a Toolbar Action](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/building-your-backlog/prioritizing-work/rank-a-list-with-a-toolbar-action.html) — **[documented]**

Underlying field: **`DragAndDropRank`**, "an alpha-numeric field… The rank values are **base 94** values," a 64-character string that "replaced" the legacy numeric `Rank`; converting it to a number is explicitly unsupported. [KB 47752 — Interpret DragAndDropRank](https://knowledge.broadcom.com/external/article/47752/rally-interpret-draganddroprank.html) — **[documented]**. A **manual numeric ranking** mode is the workspace-level alternative (decimal, 35 digits left / 3 right, ties allowed). [Manual Ranking](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/building-your-backlog/prioritizing-work/manual-ranking.html) — **[documented]**

### Our clone: **DIVERGES / partly INVENTION**

`rally-09-portfolio.png` shows a KPI strip (`INITIATIVES 0`, `FEATURES 1`, `TOTAL STORIES 8`, `ACCEPTED STORIES 3`, `TOTAL POINTS 37`), a `Portfolio Hierarchy` heading scoped to `NX Platform`, a `+ New Initiative` button, and an empty tree ("No initiatives yet…").

- **Two hard-coded levels (Initiative > Feature): DIVERGES.** Rally defaults to **three** (Theme > Initiative > Feature), supports up to five, exposes level as a 0-based `Ordinal`, and lets admins rename/add. We dropped Rally's *top* level, hard-coded the rest, and named a button after one level (`New Initiative`) — which will not extend.
- **`Portfolio Hierarchy` tree page: INVENTION.** Rally has **no** hierarchy-tree portfolio page; its Portfolio Items page is a flat single-type list with a Type drop-down, and nesting lives on **Work Views** and the **Children** collection tab. This is a bigger divergence than I first assessed.
- **KPI strip: INVENTION** — **[no authoritative source found]** on any Rally portfolio page. Low harm; do not defend it as parity.
- **Missing: the per-row Percent Done colored bars** (Blue/Green/Yellow/Red with hover callouts), the documented heart of Rally portfolio tracking. We put progress bars on Releases (where Rally has none) and omitted them from Portfolio (where Rally documents them as default columns).
- **Up/down rank buttons: DIVERGES** — now high confidence. Rally uses drag-and-drop over a base-94 `DragAndDropRank` string, with Rank Highest / Rank Lowest / Move to Position as the toolbar fallback. No arrow buttons anywhere.

**Consequence:** progress display is inverted relative to Rally, and our portfolio page's core metaphor (a tree) is not Rally's (a filtered flat list per level). Moving the progress bars from Release to Portfolio gets us closer to Rally while *net-deleting* code.

---

## 10. Work item detail layout

### Rally: the `Connections` tab is REAL — our tab is parity, not an invention

This is the headline finding for Q10.

> The Connections tab "allows you to view the connections (linked artifacts) shared between a Rally **user story or defect** and a GitHub pull request." It "displays the **pull request name, a link to the GitHub pull request, and the timestamp** of when the connection was created," and "The number of connections is displayed next to the [Connections icon]." You "Select the FormattedID to open the detail editor," then "Select Connections" to open the Connections page.

[View Rally Bot Connections from a Work Item](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/integrating-with-rally/broadcom-rally-connectors/rally-integrations/rally-bot-github-app-integration/using-the-rally-bot-github-app-integration/view-rally-bot-connections-from-a-work-item.html) — **[documented]**

Rally's deeper SCM model backs it: the Rally VCS Connector for GitHub "posts information about GitHub repository commits to Rally and relates those commits to Rally **changesets** and artifacts," creating "changeset and change information in Rally" against a workspace and **`SCMRepository`**. Pull requests are supported ("add the `PullRequests` value set to True"), matched by mentioning "the Rally artifact FormattedID (ex. US1234) … in either the pull request title or in one of the commit messages." [Rally VCS Connector for GitHub and GitHub Enterprise](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/integrating-with-rally/broadcom-rally-connectors/rally-integrations/policy-based-vcs-connectors/rally-vcs-connector-for-github-and-github-enterprise.html) — **[documented]**

Further corroboration that "connections" is a first-class Rally concept: the Remove-from-collection doc excludes it **by name** — "The Remove action is not available for work items that must be associated with work items such as **tasks and connections**." [Remove a Work Item from a Collection or Association](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/common-pages-and-elements/using-the-toolbar-to-modify-work-items/remove-a-work-item-from-a-collection-or-association.html) — **[documented]**

Rally's Connections goes deeper than one list: it has a **`Changesets` sub-tab**, feature-flagged per workspace — "The work item detail editor **Connections** collection shows you which changesets are associated with a particular user story or defect… Select the **Changesets** tab… **If you do not see the Changesets tab in the Connections collection of a work item, ask your administrator to enable the feature for your workspace.**" [View Changesets Associated with a Work Item](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/additional-tracking-pages/view-build-status/view-changesets-associated-with-a-work-item.html) — **[documented]**. `Connections` is also addable as a **list/board column**, not only a tab — **[documented]**.

### Rally's detail page is the "Detail Editor": a count-badged collection ribbon, not a static tab bar

**Two modes:** an **anchored** right-side panel (resizable, max 800px) and a **full view**, opened by selecting the work item's **ID**. "There is no back button on the detail editor. Select the X (Close detail editor) at the top right." [Detail Editor](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/common-pages-and-elements/detail-editor.html) — **[documented]**

**Header toolbar, in documented order:** `Work Item` menu · `Copy Link` · `Watch` · **`Actions` menu** · `Name` (full view only) · `Show Fields` · `Templates` · `Default View` toggle · `Close`. "Below the header are the **Collection icons**." — **[documented]**

**Tabs are "Collections" — an icon ribbon with count badges, and the set varies by type:** "Icons across the top of the Detail Editor are links to the available collections. **Available collections change depending on the work item type you are editing.**" and "Each link or icon is followed by a **number indicating the number of associated work items**." [Viewing Collections](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/common-pages-and-elements/viewing-collections.html), [Collections](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/common-pages-and-elements/detail-editor/collections.html) — **[documented]**

The **documented catalog is 18 collections**, of which these are relevant to a user story: **Tasks, Test Cases, Defects, Children, Dependencies, Discussions, Connections, Revision History, Risks, Charts** (plus Artifacts, Defect Suites, Duplicates, Results, Steps, Test Run, Work Items Affected on other types). [Collections Summary](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/common-pages-and-elements/viewing-collections/collections-summary.html) — **[documented]**. The only per-type example Broadcom publishes is Tasks ("only the **Discussion, Revision History, and Connections** collections are available"), so an exact certified tab set for User Story is **[no authoritative source found]**; the list above is **[inferred]** from the catalog.

Two structural details worth copying:

- **`Attachments` is a FIELD, not a collection tab** — a browse-for-files field on the work item, with its own "Add an Attachment to a Work Item" topic under *Using the Detail Editor*. — **[documented]**
- **Rally's name for related items is `Dependencies`, not "Linked Items."** "Rally uses **predecessors and successors** to indicate an ordinal relationship in which one user story **or portfolio item** is dependent on the completion of another… Predecessor-successor relationships are only allowed between user stories and/or portfolio item types (**at all hierarchy levels**) in the same workspace." It is both a collection and an addable column, and it renders on the Timeline. [Predecessor-Successor Relationships (Dependencies)](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/building-your-backlog/identifying-dependencies/predecessor-successor-relationships-dependencies.html) — **[documented]**

**The `···` overflow menu is real; Rally calls it the `Actions` menu.** Documented contents: **New, Convert, Split, Pin, Copy, Deep Copy**, plus Delete and Print — and "**Available options will vary depending on the type of work item you are viewing.**" [Detail Editor Actions Menu](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/common-pages-and-elements/detail-editor/detail-editor-actions-menu.html) — **[documented]**

**Sidebar field order: there is deliberately no fixed order.** "To customize your detail editor, you can **drag and drop any of the fields** on the screen… The customizations that you make to your detail editor **do not affect how other users see** the work item." And: "Your workspace admin has the ability to **override and lock** the fields that display in this page **and the order** of those fields at the workspace level… based on the artifact type… They can also specify **different fields/order for each level of the portfolio item hierarchy**." [Drag and Drop Fields in the Detail Editor](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/common-pages-and-elements/detail-editor/customizing-the-detail-editor/drag-and-drop-fields-in-the-detail-editor.html) — **[documented]**. So **[no authoritative source found]** for a canonical sidebar order, and none can exist — asking "what order does Rally use?" is the wrong question; it is per-user and admin-lockable.

**Important caveat on our Tier-1 recommendation #2:** the Associate-Artifacts page says to use the `Milestones` field "on the right hand side" of the artifact detail editor, but `Milestones` is **not** in the documented **User Story** field list — it *is* documented for portfolio items. [User Story Fields](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/building-your-backlog/user-stories/user-story-fields.html). The two Broadcom pages are in tension. Milestone association for stories and defects is independently confirmed ("You can associate a variety of work item types with a milestone including portfolio items, **user stories**, test artifacts, or **defect artifacts**"), so the field exists in practice and the User Story Fields page is likely incomplete — but flag this as **thin** rather than settled.

### Our clone: **MATCHES on Connections and on the collection-page pattern**

From `rally-04-item-detail.png`:

- Tabs `Details`, `Tasks 0`, `Defects 0`, `Revision History` **with count badges**: **MATCHES** Rally's documented count-badged collection ribbon, and `Tasks` / `Defects` / `Revision History` are all in Rally's 18-collection catalog. **Note the brief is stale here:** it describes our tabs as "Details/Tasks/History plus Connections," but this screenshot shows a **Defects** tab and **no Connections tab** — the tab set varies by build. Rally also varies its collection set by type, so per-type tabs are Rally-correct behaviour.
- A **`···` more-actions menu** and a `Watch` button top-right: **MATCHES** — Rally's header has exactly a `Watch` button and an `Actions` overflow menu (New / Convert / Split / Pin / Copy / Deep Copy / Delete / Print). Worth stocking ours from that list; `Convert` (defect→story) and `Split` are genuinely useful Rally behaviours.
- An `Attachments` block inside Details rather than a tab: **MATCHES** — Rally treats Attachments as a field, not a collection tab.
- A **`Linked Items`** block with `+ Link item`: **DIVERGES in naming.** Rally's concept is **`Dependencies`** (predecessors/successors), restricted to stories and portfolio items in the same workspace. If our block is a generic any-to-any linker, that is an invention; if it is predecessor/successor, rename it `Dependencies` and adopt the type restriction.
- Sidebar `Schedule State` (segmented control), `Flow State`, `Owner`, `Team`, `Plan Estimate (pts)`, `Iteration`, `Release`, `Creation Date`: all real Rally fields. **Order is a non-question** — Rally's order is user-draggable and admin-lockable per type, so there is nothing to match. Two notes: (a) the omission of a `Milestones` field matters (Q1), with the documentation caveat above; (b) Rally's User Story field list contains **no `State`**, only `Schedule State` and `Flow State` — which our sidebar gets right.
- The `Connections` (GitHub) tab, where present: **MATCHES Rally** — Rally ships exactly this for user stories and defects, showing PR name + link + timestamp with a count badge, and additionally a feature-flagged `Changesets` sub-tab and an optional `Connections` list column.

**Consequence:** the Connections tab should be reclassified from "undocumented invention" to "documented Rally parity feature" — we are ahead of the audit's assumption here, and Rally's Changesets sub-tab plus Connections column show where to extend next. The real gaps on this page are the missing `Milestones` field and the `Linked Items` naming.

---

## Recommended changes, ranked by confidence

### Tier 1 — high confidence, documented Rally behaviour, act now

1. **Add artifact add/remove to the Milestone detail tab.** Rally's milestone detail page has an Artifacts collection page with `Add New` and a multi-select `Remove`, plus six roll-up fields. The BA mockup's checkbox toggling was right. *(Q1)*
2. **Add a `Milestones` association field to the work-item detail sidebar** — Edit → checkbox list + search, Rally's documented artifact-side flow, documented as living "on the right hand side." Cheapest possible fix that makes milestones usable. *(Q1, Q10)*
3. **Collapse the milestone date window to a single manual `targetDate`.** Delete `targetStartDate`/`targetEndDate` and delete the "derived from linked Releases" logic entirely. Rally has one `TargetDate` and never derives it. *(Q2)*
4. **Drop the `Progress` column from the Releases list and the percent + progress bar + burndown from Release detail.** Rally's Release has no percent-done field, and Rally's release chart is a *burnup* under Reports. Our spec's ban is correct; the UI violates it. *(Q3)*
5. **Make Release `Start Date` required.** Rally marks it required; `rally-08-releases.png` shows it empty on both rows. *(Q4)*
6. **Fix the defect Delete inconsistency.** Rally allows defect delete for Project Editors, backed by a Recycle Bin. Either wire the API (ideally with soft-delete) or remove the bulk Delete button. Shipping a button against a refusing API is a guaranteed error path. *(Q6)*
7. **Allow defect reopen (`closed → open`).** Rally documents no transition guard whatsoever, and our own Quality KPI strip already renders a `REOPENED` tile for a state we forbid reaching. *(Q6)*
8. **Stop exposing `rootCause` on User Stories — and source it before keeping it anywhere.** `RootCause` is absent from Rally's documented Defect field list, and defect triage fields (`Severity`, `Environment`, `FoundInBuild`, `Resolution`) are `Defect`-type attributes with no Story counterpart. Gate defect-only fields by artifact type. *(Q7)*
9. **Adopt the "cannot add work items to an accepted release" guard.** Documented Rally rule, currently unimplemented, and a much better use of the `accepted` state than a progress bar. *(Q5)*
10. **Keep nullable `severity` and `state` on defects.** Verified as Rally-correct — `Project` is the *only* required field on a Rally defect. Remove this from the gap list. *(Q7)*

11. **Remove `priority` (and `state`) from User Stories.** Newly sourced and stronger than a wrong-enum complaint: a Rally User Story has **no Priority field at all** and **no State field** — only `Schedule State` and `Flow State`. Broadcom staff tell customers these "do not exist on User Stories out of the box"; Rally orders stories by drag rank plus the boolean `Expedite`. *(Q7)*
12. **Rename `Linked Items` to `Dependencies` and restrict it** to stories + portfolio items in the same workspace, with predecessor/successor semantics. That is Rally's actual related-items concept; a generic any-to-any linker is an invention. *(Q10)*
13. **Drop bulk `Copy`.** Rally has `Copy` / `Deep Copy` as *per-item* actions only; it is not in the Bulk Actions family (edit / delete / restore / permanently delete). *(Q8)*

### Tier 2 — medium confidence, strong architectural argument

14. **Move the progress bars from Release to Portfolio.** Rally documents per-row Percent Done bars as *default columns* on the Portfolio Items page — Blue = Complete, Green = On Track, Yellow = At Risk (>20% below needed rate), Red = Late (>40% below), with hover callouts — and none on Releases. We have it exactly backwards. Semantics: `PercentDoneByStoryCount` = accepted stories ÷ total; `PercentDoneByStoryPlanEstimate` = accepted points ÷ total points. This fix net-deletes code. *(Q3, Q9)*
15. **Replace the per-field bulk buttons with one generic Bulk Edit dialog** — and copy Rally's documented guard rails verbatim: **≤500 items**, **≤4 fields at a time**, shared-fields-only for mixed-type selections, hidden fields editable, and for defects set the parent via `User Story` / `Portfolio Item` rather than `Parent`. This subsumes Assign-Release and Assign-Iteration and scales to every future field. *(Q8)*
16. **Drop the milestone `Status` enum (`Planned`/`At Risk`) and the `Associated Releases` join,** or document both as deliberate extensions. Neither exists in Rally's milestone model. *(Q2)*
17. **Add milestone Project scoping** (multi-project checkbox list + workspace-scoped flag), and enforce Rally's documented constraint that "**Work items and milestones must share the same project.**" This is the mechanism our Releases join is standing in for. *(Q2, Q7)*
18. **Reclassify the Connections tab as Rally parity in the gap audit,** and note the extension path: Rally's Connections also has a feature-flagged **`Changesets`** sub-tab and can be surfaced as a **list/board column**. *(Q10)*
19. **Add a milestone ID column** using the `MI` prefix. Rally's `Milestone` has a `FormattedID` (`MI444`); `rally-07-milestones.png` has none. Note the deliberate asymmetry: Milestone has a FormattedID, Release does not. *(Q2, Q4)*
20. **Rethink the Portfolio page metaphor.** Rally has **no hierarchy-tree portfolio page** — Portfolio Items is a flat, filterable, single-type list driven by a Type drop-down; nesting lives on **Work Views** and the **Children** collection tab. Also add Rally's third level (Theme) or make levels data-driven (Rally supports up to five, exposed as a 0-based `Ordinal`), and rename `+ New Initiative` to something level-agnostic. *(Q9)*
21. **Switch portfolio rank from up/down buttons to drag-and-drop.** Now high confidence: Rally's default is drag-and-drop over a base-94, 64-char `DragAndDropRank` string, sibling-relative, with a global side effect; the toolbar fallbacks are **Rank Highest / Rank Lowest / Move to Position**. Rally has no arrow buttons anywhere. *(Q9)*
22. **Stock the `···` menu from Rally's Actions menu:** New, Convert, Split, Pin, Copy, Deep Copy, Delete, Print. `Convert` (defect → story, which sets state closed and resolution `Converted`) and `Split` are genuinely useful. *(Q10)*

### Tier 3 — low confidence, low value, or verify first

23. **Align defect `Priority` values or accept the divergence knowingly.** Rally's *published* default set is **Resolve Immediately / High Attention / Normal / Low** (KB 143259); ours is `Urgent / High / Normal / Low`. Values are admin-customizable, so this is a seed-data choice — but `Urgent` appears nowhere in Rally. Our `Severity` set (`Major Problem`, …) matches the widely-reported Rally set. *(Q7)*
24. **Read defect enum values from config, not code.** `Severity`, `Environment` and `Resolution` default lists are **not** Broadcom-published (only `State` and `Priority` are); pull real values per-workspace via the `AllowedValues` walk in KB 57584. Treat ours as seed data. *(Q7)*
25. **If we ever want state enforcement, model it as Rally Work Rules,** not a hard-coded state machine: admin-configured Required / Read-only / Must-match rules over field conditions, where "Errors restrict the state movement." Rally's own example is a Defect State rule. *(Q6)*
26. **Consider a Release Tracking page + a release burnup under Reports** as the Rally-shaped home for release progress, if demand is real. Rally warns the burnup is for "trend analysis rather than a way of counting story points." *(Q3)*
27. **Confirm Release `Project` is immutable after create** in our code. Rally: "defaults to the your current project and **cannot be edited**." *(Q4)*
28. **Add missing Rally defect fields** if defect management matters: `Environment`, `Resolution`, `Found in Build`, `Found in Release`, `Target Build`, `Verified in Build`, `Duplicates`, `Blocked`/`Blocked Reason`, `Expedite`, `Target Date`. Build fields are free-text alphanumeric in Rally, not enums. *(Q7)*
29. **Note that WSAPI cannot restore from the Recycle Bin** (KB 100861) — if we build soft-delete, the restore path must be UI/authenticated-session only to match Rally, or we knowingly diverge. *(Q6)*
30. **Leave the top-level `Releases` nav item alone.** Rally nests releases under Plan > Timeboxes, but this is cosmetic and a flatter nav is defensible.
31. **Don't defend the KPI strips** (Releases, Quality, Portfolio) as Rally parity — no source found for any of them, on any Rally page. Harmless as a product choice.
32. **Do not implement "flag artifacts whose timebox ends after the milestone target date"** on the strength of this report. It is plausible and was reported by a parallel researcher, but I searched for it specifically — including Broadcom's dedicated TargetDate-behaviour KB 224914 — and found nothing. Verify against a live Rally tenant first. *(Q2)*
33. **Undocumented, verify empirically if it matters:** whether `Severity`/`Priority` allow a blank/None value; the Defect `State` create default (`Submitted` is inferred, never asserted); whether `Name` is required on a Defect (absent from Rally's own Defect Fields page); Recycle Bin retention/purge policy; the `Resolution` default list. *(Q6, Q7)*

---

## Evidence-quality summary

| Question | Confidence | Basis |
|---|---|---|
| 1. Timebox-side assignment | **High** | Verbatim steps from 5 TechDocs pages, both directions |
| 2. Milestone model | **High** | Add-a-Milestone + official Rally Python example + KB 10947 + KB 224914 |
| 3. Release progress | **High** | Complete Release field reference (absence) + PortfolioItem field reference (presence) + burnup chart page |
| 4. Release fields | **High** | Release Fields page, verbatim, incl. `Version` and Project immutability |
| 5. Release state | **High** | Release Fields page, verbatim, all 3 values with descriptions |
| 6. Defect lifecycle | **High** throughout | KB 211628 (independence), KB 57584 (State enum via AllowedValues), Modifying Schedule States (6 states), Delete a Defect page, Recycle Bin pages, Work Rules pages, KB 100861 |
| 7. Defect fields | **High** on required-ness (`Project` only), the field list, `Priority` defaults and cross-type exclusion; **Low** on `Severity`/`Environment`/`Resolution` enums | Defect Fields + Creating Defects + User Story Fields pages, KB 143259, KB 57589, Broadcom-employee community answers |
| 8. Bulk actions | **High** | Bulk Actions + Edit Multiple Work Items pages verbatim, incl. the 500-item / 4-field caps |
| 9. Portfolio hierarchy | **High** on the 3-level ladder, customizability, flat-list UI and drag rank; **Low** on KPI strip (absent) | Portfolio Item Types, Rename Portfolio Item Types, Finding Portfolio Items, Using the Portfolio Items Page, Drag-and-Drop Ranking, KB 47752 |
| 10. Detail layout | **High** on Connections, the collection ribbon, the Actions menu and Dependencies; **N/A** on sidebar order (Rally has none by design) | Detail Editor + Collections Summary + Actions Menu + Dependencies + Changesets pages |

### Not sourced anywhere — flagged honestly

- Rally milestone **status / at-risk flagging**, and the "flag artifacts whose timebox ends after the milestone target date" behaviour (searched specifically, incl. KB 224914)
- Rally milestone **`Owner`** field
- A **KPI / stat-tile strip** on any Rally page (Releases, Quality, or Portfolio)
- A Rally **bulk `Copy`** action — Copy / Deep Copy are per-item only
- A Rally **"Portfolio Hierarchy" page** or **"Roadmap" page** — Timeline and Work Views are the real surfaces
- A **canonical work-item sidebar field order** — and none can exist: Rally's is per-user draggable and admin-lockable
- A **certified per-type collection/tab matrix** (only the Tasks example is published)
- `RootCause` as a Rally field on **any** artifact type — Broadcom staff recommend a custom field
- A **User Story `Priority`** value list — because a Rally User Story has no Priority field at all
- Default value lists for defect **`Severity`**, **`Environment`**, **`Resolution`** (only `State` and `Priority` are published)
- Defect **`State` create default**; whether **`Name`** is required on a Defect; **Recycle Bin retention/purge** policy
- Whether **`Severity`/`Priority` accept a blank/None** value
- The full **WSAPI object model** — `typedefinition` is auth-gated (`rally1.rallydev.com/slm/doc/webservice/` 302s; `typedefinition` 401s unauthenticated)

### Known conflicts inside Broadcom's own documentation

1. **Portfolio default types:** Rally Help says three (Theme/Initiative/Feature); the ValueOps Insights admin guide says four (adds **Strategy**) with no level number given.
2. **Portfolio level reordering:** Rally Help says order can be changed *only by renaming*; the Insights-era Setup UI documents drag-and-drop reordering.
3. **Milestones on stories:** the Associate-Artifacts page directs you to a `Milestones` field on the artifact detail editor, but `Milestones` is absent from the documented **User Story** field list (it is documented for portfolio items).
4. **Bulk-action UI generation:** legacy CA Agile Central help describes a gear menu with named bulk sub-actions; current Rally help describes a toolbar Edit icon → generic field picker. Build against the current model.
5. **The Rally-Jira WIC "Set Up States and Resolutions" page** — the most likely official source for the `Resolution` enum and for the "only Defects have State and Resolution" rule — is search-indexed but **404s on direct fetch**. Worth retrying or requesting via Broadcom support.
