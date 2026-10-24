# Windsurf / Devin Desktop (Cascade)

[← All guides](README.md) · [User manual](../USAGE.md)

## Overview

| | |
|---|---|
| Support level | **Native skill** |
| Project paths | `.devin/skills/` (preferred), `.windsurf/skills/` (legacy), `.agents/skills/`, `.claude/skills/` (if Claude config is enabled) |
| Global paths | `~/.codeium/windsurf/skills/`, `~/.config/devin/skills/`, `~/.agents/skills/` |
| Invocation | `@start-from-here` (manual), or natural language |

Windsurf docs now redirect to Devin Desktop. `.devin/` takes precedence over `.windsurf/`.

## Prerequisites

- Windsurf / Devin Desktop with Cascade.
- Node.js ≥ 22.20 (`npx skills`) or ≥ 18 (`npx start-from-here`).

## Install

### Option A — `npx skills add`

```bash
npx skills add ilramdhan/start-from-here -a windsurf        # project: .windsurf/skills/
npx skills add ilramdhan/start-from-here -a windsurf -g     # global: ~/.codeium/windsurf/skills/
```

### Option B — Our installer

```bash
npx start-from-here@latest install --agent windsurf            # project
npx start-from-here@latest install --agent windsurf --global   # global
```

### Option C — GitHub CLI or manual copy (`.agents/skills/` is also read)

```bash
gh skill install ilramdhan/start-from-here start-from-here --scope project
# or
git clone https://github.com/ilramdhan/start-from-here /tmp/sfh
mkdir -p .agents/skills && cp -R /tmp/sfh/skills/start-from-here .agents/skills/
```

## Verify it loaded

In Cascade, type `@` and look for `start-from-here`.

> Devin Desktop (Windsurf): open the Cascade panel, click the three dots, then the **Skills** section of the customizations menu (verified 2026-10-25: https://docs.devin.ai/desktop/cascade/skills).

## How to use

```text
@start-from-here plan a Flutter app for tracking plant watering
```

Or: `Use the start-from-here skill to plan my new app.`

## Example first session

```text
You:     @start-from-here plan a Flutter app for tracking plant watering
Cascade: Discovery first; no code. 1. Language? 2. Experience? 3. Team & goal?
         4. Accounts or personal data? Open source?
You:     English, some experience, solo, prototype, local-only data, MIT.
Cascade: Proposed tier: Lite. No accounts → skipping Terms of Service; short privacy note…
```

## Resuming in a new session

```text
@start-from-here resume
```

Cascade reads the generated root `AGENTS.md` as an always-on rule in later sessions.

## Update

```bash
npx skills update
npx start-from-here@latest install --agent windsurf --force
```

## Uninstall

```bash
npx start-from-here@latest uninstall --agent windsurf      # add --global if needed
npx skills remove start-from-here
rm -rf .windsurf/skills/start-from-here .devin/skills/start-from-here .agents/skills/start-from-here
```

## Limitations & troubleshooting

- Rules files are limited to 12k characters; the global rules file to 6k. Don't paste `SKILL.md` into a rule — install it as a skill.
- Workflows (`.windsurf/workflows`, `/[workflow-name]`) are a separate feature, not needed here.

## Sources

- https://docs.devin.ai/desktop/cascade/skills (redirected from docs.windsurf.com/windsurf/cascade/skills)
- https://docs.devin.ai/desktop/cascade/memories
- https://github.com/vercel-labs/skills/blob/main/docs/agents.md
