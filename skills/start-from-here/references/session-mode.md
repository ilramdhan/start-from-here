# Session mode — phase-by-phase work across fresh sessions

Use this when one run cannot hold SKILL.md + references + templates + upstream docs + its own output with room to spare: every Enterprise run (30–40 docs), any run with more than ~20 docs, local LLMs with 8–64k context, small/flash models, and chat UIs that truncate history. Instead of one long run, the work is split into **work packages (WPs)**, one per fresh session. Sessions are connected by three process files in `docs/.start-from-here/`: `DIGEST.md` (canonical names, ID registry, decisions; template `assets/templates/docs/.start-from-here/DIGEST.md`), `HANDOVER.md` (what happened, what is next; template `assets/templates/docs/.start-from-here/HANDOVER.md`) and `STATE.md`.

Session mode changes **how much you load per session**, never the quality bar: every template H2, every minimum, every gate, and the completeness protocol in SKILL.md still apply. The context-budget rules in SKILL.md (digest, lean reads, checkpoints, context pressure) apply in single mode too.

---

## 1. When to use it (Phase 0/1 detection)

Session mode is the **default recommendation** (one line with the reason; the user may decline at the Phase 1 STOP) when ANY of these is true:

| Signal | Example |
|---|---|
| The tier is Enterprise | regulated data, multiple teams, formal compliance; 30–40 docs |
| The approved doc list has more than ~20 documents | Standard with UI + API + legal + full community files |
| Model is local or small, or the stated context is ≤ 64k tokens | Ollama/LM Studio 8B–32B, "flash"/"mini"-class models, "my context is 32k" |
| Chat-only UI (no file access) | chat apps, custom assistants, web UIs for local models |
| The user says `session mode` | "use session mode" |

Otherwise (Lite/Standard on a large context) use **single-session mode** with the context-budget rules and the completeness protocol. If you notice context pressure later in single mode, follow the context-pressure rule (finish the doc, update DIGEST/STATE, write HANDOVER, give the resume prompt, stop) and offer session mode for the rest. Record `Mode: single | session` and `Current WP` in STATE.md Flags. The user can switch at any time with `session mode` / `single mode`.

The tier and doc count are only known at the end of Phase 1: in Phase 0 note the context signals; at the Phase 1 STOP show the recommended mode next to the tier and doc list. If you cannot know your context size, ask once in Round 0: "Which model/tool are you using? If it is a local or small model, I'll split the work into short sessions so docs stay complete."

---

## 2. Work packages (one per session)

| WP | Content | Gate at end | Produces |
|---|---|---|---|
| WP1 | Calibrate + Discover + Recommend + Brief (Phases 0–4) | Brief approval (**STOP**) | `docs/DISCOVERY.md` (Approved), STATE.md |
| WP2 | Product | Batch review | PRD, APP_FLOW, DESIGN_SYSTEM |
| WP3 | Technical core | Batch review | TRD, ARCHITECTURE, ADRs |
| WP4 | Data and interfaces | Batch review | DATABASE, API |
| WP5 | Security and quality | Batch review | SECURITY_ARCHITECTURE, TESTING |
| WP6 | Run and plan | Batch review | OPERATIONS, IMPLEMENTATION_PLAN |
| WP7 | Engineering | Batch review | CODE_STYLE, GIT_WORKFLOW, AI_GUIDELINES |
| WP8 | Legal + repo | Batch review | legal docs, README, LICENSE, CHANGELOG, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY.md, SUPPORT, ACCESSIBILITY, `.github/*`, AGENTS.md (+ pointers), docs/README.md |
| WP9 | Audit + handoff (Phases 6–7) | Audit report, readiness checklist | traceability fixes, final HANDOVER |

WP1 may itself span sessions if the interview is long: write HANDOVER after any round and resume mid-Phase 2. Skip docs not in the approved list; a WP whose docs are all skipped is skipped.

### 2.1 Per-tier merges

| Tier | Sessions (default) | Merged WPs |
|---|---|---|
| Lite | 5 | WP1 · WP2+WP3 (PRD, APP_FLOW if UI, ARCHITECTURE incl. Lite merged §14) · WP4+WP5 (DATABASE if data, SECURITY_ARCHITECTURE short, TESTING) · WP6+WP7+WP8 (IMPLEMENTATION_PLAN, CODE_STYLE, AI_GUIDELINES, legal if any, repo files, AGENTS.md, docs/README) · WP9 |
| Standard | 9 | None by default. With ≥ 64k context you may merge WP6+WP7 or WP8+WP9. |
| Enterprise | 9–14 | No merges. Split WP3 (TRD+ARCHITECTURE / ADRs), WP5 (SECURITY_ARCHITECTURE / TESTING) and WP8 (legal / repo+AGENTS) when context < 64k. |

**Very small contexts (≤ 16k):** split further — one document per session (ADRs together, `.github/*` + small community files together). Write HANDOVER after each document.

---

## 3. Lean reading list per WP

Load ONLY these. Never load all references. "§" = template section numbers. Always first: `HANDOVER.md`, `DIGEST.md` and `STATE.md`. SKILL.md is assumed loaded by the tool (or pasted) — it is the procedure.

| WP | Upstream project docs (sections only) | Skill files | Template(s) |
|---|---|---|---|
| WP1 | — (repo listing in brownfield) | `references/discovery-question-bank.md` (only the tier's domains/rounds, one domain group at a time), `references/stack-recommendation.md` (Phase 3 only), `references/tiering-and-doc-matrix.md` §Matrix | `docs/DISCOVERY.md` |
| WP2 | DISCOVERY §2 brief, §3.3 scope, §11.1–11.3 seeds | `references/product-guide.md` §0, §1, §2, §4, §5, §12, §13, §17 | PRD, APP_FLOW, DESIGN_SYSTEM |
| WP3 | DISCOVERY §3.4–3.5, §6 decisions; PRD §7.1 feature summary, §8 NFR summary | `references/architecture-guide.md` §1, §2, §4, §6, §10 (≤32k: §2 + §10 only) | TRD, ARCHITECTURE, decisions/README + 0001 + adr-template |
| WP4 | DISCOVERY §11.4 entity seeds; PRD §4 personas/roles, §7 features (+ §7.4 lifecycles); ARCHITECTURE §4 stack table, §5 boundaries, §7 interfaces | `references/data-modeling-guide.md` §1–§6, §13 (≤32k: §1–§5 + §13 only); `references/architecture-guide.md` §8 (API) | DATABASE, API |
| WP5 | PRD §4 roles, §7.1, AC lists; TRD §3 NFRs; ARCHITECTURE §3.2 containers, §5; DATABASE §2 classification, §8 access rules; API §3 catalog | `references/governance-guide.md` §3, §4, §6, §9; `references/security-threat-catalog.md` §1–§4 + only the domain sections whose triggers match; `references/security-standards-checklists.md` only the sections whose condition applies (§3 ASVS for Standard/Enterprise, §4 if API, §5 if mobile, §1 + §6 if AI) | SECURITY_ARCHITECTURE, TESTING |
| WP6 | TRD §3 NFRs; ARCHITECTURE §4, §11 deployment; TESTING §8 CI gates; PRD §7.1, §11 release plan; DIGEST §3 registry | `references/governance-guide.md` §5, §7; `references/product-guide.md` §14 | OPERATIONS, IMPLEMENTATION_PLAN |
| WP7 | ARCHITECTURE §4, §9 project structure; TESTING §9 commands; DISCOVERY §3.8 team | `references/governance-guide.md` §8, §9 | CODE_STYLE, GIT_WORKFLOW, AI_GUIDELINES |
| WP8 | DISCOVERY §3.6, §3.8, §8; DATABASE §2, §12 (for privacy); STATE documents table | `references/legal-compliance-primer.md` (triggered regimes only); `references/governance-guide.md` §8 | legal templates as needed, root/community templates, AGENTS.md, docs/README.md |
| WP9 | Headers + ID lines of every doc; PRD §18, TESTING §12, IMPLEMENTATION_PLAN §3 traceability | `references/consistency-audit.md` | — (run `scripts/check-docs.mjs` if commands work) |

Rules:

1. Read sections, not whole files, when the tool allows ranged reads (search for the `## N.` heading). In chat-only mode, ask the user to paste only the listed sections.
2. Take names and IDs from the DIGEST registry; never re-read upstream docs for them. Re-read an upstream section only when you need its content, and only the sections the template's guidance names as inputs.
3. Write one document at a time; finish it before loading the next template. Patch DIGEST after each document.
4. If you are about to exceed your budget mid-document, finish the current section, mark the doc `partial (§1–§N done)` in STATE and HANDOVER, update DIGEST, write HANDOVER, and stop.

---

## 4. Budget heuristics

Approximate token sizes (bytes ÷ 4; real tokenizers vary ±25%, non-English text costs more). Plan for the reply too: a full large doc is 4–10k tokens of output.

### 4.1 Skill files

| File | ≈ tokens | File | ≈ tokens |
|---|---|---|---|
| SKILL.md | 10.1k | `references/workflow.md` | 5.5k |
| `references/session-mode.md` (this file) | 5.0k | `references/tiering-and-doc-matrix.md` | 2.8k |
| `references/document-catalog.md` | 5.6k | `references/discovery-question-bank.md` | 9.2k |
| `references/experience-modes.md` | 2.1k | `references/existing-project-mode.md` | 1.9k |
| `references/stack-recommendation.md` | 3.2k | `references/legal-compliance-primer.md` | 3.9k |
| `references/writing-conventions.md` | 2.5k | `references/consistency-audit.md` | 1.8k |
| `references/product-guide.md` | 7.8k (lean set ≈ 3.5k) | `references/architecture-guide.md` | 7.1k (lean set ≈ 2.7k) |
| `references/data-modeling-guide.md` | 12.8k (§1–§5 + §13 ≈ 5.2k) | `references/governance-guide.md` | 6.1k (per WP ≈ 1–2.5k) |
| `references/security-threat-catalog.md` | 9.6k (§1–§4 ≈ 3.6k; each domain section ≈ 0.4–0.7k) | `references/security-standards-checklists.md` | 7.0k (each section ≈ 0.3–1.4k; load only the ones whose condition applies) |

### 4.2 Templates

| Template | ≈ tokens | Template | ≈ tokens |
|---|---|---|---|
| DISCOVERY | 2.5k | docs/README | 2.3k |
| PRD | 4.9k | APP_FLOW | 3.1k |
| DESIGN_SYSTEM | 3.4k | TRD | 3.0k |
| ARCHITECTURE | 4.8k | ADR README + 0001 + template | 2.3k |
| DATABASE | 5.3k | API | 3.5k |
| SECURITY_ARCHITECTURE | 9.6k (full row lists moved to `references/security-standards-checklists.md`) | TESTING | 5.3k |
| OPERATIONS | 5.8k | IMPLEMENTATION_PLAN | 6.3k |
| CODE_STYLE | 4.1k | GIT_WORKFLOW | 3.8k |
| AI_GUIDELINES | 7.7k | AGENTS.md | 2.4k |
| PRIVACY_POLICY | 2.8k | TERMS_OF_SERVICE | 2.0k |
| COMPLIANCE | 1.6k | COOKIE_POLICY | 0.9k |
| DATA_PROCESSING_AGREEMENT | 3.2k | BUSINESS_ASSOCIATE_AGREEMENT | 2.5k |
| MASTER_SERVICES_AGREEMENT | 2.0k | | |
| README / CONTRIBUTING / SECURITY.md / ACCESSIBILITY | 1.2–1.5k each | `.github/*`, CHANGELOG, SUPPORT, CODE_OF_CONDUCT | 0.3–0.8k each |
| HANDOVER | 0.8k (filled ≤ 1.5k) | DIGEST | 0.8k (filled ≤ 3k) |

### 4.3 Planning a session

`budget ≈ SKILL.md (10.1k) + HANDOVER/DIGEST/STATE (3–5k) + upstream sections (3–8k) + skill sections (2–5k) + templates + output (≈ 1.5× template size per doc)`.

| Context | What fits per session |
|---|---|
| ≤ 16k | SKILL.md + HANDOVER + one template + its output. One document per session; drop the guide or read only its self-review checklist. |
| 16–32k | One WP of 2 small docs, or 1 large doc (SECURITY_ARCHITECTURE, IMPLEMENTATION_PLAN, AI_GUIDELINES alone). Use the ≤32k guide subsets. |
| 32–64k | One WP as listed. |
| 64–200k | Standard: merge pairs (WP6+WP7). Enterprise: one WP per session. |
| ≥ 200k | Lite/Standard: single mode is usually fine (keep DIGEST, checkpoints and the 40% rule below). Enterprise or > ~20 docs: session mode is still the default recommendation, because quality drops as one context fills, long before it is full. |

Signs you are near the limit: you cannot recall an F-xx title or role name without re-reading; the tool summarizes or drops earlier turns; output starts getting shorter per section. Then: finish the current section, update DIGEST and STATE, write HANDOVER, stop.

### 4.4 Budget per document

Approximate tokens for the large documents (chars ÷ 4). "Read" = template + the guide sections it needs + DIGEST (≤ 3k) + the upstream sections it names as inputs. "Write" = a complete filled doc at Standard/Enterprise depth (Lite ≈ half).

| Document | Read (template + guide + digest + upstream) | Write |
|---|---|---|
| PRD | 4.9k + 3.5k + 3k + 2k (DISCOVERY sections) ≈ 13k | 6–10k |
| ARCHITECTURE | 4.9k + 2.7k + 3k + 3k (TRD §2–§3, DISCOVERY) ≈ 14k | 6–9k |
| DATABASE | 5.3k + 5.2k + 3k + 3k (PRD §7, ARCHITECTURE §4–§5) ≈ 17k | 8–12k |
| API | 3.5k + 1.5k + 3k + 3k (APP_FLOW, DATABASE §3) ≈ 11k | 5–8k |
| SECURITY_ARCHITECTURE | 9.6k + 2.5k + 3.6k catalog core + 1–4k checklists + 3k + 4k ≈ 24–27k | 9–14k |
| TESTING | 5.3k + 1.5k + 3k + 4k (PRD AC lists, TH-xx) ≈ 14k | 6–10k |
| OPERATIONS | 5.8k + 1.5k + 3k + 2k ≈ 12k | 5–8k |
| IMPLEMENTATION_PLAN | 6.3k + 1k + 3k + 3k ≈ 13k | 7–10k |
| AI_GUIDELINES | 7.7k + 1k + 3k + 2k ≈ 14k | 6–9k |

Rule: before each document, estimate read + write for it. If that exceeds ~40% of the context you have left, checkpoint first (update DIGEST and STATE, write HANDOVER, give the resume prompt, stop), or delegate it to a fresh sub-agent (§7) if your environment can.

---

## 5. DIGEST.md and HANDOVER.md procedure

### 5.1 DIGEST.md (all modes)

Path: `docs/.start-from-here/DIGEST.md` (template `assets/templates/docs/.start-from-here/DIGEST.md`). Process file: no status header, not listed in docs/README.md or AGENTS.md. Hard cap ≈ 150 lines (~3k tokens).

- **Create** at Phase 4, right after the brief is approved, from DISCOVERY.md: product summary, tier/flags, glossary (product, roles, entities, screens, domain terms), ID registry (P-, F- with title and priority, J-, NFR- with its number, D-, Q-, R-, A-), ≤ 10 key decisions, stack line, and the DISCOVERY row of "where to read upstream".
- **Patch** after every drafted or approved document: add its new IDs (one line each: OP-, TB-, TH- titles, ADR-, M-, SLO-, RB-; long series like T-xx as a range), any renamed or new canonical name, new decisions, and its row in §6 "where to read upstream" (the sections later docs depend on). Change-propagation edits patch DIGEST too.
- **Compress, never drop:** when near the cap, shorten titles, collapse closed decisions to their ID + three words, and write long ID series as ranges. Every ID stays findable.
- **Single source:** DIGEST is the only ID registry. HANDOVER and STATE point to it instead of copying it. If DIGEST and a document disagree, the approved document wins; fix DIGEST and tell the user.

### 5.2 HANDOVER.md

Path: `docs/.start-from-here/HANDOVER.md`. Overwrite (never append) at the END of every session, after any `next session` / `handover` command, and whenever you sense you are near your limit (in single mode too). Keep ≤ ~100 lines; no secrets; no `{{` left. Patch DIGEST and STATE before writing it.

Must contain (template sections):

1. Session number, date, model/tool, tier, WP done and whether complete or partial.
2. Files created/changed this session with status and a coverage line.
3. Decisions made this session, by ID only (text lives in DIGEST §4).
4. ID registry: a pointer to DIGEST §2–§3 plus the ranges of IDs added this session. No copy of the registry.
5. Open TBD items and questions with owner and where they live.
6. Quality notes: things the next session must not miss (e.g. "DATABASE must include `audit_logs` because NFR-07 requires an admin audit trail"; "F-04 has only 2 AC — add a negative case in TESTING").
7. Next WP and its lean reading list (from §3, filled with real sections).
8. Copy-paste "Next session prompt" block, e.g.:

```text
Use the start-from-here skill. Resume session mode: read docs/.start-from-here/HANDOVER.md,
DIGEST.md and STATE.md, then do WP4.
```

Also update STATE.md (`Current WP`, documents table, `next_step`) and DIGEST.md before writing HANDOVER.

### 5.3 End of session message

Filesystem mode: list files written, the coverage lines, then show the next-session prompt and say: "Start a NEW session (fresh context) and paste this prompt."

Chat-only mode: print `### docs/.start-from-here/HANDOVER.md`, `### docs/.start-from-here/DIGEST.md` and `### docs/.start-from-here/STATE.md`, each as one fenced markdown block, after the documents of this session. Tell the user: "Save these three blocks (and the documents above). Open a new chat, paste or attach them together with the next-session prompt, plus the upstream sections listed in HANDOVER §7."

### 5.4 Starting a session-mode session (resume)

1. Read HANDOVER.md, then DIGEST.md, then STATE.md. If they disagree, STATE.md wins for statuses; DIGEST wins for names and IDs unless an approved document says otherwise (fix whichever is stale and tell the user). If DIGEST is missing (a run started before it existed), rebuild it from DISCOVERY and the ID lines of the existing docs first.
2. Re-apply calibration from STATE.md without asking again.
3. Summarize in ≤ 5 lines: WP done, WP now, docs to produce, blocking TBDs.
4. Load the lean reading list for the WP (only), generate, self-check, present the batch, **STOP** for review.
5. After approval (or when the user says `next session`), update STATE.md and DIGEST.md, overwrite HANDOVER.md, print the next-session prompt, and stop. Do not start the next WP in the same session unless the user explicitly asks and you have budget.

---

## 6. Quality safeguards in session mode

- IDs and names are copied from DIGEST verbatim; new IDs continue the sequence (never renumber).
- Every document patches DIGEST with its new IDs, so WP9 can audit from the registry.
- WP9 does the traceability pass F-xx → APP_FLOW → API → DB entity → test → task from ID lines and traceability sections, re-opening a doc only to fix it.
- If a later WP finds an upstream gap (e.g. an entity missing an F-xx), apply the change-propagation rule: fix upstream, set it `In review`, note it in HANDOVER §6.
- Tip for users: use the largest model available for WP3–WP5 (architecture, data, security) if they can switch models between sessions; small models are fine for WP7–WP8.

---

## 7. Optional sub-agent generation (capability-gated)

Use only if your environment can start **sub-agents** (separate worker contexts, each with its own fresh context window) that can read the skill files and write files in the project. If it cannot, skip this section: the sequential flow in SKILL.md is unchanged and complete on its own. Sub-agents work in single mode and inside a session-mode WP.

**Why:** each document is written in a clean context that holds only what it needs, so the 30th document is written with the same focus as the first, and the main session stays small enough to run the review gates and the audit.

### 7.1 What the main session (orchestrator) keeps

- Phases 0–4: the interview, recommendations, the brief and every STOP gate. Never delegate them.
- STATE.md and DIGEST.md: only the orchestrator writes them, after each returned document.
- Review batches and their **STOP** gates, change propagation, the traceability pass, and Phase 6 audit judgments (a sub-agent may not decide that a contradiction is acceptable).
- Verification: before presenting a returned document, open it and run the template's completeness self-check (every H2 present, minimums met, IDs match DIGEST, no `{{`, no guidance comments, no secrets). Fix it or send it back with the specific gaps.

### 7.2 Brief for each sub-agent (one document each)

Give every sub-agent a self-contained brief; it knows nothing else:

1. Target: the output path (e.g. `docs/technical/DATABASE.md`) and the doc language, tier and experience mode.
2. Read list, nothing more: the template path; the guide file and section (SKILL.md "Read the deep guide first" list, §3 above for section numbers); `docs/.start-from-here/DIGEST.md`; the exact upstream sections the template's guidance names as inputs (e.g. "PRD §4, §7; ARCHITECTURE §4, §5"). For SECURITY_ARCHITECTURE also the threat catalog §1–§4 + matching domains and only the applicable sections of `references/security-standards-checklists.md`.
3. Rules: SKILL.md hard rules 1–9 apply verbatim (point to them or paste them); the completeness protocol applies in full; reuse names and IDs from DIGEST exactly and continue new ID sequences from the last ID in DIGEST; never overwrite an existing file; unknowns become `[TBD: …]`, ideas `> **PROPOSAL:** …`.
4. Output: write the file with status `Draft`, then return at most 10 lines: the coverage line (e.g. `DATABASE: 11 entities, 34 indexes, 1 ERD, 2 TBD`), new IDs (ranges), new names that should enter the glossary, new `[TBD]` items, PROPOSAL items. No full document text in the reply.

### 7.3 Order and parallelism

- Run sub-agents **sequentially in the Phase 5 dependency order**. A document starts only after every document it depends on is written, verified and recorded in DIGEST.
- Run in parallel only documents that do not read each other: e.g. the legal docs (after DATABASE and SECURITY_ARCHITECTURE), the `.github/*` files, small community files (CONTRIBUTING, CODE_OF_CONDUCT, SUPPORT). After a parallel group, patch DIGEST once with all returned IDs and check for collisions (two docs creating the same ID number).
- Never parallelize PRD → TRD → ARCHITECTURE → DATABASE → API → SECURITY_ARCHITECTURE → TESTING → IMPLEMENTATION_PLAN; each consumes the previous one's IDs.

### 7.4 After each return

1. Verify the document (7.1). 2. Patch DIGEST (new IDs, names, "where to read upstream" row). 3. Update STATE. 4. At a batch boundary, present the batch and **STOP** exactly as in single mode.
