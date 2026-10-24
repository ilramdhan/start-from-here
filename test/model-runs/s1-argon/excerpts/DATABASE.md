# Data Model & Database — TaskFlow

> **Status:** Approved · **Owner:** @taskflow-hq/core · **Last updated:** 2026-10-24 · **Tier:** Standard · **Related:** [ARCHITECTURE](ARCHITECTURE.md) · [SECURITY_ARCHITECTURE](SECURITY_ARCHITECTURE.md) · [API](API.md) · [PRIVACY_POLICY](../legal/PRIVACY_POLICY.md)

## 1. Storage model

| Item | Value |
| --- | --- |
| Primary store | Managed PostgreSQL (current stable at setup — verify at setup; multi-AZ high availability + PgBouncer transaction pooler) |
| Other stores | S3-compatible private object storage (Cloudflare R2 / AWS S3) for file attachment blobs (`F-07`) and asynchronous organization data export archives (`F-02`); `pg-boss` job tables inside PostgreSQL for durable background jobs |
| Why | PostgreSQL provides ACID transactions, native Row-Level Security (RLS) for defense-in-depth multi-tenant isolation, `tsvector` + GIN indexes for full-text search (`F-11`), and `SKIP LOCKED` job queues (`pg-boss`), avoiding Redis/Elasticsearch operational overhead within the USD 500/month budget → [ADR-0003](../decisions/0003-postgresql-multi-tenant-row-isolation.md), [ADR-0005](../decisions/0005-hosting-storage-and-stripe-billing.md) |
| Ownership / tenancy model | Multi-tenant pooled (shared database, shared schema) with `organization_id UUID NOT NULL` on every tenant-owned table and PostgreSQL RLS (`ENABLE` + `FORCE ROW LEVEL SECURITY`) → §7 |
| Hosting & region | US-East primary region at MVP launch · Residency: single region acceptable at launch (`Q-01`), EU Standard Contractual Clauses (SCCs) documented in [COMPLIANCE](../legal/COMPLIANCE.md) |
| Access layer | Drizzle ORM (TypeScript) via a mandatory `withTenantContext(organizationId, callback)` transaction wrapper |
| ID strategy | **UUIDv7** (RFC 9562 time-ordered 128-bit UUID, generated in the application layer) — prevents B-tree index fragmentation on insert while hiding sequential record counts and avoiding cross-shard ID collisions |
| Time & money conventions | All timestamps stored in UTC as `timestamptz` and serialized in ISO 8601 UTC (`YYYY-MM-DDTHH:mm:ss.sssZ`); dates without time (`due_date`) stored as `date`; money stored as integer minor units (`bigint` cents) + ISO 4217 3-letter currency code (`char(3)`, default `'USD'`) |
| Consistency | Strong ACID consistency (single-database transactions) for all entity writes, membership changes, task state transitions, and audit log writes; eventual consistency (seconds) for asynchronous side effects (email notifications, object storage blob cleanup, Stripe webhook projections) |

## 2. Data classification

| Class | Definition | Examples in this product | Handling |
| --- | --- | --- | --- |
| Public | Safe to publish anonymously | Marketing site copy, public legal documentation | No restriction |
| Internal | Not secret, not directly identifying a natural person | Organization slugs, workspace names, project keys, task statuses, label colors, system job metadata | Authenticated access + tenant/workspace RBAC + RLS |
| Personal (PII) | Identifies or can identify a natural person | `users.email`, `users.display_name`, `users.avatar_url`, `invitations.email`, `audit_logs.ip_address`, `audit_logs.user_agent`, task titles/descriptions/comments containing personal context, uploaded attachment files | Minimize collection; TLS 1.2+ in transit; AES-256 at rest; redact in application logs; subject to GDPR/CCPA export (`F-02`) and anonymization (`AC-02.6`) |
| Sensitive / special category | High harm if leaked | Payment card numbers (never touched by TaskFlow — handled exclusively by Stripe Hosted Checkout & Customer Portal); health/children's data (prohibited by Terms of Service) | Never stored in TaskFlow databases; Stripe stores payment methods and TaskFlow stores only `stripe_customer_id` and `stripe_subscription_id` |
| Secrets | Credentials and cryptographic verifiers | `user_credentials.password_hash` (Argon2id), `user_sessions.token_hash` (SHA-256), `oauth_accounts` tokens, `mfa_secrets.totp_secret_encrypted` (AES-256-GCM), `mfa_secrets.recovery_codes_hashes`, `invitations.token_hash` (SHA-256) | One-way hashed (Argon2id or SHA-256) or envelope-encrypted (AES-256-GCM); isolated in dedicated tables/columns; never logged; never returned in API responses |

## 3. Entities

| Entity | Purpose | Owner (user/tenant/system) | Classification | Features | Retention |
| --- | --- | --- | --- | --- | --- |
| `organizations` | Tenant root record, billing seat count, lifecycle status, and scheduled deletion state | Tenant | Internal | F-02, F-09 | Life of organization + 30-day soft-delete grace period (`AC-02.5`) |
| `users` | Global user identity profile (email, display name, avatar, account status) | User | Personal (PII) | F-01, F-02 | Active life of user; on deletion, PII scrubbed and `display_name` set to `'Deleted User'` (`AC-02.6`) |
| `user_credentials` | Argon2id password hashes and password reset token hashes isolated from profile table | User | Secrets | F-01 | Deleted immediately on account deletion or password reset |
| `user_sessions` | Server-side authenticated sessions (`token_hash`, active organization, expiry, IP/UA) | User | Secrets / PII | F-01 | 30 days sliding TTL; purged 7 days after expiry or revocation |
| `oauth_accounts` | Linked Google OAuth 2.0 subject identifiers (`provider`, `provider_account_id`) | User | Personal (PII) | F-01 | Deleted immediately on account deletion or OAuth unlink |
| `mfa_secrets` | AES-256-GCM encrypted TOTP secret and Argon2id-hashed single-use recovery codes | User | Secrets | F-01 | Deleted immediately when user disables MFA or deletes account |
| `organization_memberships` | Links `users` to `organizations` with role (`owner`, `admin`, `member`) and seat status | Tenant | Internal | F-02, F-09 | Deleted when member is removed or organization is purged |
| `invitations` | Pending organization email invitations with SHA-256 token hash and 7-day expiry | Tenant | Secrets / PII | F-02 | Expires after 7 days; purged 30 days after acceptance/revocation/expiry |
| `workspaces` | Functional subdivision within an organization (`Engineering`, `Marketing`, etc.) | Tenant | Internal | F-03 | Life of workspace or parent organization + 30-day org grace period |
| `workspace_memberships` | Grants organization members access to specific workspaces (`member`, `lead`) | Tenant | Internal | F-03 | Deleted when member leaves workspace/org or workspace is deleted |
| `projects` | Container for tasks within a workspace (`key_prefix`, `name`, `status`) | Tenant | Internal | F-04 | Life of project/workspace or parent organization |
| `labels` | Organization-scoped color-coded tags (`name`, `color_hex`) | Tenant | Internal | F-04, F-05 | Life of organization |
| `tasks` | Core work item (`title`, `description`, `status`, `priority`, `assignee_id`, `due_date`, `search_vector`) | Tenant | Personal (PII) / Internal | F-05, F-11 | Life of project/organization; soft-deleted tasks purged after 30 days |
| `task_labels` | Join table associating `tasks` and `labels` (M:N) | Tenant | Internal | F-04, F-05 | Deleted immediately on unlink or task/label deletion |
| `task_activities` | Immutable per-task change history (status, assignee, priority, due date, attachment events) | Tenant | Internal | F-10 | Life of parent task / organization |
| `comments` | Markdown comments on tasks (`body_markdown`, `author_id`) | Tenant | Personal (PII) | F-06 | Life of parent task; preserved with `author_id` anonymized on user deletion (`AC-02.6`) |
| `comment_mentions` | Extracted `@user` mentions per comment for notification fan-out and querying | Tenant | Internal | F-06, F-08 | Cascade-deleted with parent comment |
| `attachments` | Metadata for files uploaded to S3/R2 (`object_key`, `file_name`, `mime_type`, `size_bytes`, `upload_status`) | Tenant | Personal (PII) | F-07 | Deleted on attachment removal or org purge (triggers S3 `DeleteObject` job) |
| `notifications` | In-app and email notification inbox items (`type`, `read_at`, `email_sent_at`) | Tenant | Internal | F-08 | Purged 90 days after creation or on organization/user deletion |
| `user_notification_preferences` | Per-user toggles for email delivery of assignment, mention, and due-soon alerts | User | Internal | F-08 | Deleted on user account deletion |
| `task_templates` | Reusable workspace-scoped task blueprints (`title_template`, `description_template`, `default_priority`) | Tenant | Internal | F-12 | Life of workspace / organization |
| `subscriptions` | Mirrored Stripe subscription state (`stripe_customer_id`, `stripe_subscription_id`, `plan_interval`, `status`, `seat_quantity`) | Tenant | Internal | F-09 | Life of organization + 7 years financial record archive if billed |
| `stripe_webhook_events` | Idempotency ledger of processed Stripe webhook event IDs (`event_id`, `event_type`, `processed_at`) | System | Internal | F-09 | Purged 90 days after processing |
| `data_export_jobs` | Tracking records for asynchronous organization JSON/CSV data export archives (`status`, `object_key`, `expires_at`) | Tenant | Internal | F-02 | Archive blob expires in 24 hours; job metadata retained for life of organization |
| `audit_logs` | Immutable organization-wide security and administrative audit trail | Tenant | Personal (PII) / Internal | F-10 | Retained for 365 days (`1 year`), monthly partitioned, even if organization is purged earlier (`D-01`) |

### 3.1 Supporting entity decisions

| Area | Entities | Decision | Reason / link |
| --- | --- | --- | --- |
| Identity | `users`, `user_credentials`, `oauth_accounts`, `user_sessions`, `mfa_secrets` | Included (all 5) | Required for email+password, Google OAuth 2.0, server-side revocation, and optional TOTP MFA (`F-01`, [ADR-0004](../decisions/0004-auth-sessions-and-totp-mfa.md)) |
| Authorization | `organization_memberships`, `workspace_memberships` | Included (fixed role enums on membership tables; separate `roles`/`permissions` tables Excluded) | Three fixed organization roles (`owner`, `admin`, `member`) and workspace membership flags cover all MVP RBAC requirements (`F-02`, `F-03`) |
| Tenancy | `organizations`, `invitations`, `workspaces`, `projects` | Included (all 4; guest shares Excluded) | Matches canonical hierarchy `Organization → Workspaces → Projects → Tasks`; guests are out of scope (`D-01`) |
| Audit & activity | `audit_logs`, `task_activities` | Included (both) | Separate task-level activity stream (`F-10`) from 1-year immutable organization security audit log (`F-10`, `NFR-06`) |
| Notifications | `notifications`, `user_notification_preferences` | Included (both) | Required for in-app bell badge, read/unread state, email deduplication, and per-user email toggles (`F-08`) |
| Files | `attachments`, `data_export_jobs` | Included (both; bytes in S3/R2) | Required for 25 MB task attachments (`F-07`) and org JSON/CSV exports (`F-02`, [ADR-0005](../decisions/0005-hosting-storage-and-stripe-billing.md)) |
| Settings & consent | `user_notification_preferences` (Included); separate `consents` table (Excluded) | Included via `users.terms_accepted_at` timestamp + `user_notification_preferences` | No third-party marketing trackers (`D-06`); ToS acceptance timestamp stored directly on `users` |
| Integration | `stripe_webhook_events` (Included); `api_keys`, `webhook_endpoints`, `outbox_events` (Excluded) | Included `stripe_webhook_events` for Stripe idempotency (`F-09`); public API and outbound customer webhooks are Won't-have for MVP | Transactional job enqueue via `pg-boss` in the same PostgreSQL database replaces a separate outbox relay |
| Operations | `pg-boss` internal tables (`pgboss.job`) | Included via `pg-boss` schema; custom feature-flag table Excluded | `pg-boss` manages retries, schedules, and dead-letter queues in PostgreSQL (`ADR-0002`) |
| Billing | `subscriptions` (Included); `plans`, `invoices`, `payments` tables (Excluded) | Included `subscriptions` mirror; invoices and payment methods live in Stripe Customer Portal | TaskFlow never touches payment cards and delegates invoice history to Stripe (`F-09`, [ADR-0005](../decisions/0005-hosting-storage-and-stripe-billing.md)) |
| Content | `labels`, `task_labels`, `comments`, `comment_mentions`, `task_templates` | Included (all 5; `translations` Excluded) | Supports labels (`F-04`), comments + `@mentions` (`F-06`), and templates (`F-12`); English-only UI at launch (`NFR-05`) |

## 4. Entity relationship diagram

Because TaskFlow has 25 entities, the ERD is split into three domain views (**4.1 Identity & Tenancy**, **4.2 Core Workspace & Task Domain**, and **4.3 Billing, Exports & Audit**), repeating `ORGANIZATIONS` and `USERS` with their primary keys to anchor relationships.

### 4.1 Identity, Authentication & Tenancy ERD

```mermaid
erDiagram
    USERS ||--o| USER_CREDENTIALS : "authenticates with"
    USERS ||--o{ USER_SESSIONS : "holds"
    USERS ||--o{ OAUTH_ACCOUNTS : "links"
    USERS ||--o| MFA_SECRETS : "enrolls"
    USERS ||--o| USER_NOTIFICATION_PREFERENCES : "configures"
    ORGANIZATIONS ||--o{ ORGANIZATION_MEMBERSHIPS : "has"
    USERS ||--o{ ORGANIZATION_MEMBERSHIPS : "belongs via"
    ORGANIZATIONS ||--o{ INVITATIONS : "issues"
    USERS ||--o{ INVITATIONS : "sends"
    ORGANIZATIONS ||--o{ WORKSPACES : "contains"
    WORKSPACES ||--o{ WORKSPACE_MEMBERSHIPS : "grants access via"
    USERS ||--o{ WORKSPACE_MEMBERSHIPS : "joins via"

    ORGANIZATIONS {
        uuid id PK
        varchar slug UK
        varchar name
        varchar status "active, past_due, canceled, pending_deletion"
        timestamptz deletion_scheduled_at
        timestamptz created_at
    }
    USERS {
        uuid id PK
        citext email UK "PII"
        varchar display_name "PII"
        varchar status "active, anonymized"
        timestamptz anonymized_at
        timestamptz created_at
    }
    USER_CREDENTIALS {
        uuid user_id PK, FK
        text password_hash "Secret (Argon2id)"
        text reset_token_hash "Secret (SHA-256)"
        timestamptz reset_expires_at
        timestamptz updated_at
    }
    USER_SESSIONS {
        uuid id PK
