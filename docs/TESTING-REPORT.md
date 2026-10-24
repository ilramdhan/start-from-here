# Cross-model testing report: start-from-here v1.0.0

> **Status:** Final · **Owner:** QA (AI-assisted) · **Run date:** 2026-10-24/25 · **Scope:** `skills/start-from-here/**`

This report records how the skill behaves on different model families when it runs as an installed Agent Skill (agentic CLIs) and as a pasted system prompt (local chat models). It covers the method, the scored matrix, the findings, the fixes applied to the skill, a before/after re-run, and known limits.

Evidence is in [`test/model-runs/`](../test/model-runs/): checker JSON, rubric JSON, file inventories, document excerpts, S3 transcripts, and the harness scripts.

---

## 1. Environment

| Item | Value |
|---|---|
| Host | Apple M5 Pro, 15 cores, 24 GB unified memory, macOS 27.0.1 |
| Node | v22.23.2 |
| Claude Code CLI | 2.1.302 (model alias `sonnet`) |
| Antigravity CLI (`agy`) | 1.4.7 |
| Ollama | 0.40.9 (local, `localhost:11434`) |
| Skill under test | `skills/start-from-here` v1.0.0, installed per run with `node bin/cli.mjs install --dir <scratch> --yes` |
| Scratch area | `/tmp/sfh-models/<run>/` (one empty project per run) |

### Safety constraints that held for every run
- `--dangerously-skip-permissions` or similar flags were never used.
- Claude Code ran as `claude -p … --permission-mode acceptEdits --allowedTools Read Write Edit Glob Grep`, with cwd set to the scratch dir. It had no shell tool.
- `agy` ran as `agy -p … --mode accept-edits --sandbox --print-timeout 1500s`, with cwd set to the scratch dir.
- Ollama models had no tools. The QA harness saved their fenced output to disk.
- Every command was wrapped in `perl -e 'alarm N; exec @ARGV'` timeouts.

## 2. Models and scenarios

| Run ID | Scenario | Model | Surface | Mode |
|---|---|---|---|---|
| s1-sonnet | S1 Standard: TaskFlow SaaS | Claude Sonnet (Claude Code `sonnet`) | Claude Code CLI, installed skill | Filesystem |
| s1-argon | S1 Standard | `gemini-4-argon-medium` | Antigravity CLI, installed skill | Chat-only (see §5, F-1) |
| s1-gptoss | S1 Standard | `gpt-oss-120b-medium` | Antigravity CLI, installed skill | Chat-only |
| s2-flash | S2 Lite: offline habit tracker (mobile) | `gemini-3.8-flash-medium` | Antigravity CLI, installed skill | Chat-only |
| s1-qwen | S1 partial (DISCOVERY, PRD, ARCHITECTURE, DATABASE) | `qwen3.8:27b` (fallback: `qwen3.6:27b-q4_K_M`) | Ollama `/api/chat`, system prompt | Chat-only |
| s3-gemma | S3 interactive probe | `gemma4:12b-it-qat` | Ollama, system prompt | Chat-only |
| s3-sonnet | S3 interactive probe | Claude Sonnet | Claude Code CLI | Filesystem |
| s3-flash | S3 interactive probe | `gemini-3.8-flash-medium` | Antigravity CLI | (no output, see F-1) |
| s1-gptoss-after | S1 re-run after fixes | `gpt-oss-120b-medium` | Antigravity CLI | Chat-only |

**Scripted brief (S1/S2).** "Use the start-from-here skill. Non-interactive test: the brief below contains the user's answers to all discovery rounds; at every STOP gate assume the user replied 'approved — continue'; tier = X; … produce all docs for the tier." It was followed by about 20 lines of answers covering every discovery domain. The full texts are in `test/model-runs/tools/brief-*.txt`. In chat-only runs the harness replied `next` until the model stopped or 14–22 turns had passed.

**S3 probe.** The plain prompt "I want to build a recipe sharing app, help me start". Pass means the model asks Round-0 calibration questions and writes no docs (STATE.md is allowed) and no code.

## 3. Method

Each output was scored four ways:

1. **Checker:** `node skills/start-from-here/scripts/check-docs.mjs <proj> --json`. It reports errors (missing files, leftover placeholders, broken links, missing headers) and warnings (missing template H2 sections, missing diagrams, anchors).
2. **Completeness rubric:** `test/model-runs/tools/rubric.mjs`, which makes about 22 binary checks.
   - PRD: Must features have acceptance criteria (AC), negative AC, and Given/When/Then format.
   - DATABASE: an `erDiagram` with attributes; expected domain and supporting entities (13 for S1, 4 for S2); foreign keys (FKs) indexed; column tables; tenant, retention and PII coverage.
   - ARCHITECTURE: C4 context and container views, ≥4 sequence diagrams (≥2 for Lite), and a deployment view.
   - SECURITY: all 6 STRIDE categories, trust boundaries (TB) and an authorization (authz) matrix.
   - PLAN: milestones M0–M7, entry/exit gates, and a gantt or flowchart plus an ASCII version.
   - Traceability: every Must F-xx appears in the plan, and every AC appears in TESTING.
   - AI_GUIDELINES has DO/DON'T lists, and AGENTS.md links ≥8 docs.
3. **Compliance:**
   - no application-code files
   - no version numbers stated without a "verify" note
   - legal disclaimer on every legal doc
   - no "is compliant" claims
   - STATE.md present and parseable
   - status headers
   - ASSUMPTION/PROPOSAL labels
   - IDs typed with ASCII hyphens
4. **Mermaid sanity (heuristic):** every extracted ` ```mermaid ` block is checked for a known diagram type, balanced brackets (quoted labels and ER cardinality excluded), `alt/opt/loop` and `end` pairs, `subgraph` and `end` pairs, unquoted parentheses in flowchart labels (`[(db)]` cylinder shapes allowed), ER relationship labels, and gantt `dateFormat`.

Scores are the percentage of rubric checks passed, per area. Chat-only output was extracted with `tools/extract-blocks.mjs`. The extractor splits on path headings and closes at the last bare fence before the next heading, so nested Mermaid fences survive.

## 4. Results matrix (before fixes)

| Run | Docs produced / expected | check-docs errors / warnings | Completeness | Compliance | Mermaid (blocks, suspicious) | S3 / gates | Overall |
|---|---|---|---|---|---|---|---|
| **s1-sonnet** (Claude Sonnet, FS) | 45 / 45 | **0** / 9 | **100 %** | **100 %** | 100 % (45, 0) | ended with "Documentation is complete…" handoff | **A** |
| **s1-argon** (Gemini 4 Argon, chat) | 41 / 41 † | **0** / 26 | **100 %** | 75 % (STATE as YAML; "PostgreSQL 16" in README) | 100 % (40, 1 ER label) | — | **A−** |
| **s2-flash** (Gemini 3.8 Flash, Lite, chat) | 16 / 16 | **0** / 82 (72 missing sections) | 91 % | 88 % ("TypeScript 5.x" in AGENTS.md) | 100 % (13, 0) | — | **B** |
| **s1-gptoss** (GPT-OSS 120B, chat) | 15 / 37 (stopped, then claimed "every document presented") | 22 / 198 (195 missing sections) | **32 %** | 75 % (164 IDs with U+2011 hyphens) | 0 % (8, 1 unquoted parens) | — | **D** |
| **s1-qwen** (Qwen 3.8 27B, Ollama) | 0 | — | — | — | — | — | **not scoreable** (OOM, see §6) |
| **s3-sonnet** | STATE.md only | — | — | — | — | **PASS**: Round-0 questions, no docs/code | PASS |
| **s3-gemma** (SKILL.md as system prompt) | STATE block only | — | — | — | — | **PASS**: Round-0 questions with defaults, "no code" stated | PASS |
| **s3-gemma** (full 723 KB bundle as system prompt) | — | — | — | — | — | **PARTIAL**: no docs/code, but did not run the Round-0 calibration (SKILL.md truncated out of context) | PARTIAL |
| **s3-flash** (agy) | nothing | — | — | — | — | **N/A**: headless shell call auto-denied, empty reply | env fail |

† Argon's `agy` print-mode transcript lost most turns' text: the CLI returned only the last segment of very long multi-message turns. All documents were recovered from the local conversation store (`~/.gemini/antigravity-cli/conversations/<id>.db`, read-only copy). Scores use the recovered set.

Rubric details per run are in `test/model-runs/<run>/rubric.json`, and checker output is in `check-docs.json`.

### Per-model observations
- **Claude Sonnet.** Most complete run.
  - Output: 13 DB entity areas, 36 column tables, 31 index rows, 82 AC (9/10 Must features with a negative AC), all 82 AC mapped to tests, M0–M7 with gates, 8 TB ids, STRIDE as a letter column, 8 ADRs, and 38 open questions.
  - It refused to mark anything Approved under the scripted "assume approved" instruction and flagged that the tier scoring suggested Enterprise.
  - Its only checker errors were STATE.md grouped rows (`README.md, LICENSE, …`), which caused 3 false "missing" errors (fixed, §7).
- **Gemini 4 Argon.** Equally deep: DATABASE 1,126 lines, API 659 lines, TESTING 333 lines, AI_GUIDELINES 437 lines. It read 41 template/reference files.
  - It wrote STATE.md as YAML front matter, so the checker could not read the tier and the presence check became report-only (fixed in the checker and in SKILL.md).
  - It put "PostgreSQL 16+" in README prerequisites, taken from the template's own example (fixed in the templates).
  - It marked docs `Approved` because the scripted brief said to.
- **Gemini 3.8 Flash (Lite).** Content was correct and well-traced: 8 Must features with AC, `habit`/`check_in`/`reminder`/`setting` entities, 2 sequence diagrams, and M0–M7 phases.
  - It dropped many template H2 headings: 18 of 20 in AI_GUIDELINES, plus PRIVACY_POLICY 10, README 12 and SECURITY_ARCHITECTURE 9. It treated "Lite = shorter" as "Lite = fewer sections".
  - It mapped only 11 of 18 AC to tests and lacked explicit plan entry/exit gates.
  - It read 17 template/reference files.
- **GPT-OSS 120B.** Weakest run.
  - It read SKILL.md only, with zero templates or references. Its docs were 40–100 lines each and missing 60–90 % of template sections.
  - PRD AC were plain numbered lists with no AC-ids and no Given/When/Then. DATABASE had no column tables and an ERD without attributes. ARCHITECTURE had no sequence diagrams. There was no plan.
  - All IDs used U+2011 non-breaking hyphens (`F‑01`), which breaks grep-based traceability.
  - After 9 turns it began re-sending earlier docs "for completeness". On turn 10 it claimed it had presented every Standard document, with 22 still missing.
  - On turn 1 it tried a shell command, was denied, and returned an **empty** reply.
- **Gemma 4 12B.**
  - With SKILL.md as the system prompt, its S3 behaviour was correct: Round 0 with 4 questions, defaults, a tier proposal, and "no code" stated.
  - It filled `last_updated` with an invented date (2024-05-22) instead of asking.

## 5. Findings

| ID | Severity | Finding | Evidence | Systemic? | Fix |
|---|---|---|---|---|---|
| F-1 | High (env) | `agy` headless print mode auto-denies any tool that needs the `command` or `write_file` permission, even with `--mode accept-edits --sandbox`. The models tried a shell `ls` first and some returned an empty reply. As required, the fallback was **chat-only**, with file *reads* still allowed. | `test/model-runs/s3-flash-agy.log`, `s1-gptoss` turn 1 `denied_actions` | Partly. The skill never needs a shell before Phase 6 but did not say so. | SKILL.md: inspect with read/list tools; if a tool is denied, continue in the same reply; never end a turn empty. |
| F-2 | High | Weaker models skip reading templates and write from their own idea of a "PRD" or "DATABASE". Template reads tracked score closely: Argon 41 reads, 100 %; Flash 17, 91 %; GPT-OSS 0, 32 %. | `argon-db` string scan of agy conversation stores | Yes | SKILL.md Phase 5 step 1: **open and read the template before writing each document**, with the measured consequence stated. |
| F-3 | High | Template H2 sections were dropped, mostly under Lite and chat-only. Flash lost 72 headings; GPT-OSS lost 195. | `s2-flash/check-docs.json`, `s1-gptoss/check-docs.json` | Yes | Completeness protocol item 3: enumerate the template's `## ` headings and emit each in order; Lite shortens content, not headings. Lists the docs that most often lost sections. |
| F-4 | High | In chat-only mode a model can claim "all documents presented" while 22 are missing, and repeat earlier docs. | `s1-gptoss` turns 9–10 | Yes | Chat-only rule: every message ends with a ledger `Delivered: N of M · Next · Remaining`; never claim completion while Remaining is non-empty; don't repeat or skip ahead. |
| F-5 | Medium | Version numbers came straight from template examples: "PostgreSQL 16" in the DATABASE/README templates, "TypeScript 5.x / Node 22" in CODE_STYLE. Models copied them into README and AGENTS.md, against hard rule 9. | `s1-argon` README, `s2-flash` AGENTS.md | Yes (template-induced) | Templates now say "version: verify at setup"; SKILL.md writing conventions extend rule 9 to README, AGENTS.md and ADRs. |
| F-6 | Medium | IDs typed with U+2011 or U+2013 hyphens break search and traceability. | `s1-gptoss`: 164 occurrences | Yes (GPT-family typography) | Writing conventions: IDs use the ASCII hyphen-minus only. |
| F-7 | Medium | STATE.md drift: grouped rows (`README.md, LICENSE, …`, `ISSUE_TEMPLATE/*`) or YAML front matter. The checker then raised false "missing" errors or lost the tier. | `s1-sonnet` (3 false errors), `s1-argon` (tier not detected) | Yes | SKILL.md: one row per path, no wildcards, keep the Markdown list format. `check-docs.mjs` now skips grouped/wildcard rows and accepts `tier: "Standard"`. |
| F-8 | Medium | Checker false positives: a ticked self-check line quoting `` `{{placeholders}}` `` in inline code raised 26 "leftover placeholder" errors in Argon's output. | `s1-argon/check-docs.json` (before) | Checker bug | `check-docs.mjs` ignores placeholders inside inline code (code blocks keep their warning). |
| F-9 | Low | Mermaid: unquoted parentheses in flowchart labels (`LB[Load Balancer (HTTPS)]`) and one ER relationship without a label. | `s1-gptoss`, `s1-argon` | Yes, small | SKILL.md diagrams rule: a compact Mermaid safety list (quote labels with punctuation, ER labels, no `varchar(255)`, matched `end`, gantt `dateFormat`). |
| F-10 | Low | SKILL.md said milestones `M0`–`M6`, while the plan template, product guide and catalog use M0–M7 plus gates G0–G5. | `SKILL.md` writing conventions | Yes (inconsistency) | Changed to `M0`–`M7` and `G0`–`G5`. |
| F-11 | Low | Owner fields said "Antigravity" (the tool) instead of a person or role. | `s1-gptoss` status headers | Yes | Writing conventions: Owner is a person or role from DISCOVERY, never the AI tool. |
| F-12 | Info | All runs: no application-code files, no secrets, no "is compliant" claims; every generated legal doc carried the disclaimer; STATE.md present. Hard rules 1, 3 and 7 held on every model. | rubric `compliance` checks | — | — |
| F-13 | Info | Scripted "assume approved" was handled differently. Sonnet kept docs `Draft` and explained why; Argon and Flash set `Approved`. Both are defensible in a scripted test. Interactive gating was verified separately by S3. | status headers | — | None (test-harness artefact) |

## 6. Context-limit findings

These observations come from runs that hit context or memory limits. They are for the session-mode / context-budget work and are not fixed here.

| # | Model / surface | Where it failed | Symptom | Numbers |
|---|---|---|---|---|
| CL-1 | gemma4:12b-it-qat via Ollama, **full bundle** `dist/start-from-here.prompt.md` as system prompt, `num_ctx` 65536 | Phase 0/1, first turn | Ollama **silently truncated** the system prompt to the last part of the bundle. SKILL.md, which sits at the start, was lost. The model improvised a generic "PRD → ARCHITECTURE → plan" flow and skipped Round-0 calibration (language, experience, tier). | Bundle 717,738 chars ≈ 180k tokens; `prompt_eval_count` = 32,771 tokens actually processed |
| CL-2 | qwen3.8:27b via Ollama, compact prompt (SKILL.md + 4 templates ≈ 101 KB ≈ 25k tokens), `num_ctx` 65536 | Turn 1 (STATE + DISCOVERY) | Machine memory dropped to 3 % free (18 GB model weights + KV cache on 24 GB). No tokens came back in 25 min; then `ollama serve` crashed. | 24 GB host |
| CL-3 | qwen3.8:27b, SKILL.md only (≈ 8k tokens), `num_ctx` 32768 | Turn 1 | `mlx runner failed: … Insufficient Memory (kIOGPUCommandBufferCallbackErrorOutOfMemory)` after 96 s | 24 GB host |
| CL-4 | qwen3.6:27b-q4_K_M, SKILL.md only, `num_ctx` 24576 | Turn 1 | Fallback attempt; see §8 for the outcome | — |
| CL-5 | gpt-oss-120b via agy, chat-only, Standard tier | Turns 9–10 (after about 15 docs, at the OPERATIONS/CODE_STYLE/GIT_WORKFLOW batch) | `status: ERROR` turns. The model re-sent earlier docs "for completeness", then falsely claimed completion. **22 tier docs were never produced**: IMPLEMENTATION_PLAN, AI_GUIDELINES, legal, repo files, AGENTS.md. | Cumulative input 80k → 98k tokens, output 30k → 38k per turn; cache_read 308k → 604k |
| CL-6 | gemini-3.8-flash via agy, chat-only, Lite | Whole run (8 turns) | Finished, but per-doc depth fell in later docs: AI_GUIDELINES 88 lines with 18 of 20 sections dropped, IMPLEMENTATION_PLAN 106 lines. Early docs were longer (PRD 387, ARCHITECTURE 337). | Input grew 38k → 165k tokens across 8 turns |
| CL-7 | gemini-4-argon via agy, chat-only, Standard | Turns 2–6 | Generation completed, but `agy -p --output-format json` returned only the final segment of very long turns (up to 232k output tokens in one turn). PRD, ARCHITECTURE, DATABASE, API, SECURITY and TESTING were missing from stdout and had to be recovered from the conversation DB. | Output tokens per turn: 14k, 87k, 90k, 195k, 228k, 232k |
| CL-8 | Claude Sonnet via Claude Code, filesystem | none | Full Standard set (45 files) in a single `-p` invocation (about 75 min). Files written incrementally are what made this robust. | — |

**Implications for design.** These are data, not implemented here.
- (a) The 723 KB single-file bundle is unusable on any local model with less than 200k context, and truncation is silent. Small models need a lean path: SKILL.md plus the one template for the current document.
- (b) Chat-only long runs degrade after about 80–100k cumulative tokens. That is when phantom completion and repeated docs start.
- (c) Local 27B models on a 24 GB machine cannot hold even an 8k-token system prompt plus generation at 24–32k context. The realistic local tier is 12B models with SKILL.md only, one document per session.
- (d) Per-document sessions with a written hand-off would have avoided CL-5 and CL-6.

## 7. Fixes applied (all in `skills/start-from-here/**`)

| File | Change | Finding |
|---|---|---|
| `SKILL.md`, Output modes → Command capability | No shell needed before Phase 6; continue when a tool is denied; switch to chat-only if writes are denied; never end a turn empty. | F-1 |
| `SKILL.md`, Output modes → Chat-only | Four-backtick fence for docs that contain fences; mandatory delivery ledger `Delivered N of M · Next · Remaining`; no phantom completion, no repeats, no skipping ahead. | F-4 |
| `SKILL.md`, Phase 5 step 1 | Open and read the template before writing each document, every time. | F-2 |
| `SKILL.md`, Completeness protocol item 3 | Enumerate and emit every template `## ` heading in order; Lite shortens content, not headings; lists the docs that most often lose sections. | F-3 |
| `SKILL.md`, Completeness protocol item 5 | Mermaid safety rules. | F-9 |
| `SKILL.md`, STATE.md format | One row per path, no grouping or wildcards, keep the Markdown format (not YAML). | F-7 |
| `SKILL.md`, Writing conventions | ASCII hyphen in IDs; Owner is a person or role, not the AI tool; rule 9 also covers README/AGENTS/ADRs; `M0`–`M7` plus `G0`–`G5`. | F-5, F-6, F-10, F-11 |
| `assets/templates/docs/technical/DATABASE.md`, `README.md`, `docs/engineering/CODE_STYLE.md` | Example version numbers replaced with "verify at setup" wording. | F-5 |
| `scripts/check-docs.mjs` | Ignore `{{…}}` inside inline code; skip grouped or wildcard STATE rows; accept YAML-style `tier: "Standard"`. | F-7, F-8 |

SKILL.md is now under 400 lines (limit 500). Frontmatter `name` and `description` are unchanged. `npm run validate` passes; `npm test` passes 28/28.

**Checker false-positive impact** (same outputs, before → after the checker fix):

| Run | Errors before | Errors after |
|---|---|---|
| s1-sonnet | 4 | **0** |
| s1-argon (recovered set) | 26 | **0** |
| s2-flash | 0 | 0 |
| s1-gptoss | 22 | 22 (real: docs not produced) |

## 8. Before / after (worst scenario re-run: S1 on GPT-OSS 120B)

**Not completed.** The re-run of S1 on GPT-OSS 120B with the fixed SKILL.md was started (5 turns, transcript excerpts in `test/model-runs/`), but testing was stopped by the maintainer before it finished, so no after-fix score is claimed. Session mode (`references/session-mode.md`, `HANDOVER.md`) was built afterwards to address the context-limit findings in §6 (CL-5, CL-6). It has **not yet been benchmarked**; that is the next item on the test plan.

## 9. Limitations

- **Untestable surfaces.** ChatGPT web, Custom GPTs, Gemini web or Gems, GitHub Copilot (VS Code, cloud agent), Cursor, Windsurf, Cline, Codex CLI and JetBrains AI could not be driven headlessly in this environment. The tested family that stands in for each:

  | Untested surface | Closest tested proxy | Why |
  |---|---|---|
  | ChatGPT web / Custom GPT (GPT-5-class) | **gpt-oss-120b** (OpenAI open-weight family, chat-only) | Same vendor style: Unicode hyphens, list-style AC. Frontier GPT models are expected to do better than gpt-oss. |
  | Codex CLI | gpt-oss-120b (family) + Claude Code (agentic file-writing flow) | |
  | Gemini web / Gems / Gemini CLI | **gemini-4-argon**, **gemini-3.8-flash** | Same models. Gems ingest knowledge files rather than reading a skill folder. |
  | GitHub Copilot agent mode, Cursor, Windsurf, Cline | **Claude Sonnet via Claude Code** (when those tools use Claude models), Gemini via agy (when they use Gemini) | The skill loads from `.agents/skills/` the same way. Model quality dominates the outcome. |
  | Ollama / LM Studio / small local models | **gemma4:12b** (S3 only); qwen 27B could not run (memory) | |

- **Non-interactive by design.** S1 and S2 used a scripted brief that pre-answers all rounds and pre-approves all gates. Gate behaviour is therefore tested only by S3 (Round 0). Rounds 1–N, the Phase 3 STOP and the Phase 4 brief approval were not exercised live.
- **agy restrictions.** Headless `agy` could not write files without `--dangerously-skip-permissions`, which was not allowed. All agy runs are chat-only with file reads, so they measure chat-only quality for Gemini/GPT, not their filesystem-mode quality.
- **Single sample per cell.** Temperature and sampling variance were not measured; scores are indicative.
- **Heuristic rubric.** The rubric is regex-based. It verifies presence and structure, not semantic correctness (for example, whether an index actually serves a query). Mermaid checks are heuristic, not a renderer.
- **Service noise.** gpt-oss and argon hit repeated `503 No capacity` errors; the harness retried up to 6 times with a 90 s wait.

## 10. How to reproduce

```bash
# 0. build + tools
npm run build                                  # dist/start-from-here.prompt.md for chat-only/local models
mkdir -p /tmp/sfh-models/tools && cp test/model-runs/tools/* /tmp/sfh-models/tools/

# 1. Claude Code (filesystem mode)
mkdir -p /tmp/sfh-models/s1-sonnet && node bin/cli.mjs install --dir /tmp/sfh-models/s1-sonnet --yes
cd /tmp/sfh-models/s1-sonnet && perl -e 'alarm 3600; exec @ARGV' claude -p "$(cat ../tools/brief-s1.txt)" \
  --model sonnet --permission-mode acceptEdits --allowedTools "Read" "Write" "Edit" "Glob" "Grep"

# 2. Antigravity CLI (chat-only multi-turn driver; replies "next" until done)
mkdir -p /tmp/sfh-models/s1-argon && node bin/cli.mjs install --dir /tmp/sfh-models/s1-argon --yes
bash /tmp/sfh-models/tools/agy-chat.sh /tmp/sfh-models/s1-argon gemini-4-argon-medium /tmp/sfh-models/tools/brief-s1-chat.txt 22
node /tmp/sfh-models/tools/extract-blocks.mjs /tmp/sfh-models/s1-argon/transcript.md /tmp/sfh-models/s1-argon/out

# 3. Ollama (no tools; SKILL.md as system prompt; curl-based, long timeout)
node /tmp/sfh-models/tools/ollama-chat.mjs gemma4:12b-it-qat skills/start-from-here/SKILL.md /tmp/sfh-models/s3-gemma 32768 /tmp/sfh-models/tools/s3.txt

# 4. Score
node skills/start-from-here/scripts/check-docs.mjs <projectDir> --json
node /tmp/sfh-models/tools/rubric.mjs <projectDir> --tier Standard|Lite [--partial]
```

Notes:
- Copy `agy-chat.sh` per run before starting it. Editing a bash script while it runs corrupts the running loops.
- Use `curl` rather than Node `fetch` for Ollama, because undici's 5-minute headers timeout aborts long generations.
- If `agy` stdout is incomplete, documents can be recovered from a read-only copy of `~/.gemini/antigravity-cli/conversations/<conversation_id>.db`.
