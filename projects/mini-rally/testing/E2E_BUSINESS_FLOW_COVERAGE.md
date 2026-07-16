# E2E Business Flow Coverage

This file captures cross-phase flows. These are the tests that best prove the product is going in the right direction.

## E2E-001 - Admin creates project foundation

| Field | Value |
|---|---|
| Phases | Phase 0 |
| Priority | P0 |
| Actor | Workspace Admin |
| Preconditions | Admin can login; fixed Company is provisioned |

### Steps

1. Login as Workspace Admin.
2. Confirm Company context is fixed and Workspace create/switch is not available.
3. Open Projects.
4. Create Project with unique key.
5. Search created Project.
6. Attempt duplicate key.
7. Edit Project and confirm Project Key is immutable.
8. Logout.

### Expected result

- Project is created and searchable.
- Duplicate/invalid key is rejected.
- Project Key cannot be edited.
- Protected routes require login after logout.

## E2E-002 - Admin prepares team and user for work management

| Field | Value |
|---|---|
| Phases | Phase 1 |
| Priority | P0 |
| Actor | Workspace Admin |
| Preconditions | At least one Project exists |

### Steps

1. Open Manage.
2. Create Team under Project.
3. Add or invite User with role and Team membership.
4. Select Project/Team in global context.
5. Open Backlog.

### Expected result

- Team is available under the correct Project.
- User project access derives from Team membership.
- Selected Project/Team context is usable by Backlog.

## E2E-003 - Create Story and manage detail

| Field | Value |
|---|---|
| Phases | Phase 1 |
| Priority | P0 |
| Actor | Workspace Admin / Product Owner |
| Preconditions | Project/Team context exists |

### Steps

1. Open Backlog under selected Project/Team.
2. Create Story.
3. Open Story detail.
4. Update Description, Owner, Schedule State, Flow State and Plan Estimate.
5. Add Notes and Release Notes if enabled.
6. Upload attachment.
7. Refresh detail.
8. Open Activity/Revision History.

### Expected result

- Story is created in correct Project/Team.
- Detail updates persist after refresh.
- Rich text is sanitized.
- Attachment appears and can be downloaded/deleted where permitted.
- Activity/Revision History records key changes.

## E2E-004 - Create Defect and verify defect-specific behavior

| Field | Value |
|---|---|
| Phases | Phase 1 |
| Priority | P0 |
| Actor | Workspace Admin / QA |
| Preconditions | Project/Team context exists |

### Steps

1. Open Backlog.
2. Create Defect.
3. Set Priority.
4. Compare Defect and Story rows/details.
5. Update Defect state and owner.

### Expected result

- Defect is created in Backlog.
- Priority applies to Defect behavior.
- Story does not incorrectly require/display Defect-only priority behavior.
- Changes create activity records.

## E2E-005 - Add Task under Story and track time

| Field | Value |
|---|---|
| Phases | Phase 1 |
| Priority | P0 |
| Actor | Workspace Admin / Developer |
| Preconditions | Story exists |

### Steps

1. Open Story detail.
2. Open Tasks tab.
3. Add Task with owner and estimate.
4. Update To Do and Actual.
5. Open Task Detail.
6. Review Revision History.

### Expected result

- Task is child of Story, not an independent Backlog item.
- Task time values persist and totals update.
- Actual can exceed Estimate in Phase 1.
- Task Detail has Details and Revision History, not Tasks tab.

## E2E-006 - Backlog item enters Iteration and appears in Iteration Status

| Field | Value |
|---|---|
| Phases | Phase 1 + Phase 2 |
| Priority | P0 |
| Actor | Workspace Admin / Scrum Master |
| Preconditions | Project/Team, Story/Defect and Iteration exist |

### Steps

1. Select Project/Team context.
2. Open Timeboxes and create Iteration for that context.
3. Open Backlog.
4. Assign existing Story/Defect to the Iteration.
5. Open Track -> Iteration Status.
6. Select the same Iteration.
7. Open item row detail.

### Expected result

- Iteration is valid for selected Project/Team.
- Work Item `iterationId` is updated.
- Iteration Status shows that same Work Item from Backlog source.
- Row click opens same Work Item Detail.

## E2E-007 - Create item directly in Iteration Status

| Field | Value |
|---|---|
| Phases | Phase 2 |
| Priority | P0 |
| Actor | Workspace Admin / Scrum Master |
| Preconditions | Selected Project/Team has an Iteration |

### Steps

1. Open Iteration Status.
2. Select Iteration.
3. Click Add Item.
4. Create Story or Defect.
5. Verify item appears in Iteration Status.
6. Open Backlog for same Project/Team.
7. Search the newly created item.

### Expected result

- Add Item supports Story/Defect only.
- New item is created directly in selected Iteration.
- Same item exists in Backlog; no duplicate store is created.

## E2E-008 - Context isolation regression

| Field | Value |
|---|---|
| Phases | Phase 0 + Phase 1 + Phase 2 |
| Priority | P0 |
| Actor | Workspace Admin / Viewer |
| Preconditions | At least two Projects or Teams with distinct data |

### Steps

1. Select Project A / Team A.
2. Capture Backlog items, Iterations and Iteration Status selector.
3. Switch to Project B / Team B.
4. Reopen or refresh Backlog, Timeboxes and Iteration Status.
5. Try direct URL to data from Project A while context/user should not access it.

### Expected result

- Project A data does not leak into Project B views.
- Lists and selectors reload after context change.
- Direct unauthorized access returns Access Denied or API rejection.

## E2E-009 - Read-only user behavior

| Field | Value |
|---|---|
| Phases | Phase 0 + Phase 1 + Phase 2 |
| Priority | P1 |
| Actor | Viewer |
| Preconditions | Viewer/read-only account exists |

### Steps

1. Login as Viewer.
2. Open Project list, Backlog, Work Item Detail, Timeboxes and Iteration Status.
3. Try create/edit/archive/assign operations from UI.
4. If possible, call direct mutation endpoint with Viewer session.

### Expected result

- Viewer can view permitted data.
- Create/edit controls are hidden or disabled.
- Backend rejects direct mutation.

## E2E-010 - Deferred scope guard

| Field | Value |
|---|---|
| Phases | Phase 1 + Phase 2 |
| Priority | P1 |
| Actor | BA / Workspace Admin |
| Preconditions | App navigation available |

### Steps

1. Inspect Backlog create type options.
2. Inspect Timeboxes type options.
3. Inspect Track navigation.
4. Inspect Release/Milestone/Team Status routes if visible.
5. Inspect Team Board only as a Future Backlog placeholder if visible.

### Expected result

- Backlog create supports Story/Defect only in Phase 1/2.
- Timeboxes Phase 2 shows Iterations only.
- Team Status, Release Management, Milestones and Quality/Defect are Phase 3 scope, not required for Phase 2 acceptance.
- Team Board is Future Backlog and is not required for Phase 2 or Phase 3 acceptance.

## E2E-011 - Team Status completes parent when all child Tasks complete

| Field | Value |
|---|---|
| Phases | Phase 1 + Phase 2 + Phase 3 |
| Priority | P0 |
| Actor | Workspace Admin / Scrum Master / Developer |
| Preconditions | Story/Defect is assigned to an Iteration and has at least two child Tasks |

### Steps

1. Open `Track -> Team Status`.
2. Select the Iteration containing the Story/Defect.
3. Complete only one child Task.
4. Verify parent Story/Defect status.
5. Complete all remaining child Tasks under the same parent.
6. Reopen parent Work Item Detail.

### Expected result

- Partial Task completion does not auto-complete parent Story/Defect.
- When all child Tasks are `Completed`, parent Story/Defect auto-completes to `Completed`.
- Parent identity, Iteration assignment, rank, comments and history are preserved.

## E2E-012 - Manual status control remains after auto status update

| Field | Value |
|---|---|
| Phases | Phase 2 + Phase 3 |
| Priority | P0 |
| Actor | Workspace Admin / Product Owner |
| Preconditions | Story/Defect and Iteration have been auto-updated by completion rules |

### Steps

1. Complete all Tasks under a Story/Defect and confirm parent auto-completes.
2. Open parent Work Item Detail.
3. Manually change parent Schedule State to another valid value.
4. Manually change assigned Iteration status if permitted.
5. Accept all Story/Defect items assigned to an Iteration.
6. Verify Iteration status.

### Expected result

- Auto-complete is convenience behavior only.
- Authorized user can manually change parent Story/Defect status after auto-complete.
- When all assigned Story/Defect items are `Accepted`, system may auto-set Iteration to `Accepted`.
- User can still manually change Iteration status if permitted.
- No scope lock or dedicated carry-over workflow appears.

## E2E-013 - Release artifact assignment uses existing Work Items

| Field | Value |
|---|---|
| Phases | Phase 2 + Phase 3 |
| Priority | P0 |
| Actor | Workspace Admin / Release Owner |
| Preconditions | At least two Releases and one Story/Defect exist |

### Steps

1. Open `Plan -> Timeboxes -> Releases`.
2. Create or open Release A and Release B.
3. Assign an existing Story/Defect to Release A.
4. Open Release A Artifacts.
5. Reassign the same Story/Defect to Release B.
6. Refresh Release A and Release B artifact lists.

### Expected result

- Release Artifacts list shows existing Story/Defect work items; no clone is created.
- A Story/Defect has only one active Release assignment.
- Reassignment removes the item from Release A and shows it under Release B.
- Release counters/roll-ups refresh and user receives success/error feedback.
- Release readiness is not system-calculated in Phase 3.2.

## E2E-014 - Milestone artifact assignment is independent from Release assignment

| Field | Value |
|---|---|
| Phases | Phase 3 |
| Priority | P0 |
| Actor | Workspace Admin / Delivery Owner |
| Preconditions | Milestone, Release and Story/Defect test data exist |

### Steps

1. Open `Plan -> Timeboxes -> Milestones`.
2. Create or open a Milestone.
3. Link multiple Projects/Teams/Releases where permitted.
4. Assign a valid Story/Defect as Milestone artifact.
5. Remove the Story/Defect from the Milestone.
6. Check the Story/Defect Release and Iteration assignment.

### Expected result

- Milestone can hold multiple Projects/Teams/Releases.
- Target dates are derived and read-only from linked Releases.
- Milestone Artifacts are assigned Story/Defect work items using Backlog-style presentation.
- Adding/removing Milestone artifacts does not mutate Release assignment, Iteration assignment, Backlog rank or Work Item identity.
- Artifact outside Milestone Project/Team scope is rejected.

## E2E-015 - Quality Defect lifecycle shares Backlog source

| Field | Value |
|---|---|
| Phases | Phase 1 + Phase 3 |
| Priority | P0 |
| Actor | Workspace Admin / QA |
| Preconditions | Project/Team context exists |

### Steps

1. Open `Quality -> Defect`.
2. Create a Defect without User Story.
3. Edit Severity, Priority, State, Flow State, Fixed In Build and Owner.
4. Open the same Defect from Backlog.
5. Move State through Submitted -> Open -> Fixed -> Closed.
6. Try delete or reopen behavior if visible.

### Expected result

- Quality Defect and Backlog Defect are the same Work Item.
- User Story is optional.
- Fixed In Build is optional manual text.
- Valid state transitions work.
- Delete is unavailable/rejected; reopen from Closed/Closed Declined is deferred unless BA later confirms rules.

## E2E-016 - Future Backlog guard for Team Board

| Field | Value |
|---|---|
| Phases | Phase 3 + Future Backlog |
| Priority | P1 |
| Actor | BA / Workspace Admin |
| Preconditions | App navigation available |

### Steps

1. Inspect Track navigation.
2. Inspect Phase 3 documentation and test pack scope.
3. If Team Board menu is visible, open or inspect its placeholder behavior.
4. Review `Future_Backlog/01_Team_Board.md`.

### Expected result

- Team Board is not required for Phase 3 acceptance.
- Board drag/drop, WIP limits and board transition rules are not current MVP requirements.
- If visible, Team Board is treated as placeholder/future only.
- Future Team Board notes preserve direction without creating development obligation.
