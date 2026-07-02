# SRS — Phase 1.5 Estimate / To Do / Actual Time Tracking

## 0. Document Control

| Thuộc tính | Giá trị |
|---|---|
| Module ID | `P1-TIME` |
| Trạng thái | Draft for Development |
| Phạm vi | Plan Estimate, Task Estimate, To Do, Actual |
| Ưu tiên | P1 — bắt buộc |
| Phụ thuộc | Work Item Detail, Task Management |
| Không bao gồm | Timesheet, approval, detailed time entries |

## 1. Mục tiêu

Phase 1 cần đủ field để quản lý estimate và actual ở mức cơ bản:

- Story/Defect có `Plan Estimate` theo point.
- Task có `Estimate`, `To Do`, `Actual` theo giờ.
- Task list có totals row.

## 2. DB Gap cần xử lý

DB design đã bổ sung các column sau vào `work_items`; production implementation cần tạo migration tương ứng:

| Proposed column | Type | Dùng cho | Lý do |
|---|---|---|---|
| `estimate_hours` | DECIMAL(8,2) NULL | Task | Lưu Estimate theo giờ |
| `todo_hours` | DECIMAL(8,2) NULL | Task | Lưu remaining To Do |
| `actual_hours` | DECIMAL(8,2) NULL | Task | Lưu actual input tối thiểu Phase 1 |

Phase 1 đã chốt `actual_hours` là giá trị nhập tay. Nếu sau này làm timesheet, `actual_hours` có thể chuyển thành cached aggregate từ bảng time entries.

## 3. DB ↔ UI Field Mapping

| UI field | Applies to | API DTO | DB source/target | Unit | Rule |
|---|---|---|---|---|---|
| Plan Estimate | Story/Defect | `planEstimate` | `work_items.story_point` | points | Decimal >= 0, nullable |
| Estimate | Task | `estimateHours` | `work_items.estimate_hours` | hours | Decimal >= 0, nullable/0 |
| To Do | Task | `todoHours` | `work_items.todo_hours` | hours | Decimal >= 0 |
| Actual | Task | `actualHours` | `work_items.actual_hours` | hours | Decimal >= 0 |
| Task Estimate total | Parent Work Item task tab | `totals.estimateHours` | SUM child `estimate_hours` | hours | Derived |
| Task To Do total | Parent Work Item task tab | `totals.todoHours` | SUM child `todo_hours` | hours | Derived |
| Task Actual total | Parent Work Item task tab | `totals.actualHours` | SUM child `actual_hours` | hours | Derived |

## 4. Functional Requirements

| ID | Requirement |
|---|---|
| TIME-FR-001 | Work Item sidebar Plan Estimate maps to story points. |
| TIME-FR-002 | Task create modal accepts Estimate. |
| TIME-FR-003 | Task detail allows editing Estimate/To Do/Actual. |
| TIME-FR-004 | Task list shows Estimate/To Do/Actuals. |
| TIME-FR-005 | Totals row sums visible/all child task time fields consistently. |
| TIME-FR-006 | Time fields cannot be negative. |
| TIME-FR-007 | Updating time fields writes activity log. |
| TIME-FR-008 | Empty time field displays 0 or blank consistently. |

## 5. API Contract

Task patch:

```json
{
  "estimateHours": 5,
  "todoHours": 0,
  "actualHours": 13
}
```

Task list totals:

```json
{
  "totals": {
    "estimateHours": 10,
    "todoHours": 0,
    "actualHours": 21
  }
}
```

## 6. Calculation Rules

- Totals should be calculated server-side for data integrity.
- FE can recalculate optimistically after local update.
- Null task time values count as 0 in totals.
- `Actual > Estimate` is allowed; show variance later, not Phase 1.
- `To Do = 0` does not automatically mark Completed unless explicitly decided later.

## 7. Activity Log Rules

| Change | Action |
|---|---|
| Plan Estimate changed | `work_item.estimate_updated` |
| Task Estimate changed | `task.estimate_updated` |
| Task To Do changed | `task.todo_updated` |
| Task Actual changed | `task.actual_updated` |

## 8. Acceptance Criteria

1. Plan Estimate saved on Story/Defect and visible after refresh.
2. Task Estimate/To Do/Actual saved and visible after refresh.
3. Negative values are rejected.
4. Totals row equals sum of child tasks.
5. Updating Actual creates Revision History entry.
6. Viewer cannot edit time fields.

## 9. Open Questions

| ID | Question | Default đề xuất |
|---|---|---|
| TIME-Q01 | Actual nhập tay hay aggregate từ time entries? | Đã chốt: Phase 1 nhập tay vào `actual_hours`; phase sau có thể thay bằng time entries |
