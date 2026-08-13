# E2E Business Flow Coverage

This file captures cross-phase flows. These are the tests that best prove the product is going in the right direction.

## E2E-001 - Workspace Admin creates project foundation

| Field | Value |
|---|---|
| Phases | Phase 0 |
| Priority | P0 |
| Actor | Workspace Admin |
| Preconditions | Admin can login; fixed Company is provisioned |

### Steps

1. Login as Workspace Admin.
2. Confirm Company context is fixed and Workspace create/switch is not available.
3. Open Settings > Workspaces & Projects.
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

## E2E-002 - Workspace Admin prepares Team and Project access

| Field | Value |
|---|---|
| Phases | Phase 1 |
| Priority | P0 |
| Actor | Workspace Admin |
| Preconditions | At least one Project exists |

### Steps

1. Open Settings > Workspaces & Projects.
2. Create Team under a Project and select one existing user as Editor.
3. Add another existing user to the Project as Admin.
4. Open Settings > Users and inspect both users' Project Access.
5. Sign in as the Editor and select the assigned Project/Team.
6. Open Backlog.

### Expected result

- Team is available under the correct Project.
- Editor Project Access contains the selected Team; Admin shows All Teams.
- User Details and Project Users & Permissions show the same assignments.
- Selected Project/Team context is usable by Backlog.

## E2E-003 - Create Story and manage detail

| Field | Value |
|---|---|
| Phases | Phase 1 |
| Priority | P0 |
| Actor | Workspace Admin / Admin / Editor in assigned scope |
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
| Actor | Workspace Admin / Admin / Editor in assigned scope |
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
| Actor | Workspace Admin / Admin / Editor in assigned Team |
| Preconditions | Story exists |

### Steps

1. Open Story detail.
2. Open Tasks tab.
3. Add Task with owner, To Do and Actual.
4. Update To Do and Actual.
5. Open Task Detail.
6. Review Revision History.

### Expected result

- Task is child of Story, not an independent Backlog item.
- Task time values persist and totals update.
- Estimate is derived/read-only and equals To Do + Actual.
- Completing a Task does not automatically zero To Do.
- Task Detail has Details and Revision History, not Tasks tab.

## E2E-006 - Backlog item enters Iteration and appears in Iteration Status

| Field | Value |
|---|---|
| Phases | Phase 1 + Phase 2 |
| Priority | P0 |
| Actor | Workspace Admin/Admin creates Iteration; Admin/Editor assigns Work Item |
| Preconditions | Assigned Project/Team, Story/Defect and Iteration exist |

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
| Actor | Workspace Admin / Admin / Editor in assigned Team |
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
| Actor | Normal user with different Access Levels across Projects |
| Preconditions | Project A is accessible; Project B is No Access; Teams have distinct data |

### Steps

1. Select Project A / Team A.
2. Capture Backlog items, Iterations and Iteration Status selector.
3. Confirm Project B/Team B is absent from navigation and selectors.
4. Try direct URL to Project B and one of its Work Items.
5. Change Project B to Editor (with a Team) as Workspace Admin, make a new request and reopen it.

### Expected result

- No Access Project/Team/data does not leak through lists, search or selectors.
- Direct unauthorized access returns safe Access Denied/Not Found without metadata.
- After the user's next request, Editor can read Project B and work within assigned Teams.

## E2E-009 - Access in one Project does not grant another Project

| Field | Value |
|---|---|
| Phases | Phase 0 + Phase 1 + Phase 2 |
| Priority | P1 |
| Actor | Normal user |
| Preconditions | User is Admin in Project A and No Access in Project B |

### Steps

1. Login as the test user.
2. In Project A, verify delivery management and All Teams.
3. Confirm Project/Team/access structural controls remain unavailable.
4. Search/select/navigate directly to Project B data.
5. If possible, call a direct Project B read and mutation endpoint with that session.

### Expected result

- Project A Admin access does not reveal Project B.
- Project B direct access is denied safely for both reads and mutations.
- Project A structural Project/Team/access controls remain WA-only.

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
| Actor | Workspace Admin / Admin in assigned Project |
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
- Reopening a Task after that all-completed state recalculates metrics and auto-moves the parent Story/Defect to `In-Progress`.
- Parent identity, Iteration assignment, rank, comments and history are preserved.

## E2E-012 - Manual status control remains after auto status update

| Field | Value |
|---|---|
| Phases | Phase 2 + Phase 3 |
| Priority | P0 |
| Actor | Workspace Admin / Admin in assigned Project |
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

## E2E-014 - Release/Milestone relations and Work Item assignment stay independent

| Field | Value |
|---|---|
| Phases | Phase 3 |
| Priority | P0 |
| Actor | Workspace Admin / Delivery Owner |
| Preconditions | At least two Releases, two Milestones and one Story/Defect exist |

### Steps

1. Create Releases and Milestones in either order.
2. Link multiple Releases to one Milestone and verify derived dates.
3. Assign one Release and two valid Milestones to a Story/Defect.
4. Change the Work Item Release and inspect the Milestone multi-select.
5. Remove only one Milestone relation.
6. Check the remaining Milestone, Release, Iteration, Tasks, status and Work Item identity.

### Expected result

- Release and Milestone do not own each other; their link is many-to-many and creation order is irrelevant.
- With no linked Release, Milestone Target dates are user-managed; with linked Releases, dates are derived and read-only from the Release window.
- One Work Item supports zero/one Release and zero/many Milestones.
- Existing Milestone selections survive Release change; only add-new options are filtered to Milestones related to the current Release.
- Adding/removing a Milestone relation does not mutate other Milestones, Release, Iteration, Tasks, status, rank or Work Item identity.

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

## E2E-016 - Future Backlog scope guard

| Field | Value |
|---|---|
| Phases | Phase 2 + Phase 3 + Phase 4 + Future Backlog |
| Priority | P1 |
| Actor | BA / Workspace Admin |
| Preconditions | App navigation available |

### Steps

1. Inspect Track navigation and Iteration Status view controls.
2. Inspect Plan -> Timeboxes -> Releases list/detail.
3. Inspect Portfolio dropdown.
4. Review `Future_Backlog/01_Team_Board.md`, `02_Release_Planning.md` and `03_Iteration_Status_Board.md`.

### Expected result

- Team Board is not required for Phase 3 acceptance.
- Iteration Status uses List only; Board toggle, drag/drop, WIP limits and transition rules are not current MVP requirements.
- Phase 3 Release list/detail has no Release Progress column, percentage or widget.
- Portfolio contains Portfolio Items, Capacity Planning and Release Tracking. Release Tracking is not a second Release create/edit source; Release Planning remains Future Backlog.
- Deferred notes preserve direction without creating a current development obligation.
