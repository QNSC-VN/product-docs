# Prompt 4 — Advanced Screens: Work Item Detail, Quality, Portfolio, Release, Reports, Notifications, Settings

Using the existing global design system and Rally-inspired app shell, create the advanced screens for the Mini Rally / Agile Work Management Tool.

Keep all screens consistent with:

* Horizontal Rally-inspired top navigation
* Context selector bar
* Saved Views where relevant
* Dense enterprise tables
* Minimal colors
* Professional corporate SaaS look

## Screen 6 — Work Item Detail

Purpose:
View and edit a work item such as Initiative, Epic, Story, Task, or Defect.

Layout:
Two-column detail page.

Header:

* Work item ID
* Work item type badge
* Title
* Status badge
* More actions menu
* Watch / Unwatch action

Left main column:

1. Description

* Rich text area
* Clear label

2. Acceptance Criteria

* Checklist or structured text block
* Clear label

3. Defect Details
   Only show when work item type is Defect:

* Severity
* Environment
* Steps to Reproduce
* Expected Result
* Actual Result
* Root Cause
* Resolution

4. Related Work Items
   Show relation types:

* Parent
* Child
* Blocks
* Blocked by
* Relates to
* Duplicates
* Depends on

Include action:

* Link Existing Work Item

5. Comments

* Comment input
* Comment thread
* User avatar
* Timestamp
* Mention support

6. Attachments

* File list
* File name
* File size
* Uploaded by
* Upload button

7. Work Item Activity Log
   Timeline events:

* Status changed
* Assignee changed
* Priority changed
* Estimate changed
* Sprint changed
* Release changed
* Comment added
* Attachment uploaded
* Related item linked

Right metadata panel:

* Project
* Owner / Assignee
* Reporter
* Status
* Priority
* Severity
* Estimate / Story Point
* Sprint
* Release
* Parent
* Labels
* Due Date
* Blocked toggle
* Blocked reason
* Watchers

Role behavior:

* Viewer sees read-only version.
* Developer can update status, comment, and upload attachment.
* QA can update defect fields and status.
* PO / BA can edit description, acceptance criteria, priority, owner, related items.
* PM can update sprint, release, owner, and status.
* Admin can edit all fields.

## Screen 7 — Quality / Defect Management

Purpose:
QA and team members track defects and quality status.

Layout:

* Top navigation with Quality active
* Context selector: Project / Sprint / Release / Severity / Saved View
* Page title: Quality

Horizontal status summary strip:

* Open Defects
* Critical Defects
* Defects in Testing
* Verified Defects
* Reopened Defects
* Blocker Defects

Quick create defect row:
Fields:

* Defect title
* Severity
* Priority
* Environment
* Owner
* Related Story
* Button: Create Defect

Defect table columns:

* Checkbox
* ID
* Title
* Severity
* Priority
* Environment
* Owner
* Status
* Related Story
* Sprint
* Release
* Updated At

Features:

* Saved Views
* Bulk update
* Assign owner
* Link to story
* Verify defect
* Reopen defect

## Screen 8 — Portfolio

Purpose:
Track higher-level initiatives, epics, and features.

Layout:

* Top navigation with Portfolio active
* Context selector: Workspace / Project / Release / Timeframe / Saved View
* Page title: Portfolio

Portfolio hierarchy table:
Columns:

* ID
* Type
* Name
* Owner
* Status
* Progress
* Target Release
* Related Work Items
* Blocked Items
* Updated At

Hierarchy:

* Initiative

  * Epic / Feature

    * Story

Features:

* Expand/collapse rows
* Progress bars inside table cells
* Link to related stories and defects
* Filter by owner, release, status

## Screen 9 — Release Management

Purpose:
Manage versions/releases and track delivery readiness.

Layout:

* Context selector: Workspace / Project / Release / Saved View
* Page title: Releases
* Button: Create Release

Release list table:
Columns:

* Release Name
* Version
* Status
* Start Date
* Release Date
* Progress
* Total Work Items
* Completed Items
* Open Defects
* Blocked Items
* Owner
* Actions

Release Detail section:

* Release overview
* Progress bar
* Included work items table
* Open defects table
* Blocked items
* Completed vs remaining
* Release activity history

Status badges:

* Planned
* In Progress
* Released
* Cancelled
* Archived

## Screen 10 — Reports

Purpose:
Show delivery analytics and project health.

Layout:

* Top navigation with Reports active
* Context selector: Project / Sprint / Release / Date Range / Saved View
* Page title: Reports
* Button: Export Report
* Button: Customize Dashboard

Widget grid:

1. Burndown Chart
2. Velocity Chart
3. Work Items by Status
4. Defect Summary
5. Release Progress
6. Workload by Owner
7. Blocked Items
8. Sprint Progress
9. Planned vs Completed Points
10. Recent Activity

Widget style:

* White card
* Thin border
* Clear title
* Compact content
* Muted charts
* No colorful analytics style

Role behavior:

* Viewer can view reports only.
* Admin, PM, and PO / BA can export reports.

## Screen 11 — Notifications

Purpose:
Users view notifications related to assignments, mentions, comments, status changes, and sprint updates.

Layout:

* Top navigation
* Page title: Notifications

Filter tabs:

* All
* Unread
* Assigned
* Mentions
* Comments
* Status Changes
* Sprint Updates
* Due Date

Notification item:

* Icon
* Title
* Short message
* Related work item ID
* Project name
* Timestamp
* Read / unread state
* Quick action button

Notification examples:

* You were assigned to COX-123
* Henry mentioned you in SUBFI-45
* COX-88 moved from Testing to Done
* Sprint 12 has been started
* Release v1.0 is ready for review

## Screen 12 — Settings / Admin

Purpose:
Admin and configuration area inside the same web app. This is not a separate admin site.

Layout:

* Top navigation remains visible
* Page title: Settings
* Settings sidebar or tabs:

  * Workspace Settings
  * User Management
  * Roles & Permissions
  * Project Settings
  * Workflow Status
  * Labels
  * Audit Log

Workspace Settings:

* Workspace name
* Workspace slug
* Owner
* Status

User Management:
Table columns:

* Name
* Email
* Role
* Status
* Last Login
* Actions

Actions:

* Invite User
* Change Role
* Remove User
* Resend Invitation

Roles & Permissions:

* Role list on the left
* Permission matrix on the right
* Checkboxes for permissions
* Save / Cancel actions

Project Settings:
Fields:

* Project information
* Project members
* Default workflow
* Default assignee
* Enable sprint
* Enable release
* Enable story point
* Work item key prefix

Workflow Status:

* Status name
* Category
* Sort order
* Final status flag
* Add / edit / delete status
* Reorder statuses

Labels:

* Label name
* Color
* Usage count
* Actions

System Audit Log:
Table columns:

* Time
* Actor
* Action
* Entity
* Details

Audit examples:

* User invited
* Role changed
* Permission updated
* Project archived
* Workflow changed

Role behavior:

* Only Workspace Admin can access full Settings.
* PM can access project-level settings only.
* Other roles should not see Settings or should see read-only limited settings if needed.
