// Minimal YAML frontmatter parser sufficient for SKILL.md (Agent Skills spec subset):
// top-level scalars (plain/quoted), one level of nested string maps (e.g. `metadata:`),
// and simple block lists (`- item`). Zero dependencies.

/**
 * @param {string} text full file text
 * @returns {{ data: Record<string, any>|null, body: string, raw: string|null, error?: string, bodyStartLine: number }}
 */
export function parseFrontmatter(text) {
  const src = text.replace(/^﻿/, '');
  const lines = src.split(/\r?\n/);
  if (lines[0].trim() !== '---') {
    return { data: null, body: src, raw: null, error: 'missing opening `---` frontmatter fence on line 1', bodyStartLine: 1 };
  }
  let end = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      end = i;
      break;
    }
  }
  if (end === -1) {
    return { data: null, body: src, raw: null, error: 'missing closing `---` frontmatter fence', bodyStartLine: 1 };
  }
  const fmLines = lines.slice(1, end);
  const body = lines.slice(end + 1).join('\n');
  try {
    return { data: parseYamlSubset(fmLines), body, raw: fmLines.join('\n'), bodyStartLine: end + 2 };
  } catch (e) {
    return { data: null, body, raw: fmLines.join('\n'), error: e.message, bodyStartLine: end + 2 };
  }
}

function unquote(v) {
  let s = v.trim();
  if (s === '') return '';
  // Quoted scalar followed by a trailing comment, e.g. `"1.0.0" # x-release-please-version`.
  const q = s.match(/^("(?:[^"\\]|\\.)*"|'(?:[^']|'')*')\s+#.*$/);
  if (q) s = q[1];
  if (s.startsWith('"') && s.endsWith('"') && s.length >= 2) {
    return s
      .slice(1, -1)
      .replace(/\\"/g, '"')
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\\\/g, '\\');
  }
  if (s.startsWith("'") && s.endsWith("'") && s.length >= 2) return s.slice(1, -1).replace(/''/g, "'");
  // strip trailing comment for plain scalars
  const hash = s.search(/\s#/);
  return hash >= 0 ? s.slice(0, hash).trim() : s;
}

function parseYamlSubset(lines) {
  const data = {};
  let currentKey = null; // key awaiting nested map / list / block scalar
  let blockMode = null; // 'map' | 'list' | 'block'
  let blockLines = [];
  let blockStyle = '';

  const flushBlock = () => {
    if (blockMode === 'block' && currentKey) {
      const joiner = blockStyle.startsWith('>') ? ' ' : '\n';
      data[currentKey] = blockLines.map((l) => l.trim()).join(joiner).trim();
    }
    blockLines = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*(#.*)?$/.test(line)) {
      if (blockMode === 'block') blockLines.push('');
      continue;
    }
    if (/\t/.test(line.match(/^\s*/)[0])) throw new Error(`tab indentation on frontmatter line ${i + 2}`);
    const indent = line.match(/^ */)[0].length;
    if (indent > 0) {
      if (!currentKey) throw new Error(`unexpected indentation on frontmatter line ${i + 2}`);
      const t = line.trim();
      if (blockMode === 'block') {
        blockLines.push(t);
        continue;
      }
      if (t.startsWith('- ') || t === '-') {
        if (blockMode && blockMode !== 'list') throw new Error(`mixed list/map under "${currentKey}" (line ${i + 2})`);
        blockMode = 'list';
        if (!Array.isArray(data[currentKey])) data[currentKey] = [];
        data[currentKey].push(unquote(t.slice(1)));
        continue;
      }
      const m = t.match(/^([^:]+?):(?:\s+(.*))?$/);
      if (!m) throw new Error(`cannot parse frontmatter line ${i + 2}: ${t}`);
      if (blockMode && blockMode !== 'map') throw new Error(`mixed list/map under "${currentKey}" (line ${i + 2})`);
      blockMode = 'map';
      if (typeof data[currentKey] !== 'object' || data[currentKey] === null || Array.isArray(data[currentKey])) data[currentKey] = {};
      const v = m[2] === undefined ? '' : m[2];
      if (v === '' ) throw new Error(`nested maps deeper than one level are not supported (line ${i + 2})`);
      data[currentKey][unquote(m[1])] = unquote(v);
      continue;
    }
    // top-level key
    flushBlock();
    blockMode = null;
    currentKey = null;
    const m = line.match(/^([A-Za-z0-9_.-]+):(?:\s+(.*)|\s*)$/);
    if (!m) throw new Error(`cannot parse frontmatter line ${i + 2}: ${line}`);
    const key = m[1];
    if (Object.prototype.hasOwnProperty.call(data, key)) throw new Error(`duplicate frontmatter key "${key}"`);
    const v = m[2] === undefined ? '' : m[2].trim();
    if (v === '') {
      data[key] = null;
      currentKey = key;
    } else if (/^[|>][+-]?$/.test(v)) {
      currentKey = key;
      blockMode = 'block';
      blockStyle = v;
    } else if (v.startsWith('[') && v.endsWith(']')) {
      data[key] = v
        .slice(1, -1)
        .split(',')
        .map((x) => unquote(x))
        .filter((x) => x !== '');
    } else {
      data[key] = unquote(v);
    }
  }
  flushBlock();
  return data;
}
