#!/usr/bin/env node
// Portable test runner: `node --test <dir>` differs across Node 18/20/22, so pass explicit files.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'test');
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.test.mjs')).sort().map((f) => path.join(dir, f));
const r = spawnSync(process.execPath, ['--test', ...files], { stdio: 'inherit' });
process.exitCode = r.status ?? 1;
