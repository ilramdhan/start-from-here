// Install / uninstall logic. Pure functions returning a plan, then an executor.
// Safety rules:
//  - Only ever writes inside <skillsRoot>/start-from-here (plus an explicitly requested rules pointer file).
//  - Never overwrites an existing target unless force=true.
//  - Uninstall only removes a dir that contains a SKILL.md whose name is start-from-here (or a symlink to one).
import fs from 'node:fs';
import path from 'node:path';
import { SKILL_NAME, SKILL_SRC, exists, copyDir, removePath, walkFiles } from './util.mjs';
import { resolveSkillsRoot } from './agents.mjs';
import { parseFrontmatter } from './frontmatter.mjs';

/**
 * @param {object} o
 * @param {import('./agents.mjs').Agent[]} o.agents
 * @param {'project'|'global'} o.scope
 * @param {string} o.projectDir
 * @param {string} o.home
 * @returns {{targets: {path:string, agents:string[]}[], rules: {agent:any, file:string|null}[]}}
 */
export function planTargets({ agents, scope, projectDir, home, env = process.env }) {
  const byPath = new Map();
  const rules = [];
  let needsUniversal = false;
  for (const a of agents) {
    if (a.kind === 'rules') {
      rules.push({ agent: a, file: a.rulesFile ? path.join(projectDir, ...a.rulesFile.split('/')) : null });
      needsUniversal = true; // rules agents read the skill from the universal location
      continue;
    }
    const root = resolveSkillsRoot(a, { scope, projectDir, home, env });
    if (!root) continue;
    const target = path.join(root, SKILL_NAME);
    const key = path.resolve(target);
    if (!byPath.has(key)) byPath.set(key, { path: target, agents: [] });
    byPath.get(key).agents.push(a.id);
  }
  if (needsUniversal) {
    const target = path.join(projectDir, '.agents', 'skills', SKILL_NAME);
    const key = path.resolve(target);
    if (!byPath.has(key)) byPath.set(key, { path: target, agents: ['(for rules agents)'] });
  }
  return { targets: [...byPath.values()], rules };
}

/** Is `dir` an installed copy (or symlink) of this skill? */
export function isOurSkill(dir) {
  const f = path.join(dir, 'SKILL.md');
  try {
    const fm = parseFrontmatter(fs.readFileSync(f, 'utf8'));
    return Boolean(fm.data && fm.data.name === SKILL_NAME);
  } catch {
    return false;
  }
}

export function readInstalledVersion(dir) {
  try {
    const fm = parseFrontmatter(fs.readFileSync(path.join(dir, 'SKILL.md'), 'utf8'));
    return (fm.data && fm.data.metadata && fm.data.metadata.version) || null;
  } catch {
    return null;
  }
}

/** Compare installed dir against source: returns {added, removed, changed} relative paths. */
export function diffDirs(src, dest) {
  const a = new Set(walkFiles(src));
  const b = new Set(walkFiles(dest));
  const added = [...a].filter((x) => !b.has(x));
  const removed = [...b].filter((x) => !a.has(x));
  const changed = [...a].filter((x) => {
    if (!b.has(x)) return false;
    try {
      const fa = fs.readFileSync(path.join(src, ...x.split('/')));
      const fb = fs.readFileSync(path.join(dest, ...x.split('/')));
      return !fa.equals(fb);
    } catch {
      return true;
    }
  });
  return { added, removed, changed };
}

/**
 * Execute an install for one target.
 * @returns {{status:'installed'|'skipped'|'replaced'|'would-install'|'would-replace'|'identical', detail?:string, diff?:object}}
 */
export function installTarget(target, { mode = 'copy', force = false, dryRun = false, src = SKILL_SRC, canonical = null }) {
  const dest = target.path;
  const present = exists(dest);
  if (present) {
    let same = false;
    let diff = null;
    try {
      const real = fs.realpathSync(dest);
      if (path.resolve(real) === path.resolve(src) || (canonical && path.resolve(real) === path.resolve(fs.realpathSync(canonical)))) same = true;
    } catch {
      /* ignore */
    }
    if (!same && fs.existsSync(path.join(dest, 'SKILL.md'))) {
      diff = diffDirs(src, dest);
      same = !diff.added.length && !diff.removed.length && !diff.changed.length;
    }
    if (same && !force) return { status: 'identical' };
    if (!force) return { status: 'skipped', detail: 'already exists (use --force to replace)', diff };
    if (!isOurSkill(dest) && fs.existsSync(path.join(dest, 'SKILL.md'))) {
      // Exists with a SKILL.md that is NOT ours: refuse even with --force.
      return { status: 'skipped', detail: 'contains a different skill; refusing to replace' };
    }
    if (dryRun) return { status: 'would-replace', diff };
    removePath(dest);
  } else if (dryRun) {
    return { status: 'would-install' };
  }

  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (mode === 'symlink') {
    const linkTo = canonical && path.resolve(canonical) !== path.resolve(dest) ? canonical : src;
    try {
      // 'junction' works on Windows without admin rights; ignored on POSIX.
      fs.symlinkSync(path.resolve(linkTo), dest, process.platform === 'win32' ? 'junction' : 'dir');
      return { status: present ? 'replaced' : 'installed', detail: `symlink → ${linkTo}` };
    } catch (e) {
      copyDir(src, dest);
      return { status: present ? 'replaced' : 'installed', detail: `symlink failed (${e.code || e.message}); copied instead` };
    }
  }
  copyDir(src, dest);
  return { status: present ? 'replaced' : 'installed' };
}

/** Uninstall a single target dir. */
export function uninstallTarget(target, { dryRun = false } = {}) {
  const dest = target.path;
  let st;
  try {
    st = fs.lstatSync(dest);
  } catch {
    return { status: 'absent' };
  }
  if (st.isSymbolicLink()) {
    if (dryRun) return { status: 'would-remove', detail: 'symlink' };
    fs.unlinkSync(dest);
    return { status: 'removed', detail: 'symlink' };
  }
  if (!isOurSkill(dest)) return { status: 'skipped', detail: `not a ${SKILL_NAME} skill folder; left untouched` };
  if (dryRun) return { status: 'would-remove' };
  removePath(dest);
  // Clean up empty parent "skills" dir we may have created (never anything else).
  try {
    const parent = path.dirname(dest);
    if (path.basename(parent) === 'skills' && fs.readdirSync(parent).length === 0) fs.rmdirSync(parent);
  } catch {
    /* ignore */
  }
  return { status: 'removed' };
}

export const RULES_MARKER = '<!-- managed-by: start-from-here -->';
export const YAML_MARKER = '# managed-by: start-from-here';

export function rulesPointerContent(skillRelPath, format = 'md') {
  if (format === 'aider-yaml') {
    return [
      YAML_MARKER,
      '# Loads the start-from-here skill into Aider as read-only context.',
      '# Add more files from the skill folder with /read when SKILL.md tells you to.',
      'read:',
      `  - ${skillRelPath}/SKILL.md`,
      '',
    ].join('\n');
  }
  return [
    RULES_MARKER,
    '# start-from-here (project discovery & pre-development docs)',
    '',
    'When the user asks to start a new project, plan an idea, kick off a repo, or write pre-code',
    `project documentation, read and follow \`${skillRelPath}/SKILL.md\` exactly.`,
    `Open files under \`${skillRelPath}/references/\` and \`${skillRelPath}/assets/templates/\` when SKILL.md tells you to.`,
    'Do not write application code while following that procedure.',
    '',
  ].join('\n');
}

const isManaged = (text) => text.startsWith(RULES_MARKER) || text.startsWith(YAML_MARKER);

/**
 * Write a pointer rules file. A file that exists and is NOT managed by us is never modified
 * (not even with --force) — the user owns it.
 */
export function writeRulesPointer(file, { dryRun = false, skillRelPath = '.agents/skills/start-from-here', format = 'md' } = {}) {
  const content = rulesPointerContent(skillRelPath, format);
  if (exists(file)) {
    const cur = fs.readFileSync(file, 'utf8');
    if (!isManaged(cur)) return { status: 'skipped', detail: 'exists and is not managed by start-from-here; left untouched — add the lines manually' };
    if (cur === content) return { status: 'identical' };
  }
  if (dryRun) return { status: 'would-write' };
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  return { status: 'written' };
}

export function removeRulesPointer(file, { dryRun = false } = {}) {
  if (!exists(file)) return { status: 'absent' };
  const cur = fs.readFileSync(file, 'utf8');
  if (!isManaged(cur)) return { status: 'skipped', detail: 'not managed by start-from-here; left untouched' };
  if (dryRun) return { status: 'would-remove' };
  fs.unlinkSync(file);
  return { status: 'removed' };
}
