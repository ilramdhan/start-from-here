# Consistency audit

Run in Phase 6, on `audit docs`, and after any large change. Check every item that applies to the docs that exist. Fix what does not need new information; turn the rest into Q-xx items.

If you can run commands and Node ≥18 is available, also run:

```
node <skill-dir>/scripts/check-docs.mjs <projectDir>
```

The script covers mechanical checks (files present, placeholders, guidance comments, `[TBD` counts, broken relative links, status headers, obvious secrets, ID cross-references, blocking TBDs). You MUST still perform the semantic checks below yourself.

ID cross-references done by the script (definition rules: `writing-conventions.md` §3):

| Finding | Severity |
|---|---|
| ID referenced but never defined (defining doc exists) | Error |
| IDs of one prefix referenced but the defining doc is not generated (one finding per prefix) | Warning |
| Same ID defined twice in one table or AC list; two ADR files with the same number | Error |
| Must F-xx (or a feature without a priority) not referenced in TESTING or IMPLEMENTATION_PLAN | Warning |
| AC-xx.y of a Must feature with no row in TESTING | Warning |
| NFR-xx (TRD, Lite: ARCHITECTURE) referenced in neither TESTING nor OPERATIONS | Warning |
| `[TBD-BLOCKING: …]` without a Q-xx | Error |

Features marked withdrawn, Won't, or out of scope are not required downstream. The script does not check names, priorities, or numbers; C, D, and G below still need you. Never report that the script ran if it did not.

Severity:
- **Error** — contradicts another doc, breaks traceability, leaks a secret, invents a fact, or leaves a template artifact. Must be fixed or explicitly accepted by the user.
- **Warning** — weak or incomplete but not contradictory (e.g. NFR without a measurement method).
- **Info** — counts and suggestions.

## A. Presence and structure

- [ ] Every doc marked Required/Conditional-true in STATE.md exists at its canonical path. (Error)
- [ ] No doc exists that STATE.md marks Skipped, unless the user added it. (Warning)
- [ ] Every generated markdown doc begins with the status header line containing Status, Owner, Last updated, Tier. (Error)
- [ ] Status values are one of Draft, In review, Approved. Status in header = status in docs/README.md = STATE.md. (Error)
- [ ] Threat model is in `docs/technical/SECURITY_ARCHITECTURE.md`; root `SECURITY.md` is only the disclosure policy. (Error)

## B. Template artifacts

- [ ] No `{{` … `}}` placeholders remain. (Error)
- [ ] No `<!-- guidance` comments remain. (Error)
- [ ] Count `[TBD` items per doc; list blocking ones (`[TBD-BLOCKING: … — Q-xx]`). (Info; Error if a blocking TBD has no Q-xx or a Required section is entirely TBD without a Q-xx)
- [ ] Every `> **PROPOSAL:**` is either approved (converted to plain text) or listed as open. (Warning)
- [ ] Every `> **ASSUMPTION:**` also appears in DISCOVERY.md assumptions. (Warning)

## C. Scope and traceability

- [ ] Feature list F-xx is identical in PRD and DISCOVERY (IDs, names, priorities). (Error)
- [ ] Every Must F-xx appears in TESTING acceptance matrix with ≥1 happy-path and ≥1 failure scenario. (Error)
- [ ] Every Must F-xx is covered by ≥1 task in IMPLEMENTATION_PLAN. (Error)
- [ ] Every F-xx with user interaction appears in APP_FLOW. (Error for Must, Warning otherwise)
- [ ] Every F-xx is mapped in TRD (Standard/Enterprise). (Warning)
- [ ] No doc describes a feature listed as out of scope or Won't. (Error)
- [ ] No doc references an ID that does not exist (any prefix in `writing-conventions.md` §3; the script checks this). (Error)
- [ ] No ID is defined twice. (Error)
- [ ] Personas P-xx used in APP_FLOW/DESIGN_SYSTEM exist in PRD. (Error)

## D. Naming

- [ ] Product name is spelled identically everywhere (README, PRD, AGENTS, LICENSE holder line where relevant, legal docs). (Error)
- [ ] Entity names are identical across PRD, DATABASE, API, SECURITY_ARCHITECTURE (singular/plural and casing conventions consistent). (Error)
- [ ] Role names are identical across PRD, SECURITY_ARCHITECTURE, DATABASE, API, TESTING. (Error)
- [ ] Screen/command names identical between APP_FLOW, DESIGN_SYSTEM, TESTING. (Warning)

## E. Stack and commands

- [ ] Technologies in ARCHITECTURE stack table = accepted ADRs = CODE_STYLE = TESTING tools = OPERATIONS pipeline = README = AGENTS.md. (Error)
- [ ] No version numbers are stated as facts without a source or "verify" note. (Warning)
- [ ] Every command shown as runnable is either verified in the repo (brownfield) or marked `Not configured`. (Error)
- [ ] Directory structure in CODE_STYLE equals ARCHITECTURE project structure. (Error)
- [ ] Superseded ADRs are marked and not referenced as current. (Error)

## F. Roles, permissions, data access

- [ ] Authorization matrix in SECURITY_ARCHITECTURE covers every role × every entity/resource. (Error)
- [ ] DATABASE access rules agree with the matrix. (Error)
- [ ] API auth rule per operation agrees with the matrix. (Error)
- [ ] TESTING includes permission-denial tests for each restricted operation and tenant-isolation tests if multi-tenant. (Error)
- [ ] APP_FLOW shows permission-denied states where roles differ. (Warning)

## G. Non-functional numbers

- [ ] Each NFR-xx has the same number and unit wherever it appears (PRD summary, TRD, ARCHITECTURE, OPERATIONS SLOs, TESTING). (Error)
- [ ] Each NFR-xx has a measurement method and a test or monitor. (Warning)
- [ ] RPO/RTO in OPERATIONS match TRD. (Error)
- [ ] Accessibility target identical in PRD, DESIGN_SYSTEM, ACCESSIBILITY.md, TESTING. (Error)

## H. Legal ↔ data

- [ ] PRIVACY_POLICY "data we collect" equals the PII-flagged fields in DATABASE + analytics + logs + AI provider data. (Error)
- [ ] Sub-processors in PRIVACY_POLICY = third-party integrations in TRD/ARCHITECTURE that receive personal data. (Error)
- [ ] Retention periods identical in DATABASE, PRIVACY_POLICY, OPERATIONS (logs/backups). (Error)
- [ ] COMPLIANCE lists every regime triggered in DISCOVERY. (Error)
- [ ] COOKIE_POLICY exists iff non-essential cookies/tracking are planned. (Warning)
- [ ] MASTER_SERVICES_AGREEMENT exists iff B2B (CMP-06); DATA_PROCESSING_AGREEMENT iff processor (CMP-07); BUSINESS_ASSOCIATE_AGREEMENT iff PHI for covered entities (CMP-08). (Warning)
- [ ] DPA §4/Annex I data categories equal DATABASE; DPA Annex III and BAA §5 vendors equal COMPLIANCE §4 and PRIVACY_POLICY sub-processors. (Error)
- [ ] MSA SLA numbers equal approved SLO-xx/NFR-xx or are `[TBD]`; breach-notice timings in DPA/BAA match the OPERATIONS incident runbook. (Error)
- [ ] Every legal doc carries the not-legal-advice notice. (Error)
- [ ] No doc claims the project "is compliant", "is certified", or "meets" a regulation without evidence. (Error)
- [ ] Children/age statements consistent across TERMS, PRIVACY, PRD. (Error)

## I. License

- [ ] License identifier identical in LICENSE, README, CONTRIBUTING, CODE_STYLE (manifest `license` field note), AGENTS.md. (Error)
- [ ] LICENSE contains full official text (not a summary) with year and holder. (Error)
- [ ] Third-party assets' licenses (LEG-04) are compatible with the chosen license or flagged. (Warning)

## J. Links

- [ ] Every relative link resolves to an existing file (and heading anchor where checkable). (Error)
- [ ] AGENTS.md links every generated doc. (Error)
- [ ] docs/README.md lists every doc that exists, and only those. (Error)
- [ ] Each doc's "Related" header links point to existing docs. (Warning)

## K. Secrets and sensitive content

- [ ] No API keys, tokens, private keys, passwords, connection strings with credentials, or real personal data in any doc. (Error)
- [ ] Environment variables appear as names only. (Error)
- [ ] Seed/fixture examples use synthetic data. (Error)

## L. AI instructions

- [ ] AGENTS.md, AI_GUIDELINES, and optional pointer files do not contradict each other. (Error)
- [ ] Pointer files (CLAUDE.md etc.) exist only for tools the user named. (Warning)
- [ ] Ask-first actions in AI_GUIDELINES match TEA-06. (Error)

## Audit report format

```markdown
## Consistency audit — {{YYYY-MM-DD}}

**Scope:** {{n}} documents · **Automated check:** ran (`check-docs.mjs`, exit {{code}}) | not run (reason)

| Severity | Count |
|---|---|
| Errors | {{n}} |
| Warnings | {{n}} |
| Open [TBD] | {{n}} ({{blocking}} blocking) |

### Fixed automatically
- {{doc}}: {{what was fixed}}

### Errors needing your decision
| # | Check | Where | Problem | Proposed fix |
|---|---|---|---|---|
| 1 | C | PRD ↔ TESTING | F-04 has no test | Add happy + failure rows |

### Warnings
- …

### Open questions (blocking first)
- Q-03 (blocking): … — owner …
```

After the report, **STOP** and ask whether to apply proposed fixes, answer questions, or proceed to handoff.
