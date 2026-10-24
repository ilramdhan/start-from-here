// Agent registry: where each AI coding agent discovers Agent Skills.
// Every path comes from official docs (researched 2026-10-24); each entry carries its sourceUrl.
// `verified: true`  = confirmed on the vendor's own official docs.
// `verified: false` = only third-party (e.g. vercel-labs/skills agents table) or UNVERIFIED in research.
//
// Install-target policy: when an agent officially reads the universal `.agents/skills/` project path,
// we use that path as its project dir so multiple agents share ONE copy (no duplicate skills).
// Agent-specific dirs are used only where the agent does not (verifiably) read `.agents/skills/`.

import path from 'node:path';

const U = '.agents/skills'; // universal cross-client convention (agentskills.io)

/**
 * @typedef {Object} Agent
 * @property {string} id
 * @property {string[]} [aliases]
 * @property {string} displayName
 * @property {'skills'|'rules'} kind
 * @property {string|null} projectSkillDir   POSIX path relative to project root
 * @property {(ctx:{home:string, env:Record<string,string|undefined>})=>string|null} globalSkillDir absolute
 * @property {string} globalDisplay
 * @property {{project:string[], home:string[], env:string[]}} detect
 * @property {boolean} verified
 * @property {string} sourceUrl
 * @property {string} notes
 * @property {string} [rulesFile]           (rules agents) POSIX path relative to project root
 * @property {string} [manualHint]          (rules agents) printed instructions
 */

const home = (...p) => ({ home }) => path.join(home, ...p);

/** @type {Agent[]} */
export const AGENTS = [
  {
    id: 'universal',
    displayName: 'Universal (.agents/skills)',
    kind: 'skills',
    projectSkillDir: U,
    globalSkillDir: home('.agents', 'skills'),
    globalDisplay: '~/.agents/skills',
    detect: { project: ['.agents'], home: ['.agents'], env: [] },
    verified: true,
    sourceUrl: 'https://agentskills.io/client-implementation/adding-skills-support',
    notes: 'Cross-client convention. Read by Codex, Copilot, Cursor, Gemini CLI, Antigravity, OpenCode, Roo, Zed, Goose, Amp, Junie, Augment, Qwen, Vibe, Windsurf/Devin.',
  },
  {
    id: 'claude-code',
    aliases: ['claude'],
    displayName: 'Claude Code',
    kind: 'skills',
    projectSkillDir: '.claude/skills',
    globalSkillDir: home('.claude', 'skills'),
    globalDisplay: '~/.claude/skills',
    detect: { project: ['.claude', 'CLAUDE.md'], home: ['.claude'], env: [] },
    verified: true,
    sourceUrl: 'https://code.claude.com/docs/en/skills',
    notes: 'Does not read .agents/skills. Invoke with /start-from-here. Also installable as a plugin (.claude-plugin/).',
  },
  {
    id: 'codex',
    displayName: 'OpenAI Codex (CLI / IDE / ChatGPT desktop)',
    kind: 'skills',
    projectSkillDir: U,
    globalSkillDir: home('.agents', 'skills'),
    globalDisplay: '~/.agents/skills',
    detect: { project: ['.codex'], home: ['.codex'], env: ['CODEX_HOME'] },
    verified: true,
    sourceUrl: 'https://learn.chatgpt.com/docs/build-skills',
    notes: 'Skills live in $HOME/.agents/skills (not $CODEX_HOME). CODEX_HOME is only used to detect Codex. Invoke with $start-from-here or /skills.',
  },
  {
    id: 'gemini-cli',
    aliases: ['gemini'],
    displayName: 'Gemini CLI',
    kind: 'skills',
    projectSkillDir: U,
    globalSkillDir: home('.gemini', 'skills'),
    globalDisplay: '~/.gemini/skills',
    detect: { project: ['.gemini', 'GEMINI.md'], home: ['.gemini'], env: [] },
    verified: true,
    sourceUrl: 'https://geminicli.com/docs/cli/skills/',
    notes: 'Workspace: .agents/skills (alias, takes precedence) or .gemini/skills. Also available as an extension (gemini-extension.json).',
  },
  {
    id: 'antigravity',
    displayName: 'Google Antigravity (App / IDE)',
    kind: 'skills',
    projectSkillDir: U,
    globalSkillDir: home('.gemini', 'config', 'skills'),
    globalDisplay: '~/.gemini/config/skills',
    detect: { project: ['.agent'], home: [path.join('.gemini', 'config'), path.join('.gemini', 'antigravity')], env: [] },
    verified: true,
    sourceUrl: 'https://antigravity.google/docs/skills/',
    notes: 'Legacy ~/.gemini/antigravity/skills still read by the IDE.',
  },
  {
    id: 'antigravity-cli',
    displayName: 'Google Antigravity CLI',
    kind: 'skills',
    projectSkillDir: U,
    globalSkillDir: home('.gemini', 'antigravity-cli', 'skills'),
    globalDisplay: '~/.gemini/antigravity-cli/skills',
    detect: { project: [], home: [path.join('.gemini', 'antigravity-cli')], env: [] },
    verified: true,
    sourceUrl: 'https://antigravity.google/docs/skills/',
    notes: '',
  },
  {
    id: 'github-copilot',
    aliases: ['copilot', 'vscode'],
    displayName: 'GitHub Copilot (CLI, cloud agent, VS Code/VS/JetBrains agent mode)',
    kind: 'skills',
    projectSkillDir: U,
    globalSkillDir: home('.copilot', 'skills'),
    globalDisplay: '~/.copilot/skills',
    detect: { project: [path.join('.github', 'copilot-instructions.md'), path.join('.github', 'skills'), '.vscode'], home: ['.copilot'], env: [] },
    verified: true,
    sourceUrl: 'https://docs.github.com/en/copilot/concepts/agents/about-agent-skills',
    notes: 'Also reads .github/skills and .claude/skills (project), ~/.agents/skills (global).',
  },
  {
    id: 'cursor',
    displayName: 'Cursor',
    kind: 'skills',
    projectSkillDir: U,
    globalSkillDir: home('.cursor', 'skills'),
    globalDisplay: '~/.cursor/skills',
    detect: { project: ['.cursor', '.cursorrules'], home: ['.cursor'], env: [] },
    verified: true,
    sourceUrl: 'https://cursor.com/docs/context/skills',
    notes: 'Also reads .cursor/skills, .claude/skills, ~/.agents/skills.',
  },
  {
    id: 'windsurf',
    aliases: ['devin-desktop'],
    displayName: 'Windsurf / Devin Desktop (Cascade)',
    kind: 'skills',
    projectSkillDir: U,
    globalSkillDir: home('.codeium', 'windsurf', 'skills'),
    globalDisplay: '~/.codeium/windsurf/skills',
    detect: { project: ['.windsurf', '.devin', '.windsurfrules'], home: [path.join('.codeium', 'windsurf')], env: [] },
    verified: true,
    sourceUrl: 'https://docs.devin.ai/desktop/cascade/skills',
    notes: 'Project: .devin/skills (preferred), .windsurf/skills (legacy) and .agents/skills all read. Invoke with @start-from-here.',
  },
  {
    id: 'cline',
    displayName: 'Cline',
    kind: 'skills',
    projectSkillDir: '.cline/skills',
    globalSkillDir: home('.cline', 'skills'),
    globalDisplay: '~/.cline/skills',
    detect: { project: ['.cline', '.clinerules'], home: ['.cline'], env: [] },
    verified: true,
    sourceUrl: 'https://docs.cline.bot/features/skills',
    notes: 'Cline docs do not list .agents/skills, so we install to .cline/skills. Enable the skill in the Skills tab.',
  },
  {
    id: 'roo',
    aliases: ['roo-code'],
    displayName: 'Roo Code',
    kind: 'skills',
    projectSkillDir: U,
    globalSkillDir: home('.roo', 'skills'),
    globalDisplay: '~/.roo/skills',
    detect: { project: ['.roo', '.roorules'], home: ['.roo'], env: [] },
    verified: true,
    sourceUrl: 'https://roocodeinc.github.io/Roo-Code/features/skills',
    notes: 'Also reads .roo/skills and ~/.agents/skills.',
  },
  {
    id: 'kilo',
    aliases: ['kilo-code'],
    displayName: 'Kilo Code',
    kind: 'skills',
    projectSkillDir: '.kilo/skills',
    globalSkillDir: home('.kilo', 'skills'),
    globalDisplay: '~/.kilo/skills',
    detect: { project: ['.kilo', 'kilo.jsonc'], home: ['.kilo'], env: [] },
    verified: true,
    sourceUrl: 'https://kilo.ai/docs/agent-behavior/skills',
    notes: 'Project .agents/skills support is third-party only; .kilo/skills is the documented path. Run /reload after install.',
  },
  {
    id: 'kiro',
    aliases: ['kiro-cli'],
    displayName: 'Kiro (IDE / CLI)',
    kind: 'skills',
    projectSkillDir: '.kiro/skills',
    globalSkillDir: home('.kiro', 'skills'),
    globalDisplay: '~/.kiro/skills',
    detect: { project: ['.kiro'], home: ['.kiro'], env: [] },
    verified: true,
    sourceUrl: 'https://kiro.dev/docs/skills/',
    notes: 'Custom Kiro CLI agents need resources: ["skill://.kiro/skills/**/SKILL.md"].',
  },
  {
    id: 'trae',
    displayName: 'Trae',
    kind: 'skills',
    projectSkillDir: '.trae/skills',
    globalSkillDir: home('.trae', 'skills'),
    globalDisplay: '~/.trae/skills',
    detect: { project: ['.trae'], home: ['.trae'], env: [] },
    verified: false,
    sourceUrl: 'https://docs.trae.ai/ide/skills',
    notes: 'Project path confirmed via docs search snippet; global path from vercel-labs/skills table (UNVERIFIED). docs.trae.ai/ide/skills could not be parsed for paths on 2026-10-25, so no official confirmation.',
  },
  {
    id: 'opencode',
    displayName: 'OpenCode',
    kind: 'skills',
    projectSkillDir: U,
    globalSkillDir: home('.config', 'opencode', 'skills'),
    globalDisplay: '~/.config/opencode/skills',
    detect: { project: ['.opencode', 'opencode.json'], home: [path.join('.config', 'opencode')], env: [] },
    verified: true,
    sourceUrl: 'https://opencode.ai/docs/skills',
    notes: 'Also reads .opencode/skills, .claude/skills, ~/.agents/skills, ~/.claude/skills.',
  },
  {
    id: 'goose',
    displayName: 'Goose',
    kind: 'skills',
    projectSkillDir: U,
    globalSkillDir: home('.agents', 'skills'),
    globalDisplay: '~/.agents/skills',
    detect: { project: ['.goose', '.goosehints'], home: [path.join('.config', 'goose')], env: [] },
    verified: true,
    sourceUrl: 'https://goose-docs.ai/docs/guides/context-engineering/using-skills/',
    notes: 'Legacy .goose/skills and ~/.config/goose/skills still read.',
  },
  {
    id: 'amp',
    displayName: 'Amp',
    kind: 'skills',
    projectSkillDir: U,
    globalSkillDir: home('.config', 'agents', 'skills'),
    globalDisplay: '~/.config/agents/skills',
    detect: { project: [], home: [path.join('.config', 'amp')], env: [] },
    verified: true,
    sourceUrl: 'https://ampcode.com/docs/customize/skills',
    notes: 'Also reads ~/.agents/skills. `amp skill add <source>` is the native installer.',
  },
  {
    id: 'junie',
    displayName: 'JetBrains Junie',
    kind: 'skills',
    projectSkillDir: U,
    globalSkillDir: home('.junie', 'skills'),
    globalDisplay: '~/.junie/skills',
    detect: { project: ['.junie'], home: ['.junie'], env: [] },
    verified: true,
    sourceUrl: 'https://junie.jetbrains.com/docs/agent-skills.html',
    notes: 'Also reads .junie/skills. Invoke with /start-from-here or $start-from-here.',
  },
  {
    id: 'augment',
    aliases: ['auggie'],
    displayName: 'Augment (Auggie CLI / IDE)',
    kind: 'skills',
    projectSkillDir: U,
    globalSkillDir: home('.augment', 'skills'),
    globalDisplay: '~/.augment/skills',
    detect: { project: ['.augment'], home: ['.augment'], env: [] },
    verified: true,
    sourceUrl: 'https://docs.augmentcode.com/cli/skills',
    notes: 'Also reads .augment/skills, .claude/skills.',
  },
  {
    id: 'qwen-code',
    aliases: ['qwen'],
    displayName: 'Qwen Code',
    kind: 'skills',
    projectSkillDir: U,
    globalSkillDir: home('.qwen', 'skills'),
    globalDisplay: '~/.qwen/skills',
    detect: { project: ['.qwen', 'QWEN.md'], home: ['.qwen'], env: [] },
    verified: true,
    sourceUrl: 'https://qwenlm.github.io/qwen-code-docs/en/users/features/skills/',
    notes: 'Also reads .qwen/skills.',
  },
  {
    id: 'mistral-vibe',
    aliases: ['vibe'],
    displayName: 'Mistral Vibe (CLI)',
    kind: 'skills',
    projectSkillDir: U,
    globalSkillDir: home('.vibe', 'skills'),
    globalDisplay: '~/.vibe/skills',
    detect: { project: ['.vibe'], home: ['.vibe'], env: [] },
    verified: true,
    sourceUrl: 'https://docs.mistral.ai/vibe/code/cli/skills',
    notes: 'Copy limits reported (UNVERIFIED, absent from the official skills page as of 2026-10-25): >200 files, any file >256 KiB, or >1 MiB non-SKILL files are skipped.',
  },
  {
    id: 'zed',
    displayName: 'Zed',
    kind: 'skills',
    projectSkillDir: U,
    globalSkillDir: home('.agents', 'skills'),
    globalDisplay: '~/.agents/skills',
    detect: { project: ['.zed', '.rules'], home: [path.join('.config', 'zed')], env: [] },
    verified: true,
    sourceUrl: 'https://zed.dev/docs/ai/skills',
    notes: 'Live reload. Invoke with /start-from-here or @.',
  },
  {
    id: 'continue',
    displayName: 'Continue',
    kind: 'skills',
    projectSkillDir: '.continue/skills',
    globalSkillDir: home('.continue', 'skills'),
    globalDisplay: '~/.continue/skills',
    detect: { project: ['.continue'], home: ['.continue'], env: [] },
    verified: false,
    sourceUrl: 'https://github.com/continuedev/continue/issues/9216',
    notes: 'Skills merged in PR #9353 but no official docs page; paths from vercel-labs/skills table (UNVERIFIED; docs.continue.dev has no skills page as of 2026-10-25, the guessed URL returned 404). Fallback: reference SKILL.md from a .continue/rules/*.md rule.',
  },
  {
    id: 'openhands',
    displayName: 'OpenHands',
    kind: 'skills',
    projectSkillDir: '.openhands/skills',
    globalSkillDir: home('.openhands', 'skills'),
    globalDisplay: '~/.openhands/skills',
    detect: { project: ['.openhands'], home: ['.openhands'], env: [] },
    verified: false,
    sourceUrl: 'https://docs.openhands.dev/overview/skills',
    notes: 'Official docs (2026-10-25): project .openhands/skills is a supported legacy path; the recommended paths are .agents/skills (project) and ~/.agents/skills (user). Global ~/.openhands/skills is not documented (UNVERIFIED).',
  },
  {
    id: 'droid',
    aliases: ['factory'],
    displayName: 'Factory Droid',
    kind: 'skills',
    projectSkillDir: U,
    globalSkillDir: home('.factory', 'skills'),
    globalDisplay: '~/.factory/skills',
    detect: { project: ['.factory'], home: ['.factory'], env: [] },
    verified: true,
    sourceUrl: 'https://docs.factory.com/cli/configuration/skills',
    notes: 'Verified 2026-10-25: personal skills in ~/.factory/skills, project skills in <repo>/.factory/skills (we install project skills to .agents/skills).',
  },

  // ---------------- rules-only fallback agents (no native skills) ----------------
  {
    id: 'aider',
    displayName: 'Aider',
    kind: 'rules',
    projectSkillDir: null,
    globalSkillDir: () => null,
    globalDisplay: '-',
    detect: { project: ['.aider.conf.yml', 'CONVENTIONS.md'], home: ['.aider.conf.yml'], env: [] },
    verified: true,
    sourceUrl: 'https://aider.chat/docs/usage/conventions.html',
    notes: 'No skills / AGENTS.md support. Skill is installed to .agents/skills and loaded with --read.',
    rulesFile: '.aider.conf.yml',
    rulesFormat: 'aider-yaml',
    manualHint:
      'Run:  aider --read .agents/skills/start-from-here/SKILL.md\n' +
      'or add to .aider.conf.yml:\n  read:\n    - .agents/skills/start-from-here/SKILL.md\n' +
      'Add --read for any references/*.md file the skill tells the model to open.\n' +
      'Re-run with --yes to create .aider.conf.yml (only if it does not exist yet).',
  },
  {
    id: 'amazon-q',
    displayName: 'Amazon Q Developer (IDE)',
    kind: 'rules',
    projectSkillDir: null,
    globalSkillDir: () => null,
    globalDisplay: '-',
    detect: { project: ['.amazonq'], home: ['.aws/amazonq'], env: [] },
    verified: true,
    sourceUrl: 'https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/context-project-rules.html',
    notes: 'No native skills. Project rules in .amazonq/rules/**/*.md (via docs search snippet).',
    rulesFile: '.amazonq/rules/start-from-here.md',
    manualHint: 'Create .amazonq/rules/start-from-here.md that tells Q to read .agents/skills/start-from-here/SKILL.md (or re-run with --yes to write it).',
  },
  {
    id: 'jetbrains-ai-assistant',
    aliases: ['jetbrains-ai'],
    displayName: 'JetBrains AI Assistant (chat)',
    kind: 'rules',
    projectSkillDir: null,
    globalSkillDir: () => null,
    globalDisplay: '-',
    detect: { project: ['.aiassistant'], home: [], env: [] },
    verified: true,
    sourceUrl: 'https://www.jetbrains.com/help/ai-assistant/configure-project-rules.html',
    notes: 'No native skills in chat (use Junie or Copilot agent mode for skills). Rules path .aiassistant/rules verified 2026-10-25.',
    rulesFile: '.aiassistant/rules/start-from-here.md',
    manualHint: 'Create .aiassistant/rules/start-from-here.md pointing to .agents/skills/start-from-here/SKILL.md, then set its type (Manually / By model decision) in Settings (or re-run with --yes to write it).',
  },
];

export const DEFAULT_AGENT_IDS = ['universal', 'claude-code'];

export function findAgent(idOrAlias) {
  const k = String(idOrAlias).trim().toLowerCase();
  return AGENTS.find((a) => a.id === k || (a.aliases || []).includes(k)) || null;
}

export function skillAgents() {
  return AGENTS.filter((a) => a.kind === 'skills');
}

export function rulesAgents() {
  return AGENTS.filter((a) => a.kind === 'rules');
}

/**
 * Absolute parent directory (the "skills" dir) for an agent in a scope.
 * @returns {string|null}
 */
export function resolveSkillsRoot(agent, { scope, projectDir, home, env = process.env }) {
  if (agent.kind !== 'skills') return null;
  if (scope === 'global') return agent.globalSkillDir({ home, env });
  return path.join(projectDir, ...agent.projectSkillDir.split('/'));
}

/** Heuristically detect which agents appear to be in use. */
export function detectAgents({ projectDir, home, env = process.env, exists }) {
  const found = [];
  for (const a of AGENTS) {
    if (a.id === 'universal') continue;
    const hits = [];
    for (const p of a.detect.project) if (exists(path.join(projectDir, p))) hits.push(`./${p.split(path.sep).join('/')}`);
    for (const p of a.detect.home) if (exists(path.join(home, p))) hits.push(`~/${p.split(path.sep).join('/')}`);
    for (const e of a.detect.env) if (env[e]) hits.push(`$${e}`);
    if (hits.length) found.push({ agent: a, hits });
  }
  return found;
}
