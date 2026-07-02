# Phase 1 — Mockup Coverage Checklist

Ngày đồng bộ: 2026-06-24

## 1. Phase scope đã chốt

Phase 1 tập trung vào Core Work Item Management:

1. Backlog Work Item List.
2. Create Story / Defect.
3. Work Item Detail.
4. Child Tasks / Task Detail.
5. Estimate / To Do / Actual Time Tracking.
6. Description / Notes / Attachments / Release Notes.
7. Basic Activity Log / Revision History.

Không nằm trong Phase 1:

- Sprint planning đầy đủ.
- Board/Kanban execution.
- Quality/Test Case management.
- Portfolio hierarchy.
- Release planning đầy đủ.
- Report/analytics nâng cao.
- Notification/workflow automation.

## 2. Mockup coverage summary

| Area | Requirement | Mockup status | Mockup source | Ghi chú |
|---|---|---:|---|---|
| Backlog | List hiển thị toàn bộ Story/Defect | ✅ | `03_Mockup Design/src/app/pages/BacklogPage.tsx` | Type filter chỉ còn Story/Defect |
| Backlog | Click Work Item ID mở full detail | ✅ | `BacklogPage.tsx`, `App.tsx` | Đã mở full page detail, không chỉ summary panel |
| Backlog | Resizable columns | ✅ | `BacklogPage.tsx` | Có resize handle theo column |
| Backlog | Pagination footer | ✅ | `BacklogPage.tsx` | Rows per page 10/25/50/100 + prev/next |
| Backlog | Project dropdown trên title | ✅ | `BacklogPage.tsx` | Có selector project/team trong create/context |
| Backlog | Team dropdown kế project | ✅ | `BacklogPage.tsx` | Theo mockup hiện tại |
| Backlog | Bỏ Feature và Task khỏi create/filter | ✅ | `BacklogPage.tsx` | Chỉ Story/Defect |
| Backlog | Cột Priority/Schedule State/Release | ✅ | `BacklogPage.tsx` | Priority chỉ áp dụng cho Defect; Story hiển thị `—` |
| Create Work Item | Quick create modal | ✅ | `BacklogPage.tsx` | Type, Project, Team, Title, Owner, Plan Estimate |
| Create Work Item | Buttons Cancel/Create/Create with details | ✅ | `BacklogPage.tsx` | Create with details đang là mock action |
| Create Work Item | Full create-with-details flow | 🟡 | `BacklogPage.tsx`, `WorkItemDetailPage.tsx` | Chưa có screen create-detail riêng; production có thể create rồi redirect detail |
| Work Item Detail | Header Story/ID/Name | ✅ | `WorkItemDetailPage.tsx` | Có collapse icon và back |
| Work Item Detail | Tabs Details/Tasks/Revision History | ✅ | `WorkItemDetailPage.tsx` | Đúng scope Phase 1 |
| Work Item Detail | Details left/right layout | ✅ | `WorkItemDetailPage.tsx` | Left content, right field panel, scroll riêng |
| Work Item Detail | Description rich editor | ✅ | `WorkItemDetailPage.tsx` | Toolbar mockup đầy đủ |
| Work Item Detail | Attachments | ✅ | `WorkItemDetailPage.tsx` | Drag/click area |
| Work Item Detail | Notes | ✅ | `WorkItemDetailPage.tsx` | Rich editor |
| Work Item Detail | Release Notes | ✅ | `WorkItemDetailPage.tsx` | Rich editor cho technical writer content |
| Work Item Detail | Sidebar Owner/Project/Team/Schedule State/Flow State/Priority/Plan Estimate/Release/Iteration | ✅ | `Priority` chỉ show khi item type là Defect; options Low/Normal/High/Urgent/None |
| Task List | Task tab full width, bỏ sidebar phải | ✅ | `WorkItemDetailPage.tsx` | Khi click Tasks, content chiếm full details area |
| Task List | Columns Rank, ID, Name, State, Owner, Project, Teams, To Do, Actuals, Estimate | ✅ | `WorkItemDetailPage.tsx` | Có totals row |
| Task Create | Add Task modal | ✅ | `WorkItemDetailPage.tsx` | Name required, Estimate, Owner |
| Task Create | Buttons Cancel/Create/Create with details | ✅ | `WorkItemDetailPage.tsx` | Đúng yêu cầu |
| Task Detail | Click Task ID mở detail page | ✅ | `WorkItemDetailPage.tsx` | Có Back to task list |
| Task Detail | Banner riêng cho Task Detail | ✅ | `WorkItemDetailPage.tsx` | Chỉ Details + Revision History, bỏ Tasks tab |
| Task Detail | Left content Description/Notes/Attachments | ✅ | `WorkItemDetailPage.tsx` | Dùng rich editor và attachment block |
| Task Detail | Right fields State/Owner/Project/Team/Work Product/Estimate/To Do/Actual | ✅ | `WorkItemDetailPage.tsx` | State chỉ Defined/In-Progress/Completed |
| Activity Log | Work Item Revision History | ✅ | `WorkItemDetailPage.tsx` | Basic activity log table |
| Activity Log | Task Revision History | ✅ | `WorkItemDetailPage.tsx` | Basic activity log theo task |

## 3. DB coverage / gaps cần dev xử lý

| Field/Feature | DB hiện tại | Coverage | Action trong Phase 1 |
|---|---|---:|---|
| Story/Defect/Task core | `work_items.type` | ✅ | Dùng chung `work_items`, không tạo bảng task riêng |
| Parent Story → Task | `work_items.parent_id` | ✅ | Task có `type='task'`, `parent_id` trỏ tới Story/Defect |
| Project/Team | `work_items.project_id`, `work_items.team_id`, `project_teams` | ✅ | Validate team thuộc project |
| Schedule State / Flow State | `work_items.schedule_state`, `work_items.flow_state` | ✅ | Work Item Detail dùng 2 state riêng theo quyết định mới |
| Owner | `work_items.assignee_id` | ✅ | Join `users` |
| Plan Estimate | `work_items.story_point` | ✅ | Mapping tên UI `Plan Estimate` → DB `story_point` |
| Task Estimate | DB design đã bổ sung `estimate_hours` | ✅ | Production migration cần implement |
| To Do | DB design đã bổ sung `todo_hours` | ✅ | Production migration cần implement |
| Actual | DB design đã bổ sung `actual_hours` | ✅ | Phase 1 chốt nhập tay |
| Description | `work_items.description` | ✅ | Rich text/HTML hoặc markdown sanitize |
| Notes | DB design đã bổ sung `work_items.notes` | ✅ | Chốt lưu text/rich-text field riêng trong Phase 1 |
| Release Notes | DB design đã bổ sung `work_items.release_notes` | ✅ | Production migration cần implement |
| Attachments | `attachments` | ✅ | Object storage + metadata |
| Activity Log | `activity_logs` | ✅ | Ghi log cho create/update/Schedule State/Flow State/Defect Priority/assignment/attachment/comment/time |
| Comments | `comments` | ✅ | Không thay thế Notes nếu Notes là field editable riêng |

## 4. Quyết định đã chốt trước khi dev

| ID | Quyết định | Ghi chú dev |
|---|---|---|
| P1-DC-001 | Backlog giữ `Priority`, nhưng chỉ dành cho Defect | Story hiển thị `—`; priority filter nếu có chỉ filter Defect |
| P1-DC-002 | Phase 1 timebox = 2 working days = 16 hours | Tracking dùng 1 day = 8 hours |
| P1-DC-003 | `Notes` là text/rich-text field riêng | Không dùng comment thread thay thế Notes trong Phase 1 |
| P1-DC-004 | `Actual` nhập tay | Lưu vào `work_items.actual_hours`; phase sau mới cân nhắc aggregate từ time entries |
| P1-DC-005 | Work Item sidebar dùng `Schedule State` và `Flow State` | `Status` sidebar đổi thành `Flow State`; options: Idea/Defined/In-Progress/Completed/Accepted/Release |
| P1-DC-006 | Defect Detail sidebar hiển thị `Priority` | Chỉ show với Defect; options: Low/Normal/High/Urgent/None |

## 5. Kết luận mockup

Mockup Phase 1 đủ để viết SRS và giao dev triển khai. Các gap còn lại chủ yếu là quyết định production data contract, không phải thiếu màn hình lớn.
