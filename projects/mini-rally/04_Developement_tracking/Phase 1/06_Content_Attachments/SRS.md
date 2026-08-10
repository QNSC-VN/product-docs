# SRS — Phase 1.6 Description / Notes / Attachments / Release Notes

## 0. Document Control

| Thuộc tính | Giá trị |
|---|---|
| Module ID | `P1-CONTENT` |
| Trạng thái | Draft for Development |
| Phạm vi | Rich content và attachments của Work Item/Task |
| Ưu tiên | P1 — bắt buộc |
| Phụ thuộc | Work Item Detail, Task Detail, Attachment storage |
| Không bao gồm | Attachment preview/versioning, collaborative editing |

## 1. Mục tiêu

Cho phép user ghi nội dung nghiệp vụ có format và đính kèm file:

- Work Item: Description, Attachments, Notes, Release Notes.
- Task: Description, Notes, Attachments.

## 2. DB Coverage / Gap

| Content | DB hiện tại | Action Phase 1 |
|---|---|---|
| Description | `work_items.description` | Dùng hiện tại |
| Attachments | `attachments` | Dùng hiện tại |
| Notes | DB design đã bổ sung `work_items.notes` | Production migration cần implement; Phase 1 chốt dùng text/rich-text field riêng |
| Release Notes | DB design đã bổ sung `work_items.release_notes` | Production migration cần implement |

Đề xuất Phase 1: thêm `notes` và `release_notes` vào `work_items` vì mockup thể hiện như rich text field editable riêng, không phải comment thread.

## 3. DB ↔ UI Field Mapping

| UI field | Applies to | API DTO | DB source/target | Purpose | Rule |
|---|---|---|---|---|---|
| Description | Story/Defect/Task | `description` | `work_items.description` | Miêu tả nghiệp vụ/implementation | Nullable, sanitized rich text |
| Notes | Story/Defect/Task | `notes` | `work_items.notes` | Ghi chú nội bộ | Nullable, sanitized rich text |
| Release Notes | Story/Defect | `releaseNotes` | `work_items.release_notes` | Technical writer/release content | Nullable, sanitized rich text |
| Attachment name | Both | `attachments[].fileName` | `attachments.file_name` | Tên file | Required |
| Attachment URL | Both | `attachments[].url` | `attachments.file_url/storage_key` | Download file | Signed URL if private |
| Attachment MIME | Both | `attachments[].fileType` | `attachments.file_type` | Type display/security | Required |
| Attachment size | Both | `attachments[].fileSize` | `attachments.file_size` | Display/limit | Required |
| Uploaded by | Both | `attachments[].uploadedBy` | `attachments.uploaded_by → users` | Audit | Current user |

## 4. Functional Requirements

| ID | Requirement |
|---|---|
| CNT-FR-001 | Rich editor toolbar hiển thị trong Description/Notes/Release Notes. |
| CNT-FR-002 | Save content persist DB. |
| CNT-FR-003 | Content render safe, không XSS. |
| CNT-FR-004 | Attachment block cho phép drag/click upload. |
| CNT-FR-005 | Upload lưu file storage và metadata DB. |
| CNT-FR-006 | Attachment list hiển thị file name/metadata. |
| CNT-FR-007 | Delete attachment soft/hard theo policy và log activity. |
| CNT-FR-008 | Task detail không cần Release Notes. |
| CNT-FR-009 | Viewer read-only, không upload/delete. |

## 5. API Contracts

```text
PATCH  /api/v1/work-items/:id/content
GET    /api/v1/work-items/:id/attachments
POST   /api/v1/work-items/:id/attachments
DELETE /api/v1/attachments/:attachmentId
```

Patch content request:

```json
{
  "description": "<p>...</p>",
  "notes": "<p>...</p>",
  "releaseNotes": "<p>...</p>"
}
```

Attachment response:

```json
{
  "id": "uuid",
  "fileName": "implementation-outline.md",
  "fileType": "text/markdown",
  "fileSize": 277000,
  "downloadUrl": "https://signed-url",
  "uploadedBy": { "id": "uuid", "fullName": "Marcus Webb" },
  "createdAt": "2026-06-24T10:00:00Z"
}
```

## 6. Storage/Security Rules

- Do not store raw user file in DB.
- Store object key in `attachments.storage_key`.
- Generate signed download URL when file private.
- Validate file size and MIME.
- Sanitize rich text on server; client render only sanitized output.
- Activity log must not store large content body; store summary/field names.

## 7. Acceptance Criteria

1. Description saves and persists after refresh.
2. Notes saves and persists after refresh.
3. Release Notes saves for Story/Defect.
4. Upload attachment creates DB metadata and file storage object.
5. Attachment appears in item/task attachment list.
6. Viewer cannot edit/upload/delete.
7. XSS payload in rich text is sanitized.
8. Content and attachment changes create activity log entries.

## 8. Implementation Breakdown

```text
CNT-T01 DB migration notes/release_notes
CNT-T02 Rich text sanitize/patch API
CNT-T03 Attachment storage service
CNT-T04 Attachment metadata API
CNT-T05 FE content integration
CNT-T06 Activity logging
CNT-T07 Security tests
```

## 9. Open Questions

| ID | Question | Default đề xuất |
|---|---|---|
| CNT-Q01 | Notes dùng field riêng hay comments? | Đã chốt: field riêng `work_items.notes` cho đúng mockup |
