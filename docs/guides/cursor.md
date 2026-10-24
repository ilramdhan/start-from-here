# Cursor

[← All guides](README.md) · [User manual](../USAGE.md)

## Overview

| | |
|---|---|
| Support level | **Native skill** |
| Project paths | `.agents/skills/`, `.cursor/skills/` (compat: `.claude/skills/`, `.codex/skills/`) |
| Global paths | `~/.agents/skills/`, `~/.cursor/skills/` (compat: `~/.claude/skills/`, `~/.codex/skills/`) |
| Invocation | `/start-from-here` in Agent chat, or natural language |

## Prerequisites

- Cursor with Agent chat.
- Node.js ≥ 22.20 (`npx skills`) or ≥ 18 (`npx start-from-here`), or GitHub CLI ≥ 2.90.0.

## Install

### Option A — `npx skills add`

```bash
npx skills add ilramdhan/start-from-here -a cursor        # project: .agents/skills/
npx skills add ilramdhan/start-from-here -a cursor -g     # global: ~/.cursor/skills/
```

### Option B — Our installer

```bash
npx start-from-here@latest install --agent cursor            # project
npx start-from-here@latest install --agent cursor --global   # global
```

### Option C — GitHub CLI

```bash
gh skill install ilramdhan/start-from-here start-from-here --scope project
```

### Option D — Manual copy

```bash
git clone https://github.com/ilramdhan/start-from-here /tmp/sfh
mkdir -p .agents/skills && cp -R /tmp/sfh/skills/start-from-here .agents/skills/
# global: mkdir -p ~/.cursor/skills && cp -R /tmp/sfh/skills/start-from-here ~/.cursor/skills/
```

> Installing "From GitHub Repository" inside Cursor requires a `.cursor-plugin/marketplace.json`. ⚠️ Unverified: this repo does not ship one in v1.0.0, so use the commands above.

## Verify it loaded

Type `/` in Agent chat and look for `start-from-here`.

## How to use

```text
/start-from-here a Next.js portfolio site with a blog
```

Or: `Use the start-from-here skill to plan my new app.` Option+Enter runs a skill as a Custom Mode.

## Example first session

```text
You:    /start-from-here a portfolio site with a blog
Cursor: Discovery first, no code. 1. Language? 2. Experience? 3. Team & goal?
        4. Personal data (contact form, analytics)? Open source?
You:    English, new to this, me, personal site, contact form + analytics, no.
Cursor: Proposed tier: Lite. "Analytics" usually sets cookies, so I'll include a short
        COOKIE_POLICY and PRIVACY_POLICY. Recommended stack options next…
```

## Resuming in a new session

```text
/start-from-here resume
```

Cursor reads the generated `AGENTS.md` (nested supported) in later sessions.

## Update

```bash
npx skills update
npx start-from-here@latest install --agent cursor --force
```

## Uninstall

```bash
npx start-from-here@latest uninstall --agent cursor      # add --global if needed
npx skills remove start-from-here
rm -rf .agents/skills/start-from-here
```

## Limitations & troubleshooting

- **Rules fallback** → if you prefer a rule, it must be `.cursor/rules/*.mdc` with frontmatter. Plain `.md` files in `.cursor/rules` are ignored.
- Multiple copies in `.agents/skills` and `.cursor/skills` → remove one to avoid duplicates.

## Sources

- https://cursor.com/docs/context/skills
- https://cursor.com/docs/context/rules
- https://github.com/vercel-labs/skills/blob/main/docs/agents.md
