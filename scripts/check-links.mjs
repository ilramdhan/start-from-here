#!/usr/bin/env node
// Zero-dependency link checker for the repository's own docs.
// Checks relative links in Markdown files (and href/src in site/*.html): the target file must
// exist and, for Markdown targets, a `#fragment` must match a heading (GitHub slug rules).
// External links (http:, mailto:, …) are not fetched.
// Usage: node scripts/check-links.mjs [root]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(process.argv[2] || path.join(path.dirname(fileURLToPath(import.meta.url)), '..'));

// Directories that are not checked: generated output, research notes, read-only drafts, and the
// skill's output templates (their links point into the *generated* project, not into this repo).
const SKIP_DIRS = new Set(['.git', 'node_modules', 'dist', '.research', 'reff-docs', 'coverage', '.idea', '.vscode']);
const SKIP_PREFIXES = ['skills/start-from-here/assets/templates/', 'test/model-runs/'];

const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (SKIP_PREFIXES.some((p) => (rel(full) + '/').startsWith(p))) continue;
    if (e.isDirectory()) walk(full, out);
    else if (/\.(md|html)$/i.test(e.name)) out.push(full);
  }
  return out;
}

/** Remove fenced code blocks and inline code so example links aren't checked. */
function stripCode(md) {
  return md
    .replace(/^( {0,3})(`{3,}|~{3,})[^\n]*\n[\s\S]*?\n {0,3}\2[^\n]*$/gm, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/`[^`\n]*`/g, (m) => ' '.repeat(m.length))
    .replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, ' '));
}

/** GitHub-style heading slug. */
export function slugify(text) {
  let s = text.trim().toLowerCase();
  for (let prev; prev !== s; ) {
    prev = s;
    s = s.replace(/<[^>]+>/g, '');
  }
  return s
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[`*_~]/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s/g, '-');
}

const anchorCache = new Map();
function anchorsOf(file) {
  if (anchorCache.has(file)) return anchorCache.get(file);
  const set = new Set();
  const seen = new Map();
  const src = stripCode(fs.readFileSync(file, 'utf8'));
  for (const m of src.matchAll(/^ {0,3}#{1,6}\s+(.+?)\s*#*\s*$/gm)) {
    const base = slugify(m[1]);
    const n = seen.get(base) || 0;
    seen.set(base, n + 1);
    set.add(n ? `${base}-${n}` : base);
  }
  for (const m of src.matchAll(/<a\s+(?:name|id)="([^"]+)"/g)) set.add(m[1]);
  anchorCache.set(file, set);
  return set;
}

function htmlIds(file) {
  if (anchorCache.has(file)) return anchorCache.get(file);
  const set = new Set([...fs.readFileSync(file, 'utf8').matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  anchorCache.set(file, set);
  return set;
}

function linksIn(file) {
  const text = fs.readFileSync(file, 'utf8');
  const out = [];
  if (file.endsWith('.md')) {
    const src = stripCode(text);
    // inline links/images: [text](target "title")
    for (const m of src.matchAll(/!?\[(?:[^\[\]]|\[[^\]]*\])*\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g)) out.push(m[1]);
    // reference definitions: [id]: target
    for (const m of src.matchAll(/^ {0,3}\[[^\]]+\]:\s*<?(\S+?)>?(?:\s+.*)?$/gm)) out.push(m[1]);
    // raw HTML in markdown
    for (const m of src.matchAll(/\s(?:href|src)="([^"]+)"/g)) out.push(m[1]);
  } else {
    // <base href> only changes resolution (its target is the same directory here), so skip it.
    const html = text.replace(/<base\b[^>]*>/gi, '');
    for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) out.push(m[1]);
  }
  return out;
}

const errors = [];
const files = walk(ROOT);
let checked = 0;
for (const file of files) {
  for (const raw of linksIn(file)) {
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(raw)) continue; // external / mailto / data
    if (raw.includes('{{') || raw.includes('<') || raw.startsWith('$')) continue; // placeholders
    checked++;
    const [pathPart, frag] = raw.split('#');
    let target = file;
    if (pathPart) {
      let decoded;
      try {
        decoded = decodeURIComponent(pathPart.split('?')[0]);
      } catch {
        decoded = pathPart;
      }
      target = decoded.startsWith('/') ? path.join(ROOT, decoded) : path.resolve(path.dirname(file), decoded);
      if (!fs.existsSync(target)) {
        errors.push(`${rel(file)}: broken link → ${raw}`);
        continue;
      }
      if (fs.statSync(target).isDirectory()) {
        if (file.endsWith('.html')) target = path.join(target, 'index.html');
        if (!frag) continue;
      }
    }
    if (frag && fs.existsSync(target) && fs.statSync(target).isFile()) {
      const ids = target.endsWith('.md') ? anchorsOf(target) : target.endsWith('.html') ? htmlIds(target) : null;
      if (ids && !ids.has(frag) && !ids.has(decodeURIComponent(frag))) errors.push(`${rel(file)}: missing anchor → ${raw}`);
    }
  }
}

if (errors.length) {
  for (const e of errors) console.error(`✖ ${e}`);
  console.error(`\n${errors.length} broken link(s) in ${files.length} files (${checked} relative links checked).`);
  process.exitCode = 1;
} else {
  console.log(`✔ ${checked} relative links OK in ${files.length} files.`);
}
