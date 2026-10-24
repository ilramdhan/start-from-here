#!/usr/bin/env node
// Multi-turn chat with Ollama /api/chat. Usage:
// node ollama-chat.mjs <model> <systemPromptFile> <outDir> <numCtx> <turn1File> [turn2text|@file ...]
import fs from 'node:fs'; import path from 'node:path'; import { execFileSync } from 'node:child_process';
const [,, model, sysFile, outDir, numCtx, ...turns] = process.argv;
fs.mkdirSync(outDir, { recursive: true });
const messages = [{ role: 'system', content: fs.readFileSync(sysFile, 'utf8') }];
const tx = path.join(outDir, 'transcript.md'); fs.writeFileSync(tx, `<!-- model=${model} num_ctx=${numCtx} system=${path.basename(sysFile)} -->\n`);
for (let i = 0; i < turns.length; i++) {
  const t = turns[i];
  const content = i === 0 || t.startsWith('@') ? fs.readFileSync(t.replace(/^@/, ''), 'utf8') : t;
  messages.push({ role: 'user', content });
  const t0 = Date.now();
  const reqFile = path.join(outDir, `req${i + 1}.json`);
  fs.writeFileSync(reqFile, JSON.stringify({ model, messages, stream: false, think: false, options: { num_ctx: Number(numCtx), num_predict: 16384, temperature: 0.3 } }));
  let j; try { j = JSON.parse(execFileSync('curl', ['-s', '--max-time', '3600', 'http://localhost:11434/api/chat', '-H', 'content-type: application/json', '--data-binary', '@' + reqFile], { maxBuffer: 1 << 28 }).toString()); } catch (e) { j = { error: String(e).slice(0, 300) }; }
  fs.unlinkSync(reqFile);
  const reply = j.message?.content ?? `ERROR: ${JSON.stringify(j).slice(0, 500)}`;
  messages.push({ role: 'assistant', content: reply });
  const meta = `prompt_eval=${j.prompt_eval_count} eval=${j.eval_count} secs=${((Date.now() - t0) / 1000).toFixed(0)} done_reason=${j.done_reason}`;
  fs.appendFileSync(tx, `\n\n<!-- USER TURN ${i + 1}: ${content.slice(0, 120).replace(/\n/g, ' ')} -->\n<!-- ${meta} -->\n\n${reply}`);
  console.log(`turn ${i + 1}: ${meta}`);
}
