# Discovery Record — {{project_name}}

> **Status:** Draft · **Owner:** {{product_owner}} · **Last updated:** {{last_updated}} · **Tier:** {{tier}} · **Related:** [Docs index](README.md) · [PRD](product/PRD.md) · [STATE](.start-from-here/STATE.md)

<!-- guidance: This is the SOURCE OF TRUTH for everything downstream. Record what the user actually said,
in their words where useful. Do NOT fill gaps with invented facts: use [TBD: question — owner] for unknowns,
> **ASSUMPTION:** for things you inferred, and > **PROPOSAL:** for defaults you recommended but the user has
not yet confirmed. When the user answers "use your recommendations", record each accepted default as an
Assumption (A-xx in §5, Source "Accepted recommendation" in §3); if it is a material choice (stack, hosting, license,
auth), also log it in §6 Decisions with "Decided by: Accepted recommendation". Update this file after every interview round. -->

<!-- guidance: Tier notes —
Lite: keep Calibration, Summary brief, answers for vision/users/scope/stack/data, Decisions log, Open questions. Collapse other domains into one "Other" table or mark N/A.
Standard: all domains; one row per material answer.
Enterprise: add stakeholder list with RACI, regulatory triggers with source of each, and a sign-off record for the brief (name, role, date).
All tiers: fill §11 Seed register — downstream docs (PRD, APP_FLOW, IMPLEMENTATION_PLAN) start from it, so a thin register produces thin docs.
Minimums: Lite ≥ 1 persona, ≥ 1 journey, every Must feature; Standard ≥ 2 personas, ≥ 3 journeys, every feature with MoSCoW, ≥ 3 risks;
Enterprise as Standard + one persona per role. See references/product-guide.md §1. -->

## 1. Calibration

| Item | Value | Notes |
| --- | --- | --- |
| Mode | {{new_project_or_existing_repo_or_update}} | {{e.g. "existing repo inspected at commit abc123"}} |
| Conversation language | {{language}} | |
| Documentation language | {{language}} | |
| Experience level | {{beginner_intermediate_expert}} | Controls explanation depth |
| Project type | {{e.g. web SaaS, mobile app, CLI, public API, library/SDK, data pipeline, desktop, embedded, game}} | |
| Team size & shape | {{e.g. solo / 3 engineers / multiple teams}} | |
| Open source? | {{yes_no_later}} | |
| Proposed tier | {{Lite_Standard_Enterprise}} | See §9 |
| Confirmed tier | {{tier}} | Confirmed by {{name}} on {{date}} |

## 2. Brief (one screen)

<!-- guidance: 5–8 lines a stakeholder can approve at a glance. This is what the user approves at the gate. -->

- **Product:** {{product_name}} — {{one_sentence_idea}}
- **Problem:** {{who_has_what_pain_today}}
- **Primary users:** {{primary_user_groups}}
- **MVP outcome:** {{what_is_true_when_v1_succeeds}}
- **Must-have capabilities:** {{short_list}}
- **Explicitly out of scope:** {{short_list}}
- **Key constraints:** {{budget_deadline_platform_compliance}}

## 3. Answers by domain

<!-- guidance: One table per domain, in interview order. "Source" = User | Repository (path) | Accepted recommendation | Assumption.
Mark a whole domain "N/A — reason" rather than deleting it. Keep answers short; detail goes in the downstream doc. -->

### 3.1 Vision & problem
| # | Question | Answer | Source |
| --- | --- | --- | --- |
| 1 | {{question}} | {{answer}} | {{source}} |

### 3.2 Users & stakeholders
| # | Question | Answer | Source |
| --- | --- | --- | --- |
| 1 | {{question}} | {{answer}} | {{source}} |

### 3.3 Scope & features
| # | Question | Answer | Source |
| --- | --- | --- | --- |
| 1 | {{question}} | {{answer}} | {{source}} |

### 3.4 Non-functional expectations
<!-- guidance: Capture numbers if the user gives them (e.g. "pages under 2 s on 4G", "CLI starts in < 200 ms", "99.9% monthly"). If they don't know, record the recommended default as a PROPOSAL. -->
| # | Question | Answer | Source |
| --- | --- | --- | --- |
| 1 | {{question}} | {{answer}} | {{source}} |

### 3.5 Platform & stack
| # | Question | Answer | Source |
| --- | --- | --- | --- |
| 1 | {{question}} | {{answer}} | {{source}} |

### 3.6 Data, security & compliance
| # | Question | Answer | Source |
| --- | --- | --- | --- |
| 1 | {{e.g. "Do you store personal data? Health? Payments? Children's data?"}} | {{answer}} | {{source}} |

### 3.7 Operations & deployment
| # | Question | Answer | Source |
| --- | --- | --- | --- |
| 1 | {{question}} | {{answer}} | {{source}} |

### 3.8 Team, open source & legal
| # | Question | Answer | Source |
| --- | --- | --- | --- |
| 1 | {{question}} | {{answer}} | {{source}} |

### 3.9 Constraints (budget, time, existing systems)
| # | Question | Answer | Source |
| --- | --- | --- | --- |
| 1 | {{question}} | {{answer}} | {{source}} |

## 4. Existing assets (brownfield only)

<!-- guidance: List what was found in the repository and must be preserved. Delete this section for new projects. -->

| Asset | Location | Observed fact | Implication |
| --- | --- | --- | --- |
| {{e.g. build config, existing README, CI workflow}} | {{path}} | {{fact}} | {{keep / merge / replace with approval}} |

## 5. Assumptions

| ID | Assumption | Why we assume it | Risk if wrong | Validate by |
| --- | --- | --- | --- | --- |
| A-{{nn}} | {{assumption}} | {{reason}} | {{impact}} | {{method_owner_date}} |

## 6. Decisions log

<!-- guidance: Every material choice made during discovery. Significant technical decisions also get an ADR (link it). Never record a decision the user did not make or accept. -->

| ID | Date | Decision | Options considered | Rationale | Decided by | ADR |
| --- | --- | --- | --- | --- | --- | --- |
| D-{{nn}} | {{date}} | {{decision}} | {{options}} | {{why}} | {{name_or_"Accepted recommendation"}} | {{ADR-0001_or_n_a}} |

## 7. Open questions

| ID | Question | Why it matters | Blocks | Owner | Needed by | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Q-{{nn}} | {{question}} | {{impact}} | {{doc_or_F-xx}} | {{owner}} | {{milestone}} | Open |

## 8. Signals for compliance & risk

<!-- guidance: Note triggers only (e.g. "EU users + personal data → GDPR likely applies"). Do not state that the project IS compliant.
Point to legal/COMPLIANCE.md if generated. This is not legal advice. -->

| Signal | Evidence from interview | Likely regime / concern | Follow-up |
| --- | --- | --- | --- |
| {{signal}} | {{evidence}} | {{e.g. GDPR, CCPA, HIPAA, PCI DSS, COPPA, accessibility law}} | {{Q-xx}} |

## 9. Tier rationale

- **Signals observed:** {{e.g. solo dev, no personal data, prototype → Lite; regulated data, SLAs, multi-tenant → Enterprise}}
- **Proposed tier:** {{tier}} because {{reason}}
- **Per-document overrides:** {{e.g. "Standard, but skip DESIGN_SYSTEM (CLI only); add COMPLIANCE (health data)"}}

## 10. Approval of the brief

| Name | Role | Decision | Date |
| --- | --- | --- | --- |
| {{name}} | {{role}} | {{Approved / Changes requested}} | {{date}} |

## 11. Seed register for downstream docs

<!-- guidance: Assign IDs here once, from the answers above; PRD and later docs reuse them exactly (never renumber).
Every row cites the question ID or answer it came from. Unknown details stay [TBD]; do not invent features to fill the table. -->

### 11.1 Personas and roles
| ID | Persona / role | Source | Primary? | Permissions (summary) |
| --- | --- | --- | --- | --- |
| P-01 | {{persona}} | {{USR-01}} | Yes | {{permissions}} |

### 11.2 Journeys
| ID | Journey | Actor | Source | Must features touched |
| --- | --- | --- | --- | --- |
| J-01 | {{journey}} | P-01 | {{JRN-01}} | {{F-01}} |

### 11.3 Features
<!-- guidance: Every feature the user named, with MoSCoW. "Done looks like" = the user's own words (SCO-04); the PRD turns it into AC. -->
| ID | Feature | Priority (MoSCoW) | Done looks like (user's words) | Source |
| --- | --- | --- | --- | --- |
| F-01 | {{feature}} | Must | {{definition_of_done_from_user}} | {{SCO-01}} |

### 11.4 Quality expectations, risks, and stateful entities
| Type | ID | Item | Source |
| --- | --- | --- | --- |
| NFR seed | NFR-01 | {{e.g. "pages load under 2 s on 4G"}} | {{NFR-Q01}} |
| Risk | R-01 | {{risk}} | {{TIM-04}} |
| Stateful entity | — | {{e.g. Order: Draft → Paid → Shipped → Delivered / Cancelled}} | {{JRN-05}} |
| Success signal | KPI-01 | {{metric_named_by_user}} | {{VIS-04}} |

### 11.5 Delivery constraints for the plan
| Item | Value | Source |
| --- | --- | --- |
| Deadline / launch window | {{date_or_none_or_[TBD]}} | {{TIM-01}} |
| Capacity | {{e.g. 10 h/week solo; 3 engineers}} | {{TIM-02}} |
| Executors | {{humans_and_or_AI_agents}} | {{TEA-*}} |
| Hard dependencies | {{vendors_approvals_store_review}} | {{TIM-05}} |

## 12. Change log
| Date | Change | Affected IDs / docs | By |
| --- | --- | --- | --- |
| {{date}} | {{change}} | {{F-xx, docs}} | {{name}} |

## Definition of done

- [ ] Calibration and tier are confirmed by the user, not just proposed.
- [ ] Every domain has answers or an explicit `N/A — reason`.
- [ ] Every inference is an Assumption; every unconfirmed default is a Proposal.
- [ ] All blocking unknowns are Q-xx entries with an owner.
- [ ] The brief (§2) is approved before any downstream document is generated.

### Completeness self-check
<!-- guidance: Tick every box before presenting the brief at the Phase 4 gate. Fix, or write "N/A — reason" next to the box. -->
- [ ] §1 calibration filled; tier confirmed (not only proposed).
- [ ] §2 brief ≤ 8 lines and matches §11 features and §3.3 scope.
- [ ] Every domain in §3 has rows or `N/A — reason`; every row has a Source.
- [ ] §11 meets the tier minimum: personas, journeys, every named feature with MoSCoW, NFR seeds, risks.
- [ ] Every ASSUMPTION block in any doc has an A-xx here; every blocking TBD has a Q-xx with owner.
- [ ] Every material decision is in §6 with who decided; ADR link where architectural.
- [ ] No invented facts, metrics, prices, legal claims, or secrets.
