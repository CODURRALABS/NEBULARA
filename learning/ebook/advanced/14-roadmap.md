# Chapter 14 — v4 Features & Doc Drift

> Book: *Beyond the Bases* · Part V — The Road Ahead

This is the chapter that saves you the most pain: understanding that Nebulara's
**documentation describes a richer language than the shipped binaries
implement**. Here's the complete map.

---

## The three layers of truth

| Layer | What it is | Status |
|-------|------------|--------|
| **Shipped binaries** | `Compiler/*.exe`, `build/` | what runs today |
| **Current source** | `nbs-bootstrap.c` etc. | richer than binaries — new builtins/keywords unwired |
| **Docs / spec** | `README.md`, `SPEC.md`, PRIMORDIA v4 | most aspirational |

The v4 spec and the PRIMORDIA project describe a fantasy-ward forward state.
Always resolve downward: **binary > source > docs.**

---

## Confirmed working (build on these)

Language:
- `LET`, `CONST`, `FUNC!`/`END!`, `IF?`/`ELSEIF?`/`ELSE`,
  `WHILE?`, `FOR!`/`TO`/`STEP`, `RETURN`, `BREAK`, `CONTINUE`.
- `TRUE`, `FALSE`, `NULL`; `AND`/`OR`/`NOT`; arrays + indexing.
- Operators: `+ - * / %`, comparison, bitwise `& | << >>`.

Builtins (verified):
```
PRINT LEN TYPEOF TO_STRING TO_NUMBER RANDOM TIME
TO_UPPER TO_LOWER CHAR_AT SUBSTR TRIM CHAR ORD
ABS MIN MAX SQRT POW FLOOR CEIL ROUND
PUSH POP READ_FILE WRITE_FILE
FFI_LOAD FFI_REGISTER FFI_CALL
```

---

## In source but NOT in shipped binaries

| Feature | Symptom if you try it |
|---------|----------------------|
| `SLEEP(ms)` | undefined-function runtime error |
| `ARGUMENT_COUNT()` / `ARGUMENT(i)` | undefined-function runtime error |
| `TRY` / `CATCH` / `THROW` / `FINALLY` | **parse error** |

Even though these are in `nbs-bootstrap.c`, the built executables don't wire
them in. Don't write code that depends on them.

---

## Documented (spec) but not yet in the language

| Feature | Where it's promised |
|---------|---------------------|
| **Float** type & float arithmetic | v4 spec |
| **Map** type `{"k": v}` | v4 spec |
| **Closures** / first-class functions | v4 spec |
| **`USE`** modules / **`IMPORT`** | v4 spec |
| Decompilation of `.nbsc` | PRIMORDIA project |

---

## Why the drift happens

Nebulara is a staged **bootstrap**. The self-hosted toolchain (`.nbs` files:
`compiler.nbs`, `Grammar/*.nbs`) and the C source are written *toward* the v4
feature set, while the packaged executables **lag behind**. The docs describe
the target, not always the current binary.

---

## The practical policy (your operating manual)

1. **Prefer verified features** — the confirmed list above.
2. **Guard errors** with `IF?` sentinel checks instead of exceptions.
3. **Probe before you trust** — run a tiny test file for any feature marked
   spec'd. It takes seconds and tells you the truth:
   ```nbs
   # probe.nbs
   TRY:
       PRINT "hi"
   CATCH e:
       PRINT "caught"
   END!
   ```
   If it errors at parse → not in your build → guard instead.
4. **Pin your binary.** `Compiler/nebulara.exe` (newest) differs from
   `build/nebulara.exe` (older). Know which you're on.

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

# v4 preview - real control
TRY:
    LET f = READ_FILE("x.txt")
    IF? NOT f:
        THROW "missing"
    END!
CATCH e:
    PRINT "caught: " + e
FINALLY:
    PRINT "done"
END!
```

Don't build production on these until you've probed and confirmed them in your
binary.

---

## Summary

- Docs > source > binaries; the docs are ahead of what runs.
- Verify features with tiny probes against your actual executable.
- Prefer the verified builtin/keyword list.
- Guards (`IF?`) work today; exceptions and closures are tomorrow's tools.
- Pin and document which interpreter you're using.

*End of Beyond the Bases. Your next stops: the Cookbook for recipes, the
Manuals for reference, and the Guides for setup/getting-things-done.*
