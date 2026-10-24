import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const site = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'site');
const read = (f) => fs.readFileSync(path.join(site, f), 'utf8');
const html = read('index.html');

function jsonLd() {
  const m = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(m, 'JSON-LD block present');
  return JSON.parse(m[1]);
}

test('index.html declares a 1200x630 PNG og:image', () => {
  const img = html.match(/property="og:image" content="([^"]+)"/)[1];
  assert.ok(img.endsWith('.png'));
  assert.match(html, /property="og:image:width" content="1200"/);
  assert.match(html, /property="og:image:height" content="630"/);
  assert.match(html, /name="twitter:image" content="[^"]+\.png"/);
});

test('JSON-LD has SoftwareApplication and FAQPage matching visible FAQ', () => {
  const graph = jsonLd()['@graph'];
  assert.ok(graph.find((n) => n['@type'] === 'SoftwareApplication'));
  const faq = graph.find((n) => n['@type'] === 'FAQPage');
  assert.ok(faq);
  const faqSection = html.match(/<section id="faq"[\s\S]*?<\/section>/)[0];
  const visible = (faqSection.match(/<details>/g) || []).length;
  assert.ok(faq.mainEntity.length >= 5);
  assert.ok(visible >= faq.mainEntity.length);
  for (const q of faq.mainEntity) {
    assert.ok(faqSection.includes(q.name.replace(/&/g, '&amp;')), `visible question: ${q.name}`);
  }
});

test('sitemap.xml lists 7 URLs', () => {
  assert.equal((read('sitemap.xml').match(/<loc>/g) || []).length, 7);
});

test('llms.txt starts with a heading', () => {
  assert.ok(read('llms.txt').startsWith('# '));
  assert.ok(read('llms-full.txt').startsWith('# '));
});

test('og.png is a 1200x630 PNG', () => {
  const b = fs.readFileSync(path.join(site, 'assets', 'og.png'));
  assert.equal(b.subarray(1, 4).toString(), 'PNG');
  assert.equal(b.subarray(12, 16).toString(), 'IHDR');
  assert.equal(b.readUInt32BE(16), 1200);
  assert.equal(b.readUInt32BE(20), 630);
});

test('manifest icons exist', () => {
  const m = JSON.parse(read('manifest.webmanifest'));
  assert.ok(m.icons.length >= 2);
  for (const i of m.icons) assert.ok(fs.existsSync(path.join(site, i.src)), i.src);
});
