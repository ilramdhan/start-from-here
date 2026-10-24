# JetBrains: Junie and AI Assistant

[← All guides](README.md) · [User manual](../USAGE.md)

## Overview

| Tool | Support level | Project path | Global path | Invocation |
|---|---|---|---|---|
| **Junie** | Native skill | `.junie/skills/`, `.agents/skills/` | `~/.junie/skills/` | `/start-from-here` or `$start-from-here` |
| **AI Assistant (chat)** | Rules-file fallback | `.aiassistant/rules/*.md` | — | mention the rule / "start" |
| **Copilot agent mode in JetBrains** | Native skill | see [github-copilot.md](github-copilot.md) | | `/start-from-here` |

## Prerequisites

- A JetBrains IDE with Junie (or AI Assistant).
- Node.js ≥ 18 (`npx start-from-here`) or ≥ 22.20 (`npx skills`).

## Install — Junie

```bash
npx skills add ilramdhan/start-from-here -a junie            # project: .junie/skills/
npx skills add ilramdhan/start-from-here -a junie -g         # global: ~/.junie/skills/
# or
npx start-from-here@latest install --agent junie           # add --global for ~/.junie/skills/
# or GitHub CLI (→ .agents/skills/, also read by Junie)
gh skill install ilramdhan/start-from-here start-from-here --scope project
# or manual
git clone https://github.com/ilramdhan/start-from-here /tmp/sfh
mkdir -p .junie/skills && cp -R /tmp/sfh/skills/start-from-here .junie/skills/
```

## Verify it loaded (Junie)

Run `/skills`. It lists skills and lets you toggle them on or off.

## How to use (Junie)

```text
/start-from-here plan a Spring Boot service for warehouse stock alerts
```

`$start-from-here` also works, as does "Use the start-from-here skill to plan my new app".

## Example first session

```text
You:   /start-from-here plan a service for warehouse stock alerts
Junie: Discovery first; no code. 1. Language? 2. Experience? 3. Team & goal?
       4. Personal data? Compliance needs? Open source?
You:   English, professional, 2 teams, business-critical, staff emails, ISO 27001 audit next year, no.
Junie: Proposed tier: Enterprise (multi-team, audit). Adds COMPLIANCE.md, SUPPORT.md, ADRs…
```

## Resuming in a new session

```text
/start-from-here resume
```

Junie reads `AGENTS.md` (or `.junie/AGENTS.md`) in later sessions, so the generated `AGENTS.md` guides implementation.

## Update / Uninstall (Junie)

```bash
npx skills update
npx start-from-here@latest install --agent junie --force
npx start-from-here@latest uninstall --agent junie       # add --global if needed
rm -rf .junie/skills/start-from-here
```

## JetBrains AI Assistant (chat)

No native skills in AI Assistant chat. Use a project rule that points at the skill.

```bash
npx start-from-here@latest install --agent jetbrains-ai-assistant          # prints instructions
npx start-from-here@latest install --agent jetbrains-ai-assistant --yes    # writes the pointer rule
```

Manual: install the skill to `.agents/skills/start-from-here/` (`--agent universal`), then create `.aiassistant/rules/start-from-here.md`:

```markdown
When I ask to plan a project or say "start-from-here", read and follow
`.agents/skills/start-from-here/SKILL.md` exactly. Do not write application code.
```

Set the rule type to **Manually** (or By model decision) in the IDE's rules settings, then in chat say: `start-from-here: start`.

> The `.aiassistant/rules/` path is verified (2026-10-25: https://www.jetbrains.com/help/ai-assistant/configure-project-rules.html). ⚠️ Unverified: whether AI Assistant reads `AGENTS.md`, and whether the chat agent can open files referenced by a rule (the official rules page mentions neither). If it can't, attach `SKILL.md` to the chat.

Uninstall: `npx start-from-here@latest uninstall --agent jetbrains-ai-assistant` or delete the rule file.

## Limitations & troubleshooting

- Junie: if `/skills` doesn't list it, check the folder name is exactly `start-from-here` and contains `SKILL.md`.
- AI Assistant: rules are context, not skills; the interview works but references are only read if the model opens them.

## Sources

- https://junie.jetbrains.com/docs/agent-skills.html
- https://github.com/JetBrains/junie-guidelines
- https://www.jetbrains.com/help/ai-assistant/configure-project-rules.html (search snippet)
- https://docs.github.com/en/copilot/concepts/agents/about-agent-skills
- https://github.com/vercel-labs/skills/blob/main/docs/agents.md
