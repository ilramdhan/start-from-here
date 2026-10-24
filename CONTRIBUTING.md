# Contributing to start-from-here

Thanks for helping. This project is one Agent Skill (`skills/start-from-here/`) plus a zero-dependency installer CLI and its packaging. Contributions usually take one of four forms:

| You want to… | Start with |
|---|---|
| Improve or add a discovery question | An issue using **Template improvement**, then a PR to `skills/start-from-here/references/discovery-question-bank.md` |
| Improve or add a document template | An issue using **Template improvement**, then a PR to `skills/start-from-here/assets/templates/…` (and `references/document-catalog.md` if it's a new doc) |
| Support a new AI tool / agent | An issue using **Platform support**, with official source URLs |
| Fix a bug in the CLI, bundle, or checker | An issue using **Bug report**, then a PR with a test |

Please read and follow the [Code of Conduct](CODE_OF_CONDUCT.md). Report security issues privately, as described in [SECURITY.md](SECURITY.md), and not in public issues.

## Reporting bugs and requesting enhancements

- Open a [GitHub issue](https://github.com/ilramdhan/start-from-here/issues/new/choose) using the **Bug report**, **Template improvement**, or **Platform support** form. Issues are public and archived, and you can search them before filing.
- Include the version (`start-from-here --version`), your OS and Node version, the agent or platform, and reproduction steps.
- The maintainer aims to acknowledge new bug reports and enhancement requests within 14 days. Not every enhancement will be accepted, but each gets a response.
- Report security vulnerabilities privately, as described in [SECURITY.md](SECURITY.md).

## Testing policy

- Any new functionality or bug fix in the CLI, bundle builder, or doc checker MUST come with automated tests in `test/` (`node:test`, run with `npm test`). Documentation-only and skill-content changes are covered by `npm run validate`.
- CI runs the test suite on Ubuntu, macOS, and Windows with Node 18, 20, 22, and 24 for every pull request (see [`ci.yml`](.github/workflows/ci.yml)). Reviewers check that tests were added.

## Warnings and static analysis

- `npm run validate` fails on any spec or repo-rule error. CI runs it with `--strict`, so warnings fail the build too. Fix warnings reported by `validate`, `build`, and `check-i18n` before you submit a PR.
- [CodeQL](.github/workflows/codeql.yml) scans the JavaScript code and the GitHub Actions workflows on every PR and on a schedule. Treat its findings as blocking: fix confirmed issues before merging, and dismiss false positives only with a written reason.

## Secure coding expectations

The installer writes to users' machines, so contributors MUST NOT introduce path traversal, writes outside the target skill or rules directories, overwrites without `--force`, use of `eval` or shell interpolation of user input, or committed secrets. The project has no runtime dependencies and implements no cryptography; use Node's built-in `node:crypto` (for example for SHA-256 checksums) rather than custom code.

## Local development

Requirements: Node.js ≥ 18. There are no runtime dependencies, so `npm install` isn't needed.

```bash
git clone https://github.com/ilramdhan/start-from-here.git
cd start-from-here
npm run validate   # validate the skill against the spec + repo rules
npm run build      # rebuild dist/ (zip, prompt.md, knowledge/, gpt/gem instructions, SHA256SUMS)
npm test           # run node:test suites in test/
node bin/cli.mjs --help
node bin/cli.mjs install --dir /tmp/sfh-demo --dry-run
node bin/cli.mjs check /path/to/a/generated/project
node scripts/check-links.mjs   # relative links in repo docs and site/
node scripts/check-i18n.mjs    # site translations have identical keys
```

Rebuild `dist/` with `npm run build` whenever you change anything under `skills/` or `adapters/` to verify the bundle still builds. `dist/` is git-ignored; the release workflow rebuilds it and attaches it to GitHub Releases.

To try the skill for real, install it into a scratch folder (`node bin/cli.mjs install --dir /tmp/sfh-demo`), open your agent there, and run a full Lite session.

## Validation rules (enforced by `npm run validate`)

Your PR must not break the [Agent Skills specification](https://agentskills.io/specification) or the stricter limits of the platforms we ship to:

1. **Frontmatter uses spec keys only**: `name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`. No vendor-specific keys. `metadata` values are strings.
2. **`name`** is `start-from-here`. It equals the folder name, uses only `a-z0-9-`, and never contains `claude` or `anthropic`.
3. **`description` is ≤ 200 characters** (the claude.ai upload limit) and contains no HTML/XML tags. It says what the skill does and when to use it.
4. **`SKILL.md` stays under 500 lines** and remains self-sufficient: the core flow must work when only `SKILL.md` is pasted into a chat.
5. **Exactly one `SKILL.md`** exists in the skill folder (an OpenAI API rule). Templates must never be named `SKILL.md`.
6. **Every path referenced** from `SKILL.md` or `references/*.md` exists.
7. **Platform facts are research-backed.** Each install path, invocation syntax, file limit, or version requirement needs an **official source URL** in your PR description, in the guide's *Sources* section, and in the `sourceUrl` of `lib/agents.mjs`. Anything found only in third-party sources must be marked `UNVERIFIED` (`verified: false`).

## Content rules for the skill

- **Templates are tech-agnostic.** Give examples across several stacks (for example a web app, a CLI, and a mobile app). Never assume one language, framework, or cloud.
- **No invention.** Templates and references must never tell the AI to state facts, metrics, versions, commands, or compliance status it can't verify. Use the markers `{{snake_case}}` (template placeholder), `[TBD: question — owner]`, `> **PROPOSAL:**`, and `> **ASSUMPTION:**`.
- **Model-agnostic wording.** Use plain imperative steps, MUST/SHOULD/MAY, and explicit **STOP** gates. Don't name tool-specific APIs in the core flow ("if you can write files…").
- **Every template** has the status header blockquote, `<!-- guidance: … -->` comments, and a *Tier notes* comment (what to cut for Lite and what to add for Enterprise).
- **Legal**: full official license texts only, never paraphrased. Legal templates keep the "not legal advice" notice.
- **New questions** need a tier tag (`[L]`/`[S]`/`[E]`), a "why we ask" line, and a labeled beginner default.

## Adding a new agent / platform

1. **Research.** Find the vendor's official docs for the project and global skill folders, the invocation syntax, and any limits. Save the URLs.
2. **Registry.** Add an entry to `AGENTS` in [`lib/agents.mjs`](lib/agents.mjs) with `id`, `displayName`, `kind` (`skills` or `rules`), `projectSkillDir`, `globalSkillDir`, `globalDisplay`, `detect`, `verified`, `sourceUrl`, and `notes`. If the agent reads `.agents/skills/`, use that path so agents share one copy. Rules-only agents also need `rulesFile` and `manualHint`.
3. **Guide.** Add or extend a file in [`docs/guides/`](docs/guides/) that covers prerequisites, install (project and global), verifying it loaded, invocation, an example opening, update, uninstall, limitations, and sources. Add a row to the matrix in [`docs/guides/README.md`](docs/guides/README.md).
4. **Tests.** Extend `test/cli.test.mjs` if the agent needs special handling. Confirm `node bin/cli.mjs list-agents` and `install -a <id> --dry-run` look right.
5. Update the platform summary in `README.md` (and the install tabs / compatibility table in `site/index.html` if relevant). Don't edit `CHANGELOG.md`: release-please writes it from your commit messages.

## Commits and branches

- Use [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `perf:`, `deps:`, `docs:`, `refactor:`, `revert:`, `test:`, `build:`, `ci:`, `chore:`, `style:`. Optional scopes include `skill`, `templates`, `cli`, `bundle`, `guides`, `agents`, and `site`. Example: `feat(agents): add support for Foo CLI`.
- PRs are **squash-merged**, so the **PR title** becomes the commit on `main`. A CI check enforces a Conventional Commits PR title with a lowercase subject.
- Mark breaking changes with `!` (e.g. `feat!: …`) or a `BREAKING CHANGE:` footer. Renaming an output path or changing frontmatter counts as breaking.
- Branch from `main`. Keep each PR focused on one topic.

## Releasing

Releases are automated with [release-please](https://github.com/googleapis/release-please-action) and follow [Semantic Versioning](https://semver.org/). There are no manual tags, version bumps, or changelog edits.

1. **Merge Conventional Commits to `main`.** `feat` → minor, `fix`/`perf`/`deps` → patch, `!` / `BREAKING CHANGE` → major. `docs`, `refactor`, and `revert` appear in the changelog without bumping on their own. `test`, `build`, `ci`, `chore`, and `style` are hidden.
2. **release-please opens or updates a release PR** (`chore: release X.Y.Z`). It bumps `package.json`, `.release-please-manifest.json`, `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, `.codex-plugin/plugin.json`, `gemini-extension.json`, and `metadata.version` in `skills/start-from-here/SKILL.md`, and prepends the new section to `CHANGELOG.md`. Configuration: [`release-please-config.json`](release-please-config.json).
3. **Merge the release PR.** release-please tags `vX.Y.Z` and creates the GitHub Release. The `publish` job in [`.github/workflows/release.yml`](.github/workflows/release.yml) then validates, tests, and builds; publishes to npm via **trusted publishing** (OIDC, no token, provenance attached automatically); and uploads `start-from-here.zip`, `start-from-here.prompt.md`, `gpt-instructions.md`, `gem-instructions.md`, `start-from-here-knowledge.zip`, and `SHA256SUMS` to the release.

Notes for maintainers:

- PRs created with the default `GITHUB_TOKEN` don't trigger other workflows, so CI won't start on the release PR by itself. Either add a fine-grained PAT as the `RELEASE_PLEASE_TOKEN` secret (contents + pull requests: read/write; the workflow uses it automatically), or close and reopen the release PR to trigger CI.
- To retry a failed publish or re-upload assets for an existing tag, run the **Release** workflow manually (*Run workflow*, tag `vX.Y.Z`). It skips `npm publish` if that version is already on npm.
- Need a specific version? Add an empty commit with a `Release-As: X.Y.Z` footer.

## Pull request checklist

- [ ] `npm run validate`, `npm run build`, and `npm test` pass locally.
- [ ] Frontmatter is unchanged, or still spec-only with description ≤ 200 chars. `SKILL.md` is < 500 lines and is the only `SKILL.md`.
- [ ] Templates stay tech-agnostic and contain no invented facts.
- [ ] Platform facts include official source URLs, and unverified facts are marked `UNVERIFIED`.
- [ ] Guides, README, and the site (`site/`) are updated where relevant. The PR title follows Conventional Commits; `CHANGELOG.md` is generated, so don't edit it.
- [ ] No secrets, tokens, or personal data in code, docs, fixtures, or screenshots.
- [ ] AI-assisted changes were reviewed line by line by a human.

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).
