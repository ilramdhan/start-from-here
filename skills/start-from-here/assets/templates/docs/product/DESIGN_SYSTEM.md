# Design System — {{product_name}}

> **Status:** Draft · **Owner:** {{design_owner}} · **Last updated:** {{last_updated}} · **Tier:** {{tier}} · **Related:** [PRD](PRD.md) · [APP_FLOW](APP_FLOW.md) · [ACCESSIBILITY](../../ACCESSIBILITY.md) · [TESTING](../technical/TESTING.md)

<!-- guidance: Record APPROVED values only. If the user has no brand yet, propose a minimal accessible palette as
> **PROPOSAL:** and verify contrast ratios before writing them; never claim a ratio you did not compute.
Tokens are named semantically (color.text.primary), not by appearance (color.gray700), so themes can change values
without renaming. Map tokens to the chosen implementation (CSS custom properties, Tailwind theme, iOS asset catalog,
Android/Compose theme, Flutter ThemeData, terminal ANSI styles) in §10.
For a CLI-only product, keep §1, §6 (voice), §7 (accessibility), and add terminal rules: color only as enhancement,
honor NO_COLOR / non-TTY, machine-readable output. For an API/library with no UI, mark this doc N/A in docs/README.md.
BEFORE WRITING: read references/product-guide.md §13. Derive the component list from the APP_FLOW inventory and state
matrix (APP_FLOW §2, §11): every component used there appears in §3 with every applicable state. Write the whole document
in one pass; every cell is filled, PROPOSAL, `Not checked`, or "N/A — reason". -->

<!-- guidance: Tier notes —
Lite: §1, a short token table (color incl. dark mode, type, spacing, radius), primary components with states, §7 accessibility checklist.
Standard: all sections.
Standard minimums: color tokens incl. status colors in light + dark (or N/A — single theme), ≥ 4 type tokens, spacing scale, ≥ 6 components with all states, §11 message patterns, §12 dos/don'ts.
Enterprise: add token governance (versioning, deprecation), design-to-code source of truth (e.g. design tool library + token pipeline), contribution process, visual regression testing, and per-locale QA. -->

## 1. Design direction
- **Audience & context:** {{who_where_on_what_devices}}
- **Brand attributes:** {{three_adjectives}} <!-- guidance: e.g. calm, precise, trustworthy -->
- **References:** {{links — what to borrow / what to avoid}}
- **Platforms & form factors:** {{e.g. web ≥ 320 px, iOS/Android phones, desktop 1280+, terminal 80 cols}}
- **Source of truth:** {{design_file_or_token_repo_or_[TBD]}}

## 2. Design tokens

### 2.1 Color
<!-- guidance: Text contrast ≥ 4.5:1 (≥ 3:1 for large text ≥ 24 px / 18.66 px bold); UI components & focus indicators ≥ 3:1 against adjacent colors (WCAG 2.2 AA). Never use color as the only signal. -->
| Token | Light | Dark | Usage | Contrast verified |
| --- | --- | --- | --- | --- |
| color.bg.canvas | {{value}} | {{value}} | App background | n/a |
| color.bg.surface | {{value}} | {{value}} | Cards, sheets | n/a |
| color.text.primary | {{value}} | {{value}} | Body text | {{ratio_or_Not checked}} |
| color.text.muted | {{value}} | {{value}} | Secondary text | {{ratio}} |
| color.action.primary | {{value}} | {{value}} | Primary buttons/links | {{ratio}} |
| color.border.default | {{value}} | {{value}} | Inputs, dividers | {{ratio}} |
| color.focus.ring | {{value}} | {{value}} | Focus indicator | {{ratio}} |
| color.status.success / warning / danger / info | {{values}} | {{values}} | Feedback, always paired with icon/text | {{ratio}} |

- **Theme switching:** {{follow OS preference / user toggle / both}}; persisted in {{where}}.

### 2.2 Typography
| Token | Family | Size / line height | Weight | Usage |
| --- | --- | --- | --- | --- |
| font.display | {{family}} | {{size/lh}} | {{weight}} | Page titles |
| font.heading | {{family}} | {{size/lh}} | {{weight}} | Section headings |
| font.body | {{family}} | {{size/lh}} | {{weight}} | Body copy |
| font.mono | {{family}} | {{size/lh}} | {{weight}} | Code, IDs |
- Respect user text scaling (browser zoom to 200%, iOS Dynamic Type, Android font scale) without loss of content.
- Font licensing: {{license_of_each_font}}

### 2.3 Spacing, sizing, radius, elevation
| Token | Value | Usage |
| --- | --- | --- |
| space.unit | {{e.g. 4 px / 8 pt}} | Base unit; scale {{e.g. 4, 8, 12, 16, 24, 32, 48}} |
| size.target.min | {{≥ 24×24 CSS px (WCAG 2.2); 44 pt iOS / 48 dp Android recommended}} | Touch/click targets |
| radius.control / radius.surface | {{values}} | Inputs/buttons; cards |
| elevation.1–3 | {{shadow_or_tonal_values}} | Layering |

### 2.4 Layout & breakpoints
| Breakpoint | Min width | Columns / gutter | Behavior |
| --- | --- | --- | --- |
| {{sm}} | {{value}} | {{value}} | {{e.g. single column, bottom nav}} |
| {{lg}} | {{value}} | {{value}} | {{e.g. sidebar nav}} |

## 3. Components
<!-- guidance: List only components the product needs. Every interactive component defines all applicable states. -->
| Component | Variants | States (default · hover · focus-visible · active · disabled · loading · error · success) | A11y notes |
| --- | --- | --- | --- |
| Button | {{primary, secondary, destructive, ghost}} | {{state_rules}} | Native button semantics; loading announces status |
| Text field | {{text, password, search}} | {{state_rules}} | Visible label (not placeholder-only); error linked via description |
| Select / combobox | {{variants}} | {{state_rules}} | Keyboard operable |
| Dialog / sheet | {{variants}} | {{state_rules}} | Focus trapped and restored; Esc closes |
| Toast / alert | {{info, success, warning, error}} | {{state_rules}} | Polite/assertive live region as appropriate |
| Navigation | {{tabs, sidebar, bottom bar}} | {{state_rules}} | Current item exposed (e.g. aria-current) |
| Table / list | {{variants}} | {{empty, loading, error}} | Headers associated |
| Empty state | {{with_action, no_results, first_use}} | {{state_rules}} | Heading + description + one primary action |
| Progress / skeleton | {{spinner, bar, skeleton}} | {{state_rules}} | Busy state announced; no layout shift |
| {{component_from_APP_FLOW}} | {{variants}} | {{state_rules}} | {{a11y_notes}} |

### 3.1 Forms
- Label above field; required fields marked in text, not color only.
- Validate on {{blur/submit}}; error text says what is wrong and how to fix it; focus moves to first error on submit.
- Never clear user input on error.

## 4. Iconography & imagery
- Icon set: {{name_and_license}}; decorative icons hidden from assistive tech; icon-only buttons have accessible names.
- Assets needed: {{logo, app icon sizes, illustrations, screenshots, favicon, social card}}

## 5. Motion
| Token | Duration | Easing | Usage |
| --- | --- | --- | --- |
| motion.fast | {{e.g. 100–150 ms}} | {{easing}} | Hover, toggles |
| motion.standard | {{e.g. 200–300 ms}} | {{easing}} | Panels, dialogs |
- Honor reduced-motion preferences (prefers-reduced-motion, OS settings): replace movement with fades or none.
- No flashing content more than 3 times per second.

## 6. Content and voice
- **Voice:** {{e.g. plain, direct, friendly; no jargon}}
- **Capitalization:** {{sentence case for UI labels}} · **Dates/numbers:** locale-formatted
- **Error messages:** what happened + how to fix; no blame, no stack traces, include a reference ID when useful.
- **Terminology:** use glossary terms from [PRD §16](PRD.md#16-glossary) consistently.

## 7. Accessibility (target: WCAG 2.2 Level AA)
- [ ] All functionality operable by keyboard; logical focus order; visible focus (not obscured by sticky UI).
- [ ] Contrast thresholds in §2.1 verified for light and dark themes.
- [ ] Semantic structure: landmarks/headings (web), accessibility labels/traits (iOS), contentDescription/semantics (Android/Flutter).
- [ ] Target size ≥ 24×24 CSS px; drag actions have a single-pointer alternative.
- [ ] No content relies on color, shape, or sound alone; captions/transcripts for media.
- [ ] Content reflows at 320 CSS px and 200% zoom / large text settings.
- [ ] Authentication doesn't require cognitive tests (allow paste, password managers).
- [ ] Verification: {{automated tool + manual screen-reader pass (e.g. VoiceOver, TalkBack, NVDA)}} — see [TESTING](../technical/TESTING.md).

## 8. Internationalization & localization
- Supported locales: {{locales}} · default {{locale}}
- No hard-coded strings; allow ~30–40% text expansion; avoid text in images.
- RTL support: {{required / not required}} — if required, use logical properties (start/end) and mirror directional icons.
- Locale-aware dates, numbers, currency, plurals, and sorting.

## 9. Screen notes
| Screen (APP_FLOW ID) | Key content & hierarchy | Primary action | States to design |
| --- | --- | --- | --- |
| S-01 | {{content}} | {{action}} | empty · loading · error · populated |

## 10. Implementation mapping
- Token format & pipeline: {{e.g. JSON (W3C design tokens format) → CSS variables / platform themes}} or [TBD]
- Component library: {{existing library or custom}} — approved in [ARCHITECTURE](../technical/ARCHITECTURE.md)

## 11. Message and pattern library
<!-- guidance: Write real example strings so APP_FLOW messages stay consistent. Use the PRD glossary terms. Keep ≥ 1 example per row; N/A rows say why. -->
| Pattern | Structure | Example | Component |
| --- | --- | --- | --- |
| Validation error | What is wrong + how to fix | {{"Title is required."}} | Text field helper |
| Server / unexpected error | What happened + what to do + reference | {{"We couldn't save your note. Try again. (Ref: 7F3A)"}} | Alert / toast |
| Empty state | What goes here + primary action | {{"No notes yet. Create your first note."}} | Empty state |
| Permission denied | What you can't do + who can help | {{"You don't have permission to share this note. Ask an admin."}} | Alert |
| Destructive confirm | Consequence + exact object + explicit verb | {{"Delete 'Q3 plan'? This can't be undone." [Delete] [Cancel]}} | Dialog |
| Success | Past tense, short | {{"Note shared."}} | Toast |
| Offline / pending | State + what happens next | {{"Offline. Changes will sync when you're back online."}} | Banner / badge |
| CLI error (if CLI) | `error: <what>` + hint + exit code | {{"error: config not found. Run `tool init`. (exit 2)"}} | stderr |

### 11.1 Screen layout patterns
<!-- guidance: Standard+. One ASCII wireframe per layout archetype used in APP_FLOW (list, detail, form, dashboard). Boxes only; no visual design claims. -->

```text
+--------------------------------------------------+
| {{logo}}   {{nav_items}}                {{user}} |
+----------+---------------------------------------+
| {{side}} | {{page_title}}            [{{primary}}]|
| {{nav}}  | +-----------------------------------+ |
|          | | {{list_or_form_content}}          | |
|          | | empty / loading / error states    | |
|          | +-----------------------------------+ |
+----------+---------------------------------------+
```

### 11.2 Component state model
<!-- guidance: Optional diagram showing allowed state transitions for interactive components (e.g. a submit button). -->

```mermaid
stateDiagram-v2
    [*] --> Default
    Default --> Hover: pointer over
    Default --> Focus: keyboard focus
    Focus --> Active: press
    Hover --> Active: press
    Active --> Loading: submit
    Loading --> Success: done
    Loading --> Error: failed
    Error --> Default: edit input
    Success --> Default: timeout
    Default --> Disabled: precondition unmet
    Disabled --> Default: precondition met
```

## 12. Design dos and don'ts
<!-- guidance: Keep these; add project-specific rules from DISCOVERY (DES-*). -->
| Do | Don't |
| --- | --- |
| Use semantic tokens (`color.text.primary`) everywhere. | Hard-code hex values or pixel sizes in components. |
| Pair status color with text or an icon. | Signal meaning with color alone. |
| Compute contrast and record the ratio. | Estimate or claim ratios you did not check. |
| Show a visible label for every input. | Use placeholder text as the only label. |
| Keep focus visible and order logical. | Remove outlines without a replacement focus style. |
| Reuse an existing component and add a variant. | Create a near-duplicate component for one screen. |
| Design empty, loading, and error states with the populated state. | Design only the "happy" populated screen. |
| Respect reduced motion and text scaling. | Animate essential information or lock font sizes. |

## Definition of done
- [ ] Tokens cover color (light + dark), type, spacing, radius, motion, with approved values (or PROPOSAL markers).
- [ ] Contrast ratios computed, not guessed; status colors always paired with text/icon.
- [ ] Every component in use defines its interactive states.
- [ ] WCAG 2.2 AA checklist and verification method agreed; i18n/RTL decision recorded.
- [ ] Every key screen in APP_FLOW has notes and designed states.

### Completeness self-check
<!-- guidance: Tick every box before presenting. Fix, or write "N/A — reason" next to the box. -->
- [ ] Every component used in APP_FLOW §2/§11 is in §3 with all applicable states.
- [ ] Every color token has light and dark values (or N/A — single theme), usage, and a computed ratio or `Not checked`.
- [ ] Unapproved values are marked PROPOSAL; nothing claims brand approval that DISCOVERY does not record.
- [ ] Typography, spacing, radius, elevation, motion tokens are filled.
- [ ] §7 accessibility checklist has a verification method; §8 locale/RTL decision recorded.
- [ ] §9 has a row for every key S-xx; §11 messages match APP_FLOW §4 error texts.
- [ ] CLI-only product: terminal rules (NO_COLOR, non-TTY, width) replace visual tokens.
- [ ] No `{{placeholders}}` or guidance comments remain.
