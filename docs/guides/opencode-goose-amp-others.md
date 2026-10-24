# OpenCode, Goose, Amp, Augment, Qwen Code, Trae, Mistral Vibe & others

[← All guides](README.md) · [User manual](../USAGE.md)

## Overview

All tools on this page have **native skill** support. Most read `.agents/skills/`, so one universal install covers them.

| Tool | Project paths | Global paths | Invocation | Our CLI id |
|---|---|---|---|---|
| OpenCode | `.opencode/skills/`, `.claude/skills/`, `.agents/skills/` (walks up to git root) | `~/.config/opencode/skills/`, `~/.claude/skills/`, `~/.agents/skills/` | natural language | `opencode` |
| Goose | `.agents/skills/` (legacy `.goose/skills/`, `.claude/skills/`) | `~/.agents/skills/` (legacy `~/.claude/skills/`, `~/.config/goose/skills/`) | `/skills`, natural language | `goose` |
| Amp | `.agents/skills/` | `~/.agents/skills/`, `~/.config/agents/skills/` | natural language | `amp` |
| Augment (Auggie CLI / IDE) | `.augment/skills/`, `.claude/skills/`, `.agents/skills/` | `~/.augment/skills/`, `~/.claude/skills/`, `~/.agents/skills/` | `/start-from-here` | `augment` |
| Qwen Code | `.qwen/skills/`, `.agents/skills/` | `~/.qwen/skills/`, `~/.agents/skills/` | `/skills`, `/start-from-here` | `qwen-code` |
| Trae | `.trae/skills/` | `~/.trae/skills/` ⚠️ (third-party source) | natural language | `trae` |
| Mistral Vibe (CLI) | `.vibe/skills/`, `.agents/skills/` | `~/.vibe/skills/`, `~/.agents/skills/` | `/start-from-here` | `universal` |
| Others in the skills CLI (~79 agents: OpenHands, Droid, Warp, Crush…) | see `npx skills` agent table | | | use `npx skills add -a <id>` |

## Prerequisites

- The tool installed.
- Node.js ≥ 22.20 (`npx skills`) or ≥ 18 (`npx start-from-here`). Amp also has its own `amp skill add`.

## Install

### One command for most of them (project scope)

```bash
npx start-from-here@latest install --agent universal           # → .agents/skills/start-from-here
npx start-from-here@latest install --agent universal --global  # → ~/.agents/skills/start-from-here
```

Trae does not list `.agents/skills/`, so add it explicitly:

```bash
npx start-from-here@latest install --agent universal,trae
```

### Per tool

```bash
npx start-from-here@latest install --agent opencode    # or goose | amp | augment | qwen-code | trae   (+ --global)

npx skills add ilramdhan/start-from-here -a opencode     # .agents/skills/   (-g → ~/.config/opencode/skills/)
npx skills add ilramdhan/start-from-here -a goose        # .goose/skills/    (-g → ~/.config/goose/skills/)
npx skills add ilramdhan/start-from-here -a amp          # .agents/skills/   (-g → ~/.config/agents/skills/)
npx skills add ilramdhan/start-from-here -a augment      # .augment/skills/  (-g → ~/.augment/skills/)
npx skills add ilramdhan/start-from-here -a qwen-code    # .qwen/skills/     (-g → ~/.qwen/skills/)
npx skills add ilramdhan/start-from-here -a trae         # .trae/skills/     (-g → ~/.trae/skills/)
npx skills add ilramdhan/start-from-here -a mistral-vibe # .vibe/skills/     (-g → ~/.vibe/skills/)
```

Amp native installer:

```bash
amp skill add ilramdhan/start-from-here            # project
amp skill add ilramdhan/start-from-here --global   # → ~/.config/agents/skills/
```

> ⚠️ Unverified: that `amp skill add` accepts the `owner/repo` shorthand (docs say `<source>`). If not, pass the full GitHub URL.

GitHub CLI (→ `.agents/skills/`): `gh skill install ilramdhan/start-from-here start-from-here --scope project`.

Manual: `cp -R skills/start-from-here .agents/skills/` from a clone of this repo.

## Verify it loaded

- Goose / Qwen Code: `/skills`.
- Amp: `amp skills list`.
- OpenCode, Augment, Trae, Vibe: type `/` or ask "Which skills can you use?"
- Any: `npx start-from-here@latest doctor`.

## How to use

```text
Use the start-from-here skill to plan my new app.
```

Or `/start-from-here` where slash invocation is supported (Augment, Qwen Code, Vibe).

## Example first session

```text
You:   /start-from-here a Python library for parsing Indonesian addresses
Agent: Discovery first; no code. 1. Language? 2. Experience? 3. Team & goal?
       4. Personal data? Open source + license?
You:   English, professional, solo, library, processes addresses (personal data) in memory only, OSS.
Agent: Proposed tier: Standard (public library). Archetype: library/SDK → API.md documents the
       public functions instead of HTTP endpoints. Confirm?
```

## Resuming in a new session

`Use the start-from-here skill. resume` (or `/start-from-here resume`). OpenCode reads `AGENTS.md` (falls back to `CLAUDE.md`). ⚠️ Unverified: `AGENTS.md` support in Goose, Amp, Augment, Qwen Code (Qwen uses `QWEN.md`) — if not read, paste the first implementation prompt from the handoff.

## Update

```bash
npx start-from-here@latest install --agent universal --force
npx skills update
```

## Uninstall

```bash
npx start-from-here@latest uninstall --agent universal      # add other ids / --global as needed
npx skills remove start-from-here
```

## Limitations & troubleshooting

- **Mistral Vibe** may refuse to copy skills with > 200 files, any file > 256 KiB, or > 1 MiB of non-SKILL files (⚠️ Unverified, third-party). Mistral **Vibe Work** (web) has its own Skills upload (Context › Skills › New Skill) in the same format.
- **Amp** limits: 200 skills per repo, 10 MiB per file, 25 MiB total.
- OpenCode: skill permissions can be set via `opencode.json` `permission.skill`.

## Sources

- https://opencode.ai/docs/skills · https://opencode.ai/docs/rules
- https://goose-docs.ai/docs/guides/context-engineering/using-skills/
- https://ampcode.com/docs/customize/skills
- https://docs.augmentcode.com/cli/skills
- https://qwenlm.github.io/qwen-code-docs/en/users/features/skills/
- https://docs.trae.ai/ide/skills
- https://docs.mistral.ai/vibe/code/cli/skills · https://docs.mistral.ai/vibe/work/skills
- https://github.com/vercel-labs/skills/blob/main/docs/agents.md
