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
  let s = heading.trim().toLowerCase();
  for (let prev; prev !== s; ) {
    prev = s;
    s = s.replace(/<[^>]+>/g, '');
  }
  return s
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

  let tbd = 0;
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

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
const errors = findings.filter((f) => f.severity === 'error');
const warnings = findings.filter((f) => f.severity === 'warning');
const infos = findings.filter((f) => f.severity === 'info');
const tbdTotal = [...tbdCounts.values()].reduce((a, b) => a + b, 0);

if (asJson) {
  console.log(JSON.stringify({
    projectDir: root, tier, filesScanned: files.length,
    summary: { errors: errors.length, warnings: warnings.length, tbd: tbdTotal },
    tbdByFile: Object.fromEntries(tbdCounts), findings,
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
  sections: 'Missing template sections', diagrams: 'Diagrams',
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

console.log(`OPEN [TBD] ITEMS (${tbdTotal}) — reported, not a failure`);
if (tbdCounts.size) {
  [...tbdCounts.entries()].sort((a, b) => b[1] - a[1]).forEach(([f, n]) => console.log(`  - ${f}: ${n}`));
} else console.log('  none');
console.log('');

if (infos.length) {
  console.log(`INFO (${infos.length})`);
  infos.slice(0, 40).forEach((f) => console.log(fmt(f)));
  if (infos.length > 40) console.log(`  … ${infos.length - 40} more`);
  console.log('');
}

console.log(`Result: ${errors.length ? 'FAIL' : 'PASS'} — ${errors.length} error(s), ${warnings.length} warning(s), ${tbdTotal} open [TBD].`);
console.log('Note: this checks mechanics only. Run the semantic checklist in references/consistency-audit.md as well.');
}
