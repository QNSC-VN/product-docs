# P1-CREATE-01 - Quick Create / Cancel

## Scope

Compare Mini Rally Phase 1 Work Item Create SRS/mockup against DevInt Backlog quick-create behavior.

## Expected

- Backlog `Create Work Item` opens `New Work Item`.
- Type is limited to `Story` and `Defect`.
- Modal includes Type, Project, Team, Title, Owner, Plan Estimate. Project and Team are required; Team must belong to Project.
- `Title` is required. `Create Item` and `Create with details` remain disabled until valid input exists.
- `Cancel` closes the modal and creates no Work Item.
- `Create Item` creates exactly one Story/Defect and returns to Backlog/list refresh.
- New Story/Defect defaults Schedule State = `Idea` and Flow State = `Idea`.

## DevInt Observed

- `Cancel` test passed: entered `DEVINT CANCEL AUDIT 20260719 2059`, clicked Cancel, modal closed, and searching the title returned no record.
- DevInt modal has Type, Title, Team, Owner, Plan Estimate, but no visible Project selector.
- Current NXP / All Teams context opened the modal with Team default `No team`; available Team options were `No team` and `Team Alpha`.
- Attempting `Create Item` with `No team` failed with an unexpected error reference.
- Retrying with `Team Alpha` failed with `Team is not linked to this project`.
- While testing, Backlog search retained the cancelled audit title filter, so the list stayed empty behind the modal.
- `Create Item` and `Create with details` correctly became enabled after entering a title.
- DevInt Owner defaults to `Unassigned`; the authenticated user is not selected by default.

## Mockup Observed

- Mockup modal includes the Project dropdown, Team dropdown, Type buttons, Title, Owner, Plan Estimate, Cancel, Create with details, and Create Item.
- Mockup defaults to the selected Project and current/first linked Team and uses only Story/Defect for Backlog quick create.
- For NXP, the Team dropdown shows `Core Platform`, `Identity & Access`, and `Data & Reporting`. It does not offer `No team`.
- Owner defaults to the signed-in user `Marcus Webb`. The mockup currently contains named users only, but BA has now confirmed that `Unassigned` must also be available.

## Confirmed Gaps

1. DevInt must show the editable required Project dropdown exactly as designed in the mockup/SRS, defaulting to the current Project. Current DevInt does not show Project.
2. Team is required. DevInt must only list Teams linked to the selected/current Project. `No team` must not be offered; `Team Alpha` appears but cannot create because it is not linked to NXP.
3. SRS `WIC-FR-005` is ambiguous (`required/optional by policy`) and must be clarified to `Team required` during final document reconciliation so SRS matches the confirmed mockup/business.
4. DevInt create error handling needs user-friendly validation. The unexpected error reference is not acceptable for a normal user correction path.
5. Search/filter state should not cause confusion during create. After a successful create, the product should either keep the filter and explain why the new item is hidden, or clear/refetch predictably.
6. DevInt Owner default does not match the confirmed rule. Quick Create must default Owner to the authenticated user, but the Owner dropdown must also allow the user to explicitly choose `Unassigned`. The mockup must add that option; SRS `WIC-FR-006` should be reconciled to the same rule after the audit.

## Proposed Fix Direction

- FE: align quick-create modal with SRS/mockup by adding the editable required Project dropdown, defaulting it to the current Project.
- FE/API: make Project drive a required Team dropdown; remove `No team` and only list/accept active Teams linked to the selected Project.
- FE: if a Project has no linked Team, disable create and show a clear Team validation/empty state.
- FE: replace generic unexpected error with field-level validation where possible.
- FE/API: default Owner to the authenticated user, keep `Unassigned` as an explicit user-selectable option, and filter named Owner options by selected Project/Team access.
- BA/Docs after full audit: change SRS `WIC-FR-005` and Team field validation from policy-ambiguous to `Team required`.
- BA/Docs after full audit: align SRS `WIC-FR-006` and the mockup to the confirmed rule: Owner defaults to the authenticated user and may be explicitly changed to `Unassigned`.
- Retest: create one controlled Story and one controlled Defect after the team/project selector is fixed, then verify default Schedule State/Flow State = `Idea` and list/detail persistence.

## BA Confirmation

- Confirmed on 2026-07-19: the current Mini Rally mockup/business is authoritative for DevInt Quick Create.
- Confirmed on 2026-07-19: Project and Team are required; Team must be linked to Project; `No team` is not allowed.
- Confirmed on 2026-07-19: Owner defaults to the authenticated user and also offers `Unassigned` as a manual choice.
- This supersedes the earlier temporary statement that Team was optional.

## Evidence

- `evidence/P1-CREATE-01/P1-CREATE-01-devint-create-error.png`
