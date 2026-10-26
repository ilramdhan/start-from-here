# Workflow — detailed procedure

This file expands the phases in `SKILL.md`. Each phase has entry criteria, steps, exit criteria, and exact gate wording. Gates marked **STOP** MUST end your message; do not continue in the same message.

Translate gate wording into the user's conversation language. Keep file names and IDs in English.

---

## Phase 0 — Orient

**Entry:** the skill was triggered (any quick command or a project-idea request).

**Steps**

1. Determine capabilities:
   - Can you read files in the user's project? Can you write files? Can you run commands?
   - If unsure, try a harmless read of the project root listing. If that fails, assume chat-only.
   - Record `output_mode: filesystem` or `output_mode: chat-only`.
   - Estimate the context budget (model/tool, stated context size, chat-only UI, tier). Propose session mode when `session-mode.md` §1 applies; record `Mode: single | session` in STATE.md Flags.
2. Determine project mode, in this precedence:
   1. `docs/.start-from-here/STATE.md` exists → **resume** (see "Resume procedure").
   2. The user asked to audit or update docs → **update** (go to Phase 6 or the change-propagation rule).
   3. The folder contains source code, manifests, CI config, or existing docs → **brownfield** (read `existing-project-mode.md`).
   4. Otherwise → **new**.
3. In chat-only mode, ask the user whether they already have a project or docs. If yes, ask them to paste the file list and key files (README, manifest, existing docs).
4. Send the orientation message (template below).
5. In filesystem mode, create `docs/.start-from-here/STATE.md` with `phase: 0-orient`.

**Orientation message template**

> I'll help you plan this project before any code is written. Here's how it works:
> 1. A few calibration questions (language, experience, size).
> 2. A short interview in short rounds (at most 7 questions). Every question has a recommended answer; you can say "use your recommendations".
> 3. If you haven't chosen a tech stack, I'll propose 2–3 options.
> 4. You approve a one-page brief.
> 5. I write the documents, you review them in batches.
> 6. I check them for consistency and hand over a readiness checklist and a first implementation prompt.
> I will not write application code, install anything, or deploy.

**Exit:** mode and output mode known, and the user has not objected.

**Gate (only if mode is ambiguous):**
> I found existing files here: {{short list}}. Is this the project we are planning (I'll treat it as an existing project), or should I plan a new project in a separate folder? **STOP.**

---

## Phase 1 — Calibrate

**Entry:** Phase 0 complete.

**Steps**

1. Send Round 0 (language, experience, idea, size signals) as one message. See `SKILL.md` Phase 1 for wording.
2. **STOP** and wait.
3. From the answers, set: `language_conversation`, `language_docs`, `experience`, and compute a tier score (see `tiering-and-doc-matrix.md`).
4. Build the document list for the tier with conditional docs resolved where already known (e.g. "no UI yet known" → keep DESIGN_SYSTEM as "Conditional — pending").
5. Present the calibration summary.

**Gate wording**

> **Calibration**
> - Conversation language: {{lang}} · Document language: {{lang}}
> - Explanation style: {{beginner/intermediate/expert}}
> - Proposed tier: **{{tier}}** — {{one-line reason}}
> - Documents I plan to write: {{list grouped Product / Technical / Engineering / Legal / Repo}}
>
> Reply "ok" to confirm, or change anything (e.g. "use Standard", "skip GIT_WORKFLOW", "add COOKIE_POLICY", "add DATA_PROCESSING_AGREEMENT"). **STOP.**

**Exit:** user confirmed tier and doc list. STATE.md updated (`phase: 1-calibrate` → `2-discover`).

---

## Phase 2 — Discover

**Entry:** tier confirmed.

**Steps**

1. Load the round plan for the tier from `discovery-question-bank.md`.
2. For each round:
   1. Select questions for the round's domains filtered by tier tag and adaptive-skip rules.
   2. Remove questions already answered (in Round 0, in the repo, or in a previous answer).
   3. Cap at 7 questions. If more remain, move the lower-priority ones to the next round.
   4. Format each question: number, question, one-line "why" (beginner/intermediate only), labeled default.
   5. **STOP** and wait.
   6. Parse answers. Unanswered numbered questions → ask again once in the next round, or adopt the default as an ASSUMPTION if the user said "use your recommendations" or "skip".
   7. Reflect back (3–6 lines), list contradictions, update DISCOVERY.md draft and STATE.md (`Domains answered`).
3. End the phase when all tier-required domains are covered or the user says "skip to generation".

**Round message template**

> **Round {{n}} of ~{{total}} — {{Domain A}}{{ & Domain B}}**
> 1. {{question}}
>    *Why:* {{one line}} · **Recommended:** {{default}}  ← experts: drop *Why* and write **Default:**
> 2. …
>
> Answer by number. You can say "use your recommendations" for any you are unsure about. **STOP.**

**Reflect-back template**

> Got it. So far: {{3–6 line summary}}.
> ⚠️ Possible conflict: {{conflict}} — which should win?
> Next: Round {{n+1}} — {{domains}}.

**"Skip to generation" handling**

1. List required domains still unanswered for the tier.
2. Say which defaults you will apply (one line each).
3. Record each as `> **ASSUMPTION:**` in DISCOVERY.md.
4. Go to Phase 3 (if stack undecided — still STOP for the pick) or the Phase 4 brief gate.

**Exit:** required domains answered or assumed; contradictions resolved or listed as Q-xx.

---

## Phase 3 — Recommend

**Entry:** stack, architecture style, hosting, database, auth approach, or license is undecided, or the user's choice conflicts with constraints (e.g. "beginner, no budget, wants Kubernetes").

**Steps**

1. Identify the archetype and constraints. Read `stack-recommendation.md`.
2. Build 2–3 options. Score them with the matrix if Standard/Enterprise.
3. Present the table and one **Recommended** option with a reason tied to the user's own answers ("because you said …").
4. **STOP.**
5. Record the decision in DISCOVERY.md "Decisions" with `decided_by: user` (or `decided_by: default, accepted by user`).
6. Standard/Enterprise: queue an ADR for each major decision (stack, database, hosting, auth, architecture style, license).

**Gate wording**

> **Recommendation: {{decision area}}**
> | Option | What it is | Best for | Trade-offs | Running cost / effort |
> |---|---|---|---|---|
> | A (Recommended) | … | … | … | … |
> | B | … | … | … | … |
> **Why A for you:** {{2–3 sentences referencing their answers}}
> Pick A, B, C, or describe your own. **STOP.**

**Exit:** each undecided area has a user-approved decision or an explicit `[TBD]` the user accepts.

---

## Phase 4 — Confirm brief

**Entry:** Phase 2 and 3 exit criteria met.

**Steps**

1. Finalize `docs/DISCOVERY.md` using `assets/templates/docs/DISCOVERY.md` if available. Sections: Summary; Calibration; Answers by domain (with question IDs); Decisions (D-xx); Assumptions; Open questions (Q-xx); Compliance triggers; Approved document list.
2. Assign IDs now: personas P-xx, features F-xx (MoSCoW priority), initial NFR-xx, risks R-xx. Later docs MUST reuse them.
3. Present the brief (≤25 lines).
4. **STOP.**

**Gate wording**

> **Project brief — please approve**
> - **Problem:** …
> - **Users:** P-01 …, P-02 …
> - **MVP (Must):** F-01 …, F-02 …, F-03 …
> - **Later (Should/Could):** …
> - **Out of scope:** …
> - **Stack:** … (decided / proposed)
> - **Data & compliance:** … (triggers: …)
> - **Tier:** … · **Documents:** {{count}} ({{list}})
> - **Open questions:** Q-01 …
>
> Reply "approve" to start writing documents, or tell me what to change. Nothing else is written until you approve. **STOP.**

**Exit:** user approved. DISCOVERY.md status → `Approved`. STATE.md `phase: 5-generate`.

---

## Phase 5 — Generate

**Entry:** brief approved.

**Steps per document**

1. Check the catalog entry (`document-catalog.md`) for inputs and done-criteria.
2. In brownfield mode, if the file exists, prepare a merge proposal instead of writing (see `existing-project-mode.md`).
3. Load the template from `assets/templates/<path>` if available.
4. Fill from DISCOVERY.md and upstream docs. Never introduce a new feature, role, entity, or NFR silently; if you need one, add it as a PROPOSAL and a Q-xx.
5. Apply tier depth. Keep every H2 section of the template; a section that does not apply becomes one line `N/A — reason`. Depth changes by tier; coverage never does.
6. Remove all `<!-- guidance` comments and `{{placeholders}}`.
7. Set header: `Status: Draft`, today's date, tier, related links.
8. Write the file (filesystem) or output the fenced block (chat-only).
9. Update STATE.md documents table.

**Batch review gate wording**

> **Review batch {{n}}/{{total}} — {{group}}**
> {{for each doc}}
> - `{{path}}` — {{3–5 line summary}}. New open items: {{TBD/PROPOSAL list or "none"}}.
>
> Reply "approve" (all), "approve {{doc}}", or describe changes. **STOP.**

On approval set each doc's header and STATE.md status to `Approved`.

**Exit:** all docs in the approved list are generated and Approved (or the user explicitly accepts Draft with reasons recorded).

### Generation order (MUST)

| # | Document | Depends on |
|---|---|---|
| 1 | docs/DISCOVERY.md | interview |
| 2 | docs/product/PRD.md | DISCOVERY |
| 3 | docs/product/APP_FLOW.md | PRD |
| 4 | docs/product/DESIGN_SYSTEM.md | PRD, APP_FLOW |
| 5 | docs/technical/TRD.md | PRD, APP_FLOW |
| 6 | docs/technical/ARCHITECTURE.md | TRD, decisions |
| 7 | docs/decisions/*.md | ARCHITECTURE, decisions |
| 8 | docs/technical/DATABASE.md | PRD, ARCHITECTURE |
| 9 | docs/technical/API.md | APP_FLOW, ARCHITECTURE, DATABASE |
| 10 | docs/technical/SECURITY_ARCHITECTURE.md | ARCHITECTURE, DATABASE, API |
| 11 | docs/technical/TESTING.md | PRD, TRD, SECURITY_ARCHITECTURE |
| 12 | docs/technical/OPERATIONS.md | ARCHITECTURE, TRD NFRs |
| 13 | docs/engineering/CODE_STYLE.md | ARCHITECTURE, stack |
| 14 | docs/engineering/GIT_WORKFLOW.md | team, CODE_STYLE |
| 15 | docs/engineering/AI_GUIDELINES.md | CODE_STYLE, SECURITY_ARCHITECTURE, TESTING |
| 16 | docs/technical/IMPLEMENTATION_PLAN.md | all technical docs |
| 17 | docs/legal/* | DATABASE, SECURITY_ARCHITECTURE, compliance triggers |
| 18 | README, LICENSE, CHANGELOG, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY.md, SUPPORT, ACCESSIBILITY, .github/* | all above |
| 19 | AGENTS.md (+ optional CLAUDE.md, GEMINI.md, .github/copilot-instructions.md) | all above |
| 20 | docs/README.md | all above |

### Review batching per tier

| Tier | Batch | Documents |
|---|---|---|
| Lite | 1 Product | PRD, APP_FLOW (if UI) |
| Lite | 2 Technical | ARCHITECTURE, DATABASE (if data), SECURITY_ARCHITECTURE (short), TESTING, IMPLEMENTATION_PLAN |
| Lite | 3 Engineering, legal, repo | CODE_STYLE, AI_GUIDELINES, legal (if any), README, LICENSE, CONTRIBUTING/SECURITY.md (if OSS/public), AGENTS.md, docs/README |
| Standard | 1 Product | PRD, APP_FLOW, DESIGN_SYSTEM |
| Standard | 2 Shape | TRD, ARCHITECTURE, ADRs |
| Standard | 3 Data & interfaces | DATABASE, API, SECURITY_ARCHITECTURE |
| Standard | 4 Quality & delivery | TESTING, OPERATIONS, IMPLEMENTATION_PLAN |
| Standard | 5 Engineering | CODE_STYLE, GIT_WORKFLOW, AI_GUIDELINES |
| Standard | 6 Legal & repo | legal docs, root community files, .github/*, AGENTS.md, docs/README |
| Enterprise | one per doc | Every document reviewed alone, except: all ADRs as one batch, legal docs as one batch, .github/* and small community files as one batch; COMPLIANCE reviewed with SECURITY_ARCHITECTURE owner present if possible |

---

## Change-propagation rule

When any answer, decision, or document changes:

1. Update `docs/DISCOVERY.md` first (record the change, date, and who decided).
2. Look up affected docs in the map below. Update each one.
3. Set any previously `Approved` doc that changed to `In review`.
4. For a reversed architectural decision, write a new ADR that supersedes the old one; set the old ADR status to `Superseded by ADR-xxxx`. Never delete ADRs.
5. Add a CHANGELOG `Unreleased` note only if the project already has releases.
6. Tell the user the list of changed docs and ask for re-approval in one batch. **STOP.**

| Change | Update these docs |
|---|---|
| Problem, vision, success metric | PRD, README, AGENTS.md (summary line) |
| Persona / user type | PRD, APP_FLOW, DESIGN_SYSTEM, SECURITY_ARCHITECTURE (roles), TESTING |
| Feature added/removed/re-prioritized | PRD, APP_FLOW, DESIGN_SYSTEM, TRD, DATABASE, API, TESTING, IMPLEMENTATION_PLAN, README (features) |
| Screen / flow | APP_FLOW, DESIGN_SYSTEM, TESTING (E2E) |
| Role / permission | PRD, SECURITY_ARCHITECTURE (authZ matrix), DATABASE (access rules), API (auth), TESTING (denial tests) |
| Entity / field | DATABASE, API, SECURITY_ARCHITECTURE (data classification), PRIVACY_POLICY (if personal), TESTING |
| Personal / sensitive data collected | DATABASE, SECURITY_ARCHITECTURE, PRIVACY_POLICY, COOKIE_POLICY, COMPLIANCE, TERMS_OF_SERVICE, DATA_PROCESSING_AGREEMENT / BUSINESS_ASSOCIATE_AGREEMENT (if generated) |
| B2B / processor / PHI status (CMP-06/07/08) | doc set (add/remove MSA, DPA, BAA — show a diff first), COMPLIANCE, PRIVACY_POLICY (controller vs processor roles), TERMS_OF_SERVICE, tier (PHI override) |
| Sub-processor / vendor receiving personal data or PHI | COMPLIANCE §4, PRIVACY_POLICY, DATA_PROCESSING_AGREEMENT Annex III, BUSINESS_ASSOCIATE_AGREEMENT §5 |
| SLO / availability target | OPERATIONS, TRD, MASTER_SERVICES_AGREEMENT §10 (if generated) |
| Target region / market | legal docs, COMPLIANCE, OPERATIONS (data residency), PRD (i18n) |
| NFR number | TRD, ARCHITECTURE, OPERATIONS (SLOs), TESTING (perf tests) |
| Stack / framework / language | ARCHITECTURE, ADR (new), CODE_STYLE, TESTING (tools), OPERATIONS (CI), AI_GUIDELINES, AGENTS.md, README, IMPLEMENTATION_PLAN |
| Hosting / deploy target | ARCHITECTURE, OPERATIONS, ADR, SECURITY_ARCHITECTURE, COMPLIANCE (residency) |
| Integration / third-party service | TRD, ARCHITECTURE, SECURITY_ARCHITECTURE (secrets, trust boundary), PRIVACY_POLICY (sub-processors), OPERATIONS |
| Auth method | SECURITY_ARCHITECTURE, ARCHITECTURE, API, APP_FLOW, TESTING |
| License | LICENSE, README, CONTRIBUTING, package manifest note in CODE_STYLE, AGENTS.md |
| Team / owners | CODEOWNERS, GIT_WORKFLOW, OPERATIONS (on-call), every doc header Owner, SUPPORT |
| Open source vs closed | CONTRIBUTING, CODE_OF_CONDUCT, SECURITY.md, .github/*, README, LICENSE |
| Tier | doc set (add/remove), depth of every doc — show a diff first |
| Accessibility target | DESIGN_SYSTEM, ACCESSIBILITY.md, TESTING, PRD NFRs |
| AI/LLM feature | PRD, TRD, ARCHITECTURE, SECURITY_ARCHITECTURE (prompt injection, data use), PRIVACY_POLICY, COMPLIANCE (EU AI Act), TESTING (evals) |

---

## Phase 6 — Audit

**Entry:** all approved-list docs generated, or the user asked `audit docs`.

**Steps**

1. Run the checklist in `consistency-audit.md`.
2. If you can run commands and Node ≥18 is present: `node <skill-dir>/scripts/check-docs.mjs <projectDir>`. Include its output summary. If not, say "Automated check not run (no command access)". Never claim it ran if it did not.
3. Fix issues that do not need new information. Record issues needing the user as Q-xx.
4. Present the audit report (format in `consistency-audit.md`).
5. **STOP.**

**Gate wording**

> **Consistency audit:** {{errors}} errors, {{warnings}} warnings, {{tbd}} open [TBD] items. I fixed: {{list}}.
> Needs your decision: {{list}}.
> Reply with answers, "fix the rest with your recommendations", or "proceed to handoff". **STOP.**

**Exit:** zero errors, or the user accepts remaining errors (recorded in STATE.md and DISCOVERY.md).

---

## Phase 7 — Handoff

**Entry:** audit exit met.

**Steps**

1. Update `docs/README.md` status table.
2. Update STATE.md: `phase: 7-handoff`, `next_step: implementation in a separate session`.
3. Present readiness checklist, open questions, first implementation prompt (see SKILL.md).
4. Mention how to come back: "Say `update <doc>` when something changes, `audit docs` before major milestones, and `resume` in a new session."
5. **STOP.** Do not begin implementation even if asked in the same breath; say implementation should start as a new task using the first implementation prompt, and that the user may of course ask their agent to do that next.

---

## Resume procedure

0. If `docs/.start-from-here/HANDOVER.md` exists (session mode), read it FIRST: it carries the ID registry, quality notes, the current WP and its lean reading list. Then follow `session-mode.md` §5.2 — load only that WP's reading list instead of step 2 below.
1. Read `docs/.start-from-here/STATE.md`. If it is missing but `docs/DISCOVERY.md` exists, rebuild STATE.md from DISCOVERY.md and the doc headers, then show it to the user.
2. Read `docs/DISCOVERY.md` and the headers (first 5 lines) of every doc in the documents table.
3. Check drift: docs on disk not in STATE, or STATE entries whose file is missing. Fix the table.
4. Re-apply calibration (language, experience, tier) from STATE.md without asking again.
5. Summarize in ≤8 lines: project, tier, phase, docs approved/total, open questions, next step.
6. Ask: "Continue with {{next_step}}?" **STOP.**
7. Continue from the recorded phase. If mid-round in Phase 2, re-ask only unanswered questions of that round.

In chat-only mode, ask the user to paste HANDOVER.md (if they have one), STATE.md and DISCOVERY.md (and any doc to be changed). In session mode, ask only for HANDOVER.md, STATE.md and the upstream sections listed in HANDOVER §7.

**Session mode handover.** At the end of every session-mode session, on `next session` / `handover`, and whenever you sense you are near your context limit: update STATE.md (`current_wp`, documents table, `next_step`), overwrite `docs/.start-from-here/HANDOVER.md` from `assets/templates/docs/.start-from-here/HANDOVER.md`, print the next-session prompt, and stop. Chat-only: print HANDOVER and STATE as fenced blocks for the user to save. Full procedure: `session-mode.md`.

---

## STATE.md full template

```markdown
# start-from-here state

> Machine- and human-readable progress file. Any AI agent can resume from it. Do not store secrets here.

## Session
- skill_version: <metadata.version from SKILL.md frontmatter>
- project: {{project_name}}
- mode: new | brownfield | update
- output_mode: filesystem | chat-only
- language_conversation: {{e.g. English}}
- language_docs: {{e.g. English}}
- experience: beginner | intermediate | expert
- tier: Lite | Standard | Enterprise
- phase: 0-orient | 1-calibrate | 2-discover | 3-recommend | 4-brief | 5-generate | 6-audit | 7-handoff
- current_round: {{n or -}}
- current_wp: {{- | WP1 … WP9 (session mode only)}}
- next_step: {{one sentence}}
- last_updated: {{YYYY-MM-DD}}

## Domains
| Domain | Status | Notes |
|---|---|---|
| vision | answered / assumed / pending / n/a | |
| business | | |
| users | | |
| journeys | | |
| scope | | |
| data | | |
| nfr | | |
| platform-stack | | |
| architecture-integrations | | |
| security-identity | | |
| privacy-compliance | | |
| ai-ml | | |
| a11y-i18n | | |
| design-brand | | |
| operations | | |
| observability-support | | |
| team-process | | |
| open-source | | |
| legal-licensing | | |
| timeline-budget-risks | | |

## Flags
- has_ui: yes | no | unknown
- has_api: yes | no | unknown
- stores_data: yes | no | unknown
- personal_data: yes | no | unknown
- b2b: yes | no | unknown
- processor_for_customers: yes | no | unknown
- phi_for_covered_entities: yes | no | unknown
- regulated_data: none | health | payment | children | finance | education | other
- open_source: yes | no | unknown
- public_facing: yes | no | unknown
- app_store: yes | no | unknown
- ai_features: yes | no | unknown
- regions: {{list}}
- ai_tools_used: {{e.g. Claude Code, Cursor, Copilot}}
- Mode: single | session
- model_context: {{e.g. 32k local model / large / unknown}}

## Documents
| Path | Applicability | Status | Last updated |
|---|---|---|---|
| docs/DISCOVERY.md | Required | Draft | |
| docs/product/PRD.md | Required | Not started | |

## Decisions
| ID | Decision | Decided by | Date | ADR |
|---|---|---|---|---|
| D-01 | | | | |

## Open questions
| ID | Question | Owner | Blocking? |
|---|---|---|---|
| Q-01 | | | yes/no |

## Change log
- {{YYYY-MM-DD}}: {{what changed}}
```

Applicability values: `Required` (tier-required, or conditional and the condition is true), `Optional (on)` (user opted in), `Skipped (reason)` (not applicable or toggled off). Use exactly these words: `scripts/check-docs.mjs` reports a missing file for every `Required`/`Optional (on)` row and ignores `Skipped` rows, even for tier-core docs.

Status values for documents: `Not started`, `Draft`, `In review`, `Approved`, `Skipped`, `Merge proposed` (brownfield).

SKILL.md shows a compact version of this template (Flags on one line, 10 grouped domain keys instead of the 20 question-bank domains, no Last updated column); both are valid and parse the same way. Grouping: users = users+journeys; scope = scope; stack = platform-stack+architecture-integrations; security = security-identity+privacy-compliance+ai-ml; nfr = nfr+a11y-i18n+design-brand; ops = operations+observability-support; team-oss-legal = business+team-process+open-source+legal-licensing; constraints = timeline-budget-risks.
