<!-- guidance: OPTIONAL file. Create it ONLY if the team uses Claude Code. It is a thin pointer: all shared rules live in AGENTS.md.
Claude Code reads CLAUDE.md (not AGENTS.md) and expands `@path` imports, so the line below pulls AGENTS.md into context.
Add only Claude-specific notes here (e.g. preferred slash commands, subagent usage). Never duplicate AGENTS.md content — duplicates drift.
No status header: this file is loaded verbatim into the agent's context; keep it minimal. Remove guidance comments in output. -->

# CLAUDE.md

@AGENTS.md

## Claude Code specifics

- Read `AGENTS.md` (imported above) first; it is the single source of truth for commands, rules, and boundaries.
- Detailed AI rules: `docs/engineering/AI_GUIDELINES.md`.
- {{claude_specific_note}} <!-- e.g. "Use plan mode for any task touching more than 3 files." Delete if none. -->
