# Master Services Agreement — {{product_name}}

> **Status:** Draft · **Owner:** {{owner}} · **Last updated:** {{yyyy_mm_dd}} · **Tier:** {{tier}} · **Related:** [DATA_PROCESSING_AGREEMENT](DATA_PROCESSING_AGREEMENT.md), [BUSINESS_ASSOCIATE_AGREEMENT](BUSINESS_ASSOCIATE_AGREEMENT.md), [TERMS_OF_SERVICE](TERMS_OF_SERVICE.md), [COMPLIANCE](COMPLIANCE.md), [OPERATIONS](../technical/OPERATIONS.md)

> [!CAUTION]
> **This is a draft, not legal advice. Have it reviewed by qualified counsel.** This is a term-sheet style skeleton with drafting notes, not finished contract text. It MUST be drafted, reviewed, and approved by qualified legal counsel before it is offered to any customer. Enforceability of liability caps, indemnities, and warranty disclaimers varies by jurisdiction.

<!-- guidance: OPTIONAL / CONDITIONAL. Create only when the product is sold to businesses under negotiated or order-form contracts
(B2B SaaS, APIs, managed services, enterprise licenses). Self-serve consumer products use TERMS_OF_SERVICE instead; many B2B
products keep both (click-through Terms for self-serve, MSA for enterprise deals).
Typical structure: master terms + Order Forms / Statements of Work (SOWs) + schedules (DPA, BAA if HIPAA, SLA, security exhibit).
RULES FOR THE AI: this captures the team's commercial POSITIONS for counsel, not final clauses. Never invent prices, caps,
uptime percentages, service credits, payment terms, governing law, or entity details — use `[TBD: … — owner]` or `[TBD: counsel]`.
An SLA may only quote numbers that OPERATIONS.md (SLOs) and TRD NFR-xx define and the user approved. Security and compliance
statements may only reference controls in SECURITY_ARCHITECTURE.md and statuses in COMPLIANCE.md; never claim certifications.
Write drafting notes ("Counsel to draft: …", "Our position: …"), not final legal prose.
Tier notes — Standard (B2B): §1–§16 positions in 1–3 lines each. Enterprise: add negotiation fallbacks per clause, approval
matrix for deviations, and a clause-by-clause link to evidence (insurance certificates, audit reports) that actually exists. -->

**Effective date:** {{effective_date}} · **Version:** {{msa_version}}

## 1. Parties and structure

- Provider: {{legal_entity_name}}, {{registered_address}}. Customer: as named in the Order Form.
- Document hierarchy: {{document_hierarchy}} <!-- e.g. Order Form > DPA/BAA (for data-protection topics) > MSA > documentation; counsel to confirm -->.
- How deals are papered: {{contracting_model}} <!-- e.g. signed MSA + Order Forms; click-accept MSA for mid-market; SOWs for services -->.

## 2. Definitions

Counsel to draft: Service, Customer Data, Authorized Users, Documentation, Order Form, SOW, Confidential Information, Affiliates, and any product-specific terms from the PRD.

## 3. Scope of services, Order Forms and SOWs

<!-- guidance: Describe the service using PRD features (F-xx) and plans. Order Forms carry quantities, plans, term, and fees; SOWs
carry professional services (onboarding, integration, training) with deliverables and acceptance. -->

- Service description: {{service_description}} (see [PRD](../product/PRD.md)).
- Order Form contents: {{order_form_fields}}.
- Professional services / SOWs: {{professional_services_or_na}}; acceptance process: {{acceptance_process}}.
- Usage limits and acceptable use: {{usage_limits}} <!-- may reference TERMS_OF_SERVICE acceptable-use section -->.

## 4. Customer obligations

Our position: {{customer_obligations}} <!-- e.g. authorized users, credentials, lawful data, acceptable use, cooperation -->.

## 5. Fees, invoicing and taxes

- Pricing model: {{pricing_model}} <!-- from BIZ-02; never invent prices -->.
- Invoicing and payment terms: {{payment_terms}} <!-- [TBD: owner] -->; late payment: {{late_payment_terms}}.
- Taxes: {{tax_terms}}; price changes on renewal: {{renewal_pricing}}.

## 6. Term, renewal and termination

- Initial term and renewal: {{term_and_renewal}} <!-- auto-renewal rules vary by jurisdiction — counsel -->.
- Termination for cause / convenience: {{termination_rights}}; cure period: {{cure_period}}.
- Effects of termination: data export window {{data_export_window}}, then deletion per the DPA; survival: {{survival}}.

## 7. Intellectual property

- Provider keeps all rights in the Service; customer keeps all rights in Customer Data.
- License to Customer Data limited to providing the Service: {{customer_data_license}}.
- Feedback, aggregated/de-identified usage data: {{usage_data_position}} <!-- must be consistent with DPA and PRIVACY_POLICY -->.
- Customer-specific deliverables under SOWs: {{deliverables_ip}}.

## 8. Confidentiality

Our position: {{confidentiality_position}} <!-- definition, exclusions, permitted disclosures, duration, return/destruction -->.

## 9. Data protection and security

<!-- guidance: Do not restate DPA/BAA terms here; incorporate them by reference. Link only controls that exist in
SECURITY_ARCHITECTURE.md. Statements about SOC 2 / ISO/IEC 27001 only if COMPLIANCE.md shows Certified-Attested with evidence. -->

- Personal data processed on the customer's behalf: governed by the [DATA_PROCESSING_AGREEMENT](DATA_PROCESSING_AGREEMENT.md) {{dpa_applicability}}.
- PHI for HIPAA covered entities: governed by the [BUSINESS_ASSOCIATE_AGREEMENT](BUSINESS_ASSOCIATE_AGREEMENT.md) {{baa_applicability_or_na}}.
- Security commitments: {{security_commitments}} (see [SECURITY_ARCHITECTURE](../technical/SECURITY_ARCHITECTURE.md)).
- Data location / residency: {{data_residency}} (must match [OPERATIONS](../technical/OPERATIONS.md)).

## 10. Service levels and support

<!-- guidance: Quote numbers ONLY from approved SLO-xx / NFR-xx. Distinguish internal SLOs from contractual SLAs; contractual
targets are usually looser than internal SLOs. Service credits are commercial decisions → [TBD: owner/counsel]. -->

| Commitment | Target | Measurement | Exclusions | Remedy |
|---|---|---|---|---|
| Availability | {{availability_target_or_tbd}} | {{measurement_method}} | {{exclusions}} <!-- e.g. scheduled maintenance, force majeure --> | {{service_credits_or_tbd}} |
| Support response | {{support_response_targets}} | {{measurement}} | {{exclusions}} | {{remedy}} |

## 11. Warranties and disclaimers

Our position: {{warranties_position}} <!-- e.g. service performs materially per Documentation; professional services performed in a workmanlike manner; remedies; disclaimer of implied warranties to the extent permitted by law -->.

## 12. Limitation of liability

- Cap: {{liability_cap}} <!-- [TBD: counsel] e.g. tied to fees paid in a period -->.
- Exclusion of indirect/consequential damages: {{consequential_exclusion}}.
- Carve-outs and super-caps (e.g. confidentiality, data-protection, indemnities): {{carve_outs}} <!-- [TBD: counsel] -->.

## 13. Indemnities

- Provider indemnity (e.g. third-party IP infringement claims): {{provider_indemnity}}.
- Customer indemnity (e.g. Customer Data, unlawful use): {{customer_indemnity}}.
- Procedure (notice, control of defense, cooperation): counsel to draft.

## 14. Insurance

Our position: {{insurance_position_or_na}} <!-- only coverage that is actually held or planned; never state amounts without evidence -->.

## 15. Governing law and disputes

- Governing law and venue: {{governing_law}} <!-- [TBD: counsel] -->.
- Dispute resolution: {{dispute_resolution}} <!-- e.g. escalation, courts or arbitration -->.

## 16. General

Counsel to draft: assignment, subcontracting, force majeure, notices, export control and sanctions, anti-corruption, publicity, independent contractors, entire agreement, amendment, severability, counterparts.

## Definition of done (this document)

- [ ] Drafted and approved by qualified counsel; CAUTION notice removed only then.
- [ ] Service scope matches PRD.md; SLA numbers match approved SLO-xx/NFR-xx in OPERATIONS.md/TRD.md or are `[TBD]`.
- [ ] Data protection references the DPA (and BAA if PHI); no restated or conflicting data terms.
- [ ] No invented prices, caps, credits, governing law, insurance amounts, entities, or certifications.
- [ ] No `{{placeholders}}` or guidance comments remain.
