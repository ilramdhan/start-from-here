# start-from-here handover

> Session-mode handover file. Overwrite it at the END of every session (and immediately when you sense your context is running low). The next session reads ONLY this file + STATE.md + the lean reading list below — so everything it needs to stay consistent must be here. Keep it ≤ ~150 lines. No secrets. Replace every `{{…}}`; delete rows that do not apply.

## 1. Session
- session: {{n}} · date: {{YYYY-MM-DD}} · model/tool: {{e.g. Llama 3.1 8B in LM Studio, 32k}}
- tier: {{Lite | Standard | Enterprise}} · output_mode: {{filesystem | chat-only}} · language_docs: {{lang}} · experience: {{level}}
- work package done: {{WPn — name}} · status: {{complete | partial — stopped at <doc/section>}}
- next work package: {{WPn — name}}

## 2. Files created or changed this session
| Path | Status | Coverage line |
|---|---|---|
| {{docs/technical/DATABASE.md}} | {{Draft / In review / Approved / partial (§1–§8 done)}} | {{e.g. 11 entities, 34 indexes, 1 ERD, 2 TBD}} |

## 3. Key decisions so far (≤15 bullets, newest last)
- {{D-01: stack = … — decided by user — ADR-0002}}

## 4. ID registry snapshot (copy exactly; never renumber)
- **Product name:** {{name}}
- **Personas:** {{P-01 Name (role) · P-02 …}}
- **Roles (authZ):** {{owner, admin, member, guest}}
- **Features:** {{F-01 Title (Must) · F-02 Title (Should) · …}}
- **Journeys:** {{J-01 Title · …}}
- **NFRs:** {{NFR-01 p95 API < 300 ms @ 50 rps · NFR-02 99.5% monthly · …}}
- **Screens/commands:** {{S-01 Login · S-02 Dashboard · … or "n/a"}}
- **Entities:** {{users, organizations, memberships, projects, audit_logs, … or "not yet defined"}}
- **API operations:** {{OP-01 POST /v1/projects · … or "not yet defined"}}
- **ADRs:** {{ADR-0001 Record decisions · ADR-0002 Use PostgreSQL · …}}
- **Trust boundaries / threats:** {{TB-1 browser↔API · … or "not yet defined"}}
- **Milestones:** {{M0 Setup · M1 … or "not yet defined"}}
- **Stack (one line):** {{e.g. Next.js + PostgreSQL (managed) + Vercel — versions: verify at setup}}

## 5. Open TBD items and questions
| ID | Question / TBD | Owner | Blocking? | Where |
|---|---|---|---|---|
| {{Q-03}} | {{retention period for invoices}} | {{user}} | {{yes}} | {{DATABASE §12}} |

## 6. Quality notes for the next session
- {{watch out: DATABASE must include audit_logs because NFR-07 requires an admin audit trail}}
- {{watch out: F-04 has only 2 AC in PRD — add a negative case when writing TESTING}}

## 7. Next work package and lean reading list
- **Do:** {{WP4 — DATABASE + API}}
- **Read (in this order, nothing else):**
  1. `docs/.start-from-here/HANDOVER.md` (this file) and `docs/.start-from-here/STATE.md`
  2. {{docs/DISCOVERY.md §11.4 entity seeds}}
  3. {{docs/product/PRD.md §4 personas/roles, §7 features}}
  4. {{docs/technical/ARCHITECTURE.md §4 stack table, §5 boundaries}}
  5. {{skill: references/data-modeling-guide.md §1–§5 + §13}}
  6. {{skill: templates docs/technical/DATABASE.md, docs/technical/API.md}}
- **Produce:** {{docs/technical/DATABASE.md, docs/technical/API.md}} · then overwrite this file.

## 8. Next session prompt (copy-paste into a NEW session)

```text
Use the start-from-here skill. Resume session mode: read docs/.start-from-here/HANDOVER.md
and docs/.start-from-here/STATE.md first, then do {{WPn}} using only the lean reading list in
HANDOVER §7. Keep every ID from HANDOVER §4 exactly. Write HANDOVER.md again before you stop.
```

Chat-only: paste this prompt together with the saved HANDOVER.md and STATE.md blocks (or attach them) in a new chat, plus any upstream doc listed in §7.
