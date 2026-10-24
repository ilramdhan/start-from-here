# OpenAI Codex (CLI, IDE extension, ChatGPT desktop)

[← All guides](README.md) · [User manual](../USAGE.md)

## Overview

| | |
|---|---|
| Support level | **Native skill** + **Plugin** |
| Project path | `.agents/skills/start-from-here/` (Codex scans CWD, parent, and repo root) |
| Global path | `~/.agents/skills/start-from-here/` |
| Invocation | `$start-from-here`, or `/skills` to pick, or natural language |

Codex reads `.agents/skills`, **not** `.codex/skills`. Standalone skills work in the Codex CLI, the IDE extension and the ChatGPT desktop app.

## Prerequisites

- Codex CLI or IDE extension installed and signed in.
- Node.js ≥ 22.20 for `npx skills`, or ≥ 18 for `npx start-from-here`.

## Install

### Option A — `npx skills add`

```bash
npx skills add ilramdhan/start-from-here -a codex        # project: .agents/skills/
npx skills add ilramdhan/start-from-here -a codex -g     # global: ~/.agents/skills/
```

### Option B — Our installer

```bash
npx start-from-here@latest install --agent codex            # project
npx start-from-here@latest install --agent codex --global   # global
```

### Option C — GitHub CLI (gh ≥ 2.90.0)

```bash
gh skill install ilramdhan/start-from-here start-from-here --scope project   # → .agents/skills/
gh skill install ilramdhan/start-from-here start-from-here --scope user
```

### Option D — Codex plugin marketplace

```bash
codex plugin marketplace add ilramdhan/start-from-here            # add --ref main (or a tag) to pin
```

Codex also reads `.claude-plugin/marketplace.json` (legacy) and `.agents/plugins/marketplace.json`.

> After adding the marketplace, run `/plugins` in Codex CLI, pick the plugin and install it, then start a new session (verified 2026-10-25: https://learn.chatgpt.com/docs/plugins).

### Option E — Manual copy

```bash
git clone https://github.com/ilramdhan/start-from-here /tmp/sfh
mkdir -p .agents/skills && cp -R /tmp/sfh/skills/start-from-here .agents/skills/
# global: mkdir -p ~/.agents/skills && cp -R /tmp/sfh/skills/start-from-here ~/.agents/skills/
```

Symlinked skill folders are supported.

## Verify it loaded

Run `/skills` in the Codex CLI or IDE and look for `start-from-here`.

## How to use

```text
$start-from-here I want to build a habit-tracking web app
```

Or: `Use the start-from-here skill to plan my new app.` Codex can also select the skill implicitly from its description. In the ChatGPT desktop app, type `@` and pick the skill.

## Example first session

```text
You:   $start-from-here plan a REST API for a small library's book loans
Codex: Starting discovery. No application code will be written.
       Round 0: 1. Language? Default: English. 2. Experience (new / some / professional)?
       3. Team and goal? 4. Personal data? Open source?
You:   English, professional, solo, internal tool, member names + emails, not OSS.
Codex: Proposed tier: Lite. Docs: DISCOVERY, PRD, ARCHITECTURE, DATABASE, API (you said
       REST), SECURITY_ARCHITECTURE (short), TESTING, IMPLEMENTATION_PLAN, CODE_STYLE,
       AI_GUIDELINES, README, LICENSE, PRIVACY_POLICY, AGENTS.md. Confirm?
```

## Resuming in a new session

```text
$start-from-here resume
```

The skill reads `docs/.start-from-here/STATE.md`. The generated `AGENTS.md` is also read automatically by Codex in later implementation sessions (combined AGENTS.md limit: 32 KiB by default, `project_doc_max_bytes`).

## Update

```bash
npx skills update                                              # npx skills installs
npx start-from-here@latest install --agent codex --force       # our CLI
codex plugin marketplace upgrade start-from-here               # plugin
```

## Uninstall

```bash
npx start-from-here@latest uninstall --agent codex             # add --global if needed
npx skills remove start-from-here
codex plugin marketplace remove start-from-here
rm -rf .agents/skills/start-from-here                          # manual
```

To disable without deleting, add to `~/.codex/config.toml` and restart:

```toml
[[skills.config]]
path = "/absolute/path/to/.agents/skills/start-from-here/SKILL.md"
enabled = false
```

## Limitations & troubleshooting

- **Not listed** → you copied to `.codex/skills` or `~/.codex/skills`. Current docs only list `.agents/skills`. Move it.
- ⚠️ Unverified: Codex cloud support for standalone skills (the official skills guide, https://learn.chatgpt.com/docs/build-skills, does not address it as of 2026-10-25). Cloud clones the repo, so a committed `.agents/skills/` *may* work.
- ⚠️ Unverified: where `$skill-installer` puts skills (the official skills guide does not state the target directory as of 2026-10-25).
- Large generated `AGENTS.md`: Codex stops adding instruction files at 32 KiB combined. The skill keeps `AGENTS.md` concise and links the docs.

## Sources

- https://learn.chatgpt.com/docs/build-skills (from https://developers.openai.com/codex/skills)
- https://developers.openai.com/plugins/build/plugins
- https://learn.chatgpt.com/docs/agent-configuration/agents-md
- https://github.com/vercel-labs/skills/blob/main/docs/agents.md
- https://cli.github.com/manual/gh_skill_install
