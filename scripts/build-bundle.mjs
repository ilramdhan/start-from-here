#!/usr/bin/env node
// Build dist/ artifacts: zip, flattened prompt, knowledge files, GPT/Gem bootloader instructions.
// Usage: node scripts/build-bundle.mjs [--out dist]
import path from 'node:path';
import { buildAll } from '../lib/bundle.mjs';
import { PKG_ROOT, c, log, humanBytes } from '../lib/util.mjs';

const args = process.argv.slice(2);
const i = args.indexOf('--out');
const outDir = path.resolve(i >= 0 && args[i + 1] ? args[i + 1] : path.join(PKG_ROOT, 'dist'));
try {
  const r = buildAll({ outDir });
  for (const a of r.artifacts) log.info(`${c.green('built')}  ${path.relative(process.cwd(), path.join(r.outDir, a.path)).padEnd(50)} ${c.gray(humanBytes(a.bytes))}`);
  r.warnings.forEach((w) => log.warn(w));
  log.ok(`gpt-instructions.md ${r.gptChars}/8000 chars · knowledge files ${r.knowledgeFiles}/10`);
} catch (e) {
  log.err(e.message);
  process.exitCode = 1;
}
