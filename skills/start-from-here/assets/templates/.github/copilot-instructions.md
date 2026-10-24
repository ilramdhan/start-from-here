<!-- guidance: OPTIONAL file. Create it ONLY if the team uses GitHub Copilot. Copilot reads repository custom instructions from
`.github/copilot-instructions.md`; recent Copilot coding agent versions also read AGENTS.md, but keep this pointer for chat/IDE surfaces.
Copilot does NOT expand `@file` imports here, so state the instruction to read AGENTS.md explicitly and keep a 3–5 line essentials list.
Never duplicate the full AGENTS.md — duplicates drift. Remove guidance comments in output. -->

# Copilot instructions — {{project_name}}

The authoritative instructions for AI agents in this repository are in [`AGENTS.md`](../AGENTS.md). Read it before suggesting or writing code, and follow its commands, working rules, boundaries, and definition of done. Detailed rules: [`docs/engineering/AI_GUIDELINES.md`](../docs/engineering/AI_GUIDELINES.md).

Essentials (summary only — AGENTS.md wins on conflict):

- Stack: {{primary_language_and_version}} · {{framework}}. Follow [`docs/engineering/CODE_STYLE.md`](../docs/engineering/CODE_STYLE.md).
- Use only commands listed in AGENTS.md; never invent commands, APIs, dependencies, or test results.
- Never add dependencies, change schemas/migrations, or touch auth/security code without explicit approval.
- Never include secrets or personal data in code, tests, or suggestions.
