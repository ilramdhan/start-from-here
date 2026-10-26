# Interface Contract (API) — {{product_name}}

> **Status:** Draft · **Owner:** {{api_owner}} · **Last updated:** {{last_updated}} · **Tier:** {{tier}} · **Related:** [ARCHITECTURE](ARCHITECTURE.md) · [APP_FLOW](../product/APP_FLOW.md) · [SECURITY_ARCHITECTURE](SECURITY_ARCHITECTURE.md) · [TESTING](TESTING.md)

<!-- guidance: "API" means the product's programmatic contract, whatever its shape: REST/HTTP, GraphQL, gRPC, a CLI's
commands/flags/exit codes, a library/SDK's public functions, or events/webhooks. Keep the sections, adapt the
vocabulary. If a machine-readable spec exists or is planned (OpenAPI 3.1, GraphQL SDL, .proto, AsyncAPI, CLI --help
generated docs, typed SDK reference), it is the source of truth and this doc holds conventions + a catalog that links
to it. Never invent endpoints beyond PRD features; mark proposals. Example values are illustrative only.
BEFORE writing, read references/architecture-guide.md §8 (interface design checklist for REST, GraphQL, gRPC, events,
CLI, library). Derive the catalog from APP_FLOW: every screen action / command that reads or changes server/core data
needs an operation, and every operation needs an F-xx. Keep ALL H2 headings; a section that does not apply keeps its
heading and one line `N/A — reason`. -->

<!-- guidance: Tier notes —
Lite: §1, §2 (naming, errors, auth only), §3 catalog, §4 detail for Must operations. Webhooks/deprecation: `N/A — reason` if not applicable.
Standard: all sections.
Enterprise: add API governance (style guide + linting in CI, e.g. Spectral/buf lint), consumer-driven contract tests, SLA per endpoint tier, breaking-change review board, and a public changelog. -->

## 1. Overview
| Item | Value |
| --- | --- |
| Style | {{REST / GraphQL / gRPC / CLI / library SDK / events}} |
| Consumers | {{e.g. own web + mobile clients, third-party developers, internal services, end users in a terminal}} |
| Base URL / entry | {{e.g. https://api.example.com/v1 · `tool <command>` · `import { Client } from "pkg"`}} |
| Source of truth | {{path_to_openapi_yaml / schema.graphql / proto dir / generated docs}} or [TBD] |
| Formats | {{JSON (UTF-8) / protobuf / text + --json}} |

## 2. Conventions

### 2.1 Naming
- {{REST: plural nouns, kebab-case paths, camelCase or snake_case JSON — pick one; gRPC: Google AIP style; CLI: `noun verb` or `verb noun`, long flags kebab-case; SDK: idiomatic to the language}}
- Timestamps: RFC 3339 / ISO 8601 in UTC · IDs: opaque strings · Money: integer minor units + currency code.

### 2.2 Versioning
- Scheme: {{URL path /v1 · header · package major version (SemVer) · proto package version}}
- Additive changes are non-breaking; removing/renaming fields, changing types or semantics is breaking and requires a new major version.

### 2.3 Pagination, filtering, sorting
- Pagination: {{cursor-based (`cursor`, `limit` ≤ {{max}}) recommended / offset}}; response includes `next_cursor`.
- Filtering: {{e.g. `?status=open&created_after=…`}} · Sorting: {{e.g. `?sort=-created_at`}}

### 2.4 Idempotency and concurrency
- Unsafe retries (POST) accept an `Idempotency-Key` header; repeated keys within {{24 h}} return the original result.
- Optimistic concurrency via {{ETag / If-Match / version field}}.

### 2.5 Errors
<!-- guidance: For HTTP APIs, RFC 9457 Problem Details is a good default. For gRPC use status codes + error details; for CLIs use exit codes + stderr; for libraries use typed errors/exceptions. -->
Example (HTTP, `Content-Type: application/problem+json`):
```json
{
  "type": "https://{{docs_domain}}/errors/validation",
  "title": "Validation failed",
  "status": 422,
  "detail": "title must be 1–200 characters",
  "instance": "/v1/items",
  "errors": [{ "field": "title", "code": "too_long" }],
  "trace_id": "{{correlation_id}}"
}
```
| Condition | HTTP | gRPC | CLI exit | Library |
| --- | --- | --- | --- | --- |
| Invalid input | 400 / 422 | INVALID_ARGUMENT | {{2}} | {{ValidationError}} |
| Not authenticated | 401 | UNAUTHENTICATED | {{3}} | {{AuthError}} |
| Not permitted | 403 (or 404 to avoid disclosure) | PERMISSION_DENIED | {{3}} | {{AuthError}} |
| Not found | 404 | NOT_FOUND | {{4}} | {{NotFoundError}} |
| Conflict | 409 / 412 | ABORTED / FAILED_PRECONDITION | {{5}} | {{ConflictError}} |
| Rate limited | 429 + Retry-After | RESOURCE_EXHAUSTED | {{6}} | {{RateLimitError}} |
| Server error | 500 / 503 | INTERNAL / UNAVAILABLE | {{1}} | {{InternalError}} |
- Never expose stack traces, SQL, or internal hostnames in errors.

### 2.6 Authentication and authorization
<!-- guidance: Decide each bullet; cross-check with SECURITY_ARCHITECTURE §4–§5. Lite: mechanism, token lifetime, and tenant rule only. -->
- Mechanism: {{e.g. OAuth 2.0 / OIDC bearer tokens · session cookies (HttpOnly, Secure, SameSite) · API keys for server-to-server · mTLS · CLI device-code login with OS keychain storage}}
- Scopes/permissions per operation are listed in §3; matrix in [SECURITY_ARCHITECTURE](SECURITY_ARCHITECTURE.md#5-authorization).
- Token/session lifetime and refresh: {{access ≤ 15 min, refresh rotation with reuse detection / session idle ≤ 30 min / API key rotation ≤ 90 d}}; credentials only in headers, never in URLs or logs.
- Object-level checks (BOLA, TH-02): every operation that takes an ID verifies ownership/tenant from the token, not from the request. Function-level checks: admin operations are gated per matrix row.
- API keys and service accounts: {{scoped, one per consumer, hashed at rest, revocable, last-used tracked}}. Machine clients use {{OAuth client credentials / mTLS / signed requests}}.
- Failure responses for authN/authZ use the §2.5 model, never reveal whether an account or object exists, and are rate limited (TH-01).

### 2.7 Rate limits and quotas
| Consumer tier | Limit | Window | Headers |
| --- | --- | --- | --- |
| {{anonymous / authenticated / partner}} | {{n}} | {{per minute}} | {{RateLimit-* / Retry-After}} |

### 2.8 Request and response security
<!-- guidance: One decision per row; each links to its threat in SECURITY_ARCHITECTURE §3 (use the real TH-xx IDs) and to OWASP API Top 10 rows in §9.2. Non-HTTP APIs (CLI, library, gRPC): keep the rows that apply and mark others `N/A — reason`. -->
| Topic | Decision | Threat / OWASP |
| --- | --- | --- |
| CORS | {{allow-list of exact origins; no `*` with credentials; allowed methods/headers; preflight cache}} or `N/A — no browser clients` | {{API8}} |
| Max request / upload size | {{body ≤ n MB; upload ≤ n MB with type and content sniffing; reject early with 413}} | {{TH-05, API4}} |
| Input schema validation | {{schema (OpenAPI/JSON Schema/protobuf) enforced at the edge; reject unknown fields (or document ignore policy); strict types, lengths, enums}} | {{TH-06, API3}} |
| Response field allow-lists | {{explicit DTO/serializer per role; never serialize entities directly; no over-fetching}} | {{TH-04, API3}} |
| Error verbosity | {{generic message + `trace_id` to clients; detail only in logs}} (see §2.5) | {{API8}} |
| Idempotency keys | {{required on unsafe retried operations (§2.4); key scoped per caller; stored {{24 h}}}} | {{TH-08}} |
| Inventory and versions | This document is the API inventory; no undocumented or shadow endpoints; retire old versions per §6 | {{API9}} |
| Consuming third-party APIs | {{validate and size-limit upstream responses, timeouts, retries with backoff, no blind redirects}} | {{API10, TB-5}} |

## 3. Operation catalog
<!-- guidance: Minimum content — one row per operation needed by APP_FLOW actions, admin functions, auth (sign-in,
sign-out, refresh, password reset, MFA), account management (profile, data export, delete account), integrations
(webhook receivers, API keys) and health/status endpoints if hosted. A CRUD resource usually needs list (paginated),
get, create, update (with concurrency control), delete — omit one only with a reason. Typical size: 15–60 operations
for a multi-user app. Group by resource with sub-headings or a "Resource" column if long. -->
| ID | Operation | Method / command / function | Purpose | Auth / scope | Idempotent | Features | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| OP-01 | {{List items}} | {{GET /v1/items · `tool items list` · `client.items.list()`}} | {{purpose}} | {{scope}} | {{yes}} | F-01 | {{Proposed / Stable}} |

## 4. Operation detail
<!-- guidance: Minimum content — one sub-section per Must operation (Standard/Enterprise: every non-trivial operation),
each with parameters table including constraints (lengths, ranges, enums), success shape, every applicable error with
status/code, authorization rule (role + ownership/tenant check), idempotency/concurrency, pagination (lists), side
effects/events, data entities touched (DATABASE §5), NFR target, and a realistic example with synthetic data. -->

### OP-01 — {{operation_name}}
- **Request:** {{method_path_or_signature}}
- **Parameters / body:**

| Name | In | Type | Required | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| {{name}} | {{path/query/body/flag/arg}} | {{type}} | {{yes/no}} | {{rules}} | {{description}} |

- **Success response:** {{status_and_shape_or_stdout_or_return_type}}
- **Authorization:** {{role/scope + ownership/tenant rule, e.g. member of the item's organization; guests read-only}}
- **Errors:** {{list from §2.5 that apply, with error codes}}
- **Idempotency / concurrency:** {{Idempotency-Key / If-Match version / n/a}}
- **Data touched:** {{entities from DATABASE §5}}
- **Side effects / events emitted:** {{events}}
- **Performance target:** {{NFR-xx}}
- **Example:**
```text
{{example_request_and_response_or_cli_session}}
```

## 5. Webhooks / events
<!-- guidance: If none, keep the heading and write `N/A — reason`. Otherwise one row per event: envelope (id, type, occurred_at, tenant_id, data), versioning, delivery semantics, ordering, retries/DLQ, consumer dedupe. -->
| Event | Trigger | Payload schema | Delivery | Security |
| --- | --- | --- | --- | --- |
| {{item.created}} | {{trigger}} | {{link}} | {{at-least-once, retries with backoff for {{n}} h, ordered?}} | {{HMAC signature header + timestamp; consumers verify and dedupe by event id}} |

**Webhook security (required for inbound and outbound):** verify the signature over the raw body with a per-endpoint secret before parsing (TH-07); reject timestamps outside a {{5 min}} tolerance and remember processed event IDs for the replay window (TH-08); process idempotently (a duplicate delivery has no second effect); respond fast and queue work; use constant-time comparison; rotate secrets with an overlap period. Outbound senders: sign, retry with backoff, and allow-list destination URLs (SSRF, SECURITY_ARCHITECTURE §8).

## 6. Deprecation and change policy
- Breaking changes only in a new major version; the previous version is supported for {{period}} after the successor is GA.
- Deprecations announced in [CHANGELOG](../../CHANGELOG.md) and signalled in-band ({{e.g. `Deprecation` and `Sunset` headers, CLI warning on stderr, language-level deprecation annotations}}).
- Contract changes are reviewed in PRs together with the spec file and contract tests.

## 7. Open questions
| ID | Question | Owner |
| --- | --- | --- |
| Q-{{nn}} | {{question}} | {{owner}} |

## 8. Resource model and conventions map
<!-- guidance: Minimum content — the mapping from DATABASE entities to API resources/types so field names, IDs, enums
and money/time formats stay consistent. Mark internal-only fields that MUST NOT be exposed (password hashes, token
hashes, internal flags, other tenants' data). -->
| Resource / type | Backing entity | Exposed fields | Never exposed | Operations |
| --- | --- | --- | --- | --- |
| {{Item}} | {{items}} | {{id, title, status, created_at, version (as ETag)}} | {{organization_id internals, deleted_at}} | OP-{{nn}}–OP-{{nn}} |

## Completeness self-check
<!-- guidance: Tick every box before presenting this doc. Fix gaps instead of reporting them; anything not fixable
becomes [TBD] + Q-xx. Keep this checklist in the output, ticked. -->
- [ ] Every APP_FLOW action/command that touches server/core data maps to an OP-xx; every OP-xx maps to an F-xx.
- [ ] Auth, account-management, and data-export/delete operations exist (or `N/A — reason`).
- [ ] Every CRUD resource has list/get/create/update/delete or a stated reason for omission.
- [ ] Every operation states auth/scope, tenant/ownership rule, and applicable errors from the single §2.5 model.
- [ ] Every list is paginated (cursor) with a max page size; every unsafe retryable operation is idempotent; updates use concurrency control.
- [ ] Every input has constraints (types, lengths, ranges, enums) matching DATABASE §5 and §14.
- [ ] Sensitive fields are never exposed (§8); the authorization matrix in SECURITY_ARCHITECTURE has a row per OP-xx.
- [ ] §2.6 and §2.8 decide token lifetime, CORS, size limits, schema validation, response allow-lists, and error verbosity; webhook verification, replay window and idempotency are stated.
- [ ] Rate limits, versioning, and deprecation policy are decided; events/webhooks are signed and deduplicated (or N/A).
- [ ] Machine-readable spec source of truth is named or `[TBD]` with owner.
- [ ] No `{{placeholders}}` or guidance comments remain.

## Definition of done
- [ ] Style, consumers, and source-of-truth spec are named (or [TBD] with owner).
- [ ] Naming, versioning, pagination, idempotency, error, auth, and rate-limit conventions are decided.
- [ ] Every operation traces to an F-xx and has auth/scope and error cases.
- [ ] Must operations have full detail and an example.
- [ ] Deprecation policy and webhook security (if any) are defined.
- [ ] Completeness self-check is fully ticked.
