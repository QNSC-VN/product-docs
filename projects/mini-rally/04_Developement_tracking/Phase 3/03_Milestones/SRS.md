# SRS - Phase 3.3 Milestones

## 0. Document Control

| Attribute | Value |
|---|---|
| Module ID | `P3-MILESTONES` |
| Status | Ready for Development |
| Updated date | 2026-07-12 |
| Scope | Plan > Timeboxes > Milestones |
| Priority | Phase 3 candidate |
| Depends on | Phase 2.2 Timeboxes/Iterations, Phase 3.2 Release Management |
| Not included | Team Board, advanced portfolio roadmap, readiness checklist |

## 1. Goal

Milestones provide delivery checkpoints across one or more Projects, Teams and Releases. They are date-based planning records used to track major delivery gates such as release candidate, security review, UAT sign-off and general availability.

## 2. Business Flow

```text
User opens Plan > Timeboxes
-> User switches Type to Milestones
-> User creates or opens a Milestone
-> User links it to one or more Projects, Teams and Releases
-> User assigns Story/Defect work items to the Milestone
-> Milestone Artifacts dashboard shows assigned Story/Defect items
-> System derives target start/end dates from linked Releases
-> Team reviews name, target dates, status and detail metadata
```

## 3. Functional Requirements

| ID | Requirement |
|---|---|
| P3-MS-FR-001 | User can open `Plan > Timeboxes` and select `Milestones`. |
| P3-MS-FR-002 | Milestone dashboard shows only Name, Target Start Date, Target End Date and Status. |
| P3-MS-FR-003 | User can create a Milestone. |
| P3-MS-FR-004 | User can open Milestone detail. |
| P3-MS-FR-005 | Milestone detail shows Description and Notes rich text areas on the left, with metadata on the right. |
| P3-MS-FR-006 | Milestone statuses are `Planned`, `At Risk`, `Met`, `Missed`, `Cancelled`, `Completed`. |
| P3-MS-FR-007 | Milestone can be linked to multiple Releases. |
| P3-MS-FR-008 | Milestone can be linked to multiple Projects. |
| P3-MS-FR-009 | Milestone can be linked to multiple Teams. |
| P3-MS-FR-010 | Milestones are not Iterations and do not have velocity, task estimate or carry-over behavior. |
| P3-MS-FR-011 | Target Start Date is derived from the earliest Start Date among linked Releases. |
| P3-MS-FR-012 | Target End Date is derived from the latest Release Date among linked Releases. |
| P3-MS-FR-013 | Target Start Date and Target End Date are read-only derived fields for Milestones. |
| P3-MS-FR-014 | Milestone Artifacts are Story/Defect work items assigned to the Milestone. |
| P3-MS-FR-015 | Milestone does not include a readiness checklist in Phase 3.3. |
| P3-MS-FR-016 | Milestone detail shows Projects, Teams and Releases as selected-count summary controls in the right metadata panel. |
| P3-MS-FR-017 | Clicking a Projects, Teams or Releases summary opens a selection modal with search and checkbox selection. |
| P3-MS-FR-018 | Milestone detail has a dedicated Artifacts tab beside Details; the right metadata panel is hidden while Artifacts is active. |
| P3-MS-FR-019 | Milestone Artifacts dashboard uses the same presentation pattern as Backlog for assigned Story/Defect items. |
| P3-MS-FR-020 | Milestone Artifacts dashboard supports search, sort, resizable columns, pagination and inline edit where fields are editable. |
| P3-MS-FR-021 | A Story/Defect can be assigned to multiple Milestones only if it remains within each Milestone's selected Project/Team scope. |
| P3-MS-FR-022 | Removing a Story/Defect from a Milestone must not remove or change its Release assignment. |
| P3-MS-FR-023 | Assigning a Story/Defect outside the Milestone's selected Project/Team scope must be rejected. |

## 4. Data Source Rules

- Milestone can span multiple Projects.
- Milestone can span multiple Teams.
- Milestone references one or more Releases.
- Target Start Date equals the earliest `startDate` among linked Releases.
- Target End Date equals the latest `releaseDate` among linked Releases.
- If the linked Release list changes, target dates must be recalculated immediately.
- Target dates are not manually editable for Milestones.
- Milestone Artifacts are assigned Story/Defect work items, not uploaded files or external links in Phase 3.3.
- Milestone Artifact row data should reuse the Backlog work item list DTO where possible.
- A Story/Defect can be assigned to Milestone independently from Release assignment.
- Milestone artifact assignment is many-to-many from the Milestone perspective: a Milestone can have many Story/Defect artifacts, and the same Story/Defect may appear in more than one Milestone if the scope rules allow it.
- Removing a Story/Defect from a Milestone only removes that Milestone relationship.
- Adding or removing Milestone artifacts must not change Release assignment, Iteration assignment, Backlog rank or Work Item identity.
- Each artifact must belong to one of the Milestone's selected Projects and, when Team scope is selected, one of the Milestone's selected Teams.
- Projects, Teams and Releases are shown as compact selected-count summaries in the right metadata panel.
- User can click each summary to open a searchable modal and review/edit the selected items.
- Mockup shows an Artifacts tab beside Details with no right metadata panel.
- Milestone does not include readiness checklist behavior in Phase 3.3.

## 5. API Contracts

### 5.1 List Milestone Artifacts

```http
GET /api/milestones/{milestoneId}/artifacts?search={search}&page={page}&pageSize={pageSize}&sort={field}:{direction}
```

Response:

```ts
type MilestoneArtifactListResponse = {
  items: BacklogWorkItemListItemDto[];
  page: number;
  pageSize: number;
  total: number;
};
```

Rules:

- Artifact rows reuse the Backlog work item list DTO where possible.
- Valid artifact item types are Story and Defect.
- The response is filtered to work items assigned to the Milestone.
- Artifact dashboard inline edit must follow the same editability rules as Backlog.

### 5.2 Assign Milestone Artifacts

```http
PUT /api/milestones/{milestoneId}/artifacts
Content-Type: application/json

{
  "workItemIds": ["US-4821", "DE-1142"]
}
```

Rules:

- The payload replaces the Milestone artifact assignment list.
- Each work item must be accessible to the current user.
- Each work item must belong to an allowed Project/Team scope for the Milestone.
- Milestone artifact assignment is independent from Release assignment.
- Replacing the Milestone artifact list must not mutate Release assignment or Iteration assignment.
- Viewer mutation must return 403.

## 6. BA Confirmations

| ID | Question | Current note |
|---|---|---|
| P3-MS-Q01 | Is Milestone required for Phase 3 or optional? | Confirmed for Phase 3 |
| P3-MS-Q02 | Does Milestone live under Timeboxes or Releases? | Confirmed under Timeboxes as a type beside Iterations and Releases |
| P3-MS-Q03 | Can Milestone link multiple Releases? | Confirmed: Milestone has a Release list |
| P3-MS-Q04 | Does Milestone need readiness checklist? | Confirmed: no readiness checklist |
| P3-MS-Q05 | Final status options? | Confirmed: Planned, At Risk, Met, Missed, Cancelled, Completed |
| P3-MS-Q06 | Can Milestone span multiple Projects and Teams? | Confirmed: multiple Projects and multiple Teams |
| P3-MS-Q07 | What exact artifact behavior does Milestone need? | Confirmed: assigned US/DE Story/Defect work items, shown like Backlog |
| P3-MS-Q08 | Does Milestone need artifact upload/link objects? | Confirmed: no, Phase 3.3 artifacts are assigned work items |
| P3-MS-Q09 | Can the same Story/Defect be linked to multiple Milestones? | Confirmed for Phase 3.3 if Project/Team scope allows it |
| P3-MS-Q10 | Does Milestone assignment change Release assignment? | Confirmed: no, Milestone artifact assignment is independent |

## 7. Acceptance Criteria

1. Milestones are visible as Phase 3 scope.
2. Milestone list/create/detail are available in mockup.
3. Milestone does not behave like Iteration velocity planning.
4. Milestone supports multiple linked Releases.
5. Target Start Date is calculated from the earliest linked Release start date.
6. Target End Date is calculated from the latest linked Release end/release date.
7. Milestone supports multiple Projects and multiple Teams.
8. Milestone Artifacts tab lists assigned Story/Defect work items using Backlog-style dashboard presentation.
9. Milestone dashboard remains limited to Name, Target Start Date, Target End Date and Status.
10. Milestone does not include artifact upload/link objects in Phase 3.3.
11. Milestone does not include a readiness checklist.
12. Milestone artifact assignment rejects Story/Defect items outside selected Project/Team scope.
13. Removing a Milestone artifact leaves Release and Iteration assignment unchanged.
