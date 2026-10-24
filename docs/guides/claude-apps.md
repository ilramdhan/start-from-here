# Claude apps (claude.ai, Claude Desktop, mobile)

[← All guides](README.md) · [User manual](../USAGE.md)

## Overview

| | |
|---|---|
| Support level | **Native skill** (zip upload) · Prompt-only fallback via Projects |
| Artifact | `dist/start-from-here.zip` (top-level folder `start-from-here/`) |
| Invocation | Automatic, or "Use the start-from-here skill to plan my new app" |
| Output mode | **Chat-only**: each document arrives as a fenced markdown block with its path as a heading |

## Prerequisites

- A Claude account. Help center: "Skills are available for users on Free, Pro, Max, Team, and Enterprise plans. This feature requires code execution to be enabled."
  > ⚠️ Unverified: the platform overview page still lists custom uploads as Pro, Max, Team and Enterprise only. The help center is newer.
- Code execution enabled:
  - Free / Pro / Max: **Settings › Capabilities › "Code execution and file creation"**.
  - Team / Enterprise: an admin enables "Cloud code execution and file creation" and "Skills" in **Organization settings › Plugins & skills › Policy**.
- The zip: download `start-from-here.zip` from the GitHub release, or build it with `npx start-from-here@latest bundle --out dist`.

## Install

### Zip upload (claude.ai web and Claude Desktop)

1. Open **Customize › Skills**.
2. Click **+** › **+ Create skill** › **Upload a skill**.
3. Choose `start-from-here.zip`. The zip root must be the folder `start-from-here/` containing `SKILL.md`.
4. Make sure the skill is toggled on.

Scope: custom skills are **per user** (equivalent to "global"). There is no project scope. Team/Enterprise admins can provision a skill org-wide in **Organization settings › Plugins & skills**.

Claude Desktop uses the same account skills (Customize in the sidebar). Mobile uses the same account.

> ⚠️ Unverified: whether mobile apps can run uploaded skills. They share the account, but no mobile-specific documentation was found.

### Fallback: Project + pasted prompt

If skills are disabled for you:

1. Create a Project.
2. Paste `dist/start-from-here.prompt.md` into the Project instructions, or upload it as a project file.
3. Upload files from `dist/knowledge/` as project knowledge.

## Verify it loaded

- **Customize › Skills** lists `start-from-here` as enabled.
- In a new chat, ask: `Which skills do you have available?`

## How to use

Start a new chat:

```text
Use the start-from-here skill to plan my new app.
```

Claude may also pick the skill automatically when you say "I have an idea for an app and want to plan it before coding".

Because claude.ai cannot write into your project folder, the skill uses **chat-only mode**. It delivers 2–3 docs per message as `### docs/product/PRD.md` followed by a fenced block. Reply `next` to get the next batch. Save each block to the shown path.

## Example first session

```text
You:    Use the start-from-here skill. I want a mobile app for neighbours to lend tools.
Claude: I can't write files here, so I'll deliver each document as a markdown block
        for you to save. First, a few calibration questions:
        1. Language for chat and documents? Recommended: English.
        2. Experience: (a) new to this (b) built a few things (c) professional engineer?
        3. Solo, small team, or multiple teams? Prototype or real product?
        4. Will you store personal data (names, addresses, phone numbers)?
You:    English, (a), just me, prototype first. Yes, names and neighbourhoods.
Claude: Proposed tier: Lite — solo prototype, but personal data means a short
        PRIVACY_POLICY is included. "Personal data" = any info that identifies a person…
```

## Resuming in a new session

Chats do not share files. When the skill shows the `STATE.md` block, save it as `docs/.start-from-here/STATE.md`. In a new chat:

```text
Use the start-from-here skill. resume
```

Then paste or attach `STATE.md` and `docs/DISCOVERY.md`. Using a Project and adding these files as project knowledge makes resuming easier.

## Update

Download the new `start-from-here.zip`, then in **Customize › Skills** remove the old skill and upload the new one.

> ⚠️ Unverified: whether re-uploading a skill with the same name replaces it in place.

## Uninstall

**Customize › Skills** › select `start-from-here` › delete (or toggle off).

## Limitations & troubleshooting

- **"Unexpected key(s) in SKILL.md frontmatter"** → the upload accepts only `name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`. Use the official release zip.
- **Description too long** → the help center limits `description` to 200 characters. The official zip complies.
- **"ZIP file exceeds size limits"** → use the release zip. ⚠️ Unverified: exact claude.ai zip size limit.
- **Upload rejected** → the zip root must be the `start-from-here/` folder, not loose files.
- No filesystem: `scripts/check-docs.mjs` will not run against your project. The skill does the audit by reading.
- claude.ai skills do **not** sync to the API. They do sync one way into Claude Code (`~/.claude/skills/synced/`, v2.1.273+).
- Long outputs: if a message is cut off, reply `continue` or `next`.

## Sources

- https://support.claude.com/en/articles/12512180-using-skills-in-claude
- https://support.claude.com/en/articles/12512198-creating-custom-skills
- https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview
- https://code.claude.com/docs/en/skills
