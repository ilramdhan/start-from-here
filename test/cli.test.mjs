import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CLI = path.join(ROOT, 'bin', 'cli.mjs');
const SKILL = 'start-from-here';

function run(args, { cwd = ROOT, env = {} } = {}) {
  const r = spawnSync(process.execPath, [CLI, ...args], {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, NO_COLOR: '1', CI: '1', ...env },
  });
  return { code: r.status, out: `${r.stdout}${r.stderr}` };
}

function tmp() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'sfh-test-'));
}

const skillMd = (dir, ...p) => path.join(dir, ...p, SKILL, 'SKILL.md');

test('--version prints package version', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  const r = run(['--version']);
  assert.equal(r.code, 0);
  assert.equal(r.out.trim(), pkg.version);
});

test('--help lists every command', () => {
  const r = run(['--help']);
  assert.equal(r.code, 0);
  for (const cmd of ['install', 'uninstall', 'list-agents', 'doctor', 'bundle', 'check']) assert.match(r.out, new RegExp(cmd));
});

test('unknown command / option exits 2', () => {
  assert.equal(run(['frobnicate']).code, 2);
  assert.equal(run(['install', '--nope']).code, 2);
  assert.equal(run(['install', '--agent', 'not-an-agent', '--dir', tmp()]).code, 2);
});

test('list-agents shows table and flags UNVERIFIED; --json is valid', () => {
  const r = run(['list-agents']);
  assert.equal(r.code, 0);
  assert.match(r.out, /claude-code/);
  assert.match(r.out, /UNVERIFIED/);
  const j = run(['list-agents', '--json']);
  const data = JSON.parse(j.out);
  assert.ok(data.length >= 20);
  for (const a of data) {
    assert.equal(typeof a.verified, 'boolean');
    assert.ok(a.sourceUrl.startsWith('https://'), a.id);
  }
});

test('default install → .agents/skills + .claude/skills; uninstall removes them', () => {
  const dir = tmp();
  const r = run(['install', '--dir', dir]);
  assert.equal(r.code, 0, r.out);
  assert.ok(fs.existsSync(skillMd(dir, '.agents', 'skills')));
  assert.ok(fs.existsSync(skillMd(dir, '.claude', 'skills')));
  assert.ok(!fs.existsSync(path.join(dir, '.cline')));
  const u = run(['uninstall', '--dir', dir, '--yes']);
  assert.equal(u.code, 0, u.out);
  assert.ok(!fs.existsSync(path.join(dir, '.agents', 'skills', SKILL)));
  assert.ok(!fs.existsSync(path.join(dir, '.claude', 'skills', SKILL)));
});

test('multiple agents: shared .agents/skills is installed once, agent-specific dirs separately', () => {
  const dir = tmp();
  const r = run(['install', '--dir', dir, '--agent', 'cursor,github-copilot,zed,cline,kiro,trae', '--yes']);
  assert.equal(r.code, 0, r.out);
  for (const p of [['.agents', 'skills'], ['.cline', 'skills'], ['.kiro', 'skills'], ['.trae', 'skills']]) assert.ok(fs.existsSync(skillMd(dir, ...p)), p.join('/'));
  assert.equal((r.out.match(/\.agents[\\/]skills[\\/]start-from-here/g) || []).length, 1, 'universal dir listed once');
  // uninstall only selected agent
  const u = run(['uninstall', '--dir', dir, '--agent', 'kiro', '--yes']);
  assert.equal(u.code, 0);
  assert.ok(!fs.existsSync(path.join(dir, '.kiro', 'skills', SKILL)));
  assert.ok(fs.existsSync(skillMd(dir, '.cline', 'skills')));
});

test('--global installs into HOME (overridden for the test)', () => {
  const home = tmp();
  const env = { HOME: home, USERPROFILE: home };
  const r = run(['install', '--global', '--agent', 'claude-code,gemini-cli,universal', '--yes'], { env });
  assert.equal(r.code, 0, r.out);
  assert.ok(fs.existsSync(skillMd(home, '.claude', 'skills')));
  assert.ok(fs.existsSync(skillMd(home, '.gemini', 'skills')));
  assert.ok(fs.existsSync(skillMd(home, '.agents', 'skills')));
  const u = run(['uninstall', '--global', '--yes'], { env });
  assert.equal(u.code, 0);
  assert.ok(!fs.existsSync(path.join(home, '.claude', 'skills', SKILL)));
});

test('--dry-run writes nothing', () => {
  const dir = tmp();
  const r = run(['install', '--dir', dir, '--all', '--dry-run']);
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /would-install/);
  assert.deepEqual(fs.readdirSync(dir), []);
});

test('never overwrites without --force; --force replaces our own skill only', () => {
  const dir = tmp();
  assert.equal(run(['install', '--dir', dir, '--agent', 'claude-code']).code, 0);
  const f = skillMd(dir, '.claude', 'skills');
  const original = fs.readFileSync(f, 'utf8');
  fs.writeFileSync(f, `${original}\n<!-- local edit -->\n`);
  const r = run(['install', '--dir', dir, '--agent', 'claude-code']);
  assert.match(r.out, /skipped/);
  assert.match(r.out, /--force/);
  assert.ok(fs.readFileSync(f, 'utf8').includes('local edit'), 'not overwritten');
  const r2 = run(['install', '--dir', dir, '--agent', 'claude-code', '--force']);
  assert.match(r2.out, /replaced/);
  assert.equal(fs.readFileSync(f, 'utf8'), original);
});

test('a foreign folder with the same name is never replaced or removed', () => {
  const dir = tmp();
  const foreign = path.join(dir, '.claude', 'skills', SKILL);
  fs.mkdirSync(foreign, { recursive: true });
  fs.writeFileSync(path.join(foreign, 'SKILL.md'), '---\nname: something-else\ndescription: x\n---\n');
  const r = run(['install', '--dir', dir, '--agent', 'claude-code', '--force']);
  assert.match(r.out, /refusing/);
  assert.match(fs.readFileSync(path.join(foreign, 'SKILL.md'), 'utf8'), /something-else/);
  run(['uninstall', '--dir', dir, '--agent', 'claude-code', '--yes']);
  assert.ok(fs.existsSync(path.join(foreign, 'SKILL.md')));
});

test('rules-only agents: print by default, write pointer with --yes, never touch user files', () => {
  const dir = tmp();
  const r = run(['install', '--dir', dir, '--agent', 'amazon-q']);
  assert.equal(r.code, 0, r.out);
  assert.ok(!fs.existsSync(path.join(dir, '.amazonq')), 'nothing written without --yes');
  assert.ok(fs.existsSync(skillMd(dir, '.agents', 'skills')), 'skill placed in universal dir');

  const r2 = run(['install', '--dir', dir, '--agent', 'amazon-q,jetbrains-ai-assistant,aider', '--yes']);
  assert.equal(r2.code, 0, r2.out);
  assert.match(fs.readFileSync(path.join(dir, '.amazonq', 'rules', 'start-from-here.md'), 'utf8'), /SKILL\.md/);
  assert.ok(fs.existsSync(path.join(dir, '.aiassistant', 'rules', 'start-from-here.md')));
  assert.match(fs.readFileSync(path.join(dir, '.aider.conf.yml'), 'utf8'), /read:/);

  // existing user-owned aider config is left untouched, even with --force
  const dir2 = tmp();
  fs.writeFileSync(path.join(dir2, '.aider.conf.yml'), 'model: x\n');
  run(['install', '--dir', dir2, '--agent', 'aider', '--yes', '--force']);
  assert.equal(fs.readFileSync(path.join(dir2, '.aider.conf.yml'), 'utf8'), 'model: x\n');

  const u = run(['uninstall', '--dir', dir, '--yes']);
  assert.equal(u.code, 0);
  assert.ok(!fs.existsSync(path.join(dir, '.amazonq', 'rules', 'start-from-here.md')));
  assert.ok(!fs.existsSync(path.join(dir, '.aider.conf.yml')));
});

test('--symlink mode links agent dirs to the canonical copy (or falls back to copy)', () => {
  const dir = tmp();
  const r = run(['install', '--dir', dir, '--agent', 'universal,claude-code,cline', '--symlink']);
  assert.equal(r.code, 0, r.out);
  const claude = path.join(dir, '.claude', 'skills', SKILL);
  assert.ok(fs.existsSync(path.join(claude, 'SKILL.md')));
  if (fs.lstatSync(claude).isSymbolicLink()) {
    assert.equal(fs.realpathSync(claude), fs.realpathSync(path.join(dir, '.agents', 'skills', SKILL)));
  }
  run(['uninstall', '--dir', dir, '--yes']);
  assert.ok(!fs.existsSync(claude));
  assert.ok(!fs.existsSync(path.join(dir, '.agents', 'skills', SKILL)));
});

test('doctor reports installation', () => {
  const dir = tmp();
  run(['install', '--dir', dir]);
  const r = run(['doctor', '--dir', dir], { env: { HOME: tmp(), USERPROFILE: tmp() } });
  assert.match(r.out, /Installations/);
  assert.match(r.out, /\.claude[\\/]skills[\\/]start-from-here/);
});

test('check-docs does not flag session-mode HANDOVER.md (no status header / template sections)', () => {
  const dir = tmp();
  fs.mkdirSync(path.join(dir, 'docs', '.start-from-here'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'docs', '.start-from-here', 'STATE.md'), '# start-from-here state\n- tier: Lite\n- Mode: session\n');
  fs.writeFileSync(path.join(dir, 'docs', '.start-from-here', 'HANDOVER.md'), '# start-from-here handover\n\n## 1. Session\n- session: 2 · WP done: WP1\n');
  const script = path.join(ROOT, 'skills', SKILL, 'scripts', 'check-docs.mjs');
  const r = spawnSync(process.execPath, [script, dir, '--json'], { encoding: 'utf8' });
  const j = JSON.parse(r.stdout);
  const list = Array.isArray(j) ? j : j.findings;
  assert.ok(Array.isArray(list), 'findings array');
  assert.deepEqual(list.filter((f) => /HANDOVER/.test(f.file ?? '')), []);
});

test('check-docs: B2B legal docs are conditional on STATE.md flags (never expected by tier alone)', () => {
  const script = path.join(ROOT, 'skills', SKILL, 'scripts', 'check-docs.mjs');
  const legalPresence = (flags) => {
    const dir = tmp();
    fs.mkdirSync(path.join(dir, 'docs', '.start-from-here'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'docs', '.start-from-here', 'STATE.md'),
      `# start-from-here state\n- tier: Enterprise\n\n## Flags\n${flags}\n`);
    const r = spawnSync(process.execPath, [script, dir, '--json'], { encoding: 'utf8' });
    return JSON.parse(r.stdout).findings
      .filter((f) => f.check === 'presence' && /AGREEMENT/.test(f.file))
      .map((f) => `${f.severity}:${f.file}`).sort();
  };
  assert.deepEqual(legalPresence('- b2b: no\n- processor_for_customers: no\n- phi_for_covered_entities: no'), []);
  assert.deepEqual(legalPresence('- b2b: yes\n- processor_for_customers: yes\n- phi_for_covered_entities: yes'), [
    'warning:docs/legal/BUSINESS_ASSOCIATE_AGREEMENT.md',
    'warning:docs/legal/DATA_PROCESSING_AGREEMENT.md',
    'warning:docs/legal/MASTER_SERVICES_AGREEMENT.md',
  ]);
});

test('B2B legal templates carry the not-legal-advice notice and a status header', () => {
  for (const f of ['MASTER_SERVICES_AGREEMENT.md', 'DATA_PROCESSING_AGREEMENT.md', 'BUSINESS_ASSOCIATE_AGREEMENT.md']) {
    const text = fs.readFileSync(path.join(ROOT, 'skills', SKILL, 'assets', 'templates', 'docs', 'legal', f), 'utf8');
    assert.match(text, /This is a draft, not legal advice\. Have it reviewed by qualified counsel\./, f);
    assert.match(text, /\*\*Status:\*\* Draft/, f);
  }
});
