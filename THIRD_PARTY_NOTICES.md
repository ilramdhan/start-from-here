# Third-party notices

start-from-here is MIT-licensed (see [LICENSE](LICENSE)). It includes material adapted from the third-party components listed below. Each keeps its original copyright and license.

## cloudflare/security-audit-skill

- **Upstream:** https://github.com/cloudflare/security-audit-skill
- **Commit:** c1c8a8c1471069fb0e188eeaff69b8e8db6564a8
- **License:** MIT, Copyright (c) 2025-2026 Cloudflare, Inc.
- **What was adapted:** the attack-class taxonomy (`ATTACK-CLASSES.md` and the ten domain companion files) and the evidence discipline (a finding needs a lower-trust principal, a crossed boundary and a concrete result; severity never exceeds impact; checklist gaps and defense-in-depth advice are not vulnerabilities). The material was rewritten in our own words as design-time threat-modeling questions and candidate controls mapped to the SECURITY_ARCHITECTURE template. The upstream audit workflow (sandboxing, hunters, validators, findings reports) was not copied.
- **Where:** [`skills/start-from-here/references/security-threat-catalog.md`](skills/start-from-here/references/security-threat-catalog.md). That file also carries this license notice, so it stays attached when the file ships on its own in zips and prompt bundles.
- **Endorsement:** none. Cloudflare does not endorse start-from-here.

```text
MIT License

Copyright (c) 2025-2026 Cloudflare, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
