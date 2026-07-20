# SRS - Phase 2.2 Iteration Management

## 0. Document Control

| Attribute | Value |
|---|---|
| Module ID | `P2-ITERATION-MANAGEMENT` |
| Status | Draft for Development |
| Updated date | 2026-06-28 |
| Scope | Plan > Timeboxes > Iterations |
| Priority | P2.2 - required |
| Depends on | Phase 0 Project/Team context, Phase 1 Work Item base, Phase 2.1 Backlog Enhancement |
| Not included | Release Management, Milestones, Iteration Status dashboard, Team Board, Team Status, Board drag/drop execution |

## 1. Goal

P2.2 provides a production-ready contract for managing Iterations under `Plan > Timeboxes`.

The BA decision is:

- Use the Rally-compatible label `Timeboxes` in navigation.
- Inside Timeboxes, focus P2.2 only on `Iterations`.
- `Releases` and `Milestones` are hidden in Phase 2 UI and return in Phase 3.
- Release Management and Milestones move to Phase 3.

The purpose of this slice is to let a user list, search, sort, create and open Iteration details with the same full-page detail pattern already used by Backlog Work Item Detail.

BA update 2026-06-28:

- Iteration records created in Timeboxes are the selectable values for Backlog, Work Item Detail and Iteration Status.
- Existing Backlog Story/Defect assignment into an Iteration is required so P2.3 Iteration Status can display real backlog work assigned to the selected Iteration.
- The primary assignment field is `work_items.iteration_id`. The user may update it from Backlog list, Work Item Detail right panel, or an Iteration detail assigned-items panel if implemented.
- Assignment must validate Project and Team context.

## 2. Reference Documents

| Document | Section | Purpose |
|---|---|---|
| [`PHASE2_MOCKUP_CHECKLIST.md`](../PHASE2_MOCKUP_CHECKLIST.md) | P2.2 Iteration Management | Mockup coverage |
| [`PHASE2_DEVELOPMENT_TRACKING.md`](../PHASE2_DEVELOPMENT_TRACKING.md) | P2.2 task plan | Delivery tracking |
| [`Mini_Rally_Product_Plan.xlsx`](../../Mini_Rally_Product_Plan.xlsx) | Phase 2 / Sprint Management | Phase scope |
| [`Phase 2/01_Backlog_Enhancement/SRS.md`](../01_Backlog_Enhancement/SRS.md) | Backlog rules | Dependency and out-of-scope boundary |
| [`DATABASE_SCHEMA.md`](../../../05_Architecture/DATABASE_SCHEMA.md) | `planning.sprints`, `work_items.iteration_id` | Physical schema |
| [`mini_rally_database_design.md`](../../../01_DB%20design/mini_rally_database_design.md) | Sprints/iterations | Logical schema |
| [`IterationsPage.tsx`](../../../03_Mockup%20Design/src/app/pages/IterationsPage.tsx) | Whole file | Mockup source |

## 3. Actors

- Workspace Admin.
- Project Manager / Scrum Master.
- Product Owner / BA.
- Developer / QA.
- Viewer.

## 4. Terminology

| Term | Meaning in Mini Rally |
|---|---|
| Timeboxes | Planning container menu group. In P2.2 it contains Iterations only for production scope. |
| Iteration | Sprint-like timebox with name, date range, state, planned velocity and team context. |
| Theme | Iteration description/goal/context. The list column `Theme` maps to the detail rich-text field `Theme`. |
| Notes | Internal planning notes for the iteration. |
| Planned Velocity | Planned capacity/velocity number for the iteration. |
| Task Estimate | Read-only rollup from tasks/work items for list display in P2.2. |

## 4A. Business Rules / Business Flow

Iteration Management owns the timebox entity. It does not own a separate copy of Backlog items.

Business flow:

```text
Workspace selector chọn Project/Team
-> Timeboxes shows Iterations for that Project/Team
-> User creates Iteration under Plan > Timeboxes
-> Iteration becomes available in Backlog Iteration column and Work Item Detail right panel
-> User assigns Story/Defect to that Iteration by updating work_items.iteration_id
-> Iteration Status uses the selected Iteration to query assigned Work Items and calculate metrics
```

Nghiệp vụ chính:

- Project/Team context được lấy từ workspace selector ở top navigation.
- Khi user chọn Team nào thuộc Project nào, Timeboxes/Iterations chỉ hiển thị Iterations thuộc đúng Project/Team đó.
- Khi tạo Iteration, Project và Team được auto-fill theo Project/Team context hiện tại.
- Account hiện tại trong mockup là Workspace Admin, nên vẫn có quyền đổi Project/Team trong quick create/detail nếu cần.
- Iteration belongs to one Project and one Team context in Phase 2.
- A Work Item can belong to zero or one Iteration at a time.
- Moving a Work Item to another Iteration updates the same `iterationId`; it does not duplicate the item.
- `Unscheduled` means `iterationId` is null or unset.
- Iteration detail may show assigned Work Items as a review/assignment surface, but the authoritative assignment is still stored on the Work Item.
- Release and Milestone are separate concepts and must not be implemented as part of P2.2.

## 5. Functional Requirements

| ID | Requirement |
|---|---|
| P2-IT-FR-001 | User can open `Plan > Timeboxes` from the Plan navigation menu. |
| P2-IT-FR-001A | Timeboxes reads current Project/Team from the workspace selector. |
| P2-IT-FR-001B | Iterations list only shows Iterations belonging to the selected Project/Team context. |
| P2-IT-FR-001C | Create Iteration auto-fills Project and Team from current context. |
| P2-IT-FR-001D | Workspace Admin may override Project/Team in create/detail, but selected Team must be valid for selected Project. |
| P2-IT-FR-001E | `All Teams` is allowed as a Phase 2 context; permission-specific create/edit restrictions are deferred. |
| P2-IT-FR-002 | Timeboxes page defaults to type `Iterations`. |
| P2-IT-FR-003 | Type dropdown is hidden in Phase 2; Timeboxes shows Iterations only. |
| P2-IT-FR-004 | Releases and Milestones are explicitly out of scope for P2.2 and must not block Iteration delivery. |
| P2-IT-FR-005 | Iterations list displays columns: Name, Theme, Start Date, End Date, Project, Planned Velocity, Task Estimate, State. |
| P2-IT-FR-006 | User can search iterations by Name, Theme, Project or State. |
| P2-IT-FR-007 | User can sort list columns by clicking header sort icons. |
| P2-IT-FR-008 | Date columns sort oldest-newest/newest-oldest; numeric columns sort smallest-largest/largest-smallest; text columns sort A-Z/Z-A. |
| P2-IT-FR-009 | User can filter Iterations by State: All, Planning, Committed, Accepted. |
| P2-IT-FR-010 | User with manage iteration permission can open quick create modal with `Create Iteration`. |
| P2-IT-FR-011 | Quick create modal contains Type, Project, Team, Name, Start Date, End Date, State. |
| P2-IT-FR-012 | Quick create modal required fields: Name, Start Date, End Date, State. |
| P2-IT-FR-013 | Quick create `Create Iteration` creates an Iteration without opening detail after successful save. |
| P2-IT-FR-014 | Quick create `Create with details` opens a full-page Iteration detail view. |
| P2-IT-FR-015 | Clicking an existing Iteration row opens the same full-page Iteration detail view. |
| P2-IT-FR-016 | Iteration detail header shows back button, type badge, iteration key/id and iteration name. |
| P2-IT-FR-017 | Iteration detail has only the `Details` tab in P2.2. |
| P2-IT-FR-018 | Iteration detail left area contains rich-text editors: Theme and Notes. |
| P2-IT-FR-019 | Iteration detail right panel contains Project, Team, Start Date, End Date, State, Planned Velocity. |
| P2-IT-FR-020 | Detail required fields: Start Date, End Date, State. |
| P2-IT-FR-021 | Project and Team context is shown in the detail right panel, not duplicated in the page subtitle or context bar while in Timeboxes. |
| P2-IT-FR-022 | Start Date must be before or equal to End Date. |
| P2-IT-FR-023 | State values are Planning, Committed and Accepted. New Iteration defaults to Planning; authorized user manually changes it to Committed when scope is committed. |
| P2-IT-FR-024 | Viewer can view list/detail but cannot create, update or delete iterations. |
| P2-IT-FR-025 | Release and Milestone detail/create behavior is not implemented in P2.2. |
| P2-IT-FR-026 | Iterations created in Timeboxes are available as assignment targets in Backlog list and Work Item Detail. |
| P2-IT-FR-027 | Assignment search only returns active, non-archived backlog items from the same Project and Team as the Iteration. |
| P2-IT-FR-028 | User can unassign a work item from the Iteration by setting Iteration to `Unscheduled`, without deleting the Backlog item. |
| P2-IT-FR-029 | Assigned work items become visible in P2.3 Iteration Status for that Iteration. |
| P2-IT-FR-030 | Assignment does not support Feature or Task as independent backlog items unless a later phase changes the work item hierarchy. |

## 6. Screen Mapping With Mockup

| UI area | Mockup component | Production behavior |
|---|---|---|
| Navigation | `Plan > Timeboxes` | Opens Iteration Management |
| Page title | `Timeboxes` | No subtitle under title |
| Type dropdown | Hidden in Phase 2 | P2.2 supports Iterations only; Release/Milestone options return in Phase 3 |
| Search | `Search iterations...` | Search by name/theme/project/state |
| State filter | Show filter banner | Filter by Iteration state |
| List | `IterationsPage` table | Dense list, 11px typography, sortable headers |
| Create button | `Create Iteration` | Opens quick create modal |
| Quick create modal | `New Iteration` | Project/Team/Name/Start Date/End Date/State |
| Create with details | Modal secondary action | Opens full-page detail, not modal detail |
| Row click | Any iteration row | Opens full-page detail |
| Detail left | Theme, Notes editors | Editable rich-text/text fields |
| Detail right | Project/Team/date/state/velocity | Editable fields with validation |
| Detail header | Type badge, ID, name | No create button in header |
| Assigned work items | Iteration detail follow-up panel/section if implemented | Review/search existing Backlog Story/Defect assigned by `iterationId` |

## 7. Data Model And Field Mapping

### 7.1 Entity Mapping

Production should map Iterations to `planning.sprints` unless the backend introduces an explicit `iterations` table. Current architecture uses `planning.sprints` as the Iteration/Sprint storage.

| UI field | API DTO | DB source | Rule/null handling |
|---|---|---|---|
| ID | `id` / `iterationKey` | `planning.sprints.id` plus generated display key | Read-only |
| Name | `name` | `planning.sprints.name` | Required, trimmed |
| Project | `projectId` | `planning.sprints.project_id` | Required; project must be active |
| Team | `teamId` | `planning.sprints.team_id` if available, otherwise project-team mapping extension | Required for UI scope |
| Theme | `theme` | New/extended column recommended: `planning.sprints.theme` or metadata JSON | Nullable rich text/text |
| Notes | `notes` | New/extended column recommended: `planning.sprints.notes` or metadata JSON | Nullable rich text/text |
| Start Date | `startDate` | `planning.sprints.start_date` | Required |
| End Date | `endDate` | `planning.sprints.end_date` | Required; >= startDate |
| State | `state` | `planning.sprints.state` | Map UI states below |
| Planned Velocity | `plannedVelocity` | Recommended new column or capacity/velocity field | Numeric >= 0, nullable |
| Task Estimate | `taskEstimate` | Rollup from assigned work item tasks | Read-only in P2.2 list |

### 7.2 State Mapping

Current DB schema has `planning.sprints.state` values `future`, `active`, `closed`. UI uses Rally-style states:

| UI State | DB State Option | Meaning |
|---|---|---|
| Planning | `future` or `active` according to date/execution context | Iteration is planned or running; agreeing sprint scope is business context, not a status value |
| Accepted | `closed` | Iteration is completed/accepted |

If backend chooses to store UI labels directly, allowed values must still be exactly: `planning`, `accepted`.

## 8. API Contracts

### 8.1 List Iterations

```text
GET /api/v1/projects/:projectId/iterations
```

Query params:

| Param | Type | Required | Rule |
|---|---|---:|---|
| `teamId` | UUID | No | If supplied, validate team belongs to project |
| `q` | string | No | Search name/theme/project/state |
| `state` | `planning`,`committed`,`accepted` | No | Omit = all |
| `pageSize` | 10/25/50/100 | Yes | Default 25 |
| `page` or `cursor` | number/string | Yes | Follow existing pagination standard |
| `sortBy` | enum | No | `name`,`theme`,`startDate`,`endDate`,`project`,`plannedVelocity`,`taskEstimate`,`state` |
| `sortDirection` | `asc`,`desc` | No | Default startDate asc |

Response:

```json
{
  "items": [
    {
      "id": "uuid",
      "iterationKey": "IT-24-3",
      "name": "Sprint 24.3",
      "theme": "Authentication stability",
      "project": { "id": "uuid", "key": "NXP", "name": "Nexus Platform 2025" },
      "team": { "id": "uuid", "name": "Core Platform" },
      "startDate": "2024-10-14",
      "endDate": "2024-10-28",
      "state": "planning",
      "plannedVelocity": 47,
      "taskEstimate": 106
    }
  ],
  "pageInfo": {
    "page": 1,
    "pageSize": 25,
    "total": 5
  }
}
```

### 8.2 Create Iteration

```text
POST /api/v1/projects/:projectId/iterations
```

Request:

```json
{
  "teamId": "uuid",
  "name": "Sprint 24.4",
  "theme": "Q1 platform prep",
  "notes": "",
  "startDate": "2024-10-29",
  "endDate": "2024-11-12",
  "state": "planning",
  "plannedVelocity": 31
}
```

Response: `201 Created` with the created iteration DTO.

Rules:

- `name`, `startDate`, `endDate`, `state` are required.
- `teamId` must belong to project.
- Date range must not be invalid.
- State defaults to `planning` only if UI sends no state; UI should send state explicitly.

### 8.3 Get Iteration Detail

```text
GET /api/v1/iterations/:iterationId
```

Returns the list DTO plus editable detail fields:

```json
{
  "id": "uuid",
  "iterationKey": "IT-24-3",
  "name": "Sprint 24.3",
  "theme": "Authentication stability",
  "notes": "",
  "project": { "id": "uuid", "key": "NXP", "name": "Nexus Platform 2025" },
  "team": { "id": "uuid", "name": "Core Platform" },
  "startDate": "2024-10-14",
  "endDate": "2024-10-28",
  "state": "planning",
  "plannedVelocity": 47,
  "taskEstimate": 106,
  "version": 3
}
```

### 8.4 Update Iteration

```text
PATCH /api/v1/iterations/:iterationId
```

Allowed fields:

| Field | Rule |
|---|---|
| `name` | Required after trim |
| `theme` | Nullable rich text/text |
| `notes` | Nullable rich text/text |
| `projectId` | Same tenant; changing project should usually be blocked after creation |
| `teamId` | Team must belong to project |
| `startDate` | Required |
| `endDate` | Required and >= startDate |
| `state` | `planning`, `committed`, `accepted` |
| `plannedVelocity` | Number >= 0 or null |

Use optimistic concurrency if the platform already has `version` or `updatedAt`.

### 8.5 Delete/Archive Iteration

Delete/archive is not surfaced in the current mockup. If backend needs it for completeness, expose as future P2.2 follow-up:

```text
DELETE /api/v1/iterations/:iterationId
```

Rules:

- Not available to Viewer.
- Should soft-delete/archive, not hard delete.
- Must reject if iteration has assigned work items unless product explicitly allows archive with assignments.

### 8.6 Assign Existing Backlog Items To Iteration

Assignment is implemented by updating Work Item `iterationId`. The canonical endpoint may live in Work Items API because assignment changes the Work Item, not the Iteration entity.

Preferred endpoint:

```text
PATCH /api/v1/work-items/:workItemId
```

Allowed field:

```json
{
  "iterationId": "uuid-or-null"
}
```

Optional bulk endpoint:

```text
PATCH /api/v1/work-items/bulk-iteration
```

Request:

```json
{
  "projectId": "uuid",
  "teamId": "uuid",
  "workItemIds": ["uuid-1", "uuid-2"],
  "iterationId": "uuid-or-null"
}
```

Rules:

- Each work item must be active and not archived/deleted.
- Each work item must belong to the same Project and Team as the Iteration.
- P2.2 assignment supports Story and Defect only.
- Backend updates the work item's `iterationId` / `sprint_id` to the selected Iteration.
- Setting `iterationId` to null means `Unscheduled`.
- If any item fails validation, API should return field/item-level errors.

## 9. Permission Rules

| Action | Required permission |
|---|---|
| View Timeboxes/Iterations list | `iteration:view` or `sprint:view` |
| View Iteration detail | `iteration:view` or `sprint:view` |
| Create Iteration | `iteration:create` or `sprint:create` |
| Update Iteration | `iteration:update` or `sprint:update` |
| Change Iteration state | `iteration:update` or state-specific permission if backend has it |
| Archive/Delete Iteration | `iteration:delete` or `sprint:delete`, future follow-up |
| Assign/unassign work items to Iteration | `iteration:update` plus `work_item:update` or equivalent planning permission |

Role guidance:

| Role | Expected behavior |
|---|---|
| Workspace Admin | Full access |
| Project Manager / Scrum Master | Full create/update access within assigned project |
| Product Owner / BA | View and possibly update theme/notes depending final role matrix |
| Developer / QA | View access |
| Viewer | Read-only |

## 10. Validation Rules

- Name is required and trimmed.
- Start Date is required.
- End Date is required.
- End Date must be greater than or equal to Start Date.
- State is required.
- State must be one of Planning, Committed or Accepted.
- Planned Velocity must be numeric and >= 0 if supplied.
- Project must be active.
- Team must belong to selected Project.
- Iteration date overlap policy:
  - Default recommendation: warn but do not block overlapping iterations across different teams.
  - Block overlapping iterations for the same team only if BA later confirms.
- Accepted Iteration does not lock dates, Project/Team, assignment or status by lifecycle alone. Authorized users can still manually edit fields according to normal permissions.
- Assigning an existing work item to an Iteration requires matching Project and Team.
- Unassigning an item must preserve the work item's Backlog identity, rank and history.

### 10.1 Iteration Lifecycle And Manual Status Baseline

Phase 2.2 supports the Iteration record, assignment and status values needed by Backlog and Iteration Status. It does not implement Team Board execution. The rules below are the BA-confirmed baseline for later Team Board / Iteration Execution and must be reused there instead of creating a separate board-only lifecycle.

Confirmed Iteration status values:

| State | Meaning | How it changes |
|---|---|---|
| `Planning` | New/default planning state. | Default when user creates an Iteration. |
| `Committed` | Scope has been committed and the Iteration is running. | Authorized user manually changes the state when the team commits scope. |
| `Accepted` | Iteration is accepted/closed from a planning perspective. | System may auto-set to `Accepted` when all assigned Story/Defect items are `Accepted`; user can still change manually if permitted. |

Lifecycle control rules:

- Iteration state remains user-editable according to permission.
- Assigning Story/Defect items does not automatically change the Iteration status.
- Scope commitment is a manual transition to `Committed`; it is never triggered merely by assignment.
- No Iteration state locks scope by itself.
- `Committed` does not lock scope: user can still add, remove or move Story/Defect items while the sprint is running.
- When all assigned Story/Defect items in the Iteration are `Accepted`, system auto-sets the Iteration to `Accepted`.
- Auto-setting Iteration to `Accepted` is a convenience behavior; it does not remove manual status editing.
- Auto-accept requires at least one assigned Story/Defect item; an empty Iteration must not auto-accept.
- If an item later moves out of `Accepted`, system should not force a reverse status change; user manages Iteration status manually.

Assignment and board rules:

- User can manually move Story/Defect items between Iterations by editing the Work Item `Iteration` field.
- There is no dedicated carry-over workflow/modal in the confirmed baseline.
- Team Board must not create carry-over behavior of its own.
- Board displays and updates Work Items for the selected Iteration; it respects the Work Item assignment chosen by users.
- Moving an item to another Iteration preserves Work Item identity, history, rank and links; it must not clone the Work Item.

## 11. UI States

| State | Behavior |
|---|---|
| Loading list | Keep app shell visible; table area shows loading/skeleton |
| Empty list | Show empty table state with search/filter reset option |
| Modal validation error | Required fields show inline error and do not submit |
| Detail loading | Header may show selected id/name; body shows loading |
| Detail save pending | Disable changed field or show saving indicator |
| Detail save error | Keep user value, show field/toast error, allow retry |
| Project Admin outside managed Project | Hide create button; render fields as read-only or disabled |

## 12. Acceptance Criteria

1. User can open `Plan > Timeboxes`.
2. Page title is `Timeboxes` and defaults type to `Iterations`.
3. Timeboxes respects the active workspace selector Project/Team context.
4. Iterations list only shows Iterations for the selected Project/Team.
5. Iterations list shows columns Name, Theme, Start Date, End Date, Project, Planned Velocity, Task Estimate and State.
6. User can search iterations.
7. User can filter by State.
8. User can sort list columns.
9. `Create Iteration` opens quick create modal.
10. Quick create modal includes Type, Project, Team, Name, Start Date, End Date and State.
11. Quick create auto-fills Project and Team from the active workspace selector context.
12. Workspace Admin can override Project/Team where enabled, but selected Team must belong to selected Project.
13. Name, Start Date, End Date and State are required.
14. `Create with details` opens full-page detail, not a modal detail.
15. Clicking an existing row opens full-page detail.
16. Detail header has back button, type badge, id/key and name.
17. Detail header does not show a create button.
18. Detail has left editors Theme and Notes.
19. Detail right panel has Project, Team, Start Date, End Date, State and Planned Velocity.
20. Project/Team context is not duplicated in the top context bar while user is in Timeboxes detail.
21. Existing row detail preloads Theme, dates, State and Planned Velocity.
22. Viewer cannot create or edit iterations.
23. Releases and Milestones are not implemented as P2.2 production capability.
24. User can assign existing Backlog Story/Defect items to an Iteration from Backlog list or Work Item Detail.
25. System rejects assignment when work item Project/Team does not match Iteration Project/Team.
26. User can unassign an item from an Iteration without deleting it from Backlog.
27. Assigned items appear in P2.3 Iteration Status for the selected Iteration.

## 13. Test Scenarios

| ID | Scenario | Expected |
|---|---|---|
| P2-IT-TS-001 | Open Plan menu and click Timeboxes | Timeboxes page opens with Iterations selected |
| P2-IT-TS-002 | Search `authentication` | Sprint 24.3 or matching rows are shown |
| P2-IT-TS-003 | Filter State = Planning | Only Planning iterations show |
| P2-IT-TS-004 | Sort Start Date descending | Newest iteration appears first |
| P2-IT-TS-005 | Click Create Iteration | New Iteration modal opens |
| P2-IT-TS-006 | Submit quick create with missing Start Date | Inline validation blocks submit |
| P2-IT-TS-007 | Click Create with details | Full-page detail opens |
| P2-IT-TS-008 | Click existing Sprint 24.3 row | Full-page detail opens with Sprint 24.3 values |
| P2-IT-TS-009 | Existing row detail date fields | Start/End date prefill as valid date input values |
| P2-IT-TS-010 | Detail right panel | Project/Team/Start/End/State/Velocity are visible |
| P2-IT-TS-011 | Viewer opens Timeboxes | Create button hidden or disabled; fields read-only |
| P2-IT-TS-012 | Try End Date before Start Date | Validation error |
| P2-IT-TS-013 | Switch workspace selector to another Team | Iterations list reloads and only shows Iterations for that Team/Project |
| P2-IT-TS-014 | Create Iteration after selecting Core Platform team | Project and Team fields default to Nexus Platform 2025 / Core Platform |
| P2-IT-TS-015 | Workspace Admin selects Team outside selected Project | Validation rejects invalid Project/Team pair |
| P2-IT-TS-016 | Inspect Timeboxes type options in P2.2 production | Release/Milestone options are not visible; no P2.2 dev scope |
| P2-IT-TS-017 | Assign existing Story from same Project/Team to Sprint 24.3 | Story is assigned and appears in Iteration Status |
| P2-IT-TS-018 | Assign item from another Team | Validation rejects assignment |
| P2-IT-TS-019 | Unassign an item from Sprint 24.3 | Item leaves Iteration Status but remains in Backlog |

## 14. Implementation Breakdown

```text
P2-IT-T01 Contract: define Iteration DTOs and OpenAPI
P2-IT-T02 Backend: list/search/filter/sort iterations
P2-IT-T03 Backend: create iteration with validation
P2-IT-T04 Backend: get/update iteration detail
P2-IT-T05 Backend: permission checks and project/team validation
P2-IT-T06 Frontend: Timeboxes route/list/type dropdown
P2-IT-T07 Frontend: quick create modal with required fields
P2-IT-T08 Frontend: full-page Iteration detail from create-with-details and row click
P2-IT-T09 Frontend: save/update states and read-only viewer behavior
P2-IT-T10 Backend: expose Iteration options for Work Item assignment
P2-IT-T11 Frontend: confirm Iteration options are consumed by Backlog and Work Item Detail
P2-IT-T12 Verification: unit, contract and e2e smoke tests
```

## 15. Out Of Scope

| Item | Target phase | Reason |
|---|---|---|
| Release CRUD/detail/readiness | Phase 3 | Release Management belongs to Quality/Delivery |
| Milestones | Phase 3 | Delivery checkpoint concept, not required for Iteration Management |
| Dedicated Start/Close/carry-over workflow | Not required in confirmed baseline | User changes Iteration status manually; teams manually move Story/Defect items between Iterations |
| Burndown/velocity reporting | Phase 5 Reports or Iteration Status slice | P2.2 only stores/plans iteration data |
| Team Status | Phase 3 | Moved out of Phase 2 by BA decision |
| Team Board | Future backlog | Optional board execution view; not required for current Agile management MVP |
| Board drag/drop | Future backlog | Optional board behavior; transition rules/WIP limits are not needed for current MVP |

## 16. Definition Of Done

- SRS approved by BA.
- Mockup behavior has matching production contract or documented deviation.
- OpenAPI/DTOs updated.
- Database mapping for Theme, Notes and Planned Velocity is decided before implementation.
- Acceptance Criteria pass.
- Permission and project/team isolation tests pass.
- Releases and Milestones are not accidentally included in P2.2 production scope.
- Existing Backlog-to-Iteration assignment passes validation and appears in Iteration Status.
