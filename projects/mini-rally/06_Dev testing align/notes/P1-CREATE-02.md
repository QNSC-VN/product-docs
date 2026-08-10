# P1-CREATE-02 - Create with details

## Scope

Verify that `Create with details` creates exactly one Story/Defect, opens Work Item Detail for the same generated ID, and preserves the Quick Create/default values.

## Expected

- Create exactly one Work Item.
- Navigate to Detail using the ID returned by the create operation.
- Returning to Backlog shows exactly one matching source record.
- Type, Title, Project, Team, Owner and Plan Estimate persist from Quick Create.
- Schedule State and Flow State default to `Idea`.
- Release and Iteration default to `Unscheduled`.

## Mockup Result - Pass

- Entered Story title `MOCK CWD AUDIT 20260719 2258` and clicked `Create with details`.
- Mockup created `US-4822` and immediately opened Work Item Detail for `US-4822`.
- Detail preserved Story, title, Project `NXP`, Team `Core Platform`, Owner `Marcus Webb`, and Plan Estimate `0`.
- Schedule State and Flow State were both `Idea`.
- Release and Iteration were both `Unscheduled`.
- Returning to Backlog showed exactly one `US-4822` row with the same title.

## DevInt Result - Blocked

- Used the controlled Story `DEVINT Audit Story Quick Create Team 20260719 2110` in NXP / All Teams.
- Clicking `Create with details` kept the user in the modal and showed `Team is not linked to this project`.
- No Work Item Detail route opened.
- After closing the modal, searching the exact title returned no Backlog record.
- Therefore same-ID navigation, duplicate prevention and default-field persistence are not testable in DevInt yet.

## Approved Dev Fix Direction

- Resolve the confirmed `P1-CREATE-01` Project/Team/Owner Quick Create contract first.
- Implement `Create with details` as one create transaction followed by navigation using the returned Work Item ID.
- Do not create a separate draft/detail copy.
- Retest one Story and one Defect, verifying Detail and Backlog share the same ID and values.

## Status

- Audit Status: `Blocked`.
- BA Confirmation: `Fix Direction Approved` because this inherits the already confirmed `P1-CREATE-01` defect; no new business decision is required.
