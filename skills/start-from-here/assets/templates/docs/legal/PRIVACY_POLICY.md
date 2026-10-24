# Privacy Policy — {{product_name}}

> **Status:** Draft · **Owner:** {{owner}} · **Last updated:** {{yyyy_mm_dd}} · **Tier:** {{tier}} · **Related:** [COMPLIANCE](COMPLIANCE.md), [COOKIE_POLICY](COOKIE_POLICY.md), [TERMS_OF_SERVICE](TERMS_OF_SERVICE.md), [DATABASE](../technical/DATABASE.md), [SECURITY_ARCHITECTURE](../technical/SECURITY_ARCHITECTURE.md)

> [!CAUTION]
> **This is a draft, not legal advice. Have it reviewed by qualified counsel.** This document was generated from a template and MUST be reviewed and approved by qualified legal counsel in every relevant jurisdiction before publication or use. It does not establish compliance with any law. Remove this notice only after counsel has approved the final text.

<!-- guidance: Purpose: the public notice telling people what personal data is processed, why, and their rights.
RULES FOR THE AI:
1. Build it ONLY from facts in DISCOVERY.md, DATABASE.md (entities/fields/retention), ARCHITECTURE.md (subprocessors/hosting regions),
   SECURITY_ARCHITECTURE.md, and COMPLIANCE.md. Every data category, purpose, and recipient listed here must exist in those docs, and vice versa.
2. Never invent subprocessors, retention periods, certifications, legal bases, DPO names, or addresses — use `[TBD: … — owner]`.
3. Never state or imply compliance/certification (e.g. "GDPR compliant", "HIPAA certified", "SOC 2 certified") unless COMPLIANCE.md records it as achieved with evidence.
4. Include jurisdiction sections only when applicable (see legal-compliance primer): EEA/UK (GDPR/UK GDPR), California (CCPA/CPRA) and other
   US state privacy laws, Brazil (LGPD), Canada (PIPEDA), Indonesia (UU PDP), etc. Delete the rest.
5. Write in plain language (GDPR Art. 12 requires concise, intelligible, easily accessible information). Keep the version history.
Tier notes — Lite (personal data present): sections 1–5, 7, 8, 12, 14 in short form. Standard: all applicable sections.
Enterprise: add a DPA reference for B2B customers, records-of-processing link, DPIA reference for high-risk processing, and
jurisdiction-specific annexes. If the product is B2B and you act as a processor for customer data, say so and explain that the
customer's privacy policy governs that data. -->

**Effective date:** {{effective_date}} · **Version:** {{policy_version}}

## 1. Who we are (controller)

{{legal_entity_name}} ("**we**", "**us**") is the controller responsible for personal data processed through {{product_name}} ({{product_url}}).

- Registered address: {{registered_address}}
- Company/registration number: {{company_registration_number}}
- Privacy contact: {{privacy_contact_email}}
- Data Protection Officer (if appointed/required): {{dpo_name_and_contact_or_not_appointed}}
- EU representative (GDPR Art. 27, if established outside the EEA and required): {{eu_representative_or_not_applicable}}
- UK representative (UK GDPR Art. 27, if required): {{uk_representative_or_not_applicable}}

## 2. Scope

This policy covers {{scope_description}} <!-- e.g. our website, web and mobile apps, and related services -->. It does not cover third-party sites or services linked from {{product_name}}, or data we process on behalf of business customers as a processor (governed by our agreement with that customer: {{dpa_link_or_na}}).

## 3. Personal data we collect

<!-- guidance: One row per category. Derive from DATABASE.md entities, analytics/logging in OPERATIONS.md, and integrations. Flag special-category
or sensitive data (health, biometrics, precise geolocation, children's data, government IDs, financial account data) explicitly. -->

| Category | Examples | Source | Required? |
|---|---|---|---|
| Account data | {{account_data_examples}} | You | {{required_or_optional}} |
| Content you provide | {{user_content_examples}} | You | {{required_or_optional}} |
| Usage and device data | {{usage_data_examples}} | Automatically (cookies/SDKs/logs) | {{required_or_optional}} |
| Payment data | {{payment_data_examples}} — processed by {{payment_processor}}; we do not store full card numbers | You / processor | {{required_or_optional}} |
| Communications | {{communications_examples}} | You | {{required_or_optional}} |
| Data from third parties | {{third_party_data_examples}} | {{third_party_sources}} | {{required_or_optional}} |

Sensitive / special-category data: {{sensitive_data_statement}} <!-- e.g. "We do not intentionally collect special-category data." -->

## 4. How we use personal data and our legal bases

<!-- guidance: GDPR requires a lawful basis per purpose (Art. 6: consent, contract, legal obligation, vital interests, public task,
legitimate interests; Art. 9 condition for special categories). Where legitimate interests are relied on, name the interest.
If GDPR does not apply, keep the Purpose column and remove the Legal basis column.
B2B processor / HIPAA business associate: for data processed on customers' behalf the CUSTOMER is the controller (covered entity);
say so in §1, point patients/end users to the customer's notice (and HIPAA Notice of Privacy Practices), and keep this policy for
data where you are the controller (account admins, website visitors). Health data under GDPR also needs an Art. 9(2) condition row. -->

| Purpose | Data categories | Legal basis (GDPR/UK GDPR) |
|---|---|---|
| Provide and operate the service, create accounts | {{data_categories}} | Performance of a contract |
| Security, fraud and abuse prevention | {{data_categories}} | Legitimate interests ({{interest}}) |
| Customer support | {{data_categories}} | Contract / legitimate interests |
| Product analytics and improvement | {{data_categories}} | {{consent_or_legitimate_interests}} |
| Marketing communications | {{data_categories}} | Consent (opt-out any time) |
| Legal compliance (tax, accounting, lawful requests) | {{data_categories}} | Legal obligation |

Automated decision-making / profiling with legal or similarly significant effects: {{automated_decision_statement}} <!-- "We do not…" or describe logic, significance, consequences, and right to human review. -->

AI/ML processing: {{ai_processing_statement}} <!-- e.g. whether user content is used to train models, which AI providers receive data, opt-out. Delete if N/A. -->

## 5. How we share personal data

We do not sell personal data{{sale_statement_qualifier}}. We share it only as described below.

| Recipient (subprocessor/category) | Purpose | Data | Location |
|---|---|---|---|
| {{subprocessor_name}} | {{purpose}} | {{data_categories}} | {{country_or_region}} |

Other disclosures: professional advisers; authorities when legally required; a successor in a merger or acquisition (with notice); others with your consent. Subprocessor list maintained at: {{subprocessor_list_url_or_na}}.

## 6. International transfers

<!-- guidance: Required if data leaves the EEA/UK (or other restricted regions). Name the safeguard actually used; do not assume. -->

{{transfer_statement}} <!-- e.g. "Data is hosted in [region]. Where transferred outside the EEA/UK we rely on an adequacy decision (incl. the EU-US Data Privacy Framework where the recipient is certified) or the European Commission's Standard Contractual Clauses / UK IDTA/Addendum." -->

## 7. Retention

| Data category | Retention period | Reason |
|---|---|---|
| {{data_category}} | {{retention_period}} | {{retention_reason}} |

Must match the retention rules in [DATABASE.md](../technical/DATABASE.md). After the period, data is deleted or irreversibly anonymized.

## 8. Your rights

Depending on where you live, you may have the right to: access; rectification; erasure; restriction; data portability; objection (including to direct marketing and processing based on legitimate interests); withdraw consent at any time (without affecting prior processing); not be subject to solely automated decisions with significant effects; and lodge a complaint with a supervisory authority.

How to exercise: {{rights_request_method}} <!-- e.g. in-app settings + email; state verification steps -->. We respond within {{response_time}} <!-- GDPR: one month, extendable; CCPA: 45 days, extendable --> and will not discriminate against you for exercising your rights.

### 8a. EEA / UK residents
Supervisory authority: your local data protection authority, or {{lead_supervisory_authority}}. <!-- delete if GDPR N/A -->

### 8b. California and other US state residents
<!-- guidance: CCPA/CPRA applies only above thresholds (check primer). If applicable include: categories collected in last 12 months,
sources, business/commercial purposes, categories disclosed, whether you "sell" or "share" (cross-context behavioral advertising),
sensitive PI use and the "Limit the Use" right, right to know/delete/correct/opt-out, authorized agents, Global Privacy Control
honoring, notice at collection, and a "Do Not Sell or Share My Personal Information" link if selling/sharing. Delete if N/A. -->
{{us_state_privacy_section}}

### 8c. Other jurisdictions
{{other_jurisdiction_sections}} <!-- e.g. LGPD (Brazil), PIPEDA (Canada), UU PDP (Indonesia), APPI (Japan), PDPA (Singapore). Delete if none. -->

## 9. Children

{{product_name}} is not directed to children under {{minimum_age}} <!-- 13 under COPPA (US); 13–16 under GDPR Art. 8 depending on member state -->, and we do not knowingly collect their personal data. If you believe a child has provided us data, contact {{privacy_contact_email}} and we will delete it. <!-- If the product IS directed to children, COPPA/GDPR-K/age-appropriate design codes apply: STOP and require counsel. -->

## 10. Security

We use technical and organizational measures appropriate to the risk, including {{security_measures_summary}} <!-- e.g. encryption in transit (TLS) and at rest, access controls, logging — only measures actually in SECURITY_ARCHITECTURE.md -->. No method of transmission or storage is completely secure. We will notify you and authorities of personal data breaches where required by law.

## 11. Cookies and similar technologies

See our [Cookie Policy](COOKIE_POLICY.md). <!-- or summarize here if no separate policy; delete if no cookies/trackers -->

## 12. Changes to this policy

We will post changes on this page and update the effective date. For material changes we will {{material_change_notice_method}} <!-- e.g. notify by email or in-app at least 30 days before they take effect -->.

## 13. Version history

| Version | Effective date | Summary of changes |
|---|---|---|
| {{policy_version}} | {{effective_date}} | Initial version |

## 14. Contact

Questions or requests: {{privacy_contact_email}} · Postal: {{registered_address}}

## Definition of done (this document)

- [ ] Reviewed and approved by qualified counsel (name/date recorded in COMPLIANCE.md); CAUTION notice removed only then.
- [ ] Every data category, purpose, recipient, transfer, and retention period matches DATABASE.md, ARCHITECTURE.md, and COMPLIANCE.md.
- [ ] Only applicable jurisdiction sections kept; no unverified compliance or certification claims.
- [ ] Contact, controller, DPO/representative details are real or marked `[TBD]`.
- [ ] No `{{placeholders}}` or guidance comments remain.
