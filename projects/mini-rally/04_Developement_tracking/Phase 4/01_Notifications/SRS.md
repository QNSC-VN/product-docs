# SRS - Phase 4.1 Notifications

## 0. Document Control

| Attribute | Value |
|---|---|
| Module ID | `P4-NOTIFICATIONS` |
| Status | BA/Mockup Ready |
| Updated date | 2026-07-17 |
| Scope | Notification bell, in-app popup, Notification Center, read/unread state, assignment/mention filters and routing to the related US/DE |
| Priority | P4.1 - required for Collaboration & Governance |
| Depends on | Phase 1 Work Items, Work Item Notes, Phase 4 RBAC baseline |
| Mockup source | `03_Mockup Design/src/app/pages/NotificationsPage.tsx`, `03_Mockup Design/src/app/components/layout.tsx`, `03_Mockup Design/src/app/model.ts` |
| Not included | API payload/contracts; generic comments, status changes, attachments, sprint/release/due-date reminders, preferences, email delivery, mobile push notifications, chat/messaging inbox and external integrations |

## 1. Goal

Notifications give users one in-app place to see only the work events that directly require their attention. Phase 4.1 covers the notification bell, in-app popup, unread count, Notification Center list, assignment/mention filters, read/unread persistence and routing to the related US/DE record.

The current scope is intentionally small: notify a user when a US/DE is assigned to that user, and notify a user when that user is mentioned in a Note on a US/DE.

## 2. Confirmed BA Decisions

| ID | Decision | Status |
|---|---|---|
| P4-NOTIF-DC-001 | Notifications are Phase 4.1 under Collaboration & Governance | Decided |
| P4-NOTIF-DC-002 | Notification Center is an in-app screen opened from the top navigation bell | Decided |
| P4-NOTIF-DC-003 | The bell shows an unread indicator/count based on unread notifications for the signed-in user | Decided |
| P4-NOTIF-DC-004 | Notification Center supports category filters | Decided |
| P4-NOTIF-DC-005 | Clicking a notification marks that notification as read | Decided |
| P4-NOTIF-DC-006 | `Mark all as read` marks all visible/current user notifications as read | Decided |
| P4-NOTIF-DC-007 | Clicking a notification must route to the related US/DE item or relation target | Decided |
| P4-NOTIF-DC-008 | Notification preferences are not required for Phase 4.1 | Decided |
| P4-NOTIF-DC-009 | Email notification is not required for Phase 4.1 | Decided |
| P4-NOTIF-DC-010 | Notification access must respect workspace/project/team permissions | Requires P4.2 alignment |
| P4-NOTIF-DC-011 | Visible Notification Center filters are limited to `All`, `Unread`, `Assigned` and `Mentions` | Decided |
| P4-NOTIF-DC-012 | Assignment notifications are created only when a US/DE is assigned to the signed-in user | Decided |
| P4-NOTIF-DC-013 | Mention notifications are created only when the signed-in user is mentioned in a Note on a US/DE | Decided |
| P4-NOTIF-DC-014 | New assignment/mention notifications should appear as an in-app popup for that user | Decided |

## 3. Current Mockup Baseline

Observed on 2026-07-13 from the running mockup:

- `TopNav` has a bell icon that opens the `Notifications` screen.
- The Notification Center header shows `Notifications`, unread count and `Mark all as read`.
- Visible filters are `All`, `Unread`, `Assigned` and `Mentions`.
- Mock data includes only `assigned` and `mention` types.
- A lightweight in-app popup is shown for the newest unread assignment/mention notification.
- Notification cards show type icon, title, body, project, actor avatar and relative time.
- Unread cards have a different border/background and unread dot.
- Clicking a card marks that card as read and opens the related US/DE Work Item detail.
- `Go to item` opens the same related US/DE target.

## 4. Business Flow

```text
System records a relevant event
-> System determines recipients based on event type and permissions
-> System creates notification records for each recipient
-> User sees an in-app popup for the new notification
-> User sees unread indicator in the top navigation bell
-> User opens Notifications
-> User filters by All, Unread or category
-> User opens a notification or marks all as read
-> System persists read state
-> If user opens/clicks a notification, system routes to the related US/DE item or relation target
```

## 5. Notification Event Taxonomy

| UI category | Event type | Example source | Route target |
|---|---|---|---|
| Assigned | `assigned` | US/DE assignee changed to current user | Assigned US/DE Work Item detail |
| Mentions | `mention` | Current user is mentioned in a Note on a US/DE | US/DE Work Item detail that contains the Note mention |

## 6. Functional Requirements

| ID | Requirement |
|---|---|
| P4-NOTIF-FR-001 | User can open Notification Center from the top navigation bell. |
| P4-NOTIF-FR-002 | Bell indicator reflects unread notification count for the signed-in user. |
| P4-NOTIF-FR-003 | Notification Center shows unread count in the header. |
| P4-NOTIF-FR-004 | Notification Center lists notifications sorted newest first by creation time. |
| P4-NOTIF-FR-005 | Each notification shows type, title, body, actor/user when available, project/context when available and timestamp. |
| P4-NOTIF-FR-006 | Unread notifications are visually distinguishable from read notifications. |
| P4-NOTIF-FR-007 | User can filter notifications by `All`. |
| P4-NOTIF-FR-008 | User can filter notifications by `Unread`. |
| P4-NOTIF-FR-009 | User can filter notifications by `Assigned`. |
| P4-NOTIF-FR-010 | User can filter notifications by `Mentions`. |
| P4-NOTIF-FR-011 | Clicking a notification marks only that notification as read. |
| P4-NOTIF-FR-012 | `Mark all as read` marks all current user's notifications as read. |
| P4-NOTIF-FR-013 | Mark-read behavior persists after refresh/relogin. |
| P4-NOTIF-FR-014 | Notification cards display enough US/DE context for the user to understand what happened. |
| P4-NOTIF-FR-015 | Clicking a notification card opens the related US/DE Work Item. |
| P4-NOTIF-FR-015A | Clicking `Go to item` opens the same related US/DE Work Item. |
| P4-NOTIF-FR-015B | If the notification came from a mention in a Note, the target is the US/DE item containing that Note mention. |
| P4-NOTIF-FR-016 | Notification Center has an empty state for filters with no results. |
| P4-NOTIF-FR-017 | New unread assignment/mention notifications show an in-app popup to the recipient. |
| P4-NOTIF-FR-018 | Generic comments without a user mention must not create notifications. |
| P4-NOTIF-FR-019 | Backend creates notifications only for users allowed to access the related workspace/project/team record. |
| P4-NOTIF-FR-020 | Backend rejects read/update attempts for notifications owned by another user. |
| P4-NOTIF-FR-021 | Notification creation should be idempotent for the same event-recipient pair to avoid duplicates. |
| P4-NOTIF-FR-022 | Notification text must not expose sensitive target details to users without permission. |

## 7. Development Handoff Constraints

- Development owns DTO, API, persistence and event-delivery contracts.
- The implementation must preserve the confirmed event taxonomy, recipient ownership, unread behavior and US/DE route target.
- API or storage choices must not expand the approved Phase 4 notification event scope.

## 8. Permissions And Security

| Case | Required behavior |
|---|---|
| User lacks access to target Project/Team | Do not create notification for that user; if access is removed later, the notification must not expose restricted details. |
| User tries to read another user's notification | Backend rejects with 403 or 404. |
| UI hides action due to role | Backend still enforces ownership/permission. |
| Sensitive target data changes after notification is created | List may show generic title/body or safe fallback if the target is no longer accessible. |
| Workspace/project context changes | Notification Center still shows current user's notifications, but source details must still respect current access. |

## 9. Acceptance Checklist

- [ ] Bell opens Notification Center.
- [ ] Bell unread indicator/count matches unread API count.
- [ ] Header unread count matches list state.
- [ ] All filter shows all current user notifications newest first.
- [ ] Unread filter shows only unread notifications.
- [ ] Assigned filter shows only US/DE assignment notifications.
- [ ] Mentions filter shows only Note mention notifications.
- [ ] Empty filter state is shown when no notifications match.
- [ ] Clicking one notification persists read state.
- [ ] Mark all as read persists all current user notifications as read.
- [ ] Read state remains after refresh/relogin.
- [ ] Notification displays US/DE ID and title context.
- [ ] Clicking assignment notification opens assigned US/DE item.
- [ ] Clicking mention notification opens the US/DE item containing the Note mention.
- [ ] Assigning a US/DE to a user creates a notification for that user.
- [ ] Mentioning a user in a US/DE Note creates a notification popup and list entry for that user.
- [ ] Generic Notes/comments without mention do not create notifications.
- [ ] User cannot read or mutate another user's notifications.
- [ ] Notification creation respects project/team access.
- [ ] Duplicate event-recipient notifications are prevented.

## 10. Open Questions Gate

No open business question remains for the Phase 4 BA/mockup baseline.

- Popup auto-dismiss timing is not required in Phase 4.
- Mention routing only needs to open the US/DE containing the Note; auto-focus on Notes is not required.
- Marking a notification unread is not included in Phase 4.
