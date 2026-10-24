---
schema_version: 1
skill_version: "1.0.0"
project_name: "TaskFlow"
mode: "greenfield"
tier: "Standard"
phase: "7-handoff"
started_at: "2026-10-24"
last_updated: "2026-10-24"
owner: "PM / Founder"
ai_tools:
  - "AGENTS.md"
  - "CLAUDE.md"
  - ".github/copilot-instructions.md"
languages_of_record:
  - "en"
---

# Start From Here — Session State

> Working state for the `start-from-here` skill. Updated at every phase gate. Safe to commit so teammates or future sessions can resume with `resume docs`. Delete after Phase 7 handoff if you prefer not to keep it.

## Phase progress

| Phase | Name | Status | Gate approved | Notes |
| --- | --- | --- | --- | --- |
| 0 | Preflight & repo scan | Completed | 2026-10-24 | Greenfield B2B SaaS web app (`TaskFlow`), `Standard` tier selected |
| 1 | Discovery interview | Completed | 2026-10-24 | All 9 discovery areas covered (`CTX`, `PRB`, `USR`, `SCP`, `ARC`, `DAT`, `NFR`, `LEG`, `TEA`) |
| 2 | Product docs | Completed | 2026-10-24 | `PRD.md`, `APP_FLOW.md`, `DESIGN_SYSTEM.md` approved |
| 3 | Technical & security docs | Completed | 2026-10-24 | `TRD.md`, `ARCHITECTURE.md`, `ADR-0001`..`ADR-0005`, `DATABASE.md`, `API.md`, `SECURITY_ARCHITECTURE.md`, `TESTING.md`, `OPERATIONS.md`, `IMPLEMENTATION_PLAN.md` approved |
| 4 | Engineering, governance & legal | Completed | 2026-10-24 | `CODE_STYLE.md`, `GIT_WORKFLOW.md`, `AI_GUIDELINES.md`, `TERMS_OF_SERVICE.md`, `PRIVACY_POLICY.md`, `COMPLIANCE.md`, `README.md`, `LICENSE`, `CHANGELOG.md`, `CONTRIBUTING.md`, `SECURITY.md`, `SUPPORT.md`, `ACCESSIBILITY.md`, `.github/*` approved |
| 5 | AI agent instructions | Completed | 2026-10-24 | `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md` approved |
| 6 | Consistency audit | Completed | 2026-10-24 | 0 Errors, 0 Warnings, 5 tracked non-M1 open questions (`Q-01`..`Q-05`) |
| 7 | Handoff | Completed | 2026-10-24 | `docs/README.md` generated; ready to begin `M1` (`T-01`) |

## Interview coverage

| Area | Status | Notes |
| --- | --- | --- |
| CTX — Context & mode | Covered | Greenfield B2B SaaS web app for 5–50 person teams |
| PRB — Vision & problem | Covered | Replace bloated/fragmented task tools with fast workspaces, Kanban, lists, and comments |
| USR — Users & personas | Covered | `P-01` Org Owner (`owner`), `P-02` Workspace Admin (`admin`), `P-03` Team Member (`member`) |
| SCP — Scope & features | Covered | `F-01`..`F-09` Must, `F-10`..`F-11` Should, `F-12` Could; explicit non-goals locked |
| ARC — Technical & architecture | Covered | Full-stack TypeScript, Next.js App Router modular monolith, PostgreSQL + Drizzle, pg-boss worker (`D-02`, `ADR-0002`) |
| DAT — Data & integrations | Covered | Multi-tenant shared schema with `organization_id` + PostgreSQL RLS (`D-03`), S3/R2 presigned uploads, Resend email, Stripe Billing (`D-05`) |
| NFR — Non-functional | Covered | p95 API < 250 ms, board load < 1.5 s, 99.9% uptime, RPO ≤ 15 min, RTO ≤ 1 hr, WCAG 2.2 AA (`NFR-01`..`NFR-13`) |
| LEG — Legal, licensing & compliance | Covered | Proprietary license (`D-06`), US/EU customers (GDPR + CCPA), Terms + Privacy + Compliance docs |
| TEA — Team, workflow & AI tools | Covered | 4-person team, GitHub + Actions, trunk-based PRs, Claude Code + GitHub Copilot |

## Locked decisions

| ID | Decision | Rationale | Where recorded |
| --- | --- | --- | --- |
| D-01 | Tier set to `Standard` with `COMPLIANCE.md` and `SUPPORT.md` enabled | Commercial multi-tenant B2B SaaS serving US & EU customers with Stripe billing and 4-person team | `docs/DISCOVERY.md` |
| D-02 | Full-stack TypeScript (`strict: true`) modular monolith on Next.js (App Router) + Tailwind CSS + Radix UI + Zod + `pg-boss` worker | Single-language velocity for 2 full-stack engineers; avoids premature microservice complexity while isolating background jobs | `docs/decisions/0002-fullstack-typescript-nextjs-modular-monolith.md` |
| D-03 | Managed PostgreSQL + Drizzle ORM + shared schema with `organization_id` on every tenant table + PostgreSQL Row-Level Security (RLS) | Defense-in-depth tenant isolation at both query helper and database engine layers | `docs/decisions/0003-postgresql-multi-tenant-row-isolation.md` |
| D-04 | Self-managed stateful sessions in PostgreSQL (`HttpOnly`, `Secure`, `SameSite=Lax`), Argon2id password hashing, Google OAuth 2.0 (PKCE), and TOTP MFA (RFC 6238) | Immediate session revocation, zero per-MAU auth vendor lock-in, strong security posture | `docs/decisions/0004-auth-sessions-and-totp-mfa.md` |
| D-05 | Managed container platform + Managed PostgreSQL + Cloudflare R2 / AWS S3 presigned URLs + Resend email + Stripe Checkout & Customer Portal + Pino & Sentry | Low-ops PaaS footprint, PCI SAQ-A scope via Stripe Hosted Checkout, zero file buffering on app servers | `docs/decisions/0005-hosting-storage-and-stripe-billing.md` |
| D-06 | Proprietary license (`All rights reserved — TaskFlow Inc.`) | Commercial B2B SaaS product | `LICENSE`, `docs/DISCOVERY.md` |

## Document manifest

| Path | Requirement | Status | Approved date | Notes |
| --- | --- | --- | --- | --- |
| `docs/README.md` | Required | Approved | 2026-10-24 | Generated last in Phase 7 |
| `docs/DISCOVERY.md` | Required | Approved | 2026-10-24 | Phase 1 interview record |
| `docs/product/PRD.md` | Required | Approved | 2026-10-24 | Features `F-01`..`F-12` |
| `docs/product/APP_FLOW.md` | Required | Approved | 2026-10-24 | Journeys `J-01`..`J-05`, Screens `S-01`..`S-11` |
| `docs/product/DESIGN_SYSTEM.md` | Required | Approved | 2026-10-24 | Tokens, components, WCAG 2.2 AA |
| `docs/technical/TRD.md` | Required | Approved | 2026-10-24 | `NFR-01`..`NFR-13`, stack options |
| `docs/technical/ARCHITECTURE.md` | Required | Approved | 2026-10-24 | C4 diagrams, module boundaries |
| `docs/decisions/README.md` | Required | Approved | 2026-10-24 | ADR index (`ADR-0001`..`ADR-0005`) |
| `docs/decisions/0001-record-architecture-decisions.md` | Required | Accepted | 2026-10-24 | MADR format |
| `docs/decisions/0002-fullstack-typescript-nextjs-modular-monolith.md` | Required | Accepted | 2026-10-24 | Next.js + TS + pg-boss |
| `docs/decisions/0003-postgresql-multi-tenant-row-isolation.md` | Required | Accepted | 2026-10-24 | PostgreSQL + Drizzle + RLS |
| `docs/decisions/0004-auth-sessions-and-totp-mfa.md` | Required | Accepted | 2026-10-24 | Sessions + Argon2id + Google OAuth + TOTP |
| `docs/decisions/0005-hosting-storage-and-stripe-billing.md` | Required | Accepted | 2026-10-24 | PaaS + S3/R2 + Stripe + Resend |
| `docs/technical/DATABASE.md` | Required | Approved | 2026-10-24 | Schema, RLS policies, indexes, retention |
| `docs/technical/API.md` | Required | Approved | 2026-10-24 | REST endpoints (`OP-01`..`OP-43`), webhooks, errors |
| `docs/technical/SECURITY_ARCHITECTURE.md` | Required | Approved | 2026-10-24 | Threat model (`TH-01`..`TH-16`), RBAC matrix, encryption |
| `docs/technical/TESTING.md` | Required | Approved | 2026-10-24 | `AT-01`..`AT-52`, `SEC-01`..`SEC-12`, Vitest + Playwright |
| `docs/technical/OPERATIONS.md` | Required | Approved | 2026-10-24 | CI/CD, `SLO-01`..`SLO-03`, `RB-01`..`RB-05` |
| `docs/technical/IMPLEMENTATION_PLAN.md` | Required | Approved | 2026-10-24 | Milestones `M0`..`M7` & tasks `T-01`..`T-26` |
| `docs/engineering/CODE_STYLE.md` | Required | Approved | 2026-10-24 | TS/React/SQL conventions |
| `docs/engineering/GIT_WORKFLOW.md` | Required | Approved | 2026-10-24 | Trunk-based PR workflow |
| `docs/engineering/AI_GUIDELINES.md` | Required | Approved | 2026-10-24 | AI operating rules & boundaries |
| `docs/legal/TERMS_OF_SERVICE.md` | Required | Approved | 2026-10-24 | B2B SaaS terms draft |
| `docs/legal/PRIVACY_POLICY.md` | Required | Approved | 2026-10-24 | GDPR/CCPA privacy notice draft |
| `docs/legal/COOKIE_POLICY.md` | Skipped | Skipped | — | Strictly necessary session/CSRF cookies only; no tracking/ad cookies (covered in `PRIVACY_POLICY.md` §8) |
| `docs/legal/COMPLIANCE.md` | Optional (on) | Approved | 2026-10-24 | GDPR, CCPA, PCI SAQ-A, SOC 2 readiness |
| `README.md` | Required | Approved | 2026-10-24 | Root project overview |
| `LICENSE` | Required | Approved | 2026-10-24 | Proprietary copyright notice |
| `CHANGELOG.md` | Required | Approved | 2026-10-24 | Keep a Changelog format |
| `CONTRIBUTING.md` | Required | Approved | 2026-10-24 | Internal team contribution workflow |
| `CODE_OF_CONDUCT.md` | Skipped | Skipped | — | Proprietary internal repository (not open-source) |
| `SECURITY.md` | Required | Approved | 2026-10-24 | Vulnerability disclosure policy |
| `SUPPORT.md` | Optional (on) | Approved | 2026-10-24 | Support channels & SLAs |
| `ACCESSIBILITY.md` | Required | Approved | 2026-10-24 | WCAG 2.2 AA accessibility statement |
| `.github/CODEOWNERS` | Required | Approved | 2026-10-24 | Code review ownership |
| `.github/PULL_REQUEST_TEMPLATE.md` | Required | Approved | 2026-10-24 | PR checklist |
| `.github/ISSUE_TEMPLATE/bug_report.yml` | Required | Approved | 2026-10-24 | Bug report form |
| `.github/ISSUE_TEMPLATE/feature_request.yml` | Required | Approved | 2026-10-24 | Feature request form |
| `.github/ISSUE_TEMPLATE/config.yml` | Required | Approved | 2026-10-24 | Issue template config |
| `AGENTS.md` | Required | Approved | 2026-10-24 | Root AI agent instructions |
| `CLAUDE.md` | Optional (on) | Approved | 2026-10-24 | Pointer to `AGENTS.md` for Claude Code |
| `.github/copilot-instructions.md` | Optional (on) | Approved | 2026-10-24 | Pointer to `AGENTS.md` for GitHub Copilot |
| `GEMINI.md` | Skipped | Skipped | — | Team uses Claude Code and GitHub Copilot only |

## Open questions (rolling)

| ID | Question | Blocks | Owner | Target |
| --- | --- | --- | --- | --- |
| Q-01 | Final per-seat pricing numbers (USD/seat/month and annual discount %) and Stripe product/price IDs | `M3` Billing UI & Stripe checkout config (`T-18`) | PM / Founder | Before `M3` |
| Q-02 | Whether Free Trial organizations have a seat cap (e.g., max 10 seats during trial) or unlimited seats during the 14-day trial | `M3` Billing enforcement rules (`T-18`) | PM / Founder | Before `M3` |
| Q-03 | Final cloud vendor selection between Render vs. Fly.io vs. AWS ECS + Neon/RDS vs. Cloudflare R2/AWS S3 | `M5`/`M6` Production provisioning (`T-24`, local dev uses Docker Compose) | Engineering Lead | Before `M5` |
| Q-04 | Legal entity registered physical mailing address, jurisdiction registration number, and DPO/privacy contact email | `M6` Public launch legal sign-off (`TERMS_OF_SERVICE.md`, `PRIVACY_POLICY.md`, Gate `G5`) | PM / Founder | Before `M6` |
| Q-05 | Whether `member` role can delete their own uploaded attachment after task closure or only within a time window | `M3` Attachments polish (`T-15`, default: author can delete own attachment while task is active) | PM / Founder | Before `M3` |

## Session log

