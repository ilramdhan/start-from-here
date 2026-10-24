<!-- guidance (remove in output): GitHub uses .github/PULL_REQUEST_TEMPLATE.md as the default PR body. No status header here — it would
appear in every PR. Keep it short enough that people actually fill it in. Must stay consistent with GIT_WORKFLOW.md, CONTRIBUTING.md,
and AI_GUIDELINES.md (disclosure). Tier notes — Lite: Summary, Testing, Checklist. Enterprise: add risk/rollback, security & privacy
impact, compliance control references, and approver sign-off. Owner: {{owner}} · Last updated: {{yyyy_mm_dd}}. -->

## Summary

<!-- What does this PR change and why? Keep the title in Conventional Commits format, e.g. `feat(auth): add passkey sign-in`. -->

## Related

<!-- Closes #<issue> · Feature: F-xx · NFR-xx · ADR-NNNN (if architectural) -->

## Type of change

- [ ] `feat` — new feature
- [ ] `fix` — bug fix
- [ ] `docs` / `refactor` / `perf` / `test` / `build` / `ci` / `chore`
- [ ] **Breaking change** (requires `!` or `BREAKING CHANGE:` footer and a migration note)

## How was this tested?

<!-- Commands run and their results (copy real output), manual steps, screenshots/recordings for UI changes. Write "not run" honestly. -->

## Risk and rollback

<!-- What could go wrong? How do we roll back? Any migrations, feature flags, config, or data changes? -->

## AI assistance

- [ ] This PR includes AI-generated or AI-assisted code/content, and I have reviewed and understand every line ([AI guidelines](../docs/engineering/AI_GUIDELINES.md)).
- Tool(s) used: <!-- e.g. none / name of tool -->

## Checklist

- [ ] Scope is limited to the stated change; no unrelated edits.
- [ ] Tests added/updated; format, lint, type check, and tests pass locally.
- [ ] No secrets, credentials, or personal data in code, tests, or logs.
- [ ] No new dependencies, or they were approved and justified above.
- [ ] Docs updated (README, docs/, ADR) where behavior or decisions changed.
- [ ] CHANGELOG `Unreleased` updated for user-visible changes.
- [ ] Accessibility checked for UI changes (keyboard, labels, contrast).
- [ ] Security/privacy impact considered; security-sensitive changes flagged for owner review.
