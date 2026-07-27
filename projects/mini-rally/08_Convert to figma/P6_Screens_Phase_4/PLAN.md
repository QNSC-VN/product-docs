# Plan 6 — Convert Screens: Phase 4 Governance

## Goal

Convert Notifications, Roles & Permissions, Settings and Audit with explicit role-aware UX and BE contracts.

## Checklist

- [x] P6.a Convert notification list/popup, unread/read, filter and work-item routing states.
  - [x] New `Icon/Flag`, `Icon/Hash`; new `Notification Card` component (4 variants); `SCR-08 Notifications` (header, filter tabs, list, popup overlay).
- [x] P6.b Convert role matrix and project/team scope UI with editable/read-only/denied states.
  - [x] New `Permission State Chip` (4 variants + Locked property); `SCR-09 Settings — Roles & Permissions` (sidebar, matrix header, 12 representative rows covering every E/R/D/H visual case).
- [x] P6.c Convert workspace/project settings, users, workflow statuses, labels and audit rows.
  - [x] `SCR-10` Workspace Settings, `SCR-11` Teams, `SCR-12` User Management, `SCR-13` Audit Log.
  - [x] Workflow Status and Labels resolved as explicitly out-of-scope per Phase 4.3 SRS §5/§6 (deferred to Future Backlog) — not built, not a new open question.
- [x] P6.d Convert destructive confirmation and security-sensitive action patterns.
  - [x] Fixed a real gap: `Dialog` `Type=Destructive Confirmation` always showed the typed-name field; added a `Require Typed Name` boolean property so ordinary destructive actions (Archive/Restore/Deactivate) don't force typing, only Delete Project/Remove User Access do, per SRS §9.
- [x] P6.e Prototype Workspace Admin, Project Admin and Project Member paths.
  - [x] Documented as an RBAC overlay (per P3.f precedent) rather than duplicated screens; found and resolved a wording-vs-mockup discrepancy (SRS says PA/PM "do not see" Settings items = H, mockup renders them visible-but-locked = D) in favor of the SRS per source precedence.
- [x] P6.f Validate against Phase 4 SRS/checklist and update UI/API/RBAC contracts and coverage.
  - [x] Reuse audit: 0 broken instances across all 6 new screens (`SCR-08`–`SCR-13`).
  - [x] `P6_SCREEN_CONTRACTS.md` — Contracts 13-17, Q-15/Q-16 recorded.
  - [x] `CONVERSION_PROGRESS.md` coverage matrix and gate log updated; tracker set to `AWAITING PLAN 6 CONFIRMATION`.

## Exit criteria

- Governance screens show a precise hidden/disabled/read-only/denied contract.
- Notifications, RBAC, settings and audit all have data/action/error states.
- No security claim is based on Figma/UI alone.

## Gate

Set tracker to `AWAITING PLAN 6 CONFIRMATION`; stop until `CONFIRM PLAN 6`.

