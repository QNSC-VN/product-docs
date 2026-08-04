# Rally PortfolioItem Model, Planning and Estimation — Research vs. Our Clone

**Date:** 2026-08-04
**Product under study:** Broadcom Rally Software (formerly CA Agile Central / Rally Dev, `rally1.rallydev.com`)
**Method:** Official Broadcom TechDocs Rally help, Broadcom support KB articles, official RallyTools SDK source (`pyral`), Rally App SDK 2.1 source.
**Evidence labels:** **[DOCUMENTED]** = stated in official Broadcom docs/KB; **[API-SCHEMA]** = from official Rally SDK source / API metadata behaviour; **[COMMUNITY]** = forum report; **[NO SOURCE]** = no authoritative public source found — do not treat as fact.

**Search hygiene note:** `help.rallyuxr.com` ("Rally UXR", a user-research product) and `rally.com` were excluded from all searches. Every URL below is `techdocs.broadcom.com`, `knowledge.broadcom.com`, `github.com/RallyTools`, or `rally1.rallydev.com`.

> ### Standing caveat on WSAPI nullability
> As established in the sibling report `RALLY_TIMEBOX_LIFECYCLE.md`, the canonical WSAPI object model (`https://rally1.rallydev.com/slm/doc/webservice/`) is **behind authentication** and Broadcom's public WSAPI section publishes **no per-field Required/Nullable table**:
> - https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reference/rally-web-services-api.html
> - https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reference/rally-web-services-api/attributes.html
>
> So "Rally's column is nullable" is never directly quotable. What *is* quotable is (a) which fields the Rally help field-reference page marks **Required field** / **read-only**, and (b) the object graph, which `pyral` exposes as real Python entity classes. Both are used below and labelled. Where our clone's nullability is at stake (Q4) the finding rests on the *absence* of a Required marking plus positive evidence of a "not yet refined" workflow state — that is strong, not conclusive.

---

## Headline: two structural findings (Q2, Q3)

The single most important result of this research is that **both of the enums our clone hardcodes are, in Rally, admin-editable first-class objects with their own WSAPI endpoints and their own attributes.** This is not a "our value list is stale" problem that a migration of enum labels fixes; it is a **shape** problem.

`pyral`, the official Rally REST toolkit for Python maintained by RallyTools, declares them as workspace-scoped domain objects, side by side with `Release`, `Iteration` and `Project`:

```python
class PreliminaryEstimate   (WorkspaceDomainObject): pass
class State                 (WorkspaceDomainObject): pass
```
— [`pyral/entity.py` lines 439/441, RallyTools/RallyRestToolkitForPython](https://github.com/RallyTools/RallyRestToolkitForPython/blob/master/pyral/entity.py) **[API-SCHEMA]**

Both are registered in pyral's entity-name→class table (lines 642–657 of the same file), which is what makes `/state` and `/preliminaryestimate` addressable WSAPI endpoints. A fixed Postgres enum cannot model either, because in Rally each value carries **its own additional columns** (a WIP limit and an exit-agreement description for `State`; a numeric point value for `PreliminaryEstimate`) and each is scoped **per workspace, and for `State` also per portfolio item type**.

---

## 1. Type names and levels

**Rally does this.**

Default hierarchy is **three levels**, and the documented default names are Theme / Initiative / Feature:

> "Types display in descending order. For example, by default the highest level (3) are themes, level 2 are initiatives, and level 1 are features."
> "Within your organization's workspace, you can customize the names of the portfolio item types you use."
> — [Portfolio Item Types, Broadcom TechDocs](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/managing-your-workspace/customizing-portfolio-item-types/portfolio-item-types.html) **[DOCUMENTED]**

Extensible to **five**, addressed as P1 (lowest) through P5 (highest), and levels may be skipped:

> "Rally allows you to configure up to five levels of portfolio items in the portfolio hierarchy. The lowest level is P1 and the highest level is P5."
> "You can skip levels in the hierarchy."
> — [Configure the Integration (Clarity↔Rally), Broadcom TechDocs](https://techdocs.broadcom.com/us/en/ca-enterprise-software/business-management/clarity-project-and-portfolio-management-ppm-on-premise/16-4-1/add-ins-and-integrations/integrate-clarity-ppm-with-rally/Configure-the-Integration.html) **[DOCUMENTED]**

Renaming is bounded — you may change the display name and the ID prefix, but **not the position in the hierarchy**:

> "you can modify the name and ID prefix of a portfolio type, but not the order in the hierarchy"
> — [Rename Portfolio Item Types, Broadcom TechDocs](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/managing-your-workspace/customizing-portfolio-item-types/rename-portfolio-item-types.html) **[DOCUMENTED]**

**Is "Epic" a Rally type?** No — **"Epic" is not among Rally's shipped portfolio item types.** The official SDK enumerates the shipped subtypes and Epic is absent; note it lists **four**, including a `Strategy` level above Theme:

```python
PORTFOLIO_ITEM_SUB_TYPES = ['Strategy', 'Theme', 'Initiative', 'Feature']
...
class PortfolioItem(Artifact): pass
class PortfolioItem_Strategy  (PortfolioItem): pass
class PortfolioItem_Initiative(PortfolioItem): pass
class PortfolioItem_Theme     (PortfolioItem): pass
class PortfolioItem_Feature   (PortfolioItem): pass
```
— [`pyral/entity.py` lines 26, 490–494](https://github.com/RallyTools/RallyRestToolkitForPython/blob/master/pyral/entity.py) **[API-SCHEMA]**

Broadcom corroborates that `Strategy` is a shipped name — "a defined portfolio item hierarchy that includes multiple default portfolio item types: Feature, Theme, Initiative, and Strategy" — while the admin page above still describes the *active* default as the three-level Theme/Initiative/Feature. The honest reconciliation: **four type names ship; three levels are enabled by default.** — [Define the Rally Portfolio Item Hierarchy, ValueOps Insights TechDocs](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/valueops-insights-saas/insights/administration/for-organizations-that-do-not-use-rally/define-the-rally-portfolio-item-hierarchy.html) **[DOCUMENTED]**

Where "Epic" *does* appear in Broadcom's docs, it appears as a **customer rename, and specifically a rename of the LOWEST level**, for Jira parity — Broadcom's own worked example is renaming **Feature → Epic** (same Insights page, which also names "epic, initiative, or feature" as example workspace type names). **[DOCUMENTED]** That is the opposite direction from our clone, which puts Epic *above* Feature (a SAFe-style reading, not Rally's documented one).

Types are **data, not code**, in Rally too: the official App SDK's `PortfolioItemHelper` discovers them at runtime by querying `TypeDefinition` for `Parent.Name = 'Portfolio Item'` and sorting on `OrdinalValue`, fetching `['Name', 'Ordinal', 'TypePath']` and filtering `Creatable = true` — [PortfolioItemHelper source, Rally App SDK 2.1](https://rally1.rallydev.com/docs/en-us/saas/apps/2.1/doc/source/PortfolioItemHelper.html) **[API-SCHEMA]**. Ordinal starts at 0 for the lowest level and increments upward.

The `Portfolio Item Type` field itself is user-settable only while the item is unattached:

> "**Portfolio Item Type** — Select a type for the portfolio item from the drop-down menu if the portfolio item has no parent or children. Otherwise, Rally will assign this value for you." *(Required field)*
> — [Portfolio Item Fields, Broadcom TechDocs](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/managing-portfolio-items/portfolio-item-planning/creating-portfolio-items/portfolio-item-fields.html) **[DOCUMENTED]**

**Which level does a user story attach to? The lowest, and only the lowest.** This is explicit and mechanically enforced:

> "A user story can be associated with one portfolio item. That portfolio item must be of your lowest portfolio hierarchy type."
> — [Broadcom KB 126310](https://knowledge.broadcom.com/external/article/126310/agile-central-user-stories-and-portfoli.html) **[DOCUMENTED]**

The same KB explains the schema: the story carries a generic **`PortfolioItem`** field plus a *dynamically generated, read-only* field named after your lowest-level type (e.g. `Feature`); you must write through `PortfolioItem`. It also quotes the guard that keeps story-parenting and portfolio-parenting distinct: `"HierarchicalRequirement.parentArtifact should not be set if HierarchicalRequirement.Parent is set and vice versa"`. **[DOCUMENTED]**

Corroborating the prior research note that there is **no hierarchy-tree portfolio page**: the Portfolio Items page selects **one type at a time** via a filter, i.e. a flat single-type list —

> "You can specify the type of portfolio item displayed from the Type drop-down menu."
> — [Using the Portfolio Items Page, Broadcom TechDocs](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/managing-portfolio-items/portfolio-item-tracking/using-the-portfolio-items-page.html) **[DOCUMENTED]** — **prior research CONFIRMED.**

**Our clone: MATCHES on shape, DIVERGES on naming.**
One `portfolio_items` table with a `type` discriminator is exactly Rally's shape (`PortfolioItem` base artifact + `PortfolioItem/<Type>` subtypes over one collection), and attaching user stories only to the lowest level (Feature) matches Rally's hard rule. Two divergences: (a) "Epic" is our rename, and it renames **Initiative** (level 2), whereas Broadcom's documented Epic example renames **Feature** (level 1) — so our vocabulary is defensible but should be recorded as a deliberate SAFe-flavoured deviation, not as Rally fidelity; (b) Rally's level count is workspace configuration (1–5), ours is a fixed 2. The fixed 2 is an acceptable scope cut for a clone; hardcoding the *names* into a DB enum is the part that will hurt if BA ever asks for a third level.

---

## 2. State model — **STRUCTURAL FINDING**

**Rally does this.** `State` is **not a fixed enum**. It is a per-workspace, **per-portfolio-item-type** configurable collection of `State` objects.

The field reference says so in as many words:

> "**State** — Indicates the progress that has been made toward the completion of the portfolio item. The State field represents the States defined at the workspace level for each portfolio item type."
> — [Portfolio Item Fields, Broadcom TechDocs](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/managing-portfolio-items/portfolio-item-planning/creating-portfolio-items/portfolio-item-fields.html) **[DOCUMENTED]**

The admin page confirms per-type scoping, the defaults, the ceiling, and — decisively — that each state value carries **its own attributes**:

> "You can define different states for each of your portfolio item types."
> Default states: **"Discovering, Developing, Measuring, and Done"** — i.e. **four** by default.
> Maximum **20** state values per type.
> "WIP is administered by type for each workspace."
> Per-value attributes: **Name** ("Change these names to suit your business needs"), **Rank** ("Determines column order in the Kanban"), **WIP Limit** (per state, −1 for no limit up to 200 items), **Description** ("Optionally, enter a textual description… displays on the Portfolio Kanban board as an Exit Agreement"), **Enabled** ("Specify whether the State value displays in drop-down menus").
> Admin actions: "Select **Add New** and enter a new value"; "Select the **Trash** next to a value to delete it"; "Select the **Rank Lowest** or **Rank Highest** options to move the value up or down."
> — [Customizing the Portfolio Item State Field, Broadcom TechDocs](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/managing-your-workspace/customizing-portfolio-item-types/customizing-fields-for-portfolio-item-types/customizing-the-portfolio-item-state-field.html) **[DOCUMENTED]**

And `State` is a first-class WSAPI entity, not a string: `class State(WorkspaceDomainObject): pass` — [pyral/entity.py:441](https://github.com/RallyTools/RallyRestToolkitForPython/blob/master/pyral/entity.py) **[API-SCHEMA]**

Two adjacent facts worth carrying into the schema:
- **`State Changed Date`** exists as its own field — "The date on which a portfolio item moved from its previous state to its current state." **[DOCUMENTED]**
- **`Portfolio Item Flow State` is a *different* field** — "Current Flow State of the work item. Flow State is distinct from Schedule State and can be customized at the project level." So Rally has a workspace-level `State` **and** a project-level flow state on portfolio items. **[DOCUMENTED]** (both quotes: Portfolio Item Fields page above)

For completeness on the enum-vs-object question generally: Rally *does* have genuine string enums elsewhere, and they look different in metadata. `Defect.State` is `AttributeType: "RATING"`, `Type: "string"`, `Constrained: true`, with `AllowedValues` exposed as plain `StringValue` entries and **no** `_ref` — [Broadcom KB 57584, WSAPI Get AllowedValues](https://knowledge.broadcom.com/external/article/57584/wsapi-api-get-allowedvalues-for-rally.html) **[DOCUMENTED]**. That KB covers **Defect** State only and says nothing about PortfolioItem State — but the contrast is instructive: where Rally wants a flat string list it ships a RATING attribute, and where it wants per-value metadata (WIP limit, exit agreement, per-type scoping) it ships a `WorkspaceDomainObject`. PortfolioItem State is unambiguously the latter.

**Our clone: DIVERGES — structurally, not just in values.**
A hardcoded 11-value state enum is wrong by construction on four independent counts:
1. **Wrong shape.** Rally's is an admin-editable table of rows, ours is a compile-time type. Any customer-visible "configure your states" story is unimplementable without a migration.
2. **Wrong scoping.** Rally scopes states **per portfolio item type** — Feature states and Epic states are independent lists. One shared enum across both of our types cannot express that.
3. **Wrong cardinality and wrong values.** Rally's default is **4** (Discovering, Developing, Measuring, Done); ours is 11. Even as a frozen snapshot our list does not match any documented Rally default.
4. **Missing per-value attributes.** We have nowhere to put Rank, WIP Limit, Description/exit agreement, or Enabled — and Rank is what orders the Portfolio Kanban columns, so a Kanban board built on our enum has no legitimate column ordering, and a "retire this state without deleting history" request is impossible.

The minimum Rally-shaped fix is a `portfolio_item_states` table keyed `(workspace, portfolio_item_type)` with `name`, `rank`, `wip_limit`, `description`, `enabled`, and a nullable FK from `portfolio_items.state_id`, plus a `state_changed_date` column.

---

## 3. Preliminary Estimate — **STRUCTURAL FINDING**

**Rally does this.** `PreliminaryEstimate` is a **reference to a configurable object carrying a display name and a numeric value** — not a size enum.

> "**Preliminary Estimate** — Gauge the size of a portfolio item during planning. The Preliminary Estimate is typically a t-shirt size (S, M, L, XL) with values assigned to those options by an administrator at the workspace level."
> — [Portfolio Item Fields, Broadcom TechDocs](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/managing-portfolio-items/portfolio-item-planning/creating-portfolio-items/portfolio-item-fields.html) **[DOCUMENTED]**

The admin page gives the defaults, the two editable columns, and the lifecycle operations:

> Defaults — **five** values, t-shirt names paired with Fibonacci-ish point values: **"XS (13)", "S (20)", "M (40)", "L (100)", "XL (250)"**.
> "When you edit the **Display Name** or **Value** fields, they are updated throughout the workspace after users perform a page refresh."
> "Select **Add New** to add a new value."
> "Select the **Trash** next to a value to delete it." — deleting requires reassigning any portfolio items still using that value.
> An **Enabled** column lets admins disable obsolete estimates without deleting them, preserving history while preventing new use.
> "**There is no relationship between the preliminary estimate field and the plan estimate field. If you want these to be related, you must assign values accordingly. Preliminary estimates will not roll up.**"
> — [Customizing the Portfolio Item Preliminary Estimate Field, Broadcom TechDocs](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/managing-your-workspace/customizing-portfolio-item-types/customizing-fields-for-portfolio-item-types/customizing-the-portfolio-item-preliminary-estimate-field.html) **[DOCUMENTED]**

And again the object is a real WSAPI entity: `class PreliminaryEstimate(WorkspaceDomainObject): pass` — [pyral/entity.py:439](https://github.com/RallyTools/RallyRestToolkitForPython/blob/master/pyral/entity.py) **[API-SCHEMA]**. Community app code corroborates that the field is treated as an object you sort by *value* rather than by label, and that downstream "Preliminary Budget" style calculations multiply that numeric value by a per-project cost per unit — e.g. [RallyTechServices/portfolio-cost-apps](https://github.com/RallyTechServices/portfolio-cost-apps/blob/master/portfolio-cost-tracking-v2/README.md) **[COMMUNITY]**.

Answers to the specific sub-questions:
- **Is it a reference to a configurable object with Name + numeric Value?** Yes. **[DOCUMENTED + API-SCHEMA]**
- **How many by default?** Five: XS, S, M, L, XL. **[DOCUMENTED]** (The field-reference page's prose "(S, M, L, XL)" is illustrative and omits XS; the admin page is the authority.)
- **Is the size→points mapping workspace-configurable?** Yes, the `Value` column is directly editable per workspace. **[DOCUMENTED]**
- **Bonus, and load-bearing:** the mapping is **decorative with respect to rollups** — preliminary estimates do not roll up and have no defined relationship to `PlanEstimate`. So the numeric value is for *capacity planning arithmetic and sorting*, not for progress math.

**Our clone: DIVERGES — structurally.**
A 6-value fixed size enum gets three things wrong:
1. **Loses the numeric value entirely.** This is the worst of it. In Rally the whole point of a Preliminary Estimate is the admin-assigned number behind the letter — that number is what capacity planning and cost/budget apps consume. A bare label enum makes "sort by size" alphabetical-ish nonsense and makes any future capacity-planning feature impossible without a migration.
2. **Wrong cardinality.** Rally ships five (XS…XL); we ship six. Unless our sixth value is documented as a deliberate addition, it is unsourced.
3. **Wrong shape.** Name and Value are both admin-editable per workspace, and values carry an `Enabled` flag for retirement-without-deletion. An enum supports none of that, and enum deletion has no equivalent of Rally's "reassign the affected portfolio items first" flow.

Minimum Rally-shaped fix: a `preliminary_estimates` table (`name`, `value numeric`, `enabled`, `rank`) with a **nullable** FK from `portfolio_items.preliminary_estimate_id`.

---

## 4. Refined Estimate

**Rally does this.**

> "**Refined Estimate** — Enter an updated estimate during capacity planning as more is known about the features being planned. This estimate is entered in user story points for the user stories and defects that are parented to the portfolio item."
> — [Portfolio Item Fields, Broadcom TechDocs](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/managing-portfolio-items/portfolio-item-planning/creating-portfolio-items/portfolio-item-fields.html) **[DOCUMENTED]**

Semantics vs. PreliminaryEstimate, from the two quotes side by side: **PreliminaryEstimate** is a coarse t-shirt sizing applied *during planning* whose numeric value is admin-defined and which explicitly **does not roll up**; **RefinedEstimate** is a *later, finer* number entered **in user story points** during **capacity planning**, denominated in the same unit as children's `PlanEstimate`. They are a two-stage funnel — size first, points later — not two spellings of the same thing. **[DOCUMENTED]**

**On required/nullable.** The field-reference page marks required fields explicitly, and it marks exactly three for portfolio items: **Name** ("Enter a unique, meaningful name" — *Required field*), **Project** (*Required field*), and **Portfolio Item Type** (*Required field*). It also marks read-only fields explicitly (Created By, Creation Date, ID, Last Rollup Date). **`Refined Estimate` carries neither marking.** — same URL **[DOCUMENTED]**

Per the standing caveat, "not marked required in the UI reference" is not literally "the WSAPI column is nullable" — **[NO SOURCE]** for the raw schema nullability. But the *behavioural* evidence that Rally distinguishes "not yet refined" from "refined to zero" is strong: the field's own description positions it as something you "enter… as more is known", i.e. an initially-absent value that gets filled in later, and Rally's capacity planning surfaces are built around that progression ([Creating a Capacity Plan](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page/creating-a-capacity-plan.html), [Capacity Plan Items Tab](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/capacity-planning-page/view-capacity-plan-details/capacity-plan-items-tab.html)). **[DOCUMENTED]**

**Our clone: DIVERGES. `NOT NULL DEFAULT 0` is not defensible against Rally.**
It is a lossy encoding, and the loss is exactly the distinction the field exists to carry:
- Every freshly created portfolio item is born asserting "this has been refined, and the refined answer is 0 points." Rally's contract is "nobody has refined this yet."
- Any "which features still need refinement before we can plan capacity?" query — the natural consumer of this field — becomes unanswerable, because `refined_estimate = 0` is indistinguishable from unset.
- A legitimate refinement outcome of genuinely zero points can never be recorded distinguishably.
- Aggregations silently treat unrefined items as contributing 0 rather than as unknown, which understates a plan's size instead of flagging it as incomplete.

Same argument applies verbatim to `refined_work_item_count_estimate` (Q5) if it too is `NOT NULL DEFAULT 0`. Fix: make both nullable, no default.

---

## 5. Work item count estimate

**Rally does this — the field exists, essentially under our name.**

> "**Refined Work Item Count Estimate** — Enter an updated estimate during capacity planning as more is known about the features being planned. This estimate is entered in user story count (number of user stories and defects)."
> — [Portfolio Item Fields, Broadcom TechDocs](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/managing-portfolio-items/portfolio-item-planning/creating-portfolio-items/portfolio-item-fields.html) **[DOCUMENTED]**

So yes: Rally has a *count*-denominated refined estimate as a deliberate sibling to the *points*-denominated one, and the counted population is "user stories **and defects**". Note this is the forward-looking **estimate**; Rally separately carries the *actual* rolled-up counts as read-only fields — `Leaf Story Count`, `Total Count Rollup` ("The number of child user stories and defects that are parented to the portfolio item"), `Defect Count Rollup`, `Accepted Leaf Story Count` — same page **[DOCUMENTED]**. Estimate and rollup are distinct fields; don't let them collapse.

**Our clone: MATCHES.** `refined_work_item_count_estimate` is a real Rally field, correctly named and correctly denominated. This is the cleanest hit in this report. The only caveat is nullability (see Q4) and the reminder that Rally's counted population includes defects.

---

## 6. Planned start / end dates

**Rally does this — both fields exist, and they are real dates.**

> "**Planned Start Date** — The date you intend to begin work on this item."
> "**Planned End Date** — The date you intend to finish work on this item."
> — [Portfolio Item Fields, Broadcom TechDocs](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/managing-portfolio-items/portfolio-item-planning/creating-portfolio-items/portfolio-item-fields.html) **[DOCUMENTED]**

That they are *typed dates* rather than free text is established by three independent pieces of evidence, none of which is possible over a text column:

1. **Rally compares Planned End Date to "now" to compute a stored count.** `Late Child Count` = "The number of child work items that are not complete, but have exceeded the Planned End Date of the portfolio item." — same page **[DOCUMENTED]**
2. **Rally branches the progress-bar rendering on whether Planned Start Date is undefined or in the future** — "Light gray progress bar" when the Planned Start Date is undefined/future; "Dark gray progress bar" when some work is accepted but the start date is future. — [Using the Portfolio Items Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/managing-portfolio-items/portfolio-item-tracking/using-the-portfolio-items-page.html) **[DOCUMENTED]**
3. **The API requires ISO 8601 when writing them.** Dates passed to WSAPI must be ISO 8601 with optional offset (e.g. `2024-09-23T12:54:38.000-0600`); `PlannedStartDate`/`PlannedEndDate` are ordinary fetchable/settable date fields alongside `ActualStartDate`/`ActualEndDate`. — [Rally WSAPI, Broadcom TechDocs](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/integrating-with-rally/building-rally-integrations/web-services-api-wsapi.html), [KB 57510 create/update an artifact via WSAPI](https://knowledge.broadcom.com/external/article/57510/rally-how-to-create-and-update-an-artif.html) **[DOCUMENTED]**

Rally also derives the *actual* dates from child schedule-state transitions, which is the counterpart pair: `Actual Start Date` = "The earliest date an associated user story or defect is moved to an In-Progress schedule state"; `Actual End Date` = "The latest date the final associated user story or defect is moved to an Accepted schedule state." **[DOCUMENTED]**

**Which is Rally-correct: our DB or our BA spec?** **The DB.** A `date` column MATCHES Rally. The BA spec's "plain free-text, intentionally not a date picker" **DIVERGES** and is not recoverable as a Rally behaviour — **[NO SOURCE]** for any free-text planned-date field anywhere in Rally's portfolio item model. Adopting free text would forfeit late-child detection, the documented gray-bar progress states, date filtering/sorting, and API round-tripping.

**Our clone: DB MATCHES / SRS DIVERGES.** This is the one item where our schema is right and our written spec is wrong. Amend the SRS; keep the `date` columns; give the UI a date picker.

---

## 7. Progress display

**Rally does this.** Grid columns **and** progress bars **and** hover detail — and there are far more than two `PercentDone*` fields available.

**In the grid — two by default, more on request:**

> By default two tracking fields display: "**Percent Done by Story Count** and **Percent Done by Story Plan Estimate**." Additional fields can be added via the **Show Fields** option, such as "Percent Done By Defect Plan Estimate or Total Accepted Children."
> — [Using the Portfolio Items Page, Broadcom TechDocs](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/managing-portfolio-items/portfolio-item-tracking/using-the-portfolio-items-page.html) **[DOCUMENTED]** — **prior research CONFIRMED.**

**As bars, colour-coded by status:** blue = Complete, green = On Track, yellow = At Risk, red = Late; plus the two gray states keyed off Planned Start Date quoted in Q6. — same URL **[DOCUMENTED]**

**With hover detail:**

> "Detailed callouts display when you hover over the Percent Done By fields" — showing **Status**, **Accepted Points**, **Accepted User Stories**, and **Missing Estimates**.
> — same URL **[DOCUMENTED]**

**The full documented `PercentDone*` family is six, not two** — all read-only rollups keyed off **Accepted**, per [Portfolio Item Fields](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/managing-portfolio-items/portfolio-item-planning/creating-portfolio-items/portfolio-item-fields.html) **[DOCUMENTED]**:

| Field | Documented calculation |
|---|---|
| Percent Done by Story Count | "the number of accepted user stories divided by the total number of user stories associated with the portfolio item" |
| Percent Done by Story Plan Estimate | "dividing the number of accepted points by the total user story points for user stories associated with the portfolio item" |
| Percent Done By Defect Count | "the number of accepted defects divided by the total number of defects parented to the portfolio item" |
| Percent Done By Defect Plan Estimate | "dividing the number of accepted points by the Plan Estimate for defects parented to the portfolio item" |
| Percent Done By Total Count | "the number of accepted user stories and defects divided by the total number of user stories and defects parented to the portfolio item" |
| Percent Done By Total Plan Estimate | "dividing the number of accepted points by the total story points for user stories and defects parented to the portfolio item" |

Plus `Total Accepted Children` ("the percentage of child work items… in an Accepted or Completed state") and the two `Estimated Progress by Story Count` / `by Story Points` fields. **[DOCUMENTED]**

**Asynchronous and stamped**, exactly as prior research had it:

> "**Last Rollup Date** — The last date and time that the values for Percent Done by Story Plan Estimate and Percent Done by Story Count were updated. This is a system-generated field, and cannot be edited." *(read-only)* — [Portfolio Item Fields](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/managing-portfolio-items/portfolio-item-planning/creating-portfolio-items/portfolio-item-fields.html) **[DOCUMENTED]**
> "The job to update % stories complete on any Portfolio Item is a background process" and typically takes "a matter of minutes to update the rollups and display the percent done on features." — [Broadcom KB 144455](https://knowledge.broadcom.com/external/article/144455/rally-portfolio-items-when-should-the-p.html) **[DOCUMENTED]**

**Prior research CONFIRMED on all four points:** the two `PercentDone*` fields are PortfolioItem fields; read-only; asynchronously recalculated with a `Last Rollup Date`; keyed off **Accepted**.

**Our clone: grid MATCHES / detail PARTLY INVENTED.**
Two grid columns is precisely Rally's default — good. Four progress bars on the detail page has **[NO SOURCE]**: Rally's documented set is six `PercentDone*` fields of which two are shown by default, so "four" corresponds to nothing documented. It isn't *wrong* so much as arbitrary. The substantive gaps are the things Rally does that we don't: the **hover callout** (Status / Accepted Points / Accepted User Stories / **Missing Estimates**), the **colour-coded status semantics** (blue/green/yellow/red plus the two gray Planned-Start-Date states), and any surfacing of **Last Rollup Date** so users understand the number is minutes-stale rather than broken. Note the gray states depend on Q6 being a real date.

---

## 8. Children preview

**Rally does this — expandable rows exist, generically across list views:**

> "Most list views allow you to expand a work item to view child work items such as tasks, user stories, or defects."
> — [Parent-Child Relationships, Broadcom TechDocs](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/building-your-backlog/identifying-dependencies/parent-child-relationships.html) **[DOCUMENTED]**

The Portfolio Items page documentation itself does **not** describe row expansion, and **no documented cap on the number of children previewed exists anywhere** — **[NO SOURCE]** for any "≤5" limit or any limit at all. The nearest thing Rally documents to a bounded child summary is a *chart*, not a truncated list: Work Distribution shows "each team (project) that is assigned leaf user stories that are parented or that roll up to the selected portfolio item" as a pie chart of story counts per team plus a bar chart colour-coded by schedule state — [Work Distribution for a Portfolio Item](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/managing-portfolio-items/portfolio-item-tracking/using-the-portfolio-items-page/work-distribution-for-a-portfolio-item.html) **[DOCUMENTED]**.

**Our clone: expandable rows MATCH the general Rally idiom; the ≤5 cap IS AN INVENTION.**
Rally's expansion shows *the children*, not the first five of them. A silent truncation at 5 with no "…and 12 more" affordance would misrepresent a Feature with 17 stories — that is a correctness issue, not a styling one. Either drop the cap, or keep it as an explicit paging affordance with a total count and a link through to the full list. BA decides which, but "truncate silently at 5" has no Rally basis.

---

## 9. Team and Release on a portfolio item

**Rally does this. Project (= team) is REQUIRED on every portfolio item at every level.**

> "**Project** — Specify the project within Rally to which the portfolio item is assigned." ***(Required field)***
> — [Portfolio Item Fields, Broadcom TechDocs](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/managing-portfolio-items/portfolio-item-planning/creating-portfolio-items/portfolio-item-fields.html) **[DOCUMENTED]**

There is **no level qualification on that requirement** — it is stated for portfolio items generally, and the create flow offers the Projects field before any type-specific step ("Use the **Projects** field to select a project if you want to associate the work item with a different project than the one currently in scope" — [Create Portfolio Items](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/managing-portfolio-items/portfolio-item-planning/creating-portfolio-items/create-portfolio-items.html) **[DOCUMENTED]**). And Rally's own vocabulary equates project with team — "each **team (project)**" — [Work Distribution for a Portfolio Item](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/managing-portfolio-items/portfolio-item-tracking/using-the-portfolio-items-page/work-distribution-for-a-portfolio-item.html) **[DOCUMENTED]**. This matches the standing project-note that real Rally uses project = team.

**Release is different — Rally states a level *recommendation*, not a prohibition:**

> "**Release** — Use the Release attribute on the lowest level of portfolio item (typically referred to as Feature) to schedule a feature into a roadmap timeframe."
> — [Portfolio Item Fields](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/managing-portfolio-items/portfolio-item-planning/creating-portfolio-items/portfolio-item-fields.html) **[DOCUMENTED]**

Corroborating that Rally's release-planning surfaces operate on lowest-level items only — the Release Planning page "displays a backlog list of lowest level portfolio items that are not assigned to a release, and release columns showing the lowest level portfolio items assigned to that release" — [Release Planning Page, Broadcom TechDocs](https://techdocs.broadcom.com/us/en/ca-enterprise-software/agile-development-and-management/rally-platform-ca-agile-central/rally/using-top/getting-started-rally-portfolio-manager/rally-portfolio-manager/release-planning-page.html) **[DOCUMENTED]**.

But note the exact modality: "**Use** the Release attribute on the lowest level" is guidance about where it is *meaningful*. **[NO SOURCE]** for Rally hard-blocking a Release on an Initiative or Theme at the schema level.

**Our clone: DIVERGES on Team (contradicted), STRICTER-THAN-RALLY on Release (unsourced but defensible).**
- **The Team CHECK is contradicted by Rally and should go.** Rally requires Project on *every* portfolio item including the highest levels; our DB CHECK forbidding Team on the Epic level makes a state Rally mandates unrepresentable. An Epic with no owning team also breaks scoping/permissions symmetry with Rally, where project scope is how portfolio items are secured and filtered at all. This is the clearest "fix code" in the report after the enums.
- **The Release CHECK hardens a Rally recommendation into an invariant.** Rally would let you set it and simply wouldn't do anything useful with it; we refuse. That is a legitimate product decision for a clone — arguably a *better* one — but it must be recorded as a deliberate deviation rather than as Rally fidelity, because an importer round-tripping real Rally data could hit an Initiative that carries a Release and fail on our CHECK.

---

## 10. Portfolio item deletion / archiving

**Rally does both, and they are different mechanisms.**

**Archiving is a field, not a lifecycle transition:**

> "**Archived** — Checkbox to mark portfolio items as archived; allows filtering."
> — [Portfolio Item Fields](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/managing-portfolio-items/portfolio-item-planning/creating-portfolio-items/portfolio-item-fields.html) **[DOCUMENTED]**

You then "filter on Archived = No to ensure that archived portfolio items do not appear on your Portfolio Kanban board or list." **[DOCUMENTED]** No state gate, no children check, no separate action — it is a boolean you set like any other field.

**Deletion cascades to children and is NOT blocked:**

> "When you delete a parent story, all child stories within are also deleted." … "This applies to all work items that can be in a parent-child relationship, including user stories, defects, tasks, **and portfolio items**." You are prompted to confirm the deletion.
> — [Missing Work Items, Broadcom TechDocs](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/missing-work-items.html) **[DOCUMENTED]**

**But *removing* a story from a portfolio item merely unparents it:**

> "When you remove a work item, the work item is only disassociated with the work item you are removing it from. It is not deleted from Rally."
> "When viewing the user stories associated with a portfolio item, you can select an associated user story and choose to remove it. When you do this, the user story becomes unparented and is no longer associated with the portfolio item."
> — [Remove a Work Item from a Collection or Association, Broadcom TechDocs](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/common-pages-and-elements/using-the-toolbar-to-modify-work-items/remove-a-work-item-from-a-collection-or-association.html) **[DOCUMENTED]**

So the honest reading of the cascade quote: it governs the **portfolio-item→portfolio-item** parent axis (delete an Initiative, its child Features go too). The **portfolio-item→story** axis has its own explicit *remove = unparent* semantics, and Rally further guarantees associations are severed rather than left dangling — "When you delete a user story or defect that has a parent, the association with the parent is automatically severed… Rally's database rules require this behavior, to prevent work items from being restored with an association to a work item that does not exist." — [Missing Work Items](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/missing-work-items.html) **[DOCUMENTED]**. Whether deleting a Feature hard-deletes its stories or unparents them is **not stated in one sentence anywhere**; the two documented rules point opposite ways and I will not guess — **[NO SOURCE]** for that specific edge.

**Portfolio items appear NOT to be recoverable.** The Recycle Bin is documented as covering "user stories, tasks, defects, defect suites, and test cases" — portfolio items are **not** listed. — [Recycle Bin, Broadcom TechDocs](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/common-pages-and-elements/recycle-bin.html) **[DOCUMENTED]** (Absence from a list is weaker than an explicit exclusion, so treat "PI deletion is permanent" as strongly implied rather than stated.) This is precisely *why* Rally gives portfolio items an `Archived` flag: archive is the reversible option, delete is not.

**Our clone: DIVERGES / INVENTS.**
1. **"Block Epic archive when it has children" is an invention.** Rally's `Archived` is an unguarded checkbox. Nothing in Rally consults children before archiving, and blocking it removes the one safe, reversible way to get a finished Epic off the board.
2. **We conflate archive with delete.** Rally has two distinct operations with different reversibility: `Archived = true` (reversible, filter-based, no cascade) and Delete (cascading, confirmed, apparently permanent). A clone that offers only a children-blocked "archive" has neither of Rally's behaviours.
3. **We do not cascade.** Rally deletes children with the parent after a confirmation prompt; if we ever add delete, that is the target behaviour — and per the sibling timebox report's finding, the thing to avoid above all is leaving dangling FKs.

---

## 11. Create UX

**Rally does this — one `Add New` toolbar button, with the type taken from the page's Type selector, not from a picker inside the form:**

> 1. "Select **Portfolio, Portfolio Items**."
> 2. "On the Portfolio Items page, **select the Portfolio Item type**."
> 3. "Select **Add New** from the toolbar."
> 4. "Use the **Projects** field to select a project if you want to associate the work item with a different project than the one currently in scope."
> 5. "Select **Create with details** to view the item in the detail editor and complete any necessary fields."
> 6. "Select **Create**."
>
> "Required fields are marked with an asterisk (*)." Some required fields may have default values, and admins making certain fields required may disable the quick-add feature.
> — [Create Portfolio Items, Broadcom TechDocs](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/managing-portfolio-items/portfolio-item-planning/creating-portfolio-items/create-portfolio-items.html) **[DOCUMENTED]**

So the answer to "one action with a type picker, or per-type actions?" is **neither, exactly**: there is a **single** `Add New` action, and it is **implicitly typed by the list you are looking at** — the same Type dropdown that filters the flat list (Q1) also determines what `Add New` creates. Rally also documents a second, richer path, "Advanced Add New for Portfolio Items", and notes creation can be driven "from the Portfolio Items page for each type" — [Creating Portfolio Items](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/managing-portfolio-items/portfolio-item-planning/creating-portfolio-items.html) **[DOCUMENTED]**. There is **[NO SOURCE]** for a "New Epic / New Feature" split-button menu.

**Our clone: shipped code is CLOSER to Rally than our SRS is.**
- The **single button we shipped MATCHES** Rally's single `Add New` — *provided* it creates the type currently selected in the page's type filter. If it instead always creates one hardcoded type, or pops a type picker, that is the remaining gap.
- The **SRS's New Epic / New Feature menu IS AN INVENTION.** Rally has no per-type create actions.
- One genuine miss either way: Rally's **"Create with details"** escape hatch (quick inline create vs. open the full detail editor) is a documented two-mode create we don't appear to have.

---

## Recommendations, ranked by confidence

| # | Item | Recommendation | Confidence | Why |
|---|---|---|---|---|
| 1 | **Q2 State** | **fix code** — replace the 11-value enum with a `portfolio_item_states` table scoped per `(workspace, portfolio_item_type)`, columns `name`, `rank`, `wip_limit`, `description`, `enabled`; nullable FK from `portfolio_items`; add `state_changed_date` | **Highest** | Two official pages state per-workspace/per-type configurability outright; per-value WIP Limit / Rank / Description / Enabled are undeniable in an enum; `pyral` declares `State` a `WorkspaceDomainObject`. Also our 11 values match no documented default (Rally ships 4). Structural, not cosmetic. |
| 2 | **Q3 Preliminary Estimate** | **fix code** — replace the 6-value size enum with a `preliminary_estimates` table (`name`, `value numeric`, `enabled`, `rank`); nullable FK from `portfolio_items` | **Highest** | Admin page gives five defaults **with numeric values** (XS 13 / S 20 / M 40 / L 100 / XL 250), both columns workspace-editable, plus an Enabled flag; `pyral` declares `PreliminaryEstimate` a `WorkspaceDomainObject`. Our enum discards the numeric value, which is the field's entire point for capacity planning. |
| 3 | **Q4 Refined Estimate** | **fix code** — drop `NOT NULL DEFAULT 0`, make nullable; same for `refined_work_item_count_estimate` | **High** | Not marked *Required* on a page that marks Name/Project/Portfolio Item Type as required and marks read-only fields explicitly; field semantics are "enter… as more is known". `NOT NULL DEFAULT 0` collapses "unrefined" into "refined to zero" and makes the natural planning query unanswerable. (Raw WSAPI nullability itself: **[NO SOURCE]** — the argument is from markings + workflow, and it is strong.) |
| 4 | **Q9 Team on Epic** | **fix code** — drop the DB CHECK forbidding Team on the Epic level | **High** | `Project` is marked ***Required field*** for portfolio items with no level qualification, and Rally calls project "team (project)". Our CHECK forbids what Rally mandates. |
| 5 | **Q6 Planned dates** | **amend SRS** — keep the `date` columns, give the UI a date picker, delete the "plain free-text, intentionally not a date picker" line | **High** | Three independent documented behaviours require a real date: `Late Child Count` compares to Planned End Date; progress-bar gray states branch on Planned Start Date being undefined/future; WSAPI requires ISO 8601. **[NO SOURCE]** for any free-text date in Rally. Our DB is already correct. |
| 6 | **Q10 Archive gate** | **fix code** — remove the "block Epic archive when it has children" rule; model `archived` as a plain reversible boolean, and if delete is added, cascade with a confirmation prompt | **High** | Rally's `Archived` is an unguarded checkbox used for filtering; deletion is documented as cascading to children with a confirm, explicitly including portfolio items. Portfolio items are absent from the Recycle Bin list, which is exactly why archive exists as the reversible option. |
| 7 | **Q5 Work item count estimate** | **no change** (beyond nullability in #3) | **High** | `Refined Work Item Count Estimate` is a real, correctly named, correctly denominated Rally field. Only caveat: Rally's counted population includes **defects**, not just stories. |
| 8 | **Q11 Create UX** | **amend SRS** — drop the New Epic / New Feature menu; keep the single button but make it create the type currently selected in the page's Type filter; consider Rally's "Create with details" second mode | **Medium-High** | Rally's documented flow is *select the type on the page*, then a single `Add New`. Our shipped button is closer to Rally than our SRS; the SRS is the artefact to change. |
| 9 | **Q1 Type names/levels** | **amend SRS** — record Epic/Feature as a deliberate 2-level cut of Rally's configurable 1–5, and note that Broadcom's own documented "Epic" rename renames **Feature** (lowest level), not Initiative | **Medium-High** | Defaults are Theme(3)/Initiative(2)/Feature(1), up to five levels P1–P5, renameable but not reorderable; `Epic` is in no shipped type list (`pyral`: Strategy/Theme/Initiative/Feature). Our single-table + `type` discriminator and story→lowest-level rule are both correct — this is a vocabulary/scope note, not a code fix. |
| 10 | **Q7 Progress display** | **amend SRS + small code adds** — grid stays at two columns; justify or reduce the four detail bars; add the hover callout (Status / Accepted Points / Accepted User Stories / Missing Estimates), the blue/green/yellow/red status colours, and surface `Last Rollup Date` | **Medium** | Two default grid columns MATCH exactly. "Four bars on detail" has **[NO SOURCE]** — Rally documents six `PercentDone*` fields with two shown by default, so four is arbitrary rather than wrong. The callout, colour semantics and rollup-staleness stamp are documented and genuinely missing from ours. |
| 11 | **Q8 Children preview ≤5** | **no Rally target, BA decides** — but do not truncate silently; either show all children on expand, or show a count and a link to the full list | **Medium (as a judgement call)** | Expandable rows are a documented Rally idiom ("Most list views allow you to expand a work item to view child work items"), but **[NO SOURCE]** for any cap. The ≤5 number is ours to justify; the only thing research rules out is unlabelled truncation. |
| 12 | **Q9 Release on Epic** | **amend SRS** — keep the CHECK if BA wants it, but label it "stricter than Rally" | **Medium** | Rally says "**Use** the Release attribute on the lowest level… (typically Feature)" — a recommendation, and its release-planning UI only operates on lowest-level items. **[NO SOURCE]** for a schema-level block, so our CHECK is a hardening, not fidelity. Flag the import risk: real Rally data may carry a Release on a higher-level item. |

### Explicit "no authoritative source found"
- Raw WSAPI nullability of `RefinedEstimate` / `RefinedWorkItemCountEstimate` (object model is behind auth; no public Required/Nullable table).
- Any hard schema-level prohibition on setting `Release` above the lowest portfolio item level.
- Whether deleting a lowest-level portfolio item hard-deletes its child user stories or unparents them — the cascade rule and the remove-is-unparent rule point opposite ways and Broadcom never reconciles them in one place.
- Any documented cap on how many children a list-view row expansion previews.
- Any Rally free-text planned-date field.
- Any "New <Type>" per-type create action or split-button create menu.
- A definitive statement of whether the shipped `Strategy` type is enabled by default (four names ship; three levels are documented as the default).
