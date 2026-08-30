# Nebulara Manuals

The manuals are **reference-grade documents** for working with Nebulara. Unlike
the books (which teach) and the guide/cheat sheets (which are quick), these are
the documents you keep open while you work.

| Manual | What it covers |
|--------|----------------|
| [User Manual](user-manual.md) | Running programs, the CLI, types, core features, the verified builtin reference |
| [Toolchain Manual](toolchain-manual.md) | All six tools, bytecode `.nbsc`, transpiling, FFI, natives, build-from-source |
| [Standard Library Manual](stdlib-manual.md) | Every `std/*.nbs` module and its functions, with examples |

---

## How the manuals differ from other sections

| Section | Purpose |
|---------|---------|
| Cheat sheets | one-page lookups |
| Books (`ebook/`) | teach concepts in order |
| **Manuals** | complete, structured references you consult |
| Guides | step-by-step "how do I do X" walkthroughs |
| Cookbook | short task-based recipes |

---

## About accuracy

These manuals adhere to the library-wide policy: **the shipped binary is
truth.** Every builtin listed in the User Manual has been verified against the
current interpreter, and features that are spec-only are clearly marked so you
never build on vapor. Where a feature may depend on your build (stdlib modules,
advanced tooling), the manual says so and points to [Doc Drift](../advanced/09-doc-drift.md).

---

## Getting started quickly

- New to the language? Start with the [User Manual](user-manual.md).
- Want the module catalog? Go to the [Standard Library Manual](stdlib-manual.md).
- Writing/porting/embedding? Open the [Toolchain Manual](toolchain-manual.md).
