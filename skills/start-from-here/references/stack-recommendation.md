# Stack recommendation

Use in Phase 3 when the stack, architecture style, database, hosting, or auth approach is undecided, or when the user's choice conflicts with their constraints.

Everything in this file is a **proposal**. Present options; the user decides. Record the decision in DISCOVERY.md and (Standard/Enterprise) an ADR.

## Ground rules

1. MUST present 2–3 options and mark exactly one **Recommended**, with a reason that quotes the user's own answers.
2. MUST NOT recommend something the user cannot operate, afford, or hire for. A beginner with no ops experience gets managed services, not self-managed clusters.
3. MUST NOT state version numbers from memory. Write "current stable version — verify at setup". If you can browse or run commands, you MAY check the official site or registry and cite it with the date checked.
4. MUST NOT claim a service has a free tier, price, or limit without saying "verify current pricing". Pricing changes often.
5. SHOULD prefer boring, widely adopted technology with large communities and good AI-assistant coverage, unless a constraint says otherwise.
6. SHOULD minimize the number of moving parts for Lite and Standard: one language end to end where reasonable, one database, one deploy target.
7. SHOULD keep lock-in visible: name what is hard to migrate away from.
8. Respect mandates: if the company requires a cloud or language, options are variations within that mandate.
9. Examples below are illustrative, not endorsements. Substitute equivalents the user already knows.

## Decision factors

| Factor | Question to answer | Typical evidence |
|---|---|---|
| Team skills | What can the team build and debug today? | PLT-02, TEA-01 |
| Constraints | Mandated vendors, languages, on-prem, air-gapped? | PLT-04, PLT-10 |
| Scale | Users, load, data volume in year one? | USR-03, NFR-Q03 |
| Budget | Monthly infra and tooling budget? | PLT-05, TIM-03 |
| Ecosystem | Libraries for the hard parts (auth, payments, PDFs, ML)? | SCO-01, ARC-01 |
| Hiring | Can you find people (or AI help) for it? | TEA-02 |
| Hosting/ops | Who runs it, patches it, is on call? | OPS-*, OBS-02 |
| Compliance | Residency, audit, HIPAA/PCI scope, certifications of vendors? | CMP-*, DAT-09 |
| Time to market | Deadline vs learning curve? | TIM-01 |
| Lock-in | Cost of leaving the vendor or framework? | — |
| Platform reach | Web, iOS, Android, desktop, embedded targets? | SCO-03, PLT-06 |
| Performance | Latency, real-time, compute-heavy work? | NFR-Q01, ARC-03 |

## Scoring matrix template (Standard/Enterprise)

Weights 1–5 come from the user's priorities. Scores 1–5 per option. Show the math; the user can change weights.

| Factor | Weight | Option A | Option B | Option C |
|---|---|---|---|---|
| Team skills fit | {{w}} | {{s}} | {{s}} | {{s}} |
| Time to market | {{w}} | | | |
| Running cost | {{w}} | | | |
| Ops burden (higher score = less burden) | {{w}} | | | |
| Scalability headroom | {{w}} | | | |
| Ecosystem / libraries | {{w}} | | | |
| Compliance fit | {{w}} | | | |
| Lock-in (higher = less lock-in) | {{w}} | | | |
| Hiring / community | {{w}} | | | |
| **Weighted total** | | {{Σ}} | {{Σ}} | {{Σ}} |

Note under the table: "Scores are judgments based on your answers, not measurements."

## Presentation format

```markdown
**Recommendation: application stack**

| Option | Components | Best for | Trade-offs | Cost / ops effort |
|---|---|---|---|---|
| A — Recommended | … | … | … | … |
| B | … | … | … | … |
| C | … | … | … | … |

**Why A for you:** You said {{quote}}. A keeps {{benefit}} while {{trade-off}} is acceptable because {{reason}}.
**What would change my mind:** {{condition under which B is better}}.
Pick A, B, C, or describe your own.
```

## Cross-cutting defaults (proposals)

| Concern | Lite / beginner default | Standard default | Enterprise default |
|---|---|---|---|
| Architecture style | Single app (monolith) | Modular monolith | Modular monolith or services per team boundary, justified by ADR |
| Database | Managed relational DB or SQLite for local/single-user tools | Managed PostgreSQL-compatible | Managed relational with PITR, read replicas if needed |
| Auth | Managed auth provider | Managed auth provider or framework auth library | IdP with OIDC/SAML SSO, MFA, SCIM |
| Hosting | Managed platform (PaaS) | PaaS or container platform | Cloud provider with IaC, separate accounts per environment |
| CI | Code host's built-in CI | Same, with required checks | Same, with signed artifacts and protected environments |
| Observability | Platform logs + uptime ping | Error tracking + structured logs + uptime | Central logs, metrics, traces, alerting, SLO dashboards |
| Secrets | Platform env vars | Platform env vars / secret manager | Secret manager with rotation and audit |

## Archetype reference stacks

Each archetype lists options as proposals. Pick the 2–3 that fit; adapt names to the user's language skills.

### 1. Content site / marketing site / blog / docs

| Option | Components | Best for | Trade-offs |
|---|---|---|---|
| A | Static site generator (e.g. Astro, Hugo, Eleventy, Docusaurus for docs) + static hosting/CDN | Speed, low cost, security | Dynamic features need extra services |
| B | Hosted CMS / site builder | Non-technical editors | Vendor lock-in, recurring cost, less control |
| C | Headless CMS + static/SSR framework | Editors + developers, multiple channels | More moving parts |

Recommend A for developers and docs, B for non-technical owners.

### 2. SaaS web application (accounts, dashboard, CRUD)

| Option | Components | Best for | Trade-offs |
|---|---|---|---|
| A | Full-stack TypeScript framework (e.g. Next.js, Nuxt, SvelteKit, Remix) + managed Postgres + managed auth + PaaS | JS/TS teams, fast iteration | Framework churn; serverless limits for long jobs |
| B | Batteries-included server framework (e.g. Django, Rails, Laravel, Phoenix) + Postgres + PaaS | Small teams wanting conventions, admin, ORM built in | Server-rendered UI; rich client needs extra work |
| C | Backend-as-a-service (e.g. Supabase, Firebase, Appwrite) + SPA/mobile client | Very fast MVP, beginners | Lock-in, complex authorization rules in BaaS policy language |

Also consider: Go / Java (Spring) / .NET / Rust backends with a separate SPA when the team already knows them or performance needs justify it.

### 3. Mobile app

| Option | Components | Best for | Trade-offs |
|---|---|---|---|
| A | Cross-platform (e.g. React Native with Expo, Flutter) + BaaS or API | One team, both stores | Native edge cases, larger binaries |
| B | Native (Swift/SwiftUI + Kotlin/Jetpack Compose) | Device-heavy features, best platform feel | Two codebases |
| C | PWA (installable web app) | Content and forms, no store needed | Limited device APIs, iOS limitations |

Remind: app-store review, privacy labels, account deletion requirements.

### 4. Cross-platform desktop app

| Option | Components | Best for | Trade-offs |
|---|---|---|---|
| A | Tauri (Rust core + web UI) | Small binaries, security-conscious | Rust for native parts |
| B | Electron (Node + web UI) | Mature ecosystem, JS teams | Memory/binary size |
| C | Native toolkit or Flutter/.NET MAUI/Qt | Native look or existing skills | Toolkit-specific skills |

Remind: code signing, notarization, auto-update channel.

### 5. CLI tool

| Option | Components | Best for | Trade-offs |
|---|---|---|---|
| A | Go single static binary | Easy distribution, fast startup | Less dynamic plugin story |
| B | Rust | Performance, safety | Steeper learning curve |
| C | Node/TypeScript or Python package | Teams in those ecosystems, quick iteration | Requires runtime on user machine |

Distribution: language registry, Homebrew/Scoop/winget, release binaries with checksums.

### 6. Public API / backend service

| Option | Components | Best for | Trade-offs |
|---|---|---|---|
| A | REST + OpenAPI on a mainstream framework (e.g. FastAPI, Express/Fastify/NestJS, Go net/http or chi, Spring Boot, ASP.NET Core) + Postgres | Broad client compatibility | Over/under-fetching |
| B | GraphQL server + Postgres | Many client shapes, product UIs | Caching, authZ per field, complexity |
| C | gRPC (+ gateway for REST) | Internal service-to-service, strict contracts | Browser support needs a proxy |

Must cover: auth (API keys/OAuth2), rate limits, versioning, idempotency keys for writes.

### 7. Real-time / collaborative app

| Option | Components | Best for | Trade-offs |
|---|---|---|---|
| A | Managed real-time service + your API | Fast delivery, small team | Cost at scale, lock-in |
| B | WebSockets/SSE on your server + Redis-style pub/sub | Control, moderate scale | Scaling sticky connections |
| C | CRDT library (e.g. Yjs, Automerge) + sync server | Offline-first co-editing | Data model complexity |

### 8. Data / ML / AI app with LLM

| Option | Components | Best for | Trade-offs |
|---|---|---|---|
| A | Web app + hosted LLM API behind an internal adapter + Postgres with a vector extension | Most LLM features, RAG at modest scale | Provider cost and data terms |
| B | Python service (e.g. FastAPI) + orchestration library + dedicated vector DB + job queue | Heavy pipelines, custom models | More services to run |
| C | Self-hosted open-weight model + inference server | Strict data residency, offline | GPU cost, ops expertise |

Must cover: evals, prompt-injection handling, cost limits, data retention by the provider, human review where decisions affect people.

### 9. E-commerce

| Option | Components | Best for | Trade-offs |
|---|---|---|---|
| A | Hosted commerce platform | Non-technical merchants, fastest | Fees, customization limits |
| B | Headless commerce backend + custom storefront | Custom UX with proven checkout | Integration effort |
| C | Custom app + payment provider hosted checkout | Unusual business models | You own catalog, tax, inventory logic |

Always prefer hosted checkout / tokenization so card data never touches your servers (reduces PCI DSS scope).

### 10. Internal tool / admin dashboard

| Option | Components | Best for | Trade-offs |
|---|---|---|---|
| A | Low-code internal-tool builder connected to existing DB/APIs | Speed, non-engineers | Licensing per seat, lock-in |
| B | Batteries-included framework with admin (e.g. Django admin, Rails + admin gem, Laravel + admin panel) | Engineers, custom logic | Some UI limits |
| C | Full-stack TS framework + component library | Teams already on TS | More build effort |

Must cover: SSO with company IdP, audit logging, least privilege.

### 11. IoT / embedded

| Option | Components | Best for | Trade-offs |
|---|---|---|---|
| A | Vendor SDK/RTOS (e.g. Zephyr, FreeRTOS, ESP-IDF) in C/C++ + managed IoT cloud hub | Production devices | Toolchain complexity |
| B | Embedded Rust | Memory safety | Smaller ecosystem for some chips |
| C | Linux SBC + Python/Go + MQTT broker | Prototypes, gateways | Power, cost per unit |

Must cover: device identity, signed OTA updates, offline buffering, hardware supply.

### 12. Game

| Option | Components | Best for | Trade-offs |
|---|---|---|---|
| A | General-purpose engine (e.g. Godot, Unity, Unreal) | Most 2D/3D games | Engine licensing terms (verify current terms) |
| B | Web game framework (e.g. Phaser, PixiJS, Three.js) | Browser games, game jams | Performance ceiling |
| C | Code-first framework (e.g. MonoGame, Bevy, LÖVE, raylib) | Programmers wanting control | More tooling to build |

Multiplayer adds: authoritative server, matchmaking, anti-cheat.

### 13. Library / SDK

| Option | Components | Best for | Trade-offs |
|---|---|---|---|
| A | Single-language package in the target ecosystem's registry | Most libraries | One ecosystem |
| B | Core in one language + generated bindings (e.g. from OpenAPI/IDL) | Multi-language SDKs for an API | Generator maintenance |
| C | Native core (Rust/C) + language bindings | Performance-critical | Build matrix complexity |

Must cover: SemVer policy, supported runtime versions, API docs generation, minimal dependencies, license compatibility.

## Red flags to call out

- Microservices or Kubernetes for a solo/Lite project without a stated reason.
- Two or more new languages for a beginner.
- Self-hosting databases without backups and an owner.
- Storing card data, health data, or passwords yourself when a provider can.
- Choosing a framework only because it is trending, with no team experience and a near deadline.
- Building auth from scratch.
- A free tier as the only plan for something users depend on.

When you see one, say it plainly, explain the risk in one sentence, and offer a safer option. The user may still choose; record the decision and the risk (R-xx).
