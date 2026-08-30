# Advanced 08 — Package Manager & Toolchain

Nebulara ships a full developer toolchain and a **package manager** concept so
you can install, publish, and search Nebulara packages.

---

## The toolchain at a glance

| Tool | Role |
|------|------|
| `nebulara` | Interpreter — run `.nbs` files |
| `neb-cli` | CLI: `run`, `build` (bytecode), `repl`, `highlight`, `version`, `help` |
| `neb-pipeline` | Transpiler to JS/Python + `--check` + `--ir` |
| `neb-knowledge` | Knowledge graph (AI-native) |
| `neb-ffi` | FFI demo — call C functions |
| `neb-codegen` | Native x86/x64 code generation |

---

## What the package manager does

The npm-wrapper CLI (`bin/neb.js` via `neb`) provides package commands:

```bash
neb init                     # create neb.json project
neb install [pkg]            # install deps (or all from neb.json)
neb uninstall <pkg>          # remove a dep
neb search <query>           # search registries
neb publish <file.nbpkg>     # publish a package
neb list                     # list installed
```

**Multi-registry** is the distinctive feature — Nebulara can pull packages from
several ecosystems at once via prefixes:

```bash
neb install npm/left-pad        # npm
neb install pip/requests        # pip (Python)
neb install crates.io/serde     # crates.io (Rust)
neb install go/github.com/...   # Go
neb search --registry npm foo
```

This is the "universal" part of the pitch: one tool reaching across package
ecosystems.

---

## How it works (concept)

- `neb init` writes a `neb.json` manifest with dependencies.
- `neb install npm/<pkg>` resolves the registry, fetches, and records it.
- `neb publish` uploads a `.nbpkg` to a configured registry (defaults to a
  GitHub-based registry in the CODURRALABS org).

The registry resolution lives in `lib/package-manager.js` and registry defaults
in `registry/`. Environment variables control the owners/repos/tokens.

---

## Honest scope note

The package manager lives in the **Node.js wrapper** (`bin/neb.js` +
`lib/`), not the C interpreter. So real-world usage requires the npm package
(`npm install -g nebulara`) wired to the network and a registry. The C
binaries themselves are self-contained and don't do package resolution. Treat
the package manager as part of the published `neb` distribution.

---

## Building from source (the eternal toolchain)

Everything compiles from C with gcc:

```bash
gcc -static -O2 Compiler/nbs-bootstrap.c -o nebulara -lm
```

The `Makefile` and `build.bat` orchestrate building all six binaries. The Rust
`src/main.rs` and Go `cmd/neb/main.go` wrappers build the C interpreter on
demand and forward to it — demonstrating the multi-language packaging story
(npm, pip, cargo, go all package the same C core).
