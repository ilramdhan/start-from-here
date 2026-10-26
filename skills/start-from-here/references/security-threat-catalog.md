# Security threat catalog (design time)

Prompts for filling SECURITY_ARCHITECTURE §2 trust boundaries, §3 STRIDE table, §3.2 abuse cases and §3.3 AI threats **before any code exists**. The catalog does not audit code. It turns known attack classes into design questions and candidate controls, so the threat table reflects the product actually being designed instead of a generic checklist.

**When to read:** after ARCHITECTURE, DATABASE and API are drafted and before writing SECURITY_ARCHITECTURE §3. Read "How to use", "Evidence discipline" and "Core classes" every time. Read a domain section only when its "Select when" trigger matches the design. Never load every domain by default.

**Attribution:** Adapted from cloudflare/security-audit-skill (MIT, © 2025-2026 Cloudflare, Inc.), commit c1c8a8c. Rewritten for design-time threat modeling; not endorsed by Cloudflare. The license notice is at the end of this file.

## Contents

1. How to use
2. Evidence discipline
3. Core classes (always considered)
4. Obvious-things design checklist
5. Domain sections (select by trigger): D1 web protocol and federated identity · D2 AI, LLM and agents · D3 browser and client side · D4 supply chain and release · D5 cloud and deployment · D6 RPC and messaging · D7 resource exhaustion and availability · D8 data isolation and lifecycle · D9 desktop, mobile and local IPC · D10 memory safety and native code
6. License notice for adapted material

---

## 1. How to use

1. **Frame each boundary.** For every TB-x in §2, write one line: *lower-trust principal → boundary → asset at stake* (e.g. "free-plan member → API gateway → other tenants' invoices"). A boundary with no lower-trust principal on one side is not a boundary; merge or drop it.
2. **Select sections by what exists, not by technology names.** Use the boundaries and features in ARCHITECTURE (containers, integrations, deployment), API (operations, webhooks, auth), DATABASE (tenancy, PII, exports, retention) and DISCOVERY flags (AIM-*, IDN-*, PRV-*, CMP-*, platform). A language or library name alone never selects a section; a feature does (e.g. "users upload archives", "agent calls tools", "plugins load at runtime").
3. **Load only selected sections.** Core classes (§3) and the checklist (§4) always apply. Load a domain section (§5) only when its trigger matches. This keeps the reading cost small in short-context sessions.
4. **Walk the prompts.** For each "Ask:" line in a selected section, decide for the specific design:
   - It applies → write a TH-xx row: attacker → action → asset, STRIDE letter, control(s), status, SEC-xx. Put the control where the "Lands in" note says.
   - It depends on a choice not yet made → TH-xx row with status `Needs decision` and a Q-xx in DISCOVERY (see §2).
   - It does not apply → skip it silently. Do not write a row to show it was considered.
5. **Record coverage.** Under the §3 table write one line: `Catalog domains considered: D1, D3, D8 · skipped: D9 (no native client), D10 (no native code)`. Every skipped domain gets a one-line reason.
6. **Keep the STRIDE coverage rule.** The catalog adds depth; it does not replace the TB × STRIDE coverage rule in the template.

## 2. Evidence discipline

A design-time threat is still a claim. Apply these rules before writing a row.

- **Three parts or no threat.** Every TH-xx names an attacker (or lower-trust principal), the boundary crossed, and the asset or outcome affected. If one part is missing, the item is not a threat.
- **Checklist gaps are not threats.** "No CSP", "no rate limit", "cookie lacks a flag" become threats only when a realistic attacker gains something across a boundary. Otherwise record them as a hardening note in the relevant section (§8, §8.1, §10) without a TH-xx.
- **Defense in depth is a hardening note.** A second layer for a threat already controlled is a control on the existing row, not a new threat.
- **Same-principal effects are not threats.** A user harming only their own data with their own authority, or someone installing an extension into software only they run, crosses no boundary.
- **Risk never exceeds impact.** Rate with §3.1. When the concrete damage cannot be named, rate impact lower. Do not raise risk because a class sounds severe.
- **Undecided design → `Needs decision`.** When the threat exists only under one option of an open choice (e.g. "if exports are tenant-wide"), write the row with status `Needs decision`, leave L/I/Risk as `—`, and link the Q-xx that resolves it. Re-rate when the decision lands.
- **Do not assume deployment facts.** Proxy behavior, provider defaults, cloud policy, store review or OS policy that is not decided is a `Needs decision` or `[TBD]`, never an assumed control and never an assumed gap.
- **No padding.** Never invent Low threats to fill a table. An honest `N/A — reason` row is better than a filler threat.
- **No invented facts.** Do not cite CVE/CWE numbers, tool behavior or standard clauses you have not verified. OWASP mappings below are only the ones the template already uses in §9.

---

## 3. Core classes (always considered)

Each class lists design questions, typical controls, the usual STRIDE letters, and where the result lands in SECURITY_ARCHITECTURE (or sibling docs).

### 3.1 Injection — T, E, I

- Ask: where does untrusted data reach an interpreter (query language, shell, template, expression engine, file path, URL, redirect, deserializer)? Is each such sink named in ARCHITECTURE or API?
- Ask: can data stored safely by one component be read later by another component that uses it in an interpreting context (second-order)?
- Ask: can identifiers, not just values, be attacker-controlled: field names, sort keys, JSON paths, header names, metadata keys, file names?
- Ask: do secondary systems receive raw input (logs, caches, search indexes, analytics, spreadsheets exported to users)?
- Ask: do any operations build commands or queries from strings at all, or is the design committed to parameterized/structured APIs?
- Controls: parameterized queries and structured APIs only; allow-listed identifiers (sort/filter fields from a fixed set); context-specific output encoding; no dynamic evaluation of user input; log-safe encoding; strict schemas at each TB.
- Lands in: §8 input/output handling; API §2 conventions (allowed sort/filter fields); CODE_STYLE security rules. OWASP Top 10 A05 Injection.

### 3.2 Access control — E, I, T

- Ask: for every state change, is there more than one path to it (UI, API, batch, import, admin console, background job, legacy version)? Do all paths check the same permission?
- Ask: can a request body or query field (owner ID, tenant ID, role, plan) override what the session identity says?
- Ask: which operations check that the caller is signed in but not that the caller may act on *this* object?
- Ask: do bulk, batch, export and import operations check authorization per item, not once per request?
- Ask: are object identifiers guessable, and does that matter given the ownership check?
- Ask: which fields can each role write (mass assignment) and read (over-fetching)?
- Controls: deny by default; identity and tenant taken only from the authenticated context; object-level check on every access; per-item checks in bulk paths; writable/readable field allow-lists per role; one shared authorization layer used by every path.
- Lands in: §5.2 permission matrix and §5.4 enforcement rules; API §2.6; TESTING denial tests. OWASP A01; API1, API3, API5.

### 3.3 Resource and file handling — T, I, E, D

- Ask: does any feature accept a file name or path from users (upload, download, template, plugin, export target)? Where can it resolve to (symlinks, encoded separators, absolute paths)?
- Ask: does the server fetch any URL a user or third party can influence (webhooks, avatars by URL, link previews, imports, OAuth metadata)? What internal addresses could that reach, including after redirects and re-resolution?
- Ask: does the design deserialize untrusted structured data into rich objects, or accept archives/documents that are expanded server-side (path escape on extraction, nested archives)?
- Ask: are temporary files created in shared locations with predictable names?
- Ask: is there a check-then-use gap on files or resources (check permissions, then open later)?
- Controls: server-generated storage keys, never user paths; storage outside served roots; type and size limits; extraction into an isolated directory with path validation; egress allow-list and blocking of internal ranges for server-side fetches; data-only deserialization formats; private temp directories; operate on opened handles, not re-resolved paths.
- Lands in: §8 (file handling, SSRF rule); §2 TB for outbound fetches; TESTING fuzzing row. OWASP A01 (incl. SSRF); API7.

### 3.4 Cryptography and secrets — I, S, T

- Ask: which values must be unguessable (session IDs, reset tokens, invite links, API keys, nonces)? Is a cryptographically secure generator specified?
- Ask: where could a secret leak: source, config committed to the repo, logs, error messages, URLs, client bundles, analytics, AI prompts?
- Ask: are signatures/MACs verified before data is used, and are secret comparisons constant-time?
- Ask: is encryption authenticated, with keys and nonces managed by a named service rather than invented per feature?
- Ask: when a crypto operation or key fetch fails, does the design fail closed or silently continue unprotected?
- Controls: secure random generation; secrets by name from a secret manager; authenticated encryption via vetted libraries; key rotation; verify-then-parse; fail closed on crypto errors.
- Lands in: §7 secrets, §7.2 keys, §12 never-log list. OWASP A04.

### 3.5 Business logic — T, E, D, R

- Ask: for each multi-step workflow (checkout, approval, onboarding, refund, invitation), can steps be skipped, repeated, reordered or replayed? What happens if step 2 of 3 fails?
- Ask: which operations check a value then act on it non-atomically, so two concurrent requests both pass (double spend, double approve, overselling)?
- Ask: which numeric inputs need bounds: negative, zero, huge, fractional, currency precision, string/number coercion?
- Ask: can a restriction enforced on one operation be bypassed by another operation that reaches the same effect?
- Ask: which data is trusted because "it was validated when written", even though another path (import, admin, migration) can write it?
- Ask: how do expiry, scheduling and rate windows behave at the exact boundary, across time zones, and with clock skew between components?
- Ask: what is the security posture when configuration is missing, a feature flag is off, a dependency is down, or a migration is half done?
- Controls: explicit state machines (DATABASE §5.x status lifecycles) with server-enforced transitions; idempotency keys; atomic conditional updates or locks; server-side numeric bounds; single source of truth for limits; fail-closed defaults.
- Lands in: §3.2 abuse cases; DATABASE status lifecycles; API §2.4 idempotency; TESTING edge cases. OWASP A06; API6.

### 3.6 Feature abuse and data leakage — I, E

- Ask: could a user with limited rights start an export, backup or report that contains data above their access, other users' data, deleted/draft content, or pruned history?
- Ask: can import or restore overwrite existing records, skip validation, or write into collections the user cannot write to?
- Ask: can search, filtering or sorting reveal the existence or value of hidden records or fields (counts, ordering by a hidden field)?
- Ask: do error messages, timings or status codes distinguish "does not exist" from "no access"? Can sign-up, reset or invite flows enumerate accounts where that matters?
- Ask: are preview/share links scoped to one item and expiring? Can drafts surface through feeds, sitemaps, listings or caches?
- Ask: can users configure a URL the server will call (webhook, notification, callback)?
- Controls: re-authorize every item placed into an export; import goes through the same validation and permissions as the UI; filter/sort fields allow-listed per role; uniform not-found responses where existence is sensitive; scoped, expiring share tokens; outbound URL policy (see 3.3).
- Lands in: §3.2 abuse cases; §5; §6; §11 data subject export. OWASP A01; API3, API6.

### 3.7 Chained boundaries — E, T, I

- Ask: what can the lowest-privilege principal read, write, invoke and retain? Which of those outputs does a more trusted component later rely on?
- Ask: when component A validates input and hands it to component B, does B assume more than A guarantees (truncation, normalization, tenant scope, type)?
- Ask: does any stored value later change meaning (a slug becomes a path, a name becomes a URL, text becomes a template or policy expression)?
- Ask: can a token, API key, plugin, OAuth grant or agent gain broader scope after delegation, refresh, caching or role change?
- Ask: do undelete, restore, rollback and cancellation re-apply current ownership and permissions?
- Controls: each component validates what it relies on; capability narrowing on delegation; scope fixed at issuance; restores re-authorized against current policy.
- Lands in: §2 TB table (state the guarantee each side relies on); §5.4.

## 4. Obvious-things design checklist

Decide each item once in the design. Most become a control or hardening note, not a TH-xx (see §2).

- Debug/dev modes cannot be enabled in production by config, header or parameter. Admin, metrics, health-detail and status endpoints are authenticated or not publicly routed.
- No secrets in the repository; ignore rules cover env files, keys and local config; secret scanning in CI (§10, §15).
- No default or seed credentials survive into production.
- CORS allows named origins only; credentials never combined with a reflected or wildcard origin.
- Session cookies carry `Secure`, `HttpOnly` and a deliberate `SameSite` value where cookies are used.
- Redirect targets come from an allow-list or are relative paths only.
- TLS everywhere, including internal hops where the threat model requires it.
- Production errors return generic messages; detail goes to logs (§12).
- Dependencies pinned via lockfiles; CI actions pinned; vulnerability scanning on (§10).
- No dynamic code evaluation of user-influenced input.

---

## 5. Domain sections

Each section: a trigger, then compact prompts and controls. Skip the section entirely when the trigger does not match, and record the skip in the §3 coverage note.

### D1. Web protocol and federated identity

**Select when the design has** browser sessions or cookies, a reverse proxy/CDN/gateway in front of the app, JWTs, OAuth/OIDC or SAML sign-in, MFA or passkeys, account recovery or linking, API keys, or mTLS.

- Ask: do two components (CDN, proxy, app) parse the same request or cache key differently? Which response variants (per user, per role, per language) could a shared cache serve to the wrong user? → private responses marked non-cacheable; cache key includes every varying input. (I, T)
- Ask: which components trust `Host` or forwarded headers to build links (reset emails, callbacks), route tenants or read the client address? Who strips client-supplied copies? → canonical host from config; trusted ingress overwrites forwarded headers. (S, T)
- Ask: which cookie-authenticated operations change state, and what stops a cross-site request (token, SameSite, Origin check)? Include login and method-override routes. (T, E)
- Ask: are sessions rotated on sign-in, privilege change, MFA completion and impersonation, and revoked on logout, password change and account disable — including refresh tokens and open sockets? (S, E)
- Ask: for each token type, which issuer, audience, algorithm, key source, expiry and one-time state are verified? Is the algorithm pinned server-side, and are key-selection headers treated as untrusted? → API §2.6, §4.2. (S, E)
- Ask: in OAuth/OIDC, which role does the product play (client or authorization server)? Are `state`, PKCE, nonce and exact redirect URIs bound to the initiating session and chosen provider? In SAML, is the signed element the one used for identity? (S)
- Ask: can a first factor alone enroll, replace or disable a second factor, generate recovery codes, or complete step-up for a different session or action? → fresh authentication for factor changes; step-up bound to session, action and expiry. (E, S)
- Ask: does linking a new identity (provider, email, phone, passkey) require a current session, proof of ownership and callback state bound to the initiating account? (S, E)
- Ask: is recovery (reset links, support-assisted recovery, email/phone change) as strong as sign-in, single-use, expiring, and invalidating prior tokens and sessions? (S)
- Ask: do API keys bind to tenant, scope and environment server-side, with request parameters unable to widen them? Can publishable and secret keys be confused? Where could keys leak (URLs, client bundles, logs)? (E, I)
- Ask: with mTLS, who may connect directly to the backend, are identity headers from an mTLS-terminating proxy stripped from other peers, and what happens when certificates expire or fail to load (fail closed)? (S)
- Lands in: §4 authentication flows and §4.2 checklist; §8.1 headers; API §2.6. OWASP A07; API2.

### D2. AI, LLM and agents

**Select when the design has** a model in any trust-relevant path: chat assistants, retrieval over user or third-party content, persistent memory, tool or function calling, agent loops, MCP servers or clients, or model output that is rendered or acted on. Pair with template §3.3 and §9.4.

- Ask: who can write content that later enters another principal's model context (documents, web pages, emails, tickets, tool responses, metadata)? What can the model do in that session? → retrieved content treated as data; side-effect tools need deterministic authorization and binding to the user's request. A guardrail prompt is not a control. (E, T) LLM01.
- Ask: are conversation history, embeddings, retrieval results and prompt caches filtered by tenant and ACL inside the query and every cache key? (I) LLM02, LLM08.
- Ask: who can create or update durable memory, and can low-trust observations become instructions or facts for another user or a privileged session? → provenance and tenant scope on memory; preferences separated from policy. (T) LLM04.
- Ask: can untrusted text pose as system instructions, earlier conversation or tool output through string concatenation or caller-supplied role fields? → typed message roles; provenance kept through serialization. (S, T)
- Ask: do tool arguments produced by the model reach queries, shells, file paths, URLs or privileged APIs? → tool handlers validate and authorize like any API endpoint; schema shape is not authorization. (E) LLM05.
- Ask: whose credentials does the agent use? Does each tool re-check that the requesting user may do this exact operation on this resource? → least-privilege per-user credentials or enforced per-user scoping. (E) LLM06.
- Ask: when a user approves an action, is the approval bound to the exact tool, arguments, target and expiry, so a later turn, retry or batch cannot change them? (T, E) LLM06.
- Ask: can one request start unbounded tool loops, spend, messages or external calls? → per-request and per-user budgets, cancellation, idempotency. (D) LLM10.
- Ask: do delegated sub-agents or MCP servers receive only the authority they need? Are tool and server identities bound to the authenticated connection, so another server cannot claim the same tool name or answer another's call? Is peer-supplied tool metadata kept from acting as policy? (S, E) LLM03, LLM06.
- Ask: does assembled context contain secrets, other users' data or authorization logic that model output could reveal? (I) LLM02, LLM07.
- Ask: is model output rendered as HTML/Markdown, used as a URL, or executed? → encode for the sink; restrict auto-loaded resources. (T, I) LLM05.
- Lands in: §3.3 rows; §9.4; AI_GUIDELINES if the team uses AI tools; TESTING AI red-team row.

### D3. Browser and client side

**Select when the design has** a single-page app, rich client rendering of user content, browser extension, embedded webview, service worker or offline mode, cross-window messaging, WebSockets, or sensitive data in browser storage.

- Ask: which client-side sources (URL fragment, query, referrer, window name, messages, storage) reach HTML insertion, script evaluation or navigation? Which framework escape hatches will be used? → framework auto-escaping; sanitizer for rich text; CSP. (T, E)
- Ask: can user-supplied markup carry `id`/`name` attributes or object keys that shadow configuration or pollute shared prototypes used by later code? → sanitizer strips those attributes; safe merge utilities. (T)
- Ask: do message handlers check the exact sender origin (and source frame), and do senders target an exact origin rather than any? (S, I)
- Ask: does the WebSocket handshake check `Origin` or require a channel token, given cookies are sent automatically? (S)
- Ask: is credentialed CORS limited to named origins? (I)
- Ask: who controls the service-worker script and its imports, and what scope is it allowed? Does it cache personalized responses keyed without the account, and clear them on logout or account switch? (T, I)
- Ask: what lives in browser storage (tokens, private responses, drafts), who on the same origin can read it, and is it cleared on logout, account switch and revocation? Are tab-to-tab broadcasts bound to the current session? (I, E)
- Ask: can another site infer private state (existence of an object, a role) from load/error events, frame counts, redirects or timing while the victim is signed in? → isolation headers, SameSite cookies, uniform responses. (I)
- Ask: which state-changing pages could be framed, and are navigations to `javascript:`/`data:` targets blocked? (T)
- Lands in: §8, §8.1 headers; DESIGN_SYSTEM content rendering rules. OWASP A05 (XSS), A02.

### D4. Supply chain and release

**Select when the design has** third-party dependencies (almost always), CI/CD, published packages or binaries, container images, signed releases, auto-update, or a plugin/extension system. Pair with template §10.

- Ask: can a resolver pick an unintended source (public vs private namespace, fallback registry, mirror, platform-specific variant)? → scoped registries, lockfiles with integrity hashes, frozen installs. (T)
- Ask: which build inputs can change without review: floating tags, branches, remote includes, downloaded tools, unpinned CI actions, base images by tag? → pin by digest/commit. (T)
- Ask: are generated code, vendored archives or binary blobs reviewed and integrity-checked like hand-written source? (T)
- Ask: can the build context pull secrets, local config or test fixtures into a shipped artifact? → explicit include lists; artifact content review. (I)
- Ask: which CI triggers run contributor-controlled code (forks, PR comments, dependency bots), and do those jobs see secrets, write tokens or deploy rights? → untrusted jobs get no secrets; approval gates; minimal token permissions. (E, T)
- Ask: can branch names, commit messages, issue text or artifact names flow into shell commands in CI? → pass as environment variables, never inline in scripts. (T, E)
- Ask: can a low-trust job write a cache, artifact or workspace that a release job later restores and ships? → separate cache namespaces; digest-bound promotion. (T)
- Ask: do test, signature and publication all refer to the same immutable digest, or to mutable names? (T)
- Ask: who may release, from which workflow and branch, with which key? Does the consumer verify those identity claims in the attestation, not just that a signature exists? Do rotation and revocation fail closed? (S, T)
- Ask: does the updater authenticate version, channel, platform and rollback state as well as payload bytes? Is a checksum fetched from the same place as the artifact being relied on? (T)
- Ask: can a plugin gain more host authority than declared, impersonate another publisher, or run install hooks before verification? (E)
- Lands in: §10 controls table and diagram; TH rows on the CI → production TB; OPERATIONS §3 pipeline. OWASP A03, A08; LLM03 for model artifacts.

### D5. Cloud and deployment

**Select when the design has** cloud IAM or workload identities, infrastructure as code, containers or orchestration, service mesh, serverless or edge functions, managed object storage, signed URLs, provider event triggers, or per-environment configuration.

- Ask: what can each workload identity do, on which resources, and can request or job input choose the target? → per-workload roles scoped by resource and condition. (E)
- Ask: in role assumption or workload federation, which claims (source account, repository, branch, namespace, audience) are bound in the trust policy? (S, E)
- Ask: does the app trust identity headers, tags or labels without proof they came from the control plane or a trusted proxy? (S)
- Ask: which listeners are reachable from which networks? Are admin, debug, metrics or control-plane ports kept off public ingress? Can traffic bypass the mesh/proxy via an alternate port? (I, E)
- Ask: can any server-side fetch reach instance metadata or internal APIs with workload credentials? → link to core 3.3 egress policy; metadata access restricted. (E, I)
- Ask: can a lower-trust workload request privileged mode, host mounts, runtime sockets or service-account tokens it does not need? Do all deploy paths (jobs, upgrades, restores) pass the same admission policy? (E)
- Ask: do policies key on labels, names or namespaces a less-trusted principal can set? (E)
- Ask: can dev defaults, flags or per-region overlays disable auth, TLS, tenant scoping or audit in a deployed environment? → render and review final config per environment. (T, E)
- Ask: where could secrets surface across workloads: process arguments, shared env, crash reports, broad volumes, build outputs? What happens when a credential fails to load or refresh (fail closed, no weaker fallback)? (I, S)
- Ask: are bucket policies and signed URLs bound to operation, object, audience and expiry, including list and write? (I, T)
- Ask: do event-triggered functions verify the provider envelope (source, topic, account) and replay state, rather than trusting body fields? (S, T)
- Ask: does an edge or serverless path assume isolation, secrets or tenant policy that differ from the origin, and does fallback change authority or caching? (E, I)
- Lands in: §2 TB table; §6; §7; OPERATIONS §1–§5 environments, config, IaC. OWASP A02; API8.

### D6. RPC and messaging

**Select when the design has** RPC frameworks, GraphQL, custom or binary protocols, streaming, queues, brokers, pub/sub, event buses, or inbound webhooks.

- Ask: at each hop, which peer identity is authenticated, and how does it become the user/tenant used for authorization? "Internal network" is not authentication. (S, E)
- Ask: can a body field select a different user or tenant than the authenticated channel or envelope? Which source is authoritative? (E)
- Ask: does the auth layer cover every route to an operation: unary and streaming calls, reflection, health, gateway-translated paths, compatibility services, and each message on a stream? (E)
- Ask: are streams, subscriptions and batches re-checked when the resource changes or access is revoked mid-stream? (E, I)
- Ask: can correlation or reply IDs be guessed or reused so one caller's response, cancellation or acknowledgement satisfies another's? (S, I)
- Ask: can a publisher or subscriber pick another tenant's topic, wildcard, consumer group or reply queue? Is tenant isolation enforced by the broker or naming, not payload text? (I, T)
- Ask: do dead-letter queues, error topics and traces hold secrets or cross-tenant payloads readable by lower-trust operators? (I)
- Ask: can a message declare itself an admin, provider or migration event without an authenticated producer? (S, E)
- Ask: what are the delivery guarantees, and is every non-idempotent side effect deduplicated with a key that cannot collide across tenants? (T)
- Ask: can stale or reordered messages overwrite newer state, revoked membership or cancelled work? (T)
- Ask: do unknown enum values, missing discriminators or new fields fall to a safe default in older consumers? (T, E)
- Lands in: §2 TB table; §4 service-to-service auth; API webhooks/events and §2.4 idempotency. API10 for consumed third-party APIs.

### D7. Resource exhaustion and availability

**Select when** anything an outsider or tenant sends (requests, files, messages, agent tasks) draws on shared capacity: compute, memory, storage, connections, workers, queues, paid APIs or quotas. This deepens the D column of STRIDE.

- Ask: which inputs have superlinear cost (nested structures, regular expressions on user input, graph traversal, template expansion, query depth)? Which limits on depth, size and cardinality are specified? (D)
- Ask: can compressed or nested input expand far beyond its transfer size, and is the limit re-checked after each expansion stage? (D)
- Ask: can one small request trigger wide scans, unbounded sorts, fan-out or many downstream calls? → mandatory pagination caps; query cost limits. (D)
- Ask: what accumulates without per-item and aggregate caps: bodies, uploads, sessions, unique cache keys, metric label values, subscriptions, pending jobs? Who cleans up on cancel or timeout? (D)
- Ask: does work continue after the client disconnects or authorization fails? Are deadlines propagated to every layer? (D)
- Ask: what expensive work (parsing, hashing, crypto, external calls) happens before authentication and before the first size or rate gate? (D)
- Ask: what key do quotas count by, can a principal escape its budget or drain someone else's, and are paid-API costs capped per user and per tenant? (D) API4, LLM10.
- Ask: can one tenant's jobs starve others of workers, pools or priority? (D)
- Ask: can a single bad record block a shared queue or recovery loop (poison message)? Are retries capped with backoff and jitter? Does restart/restore replay the input that caused the failure? (D)
- Lands in: §3 D rows; API §2.7 rate limits and quotas; TRD/ARCHITECTURE NFRs; OPERATIONS alerting. API4; LLM10.

### D8. Data isolation and lifecycle

**Select when the design has** multiple tenants or owners sharing stores, derived copies (cache, search, analytics, thumbnails, embeddings), shareable object links, export/backup/restore, migrations, or promises about deletion, revocation and retention. Pair with template §6 and §11.

- Ask: where is the tenant/owner condition enforced for every read, write, list, count and bulk query — repository layer, row-level policy, or both? Do service, admin and background clients bypass it? (I, T)
- Ask: do cache keys, object paths, search document IDs, temp files and uniqueness constraints include the tenant, so two tenants cannot collide on the same key? (I, T)
- Ask: are signed or shared links bound to one object version, one operation, an audience and an expiry, and invalidated when the underlying access changes? (I)
- Ask: when a record's ACL changes or it is deleted, which derived copies (search, cache, embeddings, previews, feeds, analytics, logs) still serve it, and how are they invalidated? (I)
- Ask: do logs, traces and analytics receive content with broader access or longer retention than the source? (I)
- Ask: do counts, filters, uniqueness errors or notifications reveal protected records? (I)
- Ask: are exports and backups scoped to what the requester may read, and is the download itself authorized? Do imports and restores re-validate and re-authorize? (I, E)
- Ask: do migrations leave old rows without tenant, ACL or lifecycle fields, or let old and new readers apply different defaults? (I, E)
- Ask: do replicas, restore environments and support snapshots have broader access than the primary store? (I)
- Ask: does every path (lookup, search, relations, links, jobs, restore) honor soft-delete, and can a deleted identifier be re-registered while references remain? (I, E)
- Ask: does membership removal, role downgrade, consent withdrawal or key revocation invalidate sessions, caches, subscriptions and queued jobs? (E)
- Ask: can queued work, retries or exports recreate deleted data after deletion completes? Does a restore bring back permissions or data that current policy no longer allows? (I, E)
- Lands in: §6 tenant isolation; §11 deletion reach and retention; DATABASE §7 multi-tenancy and retention; OPERATIONS backup/restore. API1; LLM08 for vector stores.

### D9. Desktop, mobile and local IPC

**Select when the design has** a desktop or mobile app, deep links or custom URL schemes, a webview with a native bridge, a privileged helper or installer, a local daemon, local sockets/pipes or OS IPC, browser native messaging, or exported app components. Pair with template §9.3 (MASVS).

- Ask: who is the realistic local attacker: another app, another OS user, an opened document, remote web content in a webview? State it; same-user self-harm is not a threat. (S)
- Ask: can another app or web page invoke a deep link that changes state, completes sign-in, selects an account or imports data without a current-session, one-time binding? (S, T)
- Ask: do OAuth, magic-link, pairing or payment callbacks return to the right app, profile and pending transaction? (S)
- Ask: can opened files, share intents, drag-and-drop, clipboard or notification actions trigger privileged operations without confirming user intent and content type? (T, E)
- Ask: which origins may reach the native bridge, re-checked after every navigation and redirect? Which bridge methods exist, are arguments validated, and are file/command/credential operations allow-listed? (E)
- Ask: can webview content read app-local files or privileged schemes? (I)
- Ask: does each local IPC endpoint authenticate the peer with OS credentials or code identity, not process names or claimed sender fields? Can request fields select a different user than the authenticated peer? (S, E)
- Ask: which mobile components are exported, and do they perform operations meant only for the app itself? (E)
- Ask: does a privileged helper authorize each operation and validate normalized paths, and does the installer avoid reading anything writable by a lower-trust user after authorization? (E)
- Ask: where are tokens stored (OS keychain/keystore vs plain files), and which other apps, profiles, backups, logs or notification previews can read them? (I)
- Ask: does logout or account switch clear caches, widgets, notifications, local databases and webview storage? Do pending confirmations bind to the exact action and account shown? (I, T)
- Lands in: §9.3 MASVS rows (STORAGE, AUTH, PLATFORM, CODE); §4 for callbacks; §7 credential storage; D4 for update authenticity.

### D10. Memory safety and native code

**Select only when the design has** components in memory-unsafe languages or unsafe blocks, native extensions/FFI, parsers or decoders for untrusted binary formats, kernel modules or drivers, firmware, JIT/runtime code, or runtime-loaded native plugins. Skip for designs that only use memory-safe managed runtimes.

- Ask: which components parse untrusted bytes (files, network frames, media) in native code? Can they be isolated in a sandboxed process with minimal privileges? (E, D)
- Ask: are lengths, counts and offsets from input validated before allocation, copy or indexing, including arithmetic overflow, truncation and unit mix-ups (bytes vs elements)? → design rule: checked arithmetic and bounded readers; fuzzing in §15. (T, E)
- Ask: across each FFI boundary, who allocates and frees each buffer, how long pointers stay valid, and do both sides agree on layout, integer width and error/unwind behavior? (T, D)
- Ask: which shared state is touched concurrently, and what is the locking and teardown rule for callbacks, timers and iterators? (T, D)
- Ask: does any privileged process load libraries or plugins from paths a lower-trust user can write, or through a search order influenced by the working directory or environment? Is the verified file the one that is loaded? (E)
- Ask: does kernel or privileged-interface code copy user input once and validate that copy, and authorize the caller for the specific resource? (E)
- Lands in: §8 (parser and native boundary rules); §15 fuzzing and sanitizer rows; CODE_STYLE (unsafe-code policy); ARCHITECTURE (process isolation).

---

## 6. License notice for adapted material

The attack-class taxonomy and evidence discipline in this file are adapted from cloudflare/security-audit-skill (https://github.com/cloudflare/security-audit-skill), commit c1c8a8c1471069fb0e188eeaff69b8e8db6564a8, distributed under the MIT License reproduced below. The adaptation (design-time questions, controls and template mapping) is part of start-from-here and is not endorsed by Cloudflare.

```text
MIT License

Copyright (c) 2025-2026 Cloudflare, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
