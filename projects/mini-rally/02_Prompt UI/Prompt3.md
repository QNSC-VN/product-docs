# Prompt 3 — Core Product Screens: Home, Plan, Track, Backlog, Board

Using the existing global design system and Rally-inspired app shell, create the core product screens for the Mini Rally / Agile Work Management Tool.

Keep the design:

* Professional
* Enterprise SaaS
* Rally-inspired
* Dense but readable
* Minimal colors
* Table-first
* Clear hierarchy
* Suitable for corporate teams

## Screen 1 — Home / Workspace Overview

Purpose:
Show a high-level overview of workspace delivery status.

Layout:

* Top navigation
* Context selector bar with Workspace selector
* Page title: Home

Content:

1. Horizontal summary strip:

* Active Projects
* Open Work Items
* Active Sprints
* Blocked Items
* Open Defects
* Items Assigned to Me

2. My Work table:
   Columns:

* ID
* Type
* Name
* Project
* Status
* Priority
* Due Date

3. Recent Activity:
   Activity feed showing:

* Status changed
* Work item assigned
* Comment added
* Attachment uploaded
* Sprint started
* Release updated

4. Project Health table:
   Columns:

* Project Key
* Project Name
* Active Sprint
* Progress
* Open Defects
* Blocked Items
* Owner

## Screen 2 — Plan / Team Planning

Purpose:
PM, Scrum Master, PO, and BA use this page to plan backlog items into upcoming sprints.

Layout:

* Top navigation with Plan active
* Context selector: Workspace / Project / Release / Team / Saved View
* Page title: Team Planning

Main content split into two areas:

Left panel: Prioritized Backlog

* Search input
* Filters: Type, Priority, Assignee, Status, Label
* Saved Views dropdown
* Dense backlog table

Backlog table columns:

* Rank
* ID
* Type
* Name
* Priority
* Estimate
* Owner
* Status
* Release

Right panel: Sprint / Iteration Planning
Show multiple upcoming sprint sections.

Each sprint section includes:

* Sprint name
* Date range
* Sprint goal
* Capacity
* Planned story points
* Remaining capacity
* Progress bar
* Planned work item list

Interactions:

* Drag work item from backlog to sprint
* Reorder work items inside sprint
* Remove work item from sprint
* Quick edit estimate and owner
* Show subtle warning when sprint is over capacity

## Screen 3 — Track / Iteration Status

Purpose:
Track current sprint/iteration progress and execution status.

Layout:

* Top navigation with Track active
* Page title: Iteration Status
* Sprint selector with previous/next arrows
* Sprint name dropdown
* Date range
* Saved Views dropdown
* List / Board toggle on the right

Horizontal status summary strip:

* Planned Velocity

  * percentage
  * planned points
  * progress bar
* Iteration End

  * days left
  * progress bar
* Accepted

  * percentage
  * accepted points
  * progress bar
* Defects

  * active count
* Tasks

  * active count
* View Charts link

Selected item action toolbar:
Show when one or more items are selected.

Actions:

* Edit
* Delete
* Copy
* Split
* Add Peer
* Add Child
* Link Existing
* Copy Tasks From
* Rank Lowest
* Rank Highest
* Move to Position

Inline quick create row:
Fields:

* Work Item Type dropdown
* Project dropdown
* Name input
* Estimate input
* Owner dropdown
* Button: Create + New
* Link: Create
* Link: Create with details
* Close icon

Work item table columns:

* Checkbox
* Rank
* ID
* Name
* Schedule State
* Blocked
* Plan Estimate
* Task Estimate
* To Do
* Owner
* Defects

Sample work items:

* US199 — Child Story Observation
* US16 — Delete Item
* US554 — Online Payment
* US549 — Images
* US383 — Chat Pop-up Suggestion after 90 Sec Inactive
* US418 — Shopping Cart
* US59 — Make a pet shop

## Screen 4 — Backlog / Work Item List

Purpose:
PO, BA, and PM use this page to manage work items and backlog priority.

Layout:

* Top navigation
* Context selector: Workspace / Project / Release / Sprint / Saved View
* Page title: Backlog
* Button: Create Work Item
* Search input
* Filters: Type, Status, Priority, Assignee, Label, Release, Sprint

Table columns:

* Checkbox
* Rank
* ID
* Type
* Name
* Priority
* Estimate
* Owner
* Status
* Sprint
* Release
* Updated At

Features:

* Saved Views
* Bulk action toolbar
* Inline editing for priority, owner, estimate, and status
* Drag to reorder priority
* Move selected items to sprint
* Move selected items to release
* Link related items

## Screen 5 — Board View

Purpose:
Visual tracking of work item status.

Layout:

* Same top navigation and context selector
* List / Board toggle with Board active
* Filters: Assignee, Type, Priority, Label, Only My Items

Board columns:

* Defined
* In Progress
* Code Review
* Testing
* Done
* Accepted

Work item cards:

* ID
* Type badge
* Title
* Priority
* Estimate
* Owner avatar
* Defect indicator
* Comment indicator
* Attachment indicator
* Blocked indicator

Interactions:

* Drag and drop between columns
* Open work item detail on click
* Quick filter by owner
* Subtle visual feedback while dragging

Role behavior:

* Viewer can view board but cannot drag cards.
* Developer and QA can drag cards if they have update permission.
