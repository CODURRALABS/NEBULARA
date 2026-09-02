# Chapter 14 — v4 Features & Doc Drift

> Book: *Beyond the Bases* · Part V — The Road Ahead

This chapter saves you the most pain: understanding that Nebulara's
**documentation is kept aligned with the current source**, but **shipped
binaries lag behind**. Here's the complete map.

---

## The three layers of truth

| Layer | What it is | Status |
|-------|------------|--------|
| **Current source** | `nbs-bootstrap.c` etc. | authoritative — build this for the full feature set |
| **Docs / spec** | `README.md`, `SPEC.md`, `learning/` | now aligned with the source |
| **Shipped binaries** | `Compiler/*.exe`, `build/` | lag behind — rebuild from source |

Rebuilding `Compiler/nbs-bootstrap.c` gives you everything the docs describe
today. If you rely on an old shipped `.exe`, prefer the code over those results.

---

## Confirmed working (build on these)

Language:
- `LET`, `CONST`, `FUNC!`/`END!`, `IF?`/`ELSEIF?`/`ELSE`,
  `WHILE?`, `FOR!`/`TO`/`STEP`, `RETURN`, `BREAK`, `CONTINUE`.
- `TRUE`, `FALSE`, `NULL`; `AND`/`OR`/`NOT`; arrays + indexing.
- Operators: `+ - * / %`, comparison, bitwise `& | << >>`.
- Exceptions: `TRY!`/`CATCH!`/`FINALLY!`/`ENDTRY!`/`THROW`.
- Modules: `IMPORT "file.nbs"`.

Builtins (verified):
```
PRINT LEN TYPEOF TO_STRING TO_NUMBER RANDOM TIME SLEEP
TO_UPPER TO_LOWER CHAR_AT SUBSTR TRIM CHAR ORD
ABS MIN MAX SQRT POW FLOOR CEIL ROUND
PUSH POP READ_FILE WRITE_FILE
ARGUMENT_COUNT ARGUMENT
FFI_LOAD FFI_REGISTER FFI_CALL
```

Concurrency (VM): `GO!`/`CHAN!`/`SEND!`/`RECV!`/`SELECT!`/`MUTEX!`/
`LOCK!`/`UNLOCK!`/`YIELD!`/`SLEEP!` (cooperative, single-threaded).

---

## Documented (spec) but not yet in the language

| Feature | Where it's promised |
|---------|---------------------|
| **Float** type & float arithmetic | v4 spec |
| **Map** type `{"k": v}` | v4 spec |
| **Closures** / first-class functions | v4 spec |
| **`USE`** keyword | v4 spec (`IMPORT` is implemented; `USE` is not) |
| **`WAIT!`** wait groups | v4 spec (tokens/opcodes exist, no parser) |
| Concurrency in native codegen | native builds (GC, AST, B codegen) — VM-only today |
| JSON `DATA!`/`RUN!` parsing | tokens defined, parser not implemented |
| Decompilation of `.nbsc` | PRIMORDIA project |

---

## Why the drift happens

Nebulara is a staged **bootstrap**. The self-hosted toolchain (`.nbs` files:
`compiler.nbs`, `Grammar/*.nbs`) and the C source implement the current
feature set; **shipped executables lag behind** until rebuilt. Rebuild from
source to get the docs' behavior.

---

## The practical policy (your operating manual)

1. **Prefer verified features** — the confirmed list above.
2. **Guard errors** with `IF?` sentinel checks where builtins return
   `0`/`NULL`/`FALSE`; use `TRY!`/`CATCH!` for jump-out exception handling.
3. **Probe before you trust** — run a tiny test file for any feature marked
   spec'd. It takes seconds and tells you the truth:
   ```nbs
   # probe.nbs
   TRY!
       PRINT "hi"
   CATCH! e:
       PRINT "caught"
   ENDTRY!
   ```
   If it errors at parse → your build is older than the source → rebuild
   `nbs-bootstrap.c`.
4. **Pin your binary.** Rebuilt from source? Then you have everything.
   Relying on `build/nebulara.exe` (older)? Know what it lacks.

---

## The v4 feature preview

When floats, maps, and closures land, this is roughly the shape to expect:

```nbs
# v4 preview - closures
FUNC! make_adder(n):
    RETURN FUNC! (x):
        RETURN x + n
    END!
END!

# v4 preview - maps
LET cfg = { "name": "app", "retries": 3 }
PRINT cfg["name"]
```

Don't build production on these until you've probed and confirmed them in your
build.

---

## Summary

- The **source** is the authoritative implementation; docs are aligned with it.
- Old shipped binaries lag — **rebuild from source** to get the full feature set.
- Exceptions (`TRY!`/`CATCH!`/`THROW`), `IMPORT`, `SLEEP`, args builtins, and
  concurrency are implemented today.
- Floats, maps, closures, `USE`, `WAIT!`, JSON `DATA!`, and native-codegen
  concurrency are still on the roadmap — verify before building on them.
- Pin and document which interpreter you're using.

*End of Beyond the Bases. Your next stops: the Cookbook for recipes, the
Manuals for reference, and the Guides for setup/getting-things-done.*
