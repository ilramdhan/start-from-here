# Cookie Policy — {{product_name}}

> **Status:** Draft · **Owner:** {{owner}} · **Last updated:** {{yyyy_mm_dd}} · **Tier:** {{tier}} · **Related:** [PRIVACY_POLICY](PRIVACY_POLICY.md), [COMPLIANCE](COMPLIANCE.md), [ARCHITECTURE](../technical/ARCHITECTURE.md)

> [!CAUTION]
> **This is a draft, not legal advice. Have it reviewed by qualified counsel.** This document MUST be reviewed by qualified legal counsel before publication. It does not establish compliance with the ePrivacy Directive, GDPR, PECR, CCPA/CPRA, or any other law.

<!-- guidance: OPTIONAL. Create only for web products (or apps with SDKs) that set cookies, local storage, pixels, or similar trackers.
If the product uses ONLY strictly necessary cookies, a short section in PRIVACY_POLICY may suffice — ask the user.
RULES FOR THE AI: list only cookies/SDKs actually planned in ARCHITECTURE.md/OPERATIONS.md (analytics, auth, payments, A/B testing, ads).
Never invent cookie names or durations — mark `[TBD: verify in browser devtools after implementation — owner]`.
Under EU/UK ePrivacy rules, non-essential cookies require prior opt-in consent; "reject" must be as easy as "accept"; no pre-ticked boxes.
California: "sharing" for cross-context behavioral advertising requires an opt-out and honoring Global Privacy Control.
Tier notes — Lite: categories table + how to manage. Standard/Enterprise: full table per cookie, consent tool, re-consent cadence. -->

**Effective date:** {{effective_date}}

## 1. What are cookies and similar technologies?

Cookies are small text files stored on your device by your browser. Similar technologies include local storage, session storage, pixels/web beacons, and mobile SDK identifiers. We call them all "cookies" here.

## 2. Categories we use

| Category | Purpose | Consent required? | Used? |
|---|---|---|---|
| Strictly necessary | Sign-in, security, load balancing, remembering consent choices | No (exempt) | {{yes_no}} |
| Preferences | Language, theme, UI settings | {{consent_required}} | {{yes_no}} |
| Analytics | Understanding usage to improve the product | Yes (EU/UK), unless exempt under local rules | {{yes_no}} |
| Marketing / advertising | Measuring campaigns, personalized ads, cross-site tracking | Yes | {{yes_no}} |

## 3. Cookies in detail

| Name | Provider (first/third party) | Category | Purpose | Duration |
|---|---|---|---|---|
| {{cookie_name}} | {{provider}} | {{category}} | {{purpose}} | {{duration}} |

## 4. Managing your choices

- Consent banner / preference center: {{consent_tool_description}} <!-- e.g. "Cookie settings" link in the footer; name the CMP if used -->. You can change or withdraw consent at any time.
- Browser settings let you block or delete cookies; blocking strictly necessary cookies may break the Service.
- We honor Global Privacy Control signals as {{gpc_behavior}}. <!-- required in some US states if selling/sharing -->
- Third-party opt-outs: {{third_party_opt_out_links}}.

## 5. Changes

We will update this policy when our use of cookies changes and, where required, ask for your consent again.

## 6. Contact

{{privacy_contact_email}}

## Definition of done (this document)

- [ ] Reviewed by qualified counsel; CAUTION notice removed only then.
- [ ] Cookie table matches what the product actually sets (verified after implementation, or marked `[TBD]`).
- [ ] Consent mechanism described matches the real implementation; consistent with PRIVACY_POLICY.md.
- [ ] No `{{placeholders}}` or guidance comments remain.
