# ADR-{{adr_number}}: {{short_title_of_solved_problem_and_solution}}

> **Status:** {{proposed_accepted_rejected_deprecated_superseded}} · **Owner:** {{owner}} · **Last updated:** {{yyyy_mm_dd}} · **Tier:** {{tier}} · **Related:** [ADR index](README.md), {{related_docs_and_ids}}

- **Date:** {{yyyy_mm_dd}}
- **Decision-makers:** {{decision_makers}}
- **Consulted:** {{consulted}} <!-- subject-matter experts, two-way communication -->
- **Informed:** {{informed}} <!-- kept up to date, one-way communication -->
- **Supersedes / Superseded by:** {{adr_links_or_none}}

<!-- guidance: Format based on MADR 4.0.0 (https://adr.github.io/madr/). MADR natively uses optional YAML front matter
(status, date, decision-makers, consulted, informed); this project uses the visible status blockquote + metadata list instead
so status renders on GitHub and matches all other docs. Copy this file to `NNNN-kebab-case-title.md` (next free 4-digit number),
fill it, and add a row to README.md. ADRs are immutable once Accepted: to change a decision, write a NEW ADR that supersedes it
and set the old one's status to "Superseded by ADR-NNNN".
Status values: Proposed → Accepted | Rejected; later Deprecated or Superseded by ADR-NNNN.
Tier notes — Lite: Context, Considered Options (one line each), Decision Outcome, Consequences. Standard: all sections.
Enterprise: all sections; Confirmation is mandatory; list decision-makers by role; link risks (R-xx) and compliance controls. -->

## Context and Problem Statement

{{context_and_problem}}

<!-- guidance: 2–4 sentences or a question. Link the requirement that forces the decision (F-xx, NFR-xx, Q-xx) and any constraints. -->

## Decision Drivers

- {{driver_1}} <!-- e.g. NFR-03 p95 latency < 200 ms; team expertise; budget; compliance requirement; time to market -->
- {{driver_2}}

## Considered Options

- {{option_1}}
- {{option_2}}
- {{option_3}}

## Decision Outcome

Chosen option: "{{chosen_option}}", because {{justification}}. <!-- e.g. "only option that meets driver X", "best trade-off on drivers Y and Z" -->

### Consequences

- Good, because {{positive_consequence}}
- Bad, because {{negative_consequence}}
- Neutral, because {{neutral_consequence}} <!-- optional -->

### Confirmation

{{how_compliance_with_this_decision_is_confirmed}}

<!-- guidance: How will we know the decision is implemented/followed? e.g. architecture test, lint rule, code review checklist item,
design review, load test result. Never claim a confirmation has happened if it has not. -->

## Pros and Cons of the Options

### {{option_1}}

{{option_1_description_or_link}}

- Good, because {{argument}}
- Neutral, because {{argument}}
- Bad, because {{argument}}

### {{option_2}}

- Good, because {{argument}}
- Bad, because {{argument}}

### {{option_3}}

- Good, because {{argument}}
- Bad, because {{argument}}

## More Information

{{additional_evidence_links_follow_ups_and_revisit_conditions}}

<!-- guidance: e.g. "Revisit when monthly active users exceed 100k." Link spikes, benchmarks, vendor docs. -->

## Definition of done (this ADR)

- [ ] Problem linked to requirement IDs; at least two real options considered (or rationale for one).
- [ ] Outcome and consequences stated honestly, including downsides.
- [ ] Confirmation method defined.
- [ ] Listed in [README.md](README.md) index; affected docs (ARCHITECTURE, TRD, etc.) updated.
- [ ] No `{{placeholders}}` or guidance comments remain.
