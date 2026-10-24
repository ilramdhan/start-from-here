# ADR-0001: Record architecture decisions

> **Status:** Accepted · **Owner:** {{owner}} · **Last updated:** {{yyyy_mm_dd}} · **Tier:** {{tier}} · **Related:** [ADR index](README.md), [ARCHITECTURE](../technical/ARCHITECTURE.md), [GIT_WORKFLOW](../engineering/GIT_WORKFLOW.md)

- **Date:** {{yyyy_mm_dd}}
- **Decision-makers:** {{decision_makers}}
- **Consulted:** {{consulted}}
- **Informed:** {{informed}}
- **Supersedes / Superseded by:** none

<!-- guidance: This ADR is generated nearly as-is for every project that keeps ADRs. Set status to "Accepted" only after the
user approves it during the review phase; until then use "Proposed". Replace placeholders; keep the reasoning. -->

## Context and Problem Statement

{{project_name}} will make significant decisions about architecture, technology, data, security, and process. Without a record,
the reasons behind those decisions are lost, new contributors (human or AI) re-open settled questions, and code drifts from intent.
How should we capture significant decisions so they are discoverable, reviewable, and durable?

## Decision Drivers

- Decisions must be understandable later by people and AI agents who were not present.
- Lightweight enough that the team actually writes them.
- Version-controlled next to the code and reviewed through pull requests.

## Considered Options

- Architecture Decision Records in Markdown using MADR, stored in `docs/decisions/`
- Wiki or external document tool
- No formal record (rely on PR descriptions and chat)

## Decision Outcome

Chosen option: "Architecture Decision Records in Markdown using MADR, stored in `docs/decisions/`", because it keeps decisions
versioned with the code, reviewable in PRs, readable by AI agents through AGENTS.md, and the format is well known and lightweight.

### Consequences

- Good, because the rationale for decisions is preserved and linkable by ID (`ADR-NNNN`).
- Good, because AI agents can load relevant ADRs as authoritative context.
- Bad, because writing ADRs takes time; we limit them to significant decisions (see [README.md](README.md#when-to-write-an-adr)).
- Neutral, because accepted ADRs are immutable; changes require a superseding ADR.

### Confirmation

Pull requests that introduce a significant architectural change must link an ADR; reviewers check this using the PR template.

## More Information

- MADR: <https://adr.github.io/madr/>
- Michael Nygard, "Documenting Architecture Decisions" (2011): <https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions>
- Template: copy the structure of any existing ADR in this folder, or the MADR template at <https://adr.github.io/madr/>.
