# Mini Rally — Full-Stack Gap Audit

**Date:** 2026-08-04
**Code under audit:** `QNSC-VN/rally` @ `main` = `0d5fbba5` (`chore(db): no demo fixtures in any deployed environment (#382)`)
**Docs under audit:** `QNSC-VN/product-docs` @ `main` = `98b7fc7`
**Method:** five independent parallel audits — scope/screens, data model, business flow, UI/UX, roles/permissions — each read-only, each required to cite a doc section and a `file:line` for every finding. Cross-audit convergence is tracked in §1 and used as the confidence signal.

**Total findings:** ~150 across five slices. Eight defects were found independently by two or more auditors; those are listed first and should be treated as the highest-confidence items in this document.

---

## 0. Document precedence used

This audit applied the following precedence. Auditors were instructed not to report a "code gap" when the code follows a newer doc layer than the one being cited.

**Authoritative for business behavior** (screens, status catalogs, lifecycle, cardinality, nav):

- `07_Test Business/BUSINESS_BASELINE.md`
- `04_Developement_tracking/RECONCILED_SOURCE_OF_TRUTH.md` — **newest dated line wins**; this file carries addenda that reverse earlier phase docs
- `07_Test Business/specs/*`, `07_Test Business/notes/E2E-*.md`
- `06_Dev testing align/*.md`

**Authoritative for roles/permissions:**

- `04_Developement_tracking/Phase 4/02_Roles_Permissions/SRS.md` (374 lines, three-role model, E/R/D/H matrix legend)

**Stale / superseded — do not audit business rules against these:**

| Doc | Why stale |
|---|---|
| `05_Architecture/DATABASE_SCHEMA.md`, `05_Architecture/DOMAIN_DESIGN.md`, `01_DB design/*` | Pre-pivot product: "story points only / no time tracking", no milestone tables, sprint enums `future/active/closed`, boards as core |
| `00_Documents/mini_rally_usecase_role_mapping.md` | Six-persona matrix. `Phase 4/02_Roles_Permissions/SRS.md` §1 explicitly retires PM/BA/Developer/Tester/Viewer persona roles |
| `Phase 1/04_Task_Management/SRS.md`, `Phase 1/05_Time_Tracking/SRS.md` | Demand `Estimate = To Do + Actual`; reversed 2026-07-28 (see §1.8) |
| `Phase 5/PHASE5_DEV_HANDOFF.md`, `Phase 5/PHASE5_TEST_SCENARIOS.md`, `Future_Backlog/02_Release_Planning.md` (Reports/Tracking clauses) | Forbid Reports + Release Tracking; authorized as Phase 6 on 2026-07-31 (see §1.9) |
| `00_Documents/mini_rally_erd.md` (defect fields), `Phase 1/08` six-role list, `Phase 1/08` team-per-project model | Superseded by the reconciled layer |

**Two reversals that will otherwise produce false findings:**

1. **Task hours.** `Estimate = To Do + Actual` is dead. `RECONCILED_SOURCE_OF_TRUTH.md:271,308` (eff. 2026-07-28) makes Estimate / To Do / Actual three independent fields: the first Estimate entry copies once into To Do; marking Completed zeroes To Do; reopening does not restore. The code implements this.
2. **Phase 6 scope.** `RECONCILED_SOURCE_OF_TRUTH.md:7` (2026-07-31) authorizes Reports and Release Tracking. Feature flags defaulting `true` for those two is correct. Portfolio > Release Planning and the Release Progress *column on the Releases list* remain correctly unbuilt.

---

## 0.5 Corrections register — read before acting on any finding below

A second research pass (five parallel agents, 2026-08-04, against Broadcom TechDocs / Broadcom KB / Rally WSAPI + SDK sources) checked the audit's findings against **real Rally behavior**. Full evidence with URLs is in `09_Gap_Audit/research/` — five files, one per topic. §11 summarises it.

That pass **inverted or reframed 14 findings**. The register below is authoritative where it disagrees with the body of this document. Each entry names the section it supersedes.

### 0.5.1 The `rally-*.png` screenshots are NOT real Rally — they are screenshots of our own clone

Established independently by two researchers before either was told. Evidence: a **TanStack Router/Query devtools badge** in every frame; the header "ACME Corp / NXP · All Teams" (our seed data); `rally-05-timeboxes.png` listing "E2E Iteration 1784030391954" (our Playwright fixtures); TanStack-table "Rows per page 25" footers with our own "Show Fields" button styling; zero-padded IDs (`US000008`, where Rally writes `US123`); raw `<input type="date">` widgets; and `IT-1…IT-5` iteration display keys, when Rally's `Iteration` object has no FormattedID at all.

**Consequence for §6 (UI/UX).** Every finding phrased as "diverges from `rally-NN.png`" was comparing the clone against itself. Those observations are still valid as *clone-internal consistency notes* — they carry **zero Rally authority**. Specifically demoted from "Rally parity gap" to "internal note": the Iteration Status column-order delta (§5.13, §6 table), the Audit Log Action column (§6.8), the Milestones ID column (§5.15), the work-item sidebar field order and the ··· more-actions control (§6.3, §6.8), the Projects-detail Teams/Members order (§6.8), and the Team Status "matches the screenshot" entry in §9.

**They are also a stale build.** Four claims derived from them were checked against `main@0d5fbba5` and are wrong for current code: they show a top-level `Releases` nav item and `Plan > Backlog|Timeboxes|Milestones` (actual: `app-shell.tsx:51-72`, Plan = Backlog + Timeboxes only, no top-level Releases); a separate sortable `Type` column on Backlog (actual: `pages/backlog/model/columns.ts` `ColumnKey` has no `type` member — folded into the ID cell); a Progress column on the Releases list (actual: `pages/releases/model/columns.ts:17-54` has no progress key); and a KPI strip absent from Timeboxes. Treat any future screenshot evidence as undated unless captured deliberately.

### 0.5.2 Findings that INVERT — the code is right and the doc/SRS is wrong

| Section | Original finding | Corrected verdict |
|---|---|---|
| **§1.6** | Iteration Status Board is a P0 scope violation; `RECONCILED_SOURCE_OF_TRUTH.md:67,100` says List-only | **Rally documents the toggle.** "You can view the page either as a list or a board"; "Select the toggle to switch between these two views"; "To update the state of a card, drag it into the appropriate column" — plus swimlanes and card age. The shipped board is Rally-faithful; the reconciled doc is wrong. The in-code comment calling it "the BA-spec toggle" is right about Rally, wrong about our doc. **But** our Team Board is mis-scoped — see §0.5.4. |
| **§1.8** | `Estimate = To Do + Actual` is an unclosed doc conflict | **Settled: the original BA rule is factually wrong.** Rally's Task Fields page marks `Time Spent` and `Rank` "A read-only numerical field" and does *not* so mark Estimate/To Do/Actuals — each begins with "**Enter**". Reinforced by "the task owner performs the initial estimate, and that value is automatically copied into the To Do field", which is incompatible with Estimate being derived. Strike the rule from the BA baseline as an error; rewrite DEV-013, DEV-015, DOC-002, E2E-005. |
| **§2.6** | Project Member can assign a Work Item to a Release — SRS forbids it | **Rally's Editor can.** SRS is wrong. The real control is Rally's Timebox Admin flag / *Restrict Timebox Management* workspace setting, not a `release:assign` permission code. |
| **§2.7** | No `team` scope exists — P1 gap | **Rally has no `Team` object and no team authorization scope.** Docs title the section "Set Up Your Projects (Teams)"; `POST /user/<OID>/teammemberships/add` takes **project** refs; "Team Member" is a checkbox beside the Permission field with presentational effects plus auto-promotion to Editor. **Do not build a team scope.** Closes BA decision #6. |
| **§2.8** | Project Admin cannot see non-administered projects — SRS says they should | **Rally explicitly denies this**: "you can only see project hierarchies that you have been given access". Clone matches; drop the finding. |
| **§3.2** (defect row) | Defect `severity` and `defect_state` nullable — P1 | **Only `Project` is required on a Rally Defect.** Nullable matches Rally. Remove from the gap list. |
| **§5.4** | Defect delete + bulk actions live where the SRS forbids | **Rally documents delete on the exact page and gesture we ship**: "Navigate to Quality > Defects… Click the Delete icon", at any lifecycle point, with a Recycle Bin. Reopen is allowed too. SRS forbids what Rally permits. The real defect is the opposite one: **bulk Copy is ours** — Rally's Copy is per-item only. |
| **§5.8** | Settings ▸ Integrations / SCM and the Connections tab have zero SRS basis | **The Connections tab is real Rally** — documented for user stories and defects, with PR name/link/timestamp, a count badge and a `Changesets` sub-tab. Reclassify from invention to parity; the *doc* is missing it, not the code. The Settings ▸ Integrations admin surface remains unsourced. |
| **§6.8** (Release project) | Release cannot be reassigned to another Project from detail | **Rally: `Project` "cannot be edited"** post-create. Our read-only `ProjectCell` is correct. Drop the finding. |
| **§7 #2 / §5.18** | Rank should use ▲▼ buttons per SRS §14/§37 | **Drag-and-drop is Rally's default** — "the default ranking method for workspaces… used throughout the Rally application". Confirmed independently for portfolio items (`DragAndDropRank`, base-94). No per-row arrows documented anywhere. **The SRS is the invention.** Keep the code; two real gaps remain — see §0.5.3. |

### 0.5.3 Findings that stand, with a sharper or larger fix than originally written

| Section | Refinement |
|---|---|
| **§1.1** (FKs / orphans) | **Confirmed as the highest-value fix, now with a documented target behavior.** Rally: "If you delete an iteration that stories and defects are scheduled in, **they will all be updated to unscheduled**." Same on release delete. Milestone delete "removes the association from each work item… The work item itself is not deleted." So: null the ids in the same transaction and add the FK with `ON DELETE SET NULL`. Corroborated by Broadcom KB 143097, which exists *because* a deleted timebox leaves no live reference — you must reconstruct the affected set from Lookback `_PreviousValues`. |
| **§1.1** (delete gates) | **We are wrong in the other direction too.** Rally has **no state gate** on timebox deletion — the only gate is permissions. Our `planning`-only iteration gate and `accepted`/capacity-plan release gate are inventions that block legitimate admin actions. |
| **§1.2** (dates) | **Confirmed required**: Release Fields annotates both Start Date and Release Date "**This field is required.\***"; Add an Iteration says "you must enter both start and end dates". Two caveats: the WSAPI object model is login-gated with no Wayback capture, so **no per-field nullability claim is sourceable** — UI-required is documented, schema-non-null is not; and `EndDate >= StartDate` enforcement has **no source at all**, so justify that CHECK as general correctness, not parity. The original rationale (NULLs poisoning the derived milestone window) partly dissolves, because the derived window itself should not exist — see §0.5.4. |
| **§4.2** (task roll-up) | **Confirmed a real bug, and the fix is architectural.** Rally states the rule as a pure function of the whole task set: "If all tasks become Defined… Defined. If all tasks become Completed… Completed. Otherwise… In Progress" — and explicitly "**Adding a task to a story in Completed will make the story In Progress**", which community evidence extends to Accepted stories. We implemented per-transition event handlers. Recasting as a set recompute fixes CREATE (documented verbatim), DELETE and RE-PARENT in one change and adds the **all-Defined → parent Defined** rule we never implemented. Rally also ships a project-level **Auto State Updates** toggle (KB 254405) to disable the whole propagation — on for Scrum, off for Kanban. We have no equivalent. |
| **§4.3** (iteration state) | **Resolves in an unexpected direction — remove restrictions AND the automatic path.** Rally's `State` is a plain editable enum with no documented state machine. Broadcom KB 233709 instructs users to move **Accepted backwards** to Planning or Committed as the standard remedy, which our one-way model makes impossible. No auto-accept exists; Broadcom staff describe iteration state as "more a visual indicator". *Trap:* Rally **does** auto-roll-up parent **user stories** to Accepted — that does not extend to iterations. **What we are missing is the one load-bearing rule:** "If the State is Accepted, no new work can be added to that release or iteration." Same rule documented for releases. |
| **§4.6** (Team Status %) | **Not two valid formulas picked inconsistently — the hours side is fabricated and semantically inverted.** Rally's per-member bar is a *capacity* indicator: "The percentage is calculated by dividing the task estimate total by the individual's cumulative capacity across all of their projects", green ≤100%, **red >100% = over-scheduled**. Ours answers "how much of the estimate is burned". `PercentDoneByTask…` does not exist; both `PercentDone*` fields are PortfolioItem fields keyed off **Accepted**. Correct fix needs a per-member capacity concept; absent that, drop the bar and show raw Estimate / To Do / Actuals columns as Rally does. The Iteration Status state-based counts are correct — keep them. |
| **§4.10** (Backlog scope) | **Settled in favour of `RECONCILED_SOURCE_OF_TRUTH.md:269`.** Three independent Rally statements, incl. "Once the item is scheduled into a release or iteration, **it is removed from the Backlog page**", plus a second exclusion: a parent story with children "cannot be scheduled and is not displayed in the Backlog page". Rally serves the "show scheduled too" need on a separate **Team Planning** page with Plan/Backlog panes and quick views — which we do not have. Closes BA decision #4. |
| **§5.5 / §5.6** (read-only artifact tabs) | **Confirmed P0; Rally is genuinely bidirectional.** The milestone detail page has its own Artifacts collection page — "Select Artifacts to open the Artifacts page. Select **Add New** from the toolbar" — plus a multi-select Remove action and six estimate roll-ups. The artifact side has the checkbox picker. Releases use a separate **Release Planning board**: "You can **drag a card into a column** to schedule it in a release." The BA mockup was right. |
| **§5.11** (Iterations columns) | **SRS vindicated.** `Project` and `Task Estimate` are both real, documented Iteration fields (`Project` — "cannot be edited"; the rollups "Plan Estimate, Task Estimate, Accepted, and To Do … rolled up from the estimates given for the associated scheduled items"). Add the columns and the DTO fields; do not delete the requirement. |
| **§5.18** (Type column) | **Rally encodes type in the ID prefix by design** — "you must configure each work item type with a unique prefix or tag to help you identify the type of work item at a glance" (`US1103`, `DE0415`) — and exposes Type as a **filter**, not a documented column. Defaults are "Rank, ID, and Name". So folding Type into the ID cell is Rally-shaped; the fix for "unsortable/unhideable" is to accept it and add a Work Item Type **filter**. No source found for a sortable Type column in any Rally grid. |
| **§5.18** (Quality pagination) | **Confirmed.** Rally paginates with a bottom page-size selector, default 25. Exact option values undocumented. Our Defects grid is the only one with a scaling failure mode. |
| **§5.18** (KPI strips) | **The SRS rule is Rally-consistent — keep it.** Rally documents a metrics banner on **Iteration Status only** (the Iteration Progress banner: Planned Velocity, Iteration End, Accepted, Defects, Tasks — our five tiles match near-verbatim) and uses in-grid `Group By` per-group aggregates elsewhere. Portfolio and Team Board strips are ours to retire or convert to columns. Caveat: absence on list pages is documented silence, not a positive statement. |
| **§3.2** (defect-only fields) | **Sharper than written.** A Rally User Story has **no Priority, no State, no Severity and no RootCause at all** — those fields should not exist on stories, rather than merely being CHECK-constrained. Also `Urgent` is ours: Rally's published set is Resolve Immediately / High Attention / Normal / Low. |

### 0.5.4 New divergences the audit missed entirely

| # | Finding |
|---|---|
| N-1 | **The derived Milestone window is a pure invention that inverts Rally's dataflow.** Rally's `Milestone` has one manual `TargetDate` — no window, never derived (SDK field list: `FormattedID, Name, TargetProject, TargetDate, TotalArtifactCount, Projects, Artifacts`). It links to **artifacts and many Projects**, *not* to Releases and not to Teams — there is no `Milestone.Releases` collection. Rally is explicit about why milestones exist: "Releases do not represent an actual release in the sense of a deployment or shipment. Use milestones to reflect these events." So `milestone_releases`, the `0097` MIN/MAX triggers, the read-only-while-linked rule, `milestone_teams`, and the Planned/At Risk status set all have no Rally analogue. Our milestone is architecturally a second Release. **Caveat:** one researcher reported Rally flags artifacts whose timebox ends after the milestone target date; the second could **not** corroborate it. Verify on a live tenant before building the inverted behavior. |
| N-2 | **Rally enforces (Name, TargetDate) uniqueness per workspace on milestones** — verbatim error in KB 10947. We have no equivalent. Milestone FormattedID prefix is `MI` (`MI444`), and Rally does surface it. |
| N-3 | **`iteration_key` / `release_key` have no Rally counterpart.** `FormattedID` is an inherited *Artifact* attribute; timeboxes are not Artifacts. Neither Iteration Fields nor Release Fields lists an ID field. Milestone is the exception. Rally identifies timeboxes by Name + dates + Project, and cross-project cascade/rollup depends on **exact** Name/Start/End matching — a mismatch silently creates separate timeboxes (KB 233709). Keeping our keys is a defensible UX improvement; do not record it as parity, and note we would need the matching logic anyway if we ever add cascade. |
| N-4 | **`POST /iterations/:id/rollover` has no Rally analogue.** Rally offers per-story **Move** (a plain field edit) and **Split** (the real feature: historical placeholder left in the old iteration with Schedule State Complete, continued story in the next, discussions/attachments copied forward, completed children stay behind, "if a future iteration does not exist, it stays in the current iteration"). Rally frames the choice as a team convention with documented trade-offs — Move "may negatively affect historical iteration charts". Our one-click bulk move silently commits every story to the chart-damaging option and skips the task Estimate/To-Do zeroing Rally tells users to do by hand. Neither Move nor Split changes iteration state. |
| N-5 | **Our Team Board is mis-scoped.** Rally's Team Board is *flow-based*: columns map to team-defined flow states, with WIP limits, exit agreements, and a Charts secondary view (Cycle Time, Cumulative Flow, Flow Metrics, Scatterplot, Aging). Ours is iteration-scoped with a Sprint picker — precisely what Rally's is not. Combined with §0.5.2's board finding, we have the two surfaces inverted. Minor: our terminal board column reads `Release`; Rally's is `Released`. |
| N-6 | **Story task-hour totals are persisted in Rally, not computed.** `TaskEstimateTotal` / `TaskRemainingTotal` / `TaskActualTotal` appear as Lookback *snapshot* fields, and a snapshot store can only carry stored values. That is what makes Rally story grids sortable and filterable by task hours (`TaskRemainingTotal > 0`) and chartable historically. We compute ours, so we can do none of the three. We are also missing `TaskStatus`, Rally's rolled-up task-progress string. |
| N-7 | **Rally has two unconnected "time spent" fields, and we implement only one.** `Actuals` is manual and "**not related to timesheets**" (KB 57583), hidden by default; `Time Spent` is **read-only** and fed by Rally Time Tracker (`TimeEntryItem`/`TimeEntryValue`), with a "Sum of Time Spent" roll-up to the parent. So severing `TimeLog` from `actual_hours` (§3.6) was **correct**, not a bug — the gap is that we have nowhere for the TimeLog sum to surface. Add a derived read-only `time_spent`. Rally's own direction is to retire `Actuals` in favour of Time Tracker and to hide it when adopting Time Tracker. |
| N-8 | **Our task-Iteration DB trigger is stricter than anything Rally documents.** `Task` has real settable `Iteration`, `Release` and `Project` object references (WSAPI getters *and* setters), independently confirmed by the Lookback manual listing "Iteration or Release on Tasks" under *Unavailable Fields* — you can only exclude a field that exists. Whether Rally permits divergence from the parent is **unsourced**. Keep the derived default but demote the trigger to a service-layer default: a schema refusal is an unjustified bet that will also reject faithful Rally imports. |
| N-9 | **Our production authz model is strictly more permissive than Rally's, not merely "unscoped".** Rally's implication runs **bottom-up**: "Adding a user to a project automatically provides user access to the workspace." A workspace-level `User` role explicitly does *not* confer project access — "Set additional permissions for each project in the workspace" — and the project default is **No Access**. `ProjectPermission` is unique per (User, Project, Workspace) with Role ∈ Viewer/Editor/Admin. We implemented exactly the downward implication Rally documents as not existing. Fixing §2.1/§2.2 therefore needs a **data migration** for existing workspace-scoped rows, not just the two provisioning call sites. |
| N-10 | **Missing roles: `Viewer`, and an explicit `no_access` state** (Rally's *default*). Also no subscription tier as stored data — `User.SubscriptionAdmin` is the Rally precedent, and our `PLATFORM_ADMIN_EMAILS` env (§2.11 I-1) makes the top privilege unauditable. And **project delete should not exist**: "You cannot delete workspaces or projects." |
| N-11 | **Rally grids pin `Rank, ID, Name` as defaults and make them non-reorderable**, everything else opt-in via Show Fields, with a documented >25-columns → ≤50-rows interaction. Our grids do not pin them consistently. |
| N-12 | **Rally has a real filter builder we do not have:** "Add or Remove Filters" → "Manage Filters", any eligible field annotated by applicable work-item type, multi-value, chosen fields rendered below the toolbar, `Clear Filters`, and quick-vs-advanced tiers that cannot be combined. Filters persist inside **saved views** ("filters, grouping, displayed fields or columns, page count, and scoping"). With fixed dropdowns, saved views can never exist — there is nothing variable to save. |
| N-13 | **Rally's detail editor is both panel and page, from one control:** click the ID → anchored view "slides out from the right side of your window", drag-resizable to a documented **800px** maximum, with a header toggle to full view (`Name` is full-view-only) and right-click on the ID for the same actions. Our mockup's peek panel (§6.3) was Rally-faithful. Our inline-edit half is already correct. |
| N-14 | **Rally's rank has two gaps beyond drag:** the three toolbar actions **Rank Highest / Rank Lowest / Move to Position**, and a hard precondition — "Rank must be included in the view and the page must be sorted by rank ascending in order to use this feature." Without that guard, dragging under a Name sort writes nonsense ranks. Semantics to get right: the item moves to the end of *the list*, not *the page*. |
| N-15 | **Rally's portfolio hierarchy is three default levels** (Theme > Initiative > Feature), extensible to five and renameable — and **there is no hierarchy-tree portfolio page**; Portfolio Items is a flat single-type list. Our tree is an invention. |
| N-16 | **Rally's bulk edit is one generic dialog**, ≤500 items and ≤4 fields, and **Copy is per-item only**. So the §6.8 "4 of 5 bulk actions absent" framing is wrong on both sides: the specific verbs are not Rally's model, and our bulk Copy is the invention. |
| N-17 | **Rally implements Timeboxes as ONE page** with a Type dropdown covering Iterations, Releases and Milestones. We have three addressable routes (`/timeboxes`, `/releases`, `/milestones`, verified in `app/router/router.tsx:148-189`) joined by `timebox-type-switcher.tsx`. Behaviourally equivalent from the user's side, but it triples the list/filter/column plumbing Rally implements once. Our nav *is* correct (`app-shell.tsx:51-72` — Plan = Backlog + Timeboxes, no top-level Releases). |
| N-18 | **Rally's chrome is a pinnable sidebar with per-user hide/reorder and a settable start page**, not a fixed top bar. Documented, but a large rewrite; low priority. |

### 0.5.5 Six BA decisions from §7 are now settled by evidence

| §7 item | Resolution |
|---|---|
| #1 Iteration Status board toggle | **Rally has it.** Amend `RECONCILED_SOURCE_OF_TRUTH.md:67,100`; keep the feature. Add a flag anyway so it *can* be withdrawn. Re-found Team Board on flow (N-5). |
| #2 Rank drag vs ▲▼ | **Rally uses drag.** Amend SRS §14/§37; keep the code; add the toolbar actions and the sort guard (N-14). |
| #4 Backlog scope | **Unscheduled-only.** `RECONCILED_SOURCE_OF_TRUTH.md:269` wins; fix the code; consider a Team Planning page for the other use case. |
| #6 `team` scope | **Do not build it.** Rally has no team authorization dimension. Rewrite the four dependent §3.2 rules. |
| #7 E/R/D/H matrix | **Rally has no per-action matrix at all** — roles are fixed built-ins; the whole configurable surface is six named delegation toggles. Our 3-state matrix already exceeds Rally. Reject the E/R/D/H grid. |
| #9 Settings ▸ Integrations / SCM | **Split.** The work-item **Connections tab is real Rally** (parity — document it). The Settings ▸ Integrations admin surface is still unsourced; ratify or remove separately. |

Still open and genuinely needing a BA call: §7 #3 (Backlog column order — no target exists), #5 (is the role scope dimension real, now reframed by N-9), #8 (permission granularity), #10–#13.

### 0.5.6 Verify on a live Rally tenant — public docs cannot settle these

Each is one WSAPI probe against a trial subscription. Listed because building on the wrong answer is expensive.

1. Can `Task.Iteration` be set to an iteration other than the parent story's? Decides N-8 outright.
2. Does deleting the last incomplete task flip the parent to Completed? (Inferred from the set-based rule, never documented.)
3. Does re-parenting a task re-evaluate *both* the old and new story?
4. Are story task-hour totals recalculated synchronously on task save, or lagged? (No `Last Rollup Date` analogue exists for them.)
5. Does `TaskEstimateTotal` read `0` or `null` for a story with no tasks?
6. Does a bare WSAPI `PUT {State: "Completed"}` zero `ToDo`, or is the zeroing only in the UI save path? Decides whether that belongs in the domain or the client.
7. Does Rally actually flag artifacts whose timebox ends after a milestone's target date? (One researcher reported it; the other could not corroborate.)
8. Rally's timing for permission changes — immediate, next request, or next login? (Unsourced; our next-request model is inference, not parity.)
9. Whether Rally forbids overlapping iterations in one project, and whether same-project (Name, Start, End) uniqueness is enforced.
10. Whether `EndDate >= StartDate` is server-enforced, and with what error string.

**Search hazard for anyone re-running this research:** `help.rallyuxr.com` ("Rally UXR") is an unrelated product that ranks highly on Rally permission queries and *does* advertise custom roles with granular permissions. It poisoned three searches and would mislead a reader into thinking Rally has a configurable permission matrix.

---

## 1. Cross-audit convergences — highest confidence

Eight defects were found independently by two or more of the five auditors working from different sources. These are ranked first.

### 1.1 Missing foreign keys → silent orphans on delete
*Found by: data model, business flow*

`work.work_items` declares **2 FKs across 13 reference columns** (`rally/db/schema/work.ts:113-142`). A whole-repo grep for `REFERENCES|FOREIGN KEY` on that table returns only `dev_owner_id` and `found_in_release_id` (`db/migrations/0034_ready_state_dev_owner_p3_fixes.sql:7,13`). Missing on: `workspace_id`, `project_id`, `team_id`, `status_id`, `assignee_id`, `reporter_id`, `parent_id`, `iteration_id`, `release_id`, `feature_id`, `created_by`.

Concrete consequences traced end-to-end:

- **Delete an Iteration** → `libs/modules/iterations/src/application/iterations.service.ts:259-269` → `iteration.drizzle-repository.ts:123-125` issues a hard `DELETE`. There is no pre-check for assigned items and no unassign step. Only `planning` iterations are deletable, but a `planning` iteration legitimately holds scope (`BUSINESS_BASELINE.md:10` — "assignment does not auto-commit"). Items retain a dangling `iteration_id`: invisible in Iteration Status, not returned to Backlog, still counted by `autoAcceptIterationIfComplete` and by reporting joins.
- **Delete a Release** → `libs/modules/releases/src/application/releases.service.ts:363-400` guards only `accepted` status and attached capacity plans, then `release.drizzle-repository.ts:95-97` issues a bare `DELETE`. Artifacts keep a dead `release_id`. `work.milestone_releases` (`0030_milestones_p33.sql:31-36`) has no FK on either column and no cleanup in the delete path, so orphan link rows survive; `recalcTargetDates` (`libs/modules/milestones/src/application/milestones.service.ts:207-221`) INNER JOINs `releases`, so the derived Milestone window silently narrows — and if the *last* linked Release is deleted, `linked=0` returns early and the milestone keeps a **stale derived** window that the UI still presents as read-only.
- **Polymorphic refactors dropped real FKs.** `0082_comments_polymorphic.sql`, `0083_attachments_polymorphic.sql`, `0084_milestone_artifacts_polymorphic.sql:26-44` each replaced a `work_item_id … REFERENCES work.work_items(id) ON DELETE CASCADE` (originally `0035:99`) with an unconstrained `entity_id`. Four tables — `comments`, `attachments`, `milestone_artifacts`, `activity_logs` — now reference nothing. Acknowledged in a comment at `work.ts:1224-1225`.
- **`work_item_relations`** has no FK on `source_item_id`/`target_item_id` (`work.ts:1006-1007`); deleting either end leaves a relation pointing at nothing, and the Linked Items block renders the dangling row.
- **`milestone_projects` / `milestone_teams`** likewise unconstrained on both sides.

This is an omission rather than a design stance: the same repo does it correctly for `found_in_release_id` with `ON DELETE SET NULL`.

**Severity: P0.** No test covers iteration-delete or release-delete orphan behaviour; `iterations.service.spec.ts:310` only covers the `ITERATION_NOT_PLANNING` refusal.

### 1.2 Release / Milestone dates: nullable in DB, optional in DTO, ungated in UI
*Found by: data model, business flow, UI/UX — three independent slices of one defect*

The SRS marks these Required with an ordering constraint: `Phase 2/02_Iterations/SRS.md:176-177,404` (iteration Start/End, `End >= Start`), `Phase 3/02_Release_Management/SRS.md:139-140,236` (Start/Release Date, `Release Date >= Start Date`).

Implementation, all three layers permissive:

| Layer | Iteration | Release | Milestone |
|---|---|---|---|
| Column | nullable `work.ts:289-290` | nullable `work.ts:461-462` | manual, nullable |
| DTO | `.optional()` `iteration-request.dto.ts:38-39` | `.optional()` `release-request.dto.ts:17-18` | optional |
| CHECK constraint | none (no `End >= Start` anywhere) | none | none |
| Create modal | — | Name-only `create-release-modal.tsx:39-48,98-119` | Name-only `milestones-page.tsx:155-194,242-264` |

The mockup gates Create on non-empty dates in both cases (`03_Mockup Design/src/app/pages/IterationsPage.tsx:522-523,566` and `:663-664`).

This is not a cosmetic validation gap. A dateless Release is linkable to a Milestone whose Target window is defined as `MIN(release.start_date) / MAX(release.release_date)` (`BUSINESS_BASELINE.md` §2 rule 2, enforced by triggers in `0097_milestone_derived_dates.sql:60,88,115`). A NULL poisons the derived window, and per §1.1 the milestone then presents a wrong window as read-only. It also means no burnup Ideal baseline can be captured.

**Severity: P0.** Cheapest correct fix is the modal gate plus a `NOT NULL` migration plus the two CHECK constraints — all three, because each layer is independently reachable (seeds and raw SQL bypass the modal and the DTO).

### 1.3 Navigation gates use the wrong permission codes
*Found by: scope/screens, roles/permissions*

`RECONCILED_SOURCE_OF_TRUTH.md:93` and `Phase 4/02_Roles_Permissions/SRS.md` §4 say Project Member must not reach Timeboxes, Team Status or Quality.

`apps/web/src/widgets/app-shell/app-shell.tsx` gates:

| Nav item | Line | Gate used | API actually enforces |
|---|---|---|---|
| Plan ▸ Timeboxes | `:71-72` | `iteration:view` | `iterations.controller.ts:105` `iteration:view` (also PM-held) |
| Track ▸ Team Status | `:99-100` | `work_item:view` | `team-status.controller.ts:36` `team_status:view` |
| Quality | `:105-106` | `work_item:view` | `quality.controller.ts:18` `quality:view` |

`project_member` holds `work_item:view` and `iteration:view` (`db/permissions.catalog.ts:389-403`) but not `quality:view` or `team_status:view`. The correct codes already exist at `permissions.catalog.ts:86,93`. A Project Member therefore sees three menu entries that are guaranteed to 403 on click. The API side is correct; only the nav is wrong.

Related: `All Teams` in the context switcher (`app-shell.tsx:218-232`) renders unconditionally for every role, though `Phase 4/02:167,203` (P4-RBAC-006) hides it from Project Member. `Manage Projects` (`app-shell.tsx:558-565`) has no `permission` prop at all.

**Severity: P1.** Pure front-end fix; no API change needed.

### 1.4 Portfolio list gated on an admin-reserved tier
*Found by: scope/screens, roles/permissions*

`Phase 5/01_Portfolio_Items/SRS.md` P5-PI-FR-017 gives Project Member read access to Portfolio. `libs/modules/portfolio/src/interface/http/portfolio-items.controller.ts:144-156` gates `GET /v1/portfolio-items` on `workspace:view`, which is admin-reserved. Every other portfolio route correctly uses `portfolio:*`.

Consequence: a correctly project-scoped Project Admin or Project Member 403s on the Portfolio list, and the service's own `listReadableProjectIds` narrowing (`portfolio-items.service.ts:183`) never executes. This is the "gate chosen for where the id lives, not what the action is" anti-pattern already documented in `rally/CLAUDE.md`, and the same class as the previously-fixed `report:view` and `by-key` 403 defects.

Currently masked in production by §2.1 (workspace-scoped grants make `workspace:view` widely held) — fixing §2.1 first will surface this as a hard 403 for real users.

**Severity: P1.**

### 1.5 Permission matrix is three-state where the SRS specifies four
*Found by: scope/screens, roles/permissions*

`Phase 4/02_Roles_Permissions/SRS.md` §2 legend, §3.3, §3.8 (P4-RBAC-002, P4-RBAC-010) specify per-cell `E` / `R` / `D` / `H` values, rows grouped by Phase 0–4 screen × CRUD action, opening read-only with an explicit Edit unlock. Tracker item `GAP-P1-USER-004` is logged P0.

`apps/web/src/pages/settings/model/role-capabilities.ts:14` is three-state (`full | view | none`). `:30-61` is ~19 rows, each collapsing Create/Edit/Delete/Archive/Restore into one "manage" cell — exactly the code-sharing §2 forbids — and omits every Auth, App Shell, Home, Work Item Detail, Task, Iteration Status and Notifications row. `ui/roles-tab.tsx:220-234` has no read-only default and no Edit button.

Note this is *partly* a declared engineering decision: `rally/docs/superpowers/specs/2026-07-26-rbac-permission-catalog.md` §7 declares E/R/D/H out of scope, and `2026-07-26-rbac-pbac-architecture.md` §6 Decision 1 recommends pushing back on it. The decision was never taken to the BA.

**Severity: P1, pending BA decision.**

### 1.6 Iteration Status Board ships with drag and no flag to withdraw it
*Found by: scope/screens, UI/UX*

`RECONCILED_SOURCE_OF_TRUTH.md:67` says Iteration Status is List-only; `:100` puts "Team Board, Iteration Board, drag/drop, WIP limit" in Future Backlog. `Future_Backlog/03_Iteration_Status_Board.md:14` and tracker `GAP-P2-IS-005` agree. The mockup renders "List" as a **static span, not a toggle** (`IterationStatusPage.tsx:427`), and `rally-12-iteration-status.png` has no toggle.

Implementation ships a full List/Board Kanban toggle: `pages/iteration-status/iteration-status-page.tsx:83-92,475-499`, `ui/iteration-chrome.tsx:215-256`, `widgets/iteration-board/iteration-board.tsx` — where `onDragEnd` at `:112-140` writes `scheduleState`. There is **no feature flag**, so the surface cannot be withdrawn without a code change. The in-code comment at `iteration-status-page.tsx:83-85` calls it "the BA-spec toggle", which contradicts every doc source above.

Additionally the Board carries the wrong metric strip: `ui/iteration-chrome.tsx:263-329` shows Iteration-Status KPIs (Planned Velocity / Iteration End / Accepted / Defects / Tasks) where the mockup `TeamBoardPage.tsx:308-324` and `rally-06-team-board.png` specify Cards / Active / Plan Est / Accepted / To Do / **Blocked**. `iteration-board.tsx:5-9`'s claim that the card layout "can never drift" does not extend to the surrounding chrome. The Board's Type filter (All/Story/Defect/Feature/Task, mockup `:222-223,345-349`) was also dropped in the consolidation.

**Severity: P0.** Either the reconciled doc or the feature is wrong. Neither should be treated as correct until the BA rules. Minimum immediate action: add a feature flag so the surface *can* be withdrawn.

### 1.7 Schedule ⇄ Flow State mirror is the one invariant left out of the trigger layer
*Found by: data model, business flow*

Rule: `BUSINESS_BASELINE.md:29`, `RECONCILED_SOURCE_OF_TRUTH.md:283-284`, `DEV_FIX_HANDOFF.md:24-27` (DEV-020) — the two fields mirror in both directions.

Enforced at `db/…/work-item.drizzle-repository.ts:928-931` (both columns always written) plus a conflict refusal at `libs/modules/work-items/src/application/work-items.service.ts:782-796`. `db/schema/work.ts:126-127` carries only `.default('defined')` — no CHECK, no trigger (`grep 'CREATE TRIGGER' db/migrations` returns 8 triggers, none on `flow_state`).

Why this matters here specifically: three sibling invariants were **deliberately moved into triggers** for exactly this reason — `trg_sync_accepted_date` (`0087`), `trg_task_iteration_from_parent` (`0095`), `trg_milestone_force_derived_dates` (`0097`), and `0093` for `timebox_group_id` — each with a stated rationale that `db/seeds/**` writes rows without going through the service layer. The mirror is the one left behind. Today's seeds happen to set both columns (`db/seeds/demo.ts:420-421,444-445,636-637,667-668`, `reference-extras.ts:165-166`, `second-project.ts:244-245`) — a coincidence, not an invariant.

Compounding: the **DB default is `'defined'`** while the SRS says a new US/DE defaults to `Idea` (`RECONCILED_SOURCE_OF_TRUTH.md:36`, `Phase 1/02_Work_Item_Create/SRS.md:80-81`) and the service passes `'idea'` (`work-items.service.ts:371`). Any insert that omits the columns lands on `Defined` and skips the state the Backlog is defined by.

**Severity: P1.** Also: the `WORK_ITEM_STATE_MIRROR_CONFLICT` refusal branch (`work-items.service.ts:787`) has no test anywhere.

### 1.8 `Estimate = To Do + Actual` — unclosed doc conflict
*Found by: data model, scope/screens, business flow*

Docs demanding the derived rule, all still open:

- `07_Test Business/DEV_FIX_HANDOFF.md:48-51` — DEV-013, **P0**
- `07_Test Business/DEV_FIX_HANDOFF.md:143-144` — DOC-002, **P0**
- `07_Test Business/DEV_FIX_HANDOFF.md:53-56` — DEV-015 ("completing a Task must **not** auto-zero To Do")
- `07_Test Business/specs/E2E_BUSINESS_FLOW_COVERAGE.md:129` — E2E-005 expected result
- `07_Test Business/notes/E2E-08-10-TASK-PROPAGATION.md` §E2E-08
- `06_Dev testing align/DEVINT_PHASE_0_4_DEV_HANDOFF.md:59-60`
- `Phase 1/04_Task_Management/SRS.md` TASK-FR-006/011/013; `Phase 1/05_Time_Tracking/SRS.md` TIME-FR-002/003 §6

Doc reversing it: `RECONCILED_SOURCE_OF_TRUTH.md:271` (eff. 2026-07-28) — three independent fields, first Estimate copies once to To Do — and `:308` "Task Estimate is the explicit Task Estimate field, **not** `To Do + Actual`". Confirmed again at `Phase 5/01_Portfolio_Items/SRS.md:149`: "This replaces the older task rule that displayed `Estimate = To Do + Actual`".

Code implements the reversal: three independent columns (`work.ts:1117-1119`), first-Estimate-copies-once gated on `item.todoHours === null` and Completed-zeroes-To-Do at `work-items.service.ts:808-836`. `test/e2e/story-task-hours.e2e.spec.ts` deliberately asserts the *new* contract, i.e. the opposite of E2E-005 as written.

Residue to clean: `db/migrations/0052_task_actual_hours_manual.sql:5` still describes the old rule in its comment; `trg_sync_actual_hours` (`0012:98`) still exists, neutralised by `0052`; `work.time_logs` (`work.ts:971-992`) is retained with a live `hours > 0 AND <= 24` CHECK but is severed from `actual_hours` and from every current BA requirement.

**Severity: P1 — documentation defect, not a code defect.** Four doc items and one E2E scenario will fail retest as written. Either rewrite them or revert the code; do not leave both.

### 1.9 Phase 6 authorization vs Phase 5 prohibitions
*Found by: scope/screens (with business flow corroborating the reverse-drift pattern)*

`RECONCILED_SOURCE_OF_TRUTH.md:7` (Phase 6 addendum, 2026-07-31) authorizes Reports and Release Tracking. `Phase 5/PHASE5_DEV_HANDOFF.md` §2.2/§13/§460, `PHASE5_TEST_SCENARIOS.md:3` and `Future_Backlog/02_Release_Planning.md` still assert both must not be built.

Current flag state — `apps/web/src/shared/config/feature-flags.ts`, **every flag defaults `true`**:

| Flag | Line | Verdict |
|---|---|---|
| `feature.reports` | `:19` | Correct under the Phase 6 addendum. Content matches the three-type contract exactly. |
| `feature.release-tracking` | `:22` | Correct under the Phase 6 addendum + `Phase 6/01_Release_Tracking/SRS.md`. |
| `feature.releases` | `:17` | **Dead flag** — declared, read by nothing. |
| `feature.milestones` | `:18` | **Dead flag** — declared, read by nothing. |
| Portfolio > Release Planning | no flag/route/nav | Correct — still Future Backlog. Only a historical comment at `app-shell.tsx:115-124`. |
| Release Progress column on Releases **list** | absent (`releases/model/columns.ts:4-14`) | Correct. |
| Release Progress percent/widget on Release **detail** | **present, ungated** | **Violation** — see §5.4. |
| Iteration Status Board | **no flag exists** | **Violation** — see §1.6. |

**Severity: P1 — documentation defect.** A reviewer applying the Phase 5 checklist today will flag four correct surfaces as violations.

---

## 2. Roles and permissions

Authoritative doc: `Phase 4/02_Roles_Permissions/SRS.md`. Role inventory itself is correct: `workspace_admin`, `project_admin`, `project_member` (`db/permissions.catalog.ts:17-22`); removed roles absent; `PRESET_WORKSPACE_ROLES = []` (`:450`).

### 2.1 P0 — Every SSO-provisioned user is granted `project_member` at *workspace* scope

`db/seeds/bootstrap.ts:207,219` sets `defaultRoleSlug: 'project_member'`. `libs/modules/access/src/application/access.service.ts:556-565` writes that assignment with `scopeType: 'workspace'` (called from `node_modules/@qnsc-vn/identity/dist/auth.service.js:573`). `getProjectPermissions` (`access.service.ts:679-687`) unions **all** workspace-scoped assignments for **any** `projectId`.

Net effect: every authenticated SSO user holds `work_item:create`, `work_item:edit`, `work_item:delete`, `project:view`, `iteration:view`, `portfolio:view`, `capacity:view`, `report:view` on **every project in the workspace**. SSO is the only login path on develop and production.

This is precisely the hole `docs/superpowers/specs/2026-07-26-rbac-pbac-architecture.md` §3.3 was written to close. It is unfixed.

### 2.2 P0 — No reachable code path produces a project-scoped assignment

- Invitation accept: `libs/modules/workspace/src/infrastructure/persistence/workspace-member.drizzle-repository.ts:192-207` hard-codes `scopeType:'workspace', scopeId:null`.
- User Management UI: `apps/web/src/pages/settings/ui/members-tab.tsx:348-350` passes the literal `scopeType:'workspace'`.
- `POST /projects/:pid/role-assignments` exists (`access.controller.ts:205`) but nothing in the SPA calls it.
- `AccessService.assignRole` (`access.service.ts:346-398`) does not reject a project-tier role at workspace scope.

Consequence: the scoped three-role model is **degenerate in production**. A "Project Admin" is a workspace-wide delivery admin. `Phase 4/02` §3.1 ("`project_admin` mutation permissions are effective only in projects assigned for administration") and §3.2 ("`project_member` can only access the assigned project") are both unimplementable as deployed.

### 2.3 P0 — Front-end-only gating: privilege escalation by direct API call

`Phase 4/02` §2 requires that direct URL/API access stay guarded even when the UI state is `H` (hidden).

| Surface | UI gate | Route | Route's actual guard |
|---|---|---|---|
| Settings ▸ Integrations | `settings-page.tsx:83` `SCM_MANAGE` | `scm.controller.ts:126` `GET /v1/scm/installations` | `workspace:view` |
| Settings ▸ Integrations | same | `scm.controller.ts:179` `GET /v1/scm/repositories` | `workspace:view` |
| Settings ▸ Roles | `settings-page.tsx:77` `roles:view` | `access.controller.ts:66` `GET /roles` | **none** — returns every role *with its permission array* |
| Settings ▸ Users | `settings-page.tsx:65` `users:assign_role` | `workspace.controller.ts:250` `GET /workspaces/:id/members-with-profile` | **none** — returns roster incl. `phone`, `lastLoginAt`, role ids |
| Settings ▸ Teams | `settings-page.tsx:71` `teams:create` | `team.controller.ts:95,144,170` | **none** — team list, detail, member rosters |

The SCM leak exposes installation ids, GitHub org login and account type, plus the full repository inventory with sync status. Note `GET /permissions` immediately adjacent to the leaking `GET /roles` *is* correctly gated (`access.controller.ts:75`).

### 2.4 P0 — `workspace:view` synthesised for principals with no assignments

`access.service.ts:646-655` returns `[PERMISSION.WORKSPACE_VIEW, PERMISSION.PROJECT_VIEW]` for any principal holding no global or workspace assignment. The comment calls this a "minimal authenticated baseline", but `workspace:view` is an admin-tier code: it is the gate on `GET /workspaces/:id/settings` (`workspace.controller.ts:408`), `GET /portfolio-items` (`portfolio-items.controller.ts:144`) and both SCM lists above. This creates an unnamed fourth effective role the SRS never defines, and directly amplifies §2.3.

### 2.5 P0 — Seven unguarded cross-scope reads

`Phase 4/02` §3.4 requires list/search/dropdown data to return only records the user can access; §3.2 requires access-denied on direct URL to an inaccessible project.

- `GET /projects/health` — `projects.controller.ts:143` (**no decorator**) → `projects.service.ts:129-131` → `project.drizzle-repository.ts:174-193`: returns **every** active project with key, name, lead and work-item/blocked/defect rollups, filtered on `workspace_id` only. The sibling `GET /projects` was fixed with `listReadableProjectIds`; this route was missed.
- `projects.controller.ts:180, 193, 280, 295, 309, 372` — all no decorator, only a tenant match in `projects.service.ts:265-271`: `GET /projects/:id`, `/:id/activity` (full revision history), `/:id/statuses`, `/:id/transitions`, `/:id/labels`, `/:id/teams` readable for any project id by any authenticated caller.
- `GET /work-items/summary` — `work-items.controller.ts:258` no decorator → `work-item.drizzle-repository.ts:705-738` filters `workspaceId` only: workspace-wide open/blocked/defect/sprint/project counts across all projects.
- `GET /workspaces`, `/workspaces/:id`, `/:id/members` — `workspace.controller.ts:141,179,232`, only `assertActive` tenant match.

**Unguarded mutations: none** beyond a legitimately self-scoped set. The write path is sound by construction.

### 2.6 P1 — Project Member can assign a Work Item to a Release

`Phase 4/02` §3.1 states Project Member "**cannot** assign a Work Item to a Release". `work-items.controller.ts:359-360` gates on `work_item:edit` (held by `project_member`, `permissions.catalog.ts:389-401`); `work-items.service.ts:1390-1411` validates only that the release shares the project (`assertReleaseAssignable:1581-1596`). Both `PATCH /work-items/bulk-release` and `PATCH /work-items/:id {releaseId}` therefore permit it. No `release:assign` code exists, though `2026-07-26-rbac-permission-catalog.md` §3 prescribes one.

### 2.7 P1 — No `team` scope exists

`db/schema/enums.ts:52` — `scope_type = ['global','workspace','project']`. `2026-07-26-rbac-permission-catalog.md` §2 lists `team` as a scope dimension; it is unimplemented in the schema, the catalog and `PolicyGuard`. Four `Phase 4/02` §3.2 rules depend on it, including "Project Member sees and mutates Backlog/Iteration Status only for Teams assigned by Workspace Admin" and "All Teams … hidden from Project Member". Team-level authorization is entirely absent.

### 2.8 P1 — Project Admin cross-project read-only mode missing

`Phase 4/02` §3.2 ("Project Admin can see all projects") and §3.1 ("may open every other project in read-only mode"). `permissions.catalog.ts:352-356` gives PA a project-tier `project:view` only; no workspace-tier read grant exists. `2026-07-26-rbac-permission-catalog.md` §2 prescribed `W✓ projects:view` for PA. Currently masked by §2.2.

### 2.9 P1 — Project Admin can edit deferred surfaces

`Phase 4/02` §3.1 defers configurable Workflow Status and Labels for Project Admin; `2026-07-26-rbac-permission-catalog.md` §4 marks `workflow:edit`/`labels:edit` PA-*(deferred)*. `workflow.controller.ts:61,82,97,115,134` and `projects.controller.ts:322,337,354` all gate on `project:edit`, held by PA (`permissions.catalog.ts:353`). PA can create/reorder/delete workflow statuses and transitions and CRUD labels.

### 2.10 P1 — Permission granularity rule violated

`Phase 4/02` §2: "Every Screen + Action row has one independent permission code… must not share a generic `*:manage`."

- `project:edit` covers project settings (`projects.controller.ts:213`), labels (`:322,337,354`), workflow statuses/transitions (`workflow.controller.ts:61-134`) and project↔team links (`:380,393`) — four-plus SRS matrix rows on one code, so a Workspace Admin cannot change one without the others.
- `work_item:edit` covers fields, relations, labels, watchers, milestones, time logs, attachments, rank, move **and release assignment** — which is the direct cause of §2.6.
- 12+ intended codes from `2026-07-26-rbac-permission-catalog.md` §3 are absent: `iterations:assign`, `iteration_status:view/edit`, `tasks:*`, `comments:*`, `attachments:*`, `releases:assign`, `milestones:link`.

### 2.11 Out-of-band and undeclared authorization behavior (BA ruling needed)

| # | Item | Evidence |
|---|---|---|
| I-1 | `PLATFORM_ADMIN_EMAILS` env silently elevates a matching SSO login to `workspace_admin`, revoking existing workspace assignments. No BA doc mentions a break-glass channel. | `access.service.ts:577-608`; `libs/platform/src/config/env.schema.ts:290` |
| I-2 | User-authored custom roles are creatable per workspace (`POST /roles`). `Phase 4/02` §6 closes only the removed persona roles; silent on custom roles. | `access.controller.ts:86`; `access.service.ts:214` |
| I-3 | `project_admin`/`project_member` are seeded as **editable** per-workspace copies (`isSystem:false`); only `workspace_admin` is immutable. Matches `Phase 4/02` §3.8; contradicts `2026-07-26-rbac-pbac-architecture.md` §4.1, which recommended locking all three. | `db/seeds/bootstrap.ts:95-112`; `roles-tab.tsx:61-63` |
| I-4 | `capacity:view_draft` — a fourth capacity code invented because the BA specifies one `capacity_planning:manage` with two settings, making AC-012 and AC-013 jointly unsatisfiable. | `permissions.catalog.ts:120-137`; `capacity-plans.service.ts:286-294` |
| I-5 | Comment edit/delete restricted to the **author** (`COMMENT_NOT_OWNED`) regardless of role. No BA rule. | `collaboration.service.ts:106-112,123-129` |
| I-6 | Time logs and watchers gated on `work_item:edit`; no BA use case exists for either. | `work-items.controller.ts:732,752,773,805,819` |
| I-7 | Role/permission changes take effect on the **next request** via cache invalidation; `Phase 4/02` §3.5 says next login. Stricter than specified — should be ratified. | `access.service.ts:196-199`; `test/e2e/authz-revocation.e2e.spec.ts:132,145` |
| I-8 | `ns:*` namespace wildcards are a grant primitive the BA never described. Blocked for custom roles. | `permissions.catalog.ts:262-273`; `access.service.ts:308-313` |
| I-9 | `POST /workspaces` exists though `Phase 4/02` §4 lists Workspace create UI as out of scope. | `workspace.controller.ts:157` |
| I-10 | `report:view` granted to `project_member`; the SRS defers Reports RBAC and never rules on PM. | `permissions.catalog.ts:403-405` |
| I-11 | `audit:view` is WA-only — correct per `Phase 4/02` §3.7, contradicts the stale role-mapping matrix §12 (PM ✅). | `audit.controller.ts:33` |
| I-12 | `project:create`, `teams:create/edit/manage_members`, `project:manage_members` are WA-only — correct per §3.1, contradicts stale role-mapping §4. | `permissions.catalog.ts:352-356` vs `295-341` |

### 2.12 Authorization test coverage blind spot

`test/e2e/*` constructs principals via `ensureViewerGrant` (`test/e2e/support/flow-harness.ts`), which creates **project-scoped** assignments. Real users are workspace-scoped (§2.1, §2.2). Therefore `read-scoping.e2e.spec.ts`, `project-isolation.e2e.spec.ts` and `portfolio-isolation.e2e.spec.ts` all pass while the production principal shape is unscoped.

**No test asserts the scope that a provisioning path actually writes.** This is the single highest-leverage test to add.

`test/route-policy.ratchet.spec.ts` caps unguarded routes at 44 and only lets the number fall, but it is a source-text counter, not an authorization test — its own docblock and `rally/CLAUDE.md` say so. Breakdown of the 44: 19 legitimately self-scoped (`/bff/*`, `/auth/me*`, notifications, invitation accept, SCM webhook with HMAC, `my-permissions`, `work-items/my`), 4 correctly guarded inside the service (`work-items/by-key`, `reorder`, comment patch/delete), 21 genuinely unguarded reads (§2.5 and §2.3).

---

## 3. Data model

Verified matching, no action: entity coverage is essentially complete (see §9), and **all four confirmed status catalogs match the reconciled baseline exactly**:

| Catalog | Code | Values |
|---|---|---|
| `iteration_state` | `db/schema/enums.ts:106` | `planning \| committed \| accepted` |
| `release_status` | `enums.ts:108` | `planning \| active \| accepted` (legacy five-value set correctly absent) |
| `milestone_status` | `enums.ts:250-257` | `planned \| at_risk \| met \| missed \| cancelled \| completed` |
| work-item schedule **and** flow state | `enums.ts:89-96`, both columns share the one pgEnum at `work.ts:126-127` | `idea \| defined \| in_progress \| completed \| accepted \| release` — no `ready`, no `released` (backfilled away by `0041`) |

Every TypeScript union is `(typeof enum.enumValues)[number]` and every DTO enum is `z.enum(<drizzleEnum>.enumValues)`, so TS↔DB enum drift is structurally impossible. That half of the model is clean.

### 3.1 Nullable business keys (P1)

`iteration_key`, `release_key`, `milestone_key` are **nullable** under plain unique indexes (`work.ts:281,457,1149`; `0054:22`). Postgres treats NULLs as distinct, so unlimited keyless rows are legal. The ID is the only way into those rows from the list (`Phase 3/04:38`, `Phase 3/02:134`).

This is the exact defect `0076`/`0085` fixed for `capacity_plans.plan_key` — "three live plans had none, and the ID is the list's only way in" — never applied to the other three.

### 3.2 Required-field and range constraints absent (P1/P2)

| SRS requirement | Doc | Code |
|---|---|---|
| Defect `severity` and `state` required | `Phase 3/04:138` | nullable columns `work.ts:167,175`; `.optional()` in `work-item-request.dto.ts:110,116`; response DTO `.nullable()` |
| Iteration `End >= Start` | `Phase 2/02:404` | no CHECK anywhere; Zod only |
| Release `Release Date >= Start Date` | `Phase 3/02:236` | no CHECK |
| Planned Velocity numeric `>= 0` | `Phase 2/02:179,407`; `Phase 3/02:142-143` | `integer` (`work.ts:288`), no `>= 0` CHECK; fractional input truncates |
| Plan Estimate / task hours `>= 0` | `Phase 1/02:79`; `Phase 1/05:55` "Time fields cannot be negative" | `ck_wi_hours_nonneg` (`0011:60`) only ever covered the three hours columns and died with them in `0074:24-26`; nothing recreated for `story_points` (`work.ts:145`) or `tasks.{estimate,todo,actual}_hours` |
| Project Key format (2–10, uppercase, letter-initial) and `end_date >= start_date` | `Phase 0/04:432,434` | `varchar(10)` only (`work.ts:70`); no format or date-order CHECK |
| Defect fields are Defect-only; Priority only when `type='defect'` | `Phase 1/03:85,126` | no CHECK ties `severity/root_cause/resolution/defect_state/found_in_*/fixed_in_build` to `type='defect'`; `priority` is `NOT NULL DEFAULT 'none'` for every type, so a Story can carry a root cause and an Urgent priority |

Contrast `portfolio_items`, where the analogous shape rule **is** a DB CHECK (`0071_portfolio_capacity_planning.sql:80`) with the stated reason that `db/seeds/**` writes rows without going through the service layer.

### 3.3 Missing table (P2)

`project_settings` with `default_assignee_id`, `default_workflow_id`, `enable_sprint`, `enable_release`, `enable_story_point` (`Phase 0/04:195-204`), surfaced as create fields at `:311-313`. **Absent** — zero hits for `project_settings`/`projectSettings` in `db/`, `libs/`, `apps/`. `projects.settings` jsonb exists (`work.ts:77`) and nothing writes those keys. Three BA-specified project toggles have no storage, and no UI (`projects-detail-page.tsx:135-138` is Details + History only), so `P0-PRJ` scenario §14 is untestable.

### 3.4 Enum token mismatches (P2 — BA ruling needed)

| Enum | Code | SRS | Note |
|---|---|---|---|
| `project_status` | `enums.ts:56` `active\|archived` | `Phase 0/04:167,440` adds `completed` | BA self-conflicts: `Phase 1/08:84` says Active/Archived only |
| `team_status` | `enums.ts:46` `active\|archived` | `Phase 1/08:448` (P1-DC-009) "replace old Team `Archived` language" with Deactive | UI relabels it (`settings.json:303` `"statusArchived": "Deactive"`) — token≠label, the exact condition `0040_defect_severity_align.sql` was written to eliminate |
| `user_status` | `enums.ts:14` `invited\|active\|inactive\|suspended` | `Phase 1/08:447` Active/Invited/Deactive | `suspended` is what the UI labels "Deactive" (`members-tab.tsx:402`); **`inactive` is dead** — its only occurrence in the whole repo is the enum declaration |

### 3.5 Schema-declaration drift (P2)

- `db/schema/work.ts:104` returns `[{ pk: primaryKey({ columns: [workspaceId, itemType] }) }]` — an object **inside** an array rather than a builder, so the composite PK created at `0060_workspace_unique_keys.sql:18` is invisible to the Drizzle schema. Same class as the `uq_rds_release_team_date` COALESCE drift already flagged at `work.ts:1075-1083`; a regenerated migration would "fix" the declaration into a broken shape.
- `work.ts:3-5` header still advertises `project_counters` (dropped in `0060:85`) and `custom_field_defs` (never existed). `work.ts:466-467` has a truncated sentence left from the `0099` move of the Ideal target to `release_team_targets`.
- `workspace_members.role_id` (`db/schema/workspace.ts:63`) is authoritative for nothing — `AccessService` resolves from `user_role_assignments`. A denormalised column that has already caused an invited-role bug.
- `work_item_type` still carries `'task'` (`enums.ts:72`) and `ix_wi_tasks` filters `type='task'` (`work.ts:207-209`) though nothing inserts one — dead index.

### 3.6 Declared divergences — leave as-is

- Refined Estimate / Refined Work Item Count `NOT NULL DEFAULT 0` where the SRS says optional (`Phase 5/01:100-101`). Declared and justified in `0079_refined_estimate_zero_default.sql` plus a column comment: one representation of "no forecast" instead of two.
- `work.time_logs` retained as a deliberate worklog even though Actual is now a manual column (`0052`). Worth telling the BA the API still exists.
- Test Case / Test Run / Test Result tables correctly absent — post-MVP by the BA's own doc (`01_DB design/mini_rally_database_design.md:1094-1100`), and no reconciled requirement mentions them.
- `portfolio_items.planned_start_date` is `date` (`work.ts:544`) where `Phase 5/01:107` says "**plain free-text field (intentionally not a date picker)**" — needs a BA ruling either way; the DB currently forbids the value the BA deliberately specified.

---

## 4. Business flow and lifecycle

Backend enforcement is genuinely strong on the *status* half of the chain. The remaining exposure is delete-path integrity (§1.1) and one uncovered writer per invariant.

### 4.1 P1 — `rolloverUnfinished` bypasses every rule on the same table

`libs/modules/iterations/src/application/iterations.service.ts:383-396` performs a raw `this.db.update(workItems)` outside `uow.run`.

It moves out *exactly* the non-accepted items, which leaves the source iteration holding only accepted work — BR-IT-02's precondition (`BUSINESS_BASELINE.md:12`) — and `autoAcceptIterationIfComplete` is never called. Compare `bulkAssignIteration` (`work-items.service.ts:1443-1469`), which does call it. The target iteration is validated for project only (`:373-381`), never team, so `ITERATION_TEAM_MISMATCH` cannot fire. No `updatedBy`, no activity rows.

`iterations.service.spec.ts:206-221` covers the move count only.

### 4.2 P1 — Task delete, create and re-parent all skip the parent roll-up

Both roll-ups gate on a state *transition* (`work-items.service.ts:798-806`), so three writers escape:

| Writer | Code | Consequence |
|---|---|---|
| Task soft-delete | `work-items.service.ts:1058-1072` — no `areAllTasksComplete`, no activity row, no `uow.run`; repo `work-item.drizzle-repository.ts:990-996` stamps `deleted_at` only | Story with `[completed, defined]`, delete the `defined` task → Iteration Status and Team Status read 100%/0 active while the parent stays `in_progress` |
| Task create | `work-items.service.ts:355-425` calls neither roll-up | A `completed`/`accepted` Story that gains a new `defined` Task stays terminal — same state `BUSINESS_BASELINE.md:39` addresses for reopening |
| Task re-parent | `PATCH /work-items/:taskId {parentId}` | Moving a `completed` task away leaves the old parent `completed` with an incomplete task set; moving an open task under a `completed` parent does not reopen it |

None of the three has a test.

### 4.3 P1 — Manual Iteration status change is *more* restricted than the automatic path

`BUSINESS_BASELINE.md:11` — "Authorized users can always edit Iteration status manually." `E2E_AGILE_LIFECYCLE_RECONCILIATION.md:169` pass criterion 5 — "Automatic parent/Iteration updates never lock authorized manual status changes"; `:150` step 11 — "remains manually editable".

`iterations.service.ts:229-240` refuses **every** transition except `planning→committed` and `committed→accepted` (`ITERATION_INVALID_STATE_TRANSITION`), and `:327-338` additionally refuses a manual accept unless the iteration is non-empty **and** every item is accepted (`ITERATION_EMPTY` / `ITERATION_NOT_ALL_ACCEPTED`). A user therefore cannot manually accept, cannot go `planning→accepted`, and cannot correct a mistaken accept — while `autoAcceptIterationIfComplete` (`work-item.drizzle-repository.ts:621-631`) *does* move `planning|committed → accepted`.

The code comment cites "BA F1: manual-first", which no doc in `07_Test Business/` states. `ITERATION_INVALID_STATE_TRANSITION` has no test, so the transition graph is unpinned in both directions.

### 4.4 P2 — Task state silently coerced, and `accepted` on a Task half-fires

`work-item.drizzle-repository.ts:48-55` maps `idea→defined`, `accepted→completed`, `release→completed`; the update DTO accepts all six values for a task (`work-item-request.dto.ts:128-129`). `RECONCILED_SOURCE_OF_TRUTH.md:291` says "a screen must not silently normalize legacy values"; `E2E_AGILE_LIFECYCLE_RECONCILIATION.md:167` pass criterion 3 fixes Task State at three values.

Worse than cosmetic: `PATCH /work-items/:taskId {scheduleState:'accepted'}` writes `state='completed'`, and because `taskTransitioningToComplete` tests `=== 'completed'` strictly (`work-items.service.ts:799-800`) while the To-Do auto-zero tests `isCompletedScheduleState` (`:813-814`), the hours zero but the **parent roll-up is skipped**. The fix is rejecting the three non-task values, not patching the branch.

### 4.5 P2 — `flowState` advertised on create and silently dropped

`work-item-request.dto.ts:95` accepts `flowState`; `work-items.controller.ts:277-307` never forwards it; `CreateWorkItemOpts` (`work-items.service.ts:92-119`) has no such field; `:371-372` derives both columns from `opts.scheduleState`. So `POST /work-items {flowState:'defined'}` returns `idea/idea`, and there is no mirror-conflict check on create (only on update). Same class: `CreateTaskDto.state` → `createTask` opts `state?: string` → dropped, so a Task is always born `defined` (`work-items.controller.ts:534`, `work-items.service.ts:472`).

### 4.6 P2 — Team Status member progress % is a third formula

`DEV_FIX_HANDOFF.md:87-94` (DEV-019) requires task counts and percentages to be State-based and consistent across Iteration Status and Team Status. The *counts* now agree (both state-based). The member roll-up bar does not: `libs/modules/team-status/src/application/team-status.service.ts:319-326` computes `progressPercent = actualHours / estimateHours`, citing Team_Status SRS §10, and renders it under a "task-completion progress bar" label (`team-status-page.tsx:502-504`). `widgets/iteration-board/iteration-board.tsx:260-262` is still To-Do-based (Board is Future Backlog, so INFO-level).

### 4.7 P2 — Iteration auto-accept writes no revision-history row

`work-item.drizzle-repository.ts:621-631` flips `iterations.state` with no activity append; manual accept does log (`iterations.service.ts:345-351`). `E2E_BUSINESS_FLOW_COVERAGE.md:300` (E2E-012) and `DEV_FIX_HANDOFF.md:77-80` expect an observable transition, so a BA retesting DEV-021 sees the state change with an empty audit trail.

### 4.8 P2 — An accepted Iteration disappears from the assignment picker

`iteration.drizzle-repository.ts:132-136` restricts picker options to `['planning','committed']`. `BUSINESS_BASELINE.md:13` allows adding, removing or moving Story/Defect items while a sprint is running, and nothing closes an accepted iteration. Since auto-accept can flip an iteration without user action, items can afterwards no longer be assigned to it through the picker — though the service guard still permits it.

### 4.9 P2 — Milestone derived dates enforced by overwrite, not refusal

`milestones.service.ts:486-490` persists the patch **then** recalculates, backed by `trg_milestone_force_derived_dates` (`0097`). `BUSINESS_BASELINE.md:20` says the derived dates are read-only. A `PATCH` with manual dates on a release-linked milestone therefore returns **200 with reverted values** instead of refusing. The result is correct; the contract lies.

Same file: `milestone.drizzle-repository.ts:145-154` deletes four junction tables via `Promise.all` outside a transaction.

### 4.10 P2 — Backlog scope: docs contradict each other

`RECONCILED_SOURCE_OF_TRUTH.md:269` — "Plan > Backlog shows only Story/Defect items whose Iteration is `Unscheduled`. Assigning… removes it from Backlog." Against `E2E_AGILE_LIFECYCLE_RECONCILIATION.md:144` step 5 — "Backlog retains the same items" — and `notes/E2E-05-ITERATION-ASSIGNMENT.md` / `E2E-06`, which **passed** on seeing assigned items in the Backlog.

Code follows the E2E notes: `work-item.drizzle-repository.ts:406-451` filters type only, and iteration is a user-selectable filter (`backlog-page.tsx:180`). **BA ruling needed, not a code change.**

### 4.11 P2 — Residual DEV-020 label risk

`apps/web/src/shared/i18n/locales/en/work-items.json:9-15` is a five-value `status` map spelling `"In Progress"` and missing `idea`/`release` — the exact shape DEV-020 rejected. The canonical map is correct (`entities/work-item/model/types.ts:152` = `'In-Progress'`). Confirm the JSON block is dead, or delete it.

### 4.12 Docs say OPEN; the code has fixed it — close these eleven

| Item | Doc status | Code |
|---|---|---|
| DEV-006 (`DEV_FIX_HANDOFF.md:105-108`) Milestone cannot link Releases | P0 blocked | **Fixed.** `milestones.service.ts:612-623` + derived MIN/MAX `:206-227` + triggers `0097`; tested `core-business-rules.e2e.spec.ts:69`, `derived-invariants.e2e.spec.ts:144,192` |
| DEV-007/008 (`:124-131`) Backlog create fails / no Project | P0/P1 blocked | Backend **fixed** — `projectId` required (`work-item-request.dto.ts:89`), team optional and validated against project (`work-items.service.ts:312-319,1653-1659`). Front-end half still open, see §5.3 |
| DEV-011 (`:100-103`) Work Item Detail has no Milestone control | P0 blocked | **Fixed**, including the hard part: `detail-sidebar.tsx:153-167` filters add-new options by Release while preserving already-selected Milestones; backend `work-items.service.ts:1717-1735` |
| DEV-015 half 1 (`:53-56`) drop the Time-Logs sum for Actual | P1 open | **Fixed** by `0052_task_actual_hours_manual.sql`; Actual is a manual column |
| DEV-017 (`:34-37`) auto-complete must mirror Flow | P0 open | **Fixed** structurally — the parent write goes through the mirroring repo (`work-items.service.ts:942-947`) |
| DEV-018 (`:39-42`) reopen → parent In-Progress | P0 open | **Fixed**, and now also from `accepted`/`release` (`work-items.service.ts:973-1014`); tested `core-business-rules.e2e.spec.ts:123` |
| DEV-019 (`:87-94`) task count/% State-based | P1 open | **Fixed** for Iteration Status (`iteration-status.drizzle-repository.ts:57,134-146`). Team Status counts agree; member % does not — §4.6 |
| DEV-020 (`:24-27`) 6-value catalog + bidirectional mirror | P0 open | **Fixed.** `enums.ts:89-96`; mirror `work-item.drizzle-repository.ts:928-931` + refusal `work-items.service.ts:782-796`; tested `core-business-rules.e2e.spec.ts:132-144` |
| DEV-021 (`:77-80`) iteration must auto-Accept | P1 open | **Fixed and hardened past the ask** — re-evaluated on membership changes too (`work-items.service.ts:874-920,1443-1469`); tested `derived-invariants.e2e.spec.ts:86,101,126` |
| DEV-022 (`:82-85`) single-Committed-per-project restriction | P1 open | **Removed.** `iterations.service.ts:273-293` has no such check |
| Reports / Release Tracking prohibitions | Phase 5 docs | **Authorized** as Phase 6 — §1.9 |

Nothing in the docs is marked fixed while the code is still broken. The drift is one-directional: docs lag.

### 4.13 Untested branches and scenarios

- `WORK_ITEM_STATE_MIRROR_CONFLICT` refusal (`work-items.service.ts:787`) — no test anywhere
- `ITERATION_INVALID_STATE_TRANSITION` (`iterations.service.ts:235`) — no test
- `ITERATION_TEAM_MISMATCH` (`work-items.service.ts:1528`) — no test
- Iteration-delete / Release-delete orphan behaviour (§1.1) — no test
- `rolloverUnfinished` auto-accept and team validation (§4.1) — move count only
- Task delete / create / re-parent roll-up (§4.2) — none of the three
- Default `scheduleState === 'idea'` on create — asserted nowhere (`core-business-rules.e2e.spec.ts:135` walks the catalog but starts from an explicit set)
- Task-state coercion (§4.4) — no test that a Task refuses or normalizes `idea`/`accepted`/`release`
- E2E-005 as written (`:129`) — `story-task-hours.e2e.spec.ts` deliberately asserts the opposite contract
- Provisioning scope (§2.12) — no test asserts what scope a provisioning path writes

Covered today: E2E-001/003/004/005/006/007 (`project-delivery-flow`), E2E-002 (`team-preparation-flow`), E2E-008/009 (`context-isolation-rbac`), E2E-010/016 (`deferred-scope-guard`), E2E-011/012 (`iteration-completion-flow`), E2E-013/014/015 (`release-milestone-defect-flow`), plus `core-business-rules` and `derived-invariants`.

---

## 5. Scope and screen coverage

### 5.1 P0 — Iteration Status Board

See §1.6.

### 5.2 P0 — Release Progress on Release detail

`Phase 3/02_Release_Management/SRS.md` P3-REL-FR-037, P3-REL-DC-018, §293; `E2E_BUSINESS_FLOW_COVERAGE.md:402`; tracker `GAP-P3-REL-001`. `apps/web/src/pages/releases/ui/release-detail-panels.tsx:26-47` renders a Completion % plus progress bar and `:104-164` a Burndown table; both mounted at `releases-detail-page.tsx:285,287`. The Releases *list* is correctly clean.

### 5.3 P0 — Team is required on work-item create; the SRS says optional

`Phase 1/02_Work_Item_Create/SRS.md` WIC-FR-005 and AC#8; `DEVINT_PHASE_0_4_DEV_HANDOFF.md:41-45`; tracker `GAP-P1-CREATE-003` (P0). Blank Team means the item belongs to the Project backlog.

`apps/web/src/features/work-items/ui/create-work-item-modal.tsx:102-107` refuses on `teamRequired`, and `:266` passes `allowUnassigned={false}`; the detail sidebar repeats it at `pages/work-item/ui/detail-sidebar.tsx:285`. The API accepts null (`work-item-request.dto.ts:101`), so the UI alone makes the SRS's default state unreachable.

### 5.4 P0 — Defect delete and bulk actions are live where the SRS forbids them

`Phase 3/04_Quality_Defect/SRS.md` P3-QA-FR-010, FR-011, FR-016 (2nd), AC-14. `pages/quality/quality-page.tsx:348-357` renders a live `BulkDeleteCopy`; Copy really creates (`:121-136`) and Delete really deletes (`features/work-items/ui/bulk-delete-copy.tsx:43-49`).

### 5.5 P0 — Milestone Artifacts has no Add control

`Phase 3/03_Milestones/SRS.md` P3-MS-FR-028; tracker `GAP-P3-MS-001` (P0, logged 2026-07-24, still open). `pages/milestones/ui/detail-parts.tsx:39-58` mounts `entities/work-item/ui/artifacts-tab.tsx`, a read-only viewer with search and pagination only.

### 5.6 P0 — Release detail cannot manage its assigned items

`Phase 3/02_Release_Management/SRS.md` P3-REL-FR-029, Q02, and FR-033 (sort / resize / inline edit). `pages/releases/ui/release-artifacts-tab.tsx:7-26` mounts the same read-only shared table; no add/remove, no sort, no resize, no inline edit (`entities/work-item/ui/artifact-table.tsx:116-124` is plain `<th>`s, and the docblock at `:11-13` says "shared **read-only** artifact table"). The mockup's `ArtifactDashboard` (`IterationsPage.tsx:369-412`) toggles membership with a checkbox from this tab.

### 5.7 P1 — No project-scoped routes

`Phase 0/01_App_Shell/SRS.md` §5.2 requires `/p/:projectKey/{home,backlog,timeboxes,iteration-status,quality,portfolio,reports}`; §5.3 requires "Project trong URL phải được validate với … membership"; §7 says persist only `lastProjectKey`.

`app/router/router.tsx:82-292` are all flat routes; project lives in localStorage, and `shared/lib/stores/app-context.store.ts:58-66` persists whole `workspace`/`project`/`team` objects. Consequences: a shared deep link resolves to the *reader's* last project, and §5.3's membership validation is unimplementable as built.

### 5.8 P1 — Undeclared subsystem: Settings ▸ Integrations (GitHub/SCM)

A grep of `00_Documents`, `04_Developement_tracking`, `07_Test Business` and `02_Prompt UI` for `GitHub|SCM|pull request` returns **zero hits**. Shipped anyway: `settings-page.tsx:79-84` plus `ui/integrations/*` (5 files), `libs/modules/scm/src/interface/http/scm.controller.ts:126-220`, `scm-webhook.controller.ts`, permission code at `permissions.catalog.ts:56`, and a fourth **Connections** tab on Work Item Detail (`work-item-detail-page.tsx:296-304`) where `Phase 1/03_Work_Item_Detail/SRS.md` §16 fixes the tab set at Details / Tasks / Revision History. The connections-tab file's own docblock states it "appears in NO BA document… nobody has ruled on it".

The only doc that mentions an integrations/webhook table at all is `01_DB design/mini_rally_database_design.md:1128-1133`, which is pre-pivot and does not authorize this.

### 5.9 P1 — Workspace lifecycle API exists where the MVP forbids it

`Phase 0/03_Workspace/SRS.md` COMPANY-FR-010, §8, AC-8. `workspace.controller.ts:157` `POST /workspaces`, `:214` `DELETE /workspaces/:id`, `libs/modules/identity/…/bff.controller.ts:197` `POST /bff/switch-workspace`. The UI is clean; the API is not.

### 5.10 P1 — Notification Preferences exposed, including an excluded channel

`Phase 4/01_Notifications/SRS.md` P4-NOTIF-DC-008 / DC-009; `Phase 4/02` checklist:110,171; `TRACEABILITY_MATRIX.md:52`; tracker `GAP-P4-SET-005`. `settings-page.tsx:47` + `ui/notifications-tab.tsx:78-146` ship six types × in-app **and email** — email being the channel DC-009 excludes — backed by `libs/modules/notifications/…/notification-preferences.controller.ts`.

### 5.11 P1 — Iterations list is missing two columns that do not exist on the DTO

`Phase 2/02_Iterations/SRS.md` P2-IT-FR-005 (tracker `GAP-P2-IT-001`) requires Project and Task Estimate. `pages/iterations/model/columns.ts:11-36` has neither, and neither field exists on `iteration-response.dto.ts:5-22` — so this is not fixable in the grid alone.

Note the UI/UX auditor reached the opposite verdict for the same columns because the mockup includes them and `rally-05-timeboxes.png` does not. **Real-Rally behavior should settle this.**

### 5.12 P1 — Capacity Planning: inline Estimated edit and four undeclared verbs

- `Phase 5/02_Capacity_Planning/SRS.md` §209 and test P5-CP-024 make Estimated read-only on the Team row ("no inline number input"); the Allocate dialog is the only editor. `pages/capacity-planning/ui/allocation-row.tsx:285-306` is an inline editable cell (commit at `:140-155`).
- §14 and `PHASE5_DEV_HANDOFF.md` §5.8 fix the action catalog at Draft → Published → Revert. Shipped extras: `Move To Another Plan` (`ui/move-to-plan-modal.tsx:20-45`, API `capacity-plans.controller.ts:341`), bulk Delete (`capacity-plans-page.tsx:302-334`), `Delete Plan` (`capacity-plan-detail-page.tsx:603-609`), `Edit Plan Details` (`:851`), plus `Remove All Assignments` / primary-allocation (`ui/capacity-item-actions.tsx:44-45`). The bulk-delete path warns but still permits deleting a **Published** plan, and the mockup has no checkbox or select-all anywhere in the plan list (`CapacityPlanningPage.tsx:1441-1483`).
- `Add Features` pickers should show ID / Name / **Project** / **Team** / **Allocation** in team scope (§225-233, "so the planner can see which Team currently owns each Feature"); `ui/add-features-modal.tsx:91-97` renders `key — name` only. The scope logic itself is correct (`:63-99`).

### 5.13 P1 — Iteration Status filters and columns

- `Phase 2/03_Iteration_Status/SRS.md` P2-IS-FR-022/023/024 require Manage Filters (multi-column chooser), free-text filters for ID/Name/Plan Est/Task Est/To Do, and dropdowns for Type/Flow State/Iteration. `ui/iteration-chrome.tsx:441-497` has three fixed filters (Schedule State, Owner, Blocked-only); `ColumnFieldsMenu` at `:498-506` is show-fields, not filters.
- P2-IS-FR-019 / §479 / P2-IS-DC-006 (tracker `GAP-P2-IS-004`) forbid a per-row Defects column. `pages/iteration-status/model/columns.ts:45-46` has `defects` and `defectStatus`, rendered at `ui/status-row.tsx:470-488`, visible by default (no `defaultHidden`).
- Column order vs `rally-12-iteration-status.png`: reference is PlanEst, ToDo, Tasks, Actual, TaskEst, Owner; code (`columns.ts:39-44`) puts TaskEst two positions early. The shipped default also adds an Iteration column and a Flow State column duplicating Schedule State, neither in the reference default.

### 5.14 P1 — Team Status has controls the SRS defers, and edits fields it fixes read-only

`Phase 3/01_Team_Status/SRS.md` P3-TS-FR-006 / §177 / §456 and `PHASE3_MOCKUP_CHECKLIST.md` §2/§4 (trackers `GAP-P3-TS-001/002`) say no search input. `team-status-page.tsx:292-299` has search, `:300-319` an undeclared State filter, `:370` pagination. §8.3 ("No in P3.1") and FR-026/027 fix Estimate/ToDo/Actual/Owner read-only; `:756-818` makes all four inline-editable (`commitEstimate:605-621`, `handleOwnerChange:653-661`).

### 5.15 P1 — Milestones carry rollups and columns the SRS excludes

`Phase 3/03_Milestones/SRS.md` P3-MS-FR-010 and FR-002 ("only Name, Target Start, Target End, Status"); `Future_Backlog/02_Release_Planning.md:20`. `pages/milestones/milestones-detail-page.tsx:355-396` renders a completion % + progress bar + items/points; `milestones-page.tsx:382-393` adds an ID column and `:533-540` a four-tile KPI strip. Both the mockup (4 columns, no ID) and `rally-07-milestones.png` agree that ID is absent.

Also P3-MS-FR-016/017 and `PHASE3_TEST_SCENARIOS.md` P3-MS-006 specify count-summary controls opening a searchable selection modal; `milestones-detail-page.tsx:238-290` uses inline multi-selects, and the count-summary component `ui/detail-parts.tsx:8-35` (`RelationButton`) is **dead code**.

### 5.16 P1 — Timeboxes carries Iteration Status metrics and a carry-over workflow

`Phase 2/02_Iterations/SRS.md` §15 and `PHASE2_MOCKUP_CHECKLIST.md` §4/§6. `pages/iterations/ui/iteration-parts.tsx:347` (CapacityStrip), `:348` (IterationScope), `:455-462` + `:595-652` (`RolloverModal`), API `iterations.controller.ts:271-278` (`POST :id/rollover`).

### 5.17 P1 — Epic Children rows do not expand

`Phase 5/01_Portfolio_Items/SRS.md` §404 requires row expansion previewing ≤5 leaf Story/Defect. `pages/portfolio/ui/epic-children-table.tsx` has no disclosure at all; the ≤5 preview exists only on the list (`ui/portfolio-child-rows.tsx:431`).

### 5.18 P2 — Remaining scope items

| Item | Doc | Code |
|---|---|---|
| `Type` should be its own sortable/hideable column on Backlog, Iteration Status and Portfolio | P2-IS-FR-018; P5-PI-FR-002/Q02/AC-1; `GAP-P2-IS-003`; mockup `BacklogPage.tsx:397`, `PortfolioPage.tsx:27-39`; `rally-03b-backlog.png` | Folded into the shared ID cell (`entities/work-item/ui/id-cell.tsx:35-66`) on all three grids — therefore unsortable and unhideable |
| Iteration Detail should be a routed page with breadcrumb; only the Details tab in P2.2 | P2-IT-FR-014/015/017 | `pages/iterations/iterations-page.tsx:131` renders from local `detailId` state — no route, no deep link, no breadcrumb, unlike `/releases/$id` and `/milestones/$id`; `ui/iteration-parts.tsx:299-306` adds a Revision History tab |
| Iteration Status page title should be `Iteration` | P2-IS-FR-003, §165 | `shared/i18n/locales/en/iteration-status.json:2` = `"Iteration Status"`, rendered `ui/iteration-chrome.tsx:67-72` |
| Create Release modal should show a locked `Type = Release` and a Project field | P3-REL-FR-011/012, §3 | `create-release-modal.tsx:71-171` has neither; the tell is unused locale keys `releases.json:19-20` |
| Quality dashboard should have pagination | `Phase 3/04` §1/§3; `PHASE3_TEST_SCENARIOS.md` P3-QA-004; mockup `QualityPage.tsx:277-290` | `grep -c PaginationFooter` in `quality-page.tsx` = **0**; `features/quality/api.ts:69-114` `useDefects` has no limit/offset — fetches the whole unfiltered set. Only major grid without pagination |
| No undeclared KPI strips | P3-MS-FR-002; P2-BL-FR-019 (KPI pattern belongs to Iteration Status / Dashboard / Reports) | `iterations-page.tsx:170-177`, `releases-page.tsx:134-151`, `milestones-page.tsx:533-540`, `quality-page.tsx:165-202` (6 tiles) |
| Typed-confirmation for Delete Project and Remove User Access | `Phase 4/03` P4-SET-07 §9, P4-SET-008, P4-SET-013; `GAP-P4-SET-004`; `CONVERSION_PROGRESS.md:69` | No typed-confirm input anywhere in settings. `members-tab.tsx:694-708` is a plain confirm for bulk deactivate, and there is no "Remove user access" action at all (`settings.json:219` unused). See §6.2 |
| Workspace Settings should show a read-only Workspace Scope value | `Phase 4/03` P4-SET-01 §3.3; `GAP-P4-SET-001` | Absent from `pages/settings/ui/workspace-settings-tab.tsx` |
| Project feature toggles `enable_sprint`/`enable_release`/`enable_story_point` | `Phase 0/04` PRJ-FR-012 §7.3 | No UI and no storage (§3.3) |
| Portfolio Rank should use ▲▼ buttons, and `New Portfolio Item` should be a menu offering New Epic / New Feature | `Phase 5/01` §14, §37, P5-PI-FR-005, FR-030, AC-27; mockup has **no** drag anywhere | Drag at `portfolio-page.tsx:226-263`; single button at `:391-396`. Both argued in-code as needing an SRS amendment — pending BA ruling |
| Global search should open an overlay or page | `Phase 0/01` SHELL-FR-009 (`GAP-P0-SHELL-006` defers the feature) | `app-shell.tsx:713-733` binds `searchQuery` with no submit, handler, route or API call — the only two references in the file are the `useState` and the `onChange`. Shipping an inert input reads as broken rather than deferred |

### 5.19 Dead code carrying deferred or out-of-scope features

- `pages/settings/ui/labels-tab.tsx` and `ui/workflow-tab.tsx` exist **un-imported** with live i18n at `settings.json:13-14,135-175` — one line from re-entering `SIDEBAR`. P4-SET-03/-04 defer both. The Workflow **API** is live regardless (`workflow.controller.ts:61-136`), which P4-SET-03 §129-130 forbids.
- `pages/projects/ui/project-parts.tsx:33` `ArchiveConfirmModal` — exported, zero import sites, and it is the typed-name gate the live Archive/Delete flow lacks (§6.2).
- `pages/settings/ui/preliminary-estimate-card.tsx:30-95` ships the Preliminary Estimate mapping config that `RECONCILED_SOURCE_OF_TRUTH.md:74` and `PHASE5_DEV_HANDOFF.md` §2.2 both defer. It implements the acknowledged BA need at §44 but under Settings ▸ **Workspace**, not the specified `Workspace > Project Management`. Needs a doc update, not a revert.
- `entities/work-item/ui/…` `RelationButton` (`milestones/ui/detail-parts.tsx:8-35`) — the specified count-summary control, unused (§5.15).

---

## 6. UI/UX

> ⚠️ **Read §0.5.1 first.** Every finding in this section that cites a `rally-NN.png` file was written on the belief that those screenshots were real Rally. They are screenshots of **our own clone**, from a build older than `main@0d5fbba5`. Screenshot-derived deltas here are clone-internal consistency notes with no Rally authority, and four of them are factually wrong for current code. Findings sourced from the **mockup** (`03_Mockup Design/src/**`) or from BA docs are unaffected.

### 6.1 P1 — Two parallel list shells coexist

`apps/web/src/shared/ui/list-page/list-page-scaffold.tsx:1-28` states in its own docblock that it exists because list pages "stopped re-wiring… so they drifted". It has **6 consumers** (`iterations`, `milestones`, `releases`, `portfolio`, `capacity-plans`, `connections-tab`).

**8 pages still hand-wire** `PageToolbar` + `SelectableTable` + `PaginationFooter`: `pages/backlog/backlog-page.tsx:21,321,389`; `pages/quality/quality-page.tsx:205,339`; `pages/iteration-status/iteration-status-page.tsx:502,566`; `pages/team-status/team-status-page.tsx:292,328,370`; `pages/projects/projects-page.tsx:181,194,219`; `pages/settings/ui/{members,teams,audit-log}-tab.tsx`.

The drift the scaffold was built to prevent is live in exactly the highest-traffic screens. Inline-style debt tracks the same files: `pages/iteration-status/ui/status-row.tsx` (27 raw `style={{}}`), `ui/iteration-chrome.tsx` (26), `widgets/app-shell/app-shell.tsx` (22), `widgets/iteration-board/iteration-board.tsx` (8) — roughly 60% concentrated in the Iteration Status feature plus the shell, i.e. the same code that bypasses the scaffold. A ratchet exists at `src/test/fe-consistency.ratchet.test.ts:10-30`.

### 6.2 P1 — Typed-name destructive gates missing, with the component already written

| Action | Design source | Code |
|---|---|---|
| Remove User Access | mockup `SettingsPage.tsx:200-221,279` `ConfirmRemoveUserAccess` with a typed-name gate; `08_Convert to figma/CONVERSION_PROGRESS.md:69` ("`Dialog` extended with `Require Typed Name` for Remove User Access") | Action absent from `pages/settings/ui/members-tab.tsx`; the only destructive path is reversible bulk Deactivate via plain `ConfirmDialog` at `:694-710`, no `confirmText` |
| Archive / Delete Project | mockup `ProjectsPage.tsx:856-884` `ConfirmDestructive` with `requiredText` | `pages/projects/projects-page.tsx:316-346` plain `ConfirmDialog`, no `confirmText`. The typed-key modal exists at `ui/project-parts.tsx:33-107` and is **never imported** |

Both irreversible actions ship with no typed gate while the supporting component sits unimported. This is the cheapest high-value fix in the audit.

### 6.3 P1 — Two-tier peek → expand pattern lost app-wide

Mockup `components/shared.tsx:149-196` defines a `DetailPanel` quick-view slide-over with a Maximize2 control that expands to the full page; `BacklogPage.tsx:469` and `QualityPage.tsx:292` both use it. Implementation navigates on every row click: `pages/backlog/backlog-page.tsx:255,730`, `pages/quality/quality-page.tsx:330-332,386`.

Consequence on the detail page: no collapse-back affordance either. Mockup `WorkItemDetailPage.tsx:415` has a Minimize2 "Collapse work item to summary panel"; `pages/work-item/work-item-detail-page.tsx:337-364` has no such control, and also no slot for the ··· more-actions control that both `rally-04-item-detail.png` and mockup `:416` show.

### 6.4 P1 — `BUILTIN_ROLE_ORDER` hardcodes three slugs

`pages/settings/model/role-capabilities.ts:64` hardcodes the three reconciled slugs, while `rally-15-roles.png` shows five system roles and the backend can return more. Any extra system role renders mis-classified as a deletable "custom" role.

### 6.5 P1 — Iteration Status hand-rolls an iteration selector its sibling reuses

`shared/ui/timebox-picker.tsx:160` exports `IterationPicker`, already consumed by `pages/team-status/team-status-page.tsx:284-289`. `pages/iteration-status/ui/iteration-chrome.tsx:35-213` hand-rolls prev/next plus a dropdown with 26 raw `style={{}}`. Two different iteration selectors inside one feature area.

### 6.6 P1 — Release Tracking bucket classification has no in-app explanation

Mockup `ReleaseTrackingPage.tsx:452-462` has an AlertCircle hover popover explaining Direct / Derived / Unparented. No `terminology`, `AlertCircle` or `HelpCircle` exists anywhere in `pages/release-tracking/**` (`release-tracking-page.tsx:164-202`). The three-bucket classification is inherently non-obvious.

### 6.7 P1 — Members grid drops Phone, adds Teams

Mockup `SettingsPage.tsx:460` = Name, Email, **Phone number**, Role, Status, Last Login. `pages/settings/ui/members-tab.tsx:87-216` = User, Email, Role, Status, **Teams**, Last Login. Phone and its dedicated search are gone though `users.phone` exists and is rendered on the profile tab (`profile-tab.tsx:180-186`).

Related, `Phase 4/03` P4-SET-05 §7 / P4-SET-006 and USER-FR-011/013 specify a User Details dialog opened by clicking the row, with Name and Phone admin-editable and no inline row-action buttons. `members-tab.tsx:664-682` states in a comment that "there is no whole-row click"; editing is inline per cell. Six i18n keys for the missing dialog sit unused (`settings.json:214-219`). Consequence: the audited event "User basic information update" (`Phase 4/03` §8) can never fire.

### 6.8 P2 — Remaining UI deltas

| Screen | Design source | Code | Delta |
|---|---|---|---|
| Backlog | mockup `BacklogPage.tsx:296-366` (configurable "Manage filters" popup over 10 columns incl. free-text ID/Name/Est, removable chips) | `backlog-page.tsx:474-632` | Six fixed enum dropdowns; no column-choosable filter layer, no per-filter chips |
| Backlog | mockup `BacklogPage.tsx:415-418` (hover-revealed per-row ▲▼ nudge, disabled at edges) | drag handle only (`RowGutter`) | One-click reorder replaced by drag-only (keyboard sensor exists, but not the specified control) |
| Backlog | doc `mini_rally_screen_traceability.md:247` (bulk: Move Release / Edit Priority / Assign Owner / Link / Delete) | `bulk-delete-copy.tsx:52-64`, `bulk-schedule-bar.tsx` | Ships Assign-Release / Assign-Iteration / Delete / Copy; bulk Edit-Priority and Assign-Owner absent (mockup's own versions were non-functional — open item, not regression) |
| Work Item Detail | `rally-04-item-detail.png` sidebar = SchedState, FlowState, Owner, Team, PlanEst, Iteration, Release, CreationDate | `detail-sidebar.tsx:302-325` adds defect-only **Environment**; `:436-478` Release/Iteration order differs | One undocumented field, plus field-order delta |
| Iteration Status | mockup `IterationStatusPage.tsx:29-31,116-131` `TRACK_ACTION_GROUPS` (11 actions incl. Split / Add Peer / Add Child / Link Existing / Copy Tasks From + 3 rank actions) | `iteration-status-page.tsx:514-524` (Delete + Copy) | 2 of 11. Severity capped because `screen_traceability.md:227` marks most as unwired in the mockup too |
| Quality | mockup `QualityPage.tsx:233` (bulk: Assign Owner, Set State, Set Build, Link Story, Delete) | `quality-page.tsx:348-357` | 4 of 5 bulk actions absent |
| Releases | mockup columns = Name, Theme, Start, Release Date, Project, Planned Velocity, Task Est, State (8) | `pages/releases/model/columns.ts:16-55` (10) | Adds ID + Version; omits the Progress column visible in `rally-08-releases.png` |
| Releases | mockup `IterationsPage.tsx:516` (`<select>` on Project) | `releases-detail-page.tsx:191-196` read-only `ProjectCell` | Release cannot be reassigned to another Project from detail |
| Milestones | mockup `IterationsPage.tsx:621-644` (Projects + Teams checkbox grids, pre-checked to current project) | `milestones-page.tsx:64-218` `MilestoneFormFields` has neither | Cross-project/team scope (a Milestone may span multiple Projects/Teams) is post-create only — two steps instead of one |
| Milestones | `rally-07-milestones.png` per-row pencil + trash; mockup `IterationsPage.tsx:671-673` dual "Create with details"/"Create" footer | `milestones-page.tsx:381-433,576-601` (no row-action column; delete via checkbox + bulk bar), `:295-303` single Create button vs `create-release-modal.tsx:144-168` dual | No quick per-row edit/delete; Milestone create is inconsistent with Release create inside the same app |
| Portfolio | mockup `PortfolioPage.tsx:27-39` order: rank, type, id, name, **release, state**, %done×2, project, team, owner | `pages/portfolio/model/columns.ts:53-97`: rank, id, name, **state, release**, … | State/Release transposed, plus the Type-in-ID-cell pattern |
| Portfolio | mockup `PortfolioPage.tsx:412` Feature-children = 10 columns incl. type | `model/children-columns.ts:36-83` = 12, no Type, adds TaskEst/ToDo/Actual | Additions are downstream-justified by the three-independent-hours rule; the Type drop is not |
| Capacity | mockup `CapacityPlanningPage.tsx:1265-1276` tail order …Dependencies, **Complete, Rollup, Estimated** | `pages/capacity-planning/model/columns.ts:172-252` …Dependencies, **Rollup, Estimated, Complete** (comment at `:156-159` claims Rally alignment) | Reordered against the BA mockup on an **unverified** real-Rally claim — no Capacity-tab screenshot exists to check it against |
| Settings gear | mockup `components/layout.tsx:160-166` (gear → dropdown); `RECONCILED_SOURCE_OF_TRUTH.md:75` ("Settings gear \| Workspace Settings, Project Management, Teams and User Management") | `app-shell.tsx:775-782` plain `<Link to="/settings">`; `/projects` only via the workspace switcher at `:558-565` | Project Management unreachable from the Settings gear, contradicting the SoT's own definition of the gear |
| Settings ▸ Teams | mockup `ProjectsPage.tsx:715` = Key, Team, Project, Status, Lead, Updated, Actions; `Phase 1/08` §5.2 / AC#2-3 / P1-DC-009 freezes it at Key, Team, Project, Status, Lead, Updated with **no Members column** | `pages/settings/ui/teams-tab.tsx:72-134` = Team, Lead, Members, Projects, Status, Created | No Key column; Project(1:1) → Projects(M2M); +Members; "Updated" → "Created". Unused i18n keys `teams.colKey/colProject/colUpdated` confirm the intended set |
| Invite/Edit User modal | `Phase 1/08` §6.3, USER-FR-007/008/010, AC#11 = Full name, Email, Workspace role, Status, Team membership | `members-tab.tsx:749-845` collects **email + role only**; invite body carries no `teamIds` (`:773-775`) | Three specified fields absent |
| Projects detail | mockup `ProjectsPage.tsx:677` vs `rally-17-projects.png` (Teams/Members reversed between the two) | `pages/projects/ui/project-parts.tsx:484-630` adds **End Date** | End Date is in neither design source; Teams/Members order matches the mockup, not the screenshot |
| Audit Log | `rally-16-audit.png` = Time, Actor, **Action**, Detail (4) | `pages/settings/ui/audit-log-tab.tsx:115-163` (3; `action` folded into a hover `title` at `:155`) | Real Rally exposes Action as a scannable column; here it is mouse-only — invisible to touch, keyboard and assistive tech |
| Notifications | mockup `NotificationsPage.tsx:27-31` (type-specific colored icon: assigned = purple Flag, mention = amber Hash); `CONVERSION_PROGRESS.md:65` (an `Icon/Hash` component was built for it) | `features/notifications/ui/notification-item.tsx:42-46` generic Circle/CircleDot; `showBadge` never passed from `notifications-page.tsx:124-131` | Assigned vs Mentions distinguishable only by reading the title text |

### 6.9 Accessibility — three gap classes already closed

No findings on icon-button labels, table semantics, or pointer-only sort/reorder. `shared/ui/icon-button.tsx:16` makes `aria-label` **required by the props type**; the grid-`div` / `aria-sort` rationale, the keyboard rank sensor and `EMPTY_VALUE` are all documented in `rally/CLAUDE.md`. The one remaining a11y-shaped issue is the Audit Log Action column above, which is a design gap first.

---

## 7. Items that need a BA ruling, not a commit

1. **Iteration Status board toggle** — `RECONCILED_SOURCE_OF_TRUTH.md:67,100` says list-only and puts the board in Future Backlog; the code comment claims it is "the BA-spec toggle". One of the two is wrong. Add a feature flag either way so the surface can be withdrawn.
2. **Rank reorder: drag vs ▲▼ buttons** — `Phase 5/01` §14/§37 and the mockup specify buttons-only on Backlog *and* Portfolio; both ship drag-and-drop, self-flagged in code as an unresolved divergence.
3. **Backlog column order** — the traceability doc (`:242`), the mockup (`:397-406`) and `rally-03b-backlog.png` give three different orders; the implementation matches none. There is no target to converge on.
4. **Backlog scope** — Unscheduled-only (`RECONCILED_SOURCE_OF_TRUTH.md:269`) vs "retains the same items" (`E2E_AGILE_LIFECYCLE_RECONCILIATION.md:144` and two E2E notes that **passed** the other way).
5. **Is the role scope dimension real?** §2.1/§2.2 mean it currently is not. Either the SPA gains a project-scoped assignment UI and both provisioning paths stop writing `scopeType:'workspace'`, or the SRS should be rewritten to say roles are workspace-global — but the docs say the opposite three times.
6. **`team` scope: build or drop?** (§2.7) Four `Phase 4/02` §3.2 rules and the "All Teams hidden from PM" rule depend on a scope tier the schema has no room for.
7. **E/R/D/H editable matrix vs fixed boolean roles** (§1.5) — the standing open decision from `2026-07-26-rbac-pbac-architecture.md` §6.
8. **Permission granularity** (§2.9, §2.10) — the SRS's one-code-per-row rule vs the shipped coarse `project:edit` / `work_item:edit`. Deciding this settles Release-assignment-by-PM at the same time.
9. **Settings ▸ Integrations / SCM** (§5.8) — an entire subsystem with zero SRS basis. Ratify or remove.
10. **`projects.status` needs `completed`?** (§3.4) The BA conflicts with itself across two docs.
11. **`portfolio_items.planned_start_date`** — free-text as specified, or a date column as built (§3.6).
12. **Ratify or reject the twelve invented authorization rules** in §2.11, and retire the stale rows in `mini_rally_usecase_role_mapping.md` so it stops contradicting `Phase 4/02`.
13. **Iterations list Project + Task Estimate columns** (§5.11) — the SRS requires them, the mockup includes them, `rally-05-timeboxes.png` omits them, and the DTO does not carry them.

---

## 8. Documentation work owed

1. Rewrite or close **DEV-013, DEV-015, DOC-002 and E2E-005** for the three-independent-hours model (§1.8). Also update the stale comment in `0052_task_actual_hours_manual.sql:5`.
2. Mark the **Reports / Release Tracking prohibitions** in `PHASE5_DEV_HANDOFF.md`, `PHASE5_TEST_SCENARIOS.md` and `Future_Backlog/02_Release_Planning.md` as superseded by the Phase 6 addendum (§1.9).
3. Close the **eleven DEV items** in §4.12 that the code has already fixed.
4. Retire the six-persona rows in `00_Documents/mini_rally_usecase_role_mapping.md`; they contradict `Phase 4/02` (§0).
5. Reconcile `Phase 4/02` §4's **~12 non-existent permission codes** and 8 renamed ones against `db/permissions.catalog.ts`.
6. Update `Phase 0/01_App_Shell` §4, which still lists `Portfolio > Release Planning (Coming Soon)` as Portfolio's only child and `Timeboxes > Iterations/Releases/Milestones` as a third nav level — both superseded (`RECONCILED_SOURCE_OF_TRUTH.md` §69-71, DEV-004).
7. Document the Preliminary Estimate config surface's actual location (§5.19), and rule on `01_DB design`'s status as reference-only.

---

## 9. Verified matching — audit coverage evidence

Recorded so the absence of a finding is distinguishable from the absence of a check.

**Data model.** Entity coverage is essentially complete: workspace/members/invitations/settings; users, auth sessions; roles and assignments; projects, project_members, project_teams; teams, team_members; workflow statuses and transitions; work_items; tasks; iterations; releases; milestones plus four link tables; portfolio_items; capacity plans + teams + allocations; member_capacity; work_item_relations; labels + work_item_labels; work_item_watchers; comments; attachments + storage.files; activity_logs; audit_logs; notifications + preferences. Cardinality confirmed for iteration (project-required, team-optional), task→work item (`ON DELETE CASCADE`), release↔milestone many-to-many, milestone multi-project/multi-team, Epic→Feature→Story/Defect, capacity plan uniqueness per (project, release), member_capacity uniqueness. Test Case / Test Run / Test Result correctly absent as post-MVP.

**Business flow, fully enforced.** Iteration requires Project, Team optional; assignment pickers include team-less iterations (`iteration.drizzle-repository.ts:137-143`); iteration defaults to `Planning`; assignment never auto-commits; `Committed` never locks scope; auto-accept never auto-reverses; new Story/Defect defaults Schedule = Flow = `idea`; the six-state catalog mirrors in both directions with every writer funnelled through one repository; parent auto-completes only when all children complete and is never downgraded from a maturer terminal; manual control survives auto-status; Task is always a child and never a Backlog row; a Task's Iteration is derived (refusal + trigger + cascade); zero/one Release and zero/many Milestones with Release changes never touching Milestones; Milestone Target = MIN/MAX of linked Releases, manual when unlinked, unchanged when the last link goes; Milestone may span multiple Projects/Teams; Release/Milestone/Iteration creatable in any order; Defect lifecycle separate and closed with reopen refused and delete forbidden; Iteration Status Add Item is Story/Defect only creating one shared record; all cross-project and team-mismatched references rejected through one funnel (`work-items.service.ts:1640-1679`).

**Authorization, correctly enforced (~60 use cases).** Login/logout/session and profile self-scoped; workspace edit/delete/settings WA-only; invite/resend/cancel/list invitations WA-only; remove member; assign/revoke role; permission catalogue and role-permission edit; canonical `workspace_admin` immutable with escalation-beyond-own-grants refused; audit log WA-only; project create/update/archive/restore/delete; project member management; `GET /projects` scoped by `listReadableProjectIds`; project members by path id; team writes WA-only; work-item list/backlog scoped from `query.projectId`; work-item create/edit/delete project-resolved; all 28 work-item sub-resource routes project-resolved; task ids resolved through the two-table fallback; the full iteration lifecycle; `POST /iterations/:id/work-items` correctly on `work_item:create`; release list/detail/activity/burndown/artifacts; all 14 milestone routes; all 5 report routes with cross-project refusal proven both directions; quality dashboard with PM denied; team status with PM denied; all 19 capacity-plan routes; portfolio detail/activity/children/features/comments/attachments; SCM connections/changesets on a work item; SCM installation/repository **writes**. Permissions are resolved from the DB on every check and never from the token; the cache degrades to the DB rather than failing open; BE↔FE catalogue parity is pinned by a spec; tier mis-scoping is a compile error.

**Scope and screens.** Nav order Home → Plan → Track → Quality → Portfolio → Reports with no top-level Releases and no Team Board; Timeboxes as one screen with a TYPE dropdown; Reports = exactly three types rendered one at a time; the entire Release Tracking phase (174 checkpoints — bucket exclusivity, single Chart Unit, persisted-snapshot burnup with persisted Ideal, Issues overlay, Breakdown correctly unexposed); all three report types' data strategies; Portfolio Items (Epic/Feature-only type selector, `filter not show item` for Team+Epic, four progress bars with correct denominators, Accepted-children meter, ≤5 child preview, root-checkbox bulk actions with named archive skips, Epic-archive-blocked-with-children, type-specific inline edit, no summary strip); Capacity Planning (uniqueness, immutable unit, Draft/Published read-only gate, both Publish variants with `release_span_mismatch` reporting, Revert without rollback, fixed allocation value + source label, Estimated tier precedence, split allocation, advisory-only exceed warnings, Breakdown on one shared scale); milestone target-date derivation; all status catalogs and transition graphs; roll-up invariants; Notification Center filters; Audit Log column set and sentence format; Team Status column set, member grouping and totals row; Backlog scope, controls, pagination and column persistence; Settings gear scoping with Project Settings and Labels correctly absent; rich-text sanitization; presign/confirm upload with signed downloads; append-only revision history with old/new diffs.

**UI/UX.** Timeboxes/Iterations list is the design-system reference implementation (full `ListPageScaffold` + `DataTableFrame` + `InlineEditableCell` + `DateField` + `SearchableSelect`, ~0 raw styles). Team Status matches `rally-18-team-status.png` closely and correctly prefers the screenshot's collapsed-by-default member groups over the mockup's expand-all. Iteration Status totals row computes Plan Est from scoped US/DE and Task Est/ToDo from child tasks, never `ToDo + Actual`. Tasks tab column set is identical across doc, mockup and code. Work-item detail tab structure matches the BA-approved three tabs. Backlog correctly has no KPI strip. The Schedule State segmented stepper matches both mockup and screenshot. Milestone Target Start/End render read-only with "Derived from linked Releases" on both create and detail. Release and Milestone state enums match `stateOptionsForType`. Portfolio Type×Team filter rule, Epic-has-no-Team/Release rendering, and all four progress bars are correct. Epic-children and capacity-plan-list column sets match the mockup exactly. Both Publish variants are implemented with an added skip/result report beyond the mockup. Quality column set, order and toolbar match both mockup and `rally-11-defects.png` exactly. Projects metric strip, Notifications tabs and empty state, and app-shell nav order are exact matches. Validation surfacing on the Iteration and Add-Item modals is *stronger* than the mockup's disable-only. `SettingsTabHeader` gives uniform heading treatment across every Settings tab, better discipline than the mockup's ad hoc headers.

---

## 10. Suggested execution order

Ranked by (production risk × cost to fix), not by severity label alone. **Revised after the Rally-parity pass** — §0.5 changed several items' shape and removed others.

1. **§2.1 + §2.2 provisioning scope**, plus the §2.12 test that asserts what scope a provisioning path writes. Everything else in authorization is masked or amplified by this. Per **N-9** this also needs a **data migration** for existing workspace-scoped rows — our model is strictly more permissive than Rally's, not merely unscoped.
2. **§2.3 + §2.4 + §2.5** — add the missing decorators, replace the synthesised `workspace:view` baseline, scope `GET /projects/health` and `GET /work-items/summary`. Roughly 10 route changes; the ratchet already tracks the count.
3. **§1.1 delete paths** — now the clearest fix in the document, because Rally documents the target behavior verbatim: unschedule the items in the same transaction, add the FK with `ON DELETE SET NULL`, clear `milestone_releases`. Simultaneously **drop the invented state gates** on iteration and release deletion. Add the delete-path tests that do not exist.
4. **§6.2 typed-name gates** — the component is written and unimported. Lowest cost in the document, unaffected by the Rally pass.
5. **§1.2 dates** — modal gate + `NOT NULL` migration, with a backfill plan for existing dateless rows. Keep the `End >= Start` CHECK but justify it as general correctness (**§0.5.3**), not parity.
6. **§4.2 parent roll-up** — recast from per-transition handlers to a **set recompute** (§0.5.3). One change fixes CREATE, DELETE and RE-PARENT and adds the missing all-Defined rule. Then §4.4's task-state coercion, by rejecting the three non-task values.
7. **§1.3 nav gates** and **§1.4 portfolio gate** — a handful of lines, immediately visible to users.
8. **§1.7 mirror trigger** + the `'idea'` default correction — follows the pattern already used four times.
9. **§4.3 iteration state** — remove the manual transition restrictions *and* the automatic accept, then add Rally's actual rule: an `Accepted` timebox rejects newly scheduled work (also for releases). Net-negative code.
10. **§4.6 Team Status bar** — delete the fabricated `actualHours / estimateHours` metric. Replace with estimate-vs-capacity if we build a capacity concept; otherwise ship raw columns and no bar.
11. **§5.5 / §5.6 artifact management** — add/remove from the Milestone and Release tabs. Confirmed P0 with a documented Rally analogue.
12. **N-1 milestone model** — collapse the derived Target Start/End window to one manual `target_date`, drop the `0097` triggers and the read-only-while-linked rule. Largest conceptual divergence in the audit; do it before more surfaces depend on the window. Hold the inverted "flag late artifacts" behavior until item 7 of §0.5.6 is verified.
13. **§4.10 Backlog scope** — filter to Unscheduled, plus the parent-story exclusion.
14. **§8 + §0.5 documentation** — now the largest single bucket: the eleven already-fixed DEV items, the four task-hours doc items to strike, the six SRS positions the Rally pass overturned, and the Connections tab to document as parity. Cheap, and it stops the next audit from re-reporting settled ground.
15. **§7 remaining BA decisions** (six of thirteen are now closed — see §0.5.5), then the §0.5.6 live-tenant probes.

**Net deletions this pass authorised** — worth noting because they reduce surface rather than adding it: the release progress bar/percent/burndown (§5.2), the Portfolio and Team Board KPI strips (§5.18), the iteration/release delete state gates (§1.1), the iteration auto-accept and manual-transition restrictions (§4.3), the Team Status hours bar (§4.6), bulk Copy (§0.5.2), the `0097` milestone triggers and `milestone_releases`/`milestone_teams` (N-1), and the task-Iteration DB trigger demoted to a service default (N-8).

---

## 11. Rally-parity research — source index

Five topic reports, each citing Broadcom TechDocs / Broadcom KB / Rally WSAPI + official SDK sources per claim, with evidence labelled *documented* / *inferred from API schema* / *community* / *no authoritative source found*. Findings are folded into §0.5; go to the files for the verbatim quotes and URLs.

| File | Covers |
|---|---|
| `research/RALLY_TIMEBOX_LIFECYCLE.md` | Iteration/release/milestone deletion and cascade, required dates and WSAPI nullability limits, the Milestone `TargetDate` model, timebox formatted IDs, iteration state transitions and auto-accept, Move vs Split carry-over |
| `research/RALLY_TASK_HOURS_MODEL.md` | `Task.Estimate` vs `ToDo`/`Actuals` (settles §1.8 with verbatim quotes), Estimate→ToDo copy, completion zeroing, story-level roll-ups and their storage, task↔parent state propagation and the Auto State Updates toggle, task Iteration, progress-percent semantics, `Actuals` vs `Time Spent` |
| `research/RALLY_PERMISSIONS_MODEL.md` | Permission tiers and role names, `ProjectPermission`/`WorkspacePermission` mechanics and the bottom-up implication, hierarchy inheritance, the absence of a team scope, Viewer/no-access, the absence of a per-action matrix, per-action gates |
| `research/RALLY_GRIDS_AND_NAV.md` | Backlog scope and the Team Planning split, Iteration Status list/board toggle, Team Board as flow-based, drag ranking plus toolbar actions and the sort precondition, Type-in-ID, default column sets, the filter builder and saved views, the anchored detail panel, nav structure, pagination, KPI strips. **Also the screenshot-provenance finding (§0.5.1).** |
| `research/RALLY_RELEASES_MILESTONES_DEFECTS.md` | Bidirectional artifact assignment and the Release Planning board, Milestone data model, the absence of release percent-done, Release fields and state, defect lifecycle incl. documented delete and reopen, required defect fields, generic Bulk Edit caps, portfolio hierarchy levels, the Connections tab as real Rally. Catalogues five internal Broadcom doc conflicts |

**Known limits of this research.** The Rally WSAPI object model at `rally1.rallydev.com/slm/doc/webservice/` is login-gated and has no Internet Archive capture, so **no per-field required/nullable claim is sourceable** — UI-required is documented, schema-non-null is not. Broadcom's public help is a user manual, not a spec: it is silent on most write-path edge cases (deletes, re-parents, recalculation timing), which is why §0.5.6 exists. Several answers rest on documented *silence* and are labelled as such rather than asserted.
