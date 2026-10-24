> **Status:** Draft · **Owner:** Antigravity · **Last updated:** 2026-10-24 · **Tier:** Standard · **Related:** docs/DISCOVERY.md, docs/.start-from-here/STATE.md

# TaskFlow – Product Requirements Document (PRD)

## 1. Vision & Problem
- **Vision:** Provide small‑to‑mid‑size teams a single web‑based platform to manage work items, collaborate via comments and attachments, and handle billing, replacing fragmented spreadsheets and chat threads.
- **Problem Statement:** Teams currently use a mix of spreadsheets, Slack, and email, resulting in data silos, missed deadlines, and poor visibility into work progress.
- **Target Outcome:** Centralised task management with real‑time collaboration, robust notifications, and seamless Stripe billing.

## 2. Success Metrics
| Metric | Target |
|---|---|
| Paying organisations (MVP) | 100 within 6 months |
| Weekly active users per seat | ≥ 60 % |
| Customer churn (first 3 months) | ≤ 5 % |
| Net promoter score (NPS) | ≥ 30 |

## 3. Personas & User Stories
| Persona | Role | Primary Needs | Example User Stories |
|---|---|---|---|
| **Org Owner** | Buyer, billing manager | Set up organisation, manage subscription, add admins | **US‑01:** As an Org Owner, I want to create an organisation and invite admins so I can control billing and team structure. |
| **Org Admin** | Member manager, workspace admin | Invite members, configure workspaces, view reports | **US‑02:** As an Org Admin, I can create workspaces and assign members to projects to organise work. |
| **Member** | End‑user | Create/read tasks, comment, attach files, receive notifications | **US‑03:** As a Member, I can create a task, assign it, and attach relevant files so the work is tracked centrally. |

## 4. MVP Feature Set (Must – F‑01…F‑07)
| Feature ID | Description | Acceptance Criteria (≥ 3) |
|---|---|---|
| **F‑01** | Sign‑up & Sign‑in (email + password, Google OAuth) | 1. Users can register with email/password.<br>2. Users can sign in via Google OAuth.<br>3. Invalid credentials show appropriate error message. |
| **F‑02** | Invite members to organisation | 1. Admin can send invitation email.<br>2. Invitee receives link to join.<br>3. Invited user appears in organisation member list after acceptance. |
| **F‑03** | Workspace, Project, Task CRUD | 1. Users can create, edit, delete workspaces, projects, tasks.<br>2. Task list updates in real‑time after changes.<br>3. Deleting a workspace cascades to its projects and tasks (with confirmation). |
| **F‑04** | Comments with @mentions | 1. Users can add comments to tasks.<br>2. Mentioning a user triggers an in‑app and email notification.<br>3. Mention syntax “@username” resolves to the correct member. |
| **F‑05** | File attachments (≤ 25 MB) | 1. Users can upload files to a task.<br>2. Uploaded file size limit enforced with error message.<br>3. Files are downloadable by authorised members. |
| **F‑06** | Notifications (in‑app & email) | 1. Assignment, mention, and due‑soon generate in‑app alerts.<br>2. Corresponding email sent with correct content.<br>3. Users can toggle email notifications in settings. |
| **F‑07** | Stripe‑hosted checkout & billing portal | 1. Owner can select seat‑based plan (monthly/annual) with 14‑day trial.<br>2. Checkout redirects to Stripe Checkout and returns to app.<br>3. Billing portal shows current subscription and allows upgrades/downgrades. |

## 5. Should‑Have Features (Optional for MVP)
| Feature ID | Description |
|---|---|
| **F‑08** | Activity log per task (view history of changes). |
| **F‑09** | Search across tasks, projects, and comments. |

## 6. Could‑Have Features (Future)
| Feature ID | Description |
|---|---|
| **F‑10** | Task templates for recurring task structures. |

## 7. Out‑of‑Scope (Won’t) for MVP
- Mobile native applications (iOS/Android).  
- Gantt chart visualisation.  
- Time tracking integration.  
- Public API for third‑party integrations.  
- Enterprise SSO/SAML.  
- Guest access (outside organisation).

## 8. User Journeys (Top 3)
| Journey ID | Description | Steps (high‑level) |
|---|---|---|
| **J‑01** | **Onboard a new organisation** | 1. Org Owner signs up → 2. Creates organisation → 3. Invites Admin → 4. Admin configures workspaces → 5. Members join via invite. |
| **J‑02** | **Create and manage a task** | 1. Member selects project → 2. Click “New Task” → 3. Fill title, description, assign, set due date → 4. Attach files → 5. Save → 6. Comment and @mention collaborators. |
| **J‑03** | **Billing & subscription management** | 1. Org Owner accesses billing portal → 2. Chooses plan and seat count → 3. Completes Stripe Checkout → 4. Receives confirmation email → 5. Can view/modify subscription via portal. |

## 9. Non‑Functional Requirements (Selected)
| NFR‑ID | Description | Target |
|---|---|---|
| **NFR‑01** | API latency (p95) | < 300 ms at 100 req/s |
| **NFR‑02** | Availability | 99.9 % monthly |
| **NFR‑03** | Accessibility | WCAG 2.2 AA |
| **NFR‑04** | Data retention | Org data exportable, deletion after 30 days |
| **NFR‑05** | Security | Email/Password + Google OAuth; optional TOTP MFA for owners/admins |

## 10. Assumptions & Open Questions
- **Assumption A‑01:** Users have modern desktop browsers; mobile browsers optional.  
- **Assumption A‑02:** Stripe handles PCI‑DSS compliance; we only store `customer_id`.  
- **Open Question Q‑01:** Preferred deployment region (single‑region vs EU‑region) – *already recorded as EU & US, single‑region acceptable*.

---  
*End of PRD*
