# Data Model & Database — {{product_name}}

> **Status:** Draft · **Owner:** {{data_owner}} · **Last updated:** {{last_updated}} · **Tier:** {{tier}} · **Related:** [ARCHITECTURE](ARCHITECTURE.md) · [SECURITY_ARCHITECTURE](SECURITY_ARCHITECTURE.md) · [API](API.md) · [PRIVACY_POLICY](../legal/PRIVACY_POLICY.md)

<!-- guidance: BEFORE writing, read references/data-modeling-guide.md and run its 5-pass entity discovery
(nouns from F-xx/US-xx/J-xx/S-xx, hidden-entity verbs, supporting entity checklist, lifecycles, cross-check with
API/SECURITY/OPERATIONS/PRIVACY). Missing tables are the #1 defect: a typical multi-user SaaS has 15–30 entities once
identity, tenancy, audit, notifications, files, billing and outbox are included. Do not stop at the nouns the PRD names.

Applies to any persistence: relational (PostgreSQL, MySQL, SQLite), document (MongoDB, Firestore), key-value /
wide-column (DynamoDB, Cassandra, Redis), on-device (SQLite, Room, Core Data, Realm, IndexedDB), files (CLI config,
cache), or a library's public data types. Adapt terms ("table" ↔ "collection" ↔ "item type" ↔ "store").
For NoSQL, design from access patterns (guide §9.1) but still draw the logical ERD.
Every entity traces to PRD features. Schemas are PROPOSALS until approved. Seed data is synthetic only.
Never write connection strings or credentials. Keep ALL H2 headings; a section that does not apply keeps its heading
and one line `N/A — reason`. -->

<!-- guidance: Tier notes —
Lite: §1, §3 entities, §4 ERD, §5 schema for every entity (may be compact), §6 relationships, §8 access rules, §9 key queries for Must features, §10 migrations (tool + rule), §12 retention one-liners, §15 coverage; other sections one line or `N/A — reason`.
Standard: all sections with full content.
Enterprise: add data lineage, field-level classification + encryption, tenant isolation tests, PITR, cross-region replication, audit tables, DPIA link, and a formal data retention schedule approved by legal. -->

## 1. Storage model
<!-- guidance: Minimum content — every store the product uses (primary DB, cache, search index, object storage,
on-device DB, analytics warehouse) with its role; the ID strategy with reason (guide §3 item 1); tenancy model; residency.
Each significant choice links an ADR or is a PROPOSAL. -->
| Item | Value |
| --- | --- |
| Primary store | {{e.g. PostgreSQL (managed; version: latest stable at setup — verify) · SQLite on device · DynamoDB · MongoDB Atlas · none (stateless library)}} |
| Other stores | {{e.g. Redis (cache, rate limits) · object storage (files) · search index (derived) · none}} |
| Why | {{reason}} → ADR-{{nnnn}} |
| Ownership / tenancy model | {{single-user / organization / multi-tenant pooled / schema-per-tenant / db-per-tenant}} → §7 |
| Hosting & region | {{region}} · residency: {{requirement}} |
| Access layer | {{ORM / query builder / raw SQL / SDK}} |
| ID strategy | {{UUIDv7 / ULID / bigint identity / bigint + public_id}} — {{reason}} |
| Time & money conventions | Timestamps UTC (`timestamptz` or ISO 8601 `Z`); money as integer minor units + ISO 4217 currency |
| Consistency | {{strong (transactions) for: …; eventual for: search, counters, analytics}} |

## 2. Data classification
| Class | Definition | Examples in this product | Handling |
| --- | --- | --- | --- |
| Public | Safe to publish | {{e.g. published profiles}} | No restriction |
| Internal | Not secret, not public | {{e.g. task titles, feature flags}} | Auth required |
| Personal (PII) | Identifies a person | {{e.g. email, name, IP}} | Minimize, encrypt in transit/at rest, redact in logs |
| Sensitive / special category | High harm if leaked | {{e.g. health, payment, government IDs, precise location, children's data}} | {{field encryption, strict access, avoid storing (tokenize)}} |
| Secrets | Credentials | {{password hashes, token hashes, webhook secrets}} | Hash (one-way) or encrypt; never logged; never returned by the API |

## 3. Entities
<!-- guidance: Minimum content — one row per entity, including supporting entities (identity, tenancy, audit,
notifications, files, settings, consents, API keys, webhooks/outbox, idempotency, billing, tags, comments …).
Every entity named in PRD/API/SECURITY/OPERATIONS appears here. Then the "Supporting entity decisions" table records
every row of the guide's §2 checklist as Included or Excluded + reason — no silent omissions. -->
| Entity | Purpose | Owner (user/tenant/system) | Classification | Features | Retention |
| --- | --- | --- | --- | --- | --- |
| {{entity}} | {{purpose}} | {{owner}} | {{class}} | F-01 | {{period_and_rule}} |

### 3.1 Supporting entity decisions
| Area | Entities | Decision | Reason / link |
| --- | --- | --- | --- |
| Identity | users, credentials, identities (SSO/social), sessions/tokens, MFA, verification tokens | {{Included: … / Excluded: …}} | {{F-xx / D-xx}} |
| Authorization | roles, permissions, memberships | {{…}} | {{e.g. fixed roles → enum on memberships}} |
| Tenancy | organizations/workspaces, invitations, teams, shares | {{…}} | {{…}} |
| Audit & activity | audit_logs, activity events, versions | {{…}} | {{…}} |
| Notifications | notifications, notification_preferences | {{…}} | {{…}} |
| Files | files/attachments (metadata; bytes in object storage) | {{…}} | {{…}} |
| Settings & consent | user/org settings, consents | {{…}} | {{…}} |
| Integration | api_keys, webhook_endpoints/deliveries, outbox_events, idempotency_keys, external IDs | {{…}} | {{…}} |
| Operations | jobs/schedules, feature flags, usage counters | {{…}} | {{…}} |
| Billing | plans, subscriptions, invoices, payments, customers | {{…}} | {{e.g. Excluded — free internal tool (D-04)}} |
| Content | tags/categories, comments, translations, soft delete/archive | {{…}} | {{…}} |

## 4. Entity relationship diagram
<!-- guidance: Minimum content — every entity from §3 appears in an erDiagram WITH attributes: PK, FK, UK markers,
tenant key, status, key business fields, and comments for PII/Secret. Every relationship has cardinality and a verb
label. If > 15 entities, split by domain (e.g. identity & tenancy · core domain · billing & platform), repeating shared
entities with only their key. The example below shows the expected depth; replace every entity. ASCII fallback (when
Mermaid does not render): a text block listing `parent 1──* child (fk)` lines. -->
```mermaid
erDiagram
    ORGANIZATIONS ||--o{ MEMBERSHIPS : "has"
    USERS ||--o{ MEMBERSHIPS : "belongs via"
    USERS ||--o| USER_CREDENTIALS : "authenticates with"
    ORGANIZATIONS ||--o{ {{ITEMS}} : "owns"
    USERS ||--o{ {{ITEMS}} : "creates"
    {{ITEMS}} ||--o{ {{ITEM_TAGS}} : "labeled by"
    TAGS ||--o{ {{ITEM_TAGS}} : "labels"
    ORGANIZATIONS ||--o{ AUDIT_LOGS : "records"
    ORGANIZATIONS {
        uuid id PK
        varchar slug UK
        varchar name
        varchar status "active, suspended, deleting"
        timestamptz created_at
        timestamptz deleted_at
    }
    USERS {
        uuid id PK
        citext email UK "PII"
        varchar display_name "PII"
        varchar status
        timestamptz created_at
        timestamptz updated_at
    }
    USER_CREDENTIALS {
        uuid user_id PK, FK
        text password_hash "Secret"
    }
    MEMBERSHIPS {
        uuid id PK
        uuid organization_id FK "UK with user_id"
        uuid user_id FK
        varchar role "owner, admin, member"
    }
    {{ITEMS}} {
        uuid id PK
        uuid organization_id FK "tenant key"
        uuid created_by FK
        varchar title
        varchar status "open, done, archived"
        int version "optimistic lock"
        timestamptz created_at
        timestamptz deleted_at
    }
    TAGS {
        uuid id PK
        uuid organization_id FK
        varchar name "UK per org"
    }
    {{ITEM_TAGS}} {
        uuid item_id PK, FK
        uuid tag_id PK, FK
    }
    AUDIT_LOGS {
        uuid id PK
        uuid organization_id FK
        uuid actor_id
        varchar action
        timestamptz occurred_at
    }
```

## 5. Schema
<!-- guidance: Minimum content — one sub-section (5.n) per entity in §3, each with: header line (features, owner,
classification, retention), a table with ALL columns (PK, tenant key, FKs, business fields, status, audit columns,
deleted_at/version where used), types in the chosen store's vocabulary, null, default, constraints (UNIQUE, CHECK,
FK + ON DELETE, length limits, enum values), classification per column, and table-level constraints (composite
unique, exactly-one-of checks). Apply the per-entity field checklist (guide §3). Lite may use a compact column list
per entity but must still list every column and constraint.
NoSQL: per collection/item type, show key design (PK/SK, partition key), embedded vs referenced fields, max sizes,
and the access patterns served. On-device: add schema version and sync metadata (guide §9.2). -->

### 5.1 `{{table_name}}`
> **PROPOSAL:** Features {{F-xx}} · owner {{tenant/user/system}} · classification {{class}} · retention {{rule}}. Approve or replace.

| Field | Type | Null | Default | Constraints | Classification | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| id | {{uuid}} | No | {{UUIDv7, app-generated}} | PK | Internal | Exposed in API |
| {{organization_id}} | {{uuid}} | No | — | FK → {{organizations.id}} ON DELETE {{RESTRICT}} | Internal | Tenant key; isolation policy (§7) |
| {{field}} | {{type}} | {{Yes/No}} | {{default}} | {{UNIQUE (organization_id, field) WHERE deleted_at IS NULL · CHECK length 1–200 · enum values}} | {{class}} | {{notes}} |
| status | {{varchar(20)}} | No | {{'open'}} | CHECK IN ({{values}}) | Internal | Lifecycle in §5.x state diagram |
| {{amount_minor}} | {{bigint}} | {{No}} | — | CHECK ≥ 0 | Internal | Money: minor units; with `currency char(3)` |
| version | int | No | 1 | | Internal | Optimistic locking (API If-Match) — if concurrently edited |
| created_by | {{uuid}} | {{No}} | — | FK → users.id ON DELETE {{RESTRICT}} | Internal | |
| created_at | {{timestamptz}} | No | now() | | Internal | UTC |
| updated_at | {{timestamptz}} | No | now() | | Internal | |
| deleted_at | {{timestamptz}} | Yes | NULL | | Internal | Soft delete — only if restore/audit needed |

**Table constraints:** {{e.g. UNIQUE (organization_id, slug) WHERE deleted_at IS NULL; CHECK (ends_at > starts_at)}}

### 5.x Status lifecycles
<!-- guidance: One stateDiagram-v2 (or transition table) per entity with a status field. Transitions that must be remembered get columns or a history table. -->
```mermaid
stateDiagram-v2
    [*] --> {{open}}
    {{open}} --> {{in_progress}}: {{start}}
    {{in_progress}} --> {{done}}: {{complete}}
    {{done}} --> {{open}}: {{reopen}}
    {{done}} --> {{archived}}: {{archive}}
```

## 6. Relationships and delete behavior
<!-- guidance: Minimum content — one row per FK in §5 (same count). M:N via join tables with a unique pair constraint.
Choose ON DELETE per guide §5: CASCADE for pure children; RESTRICT for parents with legal/financial value; SET NULL
for optional history; soft delete + batched purge job for tenant/account deletion. -->
| Relationship | Cardinality | FK | On delete | On update | Rationale |
| --- | --- | --- | --- | --- | --- |
| {{organizations → items}} | {{1:N}} | {{items.organization_id}} | {{RESTRICT (tenant purge job deletes children first)}} | {{NO ACTION}} | {{why}} |
| {{items ↔ tags}} | {{M:N via item_tags}} | {{item_tags.item_id, item_tags.tag_id}} | {{CASCADE}} | {{NO ACTION}} | {{pure link rows}} |

## 7. Multi-tenancy and isolation
<!-- guidance: Minimum content — model and why (guide §7.1), the enforcement layers (app + DB), the list of
tenant-owned tables (every one carries tenant_id NOT NULL), how tenant_id is set (from verified token/session only),
tenant deletion procedure, and verification tests. N/A for single-user/local apps — keep heading, write why. -->
- **Model:** {{shared schema + tenant_id + row-level security / schema per tenant / database per tenant / hybrid}} — {{reason}}
- **Enforcement:** {{e.g. tenant-scoped repository layer + RLS (ENABLE + FORCE) with policy on app.tenant_id set per transaction; tenant_id never from client input}}
- **Tenant-owned tables:** {{list — must equal every table with organization_id}}
- **Global tables (not tenant-owned):** {{e.g. users, plans}} — {{access rule}}
- **Tenant deletion:** {{mark deleting → block access → batched purge → audit entry → backups age out in {{period}}}}
- **Verification:** cross-tenant access tests in [TESTING](TESTING.md) (SEC-xx).

## 8. Access rules
<!-- guidance: Minimum content — one row per entity from §3 (same count), roles named exactly as in SECURITY_ARCHITECTURE. -->
| Entity | Create | Read | Update | Delete | Enforced at |
| --- | --- | --- | --- | --- | --- |
| {{entity}} | {{role/owner}} | {{owner, org admin}} | {{owner}} | {{owner, admin}} | {{service layer + DB policy}} |

Matches the role matrix in [SECURITY_ARCHITECTURE](SECURITY_ARCHITECTURE.md#5-authorization).

## 9. Indexes and key queries
<!-- guidance: Minimum content — for every Must feature: its list/detail/lookup queries; plus auth lookups (user by
email, session/token by hash), every FK, background job polling, purge jobs, and uniqueness checks. Each query has an
index designed by Equality → Sort → Range order; soft-delete-aware partial indexes; keyset pagination with a unique
tiebreaker. Every index has a query; no speculative indexes. NoSQL: access pattern → key/GSI. -->
| Query (feature) | Filter / sort / pagination | Index | Expected volume | Target |
| --- | --- | --- | --- | --- |
| {{list my open items (F-01)}} | {{organization_id = ? AND status = 'open' AND deleted_at IS NULL ORDER BY created_at DESC, id DESC; keyset cursor}} | {{(organization_id, status, created_at DESC, id DESC) WHERE deleted_at IS NULL}} | {{rows per tenant}} | {{NFR-01}} |
| {{sign in by email}} | {{lower(email) = ?}} | {{UNIQUE (email) WHERE deleted_at IS NULL}} | | |
| {{FK join items.created_by}} | {{join / parent delete}} | {{(created_by)}} | | |

## 10. Migrations
- **Tool:** {{e.g. Flyway, Liquibase, Alembic, Prisma Migrate, golang-migrate, Atlas, Rails/Django/EF migrations, Room/Core Data migrations}} or [TBD]
- **Rules:** migrations are versioned, reviewed in PRs, forward-only in shared environments, and tested on a production-like copy.
- **Zero-downtime (expand → migrate → contract):** add nullable/new structures → deploy code writing both → backfill in batches → switch reads → remove old structures in a later release.
- **Online DDL:** {{e.g. CREATE INDEX CONCURRENTLY; add FK NOT VALID then VALIDATE; avoid table rewrites on large tables}}
- **Risky operations** (locks on large tables, type changes, drops) need an explicit plan and approval.
- **On-device apps:** migrations run from any older schema version; tested from the oldest supported version; never lose user data.
- **Never** run migrations against production from a developer machine or by an AI agent without explicit authorization.

## 11. Seed and fixture data
- Synthetic only (e.g. `user1@example.test`); no copies of production data in non-production environments unless anonymized and approved.
- Seeds: {{location_and_command_or_Not configured}}
- Fixtures cover: {{e.g. two tenants (for isolation tests), each role, each status value, edge cases (max lengths, unicode, zero-decimal currency)}}

## 12. Retention, archival, deletion, and personal data
<!-- guidance: Minimum content — a row per entity or group (all §3 entities covered), with mechanism (partition drop,
batched delete job, anonymize). Account deletion lists EVERY table holding that person's data. -->
| Data | Retention | Archive | Deletion method | Export (DSR) |
| --- | --- | --- | --- | --- |
| {{account data}} | {{e.g. life of account + 30 days}} | {{n/a}} | {{hard delete / anonymize}} | {{format}} |
| {{audit logs}} | {{e.g. 1 year}} | {{monthly partitions}} | {{drop partition}} | {{included / excluded with reason}} |
| {{logs containing IP}} | {{period}} | | | |
- Account deletion cascades to / anonymizes: {{entities}}; derived copies (search index, cache, analytics) purged by {{mechanism}}; backups age out within {{period}}.
- This is an engineering plan, not a legal determination — align with [PRIVACY_POLICY](../legal/PRIVACY_POLICY.md) and counsel.

## 13. Backups and restore
| Item | Value |
| --- | --- |
| Method | {{managed snapshots / PITR / logical dumps / device-sync / OS backup}} |
| Frequency & retention | {{values}} |
| RPO / RTO | {{from NFR-09}} |
| Encryption & location | {{separate account/region — same jurisdiction if residency applies}} |
| Restore test | {{cadence; last tested: Not run}} |

## 14. Data validation
| Entity.field | Rule | Enforced at | Failure response |
| --- | --- | --- | --- |
| {{item.title}} | {{required, 1–200 chars, trimmed}} | {{API validation + DB CHECK}} | {{422 problem+json / inline error}} |

## 15. Feature-to-entity coverage
<!-- guidance: Minimum content — one row per PRD F-xx (Must and Should), listing the entities it reads/writes and the
key query rows in §9. A feature with no entity needs `N/A — reason` (e.g. purely client-side). Any entity not used
by any feature must be a supporting entity with a reason in §3.1 — otherwise remove it. -->
| Feature | Entities written | Entities read | Key queries (§9) | Notes |
| --- | --- | --- | --- | --- |
| F-01 | {{entities}} | {{entities}} | {{query rows}} | {{notes}} |

## 16. Scalability and growth
<!-- guidance: Minimum content — growth estimate per large table (from TRD §9 capacity worksheet), and for each
pattern in guide §7 either "Used: how" or "Not yet — trigger to adopt". Lite: one line or `N/A — reason`. -->
| Table / collection | Rows (12 mo) | Growth / day | Size estimate | Strategy |
| --- | --- | --- | --- | --- |
| {{audit_logs}} | {{n}} | {{n}} | {{GB}} | {{monthly partitions; drop after retention}} |

| Pattern | Decision |
| --- | --- |
| Pagination | {{keyset on all user-facing lists}} |
| Read scaling | {{replica for … / not yet — trigger: …}} |
| Caching | {{what, key incl. tenant, TTL, invalidation / none}} |
| Partitioning / sharding | {{tables + key / not yet — trigger: …}} |
| Archival | {{mechanism}} |
| Hot rows & counters | {{strategy per counter}} |
| Outbox / events | {{outbox_events + relay / N/A — no side effects}} |
| Large objects | {{object storage + signed URLs / N/A}} |
| Connection management | {{pool size, proxy for serverless}} |

## 17. Denormalizations and derived data
<!-- guidance: Model is 3NF by default. List every intentional exception and every derived store (search index,
counters, snapshots, analytics). Write "None — model is fully normalized" if none. -->
| Field / store | Source of truth | Update mechanism | Staleness tolerance | Rebuild method |
| --- | --- | --- | --- | --- |
| {{projects.open_item_count}} | {{items}} | {{async from outbox events}} | {{≤ 5 s}} | {{recount job}} |

## Completeness self-check
<!-- guidance: Tick every box before presenting this doc (full list in references/data-modeling-guide.md §13). Fix gaps
instead of reporting them; anything not fixable becomes [TBD] + Q-xx. Keep this checklist in the output, ticked. -->
- [ ] Entity discovery ran all 5 passes; §3.1 decides every supporting-entity area (Included / Excluded + reason).
- [ ] Every F-xx appears in §15; every noun in PRD stories, APP_FLOW screens, and API operations is an entity, attribute, or out of scope.
- [ ] ERD (§4) entities = §3 rows = §5 schema sub-sections = §8 access rows (same names, same count); no orphan entity.
- [ ] Every entity has PK, audit timestamps, owner, classification, access rule, and retention.
- [ ] Every FK is declared, indexed, and in §6 with an ON DELETE rule; every M:N is a join table with a unique pair.
- [ ] Every status field lists its values and has a lifecycle; concurrently edited entities have `version`.
- [ ] Money = integer minor units + currency; times in UTC; time zone stored where local time matters.
- [ ] Unique business keys are declared, tenant-scoped, and soft-delete-aware.
- [ ] Every key query has an index and every index has a query; lists use keyset pagination.
- [ ] Tenant isolation enforced on every tenant-owned table (or §7 `N/A — reason`).
- [ ] Every PII/secret column is classified; secrets hashed/encrypted; credentials in a separate table; PII matches PRIVACY_POLICY.
- [ ] Account and tenant deletion reach every table and derived store holding the data.
- [ ] Growth estimate and scale patterns (§16) decided; denormalizations listed (§17).
- [ ] No `{{placeholders}}` or guidance comments remain; schemas not yet approved are marked PROPOSAL.

## Definition of done
- [ ] Every entity traces to features and has owner, classification, and retention.
- [ ] ERD matches schema tables; every FK states delete behavior.
- [ ] Access rules align with the security role matrix; tenant isolation defined or N/A.
- [ ] Indexes cover key queries; migration tool and zero-downtime rules agreed.
- [ ] Seeds are synthetic; backup/restore has RPO/RTO; no credentials anywhere.
- [ ] Completeness self-check is fully ticked.
