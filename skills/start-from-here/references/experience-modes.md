# Experience modes

Adapt explanation depth, question style, and defaults to the user. The documents themselves stay equally rigorous in every mode; only the conversation changes (plus a short glossary section in docs for beginners, if they want one).

## Detection

Ask in Round 0 ("How familiar are you with software projects?"). Also watch for cues and adjust silently, then confirm once ("I'll keep explanations short — tell me if you want more detail.").

| Cue | Suggests |
|---|---|
| "I have an idea but I'm not technical", "what is a database?", no stack opinion, asks what words mean | Beginner |
| Has built side projects, names one framework, unsure about hosting/security/testing | Intermediate |
| Uses precise terms (p95, RPO, OIDC, multi-tenant, IaC), states constraints, pushes back on defaults | Expert |
| Mixed: deep in one area, new in another (e.g. designer, data scientist) | Intermediate overall; beginner explanations only in the unfamiliar domains |

Users can switch at any time: "explain more", "be brief", "I'm a beginner", "skip explanations".

## Behavior by mode

| Aspect | Beginner | Intermediate | Expert |
|---|---|---|---|
| Question format | Multiple choice (a/b/c) + "not sure" option; one concept per question | Short open questions with defaults | Dense; may merge related questions on one line |
| Defaults | Always "Recommended: …" with one-line reason | "Recommended: …" | "Default: …" |
| Jargon | Explain on first use in one plain sentence | Explain uncommon terms only | No explanations unless asked |
| Trade-offs | One sentence, what it means for them | 1–2 lines | Full trade-offs, alternatives, references |
| Round size | 4–5 questions | 5–6 | Up to 7 (or a compact list) |
| Stack recommendation | One recommended option clearly highlighted; others shown briefly | 2–3 options table | 2–3 options + scoring matrix |
| Risk callouts | Plain warnings ("this could lose your users' data if…") | Normal | Terse, ID'd (R-xx) |
| Review | Summaries in plain words; "what this means for you" | Summary + open items | Diff-style list of decisions and TBDs |
| Readiness checklist | Explain each item | Normal | Compact |

## How to explain (beginner)

1. One sentence, plain words, no other jargon in the explanation.
2. One everyday analogy only if it helps.
3. One sentence on why it matters for their project.
4. Offer the recommended choice.

Example:

> **Authentication** means how people prove who they are when they sign in — like showing an ID at a door. It matters because it protects your users' data. **Recommended:** use a ready-made sign-in service so you don't have to build and secure passwords yourself.

Never be condescending. Never assume a beginner cannot make decisions; make decisions easy.

## Expert mode notes

- Accept shorthand answers ("Postgres, OIDC via company IdP, 99.9, RPO 1h").
- Do not over-confirm; reflect back in 2–3 lines.
- Surface hard constraints and conflicts quickly (e.g. "99.99% with single-region managed DB conflicts; options: …").
- Still apply all hard rules (no invention, no secrets, gates).

## Glossary (plain language)

Use these explanations for beginners. Keep them one or two sentences.

| Term | Plain explanation |
|---|---|
| Acceptance criteria | A checklist that says exactly what must happen for a feature to count as working. |
| ADR (Architecture Decision Record) | A short note recording an important technical choice, why it was made, and what else was considered. |
| API | A defined way for programs to talk to each other, like a menu of requests one program can make to another. |
| Authentication (authN) | Checking who someone is, for example signing in with email and password. |
| Authorization (authZ) | Checking what a signed-in person is allowed to do, for example only admins can delete users. |
| Backend | The part of the software that runs on a server, stores data, and enforces rules. |
| Backup / restore | Saving copies of your data so you can bring it back after a mistake or failure. |
| CDN | A network of servers around the world that delivers your files faster to users near them. |
| CI/CD | Automation that checks your code every time it changes (CI) and ships it to users (CD). |
| CLI | A program you use by typing commands in a terminal instead of clicking. |
| Cloud hosting | Renting computers from a provider to run your software instead of owning servers. |
| Container | A packaged bundle of your app and everything it needs so it runs the same everywhere. |
| Cookie | A small piece of data a website stores in your browser, e.g. to keep you signed in. |
| Database | Organized storage for your app's information, like a set of connected spreadsheets. |
| Dependency | Someone else's code that your project uses, such as a library. |
| Deploy | Putting a new version of your software where users can use it. |
| Environment (dev/staging/prod) | Separate copies of the app: one for building, one for testing, one for real users. |
| Encryption | Scrambling data so only people with the right key can read it. |
| ERD | A diagram showing what kinds of data you store and how they connect. |
| Frontend | The part users see and interact with: screens, buttons, forms. |
| Framework | A ready-made foundation for building a type of app so you don't start from zero. |
| Git / repository | Git tracks every change to your code; a repository is the folder of code plus that history. |
| Latency | How long a user waits for a response after doing something. |
| License (software) | The legal rules for how others may use, copy, and change your code. |
| Linter / formatter | Tools that automatically check code for mistakes and make its style consistent. |
| Managed service | A service where the provider runs, updates, and backs up the technology for you. |
| Migration (database) | A controlled, recorded change to the structure of your database. |
| MFA | Multi-factor authentication: signing in with something extra, like a code on your phone. |
| Monolith | One application that contains all parts of the system; simplest to start with. |
| Microservices | Splitting a system into many small apps that talk to each other; powerful but complex. |
| MVP | Minimum Viable Product: the smallest version that is genuinely useful to real users. |
| NFR (non-functional requirement) | A requirement about how well the system works — speed, uptime, security — not what it does. |
| Observability / monitoring | Ways to see what your running system is doing and get alerted when something breaks. |
| ORM | A library that lets code work with database records as normal objects. |
| Personal data (PII) | Any information that identifies a person, like a name, email, or IP address. |
| PRD | Product Requirements Document: what we're building, for whom, and why. |
| Rate limiting | Restricting how often someone can make requests, to stop abuse. |
| Rollback | Going back to the previous working version after a bad release. |
| RPO / RTO | How much data you can afford to lose (RPO) and how fast you must be back up (RTO) after a disaster. |
| SaaS | Software as a Service: software people use online, usually by subscription. |
| Secret (credential) | A password, key, or token that grants access; must never be put in code or documents. |
| SemVer | Version numbers like 1.4.2 where each part signals how big a change is. |
| SLA / SLO | SLA: a promise to customers about uptime; SLO: an internal target you measure against. |
| SSO | Single sign-on: using one company account to sign into many apps. |
| Stack (tech stack) | The set of languages, frameworks, and services your project is built with. |
| Tenant / multi-tenant | A tenant is one customer organization; multi-tenant means many share one system with their data kept separate. |
| Threat model | A structured list of how someone could attack or misuse the system and how you'll prevent it. |
| TRD | Technical Requirements Document: how the product's needs translate into technical requirements. |
| Unit / integration / end-to-end tests | Tests of a small piece, of pieces working together, and of a whole user journey. |
| WCAG | The international guidelines for making digital products usable by people with disabilities. |
| Webhook | A message one system sends to another automatically when something happens. |
