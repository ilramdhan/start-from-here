# start-from-here state
- skill_version: 1.0.0
- project: Streak
- mode: new
- output_mode: chat-only
- language_conversation: English
- language_docs: English
- experience: beginner
- tier: Lite
- phase: 5-generate
- next_step: Deliver docs/product/PRD.md and docs/product/APP_FLOW.md
- last_updated: 2026-10-24

## Domains answered
- [x] vision  - [x] users  - [x] scope  - [x] data  - [x] nfr  - [x] stack  - [x] security  - [x] ops  - [x] team-oss-legal  - [x] constraints

## Flags
- has_ui: yes · has_api: no · stores_data: yes · personal_data: no · regulated_data: none · open_source: no · public_facing: yes · app_store: yes · regions: Global (English only) · ai_tools_used: none specified

## Documents
| Path | Applicability | Status |
|---|---|---|
| docs/.start-from-here/STATE.md | Required | Approved |
| docs/DISCOVERY.md | Required | Approved |
| docs/product/PRD.md | Required | In review |
| docs/product/APP_FLOW.md | Required (UI) | In review |
| docs/product/DESIGN_SYSTEM.md | Skipped (Lite default off) | Skipped |
| docs/technical/TRD.md | Skipped (merged into ARCHITECTURE) | Skipped |
| docs/technical/ARCHITECTURE.md | Required | In review |
| docs/decisions/README.md | Skipped (merged into ARCHITECTURE §12) | Skipped |
| docs/technical/DATABASE.md | Required (data) | In review |
| docs/technical/API.md | Skipped (no remote API) | Skipped |
| docs/technical/SECURITY_ARCHITECTURE.md | Required (Lite short) | In review |
| docs/technical/TESTING.md | Required | In review |
| docs/technical/OPERATIONS.md | Skipped (merged into ARCHITECTURE §14.4) | Skipped |
| docs/engineering/CODE_STYLE.md | Required | In review |
| docs/engineering/GIT_WORKFLOW.md | Skipped (merged into CODE_STYLE §14) | Skipped |
| docs/engineering/AI_GUIDELINES.md | Required | In review |
| docs/technical/IMPLEMENTATION_PLAN.md | Required | In review |
| docs/legal/TERMS_OF_SERVICE.md | Skipped (Standard store EULA applies) | Skipped |
| docs/legal/PRIVACY_POLICY.md | Required (App Store & Google Play distribution) | In review |
| docs/legal/COOKIE_POLICY.md | Skipped (mobile app, no web cookies) | Skipped |
| docs/legal/COMPLIANCE.md | Skipped (Lite / no regulated data) | Skipped |
| README.md | Required | In review |
| LICENSE | Required | In review |
| CHANGELOG.md | Skipped (Lite default off) | Skipped |
| CONTRIBUTING.md | Skipped (proprietary, closed source) | Skipped |
| CODE_OF_CONDUCT.md | Skipped (proprietary, closed source) | Skipped |
| SECURITY.md | Skipped (Lite proprietary, email in README) | Skipped |
| SUPPORT.md | Skipped (email in README & Privacy Policy) | Skipped |
| ACCESSIBILITY.md | Skipped (folded into PRD & TESTING) | Skipped |
| AGENTS.md | Required | In review |
| docs/README.md | Required | In review |

## Decisions
- D-01: Build as a standalone cross-platform mobile app using React Native with Expo (TypeScript) — Accepted recommendation — 2026-10-24
- D-02: Use local embedded SQLite (`expo-sqlite`) for habit and history persistence — Accepted recommendation — 2026-10-24
- D-03: Zero remote servers or external APIs; all data remains strictly on-device — Decided by User — 2026-10-24
- D-04: Free MVP without subscriptions, in-app purchases, or advertisements — Decided by User — 2026-10-24
- D-05: Proprietary commercial license (All Rights Reserved) with distribution via Apple App Store and Google Play Store — Decided by User — 2026-10-24
- D-06: Local notifications using `expo-notifications` for habit reminder alarms without remote push services — Accepted recommendation — 2026-10-24

## Open questions
- Q-01: Which specific email address will be designated for user support and privacy inquiries? — owner: Solo Developer — needed by: Store submission
- Q-02: Will Apple Developer ($99/yr) and Google Play Developer ($25 one-time) accounts be set up before Milestone 5? — owner: Solo Developer — needed by: Milestone 5
