<!-- model=gemma4:12b-it-qat num_ctx=65536 system=sys-skill-only.md -->


<!-- USER TURN 1: I want to build a recipe sharing app, help me start  -->
<!-- prompt_eval=8190 eval=1012 secs=48 done_reason=stop -->

I have detected that you are starting a **New Project**.

I will act as your project discovery partner and architect. Here is what will happen:
1. **Interview:** I will ask you a series of questions to understand your vision, users, and requirements.
2. **Stack Recommendation:** I will suggest a sensible technology stack based on your needs.
3. **Brief Approval:** We will agree on a high-level summary of the project.
4. **Documentation:** I will generate a complete set of professional project documents (PRD, Architecture, Database schema, etc.).
5. **Audit & Handoff:** I will check the docs for consistency and provide a final prompt you can give to a coding agent to start building.

**Note:** I will **not** write any application code, install packages, or deploy anything. My job is to provide the blueprint.

To begin, I need to set up your project state.

### Phase 0: Orientation
I have detected **Chat-only mode**. I will deliver documents as markdown blocks for you to save.

I am creating your state file now.

```markdown
# start-from-here state
- skill_version: 1.0.0
- project: Recipe Sharing App (TBD)
- mode: new
- output_mode: chat-only
- language_conversation: English
- language_docs: English
- experience: intermediate
- tier: Standard
- phase: 1-calibrate
- next_step: Complete Round 0 of Calibration
- last_updated: 2024-05-22

## Domains answered
- [ ] vision  - [ ] users  - [ ] scope  - [ ] data  - [ ] nfr  - [ ] stack  - [ ] security  - [ ] ops  - [ ] team-oss-legal  - [ ] constraints

## Flags
- has_ui: yes · has_api: no · stores_data: yes · personal_data: no · regulated_data: none · open_source: no · public_facing: yes · app_store: no · regions: TBD · ai_tools_used: None

## Documents
| Path | Applicability | Status |
|---|---|---|
| docs/DISCOVERY.md | Required | Not started |
| docs/README.md | Required | Not started |
| docs/product/PRD.md | Required | Not started |
| docs/product/APP_FLOW.md | Required | Not started |
| docs/technical/ARCHITECTURE.md | Required | Not started |
| docs/technical/DATABASE.md | Required | Not started |
| docs/technical/SECURITY_ARCHITECTURE.md | Required | Not started |
| docs/technical/TESTING.md | Required | Not started |
| docs/technical/IMPLEMENTATION_PLAN.md | Required | Not started |
| docs/engineering/AI_GUIDELINES.md | Required | Not started |
| docs/engineering/CODE_STYLE.md | Required | Not started |
| docs/engineering/GIT_WORKFLOW.md | Required | Not started |
| docs/legal/PRIVACY_POLICY.md | Required | Not started |
| AGENTS.md | Required | Not started |

## Decisions
- D-01: None

## Open questions
- Q-01: Project name? — owner: user
```

---

### Phase 1: Calibration

Please answer the following questions to help me tailor my approach:

1. **Language** — Which language should we talk in, and which language should the documents use? (Default: English for both).
2. **Experience** — How familiar are you with software projects? 
   - (a) **Beginner** (I'm new to this; please explain technical terms).
   - (b) **Intermediate** (I've built a few things; give me trade-offs).
   - (c) **Expert** (I'm a professional; be terse and skip the basics).
3. **The Idea** — Describe your recipe sharing app in 1–3 sentences: what is it, who is it for, and why does it matter?
4. **Size Signals** — 
   - Who is building it (solo, small team)?
   - Is it a prototype/MVP, or a production-ready business?
   - Will it handle personal data (user profiles, emails)?
   - Is it intended to be open source?

**Proposed Tier:** Based on your input, I am currently leaning toward **Standard** (MVP/Product), but this may change based on your answers regarding data and scale.