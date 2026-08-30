# Guide: The Toolchain

A step-by-step tour of moving a Nebulara project through run → check →
transpile → analyze.

---

## Your tools

```
nebulara        run .nbs
neb-cli         run / build / repl / highlight
neb-pipeline    transpile (--js/--py), inspect (--ir), check (--check)
neb-knowledge   knowledge graph
neb-codegen     native code
```

Find binaries in the repo's `Compiler/` (or build from source). See the
[Toolchain Manual](../manuals/toolchain-manual.md) for details on each.

---

## Repeatable workflow

### 1. Run it
```bash
nebulara app.nbs
```

### 2. Check it statically (types, undefined vars, arity)
```bash
neb-pipeline app.nbs --check
```
Fix anything reported, then re-run.

### 3. Transpile (when you need another runtime)
```bash
neb-pipeline app.nbs --js      # app.js
neb-pipeline app.nbs --py      # app.py
```
Note: interpreter builtins like `READ_FILE` need a shim on the target.

### 4. Inspect the IR (debugging the compiler)
```bash
neb-pipeline app.nbs --ir
```

### 5. Analyze the structure (AI / documentation)
```bash
neb-knowledge build .
```

### 6. Compile native (performance)
```bash
neb-codegen app.nbs
```
Most complex tool; keep source portable so you can fall back.

---

## Building the tools from source

Everything is C + gcc:
```bash
gcc -static -O2 Compiler/nbs-bootstrap.c -o nebulara -lm
```
Use `make` (from `Makefile`) or `build.bat` (Windows) to build all six.

---

## The CLI commands (if you have `neb-cli`)

```bash
neb-cli run app.nbs
neb-cli build app.nbs       # -> app.nbsc (bytecode, not readable/decompilable)
neb-cli repl
neb-cli highlight app.nbs
neb-cli version
```

---

## Quick workflow table

| Goal | Command |
|------|---------|
| Just run | `nebulara app.nbs` |
| Catch type/scope/arity errors first | `neb-pipeline app.nbs --check` |
| Export to browser | `neb-pipeline app.nbs --js` |
| Export to Python | `neb-pipeline app.nbs --py` |
| Read the lowering | `neb-pipeline app.nbs --ir` |
| Map structure | `neb-knowledge build .` |
| Fastest on host | `neb-codegen app.nbs` |

---

## Advice

- Run `--check` **before** trusting runtime behavior.
- Transpile only once your program runs correctly under `nebulara`.
- Keep the source portable; the interpreter is always the source of truth for
  correctness.
