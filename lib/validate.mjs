// Skill validator against the Agent Skills spec + this repo's distribution contract (blueprint §8).
import fs from 'node:fs';
import path from 'node:path';
import { parseFrontmatter } from './frontmatter.mjs';
import { walkFiles } from './util.mjs';

export const ALLOWED_KEYS = ['name', 'description', 'license', 'compatibility', 'metadata', 'allowed-tools'];
export const LIMITS = {
  descriptionMax: 200, // claude.ai upload limit (strictest surface)
  nameMax: 64,
  compatibilityMax: 500,
  skillMdMaxLines: 500, // must be strictly fewer
  fileMaxBytes: 1024 * 1024, // 1 MB per file
  totalWarnBytes: 5 * 1024 * 1024,
  totalMaxBytes: 25 * 1024 * 1024, // npx skills extracted limit (OpenAI 50MB zip, Claude API 30MB)
  maxFiles: 500, // OpenAI Skills API per version
  vibeFileWarnBytes: 256 * 1024, // Mistral Vibe copy limit (UNVERIFIED)
};

// Matches skill-relative paths such as references/workflow.md or assets/templates/docs/PRD.md
// Not preceded by a path char (so `.agents/skills/x/references/y` is ignored).
const PATH_RE = /(?<![\w./@-])((?:references|assets|scripts)\/[A-Za-z0-9_\-./]*[A-Za-z0-9_\-/])/g;

/** Extract skill-relative paths mentioned in a markdown text. Skips globs and placeholders. */
export function extractSkillPaths(text) {
  const out = new Set();
  for (const m of text.matchAll(PATH_RE)) {
    let p = m[1];
    const after = text.slice(m.index + m[0].length, m.index + m[0].length + 2);
    if (/^[*<{]/.test(after) || /^\.[*<{]/.test(after)) continue; // glob / placeholder continues
    p = p.replace(/\.+$/, '');
    if (p.includes('..')) continue;
    if (p.endsWith('/') && p.split('/').filter(Boolean).length < 1) continue;
    out.add(p);
  }
  return [...out];
}

/**
 * @param {string} skillDir
 * @returns {{errors:string[], warnings:string[], info:{name?:string, description?:string, lines?:number, files:number, bytes:number}}}
 */
export function validateSkill(skillDir) {
  const errors = [];
  const warnings = [];
  const info = { files: 0, bytes: 0 };
  const E = (m) => errors.push(m);
  const W = (m) => warnings.push(m);

  if (!fs.existsSync(skillDir) || !fs.statSync(skillDir).isDirectory()) {
    E(`skill directory not found: ${skillDir}`);
    return { errors, warnings, info };
  }
  const folder = path.basename(path.resolve(skillDir));
  const skillMd = path.join(skillDir, 'SKILL.md');
  const files = walkFiles(skillDir);
  info.files = files.length;

  // --- exactly one SKILL.md (case-insensitive, OpenAI rule) ---
  const skillMds = files.filter((f) => path.posix.basename(f).toLowerCase() === 'skill.md');
  if (!files.includes('SKILL.md')) E('SKILL.md missing at skill root (exact name, uppercase)');
  if (skillMds.length > 1) E(`exactly one SKILL.md allowed in the tree, found ${skillMds.length}: ${skillMds.join(', ')}`);

  // --- size checks ---
  let total = 0;
  let nonSkillBytes = 0;
  for (const f of files) {
    const st = fs.statSync(path.join(skillDir, ...f.split('/')));
    total += st.size;
    if (f !== 'SKILL.md') nonSkillBytes += st.size;
    if (st.size > LIMITS.fileMaxBytes) E(`file larger than 1 MB: ${f} (${st.size} bytes)`);
    else if (st.size > LIMITS.vibeFileWarnBytes) W(`file > 256 KiB may be skipped by Mistral Vibe: ${f}`);
    if (st.size === 0) W(`empty file: ${f}`);
  }
  info.bytes = total;
  if (total > LIMITS.totalMaxBytes) E(`total size ${total} bytes exceeds 25 MB`);
  else if (total > LIMITS.totalWarnBytes) W(`total size ${total} bytes is large (> 5 MB)`);
  if (nonSkillBytes > 1024 * 1024) W('non-SKILL.md content > 1 MiB; Mistral Vibe may skip the skill (UNVERIFIED limit)');
  if (files.length > LIMITS.maxFiles) E(`${files.length} files exceeds 500 (OpenAI Skills API limit)`);
  else if (files.length > 200) W(`${files.length} files (> 200) may exceed some agents' limits`);

  if (!fs.existsSync(skillMd)) return { errors, warnings, info };

  // --- frontmatter ---
  const text = fs.readFileSync(skillMd, 'utf8');
  const lines = text.split(/\r?\n/);
  if (lines.length && lines[lines.length - 1] === '') lines.pop();
  info.lines = lines.length;
  if (lines.length >= LIMITS.skillMdMaxLines) E(`SKILL.md has ${lines.length} lines; must be < ${LIMITS.skillMdMaxLines}`);
  else if (lines.length > 450) W(`SKILL.md has ${lines.length} lines; close to the 500-line limit`);

  const fm = parseFrontmatter(text);
  if (fm.error || !fm.data) {
    E(`frontmatter: ${fm.error || 'unparseable'}`);
    return { errors, warnings, info };
  }
  const d = fm.data;
  for (const k of Object.keys(d)) {
    if (!ALLOWED_KEYS.includes(k)) E(`frontmatter key "${k}" not allowed (allowed: ${ALLOWED_KEYS.join(', ')})`);
  }
  // name
  const name = d.name;
  info.name = name;
  if (typeof name !== 'string' || !name) E('frontmatter "name" is required');
  else {
    if (name.length > LIMITS.nameMax) E(`name longer than ${LIMITS.nameMax} chars`);
    if (!/^[a-z0-9-]+$/.test(name)) E(`name "${name}" must contain only a-z, 0-9 and "-"`);
    if (name.startsWith('-') || name.endsWith('-')) E('name must not start or end with "-"');
    if (name.includes('--')) E('name must not contain "--"');
    if (/anthropic|claude/.test(name)) E('name must not contain "anthropic" or "claude" (Anthropic surfaces reject it)');
    if (name !== folder) E(`name "${name}" must equal the folder name "${folder}"`);
  }
  // description
  const desc = d.description;
  info.description = desc;
  if (typeof desc !== 'string' || !desc.trim()) E('frontmatter "description" is required and must be non-empty');
  else {
    if (desc.length > LIMITS.descriptionMax) E(`description is ${desc.length} chars; max ${LIMITS.descriptionMax} (claude.ai upload limit)`);
    if (/<[a-zA-Z/][^>]*>/.test(desc)) E('description must not contain XML/HTML tags');
  }
  if (d.license !== undefined && (typeof d.license !== 'string' || !d.license)) E('"license" must be a non-empty string');
  if (d.compatibility !== undefined) {
    if (typeof d.compatibility !== 'string' || !d.compatibility) E('"compatibility" must be a non-empty string');
    else if (d.compatibility.length > LIMITS.compatibilityMax) E(`"compatibility" longer than ${LIMITS.compatibilityMax} chars`);
  }
  if (d.metadata !== undefined) {
    if (!d.metadata || typeof d.metadata !== 'object' || Array.isArray(d.metadata)) E('"metadata" must be a map of string → string');
    else for (const [k, v] of Object.entries(d.metadata)) if (typeof v !== 'string') E(`metadata.${k} must be a string`);
  }
  if (d['allowed-tools'] !== undefined && typeof d['allowed-tools'] !== 'string') E('"allowed-tools" must be a space-separated string');

  // --- referenced paths exist ---
  const docsToScan = ['SKILL.md', ...files.filter((f) => f.startsWith('references/') && f.endsWith('.md'))];
  const missing = new Map();
  for (const doc of docsToScan) {
    const t = fs.readFileSync(path.join(skillDir, ...doc.split('/')), 'utf8');
    for (const p of extractSkillPaths(t)) {
      const abs = path.join(skillDir, ...p.split('/').filter(Boolean));
      if (!fs.existsSync(abs)) {
        if (!missing.has(p)) missing.set(p, new Set());
        missing.get(p).add(doc);
      }
    }
  }
  for (const [p, from] of missing) {
    const msg = `referenced path does not exist: ${p} (mentioned in ${[...from].join(', ')})`;
    if (p.startsWith('scripts/')) W(msg);
    else E(msg);
  }

  // --- document catalog → templates ---
  const catalog = path.join(skillDir, 'references', 'document-catalog.md');
  if (!fs.existsSync(catalog)) W('references/document-catalog.md not found; template coverage not checked');
  else {
    const t = fs.readFileSync(catalog, 'utf8');
    const templ = extractSkillPaths(t).filter((p) => p.startsWith('assets/templates/') && !p.endsWith('/'));
    if (templ.length === 0) W('document-catalog.md references no assets/templates/… paths');
    // existence errors already reported above; summarise unused templates as info-level warnings
    const tplFiles = files.filter((f) => f.startsWith('assets/templates/'));
    const referenced = new Set(templ);
    // The catalog may use shorthand (`assets/templates/<same>`, output-path columns), so a template counts
    // as covered when its full path, its output path, or its file name appears in the catalog text.
    const covered = (f) => {
      const out = f.slice('assets/templates/'.length);
      return referenced.has(f) || t.includes(out) || t.includes(path.posix.basename(out)) || (out.startsWith('.github/') && t.includes('.github/*'));
    };
    const unused = tplFiles.filter((f) => !covered(f) && !f.startsWith('assets/templates/licenses/'));
    if (unused.length) W(`templates not listed in document-catalog.md: ${unused.join(', ')}`);
  }

  return { errors, warnings, info };
}
