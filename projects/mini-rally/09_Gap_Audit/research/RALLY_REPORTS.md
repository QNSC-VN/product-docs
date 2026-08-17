# Rally Reports & Charts — Reality Check vs Mini-Rally Clone

Research date: 2026-08-04
Scope: Broadcom Rally Software (formerly CA Agile Central). Sources restricted to
`techdocs.broadcom.com` (Rally help), `knowledge.broadcom.com` (KB), and the Rally
Lookback API reference at `rally1.rallydev.com/analytics/doc/`.
`help.rallyuxr.com` and `rally.com` were excluded as unrelated products.

Clone artefacts audited:
- `04_Developement_tracking/Phase 6/02_Iteration_Burndown/SRS.md`
- `04_Developement_tracking/Phase 6/03_Velocity_Chart/SRS.md`
- `04_Developement_tracking/Phase 6/04_Team_Capacity/SRS.md`
- (`01_Release_Tracking` exists as a 4th package; noted where relevant)

Evidence labels: **[DOCUMENTED]** = stated in Rally help/KB. **[API-SCHEMA]** =
from Lookback/WSAPI field reference. **[COMMUNITY]** = third-party/unofficial.
**[NO SOURCE]** = no authoritative source found; do not treat as fact.

---

## Executive summary

| # | Topic | Verdict |
|---|---|---|
| 1 | Report inventory | Reports page shape **MATCHES**; coverage **DIVERGES** badly (Rally ships ~25 charts, we ship 3–4) |
| 2 | Iteration Burndown series | Dual-axis hours+points **MATCHES**; Ideal formula **DIVERGES** |
| 3 | Burndown vs Burnup | Clone **HAS NO RALLY ANALOGUE** for burnup — we ship zero scope lines |
| 4 | Velocity | Segments **MATCH** almost exactly; window default + Best3/Worst3 **DIVERGE / INVENTION** |
| 5 | Team Capacity | **IS AN INVENTION** as a report; measures partly match the Team Status *page* |
| 6 | Historical strategy | **DIVERGES in mechanism** — Rally freezes *facts*, not *chart points*; persisted Ideal baseline **IS AN INVENTION** |
| 7 | Scope change | Historical bars **MATCH** in observable outcome; frozen Ideal **DIVERGES** |
| 8 | Filters / scoping | "No second project picker" **MATCHES** Rally's Reports surface |
| 9 | Export | **DIVERGES** — Rally exports PDF/JPG/CSV; the *role-gated* framing has **NO SOURCE** |
| 10 | Permissions | **MATCHES** if reports follow project visibility; a Viewer can see them |

Priority items 6 and 7 are answered in full below. Short version: **the "frozen
snapshot" half of our architecture reaches a Rally-faithful *outcome* by a
non-Rally *mechanism*, and the "persisted Ideal baseline" half is an invention
that actively contradicts Rally's documented ideal-line formula.**

---

## 1. Rally's report/chart inventory and where charts live

**Rally does have a single, real Reports menu.** "Most charts are accessible
through the Reports menu." The Reports page itself offers a keyword **"Report
Filter"** field to narrow the list of reports, and a **"Show Details"** toggle
that hides images and descriptions so only report names show.
[DOCUMENTED — https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reporting/rally-reports-and-charts.html]

Two platform-wide limits apply to reports: **maximum date range visible on a
report is 13 months**, and **maximum number of projects viewable on a report is
200** (exceeding it returns no data).
[DOCUMENTED — same URL]

### Reports menu catalogue (6 categories)

**Burndown / Burnup Charts** [DOCUMENTED — https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reporting/rally-reports-and-charts/burndown-burnup-charts.html]
1. Iteration Burndown Chart — "displays work remaining and completed in the iteration"
2. Iteration Burnup Chart — "displays work delivered so far in the iteration"
3. Release Burnup Chart — work completion plus scope, "and this can change"
4. Story Burnup Chart — "displays the work that was completed on a user story"
5. Story Burndown Chart — "displays the remaining estimated work to deliver the story"
6. Tagged Story Burndown Chart — "the trend of total accepted points aggregated for all stories tagged with a common tag"

> **Notable absence: Rally ships NO "Release Burndown" report.** The release-level
> chart in the Reports catalogue is **Release Burnup**. Our `01_Release_Tracking`
> package should be checked against Release Burnup, not against a burndown.

**Cumulative Flow Charts** [DOCUMENTED — https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reporting/rally-reports-and-charts/cumulative-flow-charts.html]
7. Iteration Cumulative Flow Diagram — "the rolled up states of all scheduled items"
8. Release Cumulative Flow Diagram
9. Story Cumulative Flow Diagram

**Throughput and Velocity Charts** [DOCUMENTED — https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reporting/rally-reports-and-charts/throughput-and-velocity-charts.html]
10. Cycle/Lead Time Chart — "the average number of days it takes work to flow through your process"
11. Throughput Chart — "a count of work items that are accepted in a given interval such as weeks, months, quarters"
12. Velocity Chart — "displays all accepted plan estimate units for each of the last 10 completed iterations"

**Defect Analysis Charts** [DOCUMENTED — https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reporting/rally-reports-and-charts/defect-analysis-charts.html]
13. Iteration Defects by Priority · 14. Iteration Defects by State · 15. Defects by
Priority · 16. Defects by State · 17. Defect Trend · 18. Release Defect Trend ·
19. Top Files by Defects

**Build Health Charts** — a category in the left nav of Rally Reports and Charts.
[DOCUMENTED — same defect-analysis URL, nav listing]

**Custom Reports** — two types, "Work items" and Timesheets; "no limit on quantity".
[DOCUMENTED — https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reporting/rally-reports-and-charts/custom-reports.html]

Plus a help topic **"How to Troubleshoot Chart-Related Issues"** in the same nav.

### Charts also live outside the Reports menu

- **Reports > Insights** — Rally Insights is reached via "Reports, Insights" and
  covers Predictability, Responsiveness, Quality, Productivity, with named charts
  including **Velocity** and **Variability of Velocity**, plus Flow Metrics.
  [DOCUMENTED — https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reporting/rally-insights/viewing-insights-metrics.html]
- **Iteration Status page** — list and board views; teams "quickly evaluate an
  iteration's status and progress with comprehensive metrics and charts on the
  **Iteration Progress banner**" and can "visualize iteration data in multiple
  ways using charts". Also exports to CSV.
  [DOCUMENTED — https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/iteration-status-page.html]
- **Team Board page** — toggling to chart view exposes 7 chart tabs: Cycle Time,
  Cumulative Flow, Flow Metrics, Scatterplot/Histogram, **Capacity Forecast**,
  **Delivery Forecast**, Aging Chart. "The Team Board only displays work items
  from the current project."
  [DOCUMENTED — https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/team-board-page.html]
- **Dashboards** (under the Home tab) — users "configure multiple pre-built and
  custom apps", including **Iteration Burndown**, Iteration Dashboard, Iteration
  Summary, My Defects/Tasks/Test Cases, Blocked Work, Ready to Accept, Custom
  List, Custom HTML.
  [DOCUMENTED — https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/common-tasks/collaborate-with-team-members/dashboards.html]
- **Custom Views + Rally Widgets** — e.g. the **Velocity/Throughput Widget**.
  [DOCUMENTED — https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/managing-custom-views/rally-widgets/core-rally-widgets/velocity-throughput-widget.html]
- **App Catalog** — Super Customizable Iteration Chart, Super Customizable
  Release Chart, Iteration Dashboard, Release Dashboard.
  [DOCUMENTED — https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reference/extending-rally-with-apps/app-catalog/super-customizable-iteration-chart.html]

### Verdict

**Structural shape: MATCHES.** Rally really does have one Reports page listing
report types, rendered one at a time. Our "Reports page, pick a report type, one
rendered at a time" is Rally-faithful in form.

**Coverage: DIVERGES.** Rally's Reports menu alone carries ~19 named charts plus
unlimited custom reports plus Insights; we ship 3 (4 with Release Tracking). Two
of our three (Iteration Burndown, Velocity) map to real Rally reports; the third
(Team Capacity) does not exist as a Rally report at all (see §5).

---

## 2. Iteration Burndown — axes, units, Ideal line, scope change

### Series and units

Rally's Iteration Burndown Chart plots **three series in two units at once**:
- "Remaining task hours are **blue bars**"
- "completed story points are **green bars**"
- "the **ideal burndown rate** is a **black line**, based on the task estimate"

"You can hover over the bars or line to see detailed figures on current and past
progress." The only documented setting is: "Enable the legend for the app from
the Settings menu."
[DOCUMENTED — https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reporting/rally-reports-and-charts/burndown-burnup-charts/iteration-burndown-chart.html]

So the answer to "hours, points, or both" is **both** — task To Do hours for the
remaining-work bars, story points for the accepted/completed bars. Rally's
sibling Iteration Burnup page confirms the x-axis convention: "The horizontal
axis represents the dates."
[DOCUMENTED — https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reporting/rally-reports-and-charts/burndown-burnup-charts/iteration-burnup-chart.html]

### Scoping constraint

"If you select a parent project in your scoping, all teams under that parent (and
including the parent) must have **the same Iteration cadence** to access the
Iteration Burndown chart."
[DOCUMENTED — iteration-burndown-chart.html]

### The Ideal line — how it is actually computed

The stock Iteration Burndown help page says only that the ideal line is "based on
the task estimate" and gives no formula. **[NO SOURCE]** for a formula on that
page.

The formula *is* documented on Rally's official App Catalog charts, which are the
customisable versions of the same chart:

> "The line calculates the total amount of story or task work scheduled in the
> **iteration**, and divides that figure by the **total number of days**."
> [DOCUMENTED — https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reference/extending-rally-with-apps/app-catalog/super-customizable-iteration-chart.html]

> "The line calculates the total amount of story or task work scheduled in the
> **release**, and divides that figure by the **total number of days**."
> [DOCUMENTED — https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reference/extending-rally-with-apps/app-catalog/super-customizable-release-chart.html]

Three things follow:
1. It is a **straight line** — a single constant slope, total work ÷ total days.
2. It is over **total number of days**, i.e. **calendar days of the timebox, not
   working days only**.
3. It is expressed in the **present tense from currently scheduled work** — there
   is no documented "capture at start" step. See §6/§7.

The Super Customizable Iteration Chart also documents two ideal-line variants —
**"Burndown To Do"** (trends downward) and **"Burnup Accepted"** (trends upward)
— and three unit options: **Story** (Plan Estimate field), **Task** (Task
Estimate field), **To Do** (To Do field of tasks).
[DOCUMENTED — super-customizable-iteration-chart.html]

### Weekends / non-working days

Rally *does* have a workday configuration: "The default workdays are configured
at the **workspace level** by a subscription or workspace administrator. The
default values are **Monday through Friday**."
[DOCUMENTED — https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reporting/rally-insights/changes-to-rally-insights.html]

But the documented *chart* control for excluding them is an **Insights** control,
not a burndown control: the "Exclude Non-Workdays" toggle "excludes non-working
days, such as weekends, when calculating metrics that have a duration element,
such as Time in Process" and "does not exclude holidays".
[DOCUMENTED — viewing-insights-metrics.html]

**[NO SOURCE]** for any statement that the stock Iteration Burndown chart removes
weekends from its x-axis or from its ideal-line denominator. The only documented
denominator is "the total number of days".

### Scope added mid-iteration

**[NO SOURCE]** for an explicit statement about the Iteration *Burndown* under
mid-iteration scope change. However Rally documents the contrast directly:

> "A burnup chart differs from a burndown chart in that the burnup includes a
> **scope line** that allows you to visualize when work has been added or removed
> from the project."
> [DOCUMENTED — iteration-burnup-chart.html]

The clear implication, stated by Rally as the *reason burnup exists*: the
Iteration Burndown has **no scope line**, so added scope appears only as an
upward bump in the To Do bars, with no way to distinguish "team slipped" from
"scope grew". Rally's answer to mid-iteration scope change is *use the burnup
chart* (§3).

### Verdict

| Clone rule (`02_Iteration_Burndown/SRS.md`) | Rally | Verdict |
|---|---|---|
| Blue/teal bars = Task To Do hours, left axis | blue bars = remaining task hours | **MATCHES** |
| Green bars = Accepted points, right axis | green bars = completed story points | **MATCHES** |
| Dark line = Ideal, in hours, on left axis | black line = ideal, "based on the task estimate" | **MATCHES** |
| Iteration picker with prev/select/next + date range | iteration scoping exists; picker widget shape not documented | **MATCHES** (shape [NO SOURCE]) |
| `All Teams` aggregates teams in project for the same shared timebox | Rally requires all teams under a scoped parent share the same iteration cadence | **MATCHES** in intent |
| x-axis = iteration **working days**; Ideal reaches zero on last working day | ideal = total work ÷ **total number of days** | **DIVERGES** |
| `ideal(i) = totalTaskEstimateAtStart * (1 - i/(N-1))` from an **immutable baseline captured at iteration start** | ideal recomputed from work **currently scheduled** in the iteration | **DIVERGES** (see §6) |
| `Behind plan` / `On track` status indicator | — | **IS AN INVENTION** ([NO SOURCE]) |
| No scope line | Rally also has none *on burndown* — but ships 3 burnup charts that do | **MATCHES** narrowly, **gap** overall (§3) |

---

## 3. Burndown vs Burnup — which is which

| Rally chart | Plots | Location | Source |
|---|---|---|---|
| **Iteration Burndown** | Blue bars = remaining task hours; green bars = completed story points; black line = ideal rate. Purpose: "proactively anticipate whether the committed work will be delivered by the iteration end date"; also useful "during iteration retrospective meetings". | Reports | [DOCUMENTED — iteration-burndown-chart.html] |
| **Iteration Burnup** | "The vertical axis represents the accepted work in hours." "The horizontal axis represents the dates." "Completed story points are green bars." "Total scope of work in the iteration is a black line." | Reports | [DOCUMENTED — iteration-burnup-chart.html] |
| **Release Burnup** | Two lines: accepted/completed work, and a **scope line** representing "how much work is in the project as whole (the scope as workload), and this can change". "Hover over any section of either line to display the exact number of units accepted and those planned for the release per day." | Reports | [DOCUMENTED — https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reporting/rally-reports-and-charts/burndown-burnup-charts/release-burnup-chart.html] |
| **Story Burndown** | Blue bars = Task "To Do" hours; green bars = completed/accepted story points; **red dotted line = release dates**. Header metrics include estimated points, stories with tasks, stories scheduled in releases, "points of estimated child stories". Default start date = **"today minus 30 days"**, adjustable via dropdown calendar. For a parent story, "the Task To Do hours and the Accepted points of each child story are graphed in this chart." Access: "selecting Reports, then Story Burndown"; search story by ID or keyword (min 3 chars). | Reports | [DOCUMENTED — https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reporting/rally-reports-and-charts/burndown-burnup-charts/story-burndown-chart.html] |
| **Story Burnup** | "the total scope of work per day and the total accepted work per day". Green bars = accepted points; black line = scope based on estimated points, "changes reflect adjustments to story estimates"; red dotted line = release dates. "The report begins when there an estimate is entered." Shows a forecasted completion date. Access: Reports > Story Burnup. | Reports | [DOCUMENTED — https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reporting/rally-reports-and-charts/burndown-burnup-charts/story-burnup-chart.html] |
| **Tagged Story Burndown** | "the trend of total accepted points aggregated for all stories tagged with a common tag" | Reports | [DOCUMENTED — burndown-burnup-charts.html] |

**Documentation inconsistency worth flagging:** the Iteration Burnup page says the
vertical axis "represents the accepted work in **hours**" while simultaneously
saying the plotted bars are "completed **story points**". Rally's own help text is
self-contradictory here; do not treat either as settled. **[DOCUMENTED but internally inconsistent]**

**Key structural fact:** in Rally, *burndown* charts carry an **ideal line** and no
scope line; *burnup* charts carry a **scope line** and no ideal line. That is the
whole distinction. And Rally has **no Release Burndown report** — release-level
tracking in the Reports catalogue is Release Burnup.

### Verdict

**Clone: HAS NO RALLY ANALOGUE for burnup.** We ship zero burnup charts and zero
scope lines anywhere. That means the clone has **no way at all** to show
mid-flight scope change, which is the single documented purpose of three separate
Rally reports (Iteration Burnup, Release Burnup, Story Burnup). This is the
largest functional hole found in this audit after §5.

Also: if `01_Release_Tracking` is modelled as a release **burndown**, it has no
Rally counterpart and should be re-specified against **Release Burnup**.

---

## 4. Velocity chart

Rally's Velocity Chart "displays all accepted plan estimate units for each of the
last 10 completed iterations" and measures "the pace at which teams get work done
and how much work a team can accomplish in a given iteration".
[DOCUMENTED — throughput-and-velocity-charts.html]

Detail page:
- **Window:** "The Iteration Velocity chart only displays values for the **last 10
  (or fewer)** iterations in which work items have been scheduled." Iterations
  with nothing scheduled on the last day are excluded.
- **Segments — three, stacked, mutually exclusive:**
  - "**Dark green** bars show the total amount of accepted work that was delivered **by the last day**"
  - "**Light green** bars show the total amount of accepted work that was delivered **since the last day of this iteration**"
  - "**Red** bars show the total amount of work **during the iteration that was not accepted**"
- **Trend:** "The **dark green line** represents the **proposed velocity**, which is
  the **average accepted points in the last 10 iterations**."
[DOCUMENTED — https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reporting/rally-reports-and-charts/throughput-and-velocity-charts/velocity-chart.html]

**Partially-accepted work:** yes, in the sense that work accepted *late* is
tracked and shown separately (light green) rather than dropped or merged into the
on-time figure.

### PlanEstimate vs Iteration.PlannedVelocity — both exist, different roles

- The **Velocity Chart** is computed from **accepted plan estimate units**, i.e.
  accepted `PlanEstimate`. Not from `PlannedVelocity`.
  [DOCUMENTED — velocity-chart.html]
- **`PlannedVelocity` is a real WSAPI field on both Iteration and Release.**
  [API-SCHEMA — https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reference/rally-web-services-api/api-versioning.html]
  Its business meaning: a field set "when creating an iteration in Rally to record
  how many user story points the team believes it can complete."
  [DOCUMENTED — https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-iterations/iteration-planning/planning-process.html]
- Where the two meet: the **Velocity/Throughput Widget** has a **"Show Planned
  Velocity"** option that draws "an additional line on the chart for the planned
  user story points that can be **compared to** the accepted points." The widget
  also exposes: artifact type, velocity (points) vs throughput (count), bucketing
  (iterations, releases, …), **configurable number of buckets to display**, legend
  toggle, and trend overlay (none / trendline / moving average). It renders "a
  stacked bar chart of team velocity (story points) or throughput (story count)
  for schedulable artifacts" with "color-coding showing on-time versus late
  acceptances".
  [DOCUMENTED — velocity-throughput-widget.html]

So the answer to "PlannedVelocity, accepted PlanEstimate, or both" is: **the
Velocity Chart uses accepted PlanEstimate; PlannedVelocity is a separate planning
field that appears as an optional comparison overlay on the widget variant.**

### Verdict

| Clone rule (`03_Velocity_Chart/SRS.md`) | Rally | Verdict |
|---|---|---|
| 3 mutually exclusive stacked segments | 3 mutually exclusive stacked segments | **MATCHES** |
| Accepted During Iteration (dark green) | dark green = accepted by the last day | **MATCHES** — including colour |
| Accepted After Iteration (light green) | light green = accepted since the last day | **MATCHES** — including colour |
| Not Accepted (red) | red = work during the iteration not accepted | **MATCHES** — including colour |
| Invariant: three segments sum to all assigned points | implied by mutually exclusive stacking | **MATCHES** |
| Only `acceptedDuring` feeds trend/averages | proposed velocity = "average **accepted** points" | **MATCHES** (Rally's phrasing is ambiguous on late-accepted; treat as [NO SOURCE] for the exact inclusion rule) |
| Dark-green Trend line = window average | dark green line = proposed velocity = average over last 10 | **MATCHES** — including colour |
| Eligible iteration requires end date < today AND ≥1 assigned Story/Defect | "last 10 (or fewer) iterations in which work items have been scheduled"; empty iterations excluded | **MATCHES** |
| Excludes Tasks and Features from bars | Rally velocity is over "schedulable artifacts" (stories/defects; widget lets you choose artifact type) | **MATCHES** for the base chart |
| Window selector **Last 5 / Last 10, default Last 5** | Rally: fixed **last 10** on the base chart; **configurable bucket count** only on the widget | **DIVERGES** (default should be 10) |
| **Last 3 / Best 3 / Worst 3** summary averages | — | **IS AN INVENTION** ([NO SOURCE]) |
| Y-axis unit "Velocity points" | accepted plan estimate units | **MATCHES** |
| Report title `Velocity - Accepted Iterations` | Rally calls it "Velocity Chart" | cosmetic **DIVERGES** |
| Velocity "recalculated from current Iteration assignment"; moving an item into/out of an old iteration changes that bar | Rally segments are described as work "during the iteration"; Rally charts read Lookback history (§6) | **DIVERGES (likely)** — but the exact attribution rule is **[NO SOURCE]** |
| No PlannedVelocity overlay | widget offers "Show Planned Velocity" comparison line | **gap**, not a divergence for the base chart |

This is the most faithful of our three reports. The segment model, the colours,
and the trend line all match Rally's documented design closely enough that it
looks derived from it. Two real fixes: default window 10, and drop or relabel
Best3/Worst3 as a non-Rally extension.

---

## 5. Team Capacity — does Rally have this report?

**No.** There is **no report or chart named "Team Capacity"** anywhere in Rally's
Reports catalogue. It does not appear in Burndown/Burnup, Cumulative Flow,
Throughput and Velocity, Defect Analysis, Build Health, or Custom Reports.
[DOCUMENTED by absence — rally-reports-and-charts.html and all six category pages]

Rally has **four** distinct things in this space, none of which is a report:

### (a) Team Status page — the true closest analogue

Located under Tracking, *not* Reports. "This page displays all project team
members in **bold** font, with their assigned tasks and individual capacity by
project for the selected iteration."

Columns and definitions, verbatim:
- **Capacity** — "The rolled up total of all capacity units entered by all team members"
- **Estimate** — "The total of task estimates for all tasks per selected iteration"
- **To Do** — "The amount of effort remaining to complete all tasks"

**There is no Actuals column.**

**Status column:** a colour-coded progress bar "indicating the percentage of
stated individual capacity taken up by tasks assigned to that person. The
percentage is calculated by **dividing the task estimate total by the
individual's cumulative capacity across all of their projects**." Green when "the
calculated percentage is 100% or less"; red when "greater than 100%".

**Grouping:** rows are **member-first**, expandable to per-project rows. "Columns
display the cumulative totals per project and are rolled up for all projects on
the team member row." Scoped to a single project, "the project row is removed".

**Capacity is editable here** — requires "edit permissions to change the current
project artifacts" (subscription/workspace/project administrator or editor).

**Controls:** iteration dropdown; optional "Show Filters" with conditions like
user Name or Project; toggles for "Show disabled users" and "Show Users Without
Tasks".
[DOCUMENTED — https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/additional-tracking-pages/view-team-status-page.html]

Also relevant: **Team Member** permission means a user "appears in team member
drop-downs and Team Status page."
[DOCUMENTED — https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/managing-users/creating-and-editing-users/set-user-access-permissions.html]

### (b) Team Planning page — a per-iteration capacity strip, in points

"The bar next to each iteration displays the size of each work item relative to
the **velocity** of the iteration." The page lets you "easily view the velocity of
work items in a given iteration and whether the team is **over capacity**."
[DOCUMENTED — https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/team-planning-page.html]

This is a **points/velocity** capacity strip, not an hours capacity table.

### (c) Team Board > Capacity Forecast / Delivery Forecast — Monte Carlo, not capacity accounting

"The Capacity Forecast tab displays the Capacity Forecasting Tool that you can
use to produce sound estimates for future work, including the confidence levels
for an estimate… The Capacity Forecasting Tool uses the **historical data** of a
team as the starting point." The Delivery Forecast tab produces "Confidence of
Delivery" and "Delivery Monte Carlo Simulation" charts.
[DOCUMENTED — https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/team-board-page/view-charts-on-the-team-board/capacity-forecasting-tool.html and https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/team-board-page/view-charts-on-the-team-board/delivery-forecasting-tool.html]

These are probabilistic forecasting tools. They are **not** what our Team Capacity
report is. Do not use the name similarity as justification.

### (d) Capacity Planning page — PI/portfolio level, multi-team

"The Capacity Planning page is typically used for planning work for a PI or
Release for multiple teams. The planning in this page focuses on work at the
**portfolio item level**." Once published, "individual teams can use the Team
Planning page to focus on work at the user story level".
[DOCUMENTED — https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page.html]

### Rally's underlying capacity model

Per-member capacity is derived from "three simple measures for each team member:
Number of ideal hours in the work day, Days in the iteration that the person will
be available, Percentage of time the person will dedicate to this team." Worked
example: "5 team members x 6 ideal hours x 5 **working days** = 150 hours of task
capacity."
[DOCUMENTED — planning-process.html]

Note that Rally's own capacity arithmetic uses **working days** — while its ideal
burndown line uses **total days** (§2). The inconsistency is Rally's, not ours.

### Verdict

| Clone rule (`04_Team_Capacity/SRS.md`) | Rally | Verdict |
|---|---|---|
| A **report** named "Team Capacity" on the Reports page | no such report; the analogue is the Team Status **page** under Tracking | **IS AN INVENTION** (as a report; the content has a page analogue) |
| Measure: Capacity = SUM(member capacity hours) | Team Status "Capacity" = rolled up total of all capacity units entered by team members | **MATCHES** |
| Measure: Estimate = SUM(task.estimate) | Team Status "Estimate" = total of task estimates per selected iteration | **MATCHES** |
| Measure: ToDo = SUM(task.todo), explicitly **not** Estimate − Actual | Team Status "To Do" = effort remaining to complete all tasks | **MATCHES** |
| Measure: **Actual** = SUM(task.actuals) | Team Status has **no Actuals column** | **IS AN INVENTION** for this surface (Actuals is a real Task field elsewhere) |
| Grouping **Team → Member** | Rally groups **Member → Project** | **DIVERGES** |
| Read-only; "no editable capacity control is part of the approved report" | Team Status capacity **is editable** in place (editor+) | **DIVERGES** |
| "No **Utilization** card, progress bar, extra chart" | Team Status' defining feature *is* a utilization bar: task estimate total ÷ cumulative capacity, green ≤100% / red >100% | **DIVERGES** — we deliberately removed the one thing Rally actually ships |
| Capacity summed only within the selected project/team | Rally sums a person's capacity "across all of their projects" for the utilization %; columns roll up per project | **DIVERGES** |
| Member list = union of (capacity record holders) ∪ (task owners); missing capacity shows `0h` | Rally has "Show Users Without Tasks" toggle, implying task-owner-driven default plus an opt-in for capacity-only members | **MATCHES** in intent, **DIVERGES** in that Rally makes it a toggle |
| Iteration picker prev/select/next | Rally: iteration dropdown | **MATCHES** in intent |
| Multi-team membership shown once per team, not merged | Rally shows per-project rolled up on the member row | **DIVERGES** |

Bottom line: our Team Capacity is a **read-only re-skin of Rally's Team Status
page, relocated into the Reports menu, with Actuals added and utilization
removed**. Every individual measure except Actual has a Rally counterpart, but the
container, the grouping axis, the editability, and the headline indicator all
diverge. There is no Rally report to be faithful to here — this is a BA decision,
but it should be *documented as a deliberate departure*, not presented as a Rally
report.

---

## 6. Historical data strategy — PRIORITY

### What Rally actually does

**Rally persists an immutable history of the *artifacts*, and recomputes chart
*series* from that history on every view. Rally does not persist chart points.**

The persistence layer is the **Analytics snapshot store**, exposed as the
**Lookback API**:

> "The data is stored in a **snapshot schema** which means that every time there
> is a change, an entirely new snapshot of the effected entity is saved with the
> new values (as well as the previous ones). The **older snapshot is not
> removed**. It is only updated to adjust its `_ValidTo` timestamp."
> [DOCUMENTED — https://knowledge.broadcom.com/external/article/259226/what-are-the-various-date-fields-in-look.html]

Field semantics, verbatim:

| Field | Meaning | Source |
|---|---|---|
| `_ValidFrom` | "the date that the snapshot was created. Combined with the `_ValidTo` date, it provides a window of time that the values in the snapshot were the values that were set on the corresponding work item." Snapshots are **inclusive of `_ValidFrom`, exclusive of `_ValidTo`**. | [API-SCHEMA — KB 259226; https://rally1.rallydev.com/analytics/doc/] |
| `_ValidTo` | "represents the date the snapshot was superseded by a new snapshot, or if the `_ValidTo` date is shown as `9999-…` then that snapshot is the current and has not been superseded by any other snapshots." | [API-SCHEMA — KB 259226] |
| `_PreviousValues` | "stores the values that were replaced when this particular snapshot was added." | [API-SCHEMA — KB 259226; analytics/doc/] |
| `_SnapshotDate` | "an indication of when the snapshot was **built or rebuilt**. It is **not very reliable for customer use** as it could track the `_ValidFrom`, `_ValidTo` or, neither of those dates if a **data rebuild** was necessary. **It is not recommended to use this date value in applications or reports.**" | [API-SCHEMA — KB 259226] |
| `_SnapshotNumber` | sequential identifier per work item | [API-SCHEMA — analytics/doc/] |
| `RevisionDate` | "the date/time stamp shown in the Revision History of the work item for that revision number. This date should be similar to `_ValidFrom` but may be off by a few seconds". | [API-SCHEMA — KB 259226] |

The Lookback guide's stated design principle:

> "**We want to encourage you to think of the past as unchangeable.**"

and the accompanying instruction to reapply queries at different historical
timestamps rather than querying current items and inspecting their past.
[DOCUMENTED — https://rally1.rallydev.com/analytics/doc/]

### Confirmation that Rally's own charts run on Lookback

The KB title itself is the evidence: **"Forbidden error 403 when a non-admin user
loads a LookbackAPI chart that scoped to include closed projects."** Cause:
"Lookback API does not remove closed projects inaccessible to a given user from
the query's scope." Non-workspace-admins who never had access to a
since-closed project get a 403 when a chart's scope includes it.
[DOCUMENTED — https://knowledge.broadcom.com/external/article?articleId=57608]

That a *user loading a chart in the Rally UI* receives a *Lookback API*
permission error is direct evidence that the built-in historical charts are
served by Lookback queries executed **at view time**, not from pre-materialised
chart rows.

### Which values are frozen vs recalculated

| Value | Behaviour | Why |
|---|---|---|
| Historical To Do / accepted-points / state-count series | **Frozen in effect** — the underlying snapshots are never rewritten, only `_ValidTo`-capped | [DOCUMENTED — KB 259226] |
| The chart series itself | **Recalculated on every view** by re-querying Lookback | [DOCUMENTED — KB 57608 + analytics/doc/] |
| **Ideal line** | **Recomputed, not persisted** — "calculates the total amount of story or task work **scheduled in the iteration**, and divides that figure by the total number of days" | [DOCUMENTED — super-customizable-iteration-chart.html] |
| **Burnup scope line** | **Recomputed and explicitly expected to move** — "the scope as workload, and this can change" | [DOCUMENTED — release-burnup-chart.html] |
| Velocity bars | Recomputed per view over "the last 10 (or fewer) iterations" | [DOCUMENTED — velocity-chart.html] |

**Rally does not persist an Ideal/baseline line.** No documented Rally field,
object, or snapshot stores a captured iteration-start task-estimate total.
**[NO SOURCE]** for any Rally baseline-capture mechanism.

### Rally's history is not absolutely immutable

Two documented caveats against treating Rally as a perfect append-only store:
1. `_SnapshotDate` may change "if a **data rebuild** was necessary" — Broadcom does
   rebuild snapshot data. [DOCUMENTED — KB 259226]
2. A real defect class exists where historical chart data is wrong and only
   Broadcom can repair it: "The Iteration Burndown chart shows double data
   counts." Cause: "Changing Workspace timezones during the middle of an
   iteration can cause the chart data to double." Resolution: "The data will need
   to corrected by **Development**."
   [DOCUMENTED — https://knowledge.broadcom.com/external/article/241505/rallyiteration-data-consistency-problem.html]

Our SRS's "corrections require an audited administrative process owned by
DEV/operations" is therefore a **legitimate Rally-analogous** escape hatch.

### Verdict on the clone's architecture

Our clone (`02_Iteration_Burndown/SRS.md` §4–5) persists an
`IterationDailySnapshot { iterationId, date, remainingToDo, acceptedPoints }`
plus `Iteration.totalTaskEstimateAtStart`, and declares the snapshot
"authoritative for history" with a nightly idempotent job.

| Aspect | Verdict |
|---|---|
| "Charts must read history, not live data" | **MATCHES** the intent of Rally's design |
| "A later scope or estimate edit does not recalculate old snapshots" | **MATCHES** Rally's observable outcome for the historical bars |
| Mechanism: persist the **computed chart point**, keyed by iteration + date | **DIVERGES** — Rally persists the **artifact revision**, keyed by ObjectID + `[_ValidFrom, _ValidTo)`, and derives chart points on demand |
| Granularity: one row per **calendar day** | **DIVERGES** — Lookback is continuous-time; any instant is queryable |
| **Persisted immutable Ideal baseline** (`totalTaskEstimateAtStart`) | **IS AN INVENTION.** No Rally analogue. Rally's ideal is a *recomputed* function of currently scheduled work ÷ total days |
| "Missing historical snapshots are reported as unavailable… must not interpolate or fabricate" | **MATCHES** in spirit; Rally's `_SnapshotDate` warning and rebuild caveat show Rally treats gaps as data problems too |
| Snapshots corrected only by audited admin process | **MATCHES** (KB 241505 precedent) |

**Three consequences of the mechanism divergence that the BA should weigh:**

1. **We cannot answer questions Rally can.** Rally can render a Story Burndown
   starting "today minus 30 days" across arbitrary date ranges up to 13 months,
   for any artifact, at any granularity, because it queries a general-purpose
   history store. Our iteration-keyed daily snapshot table can render exactly one
   chart. Every additional historical report (Iteration Burnup, Release Burnup,
   3 Cumulative Flow charts, Story Burndown/Burnup, Defect Trend) would need its
   own new snapshot table. That is 8+ tables and 8+ nightly jobs, versus one
   history store. **This is the real cost of the architectural choice, and it is
   a scaling cost, not a correctness cost.**
2. **A missed nightly run is unrecoverable in our design and recoverable in
   Rally's.** Our SRS already concedes this ("historical Task ToDo cannot be
   reconstructed reliably", §9). Rally can always recompute because the source
   revisions are still there.
3. **Timezone/DST changes hit us the same way they hit Rally** (KB 241505), and we
   have less ability to repair.

The clone's approach is a **defensible simplification** of Rally, not a mistake —
but it is not "Rally-faithful architecture", and the persisted Ideal baseline is
straightforwardly non-Rally behaviour.

---

## 7. Scope-change handling — PRIORITY

### What Rally does

**Rally splits this into two answers, and our SRS collapses them into one.**

**(a) The historical series preserves what was true at the time.** When a work
item moves between iterations, the earlier snapshot is not rewritten — it keeps
its old `Iteration` value and is merely `_ValidTo`-capped, with the superseded
value recorded in `_PreviousValues.Iteration`. The documented technique for
finding moved items is literally `{"_PreviousValues.Iteration": {"$exists": true}}`.
[DOCUMENTED — https://knowledge.broadcom.com/external/article/57591/lookback-api-how-to-find-work-items-that.html and KB 259226]

Combined with the guide's "think of the past as unchangeable"
[DOCUMENTED — https://rally1.rallydev.com/analytics/doc/], the answer for the
historical bars is: **the chart preserves what was true at the time; historical
points do not change retroactively.**

**(b) Derived reference lines *are* expected to move, and Rally makes that
visible on purpose.**
- The **ideal line** is a function of what is *currently* scheduled ÷ total days,
  so adding scope raises the ideal. [DOCUMENTED — super-customizable-iteration-chart.html]
- The **burnup scope line** exists precisely to show the movement: "the burnup
  includes a scope line that allows you to visualize when work has been added or
  removed from the project" [DOCUMENTED — iteration-burnup-chart.html]; Release
  Burnup's scope "can change" [DOCUMENTED — release-burnup-chart.html]; Story
  Burnup's black line "changes reflect adjustments to story estimates"
  [DOCUMENTED — story-burnup-chart.html].

There is **[NO SOURCE]** for how Rally's Velocity Chart attributes an item moved
into or out of a *completed* iteration. Rally's own phrasing — "work **during the
iteration** that was not accepted" — leans toward historical membership, which
would contradict our explicit real-time-attribution rule, but this is not
settled.

### Verdict

| Clone rule | Rally | Verdict |
|---|---|---|
| Moving a Story/Defect after a snapshot does not rewrite that snapshot (`02_Iteration_Burndown` §5, example 3) | historical snapshot keeps the old Iteration; past is unchangeable | **MATCHES** (outcome) |
| Changing Plan Estimate after a snapshot does not rewrite its Accepted Points | same | **MATCHES** |
| Task edits today affect today's/future snapshots only | same | **MATCHES** |
| Reopened item drops out of the *next* snapshot; finalized snapshots unchanged | consistent with `_ValidTo` capping | **MATCHES** |
| **"Changing Task Estimate after Iteration start does not change Ideal"** (§5, example 4) | Rally's ideal is recomputed from currently scheduled work ÷ total days, so it **does** change | **DIVERGES** |
| No scope line on any report | Rally ships 3 burnup charts whose entire purpose is the scope line | **DIVERGES / no analogue** |
| Velocity recomputed from **current** iteration assignment; moving an item into an old iteration adds it to that old bar (`03_Velocity_Chart` §4) | Rally charts read Lookback history; segment wording says "during the iteration" | **DIVERGES (likely)**, exact rule **[NO SOURCE]** |
| "Unlike Burndown, Velocity is not frozen by a daily or Iteration-end snapshot" (`03_Velocity_Chart` §4) | Rally has **one** historical model for all charts, not two | **DIVERGES** — the clone's split-brain (burndown frozen, velocity live) has no Rally analogue |

**The single most important finding for the BA:** our clone freezes *more* than
Rally does in one place (the Ideal line) and *less* than Rally does in another
(Velocity attribution), producing an internally inconsistent history model that
Rally does not have. Rally has exactly one rule — *the past is unchangeable, the
present is recomputed* — and every chart obeys it. Our clone has two rules and
they point in opposite directions.

---

## 8. Report filters and scoping

### On the Reports page itself

- **"Report Filter"** keyword field — narrows the **list of reports**, not the data.
- **"Show Details"** toggle — hides images/descriptions, showing only report names.
- Limits: **13-month max date range**, **200-project max**.
[DOCUMENTED — rally-reports-and-charts.html]

### Data scoping comes from the global project scoping picker

There is no documented per-report project picker on Rally's standard charts. The
evidence is indirect but consistent:
- Iteration Burndown: "If you select a parent project in **your scoping**, all
  teams under that parent … must have the same Iteration cadence to access the
  Iteration Burndown chart." [DOCUMENTED — iteration-burndown-chart.html]
- Custom Reports: "based on the **current project** and any additional filters you
  define"; "If you choose filters with values partially or wholly outside the
  scoped project, you may generate incomplete or blank reports."
  [DOCUMENTED — custom-reports.html]

### Per-surface controls that do exist

| Surface | Controls | Source |
|---|---|---|
| Iteration Burndown / Burnup | Settings menu → enable legend. Iteration scoping via global scope + cadence constraint. | [DOCUMENTED — iteration-burndown-chart.html, iteration-burnup-chart.html] |
| Story Burndown / Burnup | story search by ID or keyword (min 3 chars); start date via dropdown calendar, default **today − 30 days** | [DOCUMENTED — story-burndown-chart.html] |
| Custom Reports | "I want to see" (metric) + "Broken down by" (grouping, incl. test case / defect / custom fields except text type); filters with static values or "select the filter value **dynamically** for iteration, release, or tag filters" | [DOCUMENTED — custom-reports.html] |
| Rally Insights | project/team selector with search; Work Item Type (User Stories / Defects / Portfolio Items); timebox Months or Quarters; "Normalize Data Based on FTE"; **"Exclude Non-Workdays"**; flow-metric filters (State Type, Start/End State, Investment Category, Units) | [DOCUMENTED — viewing-insights-metrics.html] |
| Team Status page | iteration dropdown; "Show Filters" (Name, Project); "Show disabled users"; "Show Users Without Tasks" | [DOCUMENTED — view-team-status-page.html] |
| Velocity/Throughput widget | artifact type; velocity vs throughput; bucketing (iterations/releases); **number of buckets**; legend; Show Planned Velocity; trend (none / trendline / moving average) | [DOCUMENTED — velocity-throughput-widget.html] |
| Dashboards | per-app project override — a user on multiple teams can "set up more than one app, each pointing to a **different Rally project**" | [DOCUMENTED — dashboards.html] |
| Team Board | "only displays work items from the current project" | [DOCUMENTED — team-board-page.html] |

### Verdict

**Our deliberate "no second project/team filter" MATCHES Rally's Reports
surface.** Rally's standard reports inherit the global project scope; there is no
second picker. Our clone's decision is Rally-faithful.

Two documented gaps:
- **Date-range control**: Rally's Story Burndown exposes an adjustable start date
  (default today − 30d) and the platform supports up to 13 months. Our
  iteration-picker-only model has no date range at all. **DIVERGES** (minor —
  applies to Story-level charts we don't ship).
- **Per-widget project override** exists on Dashboards, not on Reports. Not a gap
  for us since we have no Dashboards surface. **NO RALLY ANALOGUE needed.**

Our iteration prev/select/next picker shape is **[NO SOURCE]** — Rally documents
an iteration *dropdown* on Team Status. Cosmetic.

---

## 9. Export

**Rally does export reports, in three formats.** From the report preview, "you can
save the report or save it as **PDF, JPG, or CSV** formats"; and "You can save
custom reports on the Reports page, save as PDF, JPG, or CSV formats, or **print
them with annotations**." The control is in the **upper-right corner** of the
report preview interface.
[DOCUMENTED — https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reporting/rally-reports-and-charts/custom-reports.html]

Other export paths:
- List pages: "you can import and export data in the format of a **CSV** file from
  **most list pages** in Rally."
  [DOCUMENTED — https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/importing-and-exporting-data.html]
- Iteration Status page has CSV export.
  [DOCUMENTED — iteration-status-page.html]
- Rally Add-in for Microsoft Excel exports data to Excel.
  [DOCUMENTED — https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/integrating-with-rally/broadcom-rally-connectors/rally-integrations/rally-add-in-for-microsoft-excel-2010-and-2013/rally-add-in-for-excel-2010-and-2013-installation-and-user-guide/export-data-to-excel.html]
- KB guidance lists "export the data out of Rally and create the report in a tool
  of your choice" as one of five documented reporting strategies.
  [DOCUMENTED — https://knowledge.broadcom.com/external/article/10258/how-to-generate-reports-in-rally.html]

**Is export role-gated?** The documented gate is on **saving and sharing**, not on
exporting: "Only **subscription or workspace administrators** can save and share
reports", with visibility options "Just me" / "Anyone can view" / "Anyone can
view, edit, or delete".
[DOCUMENTED — custom-reports.html]

**[NO SOURCE]** for a Rally permission named or functioning as "Export Report".

### Verdict

- Our clone has **no export at all** → **DIVERGES**. Rally exports its report
  surface as PDF, JPG, and CSV from a control in the report's upper-right corner,
  and CSV from most list pages.
- The BA doc's role-gated **"Export Report"** action → **IS AN INVENTION**. Rally
  gates *save/share of custom reports* on workspace/subscription admin, not
  *export*. Export in Rally follows read access.

---

## 10. Reports permissions

Rally's documented permission levels, verbatim:

**Workspace level** [DOCUMENTED — https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/managing-users/creating-and-editing-users/set-user-access-permissions.html]
- **No Access** — "No visibility to the workspace or projects in the workspace."
- **User** — access to the workspace, with per-project permissions set separately.
- **Workspace Admin** — workspace administrator permissions.

**Project level** [DOCUMENTED — same URL]
- **No Access** — "No visibility to the project (Default value for each user)."
- **Viewer** — "Access to view the project and all work items within the project."
- **Editor** — "Access to create, edit, and delete all work items inside the
  project. Create, edit, and delete milestones."
- **Team Member** — automatically an editor; "appears in team member drop-downs
  and Team Status page."
- **Project Admin** — manage project settings, create child projects, manage work
  items, edit viewer/editor/team-member permissions, create users if enabled.

Hierarchy rules: "You cannot view or edit a user if you have lesser permissions
than that user"; project admins can only manage permission levels below their own
and cannot edit their own.
[DOCUMENTED — https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/managing-users/creating-and-editing-users/editing-user-project-permissions.html]

**Crucially: no permission level mentions reports or charts.** Chart/report access
is not a separate right — it follows **project visibility**. A plain **Viewer** can
view the project and all work items within it, and no documented gate stops them
from opening a report scoped to that project.
[DOCUMENTED for the permission definitions; **[NO SOURCE]** for an explicit
"Viewers can open reports" sentence — this is inference from the absence of a
report-specific right.]

The three real gates found:
1. **Custom report save/share** — "Only subscription or workspace administrators
   can save and share reports." [DOCUMENTED — custom-reports.html]
2. **Team Status capacity editing** — requires "edit permissions to change the
   current project artifacts" (subscription/workspace/project admin or editor).
   [DOCUMENTED — view-team-status-page.html]
3. **Closed-project Lookback scope** — non-workspace-admins who lack access to a
   closed project in a chart's scope get a **403**. [DOCUMENTED — KB 57608]

### Verdict

**MATCHES**, provided our clone gates reports on project read access rather than
on a distinct "view reports" role. If our implementation introduces a separate
report-viewing right, that **IS AN INVENTION**.

The one Rally behaviour we should copy: **report data must be filtered by the
caller's project visibility**, and reports must not silently include projects the
caller cannot see (Rally's bug here produces a 403; ideally we filter instead).

---

## Recommendations, ranked by confidence

### High confidence — fix code

1. **Velocity default window → Last 10, not Last 5.** Rally's chart is defined as
   "the last 10 (or fewer) iterations". Keep the 5/10 selector; change the
   default. [velocity-chart.html] — **fix code**
2. **Ideal line: recompute from currently scheduled work, and use total days, not
   working days.** Rally: "total amount of story or task work scheduled in the
   iteration, divided by the total number of days." Drop
   `Iteration.totalTaskEstimateAtStart` / `totalTaskEstimateCapturedAt` as the
   *sole* ideal source. If the BA wants a stable baseline for a variance KPI,
   keep the field but plot the recomputed ideal as the chart's ideal, or plot
   both and label the frozen one "Baseline (Mini-Rally extension)". This is the
   clearest single divergence found. [super-customizable-iteration-chart.html] —
   **fix code + amend SRS §3 IB-BR-03 and §5 example 4**
3. **Resolve the split-brain history model.** Burndown frozen + Velocity live is
   internally inconsistent and matches nothing in Rally. Pick one rule. Rally's
   rule: past facts immutable, present derivations recomputed. Recommend
   attributing velocity segments by **iteration membership as at the iteration
   end date** (historical), which makes both reports obey one rule.
   [analytics/doc/ "think of the past as unchangeable"; KB 57591] —
   **fix code + amend SRS `03_Velocity_Chart` §4**
4. **Add export.** Rally exports reports as PDF, JPG, CSV from a control in the
   report's upper-right corner. At minimum ship CSV of the plotted series.
   [custom-reports.html] — **fix code**
5. **Remove the role gate on "Export Report" from the BA doc.** Rally's gate is on
   *saving/sharing custom reports* (workspace/subscription admin), not on export.
   Export follows read access. [custom-reports.html] — **amend SRS / BA doc**

### High confidence — amend SRS (documentation, not code)

6. **Relabel Team Capacity as a deliberate non-Rally surface.** No Rally report by
   that name exists in any of the six report categories. Its content is Rally's
   **Team Status page** (Tracking, not Reports), which additionally is *editable*
   and whose headline indicator is exactly the utilization bar we removed. Record
   this as a conscious departure so nobody later "fixes" it toward a
   non-existent Rally target. [view-team-status-page.html] — **amend SRS**
7. **Record Best 3 / Worst 3 / Last 3 as a Mini-Rally extension.** Rally ships one
   average — the "proposed velocity" line. The three-way summary has no Rally
   counterpart. Not harmful; just label it. [velocity-chart.html] — **amend SRS**
8. **Record "Behind plan / On track" as a Mini-Rally extension.** No documented
   Rally status indicator on the Iteration Burndown. — **amend SRS**
9. **Document the snapshot-table architecture's cost explicitly.** Rally's
   Lookback store serves ~12 historical charts from one schema; our per-report
   daily snapshot table serves one chart each. Every future historical report
   costs a new table + a new nightly job, and a missed run is unrecoverable (our
   SRS already admits this). Put this in the architecture doc so the trade is
   made with open eyes. [KB 259226; KB 57608] — **amend SRS / architecture doc**
10. **Re-baseline `01_Release_Tracking` against Release *Burnup*.** Rally ships no
    Release Burndown report. [burndown-burnup-charts.html] — **amend SRS**

### Medium confidence — BA decision, weak or no Rally target

11. **Consider adding one burnup chart with a scope line.** This is the clone's
    biggest *functional* hole: three separate Rally reports exist solely to
    visualise mid-flight scope change, and we have none. Iteration Burnup is the
    cheapest (green accepted bars + black scope line, same iteration scope as our
    burndown). [iteration-burnup-chart.html] — **BA decides** (recommend yes)
12. **Team Capacity grouping axis (Team→Member vs Rally's Member→Project) and the
    Actual column.** Rally's Team Status has no Actuals and groups member-first
    with per-project rollup. Both of ours are more useful for a single-project
    clone. — **no Rally target, BA decides** (recommend keep ours)
13. **Utilization indicator on Team Capacity.** We deliberately removed it; it is
    Rally's defining Team Status feature (task estimate ÷ capacity, green ≤100%,
    red >100%). Cheap to add and it is the one thing a capacity reader wants.
    [view-team-status-page.html] — **BA decides** (recommend reinstate)
14. **Weekend rendering on the burndown x-axis.** **[NO SOURCE]** for Rally's stock
    behaviour. Rally's *ideal denominator* is total days; Rally's *capacity
    arithmetic* uses working days; Rally's only documented weekend toggle is in
    Insights. Rally itself is inconsistent. — **no Rally target, BA decides**
15. **Report-list filter / "Show Details" toggle on the Reports page.** Rally has
    both. With three reports it is pointless for us. — **no Rally target, BA decides**
    (recommend skip)

### Low confidence / flagged as unresolved

16. **Velocity attribution for items moved into or out of a completed iteration.**
    **[NO SOURCE]** for Rally's exact rule. Rally's wording ("work *during the
    iteration*") suggests historical membership. Do not present either behaviour
    as Rally-verified in the SRS. — **BA decides, mark as unverified**
17. **Whether a plain Viewer can open reports.** The permission tables define
    Viewer as "Access to view the project and all work items within the project"
    and mention no report-specific right, so reports should follow project
    visibility — but there is **[NO SOURCE]** stating it outright. Safe default:
    gate on project read. — **fix code to gate on project read; mark inference**
18. **Iteration picker widget shape (prev/select/next vs dropdown).** Rally
    documents a dropdown on Team Status; **[NO SOURCE]** for the Reports charts.
    Cosmetic. — **no Rally target, BA decides**

---

## Source index

**Rally help — reporting**
- https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reporting.html
- https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reporting/rally-reports-and-charts.html
- https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reporting/rally-reports-and-charts/burndown-burnup-charts.html
- https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reporting/rally-reports-and-charts/burndown-burnup-charts/iteration-burndown-chart.html
- https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reporting/rally-reports-and-charts/burndown-burnup-charts/iteration-burnup-chart.html
- https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reporting/rally-reports-and-charts/burndown-burnup-charts/release-burnup-chart.html
- https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reporting/rally-reports-and-charts/burndown-burnup-charts/story-burndown-chart.html
- https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reporting/rally-reports-and-charts/burndown-burnup-charts/story-burnup-chart.html
- https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reporting/rally-reports-and-charts/cumulative-flow-charts.html
- https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reporting/rally-reports-and-charts/throughput-and-velocity-charts.html
- https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reporting/rally-reports-and-charts/throughput-and-velocity-charts/velocity-chart.html
- https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reporting/rally-reports-and-charts/defect-analysis-charts.html
- https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reporting/rally-reports-and-charts/custom-reports.html
- https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reporting/rally-insights/viewing-insights-metrics.html
- https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reporting/rally-insights/changes-to-rally-insights.html

**Rally help — tracking / planning / dashboards / widgets / apps**
- https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/iteration-status-page.html
- https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/team-board-page.html
- https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/team-board-page/view-charts-on-the-team-board/capacity-forecasting-tool.html
- https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/team-board-page/view-charts-on-the-team-board/delivery-forecasting-tool.html
- https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/additional-tracking-pages/view-team-status-page.html
- https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/team-planning-page.html
- https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page.html
- https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-iterations/iteration-planning/planning-process.html
- https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/common-tasks/collaborate-with-team-members/dashboards.html
- https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/managing-custom-views/rally-widgets/core-rally-widgets/velocity-throughput-widget.html
- https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reference/extending-rally-with-apps/app-catalog/super-customizable-iteration-chart.html
- https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reference/extending-rally-with-apps/app-catalog/super-customizable-release-chart.html

**Rally help — admin / export / API**
- https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/managing-users/creating-and-editing-users/set-user-access-permissions.html
- https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/managing-users/creating-and-editing-users/editing-user-project-permissions.html
- https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/importing-and-exporting-data.html
- https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/integrating-with-rally/broadcom-rally-connectors/rally-integrations/rally-add-in-for-microsoft-excel-2010-and-2013/rally-add-in-for-excel-2010-and-2013-installation-and-user-guide/export-data-to-excel.html
- https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reference/rally-web-services-api/api-versioning.html

**Lookback API**
- https://rally1.rallydev.com/analytics/doc/

**Broadcom KB**
- https://knowledge.broadcom.com/external/article/259226/what-are-the-various-date-fields-in-look.html
- https://knowledge.broadcom.com/external/article/57591/lookback-api-how-to-find-work-items-that.html
- https://knowledge.broadcom.com/external/article?articleId=57608
- https://knowledge.broadcom.com/external/article/241505/rallyiteration-data-consistency-problem.html
- https://knowledge.broadcom.com/external/article/10258/how-to-generate-reports-in-rally.html
