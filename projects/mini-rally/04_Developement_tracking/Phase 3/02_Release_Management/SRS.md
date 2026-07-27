# SRS - Phase 3.2 Release Management

## 0. Document Control

| Attribute | Value |
|---|---|
| Module ID | `P3-RELEASE-MANAGEMENT` |
| Status | Ready for Development |
| Updated date | 2026-07-12 |
| Scope | `Plan > Timeboxes > Releases` and Release detail direction |
| Priority | P3.2 - required |
| Depends on | Phase 1 Work Item base, Phase 2.1 Backlog Enhancement, Phase 2.2 Timeboxes/Iterations, Phase 2.3 Iteration Status |
| Mockup source | `03_Mockup Design/src/app/pages/IterationsPage.tsx`, `03_Mockup Design/src/app/pages/ReleasesPage.tsx` |
| Not included | Team Board, board drag/drop, WIP limits, advanced release governance |

## 1. Goal

Release Management lets users create, edit and track Project-level releases. In Phase 3.2, Release is managed as a Timebox type beside Iterations and Milestones, with inline editable dashboard rows, resizable columns, a locked create modal type, and a detail direction that follows the Rally-style Release detail reference.

Release Management is Project-level, not Team-level. A Release may still display Team-related work through assigned work items, but the Release entity belongs to a Project.

## 2. Confirmed BA Decisions

| ID | Decision | Status |
|---|---|---|
| P3-REL-DC-001 | Release Management is Phase 3.2 | Decided |
| P3-REL-DC-002 | Release is Project-level | Decided |
| P3-REL-DC-003 | Release appears as a type beside Iterations/Releases/Milestones under Timeboxes | Decided |
| P3-REL-DC-004 | Release status values are exactly `Planning`, `Active`, `Accepted` | Decided |
| P3-REL-DC-005 | In Create Release modal, Type is locked to `Release` and cannot be changed | Decided |
| P3-REL-DC-006 | Timebox dashboard supports inline edit | Decided |
| P3-REL-DC-007 | Timebox dashboard columns support resize/expand | Decided |
| P3-REL-DC-008 | Release detail layout includes Theme and Notes rich text areas on the left | Decided |
| P3-REL-DC-009 | Release detail right panel includes Start Date, Release Date, Project, State, Planned Velocity, Plan Estimate, Task Roll-up, Accepted and Version | Decided |
| P3-REL-DC-010 | Version is optional | Decided |
| P3-REL-DC-011 | Plan Estimate is manually entered | Decided |
| P3-REL-DC-012 | Accepted releases can still be edited by authorized users | Decided |
| P3-REL-DC-013 | Release assignment is supported from both Backlog and Release surfaces | Decided |
| P3-REL-DC-014 | A US/DE work item can be assigned to only one Release at a time | Decided |
| P3-REL-DC-015 | Release has an Artifacts view that shows assigned US/DE work items using the Backlog table presentation | Decided |
| P3-REL-DC-016 | Release detail includes a `Release Notes` rich text area for readiness notes gathered from assigned US/DE notes | Decided |
| P3-REL-DC-017 | Reassigning a US/DE from one Release to another replaces the old Release assignment and refreshes old/new Release artifact views | Decided |
| P3-REL-DC-018 | Release Progress/Tracking is not Phase 3.2 scope; it belongs to `Portfolio > Release Planning` Future Backlog | Decided |

## 3. Business Flow

```text
User opens Plan > Timeboxes
-> User selects Type = Releases
-> System lists Project-level releases
-> User inline edits list fields or opens a release detail
-> User creates a Release using Create Release
-> Create modal locks Type = Release
-> User fills Project, Name, Start Date, Release Date and State
-> User can Create Timebox or Create with details
-> Release detail manages Theme, Notes and right-panel release fields
```

Release assignment flow:

```text
Backlog / Work Item Detail or Release detail assigns Story/Defect items to a Release
-> System enforces one active Release assignment per Story/Defect
-> If the item already belongs to another Release, system replaces the old assignment
-> Release dashboard shows roll-up values from assigned work items
-> Release Artifacts view lists the assigned Story/Defect items
-> Release detail shows task roll-up, accepted totals and Release Notes
```

## 4. Functional Requirements

| ID | Requirement |
|---|---|
| P3-REL-FR-001 | User can open `Plan > Timeboxes` and select `Releases`. |
| P3-REL-FR-002 | `Plan > Timeboxes > Releases` is the only Phase 3 Release management surface. Top-level `Releases` is absent; `Portfolio > Release Planning` is Future Backlog Phase 5 and not a second create/edit source. |
| P3-REL-FR-003 | Release list is filtered by current Project context. |
| P3-REL-FR-004 | Release list columns use the Timeboxes dashboard template: Name, Theme, Start Date, End/Release Date, Project, Planned Velocity, Task Estimate, State. |
| P3-REL-FR-005 | Release dashboard supports inline edit for Name, Theme, Start Date, Release Date, Project, Planned Velocity, Task Estimate and State. |
| P3-REL-FR-006 | Release dashboard columns support resize/expand. |
| P3-REL-FR-007 | Release dashboard preserves sorting behavior on column headers. |
| P3-REL-FR-008 | Release State dropdown values are exactly `Planning`, `Active`, `Accepted`. |
| P3-REL-FR-009 | Legacy release states such as `Planned`, `In Progress`, `Released`, `Cancelled`, `Archived` must not be shown as valid Phase 3.2 options. |
| P3-REL-FR-010 | Create button label is `Create Release` when Timebox Type is `Releases`. |
| P3-REL-FR-011 | Create Release modal opens with Type = `Release`. |
| P3-REL-FR-012 | Type selector in Create Release modal is disabled/read-only and cannot be changed to Iteration or Milestones. |
| P3-REL-FR-013 | Create Release modal State dropdown uses `Planning`, `Active`, `Accepted`. |
| P3-REL-FR-014 | Create Release supports `Create Timebox` and `Create with details` actions. |
| P3-REL-FR-015 | `Create with details` opens Release detail page. |
| P3-REL-FR-016 | Release detail left side shows `Theme` rich text editor. |
| P3-REL-FR-017 | Release detail left side shows `Notes` rich text editor. |
| P3-REL-FR-018 | Release detail right panel shows Start Date, Release Date, Project, State, Planned Velocity, Plan Estimate, Task Roll-up, Accepted and Version. |
| P3-REL-FR-019 | Release detail Project field is required. |
| P3-REL-FR-020 | Release detail State field is required and uses `Planning`, `Active`, `Accepted`. |
| P3-REL-FR-021 | Release detail Start Date and Release Date are required. |
| P3-REL-FR-022 | Release detail Plan Estimate is manually entered by authorized users. |
| P3-REL-FR-023 | Release detail Task Roll-up displays Estimate, To Do and Actual values from assigned tasks/work items. |
| P3-REL-FR-024 | Accepted displays accepted work total for the Release. |
| P3-REL-FR-025 | Version is editable optional text. |
| P3-REL-FR-026 | Viewer can read Release list/detail but cannot inline edit. |
| P3-REL-FR-027 | Backend must enforce edit permissions; UI disabled state is not sufficient. |
| P3-REL-FR-028 | User can assign Story/Defect work items to a Release from Backlog and Work Item Detail. |
| P3-REL-FR-029 | User can manage assigned Story/Defect work items from the Release detail/artifact surface. |
| P3-REL-FR-030 | A Story/Defect can have only one active Release assignment. |
| P3-REL-FR-031 | If user moves a Story/Defect from one Release to another, system must replace the old Release assignment. |
| P3-REL-FR-032 | Release Artifacts view shows assigned Story/Defect work items using the Backlog dashboard presentation. |
| P3-REL-FR-033 | Release Artifacts view supports the same core dashboard behavior as Backlog: search, sort, resizable columns, pagination and inline edit where fields are editable. |
| P3-REL-FR-034 | Release detail includes a `Release Notes` rich text area separate from Theme and Notes. |
| P3-REL-FR-035 | Release readiness is user-managed from assigned US/DE release notes and the Release Notes field; system does not calculate readiness in Phase 3.2. |
| P3-REL-FR-036 | After Release reassignment, the moved item disappears from the previous Release Artifacts view after refresh/refetch. |
| P3-REL-FR-037 | Phase 3 Release list/detail must not add a Release Progress column/widget; Progress is deferred to Phase 5 `Portfolio > Release Planning`. |
| P3-REL-FR-038 | After Release reassignment, old and new Release counters/roll-ups are recalculated and the user sees success or error feedback. |

## 5. Screen Mapping With Mockup

| UI area | Mockup behavior | Production behavior |
|---|---|---|
| Timebox Type | Dropdown with Iterations, Releases, Milestones | Selecting Releases loads Release list |
| Create button | `Create Release` | Opens locked Release create modal |
| Create modal Type | Shows Iteration/Release/Milestones but all disabled; Release selected | Type cannot be changed after opening modal |
| Dashboard header | Sort affordance and resize handle | User can sort and resize columns |
| Dashboard rows | Inline inputs/selects | Local mock state now; production PATCH/API persistence |
| State field | `Planning / Active / Accepted` | Release lifecycle enum |
| Detail left | Theme, Notes | Rich text fields; sanitized HTML/Markdown based on existing editor policy |
| Detail right | Start Date, Release Date, Project, State, Planned Velocity, Plan Estimate, Task Roll-up, Accepted, Version | Release metadata and roll-up fields |
| Artifacts view | Backlog-style item table | Shows Story/Defect items assigned to the Release |
| Release Notes | Rich text notes area | User-maintained release readiness notes collected from assigned US/DE notes |

## 6. Data Model And Field Mapping

### 6.1 Release Entity

| UI field | API DTO | DB/source | Editable | Rule/null handling |
|---|---|---|---|---|
| Release ID | `id` | `releases.id` | No | Generated |
| Name | `name` | `releases.name` | Yes | Required |
| Theme | `theme` | `releases.theme` or `description` | Yes | Nullable rich text/text |
| Notes | `notes` | `releases.notes` | Yes | Nullable rich text/text |
| Project | `projectId` | `releases.project_id` | Yes | Required; Project-level |
| Start Date | `startDate` | `releases.start_date` | Yes | Required |
| Release Date | `releaseDate` | `releases.release_date` | Yes | Required; must be >= Start Date |
| State | `state` | `releases.state` | Yes | Planning, Active, Accepted |
| Planned Velocity | `plannedVelocity` | `releases.planned_velocity` | Yes | Number >= 0 |
| Plan Estimate | `planEstimate` | `releases.plan_estimate` | Yes | Manual numeric input >= 0 |
| Task Roll-up | `taskRollup` | Assigned work item/task aggregation | No | Estimate/To Do/Actual |
| Accepted | `accepted` | Accepted assigned work roll-up | No | Number >= 0 |
| Version | `version` | `releases.version` | Yes | Optional |
| Release Notes | `releaseNotes` | `releases.release_notes` | Yes | Optional rich text/text |

### 6.2 Release State Values

| UI value | API value suggestion | Meaning |
|---|---|---|
| Planning | `planning` | Release is being planned |
| Active | `active` | Release is currently executing |
| Accepted | `accepted` | Release has been accepted/sign-off completed |

Legacy/sample mappings for migrated data:

| Legacy/source value | Phase 3.2 display |
|---|---|
| Planned | Planning |
| In Progress | Active |
| Released | Accepted |
| Cancelled | Planning until explicit cancellation workflow is added |
| Archived | Accepted or hidden, based on archival policy |

## 7. API Contracts

### 7.1 List Releases

```http
GET /api/releases?projectId={projectId}&search={search}&page={page}&pageSize={pageSize}&sort={field}:{direction}
```

Response:

```ts
type ReleaseListResponse = {
  items: ReleaseListItemDto[];
  page: number;
  pageSize: number;
  total: number;
};

type ReleaseListItemDto = {
  id: string;
  name: string;
  theme?: string | null;
  startDate: string;
  releaseDate: string;
  projectId: string;
  projectName: string;
  plannedVelocity: number;
  taskEstimate: number;
  state: "Planning" | "Active" | "Accepted";
};
```

### 7.2 Create Release

```http
POST /api/releases
Content-Type: application/json

{
  "projectId": "project-1",
  "name": "Nexus Platform Q2 2025",
  "startDate": "2025-02-01",
  "releaseDate": "2025-05-01",
  "state": "Planning"
}
```

### 7.3 Update Release Inline Fields

```http
PATCH /api/releases/{releaseId}
Content-Type: application/json

{
  "name": "Nexus Platform Q2 2025",
  "theme": "Major v4.0 with mobile app and reporting dashboards",
  "startDate": "2025-02-01",
  "releaseDate": "2025-05-01",
  "projectId": "project-1",
  "plannedVelocity": 52,
  "taskEstimate": 0,
  "state": "Planning"
}
```

Rules:

- PATCH accepts partial payload.
- `state` must be one of `Planning`, `Active`, `Accepted`.
- `releaseDate` must be greater than or equal to `startDate`.
- `projectId` must be accessible to the current user.
- Viewer mutation must return 403.

### 7.4 Get Release Detail

```http
GET /api/releases/{releaseId}
```

Response extends list DTO with:

```ts
type ReleaseDetailDto = ReleaseListItemDto & {
  notes?: string | null;
  releaseNotes?: string | null;
  planEstimate: number;
  taskRollup: {
    estimate: number;
    todo: number;
    actual: number;
  };
  accepted: number;
  version?: string | null;
};
```

### 7.5 List Release Artifacts

Release artifacts are the Story/Defect work items assigned to the Release.

```http
GET /api/releases/{releaseId}/artifacts?search={search}&page={page}&pageSize={pageSize}&sort={field}:{direction}
```

Response:

```ts
type ReleaseArtifactListResponse = {
  items: BacklogWorkItemListItemDto[];
  page: number;
  pageSize: number;
  total: number;
};
```

Rules:

- Artifact rows use the same display contract as the Backlog dashboard where possible.
- Only Story/Defect work items are valid Release artifacts in Phase 3.2.
- A Story/Defect can be assigned to only one Release at a time.
- Assigning a Story/Defect to a new Release replaces the previous Release assignment.
- The previous Release Artifacts view must no longer show the moved item after refresh/refetch.
- Old and new Release roll-ups/counters must be recalculated after reassignment.
- UI must show a toast or equivalent feedback for successful reassignment and validation failure.
- Reassignment must not alter Iteration or Milestone assignment.
- Release readiness is not system-calculated from artifacts in Phase 3.2.
- Release progress percentage, zero-state, formula and recalculation are not system-calculated/displayed in Phase 3.2.

## 8. Permissions

| Role/permission | Read Release | Create Release | Inline Edit | Detail Edit |
|---|---:|---:|---:|---:|
| Workspace Admin | Yes | Yes | Yes | Yes |
| Project Manager | Yes | Yes | Yes | Yes |
| Product Owner / BA | Yes | Yes if configured | Yes if configured | Yes if configured |
| Developer / QA | Yes | No by default | No by default | No by default |
| Viewer | Yes | No | No | No |

## 9. Acceptance Criteria

1. `Plan > Timeboxes > Releases` displays the Release dashboard.
2. Release dashboard rows are inline editable for authorized users.
3. Release dashboard columns are resizable.
4. Release State options are exactly `Planning`, `Active`, `Accepted`.
5. `Create Release` opens the create modal with Type locked to Release.
6. User cannot change modal Type from Release to Iteration or Milestones.
7. Create Release modal State options are `Planning`, `Active`, `Accepted`.
8. `Create with details` opens Release detail.
9. Release detail has Theme and Notes rich text areas.
10. Release detail right panel includes Start Date, Release Date, Project, State, Planned Velocity, Plan Estimate, Task Roll-up, Accepted and Version.
11. Viewer can read but cannot mutate Release list/detail fields.
12. Backend rejects invalid state and invalid date ranges.
13. Release Artifacts view lists Story/Defect work items assigned to the Release.
14. Backlog and Release detail can both assign Story/Defect work items to a Release.
15. System enforces one active Release per Story/Defect.
16. Release Notes is editable and separate from Theme and Notes.
17. Reassigning a Story/Defect removes it from the previous Release Artifacts view after refresh/refetch and recalculates old/new Release counters.

## 10. Test Scenarios

| ID | Scenario | Expected result |
|---|---|---|
| P3-REL-TS-001 | Select Timebox Type = Releases | Release rows are displayed |
| P3-REL-TS-002 | Edit Release Name inline | Name updates and persists |
| P3-REL-TS-003 | Edit Release State | Only Planning/Active/Accepted options are available |
| P3-REL-TS-004 | Resize Theme column | Column width changes without breaking row layout |
| P3-REL-TS-005 | Click Create Release | Modal opens with Release selected and Type disabled |
| P3-REL-TS-006 | Try to switch Type in modal | Type cannot be changed |
| P3-REL-TS-007 | Create Release with invalid date range | Validation error |
| P3-REL-TS-008 | Viewer edits inline via UI | Control is disabled/read-only |
| P3-REL-TS-009 | Viewer calls PATCH API | API returns 403 |
| P3-REL-TS-010 | Open Release detail | Theme/Notes and right-panel fields are shown |
| P3-REL-TS-011 | Assign a Story to a Release from Backlog | Story appears in Release Artifacts |
| P3-REL-TS-012 | Assign the same Story to another Release | Previous Release assignment is replaced; old and new Release artifact lists/counters refresh |
| P3-REL-TS-013 | Open Release Artifacts | Assigned Story/Defect rows use Backlog-style table behavior |
| P3-REL-TS-014 | Edit Release Notes | Notes persist separately from Theme and Notes |

## 11. BA Confirmations

| ID | Question | Current recommendation |
|---|---|---|
| P3-REL-Q01 | What is the final Release readiness rule? | Confirmed: user manually gathers readiness information from linked US/DE release notes. |
| P3-REL-Q02 | Is Release assignment managed from Backlog/Work Item Detail only, or also from Release detail? | Confirmed: support both Backlog/Work Item Detail and Release detail/artifact surface |
| P3-REL-Q03 | Can a Story/Defect be assigned to multiple Releases? | Confirmed: one active Release only |
| P3-REL-Q04 | Does Release have artifacts? | Confirmed: Release Artifacts are assigned Story/Defect work items |
| P3-REL-Q05 | What happens when an item is moved between Releases? | Confirmed: one active Release is replaced; previous Release artifact list and counters must refresh |

## 12. Ready Checklist

- [x] Project-level Release confirmed.
- [x] Status values confirmed.
- [x] Timeboxes dashboard behavior confirmed.
- [x] Create modal Type lock confirmed.
- [x] Inline edit confirmed.
- [x] Column resize confirmed.
- [x] Detail layout direction confirmed.
- [x] Version is optional.
- [x] Plan Estimate is manual input.
- [x] Accepted releases remain editable for authorized users.
- [x] Release readiness rule confirmed.
- [x] Release assignment surfaces confirmed.
- [x] Release artifact behavior confirmed.
- [x] One active Release per Story/Defect confirmed.
- [x] Release reassignment refresh behavior confirmed.
