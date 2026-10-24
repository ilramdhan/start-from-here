# Legal & compliance primer

> **Notice:** This primer helps the AI ask the right questions and flag likely obligations. It is not legal advice. Laws change and depend on facts. Every legal document produced by this skill is a draft that MUST be reviewed by qualified counsel.

## Rules for the AI

1. MUST NOT state that the project "is compliant", "is certified", "meets", or "satisfies" any law or standard. Use "may apply", "is likely triggered", "to be assessed by counsel".
2. MUST NOT invent legal entity names, addresses, jurisdictions, DPO names, registration numbers, or dates of assessments.
3. MUST record each triggered regime in DISCOVERY.md and (Standard with regulated data / Enterprise) in `docs/legal/COMPLIANCE.md` with status `Not assessed`.
4. MUST put the notice on every legal doc, including MSA, DPA, and BAA skeletons.
5. SHOULD recommend reducing scope when possible (e.g. hosted payment page instead of handling card data; not collecting data you don't need).
6. Thresholds below are approximate summaries to trigger questions. Say "verify current thresholds with counsel" whenever a threshold matters.

---

## Part 1 — License chooser

### Decision tree

```
Is the code going to be public?
├─ No  → Proprietary: "Copyright (c) YEAR HOLDER. All rights reserved." (+ internal use terms if needed)
└─ Yes
   ├─ Do you want others to use it freely, including in closed-source products?
   │  ├─ Yes → Permissive
   │  │  ├─ Want explicit patent grant / corporate-friendly? → Apache-2.0
   │  │  ├─ Want the simplest, most common? → MIT
   │  │  └─ Other permissive: BSD-2-Clause, BSD-3-Clause, ISC
   │  └─ No, modifications must stay open → Copyleft
   │     ├─ Library, want file-level copyleft only? → MPL-2.0
   │     ├─ Library, linking allowed from closed code? → LGPL-3.0-or-later
   │     ├─ Application, distributed copies must share source → GPL-3.0-or-later
   │     └─ Network service, users over a network must get source → AGPL-3.0-or-later
   └─ Want "source-available" with commercial restrictions (not OSI open source)?
      → e.g. Business Source License, Elastic License, PolyForm — flag: not open source; counsel review
Docs / content (not code)? → CC-BY-4.0 (or CC-BY-SA-4.0); CC0-1.0 for public-domain dedication
```

### Comparison

| License | Type | Commercial use in closed products | Patent grant | Must share changes | Notes |
|---|---|---|---|---|---|
| MIT | Permissive | Yes | No explicit | No | Most common; short |
| Apache-2.0 | Permissive | Yes | Yes | No (must state changes) | NOTICE file handling |
| BSD-3-Clause | Permissive | Yes | No explicit | No | No-endorsement clause |
| MPL-2.0 | Weak copyleft (file) | Yes | Yes | Modified MPL files only | Good middle ground |
| LGPL-3.0 | Weak copyleft (library) | Yes, with conditions | Yes | Library changes | Linking conditions |
| GPL-3.0 | Strong copyleft | Only if whole work is GPL | Yes | Yes, when distributed | Affects dependents |
| AGPL-3.0 | Network copyleft | Only if whole work is AGPL | Yes | Yes, also for network use | Strongest for SaaS |
| Proprietary | — | Owner decides | — | — | Not open source |

Defaults: open source with no strong preference → **MIT** (Recommended) or **Apache-2.0** if patents or corporate contributors matter. Private → proprietary notice.

### License rules

- LICENSE MUST contain the exact official text. `assets/templates/licenses/` is guidance only (not copied into the project): it bundles `MIT.txt` and `PROPRIETARY.txt` and lists official plain-text URLs in its README. For any non-MIT license, fetch the official text from those URLs. If you cannot fetch it, leave `LICENSE` as `[TBD: insert official <SPDX-ID> text — owner]` — never write a license from memory, never paraphrase.
- Fill year and copyright holder; holder unknown → `[TBD: copyright holder]`.
- Use the SPDX identifier in README, package manifests (note in CODE_STYLE), and CONTRIBUTING.
- Check dependency and asset licenses (LEG-04) for compatibility; e.g. GPL dependencies in a proprietary distributed app are a red flag.
- Contributions: inbound = outbound by default; DCO sign-off is lightweight; CLA needs counsel.

---

## Part 2 — Regulatory triggers

Format: **Trigger** · **Docs affected** · **What to ask**.

### Privacy & data protection

**GDPR (EU/EEA)**
- Trigger: you offer goods/services to, or monitor behavior of, people in the EU/EEA, or you are established there; any personal data (including IP addresses, device IDs, emails).
- Docs: PRIVACY_POLICY, COOKIE_POLICY, COMPLIANCE, DATABASE (PII flags, retention), SECURITY_ARCHITECTURE (privacy engineering), OPERATIONS (residency, backups), TERMS.
- Ask: Which personal data and why (purpose, legal basis)? Retention? Sub-processors and transfers outside EU? Data subject rights flow (access, deletion, export)? Children? Cookies/tracking consent? Need for DPIA (high-risk processing)? DPO needed? Breach notification owner?

**UK GDPR & Data Protection Act 2018**
- Trigger: same as GDPR for people in the UK.
- Docs: same as GDPR. Ask: same; UK international transfer mechanism; UK representative if not established there.

**CCPA / CPRA (California) and other US state privacy laws**
- Trigger: business serving California residents that meets revenue or data-volume thresholds (verify current thresholds); many other states (e.g. Virginia, Colorado, Connecticut, Utah, Texas, Oregon and more) have similar comprehensive laws with their own thresholds.
- Docs: PRIVACY_POLICY (notice at collection, "Do Not Sell or Share"), COMPLIANCE, COOKIE_POLICY.
- Ask: Will you meet thresholds now or within a year? Do you sell or share data for cross-context advertising? Sensitive personal information? Opt-out mechanisms (incl. Global Privacy Control)?

**LGPD (Brazil)**
- Trigger: processing personal data of people in Brazil or offering services there.
- Docs: PRIVACY_POLICY, COMPLIANCE. Ask: legal bases, DPO (encarregado), rights flow, transfers.

**PIPEDA (Canada)** (+ provincial laws such as Quebec Law 25)
- Trigger: commercial activity collecting personal information in Canada.
- Docs: PRIVACY_POLICY, COMPLIANCE. Ask: consent model, privacy officer, breach records.

**PDPA (Singapore)** / **UU PDP — Law No. 27 of 2022 (Indonesia)** / other APAC laws
- Trigger: collecting personal data of people in Singapore / Indonesia (UU PDP applies to processing of Indonesian data subjects, including from abroad in some cases).
- Docs: PRIVACY_POLICY, COMPLIANCE, OPERATIONS (residency).
- Ask: consent and purposes, data protection officer, cross-border transfer rules, breach notification timelines (verify).

### Sector-specific

**HIPAA (US health)**
- Trigger: you are a covered entity (provider, plan, clearinghouse) or a business associate handling protected health information (PHI) for one. Consumer health apps may instead fall under FTC rules (e.g. Health Breach Notification Rule) and state health-data laws.
- Docs: COMPLIANCE, SECURITY_ARCHITECTURE (access controls, audit logs, encryption), OPERATIONS (backup, incident), DATABASE, PRIVACY_POLICY, vendor list (BAAs), BUSINESS_ASSOCIATE_AGREEMENT (see B2B contracts below).
- Ask: Will you receive PHI from covered entities? Will vendors sign a BAA? Audit logging? Minimum necessary access? → propose Enterprise tier.
- B2B note: as a business associate you sign BAAs with customers and MUST flow BAAs down to every sub-processor touching PHI (hosting, email/SMS, logging, support tools). Record a "vendor agreement gate" in COMPLIANCE (no PHI to a vendor before its BAA/DPA is signed) and a HIPAA Security Rule risk analysis row. Breach-notice timing differs for business associates vs covered entities — counsel to confirm.
- EU + US health data together: GDPR Art. 9 special-category data needs an Art. 9(2) condition; residency usually means DR/backup replicas stay in the same jurisdiction (do not default to cross-region failover across the EU/US line).

**PCI DSS (payment cards)**
- Trigger: storing, processing, or transmitting cardholder data.
- Docs: ARCHITECTURE, SECURITY_ARCHITECTURE, COMPLIANCE, OPERATIONS.
- Ask: Can you use a hosted payment page / tokenization so card data never touches your systems (strongly recommended to reduce scope)? Which provider?

**SOC 2 / ISO/IEC 27001 (assurance frameworks, not laws)**
- Trigger: B2B customers (especially enterprise) ask for a report/certificate.
- Docs: COMPLIANCE (control register), SECURITY_ARCHITECTURE, OPERATIONS (change management, access reviews, incident response), GIT_WORKFLOW (reviews), CODEOWNERS.
- Ask: Timeline for audit? Which trust service criteria / scope? Owners for controls? Evidence collection? → design "audit-ready" controls; never claim attestation.

**COPPA (US, children under 13)**
- Trigger: service directed to children under 13, or actual knowledge of collecting their data. Also consider GDPR age of consent (13–16 by country) and UK Age Appropriate Design Code.
- Docs: PRIVACY_POLICY, TERMS, PRD (age gate), DATABASE, COMPLIANCE.
- Ask: Will children use it? Age gate? Verifiable parental consent? → propose Enterprise, or exclude minors explicitly.

**FERPA (US education records)**
- Trigger: handling student education records on behalf of schools receiving US federal funding.
- Docs: COMPLIANCE, PRIVACY_POLICY, SECURITY_ARCHITECTURE. Ask: contracts with schools, data use limits, parent/student access rights.

**Financial services** (e.g. PSD2/open banking, GLBA in the US, AML/KYC)
- Trigger: holding funds, lending, payments initiation, financial account data.
- Docs: COMPLIANCE, SECURITY_ARCHITECTURE. Ask: licensed partner? KYC provider? → counsel required.

### AI

**EU AI Act**
- Trigger: placing on the EU market or using in the EU an AI system; obligations depend on risk category (prohibited practices; high-risk e.g. employment, education, credit, essential services, law enforcement; transparency duties for chatbots, deepfakes, AI-generated content; general-purpose AI model obligations for model providers). Obligations phase in over time — verify which apply on your launch date.
- Docs: COMPLIANCE, PRD (transparency labels), SECURITY_ARCHITECTURE (AI threats), TESTING (evals), PRIVACY_POLICY.
- Ask: What does the AI decide or influence? Are users told they interact with AI? Human oversight? Logging? Data used for training?
- Also consider: US state AI laws (e.g. Colorado AI Act) and sector guidance — flag for counsel.

### Accessibility

**ADA (US)**, **Section 508 (US federal procurement)**, **EN 301 549 (EU ICT standard)**, **European Accessibility Act (EAA, applies to many consumer products/services in the EU from 28 June 2025)**
- Trigger: public-facing UI; selling to US federal agencies (508); selling into the EU public sector (EN 301 549) or covered consumer services such as e-commerce, banking, e-books, transport (EAA; micro-enterprise exemptions exist — verify).
- Docs: ACCESSIBILITY.md, DESIGN_SYSTEM, TESTING (A11Y-xx), PRD (NFR), COMPLIANCE.
- Ask: Target (default WCAG 2.2 AA)? Need an accessibility conformance report (VPAT/ACR)? Who tests with assistive technology? Never claim conformance without evaluation.

### Trade, distribution, platforms

**Export control** (e.g. US EAR, EU dual-use regulation)
- Trigger: non-standard cryptography, dual-use technology, distribution to sanctioned countries/persons.
- Docs: COMPLIANCE, README (if OSS: note). Ask: crypto beyond standard TLS/library use? Target countries? → counsel.

**App-store policies** (Apple App Store, Google Play, others)
- Trigger: mobile/desktop store distribution.
- Docs: PRD (account deletion in-app, sign-in options), PRIVACY_POLICY (privacy labels / data safety form), TERMS, OPERATIONS (review cadence).
- Ask: in-app purchases vs external payments? account deletion flow? data safety disclosures? content moderation for user-generated content? Verify current policy text.

**Email/SMS marketing** (CAN-SPAM, TCPA, ePrivacy/PECR)
- Trigger: marketing messages. Docs: PRIVACY_POLICY, PRD. Ask: consent capture, unsubscribe.

### EU digital-product rules

**ePrivacy Directive (EU) / PECR (UK)**
- Trigger: storing or reading information on a user's device (cookies, local storage, SDK identifiers, pixels) that is not strictly necessary; electronic marketing messages.
- Docs: COOKIE_POLICY, PRIVACY_POLICY, DESIGN_SYSTEM (consent banner), ARCHITECTURE (analytics choice), COMPLIANCE.
- Ask: Which cookies/trackers are non-essential? Prior opt-in consent mechanism? Can you use cookieless/privacy-friendly analytics to avoid consent? Marketing consent and unsubscribe?

**Cyber Resilience Act (EU CRA)**
- Trigger: placing "products with digital elements" (software or hardware with software, including apps, desktop software, IoT devices, many libraries when commercially supplied) on the EU market. Obligations phase in (vulnerability reporting first, full requirements later — verify current dates). Non-commercial open-source development is largely out of scope; open-source "stewards" have lighter duties; commercial monetization changes that — counsel to confirm.
- Docs: COMPLIANCE, SECURITY_ARCHITECTURE (secure by design, SBOM), OPERATIONS (vulnerability handling, security updates for support period), root SECURITY.md (coordinated disclosure), GIT_WORKFLOW (release/support policy).
- Ask: Is it sold or monetized in the EU? Hardware or software? Support period for security updates? SBOM generation? Vulnerability handling owner and reporting path?

**Digital Services Act (EU DSA)**
- Trigger: intermediary services in the EU — hosting user content, online platforms/marketplaces, search. Duties scale with role and size (very large platforms have the most); small and micro enterprises have exemptions from some duties — verify.
- Docs: TERMS_OF_SERVICE (content rules, moderation, appeals), PRD (notice-and-action/report flow, statement of reasons), OPERATIONS (moderation process, points of contact), COMPLIANCE.
- Ask: Do users post content others can see? Marketplace with traders (trader traceability)? Reporting/flagging flow? Moderation and complaint handling? Single point of contact? Ads or recommender systems shown to users (transparency)?

### B2B contracts (MSA, DPA, BAA)

These are contract skeletons for counsel, generated only when triggered (CMP-06/07/08). They capture structure and the team's positions; they are never finished legal text. Templates: `assets/templates/docs/legal/MASTER_SERVICES_AGREEMENT.md`, `DATA_PROCESSING_AGREEMENT.md`, `BUSINESS_ASSOCIATE_AGREEMENT.md`.

**Master Services Agreement (MSA)**
- Trigger: selling to businesses under order forms or negotiated contracts (B2B SaaS, APIs, managed services, enterprise licenses).
- Docs: MASTER_SERVICES_AGREEMENT, TERMS_OF_SERVICE (self-serve users), OPERATIONS (SLOs feed any SLA), COMPLIANCE.
- Typical sections: parties and document hierarchy; scope with Order Forms / SOWs; fees; term and termination; IP; confidentiality; data protection by reference to the DPA/BAA; SLA and support; warranties; limitation of liability; indemnities; governing law. No single statute defines an MSA: every commercial number (price, cap, credit, uptime) is a business decision → `[TBD: owner/counsel]` until the user decides.

**Data Processing Agreement / Addendum (DPA) — GDPR Art. 28**
- Trigger: you process personal data on behalf of business customers (you are the processor; the customer is the controller) and the GDPR / UK GDPR may apply. Other laws have similar contract duties (e.g. CCPA/CPRA "service provider" contract terms) — counsel to confirm.
- Required content (GDPR Art. 28(3)): the contract sets out the subject-matter and duration, nature and purpose of the processing, type of personal data, categories of data subjects, and the obligations and rights of the controller, and stipulates that the processor (a) processes only on documented instructions, including for transfers; (b) ensures personnel confidentiality; (c) takes the measures required by Art. 32 (security of processing); (d) respects Art. 28(2) and (4) for sub-processors (prior specific or general written authorization with a right to object; same obligations flow down; the processor stays liable); (e) assists with data-subject requests (Chapter III rights); (f) assists with Arts. 32–36 (security, breach notification, DPIA, prior consultation); (g) deletes or returns all personal data at the end of the services, at the controller's choice; (h) makes information available and allows for and contributes to audits, including inspections. The processor also informs the controller if an instruction infringes data-protection law. Art. 28(9): the contract is in writing, including electronic form.
- Related: Art. 33(2) — the processor notifies the controller of a personal data breach "without undue delay" (any hour count is a negotiated term). Art. 30(2) — processors keep records of processing. Transfers to third countries need a Chapter V mechanism, e.g. adequacy (Art. 45) or Standard Contractual Clauses (Art. 46(2)(c); Commission Implementing Decision (EU) 2021/914, Module Two controller→processor, Module Three processor→processor, with Annex I details, Annex II technical and organisational measures, Annex III sub-processors). Reference the official SCC text; never reproduce it from memory.
- Docs: DATA_PROCESSING_AGREEMENT, PRIVACY_POLICY (controller vs processor roles), COMPLIANCE §4, DATABASE, SECURITY_ARCHITECTURE, OPERATIONS (residency, deletion, incident).
- Ask: Which customer data categories and data subjects? Specific or general sub-processor authorization, and how are changes notified? Hosting and support locations (transfers)? Deletion period after termination? Breach notice timing (counsel)?

**HIPAA Business Associate Agreement (BAA) — 45 CFR 164.504(e)**
- Trigger: you create, receive, maintain, or transmit PHI on behalf of a covered entity (or of another business associate, as a subcontractor).
- Required content (45 CFR 164.504(e)(2)): establish permitted and required uses and disclosures of PHI (optionally for the BA's management and administration or legal responsibilities, and data aggregation); provide that the BA will (A) not use or further disclose PHI except as permitted or required by law; (B) use appropriate safeguards and comply with the Security Rule (Subpart C) for electronic PHI; (C) report uses or disclosures not provided for, including breaches of unsecured PHI under 164.410; (D) ensure subcontractors agree to the same restrictions and conditions; (E) make PHI available for access (164.524); (F) for amendment (164.526); (G) for an accounting of disclosures (164.528); (H) comply with Subpart E when carrying out a covered entity's obligation; (I) make its practices, books, and records available to the HHS Secretary; (J) at termination return or destroy PHI if feasible, otherwise extend protections; and authorize termination by the covered entity for a material violation. 45 CFR 164.314(a)(2)(i) adds the Security Rule terms (comply with Subpart C, subcontractor agreements, report security incidents).
- Breach notice: 45 CFR 164.410(b) sets the outer limit for a BA's notice to the covered entity ("without unreasonable delay" and no later than a fixed number of days after discovery — verify current text). HHS notes parties may agree a stricter timeframe.
- Docs: BUSINESS_ASSOCIATE_AGREEMENT, COMPLIANCE (vendor agreement gate, Security Rule risk analysis), SECURITY_ARCHITECTURE, OPERATIONS, DATABASE. Tier: regulated-data override → Enterprise.
- Ask: Covered entity or subcontractor role? Which vendors touch PHI and will each sign a BAA? Who notifies individuals/HHS/media? Return-or-destroy process including backups and logs?

**Sources** (verify current text before relying on them)
- GDPR, Regulation (EU) 2016/679 — Arts. 28, 30, 32, 33, 46: https://eur-lex.europa.eu/eli/reg/2016/679/oj
- Standard Contractual Clauses, Commission Implementing Decision (EU) 2021/914: https://eur-lex.europa.eu/eli/dec_impl/2021/914/oj
- HHS, Sample Business Associate Agreement Provisions: https://www.hhs.gov/hipaa/for-professionals/covered-entities/sample-business-associate-agreement-provisions/index.html
- 45 CFR 164.504 (business associate contracts): https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-E/section-164.504
- 45 CFR 164.314 (Security Rule organizational requirements): https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-C/section-164.314
- 45 CFR 164.410 (notification by a business associate): https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-D/section-164.410

---

## Part 3 — Quick trigger checklist (ask in discovery)

| Question | If yes → consider |
|---|---|
| Any personal data? | Privacy laws by region; PRIVACY_POLICY |
| Users in EU/UK? | GDPR / UK GDPR; cookies consent |
| Users in California or other US states? | CCPA/CPRA + state laws |
| Users in Brazil / Canada / Indonesia / Singapore? | LGPD / PIPEDA / UU PDP / PDPA |
| Health data? | HIPAA, state health-data laws |
| Card payments? | PCI DSS (minimize scope) |
| Children? | COPPA, GDPR-K, UK AADC |
| School records? | FERPA |
| Enterprise B2B buyers? | SOC 2 / ISO 27001 expectations |
| Sell to businesses under order forms / negotiated contracts? | MASTER_SERVICES_AGREEMENT (CMP-06) |
| Process customers' personal data on their behalf (processor)? | GDPR Art. 28 DPA; DATA_PROCESSING_AGREEMENT (CMP-07) |
| Handle PHI for HIPAA covered entities or their business associates? | 45 CFR 164.504(e) BAA; BUSINESS_ASSOCIATE_AGREEMENT; Enterprise (CMP-08) |
| AI features in EU or decisions about people? | EU AI Act, state AI laws |
| Public UI? | Accessibility laws, WCAG 2.2 AA |
| Strong crypto or sanctioned regions? | Export control |
| App stores? | Store policies |
| Marketing email/SMS? | CAN-SPAM, TCPA, ePrivacy/PECR |
| Non-essential cookies/trackers (EU/UK)? | ePrivacy / PECR; COOKIE_POLICY |
| Software/hardware product sold in the EU? | Cyber Resilience Act |
| Users post content others see, in the EU? | Digital Services Act |

## COMPLIANCE.md register row format

```markdown
| Regime | Trigger found | Applies? | Owner | Status | Key controls (doc § ) | Evidence location |
|---|---|---|---|---|---|---|
| GDPR | EU users, emails stored (PRV-03, DAT-02) | Likely — counsel to confirm | [TBD: privacy owner] | Not assessed | PRIVACY_POLICY; DATABASE §Retention; SECURITY_ARCHITECTURE §Privacy | [TBD] |
```
