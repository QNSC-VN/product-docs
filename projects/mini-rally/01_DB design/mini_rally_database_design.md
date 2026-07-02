# Mini Rally / Agile Work Management Tool - Database Design

## 1. Mục tiêu thiết kế DB

Tài liệu này mô tả bộ database cho hệ thống **Mini Rally / Agile Work Management Tool**.

Hệ thống là một **SaaS multi-tenant, enterprise-grade, hướng global market** (xem `05_Architecture/` là nguồn chân lý cho scope, tenancy, scale, infra, security). Quy mô khởi đầu nhỏ (VN-first, ~CCU 800) nhưng **thiết kế DB phải sharding-ready và multi-tenant từ ngày đầu**. Các nghiệp vụ chính:

- Workspace / Organization
- User / Role / Permission
- Project management
- Work item hierarchy: Initiative, Feature, Story, Task, Defect
- Backlog management
- Sprint / Iteration management
- Scrum / Kanban board
- Release management
- Comment / Attachment
- Activity log / Audit log
- Notification
- Saved filter
- Admin / Settings

---

## 1b. Design Conventions (authoritative — aligned with `05_Architecture/`)

Các quy ước sau **override** mọi mô tả mâu thuẫn phía dưới (tài liệu này viết trước khi pivot sang enterprise SaaS):

| Convention | Quy định |
|---|---|
| **Primary keys** | **UUIDv7 / ULID** (time-ordered, globally unique) cho mọi bảng. **KHÔNG dùng BIGINT/SERIAL** — bất kỳ chỗ nào ghi `UUID / BIGINT` đều đọc là **UUID** (sharding-safe) |
| **Multi-tenancy** | Mọi bảng domain mang **`tenant_id`** (cột isolation chuyên dụng → `tenancy.tenants`, = tài khoản/organization trả tiền) + **PostgreSQL Row-Level Security (RLS)**. `workspace_id` là cột scope phụ, **không** phải khóa isolation. Tenant context set per-request (`app.tenant_id`). Chi tiết: `05_Architecture/DATABASE_SCHEMA.md §1–§2` |
| **Timestamps** | **UTC-only** (`TIMESTAMPTZ`). Convert ở presentation layer |
| **Soft-delete** | `deleted_at TIMESTAMPTZ` (đã có ở phần lớn bảng) |
| **Optimistic concurrency** | Cột `version INT` trên các entity có thể bị sửa đồng thời (work_items, board, v.v.) |
| **Ordering (backlog/board)** | Dùng **LexoRank** — cột `rank VARCHAR` (lexicographic). **Thay cho** `position INT` / `sort_order INT` (move = update 1 dòng, không renumber) |
| **Audit** | `activity_logs` là append-only immutable, được feed qua **outbox** (xem `outbox_events`) |
| **Events / idempotency** | Transactional outbox + idempotency keys (xem mục Foundation tables) |
| **IDs sinh** | UUIDv7 sinh app-side hoặc `uuidv7()` (Postgres 18) |

---

## 2. Tổng quan nhóm bảng

Database được chia thành các nhóm nghiệp vụ chính:

```text
1. Account & Workspace
2. Project Management
3. Role & Permission
4. Workflow Management
5. Work Item Management
6. Backlog / Sprint / Board
7. Release Management
8. Comment / Attachment / Activity
9. Notification
10. Utility / Saved Filter
```

Tổng số bảng đề xuất bản đầy đủ: **32 bảng**.

> **Architect redesign (xem `05_Architecture/DATABASE_SCHEMA.md §1.1` — nguồn chân lý):** danh sách dưới là logical gốc của BA. Thay đổi đã lock: **(+)** `user_role_assignments` (scoped RBAC, R1), `sprint_daily_snapshots` (burndown/velocity read model, R4), `custom_field_defs` (fast-follow, R5); **(−)** `sprint_items`, `release_items` (thay bằng FK `iteration_id`/`release_id` trên `work_items`, R2).

```text
users
auth_sessions
password_reset_tokens
workspaces
workspace_members
workspace_invitations
workspace_settings
roles
permissions
role_permissions
user_role_assignments        # (+) R1 scoped role binding
projects
project_members
project_settings
teams
team_members
project_teams
workflow_statuses
workflow_transitions
work_items                    # (+) iteration_id, release_id, story_points, acceptance_criteria, is_blocked, custom_fields
work_item_relations
labels
work_item_labels
project_counters             # (+) per-project item_key sequence
sprints
releases
sprint_daily_snapshots        # (+) R4 burndown/velocity read model
comments                      # (+) mentioned_user_ids[] R6
attachments                   # (R7) metadata only: s3_key, scan_status
watchers
activity_logs
notifications
saved_filters
custom_field_defs             # (+) R5 fast-follow
# (−) sprint_items, release_items  → dropped, replaced by FK on work_items (R2)
```

---

## 3. ERD logic tổng quan

```text
Workspace
 ├── Users through WorkspaceMembers
 ├── AuthSessions / PasswordResetTokens
 ├── Roles / Permissions
 ├── Projects
 │    ├── ProjectMembers
 │    ├── ProjectSettings
 ├── Teams
 │    ├── TeamMembers
 │    └── Projects through ProjectTeams
 │    ├── WorkflowStatuses
 │    ├── WorkflowTransitions
 │    ├── WorkItems
 │    │    ├── Comments
 │    │    ├── Attachments
 │    │    ├── Labels
 │    │    ├── Watchers
 │    │    └── ActivityLogs
 │    ├── Sprints
 │    └── Releases
 └── SavedFilters
```

Work item hierarchy:

```text
Initiative
  └── Epic / Feature
       └── Story
            ├── Task
            └── Defect
```

Trong DB, dùng chung bảng `work_items` cho tất cả loại item. Dùng `parent_id` cho quan hệ cha-con chính, và dùng `work_item_relations` cho các quan hệ phụ như blocks, duplicates, relates to, depends on.

---

# 4. Account & Workspace

## 4.1. `users`

Lưu thông tin người dùng.

| Field | Type | Note |
|---|---|---|
| id | UUID / BIGINT | Primary key |
| full_name | VARCHAR(255) | Tên người dùng |
| email | VARCHAR(255) | Unique |
| password_hash | TEXT | Mật khẩu đã hash |
| avatar_url | TEXT | Nullable |
| status | VARCHAR(50) | active, inactive, invited, suspended |
| last_login_at | TIMESTAMP | Nullable |
| created_at | TIMESTAMP |  |
| updated_at | TIMESTAMP |  |

Gợi ý enum `status`:

```text
active
inactive
invited
suspended
```

---

## 4.2. `auth_sessions`

Lưu session server-side; client chỉ giữ cookie/token opaque, không lưu raw token trong DB.

| Field | Type | Note |
|---|---|---|
| id | UUID / BIGINT | Primary key |
| user_id | UUID | FK → users.id |
| token_hash | TEXT | Unique; hash của session token |
| user_agent | TEXT | Nullable |
| ip_address | VARCHAR(64) | Nullable |
| expires_at | TIMESTAMP | Bắt buộc |
| revoked_at | TIMESTAMP | Nullable |
| last_seen_at | TIMESTAMP | Nullable |
| created_at | TIMESTAMP |  |

---

## 4.3. `password_reset_tokens`

| Field | Type | Note |
|---|---|---|
| id | UUID / BIGINT | Primary key |
| user_id | UUID | FK → users.id |
| token_hash | TEXT | Unique; one-time token hash |
| expires_at | TIMESTAMP | Bắt buộc |
| used_at | TIMESTAMP | Nullable |
| created_at | TIMESTAMP |  |

---

## 4.4. `workspaces`

Một Workspace đại diện cho Công ty/Organization và là tenant boundary cao nhất; Workspace không đồng nghĩa với Team.

| Field | Type | Note |
|---|---|---|
| id | UUID / BIGINT | Primary key |
| name | VARCHAR(255) | Tên workspace |
| slug | VARCHAR(100) | Unique |
| description | TEXT | Nullable |
| owner_id | UUID | FK → users.id |
| status | VARCHAR(50) | active, archived |
| created_at | TIMESTAMP |  |
| updated_at | TIMESTAMP |  |

---

## 4.5. `workspace_members`

Mapping user vào workspace.

| Field | Type | Note |
|---|---|---|
| id | UUID / BIGINT | Primary key |
| workspace_id | UUID | FK → workspaces.id |
| user_id | UUID | FK → users.id |
| role_id | UUID | FK → roles.id |
| status | VARCHAR(50) | active, invited, suspended, removed |
| joined_at | TIMESTAMP | Nullable |
| created_at | TIMESTAMP |  |
| updated_at | TIMESTAMP |  |

Unique constraint:

```text
UNIQUE(workspace_id, user_id)
```

---

## 4.6. `workspace_invitations`

Lưu vòng đời lời mời thành viên vào Company/Workspace cố định.

| Field | Type | Note |
|---|---|---|
| id | UUID / BIGINT | Primary key |
| workspace_id | UUID | FK → workspaces.id |
| email | VARCHAR(255) | Email đã normalize lowercase/trim |
| role_id | UUID | FK → roles.id |
| token_hash | TEXT | Unique; không lưu raw token |
| status | VARCHAR(30) | pending, accepted, expired, cancelled |
| invited_by | UUID | FK → users.id |
| expires_at | TIMESTAMP | Bắt buộc |
| accepted_by | UUID | Nullable, FK → users.id |
| accepted_at | TIMESTAMP | Nullable |
| created_at | TIMESTAMP |  |
| updated_at | TIMESTAMP |  |

Business rule: chỉ có một invitation `pending` cho cùng `(workspace_id, lower(email))` tại một thời điểm; resend rotate token và invalidate token cũ.

---

## 4.7. `workspace_settings`

Lưu cấu hình Company/Workspace singleton, tách khỏi identity row `workspaces`.

| Field | Type | Note |
|---|---|---|
| id | UUID / BIGINT | Primary key |
| workspace_id | UUID | Unique, FK → workspaces.id |
| timezone | VARCHAR(64) | IANA timezone, ví dụ Asia/Ho_Chi_Minh |
| default_locale | VARCHAR(20) | Ví dụ vi-VN, en-US |
| date_format | VARCHAR(30) | Nullable; display preference |
| created_at | TIMESTAMP |  |
| updated_at | TIMESTAMP |  |

---

# 5. Role & Permission

## 5.1. `roles`

Lưu role ở cấp workspace hoặc project.

| Field | Type | Note |
|---|---|---|
| id | UUID / BIGINT | Primary key |
| workspace_id | UUID | FK → workspaces.id |
| name | VARCHAR(100) | Workspace Admin, PM, BA, Dev, QA, Viewer |
| code | VARCHAR(100) | workspace_admin, project_manager, developer... |
| scope | VARCHAR(50) | workspace, project |
| description | TEXT | Nullable |
| is_system | BOOLEAN | Role mặc định hay custom |
| created_at | TIMESTAMP |  |
| updated_at | TIMESTAMP |  |

Role mặc định:

```text
workspace_admin
project_manager
product_owner_ba
developer
tester_qa
viewer
```

---

## 5.2. `permissions`

Danh sách quyền trong hệ thống.

| Field | Type | Note |
|---|---|---|
| id | UUID / BIGINT | Primary key |
| code | VARCHAR(150) | Ví dụ: work_item.create |
| name | VARCHAR(255) | Tên hiển thị |
| module | VARCHAR(100) | workspace, project, sprint, work_item... |
| description | TEXT | Nullable |

Ví dụ permission:

```text
workspace.manage
user.invite
role.manage
permission.manage
project.create
project.update
project.delete
project.member.manage
work_item.create
work_item.update
work_item.delete
work_item.assign
work_item.status.update
sprint.create
sprint.start
sprint.close
release.create
report.view
setting.manage
audit_log.view
```

---

## 5.3. `role_permissions`

Mapping role với permission.

| Field | Type | Note |
|---|---|---|
| id | UUID / BIGINT | Primary key |
| role_id | UUID | FK → roles.id |
| permission_id | UUID | FK → permissions.id |
| created_at | TIMESTAMP |  |

Unique constraint:

```text
UNIQUE(role_id, permission_id)
```

---

# 6. Project Management

## 6.1. `projects`

Lưu project/sản phẩm; Team là entity riêng và liên kết qua `project_teams`.

| Field | Type | Note |
|---|---|---|
| id | UUID / BIGINT | Primary key |
| workspace_id | UUID | FK → workspaces.id |
| key | VARCHAR(20) | Ví dụ: COX, SUBFI, HOTEL |
| name | VARCHAR(255) | Tên project |
| description | TEXT | Nullable |
| owner_id | UUID | FK → users.id |
| status | VARCHAR(50) | active, archived, completed |
| start_date | DATE | Nullable |
| end_date | DATE | Nullable |
| next_item_no | BIGINT | Sequence kế tiếp để sinh Work Item key; default 1 |
| created_at | TIMESTAMP |  |
| updated_at | TIMESTAMP |  |

Unique constraint:

```text
UNIQUE(workspace_id, key)
```

Ví dụ work item key sinh ra từ project key:

```text
COX-1
COX-2
SUBFI-1
HOTEL-1
```

`next_item_no` phải được reserve/update atomically trong transaction (`UPDATE ... RETURNING` hoặc row lock). Không dùng `MAX(work_items.item_no)+1`.

---

## 6.2. `project_members`

Mapping user vào project.

| Field | Type | Note |
|---|---|---|
| id | UUID / BIGINT | Primary key |
| project_id | UUID | FK → projects.id |
| user_id | UUID | FK → users.id |
| role_id | UUID | FK → roles.id |
| status | VARCHAR(50) | active, removed |
| joined_at | TIMESTAMP |  |
| created_at | TIMESTAMP |  |
| updated_at | TIMESTAMP |  |

Unique constraint:

```text
UNIQUE(project_id, user_id)
```

---

## 6.3. `project_settings`

Lưu cấu hình riêng của project.

| Field | Type | Note |
|---|---|---|
| id | UUID / BIGINT | Primary key |
| project_id | UUID | FK → projects.id |
| default_assignee_id | UUID | Nullable, FK → users.id |
| default_workflow_id | UUID | Nullable |
| enable_sprint | BOOLEAN | Bật/tắt sprint |
| enable_release | BOOLEAN | Bật/tắt release |
| enable_story_point | BOOLEAN | Bật/tắt story point |
| created_at | TIMESTAMP |  |
| updated_at | TIMESTAMP |  |

`project_settings` là bảng bắt buộc trong Phase 0 vì Project Create phải khởi tạo feature flags/defaults atomically.

---

## 6.4. `teams`

Team là đơn vị thực thi thuộc Workspace. Team và Project có quan hệ nhiều-nhiều qua `project_teams`; cùng một Team có thể xuất hiện dưới nhiều Project trong application context:

```text
Workspace / Company
├── Project A ── Team Core
└── Project B ── Team Core
```

| Field | Type | Note |
|---|---|---|
| id | UUID / BIGINT | Primary key |
| workspace_id | UUID | FK → workspaces.id |
| name | VARCHAR(255) | Tên team, ví dụ Core Platform |
| key | VARCHAR(30) | Key ngắn trong workspace, ví dụ CORE |
| description | TEXT | Nullable |
| lead_id | UUID | Nullable, FK → users.id |
| status | VARCHAR(50) | active, archived |
| created_at | TIMESTAMP |  |
| updated_at | TIMESTAMP |  |

Unique constraints:

```text
UNIQUE(workspace_id, name)
UNIQUE(workspace_id, key)
```

Business rules:

- Team có thể liên kết với nhiều Project trong cùng Workspace.
- `lead_id`, nếu có, phải là active `team_member` và active `workspace_member`.
- Archive Team không xóa lịch sử Work Item/Sprint đã liên kết.
- Project có thể có nhiều Team; không tự động clone Team khi link sang Project khác.

---

## 6.5. `team_members`

Mapping user vào Team. Một user có thể thuộc nhiều Team trong cùng Project.

| Field | Type | Note |
|---|---|---|
| id | UUID / BIGINT | Primary key |
| team_id | UUID | FK → teams.id |
| user_id | UUID | FK → users.id |
| status | VARCHAR(50) | active, removed |
| joined_at | TIMESTAMP | Nullable |
| created_at | TIMESTAMP |  |
| updated_at | TIMESTAMP |  |

Unique constraint:

```text
UNIQUE(team_id, user_id)
```

`team_members` không thay thế `project_members`. User phải là active Workspace Member trước khi được thêm vào Team. Khi thao tác trong một Project, backend vẫn kiểm tra Project membership/permission; Team membership dùng để xác định phạm vi dữ liệu, filter và assignment.

---

## 6.6. `project_teams`

Mapping nhiều-nhiều giữa Project và Team.

| Field | Type | Note |
|---|---|---|
| id | UUID / BIGINT | Primary key |
| project_id | UUID | FK → projects.id |
| team_id | UUID | FK → teams.id |
| status | VARCHAR(50) | active, removed |
| linked_at | TIMESTAMP |  |
| unlinked_at | TIMESTAMP | Nullable |
| created_at | TIMESTAMP |  |
| updated_at | TIMESTAMP |  |

```text
UNIQUE(project_id, team_id)
```

Business rules:

- Project và Team phải thuộc cùng Workspace.
- Remove link không xóa Team hoặc lịch sử Work Item/Sprint; dùng `status/unlinked_at` để audit.
- `work_items.team_id` và `sprints.team_id`, nếu có, phải hợp lệ với Project–Team mapping theo policy lịch sử.

---

# 7. Workflow Management

## 7.1. `workflow_statuses`

Lưu các trạng thái work item theo project.

| Field | Type | Note |
|---|---|---|
| id | UUID / BIGINT | Primary key |
| project_id | UUID | FK → projects.id |
| name | VARCHAR(100) | To Do, In Progress, Testing... |
| code | VARCHAR(100) | todo, in_progress... |
| category | VARCHAR(50) | todo, in_progress, done |
| color | VARCHAR(20) | Nullable |
| sort_order | INT | Thứ tự hiển thị trên board |
| is_default | BOOLEAN | Trạng thái mặc định |
| is_final | BOOLEAN | Trạng thái kết thúc |
| created_at | TIMESTAMP |  |

Status gợi ý:

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

---

## 7.2. `workflow_transitions`

Quy định trạng thái nào có thể chuyển sang trạng thái nào.

| Field | Type | Note |
|---|---|---|
| id | UUID / BIGINT | Primary key |
| project_id | UUID | FK → projects.id |
| from_status_id | UUID | FK → workflow_statuses.id |
| to_status_id | UUID | FK → workflow_statuses.id |
| role_id | UUID | Nullable, role nào được chuyển |
| created_at | TIMESTAMP |  |

Ví dụ:

```text
To Do → In Progress
In Progress → Code Review
Code Review → Testing
Testing → Done
Done → Accepted
```

---

# 8. Work Item Management

## 8.1. `work_items`

Bảng core quan trọng nhất. Dùng chung cho:

```text
Initiative
Epic / Feature
Story
Task
Defect
```

| Field | Type | Note |
|---|---|---|
| id | UUID / BIGINT | Primary key |
| project_id | UUID | FK → projects.id |
| workspace_id | UUID | FK → workspaces.id, denormalized để query nhanh |
| team_id | UUID | Nullable, FK → teams.id; team chịu trách nhiệm chính |
| item_key | VARCHAR(50) | Ví dụ: COX-123 |
| item_no | INT | Số thứ tự trong project |
| type | VARCHAR(50) | initiative, feature, story, task, defect |
| title | VARCHAR(500) | Tên work item |
| description | TEXT | Nullable |
| acceptance_criteria | TEXT | Nullable |
| notes | TEXT | Nullable, Phase 1 rich-text notes field; không thay thế bằng comment thread |
| release_notes | TEXT | Nullable, Phase 1 technical writer/release notes content |
| schedule_state | VARCHAR(50) | Phase 1: idea, defined, in_progress, completed, accepted, release |
| flow_state | VARCHAR(50) | Phase 1: idea, defined, in_progress, completed, accepted, release |
| status_id | UUID | FK → workflow_statuses.id |
| priority | VARCHAR(50) | Defect only in Phase 1: none, low, normal, high, urgent |
| severity | VARCHAR(50) | Chỉ dùng cho defect |
| story_point | DECIMAL(5,2) | Nullable |
| estimate_hours | DECIMAL(8,2) | Nullable, Phase 1 task estimate in hours |
| todo_hours | DECIMAL(8,2) | Nullable, Phase 1 task remaining work in hours |
| actual_hours | DECIMAL(8,2) | Nullable, Phase 1 task actual work in hours; can become cached aggregate later |
| assignee_id | UUID | FK → users.id, nullable |
| reporter_id | UUID | FK → users.id |
| parent_id | UUID | FK → work_items.id, nullable |
| sprint_id | UUID | FK → sprints.id, nullable |
| release_id | UUID | FK → releases.id, nullable |
| due_date | DATE | Nullable |
| environment | VARCHAR(100) | Nullable, dùng cho defect |
| steps_to_reproduce | TEXT | Nullable, dùng cho defect |
| expected_result | TEXT | Nullable, dùng cho defect |
| actual_result | TEXT | Nullable, dùng cho defect |
| root_cause | TEXT | Nullable, dùng cho defect |
| resolution | TEXT | Nullable, dùng cho defect |
| position | INT | **DEPRECATED** — thay bằng `rank` (LexoRank). Xem Design Conventions §1b |
| rank | VARCHAR(255) | **LexoRank** — sort backlog/board; move = update 1 dòng |
| is_blocked | BOOLEAN | Default false |
| blocked_reason | TEXT | Nullable |
| created_by | UUID | FK → users.id |
| updated_by | UUID | FK → users.id |
| created_at | TIMESTAMP |  |
| updated_at | TIMESTAMP |  |
| deleted_at | TIMESTAMP | Soft delete |

Gợi ý enum `type`:

```text
initiative
feature
story
task
defect
```

Gợi ý enum `priority`:

```text
low
normal
high
urgent
none
```

Gợi ý enum `severity`:

```text
minor
major
critical
blocker
```

Index quan trọng:

```text
INDEX(project_id)
INDEX(workspace_id)
INDEX(status_id)
INDEX(type)
INDEX(assignee_id)
INDEX(reporter_id)
INDEX(parent_id)
INDEX(sprint_id)
INDEX(release_id)
INDEX(priority)
INDEX(created_at)
UNIQUE(project_id, item_no)
UNIQUE(project_id, item_key)
```

### Phase 1 Work Item field notes

- `story_point` là `Plan Estimate` cho Story/Defect.
- `estimate_hours`, `todo_hours`, `actual_hours` dùng cho Task trong Phase 1.
- Task vẫn là record trong `work_items` với `type='task'` và `parent_id` trỏ tới Story/Defect.
- `notes` và `release_notes` được thêm để khớp mockup Phase 1. Phase 1 đã chốt `notes` là rich-text/text field riêng; `comments` không thay thế `notes`.
- `actual_hours` trong Phase 1 mặc định là input trực tiếp; nếu phase sau có time entry chi tiết thì field này nên trở thành cached aggregate hoặc bỏ khỏi write trực tiếp.

### Phase 1 resolved BA decisions

- Phase 1 sidebar uses `Schedule State` and `Flow State`; the old sidebar label `Status` is renamed to `Flow State`.
- `schedule_state` and `flow_state` enum values: `idea`, `defined`, `in_progress`, `completed`, `accepted`, `release`.
- Backlog `Priority` is kept only for Defect. Story rows show `—` in the Priority column.
- Defect detail sidebar shows `Priority` only when `work_items.type = 'defect'`; options are `low`, `normal`, `high`, `urgent`, `none`.
- `actual_hours` is manually entered in Phase 1.
- `notes` is a text/rich-text field in Phase 1, not a replacement by comment thread.

---

## 8.2. `work_item_relations`

Dùng để tạo relation phức tạp ngoài parent-child.

Ví dụ relation:

```text
blocks
is_blocked_by
relates_to
duplicates
depends_on
```

| Field | Type | Note |
|---|---|---|
| id | UUID / BIGINT | Primary key |
| source_item_id | UUID | FK → work_items.id |
| target_item_id | UUID | FK → work_items.id |
| relation_type | VARCHAR(50) | blocks, duplicates, relates_to... |
| created_by | UUID | FK → users.id |
| created_at | TIMESTAMP |  |

Ghi chú:

- Dùng `parent_id` cho hierarchy chính.
- Dùng `work_item_relations` cho dependency hoặc quan hệ phụ.

---

## 8.3. `labels`

Label/tag theo project.

| Field | Type | Note |
|---|---|---|
| id | UUID / BIGINT | Primary key |
| project_id | UUID | FK → projects.id |
| team_id | UUID | Nullable, FK → teams.id; Sprint thường thuộc một Team |
| name | VARCHAR(100) | frontend, backend, urgent... |
| color | VARCHAR(20) | Nullable |
| created_at | TIMESTAMP |  |

Unique constraint:

```text
UNIQUE(project_id, name)
```

---

## 8.4. `work_item_labels`

Mapping work item với label.

| Field | Type | Note |
|---|---|---|
| id | UUID / BIGINT | Primary key |
| work_item_id | UUID | FK → work_items.id |
| label_id | UUID | FK → labels.id |
| created_at | TIMESTAMP |  |

Unique constraint:

```text
UNIQUE(work_item_id, label_id)
```

---

# 9. Sprint / Backlog / Board

## 9.1. `sprints`

Lưu sprint/iteration.

| Field | Type | Note |
|---|---|---|
| id | UUID / BIGINT | Primary key |
| project_id | UUID | FK → projects.id |
| name | VARCHAR(255) | Sprint 1, Sprint 2... |
| goal | TEXT | Nullable |
| start_date | DATE |  |
| end_date | DATE |  |
| status | VARCHAR(50) | planned, active, closed, cancelled |
| capacity | DECIMAL(8,2) | Nullable |
| created_by | UUID | FK → users.id |
| started_at | TIMESTAMP | Nullable |
| closed_at | TIMESTAMP | Nullable |
| created_at | TIMESTAMP |  |
| updated_at | TIMESTAMP |  |

Gợi ý enum `status`:

```text
planned
active
closed
cancelled
```

---

## 9.2. `sprint_items`

Mapping work item với sprint, dùng để lưu lịch sử item từng nằm trong sprint nào.

| Field | Type | Note |
|---|---|---|
| id | UUID / BIGINT | Primary key |
| sprint_id | UUID | FK → sprints.id |
| work_item_id | UUID | FK → work_items.id |
| added_by | UUID | FK → users.id |
| added_at | TIMESTAMP |  |
| removed_at | TIMESTAMP | Nullable |
| final_status_id | UUID | Nullable, FK → workflow_statuses.id |
| carried_over_to_sprint_id | UUID | Nullable, FK → sprints.id |

Ghi chú:

- MVP đơn giản có thể chỉ dùng `work_items.sprint_id`.
- Nếu muốn report velocity/burndown chính xác hơn, nên giữ `sprint_items`.

---

# 10. Release Management

## 10.1. `releases`

Lưu release/version.

| Field | Type | Note |
|---|---|---|
| id | UUID / BIGINT | Primary key |
| project_id | UUID | FK → projects.id |
| name | VARCHAR(255) | v1.0 MVP |
| version | VARCHAR(50) | 1.0.0 |
| description | TEXT | Nullable |
| start_date | DATE | Nullable |
| release_date | DATE | Nullable |
| status | VARCHAR(50) | planned, in_progress, released, cancelled, archived |
| created_by | UUID | FK → users.id |
| created_at | TIMESTAMP |  |
| updated_at | TIMESTAMP |  |

Gợi ý enum `status`:

```text
planned
in_progress
released
cancelled
archived
```

---

## 10.2. `release_items`

Mapping work item với release.

| Field | Type | Note |
|---|---|---|
| id | UUID / BIGINT | Primary key |
| release_id | UUID | FK → releases.id |
| work_item_id | UUID | FK → work_items.id |
| added_by | UUID | FK → users.id |
| added_at | TIMESTAMP |  |
| removed_at | TIMESTAMP | Nullable |

Ghi chú:

- MVP có thể chỉ dùng `work_items.release_id`.
- Nếu muốn lưu lịch sử move release, nên giữ `release_items`.

---

# 11. Collaboration

## 11.1. `comments`

Bình luận trong work item.

| Field | Type | Note |
|---|---|---|
| id | UUID / BIGINT | Primary key |
| work_item_id | UUID | FK → work_items.id |
| parent_comment_id | UUID | Nullable, reply comment |
| author_id | UUID | FK → users.id |
| body | TEXT | Nội dung comment |
| is_edited | BOOLEAN | Default false |
| created_at | TIMESTAMP |  |
| updated_at | TIMESTAMP |  |
| deleted_at | TIMESTAMP | Nullable |

---

## 11.2. `attachments`

File upload cho work item hoặc comment.

| Field | Type | Note |
|---|---|---|
| id | UUID / BIGINT | Primary key |
| workspace_id | UUID | FK → workspaces.id |
| project_id | UUID | FK → projects.id |
| work_item_id | UUID | Nullable, FK → work_items.id |
| comment_id | UUID | Nullable, FK → comments.id |
| uploaded_by | UUID | FK → users.id |
| file_name | VARCHAR(255) | Tên file gốc |
| file_url | TEXT | URL object storage |
| file_type | VARCHAR(100) | MIME type |
| file_size | BIGINT | bytes |
| storage_key | TEXT | Path/key trong S3/R2 |
| created_at | TIMESTAMP |  |

---

## 11.3. `watchers`

User theo dõi work item để nhận notification.

| Field | Type | Note |
|---|---|---|
| id | UUID / BIGINT | Primary key |
| work_item_id | UUID | FK → work_items.id |
| user_id | UUID | FK → users.id |
| created_at | TIMESTAMP |  |

Unique constraint:

```text
UNIQUE(work_item_id, user_id)
```

---

# 12. Activity Log / Audit Log

## 12.1. `activity_logs`

Audit log cho hành động trong hệ thống.

| Field | Type | Note |
|---|---|---|
| id | UUID / BIGINT | Primary key |
| workspace_id | UUID | FK → workspaces.id |
| project_id | UUID | Nullable, FK → projects.id |
| work_item_id | UUID | Nullable, FK → work_items.id |
| actor_id | UUID | FK → users.id |
| action | VARCHAR(100) | work_item.updated, status.changed... |
| entity_type | VARCHAR(100) | project, work_item, sprint... |
| entity_id | UUID | ID của entity |
| old_value | JSONB | Nullable |
| new_value | JSONB | Nullable |
| metadata | JSONB | Nullable |
| created_at | TIMESTAMP |  |

Ví dụ action:

```text
work_item.created
work_item.updated
work_item.status_changed
work_item.assigned
comment.created
attachment.uploaded
sprint.started
sprint.closed
release.created
project.updated
```

Bảng này dùng cho:

- Activity tab trong work item
- Audit log trong Admin/Settings
- Debug nghiệp vụ
- Reporting nâng cao sau này

---

# 13. Notification

## 13.1. `notifications`

Thông báo trong app.

| Field | Type | Note |
|---|---|---|
| id | UUID / BIGINT | Primary key |
| user_id | UUID | Người nhận, FK → users.id |
| workspace_id | UUID | FK → workspaces.id |
| project_id | UUID | Nullable, FK → projects.id |
| work_item_id | UUID | Nullable, FK → work_items.id |
| type | VARCHAR(100) | assigned, mentioned, status_changed... |
| title | VARCHAR(255) | Tiêu đề |
| body | TEXT | Nội dung |
| is_read | BOOLEAN | Default false |
| read_at | TIMESTAMP | Nullable |
| created_at | TIMESTAMP |  |

Gợi ý enum `type`:

```text
assigned
mentioned
commented
status_changed
due_soon
sprint_started
sprint_closed
```

---

# 14. Utility

## 14.1. `saved_filters`

Lưu filter cá nhân hoặc filter project.

| Field | Type | Note |
|---|---|---|
| id | UUID / BIGINT | Primary key |
| workspace_id | UUID | FK → workspaces.id |
| project_id | UUID | Nullable, FK → projects.id |
| user_id | UUID | FK → users.id |
| name | VARCHAR(255) | My Open Bugs, My Tasks... |
| filter_config | JSONB | Điều kiện filter |
| is_shared | BOOLEAN | Share cho project hay không |
| created_at | TIMESTAMP |  |
| updated_at | TIMESTAMP |  |

Ví dụ `filter_config`:

```json
{
  "type": ["defect"],
  "status": ["in_progress", "testing"],
  "assignee_id": "user-id",
  "priority": ["high", "urgent"]
}
```

---

# 15. Bảng có thể thêm sau MVP

Các bảng sau chưa cần build ngay, nhưng có thể thêm khi sản phẩm mở rộng.

## 15.1. Custom Field

Nếu muốn user tự tạo field custom như Jira/Rally:

```text
custom_fields
custom_field_values
```

MVP chưa nên làm vì phức tạp.

---

## 15.2. Test Management

Nếu muốn thêm test case/test run:

```text
test_cases
test_runs
test_results
```

---

## 15.3. Time Tracking

Nếu muốn tracking effort/time spent:

```text
time_logs
```

Gợi ý fields:

```text
work_item_id
user_id
time_spent_minutes
log_date
description
created_at
updated_at
```

---

## 15.4. Integration / Webhook

Nếu muốn tích hợp Slack, Teams, GitHub:

```text
integrations
webhooks
```

---

# 15b. Foundation / Enterprise tables (aligned with `05_Architecture/`)

Bổ sung cho multi-tenant SaaS chuẩn enterprise. Tất cả mang `workspace_id` + RLS + UUIDv7 PK trừ khi ghi chú khác.

## 15b.1 `outbox_events` (Transactional Outbox)

| Field | Type | Note |
|---|---|---|
| id | UUID | PK (UUIDv7) |
| workspace_id | UUID | tenant scope |
| aggregate_type | VARCHAR(100) | vd work_item, project |
| aggregate_id | UUID | id của aggregate |
| event_type | VARCHAR(150) | vd WorkItemStatusChanged |
| payload | JSONB | dữ liệu event |
| status | VARCHAR(20) | pending, published, failed |
| created_at | TIMESTAMPTZ |  |
| published_at | TIMESTAMPTZ | nullable |

## 15b.2 `idempotency_keys`

| Field | Type | Note |
|---|---|---|
| id | UUID | PK |
| workspace_id | UUID | tenant scope |
| idempotency_key | VARCHAR(255) | unique per (workspace, endpoint) |
| request_hash | TEXT | chống reuse key sai payload |
| response_snapshot | JSONB | nullable, trả lại cho retry |
| created_at | TIMESTAMPTZ |  |
| expires_at | TIMESTAMPTZ |  |

## 15b.3 `mfa_credentials`

| Field | Type | Note |
|---|---|---|
| id | UUID | PK |
| user_id | UUID | FK → users.id |
| type | VARCHAR(20) | totp, webauthn |
| secret_or_credential | TEXT | encrypted |
| created_at | TIMESTAMPTZ |  |
| last_used_at | TIMESTAMPTZ | nullable |

## 15b.4 `identity_providers` (SSO — OIDC/SAML)

| Field | Type | Note |
|---|---|---|
| id | UUID | PK |
| workspace_id | UUID | tenant scope |
| type | VARCHAR(20) | oidc, saml |
| config | JSONB | issuer, metadata, mappings |
| status | VARCHAR(20) | active, disabled |
| created_at | TIMESTAMPTZ |  |

## 15b.5 Billing-ready (`plans`, `subscriptions`, `subscription_seats`)

| Table | Key fields |
|---|---|
| plans | id, name, tier, limits (JSONB), price, billing_period |
| subscriptions | id, workspace_id, plan_id, status, trial_ends_at, current_period_end |
| subscription_seats | id, workspace_id, subscription_id, user_id, assigned_at |

> MVP **không** build billing logic, nhưng schema để sẵn để fast-follow không phải re-migrate.

## 15b.6 `notification_preferences`

| Field | Type | Note |
|---|---|---|
| id | UUID | PK |
| user_id | UUID | FK → users.id |
| workspace_id | UUID | tenant scope |
| event_type | VARCHAR(100) | assigned, mentioned, comment, status... |
| channel | VARCHAR(20) | in_app, email |
| enabled | BOOLEAN | default true |

---

# 16. Bản MVP gọn nhất

Nếu muốn build MVP nhanh nhưng vẫn dùng được, có thể bắt đầu với **26 bảng**:

```text
users
auth_sessions
password_reset_tokens
workspaces
workspace_members
workspace_invitations
workspace_settings
roles
permissions
role_permissions
projects
project_members
project_settings
teams
team_members
project_teams
workflow_statuses
work_items
work_item_relations
labels
work_item_labels
sprints
releases
comments
attachments
activity_logs
```

Có thể delay các bảng này:

```text
workflow_transitions
sprint_items
release_items
notifications
saved_filters
watchers
```

---

# 17. Bản full đề xuất

Bản full nhưng vẫn hợp lý cho sản phẩm nghiêm túc:

## Core

```text
1. users
2. auth_sessions
3. password_reset_tokens
4. workspaces
5. workspace_members
6. workspace_invitations
7. workspace_settings
8. roles
9. permissions
10. role_permissions
```

## Project

```text
11. projects
12. project_members
13. project_settings
14. teams
15. team_members
16. project_teams
```

## Workflow

```text
17. workflow_statuses
18. workflow_transitions
```

## Work Item

```text
19. work_items
20. work_item_relations
21. labels
22. work_item_labels
```

## Planning

```text
23. sprints
24. sprint_items
25. releases
26. release_items
```

## Collaboration

```text
27. comments
28. attachments
29. watchers
```

## Audit & Notification

```text
30. activity_logs
31. notifications
```

## Utility

```text
32. saved_filters
```

---

# 18. Quan hệ chính giữa các bảng

```text
users 1--n workspace_members
users 1--n auth_sessions
users 1--n password_reset_tokens
workspaces 1--n workspace_members
workspaces 1--n workspace_invitations
workspaces 1--1 workspace_settings
workspaces 1--n projects
workspaces 1--n teams

roles 1--n workspace_members
roles 1--n project_members
roles n--n permissions through role_permissions

projects 1--n project_members
projects n--n teams through project_teams
teams 1--n team_members
users 1--n team_members
projects 1--n workflow_statuses
projects 1--n workflow_transitions
projects 1--n work_items
projects 1--n sprints
projects 1--n releases
projects 1--n labels

workflow_statuses 1--n work_items

work_items 1--n comments
work_items 1--n attachments
work_items 1--n activity_logs
work_items 1--n watchers
work_items n--n labels through work_item_labels
work_items n--n work_items through work_item_relations

sprints 1--n sprint_items
sprints 1--n work_items

releases 1--n release_items
releases 1--n work_items

users 1--n comments
users 1--n attachments
users 1--n activity_logs
users 1--n notifications
users 1--n saved_filters
```

---

# 19. Lưu ý thiết kế quan trọng

## 19.1. UUID hay BIGINT?

Khuyến nghị:

```text
Primary key: UUID
Display key: PROJECTKEY-number
```

Ví dụ:

```text
id = 7f6d8e5a-xxxx-xxxx
item_key = COX-123
```

User chỉ thấy `COX-123`, hệ thống dùng UUID để xử lý.

---

## 19.2. Work item nên dùng 1 bảng hay nhiều bảng?

Nên dùng **1 bảng `work_items` duy nhất**.

Không nên tách thành:

```text
stories
tasks
defects
features
```

Vì board, backlog, sprint, release đều cần query chung. Dùng `work_items.type` sẽ đơn giản và dễ mở rộng hơn.

---

## 19.3. Có nên có `parent_id` không?

Có.

Dùng `parent_id` cho hierarchy chính:

```text
Feature → Story → Task
Feature → Story → Defect
```

Dùng `work_item_relations` cho relation phụ:

```text
A blocks B
A duplicates B
A relates to B
A depends on B
```

---

## 19.4. Sprint và Release nên lưu trực tiếp trong `work_items` không?

Có thể lưu trực tiếp:

```text
work_items.sprint_id
work_items.release_id
```

Để query nhanh.

Nếu cần lưu lịch sử, thêm:

```text
sprint_items
release_items
```

Best practice cho app này:

```text
MVP: dùng sprint_id và release_id trong work_items
Version 2: thêm sprint_items và release_items để lưu history
```

---

# 20. Kết luận

Bộ DB đề xuất gồm **32 bảng** để cover toàn bộ nghiệp vụ hiện tại của hệ thống Mini Rally, bao gồm session/password reset, invitation/settings Company và Team nhiều-nhiều với Project:

```text
✅ User / Workspace
✅ Role / Permission
✅ Project
✅ Backlog
✅ Work Item hierarchy
✅ Story / Task / Defect
✅ Sprint
✅ Board
✅ Release
✅ Comment
✅ Attachment
✅ Activity Log
✅ Notification
✅ Saved Filter
✅ Admin / Settings
✅ Basic Reporting
```

Với quy mô khoảng **200 users**, thiết kế này có thể bắt đầu bằng PostgreSQL, dùng UUID làm primary key, index kỹ các field phục vụ query, và build theo hướng modular monolith.
