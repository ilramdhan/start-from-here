# Terms of Service — {{product_name}}

> **Status:** Draft · **Owner:** {{owner}} · **Last updated:** {{yyyy_mm_dd}} · **Tier:** {{tier}} · **Related:** [PRIVACY_POLICY](PRIVACY_POLICY.md), [COMPLIANCE](COMPLIANCE.md), [PRD](../product/PRD.md)

> [!CAUTION]
> **This is a draft, not legal advice. Have it reviewed by qualified counsel.** This document was generated from a template and MUST be reviewed and approved by qualified legal counsel before publication or use. Enforceability of terms (especially liability limits, arbitration, and consumer-facing clauses) varies by jurisdiction. Remove this notice only after counsel has approved the final text.

<!-- guidance: Purpose: the contract between the provider and users. Create only if the product has users/accounts, SaaS, paid plans,
user-generated content, or an API with usage terms. For an open-source library with no service, the LICENSE governs instead — do not create this.
RULES FOR THE AI: derive features, plans, roles, and restrictions from PRD.md and DISCOVERY.md; never invent prices, SLAs, refund terms,
governing law, or company details — use `[TBD: … — owner]`. Never promise uptime/SLA unless OPERATIONS.md defines it and the user approves.
Never claim certifications. Consumer-protection law (e.g. EU consumer rights, UK CRA, US state auto-renewal laws) may override clauses — flag for counsel.
Tier notes — Lite: sections 1–6, 9–12, 15 short. Standard: all applicable. Enterprise/B2B: usually a separate negotiated MSA + DPA + SLA (templates: MASTER_SERVICES_AGREEMENT.md, DATA_PROCESSING_AGREEMENT.md, BUSINESS_ASSOCIATE_AGREEMENT.md);
keep this for self-serve users and link those agreements. -->

**Effective date:** {{effective_date}} · **Version:** {{terms_version}}

## 1. Agreement

These Terms of Service ("**Terms**") are a binding agreement between you and {{legal_entity_name}} ("**we**", "**us**"), {{registered_address}}, governing your use of {{product_name}} ({{product_url}}) (the "**Service**"). By {{acceptance_mechanism}} <!-- e.g. creating an account or clicking "I agree" — prefer affirmative acceptance (clickwrap) -->, you agree to these Terms and acknowledge our [Privacy Policy](PRIVACY_POLICY.md). If you use the Service for an organization, you confirm you are authorized to bind it.

## 2. Eligibility

You must be at least {{minimum_age}} years old (and the age of majority where required) and not barred from using the Service under applicable law.

## 3. Accounts

You are responsible for accurate account information, keeping credentials secure, and activity under your account. Notify us promptly at {{security_contact_email}} of unauthorized use.

## 4. The Service

We provide {{service_description}}. We may change, add, or remove features; for material adverse changes to paid features we will {{change_notice_method}}. Beta or preview features are provided "as is" and may change or end.

## 5. Acceptable use

You must not: break the law or infringe others' rights; upload malware; attempt unauthorized access or probe/scan for vulnerabilities outside our [security policy](../../SECURITY.md); interfere with the Service or exceed rate limits; scrape or reverse engineer except as permitted by law; resell the Service without permission; use it to send spam, harass, or create harmful content; {{additional_prohibited_uses}}.

## 6. Your content

You retain ownership of content you submit ("**Your Content**"). You grant us a {{license_scope}} <!-- e.g. worldwide, non-exclusive, royalty-free --> license to host, process, and display Your Content solely to operate and improve the Service{{ai_training_clause}}. <!-- If content is used for AI/ML training, say so explicitly and describe opt-out; must match PRIVACY_POLICY. --> You are responsible for having the rights to Your Content. We may remove content that violates these Terms. Copyright notices: {{copyright_agent_or_notice_procedure}} <!-- e.g. DMCA designated agent (US), EU DSA notice-and-action if applicable -->.

## 7. Fees, billing, and cancellation

<!-- guidance: Delete if the Service is free. Auto-renewal and cancellation rules are heavily regulated — counsel must review. -->
Plans and prices: {{pricing_reference}}. Billing cycle: {{billing_cycle}}. Subscriptions renew automatically until cancelled via {{cancellation_method}}. Taxes: {{tax_statement}}. Refunds: {{refund_policy}}. Statutory withdrawal rights for consumers (e.g. EU 14-day right) apply where required by law.

## 8. Third-party services

The Service may integrate third-party services ({{third_party_services}}) governed by their own terms. We are not responsible for them.

## 9. Intellectual property

The Service, including software, design, and trademarks, is owned by us or our licensors. Open-source components are licensed under their own licenses ({{oss_notices_location}}). Feedback you give may be used without obligation.

## 10. Disclaimers

To the maximum extent permitted by law, the Service is provided "as is" and "as available" without warranties of any kind, express or implied, including merchantability, fitness for a particular purpose, and non-infringement. Some jurisdictions do not allow these exclusions; your statutory rights as a consumer are not affected.

## 11. Limitation of liability

To the maximum extent permitted by law, we are not liable for indirect, incidental, special, consequential, or punitive damages, or loss of profits, data, or goodwill. Our total liability is limited to {{liability_cap}} <!-- e.g. the greater of amounts paid in the prior 12 months or USD 100 -->. Nothing limits liability that cannot be limited by law (e.g. death or personal injury caused by negligence, fraud).

## 12. Indemnity

<!-- guidance: Often unenforceable against consumers in some jurisdictions; counsel to decide. Delete for pure consumer apps if advised. -->
You will indemnify us against third-party claims arising from Your Content or your violation of these Terms or the law.

## 13. Suspension and termination

You may stop using the Service and delete your account at any time via {{account_deletion_method}}. We may suspend or terminate access for material breach, legal requirement, or risk to the Service or others, with notice where reasonable. On termination, {{data_export_and_deletion_terms}} <!-- must match retention in PRIVACY_POLICY/DATABASE -->. Sections that by nature should survive will survive.

## 14. Governing law and disputes

These Terms are governed by the laws of {{governing_law_jurisdiction}}. Disputes: {{dispute_resolution}} <!-- courts of X, or arbitration; class-action waivers and mandatory arbitration are restricted for consumers in many jurisdictions — counsel must decide -->. Consumers may retain rights to bring claims in their country of residence.

## 15. Changes to these Terms

We may update these Terms. For material changes we will give at least {{notice_period}} notice via {{notice_method}}. Continued use after the effective date means acceptance; if you disagree, stop using the Service.

## 16. General

Entire agreement; severability; no waiver; assignment ({{assignment_terms}}); force majeure; notices to {{legal_notice_email}}; the English version prevails if translated ({{prevailing_language}}).

## 17. Contact

{{legal_entity_name}} · {{registered_address}} · {{legal_contact_email}}

## Version history

| Version | Effective date | Summary of changes |
|---|---|---|
| {{terms_version}} | {{effective_date}} | Initial version |

## Definition of done (this document)

- [ ] Reviewed and approved by qualified counsel; CAUTION notice removed only then.
- [ ] Features, plans, roles, and content rules match PRD.md; data terms match PRIVACY_POLICY.md.
- [ ] No invented prices, SLAs, governing law, or company details; no certification claims.
- [ ] Inapplicable sections (fees, UGC, indemnity) removed or justified.
- [ ] No `{{placeholders}}` or guidance comments remain.
