# Chapter 6 — The Package Manager

> Book: *Beyond the Bases* · Part II — The Toolchain

Nebulara's packaging story is its most audacious claim: **one tool, many
ecosystems.** The package manager reaches into npm, pip, crates.io, and Go —
and treats them as registries you can pull from.

---

## Where it lives

The package manager is part of the **Node.js wrapper** (`bin/neb.js` +
`lib/package-manager.js` + `registry/`), not the C interpreter. To use it you
install the npm package:

```bash
npm install -g nebulara
neb init          # create neb.json
```

---

## Core commands

```bash
neb init                     # scaffold a neb.json project
neb install [pkg]            # install deps (or all in neb.json)
neb uninstall <pkg>          # remove a dependency
neb search <query>           # search registries
neb publish <file.nbpkg>     # publish a package
neb list                     # list installed packages
```

---

## Multi-registry: the distinguishing feature

You can install from several ecosystems by **prefixing** the package name:

```bash
neb install npm/left-pad          # from npm
neb install pip/requests          # from pip (Python)
neb install crates.io/serde       # from crates.io (Rust)
neb install go/github.com/...     # from Go
```

The prefix tells the resolver which registry to query. This is the
"universal" pitch in action — one dependency manager reaching across
languages.

Search is per-registry too:
```bash
neb search --registry npm foo
neb search --registry pip foo
```

---

## The project manifest: `neb.json`

`neb init` writes a `neb.json` with dependencies. It's the declarative record
of what your project needs, so `neb install` (with no args) can restore
everything for a fresh checkout.

---

## Publishing

`neb publish` uploads a `.nbpkg` to a configured registry (defaults to a
GitHub-hosted registry in the CODURRALABS organization). Publishing works when
you have the registry owner/repo/token configured (via environment variables).

---

## Honest scope note

Because this lives in the npm wrapper and talks to a network registry:

- It requires the `neb` npm tool and connectivity.
- It's separate from the self-contained C binaries (which do no package
  resolution).
- Registry features (owners, auth) are configured via environment variables.

Treat the C binaries as your guaranteed-offline core, and the package manager
as the connected "superpower" layer of the published distribution.

---

## The multi-language story

The same C core is packaged across ecosystems:
- **npm** — `nebulara` (Node wrapper + registry tooling + package manager).
- **pip** — a Python package that runs the same interpreter.
- **cargo** / **go modules** — wrappers (`src/main.rs`, `cmd/neb/main.go`).

Each wrapper builds (or locates) the C interpreter and forwards to it. So
"universal" has two meanings: your code runs on many runtimes, *and* the tool
is installable from many ecosystems.

---

## Summary

- Package manager lives in the npm wrapper (`neb`).
- `init/install/uninstall/search/publish/list`.
- Multi-registry via prefixes: `npm/`, `pip/`, `crates.io/`, `go/`.
- `neb.json` declares dependencies; `neb install` restores them.
- Separate from, and layered on top of, the offline C binaries.

**Next:** [Chapter 7 — Transpiling to JavaScript & Python](07-transpiler.md)
