# Business Associate Agreement — {{product_name}}

> **Status:** Draft · **Owner:** {{owner}} · **Last updated:** {{yyyy_mm_dd}} · **Tier:** {{tier}} · **Related:** [MASTER_SERVICES_AGREEMENT](MASTER_SERVICES_AGREEMENT.md), [COMPLIANCE](COMPLIANCE.md), [SECURITY_ARCHITECTURE](../technical/SECURITY_ARCHITECTURE.md), [OPERATIONS](../technical/OPERATIONS.md), [DATABASE](../technical/DATABASE.md)

> [!CAUTION]
> **This is a draft, not legal advice. Have it reviewed by qualified counsel.** This is a structural skeleton with drafting notes, not finished contract text. It MUST be drafted, reviewed, and approved by qualified legal counsel before use. Signing a BAA does not make a product "HIPAA compliant" and there is no official HIPAA certification.

<!-- guidance: OPTIONAL / CONDITIONAL. Create only when the provider will create, receive, maintain, or transmit protected health
information (PHI) on behalf of a HIPAA covered entity (health care provider, health plan, clearinghouse) or of another business
associate (then you are a subcontractor and the agreement is a subcontractor BAA). Consumer health apps that do not serve covered
entities are usually NOT business associates (FTC Health Breach Notification Rule and state health-data laws may apply instead) —
ask, and record the answer in DISCOVERY.md. Covered entities often insist on their own BAA paper; this draft helps the team
understand obligations and prepare a provider-side position.
Structure follows the required elements of business associate contracts in 45 CFR 164.504(e)(2) (Privacy Rule) and 164.314(a)(2)
(Security Rule), and the HHS sample BAA provisions:
https://www.hhs.gov/hipaa/for-professionals/covered-entities/sample-business-associate-agreement-provisions/index.html
https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-E/section-164.504
RULES FOR THE AI: never invent entity names, reporting deadlines stricter than the rule, or certifications. The regulatory outer
limit for a business associate's breach notice is in 45 CFR 164.410(b); any shorter contractual window is a negotiated term →
`[TBD: counsel]`. Safeguards MUST match SECURITY_ARCHITECTURE.md; subcontractors MUST match COMPLIANCE.md §4 (vendor agreement
gate: no PHI to a vendor before its BAA is signed). Write drafting notes ("Counsel to draft: …"), not final legal prose.
Tier notes — HIPAA data forces Enterprise by default (tiering-and-doc-matrix.md overrides). Keep every section; use "N/A — reason". -->

**Effective date:** {{effective_date}} · **Version:** {{baa_version}}

## 1. Parties and relationship

- Covered entity (or upstream business associate): the customer named in the Order Form / MSA.
- Business associate: {{legal_entity_name}}, {{registered_address}}.
- Role: {{ba_role}} <!-- business associate of a covered entity | subcontractor of a business associate -->.
- Underlying service agreement: {{governing_agreement}} <!-- e.g. the MSA --> and precedence: {{precedence_rule}}.

## 2. Definitions

<!-- guidance: The HHS sample uses a catch-all: terms have the same meaning as in the HIPAA Rules (45 CFR Parts 160 and 164), e.g.
Breach, Designated Record Set, Disclosure, Health Care Operations, Individual, Minimum Necessary, Protected Health Information,
Required By Law, Secretary, Security Incident, Subcontractor, Unsecured PHI, Use. -->

Counsel to draft, using the HIPAA Rules definitions by reference.

## 3. Permitted and required uses and disclosures of PHI

<!-- guidance: 164.504(e)(2)(i). Option 1 lists specific purposes; option 2 references the service agreement ("as necessary to
perform the services"). State whether de-identification (164.514(a)–(c)) is allowed, the minimum-necessary approach, and the
optional uses: proper management and administration / legal responsibilities (164.504(e)(4)) and data aggregation for the
covered entity's health care operations. The BA may not use or disclose PHI in a way that would violate Subpart E if done by the
covered entity, except those optional uses. -->

| Use / disclosure | Permitted? | Basis / condition |
|---|---|---|
| To perform the services in the service agreement | {{yes_no}} | {{services_description}} |
| As required by law | Yes | 164.504(e)(2)(ii)(A) |
| Proper management and administration / legal responsibilities | {{yes_no}} | 164.504(e)(4) |
| Data aggregation for the covered entity's health care operations | {{yes_no}} | 164.504(e)(2)(i)(B) |
| De-identification of PHI | {{yes_no}} | 164.514(a)–(c); permitted uses of de-identified data: {{deidentified_use}} |
| Minimum necessary | Yes | {{minimum_necessary_approach}} |

## 4. Obligations of the business associate

<!-- guidance: One row per required element of 164.504(e)(2)(ii)(A)–(J) and 164.314(a)(2)(i). Each "How we meet it" cell links to
the doc/section that implements it; unknown → [TBD: … — owner]. -->

| # | Required element | How we meet it (doc §) |
|---|---|---|
| a | Not use or further disclose PHI other than as permitted by the agreement or required by law | {{implementation}} |
| b | Use appropriate safeguards and comply with the Security Rule (45 CFR Part 164 Subpart C) for electronic PHI | [SECURITY_ARCHITECTURE](../technical/SECURITY_ARCHITECTURE.md) {{section}} |
| c | Report uses/disclosures not provided for by the agreement, breaches of unsecured PHI (164.410), and security incidents | §6 below; [OPERATIONS](../technical/OPERATIONS.md) incident runbook |
| d | Ensure subcontractors that create, receive, maintain, or transmit PHI agree to the same restrictions and conditions (164.502(e)(1)(ii), 164.308(b)(2)) | §5 below; [COMPLIANCE](COMPLIANCE.md) §4 |
| e | Make PHI available for individual access (164.524) | {{access_process}} |
| f | Make PHI available for amendment and incorporate amendments (164.526) | {{amendment_process}} |
| g | Make available information for an accounting of disclosures (164.528) | {{accounting_process}} |
| h | Where carrying out a covered-entity obligation under Subpart E, comply with the requirements that apply to the covered entity | {{delegated_obligations_or_na}} |
| i | Make internal practices, books, and records available to the HHS Secretary to determine compliance | {{records_availability}} |
| j | At termination, return or destroy PHI if feasible, or extend protections where infeasible | §8 below |

## 5. Subcontractors

<!-- guidance: List every vendor that touches PHI (hosting, database, backups, email/SMS, logging, error tracking, support desk,
AI providers). Each needs a subcontractor BAA before PHI flows. MUST match ARCHITECTURE.md integrations and COMPLIANCE.md §4. -->

| Subcontractor | Service | PHI involved | BAA status |
|---|---|---|---|
| {{vendor}} | {{service}} | {{phi_types}} | {{baa_status}} <!-- Not started / In negotiation / Signed (date) --> |

## 6. Reporting: impermissible uses, breaches, and security incidents

<!-- guidance: 164.504(e)(2)(ii)(C), 164.314(a)(2)(i)(C), 164.410. A business associate notifies the covered entity of a breach of
unsecured PHI without unreasonable delay and no later than the outer limit in 164.410(b) — verify current text. The HHS sample
notes parties may agree a stricter timeframe and who notifies individuals, HHS OCR and media. Also decide how to report
unsuccessful security incidents (e.g. pings, port scans) — counsel to draft. -->

- Breach notice timing to the covered entity: {{breach_notice_timing}} <!-- [TBD: counsel] -->.
- Content: identification of affected individuals (to the extent possible) and other information the covered entity needs for its notices (164.410(c)).
- Who notifies individuals / HHS / media: {{notification_responsibility}}.
- Security-incident reporting (including unsuccessful attempts): {{security_incident_reporting}}.
- Contact and channel: {{security_contact_email}} · {{breach_notice_channel}}.

## 7. Obligations of the covered entity

<!-- guidance: HHS sample (optional provisions): the covered entity informs the BA of limitations in its notice of privacy practices
(164.520), changes in or revocation of an individual's permission, and agreed restrictions (164.522); and does not request uses
or disclosures that would be impermissible if done by the covered entity. -->

Counsel to draft: notice-of-privacy-practices limitations, permission changes, restrictions, and permissible requests.

## 8. Term and termination

<!-- guidance: 164.504(e)(2)(iii): the covered entity may terminate if the BA violated a material term (optionally after a cure
period). 164.504(e)(2)(ii)(J): at termination return or destroy PHI and keep no copies; if infeasible, extend protections and
limit further uses to the purposes that make return/destruction infeasible. Backups and logs containing PHI MUST be addressed. -->

- Term: {{baa_term}} (effective {{effective_date}} until {{termination_event}}).
- Termination for cause: {{termination_for_cause}} · cure period: {{cure_period}} <!-- [TBD: counsel] -->.
- Return or destruction of PHI: {{return_or_destroy_process}} · backup/log expiry: {{backup_phi_expiry}}.
- Survival: {{survival_clause}}.

## 9. Miscellaneous

Counsel to draft: regulatory references (to the HIPAA Rules as amended), amendment to keep pace with law changes, survival, interpretation in favor of HIPAA compliance, no third-party beneficiaries, governing law {{governing_law}} <!-- [TBD: counsel] -->, and relationship to the MSA (liability caps, indemnities).

## Definition of done (this document)

- [ ] Drafted and approved by qualified counsel; CAUTION notice removed only then.
- [ ] Every element of 45 CFR 164.504(e)(2) and 164.314(a)(2)(i) is addressed in §3, §4, §6, and §8.
- [ ] Safeguards match SECURITY_ARCHITECTURE.md; incident steps match OPERATIONS.md; subcontractors match COMPLIANCE.md §4 and ARCHITECTURE.md.
- [ ] No "HIPAA compliant"/"HIPAA certified" claims; no invented deadlines or entities.
- [ ] No `{{placeholders}}` or guidance comments remain.
