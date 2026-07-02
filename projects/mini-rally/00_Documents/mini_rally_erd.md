erDiagram

    USERS {
        uuid id PK
        varchar full_name
        varchar email UK
        text password_hash
        text avatar_url
        varchar status
        timestamp last_login_at
        timestamp created_at
        timestamp updated_at
    }

    AUTH_SESSIONS {
        uuid id PK
        uuid user_id FK
        text token_hash UK
        text user_agent
        varchar ip_address
        timestamp expires_at
        timestamp revoked_at
        timestamp last_seen_at
        timestamp created_at
    }

    PASSWORD_RESET_TOKENS {
        uuid id PK
        uuid user_id FK
        text token_hash UK
        timestamp expires_at
        timestamp used_at
        timestamp created_at
    }

    WORKSPACES {
        uuid id PK
        varchar name
        varchar slug UK
        text description
        uuid owner_id FK
        varchar status
        timestamp created_at
        timestamp updated_at
    }

    WORKSPACE_MEMBERS {
        uuid id PK
        uuid workspace_id FK
        uuid user_id FK
        uuid role_id FK
        varchar status
        timestamp joined_at
        timestamp created_at
        timestamp updated_at
    }

    WORKSPACE_INVITATIONS {
        uuid id PK
        uuid workspace_id FK
        varchar email
        uuid role_id FK
        text token_hash UK
        varchar status
        uuid invited_by FK
        timestamp expires_at
        uuid accepted_by FK
        timestamp accepted_at
        timestamp created_at
        timestamp updated_at
    }

    WORKSPACE_SETTINGS {
        uuid id PK
        uuid workspace_id FK
        varchar timezone
        varchar default_locale
        varchar date_format
        timestamp created_at
        timestamp updated_at
    }

    ROLES {
        uuid id PK
        uuid workspace_id FK
        varchar name
        varchar code
        varchar scope
        text description
        boolean is_system
        timestamp created_at
        timestamp updated_at
    }

    PERMISSIONS {
        uuid id PK
        varchar code UK
        varchar name
        varchar module
        text description
    }

    ROLE_PERMISSIONS {
        uuid id PK
        uuid role_id FK
        uuid permission_id FK
        timestamp created_at
    }

    PROJECTS {
        uuid id PK
        uuid workspace_id FK
        varchar key
        varchar name
        text description
        uuid owner_id FK
        varchar status
        date start_date
        date end_date
        bigint next_item_no
        timestamp created_at
        timestamp updated_at
    }

    PROJECT_MEMBERS {
        uuid id PK
        uuid project_id FK
        uuid user_id FK
        uuid role_id FK
        varchar status
        timestamp joined_at
        timestamp created_at
        timestamp updated_at
    }

    PROJECT_SETTINGS {
        uuid id PK
        uuid project_id FK
        uuid default_assignee_id FK
        uuid default_workflow_id
        boolean enable_sprint
        boolean enable_release
        boolean enable_story_point
        timestamp created_at
        timestamp updated_at
    }

    TEAMS {
        uuid id PK
        uuid workspace_id FK
        varchar name
        varchar key
        text description
        uuid lead_id FK
        varchar status
        timestamp created_at
        timestamp updated_at
    }

    TEAM_MEMBERS {
        uuid id PK
        uuid team_id FK
        uuid user_id FK
        varchar status
        timestamp joined_at
        timestamp created_at
        timestamp updated_at
    }

    PROJECT_TEAMS {
        uuid id PK
        uuid project_id FK
        uuid team_id FK
        varchar status
        timestamp linked_at
        timestamp unlinked_at
        timestamp created_at
        timestamp updated_at
    }

    WORKFLOW_STATUSES {
        uuid id PK
        uuid project_id FK
        varchar name
        varchar code
        varchar category
        varchar color
        int sort_order
        boolean is_default
        boolean is_final
        timestamp created_at
    }

    WORKFLOW_TRANSITIONS {
        uuid id PK
        uuid project_id FK
        uuid from_status_id FK
        uuid to_status_id FK
        uuid role_id FK
        timestamp created_at
    }

    WORK_ITEMS {
        uuid id PK
        uuid workspace_id FK
        uuid project_id FK
        uuid team_id FK
        varchar item_key UK
        int item_no
        varchar type
        varchar title
        text description
        text acceptance_criteria
        uuid status_id FK
        varchar priority
        varchar severity
        decimal story_point
        uuid assignee_id FK
        uuid reporter_id FK
        uuid parent_id FK
        uuid sprint_id FK
        uuid release_id FK
        date due_date
        varchar environment
        text steps_to_reproduce
        text expected_result
        text actual_result
        text root_cause
        text resolution
        int position
        boolean is_blocked
        text blocked_reason
        uuid created_by FK
        uuid updated_by FK
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    WORK_ITEM_RELATIONS {
        uuid id PK
        uuid source_item_id FK
        uuid target_item_id FK
        varchar relation_type
        uuid created_by FK
        timestamp created_at
    }

    LABELS {
        uuid id PK
        uuid project_id FK
        varchar name
        varchar color
        timestamp created_at
    }

    WORK_ITEM_LABELS {
        uuid id PK
        uuid work_item_id FK
        uuid label_id FK
        timestamp created_at
    }

    SPRINTS {
        uuid id PK
        uuid project_id FK
        uuid team_id FK
        varchar name
        text goal
        date start_date
        date end_date
        varchar status
        decimal capacity
        uuid created_by FK
        timestamp started_at
        timestamp closed_at
        timestamp created_at
        timestamp updated_at
    }

    SPRINT_ITEMS {
        uuid id PK
        uuid sprint_id FK
        uuid work_item_id FK
        uuid added_by FK
        timestamp added_at
        timestamp removed_at
        uuid final_status_id FK
        uuid carried_over_to_sprint_id FK
    }

    RELEASES {
        uuid id PK
        uuid project_id FK
        varchar name
        varchar version
        text description
        date start_date
        date release_date
        varchar status
        uuid created_by FK
        timestamp created_at
        timestamp updated_at
    }

    RELEASE_ITEMS {
        uuid id PK
        uuid release_id FK
        uuid work_item_id FK
        uuid added_by FK
        timestamp added_at
        timestamp removed_at
    }

    COMMENTS {
        uuid id PK
        uuid work_item_id FK
        uuid parent_comment_id FK
        uuid author_id FK
        text body
        boolean is_edited
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    ATTACHMENTS {
        uuid id PK
        uuid workspace_id FK
        uuid project_id FK
        uuid work_item_id FK
        uuid comment_id FK
        uuid uploaded_by FK
        varchar file_name
        text file_url
        varchar file_type
        bigint file_size
        text storage_key
        timestamp created_at
    }

    WATCHERS {
        uuid id PK
        uuid work_item_id FK
        uuid user_id FK
        timestamp created_at
    }

    ACTIVITY_LOGS {
        uuid id PK
        uuid workspace_id FK
        uuid project_id FK
        uuid work_item_id FK
        uuid actor_id FK
        varchar action
        varchar entity_type
        uuid entity_id
        jsonb old_value
        jsonb new_value
        jsonb metadata
        timestamp created_at
    }

    NOTIFICATIONS {
        uuid id PK
        uuid user_id FK
        uuid workspace_id FK
        uuid project_id FK
        uuid work_item_id FK
        varchar type
        varchar title
        text body
        boolean is_read
        timestamp read_at
        timestamp created_at
    }

    SAVED_FILTERS {
        uuid id PK
        uuid workspace_id FK
        uuid project_id FK
        uuid user_id FK
        varchar name
        jsonb filter_config
        boolean is_shared
        timestamp created_at
        timestamp updated_at
    }

    %% =========================
    %% Account & Workspace
    %% =========================

    USERS ||--o{ AUTH_SESSIONS : has
    USERS ||--o{ PASSWORD_RESET_TOKENS : resets
    USERS ||--o{ WORKSPACES : owns
    USERS ||--o{ WORKSPACE_MEMBERS : joins
    WORKSPACES ||--o{ WORKSPACE_MEMBERS : has
    WORKSPACES ||--o{ WORKSPACE_INVITATIONS : has
    WORKSPACES ||--|| WORKSPACE_SETTINGS : configures
    ROLES ||--o{ WORKSPACE_INVITATIONS : grants
    USERS ||--o{ WORKSPACE_INVITATIONS : invites
    ROLES ||--o{ WORKSPACE_MEMBERS : assigned_to

    WORKSPACES ||--o{ ROLES : defines
    ROLES ||--o{ ROLE_PERMISSIONS : has
    PERMISSIONS ||--o{ ROLE_PERMISSIONS : granted_by

    %% =========================
    %% Project
    %% =========================

    WORKSPACES ||--o{ PROJECTS : contains
    USERS ||--o{ PROJECTS : owns

    PROJECTS ||--o{ PROJECT_MEMBERS : has
    USERS ||--o{ PROJECT_MEMBERS : joins
    ROLES ||--o{ PROJECT_MEMBERS : assigned_to

    PROJECTS ||--|| PROJECT_SETTINGS : has
    USERS ||--o{ PROJECT_SETTINGS : default_assignee
    WORKSPACES ||--o{ TEAMS : owns
    USERS ||--o{ TEAMS : leads
    TEAMS ||--o{ TEAM_MEMBERS : has
    USERS ||--o{ TEAM_MEMBERS : joins
    PROJECTS ||--o{ PROJECT_TEAMS : links
    TEAMS ||--o{ PROJECT_TEAMS : links

    %% =========================
    %% Workflow
    %% =========================

    PROJECTS ||--o{ WORKFLOW_STATUSES : defines
    PROJECTS ||--o{ WORKFLOW_TRANSITIONS : defines
    WORKFLOW_STATUSES ||--o{ WORKFLOW_TRANSITIONS : from_status
    WORKFLOW_STATUSES ||--o{ WORKFLOW_TRANSITIONS : to_status
    ROLES ||--o{ WORKFLOW_TRANSITIONS : allowed_role

    %% =========================
    %% Work Items
    %% =========================

    WORKSPACES ||--o{ WORK_ITEMS : contains
    PROJECTS ||--o{ WORK_ITEMS : has
    TEAMS ||--o{ WORK_ITEMS : owns
    WORKFLOW_STATUSES ||--o{ WORK_ITEMS : current_status

    USERS ||--o{ WORK_ITEMS : assigned
    USERS ||--o{ WORK_ITEMS : reported
    USERS ||--o{ WORK_ITEMS : created
    USERS ||--o{ WORK_ITEMS : updated

    WORK_ITEMS ||--o{ WORK_ITEMS : parent_child

    %% Phase 1 WORK_ITEMS fields:
    %% notes, release_notes, schedule_state, flow_state, estimate_hours, todo_hours, actual_hours.
    %% Task is stored as WORK_ITEMS.type = task with parent_id pointing to Story/Defect.

    WORK_ITEMS ||--o{ WORK_ITEM_RELATIONS : source
    WORK_ITEMS ||--o{ WORK_ITEM_RELATIONS : target
    USERS ||--o{ WORK_ITEM_RELATIONS : created

    PROJECTS ||--o{ LABELS : has
    WORK_ITEMS ||--o{ WORK_ITEM_LABELS : tagged
    LABELS ||--o{ WORK_ITEM_LABELS : applied

    %% =========================
    %% Sprint / Release
    %% =========================

    PROJECTS ||--o{ SPRINTS : has
    TEAMS ||--o{ SPRINTS : runs
    USERS ||--o{ SPRINTS : created

    SPRINTS ||--o{ WORK_ITEMS : contains_current
    SPRINTS ||--o{ SPRINT_ITEMS : history
    WORK_ITEMS ||--o{ SPRINT_ITEMS : included
    USERS ||--o{ SPRINT_ITEMS : added
    WORKFLOW_STATUSES ||--o{ SPRINT_ITEMS : final_status
    SPRINTS ||--o{ SPRINT_ITEMS : carried_over_to

    PROJECTS ||--o{ RELEASES : has
    USERS ||--o{ RELEASES : created

    RELEASES ||--o{ WORK_ITEMS : contains_current
    RELEASES ||--o{ RELEASE_ITEMS : history
    WORK_ITEMS ||--o{ RELEASE_ITEMS : included
    USERS ||--o{ RELEASE_ITEMS : added

    %% =========================
    %% Collaboration
    %% =========================

    WORK_ITEMS ||--o{ COMMENTS : has
    COMMENTS ||--o{ COMMENTS : replies
    USERS ||--o{ COMMENTS : writes

    WORKSPACES ||--o{ ATTACHMENTS : stores
    PROJECTS ||--o{ ATTACHMENTS : has
    WORK_ITEMS ||--o{ ATTACHMENTS : has
    COMMENTS ||--o{ ATTACHMENTS : has
    USERS ||--o{ ATTACHMENTS : uploads

    WORK_ITEMS ||--o{ WATCHERS : watched_by
    USERS ||--o{ WATCHERS : watches

    %% =========================
    %% Audit / Notification / Filter
    %% =========================

    WORKSPACES ||--o{ ACTIVITY_LOGS : has
    PROJECTS ||--o{ ACTIVITY_LOGS : has
    WORK_ITEMS ||--o{ ACTIVITY_LOGS : has
    USERS ||--o{ ACTIVITY_LOGS : performs

    USERS ||--o{ NOTIFICATIONS : receives
    WORKSPACES ||--o{ NOTIFICATIONS : has
    PROJECTS ||--o{ NOTIFICATIONS : has
    WORK_ITEMS ||--o{ NOTIFICATIONS : relates_to

    WORKSPACES ||--o{ SAVED_FILTERS : has
    PROJECTS ||--o{ SAVED_FILTERS : has
    USERS ||--o{ SAVED_FILTERS : owns
