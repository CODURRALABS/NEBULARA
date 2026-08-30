# Nebulara — CLI Cheat Sheet

There are **four** real binaries in this repo (see `build/` on Windows,
or `bin:/build` elsewhere). Learn which to reach for.

## 1. Interpreter
```bash
nebulara file.nbs          # run a .nbs file  <- the one you'll use most
nebulara path/to/app.nbs
```
Takes a single file argument. Runs lexer → parser → compiler → VM.

## 2. CLI (neb-cli)
```bash
neb-cli run file.nbs       # execute a .nbs file
neb-cli build file.nbs     # compile to .nbsc bytecode
neb-cli repl               # interactive REPL
neb-cli version            # show version
neb-cli help               # help
neb-cli highlight file.nbs # syntax highlight a file
```

## 3. Pipeline / transpiler (neb-pipeline)
```bash
neb-pipeline file.nbs --target js    # transpile to JavaScript
neb-pipeline file.nbs --target py    # transpile to Python
neb-pipeline file.nbs --target ir    # show IR
neb-pipeline file.nbs --check        # semantic check (no run)
```
Default target is `js` if `--target` omitted.

## 4. Knowledge graph (neb-knowledge)
```bash
neb-knowledge            # extract entities/relations (AI-native feature)
```

## 5. FFI demo (neb-ffi)
```bash
neb-ffi <lib> <symbol> [args...]      # call a C function e.g. msvcrt abs -42
```

---

## Node.js `neb` wrapper (if built)
The npm package's `bin/neb.js` wraps the native binary and adds:
```bash
neb run file.nbs
neb check file.nbs          # semantic check
neb transpile file.nbs --target js|py
neb ast file.nbs            # print AST
neb repl                    # interactive
neb build file.nbs          # native
neb init / install / publish / search / list   # package manager
```
> The package manager (`neb install` etc.) talks to npm/pip/crates.io/go/maven
> registries. It requires the Node.js wrapper to be installed and configured.

---

## Common patterns
```bash
# Run a script
nebulara hello.nbs

# Run with arguments (ARGUMENT_COUNT / ARGUMENT)
nebulara app.nbs one two three

# Transpile to JavaScript to inspect it
neb-pipeline app.nbs --target js

# Check for semantic errors without running
neb-pipeline app.nbs --check

# Interactive exploration
neb-cli repl
```

---

## Environment
- `NEB_STDLIB` — path to the standard library directory (set by the Python CLI
  wrapper automatically).
- `PATH` — where `nebulara.exe` / `neb` must be reachable.

## Gotchas
- The bare `nebulara.exe` **does not** accept `--target`, `--check`, or `--ast`
  flags (this repo's build is the minimal interpreter). Use `neb-pipeline` for
  transpile/check, or the `neb` wrapper if you need the full command set.
- `neb-cli build` emits bytecode (`.nbsc`) — that's compile-to-bytecode, not a
  native executable in this build.
