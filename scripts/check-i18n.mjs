#!/usr/bin/env node
// Zero-dependency consistency check for the GitHub Pages site translations.
// - every site/i18n/<lang>.json parses and has exactly the same (flattened) keys as en.json
// - no value is empty, and placeholders like {count} match the English string
// - every data-i18n* key used in site/*.html exists in en.json, and every key is used
// - every language is listed in site/i18n/languages.json (and vice versa)
// Usage: node scripts/check-i18n.mjs [siteDir]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = path.resolve(process.argv[2] || path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'site'));
const I18N = path.join(SITE, 'i18n');
const errors = [];
const warn = [];

function flatten(obj, prefix = '', out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) flatten(v, key, out);
    else out[key] = v;
  }
  return out;
}
const placeholders = (s) => [...String(s).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',');
const read = (f) => {
  try {
    return JSON.parse(fs.readFileSync(f, 'utf8'));
  } catch (e) {
    errors.push(`${path.relative(SITE, f)}: invalid JSON (${e.message})`);
    return null;
  }
};

const langsFile = read(path.join(I18N, 'languages.json')) || [];
const listed = new Set(langsFile.map((l) => l.code));
const files = fs.readdirSync(I18N).filter((f) => f.endsWith('.json') && f !== 'languages.json');
const en = flatten(read(path.join(I18N, 'en.json')) || {});
const enKeys = Object.keys(en);

for (const f of files) {
  const code = f.replace(/\.json$/, '');
  if (!listed.has(code)) errors.push(`i18n/${f}: language "${code}" missing from languages.json`);
  if (code === 'en') continue;
  const data = read(path.join(I18N, f));
  if (!data) continue;
  const flat = flatten(data);
  for (const k of enKeys) if (!(k in flat)) errors.push(`i18n/${f}: missing key "${k}"`);
  for (const k of Object.keys(flat)) if (!(k in en)) errors.push(`i18n/${f}: extra key "${k}"`);
  for (const [k, v] of Object.entries(flat)) {
    if (typeof v !== 'string' || !v.trim()) errors.push(`i18n/${f}: empty value for "${k}"`);
    else if (k in en && placeholders(v) !== placeholders(en[k])) errors.push(`i18n/${f}: placeholders differ for "${k}"`);
  }
  const same = Object.keys(flat).filter((k) => flat[k] === en[k] && /[a-z]{4,}\s+[a-z]{4,}/i.test(en[k]));
  if (same.length > enKeys.length * 0.15) warn.push(`i18n/${f}: ${same.length} values identical to English — untranslated?`);
}
for (const code of listed) if (!files.includes(`${code}.json`)) errors.push(`languages.json lists "${code}" but i18n/${code}.json is missing`);

// keys used by the HTML
const used = new Set();
for (const f of fs.readdirSync(SITE).filter((x) => x.endsWith('.html'))) {
  const html = fs.readFileSync(path.join(SITE, f), 'utf8');
  for (const m of html.matchAll(/data-i18n(?:-[a-z-]+)?="([^"]+)"/g)) {
    // data-i18n-attr="attr:key;attr2:key2"
    const parts = m[0].startsWith('data-i18n-attr') ? m[1].split(';').map((p) => p.split(':')[1]) : [m[1]];
    for (const k of parts) {
      const key = k && k.trim();
      if (!key) continue;
      used.add(key);
      if (!(key in en)) errors.push(`${f}: data-i18n key "${key}" not in en.json`);
    }
  }
}
// keys used from JS (t('key'))
const jsFile = path.join(SITE, 'assets', 'app.js');
if (fs.existsSync(jsFile)) {
  for (const m of fs.readFileSync(jsFile, 'utf8').matchAll(/\bt\(\s*'([\w.-]+)'/g)) {
    used.add(m[1]);
    if (!(m[1] in en)) errors.push(`assets/app.js: key "${m[1]}" not in en.json`);
  }
}
for (const k of enKeys) if (!used.has(k) && !k.startsWith('meta.')) warn.push(`en.json: key "${k}" is never used`);

warn.forEach((w) => console.warn(`⚠ ${w}`));
if (errors.length) {
  errors.forEach((e) => console.error(`✖ ${e}`));
  console.error(`\n${errors.length} i18n error(s).`);
  process.exitCode = 1;
} else {
  console.log(`✔ ${files.length} languages × ${enKeys.length} keys consistent.`);
}
