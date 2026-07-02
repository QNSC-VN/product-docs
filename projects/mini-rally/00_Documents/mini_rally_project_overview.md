# Mini Rally Project Overview

> **⚠️ Scope note (2026 pivot):** This document captures the *original* "Mini Rally" product vision. The project has since pivoted to a **global, multi-tenant, enterprise-grade SaaS** (a ~95–100% Rally equivalent). For the **authoritative** architecture, tech stack, tenancy, scale, security and scope, see [`05_Architecture/`](../05_Architecture/) (`ARCHITECTURE_CURRENT.md`, `ARCHITECTURE_FUTURE_SCALE.md`, `PRODUCTION_READINESS.md`, `FOUNDATION_PHASE.md`). The functional/module breakdown below remains valid; the "small / ≤200 users / not full enterprise" framing is superseded.

## Current MVP/Phase Baseline — 2026-06-24

Phase 0 đã pass acceptance. Phase đang chuẩn bị dev là **Phase 1 — Core Work Item Management**.

Scope Phase 1 hiện tại:

```text
Backlog Story/Defect
→ Create Story/Defect
→ Work Item Detail
→ Child Tasks
→ Task Detail
→ Estimate / To Do / Actual
→ Description / Notes / Attachments / Release Notes
→ Basic Activity Log / Revision History
```

Team CRUD **không nằm trong Phase 1**. Phase 1 chỉ dùng Team như dữ liệu có sẵn để assign Project/Work Item/Task. Team Management nên nằm ở Phase 2 hoặc phase riêng `Company / Team Administration`.

Các tài liệu triển khai Phase 1 nằm tại [`../04_Developement_tracking/Phase 1`](../04_Developement_tracking/Phase%201).

## 1. Project Overview

Dự án này là một ứng dụng web quản lý công việc theo mô hình Agile, lấy cảm hứng từ Rally/Jira. Sản phẩm hướng đến một **SaaS multi-tenant enterprise-grade cho thị trường global** (xem `05_Architecture/`), khởi đầu VN-first nhưng thiết kế chuẩn hóa, scale-ready từ ngày đầu.

Mục tiêu là xây dựng một **Agile Work Management Tool** (Rally-equivalent) đủ dùng cho BA, PO, Scrum Master, Developer, QA và Stakeholder để quản lý project, backlog, sprint, task, defect, release và dashboard.

Ứng dụng sẽ là **một web app duy nhất**, không tách riêng site admin. Tuy nhiên, bên trong app sẽ có khu vực **Admin / Settings** dành cho các user có quyền quản trị.

---

## 2. Product Vision

Xây dựng một hệ thống giúp team quản lý vòng đời công việc Agile từ lúc tạo yêu cầu, phân tích, đưa vào backlog, lập sprint, theo dõi tiến độ trên board, xử lý defect, quản lý release và xem báo cáo tiến độ.

Sản phẩm hướng đến sự đơn giản, dễ dùng, dễ triển khai, không quá nặng như các tool enterprise.

### Core Value

- Quản lý requirement, task và defect tập trung.
- Theo dõi tiến độ sprint/project rõ ràng.
- Hỗ trợ BA/PO viết user story và acceptance criteria.
- Giúp dev/QA nắm được việc cần làm.
- Cho PM/Scrum Master xem workload, progress và blocked items.
- Có phân quyền cơ bản cho workspace/project.

---

## 3. Target Users

| User Group | Mục đích sử dụng |
|---|---|
| Workspace Admin | Quản lý workspace, user, role, permission |
| Project Admin / PM | Quản lý project, sprint, release, member |
| Product Owner / BA | Quản lý backlog, user story, acceptance criteria, priority |
| Scrum Master | Theo dõi sprint, board, blocked item, team progress |
| Developer | Nhận task, cập nhật status, comment, xử lý defect |
| QA / Tester | Tạo defect, verify bug, cập nhật testing status |
| Stakeholder / Viewer | Xem dashboard, report, release progress |

---

## 4. Application Structure

Ứng dụng chỉ cần **1 web app duy nhất**.

```text
Main Web App
├── User Workspace Area
│   ├── Dashboard
│   ├── Projects
│   ├── Backlog
│   ├── Board
│   ├── Sprints
│   ├── Releases
│   ├── Reports
│   └── Notifications
│
└── Admin / Settings Area
    ├── Workspace Settings
    ├── User Management
    ├── Roles & Permissions
    ├── Project Settings
    ├── Workflow Settings
    └── Labels / Tags
```

Không cần tách riêng:

```text
admin.yourapp.com
app.yourapp.com
```

Chỉ cần route trong cùng một app:

```text
/app
/projects
/projects/:id/backlog
/projects/:id/board
/projects/:id/reports
/settings
/admin/users
/admin/roles
```

---

## 5. Core Hierarchy

Hệ thống nên dùng hierarchy đơn giản như sau:

```text
Workspace
├── Project
│   ├── Team (many-to-many through ProjectTeam)
│   ├── Feature / Epic
    │   └── User Story
    │       ├── Task
    │       └── Defect
    ├── Sprint
    ├── Release
    └── Dashboard
```
---

## 6. Core Modules

## 6.1 Authentication & Account

### Purpose

Cho phép user đăng nhập, quản lý tài khoản và truy cập hệ thống theo phân quyền.

### Features

- Login.
- Logout.
- Forgot password.
- Reset password.
- User profile.
- Change password.
- Invite user qua email.
- Activate/deactivate account.

### Suggested Fields

```text
user_id
full_name
email
password_hash
avatar_url
status
last_login_at
created_at
updated_at
```

---

## 6.2 Workspace Management

### Purpose

Workspace là cấp cao nhất, đại diện cho một Công ty/Organization và là tenant boundary. Workspace không đồng nghĩa với Team.

### Features

- Provision fixed Company/Workspace from deployment configuration.
- Manage workspace members.
- Manage workspace-level roles.
- Company settings tối thiểu.
- Không có Workspace List/Create/Edit/Archive/Switch UI trong single-company MVP.

### Suggested Fields

```text
workspace_id
workspace_name
workspace_key
description
owner_id
status
created_at
updated_at
```

---

## 6.3 Project Management

### Purpose

Project đại diện cho một sản phẩm hoặc phạm vi delivery. Project có thể liên kết với nhiều Team và một Team có thể làm việc trên nhiều Project.

### Features

- Create project.
- Update project.
- Archive project.
- Add/remove project members.
- Assign project role.
- Project overview.
- Project settings.
- Link/unlink Team.

### Suggested Fields

```text
project_id
workspace_id
project_key
project_name
description
owner_id
status
start_date
end_date
created_at
updated_at
```

### Example

```text
Project Key: COX
Work Item Key: COX-101, COX-102, COX-103
```

---

## 6.3A Team Management

### Purpose

Team là đơn vị thực thi thuộc Workspace. Team membership độc lập với Project–Team link; quyền thao tác vẫn được enforce bằng Workspace/Project role.

### Features

- Create/Edit/Archive Team.
- Manage Team lead và Team members.
- Link một Team vào nhiều Project trong cùng Workspace.
- Hiển thị hierarchy `Company/Workspace → Project → Team` trong App Shell.

### Suggested Tables

```text
teams
team_members
project_teams
```

---

## 6.4 Work Item Management

### Purpose

Đây là core module quan trọng nhất. Work item dùng để quản lý các loại item như Feature, Story, Task và Defect.

### Work Item Types

```text
Initiative
Feature / Epic
User Story
Task
Defect / Bug
```

### Features

- Create work item.
- Edit work item.
- Delete/archive work item.
- Assign user.
- Set priority.
- Set status.
- Add story point.
- Add description.
- Add acceptance criteria.
- Link parent-child item.
- Link sprint/release.
- Add label/tag.
- Add comment.
- Upload attachment.
- View activity log.

### Suggested Fields

```text
work_item_id
project_id
parent_id
item_key
item_type
title
description
acceptance_criteria
status
priority
severity
story_point
assignee_id
reporter_id
sprint_id
release_id
due_date
created_at
updated_at
```

### Suggested Status

```text
New
Defined
Ready
In Progress
Code Review
Testing
Done
Accepted
Rejected
Blocked
```

### Defect-specific Fields

```text
environment
steps_to_reproduce
expected_result
actual_result
root_cause
resolution
severity
```

---

## 6.5 Backlog Management

### Purpose

Backlog là nơi PO/BA/Scrum Master quản lý danh sách việc chưa hoặc sắp đưa vào sprint.

### Features

- View backlog items.
- Search work item.
- Filter by type/status/priority/assignee.
- Sort by priority.
- Drag & drop backlog ranking.
- Move item to sprint.
- Bulk update.

### UI Suggestion

```text
[Priority] [Key] [Type] [Title] [Status] [Point] [Assignee]
```

---

## 6.6 Sprint / Iteration Management

### Purpose

Sprint dùng để quản lý công việc theo từng chu kỳ Agile.

### Features

- Create sprint.
- Edit sprint.
- Start sprint.
- Close sprint.
- Add/remove work item to sprint.
- Set sprint goal.
- View sprint capacity.
- Move unfinished items to backlog or next sprint.

### Suggested Fields

```text
sprint_id
project_id
sprint_name
goal
start_date
end_date
status
capacity
created_by
created_at
updated_at
```

### Sprint Status

```text
Planned
Active
Closed
Cancelled
```

---

## 6.7 Board Management

### Purpose

Board giúp team theo dõi tiến độ công việc theo trạng thái.

### Board Types

```text
Scrum Board
Kanban Board
```

### Suggested Columns

```text
To Do
In Progress
Code Review
Testing
Done
Accepted
```

### Features

- Drag & drop card between columns.
- Update status by dragging card.
- Filter by assignee/type/priority.
- Swimlane by assignee or epic.
- Highlight blocked items.
- Quick edit work item.

### Card Information

```text
Item Key
Title
Type
Priority
Story Point
Assignee Avatar
Status
```

---

## 6.8 Release Management

### Purpose

Release dùng để gom các work item theo phiên bản hoặc đợt triển khai.

### Features

- Create release.
- Edit release.
- Assign work item to release.
- Track release progress.
- View completed/remaining/blocked items.

### Suggested Fields

```text
release_id
project_id
release_name
version
start_date
release_date
status
description
created_at
updated_at
```

### Example

```text
v1.0 MVP
v1.1 Bug Fix
v2.0 Reporting Module
```

---

## 6.9 Dashboard & Reports

### Purpose

Dashboard giúp PM/Scrum Master/Stakeholder nhìn nhanh tình hình project.

### MVP Reports

| Report | Purpose |
|---|---|
| Project Summary | Tổng quan số lượng item theo status |
| Sprint Progress | Tiến độ sprint hiện tại |
| Burndown Chart | Công việc còn lại trong sprint |
| Velocity Chart | Story point hoàn thành qua các sprint |
| Defect Summary | Bug theo severity/status |
| Workload by Assignee | Khối lượng công việc theo user |
| Blocked Items | Danh sách item đang bị block |
| Release Progress | Tiến độ theo release |

---

## 6.10 Comment, Attachment & Activity Log

### Purpose

Giúp team trao đổi và lưu lịch sử thay đổi ngay trong từng work item.

### Features

- Add comment.
- Edit/delete own comment.
- Mention user with @name.
- Upload attachment.
- View activity history.
- Track status changes.
- Track assignee changes.
- Track priority changes.

### Example Activity Log

```text
Henry changed status from Defined to In Progress.
Henry assigned COX-123 to John.
Henry added a comment.
Henry uploaded error_log.txt.
```

---

## 6.11 Notification

### Purpose

Thông báo cho user khi có thay đổi liên quan đến họ.

### MVP Notification

- In-app notification.
- Email notification.
- Notify when assigned.
- Notify when mentioned.
- Notify when item status changes.
- Notify when sprint is near end date.

### Later Enhancement

- Slack integration.
- Microsoft Teams integration.
- Daily digest email.

---

## 6.12 Admin / Settings

### Purpose

Admin/Settings dùng để quản lý hệ thống, user, role, project settings và workflow.

### Important Decision

Không cần xây riêng một site admin. Chỉ cần có khu vực Admin/Settings trong cùng web app.

```text
One Web App
├── Normal User Pages
└── Admin / Settings Pages
```

### MVP Admin Features

```text
- Manage users
- Invite users
- Activate/deactivate users
- Assign roles
- Manage project members
- Basic role-based permission
- Project settings
- Workspace settings
```

### Not Required in MVP

```text
- Separate admin portal
- Super admin dashboard
- Billing management
- Complex custom workflow
- Complex custom fields
- Security audit dashboard
- Multi-tenant enterprise control panel
```

---

## 7. Role & Permission

### Suggested Roles

| Role | Description |
|---|---|
| Workspace Admin | Toàn quyền trong workspace |
| Project Admin / PM | Quản lý project, member, sprint, release |
| Product Owner / BA | Quản lý backlog, story, priority, acceptance criteria |
| Scrum Master | Quản lý sprint, board, team progress |
| Developer | Cập nhật task, xử lý story/bug |
| QA / Tester | Tạo defect, verify bug |
| Viewer / Stakeholder | Chỉ xem dashboard/report |

### Admin Access Suggestion

| Role | Access Admin/Settings? |
|---|---|
| Workspace Admin | Full access |
| Project Admin / PM | Project-level settings |
| Product Owner / BA | Limited settings |
| Scrum Master | Limited sprint/board settings |
| Developer | No |
| QA / Tester | No or limited |
| Viewer | No |

---

## 8. Suggested Tech Stack

## 8.1 Recommended Stack

```text
Frontend: Next.js + TypeScript
UI: Tailwind CSS + shadcn/ui
Drag & Drop: dnd-kit
Charts: Recharts
Backend: NestJS + TypeScript
ORM: Prisma
Database: PostgreSQL
Auth: JWT + Refresh Token or Auth.js
File Storage: Cloudflare R2 / AWS S3 / MinIO
Realtime: Socket.IO / WebSocket
Queue: Redis + BullMQ
Deployment: Docker + VPS
Monitoring: Sentry
```

## 8.2 Why This Stack

| Layer | Choice | Reason |
|---|---|---|
| Frontend | Next.js | Phù hợp dashboard app, routing tốt, SSR/CSR linh hoạt |
| Language | TypeScript | Type-safe, dùng chung frontend/backend |
| UI | Tailwind + shadcn/ui | Build UI nhanh, đẹp, dễ customize |
| Drag & Drop | dnd-kit | Phù hợp board/backlog kéo thả |
| Chart | Recharts | Dễ làm dashboard/report |
| Backend | NestJS | Modular, scalable, hợp enterprise-style app |
| Database | PostgreSQL | Mạnh cho relational data, phù hợp work item/project |
| ORM | Prisma | Type-safe, dễ maintain schema |
| Storage | R2/S3 | Lưu attachment ổn định |
| Queue | Redis + BullMQ | Email, notification, background jobs |
| Monitoring | Sentry | Track lỗi frontend/backend |

---

## 9. Architecture Recommendation

Nên dùng **Modular Monolith**, không cần microservices ở giai đoạn đầu.

### Suggested Monorepo Structure

```text
apps/
├── web/                  # Next.js frontend
└── api/                  # NestJS backend

packages/
├── database/             # Prisma schema & migrations
├── shared-types/         # Shared DTO/types
└── ui/                   # Reusable UI components
```

### Backend Modules

```text
auth
users
workspaces
projects
project-members
roles
permissions
work-items
sprints
releases
boards
comments
attachments
notifications
reports
audit-logs
```

---

## 10. Database Tables

## 10.1 MVP Tables

```text
users
workspaces
workspace_members
roles
permissions
role_permissions
projects
project_members
work_items
work_item_relations
sprints
sprint_items
releases
release_items
comments
attachments
activity_logs
notifications
labels
work_item_labels
saved_filters
```

## 10.2 Optional Tables for Later

```text
test_cases
test_runs
test_results
workflow_statuses
workflow_transitions
custom_fields
custom_field_values
webhooks
integrations
```

---

## 11. Key Pages

## 11.1 Public/Auth Pages

```text
/login
/register
/forgot-password
/reset-password
```

## 11.2 Workspace Pages

```text
/settings/company
```

`/workspaces` và Workspace CRUD pages không thuộc single-company MVP.

## 11.3 Project Pages

```text
/projects
/projects/new
/projects/:id/edit
/projects/:id/overview
/projects/:id/backlog
/projects/:id/board
/projects/:id/sprints
/projects/:id/releases
/projects/:id/reports
/projects/:id/settings
```

Project List/Create/Edit/Archive/Restore đã có mockup tại `03_Mockup Design/src/app/pages/ProjectsPage.tsx`.

## 11.4 Work Item Pages

```text
/work-items/:key
/projects/:id/work-items/:key
```

## 11.5 Admin / Settings Pages

```text
/admin/users
/admin/roles
/admin/permissions
/settings/workspace
/settings/project
/settings/workflow
/settings/labels
```

## 11.6 Notification Pages

```text
/notifications
```

---

## 12. Work Item Detail Layout

Suggested layout:

```text
Left Side
├── Title
├── Description
├── Acceptance Criteria
├── Comments
├── Attachments
└── Activity Log

Right Side
├── Status
├── Type
├── Assignee
├── Reporter
├── Priority
├── Severity
├── Story Point
├── Sprint
├── Release
├── Parent Item
├── Labels
└── Due Date
```

---

## 13. MVP Roadmap

## Phase 1: Core Project Tracking

Goal: App có thể quản lý project và work item cơ bản.

```text
1. Authentication
2. Workspace
3. Project
4. User/member management
5. Work item CRUD
6. Work item hierarchy
7. Comment
8. Attachment
9. Activity log
```

## Phase 2: Agile Execution

Goal: Team có thể dùng app để chạy sprint.

```text
1. Backlog
2. Sprint management
3. Scrum board
4. Drag & drop status
5. Assign user
6. Story point
7. Priority
```

## Phase 3: Reporting

Goal: PM/Scrum Master xem được tiến độ.

```text
1. Project dashboard
2. Sprint progress
3. Burndown chart
4. Velocity chart
5. Defect summary
6. Workload by assignee
7. Blocked item list
```

## Phase 4: Permission & Notification

Goal: App đủ an toàn và hữu ích cho team nhiều role.

```text
1. Role-based access control
2. Workspace/project-level permission
3. In-app notification
4. Email notification
5. Mention user
6. Saved filters
```

## Phase 5: Advanced Features

Goal: Nâng cấp sản phẩm sau MVP.

```text
1. Custom workflow
2. Custom fields
3. Import/export CSV
4. API integration
5. Slack/Teams integration
6. AI sprint summary
7. AI work item summarization
8. Advanced audit log
```

---

## 14. Deployment Recommendation

## 14.1 Simple Deployment for MVP

```text
VPS: 4 vCPU / 8GB RAM
Docker Compose
PostgreSQL
Redis
Object Storage: Cloudflare R2 or AWS S3
Nginx reverse proxy
SSL with Let's Encrypt
```

## 14.2 More Production-ready Option

```text
Frontend: Vercel
Backend: Render / Fly.io / AWS ECS
Database: Supabase / Neon / AWS RDS PostgreSQL
Storage: Cloudflare R2
Monitoring: Sentry
```

---

## 15. Scale Considerations for 200 Users

Với 200 users, hệ thống không cần kiến trúc quá nặng. Bottleneck chính thường là query dashboard/report, permission check và filter/search work item.

### Important Indexes

```text
work_items.project_id
work_items.status
work_items.item_type
work_items.assignee_id
work_items.sprint_id
work_items.release_id
work_items.parent_id
work_items.created_at
work_items.updated_at
activity_logs.work_item_id
comments.work_item_id
notifications.user_id
```

### Performance Notes

- Dùng pagination cho backlog và work item list.
- Dùng debounce cho search.
- Cache dashboard nếu query nặng.
- Không load toàn bộ comment/activity cùng lúc nếu quá dài.
- Attachment nên lưu ở object storage, không lưu file binary trong database.

---

## 16. Suggested MVP Scope

Nên tập trung build 6 module đầu tiên:

```text
1. Project
2. Work Item
3. Backlog
4. Sprint
5. Board
6. Dashboard
```

Admin/Settings vẫn cần có, nhưng chỉ nên build ở mức cơ bản:

```text
1. User management
2. Invite user
3. Assign role
4. Project member management
5. Basic permission
```

---

## 17. What Not to Build First

Không nên build các phần này ở MVP:

```text
- Full SAFe/enterprise portfolio management
- Complex billing system
- Separate admin portal
- Advanced custom workflow builder
- Marketplace/integration store
- Complex automation rule engine
- Advanced analytics engine
- Mobile app
- Multi-tenant super admin portal
```

Các phần này có thể thêm sau khi app đã có user thật và workflow thật.

---

## 18. Final Recommendation

Nên build theo hướng:

```text
A single Agile Work Management Web App
with built-in Admin/Settings by role
for small teams under 200 users
```

Không cần clone Rally toàn bộ. Chỉ cần tập trung vào những tính năng tạo giá trị thực tế:

```text
Project → Work Item → Backlog → Sprint → Board → Dashboard
```

Khi MVP ổn định, có thể nâng cấp thêm:

```text
Release Management
Advanced Report
Custom Workflow
Custom Field
Slack/Teams Integration
AI Summary
```

Chốt hướng đi:

> Build một mini Rally/Jira đơn giản, tập trung vào Agile execution và project visibility. Dùng 1 web app duy nhất, có Admin/Settings theo role, không cần tách site admin riêng ở giai đoạn đầu.
