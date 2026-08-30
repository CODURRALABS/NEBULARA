# Nebulara — Advanced Guides

For developers who want to understand the **machine under the hood**: how a
`.nbs` file becomes running code, how to call C, how to transpile, and how
the AI-native knowledge graph works.

These guides are informed by reading the actual source
(`Compiler/nbs-bootstrap.c`, `Compiler/neb-pipeline.c`,
`Compiler/neb-knowledge.c`, etc.) and by testing the shipped binaries.

## Contents
1. [How a program runs (the pipeline)](01-pipeline.md)
2. [The bytecode VM](02-vm.md)
3. [The interpreter internals](03-interpreter.md)
4. [Transpiling to JS / Python](04-transpiler.md)
5. [FFI — calling C](06-ffi.md)
6. [Knowledge graph & AI-native features](05-knowledge-graph.md)
7. [Semantic analysis](07-semantic.md)
8. [Package manager & toolchain](08-toolchain.md)
9. [Doc drift: what's real vs. planned](09-doc-drift.md)

---

## Where the engine lives

| File | Role |
|------|------|
| `Compiler/nbs-bootstrap.c` | Self-hosted interpreter core (lexer, parser, compiler, VM, builtins, FFI) |
| `Compiler/nbs_cli.c` | `neb-cli` — CLI/REPL/bytecode build |
| `Compiler/neb-pipeline.c` | `neb-pipeline` — JS/Python transpiler + semantic check + IR |
| `Compiler/neb-ir.c` | IR node model |
| `Compiler/neb-semantic.c` | `neb-semantic` — type checker |
| `Compiler/neb-codegen.c` | `neb-codegen` — native x86/x64 encoder |
| `Compiler/neb-ffi.c` | `neb-ffi` — FFI demo |
| `Compiler/neb-knowledge.c` | `neb-knowledge` — knowledge graph |
| `Grammar/*.nbs`, `Compiler/*.nbs` | The language described/written in itself (self-hosting) |

Start with **[01 — How a program runs](01-pipeline.md)**.
