# Session mode — phase-by-phase work across fresh sessions

Use this when the model cannot hold SKILL.md + references + templates + every upstream doc at once (local LLMs with 8–32k context, small/flash models, chat UIs that truncate history). Instead of one long run, the work is split into **work packages (WPs)**, one per fresh session. Sessions are connected by `docs/.start-from-here/HANDOVER.md` (template: `assets/templates/docs/.start-from-here/HANDOVER.md`) plus `STATE.md`.

Session mode changes **how much you load per session**, never the quality bar: every template H2, every minimum, every gate, and the completeness protocol in SKILL.md still apply.

---

## 1. When to use it (Phase 0/1 detection)

Propose session mode (one line, with the reason, user may decline) when ANY of these is true:

| Signal | Example |
|---|---|
| The user says `session mode` | "use session mode" |
| Model is local or small, or the stated context is ≤ 64k tokens | Ollama/LM Studio 8B–32B, "flash"/"mini"/"haiku"-class models, "my context is 32k" |
| Chat-only UI (no file access) | ChatGPT/Gemini/Claude chat, Custom GPT, Gem, web UIs for local models |
| Enterprise tier on any model with < 200k context | Enterprise docs are long; one run does not fit |
| You notice you are running low | earlier turns summarized/forgotten, you cannot recall IDs, the tool warns about context |

Otherwise use **single-session mode** with the existing completeness protocol. Record `Mode: single | session` and `Current WP` in STATE.md Flags. The user can switch at any time with `session mode` / `single mode`.

If you cannot know your context size, ask once in Round 0: "Which model/tool are you using? If it is a local or small model, I'll split the work into short sessions so docs stay complete." Default: single mode for agentic tools with large-context models; session mode for chat-only UIs on Standard/Enterprise.

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

Load ONLY these. Never load all references. "§" = template section numbers. Always first: `HANDOVER.md` and `STATE.md`. SKILL.md is assumed loaded by the tool (or pasted) — it is the procedure.

| WP | Upstream project docs (sections only) | Skill files | Template(s) |
|---|---|---|---|
| WP1 | — (repo listing in brownfield) | `references/discovery-question-bank.md` (only the tier's domains/rounds, one domain group at a time), `references/stack-recommendation.md` (Phase 3 only), `references/tiering-and-doc-matrix.md` §Matrix | `docs/DISCOVERY.md` |
| WP2 | DISCOVERY §2 brief, §3.3 scope, §11.1–11.3 seeds | `references/product-guide.md` §0, §1, §2, §4, §5, §12, §13, §17 | PRD, APP_FLOW, DESIGN_SYSTEM |
| WP3 | DISCOVERY §3.4–3.5, §6 decisions; PRD §7.1 feature summary, §8 NFR summary | `references/architecture-guide.md` §1, §2, §4, §6, §10 (≤32k: §2 + §10 only) | TRD, ARCHITECTURE, decisions/README + 0001 + adr-template |
| WP4 | DISCOVERY §11.4 entity seeds; PRD §4 personas/roles, §7 features (+ §7.4 lifecycles); ARCHITECTURE §4 stack table, §5 boundaries, §7 interfaces | `references/data-modeling-guide.md` §1–§6, §13 (≤32k: §1–§5 + §13 only); `references/architecture-guide.md` §8 (API) | DATABASE, API |
| WP5 | PRD §4 roles, §7.1, AC lists; TRD §3 NFRs; ARCHITECTURE §3.2 containers, §5; DATABASE §2 classification, §8 access rules; API §3 catalog | `references/governance-guide.md` §3, §4, §6, §9 | SECURITY_ARCHITECTURE, TESTING |
| WP6 | TRD §3 NFRs; ARCHITECTURE §4, §11 deployment; TESTING §8 CI gates; PRD §7.1, §11 release plan; HANDOVER §4 registry | `references/governance-guide.md` §5, §7; `references/product-guide.md` §14 | OPERATIONS, IMPLEMENTATION_PLAN |
| WP7 | ARCHITECTURE §4, §9 project structure; TESTING §9 commands; DISCOVERY §3.8 team | `references/governance-guide.md` §8, §9 | CODE_STYLE, GIT_WORKFLOW, AI_GUIDELINES |
| WP8 | DISCOVERY §3.6, §3.8, §8; DATABASE §2, §12 (for privacy); STATE documents table | `references/legal-compliance-primer.md` (triggered regimes only); `references/governance-guide.md` §8 | legal templates as needed, root/community templates, AGENTS.md, docs/README.md |
| WP9 | Headers + ID lines of every doc; PRD §18, TESTING §12, IMPLEMENTATION_PLAN §3 traceability | `references/consistency-audit.md` | — (run `scripts/check-docs.mjs` if commands work) |

Rules:

1. Read sections, not whole files, when the tool allows ranged reads (search for the `## N.` heading). In chat-only mode, ask the user to paste only the listed sections.
2. Prefer the HANDOVER §4 ID registry over re-reading upstream docs for names and IDs. Re-read an upstream doc only when you need its content, not its IDs.
3. Write one document at a time; finish it before loading the next template.
4. If you are about to exceed your budget mid-document, finish the current section, mark the doc `partial (§1–§N done)` in STATE and HANDOVER, write HANDOVER, and stop.

---

## 4. Budget heuristics

Approximate token sizes (bytes ÷ 4; real tokenizers vary ±25%, non-English text costs more). Plan for the reply too: a full large doc is 4–10k tokens of output.

### 4.1 Skill files

| File | ≈ tokens | File | ≈ tokens |
|---|---|---|---|
| SKILL.md | 7.6k | `references/workflow.md` | 4.9k |
| `references/session-mode.md` (this file) | 3.3k | `references/tiering-and-doc-matrix.md` | 2.4k |
| `references/document-catalog.md` | 5.6k | `references/discovery-question-bank.md` | 9.2k |
| `references/experience-modes.md` | 2.1k | `references/existing-project-mode.md` | 1.9k |
| `references/stack-recommendation.md` | 3.2k | `references/legal-compliance-primer.md` | 3.9k |
| `references/writing-conventions.md` | 2.5k | `references/consistency-audit.md` | 1.8k |
| `references/product-guide.md` | 7.8k (lean set ≈ 3.5k) | `references/architecture-guide.md` | 7.1k (lean set ≈ 2.7k) |
| `references/data-modeling-guide.md` | 12.8k (§1–§5 + §13 ≈ 5.2k) | `references/governance-guide.md` | 6.1k (per WP ≈ 1–2.5k) |

### 4.2 Templates

| Template | ≈ tokens | Template | ≈ tokens |
|---|---|---|---|
| DISCOVERY | 2.5k | docs/README | 2.3k |
| PRD | 4.9k | APP_FLOW | 3.1k |
| DESIGN_SYSTEM | 3.4k | TRD | 2.6k |
| ARCHITECTURE | 4.8k | ADR README + 0001 + template | 2.3k |
| DATABASE | 5.3k | API | 2.7k |
| SECURITY_ARCHITECTURE | 10.1k | TESTING | 5.3k |
| OPERATIONS | 5.8k | IMPLEMENTATION_PLAN | 6.3k |
| CODE_STYLE | 4.1k | GIT_WORKFLOW | 3.8k |
| AI_GUIDELINES | 7.7k | AGENTS.md | 2.4k |
| PRIVACY_POLICY | 2.8k | TERMS_OF_SERVICE | 2.0k |
| COMPLIANCE | 1.6k | COOKIE_POLICY | 0.9k |
| DATA_PROCESSING_AGREEMENT | 3.2k | BUSINESS_ASSOCIATE_AGREEMENT | 2.5k |
| MASTER_SERVICES_AGREEMENT | 2.0k | | |
| README / CONTRIBUTING / SECURITY.md / ACCESSIBILITY | 1.2–1.5k each | `.github/*`, CHANGELOG, SUPPORT, CODE_OF_CONDUCT | 0.3–0.8k each |
| HANDOVER | 0.9k (filled ≤ 2k) | | |

### 4.3 Planning a session

`budget ≈ SKILL.md (7.6k) + HANDOVER/STATE (2–3k) + upstream sections (3–8k) + skill sections (2–5k) + templates + output (≈ 1.5× template size per doc)`.

| Context | What fits per session |
|---|---|
| ≤ 16k | SKILL.md + HANDOVER + one template + its output. One document per session; drop the guide or read only its self-review checklist. |
| 16–32k | One WP of 2 small docs, or 1 large doc (SECURITY_ARCHITECTURE, IMPLEMENTATION_PLAN, AI_GUIDELINES alone). Use the ≤32k guide subsets. |
| 32–64k | One WP as listed. |
| 64–200k | Standard: merge pairs (WP6+WP7). Enterprise: one WP per session. |
| ≥ 200k | Single mode is usually fine; still write HANDOVER if the run is interrupted. |

Signs you are near the limit: you cannot recall an F-xx title or role name without re-reading; the tool summarizes or drops earlier turns; output starts getting shorter per section. Then: finish the current section, write HANDOVER, stop.

---

## 5. HANDOVER.md procedure

Path: `docs/.start-from-here/HANDOVER.md`. Overwrite (never append) at the END of every session, after any `next session` / `handover` command, and whenever you sense you are near your limit. Keep ≤ ~150 lines; no secrets; no `{{` left.

Must contain (template sections):

1. Session number, date, model/tool, tier, WP done and whether complete or partial.
2. Files created/changed this session with status and a coverage line.
3. Key decisions summary (≤ 15 bullets, D-xx/ADR refs).
4. ID registry snapshot: product name, personas, roles, F-xx titles (+ priority), journeys, NFR-xx (with numbers), screens, entity names, API operations, ADR titles, trust boundaries, milestones, one-line stack. Only IDs that exist so far.
5. Open TBD items and questions with owner and where they live.
6. Quality notes: things the next session must not miss (e.g. "DATABASE must include `audit_logs` because NFR-07 requires an admin audit trail"; "F-04 has only 2 AC — add a negative case in TESTING").
7. Next WP and its lean reading list (from §3, filled with real sections).
8. Copy-paste "Next session prompt" block, e.g.:

```text
Use the start-from-here skill. Resume session mode: read docs/.start-from-here/HANDOVER.md
and docs/.start-from-here/STATE.md, then do WP4.
```

Also update STATE.md (`Current WP`, documents table, `next_step`) before writing HANDOVER.

### 5.1 End of session message

Filesystem mode: list files written, the coverage lines, then show the next-session prompt and say: "Start a NEW session (fresh context) and paste this prompt."

Chat-only mode: print `### docs/.start-from-here/HANDOVER.md` and `### docs/.start-from-here/STATE.md`, each as one fenced markdown block, after the documents of this session. Tell the user: "Save these two blocks (and the documents above). Open a new chat, paste or attach them together with the next-session prompt, plus the upstream sections listed in HANDOVER §7."

### 5.2 Starting a session-mode session (resume)

1. Read HANDOVER.md, then STATE.md. If they disagree, STATE.md wins for statuses; HANDOVER wins for the ID registry (fix whichever is stale and tell the user).
2. Re-apply calibration from STATE.md without asking again.
3. Summarize in ≤ 5 lines: WP done, WP now, docs to produce, blocking TBDs.
4. Load the lean reading list for the WP (only), generate, self-check, present the batch, **STOP** for review.
5. After approval (or when the user says `next session`), update STATE.md, overwrite HANDOVER.md, print the next-session prompt, and stop. Do not start the next WP in the same session unless the user explicitly asks and you have budget.

---

## 6. Quality safeguards in session mode

- IDs are copied from HANDOVER §4 verbatim; new IDs continue the sequence (never renumber).
- Before WP9, every WP adds its new IDs to HANDOVER §4 so the audit can work from the registry.
- WP9 does the traceability pass F-xx → APP_FLOW → API → DB entity → test → task from ID lines and traceability sections, re-opening a doc only to fix it.
- If a later WP finds an upstream gap (e.g. an entity missing an F-xx), apply the change-propagation rule: fix upstream, set it `In review`, note it in HANDOVER §6.
- Tip for users: use the largest model available for WP3–WP5 (architecture, data, security) if they can switch models between sessions; small models are fine for WP7–WP8.
