# Chapter 14 — Where to Go Next

> Book: *Nebulara From Zero* · Part IV — Moving Forward

You've made it through the foundations: values, variables, math, strings,
arrays, decisions, loops, functions, error guarding, and files. Here's the map
of what's next and how the rest of this learning library fits together.

---

## What you can do now

- Write structured `.nbs` programs with functions and loops.
- Work with ints, strings, bools, null, and arrays.
- Read and write files with guarding.
- Decompose problems into small, reusable functions.
- Probe the interpreter to confirm features before relying on them.

That's the full core of the language. Everything from here is breadth and depth.

---

## The Nebulara learning library

This repo's `learning/` folder is organized so you can go deeper:

| Section | What it's for |
|---------|---------------|
| `cheat-sheets/` | Quick lookups: syntax, builtins, CLI, stdlib |
| `course/` | Fast, exercise-driven lessons |
| `handbook/` | Authoritative reference (types, keywords, builtins) |
| `advanced/` | How the engine works: lexer, VM, FFI, transpiler, toolchain |
| **this e-book** | *From Zero* — the reading companion you're in |
| `ebook/advanced/` | *Beyond the Bases* — the intermediate/advanced book |
| `cookbook/` | Task-based recipes (do X in Nebulara) |
| `guides/` | Setup, REPL, modules, troubleshooting, IDE |
| `manuals/` | User manual, toolchain manual, stdlib manual |

---

## Recommended path

1. **If you want practice** → work the [Course](../../course/README.md) lessons.
2. **If you need a reference** → the [Handbook](../../handbook/README.md).
3. **When you're comfortable** → open [*Beyond the Bases*](../advanced/README.md)
   (Book 2) for functions-in-depth, the toolchain, FFI, and the internals.
4. **For specific tasks** → browse the [Cookbook](../../cookbook/README.md).
5. **To port/compile/go universal** → the [Guides](../../guides/README.md) on the
   transpiler, toolchain, and package manager.

---

## Three habits to carry forward

1. **Probe uncertain features.** Run a tiny test file before building on any
   builtin or keyword (Chapters 1 & 11). Docs drift — the binary is truth.
2. **Guard everything.** `IF?` before you use a potentially-null result.
3. **Compose small functions.** Reusable, testable, and readable beats long
   scripts.

---

## Suggested mini-projects to keep momentum

- A **temperature converter** (Celsius ⇄ Fahrenheit, integer).
- A **word counter** that reads a file and reports its length.
- A **high-score tracker** that keeps the max score in a file across runs.
- A **"guess the number"** game using `RANDOM()` and input from a file.
- A **fizzbuzz** using `FOR!` and `%`.

Each uses only what you've learned, plus one small new idea. Pick one and
finish it — finishing beats starting.

---

## The bigger picture: Nebulara's ambition

You've learned the portable core. Nebulara also ships tooling you'll grow into:
a **transpiler** to JavaScript/Python, an **FFI** to call C libraries, a
**package manager** spanning ecosystems (npm, pip, cargo, go), a **knowledge
graph**, and **native code generation**. The advanced book and guides take you
there. You now have the foundation to use all of it with confidence.

**Welcome to Nebulara.** Build something.

---

*Book 1 — Nebulara From Zero · KEEP BUILDING. Continue with [Book 2 — Beyond the Bases](../advanced/README.md) when ready.*
