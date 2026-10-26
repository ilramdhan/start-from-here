// Tests for skills/start-from-here/scripts/check-docs.mjs — ID cross-references (check 12) and blocking TBDs (check 13).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SCRIPT = path.join(ROOT, 'skills', 'start-from-here', 'scripts', 'check-docs.mjs');
const HEADER = '> **Status:** Draft · **Owner:** Jane Doe · **Last updated:** 2026-10-25 · **Tier:** Lite';

// A small, consistent Lite doc set. Each test copies it and changes one thing.
const VALID = {
  'docs/product/PRD.md': `# PRD — Demo

${HEADER}

## 4. Personas
| ID | Persona | Role |
| --- | --- | --- |
| P-01 | Writer | Member |

## 7. Features
<!-- e.g. F-99 in an HTML comment is ignored -->
| ID | Feature | Priority | Stories |
| --- | --- | --- | --- |
| F-01 | Create note | Must | US-01 |
| F-02 | Share note | Could | — |

| ID | Story | Persona | Feature |
| --- | --- | --- | --- |
| US-01 | As P-01 I want to create a note. | P-01 | F-01 |

#### F-01 — Create note
- **AC-01.1 (happy)** Given a member, when they save, then the note is stored.
- **AC-01.2 (negative)** Given an empty title, when they save, then "Title is required" shows.

Quoted inline code is ignored: \`see F-77 here\`; a bare backticked ID is a reference: \`US-01\`.

\`\`\`text
F-88 AC-09.9 NFR-99
\`\`\`

## 15. Open questions
| ID | Question | Owner |
| --- | --- | --- |
| Q-01 | Which region hosts data? | CTO |
`,
  'docs/technical/ARCHITECTURE.md': `# Architecture — Demo

${HEADER}

Drivers: NFR-01 for F-01 ([PRD](../product/PRD.md)). Decision: ADR-0001.

## 14.2 NFRs
| ID | Category | Requirement | Measured by |
| --- | --- | --- | --- |
| NFR-01 | Performance | p95 < 300 ms | PERF-01 |
`,
  'docs/technical/TESTING.md': `# Testing — Demo

${HEADER}

| Test ID | Covers | Scenario | Status |
| --- | --- | --- | --- |
| AT-01 | F-01 / AC-01.1–AC-01.2 | Create note | Not run |
| PERF-01 | NFR-01 | Load test | Not run |
`,
  'docs/technical/IMPLEMENTATION_PLAN.md': `# Implementation plan — Demo

${HEADER}

| ID | Milestone | Goal |
| --- | --- | --- |
| M0 | Foundations | Repo ready |
| M1 | Data | Schema |

| ID | Milestone | Task | Acceptance | Links |
| --- | --- | --- | --- | --- |
| T-01 | M0 | Init repo | Build passes | infra |
| T-02 | M1 | Create note | AT-01 | F-01 |

| Gate | Do not start | Until |
| --- | --- | --- |
| G0 | M1 | CI green; Q-01 answered |
`,
  'docs/decisions/0001-record-architecture-decisions.md': `# ADR-0001: Record architecture decisions

> **Status:** Accepted · **Owner:** Jane Doe · **Last updated:** 2026-10-25 · **Tier:** Lite
`,
};

function project(overrides = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sfh-ids-'));
  for (const [rel, text] of Object.entries({ ...VALID, ...overrides })) {
    if (text == null) continue;
    fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
    fs.writeFileSync(path.join(dir, rel), text);
  }
  return dir;
}

function check(dir) {
  const r = spawnSync(process.execPath, [SCRIPT, dir, '--json'], { encoding: 'utf8' });
  const j = JSON.parse(r.stdout);
  return { code: r.status, j, ids: j.findings.filter((f) => f.check === 'ids'), tbd: j.findings.filter((f) => f.check === 'tbd') };
}

const append = (rel, text) => VALID[rel] + text;

test('ids: a consistent doc set has no ID findings and exits 0', () => {
  const r = check(project());
  assert.deepEqual(r.ids, []);
  assert.equal(r.j.summary.errors, 0, JSON.stringify(r.j.findings.filter((f) => f.severity === 'error')));
  assert.equal(r.code, 0);
});

test('ids: reference to an undefined ID is an error with file and line; guidance comments are ignored', () => {
  const r = check(project({
    'docs/technical/TESTING.md': append('docs/technical/TESTING.md', '| AT-02 | F-07 / NFR-09 | Ghost | Not run |\n<!-- guidance: map F-98 here\nand F-97 -->\n'),
  }));
  assert.ok(!r.ids.some((f) => /F-9[78]/.test(f.message)), 'IDs inside guidance comments are ignored');
  const msgs = r.ids.map((f) => `${f.severity} ${f.file}:${f.line} ${f.message}`);
  assert.ok(msgs.some((m) => /^error docs\/technical\/TESTING\.md:\d+ F-07 is referenced but never defined \(expected in docs\/product\/PRD\.md\)/.test(m)), msgs.join('\n'));
  assert.ok(msgs.some((m) => /NFR-09 is referenced but never defined/.test(m)), msgs.join('\n'));
  assert.equal(r.code, 1);
});

test('ids: duplicate definition in one table is an error; restating in another doc is not', () => {
  const r = check(project({
    'docs/product/PRD.md': VALID['docs/product/PRD.md'].replace('| F-02 | Share note | Could | — |', '| F-02 | Share note | Could | — |\n| F-01 | Duplicate | Must | — |'),
  }));
  const dup = r.ids.filter((f) => /defined twice/.test(f.message));
  assert.equal(dup.length, 1, JSON.stringify(r.ids));
  assert.equal(dup[0].severity, 'error');
  assert.match(dup[0].message, /^F-01 is defined twice \(first at line \d+\)/);
  assert.equal(r.code, 1);
});

test('ids: two ADR files with the same number are a duplicate', () => {
  const r = check(project({
    'docs/decisions/0001-use-postgres.md': VALID['docs/decisions/0001-record-architecture-decisions.md'].replace('Record architecture decisions', 'Use PostgreSQL'),
  }));
  assert.ok(r.ids.some((f) => f.severity === 'error' && /ADR-0001 is defined twice/.test(f.message)), JSON.stringify(r.ids));
});

test('ids: Must feature and its AC without downstream coverage are warnings; Could features are not required', () => {
  const r = check(project({
    'docs/technical/TESTING.md': VALID['docs/technical/TESTING.md'].replace('| AT-01 | F-01 / AC-01.1–AC-01.2 | Create note | Not run |\n', ''),
    'docs/technical/IMPLEMENTATION_PLAN.md': VALID['docs/technical/IMPLEMENTATION_PLAN.md'].replace('| T-02 | M1 | Create note | AT-01 | F-01 |\n', ''),
  }));
  const w = r.ids.filter((f) => f.severity === 'warning').map((f) => f.message);
  assert.ok(w.some((m) => /^F-01 \(Must\) is not referenced in docs\/technical\/TESTING\.md/.test(m)), w.join('\n'));
  assert.ok(w.some((m) => /^F-01 \(Must\) is not referenced in docs\/technical\/IMPLEMENTATION_PLAN\.md/.test(m)), w.join('\n'));
  assert.ok(w.some((m) => /^AC-01\.2 \(Must feature F-01\) has no row/.test(m)), w.join('\n'));
  assert.ok(!w.some((m) => /F-02/.test(m)), 'Could feature F-02 must not be flagged');
  assert.ok(!r.ids.some((f) => f.severity === 'error'), JSON.stringify(r.ids));
});

test('ids: NFR without a test or monitor is a warning', () => {
  const r = check(project({
    'docs/technical/TESTING.md': VALID['docs/technical/TESTING.md'].replace('| PERF-01 | NFR-01 | Load test | Not run |\n', ''),
  }));
  assert.ok(r.ids.some((f) => f.severity === 'warning' && /^NFR-01 has no test or monitor/.test(f.message)), JSON.stringify(r.ids));
});

test('ids: references whose defining doc is not generated are one warning per prefix, not errors', () => {
  const r = check(project({ 'docs/technical/TESTING.md': null }));
  const at = r.ids.filter((f) => /^AT-xx IDs are referenced/.test(f.message));
  assert.equal(at.length, 1, JSON.stringify(r.ids));
  assert.equal(at[0].severity, 'warning');
  assert.ok(!r.ids.some((f) => f.severity === 'error'), JSON.stringify(r.ids));
});

test('tbd: [TBD-BLOCKING] needs a Q-xx; it is counted separately from [TBD]', () => {
  const r = check(project({
    'docs/technical/ARCHITECTURE.md': append('docs/technical/ARCHITECTURE.md',
      '\nRegion: [TBD-BLOCKING: Which region hosts EU data? — CTO — Q-01]\nQueue: [TBD-BLOCKING: Which queue? — CTO]\nQuoted: `[TBD-BLOCKING: example]`\n'),
  }));
  assert.equal(r.tbd.length, 1, JSON.stringify(r.tbd));
  assert.equal(r.tbd[0].severity, 'error');
  assert.match(r.tbd[0].message, /without a Q-xx/);
  assert.equal(r.j.summary.tbdBlocking, 2);
  assert.ok(r.j.summary.tbd >= 2);
  assert.equal(r.code, 1);
});

test('text report groups ID findings and shows the blocking TBD count', () => {
  const dir = project({
    'docs/technical/TESTING.md': append('docs/technical/TESTING.md', '| AT-02 | F-07 | Ghost | Not run |\n'),
  });
  const r = spawnSync(process.execPath, [SCRIPT, dir], { encoding: 'utf8' });
  assert.match(r.stdout, /ID cross-references:\n {2}- docs\/technical\/TESTING\.md:\d+ — F-07 is referenced but never defined/);
  assert.match(r.stdout, /Blocking TBD markers|OPEN \[TBD\]/);
  assert.match(r.stdout, /OPEN \[TBD\] ITEMS \(\d+, 0 blocking\)/);
  assert.equal(r.status, 1);
});

// ---------------------------------------------------------------------------
// Check 14: SECURITY_ARCHITECTURE §3 threat table
// ---------------------------------------------------------------------------
const THEAD = '| ID | TB | Component | STRIDE | Threat | L | I | Risk | Control(s) | Status | Test | Risk ID |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n';
const tRow = (n, tb, l, extra = {}) => {
  const c = { threat: 'Attacker does X', risk: 'Low', status: 'Planned', test: 'SEC-01', riskId: '—', ...extra };
  return `| TH-${n} | ${tb} | app | ${l} | ${c.threat} | L | L | ${c.risk} | control | ${c.status} | ${c.test} | ${c.riskId} |\n`;
};
const L6 = ['S', 'T', 'R', 'I', 'D', 'E'];
const fullRows = (tb, start, extra) => L6.map((l, k) => tRow(String(start + k).padStart(2, '0'), tb, l, extra)).join('');
function secDoc(rows, header = HEADER) {
  return `# Security architecture — Demo

${header}

## 2. Trust boundaries
\`\`\`
| TB-9 | in a code fence only |
\`\`\`
| TB | Crossing |
| --- | --- |
| TB-1 | Client to app |
| TB-2 | App to db |

## 3. Threat model (STRIDE)
${THEAD}${rows}
\`\`\`
| TH-99 | TB-1 | x | S | fenced | | | | | Bogus | | |
\`\`\`
`;
}
const sec = (rows, header) => check(project({
  'docs/technical/SECURITY_ARCHITECTURE.md': secDoc(rows, header),
  'docs/technical/TESTING.md': append('docs/technical/TESTING.md', '| SEC-01 | TH-01 | Authz test | Not run |\n'),
}));
const threats = (r) => r.j.findings.filter((f) => f.check === 'threats');

test('threats: a full TB x STRIDE table with tests passes silently', () => {
  const na = L6.map((l, k) => `| TH-${k + 7} | TB-2 | db | ${l} | N/A — no actor here | — | — | — | — | — | — | — |\n`).join('');
  const r = sec(fullRows('TB-1', 1) + na);
  assert.deepEqual(threats(r), [], JSON.stringify(threats(r)));
  assert.equal(r.code, 0);
});

test('threats: missing STRIDE pair is one warning per TB', () => {
  const r = sec(fullRows('TB-1', 1).replace(/^\| TH-03.*\n/m, '').replace(/^\| TH-04.*\n/m, '') + fullRows('TB-2', 7), HEADER.replace('Lite', 'Standard'));
  const t = threats(r);
  assert.equal(t.length, 1);
  assert.equal(t[0].severity, 'warning');
  assert.match(t[0].message, /TB-1 has no §3 row for STRIDE R, I/);
  assert.equal(r.code, 0);
});

test('threats: Lite tier only needs each letter once across the table', () => {
  const rows = L6.map((l, k) => tRow(`0${k + 1}`, 'TB-1', l)).join('');
  assert.deepEqual(threats(sec(rows)), []);
  const std = sec(rows, HEADER.replace('Lite', 'Standard'));
  assert.match(threats(std)[0].message, /TB-2 has no §3 row for STRIDE S, T, R, I, D, E/);
  const missing = sec(rows.replace(/^\| TH-06.*\n/m, ''));
  assert.match(threats(missing)[0].message, /Lite tier: STRIDE letter E/);
});

test('threats: test, status, residual-risk and question rules', () => {
  const rows = fullRows('TB-1', 1) + fullRows('TB-2', 7)
    + tRow('13', 'TB-1', 'S', { test: '' })
    + tRow('14', 'TB-1', 'T', { test: 'N/A — manual review' })
    + tRow('15', 'TB-1', 'S', { status: 'Accepted risk', risk: 'High', test: '—' })
    + tRow('16', 'TB-1', 'S', { status: 'Accepted risk', risk: 'High', test: '—', riskId: 'R-01' })
    + tRow('17', 'TB-1', 'S', { status: 'Needs decision', test: '—' })
    + tRow('18', 'TB-1', 'S', { status: 'Needs decision', test: '—', riskId: 'Q-01' })
    + tRow('19', 'TB-1', 'S', { status: 'Done' });
  const msgs = threats(sec(rows, HEADER.replace('Lite', 'Standard'))).map((f) => f.message);
  assert.equal(msgs.length, 4, msgs.join('\n'));
  assert.ok(msgs.some((m) => /TH-13: Planned threat has no Test/.test(m)));
  assert.ok(msgs.some((m) => /TH-15: High risk .* needs an R-xx/.test(m)));
  assert.ok(msgs.some((m) => /TH-17: .* Needs decision must reference a Q-xx/.test(m)));
  assert.ok(msgs.some((m) => /TH-19: invalid Status "Done"/.test(m)));
});

test('threats: placeholder cells and an absent SECURITY_ARCHITECTURE do not crash', () => {
  const rows = fullRows('TB-1', 1, { status: '{{Planned}}', test: '{{SEC-01}}', riskId: '{{R-xx}}', risk: '{{High}}' });
  const r = sec(rows);
  assert.equal(threats(r).filter((f) => /Status|Test|R-xx/.test(f.message)).length, 0);
  assert.deepEqual(threats(check(project())), []);
});
