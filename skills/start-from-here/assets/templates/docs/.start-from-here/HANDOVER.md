# start-from-here handover

> Session handover file. Overwrite it at the END of every session-mode session (and immediately when you sense your context is running low, in any mode). The next session reads ONLY this file + DIGEST.md + STATE.md + the lean reading list below. Names, IDs and decisions live in `DIGEST.md`; do not copy them here. Keep it ≤ ~100 lines. No secrets. Replace every `{{…}}`; delete rows that do not apply.

## 1. Session
- session: {{n}} · date: {{YYYY-MM-DD}} · model/tool: {{e.g. Llama 3.1 8B in LM Studio, 32k}}
- tier: {{Lite | Standard | Enterprise}} · output_mode: {{filesystem | chat-only}} · language_docs: {{lang}} · experience: {{level}}
- work package done: {{WPn — name}} · status: {{complete | partial — stopped at <doc/section>}}
- next work package: {{WPn — name}}

## 2. Files created or changed this session
| Path | Status | Coverage line |
|---|---|---|
| {{docs/technical/DATABASE.md}} | {{Draft / In review / Approved / partial (§1–§8 done)}} | {{e.g. 11 entities, 34 indexes, 1 ERD, 2 TBD}} |

## 3. Decisions made this session
- {{D-07, ADR-0004 — IDs only; the one-line text is in DIGEST.md §4 (write "none" if none)}}

## 4. ID registry
- See `docs/.start-from-here/DIGEST.md` §2–§3 (canonical names and every ID). DIGEST was patched after: {{last doc path}}.
- New IDs this session: {{e.g. OP-01…OP-14, TB-1…TB-5 — ranges only}}

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
  1. `docs/.start-from-here/HANDOVER.md` (this file), `docs/.start-from-here/DIGEST.md` and `docs/.start-from-here/STATE.md`
  2. {{docs/DISCOVERY.md §11.4 entity seeds}}
  3. {{docs/product/PRD.md §4 personas/roles, §7 features}}
  4. {{docs/technical/ARCHITECTURE.md §4 stack table, §5 boundaries}}
  5. {{skill: references/data-modeling-guide.md §1–§5 + §13}}
  6. {{skill: templates docs/technical/DATABASE.md, docs/technical/API.md}}
- **Produce:** {{docs/technical/DATABASE.md, docs/technical/API.md}} · patch DIGEST after each doc · then overwrite this file.

## 8. Next session prompt (copy-paste into a NEW session)

```text
Use the start-from-here skill. Resume session mode: read docs/.start-from-here/HANDOVER.md,
DIGEST.md and STATE.md first, then do {{WPn}} using only the lean reading list in HANDOVER §7.
Keep every name and ID from DIGEST exactly. Update DIGEST and write HANDOVER.md again before you stop.
```

Chat-only: paste this prompt together with the saved HANDOVER.md, DIGEST.md and STATE.md blocks (or attach them) in a new chat, plus any upstream section listed in §7.
