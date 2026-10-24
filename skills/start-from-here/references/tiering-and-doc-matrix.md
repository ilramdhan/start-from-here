# Tiering and document matrix

Use in Phase 1 to propose a tier, and whenever the user says `change tier`. The user always confirms the tier and may toggle individual documents.

## Tiers

| Tier | Typical project | Philosophy |
|---|---|---|
| **Lite** | Solo, indie, prototype, hackathon, personal or small internal tool | Shortest viable content in every section (all H2 headings kept; `N/A — reason` where not applicable). Skip N/A docs. One page beats ten. |
| **Standard** | Startup MVP, OSS project, small-team product | Full core set at practical depth. ADRs for major decisions. |
| **Enterprise** | Regulated data, multi-team, SLAs, multi-tenant, audits | Full set, COMPLIANCE, ADRs mandatory, SUPPORT, governance depth, per-doc review. |

## Tier scoring

Add points for each signal that is true. Use the highest applicable bracket; any **override** forces at least that tier.

| Signal | Points |
|---|---|
| Team of 3–10 people | +2 |
| Multiple teams or >10 people | +4 |
| Product intended for paying customers | +2 |
| User accounts and personal data | +2 |
| Open source project expecting contributors | +2 |
| Public API for third parties | +2 |
| Multi-tenant (organizations) | +3 |
| Availability target ≥ 99.9% or contractual SLA | +3 |
| Customers expect SOC 2 / ISO 27001 | +4 |
| Multiple regions / data residency rules | +2 |
| Prototype, hackathon, or learning project | −3 |
| Single user / personal tool | −3 |

| Score | Proposed tier |
|---|---|
| ≤ 1 | Lite |
| 2 – 7 | Standard |
| ≥ 8 | Enterprise |

**Overrides**

- Regulated data (health under HIPAA, payment card data stored or processed by you, children's data, student records, financial services) → **Enterprise** unless the user objects with a reason (record it as R-xx).
- High-risk AI use (decisions about people's employment, credit, education, health, law enforcement) → **Enterprise**.
- Open source → at least the OSS community files, regardless of tier.

Tell the user the score drivers in one line: "Standard — small team, accounts with personal data, open source."

## Legend

- **R** Required.
- **C(x)** Conditional: required if condition x is true; otherwise skip.
- **O** Optional: offer, default off unless the user wants it.
- **—** Skip.

Conditions: `UI` = has a graphical user interface; `data` = stores data beyond config; `PD` = personal data; `API` = exposes an API to clients/other services; `OSS` = open source; `public` = publicly accessible product or repo; `accounts` = user sign-in; `SaaS` = hosted service for others; `regulated` = regulated data; `tracking` = non-essential cookies/analytics/ads on web; `store` = distributed through an app store; `tool named` = user named that AI tool.

`PD` means personal data the developer or a third-party service it uses (analytics, crash reporting, sync, AI provider) can access. Data that stays only on the user's device and is never transmitted is not `PD` for this purpose, but note it in DATABASE and SECURITY_ARCHITECTURE. `public` means the product or the repository is publicly available.

## Matrix

| Document | Lite | Standard | Enterprise | Depth notes |
|---|---|---|---|---|
| docs/DISCOVERY.md | R | R | R | L: answers + assumptions on 1–2 pages. E: add stakeholders, approvals log. |
| docs/README.md | R | R | R | Status table of all docs; docs not generated appear as `N/A` + reason. L: list only. |
| docs/product/PRD.md | R | R | R | L: problem, 1–2 personas, Must features with acceptance criteria, out of scope, 1 metric. S: full. E: + traceability, stakeholder sign-off, release criteria. |
| docs/product/APP_FLOW.md | C(UI) | R | R | Non-UI: command/endpoint inventory. L: inventory + primary flow. S/E: all flows, states, navigation, Mermaid. |
| docs/product/DESIGN_SYSTEM.md | O | C(UI) | C(UI) | L (if chosen): tokens + component list. E: + governance, contribution process. |
| docs/technical/TRD.md | — (essentials folded into ARCHITECTURE.md: F→component mapping, NFR-xx, constraints, integrations) | R | R | S: mapping F→components, NFR-xx table. E: + constraints register, capacity model. |
| docs/technical/ARCHITECTURE.md | R | R | R | L: stack table, one context diagram, folder structure. S: C4 context + container, data flow. E: + deployment view, failure modes, multi-region. |
| docs/decisions/README.md + 0001 + ADRs | O | R | R (mandatory) | S: ADRs for stack, DB, hosting, auth. E: every significant decision, with review/approver fields. |
| docs/technical/DATABASE.md | C(data) | C(data) | C(data) | L: entities + fields + access rules. S: + ERD, indexes, migrations, retention. E: + classification, audit tables, backup/restore tests. |
| docs/technical/API.md | — (merged into ARCHITECTURE if API) | C(API) | C(API) | S: conventions, endpoint table, errors. E: + versioning/deprecation policy, SLAs, rate limits, SDK policy. |
| docs/technical/SECURITY_ARCHITECTURE.md | R (short) | R | R | L: one page—auth, roles, secrets, top 5 threats. S: STRIDE table, authZ matrix. E: + data flow trust boundaries, control mapping to COMPLIANCE, pen-test plan. |
| docs/technical/TESTING.md | R | R | R | L: layers + acceptance matrix for Must features. E: + perf, security, a11y, DR tests, evidence retention. |
| docs/technical/OPERATIONS.md | — (merge deploy notes into ARCHITECTURE) | R | R | S: envs, CI/CD, rollback, monitoring, backups. E: + SLOs/error budgets, on-call, incident process, DR drills, runbooks index. |
| docs/technical/IMPLEMENTATION_PLAN.md | R | R | R | L: 3–5 milestones, tasks with DoD. E: + owners, dependencies across teams, risk burndown. |
| docs/engineering/CODE_STYLE.md | R | R | R | L: language conventions, structure, commands. E: + review checklist, dependency policy. |
| docs/engineering/GIT_WORKFLOW.md | — (2 lines in CODE_STYLE) | R | R | E: + protected branches, release approvals, signed commits. |
| docs/engineering/AI_GUIDELINES.md | R | R | R | L: one page dos/don'ts. E: + data handling with AI tools, approved tools list, audit of AI changes. |
| docs/legal/TERMS_OF_SERVICE.md | O | C(accounts or SaaS) | C(accounts or SaaS) | Always draft + counsel notice. Store apps without accounts: the store's standard EULA usually suffices — offer ToS as optional. B2B SaaS: ToS is often replaced by a counsel-drafted MSA + DPA (+ BAA for HIPAA); the draft lists them as `[TBD: counsel]`. |
| docs/legal/PRIVACY_POLICY.md | C(PD or store) | C(PD or store) | C(PD or store) | Data inventory must match DATABASE. App stores require a privacy policy URL even when nothing is collected: then write a short "we collect no personal data; data stays on your device" version and map it to the store privacy label / data safety form. |
| docs/legal/COOKIE_POLICY.md | O | C(tracking) | C(tracking) | Only for web with non-essential cookies/trackers. |
| docs/legal/COMPLIANCE.md | — | C(regulated or PD in GDPR-like regions) | R | Register of regimes, controls, owners, evidence; never claims compliance. |
| README.md | R | R | R | L: what, status, how to run (Not configured yet), license. |
| LICENSE | R | R | R | Full official text (MIT bundled; others fetched from official URLs in `assets/templates/licenses/README.md`, else `[TBD]`). Proprietary: "All rights reserved" notice. |
| CHANGELOG.md | O | R | R | Keep a Changelog + SemVer, starts with `Unreleased`. |
| CONTRIBUTING.md | C(OSS) | R | R | Private repos: internal contribution guide. |
| CODE_OF_CONDUCT.md | C(OSS) | C(OSS) | C(OSS) | Contributor Covenant 2.1 by reference (3.0 as option) + enforcement contact. |
| SECURITY.md (root) | C(public) | R | R | Vulnerability disclosure only; links to SECURITY_ARCHITECTURE is not required. |
| SUPPORT.md | — | O | R | Channels, response expectations. |
| ACCESSIBILITY.md | — | C(UI) | C(UI) | Target, known issues, feedback contact. |
| .github/CODEOWNERS | — | R | R | Requires owners (TEA-02). |
| .github/PULL_REQUEST_TEMPLATE.md | O | R | R | |
| .github/ISSUE_TEMPLATE/bug_report.yml | O | R | R | Issue forms. |
| .github/ISSUE_TEMPLATE/feature_request.yml | O | R | R | |
| .github/ISSUE_TEMPLATE/config.yml | — | R | R | Links to SUPPORT/SECURITY. |
| .github/dependabot.yml | O | O | O | Only if code host is GitHub and ecosystems are decided. |
| AGENTS.md | R | R | R | Concise (aim ≤ 150 lines); links every doc. |
| CLAUDE.md / GEMINI.md / .github/copilot-instructions.md | C(tool named) | C(tool named) | C(tool named) | Thin pointers to AGENTS.md only. |

If the code host is not GitHub, adapt `.github/*` to the host's equivalents and tell the user; keep the content.

## Lite merges

When a doc is skipped in Lite because it is merged, put a short section in the target doc:

| Skipped in Lite | Merge into |
|---|---|
| TRD | ARCHITECTURE §14.1–14.3 "Requirements mapping", "NFRs", "Constraints and integrations" |
| API | ARCHITECTURE §7 "Interfaces" |
| OPERATIONS | ARCHITECTURE §14.4 "Deploy & run" |
| GIT_WORKFLOW | CODE_STYLE §14 "Git (Lite)" |
| ADRs | ARCHITECTURE §12 "Decisions" table |

In Lite, links that templates point at skipped docs (e.g. PRD → `TRD.md#…`, Related headers → API/OPERATIONS/GIT_WORKFLOW) MUST be repointed to the merge target above or removed.

## Session mode by tier

With small context windows (see `session-mode.md`), the doc set is generated in work packages, one per fresh session: Lite ≈ 5 sessions (WP1 · WP2+3 · WP4+5 · WP6–8 · WP9), Standard 9, Enterprise 9–14 (split WP3/WP5/WP8 below 64k context). The doc set and depth per tier do not change.

## Changing tier later

1. Recompute the doc set.
2. Show a diff: docs to add, docs to remove (never delete files without explicit approval; mark as `Skipped`), depth changes.
3. **STOP** for approval.
4. Generate added docs in dependency order; deepen existing docs; update STATE.md and docs/README.md.
