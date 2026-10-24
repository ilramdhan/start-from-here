# Discovery question bank

The heart of the interview. Use it in Phase 2. Do NOT ask every question. Select by tier, skip by the adaptive rules, and cap each round at the size for the experience mode (beginner 4–5, intermediate 5–6, expert up to 7).

## How to read an entry

```
**ID** [tiers] Question
- Why: one line · Default: recommended answer · Feeds: docs
```

- **Tiers:** `L` Lite, `S` Standard, `E` Enterprise. Ask a question only if the current tier is listed.
- **Default:** offer it as "Recommended: …" (beginner/intermediate) or "Default: …" (expert). If the user accepts a default without thinking about it, record it as `> **ASSUMPTION:**` in DISCOVERY.md.
- `[ASK]` in a default means there is no safe default — the user MUST answer or it becomes `[TBD]`.
- **Feeds** uses short names: DISC (DISCOVERY), PRD, FLOW (APP_FLOW), DS (DESIGN_SYSTEM), TRD, ARCH (ARCHITECTURE), ADR, DB (DATABASE), API, SEC (SECURITY_ARCHITECTURE), TEST (TESTING), OPS (OPERATIONS), STYLE (CODE_STYLE), GIT (GIT_WORKFLOW), AIG (AI_GUIDELINES), PLAN (IMPLEMENTATION_PLAN), TOS, PRIV, COOKIE, COMP (COMPLIANCE), MSA, DPA, BAA, README, LIC (LICENSE), CONTRIB, COC, VULN (root SECURITY.md), SUPPORT, A11Y (ACCESSIBILITY.md), GH (.github/*), AGENTS.

## Phrasing rules

1. Beginners: rephrase into plain words and offer 2–4 lettered choices where possible. Explain any term (see `experience-modes.md` glossary).
2. Experts: you MAY merge several related questions into one line ("Auth: provider, MFA, SSO? Default: managed auth, TOTP MFA optional, no SSO").
3. If an answer is inferable from earlier answers or the repo, state the inference and ask for confirmation instead of asking from scratch.
4. Never ask for secrets or credentials. Ask only for names of services and who owns the account.

---

## Round plans per tier

### Lite — ~3 rounds, 15–25 questions

| Round | Domains | Typical questions |
|---|---|---|
| 0 | Calibration | language, experience, idea, size signals (counts toward total) |
| 1 | Vision, users, scope | VIS-01, VIS-02, VIS-04, USR-01, USR-03, SCO-01, SCO-02, SCO-03, PLT-01 |
| 2 | Data, stack, security | DAT-01, DAT-02, PLT-02, PLT-03, PLT-05, IDN-01, IDN-02, PRV-01 |
| 3 | Ops, OSS/legal, constraints | OPS-01, OPS-03, OSS-01, LEG-01, TIM-01, TIM-02, TEA-05, TEA-06 |
| 3b (only if triggered) | Public / app-store / personal data | USR-07, LEG-02, OSS-04, OSS-09 |

### Standard — ~5 rounds, 35–60 questions

| Round | Domains |
|---|---|
| 0 | Calibration |
| 1 | Vision & problem, Business model |
| 2 | Users & personas, Journeys, Scope & features |
| 3 | Content & data, Non-functional, Accessibility & i18n, Design (if UI) |
| 4 | Platform & stack, Architecture & integrations, Security & identity, Privacy & compliance, AI/ML (if any) |
| 5 | Operations, Observability, Team & process, Open source, Legal, Timeline & risks |

### Enterprise — 7+ rounds, 60–110 questions

| Round | Domains |
|---|---|
| 0 | Calibration (+ stakeholders and approvers) |
| 1 | Vision & problem, Business model & market |
| 2 | Users & personas, Journeys |
| 3 | Scope & features, Content & data |
| 4 | Non-functional, Accessibility & i18n, Design & brand |
| 5 | Platform & stack, Architecture & integrations |
| 6 | Security & identity, Privacy & compliance, AI/ML |
| 7 | Operations, Observability & support |
| 8 | Team & process, Open source, Legal & licensing, Timeline/budget/risks |

Split a round in two if more questions remain than the round size allows (beginner 4–5, intermediate 5–6, expert up to 7 — see `experience-modes.md`). Round counts above are typical, not fixed: a beginner Lite run usually takes 4–5 short rounds.

---

## Adaptive-skip logic

Evaluate these flags after Round 0 and after each round. Record flags in STATE.md.

| Condition | Skip or reduce |
|---|---|
| No user interface (CLI, library, API-only, embedded headless) | Skip DES-*, ACC-02..06; ask ACC-01 only for CLI output/docs; DESIGN_SYSTEM, ACCESSIBILITY skipped; APP_FLOW becomes command/endpoint inventory |
| No stored data (stateless tool, static site without forms) | Skip DAT-03..10, most of DB; DATABASE skipped |
| No personal data | PRV-* reduced to PRV-01 confirmation; PRIVACY_POLICY skipped unless analytics/cookies/crash reporting exist or the app ships through an app store (stores require a policy URL) |
| No accounts / sign-in | Skip IDN-02..06 (keep IDN-01 confirmation); TERMS_OF_SERVICE usually skipped |
| No API exposed to others | Skip ARC-05..07; API.md skipped unless internal API between components matters (Standard+) |
| No AI/ML features | Skip all AIM-* |
| Not open source | Skip OSS-02..08; CODE_OF_CONDUCT skipped; CONTRIBUTING internal-only |
| Open source | Ask OSS-* fully even in Lite (short) |
| Solo developer | Skip TEA-02..06; GIT_WORKFLOW minimal; CODEOWNERS single owner |
| Internal tool only | Skip BIZ-*, reduce LEG-*, TOS skipped |
| Regulated data (health, payment, children, finance, education) | Force PRV-*, CMP-*, IDN-* fully; propose Enterprise |
| Consumer-only product (B2C, no business customers) | Skip CMP-06/07 after confirming; MSA and DPA skipped (CMP-08 still asked if health data) |
| Library / SDK | Replace journeys with "developer usage scenarios"; ask PLT-08 (distribution), OSS-* |
| Game | Ask DES-* as art direction; JRN-* as gameplay loop; skip BIZ-04 unless monetized |
| Embedded / IoT | Ask PLT-09 (hardware), OPS-08 (OTA updates), IDN-09 (device identity) |
| Brownfield | Skip anything answered by inspection; ask to confirm extracted facts instead |
| User said "use your recommendations" | Apply defaults for that round; record as ASSUMPTION; do not re-ask |

---

## 1. Vision & problem (VIS)

**VIS-01** [L S E] What problem does this project solve, and for whom?
- Why: everything else is derived from the problem · Default: [ASK] · Feeds: DISC, PRD, README

**VIS-02** [L S E] How do people deal with this problem today (workaround, competitor, nothing)?
- Why: shows what "better" must beat · Default: "manual / spreadsheets / existing tool X" — [ASK] · Feeds: PRD

**VIS-03** [S E] Why now? What changed that makes this worth building?
- Why: clarifies urgency and positioning · Default: skip for personal projects · Feeds: PRD

**VIS-04** [L S E] What does success look like in 3–6 months? Name one measurable signal.
- Why: gives the PRD a success metric · Default: "N weekly active users" or "replaces process X for the team" · Feeds: PRD, TRD

**VIS-05** [L S E] What is the project name (working title is fine)?
- Why: used in every doc header · Default: a working title derived from the idea, marked PROPOSAL · Feeds: all

**VIS-06** [S E] Describe the product in one sentence for a stranger (elevator pitch).
- Why: becomes README tagline and PRD summary · Default: draft one for approval · Feeds: README, PRD

**VIS-07** [S E] What is the long-term vision beyond the first release?
- Why: prevents architecture that blocks the roadmap · Default: "keep MVP focused; revisit after launch" · Feeds: PRD, ARCH

**VIS-08** [E] Who are the stakeholders and who has final approval on scope?
- Why: sets document owners and approval flow · Default: [ASK] · Feeds: DISC, all headers

---

## 2. Business model & market (BIZ)

**BIZ-01** [S E] Is this personal, internal, commercial, non-profit, or open-source community?
- Why: drives legal docs, licensing, and depth · Default: inferred from Round 0 · Feeds: PRD, LEG

**BIZ-02** [S E] How will it make money, if at all (subscription, one-time, ads, usage-based, free)?
- Why: affects payments, billing, and compliance · Default: "free for MVP; decide later" · Feeds: PRD, TRD, TOS

**BIZ-03** [E] Who are the main competitors or alternatives, and how will you differ?
- Why: sharpens scope and differentiators · Default: [TBD] · Feeds: PRD

**BIZ-04** [S E] Will you take payments in the product? Which provider, if known?
- Why: PCI DSS scope and integration · Default: "hosted checkout from a payment provider (no card data on our servers)" · Feeds: TRD, ARCH, SEC, COMP, TOS

**BIZ-05** [E] What markets/countries will you sell into first?
- Why: legal regimes, currency, tax, language · Default: links to PRV-03 · Feeds: PRD, COMP, PRIV

**BIZ-06** [E] Are there pricing tiers or plan-based feature limits?
- Why: entitlements affect data model and authZ · Default: "single plan for MVP" · Feeds: PRD, DB, SEC

---

## 3. Users & personas (USR)

**USR-01** [L S E] Who are the primary users? Describe 1–3 types (role, context, skill).
- Why: becomes personas P-xx · Default: one primary persona derived from VIS-01 · Feeds: PRD, FLOW, DS

**USR-02** [S E] Are there secondary users (admins, moderators, support staff, API consumers)?
- Why: often forgotten roles cause permission gaps · Default: "one admin role (you)" · Feeds: PRD, SEC

**USR-03** [L S E] How many users do you expect at launch and in one year?
- Why: sizes infrastructure and NFRs · Default: "<100 at launch, <10k in a year" · Feeds: TRD, ARCH, OPS

**USR-04** [S E] What devices and contexts do users use (desktop at work, phone on the go, low bandwidth)?
- Why: drives platform and responsive design · Default: "mobile-friendly web" · Feeds: PRD, DS, TRD

**USR-05** [S E] Are users individuals, teams/organizations, or both (multi-tenant)?
- Why: tenancy is the hardest thing to change later · Default: "individuals; organizations later" · Feeds: DB, SEC, ARCH

**USR-06** [E] Any users with special needs (assistive technology, low literacy, older adults)?
- Why: accessibility and content design · Default: "design for WCAG 2.2 AA" · Feeds: DS, A11Y

**USR-07** [L S E] (L: only if public or app-store) Can minors use the product? Under 13? Under 16?
- Why: COPPA / GDPR-K triggers · Default: "no, 16+ only, stated in Terms" · Feeds: PRIV, TOS, COMP

---

## 4. User journeys & flows (JRN)

**JRN-01** [L S E] Walk me through the single most important thing a user does, step by step.
- Why: the core journey defines MVP · Default: draft from VIS-01 for approval · Feeds: PRD, FLOW, TEST

**JRN-02** [S E] What are the 2–4 other key journeys (sign-up, settings, sharing, admin tasks)?
- Why: completes the flow inventory · Default: sign-up/sign-in, core action, view history, settings · Feeds: PRD, FLOW

**JRN-03** [S E] How does a user first arrive and get started (onboarding)?
- Why: first-run experience is often skipped · Default: "sign up → short empty-state guide" · Feeds: FLOW, DS

**JRN-04** [S E] What should happen when things go wrong (offline, error, no permission, empty data)?
- Why: error and empty states must be designed · Default: "clear message + retry; empty states with next action" · Feeds: FLOW, DS, TEST

**JRN-05** [E] Are there approval workflows, multi-step processes, or state machines (draft → review → published)?
- Why: state models drive DB and API · Default: [ASK if hinted] · Feeds: FLOW, DB, API

**JRN-06** [S E] Do users receive notifications (email, push, in-app, SMS)? For which events?
- Why: adds providers, consent, and templates · Default: "transactional email only" · Feeds: PRD, TRD, ARCH, PRIV

**JRN-07** [L] (CLI/API/library) What commands, endpoints, or functions will users call first?
- Why: replaces screens for non-UI products · Default: draft list for approval · Feeds: FLOW, API

---

## 5. Scope & features (SCO)

**SCO-01** [L S E] List the features you want. Which ones are absolutely required for the first release?
- Why: produces F-xx with MoSCoW priority · Default: propose a cut keeping only the core journey as Must · Feeds: PRD, PLAN

**SCO-02** [L S E] What is explicitly NOT in the first release?
- Why: out-of-scope list prevents scope creep by AI agents · Default: "payments, mobile app, admin analytics — later" (adapt) · Feeds: PRD, AGENTS

**SCO-03** [L S E] What type of product is it: web app, mobile app, desktop, CLI, API, library, game, embedded, data/ML?
- Why: picks archetype and doc applicability · Default: inferred · Feeds: all

**SCO-04** [S E] For each Must feature, what does "done" look like from the user's view?
- Why: acceptance criteria (Given/When/Then) · Default: draft criteria for approval · Feeds: PRD, TEST

**SCO-05** [S E] Is there a fixed launch scope (e.g. a demo, a customer contract)?
- Why: hard constraints override prioritization · Default: "no" · Feeds: PRD, PLAN

**SCO-06** [E] Which features are regulated, contractual, or audited?
- Why: traceability requirements · Default: [ASK] · Feeds: PRD, COMP, TEST

**SCO-07** [S E] Do you need an admin area or back-office?
- Why: frequently forgotten, needs authZ · Default: "minimal admin via database tool for MVP; UI later" · Feeds: PRD, FLOW, SEC

**SCO-08** [S E] Do you need search, filtering, import/export, or reporting?
- Why: affects data design and indexes · Default: "basic filtering only" · Feeds: PRD, DB, API

---

## 6. Content & data (DAT)

**DAT-01** [L S E] What information will the product store? List the main "things" (e.g. users, projects, orders).
- Why: becomes entities · Default: draft from features · Feeds: DB, PRD

**DAT-02** [L S E] Does it store any personal data (names, emails, location, photos, IP addresses)?
- Why: triggers privacy work · Default: "email + name if accounts exist" · Feeds: DB, SEC, PRIV, COMP

**DAT-03** [S E] Who owns each kind of data (the user, an organization, the system)?
- Why: ownership drives access rules · Default: "users own their content; admins can view for support" · Feeds: DB, SEC

**DAT-04** [S E] How long should data be kept, and what happens on account deletion?
- Why: retention and right-to-erasure · Default: "delete personal data within 30 days of account deletion; keep anonymized aggregates" · Feeds: DB, PRIV, OPS

**DAT-05** [S E] Will users upload files (images, documents, video)? Size limits?
- Why: storage, scanning, cost · Default: "images ≤10 MB, stored in object storage" · Feeds: ARCH, DB, SEC

**DAT-06** [S E] Do you need to import existing data or migrate from another system?
- Why: migration tasks and mapping · Default: "no" · Feeds: DB, PLAN

**DAT-07** [E] Data classification: which data is public, internal, confidential, restricted?
- Why: controls depend on class · Default: propose a 4-level scheme · Feeds: SEC, DB, COMP

**DAT-08** [S E] Is any data highly sensitive (health, financial, biometric, government ID, children's)?
- Why: regulatory triggers · Default: "no" — confirm · Feeds: SEC, COMP, PRIV

**DAT-09** [E] Where must data physically reside (data residency)?
- Why: hosting region and transfers · Default: "region closest to most users" · Feeds: OPS, COMP, ARCH

**DAT-10** [S E] Who creates the content: users, your team (CMS), or imported feeds?
- Why: moderation and content model · Default: inferred · Feeds: PRD, DB, TOS

**DAT-11** [E] Do you need audit logs of who changed what?
- Why: compliance and support · Default: "yes for admin and permission changes" · Feeds: DB, SEC, OPS

---

## 7. Non-functional requirements (NFR)

**NFR-Q01** [S E] How fast should key actions feel? (Target response time.)
- Why: NFR with a number · Default: "p95 < 500 ms for API calls; first page load < 2.5 s LCP on 4G" · Feeds: TRD, TEST, OPS

**NFR-Q02** [S E] How much downtime is acceptable? (Availability target.)
- Why: sets SLOs and architecture redundancy · Default: "99.5% monthly for MVP (≈3.6 h downtime/month)" · Feeds: TRD, OPS

**NFR-Q03** [S E] Expected peak load (requests/sec, concurrent users, data volume in a year)?
- Why: capacity planning · Default: derived from USR-03; "≤50 req/s peak, <10 GB data year one" · Feeds: TRD, ARCH

**NFR-Q04** [S E] Must it work offline or on poor connections?
- Why: offline sync is a major architecture choice · Default: "no; show a clear offline message" · Feeds: TRD, ARCH, FLOW

**NFR-Q05** [E] Recovery targets: how much data can you lose (RPO) and how fast must you recover (RTO)?
- Why: backup and DR design · Default: "RPO 24 h, RTO 8 h for MVP" · Feeds: OPS, TRD

**NFR-Q06** [E] Scalability expectations: growth spikes, seasonal peaks, multi-region?
- Why: avoids over/under-engineering · Default: "single region, vertical scaling first" · Feeds: ARCH, ADR

**NFR-Q07** [S E] Supported browsers, OS versions, or devices?
- Why: test matrix · Default: "last 2 versions of major evergreen browsers; iOS/Android versions still supported by vendors" · Feeds: TRD, TEST

**NFR-Q08** [E] Reliability requirements for background jobs (exactly-once, retries, ordering)?
- Why: queue and idempotency design · Default: "at-least-once with idempotent handlers" · Feeds: ARCH, TRD

**NFR-Q09** [L] (Lite merged) Any performance or uptime expectation at all?
- Why: Lite keeps one line of NFRs · Default: "best effort; no SLA" · Feeds: PRD, ARCH

---

## 8. Platform & stack (PLT)

**PLT-01** [L S E] Do you already have a preferred or required language, framework, or platform?
- Why: respect existing skills and constraints · Default: "no preference — recommend one" · Feeds: ARCH, ADR, STYLE

**PLT-02** [L S E] Which languages/tools do you (or your team) know well?
- Why: never recommend what the team can't maintain · Default: [ASK] (beginner: "none" is a valid answer) · Feeds: ARCH, ADR

**PLT-03** [L S E] Where would you like to host it (managed platform, a cloud provider, your own server, app stores, package registry)?
- Why: deploy target shapes the stack · Default: "managed platform with free/low tier" · Feeds: ARCH, OPS

**PLT-04** [S E] Any company-mandated cloud, database, or vendor?
- Why: hard constraint · Default: "none" · Feeds: ARCH, ADR

**PLT-05** [L S E] What is your monthly infrastructure budget?
- Why: rules out expensive options · Default: "≤ $25/month for MVP" (state currency) · Feeds: ARCH, OPS

**PLT-06** [S E] Mobile: native per platform, cross-platform, or mobile web/PWA?
- Why: largest cost driver for mobile · Default: "PWA or cross-platform unless device APIs are central" · Feeds: ARCH, ADR

**PLT-07** [S E] Preferred database style (relational, document, key-value), or should I recommend?
- Why: data model fit · Default: "relational (PostgreSQL-compatible) — most flexible" · Feeds: DB, ARCH, ADR

**PLT-08** [S E] (Library/CLI) How will it be distributed (npm, PyPI, crates.io, Homebrew, binaries, container)?
- Why: release pipeline · Default: the language's main registry · Feeds: OPS, README, GIT

**PLT-09** [S E] (Embedded/IoT) Target hardware, OS/RTOS, connectivity, power constraints?
- Why: drives toolchain and update strategy · Default: [ASK] · Feeds: ARCH, OPS

**PLT-10** [E] Any approved-technology list, architecture review board, or standards to follow?
- Why: governance constraints · Default: "none" · Feeds: ARCH, ADR, STYLE

---

## 9. Architecture & integrations (ARC)

**ARC-01** [S E] Which external services must it integrate with (payments, email, maps, CRM, SSO, analytics)?
- Why: trust boundaries, secrets, costs · Default: "transactional email only" · Feeds: TRD, ARCH, SEC, PRIV

**ARC-02** [S E] Preferred architecture style: single deployable (monolith), modular monolith, services, serverless?
- Why: major ADR · Default: "modular monolith" · Feeds: ARCH, ADR

**ARC-03** [S E] Real-time needs (live updates, chat, collaboration)?
- Why: WebSockets/SSE and state sync · Default: "no; refresh/poll is fine" · Feeds: ARCH, TRD

**ARC-04** [S E] Background work (scheduled jobs, queues, long tasks)?
- Why: workers and retries · Default: "simple scheduled jobs only" · Feeds: ARCH, OPS

**ARC-05** [S E] Will you expose an API to third parties or other apps?
- Why: API contract, versioning, keys · Default: "internal API only" · Feeds: API, SEC

**ARC-06** [S E] API style: REST, GraphQL, gRPC, or framework-native?
- Why: contract conventions · Default: "REST + JSON with OpenAPI" · Feeds: API, ADR

**ARC-07** [E] API versioning and deprecation policy?
- Why: consumers need stability · Default: "URL major version /v1; 6-month deprecation notice" · Feeds: API

**ARC-08** [E] Event-driven integration or webhooks needed?
- Why: delivery guarantees, signatures · Default: "no" · Feeds: ARCH, API, SEC

**ARC-09** [E] Which existing internal systems does it depend on, and who owns them?
- Why: cross-team dependencies are risks · Default: [ASK] · Feeds: ARCH, PLAN, R-xx

---

## 10. Security & identity (IDN)

**IDN-01** [L S E] Do users need to sign in? How (email+password, magic link, social login, SSO, passkeys)?
- Why: auth design · Default: "managed auth provider with email magic link + one social login" · Feeds: SEC, ARCH, FLOW

**IDN-02** [L S E] What roles exist and what can each do?
- Why: authorization matrix · Default: "user (own data), admin (all data)" · Feeds: SEC, DB, API, TEST

**IDN-03** [S E] Should multi-factor authentication be offered or required?
- Why: account takeover risk · Default: "optional for users, required for admins" · Feeds: SEC

**IDN-04** [S E] Session policy: how long stay signed in; sign out everywhere?
- Why: session lifetime and revocation · Default: "30-day refresh, revocable sessions" · Feeds: SEC

**IDN-05** [E] Enterprise SSO (SAML/OIDC) and SCIM provisioning required?
- Why: B2B enterprise requirement · Default: "not for MVP" · Feeds: SEC, ARCH

**IDN-06** [S E] Who on the team holds production access and account ownership for services?
- Why: secrets ownership and least privilege · Default: "founder/lead only; documented in OPS" · Feeds: SEC, OPS

**IDN-07** [S E] Where will secrets be stored (platform env vars, secret manager)?
- Why: never in code · Default: "hosting platform's encrypted environment variables" · Feeds: SEC, OPS, AIG

**IDN-08** [E] Known threat actors or abuse cases (spam, scraping, fraud, insider)?
- Why: STRIDE threat model input · Default: "spam sign-ups and credential stuffing" · Feeds: SEC

**IDN-09** [E] (IoT) How do devices authenticate and receive updates securely?
- Why: device identity and signed firmware · Default: [ASK] · Feeds: SEC, OPS

**IDN-10** [S E] Rate limiting and abuse protection needs?
- Why: protects auth and costly endpoints · Default: "rate-limit auth and write endpoints" · Feeds: SEC, API

**IDN-11** [E] Security testing expectations (SAST, dependency scanning, pen test before launch)?
- Why: TEST and OPS plans · Default: "dependency + secret scanning in CI; pen test before GA" · Feeds: TEST, OPS, COMP

---

## 11. Privacy & compliance (PRV / CMP)

**PRV-01** [L S E] Confirm: which personal data will you collect, and why each item is needed?
- Why: data minimization and privacy policy · Default: list from DAT-02 · Feeds: PRIV, DB, SEC

**PRV-02** [S E] Will you use analytics, tracking cookies, or ads?
- Why: consent banners, cookie policy · Default: "privacy-friendly analytics without cookies" · Feeds: COOKIE, PRIV, ARCH

**PRV-03** [L S E] Where are your users located (countries/states)?
- Why: GDPR, CCPA, LGPD, PIPEDA, UU PDP, PDPA triggers · Default: [ASK] · Feeds: COMP, PRIV, OPS

**PRV-04** [S E] Will you share data with third parties (sub-processors, partners)?
- Why: disclosure and DPAs · Default: "only service providers listed in PRIV" · Feeds: PRIV, COMP

**PRV-05** [S E] How will users access, export, or delete their data?
- Why: data subject rights · Default: "self-service export and delete in settings; email fallback" · Feeds: PRD, PRIV, DB

**CMP-01** [S E] Does the product handle health data, payment card data, children's data, student records, or financial data?
- Why: HIPAA, PCI DSS, COPPA, FERPA, financial rules · Default: "no" — confirm explicitly · Feeds: COMP, SEC

**CMP-02** [E] Do customers expect SOC 2 or ISO 27001 (or similar) attestations?
- Why: control design from day one · Default: "not now; design controls to be audit-ready" · Feeds: COMP, OPS, SEC

**CMP-03** [E] Who is responsible for privacy/compliance (DPO, legal counsel)?
- Why: owners in COMPLIANCE register · Default: [ASK] · Feeds: COMP

**CMP-04** [E] Any industry-specific regulation (finance, telecom, government, energy)?
- Why: sector rules · Default: [ASK] · Feeds: COMP

**CMP-05** [S E] Does it use encryption beyond standard HTTPS or ship to sanctioned regions?
- Why: export control · Default: "standard TLS only" · Feeds: COMP

**CMP-06** [S E] Do you sell to businesses (B2B) under order forms or negotiated contracts, rather than only click-through terms?
- Why: triggers MASTER_SERVICES_AGREEMENT (`B2B` condition) · Default: inferred from BIZ-01/BIZ-02 — confirm · Feeds: MSA, TOS, COMP

**CMP-07** [S E] Will you store or process personal data on behalf of business customers (their employees, users, or clients), acting as their processor / service provider?
- Why: GDPR Art. 28 requires a controller–processor contract; triggers DATA_PROCESSING_AGREEMENT (`processor` condition) · Default: "yes" if CMP-06 is yes and customers upload or sync personal data — confirm · Feeds: DPA, PRIV, COMP

**CMP-08** [S E] (ask if CMP-01 mentions health data) Will you create, receive, store, or transmit protected health information (PHI) for HIPAA covered entities (providers, health plans, clearinghouses) or their business associates?
- Why: 45 CFR 164.504(e) requires a business associate contract; triggers BUSINESS_ASSOCIATE_AGREEMENT (`PHI` condition) and the regulated-data override · Default: [ASK] · Feeds: BAA, COMP, SEC, OPS

---

## 12. AI/ML features (AIM) — ask only if the product uses AI

**AIM-01** [L S E] What does the AI feature do for the user (generate, summarize, classify, recommend, chat, agent actions)?
- Why: risk class and architecture · Default: [ASK] · Feeds: PRD, TRD, ARCH

**AIM-02** [S E] Which model provider(s) or self-hosted model? Any preference?
- Why: cost, data use, lock-in · Default: "hosted API behind an internal adapter so the provider can change" · Feeds: ARCH, ADR, PRIV

**AIM-03** [S E] What user data is sent to the model, and may the provider retain or train on it?
- Why: privacy and contracts · Default: "minimize; use provider settings with no training on customer data" · Feeds: PRIV, SEC, COMP

**AIM-04** [S E] How will you evaluate output quality (test sets, human review, metrics)?
- Why: AI features need evals like tests · Default: "small golden test set + manual review before release" · Feeds: TEST, TRD

**AIM-05** [S E] What could go wrong (wrong answers, harmful output, prompt injection, cost spikes)? Guardrails?
- Why: threat model for AI · Default: "output filtering, rate/cost limits, treat retrieved content as untrusted" · Feeds: SEC, OPS

**AIM-06** [E] Does the AI make or support decisions about people (hiring, credit, education, health)?
- Why: EU AI Act high-risk categories · Default: "no" — confirm · Feeds: COMP

**AIM-07** [S E] Retrieval over your own content (RAG)? What sources, how fresh?
- Why: vector store and ingestion pipeline · Default: "no for MVP" · Feeds: ARCH, DB

**AIM-08** [E] Must users be told they are interacting with AI or that content is AI-generated?
- Why: transparency obligations · Default: "yes, label AI output" · Feeds: PRD, DS, COMP

---

## 13. Accessibility & i18n (ACC / I18N)

**ACC-01** [L S E] Accessibility target?
- Why: legal and ethical baseline · Default: "WCAG 2.2 Level AA" · Feeds: DS, A11Y, TEST

**ACC-02** [S E] Must you meet a specific law or customer requirement (ADA, Section 508, EN 301 549, European Accessibility Act)?
- Why: conformance claims and VPAT · Default: "no specific mandate; follow WCAG 2.2 AA" · Feeds: A11Y, COMP

**ACC-03** [S E] How will accessibility be checked (automated checks, keyboard tests, screen reader tests)?
- Why: TEST plan · Default: "automated checks in CI + manual keyboard pass per release" · Feeds: TEST

**I18N-01** [L S E] Which languages must the product support at launch? Later?
- Why: i18n architecture is costly to retrofit · Default: "one language at launch; externalize strings from day one" · Feeds: PRD, TRD, STYLE

**I18N-02** [S E] Right-to-left scripts, multiple currencies, time zones, date formats?
- Why: formatting and layout · Default: "store UTC; format per user locale" · Feeds: TRD, DS, DB

---

## 14. Design & brand (DES) — skip if no UI

**DES-01** [S E] Do you have a brand (logo, colors, fonts) or design files?
- Why: tokens source of truth · Default: "no — propose a neutral palette and system font stack" · Feeds: DS

**DES-02** [S E] Name 1–3 products whose look or feel you like, and what to borrow.
- Why: concrete design direction · Default: [ASK] (beginner: offer 3 styles to pick) · Feeds: DS

**DES-03** [S E] Three adjectives for the feel (e.g. calm, playful, professional).
- Why: tone of UI and copy · Default: "clear, friendly, trustworthy" · Feeds: DS

**DES-04** [S E] Use a ready-made component library or a custom design?
- Why: speed vs uniqueness · Default: "established accessible component library, themed" · Feeds: DS, ARCH

**DES-05** [S E] Light mode, dark mode, or both?
- Why: token design · Default: "both, follow system setting" · Feeds: DS

**DES-06** [E] Is there a corporate design system that must be followed?
- Why: governance · Default: "no" · Feeds: DS

**DES-07** [S E] Voice and tone for UI text (formal/informal, "you"/"we")?
- Why: consistent microcopy · Default: "plain, friendly, second person" · Feeds: DS

---

## 15. Operations, deploy, hosting & budget (OPS)

**OPS-01** [L S E] How should code get to production (manual, automatic on merge, release tags)?
- Why: CI/CD design · Default: "automatic deploy from main after CI passes" · Feeds: OPS, GIT

**OPS-02** [S E] Which environments do you need (local, preview, staging, production)?
- Why: environment matrix · Default: "local + preview per PR + production" · Feeds: OPS

**OPS-03** [L S E] How will you back up data and how often?
- Why: data loss prevention · Default: "managed daily backups, 7-day retention, test a restore monthly" · Feeds: OPS, DB

**OPS-04** [S E] How will you roll back a bad release?
- Why: recovery plan · Default: "redeploy previous build; backward-compatible migrations" · Feeds: OPS

**OPS-05** [S E] Which CI service will you use?
- Why: verified commands later · Default: "the CI built into your code host" · Feeds: OPS, GIT

**OPS-06** [E] Infrastructure as code required?
- Why: reproducibility and audit · Default: "yes for Enterprise" · Feeds: OPS, ARCH

**OPS-07** [E] Change management: approvals before production deploys?
- Why: compliance controls · Default: "PR approval + protected main" · Feeds: OPS, GIT, COMP

**OPS-08** [S E] (Mobile/desktop/IoT) How are updates delivered (store review, auto-update, OTA)?
- Why: release cadence · Default: platform default · Feeds: OPS

---

## 16. Observability & support (OBS)

**OBS-01** [S E] How will you know it's broken (error tracking, uptime checks, logs)?
- Why: observability plan · Default: "error tracking + uptime ping + structured logs" · Feeds: OPS

**OBS-02** [S E] Who responds to incidents, and when (business hours, 24/7)?
- Why: on-call and SLOs · Default: "business hours, best effort" · Feeds: OPS, SUPPORT

**OBS-03** [S E] How do users get help (email, issue tracker, chat, docs)?
- Why: SUPPORT.md and issue templates · Default: "GitHub issues (OSS) or a support email" · Feeds: SUPPORT, GH, README

**OBS-04** [E] Do you need SLAs with customers? Status page?
- Why: contractual SLOs · Default: "no SLA for MVP" · Feeds: OPS, TOS

**OBS-05** [E] Log retention and what must never be logged?
- Why: privacy and cost · Default: "30 days; never log secrets, tokens, or full personal data" · Feeds: OPS, SEC

**OBS-06** [S E] Product analytics: which events matter?
- Why: success metrics measurement · Default: "events for VIS-04 metric only" · Feeds: PRD, PRIV

---

## 17. Team, process & ownership (TEA)

**TEA-01** [L S E] Who is building this (just you, a team, contractors, AI agents)?
- Why: process depth · Default: "solo + AI coding agent" · Feeds: GIT, AGENTS, CODEOWNERS

**TEA-02** [S E] Roles and owners: product, design, engineering, security, ops?
- Why: doc owners and CODEOWNERS · Default: "one person owns all" · Feeds: all headers, GH

**TEA-03** [S E] Branching and review style (trunk-based with short PRs, GitFlow, other)?
- Why: GIT_WORKFLOW · Default: "trunk-based, short-lived branches, PR review" · Feeds: GIT

**TEA-04** [S E] Commit message convention?
- Why: changelog automation · Default: "Conventional Commits" · Feeds: GIT, CHANGELOG

**TEA-05** [L S E] Which AI coding tools will you use (Claude Code, Codex, Cursor, Copilot, Gemini CLI, other)?
- Why: decide optional pointer files (CLAUDE.md, GEMINI.md, copilot-instructions) · Default: "AGENTS.md only" · Feeds: AGENTS, AIG

**TEA-06** [L S E] What may AI agents do without asking (run tests, add dependencies, edit migrations)?
- Why: AI_GUIDELINES boundaries · Default: "may run tests/linters; must ask before new dependencies, migrations, deletes, deploys" · Feeds: AIG, AGENTS

**TEA-07** [E] Required code review rules (number of approvals, security review for sensitive changes)?
- Why: governance · Default: "1 approval; security owner reviews auth/data changes" · Feeds: GIT, GH

**TEA-08** [S E] Code style preferences or existing linters/formatters?
- Why: CODE_STYLE · Default: "the ecosystem's standard formatter and linter" · Feeds: STYLE

---

## 18. Open source & community (OSS)

**OSS-01** [L S E] Will the code be open source, source-available, or private?
- Why: license, community files · Default: [ASK] (beginner: explain options) · Feeds: LIC, README, CONTRIB

**OSS-02** [L S E] (OSS) Do you want outside contributions? What kind?
- Why: CONTRIBUTING depth · Default: "issues and small PRs welcome" · Feeds: CONTRIB, GH

**OSS-03** [S E] (OSS) Code of conduct?
- Why: community standards · Default: "Contributor Covenant 2.1 by reference (3.0 available as an option)" · Feeds: COC

**OSS-04** [L S E] (OSS or public; L only if SECURITY.md is generated) How should people report security vulnerabilities privately?
- Why: SECURITY.md · Default: "private vulnerability reporting on the code host + a security email" · Feeds: VULN

**OSS-05** [S E] (OSS) Require a DCO sign-off or CLA from contributors?
- Why: IP provenance · Default: "DCO sign-off; no CLA" · Feeds: CONTRIB

**OSS-06** [S E] (OSS) Versioning and release cadence?
- Why: SemVer and CHANGELOG · Default: "SemVer, release when ready" · Feeds: GIT, CHANGELOG

**OSS-07** [E] (OSS) Governance model (BDFL, maintainers council, foundation)?
- Why: decision rights · Default: "maintainer-led" · Feeds: CONTRIB

**OSS-09** [L S E] (L: only if a doc needs repo links) Where will the repository live: code host, owner/org name, repository name, default branch?
- Why: fills `{{github_owner}}`, `{{repo_name}}`, `{{default_branch}}` in .github templates and README links · Default: "GitHub, <your user>, <project-slug>, main" · Feeds: GH, README, CONTRIB

**OSS-08** [S E] (OSS) Issue labels, triage process, and response expectations?
- Why: GH config · Default: "triage weekly; good-first-issue label" · Feeds: GH, CONTRIB

---

## 19. Legal & licensing (LEG)

**LEG-01** [L S E] Which license? (Or should I recommend one?)
- Why: legal use of the code · Default: OSS → "MIT (permissive)"; private → "proprietary, all rights reserved" · Feeds: LIC, README

**LEG-02** [L S E] (L: only if a legal doc is generated) Legal entity name and contact for Terms and Privacy Policy?
- Why: legal doc parties · Default: [ASK] → `[TBD]` · Feeds: TOS, PRIV

**LEG-03** [S E] Governing law/jurisdiction for Terms?
- Why: legal draft · Default: [ASK] → `[TBD: counsel]` · Feeds: TOS

**LEG-04** [S E] Third-party content or assets (fonts, icons, images, datasets, models) and their licenses?
- Why: license compatibility · Default: "use only permissively licensed assets; record in README credits" · Feeds: README, LIC, COMP

**LEG-05** [E] Trademarks to check or protect?
- Why: naming risk · Default: "check name availability before launch" · Feeds: R-xx

**LEG-07** [S E] (EU market) Is the software sold or monetized in the EU, and do users post content others can see?
- Why: Cyber Resilience Act and Digital Services Act triggers · Default: "no" — confirm · Feeds: COMP, TOS, OPS

**LEG-06** [S E] User-generated content: who owns it, what license do you need from users, moderation rules?
- Why: Terms content · Default: "users keep ownership; grant license to host/display" · Feeds: TOS

---

## 20. Timeline, budget & risks (TIM)

**TIM-01** [L S E] Is there a deadline or target launch date?
- Why: milestone planning · Default: "no fixed date" · Feeds: PLAN

**TIM-02** [L S E] How much time per week can you (the team) spend?
- Why: realistic milestone sizing · Default: [ASK] · Feeds: PLAN

**TIM-03** [S E] Total budget for building and running in year one?
- Why: constrains vendors and scope · Default: [ASK] · Feeds: PLAN, ARCH

**TIM-04** [S E] What worries you most about this project?
- Why: surfaces risks R-xx · Default: [ASK] · Feeds: PLAN, PRD

**TIM-05** [E] Dependencies on other teams, vendors, or approvals?
- Why: critical path · Default: [ASK] · Feeds: PLAN

**TIM-06** [S E] What would make you cancel or pivot? (Kill criteria.)
- Why: honest success framing · Default: "skip" · Feeds: PRD

---

## Coverage check before leaving Phase 2

| Tier | Domains that MUST be answered or explicitly assumed |
|---|---|
| Lite | VIS, USR, SCO, DAT (if data), PLT, SEC (if accounts), PRV (if personal data), OPS-01/03, OSS-01, LEG-01, TIM-01/02 |
| Standard | All Lite + BIZ-01/02/04, JRN, NFR-Q01..Q03, ARC-01/02, ACC-01 (if UI), I18N-01, DES-01..04 (if UI), OBS-01..03, TEA-01..05, OSS-* (if OSS), AIM-* (if AI) |
| Enterprise | All domains with [E] tag after skips; every [ASK] item answered or a Q-xx with owner |
