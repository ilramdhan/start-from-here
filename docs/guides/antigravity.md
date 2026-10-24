# Google Antigravity (App, IDE, CLI)

[← All guides](README.md) · [User manual](../USAGE.md)

## Overview

| Surface | Project path | Global path |
|---|---|---|
| App | `<root>/.agents/skills/start-from-here/` | `~/.gemini/config/skills/start-from-here/` |
| IDE | `<root>/.agents/skills/start-from-here/` | `~/.gemini/config/skills/start-from-here/` (legacy `~/.gemini/antigravity/skills/` still read) |
| CLI | `<root>/.agents/skills/start-from-here/` | `~/.gemini/antigravity-cli/skills/start-from-here/` |

Support level: **Native skill**. The agent decides when to activate a skill (progressive disclosure). Antigravity still reads the older `.agent/skills` folder for backward compatibility.

## Prerequisites

- Antigravity installed and signed in.
- Node.js ≥ 22.20 for `npx skills`, ≥ 18 for `npx start-from-here`.

## Install

### Option A — `npx skills add`

```bash
npx skills add ilramdhan/start-from-here -a antigravity          # project: .agents/skills/
npx skills add ilramdhan/start-from-here -a antigravity -g       # global: ~/.gemini/antigravity/skills/ (legacy, still read by the IDE)
npx skills add ilramdhan/start-from-here -a antigravity-cli -g   # global for the CLI
```

### Option B — Our installer

```bash
npx start-from-here@latest install --agent antigravity            # project
npx start-from-here@latest install --agent antigravity --global   # → ~/.gemini/config/skills/
```

### Option C — GitHub CLI

```bash
gh skill install ilramdhan/start-from-here start-from-here --scope project   # → .agents/skills/
```

### Option D — Manual copy

```bash
git clone https://github.com/ilramdhan/start-from-here /tmp/sfh
mkdir -p .agents/skills && cp -R /tmp/sfh/skills/start-from-here .agents/skills/
# global (App/IDE): mkdir -p ~/.gemini/config/skills && cp -R /tmp/sfh/skills/start-from-here ~/.gemini/config/skills/
```

## Verify it loaded

Ask the agent: `Which skills are available in this workspace?` Also run `npx start-from-here@latest doctor`.

> In the IDE, inspect active skills from the **Customizations** menu in the agent side panel; in the CLI, `agy plugin list --json` shows bundled skills (verified 2026-10-25: https://antigravity.google/docs/skills).

## How to use

```text
Use the start-from-here skill to plan my new app.
```

To force use in every session, a Rule can enforce a skill, and a Workflow can orchestrate skills.

> Corrected 2026-10-25: workspace Rules live in `.agents/rules/*.md` (plus `AGENTS.md` / `GEMINI.md`), not `.agent/rules` (https://antigravity.google/docs/rules). ⚠️ Unverified: the Workflow path (no official page found as of 2026-10-25).

## Example first session

```text
You:   Use the start-from-here skill to plan a SaaS dashboard for gym owners.
Agent: Activating start-from-here. I'll interview you; no code will be written.
       1. Language? 2. Experience? 3. Team & goal? 4. Personal/payment data? OSS?
You:   English, professional, 3 people, MVP, members' names + card payments via Stripe, no.
Agent: Proposed tier: Standard. Payments → PCI DSS scope note (hosted checkout recommended).
```

## Resuming in a new session

```text
Use the start-from-here skill. resume
```

> Antigravity reads `AGENTS.md` / `GEMINI.md` from the project and any subdirectory (verified 2026-10-25: https://antigravity.google/docs/rules).

## Update

```bash
npx skills update
npx start-from-here@latest install --agent antigravity --force
```

## Uninstall

```bash
npx start-from-here@latest uninstall --agent antigravity     # add --global if needed
npx skills remove start-from-here
rm -rf .agents/skills/start-from-here
```

## Limitations & troubleshooting

- Global paths differ per surface (App/IDE vs CLI). Install to each surface you use, or use the project path.
- Google recommends the Antigravity CLI over Gemini Code Assist agent mode.

## Sources

- https://antigravity.google/docs/skills/
- https://codelabs.developers.google.com/getting-started-with-antigravity-skills
- https://github.com/vercel-labs/skills/blob/main/docs/agents.md
- https://docs.cloud.google.com/gemini/docs/codeassist/agent-mode
