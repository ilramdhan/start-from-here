#!/usr/bin/env node
// Validate skills/start-from-here against the Agent Skills spec + distribution contract.
// Usage: node scripts/validate-skill.mjs [skillDir] [--strict]   (--strict: warnings fail too)
import path from 'node:path';
import { validateSkill } from '../lib/validate.mjs';
import { SKILL_SRC, c, log, humanBytes } from '../lib/util.mjs';

const args = process.argv.slice(2);
const strict = args.includes('--strict');
const dir = path.resolve(args.find((a) => !a.startsWith('-')) || SKILL_SRC);
const { errors, warnings, info } = validateSkill(dir);

log.info(c.bold(`Validating ${dir}`));
if (info.name) log.info(c.gray(`  name: ${info.name} · description: ${(info.description || '').length}/200 chars · SKILL.md: ${info.lines} lines · ${info.files} files · ${humanBytes(info.bytes)}`));
for (const w of warnings) log.warn(w);
for (const e of errors) log.err(e);
if (errors.length || (strict && warnings.length)) {
  log.err(`validation failed: ${errors.length} error(s), ${warnings.length} warning(s)`);
  process.exitCode = 1;
} else {
  log.ok(`valid (${warnings.length} warning(s))`);
}
