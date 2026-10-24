# Local and other LLMs (Ollama, LM Studio, Open WebUI, Le Chat, DeepSeek, Grok, Perplexity, Qwen, Llama)

[← All guides](README.md) · [User manual](../USAGE.md)

## Overview

| Platform | Support level | Method |
|---|---|---|
| **Open WebUI** | Native skill (import) | Workspace › Skills › import `start-from-here.zip`; mention with `$` |
| **Mistral Vibe Work** (web) | Native skill (upload) | Context › Skills › New Skill |
| **Mistral Le Chat** | Prompt-only | Agent Instructions + Library (knowledge) |
| **Perplexity** | Prompt-only | Space instructions (8,000-char cap ⚠️) + files |
| **Grok** | Prompt-only | Custom Instructions + Workspace/Project files ⚠️ |
| **DeepSeek (web)** | Prompt-only | Paste as first message ⚠️ (no persistent instructions found) |
| **Qwen / Llama / any chat** | Prompt-only | Paste as first message or system prompt |
| **Ollama** | Prompt-only | Modelfile `SYSTEM` |
| **LM Studio** | Prompt-only | System Prompt / preset |

Files (from the GitHub release, or `npx start-from-here@latest bundle --out dist`):

- `dist/start-from-here.prompt.md` — the whole skill flattened into one file
- `dist/knowledge/` — ≤ 10 knowledge files for tools with file uploads
- `dist/start-from-here.zip` — skill zip for Open WebUI / Vibe Work
- `dist/gpt-instructions.md` — short (≤ 8,000 chars) instructions that point to the knowledge files; good for 8k-capped fields

Output mode is **chat-only**: documents come as `### path` headings with fenced markdown blocks. Reply `next` for more.

## Prerequisites

- The `dist/` files.
- For local models: a model with a large context window. The flattened prompt plus a long interview needs many tokens.

> ⚠️ Unverified: a minimum context size or model size for good results (no vendor publishes one; this is project guidance, checked 2026-10-25). Small local models may skip gates or lose track. Prefer the largest model you can run.

**Context ≤ 64k (most local models)?** Use **session mode**: say `session mode` at the start (the skill also proposes it). The work is split into short work packages, one per fresh chat, connected by `docs/.start-from-here/HANDOVER.md`. See [Session mode for local models](#session-mode-for-local-models).

## Install

### Open WebUI (native)

**Workspace › Skills** › import `start-from-here.zip` (it also accepts a `.skill` file, a folder, or a `.md` containing SKILL.md). In chat, type `$` and pick `start-from-here`.

### Mistral

- **Vibe Work:** Context › Skills › New Skill › upload the `start-from-here` folder (there is a file-count limit).
- **Le Chat:** create an Agent. Paste `dist/start-from-here.prompt.md` (or `gpt-instructions.md`) into **Instructions**. Upload `dist/knowledge/*` to a **Library** and attach it under Knowledge.

### Perplexity Space

Paste `dist/gpt-instructions.md` into the Space's custom instructions (8,000-character cap) and upload `dist/knowledge/*` as Space files.

### Grok

Paste `dist/gpt-instructions.md` into Custom Instructions or a Workspace/Project, and upload `dist/knowledge/*`.

### DeepSeek, Qwen chat, Llama chat, any other chat

Start a new chat and paste the contents of `dist/start-from-here.prompt.md`, beginning with:

```text
Follow these instructions for this conversation. Then say you're ready.
```

### Ollama

```bash
cat > Modelfile <<'EOF'
FROM <model-you-pulled>
SYSTEM """
<paste the contents of dist/start-from-here.prompt.md here>
"""
EOF
ollama create start-from-here -f Modelfile
ollama run start-from-here
```

Replace `<model-you-pulled>` with a model you have already pulled. Global scope: the model is available to all your projects. There is no project scope.

### LM Studio

Paste `dist/start-from-here.prompt.md` into **System Prompt** and save it as a preset (stored in `~/.lmstudio/config-presets`). Presets can be imported from a file or URL.

## Verify it loaded

Ask: `What steps will you follow?` It should list Orient → Calibrate → Discover → Recommend → Brief → Generate → Audit → Handoff and say it won't write code.

## How to use

```text
start — I want to plan a mobile game for learning Japanese kana
```

Open WebUI: `$start-from-here start …`.

## Example first session

```text
You:   start — a mobile game for learning Japanese kana
Model: I can't write files here, so I'll deliver docs as markdown blocks to save.
       1. Language for chat and docs? Recommended: English.
       2. Experience: (a) new (b) some (c) professional?
       3. Who builds it? Prototype or product?
       4. Personal data? Users under 13? Open source?
You:   English, b, solo, prototype, progress only, maybe kids, no.
Model: Users under 13 in the US would trigger COPPA. Recommended: target 13+ for the
       prototype, recorded as an ASSUMPTION. Proposed tier: Lite…
```

## Resuming in a new session

Save every block the model gives you, especially `docs/.start-from-here/STATE.md` and `docs/DISCOVERY.md`. In a new chat (with the prompt loaded again), type `resume` and paste or attach those two files. In session mode, paste `docs/.start-from-here/HANDOVER.md` first and use the next-session prompt it contains.

## Session mode for local models

The full flattened prompt is far larger than an 8–32k context. In session mode each chat needs only `SKILL.md` (~7.6k tokens) plus a small, named set of sections:

1. Load `SKILL.md` as the system prompt (Modelfile `SYSTEM`, preset, or first message) instead of the whole prompt bundle. With ≥ 64k context you can keep the full bundle.
2. Say `session mode`, then `start`. WP1 runs the interview and ends with `docs/DISCOVERY.md` for you to approve.
3. At the end of each session the model prints `HANDOVER.md` and `STATE.md` blocks plus a next-session prompt. Save them (say `next session` to force this early).
4. Start a **new** chat (clear history), paste the next-session prompt, `HANDOVER.md`, `STATE.md`, and only the sections HANDOVER §7 lists — copy them from the docs you saved and from `dist/start-from-here.prompt.md` (search `=== FILE: references/… ===`).
5. Repeat until WP9 (audit + handoff). With ≤ 16k context, expect one document per session.

Tips: raise the context setting as high as your hardware allows (Ollama `num_ctx`, LM Studio context length); use your biggest model for WP3–WP5 (architecture, data, security). Details: [USAGE › Small context windows & session mode](../USAGE.md#small-context-windows--session-mode).

## Update

Replace the pasted prompt, Modelfile `SYSTEM`, preset, or knowledge files with those from the new release. Ollama: re-run `ollama create start-from-here -f Modelfile`.

## Uninstall

Delete the agent/space/preset, or `ollama rm start-from-here`. Open WebUI: delete the skill in Workspace › Skills.

## Limitations & troubleshooting

- **References not available** → chat models can't load files on demand. `SKILL.md` is self-sufficient; the flattened prompt includes the most important references.
- **Scripts can't run** → the audit is done by reading. Later, on your machine: `npx start-from-here@latest check .`
- **Output cut off** → reply `continue`. Ask for one document per message if needed.
- **Model forgets earlier answers** → paste `docs/DISCOVERY.md` back in and say `resume`.
- **Docs get shallow, tables go missing, IDs drift, or the chat dies mid-doc** → the context is too small for one run. Say `next session` to save a handover, then continue in session mode (above).

## Sources

- https://docs.openwebui.com/features/workspace/skills/ (search snippet)
- https://docs.mistral.ai/vibe/work/skills
- https://docs.mistral.ai/le-chat/knowledge-integrations/agents (search snippet)
- https://www.perplexity.ai/help-center (third-party snippets)
- https://www.maginative.com/article/xai-upgrades-grok-with-personalized-memory-and-custom-workspaces/ (third-party)
- https://docs.ollama.com/modelfile
- https://lmstudio.ai/docs/app/presets (search snippet)
- https://github.com/vercel-labs/skills (`npx skills use` prints a prompt)
