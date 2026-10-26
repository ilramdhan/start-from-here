# ChatGPT (Skills beta, Custom GPT, Projects)

[← All guides](README.md) · [User manual](../USAGE.md)

## Overview

| Route | Support level | Who can use it |
|---|---|---|
| **ChatGPT Skills** (beta) | Native skill (upload) | Business, Enterprise, Healthcare, Edu workspaces where the owner enabled Skills ⚠️ |
| **Plugin** (Codex/ChatGPT plugin) | Plugin | Plugin-bundled skills work in ChatGPT web/desktop/mobile |
| **Custom GPT** | Prompt-only | Anyone who can create GPTs |
| **Project** | Prompt-only | All plans (file limits differ) |

Output mode is **chat-only**: each document arrives as a fenced markdown block with its path as a heading.

## Prerequisites

- Files from the GitHub release (or `npx start-from-here@latest bundle --out dist`):
  - `dist/start-from-here.zip` — skill upload
  - `dist/gpt-instructions.md` — ≤ 8,000-char instructions for a Custom GPT
  - `dist/knowledge/` — ≤ 10 knowledge files
  - `dist/start-from-here.prompt.md` — single flattened prompt

## Install

### Route 1 — ChatGPT Skills (beta)

1. Skills are available to eligible Business, Enterprise, Healthcare, and Edu users. Workspace admins control them under Permissions & roles (Enable skills, Enable skill uploading, Share skills, and others).
2. Go to **Plugins › Skills tab › Create › Upload from your computer**.
3. Upload the skill (the release `start-from-here.zip`). ChatGPT scans the skill before it becomes available.
4. Optionally share it with the workspace (RBAC).

> Verified 2026-10-25 (official help article, https://help.openai.com/en/articles/20001066-skills-in-chatgpt): menu path (Plugins > Skills tab > Create > Upload from your computer), eligible plans (Business, Enterprise, Healthcare, Edu), the pre-availability scan (results can be Needs Review or Blocked), and the workspace permissions. ⚠️ Unverified: the accepted upload format (zip vs folder); the article does not state it.

Scope: per user, or shared to the workspace. No project scope.

### Route 2 — Custom GPT

1. **Explore GPTs › Create › Configure**.
2. Paste `dist/gpt-instructions.md` into **Instructions** (max 8,000 characters, ⚠️ Unverified, see below).
3. Upload every file from `dist/knowledge/` under **Knowledge**.
4. Optional: enable Code Interpreter (not required).
5. Save (private, link, or workspace).

> Verified 2026-10-25 (official help article, https://help.openai.com/en/articles/8554397-creating-and-editing-gpts): up to 20 knowledge files, 512 MB each. ⚠️ Unverified: the 8,000-character instructions limit (the article states no instruction limit). Availability: new GPT creation and publishing are not available on personal accounts (Free, Go, Plus, Pro); only Business, Enterprise, and Edu workspaces with permission can create them. OpenAI plans to retire custom GPTs in favor of Plugins (Enterprise retirement planned for Dec 11, 2026), so prefer Route 1 or 3 where possible.

### Route 3 — Project

1. Create a Project. Open **••• › Project settings** and paste `dist/gpt-instructions.md` (or the top of `start-from-here.prompt.md`) into the instructions.
2. Upload `dist/knowledge/` files (or `start-from-here.prompt.md`) as project files.

> Verified 2026-10-25 (official help article, https://help.openai.com/en/articles/10169521-projects-in-chatgpt): project file limits are Free 5, Go/Plus 25, Edu/Pro/Business/Enterprise 40, with at most 10 files uploaded at a time. Project instructions live under ••• > Project settings.

### Route 4 — Paste once

Start a chat and paste the whole `dist/start-from-here.prompt.md` with: "Follow these instructions for this conversation."

## Verify it loaded

- Skills: type `@` in the composer; `start-from-here` should appear.
- GPT/Project: ask "What workflow will you follow?" It should describe Orient → Calibrate → Discover → Recommend → Brief → Generate → Audit → Handoff.

## How to use

- Skills: `@start-from-here I want to plan a recipe-sharing app`, or just describe a new project (automatic invocation).
- Custom GPT / Project: open it and type `start`.

Docs arrive 2–3 per message as `### path` + a fenced block. Reply `next` for more. Save each block to its path.

## Example first session

```text
You:     start — I want a recipe-sharing website for my cooking club.
ChatGPT: I'll deliver each document as a markdown block for you to save.
         1. Chat and document language? Recommended: English.
         2. Experience: (a) new (b) some (c) professional?
         3. Who builds it? Prototype or product?
         4. Personal data (accounts, emails)? Open source?
You:     English, a, me + a friend, prototype, yes accounts, no.
ChatGPT: Proposed tier: Lite. "Tier" = how deep the docs go; Lite is shortest…
```

## Resuming in a new session

Save the `STATE.md` block as `docs/.start-from-here/STATE.md`. In a new chat (same GPT/Project), type `resume` and attach `STATE.md` and `docs/DISCOVERY.md`. In a Project, upload them as project files so every chat sees them.

**Long project or answers getting shallow? Use session mode.** Say `session mode` (the skill recommends it by default in chat-only tools). Each work package (interview, product, architecture, data/API, …) runs in its own fresh chat. At the end of each chat the skill prints `HANDOVER.md`, `DIGEST.md` and `STATE.md` blocks and a next-session prompt: save them, open a new chat with the same GPT/Project, and paste or attach them with the prompt. Say `next session` to hand over early. See [Small context windows & session mode](../USAGE.md#small-context-windows--session-mode).

## Update

- Skills: remove the old skill, upload the new zip.
- GPT/Project: replace instructions and knowledge files with the new release.

## Uninstall

Delete the skill (Plugins › Skills), the Custom GPT, or the project files.

## Limitations & troubleshooting

- **No Skills tab** → your plan or workspace does not have Skills. Use a Custom GPT or Project.
- **Custom GPT ignores the workflow** → instructions must be under 8,000 chars; use `gpt-instructions.md`, which points to knowledge files.
- Scripts (`check-docs.mjs`) cannot run on your project. The audit is done by reading.
- Long replies may be cut off. Reply `continue`.
- For Codex (terminal/IDE) see [codex.md](codex.md); for the API see [openai-api-and-agents-sdk.md](openai-api-and-agents-sdk.md).

## Sources

- https://academy.openai.com/public/clubs/work-users-ynjqu/resources/skills
- https://help.openai.com/en/articles/20001066-skills-in-chatgpt (⚠️ not fetchable; search snippets)
- https://help.openai.com/en/articles/10169521-projects-in-chatgpt (⚠️ search snippet)
- https://developers.openai.com/plugins/build/plugins
- https://learn.chatgpt.com/docs/build-skills
- https://fast.io/resources/custom-gpt-token-limit/ (third-party)
