#!/usr/bin/env node
// start-from-here — zero-dependency installer CLI for the start-from-here Agent Skill.
// Node >= 18. ESM. Works on Windows, macOS, Linux.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import readline from 'node:readline';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { AGENTS, DEFAULT_AGENT_IDS, findAgent, skillAgents, rulesAgents, detectAgents, resolveSkillsRoot } from '../lib/agents.mjs';
import { planTargets, installTarget, uninstallTarget, isOurSkill, readInstalledVersion, writeRulesPointer, removeRulesPointer } from '../lib/install.mjs';
import { validateSkill } from '../lib/validate.mjs';
import { buildAll } from '../lib/bundle.mjs';
import { c, log, exists, prettyPath, readPackageJson, SKILL_NAME, SKILL_SRC, humanBytes } from '../lib/util.mjs';

const pkg = readPackageJson();
const VERSION = pkg.version;

const HELP = `${c.bold('start-from-here')} v${VERSION} — install the start-from-here Agent Skill into your AI coding agents

${c.bold('Usage')}
  npx start-from-here@latest <command> [options]

${c.bold('Commands')}
  install            Install the skill (default: .agents/skills + .claude/skills in this project)
  uninstall          Remove the skill from the same targets
  list-agents        Show supported agents and their skill folders
  doctor             Show where the skill is installed, versions, and validity
  bundle             Build zip + single-file prompt + knowledge files (for chat apps)
  check [dir]        Check generated project docs (runs the skill's check-docs.mjs)
  help               Show this help

${c.bold('Options')}
  -a, --agent <ids>  Comma-separated agent ids (see list-agents). Repeatable.
      --all          All skill-capable agents
  -g, --global       Install into your home directory instead of the project
      --dir <path>   Project directory (default: current directory)
      --copy         Copy files (default; safest on Windows)
      --symlink      Symlink agent folders to one canonical copy (falls back to copy)
  -f, --force        Replace an existing installation
  -y, --yes          No prompts; for rules-only agents also write a pointer rules file
  -n, --dry-run      Show what would happen, change nothing
      --out <dir>    Output directory for bundle (default: ./dist)
  -h, --help         Show help
  -v, --version      Show version

${c.bold('Examples')}
  npx start-from-here@latest install                       # universal + Claude Code, this project
  npx start-from-here@latest install -a cursor,cline -y
  npx start-from-here@latest install --global --all
  npx start-from-here@latest install -a aider             # prints how to load it in Aider
  npx start-from-here@latest uninstall --dry-run
  npx start-from-here@latest bundle --out ./dist

Then ask your agent: "Use the start-from-here skill to plan my new project."
Docs: https://github.com/ilramdhan/start-from-here/tree/main/docs/guides
`;

// ---------------- argv parsing ----------------
export function parseArgs(argv) {
  const opts = { _: [], agents: [], all: false, global: false, dir: null, mode: 'copy', force: false, yes: false, dryRun: false, out: null, help: false, version: false };
  const takeValue = (i, name) => {
    const v = argv[i + 1];
    if (v === undefined || v.startsWith('-')) throw new UsageError(`${name} requires a value`);
    return v;
  };
  for (let i = 0; i < argv.length; i++) {
    let a = argv[i];
    let inline = null;
    if (a.startsWith('--') && a.includes('=')) {
      inline = a.slice(a.indexOf('=') + 1);
      a = a.slice(0, a.indexOf('='));
    }
    const val = (name) => {
      if (inline !== null) return inline;
      const v = takeValue(i, name);
      i++;
      return v;
    };
    switch (a) {
      case '-a':
      case '--agent':
      case '--agents':
        opts.agents.push(...val(a).split(',').map((s) => s.trim()).filter(Boolean));
        break;
      case '--all':
        opts.all = true;
        break;
      case '-g':
      case '--global':
        opts.global = true;
        break;
      case '--project':
        opts.global = false;
        break;
      case '--dir':
        opts.dir = val(a);
        break;
      case '--copy':
        opts.mode = 'copy';
        break;
      case '--symlink':
      case '--link':
        opts.mode = 'symlink';
        break;
      case '-f':
      case '--force':
        opts.force = true;
        break;
      case '-y':
      case '--yes':
        opts.yes = true;
        break;
      case '-n':
      case '--dry-run':
        opts.dryRun = true;
        break;
      case '--out':
        opts.out = val(a);
        break;
      case '--json':
        opts.json = true;
        break;
      case '-h':
      case '--help':
        opts.help = true;
        break;
      case '-v':
      case '-V':
      case '--version':
        opts.version = true;
        break;
      default:
        if (a.startsWith('-')) throw new UsageError(`unknown option: ${a}`);
        opts._.push(a);
    }
  }
  return opts;
}

class UsageError extends Error {}

// ---------------- prompts ----------------
async function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    return await new Promise((resolve) => rl.question(question, (ans) => resolve(ans.trim())));
  } finally {
    rl.close();
  }
}

const interactive = (opts) => !opts.yes && !opts.dryRun && process.stdin.isTTY && process.stdout.isTTY && !process.env.CI;

function ctx(opts) {
  return {
    projectDir: path.resolve(opts.dir || process.cwd()),
    home: os.homedir(),
    scope: opts.global ? 'global' : 'project',
    env: process.env,
  };
}

function resolveAgentList(ids) {
  const out = [];
  for (const id of ids) {
    const a = findAgent(id);
    if (!a) throw new UsageError(`unknown agent "${id}". Run "start-from-here list-agents" to see valid ids.`);
    if (!out.includes(a)) out.push(a);
  }
  return out;
}

async function chooseAgents(opts, { forUninstall = false } = {}) {
  const k = ctx(opts);
  if (opts.all) return skillAgents();
  if (opts.agents.length) return resolveAgentList(opts.agents);
  const defaults = resolveAgentList(DEFAULT_AGENT_IDS);
  if (forUninstall) {
    // Uninstall default: every skill agent location (only our own folders are ever removed).
    return skillAgents();
  }
  const detected = detectAgents({ projectDir: k.projectDir, home: k.home, env: k.env, exists });
  if (!interactive(opts)) return defaults;

  log.info(c.bold(`\nInstall start-from-here (${k.scope === 'global' ? 'global: your home folder' : `project: ${prettyPath(k.projectDir, k.home)}`})`));
  log.info(`Default targets: ${c.cyan('.agents/skills')} (Codex, Copilot, Cursor, Gemini CLI, Antigravity, OpenCode, Roo, Zed, Junie, Goose, Amp…) + ${c.cyan('.claude/skills')} (Claude Code)`);
  const extra = detected.filter((d) => !DEFAULT_AGENT_IDS.includes(d.agent.id));
  if (extra.length) {
    log.info('\nDetected other agents:');
    extra.forEach((d, i) => log.info(`  ${c.bold(String(i + 1).padStart(2))}. ${d.agent.displayName} ${c.gray(`(${d.hits.join(', ')})`)}`));
  }
  const ans = await ask(
    `\nPress ${c.bold('Enter')} for defaults${extra.length ? `, type numbers (e.g. 1,3) to add detected agents, ${c.bold('a')} for defaults + all detected` : ''}, or agent ids (e.g. cline,kiro): `,
  );
  if (!ans) return defaults;
  if (ans.toLowerCase() === 'a') return [...new Set([...defaults, ...extra.map((d) => d.agent)])];
  const picks = [...defaults];
  for (const tok of ans.split(/[\s,]+/).filter(Boolean)) {
    if (/^\d+$/.test(tok)) {
      const d = extra[Number(tok) - 1];
      if (!d) throw new UsageError(`no detected agent #${tok}`);
      picks.push(d.agent);
    } else picks.push(...resolveAgentList([tok]));
  }
  return [...new Set(picks)];
}

// ---------------- commands ----------------
const STATUS_STYLE = {
  installed: (s) => c.green(s),
  replaced: (s) => c.green(s),
  written: (s) => c.green(s),
  removed: (s) => c.green(s),
  identical: (s) => c.gray(s),
  absent: (s) => c.gray(s),
  skipped: (s) => c.yellow(s),
};
const styled = (st) => (STATUS_STYLE[st] || ((s) => c.cyan(s)))(st);

async function cmdInstall(opts) {
  if (!fs.existsSync(path.join(SKILL_SRC, 'SKILL.md'))) {
    log.err(`skill source not found at ${SKILL_SRC}`);
    return 1;
  }
  const k = ctx(opts);
  if (k.scope === 'project' && !fs.existsSync(k.projectDir)) {
    log.err(`project directory does not exist: ${k.projectDir}`);
    return 1;
  }
  const agents = await chooseAgents(opts);
  const { targets, rules } = planTargets({ agents, scope: k.scope, projectDir: k.projectDir, home: k.home, env: k.env });
  if (opts.dryRun) log.info(c.yellow('Dry run — nothing will be written.'));

  // canonical copy for symlink mode = first target (usually .agents/skills/start-from-here)
  const canonical = targets[0] ? targets[0].path : null;
  const problems = 0;
  let skipped = 0;
  for (const [i, t] of targets.entries()) {
    const r = installTarget(t, { mode: i === 0 ? 'copy' : opts.mode, force: opts.force, dryRun: opts.dryRun, canonical: i === 0 ? null : canonical });
    log.info(`${styled(r.status).padEnd(14)} ${prettyPath(t.path, k.home)} ${c.gray(`[${t.agents.join(', ')}]`)}${r.detail ? c.gray(` — ${r.detail}`) : ''}`);
    if (r.status === 'skipped') {
      skipped++;
      if (r.diff) {
        const { added, removed, changed } = r.diff;
        const parts = [];
        if (changed.length) parts.push(`${changed.length} changed`);
        if (added.length) parts.push(`${added.length} new`);
        if (removed.length) parts.push(`${removed.length} extra local`);
        if (parts.length) log.info(c.gray(`               differs from this version: ${parts.join(', ')}${changed.length ? ` (e.g. ${changed.slice(0, 3).join(', ')})` : ''}`));
        log.info(c.gray(`               compare: diff -r "${SKILL_SRC}" "${t.path}"   ·   replace: add --force`));
      }
    }
  }

  // rules-only fallback agents
  for (const { agent, file } of rules) {
    log.info(`\n${c.bold(agent.displayName)} ${c.gray('(no native skills — rules fallback)')}`);
    if (opts.global) log.warn('rules fallback is project-only; skill installed to the universal folder only');
    if (file && opts.yes) {
      const r = writeRulesPointer(file, { dryRun: opts.dryRun, format: agent.rulesFormat || 'md' });
      log.info(`${styled(r.status).padEnd(14)} ${prettyPath(file, k.home)}${r.detail ? c.gray(` — ${r.detail}`) : ''}`);
      if (r.status === 'skipped') {
        for (const line of agent.manualHint.split('\n')) log.info(`  ${line}`);
      }
    } else {
      for (const line of agent.manualHint.split('\n')) log.info(`  ${line}`);
    }
  }

  if (!opts.dryRun) {
    log.info('');
    if (skipped && !opts.force) log.warn(`${skipped} target(s) already existed and were left unchanged. Re-run with --force to replace.`);
    log.ok(`Done. Ask your agent: ${c.bold('"Use the start-from-here skill to plan my new project."')}`);
    if (agents.some((a) => a.id === 'claude-code')) log.info(c.gray('  Claude Code: type /start-from-here (run /reload-skills if the folder is new).'));
    if (agents.some((a) => ['codex'].includes(a.id))) log.info(c.gray('  Codex: type $start-from-here or /skills.'));
  }
  return problems ? 1 : 0;
}

async function cmdUninstall(opts) {
  const k = ctx(opts);
  const agents = await chooseAgents(opts, { forUninstall: true });
  const all = opts.agents.length || opts.all ? agents : [...agents, ...rulesAgents()];
  const { targets, rules } = planTargets({ agents: all, scope: k.scope, projectDir: k.projectDir, home: k.home, env: k.env });
  if (opts.dryRun) log.info(c.yellow('Dry run — nothing will be removed.'));
  if (interactive(opts)) {
    const present = targets.filter((t) => exists(t.path));
    if (present.length) {
      log.info('Will remove:');
      present.forEach((t) => log.info(`  ${prettyPath(t.path, k.home)}`));
      const ans = await ask('Continue? [y/N] ');
      if (!/^y(es)?$/i.test(ans)) {
        log.info('Aborted.');
        return 1;
      }
    }
  }
  let removed = 0;
  for (const t of targets) {
    const r = uninstallTarget(t, { dryRun: opts.dryRun });
    if (r.status === 'absent' && !opts.agents.length) continue;
    if (r.status === 'removed' || r.status === 'would-remove') removed++;
    log.info(`${styled(r.status).padEnd(14)} ${prettyPath(t.path, k.home)}${r.detail ? c.gray(` — ${r.detail}`) : ''}`);
  }
  for (const { file } of rules) {
    if (!file) continue;
    const r = removeRulesPointer(file, { dryRun: opts.dryRun });
    if (r.status === 'absent') continue;
    if (r.status === 'removed' || r.status === 'would-remove') removed++;
    log.info(`${styled(r.status).padEnd(14)} ${prettyPath(file, k.home)}${r.detail ? c.gray(` — ${r.detail}`) : ''}`);
  }
  if (!removed) log.info(c.gray(`No ${SKILL_NAME} installation found (${k.scope}).`));
  return 0;
}

function cmdListAgents() {
  const rows = AGENTS.map((a) => [a.id, a.displayName, a.projectSkillDir ? `${a.projectSkillDir}/` : `(rules) ${a.rulesFile || 'print-only'}`, a.kind === 'skills' ? `${a.globalDisplay}/` : '-', a.verified ? 'yes' : 'UNVERIFIED']);
  const head = ['ID', 'AGENT', 'PROJECT DIR', 'GLOBAL DIR', 'VERIFIED'];
  const w = head.map((h, i) => Math.max(h.length, ...rows.map((r) => r[i].length)));
  const line = (r, f = (x) => x) => r.map((x, i) => f(x.padEnd(w[i]), i)).join('  ');
  log.info(c.bold(line(head)));
  for (const r of rows) log.info(line(r, (x, i) => (i === 4 && x.trim() !== 'yes' ? c.yellow(x) : i === 0 ? c.cyan(x) : x)));
  log.info(c.gray(`\nDefault install: ${DEFAULT_AGENT_IDS.join(' + ')}. Agents sharing .agents/skills/ get ONE copy.`));
  log.info(c.gray('UNVERIFIED = path only from third-party sources; check the agent\'s docs. Details: list-agents --json'));
  return 0;
}

function cmdListAgentsJson() {
  const home = os.homedir();
  const out = AGENTS.map((a) => ({
    id: a.id,
    aliases: a.aliases || [],
    displayName: a.displayName,
    kind: a.kind,
    projectSkillDir: a.projectSkillDir,
    globalSkillDir: a.kind === 'skills' ? a.globalSkillDir({ home, env: process.env }) : null,
    rulesFile: a.rulesFile || null,
    verified: a.verified,
    sourceUrl: a.sourceUrl,
    notes: a.notes,
  }));
  process.stdout.write(`${JSON.stringify(out, null, 2)}\n`);
  return 0;
}

function cmdDoctor(opts) {
  const k = ctx(opts);
  let rc = 0;
  log.info(c.bold(`start-from-here doctor (CLI v${VERSION}, Node ${process.version}, ${process.platform})`));
  const [maj] = process.versions.node.split('.').map(Number);
  if (maj < 18) {
    log.err('Node >= 18 required');
    rc = 1;
  }
  log.info(c.bold('\nBundled skill'));
  const v = validateSkill(SKILL_SRC);
  if (v.errors.length) {
    rc = 1;
    v.errors.forEach((e) => log.err(e));
  } else log.ok(`valid (${v.info.files} files, ${humanBytes(v.info.bytes)}, SKILL.md ${v.info.lines} lines)`);
  v.warnings.forEach((w) => log.warn(w));

  log.info(c.bold('\nInstallations'));
  const seen = new Set();
  let found = 0;
  for (const scope of ['project', 'global']) {
    for (const a of skillAgents()) {
      const root = resolveSkillsRoot(a, { scope, projectDir: k.projectDir, home: k.home, env: k.env });
      const p = path.join(root, SKILL_NAME);
      const key = path.resolve(p);
      if (seen.has(key)) continue;
      seen.add(key);
      if (!exists(p)) continue;
      found++;
      let link = '';
      try {
        if (fs.lstatSync(p).isSymbolicLink()) link = ` → ${fs.realpathSync(p)}`;
      } catch {
        link = ' (broken symlink)';
      }
      if (!isOurSkill(p)) {
        log.warn(`${prettyPath(p, k.home)}${link} — exists but is not a valid ${SKILL_NAME} skill`);
        rc = 1;
        continue;
      }
      const iv = readInstalledVersion(p) || '?';
      const iv2 = validateSkill(p);
      const status = iv2.errors.length ? c.red('invalid') : iv === (readInstalledVersion(SKILL_SRC) || VERSION) ? c.green('ok') : c.yellow(`outdated (bundled ${readInstalledVersion(SKILL_SRC) || VERSION})`);
      log.info(`  ${status}  ${scope.padEnd(7)} v${iv}  ${prettyPath(p, k.home)}${c.gray(link)}`);
      if (iv2.errors.length) iv2.errors.forEach((e) => log.err(`    ${e}`));
    }
  }
  if (!found) log.info(c.gray('  not installed here or globally. Run: npx start-from-here@latest install'));
  for (const a of rulesAgents()) {
    if (a.rulesFile && exists(path.join(k.projectDir, ...a.rulesFile.split('/')))) log.info(`  rules   ${a.rulesFile} (${a.displayName})`);
  }
  log.info(c.bold('\nDetected agents'));
  const det = detectAgents({ projectDir: k.projectDir, home: k.home, env: k.env, exists });
  if (!det.length) log.info(c.gray('  none detected'));
  det.forEach((d) => log.info(`  ${d.agent.id.padEnd(22)} ${c.gray(d.hits.join(', '))}`));
  return rc;
}

function cmdBundle(opts) {
  const outDir = path.resolve(opts.out || path.join(process.cwd(), 'dist'));
  if (opts.dryRun) {
    log.info(`Would build bundle into ${outDir}`);
    return 0;
  }
  const r = buildAll({ outDir });
  for (const a of r.artifacts) log.info(`${c.green('built')}  ${path.join(prettyPath(r.outDir), a.path).padEnd(48)} ${c.gray(humanBytes(a.bytes))}`);
  r.warnings.forEach((w) => log.warn(w));
  log.ok(`gpt-instructions.md: ${r.gptChars}/8000 chars · knowledge files: ${r.knowledgeFiles}/10`);
  return 0;
}

function cmdCheck(opts) {
  const target = path.resolve(opts._[1] || opts.dir || process.cwd());
  const script = path.join(SKILL_SRC, 'scripts', 'check-docs.mjs');
  if (!fs.existsSync(script)) {
    log.err(`checker not found: ${script}`);
    return 1;
  }
  const res = spawnSync(process.execPath, [script, target], { stdio: 'inherit' });
  if (res.error) {
    log.err(res.error.message);
    return 1;
  }
  return res.status ?? 1;
}

export async function main(argv = process.argv.slice(2)) {
  let opts;
  try {
    opts = parseArgs(argv);
  } catch (e) {
    if (e instanceof UsageError) {
      log.err(e.message);
      log.info('Run "start-from-here --help" for usage.');
      return 2;
    }
    throw e;
  }
  const cmd = opts._[0];
  if (opts.version) {
    console.log(VERSION);
    return 0;
  }
  if (opts.help || !cmd || cmd === 'help') {
    process.stdout.write(HELP);
    return 0;
  }
  try {
    switch (cmd) {
      case 'install':
      case 'add':
      case 'i':
        return await cmdInstall(opts);
      case 'uninstall':
      case 'remove':
      case 'rm':
        return await cmdUninstall(opts);
      case 'list-agents':
      case 'agents':
      case 'ls':
        return opts.json ? cmdListAgentsJson() : cmdListAgents();
      case 'doctor':
        return cmdDoctor(opts);
      case 'bundle':
      case 'build':
        return cmdBundle(opts);
      case 'check':
        return cmdCheck(opts);
      default:
        log.err(`unknown command: ${cmd}`);
        log.info('Run "start-from-here --help" for usage.');
        return 2;
    }
  } catch (e) {
    if (e instanceof UsageError) {
      log.err(e.message);
      return 2;
    }
    log.err(e && e.message ? e.message : String(e));
    if (process.env.DEBUG) console.error(e);
    return 1;
  }
}

// Run when executed directly (also via npm bin shim / symlink).
const invokedDirectly = (() => {
  try {
    return fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url));
  } catch {
    return true;
  }
})();
if (invokedDirectly) {
  main().then((code) => {
    process.exitCode = code;
  });
}
