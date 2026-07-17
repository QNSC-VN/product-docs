# Mini Rally Reconciliation - Dev Handoff

Updated: 2026-07-15  
Branch: `Hieu_codex/phase-2-doc-reconciliation`  
Commit: `7e68304a docs: align agile phase handoff and testing`  
Audience: Dev team, QA/UAT, BA/Product owner

## 1. Purpose

This handoff summarizes what was reconciled in the Mini Rally BA documentation and mockup package so the dev team can continue implementation with a single source of truth.

The reconciliation commit does not implement backend, schema, database, or infrastructure changes. It aligns the business rules, Phase 2/3 scope, mockup expectations, testing pack, and out-of-scope guardrails for the current Agile management MVP.

## 2. Executive Summary

The commit turns the Phase 0-3 documentation into a dev-handoff-ready package:

- Phase 0 remains the completed foundation baseline.
- Phase 1 is BA/SRS ready for core work management.
- Phase 2 is BA/SRS ready and should be treated as production/dev review or gap-fixing, not as "not started".
- Phase 3 is ready for development handoff and covers Team Status, Release Management, Milestones, and Quality / Defect.
- Team Board is moved out of the current MVP and preserved only in Future Backlog.
- A dedicated `testing/` pack now covers Phase 0, Phase 1, Phase 2, Phase 3, E2E business flows, and traceability.

Core Agile flow for current MVP:

```text
Backlog
-> Timeboxes / Iterations
-> Iteration Status
-> Team Status
-> Release / Milestone / Quality tracking
```

Team Board is intentionally outside this current flow.

## 3. Files Changed In The Reconciliation Commit

### Mockup / FE alignment

```text
03_Mockup Design/src/app/pages/TeamStatusPage.tsx
03_Mockup Design/src/app/pages/WorkItemDetailPage.tsx
```

### Future Backlog

```text
04_Developement_tracking/Future_Backlog/01_Team_Board.md
```

### Phase 2

```text
04_Developement_tracking/Phase 2/02_Iterations/SRS.md
04_Developement_tracking/Phase 2/03_Iteration_Status/SRS.md
04_Developement_tracking/Phase 2/PHASE2_DEVELOPMENT_TRACKING.md
04_Developement_tracking/Phase 2/PHASE2_MOCKUP_CHECKLIST.md
```

### Phase 3

```text
04_Developement_tracking/Phase 3/01_Team_Status/SRS.md
04_Developement_tracking/Phase 3/02_Release_Management/SRS.md
04_Developement_tracking/Phase 3/03_Milestones/SRS.md
04_Developement_tracking/Phase 3/04_Quality_Defect/SRS.md
04_Developement_tracking/Phase 3/PHASE3_DEVELOPMENT_TRACKING.md
04_Developement_tracking/Phase 3/PHASE3_MOCKUP_CHECKLIST.md
```

### Project planning and continuity

```text
04_Developement_tracking/Project_developement_plan.md
Time line.md
CODEX_KNOWLEDGE.md
```

### Rally alignment evidence

```text
output/RALLY_MINI_RALLY_ALIGNMENT_GAP.md
output/RALLY_TEST_EXECUTION_2026-07-07.md
```

### Testing package

```text
testing/README.md
testing/TEST_STRATEGY.md
testing/PHASE0_TEST_SCENARIOS.md
testing/PHASE1_TEST_SCENARIOS.md
testing/PHASE2_TEST_SCENARIOS.md
testing/PHASE3_TEST_SCENARIOS.md
testing/E2E_BUSINESS_FLOW_COVERAGE.md
testing/TRACEABILITY_MATRIX.md
```

## 4. Confirmed Business Rules For Development

### 4.1 Iteration lifecycle

Iteration states:

```text
Planning -> Committed -> Accepted
```

Rules:

- New Iteration defaults to `Planning`.
- User manually changes Iteration to `Committed` when sprint scope is committed.
- Assigning US/DE work items to an Iteration does not automatically commit the Iteration.
- No lifecycle state locks scope by itself.
- Users can still add, remove, or move US/DE work items while an Iteration is running.
- When all assigned US/DE items are `Accepted`, the system may auto-set the Iteration to `Accepted`.
- Auto-accepted Iteration is a convenience behavior only. Authorized users can still manually change Iteration status.
- Empty Iteration must not auto-accept.
- If an item later moves out of `Accepted`, the system should not force a reverse status change. User manages status manually.

### 4.2 Task and parent US/DE completion

Task state values:

```text
Defined
In-Progress
Completed
```

Rules:

- Tasks are child records under Story/Defect.
- Task is not a standalone Backlog item.
- When one child Task is changed to `Completed`, system recalculates parent US/DE progress or roll-up.
- A single completed Task must not complete the parent US/DE if other child Tasks are still not `Completed`.
- When all child Tasks under the same parent Story/Defect are `Completed`, the system automatically updates that parent Story/Defect status to `Completed`.
- Auto-completion does not lock the parent US/DE. Authorized users can still manually change parent status from existing Work Item edit surfaces.

### 4.3 Task Dashboard inline edit

The Work Item Detail `Tasks` tab is treated as the Task Dashboard for the selected parent Story/Defect.

Authorized users can inline edit:

- Task Name
- Task State
- Owner
- To Do
- Actuals
- Estimate

Rules:

- Inline edits update the task row without forcing the user to open Task Detail.
- Viewer/read-only users can read but cannot inline edit.
- Clicking Task ID still opens Task Detail.
- Editing inline fields must not accidentally open Task Detail.

### 4.4 Team Status

Team Status is a dense execution dashboard grouped by owner/member. It is not a board.

Required behavior:

- Open from `Track > Team Status`.
- Uses the selected Project/Team context.
- Uses the same Iteration selector pattern as Iteration Status.
- Shows task-level rows, not parent Story/Defect rows in the ID column.
- ID column displays Task IDs such as `TA-404821`.
- Work Product column displays parent US/DE.
- Supports inline edit for member capacity, Task Name, and Task State.
- Viewer can read but cannot edit.
- No Team Board, drag/drop, WIP limits, or board transition rules in Phase 3.1.

### 4.5 Release Management

Release is Project-level.

Release state values:

```text
Planning
Active
Accepted
```

Confirmed rules:

- Release Management is Phase 3.2.
- Release appears as a Timebox type beside Iterations and Milestones.
- Create Release modal locks Type to `Release`.
- Timebox dashboard supports inline edit and resizable columns.
- Accepted Release can still be edited by authorized users.
- A Story/Defect can be assigned to only one active Release at a time.
- Reassigning a Story/Defect to another Release replaces the previous Release assignment.
- Release Artifacts are assigned Story/Defect work items shown with Backlog-style table behavior.
- Release readiness is user-managed from linked US/DE release notes and Release Notes.
- System does not calculate readiness in Phase 3.2.

### 4.6 Milestones

Milestone is a delivery checkpoint under `Plan > Timeboxes > Milestones`.

Confirmed rules:

- Milestone can link multiple Projects.
- Milestone can link multiple Teams.
- Milestone can link multiple Releases.
- Target Start Date is derived from the earliest linked Release start date.
- Target End Date is derived from the latest linked Release date.
- Target dates are read-only derived fields.
- Milestone Artifacts are assigned Story/Defect work items, not uploaded files or external links.
- Story/Defect can be linked to Milestone independently from Release assignment.
- Removing a Milestone artifact must not change Release or Iteration assignment.
- No readiness checklist in Phase 3.3.

### 4.7 Quality / Defect

Quality has a dedicated `Quality > Defect` dashboard.

Confirmed dashboard columns:

```text
Rank
ID
Name
User Story
Severity
Priority
State
Flow State
Fixed In Build
Iteration
Submitted By
Owner
```

Defect State values:

```text
Submitted
Open
Fixed
Closed
Closed Declined
```

Defect Flow State values:

```text
Idea
Defined
In-Progress
Completed
Accepted
Released
```

Rules:

- `Quality > Defect` uses the same Defect work items as Backlog.
- Quality is a dedicated defect view, not a separate defect source.
- Defect can be created from Backlog and from `Quality > Defect`.
- Linked User Story is optional.
- Backlog Defect and Quality Defect use the same Defect detail page.
- Defect dashboard supports inline edit across editable fields.
- Defect cannot be deleted in Phase 3. Use `Closed` or `Closed Declined`.
- Flow State updates independently from Defect State.
- `Fixed In Build` is an optional manual text field.
- Reopen from Closed/Closed Declined is deferred.
- Bulk actions are deferred and must not execute in Phase 3.4.

## 5. Out Of Scope / Guardrails

Do not implement these as part of the current Phase 3 handoff unless BA re-prioritizes:

- Team Board
- Board drag/drop
- WIP limits
- Board transition validation
- Dedicated carry-over workflow
- System-calculated Release readiness
- Milestone readiness checklist
- Milestone uploaded artifact/link objects
- Defect delete
- Defect reopen from Closed / Closed Declined
- Executable Quality bulk actions
- Phase 4 governance extras beyond separately confirmed scope
- Phase 5 reporting beyond separately confirmed scope

Team Board is preserved in:

```text
04_Developement_tracking/Future_Backlog/01_Team_Board.md
```

Treat that file as a future backlog note, not as a ready-for-development SRS.

## 6. Testing And Traceability

The reconciliation commit adds a dedicated testing package under:

```text
testing/
```

Dev and QA should start with:

```text
testing/README.md
testing/TEST_STRATEGY.md
testing/TRACEABILITY_MATRIX.md
testing/E2E_BUSINESS_FLOW_COVERAGE.md
```

Important E2E chains:

- Auth -> fixed Company -> Project create
- Project -> Team -> User -> Backlog
- Backlog Story/Defect -> Detail -> Task/Time/Activity
- Backlog item -> Iteration assignment -> Iteration Status
- Iteration Status Add Item -> Backlog visibility
- Team Status task roll-up
- Release artifact assignment
- Milestone artifact assignment
- Quality Defect lifecycle
- Future Backlog guard for Team Board

Missing Team Board must not fail Phase 3 testing because it is Future Backlog.

## 7. Recommended Dev Reading Order

1. `Time line.md`
2. `04_Developement_tracking/Project_developement_plan.md`
3. `04_Developement_tracking/Phase 2/02_Iterations/SRS.md`
4. `04_Developement_tracking/Phase 2/03_Iteration_Status/SRS.md`
5. `04_Developement_tracking/Phase 3/01_Team_Status/SRS.md`
6. `04_Developement_tracking/Phase 3/02_Release_Management/SRS.md`
7. `04_Developement_tracking/Phase 3/03_Milestones/SRS.md`
8. `04_Developement_tracking/Phase 3/04_Quality_Defect/SRS.md`
9. `04_Developement_tracking/Future_Backlog/01_Team_Board.md`
10. `testing/TRACEABILITY_MATRIX.md`
11. `testing/E2E_BUSINESS_FLOW_COVERAGE.md`

## 8. Recommended Implementation Sequence

### Step 1 - Stabilize Phase 2 assumptions

- Confirm Iteration assignment uses the same Work Item source of truth as Backlog.
- Confirm `Planning -> Committed -> Accepted` lifecycle.
- Confirm no scope lock on committed Iteration.
- Confirm Iteration Status reads assigned Work Items, not a separate execution store.

### Step 2 - Implement Phase 3.1 Team Status and Task Dashboard

- Build Team Status grouped by owner/member.
- Implement task state update and parent roll-up.
- Implement parent US/DE auto-completion only when all child Tasks are `Completed`.
- Preserve manual status override.
- Implement Task Dashboard inline edit in Work Item Detail `Tasks` tab.

### Step 3 - Implement Phase 3.2 Release Management

- Build Release list/create/detail.
- Enforce one active Release assignment per US/DE.
- Build Release Artifacts using Backlog-style table behavior.
- Keep Release readiness user-managed.

### Step 4 - Implement Phase 3.3 Milestones

- Build Milestone list/create/detail.
- Support multiple Projects, Teams, Releases.
- Derive target dates from linked Releases.
- Implement Milestone Artifacts as assigned US/DE work items.

### Step 5 - Implement Phase 3.4 Quality / Defect

- Build `Quality > Defect` dashboard.
- Use same Defect work item source as Backlog.
- Support create/edit/detail.
- Enforce confirmed State and Flow State behavior.
- Keep delete, reopen, and bulk actions deferred.

### Step 6 - Validate Against Testing Pack

- Run or map implementation against `testing/PHASE3_TEST_SCENARIOS.md`.
- Run cross-phase checks from `testing/E2E_BUSINESS_FLOW_COVERAGE.md`.
- Update `testing/TRACEABILITY_MATRIX.md` when implementation scope changes.

## 9. Handoff Notes / Risks

- This commit is a BA and documentation reconciliation commit, not a full production implementation commit.
- Existing Rally production may already cover some Phase 1/2 surfaces, so do not mark Phase 2 as "not started" without checking current production behavior.
- Keep the status split:

```text
BA/SRS READY
DEV IN REVIEW / GAP FIXING
```

- Do not introduce schema, DB, or infra assumptions from this handoff unless separately confirmed.
- User-facing status changes must remain manual-first. Auto-status behavior is allowed only as a convenience.
- Preserve Work Item identity when moving between Iterations, Releases, or Milestones.
- Do not clone US/DE records for assignment changes.

## 10. Definition Of Ready For Dev

This reconciliation package is ready for dev use when:

- Dev reads the Phase 3 SRS files and confirms scope.
- Dev uses the testing pack as acceptance/UAT reference.
- Team Board is explicitly excluded from current sprint scope.
- Any backend/schema gaps are raised separately instead of silently changing BA behavior.
- Manual-first lifecycle and user override rules are preserved.

## 11. Current Repo State Note

At the time this handoff was created, the reconciliation branch HEAD is:

```text
Hieu_codex/phase-2-doc-reconciliation @ 7e68304a
```

There may be local dirty/untracked files created after this commit. Those are not part of the reconciliation commit unless committed separately.
