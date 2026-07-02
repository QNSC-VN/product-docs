# Mini Rally / Agile Work Management Tool - Role Mapping Use Case Matrix

## 1. Tổng quan

Tài liệu này mô tả danh sách **Use Case** theo từng module của hệ thống **Mini Rally / Agile Work Management Tool**, kèm bảng mapping quyền sử dụng theo từng role.

Thay vì dùng Use Case Diagram nhiều mũi tên gây rối, tài liệu này trình bày theo dạng **Role Mapping Use Case Matrix** để dễ đọc, dễ review và dễ chuyển thành yêu cầu phân quyền khi phát triển hệ thống.

---

## 2. Danh sách Actor / Role

| Role | Mô tả |
|---|---|
| **Workspace Admin** | Quản trị toàn bộ workspace/system |
| **Project Manager / Scrum Master** | Quản lý project, sprint, release, board |
| **Product Owner / BA** | Quản lý backlog, requirement, user story |
| **Developer** | Nhận task, cập nhật tiến độ, xử lý work item |
| **Tester / QA** | Tạo defect, verify bug, cập nhật trạng thái test |
| **Viewer / Stakeholder** | Chỉ xem thông tin, dashboard, report |

---

## 3. Account & Workspace

| Use Case | Workspace Admin | PM / Scrum Master | PO / BA | Developer | QA | Viewer |
|---|---:|---:|---:|---:|---:|---:|
| Đăng nhập | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Đăng xuất | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Quản lý hồ sơ cá nhân | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Đổi mật khẩu | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Quản lý Workspace | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Mời người dùng vào Workspace | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Quản lý vai trò & phân quyền | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 4. Project Management

| Use Case | Workspace Admin | PM / Scrum Master | PO / BA | Developer | QA | Viewer |
|---|---:|---:|---:|---:|---:|---:|
| Tạo Project | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Xem danh sách Project | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Xem chi tiết Project | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Cập nhật thông tin Project | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Xóa / Archive Project | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Quản lý thành viên Project | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Cấu hình Project | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Tạo/Cập nhật/Archive Team | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Quản lý Team members | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Link/Unlink Team với Project | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Chuyển Project/Team context | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 5. Work Item Management

| Use Case | Workspace Admin | PM / Scrum Master | PO / BA | Developer | QA | Viewer |
|---|---:|---:|---:|---:|---:|---:|
| Tạo Work Item | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| Xem danh sách Work Item | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Xem chi tiết Work Item | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Cập nhật Work Item | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Xóa Work Item | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Assign người phụ trách | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Cập nhật trạng thái Work Item | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Cập nhật Priority | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Cập nhật Story Point | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Liên kết Epic / Story / Task / Defect | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Bình luận Work Item | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Upload Attachment | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Xem Activity Log của Work Item | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 6. Backlog Management

| Use Case | Workspace Admin | PM / Scrum Master | PO / BA | Developer | QA | Viewer |
|---|---:|---:|---:|---:|---:|---:|
| Xem Backlog | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Tạo item trong Backlog | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| Grooming Backlog | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Sắp xếp Priority | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Filter / Search Backlog | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Resize cột / đổi page size | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 7. Sprint / Iteration Management

| Use Case | Workspace Admin | PM / Scrum Master | PO / BA | Developer | QA | Viewer |
|---|---:|---:|---:|---:|---:|---:|
| Tạo Sprint | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Cập nhật Sprint | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Start Sprint | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Close Sprint | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Xem Sprint hiện tại | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Xem Sprint Progress | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Move unfinished item sang Sprint khác | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

---

## 8. Board Management

| Use Case | Workspace Admin | PM / Scrum Master | PO / BA | Developer | QA | Viewer |
|---|---:|---:|---:|---:|---:|---:|
| Xem Scrum / Kanban Board | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Kéo thả trạng thái Work Item | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Filter Board | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Xem item theo Assignee | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Xem item bị Blocked | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 9. Release Management

| Use Case | Workspace Admin | PM / Scrum Master | PO / BA | Developer | QA | Viewer |
|---|---:|---:|---:|---:|---:|---:|
| Tạo Release | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Cập nhật Release | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Gán Work Item vào Release | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Xem danh sách Release | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Xem Release Progress | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Close Release | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 10. Dashboard & Reports

| Use Case | Workspace Admin | PM / Scrum Master | PO / BA | Developer | QA | Viewer |
|---|---:|---:|---:|---:|---:|---:|
| Xem Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Xem Burndown Chart | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Xem Velocity Chart | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Xem Defect Summary | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Xem Workload Report | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Xem Release Progress Report | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Export Report | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

---

## 11. Notification

| Use Case | Workspace Admin | PM / Scrum Master | PO / BA | Developer | QA | Viewer |
|---|---:|---:|---:|---:|---:|---:|
| Nhận notification khi được assign | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Nhận notification khi bị mention | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Nhận notification khi item đổi trạng thái | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Gửi email notification | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Cấu hình notification cá nhân | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |

---

## 12. Admin / Settings

| Use Case | Workspace Admin | PM / Scrum Master | PO / BA | Developer | QA | Viewer |
|---|---:|---:|---:|---:|---:|---:|
| Quản lý User | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Quản lý Role | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Quản lý Permission | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Cấu hình Workflow Status | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Quản lý Label | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Xem Activity Log / Audit Log | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Cấu hình Workspace | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Cấu hình Project Settings | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 13. Tóm tắt quyền theo Role

### Workspace Admin

Toàn quyền quản lý workspace, user, role, permission, project, workflow, audit log, dashboard và toàn bộ dữ liệu trong hệ thống.

### Project Manager / Scrum Master

Quản lý project, member, backlog, sprint, board, release và report. Có quyền cấu hình workflow và project settings ở mức project.

### Product Owner / BA

Quản lý requirement, work item, backlog, priority, acceptance criteria và hỗ trợ sprint planning. Có quyền xem dashboard/report liên quan đến product delivery.

### Developer

Xem work item được assign, cập nhật trạng thái công việc, bình luận, upload attachment và thao tác trên board.

### Tester / QA

Tạo defect, cập nhật defect/test status, bình luận, upload attachment và xem defect report.

### Viewer / Stakeholder

Chỉ xem project, backlog, board, dashboard và report. Không có quyền chỉnh sửa dữ liệu.

---

## 14. Ghi chú phân quyền

- **Workspace Admin** có quyền cao nhất trong toàn bộ workspace.
- **PM / Scrum Master** có quyền quản lý trong phạm vi project được phân quyền.
- **PO / BA** có quyền quản lý backlog và work item nhưng không nên có quyền cấu hình user/role ở cấp workspace.
- **Developer** và **QA** có quyền cập nhật work item phục vụ delivery nhưng không có quyền quản trị project.
- **Viewer / Stakeholder** chỉ có quyền xem, không có quyền tạo, sửa hoặc xóa dữ liệu.
- Với các chức năng nhạy cảm như xóa project, xóa work item, cấu hình permission, hệ thống nên yêu cầu quyền admin hoặc project admin rõ ràng.

---

## 15. Gợi ý áp dụng khi phát triển

Có thể chuyển bảng mapping này thành permission code theo dạng:

```text
module.action
```

Ví dụ:

```text
workspace.manage
workspace.invite_user
project.create
project.update
project.archive
work_item.create
work_item.update
work_item.delete
work_item.assign
backlog.groom
sprint.create
sprint.start
sprint.close
board.update_status
release.create
report.view
report.export
admin.manage_user
admin.manage_role
admin.manage_permission
```

Sau đó mỗi role sẽ được gán một danh sách permission tương ứng.
