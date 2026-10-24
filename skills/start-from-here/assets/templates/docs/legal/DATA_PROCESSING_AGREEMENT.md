# Data Processing Agreement — {{product_name}}

> **Status:** Draft · **Owner:** {{owner}} · **Last updated:** {{yyyy_mm_dd}} · **Tier:** {{tier}} · **Related:** [MASTER_SERVICES_AGREEMENT](MASTER_SERVICES_AGREEMENT.md), [PRIVACY_POLICY](PRIVACY_POLICY.md), [COMPLIANCE](COMPLIANCE.md), [SECURITY_ARCHITECTURE](../technical/SECURITY_ARCHITECTURE.md), [DATABASE](../technical/DATABASE.md)

> [!CAUTION]
> **This is a draft, not legal advice. Have it reviewed by qualified counsel.** This is a structural skeleton with drafting notes, not finished contract text. It MUST be drafted, reviewed, and approved by qualified legal counsel before it is offered to any customer. Signing it does not by itself establish compliance with the GDPR, UK GDPR, or any other law.

<!-- guidance: OPTIONAL / CONDITIONAL. Create only when the product processes personal data ON BEHALF OF business customers
(you are a "processor" for the customer's personal data; the customer is the "controller"), typically B2B SaaS, APIs, or
managed services. Do NOT create it for a pure B2C product where you are only a controller — PRIVACY_POLICY covers that.
Structure follows GDPR Art. 28(3), which requires the contract to set out the subject-matter and duration, the nature and purpose
of the processing, the type of personal data and categories of data subjects, the obligations and rights of the controller, and
points (a)–(h): documented instructions (incl. transfers), confidentiality of personnel, Art. 32 security measures, sub-processor
conditions (Art. 28(2) and (4)), assistance with data-subject requests, assistance with Arts. 32–36, deletion or return at the end,
and information/audits. Source: https://eur-lex.europa.eu/eli/reg/2016/679/oj — see references/legal-compliance-primer.md.
RULES FOR THE AI: never invent entity names, addresses, DPO names, sub-processors, regions, notice periods, or certifications.
Data categories, data subjects, sub-processors and regions MUST match DATABASE.md, ARCHITECTURE.md, PRIVACY_POLICY.md and
COMPLIANCE.md §4; unknown → `[TBD: … — owner]`. Deadlines (breach notice hours, objection windows, deletion days) are commercial
and legal choices: leave `[TBD: counsel]` unless the user decided them. Do not copy Standard Contractual Clauses text from memory —
reference the official decision and attach the official text. Write drafting notes ("Counsel to draft: …"), not final legal prose.
Tier notes — Standard: §1–§14 skeleton + Annexes I–III. Enterprise: add jurisdiction-specific addenda (UK, Switzerland, US state
laws such as CCPA/CPRA "service provider" terms), audit cadence, and a liability cross-reference to the MSA. -->

**Effective date:** {{effective_date}} · **Version:** {{dpa_version}}

## 1. Parties and roles

- Controller (customer): the customer entity named in the Order Form / MSA.
- Processor (provider): {{legal_entity_name}}, {{registered_address}}.
- Relationship to other agreements: this DPA forms part of {{governing_agreement}} <!-- e.g. the MSA or online Terms -->. Order of precedence on data-protection matters: {{precedence_rule}} <!-- counsel to decide; DPAs commonly prevail on data-protection topics -->.
- Where the customer is itself a processor for its own clients, state that the provider acts as a sub-processor: {{controller_processor_chain_note}}.

## 2. Definitions

Counsel to draft. Align terms with the applicable law (e.g. "personal data", "processing", "controller", "processor", "sub-processor", "personal data breach", "data subject", "supervisory authority", "Standard Contractual Clauses"), and reuse MSA definitions where they exist.

## 3. Subject-matter, duration, nature and purpose of processing

<!-- guidance: Art. 28(3) opening sentence. Summarize here; details go into Annex I. -->

| Item | Description |
|---|---|
| Subject-matter | {{processing_subject_matter}} <!-- e.g. hosting and processing customer data to provide the Service --> |
| Duration | {{processing_duration}} <!-- e.g. term of the MSA plus the deletion period in §12 --> |
| Nature of processing | {{processing_operations}} <!-- e.g. storage, retrieval, transmission, analysis, deletion --> |
| Purpose | {{processing_purpose}} <!-- only to provide the Service as described in the MSA and documentation --> |

## 4. Types of personal data and categories of data subjects

<!-- guidance: MUST equal the customer-data entities/fields flagged as personal in DATABASE.md. Special-category data (Art. 9),
criminal-offence data (Art. 10), children's data, or health data need explicit rows and extra safeguards — flag for counsel. -->

| Category of data subjects | Types of personal data | Special categories? | Source |
|---|---|---|---|
| {{data_subject_category}} <!-- e.g. customer's employees, end users, patients --> | {{personal_data_types}} | {{special_category_yes_no}} | {{source}} |

## 5. Controller instructions and obligations

<!-- guidance: Art. 28(3)(a) and the controller's obligations and rights. -->

- Processor processes personal data only on documented instructions from the controller, including for international transfers, unless required by law (and then informs the controller first unless legally prohibited). Documented instructions are: {{instruction_sources}} <!-- e.g. the MSA, this DPA, the customer's configuration of the Service, written requests -->.
- Processor informs the controller if, in its opinion, an instruction infringes data-protection law (Art. 28(3), final subparagraph).
- Controller's responsibilities: lawful basis and notices for the data it submits, accuracy, and lawful instructions — counsel to draft.

## 6. Confidentiality of personnel

<!-- guidance: Art. 28(3)(b). -->

Persons authorized to process personal data are bound by confidentiality (contractual or statutory). Describe the mechanism: {{confidentiality_mechanism}} <!-- e.g. employment confidentiality terms, training, need-to-know access -->.

## 7. Security of processing (Art. 32)

<!-- guidance: Art. 28(3)(c). Summarize and point to Annex II; the measures MUST match SECURITY_ARCHITECTURE.md and OPERATIONS.md.
Never list a control that is not planned or implemented; never claim a certification or attestation that does not exist. -->

Processor implements the technical and organizational measures in Annex II. Changes may not lower the overall level of protection: {{tom_change_policy}}.

## 8. Sub-processors

<!-- guidance: Art. 28(3)(d), 28(2) and 28(4). Choose prior specific or general written authorization. With general authorization,
the processor informs the controller of intended additions/replacements and the controller can object. The same data-protection
obligations flow down to each sub-processor by contract; the processor remains liable for them. -->

- Authorization model: {{authorization_model}} <!-- specific | general -->.
- Current list: Annex III (MUST match COMPLIANCE.md §4 and PRIVACY_POLICY sub-processors).
- Notice of changes: {{change_notice_method_and_period}} <!-- [TBD: counsel] -->; objection process and remedy: {{objection_process}}.
- Flow-down: each sub-processor is bound by data-protection obligations equivalent to this DPA.

## 9. Assistance to the controller

<!-- guidance: Art. 28(3)(e) data-subject requests (Chapter III rights) and 28(3)(f) Arts. 32–36 (security, breach notification,
DPIA, prior consultation). Describe the product feature or support process, e.g. export/delete endpoints from APP_FLOW/API. -->

| Obligation | How the processor assists | Response time | Cost |
|---|---|---|---|
| Data-subject requests (access, rectification, erasure, restriction, portability, objection) | {{dsr_assistance}} | {{dsr_response_time}} | {{dsr_cost}} |
| Security of processing (Art. 32) | {{security_assistance}} | {{response_time}} | {{cost}} |
| DPIA and prior consultation (Arts. 35–36) | {{dpia_assistance}} | {{response_time}} | {{cost}} |

## 10. Personal data breach notification

<!-- guidance: Art. 33(2): the processor notifies the controller "without undue delay" after becoming aware of a personal data
breach. Any fixed number of hours is a commercial choice — [TBD: counsel]. Must match the incident runbook in OPERATIONS.md. -->

- Notification timing: {{breach_notice_timing}}.
- Content (as available): nature of the breach, categories and approximate numbers of data subjects and records, likely consequences, measures taken or proposed, contact point.
- Channel and contact: {{breach_notice_channel}} · {{security_contact_email}}.

## 11. International transfers

<!-- guidance: Applies when personal data subject to the GDPR is transferred to a third country. Options under GDPR Ch. V include
adequacy decisions (Art. 45) and appropriate safeguards (Art. 46), e.g. the Commission's Standard Contractual Clauses
(Implementing Decision (EU) 2021/914; Module Two controller→processor, Module Three processor→processor). UK transfers use UK
mechanisms; Swiss transfers have their own requirements. Attach the OFFICIAL text by reference — never reproduce from memory.
Regions MUST match ARCHITECTURE/OPERATIONS hosting and backup regions. -->

| Data flow | From → to (country/region) | Transfer mechanism | Supplementary measures |
|---|---|---|---|
| {{data_flow}} | {{origin}} → {{destination}} | {{transfer_mechanism}} | {{supplementary_measures}} |

## 12. Deletion or return of personal data

<!-- guidance: Art. 28(3)(g). At the controller's choice, delete or return all personal data at the end of the services and delete
existing copies unless law requires storage. Backups: state how long they persist. Must match DATABASE/OPERATIONS retention. -->

- Controller's choice mechanism: {{return_or_delete_mechanism}} <!-- e.g. self-service export before termination -->.
- Deletion period after termination: {{deletion_period}} <!-- [TBD: counsel] -->; backup expiry: {{backup_expiry}}.
- Legal retention exceptions: {{retention_exceptions}}.

## 13. Information and audits

<!-- guidance: Art. 28(3)(h). The processor makes available information necessary to demonstrate compliance with Art. 28 and allows
for and contributes to audits, including inspections, by the controller or a mandated auditor. Third-party reports may be offered
ONLY if they actually exist (do not name SOC 2 / ISO/IEC 27001 unless COMPLIANCE.md shows them as Certified-Attested). -->

- Information available on request: {{audit_information}}.
- Audit process: notice {{audit_notice_period}}, frequency {{audit_frequency}}, scope and confidentiality {{audit_scope}}, costs {{audit_costs}}.

## 14. Liability, term and general

Counsel to draft: liability (usually cross-referenced to the MSA limitation of liability), term (co-terminous with the MSA), survival of obligations, governing law {{governing_law}} <!-- [TBD: counsel] -->, and precedence.

## Annex I — Details of processing

<!-- guidance: Mirrors §3–§4 and the SCC Annex I structure (list of parties, description of transfer, competent supervisory authority). -->

- Parties and contacts: {{annex_parties}}
- Categories of data subjects / personal data / special categories: see §4.
- Frequency of transfer: {{transfer_frequency}} · Retention: {{retention_period}}
- Competent supervisory authority (if SCCs apply): {{supervisory_authority}} <!-- [TBD: counsel] -->

## Annex II — Technical and organizational measures

| Area | Measure | Source (doc §) |
|---|---|---|
| Access control | {{measure}} | [SECURITY_ARCHITECTURE](../technical/SECURITY_ARCHITECTURE.md) |
| Encryption in transit / at rest | {{measure}} | {{doc_section}} |
| Logging and monitoring | {{measure}} | {{doc_section}} |
| Backup, availability and resilience | {{measure}} | [OPERATIONS](../technical/OPERATIONS.md) |
| Incident response | {{measure}} | {{doc_section}} |
| Personnel and vendor management | {{measure}} | {{doc_section}} |
| Testing and evaluation of measures | {{measure}} | [TESTING](../technical/TESTING.md) |

## Annex III — Sub-processors

| Sub-processor | Service / purpose | Personal data | Location / region | Transfer mechanism |
|---|---|---|---|---|
| {{vendor}} | {{service}} | {{data}} | {{region}} | {{transfer_mechanism}} |

## Definition of done (this document)

- [ ] Drafted and approved by qualified counsel; CAUTION notice removed only then.
- [ ] Every Art. 28(3) element (subject-matter, duration, nature, purpose, data types, data subjects, controller rights, points (a)–(h)) is addressed.
- [ ] §4 and Annex I match DATABASE.md; Annex II matches SECURITY_ARCHITECTURE.md/OPERATIONS.md; Annex III matches COMPLIANCE.md §4 and PRIVACY_POLICY.md.
- [ ] Transfer mechanism referenced to official text; no SCC text written from memory.
- [ ] No invented entities, deadlines, sub-processors, regions, or certifications.
- [ ] No `{{placeholders}}` or guidance comments remain.
