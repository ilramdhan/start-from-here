# Compliance Register — {{project_name}}

> **Status:** Draft · **Owner:** {{owner}} · **Last updated:** {{yyyy_mm_dd}} · **Tier:** {{tier}} · **Related:** [PRIVACY_POLICY](PRIVACY_POLICY.md), [TERMS_OF_SERVICE](TERMS_OF_SERVICE.md), [SECURITY_ARCHITECTURE](../technical/SECURITY_ARCHITECTURE.md), [OPERATIONS](../technical/OPERATIONS.md), [ACCESSIBILITY](../../ACCESSIBILITY.md)

> [!CAUTION]
> **This is a draft, not legal advice. Have it reviewed by qualified counsel.** This working register helps the team track which regulations *may* apply and what is being done about them. Applicability decisions and obligations MUST be confirmed by qualified legal/compliance counsel. A row's status reflects verified evidence only — **never claim compliance, certification, or attestation that has not been achieved and evidenced.**

<!-- guidance: Purpose: a living register of regulatory and contractual regimes, whether each applies, why, obligations, controls, evidence, owner, status.
Use the legal-compliance primer (references/legal-compliance-primer.md) triggers: personal data → GDPR/UK GDPR/CCPA-CPRA/LGPD/PIPEDA/UU PDP...;
health data (US) → HIPAA; card data → PCI DSS; children → COPPA/GDPR Art. 8/age-appropriate design codes; EU AI systems → EU AI Act;
EU digital products with network functions → Cyber Resilience Act; EU online platforms → DSA; accessibility → EAA (EU), ADA/Section 508 (US);
financial → SOX/PSD2/DORA; B2B trust → SOC 2 / ISO/IEC 27001 (voluntary frameworks, customer-driven); email marketing → CAN-SPAM/ePrivacy.
"Applies?" values: Yes / No / Likely / Unknown — `Unknown` must have a Q-xx and an owner. Status values: Not started / In progress /
Implemented (unverified) / Verified (evidence linked) / Certified-Attested (only with report/certificate reference and date) / N/A.
Tier notes — Lite: omit unless regulated data; a 3-row table is fine. Standard (regulated data): full register for applicable regimes.
Enterprise: add control IDs mapped to frameworks, evidence locations, audit calendar, risk acceptance sign-offs, and review cadence. -->

## 1. Context

- Product / data summary: {{product_and_data_summary}} <!-- data classes, users' locations, hosting regions, B2B/B2C -->
- Jurisdictions of operation and users: {{jurisdictions}}
- Legal/compliance counsel: {{counsel_name_or_tbd}} · Compliance owner: {{compliance_owner}}
- Last counsel review: {{last_counsel_review_date_or_never}}

## 2. Regulatory register

| ID | Regime | Applies? | Why (trigger) | Key obligations | Controls (link) | Evidence | Owner | Status |
|---|---|---|---|---|---|---|---|---|
| CR-01 | GDPR / UK GDPR | {{applies}} | {{trigger}} | Lawful basis, transparency notice, data subject rights, records of processing (Art. 30), DPIA for high risk, processor DPAs, breach notice ≤72h, transfer safeguards | {{controls}} | {{evidence}} | {{owner}} | {{status}} |
| CR-02 | CCPA/CPRA & other US state privacy laws | {{applies}} | {{trigger}} | Notice at collection, rights to know/delete/correct/opt-out, sell/share opt-out, GPC, sensitive PI limits | {{controls}} | {{evidence}} | {{owner}} | {{status}} |
| CR-03 | ePrivacy / PECR (cookies) | {{applies}} | {{trigger}} | Prior consent for non-essential cookies; consent records | {{controls}} | {{evidence}} | {{owner}} | {{status}} |
| CR-04 | {{regime}} <!-- e.g. HIPAA, PCI DSS, COPPA, EU AI Act, EAA, CRA, DSA, SOC 2, ISO/IEC 27001, LGPD, UU PDP --> | {{applies}} | {{trigger}} | {{obligations}} | {{controls}} | {{evidence}} | {{owner}} | {{status}} |

## 3. Data processing inventory (summary)

<!-- guidance: Mirror of records of processing; must match PRIVACY_POLICY §3–7 and DATABASE.md. -->

| Processing activity | Data categories | Data subjects | Purpose / legal basis | Recipients / subprocessors | Transfers | Retention |
|---|---|---|---|---|---|---|
| {{activity}} | {{data_categories}} | {{data_subjects}} | {{purpose_and_basis}} | {{recipients}} | {{transfers}} | {{retention}} |

## 4. Subprocessors and agreements

<!-- guidance: Vendor agreement gate — no regulated data (PHI, card data, special-category data) may reach a vendor until its DPA/BAA is signed and recorded here. For HIPAA business associates, BAAs flow down to every sub-processor touching PHI; also add a HIPAA Security Rule risk-analysis row to §2. -->

| Vendor | Service | Data | Region | Agreement (DPA/BAA/SCCs) | Status |
|---|---|---|---|---|---|
| {{vendor}} | {{service}} | {{data}} | {{region}} | {{agreement}} | {{status}} |

## 5. Assessments

| Assessment | Required? | Location | Date | Next review |
|---|---|---|---|---|
| DPIA (GDPR Art. 35) | {{required}} | {{location}} | {{date}} | {{next_review}} |
| Threat model | Yes | [SECURITY_ARCHITECTURE](../technical/SECURITY_ARCHITECTURE.md) | {{date}} | {{next_review}} |
| Accessibility audit | {{required}} | [ACCESSIBILITY](../../ACCESSIBILITY.md) | {{date}} | {{next_review}} |
| {{other_assessment}} | {{required}} | {{location}} | {{date}} | {{next_review}} |

## 6. Incident and breach obligations

| Regime | Notify whom | Deadline | Runbook |
|---|---|---|---|
| {{regime}} | {{authority_or_individuals}} | {{deadline}} <!-- e.g. GDPR: supervisory authority within 72 hours of awareness --> | [OPERATIONS](../technical/OPERATIONS.md) |

## 7. Open items and risk acceptances

| ID | Item / gap | Risk | Decision (remediate / accept / transfer) | Approved by | Due |
|---|---|---|---|---|---|
| {{q_or_r_id}} | {{gap}} | {{risk}} | {{decision}} | {{approver}} | {{due_date}} |

## 8. Public claims policy

Marketing, sales, README, and website text may only reference compliance items with status **Verified** or **Certified-Attested**, using wording approved by {{claims_approver}}. Phrases like "GDPR compliant", "HIPAA certified" (no such official certification exists), or "SOC 2 certified" (SOC 2 is an attestation report) must not be used unless approved by counsel.

## 9. Review cadence

Reviewed {{review_cadence}} and whenever new data categories, jurisdictions, vendors, or AI features are introduced.

## Definition of done (this document)

- [ ] Every regime triggered by DISCOVERY.md answers is listed with Applies? and rationale; Unknowns have Q-xx and owners.
- [ ] Inventory matches PRIVACY_POLICY.md and DATABASE.md; vendors match ARCHITECTURE.md.
- [ ] No status above "Implemented (unverified)" without linked evidence.
- [ ] Counsel review recorded (or scheduled with owner and date).
- [ ] No `{{placeholders}}` or guidance comments remain.
