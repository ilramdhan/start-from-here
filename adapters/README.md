# Adapters

The skill itself lives in `skills/start-from-here/` (the Agent Skills open standard). Agents that read skill folders use it directly.
This folder, plus a few manifests at the repo root, adapts that skill for platforms that work differently.
Everything under `dist/` is **generated**. Run `npm run build` (or `npx start-from-here bundle`), and never edit `dist/` by hand.

## Generated artifacts (`dist/`)

| Artifact | For | How it is made |
|---|---|---|
| `start-from-here.zip` | claude.ai / Claude Desktop upload, Claude Skills API, OpenAI Skills API, ChatGPT Skills (beta), Open WebUI | Every file in `skills/start-from-here/`, under one top-level folder `start-from-here/`. Pure-Node ZIP writer (`lib/zip.mjs`). Timestamps are deterministic. |
| `start-from-here.prompt.md` | Any chat LLM without a filesystem (Le Chat, Perplexity, DeepSeek, Grok, Ollama `SYSTEM`, LM Studio, Projects) | A chat-only preamble, then SKILL.md (frontmatter removed), every `references/*.md` file, and every template. Each file starts with `=== FILE: <path> ===`. `scripts/` is left out because scripts cannot run in a chat. |
| `knowledge/*.md` (≤10 files) | Custom GPT knowledge, ChatGPT/Claude Projects, Gemini Gems | The same files, grouped into at most 10 parts (Gems accept 10 files). The grouping is defined in `KNOWLEDGE_GROUPS` in `lib/bundle.mjs`. |
| `knowledge-txt/*.txt` | Gemini Gems | The same content as `knowledge/`, saved as `.txt`. Whether Gems accept `.md` files is UNVERIFIED. |
| `gpt-instructions.md` | Custom GPT "Instructions" field | Rendered from `chat-bootloader.md`. **The build fails if it exceeds 8,000 characters.** |
| `gem-instructions.md` | Gemini Gem instructions | The same bootloader, pointing at the `.txt` knowledge files. |
| `SHA256SUMS` | Release verification | Checksums of the artifacts above. |

### Why a bootloader?
Custom GPT instructions are capped at 8,000 characters, and SKILL.md is longer than that. So the instructions field holds a short bootloader with the persona, hard rules, and how to find `=== FILE: … ===` sections. The bootloader tells the model to read `01-skill-procedure` from knowledge first and follow it exactly. Edit the text in `chat-bootloader.md`, below its `## TEMPLATE` line.

## Root manifests (native install channels)

| File | Channel | Notes |
|---|---|---|
| `.claude-plugin/plugin.json` | Claude Code plugin | Plugin root = repo root. The default `skills/` scan finds the skill, which is invoked as `/start-from-here:start-from-here`. |
| `.claude-plugin/marketplace.json` | `/plugin marketplace add ilramdhan/start-from-here` → `/plugin install start-from-here@start-from-here` | The plugin `source` is `"./"` (the marketplace root). The research marks `"./"` vs `"."` as UNVERIFIED, so run `claude plugin validate .` before release. `npx skills add` and Codex (as its legacy marketplace path) both read this file too. |
| `.codex-plugin/plugin.json` | `codex plugin marketplace add ilramdhan/start-from-here` | Codex-compat layout: `.codex-plugin/plugin.json` plus `skills/`. **No `.agents/plugins/marketplace.json` is shipped.** Codex documents `$REPO_ROOT/.claude-plugin/marketplace.json` as a marketplace file it also reads, so a second marketplace file would only duplicate it. Add one if Codex drops the legacy path. |
| `gemini-extension.json` | `gemini extensions install https://github.com/ilramdhan/start-from-here` | Fields: `name`, `version`, `description`, `contextFileName`. The extension's `skills/` dir supplies the skill. |
| `GEMINI-EXTENSION.md` | Gemini extension context | See the decision below. |
| `commands/start-from-here.toml` | Gemini CLI custom command `/start-from-here [request]` | Uses `{{args}}`. The same file loads as a command for anyone who installs the extension. |

### Decision: extension context file name = `GEMINI-EXTENSION.md`
The Gemini CLI loads the file named by `contextFileName` (default `GEMINI.md`) from the extension root into **every** session of a user who installs the extension. The CLI also loads any `GEMINI.md` it finds in the workspace and its parents. Using a root `GEMINI.md` as the extension context would therefore cause two problems:

1. Contributors working on *this* repo would get the end-user extension text as their project context. A repo-dev `GEMINI.md`/`AGENTS.md` (how to build and test this repo) would leak to every extension user.
2. One file could not serve both audiences.

So `gemini-extension.json` sets `"contextFileName": "GEMINI-EXTENSION.md"`. That file is short end-user context: when to use the skill and how to invoke it. Root `AGENTS.md` (and an optional `GEMINI.md` that imports it) stays reserved for repo development. Because the name is non-default, the Gemini CLI never picks it up as workspace context.

## Installer CLI (`bin/cli.mjs`, `lib/`)
- `lib/agents.mjs` is the agent registry. It holds project/global skill dirs, detection hints, `verified`, `sourceUrl`, and notes. Paths are taken verbatim from official documentation (each entry's `sourceUrl`). Agents that verifiably read `.agents/skills/` share that single copy. Agent-specific folders are used only where needed: Claude Code, Cline, Kilo, Kiro, Trae, Continue, and OpenHands. Entries backed only by third-party sources (vercel-labs/skills table) have `verified: false` and show as UNVERIFIED in `list-agents`.
- Rules-only agents never get native skills, so the skill is always placed in `.agents/skills/`. With `--yes` the CLI also writes a pointer file:
  - **aider**: `.aider.conf.yml` with `read: [.agents/skills/start-from-here/SKILL.md]`, written only if no `.aider.conf.yml` exists.
  - **amazon-q**: `.amazonq/rules/start-from-here.md`.
  - **jetbrains-ai-assistant**: `.aiassistant/rules/start-from-here.md`.
  - Pointer files carry a `managed-by: start-from-here` marker. Files without it are never modified or deleted, even with `--force`.

## Maintainer checklist when the skill changes
1. Run `npm run validate`. It checks frontmatter keys, the 200-char description, fewer than 500 lines, one SKILL.md, referenced paths, catalog templates, and sizes.
2. Run `npm run build`, then `npm test`.
3. If a new top-level folder is added under `references/` or `assets/`, check that `KNOWLEDGE_GROUPS` in `lib/bundle.mjs` still assigns every file. The last group is a catch-all for `assets/`, and the tests assert that every file appears exactly once.
4. Keep `version` the same in `package.json`, `.claude-plugin/*.json`, `.codex-plugin/plugin.json`, `gemini-extension.json`, and SKILL.md `metadata.version`. The tests enforce this.
