# Claude API & Claude Agent SDK

[← All guides](README.md) · [User manual](../USAGE.md)

## Overview

| | |
|---|---|
| Support level | **Native skill** |
| Claude API | Upload once with `POST /v1/skills`, reference it in `container.skills` (needs the code execution tool) |
| Agent SDK | Loads from `.claude/skills/` (project) and `~/.claude/skills/` (user) via `settingSources` |
| Invocation | Your app's user message, e.g. "Use the start-from-here skill to plan my new app" |

Use this to embed the interview in your own product (an internal "project kickoff" bot, for example).

## Prerequisites

- An Anthropic API key in `ANTHROPIC_API_KEY`.
- The skill folder (`skills/start-from-here/`) or `dist/start-from-here.zip`.
- Agent SDK: TypeScript or Python SDK installed.

## Install

### Claude API — upload the skill

The Skills API is GA (no beta header needed).

```bash
git clone https://github.com/ilramdhan/start-from-here && cd start-from-here/skills
# Upload every file, keeping paths under start-from-here/
args=(); while IFS= read -r f; do args+=(-F "files[]=@$f;filename=$f"); done < <(find start-from-here -type f)
curl -X POST "https://api.anthropic.com/v1/skills" \
  -H "x-api-key: $ANTHROPIC_API_KEY" -H "anthropic-version: 2023-06-01" \
  -F "display_name=start-from-here" "${args[@]}"
```

A zip upload is also accepted, and the Python SDK has a `files_from_dir` helper. Save the returned `skill_...` id.

Requirements: total size < 30 MB uncompressed; `name` ≤ 64 chars; `description` ≤ 1024 chars. Custom skills are **workspace-wide** (there is no per-project scope).

Use it in the Messages API (code execution tool required; up to 20 skills per request):

```json
{
  "model": "<model-id>",
  "max_tokens": 4096,
  "container": { "skills": [
    { "type": "custom", "skill_id": "skill_01AbC...", "version": "latest" }
  ]},
  "tools": [{ "type": "code_execution_20250825", "name": "code_execution" }],
  "messages": [{ "role": "user", "content": "Use the start-from-here skill to plan my new app." }]
}
```

### Agent SDK — filesystem skill

Project scope:

```bash
npx start-from-here@latest install --agent claude-code          # → .claude/skills/start-from-here
# or: npx skills add ilramdhan/start-from-here -a claude-code
```

Global scope: add `--global` (→ `~/.claude/skills/start-from-here`).

```ts
const options = {
  cwd: process.cwd(),
  settingSources: ["user", "project"],
  skills: ["start-from-here"],          // or "all"; setting this auto-adds the Skill tool
  allowedTools: ["Read", "Write", "Bash"],
};
```

Python uses `setting_sources`. Plugins also work: `plugins: [{ type: "local", path: "./start-from-here" }]` (only `local`; download marketplace plugins first).

## Verify it loaded

- API: `GET /v1/skills?source=custom` lists the skill.
- Agent SDK: the init message's `skills` array contains `start-from-here`.

## How to use

Send a user message such as:

```text
Use the start-from-here skill to plan my new app: a B2B invoicing SaaS for EU freelancers.
```

Your app must relay the skill's questions to the end user and send their answers back. The skill stops at every gate and waits.

## Example first session

```text
User:   Use the start-from-here skill to plan my new app: a B2B invoicing SaaS for EU freelancers.
Claude: Round 0 — Calibrate. 1. Language for chat/docs? Default: English.
        2. Experience level? 3. Team size and goal (prototype / MVP / business-critical)?
        4. Personal or payment data? Open source?
User:   English; professional; 3 devs; MVP; personal + card payments via a provider; proprietary.
Claude: Proposed tier: Standard (small team MVP). Payments + EU personal data trigger
        PRIVACY_POLICY and a PCI DSS scope note (hosted payments recommended). Confirm?
```

## Resuming in a new session

- **Agent SDK (filesystem):** the skill writes `docs/.start-from-here/STATE.md`. A new session in the same `cwd` resumes with "Use the start-from-here skill. resume".
- **Claude API:** containers do not persist your project. Store the generated files (including `STATE.md`) in your app, and send them back in the next conversation with "resume".

## Update

- API: `POST /v1/skills/{id}/versions` with the new files (full snapshot; `name` must match). Requests using `"version": "latest"` pick it up.
- Agent SDK: `npx start-from-here@latest install --agent claude-code --force` or `npx skills update`.

## Uninstall

- API: `DELETE /v1/skills/{id}`.
- Agent SDK: `npx start-from-here@latest uninstall --agent claude-code` (add `--global` if needed).

## Limitations & troubleshooting

- **Extra frontmatter keys rejected** → only `name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`.
- API runtime has **no network and no runtime package install**. That's fine: the skill needs neither.
- Skills do not sync across surfaces (claude.ai ≠ API ≠ Claude Code).
- Agent SDK only loads skills from directories in `settingSources` / `additionalDirectories`. `.agents/skills/` is not read.

## Sources

- https://platform.claude.com/docs/en/build-with-claude/skills-guide
- https://platform.claude.com/docs/en/api/skills/create
- https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview
- https://code.claude.com/docs/en/agent-sdk/skills
- https://code.claude.com/docs/en/agent-sdk/plugins
