# Advanced 07 — Semantic Analysis

`neb-semantic` is a **static analyzer**: it checks a Nebulara program for
problems **without running it**. This catches whole classes of bugs before you
execute.

---

## What it checks

- **Scope-based type checking** — does each variable/expression have a
  consistent type given its use?
- **Undefined variable detection** — are you using a name that was never
  declared?
- **Builtin arity checks** — are you calling builtins with the right number of
  arguments? (e.g. `LEN` expects 1, `PRINT` expects 1.)
- Returns a type for expressions so mismatches surface as errors.

---

## Running it

The semantic analyzer is compiled into the pipeline tool:
```bash
neb-pipeline file.nbs --check
```
This reports semantic problems and stops without running the program.

(There's also a standalone `neb-semantic` component conceptually; the `--check`
path on `neb-pipeline` is the way to exercise it from the shipped binaries.)

---

## What it does NOT do

- It is **static** — it can't detect runtime issues like `READ_FILE` returning
  `NULL`, integer overflow, or infinite loops. You still guard those at
  runtime (see the Course's Lesson 08/09).
- Coverage is tied to what the analyzer implements. Treat its "all clear" as a
  helpful signal, not a proof of correctness.

---

## How it fits

Scan this in your workflow as the "cheap first gate":
```
1. Write file.nbs
2. neb-pipeline file.nbs --check      # static: types, undefined vars, arity
3. nebulara file.nbs                  # runtime: actually run it
```

The v4 direction (per the spec) extends checking to flag **closure capture
mistakes** (a captured variable mutated after the function factory returns).
That's a great illustration of what a semantic analyzer can teach you about
your code before it bites at runtime.
