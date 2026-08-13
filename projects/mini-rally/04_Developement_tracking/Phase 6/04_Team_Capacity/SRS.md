# Phase 6 - Reports > Team Capacity

> **Project Access:** Workspace Admin and assigned-Project `Admin` can open this read-only report. `Editor` and `No Access` cannot open Reports. (Access model is now 3-level: Workspace Admin / Admin / Editor; the former Viewer level is removed.)

## 1. Scope boundary

Team Capacity is a read-only report for one selected Iteration. It reuses Team Status capacity and Task-hour data and does not create a second planning or capacity-editing workflow.

This package defines BA rules and the approved mockup contract. Production queries, API implementation, authorization and automated tests remain DEV-owned.

## 2. Filter and grouping contract

- Project and Team are read from the global workspace context.
- The report has an Iteration picker using the same previous/select/next pattern and date display as Iteration Burndown.
- When a specific Team is selected, show exactly that Team and its member rows.
- When `All Teams` is selected, show all Teams in the Project as Team rows. Each Team row can expand/collapse its member rows.
- A person belonging to more than one Team appears once inside each applicable Team. Do not merge cross-Team membership into one row.
- The report title shows the selected scope, for example `Team Capacity - All Teams` or `Team Capacity - Identity & Access`.

## 3. Approved measures

The report contains exactly four hour measures:

| Measure | Formula | Source |
|---|---|---|
| Capacity | `SUM(memberIterationCapacity.capacityHours)` | Same persisted Project/Team/Iteration/Member capacity used by Team Status |
| Estimate | `SUM(task.estimate)` | Tasks under scoped Story/Defect work |
| ToDo | `SUM(task.todo)` | Tasks under scoped Story/Defect work |
| Actual | `SUM(task.actuals)` | Tasks under scoped Story/Defect work |

Rules:

- Every Team total is the sum of its displayed member rows.
- All Teams totals are the sum of displayed Team rows.
- The scoped Task set is determined from the Task's parent Story/Defect Project, Team and Iteration assignment.
- Parent status does not exclude its Tasks. Accepted or Released work still contributes Task hours while it remains assigned to the selected Iteration.
- `ToDo` is not calculated as `Estimate - Actual`.
- `Actual` is not capped at `Estimate`.
- Hours must be numeric and non-negative. Zero is valid.

## 4. Member inclusion and ownership

Build the member list as the union of:

1. members with a capacity record for the selected Project/Team/Iteration; and
2. owners of Tasks in the selected scope.

This ensures a member with planned capacity but no Tasks remains visible, and a Task owner without a capacity record is not silently dropped. A missing capacity record displays `0h` and should be treated as a planning/data-quality gap, not inferred from Task hours.

Unassigned Tasks, if supported by the shared Task model, appear under an `Unassigned` group with `0h` capacity.

## 5. Logical data contract

```text
MemberIterationCapacity {
  projectId,
  teamId,
  iterationId,
  memberId,
  capacityHours,
  updatedAt
}

TeamCapacityRow {
  projectId,
  teamId,
  iterationId,
  memberId,
  memberName,
  capacityHours,
  estimateHours,
  todoHours,
  actualHours
}
```

Capacity must use the same source/table/API domain as `Track > Team Status`. The report may use a read-optimized endpoint, but it must not duplicate the capacity value into report-owned storage.

Suggested query response:

```ts
type TeamCapacityReport = {
  projectId: string;
  teamId: string | "all";
  iteration: { id: string; name: string; startDate: string; endDate: string };
  totals: {
    capacityHours: number;
    estimateHours: number;
    todoHours: number;
    actualHours: number;
  };
  teams: Array<{
    id: string;
    name: string;
    totals: TeamCapacityHours;
    members: Array<{
      id: string | null;
      name: string;
      hours: TeamCapacityHours;
    }>;
  }>;
};

type TeamCapacityHours = {
  capacityHours: number;
  estimateHours: number;
  todoHours: number;
  actualHours: number;
};
```

## 6. UI contract

- Header: report name and selected Team scope.
- Iteration picker: label, previous button, selected Iteration/date control, next button.
- Four top indicators: Capacity Hours, Estimate Hours, ToDo Hours, Actual Hours.
- Dense table columns: `Team / Member`, `Capacity`, `Estimate`, `ToDo`, `Actual`.
- Team rows use a distinct group style and expand/collapse control.
- Member rows are indented below their Team.
- No Utilization card, progress bar, extra chart, or editable capacity control is part of the approved report.
- Empty state explains whether there is no capacity and no scoped Task data for the selected Iteration.

## 7. Acceptance examples

1. Selecting `All Teams` shows Core Platform, Identity & Access and Data & Reporting as separate Team rows, each expandable to its members.
2. Selecting Identity & Access removes other Team rows and recalculates all four totals from Identity & Access only.
3. Changing the Iteration refreshes the four indicators and every Team/member value.
4. A member with `60h` capacity and no scoped Tasks displays `60h / 0h / 0h / 0h`.
5. A Task owner with no capacity record remains visible with `0h` capacity and their Task-hour totals.
6. If a Task has Estimate `6h`, ToDo `2h` and Actual `8h`, the report displays those values as-is; it does not cap Actual or derive ToDo.

## 8. DEV handoff requirements

- Reuse Team Status capacity persistence and authorization.
- Query using stable Project, Team, Iteration, Member, Work Item and Task IDs.
- De-duplicate Tasks by Task ID before aggregation.
- Apply Workspace timezone consistently to Iteration selection, though hour values themselves are not daily snapshots.
- Add calculation tests for selected Team, All Teams, multi-Team membership, task-only owners, capacity-only members and empty states.
