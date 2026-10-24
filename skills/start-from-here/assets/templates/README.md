<!-- guidance: Root README — the front door for users and contributors. GitHub renders it on the repo home page.
Choose the variant that matches the project and delete the rest of the guidance:
- APP / SaaS / mobile / desktop: lead with what it does + screenshot/demo; Quick start = run locally; Usage = main user flows; link Terms/Privacy.
- LIBRARY / SDK: lead with install one-liner + minimal code example; document supported runtimes/versions; link API reference; SemVer policy.
- CLI: lead with install (package manager / binary) + `tool --help` example output; command table; shell completion; config file location.
- API / service: lead with what it serves; auth; base URLs per environment; link docs/technical/API.md.
Only include badges for things that exist (CI workflow, published package, license). Never invent features, metrics, users, benchmarks,
or compliance claims. Commands must be verified (same as AGENTS.md) or "Not configured yet".
Status header: kept while Draft for consistency with other docs; once Approved, the status may be tracked only in docs/README.md
so the public README stays clean — follow the team's choice.
Tier notes — Lite: Description, Quick start, Usage, Docs, License. Standard: all relevant sections. Enterprise/internal: add Ownership,
Support/escalation, Environments, Compliance notes (link COMPLIANCE.md, no unverified claims). -->

# {{project_name}}

> **Status:** Draft · **Owner:** {{owner}} · **Last updated:** {{yyyy_mm_dd}} · **Tier:** {{tier}} · **Related:** [docs index](docs/README.md), [CONTRIBUTING](CONTRIBUTING.md) <!-- guidance: drop CONTRIBUTING / CODE_OF_CONDUCT links below if those files are not generated. -->

<!-- guidance: Badges (delete any that do not exist yet). Examples:
[![CI](https://github.com/{{github_owner}}/{{repo_name}}/actions/workflows/{{ci_workflow_file}}/badge.svg)](https://github.com/{{github_owner}}/{{repo_name}}/actions/workflows/{{ci_workflow_file}})
[![License: {{license_spdx_id}}](https://img.shields.io/badge/license-{{license_spdx_id}}-blue.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/{{package_name}})](https://www.npmjs.com/package/{{package_name}})  ← or PyPI / crates.io / pkg.go.dev / Maven Central
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/{{github_owner}}/{{repo_name}}/badge)](https://securityscorecards.dev/viewer/?uri=github.com/{{github_owner}}/{{repo_name}}) -->

{{one_sentence_value_proposition}}

{{short_description_paragraph}} <!-- who it is for, what problem it solves, why it is different. From PRD vision. -->

## Features

- **{{feature_name}}** — {{feature_benefit}} <!-- map to F-xx in PRD; only shipped or clearly-marked planned features -->
- **{{feature_name}}** — {{feature_benefit}}

## Screenshots / demo

<!-- guidance: Delete for libraries without UI. Add alt text to every image. Use docs/assets/ for images. -->
![{{screenshot_alt_text}}](docs/assets/{{screenshot_file}})

Live demo: {{demo_url_or_delete}}

## Quick start

```sh
{{quick_start_commands}}
```

<!-- guidance: Fewest steps from zero to "it works". Examples: `npx create-…`, `pip install pkg`, `go install …@latest`,
`brew install tool`, `docker compose up`, or clone + install + run. -->

## Prerequisites

- {{runtime_and_version}} <!-- e.g. "Node.js LTS (version: verify at setup)" — never a version number from memory; use one confirmed in the repo (.nvmrc, go.mod, pyproject) or by the user -->
- {{other_prerequisites}} <!-- e.g. Docker, PostgreSQL (verify version), an API key for X (name only) -->

## Installation

```sh
{{install_commands}}
```

## Usage

{{usage_description}}

```{{usage_code_language}}
{{usage_example}}
```

<!-- guidance: Library → minimal runnable code sample. CLI → commands with example output. App → main flows in steps. -->

## Configuration

| Variable / option | Description | Required | Default |
|---|---|---|---|
| `{{env_var_name}}` | {{description}} | {{yes_no}} | {{default_value}} |

Copy `{{env_example_file}}` to `{{env_file}}` and fill in values. Never commit secrets.

## Architecture

{{one_paragraph_architecture_summary}} See [docs/technical/ARCHITECTURE.md](docs/technical/ARCHITECTURE.md).

## Documentation

| Topic | Link |
|---|---|
| Documentation index | [docs/README.md](docs/README.md) |
| Product requirements | [docs/product/PRD.md](docs/product/PRD.md) |
| Architecture & decisions | [ARCHITECTURE](docs/technical/ARCHITECTURE.md) · [ADRs](docs/decisions/README.md) |
| API | [docs/technical/API.md](docs/technical/API.md) |
| Development guide | [CODE_STYLE](docs/engineering/CODE_STYLE.md) · [TESTING](docs/technical/TESTING.md) · [GIT_WORKFLOW](docs/engineering/GIT_WORKFLOW.md) |
| AI agents | [AGENTS.md](AGENTS.md) |

<!-- guidance: Delete rows for docs that were not generated. -->

## Roadmap

{{roadmap_summary}} <!-- 3–5 bullets or link to IMPLEMENTATION_PLAN / project board / milestones. No promised dates unless approved. -->

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) and our [Code of Conduct](CODE_OF_CONDUCT.md). <!-- guidance: private repo: replace with one internal-contribution line; drop links to files not generated. -->

## Security

Please do **not** report security vulnerabilities through public issues. See [SECURITY.md](SECURITY.md).

## Support

See [SUPPORT.md](SUPPORT.md). <!-- or a one-line support channel -->

## License

{{license_statement}} <!-- e.g. "Licensed under the MIT License — see [LICENSE](LICENSE)." / "Copyright © {{year}} {{copyright_holder}}. All rights reserved." -->

## Acknowledgments

- {{acknowledgment}} <!-- contributors, inspirations, key dependencies, funders. Delete if none. -->

<!-- guidance: Definition of done (remove from output):
- [ ] Variant (app/library/CLI/API) chosen; irrelevant sections removed.
- [ ] Every command verified or marked "Not configured yet"; every badge points to something real.
- [ ] Features match PRD; no invented metrics or compliance claims.
- [ ] All links resolve; no placeholders or guidance comments remain. -->
