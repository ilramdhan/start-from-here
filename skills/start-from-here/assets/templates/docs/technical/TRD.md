# Technical Requirements — {{product_name}}

> **Status:** Draft · **Owner:** {{tech_owner}} · **Last updated:** {{last_updated}} · **Tier:** {{tier}} · **Related:** [PRD](../product/PRD.md) · [ARCHITECTURE](ARCHITECTURE.md) · [SECURITY_ARCHITECTURE](SECURITY_ARCHITECTURE.md) · [TESTING](TESTING.md)

<!-- guidance: The TRD turns PRD features into explicit technical requirements so the build never relies on guesses.
Every NFR MUST be measurable: metric + target + measurement method + scope (e.g. "p95 API latency ≤ 300 ms at 50 RPS,
measured by load test in staging"). If the user gave no number, write a > **PROPOSAL:** with a sensible default for
the app type and mark it for approval — never present a proposed number as agreed. Do not claim compliance.
BEFORE writing, read references/architecture-guide.md (§6 NFR→tactic mapping, §7 capacity worksheet) — the capacity
estimate (§9) feeds ARCHITECTURE scaling decisions and DATABASE §16 growth. Keep ALL H2 headings; a section that does
not apply keeps its heading and one line `N/A — reason`. -->

<!-- guidance: Tier notes —
Lite: usually merged into ARCHITECTURE.md (this doc is S/E). If generated: §1 platforms, §2 mapping for Must features, §3 with 4–6 NFRs, §5 integrations, §9 short (users → peak RPS → storage/yr).
Standard: all sections.
Enterprise: every NFR has an owner and verification test ID; add compliance control mapping, capacity model, and formal traceability matrix (§8) reviewed at each release. -->

## 1. Technical context
| Item | Value |
| --- | --- |
| Platforms / targets | {{e.g. evergreen browsers, iOS 17+, Android 10+, macOS/Linux/Windows CLI, Node ≥ 20 library consumers}} |
| Deployment model | {{e.g. managed cloud, self-hosted, app stores, package registry, on-device only}} |
| Hosting / region | {{provider_region_or_[TBD]}} |
| Expected scale (launch → 12 mo) | {{users, requests/s, data volume}} |
| Team constraints | {{skills, size, on-call capacity}} |

## 2. Functional → technical mapping
<!-- guidance: Minimum content — one row per PRD feature (every Must and Should; Could may be grouped). "Approach" is
1–2 sentences naming the mechanism (e.g. "transactional write + outbox event → worker sends email"), not code. Every
row names ≥ 1 component (ARCHITECTURE §3), the interface (OP-xx or "internal"), and the entities (DATABASE §3). A row
with no data or interface writes `none` deliberately. -->
| Feature | Technical approach | Components | Interfaces | Data | Key NFRs | Notes / open |
| --- | --- | --- | --- | --- | --- | --- |
| F-01 | {{e.g. server-validated form → service → transactional write; optimistic UI}} | {{component}} | {{endpoint_command_method}} | {{entity}} | NFR-01 | {{Q-xx}} |

## 3. Non-functional requirements
<!-- guidance: Minimum content — every category below is either an NFR row with metric + target + measurement
method + condition (load, device, network) + priority + owner, or a row `N/A — reason`. Performance needs at least one
row per user-facing surface (API latency, page/screen load, background job lag). Availability, RPO/RTO, and security
targets are required for any hosted product. Examples are illustrative only, not defaults to copy. -->
| ID | Category | Requirement | Target | Measurement method | Priority | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| NFR-01 | Performance | {{e.g. API p95 latency / LCP on mid-tier mobile / CLI cold start / library op throughput}} | {{e.g. ≤ 300 ms / ≤ 2.5 s / ≤ 200 ms / ≥ 10k ops/s}} | {{load test, RUM, benchmark}} | Must | {{owner}} |
| NFR-02 | Availability | {{monthly availability of user-facing API}} | {{e.g. 99.9%}} | {{SLO in OPERATIONS.md}} | {{prio}} | {{owner}} |
| NFR-03 | Scalability | {{headroom}} | {{e.g. 10× launch load without redesign}} | {{load test}} | {{prio}} | {{owner}} |
| NFR-04 | Security | {{e.g. ASVS level, MFA for admins, TLS 1.2+}} | {{target}} | {{review, scan}} | {{prio}} | {{owner}} |
| NFR-05 | Privacy | {{data minimization, retention, DSR turnaround}} | {{e.g. export/delete within 30 days}} | {{process audit}} | {{prio}} | {{owner}} |
| NFR-06 | Accessibility | {{UI conformance}} | {{WCAG 2.2 AA}} | {{automated + manual audit}} | {{prio}} | {{owner}} |
| NFR-07 | Internationalization | {{locales, formats, RTL}} | {{target}} | {{pseudo-locale test}} | {{prio}} | {{owner}} |
| NFR-08 | Observability | {{logs/metrics/traces coverage}} | {{e.g. 100% requests traced with correlation ID}} | {{review}} | {{prio}} | {{owner}} |
| NFR-09 | Reliability / recovery | {{RPO / RTO}} | {{e.g. RPO ≤ 24 h, RTO ≤ 4 h}} | {{restore drill}} | {{prio}} | {{owner}} |
| NFR-10 | Maintainability | {{e.g. coverage of domain logic, build time, dependency freshness}} | {{target}} | {{CI report}} | {{prio}} | {{owner}} |
| NFR-11 | Portability / compatibility | {{OS, browser, runtime, API backward compatibility}} | {{target}} | {{test matrix}} | {{prio}} | {{owner}} |
| NFR-12 | Compliance | {{regime-driven requirement}} | {{target}} | {{evidence}} | {{prio}} | {{owner}} |
| NFR-13 | Cost | {{monthly infra budget}} | {{e.g. ≤ $X at launch scale}} | {{billing alert}} | {{prio}} | {{owner}} |

## 4. Constraints
| Type | Constraint | Source | Impact |
| --- | --- | --- | --- |
| {{technical / business / regulatory / organizational}} | {{e.g. must run on customer's on-prem servers; must use existing SSO; offline-first}} | {{DISCOVERY ref}} | {{impact}} |

## 5. External integrations
<!-- guidance: Minimum content — one row per external system shown in the ARCHITECTURE context diagram. Each has a
concrete failure mode AND fallback (e.g. "email provider 5xx → queue + retry 24 h; in-app notice still shown"),
timeout, and data shared with classification. Credential owner = person/team that controls the account — NEVER the
credential itself. Verify limits from provider docs; otherwise [TBD]. -->
| Service | Purpose | Interface | Limits / quotas | Failure mode & fallback | Data shared | Credential owner | Sandbox? |
| --- | --- | --- | --- | --- | --- | --- | --- |
| {{e.g. payment provider, email, maps, LLM API, app store, OAuth IdP}} | {{purpose}} | {{REST/webhook/SDK; timeout}} | {{rate limits}} | {{retry w/ backoff; queue; degrade feature}} | {{fields + classification}} | {{owner}} | {{yes_no}} |

## 6. Data requirements
- **Data categories:** {{e.g. account data (personal), content (user-owned), telemetry (pseudonymous)}} — details in [DATABASE](DATABASE.md)
- **Volume & growth:** {{estimate — see §9}}
- **Residency:** {{region_requirements}}
- **Retention:** {{summary}} · **Consistency needs:** {{strong vs eventual per area}}
- **Import / export / migration from existing systems:** {{plan}}

## 7. Technical risks and decisions needed
| ID | Item | Type | Options | Needs ADR? | Owner |
| --- | --- | --- | --- | --- | --- |
| R-{{nn}} / Q-{{nn}} | {{item}} | {{risk_or_decision}} | {{options}} | {{yes_no}} | {{owner}} |

## 8. Traceability
| Feature / NFR | Architecture component | API / interface | Data entity | Security control | Test (TESTING.md) |
| --- | --- | --- | --- | --- | --- |
| F-01 | {{component}} | {{interface}} | {{entity}} | {{control}} | {{test_id}} |
| NFR-01 | {{component}} | — | — | — | {{test_id}} |

## 9. Capacity estimate
<!-- guidance: Minimum content — the worksheet from architecture-guide §7 with VISIBLE arithmetic so anyone can redo it.
Unknown inputs become > **ASSUMPTION:** (A-xx) with a stated value, never silent guesses. The design target (peak ×
headroom) becomes the NFR-03 load-test target. On-device / CLI / library: replace rows with device storage per user,
sync payload, binary size, or ops/s the library must sustain. -->
| Step | Formula | Value (launch) | Value (12 mo) |
| --- | --- | --- | --- |
| Registered users | input (DISCOVERY) | {{n}} | {{n}} |
| Daily active users | registered × DAU ratio | {{n}} | {{n}} |
| Reads / writes per DAU per day | from journeys | {{r / w}} | {{r / w}} |
| Average RPS (read / write) | DAU × actions ÷ 86,400 | {{n}} | {{n}} |
| Peak RPS | average × peak factor ({{3–10×}}) | {{n}} | {{n}} |
| Design target | peak × headroom ({{2–3×}}) → NFR-03 | {{n}} | {{n}} |
| New records / day (main entities) | writes × rows per write | {{n}} | {{n}} |
| Primary DB storage / year | rows × avg row size (incl. indexes) | {{GB}} | {{GB}} |
| Logs / audit storage / year | events × size, after retention | {{GB}} | {{GB}} |
| Object storage / year | uploads/day × avg size × 365 | {{GB}} | {{GB}} |
| Peak egress | peak RPS × avg response size | {{MB/s}} | {{MB/s}} |
| Background jobs / day | events × fan-out (check provider limits) | {{n}} | {{n}} |
| Concurrency | peak RPS × p95 latency (Little's law) → pool sizes | {{n}} | {{n}} |
| Monthly cost (order of magnitude) | from hosting pricing — [TBD] unless verified | {{amount}} | {{amount}} |

**Conclusion:** {{e.g. single DB primary + replica fits ≥ 10× the 12-month load; revisit partitioning at 200 M rows}}

## Completeness self-check
<!-- guidance: Tick every box before presenting this doc. Fix gaps instead of reporting them; anything not fixable
becomes [TBD] + Q-xx. Keep this checklist in the output, ticked. -->
- [ ] Every PRD Must and Should feature has a §2 row with component, interface, and entities.
- [ ] Every NFR category in §3 is a measurable row (metric, target, condition, method, priority, owner) or `N/A — reason`.
- [ ] Every proposed number is a PROPOSAL or ASSUMPTION with an A-xx/D-xx reference; no invented baselines.
- [ ] Every external system from the ARCHITECTURE context diagram is in §5 with timeout, failure mode, fallback, and credential owner.
- [ ] §9 capacity worksheet is filled with visible arithmetic; its design target equals NFR-03; DATABASE §16 growth uses the same numbers.
- [ ] Constraints and data requirements trace to DISCOVERY.
- [ ] §8 traceability covers every F-xx and NFR-xx with a test ID or `[TBD]`.
- [ ] No `{{placeholders}}` or guidance comments remain.

## Definition of done
- [ ] Every PRD Must/Should feature has a technical mapping row.
- [ ] Every NFR has metric, target, method, priority, and owner; unconfirmed targets are PROPOSALs.
- [ ] Integrations list limits, failure modes, and credential owners (names only, no secrets).
- [ ] Constraints and data requirements trace to DISCOVERY.
- [ ] Traceability table links each F-xx/NFR-xx to architecture, data, and tests.
- [ ] Capacity estimate exists and the completeness self-check is fully ticked.
