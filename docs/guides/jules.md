# Jules (Google)

[← All guides](README.md) · [User manual](../USAGE.md)

## Overview

| | |
|---|---|
| Support level | **Rules-file fallback** (`AGENTS.md` at the repo root) |
| Invocation | A task prompt telling Jules to follow the committed skill |

Jules "automatically searches for an AGENTS.md file in your repository's root directory". There is no documented skills support.

> ⚠️ Unverified: Jules skills support. The official docs (https://jules.google/docs/) describe `AGENTS.md` only and no `SKILL.md` support, so absence is documented only by omission (checked 2026-10-25).

Jules is an asynchronous, task-based agent, so it is a poor fit for a multi-round interview. **Recommended:** run the discovery interview in an interactive tool (Claude Code, Codex, Gemini CLI, Copilot…), commit the generated docs, then use Jules for implementation. The generated `AGENTS.md` is exactly what Jules reads.

## Prerequisites

- A GitHub repository connected to Jules.
- Node.js ≥ 18 locally (or copy files by hand).

## Install

Commit the skill into the repo (project scope only; Jules has no global scope):

```bash
npx start-from-here@latest install --agent universal    # → .agents/skills/start-from-here
```

Then add a pointer to the root `AGENTS.md` (create the file if needed):

```markdown
## Project discovery
When asked to plan the project or write pre-development docs, follow
`.agents/skills/start-from-here/SKILL.md` exactly. Do not write application code.
```

Commit and push both.

## Verify it loaded

Start a task: `Summarize the instructions in AGENTS.md.` Jules should mention the start-from-here pointer.

## How to use

```text
Follow .agents/skills/start-from-here/SKILL.md and write the docs as files in this repo.
Ask me the Round 0 calibration questions and wait for my answers before writing anything.
```

If Jules cannot pause for answers, give the answers up front and say `use your recommendations` for the rest, or `skip to generation`. The skill records every assumption in `docs/DISCOVERY.md`.

## Example first session

```text
You:   Follow .agents/skills/start-from-here/SKILL.md. Project: internal leave-request tool.
       Answers: English; professional; solo; internal tool; employee names; not OSS.
       Use your recommendations for anything else. Stop after DISCOVERY.md for my review.
Jules: Plan: read SKILL.md → write docs/DISCOVERY.md with recommended defaults marked
       as ASSUMPTION → write docs/.start-from-here/STATE.md → stop for review.
```

## Resuming in a new session

New task: `Follow .agents/skills/start-from-here/SKILL.md. resume` — it reads `docs/.start-from-here/STATE.md` from the branch.

## Update

```bash
npx start-from-here@latest install --agent universal --force && git commit -am "chore: update start-from-here skill"
```

## Uninstall

Delete `.agents/skills/start-from-here/` and the pointer section in `AGENTS.md`, then commit.

## Limitations & troubleshooting

- Jules reads `AGENTS.md` only at the repo root.
- Each review gate becomes a separate task or PR review round.

## Sources

- https://jules.google/docs/
