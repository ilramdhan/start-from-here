# OpenAI API & Agents SDK

[← All guides](README.md) · [User manual](../USAGE.md)

## Overview

| | |
|---|---|
| Support level | **Native skill** |
| OpenAI API | Upload with `POST /v1/skills`, attach to the hosted or local `shell` tool |
| Agents SDK (Python) | `Skills(from_=LocalDir(...))` or `Skills(from_=GitRepo(...))`; materializes to `.agents/skills` |
| Invocation | User message: "Use the start-from-here skill to plan my new app" |

## Prerequisites

- `OPENAI_API_KEY`.
- `dist/start-from-here.zip` (single top-level folder `start-from-here/`) or the `skills/start-from-here/` folder.
- Agents SDK: Python (TypeScript support is announced for later).

## Install

### OpenAI API — upload

```bash
curl -X POST https://api.openai.com/v1/skills \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F "files[]=@dist/start-from-here.zip"
```

> ⚠️ Unverified: the exact multipart field name for a zip upload. The docs describe multipart `files[]` (with paths) or a zip with one top-level folder.

Limits: zip ≤ 50 MB, ≤ 500 files per version, each uncompressed file ≤ 25 MB. Exactly **one** `SKILL.md` per bundle (the release zip complies).

Attach to the hosted shell tool:

```json
{"type":"shell","environment":{"type":"container_auto",
  "skills":[{"type":"skill_reference","skill_id":"<id>","version":"latest"}]}}
```

Local shell (no upload):

```json
{"type":"shell","environment":{"type":"local",
  "skills":[{"name":"start-from-here","description":"Interviews the user, then writes approved pre-code project docs.","path":"/abs/path/.agents/skills/start-from-here"}]}}
```

Inline (base64 zip): `{"type":"inline","name":"start-from-here","description":"…","source":{"type":"base64","media_type":"application/zip","data":"…"}}`.

### Agents SDK (Python)

```python
Skills(from_=GitRepo(repo="ilramdhan/start-from-here", ref="main"))
# or local:
Skills(from_=LocalDir(src="./skills"))
```

Default `skills_path=".agents"` → the skill appears at `.agents/skills/start-from-here`.

To place it on disk for a local shell or SDK `LocalDir`:

```bash
npx start-from-here@latest install --agent universal            # .agents/skills/
npx start-from-here@latest install --agent universal --global   # ~/.agents/skills/
```

## Verify it loaded

- API: list your skills (`GET /v1/skills`) and confirm the id/version.
- Ask the agent: "List the skills you can use." `start-from-here` should appear.

## How to use

```text
Use the start-from-here skill to plan my new app: a field-inspection mobile app for a construction firm.
```

Relay questions to your end user and send their answers back. The skill stops at each gate.

## Example first session

```text
User:  Use the start-from-here skill to plan a field-inspection mobile app.
Agent: Round 0 — 1. Language? Default English. 2. Experience? 3. Team & goal?
       4. Personal/regulated data? Open source?
User:  English; professional; 2 teams; business-critical; employee data + photos; proprietary.
Agent: Proposed tier: Enterprise (multiple teams, business-critical). Adds COMPLIANCE,
       SUPPORT, mandatory ADRs, one-doc-per-review. Confirm?
```

## Resuming in a new session

With a local shell or SDK workspace, files persist: say "resume". With hosted containers, save the generated files (especially `docs/.start-from-here/STATE.md` and `docs/DISCOVERY.md`) in your app, and provide them on the next run.

## Update

- API: `POST /v1/skills/<id>/versions` with the new zip; set the default with `POST /v1/skills/<id>` `{"default_version":"<n>"}`, or reference `"latest"`.
- SDK: bump `ref` in `GitRepo`, or re-run `npx start-from-here@latest install --agent universal --force`.

## Uninstall

- API: delete the skill (⚠️ Unverified: DELETE endpoint not listed in our research; check the API reference).
- Local: `npx start-from-here@latest uninstall --agent universal`.

## Limitations & troubleshooting

- **"Exactly one skill.md/SKILL.md file is allowed"** → don't zip the whole repo. Use the release zip.
- Agents API self-hosted `capability_directories`: absolute paths only, max 32, no `.`/`..`.
- ⚠️ Unverified: frontmatter length limits on OpenAI (the spec says name ≤ 64, description ≤ 1024; ours is ≤ 200).

## Sources

- https://developers.openai.com/api/docs/guides/tools-skills
- https://openai.github.io/openai-agents-python/sandbox/guide/
- https://openai.com/index/the-next-evolution-of-the-agents-sdk/
