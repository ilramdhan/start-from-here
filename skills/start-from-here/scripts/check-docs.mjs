#!/usr/bin/env node
// start-from-here — documentation checker (optional helper; the skill works without it).
// Zero dependencies. Node >= 18.
//
// Usage: node check-docs.mjs [projectDir] [--json] [--help]
//
// Checks (mechanical only — semantic consistency is the AI's job, see references/consistency-audit.md):
//   1. Expected core files present (tier read from docs/.start-from-here/STATE.md; report-only if absent)
//   2. Leftover {{placeholders}}                        -> error (warning inside code blocks)
//   3. Leftover <!-- guidance ... --> comments          -> error
//   4. [TBD ...] markers                                -> counted (info)
//   5. Broken relative markdown links                   -> error (missing anchors -> warning)
//   6. Status header present in generated docs          -> error
//   7. Obvious secret patterns                          -> error (generic assignments -> warning)
//   8. Legal docs lacking the not-legal-advice notice   -> warning
//   9. Other leftover HTML comments (outside .github/)  -> warning
//  10. Every H2 section of the matching template kept   -> warning per missing section (use "N/A — reason")
//  11. Key docs contain at least one Mermaid diagram    -> warning
//  12. ID cross-references (references/writing-conventions.md §3):
//      reference to an ID that is never defined         -> error (warning if the defining doc does not exist)
//      same ID defined twice in one doc / ADR number reused -> error
//      PRD feature / AC / NFR not traced downstream      -> warning (TESTING, IMPLEMENTATION_PLAN, OPERATIONS)
//  13. [TBD-BLOCKING: …] marker without a Q-xx           -> error (blocking count reported with [TBD])
// Exit code: 0 = no errors, 1 = errors found, 2 = usage problem.

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, resolve, relative, dirname, sep, posix } from 'node:path';

const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`start-from-here doc checker

Usage: node check-docs.mjs [projectDir] [--json]

  projectDir  Project root to check (default: current directory)
  --json      Print machine-readable JSON instead of a text report

Exit codes: 0 no errors, 1 errors found, 2 usage error.`);
  process.exit(0);
}
const asJson = args.includes('--json');
const positional = args.filter((a) => !a.startsWith('--'));
const root = resolve(positional[0] ?? '.');

if (!existsSync(root) || !statSync(root).isDirectory()) {
  console.error(`Error: "${root}" is not a directory.`);
  process.exit(2);
}

// ---------------------------------------------------------------------------
// Expected files per tier (unconditional "Required" docs only; conditional docs
// are expected when STATE.md lists them as required/active).
// ---------------------------------------------------------------------------
const CORE = {
  Lite: [
    'AGENTS.md', 'README.md', 'LICENSE', 'docs/README.md', 'docs/DISCOVERY.md',
    'docs/product/PRD.md', 'docs/technical/ARCHITECTURE.md',
    'docs/technical/SECURITY_ARCHITECTURE.md', 'docs/technical/TESTING.md',
    'docs/technical/IMPLEMENTATION_PLAN.md', 'docs/engineering/CODE_STYLE.md',
    'docs/engineering/AI_GUIDELINES.md',
  ],
};
CORE.Standard = [
  ...CORE.Lite,
  'docs/product/APP_FLOW.md', 'docs/technical/TRD.md', 'docs/technical/OPERATIONS.md',
  'docs/engineering/GIT_WORKFLOW.md', 'docs/decisions/README.md',
  'docs/decisions/0001-record-architecture-decisions.md',
  'CHANGELOG.md', 'CONTRIBUTING.md', 'SECURITY.md',
  '.github/CODEOWNERS', '.github/PULL_REQUEST_TEMPLATE.md',
  '.github/ISSUE_TEMPLATE/bug_report.yml', '.github/ISSUE_TEMPLATE/feature_request.yml',
  '.github/ISSUE_TEMPLATE/config.yml',
];
CORE.Enterprise = [...CORE.Standard, 'SUPPORT.md', 'docs/legal/COMPLIANCE.md'];

// Files that intentionally have no status header.
const NO_HEADER = new Set([
  'CHANGELOG.md', 'CODE_OF_CONDUCT.md', 'CLAUDE.md', 'GEMINI.md',
]);
const NO_HEADER_PREFIXES = ['.github/', 'docs/.start-from-here/'];

const SKIP_DIRS = new Set([
  'node_modules', '.git', 'vendor', 'dist', 'build', 'out', 'target', '.next', '.venv',
  'venv', '__pycache__', '.idea', '.vscode', 'coverage', '.turbo', '.cache',
]);

// ---------------------------------------------------------------------------
const findings = []; // { severity: 'error'|'warning'|'info', check, file, line, message }
const add = (severity, check, file, line, message) =>
  findings.push({ severity, check, file, line, message });

const toPosix = (p) => p.split(sep).join('/');
const rel = (abs) => toPosix(relative(root, abs)) || '.';

function walk(dir, out) {
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      walk(join(dir, e.name), out);
    } else if (e.isFile()) {
      out.push(join(dir, e.name));
    }
  }
  return out;
}

// Files in scope: everything under docs/ and .github/, plus root-level docs.
function collectFiles() {
  const files = [];
  for (const d of ['docs', '.github']) {
    const p = join(root, d);
    if (existsSync(p) && statSync(p).isDirectory()) walk(p, files);
  }
  for (const e of readdirSync(root, { withFileTypes: true })) {
    if (!e.isFile()) continue;
    if (/\.(md|markdown)$/i.test(e.name) || /^(LICENSE|COPYING|NOTICE)(\..*)?$/i.test(e.name)) {
      files.push(join(root, e.name));
    }
  }
  return files.filter((f) => /\.(md|markdown|ya?ml|txt)$/i.test(f) || /(^|[\\/])(LICENSE|COPYING|NOTICE|CODEOWNERS)(\.[^\\/]*)?$/i.test(f));
}

// ---------------------------------------------------------------------------
// STATE.md
// ---------------------------------------------------------------------------
function readState() {
  const p = join(root, 'docs/.start-from-here/STATE.md');
  if (!existsSync(p)) return null;
  const text = readFileSync(p, 'utf8');
  // Accepts "- tier: Standard", "tier: **Standard**" and YAML front matter "tier: \"Standard\"".
  const tierMatch = text.match(/^\s*[-*]?\s*\**tier\**\s*:\s*\**\s*["']?(Lite|Standard|Enterprise)\b/im);
  const docs = new Map(); // path -> { applicability, status }
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\|\s*`?([^|`]+?\.(?:md|yml|yaml)|LICENSE|[^|`]*CODEOWNERS)`?\s*\|([^|]*)\|([^|]*)\|?/);
    if (!m) continue;
    const path = m[1].trim();
    if (/^path$/i.test(path)) continue;
    // A grouped row ("README.md, LICENSE, …" or "ISSUE_TEMPLATE/*") is not one path: skip it rather than report a
    // false "missing" error. Core files are still checked via CORE; the skill asks for one row per path.
    if (/[,*]|\s\+\s/.test(path)) continue;
    docs.set(path, { applicability: m[2].trim(), status: m[3].trim() });
  }
  return { tier: tierMatch ? tierMatch[1] : null, docs };
}

// Applicability vocabulary (references/workflow.md): Required | Optional (on) | Skipped (reason).
// Also tolerated: yes/no, Conditional (yes|no), N/A, Optional (off).
const isSkipped = (info) => {
  if (!info) return false;
  const a = info.applicability;
  if (/^\s*(required|yes)\b/i.test(a) || /optional\s*\(\s*on\s*\)/i.test(a) || /conditional.*\b(yes|true|on)\b/i.test(a)) return false;
  return /(skip|n\/a|not applicable|^\s*no\b|\boff\b|optional|conditional)/i.test(`${a} ${info.status}`);
};
const isExpected = (info) => !!info && !isSkipped(info)
  && /(required|^\s*yes\b|optional\s*\(\s*on\s*\)|conditional.*\b(yes|true|on)\b)/i.test(info.applicability);

// ---------------------------------------------------------------------------
// Markdown helpers
// ---------------------------------------------------------------------------
function codeMask(lines) {
  // true for lines inside fenced code blocks (``` or ~~~)
  const mask = new Array(lines.length).fill(false);
  let fence = null;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^\s{0,3}(`{3,}|~{3,})/);
    if (fence) {
      mask[i] = true;
      if (m && m[1][0] === fence[0] && m[1].length >= fence.length) fence = null;
    } else if (m) {
      fence = m[1];
      mask[i] = true;
    }
  }
  return mask;
}

const stripInlineCode = (line) => line.replace(/`+[^`]*`+/g, (s) => ' '.repeat(s.length));

function slugify(heading) {
  return heading
    .trim()
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[`*_~[\]()]/g, (c) => (c === '_' ? '_' : ''))
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')
    .replace(/\s/g, '-');
}

const anchorCache = new Map();
function anchorsOf(absFile) {
  if (anchorCache.has(absFile)) return anchorCache.get(absFile);
  const set = new Set();
  try {
    const lines = readFileSync(absFile, 'utf8').split(/\r?\n/);
    const mask = codeMask(lines);
    const counts = new Map();
    lines.forEach((l, i) => {
      if (mask[i]) return;
      const h = l.match(/^\s{0,3}#{1,6}\s+(.*?)\s*#*\s*$/);
      if (h) {
        const base = slugify(h[1]);
        const n = counts.get(base) ?? 0;
        set.add(n === 0 ? base : `${base}-${n}`);
        counts.set(base, n + 1);
      }
      for (const a of l.matchAll(/<a\s+[^>]*(?:name|id)=["']([^"']+)["']/gi)) set.add(a[1]);
    });
  } catch { /* unreadable */ }
  anchorCache.set(absFile, set);
  return set;
}

// ---------------------------------------------------------------------------
// Secret patterns
// ---------------------------------------------------------------------------
const SECRET_PATTERNS = [
  ['Private key block', /-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP |ENCRYPTED )?PRIVATE KEY(?: BLOCK)?-----/],
  ['AWS access key ID', /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/],
  ['GitHub token', /\b(?:gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{40,})\b/],
  ['GitLab token', /\bglpat-[A-Za-z0-9_-]{20,}\b/],
  ['Slack token', /\bxox[abposr]-[A-Za-z0-9-]{10,}\b/],
  ['Stripe live key', /\b(?:sk|rk)_live_[A-Za-z0-9]{16,}\b/],
  ['Google API key', /\bAIza[0-9A-Za-z_-]{35}\b/],
  ['Anthropic API key', /\bsk-ant-[A-Za-z0-9_-]{20,}\b/],
  ['OpenAI-style API key', /\bsk-(?:proj-)?[A-Za-z0-9_-]{32,}\b/],
  ['JSON Web Token', /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/],
  ['Credentials in URL', /\b[a-z][a-z0-9+.-]*:\/\/[^\s:/@'"<>]+:([^\s@/'"<>]+)@[^\s'"<>]+/i],
];
const PLACEHOLDER_SECRET = /^(?:\*+|x+|\.{3}|<[^>]*>|\$\{?[A-Za-z_][\w.]*\}?|\{\{[^}]*\}\}|password|pass|pwd|secret|changeme|example|your[-_]?\w*|user|username|redacted|\[[^\]]*\])$/i;
const GENERIC_ASSIGN = /\b(?:password|passwd|secret|api[_-]?key|access[_-]?token|auth[_-]?token|client[_-]?secret)\b\s*[:=]\s*["']?([^\s"'`<>{}$,;)]{8,})/i;

const mask = (s) => (s.length <= 8 ? '****' : `${s.slice(0, 4)}…${s.slice(-2)} (${s.length} chars)`);

// ---------------------------------------------------------------------------
// Template section map (check 10) — templates ship next to this script.
// ---------------------------------------------------------------------------
const TEMPLATES = resolve(dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..', 'assets', 'templates');
const normHeading = (h) => h.replace(/^\d+(\.\d+)*[.)]?\s+/, '').replace(/[`*_]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
function h2sOf(text) {
  const lines = text.split(/\r?\n/);
  const inCode = codeMask(lines);
  return lines.filter((l, i) => !inCode[i] && /^##\s+/.test(l)).map((l) => normHeading(l.replace(/^##\s+/, '')));
}
const MERMAID_EXPECTED = new Set([
  'docs/product/PRD.md', 'docs/product/APP_FLOW.md', 'docs/technical/ARCHITECTURE.md',
  'docs/technical/DATABASE.md', 'docs/technical/SECURITY_ARCHITECTURE.md', 'docs/technical/IMPLEMENTATION_PLAN.md',
  'docs/technical/OPERATIONS.md', 'docs/engineering/AI_GUIDELINES.md',
]);

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------
const state = readState();
const tier = state?.tier ?? null;
const files = collectFiles();
const tbdCounts = new Map();
const blockingCounts = new Map();
const mdDocs = []; // { r, lines, inCode } for the ID cross-reference pass (check 12)

// 1. Presence
let expected = [];
if (tier) {
  expected = [...CORE[tier]];
  for (const [p, info] of state.docs) {
    if (isExpected(info) && !expected.includes(p)) expected.push(p);
  }
  for (const p of expected) {
    const info = state.docs.get(p);
    if (isSkipped(info)) continue;
    if (!existsSync(join(root, p))) add('error', 'presence', p, null, `Expected for ${tier} tier but missing`);
  }
} else {
  const present = CORE.Enterprise.filter((p) => existsSync(join(root, p)));
  add('info', 'presence', 'docs/.start-from-here/STATE.md', null,
    `No STATE.md tier found — presence check is report-only. ${present.length}/${CORE.Enterprise.length} known core files present.`);
  for (const p of CORE.Enterprise) {
    if (!existsSync(join(root, p))) add('info', 'presence', p, null, 'Not present (tier unknown)');
  }
}

for (const abs of files) {
  const r = rel(abs);
  let text;
  try { text = readFileSync(abs, 'utf8'); } catch { continue; }
  const lines = text.split(/\r?\n/);
  const inCode = codeMask(lines);
  const isMd = /\.(md|markdown)$/i.test(abs);
  // Process files (STATE.md, session-mode HANDOVER.md): no status header, no template-section check.
  const isState = r.startsWith('docs/.start-from-here/');

  // 6. Status header
  if (isMd && !isState) {
    const base = r.split('/').pop();
    const exempt = (r === base && NO_HEADER.has(base)) || NO_HEADER_PREFIXES.some((p) => r.startsWith(p));
    if (!exempt) {
      const head = lines.slice(0, 20).join('\n');
      if (!/\*\*Status:\*\*/.test(head)) {
        add('error', 'header', r, null, 'Missing status header ("> **Status:** … · **Owner:** … · **Last updated:** … · **Tier:** …")');
      } else {
        const m = head.match(/\*\*Status:\*\*\s*([^·|\n*]+)/);
        const status = m ? m[1].trim() : '';
        const isAdr = r.startsWith('docs/decisions/') && !r.endsWith('README.md');
        const okStatus = isAdr
          ? /^(Proposed|Accepted|Rejected|Deprecated|Superseded)\b/i
          : /^(Draft|In review|Approved)\b/i;
        if (!okStatus.test(status)) {
          add('warning', 'header', r, null, `Status value "${status}" is not ${isAdr ? 'Proposed | Accepted | Rejected | Deprecated | Superseded' : 'Draft | In review | Approved'}`);
        }
        for (const field of ['Owner', 'Last updated', 'Tier']) {
          if (!new RegExp(`\\*\\*${field}:\\*\\*`).test(head)) add('warning', 'header', r, null, `Status header lacks "${field}"`);
        }
      }
    }
  }

  // 10. Section completeness vs template (fuzzy: number prefixes and case ignored)
  if (isMd && !isState && !r.startsWith('docs/decisions/0')) {
    const tpl = join(TEMPLATES, r);
    if (existsSync(tpl)) {
      let tplText = '';
      try { tplText = readFileSync(tpl, 'utf8'); } catch { /* ignore */ }
      const have = new Set(h2sOf(text));
      const missing = h2sOf(tplText).filter((h) => h && !have.has(h));
      for (const h of missing) {
        add('warning', 'sections', r, null, `Template section "## ${h}" missing — keep it, filled or "N/A — reason"`);
      }
    }
  }
  // 11. Diagrams in key docs
  if (MERMAID_EXPECTED.has(r) && !/```mermaid/.test(text)) {
    add('warning', 'diagrams', r, null, 'No Mermaid diagram found — key docs need at least one (plus ASCII fallback for main workflows)');
  }

  // 8. Legal notice in docs/legal/*
  if (isMd && r.startsWith('docs/legal/') && !/not legal advice/i.test(text)) {
    add('warning', 'legal', r, null, 'Legal draft lacks the "This is a draft, not legal advice" notice (translate if needed)');
  }

  if (isMd && !isState) mdDocs.push({ r, lines, inCode });

  let tbd = 0;
  let blocking = 0;
  lines.forEach((line, i) => {
    const ln = i + 1;
    const code = inCode[i];

    // 2. Placeholders (ignore GitHub Actions-style ${{ ... }})
    // Inline code (`{{x}}`) is a quotation, e.g. a self-check line "No `{{placeholders}}` remain" — not a leftover.
    for (const m of (code ? line : stripInlineCode(line)).matchAll(/(\$?)\{\{\s*([A-Za-z0-9_.\- ]+?)\s*\}\}/g)) {
      if (m[1] === '$') continue;
      if (/\s/.test(m[2]) || m[2].includes('.')) continue; // handled below as free-text placeholders
      if (isState) { add('warning', 'placeholder', r, ln, `Placeholder {{${m[2]}}} in state file`); continue; }
      add(code ? 'warning' : 'error', 'placeholder', r, ln,
        `Leftover placeholder {{${m[2]}}}${code ? ' (inside code block — confirm intentional)' : ''}`);
    }
    // 2b. Free-text template placeholders such as {{e.g. web app, CLI}} (outside code and inline code only,
    // so Helm/Jinja/Go-template examples in code are not flagged).
    if (!code) {
      for (const m of stripInlineCode(line).matchAll(/(\$?)\{\{([^{}]*?)\}\}/g)) {
        if (m[1] === '$') continue;
        const inner = m[2].trim();
        if (!inner || /^[A-Za-z0-9_-]+$/.test(inner)) continue; // simple form already reported above
        if (/^[.$#/>!]/.test(inner)) continue; // template-engine syntax ({{.Field}}, {{#each}}, {{/if}}, {{> partial}})
        add(isState ? 'warning' : 'error', 'placeholder', r, ln, `Leftover placeholder {{${inner.length > 40 ? `${inner.slice(0, 40)}…` : inner}}}`);
      }
    }

    // 3b. Other HTML comments (template examples like <!-- e.g. … -->) left in output
    if (!code && isMd && !r.startsWith('.github/') && /<!--(?!\s*guidance\b)/i.test(stripInlineCode(line))) {
      add('warning', 'comment', r, ln, 'Leftover HTML comment — remove template notes from generated docs');
    }

    // 3. Guidance comments
    if (!code && /<!--\s*guidance\b/i.test(line)) add('error', 'guidance', r, ln, 'Leftover <!-- guidance --> comment');

    // 4. TBD markers
    const t = line.match(/\[TBD\b/g);
    if (t) tbd += t.length;

    // 13. Blocking TBD markers must point at an open question (Q-xx). Inline code is a quotation, not a marker.
    if (!code && isMd) {
      for (const m of stripInlineCode(line).matchAll(/\[TBD-BLOCKING\b([^\]]*)\]/g)) {
        blocking++;
        if (!isState && !/\bQ-\d{2,3}\b/.test(m[1])) {
          add('error', 'tbd', r, ln, 'Blocking TBD without a Q-xx — write [TBD-BLOCKING: question — owner — Q-xx] and log Q-xx in DISCOVERY');
        }
      }
    }

    // 7. Secrets
    for (const [name, re] of SECRET_PATTERNS) {
      const m = line.match(re);
      if (!m) continue;
      if (name === 'Credentials in URL' && PLACEHOLDER_SECRET.test(m[1])) continue;
      add('error', 'secret', r, ln, `Possible ${name}: ${mask(m[1] ?? m[0])}`);
    }
    const g = line.match(GENERIC_ASSIGN);
    if (g && !PLACEHOLDER_SECRET.test(g[1]) && !/^(?:required|optional|true|false|null|none|string|redacted)$/i.test(g[1])) {
      add('warning', 'secret', r, ln, `Possible hard-coded secret value: ${mask(g[1])}`);
    }

    // 5. Relative links (markdown only, outside code)
    if (isMd && !code) {
      const clean = stripInlineCode(line);
      const targets = [];
      for (const m of clean.matchAll(/!?\[(?:[^\]\\]|\\.)*\]\(\s*<?([^)\s>]+)>?(?:\s+["'][^"']*["'])?\s*\)/g)) targets.push(m[1]);
      const refDef = clean.match(/^\s{0,3}\[[^\]]+\]:\s*<?(\S+?)>?(?:\s|$)/);
      if (refDef) targets.push(refDef[1]);
      for (const raw of targets) checkLink(abs, r, ln, raw);
    }
  });
  if (tbd > 0) tbdCounts.set(r, tbd);
  if (blocking > 0) blockingCounts.set(r, blocking);
}

// ---------------------------------------------------------------------------
// 12. ID cross-references (writing-conventions.md §3). Mechanical only: an ID is
// "defined" where it is introduced (ID column of a table, a heading, an AC bullet,
// an ADR file) and "referenced" everywhere else it appears in prose or tables.
// Code fences, inline code, {{placeholders}} and HTML comments are ignored.
// ---------------------------------------------------------------------------
const D = {
  PRD: 'docs/product/PRD.md', DISC: 'docs/DISCOVERY.md', FLOW: 'docs/product/APP_FLOW.md',
  TRD: 'docs/technical/TRD.md', ARCH: 'docs/technical/ARCHITECTURE.md', API: 'docs/technical/API.md',
  SECA: 'docs/technical/SECURITY_ARCHITECTURE.md', TEST: 'docs/technical/TESTING.md',
  PLAN: 'docs/technical/IMPLEMENTATION_PLAN.md', OPS: 'docs/technical/OPERATIONS.md',
  COMP: 'docs/legal/COMPLIANCE.md', STYLE: 'docs/engineering/CODE_STYLE.md', INDEX: 'docs/README.md',
};
// Prefix -> docs where the ID may be introduced (first doc = canonical home, used in messages).
// '*' = any doc (open questions live in several docs).
const ID_HOME = {
  P: [D.PRD, D.DISC], J: [D.PRD, D.FLOW, D.DISC], US: [D.PRD], F: [D.PRD, D.DISC], AC: [D.PRD],
  KPI: [D.PRD, D.DISC], JTBD: [D.PRD], 'G-': [D.PRD, D.DISC], NFR: [D.TRD, D.ARCH, D.DISC, D.PRD],
  S: [D.FLOW], OP: [D.API], TB: [D.SECA], TH: [D.SECA],
  AT: [D.TEST], SEC: [D.TEST], PERF: [D.TEST], A11Y: [D.TEST], DR: [D.TEST], COMPAT: [D.TEST],
  CR: [D.COMP], CS: [D.STYLE], SLO: [D.OPS], RB: [D.OPS],
  M: [D.PLAN], 'G#': [D.PLAN], T: [D.PLAN], R: [D.PRD, D.DISC, D.PLAN, D.ARCH, D.SECA],
  A: [D.DISC], D: [D.DISC], Q: ['*'], ADR: ['docs/decisions/'],
};
// Bare phase IDs (M0–M7, G0–G5) are too ambiguous in prose ("M2 chip", "G5 network"); only these docs are scanned for them.
const PHASE_DOCS = new Set([D.PLAN, D.INDEX]);
const NOT_IDS = new Set(['P-256', 'P-384', 'P-521']); // NIST curve names, not personas

const ID_RE = /(?<![\w-])(?:AC-(\d{2,3})\.(\d{1,2})|ADR-(\d{4})|TB-(\d{1,2})|(JTBD|KPI|NFR|A11Y|COMPAT|PERF|SEC|SLO|US|OP|TH|AT|CR|CS|DR|RB|P|J|F|S|G|T|R|A|D|Q)-(\d{2,3})|([MG])(\d))(?!\w|-\d|\.\d)/g;
const RANGE_SEP = /^\s*(?:–|—|-|\.\.\.?|…|to)\s*$/;

function idTokens(text, allowPhase) {
  const out = []; // { id, prefix, num, sub, index, end }
  for (const m of text.matchAll(ID_RE)) {
    let t;
    if (m[1]) t = { id: `AC-${m[1]}.${m[2]}`, prefix: 'AC', num: m[1], sub: m[2] };
    else if (m[3]) t = { id: `ADR-${m[3]}`, prefix: 'ADR', num: m[3] };
    else if (m[4]) t = { id: `TB-${m[4]}`, prefix: 'TB', num: m[4] };
    else if (m[5]) t = { id: `${m[5]}-${m[6]}`, prefix: m[5] === 'G' ? 'G-' : m[5], num: m[6] };
    else {
      if (!allowPhase || (m[7] === 'M' ? +m[8] > 7 : +m[8] > 5)) continue;
      t = { id: `${m[7]}${m[8]}`, prefix: m[7] === 'M' ? 'M' : 'G#', num: m[8] };
    }
    if (NOT_IDS.has(t.id)) continue;
    out.push({ ...t, index: m.index, end: m.index + m[0].length });
  }
  // Expand ranges: "AC-01.1–AC-01.4", "T-03..T-07", and the shorthand "AC-01.1–4" / "AC-01.1–.4".
  const extra = [];
  for (let i = 0; i < out.length; i++) {
    const a = out[i];
    const b = out[i + 1];
    if (b && b.prefix === a.prefix && RANGE_SEP.test(text.slice(a.end, b.index))) {
      if (a.prefix === 'AC' && a.num === b.num) {
        for (let k = +a.sub + 1; k < +b.sub && k - a.sub <= 50; k++) extra.push({ ...a, id: `AC-${a.num}.${k}`, sub: String(k) });
      } else if (a.prefix !== 'AC' && +b.num - +a.num <= 50) {
        const w = a.num.length;
        for (let k = +a.num + 1; k < +b.num; k++) {
          const n = String(k).padStart(w, '0');
          extra.push({ ...a, id: a.prefix === 'M' || a.prefix === 'G#' ? `${a.id[0]}${n}` : `${a.prefix === 'G-' ? 'G' : a.prefix}-${n}`, num: n });
        }
      }
    } else if (a.prefix === 'AC') {
      const s = text.slice(a.end).match(/^\s*[–-]\s*\.?(\d{1,2})(?![\w.-])/);
      if (s) for (let k = +a.sub + 1; k <= +s[1] && k - a.sub <= 50; k++) extra.push({ ...a, id: `AC-${a.num}.${k}`, sub: String(k) });
    }
  }
  return out.concat(extra);
}

// Visible text of each line: no code fences, inline code, {{placeholders}} or HTML comments (incl. multi-line guidance).
function visibleLines(lines, inCode) {
  const out = [];
  let inComment = false;
  for (let i = 0; i < lines.length; i++) {
    if (inCode[i]) { out.push(''); continue; }
    // `F-01` (a bare ID in backticks) is formatting; any other inline code is a quotation and is blanked.
    let s = stripInlineCode(lines[i].replace(/`([A-Z][A-Z0-9]*-\d{1,4}(?:\.\d{1,2})?)`/g, ' $1 '));
    let res = '';
    while (s.length) {
      if (inComment) {
        const e = s.indexOf('-->');
        if (e < 0) { s = ''; break; }
        s = s.slice(e + 3);
        inComment = false;
      } else {
        const b = s.indexOf('<!--');
        if (b < 0) { res += s; break; }
        res += s.slice(0, b);
        s = s.slice(b + 4);
        inComment = true;
      }
    }
    out.push(res.replace(/\{\{[^{}]*\}\}/g, ' '));
  }
  return out;
}

const cellsOf = (row) => row.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
const isIdHeader = (h) => /^(?:.*\s)?id$|^(?:tb|gate)$/i.test(h.replace(/[*_`]/g, '').trim());
const cellLead = (c) => c.replace(/^(?:\*\*|__|~~|\[)+/, '');
const isHome = (prefix, r) => ID_HOME[prefix].some((h) => h === '*' || (h.endsWith('/') ? r.startsWith(h) : r === h));

function checkIds(docs) {
  const strong = new Map(); // id -> [{ r, ln }] (ID columns, AC bullets, ADR files) — duplicate-checked per doc
  const weak = new Map(); // id -> [{ r, ln }] (headings and first table column in a home doc)
  const refs = new Map(); // id -> Map(r -> { ln, count })
  const rows = new Map(); // `${r}|${id}` -> row text of the defining row (priority / withdrawn)
  const push = (map, id, v) => { if (!map.has(id)) map.set(id, []); map.get(id).push(v); };

  // ADRs are defined by their files: docs/decisions/NNNN-title.md.
  const adrFiles = docs.filter((d) => /^docs\/decisions\/\d{4}-[^/]*\.md$/i.test(d.r));
  for (const d of adrFiles) push(strong, `ADR-${d.r.split('/').pop().slice(0, 4)}`, { r: 'docs/decisions/', ln: null, file: d.r });
  const adrFromFiles = adrFiles.length > 0;

  for (const { r, lines, inCode } of docs) {
    const vis = visibleLines(lines, inCode);
    const allowPhase = PHASE_DOCS.has(r);
    let header = null; // current table header cells
    let idCol = -1;
    let tableAt = 0; // line of the current table header (duplicate scope)
    for (let i = 0; i < vis.length; i++) {
      const line = vis[i];
      const ln = i + 1;
      const isRow = /^\s*\|/.test(line);
      if (!isRow) { header = null; idCol = -1; }
      else if (i + 1 < vis.length && /^\s*\|?\s*:?-{3,}/.test(vis[i + 1]) && !header) {
        header = cellsOf(line);
        idCol = header.findIndex(isIdHeader);
        tableAt = ln;
        continue; // header row: IDs in it are labels, not references
      } else if (/^\s*\|?\s*:?-{3,}:?\s*\|/.test(line)) continue;

      const tokens = idTokens(line, allowPhase);
      const defined = new Set();
      // Definitions: ID column / first column of a table row
      if (isRow && header) {
        const cells = cellsOf(line);
        const lead = (c) => idTokens(cellLead(c ?? ''), allowPhase).find((t) => cellLead(c).startsWith(t.id));
        if (idCol >= 0) {
          const t = lead(cells[idCol]);
          // A sub-row ID such as "SEC-08.1" (one table-driven suite) defines its parent SEC-08.
          const sub = !t && cellLead(cells[idCol] ?? '').match(/^([A-Z][A-Z0-9]*-\d{2,3})\.\d{1,2}\b/);
          if (t && isHome(t.prefix, r) && !(t.prefix === 'ADR' && adrFromFiles)) {
            push(strong, t.id, { r, ln, scope: `${r}#${tableAt}` }); defined.add(t.id); rows.set(`${r}|${t.id}`, line);
          } else if (sub && isHome(idTokens(sub[1], false)[0]?.prefix ?? 'Q', r)) push(weak, sub[1], { r, ln });
        }
        const t0 = lead(cells[0]);
        if (t0 && !defined.has(t0.id) && isHome(t0.prefix, r) && !(t0.prefix === 'ADR' && adrFromFiles)) {
          push(weak, t0.id, { r, ln }); defined.add(t0.id);
          if (!rows.has(`${r}|${t0.id}`)) rows.set(`${r}|${t0.id}`, line);
        }
      }
      // Headings in a home doc ("#### F-01 — Title", "### OP-01 — …", "# ADR-0001: …")
      if (/^\s{0,3}#{1,6}\s/.test(line)) {
        for (const t of tokens) {
          if (isHome(t.prefix, r) && !(t.prefix === 'ADR' && adrFromFiles)) { push(weak, t.id, { r, ln }); defined.add(t.id); }
        }
      }
      // Bullets that introduce an ID in a home doc: "- **AC-01.1 (happy)** Given …", "- **DR-01 Restore drill:** …".
      // AC bullets are duplicate-checked per doc; other bold bullets are weak (they often restate a table row).
      const bullet = line.match(/^\s*(?:[-*+]|\d+[.)])\s+(\*\*|__)?\s*([A-Z][A-Z0-9]*-[\d.]+)/);
      if (bullet) {
        const t = idTokens(bullet[2], false)[0];
        if (t && t.id === bullet[2].replace(/\.$/, '') && isHome(t.prefix, r) && !defined.has(t.id)) {
          if (t.prefix === 'AC') { push(strong, t.id, { r, ln, scope: `${r}#AC` }); defined.add(t.id); }
          else if (bullet[1]) { push(weak, t.id, { r, ln }); defined.add(t.id); }
        }
      }

      for (const t of tokens) {
        if (defined.has(t.id)) continue;
        if (!refs.has(t.id)) refs.set(t.id, new Map());
        const perFile = refs.get(t.id);
        if (!perFile.has(r)) perFile.set(r, { ln, count: 0, prefix: t.prefix });
        perFile.get(r).count++;
      }
    }
  }

  // Duplicate definitions: the same ID twice in one ID table (or AC list), or two ADR files with the same number.
  // The same ID in two different tables of a doc is a restatement (e.g. TESTING §4 and §14 both list DR-01).
  for (const [id, list] of strong) {
    const seen = new Map();
    for (const d of list) {
      const key = d.scope ?? d.r;
      if (!seen.has(key)) { seen.set(key, d); continue; }
      const first = seen.get(key);
      if (d.file) add('error', 'ids', d.file, null, `${id} is defined twice — ${first.file} and ${d.file} share the number`);
      else add('error', 'ids', d.r, d.ln, `${id} is defined twice (first at line ${first.ln}) — IDs are unique and never reused`);
    }
  }

  // References to IDs that are never defined. DISCOVERY's seed register only counts as the home when it is the sole
  // home (A-, D-): if the authoritative doc (e.g. TRD for NFR-xx) is not generated yet, that is one warning per prefix,
  // not an error per reference — the presence check already reports the missing doc.
  const homeExists = (prefix) => {
    const homes = ID_HOME[prefix].length > 1 ? ID_HOME[prefix].filter((h) => h !== D.DISC) : ID_HOME[prefix];
    return homes.some((h) => h === '*' || existsSync(join(root, h)));
  };
  const orphanPrefixes = new Map(); // prefix -> { ids: Set, first: { r, ln } }
  for (const [id, perFile] of refs) {
    if (strong.has(id) || weak.has(id)) continue;
    for (const [r, { ln, count, prefix }] of perFile) {
      if (!homeExists(prefix)) {
        if (!orphanPrefixes.has(prefix)) orphanPrefixes.set(prefix, { ids: new Set(), first: { r, ln } });
        orphanPrefixes.get(prefix).ids.add(id);
        continue;
      }
      const home = ID_HOME[prefix][0] === '*' ? 'an open-questions table (DISCOVERY §7)' : ID_HOME[prefix][0];
      const times = count > 1 ? ` (${count}×)` : '';
      add('error', 'ids', r, ln, `${id} is referenced${times} but never defined (expected in ${home})`);
    }
  }
  for (const [prefix, { ids, first }] of orphanPrefixes) {
    const list = [...ids].sort();
    const sample = list.slice(0, 5).join(', ') + (list.length > 5 ? `, … (${list.length} IDs)` : '');
    const label = prefix === 'G#' ? 'G0–G5' : prefix === 'M' ? 'M0–M7' : `${prefix === 'G-' ? 'G' : prefix}-xx`;
    add('warning', 'ids', first.r, first.ln, `${label} IDs are referenced (${sample}) but ${ID_HOME[prefix][0]} does not exist to define them`);
  }

  // Downstream traceability (consistency-audit.md §C, §G): only for docs that exist.
  const has = (p) => existsSync(join(root, p));
  const refIn = (id, p) => refs.get(id)?.has(p) || strong.get(id)?.some((d) => d.r === p) || weak.get(id)?.some((d) => d.r === p);
  const defsIn = (prefix, docPaths) => {
    const out = new Map(); // id -> row text
    for (const map of [strong, weak]) {
      for (const [id, list] of map) {
        if (!id.startsWith(`${prefix}-`)) continue;
        for (const d of list) if (docPaths.includes(d.r) && !out.has(id)) out.set(id, { ...d, row: rows.get(`${d.r}|${id}`) ?? '' });
      }
    }
    return out;
  };
  const inactive = (row) => /\bwithdrawn\b|\bwon['’]?t\b|\bout of scope\b/i.test(row);
  const priority = (row) => (row.match(/\|\s*\**(Must|Should|Could|Won['’]?t)\**\s*(?:\||\()/i) ?? [])[1] ?? null;

  if (has(D.PRD)) {
    const features = defsIn('F', [D.PRD]);
    const prio = new Map([...features].map(([id, d]) => [id, priority(d.row)]));
    const mustLike = (id) => { const p = prio.get(id); return !p || /^must$/i.test(p); };
    for (const [id, d] of features) {
      if (inactive(d.row) || !mustLike(id)) continue;
      for (const target of [D.TEST, D.PLAN]) {
        if (has(target) && !refIn(id, target)) {
          add('warning', 'ids', D.PRD, d.ln, `${id}${prio.get(id) ? ` (${prio.get(id)})` : ''} is not referenced in ${target} — every Must feature needs ${target === D.TEST ? 'acceptance tests' : 'a task'}`);
        }
      }
    }
    if (has(D.TEST)) {
      for (const [id, d] of defsIn('AC', [D.PRD])) {
        const f = `F-${id.slice(3).split('.')[0]}`;
        if (!features.has(f) || !mustLike(f) || inactive(features.get(f).row)) continue;
        if (!refIn(id, D.TEST)) add('warning', 'ids', D.PRD, d.ln, `${id} (Must feature ${f}) has no row in ${D.TEST}`);
      }
    }
  }
  const nfrHome = has(D.TRD) ? D.TRD : D.ARCH;
  if (has(nfrHome) && (has(D.TEST) || has(D.OPS))) {
    for (const [id, d] of defsIn('NFR', [nfrHome])) {
      if (inactive(d.row) || refIn(id, D.TEST) || refIn(id, D.OPS)) continue;
      add('warning', 'ids', nfrHome, d.ln, `${id} has no test or monitor — not referenced in ${[D.TEST, D.OPS].filter(has).join(' or ')}`);
    }
  }
}

function checkLink(absFile, r, ln, raw) {
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(raw)) return; // http:, https:, mailto:, etc.
  if (raw.startsWith('/')) return; // repo-root absolute links: host-specific, skip
  if (/\{\{|\$\{/.test(raw)) return; // placeholder already reported
  const [pathPartRaw, anchor] = raw.split('#');
  const pathPart = pathPartRaw.split('?')[0];
  let decoded = pathPart;
  try { decoded = decodeURIComponent(pathPart); } catch { /* keep raw */ }
  const target = decoded ? resolve(dirname(absFile), decoded) : absFile;
  if (decoded) {
    if (!existsSync(target)) {
      add('error', 'link', r, ln, `Broken relative link → ${raw}`);
      return;
    }
  }
  if (anchor && /\.(md|markdown)$/i.test(target) && existsSync(target) && statSync(target).isFile()) {
    const a = anchor.toLowerCase();
    let anchorDecoded = a;
    try { anchorDecoded = decodeURIComponent(a); } catch { /* keep */ }
    if (!anchorsOf(target).has(anchorDecoded)) {
      add('warning', 'link', r, ln, `Anchor #${anchor} not found in ${posix.normalize(toPosix(relative(root, target)))}`);
    }
  }
}

// 12. ID cross-references (runs after every file is read; constants above are initialized by now).
checkIds(mdDocs);

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
const errors = findings.filter((f) => f.severity === 'error');
const warnings = findings.filter((f) => f.severity === 'warning');
const infos = findings.filter((f) => f.severity === 'info');
const tbdTotal = [...tbdCounts.values()].reduce((a, b) => a + b, 0);
const blockingTotal = [...blockingCounts.values()].reduce((a, b) => a + b, 0);

if (asJson) {
  console.log(JSON.stringify({
    projectDir: root, tier, filesScanned: files.length,
    summary: { errors: errors.length, warnings: warnings.length, tbd: tbdTotal, tbdBlocking: blockingTotal },
    tbdByFile: Object.fromEntries(tbdCounts), tbdBlockingByFile: Object.fromEntries(blockingCounts), findings,
  }, null, 2));
} else {
  printReport();
}
// Use exitCode (not process.exit) so piped stdout is fully flushed.
process.exitCode = errors.length ? 1 : 0;

function printReport() {

const LABEL = {
  presence: 'Expected files', placeholder: 'Leftover placeholders', guidance: 'Leftover guidance comments',
  link: 'Links', header: 'Status headers', secret: 'Possible secrets', legal: 'Legal notices', comment: 'HTML comments',
  sections: 'Missing template sections', diagrams: 'Diagrams', ids: 'ID cross-references', tbd: 'Blocking TBD markers',
};
const fmt = (f) => `  - ${f.file}${f.line ? `:${f.line}` : ''} — ${f.message}`;

console.log('start-from-here · documentation check');
console.log(`Project: ${root}`);
console.log(`Tier: ${tier ?? 'unknown (no docs/.start-from-here/STATE.md tier)'} · Files scanned: ${files.length}`);
console.log('');

for (const [sev, list, title] of [['error', errors, 'ERRORS'], ['warning', warnings, 'WARNINGS']]) {
  console.log(`${title} (${list.length})`);
  if (!list.length) { console.log('  none'); console.log(''); continue; }
  for (const check of Object.keys(LABEL)) {
    const group = list.filter((f) => f.check === check);
    if (!group.length) continue;
    console.log(` ${LABEL[check]}:`);
    group.slice(0, 50).forEach((f) => console.log(fmt(f)));
    if (group.length > 50) console.log(`  … ${group.length - 50} more`);
  }
  console.log('');
}

console.log(`OPEN [TBD] ITEMS (${tbdTotal}, ${blockingTotal} blocking) — reported, not a failure`);
if (tbdCounts.size) {
  [...tbdCounts.entries()].sort((a, b) => b[1] - a[1])
    .forEach(([f, n]) => console.log(`  - ${f}: ${n}${blockingCounts.get(f) ? ` (${blockingCounts.get(f)} blocking)` : ''}`));
} else console.log('  none');
console.log('');

if (infos.length) {
  console.log(`INFO (${infos.length})`);
  infos.slice(0, 40).forEach((f) => console.log(fmt(f)));
  if (infos.length > 40) console.log(`  … ${infos.length - 40} more`);
  console.log('');
}

console.log(`Result: ${errors.length ? 'FAIL' : 'PASS'} — ${errors.length} error(s), ${warnings.length} warning(s), ${tbdTotal} open [TBD] (${blockingTotal} blocking).`);
console.log('Note: this checks mechanics only. Run the semantic checklist in references/consistency-audit.md as well.');
}
