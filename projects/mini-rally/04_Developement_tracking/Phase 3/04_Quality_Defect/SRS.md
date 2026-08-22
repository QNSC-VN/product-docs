# SRS - Phase 3.4 Quality / Defect

## 0. Document Control

| Attribute | Value |
|---|---|
| Module ID | `P3-QUALITY-DEFECT` |
| Status | Ready for Development |
| Updated date | 2026-08-22 |
| Scope | `Quality > Defect` dashboard, Defect create/edit/delete, shared Defect detail |
| Priority | Phase 3 candidate |
| Depends on | Phase 1 Work Item base, Phase 2 Backlog/Detail behavior |
| Not included | Hard delete, restore UI, advanced quality governance or custom permission design |

## 1. Current Confirmed Direction

- Quality has a dedicated top navigation entry.
- Defect has a dedicated dashboard under `Quality > Defect`.
- Current mockup opens a defect dashboard using the Backlog dashboard template.
- Defects shown in `Quality > Defect` are the same Defect work items used in Backlog; Quality is a dedicated defect view, not a separate defect source.
- Confirmed dashboard columns: Rank, ID, Name, User Story, Severity, Priority, State, Flow State, Fixed In Build, Iteration, Submitted By and Owner.
- Dashboard supports search, filter placeholder, row selection, disabled/future bulk-action placeholder, sortable/resizable columns, pagination and detail panel.
- Defect can be created from Backlog and from `Quality > Defect`.
- Linked User Story is optional when creating or editing a Defect.
- Defect dashboard supports inline edit across editable fields.
- Backlog Defect and Quality Defect use the same Defect detail page.
- An authorized user may delete a Defect after confirmation. Delete is soft delete and removes it from active views while preserving related data for audit/recovery.
- `Closed` and `Closed Declined` remain normal Defect lifecycle outcomes when the record should be retained; they are not prerequisites for delete.
- Defect Flow State updates independently from Defect State.
- Delete permission follows the fixed Phase 4 Project/Team scope and `work_item.delete` capability.
- Reopen from `Closed` or `Closed Declined` is not part of Phase 3.4 acceptance until BA confirms permission, reason and audit rules.
- Bulk actions are not executable in Phase 3.4; any visible bulk-action placeholder must be disabled or clearly treated as future scope.

## 2. Confirmed Dashboard Columns

| Column | Notes |
|---|---|
| Rank | Defect ordering column. |
| ID | Defect ID. |
| Name | Defect title/name. |
| User Story | Linked user story. |
| Severity | Defect severity. |
| Priority | Defect priority. |
| State | Defect state. |
| Flow State | Defect flow state. |
| Fixed In Build | Optional manual build/version/release label where fix is/will be available. |
| Iteration | Assigned iteration. |
| Submitted By | User who submitted the defect. |
| Owner | Current owner. |

## 3. Functional Requirements

| ID | Requirement |
|---|---|
| P3-QA-FR-001 | User can open `Quality > Defect`. |
| P3-QA-FR-002 | `Quality > Defect` shows the same Defect work items as Backlog. |
| P3-QA-FR-003 | Defect dashboard uses the Backlog dashboard presentation. |
| P3-QA-FR-004 | Defect dashboard shows Rank, ID, Name, User Story, Severity, Priority, State, Flow State, Fixed In Build, Iteration, Submitted By and Owner. |
| P3-QA-FR-005 | User can create a Defect from Backlog. |
| P3-QA-FR-006 | User can create a Defect from `Quality > Defect`. |
| P3-QA-FR-007 | Parent/Linked User Story is optional and can reference only an active User Story in the same Project as the Defect. |
| P3-QA-FR-008 | User can inline edit editable Defect fields from the dashboard. |
| P3-QA-FR-009 | Backlog and `Quality > Defect` open the same Defect detail page. |
| P3-QA-FR-010 | Authorized user can delete a Defect after confirmation; delete is soft delete and removes it from active Backlog/Quality/Iteration/report results. |
| P3-QA-FR-011 | `Closed` and `Closed Declined` remain lifecycle choices for retaining the Defect and are not prerequisites for delete. |
| P3-QA-FR-012 | Defect State options are exactly `Submitted`, `Open`, `Fixed`, `Closed`, `Closed Declined`. |
| P3-QA-FR-013 | Defect Flow State options are exactly `Idea`, `Defined`, `In-Progress`, `Completed`, `Accepted`, `Release`. |
| P3-QA-FR-014 | Defect Flow State can be updated independently from Defect State. |
| P3-QA-FR-015 | Fixed In Build is an optional manual text field that captures the build/version/release label where the defect fix is expected or delivered. |
| P3-QA-FR-016 | Defect Schedule State and Flow State use the same six values, default to `Idea` and mirror two-way in MVP; Defect State remains independent. |
| P3-QA-FR-016A | Bulk actions must not execute in Phase 3.4 until BA confirms available actions and permissions. |
| P3-QA-FR-017 | Reopen from Closed/Closed Declined is deferred and must not be required for Phase 3.4 acceptance. |
| P3-QA-FR-018 | Parent User Story create/detail/inline selectors use one searchable source and exclude Stories from other Projects, inactive Stories and inaccessible records. |
| P3-QA-FR-019 | Saving, clearing or changing Parent User Story persists one optional Defect-to-Story relation and reloads consistently in Quality list, Backlog and Defect Detail. |
| P3-QA-FR-020 | Soft delete retains child Tasks, attachments, comments and relations, records the actor/action and performs no physical cascade delete. |

## 4. BA Confirmations

| ID | Question | Current note |
|---|---|---|
| P3-QA-Q01 | Does P3.4 cover only Defect dashboard or wider Quality workflows? | Confirmed: dashboard plus create/edit/detail behavior |
| P3-QA-Q02 | What is the final defect lifecycle/state transition set? | Confirmed: Submitted -> Open -> Fixed -> Closed; Submitted/Open -> Closed Declined; reopen is deferred until permission/audit rules are confirmed |
| P3-QA-Q03 | Which columns are required on the Defect dashboard? | Confirmed: Rank, ID, Name, User Story, Severity, Priority, State, Flow State, Fixed In Build, Iteration, Submitted By, Owner |
| P3-QA-Q04 | Which bulk actions are in Phase 3.4? | Deferred; bulk-action placeholder must be disabled/future only |
| P3-QA-Q05 | Is defect creation supported? | Confirmed: create from Backlog and Quality > Defect |
| P3-QA-Q06 | Is User Story required for Defect? | Confirmed: optional |
| P3-QA-Q07 | Can Defect be deleted? | Confirmed: yes, by authorized user through confirmation and soft delete; Closed/Closed Declined remain optional lifecycle outcomes |
| P3-QA-Q08 | What is Fixed In Build? | Confirmed: optional manual text field for the build/version/release label containing the fix |
| P3-QA-Q09 | Does Flow State depend on State? | Confirmed: Flow State updates independently |

## 5. Confirmed Defect Field Options

| Field | Options |
|---|---|
| Severity | None, Critical, Major Problem, Minor Problem, Trivial |
| Priority | None, Urgent, High, Normal, Low |
| State | Submitted, Open, Fixed, Closed, Closed Declined |
| Flow State | Idea, Defined, In-Progress, Completed, Accepted, Release |

## 6. Defect State Transition Rules

| From | To | Rule |
|---|---|---|
| Submitted | Open | Defect is accepted for triage/work. |
| Open | Fixed | Fix has been implemented or prepared. |
| Fixed | Closed | Fix is verified/accepted and defect is closed. |
| Submitted | Closed Declined | Defect is declined without active work. |
| Open | Closed Declined | Defect is declined after triage. |
| Closed | Open | Deferred; not required for Phase 3.4 acceptance until permission, reason and audit rules are confirmed. |
| Closed Declined | Open | Deferred; not required for Phase 3.4 acceptance until permission, reason and audit rules are confirmed. |

Notes:

- Flow State is a separate planning/workflow field and can be updated independently from State.
- Flow State mirrors Work Item Schedule State in MVP; changing either one sets the other to the same value.
- New Defect Schedule State and Flow State both default to `Idea`.
- Defect State remains a separate lifecycle and is not overwritten by Schedule/Flow changes.
- Fixed In Build should be available on the dashboard and detail page.
- Fixed In Build is optional and manually entered by the user.

## 7. API Contracts

### 7.1 Create Defect

```http
POST /api/defects
Content-Type: application/json

{
  "name": "Dashboard widget refresh loop causes memory leak",
  "projectId": "project-1",
  "userStoryId": null,
  "severity": "Major Problem",
  "priority": "High",
  "state": "Submitted",
  "flowState": "Defined"
}
```

Rules:

- `name`, `projectId`, `severity`, `priority`, `state` and `flowState` are required.
- `userStoryId` is optional. When present it must be the stable ID of an active `story` in the same Project; item key/title are display data, not the mutation identifier.
- The relation must be persisted as a dedicated Defect-to-Story reference if reusing a generic hierarchy field would overwrite another required parent relation.
- Create entrypoint exists from Backlog and `Quality > Defect`.
- Created Defect appears in both Backlog Defect view and `Quality > Defect`.

### 7.2 Update Defect Inline Fields

```http
PATCH /api/defects/{defectId}
Content-Type: application/json

{
  "name": "Dashboard widget refresh loop causes memory leak",
  "userStoryId": "story-uuid",
  "severity": "Critical",
  "priority": "Urgent",
  "state": "Open",
  "flowState": "In-Progress",
  "fixedInBuild": "Q4 2024 RC1",
  "iterationId": "iteration-1",
  "ownerId": "user-1"
}
```

Rules:

- PATCH accepts partial payload.
- Inline edit must be supported from the dashboard for editable fields.
- `userStoryId` may be a same-Project active Story ID or null. The API rejects cross-Project, inactive, non-Story and inaccessible targets.
- `fixedInBuild` is optional manual text.
- Invalid State, Flow State, Severity and Priority values must be rejected.
- Legacy Flow State `Code Review`, `Testing` and spelling `Released` are not valid after reconciliation.
- Reopen from `Closed` or `Closed Declined` should be rejected or hidden in Phase 3.4 unless BA later confirms permission and audit behavior.
- Bulk action endpoints are out of scope for Phase 3.4.

### 7.3 Delete Defect

```http
DELETE /api/v1/work-items/{defectId}
```

Rules:

- Target must be an active Defect in the caller's allowed Project/Team scope and caller must have `work_item.delete`.
- Successful delete sets `work_items.deleted_at` and writes an activity/audit event with actor and Defect ID.
- Child Tasks, attachments, comments and relations are retained. They are not physically deleted and do not appear independently in active views while the parent Defect is deleted.
- Deleted Defect is excluded from active Backlog, Quality, Iteration Status and report queries.
- UI must ask for confirmation. Cancel makes no change.
- Defect State may be any valid state at deletion time; `Closed` or `Closed Declined` is not required.
- Hard delete and restore UI are outside the current scope.

### 7.4 Defect Detail

Backlog Defect and `Quality > Defect` must navigate to the same Defect detail page and use the same detail API contract.

## 8. Acceptance Criteria

1. User can open `Quality > Defect`.
2. Defect dashboard is separate from Team Status, Release and Milestone screens.
3. Defect dashboard uses Backlog-style table behavior.
4. Defect dashboard shows the confirmed column set.
5. User can create Defect from Backlog.
6. User can create Defect from `Quality > Defect`.
7. Parent User Story is optional; its selector shows only active accessible Stories from the same Project.
8. User can inline edit editable Defect fields from the dashboard.
9. Backlog and Quality Defect use the same Defect detail page.
10. Authorized Delete Defect requires confirmation, soft-deletes the record, removes it from active views and retains related data for audit/recovery.
11. State transition rules follow the confirmed State flow.
12. Flow State can be changed independently from State.
13. Fixed In Build is visible on dashboard/detail as an optional manual text field.
14. Bulk action placeholder is disabled/future and does not execute Phase 3.4 mutations.
15. Reopen from Closed/Closed Declined is not required for Phase 3.4 acceptance.
16. Saving, changing or clearing Parent User Story is visible consistently after refresh in Quality list, Backlog and Defect Detail.
17. Canceling delete changes nothing; `Closed` and `Closed Declined` remain available as non-delete lifecycle outcomes.
