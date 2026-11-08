# Athos fork ownership and licensing

This document records which Athos contributions Tony maintains and which
inherited licenses continue to apply. It separates local experimentation from
the additional review needed before distributing a release.

## Ownership boundary

Athos Mod Manager is Tony's independently maintained Vortex fork. New Athos
code, branding and configuration contributions are attributed to Tony for 2026,
to the extent copyright applies. Inherited source and community contributions
retain their existing authors and licenses; dependencies, artwork and mods
retain their own owners. Rebranding the manager is not an assignment of those
rights.

The pinned source is
https://github.com/theCreator177/Athos-Mod-Manager.git at
`cbe8654355d315943da54b6d3cd728ae39e13e3b`. The original Vortex project is
https://github.com/Nexus-Mods/Vortex. The initial Athos configuration and
branding changes are dated 2026-11-08 in `FORK-NOTICE.md`.

## Code license and notices

Athos code modifications use `GPL-3.0-only`, matching the main application's
explicit license identifier. `LICENSE.md` retains the GPLv3 text unchanged,
including the Free Software Foundation's notice on the license document.
That notice is distinct from copyright in the application code.

Keep the original source-file, extension-package and third-party notices.
Several bundled extensions have named community authors in addition to Black
Tree Gaming Ltd.; changing every author field to the fork maintainer would
misstate that provenance. Internal compatibility package names and APIs may
retain Vortex identifiers without implying an official Nexus Mods release.

The About page shows the inherited Black Tree Gaming attribution, the Athos
maintainer and new-contribution notice, and the existing GPL and dependency
license views. Fork branding does not create a Nexus Mods signing identity,
service entitlement, API permission or trademark license.

GPLv3 permits private modifications without requiring public publication.
When modified copies are conveyed, the applicable conditions include retaining
notices, identifying modifications and their date, GPL licensing of the covered
work, and a compliant corresponding-source delivery route. See the
[GNU GPLv3](https://www.gnu.org/licenses/gpl) and the
[GNU FAQ on private modifications](https://www.gnu.org/licenses/gpl-faq.en.html#GPLRequireSourcePostedPublic).

## Bundled asset review

`assets/images/license_nucleo.txt` separately identifies Nucleo icons as
copyright Amber Creative Lab Ltd. and imposes asset-license restrictions.
Tony's Nucleo entitlement is **UNCONFIRMED**. Preserve that notice and review
the affected assets or replace them with independently owned or compatible
permissive assets before distributing Athos. The presence of GPL-covered code
does not establish rights to every bundled asset.

This local build has not completed a full distribution-license audit. The same
distinction applies to imported game mods: managing a mod is not ownership of
that mod or permission to redistribute it.

## Distribution checklist

- Retain `LICENSE.md`, `FORK-NOTICE.md` and upstream contribution notices in the
  source and packaged application.
- Ship the complete corresponding source matching the executable, including
  the required build scripts, configuration and modification notices, using a
  route permitted by the GPL.
- Preserve dependency and bundled native-tool notices. Generate and inspect
  the production software bill of materials; investigate missing or unresolved
  license metadata instead of relabeling dependencies.
- Resolve the separate Nucleo asset entitlement or replace the affected
  artwork. Review any other non-code or external-runtime asset licenses.
- Keep Athos's independent app identity and unsigned-build status clear.
  Signing requires an appropriate certificate; publisher display text is not
  proof of a signing identity.
- Verify the packaged GPL text matches the source and the fork notice and
  dependency-license UI remain accessible.

## Key files

- `FORK-NOTICE.md` — maintainer, contribution notice and pinned provenance.
- `LICENSE.md` — inherited GPLv3 text, retained unchanged.
- `fork.config.json` — configurable fork identity and behavior defaults.
- `src/renderer/src/extensions/about_dialog/views/AboutPage.tsx` — application
  attribution and GPL/dependency-license UI.
- `src/main/copy-assets.mjs` — packaged GPL and fork-notice copying.
- `src/main/sbom.mjs` — production CycloneDX software bill of materials.
- `assets/images/license_nucleo.txt` — separate icon-license restrictions.
- [Athos development](athos-development.md) — local build, run and experiment
  workflow.
