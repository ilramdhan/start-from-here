# Kiro and Amazon Q Developer

[← All guides](README.md) · [User manual](../USAGE.md)

## Overview

| Tool | Support level | Project path | Global path | Invocation |
|---|---|---|---|---|
| **Kiro (IDE / CLI)** | Native skill | `.kiro/skills/` | `~/.kiro/skills/` | "Use the start-from-here skill…" |
| **Amazon Q Developer (IDE)** | Rules-file fallback | `.amazonq/rules/**/*.md` | — | "start-from-here: start" |

Kiro separates **Steering** (Kiro context, `.kiro/steering/`), **Powers** (MCP + knowledge), and **Skills** (the open standard). This skill is a Skill.

## Kiro

### Prerequisites

Kiro IDE or Kiro CLI; Node.js ≥ 18 (`npx start-from-here`) or ≥ 22.20 (`npx skills`).

### Install

```bash
npx start-from-here@latest install --agent kiro              # → .kiro/skills/
npx start-from-here@latest install --agent kiro --global     # → ~/.kiro/skills/
# or
npx skills add ilramdhan/start-from-here -a kiro-cli           # -g for ~/.kiro/skills/
# or manual
git clone https://github.com/ilramdhan/start-from-here /tmp/sfh
mkdir -p .kiro/skills && cp -R /tmp/sfh/skills/start-from-here .kiro/skills/
```

Kiro's docs list only `.kiro/skills/` (not `.agents/skills/`), so install there.

Custom Kiro CLI agents must list the skill as a resource: `"resources": ["skill://.kiro/skills/**/SKILL.md"]`.

### Verify it loaded

Ask: "Which skills can you use?"

> Kiro has no dedicated skills-list command: use the "Agent Steering & Skills" section of the Kiro panel in the IDE, or type `/` in chat to see skills as slash commands (verified 2026-10-25: https://kiro.dev/docs/skills/).

### How to use

```text
Use the start-from-here skill to plan my new app.
```

### Example first session

```text
You:  Use the start-from-here skill to plan an IoT dashboard for greenhouse sensors.
Kiro: Discovery first; no code. 1. Language? 2. Experience? 3. Team & goal?
      4. Personal data? Devices on-site or cloud? Open source?
You:  English, professional, small team, MVP, no personal data, AWS IoT, no.
Kiro: Proposed tier: Standard. Archetype: IoT/embedded. I'll recommend 2–3 stack options…
```

### Resuming in a new session

`Use the start-from-here skill. resume`. Kiro always includes `AGENTS.md` in context, so the generated file guides later implementation.

### Update / Uninstall

```bash
npx start-from-here@latest install --agent kiro --force
npx start-from-here@latest uninstall --agent kiro          # add --global if needed
npx skills update     # or: npx skills remove start-from-here
```

### Limitations

`allowed-tools` frontmatter is not supported by Kiro CLI (this skill doesn't need it).

## Amazon Q Developer (IDE)

No native skills. Use a project rule (all `.md` files in `.amazonq/rules/` are loaded, recursively).

### Install

```bash
npx start-from-here@latest install --agent amazon-q          # prints instructions
npx start-from-here@latest install --agent amazon-q --yes    # writes the pointer rule
```

Manual: install the skill with `--agent universal` (→ `.agents/skills/start-from-here/`), then create `.amazonq/rules/start-from-here.md`:

```markdown
When I say "start-from-here" or ask to plan a new project, read and follow
`.agents/skills/start-from-here/SKILL.md` exactly, and its references/ when it says so.
Do not write application code.
```

Avoid copying the whole skill folder into `.amazonq/rules/`, because every `.md` there would load on every request.

### How to use

```text
start-from-here: start — plan a serverless image-resize service
```

### Resuming / Update / Uninstall

- Resume: `start-from-here: resume`.
- Update: `npx start-from-here@latest install --agent universal --force`.
- Uninstall: `npx start-from-here@latest uninstall --agent amazon-q` or delete the rule file.

> ⚠️ Unverified: whether Amazon Q reads `AGENTS.md` (the official project-rules page documents only `.amazonq/rules`, checked 2026-10-25). Keep the rule file for later sessions, or paste the first implementation prompt.

## Sources

- https://kiro.dev/docs/skills/
- https://kiro.dev/docs/steering/
- https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/context-project-rules.html (search snippet)
- https://github.com/vercel-labs/skills/blob/main/docs/agents.md
