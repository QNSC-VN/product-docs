# How Real Rally Models Task Hours and Roll-Ups

**Research date:** 2026-08-04
**Method:** Web research against Broadcom TechDocs (Rally help), Broadcom Knowledge Base, Broadcom Rally community forum, Rally Lookback API reference, and generated Rally WSAPI domain classes.
**Evidence labels used throughout:**

- **[DOCUMENTED]** — official Broadcom product documentation or KB article states it.
- **[API-SCHEMA]** — inferred from WSAPI object model / generated client / SDK source. Tells us the field exists and its type, not the business rule.
- **[COMMUNITY]** — Broadcom community forum post. Often accurate (many answers are from Rally staff/PMs) but not normative.
- **[NO SOURCE]** — nothing authoritative found. Stated as such rather than guessed.

> **Caveat on doc completeness.** Rally's public help is a *user* manual, not a spec. It documents fields and a handful of automation rules but is silent on most write-path edge cases (deletes, re-parents, field recalculation timing). Several answers below are therefore genuinely thin, and I have said so instead of filling the gap.

---

## 1. Task hour fields — is `Estimate` derived from `ToDo + Actuals`?

### Rally does: three independent, user-entered fields. `Estimate` is NOT derived.

**This settles the P0 dispute. The BA spec's original `Estimate = To Do + Actual` formula is wrong; the reversal to three independent fields is correct.**

The authoritative source is the **Task Fields** reference page. All three hour fields are described with the imperative "**Enter…**", i.e. they are inputs, and none is described as calculated, derived, or read-only — in a table that *does* explicitly mark other fields read-only.

Verbatim, from [Task Fields — Rally, Broadcom TechDocs](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/building-your-backlog/defining-tasks/task-fields.html):

> **Estimate**
> "Enter the number of units estimated to complete the task. This field is a real number and can accept three digits followed by a decimal and two more digits."

> **To Do**
> "Enter the remaining amount of work to be completed for this task. When the task is created, this numerical field is initially defaulted to match the value of the Estimate field."

> **Actuals**
> "Enter the actual number of units it took to complete the task. Temporarily show this field to record time actually spent on tasks as a way to detect lack of availability or software complexity underestimated during planning if those root causes of missed commitments are not already detected during the retrospective."

> **Time Spent**
> "A read-only numerical field that displays the number of hours spent on the task."

> **Rank**
> "A read-only numerical field that displays the relative importance of the related scheduled item."

Note the contrast that makes this decisive: the same table marks `Time Spent` and `Rank` as "**A read-only numerical field**". `Estimate`, `To Do`, and `Actuals` are *not* so marked, and each begins with "Enter". There is no arithmetic relationship documented between them anywhere. **[DOCUMENTED]**

**Corroboration 1 — `Estimate` is a planning-time snapshot, deliberately frozen.** From [What is an Estimate? — Broadcom TechDocs](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/building-your-backlog/sizing-and-estimates-overview/size-and-estimate-for-your-team/what-is-an-estimate.html):

> "The Task Estimate field is used during the iteration planning when the task owner performs the initial estimate, and that value is automatically copied into the To Do field."

and

> "…update the To Do field to reflect how many of the initial hours remain."

If `Estimate` were derived from `ToDo + Actuals` it could not simultaneously be the value that is *copied into* `ToDo`, nor could it be an "initial estimate" against which remaining hours are compared. **[DOCUMENTED]**

**Corroboration 2 — Rally explicitly does *not* compute one hour field from the others.** From the community thread [How can I report team and team member actual hours including estimate?](https://community.broadcom.com/communities/community-home/digestviewer/viewthread?MID=759717), answering a user whose `Actuals` were blank:

> Rally does not automatically default Actuals to "Estimate minus To Do" when the Actuals field is empty.

The recommended fix was a custom AppSDK2 app — i.e. no such derivation exists in the product. This kills the inverse formula too (`Actuals = Estimate − ToDo`), which is the same identity rearranged. **[COMMUNITY]**

**Corroboration 3 — guidance treats `Estimate` as immutable history and `ToDo` as the live number.** From [Task estimation and To do efforts](https://community.broadcom.com/viewthread?MID=798035), where a user asks whether to grow `Estimate` or `ToDo` when work exceeds the estimate:

> "leave the Estimate as-is, based on the information that you had at the time…If the additional work is related to an existing task(s), I would increase the To Do hours"

Under a derived-`Estimate` model this advice would be meaningless — `Estimate` would move on its own. **[COMMUNITY]**

**Exact WSAPI names, confirmed.** The generated Rally WSAPI domain class for `Task` declares, as plain read/write `Double` properties with both getters and setters: [`Task.java`, Rally WSAPI v1.37 generated domain](https://github.com/bprat/rally-service/blob/master/src/main/java/com/rallydev/webservice/v1_37/domain/Task.java)

| WSAPI attribute | Type | UI label |
| --- | --- | --- |
| `Estimate` | `Double` | Estimate |
| `ToDo` | `Double` | To Do |
| `Actuals` | `Double` | Actuals (hidden by default) |
| `TimeSpent` | (absent in v1.37; added with Time Tracker) | Time Spent (read-only) |

**[API-SCHEMA]** — three separate settable scalars, no computed accessor.

**One nuance worth recording:** `Actuals` is **hidden by default** in the Rally UI, and the docs frame it as something to "*Temporarily* show … to record time actually spent" for diagnosing missed commitments. It is a diagnostic opt-in field, not a core part of the loop. Rally's own recommendation is to hide it entirely if you adopt Time Tracker (see §7).

### Our clone: **MATCHES**

Three independent hour columns `estimate_hours` / `todo_hours` / `actual_hours` is exactly Rally's model.

**Consequence:** the P0 dispute resolves in favour of the code and the *revised* BA spec; the original "Estimate = To Do + Actual (derived, read-only)" line should be struck from the BA baseline as a factual error, not carried as an open question.

---

## 2. Auto-behaviours on Task hours

### 2a. Estimate → To Do copy on first entry

**Rally does: yes, and it is documented — but scoped to task creation.** [Task Fields](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/building-your-backlog/defining-tasks/task-fields.html):

> "**When the task is created**, this numerical field is initially defaulted to match the value of the Estimate field."

and [What is an Estimate?](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/building-your-backlog/sizing-and-estimates-overview/size-and-estimate-for-your-team/what-is-an-estimate.html):

> "…that value is automatically copied into the To Do field."

**[DOCUMENTED]**

### Our clone: **DIVERGES (narrowly)**

Our clone copies on the *first Estimate entry at any time*, gated on `todo_hours IS NULL`. Rally's documented trigger is *task creation* — a task created with a blank Estimate, then given an Estimate on day 3, is not documented to back-fill `ToDo`.

**Consequence:** low-severity behavioural difference, but it means a Rally user who deliberately left `ToDo` empty on an already-created task will see our clone silently populate it. Either accept the divergence as a usability improvement and document it, or move the copy into the create path only.

### 2b. Does setting a Task to Completed zero out To Do?

**Rally: NO AUTHORITATIVE SOURCE FOUND.** The evidence is contradictory and entirely non-normative.

*Evidence for auto-zeroing:*

- [Task estimation and To do efforts](https://community.broadcom.com/viewthread?MID=798035) — accepted "best answer": upon completion, To Do zeroes out, while `Actuals` (if enabled) retains the hours spent. **[COMMUNITY]**
- [Please clarify what fields affect the Burndown Chart](https://community.broadcom.com/viewthread?MID=753825): when team members complete tasks, "this by default sets the Task state to Complete and To Do to zero". **[COMMUNITY]**
- Indirect official hint — [Add Timesheet Entries](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reporting/track-and-report-billable-time/enter-your-time/add-timesheet-entries.html): *"In-progress tasks are defined as tasks that are not complete or still have remaining hours in the todo field."* Rally treats "not complete" and "todo > 0" as *separate* disjuncts, which only makes sense if the two can come apart — i.e. a completed task with non-zero `ToDo` is a state Rally expects to encounter. This actually cuts **against** hard auto-zeroing. **[DOCUMENTED, indirect]**
- Functional pressure: the Story Burndown Chart plots `Task To Do` hours (see §6), so burndown could not reach zero unless completed tasks end at `ToDo = 0`.

*Evidence against auto-zeroing:*

- [Move an Unfinished User Story](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/managing-unfinished-work/move-an-unfinished-user-story.html) instructs users **manually**: *"Set the task Estimate and To Do values to 0, to prevent completed task hours from affecting the next iteration's burndown chart."* If the server zeroed `ToDo` on completion, this instruction would be unnecessary for the completed tasks it is talking about. **[DOCUMENTED]**

**Best reading:** the zeroing is most likely a **client-side convenience in some Rally UI surfaces** (the "mark complete" affordance on the Task Board / detail page setting `ToDo = 0` as part of the same save), **not a server-enforced invariant**. A WSAPI `PUT` setting only `State: "Completed"` is not documented to touch `ToDo`. Confidence: low-to-moderate.

### Our clone: **MATCHES (in spirit), with a stronger guarantee than Rally documents**

Our clone zeroes `todo_hours` on Completed. That reproduces the observable Rally behaviour reported by the community and is what the burndown needs.

**Consequence:** keep it — but implement it as a *service-layer default on the state transition*, not a DB trigger/invariant, so an importer or API client can express Rally's legal-but-odd "completed with To Do remaining" state. If we hard-enforce it, we will not be able to ingest real Rally data faithfully.

### 2c. Does reopening a task restore To Do?

**Rally: NO AUTHORITATIVE SOURCE FOUND.** No documentation, KB article, or forum answer describes restoring a previous `ToDo` on reopen. Rally does not appear to retain a prior-`ToDo` value anywhere in the object model to restore *from* (there is no shadow field on `Task`). **[NO SOURCE]** — but the absence of any restore mechanism in the schema is weak negative evidence that no restore happens.

### Our clone: **MATCHES**

We do not restore. This is almost certainly correct, and matches how the guidance reads: after reopening, the owner re-enters remaining hours by hand (consistent with "update the To Do field to reflect how many of the initial hours remain").

**Consequence:** none. But the UI should make a reopened task's `ToDo = 0` visibly *stale* (prompt/warn), because a reopened task sitting at `ToDo = 0` silently under-reports the burndown.

### 2d. Is any of this configurable per workspace?

**Rally: no hour-field automation toggle found. [NO SOURCE]** The one relevant configuration flag Rally has in this area — **Auto State Updates** — governs *state* propagation, not hours (see §4). No workspace or project setting for the Estimate→ToDo copy or the completion zeroing was found.

### Our clone: **MATCHES** (we have no toggle either).

**Consequence:** none now. If we ever add one, model it on Rally's Auto State Updates (project-scoped checkbox), not a workspace-wide switch.

---

## 3. Story-level roll-ups

### Rally does: read-only derived totals, surfaced in a dedicated "Task Rollup" section.

From [User Story Fields — Broadcom TechDocs](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/building-your-backlog/user-stories/user-story-fields.html), which groups these under a **Task Rollup** heading and marks them read-only:

> **Task Estimate** — "Number of units estimated to complete a single task. Calculated in increments of task units defined by your administrator."
> **To Do** — "Amount of effort remaining to complete a task. Calculated in increments of task units defined by your administrator. Task estimates are measured in iteration units."
> **Actual** — "Amount of effort it took to complete a task."

All three are read-only in the Task Rollup section. **[DOCUMENTED]**

**Exact WSAPI names, confirmed.** On `HierarchicalRequirement`, as `Double`: `TaskEstimateTotal`, `TaskRemainingTotal`, `TaskActualTotal` — plus a `TaskStatus` (`String`) summary field and a `Tasks` collection. [`HierarchicalRequirement.java`, WSAPI v1.37](https://github.com/bprat/rally-service/blob/master/src/main/java/com/rallydev/webservice/v1_37/domain/HierarchicalRequirement.java) **[API-SCHEMA]**

Mapping (unambiguous from the labels and semantics): `TaskEstimateTotal` = Σ child `Task.Estimate`; `TaskRemainingTotal` = Σ child `Task.ToDo`; `TaskActualTotal` = Σ child `Task.Actuals`.

**Read-only is corroborated at the API layer.** Rally's own reference app strips these three fields before writing a story, treating them as server-owned: [`StoryDeepCopyApp.html`, RallyApps/app-catalog](https://github.com/RallyApps/app-catalog/blob/master/src/legacy/StoryDeepCopyApp.html) filters `TaskActualTotal`, `TaskEstimateTotal`, `TaskRemainingTotal` out of the payload. **[API-SCHEMA]**

**They are materialised (stored), not computed at read time.** They are queryable/sortable/filterable in WSAPI and available as *snapshot* fields in the Lookback API, which only carries persisted values: the Lookback manual lists under "Additional Available Fields" — "All numeric fields (`PlanEstimate`, `TaskActualTotal`, `TaskEstimateTotal`, etc.)" ([Rally Lookback API](https://rally1.rallydev.com/analytics/doc/)). A per-request computation could not appear in a historical snapshot store. **[API-SCHEMA]**

**Recalculation timing: NO AUTHORITATIVE SOURCE FOUND** for the task roll-ups specifically. **[NO SOURCE]** However, Rally documents that its *other* roll-up family is explicitly asynchronous and lagged — for Portfolio Items, "The calculation of the Percent Done values may be delayed (for example, when changes are made to accepted child user stories or when user stories are removed from a feature)", with a system-generated `Last Rollup Date` to expose the lag ([Portfolio Item Fields](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/managing-portfolio-items/portfolio-item-planning/creating-portfolio-items/portfolio-item-fields.html)). There is no equivalent "last rollup" field for the task totals, which weakly suggests the task roll-up is synchronous on task save. Treat as unresolved.

**Above the story: not native.** No task-hour roll-up fields exist on Portfolio Items — the Portfolio Item Fields page has no task-hour fields at all, only story points and story counts. Aggregating task actuals to a Feature/PI requires a custom app, which is precisely what [RallyTechServices/rally-task-actual-rollup](https://github.com/RallyTechServices/rally-task-actual-rollup) ("A grid summing task actuals for items rolling up to PIs") exists to do. **[DOCUMENTED + API-SCHEMA]**

**Story with no tasks:** NO AUTHORITATIVE SOURCE FOUND on null vs 0. **[NO SOURCE]**

### Our clone: **MATCHES on semantics, DIVERGES on storage**

Read-only-and-derived-from-children is right. But Rally *persists* the three totals on the story row; we compute them on the fly and store nothing.

**Consequence — this is the real gap here.** Because Rally stores them, a Rally user can **sort a story grid by Task To Do**, **filter `TaskRemainingTotal > 0`**, and **chart them historically**. Our computed-only approach cannot do any of those without a correlated subquery per row, and cannot do the historical chart at all. If story-list sorting/filtering by task hours is in scope, these need to become stored, trigger-maintained columns. Also note we are missing `TaskStatus`, Rally's rolled-up task-progress string on the story.

---

## 4. Task state and parent state

### Rally does: auto-propagate task state to the parent's ScheduleState, by an explicit documented rule set, with a project-level opt-out.

**Task `State` values:** `Defined`, `In-Progress`, `Completed`. Tasks have no `Accepted`. **[DOCUMENTED, weakly]** — the value list is consistently reported but I did not find a Rally page that enumerates Task `State` values in a table the way Task Fields does for the hour fields; treat the exact strings as high-confidence-but-not-quoted. The hyphenation is confirmed for the *story* side: `ScheduleState` values are quoted verbatim as "Defined", "In-Progress", "Completed", "Accepted" in [Define Rally Artifact States](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/valueops-insights-saas/insights/administration/for-organizations-that-do-not-use-rally/define-rally-artifact-states.html) and in the [Rally Glossary](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reference/glossary.html) ("A standard field in Rally with six possible values. Values that cannot be modified are Defined, In-Progress, Completed, and Accepted."). At the API layer `Task.State` is a plain `String` **[API-SCHEMA]**.

**The propagation rules**, verbatim from [Task State Updates Parent Schedule State — Broadcom TechDocs](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/building-your-backlog/defining-tasks/task-state-updates-parent-schedule-state.html):

> "A schedulable work item can be a user story, defect, defect suite, test set, or risk."

> "If all tasks become Defined, the schedulable work item's schedule state will become Defined."
> "If all tasks become Completed, the schedulable work item schedule state will become Completed."
> "Otherwise, the schedulable work item schedule state will become In Progress."

Worked examples given on the same page:

> "Adding a task to a story in Idea will make the story Defined."
> "Making the first task In Progress for a story in Defined will make the story In Progress."
> "Making the last task Completed for a story In Progress will make the story Completed."
> "**Adding a task to a story in Completed will make the story In Progress.**"

**[DOCUMENTED]**

Three things to extract from that rule set:

1. **The rule is a pure function of the whole task set**, not of the single task being edited. "If all tasks become Completed" / "If all tasks become Defined" / "Otherwise". Any operation that changes set membership therefore changes the answer.
2. **Regression is explicitly in scope, including out of a terminal state.** "Adding a task to a story in Completed will make the story In Progress" is a documented *backwards* move.
3. **It regresses `Accepted` stories too.** From [Have you ever updated the state of a task, only to find it unexpectedly updated its parent's schedule state?](https://community.broadcom.com/viewthread?MID=759409) — the motivating example is adding a release task to an **accepted** story, which "moved the story back to in progress" unintentionally. That thread is the feature announcement for the opt-out. **[COMMUNITY]**

**Configurability — yes, and this is a real Rally feature we lack.** The setting is **Auto State Updates**, at project level. From [Rally: how to deactivate the behavior of changing user story status based on task status (KB 254405)](https://knowledge.broadcom.com/external/article/254405/rally-how-to-deactivate-the-behavior-of.html): the setting is "Auto State Updates", found in the Project/Subscription configuration area; you "uncheck Auto State Updates"; it "controls whether changing the task state also changes the parent schedule state." Subscription/workspace admins can disable it per project, and a subscription-level setting delegates the control to project admins. The documented guidance is: leave it **on** for Scrum/timebox teams, **off** for Kanban/flow teams (because unintended forward/backward moves corrupt time-in-state metrics). **[DOCUMENTED]**

**Edge cases:**

- **DELETE the last incomplete task → NO AUTHORITATIVE SOURCE FOUND. [NO SOURCE]** But the rule is stated over the whole task set ("if all tasks become Completed"), so deleting the one blocker leaves a set that is entirely Completed. The rule as written implies the parent flips to Completed. Not documented; inferred.
- **ADD a task to an already-Accepted story → DOCUMENTED for Completed, COMMUNITY-confirmed for Accepted.** "Adding a task to a story in Completed will make the story In Progress"; the community thread confirms the same regression from Accepted.
- **RE-PARENT a task (change `Task.WorkProduct`) → NO AUTHORITATIVE SOURCE FOUND. [NO SOURCE]** A re-parent is simultaneously a removal from set A and an addition to set B, so under the set-based rule *both* stories should re-evaluate. Inferred, not documented.

### Our clone: **partially MATCHES, three real DIVERGENCES, one missing feature**

| Behaviour | Rally | Our clone | Verdict |
| --- | --- | --- | --- |
| All tasks Completed → parent Completed | yes | yes | MATCHES |
| Task → In-Progress reopens parent | yes ("Otherwise… In Progress") | yes | MATCHES |
| All tasks Defined → parent back to Defined | yes | not implemented | DIVERGES |
| Task CREATE re-evaluates parent | **yes, documented verbatim** | skipped | **DIVERGES** |
| Task DELETE re-evaluates parent | implied by set-based rule | skipped | DIVERGES (vs. inferred behaviour) |
| Task RE-PARENT re-evaluates both parents | implied by set-based rule | skipped | DIVERGES (vs. inferred behaviour) |
| Regresses even from Accepted | yes | ? (we auto-complete/reopen; Accepted handling unclear) | needs check |
| Per-project "Auto State Updates" opt-out | yes | absent | MISSING FEATURE |

**Consequence:** the CREATE gap is the clearest bug — it contradicts a rule Rally states in one sentence, and it is the exact scenario Rally's own community thread was written about. Our clone's core error is architectural: we implemented parent state as *event handlers on specific task transitions*, whereas Rally implements it as a *recompute-from-the-whole-set function*. Recasting it as "on any change to a story's task set, recompute the story's state from all its tasks" fixes CREATE, DELETE and RE-PARENT in one change and gets the all-Defined rule for free.

---

## 5. Task Iteration — own field, or inherited from the parent Story?

### Rally does: a Task has its own real `Iteration` field (and `Release`, and `Project`) as first-class object references.

**[API-SCHEMA]** The generated WSAPI `Task` class declares full object references with getters *and setters*: [`Task.java`, WSAPI v1.37](https://github.com/bprat/rally-service/blob/master/src/main/java/com/rallydev/webservice/v1_37/domain/Task.java)

| Attribute | Type |
| --- | --- |
| `Iteration` | `com.rallydev.webservice.v1_37.domain.Iteration` |
| `Release` | `com.rallydev.webservice.v1_37.domain.Release` |
| `Project` | `com.rallydev.webservice.v1_37.domain.Project` |
| `WorkProduct` | `com.rallydev.webservice.v1_37.domain.Artifact` |

Second, independent confirmation that `Task.Iteration` is a real live field: the Lookback API lists it among **unavailable** (non-snapshotted) fields — "Iteration or Release on Tasks" is called out under *Unavailable Fields* in the [Rally Lookback API manual](https://rally1.rallydev.com/analytics/doc/). You can only exclude from the historical store a field that exists on the live object. **[API-SCHEMA]**

Third, Rally's UI treats tasks as iteration-scoped entities in their own right: the Iteration Progress banner reports "Number of active tasks in the iteration" ([Using the Iteration Progress Banner](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/iteration-status-page/using-the-iteration-progress-banner.html)). **[DOCUMENTED]**

### Whether it can *diverge* from the parent: NO AUTHORITATIVE SOURCE FOUND.

**[NO SOURCE]** I could not find a Rally page or KB article stating either (a) that `Task.Iteration` is read-only / server-maintained, or (b) that you may set a task to a different iteration than its story. The available signals point in opposite directions and I will not resolve them by guessing:

- *Toward "settable"*: the WSAPI class has a public setter; a third-party connector reference exposes Task "Iteration Name"/"Iteration ID" as writable inputs ([Rally connector reference, Azuqua](https://learn.azuqua.com/connector-reference/rally/)) — though this is a third-party doc and its writability claim is not evidence of server acceptance.
- *Toward "derived/pinned"*: Rally's inheritance language elsewhere is "inherit **a copy of** the values" — from [Parent-Child Relationships](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/building-your-backlog/identifying-dependencies/parent-child-relationships.html): *"Children inherit a copy of the values for Release, Iteration, State, Rank, Owner, and Blocked from their parent."* That is copy-on-create semantics, which *permits* later divergence — but note this sentence is about parent/child **user stories**, not tasks, so it does not transfer directly.
- The Lookback exclusion of "Iteration or Release on Tasks" is itself suggestive: Rally chose not to track task iteration historically, which is what you would expect of a value considered a denormalised echo of the parent rather than independently meaningful.

**My honest reading, flagged as inference not evidence:** `Task.Iteration` is a copy denormalised from the `WorkProduct` at create time and re-synced when the story moves, and Rally does not intend users to diverge it — but I found no source that says so, and the setter exists. **Unresolved.**

### Our clone: **DIVERGES on strictness (with an INVENTION in the enforcement)**

We *derive* task iteration from the parent story and **refuse** independent assignment (DB trigger + service refusal). Rally has a genuine, settable-looking `Iteration` reference on `Task`.

**Consequence:** our hard refusal is stricter than anything Rally documents, and it is enforced at the *schema* level, which is the risky part — if the real answer turns out to be "copy-on-create, divergence tolerated", a trigger is expensive to unwind and will reject faithful Rally imports. **Recommend keeping the derived default but demoting the trigger to a service-layer default**, and marking this item as needing a live-tenant test (see recommendations). This is the one question where I would not ship a schema constraint on the strength of the evidence available.

---

## 6. Percent-done semantics — state counts or hours?

### Rally does: **never** compute progress as `Actuals / Estimate`. Anywhere.

This is the clearest negative finding in the report. Every documented Rally progress figure is one of: accepted **points**, accepted **story counts**, **remaining hours (To Do)**, or a **count of active tasks**. `Actuals ÷ Estimate` does not appear as a progress metric in any Rally surface I could find.

**6a. `PercentDoneByStoryCount` / `PercentDoneByStoryPlanEstimate` live on Portfolio Items, and are story-based, not task-based.** Verbatim from [Portfolio Item Fields](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/managing-portfolio-items/portfolio-item-planning/creating-portfolio-items/portfolio-item-fields.html):

> **Percent Done By Story Count** — "The value of this field is calculated by the number of accepted user stories divided by the total number of user stories associated with the portfolio item."
> **Percent Done By Story Plan Estimate** — "The value of this field is calculated by dividing the number of accepted points by the total user story points for user stories associated with the portfolio item."
> **Last Rollup Date** — "The last date and time that the values for Percent Done by Story Plan Estimate and Percent Done by Story Count were updated. This is a system-generated field, and cannot be edited."
> "The calculation of the Percent Done values may be delayed (for example, when changes are made to accepted child user stories or when user stories are removed from a feature)."

Both are read-only and asynchronously recalculated. Both key off **`Accepted`** — not Completed, not hours. **[DOCUMENTED]** There is **no `PercentDoneByTask…` field** in Rally. **[NO SOURCE — searched, none found]**

**6b. The Team Status page per-member bar is a *capacity/load* indicator, not a progress indicator.** This is where our clone is most wrong. Verbatim from [Team Status Page — Broadcom TechDocs](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/additional-tracking-pages/view-team-status-page.html):

> "The percentage is calculated by dividing the task estimate total by the individual's cumulative capacity across all of their projects."

> Green: "the calculated percentage is 100% or less and the project team member's capacity is within the recommended range of scheduled capacity."
> Red: "the calculated percentage is greater than 100% and the project team member is over scheduled and at risk of not being able to complete all scheduled work."

So the numerator is **`TaskEstimateTotal` for that member's assigned tasks** and the denominator is **the member's declared capacity** — and the semantic is **over-/under-commitment**, not completion. The bar also only populates if the member has a capacity value and owns tasks in the iteration (otherwise it renders as a blank grey bar). Per-member columns are Capacity, current total Estimate for their assigned tasks, and remaining To Do for uncompleted tasks. **[DOCUMENTED]**

**6c. The Iteration Progress banner is points + counts.** Verbatim from [Using the Iteration Progress Banner](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/iteration-status-page/using-the-iteration-progress-banner.html):

> **Planned Velocity** — "Total number of story points (or another unit type) the team estimates they can complete within the iteration."
> **Iteration End** — "Number of days left in the iteration out of the number of total days in the iteration."
> **Accepted** — "Percentage and number of accepted points out of the total points in the iteration."
> **Defects** — "Number of active defects in the iteration."
> **Tasks** — "Number of active tasks in the iteration."

The only task metric on the banner is a **count of active tasks** — i.e. state-derived. No hours-based percentage exists here. **[DOCUMENTED]**

**6d. Burndown uses remaining hours (`ToDo`), not `Actuals`.** From [Story Burndown Chart](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reporting/rally-reports-and-charts/burndown-burnup-charts/story-burndown-chart.html):

> "If you are using tasks for the story, you can see the remaining hours (Task To Do) for each day."
> "The Task To Do hours are indicated by the blue bars in the chart."
> "The green bars represent the number of points that have been completed or accepted."

So the hour-based view of progress in Rally is **`ToDo` burning down**, and the points-based view is **accepted points burning up**. `Actuals` is explicitly excluded — [the burndown thread](https://community.broadcom.com/viewthread?MID=753825): "No, actuals play no part in the burndown.. They are normally turned off by default and often used by teams for retrospective purposes." **[DOCUMENTED + COMMUNITY]**

### Our clone: **Team Status bar = INVENTION (and semantically inverted). Iteration Status counts = MATCHES.**

- `actualHours / estimateHours` for the Team Status member bar exists nowhere in Rally. Worse, it is a *different kind of quantity*: Rally's bar answers "is this person over-committed?" (estimate vs capacity, where **>100% is bad/red**), ours answers "how much of the estimate has been burned?" (where >100% would also be bad, but for an unrelated reason). A user reading our green/red would draw the wrong conclusion.
- Our Iteration Status state-based task counts **MATCH** Rally's "Number of active tasks in the iteration".

**Consequence:** the "inconsistency" flagged in our tracker is not a case of picking the wrong one of two valid options — **the state-count side is right and the hours side is a fabricated metric**. Fixing it requires an `individual capacity` concept on team membership, which we may not have; if we lack capacity, the honest substitute is to show the raw Estimate / To Do / (Actuals) columns Rally also shows per member, and drop the bar rather than invent a ratio.

---

## 7. Time tracking — is `Task.Actuals` summed from time entries?

### Rally does: **no.** `Actuals` is manual and explicitly unrelated to timesheets. A *separate* read-only field, `Time Spent`, is the one fed by time entries.

Rally has **two** distinct "time actually spent" fields and they are not connected:

| Field | Nature | Source |
| --- | --- | --- |
| `Actuals` | manually entered, hidden by default | typed by the user |
| `TimeSpent` ("Time Spent") | **read-only** | Rally Time Tracker timesheet entries (`TimeEntryItem` / `TimeEntryValue`) |

From [Time Spent vs Actuals (KB 57583)](https://knowledge.broadcom.com/external/article/57583):

> **Time Spent** — "a read-only, numerical field that displays the number of hours spent on the task", populated through Rally Time Tracker timesheet entries.
> **Actuals** — "**not related to timesheets**"; used to record actual time spent for detecting availability issues or estimate problems; hidden by default.

and the same article notes neither field updates automatically when Estimate or To Do change. **[DOCUMENTED]**

Confirmed by Rally product management in [How does "Time Spent" field on workitem - Task work?](https://community.broadcom.com/enterprisesoftware/communities/community-home/digestviewer/viewthread?GroupId=2437&MessageKey=a6336457-7abe-447f-b09d-fb8ebd94dc40&CommunityKey=f303f769-8d4c-44d9-924c-3845bba6444e) — Andrea Schilde (Rally PM):

> "if you track your time using Rally's Timesheet features, then the 'time spent' will match the values you entered in your timesheet for these tasks."

**[COMMUNITY, authoritative speaker]**

`Task Fields` independently confirms the read-only nature: *"Time Spent — A read-only numerical field that displays the number of hours spent on the task."* **[DOCUMENTED]**

**Rally's own direction of travel is to retire `Actuals` in favour of Time Tracker.** From [Track and Report Billable Time](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reporting/track-and-report-billable-time.html):

> "Existing customers currently using the task Actuals field to track development time and cost will find Rally Time Tracker a better solution for reporting time spent on calendar boundaries (days, weeks, months)."
> "To avoid developer confusion, hide the task Actuals field from view when you adopt Rally Time Tracker."

Timesheet scope, from [Add Timesheet Entries](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reporting/track-and-report-billable-time/enter-your-time/add-timesheet-entries.html):

> "Rally supports these types of timesheet entries: user stories, tasks, defects and projects."
> "In-progress tasks are defined as tasks that are not complete or still have remaining hours in the todo field."
> "You can only add tasks that are scheduled for the week you viewing."

Time Tracker also offers a **"Sum of Time Spent"** option rolling task time up to the parent story/defect. **[DOCUMENTED]**

And to close the loop on §1: Rally does *not* derive `Actuals` from anything — [thread MID=759717](https://community.broadcom.com/communities/community-home/digestviewer/viewthread?MID=759717) confirms it will not default `Actuals` to "Estimate minus To Do".

### Our clone: **MATCHES on `actual_hours`; MISSING the `Time Spent` field**

Severing `TimeLog` from `actual_hours` and keeping Actual a manual column is **exactly right** — it reproduces Rally's documented separation, and the instinct that it was a bug is mistaken.

**Consequence:** the gap is not that `TimeLog` is severed, it is that we have **nowhere for the TimeLog sum to surface**. Rally's answer is a second, read-only `time_spent` field derived from time entries, plus a story-level "sum of time spent" roll-up. Add those and the TimeLog table stops looking orphaned — without ever touching `actual_hours`.

---

## Recommended changes, ranked by confidence

### Tier 1 — act now, evidence is direct and quoted

1. **Close the P0 as "code is right, BA baseline is wrong."** Keep three independent hour fields. Strike `Estimate = To Do + Actual` from the BA spec as a factual error and cite the Task Fields verbatim quotes in §1. *Confidence: very high — three independent official sources, one exact quote.*

2. **Re-architect parent-state propagation from per-transition handlers to a set recompute.** Replace the current transition hooks with: *on any change to a story's task set (create, delete, state change, re-parent), recompute the story's ScheduleState from all its tasks* using Rally's rule — all Defined → Defined; all Completed → Completed; otherwise In-Progress. This fixes the CREATE gap (documented verbatim), the DELETE gap, the RE-PARENT gap (both parents), and adds the missing all-Defined regression, in one change. *Confidence: very high for the rule and for CREATE; high for DELETE/RE-PARENT as the rule's logical consequence.*

3. **Delete the `actualHours / estimateHours` progress bar on Team Status.** It is a fabricated metric with inverted meaning. Replace with Rally's actual model — `TaskEstimateTotal ÷ member capacity`, green ≤100% / red >100%, blank grey when capacity is unset — if we have a capacity concept. If we do not, show the per-member Estimate / To Do columns Rally shows and ship no bar. *Confidence: very high that ours is wrong; high on the replacement formula (quoted verbatim).*

4. **Keep the Iteration Status task counts state-based.** Already correct; document it as intentional so the "inconsistency" ticket closes in the right direction. *Confidence: high.*

5. **Keep `actual_hours` manual and `TimeLog` severed — and add a derived read-only `time_spent`.** Our severance matches Rally. Add `Task.time_spent` (Σ time entries, read-only) and a story-level sum-of-time-spent roll-up. Consider hiding `actual_hours` by default, as Rally does and as Rally advises when Time Tracker is in use. *Confidence: high.*

### Tier 2 — act, but the reasoning is partly inferred

6. **Add a project-level `Auto State Updates` toggle** defaulting to on, gating everything in item 2. Rally ships this and documents *why* (Kanban teams must disable it); without it, flow-based teams get corrupted time-in-state metrics. *Confidence: high that Rally has it; medium on whether we need it for our scope.*

7. **Store `task_estimate_total` / `task_remaining_total` / `task_actual_total` on the story instead of computing them.** Rally persists them (proven by their presence in the Lookback snapshot store) and that is what makes story grids sortable and filterable by task hours. Add a `task_status` summary field too. *Confidence: medium-high — the "stored" conclusion is API-schema inference; the capability argument is solid regardless.*

8. **Demote the task-Iteration DB trigger to a service-layer default.** Keep deriving iteration from the parent story, but stop enforcing it in the schema. Rally's `Task` has real `Iteration` / `Release` / `Project` references with setters, and I found no source saying they are read-only — so a schema-level refusal is a bet we cannot currently justify, and it will reject faithful Rally imports. *Confidence: medium — high that `Task.Iteration` exists as a real field, low on whether divergence is permitted.*

9. **Re-implement the completion zeroing of `todo_hours` as a service-layer default rather than an invariant.** The zeroing behaviour is right (community-reported, and burndown requires it), but Rally's own timesheet doc implies "completed with To Do remaining" is a reachable state, so do not make it impossible to represent. *Confidence: medium — behaviour is community-sourced only, and one official page cuts against it.*

10. **Narrow the Estimate→To Do copy to task creation**, matching the documented trigger ("When the task is created"), or keep the broader `todo IS NULL` gate and record it as a deliberate, documented improvement. *Confidence: medium-high on Rally's trigger being creation-scoped; low impact either way.*

11. **Warn on reopened tasks with `todo_hours = 0`.** Rally does not restore To Do on reopen (no restore mechanism exists in its schema) and neither should we — but a reopened task at zero silently under-reports burndown, so surface it in the UI. *Confidence: medium-high that Rally does not restore; the warning is our own improvement.*

### Tier 3 — verify against a live tenant before building

These cannot be settled from public documentation. Each needs a trial/sandbox Rally subscription and a WSAPI probe.

12. **Can `Task.Iteration` be set to an iteration other than the parent story's?** `PUT` a divergent Iteration ref via WSAPI and see whether the server accepts, rejects, or silently overwrites. This is the single highest-value experiment — it decides item 8 outright.
13. **Does deleting the last incomplete task flip the parent to Completed?** Inferred from the set-based rule; never documented.
14. **Does re-parenting a task re-evaluate *both* the old and new story?** Same.
15. **Are the story task-hour totals recalculated synchronously on task save, or lagged?** Rally documents async lag for Portfolio Item percent-done but has no `Last Rollup Date` analogue for task totals.
16. **Does `TaskEstimateTotal` read as `0` or `null` for a story with no tasks?** Affects our null-handling and any `> 0` filters.
17. **Does a bare WSAPI `PUT {State: "Completed"}` zero `ToDo`, or is the zeroing only in the UI save path?** Decides whether item 9's zeroing belongs in the domain or the client.

---

## Source index

**Broadcom TechDocs (official product documentation)**

- [Task Fields](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/building-your-backlog/defining-tasks/task-fields.html) — the primary source for Q1
- [Defining Tasks](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/building-your-backlog/defining-tasks.html)
- [Task State Updates Parent Schedule State](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/building-your-backlog/defining-tasks/task-state-updates-parent-schedule-state.html) — the primary source for Q4
- [What is an Estimate?](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/building-your-backlog/sizing-and-estimates-overview/size-and-estimate-for-your-team/what-is-an-estimate.html)
- [User Story Fields](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/building-your-backlog/user-stories/user-story-fields.html) — read-only Task Rollup section
- [Portfolio Item Fields](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/managing-portfolio-items/portfolio-item-planning/creating-portfolio-items/portfolio-item-fields.html) — PercentDoneBy* definitions
- [Team Status Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/additional-tracking-pages/view-team-status-page.html) — the capacity-bar formula
- [Using the Iteration Progress Banner](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/iteration-status-page/using-the-iteration-progress-banner.html)
- [Iteration Status Page](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/iteration-status-page.html)
- [Story Burndown Chart](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reporting/rally-reports-and-charts/burndown-burnup-charts/story-burndown-chart.html)
- [Move an Unfinished User Story](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/managing-unfinished-work/move-an-unfinished-user-story.html)
- [Track and Report Billable Time](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reporting/track-and-report-billable-time.html)
- [Add Timesheet Entries](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reporting/track-and-report-billable-time/enter-your-time/add-timesheet-entries.html)
- [Parent-Child Relationships](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/building-your-backlog/identifying-dependencies/parent-child-relationships.html)
- [Rally Glossary](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reference/glossary.html)
- [Define Rally Artifact States](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/valueops-insights-saas/insights/administration/for-organizations-that-do-not-use-rally/define-rally-artifact-states.html)

**Broadcom Knowledge Base**

- [KB 57583 — Time Spent vs Actuals](https://knowledge.broadcom.com/external/article/57583) — the primary source for Q7
- [KB 254405 — Rally: how to deactivate the behavior of changing user story status based on task status](https://knowledge.broadcom.com/external/article/254405/rally-how-to-deactivate-the-behavior-of.html) — the Auto State Updates setting

**Broadcom Rally community**

- [Task estimation and To do efforts (MID=798035)](https://community.broadcom.com/viewthread?MID=798035)
- [Have you ever updated the state of a task… (MID=759409)](https://community.broadcom.com/viewthread?MID=759409) — Auto State Updates announcement, Accepted-story regression
- [Please clarify what fields affect the Burndown Chart (MID=753825)](https://community.broadcom.com/viewthread?MID=753825)
- [How can I report team and team member actual hours including estimate? (MID=759717)](https://community.broadcom.com/communities/community-home/digestviewer/viewthread?MID=759717) — Actuals is not derived
- [Rally Software - Task Actuals (MID=759303)](https://community.broadcom.com/viewthread?MID=759303)
- [How does "Time Spent" field on workitem - Task work?](https://community.broadcom.com/enterprisesoftware/communities/community-home/digestviewer/viewthread?GroupId=2437&MessageKey=a6336457-7abe-447f-b09d-fb8ebd94dc40&CommunityKey=f303f769-8d4c-44d9-924c-3845bba6444e) — Rally PM answer

**API schema / source evidence**

- [Rally Lookback API manual](https://rally1.rallydev.com/analytics/doc/) — "All numeric fields (PlanEstimate, TaskActualTotal, TaskEstimateTotal, etc.)"; "Iteration or Release on Tasks" listed as unavailable
- [`Task.java`, generated Rally WSAPI v1.37 domain](https://github.com/bprat/rally-service/blob/master/src/main/java/com/rallydev/webservice/v1_37/domain/Task.java) — `Estimate`/`ToDo`/`Actuals` as Double; `Iteration`/`Release`/`Project`/`WorkProduct` refs
- [`HierarchicalRequirement.java`, same](https://github.com/bprat/rally-service/blob/master/src/main/java/com/rallydev/webservice/v1_37/domain/HierarchicalRequirement.java) — `TaskEstimateTotal`/`TaskRemainingTotal`/`TaskActualTotal`/`TaskStatus`
- [`StoryDeepCopyApp.html`, RallyApps/app-catalog](https://github.com/RallyApps/app-catalog/blob/master/src/legacy/StoryDeepCopyApp.html) — task totals filtered out as read-only on write
- [RallyTechServices/rally-task-actual-rollup](https://github.com/RallyTechServices/rally-task-actual-rollup) — evidence Rally has no native task-hour roll-up above the story
- [Rally connector reference (Azuqua, third-party)](https://learn.azuqua.com/connector-reference/rally/) — weak/third-party; Task Iteration exposed as writable
