# Phase 5-6 Deployed Product Test Plan

**Environment:** `https://rally-dev.qnsc.vn/`
**Approved references:** Phase 5 Portfolio Items and Capacity Planning SRS; Phase 6 Release Tracking and Reports SRS; approved local mockup.
**Scope:** FE behavior, business rules, cross-screen consistency, authorization behavior visible through the product, and persisted results after reload/session restore.
**Out of scope:** database schema, API implementation design and infrastructure changes.

## 1. Goal

Prove that the deployed product supports the approved Phase 5-6 flow and does not break the Phase 0-4 Agile lifecycle:

```text
Project/Team context
  -> Epic -> Feature -> Story/Defect -> Task
  -> Release and Iteration assignment
  -> Capacity Plan Draft/Publish
  -> Release Tracking
  -> Burndown / Velocity / Team Capacity reports
```

## 2. Test status

| Status | Meaning |
|---|---|
| Pass | Expected result is fully proved with evidence. |
| Partial | Some behavior passes, but one or more required branches remain unproved or incorrect. |
| Fail | Reproducible behavior conflicts with the approved SRS/mockup. |
| Blocked | Cannot execute because required account, permission, data or environment is missing. |
| Not Run | Scenario has not been executed. |
| Future Backlog | BA explicitly excluded it from the current delivery scope. |

## 3. Required test data and accounts

- One controlled Project with at least two Teams.
- Two Releases with different date windows.
- At least three completed Iterations plus one active Iteration, aligned across Teams by stable timebox identity.
- Direct Feature, Derived Feature and Unparented Story/Defect examples.
- Story/Defect examples in `Completed`, `Accepted` and `Release` states with Plan Estimate.
- Tasks with Estimate, ToDo and Actual values; member capacity records.
- One Workspace Admin plus normal users assigned `Admin` and `Editor` across at least two Projects. Include one user with an unassigned Project.
- Notification rows and a safe sender/recipient pair for carried Phase 4 checks.

Use the prefix `P56-AUDIT-` for records created during this audit. Do not delete or alter pre-existing business records. Destructive cleanup, role changes and workspace-wide changes require BA approval at action time.

## 4. Execution sequence

| Step | Area | Main checks | Exit condition |
|---|---|---|---|
| 0 | Setup | Confirm URL/build, account, Project/Team scope, seed data and evidence folder | Dependencies are known; blockers recorded |
| 1 | Carryover Phase 0-4 | Re-run every Still Open, Partial, Failed, Blocked and Deferred case | Every carried case has a current result |
| 2 | Phase 5 navigation/access | Portfolio menu, route access, global context and per-Project `Admin`/`Editor`/unassigned outcomes | Navigation and access boundary confirmed |
| 3 | Portfolio Items | Epic/Feature CRUD, hierarchy, inline edit, filters, children, archive and Work Item Feature link | Same IDs and values remain consistent across screens |
| 4 | Capacity Planning | Plan uniqueness, Draft editing, Team/Feature allocation, calculations, Publish variants, Revert and RBAC | Lifecycle and calculations confirmed after reload |
| 5 | Release Tracking | Buckets, scope, unit, sorting, issues, totals, history and empty states | RT acceptance checklist passes or gaps are logged |
| 6 | Reports | Burndown history, Velocity classification and Team Capacity projection | Calculations match controlled data |
| 7 | E2E regression | Feature -> Story/Defect -> Task -> Iteration/Release -> reports | One complete business flow is traceable end to end |
| 8 | Handoff | BA confirms gaps, owner and fix direction | DEV package and BA document updates are separated |

## 5. Checkpoint method

For each screen/function group:

1. The BA/user selects a Scenario ID and checks its Preconditions and Test Data in the Excel tracker.
2. The BA/user executes the numbered Detailed Test Steps and records Actual Result, Current Status, Evidence, Gap/Comment, Tester and Test Date in the same row.
3. `Pass` requires every Expected Result branch to be proved; otherwise use `Partial`, `Fail` or `Blocked` and explain why.
4. A preliminary Codex observation remains historical evidence and does not replace the user-owned current result.
5. Codex executes or re-tests only the exact Scenario ID requested by the user, then waits for BA confirmation before changing any business conclusion.

## 6. Current blockers from earlier testing

The new tracker carries every unresolved Phase 0-4 row, including:

- notification filters/read persistence and assignment/mention events blocked by missing data;
- per-Project `Admin`, `Editor`, unassigned and denied-route checks blocked until controlled users and assignments are available;
- the deferred Invite flow;
- all previous Still Open, Partial and Failed rows that require regression after the Phase 5-6 deployment;
- Future Backlog rows retained for visibility but not treated as current failures.

## 7. Initial deployed-product inventory

On 2026-08-05 the signed-in environment exposed `Portfolio Items`, `Capacity Planning`, `Release Tracking` and `Reports`. The active Project initially contained no Release, Iteration, Portfolio Item or Capacity Plan data. The later controlled retest result now lives in `../PHASE_0_6_AUDIT_TRACKER.xlsx`.

## 8. Current authorization baseline

- Workspace Admin is assigned internally and has company-wide access. The account is not added to Project membership lists.
- Every normal user's access is set independently per Project: `Admin` or `Editor`.
- Project `Admin` manages delivery features in the assigned Project, including Portfolio, Capacity, Release and Reports, but cannot CRUD Projects/Teams or manage user access.
- `Editor` manages Backlog Work Items/Tasks, Quality Defects and Iteration Status only within assigned Teams.
- No Project assignment means the Project is hidden and direct URLs are denied. Viewer/selectable No Access are Future Backlog.
- Project access changes take effect on next sign-in; company disable/removal takes effect on next refresh.
