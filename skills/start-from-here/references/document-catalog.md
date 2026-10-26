# Document catalog

One entry per output document. Read the entry before generating the document. Applicability per tier is in `tiering-and-doc-matrix.md`. Question IDs refer to `discovery-question-bank.md`.

Templates live at `assets/templates/<output path>`. If a template is missing, build the document from the "Must contain" list and `writing-conventions.md`.

Every document MUST: start with the status header; use IDs from DISCOVERY.md; have no `{{` placeholders, no `<!-- guidance` comments, no secrets; use relative links.

Generation rules shared by all documents:

1. **Links to docs that are not generated** (e.g. ACCESSIBILITY.md when there is no UI, `docs/legal/*` when no personal data): remove the link, or replace it with plain text `N/A — <reason>`. Never leave a link to a missing file.
2. **docs/README.md** lists every catalog doc for the tier; docs not generated get a row with status `N/A` and a reason.
3. **Test statuses** in TESTING.md start as `Not run`. Only the user or a real, observed run can change them.
4. **Commands** are written as "the command, or `Not configured`". A command is shown only if it is verified in the repo or approved by the user.
5. **ID prefixes** follow `writing-conventions.md` (F-, NFR-, P-, J-, AC-, KPI-, S-, OP-, TB-, TH-, AT-/SEC-/PERF-/A11Y- tests, SLO-, RB-, T-, M0–M7, G0–G5 phase gates, G- goals, A-, D-, Q-, R-, ADR-).

## Generation order summary

| # | Output path | Template |
|---|---|---|
| 1 | docs/DISCOVERY.md | assets/templates/docs/DISCOVERY.md |
| 2 | docs/product/PRD.md | assets/templates/docs/product/PRD.md |
| 3 | docs/product/APP_FLOW.md | assets/templates/docs/product/APP_FLOW.md |
| 4 | docs/product/DESIGN_SYSTEM.md | assets/templates/docs/product/DESIGN_SYSTEM.md |
| 5 | docs/technical/TRD.md | assets/templates/docs/technical/TRD.md |
| 6 | docs/technical/ARCHITECTURE.md | assets/templates/docs/technical/ARCHITECTURE.md |
| 7 | docs/decisions/README.md, 0001-record-architecture-decisions.md, NNNN-*.md | assets/templates/docs/decisions/README.md, …/0001-record-architecture-decisions.md, and …/adr-template.md for each new ADR (the template file itself is not copied) |
| 8 | docs/technical/DATABASE.md | assets/templates/docs/technical/DATABASE.md |
| 9 | docs/technical/API.md | assets/templates/docs/technical/API.md |
| 10 | docs/technical/SECURITY_ARCHITECTURE.md | assets/templates/docs/technical/SECURITY_ARCHITECTURE.md |
| 11 | docs/technical/TESTING.md | assets/templates/docs/technical/TESTING.md |
| 12 | docs/technical/OPERATIONS.md | assets/templates/docs/technical/OPERATIONS.md |
| 13 | docs/engineering/CODE_STYLE.md | assets/templates/docs/engineering/CODE_STYLE.md |
| 14 | docs/engineering/GIT_WORKFLOW.md | assets/templates/docs/engineering/GIT_WORKFLOW.md |
| 15 | docs/engineering/AI_GUIDELINES.md | assets/templates/docs/engineering/AI_GUIDELINES.md |
| 16 | docs/technical/IMPLEMENTATION_PLAN.md | assets/templates/docs/technical/IMPLEMENTATION_PLAN.md |
| 17 | docs/legal/TERMS_OF_SERVICE.md, PRIVACY_POLICY.md, COOKIE_POLICY.md, COMPLIANCE.md (+ conditional B2B: MASTER_SERVICES_AGREEMENT.md, DATA_PROCESSING_AGREEMENT.md, BUSINESS_ASSOCIATE_AGREEMENT.md) | assets/templates/docs/legal/<same> |
| 18 | README.md, LICENSE, CHANGELOG.md, CONTRIBUTING.md, CODE_OF_CONDUCT.md, SECURITY.md, SUPPORT.md, ACCESSIBILITY.md, .github/* (+ optional .github/dependabot.yml) | assets/templates/<same>; LICENSE from assets/templates/licenses/ guidance (README.md, MIT.txt, PROPRIETARY.txt — not copied into the project) |
| 19 | AGENTS.md (+ CLAUDE.md, GEMINI.md, .github/copilot-instructions.md) | assets/templates/<same> |
| 20 | docs/README.md | assets/templates/docs/README.md |
| — | docs/.start-from-here/HANDOVER.md (session mode only; process file, no status header, not listed in docs/README.md) | assets/templates/docs/.start-from-here/HANDOVER.md |

In session mode the order above is grouped into work packages WP1–WP9, one per fresh session; see `session-mode.md`.

---

## docs/DISCOVERY.md
- **Purpose:** Interview record and single source of truth for answers, decisions, assumptions, and open questions.
- **Inputs:** all answered questions (by ID), calibration, Phase 3 decisions.
- **Must contain:** summary; calibration (languages, experience, tier + reason); answers grouped by domain with question IDs; decisions table (D-xx, decided by, date, ADR link); assumptions (A-xx, also shown as ASSUMPTION blocks); compliance triggers; open questions (Q-xx, owner, blocking?); approved document list; change log.
- **Done when:** user approved the brief; every [ASK] question has an answer or a Q-xx; IDs P-xx/F-xx/NFR-xx/R-xx assigned.

## docs/product/PRD.md
- **Purpose:** What we build and why; the product contract.
- **Inputs:** VIS, BIZ, USR, JRN, SCO, NFR (summary), ACC-01, I18N-01, AIM-01, TIM-04/06; DISCOVERY.
- **Must contain:** problem & current workaround; goals and success metrics KPI-xx with targets and measurement; personas P-xx; key journeys J-xx; features F-xx table (user need, behavior, priority MoSCoW) with acceptance criteria AC-xx.y in Given/When/Then; out of scope; NFR summary (links to TRD NFR-xx); assumptions; risks R-xx; open questions.
- **Done when:** every Must feature has ≥1 observable acceptance criterion; out of scope is explicit; metric has a target and method.

## docs/product/APP_FLOW.md
- **Purpose:** Inventory of screens (or commands/endpoints) and how users move through them.
- **Inputs:** JRN, SCO, IDN-01/02 (auth gates), NFR-Q04; PRD.
- **Must contain:** entry points; screen/command/endpoint inventory with S-xx ID, purpose, data needed, roles allowed, linked F-xx; journeys J-xx as primary and alternate flows in Mermaid `flowchart`; per-action trigger, validation, loading, success, error, next step; empty/blocked/offline/permission-denied states; navigation rules and deep links; first-use journey.
- **Done when:** every F-xx with user interaction appears in at least one flow; every screen has defined error and empty states.

## docs/product/DESIGN_SYSTEM.md
- **Purpose:** Consistent visual and interaction rules.
- **Inputs:** DES, A11Y, I18N-02, USR-04/06; PRD, APP_FLOW.
- **Must contain:** design direction (adjectives, references); tokens table (color, type, spacing, radius, elevation, motion) with approved values or PROPOSAL values; light/dark; layout and breakpoints; component inventory with states (default, hover, focus, active, disabled, loading, error, success); accessibility rules (contrast, focus, labels, motion, target sizes); voice and tone; screen state patterns.
- **Done when:** proposed values are labeled PROPOSAL until approved; contrast target stated; every component used in APP_FLOW is listed.

## docs/technical/TRD.md
- **Purpose:** Translate product requirements into technical requirements.
- **Inputs:** NFR-Q*, ARC-01/03/04, PLT-*, AIM-*, DAT-05/09; PRD, APP_FLOW.
- **Must contain:** F-xx → technical capability mapping; NFR-xx table (category, requirement with number, measurement method, priority) including measurable security/privacy NFRs (authN assurance, encryption, audit-log retention, vulnerability SLA = SECURITY_ARCHITECTURE §16, secret rotation, RPO/RTO); constraints (technical, budget, regulatory); integrations (provider, purpose, data exchanged, limits, failure behavior, credential owner); assumptions; open questions.
- **Done when:** every NFR has a number and a measurement method or a `[TBD]`; every integration has a failure behavior.

## docs/technical/ARCHITECTURE.md
- **Purpose:** The system's shape and the reasons for it.
- **Inputs:** Phase 3 decisions, ARC-*, PLT-*, OPS-03/06; TRD.
- **Must contain:** system purpose; C4 context diagram and container diagram (Mermaid `flowchart` or `C4Context` where supported); stack table (layer, choice, reason, ADR link, version policy "verify at setup"); boundaries (client/server/external responsibilities); request and data flow; interfaces summary; project structure (proposed directories); cross-cutting concerns (config, errors, logging, i18n); key decisions table; risks.
- **Lite extras:** template §14 (requirements mapping, NFRs, constraints/integrations, deploy & run), §7 interfaces and §12 key decisions, because TRD, API, OPERATIONS and ADRs are merged. Lite needs only the context diagram (no container diagram).
- **Client-only / local-first apps:** no server container or server-side boundary; see the template guidance.
- **Done when:** every container has an owner/responsibility; stack matches ADRs; no technology appears that is not decided or labeled PROPOSAL.

## docs/decisions/ (ADRs)
- **Purpose:** Record significant decisions and their context (MADR format).
- **Inputs:** DISCOVERY decisions D-xx; ARCHITECTURE.
- **Must contain:** `README.md` index (ID, title, status, date); `0001-record-architecture-decisions.md`; one ADR per major decision: stack, database, hosting, auth, architecture style, API style, license (Standard minimum). Each ADR: status (Proposed/Accepted/Superseded), context, decision drivers, considered options, decision outcome, consequences (good/bad), links.
- **File naming:** `NNNN-kebab-case-title.md`, zero-padded, never renumbered.
- **Done when:** every decision in DISCOVERY with architectural impact has an ADR; index lists all.

## docs/technical/DATABASE.md
- **Purpose:** What data exists, how it relates, and who can touch it.
- **Inputs:** DAT-*, USR-05, IDN-02, PRV-*, DB choice; PRD, ARCHITECTURE.
- **Must contain:** storage choice and tenancy model; data classification; entity table (purpose, owner, retention, personal data yes/no); ERD in Mermaid `erDiagram`; schema per entity (field, type, null, default, constraints, PII flag); relationships and delete behavior; access rules per entity × role (CRUD); indexes for key queries; migration approach; seed data (synthetic only); backup/restore; retention and deletion jobs.
- **Done when:** every entity referenced by PRD/API exists; every PII field is flagged and appears in PRIVACY_POLICY; access rules match SECURITY_ARCHITECTURE.

## docs/technical/API.md
- **Purpose:** The contract for clients and integrators (HTTP, GraphQL, gRPC, CLI commands, library public API, or events).
- **Inputs:** ARC-05..08, IDN-01/02/10; APP_FLOW, ARCHITECTURE, DATABASE.
- **Must contain:** style and conventions (naming, pagination, filtering, dates, IDs); authentication and authorization per operation (token lifetime, object- and function-level checks, API keys); request/response security (CORS, size limits, schema validation and unknown fields, response allow-lists, error verbosity, idempotency keys); operation table (OP-xx, method/path or RPC/command, purpose, roles, request, response, errors, linked F-xx); error model; rate limits; idempotency; versioning and deprecation; webhooks/events if any (signature verification, replay window, idempotent processing); link or plan for machine-readable spec (OpenAPI, proto, GraphQL schema).
- **Done when:** every operation used by APP_FLOW exists; every operation has an auth rule; error model is defined once and reused.

## docs/technical/SECURITY_ARCHITECTURE.md
- **Purpose:** Threat model and security design (not the disclosure policy).
- **Inputs:** IDN-*, PRV-*, CMP-*, AIM-05, DAT-07/11; ARCHITECTURE, DATABASE, API.
- **Must contain:** assets and data classification; trust boundaries (TB-x) diagram; STRIDE table (TH-xx threat, component, trust boundary TB-x, mitigation, status, R-xx); authentication design; authorization matrix (role × resource × action) matching DATABASE and API; tenant isolation; secrets management (names only, storage, rotation, owner); input/output handling; dependency and supply-chain policy; logging and redaction; privacy engineering (minimization, retention, data subject rights); incident response (severity classes, containment, notification clocks as `[TBD: counsel]` unless COMPLIANCE defines them, communications); AI-specific threats if AI; residual risks; security testing plan; vulnerability management (SLAs, exceptions); access governance; third-party/vendor risk (one row per ARCHITECTURE third party); platform hardening baseline; control mapping to COMPLIANCE CR-xx (Enterprise). Data classes are DATABASE §2's, verbatim.
- **Depth:** use `references/security-threat-catalog.md` for §3 (core classes always; domain sections only when their triggers match); record considered/skipped domains in the §3 coverage line. Status values: Planned, Implemented, Accepted risk, Needs decision (+ Q-xx).
- **Done when:** every role from PRD appears in the matrix; each STRIDE category considered (or N/A with reason); no secret values.

## docs/technical/TESTING.md
- **Purpose:** How we prove the product works and stays safe.
- **Inputs:** SCO-04, ACC-03, AIM-04, IDN-11, NFR-*; PRD, TRD, SECURITY_ARCHITECTURE, API.
- **Must contain:** goals and scope; test layers (unit, integration, end-to-end, manual, performance, security, accessibility, AI evals as applicable) with tools as PROPOSAL until verified; acceptance matrix rows (AT-xx, plus SEC-xx security, PERF-xx performance, A11Y-xx accessibility tests) for every F-xx / AC-xx.y (happy path + at least one failure) and every NFR-xx with a test method; permission-denial and tenant-isolation tests; fixtures (synthetic data only); environments; verified commands or `Not configured`; release criteria; results section with `Not run` default.
- **Done when:** 100% of Must F-xx and all NFR-xx traced; no result claims "Passed" without a real run.

## docs/technical/OPERATIONS.md
- **Purpose:** How the system is built, deployed, run, observed, and recovered.
- **Inputs:** OPS-*, OBS-*, NFR-Q02/Q05, DAT-09, IDN-06/07; ARCHITECTURE, TRD.
- **Must contain:** environments table; configuration and secrets (names only); CI/CD pipeline stages; deploy and rollback procedure; database migration procedure; observability (logs, metrics, traces, alerts); SLO-xx linked to NFR-xx; backup and restore with RPO/RTO; incident response (severity levels, contacts as roles); on-call; capacity and cost notes; runbook index (RB-xx).
- **Done when:** rollback and restore procedures exist; SLOs match NFR numbers; no commands claimed as verified unless they are.

## docs/engineering/CODE_STYLE.md
- **Purpose:** Conventions so humans and AI agents write consistent code.
- **Inputs:** TEA-08, stack decisions, I18N-01; ARCHITECTURE.
- **Must contain:** languages and version policy; naming; formatting/linting tools; type safety rules; directory responsibilities (matching ARCHITECTURE); error handling and logging conventions; dependency policy; i18n string handling; comments and docs; review checklist; verified commands table (format, lint, typecheck, test, build) — `Not configured` until verified. Lite: fill template §14 "Git (Lite)".
- **Done when:** directory map equals ARCHITECTURE project structure; every command is verified or marked `Not configured`.

## docs/engineering/GIT_WORKFLOW.md
- **Purpose:** How changes move from idea to release.
- **Inputs:** TEA-03/04/07, OPS-01/07, OSS-05/06.
- **Must contain:** branching model; branch naming; Conventional Commits with examples; PR size and review rules; required checks; merge strategy; release and versioning (SemVer); CHANGELOG process; hotfix process; protected branches; sign-off (DCO) if OSS.
- **Done when:** consistent with OPERATIONS pipeline and CONTRIBUTING.

## docs/engineering/AI_GUIDELINES.md
- **Purpose:** Detailed rules for AI coding assistants and for humans reviewing AI output.
- **Inputs:** TEA-05/06, IDN-07, AIM-* (if product uses AI); CODE_STYLE, SECURITY_ARCHITECTURE, TESTING.
- **Must contain:** reading order of docs before coding; allowed vs ask-first vs forbidden actions; scope discipline; no invention (APIs, commands, results); secrets and personal data handling in prompts; dependency additions; testing expectations; how to report what ran; prompt hygiene (one task, context, acceptance criteria); reviewing AI-generated code (licensing, security, hallucinated packages); keeping docs in sync.
- **Done when:** consistent with AGENTS.md; boundaries match TEA-06 answers.

## docs/technical/IMPLEMENTATION_PLAN.md
- **Purpose:** Ordered build sequence with checkpoints.
- **Inputs:** TIM-*, all technical docs.
- **Must contain:** phases M0–M7 (M0 foundations/repo setup → M1 data & auth → M2 first vertical slice → M3 core features → M4 secondary features → M5 hardening → M6 release → M7 post-launch; mark unused phases `N/A — reason`), gates G0–G5 between phases, Mermaid gantt + dependency flowchart + ASCII fallback; per task: ID (T-xx), description, linked F-xx/NFR-xx, inputs, output, Definition of Done, dependencies, owner (role); risks R-xx with mitigation; "before moving on" checkpoint per milestone.
- **Done when:** every Must F-xx is covered by at least one task; dependencies form no cycle; M0 contains no implementation beyond project setup tasks.

## docs/legal/TERMS_OF_SERVICE.md
- **Purpose:** Draft terms for users of a hosted product.
- **Inputs:** BIZ-02/04, LEG-02/03/06, USR-07, OBS-04; PRD.
- **Must contain:** not-legal-advice notice; parties `[TBD]` if unknown; acceptance; accounts; acceptable use; user content license; payments (if any); termination; disclaimers and liability `[TBD: counsel]`; governing law `[TBD]`; changes; contact.
- **Done when:** notice present; no invented entity names, addresses, or jurisdictions.

## docs/legal/PRIVACY_POLICY.md
- **Purpose:** Draft privacy notice.
- **Inputs:** PRV-*, DAT-02/04, ARC-01, AIM-03, OBS-06; DATABASE, SECURITY_ARCHITECTURE.
- **Must contain:** notice; controller identity `[TBD]`; data collected (exactly matching DATABASE PII fields and analytics); purposes and legal bases (if GDPR-like); sharing/sub-processors; retention; user rights and how to exercise them; international transfers; children; security summary; changes; contact.
- **Done when:** data list equals DATABASE PII + analytics + logs; no compliance claims.

## docs/legal/COOKIE_POLICY.md
- **Purpose:** Disclose cookies and similar technologies.
- **Inputs:** PRV-02; ARCHITECTURE.
- **Must contain:** notice; categories (strictly necessary, preferences, analytics, marketing); table of cookies `[TBD]` until implemented; consent approach; how to change choices.
- **Done when:** consistent with PRIVACY_POLICY and analytics choice.

## docs/legal/COMPLIANCE.md
- **Purpose:** Register of applicable regimes, controls, owners, and evidence — a planning tool, not a certificate.
- **Inputs:** CMP-*, PRV-03, AIM-06, ACC-02; legal primer; SECURITY_ARCHITECTURE.
- **Must contain:** notice; scope; regimes table (regime, trigger, applies? yes/no/TBD, owner, status "Not assessed" by default); control mapping (control, regime, doc/section implementing it, evidence location); open legal questions; review schedule.
- **Done when:** every trigger found in discovery is listed; no status says "compliant" or "certified" unless the user provides evidence.

## docs/legal/MASTER_SERVICES_AGREEMENT.md
- **Purpose:** Conditional (B2B). Term-sheet skeleton of the provider's commercial positions for counsel to turn into a master agreement with Order Forms / SOWs.
- **Inputs:** CMP-06, BIZ-02/04/05, LEG-02/03, NFR/SLO numbers, CMP-02; PRD, OPERATIONS, SECURITY_ARCHITECTURE, COMPLIANCE.
- **Must contain:** notice; parties and document hierarchy; scope, Order Forms, SOWs; customer obligations; fees, invoicing, taxes; term, renewal, termination; IP; confidentiality; data protection by reference to the DPA (and BAA if PHI); SLA and support; warranties; limitation of liability; indemnities; insurance; governing law and disputes; general terms. Unknown commercial terms stay `[TBD: owner]` / `[TBD: counsel]`.
- **Done when:** SLA numbers match approved SLO-xx/NFR-xx or are `[TBD]`; no invented prices, caps, credits, entities, or certifications.

## docs/legal/DATA_PROCESSING_AGREEMENT.md
- **Purpose:** Conditional (processor). Skeleton of the controller–processor contract for business customers' personal data.
- **Inputs:** CMP-07, PRV-03/04, DAT-02, LEG-02/03; DATABASE, ARCHITECTURE, SECURITY_ARCHITECTURE, OPERATIONS, COMPLIANCE §4, PRIVACY_POLICY.
- **Must contain:** notice; parties and roles; the GDPR Art. 28(3) elements (subject-matter, duration, nature and purpose, types of personal data, categories of data subjects, controller obligations and rights; points (a) documented instructions, (b) confidentiality, (c) Art. 32 security, (d) sub-processors per Art. 28(2) and (4), (e) data-subject request assistance, (f) Arts. 32–36 assistance, (g) deletion or return, (h) information and audits); breach notification; international transfers (e.g. SCCs by reference to the official text); Annex I details, Annex II technical and organizational measures, Annex III sub-processors.
- **Done when:** data categories equal DATABASE; Annex II matches SECURITY_ARCHITECTURE/OPERATIONS; Annex III equals COMPLIANCE §4 and PRIVACY_POLICY sub-processors; deadlines are user-decided or `[TBD: counsel]`.

## docs/legal/BUSINESS_ASSOCIATE_AGREEMENT.md
- **Purpose:** Conditional (PHI). Skeleton of a HIPAA business associate (or subcontractor) agreement.
- **Inputs:** CMP-01, CMP-08, LEG-02/03; SECURITY_ARCHITECTURE, OPERATIONS (incident runbook), DATABASE, ARCHITECTURE (vendors), COMPLIANCE §4.
- **Must contain:** notice; parties and role (BA or subcontractor); definitions by reference to the HIPAA Rules; permitted and required uses and disclosures (164.504(e)(2)(i), (e)(4), minimum necessary, de-identification); BA obligations table covering 164.504(e)(2)(ii)(A)–(J) and 164.314(a)(2)(i); subcontractor flow-down; breach and security-incident reporting (164.410); covered-entity obligations; term, termination for cause, return or destruction of PHI; miscellaneous.
- **Done when:** every required element maps to a doc section or `[TBD]`; subcontractors match COMPLIANCE §4; no "HIPAA compliant/certified" claims.

## README.md
- **Purpose:** Front door of the repo.
- **Inputs:** VIS-05/06, SCO, stack, LEG-01, OBS-03, OSS-*.
- **Must contain:** name and one-line description; status (e.g. "Planning — no code yet"); features (Must list); tech stack; getting started (`Not configured yet` until code exists); documentation links (docs/README.md, AGENTS.md); contributing; security (link SECURITY.md); license line matching LICENSE.
- **Done when:** no setup command is invented; license matches.

## LICENSE
- **Purpose:** Legal license for the code.
- **Inputs:** LEG-01, OSS-01; legal primer.
- **Source:** `assets/templates/licenses/README.md` is guidance only and is NOT copied into the project. It bundles `MIT.txt` and `PROPRIETARY.txt` and lists official plain-text URLs for other licenses.
- **Must contain:** the full, unmodified official license text with only the designated fields filled (MIT/BSD: year and holder; Apache/GPL/AGPL/LGPL/MPL: no edits); or the proprietary "All rights reserved" notice from `PROPRIETARY.txt`.
- **Non-MIT licenses:** fetch the official text from the URLs in `licenses/README.md`. If you cannot fetch it, do NOT write it from memory: leave `LICENSE` as `[TBD: insert official <SPDX-ID> text — owner]`, add the same item to docs/README.md, and tell the user where to download it.
- **Done when:** text is exact; SPDX ID consistent in README, CONTRIBUTING, and manifests; holder confirmed by the user.

## CHANGELOG.md
- **Purpose:** Human-readable change history (Keep a Changelog, SemVer).
- **Must contain:** header, `## [Unreleased]` section; nothing invented as released.

## CONTRIBUTING.md
- **Inputs:** OSS-02/05/08, TEA-03/04; GIT_WORKFLOW, CODE_STYLE.
- **Must contain:** how to report bugs/request features; development setup (`Not configured` until verified); branching and commit rules (link GIT_WORKFLOW); PR checklist; DCO/CLA if chosen; code of conduct link; license of contributions.

## CODE_OF_CONDUCT.md
- **Inputs:** OSS-03.
- **Must contain:** adoption of Contributor Covenant 2.1 **by reference** (link to the official text; version 3.0 offered as an option if the user prefers); enforcement contact `[TBD]` if not given.

## SECURITY.md (root)
- **Purpose:** Vulnerability disclosure policy only.
- **Inputs:** OSS-04, OBS-02.
- **Must contain:** supported versions; how to report privately; what to include; response expectations (no promised times unless the user agreed); disclosure policy; no public issues for vulnerabilities.

## SUPPORT.md
- **Inputs:** OBS-02/03/04.
- **Must contain:** channels; what is supported; response expectations; links to docs and SECURITY.md.

## ACCESSIBILITY.md
- **Inputs:** ACC-*.
- **Must contain:** commitment and target (e.g. WCAG 2.2 AA); current status "Not yet evaluated"; known limitations; feedback contact; date. Never claim conformance without an evaluation.

## .github/*
- **CODEOWNERS:** owner handles/teams from TEA-02; `[TBD]` placeholders are not valid syntax — use a comment line instead when owners are unknown.
- **PULL_REQUEST_TEMPLATE.md:** summary, linked issue/F-xx, type of change, checklist (tests, docs updated, no secrets, AI-assisted disclosure if TEA-05 says so).
- **ISSUE_TEMPLATE/bug_report.yml, feature_request.yml:** valid issue-form YAML (name, description, labels, body fields).
- **ISSUE_TEMPLATE/config.yml:** `blank_issues_enabled` and contact links to SUPPORT and private security reporting.
- **Repo placeholders:** issue forms and config use `{{github_owner}}`, `{{repo_name}}`, `{{default_branch}}`. Ask the user (or read the git remote in brownfield mode); never guess. If unknown, keep the files out of the batch and record a Q-xx rather than leaving placeholders.
- **dependabot.yml (optional):** offer when the code host is GitHub and dependency ecosystems are decided; list only ecosystems the project actually uses.

## AGENTS.md
- **Purpose:** Short, universal instructions for AI coding agents; links docs.
- **Inputs:** everything; AI_GUIDELINES.
- **Must contain:** project one-liner and status; reading order with links to every generated doc; key rules (no invention, scope, secrets, ask-first actions); verified commands (or `Not configured`); boundaries (deploys, migrations, data deletion need explicit authorization); how to keep docs updated.
- **Done when:** ≤ ~150 lines; every link resolves; consistent with AI_GUIDELINES.

## CLAUDE.md / GEMINI.md / .github/copilot-instructions.md
- **Purpose:** Thin pointers for tools that read their own file names.
- **Must contain:** one line saying "Follow AGENTS.md" plus a link; tool-specific notes only if the user asked.
- **Done when:** created only for tools the user named (TEA-05).

## docs/.start-from-here/HANDOVER.md (session mode)
- **Purpose:** Connects fresh sessions in session mode so a small-context model stays consistent without re-reading everything.
- **Inputs:** STATE.md, everything produced so far.
- **Must contain:** session number and WP done; files created/changed with status; ≤15 key decisions; ID registry snapshot (personas, roles, F-xx titles, NFR-xx, entities, operations, ADR titles, milestones); open TBDs; quality notes; next WP with its lean reading list; a copy-paste next-session prompt.
- **Done when:** overwritten at the end of every session; ≤ ~150 lines; no `{{`; no secrets. Not a project deliverable — no status header, never listed in AGENTS.md.

## docs/README.md
- **Purpose:** Documentation index and status board.
- **Must contain:** table of every doc: path (link), purpose, status, owner, last updated; how to update docs (change-propagation summary); link to DISCOVERY.md and AGENTS.md.
- **Done when:** lists exactly the docs that exist; statuses match headers.
