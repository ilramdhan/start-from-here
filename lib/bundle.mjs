// Build distribution artifacts for non-filesystem platforms:
//   dist/start-from-here.zip         upload zip (top-level folder start-from-here/)
//   dist/start-from-here.prompt.md   single flattened file for chat-only LLMs
//   dist/knowledge/*.md              ≤10 grouped knowledge files (Custom GPT, Projects, Gems)
//   dist/knowledge-txt/*.txt         same content as .txt (Gems: .md acceptance UNVERIFIED)
//   dist/gpt-instructions.md         ≤8000 chars bootloader (hard-checked)
//   dist/gem-instructions.md         bootloader for Gemini Gems
//   dist/SHA256SUMS                  checksums for release assets
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { SKILL_NAME, SKILL_SRC, PKG_ROOT, walkFiles, readPackageJson } from './util.mjs';
import { parseFrontmatter } from './frontmatter.mjs';
import { createZip } from './zip.mjs';

export const GPT_INSTRUCTIONS_MAX = 8000;
export const KNOWLEDGE_MAX_FILES = 10;

const TEXT_EXT = new Set(['.md', '.txt', '.yml', '.yaml', '.json', '.toml', '.mjs', '.js', '.cjs', '.py', '.sh', '']);
const isText = (f) => TEXT_EXT.has(path.posix.extname(f).toLowerCase()) || /(^|\/)(LICENSE|CODEOWNERS|Modelfile)[^/]*$/.test(f);

/** Knowledge groups (order = file order). First matching rule wins. */
export const KNOWLEDGE_GROUPS = [
  { file: '01-skill-procedure.md', title: 'Core procedure (SKILL.md)', match: (f) => f === 'SKILL.md' },
  {
    file: '02-workflow-and-documents.md',
    title: 'Workflow, tiers, document catalog and session mode',
    match: (f) => /^references\/(workflow|tiering-and-doc-matrix|document-catalog|session-mode)\.md$/.test(f),
  },
  {
    file: '03-discovery-and-modes.md',
    title: 'Discovery questions, experience modes, existing-project mode',
    match: (f) => /^references\/(discovery-question-bank|experience-modes|existing-project-mode)\.md$/.test(f),
  },
  {
    file: '04-stack-and-legal.md',
    title: 'Stack recommendation and legal/compliance primer',
    match: (f) => /^references\/(stack-recommendation|legal-compliance-primer)\.md$/.test(f),
  },
  { file: '05-quality-and-conventions.md', title: 'Writing conventions, consistency audit, other references', match: (f) => f.startsWith('references/') },
  {
    file: '06-templates-product.md',
    title: 'Templates: docs index, discovery, session handover, product',
    match: (f) => /^assets\/templates\/docs\/(README\.md|DISCOVERY\.md|\.start-from-here\/|product\/)/.test(f),
  },
  {
    file: '07-templates-technical.md',
    title: 'Templates: technical and decisions (ADR)',
    match: (f) => /^assets\/templates\/docs\/(technical|decisions)\//.test(f),
  },
  {
    file: '08-templates-engineering-legal.md',
    title: 'Templates: engineering and legal',
    match: (f) => /^assets\/templates\/docs\//.test(f),
  },
  {
    file: '09-templates-repo-and-agents.md',
    title: 'Templates: repo root, community, GitHub, AI agent files',
    match: (f) => f.startsWith('assets/templates/') && !f.startsWith('assets/templates/licenses/'),
  },
  { file: '10-licenses-and-other.md', title: 'License texts and other assets', match: (f) => f.startsWith('assets/') },
];

function stripFrontmatter(text) {
  const fm = parseFrontmatter(text);
  return fm.data ? fm.body.replace(/^\s*\n/, '') : text;
}

function fence(content) {
  // choose a fence longer than any backtick run inside the content
  const runs = content.match(/`{3,}/g) || [];
  const n = Math.max(3, ...runs.map((r) => r.length + 1));
  return '`'.repeat(n);
}

/** Read all text files of the skill as [{rel, text}]. */
export function readSkillFiles(skillDir = SKILL_SRC) {
  return walkFiles(skillDir)
    .filter(isText)
    .map((rel) => ({ rel, text: fs.readFileSync(path.join(skillDir, ...rel.split('/')), 'utf8') }));
}

function fileBlock(rel, text) {
  const body = rel.endsWith('.md') ? text : `${fence(text)}\n${text.replace(/\n$/, '')}\n${fence(text)}\n`;
  return `\n=== FILE: ${rel} ===\n\n${body.replace(/\s+$/, '')}\n\n=== END FILE: ${rel} ===\n`;
}

function orderFiles(files) {
  const rank = (f) => (f === 'SKILL.md' ? 0 : f.startsWith('references/') ? 1 : f.startsWith('assets/') ? 2 : 3);
  return [...files].sort((a, b) => rank(a.rel) - rank(b.rel) || (a.rel < b.rel ? -1 : 1));
}

export function buildPromptBundle(files, { version, description }) {
  const pre = [
    `# ${SKILL_NAME} — single-file prompt bundle (v${version})`,
    '',
    '> This file is the whole `start-from-here` Agent Skill flattened into one document for chat-only AI tools',
    '> (Custom GPTs, Gemini Gems, Claude/ChatGPT Projects, Le Chat, Perplexity, Ollama, LM Studio, any LLM).',
    '',
    `**What it does:** ${description}`,
    '',
    '## How to use this file (chat-only mode)',
    '',
    '1. Paste this whole file as the system prompt / custom instructions, or attach it to the chat and say:',
    '   "Follow the start-from-here procedure in the attached file. Start now."',
    '2. The procedure begins at `=== FILE: SKILL.md ===`. Follow it exactly. It is the source of truth.',
    '3. When SKILL.md says "read `references/…`" or "use `assets/templates/…`", find the matching',
    '   `=== FILE: <path> ===` section below instead of opening a file.',
    '4. You cannot write files here. Deliver every generated document as a fenced Markdown code block',
    '   preceded by a heading with its target path (for example `### docs/product/PRD.md`), so the user can save it.',
    '5. `scripts/` cannot run in chat. Perform the equivalent checks manually (consistency audit).',
    '6. Never write application code. Never invent facts; mark unknowns `[TBD: …]`.',
    '',
    '## Files in this bundle',
    '',
    ...files.map((f) => `- \`${f.rel}\``),
    '',
  ].join('\n');
  const blocks = files.map((f) => fileBlock(f.rel, f.rel === 'SKILL.md' ? stripFrontmatter(f.text) : f.text));
  return `${pre}${blocks.join('')}`;
}

export function groupKnowledge(files) {
  const groups = KNOWLEDGE_GROUPS.map((g) => ({ ...g, items: [] }));
  for (const f of files) {
    const g = groups.find((x) => x.match(f.rel));
    if (g) g.items.push(f);
  }
  return groups.filter((g) => g.items.length);
}

function renderKnowledge(group, version) {
  const head = [
    `# start-from-here knowledge: ${group.title} (v${version})`,
    '',
    'Part of the start-from-here skill. Each section below is one original file; its path is in the `=== FILE: … ===` line.',
    'When the procedure mentions a path such as `references/workflow.md` or `assets/templates/docs/product/PRD.md`, use the section with that path.',
    '',
    'Contents:',
    ...group.items.map((f) => `- \`${f.rel}\``),
    '',
  ].join('\n');
  return head + group.items.map((f) => fileBlock(f.rel, f.rel === 'SKILL.md' ? stripFrontmatter(f.text) : f.text)).join('');
}

/** Fill a bootloader template. Removes `<!-- … -->` maintainer comments. */
export function renderBootloader(template, vars) {
  let out = template;
  for (let prev; prev !== out; ) {
    prev = out;
    out = out.replace(/<!--[\s\S]*?-->\n?/g, '');
  }
  out = out.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
  return out.replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

function extractTemplate(md) {
  // Everything after the "## TEMPLATE" line (to end of file).
  const m = md.match(/^## TEMPLATE[ \t]*\r?\n/m);
  return m ? md.slice(m.index + m[0].length) : null;
}

/**
 * Build all artifacts.
 * @returns {{outDir:string, artifacts:{path:string, bytes:number}[], warnings:string[]}}
 */
export function buildAll({ outDir = path.join(PKG_ROOT, 'dist'), skillDir = SKILL_SRC, adaptersDir = path.join(PKG_ROOT, 'adapters') } = {}) {
  const warnings = [];
  const pkg = readPackageJson();
  const version = pkg.version || '0.0.0';
  if (!fs.existsSync(path.join(skillDir, 'SKILL.md'))) throw new Error(`SKILL.md not found in ${skillDir}`);

  const skillText = fs.readFileSync(path.join(skillDir, 'SKILL.md'), 'utf8');
  const fm = parseFrontmatter(skillText);
  const description = (fm.data && fm.data.description) || '';

  // Clean only the artifacts we own inside outDir.
  fs.mkdirSync(outDir, { recursive: true });
  for (const n of [`${SKILL_NAME}.zip`, `${SKILL_NAME}.prompt.md`, 'gpt-instructions.md', 'gem-instructions.md', 'SHA256SUMS', 'knowledge', 'knowledge-txt']) {
    fs.rmSync(path.join(outDir, n), { recursive: true, force: true });
  }
  const artifacts = [];
  const write = (rel, data) => {
    const p = path.join(outDir, ...rel.split('/'));
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, data);
    artifacts.push({ path: rel, bytes: Buffer.byteLength(data) });
  };

  // 1) zip — every file (binary too), top-level folder = skill name
  const all = walkFiles(skillDir);
  const dirs = new Set([`${SKILL_NAME}/`]);
  for (const rel of all) {
    const parts = rel.split('/');
    for (let i = 1; i < parts.length; i++) dirs.add(`${SKILL_NAME}/${parts.slice(0, i).join('/')}/`);
  }
  const entries = [
    ...[...dirs].sort().map((d) => ({ name: d, dir: true })),
    ...all.map((rel) => {
      const abs = path.join(skillDir, ...rel.split('/'));
      // Single open: stat and read the same descriptor so the file cannot change in between.
      const fd = fs.openSync(abs, 'r');
      let mode;
      let data;
      try {
        mode = fs.fstatSync(fd).mode;
        data = fs.readFileSync(fd);
      } finally {
        fs.closeSync(fd);
      }
      const exec = (mode & 0o111) !== 0 || rel.startsWith('scripts/');
      return { name: `${SKILL_NAME}/${rel}`, data, mode: exec ? 0o100755 : 0o100644 };
    }),
  ];
  write(`${SKILL_NAME}.zip`, createZip(entries));

  // 2) flattened prompt bundle — SKILL.md, references, templates (scripts excluded: cannot run in chat)
  const textFiles = orderFiles(readSkillFiles(skillDir).filter((f) => !f.rel.startsWith('scripts/')));
  write(`${SKILL_NAME}.prompt.md`, buildPromptBundle(textFiles, { version, description }));

  // 3) knowledge files (≤10)
  const groups = groupKnowledge(textFiles);
  if (groups.length > KNOWLEDGE_MAX_FILES) throw new Error(`knowledge would have ${groups.length} files (> ${KNOWLEDGE_MAX_FILES})`);
  for (const g of groups) {
    const content = renderKnowledge(g, version);
    write(`knowledge/${g.file}`, content);
    write(`knowledge-txt/${g.file.replace(/\.md$/, '.txt')}`, content);
  }
  const missingRefs = textFiles.filter((f) => f.rel.startsWith('references/')).length === 0;
  if (missingRefs) warnings.push('no references/*.md found yet; knowledge files contain SKILL.md and templates only');

  // 4) bootloaders
  const tplPath = path.join(adaptersDir, 'chat-bootloader.md');
  if (!fs.existsSync(tplPath)) throw new Error(`missing ${tplPath}`);
  const tplSrc = fs.readFileSync(tplPath, 'utf8');
  const tpl = extractTemplate(tplSrc) || tplSrc;
  const knowledgeList = groups.map((g) => `- ${g.file} — ${g.title}`).join('\n');
  const knowledgeListTxt = groups.map((g) => `- ${g.file.replace(/\.md$/, '.txt')} — ${g.title}`).join('\n');
  const gpt = renderBootloader(tpl, {
    platform: 'Custom GPT / ChatGPT Project',
    knowledge_word: 'Knowledge',
    knowledge_files: knowledgeList,
    first_file: groups[0] ? groups[0].file : '01-skill-procedure.md',
    version,
    description,
  });
  if (gpt.length > GPT_INSTRUCTIONS_MAX) throw new Error(`gpt-instructions.md is ${gpt.length} chars (> ${GPT_INSTRUCTIONS_MAX})`);
  write('gpt-instructions.md', gpt);
  const gem = renderBootloader(tpl, {
    platform: 'Gemini Gem',
    knowledge_word: 'Knowledge',
    knowledge_files: knowledgeListTxt,
    first_file: groups[0] ? groups[0].file.replace(/\.md$/, '.txt') : '01-skill-procedure.txt',
    version,
    description,
  });
  write('gem-instructions.md', gem);

  // 5) checksums for release assets
  const sums = artifacts
    .map((a) => `${crypto.createHash('sha256').update(fs.readFileSync(path.join(outDir, ...a.path.split('/')))).digest('hex')}  ${a.path}`)
    .join('\n');
  write('SHA256SUMS', `${sums}\n`);

  return { outDir, artifacts, warnings, gptChars: gpt.length, knowledgeFiles: groups.length };
}
