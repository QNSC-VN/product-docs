# Rally Timebox Lifecycle, Deletion, and Required Dates — Research vs. Our Clone

**Date:** 2026-08-04
**Product under study:** Broadcom Rally Software (formerly CA Agile Central / Rally Dev, `rally1.rallydev.com`)
**Method:** Official Broadcom TechDocs Rally help, Broadcom support KB articles, official RallyTools SDK examples, Rally community forum threads.
**Evidence labels used below:** **[DOCUMENTED]** = stated in official Broadcom docs/KB; **[API-SCHEMA]** = inferred from official SDK/API field lists or verbatim API validation errors; **[COMMUNITY]** = Rally community forum report; **[NO SOURCE]** = no authoritative source found, do not treat as fact.

> ### Important scope note on the WSAPI object model
> The canonical Rally Web Services API object model (`https://rally1.rallydev.com/slm/doc/webservice/`) is **behind authentication** — it redirects to a login page, and the Internet Archive holds only 302 redirects for `objectModel.jsp` / `index.jsp`, no captured content. Broadcom's public TechDocs WSAPI section (`.../reference/rally-web-services-api.html`) covers query params, versioning, schema endpoints and metadata but **does not publish a per-field Required/Nullable table**.
> Consequently, **every "WSAPI says field X is non-nullable" question below has no authoritative public source.** What we *can* source authoritatively is (a) the UI-level required-field markings in the Rally help field-reference pages, and (b) verbatim API validation error strings quoted in Broadcom KB articles. Those are labelled accordingly. Do not let a reader of this document mistake UI-required for schema-non-null.
> - WSAPI landing: https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reference/rally-web-services-api.html
> - WSAPI attributes page (only documents `_ref`, `_refObjectName`, `_refObjectUUID`, `_type`, `_rallyAPIMajor`, `_rallyAPIMinor` — no required/nullable metadata): https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reference/rally-web-services-api/attributes.html

---

## 1. Timebox deletion: iterations, releases, milestones

### 1a. Iteration deletion

**Rally does this** — an iteration with work items scheduled in it **can be deleted**, with no state gate, and Rally **cascade-unschedules** the items rather than blocking or orphaning them:

> "If you delete an iteration that stories and defects are scheduled in, they will all be updated to unscheduled."
> "There is no recovery or revision history for deleted iterations."
> — [Delete an Iteration, Broadcom TechDocs](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-iterations/managing-iterations/delete-an-iteration.html) **[DOCUMENTED]**

Deletion flow and confirmation: Plan → Timeboxes → Type = Iterations → check the row → Delete from the toolbar → **"Confirm by selecting Delete"** (same URL). So there *is* a confirmation step, but the documented warning is about irrecoverability, **not** about how many items will be unscheduled. **[DOCUMENTED]**

**There is no documented state restriction on deleting an iteration.** The Delete an Iteration page contains no mention of Planning/Committed/Accepted as a precondition. Permissions are the only gate:

> "Organizers can create, edit, and delete iterations from the Timeboxes page."
> "If Restrict Timebox Management is enabled on this workspace, only subscription administrators, workspace administrators, or users with the timebox admin permission can create, update, or delete release or iteration timeboxes."
> — [Managing Iterations, Broadcom TechDocs](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-iterations/managing-iterations.html) **[DOCUMENTED]**

Corroboration that the *items survive* and only the *association* is dropped — Broadcom's own KB tells you to reconstruct the affected set from the Lookback API `_PreviousValues` collection, because the live data no longer references the deleted timebox:

> "How to use Lookback API to find artifacts that were part of a deleted Timebox" — when a timebox is deleted "it can be difficult to know the work items that were affected"; you search the `_PreviousValues` collection for the deleted Release or Iteration ObjectID.
> — [Broadcom KB 143097](https://knowledge.broadcom.com/external/article/143097/rally-lbapi-how-to-use-lookback-api-to.html) **[DOCUMENTED]**

**Our clone: DIVERGES (in both directions).**
Consequence: we invent a `planning`-only deletion gate Rally does not have (blocking a legitimate admin action), and we simultaneously fail to do the one thing Rally guarantees — unschedule the items — so our work items keep a dangling `iteration_id` pointing at a row that no longer exists, which Rally never produces.

### 1b. Release deletion

**Rally does this** — same pattern, same wording, no state gate:

> "There is no recovery or revision history for deleted releases."
> "If you delete a release that iterations are scheduled in, they will all be updated to unscheduled."
> — [Delete a Release, Broadcom TechDocs](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-releases/managing-releases/delete-a-release.html) **[DOCUMENTED]**

Two honest caveats on that quote:
- The phrase "iterations are scheduled in" is odd — in Rally it is *work items*, not iterations, that carry a `Release` reference. The most defensible reading is that this is the iteration page's sentence copy-pasted with a substitution slip, and the actual behavior is the same cascade-unschedule of scheduled artifacts. **Broadcom does not spell out the release→work-item cascade in as many words**, so treat "release deletion unschedules its artifacts" as **[API-SCHEMA / inferred]**, backed by KB 143097 above which explicitly covers *both* "Release or Iteration" ObjectIDs under one "deleted Timebox" procedure. **[DOCUMENTED for the Release case in KB 143097; the exact artifact-level wording is inferred]**
- **No documented restriction on deleting an `Accepted` release**, and no documented notion of "capacity plans" blocking release deletion. **[NO SOURCE]** for any such gate.

**Our clone: DIVERGES.**
Consequence: our `accepted`-or-has-capacity-plans refusal is an invented gate, and our bare DELETE leaves artifacts with a dead `release_id` plus orphaned `milestone_releases` link rows — Rally's contract is that the association is cleaned up, not left dangling.

### 1c. Milestone deletion

**Rally does this** — deletion is permitted and it explicitly severs the association while preserving the work items:

> "Deleting a milestone also removes the association from each work item that was associated with the milestone. The work item itself is not deleted."
> "You must have at least project editor permissions for all projects associated with a milestone in order to delete a milestone."
> — [Delete Milestones, Broadcom TechDocs](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-milestones/managing-milestones/delete-milestones.html) **[DOCUMENTED]**

Flow: Plan → Timeboxes → Type = Milestones → check row(s) → Delete icon. Multi-select delete is supported. Whether the deleted **milestone itself** lands in the Recycle Bin is **not clearly stated** on that page (the page's Recycle Bin sentence is about work items); Rally does have a Recycle Bin feature generally ([Recycle Bin](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/common-pages-and-elements/recycle-bin.html)), and milestones do have revision history ("View Revisions of a Milestone" is a documented subtopic), which is a notable contrast with iterations/releases which have *none*. Milestone-recoverability: **[NO SOURCE — thin]**.

**Our clone: DIVERGES.** (Our clone has no milestone-delete unlink path described; the release-side link rows already orphan.)
Consequence: Rally's guarantee is "association removed, artifact untouched"; if we hard-delete a milestone without clearing `milestone_releases` / artifact links we produce referential garbage Rally never produces.

### Cross-cutting takeaway for Q1

Rally's uniform rule across all three timebox types is: **delete is allowed regardless of state; the association is cleaned up; the associated work is never deleted; and there is no undo for iterations/releases.** Our clone has it backwards on both halves — it gates deletion on state (invented) and does not clean up associations (a correctness bug, not a design choice).

---

## 2. Required dates on iterations and releases

### 2a. Iteration Start Date / End Date

**Rally does this — both dates are mandatory at creation. [DOCUMENTED]**

> "When you add an iteration, you must enter both start and end dates."
> Steps include: "Enter the name of the new iteration." … "Select both start and end dates." … "Select Create."
> — [Add an Iteration, Broadcom TechDocs](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-iterations/managing-iterations/add-an-iteration.html)

The [Iteration Fields](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-iterations/iteration-fields.html) page states "Required fields are marked with an asterisk (\*)" but the rendered field rows for Name/Start Date/End Date/State do not carry a visible asterisk or a "This field is required" sentence — so the *field-reference* page is silent while the *task* page is explicit. Corroborated by Broadcom's own timebox-creation tooling, which requires all three: "Add a Timebox Name, Start Date and End Date" ([RallyTechServices/timebox-creator](https://github.com/RallyTechServices/timebox-creator), referenced from [Broadcom KB 131844](https://knowledge.broadcom.com/external/article/131844/rally-script-to-add-iterations-and-rele.html)). **[DOCUMENTED + API-SCHEMA]**

### 2b. Release Start Date / Release Date

**Rally does this — explicitly required, in so many words. [DOCUMENTED]**

> **Start Date:** "Select the Calendar and select the start date for the release from the resulting calendar. **This field is required.\***"
> **Release Date:** "Select the Calendar and select the date which targets a release from the resulting calendar. **This field is required.\***"
> Required set on the page: **Name\*, Start Date\*, Release Date\*, State\***.
> — [Release Fields, Broadcom TechDocs](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-releases/release-fields.html)

**Can a Rally Release exist with no dates? No — not via any documented path.** Name, Start Date, Release Date and State are all required. **[DOCUMENTED]**

### 2c. WSAPI nullability of `Iteration.StartDate`, `Iteration.EndDate`, `Release.ReleaseStartDate`, `Release.ReleaseDate`

**No authoritative source found.** The WSAPI object model is login-gated (see scope note at top) and the public TechDocs WSAPI pages publish no per-field required/nullable table. What is documented about these fields at the API level is only their *semantics*, not their nullability:

- Timebox dates are normalized to day boundaries in workspace time: "Iteration and Release dates are shifted to either the start of the day or end of the day in the Workspace's time zone", with a worked example — a start date supplied as `2012-06-12T00:00:00:000-0400` is "adjusted to `2012-06-12T03:00:00:000-0400`" in WSAPI 1.30+. — [Advanced WSAPI Rally Topics](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reference/rally-web-services-api/advanced-wsapi-rally-topics.html) **[DOCUMENTED]**
- Dates must be ISO 8601 with optional offset. — same page **[DOCUMENTED]**
- `Iteration.StartDate` / `EndDate` are not returned when fetched through a `Project.Iterations` collection unless the collection is summarized. — [Broadcom KB 131935, WSAPI Collection Summaries](https://knowledge.broadcom.com/external/article/131935/rally-wsapi-collection-summaries.html) **[DOCUMENTED]**

The correct inference is: **the UI mandates all four dates, so a Rally tenant will not contain dateless iterations or releases in practice**, but we cannot cite a schema flag proving the API rejects a null. **[NO SOURCE for the schema flag itself]**

### 2d. Is `EndDate >= StartDate` enforced, and with what error?

**No authoritative source found.** Repeated searches across TechDocs, `knowledge.broadcom.com` and the Rally community turned up **no** documented validation rule and **no** error string for inverted timebox dates. Do not assert one.

Adjacent facts that *are* sourced, and that matter for anyone implementing date rules:

- **End date is treated exclusively in duration math.** A community thread reports Rally computing a 9-day span where an inclusive reading gives 10, i.e. the end date is not counted as a full day of the iteration. — [Rally community: iteration start and end dates](https://community.broadcom.com/viewthread?MID=767583) **[COMMUNITY]**
- **Common practice is adjacent, non-overlapping iterations:** "normally, the iteration ends on the previous day and the new one starts the next day." — same thread **[COMMUNITY]**. Whether Rally *enforces* non-overlap is **[NO SOURCE]**.
- **Cascade alignment does depend on exact date equality.** "For an iteration to be aligned, each hierarchical team's project must have iterations with matching Name, Start Date, and End Date fields to take advantage of the rollup capability." — [Working with Iterations](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-iterations.html); release equivalent "matching Name, Start Date, and Release Date fields" — [Working with Releases](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-releases.html) **[DOCUMENTED]**. Mismatch silently creates *separate* timeboxes rather than erroring: "If the Name, Start Date or End Date do not match throughout the project hierarchy, it creates different releases or iterations, not a single one throughout the projects." — [Broadcom KB 233709](https://knowledge.broadcom.com/external/article/233709/rally-release-or-iteration-has-disappear.html) **[DOCUMENTED]**
- A same-project uniqueness rule on (dates) for iterations surfaced only in a search-engine summary and **could not be confirmed on the cited page**. Treat as **[NO SOURCE]**.

**Our clone: DIVERGES.**
Consequence: our nullable columns + Name-only create modal permit dateless iterations and dateless releases that cannot exist in Rally, which silently breaks every downstream date-derived behavior (current-timebox resolution, burndown windows, milestone comparisons); and the absent `End >= Start` constraint is a defect we should fix on general correctness grounds even though Rally's own enforcement is unproven.

---

## 3. Milestone dates — single TargetDate, or a derived window?

**Rally does this: a Milestone has ONE date, `TargetDate`. There is no start date, no end date, and no window derived from anything. [DOCUMENTED + API-SCHEMA]**

Evidence, strongest first:

1. **The API field list.** Broadcom's own official Python SDK example fetches exactly: `"FormattedID,Name,TargetProject,TargetDate,TotalArtifactCount,Projects,Artifacts"` — a single `TargetDate`, no start/end pair. — [RallyTools/RallyRestToolkitForPython `examples/get_milestones.py`](https://github.com/RallyTools/RallyRestToolkitForPython/blob/master/examples/get_milestones.py) **[API-SCHEMA, official vendor repo]**
2. **The definition.** "Milestones are target dates for events that are important to the business" — a market event, a tradeshow, a code deployment. — [Working with Milestones](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-milestones.html) **[DOCUMENTED]**
3. **Creation UI.** Adding a milestone asks for a name (max 32 chars), a **Target Date**, a Workspace Scoped checkbox, and a Projects selection. No date range. — [Add a Milestone](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-milestones/managing-milestones/add-a-milestone.html) **[DOCUMENTED]**. Editing lets you change "the associated project(s), target date, or name". — [Managing Milestones](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-milestones/managing-milestones.html) **[DOCUMENTED]**
4. **The dataflow runs the OPPOSITE direction from our clone's.** Rally does not compute the milestone date from associated work; it compares associated work *against* the milestone date and flags violations: artifacts scheduled into timeboxes that "end after the milestone target date" are flagged as issues requiring attention. — [Associate Artifacts with a Milestone](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-milestones/managing-milestones/associate-artifacts-with-a-milestone.html) **[DOCUMENTED]** — this is the single most important line in this whole report for our design.
5. **Rendering confirms point-in-time.** On the Timeline page a milestone is an icon plus an optional vertical line at one date — unlike portfolio items, which are the things that span ranges. "Selecting the Milestone icon in the timeline displays a vertical line to make it easier to see the milestone date across the timeline page." — [View Milestones on the Timeline Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/using-the-timeline-page/view-milestones-on-the-timeline-page.html) **[DOCUMENTED]**
6. **Third-party integration mapping agrees:** Aha! maps Rally Milestone → `Name` + a singular `Target date`. — [Aha! Rally milestones integration](https://support.aha.io/aha-roadmaps/integrations/rally/rally-milestones-integration) **[DOCUMENTED, third-party]**

**Milestones are NOT associated with Releases at all.** The association target is artifacts: "You can associate a variety of work item types with a milestone including portfolio items, user stories, test artifacts, or defect artifacts." — [Associate Artifacts with a Milestone](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-milestones/managing-milestones/associate-artifacts-with-a-milestone.html) **[DOCUMENTED]**. Releases are timeboxes, not artifacts, so there is no `Milestone.Releases` collection. Where Rally *does* relate the two, it is again a read-only comparison, not a derivation — see the community app whose entire purpose is "for all Features associated with the selected Release, this app shows the milestones associated with the Feature or its ancestors **that fall within the release boundary**" — [RallyTechServices/milestone-by-release](https://github.com/RallyTechServices/milestone-by-release) **[COMMUNITY, but vendor-services-authored]**

And Rally is emphatic that release ≠ event, which is *why* milestones exist as a separate independent-date concept:

> "Releases do not represent an actual release in the sense of a deployment or shipment. Use milestones to reflect these events, so that you execute on cadence and deliver on demand."
> — [Working with Releases](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-releases.html) **[DOCUMENTED]**

**Our clone: INVENTION.**
Consequence: our `MIN(release start)/MAX(release date)` DB-trigger-derived Target Start/End — read-only whenever ≥1 release is linked — has **no Rally analogue whatsoever**; it inverts Rally's dataflow (Rally: milestone date is an independent commitment that work is measured against; ours: milestone dates are a passive echo of linked releases), which makes the milestone incapable of expressing the one thing Rally uses it for — an externally-fixed business date that scheduled work can be *late for*.

---

## 4. Timebox uniqueness / user-visible formatted IDs

### 4a. Milestone — **has a FormattedID, prefix `MI`. [DOCUMENTED + API-SCHEMA]**

- Verbatim Rally validation error quoted in a Broadcom KB, which also reveals the (Name, Date) uniqueness rule: *"Validation error: Milestone.name and date: Milestone '`<formatted ID>`: `<milestone name>`' already exists with the same"* name and date in the workspace. — [Broadcom KB 10947](https://knowledge.broadcom.com/external/article/10947/rally-how-to-search-for-a-milestone-usi.html) **[API-SCHEMA, verbatim error]**
- Same KB gives the query form: `(FormattedID = "MI444")`. **[DOCUMENTED]**
- `FormattedID` is first in the official SDK milestone fetch list, and that example sorts by `"TargetDate,FormattedID"`. — [get_milestones.py](https://github.com/RallyTools/RallyRestToolkitForPython/blob/master/examples/get_milestones.py) **[API-SCHEMA]**
- It is user-visible as a **left-hand ID column**: "Selecting the formatted ID in the left column displays the full details for the milestone" and "Hovering over the formatted ID displays a summary of the milestone." — [View Milestones on the Timeline Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/using-the-timeline-page/view-milestones-on-the-timeline-page.html) **[DOCUMENTED]**

**Bonus finding:** Rally enforces **uniqueness on (Name, TargetDate) per workspace** for milestones. We have no equivalent constraint.

### 4b. Iterations and Releases — **no formatted ID found; they are identified by Name + dates + Project, and by ObjectID in the API.**

This is an argument from documented absence, so I am flagging the confidence explicitly. The supporting points:

- Neither field-reference page lists any ID field. [Iteration Fields](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-iterations/iteration-fields.html) enumerates Cascade, Inherit, Name, Theme, Start Date, End Date, State, Planned Velocity, Project, the read-only rollups (Plan Estimate / Task Estimate / Accepted / To Do), Notes — no ID. [Release Fields](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-releases/release-fields.html) adds Version but likewise no ID. **[DOCUMENTED absence]**
- `FormattedID` is an **inherited Artifact attribute**. Broadcom: "Artifact is a parent of such objects as Defect and HierarchicalRequirement, and those objects inherit certain attributes from Artifact such as FormattedID" ([Broadcom KB 47772](https://knowledge.broadcom.com/external/article/47772/agile-central-wsapi-how-to-create-and-q.html)). Iteration and Release are timeboxes, not Artifacts, so they do not inherit it. Milestone is the special case that carries one anyway. **[API-SCHEMA, inference]**
- Rally's identity story for timeboxes is Name+dates: dropdown/rollup identity is established by matching "Name, Start Date, End Date" across the hierarchy, and a mismatch produces *distinct* timeboxes ([KB 233709](https://knowledge.broadcom.com/external/article/233709/rally-release-or-iteration-has-disappear.html)). An `MI`-style key would make that whole mechanism unnecessary. **[DOCUMENTED, inference]**
- Broadcom's ObjectID how-to is titled "Find the ObjectID (OID) of Projects, Workspaces, **Timeboxes** and Artifacts" — grouping timeboxes with the OID-addressed things rather than the FormattedID-addressed things, though the body does not state the distinction outright. — [Broadcom KB 47910](https://knowledge.broadcom.com/external/article/47910/find-the-objectid-oid-of-projects-worksp.html) **[weak]**

**No document was found showing an ID column on the Rally Iterations or Releases list.** Confidence: high that none exists, but this is absence-of-evidence, not a positive citation.

**Our clone:**
- `milestone_key` — **MATCHES** in kind (Rally really does surface a milestone formatted ID in a left-hand ID column). Consequence: keep it; align the prefix to Rally's `MI` and add the missing (Name, TargetDate)-per-workspace uniqueness rule.
- `iteration_key` / `release_key` — **INVENTION.** Consequence: we present users a first-class identifier for iterations/releases that has no counterpart in Rally, and it papers over the identity model Rally actually uses (Name + dates + Project, with cross-project alignment by exact match) — so anyone reasoning from our UI will mis-model cascade/rollup behavior.

---

## 5. Iteration state model and transitions

**Rally's values are exactly three, and the descriptions are these. [DOCUMENTED]**

> "Specify the current condition of the iteration. Valid values are: **Planning**: The iteration is not yet active and is still being planned for future activity. **Committed**: The team has committed to the proposed set of work and is ready to begin the iteration. An iteration should be committed to before its start date. **Accepted**: The team has met the iteration criteria."
> — [Iteration Fields](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-iterations/iteration-fields.html)

Note "should be committed to before its start date" — a **norm, not a constraint**.

### Are transitions restricted?

**No documented restriction, in any direction.** `State` is an ordinary editable enum field; no Rally page describes a state machine, allowed-transition table, or precondition. Positive evidence that it moves **backwards** freely — Broadcom's own troubleshooting instructs users to change `Accepted` back to `Planning` or `Committed`:

> "If the State is Accepted, no new work can be added to that release or iteration." … Resolution: "Verify the State is set to Planning or Committed"; if it shows Accepted, "change it to Planning or Committed", since "you can no longer link work items to that release or iteration" when in Accepted state.
> — [Broadcom KB 233709](https://knowledge.broadcom.com/external/article/233709/rally-release-or-iteration-has-disappear.html) **[DOCUMENTED]**

**This is the one real, functional consequence of iteration state in Rally: `Accepted` closes the timebox to new work.** It is also the one thing our clone does not implement.

### Can a user manually set an Iteration to Accepted?

**Yes, with no documented precondition.** No source requires that every scheduled item be Accepted first. **[DOCUMENTED absence + the KB above, which treats Accepted as a freely settable/unsettable value]**

### Does Rally auto-accept an iteration when all its items are accepted?

**No authoritative source found — and the strongest available evidence points the other way.** A Broadcom-answered community thread characterizes iteration state as operator-maintained signalling:

> "The state of the iteration is not part of the calculation on the Enhanced Velocity. It is more a visual indicator of the status of the iteration when viewed on the Plan Iteration page."
> — [Rally community: How does the iteration state (planning, committed, accepted) get used within Rally?](https://community.broadcom.com/viewthread?MID=770738) **[COMMUNITY, Broadcom staff reply]**

⚠️ **Trap to avoid:** Rally *does* auto-roll-up **to Accepted** — but at the **parent user story** level ("when the states for all of the children user stories are set to Accepted, the parent user story is automatically rolled up to reflect the Accepted state"), per [User Story Fields](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/building-your-backlog/user-stories/user-story-fields.html). Search engines will happily extend that sentence to iterations. **It does not apply to iterations, and no Rally source says it does.**

### One-Committed-iteration-per-project restriction?

**No — and Rally's documented handling of the analogous release case shows it tolerates duplicates rather than forbidding them:**

> "**Active**: The release is active and is currently in progress. **If multiple releases have been defined with a state of Active, the release with the earliest start is considered the Active release.**"
> — [Release Fields](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-releases/release-fields.html) **[DOCUMENTED]**

Rally's pattern is *disambiguate by earliest start*, not *reject*. No equivalent sentence exists for iterations, and no one-Committed-per-project rule is documented anywhere. **[NO SOURCE for any such restriction]**

Note also: Release state values are **Planning / Active / Accepted** — *Active*, not *Committed*. Our clone should not assume the two timebox types share an enum.

**Our clone: DIVERGES on three counts, and is MISSING the one behavior that matters.**
Consequence: (a) our one-way `planning→committed→accepted` restriction and (b) our refusal to accept unless every item is accepted are both invented gates that will block legitimate operator actions Rally permits — including the *documented remedy* of reverting Accepted→Planning to reopen a timebox, which our model makes impossible; (c) our automatic `planning|committed → accepted` transition when all items are accepted has **no Rally analogue** and will surprise users by closing a timebox they never closed; and (d) we do not implement Rally's actual rule that an `Accepted` timebox rejects newly scheduled work, so our `accepted` state is decorative where Rally's is load-bearing.

---

## 6. Rollover / carry-over of unfinished work

**Rally has NO built-in timebox-level "move all unfinished items to the next iteration" operation.** It documents exactly two per-story options, and explicitly frames the choice as a team convention, not a feature:

> "**Move** the story out of the recently completed iteration, preferably into the next iteration. This method makes management of the unfinished story easy, but may negatively affect historical iteration charts."
> "**Split** the story in two, leaving a history of unfinished work in the recently completed iteration. This method preserves the fact that the total work planned in the iteration was not completed, but charts that track release scope, parent portfolio items, and time in process may never show 100% completion."
> "decide on a standard way to handle this scenario. Consistency is important to retain historical records."
> — [Manage Unfinished User Stories](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/managing-unfinished-work/manage-unfinished-user-stories.html) **[DOCUMENTED]**

**Move** is a plain field edit, one story at a time, with manual hygiene the user must remember:

> "When you move a user story, you simply edit the work item and change its Iteration value to reflect scheduling in a new iteration."
> Retain the same Plan Estimate; and for tasks completed in the past iteration, "Set the task Estimate and To Do values to 0, to prevent completed task hours from affecting the next iteration's burndown chart."
> "The number of points in a moved story's Planned Estimate field will no longer be applied to the past iteration."
> — [Move an Unfinished User Story](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/managing-unfinished-work/move-an-unfinished-user-story.html) **[DOCUMENTED]** — no bulk operation, no rollover feature mentioned.

**Split** is the real first-class feature, and it is *per story*, reachable from the detail editor **and** from a list view:

> "When you split a user story, the result is an unfinished story in the past iteration (as a historical placeholder) and the orginal story is continued in the next iteration."
> Access via "Actions, Split" in the detail editor; "You can also split a user story from a list view. Select the check box next to the user story, then select Split" from the toolbar.
> Rally sets the historical story's Schedule State to **Complete**, and "Copies discussions and attachments forward with the continued user story."
> By default "completed tasks, defects, and test cases display in the unfinished (historical) story while incomplete tasks, defects, or test cases display on the continued story" (adjustable by drag-and-drop).
> "The next iteration is selected for the continued story by default. **If a future iteration does not exist, it stays in the current iteration.**"
> — [Split an Unfinished User Story](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/managing-unfinished-work/split-an-unfinished-user-story.html) **[DOCUMENTED]**

**Neither Move nor Split changes iteration State.** No source connects carry-over to a state transition. **[DOCUMENTED absence]**

Community context confirming this is a felt gap rather than a shipped feature: teams ask how to move unfinished stories "gracefully" and resort to naming conventions and community apps ([Move of Unfinished User Stories](https://community.broadcom.com/viewthread?MID=766604); [Incomplete Stories for Current Iteration app](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reference/extending-rally-with-apps/app-catalog/incomplete-stories-for-current-iteration.html), which only *displays* incomplete stories). No official "iteration rollover" app or endpoint was found. **[COMMUNITY]**

**Our clone: INVENTION (as a timebox-level endpoint).**
Consequence: `POST /iterations/:id/rollover` has no Rally analogue — Rally's carry-over is deliberately per-story so the team chooses Move-vs-Split each time and pays the documented historical-chart cost knowingly; a one-click bulk move silently commits every story to the "damages historical velocity" option and skips the task Estimate/To-Do zeroing Rally tells users to do by hand.

---

## Recommended changes — ranked by confidence in the Rally evidence

### Tier 1 — Rally behavior is quoted verbatim in official docs. Change these.

1. **On iteration/release delete, unschedule the work items instead of leaving dangling ids.** Rally: "they will all be updated to unscheduled" ([iteration](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-iterations/managing-iterations/delete-an-iteration.html), [release](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-releases/managing-releases/delete-a-release.html)). Null out `work_items.iteration_id` / `release_id` in the same transaction; add the FK (with `ON DELETE SET NULL`) so this cannot regress. Also clear `milestone_releases` rows on release delete. *Highest-value fix in this report — it converts a data-integrity bug into documented Rally behavior.*
2. **Drop the `planning`-only gate on iteration deletion and the `accepted`/capacity-plan gate on release deletion.** No Rally doc conditions timebox deletion on state; the only gate is permissions ("Organizers…"; plus the workspace-level *Restrict Timebox Management* setting) ([Managing Iterations](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-iterations/managing-iterations.html)). Replace state gates with a permission gate.
3. **Make Iteration Start/End Date and Release Start/Release Date required** — non-null columns, required in the DTO, required in the create modal. Rally: "you must enter both start and end dates" ([Add an Iteration](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-iterations/managing-iterations/add-an-iteration.html)); "This field is required.\*" on both release dates ([Release Fields](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-releases/release-fields.html)). Requires a backfill plan for existing dateless rows.
4. **Replace the derived Milestone Target Start/End window with a single, always-editable `target_date`.** Rally's Milestone is one `TargetDate` ([SDK field list](https://github.com/RallyTools/RallyRestToolkitForPython/blob/master/examples/get_milestones.py), [Add a Milestone](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-milestones/managing-milestones/add-a-milestone.html)). Drop the MIN/MAX DB triggers and the read-only-while-linked rule. Then **invert the dataflow**: instead of releases feeding the milestone's dates, flag linked artifacts whose timebox "end[s] after the milestone target date" ([Associate Artifacts with a Milestone](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-milestones/managing-milestones/associate-artifacts-with-a-milestone.html)). *Largest conceptual divergence in the report.*
5. **Implement "an `accepted` timebox rejects newly scheduled work."** Rally: "If the State is Accepted, no new work can be added to that release or iteration" ([KB 233709](https://knowledge.broadcom.com/external/article/233709/rally-release-or-iteration-has-disappear.html)). This is the only load-bearing effect of timebox state in Rally and we are missing it.
6. **Allow `accepted → planning|committed`.** Broadcom's own documented remedy for "I can't schedule work into this timebox" is to change Accepted back to Planning or Committed ([KB 233709](https://knowledge.broadcom.com/external/article/233709/rally-release-or-iteration-has-disappear.html)). Our one-way state machine makes the standard fix impossible.
7. **On milestone delete, remove the associations and leave the linked items alone.** Rally: "Deleting a milestone also removes the association from each work item… The work item itself is not deleted" ([Delete Milestones](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-milestones/managing-milestones/delete-milestones.html)).

### Tier 2 — well-supported by official docs plus API-level evidence. Strongly consider.

8. **Remove the automatic `planning|committed → accepted` transition.** No Rally source auto-accepts an iteration; the closest documented auto-rollup is at the *parent user story* level, not the iteration ([User Story Fields](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/building-your-backlog/user-stories/user-story-fields.html)), and Broadcom staff describe iteration state as "more a visual indicator" ([community thread](https://community.broadcom.com/viewthread?MID=770738)). Auto-closing a timebox nobody closed is worse than leaving it open.
9. **Drop the "manual accept refused unless every item is accepted" precondition.** Rally documents none; "The team has met the iteration criteria" is a human judgement ([Iteration Fields](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-iterations/iteration-fields.html)). If we want a guard, make it a warning, not a refusal.
10. **Align the Release state enum to Planning / Active / Accepted** (not `committed`), and if multiple are Active, resolve by earliest start rather than rejecting — verbatim Rally behavior ([Release Fields](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-releases/release-fields.html)).
11. **Add `(Name, TargetDate)` uniqueness per workspace for milestones**, with a Rally-shaped message. Verbatim Rally error: *"Validation error: Milestone.name and date: Milestone '`<formatted ID>`: `<milestone name>`' already exists with the same"* ([KB 10947](https://knowledge.broadcom.com/external/article/10947/rally-how-to-search-for-a-milestone-usi.html)).
12. **Rename the milestone key prefix to `MI`** to match Rally's `MI444` ([KB 10947](https://knowledge.broadcom.com/external/article/10947/rally-how-to-search-for-a-milestone-usi.html)) and keep surfacing it as a left-hand ID column, which Rally does ([View Milestones on the Timeline Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/using-the-timeline-page/view-milestones-on-the-timeline-page.html)).
13. **Add an `End >= Start` (and `ReleaseDate >= StartDate`) check.** Note honestly: Rally's own enforcement is **unsourced**; justify this as general correctness, not Rally parity. If implemented, treat the end date as *exclusive* in duration math, matching the community-reported 9-vs-10-day behavior ([community thread](https://community.broadcom.com/viewthread?MID=767583)).

### Tier 3 — evidence is absence-based or thin. Discuss before acting.

14. **Reconsider `iteration_key` / `release_key` as user-visible IDs.** No Rally doc lists an ID field on [Iteration Fields](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-iterations/iteration-fields.html) or [Release Fields](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-releases/release-fields.html), and `FormattedID` is an inherited *Artifact* attribute that timeboxes do not inherit ([KB 47772](https://knowledge.broadcom.com/external/article/47772/agile-central-wsapi-how-to-create-and-q.html)). This is argument-from-absence, so it is a product decision: keeping them is a deliberate, defensible UX improvement over Rally — just do not record it as parity. Note the flip side: Rally identifies timeboxes by Name+dates+Project, and cross-project alignment depends on exact Name/Start/End matching ([KB 233709](https://knowledge.broadcom.com/external/article/233709/rally-release-or-iteration-has-disappear.html)), so if we ever add cascade/rollup we will need that matching regardless of our keys.
15. **Reframe `POST /iterations/:id/rollover`, or pair it with a Split.** Rally offers only per-story **Move** and **Split**, and treats the choice as a team convention with documented trade-offs ([Manage Unfinished User Stories](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/managing-unfinished-work/manage-unfinished-user-stories.html)). Options: (a) keep the bulk endpoint as an explicit non-Rally convenience and surface the historical-chart consequence in the UI; (b) additionally implement Rally's **Split** semantics — historical placeholder story left in the old iteration with Schedule State **Complete**, continued story in the next iteration, discussions/attachments copied forward, completed children staying behind, and "if a future iteration does not exist, it stays in the current iteration" ([Split an Unfinished User Story](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/managing-unfinished-work/split-an-unfinished-user-story.html)). Whatever we do, rollover must **not** change iteration state — Rally's never does.
16. **Consider making iteration/release deletion irreversible-with-warning, and milestone deletion revision-tracked.** Rally: "There is no recovery or revision history for deleted iterations"/"…releases", whereas milestones have a documented "View Revisions of a Milestone" ([Managing Milestones](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-milestones/managing-milestones.html)). Whether the deleted milestone itself is recoverable from the Recycle Bin is **not clearly documented** — thin.
17. **Do not add a one-Committed-iteration-per-project rule.** No Rally source supports it, and Rally's analogous release case resolves ambiguity by earliest start instead of rejecting ([Release Fields](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-releases/release-fields.html)).

### Explicitly unresolved — do not assert these as Rally behavior

- **WSAPI nullability flags** for `Iteration.StartDate`, `Iteration.EndDate`, `Release.ReleaseStartDate`, `Release.ReleaseDate` — **no authoritative source found** (object model is login-gated; no Wayback capture; TechDocs publishes no required/nullable table). UI-required is documented; schema-non-null is not.
- **`EndDate >= StartDate` enforcement and its error string** — **no authoritative source found.**
- **Whether Rally forbids overlapping iterations in one project**, and whether same-project (Name, Start, End) uniqueness is enforced — **no authoritative source found** (a search-engine summary asserted it; the cited page did not contain it).
- **Whether the release-delete cascade extends to work items** in the same words as the iteration-delete cascade — the Delete a Release page says "iterations", which is likely a copy-paste slip; [KB 143097](https://knowledge.broadcom.com/external/article/143097/rally-lbapi-how-to-use-lookback-api-to.html) covers Release and Iteration together under "deleted Timebox", so the cascade is near-certain but the exact wording is **inferred**.
- **Whether a deleted Milestone is recoverable from the Recycle Bin** — thin.
