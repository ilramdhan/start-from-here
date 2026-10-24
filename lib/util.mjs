// Shared helpers: colors, paths, filesystem walking. Zero dependencies.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const SKILL_NAME = 'start-from-here';

/** Repository / package root (one level above lib/). */
export const PKG_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** The canonical skill source shipped in this package. */
export const SKILL_SRC = path.join(PKG_ROOT, 'skills', SKILL_NAME);

export function readPackageJson() {
  try {
    return JSON.parse(fs.readFileSync(path.join(PKG_ROOT, 'package.json'), 'utf8'));
  } catch {
    return { name: SKILL_NAME, version: '0.0.0' };
  }
}

// ---------- colors (respect NO_COLOR / FORCE_COLOR / TTY) ----------
function colorEnabled(stream = process.stdout) {
  if (process.env.NO_COLOR !== undefined && process.env.NO_COLOR !== '') return false;
  if (process.env.FORCE_COLOR && process.env.FORCE_COLOR !== '0') return true;
  return Boolean(stream && stream.isTTY) && process.env.TERM !== 'dumb';
}
const wrap = (open, close) => (s) => (colorEnabled() ? `\x1b[${open}m${s}\x1b[${close}m` : String(s));
export const c = {
  bold: wrap(1, 22),
  dim: wrap(2, 22),
  red: wrap(31, 39),
  green: wrap(32, 39),
  yellow: wrap(33, 39),
  blue: wrap(34, 39),
  cyan: wrap(36, 39),
  gray: wrap(90, 39),
};

export const log = {
  info: (m) => console.log(m),
  ok: (m) => console.log(`${c.green('✔')} ${m}`),
  warn: (m) => console.log(`${c.yellow('!')} ${m}`),
  err: (m) => console.error(`${c.red('✖')} ${m}`),
  step: (m) => console.log(`${c.cyan('→')} ${m}`),
};

// ---------- filesystem ----------
export function exists(p) {
  try {
    fs.lstatSync(p);
    return true;
  } catch {
    return false;
  }
}

export function isDir(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

/** Recursively list files (relative POSIX paths, sorted). Skips .git, node_modules, .DS_Store. */
export function walkFiles(root, { includeDirs = false } = {}) {
  const out = [];
  const skip = new Set(['.git', 'node_modules', '.DS_Store', 'Thumbs.db']);
  (function rec(dir, rel) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    entries.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
    for (const e of entries) {
      if (skip.has(e.name)) continue;
      const abs = path.join(dir, e.name);
      const r = rel ? `${rel}/${e.name}` : e.name;
      if (e.isDirectory()) {
        if (includeDirs) out.push(`${r}/`);
        rec(abs, r);
      } else if (e.isFile()) {
        out.push(r);
      } else if (e.isSymbolicLink()) {
        // Follow symlinks to files only (never recurse into linked dirs to avoid cycles).
        try {
          if (fs.statSync(abs).isFile()) out.push(r);
        } catch {
          /* dangling link: ignore */
        }
      }
    }
  })(root, '');
  return out;
}

/** Copy a directory tree (files only, no symlink preservation). */
export function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const rel of walkFiles(src)) {
    const from = path.join(src, ...rel.split('/'));
    const to = path.join(dest, ...rel.split('/'));
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to);
  }
}

/** Remove a file, symlink, or directory tree. */
export function removePath(p) {
  let st;
  try {
    st = fs.lstatSync(p);
  } catch {
    return;
  }
  if (st.isSymbolicLink() || !st.isDirectory()) fs.unlinkSync(p);
  else fs.rmSync(p, { recursive: true, force: true });
}

export function toPosix(p) {
  return p.split(path.sep).join('/');
}

/** Pretty path: relative to cwd when inside it, ~ for home. */
export function prettyPath(p, home) {
  const cwd = process.cwd();
  const rel = path.relative(cwd, p);
  if (rel && !rel.startsWith('..') && !path.isAbsolute(rel)) return rel;
  if (home && (p === home || p.startsWith(home + path.sep))) return `~${p.slice(home.length)}`;
  return p;
}

export function humanBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}
