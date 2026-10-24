# start-from-here — User manual

This manual works the same on every AI tool. For installation, see the [platform guides](guides/README.md).

## What it does

`start-from-here` turns your AI assistant into a **project discovery partner and pre-development architect**. It:

1. Interviews you in short rounds, and recommends a default for every question.
2. Recommends a tech stack (2–3 options, one marked Recommended) if you haven't chosen one.
3. Writes a brief (`docs/DISCOVERY.md`) and waits for your approval.
4. Generates a consistent set of documents: product, technical, engineering, AI rules, legal, and open-source/GitHub files.
5. Audits the documents against each other.
6. Hands off with a readiness checklist and a **first implementation prompt**.

It **never writes application code**. It also never invents facts, metrics, commands, test results, or compliance claims. Unknowns become `[TBD: …]`, its ideas become `> **PROPOSAL:**`, and its guesses become `> **ASSUMPTION:**`. It never overwrites an existing file without your approval.

## Start it

| Tool | Say |
|---|---|
| Claude Code, Copilot, Cursor, Junie, Zed, Augment, Qwen Code | `/start-from-here` |
| Codex | `$start-from-here` |
| Windsurf / Devin Desktop | `@start-from-here` |
| Open WebUI | `$start-from-here` |
| ChatGPT Skills | `@start-from-here` |
| Anything else | `Use the start-from-here skill to plan my new app.` |
| Pasted prompt / Gem / Custom GPT | `start` |

Add your idea on the same line to save a round: `/start-from-here a booking app for my yoga studio`.

## Phases

| # | Phase | What happens | You do |
|---|---|---|---|
| 0 | **Orient** | Detects new project, existing repo (brownfield), resume, or doc update. Detects whether it can write files. | Confirm if asked |
| 1 | **Calibrate** | Asks language(s), experience, idea, size signals. Proposes a tier and the doc list. | **Approve** tier and docs |
| 2 | **Discover** | Rounds of up to 7 numbered questions (4–5 for beginners) with defaults: vision → users → scope → data → NFRs → stack → security/compliance → ops → team/OSS/legal → constraints. | Answer each round |
| 3 | **Recommend** | If stack/hosting/license is open: 2–3 options with trade-offs, one Recommended. | **Pick** an option |
| 4 | **Confirm brief** | Writes `docs/DISCOVERY.md` and shows a ≤ 25-line summary. | **Approve** the brief |
| 5 | **Generate** | Writes docs in dependency order and shows them in review batches. | **Approve** or request changes per batch |
| 6 | **Audit** | Cross-checks scope, names, stack, roles, NFRs, legal ↔ data, license, leftover markers, links. | Choose: fix or proceed |
| 7 | **Handoff** | Readiness checklist, open questions, first implementation prompt. Stops. | Start building with any agent |

Bold steps are **gates**: the skill stops and waits for you.

## Tiers

The skill proposes a tier from your answers; you confirm. You can toggle individual docs, or say `change tier Standard` later.

| Tier | For | Interview size | Review |
|---|---|---|---|
| **Lite** | Solo / indie / prototype / hackathon / internal tool | ≈ 3 rounds, 15–25 questions | By group (3 batches) |
| **Standard** | Startup MVP, OSS project, small-team product | ≈ 5 rounds, 35–60 questions | 6 batches |
| **Enterprise** | Regulated data, multiple teams, SLAs, multi-tenant, audits | ≈ 7+ rounds, 60+ questions | One doc per review (ADRs, legal, and .github files grouped) |

Any regulated data signal (health, payment, children, finance) or formal compliance regime (HIPAA, PCI DSS, SOC 2, ISO 27001…) makes it propose Enterprise unless you object.

## Experience modes

Chosen in Round 0 (or inferred from how you write).

| Mode | Behaviour |
|---|---|
| **Beginner** | Explains every technical term in one plain sentence on first use. Always recommends. Prefers multiple-choice. No unexplained acronyms. |
| **Intermediate** | Brief explanations of less common terms. Recommendations with one-line trade-offs. |
| **Expert** | Terse. Shows trade-offs and alternatives. Accepts free-form answers. |

Not sure? Say `explain <term>` at any time, e.g. `explain ERD`.

You can also choose different languages for the conversation and for the documents (for example, chat in Indonesian, docs in English). IDs, file names and code identifiers stay in English.

## Quick commands

Say these at any time. Loose wording works too ("continue", "you decide").

| Command | Effect |
|---|---|
| `start` | Begin at Phase 0. |
| `resume` | Read `docs/.start-from-here/HANDOVER.md` (if it exists) and `STATE.md`, then continue where you left off. |
| `session mode` / `single mode` | Split the work into short fresh sessions (one work package each), or go back to one long session. See [Small context windows & session mode](#small-context-windows--session-mode). |
| `next session` / `handover` | Write `HANDOVER.md` + `STATE.md` now, print the prompt for the next session, and stop. |
| `status` | Show phase, tier, docs table (Draft / Approved), open questions. |
| `use your recommendations` | Accept every recommended default in the current round. Each one is recorded as an ASSUMPTION in `DISCOVERY.md`. |
| `skip to generation` | Warns which domains are unanswered, fills them with labeled assumptions, and goes to the brief approval gate. |
| `audit docs` | Run only the audit (Phase 6) on existing docs and report. |
| `update <doc>` | Edit that doc, then update every downstream doc that depends on the change (e.g. `update PRD: add CSV export`). |
| `add <doc>` | Generate one extra doc from the catalog (e.g. `add COOKIE_POLICY`). |
| `explain <term>` | Plain-language explanation with one example. |
| `change tier <Lite/Standard/Enterprise>` | Recompute the doc set, show the difference, wait for approval. |
| `handoff` | Jump to Phase 7. |
| `next` | (Chat-only mode) send the next batch of documents. |

## Output document map

Generated inside **your** project. Which files you get depends on the tier and on your answers (UI? personal data? API? open source?).

```
<project>/
├── AGENTS.md                      # instructions for any AI coding agent; links every doc
├── CLAUDE.md / GEMINI.md / .github/copilot-instructions.md   # optional thin pointers to AGENTS.md
├── README.md
├── LICENSE                        # full official text
├── CHANGELOG.md                   # S E
├── CONTRIBUTING.md                # S E (L if open source)
├── CODE_OF_CONDUCT.md             # S E if open source
├── SECURITY.md                    # vulnerability disclosure policy (not the threat model)
├── SUPPORT.md                     # E (S optional)
├── ACCESSIBILITY.md               # S E if UI
├── .github/
│   ├── CODEOWNERS
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── ISSUE_TEMPLATE/{bug_report.yml, feature_request.yml, config.yml}
└── docs/
    ├── README.md                  # docs index + status table
    ├── DISCOVERY.md               # interview record — the source of truth
    ├── .start-from-here/STATE.md  # progress file for resuming
    ├── product/      PRD.md · APP_FLOW.md · DESIGN_SYSTEM.md
    ├── technical/    TRD.md · ARCHITECTURE.md · DATABASE.md · API.md · SECURITY_ARCHITECTURE.md
    │                 TESTING.md · OPERATIONS.md · IMPLEMENTATION_PLAN.md
    ├── engineering/  CODE_STYLE.md · AI_GUIDELINES.md · GIT_WORKFLOW.md
    ├── decisions/    README.md · 0001-record-architecture-decisions.md · one ADR per major decision
    └── legal/        TERMS_OF_SERVICE.md · PRIVACY_POLICY.md · COOKIE_POLICY.md · COMPLIANCE.md
```

Every doc starts with a status line (`Status · Owner · Last updated · Tier · Related`). IDs link the docs together: `P-01` persona, `F-01` feature, `US-01` story, `NFR-01` non-functional requirement, `R-01` risk, `Q-01` open question, `ADR-0001` decision. Diagrams are Mermaid and render on GitHub.

Legal drafts say: "This is a draft, not legal advice. Have it reviewed by qualified counsel."

### Filesystem mode vs chat-only mode

- **Filesystem mode** (Claude Code, Codex, Copilot, Cursor, Gemini CLI, …): files are written to the paths above.
- **Chat-only mode** (claude.ai, ChatGPT, Gems, local chat): each doc arrives as `### path/to/FILE.md` plus a fenced markdown block, 2–3 per message. Save each one to its path. Reply `next` for more.

## Existing projects (brownfield)

Run it in a repo that already has code. The skill inspects manifests, CI and docs **before** asking, records current facts as "as-is" and plans as "to-be", and proposes section-level merges for existing files instead of overwriting them.

## Resuming

Progress is saved in `docs/.start-from-here/STATE.md` after every phase, round and document. In a new session (any tool, any model), say `resume`. In session mode, `docs/.start-from-here/HANDOVER.md` is read first. In chat-only tools, save the `STATE.md` block yourself and attach it together with `docs/DISCOVERY.md` when you resume.

## Small context windows & session mode

**The problem.** A full run loads `SKILL.md` (~7.6k tokens), several references (2–13k each), a template per doc (1–10k), every upstream doc, and then writes long docs. Models with small context windows — local LLMs at 8–32k, "flash"/"mini" models, chat UIs that truncate history — cannot hold all of that.

**Symptoms:** docs that get shorter and shallower toward the end; sections or tables missing (e.g. DATABASE without a column table or ERD); IDs that drift (F-03 becomes a different feature, roles renamed); the model "forgets" decisions from the interview; the session dies mid-document.

**The solution: session mode.** The skill splits the work into work packages (WP), one per **fresh** session, connected by a handover file `docs/.start-from-here/HANDOVER.md`:

| WP | Produces | WP | Produces |
|---|---|---|---|
| WP1 | Interview, stack, brief → `DISCOVERY.md` | WP6 | OPERATIONS, IMPLEMENTATION_PLAN |
| WP2 | PRD, APP_FLOW, DESIGN_SYSTEM | WP7 | CODE_STYLE, GIT_WORKFLOW, AI_GUIDELINES |
| WP3 | TRD, ARCHITECTURE, ADRs | WP8 | Legal, repo/community files, AGENTS.md, docs index |
| WP4 | DATABASE, API | WP9 | Audit, traceability, handoff |
| WP5 | SECURITY_ARCHITECTURE, TESTING | | |

Lite merges these into ~5 sessions; with ≤16k context the skill goes one document per session. Each session loads only a lean reading list (specific sections of upstream docs, the matching guide sections, and the WP's templates), so the model has room to write complete docs. The quality bar does not change.

The skill proposes session mode automatically when you say `session mode`, use a local/small model or a context ≤ 64k, use a chat-only UI, pick Enterprise on a model with < 200k context, or when it notices it is running low. You can say `single mode` to decline.

**Step by step — agentic tools** (files are written for you):

1. Say `start` (or `session mode` if you already know your context is small). Finish WP1 and approve the brief.
2. At the end of each session the skill writes `HANDOVER.md` + `STATE.md` and prints a prompt. Say `next session` any time to force this.
3. Open a **new** session (clear the chat / new conversation) and paste the prompt, e.g. `Use the start-from-here skill. Resume session mode: read docs/.start-from-here/HANDOVER.md and STATE.md, then do WP4.`
4. Repeat until WP9 (audit + handoff).

**Step by step — chat-only** (ChatGPT, Gemini, Claude chat, local web UIs):

1. Save every document block the skill prints to its path.
2. At the end of the session the skill prints `HANDOVER.md` and `STATE.md` as fenced blocks. Save both.
3. Open a new chat with the skill loaded, paste (or attach) HANDOVER, STATE, the next-session prompt, and the upstream sections HANDOVER §7 lists.

**Example HANDOVER excerpt:**

```markdown
## 4. ID registry snapshot (copy exactly; never renumber)
- **Personas:** P-01 Clinic admin · P-02 Patient
- **Roles (authZ):** owner, staff, patient
- **Features:** F-01 Book appointment (Must) · F-02 Reminders (Must) · F-03 Invoices (Should)
- **NFRs:** NFR-01 p95 API < 300 ms @ 50 rps · NFR-02 99.5% monthly availability
- **ADRs:** ADR-0001 Record decisions · ADR-0002 Use PostgreSQL

## 6. Quality notes for the next session
- watch out: DATABASE must include audit_logs because NFR-05 requires an admin audit trail

## 7. Next work package and lean reading list
- **Do:** WP4 — DATABASE + API
```

**Tips:**

- If you can switch models between sessions, use your largest model for WP3–WP5 (architecture, data, security); small models are fine for WP7–WP8.
- Keep each session to its WP. Starting the next WP in the same chat defeats the purpose.
- Run `npx start-from-here@latest check .` after WP9 to catch mechanical gaps.
- Full procedure (budgets per file, lean reading lists): [`references/session-mode.md`](../skills/start-from-here/references/session-mode.md).

## After handoff: building with any coding agent

1. Commit the docs.
2. Open your coding agent (it doesn't need this skill). Most agents read `AGENTS.md` automatically. If yours doesn't, ask the skill to `add` a thin pointer file (`CLAUDE.md`, `GEMINI.md`, `.github/copilot-instructions.md`), or attach `AGENTS.md`.
3. Paste the first implementation prompt from the handoff:

```text
Read AGENTS.md and every document it links. Summarize the approved MVP, architecture,
data and permission rules, coding conventions, and acceptance criteria. List blocking
contradictions or [TBD] items. Then propose a plan for Milestone 1, Task 1 from
docs/technical/IMPLEMENTATION_PLAN.md, with files to create and how each acceptance
criterion will be verified. Do not write code until I approve the plan.
```

4. Work through `docs/technical/IMPLEMENTATION_PLAN.md` task by task. When a decision changes, go back to the skill and say `update <doc>` so all docs stay consistent.
5. Optional check (Node ≥ 18): `npx start-from-here@latest check .` reports missing files, leftover placeholders and template comments, broken links, missing status headers or legal notices, and obvious secrets. It also cross-checks IDs between docs: a reference to an ID that is never defined (for example `F-07` in TESTING when the PRD stops at `F-06`) or an ID defined twice is an error, and a Must feature, its acceptance criteria, or an NFR that no test, task, or monitor references is a warning. A `[TBD-BLOCKING: …]` marker without its `Q-xx` is an error. For machine-readable output run `node <skill-dir>/scripts/check-docs.mjs . --json`.

## FAQ

**Does it write code?** No. It stops after docs, a checklist, and a prompt you can give to a coding agent.

**I don't know the answers.** Say `use your recommendations`. Every default is labeled and recorded as an assumption you can change later.

**I'm in a hurry.** Pick Lite, answer Round 0, then say `skip to generation`. You still approve the brief.

**Can I change my mind later?** Yes. `update <doc>` updates `DISCOVERY.md` first and then every doc that depends on it. Changed approved docs go back to "In review".

**Which stack will it pick?** None until you approve. It shows 2–3 options with trade-offs that fit your team skills, budget and hosting, and marks one Recommended. It won't state library version numbers from memory.

**Is the legal text ready to publish?** No. Legal docs are drafts for review by qualified counsel. The skill never claims your project "is compliant". `LICENSE` uses the full official text.

**Where does the threat model go?** `docs/technical/SECURITY_ARCHITECTURE.md`. Root `SECURITY.md` is GitHub's vulnerability disclosure policy.

**Will it leak my secrets?** It never writes secrets into files, only variable names like `DATABASE_URL`. If you paste a secret, it will tell you to rotate it.

**Does it work offline / with local models?** Yes, as a pasted prompt. See [local-and-other-llms.md](guides/local-and-other-llms.md). Bigger models follow the gates more reliably.

**Can a team use it?** Yes. Commit the skill to `.agents/skills/` (and `.claude/skills/` for Claude Code), or use the Claude Code plugin with team settings. `STATE.md` lets teammates resume each other's sessions.

**How do I update or remove the skill?** See your platform guide, or run `npx start-from-here@latest install --force` / `npx start-from-here@latest uninstall`.
