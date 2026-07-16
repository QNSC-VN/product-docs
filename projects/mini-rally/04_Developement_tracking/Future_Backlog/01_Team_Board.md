# Future Backlog - Team Board

## 0. Document Control

| Attribute | Value |
|---|---|
| Backlog item ID | `FB-TEAM-BOARD` |
| Status | Future backlog / Not planned for current Agile management MVP |
| Updated date | 2026-07-12 |
| Scope | Optional future `Track > Team Board` |
| Priority | Future / optional |
| Depends on | Phase 2.2 Iterations manual lifecycle baseline, Phase 2.3 Iteration Status, Phase 3 Team Status |
| Not included in | Phase 2, Phase 3, Phase 4 core scope |

## 1. BA Decision

On 2026-07-12, BA decided that Team Board is not required for the main Agile management flow.

The core Agile management flow is:

```text
Backlog -> Timeboxes / Iterations -> Iteration Status -> Team Status -> Release / Milestone / Quality tracking
```

Team Board is preserved as a future backlog item only. It must not block Phase 3 documentation, governance planning, mockup approval or development handoff.

## 2. Future Candidate Scope

If BA later re-prioritizes Team Board, the preserved direction is:

- Entry point: `Track > Team Board`.
- Iteration selector reads Iteration records from `Plan > Timeboxes`.
- Board works against work items assigned to the selected Iteration.
- Board uses the manual Iteration lifecycle baseline from `Phase 2/02_Iterations/SRS.md` section 10.1.
- Board columns may reuse Schedule State values: `Idea`, `Defined`, `In-Progress`, `Completed`, `Accepted`, `Release`.
- Work item cards may show type, id, title, priority, estimate, owner and blocked/task indicators.
- Card click opens Work Item Detail.
- Drag/drop between columns must not be implemented until transition rules are confirmed.
- WIP limits are not part of the current MVP and need future configuration rules if reintroduced.
- Board must not introduce a separate carry-over workflow; teams manually move Story/Defect items between Iterations.
- Board must not lock Iteration scope in `Committed`; authorized users can still add, remove or move Story/Defect items.
- Board may reflect the auto `Accepted` Iteration status when all assigned Story/Defect items are `Accepted`, but user manual status control remains allowed.

## 3. Preserved Iteration Lifecycle Dependency

If Team Board is reintroduced, it must use the Iteration lifecycle defined in `Phase 2/02_Iterations/SRS.md` section 10.1:

| Iteration state | Future Team Board behavior |
|---|---|
| `Planning` | Board can preview items assigned to the planned Iteration. |
| `Committed` | Board can act as an execution surface for assigned Story/Defect work items, but scope remains editable by authorized users. |
| `Accepted` | Board can remain usable/readable for the accepted Iteration; lifecycle state alone must not lock scope or status editing. |

Confirmed lifecycle rules to preserve:

- New Iteration defaults to `Planning`.
- User manually changes Iteration status from `Planning` to `Committed` when the team commits the sprint scope.
- Assigning Story/Defect items to an Iteration does not automatically commit the Iteration.
- User manually accepts Story/Defect items when the work is accepted.
- When all assigned Story/Defect items are `Accepted`, system auto-sets the Iteration to `Accepted`.
- Auto-setting Iteration to `Accepted` is a convenience behavior; user can still manually change Iteration status if permitted.
- There is no dedicated carry-over workflow/modal in the confirmed baseline.
- Teams manually move unfinished Story/Defect items to another Iteration by editing the Work Item `Iteration` field.
- Moving an item to another Iteration updates the existing Work Item assignment; it must not clone Work Items.

## 4. Pending Future Questions

| ID | Question | Current note |
|---|---|---|
| FB-TB-Q01 | Should Team Board create Story/Defect only, or also Task/Feature? | Not decided; future only |
| FB-TB-Q02 | Should drag/drop immediately update Schedule State? | Not decided; future only |
| FB-TB-Q03 | What transition rules are allowed between states? | Not decided; future only |
| FB-TB-Q04 | Is WIP limit required, and where is it configured? | Not decided; future only |
| FB-TB-Q05 | Should existing backlog assignment be available on the board? | Phase 2 handles assignment from Backlog/Work Item Detail |
| FB-TB-Q06 | How does Iteration lifecycle and carry-over relate to Board? | Decided: use Phase 2 Iterations SRS section 10.1; no dedicated carry-over workflow |

## 5. Development Guidance

- Do not implement Team Board in current planned phases unless BA re-prioritizes it.
- Do not introduce a second work item store.
- Future Team Board must reuse Backlog/work_items and Iteration assignment data.
- Keep Schedule State enum aligned with Iteration Status unless BA defines a separate workflow.
- Reuse the manual Iteration lifecycle/status baseline from Phase 2 Iterations.
- Treat this file as a backlog preservation note, not a ready-for-development SRS.
