# SRS - Phase 2.3 Iteration Status

## 0. Document Control

| Attribute | Value |
|---|---|
| Module ID | `P2-ITERATION-STATUS` |
| Status | Ready for Development |
| Updated date | 2026-06-28 |
| Scope | Track > Iteration Status |
| Priority | P2.3 - required |
| Depends on | Phase 1 Work Item base, Phase 2.1 Backlog Enhancement, Phase 2.2 Timeboxes > Iterations |
| Not included | Team Board, Team Status, Board drag/drop execution, Saved Views, Start/Close Iteration, carry-over, Release/Milestone management |

## 1. Goal

P2.3 provides a Rally-like Iteration Status screen where users can select an Iteration, view execution metrics, review the work items assigned to that Iteration, update selected list fields, and create a new Story or Defect directly into the selected Iteration.

The BA decision is:

- Scope is `Iteration Status` only.
- Phase 2 `Track` delivery is `Iteration Status` only. `Team Status` is moved to Phase 3 and `Team Board` is moved to Backlog for the future.
- Iteration selector must read from Iteration records created under `Plan > Timeboxes`.
- The list behavior must inherit Phase 2.1 Backlog Enhancement patterns.
- Existing backlog assignment into an Iteration is not done from the Add Item modal; it is handled through the Work Item `Iteration` field in Backlog list and Work Item Detail.

## 2. Reference Documents

| Document | Section | Purpose |
|---|---|---|
| [`PHASE2_MOCKUP_CHECKLIST.md`](../PHASE2_MOCKUP_CHECKLIST.md) | P2.3 Iteration Status | Mockup coverage and BA decisions |
| [`PHASE2_DEVELOPMENT_TRACKING.md`](../PHASE2_DEVELOPMENT_TRACKING.md) | P2.3 task plan | Delivery tracking |
| [`01_Backlog_Enhancement/SRS.md`](../01_Backlog_Enhancement/SRS.md) | Backlog list enhancements | Reused list/search/filter/sort/inline-edit behavior |
| [`02_Iterations/SRS.md`](../02_Iterations/SRS.md) | Iteration Management | Source of Iteration records |
| [`IterationStatusPage.tsx`](../../../03_Mockup%20Design/src/app/pages/IterationStatusPage.tsx) | Whole file | Mockup source |
| [`IterationsPage.tsx`](../../../03_Mockup%20Design/src/app/pages/IterationsPage.tsx) | Iteration records | Timeboxes mockup source |
| [`DATABASE_SCHEMA.md`](../../../05_Architecture/DATABASE_SCHEMA.md) | Work items, iterations/sprints | Physical schema |

## 3. Actors

- Workspace Admin.
- Project Manager / Scrum Master.
- Product Owner / BA.
- Developer / QA.
- Viewer.

Permission granularity is deferred. Current P2.3 mockup assumes admin/full access. Production must still enforce backend permissions.

## 4. Terminology

| Term | Meaning in Mini Rally |
|---|---|
| Track | Execution navigation group. In Phase 2 it delivers Iteration Status only. Team Status is Phase 3 and Team Board is Backlog for the future. |
| Iteration Status | P2.3 screen for tracking one selected Iteration. |
| Iteration | Timebox/Sprint-like record created under `Plan > Timeboxes`. |
| Work item in Iteration | Work item with `iterationId` equal to the selected Iteration. |
| Schedule State | Work item execution state shown in Iteration Status list. Allowed values: Idea, Defined, In-Progress, Completed, Accepted, Release. |
| Defects metric | Count of work items whose type is `Defect` in the selected Iteration. It is not a per-story defect count. |
| Tasks metric | Count of work items whose type is `Task` in the selected Iteration. |

## 4A. Business Rules / Business Flow

Iteration Status is a tracking view over Backlog Work Items. It must not create a second execution-only copy of the same item.

Business flow:

```text
Workspace selector chọn Project/Team
-> Backlog Story/Defect is created in that Project/Team
-> User assigns Iteration from Backlog list or Work Item Detail
-> Iteration Status selector chooses one Iteration from Timeboxes
-> System loads Work Items where iterationId = selected Iteration
-> Metrics are calculated from that same Work Item set
-> Row click opens the same Work Item Detail page used by Backlog
```

Nghiệp vụ chính:

- Project/Team context được lấy từ workspace selector ở top navigation.
- Iteration selector only lists Iterations that belong to the selected Project/Team context.
- Iteration Status only shows records related to the selected Project/Team through the selected Iteration.
- Add Item modal auto-fills Project and Team from the selected Project/Team context and selected Iteration.
- Account hiện tại trong mockup là Workspace Admin, nên vẫn có quyền đổi Project/Team where the form allows it; however Project/Team must remain consistent with the selected Iteration.
- Iteration Status only shows items whose `iterationId` matches the selected Iteration.
- The list still shows the `Iteration` column so user can confirm or move an item to another Iteration without opening Backlog.
- If user changes Iteration from this list, the item leaves the current selected Iteration result after refresh/re-query.
- `Defects` metric counts Work Items with type `Defect` in the selected Iteration; it is not a per-row defect count.
- Work Item Detail right panel must show the `Iteration` field so assignment is visible from any entry point.
- Add Item creates a new Story/Defect directly into the selected Iteration and the item must also appear in Backlog.

## 5. Functional Requirements

| ID | Requirement |
|---|---|
| P2-IS-FR-001 | User can open `Track > Iteration Status`. |
| P2-IS-FR-002 | Phase 2 implements only `Track > Iteration Status`; `Team Status` is Phase 3 scope and `Team Board` is Future Backlog scope. |
| P2-IS-FR-003 | Page title is `Iteration`. |
| P2-IS-FR-004 | Page must not show the old top context filter bar for Project, Release, Iteration and Team. |
| P2-IS-FR-005 | Page must not show `Saved Views` in P2.3. |
| P2-IS-FR-006 | Iteration selector combines Iteration name and date range in one control. |
| P2-IS-FR-007 | Iteration selector reads its options from `Plan > Timeboxes` Iteration records. |
| P2-IS-FR-007A | Iteration selector options are filtered by the current workspace selector Project/Team context. |
| P2-IS-FR-007B | `All Teams` is allowed as a Phase 2 context; permission-specific create/edit restrictions are deferred. |
| P2-IS-FR-008 | User can move to previous/next Iteration with arrow controls. |
| P2-IS-FR-009 | User can open the selector dropdown and choose another Iteration. |
| P2-IS-FR-010 | Changing Iteration refreshes metrics and the work item list for the selected Iteration. |
| P2-IS-FR-011 | Summary metrics displayed: Planned Velocity, Iteration End, Accepted, Defects, Tasks, and View Charts link. |
| P2-IS-FR-012 | Planned Velocity metric shows accepted points compared with the Iteration planned velocity. |
| P2-IS-FR-013 | Iteration End metric shows remaining days until Iteration end date. |
| P2-IS-FR-014 | Accepted metric shows accepted points and accepted percentage for current Iteration. |
| P2-IS-FR-015 | Defects metric counts current Iteration work items where type is `Defect`. |
| P2-IS-FR-016 | Tasks metric counts current Iteration work items where type is `Task`. |
| P2-IS-FR-017 | Iteration Status list displays only work items assigned to the selected Iteration. |
| P2-IS-FR-017A | Iteration Status list is sourced from Backlog/work_items where `iterationId` equals the selected Iteration. |
| P2-IS-FR-018 | List columns are: selection checkbox, rank, ID, Type, Name, Schedule State, Iteration, Blocked, Plan Est, Task Est, To Do, Owner. |
| P2-IS-FR-019 | The list must not include a per-row `Defects` column. |
| P2-IS-FR-020 | Quick search `Filter items...` remains outside Manage Filters. |
| P2-IS-FR-021 | User can open Show/Hide filter banner. |
| P2-IS-FR-022 | User can use Manage Filters to select multiple columns and combine filters. |
| P2-IS-FR-023 | Text-style filters are used for ID, Name, Plan Est, Task Est and To Do. |
| P2-IS-FR-024 | Dropdown-style filters are used for Type, Schedule State, Iteration, Blocked and Owner. |
| P2-IS-FR-025 | Column headers show sort affordance. |
| P2-IS-FR-026 | Text columns sort A-Z/Z-A; numeric columns sort smallest-largest/largest-smallest; rank sorts by rank order. |
| P2-IS-FR-027 | User can resize list columns. |
| P2-IS-FR-028 | Header and record typography follow Backlog dense list style. |
| P2-IS-FR-029 | User with edit permission can inline edit Name/title. |
| P2-IS-FR-030 | User with edit permission can inline edit Schedule State. |
| P2-IS-FR-031 | User with edit permission can inline edit Plan Est. |
| P2-IS-FR-032 | User with edit permission can inline edit Owner. |
| P2-IS-FR-032A | User with edit permission can inline edit Iteration. |
| P2-IS-FR-033 | Work item Schedule State options in Iteration Status are exactly: Idea, Defined, In-Progress, Completed, Accepted, Release. |
| P2-IS-FR-034 | Existing work items with unsupported status values must be mapped or normalized before display in this screen. |
| P2-IS-FR-035 | User can select rows and see selected-row actions consistent with Backlog list behavior where supported. |
| P2-IS-FR-036 | Row click opens the full Work Item Detail page, reusing the Backlog Work Item Detail flow. |
| P2-IS-FR-036A | Work Item Detail right panel includes Iteration field and uses the same options as Backlog. |
| P2-IS-FR-037 | `Add Item` button is shown beside the filter/search toolbar. |
| P2-IS-FR-038 | `Quick Create` button is not shown. |
| P2-IS-FR-039 | Bottom `Add work item` row is not shown. |
| P2-IS-FR-040 | `Add Item` opens `Add Item to Iteration` modal. |
| P2-IS-FR-041 | Add Item modal supports only `Story` and `Defect` for new work item creation in P2.3. |
| P2-IS-FR-042 | Add Item modal does not show Feature or Task type choices in P2.3. |
| P2-IS-FR-043 | Add Item modal does not show `Choose existing backlog item`. Existing assignment is handled through the Work Item `Iteration` field in Backlog list and Work Item Detail. |
| P2-IS-FR-044 | Add Item modal fields are Type, Project, Team, Iteration, Title, Owner, and Plan Estimate. |
| P2-IS-FR-044A | Add Item modal defaults Project and Team from the current context/selected Iteration. |
| P2-IS-FR-044B | Workspace Admin may change Project/Team where enabled, but the final Project/Team must match the selected Iteration. |
| P2-IS-FR-045 | Iteration field in Add Item modal is read-only and prefilled with the selected Iteration name/date range. |
| P2-IS-FR-046 | Schedule State is not shown in Add Item modal; backend default is used on create. |
| P2-IS-FR-047 | Title is required for Add Item. |
| P2-IS-FR-048 | `Create Item` creates the new work item in the selected Iteration and returns to the Iteration Status list. |
| P2-IS-FR-049 | `Create with details` creates or initializes a draft work item and opens the full Work Item Detail page, same pattern as Backlog create-with-details. |
| P2-IS-FR-050 | List pagination follows Backlog pagination behavior. |
| P2-IS-FR-051 | If rank controls are enabled, move up/down calls the production rank/LexoRank behavior and refreshes the Iteration Status list. |

## 6. Screen Mapping With Mockup

| UI area | Mockup component | Production behavior |
|---|---|---|
| Navigation | Top nav `Track` entry/dropdown | Open Iteration Status; Team Status is Phase 3 and Team Board is Future Backlog |
| Breadcrumb | `Nexus Platform 2025 > Track > Iteration Status` | Shows current project and module location |
| Page title | `Iteration` | No old `Iteration Status` page title in content header |
| Iteration selector | Combined name/date selector with arrows | Reads Iteration records from Timeboxes |
| Metric strip | Planned Velocity, Iteration End, Accepted, Defects, Tasks | Calculated from selected Iteration and assigned work items |
| View Charts | Link in metric strip | Placeholder for reports/chart drilldown; may route later |
| Search | `Filter items...` | Quick search by item key/title |
| Show filter | Filter banner toggle | Same behavior pattern as Backlog |
| Manage filters | Multi-column filter chooser | Same behavior pattern as Backlog |
| Add Item | Button beside filter controls | Opens Add Item to Iteration modal |
| List / Board toggle | List and Board buttons if kept in UI | List is required for P2.3; Board button is placeholder only and board execution is Phase 3 |
| Work item list | Dense editable table | Assigned work items for selected Iteration, including Iteration column |
| Row click | Work item row | Opens full Work Item Detail page |
| Work Item Detail right panel | Shared Backlog detail panel | Shows Iteration field and allows same assignment behavior |
| Add Item modal | Create new work item only | Story/Defect, preselected Iteration |

## 7. Data Model And Field Mapping

### 7.1 Iteration Selector

| UI field | API DTO | DB/source | Rule/null handling |
|---|---|---|---|
| Iteration ID | `iterationId` | `planning.sprints.id` or equivalent Iteration table | Required |
| Iteration name | `name` | Iteration record from Timeboxes | Required |
| Date range | `startDate`, `endDate` | Iteration record from Timeboxes | Required for selector display |
| Planned velocity | `plannedVelocity` | Iteration record | Numeric >= 0; default 0 |
| Iteration state | `state` | Iteration record | Used for Timebox lifecycle, not Work Item Schedule State |

### 7.2 Work Item List

| UI field | API DTO | DB/source | Rule/null handling |
|---|---|---|---|
| Row selection | `selected` | UI state | Client-only |
| Rank | `rank` | `work_items.rank` | Read-only unless rank actions are enabled |
| ID | `itemKey` | `work_items.item_key` | Read-only |
| Type | `type` | `work_items.type` | Story, Defect, Feature, Task may display if already assigned; Add Item creates Story/Defect only |
| Name | `title` | `work_items.title` | Editable, required |
| Schedule State | `scheduleState` | `work_items.schedule_state` or workflow status mapping | Editable; enum below |
| Iteration | `iterationId` / `iteration` | `work_items.iteration_id -> planning.sprints` | Editable; selected Iteration by default; nullable -> Unscheduled |
| Blocked | `isBlocked` | `work_items.is_blocked` | Read-only in P2.3 list |
| Plan Est | `planEstimate` | `work_items.story_points` or estimate field | Editable number >= 0 |
| Task Est | `taskEstimate` | Rollup from child tasks | Read-only |
| To Do | `toDo` | Rollup from tasks | Read-only |
| Owner | `ownerId` | `work_items.assignee_id` | Editable; nullable if unassigned is supported |

### 7.3 Schedule State Values

Allowed Schedule State values in Iteration Status:

| UI value | API value suggestion | Meaning |
|---|---|---|
| Idea | `idea` | Item is captured but not ready for execution |
| Defined | `defined` | Item is defined and ready to start |
| In-Progress | `in_progress` | Item is actively being worked |
| Completed | `completed` | Implementation work is complete |
| Accepted | `accepted` | Accepted by PO/QA per team process |
| Release | `release` | Ready for or moved to release state |

Legacy/sample values such as `Code Review` and `Testing` are not valid options for this screen. If such values exist in source data, production must either map them to `In-Progress` or block them from this view with a clear migration rule.

## 8. Metric Rules

| Metric | Calculation |
|---|---|
| Planned Velocity | `acceptedPlanEstimate / iteration.plannedVelocity`, displayed as percent and `acceptedPlanEstimate/plannedVelocity pts` |
| Iteration End | Difference between current date and Iteration end date; show days left, ended, or starts later as applicable |
| Accepted | `acceptedPlanEstimate / totalPlanEstimate`, displayed as percent and accepted points |
| Defects | Count of assigned work items where `type = Defect` |
| Tasks | Count of assigned work items where `type = Task` |

Rules:

- Exclude deleted/archived work items from all metrics.
- Use selected Iteration only.
- If denominator is 0, show 0% and avoid divide-by-zero.
- `Accepted` means Schedule State equals `Accepted`, unless backend has a final accepted status mapping.
- Defects metric is aggregate per Iteration, not a child-defect count under each story.

## 9. API Contracts

### 9.1 List Iterations For Selector

```text
GET /api/v1/projects/:projectId/iterations
```

Query params:

| Param | Type | Required | Rule |
|---|---|---:|---|
| `teamId` | UUID | No | If supplied, validate team belongs to project |
| `includeClosed` | boolean | No | Default true for selector unless product later limits it |
| `sortBy` | enum | No | Default `startDate` |
| `sortDirection` | `asc`,`desc` | No | Default `asc` |

Response should reuse the Iteration DTO from P2.2.

### 9.2 Get Iteration Status

```text
GET /api/v1/iterations/:iterationId/status
```

Query params:

| Param | Type | Required | Rule |
|---|---|---:|---|
| `q` | string | No | Search item key/title |
| `filters` | object/string | No | Dynamic filters from Manage Filters |
| `pageSize` | 10/25/50/100 | Yes | Default 25 |
| `page` or `cursor` | number/string | Yes | Follow standard pagination |
| `sortBy` | enum | No | `rank`,`itemKey`,`type`,`title`,`scheduleState`,`iteration`,`blocked`,`planEstimate`,`taskEstimate`,`toDo`,`owner` |
| `sortDirection` | `asc`,`desc` | No | Default rank asc |

Response:

```json
{
  "iteration": {
    "id": "uuid",
    "name": "Sprint 24.3",
    "startDate": "2024-10-14",
    "endDate": "2024-10-28",
    "plannedVelocity": 47
  },
  "metrics": {
    "plannedVelocityPercent": 72,
    "acceptedPoints": 34,
    "plannedVelocity": 47,
    "acceptedPercent": 72,
    "totalPlanEstimate": 47,
    "daysLeft": 6,
    "defectCount": 2,
    "taskCount": 1
  },
  "items": [
    {
      "id": "uuid",
      "itemKey": "US-4821",
      "type": "Story",
      "title": "Implement SSO authentication",
      "scheduleState": "In-Progress",
      "iteration": {
        "id": "uuid",
        "name": "Sprint 24.3"
      },
      "isBlocked": false,
      "planEstimate": 8,
      "taskEstimate": 16,
      "toDo": 4,
      "owner": {
        "id": "uuid",
        "fullName": "Marcus Webb",
        "initials": "MW"
      },
      "rank": "0|hzzzzz:"
    }
  ],
  "pageInfo": {
    "page": 1,
    "pageSize": 25,
    "total": 14
  }
}
```

### 9.3 Inline Update Work Item From Iteration Status

```text
PATCH /api/v1/work-items/:id
```

Allowed fields from Iteration Status:

| Field | Rule |
|---|---|
| `title` | Required after trim |
| `scheduleState` | Must be one of Idea, Defined, In-Progress, Completed, Accepted, Release |
| `iterationId` | Target Iteration must belong to same Project/Team; nullable means Unscheduled |
| `planEstimate` | Number >= 0 |
| `ownerId` | User must be active and assignable in project/team |

Rules:

- Item must belong to the selected Iteration before update or response must indicate stale/out-of-scope item.
- If `iterationId` is changed to another Iteration, the item should leave the current list after refresh/re-query.
- API must enforce permission even if UI hides editing controls.
- UI should use optimistic update only if rollback/error state is implemented.

### 9.4 Create Work Item In Iteration

```text
POST /api/v1/iterations/:iterationId/work-items
```

Request:

```json
{
  "type": "Story",
  "projectId": "uuid",
  "teamId": "uuid",
  "title": "A concise work item title",
  "ownerId": "uuid",
  "planEstimate": 0
}
```

Rules:

- `type` is required and must be `Story` or `Defect` in P2.3.
- `title` is required after trim.
- `projectId`, `teamId`, and `iterationId` must be consistent.
- `scheduleState` is not sent from the modal; backend should default to `Defined` unless workflow configuration states otherwise.
- Created item must be assigned to the selected Iteration.
- Created item must also be available through the Backlog/work_items list for the same Project/Team.

### 9.5 Create With Details

Preferred implementation:

```text
POST /api/v1/iterations/:iterationId/work-items
```

Then route to:

```text
/work-items/:workItemId
```

Rules:

- Use same validation as Create Work Item In Iteration.
- Open the full Work Item Detail page after successful create.
- Detail page must reuse the Backlog create/detail pattern.

Alternative draft implementation is allowed only if the application already supports client-side draft detail pages. Draft must still preserve selected Iteration context and create into that Iteration on save.

## 10. Permission Rules

Current mockup assumes admin/full access. Production baseline:

| Action | Required permission |
|---|---|
| View Iteration Status | `iteration_status:view` or project read access |
| View assigned work items | `work_item:view` |
| Create Story/Defect in Iteration | `work_item:create` plus project/team access |
| Inline edit work item title/status/estimate/owner | `work_item:update` |
| Re-rank work items if rank controls are enabled | `work_item:rank_update` or `backlog:prioritize` |
| Open Work Item Detail | `work_item:view` |

Detailed role matrix for PO/PM/Developer/Tester/Viewer is deferred. API must not rely on mockup admin assumptions.

## 11. Validation Rules

- Iteration is required for this screen.
- Iteration must belong to selected project/company scope.
- Title cannot be empty after trim.
- Plan Estimate must be numeric and >= 0.
- Owner must be active and assignable in the project/team.
- Schedule State must be one of: Idea, Defined, In-Progress, Completed, Accepted, Release.
- Iteration update must target an Iteration in the same Project/Team context, or `Unscheduled` if unassignment is allowed.
- Type in Add Item modal must be Story or Defect.
- Existing backlog assignment is not accepted by the Add Item modal endpoint in P2.3.
- Existing assigned items must have Project and Team matching the selected Iteration.
- Deleted/archived work items cannot be edited from the list.

## 12. UI States

| State | Expected behavior |
|---|---|
| Loading | Keep app shell visible; show loading state in metric/list area |
| No Iterations | Show empty state and link/CTA to Timeboxes if user has permission |
| Empty Iteration | Show metrics as zero and empty list message |
| Search/filter no result | Show no-result message and keep filters visible |
| Validation error | Keep modal/detail open and show field-level error |
| Save error | Revert optimistic list changes or show retry state |
| Read-only user | Inputs render read-only/disabled; API still enforces permission |

## 13. Acceptance Criteria

- [ ] User can open `Track > Iteration Status`.
- [ ] Phase 2 implements Iteration Status only under Track.
- [ ] Team Status is Phase 3 scope and Team Board is Future Backlog scope.
- [ ] Iteration Status respects the active workspace selector Project/Team context.
- [ ] Page title is `Iteration`.
- [ ] No top context filter bar is displayed on Iteration Status.
- [ ] Saved Views is not displayed.
- [ ] Iteration selector shows selected Iteration name and date range in one control.
- [ ] Iteration selector options come from Timeboxes Iteration records.
- [ ] Iteration selector only shows Iterations for the selected Project/Team context.
- [ ] Previous/next arrows change selected Iteration.
- [ ] Changing selected Iteration refreshes metrics and list.
- [ ] Metric strip shows Planned Velocity, Iteration End, Accepted, Defects and Tasks.
- [ ] Defects metric counts work items of type Defect in the selected Iteration.
- [ ] Work item list shows only items assigned to selected Iteration.
- [ ] Work item list is sourced from Backlog/work_items assignment.
- [ ] Work item list shows Iteration column.
- [ ] List does not show a per-row Defects column.
- [ ] Quick search `Filter items...` works.
- [ ] Show Filter / Manage Filters supports multi-column combined filters.
- [ ] Sort icons exist on sortable headers.
- [ ] Column resize works.
- [ ] Inline edit works for Name, Schedule State, Plan Est and Owner.
- [ ] Inline edit works for Iteration and moves the item to the selected target Iteration after refresh/re-query.
- [ ] Schedule State options are exactly Idea, Defined, In-Progress, Completed, Accepted, Release.
- [ ] Row click opens full Work Item Detail.
- [ ] Work Item Detail right panel shows Iteration field.
- [ ] Add Item button is beside filter controls.
- [ ] Quick Create button is not displayed.
- [ ] Bottom Add work item row is not displayed.
- [ ] Add Item modal only supports Story and Defect.
- [ ] Add Item modal does not include Feature, Task, Schedule State, or Choose Existing Backlog Item.
- [ ] Add Item modal pre-fills selected Iteration as read-only context.
- [ ] Add Item auto-fills Project and Team from the active workspace selector and selected Iteration.
- [ ] Create Item creates a Story/Defect assigned to the selected Iteration.
- [ ] Created Story/Defect also appears in Backlog for the same Project/Team.
- [ ] Create with details opens full Work Item Detail using the Backlog detail flow.

## 14. Development Task Plan

| ID | Module | Development task | Deliverable | Dependency | Estimate |
|---|---|---|---|---|---:|
| P2-IS-01 | Contract | Define Iteration Status DTOs and query params | OpenAPI/API contract for selector, metrics, list | P2.2 Iteration DTO | 1.0h |
| P2-IS-02 | Backend | Implement Iteration selector source | Timeboxes Iteration records sorted by date | P2.2 Iteration backend | 0.75h |
| P2-IS-03 | Backend | Implement Iteration Status metrics | Planned velocity, end days, accepted, defects, tasks | Work item iteration assignment | 1.25h |
| P2-IS-04 | Backend | Implement Iteration work item list | Search/filter/sort/pagination by selected Iteration, including Iteration field | P2.1 list patterns | 1.5h |
| P2-IS-05 | Backend | Support inline update fields | PATCH title/status/iteration/estimate/owner with permission | Work item update API | 1.0h |
| P2-IS-06 | Backend | Create Story/Defect into Iteration | POST selected Iteration work item endpoint | Work item create API | 1.0h |
| P2-IS-07 | Frontend | Build Track > Iteration Status route/header | Track dropdown, title, selector, no old context bar | App shell | 1.0h |
| P2-IS-08 | Frontend | Build metrics strip | Metrics cards and loading/empty states | P2-IS-03 | 0.75h |
| P2-IS-09 | Frontend | Build enhanced Iteration list | Backlog-style search/filter/sort/resize/pagination, including Iteration column | P2-IS-04 | 1.75h |
| P2-IS-10 | Frontend | Implement inline editing | Name/status/iteration/estimate/owner update flow | P2-IS-05 | 1.25h |
| P2-IS-11 | Frontend | Implement Add Item modal | Story/Defect create and create-with-details flow | P2-IS-06 | 1.25h |
| P2-IS-12 | Frontend | Work Item Detail right-panel Iteration field | Detail opened from Iteration Status shows editable Iteration | P2-BL detail field | 0.5h |
| P2-IS-13 | Verification | Unit/contract/e2e tests | Selector, metrics, filters, iteration column, create, detail route | P2-IS-01..12 | 1.0h |

Suggested P2.3 estimate: 14.0h.

## 15. Out Of Scope And Follow-up Notes

| Item | Status | Target/reason |
|---|---|---|
| Team Board | Future backlog | Optional future board view |
| Team Status | Deferred | Phase 3 |
| Board drag/drop execution | Future backlog | Optional future board behavior |
| Existing backlog assignment from Add Item modal | Deferred | Assignment is handled through the Work Item `Iteration` field in Backlog list and Work Item Detail |
| Dedicated Start/Close/carry-over workflow | Not required | Confirmed baseline uses manual Iteration status changes and manual Story/Defect movement between Iterations |
| Carry-over unfinished work | Deferred | Depends on Close Iteration workflow |
| Saved Views | Deferred | Can be added after list/filter contract stabilizes |
| Release and Milestone management | Deferred | Phase 3 |
| Permission role matrix | Follow-up | Current mockup assumes admin/full access |
| Chart drilldown | Follow-up | `View Charts` is placeholder in P2.3 |

## 16. BA Readiness Conclusion

P2.3 Iteration Status is ready for development based on the current approved mockup.

The only remaining items are explicitly deferred follow-ups and should not block P2.3 implementation.
