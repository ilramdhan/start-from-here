# Claude Code

[← All guides](README.md) · [User manual](../USAGE.md)

## Overview

| | |
|---|---|
| Support level | **Native skill** + **Plugin** |
| Project path | `.claude/skills/start-from-here/` |
| Global path | `~/.claude/skills/start-from-here/` |
| Invocation | `/start-from-here` (plugin: `/start-from-here:start-from-here`) or natural language |

Claude Code reads skills from `.claude/skills/` and `~/.claude/skills/`. It does **not** read `.agents/skills/`, so a universal-only install is not enough for Claude Code.

## Prerequisites

- Claude Code installed and signed in.
- For `npx skills add`: Node.js ≥ 22.20. For `npx start-from-here`: Node.js ≥ 18.
- A project folder (empty is fine). Start Claude Code from that folder.

## Install

### Option A — Plugin marketplace (recommended: easy updates)

Inside a Claude Code session:

```text
/plugin marketplace add ilramdhan/start-from-here
/plugin install start-from-here@start-from-here
```

The install panel lets you choose the scope: **user** (all projects), **project** (shared via `.claude/settings.json`), or **local** (`.claude/settings.local.json`). From a terminal:

```bash
claude plugin marketplace add ilramdhan/start-from-here
claude plugin install start-from-here@start-from-here --scope project   # or user | local
```

Pin a version with `ilramdhan/start-from-here#v1.0.0`. To pre-register the marketplace for your team, commit this to `.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "start-from-here": { "source": { "source": "github", "repo": "ilramdhan/start-from-here" } }
  },
  "enabledPlugins": { "start-from-here@start-from-here": true }
}
```

> `enabledPlugins` is an object mapping plugin IDs to booleans, settable in user, project, local or managed settings (verified 2026-10-25: https://code.claude.com/docs/en/settings-reference#enabledplugins).

### Option B — `npx skills add`

```bash
# project scope (.claude/skills/)
npx skills add ilramdhan/start-from-here -a claude-code
# global scope (~/.claude/skills/)
npx skills add ilramdhan/start-from-here -a claude-code -g
```

By default this symlinks to a canonical copy. Add `--copy` for a real copy.

### Option C — Our installer

```bash
# project scope
npx start-from-here@latest install --agent claude-code
# global scope
npx start-from-here@latest install --agent claude-code --global
# several agents at once (Claude Code + everyone reading .agents/skills)
npx start-from-here@latest install --agent claude-code,universal
```

### Option D — GitHub CLI (gh ≥ 2.90.0)

```bash
gh skill install ilramdhan/start-from-here start-from-here --agent claude-code --scope project   # or --scope user
```

> ⚠️ Unverified: that `claude-code` is an accepted `gh skill --agent` value. If it fails, use Option B, C or E.

### Option E — Manual copy

```bash
git clone https://github.com/ilramdhan/start-from-here /tmp/sfh
mkdir -p .claude/skills && cp -R /tmp/sfh/skills/start-from-here .claude/skills/
# global: mkdir -p ~/.claude/skills && cp -R /tmp/sfh/skills/start-from-here ~/.claude/skills/
```

## Verify it loaded

- Type `/` and look for `start-from-here` in the menu.
- If you created `.claude/skills/` for the first time while Claude Code was running, run `/reload-skills`. For a plugin, run `/reload-plugins`.
- Terminal check: `npx start-from-here@latest doctor`.

## How to use

```text
/start-from-here
```

```text
/start-from-here I want to build a booking app for my yoga studio
```

Or plain language: `Use the start-from-here skill to plan my new app.` Claude also auto-invokes the skill when your request matches its description (e.g. "help me plan a new project before coding").

Plugin installs may show the namespaced form `/start-from-here:start-from-here`.

## Example first session

```text
You:    /start-from-here I want a CLI that syncs my Notion tasks to Google Calendar.
Claude: I'll interview you, recommend a stack if needed, get your approval on a brief,
        then write the docs. No code will be written.
        Round 0 — Calibrate:
        1. Language for chat and docs? Recommended: English for both.
        2. Experience: (a) new (b) built a few things (c) professional?
        3. Who builds it, and is it a prototype or a product?
        4. Any personal, payment, health or children's data? Open source?
You:    1 English. 2 c. 3 solo prototype. 4 only my own tasks; yes, MIT.
Claude: Proposed tier: Lite (solo prototype, no regulated data). Docs: DISCOVERY, PRD,
        ARCHITECTURE, DATABASE, TESTING, IMPLEMENTATION_PLAN, CODE_STYLE, AI_GUIDELINES,
        README, LICENSE, CONTRIBUTING, AGENTS.md, docs/README. Confirm or adjust?
```

## Resuming in a new session

Open Claude Code in the same folder and type:

```text
/start-from-here resume
```

The skill reads `docs/.start-from-here/STATE.md` and continues from the recorded phase.

## Update

| Installed with | Update command |
|---|---|
| Plugin | `claude plugin marketplace update start-from-here` (corrected 2026-10-25: Claude Code uses `update`, not `upgrade`; https://code.claude.com/docs/en/plugins/cli-reference.md#plugin-marketplace-update) |
| `npx skills` | `npx skills update` (add `-g` for global) |
| Our CLI | `npx start-from-here@latest install --agent claude-code --force` |
| `gh skill` | `gh skill install ilramdhan/start-from-here start-from-here --force` |
| Manual | Delete the folder and copy again |

## Uninstall

```bash
npx start-from-here@latest uninstall --agent claude-code          # add --global for ~/.claude/skills
npx skills remove start-from-here                                  # if installed with npx skills
claude plugin marketplace remove start-from-here                   # if installed as a plugin
rm -rf .claude/skills/start-from-here                              # manual
```

## Limitations & troubleshooting

- **Skill missing from `/` menu** → check the folder is `.claude/skills/start-from-here/SKILL.md` (folder name must equal `name`). Run `/reload-skills`.
- **Installed only to `.agents/skills/`** → Claude Code does not read it. Re-run with `--agent claude-code`.
- **Name clash** → enterprise > personal > project. A personal copy in `~/.claude/skills/` wins over the project copy.
- **Plugin clone fails over SSH** → set `CLAUDE_CODE_PLUGIN_PREFER_HTTPS=1`.
- **Generated `AGENTS.md` not loaded later** → Claude Code reads `AGENTS.md` natively from v2.1.277, but only when there is no `CLAUDE.md`. Ask the skill to create a thin `CLAUDE.md` containing `@AGENTS.md`.
- Skills installed in claude.ai sync into Claude Code (`~/.claude/skills/synced/`, v2.1.273+) as `/start-from-here` or `/anthropic-skills:start-from-here`.

## Sources

- https://code.claude.com/docs/en/skills
- https://code.claude.com/docs/en/plugins/install
- https://code.claude.com/docs/en/plugins/marketplace-reference
- https://code.claude.com/docs/en/plugins/create-marketplace
- https://code.claude.com/docs/en/memory
- https://github.com/vercel-labs/skills/blob/main/docs/agents.md
- https://cli.github.com/manual/gh_skill_install
