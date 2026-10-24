#!/usr/bin/env node
// Completeness / compliance / mermaid rubric for a generated project dir.
// Usage: node rubric.mjs <projectDir> [--tier Standard|Lite] [--partial]   -> JSON on stdout
import fs from 'node:fs'; import path from 'node:path';
const args = process.argv.slice(2); const root = path.resolve(args[0]);
const tier = (args.includes('--tier') ? args[args.indexOf('--tier') + 1] : 'Standard');
const partial = args.includes('--partial');
let nbh = 0; const rd = (p) => { try { const t = fs.readFileSync(path.join(root, p), 'utf8'); const n = (t.match(/\b[A-Z]{1,4}[\u2010\u2011\u2012\u2013]\d/g) || []).length; nbh += n; return t.replace(/([A-Z]{1,4})[\u2010\u2011\u2012\u2013](\d)/g, '$1-$2'); } catch { return null; } };
const walk = (d, out = []) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { if (['.agents', '.claude', 'node_modules', '.git'].includes(e.name)) continue; const p = path.join(d, e.name); e.isDirectory() ? walk(p, out) : out.push(p); } return out; };
const files = walk(root).map((f) => path.relative(root, f));
const C = []; const add = (area, id, pass, detail = '') => C.push({ area, id, pass: !!pass, detail });

const prd = rd('docs/product/PRD.md') || '', arch = rd('docs/technical/ARCHITECTURE.md') || '', db = rd('docs/technical/DATABASE.md') || '';
const sec = rd('docs/technical/SECURITY_ARCHITECTURE.md') || '', plan = rd('docs/technical/IMPLEMENTATION_PLAN.md') || '', test = rd('docs/technical/TESTING.md') || '';
const ai = rd('docs/engineering/AI_GUIDELINES.md') || '', state = rd('docs/.start-from-here/STATE.md') || '', disc = rd('docs/DISCOVERY.md') || '';
const agents = rd('AGENTS.md') || '';

// --- (2) completeness
const allF = [...new Set((prd.match(/F-\d{2}/g) || []))];
const mustRows = prd.split('\n').filter((l) => /^\|/.test(l) && /F-\d{2}/.test(l) && /\bMust\b/i.test(l));
let mustF = [...new Set(mustRows.map((l) => l.match(/F-\d{2}/)[0]))]; if (mustF.length < 2) mustF = allF;
const acs = prd.match(/AC-\d{2}\.\d+/g) || []; const acU = new Set(acs);
const featsWithAC = new Set([...acU].map((a) => 'F-' + a.slice(3, 5)).filter((f) => mustF.includes(f)));
const negRe = /\b(invalid|unauthori[sz]ed|forbidden|denied|reject|error|fail|expired|not (?:a )?member|without permission|exceed|duplicate|cannot|403|404|409|422|429|missing|empty)\b/i;
const acLines = prd.split('\n').filter((l) => /AC-\d{2}\.\d+/.test(l));
const negFeats = new Set(acLines.filter((l) => negRe.test(l)).map((l) => 'F-' + l.match(/AC-(\d{2})/)[1]).filter((f) => mustF.includes(f)));
add('prd', 'features', mustF.length >= (tier === 'Lite' ? 4 : 8), `${mustF.length} Must F-ids (${allF.length} total)`);
add('prd', 'ac_per_feature', mustF.length && featsWithAC.size / mustF.length >= 0.8, `${featsWithAC.size}/${mustF.length} features have AC; ${acU.size} AC`);
add('prd', 'negative_ac', featsWithAC.size && negFeats.size / featsWithAC.size >= 0.7, `${negFeats.size}/${featsWithAC.size} features with negative AC`);
add('prd', 'gwt_format', /given\b[\s\S]{0,200}\bwhen\b[\s\S]{0,200}\bthen\b/i.test(prd));
const ents = [...db.matchAll(/^#{2,4}\s+(?:\d+(?:\.\d+)*\s*)?`?([a-z_]{3,})`?\b/gmi)].map((m) => m[1].toLowerCase());
const erBlock = (db.match(/erDiagram[\s\S]*?```/) || [''])[0];
const erEnts = [...erBlock.matchAll(/^\s*([A-Za-z_]+)\s*\{/gm)].map((m) => m[1].toLowerCase());
add('db', 'erDiagram_with_attrs', erEnts.length >= 3, `${erEnts.length} entities with attribute blocks`);
const expectS1 = ['user', 'organization|org|tenant', 'membership|member', 'workspace', 'project', 'task', 'comment', 'attachment|file', 'notification', 'subscription|billing', 'audit|activity', 'invit', 'session|refresh_token|auth'];
const expectS2 = ['habit', 'check_?in|completion|entry|log', 'reminder|notification', 'setting|preference'];
const expect = tier === 'Lite' ? expectS2 : expectS1;
const missingEnt = expect.filter((e) => !new RegExp(e, 'i').test(erBlock + '\n' + db.split('\n').filter((l) => /^#{2,4} /.test(l)).join('\n')));
add('db', 'expected_entities', missingEnt.length <= 1, missingEnt.length ? `missing: ${missingEnt.join(', ')}` : `all ${expect.length} present`);
const fkCount = (erBlock.match(/\bFK\b/g) || []).length;
const idxLines = (db.match(/^\s*\|[^\n]*\b(idx_|index|ix_|unique)[^\n]*$/gmi) || []).length + (db.match(/CREATE (UNIQUE )?INDEX/gi) || []).length;
add('db', 'fk_indexed', tier === 'Lite' ? idxLines >= 1 || /index/i.test(db) : fkCount > 0 && idxLines >= Math.min(fkCount, 8) * 0.6, `${fkCount} FK in ERD, ${idxLines} index rows`);
add('db', 'column_tables', (db.match(/^\|\s*(?:column|field|name)\s*\|/gmi) || []).length >= Math.max(3, Math.min(erEnts.length, 8) * 0.7), `${(db.match(/^\|\s*(?:column|field|name)\s*\|/gmi) || []).length} column tables`);
add('db', 'tenant_retention_pii', /tenant|org(?:anization)?_id|N\/A/i.test(db) && /retention/i.test(db) && /PII|personal/i.test(db));
const seqCount = (arch.match(/sequenceDiagram/g) || []).length;
add('arch', 'c4_context_container', /C4Context|context/i.test(arch) && /C4Container|container/i.test(arch) && (arch.match(/```mermaid/g) || []).length >= 2);
add('arch', 'sequence_diagrams', seqCount >= (tier === 'Lite' ? 2 : 4), `${seqCount} sequence diagrams`);
add('arch', 'deployment_view', /deploy/i.test(arch));
if (!partial) {
  const stride = ['spoof', 'tamper', 'repudiat', 'information disclosure', 'denial of service', 'elevation'];
  const letterCol = /\|\s*STRIDE\s*\|/i.test(sec); const strideMiss = stride.filter((s, i) => !new RegExp(s, 'i').test(sec) && !(letterCol && new RegExp(`\\|\\s*${'STRIDE'[i]}\\s*\\|`).test(sec)));
  add('sec', 'stride_all6', sec && strideMiss.length === 0, strideMiss.length ? `missing ${strideMiss}` : 'all 6');
  add('sec', 'trust_boundaries', /TB-\d/.test(sec), `${new Set(sec.match(/TB-\d+/g) || []).size} TB ids`);
  add('sec', 'authz_matrix', /\|\s*(?:role|resource|action)[^\n]*\|/i.test(sec) && /owner|admin|member|user/i.test(sec));
  const ms = new Set((plan.match(/\bM[0-9]\b/g) || []));
  add('plan', 'phases_M0_M7', ms.size >= (tier === 'Lite' ? 4 : 7), `milestones: ${[...ms].sort().join(',')}`);
  add('plan', 'entry_exit_gates', /entry/i.test(plan) && /exit/i.test(plan));
  const planF = new Set(plan.match(/F-\d{2}/g) || []); const missPlan = mustF.filter((f) => !planF.has(f));
  add('trace', 'F_in_plan', mustF.length && missPlan.length <= 1, missPlan.length ? `missing ${missPlan}` : 'all');
  const testAC = new Set(test.match(/AC-\d{2}\.\d+/g) || []); const missAC = [...acU].filter((a) => !testAC.has(a));
  add('trace', 'AC_in_tests', acU.size && missAC.length / acU.size <= 0.1, `${acU.size - missAC.length}/${acU.size} AC mapped`);
  add('plan', 'gantt_or_flow_plus_ascii', /gantt|flowchart|graph /.test(plan) && /```(?:text)?\n[^`]*(?:-->|──|->|\+--|\|)/.test(plan));
  add('ai', 'dos_donts', /\bDO\b|Do's|DOs/.test(ai) && /DON'?T/i.test(ai));
  add('ai', 'agents_md_links', agents && (agents.match(/\]\((?:\.\/)?docs\//g) || []).length >= 8, `${(agents.match(/\]\((?:\.\/)?docs\//g) || []).length} doc links`);
}
// --- (3) compliance
const codeExt = /\.(ts|tsx|js|jsx|mjs|py|go|rs|java|kt|swift|dart|rb|php|cs|sql|prisma)$/i;
const codeFiles = files.filter((f) => codeExt.test(f) || /^(package\.json|pubspec\.yaml|go\.mod|requirements\.txt|Dockerfile)$/.test(path.basename(f)));
add('compliance', 'no_app_code_files', codeFiles.length === 0, codeFiles.join(', '));
const allMd = files.filter((f) => /\.(md|ya?ml)$|LICENSE/.test(f)).map((f) => [f, rd(f)]);
const verRe = /\b(?:React|Next\.?js|Node(?:\.js)?|PostgreSQL|Postgres|TypeScript|Prisma|Expo|Flutter|React Native|Python|Django|FastAPI|Tailwind|NestJS|Redis|Drizzle|Vite|Svelte|SvelteKit|Remix|Nuxt|Vue|Go|Kotlin|Swift)\s+v?(\d+(?:\.\d+)*)(?!\s*%)\b/g;
const verHits = []; for (const [f, s] of allMd) for (const m of (s || '').matchAll(verRe)) { const ctx = s.slice(Math.max(0, m.index - 60), m.index + 80); if (!/verify|confirm|at setup|TBD|ASSUMPTION/i.test(ctx)) verHits.push(`${f}: ${m[0]}`); }
add('compliance', 'no_unverified_versions', verHits.length === 0, verHits.slice(0, 6).join('; '));
const legal = allMd.filter(([f]) => /docs\/legal\//.test(f));
const legalOk = legal.every(([, s]) => /not legal advice/i.test(s || ''));
add('compliance', 'legal_disclaimer', partial ? true : legal.length > 0 && legalOk, `${legal.length} legal docs, disclaimer ${legalOk ? 'all' : 'MISSING in some'}`);
const claimsCompliant = allMd.filter(([, s]) => /\b(?:is|are|fully|now)\s+(?:GDPR|CCPA|PCI[ -]DSS|HIPAA|SOC ?2)[- ]?compliant\b/i.test(s || '')).map(([f]) => f);
add('compliance', 'no_compliance_claim', claimsCompliant.length === 0, claimsCompliant.join(', '));
add('compliance', 'state_md', state && /tier:\s*\w+/i.test(state) && /phase:/i.test(state), state ? 'present' : 'missing');
add('compliance', 'status_headers', allMd.filter(([f]) => /^docs\/(?!\.start)/.test(f) && f.endsWith('.md')).every(([, s]) => /\*\*Status:\*\*/.test(s || '')));
add('compliance', 'assumption_labels', /ASSUMPTION|PROPOSAL|Recommended/i.test(disc + arch));
// --- (4) mermaid heuristics
const mm = []; for (const [f, s] of allMd) for (const m of (s || '').matchAll(/```mermaid\n([\s\S]*?)```/g)) mm.push([f, m[1]]);
const okTypes = /^(flowchart|graph|sequenceDiagram|erDiagram|classDiagram|stateDiagram(?:-v2)?|gantt|journey|C4Context|C4Container|C4Component|C4Deployment|C4Dynamic|pie|mindmap|timeline|quadrantChart|gitGraph|architecture-beta|block-beta)\b/;
const bad = [];
for (const [f, b] of mm) {
  const lines = b.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('%%'));
  const first = lines[0] || ''; const why = [];
  if (!okTypes.test(first)) why.push(`unknown type "${first.slice(0, 30)}"`);
  const bb = b.replace(/"[^"\n]*"/g, '""').replace(/[|}o][|o]--[|o][|{o]|[|}o][|o]\.\.[|o][|{o]/g, '--').replace(/\{\{|\}\}/g, ''); const opens = (bb.match(/[[{(]/g) || []).length, closes = (bb.match(/[\]})]/g) || []).length; if (Math.abs(opens - closes) > 0) why.push(`bracket imbalance ${opens}/${closes}`);
  if (/^sequenceDiagram/.test(first)) { const o = lines.filter((l) => /^(alt|opt|loop|par|critical|break|rect|box)\b/.test(l)).length, e = lines.filter((l) => l === 'end').length; if (o !== e) why.push(`seq blocks ${o} vs end ${e}`); }
  if (/^erDiagram/.test(first)) { if (lines.some((l) => /\b(?:varchar|int)\(\d+\)/i.test(l))) why.push('type with parens'); if (lines.some((l) => /^\w+\s+\w+\s+\w+\s+"[^"]*"\s+\w/.test(l))) why.push('junk after comment'); const rel = lines.filter((l) => /[|}o][|o]--|\.\./.test(l) && !/:/.test(l)); if (rel.length) why.push('relationship without label'); }
  if (/^(flowchart|graph)/.test(first)) { if (lines.some((l) => /\[(?!\()[^\]"]*[()][^\]"]*\](?<!\)\])/.test(l.replace(/\[\([^\]]*\)\]|\[\[[^\]]*\]\]|\[\/[^\]]*\/\]/g, '')))) why.push('unquoted parens in node label'); if (lines.filter((l) => /^subgraph\b/.test(l)).length !== lines.filter((l) => l === 'end').length) why.push('subgraph/end mismatch'); }
  if (/^gantt/.test(first) && !lines.some((l) => /^dateFormat/.test(l))) why.push('gantt without dateFormat');
  if (why.length) bad.push(`${f}: ${why.join(', ')}`);
}
add('mermaid', 'blocks_sane', mm.length && bad.length / mm.length <= 0.1, `${mm.length} blocks, ${bad.length} suspicious`);
const by = (a) => C.filter((c) => c.area === a || (a === 'completeness' && !['compliance', 'mermaid'].includes(c.area)));
const score = (a) => { const x = by(a); return x.length ? Math.round(100 * x.filter((c) => c.pass).length / x.length) : null; };
add('compliance', 'ascii_hyphen_ids', nbh === 0, `${nbh} IDs written with non-ASCII hyphens (breaks grep/traceability)`);
console.log(JSON.stringify({ root, tier, partial, files: files.length, mermaidBlocks: mm.length, mermaidSuspicious: bad, scores: { completeness: score('completeness'), compliance: score('compliance'), mermaid: score('mermaid') }, checks: C }, null, 2));
