# Gemini app (Gems)

[← All guides](README.md) · [User manual](../USAGE.md)

## Overview

| | |
|---|---|
| Support level | **Prompt-only** (Gem instructions + knowledge files) |
| Artifacts | `dist/gem-instructions.md` (short bootloader) + `dist/knowledge/` (≤ 10 files) |
| Invocation | Open the Gem, type `start` |
| Output mode | Chat-only: each doc arrives as a fenced markdown block with its path as a heading |

The Gemini web app has no native skill loading. Gems cannot run bundled scripts.

## Prerequisites

- A Google account with access to Gems at gemini.google.com.
- Files from the GitHub release, or built with `npx start-from-here@latest bundle --out dist`.

## Install

1. Go to gemini.google.com › **Gems** › **New Gem**.
2. Name: `start-from-here`.
3. Paste the contents of `dist/gem-instructions.md` into **Instructions**.
4. Add knowledge: upload the files in `dist/knowledge/` (up to **10 files at a time**, each up to **100 MB**). You can also add them from Google Drive.
5. Save. Optionally share the Gem.

> ⚠️ Unverified: whether Gems accept `.md` uploads (Google's help page says Gemini Apps "support most file types", up to 10 files per prompt and 100 MB per non-video file, but does not list Markdown; https://support.google.com/gemini/answer/14903178, checked 2026-10-25). If an upload is refused, rename the files to `.txt`.
> ⚠️ Unverified: a character limit for Gem instructions (none published in Google's help pages as of 2026-10-25). If the full `start-from-here.prompt.md` fits, you can paste it instead.

Tip: store the knowledge files as Google Docs in Drive. Linked Docs update automatically; uploaded files must be re-uploaded after changes.

Scope: a Gem belongs to your account (global). No project scope.

## Verify it loaded

Open the Gem and ask: `What steps will you follow?` It should describe the phases (Orient → Calibrate → Discover → Recommend → Brief → Generate → Audit → Handoff) and say it won't write code.

## How to use

Open the Gem and type:

```text
start — I want to build a budgeting app for students
```

Reply `next` to get the next batch of documents. Save each block to the path shown in its heading.

## Example first session

```text
You:  start — I want to build a budgeting app for students.
Gem:  I'll deliver each document as a markdown block for you to save.
      1. Language for chat and documents? Recommended: English.
      2. Experience: (a) new (b) some (c) professional?
      3. Who builds it? Prototype or product?
      4. Personal or financial data? Under-13 users?
You:  Indonesian for chat, English for docs. (a). Me. Prototype. Bank balances typed by hand, users 17+.
Gem:  Siap! Tier yang saya usulkan: Lite…
```

## Resuming in a new session

Save the `STATE.md` block as `docs/.start-from-here/STATE.md`. In a new chat with the Gem, type `resume` and attach `STATE.md` and `docs/DISCOVERY.md`.

**Long project or answers getting shallow? Use session mode.** Say `session mode` (the skill proposes it automatically in chat-only tools for Standard/Enterprise). Each work package (interview, product, architecture, data/API, …) runs in its own fresh chat. At the end of each chat the skill prints `HANDOVER.md` and `STATE.md` blocks and a next-session prompt: save them, open a new chat with the Gem, and paste or attach them with the prompt. Say `next session` to hand over early. See [Small context windows & session mode](../USAGE.md#small-context-windows--session-mode).

## Update

Edit the Gem: replace the instructions and re-upload the knowledge files from the new release (Drive-linked Docs update automatically).

## Uninstall

Gems › select the Gem › delete.

## Limitations & troubleshooting

- Gems cannot be used with Gemini Live.
- Scripts can't run: the audit is done by reading.
- If the Gem skips the interview, re-paste the instructions and make sure the knowledge files are attached.
- For Gemini CLI see [gemini-cli.md](gemini-cli.md); for Antigravity see [antigravity.md](antigravity.md).

## Sources

- https://support.google.com/gemini/answer/15146780
- https://support.google.com/gemini/answer/14903178
- https://workspaceupdates.googleblog.com/2024/11/upload-google-docs-and-other-file-types-to-gems.html
