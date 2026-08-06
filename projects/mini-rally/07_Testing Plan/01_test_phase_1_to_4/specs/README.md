# Mini Rally Testing Pack

This folder collects BA/UAT, regression and future automation-ready test documentation for Mini Rally Phase 0-4.

## Source documents

- `04_Developement_tracking/Phase 0/*`
- `04_Developement_tracking/Phase 1/*`
- `04_Developement_tracking/Phase 2/*`
- `04_Developement_tracking/Phase 3/*`
- `04_Developement_tracking/Phase 4/*`
- `04_Developement_tracking/Future_Backlog/*`
- `00_Documents/mini_rally_usecase_role_mapping.md`
- `output/RALLY_MINI_RALLY_ALIGNMENT_GAP.md`

## Main business flow under test

```text
Login
-> Fixed Company context
-> Manage Project / Team / User
-> Select Project / Team context
-> Create and manage Backlog Story/Defect
-> Update Work Item detail, tasks, time, content, attachments and activity
-> Create Iteration for selected Project/Team
-> Assign Backlog item to Iteration
-> Track assigned items in Iteration Status
-> Review team execution in Team Status
-> Track delivery with Release / Milestone / Quality Defect views
-> Apply Notifications / RBAC / Settings / Audit governance
```

`Team Board`, `Iteration Status Board` and `Portfolio > Release Planning` are intentionally preserved in Future Backlog only. Release Progress is not required for the Phase 0-4 Agile management MVP test pass.

## Files in this folder

| File | Purpose |
|---|---|
| `TEST_STRATEGY.md` | Scope, test principles, entry/exit criteria and definition of "going in the right direction". |
| `PHASE0_TEST_SCENARIOS.md` | Phase 0 scenarios: Auth, App Shell, fixed Company context, Project CRUD. |
| `PHASE1_TEST_SCENARIOS.md` | Phase 1 scenarios: Manage, Backlog, Work Item, Task, Time, Content, Activity. |
| `PHASE2_TEST_SCENARIOS.md` | Phase 2 scenarios: Backlog Enhancement, Timeboxes/Iterations, Iteration Status. |
| `PHASE3_TEST_SCENARIOS.md` | Phase 3 scenarios: Team Status, Release Management, Milestones, Quality/Defect. |
| `PHASE4_TEST_SCENARIOS.md` | Phase 4 scenarios: Notifications, Roles & Permissions, Settings/User Management and Audit. |
| `E2E_BUSINESS_FLOW_COVERAGE.md` | Cross-phase E2E flows proving the product operates correctly as one business chain. |
| `E2E_AGILE_LIFECYCLE_RECONCILIATION.md` | Canonical end-to-end flow and metric assertions for the reconciled Phase 0-4 Agile lifecycle. |
| `TRACEABILITY_MATRIX.md` | Matrix linking phase/module/source document/test scenarios/out-of-scope notes. |

## Status convention

| Status | Meaning |
|---|---|
| `Not Run` | Not executed yet. |
| `Pass` | Executed and expected result is met. |
| `Fail` | Executed and expected result is not met. |
| `Blocked` | Cannot execute due to missing environment, account, data, API or permission. |
| `N/A` | Not applicable because the scope is future/deferred. |

## Tick rules

- Mark `Pass` only when the scenario has been executed in the target environment with minimum evidence.
- For BA PROD/UAT, only mark behavior that is visible or executable through allowed UI/API access.
- Future/deferred scope should be marked `N/A` or `Deferred`, not failed.
- If production does not allow self-service Workspace create/switch because the MVP is single-company, that is an expected Phase 0 result.
- For Phase 2, `All Teams` is a valid context; permission-specific restrictions are deferred to the permissions/governance phase.
- For Phase 3, `Team Board` is Future Backlog; missing board implementation is not a Phase 3 failure.
- Release Progress is Phase 5 `Portfolio > Release Planning`; its absence from Phase 3 is expected.
