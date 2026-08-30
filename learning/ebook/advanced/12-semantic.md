# Chapter 12 — The Semantic Analyzer

> Book: *Beyond the Bases* · Part IV — Inside the Engine

The **semantic analyzer** (`neb-semantic`) is a static checker: it examines a
program *without running it* and catches a class of mistakes before they reach
the VM.

---

## What "static analysis" means

Static analysis reads the code and reasons about it — like a very careful
proofreader — rather than executing it. It can catch problems that only show
up at runtime if you're unlucky.

---

## Running it

Through the pipeline:

```bash
neb-pipeline file.nbs --check
```

This runs the analyzer and reports problems, then stops (it doesn't run the
program). Use it as your **cheap first gate** in the workflow:

```bash
neb-pipeline file.nbs --check    # static: catch problems now
nebulara file.nbs                # runtime: actually run it
```

---

## What it checks

1. **Scope-based type checking** — whether a variable/expression is used
   consistently given its type across the program.

2. **Undefined variable detection** — a variable used before it was declared
   (or an unknown name) is flagged.

3. **Builtin arity checks** — calling a builtin with the wrong number of
   arguments (e.g. `LEN()` with none, or `PRINT(a, b)`) is caught.

4. It returns/infers a **type** for expressions, which is how the mismatches
   are detected.

These are exactly the errors you'd otherwise discover by running — the analyzer
moves them earlier in the loop.

---

## What it can't do

- It's **static** — no runtime knowledge. A `READ_FILE` that returns `NULL`,
  an empty-array `POP`, or an infinite loop won't be caught. You still guard
  those at runtime (Chapter 3).
- Its coverage is bounded by what it implements. An "all clear" is a helpful
  signal, **not a proof** of correctness.
- It doesn't execute — so behavior is only reasoned about, not observed.

---

## How it fits the toolchain

`neb-semantic` (and `--check`) sit between parsing and codegen. In the
"universal" pipeline it's valuable precisely because you can validate *before*
committing to a target (JS/Python/native). The same AST the compiler walks is
what the analyzer inspects.

---

## The v4 direction

The roadmap extends semantic checking to catch **closure capture mistakes** —
e.g., a captured variable mutated after a function factory returns. That's a
subtle, experience-only bug that a static analyzer is well-placed to catch,
and a great illustration of why semantic analysis earns its keep.

---

## Summary

- Static = checks without running.
- `neb-pipeline --check` runs the analyzer.
- Catches: scope/type mismatches, undefined variables, builtin arity.
- Can't catch runtime nulls/empty-array/infinite-loops — guard those.
- "All clear" ≠ proof; use it as a first gate, not a guarantee.

**Next:** [Chapter 13 — The Knowledge Graph](13-knowledge.md)
