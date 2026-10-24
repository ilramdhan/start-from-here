# start-from-here state
- skill_version: 1.0.0
- project: TaskFlow
- mode: new
- output_mode: filesystem
- language_conversation: English
- language_docs: English
- experience: intermediate
- tier: Standard
- phase: 7-handoff
- next_step: Founder/PM and developers review the drafts and answer the blocking open questions (Q-01, Q-04, Q-09, Q-10, Q-25). Then run the first implementation prompt.
- last_updated: 2026-10-24

## Domains answered
- [x] vision  - [x] users  - [x] scope  - [x] data  - [x] nfr  - [x] stack  - [x] security  - [x] ops  - [x] team-oss-legal  - [x] constraints

## Flags
- has_ui: yes · has_api: yes (internal only) · stores_data: yes · personal_data: yes · regulated_data: none · open_source: no · public_facing: yes · app_store: no · regions: EU, US · ai_tools_used: Claude Code, GitHub Copilot

## Documents
All documents are Draft. Test-run gates were assumed "approved — continue", but no named approver has signed off, so nothing is marked Approved.

| Path | Applicability | Status |
|---|---|---|
| docs/DISCOVERY.md | Required | Draft |
| docs/README.md | Required | Draft |
| docs/product/PRD.md | Required | Draft |
| docs/product/APP_FLOW.md | Required | Draft |
| docs/product/DESIGN_SYSTEM.md | Required (UI) | Draft |
| docs/technical/TRD.md | Required | Draft |
| docs/technical/ARCHITECTURE.md | Required | Draft |
| docs/decisions/README.md + 0001–0008 | Required | Draft (ADRs Proposed) |
| docs/technical/DATABASE.md | Required | Draft |
| docs/technical/API.md | Required (internal API) | Draft |
| docs/technical/SECURITY_ARCHITECTURE.md | Required | Draft |
| docs/technical/TESTING.md | Required | Draft |
| docs/technical/OPERATIONS.md | Required | Draft |
| docs/technical/IMPLEMENTATION_PLAN.md | Required | Draft |
| docs/engineering/CODE_STYLE.md | Required | Draft |
| docs/engineering/GIT_WORKFLOW.md | Required | Draft |
| docs/engineering/AI_GUIDELINES.md | Required | Draft |
| docs/legal/TERMS_OF_SERVICE.md | Required (SaaS) | Draft (counsel review open, Q-15) |
| docs/legal/PRIVACY_POLICY.md | Required (personal data) | Draft (counsel review open, Q-15) |
| docs/legal/COMPLIANCE.md | Required | Draft |
| docs/legal/COOKIE_POLICY.md | Skipped (essential cookies only, A-09, Q-20) | Skipped |
| README.md, LICENSE, CHANGELOG.md, CONTRIBUTING.md, SECURITY.md, SUPPORT.md, ACCESSIBILITY.md | Required / on | Draft |
| CODE_OF_CONDUCT.md | Skipped (not open source) | Skipped |
| .github/CODEOWNERS, PULL_REQUEST_TEMPLATE.md, ISSUE_TEMPLATE/*, dependabot.yml | Required / on | Draft |
| AGENTS.md, CLAUDE.md, .github/copilot-instructions.md | Required / on (tools named) | Draft |
| GEMINI.md | Skipped (tool not named) | Skipped |

## Decisions
- D-01: Tier = Standard (score suggested Enterprise; risk R-08) — user — 2026-10-24
- D-02: Stack = TypeScript modular monolith, PostgreSQL, AWS managed, single region — accepted recommendation — 2026-10-24
- D-03 to D-08: tenancy (RLS), in-app auth, Stripe inbox, pre-signed files, Postgres job queue, internal API only — see DISCOVERY §6

## Open questions
- Q-01 to Q-38 in docs/DISCOVERY.md §7. Blocking for M0: Q-01, Q-04, Q-09, Q-10, Q-25.
