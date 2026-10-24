# Changelog

<!-- guidance: Format: Keep a Changelog 1.1.0 (https://keepachangelog.com/en/1.1.0/) + SemVer 2.0.0.
No status blockquote here: this file's format is a published convention. Tracking metadata — Owner: {{owner}} · Tier: {{tier}} (S E).
Rules: written for humans (user-facing impact, not commit dumps); newest version first; ISO 8601 dates (YYYY-MM-DD);
group changes under: Added, Changed, Deprecated, Removed, Fixed, Security (omit empty groups); keep an `Unreleased` section at top;
mark breaking changes clearly (e.g. **BREAKING:** prefix); yanked releases as `## [1.2.3] - 2026-01-01 [YANKED]`.
For a brand-new project, generate only the header + Unreleased with "Initial project documentation" — never invent past releases.
Release tools (release-please, semantic-release, changesets, git-cliff) can generate entries from Conventional Commits; humans still edit for clarity.
Tier notes — Lite: optional (GitHub Releases may suffice). Standard/Enterprise: required; link security fixes to advisories (GHSA/CVE IDs).
Remove guidance comments in output. -->

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- {{change_description}} <!-- e.g. Initial project documentation (PRD, architecture, engineering guidelines). -->

<!-- guidance: Example of a released version (copy pattern when releasing; delete this block in output):
## [1.1.0] - 2026-11-02

### Added
- Passkey sign-in for web users (F-07). (#142)

### Changed
- **BREAKING:** `GET /v1/items` now paginates by cursor; `page` param removed. (#150)

### Deprecated
- `legacy_token` config key; will be removed in 2.0.0.

### Fixed
- Export no longer times out for accounts with >10k records. (#147)

### Security
- Upgrade `xyz` to 4.2.1 to address GHSA-xxxx-xxxx-xxxx.
-->

[unreleased]: https://github.com/{{github_owner}}/{{repo_name}}/compare/{{latest_tag_or_initial_commit}}...HEAD
