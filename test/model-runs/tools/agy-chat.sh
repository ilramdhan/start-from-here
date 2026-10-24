#!/bin/bash
# Multi-turn chat-only driver for agy (no write permissions needed).
# Usage: agy-chat.sh <scratchdir> <model> <first-prompt-file> <maxturns>
set -u
D=$1; M=$2; P=$3; N=$4
cd "$D" || exit 1
T=transcript.md; : > $T
CID=""
for ((t=1; t<=N; t++)); do
  if [ $t -eq 1 ]; then MSG=$(cat "$P"); ARGS=(); else MSG="next"; ARGS=(--conversation "$CID"); fi
  for try in 1 2 3 4 5 6; do
    perl -e 'alarm 1700; exec @ARGV' agy -p "$MSG" --model "$M" --mode accept-edits --sandbox --print-timeout 1500s --output-format json ${ARGS[@]+"${ARGS[@]}"} > turn$t.json 2> turn$t.err
    if grep -qE "503|UNAVAILABLE|high traffic" turn$t.err turn$t.json; then echo "turn $t try $try: 503, retrying"; sleep 90; else break; fi
  done
  CID=$(node -e 'try{const j=JSON.parse(require("fs").readFileSync(process.argv[1],"utf8"));process.stdout.write(j.conversation_id||"")}catch{}' turn$t.json)
  node -e 'try{const j=JSON.parse(require("fs").readFileSync(process.argv[1],"utf8"));process.stdout.write(`\n\n<!-- TURN ${process.argv[2]} status=${j.status} out_tokens=${j.usage&&j.usage.output_tokens} -->\n\n`+(j.response||""))}catch(e){process.stdout.write(`\n\n<!-- TURN ${process.argv[2]} PARSE FAIL -->\n`)}' turn$t.json $t >> $T
  echo "turn $t cid=$CID bytes=$(wc -c < turn$t.json)"
  [ -z "$CID" ] && break
  if grep -qiE "Documentation is complete|I will not start implementation" turn$t.json; then echo DONE; break; fi
done
