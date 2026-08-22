# P0-SHELL-03 — Global Search

## Audit scope

- Environment: `https://rally-dev.qnsc.vn/`
- Account: `hieuvbm@qnsc.vn`
- Audit date: 2026-07-19
- Context: `NXP / All Teams`
- Route: `/backlog`
- Mutation level: read-only; no application data changed

## Source-of-truth comparison

- Phase 0 App Shell SRS, `SHELL-FR-009`: Global Search opens a search overlay/page, but Phase 0 may provide only the contract.
- Current mockup: renders `Search all work items...` as a visual input with no search behavior.
- Screen traceability: explicitly marks Global Search as an input that does not search.
- Audit tracker before this execution: expected the search to return permitted Work Items and preserve their identity. This is stricter than the confirmed Phase 0 documentation and therefore requires BA scope confirmation.

## DevInt execution

1. Opened NXP Backlog and confirmed `DE-1 — CI pipeline fails intermittently on Windows build agents` exists.
2. Entered `DE-1` in the top-level `Search all work items` input and waited.
3. Pressed Enter.
4. Entered `DEVINT-NO-MATCH-999` and waited.
5. Inspected the page for search dialogs, listboxes, overlays, results, empty state and route changes.
6. Cleared the input.

## Observed result

- The input accepts text.
- No search overlay/page appears.
- No result is returned for known ID `DE-1`.
- Enter does not navigate; the route remains `/backlog`.
- No explicit empty state appears for `DEVINT-NO-MATCH-999`.
- The input was cleared after testing.

## BA confirmation

On 2026-07-19, BA confirmed **functional Global Search is Future Backlog**. Phase 0–3 only requires the contract-only input, so DevInt and the mockup match current scope. No DevInt fix is required for this checkpoint.

Future implementation should include:

1. Search by Work Item ID and title.
2. Permission and Project/Team-aware result filtering.
3. Loading, no-result and error states.
4. Result identity showing type, formatted ID and title.
5. Opening a result navigates to the correct Work Item without losing identity.
