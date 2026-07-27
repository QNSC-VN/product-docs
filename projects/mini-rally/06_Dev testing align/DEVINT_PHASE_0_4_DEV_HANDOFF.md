# DevInt Phase 0-4 Dev Fix Handoff

Date: 2026-07-24

Source tracker: `06_Dev testing align/DEVINT_PHASE_0_4_AUDIT_TRACKER.xlsx`

Scope: FE/business behavior, SRS/mockup alignment and controlled test data only. Do not treat this handoff as approval to change database schema, infrastructure, deployment setup or production data outside the tested DevInt scope.

## 1. Current package status

The current tracker contains 93 gap records.

| Status | Count | Dev action |
|---|---:|---|
| Still Open | 42 | Fix in current DevInt package |
| Partial (retest) | 3 | Fix remaining mismatch and request BA retest |
| Failed (retest) | 1 | Fix in current DevInt package |
| Blocked (test data) | 3 | Provide controlled test data, then BA retest |
| Blocked (test account) | 1 | Provide controlled role accounts, then BA retest |
| Future Backlog | 9 | Do not fix now unless BA reopens |
| Deferred (not tested) | 1 | Retest later when flow is delivered |
| Fixed/Passed/BA update | 33 | No current dev action |

Current dev fix package = 46 actionable records: 42 Still Open + 3 Partial + 1 Failed.

Blocked verification dependencies = 4 records: 3 notification-data blockers + 1 role-account blocker.

## 2. Latest BA rules that supersede older tracker text

Use these rules if the tracker recommendation text conflicts with the latest BA-confirmed SRS/mockup alignment.

### Authentication

- Internal login is Microsoft SSO-first.
- Local password, forgot/reset/change-password and remember-me are Future Backlog unless BA reopens local authentication.
- Dev should only fix authentication if an authorized SSO user cannot enter through the approved SSO path or error handling is unclear.

### Project / Team scope

- Project is required.
- Team is optional.
- Blank Team means the Work Item or Iteration belongs to the Project backlog / Project-level scope.
- Selected Team means the Work Item or Iteration belongs to that Team scope.
- Team options must be filtered by the selected Project.
- Do not implement old "No team is invalid" guidance. The latest rule is: blank Team is valid Project backlog.

### Work Item states

- Work Item status catalog is exactly: `Idea`, `Defined`, `In-Progress`, `Completed`, `Accepted`, `Release`.
- Schedule State = six-box segmented control.
- Flow State = dropdown.
- Schedule State and Flow State mirror the same value in the current baseline.
- Defect still has Defect State separately; Defect State does not replace Schedule/Flow State.

### Task states and estimates

- Task has one Task State only: `Defined`, `In-Progress`, `Completed`.
- Task must not expose Work Item Schedule State / Flow State.
- Task Estimate is derived and read-only: `Estimate = To Do + Actual`.
- Completing a Task must not force To Do to zero.
- If all child Tasks are Completed, parent US/DE auto-moves to `Completed`.
- If an incomplete/reopened Task exists under a completed parent, parent US/DE auto-moves back to `In-Progress`, unless BA later defines an Accepted protection exception.

### Iteration

- Iteration states are `Planning`, `Committed`, `Accepted`; default is `Planning`.
- User can manually change Iteration state.
- Assigning US/DE to Iteration does not auto-commit.
- No lock: users can add/remove/move US/DE in any Iteration state.
- If a non-empty Iteration has all assigned US/DE as `Accepted`, system may auto-set Iteration to `Accepted`.
- Auto-Accept is convenience only and must not remove manual control.

### Release / Milestone

- Release Management belongs under `Plan > Timeboxes > Releases`, not top-level navigation.
- Portfolio contains Release Planning as Phase 5/Future placeholder, not Release CRUD.
- Release progress/tracking belongs to Phase 5 Release Planning, not the current Phase 3 Release detail.
- Work Item can have multiple Releases and multiple Milestones.
- Release and Milestone are separate concepts; one does not parent the other.
- Milestone date is derived from linked Releases:
  - Start = earliest linked Release start date.
  - End = latest linked Release end date.

## 3. P0 fix list

These block BA acceptance first.

| Gap ID | Phase | Area | Dev fix expected |
|---|---|---|---|
| GAP-P1-USER-004 | Phase 4 | Roles & Permissions | Replace legacy/persona roles with approved roles: Workspace Admin, Project Admin, Project Member. Implement screen/action E/R/D/H matrix. Workspace Admin column locked; only allowed cells editable. |
| GAP-P1-CREATE-003 | Phase 1 | Work Item Create | Project drives Team options. Team is optional: blank = Project backlog, selected Team = Team backlog. Remove invalid/unlinked Team choices. |
| GAP-P1-CREATE-008 | Phase 1 | Work Item Create | New Work Item must default Schedule State and Flow State to `Idea`. Preserve verified persistence for other fields. |
| GAP-P1-WID-003 | Phase 1 | Work Item Detail | Release field must support zero/one/many Releases, not single-select only. |
| GAP-P1-WID-006 | Phase 1 | Work Item Detail | Schedule State and Flow State must mirror two-way and persist atomically. |
| GAP-P1-WID-008 | Phase 1 | Work Item Detail | Apply latest Team optional rule: blank Team = Project backlog; selected Team must belong to selected Project. |
| GAP-P1-TASK-006 | Phase 1 | Task Dashboard | Task Dashboard labels/catalog must be `Defined`, `In-Progress`, `Completed`; keep inline edit behavior. |
| GAP-P1-TEAM-001 | Phase 1 | Create Team | Team Lead is optional. `No lead`/null must be accepted on Team create; lead can be assigned later. |
| GAP-P3-REL-002 | Phase 3 | Release Artifacts | Fix Release Artifacts query/display so Work Items assigned to a Release appear after refresh. Blocks reassignment-refresh testing. |
| GAP-P3-MS-001 | Phase 3 | Milestone Artifacts | Add Artifact control must exist on Milestone Artifacts tab following approved Backlog picker pattern. |
| GAP-P3-QA-001 | Phase 3 | Quality / Defect | Fix Quality > Defects create flow. Current DevInt returns 405 and creates no defect. |
| GAP-P4-RBAC-002 | Phase 4 | User Management | Workspace Admin account detail must be read-only; remove Save and block role/team/status mutations at UI and API boundary. |
| GAP-P4-SET-002 | Phase 4 | User Management | Align list/detail with SRS/mockup: approved three roles, required fields/columns, team allocation in detail, guarded Remove User Access. |

## 4. P1 fix list

These should be fixed in the same delivery package after P0.

| Gap ID | Phase | Area | Dev fix expected |
|---|---|---|---|
| GAP-P0-AUTH-001 | Phase 0 | Login | Confirm SSO-first behavior. If authorized SSO path works, align implementation/error handling to SSO-first and ignore old local-password requirement. |
| GAP-P0-SHELL-002 | Phase 0 | Navigation | Portfolio becomes dropdown with Release Planning as Phase 5/Coming Soon. Do not expose Release CRUD under Portfolio. |
| GAP-P0-PRJ-004 | Phase 0 | Create Project | Project Name validation: trim and enforce 2-255 chars with inline feedback. |
| GAP-P0-PRJ-005 | Phase 0 | Create Project | Project Key helper/validation must say and enforce 2-10 uppercase alphanumeric; key remains immutable after create. |
| GAP-P1-BL-001 | Phase 1 | Backlog Search | Clearing search must restore the scoped list without page reload. Cover Control+A/Delete, Backspace, blur and clear button if present. |
| GAP-P1-BL-002 | Phase 1 | Backlog Filters | Add Priority filter with approved values and combined-filter behavior. |
| GAP-P1-BL-004 | Phase 1 | Backlog Sort | Header sort must work for approved sortable columns, not only Rank controls. |
| GAP-P1-CREATE-006 | Phase 1 | Work Item Create | Owner defaults to authenticated user; Unassigned remains explicit selectable option; named options filtered by project/team access. |
| GAP-P1-WID-001 | Phase 1 | Work Item Detail | Align Phase 1 US/DE Detail tabs to mockup/SRS. Remove extra Defects tab from current Phase 1 scope; Linked Items/Comments need BA/Future scope unless separately approved. |
| GAP-P1-WID-007 | Phase 1 | Work Item Detail | Keep Unassigned option, but new Work Item owner default must be authenticated user; apply same rule to quick-create and detail. |
| GAP-P1-TASK-005 | Phase 1 | Create Task | Add Create with details; navigate to created Task Detail without duplicate record. |
| GAP-P1-TASK-007 | Phase 1 | Create Task | Task Owner defaults to authenticated user; Unassigned remains explicit selectable option because Task owner is not required. |
| GAP-P1-CREATE-009 | Phase 1 | Work Item Create | Default Schedule State and Flow State to `Idea` in quick-create and create-with-details. |
| GAP-P1-HIST-002 | Phase 1 | Task Revision History | Log task create/state/time changes and show them in Task Revision History. |
| GAP-P2-IT-001 | Phase 2 | Timeboxes / Iterations | Add Project and Task Estimate columns to Iterations list. |
| GAP-P2-BL-001 | Phase 2 | Backlog Bulk Actions | Add bulk Assign Release and Assign Iteration. Ask BA before keeping Delete/Copy in selected bar. |
| GAP-P4-SET-003 | Phase 4 | Audit Log | Keep filters/columns, but exclude auth/session activity from administrative Audit Log or move to security log. Event copy should be business-readable with actor and changed values. |
| GAP-P4-SET-004 | Phase 4 | Destructive Confirmations | Add explicit Deactivate/Restore Team confirmations and Remove User Access typed confirmation. Cancel must not mutate. |

## 5. P2 / P3 polish and scope fixes

| Gap ID | Phase | Area | Dev fix expected |
|---|---|---|---|
| GAP-P0-SHELL-004 | Phase 0 | Navigation | Rename Track child from `Iteration` to `Iteration Status`. |
| GAP-P1-HIST-001 | Phase 1 | Work Item Revision History | Log Schedule and Flow changes with correct labels; avoid duplicate rows for one mutation. |
| GAP-P2-IS-003 | Phase 2 | Iteration Status | Add Type column. Reconcile extra columns against approved contract or make them Show Fields opt-in. |
| GAP-P2-IS-004 | Phase 2 | Iteration Status | Remove per-row Defects column; Defects remains summary metric only. |
| GAP-P2-IS-005 | Phase 2 | Iteration Status | Hide Board toggle until Board scope is approved; Board remains Future Backlog. |
| GAP-P3-TS-001 | Phase 3 | Team Status | Remove local Search tasks input unless BA approves deviation. |
| GAP-P3-TS-002 | Phase 3 | Team Status | Remove Filters/Show Fields/pagination unless BA approves deviation. |
| GAP-P3-TS-003 | Phase 3 | Team Status | Breadcrumb should be `[Project] > Track > Team Status`. |
| GAP-P3-TS-004 | Phase 3 | Team Status | Reopened/incomplete child Task should recalc parent according to latest Task roll-up rule. If parent is Accepted, ask BA before introducing protection behavior. |
| GAP-P3-TS-005 | Phase 3 | Team Status | Task State control should match approved dropdown, or at minimum display all labels clearly. |
| GAP-P3-TS-006 | Phase 3 | Team Status | Missing Estimate/To Do/Actual should display `0`, not dash. |
| GAP-P3-TS-007 | Phase 3 | Team Status | Labels must be `Defined`, `In-Progress`, `Completed`. |
| GAP-P3-REL-001 | Phase 3 | Release Detail | Remove Burndown/Release Progress widget from Phase 3 Release detail; defer to Phase 5 Release Planning. |
| GAP-P4-SET-001 | Phase 4 | Workspace Settings | Add read-only single-company scope value, or BA documentation must explicitly remove the field. |
| GAP-P4-SET-005 | Phase 4 | Settings Navigation | Remove Notification Preferences from delivered Phase 4 navigation or mark as Future Backlog only. |

## 6. Blocked verification dependencies

These are not current product failures until dev/test provides the required controlled data/accounts.

| Gap ID | Phase | Blocker | Dev/test action |
|---|---|---|---|
| GAP-P4-NOTIF-001 | Phase 4 | No controlled notification rows for audit user | Seed assignment/mention notifications or provide safe sender/recipient pair; then retest count, cards and filters. |
| GAP-P4-NOTIF-002 | Phase 4 | No controlled notification rows for read-state testing | After rows exist, retest single-read, mark-all, badge/count update, reload persistence and session restore. |
| GAP-P4-NOTIF-003 | Phase 4 | No safe recipient/sender test pair | Provide dedicated Project Member recipient and sender in test Project; retest popup/list/route/permission filtering. |
| GAP-P4-RBAC-003 | Phase 4 | No controlled non-admin test accounts | Provide Project Admin and Project Member accounts with explicit managed/assigned Project/Team mappings and one unassigned Project for negative tests. |

## 7. Future Backlog / do not fix now

BA confirmed these are not part of the current dev fix package:

- `GAP-P0-SHELL-006` — Functional Global Search.
- `GAP-P0-WS-002` — Workspace rename docs/mockup alignment only.
- `GAP-P0-PRJ-001` — Project screen label/admin naming cleanup.
- `GAP-P0-PRJ-008` — Archived Project edit affordance cleanup.
- `GAP-P0-PRJ-009` — Restore confirmation behavior.
- `GAP-P0-PRJ-010` — Archive confirmation mockup/docs parity.
- `GAP-P1-BL-006` — Configurable filter model / Manage Filters expansion.
- `GAP-P1-BL-008` — Rank persistence under additional team-scope retest.
- `GAP-P1-CREATE-001` — Quick-create Cancel regression.

Deferred:

- `GAP-P1-USER-006` — Invite flow is dev-designed and deferred. Retest later for validation, delivery, invited status, resend/expire behavior if in scope.

## 8. Retest order after dev fixes

1. P0 current fix list.
2. P1 current fix list.
3. Blocked Phase 4 tests after dev/test provides controlled data/accounts.
4. Canonical Agile flow:
   - Create Project/Team context as needed.
   - Create Iteration under Timeboxes.
   - Create Release and Milestone under Timeboxes.
   - Create Backlog Work Item.
   - Assign Work Item to Iteration.
   - Create Tasks under Work Item.
   - Complete/reopen Tasks.
   - Verify parent Work Item status/progress.
   - Verify Iteration Status metrics/totals.
   - Verify Release/Milestone artifact reflection where Phase 3 scope applies.

## 9. Dev references

- Tracker: `06_Dev testing align/DEVINT_PHASE_0_4_AUDIT_TRACKER.xlsx`
- Audit README: `06_Dev testing align/README.md`
- Retest plan: `06_Dev testing align/RETEST_PLAN.md`
- Phase 0-4 SRS source: `04_Developement_tracking/`
- Business test pack: `07_Test Business/specs/`
- Latest mockup source: `03_Mockup Design/src/app/`

When in doubt, the latest BA-confirmed rule in this handoff and updated SRS/mockup wins over older tracker recommendation wording.
