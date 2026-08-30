# Nebulara Learning Ecosystem

> Complete educational material for **Nebulara v1.2.0** — the AI-Native Universal
> Programming Language (.nbs).

Everything here is **verified against the real, working toolchain** (the
`nebulara` / `neb-cli` / `neb-pipeline` binaries). Where the shipped docs
(`README.md`, `SPEC.md`) describe features that the current binaries do not yet
implement, this material teaches what actually runs — and notes the
"documented but not yet built" items honestly.

---

## What's in the box

| Section | Path | What it gives you |
|---------|------|-------------------|
| **Cheat Sheets** | `cheat-sheets/` | One-page quick references: syntax, builtins, CLI, stdlib. Print them, pin them. |
| **Full Course** | `course/` | A structured beginner→intermediate course, lesson by lesson, with exercises. |
| **Handbook** | `handbook/` | The authoritative language reference: every keyword, operator, type, builtin. |
| **Advanced Guides** | `advanced/` | Internals: VM, bytecode, FFI, transpiler, semantic analyzer, knowledge graph, package manager, doc drift. |
| **E-Books** | `ebook/` | **Two long-form books** you can read end-to-end or convert to PDF/EPUB: **Book 1** *Nebulara From Zero* (beginner) and **Book 2** *Beyond the Bases* (advanced/intermediate). |
| **Cookbook** | `cookbook/` | Copy-paste recipes organized by task. |
| **Manuals** | `manuals/` | Reference-grade docs: User Manual, Toolchain Manual, Standard Library Manual. |
| **Guides** | `guides/` | Topic-focused walkthroughs (setup, REPL, modules, toolchain, troubleshooting, IDE). |

---

## How to work through it

### Fastest path — the 10-minute cheat sheet
1. [Syntax cheat sheet](cheat-sheets/syntax.md)
2. [Builtins cheat sheet](cheat-sheets/builtins.md)
3. [CLI cheat sheet](cheat-sheets/cli.md)

### Proper learning path — the course
Start at [Course 00 — Setup & Hello World](course/00-setup-and-hello.md) and go
in order. Each lesson builds on the last.

### Just want the answer to a task?
Open the [Cookbook](cookbook/README.md) and find your recipe.

### Want reference-grade documentation?
Open the [Manuals](manuals/README.md) — User, Toolchain, and Standard Library.

### Want to understand the machine under it all?
Read the [Advanced Guides](advanced/README.md).

### Reading as a book?
There are **two** books:
- New to programming? **[Book 1 — Nebulara From Zero](ebook/README.md)**:
  foundation-first, beginner friendly, 14 chapters.
- Past the fundamentals? **[Book 2 — Beyond the Bases](ebook/advanced/README.md)**:
  internals, toolchain, FFI, transpiler — the intermediate/advanced track.

Read either end-to-end, or in sequence chapter by chapter.

---

## Choosing a run target (important)

Nebulara ships several binaries. This matters when following examples:

| Binary | Purpose | Use for |
|--------|---------|---------|
| `Compiler/nebulara.exe` | **Newest** interpreter | `nebulara file.nbs` — prefer this one; matches the current source best. Confirmed: math/string/array/file builtins. |
| `build/nebulara.exe` | Older interpreter build | Same core, but a subset of the source's builtins. |
| `neb-cli.exe` | CLI | `run`, `build` (bytecode), `repl`, `version`, `help`, `highlight` |
| `neb-pipeline.exe` | Transpiler | `.nbs -> JS/Python`, plus `--check` and `--ir` |
| `neb-knowledge.exe` | Knowledge graph | AI-native entity/relation extraction |
| `neb-ffi.exe` | FFI demo | Call C functions (`msvcrt` etc.) |

Most tutorial examples run with the newest interpreter:
```bash
Compiler\nebulara myfile.nbs     # Windows
# or, wherever the binary is on your PATH:
nebulara myfile.nbs
```

> **Note on doc drift (important):** This repo's shipped docs (`README.md`,
> `SPEC.md`) describe features — `SLEEP`, `ARGUMENT_COUNT`, `ARGUMENT`,
> `TRY`/`CATCH`/`THROW`, floats, maps, closures — that live in the current
> source (`Compiler/nbs-bootstrap.c`) but are **not yet wired into the built
> executables**. This material teaches the "documented" syntax where noted,
> but every *run-now* example is verified against real binaries. When a new
> build ships, the marked items start working.
>
> Verified-present runtime builtins (use these freely): `LEN, TYPEOF,
> TO_STRING, TO_NUMBER, RANDOM, TIME, TO_UPPER, TO_LOWER, CHAR_AT, SUBSTR,
> TRIM, CHAR, ORD, ABS, MIN, MAX, SQRT, POW, FLOOR, CEIL, ROUND, PUSH, POP,
> READ_FILE, WRITE_FILE` + FFI (`FFI_LOAD/FFI_REGISTER/FFI_CALL`).

---

## Conventions used in all material

- Code blocks are `nbs` blocks and are runnable. Save the file, then run it.
- `#` is a comment.
- When a recipe says "try it", assume the current directory is the repo root
  and you are on Windows with `build/` binaries, or on Linux/mac with the
  `neb` / `nebulara` command on your PATH.
- The standard library lives in `std/` and is loaded per-module (see the
  [modules guide](guides/modules.md)).

---

## License

Learning material is part of the Nebulara project. See the repository
`LICENSE` for terms.
