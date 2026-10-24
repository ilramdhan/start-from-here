<!-- guidance: OPTIONAL file. Create it ONLY if the team uses Gemini CLI / Gemini Code Assist. It is a thin pointer to AGENTS.md.
Gemini CLI supports `@path` imports in GEMINI.md, so the line below includes AGENTS.md. Alternative: set
`"context": { "fileName": ["AGENTS.md", "GEMINI.md"] }` in `.gemini/settings.json` and drop this file entirely.
Add only Gemini-specific notes here; never duplicate AGENTS.md content. Remove guidance comments in output. -->

# GEMINI.md

@AGENTS.md

## Gemini specifics

- Read `AGENTS.md` (imported above) first; it is the single source of truth for commands, rules, and boundaries.
- Detailed AI rules: `docs/engineering/AI_GUIDELINES.md`.
- {{gemini_specific_note}} <!-- delete if none -->
