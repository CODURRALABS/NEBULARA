# Beyond the Bases

## An Intermediate-to-Advanced Guide to Nebulara Internals & Tooling

**Book 2 of the Nebulara Library** — for those past the fundamentals.

---

## About this book

*Beyond the Bases* is the companion to *Nebulara From Zero*. It assumes you
already write correct `.nbs` programs and now want to understand *how* the
language works under the hood, *use* its full toolchain, and *port or embed*
it. It's the written form of the ideas in the [advanced guides](../../advanced/README.md),
expanded into a connected narrative.

**Audience:** intermediate learners, curious developers, contributors, and
anyone porting or extending Nebulara.

---

## The honest stance

This book treats the **shipped binaries as truth**. Where docs describe
features the current executables don't implement (floats, maps, closures,
`TRY/CATCH/THROW`, arguments), we say so explicitly and teach the working
pattern instead. This is the single most valuable lesson in the whole library,
so we return to it often.

---

## How to follow along

- Download/build the interpreter (see Book 1, or `compiler/`).
- Use `Compiler/nebulara.exe` (newest) as your reference interpreter.
- For the toolchain chapters, build all six tools from `Makefile`/`build.bat`.
- For transpiler/FFI chapters, have the repo source open alongside.

---

## Table of contents

### Part I — Idiomatic Nebulara
- [Chapter 1 — Deep Dives into Functions](01-functions.md)
- [Chapter 2 — Advanced Data: stacking, slicing, and structures](02-data.md)
- [Chapter 3 — The Guard Paradigm Done Right](03-guards.md)

### Part II — The Toolchain
- [Chapter 4 — The Six Tools](04-tools.md)
- [Chapter 5 — The Command-Line Interface (neb-cli)](05-cli.md)
- [Chapter 6 — The Package Manager](06-package-manager.md)

### Part III — Going Universal
- [Chapter 7 — Transpiling to JavaScript & Python](07-transpiler.md)
- [Chapter 8 — Calling C with FFI](08-ffi.md)
- [Chapter 9 — Native Code Generation](09-native.md)

### Part IV — Inside the Engine
- [Chapter 10 — The Pipeline: lexer → parser → compiler → VM](10-pipeline.md)
- [Chapter 11 — The VM & Bytecode](11-vm.md)
- [Chapter 12 — The Semantic Analyzer](12-semantic.md)
- [Chapter 13 — The Knowledge Graph](13-knowledge.md)

### Part V — The Road Ahead
- [Chapter 14 — v4 Features & Doc Drift](14-roadmap.md)

---

## Principles of this book

1. **The binary is truth** — verify features, don't trust the docs blindly.
2. **Understand to extend** — the internals chapters prepare you to contribute.
3. **Reach portability** — transpiler, FFI, and package manager make Nebulara
   universal.
4. **Design for honesty** — learn the guard idiom, not the exception crutch.

Begin with **[Chapter 1 — Deep Dives into Functions](01-functions.md)**.
