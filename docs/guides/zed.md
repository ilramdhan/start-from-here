# Zed

[← All guides](README.md) · [User manual](../USAGE.md)

## Overview

| | |
|---|---|
| Support level | **Native skill** (live reload) |
| Project path | `<worktree>/.agents/skills/start-from-here/` |
| Global path | `~/.agents/skills/start-from-here/` |
| Invocation | `/start-from-here` or `@` in the Agent Panel |

Zed split its old Rules Library into Skills (reusable) and a personal `AGENTS.md` (foundational).

## Prerequisites

- Zed with the Agent Panel.
- Node.js ≥ 22.20 (`npx skills`) or ≥ 18 (`npx start-from-here`), or GitHub CLI ≥ 2.90.0.

## Install

```bash
npx skills add ilramdhan/start-from-here -a zed             # project: .agents/skills/
npx skills add ilramdhan/start-from-here -a zed -g          # global: ~/.agents/skills/
# or
npx start-from-here@latest install --agent zed            # add --global for ~/.agents/skills/
# or
gh skill install ilramdhan/start-from-here start-from-here --scope project
# or manual
git clone https://github.com/ilramdhan/start-from-here /tmp/sfh
mkdir -p .agents/skills && cp -R /tmp/sfh/skills/start-from-here .agents/skills/
```

## Verify it loaded

In the Agent Panel, type `/` or `@`; `start-from-here` should appear. No restart is needed (live reload).

## How to use

```text
/start-from-here a Rust CLI to rename photos by EXIF date
```

## Example first session

```text
You:   /start-from-here a Rust CLI to rename photos by EXIF date
Agent: Discovery first; no code. 1. Language? 2. Experience? 3. Team & goal?
       4. Personal data (photo location metadata)? Open source?
You:   English, professional, solo, OSS tool, reads GPS EXIF locally only, MIT/Apache-2.0 dual.
Agent: Proposed tier: Lite (+ CONTRIBUTING, CODE_OF_CONDUCT for OSS). Archetype: CLI →
       APP_FLOW lists commands instead of screens. Confirm?
```

## Resuming in a new session

```text
/start-from-here resume
```

Zed reads the first matching instructions file (`.rules`, …, `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`) in later sessions. If you have a `.rules` file, it wins over the generated `AGENTS.md`.

## Update / Uninstall

```bash
npx skills update                                         # or: npx skills remove start-from-here
npx start-from-here@latest install --agent zed --force
npx start-from-here@latest uninstall --agent zed          # add --global if needed
```

## Limitations & troubleshooting

- Zed loads only one instructions file (first match wins). Remove or merge an old `.rules`/`.cursorrules` if you want `AGENTS.md` used.

## Sources

- https://zed.dev/docs/ai/skills
- https://zed.dev/docs/ai/instructions
- https://github.com/vercel-labs/skills/blob/main/docs/agents.md
