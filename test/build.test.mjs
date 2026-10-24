import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { buildAll, GPT_INSTRUCTIONS_MAX, KNOWLEDGE_MAX_FILES } from '../lib/bundle.mjs';
import { listZip, crc32, createZip } from '../lib/zip.mjs';
import { validateSkill, extractSkillPaths } from '../lib/validate.mjs';
import { parseFrontmatter } from '../lib/frontmatter.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKILL_DIR = path.join(ROOT, 'skills', 'start-from-here');
const out = fs.mkdtempSync(path.join(os.tmpdir(), 'sfh-dist-'));
const result = buildAll({ outDir: out });

test('crc32 matches known vector', () => {
  assert.equal(crc32(Buffer.from('123456789')), 0xcbf43926);
});

test('zip round-trips (pure Node reader)', () => {
  const z = createZip([{ name: 'a/', dir: true }, { name: 'a/b.txt', data: Buffer.from('hello hello hello hello') }]);
  const e = listZip(z);
  assert.equal(e.length, 2);
  assert.ok(e.every((x) => x.ok));
  assert.equal(e[1].data.toString(), 'hello hello hello hello');
});

test('dist zip has top-level start-from-here/ folder with SKILL.md and CRCs ok', () => {
  const buf = fs.readFileSync(path.join(out, 'start-from-here.zip'));
  const entries = listZip(buf);
  assert.ok(entries.every((e) => e.name.startsWith('start-from-here/')));
  assert.ok(entries.some((e) => e.name === 'start-from-here/SKILL.md'));
  assert.ok(entries.every((e) => e.ok), 'all CRCs valid');
  assert.equal(entries.filter((e) => /(^|\/)skill\.md$/i.test(e.name)).length, 1, 'exactly one SKILL.md');
});

test('dist zip readable by system unzip (if available)', (t) => {
  const probe = spawnSync('unzip', ['-v'], { encoding: 'utf8' });
  if (probe.error || probe.status !== 0) return t.skip('unzip not installed');
  const r = spawnSync('unzip', ['-l', path.join(out, 'start-from-here.zip')], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /start-from-here\/SKILL\.md/);
  const t2 = spawnSync('unzip', ['-tq', path.join(out, 'start-from-here.zip')], { encoding: 'utf8' });
  assert.equal(t2.status, 0, t2.stdout + t2.stderr);
});

test('prompt bundle contains SKILL body, preamble and file separators', () => {
  const p = fs.readFileSync(path.join(out, 'start-from-here.prompt.md'), 'utf8');
  const skill = parseFrontmatter(fs.readFileSync(path.join(SKILL_DIR, 'SKILL.md'), 'utf8'));
  const firstHeading = skill.body.split('\n').find((l) => l.startsWith('# '));
  assert.ok(p.includes('=== FILE: SKILL.md ==='));
  assert.ok(p.includes(firstHeading), 'SKILL.md body included');
  assert.match(p, /chat-only mode/i);
  assert.ok(!/^---\nname:/m.test(p.split('=== FILE: SKILL.md ===')[1].slice(0, 200)), 'frontmatter stripped');
  if (fs.existsSync(path.join(SKILL_DIR, 'references'))) {
    for (const f of fs.readdirSync(path.join(SKILL_DIR, 'references'))) assert.ok(p.includes(`=== FILE: references/${f} ===`), f);
  }
  assert.ok(p.includes('=== FILE: assets/templates/'), 'templates included');
  assert.ok(!p.includes('=== FILE: scripts/'), 'scripts excluded');
});

test('session mode: reference + HANDOVER template ship in zip, prompt bundle and knowledge', () => {
  const rels = ['references/session-mode.md', 'assets/templates/docs/.start-from-here/HANDOVER.md'];
  const zipNames = listZip(fs.readFileSync(path.join(out, 'start-from-here.zip'))).map((e) => e.name);
  const p = fs.readFileSync(path.join(out, 'start-from-here.prompt.md'), 'utf8');
  const all = fs.readdirSync(path.join(out, 'knowledge')).map((f) => fs.readFileSync(path.join(out, 'knowledge', f), 'utf8')).join('\n');
  for (const r of rels) {
    assert.ok(zipNames.includes(`start-from-here/${r}`), `zip: ${r}`);
    assert.ok(p.includes(`=== FILE: ${r} ===`), `prompt: ${r}`);
    assert.ok(all.includes(`=== FILE: ${r} ===`), `knowledge: ${r}`);
  }
  const skill = fs.readFileSync(path.join(SKILL_DIR, 'SKILL.md'), 'utf8');
  assert.match(skill, /## Session mode/);
  assert.match(skill, /`next session`/);
  assert.match(fs.readFileSync(path.join(out, 'gpt-instructions.md'), 'utf8'), /session mode/i);
});

test('knowledge has ≤10 files; gpt instructions ≤8000 chars; gem instructions exist', () => {
  const k = fs.readdirSync(path.join(out, 'knowledge'));
  assert.ok(k.length >= 1 && k.length <= KNOWLEDGE_MAX_FILES, `${k.length} files`);
  assert.ok(fs.readdirSync(path.join(out, 'knowledge-txt')).length === k.length);
  const gpt = fs.readFileSync(path.join(out, 'gpt-instructions.md'), 'utf8');
  assert.ok(gpt.length <= GPT_INSTRUCTIONS_MAX, `${gpt.length}`);
  assert.ok(!/\{\{\w+\}\}/.test(gpt), 'no unfilled placeholders');
  assert.match(gpt, /01-skill-procedure\.md/);
  const gem = fs.readFileSync(path.join(out, 'gem-instructions.md'), 'utf8');
  assert.match(gem, /01-skill-procedure\.txt/);
  assert.equal(result.knowledgeFiles, k.length);
});

test('every skill text file appears in exactly one knowledge file', () => {
  const all = fs.readdirSync(path.join(out, 'knowledge')).map((f) => fs.readFileSync(path.join(out, 'knowledge', f), 'utf8')).join('\n');
  const prompt = fs.readFileSync(path.join(out, 'start-from-here.prompt.md'), 'utf8');
  const files = [...prompt.matchAll(/^=== FILE: (.+) ===$/gm)].map((m) => m[1]);
  for (const f of files) assert.equal(all.split(`=== FILE: ${f} ===`).length - 1, 1, f);
});

test('skill validates (no errors)', () => {
  const v = validateSkill(SKILL_DIR);
  assert.deepEqual(v.errors, []);
});

test('validator catches bad frontmatter, name mismatch, nested SKILL.md, missing refs', () => {
  const d = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'sfh-bad-')), 'bad-skill');
  fs.mkdirSync(path.join(d, 'assets'), { recursive: true });
  fs.writeFileSync(
    path.join(d, 'SKILL.md'),
    `---\nname: other-name\ndescription: ${'x'.repeat(250)}\nargument-hint: foo\n---\nSee references/missing.md\n`,
  );
  fs.writeFileSync(path.join(d, 'assets', 'skill.md'), 'nested');
  const v = validateSkill(d);
  const all = v.errors.join('\n');
  assert.match(all, /argument-hint/);
  assert.match(all, /folder name/);
  assert.match(all, /description is 250/);
  assert.match(all, /exactly one SKILL\.md/);
  assert.match(all, /references\/missing\.md/);
});

test('validate-skill script exits 0 on the shipped skill', () => {
  const r = spawnSync(process.execPath, [path.join(ROOT, 'scripts', 'validate-skill.mjs')], { encoding: 'utf8', env: { ...process.env, NO_COLOR: '1' } });
  assert.equal(r.status, 0, r.stdout + r.stderr);
});

test('extractSkillPaths ignores globs, placeholders and foreign prefixes', () => {
  const p = extractSkillPaths('see references/a.md, assets/templates/<same>, references/*.md, .agents/skills/x/references/b.md and `assets/templates/docs/PRD.md`.');
  assert.deepEqual(p.sort(), ['assets/templates/docs/PRD.md', 'references/a.md']);
});

test('manifests are valid JSON with consistent name/version', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  for (const f of ['.claude-plugin/plugin.json', '.codex-plugin/plugin.json', 'gemini-extension.json']) {
    const j = JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
    assert.equal(j.name, 'start-from-here', f);
    assert.equal(j.version, pkg.version, f);
  }
  const m = JSON.parse(fs.readFileSync(path.join(ROOT, '.claude-plugin', 'marketplace.json'), 'utf8'));
  assert.equal(m.plugins[0].name, 'start-from-here');
  const g = JSON.parse(fs.readFileSync(path.join(ROOT, 'gemini-extension.json'), 'utf8'));
  assert.ok(fs.existsSync(path.join(ROOT, g.contextFileName)));
  assert.match(fs.readFileSync(path.join(ROOT, 'commands', 'start-from-here.toml'), 'utf8'), /^prompt = """/m);
  const skillVer = parseFrontmatter(fs.readFileSync(path.join(SKILL_DIR, 'SKILL.md'), 'utf8')).data.metadata?.version;
  if (skillVer) assert.equal(skillVer, pkg.version, 'SKILL.md metadata.version matches package.json');
});

test('frontmatter parser ignores trailing release-please annotation comments', () => {
  const fm = parseFrontmatter('---\nname: x\nmetadata:\n  version: "1.2.3" # x-release-please-version\n  note: "a # b"\n---\nbody');
  assert.equal(fm.data.metadata.version, '1.2.3');
  assert.equal(fm.data.metadata.note, 'a # b');
});
