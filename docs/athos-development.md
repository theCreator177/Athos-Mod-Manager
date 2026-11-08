# Athos development

This page describes the local Athos fork, its isolated runtime identity, and
the repeatable build workflow. Verification results belong in the build
report; commands below are procedures, not claims that they already passed.

## Source and configuration

The initial source revision is `cbe8654355d315943da54b6d3cd728ae39e13e3b`
from `theCreator177/Athos-Mod-Manager`. The C: checkout preserves that source
while avoiding build activity on the D: drive with recorded storage errors.

`fork.config.json` is the editable source for the app name, executable,
application ID, data-directory name, maintainer, version, updater policy,
protocol policy, and first-run automation defaults. Run `pnpm run
fork:configure` after changing it; generated files should follow this config.

Internal `@vortex/*` workspace package names remain compatible with inherited
extensions. They do not identify the installed executable or its data store.
The distributable package uses the configured Athos package name.

## Build

Use Node 24.22.2 and pnpm 11.10.0, as pinned by the repository. On Windows,
`Build Athos.cmd` bootstraps a project-local package manager, installs the
frozen dependency graph, runs the fork and repository checks, and creates an
unsigned package. It stops on a failing command.

The underlying root commands are:

```powershell
pnpm install --frozen-lockfile
pnpm run fork:test
pnpm run verify
pnpm run package:nosign
node scripts/verify-packaged-asar.mjs
```

Run these from the repository root, not `src/main`. The final package task
needs the deploy directory made by the root pipeline. Keep signing credentials
out of the local build and use `package:nosign`; the signed `package` task is
for configured release CI.

Do not build or run `verify` while a source development session is live:
production builds replace files used by its HMR process. The installed Vortex
process is a separate application and is not the Athos development session.

## Run the experimental executable

After successful packaging, launch `dist/win-unpacked/AthosModManager.exe`.
Keep the complete `win-unpacked` directory together; its executable depends
on the adjacent Electron resources. Installing the NSIS setup package is not
required to run this unpacked build.

The default Athos data directory is `%APPDATA%/AthosModManager`, rather than
`%APPDATA%/Vortex`. Startup identity is established before argument parsing
and database initialization. Athos starts without automatic updater activity
or protocol registration; uninstalling it preserves its app data.

The fresh Athos automation defaults disable automatic deployment, archive
installation, and enabling newly installed mods. Existing deliberate settings
are not rewritten each launch. A manual opt-in remains an explicit behavior
change rather than part of the initial setup.

## Bring over an existing library

Treat library import and game deployment as separate steps:

1. Preserve the existing Vortex metadata and original archives/staging.
2. Establish a stable, read-only source inventory and record enabled states,
   profiles, rules, archive identities, and missing-file gaps.
3. Import or reference only the intended Cyberpunk records into the isolated
   Athos store. Review destination paths and coverage before activation.
4. Keep deployment off until file conflicts, load order, and rollback have
   been reviewed. Avoid two managers writing the same live game concurrently.

Do not point two managers at one writable state database or assume an enabled
record proves its payload exists. The known KOZA empty-install issue remains
separate from creating and launching this manager.

## Beta-source integration

After the initial customized build and launch are verified, compare the
requested `Vortex-2.11.0-beta.1` source against this baseline. Establish its
revision/provenance first: a beta directory name does not establish that all
its files are newer. Preserve the working package and corresponding source,
port missing changes with tests, retain Athos identity/policies/notices, and
rebuild. Do not overlay a beta executable on the custom app.

## Ownership and distribution

See [the licensing inventory](fork-licensing.md) and the root `FORK-NOTICE.md`.
Keep inherited license notices, the dependency BOM and copyright attribution.
The local unsigned build is not a claim that third-party asset entitlements,
public distribution requirements, or a signing identity have been resolved.
