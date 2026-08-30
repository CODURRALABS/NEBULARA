# Chapter 4 — The Six Tools

> Book: *Beyond the Bases* · Part II — The Toolchain

The Nebulara repo compiles into a family of **six** executables, each with a
distinct role. This chapter maps them.

---

## The six binaries

| Tool | File | What it does |
|------|------|--------------|
| **Interpreter** | `nebulara` | Runs `.nbs` source directly |
| **CLI** | `neb-cli` | Higher-level: run, build bytecode, repl, highlight, version |
| **Pipeline** | `neb-pipeline` | Transpiles to JS/Python; `--check`; `--ir` |
| **Knowledge** | `neb-knowledge` | Builds a knowledge graph from code (AI-native) |
| **Semantic** | `neb-semantic` | Static analysis (types, undefined vars, builtin arity) |
| **Code Gen** | `neb-codegen` | Generates native x86/x64 code |

The FFI subsystem (`neb-ffi`) is part of the interpreter, not a standalone
binary in the same sense — it's the mechanism `FFI_CALL` uses.

---

## The interpreter vs. the CLI

- The **interpreter** is the raw runner: `nebulara file.nbs`.
- The **CLI** layers friendly commands on top (`run`, `build`, `repl`).

Using `neb-cli`:
```bash
neb-cli run file.nbs       # run a program
neb-cli build file.nbs     # compile to bytecode (.nbsc)
neb-cli repl               # interactive shell
neb-cli highlight file.nbs # syntax highlighting
neb-cli version
neb-cli help
```

---

## The pipeline tool

`neb-pipeline` is the multi-target compiler:

```bash
neb-pipeline file.nbs            # default target (JS)
neb-pipeline file.nbs --js       # JavaScript
neb-pipeline file.nbs --py       # Python
neb-pipeline file.nbs --ir       # show the intermediate representation
neb-pipeline file.nbs --check    # run the semantic analyzer
```

This is how Nebulara reaches "universal" — one source, many runtimes.

---

## The semantic analyzer

Static analysis catches problems without running:

```bash
neb-pipeline file.nbs --check
```

It checks scopes, undefined variables, and builtin arity (right number of
arguments). See Chapter 12.

---

## The knowledge graph

`neb-knowledge` parses a project into a graph of entities and relationships:

```bash
neb-knowledge build .
```

This is the AI-native piece: machine-readable structure an LLM or a tool can
query (Chapter 13).

---

## Native code generation

`neb-codegen` compiles to machine code for the host CPU (x86/x64):

```bash
neb-codegen file.nbs
```

This is the performance path — no interpreter loop at runtime (Chapter 9).

---

## Building them all

Everything is C compiled with gcc:
```bash
gcc -static -O2 Compiler/nbs-bootstrap.c -o nebulara -lm
```
The `Makefile` (and `build.bat` on Windows) builds all six. See the Guide to
Building for details.

---

## Choosing a tool

| You want to... | Use |
|----------------|-----|
| Just run a script | `nebulara file.nbs` |
| Introspect/build/repl | `neb-cli` |
| Port to JS/Python or check types | `neb-pipeline` |
| Analyze structure for AI | `neb-knowledge` |
| Deploy native | `neb-codegen` |

---

## Summary

- Six tools: interpreter, CLI, pipeline, knowledge, semantic, codegen.
- `neb-pipeline` is the universal compiler (JS/Python/IR/check).
- Build everything from C with gcc/`Makefile`.

**Next:** [Chapter 5 — The Command-Line Interface](05-cli.md)
