# Future Backlog — Iteration Status Board

## Document Control

| Attribute | Value |
|---|---|
| Backlog item ID | `FB-ITERATION-STATUS-BOARD` |
| Status | Future backlog / Not planned for Phase 0-4 MVP |
| Updated date | 2026-07-18 |
| Current baseline | `Track > Iteration Status` uses List view only |

## Confirmed boundary

- Phase 0-4 does not require a Board toggle or Board view on Iteration Status.
- Child Tasks are not standalone Iteration Status rows; they contribute to Tasks active and Totals through their parent US/DE.
- Deferring the Board must not remove List view, metrics, Totals, inline edit or Add Item behavior.

## Decisions required before implementation

1. Board columns and mapping to the shared US/DE status catalog.
2. Whether drag/drop changes both Schedule State and Flow State under the MVP mirror rule.
3. WIP limits, transition validation, permission and audit behavior.
4. Card fields, filters, rank behavior and accessibility requirements.
5. How Board changes remain synchronized with Backlog, Work Item Detail and Iteration Status List.

## Acceptance guard

- Missing Board behavior is not a Phase 0-4 defect.
- A future implementation must use the same Work Item identities and shared status values as the List; it must not introduce a second execution dataset.
