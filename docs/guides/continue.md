# Continue

[← All guides](README.md) · [User manual](../USAGE.md)

## Overview

| | |
|---|---|
| Support level | **Native skill — partial** (merged in PR #9353, Jan 2026; no official docs page yet) · **Rules-file fallback** is reliable |
| Project path | `.continue/skills/start-from-here/` ⚠️ Unverified (third-party table only) |
| Global path | `~/.continue/skills/start-from-here/` ⚠️ Unverified |
| Rules path | `.continue/rules/*.md` (`globs`, `alwaysApply`, `description`) |
| Invocation | natural language: "Use the start-from-here skill to plan my new app" |

> ⚠️ Unverified: Continue's skill paths, invocation, and `AGENTS.md` support. Prefer the rules fallback if the skill is not picked up.

## Prerequisites

- Continue extension (VS Code or JetBrains) with Agent mode.
- Node.js ≥ 22.20 (`npx skills`) or ≥ 18 (`npx start-from-here`).

## Install

### Option A — Skill

```bash
npx skills add ilramdhan/start-from-here -a continue         # .continue/skills/  (-g → ~/.continue/skills/)
# or
npx start-from-here@latest install --agent continue        # add --global for the user dir
```

### Option B — Rules fallback (reliable)

```bash
npx start-from-here@latest install --agent universal       # → .agents/skills/start-from-here
```

Create `.continue/rules/start-from-here.md`:

```markdown
---
description: Project discovery and pre-development documentation (start-from-here)
alwaysApply: false
---
When I ask to plan a new project or say "start-from-here", read and follow
`.agents/skills/start-from-here/SKILL.md` exactly. Do not write application code.
```

## Verify it loaded

Ask in Agent mode: "Which skills or rules apply to start-from-here?" If the model does not mention the skill, use Option B.

## How to use

```text
Use the start-from-here skill to plan my new app.
```

## Example first session

```text
You:      Use the start-from-here skill to plan an internal FAQ chatbot.
Continue: Discovery first; no code. 1. Language? 2. Experience? 3. Team & goal?
          4. What data will the bot see? AI features in the EU?
You:      English, professional, 2 people, internal tool, company wiki, yes EU staff.
Continue: Proposed tier: Standard. AI + EU → EU AI Act risk classification noted in COMPLIANCE.
```

## Resuming in a new session

`Use the start-from-here skill. resume`. For implementation sessions, add a rule that points to the generated `AGENTS.md`, because `AGENTS.md` support is unverified.

## Update / Uninstall

```bash
npx skills update                         # or: npx skills remove start-from-here
npx start-from-here@latest install --agent continue --force
npx start-from-here@latest uninstall --agent continue
rm .continue/rules/start-from-here.md     # if you used the fallback
```

## Limitations & troubleshooting

- Rules load in lexicographic order and are not used by autocomplete.

## Sources

- https://github.com/continuedev/continue/issues/9216 (PR #9353)
- https://docs.continue.dev/customize/deep-dives/rules
- https://github.com/vercel-labs/skills/blob/main/docs/agents.md
