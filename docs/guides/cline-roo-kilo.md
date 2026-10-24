# Cline, Roo Code, Kilo Code

[← All guides](README.md) · [User manual](../USAGE.md)

## Overview

All three are VS Code agents with **native skill** support.

| Tool | Project paths | Global paths | Agent id (our CLI / `npx skills`) |
|---|---|---|---|
| Cline | `.cline/skills/` (recommended), `.clinerules/skills/`, `.claude/skills/` | `~/.cline/skills/` | `cline` / `cline` |
| Roo Code | `.roo/skills/`, `.agents/skills/`, mode-specific `.roo/skills-{mode}/` | `~/.roo/skills/`, `~/.agents/skills/` | `roo` / `roo` |
| Kilo Code | `.kilo/skills/` (plus `.agents/skills/` per the skills CLI table) | `~/.kilo/skills/`; compat `~/.agents/skills/`, `~/.claude/skills/` | `kilo` / `kilo` |

Invocation: natural language ("Use the start-from-here skill to plan my new app"). Roo precedence: project `.roo` (mode-specific, then generic) > project `.agents` > global `.roo` > global `.agents`.

> Cline's docs list `.cline/skills/`, `.clinerules/skills/` and `.claude/skills/` (project) and `~/.cline/skills/` (global), and do not list `.agents/skills/` (verified 2026-10-25: https://docs.cline.bot/customization/skills). `npx skills add -a cline` installs to `.agents/skills/`, which Cline does not document. **For Cline, use our CLI or copy into `.cline/skills/`.**

## Prerequisites

- The extension installed in VS Code (or a compatible editor).
- Node.js ≥ 18 (`npx start-from-here`) or ≥ 22.20 (`npx skills`).

## Install

### Our installer (recommended for Cline)

```bash
npx start-from-here@latest install --agent cline            # → .cline/skills/
npx start-from-here@latest install --agent roo              # → Roo project skills dir
npx start-from-here@latest install --agent kilo             # → Kilo project skills dir
npx start-from-here@latest install --agent cline,roo,kilo --global
```

Run `npx start-from-here@latest list-agents` to see the exact paths each id uses.

### `npx skills add`

```bash
npx skills add ilramdhan/start-from-here -a roo        # .roo/skills/  (-g → ~/.roo/skills/)
npx skills add ilramdhan/start-from-here -a kilo       # .agents/skills/ (-g → ~/.kilo/skills/)
npx skills add ilramdhan/start-from-here -a cline      # .agents/skills/ ⚠️ see note above
```

### Manual copy

```bash
git clone https://github.com/ilramdhan/start-from-here /tmp/sfh
mkdir -p .cline/skills && cp -R /tmp/sfh/skills/start-from-here .cline/skills/   # Cline
mkdir -p .roo/skills   && cp -R /tmp/sfh/skills/start-from-here .roo/skills/     # Roo
mkdir -p .kilo/skills  && cp -R /tmp/sfh/skills/start-from-here .kilo/skills/    # Kilo
```

Kilo can also load skills from config: `kilo.jsonc` → `skills.paths` (local) or `skills.urls` (remote `/.well-known/skills/`).

## Verify it loaded

- Cline: open the **Skills** tab; `start-from-here` is listed and toggled on.
- Roo: ask "Which skills can you use?" The folder name must equal `name` (Roo enforces this).
- Kilo: run `/reload`, then ask the same question.

## How to use

```text
Use the start-from-here skill to plan my new app: a time-tracking tool for freelancers.
```

## Example first session

```text
You:   Use the start-from-here skill to plan a time-tracking tool for freelancers.
Cline: [Skill activated: start-from-here] Discovery first; no code.
       1. Language? 2. Experience? 3. Team & goal? 4. Personal/payment data? OSS?
You:   English, professional, solo, MVP, clients' names + invoices, no.
Cline: Proposed tier: Standard (paid product with personal data). Confirm?
```

## Resuming in a new session

```text
Use the start-from-here skill. resume
```

All three read the generated `AGENTS.md` in later sessions (Cline auto-detects it; Roo loads it by default; Kilo supports it).

## Update

```bash
npx start-from-here@latest install --agent cline,roo,kilo --force
npx skills update
```

## Uninstall

```bash
npx start-from-here@latest uninstall --agent cline,roo,kilo      # add --global if needed
npx skills remove start-from-here
```

Cline: you can also disable the skill in the Skills tab.

## Limitations & troubleshooting

- Cline recommends `SKILL.md` under 5k tokens. Ours keeps detail in `references/`.
- Kilo supports `` !`cmd` `` shell lines in skills with approval. This skill does not use them.

## Sources

- https://docs.cline.bot/features/skills
- https://docs.cline.bot/features/cline-rules
- https://roocodeinc.github.io/Roo-Code/features/skills
- https://docs.roocode.com/features/custom-instructions
- https://kilo.ai/docs/agent-behavior/skills
- https://kilo.ai/docs/customize/agents-md
- https://github.com/vercel-labs/skills/blob/main/docs/agents.md
