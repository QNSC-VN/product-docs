# SRS Draft - Phase 3 Team Board And Team Status

## 0. Document Control

| Attribute | Value |
|---|---|
| Module ID | `P3-TEAM-BOARD-STATUS` |
| Status | Moved from Phase 2 / Pending BA confirmation |
| Updated date | 2026-06-28 |
| Scope | Track > Team Board, Track > Team Status |
| Priority | Phase 3 candidate |
| Depends on | Phase 2.1 Backlog Enhancement, Phase 2.2 Timeboxes/Iterations, Phase 2.3 Iteration Status |
| Not included in Phase 2 | Team Board, Team Status, Board drag/drop, WIP enforcement, Team Status dashboard |

## 1. BA Decision

On 2026-06-28, BA moved `Team Board` and `Team Status` out of Phase 2.

Phase 2 must focus on:

```text
Project -> Team -> Backlog -> Iteration assignment -> Iteration Status
```

Phase 3 may continue from the current mockup direction for board/status execution, but dev agents must not implement this document during Phase 2.

## 2. Phase 3 Candidate Scope

### 2.1 Team Board

Current mockup direction to preserve:

- Entry point: `Track > Team Board`.
- Iteration selector reads Iteration records from `Plan > Timeboxes`.
- Board works against work items assigned to the selected Iteration.
- Board columns: `Idea`, `Defined`, `In-Progress`, `Completed`, `Accepted`, `Release`.
- Work item cards show type, id, title, priority, estimate, owner and blocked/task indicators.
- Card click opens Work Item Detail.
- Drag/drop between columns is a future behavior and must persist Schedule State only after transition rules are confirmed.
- Add Item/create behavior needs BA confirmation before development.

### 2.2 Team Status

Team Status is not defined yet. Candidate direction:

- Entry point: `Track > Team Status`.
- Team-level rollup for the selected Project/Team/Iteration context.
- Potential KPIs: team workload, blocked work, accepted points, remaining work, defects, tasks, owner distribution.
- It should read from the same Backlog/work_items and Iteration assignment source as Iteration Status.

## 3. Pending BA Confirmations

| ID | Question | Current note |
|---|---|---|
| P3-TB-Q01 | Should Team Board create Story/Defect only, or also Task/Feature? | Not decided |
| P3-TB-Q02 | Should drag/drop immediately update Schedule State? | Not decided |
| P3-TB-Q03 | What transition rules are allowed between states? | Not decided |
| P3-TB-Q04 | Is WIP limit required, and where is it configured? | Not decided |
| P3-TB-Q05 | Should existing backlog assignment be available on the board? | Phase 2 handles assignment from Timeboxes |
| P3-TB-Q06 | How does Start/Close Iteration and carry-over relate to Board? | Deferred |
| P3-TS-Q01 | What KPIs belong in Team Status? | Not decided |
| P3-TS-Q02 | Is Team Status list, dashboard, or hybrid? | Not decided |
| P3-TS-Q03 | What permissions apply to Team Board/Team Status? | Current mockup assumes admin |

## 4. Development Guidance

- Do not implement Team Board or Team Status in Phase 2.
- Do not let Team Board introduce a second work item store.
- Any future board/status screen must reuse Phase 2 Backlog and Iteration assignment data.
- Keep Schedule State enum aligned with Iteration Status unless BA defines a separate workflow.
- Treat this file as a placeholder until BA marks it `Ready for Development`.
