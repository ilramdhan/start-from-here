# Contributing to {{project_name}}

> **Status:** Draft · **Owner:** {{owner}} · **Last updated:** {{yyyy_mm_dd}} · **Tier:** {{tier}} · **Related:** [CODE_OF_CONDUCT](CODE_OF_CONDUCT.md), [GIT_WORKFLOW](docs/engineering/GIT_WORKFLOW.md), [CODE_STYLE](docs/engineering/CODE_STYLE.md), [AI_GUIDELINES](docs/engineering/AI_GUIDELINES.md)

<!-- guidance: GitHub links CONTRIBUTING.md (root, docs/, or .github/) when people open issues/PRs. Keep it welcoming and practical;
link details instead of duplicating GIT_WORKFLOW/CODE_STYLE. Commands MUST match AGENTS.md (verified or "Not configured").
For closed-source/internal projects, rename audience to "team members" and drop the CLA/DCO and first-timer sections if N/A.
Tier notes — Lite (OSS): sections 1–5, 8. Standard: all. Enterprise: add CLA/DCO enforcement, required trainings, security-review
triggers, and contribution approval for regulated code paths. Remove guidance comments in output. -->

Thank you for your interest in contributing! This guide explains how to propose changes. By participating you agree to follow our [Code of Conduct](CODE_OF_CONDUCT.md). <!-- guidance: delete this sentence and the CODE_OF_CONDUCT header link if CODE_OF_CONDUCT.md is not generated (e.g. private repo). -->

## 1. Ways to contribute

- Report bugs and request features via [issues]({{issues_url}}) (use the templates).
- Improve documentation.
- Fix bugs or implement features — look for labels `good first issue` and `help wanted`.
- Answer questions in {{community_channel}}.
- Security issues: **do not** open a public issue — follow [SECURITY.md](SECURITY.md).

## 2. Before you start

- Search existing issues and PRs to avoid duplicates.
- For anything larger than a small fix, open an issue first and wait for a maintainer to agree on the approach. Architectural changes need an ADR ([docs/decisions/](docs/decisions/README.md)).
- Comment on the issue to claim it so work is not duplicated.

## 3. Development setup

Prerequisites: {{prerequisites}}

```sh
{{clone_command}}
{{install_command}}
{{env_setup_command}}   # copy example env file; never commit secrets
{{dev_command}}
```

| Task | Command |
|---|---|
| Run tests | `{{test_command}}` |
| Lint | `{{lint_command}}` |
| Format | `{{format_command}}` |
| Type check | `{{typecheck_command}}` |

## 4. Making changes

1. Fork (external contributors) or branch (members) from `{{default_branch}}` using `{{branch_naming_pattern}}`.
2. Follow [CODE_STYLE.md](docs/engineering/CODE_STYLE.md). Keep changes focused; no unrelated refactors.
3. Add or update tests ([TESTING.md](docs/technical/TESTING.md)) and docs affected by the change.
4. Commit using [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/), e.g. `fix(parser): handle empty input`.
5. Add a user-facing entry to [CHANGELOG.md](CHANGELOG.md) under `Unreleased` when applicable.
6. Run the full test/lint/format commands above before pushing.

## 5. Pull requests

- Fill in the PR template completely; link the issue (`Closes #123`).
- Keep PRs small (≈ ≤ {{max_pr_lines}} changed lines); split large work.
- CI must pass. A maintainer/CODEOWNER review is required ({{required_approvals}} approval(s)).
- Respond to review feedback; we aim to give a first review within {{review_sla}}.
- Maintainers merge using {{merge_strategy}}. See [GIT_WORKFLOW.md](docs/engineering/GIT_WORKFLOW.md).

## 6. AI-assisted contributions

AI tools are allowed under our [AI guidelines](docs/engineering/AI_GUIDELINES.md). You are responsible for every line you submit: understand it, test it, ensure you have the right to contribute it, and disclose AI assistance as described there ({{ai_disclosure_policy_summary}}). Low-effort, unreviewed generated PRs may be closed.

## 7. Legal: licensing of contributions

<!-- guidance: Pick ONE: (a) inbound=outbound (default, no extra agreement); (b) DCO sign-off (`git commit -s`, https://developercertificate.org/);
(c) CLA via a bot (only if the user has a CLA drafted by counsel — never draft a CLA). -->

{{contribution_licensing_statement}} <!-- e.g. "By contributing, you agree that your contributions are licensed under the project's [LICENSE](LICENSE). All commits must be signed off (DCO): `git commit -s`." -->

## 8. Getting help

Questions? See [SUPPORT.md](SUPPORT.md) or ask in {{community_channel}}.

## 9. Recognition

{{recognition_statement}} <!-- e.g. contributors listed via all-contributors, release notes credits. Delete if none. -->

## Definition of done (this document)

- [ ] Commands identical to AGENTS.md and verified (or "Not configured").
- [ ] Branching, commit, PR, and merge rules consistent with GIT_WORKFLOW.md and the PR template.
- [ ] Contribution licensing choice (inbound=outbound/DCO/CLA) made and consistent with LICENSE.
- [ ] Links to CODE_OF_CONDUCT, SECURITY, SUPPORT resolve (or removed if not generated).
- [ ] No `{{placeholders}}` or guidance comments remain.
