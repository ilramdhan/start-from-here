# Code Style — {{project_name}}

> **Status:** Draft · **Owner:** {{owner}} · **Last updated:** {{yyyy_mm_dd}} · **Tier:** {{tier}} · **Related:** [ARCHITECTURE](../technical/ARCHITECTURE.md), [TESTING](../technical/TESTING.md), [AI_GUIDELINES](AI_GUIDELINES.md), [GIT_WORKFLOW](GIT_WORKFLOW.md)

<!-- guidance: Purpose: the conventions humans and AI agents follow when writing code here. Derive every rule from the approved stack
(ARCHITECTURE.md) and from REAL config files when they exist (.editorconfig, eslint/biome config, ruff/pyproject, golangci.yml,
rustfmt.toml, .prettierrc, checkstyle, .NET analyzers). Prefer "the tool enforces it" over prose rules. Do not invent tooling that
is not installed: if a tool is proposed but not configured, mark it `> **PROPOSAL:**` and list it as "Not configured" in Verified commands.
Tier notes — Lite: sections 1, 2, 3, 5, 6, 12, 13, 14 only, a few bullets each. Standard: all sections. Enterprise: add rule IDs (CS-01…)
for audit, a static-analysis/SAST gate, license-compliance rules for dependencies, and per-package overrides for monorepos. -->

<!-- guidance: Inputs you MUST read: ARCHITECTURE (stack, project structure), ADRs, SECURITY_ARCHITECTURE (§8 input rules, §12 never-log list),
TESTING (§2 layers, §9 commands), DISCOVERY (TEA-08 conventions, I18N-01). Coverage rules (MANDATORY):
- Every language/runtime in ARCHITECTURE has a §1 row and a §3 formatter + linter row (or PROPOSAL / Not configured).
- §5 has one row per top-level directory in ARCHITECTURE's project structure — identical names.
- §8 "Never log" includes every Restricted field from SECURITY_ARCHITECTURE §1.1.
- §13 lists every check that CI runs (TESTING §8) with a verified command or "Not configured".
- Rules are concrete and checkable ("functions ≤ 50 lines unless justified"), not aspirations ("write clean code").
Self-review: references/governance-guide.md §9. -->

## 1. Languages and versions

| Area | Language / runtime | Version (pinned where) | Notes |
|---|---|---|---|
| {{area}} | {{language}} | {{version}} — `{{version_file}}` | {{notes}} |

<!-- guidance: Examples: "Backend | Go | latest stable at setup — verify; pinned in go.mod toolchain", "Web | TypeScript on Node LTS | verify at setup — .nvmrc + engines",
"ML | Python | verify at setup — .python-version", "Mobile | Kotlin | verify at setup — gradle/libs.versions.toml". Never write a version number from memory (SKILL.md hard rule 9): write "latest stable at setup — verify" or a version the user/repo confirmed. Pin versions in a file, not in prose. -->

## 2. Naming conventions

| Element | Convention | Example |
|---|---|---|
| Files / modules | {{file_naming}} | {{file_example}} |
| Directories / packages | {{dir_naming}} | {{dir_example}} |
| Types / classes / components | {{type_naming}} | {{type_example}} |
| Functions / methods | {{function_naming}} | {{function_example}} |
| Variables / constants | {{variable_naming}} | {{variable_example}} |
| Database tables / columns | {{db_naming}} | {{db_example}} |
| API paths / fields | {{api_naming}} | {{api_example}} |
| Environment variables | `UPPER_SNAKE_CASE`, prefixed `{{env_prefix}}` | `{{env_prefix}}DATABASE_URL` |
| Tests | {{test_naming}} | {{test_example}} |

<!-- guidance: Follow the language's community norm unless there is an approved reason not to (Go: MixedCaps, short package names;
Python: PEP 8 snake_case; JS/TS: camelCase + PascalCase components; Rust: snake_case fns, CamelCase types; Java/Kotlin/C#: PascalCase types).
Use domain vocabulary from the PRD glossary consistently — one name per concept everywhere (code, DB, API, UI). -->

## 3. Formatting and linting

| Concern | Tool | Config file | Enforced in |
|---|---|---|---|
| Formatting | {{formatter}} | `{{formatter_config}}` | {{pre_commit_or_ci}} |
| Linting | {{linter}} | `{{linter_config}}` | {{pre_commit_or_ci}} |
| Editor basics | EditorConfig | `.editorconfig` | editor |

- Formatter output is canonical — never hand-format or argue style in review.
- Lint warnings are errors in CI; suppressions need an inline reason (e.g. `// nolint:xyz — reason`, `# noqa: E501 — reason`).

<!-- guidance: Examples: Prettier/Biome + ESLint (JS/TS), Ruff format + Ruff (Python), gofmt/goimports + golangci-lint (Go),
rustfmt + clippy (Rust), ktlint/detekt (Kotlin), dotnet format + analyzers (C#), SwiftFormat + SwiftLint (Swift). -->

## 4. Types and data contracts

- Type-checking level: {{type_strictness}} <!-- e.g. TS `strict: true`; mypy/pyright strict; Go vet; Rust default -->
- Escape hatches (`any`, `interface{}`, `# type: ignore`, `unsafe`, `!!`) require a justifying comment and reviewer approval.
- Validate and parse external data at trust boundaries into typed models (e.g. Zod, Pydantic, protobuf validation, serde) — never pass raw input inward.
- Shared contracts (API schemas, events) are the source of truth: {{contract_source}} <!-- e.g. OpenAPI spec, .proto files, GraphQL schema -->

## 5. Project structure and boundaries

| Directory | Responsibility | May depend on | Must not depend on |
|---|---|---|---|
| `{{dir}}` | {{responsibility}} | {{allowed_deps}} | {{forbidden_deps}} |

- Business logic lives in {{business_logic_location}}; transport/UI layers stay thin.
- Shared utilities live in {{shared_location}}; reuse before creating new helpers.
- Structure must match [ARCHITECTURE.md](../technical/ARCHITECTURE.md). Enforce boundaries with tooling where possible ({{boundary_tool}}).

<!-- guidance: e.g. dependency-cruiser / eslint-plugin-boundaries (JS), import-linter (Python), Go internal/ packages, ArchUnit (JVM). -->

## 6. Coding rules

- Keep functions small and single-purpose; prefer pure functions for domain logic.
- Follow established repository patterns before introducing new abstractions; no speculative generality.
- No magic numbers/strings: name them as constants or configuration.
- Handle loading, empty, error, and success states explicitly (UI and API).
- Fail fast on programmer errors; handle expected failures gracefully.
- No dead code, commented-out code, or unresolved `TODO` without an issue link (`TODO(#123): …`).
- Configuration comes from environment/config files, never hard-coded per environment.

### 6.1 DOs and DON'Ts
<!-- guidance: Keep rows that fit the stack; add stack-specific rows (e.g. React hooks rules, Go context propagation, Python async). -->
| DO | DON'T |
|---|---|
| Name things after the domain (PRD glossary) | Use generic names (`data`, `info`, `manager`, `utils2`) |
| Keep functions ≤ {{max_function_lines}} lines and ≤ {{max_params}} parameters | Write god functions/classes that mix I/O, rules, and formatting |
| Return early on invalid state | Nest conditionals more than {{max_nesting}} levels |
| Make illegal states unrepresentable (enums, value types) | Pass booleans that switch behavior (`doThing(true, false)`) |
| Inject dependencies (clock, IDs, clients) for testability | Call global singletons or `now()` deep inside domain logic |
| Prefer immutability and pure functions in the domain | Mutate shared state across requests/threads |
| Pass cancellation/timeouts through every I/O call | Make network/DB calls without timeouts |
| Use parameterized queries and the shared validation layer | Concatenate user input into SQL, shell, HTML, or paths |
| Delete unused code (git keeps history) | Comment code out "for later" |
| Write a test that names the behavior | Name tests `test1`, `works`, `should work` |

### 6.2 Example: good vs bad
<!-- guidance: Replace with one short example in the project's primary language. Keep it ≤ 15 lines each. -->
```text
BAD:  function process(d, f) { if (f) { ... 80 lines mixing DB calls, rules, and HTML ... } }
GOOD: shareNote(noteId, recipientEmail, actor) -> validates input -> checks policy.canShare(actor, note)
      -> repository.addShare(...) -> emits NoteShared event -> returns Result<Share, ShareError>
```

## 7. Error handling

- Error contract: {{error_shape}} <!-- e.g. RFC 9457 Problem Details for HTTP; gRPC status + details; typed Result/Either -->
- Never swallow errors silently; wrap with context (`fmt.Errorf("load user: %w", err)`, `raise ... from err`, `cause`).
- Do not leak internals (stack traces, SQL, secrets) to end users; map to safe messages and stable error codes.
- Retries only for idempotent operations, with backoff and limits.

| Situation | Handling | Example |
|---|---|---|
| Invalid user input | Validation error with field details; 4xx / exit code 2 | `{"type":"validation","errors":[{"field":"email"}]}` |
| Not found / not permitted | Same response for both if existence must not leak | 404 |
| Expected business rule violation | Typed domain error mapped at the edge | `ShareLimitExceeded` → 409 |
| Dependency failure | Wrap with context, retry if idempotent, then surface 503 | `fetch rates: timeout after 2s` |
| Programmer error / invariant broken | Fail fast, log at `error` with trace ID, alert | panic/exception → 500 |

## 8. Logging and observability

- Structured logs ({{log_format}}) via {{logging_library}}; levels: `debug` (dev only), `info` (state changes), `warn` (recoverable), `error` (needs attention).
- Every log line carries correlation/request IDs where available.
- **Never log:** passwords, tokens, API keys, full card numbers, government IDs, health data, or other fields listed in [SECURITY_ARCHITECTURE](../technical/SECURITY_ARCHITECTURE.md). Redact at the logger.
- Metrics/traces follow [OPERATIONS.md](../technical/OPERATIONS.md) ({{observability_standard}}, e.g. OpenTelemetry).

## 9. Comments and documentation

- Comments explain **why**, not what. Public APIs carry doc comments ({{doc_comment_style}}, e.g. JSDoc/TSDoc, docstrings, GoDoc, rustdoc, KDoc).
- Update the relevant `docs/` file in the same PR when behavior, contracts, or decisions change.
- Architectural decisions go in an ADR ([docs/decisions/](../decisions/README.md)), not in code comments.

## 10. Dependencies

- Adding, removing, or major-upgrading a dependency requires approval from {{dependency_approver}} and a one-line justification in the PR.
- Prefer the standard library and existing dependencies; evaluate maintenance, security advisories, size, and **license compatibility** (allowed: {{allowed_licenses}}; forbidden: {{forbidden_licenses}}).
- Lockfiles are committed and installs are reproducible ({{lockfile}}, frozen installs in CI).
- Automated update tool: {{dependency_update_tool}} <!-- e.g. Dependabot, Renovate, Not configured -->
- Before proposing a package, verify it exists on the official registry under that exact name, check publisher, download trend, last release, open advisories, and transitive size. AI-suggested package names are verified the same way (typo-squatting / "slopsquatting").
- Version ranges: {{exact pins for apps / compatible ranges for libraries}}; upgrades of majors get their own PR with release notes reviewed.

| Check before adding | Pass criteria |
|---|---|
| Need | Stdlib or an existing dependency cannot do it in ≤ {{n}} lines |
| License | In the allowed list above; compatible with the project license |
| Maintenance | Release within {{12}} months; more than one maintainer or a backing org |
| Security | No unpatched critical/high advisories; scorecard reviewed (if available) |
| Footprint | Bundle/binary size impact acceptable ({{budget}}); few transitive deps |

## 11. Performance, accessibility, and internationalization

- **Performance:** respect budgets in [TRD NFRs](../technical/TRD.md) ({{performance_budget_summary}}); avoid N+1 queries, unbounded loops/queries, and blocking I/O on hot paths; paginate lists.
- **Accessibility (if UI):** semantic elements first, labels for every input, keyboard operable, visible focus, color-contrast per [DESIGN_SYSTEM](../product/DESIGN_SYSTEM.md); target WCAG 2.2 AA (see [ACCESSIBILITY.md](../../ACCESSIBILITY.md)).
- **Internationalization:** no user-facing strings hard-coded outside {{i18n_location}}; format dates, numbers, and currency with locale-aware APIs; store timestamps in UTC; support UTF-8 everywhere. Write "N/A — single locale" if out of scope.

## 12. Review checklist

- [ ] Implements the linked acceptance criteria (`F-xx`) — nothing more.
- [ ] Follows naming, structure, and boundary rules above.
- [ ] Errors handled with context; no sensitive data in logs or responses.
- [ ] Inputs validated at boundaries; authorization checked server-side.
- [ ] Tests cover meaningful changed behavior, including failure paths.
- [ ] No new dependency without approval; lockfile changes are intentional.
- [ ] No credentials, generated artifacts, or unrelated files in the diff.
- [ ] Docs/ADRs updated where behavior or decisions changed.
- [ ] Names follow §2 and the PRD glossary; no new abbreviations.
- [ ] Timeouts, cancellation, and pagination on every new I/O path and list.
- [ ] Migrations are backward compatible (expand/contract) and reviewed by the data owner.
- [ ] UI changes: loading/empty/error/success states and keyboard/screen-reader basics checked.
- [ ] Observability: new paths emit logs/metrics/traces per OPERATIONS; no sensitive fields.
- [ ] Breaking change to a public API/CLI/config is flagged (`!` in commit) and versioned.

## 13. Verified commands

| Check | Command | Status |
|---|---|---|
| Format | `{{format_command}}` | {{verified_or_not_configured}} |
| Format (check only, CI) | `{{format_check_command}}` | {{verified_or_not_configured}} |
| Lint | `{{lint_command}}` | {{verified_or_not_configured}} |
| Type check | `{{typecheck_command}}` | {{verified_or_not_configured}} |
| Pre-commit hooks | `{{precommit_command}}` | {{verified_or_not_configured}} |

<!-- guidance: "Verified" means the command exists in the manifest/Makefile/CI or you ran it successfully. Otherwise write "Not configured".
Never invent commands or claim checks passed without running them. -->

## 14. Git (Lite)
<!-- guidance: Lite only (GIT_WORKFLOW.md is skipped). Delete in Standard/Enterprise. -->
- **Branching:** {{e.g. trunk-based on main; short-lived feature branches}}
- **Commits:** Conventional Commits (`feat:`, `fix:`, `docs:` …)
- **Releases:** {{e.g. tag vX.Y.Z; store builds from tags}}
- **Branch names:** `type/short-description` (e.g. `feat/share-note`, `fix/login-timeout`); merge via PR or fast-forward after checks pass.
- **Never:** force-push `main`, commit secrets or `.env`, or merge with failing checks. Versioning: SemVer; user-visible changes go in CHANGELOG `Unreleased`.

## 15. Testing conventions
<!-- guidance: Short; the strategy lives in TESTING.md. Fill per stack. -->
- Test location: {{e.g. next to source (`*.test.ts`, `*_test.go`) / `tests/` mirror tree}}.
- Naming: `{{e.g. test_<unit>_<condition>_<expected> / "shares note when owner invites registered user"}}`.
- Structure: Arrange–Act–Assert (or Given–When–Then); one behavior per test; no logic (loops/ifs) in tests.
- Doubles: fake external systems at the boundary only; never mock the unit under test or the database in integration tests.
- Determinism: no real time, randomness, or network in unit tests; see [TESTING §5.1](../technical/TESTING.md#51-test-data-management-policy).

## Definition of done (this document)

- [ ] Every rule matches the approved stack and real config files (or is marked PROPOSAL).
- [ ] Commands are verified or "Not configured"; none invented.
- [ ] Structure table matches ARCHITECTURE.md.
- [ ] No `{{placeholders}}` or guidance comments remain.

### Completeness self-check
- [ ] Every language in ARCHITECTURE has version pin, naming, formatter, linter, and type-check rows (or PROPOSAL / Not configured).
- [ ] §5 directory table equals ARCHITECTURE project structure (same names, same boundaries).
- [ ] §8 never-log list covers every Restricted field in SECURITY_ARCHITECTURE §1.1.
- [ ] §10 dependency policy names an approver and allowed/forbidden licenses.
- [ ] §12 review checklist is referenced by GIT_WORKFLOW and AI_GUIDELINES; §13 matches TESTING §8 gates.
- [ ] Every rule is checkable (a reviewer or tool can say pass/fail); no vague advice.
- [ ] Lite only: §14 Git (Lite) is filled; Standard/Enterprise: §14 is removed or one line `N/A — see GIT_WORKFLOW`, and GIT_WORKFLOW exists.
