# Advanced 09 — Doc Drift: What's Real vs. Planned

This guide maps what is actually implemented against what's still planned, so
you never get surprised. Build the current source (`Compiler/nbs-bootstrap.c`)
to get the full feature set described here.

---

## The three layers of truth

1. **Shipped binaries** (`build/`, `Compiler/*.exe`) — lag behind the source.
2. **Current source** (`Compiler/nbs-bootstrap.c`, `*.c`) — the authoritative
   implementation; rebuild it to get everything below.
3. **Docs / spec** (`README.md`, `SPEC.md`, `*.md`) — now aligned with the
   source; parts still describe v4 features.

---

## What's confirmed working (verified)

Run these freely with the current source build:

- Language: `LET`/`CONST`, `FUNC!`/`END!`, `IF?`/`ELSEIF?`/`ELSE`,
  `WHILE?`, `FOR!`/`TO`/`STEP`, `RETURN`, `BREAK`, `CONTINUE`,
  `TRUE`/`FALSE`/`NULL`, `AND`/`OR`/`NOT`, arrays with indexing,
  string `+` concatenation, bitwise `& | << >>`, exception handling
  (`TRY!`/`CATCH!`/`FINALLY!`/`ENDTRY!`/`THROW`), `IMPORT`.
- Builtins: `PRINT, LEN, TYPEOF, TO_STRING, TO_NUMBER, RANDOM, TIME, SLEEP,
  ARGUMENT_COUNT, ARGUMENT, TO_UPPER, TO_LOWER, CHAR_AT, SUBSTR, TRIM, CHAR,
  ORD, ABS, MIN, MAX, SQRT, POW, FLOOR, CEIL, ROUND, PUSH, POP, READ_FILE,
  WRITE_FILE`.
- FFI: `FFI_LOAD`, `FFI_REGISTER`, `FFI_CALL`.
- Concurrency (VM): `GO!`, `CHAN!`, `SEND!`, `RECV!`, `SELECT!`, `MUTEX!`,
  `LOCK!`, `UNLOCK!`, `YIELD!`, `SLEEP!`.

> **Rebuild note:** shipped `.exe` binaries may not expose `SLEEP`,
> `ARGUMENT_COUNT`, `ARGUMENT`, or exceptions yet. Rebuild
> `nbs-bootstrap.c` (or use the self-hosted `compiler.nbs`) to get the
> current behavior.

### Not yet built (planned)
| Feature | Where |
|---------|-------|
| Float type, float arithmetic | v4 spec (`SPEC.md`) |
| Map type `{"k": v}` | v4 spec |
| Closures / first-class functions | v4 spec |
| Round-trip decompilation of `.nbsc` | PRIMORDIA project |

---

## Why this happens

The project is a staged bootstrap. The **self-hosted** toolchain (`.nbs` files:
`Compiler/compiler.nbs`, `Grammar/*.nbs`) and the C source are written toward
the v4 feature set, while the **packaged executables** lag behind. The docs
describe the target, not always the current binary.

---

## A practical policy for writing Nebulara code

1. **Prefer verified features** from the "confirmed working" list above.
2. **Guard errors** with `IF?` checks (builtins return `0`/`NULL`/`FALSE`).
3. **Rebuild or use the newest build** to access the full current feature set;
   if you must use an older `.exe`, test features against it before relying on
   them.
4. **Pin your binary.** Note which `nebulara` you're using; behaviors differ
   between builds until you rebuild from source.

This policy keeps your scripts working across builds and makes upgrades smooth.
The [learning README](../README.md) and handbook embed the same guidance.
