# Architecture Decision Records

> **Status:** Draft · **Owner:** {{owner}} · **Last updated:** {{yyyy_mm_dd}} · **Tier:** {{tier}} · **Related:** [ARCHITECTURE](../technical/ARCHITECTURE.md), [DISCOVERY](../DISCOVERY.md), [docs index](../README.md)

<!-- guidance: Index of all ADRs. Generate one ADR per major decision made during discovery (e.g. language/framework, database,
hosting, auth approach, monolith vs services, branching model, license). Keep the table sorted by number. Never list an ADR file
that does not exist. Tier notes — Lite: optional; if used, ADR-0001 plus 1–3 key decisions in short form. Standard: ADRs for stack,
data store, hosting, auth. Enterprise: ADRs mandatory for every significant decision; record decision-makers by role. -->

An Architecture Decision Record (ADR) captures one significant decision: its context, the options considered, the outcome, and its consequences. ADRs here use the [MADR](https://adr.github.io/madr/) format.

## Index

| ID | Title | Status | Date | Supersedes / Superseded by |
|---|---|---|---|---|
| [ADR-0001](0001-record-architecture-decisions.md) | Record architecture decisions | Accepted | {{yyyy_mm_dd}} | — |
| [ADR-{{adr_number}}]({{adr_filename}}) | {{adr_title}} | {{adr_status}} | {{adr_date}} | {{adr_relationship}} |

## When to write an ADR

Write one when a decision:

- Is hard or expensive to reverse (language, framework, database, cloud/hosting, tenancy model, API style, auth provider).
- Affects structure, non-functional characteristics (`NFR-xx`), security, or compliance.
- Affects more than one team/component, or the public interface.
- Chooses between credible alternatives, or deliberately deviates from a standard/convention.
- Would make a future contributor ask "why did we do it this way?"

Do **not** write one for routine choices covered by CODE_STYLE.md or reversible implementation details.

## How to write an ADR

1. Copy the most recent ADR (or the MADR template at <https://adr.github.io/madr/>) to `NNNN-kebab-case-title.md` using the next free number (`0002`, `0003`, …).
2. Fill it with status **Proposed**; link the driving requirements (`F-xx`, `NFR-xx`, `Q-xx`).
3. Open a PR; decision-makers review. On approval set status **Accepted** (or **Rejected** — keep rejected ADRs; they document options already evaluated).
4. Add a row to the index above and update affected docs (ARCHITECTURE, TRD, CODE_STYLE, etc.).
5. Never edit the decision of an Accepted ADR. To change it, write a new ADR and mark the old one **Superseded by ADR-NNNN**.

## Statuses

`Proposed` → `Accepted` | `Rejected` → later `Deprecated` or `Superseded by ADR-NNNN`.

## Definition of done (this document)

- [ ] Every ADR file in this folder appears in the index with correct status; no dead links.
- [ ] Every major decision in DISCOVERY.md / ARCHITECTURE.md has an ADR (Standard/Enterprise).
- [ ] No `{{placeholders}}` or guidance comments remain.
