# AI Execution Workflow — Mandatory Operating Instructions

## Objective

Tự vận hành conversion workflow từ mockup code sang Figma một cách tuần tự, có evidence, và chỉ dừng ở các gate cần user xác nhận.

## Startup protocol — must run every session

1. Read `CONVERSION_PROGRESS.md`.
2. Identify `Current plan` and its status.
3. Read `<current-plan-folder>/PLAN.md` completely.
4. Read every artifact referenced by that plan and any unresolved decision log.
5. Read only the required code/SRS/Figma evidence named in the plan; do not re-audit unrelated areas.

## State machine

```text
NOT STARTED → IN PROGRESS → REVIEW READY → AWAITING USER CONFIRMATION
                                              │
                           REQUEST CHANGES ───┤──→ IN PROGRESS (same plan)
                                              │
                           CONFIRM PLAN N ────┘──→ APPROVED → Plan N+1 IN PROGRESS
```

### Non-negotiable rules

1. `CONVERSION_PROGRESS.md` is the workflow state source of truth. Never infer approval from silence, a general acknowledgement, or a later unrelated message.
2. When status is `AWAITING ... CONFIRMATION`, stop all plan work. Reply only with the precise review package/gate if the user asks for status.
3. When the user requests changes, reopen **the same plan**. Update the affected artifacts, re-run validation, then return it to `AWAITING ... CONFIRMATION`.
4. Start the next plan only after explicit `CONFIRM PLAN N` or an equally unambiguous approval of its listed decisions.
5. Work autonomously inside an active plan: inspect source, create required artifacts, run checks, record results and fix issues without asking for routine approval.
6. Ask the user during an active plan only for a genuine decision fork that cannot be resolved from BA/SRS, mockup code, approved Figma design, or this workspace.
7. Before a Figma mutation, load the applicable Figma skill(s), inspect the target file and post the plan checklist. Figma mutations are sequential; validate each created unit before building on it.
8. Browser is only visual/runtime evidence. It is not the Figma authoring channel.
9. Never label a mockup interaction `backend-ready` solely because it works through React local state.
10. Do not alter production code or mockup code unless the user opens a separate refactor/implementation task.

## Per-plan execution loop

For every unchecked task ID in the active `PLAN.md`:

1. Read the named evidence/source.
2. Execute the smallest safe unit of work.
3. Update the plan artifact and progress tracker immediately after meaningful completion.
4. Run the plan's stated validation; fix failures before continuing.
5. Continue to the next unchecked task without waiting for user input.

When all tasks are complete:

1. Verify every exit criterion with evidence.
2. Update the plan's review summary and `CONVERSION_PROGRESS.md`.
3. Set status to `AWAITING PLAN N CONFIRMATION`.
4. Send the user a compact review package: what changed, links, validation, unresolved decisions and exact confirmation command.
5. Stop.

## Source precedence

1. Approved per-feature SRS, phase tracking and mockup checklist — business rules and acceptance scope.
2. Current mockup code/runtime — visual and interaction reference.
3. Approved Figma library/screens — design source of truth after the applicable plan is confirmed.
4. Mock data — examples only; never authority for API, persistence or security.

## Required commands for user gates

```text
CONFIRM PLAN 0
CONFIRM PLAN 1
...
CONFIRM PLAN 7
```

For revisions:

```text
PLAN N: change [artifact or decision] to [new direction]
```

## Resume prompt for another AI/session

```text
Open D:\Mini_Rally_pj\08_Convert to figma.
Read AI_EXECUTION_WORKFLOW.md, then CONVERSION_PROGRESS.md, then the active plan folder's PLAN.md and referenced artifacts.
Follow the state machine exactly. Work autonomously within the active plan, validate every required result, and stop only at an explicit user confirmation gate.
Do not edit Figma, mockup or production code outside the active plan.
```

