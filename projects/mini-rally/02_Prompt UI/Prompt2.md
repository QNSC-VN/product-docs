# Prompt 2 — Rally-inspired App Shell + Role-based Layout Rules

Create a Rally-inspired enterprise Agile Work Management web app layout based on the existing global design system.

Do not copy Rally pixel by pixel. Use Rally as layout inspiration only:

* Horizontal top navigation
* Context selector bar
* Status summary strip
* Selected item action toolbar
* Inline quick create row
* Dense enterprise table
* List / Board toggle
* Professional corporate SaaS style

## Product Context

This application is a Mini Rally / Agile Work Management Tool for internal teams under 200 users.

The app supports:

* Workspace management
* Project management
* Backlog planning
* Work item tracking
* Sprint / iteration tracking
* Board view
* Release management
* Defect / quality management
* Portfolio hierarchy
* Reports
* Notifications
* Admin / settings
* Role-based permissions

## Top Header Navigation

Create a horizontal top navigation bar.

Left side:

* Product logo
* Workspace name with dropdown, example: ACME Space Inc.

Center navigation:

* Home
* Plan
* Track
* Quality
* Portfolio
* Reports

Right side:

* Global search input: Search all work items
* Notification icon
* Help icon
* Settings/tools icon
* User avatar with dropdown

The active navigation item should have a subtle muted blue background.

## Context Selector Bar

Below the top navigation, every major page should include a context selector bar.

Depending on the page, include:

* Workspace selector
* Project selector
* Release selector
* Sprint / Iteration selector
* Team selector
* Date range
* Saved Views dropdown

Saved Views dropdown should support:

* Select saved view
* Add new saved view
* Save current filters
* Shared views
* Personal views
* Reset view

## Role-based UI Rules

The UI must support role-based visibility and permissions.

Roles:

1. Workspace Admin

* Can access Settings, User Management, Roles & Permissions, Workflow Status, Labels, Audit Log, Workspace Settings, and Project Settings.
* Can create, update, archive projects.
* Can invite users and manage workspace members.
* Can manage roles and permissions.

2. Project Manager / Scrum Master

* Can manage projects, project members, backlog, sprints, releases, boards, and reports.
* Can start and close sprints.
* Can create and update releases.
* Can configure project-level workflow and labels.

3. Product Owner / BA

* Can create and update work items.
* Can manage backlog priority.
* Can write description and acceptance criteria.
* Can assign work items.
* Can link related work items.
* Can move work items into sprint/release.
* Can view dashboard and reports.

4. Developer

* Can view assigned work items.
* Can update work item status.
* Can comment.
* Can upload attachments.
* Can use board drag-and-drop.
* Cannot manage users, roles, workspace, or project settings.

5. Tester / QA

* Can create defects.
* Can update defect status.
* Can verify issues.
* Can comment and upload attachments.
* Can view quality reports.

6. Viewer / Stakeholder

* Read-only access.
* Can view dashboard, reports, board, backlog, release progress, and work item detail.
* Should not see create, edit, delete, assign, or settings actions.

## Main Navigation Screens

Create the foundation layout for these pages:

* Home
* Plan
* Track
* Quality
* Portfolio
* Reports
* Notifications
* Settings

The design must feel:

* Enterprise
* Professional
* Dense but readable
* Table-first
* Planning-focused
* Clear at first glance
* Minimal and not colorful
