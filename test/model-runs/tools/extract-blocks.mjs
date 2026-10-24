#!/usr/bin/env node
// Extract chat-only deliverables. A deliverable = a line naming a path (heading/bold/backticked),
// then an opening fence; its body runs to the LAST bare closing fence before the next path heading
// (robust to nested ```mermaid fences inside a ```markdown block). Later copies overwrite earlier.
// Usage: node extract-blocks.mjs <transcript.md> <outDir>
import fs from 'node:fs'; import path from 'node:path';
const [,, inFile, outDir] = process.argv;
const lines = fs.readFileSync(inFile, 'utf8').split(/\r?\n/);
const pathRe = /^(?:#{1,6}\s*|\*\*)?\s*`?((?:\.github\/|docs\/)?[A-Za-z0-9_./-]*(?:\.md|\.ya?ml|LICENSE|CODEOWNERS))`?(?:\*\*)?(?:\s+\(.*\))?\s*$/;
const heads = [];
for (let i = 0; i < lines.length; i++) {
  const m = lines[i].match(pathRe); if (!m) continue;
  let j = i + 1; while (j < lines.length && lines[j].trim() === '') j++;
  if (lines[j] && /^\s*(`{3,}|~{3,})/.test(lines[j])) heads.push({ i, open: j, rel: m[1].replace(/^\.\//, '') });
}
const saved = [];
heads.forEach((h, n) => {
  const end = n + 1 < heads.length ? heads[n + 1].i : lines.length;
  let close = -1; for (let k = end - 1; k > h.open; k--) if (/^\s*(`{3,}|~{3,})\s*$/.test(lines[k])) { close = k; break; }
  const body = lines.slice(h.open + 1, close > 0 ? close : end);
  if (h.rel.includes('..')) return;
  const dest = path.join(outDir, h.rel); fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, body.join('\n').replace(/\s+$/, '') + '\n');
  saved.push(`${h.rel} (${body.length} lines${close < 0 ? ', UNTERMINATED' : ''})`);
});
console.log(saved.join('\n') || 'no blocks found');
