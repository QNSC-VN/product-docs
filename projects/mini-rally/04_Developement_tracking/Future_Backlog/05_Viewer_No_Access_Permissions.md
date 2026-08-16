# Future Backlog - Viewer and Selectable No Access

## Status

Deferred from the current Project Access scope on 2026-08-14.

## Future capability

- `Viewer`: assigned-Project read-only access without Team membership.
- Selectable `No Access`: an explicit Access Level value if a future administration flow needs to retain an assignment row while denying Project access.

## Current behavior until implemented

- Project Access forms offer only `Admin` and `Editor`.
- A user without an Admin/Editor assignment has no Project Access row.
- Unassigned Projects are hidden and direct access is denied safely.
- No current test may fail because Viewer or selectable No Access is absent.
