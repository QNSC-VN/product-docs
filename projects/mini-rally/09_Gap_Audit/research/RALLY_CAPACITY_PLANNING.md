# Rally Capacity Planning — Parity Research

**Date:** 2026-08-04
**Scope:** Does Broadcom Rally have a Capacity Planning feature, and how does it work?
**Method:** Official Broadcom TechDocs (Rally help, ValueOps solution docs), Broadcom Academy, and the
official `RallyTools/RallyRestToolkitForPython` (pyral) SDK for WSAPI type names.
**Excluded per brief:** `help.rallyuxr.com` (unrelated product), `rally.com` (unrelated company).

**Evidence labels:** `[DOCUMENTED]` = Broadcom product documentation · `[API-SCHEMA]` = official Rally
SDK / WSAPI type registry · `[COMMUNITY]` = Broadcom Academy blog / non-reference Broadcom content ·
`[NO SOURCE]` = no authoritative source found.

---

## HEADLINE FINDING

**Rally has a first-class page literally named "Capacity Planning", and it lives under the Portfolio
menu — exactly where our clone puts it.** `[DOCUMENTED]`

> "Select Portfolio, Capacity Planning." — [Create a Capacity Plan](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page/creating-a-capacity-plan/create-a-capacity-plan.html)

This overturns the premise recorded in our own code. `apps/web/src/widgets/app-shell/app-shell.tsx:120-122`
says:

> *"Rally names the capacity screen 'Release Planning'; we label it 'Capacity Planning' so the nav
> matches the page title and the spec's own wording."*

**That comment is factually wrong and should be deleted.** Rally has *both* pages, and they are
different products:

| Rally page | What it is | Nav |
|---|---|---|
| **Capacity Planning** | Multi-team, PI/Release-scoped plan object with draft/published lifecycle, per-team capacity numbers, and per-team allocations of portfolio items. **This is our analogue.** | Portfolio > Capacity Planning |
| **Release Planning** | A *board* — backlog column + one column per release; drag a card into a column to schedule it. No plan object, no lifecycle. | Planning > Release Planning |
| **Team Planning** | Downstream, story-level: pull from backlog into iterations, capacity bar per iteration. | Planning > Team Planning |

Sources: [Capacity Planning Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page.html) ·
[Release Planning Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/release-planning-page.html) ·
[Team Planning Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/team-planning-page.html)

**Consequence for the audit:** this feature is *not* an invention and *not* orphaned to the BA spec.
There is a rich, directly comparable Rally target, and our clone tracks it unusually closely — close
enough that several places where the SRS and the code disagree turn out to have the **code** on
Rally's side.

---

## 1. Does Rally have a Capacity Planning page?

**Rally does have a dedicated Capacity Planning page under the Portfolio menu.** `[DOCUMENTED]`
[Capacity Planning Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page.html)

What it does, per Broadcom:

- Extends release planning to answer **"can we build this in the specified timebox?"** by factoring in
  the number and size of teams, historical velocity and flow metrics.
- Is "typically used for planning work for a PI or Release for multiple teams, focusing on work at the
  **portfolio item level**".
- Lets planners "create multiple what-if scenarios and plans **without changing artifacts or execution
  data**".
- Sits *upstream* of the Team Planning page: "Once the Capacity Plan is complete and published,
  individual teams can use the Team Planning page to focus on work at the user story level."

Documented sub-surfaces (all under `/planning/capacity-planning-page/`): Designate Planners · Find and
View Capacity Plans · View Capacity Plan Details · Creating a Capacity Plan · Modify a Capacity Plan ·
Assign and Allocate Work to Teams in the Plan · Publish a Plan · Plan of Plans (Beta).

Plan types at creation: **Single Release**, **Multi Release**, **Plan of Plans**. `[DOCUMENTED]`
[Create a Capacity Plan](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page/creating-a-capacity-plan/create-a-capacity-plan.html)

The **Release Planning** page is a genuinely different thing: "a backlog list of lowest level portfolio
items that are not assigned to a release, and release columns… You can drag a card into a column to
schedule it in a release." Its only capacity affordance is a per-column status bar; "select the status
bar to set or update the planned velocity". `[DOCUMENTED]`
[Release Planning Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/release-planning-page.html)

> **Verdict: MATCHES.** Our nav placement (Portfolio > Capacity Planning), the plan-object model, the
> portfolio-item-level scope, and the what-if-without-touching-artifacts intent all match Rally. The
> only defect is the misleading code comment in `app-shell.tsx`.

---

## 2. Capacity units

**Rally makes the unit a plan-creation choice between "Points" and "Count", fixed for the plan.**
`[DOCUMENTED]`

> "Select Capacity Measurement Unit — Choose between 'Points' or 'Count' for viewing work items. This
> selection affects displayed values **and field names**."
> — [Create a Capacity Plan](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page/creating-a-capacity-plan/create-a-capacity-plan.html)

Because the unit renames the columns, every metric column is literally `Points/Count Rollup`,
`Points/Count Estimated`, `Points/Count Capacity`, `Points/Count Complete`. `[DOCUMENTED]`
[Items Tab](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page/view-capacity-plan-details/capacity-plan-items-tab.html)

- **Points** = story points; **Count** = number of user stories. "You can select whether you want to
  show user story and defect data as points or counts (number of user stories), and your selection
  changes the values and the field names that display."
- Rally's capacity plans do **not** use hours or headcount. Hours appear only in the *iteration*
  task-capacity model (question 5).
- The team capacity number is **stored on the plan, not on the timebox**: "stored in this plan only,
  not globally." `[DOCUMENTED]`
  [Define Capacity for a Team](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page/assign-and-allocate-work-to-teams-in-the-plan/define-capacity-for-a-team.html)

### `Iteration.PlannedVelocity` and `Release.PlannedVelocity` — confirmed semantics

`[DOCUMENTED]` Both exist and are **timebox-level fields, separate from the capacity plan's capacity
number.**

- `Iteration.PlannedVelocity`: "Specify the total number of points that the team thinks it can complete
  within this iteration." Units default to points "but are customizable" — you "may customize the
  definition of units to indicate some other unit of measure."
  [Iteration Fields](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-iterations/iteration-fields.html)
- `Release.PlannedVelocity`: same idea at release grain — "shows the amount of estimate units the team
  anticipates they can complete in the release", surfaced on the Timeboxes page and settable from the
  Release Planning board's column status bar.
  [Estimate Velocity for an Iteration](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-iterations/managing-iterations/estimate-velocity-for-an-iteration.html) ·
  [Release Planning Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/release-planning-page.html)
- `PlannedVelocity` is what drives the Iteration Planning Board's colour-coded meters, and "the meter
  will only display if a value has been entered in the Planned Velocity field."
- **Both are one scalar per timebox per project** — a project's iteration/release carries its own
  number. There is no per-plan override on them.

**Key structural point:** Rally deliberately does **not** reuse `PlannedVelocity` as capacity-plan
capacity. The plan holds its own `Points/Count Capacity` per project so that what-if planning does not
mutate execution data. Any clone design that writes plan capacity back onto `Release.PlannedVelocity`
diverges from Rally's separation.

> **Verdict: MATCHES** on unit model (fixed-per-plan Points-or-Count enum, chosen at creation, renames
> columns). Our `viewBy` field on the plan is Rally's Capacity Measurement Unit.
> Confirm our plan capacity is stored on the plan row and not on the Release — if it is on the Release,
> that part DIVERGES.

---

## 3. Draft vs Published

**Rally has an explicit Draft → Published lifecycle with a hard read-only gate, and an unpublish that
returns the plan to Draft.** `[DOCUMENTED]`

> "**Unpublished**: Visible only to designated planners; can be modified anytime.
> **Published**: Visible to all users; locked from modification."
> — [Capacity Planning Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page.html)

> "When a plan is in a published state, it can no longer be modified."
> — [Publish a Plan](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page/publish-a-plan.html)

Details:

- The plan header shows "current state (**Draft** or **Published**)". `[DOCUMENTED]`
  [View Capacity Plan Details](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page/view-capacity-plan-details.html)
- Publish is under the plan's **Actions** menu and offers **two variants**: publish *without* updating
  fields, or publish *and* write `Release`, `Planned Start Date`, `Planned End Date` onto every assigned
  portfolio item. `[DOCUMENTED]`
- **Revert exists**: plans "can be reverted to unpublished status to allow further modifications."
  Critically, the revert is **asymmetric** — "when you unpublish a plan, no changes are made to the
  field values in the portfolio items", so anything publish wrote must be cleared by hand.
  `[DOCUMENTED]`
- **Empty plans cannot be published**: "Empty plans (with no items or projects) that have never been
  published cannot be published; the publish option remains disabled." `[DOCUMENTED]`
- Gate is a **role**, not a project permission: "Only planners can create, modify, publish, and view
  draft plans. All users can view published plans." Planner is set by a subscription/workspace admin at
  Setup > Users > Permissions > Planner = Yes. And "a planner can publish or edit **anyone's** plans."
  `[DOCUMENTED]`
  [Designate Planners](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page/designate-planners.html)
- The `+/-` column on the Items tab exists specifically to diff a *republished* plan: items added after
  publication show `+` in green, removed show `-` in red. `[DOCUMENTED]`

Rally's **Release Planning** board, by contrast, has **no draft/published lifecycle** — it edits live
artifacts. `[DOCUMENTED]` (absence of any lifecycle in
[Release Planning Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/release-planning-page.html))

> **Verdict: MATCHES.** Our Draft → Published → Revert-to-Draft with a read-only published gate is
> exactly Rally's model, including planner-only draft visibility.
> Two gaps worth checking in our implementation: (a) do we offer the **two publish variants**
> (with/without writing Release + Planned Start/End onto Features)? (b) do we **disable publish on an
> empty plan**? Both are documented Rally behaviours.

---

## 4. Allocation of work to teams

**Rally allocates via one primary team assignment plus optional additional-team allocations with
per-team amounts, and the amount is a planner-entered override, not a live recalculation.**
`[DOCUMENTED]`

The core rule, verbatim:

> "You can only assign **one team** to each portfolio item. However, if you have a portfolio item that
> will be worked by multiple teams, you can assign the portfolio item to one **primary team** and then
> **allocate points or story counts to the additional teams**."
> — [View Capacity Plan Details](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page/view-capacity-plan-details.html)

And: "if a portfolio item is too large for one team to finish in a release, you can share it between
two or more teams." `[DOCUMENTED]`
[Assign and Allocate Work to Teams in the Plan](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page/assign-and-allocate-work-to-teams-in-the-plan.html)

Mechanics:

- **Single team:** on the Items tab, set the **`Planned Project Assignment`** field (inline dropdown).
  "The available capacity for the project is updated to reflect the assigned amount."
  [Assign Portfolio Items to a Team](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page/assign-and-allocate-work-to-teams-in-the-plan/assign-portfolio-items-to-a-team.html)
- **Multiple teams:** gear icon next to the portfolio item > **Allocate**. The dialog "shows the
  preliminary and refined estimates that are defined for the selected portfolio item." Pick the primary
  team in a **Project** dropdown, type an amount in the **Estimate** field, then **Add project** for
  each additional team with its own Estimate.
  [Allocate Portfolio Items to Multiple Teams](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page/assign-and-allocate-work-to-teams-in-the-plan/allocate-portfolio-items-to-multiple-teams.html)
- **Per-team amounts are free-form and need not reconcile:** "The values do not need to be equal between
  teams. The **sum of the values do not need to equal the original estimate**." Worked example: a
  40-point refined estimate assigned to Team A with the Estimate field left blank, plus 10 points to
  Team B, totals **50** points — a blank field means the whole current estimate lands on that team, and
  additional allocations **add** on top.
- **Snapshot vs live:** it is a **planner-entered override that displaces the derived estimate for load
  math** — "the estimate value entered here **overrides any previous value** when calculating team
  load." Meanwhile the plan's derived aggregates *are* live: "as you assign work, their available
  capacity is automatically updated to account for those assignments." So: **allocation amount =
  stored/manual; capacity consumption and rollups = recomputed.**
- **Multi-team display shape:** "When a portfolio item is allocated across multiple projects, the system
  displays the number of projects in the column, with each allocated project listed as a **separate row
  beneath** the portfolio item." Nested parent/child rows — the same shape as our team → allocation
  sub-table.
- **`Feature.Project` is untouched.** The Items tab carries *both* `Planned Project Assignment` (the
  plan's choice) and a separate read-only `Project` column showing "the project or team to which this
  portfolio item is currently assigned **outside the plan**." `[DOCUMENTED]`

### WSAPI allocation objects — confirmed

`[API-SCHEMA]` The official `RallyTools/RallyRestToolkitForPython` (pyral) v1.7.0 WSAPI type registry
declares a full capacity-plan object family:

```python
class CapacityPlan           (WorkspaceDomainObject): pass  # abstract base class
class CapacityPlanAssignment (WorkspaceDomainObject): pass
class CapacityPlanItem       (WorkspaceDomainObject): pass
class CapacityPlanProject    (WorkspaceDomainObject): pass
...
class WorkingCapacityAssignment(CapacityPlan): pass
class WorkingCapacityPlan      (CapacityPlan): pass
class PublishedCapacityPlan    (CapacityPlan): pass
```

Source: [pyral/entity.py](https://github.com/RallyTools/RallyRestToolkitForPython/blob/master/pyral/entity.py)
(lines ~432-435 and ~497-499)

Two things this proves:

1. **Yes, there is an allocation object** — `CapacityPlanAssignment` / `WorkingCapacityAssignment` — plus
   `CapacityPlanItem` (item-in-plan) and `CapacityPlanProject` (team-in-plan-with-capacity). That is a
   three-table join model, the same shape as our `features[] / teams[] / allocations[]`.
2. **The draft/published split is modelled in the schema itself**, not just in the UI:
   `WorkingCapacityPlan` vs `PublishedCapacityPlan` are distinct concrete types over an abstract
   `CapacityPlan`. Rally snapshots a published plan as a separate object.

`[NO SOURCE]` The field lists of these objects are not publicly documented. `rally1.rallydev.com/slm/doc/webservice/`
is login-gated with no archive capture, and no Broadcom KB article quotes their attributes.

> **Verdict: MATCHES.** One-primary-team-plus-additional-team-allocations, per-team amounts that need
> not sum to the estimate, a stored allocation amount that overrides the derived estimate for load,
> live-recomputed rollups, nested child rows, and `Feature.projectId` left alone — our model matches
> Rally on every documented point. Our P8 contract line "Allocation is fixed and plan-specific, may
> split one Feature across Teams and never changes `Feature.projectId`" is a correct reading of Rally.
> **One thing to verify:** Rally treats a **blank** allocation Estimate as "the whole current estimate
> lands here", and additional allocations **add** rather than subdivide. If our clone treats blank as
> zero, or forces allocations to sum to the estimate, that specific rule DIVERGES.

---

## 5. Team capacity per iteration — `UserIterationCapacity`

**The object name is confirmed. Its fields are not publicly documented.**

`[API-SCHEMA]` `UserIterationCapacity` is a real WSAPI type, spelled exactly that way, registered as a
`WorkspaceDomainObject`:

```python
class UserIterationCapacity (WorkspaceDomainObject): pass
```
[pyral/entity.py](https://github.com/RallyTools/RallyRestToolkitForPython/blob/master/pyral/entity.py) (line ~451)

`[API-SCHEMA]` It hangs off Iteration as a **collection named `UserIterationCapacities`** — evidenced by
the pyral bug report *"Iteration Query with UserIterationCapacities collection fails"*.
[RallyRestToolkitForPython issue #4](https://github.com/RallyTools/RallyRestToolkitForPython/issues/4)

`[NO SOURCE]` **Exact field list and uniqueness key: no authoritative source found.** The WSAPI schema
browser is login-gated with no archive capture; no Broadcom KB article or SDK enumerates the attributes.
From the collection name and the UI behaviour below, the key is almost certainly `(User, Iteration)`,
but **this is inference, not documentation** — do not cite it as fact.

**How per-member capacity is actually entered** `[DOCUMENTED]` — and note this is a *different* model
from the capacity plan:

- Surface: the **Team Status page** (and Iteration Status page), which "displays all project team
  members in bold font, with their assigned tasks and **individual capacity by project** for the
  selected iteration."
  [Team Status Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/additional-tracking-pages/view-team-status-page.html)
- **Unit: ideal/task hours**, not points. Rally's guidance: capacity = *ideal hours per work day* ×
  *days available in the iteration* × *percentage of time dedicated to this team*. Worked example:
  "5 team members × 6 ideal hours × 5 working days = 150 hours of task capacity."
  [Planning Process](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-iterations/iteration-planning/planning-process.html)
- **Entered inline** on the Team Status page; requires "subscription administrator, workspace
  administrator, project administrator, or project editor" rights.
- **Scoped per project, rolled up per person:** "columns display the cumulative totals per project and
  are rolled up for all projects on the team member row." The load percentage is "task estimate total
  divided by the individual's **cumulative capacity across all of their projects**" — i.e. a person can
  hold capacity in several projects for the same period.

**So Rally has two unrelated capacity models:**

| | Capacity Planning page | `UserIterationCapacity` |
|---|---|---|
| Grain | project/team × plan | person × iteration |
| Unit | points or story count | task hours |
| Where stored | on the plan | on the iteration |
| Purpose | can this PI be built? | is this person overbooked? |

> **Verdict: HAS NO RALLY ANALOGUE (for our feature).** `UserIterationCapacity` is **not** the object
> behind Rally's Capacity Planning page — it belongs to the task-hours iteration-planning model. Our
> Capacity Planning feature correctly corresponds to `CapacityPlanProject` (team capacity in points on
> a plan), not to `UserIterationCapacity`. If our SRS or ERD cites `UserIterationCapacity` as the
> parity target for this feature, that citation is wrong. If we ship no per-person hours capacity at
> all, that is a *separate* documented Rally feature we lack — a different gap, not this one.

---

## 6. Over-allocation warnings

**Rally warns; Rally never blocks.** `[DOCUMENTED]`

On the Capacity Planning page:

- The header carries a **Total Capacity status bar** showing "total estimated story points or count that
  is assigned to the plan as a percentage of total capacity", with a colour key and — decisively —
  "**Hover over the status bar to see additional information and any identified warnings for your
  plan.**" `[DOCUMENTED]`
  [View Capacity Plan Details](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page/view-capacity-plan-details.html)
- The header **Unassigned** count "shows in **yellow** if you have any unassigned portfolio items."
- On the Items tab, "an alert icon appears and the field is **highlighted** for any portfolio items that
  lack team assignments." `[DOCUMENTED]`
  [Assign Portfolio Items to a Team](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page/assign-and-allocate-work-to-teams-in-the-plan/assign-portfolio-items-to-a-team.html)
- A **warning icon for missing estimates** is called out. `[COMMUNITY]`
  [Using Rally for Capacity Planning](https://academy.broadcom.com/blog/valueops/rally/using-rally-for-capacity-planning)
- Guidance is advisory in spirit too: reserve "about 20% or so" of capacity for unplanned work rather
  than loading teams to 100%. `[COMMUNITY]` (same URL)

Elsewhere in Rally the same advisory pattern holds, and one page states the non-blocking behaviour
plainly:

- Team Status page individual load bar: **green** at ≤100%, **red** at >100% meaning the person is "over
  scheduled and at risk of not being able to complete all scheduled work". Rally does **not** prevent
  the assignment — it colours it. `[DOCUMENTED]`
  [Team Status Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/additional-tracking-pages/view-team-status-page.html)
- Team Planning page: a bar per iteration shows "the size of each work item relative to the velocity of
  the iteration", letting teams see "whether the team is **over capacity**"; if allocations exceed
  available capacity "the team planning page promptly identifies the issues and **displays a warning**."
  `[DOCUMENTED]`
  [Team Planning Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/team-planning-page.html)

`[NO SOURCE]` The exact wording and trigger thresholds of the capacity-plan warnings (e.g. whether
Rally has a named "Rollup exceeds Estimated" warning) are not documented.

> **Verdict: MATCHES.** Advisory-only, surfaced as a hover on a status bar plus per-row icons and
> highlighting, with a separate yellow treatment for unassigned items — that is our model. Our
> `warningFlags` + `capacity-bar-tooltip` + per-column warning icons are the right shape. Rally has **no
> hard stop** anywhere, so any place we *block* a save on over-capacity would diverge.
> Our specific warning *texts* ("Rollup exceeds Estimated", "Point Estimated missing") have no
> documented Rally counterpart — treat those strings as BA-owned.

---

## 7. Editability: inline grid cell vs dedicated dialog

This is the one place where the SRS, the code, and Rally are all in play — and **the answer splits by
column.**

**Rally: team Capacity is inline-editable in the grid.** `[DOCUMENTED]`

> "Select the **Points/Count Capacity** field for the team that you want to update and enter their
> capacity in points for the timebox of the plan… The default value for this field is zero."
> — [Define Capacity for a Team](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page/assign-and-allocate-work-to-teams-in-the-plan/define-capacity-for-a-team.html)

> "[Points/Count Capacity is] the planned capacity of each project in the list. This value is **defined
> directly in this page and can be modified at any time until the plan is published**."
> — [Projects By Total Tab](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page/view-capacity-plan-details/projects-by-total-tab.html)

Rally also offers **Calculate a Capacity Forecast** as an alternative to typing it — forecasts from
historical data, needs "at least 14 days of data", and presents "a 70% confidence score". Setting
capacity to zero excludes a team from work assignment. `[DOCUMENTED]`

**Rally: `Planned Project Assignment` is inline-editable.** `[DOCUMENTED]` — an inline dropdown on the
Items tab. [Items Tab](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page/view-capacity-plan-details/capacity-plan-items-tab.html)

**Rally: `Points/Count Estimated` is a DERIVED display, and the only documented editor for the
allocation amount is the Allocate dialog's Estimate field.** `[DOCUMENTED]`

> "Points/Count Estimated — Shows the total number of story points/count that are estimated for the
> children of the assigned portfolio items. **If an allocated estimate is defined, that value displays.
> If an allocated estimate is not defined, but a refined estimate is, the refined estimate displays. If
> neither is defined, the preliminary estimate displays.**" — with "an icon indicating estimate type
> (Preliminary, Refined, or Allocated)."
> — [Items Tab](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page/view-capacity-plan-details/capacity-plan-items-tab.html)

The docs for the Items tab list `Planned Project Assignment` as inline-editable and describe nothing
else as editable; the allocation amount is entered in the **Estimate field of the Allocate dialog**.
`[NO SOURCE]` for any inline editor on `Points/Count Estimated`.

**What we shipped.** `/home/nghiavt18/personal/qnsc/rally/apps/web/src/pages/capacity-planning/ui/allocation-row.tsx:292`
puts an `InlineEditableCell` on the allocation row's **Estimated** column, and the code comment states
the divergence openly:

> *"`Estimated` is the row's charge AND its editor: typing here commits a number a planner chose
> (`manual`), emptying it re-copies the Feature's estimate (`feature_estimate`). **Rally edits the
> allocation through its assignment dialog; we put it on the number it changes**, which is the same
> cell a reader is already looking at."*

Two important corrections to the framing in the brief:

1. The **Team row's** `Estimated` in our clone is already read-only —
   `capacity-team-row.tsx:202-203` renders a plain `MetricValue`; the `InlineEditableCell` at
   `capacity-team-row.tsx:211` is on **Capacity**, not Estimated. **That is precisely Rally's split**
   (Capacity inline-editable, Estimated derived). So the Team row MATCHES the SRS *and* Rally.
2. The inline editor the SRS objects to is on the **allocation child row** (Feature-under-Team), not the
   Team row. That is where the divergence actually lives.

> **Verdict — Team row: MATCHES** (Estimated read-only, Capacity inline-editable = Rally exactly).
> **Verdict — allocation row Estimated: DIVERGES**, and our own code comment admits it. Rally's
> documented editor for an allocation amount is the Allocate dialog; we added an inline path Rally does
> not document.
> Note the divergence is *additive* — we kept the Allocate dialog (`allocate-feature-modal.tsx`) and
> added a second editor. Rally's semantics for blank ("re-copies the Feature's estimate") are correctly
> implemented, and Rally's Preliminary/Refined/Allocated tier badge is reproduced
> (`estimate-tier-badge.tsx`), which is a genuine parity win.

---

## 8. Plan lifecycle actions

**Rally supports every one of the five actions our clone ships, except "remove all assignments".**
`[DOCUMENTED]`
[Modify a Capacity Plan](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page/modify-a-capacity-plan.html)

| Action | Rally | Evidence |
|---|---|---|
| **Edit plan details** | Yes — Actions > **Edit Plan Details** | `[DOCUMENTED]` |
| **Delete a plan** | Yes — Actions > **Delete Plan** on the Plan Details page | `[DOCUMENTED]` |
| **Move items between plans** | Yes — **Move To Another Plan** transfers portfolio items between capacity plans | `[DOCUMENTED]` |
| **Bulk-delete plans** | Yes — select checkboxes on the list, then delete | `[DOCUMENTED]` |
| **Bulk-edit plans** | Yes — select checkboxes, choose **Edit** | `[DOCUMENTED]` |
| **Unpublish / revert to Draft** | Yes | `[DOCUMENTED]` |
| **Export to CSV** | Yes — Actions > **Export** | `[DOCUMENTED]` |
| **Remove all assignments** | `[NO SOURCE]` — not documented as a distinct menu item | — |

The overarching constraint: "you cannot modify a plan while it is in a published state" — every
mutation above is gated on Draft.

The plan **list** page documents `+ Add New`, search by name, Oldest/Newest Release range filters,
Show Fields column chooser, and clickable `Projects in Plan` / `Items in Plan` counts that open a
detail panel. `[DOCUMENTED]`
[Find and View Capacity Plans](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page/find-and-view-capacity-plans.html)

> **Verdict: MATCHES for 4 of 5; "remove all assignments" HAS NO RALLY ANALOGUE.** Our clone's five
> actions are not over-reach — delete, edit details, move between plans and bulk delete are all real
> documented Rally actions. **The SRS is the document that is wrong here**, not the code: declaring
> only "Draft→Published→Revert" understates Rally by a wide margin.
> Two things Rally has that we should check for: **bulk-edit** of plans from the list, and **Export to
> CSV**. Both documented, both plausibly missing from our build.

---

## 9. Column set and ordering

**Rally's trio order is Rollup → Estimated → Complete on the Items tab, and Rollup → Estimated →
Capacity → Complete on the Projects By Total tab.** `[DOCUMENTED]`

### Items tab, in documented order
[Items Tab](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page/view-capacity-plan-details/capacity-plan-items-tab.html)

1. **`+/-`** — `+` green for items added after publication, `-` red for removed; sortable so added/removed group together
2. **Rank** — drag-and-drop relative priority
3. **ID** — link to the portfolio item
4. **Name**
5. **Planned Project Assignment** — inline dropdown, single project; warning icon + highlight when unassigned; shows a count when allocated to several teams
6. **Project** — read-only, the assignment *outside* the plan
7. **Dependencies** — count, clickable
8. **Points/Count Rollup**
9. **Points/Count Estimated** — with the Preliminary / Refined / Allocated tier icon
10. **Points/Count Complete**

### Projects By Total tab, in documented order
[Projects By Total Tab](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page/view-capacity-plan-details/projects-by-total-tab.html)

1. **Item** (labelled with the plan's portfolio item type, e.g. "Features") — count of items assigned to the project
2. **Points/Count Rollup** — blue in the status bar
3. **Points/Count Estimated** — grey
4. **Points/Count Capacity** — green; editable until publish; default zero
5. **Points/Count Complete** — dark blue
6. **Allocation** — blank, or project names prefixed "to" / "from"

### Column definitions (verbatim)
`[DOCUMENTED]` [View Capacity Plan Details](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page/view-capacity-plan-details.html)

- **Rollup** — "total number of **leaf** story points/count that are **defined** for the children of the
  assigned portfolio items"; includes allocation estimates when the item is allocated to extra teams
- **Estimated** — "total number of story points/count that are **estimated**", resolving
  Allocated → Refined → Preliminary
- **Complete** — "total number of **leaf** story points/count that are **completed**"

### Plan detail tabs, in order
`[DOCUMENTED]` Projects By Total · Projects By Release · Items · **Alignment** · **Progress** ·
**Revision History**. A **Breakdown** button opens Complete / Rollup / Estimated / **Capacity**.

### Plan list columns
`[DOCUMENTED]` Documented: `Projects in Plan`, `Items in Plan`, and via Show Fields
`Plan Projects Conformity` (Conformant / NonConformant). `[NO SOURCE]` for the full default list-column
order.

> **Verdict: MATCHES on the trio order.** Our `capacity-item-row.tsx:253` comment — *"Rollup →
> Estimated → Complete, which is Rally's order"* — is **correct and now confirmed** against the Items
> tab documentation.
> **DIVERGES on the team grid shape:** Rally gives Projects By Total four *separate numeric columns*
> (Rollup, Estimated, Capacity, Complete) plus an **Allocation** column. Our `model/columns.ts` collapses
> Complete/Rollup/Estimated into a single `progress` `CompositeBar` column. Defensible as a design
> choice — Rally does colour those same three inside a status bar — but it is not Rally's column set.
> **Missing vs Rally:** the `+/-` republish-diff column, `Dependencies`, the read-only `Project`
> (outside-the-plan) column, the `Allocation` to/from column, and the Alignment / Progress /
> Revision History tabs. Our plan list also names it "Teams in Plan" where Rally says "Projects in
> Plan" — a deliberate, documented vocabulary choice in our `columns.ts`, not an error.

---

## 10. Is Capacity Planning a paid add-on or a different product?

**It is documented as a page inside Rally itself, not a separate product — but it is historically an
Rally Portfolio Manager / higher-edition capability, and current Broadcom docs do not state the
licensing plainly.**

- **Current Rally help** documents it as core Rally under Planning, with no licensing caveat:
  `[DOCUMENTED]` [Capacity Planning Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page.html)
- **Historically it lived under Rally Portfolio Manager.** The legacy CA Agile Central doc tree placed
  it at `…/getting-started-rally-portfolio-manager/rally-portfolio-manager/capacity-planning.html`, and
  a parallel legacy path put it under `using-portfolio-items/portfolio-item-planning/`. Both now 301 or
  404 into the ValueOps Rally help tree. `[DOCUMENTED]` (URL structure only; page bodies no longer
  resolve)
- **Editions:** "The **unlimited** edition includes all the features of the community and enterprise
  editions as well as access to Flowdock, Rally Insights analytic features and **Rally Portfolio
  Manager**." `[COMMUNITY]`
  [TechTarget — Rally Software](https://www.techtarget.com/searchsoftwarequality/feature/Rally-Software-the-go-to-ALM-tool-for-Agile-developers)
  Combined with the legacy doc placement, this implies Capacity Planning historically required the
  Unlimited edition (RPM), not Community/Enterprise.
- **ValueOps positioning:** "Rally Capacity Planning" is listed as a **ValueOps Core Capability**, which
  is a solution-marketing grouping over Clarity + Rally + ConnectALL + Insights — not a separate SKU for
  this page. `[DOCUMENTED]`
  [Rally Capacity Planning (ValueOps)](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/valueops-solution/ValueOps-Solution/n-valueops-capabilities/rally-capacity-planning.html)
- **A functional gate does exist, and it is a role not a licence:** only users with **Planner** set to
  Yes can create, modify, publish or view draft plans. `[DOCUMENTED]`
  [Designate Planners](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page/designate-planners.html)
- `[NO SOURCE]` No Broadcom page states which current subscription tier includes the Capacity Planning
  page. Broadcom does not publish Rally pricing/entitlement matrices publicly.
- Note **Plan of Plans is marked Beta**, so at least part of the surface is not GA. `[DOCUMENTED]`
  [Plan of Plans Types](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page/plan-of-plans/plan-of-plans-types.html)

> **Verdict: MATCHES — and critically, this feature is NOT orphaned.** Capacity Planning is documented
> Rally functionality with a Rally page, a Rally WSAPI object family, and a Rally permission gate. The
> premise in the brief — "if it is a paid add-on our feature may have no Rally parity target" — does not
> hold. **Rally is a valid and detailed parity target for this feature.**
> One design implication: Rally gates this on a **Planner** role granted by a subscription/workspace
> admin, orthogonal to project permissions, and a planner can edit *anyone's* plan. If our clone gates
> on ordinary project-editor permissions, that is a divergence worth a look.

---

## Recommendations, ranked by evidence confidence

### Tier 1 — Strong documentation, act on these

| # | Item | Recommendation | Why |
|---|---|---|---|
| **1** | Nav name / the `app-shell.tsx` comment | **fix code** | Delete/rewrite the comment at `apps/web/src/widgets/app-shell/app-shell.tsx:120-122`. Rally does **not** name this screen "Release Planning" — it has a separate Capacity Planning page under Portfolio, exactly where we put ours. The comment justifies a rename that never needed justifying and will mislead the next reader. Highest confidence, lowest cost. |
| **8** | Plan lifecycle actions | **amend SRS** | Rally documents Edit Plan Details, Delete Plan, Move To Another Plan, Bulk Edit, Bulk Delete, Unpublish, and Export — the SRS's "only Draft→Published→Revert" is simply an incomplete description of the target. The code is closer to Rally than the spec is. Also **consider adding** Bulk Edit and CSV Export (documented Rally, likely missing from us). "Remove all assignments" has no Rally analogue → **no Rally target, BA decides**. |
| **7** | Editability | **split decision** | **Team row: no change** — we already have Estimated read-only and Capacity inline-editable, which is Rally's exact split; the SRS concern does not apply to this row. **Allocation child row: fix code or amend SRS** — the `InlineEditableCell` at `allocation-row.tsx:292` is a real divergence (Rally documents only the Allocate dialog's Estimate field). It is additive, not destructive, and our blank-means-re-copy semantics are right. Recommend **amend SRS to permit it** if the BA values the ergonomics; **fix code** if strict parity is the bar. Do not "fix" the Team row. |
| **3** | Draft/Published | **fix code (small additions)** | Our lifecycle matches. Two documented Rally behaviours to add: (a) the **two publish variants** — publish with vs without writing `Release` / `Planned Start Date` / `Planned End Date` onto assigned Features; (b) **disable publish on an empty plan**. Also worth documenting Rally's asymmetric revert (unpublish does *not* undo field writes) so we match or consciously improve on it. |
| **2** | Units | **no change; verify one thing** | Fixed-per-plan Points-or-Count matches. **Verify** our plan capacity is stored on the plan row, not written to `Release.PlannedVelocity` — Rally deliberately keeps plan capacity plan-local ("stored in this plan only, not globally") so what-if planning never mutates execution data. |
| **6** | Over-allocation | **no change** | Advisory-only via status-bar hover + per-row icons + yellow unassigned = Rally's model, which never hard-stops. Only action: confirm we never *block* a save on over-capacity. Warning *strings* are BA-owned → **no Rally target, BA decides** on wording. |

### Tier 2 — Documented, but the parity call is a judgement

| # | Item | Recommendation | Why |
|---|---|---|---|
| **4** | Allocation model | **no change; verify two rules** | One-primary-plus-additional-teams, free-form per-team amounts, `Feature.projectId` untouched, nested child rows, stored amount overriding derived estimate for load while rollups recompute — all confirmed matches. **Verify:** (a) blank Estimate = "the whole current estimate lands on this team" (not zero); (b) allocations **add** and need not sum to the estimate. Both explicit in Rally's docs with a worked 40+10=50 example. |
| **9** | Column set | **amend SRS** | Trio order Rollup → Estimated → Complete is **confirmed correct** — leave it. The `CompositeBar` collapse of three numerics into one `progress` column on the team grid diverges from Rally's four separate columns; it is a reasonable design call, so record it as a **conscious deviation** rather than changing it. Genuinely absent vs Rally, for the BA to triage: the `+/-` republish-diff column, `Dependencies`, read-only outside-the-plan `Project`, the `Allocation` to/from column, and the Alignment / Progress / Revision History tabs. |
| **10** | Licensing | **no change** | Not a separate product. Rally is a valid parity target for this feature. Optional follow-up: Rally gates on a **Planner** role set by a subscription/workspace admin (orthogonal to project permissions, and a planner may edit anyone's plan). If we gate on project-editor rights instead, raise that as a separate authz question. |

### Tier 3 — Thin evidence, do not act on parity grounds

| # | Item | Recommendation | Why |
|---|---|---|---|
| **5** | `UserIterationCapacity` | **amend SRS / no Rally target, BA decides** | Name confirmed `[API-SCHEMA]` (pyral), exposed as `Iteration.UserIterationCapacities`. **Fields and uniqueness key: no authoritative source found** — the WSAPI schema browser is login-gated with no archive capture. Do not spec against guessed fields. **Most important correction:** `UserIterationCapacity` is *not* the object behind Rally's Capacity Planning page — it is the **task-hours, per-person, per-iteration** model surfaced on the Team/Iteration Status pages. Our feature's true counterpart is **`CapacityPlanProject`** (team capacity in points on a plan). If the SRS or ERD names `UserIterationCapacity` as this feature's parity target, that citation is wrong and should be corrected. A per-person hours capacity model is a *separate* documented Rally capability we may or may not want. |

---

## Confirmed WSAPI object names (for the ERD)

`[API-SCHEMA]` from [pyral/entity.py](https://github.com/RallyTools/RallyRestToolkitForPython/blob/master/pyral/entity.py), pyral v1.7.0, WSAPI v2.0:

| Type | Role |
|---|---|
| `CapacityPlan` | abstract base |
| `WorkingCapacityPlan` | the **draft** plan |
| `PublishedCapacityPlan` | the **published** plan (a distinct concrete type — Rally snapshots on publish) |
| `CapacityPlanProject` | a team in a plan, carrying its capacity ← **our team row** |
| `CapacityPlanItem` | a portfolio item in a plan ← **our feature row** |
| `CapacityPlanAssignment` | an allocation ← **our allocation row** |
| `WorkingCapacityAssignment` | draft-side allocation |
| `UserIterationCapacity` | per-person, per-iteration **task-hours** capacity (unrelated to capacity plans) |

Field lists for all of the above: `[NO SOURCE]`.

---

## Sources

- [Capacity Planning Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page.html)
- [Create a Capacity Plan](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page/creating-a-capacity-plan/create-a-capacity-plan.html)
- [Creating a Capacity Plan](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page/creating-a-capacity-plan.html)
- [View Capacity Plan Details](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page/view-capacity-plan-details.html)
- [Items Tab](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page/view-capacity-plan-details/capacity-plan-items-tab.html)
- [Projects By Total Tab](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page/view-capacity-plan-details/projects-by-total-tab.html)
- [Alignment Tab](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page/view-capacity-plan-details/alignment-tab.html)
- [Assign and Allocate Work to Teams in the Plan](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page/assign-and-allocate-work-to-teams-in-the-plan.html)
- [Define Capacity for a Team](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page/assign-and-allocate-work-to-teams-in-the-plan/define-capacity-for-a-team.html)
- [Assign Portfolio Items to a Team](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page/assign-and-allocate-work-to-teams-in-the-plan/assign-portfolio-items-to-a-team.html)
- [Allocate Portfolio Items to Multiple Teams](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page/assign-and-allocate-work-to-teams-in-the-plan/allocate-portfolio-items-to-multiple-teams.html)
- [Publish a Plan](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page/publish-a-plan.html)
- [Modify a Capacity Plan](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page/modify-a-capacity-plan.html)
- [Find and View Capacity Plans](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page/find-and-view-capacity-plans.html)
- [Designate Planners](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page/designate-planners.html)
- [Plan of Plans Types](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page/plan-of-plans/plan-of-plans-types.html)
- [Release Planning Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/release-planning-page.html)
- [Team Planning Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/team-planning-page.html)
- [Planning Methods and Tools](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-methods-and-tools.html)
- [Iteration Fields](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-iterations/iteration-fields.html)
- [Estimate Velocity for an Iteration](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-iterations/managing-iterations/estimate-velocity-for-an-iteration.html)
- [Iteration Planning — Planning Process](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-iterations/iteration-planning/planning-process.html)
- [Team Status Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/additional-tracking-pages/view-team-status-page.html)
- [Iteration Status Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/iteration-status-page.html)
- [Rally Capacity Planning (ValueOps capability)](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/valueops-solution/ValueOps-Solution/n-valueops-capabilities/rally-capacity-planning.html)
- [Rally Team Planning (ValueOps capability)](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/valueops-solution/ValueOps-Solution/n-valueops-capabilities/rally-team-planning.html)
- [Rally Web Services API](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reference/rally-web-services-api.html)
- [pyral/entity.py — RallyTools/RallyRestToolkitForPython](https://github.com/RallyTools/RallyRestToolkitForPython/blob/master/pyral/entity.py)
- [RallyRestToolkitForPython issue #4 — UserIterationCapacities collection](https://github.com/RallyTools/RallyRestToolkitForPython/issues/4)
- [Broadcom Academy — Using Rally for Capacity Planning](https://academy.broadcom.com/blog/valueops/rally/using-rally-for-capacity-planning)
- [TechTarget — Rally Software editions](https://www.techtarget.com/searchsoftwarequality/feature/Rally-Software-the-go-to-ALM-tool-for-Agile-developers)
