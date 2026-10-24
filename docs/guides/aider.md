# Aider

[← All guides](README.md) · [User manual](../USAGE.md)

## Overview

| | |
|---|---|
| Support level | **Rules-file fallback** (Aider has no skills and no documented `AGENTS.md` support) |
| Mechanism | Load `SKILL.md` as read-only context with `--read`, `/read`, or `.aider.conf.yml` |
| Invocation | Type `start` |

## Prerequisites

- Aider installed.
- The skill on disk. Node.js ≥ 18 for our installer, or a git clone.

## Install

1. Put the skill in your project:

   ```bash
   npx start-from-here@latest install --agent universal       # → .agents/skills/start-from-here
   # global copy: add --global (→ ~/.agents/skills/start-from-here)
   ```

2. Tell Aider to load it. Our CLI can do this for you:

   ```bash
   npx start-from-here@latest install --agent aider           # prints instructions
   npx start-from-here@latest install --agent aider --yes     # writes the pointer config
   ```

   Or add it yourself to `.aider.conf.yml` (project) or `~/.aider.conf.yml` (global):

   ```yaml
   read:
     - .agents/skills/start-from-here/SKILL.md
   ```

   Or load it for one session:

   ```bash
   aider --read .agents/skills/start-from-here/SKILL.md \
         --read .agents/skills/start-from-here/references/discovery-question-bank.md
   ```

Aider cannot open the `references/` files on its own. Add the ones you need with `/read`. Useful: `references/discovery-question-bank.md` (interview), `references/document-catalog.md` (generation), `references/consistency-audit.md` (audit). Templates are in `assets/templates/` — `/read` the template for the doc being written.

## Verify it loaded

Check Aider's start-up output: `SKILL.md` should be listed as a read-only file. Or ask: "What workflow will you follow when I say start?"

> ⚠️ Unverified: the exact Aider command that lists read-only files (not covered by our sources).

## How to use

```text
start — I want to plan a home-automation dashboard
```

When it writes docs, Aider asks to add each new file; confirm. Aider auto-commits by default — consider `--no-auto-commits` during discovery.

## Example first session

```text
You:   start — a home-automation dashboard for my Raspberry Pi
Aider: Following start-from-here. No code. 1. Language? 2. Experience? 3. Team & goal?
       4. Personal data? Open source?
You:   English, professional, solo, personal tool, none, no.
Aider: Proposed tier: Lite. Docs: DISCOVERY, PRD, ARCHITECTURE, TESTING, …
```

## Resuming in a new session

Start Aider with the same `--read` (or config), then type `resume`. Also run `/read docs/.start-from-here/STATE.md docs/DISCOVERY.md`.

For later implementation sessions, add the generated `AGENTS.md` to `read:` in `.aider.conf.yml`.

## Update

```bash
npx start-from-here@latest install --agent universal --force
```

## Uninstall

```bash
npx start-from-here@latest uninstall --agent aider,universal
```

Remove the `read:` entry from `.aider.conf.yml`.

## Limitations & troubleshooting

- No progressive disclosure: only files you `/read` are visible. Load references per phase to save tokens.
- `scripts/check-docs.mjs` can be run by you: `npx start-from-here@latest check .`

## Sources

- https://aider.chat/docs/usage/conventions.html
