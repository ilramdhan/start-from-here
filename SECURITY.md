# Security Policy

## Supported versions

| Version | Supported |
|---|---|
| 1.x (latest minor) | ✅ |
| < 1.0 | ❌ |

Security fixes go into the latest 1.x release. Please upgrade with `npx start-from-here@latest …` or by reinstalling the skill.

## Reporting a vulnerability

**Please do not open a public issue.** Report privately through GitHub's private vulnerability reporting:

1. Go to https://github.com/ilramdhan/start-from-here/security/advisories/new
   (or open the **Security** tab and choose **Report a vulnerability**).
2. Include the affected version or commit, your environment (OS, Node version, agent or platform), reproduction steps, and the impact.

What to expect:

- An acknowledgement within **5 business days**.
- An initial assessment and planned fix timeline within **14 days**.
- Publicly known vulnerabilities of medium or higher severity that are in scope are fixed as quickly as practical, with a target of 60 days or less. Critical ones are prioritised.
- Release notes (GitHub Releases and `CHANGELOG.md`) list fixed publicly known vulnerabilities with their advisory identifier when one exists.
- Coordinated disclosure. We publish a GitHub Security Advisory and a fixed release, and credit you unless you prefer to stay anonymous.

Please give us a reasonable amount of time to fix the issue before you disclose it publicly. Don't access other people's data, degrade services, or run social engineering against maintainers or users.

## Scope

In scope:

- **The installer CLI** (`bin/cli.mjs`, `lib/`). It writes files to your project and home directory. Relevant issues include path traversal, writes outside the intended skill and rules directories, overwriting without `--force`, unsafe symlink handling, following attacker-controlled symlinks, unsafe handling of `--dir` / `--out`, and anything that executes untrusted content.
- **The bundle and zip builder** (`lib/bundle.mjs`, `lib/zip.mjs`, `scripts/build-bundle.mjs`). Relevant issues include malformed archives, path entries escaping the top-level folder, and mismatches with `dist/SHA256SUMS`.
- **The doc checker** (`skills/start-from-here/scripts/check-docs.mjs`). It reads untrusted project files and must never execute or fetch them.
- **The skill content** (`SKILL.md`, `references/`, `assets/templates/`). Relevant issues include **prompt injection**: wording that could make an agent follow instructions found in repository content, web pages, or tool output, that weakens the hard rules (no code generation, no secrets in files, no overwriting, no invented compliance claims), or that encourages an agent to run commands, install packages, or contact third parties.
- **Release integrity.** Tampering risks in the npm package (published with provenance), GitHub releases, and plugin manifests.

Out of scope:

- Vulnerabilities in the AI agents or platforms themselves (Claude Code, Codex, Copilot, Cursor, and so on). Report those to their vendors.
- The content of documents the skill generates for your project. You review and approve them. Legal drafts aren't legal advice.
- Issues that require an already-compromised machine or a malicious local user with write access to your skill folders.

## Hardening notes for users

- Install from the official repository or the npm package `start-from-here`. Check `dist/SHA256SUMS` against release assets.
- Run `npx start-from-here@latest install --dry-run` first to see exactly what will be written.
- Treat any third-party fork of a skill as code. Read `SKILL.md` before installing it.
- Never paste secrets into an AI session. If you do, rotate them.
