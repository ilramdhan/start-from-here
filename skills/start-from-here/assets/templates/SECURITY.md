# Security Policy

> **Status:** Draft · **Owner:** {{owner}} · **Last updated:** {{yyyy_mm_dd}} · **Tier:** {{tier}} · **Related:** [SECURITY_ARCHITECTURE](docs/technical/SECURITY_ARCHITECTURE.md), [OPERATIONS](docs/technical/OPERATIONS.md)

<!-- guidance: This is the VULNERABILITY DISCLOSURE POLICY that GitHub surfaces in the Security tab (it detects SECURITY.md in root,
docs/, or .github/). It is NOT the threat model — that lives in docs/technical/SECURITY_ARCHITECTURE.md.
RULES FOR THE AI: never invent a security contact, PGP key, bug bounty, or SLA the team cannot meet — use `[TBD: … — owner]` and ask.
Recommend GitHub Private Vulnerability Reporting (Settings → Code security → Private vulnerability reporting) for public GitHub repos.
Optionally also publish /.well-known/security.txt (RFC 9116) for web products. Keep wording honest: safe harbor language should be
reviewed by counsel (not legal advice); consider adopting a standard such as disclose.io terms.
Tier notes — Lite (public): sections 1–3 short. Standard: all. Enterprise: add CVSS-based severity SLAs, CVE/CNA process, bug bounty
link, customer notification process, and coordination with COMPLIANCE.md breach obligations. Remove guidance comments in output. -->

## Supported versions

<!-- guidance: For apps/SaaS with a single deployed version, state "Only the latest deployed version is supported." -->

| Version | Supported |
|---|---|
| {{latest_major_minor}}.x | :white_check_mark: |
| {{older_version}} | :x: |

## Reporting a vulnerability

**Please do not report security vulnerabilities through public issues, discussions, or pull requests.**

Report privately via one of:

1. **GitHub Private Vulnerability Reporting:** [Report a vulnerability](https://github.com/{{github_owner}}/{{repo_name}}/security/advisories/new) (preferred).
2. **Email:** {{security_contact_email}} {{pgp_key_reference_or_delete}}

Please include as much as you can:

- Type of issue (e.g. injection, XSS, broken access control, auth bypass) and affected component/version/URL.
- Step-by-step reproduction, proof of concept, and any configuration required.
- Impact: what an attacker could achieve.
- Your name/handle for credit (optional).

## Our response process

| Step | Target time |
|---|---|
| Acknowledge receipt | within {{ack_sla}} <!-- e.g. 3 business days --> |
| Initial assessment and severity (CVSS) | within {{triage_sla}} <!-- e.g. 7 days --> |
| Status updates | at least every {{update_cadence}} |
| Fix target — Critical / High | {{critical_high_fix_target}} <!-- e.g. 30 days --> |
| Fix target — Medium / Low | {{medium_low_fix_target}} <!-- e.g. 90 days / next release --> |

These are goals, not guarantees; we will keep you informed if timelines change.

## Disclosure policy

We follow **coordinated disclosure**: we will work with you to confirm and fix the issue, then publish a security advisory (GitHub Security Advisory and, where applicable, a CVE) and credit you unless you prefer to remain anonymous. Please give us {{disclosure_window}} <!-- e.g. 90 days --> from your report, or until a fix is released (whichever is sooner), before public disclosure. Fixes are noted under **Security** in the [CHANGELOG](CHANGELOG.md).

## Safe harbor

<!-- guidance: Counsel should review. Delete if the organization cannot commit to this. -->

We consider security research conducted in good faith and consistent with this policy to be authorized, and we will not pursue legal action against you for it, provided you:

- Make a good-faith effort to avoid privacy violations, data destruction, and service interruption.
- Only access data needed to demonstrate the issue, do not exfiltrate or retain it, and test only accounts you own or have permission to use.
- Do not use social engineering, physical attacks, or denial-of-service testing.
- Report promptly and keep details confidential until disclosure.

If a third party takes legal action against you for activities that followed this policy, we will make it known that your actions were authorized by us.

## Out of scope

- {{out_of_scope_item}} <!-- e.g. reports from automated scanners without a demonstrated impact; missing best-practice headers without exploit; third-party services we do not control; volumetric DoS. -->

## Bug bounty

{{bug_bounty_statement}} <!-- e.g. "We do not currently offer a paid bug bounty." — never imply rewards that do not exist. -->

## Definition of done (this document)

- [ ] Reporting channel exists and is monitored (Private Vulnerability Reporting enabled and/or real email).
- [ ] SLAs agreed by the owner; supported-versions table matches release policy in GIT_WORKFLOW.md.
- [ ] Safe harbor reviewed (or removed); no invented bounty or PGP key.
- [ ] No `{{placeholders}}` or guidance comments remain.
