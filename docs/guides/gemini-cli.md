# Gemini CLI

[← All guides](README.md) · [User manual](../USAGE.md)

## Overview

| | |
|---|---|
| Support level | **Native skill** + **Extension** |
| Project path | `.agents/skills/start-from-here/` (preferred) or `.gemini/skills/start-from-here/` |
| Global path | `~/.gemini/skills/start-from-here/` or `~/.agents/skills/start-from-here/` |
| Invocation | Natural language ("Use the start-from-here skill…"); with the extension, also `/start-from-here` |

Gemini puts every skill's name and description into the system prompt. The model calls `activate_skill`, and **you approve a consent prompt** that shows the skill name, purpose and path. Within the same tier, `.agents/skills/` wins over `.gemini/skills/`. Workspace skills win over user skills, which win over extension skills.

## Prerequisites

- Gemini CLI installed and signed in.
- Node.js ≥ 22.20 for `npx skills`, ≥ 18 for `npx start-from-here`. Neither is needed for `gemini extensions` / `gemini skills`.

## Install

### Option A — Gemini extension (skill + `/start-from-here` command)

```bash
gemini extensions install https://github.com/ilramdhan/start-from-here            # add --ref v1.0.0 to pin, --auto-update to track
```

Extensions install to `~/.gemini/extensions/start-from-here/` (global only).

### Option B — `gemini skills install`

```bash
gemini skills install https://github.com/ilramdhan/start-from-here --consent
```

> `gemini skills install` accepts `--scope user|workspace`; `user` (global) is the default (verified 2026-10-25: https://geminicli.com/docs/cli/skills/).

### Option C — `npx skills add`

```bash
npx skills add ilramdhan/start-from-here -a gemini-cli        # project: .agents/skills/
npx skills add ilramdhan/start-from-here -a gemini-cli -g     # global: ~/.gemini/skills/
```

### Option D — Our installer

```bash
npx start-from-here@latest install --agent gemini-cli            # project
npx start-from-here@latest install --agent gemini-cli --global   # global
```

### Option E — Manual copy or link

```bash
git clone https://github.com/ilramdhan/start-from-here /tmp/sfh
mkdir -p .agents/skills && cp -R /tmp/sfh/skills/start-from-here .agents/skills/
# or link an existing folder:
gemini skills link /tmp/sfh/skills/start-from-here
# in a session: /skills link /tmp/sfh/skills/start-from-here --scope workspace
```

## Verify it loaded

```bash
gemini skills list --all
```

In a session: `/skills list`. If you just added it, run `/skills reload`. Extensions: `gemini extensions list` (verified 2026-10-25: https://geminicli.com/docs/extensions/).

## How to use

```text
Use the start-from-here skill to plan my new app.
```

Approve the consent prompt when Gemini activates the skill. With the extension installed, you can also type:

```text
/start-from-here a Discord bot that tracks my team's stand-ups
```

## Example first session

```text
You:    Use the start-from-here skill to plan a Discord bot for team stand-ups.
Gemini: [Consent] Activate skill "start-from-here" (.agents/skills/start-from-here)? → Allow
Gemini: I'll interview you and write docs; no code. Round 0:
        1. Language? Recommended: English. 2. Experience? 3. Team and goal?
        4. Personal data? Open source?
You:    English, built a few things, solo, internal tool, Discord usernames only, open source.
Gemini: Proposed tier: Lite (+ CONTRIBUTING and CODE_OF_CONDUCT because it is open source).
```

## Resuming in a new session

```text
Use the start-from-here skill. resume
```

The skill reads `docs/.start-from-here/STATE.md`.

**Later implementation sessions:** Gemini CLI does not read `AGENTS.md` by default. Either ask the skill to create a thin `GEMINI.md` pointing to `AGENTS.md`, or add to `.gemini/settings.json`:

```json
{ "context": { "fileName": ["AGENTS.md", "GEMINI.md"] } }
```

Check with `/memory show`.

## Update

```bash
gemini extensions update start-from-here        # or: gemini extensions update --all
npx skills update
npx start-from-here@latest install --agent gemini-cli --force
```

## Uninstall

```bash
gemini extensions uninstall start-from-here
gemini skills uninstall start-from-here --scope workspace     # or user
npx start-from-here@latest uninstall --agent gemini-cli       # add --global if needed
```

Temporarily disable: `/skills disable start-from-here`.

## Limitations & troubleshooting

- **Skill never activates** → you declined the consent prompt, or the skill is disabled (`/skills enable start-from-here`).
- **Two copies** → `.agents/skills/` overrides `.gemini/skills/`, and workspace overrides user/extension.
- Gemini Code Assist agent mode in VS Code uses Gemini CLI (verified 2026-10-25: https://docs.cloud.google.com/gemini/docs/codeassist/agent-mode). ⚠️ Unverified: whether it inherits Gemini CLI skills (that page mentions tools and MCP, not skills).

## Sources

- https://geminicli.com/docs/cli/skills/
- https://geminicli.com/docs/cli/creating-skills/
- https://geminicli.com/docs/extensions/reference/
- https://geminicli.com/docs/extensions/
- https://geminicli.com/docs/cli/gemini-md/
- https://geminicli.com/docs/cli/custom-commands/
- https://github.com/vercel-labs/skills/blob/main/docs/agents.md
