# GitHub Copilot (CLI, cloud agent, VS Code, Visual Studio, JetBrains)

[← All guides](README.md) · [User manual](../USAGE.md)

## Overview

| | |
|---|---|
| Support level | **Native skill** (Copilot app, CLI, cloud agent, code review, agent mode in VS Code / Visual Studio / JetBrains) |
| Project paths | `.agents/skills/`, `.github/skills/`, `.claude/skills/` |
| Global paths | `~/.copilot/skills/`, `~/.agents/skills/` (VS Code also `~/.claude/skills/`) |
| Invocation | `/start-from-here` (skills appear as slash commands) or natural language |

## Prerequisites

- Copilot access, using agent mode (IDE) or Copilot CLI.
- One of: GitHub CLI ≥ 2.90.0, Node.js ≥ 22.20 (`npx skills`), or Node.js ≥ 18 (`npx start-from-here`).

## Install

### Option A — GitHub CLI (recommended)

```bash
gh skill install ilramdhan/start-from-here start-from-here --scope project   # → .agents/skills/
gh skill install ilramdhan/start-from-here start-from-here --scope user
gh skill install ilramdhan/start-from-here start-from-here@v1.0.0 --pin       # pin a version
```

### Option B — `npx skills add`

```bash
npx skills add ilramdhan/start-from-here -a github-copilot        # project: .agents/skills/
npx skills add ilramdhan/start-from-here -a github-copilot -g     # global: ~/.copilot/skills/
```

### Option C — Our installer

```bash
npx start-from-here@latest install --agent copilot            # project
npx start-from-here@latest install --agent copilot --global   # global
```

### Option D — Copilot CLI or manual copy

In Copilot CLI: `/skills add` (⚠️ Unverified: argument format). Or copy by hand:

```bash
git clone https://github.com/ilramdhan/start-from-here /tmp/sfh
mkdir -p .agents/skills && cp -R /tmp/sfh/skills/start-from-here .agents/skills/
```

For the **cloud agent** and **code review on github.com**, commit `.agents/skills/start-from-here/` (or `.github/skills/`) to the repository.

## Verify it loaded

- Copilot CLI: `/skills list` or `/skills info start-from-here`; terminal: `copilot skill list`. Run `/skills reload` after adding.
- VS Code: type `/` in Chat (agent mode); `start-from-here` should appear.

## How to use

```text
/start-from-here I want to plan a Chrome extension that summarizes PRs
```

Or: `Use the start-from-here skill to plan my new app.`

## Example first session

```text
You:     /start-from-here a Chrome extension that summarizes PRs
Copilot: Discovery first; no code. Round 0:
         1. Language? Default English. 2. Experience? 3. Team & goal?
         4. Any personal data or tokens handled? Open source?
You:     English, professional, solo, MVP, reads GitHub content with the user's token, OSS (Apache-2.0).
Copilot: Proposed tier: Standard (public OSS product). Note: the token is a secret — docs will
         only refer to it by name, e.g. GITHUB_TOKEN. Confirm?
```

## Resuming in a new session

```text
/start-from-here resume
```

Copilot reads the generated `AGENTS.md` in later sessions (VS Code: `chat.useAgentsMdFile`, on by default). Optionally ask the skill for a thin `.github/copilot-instructions.md` pointer.

## Update

```bash
gh skill install ilramdhan/start-from-here start-from-here --force
npx skills update
npx start-from-here@latest install --agent copilot --force
```

## Uninstall

```bash
npx start-from-here@latest uninstall --agent copilot      # add --global if needed
npx skills remove start-from-here
rm -rf .agents/skills/start-from-here
```

Copilot CLI: `/skills remove start-from-here` (⚠️ Unverified: argument format).

## Limitations & troubleshooting

- **Not in the `/` menu (VS Code)** → make sure you are in agent mode. For monorepos, see `chat.agentSkillsLocations` and `chat.useCustomizationsInParentRepositories`.
- Older prompt files (`.github/prompts/*.prompt.md`) are not needed; skills replace them.

## Sources

- https://docs.github.com/en/copilot/concepts/agents/about-agent-skills
- https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/create-skills
- https://code.visualstudio.com/docs/copilot/customization/agent-skills
- https://code.visualstudio.com/docs/copilot/customization/custom-instructions
- https://cli.github.com/manual/gh_skill_install
- https://github.blog/changelog/2026-04-16-manage-agent-skills-with-github-cli/
- https://github.com/vercel-labs/skills/blob/main/docs/agents.md
