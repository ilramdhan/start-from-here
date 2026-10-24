# License templates — instructions for the AI

> **Status:** Template guidance (not copied into the user's project) · **Related:** `references/legal-compliance-primer.md`, `references/document-catalog.md`

<!-- guidance: This folder is NOT mirrored into the output. It tells the AI how to produce the project's root `LICENSE` file. -->

**Not legal advice.** License choice has legal and business consequences. Recommend, explain trade-offs, and let the user decide; suggest counsel for commercial, dual-licensing, or patent-sensitive projects.

## Rules

1. **Select** the license with the user using the license chooser in `references/legal-compliance-primer.md` (and <https://choosealicense.com/>). Record the decision in `docs/DISCOVERY.md` (Standard/Enterprise: also an ADR).
2. **Insert the full, unmodified official text** into `<project>/LICENSE` (no extension needed; `LICENSE.txt`/`LICENSE.md` also detected by GitHub). Never paraphrase, summarize, abbreviate, "improve", or reproduce a license from memory. A single changed word can change legal meaning and breaks automated license detection.
3. **Fill only the designated fields** — typically year and copyright holder (e.g. MIT `{{year}}`/`{{copyright_holder}}`, BSD `<year> <owner>`). Apache-2.0, GPL, AGPL, LGPL, and MPL texts are used **as-is with no edits**; their copyright/notice lines go in source-file headers or a `NOTICE` file per each license's own "how to apply" appendix.
4. **Obtain text** from an official source, in this order:
   - A bundled file in this folder (currently only `MIT.txt`, verified against GitHub's license API / SPDX).
   - Fetch the plain-text URL below if you can access the web.
   - Otherwise tell the user to download it from the URL and paste it, or to create it via GitHub's "Add file → Create new file → `LICENSE` → Choose a license template". Create `LICENSE` containing only the line `[TBD: insert official <SPDX-ID> text — owner]`, add the same item to `docs/README.md`, and never write a reconstructed text.
5. **Declare the SPDX identifier** consistently in the package manifest (`"license": "MIT"` in package.json, `license = "MIT"` in Cargo.toml/pyproject.toml, `<licenses>` in pom.xml, etc.) and in the README License section.
6. **Year/holder:** use the current year (or the first-publication year) and the legal name of the copyright holder (person or entity) the user confirms. Never guess the holder.
7. **Proprietary / closed source:** use `PROPRIETARY.txt` only as a minimal "All rights reserved" notice (fill year and holder; replace `{{licensing_contact}}` with the contact the user gives, or delete the `Contact:` line if none); real commercial terms (EULA, SLA) must be drafted by counsel. "No LICENSE file" in a public repo also means all rights reserved by default, but stating it explicitly avoids confusion.

## Official text sources

| License (SPDX ID) | Plain text (fetch) | Reference pages |
|---|---|---|
| MIT (`MIT`) | bundled: [`MIT.txt`](MIT.txt) · <https://raw.githubusercontent.com/spdx/license-list-data/main/text/MIT.txt> | <https://choosealicense.com/licenses/mit/> · <https://spdx.org/licenses/MIT.html> |
| Apache 2.0 (`Apache-2.0`) | <https://www.apache.org/licenses/LICENSE-2.0.txt> | <https://choosealicense.com/licenses/apache-2.0/> · <https://spdx.org/licenses/Apache-2.0.html> |
| GPL 3.0 (`GPL-3.0-only` / `GPL-3.0-or-later`) | <https://www.gnu.org/licenses/gpl-3.0.txt> | <https://choosealicense.com/licenses/gpl-3.0/> · <https://spdx.org/licenses/GPL-3.0-or-later.html> |
| AGPL 3.0 (`AGPL-3.0-only` / `AGPL-3.0-or-later`) | <https://www.gnu.org/licenses/agpl-3.0.txt> | <https://choosealicense.com/licenses/agpl-3.0/> · <https://spdx.org/licenses/AGPL-3.0-or-later.html> |
| LGPL 3.0 (`LGPL-3.0-only` / `LGPL-3.0-or-later`) | <https://www.gnu.org/licenses/lgpl-3.0.txt> (must be accompanied by the GPL-3.0 text) | <https://choosealicense.com/licenses/lgpl-3.0/> |
| MPL 2.0 (`MPL-2.0`) | <https://www.mozilla.org/media/MPL/2.0/index.txt> | <https://choosealicense.com/licenses/mpl-2.0/> · <https://spdx.org/licenses/MPL-2.0.html> |
| BSD 3-Clause (`BSD-3-Clause`) | <https://raw.githubusercontent.com/spdx/license-list-data/main/text/BSD-3-Clause.txt> | <https://choosealicense.com/licenses/bsd-3-clause/> · <https://spdx.org/licenses/BSD-3-Clause.html> |
| Unlicense (`Unlicense`) | <https://raw.githubusercontent.com/spdx/license-list-data/main/text/Unlicense.txt> | <https://choosealicense.com/licenses/unlicense/> |
| Proprietary | bundled: [`PROPRIETARY.txt`](PROPRIETARY.txt) (notice only) | counsel-drafted EULA/terms |
| Any other | GitHub API: `https://api.github.com/licenses/<key>` (field `body`) · SPDX list: <https://spdx.org/licenses/> | <https://choosealicense.com/appendix/> |

GPL/AGPL/LGPL "only" vs "or-later": the license text is identical; the choice is expressed in source headers/README and the SPDX ID. Ask the user.

## Definition of done (LICENSE)

- [ ] License chosen by the user and recorded (DISCOVERY.md / ADR).
- [ ] `LICENSE` contains the exact official text from a source above; only designated fields filled.
- [ ] SPDX ID consistent across LICENSE, package manifest(s), README, and CONTRIBUTING (inbound=outbound / DCO / CLA).
- [ ] Third-party notices (`NOTICE`, attributions) handled if required by dependencies (e.g. Apache-2.0 NOTICE files).
