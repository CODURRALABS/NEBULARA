# Nebulara Toolchain Manual

*Reference for the six tools, bytecode, transpiling, FFI, natives, and
building from source.*

---

## 1. The six executables

| Tool | Binary | Role |
|------|--------|------|
| Interpreter | `nebulara` | runs `.nbs` directly |
| CLI | `neb-cli` | `run/build/repl/highlight/version/help` |
| Pipeline | `neb-pipeline` | transpile to JS/Python; `--check`; `--ir` |
| Knowledge | `neb-knowledge` | build a knowledge graph |
| Semantic | `neb-semantic` | static type/scope/arity checks |
| Codegen | `neb-codegen` | native x86/x64 code generation |

Additional engine components: `neb-ffi` (FFI subsystem), `neb-ir`
(intermediate representation), `neb-codegen` (native emitters).

---

## 2. CLI (`neb-cli`) commands

```bash
neb-cli run <file.nbs>        # run a source file
neb-cli build <file.nbs>      # compile to bytecode (.nbsc)
neb-cli repl                  # interactive shell
neb-cli highlight <file.nbs>  # syntax-highlighted print
neb-cli version
neb-cli help
```

**REPL** is your best verification tool — probe features in seconds:
```
> TYPEOF("hi")
string
> 2 + 2
4
```

---

## 3. Bytecode (`.nbsc`)

- `neb-cli build file.nbs` → `file.nbsc`, the interpreter's compiled format.
- It is **not human-readable text** and **cannot be decompiled to source** in
  the shipped build `[planned]` — regard it as opaque bytecode.
- The VM executes it via an opcode switch on a value stack (see
  [VM guide](../advanced/02-vm.md)).

---

## 4. Transpiling (`neb-pipeline`)

```bash
neb-pipeline app.nbs            # default target (JS)
neb-pipeline app.nbs --js       # JavaScript
neb-pipeline app.nbs --py       # Python
neb-pipeline app.nbs --ir       # show the intermediate representation
neb-pipeline app.nbs --check    # run the semantic analyzer
```

Keyword mapping examples:

| Nebulara | JS | Python |
|----------|----|--------|
| `PRINT x` | `console.log(x)` | `print(x)` |
| `LET a = x` | `let a = x` | `a = x` |
| `FUNC! f(): ... END!` | `function f() {...}` | `def f(): ...` |
| `IF? c: ... END!` | `if (c) {...}` | `if c: ...` |

Interpreter-only builtins (`READ_FILE`, etc.) need a **runtime shim** on the
target platform.

---

## 5. Semantic analysis (`neb-semantic` / `--check`)

Runs through `neb-pipeline --check`. Reports **static** problems:

- Undefined variables / unknown names.
- Scope-based type mismatches.
- Builtin **arity** errors (wrong number of args).

Static only — does **not** catch runtime nulls, empty `POP`, or infinite
loops. Use it as the first gate before running:
```bash
neb-pipeline app.nbs --check && nebulara app.nbs
```

---

## 6. FFI (`neb-ffi`)

Called from Nebulara via builtins (see User Manual §8.8):

```nbs
LET lib = FFI_LOAD("msvcrt")
LET power = FFI_REGISTER(lib, "pow", "dd->d")
PRINT FFI_CALL(power, 2.0, 10.0)     # 1024.0
```

**Signature grammar:** `<in-types>-><ret>` where letters map to C types:
`i` int, `d` double, `c` char, `s` char*, `v` void.

**Platform:** library names differ — `msvcrt` (Windows), `libm.so` (Linux),
`libm.dylib` (macOS). Exact ABI signatures are required.

---

## 7. Knowledge graph (`neb-knowledge`)

```bash
neb-knowledge build .
```
Parses a project into **entities and relationships** — a machine-readable
graph of functions, variables, and their links. Purpose-built for AI tooling:
question-answering ("what calls `sum`?"), impact analysis, and automated
documentation.

The roadmap includes a deeper semantic mapping `[planned]`; the node-walking
builder is the core that runs today.

---

## 8. Native codegen (`neb-codegen`)

```bash
neb-codegen file.nbs
```
Emits host **x86/x64 machine code** — no interpreter loop at runtime. This is
the performance end of the spectrum:

```
source → bytecode (VM, portable/safe) → JS/Python (reach) → native (fastest)
```
The most complex tool — keep source portable so you can fall back to the
interpreter/transpiler.

---

## 9. The wrappers (multi-language packaging)

The same C core is packaged across ecosystems:
- **npm** — `nebulara` (also hosts the package manager).
- **pip** — Python `nebulara`.
- **cargo** / **go modules** — `src/main.rs`, `cmd/neb/main.go`.

Each wrapper builds (or locates) the C interpreter and forwards to it.

---

## 10. Package manager (`neb`)

Lives in the npm wrapper, not the C core:

```bash
neb init                     # create neb.json
neb install [pkg]            # install deps
neb uninstall <pkg>          # remove a dep
neb search <query>           # search registries
neb publish <file.nbpkg>     # publish
neb list                     # list installed
```

**Multi-registry** via prefixes:
```bash
neb install npm/left-pad
neb install pip/requests
neb install crates.io/serde
neb install go/github.com/...
neb search --registry npm foo
```
Requires network and the `neb` npm tool; separate from the offline C binaries.
Registry owner/repo/token are configured via environment variables.

---

## 11. Building from source

```bash
gcc -static -O2 Compiler/nbs-bootstrap.c -o nebulara -lm
```
The `Makefile` (and `build.bat` on Windows) build all six tools. Source layout
notes:
- `Compiler/nbs-bootstrap.c` — the `nebulara` interpreter (value model + VM + builtins).
- `Compiler/nbs_cli.c` — `neb-cli`.
- `Compiler/neb-pipeline.c`, `neb-ir.c`, `neb-semantic.c` — pipeline.
- `Compiler/neb-knowledge.c` — knowledge graph.
- `Compiler/neb-ffi.c` — FFI demos.
- `Compiler/neb-codegen.c` — native codegen + VM codegen.
- `Compiler/compiler.nbs`, `Grammar/*.nbs` — self-hosted compiler parts.

---

## 12. Workflow summary

| Task | Command |
|------|---------|
| Read a file's types | `neb-pipeline f.nbs --check` |
| Just run | `nebulara f.nbs` |
| Interactive explore | `neb-cli repl` |
| Speed | `neb-codegen f.nbs` |
| Browser/Python | `neb-pipeline f.nbs --js` / `--py` |
| Package | `neb publish / install` |

---

## Revisions
- v1.0 — consolidated the toolchain reference across all six tools + wrappers.
