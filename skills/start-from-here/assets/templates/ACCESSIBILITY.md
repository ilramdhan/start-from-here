# Accessibility Statement — {{product_name}}

> **Status:** Draft · **Owner:** {{owner}} · **Last updated:** {{yyyy_mm_dd}} · **Tier:** {{tier}} · **Related:** [DESIGN_SYSTEM](docs/product/DESIGN_SYSTEM.md), [TESTING](docs/technical/TESTING.md), [CODE_STYLE](docs/engineering/CODE_STYLE.md), [COMPLIANCE](docs/legal/COMPLIANCE.md)

<!-- guidance: Create for any product with a user interface (web, mobile, desktop, kiosk; also CLIs if they claim screen-reader support).
Before launch this is a COMMITMENT + plan; after an audit it becomes a statement of actual conformance.
RULES FOR THE AI: never claim "fully conformant" or any conformance level that has not been verified by an assessment (record method + date).
Before verification, use "We aim to conform to…" and status "Not yet assessed". Legal drivers to check in COMPLIANCE.md: European
Accessibility Act (EAA, applies from 28 June 2025 to many consumer products/services in the EU), EN 301 549, ADA (US), Section 508 (US federal),
AODA (Ontario), public-sector web accessibility rules. Public-sector bodies in some jurisdictions must follow a prescribed statement format — check.
Conformance target default: WCAG 2.2 Level AA (https://www.w3.org/TR/WCAG22/).
Tier notes — Lite: sections 1, 2, 5. Standard: all. Enterprise/regulated: add VPAT/ACR reference, EN 301 549 mapping, formal approval,
and annual review. This is not legal advice. Remove guidance comments in output. -->

## 1. Our commitment

{{organization_name}} is committed to making {{product_name}} accessible to everyone, including people with disabilities, and to continually improving the experience for all users.

## 2. Conformance status

- **Target standard:** [Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/), Level **AA**{{additional_standards}} <!-- e.g. ", and EN 301 549 v3.2.1" -->.
- **Current status:** {{conformance_status}} <!-- one of: Not yet assessed · Partially conformant · Fully conformant (only with a completed assessment) -->
- **Scope:** {{scope}} <!-- e.g. web app at app.example.com, iOS and Android apps vX.Y; excludes third-party embedded content -->

## 3. Measures we take

- Accessibility requirements are part of our [design system](docs/product/DESIGN_SYSTEM.md) (color contrast, focus states, touch targets, motion preferences).
- Coding rules: semantic markup, labels, keyboard operability, ARIA only when needed ([CODE_STYLE](docs/engineering/CODE_STYLE.md)).
- Automated checks in CI: {{automated_a11y_tools}} <!-- e.g. axe-core, Lighthouse CI, pa11y, eslint-plugin-jsx-a11y, Android Accessibility Scanner, Xcode Accessibility Inspector, or "Not configured" -->
- Manual testing with keyboard and screen readers: {{assistive_tech_tested}} <!-- e.g. NVDA + Firefox, VoiceOver + Safari/iOS, TalkBack -->
- Accessibility acceptance criteria included in [TESTING](docs/technical/TESTING.md) and PR reviews.
- {{training_or_other_measures}}

## 4. Known limitations

| Area / content | Issue | WCAG criterion | Workaround | Planned fix |
|---|---|---|---|---|
| {{area}} | {{issue}} | {{wcag_sc}} <!-- e.g. 1.4.3 Contrast (Minimum) --> | {{workaround}} | {{planned_fix_date_or_tbd}} |

<!-- guidance: List only known, real issues. Before the first assessment write "To be determined after initial assessment." -->

## 5. Feedback and contact

We welcome your feedback. If you encounter an accessibility barrier, contact us:

- Email: {{accessibility_contact_email}}
- {{other_contact_methods}} <!-- phone, form, postal -->

We aim to respond within {{response_time}}. If you are not satisfied with our response, you may contact {{enforcement_body_or_delete}}.

## 6. Compatibility

{{product_name}} is designed to work with {{supported_browsers_and_assistive_tech}}. It may not work well with {{unsupported_environments}}.

## 7. Assessment approach

| Date | Method | Scope | Assessor | Result / report |
|---|---|---|---|---|
| {{assessment_date}} | {{method}} <!-- self-evaluation, external audit, automated + manual --> | {{scope}} | {{assessor}} | {{report_link}} |

## 8. Date

This statement was prepared on {{statement_date}} and last reviewed on {{last_review_date}}. We review it {{review_cadence}} and after major releases.

## Definition of done (this document)

- [ ] Conformance status truthful (no claim without a dated assessment).
- [ ] Measures match DESIGN_SYSTEM.md, CODE_STYLE.md, and TESTING.md; tools named are actually configured or marked so.
- [ ] Real, monitored feedback contact.
- [ ] Legal drivers cross-checked in COMPLIANCE.md.
- [ ] No `{{placeholders}}` or guidance comments remain.
