# start-from-here project digest

> Process file (not a project deliverable; no status header). Created at Phase 4 from DISCOVERY.md; patched after every drafted or approved document. Before writing any document, read THIS file + the doc's template + its guide section + only the upstream sections the template lists as inputs, never whole upstream docs. Hard cap ≈ 150 lines (~3k tokens): when it grows, compress older detail (shorten titles, merge closed decisions) but never drop an ID. No secrets. Replace every `{{…}}`; write `—` for lists that do not exist yet.

## 1. Product
- **Name:** {{product name}} · **Tier:** {{Lite | Standard | Enterprise}} · **Mode:** {{single | session}} · **Docs language:** {{lang}} · **Last patched after:** {{doc path}} ({{YYYY-MM-DD}})
- **Flags:** {{has_ui · has_api · stores_data · personal_data · regulated_data · open_source · public_facing · app_store · ai_features · regions}}
- **Summary:** {{one paragraph: what it is, for whom, the problem, the MVP outcome, what is out of scope}}

## 2. Glossary of canonical names (use exactly these spellings)
- **Roles (authZ):** {{owner, admin, member, guest}}
- **Entities:** {{users, organizations, memberships, projects, audit_logs, … or "—"}}
- **Screens / commands:** {{S-01 Sign in · S-02 Dashboard · … or "—"}}
- **Domain terms:** {{term = meaning; term = meaning}}

## 3. ID registry (one line per ID; never renumber; new IDs continue the sequence)
- **Personas:** {{P-01 Clinic admin · P-02 Patient}}
- **Features:** {{F-01 Book appointment (Must) · F-02 Reminders (Must) · F-03 Invoices (Should)}}
- **Journeys:** {{J-01 Book first visit · …}}
- **NFRs (with numbers):** {{NFR-01 p95 API < 300 ms @ 50 rps · NFR-02 99.5% monthly availability · …}}
- **API operations:** {{OP-01 POST /v1/appointments · … or "—"}}
- **Trust boundaries:** {{TB-1 browser → API · TB-2 API → DB · …}}
- **Threats (titles):** {{TH-01 credential stuffing on sign-in · TH-02 IDOR on appointments · …}}
- **ADRs:** {{ADR-0001 Record decisions · ADR-0002 Use PostgreSQL · …}}
- **Milestones:** {{M0 Setup · M1 Data & auth · …}}
- **Decisions:** {{D-01 stack = … (user) · D-02 …}}
- **Open questions:** {{Q-01 retention period for invoices — owner · …}}
- **Risks / assumptions:** {{R-01 … · A-01 …}}
- **Other prefixes in use:** {{KPI-01 … · SLO-01 … · RB-01 … · T-01…T-nn (count only)}}

## 4. Key decisions (≤ 10 bullets, newest last)
- {{Single-tenant per clinic; shared schema with tenant_id (D-03)}}

## 5. Stack (one line)
{{e.g. TypeScript web app + PostgreSQL (managed) + container hosting — versions: verify at setup}}

## 6. Where to read upstream (doc → sections other docs depend on)
Add a row when a doc is drafted. Later docs read ONLY the sections listed here that their template's guidance names as inputs.

| Doc | Key sections | Status |
|---|---|---|
| docs/DISCOVERY.md | {{§2 brief, §3.3 scope, §6 decisions, §11 seeds}} | {{Approved}} |
| docs/product/PRD.md | {{§4 personas/roles, §7 features + AC, §8 NFR summary, §18 traceability}} | {{Draft}} |
